import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";
import { getDripPriceIqd } from "@/lib/invita/pricing";
import { formatIqd } from "@/lib/format";

const WellnessMatcherSection = dynamic(
  () => import("@/components/home/WellnessMatcherSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);

const AddOnsPreview = dynamic(
  () => import("@/components/home/AddOnsPreview"),
  { loading: () => <SectionSkeleton minHeight="14rem" /> }
);

export const metadata = {
  title: "IV Drips",
  description: "11 Invita catalogue IV drip formulas — official Liquivida® USA distributor in Baghdad.",
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
            Eleven Invita catalogue formulas — each begins with a private medical consultation.
          </p>
        </header>

        <WellnessMatcherSection />

        <div className="section-inner protocol-grid">
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

        <AddOnsPreview />

        <div className="section-inner cta-band">
          <p>Not sure which drip is right for you? Take the wellness matcher above.</p>
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
