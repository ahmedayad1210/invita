import "./lapis-home.css";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { getHomepageHeroBanner } from "@/lib/media/homepage-banners.server";
import { LapisHero, LapisNav, TrustStrip } from "@/components/lapis/LapisTop";
import { DoctorsBand, StatsBand, UseCaseTicker, WhatYouGet } from "@/components/lapis/LapisBands";
import { DripMenu, Matcher, Proof } from "@/components/lapis/LapisMenu";
import { Films, HowAndVisit, ScienceTeaser, StandardAndCerts } from "@/components/lapis/LapisStory";
import {
  Booking,
  ClinicsB2B,
  Faq,
  LapisFooter,
  MembershipDna,
  PosterClose,
} from "@/components/lapis/LapisConvert";

/**
 * Home — Lapis & Bone + Modern layer (docs/design_handoff_invita_site).
 * 19 sections, in the handoff order.
 */
export default async function HomePage() {
  const heroBanner = await getHomepageHeroBanner();

  return (
    <div className="lb">
      <JsonLd data={localBusinessJsonLd()} />
      <div className="lb-prog" aria-hidden="true" />
      <LapisNav />
      <main id="main-content">
        {/* 1 */} <LapisHero bannerUrl={heroBanner?.url} bannerAlt={heroBanner?.alt} />
        {/* 2 */} <TrustStrip />
        {/* 3 */} <DoctorsBand />
        {/* 4 */} <WhatYouGet />
        {/* 5 */} <UseCaseTicker />
        {/* 6 */} <StatsBand />
        {/* 7 */} <DripMenu />
        {/* 8 */} <Proof />
        {/* 9 */} <Matcher />
        {/* 10 */} <HowAndVisit />
        {/* 11 */} <ScienceTeaser />
        {/* 12 */} <StandardAndCerts />
        {/* 13 */} <Films />
        {/* 14 */} <Booking />
        {/* 15 */} <ClinicsB2B />
        {/* 16 */} <MembershipDna />
        {/* 17 */} <Faq />
        {/* 18 */} <PosterClose />
      </main>
      {/* 19 */} <LapisFooter />
    </div>
  );
}
