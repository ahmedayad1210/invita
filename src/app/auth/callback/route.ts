import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";

/**
 * Handles Supabase email confirmation and OAuth PKCE redirects.
 * Add https://invitadrips.com/auth/callback to Supabase Auth redirect URLs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";
  const base = getSiteUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${base}/auth/reset-password`);
      }
      const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
      return NextResponse.redirect(`${base}${safeNext}`);
    }
  }

  if (type === "recovery") {
    return NextResponse.redirect(
      `${base}/auth/reset-password?error=expired`
    );
  }

  return NextResponse.redirect(
    `${base}/auth/login?error=${encodeURIComponent("Email verification failed. Please try signing in or register again.")}`
  );
}
