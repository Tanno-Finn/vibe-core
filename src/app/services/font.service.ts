/**
 * Font Service — runtime font switching with localStorage persistence.
 *
 * Mirrors ThemeService pattern: signal-based current value, SSR-safe via
 * isPlatformBrowser, falls through gracefully when storage is disabled.
 *
 * Loading strategy: only the active font is loaded. On switch, the target
 * self-hosted @font-face CSS (assets/fonts/*.css, populated from @fontsource
 * at build time) is injected as a <link rel="stylesheet"> if not already
 * present. No external Google Fonts requests. The system stack fetches nothing.
 *
 * Token written: --font-base on documentElement. --font-family is kept as
 * alias by styles.scss → both update implicitly.
 */
import { Injectable, signal, computed, inject, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { safeStorage } from '../utils/safe-storage';
import type { StyleFont } from './ui-styles';

export type FontId =
  | 'system'
  | 'source-sans-3'
  | 'inter'
  | 'ibm-plex-sans'
  | 'bricolage-grotesque'
  | 'atkinson-hyperlegible'
  | 'andika'
  | 'lexend'
  | 'open-dyslexic';

export interface FontOption {
  id: FontId;
  name: string;
  classification: string;
  stack: string;
  /** Stylesheet URL for the self-hosted @font-face CSS (assets/fonts/*.css).
   *  Undefined = no fetch (system stack, shipped by the OS). */
  cssUrl?: string;
  /** i18n key for the body of the description shown when this font is active. */
  noteKey: string;
}

/**
 * Deterministic multi-script fallback chain. The browser walks left-to-right
 * and uses the first font that has a glyph for the current character. Loaded
 * Noto Sans variants (KR/Devanagari/Bengali/Gurmukhi) are listed explicitly
 * so non-Latin scripts always render in Noto regardless of the user's
 * preferred Latin font, instead of relying on the browser's implicit
 * cross-document fallback (which differs per browser).
 *
 * Order matters: latin/cyrillic/greek system fonts first (shipped on every
 * OS), then explicit Noto Sans for Indic + Hangul, then sans-serif fallback.
 */
const SYSTEM_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, ' +
  '"Noto Sans KR", "Noto Sans Devanagari", "Noto Sans Bengali", "Noto Sans Gurmukhi", ' +
  'sans-serif';

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'system',
    name: 'System-Standard',
    classification: 'Sans · System-Default · 0 KB',
    stack: SYSTEM_STACK,
    noteKey: 'settings.font.system.note',
  },
  {
    id: 'source-sans-3',
    name: 'Source Sans 3',
    classification: 'Sans · Humanist · Adobe',
    stack: `'Source Sans 3', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/source-sans-3. Files copied from node_modules
    // to assets/fonts/source-sans-3/ by angular.json (kit ships only latin
    // 400/700 — no external Google Fonts fetch).
    cssUrl: 'assets/fonts/source-sans-3.css',
    noteKey: 'settings.font.sourceSans3.note',
  },
  {
    id: 'inter',
    name: 'Inter',
    classification: 'Sans · Neo-Grotesk',
    stack: `'Inter', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/inter. Files copied from node_modules to
    // assets/fonts/inter/ by angular.json (kit ships only latin 400/700 — no
    // external Google Fonts fetch).
    cssUrl: 'assets/fonts/inter.css',
    noteKey: 'settings.font.inter.note',
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    classification: 'Sans · Geometrisch',
    stack: `'IBM Plex Sans', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/ibm-plex-sans. Files copied from node_modules
    // to assets/fonts/ibm-plex-sans/ by angular.json (kit ships only latin
    // 400/700 — no external Google Fonts fetch).
    cssUrl: 'assets/fonts/ibm-plex-sans.css',
    noteKey: 'settings.font.ibmPlexSans.note',
  },
  {
    id: 'bricolage-grotesque',
    name: 'Bricolage Grotesque',
    classification: 'Sans · Display-fähig · variable',
    stack: `'Bricolage Grotesque', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/bricolage-grotesque. Files copied from
    // node_modules to assets/fonts/bricolage-grotesque/ by angular.json (kit
    // ships only latin static 400/700 — no external Google Fonts fetch).
    cssUrl: 'assets/fonts/bricolage-grotesque.css',
    noteKey: 'settings.font.bricolageGrotesque.note',
  },
  {
    id: 'atkinson-hyperlegible',
    name: 'Atkinson Hyperlegible',
    classification: 'Sans · Hyperlegibility',
    stack: `'Atkinson Hyperlegible', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/atkinson-hyperlegible. Files copied from
    // node_modules to assets/fonts/atkinson-hyperlegible/ by angular.json
    // (kit ships only latin 400/700 — no external Google Fonts fetch).
    cssUrl: 'assets/fonts/atkinson-hyperlegible.css',
    noteKey: 'settings.font.atkinsonHyperlegible.note',
  },
  {
    id: 'andika',
    name: 'Andika',
    classification: 'Sans · Cognitive Ease · SIL',
    stack: `'Andika', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/andika. Files copied from node_modules to
    // assets/fonts/andika/ by angular.json (kit ships only latin 400/700 — no
    // external Google Fonts fetch).
    cssUrl: 'assets/fonts/andika.css',
    noteKey: 'settings.font.andika.note',
  },
  {
    id: 'lexend',
    name: 'Lexend',
    classification: 'Sans · Reading Proficiency',
    stack: `'Lexend', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/lexend. Files copied from node_modules to
    // assets/fonts/lexend/ by angular.json (kit ships only latin static 400/700
    // — no external Google Fonts fetch).
    cssUrl: 'assets/fonts/lexend.css',
    noteKey: 'settings.font.lexend.note',
  },
  {
    id: 'open-dyslexic',
    name: 'OpenDyslexic',
    classification: 'Sans · Dyslexia-Friendly',
    stack: `'OpenDyslexic', ${SYSTEM_STACK}`,
    // Self-hosted via @fontsource/opendyslexic. Files copied from
    // node_modules to assets/fonts/opendyslexic/ by angular.json. Previously
    // loaded from jsdelivr — blocked by production CSP (style-src/font-src
    // allowlist did not include cdn.jsdelivr.net).
    cssUrl: 'assets/fonts/opendyslexic.css',
    noteKey: 'settings.font.openDyslexic.note',
  },
];

const STORAGE_KEY = 'preferred-font-v1';
const DEFAULT_FONT: FontId = 'system';
/** The font the "Lesbare Schrift"-toggle in the theme picker maps to.
 *  Specifically chosen for dyslexia (weighted bottoms prevent b/d, p/q
 *  confusion). The full font list lives in user settings. */
const READABLE_FONT: FontId = 'open-dyslexic';
/** Languages whose primary script has no glyphs in OpenDyslexic — Bengali,
 *  Devanagari (Hindi/Marathi), Gurmukhi, Hangul. Cyrillic + Greek are
 *  partially supported, so ru/uk/el stay enabled. */
const UNSUPPORTED_READABLE_LANGS = new Set(['bn', 'hi', 'mr', 'pa', 'ko']);

@Injectable({ providedIn: 'root' })
export class FontService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  readonly options = FONT_OPTIONS;
  readonly current = signal<FontId>(DEFAULT_FONT);
  // Tracks the last non-readable font so the toggle restores the user's
  // choice when disabled.
  private readonly _previousFont = signal<FontId>(DEFAULT_FONT);

  readonly isReadableFontActive = computed(() => this.current() === READABLE_FONT);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = safeStorage.get(STORAGE_KEY) as FontId | null;
    const valid = saved && this.options.some((o) => o.id === saved) ? saved : DEFAULT_FONT;
    if (valid !== READABLE_FONT) this._previousFont.set(valid);
    this.applyFont(valid);
  }

  setFont(id: FontId): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (id !== READABLE_FONT) this._previousFont.set(id);
    safeStorage.set(STORAGE_KEY, id);
    // An explicit font pick outranks the active style's heading family:
    // applyFont only writes --font-base/--font-family, so a --font-heading
    // left inline by applyStyleFonts would otherwise survive this change.
    this.document.documentElement.style.removeProperty('--font-heading');
    this.applyFont(id);
  }

  /** Toggle the dyslexia-friendly font. Off restores the user's prior pick. */
  setReadableFont(enabled: boolean): void {
    this.setFont(enabled ? READABLE_FONT : this._previousFont());
  }

  /** Returns false for languages whose primary script has no dyslexia-font
   *  glyph coverage (Bengali, Devanagari, Gurmukhi, Hangul). The toggle
   *  should be disabled in those languages. */
  supportsReadableFont(languageCode: string): boolean {
    // Strip "-easy" suffix so de-easy/en-easy follow their base script.
    const base = languageCode.replace(/-easy$/, '');
    return !UNSUPPORTED_READABLE_LANGS.has(base);
  }

  /** Preload all picker-candidate fonts. Call from the settings page so tiles
   *  render their actual typeface, not the fallback. Outside the picker we
   *  stay lean and only load the active font. */
  preloadAll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    for (const option of this.options) {
      this.ensureFontLoaded(option);
    }
  }

  /**
   * Apply a visual style's font defaults (ADR-0016 D4). Called by ThemeService
   * on every style switch.
   *
   * The rule the kit commits to: an EXPLICIT reader font choice always wins —
   * the readable-font toggle in particular — and then applies to headings too.
   * A style's fonts are defaults, not overrides; they only take effect while
   * `preferred-font-v1` is empty. Passing `null` (or having a stored choice)
   * therefore clears `--font-heading` so it falls back to `var(--font-base)`
   * from design-tokens.scss, and re-applies the reader's own font everywhere.
   */
  applyStyleFonts(fonts: { heading?: StyleFont; body?: StyleFont } | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.document.documentElement.style;

    if (this.hasExplicitChoice() || !fonts) {
      root.removeProperty('--font-heading');
      this.applyFont(this.current());
      return;
    }

    if (fonts.heading) {
      this.ensureStylesheet('font-link-style-heading', fonts.heading.cssUrl);
      root.setProperty('--font-heading', `${fonts.heading.stack}, ${SYSTEM_STACK}`);
    } else {
      root.removeProperty('--font-heading');
    }

    if (fonts.body) {
      this.ensureStylesheet('font-link-style-body', fonts.body.cssUrl);
      root.setProperty('--font-base', `${fonts.body.stack}, ${SYSTEM_STACK}`);
      root.setProperty('--font-family', `${fonts.body.stack}, ${SYSTEM_STACK}`);
    } else {
      this.applyFont(this.current());
    }
  }

  /** Whether the reader has ever picked a font themselves. */
  private hasExplicitChoice(): boolean {
    return !!safeStorage.get(STORAGE_KEY);
  }

  /** Inject (or re-point) one <link rel=stylesheet> for a style's font sheet.
   *  Two ids only — heading and body — so switching styles swaps the href
   *  instead of accumulating a link per style ever visited. */
  private ensureStylesheet(linkId: string, url: string): void {
    const existing = this.document.getElementById(linkId) as HTMLLinkElement | null;
    if (existing) {
      if (!existing.href.endsWith(url)) existing.href = url;
      return;
    }
    const link = this.document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = url;
    this.document.head.appendChild(link);
  }

  private applyFont(id: FontId): void {
    const option = this.options.find((o) => o.id === id) ?? this.options[0];

    this.ensureFontLoaded(option);

    this.document.documentElement.style.setProperty('--font-base', option.stack);
    this.document.documentElement.style.setProperty('--font-family', option.stack);
    this.current.set(option.id);
  }

  /** Inject <link rel=stylesheet> for the font's self-hosted @font-face CSS.
   *  No cssUrl means the system stack (OS-shipped) — nothing to fetch. */
  private ensureFontLoaded(option: FontOption): void {
    const url = option.cssUrl;
    if (!url) return;

    const linkId = `font-link-${option.id}`;
    if (this.document.getElementById(linkId)) return;

    const link = this.document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = url;
    this.document.head.appendChild(link);
  }
}
