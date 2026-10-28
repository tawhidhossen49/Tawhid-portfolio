import { ScrollTrigger } from './lib/gsap.js';
import { initSmooth } from './lib/smooth.js';
import { initNav, jumpToHash } from './lib/nav.js';
import { initCursor, initMagnetic } from './lib/cursor.js';
import { initReveals } from './lib/reveal.js';
import { runPreloader } from './sections/preloader.js';
import { initHero } from './sections/hero.js';
import { initStatement } from './sections/statement.js';
import { initWork } from './sections/work.js';
import { initAbout } from './sections/about.js';
import { initServices } from './sections/services.js';
import { initProcess } from './sections/process.js';
import { initContact } from './sections/contact.js';

const html = document.documentElement;
html.classList.add('is-booted');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const lenis = initSmooth();
if (html.classList.contains('is-loading')) lenis?.stop();

// start pulling hero frames before fonts are ready
const hero = initHero();

(async () => {
  await document.fonts.ready;
  const preloader = runPreloader({ ready: hero.ready });

  // scroll scenes in DOM order so pin spacing resolves top-down
  hero.build();
  initStatement();
  initWork();
  initAbout();
  initServices();
  initProcess();
  initContact();
  initReveals();
  initNav();
  initCursor();
  initMagnetic();

  await preloader;
  lenis?.start();
  ScrollTrigger.refresh();
  jumpToHash();
})();

// images without dimensions or late layout can move triggers; refresh once everything is in
addEventListener('load', () => ScrollTrigger.refresh());
