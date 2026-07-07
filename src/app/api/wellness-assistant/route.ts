import { NextRequest, NextResponse } from "next/server";
import { answerWellnessQuery } from "@/lib/invita/wellness-assistant";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query : "";
    const locale = body.locale === "ar" ? "ar" : "en";

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: "query is required." },
        { status: 400 }
      );
    }

    const data = answerWellnessQuery(query, locale);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error." }, { status: 500 });
  }
}
