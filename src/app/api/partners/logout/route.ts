import { NextResponse } from "next/server";
import { clearPartnerCookieHeader } from "@/lib/partner-jwt";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", clearPartnerCookieHeader());
  return response;
}
