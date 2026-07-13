import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IvDripLandingSections from "@/components/iv/IvDripLandingSections";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo";

export const metadata = {
  title: "IV Vitamin Drip Therapy",
  description:
    "Medical-grade IV vitamin drip therapy in Baghdad — Liquivida® USA formulas, complimentary wellness assessment, and eleven catalogue protocols.",
};

export default function IvTherapyPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: "IV Vitamin Drip Therapy",
          url: `${getSiteUrl()}/iv-therapy`,
          description: metadata.description,
        }}
      />
      <Navbar />
      <main id="main-content">
        <IvDripLandingSections />
      </main>
      <Footer />
    </>
  );
}
