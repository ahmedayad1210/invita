"use client";

import { useRef } from "react";
import CertificateCard from "@/components/certifications/CertificateCard";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import {
  getFeaturedCertificate,
  getSupportingCertificates,
  type CertificateRecord,
} from "@/lib/invita/certifications";

type Props = {
  certificates: CertificateRecord[];
  locale: "en" | "ar";
};

export default function CertificateGallery({ certificates, locale }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedCertificate(certificates);
  const supporting = getSupportingCertificates(certificates);
  const isAr = locale === "ar";

  return (
    <div className="certificate-gallery">
      <ScrollReveal>
        <div className="certificate-gallery-featured">
          <CertificateCard certificate={featured} locale={locale} variant="featured" />
        </div>
      </ScrollReveal>

      <div className="certificate-gallery-supporting-header">
        <h3 className="certificate-gallery-subtitle">
          {isAr ? "شهادات واعترافات داعمة" : "Supporting credentials"}
        </h3>
        <p className="certificate-gallery-hint">
          {isAr ? "اسحب لاستعراض المزيد" : "Swipe to browse"}
        </p>
      </div>

      <div className="certificate-gallery-scroll" ref={scrollRef} role="list">
        {supporting.map((cert) => (
          <div key={cert.id} className="certificate-gallery-slide" role="listitem">
            <CertificateCard certificate={cert} locale={locale} variant="supporting" />
          </div>
        ))}
      </div>
    </div>
  );
}
