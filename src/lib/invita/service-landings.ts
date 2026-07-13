export type ServiceFaqItem = { q: string; a: string };

export type ServiceStep = { title: string; body: string };

export type ServiceTestimonial = { quote: string; author: string };

export type RelatedService = {
  title: string;
  description: string;
  href: string;
  benefits: string[];
};

export type ServiceLanding = {
  slug: string;
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    image?: string;
    imageAlt?: string;
  };
  overview: {
    heading: string;
    body: string;
    benefits: string[];
  };
  expectations: {
    heading: string;
    duration: string;
    frequency: string;
    experienceTitle: string;
    experienceBody: string;
  };
  howItWorks: {
    heading: string;
    body: string;
    quote?: { text: string; author: string };
  };
  steps?: ServiceStep[];
  faq: ServiceFaqItem[];
  testimonials: ServiceTestimonial[];
  relatedServices: RelatedService[];
};

export const IV_THERAPY_LANDING: ServiceLanding = {
  slug: "iv-therapy",
  metadata: {
    title: "IV Drip Therapy",
    description:
      "Medical-grade IV vitamin therapy in Baghdad — Liquivida® USA formulas with 100% bioavailability and clinician-guided protocols.",
  },
  hero: {
    eyebrow: "Core therapy · Liquivida® USA",
    title: "IV Drip Therapy",
    lead:
      "Relax for 45–90 minutes with a safe, effective intravenous infusion of essential vitamins, minerals, electrolytes, and amino acids — delivered directly into your bloodstream.",
    ctaLabel: "Start Your Consultation",
    ctaHref: "/book",
    secondaryCtaLabel: "Browse IV Drip Menu",
    secondaryCtaHref: "/iv-drip-menu",
    image: "/images/invita/wellness-lounge.webp",
    imageAlt: "Invita IV therapy lounge",
  },
  overview: {
    heading: "What is IV Drip Therapy?",
    body:
      "IV Drip Therapy delivers fluids and revitalizing nutrients straight to your bloodstream through a vein in your arm. Unlike oral supplements — which may offer limited absorption — intravenous therapy provides near 100% bioavailability because ingredients bypass digestion entirely.",
    benefits: [
      "Increased hydration",
      "Boosted immunity",
      "Replenished nutrients",
      "Improved performance",
      "Improved energy",
    ],
  },
  expectations: {
    heading: "What to Expect During Your IV Drip Session",
    duration: "45–90 minutes",
    frequency: "Recommendations vary based on your goals and protocol",
    experienceTitle: "The IV Drip Therapy Experience",
    experienceBody:
      "Every Invita session begins with a complimentary wellness consultation. A medical professional reviews your health history and goals, then recommends the right Liquivida® protocol. A trained infusion specialist administers your drip as you relax in a private suite — read, listen to music, or simply unwind. Most clients feel rejuvenated during or shortly after their session.",
  },
  howItWorks: {
    heading: "How Does IV Drip Therapy Work?",
    body:
      "The fluids help your body hydrate more efficiently than drinking water alone, while potent vitamins and minerals support energy, mood, metabolism, and immunity. Invita is Baghdad's official Liquivida® USA distributor — every formula is GMP-certified and administered under clinical oversight.",
    quote: {
      text: "Tailored IV therapies deliver maximum absorption by delivering essential vitamins, minerals, and nutrients directly into the bloodstream — supporting your body's unique needs for peak performance and optimal health.",
      author: "Invita Medical Team",
    },
  },
  faq: [
    {
      q: "What IV drips do you offer?",
      a: "We offer eleven Liquivida® catalogue protocols — from Energy Boost and Immune Boost to NAD+, Myers Cocktail, and Skin Radiance. Browse the full IV Drip Menu or work with our clinicians to select the right formula.",
    },
    {
      q: "What is IV therapy?",
      a: "IV is short for intravenous — administering saline, vitamin infusions, or nutrients directly into your bloodstream for maximum absorption using a small catheter inserted into a vein.",
    },
    {
      q: "How much does IV Drip Therapy cost?",
      a: "Pricing varies by protocol. Each drip page lists indicative IQD pricing; your clinician confirms the final protocol and cost during your complimentary consultation.",
    },
    {
      q: "Is IV Drip Therapy safe?",
      a: "For healthy adults, intravenous therapy is generally considered safe when administered by trained professionals. Share your full medical history during consultation so we can tailor protocols appropriately.",
    },
    {
      q: "When should I get IV Drip Therapy?",
      a: "Clients schedule IV drips before travel, after intense training, during flu season, before events, or as part of ongoing wellness maintenance. Our wellness matcher can help you find a starting point.",
    },
  ],
  testimonials: [
    {
      quote:
        "The consultation was so professional — everything was tailored to exactly what my body needed. I felt noticeably better after just one session.",
      author: "Client, Baghdad",
    },
    {
      quote:
        "I've been to IV clinics abroad and was thrilled to finally have this level of quality right here in Baghdad. Genuinely impressive.",
      author: "Client, Baghdad",
    },
  ],
  relatedServices: [
    {
      title: "NAD+ IV Therapy",
      description: "Cellular rejuvenation and cognitive enhancement at the mitochondrial level.",
      href: "/nad-plus",
      benefits: ["Boosted cellular energy", "Enhanced metabolism", "Improved cognition"],
    },
    {
      title: "IV Drip Menu",
      description: "Eleven catalogue formulas — each begins with a private medical consultation.",
      href: "/iv-drip-menu",
      benefits: ["Signature protocols", "Performance & beauty tiers", "Wellness matcher"],
    },
  ],
};

