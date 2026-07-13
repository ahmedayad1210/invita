import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import Testimonials from "@/components/home/Testimonials";
import LeadCaptureBanner from "@/components/home/LeadCaptureBanner";
import AboutLiquividaSection from "@/components/home/AboutLiquividaSection";
import ValuePropsGrid from "@/components/home/ValuePropsGrid";
import CelebrityWellness from "@/components/home/CelebrityWellness";
import ServicesPreview from "@/components/home/ServicesPreview";
import UseCasesSection from "@/components/home/UseCasesSection";
import HowItWorks from "@/components/home/HowItWorks";
import FaqPreview from "@/components/home/FaqPreview";
import FooterCtaBanner from "@/components/home/FooterCtaBanner";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";

const InstagramFeed = dynamic(
  () => import("@/components/home/InstagramFeed"),
  { loading: () => <SectionSkeleton minHeight="18rem" /> }
);

type Props = {
  showHero?: boolean;
  heroBanner?: { url?: string | null; alt?: string | null };
  showInstagram?: boolean;
};

/** Elixir Clinic–style IV drip landing flow (hero → trust → reviews → lead → about → benefits → social proof → menu → use cases → how it works → FAQ → CTA). */
export default function IvDripLandingSections({
  showHero = true,
  heroBanner,
  showInstagram = true,
}: Props) {
  return (
    <>
      {showHero ? (
        <HeroSection bannerUrl={heroBanner?.url} bannerAlt={heroBanner?.alt} />
      ) : null}
      <TrustBar />
      <Testimonials />
      <LeadCaptureBanner />
      <AboutLiquividaSection />
      <ValuePropsGrid />
      <CelebrityWellness />
      <div id="iv-drips">
        <ServicesPreview />
      </div>
      <UseCasesSection />
      <HowItWorks />
      <FaqPreview variant="iv" />
      <FooterCtaBanner />
      {showInstagram ? <InstagramFeed /> : null}
    </>
  );
}
