/** Protocol outcome themes — from Invita patient education materials (not testimonials). */
export const PATIENT_STORIES = [
  {
    id: "energy",
    themeEn: "Energy & mental clarity",
    themeAr: "الطاقة والوضوح الذهني",
    quoteEn:
      "B-complex, magnesium, and vitamin C delivered IV — supporting metabolism and focus when oral supplements fall short.",
    quoteAr:
      "مجموعة B والمغنيسيوم وفيتامين C وريدياً — لدعم الأيض والتركيز عندما تفشل المكملات الفموية.",
    contextEn: "Energy Boost · Jet Fuel · Myers Cocktail",
    contextAr: "Energy Boost · Jet Fuel · Myers Cocktail",
  },
  {
    id: "skin",
    themeEn: "Skin radiance & beauty",
    themeAr: "إشراق البشرة والجمال",
    quoteEn:
      "Glutathione, biotin, and antioxidant protocols for complexion — popular before weddings, photoshoots, and dermatology treatments.",
    quoteAr:
      "بروتوكولات الجلوتاثيون والبيوتين ومضادات الأكسدة للبشرة — شائعة قبل الأعراس والتصوير وعلاجات الجلدية.",
    contextEn: "Skin Radiance · Hair, Skin & Nails · Glutathione Detox",
    contextAr: "Skin Radiance · Hair, Skin & Nails · Glutathione Detox",
  },
  {
    id: "recovery",
    themeEn: "Athletic recovery",
    themeAr: "التعافي الرياضي",
    quoteEn:
      "Amino acids and electrolytes for post-training replenishment — rehydrate and reduce muscle soreness after competition.",
    quoteAr:
      "أحماض أمينية وإلكتروليتات لإعادة التغذية بعد التمرين — ترطيب وتقليل ألم العضلات بعد المنافسة.",
    contextEn: "Sport Endurance & Recovery · Jet Fuel",
    contextAr: "Sport Endurance & Recovery · Jet Fuel",
  },
  {
    id: "immunity",
    themeEn: "Immune reinforcement",
    themeAr: "تعزيز المناعة",
    quoteEn:
      "High-dose vitamin C at the first sign of illness — with clinical intake screening before every session per Safety 101.",
    quoteAr:
      "فيتامين C بجرعة عالية عند أول علامات المرض — مع فحص سريري قبل كل جلسة وفق Safety 101.",
    contextEn: "Immune Boost · pre-infusion checklist",
    contextAr: "Immune Boost · قائمة ما قبل الإعطاء",
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
