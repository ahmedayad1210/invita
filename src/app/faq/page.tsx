"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  COMPREHENSIVE_FAQ,
  FAQ_CATEGORIES,
  type FaqCategory,
} from "@/lib/invita/faq-comprehensive";
import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function FaqPage() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const [category, setCategory] = useState<FaqCategory>("patients");
  const [open, setOpen] = useState<number | null>(0);

  const items = COMPREHENSIVE_FAQ.filter((item) => item.category === category);

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero section-padding-sm">
          <p className="page-eyebrow">{isAr ? "وضوح وسلامة" : "Clarity & safety"}</p>
          <h1 className="page-title">{t.faq.title}</h1>
          <p className="page-lead page-lead--narrow">
            {isAr
              ? "إجابات للمرضى والعيادات والشركاء — من الشركة الرائدة في العلاج الوريدي في العراق."
              : "Answers for patients, clinics, and partners — from Iraq's leading IV therapy company."}
          </p>
        </header>

        <div className="section-inner faq-page-layout">
          <nav className="faq-category-nav" aria-label="FAQ categories">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`faq-category-btn${category === cat.id ? " active" : ""}`}
                onClick={() => {
                  setCategory(cat.id);
                  setOpen(0);
                }}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </nav>

          <div className="faq-list faq-list--full">
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

          <div className="faq-page-ctas">
            <Link href="/book" className="btn-primary">
              {t.cta.startConsultation}
            </Link>
            <Link href="/for-clinics" className="btn-secondary">
              {isAr ? "للعيادات والشركاء" : "For clinics & partners"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
