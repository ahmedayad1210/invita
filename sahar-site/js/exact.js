(() => {
  const WA = '964776664044';

  // Restart Figma branches motion when the section enters the viewport
  const track = document.getElementById('branches-track');
  const section = document.getElementById('branches');
  if (track && section && 'IntersectionObserver' in window) {
    const restart = () => {
      track.style.animation = 'none';
      void track.offsetWidth;
      track.style.animation = '';
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) restart();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(section);
  }

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

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
    if (status) status.textContent = 'جارٍ فتح واتساب…';
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
