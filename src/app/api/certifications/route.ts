import { NextRequest, NextResponse } from "next/server";
import { getCertificationsFromJson } from "@/lib/invita/certifications";

export async function GET() {
  const data = getCertificationsFromJson();
  return NextResponse.json(
    { success: true, data },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
