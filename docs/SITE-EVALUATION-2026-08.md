# Invita — Full Site Evaluation

**Date:** 2026-08-09
**Scope:** Codebase at `claude/site-evaluation-j90mcs` — Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS 4 · Supabase
**Method:** `tsc --noEmit` + `next build` run locally; four parallel deep-dives (security, code quality/architecture, SEO/accessibility, UX/content/i18n). Top security findings independently re-verified against source.

---

## Executive summary

Invita is a **large, mature, well-engineered** marketing + commerce site (43 pages, 25 API routes, admin CRM, guest + authenticated booking, DNA orders, bilingual EN/AR). Engineering fundamentals are strong: the codebase typechecks cleanly, builds successfully, has **zero `any` / zero `@ts-ignore`** across 26.6k lines, ships rich SEO metadata and structured data, and admin authentication is properly hardened (a previously-critical forgeable-token bug is genuinely fixed).

Two things stand between it and a polished, safe launch:

1. **Security — unauthenticated write paths into the medical CRM.** A handful of public endpoints write patient PII with the RLS-bypassing service-role key, and RLS update policies let an authenticated user edit columns they shouldn't. None are exotic; all are fixable in a focused pass.
2. **The Arabic experience is half-wired.** The EN/AR dictionaries have perfect parity, but ~12 of the most important pages and the entire drip catalogue data layer are hardcoded English. Toggling to Arabic flips the layout to RTL while leaving most body copy in English — arguably worse than shipping English-only, for a Baghdad, IQD-priced clinic.

### Scorecard

| Dimension | Grade | One-line |
|---|---|---|
| Build / type health | **A** | `tsc` clean, `next build` green, 0 `any`, 0 `@ts-ignore` |
| Architecture & code quality | **B+** | Coherent App Router structure; heavy `"use client"` ratio + 7.5k lines hand-CSS |
| Security | **C+** | Admin auth solid; **unauthenticated CRM write paths + RLS column gaps** |
| SEO / structured data | **A−** | Dynamic sitemap, robots, `MedicalBusiness`/`MedicalProcedure` JSON-LD; SVG-only OG image |
| Accessibility | **B** | Skip link, semantic metadata; RTL/lang flips only post-hydration |
| i18n (EN/AR) | **C** | Dictionaries complete, but only ~40–50% of visible copy actually switches |
| UX / booking flow | **A−** | Genuinely polished 6-step flow, real feedback, no dead links |
| Content integrity | **B** | Real brand data; fabricated testimonials sit unused in code |
| Tooling / CI | **C** | No CI, no ESLint config, 136 tests that can't run (missing dep) |

**Overall: B / B−.** Production-capable, not yet launch-clean. The security items are the gate; the Arabic gap is the biggest quality gap.

---

## 1. Build & technical health ✅

- **TypeScript:** `npx tsc --noEmit` → **exit 0**, no errors.
- **Production build:** `next build` succeeds and prerenders all 125 pages **when Supabase env vars are present**. In a bare container (no env) the build fails at prerender because static pages such as `/_not-found` and `/auth/reset-password` instantiate a Supabase browser client that throws on missing keys — this is expected in prod (env is set on Netlify) but is a fragility signal: the global 404 page shouldn't hard-depend on Supabase.
- **Type discipline:** 0 `: any` / `as any`, 0 `@ts-ignore/@ts-nocheck` across 26,612 lines — genuinely rare and commendable.
- Route mix from the build: 20 static (`○`), 4 SSG-with-params (`●` — drips, DNA panels, journal, clinics), rest dynamic (`ƒ`).

---

## 2. Security 🔒 (handles medical PII — highest-priority section)

The existing `SECURITY_REMEDIATION_REPORT.md` claims were **verified against code and are real** — admin auth is legitimately hardened. The issues below are what remains.

**Strengths (verified):**
- Admin auth: HS256 JWT via `jose` with algorithm pinned, secret from `ADMIN_JWT_SECRET` that **fails closed** if unset (`src/lib/admin-jwt.ts`), bcrypt credential check (`src/lib/admin-auth.ts:40`), HttpOnly+Secure+SameSite=Strict cookie. No hardcoded/default credentials.
- Service-role key is **server-only** — never a `NEXT_PUBLIC_` var, never imported by a client component.
- No secrets committed (`.gitignore` covers `.env*`; only empty `.example` files tracked).
- No raw SQL / SQL injection — all DB access via the parameterized Supabase query builder.
- Security headers present in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP).
- User-data routes scope by `user.id` in addition to RLS (defense in depth).

