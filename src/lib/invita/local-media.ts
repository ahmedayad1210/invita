import catalog from "@/data/invita-media.json";
import { INVITA_BRAND } from "./brand-kit";

export type MediaItem = {
  id: string;
  type?: string;
  path: string;
  source?: string;
  width?: number;
  height?: number;
};

export type InvitaMediaCatalog = typeof catalog;

export const INVITA_MEDIA = catalog as InvitaMediaCatalog;

export function featuredPath(role: string, fallback: string): string {
  const item = INVITA_MEDIA.featured?.find((f) => f.role === role);
  return item?.path ?? fallback;
}

export const LOCAL_IMAGES = {
  hero: featuredPath("hero", "/images/invita/hero.webp"),
  productStillLife: featuredPath("productStillLife", "/images/invita/product-still-life.webp"),
  wellnessLounge: featuredPath("wellnessLounge", "/images/invita/wellness-lounge.webp"),
  logoIcon: INVITA_BRAND.logos.iconGold,
  logoStack: INVITA_BRAND.logos.stackDark,
  logoWordmark: INVITA_BRAND.logos.wordmarkNavy,
  logoWordmarkLight: INVITA_BRAND.logos.wordmarkIvory,
  brandCapsules: INVITA_BRAND.logos.brandCapsules,
} as const;

/** Curated infographic IDs for education / gallery highlights */
export const HIGHLIGHT_INFOGRAPHICS = ["iv-07", "iv-10", "iv-12", "iv-01", "iv-15"] as const;

export function getInfographic(id: string): MediaItem | undefined {
  return INVITA_MEDIA.infographics?.find((item) => item.id === id);
}

export function getGalleryPhotos(limit = 12): MediaItem[] {
  return (INVITA_MEDIA.clinicPhotos ?? []).slice(0, limit);
}

export function getAllInfographics(): MediaItem[] {
  return INVITA_MEDIA.infographics ?? [];
}

export function getReels() {
  return INVITA_MEDIA.reels ?? [];
}
