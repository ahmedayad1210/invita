"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function FooterCtaBanner() {
  const { t } = useLocale();

  return (
    <section className="footer-cta-banner section-padding-sm">
      <div className="section-inner footer-cta-inner">
        <h2>{t.footerCta.title}</h2>
        <p>{t.footerCta.body}</p>
        <div className="footer-cta-dual">
          <Link href="/book" className="btn-hero-primary">
            {t.footerCta.cta}
          </Link>
          <Link href="/for-clinics" className="btn-hero-secondary">
            {t.footerCta.ctaB2b}
          </Link>
        </div>
        <p className="cta-hint" style={{ color: "rgba(250,247,242,0.55)" }}>
          {t.cta.whatHappensNext}
        </p>
      </div>
    </section>
  );
}
