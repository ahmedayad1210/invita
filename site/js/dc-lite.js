/**
 * Minimal Design-Canvas runtime for Invita production pages.
 * Supports: {{ path }}, sc-for, sc-if, onClick/onPlay/ref/style bindings,
 * and React-like element descriptors from renderVals().
 */
(function (global) {
  'use strict';

  function getPath(ctx, path) {
    if (path == null || path === '') return undefined;
    path = String(path).trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    const parts = path.split('.');
    let cur = ctx;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function camelToKebab(s) {
    return s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  }

  function styleToString(style) {
    if (!style) return '';
    if (typeof style === 'string') return style;
    return Object.keys(style)
      .map((k) => {
        let v = style[k];
        if (v == null || v === false) return '';
        const key = camelToKebab(k);
        if (typeof v === 'number' && !/^(opacity|z-index|font-weight|line-height|flex|order)$/i.test(key)) {
          v = v + 'px';
        }
        return key + ':' + v;
      })
      .filter(Boolean)
      .join(';');
  }

  function createFromDescriptor(desc, handlers) {
    if (desc == null || desc === false) return document.createTextNode('');
    if (typeof desc === 'string' || typeof desc === 'number') {
      return document.createTextNode(String(desc));
    }
    if (desc.__el) {
      const el = document.createElement(desc.type);
      const props = desc.props || {};
      Object.keys(props).forEach((k) => {
        const v = props[k];
        if (v == null || v === false) return;
        if (k === 'style') {
          el.setAttribute('style', styleToString(v));
        } else if (k === 'className') {
          el.setAttribute('class', v);
        } else if (k.startsWith('on') && typeof v === 'function') {
          const ev = k.slice(2).toLowerCase();
          el.addEventListener(ev, v);
        } else if (typeof v === 'boolean') {
          if (v) el.setAttribute(k, '');
        } else {
          el.setAttribute(k, String(v));
        }
      });
      (desc.children || []).forEach((ch) => el.appendChild(createFromDescriptor(ch, handlers)));
      return el;
    }
    return document.createTextNode(String(desc));
  }

  function parseAttrs(tagOpen) {
    const attrs = [];
    const re = /([:@]?[a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let m;
    while ((m = re.exec(tagOpen))) {
      attrs.push({ name: m[1], value: m[3] != null ? m[3] : m[4] });
    }
    return attrs;
  }

  function tokenize(html) {
    const tokens = [];
    let i = 0;
    while (i < html.length) {
      if (html.startsWith('<!--', i)) {
        const end = html.indexOf('-->', i + 4);
        i = end < 0 ? html.length : end + 3;
        continue;
      }
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end < 0) break;
        const raw = html.slice(i, end + 1);
        const selfClosing = /\/>$/.test(raw) || /^<(img|br|hr|input|meta|link|source|area|col|embed|wbr)\b/i.test(raw);
        if (/^<\//.test(raw)) {
          tokens.push({ type: 'close', tag: raw.replace(/^<\/\s*|\s*>$/g, '').toLowerCase() });
        } else {
          const tagMatch = raw.match(/^<\s*([a-zA-Z_][\w:-]*)/);
          const tag = tagMatch ? tagMatch[1].toLowerCase() : '';
          tokens.push({ type: selfClosing ? 'void' : 'open', tag, raw, attrs: parseAttrs(raw) });
        }
        i = end + 1;
        continue;
      }
      const next = html.indexOf('<', i);
      const text = html.slice(i, next < 0 ? html.length : next);
      tokens.push({ type: 'text', value: text });
      i = next < 0 ? html.length : next;
    }
    return tokens;
  }

  function bindAttrValue(raw, ctx) {
    const m = String(raw).match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    if (!m) return { kind: 'static', value: raw };
    const val = getPath(ctx, m[1].trim());
    if (typeof val === 'function') return { kind: 'fn', value: val };
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      if (val.__el) return { kind: 'el', value: val };
      return { kind: 'styleObj', value: val };
    }
    return { kind: 'value', value: val };
  }

  function interpolateText(text, ctx) {
    return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr) => {
      const v = getPath(ctx, expr.trim());
      if (v == null || typeof v === 'function' || typeof v === 'object') return '';
      return String(v);
    });
  }

  function buildNodes(tokens, ctx) {
    const frag = document.createDocumentFragment();
    let i = 0;

    function readUntilClose(tagName) {
      const inner = [];
      let depth = 1;
      while (i < tokens.length) {
        const t = tokens[i++];
        if (t.type === 'open' && t.tag === tagName) depth++;
        else if (t.type === 'close' && t.tag === tagName) {
          depth--;
          if (depth === 0) break;
        }
        inner.push(t);
      }
      return inner;
    }

    function applyAttrs(el, attrs) {
      attrs.forEach((a) => {
        const name = a.name;
        const bound = bindAttrValue(a.value, ctx);

        if (name === 'ref' && bound.kind === 'fn') {
          bound.value(el);
          return;
        }
        if (/^on[A-Z]/.test(name) && bound.kind === 'fn') {
          const ev = name.slice(2).toLowerCase();
          el.addEventListener(ev === 'click' ? 'click' : ev, (e) => bound.value(e));
          return;
        }
        if (name.toLowerCase() === 'onclick' && bound.kind === 'fn') {
          el.addEventListener('click', (e) => bound.value(e));
          return;
        }
        if (name === 'style') {
          if (bound.kind === 'styleObj') el.setAttribute('style', styleToString(bound.value));
          else if (bound.kind === 'value' || bound.kind === 'static') el.setAttribute('style', String(bound.value || ''));
          return;
        }
        if (name === 'disabled' || name === 'hidden' || name === 'checked' || name === 'muted' || name === 'autoplay' || name === 'loop' || name === 'playsinline' || name === 'controls') {
          let v = bound.kind === 'static' ? a.value : bound.value;
          if (v === '' || v === true || v === 'true' || v === name) el.setAttribute(name, '');
          else if (v === false || v === 'false' || v == null) el.removeAttribute(name);
          else el.setAttribute(name, String(v));
          return;
        }
        if (name.startsWith('hint-') || name === 'list' || name === 'as' || name === 'value' && el.tagName === 'SC-IF') return;

        let v;
        if (bound.kind === 'static') v = a.value;
        else if (bound.kind === 'value') v = bound.value;
        else if (bound.kind === 'fn') return;
        else v = '';
        if (v == null || v === false) return;
        // Normalize React-ish attrs
        const attrName = name === 'autoPlay' ? 'autoplay'
          : name === 'playsInline' ? 'playsinline'
          : name === 'className' ? 'class'
          : name;
        el.setAttribute(attrName, v === true ? '' : String(v));
        if ((attrName === 'value' || name === 'value') && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) {
          el.value = v == null ? '' : String(v);
        }
      });
    }

    function renderTokenList(list, parentCtx) {
      const saved = tokens;
      const savedI = i;
      tokens = list;
      i = 0;
      const out = buildNodes(tokens, parentCtx);
      tokens = saved;
      i = savedI;
      return out;
    }

    while (i < tokens.length) {
      const t = tokens[i++];
      if (t.type === 'text') {
        const parts = t.value.split(/(\{\{[\s\S]*?\}\})/);
        parts.forEach((part) => {
          const m = part.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
          if (m) {
            const v = getPath(ctx, m[1].trim());
            if (v && v.__el) frag.appendChild(createFromDescriptor(v));
            else if (v != null && typeof v !== 'function' && typeof v !== 'object') {
              frag.appendChild(document.createTextNode(String(v)));
            }
          } else if (part) {
            frag.appendChild(document.createTextNode(part));
          }
        });
        continue;
      }
      if (t.type === 'close') continue;

      if (t.tag === 'sc-for') {
        const inner = readUntilClose('sc-for');
        const listAttr = t.attrs.find((a) => a.name === 'list');
        const asAttr = t.attrs.find((a) => a.name === 'as');
        const listName = listAttr ? (listAttr.value.match(/\{\{\s*([^}]+)\s*\}\}/) || [, listAttr.value])[1].trim() : '';
        const asName = asAttr ? asAttr.value : 'item';
        const list = getPath(ctx, listName) || [];
        (Array.isArray(list) ? list : []).forEach((item, idx) => {
          const childCtx = Object.assign(Object.create(ctx), { [asName]: item, index: idx });
          frag.appendChild(renderTokenList(inner, childCtx));
        });
        continue;
      }

      if (t.tag === 'sc-if') {
        const inner = readUntilClose('sc-if');
        const valAttr = t.attrs.find((a) => a.name === 'value');
        const expr = valAttr ? (valAttr.value.match(/\{\{\s*([^}]+)\s*\}\}/) || [, valAttr.value])[1].trim() : '';
        const show = !!getPath(ctx, expr);
        if (show) frag.appendChild(renderTokenList(inner, ctx));
        continue;
      }

      if (t.tag === 'helmet' || t.tag === 'x-import') {
        // Skip design-canvas chrome; pull useful children for helmet
        if (t.type === 'void') continue;
        const inner = readUntilClose(t.tag);
        if (t.tag === 'helmet') {
          // Apply link/style from helmet into document head once
          const tmp = renderTokenList(inner, ctx);
          Array.from(tmp.childNodes).forEach((n) => {
            if (n.nodeType === 1) {
              const tag = n.tagName.toLowerCase();
              if (tag === 'style' || tag === 'link' || tag === 'meta') {
                if (tag === 'link' && /_ds\//.test(n.getAttribute('href') || '')) return;
                if (tag === 'script') return;
                // rewrite font urls relative to site root already done
                document.head.appendChild(n);
              }
            }
          });
        } else if (t.tag === 'x-import') {
          // Convert image-slot imports to <img>
          const src = (t.attrs.find((a) => a.name === 'src') || {}).value;
          const style = (t.attrs.find((a) => a.name === 'style') || {}).value;
          const img = document.createElement('img');
          if (src) img.setAttribute('src', src.replace(/\{\{\s*|\s*\}\}/g, ''));
          img.setAttribute('alt', '');
          if (style) img.setAttribute('style', style);
          frag.appendChild(img);
        }
        continue;
      }

      if (t.tag === 'main' || t.tag === 'div' || true) {
        if (t.type === 'void') {
          const el = document.createElement(t.tag);
          applyAttrs(el, t.attrs);
          frag.appendChild(el);
          continue;
        }
        const el = document.createElement(t.tag);
        applyAttrs(el, t.attrs);
        const inner = readUntilClose(t.tag);
        el.appendChild(renderTokenList(inner, ctx));
        frag.appendChild(el);
        continue;
      }
    }
    return frag;
  }

  function mount(ComponentClass, templateHtml, root, props) {
    const inst = new ComponentClass();
    inst.props = props || {};
    inst.state = Object.assign({}, inst.state || {});
    let mounted = false;
    const tokens = tokenize(templateHtml);

    inst.setState = function (patch) {
      const next = typeof patch === 'function' ? patch(inst.state) : patch;
      inst.state = Object.assign({}, inst.state, next);
      render();
    };

    function render() {
      const vals = inst.renderVals ? inst.renderVals() : {};
      const ctx = Object.assign(Object.create(null), vals);
      const ae = document.activeElement;
      const restoreId = ae && ae.id ? ae.id : null;
      const restoreSel = ae && typeof ae.selectionStart === 'number' ? { start: ae.selectionStart, end: ae.selectionEnd } : null;
      const frag = buildNodes(tokens, ctx);
      root.innerHTML = '';
      root.appendChild(frag);
      if (restoreId) {
        const el = document.getElementById(restoreId);
        if (el) {
          el.focus();
          if (restoreSel && el.setSelectionRange) {
            try { el.setSelectionRange(restoreSel.start, restoreSel.end); } catch (e) {}
          }
        }
      }
      try {
        const lang = vals.lang || (inst._lang && inst._lang()) || 'en';
        document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      } catch (e) {}
      if (!mounted) {
        mounted = true;
        if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
      }
    }

    render();
    return inst;
  }

  global.InvitaDC = { mount, styleToString, getPath };
})(window);
