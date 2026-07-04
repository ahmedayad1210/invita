"use client";

import MediaImage from "@/components/patterns/MediaImage";
import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { PREMIUM_IMAGES } from "@/lib/invita/premium-images";
import { useLocale } from "@/contexts/LocaleContext";

export default function TransformationSection() {
  const { t } = useLocale();

  const steps = [
    { num: "01", title: t.transformation.step1Title, body: t.transformation.step1Body },
    { num: "02", title: t.transformation.step2Title, body: t.transformation.step2Body },
    { num: "03", title: t.transformation.step3Title, body: t.transformation.step3Body },
  ];

  return (
    <section className="transformation-section section-padding">
      <div className="section-inner transformation-grid">
        <ScrollReveal className="transformation-visual">
          <MediaImage
            src={PREMIUM_IMAGES.transformation}
            alt="Wellness transformation at Invita"
            variant="editorial"
            width={640}
            height={800}
            sizes="(max-width: 768px) 100vw, 50vw"
            objectPosition="center"
          />
        </ScrollReveal>
        <ScrollReveal className="transformation-copy">
          <p className="page-eyebrow">{t.transformation.eyebrow}</p>
          <h2 className="page-title" style={{ textAlign: "start" }}>
            {t.transformation.title}
          </h2>
          <p className="page-lead page-lead--narrow" style={{ textAlign: "start", marginInline: 0 }}>
            {t.transformation.lead}
          </p>
          <ol className="transformation-steps">
            {steps.map((step) => (
              <li key={step.num} className="transformation-step">
                <span className="transformation-step-num">{step.num}</span>
                <div>
                  <h3 className="transformation-step-title">{step.title}</h3>
                  <p className="transformation-step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/book" className="btn-primary transformation-cta">
            {t.cta.bookSession}
          </Link>
          <p className="cta-hint">{t.cta.whatHappensNext}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
