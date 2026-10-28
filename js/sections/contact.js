import { gsap, SplitText } from '../lib/gsap.js';
import { reduceMotion } from '../lib/env.js';

/** 08 · T10 fill on "great", copy-email button, Q5 live Dhaka clock, footer year, F1 bookend. */
export function initContact() {
  // F1 bookend: the closing TAWHID rises letter by letter as the page ends
  const book = document.querySelector('.bookend__word');
  if (book && !reduceMotion) {
    const { chars } = SplitText.create(book, { type: 'chars', aria: 'none' });
    gsap.from(chars, {
      yPercent: 100, duration: 1.3, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: book.parentElement, start: 'top 98%', once: true },
    });
  }

  const fill = document.querySelector('.contact__title .fill');
  if (fill && !reduceMotion) {
    gsap.to(fill, {
      backgroundPosition: '0% 0', ease: 'none',
      scrollTrigger: { trigger: fill, start: 'top 85%', end: 'top 45%', scrub: true },
    });
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('.copy__state span');
    const icon = btn.querySelector('.copy__state use');
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.dataset.copy);
      if (!ok) { location.href = `mailto:${btn.dataset.copy}`; return; }
      btn.classList.add('is-copied');
      label.textContent = 'Copied';
      icon?.setAttribute('href', '#i-check');
      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.classList.remove('is-copied');
        label.textContent = 'Copy email';
        icon?.setAttribute('href', '#i-copy');
      }, 2200);
    });
  });

  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Dhaka' });
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.setAttribute('datetime', now.toISOString());
    };
    tick();
    setInterval(tick, 1000);
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
