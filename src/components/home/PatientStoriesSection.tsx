"use client";

import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { PATIENT_STORIES } from "@/lib/invita/social-proof";
import { useLocale } from "@/contexts/LocaleContext";

export default function PatientStoriesSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="patient-stories section-padding">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">{isAr ? "فوائد البروتوكول" : "Protocol outcomes"}</p>
            <h2 className="page-title page-title--compact">
              {isAr ? "ما تدعمه بروتوكولاتنا" : "What our protocols support"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "طاقة. تعافٍ. وضوح. — بإشراف طبي في كل جلسة."
                : "Energy. Recovery. Clarity. — medically supervised at every session."}
            </p>
          </header>
        </ScrollReveal>
        <div className="patient-stories-grid">
          {PATIENT_STORIES.map((story) => (
            <ScrollReveal key={story.id}>
              <blockquote className="patient-story-card">
                <p className="patient-story-theme">
                  {isAr ? story.themeAr : story.themeEn}
                </p>
                <p className="patient-story-quote">
                  {isAr ? story.quoteAr : story.quoteEn}
                </p>
                <footer className="patient-story-context">
                  {isAr ? story.contextAr : story.contextEn}
                </footer>
              </blockquote>
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
