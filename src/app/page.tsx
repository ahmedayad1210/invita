import "./lapis-home.css";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { getHomepageHeroBanner } from "@/lib/media/homepage-banners.server";
import { AwarenessStrip, LapisHero, LapisNav, TrustStrip } from "@/components/lapis/LapisTop";
import { activeCampaign } from "@/lib/invita/campaign";
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

/** Re-check hourly so seasonal campaigns switch on and off without a redeploy. */
export const revalidate = 3600;

/**
 * Home — Lapis & Bone + Modern layer (docs/design_handoff_invita_site).
 * 19 sections, in the handoff order.
 */

export default async function HomePage() {
  const heroBanner = await getHomepageHeroBanner();
  const campaign = activeCampaign();

  return (
    <div className="lb" data-campaign={campaign ?? undefined}>
      <JsonLd data={localBusinessJsonLd()} />
      <div className="lb-prog" aria-hidden="true" />
      {campaign === "pink" && <AwarenessStrip />}
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
