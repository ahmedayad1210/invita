# Handoff: Invita IV Drips Website — Lapis & Bone + Modern layer

## Overview
Bilingual (EN / Arabic-RTL) marketing + booking site for **Invita**, Iraq's first registered IV-vitamin-therapy brand (official Liquivida® USA distributor, Via Tonic Scientific Bureau — Erbil, registered with the Iraqi Ministry of Health). Five pages: **Home, IV Menu, Science, Partners, Drip detail** (hash-routed, 13 slugs). Primary conversion: WhatsApp booking (`+964 774 888 5559`).

This revision covers:
1. **Home consolidation** — 25 sections → 19 (see Screens).
2. **Lapis & Bone palette** across all five pages (replaces navy `#0F2341` / gold `#D9B344`).
3. **Modern layer** on Home — floating pill nav, inset rounded panels, tighter display type, hero glow, grain.

Target codebase: `ahmedayad1210/invita` (Next.js App Router, `src/app`, `src/components`, `src/messages` for i18n, deployed on Netlify, domain invitadrips.com).

## About the Design Files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing intended look and behavior, **not production code to copy**. Recreate them in the existing Next.js codebase using its established patterns (components in `src/components`, copy in `src/messages/{en,ar}.json`, data in `src/data`, fonts in `public/fonts`, images in `public/images`). Don't ship `support.js`. It's the prototype runtime.

How to read a `.dc.html`: the markup between `<x-dc>` tags is the template (`{{ path }}` = data hole, `<sc-for>` = loop, `<sc-if>` = conditional). The `class Component` script at the bottom holds state, handlers and the full **EN/AR copy dictionaries**. All the CSS layers are in the `<style>` block inside `<helmet>`.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy (EN + AR) and motion are final. The Arabic copy was professionally refined, so use it verbatim.

## Design Tokens — Lapis & Bone

