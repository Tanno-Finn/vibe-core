/**
 * Theme Service
 * Owns the three axes of the kit's look: visual STYLE (ADR-0016), accent COLOR
 * and MODE. It writes every derived design token as an inline custom property
 * on <html>, sets the `style-<name>` scope class, merges the style's
 * `definePreset` delta plus the accent ramp onto Aura, and persists a token
 * snapshot of both modes so the anti-FOUC script in index.html can paint the
 * returning reader's look before Angular boots.
 *
 * ADR-0016 replaced the former preset axis (Aura/Material/Lara/Nora) with the
 * style axis; the `theme` storage key kept its name and now holds a style name
 * (see `resolveStoredStyle` in ui-styles.ts).
 */
import { ApplicationRef, DestroyRef, Injectable, signal, computed, inject, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Optimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';
import { definePreset } from '@openng/optimus-ui-themes';

import { safeStorage } from '../utils/safe-storage';
import { FontService } from './font.service';
import {
  UI_STYLES,
  DEFAULT_STYLE,
  DEFAULT_STYLE_NAME,
  resolveStoredStyle,
  severityHoverBrightness,
  hoverBrightnessFor,
  outlinedSeverityInk,
} from './ui-styles';
import type { StyleName, UiStyle } from './ui-styles';

export type { StyleName, UiStyle } from './ui-styles';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor =
  // Warm
  | 'fire'
  | 'sunset'
  | 'coral'
  // Nature
  | 'forest'
  | 'ocean'
  // Cool
  | 'aurora'
  | 'twilight'
  // Rich
  | 'mystic'
  | 'stone'
  // Accessibility (AAA, ≥7:1)
  | 'contrast';

export interface ThemeColorOption {
  name: ThemeColor;
  // Background role: filled-button gradient, accent-surface base.
  // Tuned so white-on-color text reads (≥4.5:1 in dark, decent in light).
  primaryColor: string;
  primaryColorDark: string;
  gradientAccent: string;
  gradientAccentDark: string;
  // Foreground role: links, title-gradient, outlined-border, icons.
  // Tuned for ≥4.5:1 against --surface-ground in the matching mode.
  // Saturation kept high — these are NOT algorithmic derivatives of the bg values.
  primaryFg: string;
  primaryFgDark: string;
  accentFg: string;
  accentFgDark: string;
}

// Exported standalone so theme.service.spec.ts can read it without
// instantiating ThemeService. The WCAG verification of these values is
// scripts/check-contrast.mjs, which reads this block from source and measures
// every fg/bg pair on every style surface (docs/generated/CONTRAST.MD).
export const THEME_COLORS: ThemeColorOption[] = [
  // === WARM ===
  // Sunset = orange→golden-yellow gradient. Distinct from fire's red→olive-gold
  // by leaning yellow at the accent end (was pink-red, looked like coral/fire).
  {
    name: 'sunset',
    primaryColor: '#c2410c',
    primaryColorDark: '#9a3412',
    gradientAccent: '#a16207',
    gradientAccentDark: '#854d0e',
    primaryFg: '#c2410c',
    primaryFgDark: '#fb923c',
    accentFg: '#a16207',
    accentFgDark: '#facc15',
  },
  {
    name: 'fire',
    primaryColor: '#cd1d1d',
    primaryColorDark: '#a71818',
    gradientAccent: '#946708',
    gradientAccentDark: '#785307',
    primaryFg: '#cd1d1d',
    primaryFgDark: '#f87171',
    accentFg: '#946708',
    accentFgDark: '#fbbf24',
  },
  {
    name: 'coral',
    primaryColor: '#a8124e',
    primaryColorDark: '#880f3f',
    gradientAccent: '#b9267b',
    gradientAccentDark: '#971f64',
    primaryFg: '#a8124e',
    primaryFgDark: '#f472b6',
    accentFg: '#b9267b',
    accentFgDark: '#e879c0',
  },

  // === NATURE ===
  {
    name: 'forest',
    primaryColor: '#157836',
    primaryColorDark: '#11612c',
    gradientAccent: '#5d7307',
    gradientAccentDark: '#475a07',
    primaryFg: '#157836',
    primaryFgDark: '#4ade80',
    accentFg: '#5d7307',
    accentFgDark: '#bef264',
  },
  {
    name: 'ocean',
    primaryColor: '#0a756d',
    primaryColorDark: '#086058',
    gradientAccent: '#1f63ed',
    gradientAccentDark: '#1151d0',
    primaryFg: '#0a756d',
    primaryFgDark: '#2dd4bf',
    accentFg: '#1f63ed',
    accentFgDark: '#60a5fa',
  },

  // === COOL ===
  {
    name: 'aurora',
    primaryColor: '#077288',
    primaryColorDark: '#065d6e',
    gradientAccent: '#167e4a',
    gradientAccentDark: '#12683d',
    primaryFg: '#077288',
    primaryFgDark: '#22d3ee',
    accentFg: '#167e4a',
    accentFgDark: '#34d399',
  },
  // Twilight = deep ultramarine→sky-blue gradient, a dusk sky. The blue
  // stays apart from ocean (teal→royal blue) by a deeper primary and a
  // sky-blue, not royal-blue, accent end.
  {
    name: 'twilight',
    primaryColor: '#3346d3',
    primaryColorDark: '#2638b0',
    gradientAccent: '#0369a1',
    gradientAccentDark: '#075985',
    primaryFg: '#3346d3',
    primaryFgDark: '#85a7ff',
    accentFg: '#0369a1',
    accentFgDark: '#7dd3fc',
  },

  // === RICH ===
  {
    name: 'mystic',
    primaryColor: '#972ee1',
    primaryColorDark: '#7c1cc2',
    gradientAccent: '#cc1790',
    gradientAccentDark: '#ab1378',
    primaryFg: '#972ee1',
    primaryFgDark: '#c084fc',
    accentFg: '#cc1790',
    accentFgDark: '#f0abfc',
  },
  {
    name: 'stone',
    primaryColor: '#776558',
    primaryColorDark: '#605247',
    gradientAccent: '#a05e1c',
    gradientAccentDark: '#854e17',
    primaryFg: '#776558',
    primaryFgDark: '#d6d3d1',
    accentFg: '#a05e1c',
    accentFgDark: '#fbbf24',
  },

  // === ACCESSIBILITY ===
  // AAA contrast (≥7:1). Slate-900/50 instead of pure black/white, to avoid
  // OLED halo and to sit well with the --surface-ground tokens.
  {
    name: 'contrast',
    primaryColor: '#0f172a',
    primaryColorDark: '#f8fafc',
    gradientAccent: '#1e293b',
    gradientAccentDark: '#e2e8f0',
    primaryFg: '#0f172a',
    primaryFgDark: '#f8fafc',
    accentFg: '#1e293b',
    accentFgDark: '#e2e8f0',
  },
];

/**
 * Lighten a hex colour by a flat additive shift per channel, clamped. Not a
 * perceptual lighten — scripts/check-contrast.mjs ports it literally, so the
 * gate measures exactly the colours the app ships.
 */
export function lightenHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

/** Darken a hex colour — the same additive shift as `lightenHex`, downwards. */
export function darkenHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    '#' +
    (
      0x1000000 +
      (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * The accent delta `applyTheme` merges onto Aura: the `semantic.primary` ramp
 * every Optimus widget paints with (checked box, switch track, slider range,
 * progress value, highlight tints).
 *
 * The ramp base follows the MODE. Light mode builds it from the palette's
 * background role, `primaryColor`, and Aura paints `primary.500` — that colour
 * itself. Dark mode builds it from `primaryFgDark`, the palette's curated
 * foreground for dark grounds (>= 4.5:1, gated), and points Aura's dark
 * `primary.color` at `primary.500` too, so a dark widget shows exactly that
 * colour; hover and active step lighter (400, 300), as Aura's dark scheme does.
 * The former ramp took `primaryColor` in both modes and let Aura paint its
 * lightened 400 step in dark: for the `contrast` palette (#0f172a) that was a
 * near-black #424a5d on the dark grounds (1.18:1), for coral a progress value
 * at 2.58:1 on its track. `primaryColorDark` is no fix — it is the dark
 * FILLED-button background, darker still (coral 2.06:1 on the track).
 *
 * scripts/check-contrast.mjs mirrors this function (PRIMARY_RAMP, DARK_PRIMARY)
 * and fails when the text here drifts from the mirror.
 */
export function widgetPrimarySemantic(colorOption: ThemeColorOption | undefined, isDark: boolean) {
  const rampBase = (isDark ? colorOption?.primaryFgDark : colorOption?.primaryColor) || '#3b82f6';
  return {
    semantic: {
      primary: {
        50: lightenHex(rampBase, 0.9),
        100: lightenHex(rampBase, 0.8),
        200: lightenHex(rampBase, 0.6),
        300: lightenHex(rampBase, 0.4),
        400: lightenHex(rampBase, 0.2),
        500: rampBase,
        600: darkenHex(rampBase, 0.1),
        700: darkenHex(rampBase, 0.2),
        800: darkenHex(rampBase, 0.3),
        900: darkenHex(rampBase, 0.4),
        950: darkenHex(rampBase, 0.5),
      },
      colorScheme: {
        dark: {
          primary: { color: '{primary.500}', hoverColor: '{primary.400}', activeColor: '{primary.300}' },
        },
      },
    },
  };
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private window = this.document.defaultView;
  private optimus = inject(Optimus);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  /** Applies a style's font defaults. It owns the "explicit reader choice
   *  wins" rule, so this service just hands it the style's fonts. */
  private readonly fontService = inject(FontService);

  /** The four visual styles (ADR-0016). Aura stays the single base preset. */
  readonly styles = UI_STYLES;

  // Color variants — 9 brand palettes + contrast. Definitions live in
  // THEME_COLORS above (exported so the gates can read them without a DOM).
  readonly themeColors = THEME_COLORS;

  // State signals
  private _style = signal<StyleName>(DEFAULT_STYLE_NAME);
  private _mode = signal<ThemeMode>('system');
  private _color = signal<ThemeColor>('sunset');
  // Last non-contrast color — used to restore the user's brand-colour pick
  // when the high-contrast toggle is turned off.
  private _previousColor = signal<ThemeColor>('sunset');

  // Computed values
  readonly style = computed(() => this._style());
  readonly mode = computed(() => this._mode());
  readonly color = computed(() => this._color());
  /** Visible color palette for the picker grid — excludes 'contrast', which
   *  is now exposed as a dedicated a11y toggle (see Barrierefreiheit-Section). */
  readonly visibleColors = computed(() => this.themeColors.filter((c) => c.name !== 'contrast'));
  readonly isHighContrast = computed(() => this._color() === 'contrast');
  /** The OS color scheme as a signal, so `isDarkMode` re-derives when it
   *  changes. A plain matchMedia read inside the computed was not tracked: the
   *  computed kept its first value and mode "system" followed the OS only
   *  after a reload. Set at start and by the change listener. */
  private readonly _systemDark = signal(false);
  readonly isDarkMode = computed(() => {
    const currentMode = this._mode();
    if (currentMode === 'system') {
      return this._systemDark();
    }
    return currentMode === 'dark';
  });

  /** The active style object — never undefined, the signal is a StyleName. */
  readonly currentStyle = computed<UiStyle>(() => this.styles.find((s) => s.name === this._style()) ?? DEFAULT_STYLE);

  readonly currentColorOption = computed(() => this.themeColors.find((c) => c.name === this._color()));

  constructor() {
    // Initialize from localStorage if available
    this.initializeTheme();

    // Listen for system theme changes
    this.setupSystemThemeListener();

    // Print on light paper, whatever the screen mode
    this.setupPrintListener();

    // Apply theme after DOM is ready
    if (this.document.readyState === 'loading') {
      this.document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.applyTheme(), 0);
      });
    } else {
      // DOM is already ready
      setTimeout(() => this.applyTheme(), 0);
    }
  }

  /**
   * Initialize theme from localStorage or defaults
   */
  private initializeTheme(): void {
    // The `theme` key holds a STYLE name since ADR-0016. resolveStoredStyle maps
    // the former preset names, an absent key and any other value to the default
    // style; the first applyTheme() writes the resolved name back.
    const storedMode = safeStorage.get('mode') as ThemeMode;
    const storedColor = safeStorage.get('themeColor') as ThemeColor;

    this._style.set(resolveStoredStyle(safeStorage.get('theme')));

    if (storedMode && ['light', 'dark', 'system'].includes(storedMode)) {
      this._mode.set(storedMode);
    }

    if (storedColor && this.themeColors.some((c) => c.name === storedColor)) {
      this._color.set(storedColor);
      // Seed the restore target so disabling high-contrast returns to the
      // brand color the user actually had — not the hardcoded default.
      if (storedColor !== 'contrast') {
        this._previousColor.set(storedColor);
      }
    } else if (this.prefersHighContrast()) {
      // Layer A: User's OS asks for higher contrast (Windows
      // "Kontrastdesigns", macOS "Kontrast erhöhen", etc.) — silently default
      // to the contrast theme on first visit. User can override in the picker.
      this._color.set('contrast');
    }
  }

  /**
   * Whether the OS prefers higher contrast (CSS prefers-contrast: more).
   * SSR-safe — returns false outside the browser.
   */
  private prefersHighContrast(): boolean {
    if (!isPlatformBrowser(this.platformId) || !this.window) return false;
    return this.window.matchMedia('(prefers-contrast: more)').matches;
  }

  /**
   * Follow the OS color scheme live: record it in `_systemDark` and, in mode
   * "system", repaint. The listener is removed when the service is destroyed.
   */
  private setupSystemThemeListener(): void {
    if (!isPlatformBrowser(this.platformId) || !this.window) return;
    const query = this.window.matchMedia('(prefers-color-scheme: dark)');
    this._systemDark.set(query.matches);
    const onChange = (event: MediaQueryListEvent) => {
      this._systemDark.set(event.matches);
      if (this._mode() === 'system') {
        this.applyTheme();
      }
    };
    query.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', onChange));
  }

  /** True between `beforeprint` and `afterprint`: applyTheme paints light. */
  private printing = false;

  /**
   * Print is light paper in every mode. The `@media print` block in
   * styles.scss cannot do it alone: this service writes the mode's tokens
   * INLINE on <html>, which beats any stylesheet rule on <html> (only its
   * `.dark-theme` rule on <body> took effect, and only for the tokens it
   * lists), the Optimus widgets switch on the `.dark-theme` class, and
   * --primary-color-text is inline `!important`. So for the print the
   * service itself applies the light variant of the reader's style and
   * accent, and restores the dark one afterwards. Nothing is persisted: the
   * stored mode stays what the reader chose. The stylesheet block stays as the
   * fallback for a print path that fires no `beforeprint` (e.g. a headless
   * PDF render).
   */
  private setupPrintListener(): void {
    const win = this.window;
    if (!isPlatformBrowser(this.platformId) || !win) return;
    const before = () => {
      if (this.printing) return;
      this.printing = true;
      if (this.isDarkMode()) this.applyPrintSwitch();
    };
    const after = () => {
      if (!this.printing) return;
      this.printing = false;
      if (this.isDarkMode()) this.applyPrintSwitch();
    };
    win.addEventListener('beforeprint', before);
    win.addEventListener('afterprint', after);
    this.destroyRef.onDestroy(() => {
      win.removeEventListener('beforeprint', before);
      win.removeEventListener('afterprint', after);
    });
  }

  /** Re-apply, then flush the root effects so the Optimus preset (applied by
   *  an effect in its config service) follows before the page is snapshotted. */
  private applyPrintSwitch(): void {
    this.applyTheme();
    try {
      this.appRef.tick();
    } catch {
      // Already inside a tick — the effect runs with it.
    }
  }

  /**
   * Check if system prefers dark mode
   */
  isSystemDarkMode(): boolean {
    if (isPlatformBrowser(this.platformId) && this.window) {
      return this.window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  /**
   * Build the complete token map for one (style, accent, mode) triple.
   *
   * Pure: it touches no DOM, which is what lets `applyTheme` call it a second
   * and third time for the boot snapshot of BOTH modes without side effects.
   * Everything the kit reads is derived here — surfaces and text colours, the
   * numeric --surface-0…900 scale, the brand --primary-50…900 scale, the
   * severity button colours, the accent role tokens and the style's own
   * --style-* extras (applied last, so a style can override a derived value).
   *
   * `importantTokens` is a separate bucket for the one property that must beat
   * a legacy `!important` rule in styles.scss (--primary-color-text).
   */
  private buildTokenMaps(
    style: UiStyle,
    colorOption: ThemeColorOption | undefined,
    isDark: boolean,
  ): { tokens: Record<string, string>; importantTokens: Record<string, string> } {
    const tokens: Record<string, string> = {};
    const importantTokens: Record<string, string> = {};

    // --- surfaces + text (the style's own ground colours) -------------------
    const surfaces = isDark ? style.surfaces.dark : style.surfaces.light;
    tokens['--surface-ground'] = surfaces.ground;
    tokens['--surface-card'] = surfaces.card;
    tokens['--surface-section'] = surfaces.section;
    tokens['--surface-border'] = surfaces.border;
    tokens['--surface-hover'] = surfaces.hover;
    tokens['--text-color'] = surfaces.textColor;
    tokens['--text-color-secondary'] = surfaces.textColorSecondary;
    // Control edges (SC 1.4.11) and the dark field placeholder are kit-only
    // roles; the styles carry values chosen to clear their criterion.
    tokens['--control-border'] = surfaces.controlBorder;
    if (surfaces.controlPlaceholder) tokens['--control-placeholder'] = surfaces.controlPlaceholder;

    // --- numeric surface scale (flips per mode, 300+ readers) ---------------
    const surfaceScale = isDark ? style.surfaceScale.dark : style.surfaceScale.light;
    for (const [step, hex] of Object.entries(surfaceScale)) {
      tokens[`--surface-${step}`] = hex;
    }

    // --- brand scale + the two interaction shades --------------------------
    for (const [step, hex] of Object.entries(style.brandScale)) {
      tokens[`--primary-${step}`] = hex;
    }
    tokens['--primary-hover'] = isDark ? style.brandScale['300'] : style.brandScale['700'];
    tokens['--primary-active'] = isDark ? style.brandScale['200'] : style.brandScale['800'];

    // --- severity buttons (read by the static block, ADR-0016 D5) ----------
    // Hover direction of the outlined button: it sits on --surface-card and
    // carries --text-color. Roles reversed, mechanics identical.
    const cardSurface = style.surfaces[isDark ? 'dark' : 'light'];
    tokens['--outlined-hover-filter'] =
      `brightness(${hoverBrightnessFor(cardSurface.card, cardSurface.card, cardSurface.textColor)})`;

    for (const [severity, gradient] of Object.entries(style.severityGradients)) {
      tokens[`--gradient-${severity}-from`] = gradient.from;
      tokens[`--gradient-${severity}-to`] = gradient.to;
      tokens[`--gradient-${severity}-text`] = gradient.text ?? '#ffffff';
      // Hover direction (R12): brightening a light label costs contrast,
      // because the filter moves the label too and white clips at 255.
      // The rule lives with the data — ui-styles.ts#severityHoverBrightness.
      tokens[`--gradient-${severity}-hover`] = `brightness(${severityHoverBrightness(gradient)})`;
      // Ink of the OUTLINED severity button (R13). The outlined block excludes
      // the severities, so the preset used to paint these labels with its raw
      // colour — in light mode every style fell under 4.5:1 (success 2.28).
      tokens[`--outlined-${severity}-fg`] = outlinedSeverityInk(gradient.from, cardSurface.card);
    }

    if (colorOption) {
      // Background role: filled-button gradient, accent-surface base.
      const primaryBg = isDark ? colorOption.primaryColorDark : colorOption.primaryColor;
      const accentBg = isDark ? colorOption.gradientAccentDark : colorOption.gradientAccent;
      // Foreground role: links, title-gradient, outlined-border, icons.
      // Curated per palette — the contrast gate re-derives every ratio.
      const primaryFg = isDark ? colorOption.primaryFgDark : colorOption.primaryFg;
      const accentFg = isDark ? colorOption.accentFgDark : colorOption.accentFg;

      // Canonical role tokens (use these in new code).
      tokens['--primary-bg'] = primaryBg;
      tokens['--accent-bg'] = accentBg;
      tokens['--primary-fg'] = primaryFg;
      tokens['--accent-fg'] = accentFg;

      // Legacy aliases (foreground-token era, D3).
      tokens['--primary-color'] = primaryBg;
      tokens['--gradient-accent-color'] = accentBg;
      tokens['--primary-color-fg'] = primaryFg;
      tokens['--gradient-accent-color-fg'] = accentFg;
      tokens['--primary-color-icon-fg'] = primaryFg;
      tokens['--gradient-accent-color-icon-fg'] = accentFg;

      // A label colour that always reads on --primary-color. The
      // 'important' flag beats the legacy global rule in styles.scss that
      // forced white — right for the brand palettes, wrong for contrast-dark.
      const primaryLabel = this.getOptimalTextColor(primaryBg, accentBg);
      importantTokens['--primary-color-text'] = primaryLabel;

      // Hover direction of the filled primary button — see
      // ui-styles.ts#hoverBrightnessFor. Measured, not guessed.
      tokens['--primary-hover-filter'] = `brightness(${hoverBrightnessFor(primaryBg, accentBg, primaryLabel)})`;

      // Accent surfaces for icon circles, highlight boxes and tinted panels,
      // derived from the palette's light primary to match Optimus's own ramp.
      const scaleBase = colorOption.primaryColor;
      if (isDark) {
        tokens['--accent-surface'] = this.darkenColor(scaleBase, 0.5); // ≈ primary-950
        tokens['--accent-on-surface'] = this.lightenColor(scaleBase, 0.6); // ≈ primary-200
        tokens['--accent-surface-hover'] = this.darkenColor(scaleBase, 0.4); // ≈ primary-900
      } else {
        tokens['--accent-surface'] = this.lightenColor(scaleBase, 0.8); // ≈ primary-100
        tokens['--accent-on-surface'] = this.darkenColor(scaleBase, 0.2); // ≈ primary-700
        tokens['--accent-surface-hover'] = this.lightenColor(scaleBase, 0.6); // ≈ primary-200
      }
    }

    // --- the style's free tokens, last so they can override anything above --
    if (style.extraTokens) {
      Object.assign(tokens, style.extraTokens.common);
      Object.assign(tokens, isDark ? style.extraTokens.dark : style.extraTokens.light);
    }

    return { tokens, importantTokens };
  }

  /**
   * Write one token map as inline custom properties on <html> — the layer that
   * beats every stylesheet, including Optimus's own CSS-in-JS.
   */
  private applyDesignSystemColors(style: UiStyle, colorOption: ThemeColorOption | undefined, isDark: boolean): void {
    const root = this.document.documentElement;
    const { tokens, importantTokens } = this.buildTokenMaps(style, colorOption, isDark);
    for (const [name, value] of Object.entries(tokens)) {
      root.style.setProperty(name, value);
    }
    for (const [name, value] of Object.entries(importantTokens)) {
      root.style.setProperty(name, value, 'important');
    }
  }

  /**
   * Apply the current style × accent × mode, synchronously, in one pass.
   */
  applyTheme(): void {
    const style = this.currentStyle();
    // While printing, light paper (setupPrintListener); the mode itself is kept.
    const shouldUseDarkTheme = this.isDarkMode() && !this.printing;

    // 1. Mode + style classes, synchronously and before anything reads them.
    const bodyElement = this.document.body;
    const htmlElement = this.document.documentElement;

    bodyElement.classList.remove('dark-theme', 'light-theme');
    htmlElement.classList.remove('dark-theme', 'light-theme');

    const themeClass = shouldUseDarkTheme ? 'dark-theme' : 'light-theme';
    bodyElement.classList.add(themeClass);
    htmlElement.classList.add(themeClass);

    // The style scope class carries the signature stylesheet block
    // (html.style-<name> in styles.scss). The anti-FOUC script in index.html
    // sets the same class pre-paint from localStorage.
    for (const cls of Array.from(htmlElement.classList)) {
      if (cls.startsWith('style-')) htmlElement.classList.remove(cls);
    }
    htmlElement.classList.add(`style-${style.name}`);

    // 2. Font defaults of the style. An explicit reader font choice always
    //    wins — FontService checks its own persistence.
    this.fontService.applyStyleFonts(style.fonts ?? null);

    // 3. Design tokens as inline custom properties.
    const colorOption = this.currentColorOption();
    this.applyDesignSystemColors(style, colorOption, shouldUseDarkTheme);

    // 4. The static, token-reading button block (written once).
    if (colorOption) {
      this.applyButtonGradientStyles();
    }

    // 5. The Optimus preset: Aura + the style's delta + the accent ramp. Order
    //    matters — the accent axis must win at semantic.primary.
    if (this.optimus?.theme) {
      try {
        const styledPreset = style.presetOverrides ? definePreset(Aura, style.presetOverrides) : Aura;
        const customPreset = definePreset(styledPreset, widgetPrimarySemantic(colorOption, shouldUseDarkTheme));

        this.optimus.theme.set({
          preset: customPreset,
          options: {
            prefix: 'p',
            darkModeSelector: '.dark-theme',
            cssLayer: false,
          },
        });
      } catch (_error) {
        // Fallback: leave the widget layer as it is. Severities are painted by
        // the global block above, so the app stays usable.
        console.warn('Optimus UI theme setup failed, using CSS fallback');
      }
    }

    // 6. Persist the three choices. `theme` now holds the STYLE name, which is
    //    also how a stored preset name migrates away on the first apply.
    safeStorage.set('theme', style.name);
    safeStorage.set('mode', this._mode());
    safeStorage.set('themeColor', this._color());

    // 7. Anti-FOUC snapshot: the token maps of BOTH modes, so the inline script
    //    in index.html can paint the returning reader's style before Angular
    //    boots. Both modes, because 'system' only resolves at boot time.
    try {
      safeStorage.set(
        'boot-tokens',
        JSON.stringify({
          light: this.buildTokenMaps(style, colorOption, false),
          dark: this.buildTokenMaps(style, colorOption, true),
        }),
      );
    } catch {
      // Quota or serialisation — the snapshot is progressive enhancement only.
    }
  }

  /**
   * The button gradient block — a STATIC <style> element that reads tokens only
   * (ADR-0016 D5). Before the style axis, this CSS was re-interpolated with the
   * accent's hex values on every switch; now the values live in custom
   * properties that `buildTokenMaps` writes (`--gradient-<severity>-from/-to/
   * -text`, `--button-border`, `--style-btn-outlined-border/-bg`,
   * `--primary-color`, `--gradient-accent-color`, `--primary-color-text`), so a
   * style, accent or mode switch changes token VALUES and never this text. The
   * block is therefore written exactly once.
   *
   * The `!important` declarations stay on purpose: Optimus injects its own theme
   * styles later (`optimus.theme.set` runs after this in `applyTheme`), so the
   * widget layer would otherwise win the cascade.
   */
  private applyButtonGradientStyles(): void {
    const styleId = 'button-gradient-styles';
    let styleElement = this.document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = this.document.createElement('style');
      styleElement.id = styleId;
      this.document.head.appendChild(styleElement);
    }

    if (styleElement.textContent) {
      return; // the static block is already in place — tokens do the rest
    }

    styleElement.textContent = `
      /* Static token-driven button styles — injected once by ThemeService */

      /* Filled primary buttons — brand gradient with a hover shift */
      .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not([class*="p-button-secondary"]):not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--gradient-accent-color) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--primary-color-text) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }

      .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not([class*="p-button-secondary"]):not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) .p-button-label,
      .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not([class*="p-button-secondary"]):not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) .p-button-icon {
        color: var(--primary-color-text) !important;
      }

      .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not([class*="p-button-secondary"]):not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]):hover {
        background-position: 100% 50% !important;
        /* Hover direction, same rule as the severities: the filter moves the
           label too, and white clips at 255. A flat brightness(1.1) put 6 of
           the 20 accent x mode pairs under 4.5:1 (worst sunset/light 4.18). */
        filter: var(--primary-hover-filter, none);
      }

      /* Outlined buttons — gradient border (including primary outlined).
         Uses --primary-fg / --accent-fg (foreground tokens) to
         guarantee >=3:1 against --surface-card per WCAG 1.4.11.
         ADR-0016: a style with its own outline language replaces the gradient
         ring through --style-btn-outlined-border/-bg, whose fallbacks are
         byte-identical to the previous rule — so a style needs no specificity
         duel against these !important declarations. */
      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) {
        background: var(--surface-card) !important;
        border: 2px solid var(--style-btn-outlined-border, transparent) !important;
        background-image: var(--style-btn-outlined-bg, linear-gradient(var(--surface-card), var(--surface-card)),
                          linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%)) !important;
        background-origin: border-box !important;
        background-clip: padding-box, border-box !important;
        transition: filter 0.3s ease !important;
      }

      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) .p-button-label:not(.gradient-icon),
      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) .p-button-icon:not(.gradient-icon),
      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) > i[class*="pi"]:not(.gradient-icon),
      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]) > span:not(.p-badge):not(.gradient-icon) {
        color: var(--text-color) !important;
        -webkit-text-fill-color: var(--text-color) !important;
      }

      .p-button.p-button-outlined:not([class*="p-button-success"]):not([class*="p-button-info"]):not([class*="p-button-warn"]):not([class*="p-button-danger"]):not([class*="p-button-help"]):not([class*="p-button-contrast"]):hover {
        filter: var(--outlined-hover-filter, none);
      }

      /* ========== OUTLINED SEVERITY BUTTONS (R13) ==========
         The block above excludes the severities, so the widget preset painted
         these labels with its raw colour: in light mode every style fell under
         4.5:1 (success #22c55e on a white card, 2.28:1). The ink now comes
         from the STYLE — the from stop of the filled severity, pushed away
         from the card only as far as it must be (ui-styles.ts#outlinedSeverityInk).
         It carries label AND border; 4.5:1 covers the 3:1 of SC 1.4.11. */
      .p-button.p-button-outlined.p-button-danger,
      html body .p-button.p-button-outlined.p-button-danger {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-danger-fg) !important;
        color: var(--outlined-danger-fg) !important;
      }
      .p-button.p-button-outlined.p-button-danger .p-button-label,
      .p-button.p-button-outlined.p-button-danger .p-button-icon,
      html body .p-button.p-button-outlined.p-button-danger .p-button-label,
      html body .p-button.p-button-outlined.p-button-danger .p-button-icon {
        color: var(--outlined-danger-fg) !important;
        -webkit-text-fill-color: var(--outlined-danger-fg) !important;
      }
      .p-button.p-button-outlined.p-button-danger:hover,
      html body .p-button.p-button-outlined.p-button-danger:hover {
        filter: var(--outlined-hover-filter, none);
      }

      .p-button.p-button-outlined.p-button-success,
      html body .p-button.p-button-outlined.p-button-success {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-success-fg) !important;
        color: var(--outlined-success-fg) !important;
      }
      .p-button.p-button-outlined.p-button-success .p-button-label,
      .p-button.p-button-outlined.p-button-success .p-button-icon,
      html body .p-button.p-button-outlined.p-button-success .p-button-label,
      html body .p-button.p-button-outlined.p-button-success .p-button-icon {
        color: var(--outlined-success-fg) !important;
        -webkit-text-fill-color: var(--outlined-success-fg) !important;
      }
      .p-button.p-button-outlined.p-button-success:hover,
      html body .p-button.p-button-outlined.p-button-success:hover {
        filter: var(--outlined-hover-filter, none);
      }

      .p-button.p-button-outlined.p-button-info,
      html body .p-button.p-button-outlined.p-button-info {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-info-fg) !important;
        color: var(--outlined-info-fg) !important;
      }
      .p-button.p-button-outlined.p-button-info .p-button-label,
      .p-button.p-button-outlined.p-button-info .p-button-icon,
      html body .p-button.p-button-outlined.p-button-info .p-button-label,
      html body .p-button.p-button-outlined.p-button-info .p-button-icon {
        color: var(--outlined-info-fg) !important;
        -webkit-text-fill-color: var(--outlined-info-fg) !important;
      }
      .p-button.p-button-outlined.p-button-info:hover,
      html body .p-button.p-button-outlined.p-button-info:hover {
        filter: var(--outlined-hover-filter, none);
      }

      .p-button.p-button-outlined.p-button-warn,
      html body .p-button.p-button-outlined.p-button-warn {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-warn-fg) !important;
        color: var(--outlined-warn-fg) !important;
      }
      .p-button.p-button-outlined.p-button-warn .p-button-label,
      .p-button.p-button-outlined.p-button-warn .p-button-icon,
      html body .p-button.p-button-outlined.p-button-warn .p-button-label,
      html body .p-button.p-button-outlined.p-button-warn .p-button-icon {
        color: var(--outlined-warn-fg) !important;
        -webkit-text-fill-color: var(--outlined-warn-fg) !important;
      }
      .p-button.p-button-outlined.p-button-warn:hover,
      html body .p-button.p-button-outlined.p-button-warn:hover {
        filter: var(--outlined-hover-filter, none);
      }

      .p-button.p-button-outlined.p-button-secondary,
      html body .p-button.p-button-outlined.p-button-secondary {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-secondary-fg) !important;
        color: var(--outlined-secondary-fg) !important;
      }
      .p-button.p-button-outlined.p-button-secondary .p-button-label,
      .p-button.p-button-outlined.p-button-secondary .p-button-icon,
      html body .p-button.p-button-outlined.p-button-secondary .p-button-label,
      html body .p-button.p-button-outlined.p-button-secondary .p-button-icon {
        color: var(--outlined-secondary-fg) !important;
        -webkit-text-fill-color: var(--outlined-secondary-fg) !important;
      }
      .p-button.p-button-outlined.p-button-secondary:hover,
      html body .p-button.p-button-outlined.p-button-secondary:hover {
        filter: var(--outlined-hover-filter, none);
      }

      .p-button.p-button-outlined.p-button-help,
      html body .p-button.p-button-outlined.p-button-help {
        background: var(--surface-card) !important;
        border: 2px solid var(--outlined-help-fg) !important;
        color: var(--outlined-help-fg) !important;
      }
      .p-button.p-button-outlined.p-button-help .p-button-label,
      .p-button.p-button-outlined.p-button-help .p-button-icon,
      html body .p-button.p-button-outlined.p-button-help .p-button-label,
      html body .p-button.p-button-outlined.p-button-help .p-button-icon {
        color: var(--outlined-help-fg) !important;
        -webkit-text-fill-color: var(--outlined-help-fg) !important;
      }
      .p-button.p-button-outlined.p-button-help:hover,
      html body .p-button.p-button-outlined.p-button-help:hover {
        filter: var(--outlined-hover-filter, none);
      }

      /* Custom chrome buttons — gradient border. fg tokens for >=3:1. */
      .sitemap-button,
      .gamification-pill,
      .bell-button,
      .hamburger-button {
        background: var(--surface-card) !important;
        border: 2px solid transparent !important;
        background-image: linear-gradient(var(--surface-card), var(--surface-card)),
                          linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%) !important;
        background-origin: border-box !important;
        background-clip: padding-box, border-box !important;
        transition: all 0.2s ease !important;
      }

      .sitemap-button:hover,
      .gamification-pill:hover,
      .bell-button:hover,
      .hamburger-button:hover {
        filter: brightness(1.1);
      }

      /* Icon gradients on hover — the three icon buttons flip together. */
      .sitemap-button i,
      .bell-button i.pi-bell,
      .hamburger-button i.pi-bars {
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
      }

      .sitemap-button:hover i,
      .bell-button:hover i.pi-bell,
      .hamburger-button:hover i.pi-bars {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--gradient-accent-color) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      /* Language picker — gradient on icons while hovered */
      app-language-picker .p-button:hover .globe-icon,
      app-language-picker .p-button:hover .flag-dropdown-icon,
      app-language-picker .p-button:hover .current-lang-name,
      .language-selector-button .gradient-icon {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--gradient-accent-color) 100%) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
      }

      /* Theme picker — gradient on icons while hovered */
      app-theme-picker .p-button:hover .theme-icon,
      app-theme-picker .p-button:hover .theme-dropdown-icon,
      .theme-selector-button .gradient-icon {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--gradient-accent-color) 100%) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
      }

      /* Navigation example items — gradient border */
      .example-item {
        border: 2px solid transparent !important;
        background-image: linear-gradient(var(--surface-card), var(--surface-card)),
                          linear-gradient(135deg, var(--primary-color) 0%, var(--gradient-accent-color) 100%) !important;
        background-origin: border-box !important;
        background-clip: padding-box, border-box !important;
      }

      /* ========== SEVERITY BUTTONS ========== */
      /* One rule set per severity, all values from --gradient-<severity>-*.
         A style with flat severities simply sets from === to. */

      html body .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-danger-from) 0%, var(--gradient-danger-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-danger-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-danger-hover, none);
      }
      html body .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-danger:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-danger-text, #ffffff) !important;
      }

      html body .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-success-from) 0%, var(--gradient-success-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-success-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-success-hover, none);
      }
      html body .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-success:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-success-text, #ffffff) !important;
      }

      html body .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-info-from) 0%, var(--gradient-info-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-info-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-info-hover, none);
      }
      html body .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-info:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-info-text, #ffffff) !important;
      }

      html body .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-warn-from) 0%, var(--gradient-warn-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-warn-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-warn-hover, none);
      }
      html body .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-warn:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-warn-text, #ffffff) !important;
      }

      html body .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-secondary-from) 0%, var(--gradient-secondary-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-secondary-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-secondary-hover, none);
      }
      html body .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-secondary-text, #ffffff) !important;
      }

      html body .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text),
      .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text) {
        background: linear-gradient(135deg, var(--gradient-help-from) 0%, var(--gradient-help-to) 100%) !important;
        background-size: 200% 200% !important;
        background-position: 0% 50% !important;
        border: var(--button-border, none) !important;
        color: var(--gradient-help-text, #ffffff) !important;
        transition: background-position 0.4s ease, filter 0.3s ease !important;
      }
      html body .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text):hover,
      .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text):hover {
        background-position: 100% 50% !important;
        filter: var(--gradient-help-hover, none);
      }
      html body .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      html body .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text) .p-button-icon,
      .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text) .p-button-label,
      .p-button.p-button-help:not(.p-button-outlined):not(.p-button-text) .p-button-icon {
        color: var(--gradient-help-text, #ffffff) !important;
      }

      /* Reduced motion: the rules above use !important, so the global
         catch-all in styles.scss cannot reach them. */
      @media (prefers-reduced-motion: reduce) {
        .p-button,
        .sitemap-button,
        .gamification-pill,
        .bell-button,
        .hamburger-button {
          transition-duration: 0.01ms !important;
        }
      }
    `;
  }

  /**
   * Calculate optimal text color (white or black) based on gradient colors
   * Uses WCAG luminance calculation for accessibility
   */
  private getOptimalTextColor(primaryColor: string, accentColor: string): string {
    const lum1 = this.getLuminance(primaryColor);
    const lum2 = this.getLuminance(accentColor);

    // Use average luminance of gradient endpoints — the visual midpoint
    // matters more than worst-case endpoint for gradient backgrounds
    const avgLuminance = (lum1 + lum2) / 2;

    // WCAG AA large text threshold (3:1) — buttons qualify as large text
    const whiteContrast = (1 + 0.05) / (avgLuminance + 0.05);
    return whiteContrast >= 3.0 ? '#ffffff' : '#1e293b';
  }

  /**
   * Calculate relative luminance of a color (WCAG 2.1 formula)
   */
  private getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Lighten a hex color by a percentage
   */
  private lightenColor(hex: string, percent: number): string {
    return lightenHex(hex, percent);
  }

  /**
   * Darken a hex color by a percentage
   */
  private darkenColor(hex: string, percent: number): string {
    return darkenHex(hex, percent);
  }

  /**
   * Switch the visual style (ADR-0016 D1). Applies immediately; the click IS the
   * preview, so there is no hover state to undo.
   */
  setStyle(styleName: StyleName): void {
    if (styleName !== this._style() && UI_STYLES.some((s) => s.name === styleName)) {
      this._style.set(styleName);
      this.applyTheme();
    }
  }

  /**
   * Set the theme mode (light, dark, system)
   */
  setMode(mode: ThemeMode): void {
    if (mode !== this._mode()) {
      this._mode.set(mode);
      this.applyTheme();
    }
  }

  /**
   * Set the theme color variant
   */
  setColor(color: ThemeColor): void {
    if (this.themeColors.some((c) => c.name === color)) {
      // Track the last brand color so the high-contrast toggle can restore it.
      if (color !== 'contrast') {
        this._previousColor.set(color);
      }
      this._color.set(color);
      this.applyTheme();
    }
  }

  /**
   * Toggle high-contrast mode. When disabling, restores the user's prior
   * brand color (defaults to 'sunset' if they had never picked one).
   */
  setHighContrast(enabled: boolean): void {
    this.setColor(enabled ? 'contrast' : this._previousColor());
  }
}
