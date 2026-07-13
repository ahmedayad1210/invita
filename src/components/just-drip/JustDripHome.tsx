"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import {
  JUST_DRIP_TAGLINE_AR,
  JUST_DRIP_TAGLINE_EN,
  JUST_DRIP_PRICE_AR,
  JUST_DRIP_PRICE_EN,
  JUST_DRIP_PRICE_NOTE_AR,
  JUST_DRIP_PRICE_NOTE_EN,
  JUST_DRIP_CELEBRITIES,
} from "@/lib/invita/just-drip-menu";
import JustDripGrid from "./JustDripGrid";
import { INVITA } from "@/lib/constants";

type Props = {
  showHero?: boolean;
};

export default function JustDripHome({ showHero = true }: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="jd-page">
      {showHero ? (
        <header className="jd-hero">
          <p className="jd-brand">INVITA · IV VITAMINS THERAPY</p>
          <h1 className="jd-title">JUST DRIP</h1>
          <p className="jd-tagline">&ldquo;{isAr ? JUST_DRIP_TAGLINE_AR : JUST_DRIP_TAGLINE_EN}&rdquo;</p>
          <div className="jd-hero-actions">
            <Link href="/book" className="jd-btn jd-btn--gold">
              {isAr ? "احجز نوعك الآن" : "Book your drip"}
            </Link>
            <a href="#drips" className="jd-btn jd-btn--ghost">
              {isAr ? "تصفح القائمة" : "Browse menu"}
            </a>
          </div>
        </header>
      ) : null}

      <JustDripGrid id="drips" />

      <section className="jd-price-band" aria-label={isAr ? "الأسعار" : "Pricing"}>
        <p className="jd-price">{isAr ? JUST_DRIP_PRICE_AR : JUST_DRIP_PRICE_EN}</p>
        <p className="jd-price-note">{isAr ? JUST_DRIP_PRICE_NOTE_AR : JUST_DRIP_PRICE_NOTE_EN}</p>
        <Link href="/book" className="jd-btn jd-btn--gold jd-btn--full">
          {isAr ? "احجز نوعك الآن" : "Book your drip now"}
        </Link>
      </section>

      <section className="jd-social" aria-label={isAr ? "عملاء مشهورون" : "Celebrity clients"}>
        <h2 className="jd-section-title">
          {isAr ? "نجوم ومشاهير العالم وحبهم للمغذيات الوريدية" : "Celebrities who love IV nutrients"}
        </h2>
        <div className="jd-social-scroll">
          {JUST_DRIP_CELEBRITIES.map((c) => (
            <div key={c.handle} className="jd-social-card">
              <p className="jd-social-name">{c.name}</p>
              <p className="jd-social-handle">{c.handle}</p>
            </div>
          ))}
        </div>
      </section>

      <nav className="jd-quick-links" aria-label={isAr ? "روابط سريعة" : "Quick links"}>
        <Link href="/dna" className="jd-quick-link">
          <span>DNA</span>
          <small>{isAr ? "تحليل الحمض النووي" : "DNA analysis"}</small>
        </Link>
        <Link href="/for-clinics" className="jd-quick-link">
          <span>{isAr ? "الشركاء" : "Partners"}</span>
          <small>{isAr ? "للعيادات والأطباء" : "For clinics & doctors"}</small>
        </Link>
        <Link href="/book" className="jd-quick-link jd-quick-link--accent">
          <span>{isAr ? "احجز" : "Book"}</span>
          <small>{isAr ? "استشارة مجانية" : "Free consultation"}</small>
        </Link>
      </nav>

      <footer className="jd-footer">
        <p className="jd-footer-phone">
          <a href={`tel:${INVITA.phone.replace(/\s/g, "")}`}>{INVITA.phone}</a>
        </p>
        <p className="jd-footer-site">
          <a href="https://www.invitadrips.com">www.invitadrips.com</a>
          {" · "}
          <a href="/resources/invita-drip-menu.pdf">
            {isAr ? "PDF القائمة" : "Menu PDF"}
          </a>
        </p>
        <p className="jd-footer-note">
          {isAr
            ? "حصرياً للعيادات والمراكز المرخصة — بغداد، العراق"
            : "Exclusively for licensed clinics and centres — Baghdad, Iraq"}
        </p>
      </footer>
    </div>
  );
}
