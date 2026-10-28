import { gsap } from '../lib/gsap.js';
import { createSequence } from '../lib/sequence.js';
import { reduceMotion, isTouch, usePortraitFrames, whenNear } from '../lib/env.js';

/**
 * 03 · Signature — the desk-dive clip becomes the work.
 * 0–.42   camera glides into the laptop; the whiteout lands on Bone Ivory
 * .34–.42 the clip's floating panels fade as the three real project panels
 *         appear at depth in the same places
 * .45–1   each project pushes forward out of the dark, holds, then flies past
 */
export function initWork() {
  const section = document.querySelector('.work');
  if (!section) return;
  initIndex(section);
  if (reduceMotion) return;

  const stage = section.querySelector('.work__stage');
  const canvas = section.querySelector('.work__canvas');
  const flash = section.querySelector('.work__flash');
  const head = section.querySelector('.work__head');
  const medias = gsap.utils.toArray('.feat__media', section);
  const infos = gsap.utils.toArray('.feat__info', section);

  const seq = createSequence({ canvas, base: '/sequences/desk-dive/', portrait: usePortraitFrames(), focusY: 0.5 });
  whenNear(section, () => seq.load());

  const mm = gsap.matchMedia();
  mm.add({ small: '(max-width: 767px)', large: '(min-width: 768px)' }, (ctx) => {
    const small = ctx.conditions.small;
    const len = small ? 260 : 360;
    // depth slots that echo where the clip's own panels float
    const slots = small
      ? [{ x: '-18vw', y: '-20vh', z: -700 }, { x: '20vw', y: '-4vh', z: -900 }, { x: '-6vw', y: '16vh', z: -1100 }]
      : [{ x: '-14vw', y: '-18vh', z: -800 }, { x: '34vw', y: '2vh', z: -1000 }, { x: '8vw', y: '24vh', z: -1200 }];
    const blur = (px) => (small ? 'blur(0px)' : `blur(${px}px)`);

    gsap.set(medias, { x: (i) => slots[i].x, y: (i) => slots[i].y, z: (i) => slots[i].z, autoAlpha: 0, filter: blur(5) });
    gsap.set(infos, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: stage, start: 'top top', end: `+=${len}%`, pin: true, pinSpacer: stage.parentElement, scrub: 0.8, anticipatePin: 1 },
    });

    const C = 0.42; // share of the pin the clip plays over
    tl.to(seq.state, { p: 1, duration: C, onUpdate: () => seq.render() }, 0)
      .to(head, { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power1.in' }, 0.06)
      // whiteout → Bone Ivory (clip progress ≈ .29–.46)
      .fromTo(flash, { opacity: 0 }, { opacity: 0.94, duration: C * 0.06, ease: 'power1.inOut' }, C * 0.285)
      .to(flash, { opacity: 0, duration: C * 0.14, ease: 'power1.inOut' }, C * 0.36)
      // hand-off: real panels take the clip panels' places
      .to(medias, { autoAlpha: 0.45, duration: 0.07, stagger: 0.012 }, C * 0.8)
      .to(canvas, { autoAlpha: 0, duration: 0.07 }, C * 0.94);

    const start = C + 0.03;
    const step = (1 - start) / medias.length;
    medias.forEach((m, i) => {
      const at = start + i * step;
      const last = i === medias.length - 1;
      tl.to(m, { x: 0, y: 0, z: 0, autoAlpha: 1, filter: 'blur(0px)', duration: step * 0.38, ease: 'power2.out' }, at)
        .to(infos[i], { autoAlpha: 1, y: 0, duration: step * 0.18, ease: 'power2.out' }, at + step * 0.26);
      // the waiting panels drift a little closer each beat
      medias.slice(i + 1).forEach((rest) => {
        tl.to(rest, { z: `+=${small ? 120 : 160}`, autoAlpha: 0.14, duration: step * 0.38, ease: 'power1.out' }, at);
      });
      if (!last) {
        tl.to(infos[i], { autoAlpha: 0, y: -20, duration: step * 0.1, ease: 'power1.in' }, at + step * 0.84)
          .to(m, { z: 520, autoAlpha: 0, filter: blur(8), duration: step * 0.2, ease: 'power2.in' }, at + step * 0.86);
      }
    });
    tl.set({}, {}, 1); // keep the timeline exactly 1 long so beats map to scroll as written

    // signature polish: the panel in focus leans a few degrees toward the cursor.
    // rotationX/Y are free channels — the scrubbed timeline only drives x/y/z/opacity/filter.
    if (small || isTouch) return;
    const rx = medias.map((m) => gsap.quickTo(m, 'rotationX', { duration: 0.9, ease: 'power3' }));
    const ry = medias.map((m) => gsap.quickTo(m, 'rotationY', { duration: 0.9, ease: 'power3' }));
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      medias.forEach((_, i) => { rx[i](ny * -5); ry[i](nx * 7); });
    };
    const onLeave = () => medias.forEach((_, i) => { rx[i](0); ry[i](0); });
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.set(medias, { rotationX: 0, rotationY: 0 });
    };
  });
}

/** C6 — hover-follow preview over the full project index (desktop pointers only). */
function initIndex(section) {
  const list = section.querySelector('.index__list');
  const prev = section.querySelector('.index__preview');
  if (!list || !prev || isTouch) return;

  const rows = [...list.querySelectorAll('.row')];
  let imgs = null;
  const ensureImages = () => {
    if (imgs) return;
    imgs = rows.map((r) => {
      const img = new Image();
      img.src = r.dataset.img;
      img.alt = '';
      img.decoding = 'async';
      prev.appendChild(img);
      return img;
    });
  };

  gsap.set(prev, { xPercent: -50, yPercent: -50, scale: 0.9 });
  const qx = gsap.quickTo(prev, 'x', { duration: 0.65, ease: 'power3' });
  const qy = gsap.quickTo(prev, 'y', { duration: 0.65, ease: 'power3' });
  const qr = gsap.quickTo(prev, 'rotation', { duration: 0.8, ease: 'power3' });
  let lastX = 0;
  let px = -1;
  let py = -1;
  let shown = false;
  let current = -1;

  const show = (i) => {
    ensureImages();
    if (i !== current) {
      imgs.forEach((img, j) => img.classList.toggle('is-active', i === j));
      current = i;
    }
    if (!shown) gsap.to(prev, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    shown = true;
  };
  const hide = () => {
    if (!shown) return;
    gsap.to(prev, { autoAlpha: 0, scale: 0.92, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    shown = false;
  };

  list.addEventListener('pointerenter', (e) => {
    ensureImages();
    gsap.set(prev, { x: e.clientX, y: e.clientY });
  });
  addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  list.addEventListener('pointermove', (e) => {
    qx(e.clientX);
    qy(e.clientY);
    qr(gsap.utils.clamp(-3, 3, (e.clientX - lastX) * 0.25));
    lastX = e.clientX;
  }, { passive: true });
  rows.forEach((row, i) => row.addEventListener('pointerenter', () => show(i)));
  list.addEventListener('pointerleave', hide);

  // scrolling moves the rows under a still cursor without firing pointer events:
  // re-check what's under the pointer so the preview never gets left behind
  addEventListener('scroll', () => {
    if (!shown || px < 0) return;
    const row = document.elementFromPoint(px, py)?.closest('.row');
    const i = row ? rows.indexOf(row) : -1;
    if (i < 0) hide();
    else show(i);
  }, { passive: true });
}
