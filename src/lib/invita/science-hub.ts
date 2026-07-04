export type ScienceTab = "overview" | "nad" | "safety" | "nutrients" | "resources";

export type Localized<T extends string = string> = { en: T; ar: T };

export const SCIENCE_TABS: { id: ScienceTab; label: Localized }[] = [
  { id: "overview", label: { en: "The science", ar: "العلم" } },
  { id: "nad", label: { en: "NAD+", ar: "NAD+" } },
  { id: "safety", label: { en: "Safety", ar: "السلامة" } },
  { id: "nutrients", label: { en: "Nutrients", ar: "المغذيات" } },
  { id: "resources", label: { en: "Resources", ar: "المراجع" } },
];

export const SCIENCE_HERO_STATS = [
  {
    value: "100%",
    label: { en: "IV bioavailability", ar: "التوفر الحيوي الوريدي" },
    detail: {
      en: "Nutrients bypass digestion and reach cells directly.",
      ar: "المغذيات تتجاوز الهضم وتصل للخلايا مباشرة.",
    },
  },
  {
    value: "GMP",
    label: { en: "Certified formulas", ar: "تركيبات معتمدة GMP" },
    detail: {
      en: "Liquivida® USA formulations — ISO-tested, pharmaceutically prepared.",
      ar: "تركيبات Liquivida® الأمريكية — مختبرة ISO ومُحضَّرة صيدلانياً.",
    },
  },
  {
    value: "60",
    label: { en: "Studies reviewed", ar: "دراسة في المراجعة" },
    detail: {
      en: "Peer-reviewed literature on nutrient therapy & fatigue (Nutrients, 2023).",
      ar: "أدبيات مراجعة الأقران حول العلاج بالمغذيات والإرهاق (Nutrients، 2023).",
    },
  },
  {
    value: "40–60%",
    label: { en: "NAD+ decline with age", ar: "انخفاض NAD+ مع العمر" },
    detail: {
      en: "Human tissue data shows steep NAD+ loss between ages 30–70.",
      ar: "بيانات الأنسجة البشرية تُظهر انخفاضاً حاداً في NAD+ بين 30–70 سنة.",
    },
  },
] as const;

export const ORAL_VS_IV = {
  headers: {
    factor: { en: "Factor", ar: "العامل" },
    oral: { en: "Oral supplements", ar: "المكملات الفموية" },
    iv: { en: "IV therapy", ar: "العلاج الوريدي" },
  },
  rows: [
    {
      factor: { en: "Absorption", ar: "الامتصاص" },
      oral: { en: "Limited by gut breakdown — often under 50%", ar: "محدود بتحلل الأمعاء — غالباً أقل من 50%" },
      iv: { en: "Nearly 100% — delivered to bloodstream", ar: "قرابة 100% — يُسلَّم للدم مباشرة" },
    },
    {
      factor: { en: "Speed of effect", ar: "سرعة التأثير" },
      oral: { en: "Hours to days", ar: "ساعات إلى أيام" },
      iv: { en: "Often within the session", ar: "غالباً خلال الجلسة" },
    },
    {
      factor: { en: "GI bypass", ar: "تجاوز الجهاز الهضمي" },
      oral: { en: "Must pass stomach & intestines", ar: "يجب المرور بالمعدة والأمعاء" },
      iv: { en: "Ideal when digestion is impaired", ar: "مثالي عند ضعف الهضم" },
    },
    {
      factor: { en: "Dosing precision", ar: "دقة الجرعة" },
      oral: { en: "Variable individual absorption", ar: "امتصاص فردي متفاوت" },
      iv: { en: "Clinician-controlled, measurable", ar: "تحت إشراف طبي، قابل للقياس" },
    },
  ],
} as const;

