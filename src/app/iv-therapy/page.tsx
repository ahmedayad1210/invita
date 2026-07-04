import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { getDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd } from "@/lib/format";

export const metadata = {
  title: "IV Drips",
  description: "18 Liquivida® USA IV drip formulas — official distributor in Baghdad.",
};

export default function IvTherapyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero">
          <LiquividaBadge variant="block" />
          <h1 className="page-title">IV Drip Menu</h1>
          <p className="page-lead page-lead--narrow">
            Eighteen Liquivida® USA formulas — each begins with a private medical consultation.
          </p>
        </header>

        <div className="section-inner protocol-grid">
          {LIQUIVIDA_DRIPS.map((drip) => (
            <Link key={drip.slug} href={`/iv-therapy/${drip.slug}`} className="protocol-card">
              <div className="protocol-card-icon">
                <Image
                  src={getDripImage(drip.slug) ?? DRIP_IMAGE_FALLBACK}
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

        <div className="section-inner cta-band">
          <p>Not sure which drip is right for you? We will recommend the ideal protocol.</p>
          <Link href="/book" className="btn-primary">
            Start Your Consultation
          </Link>
          <p className="cta-hint">A clinician will confirm your protocol within 24 hours.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
