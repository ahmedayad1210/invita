# TEST_REPORT_sevres.md
**Sèvres & Co. — Complete QA Audit Report**
**Date:** 2026-06-10
**Live URL:** https://sevres.vercel.app
**Auditor:** Playwright QA Suite (Claude Code)

---

## Executive Summary

A complete QA audit was performed on the live Sèvres & Co. booking application. The test suite covers functional flows, security boundaries, crash resistance, and regression paths across 143 automated Playwright tests.

**All 143 tests pass.** One critical security vulnerability was identified during the audit: the admin authentication token is a base64-encoded JSON object with no cryptographic signature. Any attacker who discovers this format can forge a valid admin API token without knowing the admin credentials, granting full access to booking management, service CRUD, and stylist CRUD. This is a pre-launch blocker.

Beyond the critical finding, several medium and low severity issues were found including inaccessible form labels, missing HTTP security headers, weak admin session architecture, and a category input that silently errors on unknown values instead of returning a clean 400.

The application is **not production-ready** in its current form due to the critical token forgery vulnerability. Resolving it and addressing the remaining medium issues would bring the product to a shippable state.

---

## Architecture Summary

| Layer | Implementation |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Hosting | Vercel |
| Database | Supabase (PostgreSQL + Row-Level Security) |
| Customer Auth | Supabase Auth — cookie-based JWT session |
| Admin Auth | Hardcoded credentials in env vars; session stored in `localStorage`; API verified via `Authorization: Bearer <base64-JSON>` |
| Booking State | Zustand store, persisted in `sessionStorage` |
| Middleware | Next.js Edge Middleware — protects `/account` and `/bookings` via Supabase `getUser()` |
| Admin Routes | **No server-side middleware protection** — client-side `localStorage` check only |
| API Auth (admin) | Bearer token = `btoa(JSON.stringify({authenticated,username,expires_at}))` — no HMAC |

---

## Environment

| Item | Value |
|---|---|
| Target | https://sevres.vercel.app |
| Test Runner | Playwright 1.60.0 |
| Browser | Chromium (Desktop) |
| Customer Account | siddiquiaftab2001@gmail.com |
| Admin Account | aftab / aftab |
| Test Files | `tests/functional.spec.ts`, `tests/security.spec.ts`, `tests/crash.spec.ts` |
| Config | `playwright.config.ts` |
| Env Template | `.env.test.example` |

---

## Tests Executed

| File | Tests | Description |
|---|---|---|
| `crash.spec.ts` | 30 | Console errors, 404 handling, refresh persistence, navigation, redirects, API edge cases, loading states |
| `functional.spec.ts` | 69 | Homepage, nav, static pages, customer auth, booking flow, My Bookings, admin auth, admin CRUD |
| `security.spec.ts` | 44 | Protected routes, admin token security, XSS, SQL injection, session validation, access control |
| **Total** | **143** | |

---

## Pass Count

**143 / 143 tests passed (100%)**

---

## Fail Count

**0 test failures** — all assertions resolve correctly.

> Note: The critical token forgery vulnerability is _confirmed_ by a passing test that demonstrates the attack succeeds. The test documents both the attack and expected secure behavior, and passes without causing an assertion error. The vulnerability is captured in the **Bugs Found** and **Security Findings** sections.

---

## Bugs Found

### BUG-001 — CRITICAL: Admin API Token is Forgeable (No Signature)

**Severity:** Critical / Pre-launch blocker
**File:** `src/app/api/admin/bookings/route.ts`, `src/app/api/admin/services/route.ts`, `src/app/api/admin/stylists/route.ts`, `src/lib/admin-auth.ts`

**Reproduction Steps:**
1. Observe that all admin API routes check the `Authorization: Bearer <token>` header.
2. The token is `btoa(JSON.stringify({authenticated: true, username: "any", expires_at: <future>}))`.
3. Craft a token: `Buffer.from(JSON.stringify({authenticated:true,username:"hacker",expires_at:Date.now()+999999})).toString('base64')`.
4. Send `GET /api/admin/bookings` with `Authorization: Bearer <forged-token>`.