export const NAD_PLUS_LANDING: ServiceLanding = {
  slug: "nad-plus",
  metadata: {
    title: "NAD+ IV Drip Therapy",
    description:
      "NAD+ IV therapy in Baghdad — 750 mg Liquivida® protocols for cellular repair, energy, and longevity. Clinician-guided loading and maintenance phases.",
  },
  hero: {
    eyebrow: "Signature protocol · Cellular medicine",
    title: "NAD+ IV Drip Therapy",
    lead:
      "Jump-start cellular repair, revitalize your energy, and support optimal rejuvenation with clinician-titrated NAD+ infusions.",
    ctaLabel: "Book NAD+ Consultation",
    ctaHref: "/book?drip=nad-plus",
    secondaryCtaLabel: "Explore the science",
    secondaryCtaHref: "/science",
    image: "/images/invita/infographics/iv-07.webp",
    imageAlt: "NAD+ clinical infographic",
  },
  overview: {
    heading: "What is NAD+ IV Drip Therapy?",
    body:
      "NAD+ (nicotinamide adenine dinucleotide) is a crucial coenzyme naturally present in every cell. Levels decline with age, impacting metabolism, DNA repair, and cellular stress response. Flooding the body with NAD+ via IV can kickstart repair mechanisms through mitophagy — rejuvenating mitochondria, the cell's powerhouses for ATP energy.",
    benefits: [
      "Increased anti-aging intervention",
      "Boosted ATP for energy",
      "Reduced pain and inflammation",
      "Enhanced metabolism",
      "Improved cognition and mood",
    ],
  },
  expectations: {
    heading: "What to Expect During Your NAD+ Session",
    duration: "~90 minutes (750 mg, clinician-titrated)",
    frequency: "Loading phase over 4–6 sessions, then monthly maintenance",
    experienceTitle: "The NAD+ IV Drip Experience",
    experienceBody:
      "Arrive for your complimentary consultation to discuss health history and wellness goals. A medical professional reviews your vitals, then administers NAD+ slowly over approximately 90 minutes for comfort. We recommend fasting 4–6 hours beforehand (water only) and avoiding alcohol during loading phases. A cleansing hydration drip may follow your NAD+ infusion.",
  },
  howItWorks: {
    heading: "How Does NAD+ IV Drip Therapy Work?",
    body:
      "Human tissue data shows 40–60% NAD+ decline between ages 30–70. Injecting NAD+ directly into the bloodstream ensures absorption that oral supplementation cannot match. Invita administers official Liquivida® USA NAD+ at 750 mg with clinician titration — the same network trusted across America.",
    quote: {
      text: "NAD+ IV Drip Therapy is designed to boost cellular health, enhance energy levels, and improve cognitive function — helping clients achieve peak performance, accelerate recovery, and promote long-term wellness.",
      author: "Invita Medical Team",
    },
  },
  steps: [
    {
      title: "Loading dose",
      body: "Optional intensive phase — 4–6 sessions within 7 days to reset cellular baseline health.",
    },
    {
      title: "Maintenance dose",
      body: "Monthly NAD+ sessions to sustain elevated cellular NAD+ levels and ongoing benefits.",
    },
    {
      title: "Clinical titration",
      body: "Infusion rate adjusted by your clinician for comfort — slower administration reduces flushing sensations.",
    },
  ],
  faq: [
    {
      q: "What is the goal of NAD+ IV Drip Therapy?",
      a: "The main goal is to help the body clear damaged cellular components and reset the baseline of cellular health. Loading doses establish a foundation; maintenance sessions sustain benefits.",
    },
    {
      q: "Who benefits from NAD+ IV Drip Therapy?",
      a: "Healthy adults seeking energy, cognitive support, metabolic optimization, or aesthetic and surgical recovery may benefit. Your clinician assesses suitability during consultation.",
    },
    {
      q: "What happens when NAD+ levels are low?",
      a: "Declining NAD+ can reduce DNA repair, stress response, and energy metabolism. IV repletion may help address age-related fatigue and support healthy metabolic functioning.",
    },
    {
      q: "How can I enhance my NAD+ results?",
      a: "Pair NAD+ with complementary IV protocols, adequate sleep, and our Weight Management drip as an adjunct to active lifestyle programs. Explore the Science Hub for peer-reviewed context.",
    },
  ],
  testimonials: [
    {
      quote:
        "NAD has changed my mood and overall energy. The team made the long infusion comfortable and professional throughout.",
      author: "Client, Baghdad",
    },
    {
      quote:
        "Presented to our surgical committee — the cellular science is compelling. Invita's protocol feels world-class.",
      author: "Healthcare partner, Baghdad",
    },
  ],
  relatedServices: [
    {
      title: "IV Drip Therapy",
      description: "Foundation intravenous wellness — hydration, immunity, and performance.",
      href: "/iv-therapy",
      benefits: ["100% bioavailability", "11 catalogue formulas", "Private consultation"],
    },
    {
      title: "Science Hub",
      description: "Peer-reviewed NAD+ research, safety protocols, and downloadable resources.",
      href: "/science",
      benefits: ["NAD+ deep dive", "Clinical studies", "Safety 101"],
    },
  ],
};

