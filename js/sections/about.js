import { gsap } from '../lib/gsap.js';
import { reduceMotion } from '../lib/env.js';

/**
 * 04 · S3 — a small obsidian card on ivory opens to fullscreen while ABOUT / ME
 * split to the edges. The card is always full-size; a clip-path window does the
 * "growing", and the cutout scales from fitting the window to its final place.
 */
export function initAbout() {
  const section = document.querySelector('.about');
  if (!section || reduceMotion) return;

  const stage = section.querySelector('.about__stage');
  const card = section.querySelector('.about__card');
  const figure = section.querySelector('.about__figure');
  const wl = section.querySelector('.about__w--l');
  const wr = section.querySelector('.about__w--r');
  const content = section.querySelectorAll('.about__content > *');
  const ghost = section.querySelector('.about__ghost');

  const mm = gsap.matchMedia();
  mm.add({ small: '(max-width: 767px)', large: '(min-width: 768px)' }, (ctx) => {
    const small = ctx.conditions.small;

    const win = () => {
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const w = small ? vw * 0.56 : gsap.utils.clamp(240, 360, vw * 0.22);
      const h = w * 4 / 3;
      return { t: (vh - h) / 2, l: (vw - w) / 2, w, h, vw, vh };
    };
    const clipFrom = () => {
      const r = win();
      return `inset(${r.t}px ${r.l}px ${r.t}px ${r.l}px round 14px)`;
    };
    // figure geometry in its final (untransformed) place
    const fig = () => ({
      cx: figure.offsetLeft + figure.offsetWidth / 2,
      bottom: figure.offsetTop + figure.offsetHeight,
      h: figure.offsetHeight,
    });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage, start: 'top top', end: `+=${small ? 130 : 160}%`,
        pin: true, pinSpacer: stage.parentElement, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });

    tl.fromTo(card, { clipPath: clipFrom }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.6, ease: 'power2.inOut' }, 0)
      .fromTo(figure, {
        x: () => win().vw / 2 - fig().cx,
        y: () => { const r = win(); return (r.t + r.h) - fig().bottom; },
        scale: () => (win().h * 0.94) / fig().h,
      }, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(wl, { xPercent: -120, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.04)
      .to(wr, { xPercent: 120, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.04)
      .fromTo(content, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.035, ease: 'power2.out' }, 0.6);

    // the outlined word drifts behind the cutout for the whole pin (depth by layering)
    if (ghost) tl.fromTo(ghost, { xPercent: 2 }, { xPercent: -8, duration: 1, ease: 'none' }, 0);

    // on phones the story sits over the portrait, so the portrait steps back
    if (small) tl.to(figure, { autoAlpha: 0.28, duration: 0.15 }, 0.58);
    tl.to({}, { duration: 0.12 });
  });
}
