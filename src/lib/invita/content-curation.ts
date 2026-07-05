/**
 * Curated mappings from the Invita dump → site sections.
 * Source of truth for homepage, gallery, drips, and partner materials.
 */

/** Homepage drip menu — 8 catalogue protocols with matching studio infographics */
export const HOMEPAGE_DRIP_SLUGS = [
  "energy-boost",
  "immune-boost",
  "skin-radiance",
  "nad-plus",
  "jet-fuel",
  "sport-endurance-recovery",
  "myers-cocktail",
  "glutathione-detox",
] as const;

/** Drip slug → ingested infographic ID (I V *.jpg from dump) */
export const DRIP_INFOGRAPHIC_IDS: Record<string, string> = {
  "energy-boost": "iv-17",
  "jet-fuel": "iv-18",
  "immune-boost": "iv-10",
  "sport-endurance-recovery": "iv-04",
  "skin-radiance": "iv-13",
  "hair-skin-nails": "iv-14",
  "nad-plus": "iv-07",
  "weight-management": "iv-16",
  "vitamin-d3-boost": "iv-02",
  "myers-cocktail": "iv-01",
  "glutathione-detox": "iv-16",
};

/** Gallery rows — topic-grouped infographics (all 17 from dump) */
export const GALLERY_TOPIC_ROWS = [
  {
    id: "nad",
    labelEn: "NAD+ & cellular energy",
    labelAr: "NAD+ والطاقة الخلوية",
    ids: ["iv-07", "iv-08", "iv-09"],
  },
  {
    id: "immunity",
    labelEn: "Immune support",
    labelAr: "دعم المناعة",
    ids: ["iv-10", "iv-11"],
  },
  {
    id: "beauty",
    labelEn: "Beauty & radiance",
    labelAr: "الجمال والإشراق",
    ids: ["iv-12", "iv-13", "iv-14", "iv-15"],
  },
  {
    id: "energy",
    labelEn: "Energy & performance",
    labelAr: "الطاقة والأداء",
    ids: ["iv-17", "iv-18", "iv-04"],
  },
  {
    id: "science",
    labelEn: "Clinical foundations",
    labelAr: "الأسس السريرية",
    ids: ["iv-01", "iv-02", "iv-05", "iv-06", "iv-16"],
  },
] as const;

/** Best clinic photography from dump — square, high-res partner shots */
export const CURATED_CLINIC_PHOTO_IDS = [
  "photo-2026-05-20-12-56-23",
  "photo-2026-05-20-12-56-23-2",
  "photo-2026-05-20-12-56-24",
  "photo-2026-05-20-12-56-24-2",
  "photo-2026-05-09-17-37-44",
  "photo-2026-06-01-16-40-59",
  "photo-2026-04-24-02-32-00-2",
  "photo-2026-04-24-02-32-00-3",
] as const;

/** Editorial hero + mosaic picks */
export const EDITORIAL_CLINIC_PHOTO_IDS = [
  "photo-2026-03-09-12-27-30",
  "photo-2026-04-22-20-25-52",
  "photo-2026-04-22-21-08-56-2",
  "photo-2026-05-20-12-58-18",
] as const;

/** Partner / B2B PDFs from ingest script */
export const PARTNER_RESOURCES = [
  {
    id: "invita-safety-101-pdf",
    titleEn: "Safety 101 — Clinic Protocols",
    titleAr: "Safety 101 — بروتوكولات العيادة",
    descEn: "11 drip protocols, pre-infusion checklist, light-sensitive handling.",
    descAr: "11 بروتوكول، قائمة ما قبل الإعطاء، التعامل مع الحساسية للضوء.",
    path: "/resources/invita-safety-101.pdf",
    size: "0.9 MB",
  },
  {
    id: "invita-catalogue-pdf",
    titleEn: "Full Product Catalogue",
    titleAr: "كتalog المنتجات الكامل",
    descEn: "Complete Invita IV formulary with clinical positioning.",
    descAr: "كتalog Invita الكامل مع التموضع السريري.",
    path: "/resources/invita-catalogue.pdf",
    size: "24 MB",
  },
  {
    id: "invita-iv-brochure-pdf",
    titleEn: "Patient IV Brochure",
    titleAr: "بروشور المريض",
    descEn: "Patient-facing services, benefits, and contact details.",
    descAr: "الخدمات والفوائد للمرضى.",
    path: "/resources/invita-iv-brochure.pdf",
    size: "6.9 MB",
  },
  {
    id: "iso-13485-pdf",
    titleEn: "ISO 13485 Certification",
    titleAr: "شهادة ISO 13485",
    descEn: "Medical devices quality management documentation.",
    descAr: "وثائق إدارة جودة الأجهزة الطبية.",
    path: "/resources/iso-13485.pdf",
    size: "0.8 MB",
  },
] as const;

/** NAD+ symposium positioning (from uploaded NAD review PDF text) */
export const NAD_SPOTLIGHT = {
  eyebrowEn: "Clinical science",
  eyebrowAr: "العلم السريري",
  titleEn: "NAD+ IV therapy — evidence for aesthetic & surgical medicine",
  titleAr: "NAD+ الوريدي — أدلة لطب التجميل والجراحة",
  bodyEn:
    "Presented to the Iraqi Plastic Surgery Committee (2026). Human tissue data shows 40–60% NAD+ decline by age 60–70. Invita administers 750 mg protocols over ~90 minutes with clinician titration.",
  bodyAr:
    "عُرض على اللجنة العراقية لجراحة التجميل (2026). بيانات الأنسجة تُظهر انخفاض NAD+ بنسبة 40–60% بحلول 60–70 سنة. إنفيتا تُعطي 750 mg على ~90 دقيقة بإشراف طبي.",
  statValue: "40–60%",
  statLabelEn: "NAD+ decline by age 60–70",
  statLabelAr: "انخفاض NAD+ بحلول 60–70 سنة",
  infographicId: "iv-07",
} as const;