export const RESEARCH_SPOTLIGHTS = [
  {
    id: "nutrients-2023",
    title: {
      en: "Nutrient Therapy for Fatigue Symptoms",
      ar: "العلاج بالمغذيات لأعراض الإرهاق",
    },
    journal: "Nutrients · MDPI · 2023",
    authors: "Barnish, Sheikh & Scholey",
    summary: {
      en: "Systematic review of 60 studies: 50 showed significant benefit (p < 0.05) from vitamin and mineral supplementation on fatigue — including CoQ10, L-carnitine, NAD, and vitamins C, D, and B complex, via oral and parenteral routes.",
      ar: "مراجعة منهجية لـ 60 دراسة: 50 أظهرت فائدة معنوية من المكملات على الإرهاق — بما فيها CoQ10 وL-carnitine وNAD وفيتامينات C وD وB، فموياً ووريدياً.",
    },
    href: "https://www.mdpi.com/2072-6643/15/9/2154",
  },
  {
    id: "massudi-2012",
    title: {
      en: "Age-Related NAD+ Decline in Human Skin",
      ar: "انخفاض NAD+ المرتبط بالعمر في الجلد البشري",
    },
    journal: "Massudi et al. · 2012",
    authors: "Human tissue biopsy cohort (n = 49)",
    summary: {
      en: "NAD+ in males aged 60–77 was ~60% lower than in young adults. Strong inverse correlation with age (r = −0.706, p = 0.001) and rising PARP activity — linking NAD+ depletion to impaired DNA repair and oxidative stress.",
      ar: "NAD+ لدى الذكور 60–77 كان أقل ~60% من البالغين الشباب. ارتباط عكسي قوي بالعمر — يربط استنفاد NAD+ بضعف إصلاح DNA والإجهاد التأكسدي.",
    },
  },
  {
    id: "liquivida-life-science",
    title: {
      en: "Liquivida Life Science Division",
      ar: "قسم علوم الحياة في Liquivida",
    },
    journal: "Invita Science Magazine · Liquivida",
    authors: "Dr. Michael Barnish · Dr. Johnny Parvani",
    summary: {
      en: "A decade of advancing IV therapy through literature review, peer-reviewed publication, and real-world clinical protocols — making elective hydration and injectable supplementation safe outside hospital settings.",
      ar: "عقد من تطوير العلاج الوريدي عبر مراجعات الأدبيات والنشر العلمي والبروتوكولات السريرية — لجعل الترطيب والمكملات الوريدية آمناً خارج المستشفيات.",
    },
  },
] as const;

export const NAD_DEEP_DIVE = {
  headline: {
    en: "NAD+ — cellular fuel for repair, energy & longevity",
    ar: "NAD+ — وقود خلوي للإصلاح والطاقة وطول العمر",
  },
  intro: {
    en: "Nicotinamide adenine dinucleotide (NAD+) is an essential coenzyme in every living cell — a substrate for 500+ enzymatic reactions governing energy metabolism, DNA repair, inflammation, and epigenetic regulation.",
    ar: "NAD+ إنزيم مساعد أساسي في كل خلية حية — يشارك في أكثر من 500 تفاعل enzymatic يحكم التمثيل الغذائي للطاقة وإصلاح DNA والالتهاب.",
  },
  mechanisms: [
    {
      title: { en: "Energy metabolism", ar: "التمثيل الغذائي للطاقة" },
      body: {
        en: "NAD+ drives mitochondrial ATP production — the cellular currency of energy.",
        ar: "NAD+ يدفع إنتاج ATP الميتوكوندري — عملة الطاقة الخلوية.",
      },
    },
    {
      title: { en: "DNA repair", ar: "إصلاح DNA" },
      body: {
        en: "PARP enzymes consume up to 90% of cellular NAD+ during genotoxic stress. Age-related NAD+ loss impairs repair capacity.",
        ar: "إنزيمات PARP تستهلك حتى 90% من NAD+ الخلوي أثناء الإجهاد الجيني. فقدان NAD+ مع العمر يضعف قدرة الإصلاح.",
      },
    },
    {
      title: { en: "Surgical & aesthetic recovery", ar: "التعافي الجراحي والتجميلي" },
      body: {
        en: "A 60-year-old surgical patient may present with ~60% depleted skin NAD+ stores before the first incision — directly impairing wound healing.",
        ar: "مريض جراحي بعمر 60 قد يبدأ بمخزون NAD+ جلدي مستنفد ~60% قبل أول شق — مما يضعف التئام الجروح.",
      },
    },
  ],
  protocol: {
    en: "Invita NAD+ infusions are administered slowly (~90 min for 750 mg) to minimize flushing or nausea. Protocols range from weekly series to intensive multi-day programs under medical supervision.",
    ar: "تُعطى جرعات NAD+ في Invita ببطء (~90 دقيقة لـ 750 mg) لتقليل الاحمرار أو الغثيان. البروتوكولات من سلسلة أسبوعية إلى برامج مكثفة تحت إشراف طبي.",
  },
} as const;

