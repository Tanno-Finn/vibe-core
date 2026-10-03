/**
 * Reduced-motion helpers for JavaScript-driven motion (A11Y-007).
 *
 * Why this exists: the global `prefers-reduced-motion` block in styles.scss
 * is CSS, so it cannot reach an explicit `scrollIntoView({ behavior: 'smooth' })`
 * or `scrollTo({ behavior: 'smooth' })` — an explicit behavior option
 * overrides the `scroll-behavior` property instead of reading it. Every such
 * call asks this helper instead of hard-coding 'smooth'. Timer-driven motion
 * (auto-play, carousels) asks prefersReducedMotion() before it starts.
 *
 * Both functions are SSR-safe: without a window (prerender) or without
 * matchMedia they report "no preference", and no scroll happens there anyway.
 *
 * Usage:
 *   import { scrollBehavior } from '../../utils/reduced-motion';
 *   el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
 */

/** True when the visitor asked the system for reduced motion. Read on every
 *  call, so a preference changed at runtime takes effect on the next scroll. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 'auto' (an instant jump) under reduced motion, 'smooth' otherwise. Typed as
 * exactly those two, not the DOM's wider `ScrollBehavior` (which adds 'instant'),
 * so it also fits APIs typed `'auto' | 'smooth'` (p-scrolltop's `behavior`)
 * without a narrowing at the call site.
 */
export function scrollBehavior(): 'auto' | 'smooth' {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
