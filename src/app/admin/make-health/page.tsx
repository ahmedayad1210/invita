"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MakeScenarioHealth, MakeHealthStatus } from "@/lib/supabase/types";

const STATUS_STYLES: Record<MakeHealthStatus, { bg: string; fg: string; label: string }> = {
  healthy:  { bg: "rgba(34,160,90,0.14)",  fg: "#1f8a4c", label: "Healthy" },
  degraded: { bg: "rgba(214,158,46,0.16)", fg: "#a9781a", label: "Degraded" },
  down:     { bg: "rgba(200,52,52,0.14)",  fg: "#b53636", label: "Down" },
  unknown:  { bg: "rgba(120,120,120,0.14)", fg: "#6b6b6b", label: "Unknown" },
};

function StatusPill({ status }: { status: MakeHealthStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.unknown;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

export default function AdminMakeHealthPage() {
  const [rows, setRows] = useState<MakeScenarioHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/make-health");
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to load health log.");
        return;
      }
      setRows(json.data ?? []);
      setError(null);
    } catch {
      setError("Failed to load health log.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runNow = useCallback(async () => {
    setRunning(true);
    setNote(null);
    try {
      const res = await fetch("/api/admin/make-health", { method: "POST" });
      const json = await res.json();
      if (!json.success) {
        setNote(json.error ?? "Watchdog run failed.");
      } else if (json.data?.configured === false) {
        setNote("MAKE_API_TOKEN is not set — the watchdog cannot reach Make yet.");
      } else {
        const d = json.data;
        setNote(
          `Checked ${d.checked}: ${d.healthy} healthy, ${d.degraded} degraded, ${d.down} down, ${d.unknown} unknown.`
        );
      }
      await load();
    } catch {
      setNote("Watchdog run failed.");
    } finally {
      setRunning(false);
    }
  }, [load]);

  // Latest row per scenario for the summary cards.
  const latest = useMemo(() => {
    const map = new Map<string, MakeScenarioHealth>();
    for (const r of rows) {
      if (!map.has(r.scenario_id)) map.set(r.scenario_id, r);
    }
    return Array.from(map.values());
  }, [rows]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="admin-page-title">Make Watchdog</h1>
          <p className="admin-page-lead">
            Automated health checks for the Make.com scenarios. Runs every 15 minutes,
            reactivates a scenario if it gets switched off, and alerts on WhatsApp when
            something needs a human.
          </p>
        </div>
        <button
          onClick={runNow}
          disabled={running}
          className="admin-nav-link"
          style={{
            border: "1px solid rgba(196,149,106,0.5)",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: 600,
            cursor: running ? "default" : "pointer",
            opacity: running ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {running ? "Checking…" : "Run check now"}
        </button>
      </div>

      {note ? (
        <p style={{ marginTop: "0.5rem", color: "#6b6b6b" }}>{note}</p>
      ) : null}

      {/* Latest status per scenario */}
      {latest.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
            margin: "1.5rem 0",
          }}
        >
          {latest.map((r) => (
            <div
              key={r.scenario_id}
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                padding: "1rem",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <strong style={{ fontSize: "0.95rem" }}>
                  {r.scenario_name ?? `Scenario ${r.scenario_id}`}
                </strong>
                <StatusPill status={r.status} />
              </div>
              <p style={{ fontSize: "0.75rem", color: "#8a8a8a", margin: "0.25rem 0 0.75rem" }}>
                #{r.scenario_id}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.8rem", color: "#555" }}>
                <li>Active: {r.is_active === null ? "—" : r.is_active ? "yes" : "no"}</li>
                <li>Invalid: {r.is_invalid === null ? "—" : r.is_invalid ? "yes" : "no"}</li>
                <li>DLQ backlog: {r.dlq_count ?? "—"}</li>
                {r.problems?.length ? <li>Problems: {r.problems.join(", ")}</li> : null}
                <li>Last action: {r.action_taken}</li>
                <li>Checked: {new Date(r.checked_at).toLocaleString()}</li>
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {loading ? <p>Loading…</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      {!loading && !error ? (
        rows.length === 0 ? (
          <p style={{ color: "#6b6b6b" }}>
            No checks logged yet. Set <code>MAKE_API_TOKEN</code> (and run the migration
            <code> supabase/make-watchdog.sql</code>), then press “Run check now”.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Checked</th>
                  <th>Scenario</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>DLQ</th>
                  <th>Action</th>
                  <th>Problems</th>
                  <th>Alerted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{new Date(r.checked_at).toLocaleString()}</td>
                    <td>{r.scenario_name ?? r.scenario_id}</td>
                    <td><StatusPill status={r.status} /></td>
                    <td>{r.is_active === null ? "—" : r.is_active ? "yes" : "no"}</td>
                    <td>{r.dlq_count ?? "—"}</td>
                    <td>{r.action_taken}</td>
                    <td>{r.problems?.join(", ") || "—"}</td>
                    <td>{r.alerted_at ? new Date(r.alerted_at).toLocaleTimeString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}
