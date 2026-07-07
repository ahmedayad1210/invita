// src/app/api/services/route.ts
// Public — no auth required
// GET — active services, optionally filtered by category, slug, or id

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  enrichServiceRow,
  resolveServiceBySlug,
  seedServicesCatalog,
} from "@/lib/invita/services-catalog";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    const supabase = await createClient();
    const seeds = seedServicesCatalog();

    if (slug) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ success: true, data: enrichServiceRow(data) });
      }

      const seed = resolveServiceBySlug(seeds, slug);
      if (seed) {
        return NextResponse.json({ success: true, data: seed });
      }

      return NextResponse.json({ success: false, error: "Service not found." }, { status: 404 });
    }

    if (id) {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, data: enrichServiceRow(data) });
      }

      const seed = seeds.find((s) => s.id === id);
      if (seed) {
        return NextResponse.json({ success: true, data: seed });
      }

      return NextResponse.json({ success: false, error: "Service not found." }, { status: 404 });
    }

    let query = supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: true, data: seeds },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }

    const rows = data?.length ? data.map(enrichServiceRow) : seeds;

    return NextResponse.json(
      { success: true, data: rows },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json(
      { success: true, data: seedServicesCatalog() },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
