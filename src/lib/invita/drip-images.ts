import catalog from "@/data/elixir-drip-images.json";

export type DripImageCatalog = {
  scrapedAt: string;
  source: string;
  drips: Record<string, { local: string; remote: string; filename: string }>;
  tiers: Record<string, { local: string; remote: string }>;
};

export const DRIP_IMAGE_CATALOG = catalog as DripImageCatalog;

export function getDripImage(slug: string): string | undefined {
  return DRIP_IMAGE_CATALOG.drips[slug]?.local;
}

/** Resolve icon for a catalogue drip (slug may differ from image catalog key). */
export function getProtocolDripImage(
  slug: string,
  imageSlug?: string
): string | undefined {
  return getDripImage(imageSlug ?? slug);
}

export function getTierImage(tier: string): string | undefined {
  return DRIP_IMAGE_CATALOG.tiers[tier]?.local;
}

/** Fallback icon when slug has no mapped image */
export const DRIP_IMAGE_FALLBACK = "/images/drips/vip-signature.png";
