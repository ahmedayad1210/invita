import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import { getSupabaseSecretKey } from "@/lib/supabase/env";
import {
  sendWhatsAppMessage,
  respondIoConfigured,
} from "@/lib/notifications/respondio-client";
import type { MakeHealthStatus, MakeScenarioHealth } from "@/lib/supabase/types";
import { getScenario, startScenario, makeConfigured } from "./client";

// ── Config (all overridable via env) ─────────────────────────────

/** Scenario IDs the watchdog keeps alive. Defaults to "Invoices Softr". */
function watchedScenarioIds(): string[] {
  const raw = process.env.MAKE_WATCH_SCENARIO_IDS?.trim();
  const ids = (raw && raw.length ? raw : "5109637")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(ids));
}

/** DLQ backlog size at/above which a scenario is flagged degraded. */
function dlqThreshold(): number {
  const n = Number(process.env.MAKE_DLQ_ALERT_THRESHOLD);
  return Number.isFinite(n) && n > 0 ? n : 25;
}

/** Minimum gap between repeat alerts for a still-unhealthy scenario. */
function alertRepeatMs(): number {
  const h = Number(process.env.MAKE_ALERT_REPEAT_HOURS);
  return (Number.isFinite(h) && h > 0 ? h : 6) * 60 * 60 * 1000;
}

function alertPhone(): string | undefined {
  const p = process.env.MAKE_ALERT_WHATSAPP;
  return p && p.trim() ? p.trim() : undefined;
}

function hasServiceKey(): boolean {
  return Boolean(getSupabaseSecretKey());
}

// ── Types ────────────────────────────────────────────────────────

export interface ScenarioCheck {
  scenarioId: string;
  name: string | null;
  status: MakeHealthStatus;
  isActive: boolean | null;
  isInvalid: boolean | null;
  dlqCount: number | null;
  problems: string[];
  actionTaken: string;
  alerted: boolean;
  error?: string;
}

export interface WatchdogResult {
  configured: boolean;
  checked: number;
  healthy: number;
  degraded: number;
  down: number;
  unknown: number;
  scenarios: ScenarioCheck[];
}

// ── Supabase logging (best-effort) ───────────────────────────────

async function lastHealthRow(
  scenarioId: string
): Promise<MakeScenarioHealth | null> {
  if (!hasServiceKey()) return null;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("make_scenario_health")
      .select("*")
      .eq("scenario_id", scenarioId)
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as MakeScenarioHealth | null) ?? null;
  } catch (e) {
    console.error("[make-watchdog] lastHealthRow failed", e);
    return null;
  }
}

async function logHealth(row: {
  scenario_id: string;
  scenario_name: string | null;
  status: MakeHealthStatus;
  is_active: boolean | null;
  is_invalid: boolean | null;
  dlq_count: number | null;
  action_taken: string;
  problems: string[];
  detail: Record<string, unknown>;
  alerted_at: string | null;
}): Promise<void> {
  if (!hasServiceKey()) return;
  try {
    const supabase = createAdminClient();
    await supabase.from("make_scenario_health").insert({
      scenario_id: row.scenario_id,
      scenario_name: row.scenario_name,
      status: row.status,
      is_active: row.is_active,
      is_invalid: row.is_invalid,
      dlq_count: row.dlq_count,
      action_taken: row.action_taken,
      problems: row.problems,
      detail: row.detail,
      alerted_at: row.alerted_at,
    } as never);
  } catch (e) {
    console.error("[make-watchdog] logHealth failed", e);
  }
}

// ── Alerting ─────────────────────────────────────────────────────

async function sendAlert(text: string): Promise<boolean> {
  const phone = alertPhone();
  if (!phone || !respondIoConfigured()) return false;
  try {
    const r = await sendWhatsAppMessage(phone, text, "Invita Ops");
    return r.delivered;
  } catch (e) {
    console.error("[make-watchdog] sendAlert failed", e);
    return false;
  }
}

// ── Per-scenario check + remediation ─────────────────────────────

