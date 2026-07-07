import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerSupportForm from "@/components/partners/PartnerSupportForm";
import { INVITA } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Resources",
  description:
    "Training PDFs, co-branded assets, and clinic support for Invita healthcare partners in Iraq.",
};

const TRAINING_ASSETS = [
  { title: "Safety 101", href: "/resources/invita-safety-101.pdf" },
  { title: "Clinical guide", href: "/resources/liquivida-clinical-guide.pdf" },
  { title: "Patient education", href: "/resources/invita-patient-education.pdf" },
  { title: "IV catalogue", href: "/resources/invita-catalogue.pdf" },
  { title: "Professional training", href: "/for-clinics#training" },
];

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="section-inner partner-dashboard">
          <header className="partner-dashboard-header">
            <div>
              <p className="page-eyebrow">For clinic partners</p>
              <h1 className="page-title">Partner resources</h1>
              <p className="page-lead">
                Training materials, co-branded assets, and support for Invita partner clinics — no
                login required.
              </p>
            </div>
            <Link href="/partners/apply" className="btn-secondary btn-sm">
              Apply to partner
            </Link>
          </header>

          <section className="partner-dashboard-section">
            <h2>Training &amp; certification</h2>
            <ul className="partner-asset-list">
              {TRAINING_ASSETS.map((asset) => (
                <li key={asset.href}>
                  <a href={asset.href} target="_blank" rel="noopener noreferrer">
                    {asset.title} →
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="partner-dashboard-section">
            <h2>Co-branded resources</h2>
            <ul className="partner-asset-list">
              <li>
                <Link href="/science">Science hub &amp; infographics</Link>
              </li>
              <li>
                <Link href="/healthcare-network">Healthcare network directory</Link>
              </li>
              <li>
                <a href={INVITA.social.instagram} target="_blank" rel="noopener noreferrer">
                  @invita_iv_drips on Instagram
                </a>
              </li>
            </ul>
          </section>

          <section className="partner-dashboard-section">
            <h2>Clinic support</h2>
            <p className="page-lead page-lead--narrow">
              Questions about orders, training, or clinical protocols? Send us a message and our team
              will respond within 24 hours.
            </p>
            <PartnerSupportForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
