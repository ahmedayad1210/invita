import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IvDripLandingSections from "@/components/iv/IvDripLandingSections";
import SectionSkeleton from "@/components/patterns/SectionSkeleton";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { getHomepageHeroBanner } from "@/lib/media/homepage-banners.server";

const HealthcarePartnersSection = dynamic(
  () => import("@/components/home/HealthcarePartnersSection"),
  { loading: () => <SectionSkeleton minHeight="14rem" /> }
);

export default async function HomePage() {
  const heroBanner = await getHomepageHeroBanner();

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Navbar />
      <main id="main-content">
        <IvDripLandingSections
          heroBanner={heroBanner ? { url: heroBanner.url, alt: heroBanner.alt } : undefined}
        />
        <HealthcarePartnersSection />
      </main>
      <Footer />
    </>
  );
}
