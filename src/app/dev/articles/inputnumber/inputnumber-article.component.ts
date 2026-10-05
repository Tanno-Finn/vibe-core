import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [FormsModule, InputNumberModule, InputTextModule, GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      .lead {
        margin: 0 0 var(--space-5);
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--text-color-secondary);
      }
      h3 {
        margin: var(--space-6) 0 var(--space-3);
        font-size: 1.05rem;
      }
      p {
        line-height: 1.65;
      }

      .stage {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        padding: var(--space-4);
        background: var(--surface-section);
        border-radius: var(--radius-md);
        margin: 0 0 var(--space-3);
      }
      .stage__item {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
        flex: 1 1 14rem;
        max-width: 22rem;
      }
      .stage__item > label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }
      .stage__item p-inputnumber {
        width: 100%;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }
      .field-error {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--red-600);
      }
      .field-error i {
        margin-top: 0.15em;
        font-size: 0.85rem;
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
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .dd__stage--stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .dd__stage label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }
      .dd__stage p-inputnumber,
      .dd__stage input {
        width: 100%;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
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

      .sources {
        padding-left: 1.1rem;
      }
      .sources li {
        margin: 0 0 var(--space-3);
        line-height: 1.6;
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
      .src-note {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-4);
      }
      .history strong {
        color: var(--primary-color-fg);
      }
    `;

/**
 * Guide article: InputNumber (Optimus UI).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs (guide-authoring: "Provenance, not process"):
 *   - @openng/optimus-ui@2.0.2 shipped source (openng-optimus-ui-inputnumber.mjs):
 *     InputNumber extends BaseInput :127; selector aliases :1261/:1427;
 *     defaults mode 'decimal' :246, useGrouping true :261, allowEmpty true
 *     :231, showButtons false :140, buttonLayout 'stacked' :150, locale
 *     undefined :236 — all plain v21 @Input properties, not input signals;
 *     the spinbutton input with aria-value* :1272-1274 and inputmode="decimal"
 *     :1294; spin buttons tabindex="-1" + aria-hidden="true";
 *     Intl.NumberFormat construction and per-locale numerals :428-429;
 *     ArrowUp/Down spin :673-679; the truthiness-guarded Home/End :793-803;
 *     onInput emit :1073; the keypress filter (onInputKeyPress :810).
 *   - Aura 2.x token file @openng/optimus-ui-themes/dist/aura/inputnumber/index.mjs:
 *     root carries only a transition; the button block (2.5rem width,
 *     transparent background, surface.400 icon color) with light/dark under a
 *     colorScheme block, not light-dark(). Field visuals come from the inner
 *     pInputText reading the formField block. The kit's `.p-inputnumber` rule
 *     (styles.scss) re-points the button edge to --control-border and the icon
 *     to --text-color-secondary, gated in CONTRAST.MD ("form field edge").
 *   - Kit corpus: the slider guide's paired slider-plus-number example is the
 *     one live p-inputnumber this workshop shipped before this guide; its
 *     boundary table routes precise entry here.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-inputnumber-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'inputnumber'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Everything below is one component in different dress. Type into any field — letters are swallowed silently,
          arrows spin by the step, and what you see is
          <code>Intl.NumberFormat</code> rendering the model for a locale.
        </p>

        <h3>One value, two locales</h3>
        <p>
          Both fields share one model. The separators — and which key acts as the decimal sign — belong to the locale,
          not to the component.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <label for="in-de">German formatting (de-DE)</label>
            <p-inputnumber
              inputId="in-de"
              locale="de-DE"
              [minFractionDigits]="1"
              [maxFractionDigits]="2"
              [ngModel]="shared()"
              (ngModelChange)="shared.set($event)"
              name="in-de"
            />
          </div>
          <div class="stage__item">
            <label for="in-en">English formatting (en-US)</label>
            <p-inputnumber
              inputId="in-en"
              locale="en-US"
              [minFractionDigits]="1"
              [maxFractionDigits]="2"
              [ngModel]="shared()"
              (ngModelChange)="shared.set($event)"
              name="in-en"
            />
          </div>
        </div>
        <p class="src-note">
          The formatter and its per-locale numerals are built in the shipped source
          (<code>openng-optimus-ui-inputnumber.mjs:428-429</code>). With no <code>locale</code> set the runtime's own locale wins
          (<code>:236</code>) — in the app, bind the kit's <code>currentIntlLocale</code> so the digits follow the page
          language.
        </p>

        <h3>Currency, and the spin buttons</h3>
        <div class="stage stage--row">
          <div class="stage__item">
            <label for="in-eur">Amount (EUR, de-DE)</label>
            <p-inputnumber
              inputId="in-eur"
              mode="currency"
              currency="EUR"
              locale="de-DE"
              [min]="0"
              [max]="10000"
              [step]="10"
              [ngModel]="amount()"
              (ngModelChange)="amount.set($event)"
              name="in-eur"
            />
          </div>
          <div class="stage__item">
            <label for="in-stacked">Stacked buttons (default layout)</label>
            <p-inputnumber
              inputId="in-stacked"
              [showButtons]="true"
              [min]="0"
              [max]="100"
              [ngModel]="qty()"
              (ngModelChange)="qty.set($event)"
              name="in-stacked"
            />
          </div>
          <div class="stage__item">
            <label for="in-horizontal">Horizontal buttons</label>
            <p-inputnumber
              inputId="in-horizontal"
              [showButtons]="true"
              buttonLayout="horizontal"
              [min]="0"
              [max]="100"
              [ngModel]="qty()"
              (ngModelChange)="qty.set($event)"
              name="in-horizontal"
            />
          </div>
        </div>
        <p class="src-note">
          The buttons are pointer-only decoration — <code>tabindex="-1"</code> and <code>aria-hidden="true"</code> in
          the shipped template; Tab lands on the input, where ArrowUp/ArrowDown spin by the step
          (<code>:673-679</code>).
        </p>

        <h3>The invalid state</h3>
        <div class="stage">
          <div class="stage__item">
            <label for="in-invalid">Participants (1–30)</label>
            <p-inputnumber
              inputId="in-invalid"
              [min]="0"
              [max]="99"
              [invalid]="outOfRange()"
              [ariaDescribedBy]="outOfRange() ? 'in-invalid-error' : 'in-invalid-hint'"
              [ngModel]="participants()"
              (ngModelChange)="participants.set($event)"
              name="in-invalid"
            />
            <small class="hint" id="in-invalid-hint">Between 1 and 30.</small>
            @if (outOfRange()) {
              <small class="field-error" id="in-invalid-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Enter a number between 1 and 30.
              </small>
            }
          </div>
        </div>
        <p class="src-note">
          <code>invalid</code> is the inherited manual boolean (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>) and —
          unlike the checkbox — this component has a real <code>ariaDescribedBy</code> input, so the error text is the
          field's description. No <code>aria-invalid</code> is bound anywhere in
          <code>openng-optimus-ui-inputnumber.mjs</code>, and in every visual style the <code>[invalid]</code> border
          tint is overridden (Design tab), so the visible, described message is what carries the state. Timing gates for
          real forms are the <strong>Forms</strong> guide's ground; this demo validates directly.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The one decision that precedes every prop: is this value arithmetic? A quantity is; an identifier only looks
          like one. Then the wiring is the field pattern with three numeric extras.
        </p>

        <h3>The wiring</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <ul>
          <li>
            <code>min</code>/<code>max</code>/<code>step</code> are mirrored into both the native attributes and
            <code>aria-valuemin</code>/<code>max</code> — one source, two exposures.
          </li>
          <li>
            The model updates on every keystroke; <code>onInput</code> carries <code>value</code> and
            <code>formattedValue</code>. <strong>There is no <code>onChange</code></strong> — validate from the model,
            as with every field.
          </li>
          <li>
            <code>suffix</code> and <code>prefix</code> render inside the field — hand them translated keys, never
            concatenate a unit into the value yourself.
          </li>
        </ul>

        <h3>The boundary</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The need</th>
                <th>Reach for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>An exact quantity, threshold, or amount</td>
                <td><code>p-inputnumber</code></td>
              </tr>
              <tr>
                <td>Coarse, continuous adjustment by feel</td>
                <td><code>p-slider</code> — precise entry pairs both on one model</td>
              </tr>
              <tr>
                <td>One of a few discrete values</td>
                <td><code>p-select</code> / <code>p-selectbutton</code></td>
              </tr>
              <tr>
                <td>Digit-shaped text: IDs, phone, postal codes</td>
                <td><code>pInputText</code> + <code>inputmode</code> (<strong>Text Inputs</strong>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The slider pairing and its boundary live in the slider guide's decision table; the digit-shaped-text rule is
          <strong>Text Inputs</strong>' ground. Both are quoted, not re-derived.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an identifier in a number field</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-plz-bad">Postal code</label>
              <p-inputnumber
                inputId="in-dd-plz-bad"
                [ngModel]="plzBad()"
                (ngModelChange)="plzBad.set($event)"
                name="in-dd-plz-bad"
              />
            </div>
            <p class="dd__why">
              The reader entered the Dresden code 01099: the leading zero is gone and a grouping separator split what
              was never a quantity — arithmetic formatting applied to text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — digit-shaped text stays text</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-plz-good">Postal code</label>
              <input
                pInputText
                id="in-dd-plz-good"
                type="text"
                inputmode="numeric"
                autocomplete="postal-code"
                [ngModel]="plzGood()"
                (ngModelChange)="plzGood.set($event)"
                name="in-dd-plz-good"
              />
            </div>
            <p class="dd__why">
              A text input with <code>inputmode="numeric"</code>: the mobile keyboard still shows digits, the zero and
              the exact string survive, and <code>autocomplete</code> can do its work.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — constraints only the keypress filter knows</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-silent">Batch size</label>
              <p-inputnumber
                inputId="in-dd-silent"
                [min]="1"
                [max]="30"
                [ngModel]="silent()"
                (ngModelChange)="silent.set($event)"
                name="in-dd-silent"
              />
            </div>
            <p class="dd__why">
              Letters vanish without a sound and nothing names the 1–30 range — the reader learns the rules by failing
              against them.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a visible hint, wired to the field</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-hinted">Batch size</label>
              <p-inputnumber
                inputId="in-dd-hinted"
                [min]="1"
                [max]="30"
                [ariaDescribedBy]="'in-dd-hinted-hint'"
                [ngModel]="hinted()"
                (ngModelChange)="hinted.set($event)"
                name="in-dd-hinted"
              />
              <small class="hint" id="in-dd-hinted-hint">Whole number between 1 and 30.</small>
            </div>
            <p class="dd__why">
              The range is stated where the field is and read with it via
              <code>ariaDescribedBy</code> — the silent filter becomes a convenience instead of the only teacher.
            </p>
          </div>
        </div>

        <h3>Sources, annotated</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Spinbutton pattern</a
            >
            — the keyboard contract: arrows spin, Home/End jump to the bounds.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — aria-valuenow</a
            >
            — the value a spinbutton must expose while it changes.
          </li>
          <li>
            <a href="https://tc39.es/ecma402/#numberformat-objects" target="_blank" rel="noopener noreferrer"
              >ECMA-402 — Intl.NumberFormat</a
            >
            — locale resolution, the fraction-digit defaults, and why currency mode requires a currency code.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode"
              target="_blank"
              rel="noopener noreferrer"
              >HTML Living Standard — inputmode</a
            >
            — digit keyboards without <code>type="number"</code>, for the values that are not numbers.
          </li>
          <li>
            <a href="https://primeng.org/inputnumber" target="_blank" rel="noopener noreferrer"
              >PrimeNG — InputNumber</a
            >
            — upstream API docs for the v21 line Optimus UI forks; every claim here re-verified against the shipped
            Optimus UI 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The component's own token file is almost empty: the field is a
          <code>pInputText</code> underneath and takes every visual from the formField block. What the file does define
          is the button column.
        </p>

        <h3>The button token block</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>button width</td>
                <td>{{ m.btnWidth }}</td>
              </tr>
              <tr>
                <td>button background</td>
                <td>{{ m.btnBg }}</td>
              </tr>
              <tr>
                <td>hover / active background</td>
                <td>{{ m.btnHover }}</td>
              </tr>
              <tr>
                <td>icon color</td>
                <td>{{ m.btnColor }}</td>
              </tr>
              <tr>
                <td>border color</td>
                <td>{{ m.btnBorder }}</td>
              </tr>
              <tr>
                <td>root (whole component)</td>
                <td>{{ m.rootOnly }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputnumber/index.mjs</code> (Aura 2.x), with the kit's
          <code>.p-inputnumber</code> rule in <code>styles.scss</code> on top: Aura's surface.400 icon (2.56:1 on white)
          and stock button edge are replaced by gated kit tokens — icon 4.79&#8211;7.78:1, edge 3.25&#8211;5.51:1
          (<code>docs/generated/CONTRAST.MD</code>, "form field edge", the <code>inputnumber.button</code> rows). The
          buttons stay <code>aria-hidden</code>; the accessible interaction never depends on seeing them.
        </p>

        <h3>What the kit and the visual styles do to the field</h3>
        <p>
          The inner field is an <code>&lt;input pInputText&gt;</code>, so every kit and style rule for
          <code>.p-inputtext</code> in <code>styles.scss</code> reaches it; the button column has its own
          <code>.p-inputnumber</code> rule (above):
        </p>
        <ul>
          <li>
            <strong>Focus</strong>: the kit's 2px <code>--primary-color-fg</code> ring
            (<code>.p-inputtext:focus-visible</code>) in both modes, on top of Aura's
            <code>&#123;primary.color&#125;</code> border tint.
          </li>
          <li>
            <strong>Dark mode</strong>: the field takes the kit's element tokens (<code>--surface-section</code> fill,
            <code>--control-placeholder</code>); the transparent buttons show the container behind them.
          </li>
          <li>
            <strong>Border</strong>: each visual style's <code>input.p-inputtext</code> rule sets the field's border color
            to the style outline (and a heavier width in three styles) — 3.25&#8211;18.73:1 across the styles, gated in
            <code>docs/generated/CONTRAST.MD</code> ("form field edge", the <code>inputtext</code> rows). The buttons take
            the kit's 1px <code>--control-border</code> (gated, see above), so with <code>showButtons</code> the field
            and its button column carry different edges in the styles whose outline is not
            <code>--control-border</code>; both pass SC 1.4.11.
          </li>
          <li>
            <strong>Invalid</strong>: the style rule outranks <code>.p-invalid</code>, so the kit adds
            <code>input.p-inputtext.p-invalid</code> (<code>--semantic-red-fg</code>, <code>!important</code>):
            <code>[invalid]</code> alone draws the red edge in every style, as does Angular's
            <code>p-inputnumber.ng-invalid.ng-dirty &gt; .p-inputtext</code>
            (<code>openng-optimus-ui-inputnumber.mjs:23-27</code>). The edge is color only — carry the state in text.
          </li>
        </ul>
        <p class="src-note">
          Derived from the selectors in <code>styles.scss</code> (the <code>.dark-theme .p-inputtext</code>, focus,
          invalid, and <code>html.style-*</code> rules) against <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> and the
          component's own rule block; verify in your build by reading the input's computed <code>border-color</code> with
          <code>[invalid]</code> set on a pristine field.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior: the field keeps the width you give it, so give it the kit's
          full-width-in-column treatment like every input. The stacked button column costs a fixed 2.5rem of that
          width; horizontal layout costs it twice, left and right — in tight columns leave <code>showButtons</code> off,
          the keyboard already spins.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          One inheritance chain explains the API: <code>InputNumber extends BaseInput</code>, so the form contract, the
          constraint mirrors and the sizing props all arrive from the base — what is local is the formatter and the spin
          machinery.
        </p>

        <h3>Keyboard map — and its one gap</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ArrowUp / ArrowDown</td>
                <td>spin by ±<code>step</code> (default 1), clamped to the bounds</td>
              </tr>
              <tr>
                <td>Home / End</td>
                <td>
                  jump to <code>min</code> / <code>max</code> — <strong>skipped when the bound is 0</strong> (truthiness
                  check)
                </td>
              </tr>
              <tr>
                <td>digits, decimal, minus</td>
                <td>accepted per the active locale's numerals</td>
              </tr>
              <tr>
                <td>anything else printable</td>
                <td>swallowed silently</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Spin at <code>openng-optimus-ui-inputnumber.mjs:673-679</code>; the guarded Home/End at <code>:793-803</code> —
          <code>if (this.min())</code> is false for a zero bound, so Home stays inert on a 0-floored range while
          ArrowDown still stops there.
        </p>

        <h3>Event flow</h3>
        <pre class="code-block"><code>{{ eventSnippet }}</code></pre>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>☐ <code>[locale]</code> bound to the kit's <code>currentIntlLocale</code>.</li>
          <li>
            ☐ <code>label[for]</code>/<code>inputId</code> wired; hints and errors through <code>ariaDescribedBy</code>.
          </li>
          <li>☐ Range and step stated in a visible hint where they constrain input.</li>
          <li>☐ Value is arithmetic — identifiers went to a text input.</li>
          <li>☐ <code>mode="currency"</code> always accompanied by <code>currency</code>.</li>
          <li>☐ Validation reads the model per keystroke — nothing waits for a change event.</li>
          <li>
            ☐ Verified in the accessibility tree: role spinbutton, the label as its name, aria-valuemin/max/now present.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          This is the kit's most locale-sensitive form control: the same model renders different characters per
          language, and the component will happily follow the wrong locale if you let it.
        </p>

        <h3>The locale is an input, and the default is wrong for this kit</h3>
        <p>
          Unset, <code>Intl.NumberFormat</code> resolves the <em>runtime's</em> locale — the reader's OS, not the page's
          language. A German page viewed on an English system shows <code>1,234.5</code> between German sentences. The
          kit rule is one binding: <code>[locale]="i18n.currentIntlLocale"</code> — the same stripped locale every date
          and collation already uses (<strong>I18n &amp; Localization</strong>).
        </p>
        <pre class="code-block"><code>{{ localeSnippet }}</code></pre>

        <h3>What the locale changes</h3>
        <ul>
          <li>
            <strong>Separators</strong> — grouping and decimal swap roles between locales (1.234,56 vs 1,234.56); the
            component accepts the decimal <em>key</em> per locale too.
          </li>
          <li>
            <strong>Digits</strong> — the formatter builds its numeral set per locale, so non-Latin digit systems render
            and parse natively.
          </li>
          <li>
            <strong>Currency placement</strong> — symbol before or after, spaced or not, comes from CLDR data, never
            from your template.
          </li>
        </ul>

        <h3>Your keys</h3>
        <ul>
          <li>
            <code>prefix</code>/<code>suffix</code> are display strings — translated keys, with the ~1.4× width budget
            of any label.
          </li>
          <li>
            The visible range hint is a key; keep the numerals in it as digits (locale formatting belongs to the field,
            not the sentence).
          </li>
          <li>
            Currency amounts stay <code>mode="currency"</code> — never a suffix string imitating one; placement and
            spacing are locale facts.
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.4</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the spin buttons now carry
            the kit's <code>--control-border</code> edge and <code>--text-color-secondary</code> icon (gated, "form field
            edge"), and <code>[invalid]</code> alone draws the kit's <code>--semantic-red-fg</code> edge on the field.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016). New Design section on what
            the kit and the styles do to the inner <code>pInputText</code> — kit focus ring, dark element tokens, the
            style border that the spin buttons do not share, and the <code>[invalid]</code> border tint the style rule
            overrides (the <code>ng-invalid ng-dirty</code> rule still paints). The invalid example no longer claims a
            triple: no <code>aria-invalid</code> is bound, the described message carries the state. Agent doc under the
            size aim.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): every line ref re-derived
            against <code>openng-optimus-ui-inputnumber.mjs</code> — the formatting, spinner, and editing inputs are
            plain v21 <code>&#64;Input</code> properties there, not input signals, so their defaults now cite
            :246/:261/:231/:140/:150/:236 and the spinbutton block :1266/:1272-1274/:1294. The token file is Aura 2.x:
            the spin button is <strong>2.5rem</strong> wide, not 2.25rem, and its light/dark colors sit in a
            <code>colorScheme</code> block instead of <code>light-dark()</code>. Behavior unchanged: the browser-locale
            default, the pointer-only buttons, and the zero-bound Home/End gap all still hold.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-24 — Initial guide, measured off primeng&#64;22.1.2 and the Aura 3.0 token
            file: the spinbutton input behind Intl.NumberFormat, the pointer-only spin buttons, the browser-locale
            default and the kit's currentIntlLocale rule, the zero-bound Home/End gap, and the
            identifier-versus-quantity boundary. Resolves the <code>planned:inputnumber</code> references from the
            slider and text-inputs guides.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class InputnumberArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Demo state ----------------------------------------------------------
  readonly shared = signal<number>(1234.5);
  readonly amount = signal<number>(250);
  readonly qty = signal<number>(4);
  readonly participants = signal<number | null>(null);
  readonly plzBad = signal<number>(1099); // what survives of the Dresden code 01099
  readonly plzGood = signal<string>('01099');
  readonly silent = signal<number | null>(null);
  readonly hinted = signal<number | null>(null);

  outOfRange(): boolean {
    const v = this.participants();
    return v !== null && (v < 1 || v > 30);
  }

  // --- Measured values (flat, so the tab extractor resolves them) ---------
  readonly m = {
    btnWidth: '2.5rem',
    btnBg: 'transparent',
    btnHover: 'surface.100 / surface.200 light · surface.800 / surface.700 dark',
    btnColor: '--text-color-secondary (kit; Aura surface.400), both themes',
    btnBorder: '--control-border in all states (kit; Aura form.field.border.color)',
    rootOnly: 'a transition duration — nothing else',
  };

  // --- Flat string constants: these resolve wherever the tab is read ------
  readonly wiringSnippet: string = '<label for="fx-amount">{{ t(\'form.amountLabel\') }}</label>\n' +
    '<p-inputnumber\n' +
    '  inputId="fx-amount"\n' +
    '  mode="currency" currency="EUR"\n' +
    '  [locale]="i18n.currentIntlLocale"   <!-- never the browser default -->\n' +
    '  [min]="0" [max]="10000" [step]="10"\n' +
    '  [invalid]="shows(\'amount\')"\n' +
    "  [ariaDescribedBy]=\"shows('amount') ? 'fx-amount-error' : 'fx-amount-hint'\"\n" +
    '  [ngModel]="amount()" (ngModelChange)="amount.set($event)"\n' +
    '  name="amount"\n' +
    '/>\n' +
    '<small id="fx-amount-hint">{{ t(\'form.amountHint\') }}</small>';

  readonly eventSnippet: string = '// The model moves on every accepted keystroke - validate from it directly.\n' +
    'readonly amount = signal<number | null>(null);\n' +
    'private readonly errors = computed(() => validate(this.amount()));\n' +
    '\n' +
    '// onInput is the only change-shaped output; there is no onChange.\n' +
    '// (onInput) => { value: number | null, formattedValue: string }\n' +
    '// onClear fires for the showClear icon; onBlur is when formatting settles.';

  readonly localeSnippet: string = '// The kit rule - one binding, same locale as dates and collation:\n' +
    'readonly i18n = inject(TranslationService);\n' +
    '// template: [locale]="i18n.currentIntlLocale"\n' +
    '// de      -> 1.234,56   (comma is the decimal key)\n' +
    '// en      -> 1,234.56\n' +
    '// unset   -> whatever the OS of the reader says - not the page language';
}
