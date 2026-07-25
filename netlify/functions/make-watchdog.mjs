// Netlify scheduled function — pings the Make watchdog endpoint every 15 min.
// The heavy lifting lives in the Next.js route (/api/cron/make-watchdog) so it
// can share the app's Supabase + Respond.io server code; this function just
// triggers it on a schedule with the CRON_SECRET bearer token.

export default async function handler() {
  const base =
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://invitadrips.com";
  const secret = process.env.CRON_SECRET || "";

  try {
    const res = await fetch(`${base}/api/cron/make-watchdog`, {
      headers: secret ? { authorization: `Bearer ${secret}` } : {},
    });
    const body = await res.text();
    console.log("[make-watchdog] ping", res.status, body.slice(0, 500));
    return new Response(body, { status: res.status });
  } catch (e) {
    console.error("[make-watchdog] ping failed", e);
    return new Response("watchdog ping failed", { status: 500 });
  }
}

// Every 15 minutes — matches the scenario's own polling cadence.
export const config = { schedule: "*/15 * * * *" };
