import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Invita IV Drips website and services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <div className="section-inner legal-page">
          <header className="page-hero">
            <p className="page-eyebrow">Legal</p>
            <h1 className="page-title">Terms of Service</h1>
            <p className="page-lead">Last updated: June 2026</p>
          </header>
          <div className="legal-body">
            <p>
              By using the Invita IV Drips website and booking our services, you agree to these
              terms. Please read them carefully.
            </p>
            <h2>Medical disclaimer</h2>
            <p>
              IV therapy at Invita is a wellness service administered by licensed medical
              professionals. It is not intended to diagnose, treat, cure, or prevent any disease.
              Your clinician will assess suitability before any treatment.
            </p>
            <h2>Bookings</h2>
            <p>
              Appointments are subject to availability and medical eligibility. We reserve the
              right to reschedule or decline treatment if clinically appropriate.
            </p>
            <h2>Pricing</h2>
            <p>
              Prices displayed in Iraqi Dinar (IQD) include a complimentary medical assessment.
              Final protocols may vary based on your individual needs as determined by your
              clinician.
            </p>
            <h2>Website use</h2>
            <p>
              You agree not to misuse this website or attempt unauthorised access to our systems
              or patient data.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us via our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
