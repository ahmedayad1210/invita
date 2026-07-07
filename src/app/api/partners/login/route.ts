import { NextRequest, NextResponse } from "next/server";
import { verifyPartnerCredentials } from "@/lib/partner-auth";
import { buildPartnerCookieHeader, signPartnerJWT } from "@/lib/partner-jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicName, password } = body;

    if (!clinicName || !password) {
      return NextResponse.json(
        { success: false, error: "Clinic name and password are required." },
        { status: 400 }
      );
    }

    const valid = await verifyPartnerCredentials(clinicName, password);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 });
    }

    const token = await signPartnerJWT(clinicName.trim());
    const response = NextResponse.json({ success: true, clinicName: clinicName.trim() });
    response.headers.set("Set-Cookie", buildPartnerCookieHeader(token));
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Internal error." }, { status: 500 });
  }
}
