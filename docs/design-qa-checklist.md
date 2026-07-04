# Invita Design QA Checklist

> Run before launch. Inspect every route at **375px**, **768px**, and **1280px** in EN and AR.

## How to use

1. Open each URL listed below.
2. Check every row for that page.
3. Mark **Pass** / **Fail** / **N/A**.
4. Log failures with screenshot + file path.

---

## Global (all pages)

| Check | Pass |
|-------|------|
| Espresso `#2C1810` only — no `#1a1a1a` drift | ☐ |
| Cormorant headings, DM Sans body | ☐ |
| Section padding rhythm consistent (`section-padding` / `section-padding-sm`) | ☐ |
| Primary CTA uses `.btn-primary` — one per viewport section | ☐ |
| CTA copy answers "What happens next?" (hint line below) | ☐ |
| `cta-hint` visible on conversion sections | ☐ |
| Icons 14–20px, Lucide only | ☐ |
| Card radius `0.75rem`, pill buttons | ☐ |
| Hover states subtle — no bounce/flash | ☐ |
| `prefers-reduced-motion` disables animations | ☐ |
| Skip link focuses `#main-content` | ☐ |
| No competitor / stock hospital imagery | ☐ |
| Arabic RTL: nav, footer, forms readable | ☐ |
| No horizontal scroll on mobile | ☐ |
| All links resolve (no `#` stubs) | ☐ |

---

## Routes

### `/` Homepage

| Check | Pass |
|-------|------|
| Hero: full-screen, editorial type, 2 CTAs | ☐ |
| Emotional flow: Trust → Education → Transformation → Booking | ☐ |
| TrustCredentials grid readable on mobile | ☐ |
| About section: reduced text density | ☐ |
| Transformation section image + 3 steps | ☐ |
| Celebrity slots: gradient placeholders only | ☐ |
| Lead capture submits to Supabase | ☐ |

### `/about`

| Check | Pass |
|-------|------|
| Team cards aligned, bios not wall-of-text | ☐ |
| CTA: "Reserve Your Appointment" + hint | ☐ |

### `/iv-therapy` + `/iv-therapy/[slug]`

| Check | Pass |
|-------|------|
| IQD pricing visible on hub + detail | ☐ |
| Pricing disclaimer present | ☐ |
| CTA: "Start Your Consultation" | ☐ |
| 18 slugs all render | ☐ |

### `/book`

| Check | Pass |
|-------|------|
| Framed as consultation journey (not checkout) | ☐ |
| Trust strip under header | ☐ |
| Step labels: protocol → clinician → visit → profile → confirm | ☐ |
| Pricing disclaimer in step 1 | ☐ |
| `?drip=slug` prefill works | ☐ |
| Post-booking WhatsApp link | ☐ |

### `/membership`, `/dna`, `/add-ons`, `/contact`, `/faq`, `/locations`

| Check | Pass |
|-------|------|
| Premium CTA copy (not generic "Book Now") | ☐ |
| Page hero spacing consistent | ☐ |
| No orphaned sections / dead ends | ☐ |

### Navigation & chrome

| Check | Pass |
|-------|------|
| Nav CTA: "Reserve Your Appointment" | ☐ |
| Mobile menu: focus trap / escape closes | ☐ |
| Sticky bar: Book + Call + WhatsApp | ☐ |
| WhatsApp FAB + Call FAB don't overlap | ☐ |
| Footer: Advanced Services column (DNA, Membership) | ☐ |
| Journal not in footer | ☐ |

### `/404`, loading states

| Check | Pass |
|-------|------|
| 404 on-brand, localized EN/AR | ☐ |
| LoadingSpinner: luxury ring + uppercase message | ☐ |

---

## Performance & SEO

| Check | Target |
|-------|--------|
| Lighthouse Performance (mobile) | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| `sitemap.xml` valid | ☐ |
| `robots.txt` excludes `/journal` | ☐ |
| JSON-LD on home + drip pages | ☐ |
| OG image `/og/default.svg` | ☐ |

---

## Accessibility

| Check | Pass |
|-------|------|
| Form inputs have labels (`sr-only` OK) | ☐ |
| FAQ accordions: `aria-expanded` | ☐ |
| Color contrast ≥ 4.5:1 body text | ☐ |
| Touch targets ≥ 44px mobile | ☐ |

---

## Content & trust (Phase 7)

| Item | Status |
|------|--------|
| Baghdad clinic photography replaces Unsplash | ☐ |
| Celebrity gallery photos uploaded | ☐ |
| Google Reviews embed / link | ☐ |
| Real patient stories (with permission) | ☐ |
| `supabase/leads.sql` run in production | ☐ |
| `NEXT_PUBLIC_SITE_URL` set | ☐ |

---

## Automated smoke (optional)

```bash
cd ~/invita
npm run build
# Manual: preview at 375px / 768px / 1280px
npm run dev -- -p 3002
```

---

*Generated for Invita Premium Experience — Final Creative Pass.*
