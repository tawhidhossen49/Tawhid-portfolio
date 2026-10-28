/**
 * Frame-sequence engine. Draws numbered WebP frames (from extract_frames.py) to a
 * canvas. Tween `state.p` (0–1) on a scrubbed timeline and call `render()`.
 *
 *   const seq = createSequence({ canvas, base: '/sequences/hero-portrait/' });
 *   const { firstPass } = seq.load();
 *
 * If the manifest is missing (clip not extracted yet) it falls back to a
 * brand-colour placeholder that still responds to `state.p`.
 */
export function createSequence({ canvas, base, portrait = false, focusY = 0.5, onProgress }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const state = { p: 0 };
  let images = [];
  let count = 0;
  let set = null;
  let edge = '#0F0E0C';
  let lastDrawn = -1;
  let placeholder = false;
  let loading = null;

  const ready = (img) => img && img.complete && img.naturalWidth > 0;
  const url = (i) => `${base}${set.dir}/${String(i + 1).padStart(4, '0')}.${set.ext}`;

  function nearest(i) {
    for (let d = 0; d < count; d++) {
      if (ready(images[i - d])) return images[i - d];
      if (ready(images[i + d])) return images[i + d];
    }
    return null;
  }

  function drawPlaceholder() {
    const { width: w, height: h } = canvas;
    const g = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, Math.max(w, h) * (0.7 - state.p * 0.35));
    g.addColorStop(0, '#3a2f22');
    g.addColorStop(1, '#0F0E0C');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function render(force = false) {
    if (placeholder) return drawPlaceholder();
    if (!count) return;
    const i = Math.max(0, Math.min(count - 1, Math.round(state.p * (count - 1))));
    if (i === lastDrawn && !force) return;
    const img = nearest(i);
    if (!img) return;
    lastDrawn = ready(images[i]) ? i : -1;
    const cw = canvas.width;
    const ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) * focusY, w, h);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = Math.round(r.width * dpr);
    let h = Math.round(r.height * dpr);
    const cap = 2560 / Math.max(w, 1);
    if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      render(true);
    }
  }

  function loadFrame(i) {
    if (images[i]) return images[i]._p;
    const img = new Image();
    img.decoding = 'async';
    img._p = new Promise((res) => {
      img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(res);
      img.onerror = res;
    });
    img.src = url(i);
    images[i] = img;
    return img._p;
  }

  function load() {
    if (loading) return loading;
    const manifest = fetch(`${base}manifest.json`).then((r) => {
      if (!r.ok) throw new Error(`no manifest at ${base}`);
      return r.json();
    });

    const firstPass = manifest.then(async (m) => {
      set = (portrait && m.mobile) ? m.mobile : m.desktop;
      count = m.frameCount;
      edge = m.edgeColor || edge;
      images = new Array(count);
      const stride = 12;
      const firsts = [];
      for (let i = 0; i < count; i += stride) firsts.push(i);
      if (firsts[firsts.length - 1] !== count - 1) firsts.push(count - 1);
      let done = 0;
      await loadFrame(0);
      render(true);
      await Promise.all(firsts.map((i) => loadFrame(i).then(() => onProgress?.(++done / firsts.length))));
      render(true);
    }).catch((err) => {
      console.warn('[sequence] using placeholder:', err.message);
      placeholder = true;
      onProgress?.(1);
      render(true);
    });

    const all = firstPass.then(async () => {
      if (placeholder) return;
      for (const stride of [6, 3, 1]) {
        const batch = [];
        for (let i = 0; i < count; i += stride) batch.push(loadFrame(i));
        await Promise.all(batch);
        render(true);
      }
    });

    loading = { firstPass, all };
    return loading;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    state,
    render,
    load,
    get count() { return count; },
    destroy() { ro.disconnect(); images = []; },
  };
}
