# Invita Design Language

> Iraq's premier luxury IV wellness platform — medical credibility with five-star hospitality.  
> **Technical implementation:** see [`figma-design-system-rules.md`](./figma-design-system-rules.md)  
> **Content authority:** [`invita-framer-content.md`](./invita-framer-content.md)

---

## Brand essence

Invita is the digital flagship of Baghdad's official Liquivida® USA distributor. The experience should feel closer to **Aman Resorts** or **Clinique La Prairie** than a marketing landing page: calm, editorial, discreet, and medically credible.

**Design for emotion first, features second.**

| Pillar | Expression |
|--------|------------|
| **Luxury** | Generous whitespace, restrained palette, editorial photography |
| **Medical trust** | Licensed professionals, Liquivida partnership, transparent pricing |
| **Privacy** | Private suites, discreet tone, no sensational claims |
| **Conversion** | Clear Book CTAs, IQD pricing, structured lead capture |

---

## Color palette

Official brand kit (Google Drive / `Invita IV/Colors/`):

| Token | Hex | Usage |
|-------|-----|-------|
| **Navy** | `#0F2341` | Primary text, buttons, footer background |
| **Periwinkle** | `#A0B1DD` | Secondary accent, soft highlights |
| **Gold** | `#D9B344` | Primary accent, links, hover, icon mark |
| **Ivory** | `#F0EDE4` | Page background, light sections |

CSS aliases (backward compatible): `--color-espresso` = navy, `--color-rose` = gold, `--color-ivory` = ivory.

**Rules:**
- Navy is the only primary dark. Do not use ad-hoc charcoals or the old espresso brown.
- Gold and periwinkle appear sparingly — one accent moment per section maximum.

---

## Typography

### Typography

| Role | Family | Weight range |
|------|--------|--------------|
| **Display** | Cormorant Garamond | 300–400 (headlines), italic for emphasis |
| **UI / Body / Brand** | Plain (brand kit) | 300–600 |

Plain is the official Invita wordmark typeface — loaded from `public/fonts/plain/`. DM Sans remains as fallback.

Arabic: same families with `latin-ext` subsets; test RTL line breaks on hero and nav.

### Scale

| Level | Mobile | Desktop | Class / element |
|-------|--------|---------|-----------------|
| Display H1 | 2.5rem | 5–6.5rem | `.hero-headline` |
| Section H2 | 2rem | 3.5rem | `.page-title` |
| Section H3 | 1.5rem | 2.25rem | `h3` |
| Eyebrow | 0.6875rem | 0.75rem | `.eyebrow`, `.page-eyebrow` |
| Lead | 1rem | 1.125rem | `.page-lead` |
| Body | 0.9375rem | 1rem | `p` |
| Caption | 0.75rem | 0.8125rem | disclaimers, legal |

**Rules:**
- Headlines: generous letter-spacing (`-0.01em`), light weight on heroes.
- Eyebrows: uppercase, `letter-spacing: 0.2em`, DM Sans.
- Body line-height: `1.75` for readability.
- No all-caps body text.

---

## Grid & layout

- **Container:** `.container-invita` — max-width `1280px`, horizontal padding `1.25rem` → `2rem` at `768px+`.
- **Section rhythm:** `.section-padding` = `6rem` vertical; `.section-padding-sm` = `4rem`.
- **Columns:** 12-column mental model; marketing grids typically 1 → 2 → 3 → 4 columns at `640` / `768` / `1024px`.
- **Content width:** Prose blocks max `640px` for editorial copy; full-bleed for heroes and galleries only.

---

## Spacing system

Base unit: **4px**. Use multiples consistently.

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Icon gaps |
| `sm` | 8px | Tight inline spacing |
| `md` | 16px | Card padding mobile |
| `lg` | 24px | Card padding desktop |
| `xl` | 32px | Between card groups |
| `2xl` | 48px | Sub-section gaps |
| `3xl` | 64px | Section internal header → content |
| `4xl` | 96px | Major section breaks |

---

## Buttons

| Variant | Appearance | Use |
|---------|------------|-----|
| **Primary** | Espresso fill, ivory text, pill radius, uppercase tracking | Main conversion: Book, Submit |
| **Secondary** | Espresso outline, transparent fill | Alternate actions on light backgrounds |
| **Hero primary** | Warm white fill on dark overlay | Hero CTA |
| **Hero secondary** | Ghost border on hero | Secondary hero action |
| **Small** | Reduced padding | Nav CTA, inline actions |

**Rules:**
- One primary button per viewport section.
- Hover: subtle opacity or `translateY(-1px)` — never scale or bounce.
- Minimum touch target: `44×44px` on mobile.

---

## Cards

