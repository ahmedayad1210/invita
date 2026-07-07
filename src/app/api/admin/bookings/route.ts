// src/app/api/admin/bookings/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import { sendBookingConfirmed, sendBookingCancelled } from "@/lib/notifications/booking-notifications";
import { appendTimelineEvent } from "@/lib/patients/crm";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") ?? "200", 10);

    let query = supabase
      .from("bookings")
      .select(`
        *,
        service:services(id, name, category, duration, price, slug),
        stylist:stylists(id, name, specialties),
        profile:profiles!bookings_user_id_fkey(id, full_name, email, phone)
      `)
      .order("date", { ascending: false })
      .order("time_slot", { ascending: false })
      .limit(limit);

    if (status) query = query.eq("status", status);
    if (date) query = query.eq("date", date);

    const { data, error } = await query;

    if (error) {
      // Fallback without profile FK join name if migration differs
      const fallback = await supabase
        .from("bookings")
        .select(`
          *,
          service:services(id, name, category, duration, price, slug),
          stylist:stylists(id, name, specialties)
        `)
        .order("date", { ascending: false })
        .order("time_slot", { ascending: false })
        .limit(limit);

      if (fallback.error) {
        return NextResponse.json({ success: false, error: fallback.error.message }, { status: 500 });
      }

      const enriched = await Promise.all(
        (fallback.data ?? []).map(async (row) => {
          const b = row as Record<string, unknown> & { user_id: string };
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, email, phone")
            .eq("id", b.user_id)
            .maybeSingle();
          return { ...b, profile };
        })
      );

      return NextResponse.json({ success: true, data: enriched });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { booking_id, status } = body;

    if (!booking_id || !status) {
      return NextResponse.json(
        { success: false, error: "booking_id and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        service:services(name),
        stylist:stylists(name),
        profile:profiles!bookings_user_id_fkey(full_name, email, phone)
      `)
      .eq("id", booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    const current = existing as {
      id: string;
      status: string;
      user_id: string;
      patient_id: string | null;
      date: string;
      time_slot: string;
      guest_phone: string | null;
      guest_name: string | null;
      service: { name: string } | null;
      stylist: { name: string } | null;
      profile: { full_name: string; email: string; phone: string | null } | null;
    };

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() } as never)
      .eq("id", booking_id)
      .select(`
        *,
        service:services(id, name, category, duration, price, slug),
        stylist:stylists(id, name, specialties)
      `)
      .single();

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    const phone = current.guest_phone ?? current.profile?.phone;
    const name = current.guest_name ?? current.profile?.full_name ?? "Patient";
    const meta = {
      serviceName: current.service?.name ?? "IV session",
      practitionerName: current.stylist?.name ?? "Invita team",
      date: current.date,
      timeSlot: current.time_slot,
    };

    if (phone && status === "confirmed" && current.status !== "confirmed") {
      await sendBookingConfirmed(
        {
          userId: current.user_id,
          patientId: current.patient_id,
          bookingId: current.id,
          phone,
          name,
        },
        meta
      );

      if (current.patient_id) {
        await appendTimelineEvent({
          patientId: current.patient_id,
          eventType: "booking_confirmed",
          title: "Appointment confirmed",
          body: `${current.date} ${current.time_slot}`,
          referenceId: current.id,
        });
      }
    }

    if (phone && status === "cancelled" && current.status !== "cancelled") {
      await sendBookingCancelled(
        {
          userId: current.user_id,
          patientId: current.patient_id,
          bookingId: current.id,
          phone,
          name,
        },
        meta
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
