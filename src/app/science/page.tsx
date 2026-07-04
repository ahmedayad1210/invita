import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScienceHubPage from "@/components/science/ScienceHubPage";

export const metadata: Metadata = {
  title: "Science & Resources",
  description:
    "Peer-reviewed IV therapy research, NAD+ science, safety protocols, nutrient guides, and downloadable resources from Invita — Iraq's authorized Liquivida® distributor.",
};

export default function SciencePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="science-hub">
        <ScienceHubPage />
      </main>
      <Footer />
    </>
  );
}
