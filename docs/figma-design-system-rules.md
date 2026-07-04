# Invita — Figma MCP Design System Rules

> **Repo:** `/Users/ahmedalnuaimi/invita`  
> **Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · Supabase  
> **Content source of truth:** `docs/invita-framer-content.md` (copy, IA, section order)  
> **Use this doc** when implementing Figma designs via the Figma MCP (`get_design_context`, `use_figma`, Code Connect).

---

## 1. Token Definitions

### Where tokens live

| Layer | Path | Purpose |
|-------|------|---------|
| **Tailwind theme** | `src/app/globals.css` → `@theme { }` | Canonical design tokens (colors, type scale, radii, shadows, z-index) |
| **Page patterns** | `src/app/invita-pages.css` | Marketing/booking section classes (hero, cards, carousels) |
| **Brand constants** | `src/lib/constants.ts` → `INVITA` | Contact, hours, taglines, nav links |
| **i18n copy** | `src/messages/en.json`, `src/messages/ar.json` | User-facing strings for locale toggle |
| **Reference images** | `src/lib/invita/framer-assets.ts` → `FRAMER_IMAGES` | Placeholder URLs until Invita photography exists |

### Color tokens (map Figma → CSS)

```css
/* src/app/globals.css @theme */
--color-ivory:        #FAF7F2;   /* page background */
--color-espresso:     #2C1810;   /* primary text, primary buttons */
--color-rose:         #C4956A;   /* accent / links / hover */
--color-gold:         #B8965A;   /* secondary accent, dividers */
--color-muted:        #8B7355;   /* body / secondary text */
--color-warm-white:   #FFFFFF;
--color-rose-light:   #F0E8DF;
--color-overlay:      rgba(44, 24, 16, 0.92);
```

**Figma naming suggestion:** `Ivory/Background`, `Espresso/Primary`, `Rose/Accent`, `Gold/Accent`, `Muted/Text`.

### Typography tokens

```css
--font-serif: var(--font-cormorant), 'Cormorant Garamond', Georgia, serif;
--font-sans:  var(--font-dm-sans), 'DM Sans', 'Helvetica Neue', sans-serif;
```

Loaded in `src/app/layout.tsx` via `next/font/google`:

- **Cormorant Garamond** — headings, display (`--font-cormorant`)
- **DM Sans** — UI, body, buttons, nav (`--font-dm-sans`)

| Role | CSS class / element | Figma style |
|------|---------------------|-------------|
| Display H1 | `.hero-headline` | Cormorant 300, clamp 2.5–6.5rem |
| Section H2 | `.page-title`, `h2` | Cormorant 400, clamp 2–3.5rem |
| Eyebrow | `.eyebrow`, `.page-eyebrow`, `.hero-eyebrow` | DM Sans 0.6875rem, letter-spacing 0.2–0.25em, uppercase |
| Body | `p`, `.page-lead` | DM Sans, `#8B7355`, line-height 1.75 |

### Spacing & layout

```css
--spacing-section: 6rem;      /* .section-padding */
--spacing-section-sm: 4rem;   /* .section-padding-sm */
--radius-pill: 9999px;        /* buttons, navbar */
--radius-card: 0.75rem;       /* cards */
```

**Container:** `.container-invita` — max-width `1280px`, responsive horizontal padding.

### Token transformation

- **No Style Dictionary / Tokens Studio pipeline** — tokens are hand-maintained in `globals.css` `@theme`.
- When adding Figma variables, mirror them in `@theme` first, then use Tailwind utilities (`bg-ivory`, `text-charcoal`) or existing CSS classes.
- **Do not** introduce a second color system (e.g. navy Framer prototype) without updating `@theme` and this doc.

---

## 2. Component Library

### Architecture

Feature-oriented folders under `src/components/`:

```
src/components/
├── brand/          # LiquividaBadge
├── layout/         # Navbar, Footer, PromoStrip, OverlayMenu
├── home/           # Homepage sections (one file ≈ one Figma section)
├── booking/        # Multi-step booking flow
├── services/       # IV menu cards, filters
├── admin/          # Staff portal
├── auth/           # Login guards, forms
└── ui/             # Shared primitives (Button, Modal, Toast, …)
```

### Reusable primitives (`src/components/ui/`)

| Component | File | Notes |
|-----------|------|-------|
| Button | `Button.tsx` | `variant`: primary \| secondary \| ghost; maps to `.btn-*` in globals |
| Modal | `Modal.tsx` | Overlay dialogs |
| Toast | `Toast.tsx` | Notifications |
| LoadingSpinner | `LoadingSpinner.tsx` | Async states |
| InitialsAvatar | `InitialsAvatar.tsx` | Testimonials, account |
| CustomSelect | `CustomSelect.tsx` | Forms |
| NavigationProgress | `NavigationProgress.tsx` | Route transition bar |

### Marketing section components (homepage ↔ Figma frames)

Map Figma sections to these files **in build order** (`docs/invita-framer-content.md`):

