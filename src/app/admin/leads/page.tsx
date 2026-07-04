"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Lead } from "@/lib/supabase/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/leads");
        const json = await res.json();
        if (!json.success) {
          setError(json.error ?? "Failed to load leads.");
          return;
        }
        setLeads(json.data ?? []);
      } catch {
        setError("Failed to load leads.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <h1 className="admin-page-title">Enquiries</h1>
        <p className="admin-page-lead">Leads captured from the website and contact forms.</p>

        {loading ? <p>Loading…</p> : null}
        {error ? <p role="alert">{error}</p> : null}

        {!loading && !error ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No enquiries yet.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{new Date(lead.created_at).toLocaleString()}</td>
                      <td>{lead.source}</td>
                      <td>{lead.name ?? "—"}</td>
                      <td>
                        {[lead.email, lead.phone].filter(Boolean).join(" · ") || "—"}
                      </td>
                      <td>{lead.message ?? lead.drip_slug ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}
