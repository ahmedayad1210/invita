import { NextRequest, NextResponse } from "next/server";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { generateReferralCode } from "@/lib/invita/referrals";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("referral_code, referral_credits")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const row = profile as { referral_code?: string | null; referral_credits?: number | null };
    let code = row.referral_code;

    if (!code) {
      code = generateReferralCode(user.id);
      await supabase
        .from("profiles")
        .update({ referral_code: code } as never)
        .eq("id", user.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        referral_code: code,
        referral_credits: row.referral_credits ?? 0,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const refCode = typeof body.ref_code === "string" ? body.ref_code.trim().toUpperCase() : "";

    if (!refCode) {
      return NextResponse.json({ success: false, error: "ref_code is required." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: self } = await supabase
      .from("profiles")
      .select("referred_by, referral_code")
      .eq("id", user.id)
      .single();

    if (!self) {
      return NextResponse.json({ success: false, error: "Profile not found." }, { status: 404 });
    }

    const selfRow = self as { referred_by?: string | null; referral_code?: string | null };
    if (selfRow.referred_by) {
      return NextResponse.json({ success: true, data: { already_applied: true } });
    }

    if (selfRow.referral_code === refCode) {
      return NextResponse.json({ success: false, error: "Cannot use your own code." }, { status: 400 });
    }

    const { data: referrer } = await supabase
      .from("profiles")
      .select("id, referral_credits")
      .eq("referral_code", refCode)
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ success: false, error: "Invalid referral code." }, { status: 404 });
    }

    const referrerRow = referrer as { id: string; referral_credits?: number | null };

    await supabase
      .from("profiles")
      .update({ referred_by: referrerRow.id } as never)
      .eq("id", user.id);

    await supabase
      .from("profiles")
      .update({ referral_credits: (referrerRow.referral_credits ?? 0) + 1 } as never)
      .eq("id", referrerRow.id);

    if (!selfRow.referral_code) {
      await supabase
        .from("profiles")
        .update({ referral_code: generateReferralCode(user.id) } as never)
        .eq("id", user.id);
    }

    return NextResponse.json({ success: true, data: { applied: true } });
  } catch {
    return NextResponse.json({ success: false, error: "Internal error." }, { status: 500 });
  }
}
