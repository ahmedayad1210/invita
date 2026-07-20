"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type PatientDetail = {
  patient: { id: string; full_name: string; phone: string; email: string | null; respond_url: string };
  medical: { goals?: string; allergies?: string; medications?: string; conditions?: string } | null;
  notes: { id: string; body: string; created_at: string }[];
  timeline: { id: string; title: string; body: string | null; created_at: string }[];
  bookings: { id: string; date: string; time_slot: string; status: string; service?: { name: string } }[];
  messages: { id: string; direction: string; body: string; created_at: string }[];
  leads: { id: string; source: string; message: string | null; created_at: string }[];
};

export default function AdminPatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [data, setData] = useState<PatientDetail | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/patients/${patientId}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveNote = async () => {
    if (!note.trim()) return;
    await fetch(`/api/admin/patients/${patientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: note }),
    });
    setNote("");
    await load();
  };

  if (loading) return <LoadingSpinner message="Loading patient…" />;
  if (!data) return <p>Patient not found.</p>;

  return (
    <div>
      <Link href="/admin/patients" style={{ color: "#6B7A94", fontSize: "0.875rem" }}>
        ← All patients
      </Link>
      <header style={{ margin: "1rem 0 2rem" }}>
        <h1 style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: "1.125rem" }}>
          {data.patient.full_name}
        </h1>
        <p style={{ color: "#6B7A94" }}>
          {data.patient.phone} · {data.patient.email ?? "No email"}
        </p>
        <a href={data.patient.respond_url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
          Open in Respond.io
        </a>
      </header>

      <div className="admin-patient-grid">
        <section>
          <h2>Appointments</h2>
          <ul className="admin-patient-list">
            {data.bookings.map((b) => (
              <li key={b.id}>
                <strong>{b.date} {b.time_slot}</strong> — {b.service?.name ?? "Session"} ({b.status})
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Medical snapshot</h2>
          <pre className="admin-patient-pre">
            {data.medical
              ? JSON.stringify(data.medical, null, 2)
              : "No saved medical profile yet."}
          </pre>
        </section>

        <section>
          <h2>Messages</h2>
          <ul className="admin-patient-list">
            {data.messages.map((m) => (
              <li key={m.id}>
                <strong>{m.direction}</strong> — {m.body.slice(0, 120)}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Timeline</h2>
          <ul className="admin-patient-list">
            {data.timeline.map((t) => (
              <li key={t.id}>
                <strong>{t.title}</strong>
                {t.body ? ` — ${t.body}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Staff notes</h2>
          <textarea className="input-sevres" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn-primary btn-sm" onClick={saveNote} style={{ marginTop: "0.5rem" }}>
            Add note
          </button>
          <ul className="admin-patient-list">
            {data.notes.map((n) => (
              <li key={n.id}>{n.body}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
