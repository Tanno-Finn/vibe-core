/**
 * Visual styles — the "look" axis of the kit (ADR-0016).
 *
 * A style is DATA: surfaces and text colors per mode, the numeric surface
 * scale, the brand scale, a small `definePreset` delta on Aura, severity
 * button colors, self-hosted font defaults and a handful of `--style-*`
 * tokens its signature stylesheet block reads. `ThemeService` turns one
 * (style x accent x mode) triple into inline custom properties on <html>;
 * nothing here touches the DOM.
 *
 * WHY DATA AND NOT FOUR STYLESHEETS
 * The kit reads ~330 custom properties. A style that only shipped CSS would
 * have to restate all of them per mode; as data, one loop writes them and the
 * contrast gate (scripts/check-contrast.mjs) can measure every pair of every
 * style before a browser ever runs.
 *
 * PARSER CONTRACT (scripts/check-contrast.mjs reads this file as TEXT)
 * The gate must not import Angular code, so it text-parses this file. Keep:
 *   - one style object per `export const <NAME>: UiStyle = {` block,
 *     identified by its `name: '<slug>',` line;
 *   - `surfaces:` with `light:` before `dark:`, each field on its own line as
 *     `<field>: '#rrggbb',`;
 *   - `severityGradients:` entries as `<severity>: { from: '#…', to: '#…'[, text: '#…'] },`;
 *   - plain 6-digit hex literals for every color above (no var(), no mix).
 * A refactor that breaks this shape breaks the gate loudly (it refuses to
 * guess and fails), not silently.
 *
 * PROVENANCE
 * The four objects are ported from the project this kit was
 * extracted from (`portal-styles.ts`, read 2026-09-05). Values are the
 * upstream's measured hex values, with exactly three deviations, each marked
 * `ADR-0016 D3` below and recorded in the ADR as a backport finding.
 * Dropped on the way in (22 tokens with no reader in this kit): `status`,
 * `rarity`, `accentTones`.
 */

/** The four styles. The stored value of the `theme` key is one of these. */
export type StyleName = 'werkbund' | 'lernwerkstatt' | 'skizzenbuch' | 'blaupause';

/** Surface + text ground colors of one mode. */
export interface StyleSurfaces {
  ground: string;
  card: string;
  section: string;
  /** Decorative edge (cards, table rules) — SC 1.4.11 deliberately not claimed. */
  border: string;
  hover: string;
  textColor: string;
  textColorSecondary: string;
  /** Edge that identifies a control (SC 1.4.11, >=3:1 on ground/card/section).
   *  Kit-only token; the workshop's PortalStyle has no equivalent. */
  controlBorder: string;
  /** Placeholder text inside a field painted --surface-section. Declared for
   *  dark only, mirroring styles.scss: the light field keeps Optimus's own. */
  controlPlaceholder?: string;
}

/** One severity button's fill. `from === to` means a flat color.
 *  `text` overrides the default white label. */
export interface SeverityGradient {
  from: string;
  to: string;
  text?: string;
}

/**
 * Hover brightness of a button with a colored fill (ported from the
 * workshop's R12 finding, 2026-09-06; extended to the primary and outlined
 * button after an independent review the same day).
 *
 * The severity block used to brighten the hovered button by a flat
 * `brightness(1.1)`. Measured, that put four styles under the 4.5:1 of
 * SC 1.4.3 in one severity each (worst: lernwerkstatt/danger 3.96:1), even
 * though every style passes at rest.
 *
 * Why brightening is expensive under a light label: the filter moves the fill
 * AND the label (verified on rendered pixels). White already sits at 255 and
 * cannot follow, so the fill runs into the label. Darkening scales both sides
 * and nearly preserves the ratio — only the +0.05 offsets of the WCAG formula
 * compress it. Under a dark label on a dark fill it is the other way round.
 *
 * The same holds for the filled PRIMARY button, which had no contrast gate at
 * all: 6 of its 20 accent x mode pairs fell under 4.5:1 while hovered (worst
 * sunset/light 4.18:1). That is why the rule is generic and lives here with
 * the data.
 *
 * So the rule does not guess, it measures: both directions are evaluated and
 * the one with the better worst-case label contrast wins.
 *
 * Why 1.0 (no filter at all) is NOT a candidate, although under a light label
 * it would always be the arithmetic optimum: every severity in this kit is
 * FLAT (`from === to`), so the `background-position` travel from 0% to 100%
 * moves nothing and the filter is the only hover feedback there. The price is
 * small and measured: worst value 4.52:1 instead of 4.68:1 without a filter.
 *
 * Gates: ui-styles.spec.ts and scripts/check-contrast.mjs.
 */