async function checkOne(scenarioId: string): Promise<ScenarioCheck> {
  const threshold = dlqThreshold();

  try {
    let detail = await getScenario(scenarioId);
    let actionTaken = "none";

    // Self-heal: if it's switched off but otherwise valid, turn it back on.
    // A scenario flagged `isinvalid` has a broken blueprint that a restart
    // can't fix — leave it and escalate to a human instead.
    if (!detail.isActive && !detail.isinvalid) {
      const started = await startScenario(scenarioId);
      actionTaken = started ? "reactivated" : "reactivate_failed";
      if (started) {
        try {
          detail = await getScenario(scenarioId);
        } catch {
          /* keep the pre-restart snapshot if the re-read fails */
        }
      }
    }

    const dlqCount =
      typeof detail.dlqCount === "number" ? detail.dlqCount : null;

    const problems: string[] = [];
    if (detail.isinvalid) problems.push("invalid");
    if (!detail.isActive) problems.push("inactive");
    if (dlqCount !== null && dlqCount >= threshold) {
      problems.push(`dlq_high(${dlqCount})`);
    }

    let status: MakeHealthStatus;
    if (!detail.isActive || detail.isinvalid) status = "down";
    else if (problems.length) status = "degraded";
    else status = "healthy";

    // Alert de-duplication: only ping on a fresh problem or after the repeat
    // window, and send one recovery ping when it goes green again.
    const prev = await lastHealthRow(scenarioId);
    const now = Date.now();

    const needAlert =
      status !== "healthy" &&
      (!prev ||
        prev.status === "healthy" ||
        !prev.alerted_at ||
        now - new Date(prev.alerted_at).getTime() > alertRepeatMs());

    const recovered =
      status === "healthy" &&
      prev !== null &&
      prev.status !== "healthy" &&
      prev.status !== "unknown";

    let alerted = false;
    if (needAlert) {
      const lines = [
        `⚠️ Make scenario "${detail.name}" (${scenarioId}) is ${status.toUpperCase()}.`,
        `Problems: ${problems.join(", ") || "n/a"}`,
        `Action: ${actionTaken}`,
      ];
      if (detail.isinvalid) {
        lines.push("Flagged INVALID — needs a manual blueprint fix in Make.");
      }
      if (problems.some((p) => p.startsWith("dlq_high"))) {
        lines.push(
          `DLQ backlog ${dlqCount}. Clear incomplete executions in Make to free the org queue.`
        );
      }
      alerted = await sendAlert(lines.join("\n"));
    } else if (recovered) {
      alerted = await sendAlert(
        `✅ Make scenario "${detail.name}" (${scenarioId}) recovered — active and healthy again.`
      );
    }

    // Carry the last successful alert time forward while still unhealthy so the
    // repeat-window timer is measured from the last actual ping.
    let alertedAt: string | null = prev?.alerted_at ?? null;
    if (alerted) alertedAt = new Date(now).toISOString();
    else if (status === "healthy") alertedAt = null;

    await logHealth({
      scenario_id: scenarioId,
      scenario_name: detail.name ?? null,
      status,
      is_active: detail.isActive ?? null,
      is_invalid: detail.isinvalid ?? null,
      dlq_count: dlqCount,
      action_taken: actionTaken,
      problems,
      detail: { threshold, dlqKnown: dlqCount !== null },
      alerted_at: alertedAt,
    });

    return {
      scenarioId,
      name: detail.name ?? null,
      status,
      isActive: detail.isActive ?? null,
      isInvalid: detail.isinvalid ?? null,
      dlqCount,
      problems,
      actionTaken,
      alerted,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error";
    console.error(`[make-watchdog] check failed for ${scenarioId}`, e);

    await logHealth({
      scenario_id: scenarioId,
      scenario_name: null,
      status: "unknown",
      is_active: null,
      is_invalid: null,
      dlq_count: null,
      action_taken: "check_failed",
      problems: ["check_failed"],
      detail: { error: message },
      alerted_at: null,
    });

    return {
      scenarioId,
      name: null,
      status: "unknown",
      isActive: null,
      isInvalid: null,
      dlqCount: null,
      problems: ["check_failed"],
      actionTaken: "check_failed",
      alerted: false,
      error: message,
    };
  }
}

// ── Entry point ──────────────────────────────────────────────────

export async function runMakeWatchdog(): Promise<WatchdogResult> {
  if (!makeConfigured()) {
    return {
      configured: false,
      checked: 0,
      healthy: 0,
      degraded: 0,
      down: 0,
      unknown: 0,
      scenarios: [],
    };
  }

  const scenarios: ScenarioCheck[] = [];
  for (const id of watchedScenarioIds()) {
    // Sequential on purpose — the watched set is tiny and this keeps the Make
    // API calls gentle and the logs readable.
    scenarios.push(await checkOne(id));
  }

  const count = (s: MakeHealthStatus) =>
    scenarios.filter((x) => x.status === s).length;

  return {
    configured: true,
    checked: scenarios.length,
    healthy: count("healthy"),
    degraded: count("degraded"),
    down: count("down"),
    unknown: count("unknown"),
    scenarios,
  };
}
