import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd, PRICING_DISCLAIMER_EN } from "@/lib/format";
import { dripProcedureJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { LIQUIVIDA_DRIPS } = await import("@/lib/invita/liquivida-drips");
  return LIQUIVIDA_DRIPS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const drip = getLiquividaDrip(slug);
  if (!drip) return { title: "IV Drip" };
  const price = getDripPriceIqd(slug);
  return {
    title: drip.name,
    description: `${drip.description} From ${formatIqd(price)}.`,
  };
}

export default async function DripDetailPage({ params }: Props) {
  const { slug } = await params;
  const drip = getLiquividaDrip(slug);
  if (!drip) notFound();

  const priceIqd = getDripPriceIqd(slug);

  return (
    <>
      <JsonLd
        data={dripProcedureJsonLd({
          name: drip.name,
          description: drip.description,
          slug: drip.slug,
          priceIqd,
        })}
      />
      <Navbar />
      <main id="main-content" className="page-main">
        <div className="section-inner detail-layout detail-layout--drip">
          <div className="drip-detail-visual">
            <Image
              src={getProtocolDripImage(slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK}
              alt={drip.name}
              width={280}
              height={280}
              className="drip-detail-icon"
              priority
            />
          </div>
          <header className="detail-header">
            <Link href="/iv-therapy" className="back-link">
              ← IV Drips
            </Link>
            <span className="protocol-tier">Liquivida® · {drip.tier}</span>
            <h1 className="page-title">{drip.name}</h1>
            <p className="protocol-tagline">{drip.tagline}</p>
            <p className="drip-price-display">{formatIqd(priceIqd)}</p>
            <p className="drip-price-disclaimer">{PRICING_DISCLAIMER_EN}</p>
          </header>
          <div className="detail-body">
            <p>{drip.description}</p>
            <p className="text-muted">
              Every Invita drip uses an official Liquivida® USA formula, administered following
              a complimentary wellness consultation.
            </p>
            <Link href={`/book?drip=${slug}`} className="btn-primary">
              Start Your Consultation
            </Link>
            <p className="cta-hint">{PRICING_DISCLAIMER_EN}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
