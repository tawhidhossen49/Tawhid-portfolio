import { gsap } from '../lib/gsap.js';
import { reduceMotion } from '../lib/env.js';

/** 06 · S7 — each sticky card scales to .94 and dims as the next one slides over it. */
export function initServices() {
  if (reduceMotion) return;
  const cards = gsap.utils.toArray('.svc');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.95, '--dim': 0.28, ease: 'none',
      scrollTrigger: {
        trigger: next,
        start: 'top bottom',
        end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}
