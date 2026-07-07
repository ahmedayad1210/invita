// src/app/api/bookings/route.ts
// POST  — create booking (authenticated or guest)
// PATCH — cancel or reschedule own booking

import { NextRequest, NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { provisionGuestSession } from "@/lib/auth/guest";
import { appendTimelineEvent, upsertPatient } from "@/lib/patients/crm";
import { sendBookingCancelled, sendBookingReceived } from "@/lib/notifications/booking-notifications";

async function resolveContact(userId: string, guestPhone?: string | null, guestName?: string | null) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  const p = profile as { full_name?: string; email?: string; phone?: string | null } | null;
  return {
    name: guestName ?? p?.full_name ?? "Patient",
    email: p?.email ?? null,
    phone: guestPhone ?? p?.phone ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_id,
      stylist_id,
      date,
      time_slot,
      notes,
      guest_name,
      guest_phone,
      guest_email,
      intake,
      add_ons,
      locale,
    } = body;

    if (!service_id || !stylist_id || !date || !time_slot) {
      return NextResponse.json(
        { success: false, error: "service_id, stylist_id, date, and time_slot are required." },
        { status: 400 }
      );
    }

    let user = await getCurrentUser();

    if (!user && guest_name && guest_phone) {
      const guest = await provisionGuestSession({
        name: guest_name,
        phone: guest_phone,
        email: guest_email,
        locale: locale === "ar" ? "ar" : "en",
      });

      if ("error" in guest) {
        return NextResponse.json(
          { success: false, error: "Could not start guest session. Please register or try again." },
          { status: 500 }
        );
      }

      user = { id: guest.userId } as Awaited<ReturnType<typeof getCurrentUser>>;
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Sign in or provide your name and phone to book as a guest.",
          code: "auth_or_guest_required",
        },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const contact = await resolveContact(user.id, guest_phone, guest_name);

    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("stylist_id", stylist_id)
      .eq("date", date)
      .eq("time_slot", time_slot)
      .neq("status", "cancelled")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This time slot has just been booked. Please select another time." },
        { status: 409 }
      );
    }

    const intakeNote = intake
      ? `[CLINICAL INTAKE]\n${JSON.stringify(intake, null, 2)}${notes ? `\n\n[NOTES]\n${notes}` : ""}`
      : notes ?? null;

    let patient: Awaited<ReturnType<typeof upsertPatient>> = null;
    if (contact.phone) {
      patient = await upsertPatient({
        userId: user.id,
        name: contact.name,
        phone: contact.phone,
        email: guest_email ?? contact.email,
        locale: locale === "ar" ? "ar" : "en",
      });
    }

    const insertPayload: Record<string, unknown> = {
      user_id: user.id,
      service_id,
      stylist_id,
      date,
      time_slot,
      status: "pending",
      notes: intakeNote,
      guest_name: guest_name ?? contact.name,
      guest_phone: guest_phone ?? contact.phone,
      guest_email: guest_email ?? contact.email,
      patient_id: patient?.id ?? null,
      location: "baghdad-studio",
      add_ons: Array.isArray(add_ons) ? add_ons : [],
    };

    if (intake) {
      insertPayload.intake_goals = intake.goals ?? null;
      insertPayload.intake_allergies = intake.allergies ?? null;
      insertPayload.intake_medications = intake.medications ?? null;
      insertPayload.intake_conditions = intake.conditions ?? null;
      insertPayload.intake_pregnant = Boolean(intake.pregnant);
    }

    let { data: booking, error } = await supabase
      .from("bookings")
      .insert(insertPayload as never)
      .select()
      .single();

    if (error && /intake_|column|patient_id|guest_|add_ons|location/.test(error.message)) {
      const fallbackPayload = { ...insertPayload };
      for (const key of [
        "intake_goals",
        "intake_allergies",
        "intake_medications",
        "intake_conditions",
        "intake_pregnant",
        "patient_id",
        "guest_phone",
        "guest_email",
        "add_ons",
        "location",
      ]) {
        delete fallbackPayload[key];
      }

      const retry = await supabase.from("bookings").insert(fallbackPayload as never).select().single();
      booking = retry.data;
      error = retry.error;
    }

    if (error || !booking) {
      return NextResponse.json({ success: false, error: error?.message ?? "Booking failed." }, { status: 500 });
    }

    const bookingRow = booking as { id: string };

    if (patient) {
      await appendTimelineEvent({
        patientId: patient.id,
        eventType: "booking_created",
        title: "Booking requested",
        body: `${date} ${time_slot}`,
        referenceId: bookingRow.id,
      });
    }

    const [{ data: service }, { data: stylist }] = await Promise.all([
      supabase.from("services").select("name").eq("id", service_id).maybeSingle(),
      supabase.from("stylists").select("name").eq("id", stylist_id).maybeSingle(),
    ]);

    if (contact.phone) {
      await sendBookingReceived(
        {
          userId: user.id,
          patientId: patient?.id,
          bookingId: bookingRow.id,
          phone: contact.phone,
          name: contact.name,
          locale: locale === "ar" ? "ar" : "en",
        },
        {
          serviceName: (service as { name?: string } | null)?.name ?? "IV session",
          practitionerName: (stylist as { name?: string } | null)?.name ?? "Invita team",
          date,
          timeSlot: time_slot,
        }
      );
    }

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "You must be logged in." }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, action, date, time_slot } = body;

    if (!booking_id) {
      return NextResponse.json({ success: false, error: "booking_id is required." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("*, service:services(name), stylist:stylists(name)")
      .eq("id", booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    const bookingData = existing as {
      id: string;
      status: string;
      user_id: string;
      stylist_id: string;
      date: string;
      time_slot: string;
      guest_phone: string | null;
      guest_name: string | null;
      patient_id: string | null;
      service: { name: string } | null;
      stylist: { name: string } | null;
    };

    if (bookingData.user_id !== user.id) {
      return NextResponse.json({ success: false, error: "Not authorised." }, { status: 403 });
    }

    if (action === "reschedule") {
      if (!date || !time_slot) {
        return NextResponse.json(
          { success: false, error: "date and time_slot are required to reschedule." },
          { status: 400 }
        );
      }

      if (bookingData.status === "cancelled") {
        return NextResponse.json({ success: false, error: "Cancelled bookings cannot be rescheduled." }, { status: 409 });
      }

      const { data: clash } = await supabase
        .from("bookings")
        .select("id")
        .eq("stylist_id", bookingData.stylist_id)
        .eq("date", date)
        .eq("time_slot", time_slot)
        .neq("status", "cancelled")
        .neq("id", booking_id)
        .maybeSingle();

      if (clash) {
        return NextResponse.json({ success: false, error: "That slot is no longer available." }, { status: 409 });
      }

      const { data: updated, error: updateError } = await supabase
        .from("bookings")
        .update({ date, time_slot, status: "pending" } as never)
        .eq("id", booking_id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    if (bookingData.status === "cancelled") {
      return NextResponse.json({ success: false, error: "Already cancelled." }, { status: 409 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled" } as never)
      .eq("id", booking_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    const contact = await resolveContact(user.id, bookingData.guest_phone, bookingData.guest_name);
    if (contact.phone) {
      await sendBookingCancelled(
        {
          userId: user.id,
          patientId: bookingData.patient_id,
          bookingId: bookingData.id,
          phone: contact.phone,
          name: contact.name,
        },
        {
          serviceName: bookingData.service?.name ?? "IV session",
          practitionerName: bookingData.stylist?.name ?? "Invita team",
          date: bookingData.date,
          timeSlot: bookingData.time_slot,
        }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
