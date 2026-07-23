
(async function () {
  const page = window.__INVITA_PAGE__;
  const prefix = window.__INVITA_ASSET_PREFIX__ || '';
  const root = document.getElementById('app');
  const tplUrl = prefix + 'js/pages/' + page + '.template.html';
  const res = await fetch(tplUrl);
  const templateHtml = await res.text();
  const Comp = window.InvitaPages && window.InvitaPages[page];
  if (!Comp) {
    root.innerHTML = '<p style="padding:40px;font-family:system-ui">Failed to load page component.</p>';
    console.error('Missing component', page, window.InvitaPages);
    return;
  }
  // Optional slug prop for drip pages
  const props = { lang: 'en' };
  if (page === 'drip') {
    const path = ((location.pathname || '').split('/').pop() || '').replace(/\.html$/i, '');
    if (path) props.slug = path;
  }
  InvitaDC.mount(Comp, templateHtml, root, props);

  // In-view video play/pause
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (!(v instanceof HTMLVideoElement)) return;
        if (en.isIntersecting) { v.play().catch(() => {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.25 });
    const observeVideos = () => {
      document.querySelectorAll('video[autoplay], video[data-autoplay]').forEach((v) => io.observe(v));
    };
    observeVideos();
    const mo = new MutationObserver(observeVideos);
    mo.observe(root, { childList: true, subtree: true });
  }
})();
