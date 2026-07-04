// src/app/api/stylists/route.ts
// Public — no auth required
// GET — active stylists

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SEED_STYLISTS } from "@/lib/constants";
import type { Stylist } from "@/lib/supabase/types";

function seedStylists(): Stylist[] {
  const now = new Date().toISOString();
  return SEED_STYLISTS.map((stylist, index) => ({
    id: `seed-${index + 1}`,
    name: stylist.name,
    bio: stylist.bio,
    photo_url: null,
    specialties: [...stylist.specialties],
    active: stylist.active,
    created_at: now,
    updated_at: now,
  }));
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("stylists")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: true, data: seedStylists() },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }

    const rows = data?.length ? data : seedStylists();

    return NextResponse.json(
      { success: true, data: rows },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json(
      { success: true, data: seedStylists() },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
