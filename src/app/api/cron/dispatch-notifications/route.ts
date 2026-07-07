import { NextRequest, NextResponse } from "next/server";
import { dispatchDueNotifications } from "@/lib/notifications/booking-notifications";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const result = await dispatchDueNotifications();
  return NextResponse.json({ success: true, data: result });
}
