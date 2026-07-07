import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getArticle, JOURNAL_ARTICLES } from "@/lib/invita/journal-articles";
import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const drip = article.dripSlug ? getLiquividaDrip(article.dripSlug) : null;
  const url = `${getSiteUrl()}/journal/${article.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          author: { "@type": "Organization", name: "Invita" },
          publisher: { "@type": "Organization", name: "Invita" },
          mainEntityOfPage: url,
        }}
      />
      <Navbar />
      <main id="main-content" className="page-main">
        <article className="section-inner journal-article">
          <header className="journal-article-header">
            <Link href="/journal" className="back-link">
              ← Journal
            </Link>
            <p className="journal-card-meta">
              {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {article.readMinutes} min read
            </p>
            <h1 className="page-title">{article.title}</h1>
            <ul className="journal-card-tags">
              {article.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </header>

          <div className="journal-article-body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <footer className="journal-article-footer">
            {drip && (
              <div className="journal-article-cta">
                <p>
                  Related protocol: <strong>{drip.name}</strong>
                </p>
                <div className="journal-article-cta-actions">
                  <Link href={`/iv-therapy/${drip.slug}`} className="btn-secondary btn-sm">
                    Learn more
                  </Link>
                  <Link href={`/book?drip=${drip.slug}`} className="btn-primary btn-sm">
                    Book {drip.name}
                  </Link>
                </div>
              </div>
            )}
            {article.pdfPath && (
              <p>
                <a href={article.pdfPath} target="_blank" rel="noopener noreferrer">
                  Download related PDF →
                </a>
              </p>
            )}
            <Link href="/science" className="journal-article-science-link">
              Explore the science hub →
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
