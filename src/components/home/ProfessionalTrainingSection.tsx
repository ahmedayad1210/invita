"use client";

import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { PROFESSIONAL_TRAINING_ITEMS } from "@/lib/invita/b2b-content";
import { PARTNER_RESOURCES } from "@/lib/invita/content-curation";
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
                ? "Safety 101، كتalog المنتجات، وشهادات ISO — كل ما يحتاجه شريكك للبدء."
                : "Safety 101, product catalogue, and ISO certifications — everything your partner facility needs to get started."}
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

        <ScrollReveal>
          <div className="partner-resources">
            <h3 className="partner-resources-title">
              {isAr ? "مراجع للشركاء" : "Partner resources"}
            </h3>
            <div className="partner-resources-grid">
              {PARTNER_RESOURCES.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.path}
                  className="partner-resource-card"
                  download
                >
                  <ArrowDownToLine size={18} aria-hidden="true" />
                  <div>
                    <p className="partner-resource-name">
                      {isAr ? resource.titleAr : resource.titleEn}
                    </p>
                    <p className="partner-resource-desc">
                      {isAr ? resource.descAr : resource.descEn}
                    </p>
                  </div>
                  <span className="partner-resource-size">{resource.size}</span>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>

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
