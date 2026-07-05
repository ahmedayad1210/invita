// Invita — brand constants, seed data, navigation

import { LIQUIVIDA_DRIPS } from "./invita/liquivida-drips";

export const INVITA = {
  name: "Invita",
  tagline: "Iraq's Leading IV Therapy Company",
  taglineAr: "شركة العلاج الوريدي الرائدة في العراق",
  email: "hello@invitadrips.com",
  phone: "+964 774 888 5559",
  whatsapp: "https://wa.me/9647748885559",
  address: {
    line1: "Al-Mansour",
    line2: "Private infusion suite",
    city: "Baghdad",
    country: "Iraq",
    full: "Al-Mansour, Baghdad, Iraq",
    fullAr: "المنصور، بغداد، العراق",
  },
  hours: {
    weekdays: "Sunday – Thursday: 9:00 AM – 8:00 PM",
    friday: "Friday: 2:00 PM – 8:00 PM",
    saturday: "Saturday: 10:00 AM – 6:00 PM",
    short: {
      "Sun – Thu": "9:00 AM – 8:00 PM",
      Friday: "2:00 PM – 8:00 PM",
      Saturday: "10:00 AM – 6:00 PM",
    },
  },
  social: {
    instagram: "https://www.instagram.com/invita_iv_drips/",
    instagramDnaLab: "https://www.instagram.com/invitadnalab/",
    linkedin: "https://www.linkedin.com/company/invita-iv-drips",
    facebook: "https://www.facebook.com/530512886819723",
  },
  map: {
    embedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=44.32%2C33.30%2C44.42%2C33.36&layer=mapnik&marker=33.33%2C44.37",
    lat: 33.33,
    lng: 44.37,
  },
} as const;

/** @deprecated Use INVITA — kept for gradual migration */
export const SALON = INVITA;

export const BOOKING = {
  slotDurationMinutes: 30,
  firstSlot: "09:00",
  lastSlot: "19:30",
  sundayFirstSlot: "09:00",
  sundayLastSlot: "19:30",
  status: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
  } as const,
  closedDays: [] as number[],
} as const;

export const SERVICE_CATEGORIES = [
  { id: "iv-therapy", label: "IV Therapy", labelAr: "المغذيات الوريدية", icon: "◆" },
  { id: "dna", label: "DNA Lab", labelAr: "مختبر الحمض النووي", icon: "◇" },
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]["id"];

export const SEED_SERVICES = LIQUIVIDA_DRIPS.map((drip, index) => ({
  name: drip.name,
  category: "iv-therapy" as const,
  duration: 45,
  price: 150000 + index * 15000,
  description: drip.description,
  active: true,
}));

export const SEED_STYLISTS = [
  {
    name: "Dr. Sara Al-Rawi",
    bio: "Medical director. Board-certified with twelve years in integrative medicine and IV therapeutics.",
    specialties: ["IV Protocols", "Clinical Oversight", "Longevity"],
    active: true,
  },
  {
    name: "Dr. Omar Hassani",
    bio: "Genomic medicine specialist. Leads Invita DNA Lab interpretation and personalised wellness plans.",
    specialties: ["DNA Interpretation", "Nutrigenomics", "Pharmacogenomics"],
    active: true,
  },
  {
    name: "Nurse Layla Kareem",
    bio: "Certified infusion specialist. Known for precise, calm, white-glove in-clinic experiences.",
    specialties: ["IV Administration", "At-Home Service", "Recovery Protocols"],
    active: true,
  },
  {
    name: "Nurse Hana Al-Saadi",
    bio: "Advanced practice nurse focused on beauty and immunity protocols.",
    specialties: ["Beauty IV", "Immunity", "Hydration"],
    active: true,
  },
] as const;

export const NAV_LINKS = [
  { label: "IV Drips", labelAr: "المغذيات الوريدية", href: "/iv-therapy" },
  { label: "Network", labelAr: "الشبكة", href: "/healthcare-network" },
  { label: "For Clinics", labelAr: "للعيادات", href: "/for-clinics" },
  { label: "About", labelAr: "من نحن", href: "/about" },
  { label: "FAQ", labelAr: "الأسئلة", href: "/faq" },
] as const;

export const FOOTER_B2B_LINKS = [
  { label: "Healthcare Network", labelAr: "شبكة الرعاية الصحية", href: "/healthcare-network" },
  { label: "For Clinics", labelAr: "للعيادات", href: "/for-clinics" },
  { label: "Become a Partner", labelAr: "كن شريكاً", href: "/for-clinics#partner" },
  { label: "Professional Training", labelAr: "التدريب المهني", href: "/for-clinics#training" },
  { label: "Wholesale", labelAr: "الجملة", href: "/for-clinics#wholesale" },
  { label: "Medical Support", labelAr: "الدعم الطبي", href: "/contact?source=b2b-support" },
  { label: "Request Information", labelAr: "طلب معلومات", href: "/contact?source=b2b-info" },
] as const;

export const FOOTER_ADVANCED_LINKS = [
  { label: "DNA Lab", labelAr: "مختبر الحمض النووي", href: "/dna" },
  { label: "Science & Resources", labelAr: "العلم والمراجع", href: "/science" },
  { label: "Membership", labelAr: "العضوية", href: "/membership" },
] as const;

export const FOOTER_COMPANY_LINKS = [
  { label: "About Invita", labelAr: "من نحن", href: "/about" },
  { label: "Locations", labelAr: "المواقع", href: "/locations" },
  { label: "Contact", labelAr: "تواصل", href: "/contact" },
] as const;

