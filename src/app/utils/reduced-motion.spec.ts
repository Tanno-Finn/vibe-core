/**
 * scroll-behavior spec — JS-driven scrolling honors prefers-reduced-motion:
 * 'auto' under reduce, 'smooth' otherwise, and "no preference" when
 * matchMedia is missing (jsdom, very old browsers).
 */
import { prefersReducedMotion, scrollBehavior } from './reduced-motion';

function stubMatchMedia(reduce: boolean): void {
  window.matchMedia = ((query: string) =>
    ({
      matches: reduce && query === '(prefers-reduced-motion: reduce)',
      media: query,
    }) as MediaQueryList) as typeof window.matchMedia;
}

describe('scrollBehavior', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('returns auto when the visitor prefers reduced motion', () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
    expect(scrollBehavior()).toBe('auto');
  });

  it('returns smooth when there is no such preference', () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
    expect(scrollBehavior()).toBe('smooth');
  });

  it('reads the preference on every call', () => {
    stubMatchMedia(false);
    expect(scrollBehavior()).toBe('smooth');
    stubMatchMedia(true);
    expect(scrollBehavior()).toBe('auto');
  });

  it('is typed as exactly the two values it returns, so narrow APIs take it as is', () => {
    stubMatchMedia(false);
    // Compile-time half: this assignment fails to type-check if the return type
    // widens back to the DOM's ScrollBehavior ('auto' | 'instant' | 'smooth').
    const behavior: 'auto' | 'smooth' = scrollBehavior();
    expect(['auto', 'smooth']).toContain(behavior);
  });

  it('treats a missing matchMedia as no preference', () => {
    (window as { matchMedia?: unknown }).matchMedia = undefined;
    expect(prefersReducedMotion()).toBe(false);
    expect(scrollBehavior()).toBe('smooth');
  });
});
