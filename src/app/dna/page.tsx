import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DNA_PANELS } from "@/lib/invita/panels";
import { INVITA } from "@/lib/constants";

export const metadata = {
  title: "DNA Lab",
  description:
    "Invita DNA Lab — nutrigenomics, longevity, pharmacogenomics, and beauty genetics with private interpretation in Baghdad.",
};

export default function DnaLabPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Invita Genomics · @invitadnalab</p>
          <h1 className="page-title">DNA Lab</h1>
          <p className="page-lead">
            Clinical-grade genomic panels with private interpretation — your
            biology, decoded with discretion.
          </p>
          <p className="page-lead page-lead--narrow">
            <a href={INVITA.social.instagramDnaLab} target="_blank" rel="noopener noreferrer">
              Follow Invita DNA Lab on Instagram →
            </a>
          </p>
        </header>

        <div className="section-inner dna-hub-compare">
          <h2 className="page-title page-title--compact">Compare panels</h2>
          <div className="dna-compare-table-wrap">
            <table className="dna-compare-table">
              <thead>
                <tr>
                  <th>Panel</th>
                  <th>Turnaround</th>
                  <th>Price</th>
                  <th>Best for</th>
                </tr>
              </thead>
              <tbody>
                {DNA_PANELS.map((panel) => (
                  <tr key={panel.slug}>
                    <td>
                      <Link href={`/dna/${panel.slug}`}>{panel.name}</Link>
                    </td>
                    <td>{panel.turnaround}</td>
                    <td>{panel.price}</td>
                    <td>{panel.markers.slice(0, 2).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
              <p className="protocol-tagline">{panel.description.slice(0, 120)}…</p>
            </Link>
          ))}
        </div>

        <div className="section-inner cta-band">
          <p>Results delivered securely to your Invita patient portal.</p>
          <Link href="/science/explorer" className="btn-secondary">
            Explore science infographics
          </Link>
          <Link href="/telehealth" className="btn-secondary">
            IV pre-screen questionnaire
          </Link>
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
