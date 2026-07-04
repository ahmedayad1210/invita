"use client";

import ScrollReveal from "@/components/patterns/ScrollReveal";
import { TRUST_AUTHORITY_BADGES } from "@/lib/invita/brand-trust";
import { useLocale } from "@/contexts/LocaleContext";

export default function TrustAuthoritySection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="trust-authority section-padding-sm" aria-label="Industry credentials">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center trust-authority-header">
            <p className="page-eyebrow">
              {isAr ? "الريادة في العراق" : "Iraq's IV therapy authority"}
            </p>
            <h2 className="page-title page-title--compact">
              {isAr
                ? "شركة عافية طبية — وليست سبا"
                : "A healthcare company — not a spa"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "إنفيتا هي العلامة الرائدة في العلاج الوريدي في العراق — للمرضى والعيادات والمراكز الطبية على حد سواء."
                : "Invita is Iraq's leading IV therapy company — serving patients, clinics, and medical centres with international clinical standards."}
            </p>
          </header>
        </ScrollReveal>
        <ul className="trust-authority-grid" role="list">
          {TRUST_AUTHORITY_BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <ScrollReveal key={badge.id}>
                <li
                  className="trust-authority-card"
                  role="listitem"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <span className="trust-authority-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <h3 className="trust-authority-label">
                    {isAr ? badge.labelAr : badge.labelEn}
                  </h3>
                  {badge.detailEn ? (
                    <p className="trust-authority-detail">
                      {isAr ? badge.detailAr : badge.detailEn}
                    </p>
                  ) : null}
                </li>
              </ScrollReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