export const GLP1_LANDING: ServiceLanding = {
  slug: "glp-1",
  metadata: {
    title: "GLP-1 Weight Management",
    description:
      "Personalized GLP-1 weight management in Baghdad — clinical consultation, metabolic support, and science-backed IV adjunct therapies at Invita.",
  },
  hero: {
    eyebrow: "Medical services · Weight management",
    title: "GLP-1 Weight Management Plans",
    lead:
      "Evidence-based, personalized weight management combining clinical guidance, metabolic assessment, and supportive IV therapies — tailored to your health data and goals.",
    ctaLabel: "Book GLP-1 Consultation",
    ctaHref: "/contact?source=glp1-consultation",
    secondaryCtaLabel: "IV Weight Management",
    secondaryCtaHref: "/iv-therapy/weight-management",
    image: "/images/invita/product-still-life.webp",
    imageAlt: "Invita clinical wellness",
  },
  overview: {
    heading: "GLP-1 Plans, Backed by Science",
    body:
      "GLP-1 receptor agonists — including semaglutide and tirzepatide — have demonstrated significant weight reduction in clinical trials when combined with lifestyle intervention. Invita provides a clinician-guided pathway: consultation, eligibility assessment, personalized planning, and supportive IV metabolic protocols.",
    benefits: [
      "Better regulates appetite",
      "Increased feelings of fullness",
      "Lose weight while retaining muscle",
      "Clinician-guided dosing",
      "IV metabolic support available",
    ],
  },
  expectations: {
    heading: "How Our Personalized Plan Works",
    duration: "30-minute initial consultation",
    frequency: "Ongoing telehealth follow-ups as clinically indicated",
    experienceTitle: "Your Weight Management Journey",
    experienceBody:
      "Begin with a consultation to review medication options, health history, and eligibility. A clinician creates your personalized plan — including how to receive treatment and which supportive therapies may accelerate results. Invita's Weight Management IV drip serves as a metabolic adjunct alongside diet and exercise, preserving lean muscle during active programs.",
  },
  howItWorks: {
    heading: "Why Choose Invita for Weight Management?",
    body:
      "We combine prescription treatment pathways (where clinically eligible) with comprehensive diagnostics, IV metabolic support, and ongoing nurse-led care. Body composition and metabolic health tracking help ensure sustainable, healthy results — not just scale weight.",
    quote: {
      text: "Our approach ensures clients achieve healthy, sustainable results by tracking fat loss and preserving muscle — with ongoing clinical care that transforms lives.",
      author: "Invita Medical Team",
    },
  },
  steps: [
    {
      title: "Start with a consultation",
      body: "Learn about options, review eligibility criteria, and receive a personalized plan.",
    },
    {
      title: "Access telehealth visits",
      body: "Ongoing clinician visits to discuss progress and adjust your protocol.",
    },
    {
      title: "Begin treatment & stay on track",
      body: "In-clinic administration or coordinated pickup — plus IV metabolic support.",
    },
  ],
  faq: [
    {
      q: "Who should consider GLP-1 weight management?",
      a: "Adults with obesity or overweight with weight-related conditions may benefit. Eligibility is determined by a clinician based on health history, BMI, and individual risk factors.",
    },
    {
      q: "How do I qualify?",
      a: "Qualification begins with a licensed clinician consultation. BMI and health data inform eligibility; not all candidates will qualify for medication.",
    },
    {
      q: "What if I don't qualify for GLP-1 medications?",
      a: "We create alternative wellness plans featuring science-backed IV therapies, lifestyle coaching, and our Weight Management drip as metabolic support.",
    },
    {
      q: "How much weight can I expect to lose?",
      a: "Clinical trials show average body-weight reductions of ~15% with semaglutide over 68 weeks. Individual results vary — physiology, adherence, and lifestyle all matter.",
    },
    {
      q: "How can I maximize results?",
      a: "Combine medication (where prescribed) with nutritious diet, regular activity, quality sleep, and Invita's IV Weight Management protocol for metabolic support.",
    },
  ],
  testimonials: [
    {
      quote:
        "The consultation was the perfect opportunity to ask questions one-on-one. They understood my goals and built a plan I could actually follow.",
      author: "Client, Baghdad",
    },
    {
      quote:
        "Pairing the IV metabolic drip with my program made a noticeable difference in energy and recovery between sessions.",
      author: "Client, Baghdad",
    },
  ],
  relatedServices: [
    {
      title: "Weight Management IV",
      description: "Metabolic support drip — adjunct to active weight-loss programs.",
      href: "/iv-therapy/weight-management",
      benefits: ["Metabolic optimisation", "Lean muscle support", "Clinician-guided"],
    },
    {
      title: "IV Drip Therapy",
      description: "Hydration, immunity, and performance protocols to support your journey.",
      href: "/iv-therapy",
      benefits: ["Energy & recovery", "Immune support", "Private suites"],
    },
  ],
};

export function getServiceLanding(slug: string): ServiceLanding | undefined {
  const landings = [IV_THERAPY_LANDING, NAD_PLUS_LANDING, GLP1_LANDING];
  return landings.find((l) => l.slug === slug);
}
