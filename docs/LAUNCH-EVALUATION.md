# Invita launch evaluation — invitadrips.com

**Date:** 2026-07-05  
**Domain:** https://invitadrips.com (301 from www)  
**Stack:** Next.js on Netlify · Supabase auth/leads · static Invita dump assets

---

## Executive summary

The site is **live and functional** on the custom domain. All primary routes return HTTP 200. PDF resources, Instagram WebP tiles, and IV catalogue content load correctly. This pass focused on **first-paint speed**, **SEO/canonical URLs**, and **launch hygiene**.

### Done in this release

| Area | Change |
|------|--------|
| DNS / SEO | `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_APP_URL` → `https://invitadrips.com` in `netlify.toml` and `netlify.env` |
| Performance | Homepage below-fold sections code-split with skeleton placeholders |
| Performance | Science CSS loaded only on `/science` (removed from global layout) |
| Performance | Gallery topic rows + reels lazy-render on scroll; reels paginated (3 at a time) |
| Performance | Long-cache headers for `/images/*`, `/fonts/*`, `/resources/*`, `/media/*` |
| Performance | Hero image `quality={75}`; Cormorant font trimmed to 3 weights |
| Content | Instagram `websiteUrl` → HTTPS |

### Requires manual action (Netlify / Supabase dashboard)

1. **Supabase Auth** — follow **`docs/SUPABASE-AUTH-SETUP.md`** (Site URL + redirect URLs for `invitadrips.com`)
2. **Rotate secrets** if any keys were shared in chat (service role, admin JWT).

### Added 2026-07-06

| Area | Change |
|------|--------|
| Auth | `/auth/callback` route for email confirmation PKCE flow |
| Auth | `emailRedirectTo` on sign-up |
| Instagram | Scrape expanded to **49 posts** (25 reels) |
| Docs | `docs/SUPABASE-AUTH-SETUP.md` step-by-step guide |

---

## Route audit (2026-07-05)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | 200 | Hero + curated sections |
| `/iv-therapy` | 200 | 11 Invita catalogue drips |
| `/book` | 200 | IQD pricing |
| `/science` | 200 | PDF downloads |
| `/for-clinics` | 200 | B2B partner flow |
| `/healthcare-network` | 200 | 37 clinics, 8 featured on homepage |
| `/contact` | 200 | Lead capture |
| `/auth/login` | 200 | Supabase auth |
| `/admin` | 200 | JWT admin dashboard |
| `/about`, `/faq`, `/terms`, `/privacy` | 200 | Legal + info |

All 8 partner PDFs under `/resources/*.pdf` return **200**.

---

## Performance notes

**Before:** Global CSS included science-hub styles; homepage loaded gallery (17 infographics + 6 reels + Instagram grid) in one bundle.

**After:**

- Above-fold: Navbar, hero, trust, stats, science spotlight, services preview, about, how-it-works load first.
- Below-fold: Gallery, training, partners, clinics, stories, Instagram are dynamically imported.
- Gallery infographics beyond the first topic row defer until near viewport.
- Reels load 3 initially; user expands on demand.
- Instagram grid shows 6 tiles initially (expand to 8+).

**Hero LCP:** `hero.webp` ~369 KB — acceptable for full-bleed lifestyle shot. Further optimization: run `npm run ingest:dump` with tighter WebP quality or serve responsive srcset.

---

## Content & UX status

| Item | Status |
|------|--------|
| IV drip catalogue | ✅ 11 Invita protocols (PDF-aligned) |
| Category drip images | ✅ Via `imageSlug` / elixir mapping |
| Homepage gallery | ✅ 17 infographics by topic |
| Featured clinics | ✅ 8 curated (not all 37) |
| Instagram feed | ✅ 49 HQ WebP posts scraped (146 on profile; pagination ongoing) |
| Celebrity placeholders | ⏳ Gradient placeholders until real assets approved |
| Journal | ⏳ Coming soon (`noindex`) |
| Certification QR numbers | ⏳ Awaiting real registration data |

---

## Auth & booking checklist

- [ ] Register new user → email verification UX (if Supabase confirmation enabled)
- [ ] Login after email confirm
- [ ] Password reset redirect uses `NEXT_PUBLIC_APP_URL`
- [ ] `/book` saves booking to Supabase
- [ ] Contact form + lead banner → `leads` table
- [ ] Admin login at `/admin` with env credentials

---

## Post-deploy verification

After redeploy, confirm:

```bash
curl -s https://invitadrips.com/sitemap.xml | head -5
# Should show https://invitadrips.com not netlify.app

curl -sI https://invitadrips.com/images/invita/hero.webp | grep -i cache-control
# Should show max-age=604800
```

---

## Recommended next steps

1. Redeploy Netlify with updated env → fixes sitemap/canonical
2. Complete Supabase auth URL configuration
3. Run `npm run scrape:instagram` after rate-limit cooldown for more of 145 posts
4. Replace celebrity/clinic placeholder photography when assets are ready
5. Enable EmailJS vars for contact/booking email notifications (optional)
6. Add Playwright E2E in CI once `@playwright/test` is installed

---

*Invita is separate from Sahar Healthcare. Do not share repos, env files, or Supabase projects.*
