import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClinicDirectory from "@/components/healthcare/ClinicDirectory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcare Network",
  description:
    "Clinics and medical centers across Iraq that have worked with Invita — product training, orders, and clinical cooperation.",
};

export default function HealthcareNetworkPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero section-inner">
          <p className="page-eyebrow">Clinical reference network</p>
          <h1 className="page-title">Healthcare providers we have worked with</h1>
          <p className="page-lead page-lead--narrow">
            A searchable directory of clinics and medical centers that have collaborated with Invita
            through presentations, training, orders, or ongoing cooperation. This is not a list of
            exclusive partnerships or official sponsorships.
          </p>
        </header>

        <section className="section-padding-sm">
          <div className="section-inner">
            <ClinicDirectory showStats showMap />
          </div>
        </section>

        <section className="section-inner cta-band">
          <p>Interested in Invita products, training, or clinical support?</p>
          <Link href="/for-clinics" className="btn-primary">
            For Clinics &amp; Medical Centers
          </Link>
          <Link href="/contact?source=b2b-network" className="btn-secondary">
            Contact our team
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