**Findings (severity-ranked):**

| ID | Sev | Location | Issue |
|---|---|---|---|
| **H-1** | **High** | `src/app/api/webhooks/respondio/route.ts` | **No auth, no signature verification.** Writes to the patient CRM (`upsertPatient`, `messages`, `patient_timeline`) with the service-role key. Since upsert keys on `phone_normalized`, anyone who knows a patient's phone can overwrite their `full_name`/null their `email` and inject fake "inbound WhatsApp" messages into a clinical timeline — unauthenticated. *(Verified by direct read.)* |
| **M-1** | Med | `src/app/api/cron/dispatch-notifications/route.ts:5-10` | **Fails open** — the `CRON_SECRET` check is skipped entirely when the secret is unset (and it ships empty in `.env.local.example`). Anyone could force-dispatch queued WhatsApp notifications. |
| **M-2** | Med | `src/app/api/leads/route.ts:75-96` | Public endpoint sends **outbound WhatsApp to any attacker-supplied number** (`sendWhatsAppMessage(phone, welcome, name)`) with attacker-controlled name, and upserts patients. No rate limit / CAPTCHA → spam, cost, number-ban abuse. *(Verified by direct read.)* |
| **M-3** | Med | `src/app/api/bookings/route.ts:53-69` → `src/lib/auth/guest.ts` | Unauthenticated guest booking calls `auth.admin.createUser` per request with no rate limit → unbounded `auth.users` / `patients` / `bookings` creation (resource + quota exhaustion). |
| **M-4** | Med | `supabase/schema.sql:217-221`, `:291-295` | **RLS update policies have no column restriction.** `profiles_update_own` checks only `auth.uid() = id`, so a user with the public anon key can `PATCH` their own `referral_credits` to any value (self-granting discounts). Same class lets a user set `bookings.status='confirmed'`/change date directly. *(Verified by direct read.)* |
| **M-5** | Med | `src/app/api/admin/leads/route.ts` | Only admin route with **no in-handler auth** — trusts middleware alone (contradicts the "dual-layer" claim). Returns lead PII. Single point of failure. |
| L-1 | Low | `src/app/api/admin/patients/[id]/route.ts:43` | PostgREST `.or()` filter built from unauth-sourced `phone`/`email` → second-order filter injection. |
| L-2 | Low | `src/app/auth/login/page.tsx:20-47` | Open redirect — `redirectTo` pushed unvalidated (`?redirectTo=https://evil.com`). The auth **callback** already guards this correctly; reuse that check. |
| L-3 | Low | `src/lib/admin-rate-limit.ts` | Login rate-limit is in-memory and keyed on spoofable `X-Forwarded-For` (defeatable if not strictly behind Cloudflare). |
| L-4 | Low | `src/lib/admin-auth.ts:44-47` | Dev fallback reintroduces plaintext `===` password compare when `NODE_ENV !== production` — dangerous if a deploy misconfigures `NODE_ENV`. |
| L-5 | Low | `next.config.ts:13` | CSP allows `unsafe-inline`+`unsafe-eval` for scripts; no `Strict-Transport-Security` (HSTS) header. |
| L-6 | Low | `ResetPasswordForm.tsx:107` | 6-char minimum password. |

**Cannot verify from code (needs live check):** whether the RLS migrations are actually applied in the production Supabase project. There are **three overlapping bootstrap files** (`schema.sql`, `bootstrap.sql`, `RUN-THIS-ONCE.sql`) and the setup run-list in `.env.local.example` omits `leads.sql` and `invita-extensions.sql`, so a partial apply is plausible. The public anon key makes RLS the real boundary — confirm with Supabase advisors / `pg_policies`.

---

## 3. Architecture & code quality

