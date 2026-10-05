import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { PasswordModule } from '@openng/optimus-ui/password';
import { InputOtpModule } from '@openng/optimus-ui/inputotp';
import { KeyFilterModule } from '@openng/optimus-ui/keyfilter';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    InputTextModule,
    TextareaModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    InputMaskModule,
    PasswordModule,
    InputOtpModule,
    KeyFilterModule,
    ButtonModule,
    SelectModule,
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
      ul {
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

      /* --- Form field scaffold shared by every live example --- */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 12rem;
      }
      .field--wide {
        width: 100%;
      }
      .field__label {
        font-size: 0.85rem;
        font-weight: var(--font-weight-medium);
        color: var(--text-color);
      }
      .field__hint {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .field__error {
        font-size: var(--font-size-sm);
        color: var(--semantic-red-fg);
      }
      .field textarea {
        font-family: inherit;
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
      .pg__stage .field {
        width: 100%;
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
        border-left: 3px solid var(--semantic-red-fg);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__stage > * {
        min-width: 0;
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
 * Guide article: Text inputs — pInputText, pTextarea, p-inputgroup (SPEC N5).
 *
 * A collection guide: the three ship as one story because the decisions that
 * matter are the boundaries between them (one line vs many, decoration vs
 * semantics) and because all three resolve the SAME Aura token family.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Optimus UI 2.0.2 (@openng/optimus-ui, MIT fork of the PrimeNG 21 code
 *     base) with @openng/optimus-ui-themes 2.0.2; preset Aura with
 *     darkModeSelector '.dark-theme' and inputVariant 'outlined'
 *     (app.config.ts, provideOptimus).
 *   - pInputText and pTextarea are DIRECTIVES on native elements: root classes
 *     'p-inputtext p-component' and 'p-textarea p-component' respectively
 *     (openng-optimus-ui-inputtext.mjs / openng-optimus-ui-textarea.mjs, classes.root). Neither is
 *     a ControlValueAccessor - forms binding runs through Angular's native
 *     DefaultValueAccessor on the input/textarea element.
 *   - Aura's inputtext and textarea token maps are byte-identical: every entry
 *     resolves the same {form.field.*} slot
 *     (@openng/optimus-ui-themes/dist/aura/inputtext|textarea/index.mjs).
 *   - form.field.focusRing is width 0 / style none / color transparent
 *     (@openng/optimus-ui-themes/dist/aura/base/index.mjs), so the only Aura focus
 *     signal on a text field is focusBorderColor.
 *   - Kit rules in styles.scss: '.dark-theme .p-inputtext' re-points four
 *     element tokens (background, color, border-color, placeholder) — no
 *     !important, so the state rules keep reading their own tokens; the focus
 *     family rule '.p-inputtext:focus-visible, .p-textarea:focus-visible'
 *     draws the kit ring (2px solid --primary-color-fg, offset 2px,
 *     !important) in both modes; and every html.style-* block sets
 *     border-color (plus width, radius in two styles) on 'input.p-inputtext',
 *     which outranks '.p-inputtext.p-invalid' (dark Lernwerkstatt takes
 *     --control-border there) — so the kit adds 'input.p-inputtext.p-invalid'
 *     (--semantic-red-fg, !important) and re-points both invalid tokens to it.
 *     '.p-textarea' re-points its own resting border
 *     token to --control-border in both modes, and '.dark-theme .p-textarea'
 *     gives it the input's dark fill, text, and placeholder
 *     (--surface-section, --text-color, --control-placeholder). Edge, text, and placeholder
 *     pairs are gated in docs/generated/CONTRAST.MD ("form field edge",
 *     "form field text").
 *   - Aura's form-field colors come from its stock slate/zinc surface palette;
 *     the visual styles override radii and the primary accent only.
 *   - p-inputgroup renders a roleless flex container (width 100%) and
 *     p-inputgroup-addon a roleless flex cell; the addon contributes nothing to
 *     the input's accessible name (@openng/optimus-ui-styles/dist/inputgroup/index.mjs
 *     plus the class maps in openng-optimus-ui-inputgroup.mjs / openng-optimus-ui-inputgroupaddon.mjs).
 *   - Textarea autoResize compares scrollHeight against the element's INLINE
 *     style.maxHeight (openng-optimus-ui-textarea.mjs, resize()).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-text-inputs-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'text-inputs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Three building blocks, one story: <code>pInputText</code> for one line, <code>pTextarea</code> for many,
          <code>p-inputgroup</code> to weld an addon onto either. Every field below is real markup — start in the
          playground, then read the variants underneath.
        </p>

        <!-- Mini playground: live-configure a field and read back the markup. -->
        <section class="pg" aria-label="Text input playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <!-- p-select is named through [ariaLabelledBy]: its focusable element is a
                   <span role="combobox">, which a <label for> cannot bind to. The Select
                   guide's naming table covers all three patterns. -->
              <div class="pg__field">
                <span class="pg__label" id="pg-kind-label">Control</span>
                <p-select
                  [ariaLabelledBy]="'pg-kind-label'"
                  size="small"
                  [options]="kindOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgKind()"
                  (ngModelChange)="pgKind.set($event)"
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
                <span class="pg__label" id="pg-addon-label">Addon</span>
                <p-select
                  [ariaLabelledBy]="'pg-addon-label'"
                  size="small"
                  [options]="addonOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAddon()"
                  (ngModelChange)="pgAddon.set($event)"
                />
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
                <div class="field" data-pg-stage>
                  <label class="field__label" for="pg-preview">Project title</label>
                  @if (pgAddon() === 'none') {
                    @if (pgKind() === 'input') {
                      <input
                        pInputText
                        id="pg-preview"
                        type="text"
                        placeholder="Type here"
                        [pSize]="pgSizeInput()"
                        [invalid]="pgInvalid()"
                        [attr.aria-invalid]="pgInvalid() || null"
                        [disabled]="pgDisabled()"
                      />
                    } @else {
                      <textarea
                        pTextarea
                        id="pg-preview"
                        rows="3"
                        placeholder="Type here"
                        [pSize]="pgSizeInput()!"
                        [invalid]="pgInvalid()"
                        [attr.aria-invalid]="pgInvalid() || null"
                        [disabled]="pgDisabled()"
                      ></textarea>
                    }
                  } @else {
                    <p-inputgroup>
                      @if (pgAddon() === 'prefix') {
                        <p-inputgroup-addon><i class="pi pi-search" aria-hidden="true"></i></p-inputgroup-addon>
                      }
                      @if (pgKind() === 'input') {
                        <input
                          pInputText
                          id="pg-preview"
                          type="text"
                          placeholder="Type here"
                          [pSize]="pgSizeInput()"
                          [invalid]="pgInvalid()"
                          [attr.aria-invalid]="pgInvalid() || null"
                          [disabled]="pgDisabled()"
                        />
                      } @else {
                        <textarea
                          pTextarea
                          id="pg-preview"
                          rows="3"
                          placeholder="Type here"
                          [pSize]="pgSizeInput()!"
                          [invalid]="pgInvalid()"
                          [attr.aria-invalid]="pgInvalid() || null"
                          [disabled]="pgDisabled()"
                        ></textarea>
                      }
                      @if (pgAddon() === 'suffix') {
                        <p-inputgroup-addon>EUR</p-inputgroup-addon>
                      }
                      @if (pgAddon() === 'button') {
                        <p-inputgroup-addon>
                          <p-button icon="pi pi-arrow-right" ariaLabel="Apply" [disabled]="pgDisabled()" />
                        </p-inputgroup-addon>
                      }
                    </p-inputgroup>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- Static variants: each rendered next to the exact markup. -->
        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('basic') {
                  <div class="field">
                    <label class="field__label" for="ex-city">City</label>
                    <input pInputText id="ex-city" type="text" autocomplete="address-level2" />
                    <small class="field__hint" id="ex-city-hint">Where the invoice is sent.</small>
                  </div>
                }
                @case ('sizes') {
                  <div class="field">
                    <label class="field__label" for="ex-small">Small</label>
                    <input pInputText id="ex-small" type="text" pSize="small" placeholder="pSize=small" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-normal">Default</label>
                    <input pInputText id="ex-normal" type="text" placeholder="no pSize" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-large">Large</label>
                    <input pInputText id="ex-large" type="text" pSize="large" placeholder="pSize=large" />
                  </div>
                }
                @case ('multiline') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-address">Postal address</label>
                    <textarea
                      pTextarea
                      id="ex-address"
                      rows="4"
                      autocomplete="street-address"
                      placeholder="Street and number&#10;Postcode and town&#10;Country"
                    ></textarea>
                    <small class="field__hint">One field, four lines — an address is not a single line.</small>
                  </div>
                }
                @case ('autoresize') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-auto">Release note (grows as you type)</label>
                    <textarea
                      pTextarea
                      id="ex-auto"
                      rows="2"
                      autoResize
                      style="max-height: 160px"
                      [ngModel]="noteText()"
                      (ngModelChange)="noteText.set($event)"
                      [attr.aria-describedby]="'ex-auto-count'"
                      placeholder="Type a few lines and watch the box follow"
                    ></textarea>
                    <small class="field__hint" id="ex-auto-count" aria-live="polite">
                      {{ noteText().length }} characters
                    </small>
                  </div>
                }
                @case ('group-prefix') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-search">Search the glossary</label>
                    <p-inputgroup>
                      <p-inputgroup-addon><i class="pi pi-search" aria-hidden="true"></i></p-inputgroup-addon>
                      <input
                        pInputText
                        id="ex-search"
                        type="search"
                        [ngModel]="searchText()"
                        (ngModelChange)="searchText.set($event)"
                        placeholder="Type a term"
                      />
                      @if (searchText()) {
                        <p-inputgroup-addon>
                          <p-button
                            icon="pi pi-times"
                            severity="secondary"
                            [text]="true"
                            ariaLabel="Clear the search field"
                            (onClick)="searchText.set('')"
                          />
                        </p-inputgroup-addon>
                      }
                    </p-inputgroup>
                  </div>
                }
                @case ('group-suffix') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-budget">Monthly budget in euro</label>
                    <p-inputgroup>
                      <p-inputgroup-addon>EUR</p-inputgroup-addon>
                      <input
                        pInputText
                        id="ex-budget"
                        type="text"
                        inputmode="decimal"
                        [attr.aria-describedby]="'ex-budget-hint'"
                      />
                    </p-inputgroup>
                    <small class="field__hint" id="ex-budget-hint">
                      The unit is repeated in the label, because the addon is not announced.
                    </small>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <label class="field__label" for="ex-invalid">Invalid</label>
                    <input
                      pInputText
                      id="ex-invalid"
                      type="text"
                      [invalid]="true"
                      [attr.aria-invalid]="true"
                      [attr.aria-describedby]="'ex-invalid-msg'"
                      value="not-an-email"
                    />
                    <small class="field__error" id="ex-invalid-msg">
                      Enter an address in the form name&#64;example.org.
                    </small>
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-readonly">Read-only</label>
                    <input pInputText id="ex-readonly" type="text" readonly value="INV-2026-0042" />
                  </div>
                  <div class="field">
                    <label class="field__label" for="ex-disabled">Disabled</label>
                    <input pInputText id="ex-disabled" type="text" disabled value="Locked" />
                  </div>
                }
                @case ('fluid') {
                  <div class="field field--wide">
                    <label class="field__label" for="ex-fluid">Full-width field</label>
                    <input
                      pInputText
                      id="ex-fluid"
                      type="text"
                      [fluid]="true"
                      placeholder="fluid stretches to 100% of the container"
                    />
                  </div>
                }
                @case ('icon-field') {
                  <div class="field">
                    <label class="field__label" for="ex-icon-lead">Icon before the text</label>
                    <p-iconfield>
                      <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                      <input pInputText id="ex-icon-lead" type="search" placeholder="Glossary" />
                    </p-iconfield>
                    <label class="field__label" for="ex-icon-trail">Icon after the text</label>
                    <p-iconfield>
                      <input pInputText id="ex-icon-trail" type="text" placeholder="Amount" />
                      <p-inputicon><i class="pi pi-euro" aria-hidden="true"></i></p-inputicon>
                    </p-iconfield>
                  </div>
                }
                @case ('mask') {
                  <div class="field">
                    <label class="field__label" for="ex-mask">Telephone</label>
                    <p-inputmask
                      inputId="ex-mask"
                      mask="+49 999 9999999"
                      placeholder="+49 ___ _______"
                      [ngModel]="maskValue()"
                      (ngModelChange)="maskValue.set($event)"
                    />
                    <small class="field__hint">
                      Without <code>unmask</code> the bound value keeps the literal characters of the mask.
                    </small>
                  </div>
                }
                @case ('password') {
                  <div class="field">
                    <label class="field__label" for="ex-password">New password</label>
                    <p-password
                      inputId="ex-password"
                      [toggleMask]="true"
                      [feedback]="true"
                      autocomplete="new-password"
                      [ngModel]="secret()"
                      (ngModelChange)="secret.set($event)"
                    />
                    <small class="field__hint">Focus the field to open the strength overlay.</small>
                  </div>
                }
                @case ('otp') {
                  <div class="field">
                    <span class="field__label" id="ex-otp-label">Security code</span>
                    <div role="group" aria-labelledby="ex-otp-label" aria-describedby="ex-otp-hint">
                      <p-inputOtp [length]="6" [integerOnly]="true" [ngModel]="otp()" (ngModelChange)="otp.set($event)" />
                    </div>
                    <small class="field__hint" id="ex-otp-hint">
                      Six digits. Paste into the first box to fill all six.
                    </small>
                  </div>
                }
                @case ('keyfilter') {
                  <div class="field">
                    <label class="field__label" for="ex-keyfilter">Whole number only</label>
                    <input
                      pInputText
                      id="ex-keyfilter"
                      type="text"
                      inputmode="numeric"
                      pKeyFilter="int"
                      placeholder="Letters are refused as you type"
                    />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which control?</h3>
        <p>
          A text field is the fallback, not the default. Reach for it when the answer is
          <strong>free text the system cannot enumerate</strong>. Everything else has a better control, and the wrong
          one costs the user typing, validation errors, or both.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The answer is…</th>
                <th>Control</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Free text, one line (name, title, search term)</td>
                <td><code>&lt;input pInputText&gt;</code></td>
                <td>The default. One line signals "short answer expected".</td>
              </tr>
              <tr>
                <td>Free text, several lines (address, comment, description)</td>
                <td><code>&lt;textarea pTextarea&gt;</code></td>
                <td>Line breaks survive, the box shows how much is expected, and the text is readable back.</td>
              </tr>
              <tr>
                <td>Free text plus a fixed unit, symbol, or action</td>
                <td>either, wrapped in <code>p-inputgroup</code></td>
                <td>Layout only — it welds an addon to the field's edge. It adds no semantics (see below).</td>
              </tr>
              <tr>
                <td>One of a known, closed list</td>
                <td><code>p-select</code></td>
                <td>Typing a value the system already knows is data entry the user should not have to do.</td>
              </tr>
              <tr>
                <td>A known list too long to browse, or a remote lookup</td>
                <td><code>p-autocomplete</code></td>
                <td>Typing narrows a list; the committed value is still constrained.</td>
              </tr>
              <tr>
                <td>A number that is measured or counted</td>
                <td><code>p-inputnumber</code></td>
                <td>
                  Locale-aware grouping and decimal separators, spinner keys, min/max — none of which a text field has.
                </td>
              </tr>
              <tr>
                <td>A number the user picks approximately</td>
                <td><code>p-slider</code></td>
                <td>See the Slider guide for the trade against a numeric field.</td>
              </tr>
              <tr>
                <td>A secret</td>
                <td><code>p-password</code></td>
                <td>
                  Masking plus a reveal toggle and an optional strength meter;
                  <code>&lt;input type="password" pInputText&gt;</code> gives you masking and nothing else.
                </td>
              </tr>
              <tr>
                <td>Yes/no</td>
                <td><code>p-checkbox</code> or <code>p-toggleswitch</code></td>
                <td>Never a text field asking for "yes".</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Five more neighbors are easy to overlook, and the first one competes directly with the search field further
          up this page:
        </p>
        <ul>
          <li>
            <code>p-iconfield</code> — an icon <em>inside</em> the field's own box, not a separate cell. Prefer it over
            an <code>p-inputgroup</code> addon whenever the icon is decoration on one field: there is no roleless extra
            element, no squared corner, and no full-width group to constrain.
          </li>
          <li>
            <code>p-inputmask</code> — a value with a fixed written format: a telephone number, an IBAN, a license key.
            The mask guides typing instead of rejecting it afterwards; see the constrained-inputs guide for its
            contract, and for <code>p-password</code> and <code>[pKeyFilter]</code> alongside it.
          </li>
          <li>
            <code>p-inputotp</code> — a one-time code, as separate boxes with the paste and auto-advance behavior users
            expect (the <code>autocomplete="one-time-code"</code> hint reaches the boxes only through <code>pt</code>; there is no input for it).
          </li>
          <li>
            <code>p-datepicker</code> — a date. Never a text field: date formats are the single most locale-dependent
            thing a user can type.
          </li>
          <li>
            <code>p-editor</code> — the ceiling of a textarea. The moment the answer needs headings, links, or lists,
            plain text is the wrong container.
          </li>
        </ul>
        <p class="src-note">
          Every component named on this page ships with Optimus UI 2.0.2 and needs no extra dependency — each is its own
          entry point (<code>&#64;openng/optimus-ui/iconfield</code>,
          <code>&#8230;/inputmask</code>, <code>&#8230;/inputnumber</code>, <code>&#8230;/password</code>,
          <code>&#8230;/autocomplete</code>, and so on). The Autocomplete guide is planned; until it lands, the Select
          guide's control-choice table covers the select/autocomplete boundary, and the Slider guide covers slider
          versus numeric field.
        </p>

        <h3>One line or many?</h3>
        <p>
          The decision is not "how long is the value" but <strong>can it contain a line break</strong>. A single-line
          <code>&lt;input&gt;</code> silently strips pasted newlines and scrolls horizontally, so the user can never see
          what they typed. The classic casualty is the <strong>postal address</strong>: it is multi-line by definition,
          and squeezing it into one field forces the user to invent a separator and makes the value unparseable
          afterwards. Either split it into labeled single-line fields (street, postcode, town, country) or give it one
          <code>pTextarea</code> — never one <code>pInputText</code>.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          The rendered pairs below are the three failures worth memorizing. The
          <span class="tag tag--bad">Don't</span> is on the left, the <span class="tag tag--good">Do</span> on the
          right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the placeholder is the label</span>
            <div class="dd__stage">
              <input pInputText type="text" placeholder="Full name" aria-label="Full name" />
            </div>
            <p class="dd__why">
              The caption vanishes the moment the user types, so nobody can check what the field was for — and
              low-contrast gray is not a label's contrast budget.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a persistent label, placeholder as an example</span>
            <div class="dd__stage">
              <div class="field">
                <label class="field__label" for="dd-name">Full name</label>
                <input pInputText id="dd-name" type="text" placeholder="Ada Lovelace" autocomplete="name" />
              </div>
            </div>
            <p class="dd__why">
              The label stays. If the placeholder disappears, nothing is lost — it only ever showed the expected shape.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an address on one line</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-addr-bad">Address</label>
                <input pInputText id="dd-addr-bad" type="text" value="Hauptstrasse 12, 10115 Berlin, Deutschland" />
              </div>
            </div>
            <p class="dd__why">
              The value scrolls out of sight, pasted line breaks are dropped, and the comma convention is the user's
              guess, not a format.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a textarea sized to the answer</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-addr-good">Address</label>
                <textarea pTextarea id="dd-addr-good" rows="3" autocomplete="street-address">
Hauptstrasse 12
10115 Berlin
Deutschland</textarea>
              </div>
            </div>
            <p class="dd__why">
              <code>rows</code> shows how much is expected, line breaks survive, and the whole value is readable at
              once.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an addon carrying the meaning</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-unit-bad">Budget</label>
                <p-inputgroup>
                  <p-inputgroup-addon>EUR</p-inputgroup-addon>
                  <input pInputText id="dd-unit-bad" type="text" inputmode="decimal" />
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">
              The addon is a roleless box. A screen reader announces "Budget, edit" — the currency is invisible to it,
              so the number is ambiguous.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the meaning in the label, the addon as decoration</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-unit-good">Budget in euro</label>
                <p-inputgroup>
                  <p-inputgroup-addon>EUR</p-inputgroup-addon>
                  <input pInputText id="dd-unit-good" type="text" inputmode="decimal" />
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">The label carries the unit; the addon repeats it visually. Both audiences get it.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the reveal that only a mouse can reach</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-pw-bad">Password</label>
                <p-password inputId="dd-pw-bad" [toggleMask]="true" [feedback]="false" autocomplete="off" />
              </div>
            </div>
            <p class="dd__why">
              <code>toggleMask</code> renders the eye as an <code>svg</code> with a click handler. It is not a button,
              it takes no focus, and it has no name, so the value cannot be revealed from the keyboard at all.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a real button beside the field</span>
            <div class="dd__stage">
              <div class="field field--wide">
                <label class="field__label" for="dd-pw-good">Password</label>
                <p-inputgroup>
                  <input
                    pInputText
                    id="dd-pw-good"
                    [attr.type]="revealed() ? 'text' : 'password'"
                    autocomplete="off"
                  />
                  <p-inputgroup-addon>
                    <p-button
                      [icon]="revealed() ? 'pi pi-eye-slash' : 'pi pi-eye'"
                      severity="secondary"
                      [text]="true"
                      [ariaLabel]="revealed() ? 'Hide the password' : 'Show the password'"
                      (onClick)="revealed.set(!revealed())"
                    />
                  </p-inputgroup-addon>
                </p-inputgroup>
              </div>
            </div>
            <p class="dd__why">
              A <code>&lt;button&gt;</code> is focusable, has a name that changes with the state, and answers Enter and
              Space. The strength meter, if you need one, goes in described text under the field.
            </p>
          </div>
        </div>

        <h3>Five neighbors, and where each one stops</h3>
        <p>
          Each of these is a text field with one extra idea welded on. The extra idea is also where each of them ends:
          read the third column before you pick one, because none of them can be talked out of it.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>The one idea it adds</th>
                <th>Where it stops</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-iconfield</code> + <code>p-inputicon</code></td>
                <td>An icon inside the field's own box, positioned by padding rather than by an extra cell.</td>
                <td>
                  The icon element is roleless and carries no name — decoration only. Which edge it sits on is decided
                  by document order (see Design).
                </td>
              </tr>
              <tr>
                <td><code>p-inputmask</code> / <code>[pInputMask]</code></td>
                <td>A fixed written shape that guides typing: telephone, IBAN, license key.</td>
                <td>
                  It formats, it does not validate meaning. The bound value keeps the mask's literal characters unless
                  you ask for the unmasked one (constrained-inputs guide).
                </td>
              </tr>
              <tr>
                <td><code>p-password</code> / <code>[pPassword]</code></td>
                <td>Masking, an optional reveal toggle, and a strength overlay on focus.</td>
                <td>
                  The reveal is not keyboard-operable and the strength text is not announced. Use the field for the
                  masking and build the reveal yourself.
                </td>
              </tr>
              <tr>
                <td><code>p-inputOtp</code></td>
                <td>One box per character with auto-advance, backspace-back, and paste-into-the-first.</td>
                <td>
                  It names nothing: no <code>id</code>, no <code>inputId</code>, no label hook on any box. A wrapper has
                  to carry the name.
                </td>
              </tr>
              <tr>
                <td><code>[pKeyFilter]</code></td>
                <td>Refuses characters at the keystroke on any field it sits on.</td>
                <td>
                  Refusal is silent and, in its default mode, invisible to the form: it reports no validation error.
                  Never the only guard on a value.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Each is its own entry point — <code>&#64;openng/optimus-ui/iconfield</code>,
          <code>&#8230;/inputicon</code>, <code>&#8230;/inputmask</code>, <code>&#8230;/password</code>,
          <code>&#8230;/inputotp</code>, <code>&#8230;/keyfilter</code> — and none pulls in an extra dependency. Two of
          them ship twice: <code>inputmask</code> and <code>password</code> each export a component
          <em>and</em> a directive with a different input set — documented in the constrained-inputs guide.
        </p>

        <h3>When <em>not</em> to reach for <code>p-inputgroup</code></h3>
        <p>
          It is a flex container with a border trick, nothing else. Use it when a symbol, unit, or action genuinely
          belongs <em>inside</em> the field's frame. Do not use it:
        </p>
        <ul>
          <li>
            to attach a <strong>submit</strong> button to a form — that button belongs in the form's action row, where
            it is reachable in a sane tab order and can grow a label;
          </li>
          <li>
            to lay out <strong>two independent controls</strong> side by side — that is a grid, and welding them implies
            they are one value;
          </li>
          <li>
            around a <code>pTextarea</code> — the group's flex rule targets <code>.p-inputtext</code> and
            <code>.p-inputwrapper</code>, so a textarea does not take the free space and the addon stretches to the full
            box height;
          </li>
          <li>
            to carry information the user must have — an addon has no role and no accessible name, so it is decoration
            by construction.
          </li>
        </ul>

        <h3>Placeholders</h3>
        <p>
          A placeholder is an <strong>example of the expected value</strong>
          ("Ada Lovelace", "name&#64;example.org"), never the field's name and never an instruction the user needs after
          typing starts. Persistent instructions go in a
          <code>&lt;small&gt;</code> under the field, wired with <code>aria-describedby</code> — that text stays visible
          and is announced with the field. Placeholder text also carries the theme's lowest text contrast (see the
          Design tab), which is another reason it cannot hold anything load-bearing.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 3.3.2 Labels or Instructions</a
            >
            — the requirement behind "a persistent label, not a placeholder"; a caption that disappears is not an
            instruction.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.5 Identify Input Purpose</a
            >
            — the AA rule that makes the <code>autocomplete</code> attribute mandatory on fields collecting the user's
            own data; the token list is normative.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — the 4.5:1 floor the placeholder color is measured against in the Design tab.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 for the field's border and for the focus indicator; the reason a border-tint focus signal has to be
            measured rather than assumed.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — why a field whose focus state is suppressed by a stylesheet override is a conformance failure, not a
            cosmetic one.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Textarea element</a
            >
            — <code>rows</code>, <code>wrap</code>, <code>maxlength</code> and the CSS <code>resize</code> property that
            <code>autoResize</code> switches off.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The autocomplete attribute</a
            >
            — the field-name tokens (<code>name</code>, <code>street-address</code>, <code>address-level2</code>,
            <code>one-time-code</code>) used in the examples.
          </li>
          <li>
            <a
              href="https://design-system.service.gov.uk/components/text-input/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GOV.UK Design System — Text input</a
            >
            — a production-grade primary source on sizing a field to its answer and on hint text versus placeholder
            text.
          </li>
          <li>
            <a href="https://optimus.openng.org/inputtext/" target="_blank" rel="noopener noreferrer">
              Optimus UI — InputText, Textarea and InputGroup</a
            >
            — the input/output surface this guide maps onto the kit's conventions.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          There is no wrapper element to reason about: <code>pInputText</code> and <code>pTextarea</code> are
          <strong>directives</strong>, so the element you write is the element that renders and the element the browser
          focuses.
        </p>
        <ul>
          <li>
            <strong>Field</strong> — your <code>&lt;input&gt;</code> or <code>&lt;textarea&gt;</code>, given the root
            class <code>p-inputtext p-component</code> or <code>p-textarea p-component</code>: background, 1px border,
            radius, padding, transition.
          </li>
          <li>
            <strong>State classes</strong> — <code>p-filled</code> (non-empty), <code>p-invalid</code>,
            <code>p-variant-filled</code>, <code>p-inputtext-sm</code> / <code>-lg</code> (a sized textarea gets
            <code>p-textarea-sm</code> / <code>-lg</code> <em>and</em> <code>p-inputfield-sm</code> / <code>-lg</code>),
            <code>p-inputtext-fluid</code> / <code>p-textarea-fluid</code>, and <code>p-textarea-resizable</code> under
            <code>autoResize</code>.
          </li>
          <li>
            <strong>Group</strong> — <code>p-inputgroup</code> renders a <code>display: flex</code> box at
            <code>width: 100%</code>; an <code>&lt;input&gt;</code> inside gets <code>flex: 1 1 auto</code>, because the
            rule names <code>.p-inputtext</code> and <code>.p-inputwrapper</code> — a <code>pTextarea</code> is neither,
            which is the pitfall in Development.
          </li>
          <li>
            <strong>Addon</strong> — the <code>.p-inputgroupaddon</code> cell, centered, with its own background and
            border, <code>min-width: 2.5rem</code>. Only the first and last children of the group keep their corner
            radii; everything between is squared off.
          </li>
        </ul>
        <p class="src-note">
          Class maps from <code>openng-optimus-ui-inputtext.mjs</code>, <code>openng-optimus-ui-textarea.mjs</code> and
          <code>openng-optimus-ui-inputgroup.mjs</code> (Optimus UI 2.0.2); layout literals from
          <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code>.
        </p>

        <h3>Size scale — one token family for both fields</h3>
        <p>
          Aura's <code>inputtext</code> and <code>textarea</code> token maps are entry-for-entry identical: every value
          resolves the same <code>&#123;form.field.*&#125;</code> slot. One table therefore covers both, and a row of an
          input next to a textarea lines up by construction.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>pSize="small"</code></th>
                <th>default</th>
                <th><code>pSize="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>padding-block (y)</td>
                <td>0.375rem (6px)</td>
                <td>0.5rem (8px)</td>
                <td>0.625rem (10px)</td>
              </tr>
              <tr>
                <td>padding-inline (x)</td>
                <td>0.625rem (10px)</td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
              </tr>
              <tr>
                <td>border-radius</td>
                <td colspan="3">
                  <code>&#123;border.radius.md&#125;</code> — set per visual style: 0 Werkbund, 12px Lernwerkstatt, 10px
                  Skizzenbuch, 2px Blaupause (Aura stock 6px)
                </td>
              </tr>
              <tr>
                <td>border</td>
                <td colspan="3">
                  1px solid <code>&#123;form.field.border.color&#125;</code>, re-pointed to <code>--control-border</code> on a
                  textarea; an <code>&lt;input&gt;</code> gets the style's
                  width and outline color instead (States, below)
                </td>
              </tr>
              <tr>
                <td>height</td>
                <td colspan="3">not a token — content + padding; a textarea's height is <code>rows</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the <strong>Aura</strong> preset (the kit's active preset, <code>app.config.ts</code>):
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputtext/index.mjs</code> and
          <code>&#8230;/aura/textarea/index.mjs</code> both resolve <code>&#123;form.field.*&#125;</code> from
          <code>&#8230;/aura/base/index.mjs</code> (paddingX 0.75rem / paddingY 0.5rem; sm 0.625 / 0.375; lg 0.875 /
          0.625). The default font-size 1rem is a literal in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>;
          the radius steps are each style's <code>presetOverrides.primitive.borderRadius</code> in
          <code>ui-styles.ts</code>.
          Note the input name is <code>pSize</code>, not <code>size</code> — see the pitfall in Development.
        </p>

        <h3>States — the Aura layer and what this kit renders</h3>
        <p>
          Three layers style these fields. The <em>Aura token layer</em> is what Optimus ships; its form-field colors
          come from Aura's own surface palette (slate in light, zinc in dark), which the kit's visual styles do not
          replace — a style moves the radii and the accent (<code>&#123;primary.color&#125;</code>), not these grays.
          The <em>kit layer</em> is four rules in <code>styles.scss</code>: <code>.dark-theme .p-inputtext</code>
          re-points four element tokens (background <code>--surface-section</code>, text <code>--text-color</code>,
          border <code>--control-border</code>, placeholder <code>--control-placeholder</code>);
          <code>.p-textarea</code> re-points its resting border to <code>--control-border</code> in both modes;
          both controls' invalid border token points at <code>--semantic-red-fg</code>, and
          <code>input.p-inputtext.p-invalid</code> paints that red with <code>!important</code>; and
          <code>.p-inputtext:focus-visible, .p-textarea:focus-visible</code> draws the kit focus ring (2px solid
          <code>--primary-color-fg</code> at 2px offset, <code>!important</code>). The <em>visual-style layer</em> is
          one <code>input.p-inputtext</code> rule in every <code>html.style-*</code> block: it sets
          <code>border-color</code> to the style's outline (<code>--control-border</code> in dark Lernwerkstatt), plus a
          heavier width and, in two styles, a fixed radius.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token (light / dark)</th>
                <th><code>&lt;input pInputText&gt;</code></th>
                <th><code>pTextarea</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>resting</td>
                <td>
                  bg <code>&#123;surface.0&#125;</code> / <code>&#123;surface.950&#125;</code>; border
                  <code>&#123;surface.300&#125;</code> / <code>&#123;surface.600&#125;</code>
                </td>
                <td>
                  border is the style outline (<code>--style-outline</code>, <code>--style-outline-soft</code> in
                  Skizzenbuch, <code>--control-border</code> in dark Lernwerkstatt); dark bg <code>--surface-section</code>
                </td>
                <td>
                  1px <code>--control-border</code>, both modes; dark bg <code>--surface-section</code> with
                  <code>--text-color</code> and <code>--control-placeholder</code> — the input's fill, a different edge
                </td>
              </tr>
              <tr>
                <td>hover, focus</td>
                <td>
                  border → <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code> on hover,
                  <code>&#123;primary.color&#125;</code> on focus. The ring is <strong>zeroed</strong>:
                  <code>form.field.focusRing</code> is width <code>0</code>, style <code>none</code>.
                </td>
                <td colspan="2">
                  as Aura (<code>:enabled:hover</code> and <code>:enabled:focus</code> outrank the style rule),
                  <em>plus</em> the kit ring on keyboard focus, fading in over the field's transition
                </td>
              </tr>
              <tr>
                <td>invalid</td>
                <td>
                  border → <code>&#123;red.400&#125;</code> / <code>&#123;red.300&#125;</code>; placeholder →
                  <code>&#123;red.600&#125;</code> / <code>&#123;red.400&#125;</code>
                </td>
                <td>
                  border <code>--semantic-red-fg</code> from either trigger — <code>[invalid]</code> alone
                  included, in every style, focused too (kit rule <code>input.p-inputtext.p-invalid</code>); placeholder
                  tint as Aura
                </td>
                <td>border <code>--semantic-red-fg</code> (kit token), both triggers</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>
                  <code>opacity: 1</code>, bg <code>&#123;surface.200&#125;</code> / <code>&#123;surface.700&#125;</code>,
                  text <code>&#123;surface.500&#125;</code> / <code>&#123;surface.400&#125;</code>
                </td>
                <td colspan="2">as Aura, both modes — the kit re-points the resting tokens only</td>
              </tr>
              <tr>
                <td>read-only</td>
                <td colspan="3">
                  not styled by Aura, the kit, or any visual style: a read-only field is pixel-identical to an editable
                  one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura column: <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (<code>formField</code>, both
          color schemes) through the selectors in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>
          and the <code>.p-inputtext.ng-invalid.ng-dirty</code> rule in <code>openng-optimus-ui-inputtext.mjs:16</code>
          (<code>openng-optimus-ui-textarea.mjs:16</code> for the twin). Kit columns: the <code>.dark-theme .p-inputtext</code>,
          <code>.p-textarea</code>, invalid and focus rules and the four <code>html.style-*</code> blocks in
          <code>styles.scss</code>; the winners follow from
          selector specificity — <code>html.style-* input.p-inputtext</code> outranks <code>.p-inputtext.p-invalid</code>
          but not the three-class state rules, which is why the kit's invalid edge carries <code>!important</code>.
          Verify in your build: set <code>[invalid]</code> on a pristine field and read its computed
          <code>border-color</code>.
        </p>

        <h4>The consequences you have to design around</h4>
        <ul>
          <li>
            Never let color alone carry validity. The kit already draws the red edge for <code>[invalid]</code> alone —
            a server error, a check on submit before the field was touched — in every visual style; but an edge is
            color, which SC 1.4.1 does not accept as the only signal. Pair <code>[invalid]</code> with
            <code>aria-invalid</code>, a visible error message, and <code>aria-describedby</code>: text that is readable
            in every style and mode.
          </li>
          <li>
            An input and a textarea in the same form do not quite match. The style rule names
            <code>input.p-inputtext</code>; a textarea's root class is <code>p-textarea</code>, so it gets the kit's own
            <code>.p-textarea</code> edge (1px <code>--control-border</code>) instead of the style outline. The dark
            fill, text, and placeholder are the same (<code>.dark-theme .p-textarea</code>, <code>--surface-section</code>).
            Both edges pass the gate; they just differ.
            Widening the kit selectors is a <code>styles.scss</code> change that needs the contrast gate re-run.
          </li>
          <li>
            Outside this kit's stylesheet, restore the ring Aura zeroed: set <code>--p-inputtext-focus-ring-width</code>,
            <code>-style</code>, <code>-color</code>, and <code>-offset</code> on an <strong>ancestor</strong> — a class
            on the form wrapper. Declaring the same tokens on <code>:root</code> from a stylesheet does not work:
            Optimus re-declares them on <code>:root, :host</code> from a runtime <code>&lt;style&gt;</code> element that
            outranks earlier <code>:root</code> rules.
          </li>
        </ul>
        <pre class="code-block"><code>{{ ringSnippet }}</code></pre>

        <h3>Contrast of the field edge, text, and placeholder</h3>
        <p>
          The <strong>placeholder</strong> is styled by its own pseudo-element rule (<code>.p-inputtext::placeholder</code>
          / <code>.p-textarea::placeholder</code> → <code>&#123;form.field.placeholder.color&#125;</code>). In dark mode
          the kit re-points that token on <code>pInputText</code> and <code>pTextarea</code> to
          <code>--control-placeholder</code>, a value each style chooses against its own <code>--surface-section</code>,
          the dark fill of both. Every pair below is measured by the contrast gate, per style
          and mode, against the field's own fill.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pairing</th>
                <th>Tokens</th>
                <th>Range over the four styles</th>
                <th>CONTRAST.MD group</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>resting edge, <code>&lt;input pInputText&gt;</code></td>
                <td>the style rule's outline on <code>inputtext.background</code></td>
                <td>3.25:1 (Blaupause dark) to 18.73:1 (Werkbund light); Skizzenbuch light 3.62:1</td>
                <td>"form field edge" — passes SC 1.4.11</td>
              </tr>
              <tr>
                <td>resting edge, <code>pTextarea</code></td>
                <td><code>--control-border</code> on <code>textarea.background</code></td>
                <td>3.25:1 (Blaupause dark) to 5.23:1 (Werkbund light)</td>
                <td>"form field edge" — passes SC 1.4.11</td>
              </tr>
              <tr>
                <td>invalid edge, both controls</td>
                <td><code>--semantic-red-fg</code> on <code>inputtext.background</code></td>
                <td>5.66:1 (Blaupause dark) to 7.93:1; 6.47:1 in light</td>
                <td>"form field edge" (<code>inputtext.invalid.border.color</code>) — passes SC 1.4.11</td>
              </tr>
              <tr>
                <td>placeholder, light (both controls)</td>
                <td><code>&#123;surface.500&#125;</code> on <code>&#123;surface.0&#125;</code></td>
                <td>4.76:1 in every style (stock palette)</td>
                <td>"form field text" — passes SC 1.4.3</td>
              </tr>
              <tr>
                <td>placeholder, dark (both controls)</td>
                <td><code>--control-placeholder</code> on <code>--surface-section</code></td>
                <td>4.79:1 (Skizzenbuch) to 5.93:1 (Lernwerkstatt)</td>
                <td>"form field text", "field placeholder" — passes SC 1.4.3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows from <code>docs/generated/CONTRAST.MD</code>, groups "form field edge" and "form field text" under each
          style and mode; the field text itself sits at 9.35:1 or higher there. The placeholder passes, but it vanishes on
          the first keystroke — it still never carries anything load-bearing.
        </p>

        <h3>Input group geometry</h3>
        <ul>
          <li>
            The group is <code>width: 100%</code> — it always fills its container. Constrain the <em>parent</em>, never
            the field inside.
          </li>
          <li>
            <code>align-items: stretch</code>: the addon takes the field's height, including a textarea's full box.
          </li>
          <li>
            Corner radii live on the group's first and last children only; the addon's radius token is
            <code>inputgroup.addon.border.radius</code>, its padding <code>0.5rem</code> and its minimum width
            <code>2.5rem</code>.
          </li>
          <li>
            An addon containing a <code>p-button</code> drops its own padding and squares the button's corners, so the
            button fills the cell edge to edge.
          </li>
          <li>
            All of the group's edge rules use logical properties (<code>border-inline-start</code>,
            <code>border-start-start-radius</code>), so the group mirrors correctly under <code>dir="rtl"</code> without
            any work.
          </li>
        </ul>
        <p class="src-note">
          Geometry from <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code>; addon tokens from
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputgroup/index.mjs</code>
          (padding 0.5rem, minWidth 2.5rem, background and border inherited from
          <code>&#123;form.field.*&#125;</code>).
        </p>

        <h3>Icon field geometry — and the input that does not reach it</h3>
        <p>
          <code>p-iconfield</code> is a <code>position: relative</code> block; <code>p-inputicon</code> is absolutely
          positioned inside it and the field's padding is opened on the icon's side so the text never runs underneath.
          Which side that is comes out of three <code>:first-child</code> / <code>:last-child</code> rules in the
          stylesheet — so <strong>document order places the icon</strong>, and an icon written after the input sits on
          the trailing edge. Both are rendered side by side in the Examples tab.
        </p>
        <p>
          The component also offers an <code>iconPosition</code> input, which puts a
          <code>p-iconfield-left</code> or <code>p-iconfield-right</code> class on the host. No rule anywhere in the
          library reads either class. It follows that the input is inert: setting
          <code>iconPosition="right"</code> on a field whose icon stands first changes nothing on screen.
        </p>
        <p class="src-note">
          Positioning rules in <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs</code>; the class map that
          writes the two unread classes in
          <code>openng-optimus-ui-iconfield.mjs:13</code>–<code>14</code>. To reproduce: render one icon field with the
          icon element before the input and one with it after, and compare which edge each icon lands on.
        </p>

        <h3>Full width — and what these three wrappers do at 360 px</h3>
        <p>
          <code>p-fluid</code> paints nothing. It carries a <code>p-fluid</code> class that no stylesheet in the
          library or in this kit reads; the width comes from the fields themselves, each of which resolves a
          <code>hasFluid</code> flag and adds its own <code>p-inputtext-fluid</code> /
          <code>p-textarea-fluid</code> modifier. That is why the wrapper has no inputs and no tokens to list.
        </p>
        <ul>
          <li>
            <strong><code>p-iconfield</code> at 360 px: nothing happens.</strong> It is
            <code>display: block</code> with no width of its own, so the field inside keeps its intrinsic width —
            roughly 20 characters — and the icon stays pinned to the field's own edge, not the viewport's. Give the
            field <code>[fluid]="true"</code> or the wrapper a fluid parent if it should fill a narrow screen.
          </li>
          <li>
            <strong><code>p-inputicon</code> at 360 px: nothing happens.</strong> It is absolutely positioned at a
            token inset from the field edge and never reflows, wraps, or shrinks; only the field's own padding grows
            with the size scale.
          </li>
          <li>
            <strong><code>p-fluid</code> at 360 px: it is the fix, not the problem.</strong> Fields inside it take
            100% of the container at every viewport, so the failure mode it removes — a 20-character field on a
            340-pixel column — needs no media query. It cannot make a field <em>narrower</em> than its container, and
            it does not reach a <code>p-inputgroup</code>, which is already full width.
          </li>
        </ul>
        <p class="src-note">
          The icon field's <code>display: block</code> and the icon's inset rules are in
          <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs</code>; the fluid modifiers in
          <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> and
          <code>&#8230;/textarea/index.mjs</code>. <code>p-fluid</code> itself appears in no stylesheet of either
          package. To reproduce: narrow the viewport to 360 px with an icon field and a fluid-wrapped field side by
          side and compare their rendered widths.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide can back — a criterion not listed is not claimed.
          <strong>Passing:</strong> SC 4.1.2, because the element is a native <code>&lt;input&gt;</code> or
          <code>&lt;textarea&gt;</code> whose accessible name is the bound label alone — read in the accessibility tree,
          with the addon absent; SC 1.4.3 for field text and placeholder, and SC 1.4.11 for the resting edge of both
          controls, in every style and mode (contrast gate, "form field text" and "form field edge"); and SC 2.4.7,
          because the <code>styles.scss</code> focus rules draw 2px solid <code>--primary-color-fg</code> at 2px offset on
          both controls in both modes although Aura zeroes its ring. <strong>Conditional:</strong> SC 1.3.5, which the
          native <code>autocomplete</code> attribute satisfies only where the call site sets it; and SC 3.3.2, which needs
          a visible label and, for validity, a text message wired with <code>aria-describedby</code> — the kit's red
          invalid edge (gated, "form field edge") is color, not text. <strong>AAA</strong> is not
          assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Three separate entry points. <code>InputTextModule</code> exports the <code>[pInputText]</code> directive,
          <code>TextareaModule</code> the <code>[pTextarea]</code> directive (legacy alias
          <code>[pInputTextarea]</code>), and the group needs both <code>InputGroupModule</code> and
          <code>InputGroupAddonModule</code>. The group's element selectors are <code>&lt;p-inputgroup&gt;</code> and
          <code>&lt;p-inputgroup-addon&gt;</code>; Optimus also accepts the camel forms
          <code>&lt;p-inputGroup&gt;</code> and <code>&lt;p-inputGroupAddon&gt;</code> plus
          <code>&lt;p-input-group&gt;</code> (PrimeNG 22 had removed them; the v21 selector lists are back), but the
          all-lowercase
          <code>&lt;p-inputgroupaddon&gt;</code> is <em>not</em> a selector: under this kit's
          <code>strictTemplates</code> it is a build error, <strong>NG8001 "not a known element"</strong>, so the
          compiler names the problem for you.
        </p>

        <h3>Inputs — <code>pInputText</code> and <code>pTextarea</code></h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>On</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>pSize</code></td>
                <td>'small' | 'large'</td>
                <td>both</td>
                <td>
                  Size step; omit for the default. <strong>Not</strong> <code>size</code> — see the pitfall below.
                </td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'filled'</td>
                <td>both</td>
                <td>Overrides the global <code>inputVariant</code>; this kit configures <code>'outlined'</code>.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>both</td>
                <td>Spans 100% of the container, or inherits from a <code>p-fluid</code> ancestor.</td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>both</td>
                <td>Adds <code>p-invalid</code>. Visual only — set <code>aria-invalid</code> yourself.</td>
              </tr>
              <tr>
                <td><code>autoResize</code></td>
                <td>boolean</td>
                <td>textarea</td>
                <td>Height follows the content; also sets <code>resize: none</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs verified against the directive declarations in
          <code>openng-optimus-ui-inputtext.mjs</code> and <code>openng-optimus-ui-textarea.mjs</code> (Optimus UI
          2.0.2). Note the split: <code>variant</code>, <code>fluid</code> and <code>invalid</code> are input
          <em>signals</em>, while <code>pSize</code> and <code>autoResize</code> are plain properties — Optimus keeps
          the v21 shape there, so they are not readable as <code>pSize()</code> from a host directive. Everything else you
          need — <code>type</code>, <code>placeholder</code>, <code>readonly</code>, <code>disabled</code>,
          <code>required</code>, <code>maxlength</code>, <code>rows</code>, <code>autocomplete</code>,
          <code>inputmode</code> — is a native attribute, because the element is native.
        </p>

        <h3>Outputs</h3>
        <p>
          <code>pInputText</code> emits nothing: use the native <code>(input)</code>, <code>(change)</code>,
          <code>(blur)</code> events. <code>pTextarea</code> adds exactly one, <code>(onResize)</code>, fired whenever
          <code>autoResize</code> recomputes the height. Both directives listen to the native <code>input</code> event
          internally to maintain the <code>p-filled</code> class.
        </p>

        <h3>Forms — the difference from <code>p-select</code></h3>
        <p>
          Neither directive is a <code>ControlValueAccessor</code>. Value binding runs through Angular's own accessor on
          the native element, which is why <code>[(ngModel)]</code>, <code>formControlName</code> and template
          validators all behave exactly as they do on a bare <code>&lt;input&gt;</code> — and why
          <code>&lt;label for&gt;</code>, native <code>disabled</code>, native <code>required</code> and browser
          autofill work here but not on <code>p-select</code>. When a form control is attached, Optimus applies
          Angular's <code>ng-invalid</code> / <code>ng-dirty</code> pair as a second invalid trigger alongside the
          <code>[invalid]</code> input — the style sheet in
          <code>openng-optimus-ui-inputtext.mjs</code> selects <code>.p-inputtext.ng-invalid.ng-dirty</code> and its
          <code>::placeholder</code>.
        </p>
        <pre class="code-block"><code>{{ formsSnippet }}</code></pre>

        <h3>Theming with CSS custom properties</h3>
        <p>Set these on an ancestor — a class around the form — and read the third column before relying on one.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom property</th>
                <th>Controls</th>
                <th>Wins in this kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-inputtext-border-radius</code></td>
                <td>Corner radius (<code>&#123;border.radius.md&#125;</code>, per style).</td>
                <td>Yes, except on an <code>&lt;input&gt;</code> in Werkbund and Blaupause, whose style rule fixes the radius.</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-padding-x</code> / <code>-padding-y</code></td>
                <td>Default-size padding.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-background</code>, <code>-placeholder-color</code></td>
                <td>Resting fill, placeholder text.</td>
                <td>
                  Light yes; dark no — the kit declares both on the element (<code>.dark-theme .p-inputtext</code>),
                  which beats an inherited value.
                </td>
              </tr>
              <tr>
                <td><code>--p-inputtext-border-color</code></td>
                <td>Resting border.</td>
                <td>No on an <code>&lt;input&gt;</code> in any style — the style rule sets <code>border-color</code> itself.</td>
              </tr>
              <tr>
                <td><code>--p-inputtext-focus-border-color</code>, <code>-invalid-border-color</code></td>
                <td>State borders.</td>
                <td>
                  Focus yes. Invalid no: the kit declares it on the element (<code>--semantic-red-fg</code>) and paints
                  the input's red edge with <code>!important</code> (Design tab, States).
                </td>
              </tr>
              <tr>
                <td>
                  <code>--p-inputtext-focus-ring-width</code> / <code>-style</code> / <code>-color</code> /
                  <code>-offset</code>
                </td>
                <td>Focus outline — zeroed by Aura.</td>
                <td>
                  Here the kit's <code>:focus-visible</code> rule already draws the ring and wins with
                  <code>!important</code>. Without that rule: yes from an ancestor, <strong>no</strong> from
                  <code>:root</code> (runtime token injection, Design tab).
                </td>
              </tr>
              <tr>
                <td><code>--p-textarea-*</code>, <code>--p-inputgroup-addon-*</code></td>
                <td>Same slots for the other two blocks.</td>
                <td>
                  Yes, both modes, except <code>--p-textarea-border-color</code>: the kit declares it on
                  <code>.p-textarea</code> itself (<code>--control-border</code>), which beats an inherited value.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>A scoped geometry override that lands in both modes:</p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Property names follow the <code>p</code> prefix set in <code>app.config.ts</code>. The caveats are the
          <code>.dark-theme .p-inputtext</code>, focus, and <code>html.style-*</code> <code>input.p-inputtext</code> rules
          in <code>styles.scss</code>; the <code>:root</code> caveat is the runtime token injection documented there for
          the select control.
        </p>

        <h3>Pitfalls that cost an afternoon</h3>
        <ul>
          <li>
            <strong><code>size</code> is not the size input.</strong>
            <code>&lt;input pInputText size="small"&gt;</code> sets the <em>native</em> <code>size</code> attribute — a
            character-width hint — and is invalid HTML for a non-numeric value. The directive's input is
            <code>pSize</code>.
          </li>
          <li>
            <strong>The two <code>pSize</code> types disagree.</strong> It is declared
            <code>'large' | 'small' | undefined</code> on the input directive
            (<code>openng-optimus-ui-inputtext.d.ts:80</code>) but <code>'large' | 'small'</code> on the textarea
            (<code>openng-optimus-ui-textarea.d.ts:78</code>, Optimus UI 2.0.2 — the v21 mismatch survives the fork).
            Under this kit's <code>strictTemplates</code>, binding an optional size compiles on an
            <code>&lt;input&gt;</code> and fails on a <code>&lt;textarea&gt;</code> — even though the runtime accepts
            <code>undefined</code> in both (the class map compares with <code>===</code>). Assert the binding non-null,
            or branch the template.
          </li>
          <li>
            <strong><code>autoResize</code> needs its <code>max-height</code> inline <em>and</em> in pixels.</strong>
            The resize routine clamps by comparing <code>parseFloat(style.height)</code> — always px — against
            <code>parseFloat(style.maxHeight)</code>, and <code>parseFloat</code> discards the unit. So a
            <code>max-height</code> from a CSS class is invisible (the box grows without limit), and an inline
            <code>max-height: 10rem</code> is read as the bare number <strong>10</strong>: every real height in px
            clears it, the clamp fires on the very first pass, and the field is pinned at its maximum with
            <code>overflow-y: scroll</code> while still empty. Write <code>style="max-height: 160px"</code>.
          </li>
          <li>
            <strong><code>autoResize</code> reflows on every change-detection pass.</strong>
            The height is recomputed in the after-checked hook, and each pass writes
            <code>height: auto</code> and then reads <code>scrollHeight</code> — a forced synchronous layout. Fine for a
            handful of fields, measurable in a long list.
          </li>
          <li>
            <strong>A textarea inside a <code>p-inputgroup</code> does not flex.</strong> The group's
            <code>flex: 1 1 auto</code> rule names <code>.p-inputtext</code> and <code>.p-inputwrapper</code>;
            <code>p-textarea</code> is neither.
          </li>
          <li>
            <strong>The group is <code>width: 100%</code>.</strong> Putting one in a flex row with other controls makes
            it eat the row.
          </li>
          <li>
            <strong><code>readonly</code> looks editable.</strong> Nothing in either layer styles it; if the user must
            see that a value is locked, say so in text or use <code>disabled</code>.
          </li>
        </ul>

        <h3>Icon field, icon, and fluid: the whole API</h3>
        <p>
          Three wrappers, no value between them. None is a <code>ControlValueAccessor</code>, none emits an output,
          and each template is a bare <code>&lt;ng-content&gt;</code> — everything they do, they do with one class on
          their own host element.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Entry point</th>
                <th>Selector as accepted</th>
                <th>Inputs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>IconFieldModule</code> → <code>p-iconfield</code></td>
                <td><code>p-iconfield</code>, <code>p-iconField</code>, <code>p-icon-field</code></td>
                <td>
                  <code>iconPosition</code> (<code>'left' | 'right'</code>, default <code>'left'</code>) — inert, see
                  the Design tab; <code>styleClass</code>, deprecated since v20 in favor of <code>class</code>;
                  <code>hostName</code>.
                </td>
              </tr>
              <tr>
                <td><code>InputIconModule</code> → <code>p-inputicon</code></td>
                <td>
                  <code>p-inputicon</code>, <code>p-inputIcon</code> — there is no <code>p-input-icon</code>, and the
                  kebab spelling fails the template compile the way lowercase
                  <code>p-inputgroupaddon</code> does.
                </td>
                <td><code>styleClass</code> (deprecated), <code>hostName</code>. No <code>iconPosition</code> here.</td>
              </tr>
              <tr>
                <td><code>FluidModule</code> → <code>p-fluid</code></td>
                <td><code>p-fluid</code> only — no camelCase and no kebab alias</td>
                <td>None of its own — only the four every component here inherits from <code>BaseComponent</code>: <code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> (<code>openng-optimus-ui-basecomponent.mjs:428</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selectors and input lists read from the component metadata in
          <code>openng-optimus-ui-iconfield.mjs:71</code> and <code>:76</code>,
          <code>openng-optimus-ui-inputicon.mjs:43</code> and <code>:48</code>,
          <code>openng-optimus-ui-fluid.mjs:52</code> — whose declaration carries no
          <code>inputs</code> entry at all. The icon field's own class map is at
          <code>openng-optimus-ui-iconfield.mjs:9</code>&#8211;<code>17</code>.
        </p>

        <h3>How <code>p-fluid</code> reaches a field — and where it stops</h3>
        <p>
          The wrapper does not style its descendants. Each field decides for itself: it injects the
          <code>Fluid</code> component as an optional ancestor and resolves
          <code>fluid() ?? !!pcFluid</code>. Two consequences follow directly, and both are the ones that surprise
          people.
        </p>
        <ul>
          <li>
            <strong>The field's own input always wins.</strong> <code>[fluid]="true"</code> works with no wrapper
            present, and <code>[fluid]="false"</code> opts a single field back out from under a wrapper. Nesting one
            <code>p-fluid</code> inside another changes nothing — the result is a boolean.
          </li>
          <li>
            <strong>The lookup is declared <code>host: true</code>, so it does not cross a component boundary.</strong>
            Angular stops that search at the host element of the component whose template holds the field. Wrap your
            own field-bearing component in <code>p-fluid</code> and the inputs inside its template never see it. Put
            the wrapper in the template that declares the fields.
          </li>
          <li>
            <strong>Not every component participates.</strong> The ones that read the flag include
            <code>pInputText</code>, <code>pTextarea</code>, select, multiselect, autocomplete, datepicker,
            inputnumber, cascadeselect, treeselect, inputmask, password, and button. <code>p-iconfield</code> does not, and
            neither does <code>p-inputgroup</code>: its class map still tests <code>instance.fluid</code> although the
            component declares <code>styleClass</code> as its only input, so <code>p-inputgroup-fluid</code> can never
            be applied — and no stylesheet defines it either. The group is <code>width: 100%</code> regardless, which
            is why nobody has noticed.
          </li>
        </ul>
        <p class="src-note">
          The injection and the resolution are <code>openng-optimus-ui-baseinput.mjs:7</code> and <code>:79</code>,
          repeated on the two directives at <code>openng-optimus-ui-inputtext.mjs:97</code> and
          <code>openng-optimus-ui-textarea.mjs:127</code>; the modifier classes at
          <code>openng-optimus-ui-inputtext.mjs:33</code> and <code>openng-optimus-ui-textarea.mjs:30</code>. The
          input group's unreachable branch is <code>openng-optimus-ui-inputgroup.mjs:49</code> against its input list
          at <code>:100</code>. To reproduce the boundary: put a field inside a small component of your own, wrap that
          component in <code>p-fluid</code>, and read the rendered field's class list.
        </p>

        <h3>The constrained neighbors</h3>
        <p>
          <code>p-inputmask</code>, <code>p-password</code>, <code>p-inputOtp</code> and <code>[pKeyFilter]</code>
          appear in the Examples tab because they belong to the same family on screen, but their contract — selectors,
          value binding, the base-class inputs that are declared and never read, the pointer-only reveal and clear
          icons, the OTP boxes' missing identity, the key filter's silent fallback — is documented in the
          constrained-inputs guide, not here. <code>p-floatlabel</code> and <code>p-iftalabel</code> likewise belong to
          the input-labels guide. What stays this guide's job is the boundary — which control to
          reach for, and where each of them stops — and that is the Usage tab's table.
        </p>

        <h4>Keyboard</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td>
                <td>
                  Move focus in and out. A <code>disabled</code> field is skipped; a <code>readonly</code> one is not —
                  it is focusable and its value is selectable.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  Input: submits the surrounding form. Textarea: inserts a line break — a textarea cannot submit a form
                  from the keyboard.
                </td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Nothing. Neither control reverts on Escape; a cancel affordance is yours to build.</td>
              </tr>
              <tr>
                <td>Everything else</td>
                <td>Native text editing: selection, clipboard, undo, IME composition, browser autofill.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Every field has a real label.</strong> Because the element is native,
            <code>&lt;label for="id"&gt;</code> binds properly — prefer it over <code>aria-label</code>, because a
            visible label helps everyone. Reserve <code>aria-label</code> for a field whose purpose is unmistakable from
            its surroundings, such as a search box under a search heading; note that it <em>replaces</em> any
            <code>&lt;label&gt;</code> in the accessible name, so never let the two disagree.
          </li>
          <li>
            <strong>Addons are not names.</strong> <code>p-inputgroup-addon</code> renders a roleless element and
            contributes nothing to the field's accessible name. Verify in the browser's accessibility tree: the field's
            name must be the label text, with the addon absent. If the addon carries meaning — a currency, a unit, a
            prefix — put that meaning in the label or in <code>aria-describedby</code> text.
          </li>
          <li>
            <strong>Validity is text, not color.</strong> Set <code>aria-invalid="true"</code> alongside
            <code>[invalid]</code>, render the reason as visible text, and point at it with
            <code>aria-describedby</code>. The kit's red edge (<code>--semantic-red-fg</code>, Design tab, States)
            shows the state to sighted users, but a color change alone is not a message.
          </li>
          <li>
            <strong>Hints belong to the field.</strong> Wire persistent hint text with <code>aria-describedby</code> so
            it is announced with the field rather than stranded next to it.
          </li>
          <li>
            <strong>Identify the purpose.</strong> Fields collecting the user's own data carry an
            <code>autocomplete</code> token (<code>name</code>, <code>email</code>, <code>street-address</code>,
            <code>postal-code</code>) — WCAG 2.2 SC 1.3.5, and it makes autofill work.
          </li>
          <li>
            <strong>Visible focus.</strong> Aura zeroes the form-field focus ring, so a text field's only stock signal
            is a border tint — the kit's <code>.p-inputtext:focus-visible, .p-textarea:focus-visible</code> rules
            restore a real 2px ring in both themes. Custom widgets get nothing from that family rule: ship their
            focus-visible rule yourself and check it in both themes.
          </li>
          <li>
            <strong>Right keyboard, right validation.</strong> <code>type</code> and <code>inputmode</code> decide which
            on-screen keyboard appears; <code>type="email"</code> or <code>type="url"</code> also brings native
            validation and a browser-localized error.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ Every field has a persistent, programmatically associated label.</li>
          <li>☐ The placeholder is an example, not the label, and nothing depends on reading it.</li>
          <li>☐ Multi-line answers use <code>pTextarea</code>, sized with <code>rows</code>.</li>
          <li>
            ☐ Errors are visible text, linked by <code>aria-describedby</code>, with <code>aria-invalid</code> set.
          </li>
          <li>☐ An input group's addon carries no information that is not also in the label.</li>
          <li>☐ Focus is visible on the field in <strong>both</strong> themes.</li>
          <li>☐ Personal-data fields carry an <code>autocomplete</code> token.</li>
          <li>☐ <code>autoResize</code> textareas have an inline <code>max-height</code>.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) — it asserts the thing an input group gets wrong most often, namely
          that the addon stays out of the accessible name:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Which strings are yours</h3>
        <p>
          All of them. Unlike <code>p-select</code>, which contributes an <code>aria.listLabel</code> and a hard-coded
          trigger label from Optimus's own translation config (<code>Optimus.setTranslation</code>), these three blocks ship
          <strong>no user-visible string</strong>
          whatsoever — no placeholder, no error text, no announcement. Every word on the screen comes from your
          template, so every word goes through a translation key:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Where</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Label</td>
                <td><code>&lt;label for&gt;</code> text</td>
                <td>The one string that must never be omitted.</td>
              </tr>
              <tr>
                <td><code>placeholder</code></td>
                <td>attribute</td>
                <td>An example value — translate it into a plausible <em>local</em> example, do not transliterate.</td>
              </tr>
              <tr>
                <td>Hint</td>
                <td><code>&lt;small&gt;</code> + <code>aria-describedby</code></td>
                <td>Grows the most on translation; leave vertical room.</td>
              </tr>
              <tr>
                <td>Error text</td>
                <td><code>&lt;small&gt;</code> + <code>aria-describedby</code></td>
                <td>Say what to do, not what failed.</td>
              </tr>
              <tr>
                <td><code>aria-label</code></td>
                <td>attribute</td>
                <td>Only for a label-less search field, and then it is the accessible name — translate it.</td>
              </tr>
              <tr>
                <td>Addon text</td>
                <td>projected content</td>
                <td>
                  Units and currency symbols are locale data, not decoration: EUR before or after the number differs by
                  language.
                </td>
              </tr>
              <tr>
                <td>Icon-button labels in an addon</td>
                <td><code>ariaLabel</code> on <code>p-button</code></td>
                <td>Easy to miss — a clear-search cross with no name is an unnamed control.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The kit's convention: resolve those through the <code>TranslationService</code>, in a
          <code>computed()</code> label map on the component, so the field re-renders on a language switch. Text inputs
          in this kit are labeled one of three ways: a visible <code>&lt;label for&gt;</code>; a visually hidden one
          (<code>class="sr-only"</code>) for a search box whose magnifier already carries the meaning; or a translated
          <code>[attr.aria-label]</code> where there is no caption to hide. The certificate-name field in
          <code>learning-paths-overview.component.ts</code> is the pattern to copy for the visible-label case. Neither
          <code>p-floatlabel</code> nor <code>p-iftalabel</code>
          is used: a floating label is a placeholder wearing a label's clothes, and it loses the argument in the Usage
          tab.
        </p>

        <h3>The neighbors do ship strings — four of them</h3>
        <p>
          The blocks above ship none. <code>p-password</code> is the exception on this page: the strength overlay
          carries a prompt and the words weak, medium, and strong. They are English literals in the source, and the
          component falls back to Optimus's own translation store for them, not to this kit's
          <code>TranslationService</code>. Two consequences follow. The strings will not move when the page language
          changes unless the library store is filled as well; and the
          <code>[pPassword]</code> directive, which has the same four defaults but no store lookup, stays English no
          matter what. Passing <code>promptLabel</code>, <code>weakLabel</code>, <code>mediumLabel</code> and
          <code>strongLabel</code> from a <code>computed()</code> map is the reliable route in both cases.
        </p>
        <p>
          The other three contribute nothing to read, but they still carry locale weight:
        </p>
        <ul>
          <li>
            <strong>A mask is not a locale-neutral fact.</strong> Telephone shapes, postcodes, and identifiers differ
            per country, so the mask string itself belongs next to the label in the language bundle — not hard-coded in
            the template. The same goes for the placeholder that mirrors it and for
            <code>slotChar</code>, the character shown for an empty slot.
          </li>
          <li>
            <strong>The OTP group's name is yours.</strong> The control renders nothing readable, so the
            <code>role="group"</code> wrapper's label and the hint under it are the entire announcement.
          </li>
          <li>
            <strong>A key filter can be a language decision.</strong> <code>alpha</code> and
            <code>alphanum</code> accept the Latin letters <code>a</code>–<code>z</code> and the underscore, so a name
            field carrying them refuses ä, ø, ł, and every non-Latin script. Never filter a name, a place, or free text.
          </li>
        </ul>
        <p class="src-note">
          The four defaults and the store lookup are in <code>openng-optimus-ui-password.mjs</code>: the directive's
          literals at <code>:193</code>–<code>:208</code>, the component's fallbacks at
          <code>:854</code>–<code>:869</code>. The Latin-only masks are the <code>alpha</code> and
          <code>alphanum</code> entries in <code>openng-optimus-ui-keyfilter.mjs:20</code>–<code>21</code>. To
          reproduce: switch the page language with a strength meter open and read the meter's text.
        </p>

        <h3>Length and layout</h3>
        <ul>
          <li>
            <strong>Labels grow.</strong> German runs roughly a third longer than English ("Rechnungsanschrift" vs
            "Address"). Labels sit above the field in this kit, so they wrap instead of truncating — do not switch to an
            inline label layout without re-checking the longest language.
          </li>
          <li>
            <strong>So do placeholders</strong>, and a placeholder truncates silently at the field's edge. Keep the
            example short in every language, or drop it.
          </li>
          <li>
            <strong><code>rows</code> is a per-language decision.</strong> The same prompt fills more lines in a longer
            language; size the textarea for the longest, not for English.
          </li>
          <li>
            <strong>Easy-Language variants</strong> want short labels and one idea per hint sentence — the hint is where
            a complicated field is explained, so it is the string that most needs the plain wording.
          </li>
        </ul>

        <h3>Input method and locale</h3>
        <ul>
          <li>
            <code>inputmode</code> and <code>type</code> choose the on-screen keyboard.
            <code>inputmode="decimal"</code> matters most where the decimal separator is a comma — but if you find
            yourself parsing that, the control is <code>p-inputnumber</code>, which handles the locale for you.
          </li>
          <li>
            Do not block IME composition with keystroke handlers: a Japanese or Korean user types several keys per
            character, and a handler that reads the value on every <code>keydown</code> sees fragments.
          </li>
          <li>
            <code>maxlength</code> counts UTF-16 code units, not characters. An emoji or a character outside the basic
            plane costs two. If a limit is a product rule rather than a database column, count graphemes and show a
            counter instead.
          </li>
        </ul>

        <h3>RTL</h3>
        <p>
          Text fields need no work: the browser mirrors the field and its text under
          <code>dir="rtl"</code>, and <code>p-inputgroup</code> expresses every edge rule with logical properties
          (<code>border-inline-start</code>, <code>border-start-start-radius</code>), so a prefix addon moves to the
          right-hand side by itself. Two things stay physical and are yours: an icon glyph that points somewhere (an
          arrow in an addon button), and any value that is not language — a telephone number or an IBAN reads
          left-to-right inside an RTL paragraph, which is what <code>dir="ltr"</code> on that one field is for.
        </p>
        <p class="src-note">
          This kit ships LTR languages only, so nothing here is wired today — the section exists for downstream RTL
          extensions. Group rules read from
          <code>&#64;openng/optimus-ui-styles/dist/inputgroup/index.mjs</code> (Optimus UI 2.0.2).
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Synced with the contrast and focus rounds: a dark textarea fills
            <code>--surface-section</code> with <code>--text-color</code> and <code>--control-placeholder</code> like the
            input; the state table, contrast table (textarea edge 3.25&#8211;5.23:1, one dark placeholder row), and
            agent doc say so.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: <code>[invalid]</code> alone
            now draws the kit's <code>--semantic-red-fg</code> edge on an input in every style (gated, "form field
            edge"); the states, contrast, theming, and WCAG text say so, and the field-text floor reads 9.35:1.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016). The state matrix, the
            contrast table, the theming table, and the WCAG roll-up describe today's kit layer: the dark
            <code>.p-inputtext</code> rule re-points tokens instead of forcing colors, so the dark placeholder now
            passes (contrast gate, per style) and disabled tints render; every style's <code>input.p-inputtext</code>
            rule suppresses the <code>[invalid]</code> border tint (the <code>ng-invalid ng-dirty</code> one survives);
            radii are per style. Edge, text, and placeholder ratios are now cited from the contrast gate's widget rows,
            including the kit's new <code>.p-textarea</code> edge, so SC 1.4.11 no longer fails; the playground preview
            carries <code>aria-invalid</code>.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-07 — Scope widened to seven components: <code>p-iconfield</code>,
            <code>p-inputicon</code> and <code>p-fluid</code> are now covered here rather than signposted, with their
            API, geometry, accessibility surface, and failure modes in Development and Design, and a narrow-screen
            statement for each. The contract of <code>p-inputmask</code>, <code>p-password</code>,
            <code>p-inputOtp</code> and <code>[pKeyFilter]</code> — selectors and value binding, the unread base-class
            inputs, the pointer-only reveal and clear icons, the OTP boxes' missing identity, the key filter's silent
            fallback — moved out of the Development tab to the constrained-inputs guide; their live examples and the
            Usage tab's boundary table stay.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). The camelCase group
            selectors are back: <code>p-inputgroup, p-inputGroup, p-input-group</code> and
            <code>p-inputgroup-addon, p-inputGroupAddon</code>, so the v0.3 claim that PrimeNG 22 removed them is
            history, not present tense; all-lowercase <code>p-inputgroupaddon</code> is still NG8001. Aura is back on
            the 2.x tokens, and they are the same values this page already listed — <code>form.field</code> paddings
            0.75/0.5rem (sm 0.625/0.375, lg 0.875/0.625), <code>focusRing</code> still 0&nbsp;/&nbsp;none&nbsp;/&nbsp;transparent, and the
            <code>inputtext</code> and <code>textarea</code> maps still byte-identical — so no size or contrast number
            moved. Input shapes re-read against the Optimus typings: <code>variant</code>/<code>fluid</code>/<code>invalid</code>
            are input signals, <code>pSize</code> and <code>autoResize</code> plain properties; the
            <code>pSize</code> type mismatch survives at <code>:80</code>&nbsp;/&nbsp;<code>:78</code>. The global option is
            <code>inputVariant</code>, not <code>inputStyle</code>. Browser measurements from 2026-08-23 were not
            re-taken.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-23 — Re-measured against PrimeNG 22.1.0 / Themes 3.0.0. Focus story
            rewritten: the kit's family rules in <code>styles.scss</code> now draw the 2px ring on both controls in both
            themes (browser-verified; the ring fades in over PrimeNG's outline-color transition), so SC 2.4.7 moved from
            failing/conditional to passing. PrimeNG 22 removed the camelCase group selectors (<code>p-inputGroup</code>,
            <code>p-inputGroupAddon</code>). Aura 3.0 kept the form-field color values, so the measured contrast
            numbers carry over.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial collection guide: the three text-entry blocks, the
            control-choice table, the Aura/kit state matrix per theme, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TextInputsArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  /** Live state for the two interactive examples. */
  readonly noteText = signal('');
  readonly searchText = signal('');

  /** Live state for the neighbor demos in the Examples tab. */
  readonly maskValue = signal('');
  readonly secret = signal('');
  readonly otp = signal('');
  readonly revealed = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Playground state ------------------------------------------------------
  readonly kindOptions = [
    { label: 'Single line (pInputText)', value: 'input' },
    { label: 'Multi line (pTextarea)', value: 'textarea' },
  ];
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];
  readonly addonOptions = [
    { label: 'None', value: 'none' },
    { label: 'Prefix icon', value: 'prefix' },
    { label: 'Suffix unit', value: 'suffix' },
    { label: 'Trailing button', value: 'button' },
  ];

  readonly pgKind = signal<'input' | 'textarea'>('input');
  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgAddon = signal<'none' | 'prefix' | 'suffix' | 'button'>('none');
  readonly pgInvalid = signal(false);
  readonly pgDisabled = signal(false);

  /** 'normal' maps to the default (no pSize input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = ['id="title"'];
    if (this.pgKind() === 'input') attrs.push('type="text"');
    else attrs.push('rows="3"');
    attrs.push('placeholder="Type here"');
    if (this.pgSizeInput()) attrs.push(`pSize="${this.pgSizeInput()}"`);
    if (this.pgInvalid()) attrs.push('[invalid]="true"', '[attr.aria-invalid]="true"');
    if (this.pgDisabled()) attrs.push('disabled');

    const field =
      this.pgKind() === 'input'
        ? `<input pInputText\n    ${attrs.join('\n    ')} />`
        : `<textarea pTextarea\n    ${attrs.join('\n    ')}></textarea>`;

    const label = '<label for="title">Project title</label>';
    if (this.pgAddon() === 'none') return `${label}\n${field}`;

    const before =
      this.pgAddon() === 'prefix' ? '  <p-inputgroup-addon><i class="pi pi-search"></i></p-inputgroup-addon>\n' : '';
    let after = '';
    if (this.pgAddon() === 'suffix') after = '\n  <p-inputgroup-addon>EUR</p-inputgroup-addon>';
    if (this.pgAddon() === 'button') {
      after =
        '\n  <p-inputgroup-addon>' +
        '\n    <p-button icon="pi pi-arrow-right" ariaLabel="Apply" />' +
        '\n  </p-inputgroup-addon>';
    }
    return `${label}\n<p-inputgroup>\n${before}  ${field}${after}\n</p-inputgroup>`;
  });

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'The default: label, field, hint',
      note: 'A native input with a native label. The hint is separate text, linked by id.',
      code: `<label for="city">City</label>
<input pInputText id="city" type="text" autocomplete="address-level2" />
<small id="city-hint">Where the invoice is sent.</small>`,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      note: 'pSize takes small or large; omit it for the default. Note pSize, not size.',
      code: `<input pInputText type="text" pSize="small" />
<input pInputText type="text" />
<input pInputText type="text" pSize="large" />`,
    },
    {
      id: 'multiline',
      title: 'Multi-line: an address',
      note: 'rows sets the visible height and signals how much text is expected.',
      code: `<label for="address">Postal address</label>
<textarea pTextarea id="address" rows="4"
  autocomplete="street-address"></textarea>`,
    },
    {
      id: 'autoresize',
      title: 'Growing textarea (type in it)',
      note: 'autoResize follows the content. The max-height must be inline AND in px — see the pitfall in Development.',
      code: `<textarea pTextarea rows="2" autoResize
  style="max-height: 160px"
  [(ngModel)]="note"
  aria-describedby="note-count"></textarea>
<small id="note-count" aria-live="polite">{{ note.length }} characters</small>`,
    },
    {
      id: 'group-prefix',
      title: 'Input group: icon prefix and a clear button',
      note: 'Type to reveal the clear addon. The icon is aria-hidden; the button carries a name.',
      code: `<label for="search">Search the glossary</label>
<p-inputgroup>
  <p-inputgroup-addon><i class="pi pi-search" aria-hidden="true"></i></p-inputgroup-addon>
  <input pInputText id="search" type="search" [(ngModel)]="term" />
  @if (term) {
    <p-inputgroup-addon>
      <p-button icon="pi pi-times" severity="secondary" [text]="true"
        ariaLabel="Clear the search field" (onClick)="term = ''" />
    </p-inputgroup-addon>
  }
</p-inputgroup>`,
    },
    {
      id: 'group-suffix',
      title: 'Input group: a unit that is also in the label',
      note: 'The addon is decoration. The unit is repeated in the label, where it is announced.',
      code: `<label for="budget">Monthly budget in euro</label>
<p-inputgroup>
  <p-inputgroup-addon>EUR</p-inputgroup-addon>
  <input pInputText id="budget" type="text" inputmode="decimal"
    aria-describedby="budget-hint" />
</p-inputgroup>`,
    },
    {
      id: 'states',
      title: 'Invalid, read-only, disabled',
      note: 'Invalid pairs the visual with aria-invalid and a described error. Read-only is not styled at all.',
      code: `<input pInputText [invalid]="true" [attr.aria-invalid]="true"
  aria-describedby="email-msg" />
<small id="email-msg">Enter an address in the form name@example.org.</small>

<input pInputText readonly value="INV-2026-0042" />
<input pInputText disabled value="Locked" />`,
    },
    {
      id: 'fluid',
      title: 'Full width',
      note: 'fluid sets width 100%; a p-fluid ancestor does the same for every participating field declared in the same template.',
      code: `<input pInputText type="text" [fluid]="true" />`,
    },
    {
      id: 'icon-field',
      title: 'Icon inside the field',
      note: 'Which side the icon sits on is decided by document order, not by iconPosition — the two fields below differ only in where p-inputicon stands.',
      code: `<label for="q">Icon before the text</label>
<p-iconfield>
  <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
  <input pInputText id="q" type="search" />
</p-iconfield>

<label for="amount">Icon after the text</label>
<p-iconfield>
  <input pInputText id="amount" type="text" />
  <p-inputicon><i class="pi pi-euro" aria-hidden="true"></i></p-inputicon>
</p-iconfield>`,
    },
    {
      id: 'mask',
      title: 'A fixed written format',
      note: 'The mask guides typing instead of rejecting it afterwards. inputId is what a <label for> binds to.',
      code: `<label for="phone">Telephone</label>
<p-inputmask
  inputId="phone"
  mask="+49 999 9999999"
  placeholder="+49 ___ _______"
  [unmask]="true"
  [(ngModel)]="phone" />`,
    },
    {
      id: 'password',
      title: 'A secret, with reveal and strength meter',
      note: 'The reveal control renders as a click-only icon, so a keyboard user cannot operate it — see the pair in Usage.',
      code: `<label for="pw">New password</label>
<p-password
  inputId="pw"
  [toggleMask]="true"
  [feedback]="true"
  autocomplete="new-password"
  [(ngModel)]="secret" />`,
    },
    {
      id: 'otp',
      title: 'A one-time code',
      note: 'Six separate boxes with auto-advance and paste. The component names none of them, so the group wrapper carries the name.',
      code: `<span id="otp-label">Security code</span>
<div role="group" aria-labelledby="otp-label" aria-describedby="otp-hint">
  <p-inputOtp [length]="6" [integerOnly]="true" [(ngModel)]="otp" />
</div>
<small id="otp-hint">Six digits. Paste into the first box to fill all six.</small>`,
    },
    {
      id: 'keyfilter',
      title: 'Refusing characters as they are typed',
      note: 'pKeyFilter blocks the keystroke. It reports nothing to the form: in this mode the field is always valid.',
      code: `<label for="count">Whole number only</label>
<input pInputText id="count" type="text" inputmode="numeric" pKeyFilter="int" />`,
    },
  ];

  readonly devImport: string = `import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';

@Component({
  standalone: true,
  imports: [InputTextModule, TextareaModule, InputGroupModule, InputGroupAddonModule],
  // ...
})`;

  readonly formsSnippet: string = `<!-- labels() is a computed() map resolved through the kit's TranslationService -->
<label for="contact-email">{{ labels().email }}</label>
<input pInputText
  id="contact-email"
  type="email"
  autocomplete="email"
  formControlName="email"
  [invalid]="form.controls.email.invalid && form.controls.email.touched"
  [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched"
  [attr.aria-describedby]="'contact-email-msg'" />
<small id="contact-email-msg">{{ labels().emailHint }}</small>`;

  readonly ringSnippet: string = `/* The focus ring Aura zeroed, restored from an ancestor scope, for an app
   without this kit's :focus-visible rule. Works in both modes: the tokens are
   inherited by the field, and the ring is an outline, not the border. */
.form-ring {
  --p-inputtext-focus-ring-width: 2px;
  --p-inputtext-focus-ring-style: solid;
  --p-inputtext-focus-ring-color: var(--primary-color-fg);
  --p-inputtext-focus-ring-offset: 2px;
  --p-textarea-focus-ring-width: 2px;
  --p-textarea-focus-ring-style: solid;
  --p-textarea-focus-ring-color: var(--primary-color-fg);
  --p-textarea-focus-ring-offset: 2px;
}

/* template */
<div class="form-ring"> ... </div>`;

  readonly themingSnippet: string = `/* Scoped to one form. Padding passes through in every style and mode;
   the input radius does not in Werkbund or Blaupause (style rule). */
.compact-form {
  --p-inputtext-padding-y: 0.375rem;
  --p-textarea-padding-y: 0.375rem;
  --p-textarea-border-radius: 2px;
}

/* template */
<div class="compact-form"> ... </div>`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';

@Component({
  standalone: true,
  imports: [InputTextModule, InputGroupModule, InputGroupAddonModule],
  template: \`
    <label for="budget">Monthly budget in euro</label>
    <p-inputgroup>
      <p-inputgroup-addon>EUR</p-inputgroup-addon>
      <input pInputText id="budget" type="text" />
    </p-inputgroup>\`,
})
class HostComponent {}

describe('input group addon', () => {
  it('labels the field, and the addon stays out of the name', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    // The label binds because pInputText leaves a native <input> in place.
    expect(label.control).toBe(input);
    // The addon is a sibling element with no role and no naming relationship,
    // so the unit has to be in the label - as it is here.
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(label.textContent).toContain('euro');
  });
});`;

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
        /* clipboard denied — leave the label unchanged */
      },
    );
  }
}
