#!/usr/bin/env node
/**
 * Scrape @invita_iv_drips — profile API + paginated feed + individual og:meta for reels.
 * Saves raw JSON to .firecrawl/ and builds src/data/instagram.json
 *
 * Usage: node scripts/scrape-instagram.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HANDLE = "invita_iv_drips";
const USER_ID = "72502022186";
const RAW_DIR = path.join(ROOT, ".firecrawl");
const OUT_DIR = path.join(ROOT, "public/images/instagram");
const OUT_JSON = path.join(ROOT, "src/data/instagram.json");

const EXTRA_REEL_CODES = [
  "DO_5I4gDrQX", "DZCuY2QOsrh", "DY7ROcnM-9l", "DYqEhATucpz",
  "DYj0RyosQlQ", "DYgIrNRKBYi", "DYSoxsWNLpD", "DXXDNDKjRq_", "DXU5VKxDjMY",
];

const HIGHLIGHTS = [
  { id: "why-invita", labelEn: "Why Invita?", labelAr: "لماذا إنفيتا؟", url: "https://www.instagram.com/stories/highlights/18097324708546492/" },
  { id: "elite-clinics", labelEn: "Elite Clinics", labelAr: "عيادات النخبة", url: "https://www.instagram.com/stories/highlights/17901099027238263/" },
  { id: "dna-lab", labelEn: "INVITA DNA Lab", labelAr: "مختبر DNA", url: "https://www.instagram.com/stories/highlights/18098890303675341/" },
  { id: "fuel-body", labelEn: "Fuel your Body", labelAr: "غذِّ جسمك", url: "https://www.instagram.com/stories/highlights/18096783076782868/" },
  { id: "events", labelEn: "Events", labelAr: "فعاليات", url: "https://www.instagram.com/stories/highlights/17873423712428346/" },
  { id: "about", labelEn: "About Us", labelAr: "من نحن", url: "https://www.instagram.com/stories/highlights/17862333219452745/" },
  { id: "faq", labelEn: "FAQs", labelAr: "الأسئلة", url: "https://www.instagram.com/stories/highlights/17854713006494648/" },
  { id: "menu", labelEn: "IV Menu", labelAr: "الأنواع", url: "https://www.instagram.com/stories/highlights/17944754093886400/" },
];

const CURL_HEADERS = [
  "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "-H", "X-IG-App-ID: 936619743392459",
  "-H", "X-Requested-With: XMLHttpRequest",
  "-H", `Referer: https://www.instagram.com/${HANDLE}/`,
];

function curlJson(url) {
  const out = execFileSync("curl", ["-sS", ...CURL_HEADERS, url], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(out);
}

function curlHtml(url) {
  return execFileSync("curl", ["-sSL", "-H", "User-Agent: Mozilla/5.0", url], { encoding: "utf8", maxBuffer: 5 * 1024 * 1024 });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function mapEdgeNode(node) {
  const isReel = node.is_video && node.product_type === "clips";
  const isCarousel = node.__typename === "GraphSidecar";
  return {
    shortcode: node.shortcode,
    type: isReel ? "reel" : isCarousel ? "carousel" : "photo",
    url: isReel
      ? `https://www.instagram.com/${HANDLE}/reel/${node.shortcode}/`
      : `https://www.instagram.com/${HANDLE}/p/${node.shortcode}/`,
    caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
    thumb: node.display_url || node.thumbnail_src || "",
    timestamp: node.taken_at_timestamp,
    likes: node.edge_liked_by?.count,
    comments: node.edge_media_to_comment?.count,
  };
}

function mapFeedItem(item) {
  const isReel = item.product_type === "clips" || item.media_type === 2;
  const isCarousel = item.media_type === 8;
  const shortcode = item.code;
  return {
    shortcode,
    type: isReel ? "reel" : isCarousel ? "carousel" : "photo",
    url: isReel
      ? `https://www.instagram.com/${HANDLE}/reel/${shortcode}/`
      : `https://www.instagram.com/${HANDLE}/p/${shortcode}/`,
    caption: item.caption?.text || "",
    thumb: item.image_versions2?.candidates?.[0]?.url || item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url || "",
    timestamp: item.taken_at,
    likes: item.like_count,
    comments: item.comment_count,
  };
}

function parseOgMeta(html) {
  const image = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1]?.replace(/&amp;/g, "&");
  const desc = html.match(/property="og:description"\s+content="([^"]+)"/)?.[1]
    ?.replace(/&amp;/g, "&")
    ?.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    ?.replace(/&quot;/g, '"');
  return { image, desc };
}

function captionFromOg(desc) {
  if (!desc) return "";
  const m = desc.match(/:\s*"(.+)"\.\s*$/s) || desc.match(/:\s*(.+)$/s);
  return (m?.[1] || desc).replace(/\\n/g, "\n").trim();
}

async function downloadImage(url, dest) {
  if (!url || fs.existsSync(dest)) return !!url;
  try {
    execFileSync("curl", ["-sSL", "-o", dest, url], { stdio: "pipe" });
    return fs.existsSync(dest) && fs.statSync(dest).size > 500;
  } catch {
    return false;
  }
}

async function fetchAllPosts(user) {
  const byCode = new Map();
  for (const edge of user.edge_owner_to_timeline_media.edges) {
    const m = mapEdgeNode(edge.node);
    byCode.set(m.shortcode, m);
  }

  let cursor = user.edge_owner_to_timeline_media.page_info.end_cursor;
  let page = 1;

  while (cursor && byCode.size < (user.edge_owner_to_timeline_media.count || 200)) {
    process.stderr.write(`  paginating page ${page} (${byCode.size} posts)…\n`);
    await sleep(6000);
    try {
      const feed = curlJson(
        `https://www.instagram.com/api/v1/feed/user/${USER_ID}/?count=50&max_id=${encodeURIComponent(cursor)}`
      );
      if (feed.status === "fail" || !feed.items?.length) {
        process.stderr.write(`  pagination stopped: ${feed.message || "no items"}\n`);
        break;
      }
      fs.writeFileSync(path.join(RAW_DIR, `ig-feed-${page}.json`), JSON.stringify(feed));
      for (const item of feed.items) {
        const m = mapFeedItem(item);
        if (!byCode.has(m.shortcode)) byCode.set(m.shortcode, m);
      }
      if (!feed.more_available) break;
      cursor = feed.next_max_id;
      page++;
    } catch (e) {
      process.stderr.write(`  pagination error: ${e.message}\n`);
      break;
    }
  }

  return [...byCode.values()];
}

async function enrichFromOg(posts, byCode) {
  const allCodes = new Set([...byCode.keys()]);
  for (const code of EXTRA_REEL_CODES) allCodes.add(code);

  for (const code of allCodes) {
    if (byCode.has(code) && byCode.get(code).thumb && byCode.get(code).caption) continue;
    await sleep(400);
    const isReel = byCode.get(code)?.type === "reel" || EXTRA_REEL_CODES.includes(code);
    const pathType = isReel ? "reel" : "p";
    try {
      const html = curlHtml(`https://www.instagram.com/${pathType}/${code}/`);
      const { image, desc } = parseOgMeta(html);
      const existing = byCode.get(code);
      byCode.set(code, {
        shortcode: code,
        type: existing?.type || (isReel ? "reel" : "photo"),
        url: existing?.url || `https://www.instagram.com/${HANDLE}/${pathType}/${code}/`,
        caption: existing?.caption || captionFromOg(desc),
        thumb: existing?.thumb || image || "",
        timestamp: existing?.timestamp,
        likes: existing?.likes,
        comments: existing?.comments,
      });
    } catch {
      /* skip */
    }
  }
}

