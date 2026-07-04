"use client";

import CertificateGallery from "@/components/certifications/CertificateGallery";
import TrustTimeline from "@/components/certifications/TrustTimeline";
import VerificationSection from "@/components/certifications/VerificationSection";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import type { CertificationsData } from "@/lib/invita/certifications";
import { useLocale } from "@/contexts/LocaleContext";

type Props = {
  data: CertificationsData;
};

export default function CertificationsRecognition({ data }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <section
      className="credentials-section section-padding"
      id="certifications"
      aria-labelledby="credentials-heading"
    >
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center credentials-header">
            <p className="page-eyebrow">
              {isAr ? "الشهادات والاعتراف الدولي" : "Certifications & International Recognition"}
            </p>
            <h2 id="credentials-heading" className="page-title page-title--compact">
              {isAr ? "مصداقية يمكنك التحقق منها" : "Credentials you can verify"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "شهادات رسمية وشراكات دولية — كل موضع جاهز لاستبدال الوثائق الرسمية دون تعديل الكود."
                : "Official certificates and international partnerships — every slot is upload-ready for your real documents, no code changes required."}
            </p>
          </header>
        </ScrollReveal>

        <CertificateGallery certificates={data.certificates} locale={locale} />

        <VerificationSection slots={data.verificationSlots} locale={locale} />

        <TrustTimeline milestones={data.timeline} locale={locale} />

        <p className="credentials-footnote">
          {isAr
            ? "الوثائق الكاملة متاحة عند الطلب للشركاء والجهات التنظيمية والمستثمرين."
            : "Full documentation available on request for partners, regulators, and investors."}
        </p>
      </div>
    </section>
  );
}
