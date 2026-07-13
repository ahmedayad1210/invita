import Link from "next/link";
import Image from "next/image";
import type { LiquividaDrip } from "@/lib/invita/liquivida-drips";
import { LIQUIVIDA_DRIPS, FAQ_ITEMS } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { formatIqd, PRICING_DISCLAIMER_EN } from "@/lib/format";
import DripDetailFaq from "@/components/services/DripDetailFaq";

type Props = {
  drip: LiquividaDrip;
  priceIqd: number;
};

const SESSION_NOTES: Record<string, string> = {
  "nad-plus":
    "NAD+ is infused slowly over approximately 90 minutes. Your clinician titrates the rate for comfort. We recommend fasting 4–6 hours beforehand (water only).",
  default:
    "Sessions typically take 45–60 minutes, following a complimentary 15-minute medical consultation to review your health history and goals.",
};

export default function DripDetailContent({ drip, priceIqd }: Props) {
  const related = LIQUIVIDA_DRIPS.filter(
    (d) => d.tier === drip.tier && d.slug !== drip.slug
  ).slice(0, 3);

  const sessionNote = SESSION_NOTES[drip.slug] ?? SESSION_NOTES.default;
  const bookHref =
    drip.slug === "nad-plus" ? "/book?drip=nad-plus" : `/book?drip=${drip.slug}`;

  return (
    <div className="section-inner drip-detail-page">
      <div className="drip-detail-hero">
        <div className="drip-detail-visual">
          <Image
            src={getProtocolDripImage(drip.slug, drip.imageSlug) ?? DRIP_IMAGE_FALLBACK}
            alt={drip.name}
            width={280}
            height={280}
            className="drip-detail-icon"
            priority
          />
        </div>
        <header className="detail-header">
          <Link href="/iv-drip-menu" className="back-link">
            ← IV Drip Menu
          </Link>
          <span className="protocol-tier">Liquivida® · {drip.tier}</span>
          <h1 className="page-title">{drip.name}</h1>
          <p className="protocol-tagline">{drip.tagline}</p>
          <p className="drip-price-display">{formatIqd(priceIqd)}</p>
          <p className="drip-price-disclaimer">{PRICING_DISCLAIMER_EN}</p>
          <Link href={bookHref} className="btn-primary">
            Book A Treatment
          </Link>
        </header>
      </div>

      <section className="drip-detail-section">
        <h2 className="service-landing-heading">About this protocol</h2>
        <p className="service-landing-prose">{drip.description}</p>
        <p className="service-landing-prose">
          Every Invita drip uses an official Liquivida® USA formula, administered following a
          complimentary wellness consultation with one of our medical professionals.
        </p>
      </section>

      <section className="drip-detail-section">
        <h2 className="service-landing-heading">What to expect</h2>
        <div className="service-landing-meta-grid">
          <div className="service-landing-meta-card">
            <span className="service-landing-meta-label">Service duration</span>
            <p className="service-landing-meta-value">
              {drip.slug === "nad-plus" ? "~90 minutes" : "45–60 minutes"}
            </p>
          </div>
          <div className="service-landing-meta-card">
            <span className="service-landing-meta-label">Consultation</span>
            <p className="service-landing-meta-value">Complimentary · ~15 minutes</p>
          </div>
        </div>
        <p className="service-landing-prose">{sessionNote}</p>
      </section>

      <section className="drip-detail-section">
        <h2 className="service-landing-heading">Benefits may include</h2>
        <ul className="service-landing-benefits">
          <li>{drip.tagline}</li>
          <li>100% absorption — nutrients delivered directly to your bloodstream</li>
          <li>Clinician-guided protocol tailored to your health history</li>
          <li>Private infusion suite in Al-Mansour, Baghdad</li>
        </ul>
      </section>

      <DripDetailFaq items={FAQ_ITEMS.slice(0, 4)} />

      {related.length > 0 ? (
        <section className="drip-detail-section">
          <h2 className="service-landing-heading">Related protocols</h2>
          <div className="service-landing-related">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/iv-therapy/${r.slug}`}
                className="service-landing-related-card"
              >
                <h3>{r.name}</h3>
                <p>{r.tagline}</p>
                <span className="service-landing-related-link">View protocol →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="cta-band">
        <p>Book a session and receive a complimentary wellness assessment.</p>
        <Link href={bookHref} className="btn-primary">
          Book A Treatment
        </Link>
        <p className="cta-hint">{PRICING_DISCLAIMER_EN}</p>
      </div>
    </div>
  );
}
