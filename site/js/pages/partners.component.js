window.InvitaPages = window.InvitaPages || {};
window.InvitaPages.partners = class Component {
  state = { lang: null, muted: true, org: '', person: '', phone: '', email: '', type: null, msg: '', err: false, ref: null };

  EN = {
    nav: { home: 'Home', doctors: 'Our doctors', drips: 'Drip menu', form: 'Join as a partner' },
    hero: {
      kicker: 'Our partner doctors',
      title: 'Trusted by doctors. Loved by clients.',
      sub: 'An elite group of physicians and specialists in Baghdad administer Invita IV drips within their own clinics — official Liquivida® formulas, clinical protocols, and continuous scientific support.',
      ctaDoctors: 'Meet our doctors', ctaJoin: 'Join as a partner now',
      stats: [
        { v: '50+', l: 'Clinics & medical centres' },
        { v: '18+', l: 'Partner doctors' },
        { v: 'Liquivida®', l: 'Certified formulas' }
      ]
    },
    docs: {
      kicker: 'Our doctors', title: 'Meet our doctors.',
      lead: 'Partner physicians and specialists offering Invita IV drips within their clinics across Baghdad.',
      note: 'Drop each doctor\u2019s photo onto a card — names and titles can be added under each one.',
      plusV: '+100', plusL: 'other doctors & elite clinics love Invita IV drips',
      cta: 'Ask about supplying IV drips for your clinic'
    },
    exp: {
      title: 'The doctors\u2019 recommendation series.',
      lead: 'Short films where partner physicians share why they administer Invita protocols in their own practice.'
    },
    why: {
      kicker: 'Why Invita', title: 'Why do these clinics choose Invita?',
      items: [
        { t: 'Liquivida® formulas', b: 'Developed inside pharmaceutical facilities specialised in pharmaceutical compounding.' },
        { t: 'Certified high quality', b: 'Products prepared under certified manufacturing and safety standards.' },
        { t: 'Evidence-based', b: 'Treatment protocols with clinical documentation and references, available on request.' },
        { t: 'Training & scientific support', b: 'Continuous education for medical staff — before and after the service launches.' },
        { t: 'Partner to 50+ clinics', b: 'Medical and aesthetic centres across every part of Iraq.' },
        { t: 'Integrated solutions', b: 'Covering IV therapy and DNA testing under one partnership.' },
        { t: 'Technical & operational support', b: 'Ensuring protocols are applied to the highest quality standards.' },
        { t: 'Dedicated follow-up team', b: 'Following up with clinics and providing scientific and technical consultation.' }
      ]
    },
    poster: { line: 'Performance starts from the inside out.' },
    certs: {
      kicker: 'Certifications',
      title: 'Certified as a top IV drip pharmaceutical facility.',
      lead: 'Our IV formulas are produced in internationally certified pharmaceutical facilities — quality and environmental management standards you can verify.',
      c1: 'Medical devices — quality management systems. The international standard for pharmaceutical and medical manufacturing quality.',
      c2: 'Environmental management systems — certified responsible, controlled production environments.',
      view: 'View certificate (PDF)',
      cta: 'Ask us more about our certifications'
    },
    join: {
      q: 'Are you a doctor or a clinic looking to join?',
      body: 'Partner with Invita and offer IV drips to your patients — supply, training, and clinical support included.',
      btn: 'Join as a partner now'
    },
    form: {
      kicker: 'Become a partner', title: 'Tell us about your facility.',
      lead: 'Fill this in and our clinical team will reply on WhatsApp within 24 hours with supply terms, training options, and onboarding steps.',
      statL: 'Clinics & medical centres already partnered with Invita',
      orgL: 'Facility / clinic name', personL: 'Contact person', phoneL: 'Phone (WhatsApp)', emailL: 'Email (optional)',
      typeL: 'Facility type', msgL: 'What are you looking for? (optional)',
      submit: 'Send partnership request',
      err: 'Please enter the facility name, contact person, and a valid WhatsApp number.',
      confTitle: 'Request received', confBody: 'Our clinical team will contact you on WhatsApp within 24 hours. Keep your reference.',
      refL: 'Reference', orgS: 'Facility', typeS: 'Type', personS: 'Contact',
      whatsapp: 'Chat on WhatsApp', again: 'New request',
      trust: 'Exclusively for licensed clinics and centres · Liquivida® USA formulas · Clinical training included',
      types: ['Clinic', 'Hospital', 'Medical centre', 'Physician', 'Other']
    },
    footer: { excl: 'Exclusively for licensed clinics and medical centres — Baghdad, Iraq. © 2026 Invita.' }
  };

  AR = {
    nav: { home: 'الرئيسية', doctors: 'أطباؤنا', drips: 'قائمة العلاجات', form: 'انضم كشريك' },
    hero: {
      kicker: 'شركاؤنا من الأطباء',
      title: 'شريك موثوق للأطباء والعيادات.',
      sub: 'يعتمد نخبة من أطباء العراق بروتوكولات إنفيتا للعلاج الوريدي في عياداتهم — صيغ Liquivida® معتمدة، وتدريب سريري، ودعم علمي مستمر.',
      ctaDoctors: 'تعرّف على أطبائنا', ctaJoin: 'انضم إلى شبكة الشركاء',
      stats: [
        { v: '50+', l: 'عيادة ومركز طبي' },
        { v: '18+', l: 'طبيب شريك' },
        { v: 'Liquivida®', l: 'تركيبات معتمدة' }
      ]
    },
    docs: {
      kicker: 'أطباؤنا', title: 'تعرّف على أطبائنا.',
      lead: 'أطباء واختصاصيون شركاء يقدمون علاجات إنفيتا الوريدية ضمن عياداتهم في بغداد.',
      note: 'أسقط صورة كل طبيب على البطاقة — يمكن إضافة الأسماء والألقاب تحت كل صورة.',
      plusV: '+100', plusL: 'طبيب وعيادة ضمن شبكة إنفيتا في العراق',
      cta: 'استفسر عن توفير العلاج الوريدي لعيادتك'
    },
    exp: {
      title: 'سلسلة توصيات الأطباء.',
      lead: 'شهادات مصوّرة يوضح فيها الأطباء الشركاء أسباب اعتمادهم بروتوكولات إنفيتا.'
    },
    why: {
      kicker: 'لماذا إنفيتا', title: 'لماذا يعتمد الأطباء إنفيتا؟',
      items: [
        { t: 'تركيبات Liquivida®', b: 'تُطوَّر داخل منشآت دوائية متخصصة في الـ Pharmaceutical Compounding.' },
        { t: 'جودة معتمدة', b: 'منتجات تُحضَّر وفق معايير تصنيع وسلامة دولية.' },
        { t: 'قائمة على الأدلة العلمية', b: 'بروتوكولات علاجية مع وثائق ومراجع سريرية متوفرة عند الطلب.' },
        { t: 'تدريب ودعم علمي مستمر', b: 'للكادر الطبي قبل وبعد بدء تقديم الخدمة.' },
        { t: 'شريك لأكثر من 50 عيادة', b: 'ومركز طبي في مختلف أنحاء العراق.' },
        { t: 'حلول متكاملة', b: 'تشمل العلاج الوريدي (IV Therapy) وفحوصات الحمض النووي (DNA).' },
        { t: 'دعم فني وتشغيلي مستمر', b: 'لضمان تطبيق البروتوكولات بأعلى معايير الجودة.' },
        { t: 'فريق متخصص للمتابعة', b: 'لمتابعة العيادات وتقديم الاستشارات العلمية والتقنية.' }
      ]
    },
    poster: { line: 'الأداء يبدأ من الداخل إلى الخارج.' },
    certs: {
      kicker: 'الشهادات',
      title: 'معتمدون كمنشأة دوائية رائدة للمغذيات الوريدية.',
      lead: 'تُنتَج صيغنا الوريدية في منشآت دوائية حاصلة على اعتمادات دولية — معايير جودة وإدارة بيئية يمكنك التحقق منها.',
      c1: 'الأجهزة الطبية — أنظمة إدارة الجودة. المعيار الدولي لجودة التصنيع الدوائي والطبي.',
      c2: 'أنظمة الإدارة البيئية — بيئات إنتاج مسؤولة وخاضعة للرقابة.',
      view: 'عرض الشهادة (PDF)',
      cta: 'اسألنا المزيد عن شهاداتنا'
    },
    join: {
      q: 'هل أنت طبيب أو عيادة وتريد الانضمام؟',
      body: 'انضم إلى شبكة إنفيتا وقدّم العلاج الوريدي لمراجعيك — مع التوريد والتدريب والدعم السريري.',
      btn: 'انضم كشريك الآن'
    },
    form: {
      kicker: 'كن شريكاً', title: 'حدّثنا عن مرفقك.',
      lead: 'املأ النموذج وسيتواصل فريقنا السريري عبر واتساب خلال 24 ساعة بشروط التوريد وخيارات التدريب وخطوات الانضمام.',
      statL: 'عيادة ومركز طبي ضمن شبكة إنفيتا',
      orgL: 'اسم المرفق / العيادة', personL: 'الشخص المسؤول', phoneL: 'الهاتف (واتساب)', emailL: 'البريد الإلكتروني (اختياري)',
      typeL: 'نوع المرفق', msgL: 'ماذا تبحث عنه؟ (اختياري)',
      submit: 'أرسل طلب الشراكة',
      err: 'يرجى إدخال اسم المرفق والشخص المسؤول ورقم واتساب صحيح.',
      confTitle: 'تم استلام طلبك', confBody: 'سيتواصل معك فريقنا السريري عبر واتساب خلال 24 ساعة. يرجى الاحتفاظ برقم المرجع.',
      refL: 'المرجع', orgS: 'المرفق', typeS: 'النوع', personS: 'المسؤول',
      whatsapp: 'تواصل عبر واتساب', again: 'طلب جديد',
      trust: 'حصرياً للعيادات والمراكز المرخّصة · صيغ Liquivida® المعتمدة · التدريب السريري مشمول',
      types: ['عيادة', 'مستشفى', 'مركز طبي', 'طبيب', 'أخرى']
    },
    footer: { excl: 'حصرياً للعيادات والمراكز المرخّصة — بغداد، العراق. © 2026 إنفيتا.' }
  };

  componentDidMount() {
    try { const saved = localStorage.getItem('invita-lang'); if (saved === 'ar' || saved === 'en') this.setState({ lang: saved }); } catch (e) {}
    this._driveMarquees();
    document.querySelectorAll('video[data-autoplay]').forEach((v) => {
      v.muted = true;
      const kick = () => { if (v.paused) v.play().catch(() => {}); };
      kick();
      v.addEventListener('canplay', kick);
      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver((es) => { if (es[0] && es[0].isIntersecting && v.paused && v.muted) kick(); }, { threshold: 0.3 });
        io.observe(v);
      }
    });
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
    const t = ar ? this.AR : this.EN;
    const s = this.state;
    const chip = (active) => ({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px',
      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13.5px', lineHeight: 1.2,
      borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap',
      border: active ? '1px solid #0F2341' : '1px solid color-mix(in srgb,#0F2341 24%,transparent)',
      background: active ? '#0F2341' : 'transparent', color: active ? '#F0EDE4' : '#0F2341'
    });
    const ticker = ['Trusted by doctors', 'Loved by clients', 'Liquivida® USA', 'Baghdad, Iraq'];
    return {
      t, dir: ar ? 'rtl' : 'ltr', arrow: ar ? '←' : '→',
      navOpen: !!s.navOpen, navToggle: () => this.setState({ navOpen: !this.state.navOpen }), navClose: () => this.setState({ navOpen: false }),
      langLabel: ar ? 'EN' : 'عربي',
      toggleLang: () => { const nx = ar ? 'en' : 'ar'; try { localStorage.setItem('invita-lang', nx); } catch (e) {} this.setState({ lang: nx }); },
      tickerItems: ticker.concat(ticker, ticker, ticker),
      heroVidRef: (el) => {
        this._vid = el;
        if (el) {
          el.muted = s.muted;
          if (!el._invAuto) {
            el._invAuto = true;
            const kick = () => { if (el.paused) el.play().catch(() => {}); };
            kick();
            el.addEventListener('canplay', kick);
            el.addEventListener('loadeddata', kick);
            el.addEventListener('pause', () => { if (el.muted && !el.ended) setTimeout(kick, 100); });
            document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
            const once = () => { kick(); document.removeEventListener('pointerdown', once); };
            document.addEventListener('pointerdown', once);
          }
        }
      },
      soundLabel: ar ? (s.muted ? 'تشغيل الصوت' : 'كتم الصوت') : (s.muted ? 'Sound on' : 'Sound off'),
      toggleSound: () => {
        const m = !this.state.muted;
        if (this._vid) this._vid.muted = m;
        this.setState({ muted: m });
      },
      expPlay: (e) => {
        document.querySelectorAll('video').forEach((v) => { if (v !== e.target && !v.muted) v.pause(); });
      },
      typeOpts: t.form.types.map((label, i) => ({
        label, style: chip(s.type === i), pick: () => this.setState({ type: i })
      })),
      orgVal: s.org, personVal: s.person, phoneVal: s.phone, emailVal: s.email, msgVal: s.msg,
      setOrg: (e) => this.setState({ org: e.target.value }),
      setPerson: (e) => this.setState({ person: e.target.value }),
      setPhone: (e) => this.setState({ phone: e.target.value }),
      setEmail: (e) => this.setState({ email: e.target.value }),
      setMsg: (e) => this.setState({ msg: e.target.value }),
      hasErr: s.err, notSent: !s.ref, sent: !!s.ref,
      submit: (e) => {
        e.preventDefault();
        const digits = (s.phone.match(/\d/g) || []).length;
        if (!s.org.trim() || !s.person.trim() || digits < 9) { this.setState({ err: true }); return; }
        this.setState({ err: false, ref: 'PTR-' + (1000 + Math.floor(Math.random() * 9000)) });
      },
      reset: () => this.setState({ org: '', person: '', phone: '', email: '', type: null, msg: '', err: false, ref: null }),
      sumRows: [
        { k: t.form.refL, v: s.ref || '' },
        { k: t.form.orgS, v: s.org },
        { k: t.form.typeS, v: s.type == null ? '—' : t.form.types[s.type] },
        { k: t.form.personS, v: s.person }
      ]
    };
  }
}
