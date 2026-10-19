// Home (Lapis & Bone) — drip menu, matcher, proof and media data.
// Source: docs/design_handoff_invita_site/Invita Home.dc.html (DRIPS, GOALS, CELEBS, DOCTOR_CARDS).

import { getLiquividaDrip } from "@/lib/invita/liquivida-drips";
import { getProtocolDripImage, DRIP_IMAGE_FALLBACK } from "@/lib/invita/drip-images";

export const WHATSAPP_NUMBER = "9647748885559";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
/** Generic booking link — Arabic greeting, as in the design, for every locale. */
export const WHATSAPP_BOOK_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "مرحباً Invita — أود حجز جلسة علاج وريدي",
)}`;

export function whatsappWithText(text: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export type DripTier = "Signature" | "Wellness" | "Performance" | "Beauty";

export type LapisDrip = {
  slug: string;
  tier: DripTier;
  min: number;
  price: number;
  name: string;
  formula: string;
  en: { tag: string; desc: string };
  ar: { tag: string; desc: string };
};

export const DRIPS: LapisDrip[] = [
  { slug: "energy-boost", tier: "Wellness", min: 45, price: 150000, name: "Energy Boost",
    formula: "B1 100mg · B2 25mg · B3 200mg · B6 250mg · B12 1000mcg · Magnesium Sulphate 200mg · Amino Acids",
    en: { tag: "Instant recharge against chronic fatigue and burnout", desc: "Fast energy, better mood and focus, and support for nerves and muscles — for busy professionals, parents, or those recovering from illness." },
    ar: { tag: "جلسة تنشيط فورية ضد التعب المزمن والإجهاد", desc: "طاقة سريعة، مزاج وتركيز أفضل، ودعم للأعصاب والعضلات — للمهنيين المشغولين أو المتعافين من المرض." } },
  { slug: "immune-boost", tier: "Wellness", min: 45, price: 165000, name: "Immune Boost",
    formula: "Vitamin C 1000mg · Zinc 100mg · Calcium 2mmol · Potassium 5mmol · Bicarbonate 25mmol",
    en: { tag: "Fortify defences and recover faster", desc: "Strengthens the immune system, reduces how often and how long you get sick, speeds healing, and boosts resistance to viruses." },
    ar: { tag: "تقوية المناعة وتعافٍ أسرع", desc: "تقوية جهاز المناعة، تقليل تكرار ومدة الإصابة بالأمراض، تسريع الشفاء وتعزيز مقاومة الفيروسات." } },
  { slug: "hair-skin-nails", tier: "Beauty", min: 45, price: 180000, name: "Hair, Nail & Skin",
    formula: "Biotin 10,000mcg · Zinc 10mg/ml",
    en: { tag: "Biotin boost for beauty from within", desc: "Strengthens hair and stimulates growth, reduces shedding and breakage, improves skin freshness, and boosts nail health." },
    ar: { tag: "بيوتين لجمالٍ من الداخل", desc: "تقوية الشعر وتحفيز نموه، تقليل التساقط والتقصف، تحسين نضارة البشرة وتعزيز صحة الأظافر." } },
  { slug: "panthenol-b5", tier: "Beauty", min: 45, price: 175000, name: "Panthenol (B5)",
    formula: "Dexpanthenol 250mg/ml",
    en: { tag: "Deep hydration and cellular renewal", desc: "Deep skin hydration, cellular repair, calming of irritation, and restoration of natural radiance." },
    ar: { tag: "ترطيب عميق وتجديد الخلايا", desc: "ترطيب عميق للبشرة، إصلاح الخلايا، تهدئة التهيجات، واستعادة الإشراق الطبيعي." } },
  { slug: "myers-cocktail", tier: "Signature", min: 45, price: 210000, name: "Myer's Cocktail",
    formula: "Vitamin C 1000mg · B1, B2, B3, B6, B12 · Magnesium 200mg · Calcium 100mg · Zinc 10mg · NAD+ 100mg",
    en: { tag: "The original multi-nutrient wellness infusion", desc: "A comprehensive session supporting energy, immunity, and nerves — reducing stress and fatigue while improving overall health." },
    ar: { tag: "التركيبة الغذائية الأصلية متعددة العناصر", desc: "جلسة شاملة لدعم الطاقة والمناعة والأعصاب، تقليل التوتر والإجهاد، وتحسين الصحة العامة." } },
  { slug: "dopamin-booster", tier: "Performance", min: 45, price: 195000, name: "Dopamin Booster",
    formula: "Citicoline 250mg / 5ml",
    en: { tag: "Sharper focus, memory, and mental performance", desc: "Enhances memory, increases focus and attention, improves mental performance, and supports nerve cells." },
    ar: { tag: "تركيز وذاكرة وأداء ذهني", desc: "يعزّز الذاكرة، يزيد التركيز والانتباه، يحسّن الأداء الذهني، ويدعم الخلايا العصبية." } },
  { slug: "skin-radiance", tier: "Beauty", min: 45, price: 225000, name: "Skin Radiance",
    formula: "Glutathione 2.4g · Vitamin C 1000mg",
    en: { tag: "Brighten, even out, and glow", desc: "Brightens and evens skin tone, reduces pigmentation, deeply hydrates, detoxifies the body, and delays signs of ageing." },
    ar: { tag: "تفتيح وتوحيد وإشراقة", desc: "تفتيح وتوحيد لون البشرة، تقليل التصبغات، ترطيب عميق، تنقية الجسم من السموم وتأخير علامات التقدم بالعمر." } },
  { slug: "nad-plus", tier: "Signature", min: 90, price: 285000, name: "NAD+ Drips",
    formula: "NAD+ 500mg in each Invita vial",
    en: { tag: "Cellular energy and anti-ageing", desc: "Instant restoration of cellular energy, sharp mental focus, exceptional clarity, advanced nerve support, and resistance to ageing." },
    ar: { tag: "طاقة خلوية ومكافحة الشيخوخة", desc: "استعادة فورية للطاقة الخلوية، تركيز ذهني حاد، صفاء استثنائي، دعم متقدم للأعصاب، ومقاومة الشيخوخة." } },
  { slug: "weight-loss", tier: "Wellness", min: 45, price: 195000, name: "Weight Loss Drip",
    formula: "L-Carnitine 1000mg · Glutamine 300mg · Arginine 1g",
    en: { tag: "Burn fat and support lean muscle", desc: "Stimulates fat burning, raises energy during dieting, improves physical performance, and supports muscle building." },
    ar: { tag: "حرق الدهون ودعم العضلات", desc: "تحفّز حرق الدهون، ترفع الطاقة أثناء الرجيم، تحسّن الأداء البدني وتدعم بناء العضلات." } },
  { slug: "fertility-libido", tier: "Signature", min: 45, price: 240000, name: "Fertility & Libido",
    formula: "Glutathione 1.2g · L-Carnitine 1000mg · MIC (Methionine – Inositol – Choline)",
    en: { tag: "Fertility, hormonal balance, and vitality", desc: "Supports fertility for men and women, improves hormonal balance, and boosts sexual energy and overall vitality." },
    ar: { tag: "خصوبة وتوازن هرموني وحيوية", desc: "دعم الخصوبة للرجال والنساء، تحسين التوازن الهرموني، وتعزيز الطاقة الجنسية والحيوية العامة." } },
  { slug: "cola-drip-iron", tier: "Wellness", min: 30, price: 180000, name: "Cola Drip (Iron)",
    formula: "Iron Sucrose 200mg / 10ml",
    en: { tag: "Treat anaemia and raise haemoglobin", desc: "Treats anaemia, raises haemoglobin, reduces dizziness and fatigue, and improves activity and energy." },
    ar: { tag: "علاج فقر الدم ورفع الهيموغلوبين", desc: "علاج فقر الدم، رفع الهيموغلوبين، تقليل الدوخة والتعب، وتحسين النشاط والطاقة." } },
  { slug: "jet-fuel", tier: "Performance", min: 45, price: 175000, name: "Jet Fuel",
    formula: "B12 1000mcg · B2 25mg · B3 200mg · B6 250mg · Magnesium 250mg · Vitamin C 500mg",
    en: { tag: "Power and endurance for body and mind", desc: "Boosts physical and mental energy, raises stamina, and relieves exhaustion — ideal for athletes and those with demanding workloads." },
    ar: { tag: "قوة وتحمّل للجسم والذهن", desc: "تعزيز الطاقة البدنية والذهنية، رفع القدرة على التحمّل وتخفيف الإرهاق — مثالية للرياضيين وأصحاب الأعمال المجهدة." } },
  { slug: "edta-chelation", tier: "Signature", min: 90, price: 240000, name: "EDTA Chelation",
    formula: "EDTA 150mg/ml",
    en: { tag: "Vascular detox and heart health", desc: "Cleanses blood vessels, removes toxic heavy metals, and supports heart and circulatory health." },
    ar: { tag: "ديتوكس الأوعية وصحة القلب", desc: "تنقية الأوعية الدموية، إزالة المعادن السامة، ودعم صحة القلب والدورة الدموية." } },
];

export const TIERS: DripTier[] = ["Signature", "Wellness", "Performance", "Beauty"];

/** Design slugs that live under a different slug in the site catalogue. */
const CATALOG_SLUG: Record<string, string> = { "weight-loss": "weight-management" };

/** Detail page for a drip — falls back to the menu when the catalogue has no page yet. */
export function dripHref(slug: string): string {
  const catalogSlug = CATALOG_SLUG[slug] ?? slug;
  return getLiquividaDrip(catalogSlug) ? `/iv-therapy/${catalogSlug}` : "/iv-therapy";
}

/**
 * Square post art per drip (studio infographics, each checked by eye against its drip).
 * Kept local to Home so the menu is right regardless of the shared catalogue map;
 * keep in step with DRIP_INFOGRAPHIC_IDS in content-curation.ts.
 * The design's 9:16 story art isn't in the repo yet; these are the matching square posts.
 */
const DRIP_POST: Record<string, string> = {
  "energy-boost": "iv-09",
  "immune-boost": "iv-10",
  "hair-skin-nails": "iv-11",
  "panthenol-b5": "iv-12",
  "myers-cocktail": "iv-13",
  "fertility-libido": "iv-14",
  "cola-drip-iron": "iv-15",
  "jet-fuel": "iv-16",
  "edta-chelation": "iv-17",
  "dopamin-booster": "iv-18",
  "nad-plus": "iv-08",
};
/** Posts that live in the clinic folder rather than the infographics set. */
const DRIP_POST_PATH: Record<string, string> = {
  "skin-radiance": "/images/invita/clinic/photo-2026-04-22-21-08-56-2.webp",
};

/** Card art — the drip's post, otherwise its catalogue illustration (contained). */
export function dripArt(slug: string): { src: string; contain: boolean } {
  const post = DRIP_POST[slug];
  if (post) return { src: `/images/invita/infographics/${post}.webp`, contain: false };
  if (DRIP_POST_PATH[slug]) return { src: DRIP_POST_PATH[slug], contain: false };
  const catalogSlug = CATALOG_SLUG[slug] ?? slug;
  const drip = getLiquividaDrip(catalogSlug);
  return { src: getProtocolDripImage(catalogSlug, drip?.imageSlug) ?? DRIP_IMAGE_FALLBACK, contain: true };
}

export const GOALS: { id: "energy" | "immunity" | "beauty" | "focus" | "longevity" | "detox"; drips: string[] }[] = [
  { id: "energy", drips: ["energy-boost", "jet-fuel", "nad-plus"] },
  { id: "immunity", drips: ["immune-boost", "myers-cocktail", "cola-drip-iron"] },
  { id: "beauty", drips: ["skin-radiance", "hair-skin-nails", "panthenol-b5"] },
  { id: "focus", drips: ["dopamin-booster", "nad-plus", "jet-fuel"] },
  { id: "longevity", drips: ["nad-plus", "edta-chelation", "myers-cocktail"] },
  { id: "detox", drips: ["edta-chelation", "skin-radiance", "weight-loss"] },
];

export const CELEBS = [
  { img: "mona-kattan", name: "Mona Kattan", handle: "@monakattan" },
  { img: "mohamed-ramadan", name: "Mohamed Ramadan", handle: "@mohamedramadanws" },
  { img: "taim-al-falasi", name: "Taim AlFalasi", handle: "@taimalfalasi" },
  { img: "rita-kahawaty", name: "Rita Kahawaty", handle: "@ritakahawaty" },
  { img: "saoud-alkaabi", name: "Saoud Alkaabi", handle: "@saoudalkaabi" },
  { img: "diana-ganeeva", name: "Diana Ganeeva", handle: "@diana.dxb" },
  { img: "zoya-sakr", name: "Zoya Sakr", handle: "@zoyasakr" },
  { img: "heba-saad", name: "Heba Saad", handle: "@habah_saad" },
  { img: "dalia-el-ali", name: "Dalia El Ali", handle: "@deebydalia" },
  { img: "aliyah-raey", name: "Aliyah Raey", handle: "@aliyahraey" },
  { img: "lamiya-slimani", name: "Lamiya Slimani", handle: "@lamiyaslimani" },
  { img: "aseel", name: "Aseel", handle: "@aseel" },
  { img: "leen-jadan", name: "Leen Jadan", handle: "@leenjadan" },
  { img: "ahmed-twistedcurlz", name: "Ahmed", handle: "@twistedcurlz" },
  { img: "asallah-kamel", name: "Asallah Kamel", handle: "@asallahkamel" },
].map((c) => ({ ...c, img: `/images/celebrities/${c.img}.webp` }));

export const DOCTOR_PHOTOS = [
  "12-56-23", "12-56-23-2", "12-56-24", "12-56-24-2", "12-56-25", "12-56-25-2",
  "12-56-25-3", "12-56-25-4", "12-58-18", "12-58-19-2", "12-58-19-4", "12-58-20",
  "12-58-20-2", "12-58-20-3", "12-58-20-4",
].map((s) => `/images/invita/clinic/photo-2026-05-20-${s}.webp`);

/** The four doctor reels (uploads/AQ*.mp4 in the design) — same order as the design. */
export const DOCTOR_REELS = ["reel-05", "reel-01", "reel-04", "reel-03"].map((id) => ({
  src: `/media/reels/${id}.mp4`,
  poster: `/media/reels/posters/${id}.webp`,
}));

/** Instagram grid — the design's five posts, using the studio versions in the repo. */
export const IG_POSTS = [
  { id: "iv-09", name: "Energy Boost" },
  { id: "skin-radiance", name: "Skin Radiance", src: "/images/invita/clinic/photo-2026-04-22-21-08-56-2.webp" },
  { id: "iv-08", name: "NAD+" },
  { id: "iv-10", name: "Immune Boost" },
  { id: "iv-13", name: "Myer's Cocktail" },
].map((p: { id: string; name: string; src?: string }) => ({ ...p, src: p.src ?? `/images/invita/infographics/${p.id}.webp` }));

export const BRAND = {
  mark: "/images/invita/brand/logo-mark-navy.png",
  markGold: "/images/invita/brand/logo-mark-gold.png",
  wordmark: "/images/invita/brand/logo-wordmark-navy.png",
  hero: "/images/invita/hero.webp",
  suite: "/images/invita/hero.webp",
  iso13485: "/resources/iso-13485.pdf",
  iso14001: "/resources/iso-14001.pdf",
} as const;
