// src/app/api/admin/bookings/route.ts
// Admin-only booking management routes
// GET  — fetch all bookings with joins
// PATCH — update booking status

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";

// Defence-in-depth: middleware already checked the cookie, but
// each route re-verifies to stay secure if middleware ever changes.
async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyAdminJWT(token);
  return payload !== null;
}

// ── GET /api/admin/bookings ──

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const supabase = await createAdminClient();

    const { searchParams } = new URL(request.url);
    const status            = searchParams.get("status");
    const date              = searchParams.get("date");
    const limit             = parseInt(searchParams.get("limit") ?? "200", 10);

    let query = supabase
      .from("bookings")
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .order("date",      { ascending: false })
      .order("time_slot", { ascending: false })
      .limit(limit);

    if (status) query = query.eq("status", status);
    if (date)   query = query.eq("date",   date);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── PATCH /api/admin/bookings ──

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body                    = await request.json();
    const { booking_id, status }  = body;

    if (!booking_id || !status) {
      return NextResponse.json(
        { success: false, error: "booking_id and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error:   `Invalid status. Must be one of: ${validStatuses.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("id", booking_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    const current = existing as { id: string; status: string };

    if (current.status === "cancelled" && status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "This booking is already cancelled." },
        { status: 409 }
      );
    }

    if (current.status === "confirmed" && status === "confirmed") {
      return NextResponse.json(
        { success: false, error: "This booking is already confirmed." },
        { status: 409 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() } as never)
      .eq("id", booking_id)
      .select(`
        *,
        service:services(id, name, category, duration, price),
        stylist:stylists(id, name, specialties)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
