import type { MetadataRoute } from "next";
import { LIQUIVIDA_DRIPS } from "@/lib/invita/liquivida-drips";
import { HEALTHCARE_CLINICS } from "@/lib/invita/healthcare-network";
import { DNA_PANELS } from "@/lib/invita/panels";
import { JOURNAL_ARTICLES } from "@/lib/invita/journal-articles";
import { getSiteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/about",
  "/iv-therapy",
  "/add-ons",
  "/faq",
  "/contact",
  "/membership",
  "/locations",
  "/for-clinics",
  "/healthcare-network",
  "/book",
  "/privacy",
  "/terms",
  "/dna",
  "/science",
  "/science/explorer",
  "/telehealth",
  "/partners",
  "/partners/apply",
  "/journal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/iv-therapy" || path === "/book" ? 0.9 : 0.7,
  }));

  const dripEntries: MetadataRoute.Sitemap = LIQUIVIDA_DRIPS.map((drip) => ({
    url: `${base}/iv-therapy/${drip.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const clinicEntries: MetadataRoute.Sitemap = HEALTHCARE_CLINICS.map((clinic) => ({
    url: `${base}/healthcare-network/${clinic.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const dnaEntries: MetadataRoute.Sitemap = DNA_PANELS.map((panel) => ({
    url: `${base}/dna/${panel.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = JOURNAL_ARTICLES.map((article) => ({
    url: `${base}/journal/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...dripEntries, ...dnaEntries, ...journalEntries, ...clinicEntries];
}
