"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ clinicName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/partners/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { success: boolean; error?: string };

      if (!json.success) {
        setToast({ message: json.error ?? "Login failed.", type: "error" });
        return;
      }

      router.push("/partners/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="section-inner partner-login">
          <p className="page-eyebrow">Partner access</p>
          <h1 className="page-title">Clinic portal</h1>
          <p className="page-lead page-lead--narrow">
            Training resources, Safety 101 materials, and support for Invita partner clinics.
          </p>

          <form onSubmit={handleSubmit} className="partner-login-form">
            <label className="intake-field">
              <span>Clinic / organisation name</span>
              <input
                className="input-sevres"
                value={form.clinicName}
                onChange={(e) => setForm((p) => ({ ...p, clinicName: e.target.value }))}
                required
              />
            </label>
            <label className="intake-field">
              <span>Portal password</span>
              <input
                className="input-sevres"
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="partner-login-help">
            Need access? <Link href="/contact?source=b2b-partnership">Contact partnerships</Link>
          </p>
        </div>
      </main>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
