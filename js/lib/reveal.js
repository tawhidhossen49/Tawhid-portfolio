import { gsap, SplitText } from './gsap.js';
import { reduceMotion } from './env.js';

const onEnter = (el, start = 'top 86%') => ({ trigger: el, start, once: true });

/**
 * data-reveal="lines"  T1 line-mask rise
 * data-reveal="up"     soft rise + fade
 * data-reveal="blur"   T4 deblur in
 * data-reveal="clip"   clip-path wipe up (images)
 */
export function initReveals(scope = document) {
  if (reduceMotion) return;

  scope.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      aria: 'none', // split lines keep their real text; aria-label is invalid on <p>/<span>
      autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: onEnter(el),
      }),
    });
  });

  scope.querySelectorAll('[data-reveal="up"]').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: onEnter(el) });
  });

  scope.querySelectorAll('[data-reveal="blur"]').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, filter: 'blur(12px)', scale: 1.04 },
      { autoAlpha: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: onEnter(el), clearProps: 'filter' });
  });

  scope.querySelectorAll('[data-reveal="clip"]').forEach((el) => {
    gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: onEnter(el, 'top 92%') });
  });

  // inner parallax on case-study screens
  scope.querySelectorAll('[data-parallax] img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}
