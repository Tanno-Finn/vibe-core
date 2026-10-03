import {
  UI_STYLES,
  SEVERITY_HOVER_BRIGHTEN,
  SEVERITY_HOVER_DARKEN,
  severityHoverBrightness,
  outlinedSeverityInk,
  DEFAULT_STYLE,
  DEFAULT_STYLE_NAME,
  resolveStoredStyle,
  styleByName,
  type StyleName,
  type UiStyle,
} from './ui-styles';

/**
 * The visual styles are data (ADR-0016), so they can be verified without a DOM,
 * a TestBed or a browser: contrast is arithmetic over the exported hex values,
 * and the migration of a stored value is a pure function.
 *
 * This spec is deliberately NOT a duplicate of scripts/check-contrast.mjs. The
 * gate text-parses the file and measures every pair of every style against the
 * criterion that governs it, then writes the compilat guides cite. This spec
 * asserts the INVARIANTS a future edit could break without the gate noticing:
 * the floors the styles promise, the migration contract, and the token keys the
 * signature stylesheet blocks depend on.
 */

// --- WCAG 2.1 maths, same formula as the gate and the runtime ---------------
const linearize = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const e = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
};

const luminance = (hex: string): number => {
  const [r, g, b] = rgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
};

const contrast = (a: string, b: string): number => {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

/** sRGB channel multiply with a clamp — the model of CSS `brightness()`. */
const brightened = (hex: string, factor: number): string =>
  '#' +
  rgb(hex)
    .map((c) =>
      Math.min(255, Math.round(c * factor))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

/** Worst label contrast of a gradient under `brightness(factor)`. */
const worstHover = (g: { from: string; to: string; text?: string }, factor: number): number => {
  const label = brightened(g.text ?? '#ffffff', factor);
  return Math.min(contrast(label, brightened(g.from, factor)), contrast(label, brightened(g.to, factor)));
};

const AA_TEXT = 4.5; // SC 1.4.3, normal text
const NON_TEXT = 3.0; // SC 1.4.11, a boundary that identifies a control
const MODES: ('light' | 'dark')[] = ['light', 'dark'];

describe('ui-styles (visual styles as data)', () => {
  it('reports the WCAG reference values, so a broken formula fails here first', () => {
    expect(contrast('#ffffff', '#000000')).toBeCloseTo(21, 1);
    expect(contrast('#767676', '#ffffff')).toBeCloseTo(4.54, 1);
  });

  it('ships exactly the four styles of ADR-0016, with lernwerkstatt as the default', () => {
    expect(UI_STYLES.map((s) => s.name)).toEqual(['lernwerkstatt', 'werkbund', 'skizzenbuch', 'blaupause']);
    expect(DEFAULT_STYLE_NAME).toBe('lernwerkstatt');
    expect(DEFAULT_STYLE).toBe(UI_STYLES[0]);
  });

  describe('contrast floors (from the exported data, no DOM)', () => {
    for (const style of UI_STYLES) {
      for (const mode of MODES) {
        const s = style.surfaces[mode];
        const surfaces: [string, string][] = [
          ['ground', s.ground],
          ['card', s.card],
          ['section', s.section],
          ['hover', s.hover],
        ];

        it(`${style.name}/${mode}: body and secondary text hold 4.5:1 on every surface`, () => {
          for (const [name, bg] of surfaces) {
            // The surface name travels with the assertion so a failure names
            // the pair, not just a number.
            expect([name, contrast(s.textColor, bg) >= AA_TEXT]).toEqual([name, true]);
            expect([name, contrast(s.textColorSecondary, bg) >= AA_TEXT]).toEqual([name, true]);
          }
        });

        it(`${style.name}/${mode}: the control edge holds 3:1 on ground, card and section`, () => {
          for (const [name, bg] of surfaces.slice(0, 3)) {
            expect([name, contrast(s.controlBorder, bg) >= NON_TEXT]).toEqual([name, true]);
          }
        });

        it(`${style.name}/${mode}: the outlined severity ink holds 4.5:1 on the card`, () => {
          // R13: the outlined block excludes the severities, so the preset used
          // to paint these labels itself — in light mode every style fell under
          // 4.5:1 (success #22c55e on white, 2.28:1). The ink is derived from
          // the style's own severity color and only moved as far as it must be.
          for (const [severity, g] of Object.entries(style.severityGradients)) {
            const ink = outlinedSeverityInk(g.from, s.card);
            expect([severity, /^#[0-9a-f]{6}$/i.test(ink)]).toEqual([severity, true]);
            expect([severity, contrast(ink, s.card) >= AA_TEXT]).toEqual([severity, true]);
          }
        });

        it(`${style.name}/${mode}: the outlined ink keeps the hue of the severity`, () => {
          // The cheap fix would be a second palette in disguise; this forbids it.
          const hue = (hex: string): number => {
            const [r, g, b] = rgb(hex);
            const mx = Math.max(r, g, b),
              mn = Math.min(r, g, b);
            if (mx === mn) return -1;
            const d = mx - mn;
            const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
            return Math.round(h * 60);
          };
          for (const [severity, g] of Object.entries(style.severityGradients)) {
            const delta = Math.abs(hue(outlinedSeverityInk(g.from, s.card)) - hue(g.from));
            expect([severity, Math.min(delta, 360 - delta) <= 3]).toEqual([severity, true]);
          }
        });

        it(`${style.name}/${mode}: every severity label holds 4.5:1 while HOVERED`, () => {
          // The hover rule puts a brightness() filter on the whole button, so it
          // moves the label as well as the fill. White clips at 255 and cannot
          // follow, which is why brightening a light label costs contrast —
          // measured, four styles fell under 4.5:1 that way. severityHoverBrightness
          // measures both directions and returns the one that keeps more contrast.
          for (const [severity, g] of Object.entries(style.severityGradients)) {
            const factor = severityHoverBrightness(g);
            const label = brightened(g.text ?? '#ffffff', factor);
            for (const [stop, bg] of [
              ['from', g.from],
              ['to', g.to],
            ] as const) {
              expect([severity, stop, contrast(label, brightened(bg, factor)) >= AA_TEXT]).toEqual([
                severity,
                stop,
                true,
              ]);
            }
          }
        });

        it(`${style.name}/${mode}: the hover direction chosen is the better of the two`, () => {
          for (const [severity, g] of Object.entries(style.severityGradients)) {
            const factor = severityHoverBrightness(g);
            const other = factor < 1 ? SEVERITY_HOVER_BRIGHTEN : SEVERITY_HOVER_DARKEN;
            expect([severity, worstHover(g, factor) >= worstHover(g, other)]).toEqual([severity, true]);
          }
        });

        it(`${style.name}/${mode}: every severity label holds 4.5:1 at both gradient stops`, () => {
          for (const [severity, g] of Object.entries(style.severityGradients)) {
            const label = g.text ?? '#ffffff';
            for (const [stop, bg] of [
              ['from', g.from],
              ['to', g.to],
            ] as const) {
              expect([severity, stop, contrast(label, bg) >= AA_TEXT]).toEqual([severity, stop, true]);
            }
          }
        });
      }

      it(`${style.name}: the dark placeholder holds 4.5:1 on the dark section surface`, () => {
        const placeholder = style.surfaces.dark.controlPlaceholder;
        expect(placeholder).toBeDefined();
        expect(contrast(placeholder as string, style.surfaces.dark.section)).toBeGreaterThanOrEqual(AA_TEXT);
      });
    }
  });

  describe('resolveStoredStyle (the ADR-0016 D1 migration)', () => {
    it('returns a known style name unchanged', () => {
      for (const style of UI_STYLES) {
        expect(resolveStoredStyle(style.name)).toBe(style.name);
      }
    });

    it('maps every former preset name to the default style', () => {
      for (const preset of ['aura', 'material', 'lara', 'nora']) {
        expect(resolveStoredStyle(preset)).toBe(DEFAULT_STYLE_NAME);
      }
    });

    it('maps an absent value to the default style', () => {
      expect(resolveStoredStyle(null)).toBe(DEFAULT_STYLE_NAME);
      expect(resolveStoredStyle(undefined)).toBe(DEFAULT_STYLE_NAME);
      expect(resolveStoredStyle('')).toBe(DEFAULT_STYLE_NAME);
    });

    it('maps garbage to the default style without throwing', () => {
      for (const junk of ['WERKBUND', 'werkbund ', '{}', '../../etc', '<script>', '42']) {
        expect(resolveStoredStyle(junk)).toBe(DEFAULT_STYLE_NAME);
      }
    });

    it('resolves the pre-paint case the boot script duplicates', () => {
      // The anti-FOUC script in src/index.html cannot import this module — it runs
      // before any bundle — so it carries its own copy of the name list and of the
      // fallback, and always sets a `style-<name>` class. This case pins the TS half
      // of that duplicate: whatever a first visitor has stored (nothing), the resolved
      // name is a name the picker offers, so the class the script writes always
      // matches a signature block in styles.scss. Check 1c in
      // scripts/check-contrast.mjs compares the script's copy against these values.
      const resolved = resolveStoredStyle(localStorage.getItem('no-such-key'));
      expect(UI_STYLES.map((s) => s.name)).toContain(resolved);
      expect(resolved).toBe(DEFAULT_STYLE_NAME);
    });

    it('styleByName resolves the same way and always returns an object', () => {
      expect(styleByName('blaupause').name).toBe('blaupause');
      expect(styleByName('nora')).toBe(DEFAULT_STYLE);
      expect(styleByName(null)).toBe(DEFAULT_STYLE);
    });
  });

  describe('token invariants', () => {
    /** The keys the four signature stylesheet blocks and the button block read
     *  through var() without a usable fallback. A style that misses one renders
     *  an unstyled edge instead of its signature, silently. */
    const REQUIRED_TOKEN_KEYS = [
      '--border-radius',
      '--border-radius-md',
      '--border-radius-lg',
      '--border-radius-xl',
      '--style-btn-outlined-border',
      '--style-btn-outlined-bg',
    ];
    const REQUIRED_PER_MODE_KEYS = ['--style-outline', '--button-border', '--fab-edge'];

    const keysOf = (style: UiStyle, mode: 'light' | 'dark'): string[] => [
      ...Object.keys(style.extraTokens?.common ?? {}),
      ...Object.keys(style.extraTokens?.[mode] ?? {}),
    ];

    for (const style of UI_STYLES) {
      it(`${style.name}: defines every extraTokens key the signature blocks read, in both modes`, () => {
        for (const mode of MODES) {
          const keys = keysOf(style, mode);
          for (const key of [...REQUIRED_TOKEN_KEYS, ...REQUIRED_PER_MODE_KEYS]) {
            expect([mode, key, keys.includes(key)]).toEqual([mode, key, true]);
          }
        }
      });
    }

    it('every style defines the same extraTokens key set in light and dark', () => {
      // A key present in one mode only is the failure mode that hurts: the style
      // looks right until the reader switches mode.
      for (const style of UI_STYLES) {
        expect([style.name, keysOf(style, 'light').sort()]).toEqual([style.name, keysOf(style, 'dark').sort()]);
      }
    });

    it('every style carries the ten brand steps and the eleven surface steps per mode', () => {
      const BRAND = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
      const SURFACE = ['0', ...BRAND];
      for (const style of UI_STYLES) {
        expect(Object.keys(style.brandScale).sort()).toEqual([...BRAND].sort());
        for (const mode of MODES) {
          expect(Object.keys(style.surfaceScale[mode]).sort()).toEqual([...SURFACE].sort());
        }
      }
    });

    it('every color in the data is a plain 6-digit hex', () => {
      const hex = /^#[0-9a-f]{6}$/;
      for (const style of UI_STYLES) {
        for (const mode of MODES) {
          for (const [field, value] of Object.entries(style.surfaces[mode])) {
            expect([field, hex.test(value as string)]).toEqual([field, true]);
          }
          for (const value of Object.values(style.surfaceScale[mode])) expect(value).toMatch(hex);
        }
        for (const value of Object.values(style.brandScale)) expect(value).toMatch(hex);
        for (const g of Object.values(style.severityGradients)) {
          expect(g.from).toMatch(hex);
          expect(g.to).toMatch(hex);
          if (g.text) expect(g.text).toMatch(hex);
        }
      }
    });

    it('every style points its i18n keys at its own name', () => {
      for (const style of UI_STYLES) {
        const name: StyleName = style.name;
        expect(style.labelKey).toBe(`settings.theme.styles.${name}.name`);
        expect(style.descriptionKey).toBe(`settings.theme.styles.${name}.description`);
      }
    });

    it('every style font is self-hosted — no font host in a cssUrl', () => {
      for (const style of UI_STYLES) {
        for (const font of [style.fonts?.heading, style.fonts?.body]) {
          if (!font) continue;
          expect(font.cssUrl.startsWith('assets/fonts/')).toBe(true);
          expect(font.cssUrl).not.toMatch(/https?:|googleapis|gstatic/);
        }
      }
    });
  });
});
