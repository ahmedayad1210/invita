// src/app/api/admin/stylists/route.ts
// Admin-only stylist management routes
// GET    — fetch all stylists including inactive
// POST   — create a new stylist
// PATCH  — update an existing stylist
// DELETE — soft delete (set active = false)

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import type { StylistFormData } from "@/lib/supabase/types";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── GET /api/admin/stylists ──

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
      .from("stylists")
      .select("*")
      .order("name", { ascending: true });

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

// ── POST /api/admin/stylists ──

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body: StylistFormData = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Stylist name is required." },
        { status: 400 }
      );
    }

    if (!body.specialties?.trim()) {
      return NextResponse.json(
        { success: false, error: "At least one specialty is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("stylists")
      .insert({
        name:        body.name.trim(),
        bio:         body.bio?.trim()  ?? null,
        photo_url:   null,
        specialties: parseSpecialties(body.specialties),
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

// ── PATCH /api/admin/stylists ──

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const body                      = await request.json();
    const { stylist_id, ...fields } = body;

    if (!stylist_id) {
      return NextResponse.json(
        { success: false, error: "stylist_id is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("stylists")
      .select("id")
      .eq("id", stylist_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Stylist not found." },
        { status: 404 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (fields.name        !== undefined) updatePayload.name        = fields.name.trim();
    if (fields.bio         !== undefined) updatePayload.bio         = fields.bio?.trim() ?? null;
    if (fields.specialties !== undefined) updatePayload.specialties = parseSpecialties(fields.specialties);
    if (fields.active      !== undefined) updatePayload.active      = fields.active;

    const { data, error } = await supabase
      .from("stylists")
      .update(updatePayload as never)
      .eq("id", stylist_id)
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

// ── DELETE /api/admin/stylists ──
// Soft deletes a stylist — sets active = false, preserves booking references.

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const stylist_id        = searchParams.get("stylist_id");

    if (!stylist_id) {
      return NextResponse.json(
        { success: false, error: "stylist_id query param is required." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("stylists")
      .update({ active: false, updated_at: new Date().toISOString() } as never)
      .eq("id", stylist_id)
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
      message: "Stylist deactivated successfully.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
