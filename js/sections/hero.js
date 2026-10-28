import { gsap } from '../lib/gsap.js';
import { createSequence } from '../lib/sequence.js';
import { reduceMotion, usePortraitFrames } from '../lib/env.js';

/**
 * 01 · H1 — hero-portrait clip scrubbed on canvas, pinned 300vh (×0.7 on phones).
 * Giant TAWHID tracks out by 35%, three captions deblur in left/right of the subject,
 * the clip ends on obsidian and the ivory Statement card rises over it.
 */
export function initHero() {
  const section = document.querySelector('.hero');
  if (!section) return { ready: Promise.resolve(), build() {} };

  const stage = section.querySelector('.hero__stage');
  const inner = section.querySelector('.hero__inner');
  const canvas = section.querySelector('.hero__canvas');
  const seq = createSequence({
    canvas,
    base: '/sequences/hero-portrait/',
    portrait: usePortraitFrames(),
    focusY: 0.3,
    onProgress: (p) => dispatchEvent(new CustomEvent('seq:progress', { detail: p })),
  });
  const { firstPass } = seq.load();
  firstPass.then(() => canvas.classList.add('is-ready'));

  function build() {
    const name = section.querySelector('.hero__name');
    const meta = section.querySelectorAll('.hero__meta > *');
    const cue = section.querySelector('.hero__cue');
    const caps = section.querySelectorAll('.hero__cap');

    if (reduceMotion) {
      seq.state.p = 0.78;
      firstPass.then(() => seq.render(true));
      return;
    }

    const mm = gsap.matchMedia();
    mm.add({ small: '(max-width: 767px)', large: '(min-width: 768px)' }, (ctx) => {
      const len = ctx.conditions.small ? 210 : 300;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // the section is the spacer: no DOM re-parenting, so the hero isn't repainted after load
        scrollTrigger: { trigger: stage, start: 'top top', end: `+=${len}%`, pin: true, pinSpacer: section, scrub: 0.8, anticipatePin: 1 },
      });
      tl.to(seq.state, { p: 1, duration: 1, onUpdate: () => seq.render() }, 0)
        .to(cue, { autoAlpha: 0, duration: 0.04 }, 0.01)
        .to(meta, { autoAlpha: 0, y: -10, duration: 0.1, ease: 'power1.in' }, 0.12)
        .to(name, { letterSpacing: '0.02em', yPercent: -6, autoAlpha: 0, duration: 0.24, ease: 'power1.in' }, 0.1);

      caps.forEach((el) => {
        const a = parseFloat(el.dataset.in);
        const b = parseFloat(el.dataset.out);
        tl.fromTo(el, { autoAlpha: 0, y: 40, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.08, ease: 'power2.out' }, a);
        if (b < 1) tl.to(el, { autoAlpha: 0, y: -30, filter: 'blur(6px)', duration: 0.07, ease: 'power2.in' }, b - 0.07);
      });
    });

    // hand-off: the Statement card rises over the last frame
    const next = document.querySelector('.statement');
    if (next) {
      gsap.to(inner, {
        yPercent: 30, scale: 0.96, autoAlpha: 0.35, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true },
      });
    }
  }

  return { ready: firstPass, build };
}
