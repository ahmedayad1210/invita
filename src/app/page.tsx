import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustAuthoritySection from "@/components/home/TrustAuthoritySection";
import StatsSection from "@/components/home/StatsSection";
import CertificationsSection from "@/components/home/CertificationsSection";
import LeadCaptureBanner from "@/components/home/LeadCaptureBanner";
import AboutLiquividaSection from "@/components/home/AboutLiquividaSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesPreview from "@/components/home/ServicesPreview";
import ProfessionalTrainingSection from "@/components/home/ProfessionalTrainingSection";
import HealthcarePartnersSection from "@/components/home/HealthcarePartnersSection";
import PatientStoriesSection from "@/components/home/PatientStoriesSection";
import InvitaGallerySection from "@/components/home/InvitaGallerySection";
import CelebrityWellness from "@/components/home/CelebrityWellness";
import InstagramFeed from "@/components/home/InstagramFeed";
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
        <CertificationsSection />
        <AboutLiquividaSection />
        <InvitaGallerySection />
        <HowItWorks />
        <ServicesPreview />
        <ProfessionalTrainingSection variant="homepage" />
        <HealthcarePartnersSection />
        <PatientStoriesSection />
        <CelebrityWellness />
        <InstagramFeed />
        <LeadCaptureBanner />
        <FaqPreview />
        <FooterCtaBanner />
      </main>
      <Footer />
    </>
  );
}
