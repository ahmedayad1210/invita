/**
 * Invita healthcare network — clinics & medical centers we have worked with.
 * Reference data only; not exclusive partnerships or sponsorships.
 */

import { getClinicPhotoPaths } from "./local-media";
import { CURATED_CLINIC_PHOTO_IDS } from "./content-curation";
import { LIQUIVIDA_DRIPS } from "./liquivida-drips";

const CLINIC_PHOTO_PATHS = getClinicPhotoPaths();
const CURATED_COVER_PATHS = new Set(
  CURATED_CLINIC_PHOTO_IDS.map((id) => `/images/invita/clinic/${id}.webp`)
);

export const CLINIC_SPECIALTIES = [
  "medical-center",
  "dermatology",
  "aesthetic",
  "nutrition",
  "plastic-surgery",
  "general-practice",
  "dental",
  "other",
] as const;

export type ClinicSpecialty = (typeof CLINIC_SPECIALTIES)[number];

export type CooperationStatus = "active" | "ongoing" | "training" | "orders";

export type HealthcareClinic = {
  slug: string;
  name: string;
  nameAr: string;
  specialty: ClinicSpecialty;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  doctorCount: number | null;
  cooperationStatus: CooperationStatus;
  cooperationSince: number;
  aboutEn: string;
  aboutAr: string;
  servicesEn: string[];
  servicesAr: string[];
  productsUsed: string[];
  doctors: { name: string; nameAr: string; title: string; titleAr: string }[];
  map: { lat: number; lng: number };
  website?: string;
  instagram?: string;
  facebook?: string;
  notesEn?: string;
  notesAr?: string;
  /** Show on homepage preview when true (auto-set when uploaded cover exists). */
  featured?: boolean;
  logo: string;
  cover: string;
  gallery: string[];
};

export const NETWORK_STATS = [
  {
    id: "providers",
    displayEn: "100+",
    displayAr: "+100",
    labelEn: "Healthcare Providers",
    labelAr: "مقدّم رعاية صحية",
  },
  {
    id: "centers",
    displayEn: "30+",
    displayAr: "+30",
    labelEn: "Medical Centers",
    labelAr: "مركز طبي",
  },
  {
    id: "patients",
    displayEn: "Thousands",
    displayAr: "آلاف",
    labelEn: "Patients Served",
    labelAr: "مريض تمت خدمتهم",
  },
  {
    id: "network",
    displayEn: "Iraq",
    displayAr: "العراق",
    labelEn: "Growing Network Across Iraq",
    labelAr: "شبكة متنامية في العراق",
  },
] as const;

export const SPECIALTY_LABELS: Record<
  ClinicSpecialty,
  { en: string; ar: string }
> = {
  "medical-center": { en: "Medical Center", ar: "مركز طبي" },
  dermatology: { en: "Dermatology", ar: "جلدية" },
  aesthetic: { en: "Aesthetic", ar: "تجميل" },
  nutrition: { en: "Nutrition", ar: "تغذية" },
  "plastic-surgery": { en: "Plastic Surgery", ar: "جراحة تجميلية" },
  "general-practice": { en: "General Practice", ar: "طب عام" },
  dental: { en: "Dental", ar: "أسنان" },
  other: { en: "Other", ar: "أخرى" },
};

export const COOPERATION_LABELS: Record<
  CooperationStatus,
  { en: string; ar: string }
> = {
  active: { en: "Active cooperation", ar: "تعاون نشط" },
  ongoing: { en: "Ongoing orders & follow-ups", ar: "طلبات ومتابعات مستمرة" },
  training: { en: "Product training completed", ar: "تدريب منتجات مكتمل" },
  orders: { en: "Clinical customer", ar: "عميل سريري" },
};

const PLACEHOLDER_LOGO = "/images/clinics/placeholder-logo.svg";
const PLACEHOLDER_COVER = "/images/clinics/placeholder-cover.jpg";
const PLACEHOLDER_GALLERY = [
  "/images/clinics/placeholder-gallery-1.jpg",
  "/images/clinics/placeholder-gallery-2.jpg",
  "/images/clinics/placeholder-gallery-3.jpg",
];

const DEFAULT_PRODUCTS = [
  "Liquivida® IV protocols",
  "Invita clinical training",
  "Medical representative support",
];

let _clinicPhotoIndex = 0;

