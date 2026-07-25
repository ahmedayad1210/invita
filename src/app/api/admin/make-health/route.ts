import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getSupabaseSecretKey } from "@/lib/supabase/env";
import { runMakeWatchdog } from "@/lib/make/watchdog";

// Admin-only (guarded by middleware for /api/admin/*).
// GET  → recent watchdog health log.
// POST → run a check immediately ("Run check now" button).

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  if (!getSupabaseSecretKey()) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("make_scenario_health")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (e) {
    console.error("[make-health] load failed", e);
    return NextResponse.json(
      { success: false, error: "Failed to load health log." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await runMakeWatchdog();
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("[make-health] manual run failed", e);
    return NextResponse.json(
      { success: false, error: "Watchdog run failed." },
      { status: 500 }
    );
  }
}
