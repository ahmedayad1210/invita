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
import LeadCaptureBanner from "@/components/home/LeadCaptureBanner";
import FaqPreview from "@/components/home/FaqPreview";
import FooterCtaBanner from "@/components/home/FooterCtaBanner";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

/** Below-fold sections — code-split so hero + menu preview first */
const InvitaGallerySection = dynamic(
  () => import("@/components/home/InvitaGallerySection"),
  { loading: () => <SectionSkeleton minHeight="20rem" /> }
);
const ProfessionalTrainingSection = dynamic(
  () => import("@/components/home/ProfessionalTrainingSection"),
  { loading: () => <SectionSkeleton minHeight="14rem" /> }
);
const HealthcarePartnersSection = dynamic(
  () => import("@/components/home/HealthcarePartnersSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);
const ClinicSpotlightSection = dynamic(
  () => import("@/components/home/ClinicSpotlightSection"),
  { loading: () => <SectionSkeleton minHeight="14rem" /> }
);
const PatientStoriesSection = dynamic(
  () => import("@/components/home/PatientStoriesSection"),
  { loading: () => <SectionSkeleton minHeight="12rem" /> }
);
const InstagramFeed = dynamic(
  () => import("@/components/home/InstagramFeed"),
  { loading: () => <SectionSkeleton minHeight="18rem" /> }
);
const WellnessMatcherSection = dynamic(
  () => import("@/components/home/WellnessMatcherSection"),
  { loading: () => <SectionSkeleton minHeight="16rem" /> }
);
const UseCasesSection = dynamic(
  () => import("@/components/home/UseCasesSection"),
  { loading: () => <SectionSkeleton minHeight="10rem" /> }
);
const TwoPillarSection = dynamic(
  () => import("@/components/home/TwoPillarSection"),
  { loading: () => <SectionSkeleton minHeight="12rem" /> }
);
const AddOnsPreview = dynamic(
  () => import("@/components/home/AddOnsPreview"),
  { loading: () => <SectionSkeleton minHeight="14rem" /> }
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TrustAuthoritySection />
        <StatsSection />
        <ScienceSpotlightSection />
        <ServicesPreview />
        <TwoPillarSection />
        <UseCasesSection />
        <WellnessMatcherSection />
        <AboutLiquividaSection />
        <HowItWorks />
        <AddOnsPreview />
        <InvitaGallerySection />
        <Suspense fallback={<SectionSkeleton minHeight="14rem" />}>
          <CertificationsSection />
        </Suspense>
        <ProfessionalTrainingSection variant="homepage" />
        <HealthcarePartnersSection />
        <ClinicSpotlightSection />
        <PatientStoriesSection />
        <InstagramFeed />
        <LeadCaptureBanner />
        <FaqPreview />
        <FooterCtaBanner />
      </main>
      <Footer />
    </>
  );
}
