window.InvitaPages = window.InvitaPages || {};
window.InvitaPages.home = class Component {
  state = {
    lang: null, tier: 'all', openDrip: null, goal: null,
    bookStep: 1, bookDrip: null, bookLoc: null, bookDay: null, bookTime: null,
    name: '', phone: '', note: '', formErr: false, bookRef: null,
    statP: 0
  };

  POSTS = ['energy-boost','immune-boost','hair-skin-nails','panthenol-b5','myers-cocktail','dopamin-booster','skin-radiance','nad-plus','weight-loss','fertility-libido','cola-drip-iron','edta-chelation'];

  STORIES = {"energy-boost":"assets/social/story-energy-boost.webp","immune-boost":"assets/social/story-immune-boost.webp","hair-skin-nails":"assets/social/story-hair-skin-nails.webp","panthenol-b5":"assets/social/story-panthenol-b5.webp","myers-cocktail":"assets/social/story-myers-cocktail.webp","dopamin-booster":"assets/social/story-dopamin-booster.webp","skin-radiance":"assets/social/story-skin-radiance.webp","nad-plus":"assets/social/story-nad-plus.webp","weight-loss":"assets/social/story-weight-loss.webp","fertility-libido":"assets/social/story-fertility-libido.webp","cola-drip-iron":"assets/social/story-cola-drip-iron.webp","edta-chelation":"assets/social/story-edta-chelation.webp","jet-fuel":"assets/bags/jet-fuel.webp"};
  POST_IMGS = {"energy-boost":"assets/social/post-energy-boost.webp","immune-boost":"assets/social/post-immune-boost.webp","hair-skin-nails":"assets/social/post-hair-skin-nails.webp","panthenol-b5":"assets/social/post-panthenol-b5.webp","myers-cocktail":"assets/social/post-myers-cocktail.webp","dopamin-booster":"assets/social/post-dopamin-booster.webp","skin-radiance":"assets/social/post-skin-radiance.webp","nad-plus":"assets/social/post-nad-plus.webp","weight-loss":"assets/social/post-weight-loss.webp","fertility-libido":"assets/social/post-fertility-libido.webp","cola-drip-iron":"assets/social/post-cola-drip-iron.webp","edta-chelation":"assets/social/post-edta-chelation.webp"};

  DOCTOR_CARDS = ["assets/uploads/doctor-01.webp","assets/uploads/doctor-02.webp","assets/uploads/doctor-03.webp","assets/uploads/doctor-04.webp","assets/uploads/doctor-05.webp","assets/uploads/doctor-06.webp","assets/uploads/doctor-07.webp","assets/uploads/doctor-08.webp","assets/uploads/doctor-09.webp","assets/uploads/doctor-10.webp","assets/uploads/doctor-11.webp","assets/uploads/doctor-12.webp","assets/uploads/doctor-13.webp","assets/uploads/doctor-14.webp","assets/uploads/doctor-15.webp","assets/uploads/doctor-16.webp"];

  DRIPS = [
    { slug: 'energy-boost', tier: 'Wellness', min: 45, price: 150000, name: 'Energy Boost',
      formula: 'B1 100mg · B2 25mg · B3 200mg · B6 250mg · B12 1000mcg · Magnesium Sulphate 200mg · Amino Acids',
      en: { tag: 'Instant recharge against chronic fatigue and burnout', desc: 'Fast energy, better mood and focus, and support for nerves and muscles — for busy professionals, parents, or those recovering from illness.' },
      ar: { tag: 'جلسة تنشيط فورية ضد التعب المزمن والإجهاد', desc: 'طاقة سريعة، مزاج وتركيز أفضل، ودعم للأعصاب والعضلات — للمهنيين المشغولين أو المتعافين من المرض.' } },
    { slug: 'immune-boost', tier: 'Wellness', min: 45, price: 165000, name: 'Immune Boost',
      formula: 'Vitamin C 1000mg · Zinc 100mg · Calcium 2mmol · Potassium 5mmol · Bicarbonate 25mmol',
      en: { tag: 'Fortify defences and recover faster', desc: 'Strengthens the immune system, reduces how often and how long you get sick, speeds healing, and boosts resistance to viruses.' },
      ar: { tag: 'تقوية المناعة وتعافٍ أسرع', desc: 'تقوية جهاز المناعة، تقليل تكرار ومدة الإصابة بالأمراض، تسريع الشفاء وتعزيز مقاومة الفيروسات.' } },
    { slug: 'hair-skin-nails', tier: 'Beauty', min: 45, price: 180000, name: 'Hair, Nail & Skin',
      formula: 'Biotin 10,000mcg · Zinc 10mg/ml',
      en: { tag: 'Biotin boost for beauty from within', desc: 'Strengthens hair and stimulates growth, reduces shedding and breakage, improves skin freshness, and boosts nail health.' },
      ar: { tag: 'بيوتين لجمالٍ من الداخل', desc: 'تقوية الشعر وتحفيز نموه، تقليل التساقط والتقصف، تحسين نضارة البشرة وتعزيز صحة الأظافر.' } },
    { slug: 'panthenol-b5', tier: 'Beauty', min: 45, price: 175000, name: 'Panthenol (B5)',
      formula: 'Dexpanthenol 250mg/ml',
      en: { tag: 'Deep hydration and cellular renewal', desc: 'Deep skin hydration, cellular repair, calming of irritation, and restoration of natural radiance.' },
      ar: { tag: 'ترطيب عميق وتجديد الخلايا', desc: 'ترطيب عميق للبشرة، إصلاح الخلايا، تهدئة التهيجات، واستعادة الإشراق الطبيعي.' } },
    { slug: 'myers-cocktail', tier: 'Signature', min: 45, price: 210000, name: "Myer's Cocktail",
      formula: 'Vitamin C 1000mg · B1, B2, B3, B6, B12 · Magnesium 200mg · Calcium 100mg · Zinc 10mg · NAD+ 100mg',
      en: { tag: 'The original multi-nutrient wellness infusion', desc: 'A comprehensive session supporting energy, immunity, and nerves — reducing stress and fatigue while improving overall health.' },
      ar: { tag: 'التسريب الغذائي الأصلي متعدد العناصر', desc: 'جلسة شاملة لدعم الطاقة والمناعة والأعصاب، تقليل التوتر والإجهاد، وتحسين الصحة العامة.' } },
    { slug: 'dopamin-booster', tier: 'Performance', min: 45, price: 195000, name: 'Dopamin Booster',
      formula: 'Citicoline 250mg / 5ml',
      en: { tag: 'Sharper focus, memory, and mental performance', desc: 'Enhances memory, increases focus and attention, improves mental performance, and supports nerve cells.' },
      ar: { tag: 'تركيز وذاكرة وأداء ذهني', desc: 'يعزّز الذاكرة، يزيد التركيز والانتباه، يحسّن الأداء الذهني، ويدعم الخلايا العصبية.' } },
    { slug: 'skin-radiance', tier: 'Beauty', min: 45, price: 225000, name: 'Skin Radiance',
      formula: 'Glutathione 2.4g · Vitamin C 1000mg',
      en: { tag: 'Brighten, even out, and glow', desc: 'Brightens and evens skin tone, reduces pigmentation, deeply hydrates, detoxifies the body, and delays signs of ageing.' },
      ar: { tag: 'تفتيح وتوحيد وإشراقة', desc: 'تفتيح وتوحيد لون البشرة، تقليل التصبغات، ترطيب عميق، تنقية الجسم من السموم وتأخير علامات التقدم بالعمر.' } },
    { slug: 'nad-plus', tier: 'Signature', min: 90, price: 285000, name: 'NAD+ Drips',
      formula: 'NAD+ 500mg in each Invita vial',
      en: { tag: 'Cellular energy and anti-ageing', desc: 'Instant restoration of cellular energy, sharp mental focus, exceptional clarity, advanced nerve support, and resistance to ageing.' },
      ar: { tag: 'طاقة خلوية ومكافحة الشيخوخة', desc: 'استعادة فورية للطاقة الخلوية، تركيز ذهني حاد، صفاء استثنائي، دعم متقدم للأعصاب، ومقاومة الشيخوخة.' } },
    { slug: 'weight-loss', tier: 'Wellness', min: 45, price: 195000, name: 'Weight Loss Drip',
      formula: 'L-Carnitine 1000mg · Glutamine 300mg · Arginine 1g',
      en: { tag: 'Burn fat and support lean muscle', desc: 'Stimulates fat burning, raises energy during dieting, improves physical performance, and supports muscle building.' },
      ar: { tag: 'حرق الدهون ودعم العضلات', desc: 'تحفّز حرق الدهون، ترفع الطاقة أثناء الرجيم، تحسّن الأداء البدني وتدعم بناء العضلات.' } },
    { slug: 'fertility-libido', tier: 'Signature', min: 45, price: 240000, name: 'Fertility & Libido',
      formula: 'Glutathione 1.2g · L-Carnitine 1000mg · MIC (Methionine – Inositol – Choline)',
      en: { tag: 'Fertility, hormonal balance, and vitality', desc: 'Supports fertility for men and women, improves hormonal balance, and boosts sexual energy and overall vitality.' },
      ar: { tag: 'خصوبة وتوازن هرموني وحيوية', desc: 'دعم الخصوبة للرجال والنساء، تحسين التوازن الهرموني، وتعزيز الطاقة الجنسية والحيوية العامة.' } },
    { slug: 'cola-drip-iron', tier: 'Wellness', min: 30, price: 180000, name: 'Cola Drip (Iron)',
      formula: 'Iron Sucrose 200mg / 10ml',
      en: { tag: 'Treat anaemia and raise haemoglobin', desc: 'Treats anaemia, raises haemoglobin, reduces dizziness and fatigue, and improves activity and energy.' },
      ar: { tag: 'علاج فقر الدم ورفع الهيموغلوبين', desc: 'علاج فقر الدم، رفع الهيموغلوبين، تقليل الدوخة والتعب، وتحسين النشاط والطاقة.' } },
    { slug: 'jet-fuel', tier: 'Performance', min: 45, price: 175000, name: 'Jet Fuel',
      formula: 'B12 1000mcg · B2 25mg · B3 200mg · B6 250mg · Magnesium 250mg · Vitamin C 500mg',
      en: { tag: 'Power and endurance for body and mind', desc: 'Boosts physical and mental energy, raises stamina, and relieves exhaustion — ideal for athletes and those with demanding workloads.' },
      ar: { tag: 'قوة وتحمّل للجسم والذهن', desc: 'تعزيز الطاقة البدنية والذهنية، رفع القدرة على التحمّل وتخفيف الإرهاق — مثالية للرياضيين وأصحاب الأعمال المجهدة.' } },
    { slug: 'edta-chelation', tier: 'Signature', min: 90, price: 240000, name: 'EDTA Chelation',
      formula: 'EDTA 150mg/ml',
      en: { tag: 'Vascular detox and heart health', desc: 'Cleanses blood vessels, removes toxic heavy metals, and supports heart and circulatory health.' },
      ar: { tag: 'ديتوكس الأوعية وصحة القلب', desc: 'تنقية الأوعية الدموية، إزالة المعادن السامة، ودعم صحة القلب والدورة الدموية.' } }
  ];

  ICONS = {
    'energy-boost': 'assets/bottles/energy-boost.webp',
    'immune-boost': 'assets/bottles/immune-boost.webp',
    'hair-skin-nails': 'assets/bottles/hair-skin-nails.webp',
    'panthenol-b5': 'assets/bottles/panthenol-b5.webp',
    'myers-cocktail': 'assets/bottles/myers-cocktail.webp',
    'dopamin-booster': 'assets/bottles/dopamin-booster.webp',
    'skin-radiance': 'assets/bottles/skin-radiance.webp',
    'nad-plus': 'assets/bottles/nad-plus.webp',
    'weight-loss': 'assets/bottles/weight-loss.webp',
    'fertility-libido': 'assets/bottles/fertility-libido.webp',
    'cola-drip-iron': 'assets/bottles/cola-drip-iron.webp',
    'jet-fuel': 'assets/bottles/jet-fuel.webp',
    'edta-chelation': 'assets/bottles/edta-chelation.webp'
  };

  GOALS = [
    { id: 'energy', en: 'Energy & fatigue', ar: 'الطاقة والإرهاق', drips: ['energy-boost', 'jet-fuel', 'nad-plus'] },
    { id: 'immunity', en: 'Immunity', ar: 'المناعة', drips: ['immune-boost', 'myers-cocktail', 'cola-drip-iron'] },
    { id: 'beauty', en: 'Beauty & glow', ar: 'الجمال والإشراقة', drips: ['skin-radiance', 'hair-skin-nails', 'panthenol-b5'] },
    { id: 'focus', en: 'Focus & memory', ar: 'التركيز والذاكرة', drips: ['dopamin-booster', 'nad-plus', 'jet-fuel'] },
    { id: 'longevity', en: 'Longevity & anti-ageing', ar: 'طول العمر ومكافحة الشيخوخة', drips: ['nad-plus', 'edta-chelation', 'myers-cocktail'] },
    { id: 'detox', en: 'Detox & balance', ar: 'التنقية والتوازن', drips: ['edta-chelation', 'skin-radiance', 'weight-loss'] }
  ];

  USES = {
    'energy-boost': { en: ['Fatigue', 'Burnout', 'Post-illness recovery'], ar: ['الإرهاق', 'الإنهاك', 'التعافي بعد المرض'] },
    'immune-boost': { en: ['Cold & flu season', 'Prevention', 'Faster healing'], ar: ['موسم البرد والإنفلونزا', 'الوقاية', 'تعافٍ أسرع'] },
    'hair-skin-nails': { en: ['Hair thickness', 'Nail strength', 'Skin freshness'], ar: ['كثافة الشعر', 'قوة الأظافر', 'نضارة البشرة'] },
    'panthenol-b5': { en: ['Deep hydration', 'Skin repair', 'Radiance'], ar: ['ترطيب عميق', 'إصلاح البشرة', 'إشراقة'] },
    'myers-cocktail': { en: ['Overall wellness', 'Immunity', 'Stress & fatigue'], ar: ['العافية العامة', 'المناعة', 'التوتر والإجهاد'] },
    'dopamin-booster': { en: ['Focus', 'Memory', 'Mental clarity'], ar: ['التركيز', 'الذاكرة', 'الصفاء الذهني'] },
    'skin-radiance': { en: ['Brightening', 'Even tone', 'Anti-ageing'], ar: ['تفتيح', 'توحيد اللون', 'مكافحة الشيخوخة'] },
    'nad-plus': { en: ['Cellular energy', 'Anti-ageing', 'Cognition'], ar: ['طاقة خلوية', 'مكافحة الشيخوخة', 'الإدراك'] },
    'weight-loss': { en: ['Fat burning', 'Metabolism', 'Lean muscle'], ar: ['حرق الدهون', 'الاستقلاب', 'العضلات'] },
    'fertility-libido': { en: ['Fertility', 'Hormonal balance', 'Libido'], ar: ['الخصوبة', 'التوازن الهرموني', 'الرغبة'] },
    'cola-drip-iron': { en: ['Anaemia', 'Low haemoglobin', 'Fatigue'], ar: ['فقر الدم', 'نقص الهيموغلوبين', 'التعب'] },
    'jet-fuel': { en: ['Endurance', 'Focus', 'Pre-event'], ar: ['التحمّل', 'التركيز', 'قبل المنافسات'] },
    'edta-chelation': { en: ['Detox', 'Heavy metals', 'Heart health'], ar: ['ديتوكس', 'المعادن الثقيلة', 'صحة القلب'] }
  };

  CELEBS = [
    { img: 'assets/uploads/celeb-01.webp', name: 'Mona Kattan', handle: '@monakattan' },
    { img: 'assets/uploads/celeb-13.webp', name: 'Mohamed Ramadan', handle: '@mohamedramadanws' },
    { img: 'assets/uploads/celeb-03.webp', name: 'Taim AlFalasi', handle: '@taimalfalasi' },
    { img: 'assets/uploads/celeb-02.webp', name: 'Rita Kahawaty', handle: '@ritakahawaty' },
    { img: 'assets/uploads/celeb-08.webp', name: 'Saoud Alkaabi', handle: '@saoudalkaabi' },
    { img: 'assets/uploads/celeb-07.webp', name: 'Diana Ganeeva', handle: '@diana.dxb' },
    { img: 'assets/uploads/celeb-04.webp', name: 'Zoya Sakr', handle: '@zoyasakr' },
    { img: 'assets/uploads/celeb-06.webp', name: 'Heba Saad', handle: '@habah_saad' },
    { img: 'assets/uploads/celeb-09.webp', name: 'Dalia El Ali', handle: '@deebydalia' },
    { img: 'assets/uploads/celeb-10.webp', name: 'Aliyah Raey', handle: '@aliyahraey' },
    { img: 'assets/uploads/celeb-15.webp', name: 'Lamiya Slimani', handle: '@lamiyaslimani' },
    { img: 'assets/uploads/celeb-14.webp', name: 'Aseel', handle: '@aseel' },
    { img: 'assets/uploads/celeb-12.webp', name: 'Leen Jadan', handle: '@leenjadan' },
    { img: 'assets/uploads/celeb-11.webp', name: 'Ahmed', handle: '@twistedcurlz' },
    { img: 'assets/uploads/celeb-05.webp', name: 'Asallah Kamel', handle: '@asallahkamel' }
  ];

  EN = {
    nav: { menu: 'IV Drips', science: 'Science', clinics: 'For Clinics', partners: 'Partners', book: 'Book your appointment' },
    promo: { body: 'Book a session — get a complimentary wellness assessment.', cta: 'Book now' },
    hero: {
      l1: 'The leading company behind', l2: 'modern IV therapy in Iraq.',
      sub: 'IV solutions designed to the latest international protocols — for health, wellness, and performance.',
      ctaBook: 'Book your appointment', ctaMenu: 'Explore the drip menu', ctaClinics: 'For clinics & partners',
      fromLine: 'Drips from 150,000 IQD · Same-week appointments · Call or WhatsApp',
      tags: ['Iraq\u2019s first officially registered IV brand', 'Official Liquivida® USA distributor', 'American IV Association verified']
    },
    get: [
      { t: 'Licensed medical professionals', b: 'Every drip administered by trained clinicians' },
      { t: 'Free wellness assessment', b: 'A medical consultation before every session' },
      { t: 'Suite or at-home', b: 'Al-Mansour private suites · nurse visits across Baghdad' },
      { t: 'Open 7 days', b: 'Sun–Thu 9–20 · Fri 14–20 · Sat 10–18' }
    ],
    addons: {
      kicker: 'Enhance your session', title: 'Add-ons.',
      note: 'Add to any drip session — ask your clinician during your consultation.',
      items: [
        { name: 'Oxygen Bar', desc: 'Boost oxygen levels and choose your scent: Lavender, Peppermint, or Oud. 20 minutes of pure rejuvenation.' },
        { name: 'Head, Neck & Shoulder Massage', desc: 'Release built-up tension while your nutrients absorb. Stimulates blood flow and endorphin release.' },
        { name: 'Foot Reflexology', desc: 'Targeted pressure-point massage for deep relaxation and stress relief.' },
        { name: 'Athletic Recovery Program', desc: 'For athletes: supports muscle repair, boosts immunity, oxygenates cells, enhances performance.' },
        { name: 'Mini Facial', desc: '30 minutes of cleansing, exfoliating, and moisturising while your drip does its work.' }
      ]
    },
    standard: {
      kicker: 'The Invita standard', title: 'What sets Invita apart.',
      items: [
        'Iraq\u2019s first officially registered IV therapy brand — operating under Ministry of Health regulations',
        'Official Liquivida\u00ae licensed partner — Baghdad\u2019s authorised distributor of USA clinical protocols',
        'Manufactured under international pharmaceutical standards for quality and sterility',
        'American IV Association verified partner',
        'A medical professional with you through the whole session — transparent IQD pricing, no hidden fees',
        'Clinical training and supply for 37+ healthcare providers nationwide'
      ]
    },
    quotes: {
      kicker: 'Client stories', title: 'Hear it from Baghdad.',
      items: [
        { text: '\u201cThe IV Radiance drip was unlike anything I\u2019ve tried before. My skin looked incredible and I felt re-energised from the inside out.\u201d', who: 'Client, Baghdad — 5-star review' },
        { text: '\u201cI\u2019ve been to IV clinics abroad and was thrilled to finally have this level of quality right here in Baghdad. The VIP drip gave me energy I hadn\u2019t felt in years.\u201d', who: 'Client, Baghdad — 5-star review' },
        { text: '\u201cThe fact that these are Liquivida USA formulas — the same ones used in America — makes a huge difference. You feel the quality.\u201d', who: 'Client, Baghdad — 5-star review' }
      ]
    },
    ticker: ['Memory & Focus', 'Energy Boost', 'Immune Support', 'Detoxification', 'Chronic Fatigue', 'Blood Pressure', 'Anxiety', 'Muscle Recovery', 'Libido', 'Thyroid & Adrenal Health', 'Menopause', 'Post-travel Recovery', 'Metabolism', 'Athletic Performance', 'Skin & Radiance', 'Hangover Recovery', 'Sleep Improvement', 'Anti-Aging'],
    stats: { kicker: 'By the numbers — a growing healthcare network', labels: ['Officially registered IV brand in Iraq', 'Healthcare providers in network', 'IV treatments delivered', 'Licensed medical professionals'] },
    menu: {
      kicker: 'The Invita catalogue', title: 'Thirteen Liquivida® protocols.',
      lead: 'Every protocol begins with a private medical consultation. Filter by tier, open a row for the clinical formula, book in one tap.',
      all: 'All', book: 'Book', bestFor: 'Best for', formula: 'Clinical formula', details: 'View full details',
      disclaimer: 'Price includes a complimentary medical assessment. Your clinician may recommend adjustments based on your individual needs.'
    },
    tiers: { Signature: 'Signature', Wellness: 'Wellness', Performance: 'Performance', Beauty: 'Beauty' },
    matcher: { kicker: 'Personalised matching', title: 'Which drip fits you?', lead: 'Pick a goal — we recommend the Invita protocols that match.', resultsTitle: 'Your recommended protocols' },
    how: {
      kicker: 'The process', title: 'Consult. Infuse. Feel it.',
      steps: [
        { n: '01', title: 'Consult', body: 'Your session starts with a 15-minute medical consultation. We review your health history, lifestyle, and goals to recommend the right drip protocol.' },
        { n: '02', title: 'Infuse', body: 'Your customised IV drip is administered by a trained medical professional. You relax while a precision blend of nutrients enters your bloodstream directly — bypassing the digestive system entirely.' },
        { n: '03', title: 'Feel it', body: 'Because vitamins and minerals go straight into circulation, results are fast. Most clients feel increased energy, clarity, and wellbeing within hours — not days.' }
      ]
    },
    science: {
      kicker: 'The science', title: '100% absorption. Zero digestive loss.',
      copy: 'When vitamins are taken orally, the gastrointestinal tract limits how much your body can absorb. IV therapy delivers nutrients directly into circulation — fully, and fast.',
      ivLabel: 'IV infusion — direct to the bloodstream', ivVal: '100%',
      oralLabel: 'Oral supplements — limited by digestion', oralVal: '10–30%',
      props: [
        { n: '01', t: '100% absorption', b: 'Oral supplements deliver only 10–30% of their nutrients. IV therapy delivers directly into the bloodstream — fully absorbed, zero digestive loss.' },
        { n: '02', t: 'Liquivida® USA formulas', b: 'Every drip we administer is a clinically developed Liquivida® formula — the same trusted protocols used across the United States, now in Baghdad.' },
        { n: '03', t: 'Medical grade & safe', b: 'All treatments are prescribed by a qualified medical professional after a comprehensive health consultation, using pharmaceutical-grade ingredients.' },
        { n: '04', t: 'Free wellness consult', b: 'Every client receives a complimentary wellness assessment with one of our medical professionals before any treatment is recommended.' }
      ]
    },
    visit: {
      kicker: 'The visit', title: 'A private suite in Al-Mansour. Or your home.',
      copy: 'No waiting-room chaos. Refreshments, a calm private space, and a medical professional with you through the whole session — before, during, and after.',
      suiteName: 'Invita Suite — Al-Mansour', suiteDesc: 'Private infusion suites. By appointment only.',
      homeName: 'At-Home Service', homeDesc: 'Licensed nurse visits across Baghdad. Premium add-on.',
      hours: 'Sun–Thu 9:00–20:00 · Fri 14:00–20:00 · Sat 10:00–18:00'
    },
    booking: {
      kicker: 'Concierge booking', title: 'Book your consultation.',
      lead: 'You are not buying a product — you are starting a medically guided wellness experience, with a complimentary assessment before any treatment.',
      steps: ['Your protocol', 'Your visit', 'Your details', 'Confirmed'],
      chooseTitle: 'Choose your protocol', locTitle: 'Where would you like your session?',
      dateTitle: 'Pick a date', timeTitle: 'Available times', detailsTitle: 'Your details',
      nameL: 'Full name', phoneL: 'Phone (WhatsApp)', noteL: 'Health goals (optional)',
      err: 'Please enter your name and a valid WhatsApp number.',
      back: 'Back', continue: 'Continue', confirm: 'Confirm booking', change: 'Change',
      confTitle: 'Request received', confBody: 'Our medical team will confirm your appointment on WhatsApp within 24 hours. Keep your booking reference.',
      refL: 'Booking reference', sumProtocol: 'Protocol', sumWhere: 'Where', sumWhen: 'When', sumName: 'Name',
      whatsapp: 'Chat on WhatsApp', again: 'New booking',
      trust: 'Licensed professionals · Private suite · Liquivida® USA formulas'
    },
    b2b: {
      kicker: 'For clinics & partners', title: 'Serious healthcare, supplied.',
      copy: 'We are not a beauty spa or a vitamin bar. Invita is a serious healthcare company — clinical education, administration protocols, regulatory compliance, and a trusted supply chain included.',
      stat: '37+', statL: 'Healthcare providers already in the Invita network',
      points: [
        { t: 'Professional training', b: 'Clinical education, protocols, and onboarding for partner facilities.' },
        { t: 'Wholesale supply', b: 'Clinical Liquivida® formulas for clinics and hospitals nationwide.' },
        { t: 'Protocols & compliance', b: 'Standardised administration, documentation, and Ministry of Health alignment.' },
        { t: 'Medical support', b: 'A direct line to our clinical team for network partners.' }
      ],
      cta: 'Become a partner', cta2: 'Request information'
    },
    membership: {
      kicker: 'Invita Circle', title: 'Membership.',
      tiers: [
        { name: 'Invita Circle', price: '2,400,000 IQD / year', tag: '', perks: ['Monthly Immunity Shield IV', 'Priority concierge booking', '15% on DNA panels', 'At-home nurse visits (2/year)'] },
        { name: 'Longevity', price: '5,800,000 IQD / year', tag: 'Most requested', perks: ['Everything in Circle', 'Quarterly NAD+ Performance', 'Annual Longevity DNA panel', 'Dedicated clinician line'] }
      ],
      cta: 'Request a membership consultation'
    },
    dna: { kicker: 'Invita DNA Lab', title: 'Genomic intelligence.', copy: 'DNA panels with private interpretation — nutrition, longevity, and pharmacogenomics.', link: 'Talk to our medical team' },
    video: { kicker: 'On screen', title: 'Discover your next infusion.', lead: 'Every formula, its ingredients, and its benefits — in two minutes.' },
    celebs: { kicker: 'Global wellness', title: 'Celebrities love IV drips.', lead: 'From athletes and artists to wellness pioneers — IV therapy has become a trusted ritual for energy, recovery, and glow.', note: 'Public figures photographed during IV wellness sessions at leading clinics across the region.', prev: 'Scroll back', next: 'Scroll forward' },
    film: { kicker: 'Inside Invita', title: 'See the experience.', copy: 'A calm private suite, precise clinical work, and Liquivida\u00ae USA formulas — watch what a session feels like before you book.', note: 'Drop a poster image on the frame — send us your clinic film and it will play right here.' },
    ig: { kicker: '@invita_iv_drips', title: 'From the suite.', follow: 'Follow on Instagram' },
    faq: {
      kicker: 'Questions', title: 'Questions, answered plainly.',
      items: [
        { q: 'Is IV drip therapy safe?', a: 'Yes. All Invita IV protocols are Liquivida® USA formulas developed by board-certified emergency physicians and pharmacists. Every treatment is administered by trained medical professionals, and a safety consultation before treatment ensures we select the right protocol for you.' },
        { q: 'How long does a session take?', a: 'A typical IV drip session takes 30–60 minutes. NAD+ protocols run about 90 minutes. This follows a short 15-minute medical consultation where we review your health history and goals.' },
        { q: 'I already take vitamins — why IV?', a: 'When vitamins are taken orally, the gastrointestinal tract limits absorption — often just 10–30%. IV therapy delivers nutrients directly into the bloodstream at 100% absorption. If you want to actually feel the difference, IV is the superior method.' },
        { q: 'How often should I come in?', a: 'Your Invita medical professional will recommend a personalised schedule based on your consultation. Some clients benefit from weekly sessions; others come monthly for maintenance.' },
        { q: 'Does it really work?', a: 'Yes — benefits are fast and tangible because nutrients bypass the digestive system and enter your bloodstream immediately. Reported results include more energy and mental clarity, stronger immunity, faster athletic recovery, better sleep, improved mood, healthier skin, and jet-lag or hangover relief.' },
        { q: 'Who can receive IV therapy?', a: 'Most healthy adults are eligible. Our pre-treatment consultation follows medical eligibility criteria to ensure the therapy is appropriate and safe for each individual. Invita\u2019s treatments optimise wellness — they do not treat or diagnose medical conditions.' },
        { q: 'What should I expect when I arrive?', a: 'You\u2019ll be welcomed by our team, offered refreshments, and settled into a comfortable private space. A medical professional will be with you throughout your session and available for questions before, during, and after.' }
      ]
    },
    close: { l1: 'Ready to work with', l2: 'Iraq\u2019s IV therapy leader?', ctaBook: 'Book a wellness session', ctaPartner: 'Become a partner' },
    footer: {
      tagline: 'Iraq\u2019s Leading IV Therapy Company',
      contact: 'Contact', hours: 'Hours', explore: 'Explore',
      address: 'Al-Mansour, Baghdad, Iraq',
      hoursLines: 'Sun – Thu: 9:00 – 20:00 — Friday: 14:00 – 20:00 — Saturday: 10:00 – 18:00',
      links: [
        { label: 'IV Drips', href: '#menu' }, { label: 'The science', href: '#science' },
        { label: 'For clinics', href: '#clinics' }, { label: 'Booking', href: '#book' },
        { label: 'Membership', href: '#membership' }, { label: 'Infusion menu (print)', href: 'menu-inner.html' }, { label: 'Instagram', href: 'https://www.instagram.com/invita_iv_drips/' }
      ],
      disclaimer: 'All treatments are administered by licensed medical professionals. Invita operates under Iraqi Ministry of Health regulations.',
      copyright: '© 2026 Invita — Official Liquivida® USA distributor, Baghdad.'
    }
  };

  AR = {
    nav: { menu: 'العلاجات الوريدية', science: 'المنهج العلمي', clinics: 'للعيادات', partners: 'شركاؤنا', book: 'احجز استشارتك' },
    promo: { body: 'تشمل كل جلسة تقييماً طبياً مجانياً قبل العلاج.', cta: 'احجز الآن' },
    hero: {
      l1: 'الشركة الرائدة وراء', l2: 'العلاج الوريدي الحديث في العراق.',
      sub: 'نقدّم حلول العلاج الوريدي للأفراد والعيادات والمراكز الطبية وفق معايير دولية، مدعومة ببروتوكولات قائمة على الأدلة العلمية وشراكات مع علامات عالمية رائدة.',
      ctaBook: 'احجز استشارتك', ctaMenu: 'استكشف برامج العلاج الوريدي', ctaClinics: 'للعيادات والشركاء',
      fromLine: 'تبدأ الجلسات من 150,000 د.ع · مواعيد على مدار الأسبوع · هاتف أو واتساب',
      tags: ['أول علامة عراقية متخصصة بالعلاج الوريدي', 'شريك معتمد لمنتجات Liquivida®', 'بروتوكولات علاجية وفق المعايير الدولية']
    },
    get: [
      { t: 'كوادر طبية مرخّصة', b: 'تُعطى جميع الجلسات بإشراف متخصصين سريريين معتمدين' },
      { t: 'تقييم طبي مجاني', b: 'استشارة طبية متخصصة قبل كل جلسة' },
      { t: 'في الجناح أو المنزل', b: 'أجنحة خاصة في المنصور · زيارات تمريضية في بغداد' },
      { t: 'سبعة أيام في الأسبوع', b: 'الأحد–الخميس 9–20 · الجمعة 14–20 · السبت 10–18' }
    ],
    addons: {
      kicker: 'استكمل جلستك', title: 'الخدمات الإضافية.',
      note: 'تُضاف إلى أي جلسة — استشر أخصائيك خلال التقييم.',
      items: [
        { name: 'بار الأكسجين', desc: 'جلسة أكسجين لعشرين دقيقة مع روائح مختارة: لافندر، نعناع، أو عود.' },
        { name: 'مساج الرأس والرقبة والكتفين', desc: 'جلسة استرخاء أثناء التسريب — تنشّط الدورة الدموية وتخفف التوتر.' },
        { name: 'رفلكسولوجي القدم', desc: 'مساج نقاط الضغط لاسترخاء عميق.' },
        { name: 'برنامج التعافي الرياضي', desc: 'برنامج مخصص للرياضيين يدعم استشفاء العضلات والأداء.' },
        { name: 'فيشل سريع', desc: 'ثلاثون دقيقة من التنظيف والترطيب أثناء جلستك.' }
      ]
    },
    standard: {
      kicker: 'معيار إنفيتا', title: 'التزامنا بالجودة.',
      items: [
        'أول علامة عراقية متخصصة بالعلاج الوريدي — تعمل وفق لوائح وزارة الصحة',
        'شريك معتمد لمنتجات Liquivida\u00ae — البروتوكولات السريرية الأمريكية في بغداد',
        'تصنيع وفق المعايير الدوائية الدولية للجودة والتعقيم',
        'عضوية معتمدة في American IV Association',
        'إشراف طبي طوال الجلسة — وأسعار معلنة بالدينار دون رسوم إضافية',
        'تدريب سريري وتوريد لأكثر من 37 جهة رعاية صحية'
      ]
    },
    quotes: {
      kicker: 'قصص العملاء', title: 'من بغداد.',
      items: [
        { text: '\u201cمغذي الإشراقة كان مختلفاً عن كل ما جربته. بشرتي بدت رائعة وشعرت بتجدد الطاقة من الداخل.\u201d', who: 'عميلة، بغداد — تقييم 5 نجوم' },
        { text: '\u201cزرت عيادات وريدية في الخارج، وسعدت أخيراً بوجود هذا المستوى من الجودة هنا في بغداد. مغذي VIP أعطاني طاقة لم أشعر بها منذ سنوات.\u201d', who: 'عميل، بغداد — تقييم 5 نجوم' },
        { text: '\u201cكون هذه صيغ Liquivida الأمريكية — نفس المستخدمة في أمريكا — يصنع فرقاً كبيراً. تشعر بالجودة.\u201d', who: 'عميلة، بغداد — تقييم 5 نجوم' }
      ]
    },
    ticker: ['الذاكرة والتركيز', 'تعزيز الطاقة', 'دعم المناعة', 'إزالة السموم', 'التعب المزمن', 'ضغط الدم', 'التوتر والقلق', 'تعافي العضلات', 'الحيوية', 'صحة الغدة الدرقية', 'انقطاع الطمث', 'التعافي بعد السفر', 'الاستقلاب', 'الأداء الرياضي', 'البشرة والإشراق', 'استعادة النشاط', 'تحسين النوم', 'مكافحة الشيخوخة'],
    stats: { kicker: 'بالأرقام', labels: ['علامة علاج وريدي مسجّلة في العراق', 'مقدّم رعاية صحية في الشبكة', 'علاج وريدي مُقدَّم', 'متخصص طبي مرخّص'] },
    menu: {
      kicker: 'كتالوج إنفيتا', title: 'ثلاثة عشر بروتوكولاً من Liquivida®.',
      lead: 'يبدأ كل بروتوكول باستشارة طبية خاصة. اختر الفئة، واطّلع على التركيبة السريرية، واحجز مباشرة.',
      all: 'الكل', book: 'احجز', bestFor: 'مناسب لـ', formula: 'التركيبة السريرية', details: 'عرض التفاصيل الكاملة',
      disclaimer: 'يشمل السعر تقييماً طبياً مجانياً. قد يوصي الطبيب بتعديل البروتوكول وفق حالتك الفردية.'
    },
    tiers: { Signature: 'المميّزة', Wellness: 'العافية', Performance: 'الأداء', Beauty: 'الجمال' },
    matcher: { kicker: 'مطابقة شخصية', title: 'أي بروتوكول يناسبك؟', lead: 'حدّد هدفك الصحي — ونرشّح لك البروتوكول الأنسب.', resultsTitle: 'البروتوكولات المرشّحة لك' },
    how: {
      kicker: 'العملية', title: 'استشارة. تسريب. نتيجة.',
      steps: [
        { n: '01', title: 'الاستشارة', body: 'تبدأ كل جلسة باستشارة طبية لمراجعة تاريخك الصحي وأهدافك، وتحديد البروتوكول الأنسب.' },
        { n: '02', title: 'التسريب', body: 'يُعطى العلاج بإشراف متخصص طبي بينما تستريح — وتصل المغذيات إلى الدورة الدموية مباشرة.' },
        { n: '03', title: 'النتيجة', body: 'يلاحظ معظم العملاء تحسّناً في الطاقة والتركيز خلال ساعات من الجلسة.' }
      ]
    },
    science: {
      kicker: 'المنهج العلمي', title: 'توافر حيوي كامل. دون فقدان هضمي.',
      copy: 'يحدّ الجهاز الهضمي من امتصاص الفيتامينات الفموية. يوصل العلاج الوريدي المغذيات مباشرة إلى الدورة الدموية — بامتصاص كامل وفاعلية أعلى.',
      ivLabel: 'التسريب الوريدي — مباشرة إلى الدم', ivVal: '100%',
      oralLabel: 'المكملات الفموية — يحدّها الهضم', oralVal: '10–30%',
      props: [
        { n: '01', t: 'توافر حيوي كامل', b: 'توصل المكملات الفموية 10–30% فقط من مغذياتها، فيما يصل التسريب الوريدي إلى الدورة الدموية مباشرة.' },
        { n: '02', t: 'صيغ Liquivida® الأمريكية', b: 'بروتوكولات سريرية مطوّرة في الولايات المتحدة — تُقدَّم اليوم في بغداد وفق المعايير ذاتها.' },
        { n: '03', t: 'إشراف طبي', b: 'تُصرف جميع العلاجات بعد تقييم طبي شامل، وبمكونات بدرجة صيدلانية.' },
        { n: '04', t: 'تقييم طبي مجاني', b: 'يخضع كل عميل لتقييم طبي مجاني قبل التوصية بأي بروتوكول.' }
      ]
    },
    visit: {
      kicker: 'الزيارة', title: 'جناح خاص في المنصور. أو في منزلك.',
      copy: 'مساحة خاصة هادئة وضيافة راقية، مع متخصص طبي يرافقك قبل الجلسة وأثناءها وبعدها.',
      suiteName: 'جناح إنفيتا — المنصور', suiteDesc: 'أجنحة علاج خاصة. بحجز مسبق فقط.',
      homeName: 'الخدمة المنزلية', homeDesc: 'زيارات تمريضية مرخّصة في بغداد — خدمة مميزة.',
      hours: 'الأحد–الخميس 9:00–20:00 · الجمعة 14:00–20:00 · السبت 10:00–18:00'
    },
    booking: {
      kicker: 'حجز كونسيرج', title: 'احجز استشارتك.',
      lead: 'تجربة رعاية بإرشاد طبي — تبدأ بتقييم مجاني قبل أي علاج.',
      steps: ['بروتوكولك', 'زيارتك', 'بياناتك', 'التأكيد'],
      chooseTitle: 'اختر بروتوكولك', locTitle: 'أين تفضّل جلستك؟',
      dateTitle: 'اختر التاريخ', timeTitle: 'الأوقات المتاحة', detailsTitle: 'بياناتك',
      nameL: 'الاسم الكامل', phoneL: 'الهاتف (واتساب)', noteL: 'أهدافك الصحية (اختياري)',
      err: 'يرجى إدخال الاسم ورقم واتساب صحيح.',
      back: 'رجوع', continue: 'متابعة', confirm: 'تأكيد الحجز', change: 'تغيير',
      confTitle: 'تم استلام طلبك', confBody: 'سيتواصل فريقنا الطبي لتأكيد موعدك عبر واتساب خلال 24 ساعة. يرجى الاحتفاظ برقم الحجز.',
      refL: 'رقم الحجز', sumProtocol: 'البروتوكول', sumWhere: 'المكان', sumWhen: 'الموعد', sumName: 'الاسم',
      whatsapp: 'تواصل عبر واتساب', again: 'حجز جديد',
      trust: 'كوادر طبية مرخّصة · جناح خاص · صيغ Liquivida® الأمريكية'
    },
    b2b: {
      kicker: 'للعيادات والشركاء', title: 'شريك موثوق للأطباء والعيادات.',
      copy: 'نوفر للمؤسسات الصحية منظومة متكاملة: تعليماً سريرياً، وبروتوكولات إعطاء موحّدة، وامتثالاً تنظيمياً، وسلسلة توريد موثوقة.',
      stat: '37+', statL: 'جهة رعاية صحية ضمن شبكة إنفيتا',
      points: [
        { t: 'التدريب السريري', b: 'تعليم سريري وبروتوكولات وتأهيل لكوادر المرافق الشريكة.' },
        { t: 'التوريد المؤسسي', b: 'صيغ Liquivida® السريرية للعيادات والمستشفيات في عموم العراق.' },
        { t: 'البروتوكولات والامتثال', b: 'إعطاء موحّد وتوثيق دقيق وتوافق مع لوائح وزارة الصحة.' },
        { t: 'الدعم العلمي', b: 'خط مباشر مع فريقنا السريري لدعم شركاء الشبكة.' }
      ],
      cta: 'كن شريكاً', cta2: 'اطلب معلومات'
    },
    membership: {
      kicker: 'دائرة إنفيتا', title: 'العضوية.',
      tiers: [
        { name: 'Invita Circle', price: '2,400,000 د.ع / سنوياً', tag: '', perks: ['جلسة Immunity Shield شهرية', 'أولوية الحجز عبر الكونسيرج', 'خصم 15% على فحوصات DNA', 'زيارتان منزليتان سنوياً'] },
        { name: 'Longevity', price: '5,800,000 د.ع / سنوياً', tag: 'الأكثر طلباً', perks: ['كل مزايا الدائرة', 'NAD+ Performance كل ربع سنة', 'فحص Longevity DNA سنوي', 'خط مباشر مع الطبيب'] }
      ],
      cta: 'اطلب استشارة العضوية'
    },
    dna: { kicker: 'مختبر إنفيتا للحمض النووي', title: 'ذكاء جينومي.', copy: 'فحوصات جينية مع تفسير طبي خاص — للتغذية وطول العمر والاستجابة الدوائية.', link: 'تحدث مع فريقنا الطبي' },
    video: { kicker: 'على الشاشة', title: 'اكتشف تسريبك القادم.', lead: 'كل تركيبة، ومكوناتها، وفوائدها — في دقيقتين.' },
    celebs: { kicker: 'العافية العالمية', title: 'المشاهير يحبون العلاج الوريدي.', lead: 'من الرياضيين إلى روّاد العافية — أصبح العلاج الوريدي جزءاً من روتين الأداء والتعافي حول العالم.', note: 'شخصيات عامة خلال جلسات علاج وريدي في عيادات رائدة في المنطقة.', prev: 'السابق', next: 'التالي' },
    film: { kicker: 'داخل إنفيتا', title: 'شاهد التجربة.', copy: 'جناح هادئ وممارسة سريرية دقيقة وصيغ Liquivida\u00ae — شاهد تجربة الجلسة قبل حجزها.', note: 'أسقط صورة الغلاف على الإطار — أرسل فيديو عيادتك وسيُعرض هنا.' },
    ig: { kicker: '@invita_iv_drips', title: 'من الجناح.', follow: 'تابعنا على إنستغرام' },
    faq: {
      kicker: 'أسئلة', title: 'أسئلة، بإجابات واضحة.',
      items: [
        { q: 'هل العلاج الوريدي آمن؟', a: 'نعم. جميع البروتوكولات صيغ Liquivida® طوّرها أطباء وصيادلة معتمدون، وتُعطى بإشراف متخصصين طبيين — مع تقييم سلامة قبل كل علاج.' },
        { q: 'كم تستغرق الجلسة؟', a: 'عادة 30–60 دقيقة، وبروتوكولات NAD+ نحو 90 دقيقة — بعد استشارة طبية قصيرة (15 دقيقة) لمراجعة تاريخك الصحي وأهدافك.' },
        { q: 'أتناول الفيتامينات — لماذا الوريدي؟', a: 'الامتصاص الفموي محدود (10–30% تقريباً). يوصل التسريب الوريدي المغذيات إلى الدورة الدموية مباشرة وبتوافر حيوي كامل.' },
        { q: 'كم مرة أحتاج الجلسات؟', a: 'يوصي أخصائيك بجدول شخصي بعد الاستشارة — جلسات أسبوعية لبعض الأهداف أو شهرية للصيانة.' },
        { q: 'ما النتائج المتوقعة؟', a: 'تصل المغذيات إلى الدورة الدموية مباشرة، لذا يلاحظ معظم العملاء تحسناً في الطاقة والتركيز والنوم والتعافي خلال وقت قصير.' },
        { q: 'من يمكنه تلقي العلاج الوريدي؟', a: 'معظم البالغين الأصحاء مؤهلون. يخضع كل عميل لتقييم أهلية طبي قبل العلاج. علاجات إنفيتا لتحسين العافية — لا لتشخيص الأمراض أو علاجها.' },
        { q: 'ماذا أتوقع عند وصولي؟', a: 'يستقبلك فريقنا في مساحة خاصة مريحة، ويرافقك متخصص طبي طوال الجلسة للإجابة عن أسئلتك.' }
      ]
    },
    close: { l1: 'ابدأ رحلتك مع', l2: 'رواد العلاج الوريدي في العراق.', ctaBook: 'احجز جلستك الآن', ctaPartner: 'كن شريكاً' },
    footer: {
      tagline: 'الشركة الرائدة للعلاج الوريدي في العراق',
      contact: 'تواصل', hours: 'ساعات العمل', explore: 'استكشف',
      address: 'المنصور، بغداد، العراق',
      hoursLines: 'الأحد – الخميس: 9:00 – 20:00 — الجمعة: 14:00 – 20:00 — السبت: 10:00 – 18:00',
      links: [
        { label: 'المغذيات الوريدية', href: '#menu' }, { label: 'العلم', href: '#science' },
        { label: 'للعيادات', href: '#clinics' }, { label: 'الحجز', href: '#book' },
        { label: 'العضوية', href: '#membership' }, { label: 'قائمة التسريب (للطباعة)', href: 'menu-inner.html' }, { label: 'إنستغرام', href: 'https://www.instagram.com/invita_iv_drips/' }
      ],
      disclaimer: 'تُقدَّم جميع العلاجات بإشراف متخصصين طبيين مرخّصين، وفق لوائح وزارة الصحة العراقية.',
      copyright: '© 2026 إنفيتا — الشريك المعتمد لمنتجات Liquivida® في العراق.'
    }
  };

  componentDidMount() {
    try { const saved = localStorage.getItem('invita-lang'); if (saved === 'ar' || saved === 'en') this.setState({ lang: saved }); } catch (e) {}
    this._driveMarquees();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.setState({ statP: 1 }); return; }
    const el = this._statsEl;
    if (!el || typeof IntersectionObserver === 'undefined') { this.setState({ statP: 1 }); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) { io.disconnect(); this._countUp(); }
    }, { threshold: 0.25 });
    io.observe(el);
    this._io = io;
  }
  componentWillUnmount() { if (this._io) this._io.disconnect(); }


  _driveMarquees() {
    if (this._mrf) return;
    const off = new WeakMap();
    let last = Date.now();
    const ch = new MessageChannel();
    ch.port1.onmessage = () => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      if (dt >= 0.03) {
        last = now;
        const d = Math.min(dt, 0.1);
        document.querySelectorAll('[data-marquee]').forEach((el) => {
          const sp = parseFloat(el.getAttribute('data-marquee')) || 60;
          let o = (off.get(el) || 0) - sp * d;
          const half = el.scrollWidth / 2;
          if (half > 0 && -o >= half) o += half;
          off.set(el, o);
          if (el.style.animation !== 'none') el.style.animation = 'none';
          el.style.transform = 'translate3d(' + o + 'px,0,0)';
        });
        const cel = this._celebEl;
        if (cel && !this._celebHold) {
          this._celebNext = this._celebNext || now + 3500;
          if (now >= this._celebNext) {
            this._celebNext = now + 3500;
            const stepW = Math.min(320, cel.clientWidth * 0.8);
            if (Math.abs(cel.scrollLeft) + cel.clientWidth >= cel.scrollWidth - 12) this._celebTarget = 0;
            else this._celebTarget = cel.scrollLeft + (getComputedStyle(cel).direction === 'rtl' ? -stepW : stepW);
          }
        }
        if (cel && this._celebTarget != null) {
          const diff = this._celebTarget - cel.scrollLeft;
          cel.scrollLeft += Math.sign(diff) * Math.min(Math.abs(diff), 900 * d);
          if (Math.abs(diff) < 2) { cel.scrollLeft = this._celebTarget; this._celebTarget = null; }
        }
      }
      ch.port2.postMessage(0);
    };
    this._mrf = ch;
    ch.port2.postMessage(0);
  }

  _countUp() {
    const t0 = performance.now(), dur = 1500;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const q = Math.round((1 - Math.pow(1 - p, 3)) * 24) / 24;
      if (q !== this.state.statP) this.setState({ statP: q });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  _lang() { return this.state.lang || this.props.lang || 'en'; }

  _scrollToBook() {
    const el = document.getElementById('book');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  _celebScroll(d) {
    const el = this._celebEl;
    if (!el) return;
    const fig = el.querySelector('figure');
    const stride = fig ? fig.getBoundingClientRect().width + 18 : 308;
    const perPage = Math.max(1, Math.floor(el.clientWidth / stride));
    const idx = Math.round(el.scrollLeft / stride);
    el.scrollTo({ left: (idx + d * perPage) * stride, behavior: 'smooth' });
  }

  _startBooking(slug) {
    this.setState({ bookDrip: slug, bookStep: 2, formErr: false });
    this._scrollToBook();
  }

  renderVals() {
    const lang = this._lang();
    const ar = lang === 'ar';
    const t = ar ? this.AR : this.EN;
    const fmtPrice = (n) => n.toLocaleString('en-US') + (ar ? ' د.ع' : ' IQD');
    const chip = (active, extra) => Object.assign({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      padding: '9px 16px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px',
      lineHeight: 1.2, borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap',
      border: active ? '1px solid #0F2341' : '1px solid color-mix(in srgb,#0F2341 24%,transparent)',
      background: active ? '#0F2341' : 'transparent', color: active ? '#F0EDE4' : '#0F2341'
    }, extra || {});
    const s = this.state;

    // drip menu
    const all = this.DRIPS;
    const filtered = s.tier === 'all' ? all : all.filter((d) => d.tier === s.tier);
    const drips = filtered.map((d) => {
      const i = all.indexOf(d);
      const loc = ar ? d.ar : d.en;
      return {
        num: String(i + 1).padStart(2, '0'), name: d.name, tag: loc.tag, desc: loc.desc, formula: d.formula, icon: this.ICONS[d.slug], href: 'drips/' + d.slug + '.html', post: this.POST_IMGS[d.slug] || null, story: this.STORIES[d.slug], hasStory: this.POSTS.includes(d.slug), noStory: !this.POSTS.includes(d.slug),
        tierLabel: t.tiers[d.tier], price: fmtPrice(d.price),
        mins: ar ? d.min + ' دقيقة' : d.min + ' min',
        uses: (this.USES[d.slug] || { en: [], ar: [] })[ar ? 'ar' : 'en'],
        open: s.openDrip === d.slug, panelId: 'panel-' + d.slug,
        toggle: () => this.setState((st) => ({ openDrip: st.openDrip === d.slug ? null : d.slug })),
        book: () => this._startBooking(d.slug)
      };
    });
    const tierOpts = [{ id: 'all', label: t.menu.all }].concat(
      ['Signature', 'Wellness', 'Performance', 'Beauty'].map((id) => ({ id, label: t.tiers[id] }))
    ).map((o) => {
      const active = s.tier === o.id;
      return {
        label: o.label, active,
        style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 13px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: active ? '#0F2341' : 'transparent', color: active ? '#F0EDE4' : '#0F2341' },
        pick: () => this.setState({ tier: o.id, openDrip: null })
      };
    });

    // matcher
    const goals = this.GOALS.map((g) => ({
      label: ar ? g.ar : g.en,
      style: chip(s.goal === g.id),
      pick: () => this.setState({ goal: g.id })
    }));
    const goalDef = this.GOALS.find((g) => g.id === s.goal);
    const matches = goalDef ? goalDef.drips.map((slug, idx) => {
      const d = all.find((x) => x.slug === slug);
      return {
        rank: String(idx + 1).padStart(2, '0'), name: d.name,
        tag: ar ? d.ar.tag : d.en.tag, price: fmtPrice(d.price),
        book: () => this._startBooking(d.slug)
      };
    }) : [];

    // stats
    const p = s.statP;
    const statNums = [null, 37, 5000, 12];
    const stats = t.stats.labels.map((label, i) => ({
      label,
      val: i === 0 ? (ar ? 'الأولى' : '1st') : Math.round(statNums[i] * p).toLocaleString('en-US') + '+'
    }));

    // booking
    const step = s.bookStep;
    const bookRail = t.booking.steps.map((label, i) => {
      const n = i + 1, on = step >= n;
      return {
        n: '0' + n, label,
        numStyle: { width: '26px', height: '26px', borderRadius: '50%', display: 'grid', placeItems: 'center', flex: 'none', fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-heading)', background: on ? 'var(--color-accent)' : 'var(--color-neutral-300)', color: on ? 'var(--color-bg)' : 'var(--color-neutral-700)' },
        labelStyle: { fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: step === n ? 1 : 0.55, fontWeight: step === n ? 700 : 400 }
      };
    });
    const protoOpts = all.map((d) => ({
      label: d.name + ' · ' + fmtPrice(d.price),
      style: chip(s.bookDrip === d.slug, { whiteSpace: 'normal', textAlign: 'start' }),
      pick: () => this.setState({ bookDrip: d.slug, bookStep: 2 })
    }));
    const selDrip = all.find((d) => d.slug === s.bookDrip);
    const bookDripLabel = selDrip ? selDrip.name + ' — ' + fmtPrice(selDrip.price) : '';
    const locDefs = [
      { id: 'suite', title: t.visit.suiteName, sub: t.visit.suiteDesc },
      { id: 'home', title: t.visit.homeName, sub: t.visit.homeDesc }
    ];
    const optStyle = (active) => ({
      textAlign: 'start', cursor: 'pointer', padding: '14px 16px', fontFamily: 'var(--font-body)', color: 'var(--color-text)', borderRadius: '12px',
      border: active ? '2px solid var(--color-accent)' : '2px solid var(--color-divider)',
      background: active ? 'var(--color-accent-100)' : 'transparent'
    });
    const locOpts = locDefs.map((l) => ({ title: l.title, sub: l.sub, style: optStyle(s.bookLoc === l.id), pick: () => this.setState({ bookLoc: l.id }) }));
    const dayFmt = new Intl.DateTimeFormat(ar ? 'ar-IQ' : 'en-GB', { weekday: 'short' });
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const dt = new Date(); dt.setDate(dt.getDate() + i); dt.setHours(12, 0, 0, 0);
      const ts = dt.getTime(), active = s.bookDay === ts;
      days.push({
        wd: dayFmt.format(dt), dnum: String(dt.getDate()),
        style: Object.assign(optStyle(active), { padding: '10px 14px', minWidth: '62px', textAlign: 'center' }),
        pick: () => this.setState({ bookDay: ts, bookTime: null })
      });
    }
    const slotBase = ['09:00', '09:30', '10:00', '11:00', '12:00', '13:00', '16:00', '16:30', '17:00', '18:00', '19:00', '19:30'];
    const dayNum = s.bookDay ? new Date(s.bookDay).getDate() : 0;
    const slots = slotBase.map((label, i) => {
      const off = !s.bookDay || i === (dayNum * 5) % 12 || i === (dayNum * 5 + 4) % 12;
      return {
        label, off,
        style: chip(s.bookTime === label, { fontFeatureSettings: "'tnum' 1", opacity: off ? 0.4 : 1, cursor: off ? 'not-allowed' : 'pointer' }),
        pick: () => this.setState({ bookTime: label })
      };
    });
    const cantSchedule = !(s.bookLoc && s.bookDay && s.bookTime);
    const whenStr = s.bookDay
      ? new Intl.DateTimeFormat(ar ? 'ar-IQ' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(s.bookDay)) + ' · ' + (s.bookTime || '')
      : '';
    const locSel = locDefs.find((l) => l.id === s.bookLoc);
    const sumRows = [
      { k: t.booking.refL, v: s.bookRef || '' },
      { k: t.booking.sumProtocol, v: selDrip ? selDrip.name : '' },
      { k: t.booking.sumWhere, v: locSel ? locSel.title : '' },
      { k: t.booking.sumWhen, v: whenStr },
      { k: t.booking.sumName, v: s.name }
    ];

    return {
      t, dir: ar ? 'rtl' : 'ltr', arrow: ar ? '←' : '→',
      navOpen: !!this.state.navOpen, navToggle: () => this.setState({ navOpen: !this.state.navOpen }), navClose: () => this.setState({ navOpen: false }),
      langLabel: ar ? 'EN' : 'عربي',
      toggleLang: () => { const nx = ar ? 'en' : 'ar'; try { localStorage.setItem('invita-lang', nx); } catch (e) {} this.setState({ lang: nx }); },
      showPromo: this.props.showPromo ?? true,
      heroTags: t.hero.tags,
      tickerItems: t.ticker.concat(t.ticker),
      doctorCards: this.DOCTOR_CARDS.concat(this.DOCTOR_CARDS),
      srcRef: (el) => { if (el) { const s = el.getAttribute('data-inv-src'); if (s && el.getAttribute('src') !== s) el.setAttribute('src', s); } },
      statsRef: (el) => { this._statsEl = el; },
      celebs: this.CELEBS,
      celebRef: (el) => { this._celebEl = el; if (el && !el._invAuto) { el._invAuto = true; el.addEventListener('pointerenter', () => { this._celebHold = true; }); el.addEventListener('pointerleave', () => { this._celebHold = false; }); el.addEventListener('touchstart', () => { this._celebHold = true; setTimeout(() => { this._celebHold = false; }, 6000); }, { passive: true }); } },
      celebLeft: () => this._celebScroll(-1),
      celebRight: () => this._celebScroll(1),
      stats, tierOpts, drips, goals, matches, hasGoal: !!goalDef,
      bookRail, protoOpts, bookDripLabel, locOpts, days, slots, cantSchedule,
      contBtnStyle: Object.assign(chip(true), { opacity: cantSchedule ? 0.45 : 1, cursor: cantSchedule ? 'not-allowed' : 'pointer' }),
      isStep1: step === 1, isStep2: step === 2, isStep3: step === 3, isStep4: step === 4,
      backTo1: () => this.setState({ bookStep: 1 }),
      backTo2: () => this.setState({ bookStep: 2, formErr: false }),
      contStep3: () => this.setState({ bookStep: 3 }),
      nameVal: s.name, phoneVal: s.phone, noteVal: s.note,
      setName: (e) => this.setState({ name: e.target.value }),
      setPhone: (e) => this.setState({ phone: e.target.value }),
      setNote: (e) => this.setState({ note: e.target.value }),
      hasErr: s.formErr,
      pb: ar
        ? { kicker: 'شركاؤنا', title: 'موثوقون لدى العيادات في أنحاء العراق.', copy: 'شاهد كيف تتعاون إنفيتا مع العيادات والمستشفيات والأطباء — تدريب وتوريد ودعم سريري تحت سقف واحد.', btn: 'صفحة شركائنا' }
        : { kicker: 'Our partners', title: 'Trusted by clinics across Iraq.', copy: 'Watch how Invita partners with clinics, hospitals, and physicians — training, supply, and clinical support under one roof.', btn: 'Visit our partners page' },
      filmRef: (el) => {
        if (el && !el._invWired) {
          el._invWired = true;
          const K = 'invita-film-pos';
          const saved = parseFloat(localStorage.getItem(K));
          el.addEventListener('loadedmetadata', () => {
            if (!isNaN(saved) && saved > 1 && saved < el.duration - 2) el.currentTime = saved;
          });
          el.addEventListener('timeupdate', () => {
            if (!el.paused) localStorage.setItem(K, String(el.currentTime));
          });
        }
      },
      submitBooking: (e) => {
        e.preventDefault();
        const digits = (s.phone.match(/\d/g) || []).length;
        if (!s.name.trim() || digits < 9) { this.setState({ formErr: true }); return; }
        const drip = all.find((d) => d.slug === s.bookDrip);
        const dripName = drip ? drip.name : (ar ? 'محلول فيتامينات' : 'IV drip');
        const msg = ar
          ? ('مرحباً، أود حجز جلسة ' + dripName + '.\nالاسم: ' + s.name.trim() + '\nالهاتف: ' + s.phone.trim() + (s.note.trim() ? ('\nملاحظة: ' + s.note.trim()) : ''))
          : ("Hi! I'd like to book the " + dripName + " IV drip.\nName: " + s.name.trim() + "\nPhone: " + s.phone.trim() + (s.note.trim() ? ("\nNote: " + s.note.trim()) : ''));
        const wa = 'https://wa.me/9647748885559?text=' + encodeURIComponent(msg);
        this.setState({ formErr: false, bookRef: 'INV-' + (1000 + Math.floor(Math.random() * 9000)), bookStep: 4 });
        this._scrollToBook();
        try { window.open(wa, '_blank', 'noopener'); } catch (err) {}
      },
      resetBooking: () => this.setState({ bookStep: 1, bookDrip: null, bookLoc: null, bookDay: null, bookTime: null, name: '', phone: '', note: '', bookRef: null, formErr: false }),
      sumRows,
      waConfirmHref: (() => {
        const drip = all.find((d) => d.slug === s.bookDrip);
        const dripName = drip ? drip.name : (ar ? 'محلول فيتامينات' : 'IV drip');
        const msg = ar
          ? ('مرحباً، أود حجز جلسة ' + dripName + '.')
          : ("Hi! I'd like to book the " + dripName + ' IV drip.');
        return 'https://wa.me/9647748885559?text=' + encodeURIComponent(msg);
      })(),
      memTiers: t.membership.tiers.map((m) => ({
        name: m.name, price: m.price, perks: m.perks, tag: m.tag, hasTag: !!m.tag,
        style: { borderTop: m.tag ? '3px solid #D9B344' : '2px solid var(--color-divider)' }
      }))
    };
  }
}