**Expected Result:** HTTP 401 — server should reject tokens not issued after a real credential check.

**Actual Result:** HTTP 200 — full bookings list returned. The forged token grants complete admin API access including booking approval/rejection, service creation, stylist management, and reading all customer data.

**Root Cause:** `isAdminAuthorised()` only checks the structure and expiry of the token JSON. It does not verify a cryptographic signature (HMAC/JWT secret). Since the token format is `base64(JSON)` with no signing, anyone who reads the source code or observes a network request can forge an unlimited number of valid tokens.

**Remediation:**
- Sign the session token server-side using a secret: `HMAC-SHA256(JSON, ADMIN_SESSION_SECRET)` or issue a proper JWT via `jsonwebtoken`.
- Alternatively, store sessions server-side (Redis / Supabase table) and issue opaque session IDs.
- Never trust client-supplied session data for authorization decisions.

---

### BUG-002 — HIGH: Admin Pages Have No Server-Side Route Protection

**Severity:** High
**File:** `src/app/admin/layout.tsx`, `middleware.ts`

**Reproduction Steps:**
1. Open DevTools, clear localStorage.
2. Navigate directly to `https://sevres.vercel.app/admin/bookings`.
3. Observe: the page renders briefly with the full admin layout before the client-side JavaScript runs and redirects to `/admin`.

**Expected Result:** Server-side redirect to `/admin` login before any page content renders.

**Actual Result:** The admin layout does a client-side `useEffect` check. For a brief moment the admin shell renders. More importantly, the `/admin/*` routes are not in the Next.js middleware PROTECTED_ROUTES list, so the server never enforces the admin session check.

**Root Cause:** `middleware.ts` only protects `/account` and `/bookings` (Supabase Auth routes). Admin protection is entirely client-side, relying on `localStorage`. Any server-rendered leak or JS injection can bypass this before hydration.

**Remediation:** Add server-side admin session validation in middleware for `/admin/*` routes (excluding `/admin` itself to allow login). Use an HTTP-only cookie for the admin session rather than localStorage.

---

### BUG-003 — HIGH: Admin Session Stored in localStorage (XSS Risk)

**Severity:** High
**File:** `src/lib/admin-auth.ts`

**Reproduction Steps:**
1. Log in as admin.
2. Open DevTools → Application → Local Storage.
3. The full admin session JSON including `expires_at` is readable.

**Expected Result:** Admin session should be stored in an HTTP-only cookie, not accessible to JavaScript.

**Actual Result:** `sevres_admin_session` key in localStorage contains the full session object. Any XSS payload anywhere in the application can read this and forge admin API requests.

**Root Cause:** Architectural decision to use localStorage for admin session persistence. This is fine for demo/prototype but unacceptable for a production system.

**Remediation:** Issue admin session as an HTTP-only, SameSite=Strict cookie from the `/api/admin/login` endpoint. Validate the cookie server-side in all admin API routes.

---

### BUG-004 — MEDIUM: Form Labels Not Associated with Inputs

**Severity:** Medium (Accessibility + Test reliability)
**File:** `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, `src/app/admin/page.tsx`

**Reproduction Steps:**
1. Open the login page.
2. Click the "Email Address" label text.
3. Observe: focus does not move to the email input.

**Expected Result:** Clicking a label focuses its input (standard HTML association via `htmlFor`/`id`).

**Actual Result:** Labels use `className="label-sevres"` with no `htmlFor` attribute. Inputs have no `id`. The label and input are not linked, failing WCAG 2.1 SC 1.3.1 (Info and Relationships) and SC 4.1.2 (Name, Role, Value).

**Root Cause:** Custom CSS class used for styling without HTML semantic association.

**Remediation:** Add `id` to each input and matching `htmlFor` to each label. Example:
```jsx
<label htmlFor="email" className="label-sevres">Email Address</label>
<input id="email" type="email" ... />
```

---

### BUG-005 — MEDIUM: `/api/services?category=<invalid>` Returns HTTP 500

**Severity:** Medium (API robustness)
**File:** `src/app/api/services/route.ts`

**Reproduction Steps:**
1. `GET https://sevres.vercel.app/api/services?category=weapons`
2. Also `GET .../services?category=' OR '1'='1`

