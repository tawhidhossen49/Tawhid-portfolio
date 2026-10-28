import { gsap } from '../lib/gsap.js';
import { reduceMotion } from '../lib/env.js';

/** 07 · S15 — the brass line draws across; nodes light as it reaches them. */
export function initProcess() {
  const line = document.querySelector('.tline');
  if (!line || reduceMotion) return;
  const bar = line.querySelector('.tline__bar');
  const items = [...line.querySelectorAll('li')];

  const mm = gsap.matchMedia();
  mm.add({ small: '(max-width: 767px)', large: '(min-width: 768px)' }, (ctx) => {
    const prop = ctx.conditions.small ? 'scaleY' : 'scaleX';
    gsap.fromTo(bar, { [prop]: 0 }, {
      [prop]: 1, ease: 'none',
      scrollTrigger: {
        trigger: line, start: 'top 72%', end: ctx.conditions.small ? 'bottom 60%' : 'bottom 50%', scrub: 0.6,
        onUpdate: (s) => items.forEach((li, i) => li.classList.toggle('on', s.progress >= i / (items.length - 1) - 0.02)),
      },
    });
  });
}
