"use client";

import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaImage from "@/components/patterns/MediaImage";
import { useLocale } from "@/contexts/LocaleContext";
import { CURATED_CLINIC_PHOTO_IDS } from "@/lib/invita/content-curation";
import { getClinicPhotosByIds } from "@/lib/invita/local-media";

export default function ClinicSpotlightSection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const photos = getClinicPhotosByIds(CURATED_CLINIC_PHOTO_IDS);

  if (photos.length === 0) return null;

  return (
    <section className="clinic-spotlight section-padding-sm" aria-labelledby="clinic-spotlight-heading">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">
              {isAr ? "داخل شبكة الشركاء" : "Inside our partner network"}
            </p>
            <h2 id="clinic-spotlight-heading" className="page-title page-title--compact">
              {isAr ? "عيادات حقيقية. بروتوكولات حقيقية." : "Real clinics. Real protocols."}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "تصوير من مرافق شريكة في العراق — حيث يُقدَّم العلاج الوريدي بإشراف طبي."
                : "Photography from partner facilities across Iraq — where IV therapy is delivered under medical supervision."}
            </p>
          </header>
        </ScrollReveal>

        <div className="clinic-spotlight-grid" role="list">
          {photos.map((photo, i) => (
            <ScrollReveal key={photo.id}>
              <article
                className={`clinic-spotlight-tile${i === 0 ? " clinic-spotlight-tile--feature" : ""}`}
                role="listitem"
              >
                <MediaImage
                  src={photo.path}
                  alt={isAr ? "عيادة شريكة" : "Partner clinic"}
                  variant="editorial"
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 45vw, 220px"}
                  objectPosition="center"
                />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="cta-band">
          <Link href="/healthcare-network" className="btn-secondary">
            {isAr ? "استكشف الشبكة الكاملة" : "Explore full directory"}
          </Link>
        </div>
      </div>
    </section>
  );
}
