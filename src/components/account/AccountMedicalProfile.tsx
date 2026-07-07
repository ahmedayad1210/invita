"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";

type Medical = {
  goals: string;
  allergies: string;
  medications: string;
  conditions: string;
  pregnant: boolean;
};

const EMPTY: Medical = {
  goals: "",
  allergies: "",
  medications: "",
  conditions: "",
  pregnant: false,
};

export default function AccountMedicalProfile() {
  const [form, setForm] = useState<Medical>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/user/medical-profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.medical) {
          setForm({
            goals: json.data.medical.goals ?? "",
            allergies: json.data.medical.allergies ?? "",
            medications: json.data.medical.medications ?? "",
            conditions: json.data.medical.conditions ?? "",
            pregnant: Boolean(json.data.medical.pregnant),
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/user/medical-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    setToast({
      message: json.success ? "Medical profile saved." : json.error ?? "Save failed.",
      type: json.success ? "success" : "error",
    });
  };

  if (loading) return null;

  return (
    <section className="account-panel">
      <h2>Medical profile</h2>
      <p className="account-panel-hint">Pre-fills your next booking intake.</p>
      {(["goals", "allergies", "medications", "conditions"] as const).map((field) => (
        <label key={field} className="intake-field">
          <span style={{ textTransform: "capitalize" }}>{field}</span>
          <textarea
            className="input-sevres"
            rows={2}
            value={form[field]}
            onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          />
        </label>
      ))}
      <label className="intake-field">
        <span>Pregnant or breastfeeding</span>
        <input
          type="checkbox"
          checked={form.pregnant}
          onChange={(e) => setForm((p) => ({ ...p, pregnant: e.target.checked }))}
        />
      </label>
      <button type="button" className="btn-primary btn-sm" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save medical profile"}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
