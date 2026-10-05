import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      :host {
        display: block;
      }
      .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-5);
      }

      /* --- Size scale --- */
      .scale {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin: 0 0 var(--space-4);
      }
      .scale__row {
        display: flex;
        align-items: baseline;
        gap: var(--space-4);
        flex-wrap: wrap;
        padding: var(--space-3) var(--space-4);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
      }
      .scale__row code {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-color-secondary);
        flex: 0 0 11rem;
      }
      .s-xs {
        font-size: var(--font-size-xs);
      }
      .s-sm {
        font-size: var(--font-size-sm);
      }
      .s-base {
        font-size: var(--font-size-base);
      }
      .s-lg {
        font-size: var(--font-size-lg);
      }
      .s-xl {
        font-size: var(--font-size-xl);
      }
      .s-2xl {
        font-size: var(--font-size-2xl);
      }
      .s-3xl {
        font-size: var(--font-size-3xl);
      }

      /* --- Weight ladder --- */
      .ladder {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        font-size: var(--font-size-xl);
      }
      .w-100 {
        font-weight: var(--font-weight-thin);
      }
      .w-200 {
        font-weight: var(--font-weight-extralight);
      }
      .w-300 {
        font-weight: var(--font-weight-light);
      }
      .w-400 {
        font-weight: var(--font-weight-normal);
      }
      .w-500 {
        font-weight: var(--font-weight-medium);
      }
      .w-600 {
        font-weight: var(--font-weight-semibold);
      }
      .w-700 {
        font-weight: var(--font-weight-bold);
      }
      .w-800 {
        font-weight: var(--font-weight-extrabold);
      }
      .w-900 {
        font-weight: var(--font-weight-black);
      }

      /* --- Family samples --- */
      .fams {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin: 0 0 var(--space-4);
      }
      .fam {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        padding: var(--space-3) var(--space-4);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
      }
      .fam code {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }
      .f-ui {
        font-family: var(--font-family);
        font-size: var(--font-size-lg);
      }
      .f-mono {
        font-family: var(--font-mono);
        font-size: var(--font-size-lg);
      }
      .f-serif {
        font-family: var(--font-serif);
        font-size: var(--font-size-lg);
      }
      .f-heading {
        font-family: var(--font-heading);
        font-size: var(--font-size-lg);
      }

      /* --- Leading samples --- */
      .lh {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .lh p {
        margin: 0;
        padding: var(--space-4);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
      }
      .lh--tight {
        line-height: var(--line-height-tight);
      }
      .lh--relaxed {
        line-height: var(--line-height-relaxed);
      }
      @media (max-width: 640px) {
        .lh {
          grid-template-columns: 1fr;
        }
      }

      /* --- Do / Don't --- */
      .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .dd__cell {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg, #b91c1c);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .dd__code {
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }
      .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }
      .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent);
        color: var(--semantic-red-fg, #b91c1c);
      }
      .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 16%, transparent);
        color: var(--semantic-green-fg, #15803d);
      }
      @media (max-width: 640px) {
        .dd {
          grid-template-columns: 1fr;
        }
      }

      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
      }

      .code-block {
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        overflow-x: auto;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        font-family: var(--font-mono);
        font-size: 0.82rem;
        line-height: 1.55;
        color: var(--text-color);
      }
      .table-wrap {
        overflow-x: auto;
        margin: 0 0 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th,
      td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--text-color-secondary);
        font-weight: var(--font-weight-medium);
      }
      .history strong {
        color: var(--primary-color-fg);
      }
    `;

/**
 * Guide article: Typography (foundations).
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot) — all
 * counted over the compiled global stylesheet and the sources it is built
 * from, not inherited from another guide:
 *   - The scale: $font-sizes in src/styles/design-tokens.scss has 13 steps
 *     (xs .75rem to 9xl 8rem); src/styles.scss re-declares the first 8 (xs to
 *     4xl) with identical values. In the compiled sheet 8 of the 13
 *     --font-size-* names are therefore declared twice and 5 once.
 *     $font-weights has 9 steps (100-900), 6 re-declared in styles.scss;
 *     $line-heights has 6, 5 re-declared.
 *   - Family tokens, 7 names: --font-sans, --font-serif, --font-heading,
 *     --font-display (design-tokens.scss only), --font-mono (BOTH files, with
 *     DIFFERENT values — 8 entries vs 5; styles.scss comes later and paints),
 *     --font-base and --font-family (styles.scss, identical values, both
 *     rewritten at runtime by font.service.ts as inline style on <html>).
 *     BOTH are declared STATICALLY in the compiled sheet
 *     (dist/vibecore/browser/styles-*.css: one --font-base declaration, one
 *     --font-family declaration, identical stacks), so neither depends on the
 *     runtime write to resolve at first paint. In that sheet --font-base is
 *     read by no rule and --font-family by body. The comment above the static
 *     font tokens in styles.scss and the font.service.ts header designate
 *     --font-base the authoritative token and
 *     --font-family a legacy alias — which is the convention this guide
 *     follows.
 *   - What the global sheet actually paints (re-measured 2026-09-23 over
 *     dist/vibecore/browser/styles-*.css): 14 font-family declarations (2x the
 *     openng-icons icon font, h1-h6, and 9 visual-style rules (ADR-0016) reading
 *     var(--font-heading), body reading var(--font-family), and monospace inside
 *     @media print), 30 font-size (22 rem + 8 pt, the 8 pt all in print),
 *     22 font-weight, 5 line-height (all literals; none reads a
 *     --line-height-* token), 3 text-transform, 2 font-style, 2
 *     letter-spacing (both in the blaupause style). Rules targeting html are
 *     theme classes, the four visual styles, and print; NONE sets font-size on
 *     html itself, so the root font size is unpinned. The one ELEMENT-LEVEL
 *     rule on h1-h6 / p / a / code / pre outside @media print is
 *     h1-h6 { font-family: var(--font-heading) }, which sets no size; five
 *     component-scoped rules do reach those elements and each sets a font-size (.cookie-text .cookie-title,
 *     .cookie-text p, .cookie-settings-header .cookie-settings-title, .cookie-category-header .cookie-category-title,
 *     .cookie-category-header p). No clamp()
 *     font-size. No --p-* typographic custom property.
 *   - Media blocks: @media print is the only branch that changes size or
 *     family, and the only VIEWPORT branch that changes type at all — the five
 *     max-width 768/640/600px blocks declare no typographic property. One
 *     further typographic branch exists and is not a viewport one:
 *     @media (prefers-contrast: high) sets font-weight 600 (and
 *     text-decoration-thickness) on .glossary-highlight.
 *   - Utilities: 135 .text-* rules (13 font-size + 122 color, no name
 *     collision) and 9 .font-* rules, every one a literal with !important,
 *     none reading var().
 *   - Fonts on disk: 14 stylesheets in src/assets/fonts/ (8 behind the font
 *     picker, 16 faces at 400 + 700; 6 more that only the visual styles load:
 *     Archivo 400 + 700, Nunito Sans 400 + 700, and the single-weight heading
 *     faces Archivo Black 400, Baloo 2 700, Lora 700, Rajdhani 700), 24
 *     @font-face total, every one latin subset, weight 400 or 700, font-style
 *     normal, woff2, font-display swap, and 0 of the 24 carry a unicode-range descriptor —
 *     the subsetting is in the files, not in the CSS. The compiled global
 *     sheet holds exactly one @font-face, openng-icons, at font-display block.
 *     No fonts.googleapis / fonts.gstatic reference exists in src/ or
 *     angular.json.
 *   - --font-family-mono is declared nowhere. The flashcard deck and
 *     path resolver, and the imprint page too, read --font-mono; nothing reads
 *     --font-family-mono any more.
 *     --button-font-weight, --tooltip-font-size, --code-font-family,
 *     --code-font-size, and --code-line-height are emitted and read by nothing.
 *   - app.config.ts passes Aura unmodified apart from prefix, darkModeSelector
 *     and cssLayer; theme.service.ts writes no typographic property.
 *   - Contrast figures quoted from docs/generated/CONTRAST.MD only.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-typography-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'typography'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          The kit's type is three scales and seven family names, and almost none of it is applied for you. Everything
          below is rendered from the tokens themselves, so what you see is what the current theme and the current font
          pick actually resolve to — including the places where a token names a typeface the kit never loads.
        </p>

        <h3>The size scale, rendered</h3>
        <p>
          Thirteen steps, all in <code>rem</code>. The first eight are declared twice — once by the generated scale and
          once, identically, by the hand-written sheet; the last five exist only in the generated scale. Steps above
          <code>3xl</code> are left to the table in Usage, because rendering <code>8rem</code> in a body column tells
          you nothing the number does not.
        </p>
        <div class="scale">
          <div class="scale__row">
            <code>--font-size-xs</code><span class="s-xs">Grumpy wizards make toxic brew</span>
          </div>
          <div class="scale__row">
            <code>--font-size-sm</code><span class="s-sm">Grumpy wizards make toxic brew</span>
          </div>
          <div class="scale__row">
            <code>--font-size-base</code><span class="s-base">Grumpy wizards make toxic brew</span>
          </div>
          <div class="scale__row">
            <code>--font-size-lg</code><span class="s-lg">Grumpy wizards make toxic brew</span>
          </div>
          <div class="scale__row"><code>--font-size-xl</code><span class="s-xl">Grumpy wizards make toxic</span></div>
          <div class="scale__row"><code>--font-size-2xl</code><span class="s-2xl">Grumpy wizards make</span></div>
          <div class="scale__row"><code>--font-size-3xl</code><span class="s-3xl">Grumpy wizards</span></div>
        </div>
        <p class="src-note">
          Step values from <code>$font-sizes</code> in <code>src/styles/design-tokens.scss</code>; the eight steps
          <code>xs</code> to <code>4xl</code> are re-declared with identical values in <code>src/styles.scss</code>.
        </p>

        <h3>The weight ladder</h3>
        <p>
          Nine weight tokens, 100 to 900. Whether they look like nine weights depends entirely on the font in front of
          them: every body typeface the kit can load ships two faces, 400 and 700, and the visual styles' heading faces
          ship one, so the other steps are resolved by the browser's font-matching rules rather than drawn by the
          designer. Switch the font in user settings and watch this ladder collapse.
        </p>
        <div class="ladder">
          <span class="w-100">100</span>
          <span class="w-200">200</span>
          <span class="w-300">300</span>
          <span class="w-400">400</span>
          <span class="w-500">500</span>
          <span class="w-600">600</span>
          <span class="w-700">700</span>
          <span class="w-800">800</span>
          <span class="w-900">900</span>
        </div>
        <p class="src-note">
          Weight values from <code>$font-weights</code> in <code>src/styles/design-tokens.scss</code>; face inventory
          counted over the <code>&#64;font-face</code> rules in <code>src/assets/fonts/</code>.
        </p>

        <h3>The family tokens, side by side</h3>
        <p>
          Seven family names are declared, and they are not equals. Two carry the kit's own machinery:
          <code>--font-family</code>, which <code>body</code> reads and the picker rewrites, and
          <code>--font-mono</code>. Two more lead with a typeface that has no <code>&#64;font-face</code> anywhere in
          the kit, so what you read in their row is the second or third entry of the stack, not the first. The row below
          renders <code>--font-family</code>, the name <code>body</code> reads; <code>--font-base</code> — the kit's
          authoritative name for the same thing — carries the identical value and would render identically.
        </p>
        <div class="fams">
          <div class="fam">
            <code>--font-family</code><span class="f-ui">Sphinx of black quartz, judge my vow — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-mono</code><span class="f-mono">Sphinx of black quartz, judge my vow — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-serif</code><span class="f-serif">Sphinx of black quartz, judge my vow — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-heading</code><span class="f-heading">Sphinx of black quartz, judge my vow — 0O1lI</span>
          </div>
        </div>
        <p class="src-note">
          Family token values read from the compiled global stylesheet;
          <code>--font-base</code> is additionally rewritten as inline style on the root element by
          <code>src/app/services/font.service.ts</code>.
        </p>

        <h3>The line-height scale has no rendered home</h3>
        <p>
          Six line-height tokens exist, from <code>1</code> to <code>2</code>. The kit's global stylesheet contains
          five <code>line-height</code> declarations and not one of them reads a line-height token — they are literals,
          and the only one that lands on <code>body</code> sits in the print branch. On screen, body copy therefore runs
          at the user agent's <code>normal</code> until a component says otherwise.
        </p>
        <div class="lh">
          <p class="lh--tight">
            tight (1.25) — Type is a system of ratios, and the leading is the ratio that decides whether a paragraph is
            a wall or a page.
          </p>
          <p class="lh--relaxed">
            relaxed (1.625) — Type is a system of ratios, and the leading is the ratio that decides whether a paragraph
            is a wall or a page.
          </p>
        </div>
        <p class="src-note">
          Declaration counts taken over the compiled global stylesheet; token values from
          <code>$line-heights</code> in <code>src/styles/design-tokens.scss</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Pick the token by the job, read it with <code>var()</code>, and know which of the seven family names is
          actually connected to something. The mechanics of the token layers — who overrides whom, and where an override
          must sit — belong to <strong>Design Tokens</strong>; this tab is about which typographic name to reach for.
        </p>

        <h3>The size scale</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>at a 16px root</th>
                <th>SC 1.4.3 large text?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--font-size-xs</code></td>
                <td>0.75rem</td>
                <td>12px</td>
                <td>no</td>
              </tr>
              <tr>
                <td><code>--font-size-sm</code></td>
                <td>0.875rem</td>
                <td>14px</td>
                <td>no</td>
              </tr>
              <tr>
                <td><code>--font-size-base</code></td>
                <td>1rem</td>
                <td>16px</td>
                <td>no</td>
              </tr>
              <tr>
                <td><code>--font-size-lg</code></td>
                <td>1.125rem</td>
                <td>18px</td>
                <td>no</td>
              </tr>
              <tr>
                <td><code>--font-size-xl</code></td>
                <td>1.25rem</td>
                <td>20px</td>
                <td>only at weight 700+</td>
              </tr>
              <tr>
                <td><code>--font-size-2xl</code></td>
                <td>1.5rem</td>
                <td>24px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-3xl</code></td>
                <td>1.875rem</td>
                <td>30px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-4xl</code></td>
                <td>2.25rem</td>
                <td>36px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-5xl</code></td>
                <td>3rem</td>
                <td>48px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-6xl</code></td>
                <td>3.75rem</td>
                <td>60px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-7xl</code></td>
                <td>4.5rem</td>
                <td>72px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-8xl</code></td>
                <td>6rem</td>
                <td>96px</td>
                <td>yes</td>
              </tr>
              <tr>
                <td><code>--font-size-9xl</code></td>
                <td>8rem</td>
                <td>128px</td>
                <td>yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>$font-sizes</code> in <code>src/styles/design-tokens.scss</code>; the px column assumes the
          browser default root size, which the kit never pins. The large-text column applies the WCAG 2.2 threshold
          (18pt, or 14pt bold), not a kit rule.
        </p>

        <h3>The family tokens, and what each is connected to</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Leads with</th>
                <th>Reach for it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--font-base</code></td>
                <td>the system stack</td>
                <td>
                  you need the UI font — this is the kit's authoritative name for it, and the font picker rewrites it
                </td>
              </tr>
              <tr>
                <td><code>--font-family</code></td>
                <td>the same system stack</td>
                <td>
                  the legacy alias, kept because <code>body</code> still reads it; identical value, identical runtime
                  write, so consuming it works — but a new rule should name <code>--font-base</code>
                </td>
              </tr>
              <tr>
                <td><code>--font-mono</code></td>
                <td><code>Fira Code</code></td>
                <td>
                  code, keys, IDs, tabular figures — the one monospace name; its first two entries are not shipped, so
                  it resolves further down
                </td>
              </tr>
              <tr>
                <td><code>--font-serif</code></td>
                <td><code>Georgia</code></td>
                <td>
                  a deliberate serif passage; the stack ends in the generic <code>serif</code>, so it always resolves —
                  the named entries do not: <code>Georgia</code> and <code>Cambria</code> are not resident on a stock
                  Linux
                </td>
              </tr>
              <tr>
                <td><code>--font-heading</code></td>
                <td><code>Poppins</code></td>
                <td>only with your own <code>&#64;font-face</code> for the first entry, or you get its fallback</td>
              </tr>
              <tr>
                <td><code>--font-display</code></td>
                <td><code>Poppins</code></td>
                <td>same value as <code>--font-heading</code>, same caveat</td>
              </tr>
              <tr>
                <td><code>--font-sans</code></td>
                <td><code>Inter</code></td>
                <td>
                  never for the UI font: it leads with a picker typeface that exists only after the reader selects it,
                  and it is not what the picker rewrites
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token values read from the compiled global stylesheet; the load story checked against the
          <code>&#64;font-face</code> rules in <code>src/assets/fonts/</code> and the asset globs in
          <code>angular.json</code>. Which of the two UI-font names is authoritative is the kit's own designation,
          written in the comment above the static font tokens in <code>src/styles.scss</code> and in the header of
          <code>src/app/services/font.service.ts</code>; both
          names are declared statically in the compiled sheet with the identical stack, and
          <code>src/app/services/font.service.ts</code> rewrites both, so either resolves at first paint — the choice
          between them is convention, not mechanics.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a size typed as a literal</span>
            <div class="dd__stage">
              <code class="dd__code">font-size: 14px;</code>
            </div>
            <p class="dd__why">
              A px size ignores the user's root font size, so it does not resize with the rest of the page — and it
              leaves the scale with an off-ladder value nobody can grep for.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the step, read as a token</span>
            <div class="dd__stage">
              <code class="dd__code">font-size: var(--font-size-sm);</code>
            </div>
            <p class="dd__why">
              Every step is a <code>rem</code>, so it follows the user's root size; and the name says which rung of the
              ladder you meant.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a mono stack invented at the call site</span>
            <div class="dd__stage">
              <code class="dd__code">font-family: var(--font-family-mono);</code>
            </div>
            <p class="dd__why">
              <code>--font-family-mono</code> is not a token of this kit: it is declared nowhere, so without a fallback
              the declaration is invalid at computed-value time and the element keeps the inherited UI font instead.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the one monospace token</span>
            <div class="dd__stage">
              <code class="dd__code">font-family: var(--font-mono);</code>
            </div>
            <p class="dd__why">
              One name, one stack, one place to change it — and it ends in the generic
              <code>monospace</code>, so it resolves on every platform.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a weight the face does not have</span>
            <div class="dd__stage">
              <code class="dd__code">font-weight: var(--font-weight-medium);</code>
            </div>
            <p class="dd__why">
              With a picker font active there is no 500 face, and CSS font matching resolves 500 down to 400 — so the
              emphasis you asked for renders as body text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a weight that has a face, or a second carrier</span>
            <div class="dd__stage">
              <code class="dd__code">font-weight: var(--font-weight-bold);</code>
            </div>
            <p class="dd__why">
              400 and 700 are the two weights every loadable body font in the kit actually ships; anything finer needs a
              real face, or a non-weight carrier such as color or size.
            </p>
          </div>
        </div>

        <h3>The utility classes are not tokens</h3>
        <p>
          The stylesheet generates a <code>.text-&lt;step&gt;</code> class for each of the 13 sizes and a
          <code>.font-&lt;name&gt;</code> class for each of the 9 weights. They are convenient and they are a trap: each
          one is compiled as a literal value with <code>!important</code>, not as <code>var()</code>. Overriding
          <code>--font-size-sm</code> downstream moves every rule that reads the token and leaves
          <code>.text-sm</code> exactly where it was. Note also that <code>.text-&lt;name&gt;</code> is generated twice
          over — once per size step and once per palette color — so <code>.text-sm</code> sets a size while
          <code>.text-blue-500</code> sets a color.
        </p>
        <p class="src-note">
          Counted in the compiled global stylesheet: 135 <code>.text-*</code> rules (13 sizes plus 122 palette colors,
          no name collision) and 9 <code>.font-*</code> rules, all emitted from the <code>&#64;each</code> loops at the
          foot of <code>src/styles/design-tokens.scss</code>.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The interesting fact about this kit's typography is how little of it is applied. Values are declared
          generously and consumed sparingly, and the gap between the two is where every surprise in this tab lives.
        </p>

        <h3>Where typographic values are written</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Writes</th>
                <th>Weakest to strongest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>design-tokens.scss</code></td>
                <td>
                  13 size steps, 9 weights, 6 line-heights, and 5 family names (<code>--font-sans</code>,
                  <code>--font-serif</code>, <code>--font-mono</code>, <code>--font-heading</code>,
                  <code>--font-display</code>)
                </td>
                <td>1 — the generated scales</td>
              </tr>
              <tr>
                <td><code>styles.scss</code></td>
                <td>
                  the first 8 size steps, 6 weights, 5 line-heights, plus <code>--font-base</code>,
                  <code>--font-family</code> and a second <code>--font-mono</code>
                </td>
                <td>2 — same names, later in the sheet</td>
              </tr>
              <tr>
                <td>the <code>--p-*</code> namespace</td>
                <td>nothing typographic that this kit declares</td>
                <td>3 — the preset layer; <strong>Design Tokens</strong> has the mechanism</td>
              </tr>
              <tr>
                <td><code>font.service.ts</code></td>
                <td>
                  <code>--font-base</code>, <code>--font-family</code> and the active style's
                  <code>--font-heading</code>, as inline style on the root element
                </td>
                <td>4 — unbeatable by a selector</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Names counted in the compiled global stylesheet; the runtime write read from
          <code>src/app/services/font.service.ts</code>. The color runtime layer,
          <code>src/app/services/theme.service.ts</code>, writes no typographic property itself: it hands the visual
          style's fonts to <code>applyStyleFonts</code> in the font service. How the four layers interact in general is <strong>Design Tokens</strong>, which owns the cascade.
        </p>

        <h3>The same name, two values: <code>--font-mono</code></h3>
        <p>
          <code>--font-mono</code> is the one typographic token declared in both stylesheets with
          <em>different</em> content. The generated scale gives it eight entries; the hand-written sheet gives it five,
          dropping <code>Menlo</code>, <code>Monaco</code> and <code>Liberation Mono</code>. The hand-written sheet is
          later at equal specificity, so the five-entry stack is the one that paints and the eight-entry one never
          reaches a screen. Both begin with <code>Fira Code</code> and <code>JetBrains Mono</code>, and the kit ships an
          <code>&#64;font-face</code> for neither, so in practice code renders in the first OS-resident entry.
        </p>
        <p class="src-note">
          Both declarations read from the compiled global stylesheet, in source order; the face inventory from
          <code>src/assets/fonts/</code>, which holds no monospace family.
        </p>

        <h3>What the global stylesheet actually paints</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Declarations</th>
                <th>Where</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>font-family</code></td>
                <td>14</td>
                <td>
                  twice for the icon font, once on <code>body</code> reading <code>var(--font-family)</code>, once on
                  <code>h1</code>–<code>h6</code> and nine times in the visual styles reading
                  <code>var(--font-heading)</code>, once as <code>monospace</code> in the print branch
                </td>
              </tr>
              <tr>
                <td><code>font-size</code></td>
                <td>30</td>
                <td>
                  22 in <code>rem</code>, 8 in <code>pt</code> — and all eight <code>pt</code> ones are in the print
                  branch
                </td>
              </tr>
              <tr>
                <td><code>font-weight</code></td>
                <td>22</td>
                <td>utilities, component rules, and the visual styles; none on a prose element</td>
              </tr>
              <tr>
                <td><code>line-height</code></td>
                <td>5</td>
                <td>
                  all literals; none reads a <code>--line-height-*</code> token, and the only one on
                  <code>body</code> is in the print branch
                </td>
              </tr>
              <tr>
                <td><code>letter-spacing</code></td>
                <td>2</td>
                <td>
                  both in the blaupause visual style (its buttons and the site title); the kit has no token for it
                </td>
              </tr>
              <tr>
                <td><code>html &#123; font-size &#125;</code></td>
                <td>0</td>
                <td>
                  no rule sets <code>font-size</code> on <code>html</code>. The rules that start at <code>html</code>
                  — theme classes, the four visual styles, the print branch — style descendants or color, and none of
                  them touches the root size, so it stays whatever the user set
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Counted over the compiled global stylesheet, custom-property definitions excluded from the declaration counts.
        </p>

        <h3>Headings come from the user agent</h3>
        <p>
          Outside the print branch the kit's global stylesheet has one <em>element-level</em> rule for
          <code>h1</code>–<code>h6</code>, <code>p</code>, <code>a</code>, <code>code</code> or <code>pre</code>:
          <code>h1</code>–<code>h6</code> read <code>var(--font-heading)</code> as their family, and nothing else —
          no size, no weight, no margin. Every other bare-element selector on those names sits inside
          <code>&#64;media print</code>. Five rules do reach them, and every one is scoped to a component:
          <code>.cookie-text .cookie-title</code>, <code>.cookie-text p</code>,
          <code>.cookie-settings-header .cookie-settings-title</code>, <code>.cookie-category-header .cookie-category-title</code>
          and <code>.cookie-category-header p</code>, each setting a literal <code>font-size</code> and two of them a
          literal <code>line-height</code>. Inside those components a heading is therefore not browser default;
          everywhere else its size is, because the only typographic things the sheet does to prose globally are a family
          on <code>body</code> and a family on the headings. Heading sizes, heading margins, the monospace default
          inside <code>code</code>, the underline on a link — every one of those is the user-agent stylesheet, which
          HTML's rendering section specifies (<code>h1</code> at <code>2em</code> down to <code>h6</code> at
          <code>0.67em</code>, with an <code>h1</code> nested in sectioning content stepped down further). Consequence
          for the caller: a heading rendered outside a component that styles headings is not "unstyled kit default", it
          is browser default, and it will not follow the size scale unless you make it.
        </p>
        <p class="src-note">
          Selectors enumerated over the compiled global stylesheet: every rule whose selector ends on one of those
          element names, bare or scoped, with its at-rule context resolved.
        </p>

        <h3>Narrow screens: the type does not move</h3>
        <p>
          <strong>The kit has no responsive typography.</strong> The compiled global stylesheet contains five viewport
          media blocks — two at <code>max-width: 768px</code>, two at <code>600px</code>, one at <code>640px</code> —
          and not one of them declares <code>font-size</code>, <code>font-weight</code>, <code>line-height</code> or
          <code>font-family</code>; they change padding, layout direction, and button width only. There is no
          <code>clamp()</code> font size in the sheet and no fluid scale to inherit. The only branch that changes size
          or family is <code>&#64;media print</code>, which switches to a <code>pt</code> ladder and sets a line-height
          on <code>body</code> (printing from dark mode, <code>ThemeService</code> also switches to the light variant,
          so the type lands on light paper). It is not the only typographic branch, though — it is the only <em>viewport</em> one:
          <code>&#64;media (prefers-contrast: high)</code> raises <code>.glossary-highlight</code> to
          <code>font-weight: 600</code>, which is a preference query, not a width query, and changes weight rather than
          size. What the caller must do: if a heading has to shrink on a phone, declare that in your own component
          stylesheet and pick the smaller step from the same scale — and rely on the fact that every step is a
          <code>rem</code>, so the whole page already scales with the reader's own font-size setting (WCAG SC 1.4.4)
          without a media query at all.
        </p>
        <p class="src-note">
          Media blocks and their declarations enumerated in the compiled global stylesheet, preference queries included;
          the absence of any <code>font-size</code> on <code>html</code> verified in the same pass.
        </p>

        <h3>Large text is a size question the token gate cannot ask</h3>
        <p>
          WCAG's contrast minimum has a lower bar for large text — 3:1 instead of 4.5:1 — and large means 18pt, or 14pt
          bold. Against the kit's scale that threshold falls between
          <code>--font-size-xl</code> and <code>--font-size-2xl</code>: 24px and up qualifies outright, 20px qualifies
          only at weight 700 or heavier. The contrast compilat cannot know any of that, because it measures color
          tokens and a token has no size, so every text pair in it is judged at 4.5:1. That is the strict reading and it
          is the right default; the pairing rules themselves are <strong>Color System</strong>'s ground. The text colors
          belong to the active visual style, so a ratio is quoted per style and mode. Two figures for orientation:
          <code>--text-color</code> on <code>--surface-card</code> is 18.73:1 in light and 14.86:1 in dark under the
          werkbund style, and the tightest body-text row over all four styles is
          <code>--text-color-secondary</code> on <code>--surface-hover</code> at 4.55:1 (blaupause, light) — SC 1.4.3
          needs 4.5:1.
        </p>
        <p class="src-note">
          Ratios quoted from <code>docs/generated/CONTRAST.MD</code>, group "body text", which
          <code>scripts/check-contrast.mjs</code> regenerates from the style values in
          <code>src/app/services/ui-styles.ts</code>; the size threshold is the WCAG 2.2 definition of large-scale text,
          not a kit value.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Three things a task on this ground usually needs: a new step in a scale, a change to the font the user sees,
          and a way to tell a live token from a dead one.
        </p>

        <h3>Adding a step to a scale</h3>
        <p>
          The scales are Sass maps, and each map drives both a custom property and a utility class. Adding a key gives
          you both; it does not give you a consumer.
        </p>
        <pre class="code-block"><code>{{ addStepSnippet }}</code></pre>

        <h3>Changing the UI font at runtime</h3>
        <p>
          The font picker is a service, not a stylesheet. It writes the chosen stack as inline style on the root
          element, which is the strongest layer in the cascade — so a component that hardcodes its own
          <code>font-family</code> silently opts out of the user's choice, including out of the dyslexia-friendly font.
        </p>
        <pre class="code-block"><code>{{ runtimeSnippet }}</code></pre>

        <h3>The names that look like hooks and are not</h3>
        <p>
          Five typographic custom properties are emitted into <code>:root</code> that no rule in the kit reads:
          <code>--button-font-weight</code>, <code>--tooltip-font-size</code>, <code>--code-font-family</code>,
          <code>--code-font-size</code> and <code>--code-line-height</code>. They read like component hooks, but the
          components they name are Optimus UI components, and Optimus UI reads the <code>--p-*</code> namespace instead — of
          which the kit's own stylesheet declares no typographic member. Setting one of them changes nothing. A sixth
          name, <code>--font-family-mono</code>, is the mirror image: declared nowhere, so a reader only ever gets its
          own fallback. Since 2026-09-23 no kit file reads it: the flashcard deck, the path resolver and the imprint
          page all read <code>--font-mono</code>.
        </p>
        <p class="src-note">
          The five names read from the component-token map in
          <code>src/styles/design-tokens.scss</code> and confirmed present in the compiled global stylesheet; the
          absence of any <code>--p-*</code> typographic declaration and of <code>--font-family-mono</code> established
          in the same sheet. The preset adds none either: <code>src/app/app.config.ts</code> boots on Aura, and
          <code>src/app/services/theme.service.ts</code> replaces it with the visual style's delta (radii and dark button
          colors) plus the accent ramp — no typographic token in either.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>Every size, weight, and leading in the diff reads a token; no bare <code>px</code> font size survives.</li>
          <li>
            Monospace is <code>var(--font-mono)</code> — not a hand-written stack, not <code>--font-family-mono</code>.
          </li>
          <li>No new rule sets <code>font-family</code> on a prose element; the UI font stays the user's choice.</li>
          <li>Any weight other than 400 or 700 is either backed by a real face or paired with a second carrier.</li>
          <li>
            Nothing pins <code>html &#123; font-size &#125;</code>, and no new size is expressed in <code>px</code> or
            <code>pt</code> outside the print branch.
          </li>
          <li>
            If type changes at a breakpoint, the change lives in the component's own stylesheet and lands on a step of
            the scale.
          </li>
          <li>
            New text color pairs are measured — run <code>node scripts/check-contrast.mjs</code> and quote the row.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Token values are never translated, and <strong>Design Tokens</strong> already states why writing direction
          belongs in the property rather than the value. What belongs here is the thing that only typography can answer:
          which scripts this kit's font stack can actually render, and with whose files.
        </p>

        <h3>The default stack, entry by entry</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Entries</th>
                <th>Shipped by the kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1–6</td>
                <td>
                  <code>-apple-system</code>, <code>BlinkMacSystemFont</code>, <code>Segoe UI</code>,
                  <code>Roboto</code>, <code>Helvetica</code>, <code>Arial</code>
                </td>
                <td>no — OS-resident by design, which is why the first paint fetches no font</td>
              </tr>
              <tr>
                <td>7–10</td>
                <td>
                  <code>Noto Sans KR</code>, <code>Noto Sans Devanagari</code>, <code>Noto Sans Bengali</code>,
                  <code>Noto Sans Gurmukhi</code>
                </td>
                <td>
                  no — named for Hangul and three Indic scripts, but the kit declares no <code>&#64;font-face</code> for
                  any Noto family
                </td>
              </tr>
              <tr>
                <td>11</td>
                <td><code>sans-serif</code></td>
                <td>the generic, always resolvable</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The consequence is worth stating plainly: the four Noto entries are a
          <em>request</em>, not a guarantee. They render when the reader's operating system happens to have those
          families installed, and fall through to <code>sans-serif</code> when it does not. Nothing in the kit downloads
          them — no stylesheet, asset glob, or markup in the kit points at an external font host at all. If your locales
          need one of those scripts guaranteed, ship its files the way the picker fonts are shipped and add an
          <code>&#64;font-face</code>; extending the stack alone does not add coverage.
        </p>
        <p class="src-note">
          Stack read from <code>--font-family</code> in the compiled global stylesheet and from
          <code>SYSTEM_STACK</code> in <code>src/app/services/font.service.ts</code>; the absence of any webfont-host
          reference and of a Noto <code>&#64;font-face</code> established over <code>src/</code> and
          <code>angular.json</code>.
        </p>

        <h3>What the kit does load</h3>
        <p>
          Fourteen stylesheets in <code>src/assets/fonts/</code>, each injected as a <code>&lt;link&gt;</code> only when
          it is needed: eight typefaces behind the font picker, loaded when the reader selects one, and six more that
          only a visual style asks for — its body face, or a heading face that ships a single weight. Twenty-four
          <code>&#64;font-face</code> rules in total, and they are uniform: Latin subset only, weight 400 or 700, upright
          only, <code>woff2</code> only, <code>font-display: swap</code>. Note where the subsetting lives: not one of the
          twenty-four carries a
          <code>unicode-range</code> descriptor. The Latin restriction is baked into the <code>woff2</code> files
          themselves, so the browser falls past a picked font on missing glyph coverage rather than on a declared range
          — the practical effect is the same, but nothing in the CSS states the boundary. Three consequences once one of
          them is active. Italic is synthesized by the browser, because no italic face exists. Weight 500 and 600 have
          no face either, so CSS font matching resolves 500 down to 400 and 600 up to 700. And a selected font covers
          Latin only — every non-Latin run in the page falls past it into the fallback chain above, which is why the
          picked family is listed first and the system stack behind it rather than instead of it.
        </p>
        <p class="src-note">
          Counted over the fourteen stylesheets in <code>src/assets/fonts/</code> — 24 <code>&#64;font-face</code>
          rules, 0 <code>unicode-range</code> descriptors; the style fonts are the <code>fonts</code> entries in
          <code>src/app/services/ui-styles.ts</code>; the files come from the <code>&#64;fontsource</code> packages copied
          by the asset globs in <code>angular.json</code> (<code>&#64;fontsource/inter</code> 5.3.0 and siblings,
          <code>&#64;fontsource/opendyslexic</code> 5.2.5). The only <code>&#64;font-face</code> in the global
          stylesheet itself is the icon font, at <code>font-display: block</code>.
        </p>

        <h3>The dyslexia font has a script gate</h3>
        <p>
          The readable-font toggle maps to OpenDyslexic, whose Latin-only files cannot render Bengali, Devanagari,
          Gurmukhi, or Hangul. The font service exposes that as a query rather than letting the toggle produce tofu: it
          reports the readable font unsupported for those languages, stripping an Easy-Language suffix first so a
          variant follows its base script. Cyrillic and Greek stay enabled, being partially covered. Any locale you add
          whose primary script is unsupported has to join that set — the toggle does not infer coverage from the font
          files.
        </p>
        <p class="src-note">
          Behavior read from <code>supportsReadableFont</code> and its unsupported-language set in
          <code>src/app/services/font.service.ts</code>.
        </p>

        <h3>Length and direction</h3>
        <p>
          German compounds run long and the scale does not absorb that — a step is a size, not a budget. Size text
          containers from their content, and let the step set the rhythm around them. Direction is the same story one
          layer down and is covered in
          <strong>Design Tokens</strong>: no typographic token is direction-aware, so applying spacing through logical
          properties keeps this layer from being the obstacle to a right-to-left script. It does not make the kit
          right-to-left — nothing here writes <code>dir</code> and no <code>rtl</code> rule ships, so the direction
          never flips in the first place. That boundary belongs to <strong>Accessibility Guidelines</strong>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the flashcard deck and path
            resolver read <code>--font-mono</code> now, and so does the imprint page, so no kit file reads
            <code>--font-family-mono</code> any more; print in dark mode is light paper, switched by
            <code>ThemeService</code>.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Contrast figures follow the visual styles (werkbund body text, the
            tightest secondary-text row over all four styles); the face inventory counts the six style-only stylesheets
            (14 files, 24 faces, single-weight heading faces); the preset note names the style delta and accent ramp;
            <code>src/</code> line pins replaced by named locations; five global <code>line-height</code> declarations.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Declaration counts re-measured over the compiled global stylesheet
            after the four visual styles and the removal of the dead global popover styles: 14 <code>font-family</code>,
            30 <code>font-size</code>, 22 <code>font-weight</code>, 5 <code>line-height</code>, 2
            <code>letter-spacing</code>; <code>h1</code>–<code>h6</code> now carry a family rule outside print; five
            component-scoped rules reach prose elements, five viewport media blocks; the icon font is openng-icons. The
            <code>--font-base</code> comment pin moved to <code>styles.scss:359–360</code>, its declaration to
            <code>:516</code>.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-24 — Re-verified on &#64;openng/optimus-ui-themes 3.0.0: the five inert
            component-hook names are still emitted and read by nothing, the kit still declares no typographic
            <code>--p-*</code> member, and the contrast figures carry — Themes 3.0 changed no color values. The
            <code>--font-base</code> declaration moved to <code>styles.scss:451</code>; provenance pin raised.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-18 — The direction paragraph carried the claim already withdrawn from
            <strong>Design Tokens</strong>: direction-neutral tokens remove one obstacle, they do not make the kit
            right-to-left. Corrected to the measured state — no <code>dir</code> is written and no <code>rtl</code> rule
            ships — and pointed at the guide that holds the boundary.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-18 — Review pass. Two negations narrowed to what was actually counted: the
            missing prose rules are missing at element level only, and <code>html</code> is targeted by five rules of
            which none sets <code>font-size</code>. <code>&#64;media print</code> is now called the only
            <em>viewport</em> typographic branch, with <code>&#64;media (prefers-contrast: high)</code> named beside it.
            The UI-font recommendation follows the kit's own designation: <code>--font-base</code> authoritative,
            <code>--font-family</code> the legacy alias.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-18 — Initial guide: the three scales and the seven family names measured at
            their source, the two divergent monospace stacks, what the global stylesheet actually paints, the absence of
            responsive type, the Latin-only face inventory behind the font picker, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TypographyArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly addStepSnippet: string = `// src/styles/design-tokens.scss — the map IS the scale.
