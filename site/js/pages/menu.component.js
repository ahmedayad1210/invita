window.InvitaPages = window.InvitaPages || {};
window.InvitaPages.menu = class Component {
  state = {};
  T = {
    en: { home: 'Home', catalogue: 'Catalogue', partners: 'Partners', navBook: 'Book', book: 'Book on WhatsApp', printMenu: 'Open the print menu', footNote: 'Prices include a free medical assessment. Formulas and suitability are confirmed by your clinician before every session.', details: 'Details', heroKicker: 'The Infusion Menu', heroTitle: 'Fourteen Liquivida\u00ae formulas. One menu.', heroLead: 'Watch the film, then book any formula below — directly on WhatsApp.', gridTitle: 'Book a drip.', gridLead: 'Every session begins with a free medical assessment.' },
    ar: { home: 'الرئيسية', catalogue: 'الكتالوج', partners: 'شركاؤنا', navBook: 'احجز', book: 'احجز عبر واتساب', printMenu: 'افتح قائمة الطباعة', footNote: 'تشمل الأسعار تقييماً طبياً مجانياً. تُؤكَّد التركيبة ومدى الملاءمة من قبل الطبيب قبل كل جلسة.', details: 'التفاصيل', heroKicker: 'قائمة التسريب الوريدي', heroTitle: 'أربع عشرة تركيبة من Liquivida\u00ae. قائمة واحدة.', heroLead: 'شاهد الفيلم، ثم احجز أي تركيبة أدناه — مباشرة عبر واتساب.', gridTitle: 'احجز جلستك.', gridLead: 'تبدأ كل جلسة بتقييم طبي مجاني.' }
  };
  DRIPS = [{"slug":"energy-boost","name":"Energy Boost","price":150000,"tagEn":"Instant recharge against chronic fatigue and burnout","tagAr":"جلسة تنشيط فورية ضد التعب المزمن والإجهاد"},{"slug":"immune-boost","name":"Immune Boost","price":165000,"tagEn":"Fortify defences and recover faster","tagAr":"تقوية المناعة وتعافٍ أسرع"},{"slug":"hair-skin-nails","name":"Hair, Nail & Skin","price":180000,"tagEn":"Biotin boost for beauty from within","tagAr":"بيوتين لجمالٍ من الداخل"},{"slug":"panthenol-b5","name":"Panthenol (B5)","price":175000,"tagEn":"Deep hydration and cellular renewal","tagAr":"ترطيب عميق وتجديد الخلايا"},{"slug":"myers-cocktail","name":"Myer's Cocktail","price":210000,"tagEn":"The original multi-nutrient wellness infusion","tagAr":"التسريب الغذائي الأصلي متعدد العناصر"},{"slug":"dopamin-booster","name":"Dopamin Booster","price":195000,"tagEn":"Sharper focus, memory, and mental performance","tagAr":"تركيز وذاكرة وأداء ذهني"},{"slug":"skin-radiance","name":"Skin Radiance","price":225000,"tagEn":"Brighten, even out, and glow","tagAr":"تفتيح وتوحيد وإشراقة"},{"slug":"nad-plus","name":"NAD+ Drips","price":285000,"tagEn":"Cellular energy and anti-ageing","tagAr":"طاقة خلوية ومكافحة الشيخوخة"},{"slug":"weight-loss","name":"Weight Loss Drip","price":195000,"tagEn":"Burn fat and support lean muscle","tagAr":"حرق الدهون ودعم العضلات"},{"slug":"fertility-libido","name":"Fertility & Libido","price":240000,"tagEn":"Fertility, hormonal balance, and vitality","tagAr":"خصوبة وتوازن هرموني وحيوية"},{"slug":"cola-drip-iron","name":"Cola Drip (Iron)","price":180000,"tagEn":"Treat anaemia and raise haemoglobin","tagAr":"علاج فقر الدم ورفع الهيموغلوبين"},{"slug":"jet-fuel","name":"Jet Fuel","price":175000,"tagEn":"Power and endurance for body and mind","tagAr":"قوة وتحمّل للجسم والذهن"},{"slug":"edta-chelation","name":"EDTA Chelation","price":240000,"tagEn":"Vascular detox and heart health","tagAr":"ديتوكس الأوعية وصحة القلب"}];

  componentDidMount() {
    try { const saved = localStorage.getItem('invita-lang'); if (saved === 'ar' || saved === 'en') this.setState({ lang: saved }); } catch (e) {}
  }
  renderVals() {
    const ar = (this.state.lang || this.props.lang || 'en') === 'ar';
    return {
      t: this.T[ar ? 'ar' : 'en'], dir: ar ? 'rtl' : 'ltr', arrow: ar ? '←' : '→',
      soundLabel: ar ? (this.state.muted !== false ? 'تشغيل الصوت' : 'كتم الصوت') : (this.state.muted !== false ? 'Sound on' : 'Sound off'),
      toggleSound: () => { const mu = !(this.state.muted !== false); if (this._vid) this._vid.muted = mu; this.setState({ muted: mu }); },
      heroVidRef: (el) => {
        this._vid = el;
        if (el && !el._invAuto) {
          el._invAuto = true; el.muted = this.state.muted !== false;
          const kick = () => { if (el.paused) el.play().catch(() => {}); };
          kick(); el.addEventListener('canplay', kick);
          el.addEventListener('pause', () => { if (el.muted && !el.ended) setTimeout(kick, 150); });
        }
      },
      drips: this.DRIPS.map((d) => ({
        slug: d.slug, name: d.name, tag: ar ? d.tagAr : d.tagEn,
        hasStory: d.slug !== 'jet-fuel', noStory: d.slug === 'jet-fuel',
        story: d.slug === 'jet-fuel' ? 'assets/bags/jet-fuel.webp' : 'assets/social/story-' + d.slug + '.webp',
        price: (ar ? 'من ' : 'from ') + d.price.toLocaleString('en-US') + (ar ? ' د.ع' : ' IQD'),
        href: 'drips/' + d.slug + '.html',
        wa: 'https://wa.me/9647748885559?text=' + encodeURIComponent(ar ? 'مرحباً، أود حجز جلسة ' + d.name + '.' : "Hi! I'd like to book the " + d.name + ' IV drip.')
      })),
      langLabel: ar ? 'EN' : 'عربي',
      toggleLang: () => { const nx = ar ? 'en' : 'ar'; try { localStorage.setItem('invita-lang', nx); } catch (e) {} this.setState({ lang: nx }); },
      navOpen: !!this.state.navOpen,
      navToggle: () => this.setState({ navOpen: !this.state.navOpen }),
      navClose: () => this.setState({ navOpen: false })
    };
  }
}
