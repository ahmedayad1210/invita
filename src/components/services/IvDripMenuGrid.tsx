"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LIQUIVIDA_DRIPS, type LiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd } from "@/lib/format";

const TIERS = ["All", "Signature", "Wellness", "Performance", "Beauty"] as const;
type TierFilter = (typeof TIERS)[number];

export default function IvDripMenuGrid() {
  const [tier, setTier] = useState<TierFilter>("All");

  const drips =
    tier === "All"
      ? LIQUIVIDA_DRIPS
      : LIQUIVIDA_DRIPS.filter((d) => d.tier === tier);

  return (
    <>
      <nav className="drip-menu-filter" aria-label="Browse by concern">
        <p className="drip-menu-filter-label">Browse by concern</p>
        <div className="category-filter">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              className={`category-filter-btn${tier === t ? " active" : ""}`}
              onClick={() => setTier(t)}
            >
              {t === "All" ? "All drips" : t}
            </button>
          ))}
        </div>
      </nav>

      <div className="protocol-grid">
        {drips.map((drip) => (
          <DripCard key={drip.slug} drip={drip} />
        ))}
      </div>
    </>
  );
}

function DripCard({ drip }: { drip: LiquividaDrip }) {
  return (
    <Link href={`/iv-therapy/${drip.slug}`} className="protocol-card">
      <div className="protocol-card-icon">
        <Image
          src={getProtocolDripImage(drip.slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK}
          alt=""
          width={120}
          height={120}
          className="protocol-drip-icon"
        />
      </div>
      <span className="protocol-tier">{drip.tier}</span>
      <h2>{drip.name}</h2>
      <p className="protocol-tagline">{drip.tagline}</p>
      <p className="protocol-price">From {formatIqd(getDripPriceIqd(drip.slug))}</p>
    </Link>
  );
}
