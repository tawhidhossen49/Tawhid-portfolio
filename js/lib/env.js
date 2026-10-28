const root = document.documentElement;

/** Set in the inline <head> script so CSS and JS agree. */
export const reduceMotion = root.classList.contains('is-reduced');
export const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/** Portrait phones/tablets get the 9:16 frame set. */
export const usePortraitFrames = () => window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches;

export const isHome = () => /^\/(index(\.html)?)?$/.test(location.pathname);

/** Calls `cb` once when `el` is within `margin` of the viewport. */
export function whenNear(el, cb, margin = '150% 0px') {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); cb(); }
  }, { rootMargin: margin });
  io.observe(el);
}
