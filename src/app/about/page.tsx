import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutLiquividaSection from "@/components/home/AboutLiquividaSection";
import { SEED_STYLISTS, INVITA } from "@/lib/constants";
import InitialsAvatar from "@/components/ui/InitialsAvatar";

export const metadata: Metadata = {
  title: "About",
  description:
    "Invita IV Drips — Baghdad's official Liquivida® USA distributor. Medical-grade IV infusion clinic.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <section className="page-hero section-padding-sm">
          <h1 className="page-title">About Invita</h1>
          <p className="page-lead page-lead--narrow">
            Baghdad&apos;s premier IV wellness clinic — where medical precision meets five-star
            hospitality.
          </p>
        </section>

        <AboutLiquividaSection />

        <section id="team" className="section-padding">
          <div className="section-inner">
            <header className="page-hero">
              <p className="page-eyebrow">Your medical team</p>
              <h2 className="page-title page-title--compact">Licensed professionals you can trust</h2>
              <p className="page-lead page-lead--narrow">
                Dedicated to your safety, discretion, and results.
              </p>
            </header>
            <div className="team-grid">
              {SEED_STYLISTS.map((member) => (
                <article key={member.name} className="protocol-card team-member-card">
                  <InitialsAvatar name={member.name} size={56} />
                  <h3 className="team-member-name">{member.name}</h3>
                  <p className="team-member-bio">{member.bio}</p>
                  <p className="team-member-specialties">{member.specialties.join(" · ")}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-inner cta-band" style={{ paddingBottom: "5rem" }}>
          <p>{INVITA.address.full}</p>
          <Link href="/book" className="btn-primary">
            Reserve Your Appointment
          </Link>
          <p className="cta-hint">Complimentary wellness assessment included.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
