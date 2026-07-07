#!/usr/bin/env node
/**
 * Full-site pathway audit for Invita production.
 * Usage: node scripts/audit-site.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.argv[2] || "https://invitadrips.com").replace(/\/$/, "");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DRIP_SLUGS = [
  "energy-boost", "jet-fuel", "immune-boost", "sport-endurance-recovery",
  "skin-radiance", "hair-skin-nails", "nad-plus", "weight-management",
  "vitamin-d3-boost", "myers-cocktail", "glutathione-detox",
];
const DNA_SLUGS = ["nutrigenomics", "longevity-comprehensive", "pharmacogenomics", "skin-beauty-genetics"];
const JOURNAL_SLUGS = [
  ...fs
    .readFileSync(path.join(ROOT, "src/lib/invita/journal-articles.ts"), "utf8")
    .matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);
const CLINIC_SLUGS = [
  ...fs
    .readFileSync(path.join(ROOT, "src/lib/invita/healthcare-network.ts"), "utf8")
    .matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);

const STATIC_ROUTES = [
  "/", "/about", "/iv-therapy", "/add-ons", "/faq", "/contact", "/membership",
  "/locations", "/for-clinics", "/healthcare-network", "/book", "/privacy",
  "/terms", "/dna", "/science", "/science/explorer", "/journal", "/telehealth",
  "/partners/login", "/account", "/bookings", "/services",
  "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password",
  "/auth/callback", "/admin", "/admin/bookings", "/admin/leads", "/admin/certifications",
  "/admin/dna", "/admin/services", "/admin/stylists",
  "/sitemap.xml", "/robots.txt", "/favicon.svg", "/og/default.svg", "/manifest.webmanifest",
];

const PDFS = [
  "invita-safety-101", "invita-catalogue", "invita-iv-brochure", "iso-13485",
  "invita-patient-education", "nad-plus-scientific-review",
  "liquivida-science-magazine", "liquivida-clinical-guide",
].map((n) => `/resources/${n}.pdf`);

const REDIRECTS = [
  ["/services", "/iv-therapy"],
  ["/bookings", "/account"],
];

const failures = [];
const passes = [];

async function check(url, opts = {}) {
  const full = url.startsWith("http") ? url : `${BASE}${url}`;
  try {
    const res = await fetch(full, { redirect: opts.followRedirect === false ? "manual" : "follow", ...opts });
    return { url: full, status: res.status, location: res.headers.get("location"), ok: res.ok || res.status === 307 || res.status === 302 };
  } catch (e) {
    return { url: full, status: 0, error: e.message, ok: false };
  }
}

function record(name, result, expect) {
  const ok = expect(result);
  if (ok) passes.push(name);
  else failures.push({ name, ...result });
  const icon = ok ? "✓" : "✗";
  console.log(`${icon} ${name}${result.status ? ` (${result.status})` : ""}${result.error ? ` — ${result.error}` : ""}`);
}

async function main() {
  console.log(`\nInvita site audit — ${BASE}\n`);

  console.log("── Static routes ──");
  for (const route of STATIC_ROUTES) {
    const r = await check(route);
    record(route, r, (x) => x.status >= 200 && x.status < 400);
  }

  console.log("\n── Redirects ──");
  for (const [from, toPart] of REDIRECTS) {
    const r = await check(from, { followRedirect: false });
    record(`${from} → ${toPart}`, r, (x) =>
      (x.status === 301 || x.status === 308 || x.status === 307 || x.status === 302) &&
      (x.location || "").includes(toPart)
    );
  }

  console.log("\n── IV drips (11) ──");
  for (const slug of DRIP_SLUGS) {
    const r = await check(`/iv-therapy/${slug}`);
    record(`/iv-therapy/${slug}`, r, (x) => x.status === 200);
  }

  console.log("\n── DNA panels (4) ──");
  for (const slug of DNA_SLUGS) {
    const r = await check(`/dna/${slug}`);
    record(`/dna/${slug}`, r, (x) => x.status === 200);
  }

  console.log("\n── Clinics (sample 10) ──");
  for (const slug of CLINIC_SLUGS.slice(0, 10)) {
    const r = await check(`/healthcare-network/${slug}`);
    record(`/healthcare-network/${slug}`, r, (x) => x.status === 200);
  }

  console.log("\n── Journal articles (sample 3) ──");
  for (const slug of JOURNAL_SLUGS.slice(0, 3)) {
    const r = await check(`/journal/${slug}`);
    record(`/journal/${slug}`, r, (x) => x.status === 200);
  }

  console.log("\n── PDF resources (8) ──");
  for (const pdf of PDFS) {
    const r = await check(pdf);
    record(pdf, r, (x) => x.status === 200);
  }

  console.log("\n── API endpoints ──");
  const apiChecks = [
    ["GET /api/services", () => check("/api/services"), (x) => x.status === 200],
    ["GET /api/stylists", () => check("/api/stylists"), (x) => x.status === 200],
    ["GET /api/certifications", () => check("/api/certifications"), (x) => x.status === 200],
    ["GET /api/availability (bad id)", () => check("/api/availability?date=2026-08-01&stylist_id=test"), (x) => x.status === 400],
    ["GET /api/user/profile (anon)", () => check("/api/user/profile"), (x) => x.status === 401],
    ["POST /api/leads (empty)", () => check("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }), (x) => x.status === 400],
    ["POST /api/admin/login (empty)", () => check("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }), (x) => x.status === 400 || x.status === 401],
    ["POST /api/wellness-assistant (empty)", () => check("/api/wellness-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }), (x) => x.status === 400],
    ["GET /api/admin/leads (anon)", () => check("/api/admin/leads"), (x) => x.status === 401],
  ];
  for (const [name, fn, expect] of apiChecks) {
    const r = await fn();
    record(name, r, expect);
  }

  console.log("\n── Auth gates ──");
  const accountAnon = await check("/account", { followRedirect: false });
  record("/account (anon) → login", accountAnon, (x) =>
    (x.status === 307 || x.status === 302) && (x.location || "").includes("/auth/login")
  );
  const adminAnon = await check("/admin/bookings", { followRedirect: false });
  record("/admin/bookings (anon) → /admin", adminAnon, (x) =>
    (x.status === 307 || x.status === 302) && (x.location || "").includes("/admin")
  );

  const partnerDash = await check("/partners/dashboard", { followRedirect: false });
  record("/partners/dashboard (anon) → login", partnerDash, (x) =>
    (x.status === 307 || x.status === 302) && (x.location || "").includes("/partners/login")
  );

  console.log(`\n${passes.length} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  ${f.name}: status=${f.status} loc=${f.location || f.error || ""}`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
