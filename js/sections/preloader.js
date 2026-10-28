import { gsap } from '../lib/gsap.js';

/**
 * "The Seam" — remix of P5 (letters rise) × P3 (real counter) × P6 (light pool)
 * × P11 (split exit). Letters and light are CSS so they play from first paint;
 * here the counter and brass seam follow the hero's real first-pass load, then
 * the two halves part along the seam — the name rides up, the counter rides
 * down — and the portrait settles in behind them.
 * Holds until ~1.15 s after navigation start (cap 1.5 s); finished by ~2.3 s.
 * Plays once per visit (sessionStorage, read in the <head> script): a new tab or a later
 * visit replays it; a refresh or coming back from a case study skips it. Off for reduced motion.
 */
export function runPreloader({ ready }) {
  const html = document.documentElement;
  const root = document.querySelector('.preloader');
  if (!root || html.classList.contains('pl-skip')) {
    root?.remove();
    html.classList.remove('is-loading');
    return Promise.resolve();
  }

  const num = root.querySelector('.pl__num');
  const fill = root.querySelector('.pl__seam i');
  const seam = root.querySelector('.pl__seam');
  const top = root.querySelector('.pl__half--top');
  const bottom = root.querySelector('.pl__half--bottom');
  const fades = root.querySelectorAll('.pl__count');
  const word = root.querySelector('.pl__word');
  const heroMedia = document.querySelectorAll('.hero__poster, .hero__canvas');

  const shown = { v: 0 };
  const paint = () => {
    fill.style.transform = `scaleX(${shown.v})`;
    num.textContent = String(Math.round(shown.v * 100)).padStart(3, '0');
  };
  // ease toward real progress, but never stall at 0 on a slow first frame
  const onProgress = (e) => gsap.to(shown, { v: Math.max(shown.v, Math.min(1, e.detail)), duration: 0.45, ease: 'power2.out', overwrite: true, onUpdate: paint });
  addEventListener('seq:progress', onProgress);

  // the portrait waits slightly zoomed behind the halves
  gsap.set(heroMedia, { scale: 1.08, transformOrigin: '50% 38%' });

  // timings measured from navigation start, not from when this module loaded
  const until = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms - performance.now())));
  return Promise.race([Promise.all([ready, until(900)]), until(1300)]).then(() => new Promise((done) => {
    removeEventListener('seq:progress', onProgress);
    try { sessionStorage.setItem('tw-pl', '1'); } catch { /* storage blocked */ }

    gsap.timeline({ onComplete: () => { root.remove(); done(); } })
      .to(shown, { v: 1, duration: 0.2, ease: 'power2.out', onUpdate: paint })
      .to(fades, { autoAlpha: 0, duration: 0.25, ease: 'power2.in', stagger: 0.02 }, 0.1)
      .addLabel('split', 0.3)
      .add(() => html.classList.remove('is-loading'), 'split')
      // the hairline flares, then the halves part along it
      .to(seam, { scaleY: 3, duration: 0.16, ease: 'power2.out' }, 'split')
      .to(seam, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, 'split+=0.1')
      .to(top, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 'split')
      .to(bottom, { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, 'split')
      .to(word, { yPercent: -30, duration: 0.9, ease: 'expo.inOut' }, 'split')
      .add(() => gsap.to(heroMedia, { scale: 1, duration: 1.5, ease: 'expo.out', clearProps: 'transform' }), 'split+=0.15')
      .add(done, 'split+=0.45'); // hand control back while the halves finish opening
  }));
}
