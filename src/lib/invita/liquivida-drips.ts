export type LiquividaDrip = {
  slug: string;
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

export const LIQUIVIDA_DRIPS: LiquividaDrip[] = [
  { slug: "vip-signature", name: "VIP Signature Drip", tagline: "Our flagship — the ultimate full-body boost", tier: "Signature", description: "Liquivida® USA's flagship full-body protocol — vitamins, minerals, amino acids, and antioxidants for total wellness." },
  { slug: "anti-aging", name: "Anti-Aging", tagline: "Turn back the clock with powerful antioxidants", tier: "Beauty", description: "Antioxidant-rich infusion designed to combat oxidative stress and support youthful vitality." },
  { slug: "immunity", name: "Immunity", tagline: "Fortify your body's natural defenses", tier: "Wellness", description: "High-dose immune support with vitamin C, zinc, and key nutrients for defence and recovery." },
  { slug: "hair-skin-nails", name: "Hair, Skin & Nails", tagline: "Nourish your beauty from the inside out", tier: "Beauty", description: "Biotin, B-complex, and beauty-focused nutrients for radiant skin, hair, and nails." },
  { slug: "gut-health", name: "Gut Health", tagline: "A healthy gut is the foundation of everything", tier: "Wellness", description: "Supports digestive wellness and nutrient absorption from within." },
  { slug: "fitness-recovery", name: "Fitness & Recovery", tagline: "Train harder. Recover faster.", tier: "Performance", description: "Amino acids and electrolytes for athletic performance and post-workout recovery." },
  { slug: "libido-enhancer", name: "Libido Enhancer", tagline: "Restore vitality and energy", tier: "Wellness", description: "Targeted nutrients to support hormonal balance and vitality." },
  { slug: "motherhood", name: "Motherhood", tagline: "For women planning pregnancy or postpartum recovery", tier: "Wellness", description: "Gentle, clinician-guided support for pre- and post-natal wellness." },
  { slug: "diet-detox", name: "Diet & Detox", tagline: "Flush toxins and reset your system", tier: "Wellness", description: "Detoxification support with glutathione and liver-friendly nutrients." },
  { slug: "the-recharger", name: "The Recharger", tagline: "Support your thyroid and adrenal glands", tier: "Wellness", description: "Adrenal and thyroid support for sustained energy and stress resilience." },
  { slug: "menopause-support", name: "Menopause Support", tagline: "Ease pre- and post-menopause symptoms", tier: "Wellness", description: "Nutrient protocol designed to ease menopause-related discomfort." },
  { slug: "radiance", name: "Radiance", tagline: "Glow from the inside out", tier: "Beauty", description: "Our most popular beauty drip — clients report visible glow within hours." },
  { slug: "hydration", name: "Hydration", tagline: "Replenish, rehydrate, restore", tier: "Wellness", description: "Electrolyte and fluid replacement for deep rehydration." },
  { slug: "mood-enhancer", name: "Mood Enhancer", tagline: "Lift your mood, naturally", tier: "Wellness", description: "B-vitamins and mood-supporting nutrients for mental clarity and calm." },
  { slug: "immune-booster", name: "Immune Booster", tagline: "Fast-acting Vitamin C shield", tier: "Wellness", description: "High-dose vitamin C for rapid immune reinforcement." },
  { slug: "liver-cleanse", name: "Liver Cleanse", tagline: "Support your liver, protect your health", tier: "Wellness", description: "Liver-supportive nutrients for detox and metabolic health." },
  { slug: "antioxidant", name: "Antioxidant", tagline: "Combat oxidative stress and free radicals", tier: "Beauty", description: "Powerful antioxidant blend to neutralise free radicals." },
  { slug: "life-drip", name: "Life Drip", tagline: "Energy, clarity, and balance — in one infusion", tier: "Signature", description: "Balanced energy and mental clarity in a single comprehensive infusion." },
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
  { q: "How long does a session take?", a: "A typical IV drip session takes 30–60 minutes. This follows a short 15-minute medical consultation where we review your health history and goals." },
  { q: "Do I need IV therapy if I already take vitamins?", a: "When vitamins are taken orally, the gastrointestinal tract limits how much your body can absorb — often just 10–30%. IV therapy delivers nutrients directly into the bloodstream at 100% absorption. If you want to actually feel the difference, IV is the superior method." },
  { q: "How often should I come in?", a: "Your Invita medical professional will recommend a personalised schedule based on your consultation. Some clients benefit from weekly sessions; others come monthly for maintenance." },
  { q: "Does it really work?", a: "The benefits of IV therapy are fast and tangible because nutrients bypass the digestive system and enter your bloodstream immediately. Reported results include: more energy and mental clarity; stronger immunity; faster athletic recovery; better sleep quality; improved mood; healthier skin and complexion; reduced signs of ageing; jetlag and hangover relief." },
  { q: "Who can receive IV therapy?", a: "Most healthy adults are eligible. Our pre-treatment consultation follows medical eligibility criteria to ensure the therapy is appropriate and safe for each individual. Invita's treatments are designed to optimise wellness — not to treat or diagnose medical conditions." },
  { q: "What should I expect when I arrive?", a: "You'll be welcomed by our team, offered refreshments, and settled into a comfortable private space. A medical professional will be with you throughout your entire session and available for any questions before, during, and after." },
] as const;
