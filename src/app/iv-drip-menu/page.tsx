import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import IvDripMenuGrid from "@/components/services/IvDripMenuGrid";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";

const WellnessMatcherSection = dynamic(
  () => import("@/components/home/WellnessMatcherSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);

export const metadata = {
  title: "IV Drip Menu",
  description:
    "Browse eleven Invita catalogue IV drip formulas — official Liquivida® USA distributor in Baghdad.",
};

export default function IvDripMenuPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero">
          <LiquividaBadge variant="block" />
          <p className="page-eyebrow">Core therapies · Liquivida® USA</p>
          <h1 className="page-title">IV Drip Menu</h1>
          <p className="page-lead page-lead--narrow">
            Eleven Invita catalogue formulas — each begins with a private medical consultation.
            Not sure where to start?{" "}
            <Link href="/iv-therapy">Learn about IV Drip Therapy</Link> or take the wellness matcher
            below.
          </p>
        </header>

        <WellnessMatcherSection />

        <div className="section-inner">
          <IvDripMenuGrid />
        </div>

        <div className="section-inner service-landing-menu-links">
          <Link href="/nad-plus" className="service-landing-menu-pill">
            NAD+ IV Therapy
          </Link>
          <Link href="/glp-1" className="service-landing-menu-pill">
            GLP-1 Weight Management
          </Link>
          <Link href="/iv-therapy" className="service-landing-menu-pill">
            About IV Therapy
          </Link>
        </div>

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
