// src/app/api/services/route.ts
// Public — no auth required
// GET — active services, optionally filtered by category or fetched by id

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SEED_SERVICES } from "@/lib/constants";
import type { Service } from "@/lib/supabase/types";

function seedServices(): Service[] {
  const now = new Date().toISOString();
  return SEED_SERVICES.map((service, index) => ({
    id: `seed-${index + 1}`,
    name: service.name,
    category: service.category,
    duration: service.duration,
    price: service.price,
    description: service.description,
    active: service.active,
    created_at: now,
    updated_at: now,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category         = searchParams.get("category");
    const id               = searchParams.get("id");

    const supabase = await createClient();

    if (id) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }

      const seed = seedServices().find((s) => s.id === id);
      if (seed) {
        return NextResponse.json({ success: true, data: seed });
      }

      return NextResponse.json(
        { success: false, error: "Service not found." },
        { status: 404 }
      );
    }

    let query = supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("name",     { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: true, data: seedServices() },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }

    const rows = data?.length ? data : seedServices();

    return NextResponse.json(
      { success: true, data: rows },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json(
      { success: true, data: seedServices() },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
