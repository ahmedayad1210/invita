import "server-only";

import { createAdminClient, createClient } from "@/lib/supabase/server";

export type GuestIdentity = {
  name: string;
  phone: string;
  email?: string | null;
  locale?: "en" | "ar";
};

export type GuestSessionResult = { userId: string } | { error: string };

/**
 * Provision a passwordless guest patient account and establish a session
 * so RLS-backed booking inserts work without a signup form.
 */
export async function provisionGuestSession(
  input: GuestIdentity
): Promise<GuestSessionResult> {
  const admin = createAdminClient();
  const authEmail = `guest-${crypto.randomUUID()}@guest.invitadrips.com`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: authEmail,
    email_confirm: true,
    user_metadata: {
      full_name: input.name.trim(),
      phone: input.phone.trim(),
      guest_email: input.email?.trim() || null,
      is_guest: true,
      locale: input.locale ?? "en",
    },
  });

  if (createErr || !created.user) {
    console.error("[guest] createUser failed", createErr);
    return { error: "guest_provision_failed" };
  }

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: authEmail,
  });

  const tokenHash = link?.properties?.hashed_token;
  if (linkErr || !tokenHash) {
    console.error("[guest] generateLink failed", linkErr);
    return { error: "guest_link_failed" };
  }

  const supabase = await createClient();
  const { error: verifyErr } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: tokenHash,
  });

  if (verifyErr) {
    console.error("[guest] verifyOtp failed", verifyErr);
    return { error: "guest_signin_failed" };
  }

  return { userId: created.user.id };
}
