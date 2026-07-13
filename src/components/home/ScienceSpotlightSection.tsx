"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FlaskConical } from "lucide-react";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import { useLocale } from "@/contexts/LocaleContext";
import { NAD_SPOTLIGHT } from "@/lib/invita/content-curation";
import { getInfographic } from "@/lib/invita/local-media";

export default function ScienceSpotlightSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const infographic = getInfographic(NAD_SPOTLIGHT.infographicId);

  return (
    <section className="science-spotlight section-padding-sm" aria-labelledby="science-spotlight-heading">
      <div className="section-inner science-spotlight-inner">
        <ScrollReveal className="science-spotlight-copy">
          <p className="page-eyebrow">
            {isAr ? NAD_SPOTLIGHT.eyebrowAr : NAD_SPOTLIGHT.eyebrowEn}
          </p>
          <h2 id="science-spotlight-heading" className="page-title page-title--compact">
            {isAr ? NAD_SPOTLIGHT.titleAr : NAD_SPOTLIGHT.titleEn}
          </h2>
          <p className="page-lead">
            {isAr ? NAD_SPOTLIGHT.bodyAr : NAD_SPOTLIGHT.bodyEn}
          </p>
          <div className="science-spotlight-stat">
            <span className="science-spotlight-stat-value">{NAD_SPOTLIGHT.statValue}</span>
            <span className="science-spotlight-stat-label">
              {isAr ? NAD_SPOTLIGHT.statLabelAr : NAD_SPOTLIGHT.statLabelEn}
            </span>
          </div>
          <div className="science-spotlight-actions">
            <Link href="/nad-plus" className="btn-primary">
              {isAr ? "بروتوكول NAD+" : "NAD+ protocol"}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/science" className="btn-secondary">
              <FlaskConical size={16} aria-hidden="true" />
              {isAr ? "مركز العلم" : "Science hub"}
            </Link>
          </div>
        </ScrollReveal>

        {infographic ? (
          <ScrollReveal className="science-spotlight-visual">
            <div className="science-spotlight-frame">
              <Image
                src={infographic.path}
                alt={isAr ? "NAD+ تعليمي" : "NAD+ clinical infographic"}
                width={540}
                height={540}
                className="science-spotlight-image"
                sizes="(max-width: 768px) 80vw, 420px"
              />
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
