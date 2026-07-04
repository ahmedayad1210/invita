export const PATIENT_STORIES = [
  {
    id: "energy",
    themeEn: "Energy & clarity",
    themeAr: "الطاقة والوضوح",
    quoteEn:
      "After years of fatigue, one IV session gave me clarity I hadn't felt in months. The medical team made every step feel safe and professional.",
    quoteAr:
      "بعد سنوات من الإرهاق، جلسة واحدة منحتني وضوحاً لم أشعر به منذ أشهر. الفريق الطبي جعل كل خطوة آمنة ومهنية.",
    contextEn: "Executive wellness client · Baghdad",
    contextAr: "عميل عافية تنفيذية · بغداد",
  },
  {
    id: "recovery",
    themeEn: "Athletic recovery",
    themeAr: "التعافي الرياضي",
    quoteEn:
      "As a competitive athlete, recovery is everything. Invita's protocols are the first in Iraq that match what I've used abroad.",
    quoteAr:
      "كرياضي تنافسي، التعافي هو كل شيء. بروتوكولات إنفيتا هي الأولى في العراق التي تضاهي ما استخدمته خارج البلاد.",
    contextEn: "Performance & recovery protocol",
    contextAr: "بروتوكول الأداء والتعافي",
  },
  {
    id: "immunity",
    themeEn: "Immune support",
    themeAr: "دعم المناعة",
    quoteEn:
      "I travel constantly. Having a medically supervised IV programme in Baghdad has changed how I manage my health.",
    quoteAr:
      "أسافر باستمرار. وجود برنامج وريدي بإشراف طبي في بغداد غيّر طريقة إدارتي لصحتي.",
    contextEn: "Immunity protocol · frequent traveller",
    contextAr: "بروتوكول المناعة · مسافر متكرر",
  },
] as const;

export const HEALTHCARE_PARTNERS = [
  {
    id: "medical-centre",
    typeEn: "Medical Centre",
    typeAr: "مركز طبي",
    nameEn: "Partner Medical Centre",
    nameAr: "مركز طبي شريك",
    locationEn: "Baghdad",
    locationAr: "بغداد",
    /** Replace with real partner name when authorised */
    placeholder: true,
  },
  {
    id: "dermatology",
    typeEn: "Dermatology Clinic",
    typeAr: "عيادة جلدية",
    nameEn: "Partner Dermatology Clinic",
    nameAr: "عيادة جلدية شريكة",
    locationEn: "Baghdad",
    locationAr: "بغداد",
    placeholder: true,
  },
  {
    id: "wellness",
    typeEn: "Wellness Centre",
    typeAr: "مركز عافية",
    nameEn: "Partner Wellness Centre",
    nameAr: "مركز عافية شريك",
    locationEn: "Erbil",
    locationAr: "أربيل",
    placeholder: true,
  },
  {
    id: "physician",
    typeEn: "Physician Practice",
    typeAr: "عيادة طبيب",
    nameEn: "Partner Physician Group",
    nameAr: "مجموعة أطباء شركاء",
    locationEn: "Basra",
    locationAr: "البصرة",
    placeholder: true,
  },
] as const;
