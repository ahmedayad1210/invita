"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { COMPREHENSIVE_FAQ } from "@/lib/invita/faq-comprehensive";
import { FAQ_ITEMS } from "@/lib/invita/liquivida-drips";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  variant?: "default" | "iv";
};

export default function FaqPreview({ variant = "default" }: Props) {
  const { t, locale } = useLocale();
  const isAr = locale === "ar";
  const [open, setOpen] = useState<number | null>(0);

  const items =
    variant === "iv"
      ? FAQ_ITEMS.slice(0, 5)
      : COMPREHENSIVE_FAQ.filter((item) => item.category === "patients").slice(0, 3);

  return (
    <section className="section-padding faq-preview">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero">
            <p className="page-eyebrow">{isAr ? "وضوح وسلامة" : "Clarity & safety"}</p>
            <h2 className="page-title page-title--compact">
              {variant === "iv" ? "Frequently asked questions" : t.faq.title}
            </h2>
            {variant === "iv" ? (
              <p className="page-lead page-lead--narrow">
                Answering your questions to make you feel comfortable.
              </p>
            ) : null}
          </header>
        </ScrollReveal>
        <div className="faq-list">
          {items.map((item, i) => (
            <article key={item.q} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.q}
              </button>
              {open === i ? <p className="faq-answer">{item.a}</p> : null}
            </article>
          ))}
        </div>
        <div className="cta-band">
          <Link href="/book" className="btn-primary">
            {t.cta.startConsultation}
          </Link>
          <Link href="/faq" className="btn-secondary">
            {t.faq.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