export const SAFETY_CHECKLIST = [
  {
    en: "Pregnant or breastfeeding? Treat only documented deficiencies per obstetric guidance.",
    ar: "حامل أو مرضعة؟ عالجي النقص الموثّق فقط وفق توجيهات التوليد.",
  },
  {
    en: "Cardiac, renal, or hepatic disease? Tailor formula; avoid Mg/Ca pushes; check eGFR.",
    ar: "مرض قلبي أو كلوي أو كبدي؟ خصصي التركيبة؛ تجنبي دفعات Mg/Ca؛ تحققي من eGFR.",
  },
  {
    en: "History of kidney stones, hemochromatosis, G6PD, or granulomatous disease?",
    ar: "تاريخ حصى الكلى أو hemochromatosis أو G6PD أو مرض granulomatous؟",
  },
  {
    en: "Review medications: digoxin, antihypertensives, chemotherapy, anticoagulants, PDE5 inhibitors.",
    ar: "راجعي الأدوية: digoxin، مضادات ارتفاع الضغط، chemotherapy، anticoagulants، PDE5.",
  },
  {
    en: "Baseline labs when indicated: creatinine/eGFR, calcium/magnesium, 25-OH vitamin D.",
    ar: "تحاليل أساسية عند الحاجة: creatinine/eGFR، calcium/magnesium، 25-OH vitamin D.",
  },
  {
    en: "Recent biotin? Warn patients about lab interference for 48–72 hours.",
    ar: "biotin حديث؟ حذّري المرضى من تداخل التحاليل 48–72 ساعة.",
  },
  {
    en: "Vitals acceptable? Proceed with slow infusion and continuous monitoring.",
    ar: "العلامات الحيوية مقبولة؟ تابعي التسريب الوريدي ببطء مع مراقبة مستمرة.",
  },
] as const;

export const CLINIC_PROTOCOLS = [
  {
    title: { en: "Light-sensitive ingredients", ar: "مكونات حساسة للضوء" },
    body: {
      en: "Use amber IV bags or foil wrap for Vitamin C, B2, NAD+, and glutathione. Prepare just before use; store at 2–8°C; avoid direct sunlight during prep and infusion.",
      ar: "استخدمي أكياس IV كهرmanية أو foil للفيتامin C وB2 وNAD+ وglutathione. حضّري قبل الاستخدام مباشرة؛ خزّني 2–8°C؛ تجنبي أشعة الشمس.",
    },
  },
  {
    title: { en: "Sterile technique", ar: "تقنية معقمة" },
    body: {
      en: "Every Invita partner clinic follows aseptic preparation, expiration monitoring, and documented administration protocols.",
      ar: "كل عيادة شريكة في Invita تتبع التحضير الم aseptic ومراقبة الصلاحية وبروتوكولات التوثيق.",
    },
  },
  {
    title: { en: "Medical oversight", ar: "الإشراف الطبي" },
    body: {
      en: "Licensed clinicians assess contraindications, select formulas, and monitor throughout — IV therapy is a medical procedure, not a retail service.",
      ar: "أطباء مرخصون يقيّمون الموانع ويختارون التركيبات ويراقبون طوال الجلسة — العلاج الوريدي إجراء طبي.",
    },
  },
] as const;

