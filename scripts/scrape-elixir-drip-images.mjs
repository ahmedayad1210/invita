#!/usr/bin/env node
/**
 * Scrape IV drip category icons from The Elixir Clinic landing page.
 * Source: https://theelixirclinic.com/iv-drip-landing-page/
 *
 * Usage: node scripts/scrape-elixir-drip-images.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/drips");
const OUT_JSON = path.join(ROOT, "src/data/elixir-drip-images.json");
const BASE = "https://theelixirclinic.com/wp-content/uploads/2022/11";

/** Invita slug → Elixir CDN filename */
const DRIP_IMAGES = {
  "vip-signature": "Screenshot-2022-11-15-at-150704.png",
  "anti-aging": "Screenshot-2022-11-15-at-150128.png",
  immunity: "Screenshot-2022-11-15-at-145705.png",
  "hair-skin-nails": "Screenshot-2022-11-15-at-145810.png",
  "gut-health": "Screenshot-2022-11-15-at-145837.png",
  "fitness-recovery": "Screenshot-2022-11-15-at-145926.png",
  "libido-enhancer": "Screenshot-2022-11-15-at-145635.png",
  motherhood: "MOTHERHOOD-VITADRIP-icon.jpg",
  "diet-detox": "Screenshot-2022-11-15-at-150009.png",
  "the-recharger": "Screenshot-2022-11-15-at-150910.png",
  "menopause-support": "Frame-3554.png",
  radiance: "Screenshot-2022-11-15-at-150635.png",
  hydration: "Screenshot-2022-11-15-at-145741.png",
  "mood-enhancer": "Screenshot-2022-11-15-at-145358.png",
  "immune-booster": "Screenshot-2022-11-15-at-145705.png",
  "liver-cleanse": "Screenshot-2022-11-15-at-145527.png",
  antioxidant: "Screenshot-2022-11-15-at-150100.png",
  "life-drip": "Screenshot-2022-11-15-at-145603.png",
};

const TIER_IMAGES = {
  Signature: "Screenshot-2022-11-15-at-150704.png",
  Wellness: "Screenshot-2022-11-15-at-145705.png",
  Performance: "Screenshot-2022-11-15-at-145926.png",
  Beauty: "Screenshot-2022-11-15-at-150635.png",
};

function download(url, dest) {
  execFileSync("curl", ["-fsSL", "-o", dest, url], { stdio: "pipe" });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, "public/images/drips/tiers"), { recursive: true });

  const catalog = { scrapedAt: new Date().toISOString().slice(0, 10), source: "https://theelixirclinic.com/iv-drip-landing-page/", drips: {}, tiers: {} };

  for (const [slug, filename] of Object.entries(DRIP_IMAGES)) {
    const ext = path.extname(filename);
    const localName = `${slug}${ext}`;
    const dest = path.join(OUT_DIR, localName);
    const url = `${BASE}/${filename}`;
    process.stderr.write(`  ${slug}…\n`);
    download(url, dest);
    catalog.drips[slug] = {
      local: `/images/drips/${localName}`,
      remote: url,
      filename,
    };
  }

  for (const [tier, filename] of Object.entries(TIER_IMAGES)) {
    const ext = path.extname(filename);
    const localName = `${tier.toLowerCase()}${ext}`;
    const dest = path.join(OUT_DIR, "tiers", localName);
    const url = `${BASE}/${filename}`;
    download(url, dest);
    catalog.tiers[tier] = {
      local: `/images/drips/tiers/${localName}`,
      remote: url,
    };
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Downloaded ${Object.keys(catalog.drips).length} drip icons + ${Object.keys(catalog.tiers).length} tier icons`);
  console.log(`→ ${OUT_JSON}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
