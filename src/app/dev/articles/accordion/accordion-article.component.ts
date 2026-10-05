import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from '@openng/optimus-ui/accordion';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** The declared type of `value` on both p-accordion and p-accordion-panel
 *  (openng-optimus-ui-accordion.d.ts:120, :212). */
export type PanelValue = string | number | string[] | number[] | null | undefined;

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [FormsModule, AccordionModule, ToggleSwitchModule, GuideShellComponent, GuideTabDirective];

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
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
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
      .pg__row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: 0.9rem;
      }
      .pg__stage {
        min-width: 0;
        padding: var(--space-4);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__readout {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex-wrap: wrap;
        margin: 0;
      }
      .pg__readout-label {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .pg__readout-value {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }
      @media (max-width: 640px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Examples --- */
      .ex__stage {
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      p-accordion {
        display: block;
        width: 100%;
        min-width: 0;
      }
      .narrow {
        max-width: 22rem;
      }
      .panel-body {
        margin: 0;
        font-size: 0.9rem;
      }
      .plain-head {
        margin: 0 0 0.25rem;
        font-size: 0.95rem;
      }
      .plain-head + .panel-body {
        margin-bottom: 0.75rem;
      }
      .field-label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin-bottom: 0.25rem;
      }
      .field {
        width: 100%;
        font: inherit;
        font-size: 0.85rem;
        padding: 0.35rem 0.5rem;
        color: var(--text-color);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-sm);
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
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-width: 0;
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

      .sources a {
        color: var(--primary-color-fg);
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
 * Guide article: Accordion (SPEC N5, Guides).
 *
 * Subject: stacked disclosure — when a set of sections is an accordion rather
 * than a tab set, a stepper, or a plain stack, and what Optimus UI's composition
 * API (`p-accordion` / `p-accordion-panel` / `-header` / `-content`) really
 * ships for the keyboard, the accessibility tree, and the prerendered HTML.
 *
 * Claims made here, with their provenance (Optimus UI 2.0.2,
 * openng-optimus-ui-accordion.mjs unless noted):
 *   - `p-accordionTab` is gone: the type entrypoint declares only Accordion,
 *     AccordionPanel, AccordionHeader, AccordionContent, AccordionStyle, and
 *     AccordionModule; the old word survives in AccordionTabOpenEvent /
 *     AccordionTabCloseEvent (:77, :93), whose `index` is the panel value.
 *   - The header host carries role="button", aria-expanded, aria-controls,
 *     aria-disabled, and a 0/-1 tabindex (:298); the content host carries
 *     role="region" plus aria-labelledby back to the header (:408). No heading
 *     and no aria-level anywhere in the bundle.
 *   - Header keys: ArrowUp/ArrowDown/Home/End/Enter/Space/NumpadEnter
 *     (:216-238), arrows skipping data-p-disabled panels (:250-260).
 *   - A SECOND keyboard layer on `p-accordion` (:526) queries
 *     [data-pc-section="accordionheader"] (:566-582) while the components emit
 *     data-pc-name (openng-optimus-ui-basecomponent.mjs:355) — every lookup is
 *     null, and the four handlers still call preventDefault (:549, :554, :559,
 *     :587).
 *   - No lazy input: p-motion runs with mountOnEnter/unmountOnLeave false and
 *     hideStrategy="visibility" (:409-416), which sets visibility:hidden,
 *     max-height:0, overflow:hidden (openng-optimus-ui-motion.mjs:26-29).
 *   - `value` is a scalar or undefined in single mode and an array under
 *     [multiple]; a non-array initial value is dropped on the first toggle
 *     (:592-613).
 *   - Aura and preset values from @openng/optimus-ui-themes/dist/aura/accordion/index.mjs
 *     and @openng/optimus-ui-styles/dist/accordion/index.mjs.
 */
@Component({
  selector: 'app-accordion-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'accordion'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          An accordion is a column of headers, each of which opens a body underneath it. Everything below is the real
          Optimus UI component — the composition API that replaced the single-element
          <code>p-accordionTab</code>: a <code>p-accordion</code> holding <code>p-accordion-panel</code> elements, each
          with a <code>p-accordion-header</code> and a <code>p-accordion-content</code>.
        </p>

        <section class="pg" aria-label="Accordion playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>
              <label class="pg__row" for="pg-multiple">
                <p-toggleswitch
                  inputId="pg-multiple"
                  [ngModel]="pgMultiple()"
                  (ngModelChange)="onMultiple($event)"
                />
                <span>Multiple panels open</span>
              </label>
              <label class="pg__row" for="pg-sof">
                <p-toggleswitch
                  inputId="pg-sof"
                  [ngModel]="pgSelectOnFocus()"
                  (ngModelChange)="pgSelectOnFocus.set($event)"
                />
                <span>Open on focus</span>
              </label>
              <label class="pg__row" for="pg-disabled">
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
                <span>Disable the middle panel</span>
              </label>
            </fieldset>

            <div class="pg__stage">
              <p-accordion
                [value]="pgValue()"
                [multiple]="pgMultiple()"
                [selectOnFocus]="pgSelectOnFocus()"
                (valueChange)="onPgValue($event)"
              >
                <p-accordion-panel [value]="0">
                  <p-accordion-header>What it costs</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">A flat rate per request, billed monthly.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1" [disabled]="pgDisabled()">
                  <p-accordion-header>How fast it is</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Roughly a second to the first visible result.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="2">
                  <p-accordion-header>Where the data lives</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">In the region you pick when the workspace is created.</p>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
          </div>
          <p class="pg__readout">
            <span class="pg__readout-label">value</span>
            <span class="pg__readout-value">{{ pgReadout() }}</span>
          </p>
          <p class="src-note">
            The readout is the component's own <code>valueChange</code> payload. Switching "Multiple panels open"
            resets it, because the input's type changes with the mode.
          </p>
        </section>

        <h3>The rendered anatomy</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host bindings from <code>openng-optimus-ui-accordion.mjs:298</code> (header) and <code>:408</code> (content);
          the generated ids from <code>:177</code>, <code>:183</code>, <code>:393</code> and <code>:395</code>.
        </p>

        <h3>A long label at a narrow width</h3>
        <p>
          The header is a flex row with no <code>white-space</code> and no <code>text-overflow</code> rule, so a label
          that does not fit wraps and the header grows taller. This is the property that makes an accordion the
          length-tolerant sibling of a tab strip.
        </p>
        <div class="ex__stage narrow">
          <p-accordion [value]="longValue()" (valueChange)="onLongValue($event)">
            <p-accordion-panel [value]="0">
              <p-accordion-header>
                Which personal data the assistant keeps after a conversation ends
              </p-accordion-header>
              <p-accordion-content>
                <p class="panel-body">Nothing beyond the workspace identifier.</p>
              </p-accordion-content>
            </p-accordion-panel>
          </p-accordion>
        </div>
        <p class="src-note">
          Header rules from <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:10-30</code> — the full
          declaration block contains no wrapping or truncation property.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The accordion competes with three other controls, and the choice is decided by one question: what does the
          reader want to do with the sections?
        </p>

        <h3>Which control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The reader wants to…</th>
                <th>Control</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>compare, scan, or print several sections</td>
                <td><code>p-accordion [multiple]</code></td>
                <td>All of them can stand open, in reading order, in one column.</td>
              </tr>
              <tr>
                <td>look at one view of one subject at a time</td>
                <td><code>p-tabs</code></td>
                <td>A tablist answers "which view", and keeps exactly one panel alive.</td>
              </tr>
              <tr>
                <td>work through stages in a fixed order</td>
                <td><code>p-stepper</code></td>
                <td>Order is the message; an accordion states no order at all.</td>
              </tr>
              <tr>
                <td>read everything anyway</td>
                <td>a plain stack of headings</td>
                <td>A disclosure everybody opens is a click between the reader and the text.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The delineation against tabs is the same one the Tabs guide draws from the other side; the closable-to-nothing
          behavior is <code>updateValue</code>, <code>openng-optimus-ui-accordion.mjs:606-608</code>.
        </p>

        <h3>The value contract, per mode</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th><code>value</code> holds</th>
                <th>Nothing open</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>default</td>
                <td>{{ m.singleValue }}</td>
                <td>{{ m.singleEmpty }}</td>
              </tr>
              <tr>
                <td><code>[multiple]="true"</code></td>
                <td>{{ m.multiValue }}</td>
                <td>{{ m.multiEmpty }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Both branches of <code>updateValue</code>, <code>openng-optimus-ui-accordion.mjs:592-613</code>; the
          discarded scalar is the <code>Array.isArray</code> guard at <code>:595</code>.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a disclosure around two short sentences</span>
            <div class="dd__stage">
              <p-accordion [value]="ddTinyValue()" (valueChange)="onDdTiny($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Opening hours</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Monday to Friday, 9 to 17.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1">
                  <p-accordion-header>Phone</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Reception takes calls during those hours.</p>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              Two facts everybody needs, behind two clicks and out of reach of find-in-page — collapsed bodies are
              hidden with <code>visibility</code>, not with <code>hidden="until-found"</code>.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — stack them under real headings</span>
            <div class="dd__stage">
              <h4 class="plain-head">Opening hours</h4>
              <p class="panel-body">Monday to Friday, 9 to 17.</p>
              <h4 class="plain-head">Phone</h4>
              <p class="panel-body">Reception takes calls during those hours.</p>
            </div>
            <p class="dd__why">
              Both facts are visible, searchable, and in the document outline — which the accordion header, a
              <code>role="button"</code> element, never joins.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an unguarded text field in a panel</span>
            <div class="dd__stage">
              <p-accordion [value]="ddFieldBad()" (valueChange)="onDdFieldBad($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Leave a note</p-accordion-header>
                  <p-accordion-content>
                    <label class="field-label" for="dd-bad-note">Note</label>
                    <textarea id="dd-bad-note" class="field" rows="2">Put the caret here and press the up arrow.</textarea>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              The accordion root cancels every <kbd>&#8593;</kbd> <kbd>&#8595;</kbd>, and every unshifted
              <kbd>Home</kbd> <kbd>End</kbd>, that reaches it — the caret stops moving inside the field.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — stop the event on the content</span>
            <div class="dd__stage">
              <p-accordion [value]="ddFieldGood()" (valueChange)="onDdFieldGood($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Leave a note</p-accordion-header>
                  <p-accordion-content (keydown)="$event.stopPropagation()">
                    <label class="field-label" for="dd-good-note">Note</label>
                    <textarea id="dd-good-note" class="field" rows="2">Here the caret moves normally.</textarea>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              The guard costs nothing — the header's own key handling sits above the content and is untouched by it.
            </p>
          </div>
        </div>

        <p class="src-note">
          The canceled keys are the root handler at <code>openng-optimus-ui-accordion.mjs:526</code>; its
          <code>preventDefault</code> calls at <code>:549</code>, <code>:554</code>, <code>:559</code> and
          <code>:587</code> run on every path, including the ones that move nothing (Development tab).
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Accordion pattern</a
            >
            — the roles, the heading-wraps-button structure, and the key contract this guide checks the component
            against.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Tabs pattern</a
            >
            — the alternative the choice table delineates against: one view at a time, arrow keys between tabs.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — why a header whose state rides on color and a chevron needs a second, non-color carrier.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 2.1.1 Keyboard</a
            >
            — what the root layer's swallowed arrow and Home/End keys put at risk for fields inside a panel.
          </li>
          <li>
            <a href="https://optimus.openng.org/accordion/" target="_blank" rel="noopener noreferrer"
              >Optimus UI — Accordion</a
            >
            — the vendor API, checked here against the shipped 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The accordion is styled entirely from Aura tokens; this kit ships no accordion rules of its own, so what you
          see is the preset plus the theme.
        </p>

        <h3>Aura token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>What it paints</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>accordion.header.padding</code></td>
                <td>{{ m.headerPadding }}</td>
                <td>The whole header row, all four sides.</td>
              </tr>
              <tr>
                <td><code>accordion.header.fontWeight</code></td>
                <td>{{ m.headerWeight }}</td>
                <td>The label.</td>
              </tr>
              <tr>
                <td><code>accordion.header.color</code></td>
                <td>{{ m.headerColor }}</td>
                <td>Closed label; hover and open both resolve to the plain text color.</td>
              </tr>
              <tr>
                <td><code>accordion.header.background</code></td>
                <td>{{ m.headerBackground }}</td>
                <td>Closed, hovered, open, and open-hovered — one value four times.</td>
              </tr>
              <tr>
                <td><code>accordion.panel.borderWidth</code></td>
                <td>{{ m.panelBorder }}</td>
                <td>One bottom border per panel, the separator between them; no panel has a top border.</td>
              </tr>
              <tr>
                <td><code>accordion.content.padding</code></td>
                <td>{{ m.contentPadding }}</td>
                <td>The body — no top padding, so it hangs directly under its header.</td>
              </tr>
              <tr>
                <td><code>accordion.header.focusRing</code></td>
                <td>{{ m.focusRing }}</td>
                <td>The keyboard ring, drawn inside the header edge.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/accordion/index.mjs</code>, resolved against
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> for the focus ring.
        </p>

        <h3>The focus ring is the kit's one ring</h3>
        <p>
          Aura rings the header with its 1px base ring at offset -1px. The kit replaces it with the ring every
          focusable Optimus part wears: 2px <code>--primary-color-fg</code>, drawn <em>inside</em> the header (offset
          -2px) because the header butts against the next panel. Aura's rule is a descendant selector and the kit
          rule keys on the header alone (<code>.p-accordionheader:focus-visible</code>), so the ring is the one piece
          of header styling that survives a heading wrapper. Inside, the ring meets the header's own
          <code>content.background</code> in every state — the same values as <code>dialog.background</code>, on which
          the "focus ring" rows of CONTRAST.MD measure the kit ring at {{ m.ringContrast }} across every style, mode
          and accent.
        </p>
        <pre class="code-block"><code>{{ focusRuleSnippet }}</code></pre>
        <p class="src-note">
          Aura's rule from <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:52</code>; the kit ring and
          its inset rule in <code>src/styles.scss</code> (the one ring list, measured by
          <code>scripts/check-contrast.mjs</code>).
        </p>

        <h3>Eight rules keyed on a direct child</h3>
        <p>
          Wrapping <code>p-accordion-header</code> in a heading — what the APG pattern asks for — moves it one level
          down and silently unstyles it. These are the rules that stop matching:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Preset line</th>
                <th>Keyed on</th>
                <th>What is lost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>:32, :38, :43</td>
                <td>first / last / last-and-open panel</td>
                <td>The rounded top and bottom corners of the whole stack.</td>
              </tr>
              <tr>
                <td>:58</td>
                <td>closed, enabled, hovered</td>
                <td>The hover background and label color — the chevron's hover color (<code>:63</code>) stays.</td>
              </tr>
              <tr>
                <td>:67, :72, :76, :81</td>
                <td>open panel, and open-and-hovered</td>
                <td>The open state entirely — label color and chevron color.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selector list read from <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs</code>; every one of the
          eight is written <code>… &gt; .p-accordionheader</code>. Two header rules are written as descendants
          and survive a wrapper: the focus ring at <code>:52</code> and the chevron hover at <code>:63</code>.
        </p>

        <h3>Contrast</h3>
        <p>
          Out of the box the body is Aura's <code>accordion.content.color</code> (<code>&#123;text.color&#125;</code>)
          on <code>accordion.content.background</code> (<code>&#123;content.background&#125;</code>) — Aura's
          generic panel pair, which the gate measures as the "content panel" row of CONTRAST.MD
          (<code>text.color</code> on <code>content.background</code>, {{ m.panelContrast }}). The closed header is
          Aura's muted color on that same background, which no row measures — verify it per theme if you restyle it.
        </p>
        <p>
          <em>If</em> you put the body on the kit token instead — as this page does, scoping
          <code>p &#123; color: var(--text-color) &#125;</code> over its own demos — the pair
          <code>--text-color</code> on <code>--surface-card</code> measures
          <strong>{{ m.contrastLight }}</strong> light and <strong>{{ m.contrastDark }}</strong> dark in the default
          <code>werkbund</code> style, both clear of the 4.5:1 that SC 1.4.3 asks for; the other styles are listed
          beside it.
        </p>
        <p class="src-note">
          Aura values from <code>&#64;openng/optimus-ui-themes/dist/aura/accordion/index.mjs</code>. The kit merges
          only the active visual style's <code>presetOverrides</code> (radii) and the accent ramp onto Aura at runtime
          (<code>definePreset</code> in <code>src/app/services/theme.service.ts</code>), and <code>styles.scss</code>
          has no <code>--p-accordion-*</code> override. The token-pair ratios are the "body text" rows of
          <code>docs/generated/CONTRAST.MD</code>, which is regenerated from the real token values on every build.
        </p>

        <h3>Narrow screens</h3>
        <p>
          <strong>No intrinsic responsive behavior, and none is needed.</strong> The preset contains no media query
          and the component takes no breakpoint input; the panel is a column flex box that fills its container at every
          viewport, and the header is a flex row whose label wraps. At 360px the control gets taller, never wider —
          which is the whole reason to prefer it over a tab strip there. Layout guidance: give it a
          <code>min-width: 0</code> flex parent, and budget for {{ m.headerPadding }} of header padding on each side
          before your label starts.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs and outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>On</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td><code>p-accordion</code>, <code>p-accordion-panel</code></td>
                <td>A <code>model()</code> on both. The panel's value ends up in the DOM id.</td>
              </tr>
              <tr>
                <td><code>[multiple]</code></td>
                <td><code>p-accordion</code></td>
                <td>Changes the type of <code>value</code> to an array.</td>
              </tr>
              <tr>
                <td><code>[selectOnFocus]</code></td>
                <td><code>p-accordion</code></td>
                <td>Off by default: arrow keys move focus without opening anything.</td>
              </tr>
              <tr>
                <td><code>[disabled]</code></td>
                <td><code>p-accordion-panel</code></td>
                <td>Takes the header out of the tab order and out of arrow-key traversal.</td>
              </tr>
              <tr>
                <td><code>expandIcon</code> / <code>collapseIcon</code></td>
                <td><code>p-accordion</code></td>
                <td>Class names for a replacement chevron; a <code>#toggleicon</code> template wins over both.</td>
              </tr>
              <tr>
                <td><code>styleClass</code>, <code>transitionOptions</code></td>
                <td><code>p-accordion</code></td>
                <td>Deprecated since v20.0.0 and v21.0.0 — use <code>class</code> and <code>motionOptions</code>.</td>
              </tr>
              <tr>
                <td><code>valueChange</code></td>
                <td><code>p-accordion</code></td>
                <td>The one output that sees every change.</td>
              </tr>
              <tr>
                <td><code>onOpen</code> / <code>onClose</code></td>
                <td><code>p-accordion</code></td>
                <td>{{ m.openCloseScope }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations from <code>openng-optimus-ui-accordion.mjs:462-524</code> and <code>:126-142</code>; the
          click-only emission from <code>:196-211</code>.
        </p>

        <h3>The root keyboard layer does nothing but cancel</h3>
        <p>
          Two handlers listen for arrow keys. The header's own works and is the one you feel. The accordion root runs a
          second copy that looks its targets up by an attribute the components do not emit — so it finds nothing, moves
          nothing, and still cancels the key.
        </p>
        <pre class="code-block"><code>{{ deadLookupSnippet }}</code></pre>
        <p class="src-note">
          Query from <code>openng-optimus-ui-accordion.mjs:566-582</code>; the emitted attributes from
          <code>openng-optimus-ui-basecomponent.mjs:355</code> and <code>:359</code>. The header host carries
          <code>data-pc-name="accordionheader"</code> <em>and</em> <code>data-pc-section="root"</code>: every
          <code>ptm</code> element gets a <code>data-pc-section</code> holding its own section key (<code>:359</code>),
          while <code>:355</code> is a second, independent mechanism under which a pass-through
          <code>data-pc-section</code> renames <code>data-pc-name</code>. No element anywhere carries
          <code>data-pc-section="accordionheader"</code>.
        </p>
        <p>
          The consequence is not a broken accordion but a broken panel: anything inside the body that owns
          <kbd>&#8593;</kbd> <kbd>&#8595;</kbd> <kbd>Home</kbd> <kbd>End</kbd> — a text field, a listbox, a scroll
          container — loses those keys. Guard the content, as in the Usage tab's second pair.
        </p>

        <h3>Nothing is lazy, and nothing is unmounted</h3>
        <p>
          Unlike <code>p-tabs</code>, the accordion has no <code>lazy</code> input at all. Every body is constructed
          with the page, lands in the prerendered HTML, and stays in the DOM when the panel closes.
        </p>
        <pre class="code-block"><code>{{ motionSnippet }}</code></pre>
        <p class="src-note">
          Template from <code>openng-optimus-ui-accordion.mjs:409-416</code>; the applied styles from
          <code>openng-optimus-ui-motion.mjs:26-29</code>. <code>p-motion</code> applies those hidden styles in
          an <code>effect</code> on the initial mount (<code>openng-optimus-ui-motion.mjs:328-333</code>), not from a
          browser-only lifecycle hook.
        </p>
        <ul>
          <li>Good for content: all of it is in the prerendered HTML, so it is indexable without a click.</li>
          <li>
            Costly for widgets: wrap an expensive body in your own <code>&#64;if</code> on the accordion's value, and
            it is built when the panel first opens.
          </li>
          <li>
            <code>visibility: hidden</code> takes a closed body out of the tab order and the accessibility tree — but
            also out of the browser's find-in-page.
          </li>
        </ul>

        <h3>Wiring it up</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>Panel values are short, stable, and untranslated — they are DOM ids.</li>
          <li><code>value</code> matches the mode: an array under <code>[multiple]</code>, a scalar otherwise.</li>
          <li>Any panel with a field, a scroller, or its own arrow keys stops <code>keydown</code>.</li>
          <li>State comes from <code>valueChange</code>, not from <code>onOpen</code> / <code>onClose</code>.</li>
          <li>The heading question is answered on purpose, not by default.</li>
          <li>An expensive body is behind your own <code>&#64;if</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The accordion is the rare Optimus component with nothing to translate of its own: the bundle contains no
          reference to the translation config at all. Every word a user reads is a word you projected.
        </p>

        <h3>What comes from where</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Visible thing</th>
                <th>Source</th>
                <th>Consequence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Header label</td>
                <td>your projected content</td>
                <td>Build it in a <code>computed()</code> so it rebuilds on a language switch.</td>
              </tr>
              <tr>
                <td>Body</td>
                <td>your projected content</td>
                <td>Present in every language variant of the prerendered page.</td>
              </tr>
              <tr>
                <td>Chevron</td>
                <td>the library</td>
                <td>{{ m.iconNaming }}</td>
              </tr>
              <tr>
                <td>Panel <code>value</code></td>
                <td>your code</td>
                <td>Never translate it — it is half of two DOM ids.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Measured over <code>openng-optimus-ui-accordion.mjs</code>: zero occurrences of
          <code>translation</code>, and both chevron branches carry <code>aria-hidden="true"</code>
          (<code>:304-316</code>).
        </p>

        <h3>Length and direction</h3>
        <ul>
          <li>
            A translation that runs long wraps the header instead of truncating it — the property that makes an
            accordion safer than a tab strip for a language you have not measured.
          </li>
          <li>
            The corner radii are written as logical properties
            (<code>border-start-start-radius</code>, <code>border-end-end-radius</code>), so the rounded corners follow
            <code>dir="rtl"</code> without any work from you.
          </li>
          <li>
            The chevron points down when closed and up when open — a direction that carries no language, so it needs no
            mirroring.
          </li>
        </ul>
        <p class="src-note">
          Radii from <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:34-40</code>; the two chevrons from
          <code>openng-optimus-ui-accordion.mjs:304-316</code>.
        </p>

        <h3>The reactive label</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> in <code>src/app/services/translation.service.ts</code> is
          the kit's lookup, and it reads <code>translationsVersion()</code> — which is what makes a
          <code>computed()</code> around it re-evaluate once a language file lands.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.3</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the header wears the kit's
            one 2px ring inside its edge (CONTRAST.MD "focus ring"); the body pair is now a gated "content
            panel" row.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-09-23 — Body-text ratios updated to the CONTRAST.MD rows of the default visual style
            (18.73:1 / 14.86:1; the old figures predated ADR-0016); the "Aura unmodified" note
            corrected (the style's radii and the accent ramp are merged at runtime); annotated
            Sources added to close the Usage tab.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-09-05 — Initial guide, measured against Optimus UI 2.0.2.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class AccordionArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  /**
   * Measured values quoted in the tables above, kept in one object so the same
   * number cannot drift between prose and table. Provenance is the Optimus UI
   * 2.0.2 bundles, the Aura preset, and the kit's contrast compilat.
   */
  readonly m = {
    singleValue: 'one panel value, or undefined',
    singleEmpty: 'yes — clicking the open header writes undefined',
    multiValue: 'an array of panel values',
    multiEmpty: 'yes — the array empties out',
    headerPadding: '1.125rem',
    headerWeight: '600',
    headerColor: 'text.muted.color, rising to text.color on hover and when open',
    headerBackground: 'content.background',
    panelBorder: '0 0 1px 0',
    contentPadding: '0 1.125rem 1.125rem 1.125rem',
    focusRing: 'Aura: focus.ring.width (1px) at offset -1px — the kit replaces it: 2px --primary-color-fg at -2px',
    ringContrast: '5.18–17.85:1 (SC 1.4.11 asks 3:1)',
    panelContrast: '10.35–17.72:1 across styles and modes',
    contrastLight: '18.73:1',
    contrastDark: '14.86:1',
    openCloseScope: 'Click only — a keyboard toggle and a programmatic write emit neither.',
    iconNaming: 'Both chevrons are aria-hidden, so the icon names nothing in any language.',
  };

  // --- Playground state ------------------------------------------------------
  readonly pgMultiple = signal(false);
  readonly pgSelectOnFocus = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<PanelValue>(0);
  readonly pgReadout = signal('0');

  onPgValue(value: PanelValue): void {
    this.pgValue.set(value);
    this.pgReadout.set(Array.isArray(value) ? '[' + value.join(', ') + ']' : String(value));
  }

  onMultiple(multiple: boolean): void {
    this.pgMultiple.set(multiple);
    const next: PanelValue = multiple ? [] : undefined;
    this.pgValue.set(next);
    this.pgReadout.set(Array.isArray(next) ? '[]' : 'undefined');
  }

  // --- Example + do/don't state ---------------------------------------------
  readonly longValue = signal<PanelValue>(0);
  readonly ddTinyValue = signal<PanelValue>(undefined);
  readonly ddFieldBad = signal<PanelValue>(0);
  readonly ddFieldGood = signal<PanelValue>(0);

  onLongValue(value: PanelValue): void {
    this.longValue.set(value);
  }

  onDdTiny(value: PanelValue): void {
    this.ddTinyValue.set(value);
  }

  onDdFieldBad(value: PanelValue): void {
    this.ddFieldBad.set(value);
  }

  onDdFieldGood(value: PanelValue): void {
    this.ddFieldGood.set(value);
  }

  // --- Snippets (flat constants, so the tab extractor resolves them) ---------
  readonly anatomySnippet: string = `<p-accordion class="p-accordion p-component">
  <p-accordion-panel class="p-accordionpanel p-accordionpanel-active"
      data-p-active="true">                            <- the class the eight rules key on
    <p-accordion-header class="p-accordionheader"      <- the focusable element
        id="pn_id_7_accordionheader_0"                 <- value in the id
        data-pc-name="accordionheader"                 <- what AccordionHeader emits
        data-pc-section="root"                         <- and not "accordionheader"
        role="button" tabindex="0"
        aria-expanded="true"
        aria-controls="pn_id_7_accordioncontent_0">
      What it costs
      <svg data-p-icon="chevron-up" aria-hidden="true" />
    </p-accordion-header>
    <p-accordion-content class="p-accordioncontent"    <- the named region
        id="pn_id_7_accordioncontent_0"
        role="region"
        aria-labelledby="pn_id_7_accordionheader_0">
      <p-motion>
        <div class="p-accordioncontent-wrapper">
          <div class="p-accordioncontent-content">...</div>
        </div>
      </p-motion>
    </p-accordion-content>
  </p-accordion-panel>
</p-accordion>

No heading element anywhere: the outline sees nothing.`;

  readonly focusRuleSnippet: string = `/* Aura: the one header rule written as a descendant selector. */
.p-accordionpanel:not(.p-disabled) .p-accordionheader:focus-visible {
  outline: dt('accordion.header.focus.ring.width') ...;   /* 1px */
  outline-offset: dt('accordion.header.focus.ring.offset');   /* -1px */
}

/* The kit (src/styles.scss): the one ring, drawn inside the header. */
.p-accordionheader:focus-visible {
  outline: 2px solid var(--primary-color-fg) !important;
  outline-offset: -2px !important;
}`;

  readonly deadLookupSnippet: string = `// Accordion (the root), :566 — what it looks for:
findSingle(nextTabElement, '[data-pc-section="accordionheader"]')

// BaseComponent, :355 and :359 — what the header host actually carries:
'data-pc-name': 'accordionheader'   // :355, flat-cased componentName
'data-pc-section': 'root'           // :359, the element's own section key

// AccordionHeader, :246 — its own, working lookup:
findSingle(panelElement, '[data-pc-name="accordionheader"]')

// So the root finds null, focuses nothing, and still runs:
event.preventDefault();`;

  readonly motionSnippet: string = `<!-- AccordionContent's template, :409-416 -->
<p-motion [visible]="active()" name="p-collapsible"
          hideStrategy="visibility"
          [mountOnEnter]="false" [unmountOnLeave]="false">

<!-- What "visibility" applies when the panel closes (motion, :26-29) -->
visibility: hidden;
max-height: 0;
overflow: hidden;`;

  readonly wiringSnippet: string = `import { AccordionModule } from '@openng/optimus-ui/accordion';

@Component({
  standalone: true,
  imports: [AccordionModule],
})
export class FaqComponent {
  // [multiple] means an array. Never seed it with a scalar: updateValue
  // discards a non-array current value on the first toggle.
  readonly open = signal<number[]>([0]);

  // Take the declared type whole: under strictTemplates a narrower parameter is
  // a TS2345 on (valueChange). Narrow inside the body instead.
  onOpenChange(value: string | number | string[] | number[] | null | undefined): void {
    this.open.set(Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : []);
  }
}`;

  readonly i18nSnippet: string = `// translate() reads translationsVersion(), so this computed() tracks it and the
// label rebuilds on a language switch;
// the value stays numeric, because it becomes part of two DOM ids.
readonly sections = computed(() => [
  { id: 0, label: this.i18n.translate('faq.cost.title'), body: this.i18n.translate('faq.cost.body') },
  { id: 1, label: this.i18n.translate('faq.speed.title'), body: this.i18n.translate('faq.speed.body') },
]);`;
}
