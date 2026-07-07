#!/usr/bin/env node
/**
 * Scrape @invita_iv_drips — max-resolution images + WebP output.
 *
 * Usage:
 *   node scripts/scrape-instagram.mjs           # full scrape
 *   node scripts/scrape-instagram.mjs --hq-only # re-download HQ from cached JSON
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HANDLE = "invita_iv_drips";
const USER_ID = "72502022186";
const RAW_DIR = path.join(ROOT, ".firecrawl");
const OUT_DIR = path.join(ROOT, "public/images/instagram");
const OUT_JSON = path.join(ROOT, "src/data/instagram.json");

const HQ_ONLY = process.argv.includes("--hq-only");
const MIN_WIDTH = 900;
const WEBP_QUALITY = 92;
const MAX_EDGE = 2048;
const PAGINATION_DELAY_MS = 8000;
const RATE_LIMIT_RETRIES = 4;
const RATE_LIMIT_BACKOFF_MS = [60000, 90000, 120000, 180000];

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
  "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "-H", "X-IG-App-ID: 936619743392459",
  "-H", "X-Requested-With: XMLHttpRequest",
  "-H", `Referer: https://www.instagram.com/${HANDLE}/`,
];

function curlJson(url) {
  const out = execFileSync("curl", ["-sS", ...CURL_HEADERS, url], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(out);
}

function curlHtml(url) {
  return execFileSync("curl", ["-sSL", "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36", url], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
}

function curlBuffer(url) {
  return execFileSync("curl", ["-sSL", ...CURL_HEADERS.slice(0, 2), url], { maxBuffer: 30 * 1024 * 1024 });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Pick the widest candidate URL from Instagram's image_versions2 / thumbnail_resources. */
function pickBestCandidateUrl(candidates) {
  if (!candidates?.length) return "";
  const best = candidates.reduce((a, b) => ((b.width || 0) > (a.width || 0) ? b : a));
  return best.url || "";
}

function pickFromGraphNode(node) {
  if (node.display_url) return { url: node.display_url, width: node.dimensions?.width };
  const thumb = pickBestCandidateUrl(node.thumbnail_resources?.map((t) => ({ url: t.src, width: t.config_width })));
  return { url: thumb, width: null };
}

function pickFromFeedItem(item) {
  const cands = item.image_versions2?.candidates || [];
  const url = pickBestCandidateUrl(cands);
  const best = cands.reduce((a, b) => ((b.width || 0) > (a.width || 0) ? b : a), { width: 0 });
  if (url) return { url, width: best.width };

  const carousel = item.carousel_media?.[0];
  if (carousel) {
    const cc = carousel.image_versions2?.candidates || [];
    const cu = pickBestCandidateUrl(cc);
    const cb = cc.reduce((a, b) => ((b.width || 0) > (a.width || 0) ? b : a), { width: 0 });
    if (cu) return { url: cu, width: cb.width };
  }
  return { url: "", width: null };
}

function mapEdgeNode(node) {
  const isReel = node.is_video && node.product_type === "clips";
  const isCarousel = node.__typename === "GraphSidecar";
  const { url, width } = pickFromGraphNode(node);
  return {
    shortcode: node.shortcode,
    type: isReel ? "reel" : isCarousel ? "carousel" : "photo",
    url: isReel
      ? `https://www.instagram.com/${HANDLE}/reel/${node.shortcode}/`
      : `https://www.instagram.com/${HANDLE}/p/${node.shortcode}/`,
    caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
    imageUrl: url,
    imageWidth: width || node.dimensions?.width || null,
    timestamp: node.taken_at_timestamp,
    likes: node.edge_liked_by?.count,
    comments: node.edge_media_to_comment?.count,
  };
}

