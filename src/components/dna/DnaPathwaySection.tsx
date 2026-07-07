import Link from "next/link";
import Image from "next/image";
import { getPathwayForPanel } from "@/lib/invita/dna-pathways";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";

type Props = {
  panelSlug: string;
  locale?: "en" | "ar";
};

export default function DnaPathwaySection({ panelSlug, locale = "en" }: Props) {
  const pathway = getPathwayForPanel(panelSlug);
  if (!pathway) return null;

  const isAr = locale === "ar";
  const drips = pathway.dripSlugs
    .map((slug) => getLiquividaDrip(slug))
    .filter(Boolean);

  return (
    <section className="dna-pathway-section">
      <h3>{isAr ? "بروتوكولات IV موصى بها" : "Recommended IV pathways"}</h3>
      <p className="dna-pathway-rationale">
        {isAr ? pathway.rationaleAr : pathway.rationaleEn}
      </p>

      <ul className="dna-pathway-drips">
        {drips.map((drip) => {
          if (!drip) return null;
          return (
            <li key={drip.slug}>
              <Link href={`/iv-therapy/${drip.slug}`} className="dna-pathway-drip-card">
                <Image
                  src={getProtocolDripImage(drip.slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK}
                  alt=""
                  width={48}
                  height={48}
                  className="dna-pathway-drip-icon"
                />
                <div>
                  <strong>{drip.name}</strong>
                  <span>{drip.tagline}</span>
                </div>
              </Link>
              <Link href={`/book?drip=${drip.slug}`} className="btn-secondary btn-sm">
                {isAr ? "احجز" : "Book"}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
