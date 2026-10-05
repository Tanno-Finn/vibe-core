import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import type { ButtonSeverity } from '@openng/optimus-ui/button';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    FormsModule,
    RouterLink,
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
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .ex__stack {
        width: 100%;
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
      .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        border: 1px solid var(--primary-color-fg);
        border-radius: var(--radius-md);
        text-decoration: none;
      }
      .link-btn:hover {
        background: color-mix(in srgb, var(--primary-color-fg) 10%, transparent);
      }
      .link-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
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
 * Guide article: Button (SPEC N5, Guides pilot).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template — the shell owns all chrome (header, toolbar, tablist,
 * quick-switch, the Agent tab). Content is written fresh for THIS kit: the live
 * examples are real `p-button`s, the code snippets are copy-pasteable, and every
 * fact stated is verified against this kit's real configuration.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Theme preset: Aura (`app.config.ts` → provideOptimus({ theme: { preset: Aura } })).
 *   - THREE layers style buttons: the Aura token layer (plus each visual style's
 *     `presetOverrides.components.button` in `ui-styles.ts` — radius, dark
 *     severity scheme); a static `<style>` the kit's ThemeService writes once
 *     (`applyButtonGradientStyles()`) that forces filled primary buttons to a
 *     `linear-gradient(...) !important` fill and reads only tokens
 *     (`--primary-color`, `--gradient-accent-color`, `--button-border`,
 *     `--primary-hover-filter`, `--gradient-<severity>-*`, `--outlined-<severity>-fg`);
 *     and the `html.style-<name>` blocks in `styles.scss` (ADR-0016) that add the
 *     style's outline, radius, font, and pressed state.
 *   - `--primary-color*` is set at runtime from the selected accent; the
 *     `#f59e0b` in `styles.scss` is only the pre-JS fallback.
 *   - The button focus ring is the ONE kit ring: `.p-button:focus-visible` is in
 *     the `styles.scss` rule that draws `2px solid var(--primary-color-fg)` at a
 *     2px offset with `!important`, so Aura's 1px `{focus.ring}` never shows;
 *     `scripts/check-contrast.mjs` asserts the selector (KIT_RING_SELECTORS) and
 *     measures the ring in CONTRAST.MD "focus ring".
 *   - Text/link severities take the kit's semantic inks (`--p-button-text-*-color`
 *     in `styles.scss`), gated in CONTRAST.MD "text & link button"; the filled
 *     contrast severity is gated in "filled button (contrast)".
 *   - Button size/spacing tokens: `@openng/optimus-ui-themes/dist/aura/button/index.mjs` (root)
 *     resolving `{form.field.*}` from `@openng/optimus-ui-themes/dist/aura/base/index.mjs`
 *     (Aura 2.x values: formField paddingX 0.75rem / paddingY 0.5rem; no root
 *     font-size token — the styles layer sets `font-size: 1rem` literally);
 *     flex layout and order/dir rules from
 *     `@openng/optimus-ui-styles/dist/button/index.mjs` (2.0.2, `font-size` :14,
 *     `:dir(rtl)` order rules :33-45).
 *   - Outputs `onClick: EventEmitter<MouseEvent>`, `onFocus`/`onBlur:
 *     EventEmitter<FocusEvent>` (`openng-optimus-ui-button.mjs:746,753,760`);
 *     template slots #content/#icon/#loadingicon PLUS the legacy `pTemplate`
 *     route, which Optimus keeps (`templates: QueryList<PrimeTemplate>`, resolved
 *     in `onAfterContentInit` :787-802). Component inputs are PLAIN properties,
 *     not signal inputs — only `fluid` is a signal input — from
 *     `@openng/optimus-ui/types/openng-optimus-ui-button.d.ts` (2.0.2).
 *   - Optimus keeps `label`/`icon` on the `pButton` DIRECTIVE, but `@deprecated`
 *     in favor of `pButtonLabel`/`pButtonIcon` children (typings :227,234); they
 *     still work (`createLabel`/`createIcon` :490,498). `iconPos` is not
 *     deprecated. The `<p-button>` COMPONENT keeps all three undeprecated.
 *   - RTL: `iconPos` is PHYSICAL — re-verified against @openng/optimus-ui-styles 2.0.2.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-button-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'button'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every button below is a real <code>p-button</code>. Start in the playground to dial in a variant and copy its
          markup; the blocks underneath pair each rendered control with the exact code.
        </p>

        <!-- Mini playground: live-configure a button and read back the markup. -->
        <section class="pg" aria-label="Button playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <!-- p-select is named through [ariaLabelledBy], not <label for>: its focusable
                   element is a <span role="combobox">, which a label cannot bind to. The
                   Select guide's naming table covers all three patterns. -->
              <div class="pg__field">
                <span class="pg__label" id="pg-severity-label">Severity</span>
                <p-select
                  [ariaLabelledBy]="'pg-severity-label'"
                  size="small"
                  [options]="severityOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSeverity()"
                  (ngModelChange)="pgSeverity.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-variant-label">Variant</span>
                <p-select
                  [ariaLabelledBy]="'pg-variant-label'"
                  size="small"
                  [options]="variantOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgVariant()"
                  (ngModelChange)="pgVariant.set($event)"
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

              <div class="pg__field pg__field--switch">
                <label for="pg-icon">Leading icon</label>
                <p-toggleswitch inputId="pg-icon" [ngModel]="pgIcon()" (ngModelChange)="pgIcon.set($event)" />
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
                <p-button
                  label="Save changes"
                  [severity]="pgSeverity()"
                  [outlined]="pgVariant() === 'outlined'"
                  [text]="pgVariant() === 'text'"
                  [size]="pgSizeInput()"
                  [icon]="pgIcon() ? 'pi pi-check' : ''"
                  [disabled]="pgDisabled()"
                />
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
                @case ('variants') {
                  <p-button label="Save" />
                  <p-button label="Cancel" severity="secondary" [outlined]="true" />
                  <p-button label="Learn more" [text]="true" />
                }
                @case ('icon') {
                  <p-button label="Download" icon="pi pi-download" />
                  <p-button label="Continue" icon="pi pi-arrow-right" iconPos="right" />
                }
                @case ('icononly') {
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    [rounded]="true"
                    [text]="true"
                    ariaLabel="Delete row"
                  />
                }
                @case ('loading') {
                  <p-button
                    [label]="loadingDemo() ? 'Saving' : 'Save (click me)'"
                    [loading]="loadingDemo()"
                    (onClick)="runLoadingDemo()"
                  />
                  <p-button label="Submit" [disabled]="true" />
                }
                @case ('sizes') {
                  <p-button label="Small" size="small" />
                  <p-button label="Normal" />
                  <p-button label="Large" size="large" />
                }
                @case ('fullwidth') {
                  <div class="ex__stack">
                    <p-button label="Full width on phones" styleClass="btn-mobile-full" />
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
        <h3>Button or link?</h3>
        <p>
          The single most common mistake. A <strong>button performs an action</strong> (save, delete, open a dialog,
          submit). A <strong>link navigates</strong> to another route or URL. If the target is a place, use an anchor /
          <code>routerLink</code>, styled as a button if you like — never a <code>p-button</code> with a manual
          <code>router.navigate</code> in its click handler.
        </p>
        <ul>
          <li><strong>Action</strong> → <code>&lt;p-button (onClick)="save()"&gt;</code></li>
          <li>
            <strong>Navigation</strong> → <code>&lt;a routerLink="/learn"&gt;</code> (see the component gallery's
            link-styled patterns)
          </li>
        </ul>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          The rendered pairs below are the three failures worth memorizing. The
          <span class="tag tag--bad">Don't</span> is on the left, the <span class="tag tag--good">Do</span> on the
          right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — two competing primaries</span>
            <div class="dd__stage">
              <p-button label="Save" />
              <p-button label="Publish" />
            </div>
            <p class="dd__why">Both carry the brand fill, so neither reads as the main action.</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — one primary, one supporting</span>
            <div class="dd__stage">
              <p-button label="Publish" />
              <p-button label="Save draft" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">A single filled button sets the hierarchy; outlined supports it.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a button that navigates</span>
            <div class="dd__stage">
              <p-button label="Go to the dev hub" icon="pi pi-arrow-right" iconPos="right" />
            </div>
            <p class="dd__why">
              A click handler calling <code>router.navigate</code> breaks middle-click, open-in-new-tab, and "copy
              link".
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a real link, styled as a button</span>
            <div class="dd__stage">
              <!-- A genuinely working link — the example practices what it
                   preaches (middle-click, copy-link, correct role all real). -->
              <a class="link-btn" routerLink="/dev">
                Go to the dev hub <i class="pi pi-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
            <p class="dd__why">
              An <code>&lt;a routerLink&gt;</code> keeps every navigation affordance and the correct role.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — vague label</span>
            <div class="dd__stage">
              <p-button label="OK" />
              <p-button label="Yes" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">Read out of context, "OK" says nothing about the outcome.</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — verb-first label</span>
            <div class="dd__stage">
              <p-button label="Delete account" severity="danger" />
              <p-button label="Keep account" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">The verb names the outcome, so the choice is legible anywhere.</p>
          </div>
        </div>

        <h3>One primary action per view</h3>
        <p>
          A view should have exactly one filled primary button — the thing you most want the user to do. Everything else
          is <code>severity="secondary" [outlined]="true"</code> or <code>[text]="true"</code>. Two competing primaries
          means neither reads as primary.
        </p>

        <h3>Verb-first labels</h3>
        <p>
          Label the outcome, not the mechanism: <em>Save changes</em>, <em>Delete account</em>, <em>Start quiz</em> —
          not <em>OK</em>, <em>Submit</em>, or <em>Yes</em>. Sentence-case, lead with the verb (the GOV.UK Design System
          guidance below). A label read out of context — by a screen reader, or in a list of controls — must still say
          what the button does.
        </p>

        <h3>When something else fits better</h3>
        <ul>
          <li>
            Choosing one of a few mutually exclusive options in place → <code>p-selectbutton</code>, not a row of
            buttons.
          </li>
          <li>An on/off setting that applies immediately → <code>p-toggleswitch</code>.</li>
          <li>A binary in a form submitted later → a checkbox, not a toggle button.</li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA APG, Button pattern</a
            >
            — the canonical keyboard contract (Enter / Space) and the accessible-name rule for icon-only buttons.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 4.1.2 Name, Role, Value</a
            >
            — why every control needs a programmatic name; the backbone of the
            <code>ariaLabel</code> requirement.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.1 Keyboard</a
            >
            — all button functionality must be operable from the keyboard; anchors the "use a real
            <code>&lt;button&gt;</code>" rule.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24×24&nbsp;CSS-px floor that the mobile full-width rule and the icon-only sizing are measured against.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Button element</a
            >
            — native semantics (focusability, form participation, Enter/Space) that
            <code>p-button</code> inherits by rendering a real <code>&lt;button&gt;</code>.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — aria-disabled</a
            >
            — the difference between native <code>disabled</code> (unfocusable, announced weakly) and
            <code>aria-disabled</code> (focusable, discoverable); basis for the disabled-pattern decision table.
          </li>
          <li>
            <a href="https://design-system.service.gov.uk/components/button/" target="_blank" rel="noopener noreferrer">
              GOV.UK Design System — Button</a
            >
            — a production-grade primary source on button copy (sentence-case, action-describing) and on why disabling
            buttons harms users.
          </li>
          <li>
            <a href="https://optimus.openng.org/button/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Button component</a
            >
            — the full input / output / template API this guide maps onto the kit's conventions.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          A <code>p-button</code> renders a native <code>&lt;button class="p-button p-component"&gt;</code> (root) that
          lays its parts out with <code>display: inline-flex</code> and a token-driven gap. The parts:
        </p>
        <ul>
          <li>
            <strong>Container</strong> — the <code>.p-button</code> root: background, border, padding, radius, focus
            outline.
          </li>
          <li><strong>Label</strong> — <code>.p-button-label</code>, font-weight 500.</li>
          <li>
            <strong>Icon</strong> — <code>.p-button-icon</code>, placed by <code>iconPos</code> (left / right / top /
            bottom).
          </li>
          <li>
            <strong>Loading icon</strong> — <code>.p-button-loading-icon</code>, a spinner that replaces the leading
            icon while <code>loading</code> is true.
          </li>
          <li>
            <strong>Badge</strong> — optional <code>.p-badge</code> child, sized from
            <code>button.badge.size</code> (1rem), driven by the <code>badge</code> input.
          </li>
          <li>
            <strong>Focus ring</strong> — the <code>:focus-visible</code> outline (see the state table), never removed.
          </li>
          <li>
            <strong>Ink</strong> — a <code>.p-ink</code> span the built-in <code>pRipple</code> appends while the global
            <code>ripple</code> config is on; <code>aria-hidden</code>, see Development → Ripple.
          </li>
        </ul>
        <p class="src-note">
          Anatomy verified from <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code> and the class map in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-button.mjs</code>.
        </p>

        <h3>Size scale — real token values</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>default</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px) — CSS literal, no token</td>
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
                <td>icon-only width / rounded height</td>
                <td>2rem (32px)</td>
                <td>2.5rem (40px)</td>
                <td>3rem (48px)</td>
              </tr>
              <tr>
                <td>gap (icon↔label)</td>
                <td colspan="3">0.5rem (8px), all sizes</td>
              </tr>
              <tr>
                <td>border-radius</td>
                <td colspan="3">
                  per visual style (Aura stock 6px; werkbund 0, lernwerkstatt 999px, skizzenbuch hand-drawn,
                  blaupause 2px); <code>rounded</code>: 2rem
                </td>
              </tr>
              <tr>
                <td>label font-weight</td>
                <td colspan="3">500</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Measured from the <strong>Aura 2.x</strong> preset shipped by
          <code>&#64;openng/optimus-ui-themes</code> 2.0.2 (the kit's active preset, <code>app.config.ts</code>):
          <code>&#64;openng/optimus-ui-themes/dist/aura/button/index.mjs</code> resolves
          <code>&#123;form.field.*&#125;</code> against <code>&#8230;/aura/base/index.mjs</code> (formField paddingX
          0.75rem / paddingY 0.5rem; sm 0.625 / 0.375; lg 0.875 / 0.625; iconOnlyWidth 2.5rem, sm 2rem, lg 3rem).
          <strong>The Aura&nbsp;3.0 scale is gone again</strong> — PrimeNG&nbsp;22 shipped a compacted set (default
          font-size 14px, icon-only 28/36/42px); Optimus is back on the larger 2.x values, so a 22-era screenshot no
          longer matches. There is <strong>no <code>button.font.size</code> token</strong>: the root font-size is a
          <code>1rem</code> literal in <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs:14</code>, and only
          <code>sm</code>/<code>lg</code> carry font-size tokens. There is no fixed height on text buttons — height is
          content + padding; only icon-only buttons pin width (and, when <code>rounded</code>, height) to the icon-only
          token. The radius is the one geometry value that moves: each visual style sets
          <code>button.root.borderRadius</code> through its <code>presetOverrides</code> in
          <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>Interaction states — the layers</h3>
        <p>
          A filled primary button is styled by stacked sources. The <em>Aura token layer</em> is what Optimus ships;
          the <em>kit render</em> column is what you actually see, because the kit's <code>ThemeService</code> writes a
          static <code>!important</code> block on top that reads only tokens (this is why the live examples above show
          a gradient, not a flat fill), and the active visual style's <code>html.style-&lt;name&gt;</code> block in
          <code>styles.scss</code> adds its outline, font, and pressed state.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token layer</th>
                <th>What this kit actually renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>base fill</td>
                <td>flat <code>&#123;primary.color&#125;</code>, 1px border</td>
                <td>
                  <code>background: linear-gradient(135deg, primary → accent) !important</code>;
                  <code>border: var(--button-border, none) !important</code> — each visual style sets its own ink
                  edge (werkbund: 3px in light mode, 2px in dark)
                </td>
              </tr>
              <tr>
                <td>hover</td>
                <td>color shifts one step (<code>&#123;primary.hover.color&#125;</code>)</td>
                <td>
                  gradient <code>background-position</code> shift + <code>filter: var(--primary-hover-filter)</code>, a
                  brightness computed per accent and mode so the label keeps 4.5:1;
                  <code>transition: background-position 0.4s, filter 0.3s</code>
                </td>
              </tr>
              <tr>
                <td>active</td>
                <td>color shifts a second step (<code>&#123;primary.active.color&#125;</code>)</td>
                <td>
                  no color stage; werkbund, lernwerkstatt, and skizzenbuch press the button in
                  (<code>:enabled:active</code> <code>transform: translate(…)</code>), blaupause does nothing
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <strong>1px solid</strong> <code>&#123;primary.color&#125;</code>, <strong>offset 2px</strong>,
                  box-shadow none
                </td>
                <td>
                  the <strong>one kit ring</strong>: <strong>2px solid</strong> <code>--primary-color-fg</code> (the
                  contrast-adjusted accent), <strong>offset 2px</strong>, <code>!important</code> — the same ring as
                  fields, radios, and segments (see note)
                </td>
              </tr>
              <tr>
                <td>disabled</td>
                <td colspan="2">
                  <code>opacity: 0.6</code> (<code>--p-disabled-opacity</code>) + <code>cursor: default</code>; no
                  hover/active. Same in both layers.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit render column read from the static <code>&lt;style id="button-gradient-styles"&gt;</code> that
          <code>ThemeService.applyButtonGradientStyles()</code> writes once (its values are tokens that
          <code>buildTokenMaps</code> sets per style, accent, and mode) and from the
          <code>html.style-&lt;name&gt;</code> button rules in <code>styles.scss</code>. Aura token layer from
          <code>&#8230;/aura/button/index.mjs</code> + base <code>focusRing</code> (1px / solid / 2px).
          <strong>Focus ring:</strong> <code>.p-button:focus-visible</code> is one selector of the kit's single ring
          rule in <code>styles.scss</code>, which beats the preset's 1px <code>&#123;primary.color&#125;</code> ring
          with <code>!important</code>; <code>--primary-color-fg</code> is the accent foreground
          <code>ThemeService</code> keeps readable per theme. Measured in <code>docs/generated/CONTRAST.MD</code>,
          row <code>focus ring</code> (page surfaces and the dialog panel, ≥&nbsp;3.88:1). The 0.6 disabled opacity
          is the global rule in
          <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>.
        </p>

        <h3>Emphasis hierarchy &amp; the accent layer</h3>
        <p>
          The kit's brand color is a design token, not a fixed value: <code>--primary-color*</code> is set at runtime
          by <code>ThemeService</code> from the selected accent (sunset, ocean, forest, …) and mode; the
          <code>#f59e0b</code> in <code>styles.scss</code> is only the pre-JS <em>fallback</em>. Emphasis comes from
          three tiers:
        </p>
        <ul>
          <li>
            <strong>Primary</strong> — the default filled <code>p-button</code>, reserved for the one primary action.
            Note the fill is a <strong>gradient</strong> (primary → accent), forced by
            <code>ThemeService.applyButtonGradientStyles()</code> with <code>!important</code>, not the flat Aura fill.
          </li>
          <li>
            <strong>Secondary</strong> — <code>severity="secondary" [outlined]="true"</code>: a card background, label and
            2px border in <code>--outlined-secondary-fg</code> (an ink each style derives to keep 4.5:1 on the card);
            werkbund, lernwerkstatt, and skizzenbuch draw their own outline over that border. A plain <code>[outlined]="true"</code> (no severity) takes the style's outline
            (<code>--style-btn-outlined-border</code>) and <code>--text-color</code> for its label.
          </li>
          <li>
            <strong>Text</strong> — <code>[text]="true"</code>. No fill or border, for low-stakes or tertiary actions
            (e.g. "Learn more"). The label is the accent's 500 step for primary; the other severities take the
            kit's semantic inks (<code>--semantic-&lt;hue&gt;-fg</code>), secondary takes
            <code>--text-color-secondary</code>, contrast and plain <code>--text-color</code> — in both modes, on no
            fill: a dark-mode text severity button stays transparent (the old <code>--p-button-&lt;severity&gt;-*</code>
            blocks that painted it as a filled disc are gone).
          </li>
        </ul>
        <p>
          Semantic variants (<code>severity="success"</code>, <code>"danger"</code>) carry meaning, not decoration — use
          <code>danger</code> only for destructive actions. The kit paints them too: filled severities from
          <code>--gradient-&lt;severity&gt;-from/-to/-text</code>, outlined ones from
          <code>--outlined-&lt;severity&gt;-fg</code>, both set per visual style; in dark mode each style's
          <code>presetOverrides</code> also supplies its own filled severity scheme, which the gradient block paints
          over.
        </p>

        <h3>Icon placement &amp; mobile</h3>
        <p>
          Lead with the icon for most actions (<code>icon="pi pi-download"</code>); put it on the trailing edge
          (<code>iconPos="right"</code>) only for "forward / continue" motion. <strong>Narrow screens:</strong> a
          button has no intrinsic responsive behavior — it keeps its content width at every viewport, and a row of
          buttons needs a wrapping container (<code>flex-wrap: wrap</code>). On phones (≤&nbsp;640px), give a
          reach-critical primary button full width via the global utility
          <code>styleClass="btn-mobile-full"</code> (defined in <code>styles.scss</code>; a no-op above the breakpoint)
          so the touch target clears the WCAG 2.5.8 24px floor comfortably.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.2 (a native <code>&lt;button&gt;</code> named by its visible label or by
          <code>ariaLabel</code>), SC 2.1.1 with the native button keyboard model — Tab to reach it, Enter on key-down,
          Space on key-up — SC 2.4.7 and SC 1.4.11 with the kit's 2px <code>--primary-color-fg</code> ring at 2px
          offset, and SC 1.4.3 for the label pairs the contrast gate computes (see below). <strong>Failing:</strong> none of the
          measured criteria fails. <strong>Conditional:</strong> SC 2.5.8 — only icon-only buttons pin a size (32px
          small, 40px default, 48px large on the Aura 2.x tokens Optimus ships — the PrimeNG 22 / Aura 3.0 set was one
          step smaller at 28/36/42px); a text button has no fixed height at all, so its target is content plus
          padding, and on phones the full-width mobile utility is the documented route to a comfortable one.
          <strong>AAA</strong> is not assessed for this component.
        </p>
        <p class="src-note">
          Label contrast from <code>docs/generated/CONTRAST.MD</code>, rows <code>filled button</code>,
          <code>filled button (hover)</code>, <code>severity button</code>, <code>outlined severity</code>,
          <code>text &amp; link button</code>, and <code>filled button (contrast)</code>: every style × accent × mode
          pair meets 4.5:1 — lowest filled 4.73:1 (sunset, hover, light mode), lowest text button 4.60:1, lowest
          overall 4.52:1 (lernwerkstatt danger, hover). The ring: row <code>focus ring</code>, 3.88–17.85:1 on the page surfaces and the dialog panel.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>ButtonModule</code> exposes the <code>&lt;p-button&gt;</code> component and the
          <code>pButton</code> directive. Use the <strong>component</strong> for standalone actions (it handles label,
          icon, loading, sizing); use the <strong>directive</strong> on a native <code>&lt;button&gt;</code> when you
          need full control of the element (e.g. a form's submit button, or a toolbar back button).
        </p>
        <p>
          <strong>Deprecated, not removed:</strong> PrimeNG&nbsp;22 dropped <code>label</code> and <code>icon</code>
          from the directive; Optimus keeps them as working setters marked <code>&#64;deprecated</code>
          (<code>openng-optimus-ui-button.d.ts:227,234</code>), so old bindings still compile and still stamp the spans
          (<code>createLabel</code>/<code>createIcon</code>, <code>:490</code>/<code>:498</code>). Prefer the children
          form anyway, marked with the <code>pButtonIcon</code> / <code>pButtonLabel</code> directives (they stamp
          <code>.p-button-icon</code> / <code>.p-button-label</code>, which carry the icon order rules and the 500 label
          weight; bare text renders unstyled). <code>iconPos</code> is a live, non-deprecated directive input. The
          directive also carries
          <code>severity</code>/<code>outlined</code>/<code>text</code>/<code>plain</code>/<code>size</code>/
          <code>rounded</code>/<code>raised</code>/<code>loadingIcon</code>/
          <code>fluid</code>/<code>loading</code> — but <strong>not</strong> <code>variant</code> or <code>link</code>,
          which exist only on the component; for disabling use the native <code>disabled</code> attribute
          (<code>openng-optimus-ui-button.mjs</code>: directive <code>:222</code>, declared inputs <code>:546</code>;
          <code>pButtonIcon</code> <code>:164</code>, <code>pButtonLabel</code> <code>:110</code>).
        </p>
        <pre class="code-block"><code>{{ directiveSnippet }}</code></pre>

        <h3>Core inputs</h3>
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
                <td><code>label</code></td>
                <td>string</td>
                <td>Visible text — bind an i18n value, never a hard-coded string.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>PrimeIcons class, e.g. <code>pi pi-download</code>.</td>
              </tr>
              <tr>
                <td><code>iconPos</code></td>
                <td>'left' | 'right' | 'top' | 'bottom'</td>
                <td>Icon side; default left. Physical, not logical — see the i18n tab for RTL.</td>
              </tr>
              <tr>
                <td><code>severity</code></td>
                <td>ButtonSeverity</td>
                <td>
                  <code>secondary</code>, <code>success</code>, <code>info</code>, <code>warn</code>,
                  <code>danger</code>, <code>help</code>, <code>contrast</code> (or omit for primary).
                </td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'text'</td>
                <td>
                  Alternative to the <code>[outlined]</code>/<code>[text]</code> booleans. PrimeNG&nbsp;22 had
                  <code>'link'</code> in the union; Optimus does not — use the <code>[link]</code> boolean. Component
                  only, not on the directive.
                </td>
              </tr>
              <tr>
                <td><code>outlined</code></td>
                <td>boolean</td>
                <td>Bordered, no fill — the standard secondary look.</td>
              </tr>
              <tr>
                <td><code>text</code></td>
                <td>boolean</td>
                <td>No fill or border — tertiary actions.</td>
              </tr>
              <tr>
                <td><code>raised</code></td>
                <td>boolean</td>
                <td>
                  Adds an elevation shadow (<code>button.raised.shadow</code>). Style-dependent here: werkbund removes
                  shadows, lernwerkstatt and skizzenbuch replace them with their own.
                </td>
              </tr>
              <tr>
                <td><code>rounded</code></td>
                <td>boolean</td>
                <td>Pill radius (2rem); a circle when icon-only.</td>
              </tr>
              <tr>
                <td><code>link</code></td>
                <td>boolean</td>
                <td>Renders as an inline link style (still a <code>&lt;button&gt;</code>).</td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td>boolean</td>
                <td>Shows a spinner and blocks clicks while true.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>Non-interactive; keep it truthful (see the disabled pattern below).</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Omit for the default size.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Spans 100% of the container width (or inherits from a <code>p-fluid</code> ancestor).</td>
              </tr>
              <tr>
                <td><code>badge</code></td>
                <td>string</td>
                <td>Renders a <code>p-badge</code> child (e.g. a count).</td>
              </tr>
              <tr>
                <td><code>badgeSeverity</code></td>
                <td>'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast'</td>
                <td>Color of that badge (default secondary).</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code></td>
                <td>string</td>
                <td>Accessible name — REQUIRED for icon-only buttons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs verified against <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> (Optimus UI
          2.0.2). This table is the <strong>component's</strong>; the directive's subset is listed above. Component
          inputs are <strong>plain properties</strong>, not signal inputs — PrimeNG&nbsp;22 had converted them to
          <code>InputSignal</code>, Optimus is back on the v21 form (<code>isSignal: false</code> throughout the
          <code>ɵcmp</code> input map, <code>openng-optimus-ui-button.mjs:832</code>). The one exception is
          <code>fluid</code>, an <code>InputSignalWithTransform</code>. A code read is therefore a property access
          (<code>btn.label</code>), not a call. <code>buttonProps</code> (bulk-set object) exists on both component and
          directive, the latter <code>&#64;deprecated</code>; there is no <code>iconOnly</code> input — icon-only is
          derived from the absence of a label. Unions: <code>variant = 'outlined' | 'text'</code>;
          <code
            >ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' |
            'contrast'</code
          >
          (nullable) (<code>openng-optimus-ui-types-button.d.ts:126</code>).
        </p>

        <h3>Outputs</h3>
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
                <td><code>EventEmitter&lt;MouseEvent&gt;</code></td>
                <td>
                  Button is clicked (use this on <code>&lt;p-button&gt;</code>; on a native
                  <code>&lt;button pButton&gt;</code> use plain <code>(click)</code>).
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code></td>
                <td><code>EventEmitter&lt;FocusEvent&gt;</code></td>
                <td>Button receives focus.</td>
              </tr>
              <tr>
                <td><code>onBlur</code></td>
                <td><code>EventEmitter&lt;FocusEvent&gt;</code></td>
                <td>Button loses focus.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Exact event types from the <code>Button</code> class in <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> —
          plain <code>EventEmitter</code>s again (<code>new EventEmitter()</code> at
          <code>openng-optimus-ui-button.mjs:746</code>, <code>:753</code>, <code>:760</code>). PrimeNG&nbsp;22 had
          moved these to <code>output()</code>-based <code>OutputEmitterRef</code>s; Optimus keeps the v21 form, so the
          emitters are RxJS <code>Subject</code>-backed and <code>.pipe()</code> / the <code>async</code> pipe work
          again. Template handler syntax is unchanged either way.
        </p>

        <h3>Template slots</h3>
        <p>
          For content the inputs can't express, project a
          <strong>named template reference</strong> (<code>#content</code>, <code>#icon</code>,
          <code>#loadingicon</code>). PrimeNG&nbsp;22 had dropped the legacy <code>pTemplate</code> route;
          <strong>Optimus keeps it</strong> — a <code>&#64;ContentChildren(PrimeTemplate)</code> query feeds an
          <code>onAfterContentInit</code> switch on <code>'content'</code>/<code>'icon'</code>/<code>'loadingicon'</code>
          (<code>openng-optimus-ui-button.mjs:787-802</code>), and each slot is rendered as
          <code>xTemplate || _xTemplate</code>. Prefer the <code>#</code>-ref form; <code>pTemplate</code> is the
          fallback that still binds:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Replaces</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#content</code></td>
                <td>The entire button body (you own icon + label layout).</td>
              </tr>
              <tr>
                <td><code>#icon</code></td>
                <td>Just the icon (e.g. an inline SVG instead of a PrimeIcon).</td>
              </tr>
              <tr>
                <td><code>#loadingicon</code></td>
                <td>The spinner shown while <code>loading</code> is true.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ slotSnippet }}</code></pre>
        <p class="src-note">
          Slots verified from the <code>Button</code> content queries in
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> (<code>contentTemplate</code>, <code>iconTemplate</code>,
          <code>loadingIconTemplate</code> — decorator <code>&#64;ContentChild</code> queries, not signal queries, on
          the <code>#content</code>/<code>#icon</code>/<code>#loadingicon</code> predicates, <code>:449-459</code>,
          alongside the <code>&#64;ContentChildren(PrimeTemplate)</code> query at <code>:460</code>).
        </p>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every button token is exposed as a <code>--p-button-*</code> custom property, so you can retheme one detail
          from a scoped class. <strong>Caveat for this kit:</strong> the <code>ThemeService</code> gradient layer forces
          the filled-button <code>background</code>, <code>border</code> and text <code>color</code> with
          <code>!important</code> — those <em>color</em> properties win against any <code>--p-button-*</code> override,
          so retint filled buttons through the tokens, not here. Padding, gap, and size pass through; the radius does
          only where the active style's block does not pin it:
        </p>
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
                <td><code>--p-button-border-radius</code></td>
                <td>Corner radius (per style; Aura stock 6px).</td>
                <td>
                  Not under werkbund — its style block sets <code>border-radius: 0</code> on every non-text button;
                  elsewhere yes
                </td>
              </tr>
              <tr>
                <td><code>--p-button-padding-x</code> / <code>--p-button-padding-y</code></td>
                <td>Default-size padding.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-button-gap</code></td>
                <td>Icon↔label gap (0.5rem).</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-button-icon-only-width</code></td>
                <td>Icon-only square size (2.5rem on the Aura 2.x tokens Optimus ships).</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-button-primary-background</code></td>
                <td>Filled fill.</td>
                <td>No — beaten by the injected <code>!important</code> gradient</td>
              </tr>
              <tr>
                <td><code>--p-button-primary-focus-ring-color</code></td>
                <td>Focus outline color.</td>
                <td>
                  No — the kit's one focus-ring rule (<code>--primary-color-fg</code>, <code>!important</code>)
                  draws over it
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Geometry override that actually lands (no hard-coded colors, survives a preset change):</p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Property names follow the <code>p</code> prefix set in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). The color-override caveat is the injected filled-button rule (<code
            >background/border/color … !important</code
          >). To restyle filled buttons downstream, change the tokens that layer reads — a style's entry in
          <code>src/app/services/ui-styles.ts</code> (<code>--button-border</code>, the severity fills,
          <code>presetOverrides.components.button</code>) — rather than fighting it with <code>--p-button-*</code>; the
          <code>applyButtonGradientStyles()</code> block itself is static and written once.
        </p>

        <h3>Ripple (<code>pRipple</code>)</h3>
        <p>
          The ink effect on press is its own directive, <code>pRipple</code> from <code>RippleModule</code>
          (<code>&#64;openng/optimus-ui/ripple</code>; the standalone class is <code>Ripple</code>, no inputs, no
          outputs). <code>&lt;p-button&gt;</code> already carries it on its inner button
          (<code>openng-optimus-ui-button.mjs:842</code>); the <code>pButton</code> directive does not, so a native
          button that should match writes <code>pRipple</code> beside <code>pButton</code> — the toast action button in
          <code>toast-container.component.ts</code> is the reference.
        </p>
        <pre class="code-block"><code>{{ rippleSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Global switch.</strong> Nothing renders unless the app config turns it on: <code>ripple</code>
            defaults to <code>false</code> (<code>openng-optimus-ui-config.mjs:78</code>), and the kit sets
            <code>ripple: true</code> in <code>provideOptimus</code> (<code>app.config.ts</code>). The directive watches
            that signal and adds or removes its ink live (<code>openng-optimus-ui-ripple.mjs:72-84</code>).
          </li>
          <li>
            <strong>Pointer only.</strong> It listens to <code>mousedown</code> (<code>:77</code>), so keyboard
            activation shows no ink. The ripple is never the only feedback — the focus ring and the action's result
            are.
          </li>
          <li>
            <strong>Hidden from assistive tech.</strong> The ink is a
            <code>&lt;span class="p-ink" aria-hidden="true" role="presentation"&gt;</code> appended to the host
            (<code>:138-144</code>); it adds nothing to the accessible name.
          </li>
          <li>
            <strong>Host side effect.</strong> The host gets <code>.p-ripple</code> =
            <code>position: relative; overflow: hidden</code> (<code>:13-16</code>), which clips anything positioned
            outside it — do not put <code>pRipple</code> on an element whose children must overflow.
          </li>
          <li>
            <strong>Motion.</strong> A 0.4s scale-and-fade (<code>&#64;openng/optimus-ui-styles/dist/ripple/index.mjs</code>)
            in <code>ripple.background</code>, <code>rgba(0,0,0,0.1)</code> light and <code>rgba(255,255,255,0.3)</code>
            dark (<code>&#8230;/aura/ripple/index.mjs</code>). Under <code>prefers-reduced-motion: reduce</code> the global
            catch-all at the top of <code>styles.scss</code> cuts every animation to 0.01ms, so the ink does not show; no
            per-component rule is needed.
          </li>
        </ul>

        <h3>Forms &amp; i18n</h3>
        <p>
          For a form's submit control, prefer the directive on a real submit button so native form semantics hold:
          <code>&lt;button pButton type="submit"&gt;&lt;span pButtonLabel&gt;… &lt;/span&gt;&lt;/button&gt;</code> (in
          Optimus the directive's <code>label</code> input still exists but is <code>&#64;deprecated</code> — see the
          note above). Always feed the label from a
          translation key resolved through the kit's <code>TranslationService</code> (typically a
          <code>computed()</code> label map in the component) — never a hard-coded string — so the button localizes with
          everything else.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Accessible name</strong> — every button has visible text OR an <code>ariaLabel</code>. An icon-only
            button with neither is unusable to a screen reader (WCAG 4.1.2).
          </li>
          <li>
            <strong>Real button element</strong> — <code>p-button</code> / <code>pButton</code> render a native
            <code>&lt;button&gt;</code>. Never wire a click on a <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code>:
            no focus, no Enter/Space, no role.
          </li>
          <li>
            <strong>Visible focus</strong> — do not remove the focus ring; the kit draws a 2px
            <code>--primary-color-fg</code> <code>:focus-visible</code> outline at 2px offset, gated ≥&nbsp;3:1.
          </li>
          <li>
            <strong>Contrast</strong> — the kit's button tokens are held to 4.5:1 by the contrast gate (Design tab →
            WCAG status); don't override with ad-hoc colors that drop the label below it.
          </li>
        </ul>

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
                <td>Move focus in/out, in DOM order. A native <code>disabled</code> button is skipped entirely.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Activates on key-down.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Activates on key-up (native button behavior).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Per the W3C APG Button pattern and native <code>&lt;button&gt;</code> semantics (linked in Sources).
        </p>

        <h4>State semantics: pressed vs. popup</h4>
        <ul>
          <li>
            <strong>Toggle button</strong> (a button that stays "on") → <code>aria-pressed="true|false"</code>. Use this
            only for a real on/off control rendered as a button; for a settings toggle prefer
            <code>p-toggleswitch</code>.
          </li>
          <li>
            <strong>Menu / dialog trigger</strong> → <code>aria-haspopup="menu"</code> (or <code>"dialog"</code>) plus
            <code>aria-expanded</code> reflecting the open state.
          </li>
          <li>Never set both on the same button — they describe different widgets.</li>
        </ul>

        <h4>Accessible-disabled: choose deliberately</h4>
        <p>
          A grayed-out <code>disabled</code> button is often a usability trap: it is unfocusable, so screen-reader and
          keyboard users can't reach it to discover <em>why</em> it's off, and the reason is usually invisible. Decide
          per case:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Pattern</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Form incomplete, but could become valid</td>
                <td>
                  Keep the button <strong>enabled</strong>; on click, validate and move focus to the first error.
                  <em>Or</em> use <code>aria-disabled="true"</code> (focusable) with a visible reason, and don't run the
                  action.
                </td>
              </tr>
              <tr>
                <td>Action permanently impossible in this context</td>
                <td><strong>Omit</strong> the button entirely — don't show a control that can never work.</td>
              </tr>
              <tr>
                <td>Genuinely inert and the reason is already obvious on screen</td>
                <td>
                  Native <code>[disabled]="true"</code> is acceptable — but only when losing focusability (and the
                  announcement) costs the user nothing.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rationale: MDN <code>aria-disabled</code> and the GOV.UK Design System's "don't disable buttons" guidance
          (both linked in Sources).
        </p>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ Every button has a visible label or an <code>ariaLabel</code>.</li>
          <li>☐ It renders a native <code>&lt;button&gt;</code> (not a clickable div/span).</li>
          <li>☐ Reachable and operable by <kbd>Tab</kbd> + <kbd>Enter</kbd>/<kbd>Space</kbd>.</li>
          <li>☐ Focus ring is visible and not overridden away.</li>
          <li>☐ Exactly one primary (filled) button per view.</li>
          <li>☐ Label is verb-first and legible out of context.</li>
          <li>☐ Disabled state is a deliberate choice (see the table), not a reflex.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec that matches the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) — it renders an icon-only button and asserts its accessible name
          comes from <code>ariaLabel</code>:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <ul>
          <li>
            <strong>Labels via keys</strong> — never hard-code button text; bind a translation key so the raw-key gate
            (<code>check-i18n-keys.mjs</code>) can verify it resolves.
          </li>
          <li>
            <strong>Length tolerance</strong> — German labels run noticeably longer than English ("Speichern" vs "Save",
            "Herunterladen" vs "Download"). Let buttons size to content and wrap the row; never fix a width that
            truncates a translated label.
          </li>
          <li>
            <strong>Easy-Language</strong> — in the <code>*-easy</code> variants prefer the plainest verb ("Start",
            "Weiter", "Fertig") and avoid compound nouns; the label still leads with the verb.
          </li>
        </ul>

        <h3>RTL: <code>iconPos</code> is physical, not logical</h3>
        <p>
          A leading icon does <em>not</em> move to the reading-start side automatically under RTL. Optimus positions the
          icon with flexbox <code>order</code> plus <code>:dir(rtl)</code> overrides in
          <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code>:
        </p>
        <pre class="code-block"><code>{{ rtlSnippet }}</code></pre>
        <p>
          Those <code>:dir(rtl)</code> rules <strong>cancel</strong> the mirroring that a plain flex row would apply,
          which pins the icon to a <strong>physical</strong> side: <code>iconPos="left"</code> stays on the visual left
          and <code>iconPos="right"</code> on the visual right in both LTR and RTL. So a "leading" icon set to
          <code>left</code> ends up on the <em>trailing</em> side in an RTL locale.
        </p>
        <p>
          If you extend the kit to an RTL language, flip <code>iconPos</code> reactively so the icon follows the reading
          direction:
        </p>
        <pre class="code-block"><code>{{ rtlWorkaround }}</code></pre>
        <p class="src-note">
          This kit ships LTR languages only, so nothing here is wired today — the section exists for downstream RTL
          extensions. Behavior read from
          <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code> (2.0.2 — the <code>:dir(rtl)</code> order rules
          are unchanged at <code>:33-45</code>); the button root is <code>display: inline-flex</code> in the same file.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.10</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the one kit focus ring
            (2px <code>--primary-color-fg</code>), text buttons on the kit semantic inks and transparent in dark mode too,
            text and contrast buttons now gated.
          </li>
          <li>
            <strong>v0.9</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            the render layers now include the per-style blocks and the token-only ThemeService block (border, hover
            filter, pressed state, radius per style); secondary and severity buttons described as the kit paints them;
            label contrast cited from the contrast gate; narrow-screen statement added. The ripple directive
            (<code>pRipple</code>) folded in: <code>covers: [button, ripple]</code>, contract in Development and the
            agent doc.
          </li>
          <li>
            <strong>v0.8</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): four v22 claims flipped back —
            the <code>pButton</code> directive keeps <code>label</code>/<code>icon</code> as working but
            <code>&#64;deprecated</code> setters (<code>iconPos</code> not deprecated at all), component inputs are
            plain properties again rather than <code>InputSignal</code>, outputs are <code>EventEmitter</code>s, and the
            <code>pTemplate</code> slot route survives; <code>variant</code> lost <code>'link'</code>, which stays a
            boolean. Size scale re-read from the Aura 2.x tokens Optimus ships (padding 0.75/0.5rem, icon-only
            32/40/48px, no root font-size token — a <code>1rem</code> literal in the styles layer). All line refs
            re-derived against the <code>openng-optimus-ui-button</code> bundle and typings.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0:
            <code>pButton</code> directive lost <code>label</code>/<code>icon</code>/<code>iconPos</code> (children via
            <code>pButtonIcon</code>/<code>pButtonLabel</code> now, with migration snippet); size scale re-measured
            (Aura 3.0 shrank everything one step — font 14px default, icon-only 28/36/42px); inputs are signal inputs,
            outputs are <code>OutputEmitterRef</code>s; <code>pTemplate</code> slot route removed;
            <code>variant</code> union gained <code>'link'</code>.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-07-30 — Editorial pass: evidence trimmed to citations, app line references
            replaced by method and selector names.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-07-29 — Playground selects renamed via <code>[ariaLabelledBy]</code>;
            cross-reference to the Select guide's naming table.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-07-22 — Focus-ring section rewritten around the re-registered
            <code>semantic.primary</code> scale.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-22 — Reference pass: playground and loading demo, Do/Don't pairs, Design and
            Development tabs, accessibility depth, RTL section, the two-layer <code>ThemeService</code> styling model,
            expanded sources.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-22 — Initial guide: examples, usage, design, development, quality, i18n,
            sources, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ButtonArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);

  // --- Interactive loading demo (SSR-safe, cleaned up on destroy) -----------
  readonly loadingDemo = signal(false);
  protected loadingTimer: ReturnType<typeof setTimeout> | null = null;
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.loadingTimer !== null) clearTimeout(this.loadingTimer);
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  runLoadingDemo(): void {
    if (!isPlatformBrowser(this.platformId) || this.loadingDemo()) return;
    this.loadingDemo.set(true);
    this.loadingTimer = setTimeout(() => {
      this.loadingDemo.set(false);
      this.loadingTimer = null;
    }, 2000);
  }

  // --- Playground state ------------------------------------------------------
  readonly severityOptions = [
    { label: 'Primary (default)', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
    { label: 'Warn', value: 'warn' },
    { label: 'Danger', value: 'danger' },
    { label: 'Contrast', value: 'contrast' },
  ];
  readonly variantOptions = [
    { label: 'Filled', value: 'filled' },
    { label: 'Outlined', value: 'outlined' },
    { label: 'Text', value: 'text' },
  ];
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgSeverity = signal<ButtonSeverity>('primary');
  readonly pgVariant = signal<'filled' | 'outlined' | 'text'>('filled');
  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgIcon = signal(false);
  readonly pgDisabled = signal(false);

  /** 'normal' maps to the default (no size input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = ['label="Save changes"'];
    if (this.pgSeverity() && this.pgSeverity() !== 'primary') attrs.push(`severity="${this.pgSeverity()}"`);
    if (this.pgVariant() === 'outlined') attrs.push('[outlined]="true"');
    if (this.pgVariant() === 'text') attrs.push('[text]="true"');
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgIcon()) attrs.push('icon="pi pi-check"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    return `<p-button\n  ${attrs.join('\n  ')} />`;
  });

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'variants',
      title: 'Emphasis tiers',
      note: 'Primary (filled), secondary (outlined), and text — one primary per view.',
      code: `<p-button label="Save" />
<p-button label="Cancel" severity="secondary" [outlined]="true" />
<p-button label="Learn more" [text]="true" />`,
    },
    {
      id: 'icon',
      title: 'With an icon',
      note: 'Lead with the icon; trail it only for forward motion (iconPos="right").',
      code: `<p-button label="Download" icon="pi pi-download" />
<p-button label="Continue" icon="pi pi-arrow-right" iconPos="right" />`,
    },
    {
      id: 'icononly',
      title: 'Icon-only (needs ariaLabel)',
      note: 'No visible text, so an ariaLabel is mandatory for the accessible name.',
      code: `<p-button icon="pi pi-trash" severity="danger" [rounded]="true"
  [text]="true" ariaLabel="Delete row" />`,
    },
    {
      id: 'loading',
      title: 'Loading & disabled',
      note: 'Click "Save" to see a real 2s loading state; loading blocks clicks, disabled is inert.',
      code: `<p-button label="Save" [loading]="saving()" (onClick)="save()" />
<p-button label="Submit" [disabled]="true" />`,
    },
    {
      id: 'sizes',
      title: 'Sizes',
      note: 'Small, default, and large — omit size for the default.',
      code: `<p-button label="Small" size="small" />
<p-button label="Normal" />
<p-button label="Large" size="large" />`,
    },
    {
      id: 'fullwidth',
      title: 'Full width on phones',
      note: 'btn-mobile-full stretches the button to 100% at ≤640px only.',
      code: `<p-button label="Full width on phones" styleClass="btn-mobile-full" />`,
    },
  ];

  readonly devImport: string = `import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  standalone: true,
  imports: [ButtonModule],
  // ...
})`;

  readonly directiveSnippet: string = `<!-- still compiles in Optimus, but @deprecated:
<button pButton type="submit" label="Save" icon="pi pi-check"></button> -->

<!-- preferred: icon and label are children -->
<button pButton type="submit">
  <i class="pi pi-check" pButtonIcon aria-hidden="true"></i>
  <span pButtonLabel>Save</span>
</button>`;

  readonly rippleSnippet: string = `import { RippleModule } from '@openng/optimus-ui/ripple';

<!-- p-button has the ripple built in; the directive form adds it explicitly -->
<button pButton pRipple type="button" (click)="undo()">
  <span pButtonLabel>{{ labels().undo }}</span>
</button>`;

  readonly slotSnippet: string = `<p-button ariaLabel="Refresh">
  <ng-template #icon>
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><!-- custom mark --></svg>
  </ng-template>
</p-button>`;

  readonly themingSnippet: string = `/* Scoped to one CTA — geometry only. Color on filled buttons is owned
   by the ThemeService gradient layer (!important), so keep colors out. */
.checkout-cta {
  --p-button-border-radius: 2rem;   /* pill corners — passes through */
  --p-button-padding-x: 1.25rem;    /* roomier hit area — passes through */
}

/* template */
<p-button label="Pay now" styleClass="checkout-cta" />`;

  readonly rtlSnippet: string = `.p-button-icon-right { order: 1; }
.p-button-icon-right:dir(rtl) { order: -1; }
.p-button:not(.p-button-vertical)
  .p-button-icon:not(.p-button-icon-right):dir(rtl) { order: 1; }`;

  readonly rtlWorkaround: string = `// isRtl is true for right-to-left locales
<p-button label="Continue"
  icon="pi pi-arrow-right"
  [iconPos]="isRtl() ? 'left' : 'right'" />`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  standalone: true,
  imports: [ButtonModule],
  template: \`<p-button icon="pi pi-trash" [rounded]="true" [text]="true"
    ariaLabel="Delete row" />\`,
})
class HostComponent {}

describe('icon-only button accessible name', () => {
  it('exposes ariaLabel as the accessible name', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    // <button> has an implicit role of "button"; its accessible
    // name is taken from aria-label when there is no visible text.
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Delete row');
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