| # | Figma section | Component |
|---|---------------|-----------|
| 1 | Navbar | `layout/Navbar.tsx` |
| 2 | Hero | `home/HeroSection.tsx` |
| 3 | Trust bar | `home/TrustBar.tsx` |
| 4 | Reviews | `home/Testimonials.tsx` |
| 5 | Lead capture | `home/LeadCaptureBanner.tsx` |
| 6 | About | `home/AboutLiquividaSection.tsx` |
| 7 | How it works | `home/HowItWorks.tsx` |
| 8 | Value props | `home/ValuePropsGrid.tsx` |
| 9 | Treatment menu | `home/ServicesPreview.tsx` |
| 10 | Add-ons | `home/AddOnsPreview.tsx` |
| 11 | Use cases | `home/UseCasesSection.tsx` |
| 12 | Social wall | `home/SocialWallSection.tsx` |
| 13 | Liquivida partner | `home/LiquividaPartnerSection.tsx` |
| 14 | FAQ | `home/FaqPreview.tsx` |
| 15 | Footer CTA | `home/FooterCtaBanner.tsx` |
| 16 | Footer | `layout/Footer.tsx` |

**No Storybook.** No shadcn/ui. Extend existing components before creating parallel ones.

### Component patterns

```tsx
// Section wrapper (preferred for new marketing blocks)
<section className="section-padding">
  <div className="section-inner">
    <header className="page-hero">
      <p className="page-eyebrow">Eyebrow</p>
      <h2 className="page-title">Headline</h2>
      <p className="page-lead">Supporting copy</p>
    </header>
    {/* content */}
    <div className="cta-band">
      <Link href="/book" className="btn-primary">CTA</Link>
    </div>
  </div>
</section>
```

```tsx
// Client-only when needed (hooks, state)
"use client";
```

---

## 3. Frameworks & Libraries

| Tool | Version | Usage |
|------|---------|-------|
| **Next.js** | 16.x | App Router, `src/app/**/page.tsx`, Server + Client Components |
| **React** | 19 | UI |
| **TypeScript** | 5 | Strict mode |
| **Tailwind CSS** | 4 | `@import "tailwindcss"` + `@theme` in `globals.css` |
| **Supabase** | SSR | Auth, bookings, services (`src/lib/supabase/`) |
| **Zustand** | 5 | Booking wizard state (`src/store/bookingStore.ts`) |
| **lucide-react** | icons | **Only** icon library — no custom SVG sprite |
| **next/font** | Google Fonts | Cormorant Garamond, DM Sans |

**Build:** `npm run dev` · `npm run build` (webpack via Next 16 defaults in this project).

**Path alias:** `@/*` → `src/*` (`tsconfig.json`).

---

## 4. Asset Management

### Images

- **Next.js Image** (`next/image`) for all remote and local photos.
- **Remote allowlist:** `next.config.ts` → `images.remotePatterns`:
  - `images.unsplash.com`
  - `theelixirclinic.com` (placeholder reference photography)
- **CSP:** `img-src` must include any new CDN host before use.

```tsx
import Image from "next/image";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";

<Image
  src={FRAMER_IMAGES.clinicHero}
  alt="Descriptive alt"
  fill
  priority          // LCP hero only
  sizes="100vw"     // required with fill
  style={{ objectFit: "cover" }}
/>
```

### Static files

- `public/favicon.svg` — site icon
- Production photography: add to `public/images/invita/` and update `framer-assets.ts`

### Optimization

- Hero: `priority` + `sizes`
- Below-fold: default lazy loading
- Replace reference URLs with Cloudinary or `public/` assets for production

---

## 5. Icon System

- **Library:** `lucide-react` only
- **Import:** `import { ArrowRight, Menu, X } from "lucide-react"`
- **Sizing:** typically `size={14}`–`18` inline with text; stroke icons, no fill set
- **No** `/public/icons` folder or icon font
- **Brand badge:** emoji flag in `LiquividaBadge` (`🇺🇸`) — replace with SVG when Liquivida media kit available

**Figma icons:** export as SVG only if not available in Lucide; add as inline React component in `src/components/icons/` (create folder if needed).

---

## 6. Styling Approach

### Methodology

**Hybrid — not CSS Modules, not styled-components:**

1. **Global design system** — `src/app/globals.css` (tokens, buttons, navbar, typography, animations)
2. **Marketing overrides** — `src/app/invita-pages.css` (hero, carousels, partner sections)
3. **Tailwind utilities** — sparse use on `body` (`bg-ivory text-charcoal antialiased`)
4. **Inline styles** — legacy pattern in Navbar/Footer for hover states; **prefer CSS classes** for new Figma implementations

### Button classes

| Class | Use |
|-------|-----|
| `.btn-primary` | Dark espresso fill, pill, uppercase tracking |
| `.btn-secondary` | Outline on light backgrounds |
| `.btn-hero-primary` | White fill on dark hero overlay |
| `.btn-hero-secondary` | Ghost on hero |
| `.btn-sm` | Compact nav CTA |

