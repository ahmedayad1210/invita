"use client";

import Link from "next/link";
import LiquividaBadge from "@/components/brand/LiquividaBadge";
import MediaFrame from "@/components/patterns/MediaFrame";
import { FRAMER_IMAGES } from "@/lib/invita/framer-assets";
import { useLocale } from "@/contexts/LocaleContext";
import Image from "next/image";

type Props = {
  bannerUrl?: string | null;
  bannerAlt?: string | null;
};

export default function HeroSection({ bannerUrl, bannerAlt }: Props) {
  const { t } = useLocale();
  const heroSrc = bannerUrl ?? FRAMER_IMAGES.clinicHero;
  const heroAlt = bannerAlt ?? "Invita — Iraq's leading IV therapy company";

  return (
    <section className="hero-section">
      <div className="hero-image-container">
        <MediaFrame variant="hero" className="hero-media-frame">
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="asset-frame__image"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
            unoptimized={Boolean(bannerUrl?.startsWith("http"))}
          />
        </MediaFrame>
      </div>

      <div className="hero-content">
        <div
          className="animate-fade-in-up opacity-0-init"
          style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
        >
          <span className="hero-eyebrow">{t.hero.eyebrow}</span>
        </div>

        <h1
          className="animate-fade-in-up opacity-0-init hero-headline"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          {t.hero.title}
          <br />
          <em>{t.hero.titleEm}</em>
        </h1>

        <div
          className="animate-fade-in opacity-0-init hero-divider"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        />

        <p
          className="animate-fade-in-up opacity-0-init hero-subhead"
          style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
        >
          {t.hero.subtitle}
        </p>

        <div
          className="animate-fade-in-up opacity-0-init hero-liquivida"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          <LiquividaBadge />
        </div>

        <div
          className="animate-fade-in-up opacity-0-init hero-ctas"
          style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
        >
          <Link href="/iv-drip-menu" className="btn-hero-primary">
            {t.hero.ctaPrimary}
          </Link>
          <Link href="/book" className="btn-hero-secondary">
            {t.hero.ctaBook}
          </Link>
        </div>
        <p className="hero-clinics-link animate-fade-in opacity-0-init" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
          <Link href="/for-clinics">{t.hero.ctaSecondary} →</Link>
        </p>
      </div>
    </section>
  );
}