function slug(shortcode, caption) {
  const words = (caption || shortcode).replace(/[^\w\s\u0600-\u06FF]/g, " ").trim().split(/\s+/).slice(0, 4).join("-").toLowerCase();
  return words.slice(0, 36) || shortcode.toLowerCase();
}

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function splitCaption(caption) {
  if (!caption) return { en: "", ar: "" };
  if (isArabic(caption)) return { en: "", ar: caption };
  return { en: caption, ar: "" };
}

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Scraping @${HANDLE}…`);
  const profile = curlJson(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${HANDLE}`);
  fs.writeFileSync(path.join(RAW_DIR, "ig-profile.json"), JSON.stringify(profile));

  const user = profile.data.user;
  const byCode = new Map();

  for (const edge of user.edge_owner_to_timeline_media.edges) {
    const m = mapEdgeNode(edge.node);
    byCode.set(m.shortcode, m);
  }

  const paginated = await fetchAllPosts(user);
  for (const p of paginated) byCode.set(p.shortcode, p);

  await enrichFromOg(paginated, byCode);

  await downloadImage(user.profile_pic_url_hd || user.profile_pic_url, path.join(OUT_DIR, "profile.jpg"));

  const rawPosts = [...byCode.values()].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const posts = [];

  for (let i = 0; i < rawPosts.length; i++) {
    const p = rawPosts[i];
    const { en, ar } = splitCaption(p.caption);
    const filename = `${String(i + 1).padStart(3, "0")}-${p.shortcode}.jpg`;
    await downloadImage(p.thumb, path.join(OUT_DIR, filename));
    await sleep(150);

    posts.push({
      id: slug(p.shortcode, en || ar),
      shortcode: p.shortcode,
      type: p.type,
      url: p.url,
      image: `/images/instagram/${filename}`,
      captionEn: en,
      captionAr: ar,
      likes: p.likes ?? null,
      comments: p.comments ?? null,
      timestamp: p.timestamp ? new Date(p.timestamp * 1000).toISOString().slice(0, 10) : null,
    });
  }

  const partners = [
    { name: "Dr. Sara Basil", nameAr: "د. سارة باسل", specialty: "Nutrition & obesity medicine", specialtyAr: "تغذية علاجية وطب السمنة", postUrl: posts.find((p) => /sara|basil|باسل/i.test(p.captionEn + p.captionAr))?.url },
    { name: "Dr. Ali Albazzaz", nameAr: "د. علي البزاز", specialty: "Consultant plastic surgeon", specialtyAr: "استشاري الجراحة التجميلية", postUrl: posts.find((p) => /albazzaz|البزاز/i.test(p.captionEn + p.captionAr))?.url },
    { name: "Dr. Diana Al-Jubouri", nameAr: "د. دiana الجبوري", specialty: "Dayan Clinic", specialtyAr: "ديان كلينك", postUrl: posts.find((p) => /dayan|diana|ديان/i.test(p.captionEn + p.captionAr))?.url },
  ];

  let address = null;
  try { address = JSON.parse(user.business_address_json || "null"); } catch { /* */ }

  const output = {
    handle: HANDLE,
    displayName: user.full_name,
    profileUrl: `https://www.instagram.com/${HANDLE}/`,
    websiteUrl: user.external_url || "https://invitadrips.com",
    bioEn: user.biography,
    bioAr: "١١ علاج وريدي متقدم للفيتامينات، بالشراكة مع عيادات راقية لإعادة تعريف العافية. العلامة المعتمدة الوحيدة لـ Liquivida® في العراق.",
    followers: user.edge_followed_by?.count ?? 0,
    following: user.edge_follow?.count ?? 0,
    postsCount: user.edge_owner_to_timeline_media?.count ?? posts.length,
    category: user.category_name || "Health/beauty",
    businessAddress: address,
    contactPhone: "07748885559",
    bioLinks: (user.bio_links || []).map((l) => ({ title: l.title || "Link", url: l.url })),
    scrapedAt: new Date().toISOString().slice(0, 10),
    profileImage: "/images/instagram/profile.jpg",
    highlights: HIGHLIGHTS,
    posts,
    reels: posts.filter((p) => p.type === "reel"),
    partners,
    themes: [
      "Liquivida® — only certified brand in Iraq",
      "11 advanced IV vitamin therapies",
      "30+ elite partner clinics in Baghdad",
      "INVITA DNA Lab & nutrigenomics",
      "NAD+ cellular energy & anti-aging",
      "Sports recovery & national team partnerships",
      "Arabic + English bilingual content",
      "Al-Mansour, Baghdad",
    ],
    stats: {
      scraped: posts.length,
      reels: posts.filter((p) => p.type === "reel").length,
      photos: posts.filter((p) => p.type === "photo").length,
      carousels: posts.filter((p) => p.type === "carousel").length,
      totalOnProfile: user.edge_owner_to_timeline_media?.count ?? posts.length,
    },
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2) + "\n");
  console.log(`Done: ${posts.length}/${output.stats.totalOnProfile} posts (${output.stats.reels} reels)`);
  console.log(`→ ${OUT_JSON}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
