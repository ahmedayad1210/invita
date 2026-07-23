
const React = {
  createElement(type, props, ...children) {
    return { __el: true, type, props: props || {}, children };
  }
};
window.InvitaPages = window.InvitaPages || {};
window.InvitaPages.drip = class Component {
  ORDER = ['energy-boost','immune-boost','hair-skin-nails','panthenol-b5','myers-cocktail','dopamin-booster','skin-radiance','nad-plus','weight-loss','fertility-libido','cola-drip-iron','jet-fuel','edta-chelation'];

  DRIPS = {
    'energy-boost': { tier: 'Wellness', min: 45, price: 150000, name: 'Energy Boost',
      formula: 'B1 100mg · B2 25mg · B3 200mg · B6 250mg · B12 1000mcg · Magnesium Sulphate 200mg · Amino Acids',
      en: { tag: 'Instant recharge against chronic fatigue and burnout', desc: 'A fast-acting infusion for anyone running on empty — busy professionals, parents, or those recovering from illness. It replenishes the B-vitamins and magnesium your body burns through under stress, restoring clean energy, steadier mood, and sharper focus without the crash of caffeine or sugar.',
        benefits: ['Fast, clean energy without the crash','Better mood, focus, and stress response','Replenishes B-vitamins and magnesium','Supports nerves and muscle recovery'],
        goodFor: ['Busy professionals','Post-illness fatigue','Low daily energy'] },
      ar: { tag: 'شحن فوري ضد التعب المزمن والإجهاد', desc: 'تسريب سريع المفعول لكل من يشعر بالإنهاك — للمهنيين المشغولين والآباء أو المتعافين من المرض. يعوّض فيتامينات B والمغنيسيوم التي يستهلكها الجسم تحت الضغط، فيعيد طاقة نظيفة ومزاجاً أكثر استقراراً وتركيزاً أوضح دون هبوط الكافيين أو السكر.',
        benefits: ['طاقة سريعة ونظيفة دون هبوط','مزاج وتركيز أفضل واستجابة أفضل للتوتر','تعويض فيتامينات B والمغنيسيوم','دعم الأعصاب وتعافي العضلات'],
        goodFor: ['المهنيون المشغولون','التعب بعد المرض','انخفاض الطاقة اليومية'] } },
    'immune-boost': { tier: 'Wellness', min: 45, price: 165000, name: 'Immune Boost',
      formula: 'Vitamin C 1000mg · Zinc 100mg · Calcium 2mmol · Potassium 5mmol · Bicarbonate 25mmol',
      en: { tag: 'Fortify your defences and recover faster', desc: 'A high-dose vitamin C and zinc infusion that reinforces your immune system at the first sign of a cold — or preventively before travel and through flu season. Delivered straight to the bloodstream for rapid, high absorption.',
        benefits: ['High-dose vitamin C to fortify defences','Zinc to support immune response','Helps shorten and soften illness','Ideal before travel or flu season'],
        goodFor: ['Before travel','Cold & flu season','Feeling run down'] },
      ar: { tag: 'حصّن مناعتك وتعافَ أسرع', desc: 'تسريب بجرعة عالية من فيتامين C والزنك يعزّز جهاز المناعة عند أول أعراض البرد — أو وقائياً قبل السفر وخلال موسم الإنفلونزا. يصل مباشرة إلى الدم لامتصاص سريع وعالٍ.',
        benefits: ['جرعة عالية من فيتامين C لتقوية المناعة','زنك لدعم الاستجابة المناعية','يساعد على تقصير وتخفيف المرض','مثالي قبل السفر أو موسم الإنفلونزا'],
        goodFor: ['قبل السفر','موسم البرد والإنفلونزا','الشعور بالإرهاق'] } },
    'hair-skin-nails': { tier: 'Beauty', min: 45, price: 180000, name: 'Hair, Nail & Skin',
      formula: 'Biotin 10,000mcg · Zinc 10mg/ml',
      en: { tag: 'Biotin boost for beauty from within', desc: 'A concentrated biotin and zinc infusion targeting hair thickness, nail strength, and skin health from the inside out. A favourite for postpartum shedding, brittle nails, and dull skin — best over a short weekly course.',
        benefits: ['High-dose biotin for hair and nails','Reduces shedding and breakage','Improves skin freshness and glow','Ideal for postpartum or brittle nails'],
        goodFor: ['Thinning hair','Brittle nails','Dull skin'] },
      ar: { tag: 'بيوتين لجمالٍ من الداخل', desc: 'تسريب مركّز من البيوتين والزنك يستهدف كثافة الشعر وقوة الأظافر وصحة البشرة من الداخل. خيار مفضّل لتساقط ما بعد الولادة والأظافر الهشة والبشرة الباهتة — يُفضّل ضمن جلسات أسبوعية قصيرة.',
        benefits: ['بيوتين بجرعة عالية للشعر والأظافر','تقليل التساقط والتقصف','تحسين نضارة البشرة وإشراقها','مثالي لما بعد الولادة أو الأظافر الهشة'],
        goodFor: ['تساقط الشعر','الأظافر الهشة','البشرة الباهتة'] } },
    'panthenol-b5': { tier: 'Beauty', min: 45, price: 175000, name: 'Panthenol (B5)',
      formula: 'Dexpanthenol 250mg/ml',
      en: { tag: 'Deep hydration and cellular renewal', desc: 'A dexpanthenol infusion that deeply hydrates skin at the cellular level, supports repair, calms irritation and redness, and restores a natural, healthy radiance.',
        benefits: ['Deep, lasting skin hydration','Supports cellular repair','Calms irritation and redness','Restores natural radiance'],
        goodFor: ['Dry, dehydrated skin','Irritated skin','Dullness'] },
      ar: { tag: 'ترطيب عميق وتجديد الخلايا', desc: 'تسريب من الدكسبانثينول يرطّب البشرة بعمق على مستوى الخلايا، ويدعم الإصلاح، ويهدّئ التهيّج والاحمرار، ويعيد إشراقاً طبيعياً وصحياً.',
        benefits: ['ترطيب عميق ودائم للبشرة','دعم إصلاح الخلايا','تهدئة التهيّج والاحمرار','استعادة الإشراق الطبيعي'],
        goodFor: ['البشرة الجافة','البشرة المتهيجة','البهتان'] } },
    'myers-cocktail': { tier: 'Signature', min: 45, price: 210000, name: "Myer's Cocktail",
      formula: 'Vitamin C 1000mg · B1, B2, B3, B6, B12 · Magnesium 200mg · Calcium 100mg · Zinc 10mg · NAD+ 100mg',
      en: { tag: 'The original broad-spectrum wellness infusion', desc: 'The classic multi-nutrient blend, refined by Invita — supporting energy, immunity, and the nervous system in one comprehensive session. A trusted go-to for chronic fatigue, tension, and overall wellbeing.',
        benefits: ['The original broad-spectrum wellness blend','Supports energy, immunity, and nerves','Eases stress, fatigue, and tension','A trusted go-to for overall wellbeing'],
        goodFor: ['General wellness','Chronic fatigue','Stress & tension'] },
      ar: { tag: 'التسريب الأصلي واسع الطيف للعافية', desc: 'الخلطة الكلاسيكية متعددة العناصر بصياغة إنفيتا — تدعم الطاقة والمناعة والجهاز العصبي في جلسة شاملة واحدة. خيار موثوق للتعب المزمن والتوتر والعافية العامة.',
        benefits: ['الخلطة الأصلية واسعة الطيف للعافية','دعم الطاقة والمناعة والأعصاب','تخفيف التوتر والإجهاد والتشنج','الخيار الموثوق للعافية العامة'],
        goodFor: ['العافية العامة','التعب المزمن','التوتر والإجهاد'] } },
    'dopamin-booster': { tier: 'Performance', min: 45, price: 195000, name: 'Dopamin Booster',
      formula: 'Citicoline 250mg / 5ml',
      en: { tag: 'Sharper focus, memory, and mental performance', desc: 'A citicoline infusion that supports memory, focus, and mental clarity while fuelling brain function under pressure — ideal for demanding mental work and study.',
        benefits: ['Sharper focus and attention','Supports memory and mental clarity','Fuels brain function under pressure','Supports healthy nerve cells'],
        goodFor: ['Demanding mental work','Brain fog','Study & focus'] },
      ar: { tag: 'تركيز وذاكرة وأداء ذهني أفضل', desc: 'تسريب من السيتيكولين يدعم الذاكرة والتركيز والصفاء الذهني ويغذّي وظائف الدماغ تحت الضغط — مثالي للعمل الذهني المكثف والدراسة.',
        benefits: ['تركيز وانتباه أعلى','دعم الذاكرة والصفاء الذهني','تغذية وظائف الدماغ تحت الضغط','دعم صحة الخلايا العصبية'],
        goodFor: ['العمل الذهني المكثف','التشويش الذهني','الدراسة والتركيز'] } },
    'skin-radiance': { tier: 'Beauty', min: 45, price: 225000, name: 'Skin Radiance',
      formula: 'Glutathione 2.4g · Vitamin C 1000mg',
      en: { tag: 'Brighten, even out, and glow', desc: 'A glutathione and vitamin C infusion — pairing the "master antioxidant" with high-dose C to brighten and even skin tone, reduce pigmentation over time, detoxify, and delay visible signs of ageing.',
        benefits: ['Glutathione, the master antioxidant','Brightens and evens skin tone','Reduces pigmentation over time','Detoxifies and delays signs of ageing'],
        goodFor: ['Uneven tone','Pre-event glow','Dull, tired skin'] },
      ar: { tag: 'تفتيح وتوحيد وإشراقة', desc: 'تسريب من الغلوتاثيون وفيتامين C — يجمع "مضاد الأكسدة الأعظم" مع جرعة عالية من فيتامين C لتفتيح وتوحيد لون البشرة، وتقليل التصبغات مع الوقت، وتنقية الجسم، وتأخير علامات الشيخوخة الظاهرة.',
        benefits: ['غلوتاثيون، مضاد الأكسدة الأعظم','تفتيح وتوحيد لون البشرة','تقليل التصبغات مع الوقت','تنقية الجسم وتأخير علامات الشيخوخة'],
        goodFor: ['لون غير موحّد','إشراقة قبل المناسبات','بشرة باهتة ومتعبة'] } },
    'nad-plus': { tier: 'Signature', min: 90, price: 285000, name: 'NAD+ Drips',
      formula: 'NAD+ 500mg in each Invita vial',
      en: { tag: 'Cellular energy and anti-ageing', desc: 'NAD+ is essential to how your cells make energy and repair themselves. This slow infusion helps restore cellular energy at the source, sharpen mental clarity, and support the nervous system — a cornerstone of longevity protocols.',
        benefits: ['Restores cellular energy at the source','Sharp mental focus and clarity','Advanced nerve and brain support','Helps counter age-related decline'],
        goodFor: ['Anti-ageing','Mental clarity','Cellular recovery'],
        note: 'Best results come from a short loading course of 4–6 sessions, followed by monthly maintenance. Infused slowly over ~90 minutes and titrated for comfort by your clinician.' },
      ar: { tag: 'طاقة خلوية ومكافحة الشيخوخة', desc: 'NAD+ أساسي لطريقة إنتاج خلاياك للطاقة وإصلاح نفسها. هذا التسريب البطيء يساعد على استعادة الطاقة الخلوية من مصدرها، وشحذ الصفاء الذهني، ودعم الجهاز العصبي — ركيزة في بروتوكولات إطالة العمر.',
        benefits: ['استعادة الطاقة الخلوية من مصدرها','تركيز ذهني حاد وصفاء','دعم متقدم للأعصاب والدماغ','مقاومة التراجع المرتبط بالعمر'],
        goodFor: ['مكافحة الشيخوخة','الصفاء الذهني','التعافي الخلوي'],
        note: 'أفضل النتائج تأتي من جلسات تحميل قصيرة (4–6 جلسات) تليها صيانة شهرية. يُسرَّب ببطء خلال ~90 دقيقة ويُضبط للراحة بإشراف طبيبك.' } },
    'weight-loss': { tier: 'Wellness', min: 45, price: 195000, name: 'Weight Loss Drip',
      formula: 'L-Carnitine 1000mg · Glutamine 300mg · Arginine 1g',
      en: { tag: 'Burn fat and support lean muscle', desc: 'An amino-acid infusion that helps stimulate fat metabolism, sustain energy through a calorie deficit, and preserve lean muscle — a supportive companion to a clinician-guided diet and training plan.',
        benefits: ['Stimulates fat metabolism','Sustains energy while dieting','Supports lean muscle','Complements diet and training'],
        goodFor: ['Active weight-loss plans','Low energy on a diet','Body recomposition'] },
      ar: { tag: 'حرق الدهون ودعم العضلات', desc: 'تسريب من الأحماض الأمينية يساعد على تحفيز أيض الدهون، والحفاظ على الطاقة أثناء العجز في السعرات، والمحافظة على العضلات — رفيق داعم لبرنامج حمية وتدريب بإشراف طبي.',
        benefits: ['تحفيز أيض الدهون','الحفاظ على الطاقة أثناء الرجيم','دعم العضلات','مكمّل للحمية والتمرين'],
        goodFor: ['برامج إنقاص الوزن','انخفاض الطاقة أثناء الحمية','إعادة تكوين الجسم'] } },
    'fertility-libido': { tier: 'Signature', min: 45, price: 240000, name: 'Fertility & Libido',
      formula: 'Glutathione 1.2g · L-Carnitine 1000mg · MIC (Methionine – Inositol – Choline)',
      en: { tag: 'Fertility, hormonal balance, and vitality', desc: 'A targeted blend supporting fertility for men and women, encouraging hormonal balance, and boosting libido and overall vitality — with antioxidant support for reproductive health.',
        benefits: ['Supports fertility for men and women','Encourages hormonal balance','Boosts libido and vitality','Antioxidant support for reproductive health'],
        goodFor: ['Hormonal balance','Low vitality','Reproductive wellness'] },
      ar: { tag: 'خصوبة وتوازن هرموني وحيوية', desc: 'خلطة مستهدفة تدعم الخصوبة للرجال والنساء، وتعزّز التوازن الهرموني، وترفع الرغبة والحيوية العامة — مع دعم مضاد للأكسدة للصحة الإنجابية.',
        benefits: ['دعم الخصوبة للرجال والنساء','تعزيز التوازن الهرموني','رفع الرغبة والحيوية','دعم مضاد للأكسدة للصحة الإنجابية'],
        goodFor: ['التوازن الهرموني','انخفاض الحيوية','الصحة الإنجابية'] } },
    'cola-drip-iron': { tier: 'Wellness', min: 30, price: 180000, name: 'Cola Drip (Iron)',
      formula: 'Iron Sucrose 200mg / 10ml',
      en: { tag: 'Treat anaemia and raise haemoglobin', desc: 'An iron sucrose infusion to correct iron-deficiency anaemia, raise haemoglobin, and relieve the dizziness and fatigue that come with low iron — restoring day-to-day activity and energy.',
        benefits: ['Treats iron-deficiency anaemia','Raises haemoglobin levels','Reduces dizziness and fatigue','Restores activity and energy'],
        goodFor: ['Iron deficiency','Low haemoglobin','Persistent fatigue'] },
      ar: { tag: 'علاج فقر الدم ورفع الهيموغلوبين', desc: 'تسريب من سكروز الحديد لتصحيح فقر الدم الناتج عن نقص الحديد، ورفع الهيموغلوبين، وتخفيف الدوخة والتعب المصاحبين لنقص الحديد — لاستعادة النشاط والطاقة اليومية.',
        benefits: ['علاج فقر الدم الناتج عن نقص الحديد','رفع مستويات الهيموغلوبين','تقليل الدوخة والتعب','استعادة النشاط والطاقة'],
        goodFor: ['نقص الحديد','انخفاض الهيموغلوبين','التعب المستمر'] } },
    'jet-fuel': { tier: 'Performance', min: 45, price: 175000, name: 'Jet Fuel',
      formula: 'B12 1000mcg · B2 25mg · B3 200mg · B6 250mg · Magnesium 250mg · Vitamin C 500mg',
      en: { tag: 'Power and endurance for body and mind', desc: 'A high-octane B-vitamin and magnesium blend that boosts physical and mental energy, raises stamina, and relieves exhaustion fast — ideal before events, competitions, or demanding work stretches.',
        benefits: ['Powerful physical and mental energy','Raises stamina and endurance','Relieves exhaustion fast','Ideal before events and heavy work'],
        goodFor: ['Athletes','Demanding schedules','Pre-event boost'] },
      ar: { tag: 'قوة وتحمّل للجسم والذهن', desc: 'خلطة عالية الفعالية من فيتامينات B والمغنيسيوم تعزّز الطاقة البدنية والذهنية، وترفع القدرة على التحمّل، وتخفّف الإرهاق سريعاً — مثالية قبل المناسبات والمنافسات أو فترات العمل المجهدة.',
        benefits: ['طاقة بدنية وذهنية قوية','رفع القدرة على التحمّل','تخفيف الإرهاق سريعاً','مثالية قبل المناسبات والأعمال المجهدة'],
        goodFor: ['الرياضيون','الجداول المزدحمة','دفعة قبل المناسبات'] } },
    'edta-chelation': { tier: 'Signature', min: 90, price: 240000, name: 'EDTA Chelation',
      formula: 'EDTA 150mg/ml',
      en: { tag: 'Vascular detox and heart health', desc: 'A chelation infusion that binds and helps clear toxic heavy metals from the body, supports cleansing of the blood vessels, and backs heart and circulatory health — always as part of a physician-guided protocol.',
        benefits: ['Helps clear toxic heavy metals','Supports vascular cleansing','Backs heart and circulatory health','Part of a physician-guided protocol'],
        goodFor: ['Heavy-metal detox','Vascular health','Heart support'],
        note: 'EDTA chelation is a medical protocol delivered over multiple sessions and requires clinician assessment before starting.' },
      ar: { tag: 'ديتوكس الأوعية وصحة القلب', desc: 'تسريب مخلبي يرتبط بالمعادن الثقيلة السامة ويساعد على إزالتها من الجسم، ويدعم تنقية الأوعية الدموية، ويدعم صحة القلب والدورة الدموية — دائماً ضمن بروتوكول بإشراف طبي.',
        benefits: ['يساعد على إزالة المعادن الثقيلة السامة','دعم تنقية الأوعية الدموية','دعم صحة القلب والدورة الدموية','ضمن بروتوكول بإشراف طبي'],
        goodFor: ['ديتوكس المعادن الثقيلة','صحة الأوعية','دعم القلب'],
        note: 'يُعطى العلاج المخلبي EDTA كبروتوكول طبي عبر عدة جلسات ويتطلب تقييماً طبياً قبل البدء.' } }
  };

  BAGS = {"energy-boost":"assets/bags/energy-boost.webp","immune-boost":"assets/bags/immune-boost.webp","hair-skin-nails":"assets/bags/hair-skin-nails.webp","panthenol-b5":"assets/bags/panthenol-b5.webp","myers-cocktail":"assets/bags/myers-cocktail.webp","dopamin-booster":"assets/bags/dopamin-booster.webp","skin-radiance":"assets/bags/skin-radiance.webp","nad-plus":"assets/bags/nad-plus.webp","weight-loss":"assets/bags/weight-loss.webp","fertility-libido":"assets/bags/fertility-libido.webp","cola-drip-iron":"assets/bags/cola-drip-iron.webp","edta-chelation":"assets/bags/edta-chelation.webp","jet-fuel":"assets/bags/jet-fuel.webp"};

  UI = {
    en: { allDrips: 'All drips', book: 'Book', home: 'Home', partners: 'Partners', menu: 'Drip menu', perSession: 'per session', approxTime: 'approx. time',
      bookThis: 'Book this drip', whatsapp: 'Ask on WhatsApp', overview: 'Overview', benefits: 'What it helps with',
      formula: 'Clinical formula', bestFor: 'Best for', howKicker: 'How it works', howTitle: 'Three simple steps.',
      faqTitle: 'Common questions', prev: 'Previous', next: 'Next',
      exploreKicker: 'Explore more', exploreTitle: 'Other Invita protocols',
      ctaBody: 'Every session begins with a private medical consultation. Book in one tap — at our clinic or as a home service in Baghdad.',
      disclaimer: 'IV therapy is prescribed and administered by licensed medical professionals after an individual assessment. Formulas and suitability are determined by your clinician. This page is informational and not medical advice.' },
    ar: { allDrips: 'كل المغذيات', book: 'احجز', home: 'الرئيسية', partners: 'شركاؤنا', menu: 'قائمة المغذيات', perSession: 'للجلسة', approxTime: 'الوقت التقريبي',
      bookThis: 'احجز هذا المغذّي', whatsapp: 'اسأل عبر واتساب', overview: 'نظرة عامة', benefits: 'فيمَ يساعد',
      formula: 'التركيبة السريرية', bestFor: 'مناسب لـ', howKicker: 'كيف تتم', howTitle: 'ثلاث خطوات بسيطة.',
      faqTitle: 'أسئلة شائعة', prev: 'السابق', next: 'التالي',
      exploreKicker: 'اكتشف المزيد', exploreTitle: 'بروتوكولات إنفيتا الأخرى',
      ctaBody: 'كل جلسة تبدأ باستشارة طبية خاصة. احجز بلمسة واحدة — في عيادتنا أو كخدمة منزلية في بغداد.',
      disclaimer: 'يُوصف العلاج الوريدي ويُعطى من مختصين طبيين مرخّصين بعد تقييم فردي. تُحدَّد التركيبات ومدى ملاءمتها من قبل طبيبك. هذه الصفحة للمعلومات وليست نصيحة طبية.' }
  };

  TIERS = { en: { Signature: 'Signature', Wellness: 'Wellness', Performance: 'Performance', Beauty: 'Beauty' },
            ar: { Signature: 'المميّزة', Wellness: 'العافية', Performance: 'الأداء', Beauty: 'الجمال' } };

  STEPS = {
    en: [
      { n: '01', t: 'Medical consultation', b: 'A licensed clinician reviews your health and goals before any drip is prepared.' },
      { n: '02', t: 'Personalised infusion', b: 'Your Liquivida® formula is prepared and administered by a medical professional while you relax.' },
      { n: '03', t: 'Feel the difference', b: 'Many feel the effects right away; others notice the full benefit within 24 hours.' }
    ],
    ar: [
      { n: '01', t: 'استشارة طبية', b: 'يراجع طبيب مرخّص حالتك وأهدافك قبل تحضير أي مغذٍّ.' },
      { n: '02', t: 'تسريب مخصّص', b: 'تُحضَّر تركيبة Liquivida® ويُعطيها مختص طبي بينما تسترخي.' },
      { n: '03', t: 'النتيجة', b: 'يشعر كثيرون بالأثر سريعاً، ويلاحظ آخرون الفائدة الكاملة خلال 24 ساعة.' }
    ]
  };

  FAQS = {
    en: [
      { q: 'How long does a session take?', a: 'Most infusions take about 45–90 minutes depending on the protocol. You can relax, read, or work during your drip.' },
      { q: 'Does it hurt?', a: 'Only a small pinch when the line is placed. A medical professional stays with you throughout the session.' },
      { q: 'How often should I come?', a: 'It depends on your goal — many protocols run weekly for 4–6 weeks, then monthly maintenance. Your clinician will recommend a schedule.' },
      { q: 'Is it safe?', a: 'Every drip is prepared and administered by licensed medical staff after an individual assessment, using official Liquivida® USA formulas.' },
      { q: 'Clinic or home?', a: 'Invita is available at partner clinics and as a home service by appointment in Baghdad.' }
    ],
    ar: [
      { q: 'كم تستغرق الجلسة؟', a: 'يستغرق معظم التسريب نحو 45–90 دقيقة حسب البروتوكول. يمكنك الاسترخاء أو القراءة أو العمل أثناء الجلسة.' },
      { q: 'هل يؤلم؟', a: 'مجرد وخزة بسيطة عند تركيب الأنبوب. يبقى مختص طبي معك طوال الجلسة.' },
      { q: 'كم مرة يجب أن أحضر؟', a: 'يعتمد على هدفك — كثير من البروتوكولات أسبوعية لمدة 4–6 أسابيع ثم صيانة شهرية. يوصي طبيبك بالجدول المناسب.' },
      { q: 'هل هو آمن؟', a: 'يُحضَّر كل علاج ويُعطى بإشراف كادر طبي مرخّص بعد تقييم فردي، باستخدام صيغ Liquivida® المعتمدة.' },
      { q: 'في العيادة أم المنزل؟', a: 'إنفيتا متوفرة في العيادات الشريكة وكخدمة منزلية بموعد مسبق في بغداد.' }
    ]
  };

  SLOGANS = {
    'energy-boost': { en: 'Your all-day energy, restored.', ar: 'طاقتك طوال اليوم، مُستعادة.' },
    'immune-boost': { en: 'Defend. Recover. Thrive.', ar: 'دفاعك أقوى، وتعافيك أسرع.' },
    'hair-skin-nails': { en: 'Beauty that grows from within.', ar: 'جمالٌ ينمو من الداخل.' },
    'panthenol-b5': { en: 'Deep hydration, real radiance.', ar: 'ترطيب عميق، وإشراقة حقيقية.' },
    'myers-cocktail': { en: 'The original wellness reset.', ar: 'إعادة ضبط العافية الأصلية.' },
    'dopamin-booster': { en: 'Think sharper. Focus longer.', ar: 'تركيزٌ أوضح، لوقتٍ أطول.' },
    'skin-radiance': { en: 'A glow that speaks for itself.', ar: 'إشراقة تتحدث عن نفسها.' },
    'nad-plus': { en: 'Recharge your cells. Turn back time.', ar: 'اشحن خلاياك، واستعد حيويتك.' },
    'weight-loss': { en: 'Burn smarter, not harder.', ar: 'احرق بذكاء، لا بمجهود.' },
    'fertility-libido': { en: 'Vitality, balance, desire.', ar: 'حيوية، وتوازن، ورغبة.' },
    'cola-drip-iron': { en: 'Rebuild your energy from the blood up.', ar: 'طاقتك تبدأ من دمك.' },
    'jet-fuel': { en: 'High-octane fuel for body and mind.', ar: 'وقود عالي الأداء للجسم والذهن.' },
    'edta-chelation': { en: 'Cleanse deep. Protect your heart.', ar: 'تنقية عميقة، وحماية لقلبك.' }
  };

  state = { lang: null, slug: null, openFaq: null };

  componentDidMount() {
    this._onHash = () => { this.setState({ slug: this._readSlug(), openFaq: null }); try { window.scrollTo(0, 0); } catch (e) {} };
    window.addEventListener('hashchange', this._onHash);
    const saved = localStorage.getItem('invita-lang');
    if (saved === 'ar' || saved === 'en') this.setState({ lang: saved });
    this._reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this._driveMarquees();
    requestAnimationFrame(() => this._initFx());
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this._onHash);
    if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
    if (this._io) this._io.disconnect();
  }
  componentDidUpdate(pp, ps) {
    if (ps.slug !== this.state.slug || ps.lang !== this.state.lang) {
      requestAnimationFrame(() => this._runCounts());
    }
  }

  _initFx() {
    const root = this._root; if (!root) return;
    const els = root.querySelectorAll('[data-reveal]');
    if (this._reduce) {
      els.forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; });
    } else {
      const io = new IntersectionObserver((ents) => {
        ents.forEach(en => { if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = 'none'; io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(e => io.observe(e));
      this._io = io;
    }
    this._prog = root.querySelector('[data-progress]');
    this._sticky = root.querySelector('[data-sticky]');
    this._onScroll = () => {
      const st = window.scrollY || document.documentElement.scrollTop || 0;
      const h = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.max(0, Math.min(1, st / h));
      if (this._prog) this._prog.style.width = (p * 100) + '%';
      if (this._sticky) { const show = st > 460; this._sticky.style.transform = show ? 'translateY(0)' : 'translateY(120%)'; this._sticky.style.opacity = show ? '1' : '0'; }
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
    if (this._art && !this._reduce) {
      this._onMove = (e) => {
        const r = this._art.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / r.width, dy = (e.clientY - cy) / r.height;
        this._art.style.transform = 'translate(' + (dx * 16) + 'px,' + (dy * 14) + 'px)';
      };
      window.addEventListener('pointermove', this._onMove, { passive: true });
    }
    this._runCounts();
  }

  _runCounts() {
    const root = this._root; if (!root) return;
    root.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
      if (this._reduce) { el.textContent = pre + target.toLocaleString('en-US') + suf; return; }
      const dur = 1100, t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + Math.round(target * e).toLocaleString('en-US') + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  _readSlug() {
    const path = ((location.pathname || '').split('/').pop() || '').replace(/\.html$/i, '').trim();
    if (this.DRIPS[path]) return path;
    const h = (location.hash || '').replace(/^#/, '').trim();
    return this.DRIPS[h] ? h : this.ORDER[0];
  }


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

  renderVals() {
    const ar = (this.state.lang || this.props.lang || 'en') === 'ar';
    const t = this.UI[ar ? 'ar' : 'en'];
    const slug = this.state.slug || this._readSlug();
    const raw = this.DRIPS[slug];
    const loc = ar ? raw.ar : raw.en;
    const idx = this.ORDER.indexOf(slug);
    const prevSlug = this.ORDER[(idx - 1 + this.ORDER.length) % this.ORDER.length];
    const nextSlug = this.ORDER[(idx + 1) % this.ORDER.length];
    const R = 'opacity:0;transform:translateY(30px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)';
    const ingredients = raw.formula.split(' · ');
    const priceStr = raw.price.toLocaleString('en-US');
    return {
      rootRef: (el) => { this._root = el; },
      artRef: (el) => { this._art = el; },
      dir: ar ? 'rtl' : 'ltr', arrow: ar ? '←' : '→', arrowPrev: ar ? '→' : '←', arrowNext: ar ? '←' : '→',
      navOpen: !!this.state.navOpen, navToggle: () => this.setState({ navOpen: !this.state.navOpen }), navClose: () => this.setState({ navOpen: false }),
      langLabel: ar ? 'EN' : 'عربي', t,
      toggleLang: () => { const nx = ar ? 'en' : 'ar'; try { localStorage.setItem('invita-lang', nx); } catch (e) {} this.setState({ lang: nx }); },
      bagEl: React.createElement('img', { src: (this.BAGS || {})[slug] || 'assets/bags/' + slug + '.webp', alt: raw.name + ' IV bag', style: { display: 'block', height: 'auto', width: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 1px rgba(255,255,255,.5)) drop-shadow(0 14px 22px rgba(15,35,65,.28)) drop-shadow(0 34px 52px rgba(15,35,65,.36)) drop-shadow(0 0 40px rgba(217,179,68,.32)) saturate(1.08) contrast(1.04)' } }),
      vialEl: React.createElement('img', { src: 'assets/vials/' + slug + '.webp', alt: raw.name + ' vial', style: { display: 'block', height: 'clamp(130px,17vw,190px)', maxWidth: '34%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 18px 28px rgba(0,0,0,.5))', marginBottom: '4px' } }),
      slogan: (this.SLOGANS[slug] || this.SLOGANS['energy-boost'])[ar ? 'ar' : 'en'],
      waBook: 'https://wa.me/9647748885559?text=' + encodeURIComponent(ar ? 'مرحباً، أود حجز جلسة ' + raw.name + '.' : "Hi! I'd like to book the " + raw.name + ' IV drip.'),
      ingredients, ingredientsx2: ingredients.concat(ingredients),
      priceNum: raw.price, minNum: raw.min,
      pricePre: ar ? 'من ' : 'from ', priceSuf: ar ? ' د.ع' : ' IQD',
      priceDisplay: (ar ? 'من ' : 'from ') + priceStr + (ar ? ' د.ع' : ' IQD'),
      minSuf: ar ? ' دقيقة' : ' min', minDisplay: raw.min + (ar ? ' دقيقة' : ' min'),
      d: {
        name: raw.name, tag: loc.tag, desc: loc.desc, formula: raw.formula,
        tierLabel: this.TIERS[ar ? 'ar' : 'en'][raw.tier],
        price: (ar ? 'من ' : 'from ') + priceStr + (ar ? ' د.ع' : ' IQD'),
        goodFor: loc.goodFor, hasNote: !!loc.note, note: loc.note || ''
      },
      benefitCards: loc.benefits.map((b, i) => ({ n: String(i + 1).padStart(2, '0'), t: b, style: R + ';transition-delay:' + (i * 90) + 'ms' })),
      stepCards: this.STEPS[ar ? 'ar' : 'en'].map((s, i) => ({ n: s.n, t: s.t, b: s.b, style: R + ';transition-delay:' + (i * 110) + 'ms' })),
      faqs: this.FAQS[ar ? 'ar' : 'en'].map((f, i) => {
        const open = this.state.openFaq === i;
        return {
          q: f.q, a: f.a, open,
          signStyle: 'color:#D9B344;font-size:22px;flex:none;line-height:1;transition:transform .3s ease;transform:rotate(' + (open ? '45deg' : '0deg') + ')',
          panelStyle: 'overflow:hidden;transition:max-height .45s cubic-bezier(.2,.7,.2,1),opacity .35s ease;max-height:' + (open ? '260px' : '0') + ';opacity:' + (open ? '1' : '0'),
          toggle: () => this.setState((st) => ({ openFaq: st.openFaq === i ? null : i }))
        };
      }),
      related: this.ORDER.filter(s => s !== slug).map(s => {
        const r = this.DRIPS[s];
        return {
          name: r.name, href: 'drips/' + s + '.html', tier: this.TIERS[ar ? 'ar' : 'en'][r.tier],
          price: (ar ? 'من ' : 'from ') + r.price.toLocaleString('en-US') + (ar ? ' د.ع' : ' IQD'),
          imgEl: React.createElement('img', { src: 'assets/bags/' + s + '.webp', alt: r.name, style: { height: '150px', width: 'auto', objectFit: 'contain', display: 'block' } })
        };
      }),
      prevName: this.DRIPS[prevSlug].name, nextName: this.DRIPS[nextSlug].name,
      prevHref: 'drips/' + prevSlug + '.html', nextHref: 'drips/' + nextSlug + '.html'
    };
  }
}
