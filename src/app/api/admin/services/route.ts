// src/app/api/admin/services/route.ts
// Admin-only service management routes
// GET    — fetch all services including inactive
// POST   — create a new service
// PATCH  — update an existing service
// DELETE — soft delete (set active = false, never hard delete)

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import type { ServiceFormData } from "@/lib/supabase/types";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

// ── GET /api/admin/services ──

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .order("name",     { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data ?? [] },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/services ──

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body: ServiceFormData = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Service name is required." },
        { status: 400 }
      );
    }
    if (!body.category) {
      return NextResponse.json(
        { success: false, error: "Category is required." },
        { status: 400 }
      );
    }
    if (!body.duration || body.duration < 15) {
      return NextResponse.json(
        { success: false, error: "Duration must be at least 15 minutes." },
        { status: 400 }
      );
    }
    if (body.price < 0) {
      return NextResponse.json(
        { success: false, error: "Price must be a positive number." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("services")
      .insert({
        name:        body.name.trim(),
        category:    body.category,
        duration:    body.duration,
        price:       body.price,
        description: body.description?.trim() ?? null,
        active:      body.active ?? true,
      } as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── PATCH /api/admin/services ──

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body                      = await request.json();
    const { service_id, ...fields } = body;

    if (!service_id) {
      return NextResponse.json(
        { success: false, error: "service_id is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("services")
      .select("id")
      .eq("id", service_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Service not found." },
        { status: 404 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (fields.name        !== undefined) updatePayload.name        = fields.name.trim();
    if (fields.category    !== undefined) updatePayload.category    = fields.category;
    if (fields.duration    !== undefined) updatePayload.duration    = fields.duration;
    if (fields.price       !== undefined) updatePayload.price       = fields.price;
    if (fields.description !== undefined) updatePayload.description = fields.description?.trim() ?? null;
    if (fields.active      !== undefined) updatePayload.active      = fields.active;

    const { data, error } = await supabase
      .from("services")
      .update(updatePayload as never)
      .eq("id", service_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/services ──
// Soft-deletes a service by setting active = false.
// Historical booking references are preserved.
// The service disappears from the public booking flow immediately.

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const service_id        = searchParams.get("service_id");

    if (!service_id) {
      return NextResponse.json(
        { success: false, error: "service_id query param is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("services")
      .update({
        active:     false,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", service_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Service deactivated. Historical records are preserved.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
