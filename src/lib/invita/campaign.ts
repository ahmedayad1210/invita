// Seasonal Home campaigns. A campaign switches the Home theme (data-campaign on .lb)
// and shows its awareness strip only inside its window, so nothing needs undoing later.
// INVITA_CAMPAIGN=pink forces one on (e.g. to preview it); INVITA_CAMPAIGN=off forces all off.

export type Campaign = "pink";

const CAMPAIGNS: { id: Campaign; start: string; end: string }[] = [
  // Pink October — Breast Cancer Awareness Month (Baghdad time, UTC+3).
  { id: "pink", start: "2026-10-01T00:00:00+03:00", end: "2026-11-01T00:00:00+03:00" },
];

export function activeCampaign(now: Date = new Date()): Campaign | null {
  const override = process.env.INVITA_CAMPAIGN;
  if (override === "off") return null;
  if (override && CAMPAIGNS.some((c) => c.id === override)) return override as Campaign;
  const t = now.getTime();
  return CAMPAIGNS.find((c) => t >= Date.parse(c.start) && t < Date.parse(c.end))?.id ?? null;
}