**Strengths:** Clean App Router layout (`src/app` routes, `src/lib` data/domain, `src/store` zustand, `src/contexts`, `src/hooks`); consistent API-route shape with input caps and status codes; centralized brand constants (`src/lib/constants.ts`); a real design-token system in `globals.css` (navy `#0F2341` / ivory / gold `#D9B344`).

**Observations:**
- **`"use client"` on 105/164 components (64%)** — high for App Router. Content-heavy marketing pages (drip menu, About, legal) could be Server Components; the eager client boundary also forces the Supabase-client-at-render fragility seen in §1.
- **~7,489 lines of hand-written CSS** across `globals.css` + 3 `invita-*.css` files alongside Tailwind 4 — significant maintenance surface and two parallel styling systems (e.g. `contact/page.tsx` uses `container-invita`/inline hex while the rest uses `page-hero`/`section-inner`).
- Legacy **`input-sevres` / `label-sevres`** class names from the forked Sèvres template appear on ~every form (88 refs). Cosmetic/internal, but rename before it calcifies.
- Minor: 17 `console.*` left in `src`, 10 non-null `!` assertions, 9 inert `eslint-disable` (no ESLint config exists), `tsconfig.tsbuildinfo` is committed (should be gitignored).
- One `dangerouslySetInnerHTML` — only in `JsonLd.tsx` serializing structured data (safe). One raw `<img>` — only in the admin media library (acceptable).

---

## 4. SEO & structured data — A−

**Strong:** dynamic `src/app/sitemap.ts` (static routes + all drip/DNA/journal/clinic slugs), `src/app/robots.ts` (disallows `/admin`, `/api`, `/auth`, `/account`, `/bookings`), per-route `metadata` on 21 pages, and excellent JSON-LD in `src/lib/seo.ts` — `["MedicalBusiness","LocalBusiness"]` with opening hours/address/`sameAs`, plus per-drip `MedicalProcedure` + `Offer`/IQD price. Ideal for local medical search.

**Gaps:**
- **OG image is `/og/default.svg` (SVG)** — Facebook/Twitter/LinkedIn don't render SVG OG images. Ship a 1200×630 PNG/JPG. (Brand logo PNGs exist but no social card.)
- `hreflang` alternates map both `en-IQ` and `ar-IQ` to the **same URL** (no `/ar` route) — misleading to crawlers; either add real localized URLs or drop the alternate.
- `<html lang="en">` is static; Arabic never reaches the server, so AR pages aren't independently indexable.

---

## 5. Accessibility — B

Good: skip-link (`layout.tsx:109`), `next/image` used broadly (20 files) with alt text, semantic metadata, `next/font` with `display:swap`. Watch: gold `#D9B344` as the focus `--ring` on ivory may be borderline contrast; RTL/`lang` flip happens only after hydration (`LocaleContext.tsx:41-44`), so keyboard/AT users get an English-LTR flash; verify focus traps in `Modal`/`OverlayMenu`/`CustomSelect`.

---

## 6. i18n (EN/AR) — C — **biggest quality gap**

- **`next-intl` 4.13 is installed but has 0 imports** — dead dependency. All i18n is a custom client-only `LocaleContext` (localStorage-backed, no URL locale).
- Dictionaries `src/messages/en.json` / `ar.json` have **perfect key parity** — the translation content is done.
- **But only ~40–50% of visible copy actually switches to Arabic.** ~12 top pages are hardcoded English *even though the strings already exist in the dictionaries*:
  - `iv-therapy/page.tsx:30-63` hardcodes copy while `pages.ivHub.*` sits unused; same for `about/page.tsx` (`pages.about.*`), `contact/ContactForm.tsx` (`pages.contact.*`).
  - Fully hardcoded (no `useLocale`): `for-clinics`, `dna`, `locations`, `terms`, `privacy`, `journal`, `add-ons`, `partners`, `healthcare-network`, plus auth pages.
  - **Data layer is English-only where it matters most:** `LIQUIVIDA_DRIPS` (the 11 core products) has no `*Ar` fields — drip names/descriptions render English everywhere regardless of locale. Same for add-ons, DNA turnaround text, stylist bios.
