# Make.com scenario watchdog

An in-app agent that keeps the Make.com scenarios running around the clock. It
runs independently of any chat session or the Make MCP — it's a scheduled
Netlify function calling a guarded Next.js route, so it works 24/7.

## What it does, every 15 minutes

For each watched scenario it:

1. **Reads** the scenario's live state from the Make REST API (`isActive`,
   `isinvalid`, `dlqCount`).
2. **Self-heals** — if a scenario was switched off but is otherwise valid, it
   turns it back on automatically.
3. **Escalates** what it can't fix — a scenario flagged `invalid` (broken
   blueprint) or a large **DLQ backlog** (incomplete-execution queue filling the
   shared 500 MB org limit) can't be fixed by a restart, so it sends a WhatsApp
   alert instead.
4. **Logs** every check to Supabase (`make_scenario_health`) and surfaces it at
   **Admin → Make Watchdog** (`/admin/make-health`), including a "Run check now"
   button.

Alerts are de-duplicated: one ping when a problem appears, no more than one
repeat per `MAKE_ALERT_REPEAT_HOURS`, and a single "recovered" ping when it goes
green again.

## Pieces

| Piece | Path |
|---|---|
| Make REST client | `src/lib/make/client.ts` |
| Watchdog logic | `src/lib/make/watchdog.ts` |
| Cron route (bearer `CRON_SECRET`) | `src/app/api/cron/make-watchdog/route.ts` |
| Admin API (log + manual run) | `src/app/api/admin/make-health/route.ts` |
| Admin status page | `src/app/admin/make-health/page.tsx` |
| Netlify schedule (`*/15 * * * *`) | `netlify/functions/make-watchdog.mjs` |
| Supabase table | `supabase/make-watchdog.sql` |

## Setup

1. **Migration** — run `supabase/make-watchdog.sql` in the Supabase SQL editor.
2. **Make API token** — Make → Profile → API → *Add token* with scopes
   `scenarios:read` and `scenarios:write`. Put it in `MAKE_API_TOKEN`.
3. **Env** (see `.env.local.example`): `MAKE_ZONE` (default `us2`),
   `MAKE_WATCH_SCENARIO_IDS` (default `5109637`), `MAKE_DLQ_ALERT_THRESHOLD`,
   `MAKE_ALERT_WHATSAPP` (uses the existing Respond.io integration; blank = log
   only), `MAKE_ALERT_REPEAT_HOURS`, and `CRON_SECRET` (shared with the other
   cron route; the Netlify function sends it as a bearer token).
4. Deploy. The Netlify scheduled function starts firing every 15 min. Confirm
   from **Admin → Make Watchdog** or by hitting the route:
   `curl -H "Authorization: Bearer $CRON_SECRET" https://invitadrips.com/api/cron/make-watchdog`

## Limits (by design)

- It won't auto-purge the DLQ — deleting execution history is destructive, so it
  alerts and leaves the purge to a human (Make → scenario → *Incomplete
  executions*).
- It won't "un-invalidate" a scenario whose blueprint is broken — that needs a
  real fix (e.g. the malformed `parseDate` in Invoices Softr). It keeps the
  scenario from silently sitting off and pings you until it's fixed.
