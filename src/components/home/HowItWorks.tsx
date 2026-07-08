"use client";

import Link from "next/link";
import { HOW_IT_WORKS } from "@/lib/constants";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { useLocale } from "@/contexts/LocaleContext";

export default function HowItWorks() {
  const { t, locale } = useLocale();

  return (
    <section id="how-it-works" className="section-padding how-it-works-section">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero">
            <p className="page-eyebrow">{t.howItWorks.eyebrow}</p>
            <h2 className="page-title page-title--compact">{t.howItWorks.title}</h2>
            <p className="page-lead page-lead--narrow">{t.howItWorks.lead}</p>
          </header>
        </ScrollReveal>

        <div className="hiw-grid">
          {HOW_IT_WORKS.map((step) => (
            <ScrollReveal key={step.step}>
              <article className="hiw-card">
                <div className="hiw-step-num">{step.step}</div>
                <h3 className="hiw-step-title">
                  {locale === "ar" ? step.titleAr : step.title}
                </h3>
                <p className="hiw-step-desc">
                  {locale === "ar" ? step.descriptionAr : step.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="cta-band">
          <Link href="/book" className="btn-primary">
            {t.cta.startConsultation}
          </Link>
          <p className="cta-hint">{t.cta.whatHappensNext}</p>
        </div>
      </div>
    </section>
  );
}
