import "server-only";

/**
 * Minimal Make.com REST API v2 client.
 *
 * Auth is a Make personal API token (Make → Profile → API → Add token) with at
 * least the `scenarios:read` and `scenarios:write` scopes. It is read from
 * MAKE_API_TOKEN and never exposed to the browser (server-only module).
 *
 * Region is the same subdomain you see in the Make URL, e.g. `us2` in
 * https://us2.make.com/... — set MAKE_ZONE if it differs.
 */

function token(): string | undefined {
  const t = process.env.MAKE_API_TOKEN;
  return t && t.trim() ? t.trim() : undefined;
}

export function makeConfigured(): boolean {
  return Boolean(token());
}

function zone(): string {
  // Strip anything that isn't a zone slug (e.g. "us2", "eu1", "eu2").
  return (process.env.MAKE_ZONE?.trim() || "us2").replace(/[^a-z0-9]/gi, "");
}

function apiBase(): string {
  return `https://${zone()}.make.com/api/v2`;
}

/** Fields the watchdog cares about. The endpoint returns more than this. */
export interface MakeScenarioDetail {
  id: number;
  name: string;
  isActive: boolean;
  isinvalid: boolean;
  /** May be absent on the single-scenario endpoint — treat as unknown then. */
  dlqCount?: number;
  scheduling?: { type?: string; interval?: number } | null;
}

async function makeFetch(path: string, init?: RequestInit): Promise<Response> {
  const t = token();
  if (!t) throw new Error("MAKE_API_TOKEN is not configured.");
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Token ${t}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function getScenario(
  scenarioId: number | string
): Promise<MakeScenarioDetail> {
  const res = await makeFetch(`/scenarios/${scenarioId}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Make getScenario(${scenarioId}) failed: ${res.status} ${body.slice(0, 200)}`
    );
  }
  const json = (await res.json()) as { scenario: MakeScenarioDetail };
  return json.scenario;
}

/** Activate (turn on) a scenario. Returns true on success. */
export async function startScenario(scenarioId: number | string): Promise<boolean> {
  const res = await makeFetch(`/scenarios/${scenarioId}/start`, { method: "POST" });
  return res.ok;
}

/** Deactivate (turn off) a scenario. Returns true on success. */
export async function stopScenario(scenarioId: number | string): Promise<boolean> {
  const res = await makeFetch(`/scenarios/${scenarioId}/stop`, { method: "POST" });
  return res.ok;
}
