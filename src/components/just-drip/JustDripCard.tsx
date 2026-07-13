"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import type { JustDripItem } from "@/lib/invita/just-drip-menu";

type Props = {
  drip: JustDripItem;
  compact?: boolean;
};

export default function JustDripCard({ drip, compact = false }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const href = drip.bookSlug ? `/book?drip=${drip.bookSlug}` : `/contact?source=drip-${drip.slug}`;
  const tags = isAr ? drip.tagsAr : drip.tagsEn;

  return (
    <Link href={href} className={`jd-card${compact ? " jd-card--compact" : ""}`}>
      <div className="jd-card-icon" style={{ backgroundColor: drip.accent }}>
        <span aria-hidden="true">{drip.icon}</span>
      </div>
      <div className="jd-card-body">
        <h3 className="jd-card-title">{isAr ? drip.nameAr : drip.nameEn}</h3>
        {!compact ? (
          <p className="jd-card-desc">{isAr ? drip.descriptionAr : drip.descriptionEn}</p>
        ) : null}
        <p className="jd-card-ingredients">{drip.ingredients}</p>
        <div className="jd-card-tags">
          {tags.map((tag) => (
            <span key={tag} className="jd-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
