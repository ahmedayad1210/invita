export type LiquividaDrip = {
  slug: string;
  /** Maps to category icon in elixir-drip-images.json */
  imageSlug: string;
  name: string;
  tagline: string;
  tier: "Signature" | "Wellness" | "Performance" | "Beauty";
  description: string;
};

export const LIQUIVIDA = {
  name: "Liquivida®",
  tagline: "USA's #1 IV Therapy Network",
  website: "https://www.liquivida.com",
  badgeEn: "Powered by Liquivida® — USA's #1 IV Therapy Network",
  badgeAr: "بدعم من Liquivida® — شبكة العلاج الوريدي الأولى في أمريكا",
  distributorEn: "Official Distributor · Liquivida® USA",
  distributorAr: "موزّع رسمي · Liquivida® USA",
} as const;

/** Invita catalogue — 11 GMP-certified Liquivida® protocols (Safety 101 / product catalogue). */
export const LIQUIVIDA_DRIPS: LiquividaDrip[] = [
  {
    slug: "energy-boost",
    imageSlug: "the-recharger",
    name: "Energy Boost",
    tagline: "Combat fatigue, burnout, and low vitality",
    tier: "Wellness",
    description:
      "Designed for patients who feel run-down — busy professionals, parents, or those recovering from illness. Weekly sessions for 4–6 weeks, then monthly maintenance.",
  },
  {
    slug: "jet-fuel",
    imageSlug: "life-drip",
    name: "Jet Fuel",
    tagline: "Advanced fuel for body and brain",
    tier: "Performance",
    description:
      "Mental and physical performance enhancement for athletes pre-event, jet lag recovery, exam prep, or demanding work sprints. Sustained focus and stamina.",
  },
  {
    slug: "immune-boost",
    imageSlug: "immune-booster",
    name: "Immune Boost",
    tagline: "Fortify defences during flu season and illness",
    tier: "Wellness",
    description:
      "High-dose vitamin C immune support at the first sign of a cold, or prophylactically during winter. Quick ~30-minute infusion for rapid reinforcement.",
  },
  {
    slug: "sport-endurance-recovery",
    imageSlug: "fitness-recovery",
    name: "Sport Endurance & Recovery",
    tagline: "Train harder. Recover faster.",
    tier: "Performance",
    description:
      "For athletes and active individuals — rehydrate, replenish nutrients, and reduce muscle soreness after competition or heavy training.",
  },
  {
    slug: "skin-radiance",
    imageSlug: "radiance",
    name: "Skin Radiance",
    tagline: "Glow from within for events and dull skin",
    tier: "Beauty",
    description:
      "Improves complexion and tone — popular before weddings and photoshoots. Often paired with dermatology treatments for holistic skin results.",
  },
  {
    slug: "hair-skin-nails",
    imageSlug: "hair-skin-nails",
    name: "Hair, Skin & Nails",
    tagline: "Biotin boost for beauty from within",
    tier: "Beauty",
    description:
      "Targets hair thickness, nail strength, and skin health — ideal for postpartum shedding or brittle nails. Weekly or biweekly for 4–6 sessions.",
  },
  {
    slug: "nad-plus",
    imageSlug: "anti-aging",
    name: "NAD+",
    tagline: "Cellular rejuvenation and cognitive enhancement",
    tier: "Signature",
    description:
      "750 mg NAD+ infused slowly over ~90 minutes for anti-aging and cellular repair. Multi-week protocols available — titrated for comfort by our clinicians.",
  },
  {
    slug: "weight-management",
    imageSlug: "diet-detox",
    name: "Weight Management",
    tagline: "Metabolic support for active weight-loss programs",
    tier: "Wellness",
    description:
      "Adjunct to diet and exercise — optimises metabolism and preserves lean muscle. Not a stand-alone weight-loss solution; clinician-guided alongside your plan.",
  },
  {
    slug: "vitamin-d3-boost",
    imageSlug: "hydration",
    name: "Vitamin D3 Boost",
    tagline: "Rapid correction of vitamin D deficiency",
    tier: "Wellness",
    description:
      "D3 + calcium infusion for bone health — one session can raise vitamin D levels for several months. Ideal when oral supplementation is insufficient.",
  },
  {
    slug: "myers-cocktail",
    imageSlug: "vip-signature",
    name: "Myers Cocktail",
    tagline: "The original multi-nutrient wellness infusion",
    tier: "Signature",
    description:
      "Broad-spectrum protocol for chronic fatigue, fibromyalgia, migraines, muscle spasms, allergies, and general wellness. Monthly or bi-monthly maintenance.",
  },
  {
    slug: "glutathione-detox",
    imageSlug: "liver-cleanse",
    name: "Glutathione Detox",
    tagline: "Master antioxidant for detox and liver support",
    tier: "Wellness",
    description:
      "Glutathione-rich infusion for detoxification and oxidative stress. Prepared in amber bags with light-protected handling per Invita Safety 101 protocols.",
  },
];

