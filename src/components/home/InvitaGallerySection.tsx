"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import LazyWhenVisible from "@/components/patterns/LazyWhenVisible";
import MediaFrame from "@/components/patterns/MediaFrame";
import MediaImage from "@/components/patterns/MediaImage";
import { useLocale } from "@/contexts/LocaleContext";
import { infographicLabel } from "@/lib/invita/asset-labels";
import { EDITORIAL_CLINIC_PHOTO_IDS, GALLERY_TOPIC_ROWS } from "@/lib/invita/content-curation";
import {
  getClinicPhotosByIds,
  getInfographicsByIds,
  getReels,
  LOCAL_IMAGES,
} from "@/lib/invita/local-media";

const INITIAL_REELS = 3;

export default function InvitaGallerySection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [reelsVisible, setReelsVisible] = useState(INITIAL_REELS);
  const editorialPhotos = getClinicPhotosByIds(EDITORIAL_CLINIC_PHOTO_IDS);
  const allReels = getReels();
  const reels = allReels.slice(0, reelsVisible);
  const featurePhoto = editorialPhotos[0];
  const stackPhotos = editorialPhotos.slice(1, 3);

  return (
    <section className="invita-gallery section-padding" aria-labelledby="invita-gallery-heading">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">{isAr ? "العلم والجمال" : "Science & craft"}</p>
            <h2 id="invita-gallery-heading" className="page-title page-title--compact">
              {isAr ? "17 دليلاً تعليمياً من استوديو Invita" : "17 clinical guides from Invita studio"}
            </h2>
            <p className="page-lead page-lead--narrow">
              {isAr
                ? "محتوى مرئي من ملفاتك — مرتب حسب الموضوع: NAD+، المناعة، الجمال، الطاقة، والأسس السريرية."
                : "Visual content from your uploads — organised by topic: NAD+, immunity, beauty, energy, and clinical foundations."}
            </p>
          </header>
          <div className="invita-gallery-lead-card">
            <div className="invita-gallery-brand-mark">
              <Image
                src={LOCAL_IMAGES.logoIcon}
                alt=""
                width={36}
                height={36}
                className="invita-gallery-brand-icon"
                aria-hidden="true"
              />
              <span className="invita-gallery-brand-name">Invita</span>
            </div>
            <p>
              {isAr
                ? "GMP معتمد · ISO مختبر · Liquivida® USA — كل دليل يُستخدم في تدريب الشركاء."
                : "GMP-certified · ISO-tested · Liquivida® USA — every guide is used in partner training."}
            </p>
            <Link href="/science" className="btn-secondary">
              {isAr ? "العلم والمراجع" : "Science & resources"}
            </Link>
          </div>
        </ScrollReveal>

        {featurePhoto && stackPhotos.length > 0 ? (
          <ScrollReveal>
            <div className="invita-gallery-editorial">
              <MediaImage
                src={featurePhoto.path}
                alt={isAr ? "تصوير Invita" : "Invita editorial photography"}
                variant="editorial"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                frameClassName="invita-gallery-editorial-feature"
                caption={isAr ? "تركيبات طبية، بإشراف مختص" : "Medically supervised formulations"}
                objectPosition="center top"
              />
              <div className="invita-gallery-editorial-stack">
                {stackPhotos.map((photo) => (
                  <MediaImage
                    key={photo.id}
                    src={photo.path}
                    alt={isAr ? "استوديو Invita" : "Invita studio"}
                    variant="editorial"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    objectPosition="center"
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ) : null}

        {GALLERY_TOPIC_ROWS.map((row, rowIndex) => {
          const items = getInfographicsByIds(row.ids);
          if (items.length === 0) return null;
          const rowContent = (
            <ScrollReveal>
              <h3 className="invita-gallery-subtitle">
                {isAr ? row.labelAr : row.labelEn}
              </h3>
              <div className="invita-gallery-infographics" role="list">
                {items.map((item) => (
                  <MediaImage
                    key={item.id}
                    src={item.path}
                    alt={infographicLabel(item.id, isAr ? "ar" : "en")}
                    variant="infographic"
                    label={infographicLabel(item.id, isAr ? "ar" : "en")}
                    width={540}
                    height={540}
                    sizes="(max-width: 640px) 45vw, 220px"
                  />
                ))}
              </div>
            </ScrollReveal>
          );

          if (rowIndex === 0) {
            return <div key={row.id}>{rowContent}</div>;
          }

          return (
            <LazyWhenVisible
              key={row.id}
              minHeight="12rem"
              fallback={<div className="section-skeleton" style={{ minHeight: "12rem" }} aria-hidden="true" />}
            >
              {rowContent}
            </LazyWhenVisible>
          );
        })}

        {allReels.length > 0 ? (
          <LazyWhenVisible
            minHeight="14rem"
            fallback={<div className="section-skeleton" style={{ minHeight: "14rem" }} aria-hidden="true" />}
          >
            <ScrollReveal>
              <h3 className="invita-gallery-subtitle">{isAr ? "من الاستوديو" : "Studio reels"}</h3>
              <div className="invita-gallery-reels">
                {reels.map((reel, i) => (
                  <MediaFrame
                    key={reel.id}
                    variant="reel"
                    label={isAr ? `ريل ${i + 1}` : `Reel ${i + 1}`}
                  >
                    <video
                      src={reel.path}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={isAr ? "فيديو Invita" : "Invita studio reel"}
                    />
                  </MediaFrame>
                ))}
              </div>
              {reelsVisible < allReels.length && (
                <div className="invita-gallery-reels-more">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => setReelsVisible((n) => Math.min(n + 3, allReels.length))}
                  >
                    {isAr ? "عرض المزيد من الريلز" : "Show more reels"}
                  </button>
                </div>
              )}
            </ScrollReveal>
          </LazyWhenVisible>
        ) : null}
      </div>
    </section>
  );
}
