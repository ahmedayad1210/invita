// src/lib/admin-auth.ts
// Server-side admin credential verification using bcrypt.
// All session management is handled via signed JWT cookies — see admin-jwt.ts.
// No localStorage. No client-side session state.

import bcrypt from "bcryptjs";

// ── verifyAdminCredentials ───────────────────────────────────────
// Compares the submitted username against ADMIN_USERNAME and the
// submitted password against the bcrypt hash in ADMIN_PASSWORD_HASH.
//
// bcrypt.compare() is timing-safe by design — it always takes the
// same amount of time regardless of where the comparison fails,
// preventing timing-based credential enumeration.
//
// Migration: generate ADMIN_PASSWORD_HASH with:
//   node -e "const b=require('bcryptjs'); b.hash('your-password',12).then(console.log)"
// Store the output in ADMIN_PASSWORD_HASH (not ADMIN_PASSWORD).

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const validUsername = process.env.ADMIN_USERNAME;
  const passwordHash  = process.env.ADMIN_PASSWORD_HASH;
  const devPassword   = process.env.ADMIN_PASSWORD;

  if (!validUsername) {
    console.error("Admin credentials not configured (ADMIN_USERNAME).");
    return false;
  }

  const submitted = username.trim();
  const expected = validUsername.trim();
  const usernameMatch = expected.includes("@")
    ? submitted.toLowerCase() === expected.toLowerCase()
    : submitted === expected;

  if (passwordHash) {
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (usernameMatch && passwordMatch) return true;
  }

  // Local dev fallback when hash is missing or .env mangled bcrypt `$` chars
  if (process.env.NODE_ENV !== "production" && devPassword) {
    return usernameMatch && password === devPassword;
  }

  if (!passwordHash && !devPassword) {
    console.error(
      "Admin credentials not configured (ADMIN_PASSWORD_HASH or ADMIN_PASSWORD for dev)."
    );
  }

  return false;
}
