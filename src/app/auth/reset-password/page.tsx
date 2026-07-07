import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/seo";
import ResetPasswordForm from "./ResetPasswordForm";

type PageProps = {
  searchParams: Promise<{ code?: string; error?: string }>;
};

/**
 * Password reset landing page.
 * Supabase emails link here with ?code=… (PKCE). Exchange server-side so cookies are set reliably.
 */
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const base = getSiteUrl();

  if (params.code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);

    if (error) {
      redirect(`${base}/auth/reset-password?error=expired`);
    }

    redirect(`${base}/auth/reset-password`);
  }

  const initialError =
    params.error === "expired"
      ? "This reset link has expired or is invalid. Please request a new one."
      : null;

  return <ResetPasswordForm initialError={initialError} />;
}
