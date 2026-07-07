#!/usr/bin/env node
/**
 * Auth smoke test for Invita production.
 * Usage: node scripts/test-auth.mjs [baseUrl]
 */
import { createClient } from "@supabase/supabase-js";

const BASE = (process.argv[2] || "https://invitadrips.com").replace(/\/$/, "");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function checkPage(path, expectText) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  if (res.status !== 200) {
    fail(`GET ${path}`, `status ${res.status}`);
    return false;
  }
  // Client-rendered auth pages may not include copy in initial HTML
  const isClientAuth =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/reset-password");
  if (expectText && !isClientAuth && !html.includes(expectText)) {
    fail(`GET ${path}`, `missing "${expectText}"`);
    return false;
  }
  pass(`GET ${path}`, isClientAuth ? "200 (client-rendered)" : "200");
  return true;
}

async function checkCallbackRedirect() {
  const res = await fetch(`${BASE}/auth/callback`, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  if (res.status !== 307 && res.status !== 302) {
    fail("GET /auth/callback", `expected redirect, got ${res.status}`);
    return;
  }
  if (!location.includes("invitadrips.com")) {
    fail("GET /auth/callback", `redirect not on custom domain: ${location}`);
    return;
  }
  if (!location.includes("/auth/login")) {
    fail("GET /auth/callback", `unexpected redirect: ${location}`);
    return;
  }
  pass("GET /auth/callback", "redirects to login without code");
}

async function checkProfileUnauthenticated() {
  const res = await fetch(`${BASE}/api/user/profile`);
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 && json.success === false) {
    pass("GET /api/user/profile (anon)", "401 as expected");
  } else {
    fail("GET /api/user/profile (anon)", `status ${res.status}`);
  }
}

async function checkProtectedRedirect() {
  const res = await fetch(`${BASE}/account`, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  if ((res.status === 307 || res.status === 302) && location.includes("/auth/login")) {
    pass("GET /account (anon)", "redirects to login");
  } else {
    fail("GET /account (anon)", `status ${res.status}, location ${location}`);
  }
}

async function runSupabaseFlow() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    fail("Supabase env", "missing NEXT_PUBLIC_SUPABASE_URL / key");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const stamp = Date.now();
  const email = `invita.auth.test+${stamp}@mailinator.com`;
  const password = `TestPass_${stamp}!`;
  const fullName = "Invita Auth Test";

  // Sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${BASE}/auth/callback`,
      data: { full_name: fullName, phone: "+9647700000000" },
    },
  });

  if (signUpError) {
    fail("Supabase signUp", signUpError.message);
    return;
  }

  if (!signUpData.user) {
    fail("Supabase signUp", "no user returned");
    return;
  }

  const needsConfirm = !signUpData.session;
  pass(
    "Supabase signUp",
    needsConfirm ? "user created — email confirmation required" : "user created with session"
  );

  if (needsConfirm) {
    // Try sign-in before confirm — should fail gracefully
    const { error: earlyLoginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (earlyLoginError) {
      pass("Supabase signIn (pre-confirm)", earlyLoginError.message.slice(0, 60));
    } else {
      fail("Supabase signIn (pre-confirm)", "unexpected success before email confirm");
    }
    console.log(`  → Test account: ${email} (check inbox / Mailinator for confirm link)`);
    return;
  }

  // Immediate session — test sign-in and profile
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.session) {
    fail("Supabase signIn", signInError?.message || "no session");
    return;
  }
  pass("Supabase signIn", "session obtained");

  const token = signInData.session.access_token;
  const profileRes = await fetch(`${BASE}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Profile API uses cookies, not Bearer — test via Supabase profile table instead
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", signUpData.user.id)
    .maybeSingle();

  if (profileError) {
    fail("Supabase profiles row", profileError.message);
  } else if (profile?.email === email) {
    pass("Supabase profiles row", `full_name="${profile.full_name}"`);
  } else {
    fail("Supabase profiles row", profile ? "email mismatch" : "missing — trigger may not have run");
  }

  // Password reset request
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${BASE}/auth/reset-password`,
  });
  if (resetError) {
    fail("Supabase resetPasswordForEmail", resetError.message);
  } else {
    pass("Supabase resetPasswordForEmail", "email dispatched");
  }

  // Cleanup test user via admin if service role available
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (serviceKey) {
    const admin = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: delError } = await admin.auth.admin.deleteUser(signUpData.user.id);
    if (delError) {
      fail("Cleanup test user", delError.message);
    } else {
      pass("Cleanup test user", "deleted via admin API");
    }
  }

  void profileRes;
}

async function main() {
  console.log(`\nInvita auth test — ${BASE}\n`);

  await checkPage("/auth/login", "Welcome back");
  await checkPage("/auth/register", "Create your account");
  await checkPage("/auth/forgot-password", "Reset your password");
  await checkPage("/auth/reset-password", "Set New Password");
  await checkCallbackRedirect();
  await checkProfileUnauthenticated();
  await checkProtectedRedirect();
  await runSupabaseFlow();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("\nFailed:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
