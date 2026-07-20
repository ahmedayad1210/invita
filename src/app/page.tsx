import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustAuthoritySection from "@/components/home/TrustAuthoritySection";
import StatsSection from "@/components/home/StatsSection";
import ScienceSpotlightSection from "@/components/home/ScienceSpotlightSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutLiquividaSection from "@/components/home/AboutLiquividaSection";
import HowItWorks from "@/components/home/HowItWorks";
import CertificationsSection from "@/components/home/CertificationsSection";
import FaqPreview from "@/components/home/FaqPreview";
import FooterCtaBanner from "@/components/home/FooterCtaBanner";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { getHomepageHeroBanner } from "@/lib/media/homepage-banners.server";

/** Below-fold sections — code-split so the hero + offer render first. */
const WellnessMatcherSection = dynamic(
  () => import("@/components/home/WellnessMatcherSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);
const TwoPillarSection = dynamic(
  () => import("@/components/home/TwoPillarSection"),
  { loading: () => <SectionSkeleton minHeight="12rem" /> }
);
const HealthcarePartnersSection = dynamic(
  () => import("@/components/home/HealthcarePartnersSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);
const InvitaGallerySection = dynamic(
  () => import("@/components/home/InvitaGallerySection"),
  { loading: () => <SectionSkeleton minHeight="20rem" /> }
);
const InstagramFeed = dynamic(
  () => import("@/components/home/InstagramFeed"),
  { loading: () => <SectionSkeleton minHeight="18rem" /> }
);

export default async function HomePage() {
  const heroBanner = await getHomepageHeroBanner();

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Navbar />
      <main id="main-content">
        {/* Hook */}
        <HeroSection bannerUrl={heroBanner?.url} bannerAlt={heroBanner?.alt} />

        {/* Offer — lead with what you can get and how easy it is */}
        <TrustAuthoritySection />
        <ServicesPreview />
        <WellnessMatcherSection />
        <HowItWorks />

        {/* Proof & story */}
        <StatsSection />
        <AboutLiquividaSection />
        <TwoPillarSection />

        {/* Science & trust */}
        <ScienceSpotlightSection />
        <Suspense fallback={<SectionSkeleton minHeight="14rem" />}>
          <CertificationsSection />
        </Suspense>

        {/* Network, visuals & community */}
        <HealthcarePartnersSection />
        <InvitaGallerySection />
        <InstagramFeed />

        {/* Close */}
        <FaqPreview />
        <FooterCtaBanner />
      </main>
      <Footer />
    </>
  );
}