function mapFeedItem(item) {
  const isReel = item.product_type === "clips" || item.media_type === 2;
  const isCarousel = item.media_type === 8;
  const shortcode = item.code;
  const { url, width } = pickFromFeedItem(item);
  return {
    shortcode,
    type: isReel ? "reel" : isCarousel ? "carousel" : "photo",
    url: isReel
      ? `https://www.instagram.com/${HANDLE}/reel/${shortcode}/`
      : `https://www.instagram.com/${HANDLE}/p/${shortcode}/`,
    caption: item.caption?.text || "",
    imageUrl: url,
    imageWidth: width,
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

async function fetchOgImage(postUrl) {
  try {
    const html = curlHtml(postUrl);
    return parseOgMeta(html).image || "";
  } catch {
    return "";
  }
}

function loadFeedImageMap() {
  const map = new Map();
  if (!fs.existsSync(RAW_DIR)) return map;
  for (const file of fs.readdirSync(RAW_DIR)) {
    if (!file.startsWith("ig-feed-") || !file.endsWith(".json")) continue;
    try {
      const feed = JSON.parse(fs.readFileSync(path.join(RAW_DIR, file), "utf8"));
      for (const item of feed.items || []) {
        const { url, width } = pickFromFeedItem(item);
        const code = item.code;
        const prev = map.get(code);
        if (url && (!prev || (width || 0) > (prev.width || 0))) {
          map.set(code, { url, width });
        }
      }
    } catch {
      /* skip corrupt cache */
    }
  }
  return map;
}

async function resolveBestImageUrl(post, feedImageMap) {
  let url = post.imageUrl || "";
  let width = post.imageWidth || 0;

  const cached = feedImageMap.get(post.shortcode);
  if (cached && (cached.width || 0) > width) {
    url = cached.url;
    width = cached.width || width;
  }

  if (!url || (width > 0 && width < MIN_WIDTH && post.type === "reel")) {
    await sleep(350);
    const og = await fetchOgImage(post.url);
    if (og && !url) url = og;
  } else if (!url || width < MIN_WIDTH) {
    await sleep(350);
    const og = await fetchOgImage(post.url);
    if (og) {
      url = og;
      width = 0;
    }
  }
  return url;
}

async function downloadAndProcessWebp(sourceUrl, destWebp) {
  if (!sourceUrl) return null;

  const tmp = destWebp.replace(/\.webp$/, ".tmp.bin");
  try {
    const buf = curlBuffer(sourceUrl);
    if (!buf || buf.length < 800) return null;

    fs.writeFileSync(tmp, buf);
    const meta = await sharp(tmp).metadata();
    let pipeline = sharp(tmp).rotate();

    const w = meta.width || 0;
    const h = meta.height || 0;
    if (w > MAX_EDGE || h > MAX_EDGE) {
      pipeline = pipeline.resize({
        width: w >= h ? MAX_EDGE : undefined,
        height: h > w ? MAX_EDGE : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    await pipeline
      .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.35 })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .toFile(destWebp);

    fs.unlinkSync(tmp);
    const outMeta = await sharp(destWebp).metadata();
    return {
      width: outMeta.width || w,
      height: outMeta.height || h,
      bytes: fs.statSync(destWebp).size,
    };
  } catch {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    return null;
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
    await sleep(PAGINATION_DELAY_MS);

    let fetched = false;
    for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES && !fetched; attempt++) {
      try {
        const feed = curlJson(
          `https://www.instagram.com/api/v1/feed/user/${USER_ID}/?count=50&max_id=${encodeURIComponent(cursor)}`
        );
        const rateLimited =
          feed.status === "fail" &&
          typeof feed.message === "string" &&
          /wait|rate|limit|try again/i.test(feed.message);

        if (rateLimited && attempt < RATE_LIMIT_RETRIES) {
          const waitMs = RATE_LIMIT_BACKOFF_MS[attempt] ?? 180000;
          process.stderr.write(
            `  rate limited — waiting ${Math.round(waitMs / 1000)}s before retry ${attempt + 1}/${RATE_LIMIT_RETRIES}…\n`
          );
          await sleep(waitMs);
          continue;
        }

        if (feed.status === "fail" || !feed.items?.length) {
          process.stderr.write(`  pagination stopped: ${feed.message || "no items"}\n`);
          cursor = "";
          break;
        }

        fs.writeFileSync(path.join(RAW_DIR, `ig-feed-${page}.json`), JSON.stringify(feed));
        for (const item of feed.items) {
          const m = mapFeedItem(item);
          const existing = byCode.get(m.shortcode);
          if (!existing || (m.imageWidth || 0) > (existing.imageWidth || 0)) {
            byCode.set(m.shortcode, { ...existing, ...m });
          }
        }
        if (!feed.more_available) {
          cursor = "";
        } else {
          cursor = feed.next_max_id;
          page++;
        }
        fetched = true;
      } catch (e) {
        if (attempt < RATE_LIMIT_RETRIES) {
          const waitMs = RATE_LIMIT_BACKOFF_MS[attempt] ?? 180000;
          process.stderr.write(
            `  pagination error: ${e.message} — retry in ${Math.round(waitMs / 1000)}s…\n`
          );
          await sleep(waitMs);
          continue;
        }
        process.stderr.write(`  pagination error: ${e.message}\n`);
        cursor = "";
      }
    }

    if (!fetched) break;
  }

  return [...byCode.values()];
}

async function enrichFromOg(posts, byCode) {
  const allCodes = new Set([...byCode.keys()]);
  for (const code of EXTRA_REEL_CODES) allCodes.add(code);

  for (const code of allCodes) {
    const existing = byCode.get(code);
    if (existing?.imageUrl && (existing.imageWidth || 0) >= MIN_WIDTH) continue;

    await sleep(400);
    const isReel = existing?.type === "reel" || EXTRA_REEL_CODES.includes(code);
    const pathType = isReel ? "reel" : "p";
    const postUrl = existing?.url || `https://www.instagram.com/${HANDLE}/${pathType}/${code}/`;
    try {
      const html = curlHtml(postUrl);
      const { image, desc } = parseOgMeta(html);
      byCode.set(code, {
        shortcode: code,
        type: existing?.type || (isReel ? "reel" : "photo"),
        url: postUrl,
        caption: existing?.caption || captionFromOg(desc),
        imageUrl: existing?.imageUrl || image || "",
        imageWidth: existing?.imageWidth || null,
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

function cleanupLegacyFiles() {
  if (!fs.existsSync(OUT_DIR)) return;
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (/^\d{3}-.*\.jpg$/i.test(file) || file.endsWith(".tmp.bin")) {
      fs.unlinkSync(path.join(OUT_DIR, file));
    }
  }
}

async function processPosts(rawPosts, feedImageMap = new Map()) {
  const posts = [];
  for (let i = 0; i < rawPosts.length; i++) {
    const p = rawPosts[i];
    const { en, ar } = splitCaption(p.caption);
    const filename = `${p.shortcode}.webp`;
    const dest = path.join(OUT_DIR, filename);

    process.stderr.write(`  [${i + 1}/${rawPosts.length}] ${p.shortcode}…\n`);
    const sourceUrl = await resolveBestImageUrl(p, feedImageMap);
    const meta = await downloadAndProcessWebp(sourceUrl, dest);
    await sleep(120);

    posts.push({
      id: slug(p.shortcode, en || ar),
      shortcode: p.shortcode,
      type: p.type,
      url: p.url,
      image: meta ? `/images/instagram/${filename}` : "",
      imageWidth: meta?.width ?? null,
      imageHeight: meta?.height ?? null,
      imageBytes: meta?.bytes ?? null,
      captionEn: en,
      captionAr: ar,
      likes: p.likes ?? null,
      comments: p.comments ?? null,
      timestamp: p.timestamp ? new Date(p.timestamp * 1000).toISOString().slice(0, 10) : null,
    });
  }
  return posts.filter((p) => p.image);
}

async function scrapeProfile() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  cleanupLegacyFiles();

  console.log(`Scraping @${HANDLE} (max-resolution + WebP q${WEBP_QUALITY})…`);
  const profile = curlJson(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${HANDLE}`);
  fs.writeFileSync(path.join(RAW_DIR, "ig-profile.json"), JSON.stringify(profile));

  const user = profile.data.user;
  const byCode = new Map();

  for (const edge of user.edge_owner_to_timeline_media.edges) {
    const m = mapEdgeNode(edge.node);
    byCode.set(m.shortcode, m);
  }

  const paginated = await fetchAllPosts(user);
  for (const p of paginated) {
    const existing = byCode.get(p.shortcode);
    if (!existing || (p.imageWidth || 0) > (existing.imageWidth || 0)) {
      byCode.set(p.shortcode, { ...existing, ...p });
    }
  }

  await enrichFromOg(paginated, byCode);

  await downloadAndProcessWebp(
    user.profile_pic_url_hd || user.profile_pic_url,
    path.join(OUT_DIR, "profile.webp")
  );

  const rawPosts = [...byCode.values()].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return { user, rawPosts };
}

async function buildOutput(user, posts) {
  const partners = [
    { name: "Dr. Sara Basil", nameAr: "د. سارة باسل", specialty: "Nutrition & obesity medicine", specialtyAr: "تغذية علاجية وطب السمنة", postUrl: posts.find((p) => /sara|basil|باسل/i.test(p.captionEn + p.captionAr))?.url },
    { name: "Dr. Ali Albazzaz", nameAr: "د. علي البزاز", specialty: "Consultant plastic surgeon", specialtyAr: "استشاري الجراحة التجميلية", postUrl: posts.find((p) => /albazzaz|البزاز/i.test(p.captionEn + p.captionAr))?.url },
    { name: "Dr. Diana Al-Jubouri", nameAr: "د. دiana الجبوري", specialty: "Dayan Clinic", specialtyAr: "ديان كلينك", postUrl: posts.find((p) => /dayan|diana|ديان/i.test(p.captionEn + p.captionAr))?.url },
  ];

  let address = null;
  try { address = JSON.parse(user.business_address_json || "null"); } catch { /* */ }

  const avgWidth = posts.length
    ? Math.round(posts.reduce((s, p) => s + (p.imageWidth || 0), 0) / posts.length)
    : 0;
  const stillPosts = posts.filter((p) => p.type !== "reel");
  const avgPhotoWidth = stillPosts.length
    ? Math.round(stillPosts.reduce((s, p) => s + (p.imageWidth || 0), 0) / stillPosts.length)
    : 0;

  return {
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
    profileImage: "/images/instagram/profile.webp",
    imageFormat: "webp",
    imageQuality: WEBP_QUALITY,
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
      avgImageWidth: avgWidth,
      avgPhotoWidth,
    },
  };
}

async function hqOnlyFromCache() {
  if (!fs.existsSync(OUT_JSON)) {
    console.error("No instagram.json — run full scrape first.");
    process.exit(1);
  }
  const existing = JSON.parse(fs.readFileSync(OUT_JSON, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  cleanupLegacyFiles();

  console.log(`Re-processing ${existing.posts.length} posts to HQ WebP…`);
  const rawPosts = existing.posts.map((p) => ({
    shortcode: p.shortcode,
    type: p.type,
    url: p.url,
    caption: p.captionEn || p.captionAr,
    imageUrl: "",
    imageWidth: p.imageWidth || 0,
    timestamp: p.timestamp ? Math.floor(new Date(p.timestamp).getTime() / 1000) : undefined,
    likes: p.likes,
    comments: p.comments,
  }));

  const profilePath = path.join(RAW_DIR, "ig-profile.json");
  const user = fs.existsSync(profilePath)
    ? JSON.parse(fs.readFileSync(profilePath, "utf8")).data.user
    : { full_name: existing.displayName, edge_followed_by: { count: existing.followers }, edge_follow: { count: existing.following }, edge_owner_to_timeline_media: { count: existing.postsCount }, biography: existing.bioEn, external_url: existing.websiteUrl, category_name: existing.category, business_address_json: JSON.stringify(existing.businessAddress), bio_links: existing.bioLinks?.map((l) => ({ title: l.title, url: l.url })) };

  const byCode = new Map(rawPosts.map((p) => [p.shortcode, p]));
  await enrichFromOg(rawPosts, byCode);
  const posts = await processPosts([...byCode.values()].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
  const output = await buildOutput(user, posts);
  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2) + "\n");
  console.log(`Done: ${posts.length} HQ WebP images (avg ${output.stats.avgImageWidth}px wide)`);
}

async function main() {
  if (HQ_ONLY) {
    await hqOnlyFromCache();
    return;
  }

  const { user, rawPosts } = await scrapeProfile();
  const feedImageMap = loadFeedImageMap();
  console.log(`Processing ${rawPosts.length} images…`);
  const posts = await processPosts(rawPosts, feedImageMap);
  const output = await buildOutput(user, posts);

  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2) + "\n");
  console.log(`Done: ${posts.length}/${output.stats.totalOnProfile} posts (${output.stats.reels} reels)`);
  console.log(`Avg width: ${output.stats.avgImageWidth}px (photos ~${output.stats.avgPhotoWidth}px) · WebP q${WEBP_QUALITY}`);
  console.log(`→ ${OUT_JSON}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
