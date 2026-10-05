import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { SelectModule } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    RadioButtonModule,
    CheckboxModule,
    SelectModule,
    SelectButtonModule,
    ToggleSwitchModule,
    FormsModule,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      :host {
        display: block;
      }
      .lead {
        max-width: 46rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-5);
      }
      h3 {
        margin: 1.5rem 0 0.6rem;
        font-size: 1.05rem;
        color: var(--text-color);
      }
      h4 {
        margin: 1.2rem 0 0.5rem;
        font-size: 0.95rem;
        color: var(--text-color);
      }
      p,
      li {
        line-height: 1.6;
        color: var(--text-color);
      }
      ul,
      ol {
        padding-left: 1.4rem;
        margin: 0 0 1rem;
      }
      li {
        margin: 0.35rem 0;
      }
      kbd {
        font-family: var(--font-mono);
        font-size: 0.8em;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-bottom-width: 2px;
        border-radius: var(--radius-sm);
        padding: 0.05em 0.4em;
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .src-note {
        max-width: 46rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 1.2rem;
      }

      /* --- Radio group layout (the part the component does NOT ship) --- */
      .rb-group {
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        margin: 0;
        padding: var(--space-3) var(--space-4) var(--space-4);
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .rb-group legend {
        padding: 0 var(--space-2);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .rb-group--row {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-4);
      }
      .rb-group--tight {
        border: 0;
        padding: 0;
        gap: var(--space-2);
      }
      .rb-group--tight legend {
        padding: 0;
        margin-bottom: var(--space-1);
      }
      .rb-group--scroll {
        max-height: 12rem;
        overflow-y: auto;
      }
      .rb-row {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        min-height: 1.75rem;
      }
      .rb-row label {
        line-height: 1.25rem;
        cursor: pointer;
      }
      .rb-row--desc {
        align-items: flex-start;
      }
      .rb-text {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .rb-hint {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .rb-label--off {
        color: var(--text-color-secondary);
      }
      .rb-error {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--semantic-red-fg);
      }
      .rb-fake-legend {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-1);
      }
      .rb-followup {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-top: var(--space-2);
      }
      .rb-input {
        font: inherit;
        padding: 0.35rem 0.6rem;
        color: var(--text-color);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
      }

      /* --- Playground --- */
      .pg {
        margin: 0 0 var(--space-6);
        padding: var(--space-5);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .pg__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-5);
        margin-bottom: var(--space-4);
      }
      .pg__controls {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .pg__controls legend {
        padding: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-1);
      }
      .pg__field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .pg__field label,
      .pg__label {
        font-size: 0.85rem;
        color: var(--text-color);
        font-weight: var(--font-weight-medium);
      }
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__field--switch label {
        flex: 1;
      }
      .pg__field p-select {
        width: 100%;
      }
      .pg__preview {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .pg__preview-label,
      .pg__code-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .pg__stage {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__stage > * {
        min-width: 0;
        max-width: 100%;
      }
      .pg__readout {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      @media (max-width: 640px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Examples --- */
      .ex {
        margin: 0 0 var(--space-6);
      }
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__title {
        margin: 0;
        font-size: 1rem;
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .ex__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .ex__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }
      .ex__readout {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-color-secondary);
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
        min-width: 0;
      }
      .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        display: flex;
        flex-direction: column;
        align-items: stretch;
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
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
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

      .copy-btn {
        appearance: none;
        flex: 0 0 auto;
        padding: 0.35rem 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: border-color 0.15s ease;
      }
      .copy-btn:hover {
        border-color: var(--primary-color-fg);
      }
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
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
      .sources a,
      .history strong {
        color: var(--primary-color-fg);
      }
      @media (prefers-reduced-motion: reduce) {
        .copy-btn {
          transition: none;
        }
      }
    `;

/**
 * Guide article: RadioButton (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>`; each tab body is an `appGuideTab`
 * template. Every group on the page is a real `p-radiobutton` set, so the
 * do/don't pairs about grouping are the component's own behavior rather than a
 * description of it.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Theme preset Aura, registered in app.config.ts. Token chain:
 *     `@openng/optimus-ui-themes/dist/aura/radiobutton/index.mjs`, resolving
 *     `{form.field.*}` / `{primary.*}` / `{focus.ring.*}` against
 *     `@openng/optimus-ui-themes/dist/aura/base/index.mjs`.
 *   - Layout and state literals from `@openng/optimus-ui-styles/dist/radiobutton/index.mjs`.
 *   - Structure: one REAL `input[type=radio]` per component, plus a box and an
 *     icon div (openng-optimus-ui-radiobutton.mjs:269-291, Optimus UI 2.0.2). `name`,
 *     `required`, `disabled` and `tabindex` are bound onto that input; the model
 *     value is NOT - `[attr.value]` receives `modelValue()`, which for a radio is
 *     the checked boolean. Only `size`/`variant` and the inherited
 *     `name`/`disabled`/`required`/`invalid` are signal inputs; the rest are plain
 *     `@Input`s (:132-168). `styleClass` is back as `@deprecated` (:153-158); the
 *     selector accepts `p-radioButton`, `p-radiobutton` and `p-radio-button` (:268).
 *   - Exclusivity has two independent mechanisms: the browser's own radio group
 *     (inputs sharing a `name`) and the library's `RadioControlRegistry`
 *     (openng-optimus-ui-radiobutton.mjs:85-107), which groups by NgControl root plus
 *     `name()` and writes the winner's value into the siblings.
 *   - The box scale is back on the Aura 2.x values: 1.25rem default / 1rem sm /
 *     1.5rem lg (20/16/24px). Only `large` clears the 24px target.
 *   - The autofocus-attribute-on-every-radio bug is back: `autofocus` is an
 *     uninitialized plain input (:163) fed to `[pAutoFocus]` (:286), and AutoFocus
 *     strips the attribute only for a strict false
 *     (openng-optimus-ui-autofocus.mjs:23-27).
 *   - styles.scss has three radio rules: `.p-radiobutton` re-points
 *     `--p-radiobutton-border-color` to `--control-border` and the invalid
 *     border to `--semantic-red-fg` (gated in CONTRAST.MD, "checkbox &
 *     radiobutton" / "form field edge"), and the one kit ring rule draws 2px
 *     `--primary-color-fg` on the box via `:has(.p-radiobutton-input:focus-visible)`
 *     ("focus ring"). The kit-side convention for groups is the fieldset with a
 *     screen-reader legend.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-radiobutton-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'radiobutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every group below is a real set of <code>p-radiobutton</code> components. Unlike most controls in this kit there
          is no group component: a radio group is something you assemble out of single radios, a shared
          <code>name</code>, a <code>&lt;fieldset&gt;</code> and one <code>&lt;label&gt;</code> per option. The examples
          are that assembly.
        </p>

        <section class="pg" aria-label="RadioButton playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-count-label">Options</span>
                <p-select
                  [ariaLabelledBy]="'pg-count-label'"
                  size="small"
                  [options]="countOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgCount()"
                  (ngModelChange)="pgCount.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Size</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-layout-label">Layout</span>
                <p-select
                  [ariaLabelledBy]="'pg-layout-label'"
                  size="small"
                  [options]="layoutOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgLayout()"
                  (ngModelChange)="pgLayout.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-filled">Filled variant</label>
                <p-toggleswitch inputId="pg-filled" [ngModel]="pgFilled()" (ngModelChange)="pgFilled.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-invalid">Invalid</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <fieldset class="rb-group" [class.rb-group--row]="pgLayout() === 'row'">
                  <legend>Delivery</legend>
                  @for (o of pgOptions(); track o.value) {
                    <div class="rb-row">
                      <p-radiobutton
                        name="rb-pg"
                        [inputId]="'pg-' + o.value"
                        [value]="o.value"
                        [size]="pgSizeInput()"
                        [variant]="pgFilled() ? 'filled' : 'outlined'"
                        [invalid]="pgInvalid()"
                        [disabled]="pgDisabled()"
                        [ngModel]="pgValue()"
                        (ngModelChange)="pgValue.set($event)"
                      />
                      <label [for]="'pg-' + o.value">{{ o.label }}</label>
                    </div>
                  }
                </fieldset>
              </div>
              <p class="pg__readout">
                Model: <code>{{ pgReadout() }}</code>
              </p>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
          <p class="ex__note">
            Tab into the group and press the arrow keys: selection moves and the model follows, because every radio
            above carries the same <code>name</code>. That is browser behavior, not a library feature &mdash; the Usage
            tab has the pair that shows what happens without it.
          </p>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title" [id]="'ex-' + ex.id">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('canonical') {
                  <fieldset class="rb-group" id="ex-canonical-group">
                    <legend>Delivery speed</legend>
                    @for (o of shippingOptions; track o.value) {
                      <div class="rb-row">
                        <p-radiobutton
                          name="rb-canonical"
                          [inputId]="'ship-' + o.value"
                          [value]="o.value"
                          [ngModel]="shipping()"
                          (ngModelChange)="shipping.set($event)"
                        />
                        <label [for]="'ship-' + o.value">{{ o.label }}</label>
                      </div>
                    }
                  </fieldset>
                  <span class="ex__readout">Model: {{ shipping() }}</span>
                }
                @case ('describe') {
                  <fieldset class="rb-group">
                    <legend>Plan</legend>
                    @for (o of planOptions; track o.value) {
                      <div class="rb-row rb-row--desc">
                        <p-radiobutton
                          name="rb-plan"
                          [inputId]="'plan-' + o.value"
                          [value]="o.value"
                          [pt]="{ input: { 'aria-describedby': 'plan-' + o.value + '-hint' } }"
                          [ngModel]="plan()"
                          (ngModelChange)="plan.set($event)"
                        />
                        <div class="rb-text">
                          <label [for]="'plan-' + o.value">{{ o.label }}</label>
                          <span class="rb-hint" [id]="'plan-' + o.value + '-hint'">{{ o.hint }}</span>
                        </div>
                      </div>
                    }
                  </fieldset>
                }
                @case ('sizes') {
                  <div class="ex__stack">
                    @for (s of sizeRows; track s.key) {
                      <fieldset class="rb-group rb-group--row">
                        <legend>{{ s.label }}</legend>
                        @for (o of twoOptions; track o.value) {
                          <div class="rb-row">
                            <p-radiobutton
                              [name]="'rb-size-' + s.key"
                              [inputId]="'size-' + s.key + '-' + o.value"
                              [value]="o.value"
                              [size]="s.size"
                              [ngModel]="sizeValues()[s.key]"
                              (ngModelChange)="setSizeValue(s.key, $event)"
                            />
                            <label [for]="'size-' + s.key + '-' + o.value">{{ o.label }}</label>
                          </div>
                        }
                      </fieldset>
                    }
                  </div>
                }
                @case ('variant') {
                  <div class="ex__stack">
                    <fieldset class="rb-group rb-group--row" id="ex-variant-outlined">
                      <legend>Outlined (default)</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-var-out"
                            [inputId]="'var-out-' + o.value"
                            [value]="o.value"
                            [ngModel]="varOutlined()"
                            (ngModelChange)="varOutlined.set($event)"
                          />
                          <label [for]="'var-out-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <fieldset class="rb-group rb-group--row" id="ex-variant-filled">
                      <legend>Filled</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-var-fill"
                            variant="filled"
                            [inputId]="'var-fill-' + o.value"
                            [value]="o.value"
                            [ngModel]="varFilled()"
                            (ngModelChange)="varFilled.set($event)"
                          />
                          <label [for]="'var-fill-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                  </div>
                }
                @case ('states') {
                  <div class="ex__stack">
                    <fieldset class="rb-group" id="ex-states-partial">
                      <legend>One option disabled</legend>
                      @for (o of seatOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-seat"
                            [inputId]="'seat-' + o.value"
                            [value]="o.value"
                            [disabled]="o.soldOut"
                            [ngModel]="seat()"
                            (ngModelChange)="seat.set($event)"
                          />
                          <label [for]="'seat-' + o.value" [class.rb-label--off]="o.soldOut">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <fieldset class="rb-group rb-group--row" id="ex-states-invalid" aria-describedby="ex-states-error">
                      <legend>Invalid group</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-inv"
                            [inputId]="'inv-' + o.value"
                            [value]="o.value"
                            [invalid]="true"
                            [required]="true"
                            [ngModel]="invalidValue()"
                            (ngModelChange)="invalidValue.set($event)"
                          />
                          <label [for]="'inv-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <p class="rb-error" id="ex-states-error">Choose one to continue.</p>
                    <fieldset class="rb-group rb-group--row" id="ex-states-disabled">
                      <legend>Whole group disabled</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-dis"
                            [inputId]="'dis-' + o.value"
                            [value]="o.value"
                            [disabled]="true"
                            [ngModel]="'yes'"
                          />
                          <label [for]="'dis-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                  </div>
                }
                @case ('other') {
                  <fieldset class="rb-group">
                    <legend>Reason</legend>
                    @for (o of reasonOptions; track o.value) {
                      <div class="rb-row">
                        <p-radiobutton
                          name="rb-reason"
                          [inputId]="'reason-' + o.value"
                          [value]="o.value"
                          [ngModel]="reason()"
                          (ngModelChange)="reason.set($event)"
                        />
                        <label [for]="'reason-' + o.value">{{ o.label }}</label>
                      </div>
                    }
                    @if (reason() === 'other') {
                      <div class="rb-followup">
                        <label for="reason-other-text">Tell us more</label>
                        <input
                          id="reason-other-text"
                          type="text"
                          class="rb-input"
                          [value]="reasonText()"
                          (input)="onReasonText($event)"
                        />
                      </div>
                    }
                  </fieldset>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          A radio group answers one question with exactly one of a visible, named set, and it is the only control in the
          library that does so with real form semantics. Everything on this tab is the boundary between it and the
          controls that look like it.
        </p>

        <h3>Four questions, in order</h3>
        <ol>
          <li>
            <strong>How many answers may be true at once?</strong> More than one, or none, is a checkbox group. Exactly
            one is a radio group. This is the only question that has a right answer independent of layout, and it comes
            first.
          </li>
          <li>
            <strong>Does the choice get submitted, validated, or reset with the form?</strong> If yes, the answer is a
            radio group even when a segmented control would look nicer: it is the only exclusive control here that puts
            <code>name</code>, <code>required</code> and <code>checked</code> into the DOM, and the only one whose
            exclusivity is a browser guarantee rather than a component's bookkeeping.
          </li>
          <li>
            <strong>Does the choice take effect the moment it is made?</strong> A setting that applies instantly is a
            switch (one boolean) or a segmented control (two to four values). A radio group implies a Save or a Next.
          </li>
          <li>
            <strong>How many options, and how long are the labels?</strong> Two to five short ones stacked vertically:
            radio group. Six or more, or options that need a sentence of explanation each, or a set that grows at
            runtime: <code>p-select</code>.
          </li>
        </ol>

        <h3>The control-choice table</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Control</th>
                <th>Why not a radio group</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exactly one of 2&ndash;5 named options, in a form that is submitted or validated</td>
                <td>
                  <strong><code>p-radiobutton</code></strong>
                </td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td>Zero to many independent answers</td>
                <td><code>p-checkbox</code></td>
                <td>
                  A radio group cannot be emptied by the user: once one is picked, the only way back to "nothing
                  selected" is a Clear button you write yourself.
                </td>
              </tr>
              <tr>
                <td>2&ndash;4 short exclusives that apply on click, all visible in one row</td>
                <td><code>p-selectbutton</code></td>
                <td>
                  Nothing is wrong with a radio group here; the segmented control is denser and reads as a view control.
                  Turn it round when the value is a form field: SelectButton exposes pressed buttons and contributes
                  nothing to a submit.
                </td>
              </tr>
              <tr>
                <td>One boolean that applies instantly (notifications on/off)</td>
                <td><code>p-toggleswitch</code></td>
                <td>
                  Two radios labeled On and Off spend a whole group, and two tab stops of reading, on a state a switch
                  shows at a glance.
                </td>
              </tr>
              <tr>
                <td>One boolean that must look like a button in a toolbar ("Bold", "Mute")</td>
                <td><code>p-togglebutton</code></td>
                <td>
                  A single radio is the one shape a radio group must never take: it can be checked and never unchecked
                  again, so the user cannot undo their first click.
                </td>
              </tr>
              <tr>
                <td>Exactly one of 6&ndash;25 options, or labels longer than a few words</td>
                <td><code>p-select</code></td>
                <td>
                  Radios cost one line each and never collapse; a long set pushes the form below the fold and turns the
                  choice into a scroll.
                </td>
              </tr>
              <tr>
                <td>Exactly one of a long list that should stay visible and scroll in place</td>
                <td><code>p-listbox</code></td>
                <td>
                  A listbox is one tab stop with a scroll viewport; a radio group is a document-flow stack that grows
                  the page. Note the trade: a listbox announces <code>option</code>, not <code>radio</code>, and carries
                  no <code>name</code>.
                </td>
              </tr>
              <tr>
                <td>Switching between parallel views of one subject</td>
                <td><code>p-tabs</code></td>
                <td>
                  That is navigation, not a value. Tabs own the tablist and panel wiring; a radio group has no panel
                  relationship at all.
                </td>
              </tr>
              <tr>
                <td>
                  An exclusive choice somewhere the theme's form styling does not apply &mdash; a print stylesheet, a
                  bare utility page, a component that must not pull in an Optimus module
                </td>
                <td><code>&lt;input type="radio"&gt;</code></td>
                <td>
                  Nothing is wrong with it. The component wraps exactly this element and adds the Aura look plus a
                  <code>ControlValueAccessor</code> &mdash; no group, no keyboard handling, no ARIA beyond the native
                  input's. It also <em>requires</em> an Angular form binding, which the plain input does not. Reach for
                  the native element when you do not need the look.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          That last row is the one worth remembering:
          <strong>everything this control is good at, it inherits.</strong> The grouping, the arrow keys, the
          exclusivity, the labeling, and the submit behavior are the browser's; the component contributes theming and
          Angular form integration. Which is why the rest of this guide spends most of its length on markup you write
          around it rather than on inputs you pass to it.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Four failures worth memorizing, rendered on both sides. The
          <span class="tag tag--bad">Don't</span> is on the left, the <span class="tag tag--good">Do</span> on the
          right. The first pair is the one that costs a whole keyboard contract.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; radios with no shared name</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-name-bad">
                <legend>Billing period</legend>
                @for (o of billingOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      [inputId]="'bad-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddBad()"
                      (ngModelChange)="ddBad.set($event)"
                    />
                    <label [for]="'bad-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why" id="dd-name-bad-why">
              It looks right, because the shared Angular model is unchecking the others. But these three inputs are not
              a radio group at all: each is its own tab stop, and nothing in the DOM ties them together. Tab through
              both cells and count.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; one name for the whole group</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-name-good">
                <legend>Billing period</legend>
                @for (o of billingOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-good"
                      [inputId]="'good-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddGood()"
                      (ngModelChange)="ddGood.set($event)"
                    />
                    <label [for]="'good-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              One tab stop for the whole group, arrow keys that move the selection, and a real radio group in the DOM
              that stays exclusive with no help from Angular. The
              <code>name</code> is what buys all three &mdash; see the Development tab.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; a single radio as a yes/no</span>
            <div class="dd__stage">
              <div class="rb-row">
                <p-radiobutton
                  name="rb-dd-lone"
                  inputId="dd-lone"
                  [binary]="true"
                  [ngModel]="ddLone()"
                  (ngModelChange)="ddLone.set($event)"
                />
                <label for="dd-lone">I accept the terms</label>
              </div>
            </div>
            <p class="dd__why">
              Click it. There is now no way back: a radio has no user gesture that unchecks it, so a consent given by
              accident cannot be withdrawn without a Reset.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; a checkbox for one boolean</span>
            <div class="dd__stage">
              <div class="rb-row">
                <p-checkbox
                  inputId="dd-consent"
                  [binary]="true"
                  [ngModel]="ddConsent()"
                  (ngModelChange)="ddConsent.set($event)"
                />
                <label for="dd-consent">I accept the terms</label>
              </div>
            </div>
            <p class="dd__why">
              A checkbox toggles both ways, is announced as a checkbox, and is what a consent must be so it can be
              refused after being given.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; nine options as radios</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight rb-group--scroll">
                <legend>Country</legend>
                @for (o of countryOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-many"
                      [inputId]="'many-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddMany()"
                      (ngModelChange)="ddMany.set($event)"
                    />
                    <label [for]="'many-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              Nine lines of form for one answer. The set is also the kind that grows, and every new value is another
              line in every layout that embeds this form.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; a select, at one line</span>
            <div class="dd__stage">
              <span class="pg__label" id="dd-country-label">Country</span>
              <p-select
                [ariaLabelledBy]="'dd-country-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddSelect()"
                (ngModelChange)="ddSelect.set($event)"
              />
            </div>
            <p class="dd__why">
              One trigger of predictable height, a filterable list, and a set that can double without touching the
              layout.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; a heading instead of a group</span>
            <div class="dd__stage">
              <div class="rb-group rb-group--tight" id="dd-group-bad">
                <span class="rb-fake-legend">Contact me by</span>
                @for (o of contactOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-nogroup"
                      [inputId]="'ng-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddNoGroup()"
                      (ngModelChange)="ddNoGroup.set($event)"
                    />
                    <label [for]="'ng-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </div>
            </div>
            <p class="dd__why">
              The text above is a sibling, not a container. In the accessibility tree the radios sit in no named group
              at all, and a screen-reader user arriving by keyboard hears only "Email, radio button" with no idea what
              is being asked.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; fieldset with a legend</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-group-good">
                <legend>Contact me by</legend>
                @for (o of contactOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-group"
                      [inputId]="'gr-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddGroup()"
                      (ngModelChange)="ddGroup.set($event)"
                    />
                    <label [for]="'gr-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              The <code>&lt;fieldset&gt;</code> exposes a group node named by its <code>&lt;legend&gt;</code>, and every
              radio inside it is announced with the question it answers.
            </p>
          </div>
        </div>

        <h3>Naming the group when the question is already on screen</h3>
        <p>
          The group still needs the <code>&lt;fieldset&gt;</code> even when a visible heading or question already says
          what is being chosen &mdash; visual adjacency is not a relationship. The kit's convention for that case is a
          <code>&lt;fieldset&gt;</code> whose <code>&lt;legend&gt;</code> carries the <code>.sr-only</code> utility from
          <code>styles.scss</code>, with <code>aria-labelledby</code> pointing at the visible text: the group node
          exists and is named, and the caption is not read twice. Reference implementation:
          <code>quiz-container.component.ts</code> (shared <code>name</code>, <code>&lt;label for&gt;</code>,
          <code>.sr-only</code> legend).
        </p>

        <h3>Writing the labels</h3>
        <ul>
          <li>
            <strong>The legend asks, the labels answer.</strong> "Delivery speed" over "Standard / Express", never
            "Choose your delivery speed" over "Choose standard".
          </li>
          <li>
            <strong>Parallel grammar, mutually exclusive in plain reading.</strong> If two labels could both be true for
            one user, the control is wrong, not the wording.
          </li>
          <li>
            <strong>Put the explanation in a description, not in the label.</strong> A label that runs to a sentence
            makes the clickable target a paragraph; move the detail to a hint line and reference it from the input.
          </li>
          <li>
            <strong>Never label an option "None" to fake an empty state</strong> unless "none" is a real answer you will
            store. If the question may go unanswered, checkboxes or an explicit "No preference" option are the honest
            shapes.
          </li>
        </ul>

        <h3>Annotated sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Radio Group pattern</a
            >
            &mdash; the keyboard contract this control gets from the browser: one tab stop per group, arrow keys moving
            selection, and the roving focus that follows.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG HTML &mdash; the radio button state</a
            >
            &mdash; defines the radio button group as the inputs sharing a name within a form owner, and states that no
            user gesture unchecks a radio; the basis of the grouping and single-radio rules here.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#radiogroup" target="_blank" rel="noopener noreferrer">
              W3C &mdash; WAI-ARIA 1.2, <code>radiogroup</code></a
            >
            &mdash; what a group node owes its children, and why a heading above a stack of radios is not one.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN &mdash; <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code></a
            >
            &mdash; the native grouping element used throughout this guide, including its default styling reset and its
            legend-as-name behavior.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            &mdash; the 24&nbsp;CSS-px floor the radio box is measured against in the Design tab, and the reason the
            label must be clickable.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; the 3:1 floor for the unchecked ring and the checked fill, both measured per mode in the Design
            tab.
          </li>
          <li>
            <a href="https://primeng.org/radiobutton" target="_blank" rel="noopener noreferrer">
              PrimeNG 21 &mdash; RadioButton</a
            >
            &mdash; the upstream API surface Optimus forks, re-verified here against the shipped source rather than quoted.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          The component is a 1.25rem square and nothing else &mdash; no label, no row, no spacing. Everything around it
          is yours.
        </p>
        <ul>
          <li>
            <strong>Host</strong> &mdash; <code>.p-radiobutton</code>: <code>position: relative</code>,
            <code>inline-flex</code>, <code>vertical-align: bottom</code>, sized from
            <code>radiobutton.width/height</code>. State classes land here (<code>.p-radiobutton-checked</code>,
            <code>.p-disabled</code>, <code>.p-invalid</code>, <code>.p-variant-filled</code>), which is why the theme's
            rules key off the host and not off a pseudo-class.
          </li>
          <li>
            <strong>Input</strong> &mdash; <code>.p-radiobutton-input</code>: a REAL
            <code>&lt;input type="radio"&gt;</code>, absolutely positioned over the whole host at
            <code>opacity: 0</code> with <code>z-index: 1</code>. It is the click target, the focus target, the
            labelable element and the thing a form submits.
          </li>
          <li>
            <strong>Box</strong> &mdash; <code>.p-radiobutton-box</code>: the visible circle. Border, background,
            box-shadow, and the focus outline are painted here, driven by the host's state classes and by
            <code>:has()</code> selectors that read the input's <code>:hover</code> / <code>:focus-visible</code>.
          </li>
          <li>
            <strong>Icon</strong> &mdash; <code>.p-radiobutton-icon</code>: the inner dot. It is always in the DOM, and
            hidden twice over: its resting <code>background</code> is <code>transparent</code>, and it is additionally
            shrunk by <code>transform: scale(0.1)</code>. Checking the radio gives it the icon color and
            <code>scale(1)</code>, so the dot pops in rather than fading &mdash; and a rule that only restores the
            transform leaves it invisible.
          </li>
        </ul>
        <p class="src-note">
          Template from <code>openng-optimus-ui-radiobutton.mjs:269-291</code> (Optimus UI 2.0.2); every rule quoted above is in
          <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code> (2.0.2).
        </p>

        <h3>Token chain: Aura &rarr; kit</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura value</th>
                <th>Resolves to</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>radiobutton.width/height</code></td>
                <td>1.25rem</td>
                <td>20px (sm 1rem, lg 1.5rem) — Aura 2.x</td>
              </tr>
              <tr>
                <td><code>radiobutton.background</code></td>
                <td><code>&#123;form.field.background&#125;</code></td>
                <td>the shared input surface</td>
              </tr>
              <tr>
                <td><code>radiobutton.border.color</code></td>
                <td><code>&#123;form.field.border.color&#125;</code></td>
                <td>the shared input border &mdash; re-pointed by the kit to <code>--control-border</code></td>
              </tr>
              <tr>
                <td><code>radiobutton.checked.background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>the accent's primary, re-registered per accent by this kit</td>
              </tr>
              <tr>
                <td><code>radiobutton.checked.border.color</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>&mdash; ring and fill are one color</td>
              </tr>
              <tr>
                <td><code>radiobutton.icon.checked.color</code></td>
                <td><code>&#123;primary.contrast.color&#125;</code></td>
                <td>the dot, paired with the fill by construction</td>
              </tr>
              <tr>
                <td><code>radiobutton.icon.size</code></td>
                <td>0.75rem</td>
                <td>12px (sm 0.5rem, lg 1rem) — Aura 2.x</td>
              </tr>
              <tr>
                <td><code>radiobutton.filled.background</code></td>
                <td><code>&#123;form.field.filled.background&#125;</code></td>
                <td>only while unchecked &mdash; the checked fill wins</td>
              </tr>
              <tr>
                <td><code>radiobutton.disabled.background</code></td>
                <td><code>&#123;form.field.disabled.background&#125;</code></td>
                <td>a real disabled surface, not a fade</td>
              </tr>
              <tr>
                <td><code>radiobutton.invalid.border.color</code></td>
                <td><code>&#123;form.field.invalid.border.color&#125;</code></td>
                <td>the shared form-error red</td>
              </tr>
              <tr>
                <td><code>radiobutton.focus.ring.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>1px solid <code>&#123;primary.color&#125;</code>, offset 2px</td>
              </tr>
              <tr>
                <td><code>radiobutton.transition.duration</code></td>
                <td><code>&#123;form.field.transition.duration&#125;</code></td>
                <td>0.2s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-themes/dist/aura/radiobutton/index.mjs</code>, resolving against
          <code>&#8230;/aura/base/index.mjs</code>. <strong>Note the focus ring:</strong> it inherits the
          <em>global</em> <code>focus.ring</code> group, not the <code>form.field.focusRing</code> that Aura zeroes for
          input-shaped controls &mdash; so unlike <code>p-select</code>, a radio shows a 1px ring in both modes out of
          the box. This kit replaces it with its one 2px ring (below).
        </p>

        <h3>What the kit layers on top: two tokens and the ring</h3>
        <p>
          <code>styles.scss</code> re-points two radio tokens on <code>.p-radiobutton</code>:
          <code>--p-radiobutton-border-color</code> to the kit's <code>--control-border</code>, because Aura's
          <code>form.field.border.color</code> left the unchecked ring under 3:1, and
          <code>--p-radiobutton-invalid-border-color</code> to <code>--semantic-red-fg</code> (Aura's red.400 was
          2.77:1 on white). Both are element-scoped, so the hover, checked, and focus rules keep their own tokens. The
          focus ring is the kit's one ring rule, which lists the radio box beside the checkbox:
          <code>.p-radiobutton:has(.p-radiobutton-input:focus-visible) .p-radiobutton-box</code>, 2px solid
          <code>--primary-color-fg</code> at 2px offset, <code>!important</code>. None of the <code>html.style-&lt;name&gt;</code>
          blocks (ADR-0016) touches the radio, and the styles' radius overrides do not reach a circle. The other
          non-Aura rule in play ships
          with the component itself (<code>openng-optimus-ui-radiobutton.mjs:17-22</code>): an <code>ng-invalid.ng-dirty</code> selector on the three accepted host tags that paints
          the box border with <code>radiobutton.invalid.border.color</code>, so a reactive-forms validation failure
          colors the ring without you setting <code>[invalid]</code>. What is yours is everything outside the 20px
          square &mdash; the row, the gap, the label typography, the stack spacing.
        </p>

        <h3>Contrast, in both modes</h3>
        <p>
          Every row is quoted from <code>docs/generated/CONTRAST.MD</code> (<code>checkbox &amp; radiobutton</code> and
          <code>body text</code>) for the <strong>werkbund</strong> style and the default <strong>sunset</strong>
          accent, against <code>--surface-card</code>; the gate holds the same pairs for every style, accent, and mode.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light</th>
                <th>Dark</th>
                <th>Floor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>unchecked ring</strong> (<code>--control-border</code>) vs. the card</td>
                <td>
                  <strong>{{ m.uncheckedBorderLight }}</strong>
                </td>
                <td>
                  <strong>{{ m.uncheckedBorderDark }}</strong>
                </td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>checked fill vs. the content surface</td>
                <td>{{ m.checkedFillLight }}</td>
                <td>{{ m.checkedFillDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>inner dot vs. the checked fill</td>
                <td>{{ m.dotLight }}</td>
                <td>{{ m.dotDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>focus ring vs. the content surface</td>
                <td>{{ m.focusRingLight }}</td>
                <td>{{ m.focusRingDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>body text vs. the content surface</td>
                <td>{{ m.labelLight }}</td>
                <td>{{ m.labelDark }}</td>
                <td>4.5:1 (SC 1.4.3)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>The unchecked ring is the row that matters</strong> &mdash; it is the only thing that says "there is a
          control here". On Aura's stock token it measured 1.48:1 light / 2.29:1 dark; on the kit's
          <code>--control-border</code> it clears 3:1 in every style and mode, lowest 3.85:1 (blaupause, light, on
          <code>--surface-ground</code>). The checked fill is the accent's <code>&#123;primary.color&#125;</code>, the
          dot its paired contrast color, and the focus ring the accent's <code>--primary-color-fg</code>. There is no
          exception left: the dark widget ramp now comes from each palette's dark foreground, so every accent &mdash;
          <strong>contrast</strong> in dark mode included &mdash; holds the checked fill at 4.75:1 or more and the ring
          at 3.88:1 or more on every page surface. Do not override <code>--p-radiobutton-border-color</code> with a
          lighter value &mdash; the gate only covers the token the kit sets.
        </p>
        <p class="src-note">
          Rows from <code>docs/generated/CONTRAST.MD</code>: <code>checkbox.border.color</code> (the same
          <code>--control-border</code> the radio reads), <code>sunset.primary.color</code>, and
          <code>sunset.checkbox.icon.checked.color</code> on the checked background, under
          <code>checkbox &amp; radiobutton</code>; the ring is <code>sunset.--primary-color-fg (kit focus ring)</code>
          under <code>focus ring</code>; the label is <code>--text-color</code> on <code>--surface-card</code>
          under <code>body text</code> (lowest style 11.32:1). Token layers in
          <code>&#8230;/aura/radiobutton/index.mjs</code>; the kit rule is the <code>.p-radiobutton</code> block in
          <code>styles.scss</code>. Reproduce by reading the computed
          <code>border-color</code> and <code>background-color</code> of <code>.p-radiobutton-box</code> in each state,
          and the <code>background</code> of <code>.p-radiobutton-icon</code>, against the surface behind them.
        </p>

        <h3>Geometry and the size scale</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th><code>size="small"</code></th>
                <th>default</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>box token</td>
                <td>1rem</td>
                <td>1.25rem</td>
                <td>1.5rem</td>
              </tr>
              <tr>
                <td>box in px</td>
                <td>{{ m.boxSmall }}</td>
                <td>{{ m.boxDefault }}</td>
                <td>{{ m.boxLarge }}</td>
              </tr>
              <tr>
                <td>dot token</td>
                <td>0.5rem</td>
                <td>0.75rem</td>
                <td>1rem</td>
              </tr>
              <tr>
                <td>24px on the box alone</td>
                <td>under</td>
                <td>under</td>
                <td><strong>exactly 24px</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>sm</code> / <code>lg</code> blocks in <code>&#8230;/aura/radiobutton/index.mjs</code> (Aura 2.x); the size classes <code>.p-radiobutton-sm</code> /
          <code>-lg</code> resize both the host and the box.
          <strong>What this means for SC 2.5.8:</strong>
          only <code>large</code> clears 24&nbsp;px as a target in its own right; small and default rely on the
          clickable <code>&lt;label&gt;</code> and on the
          success criterion's spacing exception, which needs consecutive rows far enough apart that a 24&nbsp;px circle
          centered on one radio does not reach the next. Space the rows and make the label part of the target.
        </p>

        <h3>Disabled: real tokens, not a fade</h3>
        <p>
          Worth calling out because the neighboring segmented control does the opposite. The shipped CSS sets
          <code>opacity: 1</code> on a disabled radio, overriding the global <code>.p-disabled</code> fade, and then
          paints the box from <code>radiobutton.disabled.background</code>,
          <code>radiobutton.checked.disabled.border.color</code> and <code>radiobutton.icon.disabled.color</code>. Those
          overrides live under <code>.p-radiobutton.p-disabled</code>, a class selector on the host element, so they
          match &mdash; measured opacity on a disabled radio is <strong>{{ m.disabledOpacity }}</strong
          >, with the box painted from the disabled tokens rather than faded. The tokens are therefore worth tuning,
          unlike the inert <code>togglebutton.disabled.*</code> set &mdash; whose rules are written
          <code>.p-togglebutton:disabled</code> in <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>, and
          that component renders no inner <code>button</code> element for <code>:disabled</code> to match. The label
          beside the radio is not touched at all: dim it yourself, or a disabled option reads as available.
        </p>
        <p class="src-note">
          <code>.p-radiobutton.p-disabled</code> and its three following rules in
          <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code>. The disabled label beside it is yours to dim;
          nothing in the component reaches outside its own square.
        </p>

        <h3>Focus</h3>
        <p>
          The ring is drawn on the box, not on the input, through
          <code>:has(.p-radiobutton-input:focus-visible)</code> &mdash; the invisible input takes focus and the visible
          circle reacts. Measured on a focused radio: <strong>{{ m.focusOutline }}</strong> at offset
          <strong>{{ m.focusOffset }}</strong
          >, identical in both modes. Two consequences: an ancestor with <code>overflow: hidden</code> hugging the row
          clips the ring, and a rule that hides the input differently (<code>display: none</code>, a clip rectangle)
          removes focus from the component entirely. Never restyle <code>.p-radiobutton-input</code>.
        </p>

        <h3>Laying out the group</h3>
        <ul>
          <li>
            <strong>Vertical by default.</strong> A stacked group scans as a set of answers to one question; a row of
            them reads as a toolbar, and mixed-length labels make the spacing irregular. Rows are for two short options
            at most.
          </li>
          <li>
            <strong>Align to the first line, not to the center.</strong> With a description under the label,
            <code>align-items: flex-start</code> keeps the circle beside the label rather than floating in the middle of
            the block.
          </li>
          <li>
            <strong>Reset the fieldset.</strong> Browsers give <code>&lt;fieldset&gt;</code> a border, a margin, and a
            padding of their own; set them deliberately rather than avoiding the element.
          </li>
          <li>
            <strong>Space the rows for the target, not for the type.</strong> The circle is 20px; the row needs to be at
            least 24px tall before the label makes a compliant target.
          </li>
          <li>
            <strong>Narrow screens.</strong> The component has no responsive behavior: the circle keeps its fixed size
            at every viewport and the layout is the row you build. A vertical stack needs nothing; a horizontal row must
            be allowed to wrap (<code>flex-wrap: wrap</code>) or switch to the stack below about 30rem, and a long label
            wraps beside the circle when its row is a flex container with <code>align-items: flex-start</code>.
          </li>
        </ul>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures &mdash; a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.2 (one <code>radio</code> node, named by its label), SC 2.1.1 with the
          browser-native group keyboard model, SC 2.4.7 with the ring measured in both modes, and SC 1.4.11 for the
          unchecked ring (kit <code>--control-border</code>, lowest 3.85:1), the checked fill, the inner dot, and the
          focus ring, all gated in <code>CONTRAST.MD</code> for every style, accent, and mode, with no exception.
          <strong>Conditional:</strong> SC 2.5.8 &mdash; only <code>large</code> (24px) is a target on its own; small and
          default reach it through the row&#39;s height and the clickable label. <strong>AAA</strong> is not
          assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ m.devImport }}</code></pre>
        <p>
          The selector accepts <code>p-radiobutton</code>, <code>p-radiobutton</code> and <code>p-radio-button</code>.
          It is a <code>ControlValueAccessor</code>, so <code>ngModel</code> and reactive forms both bind &mdash; and,
          unlike most controls, one of them is <em>required</em>: see the first pitfall.
        </p>

        <h3>How a group actually becomes a group</h3>
        <p>
          There is no group component. Exclusivity, keyboard navigation, and announcement come from three different
          places, and it is entirely possible to get one without the others &mdash; which is what most broken radio
          groups are.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What you want</th>
                <th>What provides it</th>
                <th>What happens without it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>One tab stop for the whole group</td>
                <td>
                  The browser's own radio group: <code>[name]</code> bound on every radio, which reaches the input as a
                  real <code>name</code> attribute. Measured: one <kbd>Tab</kbd> press crosses a named three-option
                  group, three crosses a nameless one.
                </td>
                <td>
                  Every radio is its own tab stop, and a long group becomes a tab tunnel. The library ships no
                  <code>keydown</code> handler of any kind, so there is nothing to compensate.
                </td>
              </tr>
              <tr>
                <td>Only one checked at a time in the DOM</td>
                <td>
                  The same <code>name</code> &mdash; the browser's own guarantee. The library's
                  <code>RadioControlRegistry</code> adds a second, independent one: it writes <code>false</code> into
                  every sibling accessor sharing an NgControl root and a <code>name()</code>.
                </td>
                <td>
                  Still <em>looks</em> right whenever all radios bind one model, because the value comparison in
                  <code>writeControlValue</code> unchecks the others. Plain nameless radios do not behave that way
                  &mdash; two can be checked at once. This is exactly why a nameless <code>p-radiobutton</code> group passes a click test
                  and is still broken.
                </td>
              </tr>
              <tr>
                <td>The group's question in the announcement</td>
                <td>
                  A <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code> around the set. Measured: it
                  exposes a <code>group</code> node named by the legend, owning the radios.
                </td>
                <td>
                  Radios announced individually, in no group. A heading above the stack produces no group node at all
                  &mdash; measured.
                </td>
              </tr>
              <tr>
                <td>A value in a native form submit</td>
                <td>Nothing you can rely on &mdash; see "Forms" below.</td>
                <td>&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>[attr.name]="name()"</code> at <code>openng-optimus-ui-radiobutton.mjs:274</code>;
          <code>RadioControlRegistry</code> at <code>:85-97</code>, registered in <code>onInit</code> at
          <code>:213-215</code> and consulted in <code>select</code> at <code>:222-229</code>; the model comparison at
          <code>:251</code> (Optimus UI 2.0.2). Tab-stop counts and the group node measured in the browser and the
          accessibility tree. Verify it in your own build: tab across the group and count the presses; then look for a
          <code>group</code> node above the radios, named by the legend.
        </p>
        <p>
          <strong>The document is the grouping scope outside a form.</strong> A radio group is the set of inputs sharing
          a name <em>within their form owner</em>; with no <code>&lt;form&gt;</code> ancestor that owner is the
          document. Two unrelated groups on one page that both use <code>name="type"</code> merge into one, and picking
          in the second unchecks the first. Namespace the value, or put each group in its own form.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>any</td>
                <td>
                  This option's value. Compared with the bound model using <code>==</code>, so <code>1</code> and
                  <code>'1'</code> match.
                </td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td>string</td>
                <td>
                  <strong>Effectively required.</strong> Reaches the input as a real <code>name</code> attribute; it is
                  what makes the browser treat the set as one group.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>The input's <code>id</code>, i.e. the target of your <code>&lt;label for&gt;</code>.</td>
              </tr>
              <tr>
                <td><code>binary</code></td>
                <td>boolean</td>
                <td>
                  Model is a boolean instead of a value comparison. A single-radio shape &mdash; read the Usage tab
                  before using it.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Resizes the box and the dot; nothing else on the row.</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'filled'</td>
                <td>
                  Unchecked background only. Falls back to the application-wide <code>inputStyle</code> and then
                  <code>inputVariant</code> config (<code>:202</code>); both still exist in Optimus.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Sets a real <code>disabled</code> attribute on the input &mdash; genuinely unfocusable and announced
                  as disabled.
                </td>
              </tr>
              <tr>
                <td><code>required</code></td>
                <td>boolean</td>
                <td>Sets a real <code>required</code> attribute on the input.</td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Recolors the box border. Nothing is announced &mdash; add a message and reference it.</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Land on the input. Prefer a real <code>&lt;label for&gt;</code>; use these only when there is no
                  visible label to point at.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Forwarded to the input. Almost always wrong to set &mdash; see the pitfalls.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>
                  Focuses this radio on load. On a group, only ever on the checked one. Has no default, which is
                  the phantom-attribute bug below.
                </td>
              </tr>
              <tr>
                <td><code>pt</code></td>
                <td>object</td>
                <td>
                  The only route to extra input attributes, e.g. <code>aria-describedby</code>. There is no dedicated
                  input for it.
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Deprecated:</strong> <code>styleClass</code> (<code>:153-158</code>, since upstream v20) — it still
                  compiles, but use plain <code>class</code>. Only <code>size</code>, <code>variant</code> and the
                  inherited <code>name</code>/<code>disabled</code>/<code>required</code>/<code>invalid</code> are
                  signal inputs; the rest are plain <code>&#64;Input</code> properties (<code>:132-168</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Outputs</h3>
        <p>
          Three, and the first surprise is which one is missing: <strong>there is no <code>onChange</code></strong
          >. Use the model, or <code>onClick</code>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>onClick</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>
                  After this radio becomes checked. It never fires for the radio that was <em>un</em>checked as a
                  result, so a group needs one handler per option or a model subscription.
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code></td>
                <td>Event</td>
                <td>The input gained focus.</td>
              </tr>
              <tr>
                <td><code>onBlur</code></td>
                <td>Event</td>
                <td>The input lost focus; the form control is marked touched here.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Forms</h3>
        <p>
          Reactive forms and <code>ngModel</code> both work through the value accessor. Two things do not work the way
          the native element suggests:
        </p>
        <ul>
          <li>
            <strong><code>formControlName</code> does not give you a <code>name</code>.</strong> The
            <code>name</code> input has no fallback to the control's name, so a reactive group with no explicit
            <code>[name]</code> renders inputs with no name attribute &mdash; exclusivity survives through the registry,
            the keyboard contract does not. Bind <code>name</code> alongside <code>formControlName</code>, always.
          </li>
          <li>
            <strong>A native submit does not carry the option value.</strong> The input's <code>value</code> attribute
            is bound to the component's model value, which for a radio is the checked <em>boolean</em> &mdash; measured
            <code>{{ m.nativeValueAttr }}</code> on the checked input and <code>value="false"</code> on its siblings,
            whatever the <code>[value]</code> input said. Read the answer off the Angular form; never off
            <code>FormData</code>.
          </li>
        </ul>
        <pre class="code-block"><code>{{ m.formSnippet }}</code></pre>
        <p class="src-note">
          <code>name</code> is declared on <code>BaseEditableHolder</code> as a bare <code>input()</code> with no
          default; <code>[attr.value]="modelValue()"</code> at <code>openng-optimus-ui-radiobutton.mjs:278</code>, and
          <code>modelValue</code> is written from <code>this.checked</code> at <code>:222</code> and <code>:252</code> (Optimus UI 2.0.2).
        </p>

        <h3>Pitfalls in the shipped implementation</h3>
        <ul>
          <li>
            <strong>Every radio needs a form binding.</strong> <code>onInit</code> resolves <code>NgControl</code> from
            the injector with no fallback value and registers it, so <code>ngModel</code> or
            <code>formControlName</code> is not optional: there is no uncontrolled mode in which the component merely
            draws a checked circle from an attribute.
          </li>
          <li>
            <strong>The phantom <code>autofocus</code> attribute is back.</strong> PrimeNG 22 gave the input a
            <code>false</code> default; Optimus is on the v21 shape again &mdash; <code>autofocus</code> is an
            uninitialized plain <code>&#64;Input</code> (<code>:163</code>) piped into
            <code>[pAutoFocus]="autofocus"</code> (<code>:286</code>), so it arrives <code>undefined</code>, and the
            AutoFocus directive removes the attribute only for a strict <code>false</code>
            (<code>openng-optimus-ui-autofocus.mjs:23-27</code>). Nothing steals focus &mdash; the focus call needs a
            truthy value (<code>:39</code>) &mdash; but every radio renders <code>autofocus="true"</code>. Keep or
            restore the <code>[autofocus]="false"</code> binding.
          </li>
          <li>
            <strong>Never set <code>tabindex="-1"</code> to move the tab stop to a wrapper row.</strong> It is forwarded
            to the input, and it removes the group from the tab order entirely: a keyboard user reaches a focusable
            <code>&lt;div&gt;</code> with no role, arrow keys do nothing, and the roving focus that makes a radio group
            usable is gone. If the whole row should be clickable, use the <code>&lt;label&gt;</code> for that &mdash; it
            is a click target by definition and costs no ARIA.
          </li>
          <li><strong>Two groups, one name, no form.</strong> They merge; see the grouping section above.</li>
          <li>
            <strong><code>value</code> is compared with <code>==</code></strong
            >, not <code>===</code>. Convenient for numeric ids arriving as strings, a trap for <code>0</code>,
            <code>''</code> and <code>null</code>. Objects compare by reference, and there is no
            <code>dataKey</code> here &mdash; bind primitives.
          </li>
          <li>
            <strong><code>[invalid]</code> is a border color and nothing else</strong> &mdash; it adds a
            <code>p-invalid</code> class on the host and no <code>aria-invalid</code>
            anywhere, measured. Put the error in text, reference it from the fieldset with
            <code>aria-describedby</code>, and add <code>[required]</code> if the field really is required &mdash; that
            one does reach the DOM and the accessibility tree.
          </li>
          <li>
            <strong>No <code>ariaDescribedBy</code> input.</strong> Descriptions reach the input only through
            <code>[pt]="&#123; input: &#123; 'aria-describedby': … &#125; &#125;"</code>; an
            <code>[attr.aria-describedby]</code> on the host lands on a custom element with no role and is ignored.
          </li>
          <li>
            <strong>Disabling the checked option hides the answer.</strong> A disabled radio keeps its checked state and
            its value in the model, but the user can no longer see why. Prefer removing the option, or disabling the
            whole group.
          </li>
        </ul>

        <h3>Keyboard</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Result in a named group</th>
                <th>Without a shared name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Enters the group once, landing on the checked radio (or the first, if none is checked), and leaves the
                  whole group on the next press.
                </td>
                <td>Stops on every radio in turn &mdash; measured, one stop per option.</td>
              </tr>
              <tr>
                <td><kbd>&darr;</kbd> / <kbd>&rarr;</kbd></td>
                <td>
                  Moves focus to the next radio <em>and checks it</em>, unchecking the previous one, wrapping at the
                  end.
                </td>
                <td>
                  Focus still moves and the newly focused radio is checked, but nothing is unchecked at the DOM level
                  &mdash; measured on plain nameless inputs, two end up checked. With the component the shared model hides
                  this.
                </td>
              </tr>
              <tr>
                <td><kbd>&uarr;</kbd> / <kbd>&larr;</kbd></td>
                <td>Same, backwards.</td>
                <td>Same as above, backwards.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Checks the focused radio. Never unchecks it.</td>
                <td>Same.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Submits the form, if there is one.</td>
                <td>Same.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          All of it is the browser's native radio-group behavior: <code>openng-optimus-ui-radiobutton.mjs</code>
          binds no key handler at all, so the results are the browser's, not the library's. Arrow keys therefore move
          <em>selection</em>, not just focus &mdash; the standard radio behavior, and the reason a radio group must
          never be used where moving through the options has a side effect.
        </p>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>The role is native.</strong> Each component exposes one <code>radio</code> node from its real input,
            named by its label, with the checked state on it &mdash; measured in the accessibility tree. Nothing at all
            is exposed on the host element: no role, no name, so <code>aria-*</code> written onto
            <code>&lt;p-radiobutton&gt;</code> is inert.
          </li>
          <li>
            <strong>Name each radio with a <code>&lt;label for&gt;</code></strong> pointing at <code>inputId</code>. The
            input is a labelable element, so this is the accessible name and the extra click target in one.
          </li>
          <li>
            <strong>Name the group with a <code>&lt;fieldset&gt;</code> and a <code>&lt;legend&gt;</code>.</strong>
            Where the question is already visible above the group, keep the fieldset and give the legend the
            <code>.sr-only</code> utility with <code>aria-labelledby</code> at the visible text &mdash; the kit's
            convention for grouped form controls (reference: <code>quiz-container.component.ts</code>).
          </li>
          <li>
            <strong>Descriptions go on the input via <code>pt</code></strong
            >, group-level errors on the fieldset via <code>aria-describedby</code>.
          </li>
          <li>
            <strong>Disabled is honest here.</strong> The real <code>disabled</code> attribute means unfocusable and
            announced as disabled &mdash; both measured. But it also means invisible to keyboard users, so any
            explanation must live in text next to the group.
          </li>
          <li>
            <strong>An invalid group announces nothing; a required one does.</strong>
            <code>[invalid]="true"</code> leaves the accessibility tree untouched &mdash; measured with the border
            recolored and the node still reporting valid. What does reach the tree is <code>[required]="true"</code>: a
            real <code>required</code> attribute makes an unanswered group report as invalid through native constraint
            validation. Use <code>required</code> for the semantics and text for the message; never
            <code>[invalid]</code> alone.
          </li>
          <li>
            <strong>Target size:</strong> the box is 20px at the default size (Aura 2.x), under the 24px floor; only
            <code>size="large"</code> reaches 24px. The clickable label and adequate row spacing are what close the gap;
            do not build a radio row without a label.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>&#9744; Every radio in the group carries the same <code>[name]</code>, unique on the page.</li>
          <li>
            &#9744; The group is wrapped in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code> (visible,
            or <code>.sr-only</code> plus <code>aria-labelledby</code>).
          </li>
          <li>&#9744; Every radio has a <code>&lt;label for&gt;</code> pointing at its <code>inputId</code>.</li>
          <li>&#9744; Tabbing into the group takes one press; the arrow keys move the selection.</li>
          <li>&#9744; The focus ring is visible on the box in both modes and is not clipped by an ancestor.</li>
          <li>&#9744; The row is at least 24px tall so the label is a compliant target.</li>
          <li>&#9744; A validation error is text referenced from the fieldset, not just <code>[invalid]</code>.</li>
          <li>
            &#9744; The answer can legitimately never be empty &mdash; otherwise this is a checkbox group or a select.
          </li>
          <li>&#9744; No <code>tabindex</code> anywhere on or around the radios.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>), asserting the two facts most likely to regress &mdash; that the
          name reaches the DOM, and that the group is exclusive:
        </p>
        <pre class="code-block"><code>{{ m.testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Every string on the control is yours</h3>
        <p>
          RadioButton reads nothing from the library translation config &mdash; no
          <code>aria</code> key, no default label, nothing to feed through <code>setTranslation</code>. The three
          strings on a radio group are the legend, the option labels, and any hint text, and all three come from your
          translation layer.
        </p>
        <pre class="code-block"><code>{{ m.i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-radiobutton.mjs</code> references neither the config's translation object nor any
          <code>aria</code> key (re-verified, Optimus UI 2.0.2).
        </p>

        <h3>What must not be translated</h3>
        <ul>
          <li>
            <strong><code>name</code></strong> is machine identity, not text. A translated name breaks the group the
            moment two languages disagree, and a name built by interpolating a translated string is the same bug with
            extra steps.
          </li>
          <li>
            <strong><code>inputId</code> and the <code>&lt;label for&gt;</code></strong> must be derived from the
            option's stable value, never from its label. A language switch that changes ids silently breaks every label
            association on the page.
          </li>
          <li>
            <strong><code>value</code></strong> is what gets stored. If it ever equals the visible label, the persisted
            answer changes with the interface language.
          </li>
        </ul>

        <h3>Label length is a wrapping problem, not a width problem</h3>
        <p>
          This is the one place a radio group is easier to translate than a segmented control: a vertical group absorbs
          a 40% longer translation by growing downward, so nothing overflows and nothing truncates. Two things still
          need attention:
        </p>
        <ul>
          <li>
            <strong>Wrapped labels need top alignment.</strong> With <code>align-items: center</code>, a two-line label
            pushes the circle to the middle of the block. <code>flex-start</code> keeps it beside the first line.
          </li>
          <li>
            <strong>A horizontal group does not absorb anything.</strong> If you laid the options out in a row because
            they fit in English, budget the row for the longest language you ship or stack it instead.
          </li>
        </ul>

        <h3>Rebuild on language change</h3>
        <p>
          Build the option list in a <code>computed()</code> off the translation service so the labels follow a switch;
          keep <code>track</code> on the option value, so the rows are not destroyed and rebuilt and focus inside the
          group survives. Because the ids and the name are derived from the value rather than the label, nothing else
          has to change.
        </p>

        <h3>Easy-language and RTL</h3>
        <ul>
          <li>
            <strong>Easy-language variants</strong> want one short answer per option and the question spelled out in the
            legend. Where a plain-language label needs a sentence, put the sentence in a hint line under the label
            rather than growing the label &mdash; the click target stays the size of an answer, not of a paragraph.
          </li>
          <li>
            <strong>RTL is handled by the shipped CSS.</strong> The input is positioned with
            <code>inset-inline-start</code>, so the box mirrors without work. What does not mirror by itself is your
            row: use <code>flex-direction: row</code> with logical padding rather than a hard-coded
            <code>margin-left</code>, and the circle moves to the correct side of the label.
          </li>
        </ul>
        <p class="src-note">
          <code>.p-radiobutton-input &#123; inset-inline-start: 0 &#125;</code> in
          <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code>. This kit ships LTR languages only, so the RTL
          note is for downstream extensions.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the focus ring is the kit's
            2px <code>--primary-color-fg</code> ring (was Aura's 1px), cited from "focus ring"; the invalid edge is
            <code>--semantic-red-fg</code>; the contrast-accent dark-mode exception is gone (the dark widget ramp comes
            from each palette's dark foreground), so the WCAG roll-up lists no failure; dark rows re-quoted.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): contrast rows now say what they rest
            on and cite the contrast gate — the unchecked ring now on the kit's <code>--control-border</code>
            (lowest 3.85:1, was 1.48:1 on Aura's token), the checked rows per accent with the contrast-accent dark-mode
            exception named, the label from <code>body text</code>; the kit's one radio rule documented; stale "do not copy" warning on the reference implementation removed; narrow-screen statement added;
            misplaced visual-style boilerplate removed from the agent doc, which is trimmed under the size aim.
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 2026-09-02 &mdash; Re-based on Optimus UI 2.0.2 (ADR-0014): the box scale is
            back on the Aura 2.x tokens (16/20/24px), so <code>size="large"</code> is a compliant 24px target again,
            and three v22 claims flipped &mdash; <code>styleClass</code> exists as <code>&#64;deprecated</code>,
            <code>inputStyle</code> is still read alongside <code>inputVariant</code>, and the phantom
            <code>autofocus="true"</code> attribute is back because the input is an uninitialized plain
            <code>&#64;Input</code> again. Most inputs are plain properties, not signals; all line refs re-derived
            against the Optimus bundles. Color and browser measurements from 21 carry unchanged.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 2026-08-24 &mdash; Re-verified against PrimeNG 22.1.2 / Aura 3.0: box scale
            shrank to 14/18/20px &mdash; no size reaches the 24px SC 2.5.8 target any more (2.x large hit it exactly);
            the phantom <code>autofocus</code>-attribute bug is fixed upstream (default is now exactly
            <code>false</code>); <code>styleClass</code> removed, inputs are signal inputs,
            <code>tabindex</code> number-typed, selector gained a <code>p-radio-button</code> alias; all line refs
            re-derived. Color measurements from 21 carry &mdash; the radiobutton color tokens are unchanged.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 2026-08-20 &mdash; WCAG 2.2 status roll-up added to the design tab: measured
            criteria summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 2026-07-30 &mdash; Initial guide: examples, the control-choice boundary
            against every neighboring control, the three grouping mechanisms, design tokens and contrast, i18n, and the
            canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class RadioButtonArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  readonly copiedId = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Option sets -----------------------------------------------------------
  readonly twoOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];
  readonly shippingOptions = [
    { label: 'Standard, 3-5 days', value: 'standard' },
    { label: 'Express, next day', value: 'express' },
    { label: 'Collect in store', value: 'pickup' },
  ];
  readonly planOptions = [
    { label: 'Free', value: 'free', hint: 'One project, community support.' },
    { label: 'Team', value: 'team', hint: 'Ten projects, shared workspaces.' },
    { label: 'Business', value: 'business', hint: 'Unlimited projects, priority support.' },
  ];
  readonly seatOptions = [
    { label: 'Aisle', value: 'aisle', soldOut: false },
    { label: 'Middle', value: 'middle', soldOut: false },
    { label: 'Window (sold out)', value: 'window', soldOut: true },
  ];
  readonly reasonOptions = [
    { label: 'Too expensive', value: 'price' },
    { label: 'Missing a feature', value: 'feature' },
    { label: 'Something else', value: 'other' },
  ];
  readonly billingOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Pay as you go', value: 'payg' },
  ];
  readonly contactOptions = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Post', value: 'post' },
  ];
  readonly countryOptions = [
    { label: 'Austria', value: 'at' },
    { label: 'Belgium', value: 'be' },
    { label: 'Denmark', value: 'dk' },
    { label: 'Germany', value: 'de' },
    { label: 'Liechtenstein', value: 'li' },
    { label: 'Luxembourg', value: 'lu' },
    { label: 'Netherlands', value: 'nl' },
    { label: 'Sweden', value: 'se' },
    { label: 'Switzerland', value: 'ch' },
  ];

  readonly sizeRows: { key: 'sm' | 'md' | 'lg'; label: string; size: 'small' | 'large' | undefined }[] = [
    { key: 'sm', label: 'small', size: 'small' },
    { key: 'md', label: 'default', size: undefined },
    { key: 'lg', label: 'large', size: 'large' },
  ];

  // --- Example state ---------------------------------------------------------
  readonly shipping = signal('express');
  readonly plan = signal('team');
  readonly seat = signal('aisle');
  readonly invalidValue = signal<string | null>(null);
  readonly reason = signal('feature');
  readonly reasonText = signal('');
  readonly varOutlined = signal('yes');
  readonly varFilled = signal('yes');
  readonly sizeValues = signal<Record<'sm' | 'md' | 'lg', string>>({ sm: 'yes', md: 'yes', lg: 'yes' });

  setSizeValue(key: 'sm' | 'md' | 'lg', value: string): void {
    this.sizeValues.update((v) => ({ ...v, [key]: value }));
  }

  onReasonText(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.reasonText.set(target?.value ?? '');
  }

  // --- Do / Don't state ------------------------------------------------------
  readonly ddBad = signal('monthly');
  readonly ddGood = signal('monthly');
  readonly ddLone = signal(false);
  readonly ddConsent = signal(false);
  readonly ddMany = signal('de');
  readonly ddSelect = signal('de');
  readonly ddNoGroup = signal('email');
  readonly ddGroup = signal('email');

  // --- Playground ------------------------------------------------------------
  readonly countOptions = [
    { label: '2 options', value: 2 },
    { label: '3 options', value: 3 },
    { label: '5 options', value: 5 },
  ];
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];
  readonly layoutOptions = [
    { label: 'Stacked', value: 'column' },
    { label: 'Row', value: 'row' },
  ];

  readonly pgCount = signal(3);
  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgLayout = signal<'column' | 'row'>('column');
  readonly pgFilled = signal(false);
  readonly pgInvalid = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<string>('express');

  protected readonly pgPool = [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Collect in store', value: 'pickup' },
    { label: 'Courier', value: 'courier' },
    { label: 'Locker', value: 'locker' },
  ];

  readonly pgOptions = computed(() => this.pgPool.slice(0, this.pgCount()));

  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  readonly pgReadout = computed(() => JSON.stringify(this.pgValue()));

  readonly pgCode = computed(() => {
    const attrs: string[] = ['name="delivery"', '[inputId]="\'delivery-\' + o.value"', '[value]="o.value"'];
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgFilled()) attrs.push('variant="filled"');
    if (this.pgInvalid()) attrs.push('[invalid]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(ngModel)]="delivery"');
    const dir = this.pgLayout() === 'row' ? ' class="row"' : '';
    return `<fieldset${dir}>
  <legend>{{ labels().delivery }}</legend>
  @for (o of deliveryOptions(); track o.value) {
    <div class="rb-row">
      <p-radiobutton
        ${attrs.join('\n        ')} />
      <label [for]="'delivery-' + o.value">{{ o.label }}</label>
    </div>
  }
</fieldset>`;
  });

  // --- Examples --------------------------------------------------------------
  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'canonical',
      title: 'The canonical group',
      note: 'Fieldset, legend, one shared name, one label per option. Tab into it once and use the arrow keys — that is the whole contract.',
      code: `<fieldset class="rb-group">
  <legend>{{ labels().deliverySpeed }}</legend>
  @for (o of shippingOptions(); track o.value) {
    <div class="rb-row">
      <p-radiobutton name="shipping" [inputId]="'ship-' + o.value"
        [value]="o.value" [(ngModel)]="shipping" />
      <label [for]="'ship-' + o.value">{{ o.label }}</label>
    </div>
  }
</fieldset>`,
    },
    {
      id: 'describe',
      title: 'Options with a description',
      note: 'The detail belongs beside the label, not inside it, so the click target stays the size of an answer. There is no ariaDescribedBy input — pt is the route.',
      code: `<div class="rb-row">
  <p-radiobutton name="plan" [inputId]="'plan-' + o.value" [value]="o.value"
    [pt]="{ input: { 'aria-describedby': 'plan-' + o.value + '-hint' } }"
    [(ngModel)]="plan" />
  <div class="rb-text">
    <label [for]="'plan-' + o.value">{{ o.label }}</label>
    <span class="rb-hint" [id]="'plan-' + o.value + '-hint'">{{ o.hint }}</span>
  </div>
</div>`,
    },
    {
      id: 'sizes',
      title: 'Sizes: small, default, large',
      note: 'The size input resizes the box and the dot and touches nothing else — the row height, the gap, and the label are yours in all three.',
      code: `<p-radiobutton size="small" name="a" [value]="o.value" [(ngModel)]="v" />
<p-radiobutton name="b" [value]="o.value" [(ngModel)]="v" />
<p-radiobutton size="large" name="c" [value]="o.value" [(ngModel)]="v" />`,
    },
    {
      id: 'variant',
      title: 'Outlined and filled',
      note: 'The variant changes the unchecked background only; a checked radio looks identical either way. Set it per component, or globally via the inputStyle / inputVariant config.',
      code: `<p-radiobutton variant="filled" name="plan" [value]="o.value" [(ngModel)]="plan" />`,
    },
    {
      id: 'states',
      title: 'One option disabled, an invalid group, a disabled group',
      note: 'Top: a disabled option is a real disabled input — tab through and note that it is skipped, unlike a disabled segmented-control segment. Middle: [invalid] recolors the ring and announces nothing, so the message below is referenced from the fieldset. Bottom: the whole group disabled, keeping its answer visible.',
      code: `<p-radiobutton name="seat" [value]="o.value" [disabled]="o.soldOut" [(ngModel)]="seat" />

<fieldset aria-describedby="seat-error">
  <p-radiobutton name="cover" [value]="o.value" [invalid]="true" [required]="true"
    [(ngModel)]="cover" />
</fieldset>
<p id="seat-error">Choose one to continue.</p>`,
    },
    {
      id: 'other',
      title: 'An option that opens a follow-up',
      note: 'The classic "Other" row. Keep the extra field inside the fieldset and after the option it belongs to, so the reading order matches the visual one.',
      code: `@if (reason() === 'other') {
  <div class="rb-followup">
    <label for="reason-other-text">{{ labels().tellUsMore }}</label>
    <input id="reason-other-text" type="text" [(ngModel)]="reasonText" />
  </div>
}`,
    },
  ];

  /**
   * Measured values and code samples referenced from the tabs.
   *
   * Contrast ratios and box sizes are computed styles, both modes; DOM and
   * semantics readings are attribute values and accessibility-tree properties.
   * The token sources they check against are cited beside each table.
   */
  readonly m = {
    // docs/generated/CONTRAST.MD, werkbund, sunset accent, on --surface-card:
    // "checkbox & radiobutton" (edge, primary.color, icon on checked),
    // "focus ring" (the kit ring) and "body text" (label).
    uncheckedBorderLight: '5.23:1',
    uncheckedBorderDark: '4.91:1',
    checkedFillLight: '5.18:1',
    checkedFillDark: '7.42:1',
    dotLight: '5.18:1',
    dotDark: '7.83:1',
    focusRingLight: '5.18:1',
    focusRingDark: '7.42:1',
    labelLight: '18.73:1',
    labelDark: '14.86:1',
    // Aura 2.x token-derived (1:1 width/height tokens).
    boxSmall: '16 x 16px',
    boxDefault: '20 x 20px',
    boxLarge: '24 x 24px',
    disabledOpacity: '1, not the global 0.6',
    focusOutline: '2px solid var(--primary-color-fg), the kit ring',
    focusOffset: '2px, with no box-shadow',
    nativeValueAttr: 'value="true"',

    devImport: `import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';

@Component({
  standalone: true,
  imports: [RadioButtonModule, FormsModule],
  // ...
})`,

    formSnippet: `// Reactive forms: bind name AND formControlName. The control name is not
// used as the DOM name, so without this the group loses its arrow keys.
form = new FormGroup({
  shipping: new FormControl<'standard' | 'express' | 'pickup'>('standard', { nonNullable: true }),
});

// template
@for (o of shippingOptions(); track o.value) {
  <div class="rb-row">
    <p-radiobutton name="shipping" formControlName="shipping"
      [inputId]="'ship-' + o.value" [value]="o.value" />
    <label [for]="'ship-' + o.value">{{ o.label }}</label>
  </div>
}`,

    i18nSnippet: `// Labels follow the language; ids, name, and value are derived from the
// stable option value and never from the translated text.
readonly shippingOptions = computed(() => [
  { value: 'standard', label: this.t('checkout.shipping.standard') },
  { value: 'express', label: this.t('checkout.shipping.express') },
  { value: 'pickup', label: this.t('checkout.shipping.pickup') },
]);

// template
<fieldset class="rb-group">
  <legend>{{ t('checkout.shipping.legend') }}</legend>
  @for (o of shippingOptions(); track o.value) {
    <div class="rb-row">
      <p-radiobutton name="shipping" [inputId]="'ship-' + o.value"
        [value]="o.value" [(ngModel)]="shipping" />
      <label [for]="'ship-' + o.value">{{ o.label }}</label>
    </div>
  }
</fieldset>`,

    testSnippet: `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';

@Component({
  standalone: true,
  imports: [RadioButtonModule, FormsModule],
  template: \`@for (o of options; track o.value) {
    <p-radiobutton name="ship" [inputId]="o.value" [value]="o.value"
      [ngModel]="value()" (ngModelChange)="value.set($event)" />
  }\`,
})
class HostComponent {
  options = [{ value: 'standard' }, { value: 'express' }];
  value = signal('standard');
}

describe('p-radiobutton grouping', () => {
  it('puts the shared name on every input, so the browser groups them', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type=radio]');
    expect(inputs.length).toBe(2);
    expect([...inputs].every((i: HTMLInputElement) => i.name === 'ship')).toBe(true);
  });

  it('keeps exactly one input checked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type=radio]');
    inputs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('express');
    expect([...inputs].filter((i: HTMLInputElement) => i.checked).length).toBe(1);
  });
});`,
  };

  copy(id: string, text: string): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copiedId.set(id);
        if (this.copyTimer !== null) clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copiedId.set(null);
          this.copyTimer = null;
        }, 1500);
      },
      () => {
        /* clipboard denied - leave the label unchanged */
      },
    );
  }
}
