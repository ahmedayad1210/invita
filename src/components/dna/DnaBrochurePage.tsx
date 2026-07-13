"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import {
  DNA_CATEGORIES,
  DNA_FOOTER_AR,
  DNA_FOOTER_EN,
  DNA_HERO_AR,
  DNA_HERO_EN,
  DNA_LEAD_AR,
  DNA_LEAD_EN,
  DNA_RESULT_LEGEND,
  DNA_STEPS,
} from "@/lib/invita/dna-brochure";
import { INVITA } from "@/lib/constants";

export default function DnaBrochurePage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="dna-brochure">
      <header className="dna-brochure-hero">
        <p className="jd-brand">INVITA · DNA ANALYSIS</p>
        <h1>{isAr ? DNA_HERO_AR : DNA_HERO_EN}</h1>
        <p>{isAr ? DNA_LEAD_AR : DNA_LEAD_EN}</p>
      </header>

      <section aria-label={isAr ? "كيف تعمل" : "How it works"}>
        <h2 className="jd-section-title">{isAr ? "كيف تعمل؟" : "How it works"}</h2>
        <div className="dna-steps">
          {DNA_STEPS.map((step) => (
            <article key={step.step} className="dna-step">
              <span className="dna-step-num">{step.step}</span>
              <h3>{isAr ? step.titleAr : step.titleEn}</h3>
              <p>{isAr ? step.bodyAr : step.bodyEn}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label={isAr ? "فئات التحليل" : "Analysis categories"}>
        {DNA_CATEGORIES.map((cat) => (
          <article key={cat.id} className="dna-category">
            <div className="dna-category-head">
              <span aria-hidden="true">{cat.icon}</span>
              <h3>{isAr ? cat.titleAr : cat.titleEn}</h3>
              <span className="dna-category-count">
                {cat.count} {isAr ? cat.countLabelAr : cat.countLabelEn}
              </span>
            </div>
            <div className="dna-tags">
              {(isAr ? cat.tagsAr : cat.tagsEn).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section aria-label={isAr ? "قراءة النتائج" : "Reading results"}>
        <h2 className="jd-section-title">{isAr ? "كيف تقرأ نتيجتك" : "How to read your results"}</h2>
        <div className="dna-legend">
          {DNA_RESULT_LEGEND.map((item) => (
            <div key={item.labelEn} className="dna-legend-item">
              <span className="dna-legend-dot" style={{ backgroundColor: item.color }} />
              <div>
                <strong>{isAr ? item.labelAr : item.labelEn}</strong>
                <p>{isAr ? item.bodyAr : item.bodyEn}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="jd-price-band">
        <p>{isAr ? DNA_FOOTER_AR : DNA_FOOTER_EN}</p>
        <Link href="/contact?source=dna" className="jd-btn jd-btn--gold jd-btn--full">
          {isAr ? "اسأل عن تحليل DNA الآن" : "Ask about DNA analysis"}
        </Link>
      </section>

      <footer className="jd-footer">
        <p className="jd-footer-phone">
          <a href={`tel:${INVITA.phone.replace(/\s/g, "")}`}>{INVITA.phone}</a>
        </p>
        <p className="jd-footer-site">
          <a href="https://www.invitadrips.com">www.invitadrips.com</a>
        </p>
      </footer>
    </div>
  );
}
