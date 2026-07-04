# Invita — Ultra-Luxury IV Drips + DNA Lab

Standalone Next.js site for **Invita**, separate from [Sahar Healthcare](https://github.com/ahmedayad1210/sahar-healthcare).

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4
- Supabase (auth, bookings, DNA orders, leads)
- Bilingual EN/AR via `LocaleContext`

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

### Media assets (required before deploy)

Brand photography and fonts are not committed. On a machine with the Invita asset dump:

```bash
# Default: ~/Downloads/invita dump — or set INVITA_DUMP
npm run ingest:dump
npm run scrape:instagram   # optional
npm run process:celebrities  # optional, when photos are approved
```

See `docs/invita-design-language.md` for how assets are framed (`MediaFrame` / `MediaImage`).

### Supabase

1. Create a **dedicated** Supabase project for Invita (not Sahar).
2. Run migrations in order:
   - `supabase/schema.sql`
   - `supabase/invita-extensions.sql`
   - `supabase/leads.sql`
   - `supabase/certifications.sql`
3. Add keys to `.env.local` (see `.env.local.example`).

## Routes

| Path | Description |
|------|-------------|
| `/` | Luxury homepage (IV + DNA pillars) |
| `/iv-therapy` | IV protocol menu |
| `/dna` | DNA panel menu |
| `/membership` | Invita Circle / Longevity |
| `/book` | 5-step concierge booking + clinical intake |
| `/account` | Appointments + DNA results |
| `/admin` | Staff dashboard |

## Deploy (Netlify)

Production deploy uses Netlify + `@netlify/plugin-nextjs`. See **`docs/DEPLOY-NETLIFY.md`** and **`docs/LAUNCH.md`** for the full checklist.

Canonical production URL: set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL` to your live domain (e.g. `https://invitadrips.com`).

## Template credit

Booking UX forked from [Sèvres](https://github.com/AftabAhmed-max/sevres), fully rebranded for Invita.
