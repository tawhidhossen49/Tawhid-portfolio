import { gsap, ScrollTrigger } from './gsap.js';
import { lenis, scrollToTarget } from './smooth.js';
import { isHome } from './env.js';

/** M3 nav (solid after 80px, hides on scroll down), M4 progress line, mobile menu, in-page anchors. */
export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('.progress');
  const btn = document.querySelector('.nav__menu');
  const menu = document.getElementById('menu');

  if (progress) {
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  if (nav) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle('is-solid', y > 80);
        nav.classList.toggle('is-hidden', self.direction === 1 && y > 400 && !menu?.classList.contains('is-open'));
      },
    });
  }

  const setMenu = (open) => {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (open) { lenis?.stop(); menu.querySelector('a')?.focus({ preventScroll: true }); }
    else lenis?.start();
  };
  btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.classList.contains('is-open')) { setMenu(false); btn.focus(); }
  });

  // in-page anchors ("/#work") scroll smoothly on the home page
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !url.hash) return;
    const samePage = url.pathname === location.pathname || (isHome() && /^\/(index(\.html)?)?$/.test(url.pathname));
    if (!samePage) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    scrollToTarget(target);
    history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
  });
}

/** After boot: honour a hash in the URL (e.g. arriving from a case study via /#work). */
export function jumpToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => scrollToTarget(target, { immediate: true }));
}