export function getLiquividaDrip(slug: string): LiquividaDrip | undefined {
  return LIQUIVIDA_DRIPS.find((d) => d.slug === slug);
}

export const VALUE_PROPS = [
  { title: "100% Absorption", body: "Oral supplements deliver only 10–30% of their nutrients. IV therapy delivers directly into the bloodstream — 100% absorbed, zero digestive loss." },
  { title: "Liquivida® USA Formulas", body: "Every drip we administer is a clinically developed Liquivida® formula — the same trusted protocols used across the United States, now available in Baghdad." },
  { title: "Medical Grade & Safe", body: "All treatments are prescribed by a qualified medical professional following a comprehensive health consultation, using pharmaceutical-grade ingredients." },
  { title: "Free Wellness Consult", body: "Every client receives a complimentary wellness assessment with one of our medical professionals before any treatment is recommended." },
] as const;

export const ADD_ONS = [
  { name: "Oxygen Bar", description: "Boost oxygen levels and choose your scent: Lavender, Peppermint, or Oud. 20 minutes of pure rejuvenation." },
  { name: "Head, Neck & Shoulder Massage", description: "Release built-up tension while your nutrients absorb. Stimulates blood flow and triggers natural endorphin release." },
  { name: "Foot Reflexology", description: "Targeted pressure point massage for deep relaxation and stress relief." },
  { name: "Athletic Recovery Program", description: "Designed for athletes: supports muscle repair, boosts immunity, oxygenates cells, and enhances performance." },
  { name: "Mini Facial", description: "30 minutes of cleansing, exfoliating, and moisturising while your drip does its work." },
] as const;

export const USE_CASES = [
  "Memory & Focus", "Energy Boost", "Immune Support", "Detoxification", "Chronic Fatigue",
  "Blood Pressure", "Anxiety", "Muscle Recovery", "Libido", "Thyroid & Adrenal Health",
  "Menopause", "Post-travel Recovery", "Metabolism", "Athletic Performance", "Skin & Radiance",
  "Hangover Recovery", "Sleep Improvement", "Anti-Aging",
] as const;

export const FAQ_ITEMS = [
  { q: "Is IV Drip Therapy safe?", a: "Yes. All Invita IV protocols are Liquivida® USA formulas developed by board-certified emergency physicians and pharmacists with decades of clinical experience. Every treatment is administered by trained medical professionals. As with any medical therapy, your safety consultation before treatment ensures we select the right protocol for you." },
  { q: "How long does a session take?", a: "A typical IV drip session takes 30–60 minutes. NAD+ protocols run ~90 minutes. This follows a short 15-minute medical consultation where we review your health history and goals." },
  { q: "Do I need IV therapy if I already take vitamins?", a: "When vitamins are taken orally, the gastrointestinal tract limits how much your body can absorb — often just 10–30%. IV therapy delivers nutrients directly into the bloodstream at 100% absorption. If you want to actually feel the difference, IV is the superior method." },
  { q: "How often should I come in?", a: "Your Invita medical professional will recommend a personalised schedule based on your consultation. Some clients benefit from weekly sessions; others come monthly for maintenance." },
  { q: "Does it really work?", a: "The benefits of IV therapy are fast and tangible because nutrients bypass the digestive system and enter your bloodstream immediately. Reported results include: more energy and mental clarity; stronger immunity; faster athletic recovery; better sleep quality; improved mood; healthier skin and complexion; reduced signs of ageing; jetlag and hangover relief." },
  { q: "Who can receive IV therapy?", a: "Most healthy adults are eligible. Our pre-treatment consultation follows medical eligibility criteria to ensure the therapy is appropriate and safe for each individual. Invita's treatments are designed to optimise wellness — not to treat or diagnose medical conditions." },
  { q: "What should I expect when I arrive?", a: "You'll be welcomed by our team, offered refreshments, and settled into a comfortable private space. A medical professional will be with you throughout your entire session and available for any questions before, during, and after." },
] as const;
