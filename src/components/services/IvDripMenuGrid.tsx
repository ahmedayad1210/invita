import Link from "next/link";
import Image from "next/image";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd } from "@/lib/format";

export default function IvDripMenuGrid() {
  return (
    <div className="protocol-grid">
      {LIQUIVIDA_DRIPS.map((drip) => (
        <Link key={drip.slug} href={`/iv-therapy/${drip.slug}`} className="protocol-card">
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
      ))}
    </div>
  );
}