| Type | Aspect | Treatment |
|------|--------|-----------|
| **Drip card** | 4:3 image + text below | `--radius-card`, `--shadow-card`, hover lift |
| **Trust card** | Icon + short copy | Rose-light background or ivory with border |
| **Celebrity tile** | 3:4 portrait slot | Upload-ready; neutral gradient when empty |
| **FAQ item** | Full width | Minimal border-bottom, no heavy boxes |

**Rules:**
- Shared `--radius-card` (`0.75rem`) and `--shadow-card`.
- No drop shadows on dark (footer) surfaces.
- Images: `object-fit: cover`, warm grade in production photography.

---

## Iconography

- **Library:** Lucide React only (`lucide-react`).
- **Size:** 14–18px inline with text; 20–24px in feature blocks.
- **Color:** Rose accent on light backgrounds; ivory/rose on dark.
- No emoji on premium surfaces (except temporary Liquivida badge flag until SVG kit).

---

## Image treatment

- **Hero:** Full-viewport (`100svh`), soft bottom gradient overlay, `object-position: center`.
- **Editorial:** Warm tones; avoid cold clinical stock.
- **Production rule:** No third-party clinic photography (e.g. competitor URLs).
- **Empty states:** Brand-neutral ivory → rose-light gradients until Invita photography is uploaded.
- **Alt text:** Descriptive, location-aware where relevant ("Invita IV suite, Baghdad").

### Ingested assets (dump folder)

Every file from `npm run ingest:dump` is **raw media**. Never drop it into the UI as-is.

| Asset type | Component | Variant |
|------------|-----------|---------|
| Hero / clinic photos | `MediaImage` or `MediaFrame` | `hero`, `editorial` |
| Infographics | `MediaImage` | `infographic` (+ label from `asset-labels.ts`) |
| Celebrity portraits | `MediaImage` | `portrait` |
| Instagram reels | `MediaFrame` | `reel` |
| PDFs | Download cards (science hub, certifications) | — |

**Presentation tokens:** `src/app/invita-assets.css` — ivory mats, espresso scrims, rose borders, serif captions.

**Rule:** If it came from the dump, it goes through `MediaFrame` / `MediaImage`. Match editorial luxury tone; no “asset folder” or stock-photo language in copy.

---

## Motion

| Pattern | Duration | Easing |
|---------|----------|--------|
| Fade in up | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Hover transitions | 300ms | ease |
| Nav overlay | 300ms | ease |

**Rules:**
- Animations support storytelling — never decorative loops.
- Always respect `prefers-reduced-motion: reduce` — disable transforms and entrance animations.
- Never sacrifice performance for animation (no heavy parallax, no auto-playing video heroes).

---

## Tone of voice

| Do | Don't |
|----|-------|
| Calm, assured, clinical | Hype, urgency tricks, "LIMITED TIME" |
| "Book a session" / "Request consultation" | "Buy now", "Don't miss out" |
| Transparent IQD pricing with assessment note | Hidden fees, vague "from" pricing |
| Discreet luxury | Flashy gradients, neon, influencer slang |
| Medical credibility (licensed professionals) | Unverified claims, miracle cures |

**Pricing disclaimer (standard):**  
*"Price includes a complimentary medical assessment. Your clinician may recommend adjustments based on your individual needs."*

---

## Component patterns (reusable)

Located in `src/components/patterns/`:

- `Section` — consistent vertical padding and backgrounds
- `PageHeader` — eyebrow + title + lead
- `InvitaCard` — shared card shell
- `PriceDisplay` — IQD formatting + disclaimer
- `CtaBand` — centered primary action
- `TrustStrip` — partner badges and credentials
- `MediaFrame` / `MediaImage` — all ingested photography, infographics, and reels

These patterns are designed for reuse across future Sahar Healthcare brands.

---

## Page principles

1. **One story per page** — reduce competing sections.
2. **IV Therapy is primary** — DNA Lab lives under Advanced Services (footer).
3. **Mobile-first** — optimize for Instagram and WhatsApp traffic.
4. **No placeholder social proof** — celebrity IV section uses upload-ready slots; no fake patient reviews.
5. **Journal hidden** until real educational content exists.
6. **SEO & accessibility** — semantic HTML, labels, skip link, hreflang for EN/AR.

---

## Implementation checklist

Before shipping any page:

- [ ] Colors from `@theme` tokens only
- [ ] Cormorant headings, DM Sans body
- [ ] Section uses `Section` or `.section-padding` + `.container-invita`
- [ ] Primary CTA uses `.btn-primary`
- [ ] Dump assets via `MediaImage` / `MediaFrame` (not raw `<Image>`)
- [ ] Icons via `lucide-react`
- [ ] Copy matches content doc or `messages/*.json`
- [ ] `npm run build` passes with zero warnings
- [ ] Tested in Arabic RTL

---

*Version 1.0 — Premium Rebuild Phases 0–6. Update when photography and celebrity assets are added in Phase 7.*
