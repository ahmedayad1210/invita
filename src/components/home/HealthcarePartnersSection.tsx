"use client";

import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import ClinicDirectory from "@/components/healthcare/ClinicDirectory";
import { useLocale } from "@/contexts/LocaleContext";

export default function HealthcarePartnersSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="healthcare-partners section-padding-sm" id="healthcare-network">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">
              {isAr ? "شبكة الرعاية الصحية" : "Healthcare network"}
            </p>
            <h2 className="page-title page-title--compact">
              {isAr
                ? "موثوق من قبل المهنيين الصحيين"
                : "Trusted by Healthcare Professionals"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "عيادات ومراكز طبية في العراق تعاملت مع ممثلينا الطبيين عبر عروض المنتجات والتدريب والطلبات والمتابعات — دون أي شراكة حصرية أو رعاية رسمية."
                : "Clinics and medical centers across Iraq that have worked with our medical representatives through product presentations, training, orders, and follow-ups — not exclusive sponsorships."}
            </p>
          </header>
        </ScrollReveal>

        <ClinicDirectory showStats showMap={false} preview />

        <div className="cta-band healthcare-partners-cta">
          <Link href="/healthcare-network" className="btn-primary">
            {isAr ? "استكشف الشبكة الكاملة" : "Explore full directory"}
          </Link>
          <Link href="/for-clinics" className="btn-secondary">
            {isAr ? "تعاون مع إنفيتا" : "Work with Invita"}
          </Link>
          <p className="cta-hint">
            {isAr
              ? "قائمة مرجعية للعيادات التي تعاملت مع فريقنا — وليست قائمة شراكة حصرية."
              : "Reference list of facilities that have engaged with our team — not an exclusive partner roster."}
          </p>
        </div>
      </div>
    </section>
  );
}
