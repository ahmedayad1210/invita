"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import {
  PARTNER_CTA_AR,
  PARTNER_CTA_EN,
  PARTNER_HEADLINE_AR,
  PARTNER_HEADLINE_EN,
  PARTNER_REASONS,
  PARTNER_STATS,
  PARTNER_SUB_AR,
  PARTNER_SUB_EN,
  PARTNER_WHY_AR,
  PARTNER_WHY_EN,
} from "@/lib/invita/partners-brochure";
import { INVITA } from "@/lib/constants";

export default function PartnersBrochurePage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="partners-brochure">
      <header className="dna-brochure-hero">
        <p className="jd-brand">INVITA · IV VITAMINS THERAPY</p>
        <h1>{isAr ? PARTNER_HEADLINE_AR : PARTNER_HEADLINE_EN}</h1>
        <p>{isAr ? PARTNER_SUB_AR : PARTNER_SUB_EN}</p>
        <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", opacity: 0.8 }}>
          TRUSTED BY DOCTORS · LOVED BY CLIENTS
        </p>
      </header>

      <div className="partners-stats">
        {PARTNER_STATS.map((stat) => (
          <div key={stat.labelEn} className="partners-stat">
            <strong>{stat.value}</strong>
            <span>{isAr ? stat.labelAr : stat.labelEn}</span>
          </div>
        ))}
      </div>

      <h2 className="jd-section-title">{isAr ? PARTNER_WHY_AR : PARTNER_WHY_EN}</h2>
      {PARTNER_REASONS.map((reason) => (
        <article key={reason.titleEn} className="partners-reason">
          <h3>{isAr ? reason.titleAr : reason.titleEn}</h3>
          <p>{isAr ? reason.bodyAr : reason.bodyEn}</p>
        </article>
      ))}

      <section className="jd-price-band">
        <p>{isAr ? PARTNER_CTA_AR : PARTNER_CTA_EN}</p>
        <Link href="/partners/apply" className="jd-btn jd-btn--gold jd-btn--full">
          {isAr ? "انضم كشريك الآن" : "Join as partner now"}
        </Link>
        <Link
          href="/resources/our-partners-invita.pdf"
          className="jd-btn jd-btn--ghost jd-btn--full"
          style={{ marginTop: "0.5rem", color: "#f0ede4", borderColor: "rgba(255,255,255,0.3)" }}
        >
          {isAr ? "تحميل كتيب الشركاء PDF" : "Download partners PDF"}
        </Link>
      </section>

      <footer className="jd-footer">
        <p className="jd-footer-phone">
          <a href={`tel:${INVITA.phone.replace(/\s/g, "")}`}>{INVITA.phone}</a>
        </p>
        <p className="jd-footer-site">
          <a href="mailto:management@invitadrips.com">management@invitadrips.com</a>
        </p>
        <p className="jd-footer-note">
          {isAr
            ? "حصرياً للمنصة والمراكز — بغداد، العراق"
            : "Exclusively for licensed centres — Baghdad, Iraq"}
        </p>
      </footer>
    </div>
  );
}