$font-sizes: (
  'xs': 0.75rem,
  // ... existing steps ...
  '10xl': 10rem      // new step
);

/* Adding the key emits two things at once:
     --font-size-10xl: 10rem;          into :root
     .text-10xl { font-size: 10rem !important; }   as a utility

   The utility is a LITERAL, not var(--font-size-10xl). A downstream
   project that re-declares the custom property moves every rule that
   reads it and does not move the class. */

/* styles.scss re-declares the first eight steps with identical values
   and comes later in the sheet, so it wins for those names. Add a step
   there only when you intend it to differ from the generated scale —
   which is how --font-mono ended up with two different stacks. */`;

  readonly runtimeSnippet: string = `// The picker writes BOTH names as inline style on <html>.
// Inline style is the strongest layer: no selector out-specifies it.
fontService.setFont('atkinson-hyperlegible');
//   --font-base:   'Atkinson Hyperlegible', <system stack>
//   --font-family: 'Atkinson Hyperlegible', <system stack>
// The stylesheet's @font-face link is injected on first use; the
// system default fetches nothing at all.

/* Read the UI font, never re-declare it. */
.panel { font-family: var(--font-base); }     /* follows the picker */
.panel { font-family: 'Inter', sans-serif; }  /* opts the user out */

/* Which of the two names to read is convention, not mechanics: both are
   declared statically in the compiled sheet with the identical stack and
   both are rewritten above, so either resolves at first paint. The kit
   designates --font-base authoritative and --font-family the legacy
   alias body still reads (styles.scss :root comment, font.service.ts
   header) —
   so name --font-base in a new rule. */`;
}
