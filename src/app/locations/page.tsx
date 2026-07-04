import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { INVITA, LOCATIONS } from "@/lib/constants";

export const metadata = {
  title: "Locations",
};

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Baghdad</p>
          <h1 className="page-title">Locations</h1>
          <p className="page-lead">
            Private infusion suites and at-home service — by appointment only.
          </p>
        </header>

        <div className="section-inner locations-list">
          {LOCATIONS.map((loc) => (
            <article key={loc.id} className="location-card">
              <h2>{loc.name}</h2>
              <p>{loc.description}</p>
            </article>
          ))}
        </div>

        <div className="section-inner">
          <p className="text-muted">{INVITA.address.full}</p>
          <p className="text-muted">{INVITA.hours.weekdays}</p>
          <Link href="/book" className="btn-primary" style={{ marginTop: "1.5rem" }}>
            Book a visit
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
