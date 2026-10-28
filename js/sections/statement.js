import { gsap, SplitText } from '../lib/gsap.js';
import { reduceMotion } from '../lib/env.js';

/** 02 · T2 — words go from 15% to full ink as the paragraph crosses the viewport. */
export function initStatement() {
  if (reduceMotion) return;
  document.querySelectorAll('[data-t2]').forEach((p) => {
    const { words } = SplitText.create(p, { type: 'words', aria: 'none' });
    // immediateRender:false keeps words at full ink until the paragraph is actually on screen
    const st = { trigger: p, start: 'top bottom', end: 'bottom 45%', scrub: true };
    gsap.fromTo(words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.05, ease: 'none', immediateRender: false, scrollTrigger: st,
    });
    // the image pills open inside the sentence as the reading line reaches them
    p.querySelectorAll('.pill').forEach((pill) => {
      gsap.fromTo(pill, { scaleX: 0.2, opacity: 0.15 }, {
        scaleX: 1, opacity: 1, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: pill, start: 'top 92%', end: 'top 55%', scrub: true },
      });
    });
  });
}
