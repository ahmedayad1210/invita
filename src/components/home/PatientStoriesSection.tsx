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
            <p className="page-eyebrow">{isAr ? "نتائج حقيقية" : "Patient outcomes"}</p>
            <h2 className="page-title page-title--compact">
              {isAr ? "قصص التحول" : "Transformation stories"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "طاقة. تعافٍ. وضوح. — من عملاء اختاروا العناية الطبية الوريدية."
                : "Energy. Recovery. Clarity. — from clients who chose medically supervised IV therapy."}
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
                  &ldquo;{isAr ? story.quoteAr : story.quoteEn}&rdquo;
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
