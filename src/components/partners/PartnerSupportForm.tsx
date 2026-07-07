"use client";

import { useState, type FormEvent } from "react";
import Toast from "@/components/ui/Toast";
import { submitLead } from "@/lib/leads";

export default function PartnerSupportForm() {
  const [form, setForm] = useState({ name: "", email: "", clinic: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitLead({
      source: "partner-support",
      name: form.name,
      email: form.email,
      message: `[${form.clinic}] ${form.message}`,
    });

    setLoading(false);

    if (!result.success) {
      setToast({ message: result.error ?? "Could not submit.", type: "error" });
      return;
    }

    setForm({ name: "", email: "", clinic: "", message: "" });
    setToast({ message: "Support request sent. Our team will respond within 24 hours.", type: "success" });
  };

  return (
    <form onSubmit={handleSubmit} className="partner-support-form">
      <label className="intake-field">
        <span>Your name</span>
        <input
          className="input-sevres"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Dr. Sara Ahmed"
        />
      </label>
      <label className="intake-field">
        <span>Email</span>
        <input
          className="input-sevres"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="clinic@example.com"
        />
      </label>
      <label className="intake-field">
        <span>Clinic or organisation</span>
        <input
          className="input-sevres"
          type="text"
          required
          value={form.clinic}
          onChange={(e) => setForm((f) => ({ ...f, clinic: e.target.value }))}
          placeholder="Clinic name"
        />
      </label>
      <label className="intake-field">
        <span>How can we help?</span>
        <textarea
          className="input-sevres"
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Orders, training, clinical questions…"
        />
      </label>
      <button type="submit" className="btn-primary btn-sm" disabled={loading}>
        {loading ? "Sending…" : "Submit support request"}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </form>
  );
}
