#!/usr/bin/env node
/**
 * Upsert Invita IV drip catalog into Supabase services table.
 * Usage: node scripts/sync-services-catalog.mjs
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env.
 */
import { createClient } from "@supabase/supabase-js";

const DRIPS = [
  ["energy-boost", "Energy Boost", "Wellness", 45, 150000],
  ["jet-fuel", "Jet Fuel", "Performance", 45, 165000],
  ["immune-boost", "Immune Boost", "Wellness", 45, 180000],
  ["sport-endurance-recovery", "Sport Endurance & Recovery", "Performance", 45, 195000],
  ["skin-radiance", "Skin Radiance", "Beauty", 45, 210000],
  ["hair-skin-nails", "Hair, Skin & Nails", "Beauty", 45, 225000],
  ["nad-plus", "NAD+", "Signature", 90, 240000],
  ["weight-management", "Weight Management", "Wellness", 45, 255000],
  ["vitamin-d3-boost", "Vitamin D3 Boost", "Wellness", 45, 270000],
  ["myers-cocktail", "Myers' Cocktail", "Wellness", 45, 285000],
  ["glutathione-detox", "Glutathione Detox", "Wellness", 45, 300000],
];

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

for (const [slug, name, tier, duration, price] of DRIPS) {
  const { data: existing } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const row = {
    name,
    slug,
    tier,
    category: "iv-therapy",
    duration,
    price,
    description: `${name} — Liquivida® protocol`,
    image_url: `/images/invita/drips/${slug}.webp`,
    active: true,
  };

  if (existing?.id) {
    const { error } = await supabase.from("services").update(row).eq("id", existing.id);
    if (error) console.error("update", slug, error.message);
    else console.log("updated", slug);
  } else {
    const { error } = await supabase.from("services").insert(row);
    if (error) console.error("insert", slug, error.message);
    else console.log("inserted", slug);
  }
}

console.log("Done.");