**Expected Result:** HTTP 200 with `data: []` (no matching services), or HTTP 400 with a clear "Invalid category" error.

**Actual Result:** HTTP 500. Supabase attempts to cast the category string to the `service_category` PostgreSQL enum, fails, and the error propagates as a 500 response.

**Root Cause:** The API passes the `category` query param directly to `.eq("category", category)` without validating it against the enum values first.

**Remediation:**
```ts
const VALID_CATEGORIES = ["hair", "skin", "nails", "massage"];
if (category && category !== "all" && !VALID_CATEGORIES.includes(category)) {
  return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 });
}
```

---

### BUG-006 — MEDIUM: Admin Credentials Weakness (Hardcoded Env Var, Plain Text)

**Severity:** Medium
**File:** `src/lib/admin-auth.ts`

**Reproduction Steps:**
1. Review `verifyAdminCredentials()`.
2. Credentials are compared as plain strings from `process.env.ADMIN_USERNAME` and `process.env.ADMIN_PASSWORD`.

**Expected Result:** Passwords should be stored as bcrypt hashes or compared using a constant-time function.

**Actual Result:** Plain-text string comparison (`username.trim() === validUsername.trim()`). This is susceptible to timing attacks and means the password is stored in plain text in the environment.

**Remediation:** Hash the admin password at setup time and compare with `bcrypt.compare()`. At minimum, use `crypto.timingSafeEqual()` for the comparison.

---

### BUG-007 — MEDIUM: No Rate Limiting on Admin Login API

**Severity:** Medium
**File:** `src/app/api/admin/login/route.ts`

**Reproduction Steps:**
1. Send repeated POST requests to `/api/admin/login` with different passwords.
2. No 429 response is returned regardless of attempt frequency.

**Expected Result:** After N failed attempts (e.g., 5), the endpoint should return 429 Too Many Requests with a `Retry-After` header.

**Actual Result:** Unlimited login attempts allowed. Combined with the simple credential format (`aftab`/`aftab`), a brute-force attack would succeed quickly.

**Remediation:** Implement rate limiting at the Vercel edge (via `@vercel/edge-rate-limit` or middleware) or use Upstash Redis for attempt counting.

---

### BUG-008 — LOW: Booking State Not Initialized in sessionStorage on First Visit

**Severity:** Low (Test infrastructure / UX edge case)
**File:** `src/store/bookingStore.ts`

**Reproduction Steps:**
1. Clear all storage.
2. Navigate to `/book`.
3. Immediately check `sessionStorage.getItem("sevres-booking")`.

**Expected Result:** The Zustand persist store writes to sessionStorage after first render.

**Actual Result:** The sessionStorage key is not written until a Zustand action is triggered (lazy initialization). A fresh page load without interaction leaves sessionStorage empty temporarily.

**Impact:** Minimal — Zustand persist initializes on first state change. No user-visible bug. Documented because it affects test reliability.

---

### BUG-009 — LOW: No HTTP Security Headers

**Severity:** Low
**File:** `next.config.ts`

**Description:** The application does not set HTTP security headers including:
- `Content-Security-Policy` (would mitigate XSS stored attacks)
- `X-Frame-Options` (clickjacking)
- `Strict-Transport-Security` (HTTPS enforcement)
- `X-Content-Type-Options: nosniff`

**Remediation:** Add security headers in `next.config.ts` via the `headers()` function:
```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ],
  }];
}
```

---

### BUG-010 — LOW: `DELETE /api/admin/services` Hard-Deletes (Not Soft Delete)

**Severity:** Low (Data integrity)
**File:** `src/app/api/admin/services/route.ts`

**Description:** The comment in the route says "Soft delete (set active = false)" but the implementation performs a hard `DELETE` from the database. If a service has existing bookings, the FK constraint will cause a 500 error and the booking references are not preserved.

**Expected Result:** The API comment and UI label say "deactivate" — should set `active = false` only.

**Actual Result:** Hard `DELETE` query. The stylists endpoint correctly uses soft delete (`active: false`); the services endpoint does not.

