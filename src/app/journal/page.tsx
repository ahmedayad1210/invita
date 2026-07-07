import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JOURNAL_ARTICLES } from "@/lib/invita/journal-articles";

export const metadata = {
  title: "Journal",
  description:
    "Longevity, IV therapy, and genomics insights from Invita — NAD+, immunity, beauty, and clinical education for Iraq.",
};

export default function JournalPage() {
  const sorted = [...JOURNAL_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-main">
        <header className="page-hero">
          <p className="page-eyebrow">Editorial</p>
          <h1 className="page-title">Journal</h1>
          <p className="page-lead">
            Longevity, ingredients, and clinical insight from the Invita team.
          </p>
        </header>

        <div className="section-inner journal-list">
          {sorted.map((article) => (
            <article key={article.slug} className="journal-card">
              <p className="journal-card-meta">
                {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {" · "}
                {article.readMinutes} min read
              </p>
              <h2>
                <Link href={`/journal/${article.slug}`}>{article.title}</Link>
              </h2>
              <p>{article.excerpt}</p>
              <ul className="journal-card-tags">
                {article.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <Link href={`/journal/${article.slug}`} className="journal-card-link">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
