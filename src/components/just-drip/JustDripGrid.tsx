"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { JUST_DRIP_MENU } from "@/lib/invita/just-drip-menu";
import JustDripCard from "./JustDripCard";

const FILTERS_AR = ["الكل", "طاقة", "مناعة", "جمال", "أيض", "متقدم"] as const;
const FILTERS_EN = ["All", "Energy", "Immunity", "Beauty", "Metabolism", "Advanced"] as const;

const FILTER_MAP: Record<string, string[]> = {
  الكل: JUST_DRIP_MENU.map((d) => d.slug),
  All: JUST_DRIP_MENU.map((d) => d.slug),
  طاقة: ["energy-boost", "jet-fuel", "dopamin-booster", "nad-plus", "myers-cocktail"],
  Energy: ["energy-boost", "jet-fuel", "dopamin-booster", "nad-plus", "myers-cocktail"],
  مناعة: ["immune-boost", "myers-cocktail"],
  Immunity: ["immune-boost", "myers-cocktail"],
  جمال: ["hair-skin-nails", "skin-radiance", "panthenol-b5"],
  Beauty: ["hair-skin-nails", "skin-radiance", "panthenol-b5"],
  أيض: ["weight-management", "cola-drip-iron"],
  Metabolism: ["weight-management", "cola-drip-iron"],
  متقدم: ["nad-plus", "edta-chelation", "fertility-libido"],
  Advanced: ["nad-plus", "edta-chelation", "fertility-libido"],
};

type Props = {
  compact?: boolean;
  id?: string;
};

export default function JustDripGrid({ compact = false, id = "drips" }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const filters = isAr ? FILTERS_AR : FILTERS_EN;
  const [active, setActive] = useState<string>(filters[0]);

  const drips = useMemo(() => {
    const slugs = FILTER_MAP[active] ?? FILTER_MAP.All;
    return JUST_DRIP_MENU.filter((d) => slugs.includes(d.slug));
  }, [active]);

  return (
    <section id={id} className="jd-grid-section">
      <div className="jd-filter-row" role="tablist" aria-label={isAr ? "تصفية المغذيات" : "Filter drips"}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={active === f}
            className={`jd-filter-chip${active === f ? " active" : ""}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="jd-grid">
        {drips.map((drip) => (
          <JustDripCard key={drip.slug} drip={drip} compact={compact} />
        ))}
      </div>
    </section>
  );
}
