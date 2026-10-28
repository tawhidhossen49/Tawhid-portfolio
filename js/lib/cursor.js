import { gsap } from './gsap.js';
import { isTouch } from './env.js';

/** M2 — primary CTAs lean toward the cursor and settle back smoothly (no bounce). */
export function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll('.copy, .btn--solid:not(.feat__cta .btn)').forEach((b) => {
    const qx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
    const qy = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
    const strength = b.classList.contains('copy') ? 0.12 : 0.25;
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * strength);
      qy((e.clientY - r.top - r.height / 2) * strength);
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'expo.out' }));
  });
}

/** M1 — small brass ring; grows with a label over [data-cursor]. Hidden on touch. */
export function initCursor() {
  const c = document.querySelector('.cursor');
  if (!c || isTouch) return;
  const label = c.querySelector('span');
  const x = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3' });
  const y = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3' });

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x(e.clientX);
    y(e.clientY);
    c.classList.add('is-on');
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => c.classList.remove('is-on'));

  document.addEventListener('pointerover', (e) => {
    const big = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button');
    c.classList.toggle('is-big', !!big);
    c.classList.toggle('is-link', !big && !!link);
    label.textContent = big ? big.dataset.cursor : '';
  });
}
