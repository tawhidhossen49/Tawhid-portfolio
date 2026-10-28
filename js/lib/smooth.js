import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';
import { reduceMotion } from './env.js';

export let lenis = null;

/** Lenis (lerp 0.08) driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function initSmooth() {
  if (reduceMotion) return null;
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(target, { immediate = false } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  // absolute page offset (pin spacers included) — more reliable than letting Lenis measure mid-refresh
  const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
  if (lenis) lenis.scrollTo(y, { duration: 1.6, immediate, force: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: reduceMotion || immediate ? 'auto' : 'smooth' });
}
