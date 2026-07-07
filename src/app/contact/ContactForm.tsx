"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { sendContactMessage } from "@/lib/emailjs";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";

const ALLOWED_SOURCES = new Set([
  "contact-form",
  "b2b-partnership",
  "b2b-meeting",
  "b2b-provider",
  "b2b-wholesale",
  "b2b-support",
  "b2b-info",
  "b2b-network",
]);

function resolveLeadSource(raw: string | null): string {
  if (raw && ALLOWED_SOURCES.has(raw)) return raw;
  return "contact-form";
}

const SOURCE_HEADINGS: Record<string, string> = {
  "b2b-partnership": "Request a partnership",
  "b2b-meeting": "Schedule a business meeting",
  "b2b-provider": "Become a provider",
  "b2b-wholesale": "Wholesale enquiry",
  "b2b-support": "Medical support request",
  "b2b-info": "Request information",
  "b2b-network": "Healthcare network enquiry",
};

export default function ContactForm() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const leadSource = useMemo(
    () => resolveLeadSource(searchParams.get("source")),
    [searchParams]
  );
  const heading = SOURCE_HEADINGS[leadSource] ?? "Send us a message";

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadResult = await submitLead({
        source: leadSource,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        locale,
      });

      if (!leadResult.success) {
        setToast({
          message: leadResult.error ?? "Could not save your message.",
          type: "error",
        });
        return;
      }

      await sendContactMessage(form).catch(() => null);

      setToast({
        message: "Thank you. We will be in touch within 24 hours.",
        type: "success",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "1rem",
          border: "1px solid rgba(196,149,106,0.15)",
          boxShadow: "0 4px 40px rgba(44,24,16,0.07)",
          padding: "2.5rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.875rem",
            fontWeight: 400,
            color: "#2C1810",
            marginBottom: "0.5rem",
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#8B7355",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          For bookings, please use our{" "}
          <a href="/book" style={{ color: "#C4956A", textDecoration: "underline" }}>
            online booking page
          </a>
          . For all other enquiries, we respond within 24 hours.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label className="label-sevres" htmlFor="contact-name">
              Full Name *
            </label>
            <input
              id="contact-name"
              className="input-sevres"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label-sevres" htmlFor="contact-email">
              Email Address *
            </label>
            <input
              id="contact-email"
              className="input-sevres"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label-sevres" htmlFor="contact-phone">
              Phone (optional)
            </label>
            <input
              id="contact-phone"
              className="input-sevres"
              type="tel"
              placeholder="+964 770 000 0000"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="label-sevres" htmlFor="contact-message">
              Message *
            </label>
            <textarea
              id="contact-message"
              className="input-sevres"
              rows={5}
              placeholder="How can we help you?"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              required
              style={{ resize: "vertical", minHeight: "120px" }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
