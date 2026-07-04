// src/lib/admin-rate-limit.ts
// In-memory rate limiter for the admin login endpoint.
//
// Limitation: state resets on server restart and does not synchronise
// across multiple Node.js instances. For multi-instance deployments,
// replace with Redis/Upstash using the same interface.

const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes

interface Entry {
  count:   number;
  resetAt: number; // epoch ms when the window expires
}

// Module-level singleton — persists across requests in the same process.
const store = new Map<string, Entry>();

// ── check ────────────────────────────────────────────────────────
// Returns { blocked: false } if the caller may proceed,
// or { blocked: true, retryAfterMs } if they are locked out.

export function checkLoginRateLimit(key: string): {
  blocked:       boolean;
  retryAfterMs?: number;
} {
  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    return { blocked: false };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { blocked: true, retryAfterMs: entry.resetAt - now };
  }

  return { blocked: false };
}

// ── recordFailure ────────────────────────────────────────────────
// Increments the failure counter for the given key.
// The window resets if it has already expired.

export function recordLoginFailure(key: string): void {
  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

// ── clearAttempts ────────────────────────────────────────────────
// Called on successful login to reset the counter.

export function clearLoginAttempts(key: string): void {
  store.delete(key);
}