export const KEY_NUTRIENTS = [
  {
    name: { en: "Myers' Cocktail", ar: "كوktail Myers" },
    role: {
      en: "The original multi-nutrient IV blend — vitamin C, B-complex, B12, magnesium, calcium, and optional glutathione or NAD+ for broad wellness support.",
      ar: "الخليط الوريدي متعدد المغذيات الأصلي — فيtamin C وB-complex وB12 وmagnesium وcalcium وglutathione أو NAD+ اختيارياً.",
    },
    uses: {
      en: "Chronic fatigue, fibromyalgia, migraines, muscle spasms, allergies, asthma, general wellness maintenance.",
      ar: "الإرهاق المزمن، fibromyalgia، الصداع النصفي، تشنجات العضل، الحساسية، الربo، العافية العامة.",
    },
  },
  {
    name: { en: "Vitamin C", ar: "فيتامin C" },
    role: {
      en: "Powerful antioxidant; collagen synthesis; immune modulation. High-dose IV bypasses oral absorption limits.",
      ar: "مضاد أكسدة قوي؛ تصنيع collagen؛ modulation مناعي. الجرعات الوريدية العالية تتجاوز حدود الامتصاص الفموي.",
    },
    uses: {
      en: "Immune boost, skin radiance, recovery, oxidative stress.",
      ar: "تعزيز الم immunity، إشراق البشرة، التعافي، الإجهاد التoxidative.",
    },
  },
  {
    name: { en: "Glutathione", ar: "Glutathione" },
    role: {
      en: "Master intracellular antioxidant — detoxification, skin brightening, and cellular protection.",
      ar: "مضاد الأكسدة الرئيسي داخل الخلية — إزالة السموم، إشراق البشرة، حماية خلوية.",
    },
    uses: {
      en: "Detox protocols, anti-aging, immune support, environmental stress.",
      ar: "بروتوكولات detox، anti-aging، دعم الم immunity، الإجهاد البيئي.",
    },
  },
  {
    name: { en: "B-Complex & B12", ar: "B-Complex وB12" },
    role: {
      en: "Essential cofactors in energy metabolism, neurotransmitter synthesis, and red blood cell formation.",
      ar: "عوامل مساعدة أساسية في التمثيل الغذائي للطاقة وتصنيع neurotransmitters وكريات الدم الحمراء.",
    },
    uses: {
      en: "Energy boost, brain fog, athletic performance, mood support.",
      ar: "تعزيز الطاقة، ضبابية الذهن، الأداء الرياضي، دعم الم mood.",
    },
  },
  {
    name: { en: "Magnesium", ar: "Magnesium" },
    role: {
      en: "Muscle relaxation, migraine relief, blood pressure regulation, and stress response modulation.",
      ar: "است relaksacion العضل، relief الصداع النصفي، تنظيم ضغط الدم، modulation الاستجابة للإجهاد.",
    },
    uses: {
      en: "Recovery, migraines, chronic pain, anxiety-related tension.",
      ar: "التعافي، الصداع النصفي، الألم المزمن، التوتر المرتبط بالقلق.",
    },
  },
] as const;

export const SYMPTOM_INDICATORS = [
  {
    symptom: { en: "Chronic fatigue & burnout", ar: "إرهاق مزمن وburnout" },
    help: { en: "B vitamins, magnesium, NAD+ for cellular energy restoration.", ar: "فيتامينات B وmagnesium وNAD+ لاستعادة الطاقة الخلوية." },
  },
  {
    symptom: { en: "Immune vulnerability", ar: "ضعف الم immunity" },
    help: { en: "High-dose vitamin C, zinc, glutathione for rapid immune support.", ar: "فيتامin C عالي الجرعة وzinc وglutathione لدعم سريع." },
  },
  {
    symptom: { en: "Dull skin & aging signs", ar: "بشرة باهتة وعلامات aging" },
    help: { en: "Vitamin C, glutathione, biotin for collagen and radiance.", ar: "Vitamin C وglutathione وbiotin للcollagen والإشراق." },
  },
  {
    symptom: { en: "Athletic recovery", ar: "التعافي الرياضي" },
    help: { en: "Electrolytes, amino acids, B-complex to replenish post-training.", ar: "Electrolytes وأحماض أمينية وB-complex بعد التمرين." },
  },
  {
    symptom: { en: "Brain fog & focus", ar: "ضبابية ذ mental وتركيز" },
    help: { en: "B vitamins, NAD+, amino acids for cognitive clarity.", ar: "فيتامينات B وNAD+ وأحماض أمينية للو clarity المعرفي." },
  },
  {
    symptom: { en: "Dehydration & hangovers", ar: "جفاف وhangover" },
    help: { en: "Rapid IV rehydration with electrolyte balance restoration.", ar: "إعادة ترطيب وريدية سريعة مع electrolytes." },
  },
] as const;