**Remediation:** Change the DELETE handler to:
```ts
await supabase.from("services").update({ active: false, updated_at: new Date().toISOString() }).eq("id", service_id);
```

---

## Security Findings

### SEC-01: CRITICAL — Admin Bearer Token is Unsigned (Forgeable)

| Field | Detail |
|---|---|
| CVSS Base Score | 9.8 (Critical) |
| CWE | CWE-347: Improper Verification of Cryptographic Signature |
| Affected Endpoints | `GET/PATCH /api/admin/bookings`, `GET/POST/PATCH/DELETE /api/admin/services`, `GET/POST/PATCH/DELETE /api/admin/stylists` |
| Attack Complexity | Low — requires only knowledge of the token format (visible in source code) |
| Privileges Required | None |
| User Interaction | None |

The admin API uses `btoa(JSON.stringify({authenticated: true, username: "x", expires_at: <future>}))` as an authorization token. No HMAC or JWT signature is applied. Confirmed by the Playwright test: a forged token returns HTTP 200 from all admin endpoints.

---

### SEC-02: HIGH — Admin Session in localStorage Accessible to JavaScript

| Field | Detail |
|---|---|
| CVSS Base Score | 7.5 |
| CWE | CWE-359: Exposure of Private Information; CWE-922: Insecure Storage of Sensitive Information |
| Impact | If any XSS vector is found, admin session can be exfiltrated and used to forge admin API tokens |

---

### SEC-03: HIGH — Admin Routes Not Protected Server-Side

| Field | Detail |
|---|---|
| CVSS Base Score | 6.5 |
| Impact | Admin UI briefly renders before client-side redirect. Combined with SEC-01, an API-level bypass is already confirmed. |

---

### SEC-04: MEDIUM — No CSRF Protection on Admin API

| Field | Detail |
|---|---|
| CWE | CWE-352: Cross-Site Request Forgery |
| Impact | A malicious site can craft `fetch()` requests to admin endpoints if the forged token is known. Since the token format is in source code, CSRF attacks are feasible. |

---

### SEC-05: LOW — Availability API Exposes Booking Slot Information Without Auth

| Field | Detail |
|---|---|
| Endpoint | `GET /api/availability?stylist_id=<id>&date=<date>` |
| Impact | Any unauthenticated caller can determine which time slots are booked for any stylist on any date. This is likely intentional (needed for the booking UI), but it leaks scheduling information. |

---

### SEC-06: LOW — No Rate Limiting on `/api/admin/login`

See BUG-007. Combined with weak plain-text credentials, brute force is trivial.

---

### SEC-07: POSITIVE FINDING — Supabase RLS Enforces User Isolation

The Row Level Security policies on the `bookings` table correctly enforce that users can only read and modify their own bookings. Confirmed by test: `/api/user/bookings` returns 401 without a session, and `/api/bookings` PATCH returns 401 without auth.

---

### SEC-08: POSITIVE FINDING — SQL Injection Not Possible

Supabase JavaScript client uses parameterized queries. All SQL injection payloads in `category` and `stylist_id` parameters failed to return data. The server returns 500 (enum cast failure) or 200 with empty array — no data exfiltration occurred.

---

### SEC-09: POSITIVE FINDING — XSS Not Executed

XSS payloads in the contact form name field, URL parameters, and stored notes (via bookings page) did not execute. React's default JSX escaping prevents reflected and stored XSS in rendered content.

---

### SEC-10: POSITIVE FINDING — Expired Tokens Correctly Rejected

The `isAdminAuthorised()` function checks `decoded.expires_at > Date.now()`. Expired tokens return 401 as expected.

---

## Potential False Positives

1. **sessionStorage persistence test** — The test performs a soft assertion because the Zustand persist middleware writes lazily (on first action). This is not a bug but a timing artifact.

2. **SQL injection test returning 500** — The HTTP 500 from `/api/services?category=<sql-payload>` looks like a server error, but it is a safe PostgreSQL enum cast rejection via parameterized queries. No actual SQL injection occurred. The 500 is an API robustness issue (BUG-005), not a security vulnerability.

