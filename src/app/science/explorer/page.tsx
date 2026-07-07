import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InfographicExplorer from "@/components/science/InfographicExplorer";

export const metadata = {
  title: "Infographic Explorer",
  description: "Search Invita clinical infographics by symptom, topic, NAD+, immunity, beauty, and energy.",
};

export default function InfographicsExplorerPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Interactive science</p>
          <h1 className="page-title">Infographic explorer</h1>
          <p className="page-lead page-lead--narrow">
            Search 17 clinical guides by symptom or topic — NAD+, immunity, beauty, energy, and foundations.
          </p>
        </header>
        <div className="section-inner">
          <InfographicExplorer />
        </div>
      </main>
      <Footer />
    </>
  );
}