export const DOWNLOADABLE_RESOURCES = [
  {
    id: "safety-101",
    title: { en: "Safety 101 — Clinic Protocols", ar: "Safety 101 — بروتوكولات العيادة" },
    description: {
      en: "Pre-infusion checklist, drip-specific indications, NAD+ administration guidance, and storage requirements for partner clinics.",
      ar: "قائمة ما قبل الج infusion، مؤشرات كل drip، إرشادات NAD+، ومتطلبات التخزين للعيادات الشريكة.",
    },
    file: "/resources/invita-safety-101.pdf",
    size: "950 KB",
    audience: { en: "Clinicians & partners", ar: "الأطباء والشركاء" },
  },
  {
    id: "patient-education",
    title: { en: "Complete IV Therapy Patient Guide", ar: "دليل المريض الشامل للعلاج الوريدي" },
    description: {
      en: "What IV vitamin therapy is, who it helps, ingredient profiles, oral vs IV comparison, and safety information for patients.",
      ar: "ما هو العلاج الوريدي، من يستفيد، المكونات، مقارنة فموي vs وريدي، ومعلومات السلامة للمرضى.",
    },
    file: "/resources/invita-patient-education.pdf",
    size: "34 MB",
    audience: { en: "Patients", ar: "المرضى" },
  },
  {
    id: "nad-review",
    title: { en: "NAD+ Scientific Review — Plastic Surgery Symposium", ar: "مراجعة NAD+ العلمية — ندوة جراحة التجميل" },
    description: {
      en: "Comprehensive review: NAD+ biochemistry, human tissue data, clinical evidence, protocols, and safety for aesthetic medicine.",
      ar: "مراجعة شاملة: biochemistry NAD+، بيانات الأنسجة، الأدلة السريرية، البروتوكولات، والسلامة.",
    },
    file: "/resources/nad-plus-scientific-review.pdf",
    size: "3.3 MB",
    audience: { en: "Physicians", ar: "الأطباء" },
  },
  {
    id: "science-magazine",
    title: { en: "Liquivida Science & Articles Magazine", ar: "مجلة Liquivida العلمية والمقالات" },
    description: {
      en: "Peer-reviewed fatigue research, case studies on skin and wellness, diabetes pathways, and a decade of IV therapy science.",
      ar: "أبحاث الإرهاق المراجعة، case studies للبشرة والعافية، مسارات السكري، وعقد من علم العلاج الوريدي.",
    },
    file: "/resources/liquivida-science-magazine.pdf",
    size: "16 MB",
    audience: { en: "All audiences", ar: "جميع الفئات" },
  },
  {
    id: "liquivida-guide",
    title: { en: "Liquivida Clinical Information Guide", ar: "دليل Liquivida السريري" },
    description: {
      en: "Full formulary reference, wellness philosophy, and clinical education from Liquivida® USA.",
      ar: "مرجع التركيبات الكامل، فلسفة العافية، والتعليم السريري من Liquivida® USA.",
    },
    file: "/resources/liquivida-clinical-guide.pdf",
    size: "15 MB",
    audience: { en: "Partners & clinicians", ar: "الشركاء والأطباء" },
  },
  {
    id: "invita-catalogue",
    title: { en: "Invita Full Product Catalogue", ar: "كتalog منتجات Invita الكامل" },
    description: {
      en: "Complete Invita IV drips catalogue with formulations, tiers, and clinical positioning.",
      ar: "كتalog Invita الكامل للمغذيات الوريدية مع التركيبات والمستويات.",
    },
    file: "/resources/invita-catalogue.pdf",
    size: "24 MB",
    audience: { en: "Partners & clinicians", ar: "الشركاء والأطباء" },
  },
  {
    id: "iv-brochure",
    title: { en: "Invita IV Brochure", ar: "بروشور Invita الوريدي" },
    description: {
      en: "Patient-facing IV therapy brochure with services, benefits, and contact details.",
      ar: "بروشور العلاج الوريدي للمرضى مع الخدمات والفوائد.",
    },
    file: "/resources/invita-iv-brochure.pdf",
    size: "7 MB",
    audience: { en: "Patients", ar: "المرضى" },
  },
  {
    id: "iso-13485",
    title: { en: "ISO 13485 Certification", ar: "شهادة ISO 13485" },
    description: {
      en: "Medical devices quality management certification documentation.",
      ar: "وثائق شهادة إدارة جودة الأجهزة الطبية.",
    },
    file: "/resources/iso-13485.pdf",
    size: "PDF",
    audience: { en: "Regulatory & partners", ar: "التنظيمي والشركاء" },
  },
] as const;

export const SCIENCE_DISCLAIMER = {
  en: "Educational content compiled from Invita clinical materials, Liquivida® USA resources, and peer-reviewed literature. Not a substitute for personalized medical advice. Always consult a qualified healthcare provider before starting treatment.",
  ar: "محتوى تعليمي مجمّع من مواد Invita السريرية وموارد Liquivida® الأمريكية والأدبيات المراجعة. لا يغني عن استشارة طبية شخصية. استشر دائماً مقدم رعاية مؤهل قبل بدء أي علاج.",
} as const;
