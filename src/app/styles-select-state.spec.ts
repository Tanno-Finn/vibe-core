import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { style as optimusSelectStyle } from '@openng/optimus-ui-styles/select';

/**
 * Guards the two select state rules the kit's own stylesheet is able to flatten.
 *
 * WHY THIS EXISTS. Optimus paints the SELECTED value, the DISABLED value and the
 * PLACEHOLDER on one and the same element, `span.p-select-label`, with three rules
 * of rising specificity:
 *
 *   .p-select-label                        { color: dt('select.color') }
 *   .p-select-label.p-placeholder          { color: dt('select.placeholder.color') }
 *   .p-select.p-disabled .p-select-label   { color: dt('select.disabled.color') }
 *
 * A kit rule of the shape `.p-select-label { color: … !important }` therefore does
 * not raise one color — it erases all three states at once, in both themes. That
 * is exactly what shipped until this spec was written: measured in Chromium against
 * the compiled stylesheet, a disabled label and a placeholder rendered in the
 * resting color to the byte (#495057 light, #f1f5f9 dark). The states came back by
 * moving the intent onto the ELEMENT TOKEN `--p-select-color`, which the state rules
 * sit above instead of under.
 *
 * WHAT IT CHECKS, and why not a rendered color. The suite runs on jsdom, whose
 * `getComputedStyle` resolves neither `var()` nor cascade precedence, so a computed
 * color measured here would be fiction. Both halves of the mechanism are checked at
 * their real source instead: the library's shipped stylesheet (imported, not quoted)
 * still keys its state rules on that element, and the kit's stylesheet still uses a
 * token rather than a rule that would flatten them.
 */
// Resolved from the runner's working directory (the workspace root), because the
// specs are bundled and `import.meta.url` is not a file URL here.
const KIT_STYLES = readFileSync(resolve('src/styles.scss'), 'utf8');

/** Declaration blocks of `src/styles.scss`, keyed by their selector list. */
function ruleBodies(css: string, selectorPattern: RegExp): string[] {
  const bodies: string[] = [];
  const rule = /(^|})\s*([^{}@/]+?)\{([^{}]*)\}/gms;
  let match: RegExpExecArray | null;
  while ((match = rule.exec(css)) !== null) {
    const selector = match[2].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (selectorPattern.test(selector)) bodies.push(match[3]);
  }
  return bodies;
}

describe('p-select label state colors', () => {
  describe('the library rules the kit must not flatten', () => {
    it('keys the disabled color on .p-select-label', () => {
      expect(optimusSelectStyle).toContain('.p-select.p-disabled .p-select-label');
      expect(optimusSelectStyle).toContain("dt('select.disabled.color')");
    });

    it('keys the placeholder color on the same element', () => {
      expect(optimusSelectStyle).toContain('.p-select-label.p-placeholder');
      expect(optimusSelectStyle).toContain("dt('select.placeholder.color')");
    });
  });

  describe('the kit stylesheet', () => {
    it('never paints .p-select-label with an important color', () => {
      const offenders = ruleBodies(KIT_STYLES, /\.p-select-label(?![\w-])/).filter((body) =>
        /(^|;)\s*color\s*:[^;]*!important/m.test(body),
      );
      expect(offenders).toEqual([]);
    });

    it('raises the resting label through the element token in both themes', () => {
      expect(ruleBodies(KIT_STYLES, /^\.p-select$/).join('\n')).toContain('--p-select-color: var(--text-color)');
      expect(ruleBodies(KIT_STYLES, /^\.dark-theme \.p-select$/).join('\n')).toContain(
        '--p-select-color: var(--text-color)',
      );
    });

    it('keeps the dark placeholder on the token measured against --surface-section', () => {
      // Aura's own placeholder gray is 4.04:1 on the repainted dark field; the kit
      // token is 5.21:1 on the same surface (docs/generated/CONTRAST.MD).
      expect(ruleBodies(KIT_STYLES, /^\.dark-theme \.p-select$/).join('\n')).toContain(
        '--p-select-placeholder-color: var(--control-placeholder)',
      );
    });

    it('carries no rule for .p-dropdown-label, a class the library never emits', () => {
      // Selectors only — the comment above the rule names the class it retired.
      expect(ruleBodies(KIT_STYLES, /\.p-dropdown-label/)).toEqual([]);
    });
  });
});
