import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPanel } from "@/lib/invita/panels";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { DNA_PANELS } = await import("@/lib/invita/panels");
  return DNA_PANELS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const panel = getPanel(slug);
  if (!panel) return { title: "DNA Panel" };
  return { title: panel.name, description: panel.description };
}

export default async function PanelDetailPage({ params }: Props) {
  const { slug } = await params;
  const panel = getPanel(slug);
  if (!panel) notFound();

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="section-inner detail-layout">
          <header className="detail-header">
            <Link href="/dna" className="back-link">
              ← DNA Lab
            </Link>
            <span className="protocol-tier">Genomics</span>
            <h1 className="page-title">{panel.name}</h1>
            <p className="protocol-meta">
              {panel.turnaround} · {panel.price}
            </p>
          </header>

          <div className="detail-body">
            <p>{panel.description}</p>

            <section>
              <h3>What we analyse</h3>
              <ul>
                {panel.markers.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Includes</h3>
              <ul>
                {panel.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>

            <Link href="/book" className="btn-primary">
              Request this panel
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
