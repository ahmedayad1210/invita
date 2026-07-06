# Invita launch checklist

Use this after code is ready and before pointing a custom domain.

## Status (2026-07-05)

- [x] Custom domain live: **https://invitadrips.com**
- [x] All primary routes return 200
- [x] Partner PDFs under `/resources/` verified
- [x] Netlify dashboard env: `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` = `https://invitadrips.com` + redeploy
- [ ] Supabase auth Site URL + redirect URLs — see **`docs/SUPABASE-AUTH-SETUP.md`**
- [ ] Full manual QA (booking, leads, admin login)

See **`docs/LAUNCH-EVALUATION.md`** for the full audit report.

## 1. Assets

- [ ] Run `npm run ingest:dump` with full Invita dump (logos, hero, infographics, Plain font)
- [ ] Verify `/public/fonts/plain/` and `/public/images/invita/` exist locally
- [ ] Optional: `npm run scrape:instagram`, `npm run process:celebrities` when content is approved
- [ ] Commit generated assets or upload via CI artifact step

## 2. Supabase

- [ ] Dedicated Invita project (not Sahar)
- [ ] Run `supabase/schema.sql`, `invita-extensions.sql`, `leads.sql`, `certifications.sql`
- [ ] Set auth redirect URLs to production domain + `/auth/callback`

## 3. Netlify environment

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (leads, admin APIs) |
| `NEXT_PUBLIC_SITE_URL` | Yes (SEO, sitemap, OG) |
| `NEXT_PUBLIC_APP_URL` | Yes (auth redirects) |
| `ADMIN_JWT_SECRET` | Yes |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | Yes |
| EmailJS vars | Optional |

## 4. Deploy

1. [app.netlify.com](https://app.netlify.com) → Import `ahmedayad1210/invita`
2. Build uses `netlify.toml` automatically
3. Confirm build passes (`npm run build` locally first)
4. Set custom domain when ready (`invitadrips.com`)

## 5. Post-deploy QA

Run `docs/design-qa-checklist.md` at 375px / 768px / 1280px in EN and AR.

Priority manual checks:

- [ ] Homepage hero + gallery images load
- [ ] Booking flow shows **IQD** pricing
- [ ] `/book` completes (or saves to Supabase)
- [ ] Contact form + lead banner save to `leads` table
- [ ] Admin login at `/admin`
- [ ] WhatsApp / call FABs work on mobile

## 6. Content still on you

These are intentionally deferred until real assets/copy are approved:

- Celebrity gallery photos (gradient placeholders shown until upload)
- Clinic profile photography in healthcare network
- Certification QR / registration numbers in verify section
- Journal articles (coming-soon page; `/journal` is noindex)

---

*Invita is separate from Sahar Healthcare. Do not share repos, env files, or Supabase projects.*
