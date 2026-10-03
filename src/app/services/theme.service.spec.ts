import { TestBed } from '@angular/core/testing';
import { Optimus } from '@openng/optimus-ui/config';

import { FontService } from './font.service';
import { THEME_COLORS, ThemeService, darkenHex, lightenHex, widgetPrimarySemantic } from './theme.service';
import { DEFAULT_STYLE } from './ui-styles';

/**
 * The widget accent ramp (theme.service.ts `widgetPrimarySemantic`). The
 * contrast gate (scripts/check-contrast.mjs) measures what the ramp paints;
 * this spec pins WHERE the ramp comes from, per mode, so a refactor cannot
 * quietly go back to the light primaryColor in dark mode — which painted the
 * contrast palette's dark widgets near-black on near-black (1.18:1).
 */
describe('widgetPrimarySemantic — the Optimus accent ramp', () => {
  const byName = (name: string) => THEME_COLORS.find((c) => c.name === name)!;

  const luminance = (hex: string): number => {
    const ch = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [r, g, b] = ch.map((s) => (s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string): number => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  it('builds the light ramp around primaryColor', () => {
    const coral = byName('coral');
    const { primary } = widgetPrimarySemantic(coral, false).semantic;
    expect(primary[500]).toBe(coral.primaryColor);
    expect(primary[400]).toBe(lightenHex(coral.primaryColor, 0.2));
    expect(primary[600]).toBe(darkenHex(coral.primaryColor, 0.1));
  });

  it('builds the dark ramp around primaryFgDark, not the light primaryColor', () => {
    for (const c of THEME_COLORS) {
      const { primary } = widgetPrimarySemantic(c, true).semantic;
      expect(primary[500]).toBe(c.primaryFgDark);
      expect(primary[500]).not.toBe(c.primaryColor);
    }
  });

  it("points Aura's dark primary.color at the ramp base, hover and active one and two steps lighter", () => {
    const { colorScheme } = widgetPrimarySemantic(byName('ocean'), true).semantic;
    expect(colorScheme.dark.primary).toEqual({
      color: '{primary.500}',
      hoverColor: '{primary.400}',
      activeColor: '{primary.300}',
    });
  });

  it('gives the contrast palette a light dark-mode accent (the former near-black one measured 1.18:1)', () => {
    const { primary } = widgetPrimarySemantic(byName('contrast'), true).semantic;
    // zinc.900 is Aura's darkest dark surface a widget sits on.
    expect(contrast(primary[500], '#18181b')).toBeGreaterThanOrEqual(3);
  });

  it('keeps every dark accent at >= 3:1 on the dark progress track (zinc.700), SC 1.4.11', () => {
    for (const c of THEME_COLORS) {
      const { primary } = widgetPrimarySemantic(c, true).semantic;
      expect(contrast(primary[500], '#3f3f46')).toBeGreaterThanOrEqual(3);
    }
  });

  it('falls back to a fixed blue without a palette', () => {
    expect(widgetPrimarySemantic(undefined, false).semantic.primary[500]).toBe('#3b82f6');
    expect(widgetPrimarySemantic(undefined, true).semantic.primary[500]).toBe('#3b82f6');
  });

  it('clamps the additive shift instead of wrapping', () => {
    expect(lightenHex('#ffffff', 0.5)).toBe('#ffffff');
    expect(darkenHex('#000000', 0.5)).toBe('#000000');
  });
});

/**
 * Print is light paper in every mode. The runtime writes the mode's
 * tokens inline on <html>, which no `@media print` rule can beat, so the
 * service itself switches to light on `beforeprint` and back on `afterprint`
 * — without touching the stored mode.
 */
describe('ThemeService — print on light paper', () => {
  const root = () => document.documentElement;
  const ground = () => root().style.getPropertyValue('--surface-ground');

  function create(mode: 'light' | 'dark'): ThemeService {
    localStorage.setItem('mode', mode);
    localStorage.setItem('themeColor', 'sunset');
    TestBed.configureTestingModule({
      providers: [
        { provide: Optimus, useValue: { theme: null } },
        { provide: FontService, useValue: { applyStyleFonts: () => undefined } },
      ],
    });
    const service = TestBed.inject(ThemeService);
    service.applyTheme();
    return service;
  }

  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      (query: string) =>
        ({
          matches: false,
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }) as unknown as MediaQueryList,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
    localStorage.clear();
    root().removeAttribute('style');
    root().className = '';
    document.body.className = '';
  });

  it('paints the light variant for the print and restores dark afterwards', () => {
    const service = create('dark');
    expect(root().classList.contains('dark-theme')).toBe(true);
    expect(ground()).toBe(DEFAULT_STYLE.surfaces.dark.ground);

    window.dispatchEvent(new Event('beforeprint'));
    expect(root().classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(ground()).toBe(DEFAULT_STYLE.surfaces.light.ground);
    expect(root().style.getPropertyValue('--primary-color-fg')).toBe(THEME_COLORS[0].primaryFg);
    // The reader's choice is untouched: the mode and what is stored.
    expect(service.mode()).toBe('dark');
    expect(localStorage.getItem('mode')).toBe('dark');

    window.dispatchEvent(new Event('afterprint'));
    expect(root().classList.contains('dark-theme')).toBe(true);
    expect(ground()).toBe(DEFAULT_STYLE.surfaces.dark.ground);
    expect(root().style.getPropertyValue('--primary-color-fg')).toBe(THEME_COLORS[0].primaryFgDark);
  });

  it('leaves a light page alone', () => {
    const service = create('light');
    const spy = vi.spyOn(service, 'applyTheme');
    window.dispatchEvent(new Event('beforeprint'));
    window.dispatchEvent(new Event('afterprint'));
    expect(spy).not.toHaveBeenCalled();
    expect(root().classList.contains('light-theme')).toBe(true);
  });
});

/**
 * Mode "system" follows the OS color scheme live. `isDarkMode` used to read
 * matchMedia inside a computed, which tracks only signals: it kept its first
 * value, and a change of the OS scheme showed only after a reload.
 */
describe('ThemeService — mode "system" follows the OS live', () => {
  const root = () => document.documentElement;
  let osDark: boolean;
  let listeners: Array<(event: MediaQueryListEvent) => void>;
  let removed: number;

  function create(mode: 'light' | 'dark' | 'system'): ThemeService {
    localStorage.setItem('mode', mode);
    localStorage.setItem('themeColor', 'sunset');
    TestBed.configureTestingModule({
      providers: [
        { provide: Optimus, useValue: { theme: null } },
        { provide: FontService, useValue: { applyStyleFonts: () => undefined } },
      ],
    });
    const service = TestBed.inject(ThemeService);
    service.applyTheme();
    return service;
  }

  function switchOs(dark: boolean): void {
    osDark = dark;
    for (const listener of [...listeners]) listener({ matches: dark } as MediaQueryListEvent);
  }

  beforeEach(() => {
    osDark = false;
    listeners = [];
    removed = 0;
    vi.stubGlobal('matchMedia', (query: string) => {
      const isScheme = query === '(prefers-color-scheme: dark)';
      return {
        get matches() {
          return isScheme && osDark;
        },
        media: query,
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          if (isScheme) listeners.push(listener);
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          const i = listeners.indexOf(listener);
          if (i >= 0) {
            listeners.splice(i, 1);
            removed++;
          }
        },
      } as unknown as MediaQueryList;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
    localStorage.clear();
    root().removeAttribute('style');
    root().className = '';
    document.body.className = '';
  });

  it('switches to dark and back when the OS scheme changes, without a reload', () => {
    const service = create('system');
    expect(service.isDarkMode()).toBe(false);
    expect(root().classList.contains('light-theme')).toBe(true);

    switchOs(true);
    expect(service.isDarkMode()).toBe(true);
    expect(root().classList.contains('dark-theme')).toBe(true);
    expect(root().style.getPropertyValue('--surface-ground')).toBe(DEFAULT_STYLE.surfaces.dark.ground);

    switchOs(false);
    expect(service.isDarkMode()).toBe(false);
    expect(root().classList.contains('light-theme')).toBe(true);
    expect(root().style.getPropertyValue('--surface-ground')).toBe(DEFAULT_STYLE.surfaces.light.ground);
  });

  it('keeps a fixed mode when the OS scheme changes, and uses the new scheme on switching to "system"', () => {
    const service = create('light');
    switchOs(true);
    expect(service.isDarkMode()).toBe(false);
    expect(root().classList.contains('light-theme')).toBe(true);

    service.setMode('system');
    expect(service.isDarkMode()).toBe(true);
    expect(root().classList.contains('dark-theme')).toBe(true);
  });

  it('removes its listener when the service is destroyed', () => {
    create('system');
    expect(listeners.length).toBe(1);
    TestBed.resetTestingModule();
    expect(listeners.length).toBe(0);
    expect(removed).toBe(1);
  });
});
