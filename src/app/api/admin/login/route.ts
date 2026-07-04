// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/admin-auth";
import { signAdminJWT, buildCookieHeader } from "@/lib/admin-jwt";
import {
  checkLoginRateLimit,
  recordLoginFailure,
  clearLoginAttempts,
} from "@/lib/admin-rate-limit";

// Derive a stable rate-limit key from the request.
// Prefers CF-Connecting-IP (Cloudflare) → X-Forwarded-For → fallback.
function getRateLimitKey(request: NextRequest): string {
  const cf  = request.headers.get("cf-connecting-ip");
  const xff = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  return cf ?? xff ?? "unknown";
}

export async function POST(request: NextRequest) {
  // ── Rate limit check ──────────────────────────────────────────
  const key    = getRateLimitKey(request);
  const rl     = checkLoginRateLimit(key);

  if (rl.blocked) {
    const mins = Math.ceil((rl.retryAfterMs ?? 0) / 60_000);
    return NextResponse.json(
      {
        success: false,
        error:   `Too many failed login attempts. Please try again in ${mins} minute${mins !== 1 ? "s" : ""}.`,
      },
      {
        status:  429,
        headers: {
          "Retry-After": String(Math.ceil((rl.retryAfterMs ?? 0) / 1000)),
        },
      }
    );
  }

  // ── Parse body ────────────────────────────────────────────────
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { success: false, error: "Username and password are required." },
      { status: 400 }
    );
  }

  // ── Verify credentials ────────────────────────────────────────
  let valid: boolean;
  try {
    valid = await verifyAdminCredentials(username, password);
  } catch (err) {
    console.error("Credential verification error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }

  if (!valid) {
    recordLoginFailure(key);
    return NextResponse.json(
      { success: false, error: "Invalid credentials. Please try again." },
      { status: 401 }
    );
  }

  // ── Success — issue signed JWT cookie ─────────────────────────
  clearLoginAttempts(key);

  let token: string;
  try {
    token = await signAdminJWT(username.trim());
  } catch (err) {
    console.error("JWT signing error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }

  const response = NextResponse.json(
    { success: true, username: username.trim() },
    { status: 200 }
  );

  response.headers.set("Set-Cookie", buildCookieHeader(token));

  return response;
}
