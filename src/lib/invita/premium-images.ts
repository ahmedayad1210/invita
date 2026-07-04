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
  /** Product still life — on-brand hero (espresso / ivory / gold) */
  hero: LOCAL_IMAGES.productStillLife,
  clinicInterior: LOCAL_IMAGES.productStillLife,
  wellnessLounge: LOCAL_IMAGES.wellnessLounge,
  medicalCare: LOCAL_IMAGES.productStillLife,
  ivTreatment: highlightPaths[0] ?? LOCAL_IMAGES.productStillLife,
  transformation: LOCAL_IMAGES.wellnessLounge,
  lifestyle: LOCAL_IMAGES.hero,
  benefits: highlightPaths.length >= 3
    ? highlightPaths.slice(0, 3)
    : [LOCAL_IMAGES.productStillLife, LOCAL_IMAGES.wellnessLounge, LOCAL_IMAGES.brandCapsules],
  addOns: [LOCAL_IMAGES.productStillLife, LOCAL_IMAGES.brandCapsules],
} as const;
