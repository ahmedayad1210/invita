"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  bannerUrl?: string | null;
  bannerAlt?: string | null;
};

/** Immunity drip formula shown in the hero's signature card. */
const FORMULA = [
  { name: "Vitamin C", dose: "5000 mg" },
  { name: "Glutathione", dose: "1200 mg" },
  { name: "B-Complex", dose: "full" },
  { name: "Zinc", dose: "5 mg" },
  { name: "Saline base", dose: "500 mL" },
];

export default function HeroSection(_props: Props) {
  const { t } = useLocale();

  return (
    <section className="ivx-hero" aria-label="Invita — IV therapy">
      <div className="ivx-hero-inner">
        {/* Thesis */}
        <div>
          <span className="ivx-eyebrow">{t.hero.eyebrow}</span>

          <h1 className="ivx-title">
            The clinical standard for <em>IV therapy</em> in Iraq.
          </h1>

          <p className="ivx-sub">{t.hero.subtitle}</p>

          <div className="ivx-ctas">
            <Link href="/book" className="ivx-cta ivx-cta--primary">
              {t.hero.ctaBook}
            </Link>
            <Link href="/iv-therapy" className="ivx-cta ivx-cta--ghost">
              {t.hero.ctaPrimary}
            </Link>
          </div>

          <div className="ivx-trust" aria-hidden="true">
            <span>Licensed clinicians</span>
            <span>Private suite</span>
            <span>Nationwide supply</span>
          </div>
        </div>

        {/* Signature — the drip as a precise medical formula */}
        <div className="ivx-rx-wrap">
          <span className="ivx-drip" aria-hidden="true" />
          <article className="ivx-rx" aria-label="Sample IV formula">
            <div className="ivx-rx-head">
              <span className="ivx-rx-name">Immunity</span>
              <span className="ivx-rx-code">IV-04</span>
            </div>
            <p className="ivx-rx-tag">Physician-formulated · 45 min infusion</p>

            <div className="ivx-rx-rows">
              {FORMULA.map((row) => (
                <div className="ivx-rx-row" key={row.name}>
                  <span className="lead">{row.name}</span>
                  <span className="dose">{row.dose}</span>
                </div>
              ))}
            </div>

            <div className="ivx-rx-bar" aria-hidden="true">
              <i />
            </div>
            <div className="ivx-rx-status">
              <span className="live">Infusing</span>
              <span>Liquivida® USA</span>
            </div>
          </article>
          <span className="ivx-boost" aria-hidden="true">+ NAD⁺ boost</span>
        </div>
      </div>
    </section>
  );
}
