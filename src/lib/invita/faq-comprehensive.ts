export type FaqCategory = "patients" | "safety" | "clinics" | "dna";

export type FaqItem = {
  q: string;
  a: string;
  category: FaqCategory;
};

export const FAQ_CATEGORIES: { id: FaqCategory; labelEn: string; labelAr: string }[] = [
  { id: "patients", labelEn: "Patients", labelAr: "المرضى" },
  { id: "safety", labelEn: "Safety", labelAr: "السلامة" },
  { id: "clinics", labelEn: "Clinics & Partners", labelAr: "العيادات والشركاء" },
  { id: "dna", labelEn: "DNA Lab", labelAr: "مختبر DNA" },
];

export const COMPREHENSIVE_FAQ: FaqItem[] = [
  // Patients
  {
    category: "patients",
    q: "What is IV therapy?",
    a: "IV therapy delivers vitamins, minerals, amino acids, and antioxidants directly into your bloodstream. Because nutrients bypass the digestive system, absorption is near-complete — unlike oral supplements where only 10–30% may be absorbed.",
  },
  {
    category: "patients",
    q: "How long does a session take?",
    a: "A typical IV drip session takes 30–60 minutes, following a 15-minute medical consultation where we review your health history and goals.",
  },
  {
    category: "patients",
    q: "Is IV therapy safe?",
    a: "Yes, when administered by licensed medical professionals using registered products. Invita uses official Liquivida® USA formulas and follows strict clinical protocols. Every patient receives a medical assessment before treatment.",
  },
  {
    category: "patients",
    q: "Who should avoid IV therapy?",
    a: "IV therapy may not be suitable for individuals with certain heart conditions, kidney disease, pregnancy (without medical clearance), or active infections. Our clinical team screens every patient during consultation.",
  },
  {
    category: "patients",
    q: "How often can I receive treatment?",
    a: "Frequency depends on your goals and medical profile. Some clients benefit from weekly sessions; others maintain results with monthly visits. Your Invita clinician will recommend a personalised schedule.",
  },
  {
    category: "patients",
    q: "Will a doctor assess me before treatment?",
    a: "Yes. Every Invita session begins with a complimentary medical assessment. No treatment is administered without clinical clearance.",
  },
  {
    category: "patients",
    q: "Do you offer home visits?",
    a: "Select at-home IV services may be available in Baghdad for eligible patients. Contact our concierge team to discuss availability and medical suitability.",
  },
  {
    category: "patients",
    q: "How quickly will I feel results?",
    a: "Because nutrients enter circulation immediately, many clients report increased energy, clarity, and wellbeing within hours — not days. Results vary by individual and protocol.",
  },
  {
    category: "patients",
    q: "Can I combine different drips?",
    a: "Your clinician may recommend protocol adjustments or add-ons based on your assessment. We do not combine formulations without medical oversight.",
  },
  {
    category: "patients",
    q: "Is IV therapy better than oral supplements?",
    a: "For clients who want measurable, fast-acting nutrient delivery, IV therapy offers superior bioavailability. Oral supplements remain useful for daily maintenance — your clinician can advise on the best approach.",
  },
  {
    category: "patients",
    q: "What should I expect when I arrive?",
    a: "You will be welcomed into a private suite, offered refreshments, and seen by a medical professional throughout your entire session. The environment is calm, discreet, and clinical — not a spa.",
  },
  {
    category: "patients",
    q: "How much does IV therapy cost?",
    a: "Pricing is displayed transparently in Iraqi Dinar (IQD) on each drip page. All prices include a complimentary medical assessment. Your clinician may recommend adjustments based on your needs.",
  },
  // Safety
  {
    category: "safety",
    q: "Are your products registered?",
    a: "Invita is Iraq's first officially registered IV therapy brand. We distribute Liquivida® USA formulations through authorised channels and operate in compliance with Iraqi Ministry of Health regulations.",
  },
  {
    category: "safety",
    q: "Are products sterile?",
    a: "Yes. All products are prepared under international pharmaceutical quality standards using medical-grade sterile materials and single-use administration equipment.",
  },
  {
    category: "safety",
    q: "Who administers treatment?",
    a: "Licensed physicians and certified infusion specialists administer all Invita treatments. Clinical supervision is maintained throughout every session.",
  },
  {
    category: "safety",
    q: "Are single-use materials used?",
    a: "Yes. We use single-use needles, catheters, and administration sets for every patient. Nothing is reused.",
  },
  {
    category: "safety",
    q: "What happens during treatment?",
    a: "After your consultation, a small IV catheter is placed comfortably. The drip infuses over 30–60 minutes while you rest. A clinician monitors you throughout and is available for any questions.",
  },
  {
    category: "safety",
    q: "What are the risks?",
    a: "IV therapy is generally well-tolerated. Minor risks include bruising at the insertion site or, rarely, allergic reactions. Our intake process screens for contraindications to minimise risk.",
  },
  {
    category: "safety",
    q: "Is IV therapy a substitute for medical treatment?",
    a: "No. Invita IV therapy is a wellness service designed to optimise health — not to diagnose, treat, or cure disease. Always consult your physician for medical conditions.",
  },
  // Clinics
  {
    category: "clinics",
    q: "Can clinics partner with Invita?",
    a: "Yes. Invita supplies clinics, medical centres, hospitals, and physician practices across Iraq. Visit our For Clinics page or request a partnership consultation.",
  },
  {
    category: "clinics",
    q: "Do you supply hospitals?",
    a: "Yes. We work with hospitals and large medical centres seeking registered IV therapy products, protocols, and clinical training.",
  },
  {
    category: "clinics",
    q: "How do we become an official partner?",
    a: "Submit a partnership request through our For Clinics page. Our business development team will schedule a meeting to discuss your facility, needs, and onboarding.",
  },
  {
    category: "clinics",
    q: "Do you provide staff training?",
    a: "Yes. Invita provides clinical education, administration protocols, safety guidelines, workshops, and structured staff onboarding for all partner facilities.",
  },
  {
    category: "clinics",
    q: "Do you provide marketing materials?",
    a: "Partners receive premium co-branding assets, patient education materials, and marketing support aligned with Invita's medical brand standards.",
  },
  {
    category: "clinics",
    q: "Do you provide medical protocols?",
    a: "Yes. Partners receive Liquivida® clinical protocols, documentation, contraindication guides, and ongoing medical updates.",
  },
  {
    category: "clinics",
    q: "Is there ongoing support?",
    a: "Every partner has access to dedicated account management, clinical support, supply chain coordination, and regulatory guidance.",
  },
  {
    category: "clinics",
    q: "How do clinics place orders?",
    a: "Partner facilities order through our wholesale programme with predictable lead times and nationwide distribution support.",
  },
  {
    category: "clinics",
    q: "What types of facilities do you work with?",
    a: "Clinics, medical centres, hospitals, wellness centres, dermatology and plastic surgery practices, and luxury concierge medicine providers.",
  },
  {
    category: "clinics",
    q: "Is wholesale pricing available?",
    a: "Yes. Wholesale and volume pricing is available for registered partner facilities. Contact us for a commercial proposal.",
  },
  // DNA
  {
    category: "dna",
    q: "How does DNA testing work?",
    a: "A simple buccal swab or blood sample is collected at Invita. Your sample is processed through accredited laboratory partners with results delivered securely to your patient portal.",
  },
  {
    category: "dna",
    q: "How long do results take?",
    a: "Turnaround varies by panel — typically 2–4 weeks. Your Invita clinician will provide a specific timeline when you order.",
  },
  {
    category: "dna",
    q: "Where is testing performed?",
    a: "Samples are processed through accredited international laboratory partners. Invita provides private interpretation and clinical context in Baghdad.",
  },
  {
    category: "dna",
    q: "Who interprets results?",
    a: "Invita's genomic medicine team interprets results and provides actionable recommendations for nutrition, supplementation, and lifestyle — with full discretion.",
  },
  {
    category: "dna",
    q: "Is DNA testing covered by insurance?",
    a: "Coverage varies. Invita provides transparent IQD pricing. Our team can advise on available panels and payment options.",
  },
];

export function getFaqByCategory(category: FaqCategory): FaqItem[] {
  return COMPREHENSIVE_FAQ.filter((item) => item.category === category);
}
