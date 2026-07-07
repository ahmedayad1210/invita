"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/ui/Toast";

export default function AccountProfileForm({
  initialName,
  initialPhone,
  initialEmail,
}: {
  initialName: string;
  initialPhone: string;
  initialEmail: string;
}) {
  const [form, setForm] = useState({ full_name: initialName, phone: initialPhone });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    setForm({ full_name: initialName, phone: initialPhone });
  }, [initialName, initialPhone]);

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    setToast({
      message: json.success ? "Profile updated." : json.error ?? "Update failed.",
      type: json.success ? "success" : "error",
    });
  };

  return (
    <section className="account-panel">
      <h2>Profile</h2>
      <p className="account-panel-hint">{initialEmail}</p>
      <label className="intake-field">
        <span>Full name</span>
        <input
          className="input-sevres"
          value={form.full_name}
          onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
        />
      </label>
      <label className="intake-field">
        <span>Phone (WhatsApp)</span>
        <input
          className="input-sevres"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="+964 770 000 0000"
        />
      </label>
      <button type="button" className="btn-primary btn-sm" onClick={save} disabled={loading}>
        {loading ? "Saving…" : "Save profile"}
      </button>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  );
}
