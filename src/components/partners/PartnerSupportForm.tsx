"use client";

import { useState, type FormEvent } from "react";
import Toast from "@/components/ui/Toast";
import { submitLead } from "@/lib/leads";

type Props = { clinicName: string };

export default function PartnerSupportForm({ clinicName }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitLead({
      source: "partner-support",
      name: clinicName,
      message: `[Partner portal] ${message}`,
    });

    setLoading(false);

    if (!result.success) {
      setToast({ message: result.error ?? "Could not submit.", type: "error" });
      return;
    }

    setMessage("");
    setToast({ message: "Support request sent. Our team will respond within 24 hours.", type: "success" });
  };

  return (
    <form onSubmit={handleSubmit} className="partner-support-form">
      <label className="intake-field">
        <span>How can we help?</span>
        <textarea
          className="input-sevres"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