- Result: switching to Arabic yields an RTL layout full of English. **This is the #1 launch blocker** — and much of the fix is low-effort wiring (connect existing dictionary keys; add `.ar` to the drip data).
- Currency formatting: booking uses `formatPrice` (always Latin "IQD") instead of the locale-aware `formatIqd` (`د.ع`).

---

## 7. UX, content & navigation — A− (with cleanup)

**Strengths:** The booking flow is genuinely polished — a **6-step** flow (Service → Clinician → Date/Time → Intake → Add-Ons → Confirm; the README says 5), with progress dots, Back on every step, gated Continue, loading + availability-retry states, guest fallback, and a success screen with booking ref + WhatsApp handoff. Server side validates required fields, blocks double-booking (409), and auto-provisions guest sessions. Every Navbar/Footer/OverlayMenu link resolves to a real route (no dead links); all partner PDFs exist.

**Content / cleanup findings:**
- **Fabricated testimonials** — `TESTIMONIALS` in `constants.ts:143-174` are 5 invented 5-star quotes ("Client, Baghdad"). The `Testimonials.tsx` renderer is **imported nowhere**, so nothing ships today — but it's one import from going live. Remove or replace with real, attributable reviews.
- **15 home components imported nowhere** (dead code): `Testimonials`, `CelebrityWellness`, `PatientStoriesSection`, `SocialWallSection`, `TeamSection`, `ClinicSpotlightSection`, `LeadCaptureBanner`, `UseCasesSection`, `ValuePropsGrid`, `BenefitsGallery`, `GalleryStrip`, `TrustBar`, `LiquividaPartnerSection`, `TransformationSection`, `TrustCredentials`.
- `src/data/celebrities.json` is `[]` (scaffolded feature, no data/render path).
- **Orphan routes:** `/partners/login` and `/partners/dashboard` have no inbound links (URL-only).

---

## 8. Tooling / CI — C

- **No CI** — `.github/workflows` is absent; nothing runs build/typecheck/tests on push.
- **No ESLint config** — the `npm run lint` script is broken under Next 16 (which removed `next lint`) and there's no `eslint.config.*`.
- **136 Playwright tests exist** (`tests/`: crash 26, functional 73, security 37; incl. iPhone 13 responsive) — but **`@playwright/test` is not in `package.json`**, so they can't run as-is. Wiring these into CI would be high leverage given the coverage already written.

---

## Prioritized action plan

**P0 — before/at launch (security + Arabic):**
1. Authenticate the Respond.io webhook (H-1) — shared secret / HMAC; reject unsigned.
2. Make the cron secret mandatory (M-1) — reject when unset, not "skip check".
3. Add rate limiting / CAPTCHA to `/api/leads` and guest booking (M-2, M-3).
4. Restrict RLS-updatable columns on `profiles`/`bookings` (M-4); add in-handler auth to `/api/admin/leads` (M-5).
5. **Confirm RLS is actually applied in the production Supabase project** (`pg_policies` / advisors) — reconcile the 3 overlapping bootstrap SQL files into one source of truth.
6. Wire the ~12 hardcoded pages to `useLocale` (dictionary keys already exist) and add `*Ar` fields to the drip/add-on/DNA data layer, or gate the AR toggle until it's complete.

**P1 — launch polish:**
7. Ship a real 1200×630 PNG OG image; fix/remove the same-URL `hreflang`.
8. Remove fabricated `TESTIMONIALS` and the 15 dead home components; delete or populate `celebrities.json`; link or remove `/partners/*` orphan routes.
9. Add HSTS; tighten CSP (nonce-based); validate the login `redirectTo`; raise password minimum.
10. Use `formatIqd` in the booking flow for Arabic currency.

**P2 — engineering hygiene:**
11. Add a GitHub Actions CI: `tsc --noEmit`, `next build`, and the Playwright suite (add `@playwright/test` to `devDependencies`).
12. Add an ESLint flat config; gitignore `tsconfig.tsbuildinfo`; drop the unused `next-intl` dependency.
13. Reduce the `"use client"` footprint on static content pages; consolidate the 7.5k lines of hand-CSS and the legacy `*-sevres` class names.

---

*Read-only evaluation — no application code was changed. Findings cite `file:line`; the top security items (H-1, M-2, M-4) were re-verified against source.*