export const SEVERITY_HOVER_DARKEN = 0.92;
export const SEVERITY_HOVER_BRIGHTEN = 1.1;

const severityRelLum = (hex: string): number => {
  const h = hex.replace('#', '');
  const chan = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
};

/** sRGB channel multiply with a clamp — the model of CSS `brightness()`. */
const severityBrightened = (hex: string, factor: number): string => {
  const h = hex.replace('#', '');
  return (
    '#' +
    [0, 2, 4]
      .map((i) =>
        Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * factor))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
};

export const worstLabelContrastUnderHover = (from: string, to: string, label: string, factor: number): number => {
  const ratio = (a: string, b: string): number => {
    const la = severityRelLum(a);
    const lb = severityRelLum(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  };
  const lab = severityBrightened(label, factor);
  return Math.min(ratio(lab, severityBrightened(from, factor)), ratio(lab, severityBrightened(to, factor)));
};

/**
 * The direction for any button surface with a label. `from`/`to` are the
 * gradient ends (twice the same value for a flat fill).
 */
export function hoverBrightnessFor(from: string, to: string, label: string): number {
  return worstLabelContrastUnderHover(from, to, label, SEVERITY_HOVER_BRIGHTEN) >
    worstLabelContrastUnderHover(from, to, label, SEVERITY_HOVER_DARKEN)
    ? SEVERITY_HOVER_BRIGHTEN
    : SEVERITY_HOVER_DARKEN;
}

/**
 * Ink of an OUTLINED severity button (ported from the workshop's R13,
 * 2026-09-07).
 *
 * The outlined block excludes the severities
 * (`:not([class*="p-button-success"])` …), so the widget preset painted those
 * labels with its own raw color. Measured on the running app: in light mode
 * every style fell under 4.5:1 — `success` #22c55e on a white card is
 * **2.28:1**, `info` 2.77, `warn` 2.80, `danger` 3.76, `help` 3.96. Dark
 * passed with the lighter tints. No gate had ever looked at these pairs,
 * because the color did not come from the style at all.
 *
 * The ink now comes from the style: it starts at the `from` stop of the filled
 * severity — the same color that carries the solid button — and moves only
 * the HSL lightness away from the card, 1% at a time, until it holds. Hue and
 * saturation stay, so no second palette appears behind the first.
 *
 * The target is 4.6:1, not 4.5:1, and that number is measured rather than
 * cautious: a first version stopped at exactly 4.5 and two of 96 rendered
 * cases in the workshop landed at 4.49 — antialiasing and averaging over the
 * sampled bands eat the last hundredth. The reserve costs one barely visible
 * lightness step and makes the rule true in the picture, not just on paper.
 *
 * The return value carries label AND border: 4.5:1 covers the 3:1 of
 * SC 1.4.11 for the border.
 *
 * Gates: ui-styles.spec.ts and scripts/check-contrast.mjs.
 */
const OUTLINED_INK_TARGET = 4.6;

export function outlinedSeverityInk(base: string, card: string): string {
  const ratio = (a: string, b: string): number => {
    const la = severityRelLum(a),
      lb = severityRelLum(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  };
  if (ratio(base, card) >= OUTLINED_INK_TARGET) return base;

  const { h, s, l } = severityRgbToHsl(base);
  const cardIsLight = severityRelLum(card) > 0.18;
  const step = cardIsLight ? -0.01 : 0.01;
  let best = base;
  for (let i = 1; i <= 100; i++) {
    const candidate = severityHslToHex(h, s, Math.min(1, Math.max(0, l + step * i)));
    best = candidate;
    if (ratio(candidate, card) >= OUTLINED_INK_TARGET) return candidate;
  }
  return best;
}

/** HSL conversion for outlinedSeverityInk — hue and saturation are preserved. */
function severityRgbToHsl(hex: string): { h: number; s: number; l: number } {
  const p = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(p.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return { h: 0, s: 0, l };
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = (mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) / 6;
  return { h, s, l };
}

function severityHslToHex(h: number, s: number, l: number): string {
  const f = (n: number): number => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))));
  };
  return '#' + [f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** The direction for a severity button (label defaults to white). */
export function severityHoverBrightness(gradient: SeverityGradient): number {
  return hoverBrightnessFor(gradient.from, gradient.to, gradient.text ?? '#ffffff');
}

/** Numeric --surface-0…900 scale of one mode (0 = the mode's ground pole). */
export type SurfaceScale = Record<
  '0' | '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
  string
>;

/** Brand scale --primary-50…900, mode-independent. */
export type BrandScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;

/** A style's font default. `stack` holds only the family prefixes; FontService
 *  appends its multi-script system stack. `cssUrl` points at a self-hosted
 *  @font-face sheet in assets/fonts — never a font host (ADR-0016 D4). */
export interface StyleFont {
  stack: string;
  cssUrl: string;
}

export interface UiStyle {
  name: StyleName;
  /** i18n key of the style's name, `settings.theme.styles.<name>.name`. */
  labelKey: string;
  /** i18n key of the one-sentence description. */
  descriptionKey: string;
  brandScale: BrandScale;
  /** `definePreset` delta applied on Aura before the accent primary ramp. */
  presetOverrides?: Record<string, string | number | object>;
  surfaces: { light: StyleSurfaces; dark: StyleSurfaces };
  surfaceScale: { light: SurfaceScale; dark: SurfaceScale };
  /** Free tokens: `common` applies to both modes, `light`/`dark` win over it. */
  extraTokens?: {
    common?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  /** Style font DEFAULTS — an explicit user font choice always wins
   *  (FontService.applyStyleFonts). */
  fonts?: { heading?: StyleFont; body?: StyleFont };
  severityGradients: {
    danger: SeverityGradient;
    success: SeverityGradient;
    info: SeverityGradient;
    warn: SeverityGradient;
    secondary: SeverityGradient;
    help: SeverityGradient;
  };
}

/** Dark-mode severity base values for Optimus buttons. The severity block
 *  overrides the filled variants anyway; these keep outlined/text readable. */
const DARK_BUTTON_COLOR_SCHEME = {
  dark: {
    root: {
      secondary: {
        background: '#6b7280',
        borderColor: '#6b7280',
        color: '#ffffff',
        hoverBackground: '#9ca3af',
        hoverBorderColor: '#9ca3af',
        activeBackground: '#d1d5db',
      },
      success: {
        background: '#34d399',
        borderColor: '#34d399',
        color: '#000000',
        hoverBackground: '#6ee7b7',
        hoverBorderColor: '#6ee7b7',
        activeBackground: '#a7f3d0',
      },
      info: {
        background: '#60a5fa',
        borderColor: '#60a5fa',
        color: '#ffffff',
        hoverBackground: '#93c5fd',
        hoverBorderColor: '#93c5fd',
        activeBackground: '#bfdbfe',
      },
      warn: {
        background: '#fbbf24',
        borderColor: '#fbbf24',
        color: '#000000',
        hoverBackground: '#fcd34d',
        hoverBorderColor: '#fcd34d',
        activeBackground: '#fde68a',
      },
      danger: {
        background: '#f87171',
        borderColor: '#f87171',
        color: '#ffffff',
        hoverBackground: '#fca5a5',
        hoverBorderColor: '#fca5a5',
        activeBackground: '#fecaca',
      },
    },
  },
};

/** Outlined-button ring shared by all four styles: the style's own ink instead
 *  of the brand gradient ring (the severity block reads these with a
 *  byte-identical fallback, so no specificity duel is needed). */
const OUTLINED_INK = {
  '--style-btn-outlined-border': 'var(--style-outline)',
  '--style-btn-outlined-bg':
    'linear-gradient(var(--surface-card), var(--surface-card)), linear-gradient(var(--surface-card), var(--surface-card))',
};

/**
 * Werkbund — Bauhaus geometry: radius 0 everywhere, no shadows, ink borders,
 * an 8px offset color plane for depth. It was the default until 2026-09-24
 * (ADR-0016 D3, amended): every measured pair passes unmodified, but the user
 * found it too severe as the first impression.
 */
export const WERKBUND: UiStyle = {
  name: 'werkbund',
  labelKey: 'settings.theme.styles.werkbund.name',
  descriptionKey: 'settings.theme.styles.werkbund.description',

  // Bauhaus red as the brand scale (#d92b2b = step 500).
  brandScale: {
    '50': '#fdeaea',
    '100': '#fad4d4',
    '200': '#f5a9a9',
    '300': '#ee7a7a',
    '400': '#e45252',
    '500': '#d92b2b',
    '600': '#b82222',
    '700': '#961b1b',
    '800': '#741515',
    '900': '#521010',
  },

  presetOverrides: {
    primitive: {
      borderRadius: { none: '0', xs: '0', sm: '0', md: '0', lg: '0', xl: '0' },
    },
    components: {
      button: {
        root: { borderRadius: '0' },
        // Own dark scheme: colored planes carry ink-colored labels
        // (every label pairing >= 4.99:1).
        colorScheme: {
          dark: {
            root: {
              secondary: {
                background: '#a5a29b',
                borderColor: '#a5a29b',
                color: '#121212',
                hoverBackground: '#c4c2bc',
                hoverBorderColor: '#c4c2bc',
                activeBackground: '#dedcd6',
              },
              success: {
                background: '#5fbf8a',
                borderColor: '#5fbf8a',
                color: '#121212',
                hoverBackground: '#8fd4ab',
                hoverBorderColor: '#8fd4ab',
                activeBackground: '#b8e4cc',
              },
              info: {
                background: '#6488e0',
                borderColor: '#6488e0',
                color: '#121212',
                hoverBackground: '#93aeea',
                hoverBorderColor: '#93aeea',
                activeBackground: '#bcc9f2',
              },
              warn: {
                background: '#f2c94c',
                borderColor: '#f2c94c',
                color: '#121212',
                hoverBackground: '#f5d670',
                hoverBorderColor: '#f5d670',
                activeBackground: '#f8e29a',
              },
              danger: {
                background: '#e5504f',
                borderColor: '#e5504f',
                color: '#121212',
                hoverBackground: '#ec7a79',
                hoverBorderColor: '#ec7a79',
                activeBackground: '#f2a3a2',
              },
            },
          },
        },
      },
    },
  },

  surfaces: {
    light: {
      ground: '#f6f5f1',
      card: '#ffffff',
      section: '#efede7',
      border: '#d5d2c9',
      hover: '#eceae3',
      textColor: '#121212',
      textColorSecondary: '#55524c',
      controlBorder: '#6f6c66',
    },
    dark: {
      ground: '#141416',
      card: '#1d1d21',
      section: '#26262b',
      border: '#3a3a40',
      hover: '#26262b',
      textColor: '#f2f1ed',
      textColorSecondary: '#a5a29b',
      controlBorder: '#8b8a90',
      controlPlaceholder: '#a5a29b',
    },
  },

  surfaceScale: {
    light: {
      '0': '#f6f5f1',
      '50': '#efede7',
      '100': '#e7e5de',
      '200': '#d5d2c9',
      '300': '#b9b5aa',
      '400': '#93908a',
      '500': '#6f6c66',
      '600': '#55524c',
      '700': '#3d3b37',
      '800': '#262523',
      '900': '#121212',
    },
    dark: {
      '0': '#141416',
      '50': '#1d1d21',
      '100': '#26262b',
      '200': '#3a3a40',
      '300': '#4f4f57',
      '400': '#6b6b73',
      '500': '#8b8a90',
      '600': '#a5a29b',
      '700': '#c4c2bc',
      '800': '#dedcd6',
      '900': '#f2f1ed',
    },
  },

  // Flat (from === to) — Bauhaus knows no gradients. warn carries ink text
  // (white on Bauhaus yellow would be ~1.9:1), help is the fourth Werkbund
  // color, black.
  severityGradients: {
    danger: { from: '#c22525', to: '#c22525' },
    success: { from: '#2e7d4f', to: '#2e7d4f' },
    info: { from: '#2251c9', to: '#2251c9' },
    warn: { from: '#f0c02e', to: '#f0c02e', text: '#121212' },
    secondary: { from: '#55524c', to: '#55524c' },
    help: { from: '#121212', to: '#121212' },
  },

  extraTokens: {
    common: {
      '--border-radius': '0px',
      ...OUTLINED_INK,
      '--border-radius-md': '0px',
      '--border-radius-lg': '0px',
      '--border-radius-xl': '0px',
    },
    light: {
      '--style-outline': '#121212',
      // Edge of the floating action buttons (SC 1.4.11) — the ink outline.
      '--fab-edge': '#121212',
      // Ink on a brand-colored chip (the signature blocks' title sticker).
      // White on brand-500 #d92b2b measures 4.85:1 in both modes.
      '--style-brand-ink': '#ffffff',
      '--style-bw': '3px',
      '--button-border': '3px solid #121212',
      '--style-offset': '#f0c02e',
      '--style-geo-red': '#d92b2b',
      '--style-geo-yellow': '#f0c02e',
      '--style-geo-blue': '#2251c9',
    },
    dark: {
      '--style-outline': '#f2f1ed',
      '--fab-edge': '#f2f1ed',
      '--style-brand-ink': '#ffffff',
      '--style-bw': '2px',
      '--button-border': '2px solid #f2f1ed',
      '--style-offset': '#6488e0',
      '--style-geo-red': '#e5504f',
      '--style-geo-yellow': '#f2c94c',
      '--style-geo-blue': '#6488e0',
    },
  },

  // Archivo Black exists in weight 400 only; Archivo carries the body text.
  fonts: {
    heading: { stack: "'Archivo Black', 'Archivo'", cssUrl: 'assets/fonts/archivo-black.css' },
    body: { stack: "'Archivo'", cssUrl: 'assets/fonts/archivo.css' },
  },
};

/**
 * Lernwerkstatt — the DEFAULT style since 2026-09-24 (ADR-0016 D3, amended).
 * Sticker optics: larger radii, pill buttons, 2px outlines and
 * offset shadows. Body font is Atkinson Hyperlegible (already shipped) for the
 * plain-language audience; the amber brand scale is the kit's previous static
 * scale, so the brand color does not move for returning readers.
 */
export const LERNWERKSTATT: UiStyle = {
  name: 'lernwerkstatt',
  labelKey: 'settings.theme.styles.lernwerkstatt.name',
  descriptionKey: 'settings.theme.styles.lernwerkstatt.description',

  // Amber — byte-identical to the kit's former static --primary-50…900.
  brandScale: {
    '50': '#fffbeb',
    '100': '#fef3c7',
    '200': '#fde68a',
    '300': '#fcd34d',
    '400': '#fbbf24',
    '500': '#f59e0b',
    '600': '#d97706',
    '700': '#b45309',
    '800': '#92400e',
    '900': '#78350f',
  },

  presetOverrides: {
    primitive: {
      borderRadius: { none: '0', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
    },
    components: {
      button: {
        root: { borderRadius: '999px' },
        colorScheme: DARK_BUTTON_COLOR_SCHEME,
      },
    },
  },

  surfaces: {
    light: {
      ground: '#fffdf6',
      card: '#ffffff',
      section: '#fdf8ec',
      border: '#e6dcc8',
      hover: '#f7efdd',
      textColor: '#2b2622',
      textColorSecondary: '#6d645c',
      controlBorder: '#8a7a68',
    },
    // Near-neutral greys with a faint warm cast that matches the cream light
    // board. Each step keeps the relative luminance of the value it was
    // derived from, so every measured ratio stays where it was.
    dark: {
      ground: '#201e1b',
      card: '#292725',
      section: '#312f2c',
      border: '#413f3c',
      hover: '#373432',
      textColor: '#f1efec',
      textColorSecondary: '#afacaa',
      controlBorder: '#969491',
      controlPlaceholder: '#afacaa',
    },
  },

  surfaceScale: {
    light: {
      '0': '#fffdf6',
      '50': '#fdf8ec',
      '100': '#f7efdd',
      '200': '#ede1c8',
      '300': '#d8c8ab',
      '400': '#b3a189',
      '500': '#8a7a68',
      '600': '#6d645c',
      '700': '#514941',
      '800': '#3b342d',
      '900': '#2b2622',
    },
    dark: {
      '0': '#201e1b',
      '50': '#292725',
      '100': '#312f2c',
      '200': '#413f3c',
      '300': '#555350',
      '400': '#787573',
      '500': '#969491',
      '600': '#afacaa',
      '700': '#cdcbc8',
      '800': '#e6e4e1',
      '900': '#f1efec',
    },
  },

  // Flat with the workshop's board palette. warn = amber with dark text
  // (white on amber would be ~3:1).
  severityGradients: {
    danger: { from: '#cf3f52', to: '#cf3f52' },
    success: { from: '#187a50', to: '#187a50' },
    info: { from: '#4762c9', to: '#4762c9' },
    warn: { from: '#f59e0b', to: '#f59e0b', text: '#2b2622' },
    secondary: { from: '#6d645c', to: '#6d645c' },
    help: { from: '#675ad0', to: '#675ad0' },
  },

  extraTokens: {
    common: {
      '--border-radius': '12px',
      ...OUTLINED_INK,
      '--border-radius-md': '12px',
      '--border-radius-lg': '16px',
      '--border-radius-xl': '16px',
    },
    light: {
      '--style-outline': '#2b2622',
      // Edge of the floating action buttons (SC 1.4.11) — the sticker outline.
      '--fab-edge': '#2b2622',
      // Ink on the amber sticker: brandScale has no dark flip, so the same
      // dark ink serves both modes (6.97:1 on brand-500 #f59e0b).
      '--style-brand-ink': '#2b2622',
      '--button-border': '2px solid #2b2622',
      '--style-candy-coral': '#f0617a',
      '--style-candy-teal': '#23a094',
      '--style-candy-purple': '#7c6fe0',
    },
    dark: {
      // The sticker outline is the edge of every card, dialog, drawer and
      // popover, and the page ground is barely darker than the card, so the
      // outline must carry the boundary (SC 1.4.11, gated as "panel outline").
      // The former near-black #0e0b12 measured 1.17:1 on the dark ground; the
      // outline now takes the style's control-edge grey — a light sticker rim
      // on a dark board.
      '--style-outline': '#969491',
      '--fab-edge': '#969491',
      '--style-brand-ink': '#2b2622',
      '--button-border': '2px solid #969491',
      '--style-candy-coral': '#f889a9',
      '--style-candy-teal': '#43c6b9',
      '--style-candy-purple': '#a89bf0',
    },
  },

  fonts: {
    heading: { stack: "'Baloo 2', 'Atkinson Hyperlegible'", cssUrl: 'assets/fonts/baloo-2.css' },
    body: { stack: "'Atkinson Hyperlegible'", cssUrl: 'assets/fonts/atkinson-hyperlegible.css' },
  },
};

/**
 * Skizzenbuch — sketchbook: warm paper, fineliner outlines, hand-drawn button
 * radius, soft paper shadows and watercolor washes.
 */
export const SKIZZENBUCH: UiStyle = {
  name: 'skizzenbuch',
  labelKey: 'settings.theme.styles.skizzenbuch.name',
  descriptionKey: 'settings.theme.styles.skizzenbuch.description',

  // Ochre (#dcb878 = step 400).
  brandScale: {
    '50': '#faf5e9',
    '100': '#f5ead2',
    '200': '#ecd9ad',
    '300': '#e3c88f',
    '400': '#dcb878',
    '500': '#d0a45e',
    '600': '#ab7f35',
    '700': '#8a651f',
    '800': '#6b4e14',
    '900': '#4f3a0f',
  },

  presetOverrides: {
    primitive: {
      borderRadius: { none: '0', xs: '3px', sm: '6px', md: '10px', lg: '14px', xl: '20px' },
    },
    components: {
      button: {
        // Hand-drawn radius: the browser clamps the large arcs proportionally,
        // so small buttons stay organic and nothing overlaps.
        root: { borderRadius: '18px 88px 14px 80px / 80px 14px 88px 16px' },
        colorScheme: DARK_BUTTON_COLOR_SCHEME,
      },
    },
  },

  surfaces: {
    light: {
      ground: '#faf7f2',
      card: '#ffffff',
      section: '#f5f0e8',
      border: '#ddd4c6',
      hover: '#efe8dc',
      textColor: '#3a3530',
      textColorSecondary: '#6f675e',
      controlBorder: '#837a6e',
    },
    dark: {
      ground: '#26231f',
      card: '#2f2b26',
      section: '#38332c',
      border: '#4a443b',
      // ADR-0016 D3: workshop value #3f3931 darkened so secondary text on a
      // hovered row clears 4.5:1 (4.37 -> 4.57; body text 9.62).
      hover: '#3c362e',
      textColor: '#ece6dc',
      textColorSecondary: '#a89f92',
      controlBorder: '#968c7d',
      controlPlaceholder: '#a89f92',
    },
  },

  surfaceScale: {
    light: {
      '0': '#faf7f2',
      '50': '#f5f0e8',
      '100': '#efe8dc',
      '200': '#e2d8c8',
      '300': '#c9bda9',
      '400': '#a3988a',
      '500': '#837a6e',
      '600': '#6f675e',
      '700': '#575049',
      '800': '#46413a',
      '900': '#3a3530',
    },
    dark: {
      '0': '#26231f',
      '50': '#2f2b26',
      '100': '#38332c',
      '200': '#4a443b',
      '300': '#5c544a',
      '400': '#7b7263',
      '500': '#968c7d',
      '600': '#a89f92',
      '700': '#c5bdb0',
      '800': '#dcd5c9',
      '900': '#ece6dc',
    },
  },

  // Paper chips: a watercolor tint with status ink as the label.
  severityGradients: {
    danger: { from: '#f6e1df', to: '#f6e1df', text: '#963f3a' },
    success: { from: '#e4efe6', to: '#e4efe6', text: '#3f6b4c' },
    info: { from: '#e3eaf5', to: '#e3eaf5', text: '#425c86' },
    warn: { from: '#f5ead2', to: '#f5ead2', text: '#7d5813' },
    secondary: { from: '#efe8dc', to: '#efe8dc', text: '#3a3530' },
    help: { from: '#eae4f4', to: '#eae4f4', text: '#5b4c92' },
  },

  extraTokens: {
    common: {
      '--border-radius': '10px',
      ...OUTLINED_INK,
      '--border-radius-md': '12px',
      '--border-radius-lg': '16px',
      '--border-radius-xl': '18px',
    },
    light: {
      '--style-outline': '#3a3530',
      // Edge of the floating action buttons (SC 1.4.11) — the fineliner.
      '--fab-edge': '#3a3530',
      // Ink on the ochre chip, painted on brand-400 #dcb878 (6.45:1),
      // mode-independent like the brand scale itself.
      '--style-brand-ink': '#3a3530',
      '--button-border': '1.5px solid #3a3530',
      '--style-outline-soft': '#898683',
      '--style-paper-shadow': '0 2px 8px rgba(58, 53, 48, 0.08)',
      '--style-paper-shadow-lg': '0 4px 16px rgba(58, 53, 48, 0.07)',
      '--style-wash-1': 'rgba(220, 184, 120, 0.15)',
      '--style-wash-2': 'rgba(157, 184, 156, 0.13)',
      '--style-wash-3': 'rgba(224, 169, 173, 0.12)',
      '--style-wash-4': 'rgba(179, 165, 214, 0.11)',
    },
    dark: {
      '--style-outline': '#ece6dc',
      '--fab-edge': '#ece6dc',
      '--style-brand-ink': '#3a3530',
      '--button-border': '1.5px solid #ece6dc',
      '--style-outline-soft': '#a09b93',
      '--style-paper-shadow': '0 2px 10px rgba(0, 0, 0, 0.28)',
      '--style-paper-shadow-lg': '0 4px 18px rgba(0, 0, 0, 0.26)',
      '--style-wash-1': 'rgba(230, 200, 144, 0.08)',
      '--style-wash-2': 'rgba(179, 203, 178, 0.07)',
      '--style-wash-3': 'rgba(232, 191, 195, 0.06)',
      '--style-wash-4': 'rgba(201, 189, 230, 0.06)',
    },
  },

  fonts: {
    heading: { stack: "'Lora', Georgia", cssUrl: 'assets/fonts/lora.css' },
    body: { stack: "'Nunito Sans'", cssUrl: 'assets/fonts/nunito-sans.css' },
  },
};

/**
 * Blaupause — a construction drawing: navy ground with cyan lines in dark,
 * drawing paper with blue ink in light. Depth comes from lines only — no
 * shadows, 2px radius, a millimeter grid and corner marks.
 */
export const BLAUPAUSE: UiStyle = {
  name: 'blaupause',
  labelKey: 'settings.theme.styles.blaupause.name',
  descriptionKey: 'settings.theme.styles.blaupause.description',

  // Blueprint cyan (#7fd1f0 = step 300, #1273a8 = step 600).
  brandScale: {
    '50': '#eef8fd',
    '100': '#d8eefa',
    '200': '#b3def4',
    '300': '#7fd1f0',
    '400': '#4ab3dc',
    '500': '#1e93c2',
    '600': '#1273a8',
    '700': '#0e5c88',
    '800': '#0a466a',
    '900': '#07344f',
  },

  presetOverrides: {
    primitive: {
      borderRadius: { none: '0', xs: '1px', sm: '2px', md: '2px', lg: '3px', xl: '4px' },
    },
    components: {
      button: {
        root: { borderRadius: '2px' },
        colorScheme: DARK_BUTTON_COLOR_SCHEME,
      },
    },
  },

  surfaces: {
    light: {
      ground: '#f6f8fb',
      card: '#ffffff',
      section: '#eef2f8',
      border: '#64809f',
      // ADR-0016 D3: workshop value #e9eef6 lifted so secondary text on a
      // hovered row clears 4.5:1 (4.47 -> 4.55).
      hover: '#ebf0f7',
      textColor: '#17335c',
      textColorSecondary: '#526f8f',
      // The ink line already clears 3:1 on ground and card, so it doubles as
      // the control edge.
      controlBorder: '#64809f',
    },
    dark: {
      ground: '#0e2a52',
      // ADR-0016 D3: workshop value #123463 darkened so every accent
      // foreground clears 4.5:1 on a card (fire 4.47 -> 4.75); the card-to-
      // ground step stays a visible 1.09.
      card: '#10305c',
      section: '#173d74',
      border: '#6e8fc0',
      hover: '#1a4179',
      textColor: '#e8f0fb',
      textColorSecondary: '#9fb5d6',
      controlBorder: '#6e8fc0',
      controlPlaceholder: '#9fb5d6',
    },
  },

  surfaceScale: {
    light: {
      '0': '#f6f8fb',
      '50': '#eef2f8',
      '100': '#e3eaf3',
      '200': '#cdd9e8',
      '300': '#b9c8de',
      '400': '#8ea6c4',
      '500': '#64809f',
      '600': '#526f8f',
      '700': '#3c557a',
      '800': '#274067',
      '900': '#17335c',
    },
    dark: {
      // ADR-0016 D3: step 50 follows the darkened card, as in the other
      // three styles, where step 50 and the card surface are the same color.
      '0': '#0e2a52',
      '50': '#10305c',
      '100': '#173d74',
      '200': '#274f85',
      '300': '#3f5f92',
      '400': '#5f7dab',
      '500': '#8aa2c6',
      '600': '#9fb5d6',
      '700': '#c4d3e8',
      '800': '#dde7f4',
      '900': '#eef4fb',
    },
  },

  // Flat plan legend. warn = marker yellow with navy ink (white would be ~1.5:1).
  severityGradients: {
    danger: { from: '#c23540', to: '#c23540' },
    success: { from: '#146c4c', to: '#146c4c' },
    info: { from: '#1273a8', to: '#1273a8' },
    warn: { from: '#ffd23f', to: '#ffd23f', text: '#0e2a52' },
    secondary: { from: '#47617f', to: '#47617f' },
    help: { from: '#6055c8', to: '#6055c8' },
  },

  extraTokens: {
    common: {
      '--border-radius': '2px',
      ...OUTLINED_INK,
      '--border-radius-md': '2px',
      '--border-radius-lg': '2px',
      '--border-radius-xl': '2px',
    },
    light: {
      '--style-outline': '#64809f',
      // Edge of the floating action buttons (SC 1.4.11) — the ink line.
      '--fab-edge': '#64809f',
      // Blaupause's title box is an outline, not a filled chip — no element
      // puts this ink on brand, so the gate measures no pair for it. The
      // value is the style's own text color, the ink it would use.
      '--style-brand-ink': '#17335c',
      '--button-border': '1px solid #64809f',
      '--style-accent': '#1273a8',
      '--style-grid-fine': 'rgba(18, 115, 168, 0.055)',
      '--style-grid-bold': 'rgba(18, 115, 168, 0.11)',
    },
    dark: {
      '--style-outline': '#6e8fc0',
      '--fab-edge': '#6e8fc0',
      '--style-brand-ink': '#e8f0fb',
      '--button-border': '1px solid #6e8fc0',
      '--style-accent': '#7fd1f0',
      '--style-grid-fine': 'rgba(127, 209, 240, 0.07)',
      '--style-grid-bold': 'rgba(127, 209, 240, 0.14)',
    },
  },

  fonts: {
    heading: { stack: "'Rajdhani', 'IBM Plex Sans'", cssUrl: 'assets/fonts/rajdhani.css' },
    body: { stack: "'IBM Plex Sans'", cssUrl: 'assets/fonts/ibm-plex-sans.css' },
  },
};

/** Picker order. The first entry is the default (see DEFAULT_STYLE). */
export const UI_STYLES: UiStyle[] = [LERNWERKSTATT, WERKBUND, SKIZZENBUCH, BLAUPAUSE];

/** The style a reader gets without a stored choice, and the fallback for a
 *  stored value that names no style. Its surfaces are also what styles.scss
 *  and the anti-FOUC block in index.html paint statically (gate check 1). */
export const DEFAULT_STYLE_NAME: StyleName = 'lernwerkstatt';
export const DEFAULT_STYLE: UiStyle = LERNWERKSTATT;

/**
 * The `theme` storage key kept its name across ADR-0016 and now holds a style
 * name. This is the only place that reads it: a known style name comes back as
 * is; the four former preset names (`aura`, `material`, `lara`, `nora`), an
 * absent value and anything else map to the default. Nothing throws, nothing is
 * left half-migrated — the service writes the resolved name back on its first
 * apply.
 */
export function resolveStoredStyle(value: string | null | undefined): StyleName {
  return UI_STYLES.some((s) => s.name === value) ? (value as StyleName) : DEFAULT_STYLE_NAME;
}

/** The style object for a name, defaulting like `resolveStoredStyle`. */
export function styleByName(name: string | null | undefined): UiStyle {
  return UI_STYLES.find((s) => s.name === name) ?? DEFAULT_STYLE;
}
