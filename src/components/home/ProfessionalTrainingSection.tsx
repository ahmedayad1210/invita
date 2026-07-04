"use client";

import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { PROFESSIONAL_TRAINING_ITEMS } from "@/lib/invita/b2b-content";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  variant?: "homepage" | "full";
};

export default function ProfessionalTrainingSection({ variant = "homepage" }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section
      className="professional-training section-padding-sm"
      id={variant === "full" ? "training" : undefined}
    >
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">
              {isAr ? "التدريب المهني" : "Professional training"}
            </p>
            <h2 className="page-title page-title--compact">
              {isAr ? "نُعلّم الفرق الطبية" : "We train clinical teams"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "إنفيتا توفّر تعليماً سريرياً وبروتوكولات وإرشادات سلامة لكل شريك — لضمان جودة متسقة في كل مرفق."
                : "Invita provides clinical education, protocols, and safety guidance for every partner — ensuring consistent quality at every facility."}
            </p>
          </header>
        </ScrollReveal>
        <div className="training-grid">
          {PROFESSIONAL_TRAINING_ITEMS.map((item) => (
            <ScrollReveal key={item.titleEn}>
              <article className="training-card">
                <h3 className="training-card-title">{isAr ? item.titleAr : item.titleEn}</h3>
                <p className="training-card-body">{isAr ? item.bodyAr : item.bodyEn}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
        {variant === "homepage" ? (
          <div className="cta-band">
            <Link href="/for-clinics#training" className="btn-secondary">
              {isAr ? "برامج الشراكة والتدريب" : "Partnership & training programmes"}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