function clinic(
  input: Omit<
    HealthcareClinic,
    "logo" | "cover" | "gallery" | "productsUsed" | "doctors" | "featured"
  > & {
    logo?: string;
    cover?: string;
    gallery?: string[];
    productsUsed?: string[];
    doctors?: HealthcareClinic["doctors"];
    featured?: boolean;
  }
): HealthcareClinic {
  const index = _clinicPhotoIndex++;
  const photoIndex =
    CLINIC_PHOTO_PATHS.length > 0 ? index % CLINIC_PHOTO_PATHS.length : 0;
  const uploadedCover =
    CLINIC_PHOTO_PATHS.length > 0 ? CLINIC_PHOTO_PATHS[photoIndex] : undefined;
  const hasUpload = Boolean(uploadedCover);

  return {
    ...input,
    featured: input.featured ?? (hasUpload && uploadedCover != null && CURATED_COVER_PATHS.has(uploadedCover)),
    logo: input.logo ?? PLACEHOLDER_LOGO,
    cover: input.cover ?? uploadedCover ?? PLACEHOLDER_COVER,
    gallery: input.gallery ?? (hasUpload && uploadedCover
      ? [uploadedCover, ...PLACEHOLDER_GALLERY.slice(0, 2)]
      : PLACEHOLDER_GALLERY),
    productsUsed: input.productsUsed ?? DEFAULT_PRODUCTS,
    doctors: input.doctors ?? [],
  };
}

/** Baghdad-area coordinates — approximate placeholders per district */
const COORDS = {
  mansour: { lat: 33.315, lng: 44.355 },
  karada: { lat: 33.305, lng: 44.395 },
  dora: { lat: 33.285, lng: 44.415 },
  karrada: { lat: 33.298, lng: 44.402 },
  zayona: { lat: 33.328, lng: 44.378 },
  adhamiya: { lat: 33.365, lng: 44.385 },
  default: { lat: 33.315, lng: 44.366 },
};

