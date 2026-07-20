/**
 * Official Invita brand identity — colors & logo paths.
 * Source: Google Drive brand kit / Invita IV folder.
 * Run: npm run ingest:dump
 */

export const INVITA_BRAND = {
  colors: {
    navy: "#0C2430",
    periwinkle: "#7FB7C4",
    gold: "#0FB5A8",
    ivory: "#EEF4F6",
  },
  logos: {
    /** Gold radial mark — favicon, small UI marks */
    iconGold: "/images/invita/brand/logo-icon-gold.png",
    /** Navy mark */
    iconNavy: "/images/invita/brand/logo-icon-navy.png",
    /** Horizontal wordmark on light backgrounds */
    wordmarkNavy: "/images/invita/brand/logo-wordmark-navy.png",
    /** Horizontal wordmark on dark / navy backgrounds */
    wordmarkIvory: "/images/invita/brand/logo-wordmark-ivory.png",
    /** Gold wordmark accent */
    wordmarkGold: "/images/invita/brand/logo-wordmark-gold.png",
    /** Full stack — icon + name + tagline (dark bg) */
    stackDark: "/images/invita/brand/logo-stack-dark.png",
    /** Full stack on navy square — social / OG */
    stackNavy: "/images/invita/brand/logo-stack-navy.png",
    brandCapsules: "/images/invita/brand/brand-capsules.png",
  },
  tagline: "IV Vitamins Therapy",
} as const;

export type InvitaBrandColor = keyof typeof INVITA_BRAND.colors;
