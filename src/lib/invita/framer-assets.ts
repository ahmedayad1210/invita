/** @deprecated Use PREMIUM_IMAGES from premium-images.ts */
import { PREMIUM_IMAGES } from "./premium-images";

export const FRAMER_IMAGES = {
  clinicHero: PREMIUM_IMAGES.hero,
  benefits: PREMIUM_IMAGES.benefits,
  addOns: PREMIUM_IMAGES.addOns,
  socialWall: [] as string[],
  instagram: [] as string[],
} as const;

export const HOW_IT_WORKS_BODY =
  "When vitamins are taken orally, most are broken down in the gut before they ever reach your cells. Only a fraction makes it through. IV therapy eliminates this barrier entirely — everything that goes in is absorbed and used by your body.";

export const FOOTER_TREATMENT_LINKS = [
  { label: "IV Drips", href: "/iv-therapy" },
  { label: "Add-Ons", href: "/add-ons" },
  { label: "Wellness Programs", href: "/membership" },
] as const;

export const FOOTER_COMPANY_LINKS = [
  { label: "About Invita", href: "/about" },
  { label: "Our Team", href: "/about#team" },
  { label: "Blog", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;
