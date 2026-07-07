import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustAuthoritySection from "@/components/home/TrustAuthoritySection";
import ProfessionalTrainingSection from "@/components/home/ProfessionalTrainingSection";
import HealthcarePartnersSection from "@/components/home/HealthcarePartnersSection";
import ClinicPartnerApplicationForm from "@/components/partners/ClinicPartnerApplicationForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  B2B_PARTNER_TYPES,
  B2B_WHY_INVITA,
} from "@/lib/invita/b2b-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Clinics",
  description:
    "Partner with Invita — Iraq's leading IV therapy company. Official Liquivida® distributor supplying clinics, hospitals, and medical centres nationwide.",
};

export default function ForClinicsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="page-main page-hero section-padding-sm b2b-hero">
          <p className="page-eyebrow">Invita Healthcare Partnerships</p>
          <h1 className="page-title">The company behind IV therapy in Iraq</h1>
          <p className="page-lead page-lead--narrow">
            Officially registered products. International standards. Clinical training. Nationwide
            supply — for clinics, medical centres, hospitals, and physician practices.
          </p>
          <div className="b2b-hero-ctas">
            <Link href="/partners/apply" className="btn-primary">
              Request Partnership
            </Link>
            <Link href="/partners" className="btn-secondary">
              Partner resources
            </Link>
            <Link href="/partners/apply?intent=meeting" className="btn-secondary">
              Schedule a Business Meeting
            </Link>
          </div>
          <p className="cta-hint">Our partnerships team responds within 48 hours.</p>
        </section>

        <TrustAuthoritySection />

        <section className="section-padding-sm" id="who-we-work-with">
          <div className="section-inner">
            <header className="page-hero page-hero--center">
              <p className="page-eyebrow">Who we work with</p>
              <h2 className="page-title page-title--compact">Facilities we serve</h2>
            </header>
            <ul className="b2b-partner-types" role="list">
              {B2B_PARTNER_TYPES.map((type) => (
                <li key={type.en} className="b2b-partner-type-pill" role="listitem">
                  {type.en}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-padding-sm b2b-why" id="why-invita">
          <div className="section-inner">
            <header className="page-hero page-hero--center">
              <p className="page-eyebrow">Why partners choose Invita</p>
              <h2 className="page-title page-title--compact">More than a supplier</h2>
              <p className="page-lead page-lead--narrow">
                Products, protocols, training, branding, and ongoing clinical support — everything
                your facility needs to deliver premium IV therapy.
              </p>
            </header>
            <ul className="b2b-why-grid" role="list">
              {B2B_WHY_INVITA.map((item) => (
                <li key={item.en} className="b2b-why-item" role="listitem">
                  <span className="b2b-why-check" aria-hidden="true">
                    ✓
                  </span>
                  {item.en}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ProfessionalTrainingSection variant="full" />

        <HealthcarePartnersSection />

        <section className="section-padding b2b-partner-cta" id="partner">
          <div className="section-inner b2b-partner-cta-inner">
            <p className="page-eyebrow">Become an Invita partner</p>
            <h2 className="page-title page-title--compact">
              Join Iraq&apos;s leading IV therapy network
            </h2>
            <p className="page-lead page-lead--narrow">
              Whether you operate a single clinic or a multi-site medical group — we provide the
              products, protocols, and support to elevate your IV therapy offering.
            </p>
            <div className="b2b-hero-ctas">
              <Link href="/partners/apply" className="btn-primary">
                Request Partnership
              </Link>
              <Link href="/partners/apply?intent=provider" className="btn-secondary">
                Become a Provider
              </Link>
            </div>
          </div>
        </section>

        <section className="section-padding-sm" id="apply">
          <div className="section-inner">
            <Suspense
              fallback={
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <LoadingSpinner message="Loading form…" />
                </div>
              }
            >
              <ClinicPartnerApplicationForm />
            </Suspense>
          </div>
        </section>

        <section className="section-padding-sm" id="wholesale">
          <div className="section-inner page-hero page-hero--center">
            <p className="page-eyebrow">Wholesale</p>
            <h2 className="page-title page-title--compact">Nationwide supply programme</h2>
            <p className="page-lead page-lead--narrow">
              Predictable ordering, regulatory documentation, and dedicated account management for
              partner facilities across Iraq.
            </p>
            <Link href="/partners/apply?intent=wholesale" className="btn-secondary">
              Request Wholesale Information
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