export const FOOTER_TREATMENT_LINKS = [
  { label: "IV Drips", labelAr: "المغذيات الوريدية", href: "/iv-therapy" },
  { label: "Add-Ons", labelAr: "الإضافات", href: "/add-ons" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Client, Baghdad",
    role: "5-star review",
    text: "The IV Radiance drip was unlike anything I've tried before. My skin looked incredible and I felt re-energised from the inside out. The team at Invita made me feel completely at ease from the moment I arrived.",
    rating: 5,
  },
  {
    name: "Client, Baghdad",
    role: "5-star review",
    text: "The consultation was so professional — everything was tailored to exactly what my body needed. The staff checked on me throughout the whole session. I brought a friend and we'll definitely be coming back together.",
    rating: 5,
  },
  {
    name: "Client, Baghdad",
    role: "5-star review",
    text: "I've been to IV clinics abroad and was thrilled to finally have this level of quality right here in Baghdad. The VIP drip gave me energy I hadn't felt in years. Genuinely impressive.",
    rating: 5,
  },
  {
    name: "Client, Baghdad",
    role: "5-star review",
    text: "I was a little nervous for my first IV session but the team made it so comfortable. I felt noticeably better after just one session and immediately signed up for a package.",
    rating: 5,
  },
  {
    name: "Client, Baghdad",
    role: "5-star review",
    text: "Incredible service from the first call to the follow-up message after my appointment. The fact that these are Liquivida USA formulas — the same ones used in America — makes a huge difference. You feel the quality.",
    rating: 5,
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Consult",
    titleAr: "استشارة",
    description:
      "Your session starts with a 15-minute medical consultation. We review your health history, lifestyle, and goals to recommend the right drip protocol.",
    descriptionAr:
      "تبدأ جلستك باستشارة طبية لمدة 15 دقيقة لمراجعة تاريخك الصحي وأهدافك.",
  },
  {
    step: "02",
    title: "Infuse",
    titleAr: "التسريب",
    description:
      "Your customised IV drip is administered by a trained medical professional. You relax comfortably while a precision blend of nutrients enters your bloodstream directly — bypassing the digestive system entirely.",
    descriptionAr:
      "يُعطى المغذي الوريدي المخصص من قبل أخصائي طبي بينما تستريح براحة.",
  },
  {
    step: "03",
    title: "Feel It",
    titleAr: "النتيجة",
    description:
      "Because vitamins and minerals go straight into circulation, results are fast. Most clients feel increased energy, clarity, and wellbeing within hours — not days.",
    descriptionAr:
      "النتائج سريعة — معظم العملاء يشعرون بطاقة ووضوح خلال ساعات.",
  },
] as const;

export const ADMIN = {
  sessionKey: "invita_admin_session",
  sessionDuration: 1000 * 60 * 60 * 8,
} as const;

export const FEATURED_SERVICE_NAMES = [
  "Energy Boost",
  "Immune Boost",
  "Skin Radiance",
  "NAD+",
] as const;

export const GALLERY_IMAGES = [
  { src: "/images/invita/hero.webp", alt: "IV wellness lifestyle" },
  { src: "/images/invita/product-still-life.webp", alt: "Invita IV formulations" },
  { src: "/images/invita/infographics/iv-07.webp", alt: "NAD+ educational infographic" },
  { src: "/images/invita/infographics/iv-10.webp", alt: "Immune Boost infographic" },
  { src: "/images/invita/infographics/iv-12.webp", alt: "Panthenol B5 infographic" },
  { src: "/images/invita/wellness-lounge.webp", alt: "Invita wellness environment" },
] as const;

export const MEMBERSHIP_TIERS = [
  {
    id: "circle",
    name: "Invita Circle",
    nameAr: "دائرة إنفيتا",
    price: "2,400,000 IQD / year",
    perks: [
      "Monthly Immunity Shield IV",
      "Priority concierge booking",
      "15% on DNA panels",
      "At-home nurse visits (2/year)",
    ],
    perksAr: [
      "جلسة Immunity Shield شهرية",
      "أولوية الحجز عبر الكونسيرج",
      "خصم 15% على فحوصات DNA",
      "زيارتان منزليتان سنوياً",
    ],
  },
  {
    id: "longevity",
    name: "Longevity",
    nameAr: "إطالة العمر",
    price: "5,800,000 IQD / year",
    perks: [
      "Everything in Circle",
      "Quarterly NAD+ Performance",
      "Annual Longevity DNA panel",
      "Dedicated clinician line",
    ],
    perksAr: [
      "كل مزايا الدائرة",
      "NAD+ Performance كل ربع سنة",
      "فحص Longevity DNA سنوي",
      "خط مباشر مع الطبيب",
    ],
    featured: true,
  },
] as const;

export const LOCATIONS = [
  {
    id: "mansour-suite",
    name: "Invita Suite — Al-Mansour",
    nameAr: "جناح إنفيتا — المنصور",
    description: "Private infusion suites. By appointment only.",
    descriptionAr: "أجنحة علاج خاصة. بحجز مسبق فقط.",
  },
  {
    id: "at-home",
    name: "At-Home Service",
    nameAr: "الخدمة المنزلية",
    description: "Licensed nurse visits across Baghdad. Premium add-on.",
    descriptionAr: "ممرضة مرخصة في بغداد. خدمة مميزة إضافية.",
  },
] as const;
