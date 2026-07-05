import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustAuthoritySection from "@/components/home/TrustAuthoritySection";
import StatsSection from "@/components/home/StatsSection";
import ScienceSpotlightSection from "@/components/home/ScienceSpotlightSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutLiquividaSection from "@/components/home/AboutLiquividaSection";
import HowItWorks from "@/components/home/HowItWorks";
import InvitaGallerySection from "@/components/home/InvitaGallerySection";
import CertificationsSection from "@/components/home/CertificationsSection";
import ProfessionalTrainingSection from "@/components/home/ProfessionalTrainingSection";
import HealthcarePartnersSection from "@/components/home/HealthcarePartnersSection";
import ClinicSpotlightSection from "@/components/home/ClinicSpotlightSection";
import PatientStoriesSection from "@/components/home/PatientStoriesSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import LeadCaptureBanner from "@/components/home/LeadCaptureBanner";
import FaqPreview from "@/components/home/FaqPreview";
import FooterCtaBanner from "@/components/home/FooterCtaBanner";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

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
        <AboutLiquividaSection />
        <HowItWorks />
        <InvitaGallerySection />
        <CertificationsSection />
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