### Colors
| Token | Hex | Use |
|---|---|---|
| `--color-bg` (bone) | `#F2EDE3` | page ground |
| `--color-surface` | `#E8E1D2` | strips, B2B band, trust strip |
| `--color-surface-2` | `#FAF6EE` | light panels (#celebs #how #standard #book #membership), nav glass tint |
| `--color-accent` (lapis) | `#0D2551` | headings/ink on bone, dark bands, primary text |
| lapis deep | `#0A1C3E` / `#071630` / `#050F22` | gradient stops, 600/800/900 |
| `--color-gold` (champagne) | `#C3A15A` | accents, progress bar, focus ring, CTA fill |
| `--color-gold-700` | `#8A6E2E` | gold text on bone (AA), links, hairlines |
| champagne light | `#D6B771`, `#B08F45`, `#E8D5A6` | poster-close gradient, progress-bar tail |
| `--color-neutral-900` (ink) | `#171A20` | body text on bone |
| accent tints | `#E2E7F3` `#CBD5EB` `#93A8D8` `#6E86C0` `#4A6096` | 100–500 scale |
| neutrals | `#EBE7D9` `#E0DBC9` `#CEC8B2` `#B0AA92` `#918B73` `#736E58` `#585443` `#3C392E` | 100–800 |
| divider | `color-mix(in srgb,#8A6E2E 32%,transparent)` | 2px section rules |

### Gradients
- Hero: `linear-gradient(160deg,#081426,#0D2551 55%,#0C1E38)` over the photo `uploads/hero-clinic.jpg` (opacity .78, `object-position:72% 28%`).
- Dark bands (Doctors, Stats): `radial-gradient(120% 130% at 50% -10%,#1B3A6B 0%,#123056 38%,#0A1F42 72%,#061229 100%)`, with the brand mark tiled at 150px / 5% opacity and a 4px gold dot-grain overlay (`rgba(217,179,68,.09)`, `mix-blend-mode:overlay`, opacity .55).
- Poster close: `linear-gradient(150deg,#D6B771,#C3A15A 45%,#B08F45)`, text `#0D2551`.
- Scroll progress bar: fixed, 3px, `linear-gradient(90deg,#8A6E2E,#C3A15A 55%,#E8D5A6)`, scaleX driven by root scroll.
- Section divider `hr.hr`: 64px × 2px, radius 2px, `linear-gradient(to right, #8A6E2E@60%, #8A6E2E@14%)`.

### Typography
- Latin: **"Plain"** (self-hosted OTF, 300/400/500/600–800), fallback Alexandria.
- Arabic / RTL: **Alexandria** (Google, 300–800) for everything. In RTL `letter-spacing:0` everywhere.
- Modern layer (LTR only):
  - H1: `clamp(40px,6.6vw,104px)`, weight 600, line-height .98, letter-spacing -.045em.
  - H2: weight 600, line-height 1.1, letter-spacing -.03em (base size `clamp(28px,…,46px)` from the section styles).
- Eyebrow/kicker labels: uppercase, 11.5px, letter-spacing .18em (RTL 13px, no tracking, no uppercase).
- Body 15–16px / 1.7. Prices use `font-feature-settings:'tnum'`. Headings use `text-wrap:balance`, body `text-wrap:pretty`.

### Radii
- Base tokens: sm 6, md 10, lg 14.
- Modern layer:
  - Cards/articles 22px; figures and menu image frames 18px.
  - Panels/bands `clamp(22px,3vw,36px)`; hero bottom corners 36px (26px ≤760px).
  - Buttons and nav 999px (nav 22px ≤760px); video reels 18px.

### Shadows
- Card hover: `0 26px 52px rgba(15,35,65,.15), 0 0 0 1px #8A6E2E@30%`.
- Nav (modern): `0 10px 40px rgba(13,37,81,.08), inset 0 1px 0 rgba(255,255,255,.6)`.
- Primary CTA (modern): `0 8px 24px rgba(195,161,90,.35), inset 0 1px 0 rgba(255,255,255,.4)`.
- Button hover: `0 12px 26px rgba(15,35,65,.2)`.
- Reels: `0 18px 44px rgba(0,0,0,.45)`.

### Spacing
- Content max-width 1200px.
- Horizontal gutter `clamp(20px,5vw,72px)`.
- Section vertical padding `clamp(48px,6vw,88px)`; dark bands `clamp(44px,5vw,72px)`.
- Grid gaps 16–48px.
- Modern inset panels sit `clamp(6px,1vw,14px)` from the viewport edge.

## Modern layer (Home) — exact spec
Scoped under `[data-modern="on"]` on the page root (a prop in the prototype; in production make it the default styling):
- **Grain**: fixed full-viewport overlay, SVG fractalNoise (baseFrequency .85, 3 octaves), opacity .07, `mix-blend-mode:multiply`, `pointer-events:none`, z-index 70.
- **Nav**:
  - Sticky at `top:12px`, `max-width:min(1200px, 100% - 24px)`, centered, pill radius.
  - Background `#FAF6EE` at 62%, `backdrop-filter: blur(20px) saturate(1.4)`, 1px border `#0D2551` at 10%.
  - Link hover underline: 1.5px champagne bar, scaleX 0→1 over .35s.
- **Hero**:
  - Pulled up under the nav (`margin-top:-70px; padding-top:70px`), inset from the edges, bottom corners rounded.
  - Champagne glow: a 70vmax circle, `radial-gradient(rgba(195,161,90,.34) → 0 at 62%)`, blur 40px, `mix-blend-mode:screen`, drifting on a 22s ease-in-out loop (translate ±6–8%, scale 1→1.15). Disable it under `prefers-reduced-motion`.
- **Panels**: every dark band, the Poster close and the light panels (#celebs #how #standard #book #membership) become inset rounded cards. Light panels get a 1px border `#0D2551` at 7% and no inset shadow.
- **Buttons**:
  - Pill-shaped. Hover lifts -2px.
  - Primary CTA has a sheen sweep on hover (a 115° white 35% band moving from -120% to 120% over .8s).
- **Focus**: `2px solid #C3A15A`, offset 3px, radius 10px.

## Screens / Views

### 1. Home (`Invita Home.dc.html`) — 19 sections, in order
1. **Hero**
   - Full-bleed clinic photo under the lapis gradient; min-height `min(94vh,940px)`.
   - H1 and CTAs (Book → WhatsApp, Explore menu → `#menu`), plus the MoH trust line.
2. **Trust strip** — `--color-surface` band with registration/distributor credentials.
3. **Doctors of Baghdad**
   - Dark band. RTL heading «يثق بنا نخبة من أطباء العراق».
   - Doctor-photo marquee plus a grid of **4 muted, autoplaying, looping 9:16 doctor reels** (`uploads/AQ*.mp4`) with controls. Playing one with sound pauses the others (`expPlay`).
4. **What you get** — 4-up benefit grid (`t.get`).
5. **Use-case ticker** — marquee, `aria-hidden`, 48s linear infinite, duplicated track.
6. **Stats** — dark band; the numbers count up the first time the section scrolls into view.
7. **Drip menu `#menu`** — tier filter plus 13 story-art cards (9:16), price, Book/Details. Hover: image scales 1.055 over 1.4s and a bottom gradient fades in.
8. **Proof `#celebs`** — doctors, celebrity carousel and Instagram grid merged. The carousel auto-advances every 3.5s and pauses on hover/touch.
9. **Wellness matcher `#matcher`** — goal buttons → recommended drip.
10. **How it works + the visit `#how`** — steps plus the clinic/suite experience.
11. **Science `#science`** — teaser linking to the Science page.
12. **Standard + certifications `#standard`** — "The Invita Standard" pillars plus certification badges.
13. **Films `#film`** — 16:9 film `uploads/vvv.mp4`.
14. **Booking `#book`** — form fields compose a WhatsApp message.
15. **For clinics / B2B `#clinics`** — surface band, 2-col, links to Partners.
16. **Membership + DNA `#membership`**
17. **FAQ `#faq`** — `<details>` accordions, custom marker.
18. **Poster close** — champagne gradient CTA band.
19. **Footer** — MoH disclaimer, links, socials.

### 2. IV Menu (`Invita IV Menu.dc.html` + `Invita Menu.html`)
Nav → lapis hero (kicker "The Infusion Menu", H1 "Fourteen Liquivida® formulas. One menu.", looping film with a sound toggle) → 14 formula cards with detail modals (EN panel with ingredients and stats, AR panel with benefits, CTAs «احجز عبر واتساب» and a link to the drip page) → footer.

### 3. Science (`Invita Science.dc.html`)
Long-form evidence page: mechanism, bioavailability, safety protocol, references. Lapis & Bone tokens.

### 4. Partners (`Invita Partners.dc.html`)
B2B page:
- Video hero.
- Partner-doctor grid.
- Testimonial reels.
- "Why Invita" pillars.
- Certifications.
- Join-as-partner form → WhatsApp.

### 5. Drip detail (`Invita Drip.dc.html`, `#energy-boost` … 13 slugs)
Lapis hero with a floating IV-bag card (`assets/bag-<slug>.png`) → count-ups (volume/minutes/absorption) → ingredient marquee → benefits → clinical formula → 3-step protocol → FAQ → related-drips rail → sticky bottom booking bar.

## Interactions & Behavior
- **Language**: EN/عربي toggle (`aria-label="Switch language"`), persisted in `localStorage['invita-lang']`. AR sets `dir="rtl"` on the root and swaps the copy dictionary. Map this to the repo's `src/messages` setup.
- **Nav**: collapses ≤760px behind a menu button into a dropdown (`navOpen` state).
- **Booking**: every Book CTA opens `https://wa.me/9647748885559?text=` + an encoded message in a new tab:
  - EN: "Hi! I'd like to book the {name} IV drip."
  - AR: «مرحباً، أود حجز جلسة {name}.»
- **Scroll motion** (CSS `animation-timeline: view()`, with an IntersectionObserver fallback):
  - Sections: translateY 28px→0 with opacity, .8s `cubic-bezier(.2,.7,.2,1)`.
  - H2s: blur-in (blur 6px→0, translateY 14px).
  - Dividers: grow in scaleX.
  - Nav shadow: fades in over the first 140px of scroll.
- **Hero image**: Ken Burns, scale 1.06→1 over 12–16s.
- **Cards**: hover lifts -6px (modern: plus scale 1.01), .45s.
- **Video**: `autoplay muted loop playsinline`; pause when off-screen.
- **Reduced motion**: all animations off (`prefers-reduced-motion`).
- **Responsive breakpoints**:
  - ≤860px: `.inv-stack` grids go single-column.
  - ≤760px: mobile nav, hero radius 26px.

## State Management
- `lang` ('en' | 'ar'), persisted.
- `navOpen`.
- Menu tier filter.
- Matcher selection.
- Carousel index plus auto-advance timer.
- Booking form fields.
- Stats count-up triggered flag.

There is no backend: all forms deep-link to WhatsApp.

## Assets
Kept in the Claude Design project; copy them into `public/`.
- `uploads/hero-clinic.jpg`: hero photo.
- `uploads/Prancheta 2.png`: brand mark (pattern tile).
- `uploads/Prancheta 14.png`: wordmark.
- `uploads/Plain-*.otf`: fonts.
- `uploads/PHOTO-2026-*.jpg`: doctor photos.
- `uploads/IMG_6*.jpg`: celebrity photos.
- `assets/social/post-*.png` / `story-*.png`: campaign art. Convert to WebP at about 80q.
- `assets/bag-<slug>.png`: IV-bag renders. Optimize.
- `assets/bottles/`, `assets/brand/`: small icons and brand files.
- Videos:
  - `uploads/vvv.mp4`: Home film, already compressed.
  - 4× `uploads/AQ*.mp4`: doctor reels. Re-encode to H.264 at 1–2 Mbps and add `poster` frames.
  - Menu/Partners films: re-encode to 1080p at 2–4 Mbps, ≤8 MB each.
- Instagram: `@invita_iv_drips`. WhatsApp: `9647748885559`.

## Files in this bundle
- `Invita Home.dc.html`: master reference, with all tokens and CSS layers plus the full EN/AR copy.
- `Invita IV Menu.dc.html`, `Invita Menu.html`, `Invita Science.dc.html`, `Invita Partners.dc.html`, `Invita Drip.dc.html`
- `support.js`: prototype runtime, only needed to open the files locally. Don't port it.

## Deployment note
The current invitadrips.com is a single-file Netlify import of Home. It shows only 2 of the 4 doctor reels because of the upload size limit. Once this is implemented in the Next.js repo with assets as separate files, the size limit no longer applies, so ship all 4 reels.
