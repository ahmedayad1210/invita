import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Journal",
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Editorial</p>
          <h1 className="page-title">Journal</h1>
          <p className="page-lead">
            Longevity, ingredients, and clinical insight from the Invita team.
          </p>
        </header>

        <div className="section-inner journal-list">
          <article className="journal-card">
            <h2>Articles coming soon</h2>
            <p>
              We are preparing editorial content on NAD+, nutrigenomics, and IV
              safety. In the meantime, explore our{" "}
              <Link href="/science">science hub</Link> or{" "}
              <Link href="/faq">FAQ</Link>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
