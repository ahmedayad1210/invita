"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { INVITA } from "@/lib/constants";
import { submitLead } from "@/lib/leads";
import { useLocale } from "@/contexts/LocaleContext";

export default function LeadCaptureBanner() {
  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const result = await submitLead({
      source: "homepage-lead-capture",
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      locale,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Could not submit. Please try WhatsApp.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="lead-capture" aria-labelledby="lead-capture-heading">
      <div className="section-inner lead-capture-inner">
        <div className="lead-capture-copy">
          <h2 id="lead-capture-heading">{t.leadCapture.title}</h2>
          <p>{t.leadCapture.body}</p>
        </div>
        {submitted ? (
          <p className="lead-capture-success" role="status">
            {t.leadCapture.success}{" "}
            <Link href={INVITA.whatsapp}>{t.common.whatsapp}</Link>.
          </p>
        ) : (
          <form className="lead-capture-form" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="lead-name">
              Name
            </label>
            <input id="lead-name" name="name" placeholder="Name" required autoComplete="name" />
            <label className="sr-only" htmlFor="lead-phone">
              Phone number
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              placeholder="Phone number"
              required
              autoComplete="tel"
            />
            <label className="sr-only" htmlFor="lead-email">
              Email
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
            />
            {error ? (
              <p className="lead-capture-error" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "…" : t.leadCapture.cta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
