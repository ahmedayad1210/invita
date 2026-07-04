"use client";

import { NETWORK_STATS } from "@/lib/invita/healthcare-network";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  variant?: "default" | "compact";
};

export default function NetworkStatsBar({ variant = "default" }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <ul className={`network-stats${variant === "compact" ? " network-stats--compact" : ""}`}>
      {NETWORK_STATS.map((stat) => (
        <li key={stat.id} className="network-stat">
          <span className="network-stat-check" aria-hidden="true">
            ✔
          </span>
          <strong>{isAr ? stat.displayAr : stat.displayEn}</strong>
          <span>{isAr ? stat.labelAr : stat.labelEn}</span>
        </li>
      ))}
    </ul>
  );
}