3. **"Forged token" test passing** — The token forgery test "passes" in the sense that it completes without error. The test deliberately documents the vulnerability by confirming HTTP 200 on a forged token. This is a confirmed vulnerability, not a false positive.

4. **Admin redirect timing** — Admin sub-pages (`/admin/bookings` etc.) redirect to `/admin` via client-side `useEffect`. In automated tests, this appears as a brief flash of the admin layout before redirect. This is a real weakness (BUG-002) but the redirect does occur successfully.

---

## Production Readiness Score

**3.5 / 10**

**Rationale:**
- The application is functionally complete and all user-facing flows work correctly.
- The admin authentication is fundamentally broken from a security perspective (unsigned token, localStorage storage, no server-side enforcement).
- The customer auth flow (Supabase) is solid and correctly protected.
- Accessibility issues (unlinked labels) affect all form pages.
- No HTTP security headers are configured.
- The bookings RLS and customer data isolation are correct.

The app is suitable for demo or internal use but must not be launched publicly until BUG-001 through BUG-003 are resolved.

---

## Security Score

**4 / 10**

**Rationale:**
- Customer-facing auth (Supabase JWT + RLS): secure.
- Admin auth: fundamentally insecure — unsigned tokens, localStorage session, no server-side protection.
- Input handling: safe against SQL injection (Supabase parameterized queries) and XSS (React escaping).
- No HTTP security headers, no rate limiting, no CSRF tokens.
- Weak admin credentials (`aftab`/`aftab`) with no lockout policy.

---

## Performance Observations

- Page load times on Vercel are consistently fast (~500ms–2s for most pages).
- The `/book` page requires an API call to `/api/services` before showing service cards; there is a loading spinner but no skeleton UI.
- Admin dashboard makes an API call to `/api/admin/bookings` on mount; with large booking datasets this could be slow (no pagination visible in current implementation).
- The `Cache-Control: s-maxage=60, stale-while-revalidate=300` header on `/api/services` and `/api/admin/services` is correctly configured for Vercel Edge caching.
- Zustand `persist` with `sessionStorage` adds negligible overhead.

---

## Top 10 Issues Before Launch

| # | Issue | Severity | Effort |
|---|---|---|---|
| 1 | **BUG-001 / SEC-01**: Admin API token is unsigned (forgeable) — complete admin access without credentials | Critical | Medium — add HMAC/JWT signing |
| 2 | **BUG-002 / SEC-03**: Admin routes have no server-side protection — middleware must protect `/admin/*` | High | Low — add to middleware PROTECTED_ROUTES with cookie check |
| 3 | **BUG-003 / SEC-02**: Admin session in localStorage — move to HTTP-only cookie | High | Medium |
| 4 | **BUG-006**: Admin password stored in plain text env var — hash and use constant-time compare | Medium | Low |
| 5 | **BUG-007 / SEC-06**: No rate limiting on admin login — brute force possible | Medium | Low (Vercel middleware or Upstash) |
| 6 | **BUG-004**: Form labels not linked to inputs — accessibility failure on all auth forms | Medium | Low |
| 7 | **BUG-005**: `/api/services?category=<invalid>` returns 500 — validate enum before query | Medium | Low |
| 8 | **BUG-009**: No HTTP security headers — add CSP, HSTS, X-Frame-Options | Low | Low |
| 9 | **BUG-010**: Services DELETE is a hard delete, not soft delete (comment says soft) | Low | Low |
| 10 | **SEC-05**: Availability API is unauthenticated — consider whether stylist schedule exposure is acceptable | Low | Design decision |

---

## Test Files Delivered

```
playwright.config.ts          — Playwright configuration
.env.test.example             — Environment template
.env.test                     — Test credentials (do not commit)
tests/
  helpers/
    env.ts                    — Environment variable loader
    auth.ts                   — Login helpers + token builders
  functional.spec.ts          — 69 functional tests
  security.spec.ts            — 44 security tests
  crash.spec.ts               — 30 crash / regression tests
```

**Total: 143 tests — 143 passed — 0 failed**
