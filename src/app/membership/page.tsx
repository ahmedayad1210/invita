"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MembershipApplicationForm from "@/components/membership/MembershipApplicationForm";
import { MEMBERSHIP_TIERS } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

export default function MembershipPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">By invitation</p>
          <h1 className="page-title">Invita Membership</h1>
          <p className="page-lead">
            Annual wellness programmes for clients who make longevity a priority —
            not a promotion.
          </p>
        </header>

        <div className="section-inner membership-grid">
          {MEMBERSHIP_TIERS.map((tier) => (
            <article
              key={tier.id}
              className={`membership-card${"featured" in tier && tier.featured ? " featured" : ""}`}
            >
              <h2>{isAr ? tier.nameAr : tier.name}</h2>
              <p className="membership-price">{tier.price}</p>
              <ul>
                {(isAr ? tier.perksAr : tier.perks).map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="section-inner">
          <MembershipApplicationForm />
        </div>

        <div className="section-inner cta-band">
          <p>Prefer to speak with concierge first?</p>
          <Link href="/book" className="btn-primary">
            Request a Membership Consultation
          </Link>
          <p className="cta-hint">Our team will contact you within 24 hours.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
