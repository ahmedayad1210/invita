"use client";

import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaImage from "@/components/patterns/MediaImage";
import { INFOGRAPHIC_LABELS, infographicLabel } from "@/lib/invita/asset-labels";
import { getAllInfographics, getInfographic, type MediaItem } from "@/lib/invita/local-media";

type Topic = NonNullable<(typeof INFOGRAPHIC_LABELS)[string]["topic"]>;

type Props = {
  isAr: boolean;
  title: { en: string; ar: string };
  topic?: Topic;
  ids?: string[];
  limit?: number;
  featured?: boolean;
};

export default function ScienceInfographics({
  isAr,
  title,
  topic,
  ids,
  limit = 4,
  featured = false,
}: Props) {
  const locale = isAr ? "ar" : "en";
  const resolved = ids
    ? ids.map((id) => getInfographic(id)).filter((item): item is MediaItem => Boolean(item))
    : getAllInfographics().filter((item) =>
        topic ? INFOGRAPHIC_LABELS[item.id]?.topic === topic : true,
      );
  const items = resolved.slice(0, limit);

  if (items.length === 0) return null;

  const [hero, ...rest] = items;

  return (
    <ScrollReveal>
      <h3 className="science-subtitle">{isAr ? title.ar : title.en}</h3>
      {featured && hero ? (
        <div className="science-infographic-feature">
          <MediaImage
            src={hero.path}
            alt={infographicLabel(hero.id, locale)}
            variant="infographic"
            label={infographicLabel(hero.id, locale)}
            width={720}
            height={720}
            sizes="(max-width: 768px) 100vw, 480px"
            frameClassName="science-infographic-feature-frame"
          />
        </div>
      ) : null}
      <div className={`science-infographic-grid${featured ? " science-infographic-grid--compact" : ""}`}>
        {(featured ? rest : items).map((item) => (
          <MediaImage
            key={item.id}
            src={item.path}
            alt={infographicLabel(item.id, locale)}
            variant="infographic"
            label={infographicLabel(item.id, locale)}
            width={540}
            height={540}
            sizes="(max-width: 640px) 45vw, 220px"
          />
        ))}
      </div>
    </ScrollReveal>
  );
}
