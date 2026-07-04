import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DNA_PANELS } from "@/lib/invita/panels";

export const metadata = {
  title: "DNA Lab",
};

export default function DnaLabPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Invita Genomics</p>
          <h1 className="page-title">DNA Lab</h1>
          <p className="page-lead">
            Clinical-grade genomic panels with private interpretation — your
            biology, decoded with discretion.
          </p>
        </header>

        <div className="section-inner protocol-grid">
          {DNA_PANELS.map((panel) => (
            <Link
              key={panel.slug}
              href={`/dna/${panel.slug}`}
              className="protocol-card"
            >
              <span className="protocol-tier">Genomics</span>
              <h2>{panel.name}</h2>
              <p className="protocol-meta">
                {panel.turnaround} · {panel.price}
              </p>
            </Link>
          ))}
        </div>

        <div className="section-inner cta-band">
          <p>Results delivered securely to your Invita patient portal.</p>
          <Link href="/book" className="btn-primary">
            Speak with Our Medical Team
          </Link>
          <p className="cta-hint">Begin with a private genomic consultation.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
