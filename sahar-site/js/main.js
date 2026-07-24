(() => {
  const WA = '964776664044';

  const year = document.getElementById('y');
  if (year) year.textContent = String(new Date().getFullYear());

  const nav = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Branches motion: restart when in view (matches Figma 2s loop)
  const track = document.getElementById('branches-track');
  if (track && 'IntersectionObserver' in window) {
    const restart = () => {
      track.style.animation = 'none';
      // force reflow
      void track.offsetWidth;
      track.style.animation = '';
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) restart();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(track);
  }

  // WhatsApp booking form
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const phone = String(data.get('phone') || '').trim();
      const service = String(data.get('service') || '').trim();
      const notes = String(data.get('notes') || '').trim();
      if (!name || !phone) {
        if (status) status.textContent = 'يرجى إدخال الاسم ورقم الهاتف.';
        return;
      }
      const msg = [
        'طلب جديد من موقع سحر هيلث كير',
        `الاسم: ${name}`,
        `الهاتف: ${phone}`,
        `الخدمة: ${service}`,
        notes ? `ملاحظات: ${notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      if (status) status.textContent = 'جارٍ فتح واتساب…';
      window.open(url, '_blank', 'noopener');
    });
  }

  // Lightweight EN toggle (labels only)
  const langBtn = document.querySelector('[data-lang-toggle]');
  let en = false;
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      en = !en;
      langBtn.textContent = en ? 'AR' : 'EN';
      document.documentElement.lang = en ? 'en' : 'ar';
      document.documentElement.dir = en ? 'ltr' : 'rtl';
    });
  }
})();
