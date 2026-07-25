import { NextRequest, NextResponse } from "next/server";
import { runMakeWatchdog } from "@/lib/make/watchdog";

// Health check + self-heal for the watched Make.com scenarios.
// Triggered by the Netlify scheduled function (every 15 min) with the
// CRON_SECRET bearer token — same auth pattern as dispatch-notifications.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const result = await runMakeWatchdog();
  return NextResponse.json({ success: true, data: result });
}
