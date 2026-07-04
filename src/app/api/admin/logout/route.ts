// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { clearCookieHeader } from "@/lib/admin-jwt";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.headers.set("Set-Cookie", clearCookieHeader());
  return response;
}
