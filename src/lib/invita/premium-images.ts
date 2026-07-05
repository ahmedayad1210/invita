/**
 * Invita photography & brand assets — ingested from invita dump.
 * Run: npm run ingest:dump
 * Presentation: always via MediaFrame / MediaImage (invita-assets.css).
 */
import { getInfographic, HIGHLIGHT_INFOGRAPHICS, LOCAL_IMAGES } from "./local-media";

const highlightPaths = HIGHLIGHT_INFOGRAPHICS.map(
  (id) => getInfographic(id)?.path,
).filter(Boolean) as string[];

export const PREMIUM_IMAGES = {
  /** Lifestyle hero from dump (AJM06177-scaled) */
  hero: LOCAL_IMAGES.hero,
  clinicInterior: LOCAL_IMAGES.wellnessLounge,
  wellnessLounge: LOCAL_IMAGES.wellnessLounge,
  medicalCare: LOCAL_IMAGES.hero,
  ivTreatment: highlightPaths[0] ?? LOCAL_IMAGES.hero,
  transformation: LOCAL_IMAGES.wellnessLounge,
  lifestyle: LOCAL_IMAGES.hero,
  /** Product still life for formulary / about sections */
  productStillLife: LOCAL_IMAGES.productStillLife,
  benefits: highlightPaths.length >= 3
    ? highlightPaths.slice(0, 3)
    : [LOCAL_IMAGES.productStillLife, LOCAL_IMAGES.wellnessLounge, LOCAL_IMAGES.brandCapsules],
  addOns: [LOCAL_IMAGES.productStillLife, LOCAL_IMAGES.brandCapsules],
} as const;
