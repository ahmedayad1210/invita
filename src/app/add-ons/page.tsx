import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ADD_ONS } from "@/lib/invita/liquivida-drips";

export const metadata = { title: "Add-On Experiences" };

export default function AddOnsPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">While your drip runs</p>
          <h1 className="page-title">Elevate Your Session</h1>
        </header>
        <div className="section-inner addons-list">
          {ADD_ONS.map((addon, i) => (
            <article key={addon.name} className="addon-card">
              <span className="addon-num">{String(i + 1).padStart(2, "0")}</span>
              <h2>{addon.name}</h2>
              <p>{addon.description}</p>
            </article>
          ))}
        </div>
        <div className="section-inner cta-band">
          <Link href="/book" className="btn-primary">Book your session</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
