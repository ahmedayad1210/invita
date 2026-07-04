"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function TwoPillarSection() {
  const { t } = useLocale();

  return (
    <section className="section-pillars">
      <div className="section-inner pillars-grid">
        <Link href="/iv-therapy" className="pillar-card">
          <span className="pillar-icon">◆</span>
          <h2 className="pillar-title">{t.pillars.ivTitle}</h2>
          <p className="pillar-desc">{t.pillars.ivDesc}</p>
          <span className="pillar-link">→</span>
        </Link>
        <Link href="/dna" className="pillar-card pillar-card-accent">
          <span className="pillar-icon">◇</span>
          <h2 className="pillar-title">{t.pillars.dnaTitle}</h2>
          <p className="pillar-desc">{t.pillars.dnaDesc}</p>
          <span className="pillar-link">→</span>
        </Link>
      </div>
    </section>
  );
}
