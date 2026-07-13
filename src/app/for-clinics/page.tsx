import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartnersBrochurePage from "@/components/partners/PartnersBrochurePage";
import ClinicPartnerApplicationForm from "@/components/partners/ClinicPartnerApplicationForm";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "للعيادات والشركاء",
  description:
    "شركاء إنفيتا من الأطباء — 50+ عيادة، 18+ طبيب شريك، تركيبات Liquivida® معتمدة في بغداد والعراق.",
};

export default function ForClinicsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <PartnersBrochurePage />
        <section className="partners-brochure" style={{ paddingTop: 0 }}>
          <h2 className="jd-section-title">طلب شراكة</h2>
          <Suspense fallback={<LoadingSpinner message="Loading…" />}>
            <ClinicPartnerApplicationForm />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
