import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ClinicPartnerApplicationForm from "@/components/partners/ClinicPartnerApplicationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic & Partner Application",
  description:
    "Apply to partner with Invita — clinics, hospitals, and medical centres across Iraq. Request partnership, wholesale supply, or provider listing.",
};

export default function PartnersApplyPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero section-inner">
          <p className="page-eyebrow">Healthcare partnerships</p>
          <h1 className="page-title">Clinic &amp; partner application</h1>
          <p className="page-lead page-lead--narrow">
            Tell us about your facility — our partnerships team responds within 48 hours with
            next steps for supply, training, and network onboarding.
          </p>
          <p className="cta-hint">
            Already a partner?{" "}
            <Link href="/partners">View resources &amp; support</Link>
          </p>
        </header>

        <div className="section-inner">
          <Suspense
            fallback={
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <LoadingSpinner message="Loading form…" />
              </div>
            }
          >
            <ClinicPartnerApplicationForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
