"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type PatientRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  last_visit_at: string | null;
  respond_url: string;
};

export default function AdminPatientsPageClient() {
  const [rows, setRows] = useState<PatientRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const json = await res.json();
    if (json.success) setRows(json.data);
    setLoading(false);
  }, [q]);

  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.75rem" }}>
          Patients
        </h1>
        <p style={{ color: "#8B7355", fontSize: "0.875rem" }}>
          Phone-keyed CRM for IV studio guests and members. Message via Respond.io from each profile.
        </p>
      </header>

      <input
        className="input-sevres"
        placeholder="Search name, phone, email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 360, marginBottom: "1.25rem" }}
      />

      {loading ? (
        <LoadingSpinner message="Loading patients…" />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Last visit</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.full_name}</td>
                <td>{row.phone}</td>
                <td>{row.email ?? "—"}</td>
                <td>{row.last_visit_at ? new Date(row.last_visit_at).toLocaleDateString() : "—"}</td>
                <td style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/admin/patients/${row.id}`} className="btn-secondary btn-sm">
                    Open
                  </Link>
                  <a href={row.respond_url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