export const HEALTHCARE_CLINICS: HealthcareClinic[] = [
  clinic({
    slug: "r-s-clinic",
    name: "R.S Clinic",
    nameAr: "عيادة R.S",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 3,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "A private clinic that has collaborated with Invita through product presentations, clinical training, and ongoing IV therapy orders.",
    aboutAr:
      "عيادة خاصة تعاونت مع إنفيتا عبر عروض المنتجات والتدريب السريري وطلبات العلاج الوريدي المستمرة.",
    servicesEn: ["General consultations", "IV therapy administration", "Wellness protocols"],
    servicesAr: ["استشارات عامة", "إعطاء العلاج الوريدي", "بروتوكولات العافية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "rt-clinic",
    name: "RT Clinic",
    nameAr: "عيادة RT",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 2,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "An aesthetic clinic that has worked with Invita medical representatives on product training and follow-up support.",
    aboutAr:
      "عيادة تجميلية تعاملت مع ممثلي إنفيتا الطبيين في التدريب على المنتجات والدعم المتابع.",
    servicesEn: ["Aesthetic consultations", "Skin wellness IV", "Beauty protocols"],
    servicesAr: ["استشارات تجميلية", "IV للعناية بالبشرة", "بروتوكولات الجمال"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "i-ten-clinic",
    name: "I TEN Clinic",
    nameAr: "عيادة I TEN",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 4,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Collaborated with Invita on Liquivida® protocol integration and staff training sessions.",
    aboutAr: "تعاونت مع إنفيتا في دمج بروتوكولات Liquivida® وجلسات تدريب الكادر.",
    servicesEn: ["Aesthetic medicine", "IV vitamin therapy", "Skin radiance protocols"],
    servicesAr: ["طب تجميلي", "علاج فيتامينات وريدي", "بروتوكولات إشراق البشرة"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "stage-clinic",
    name: "Stage Clinic",
    nameAr: "عيادة Stage",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 3,
    cooperationStatus: "orders",
    cooperationSince: 2024,
    aboutEn:
      "A clinical customer receiving Invita products with representative follow-ups and reorder support.",
    aboutAr: "عميل سريري يتلقى منتجات إنفيتا مع متابعة الممثلين ودعم إعادة الطلب.",
    servicesEn: ["Cosmetic consultations", "Wellness IV drips"],
    servicesAr: ["استشارات تجميلية", "محاليل عافية وريدية"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "la-clinic",
    name: "La Clinic",
    nameAr: "عيادة La",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 2,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Trusted by Invita as a healthcare provider using our clinical IV product range.",
    aboutAr: "موثوق من إنفيتا كمقدّم رعاية صحية يستخدم مجموعة منتجاتنا الوريدية.",
    servicesEn: ["Aesthetic treatments", "Hydration IV", "Anti-aging protocols"],
    servicesAr: ["علاجات تجميلية", "ترطيب وريدي", "بروتوكولات مكافحة الشيخوخة"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "nt-clinic-dora",
    name: "NT Clinic (Dora)",
    nameAr: "عيادة NT (الدورة)",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Dora",
    districtAr: "الدورة",
    doctorCount: 5,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Dora-based clinic with ongoing cooperation through product orders and medical representative visits.",
    aboutAr: "عيادة في الدora بتعاون مستمر عبر طلبات المنتجات وزيارات الممثلين الطبيين.",
    servicesEn: ["Family medicine", "IV therapy", "Immunity support"],
    servicesAr: ["طب الأسرة", "علاج وريدي", "دعم المناعة"],
    map: COORDS.dora,
  }),
  clinic({
    slug: "best-clinic",
    name: "Best Clinic",
    nameAr: "عيادة Best",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 3,
    cooperationStatus: "training",
    cooperationSince: 2024,
    aboutEn:
      "Completed Invita product training and continues as a clinical customer for IV protocols.",
    aboutAr: "أكملت تدريب منتجات إنفيتا وتستمر كعميل سريري لبروتوكولات IV.",
    servicesEn: ["General practice", "Wellness IV"],
    servicesAr: ["طب عام", "IV للعافية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "bee-clinic",
    name: "Bee Clinic",
    nameAr: "عيادة Bee",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karada",
    districtAr: "الكرادة",
    doctorCount: 2,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Worked with Invita on beauty-focused IV protocols and staff education.",
    aboutAr: "تعاملت مع إنفيتا على بروتوكولات IV للجمال وتثقيف الكادر.",
    servicesEn: ["Beauty IV", "Skin care", "Radiance drips"],
    servicesAr: ["IV للجمال", "العناية بالبشرة", "محاليل الإشراق"],
    map: COORDS.karada,
  }),
  clinic({
    slug: "double-clinic",
    name: "Double Clinic",
    nameAr: "عيادة Double",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 4,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Healthcare provider collaborating with Invita on product presentations and clinical orders.",
    aboutAr: "مقدّم رعاية صحية يتعاون مع إنفيتا في عروض المنتجات والطلبات السريرية.",
    servicesEn: ["Aesthetic medicine", "IV wellness"],
    servicesAr: ["طب تجميلي", "عافية وريدية"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "daniya-clinic",
    name: "Daniya Clinic",
    nameAr: "عيادة Daniya",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 2,
    cooperationStatus: "orders",
    cooperationSince: 2024,
    aboutEn:
      "Clinical customer using Invita Liquivida® products with ongoing representative support.",
    aboutAr: "عميل سريري يستخدم منتجات Liquivida® من إنفيتا مع دعم مستمر من الممثلين.",
    servicesEn: ["Aesthetic care", "IV vitamins"],
    servicesAr: ["رعاية تجميلية", "فيتامينات وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "sava-clinic",
    name: "Sava Clinic",
    nameAr: "عيادة Sava",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 3,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Trusted healthcare provider that has received Invita training and product supply.",
    aboutAr: "مقدّم رعاية صحية موثوق تلقى تدريب إنفيتا وإمداد المنتجات.",
    servicesEn: ["General medicine", "IV therapy"],
    servicesAr: ["طب عام", "علاج وريدي"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "biotech-clinic",
    name: "BioTech Clinic",
    nameAr: "عيادة BioTech",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 6,
    cooperationStatus: "active",
    cooperationSince: 2023,
    aboutEn:
      "Medical center collaborated with Invita through comprehensive product training and recurring orders.",
    aboutAr: "مركز طبي تعاون مع إنفيتا عبر تدريب شامل على المنتجات وطلبات متكررة.",
    servicesEn: ["Multi-specialty care", "IV protocols", "Diagnostic support"],
    servicesAr: ["رعاية متعددة التخصصات", "بروتوكولات IV", "دعم تشخيصي"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "viva-dental-aesthetic-clinic",
    name: "Viva Dental & Aesthetic Clinic",
    nameAr: "عيادة Viva للأسنان والتجميل",
    specialty: "dental",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 4,
    cooperationStatus: "ongoing",
    cooperationSince: 2024,
    aboutEn:
      "Dental and aesthetic clinic worked with Invita on wellness IV add-on services for patients.",
    aboutAr: "عيادة أسنان وتجميل تعاملت مع إنفيتا على خدمات IV للعافية كإضافة للمرضى.",
    servicesEn: ["Dental care", "Aesthetic dentistry", "Wellness IV add-ons"],
    servicesAr: ["رعاية أسنان", "طب أسنان تجميلي", "إضافات IV للعافية"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "dr-touch-clinic",
    name: "Dr. Touch Clinic",
    nameAr: "عيادة Dr. Touch",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 2,
    cooperationStatus: "training",
    cooperationSince: 2024,
    aboutEn:
      "Collaborated with Invita medical representatives on protocol presentations and follow-ups.",
    aboutAr: "تعاونت مع ممثلي إنفيتا الطبيين في عروض البروتوكولات والمتابعات.",
    servicesEn: ["Touch aesthetics", "Skin IV therapy"],
    servicesAr: ["تجميل لمسي", "علاج وريدي للبشرة"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "ab-clinic",
    name: "AB Clinic",
    nameAr: "عيادة AB",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 3,
    cooperationStatus: "orders",
    cooperationSince: 2023,
    aboutEn:
      "Clinical customer with ongoing Invita product orders and representative check-ins.",
    aboutAr: "عميل سريري بطلبات منتجات إنفيتا المستمرة ومتابعات الممثلين.",
    servicesEn: ["Primary care", "IV wellness"],
    servicesAr: ["رعاية أولية", "عافية وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "yaser-shahad-clinic",
    name: "Yaser & Shahad Clinic",
    nameAr: "عيادة Yaser & Shahad",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 2,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Family practice clinic trusted by Invita for clinical product cooperation and training.",
    aboutAr: "عيادة طب أسرة موثوقة من إنفيتا للتعاون في المنتجات السريرية والتدريب.",
    servicesEn: ["Family medicine", "IV therapy"],
    servicesAr: ["طب الأسرة", "علاج وريدي"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "sarah-al-taie-clinic",
    name: "Sarah Al-Taie Clinic",
    nameAr: "عيادة Sarah Al-Taie",
    specialty: "dermatology",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 2,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Dermatology clinic collaborated with Invita on skin-focused IV protocols and medical training.",
    aboutAr: "عيادة جلدية تعاونت مع إنفيتا على بروتوكولات IV للبشرة والتدريب الطبي.",
    servicesEn: ["Dermatology", "Skin radiance IV", "Anti-aging drips"],
    servicesAr: ["جلدية", "IV لإشراق البشرة", "محاليل مكافحة الشيخوخة"],
    doctors: [
      {
        name: "Dr. Sarah Al-Taie",
        nameAr: "د. سارة الطائي",
        title: "Dermatologist",
        titleAr: "اختصاص جلدية",
      },
    ],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "jouri-clinic",
    name: "Jouri Clinic",
    nameAr: "عيادة Jouri",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 2,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Aesthetic clinic worked with Invita through product orders and clinical education.",
    aboutAr: "عيادة تجميلية تعاملت مع إنفيتا عبر طلبات المنتجات والتعليم السريري.",
    servicesEn: ["Aesthetic care", "Beauty IV"],
    servicesAr: ["رعاية تجميلية", "IV للجمال"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "mirova-clinic",
    name: "Mirova Clinic",
    nameAr: "عيادة Mirova",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 3,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Healthcare provider using Invita products with ongoing medical representative support.",
    aboutAr: "مقدّم رعاية صحية يستخدم منتجات إنفيتا مع دعم مستمر من الممثلين.",
    servicesEn: ["Aesthetic medicine", "Wellness IV"],
    servicesAr: ["طب تجميلي", "عافية وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "al-khalifa-clinic",
    name: "Al-Khalifa Clinic",
    nameAr: "عيادة الخليفة",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Adhamiya",
    districtAr: "الأعظمية",
    doctorCount: 4,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Trusted clinic that has collaborated with Invita on training and product supply.",
    aboutAr: "عيادة موثوقة تعاونت مع إنفيتا في التدريب وإمداد المنتجات.",
    servicesEn: ["General practice", "IV protocols"],
    servicesAr: ["طب عام", "بروتوكولات IV"],
    map: COORDS.adhamiya,
  }),
  clinic({
    slug: "al-yakanza-clinic",
    name: "Al-Yakanza Clinic",
    nameAr: "عيادة اليakanza",
    specialty: "general-practice",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 3,
    cooperationStatus: "orders",
    cooperationSince: 2024,
    aboutEn:
      "Clinical customer receiving Invita IV products with follow-up from our medical team.",
    aboutAr: "عميل سريري يتلقى منتجات IV من إنفيتا مع متابعة من فريقنا الطبي.",
    servicesEn: ["Primary care", "IV therapy"],
    servicesAr: ["رعاية أولية", "علاج وريدي"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "al-hayat-medical-complex",
    name: "Al-Hayat Medical Complex",
    nameAr: "مجمع الحياة الطبي",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 12,
    cooperationStatus: "active",
    cooperationSince: 2023,
    aboutEn:
      "Large medical complex collaborated with Invita through multi-department training and recurring clinical orders.",
    aboutAr: "مجمع طبي كبير تعاون مع إنفيتا عبر تدريب متعدد الأقسام وطلبات سريرية متكررة.",
    servicesEn: ["Multi-specialty", "IV therapy suite", "Outpatient care"],
    servicesAr: ["تخصصات متعددة", "جناح علاج وريدي", "رعاية خارجية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "al-yusr-medical-complex",
    name: "Al-Yusr Medical Complex",
    nameAr: "مجمع اليسر الطبي",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 10,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Medical center trusted by Invita as a clinical customer with ongoing cooperation.",
    aboutAr: "مركز طبي موثوق من إنفيتا كعميل سريري بتعاون مستمر.",
    servicesEn: ["Hospital outpatient", "IV wellness", "Specialist clinics"],
    servicesAr: ["عيادات خارجية", "عافية وريدية", "عيادات تخصصية"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "al-ghusoon-medical-complex",
    name: "Al-Ghusoon Medical Complex",
    nameAr: "مجمع الغصون الطبي",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 8,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Worked with Invita medical representatives on product presentations across departments.",
    aboutAr: "تعامل مع ممثلي إنفيتا الطبيين في عروض المنتجات عبر الأقسام.",
    servicesEn: ["Medical complex services", "IV therapy", "Wellness programs"],
    servicesAr: ["خدمات مجمع طبي", "علاج وريدي", "برامج عافية"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "al-hashimi-medical-complex",
    name: "Al-Hashimi Medical Complex",
    nameAr: "مجمع الهاشيمي الطبي",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Adhamiya",
    districtAr: "الأعظمية",
    doctorCount: 9,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Healthcare complex collaborating with Invita on clinical product supply and staff training.",
    aboutAr: "مجمع صحي يتعاون مع إنفيتا في إمداد المنتجات السريرية وتدريب الكادر.",
    servicesEn: ["Multi-specialty complex", "IV protocols"],
    servicesAr: ["مجمع متعدد التخصصات", "بروتوكولات IV"],
    map: COORDS.adhamiya,
  }),
  clinic({
    slug: "asinat-center",
    name: "Asinat Center",
    nameAr: "مركز Asinat",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 5,
    cooperationStatus: "training",
    cooperationSince: 2024,
    aboutEn:
      "Medical center completed Invita product training and maintains ongoing clinical orders.",
    aboutAr: "مركز طبي أكمل تدريب منتجات إنفيتا ويحافظ على طلبات سريرية مستمرة.",
    servicesEn: ["Outpatient center", "IV therapy"],
    servicesAr: ["مركز عيادات خارجية", "علاج وريدي"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "lafi-center",
    name: "Lafi Center",
    nameAr: "مركز Lafi",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 3,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Aesthetic center worked with Invita on beauty and wellness IV protocol integration.",
    aboutAr: "مركز تجميل تعامل مع إنفيتا على دمج بروتوكولات IV للجمال والعافية.",
    servicesEn: ["Aesthetic center", "Skin IV", "Radiance protocols"],
    servicesAr: ["مركز تجميل", "IV للبشرة", "بروتوكولات الإشراق"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "lavander-center",
    name: "Lavander Center",
    nameAr: "مركز Lavander",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 2,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Trusted aesthetic center using Invita clinical products with representative follow-ups.",
    aboutAr: "مركز تجميل موثوق يستخدم منتجات إنفيتا السريرية مع متابعات الممثلين.",
    servicesEn: ["Beauty center", "Wellness IV"],
    servicesAr: ["مركز جمال", "عافية وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "elyan-center",
    name: "Elyan Center",
    nameAr: "مركز Elyan",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 6,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Medical center collaborated with Invita through presentations, orders, and clinical support.",
    aboutAr: "مركز طبي تعاون مع إنفيتا عبر العروض والطلبات والدعم السريري.",
    servicesEn: ["Medical center", "IV therapy", "Wellness"],
    servicesAr: ["مركز طبي", "علاج وريدي", "عافية"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "devy-center",
    name: "Devy Center",
    nameAr: "مركز Devy",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 3,
    cooperationStatus: "orders",
    cooperationSince: 2024,
    aboutEn:
      "Clinical customer with Invita product orders and ongoing medical representative contact.",
    aboutAr: "عميل سريري بطلبات منتجات إنفيتا وتواصل مستمر مع الممثلين الطبيين.",
    servicesEn: ["Aesthetic services", "IV drips"],
    servicesAr: ["خدمات تجميلية", "محاليل وريدية"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "sky-center",
    name: "Sky Center",
    nameAr: "مركز Sky",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 5,
    cooperationStatus: "ongoing",
    cooperationSince: 2023,
    aboutEn:
      "Healthcare center trusted by Invita for product training and clinical cooperation.",
    aboutAr: "مركز صحي موثوق من إنفيتا للتدريب على المنتجات والتعاون السريري.",
    servicesEn: ["Medical center", "IV wellness programs"],
    servicesAr: ["مركز طبي", "برامج عافية وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "wellness-center",
    name: "Wellness Center",
    nameAr: "مركز Wellness",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 4,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Wellness-focused center worked with Invita on IV therapy protocol adoption and training.",
    aboutAr: "مركز يركز على العافية تعامل مع إنفيتا على اعتماد بروتوكولات IV والتدريب.",
    servicesEn: ["Wellness programs", "IV therapy", "Nutrition support"],
    servicesAr: ["برامج عافية", "علاج وريدي", "دعم تغذوي"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "al-andalus-center",
    name: "Al-Andalus Center",
    nameAr: "مركز الأندلس",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 7,
    cooperationStatus: "active",
    cooperationSince: 2023,
    aboutEn:
      "Medical center collaborated with Invita across product presentations and recurring orders.",
    aboutAr: "مركز طبي تعاون مع إنفيتا في عروض المنتجات والطلبات المتكررة.",
    servicesEn: ["Multi-service center", "IV protocols"],
    servicesAr: ["مركز متعدد الخدمات", "بروتوكولات IV"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "roma-center",
    name: "Roma Center",
    nameAr: "مركز Roma",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Zayona",
    districtAr: "الزيونة",
    doctorCount: 3,
    cooperationStatus: "ongoing",
    cooperationSince: 2024,
    aboutEn:
      "Aesthetic center using Invita products as a clinical customer with follow-up support.",
    aboutAr: "مركز تجميل يستخدم منتجات إنفيتا كعميل سريري مع دعم المتابعة.",
    servicesEn: ["Aesthetic center", "Beauty IV"],
    servicesAr: ["مركز تجميل", "IV للجمال"],
    map: COORDS.zayona,
  }),
  clinic({
    slug: "caris-center",
    name: "Caris Center",
    nameAr: "مركز Caris",
    specialty: "medical-center",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 5,
    cooperationStatus: "training",
    cooperationSince: 2024,
    aboutEn:
      "Completed Invita clinical training and continues cooperation through product orders.",
    aboutAr: "أكمل التدريب السريري من إنفيتا ويستمر التعاون عبر طلبات المنتجات.",
    servicesEn: ["Medical center", "IV therapy"],
    servicesAr: ["مركز طبي", "علاج وريدي"],
    map: COORDS.karrada,
  }),
  clinic({
    slug: "wave-center",
    name: "Wave Center",
    nameAr: "مركز Wave",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Mansour",
    districtAr: "المنصور",
    doctorCount: 2,
    cooperationStatus: "orders",
    cooperationSince: 2024,
    aboutEn:
      "Healthcare provider worked with Invita on wellness IV products and representative visits.",
    aboutAr: "مقدّم رعاية صحية تعامل مع إنفيتا على منتجات IV للعافية وزيارات الممثلين.",
    servicesEn: ["Aesthetic wellness", "IV drips"],
    servicesAr: ["عافية تجميلية", "محاليل وريدية"],
    map: COORDS.mansour,
  }),
  clinic({
    slug: "tokyo-beauty-center",
    name: "Tokyo Beauty Center",
    nameAr: "مركز Tokyo Beauty",
    specialty: "aesthetic",
    city: "Baghdad",
    cityAr: "بغداد",
    district: "Al-Karrada",
    districtAr: "الكرادة",
    doctorCount: 3,
    cooperationStatus: "active",
    cooperationSince: 2024,
    aboutEn:
      "Beauty center collaborated with Invita on skin radiance and anti-aging IV protocols.",
    aboutAr: "مركز جمال تعاون مع إنفيتا على بروتوكولات IV لإشراق البشرة ومكافحة الشيخوخة.",
    servicesEn: ["Beauty treatments", "Skin IV", "Anti-aging drips"],
    servicesAr: ["علاجات جمال", "IV للبشرة", "محاليل مكافحة الشيخوخة"],
    map: COORDS.karrada,
  }),
];

const SPECIALTY_DRIP_SLUGS: Record<ClinicSpecialty, string[]> = {
  "medical-center": ["myers-cocktail", "immune-boost", "energy-boost", "nad-plus"],
  dermatology: ["skin-radiance", "hair-skin-nails", "glutathione-detox"],
  aesthetic: ["skin-radiance", "hair-skin-nails", "nad-plus"],
  nutrition: ["myers-cocktail", "energy-boost", "vitamin-d3-boost"],
  "plastic-surgery": ["skin-radiance", "immune-boost", "nad-plus"],
  "general-practice": ["myers-cocktail", "immune-boost", "energy-boost"],
  dental: ["immune-boost", "myers-cocktail", "energy-boost"],
  other: ["myers-cocktail", "immune-boost", "energy-boost"],
};

/** Drip slugs to feature on a clinic profile for booking deep-links. */
export function getRecommendedDripsForClinic(clinic: HealthcareClinic): string[] {
  const slugs = SPECIALTY_DRIP_SLUGS[clinic.specialty] ?? SPECIALTY_DRIP_SLUGS.other;
  return slugs.filter((slug) => LIQUIVIDA_DRIPS.some((d) => d.slug === slug));
}

export function getClinicBySlug(slug: string): HealthcareClinic | undefined {
  return HEALTHCARE_CLINICS.find((c) => c.slug === slug);
}

export function getRelatedClinics(
  clinic: HealthcareClinic,
  limit = 4
): HealthcareClinic[] {
  return HEALTHCARE_CLINICS.filter(
    (c) => c.slug !== clinic.slug && c.specialty === clinic.specialty
  ).slice(0, limit);
}

export function filterClinics(options: {
  query?: string;
  specialty?: ClinicSpecialty | "all";
  sort?: "alpha" | "newest" | "featured";
  featuredOnly?: boolean;
}): HealthcareClinic[] {
  let results = [...HEALTHCARE_CLINICS];
  const q = options.query?.trim().toLowerCase();

  if (options.featuredOnly) {
    results = results.filter((c) => c.featured);
  }

  if (q) {
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        SPECIALTY_LABELS[c.specialty].en.toLowerCase().includes(q)
    );
  }

  if (options.specialty && options.specialty !== "all") {
    results = results.filter((c) => c.specialty === options.specialty);
  }

  if (options.sort === "newest") {
    results.sort((a, b) => b.cooperationSince - a.cooperationSince);
  } else if (options.sort === "featured") {
    results.sort((a, b) => {
      const featuredDiff = Number(b.featured) - Number(a.featured);
      if (featuredDiff !== 0) return featuredDiff;
      return b.cooperationSince - a.cooperationSince;
    });
  } else {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  return results;
}

export function paginateClinics<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    totalPages,
    total,
    perPage,
  };
}

export function clinicMapEmbedUrl(clinic: HealthcareClinic, zoom = 15): string {
  const { lat, lng } = clinic.map;
  const pad = 0.02;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - pad}%2C${lat - pad}%2C${lng + pad}%2C${lat + pad}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function clinicInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s&]/g, "").split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
