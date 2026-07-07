"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";

export default function TelehealthPageClient() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [form, setForm] = useState({ name: "", phone: "", email: "", goals: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitLead({
      source: "telehealth-prescreen",
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.goals,
      locale,
    });

    setLoading(false);

    if (!result.success) {
      setToast({ message: result.error ?? "Could not submit.", type: "error" });
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">{isAr ? "ما قبل العلاج" : "Pre-treatment"}</p>
          <h1 className="page-title">{isAr ? "فحص ما قبل IV" : "IV pre-screen"}</h1>
          <p className="page-lead page-lead--narrow">
            {isAr
              ? "استبيان قصير قبل أول جلسة — يراجعه طبيب Invita ويوصي بالبروتوكول المناسب."
              : "A short questionnaire before your first session — reviewed by an Invita clinician who recommends the right protocol."}
          </p>
        </header>

        <div className="section-inner telehealth-layout">
          {submitted ? (
            <div className="telehealth-success" role="status">
              <h2>{isAr ? "تم الاستلام" : "Received"}</h2>
              <p>
                {isAr
                  ? "سيتواصل معك فريقنا خلال 24 ساعة. يمكنك أيضاً حجز استشارة مباشرة."
                  : "Our team will contact you within 24 hours. You can also book a consultation now."}
              </p>
              <Link href="/book" className="btn-primary">
                {isAr ? "احجز استشارة" : "Book consultation"}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="telehealth-form">
              <label className="intake-field">
                <span>{isAr ? "الاسم" : "Name"} *</span>
                <input className="input-sevres" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </label>
              <label className="intake-field">
                <span>{isAr ? "الهاتف" : "Phone"} *</span>
                <input className="input-sevres" type="tel" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </label>
              <label className="intake-field">
                <span>{isAr ? "البريد" : "Email"}</span>
                <input className="input-sevres" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </label>
              <label className="intake-field">
                <span>{isAr ? "أهدافك الصحية" : "Your wellness goals"} *</span>
                <textarea className="input-sevres" rows={5} required value={form.goals} onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))} placeholder={isAr ? "الطاقة، المناعة، الجمال…" : "Energy, immunity, beauty…"} />
              </label>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (isAr ? "جاري الإرسال…" : "Submitting…") : isAr ? "إرسال للمراجعة" : "Submit for review"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
