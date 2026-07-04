"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/patterns/ScrollReveal";
import MediaFrame from "@/components/patterns/MediaFrame";
import MediaImage from "@/components/patterns/MediaImage";
import { useLocale } from "@/contexts/LocaleContext";
import { infographicLabel } from "@/lib/invita/asset-labels";
import {
  getAllInfographics,
  getGalleryPhotos,
  getReels,
  LOCAL_IMAGES,
} from "@/lib/invita/local-media";

export default function InvitaGallerySection() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const infographics = getAllInfographics().slice(0, 8);
  const photos = getGalleryPhotos(6);
  const reels = getReels().slice(0, 4);
  const featurePhoto = photos[0];
  const stackPhotos = photos.slice(1, 3);

  return (
    <section className="invita-gallery section-padding" aria-labelledby="invita-gallery-heading">
      <div className="section-inner">
        <ScrollReveal>
          <header className="page-hero page-hero--center">
            <p className="page-eyebrow">{isAr ? "العلم والجمال" : "Science & craft"}</p>
            <h2 id="invita-gallery-heading" className="page-title page-title--compact">
              {isAr ? "العافية الوريدية، بصياغة فاخرة" : "IV wellness, editorially framed"}
            </h2>
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
                ? "محتوى تعليمي وتصوير منتجات من استوديو Invita — مقدّم بأسلوب العيادات الفاخرة."
                : "Educational studio content and product photography — presented in Invita's calm, clinical-luxury voice."}
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

        {reels.length > 0 ? (
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
          </ScrollReveal>
        ) : null}

        <ScrollReveal>
          <h3 className="invita-gallery-subtitle">
            {isAr ? "محتوى تعليمي" : "Clinical education"}
          </h3>
          <div className="invita-gallery-infographics" role="list">
            {infographics.map((item) => (
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

        {photos.length > 3 ? (
          <ScrollReveal>
            <h3 className="invita-gallery-subtitle">
              {isAr ? "العيادة والمنتجات" : "Clinic & product"}
            </h3>
            <div className="invita-gallery-infographics" role="list">
              {photos.slice(3, 7).map((photo) => (
                <MediaImage
                  key={photo.id}
                  src={photo.path}
                  alt={isAr ? "Invita" : "Invita creative"}
                  variant="infographic"
                  fill
                  sizes="(max-width: 640px) 45vw, 220px"
                  objectPosition="center top"
                />
              ))}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
