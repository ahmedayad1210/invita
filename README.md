# Invita — Ultra-Luxury IV Drips + DNA Lab

Standalone Next.js site for **Invita**, separate from Sahar Healthcare.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4
- Supabase (auth, bookings, DNA orders)
- Bilingual EN/AR via `LocaleContext`

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

### Supabase

1. Create a **dedicated** Supabase project for Invita (not Sahar).
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/invita-extensions.sql` for DNA orders.
4. Add keys to `.env.local`.

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

## Template credit

Booking UX forked from [Sèvres](https://github.com/AftabAhmed-max/sevres) (MIT-style open source portfolio template), fully rebranded for Invita.

## Deploy

Deploy to Vercel with domain `invitadrips.com`. Set all env vars from `.env.local.example`.
