import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  Building2,
  FlaskConical,
  GraduationCap,
  Globe2,
  ShieldCheck,
} from "lucide-react";

export type TrustBadge = {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: LucideIcon;
  detailEn?: string;
  detailAr?: string;
};

export const TRUST_AUTHORITY_BADGES: TrustBadge[] = [
  {
    id: "registered",
    labelEn: "Iraq's First Officially Registered IV Therapy Brand",
    labelAr: "أول علامة مغذيات وريدية مسجّلة رسمياً في العراق",
    icon: Award,
    detailEn: "Official Iraqi medical wellness company operating under Ministry of Health regulations.",
    detailAr: "شركة عافية طبية عراقية رسمية تعمل وفق لوائح وزارة الصحة.",
  },
  {
    id: "pharma",
    labelEn: "Manufactured Under International Pharmaceutical Standards",
    labelAr: "مُصنَّع وفق المعايير الدوائية الدولية",
    icon: FlaskConical,
    detailEn: "Products prepared to international quality and sterility requirements.",
    detailAr: "منتجات تُحضَّر وفق متطلبات الجودة والتعقيم الدولية.",
  },
  {
    id: "liquivida",
    labelEn: "Official Liquivida® Licensed Partner",
    labelAr: "شريك مرخّص رسمياً لـ Liquivida®",
    icon: BadgeCheck,
    detailEn: "Baghdad's authorised distributor of Liquivida® USA clinical IV protocols.",
    detailAr: "الموزّع المعتمد في بغداد لبروتوكولات Liquivida® USA السريرية.",
  },
  {
    id: "aiva",
    labelEn: "American IV Association Verified Partner",
    labelAr: "شريك معتمد من American IV Association",
    icon: Globe2,
    detailEn: "Aligned with American IV Association standards for clinical IV therapy.",
    detailAr: "متوافق مع معايير American IV Association للعلاج الوريدي السريري.",
  },
  {
    id: "training",
    labelEn: "Healthcare Professional Training",
    labelAr: "تدريب المهنيين الصحيين",
    icon: GraduationCap,
    detailEn: "Clinical education, protocols, and onboarding for partner facilities.",
    detailAr: "تعليم سريري وبروتوكولات وتأهيل لمرافق الشركاء.",
  },
  {
    id: "network",
    labelEn: "Healthcare Providers We Have Worked With",
    labelAr: "مقدّمو رعاية صحية تعاملنا معهم",
    icon: Building2,
    detailEn: "Nationwide clinical customers, training, and medical representative engagement.",
    detailAr: "عملاء سريريون وتدريب وتفاعل مع الممثلين الطبيين على مستوى العراق.",
  },
];

export type StatItem = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  labelEn: string;
  labelAr: string;
  /** Display as text instead of animated number */
  displayText?: { en: string; ar: string };
};

export const COMPANY_STATS: StatItem[] = [
  {
    id: "registered",
    value: 1,
    prefix: "#",
    labelEn: "Officially Registered IV Brand in Iraq",
    labelAr: "علامة IV مسجّلة رسمياً في العراق",
    displayText: { en: "1st", ar: "الأولى" },
  },
  {
    id: "clinics",
    value: 37,
    suffix: "+",
    labelEn: "Healthcare Providers in Network",
    labelAr: "مقدّم رعاية صحية في الشبكة",
  },
  {
    id: "treatments",
    value: 5000,
    suffix: "+",
    labelEn: "IV Treatments Delivered",
    labelAr: "علاج وريدي مُقدَّم",
  },
  {
    id: "team",
    value: 12,
    suffix: "+",
    labelEn: "Licensed Medical Professionals",
    labelAr: "متخصص طبي مرخّص",
  },
  {
    id: "distribution",
    value: 0,
    labelEn: "Nationwide Distribution Network",
    labelAr: "شبكة توزيع على مستوى العراق",
    displayText: { en: "IQ", ar: "العراق" },
  },
];
