import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ARTICLES = [
  {
    slug: "nad-longevity",
    title: "Why NAD+ matters for cellular energy",
    excerpt: "A clinician's guide to what NAD+ does — and who benefits most.",
  },
  {
    slug: "dna-nutrition",
    title: "Nutrigenomics: beyond generic diet advice",
    excerpt: "How genetic markers shape supplementation and meal planning.",
  },
  {
    slug: "iv-safety",
    title: "IV therapy safety — what we screen for",
    excerpt: "Contraindications, clinical oversight, and why intake matters.",
  },
];

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
          {ARTICLES.map((article) => (
            <article key={article.slug} className="journal-card">
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
