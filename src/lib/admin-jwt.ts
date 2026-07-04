// src/lib/admin-jwt.ts
// Signed JWT utilities for admin authentication.
// Uses `jose` which runs in both Node.js and Edge Runtime (middleware).

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE_NAME  = "admin_token";
const JWT_ALG      = "HS256";
const SESSION_SECS = 60 * 60 * 8; // 8 hours

export { COOKIE_NAME };

// ── Secret ──────────────────────────────────────────────────────
// ADMIN_JWT_SECRET must be set in environment variables.
// Minimum recommended length: 32 characters.

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw) throw new Error("ADMIN_JWT_SECRET is not set.");
  return new TextEncoder().encode(raw);
}

// ── Payload shape ───────────────────────────────────────────────

export interface AdminJWTPayload extends JWTPayload {
  username: string;
}

// ── Sign ────────────────────────────────────────────────────────
// Called once on successful login.
// Returns a compact JWT string.

export async function signAdminJWT(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECS}s`)
    .sign(getSecret());
}

// ── Verify ──────────────────────────────────────────────────────
// Returns the payload if the token is valid and unexpired.
// Returns null for any invalid / expired token.

export async function verifyAdminJWT(
  token: string
): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [JWT_ALG],
    });
    if (typeof payload.username !== "string") return null;
    return payload as AdminJWTPayload;
  } catch {
    return null;
  }
}

// ── Cookie options ───────────────────────────────────────────────
// Returns a Set-Cookie header value string.
// HttpOnly — inaccessible to JavaScript.
// Secure  — HTTPS only in production.
// SameSite=Strict — no cross-site sending.

export function buildCookieHeader(token: string): string {
  const isProd  = process.env.NODE_ENV === "production";
  const maxAge  = SESSION_SECS;
  const parts   = [
    `${COOKIE_NAME}=${token}`,
    `Max-Age=${maxAge}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

// ── Clear-cookie header ─────────────────────────────────────────
// Used by /api/admin/logout to invalidate the cookie.

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`;
}