### Responsive

- Mobile-first breakpoints in CSS: `768px`, `1024px`, `1280px`
- `.desktop-nav` / `.desktop-cta` hidden on mobile; hamburger + `.overlay-menu` for nav
- Typography: `clamp()` on headings (globals + component-level)

### RTL (Arabic)

- `LocaleProvider` sets `document.documentElement.dir` to `rtl` | `ltr`
- Use logical properties where possible (`margin-inline`, `text-align: start`)
- Test nav overlay and carousels in Arabic after Figma changes

---

## 7. Project Structure

```
invita/
├── src/
│   ├── app/                    # Routes (App Router)
│   │   ├── layout.tsx          # Root layout, fonts, providers
│   │   ├── page.tsx            # Homepage composition
│   │   ├── globals.css         # Design tokens + core components
│   │   ├── invita-pages.css    # Marketing page styles
│   │   ├── iv-therapy/         # 18 drip pages
│   │   ├── book/               # Booking wizard
│   │   ├── admin/              # Staff portal
│   │   └── api/                # Route handlers
│   ├── components/             # UI (see §2)
│   ├── contexts/               # Locale, Auth
│   ├── hooks/                  # useBooking, etc.
│   ├── lib/
│   │   ├── constants.ts        # Brand, nav, seed data
│   │   └── invita/             # Domain content (drips, FAQ, assets)
│   └── messages/               # en.json, ar.json
├── docs/
│   ├── invita-framer-content.md
│   └── figma-design-system-rules.md  # this file
└── supabase/                   # Schema SQL
```

### Route groups (mental model)

| Area | Routes |
|------|--------|
| Marketing | `/`, `/about`, `/faq`, `/iv-therapy`, `/add-ons`, `/membership` |
| Conversion | `/book`, `/contact` |
| Account | `/account`, `/auth/*` |
| Ops | `/admin/*` |

---

## 8. Figma MCP Workflow (Invita-specific)

### Design → code

1. Load skill: `figma-use` before `use_figma` / `get_design_context`
2. Call `get_design_context` with `fileKey` + `nodeId` (convert `-` to `:` in node IDs)
3. **Do not paste Figma export verbatim** — map to:
   - Existing section component if frame matches homepage order
   - Tokens from `@theme` / classes in `globals.css`
   - Copy from `docs/invita-framer-content.md` when text is specified
4. Use `next/image`, `Link` from `next/link`, `LiquividaBadge` for partner marks

### Canonical Figma file

| Field | Value |
|-------|-------|
| **File** | [Invita Design System](https://www.figma.com/design/k7pVTLWxWQPRrJIuTizvDE) |
| **fileKey** | `k7pVTLWxWQPRrJIuTizvDE` |
| **Pages** | Cover · Foundations (color + type) · Screens (html-to-design captures) |

### Code → Figma

1. Load `figma-generate-design` skill
2. Call `search_design_system` before creating new Figma components
3. Push screens via `generate_figma_design` (localhost + `#figmacapture=`) or `use_figma`
4. Dev helper: `FigmaCaptureLoader` in `layout.tsx` — no-op unless hash contains `figmacapture`

### Code Connect (optional)

- Template files: `*.figma.ts` with `@figma/code-connect`
- Map published Figma components → `src/components/ui/Button.tsx`, `LiquividaBadge`, etc.
- Add `"types": ["@figma/code-connect/figma-types"]` to `tsconfig.json` if using Code Connect

---

## 9. Implementation Checklist (per Figma frame)

- [ ] Copy matches `docs/invita-framer-content.md` (not stale Framer prototype text)
- [ ] Colors use `@theme` tokens (ivory / espresso / rose / gold / muted)
- [ ] Headings: Cormorant; UI/body: DM Sans
- [ ] Section uses `.section-padding` + `.section-inner` or `.container-invita`
- [ ] CTAs use `.btn-primary` / `.btn-hero-*` — label "Book Now" / "Book Your Session" per doc
- [ ] Images via `next/image` + allowlisted host
- [ ] Icons via `lucide-react`
- [ ] Client interactivity marked `"use client"`
- [ ] Arabic: strings in `messages/ar.json` if user-facing in nav/hero
- [ ] `npm run build` passes

---

## 10. Anti-patterns (do not do from Figma exports)

- ❌ Raw hex colors inline without adding to `@theme`
- ❌ New UI kit (shadcn, MUI, Chakra) — extend `src/components/ui/`
- ❌ `<img>` for content photos — use `next/image`
- ❌ Hardcoded English in `Navbar`/`Hero` — use constants or `messages/*.json`
- ❌ Duplicate homepage sections — edit existing `home/*.tsx` files
- ❌ Framer prototype nav (Protocols / VIP Lounge) unless product explicitly changes IA
- ❌ `theelixirclinic.com` images in production without replacement plan

---

*Generated for Figma MCP integration. Update when tokens or component boundaries change.*
