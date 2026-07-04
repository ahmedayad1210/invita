"use client";

import LiquividaBadge from "@/components/brand/LiquividaBadge";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaImage from "@/components/patterns/MediaImage";
import { PREMIUM_IMAGES } from "@/lib/invita/premium-images";
import { useLocale } from "@/contexts/LocaleContext";

export default function AboutLiquividaSection() {
  const { t } = useLocale();

  return (
    <section className="section-padding about-liquivida">
      <div className="section-inner about-liquivida-grid">
        <ScrollReveal className="about-liquivida-image about-liquivida-img-wrap">
          <MediaImage
            src={PREMIUM_IMAGES.clinicInterior}
            alt="Invita — Iraq's leading IV therapy company"
            variant="inline"
            width={640}
            height={480}
            sizes="(max-width: 768px) 100vw, 50vw"
            objectPosition="center"
          />
        </ScrollReveal>
        <ScrollReveal className="about-liquivida-copy prose-calm">
          <p className="page-eyebrow">{t.about.eyebrow}</p>
          <h2 className="page-title" style={{ textAlign: "start" }}>
            {t.about.title}
          </h2>
          <LiquividaBadge variant="block" />
          <p>{t.about.body1}</p>
          <p>{t.about.body2}</p>
          <p className="about-callout">{t.about.callout}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
