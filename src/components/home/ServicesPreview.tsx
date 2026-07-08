// src/components/home/ServicesPreview.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { HOMEPAGE_DRIP_SLUGS } from "@/lib/invita/content-curation";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getInfographic } from "@/lib/invita/local-media";
import { formatIqd } from "@/lib/format";
import { formatDuration } from "@/lib/time-slots";
import { useLocale } from "@/contexts/LocaleContext";

const HOMEPAGE_DRIPS = HOMEPAGE_DRIP_SLUGS.map((slug) =>
  LIQUIVIDA_DRIPS.find((d) => d.slug === slug)
).filter(Boolean) as typeof LIQUIVIDA_DRIPS;

export default function ServicesPreview() {
  const { t } = useLocale();
  const copy = t.servicesPreview;

  return (
    <section className="services-preview section-padding" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-invita">
        <div className="services-preview-header">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 className="services-preview-title">{copy.title}</h2>
            <p className="services-preview-lead">{copy.lead}</p>
          </div>
          <Link href="/iv-therapy" className="services-preview-link">
            {copy.viewAll} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="services-preview-grid services-preview-grid--rich">
          {HOMEPAGE_DRIPS.map((drip) => {
            const infographic = drip.infographicId
              ? getInfographic(drip.infographicId)
              : undefined;
            const iconSrc =
              getProtocolDripImage(drip.slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK;
            const price = getDripPriceIqd(drip.slug);

            return (
              <Link
                key={drip.slug}
                href={`/iv-therapy/${drip.slug}`}
                className="services-preview-card"
              >
                <div className="services-preview-card-visual">
                  {infographic ? (
                    <Image
                      src={infographic.path}
                      alt=""
                      width={200}
                      height={200}
                      className="services-preview-infographic"
                      sizes="120px"
                    />
                  ) : (
                    <Image
                      src={iconSrc}
                      alt=""
                      width={80}
                      height={80}
                      className="services-preview-icon"
                    />
                  )}
                  <span className="services-preview-tier">{drip.tier}</span>
                </div>
                <div className="services-preview-card-body">
                  <h3>{drip.name}</h3>
                  <p>{drip.tagline}</p>
                  <div className="services-preview-card-footer">
                    <div>
                      <span className="services-preview-price">{formatIqd(price)}</span>
                      <span className="services-preview-duration">
                        <Clock size={11} aria-hidden="true" />
                        {formatDuration(drip.slug === "nad-plus" ? 90 : 45)}
                      </span>
                    </div>
                    <span className="services-preview-arrow" aria-hidden="true">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
