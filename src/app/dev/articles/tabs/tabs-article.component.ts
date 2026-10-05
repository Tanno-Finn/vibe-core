import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from '@openng/optimus-ui/accordion';
import { SelectModule } from '@openng/optimus-ui/select';
import { TabsModule } from '@openng/optimus-ui/tabs';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** What every `value` in the tabs family is declared as (openng-optimus-ui-tabs.d.ts:89). */
export type TabValue = string | number | undefined;

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    TabsModule,
    AccordionModule,
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
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
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
      .pg__label,
      .pg__field label {
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
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      p-tabs {
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
      .count-chip {
        margin-left: 0.35rem;
        padding: 0.05em 0.45em;
        border-radius: 999px;
        font-size: 0.72rem;
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
        color: var(--primary-color-fg);
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
 * Guide article: Tabs (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template — so this article is displayed BY the very pattern it
 * documents, and the shell's own hand-rolled tablist is used as a worked
 * counter-example throughout.
 *
 * Subject: the DECISION SPACE around "one subject, several views" — tabs vs
 * accordion vs steps vs separate routes — plus what Optimus UI's NEW tabs API
 * (`p-tabs`/`p-tablist`/`p-tab`/`p-tabpanels`/`p-tabpanel`, the replacement for
 * the removed TabView) really does for keyboard and screen-reader users, and
 * what this kit's `styles.scss` does on top of it.
 *
 * Claims this guide makes, with their provenance (Optimus UI 2.0.2,
 * openng-optimus-ui-tabs.mjs unless noted):
 *   - Activation is manual by default: `selectOnFocus` is `false` (:122) and the
 *     arrow handlers only call `changeFocusedTab()` → `focus(element)`
 *     (:657-660); only Enter / Space / NumpadEnter and click call
 *     `changeActiveValue()` (:568-572, :634-638).
 *   - `role="tablist"` is NOT on the `<p-tablist>` host — it is on an inner
 *     `div.p-tablist-tab-list` (:411), so an `aria-label` on the host names
 *     nothing. The working route is `[pt]="{ tabList: { 'aria-label': '…' } }"`.
 *     The same mechanism does NOT reach a tabpanel host, so the panel-focus gap
 *     is closed with a static `tabindex="0"` attribute instead.
 *   - `<p-tab>` is a custom element with `role="tab"`, not a `<button>` (:685
 *     host bindings), with a roving `tabindex` (:560).
 *   - Panels are NOT lazy by default: content renders eagerly and is hidden with
 *     the `hidden` attribute (:844). With `[lazy]`, `shouldRender` latches
 *     through `hasBeenRendered` (:796-807) and never tears down again.
 *   - `[scrollable]` adds the class `p-tabs-scrollable` (:20) and nothing else:
 *     the class has zero rules in `@openng/optimus-ui-styles/dist/tabs/index.mjs` and
 *     `TabList.scrollable` (:293) is never read. The strip scrolls because
 *     `.p-tablist-viewport` is `overflow-x: auto` unconditionally.
 *   - `onKeyDown` calls `event.stopPropagation()` for EVERY key (:601), so
 *     document-level shortcuts are dead while a tab has focus.
 *     `PageUp`/`PageDown` only scroll a tab into view (:626-633).
 *   - Kit layer (`styles.scss`, "Optimus UI Tabs Component (v18+)"): the tab gets a
 *     2px `border-bottom` marker, Aura's sliding `.p-tablist-active-bar` is
 *     suppressed with `display: none` so only one underline renders, and no
 *     hover rule is shipped — `.p-tabs .p-tab:hover` (0,3,0) cannot beat Aura's
 *     (0,4,0) shorthand.
 *   - The scroll chevrons take their names from `translation.aria.previous` /
 *     `.next`; the kit feeds those from its i18n layer on every language switch.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-tabs-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tabs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          You are reading this inside a tab. The bar above is <em>not</em> a <code>p-tabs</code> — it is hand-written
          markup in <code>article-shell.component.ts</code>, and the Design tab compares the two implementations
          attribute by attribute. Everything below is the real Optimus UI component: the new <code>p-tabs</code> family
          that replaced <code>TabView</code>.
        </p>

        <!-- Mini playground: live-configure a tab set and read back the markup. -->
        <section class="pg" aria-label="Tabs playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-count-label">Number of tabs</span>
                <p-select
                  [ariaLabelledBy]="'pg-count-label'"
                  size="small"
                  [options]="countOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgCount()"
                  (ngModelChange)="onCountChange($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-lazy">Lazy panels</label>
                <p-toggleswitch inputId="pg-lazy" [ngModel]="pgLazy()" (ngModelChange)="pgLazy.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-sof">Activate on focus</label>
                <p-toggleswitch
                  inputId="pg-sof"
                  [ngModel]="pgSelectOnFocus()"
                  (ngModelChange)="pgSelectOnFocus.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-scrollable">Scrollable</label>
                <p-toggleswitch
                  inputId="pg-scrollable"
                  [ngModel]="pgScrollable()"
                  (ngModelChange)="pgScrollable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-navigators">Show navigators</label>
                <p-toggleswitch
                  inputId="pg-navigators"
                  [ngModel]="pgNavigators()"
                  (ngModelChange)="pgNavigators.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disable the third tab</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview — try the arrow keys</span>
              <div class="pg__stage" id="pg-stage">
                <p-tabs
                  [value]="pgValue()"
                  (valueChange)="onPgValue($event)"
                  [lazy]="pgLazy()"
                  [selectOnFocus]="pgSelectOnFocus()"
                  [scrollable]="pgScrollable()"
                  [showNavigators]="pgNavigators()"
                >
                  <p-tablist [pt]="pgTablistPt">
                    @for (t of pgTabs(); track t.value) {
                      <p-tab [value]="t.value" [disabled]="pgDisabled() && t.value === 2">
                        {{ t.label }}
                      </p-tab>
                    }
                  </p-tablist>
                  <p-tabpanels>
                    @for (t of pgTabs(); track t.value) {
                      <p-tabpanel [value]="t.value">
                        <p class="panel-body">
                          <span class="panel-marker" data-panel-marker>{{ t.label }}</span>
                          — this paragraph exists in the DOM only once its panel has been rendered. Flip "Lazy panels"
                          and press Count to watch that happen.
                        </p>
                      </p-tabpanel>
                    }
                  </p-tabpanels>
                </p-tabs>
              </div>
              <div class="pg__readout">
                <button type="button" class="copy-btn" (click)="countPanels()">Count rendered panels</button>
                <span class="pg__readout-value">{{ panelReadout() }}</span>
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
          <p class="src-note">
            The readout counts <code>[data-panel-marker]</code> elements inside the stage — one per
            <em>rendered</em> panel body, not per <code>&lt;p-tabpanel&gt;</code> host (the hosts always exist; only
            their content is conditional).
          </p>
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
                @case ('basic') {
                  <p-tabs [value]="exBasic()" (valueChange)="setNum(exBasic, $event)">
                    <p-tablist [pt]="basicPt">
                      <p-tab [value]="0">Overview</p-tab>
                      <p-tab [value]="1">Activity</p-tab>
                      <p-tab [value]="2">Settings</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0" tabindex="0">
                        <p class="panel-body">
                          Three views of one record. The panel keeps its scroll position and its form state while you
                          switch away and back. This panel carries <code>tabindex="0"</code> — press Tab from the active
                          tab and focus lands here, as the APG asks.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1" tabindex="0">
                        <p class="panel-body">
                          Nothing here is a different <em>page</em> — it is the same record, seen from another angle.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="2" tabindex="0">
                        <p class="panel-body">
                          If a panel needs its own URL, it is a route, not a tab. See the Usage tab.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
                @case ('disabled') {
                  <p-tabs [value]="exDisabled()" (valueChange)="setNum(exDisabled, $event)">
                    <p-tablist [pt]="disabledPt">
                      <p-tab [value]="0">Draft</p-tab>
                      <p-tab [value]="1" [disabled]="true">Review</p-tab>
                      <p-tab [value]="2">History</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0">
                        <p class="panel-body">
                          Arrow past "Review" — the disabled tab is skipped by <code>findNextTab</code>, not merely
                          un-clickable.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1"><p class="panel-body">Unreachable.</p></p-tabpanel>
                      <p-tabpanel [value]="2">
                        <p class="panel-body">
                          A disabled tab still renders its panel content into the DOM unless the whole set is
                          <code>[lazy]</code>.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
                @case ('overflow') {
                  <div class="narrow">
                    <p-tabs [value]="exOverflow()" (valueChange)="setNum(exOverflow, $event)">
                      <p-tablist [pt]="overflowPt">
                        @for (t of manyTabs; track t.value) {
                          <p-tab [value]="t.value">{{ t.label }}</p-tab>
                        }
                      </p-tablist>
                      <p-tabpanels>
                        @for (t of manyTabs; track t.value) {
                          <p-tabpanel [value]="t.value">
                            <p class="panel-body">
                              Panel {{ t.label }}. Nine labels in a 22rem column: the strip scrolls and two chevron
                              buttons appear.
                            </p>
                          </p-tabpanel>
                        }
                      </p-tabpanels>
                    </p-tabs>
                  </div>
                }
                @case ('icons') {
                  <p-tabs [value]="exIcons()" (valueChange)="setNum(exIcons, $event)">
                    <p-tablist [pt]="iconsPt">
                      <p-tab [value]="0">
                        <i class="pi pi-file" aria-hidden="true"></i>
                        <span>Document</span>
                      </p-tab>
                      <p-tab [value]="1">
                        <i class="pi pi-comments" aria-hidden="true"></i>
                        <span>Comments</span>
                        <span class="count-chip">4</span>
                      </p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0">
                        <p class="panel-body">
                          A tab is a content projection slot, so any markup fits — but the whole thing becomes the tab's
                          accessible name.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1">
                        <p class="panel-body">
                          This tab announces "Comments 4". Decorative icons need <code>aria-hidden</code>, counts need
                          to read as words.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Tabs, accordion, steps, or routes? The honest table</h3>
        <p>
          All four show one thing at a time. They differ in <strong>who decides the order</strong>,
          <strong>whether two sections can be open at once</strong>, and
          <strong>whether the choice survives a reload or a shared link</strong>. Answer those three and the control
          picks itself.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Relationship</th>
                <th>Open at once</th>
                <th>Order</th>
                <th>In the URL</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tabs</code></td>
                <td><strong>Parallel views of ONE subject</strong> — same record, other angle.</td>
                <td>exactly one</td>
                <td>free, any order</td>
                <td><strong>no</strong> — you wire it yourself (see below)</td>
                <td>
                  A horizontal strip; past ~4 short labels it scrolls sideways and the off-screen tabs stop existing for
                  the reader.
                </td>
              </tr>
              <tr>
                <td><code>p-accordion</code></td>
                <td>Scannable <strong>sections of one column</strong> — a long page folded up.</td>
                <td><strong>several</strong>, with <code>[multiple]="true"</code></td>
                <td>free</td>
                <td>no</td>
                <td>Best fit: every header is a full-width row, and nothing is off-screen.</td>
              </tr>
              <tr>
                <td><code>p-stepper</code></td>
                <td>Stages of <strong>one task</strong> with a beginning and an end.</td>
                <td>one</td>
                <td><strong>enforced</strong> — you may gate step n+1 on step n</td>
                <td>no (unless you route each step)</td>
                <td>Vertical variant exists; the progress read-out is the point.</td>
              </tr>
              <tr>
                <td>routes / separate pages</td>
                <td>Views a user may want to <strong>link, bookmark, reload, or open in a new tab</strong>.</td>
                <td>one per URL</td>
                <td>free</td>
                <td><strong>yes</strong> — that is the whole reason</td>
                <td>Same as any page; back button works, which tabs never do.</td>
              </tr>
              <tr>
                <td>none of them</td>
                <td>Sections a reader wants to <strong>compare or search across</strong>.</td>
                <td>all</td>
                <td>reading order</td>
                <td>anchors</td>
                <td>Just stack it. Scrolling is cheap; hunting through five tabs is not.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The "open at once", "order" and "in the URL" columns are
          behavior read from the Optimus UI sources in <code>node_modules</code> and checked against the rendered
          examples. The recommendations are a <em>judgment</em>: the accordion and stepper rows are documented from the
          library, and the four questions below are how this kit decides between them.
        </p>

        <h3>Four questions before you reach for a tab set</h3>
        <ul>
          <li>
            <strong>Would a user ever want two panels side by side?</strong> If yes, tabs are wrong — they make
            comparison an exercise in memory.
          </li>
          <li>
            <strong>Must the choice survive a reload, a bookmark, or a pasted link?</strong> Then the state belongs in
            the URL. Tabs hold it in a component signal that dies with the page; a route holds it in the address bar.
            The Do/Don't below shows the middle path — a tab set whose value is mirrored into a query parameter.
          </li>
          <li>
            <strong>Is there an order the user must not break?</strong> That is a stepper. Tabs invite jumping around,
            and a tab strip cannot express "not yet".
          </li>
          <li>
            <strong>Does the content need to be findable?</strong> Panel content in a hidden tab is skipped by the
            browser's find-in-page and by print. If people search or print this content, stack it or use an accordion
            they can open.
          </li>
        </ul>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — tabs for sections people scan</span>
            <div class="dd__stage">
              <p-tabs [value]="ddScanTab()" (valueChange)="setNum(ddScanTab, $event)">
                <p-tablist [pt]="scanPt">
                  <p-tab [value]="0">Cost</p-tab>
                  <p-tab [value]="1">Latency</p-tab>
                  <p-tab [value]="2">Privacy</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">About €0.02 per request.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Around 800 ms to first token.</p></p-tabpanel>
                  <p-tabpanel [value]="2"><p class="panel-body">Data stays in the EU.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Three facts a reader wants to weigh <em>against each other</em>, and the control lets them see exactly
              one. Ctrl+F finds none of the hidden two.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — an accordion they can open at once</span>
            <div class="dd__stage">
              <p-accordion [value]="ddScanPanels()" [multiple]="true" (valueChange)="onScanPanels($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Cost</p-accordion-header>
                  <p-accordion-content><p class="panel-body">About €0.02 per request.</p></p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1">
                  <p-accordion-header>Latency</p-accordion-header>
                  <p-accordion-content><p class="panel-body">Around 800 ms to first token.</p></p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="2">
                  <p-accordion-header>Privacy</p-accordion-header>
                  <p-accordion-content><p class="panel-body">Data stays in the EU.</p></p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              <code>[multiple]="true"</code> lets all three stand open, in one column, in reading order — and on a phone
              nothing is off-screen sideways.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a choice the user cannot share</span>
            <div class="dd__stage">
              <p-tabs [value]="ddPlainTab()" (valueChange)="setStr(ddPlainTab, $event)">
                <p-tablist [pt]="plainPt">
                  <p-tab [value]="'chart'">Chart</p-tab>
                  <p-tab [value]="'table'">Table</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="'chart'"><p class="panel-body">Chart view.</p></p-tabpanel>
                  <p-tabpanel [value]="'table'"><p class="panel-body">Table view.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Switch to Table, copy the address, send it to a colleague: they get the Chart. Reload: you get the Chart.
              The state lives in a signal and dies with the page.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — mirror the value into the URL</span>
            <div class="dd__stage">
              <p-tabs [value]="urlTab()" (valueChange)="onUrlTab($event)">
                <p-tablist [pt]="urlPt">
                  <p-tab [value]="'chart'">Chart</p-tab>
                  <p-tab [value]="'table'">Table</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="'chart'"><p class="panel-body">Chart view.</p></p-tabpanel>
                  <p-tabpanel [value]="'table'"><p class="panel-body">Table view.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Live: switching writes <code>?view=…</code> into the address bar (<code>replaceUrl</code>, so the back
              button is not littered), and the initial value is read back from the route. Try it, then reload.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — name the tablist on the host</span>
            <div class="dd__stage">
              <p-tabs [value]="ddNameBad()" (valueChange)="setNum(ddNameBad, $event)">
                <p-tablist aria-label="Report views">
                  <p-tab [value]="0">Summary</p-tab>
                  <p-tab [value]="1">Detail</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">Summary.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Detail.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              <code>role="tablist"</code> sits on an inner <code>div</code>, not on <code>&lt;p-tablist&gt;</code>.
              In the accessibility tree this tablist has <strong>no name at all</strong> — the
              attribute landed on a roleless wrapper.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name it through [pt]</span>
            <div class="dd__stage">
              <p-tabs [value]="ddNameGood()" (valueChange)="setNum(ddNameGood, $event)">
                <p-tablist [pt]="namedTablistPt">
                  <p-tab [value]="0">Summary</p-tab>
                  <p-tab [value]="1">Detail</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">Summary.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Detail.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              The pass-through input puts the attribute on the element that actually carries the role. Measured name:
              <strong>"Report views"</strong>. It must sit on <code>&lt;p-tablist&gt;</code>, though —
              <code>pt</code> does not cascade, so the same object on <code>&lt;p-tabs&gt;</code> would leave you with
              the cell on the left. One tablist per page can live without a name; two cannot.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a strip nobody can read</span>
            <div class="dd__stage">
              <div class="narrow">
                <p-tabs [value]="ddManyTab()" (valueChange)="setNum(ddManyTab, $event)">
                  <p-tablist [pt]="manyPt">
                    @for (t of manyTabs; track t.value) {
                      <p-tab [value]="t.value">{{ t.label }}</p-tab>
                    }
                  </p-tablist>
                  <p-tabpanels>
                    @for (t of manyTabs; track t.value) {
                      <p-tabpanel [value]="t.value"
                        ><p class="panel-body">{{ t.label }}</p></p-tabpanel
                      >
                    }
                  </p-tabpanels>
                </p-tabs>
              </div>
            </div>
            <p class="dd__why">
              Nine tabs in a narrow column. Most of the choices are off-screen behind a chevron, and translated labels
              make it worse, not better.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — fewer tabs, or another control</span>
            <div class="dd__stage">
              <div class="narrow">
                <p-tabs [value]="ddFewTab()" (valueChange)="setNum(ddFewTab, $event)">
                  <p-tablist [pt]="fewPt">
                    <p-tab [value]="0">Overview</p-tab>
                    <p-tab [value]="1">Details</p-tab>
                    <p-tab [value]="2">Log</p-tab>
                  </p-tablist>
                  <p-tabpanels>
                    <p-tabpanel [value]="0"><p class="panel-body">Everything at a glance.</p></p-tabpanel>
                    <p-tabpanel [value]="1"><p class="panel-body">The long form.</p></p-tabpanel>
                    <p-tabpanel [value]="2"><p class="panel-body">What happened when.</p></p-tabpanel>
                  </p-tabpanels>
                </p-tabs>
              </div>
            </div>
            <p class="dd__why">
              Three labels fit at 22rem with room to spare. If the content genuinely has nine parts, it wants a sidebar,
              a <code>p-select</code> or nine routes — not nine tabs.
            </p>
          </div>
        </div>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Tabs pattern</a
            >
            — the roles/states contract (<code>tablist</code>, <code>tab</code>, <code>tabpanel</code>,
            <code>aria-selected</code>, <code>aria-controls</code>) and the keyboard map this guide checks the
            library against, key by key.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Tabs with Manual Activation</a
            >
            — the reference implementation of the mode Optimus ships by default, including the rule that the tab panel
            gets <code>tabindex="0"</code> when it holds no focusable element (Optimus does not — see Development).
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Accordion pattern</a
            >
            — the contrasting pattern in the decision table: headers are buttons with
            <code>aria-expanded</code>, and several regions may be open at once.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — the criterion behind the focus-ring measurement in the Design tab; a roving tabindex makes the focus
            indicator the only way to tell where you are.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24 × 24 CSS-pixel floor the measured tab boxes are checked against.
          </li>
          <li>
            <a href="https://optimus.openng.org/tabs/" target="_blank" rel="noopener noreferrer"> Optimus UI — Tabs component</a>
            — the vendor API surface for the post-TabView structure; every claim here was re-verified against the
            shipped <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code>.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy — five elements, and the role is not where you think</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>p-tabs</code></strong> — the state holder. Renders as
            <code>&lt;p-tabs class="p-tabs p-component" id="pn_id_N"&gt;</code>, a flex column. It owns
            <code>value</code>, and its generated <code>id</code> is the prefix for every child id.
          </li>
          <li>
            <strong><code>p-tablist</code></strong> — a wrapper with <code>overflow: hidden</code>. Inside it: an
            optional prev button, a scrolling <code>div.p-tablist-content.p-tablist-viewport</code>, and inside that an
            inner <code>div.p-tablist-tab-list</code> which carries
            <strong><code>role="tablist"</code></strong> (:411). PrimeNG 22 had flattened that level away; Optimus
            keeps it, so the pass-through section is <code>tabList</code>, not <code>content</code>.
          </li>
          <li>
            <strong><code>p-tab</code></strong> — a custom element, <em>not</em> a <code>&lt;button&gt;</code>, with
            <code>role="tab"</code>, <code>id</code>, <code>aria-controls</code>, <code>aria-selected</code>,
            <code>aria-disabled</code>, <code>data-p-active</code> and a roving <code>tabindex</code>.
          </li>
          <li>
            <strong>the active bar</strong> — <code>span.p-tablist-active-bar</code>, <code>role="presentation"</code>,
            a sibling of the tabs inside the tablist. Its width and offset are written in JavaScript on every value
            change.
          </li>
          <li>
            <strong><code>p-tabpanels</code> / <code>p-tabpanel</code></strong> — <code>role="presentation"</code> and
            <code>role="tabpanel"</code>. The inactive panel keeps the plain HTML <code>hidden</code> attribute.
          </li>
        </ul>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code> (TabList's template at 403-408 with
          <code>role="tablist"</code> on the inner div at 404 and the inkbar span at 406; Tab's host bindings at
          683-693; TabPanel's at 818-825; TabPanels' at 884-887), and confirmed against the rendered tree of the
          playground above.
        </p>

        <h3>Tokens — Aura ships one thing, this kit renders another</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Aura token layer</th>
                <th>What this kit actually renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>tab padding</td>
                <td><code>1rem 1.125rem</code></td>
                <td>
                  <strong>0.75rem 1rem</strong> — the kit's <code>.p-tabs .p-tab</code> rule replaces it (measured: 12px
                  16px).
                </td>
              </tr>
              <tr>
                <td>tab border</td>
                <td>
                  <code>tab.borderWidth</code> is <code>0 0 1px 0</code>, border color <code>content.border.color</code>,
                  <code>activeBorderColor</code> <code>primary.color</code> — the Aura 2.x underline is back (PrimeNG
                  22 / Aura 3.0 had zeroed it); the sliding active-bar is a second, 1px marker at
                  <code>bottom: -1px</code>
                </td>
                <td>
                  <code>border: none</code> plus an explicit <code>border-bottom: 2px solid transparent</code> and
                  <code>margin-bottom: -1px</code> — a <strong>2px</strong> underline, not 1px.
                </td>
              </tr>
              <tr>
                <td>tab color</td>
                <td>
                  rest <code>&#123;text.muted.color&#125;</code>, active <code>&#123;primary.color&#125;</code>, hover
                  <code>&#123;text.color&#125;</code>
                </td>
                <td>
                  rest <code>var(--text-color-secondary)</code>, active <code>var(--primary-color-fg)</code>. Hover is
                  Aura's — the kit ships no hover rule, see the cascade note below.
                </td>
              </tr>
              <tr>
                <td>tab font-weight</td>
                <td><code>600</code></td>
                <td>Unchanged — the kit rule does not touch it.</td>
              </tr>
              <tr>
                <td>tablist background / border</td>
                <td><code>&#123;content.background&#125;</code>, border-width <code>0 0 1px 0</code></td>
                <td>
                  <code>background: transparent</code> and its own
                  <code>border-bottom: 1px solid var(--surface-border)</code> on <code>.p-tabs .p-tablist</code>.
                </td>
              </tr>
              <tr>
                <td>panel padding</td>
                <td><code>0.875rem 1.125rem 1.125rem 1.125rem</code> on the panel, plus a panel background</td>
                <td>
                  <code>background: transparent</code> on both, and the padding split by the kit: <code>0</code> on
                  <code>.p-tabs .p-tabpanels</code>, <code>1rem 0</code> on <code>.p-tabs .p-tabpanel</code> — content
                  sits flush with the page.
                </td>
              </tr>
              <tr>
                <td>active bar</td>
                <td>
                  height <code>1px</code>, <code>inset-block-end: -1px</code>, background
                  <code>&#123;primary.color&#125;</code>, transition <code>250ms cubic-bezier(0.35,0,0.25,1)</code>
                </td>
                <td>
                  <strong>Suppressed.</strong> <code>.p-tabs .p-tablist-active-bar</code> is <code>display: none</code>,
                  so the kit's 2px border is the only marker. See the note below for why.
                </td>
              </tr>
              <tr>
                <td>focus ring</td>
                <td>
                  <code>&#123;focus.ring.*&#125;</code> (1px) at offset <code>-1px</code> on
                  <code>.p-tab:not(.p-disabled):focus-visible</code>
                </td>
                <td>
                  <strong>Replaced.</strong> The kit's one ring — 2px <code>--primary-color-fg</code>, drawn inside the
                  tab at offset <code>-2px</code> because the strip scrolls in an overflow container that would clip an
                  outer ring.
                </td>
              </tr>
              <tr>
                <td>nav button</td>
                <td>width <code>2.5rem</code>, absolute, with a wide box-shadow fade over the strip edge</td>
                <td>Unchanged, except that its focus ring is the same inset kit ring.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura values from <code>&#64;openng/optimus-ui-themes/dist/aura/tabs/index.mjs</code>; base CSS (including
          <code>.p-tablist-viewport &#123; overflow-x: auto &#125;</code> and the <code>:focus-visible</code> rules)
          from <code>&#64;openng/optimus-ui-styles/dist/tabs/index.mjs</code>. Kit overrides quoted from the
          <code>styles.scss</code> block headed "Optimus UI Tabs Component (v18+) - Global Overrides / Ensures consistent
          styling after migration from TabView".
        </p>

        <h3>Rendered values (Aura plus the kit stylesheet)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>tab box ("Overview")</td>
                <td>
                  <strong>{{ m.tabBox }}</strong>
                </td>
              </tr>
              <tr>
                <td>tab padding / font-weight</td>
                <td>{{ m.tabPadding }} / {{ m.tabWeight }}</td>
              </tr>
              <tr>
                <td>active tab: the kit's underline</td>
                <td>{{ m.activeBorder }}</td>
              </tr>
              <tr>
                <td>active tab: Aura's sliding bar</td>
                <td>{{ m.activeBar }}</td>
              </tr>
              <tr>
                <td>focus ring</td>
                <td>{{ m.focusRing }}</td>
              </tr>
              <tr>
                <td>transition on <code>.p-tab</code></td>
                <td>{{ m.transition }}</td>
              </tr>
              <tr>
                <td>hover on an inactive tab</td>
                <td>{{ m.hover }}</td>
              </tr>
              <tr>
                <td>panel bodies in the DOM</td>
                <td>{{ m.lazy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Geometry is computed style and layout box on a rendered tab set; colors are given as the tokens they resolve
          from, because they move with the visual style, accent, and mode (ADR-0016). The kit's tab rules are not
          touched by any <code>html.style-&lt;name&gt;</code> block. Label contrast is in
          <code>docs/generated/CONTRAST.MD</code>: <code>--primary-color-fg</code> (active) under
          <code>brand foreground</code>, lowest 4.75:1 on <code>--surface-ground</code>; <code>--text-color-secondary</code>
          (rest) under <code>body text</code>, lowest 4.55:1. The kit paints the tab transparent, so the inset focus
          ring meets the page surface behind it: the "focus ring" rows on <code>--surface-ground</code>,
          <code>--surface-card</code> and <code>--surface-section</code>, 3.88–17.85:1. <code>.p-tab</code> transitions color and border over
          0.2s, so let a state settle before reading it.
        </p>

        <h3>One underline, and no hover rule — both on purpose</h3>
        <p>
          Two markers <em>could</em> mark the active tab: the kit's own <code>border-bottom: 2px</code> and Aura's
          absolutely-positioned <code>.p-tablist-active-bar</code>, which slides between tabs over 250 ms. They are the
          same color in light mode, but not in dark — the border takes the kit's <code>--primary-color-fg</code>, the
          bar the preset's <code>primary.color</code>, two near-identical shades of the accent 1px apart. So the kit suppresses the
          bar (<code>.p-tabs .p-tablist-active-bar &#123; display: none &#125;</code>, which outranks Aura's
          single-class <code>display: block</code>) and keeps its own border as the single marker. The cost is the
          animation: the marker now switches instantly instead of sliding.
        </p>
        <p>
          The hover state, by contrast, is Aura's because it cannot be anything else.
          <code>.p-tabs .p-tab:hover</code> has specificity (0,3,0); Aura's
          <code>.p-tab:not(.p-tab-active):not(.p-disabled):hover</code> has (0,4,0) and sets both <code>color</code> and
          the <code>border-color</code> shorthand — which overwrites the longhand <code>border-bottom-color</code> a kit
          rule would paint, and the color with it. The kit therefore ships <em>no</em> tab hover rule at all rather
          than a dead one; what renders is {{ m.hover }}. If you want a different hover, change the theme tokens or
          raise the specificity deliberately — a rule at (0,3,0) is wasted work.
        </p>

        <h3>Overflow: the strip always scrolls</h3>
        <p>
          <code>.p-tablist-viewport</code> is <code>overflow-x: auto</code> with <code>scrollbar-width: none</code> and
          <code>scroll-behavior: smooth</code> — unconditionally, whether or not you pass <code>[scrollable]</code>.
          What <code>[scrollable]</code> actually does is add the class <code>p-tabs-scrollable</code> to the root, and
          that class has <strong>zero</strong>
          rules in the shipped stylesheet (<code>&#64;openng/optimus-ui-styles/dist/tabs/index.mjs</code>); the
          <code>TabList.scrollable</code> computed (<code>openng-optimus-ui-tabs.mjs:293</code>) is never read in the template.
          The chevron buttons come from <code>showNavigators</code> (default <code>true</code>) plus a live overflow
          measurement in <code>updateButtonState()</code> (:355-363), refreshed by a <code>ResizeObserver</code>.
        </p>
        <p class="src-note">
          Measured on the overflow example: {{ m.overflow }} Two consequences for authors. A hidden scrollbar means the
          only overflow affordance is the chevron pair — remove them with <code>[showNavigators]="false"</code> and
          mouse users get a strip that scrolls with no sign that it does. And the "previous" chevron only exists once
          you have already scrolled (<code>isPrevButtonEnabled</code> is <code>scrollLeft !== 0</code>,
          <code>:361</code>), so the strip is asymmetric by design.
        </p>

        <h3>The bar above this article is not a <code>p-tabs</code></h3>
        <p>
          The guide shell hand-rolls the pattern in about thirty lines of markup plus a keyboard handler
          (<code>article-shell.component.ts</code>), and so does the component detail page
          (<code>dev-design-detail.component.ts</code>). Comparing a hand-rolled tablist with the library one is the
          cheapest way to see what the library actually buys you — and what it does not:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Hand-rolled tablist</th>
                <th><code>p-tabs</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>tab element</td>
                <td><code>&lt;button type="button"&gt;</code> — native semantics, native activation</td>
                <td><code>&lt;p-tab&gt;</code>, a custom element with <code>role="tab"</code></td>
              </tr>
              <tr>
                <td>tablist name</td>
                <td>Whatever you write on the element carrying <code>role="tablist"</code> — trivially right</td>
                <td>None unless you add <code>[pt]</code>; a host <code>aria-label</code> is silently ignored</td>
              </tr>
              <tr>
                <td>activation</td>
                <td>Whatever you implement — the kit's shells select on arrow</td>
                <td><strong>Manual</strong> by default; <code>[selectOnFocus]</code> switches it</td>
              </tr>
              <tr>
                <td>roving tabindex</td>
                <td>Yours to maintain, one entry per tab</td>
                <td>Free, and correct</td>
              </tr>
              <tr>
                <td>ids / <code>aria-controls</code></td>
                <td>Hand-written, and hand-kept in sync</td>
                <td>Generated from the tabs id</td>
              </tr>
              <tr>
                <td>panels</td>
                <td>All in the DOM, inactive ones <code>hidden</code> — no lazy option unless you build one</td>
                <td>Same by default, plus <code>[lazy]</code></td>
              </tr>
              <tr>
                <td>panel <code>tabindex</code></td>
                <td>Yours to set — the kit's shells do</td>
                <td><strong>Absent</strong>; add a static <code>tabindex="0"</code></td>
              </tr>
              <tr>
                <td>overflow</td>
                <td>Whatever you choose — the kit's shells wrap to a second row</td>
                <td>Horizontal scroll plus chevrons</td>
              </tr>
              <tr>
                <td>active marker</td>
                <td>A border, typically without animation</td>
                <td>A border plus Aura's sliding bar (this kit suppresses the bar)</td>
              </tr>
              <tr>
                <td>disabled tabs</td>
                <td>Yours to skip in the arrow handler</td>
                <td>Skipped by <code>findNextTab</code>/<code>findPrevTab</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The honest summary: the two things hand-rolling gets right almost by accident are the two things the library
          gets wrong — the tablist has a name because you wrote it on the right element, and the panel is focusable
          because nothing generated it for you. What the library adds is the generated tab-to-panel pairing,
          disabled-tab traversal, the scroll machinery, and a keyboard mode you have to choose deliberately. Everything
          else is maintenance you take on yourself, in every language and at every width.
        </p>

        <h3>Sizing and layout</h3>
        <ul>
          <li>
            <code>.p-tabs</code> is <code>display: flex; flex-direction: column</code> and takes the width of its
            container — give the container the width, not the tabs.
          </li>
          <li>
            <code>.p-tab</code> is <code>flex-shrink: 0; white-space: nowrap</code>: labels never wrap and never
            compress. A long translated label widens the strip until it overflows.
          </li>
          <li>
            There is no vertical variant. The keyboard handler answers only <kbd>←</kbd>/<kbd>→</kbd> and nothing writes
            <code>aria-orientation</code>, so a visually vertical strip built with CSS would announce and behave as a
            horizontal one.
          </li>
        </ul>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.2 for the tabs and the panels, which carry <code>role="tab"</code> and
          <code>role="tabpanel"</code>, <code>aria-selected</code>, <code>aria-disabled</code> and the generated
          <code>aria-controls</code> and <code>aria-labelledby</code> pairing, all confirmed on the rendered tree; SC
          2.1.1 with the arrow keys wrapping, Home and End, Enter and Space, and disabled tabs skipped by the traversal;
          SC 2.4.7 with the kit ring rendering in both themes, 2px solid at an outline offset of -2px; and SC 2.5.8, the tab
          box measuring 100 × 47px, identical in both themes and clear of the 24px floor in both axes.
          <strong>Failing:</strong> none of the measured criteria fails. <strong>Conditional:</strong> SC 2.1.1 for the
          panel — no <code>tabindex</code> is generated for it, so a panel that holds no focusable element cannot be
          reached, and only a static attribute fixes it; and SC 4.1.2 for the tablist itself, measured as having no
          accessible name, because <code>role="tablist"</code> sits on an inner element that a name written on the host
          never reaches. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>TabsModule</code> exports all five components. This is the v18+ structure that replaced
          <code>TabView</code>/<code>p-tabPanel</code>; there is no <code>TabViewModule</code> left in this version, and
          no directive form. None of the five is a <code>ControlValueAccessor</code> — a tab set is not a form control.
        </p>

        <h3><code>p-tabs</code> — inputs and outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type / default</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td><code>model&lt;string | number | undefined&gt;()</code></td>
                <td>
                  The active tab's value. Two-way (<code>[(value)]</code>) or <code>[value]</code> +
                  <code>(valueChange)</code>. <strong>Not <code>any</code>:</strong> under
                  <code>strictTemplates</code> a narrowly typed signal cannot take <code>$event</code> directly — narrow
                  it in a handler (this article does, see its <code>setNum</code>). Matching is
                  <code>equals()</code> from <code>&#64;openng/optimus-ui-utils</code>.
                </td>
              </tr>
              <tr>
                <td><code>lazy</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  Panels render on first activation instead of upfront. Applies to every panel;
                  <code>p-tabpanel</code> has its own <code>lazy</code> for a single one.
                </td>
              </tr>
              <tr>
                <td><code>selectOnFocus</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  <strong>Automatic activation.</strong> With it, arrowing to a tab selects it; without it, arrows move
                  focus only and you confirm with Enter/Space.
                </td>
              </tr>
              <tr>
                <td><code>scrollable</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  Adds <code>p-tabs-scrollable</code> to the root. In Optimus 2.0.2 that class still carries no rules — see the
                  Design tab before you rely on this.
                </td>
              </tr>
              <tr>
                <td><code>showNavigators</code></td>
                <td>boolean, <code>true</code></td>
                <td>
                  The chevron buttons that appear once the strip overflows. Their labels come from the library's
                  <code>translation.aria.previous/next</code>.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number, <code>0</code></td>
                <td>
                  The tabindex of the <em>active</em> tab (and of the nav buttons). Inactive tabs are always
                  <code>-1</code>.
                </td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>dt</code> / <code>unstyled</code></td>
                <td>object</td>
                <td>
                  From <code>BaseComponent</code>: pass-through attributes, per-instance design tokens, style opt-out.
                  <code>pt</code> is the only way to reach the inner <code>role="tablist"</code> element — but write it
                  on <strong><code>p-tablist</code></strong
                  >: <code>pt</code> does <strong>not</strong> cascade to child components (<code>$pt</code> resolves
                  this component's own <code>pt</code> input only, <code>openng-optimus-ui-basecomponent.mjs:84-85</code>), so the
                  same object on <code>p-tabs</code> reaches nothing.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The only output is <code>valueChange</code> (the <code>model()</code>'s writer). There is no
          <code>onOpen</code>/<code>onClose</code> pair and no cancellable event — if a switch must be vetoed (unsaved
          changes), keep <code>value</code> in your own signal and decide in the handler whether to write it.
        </p>

        <h3>The other four</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Inputs</th>
                <th>Renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tablist</code></td>
                <td>— (plus <code>pt</code>); templates <code>#previcon</code>, <code>#nexticon</code></td>
                <td>Wrapper → scroll viewport → <code>div[role=tablist]</code> + the active bar.</td>
              </tr>
              <tr>
                <td><code>p-tab</code></td>
                <td><code>value</code>, <code>disabled</code></td>
                <td>Host with <code>role="tab"</code>, projected content as the label.</td>
              </tr>
              <tr>
                <td><code>p-tabpanels</code></td>
                <td>—</td>
                <td><code>role="presentation"</code> wrapper with the panel padding.</td>
              </tr>
              <tr>
                <td><code>p-tabpanel</code></td>
                <td><code>value</code>, <code>lazy</code>; content child <code>#content</code></td>
                <td>
                  <code>role="tabpanel"</code>, <code>aria-labelledby</code>, <code>[hidden]</code> when inactive.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs verified against <code>&#64;openng/optimus-ui/types/openng-optimus-ui-tabs.d.ts</code> and the shipped
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code> (Optimus UI 2.0.2,
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>pt</code>/<code>dt</code>/ <code>unstyled</code> from
          <code>openng-optimus-ui-basecomponent.mjs</code>.
        </p>

        <h3>Ids are generated — and that is your <code>aria-controls</code></h3>
        <p>
          <code>p-tabs</code> generates <code>id="pn_id_N"</code>, and every child derives from it: a tab gets
          <code>&lt;tabsId&gt;_tab_&lt;value&gt;</code>, a panel <code>&lt;tabsId&gt;_tabpanel_&lt;value&gt;</code>, and
          the two point at each other with <code>aria-controls</code> / <code>aria-labelledby</code>. You get that
          wiring for free — but it also means <strong>the value ends up in the DOM id</strong>. Use short, stable,
          string-or-number values; an object value stringifies into something unusable, and a value that changes between
          renders breaks the pairing.
        </p>

        <h3>Lazy panels: what "lazy" really promises</h3>
        <pre class="code-block"><code>{{ lazySnippet }}</code></pre>
        <ul>
          <li>
            <strong>Off (the default):</strong> every panel body is created with the page. Five heavy panels cost five
            panels' worth of components, HTTP calls in their constructors, and canvases — before the user has looked at
            one.
          </li>
          <li>
            <strong>On:</strong> a panel mounts the first time it becomes active — and <strong>stays mounted</strong>.
            <code>shouldRender</code> latches on a plain <code>hasBeenRendered</code> field
            (<code>openng-optimus-ui-tabs.mjs:796-807</code>), so revisiting a panel never re-runs its constructor. State and
            scroll position survive; so does the memory.
          </li>
          <li>
            <strong>Never</strong> reach for lazy to hide a panel from the accessibility tree — an inactive panel is
            already <code>hidden</code>. Lazy is a cost knob, nothing else.
          </li>
          <li>
            <strong>SSR:</strong> with lazy off, all panels are prerendered into the HTML (good for crawlers, heavy for
            the payload); with lazy on, only the initial panel exists in the server output. Decide which you need before
            you flip it.
          </li>
        </ul>

        <h3>Keeping the value in the URL</h3>
        <p>
          The pattern behind the Do/Don't in the Usage tab. The tab set stays the source of truth for rendering; the
          query parameter is a mirror that makes it linkable.
        </p>
        <pre class="code-block"><code>{{ urlSnippet }}</code></pre>

        <h3>SSR</h3>
        <ul>
          <li>
            Everything browser-only in the component is already guarded: <code>updateInkBar</code> runs inside
            <code>isPlatformBrowser</code> + <code>setTimeout</code>, the <code>ResizeObserver</code> and the
            <code>MutationObserver</code> bind in <code>onAfterViewInit</code> / behind the same guard.
          </li>
          <li>
            Your own tab bodies are the risk. A panel that touches <code>window</code>/<code>document</code> at
            construction runs during prerender for <em>every</em> panel unless <code>[lazy]</code> is on — the guard
            belongs in your code either way (see <code>AGENTS.md</code> → Code style).
          </li>
          <li>
            The active bar is sized in JavaScript, so the prerendered HTML ships a zero-width bar and it snaps into
            place on hydration. Harmless, but do not screenshot-test that first frame.
          </li>
        </ul>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>What the library wires for you</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Requirement (APG)</th>
                <th>Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>role="tablist"</code> containing the tabs</td>
                <td>
                  <strong>Yes</strong> — on <code>div.p-tablist-tab-list</code>, not on the
                  <code>&lt;p-tablist&gt;</code> host.
                </td>
              </tr>
              <tr>
                <td>each tab <code>role="tab"</code> with <code>aria-selected</code></td>
                <td><strong>Yes</strong>, plus <code>aria-disabled</code> and <code>data-p-active</code>.</td>
              </tr>
              <tr>
                <td><code>aria-controls</code> → panel, <code>aria-labelledby</code> → tab</td>
                <td><strong>Yes</strong>, both generated from the tabs id.</td>
              </tr>
              <tr>
                <td>only the active tab in the tab order</td>
                <td><strong>Yes</strong> — roving tabindex (<code>disabled ? -1 : active ? tabindex() : -1</code>).</td>
              </tr>
              <tr>
                <td>arrow keys move between tabs, Home/End to the ends</td>
                <td><strong>Yes</strong>, with wrap-around.</td>
              </tr>
              <tr>
                <td>an accessible name on the tablist</td>
                <td>
                  <strong>No</strong> — nothing sets one and the host attribute does not reach the role. Use
                  <code>[pt]</code>.
                </td>
              </tr>
              <tr>
                <td><code>tabindex="0"</code> on a panel with no focusable content</td>
                <td><strong>No</strong> — never set. See the gap below.</td>
              </tr>
              <tr>
                <td><code>aria-orientation</code> when the strip is not horizontal</td>
                <td><strong>No</strong> — and no vertical mode exists.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Keyboard — measured, not assumed</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Default (<code>selectOnFocus</code> off)</th>
                <th>With <code>[selectOnFocus]="true"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Enters the strip on the <em>active</em> tab (roving tabindex); pressing it again should enter the
                  panel, and does not — {{ m.tabKey }}. The first example above fixes that; the others deliberately do
                  not.
                </td>
                <td>Same.</td>
              </tr>
              <tr>
                <td><kbd>→</kbd> / <kbd>←</kbd></td>
                <td>
                  <strong>Moves focus only</strong>, wrapping at the ends; the panel does not change until you confirm.
                  Measured: focus moved, <code>aria-selected</code> did not.
                </td>
                <td>Moves focus <em>and</em> switches the panel.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Focus the first / last enabled tab.</td>
                <td>Focus and select it.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                <td>Activate the focused tab.</td>
                <td>Already activated; the key is still handled.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>
                  <strong>Quirk:</strong> scrolls the first / last tab into view
                  <em>without moving focus or selection</em> — and calls <code>preventDefault()</code>, so the page does
                  not scroll either.
                </td>
                <td>Same.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> / <kbd>↓</kbd></td>
                <td>Not handled — but see the propagation note.</td>
                <td>Same.</td>
              </tr>
              <tr>
                <td>disabled tabs</td>
                <td>
                  Skipped by <code>findNextTab</code>/<code>findPrevTab</code>, which also skip the active-bar span.
                </td>
                <td>Same.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>Tab.onKeyDown</code> and its handlers (<code>openng-optimus-ui-tabs.mjs:573-660</code>), and measured at
          the keyboard:
          {{ m.keyboard }}
        </p>

        <h4>Known gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Every keydown is swallowed.</strong> <code>onKeyDown</code> ends with an unconditional
            <code>event.stopPropagation()</code> (<code>:588</code>) — including for keys it does not handle.
            {{ m.stopPropagation }} A document-level shortcut listener therefore sees nothing while a tab has focus. If
            your app has global keys, bind them with <code>capture: true</code> or accept the dead zone.
          </li>
          <li>
            <strong>The panel is not focusable.</strong> APG asks for <code>tabindex="0"</code> on a tabpanel that
            contains no focusable element, so keyboard users can read it. Optimus never sets it — the Aura theme even
            ships a <code>tabpanel.focusRing</code> token that can therefore never appear ({{ m.panelFocus }}); once
            you add the attribute, the kit's one ring (2px <code>--primary-color-fg</code>, outside) marks it. Fix it
            with a plain static attribute on the host: <code>&lt;p-tabpanel [value]="0" tabindex="0"&gt;</code>, as the
            first example above does. <strong>Note what does <em>not</em> work:</strong> the obvious pass-through,
            <code>[pt]="&#123; root: &#123; tabindex: 0 &#125; &#125;"</code>, does not reach the panel host at all,
            even though the same <code>pt</code> mechanism does reach the tablist's inner div. Verify a pass-through in
            the DOM before you trust it.
          </li>
          <li>
            <strong>The tablist has no name.</strong> Two tab sets on one page are two unnamed "tab list" landmarks in a
            screen-reader's list. Name them via <code>[pt]</code> on <code>p-tablist</code>, which is measured to work —
            every tab set in this guide is named that way.
          </li>
          <li>
            <strong>The nav buttons take their names from the library's own vocabulary.</strong>
            <code>config.translation.aria.previous</code> / <code>.next</code> default to the English literals
            "Previous" / "Next" (<code>openng-optimus-ui-config.mjs:185-186</code>). This kit feeds them from its i18n layer
            instead; a downstream kit that does not will ship two English words into every other language — see the I18n
            tab.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ The content really is one subject seen several ways — not steps, not sections to compare, not pages that
            deserve URLs.
          </li>
          <li>
            ☐ At most about four tabs at the narrowest supported width, checked at 360px with the longest language you
            ship.
          </li>
          <li>☐ The tablist carries a name via <code>[pt]</code> if the page has more than one.</li>
          <li>☐ Panels with no focusable content get <code>tabindex="0"</code>.</li>
          <li>
            ☐ Reachable with <kbd>Tab</kbd>, operable with <kbd>←</kbd>/<kbd>→</kbd>/ <kbd>Home</kbd>/<kbd>End</kbd>,
            activated with <kbd>Enter</kbd>; focus visible in <strong>both</strong> themes.
          </li>
          <li>
            ☐ A deliberate decision on <code>[selectOnFocus]</code>: automatic only when switching is cheap and
            side-effect-free.
          </li>
          <li>☐ A deliberate decision on <code>[lazy]</code>, with the prerender cost in mind.</li>
          <li>
            ☐ Tab labels come from the translation service, and the array is a <code>computed()</code> so a language
            switch re-renders them.
          </li>
          <li>☐ No global keyboard shortcut depends on events bubbling out of a focused tab.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the two rules most likely to regress — manual activation
          and the generated pairing:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Labels are content, and their length is a layout risk</h3>
        <p>
          A tab strip is the least forgiving place in a layout to put translated text.
          <code>.p-tab</code> is <code>white-space: nowrap</code> and <code>flex-shrink: 0</code>, so a label never
          wraps and never compresses: German labels run 20–40% longer than English ("Einstellungen" vs "Settings"), and
          the overflow lands the reader behind a chevron rather than in a wrapped line. Budget your tab count for the
          longest language, not for English.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Build the labels in a <code>computed()</code></strong> that calls the kit's
            <code>TranslationService</code>, so a language switch rebuilds them. A plain field is captured once and goes
            stale.
          </li>
          <li>
            <strong>Keep <code>value</code> out of the translation.</strong> Values become DOM ids and belong in the
            URL; they must be stable across languages. Translate the label, never the key.
          </li>
          <li>
            <strong>Re-measure after a language switch.</strong> The nav buttons appear from a
            <code>ResizeObserver</code> on the tablist, so a wider set of labels does bring them back automatically —
            but the active bar is positioned in a <code>setTimeout</code> keyed to the <em>value</em>, not to the label
            text. A label that changes width without a value change leaves the bar where it was until the next switch.
            (A <code>MutationObserver</code> on the active tab covers text changes inside that tab; a language switch
            that changes a <em>different</em> tab's width does not move the bar.)
          </li>
        </ul>

        <h3>The library's own strings need feeding, once</h3>
        <p>
          The two chevron buttons are named from
          <code>config.translation.aria.previous</code> and <code>.next</code>, whose defaults are the English literals
          <code>'Previous'</code> and <code>'Next'</code> (<code>openng-optimus-ui-config.mjs:185-186</code>). They are not
          per-call-site strings: nothing you write on a <code>p-tabs</code> reaches them. This kit keeps them in its own
          translation modules and pushes the whole <code>aria</code> block into the library's config on every language switch, which
          is the same mechanism that translates the select's "Option List" and the chip's "Remove". Two things to get
          right in your own kit:
        </p>
        <ul>
          <li>
            <strong>Feed it, or ship English.</strong> A static <code>translation</code> block in
            <code>provideOptimus</code> is enough for a single-language app; an app that switches language at runtime
            has to call <code>setTranslation</code> again on every switch.
          </li>
          <li>
            <strong>Merge, do not replace.</strong> <code>setTranslation</code> merges one level deep, so passing a
            fresh <code>aria</code> object drops every key you did not list. Spread the current block first.
          </li>
        </ul>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>

        <h3>Direction</h3>
        <p>
          The scroll math is RTL-aware — <code>onPrevButtonClick</code> and <code>onNextButtonClick</code> negate
          <code>scrollLeft</code> under <code>isRTL()</code>, and the chevrons are flipped with a
          <code>:dir(rtl)</code> rotation in the base stylesheet. Nothing here is wired today (the kit ships LTR
          languages only), and it has not been verified by rendering an RTL locale, because there is none to render.
        </p>

        <h3>Hidden panels and the reader's own tools</h3>
        <p>
          Translated or not, a panel behind an inactive tab is invisible to find-in-page, to print, and to the browser's
          built-in translation of the visible viewport. If a language-switching reader needs to search across your
          content, that content should not be in tabs at all — which is the Usage tab's fourth question, arrived at from
          the i18n side.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: tabs and nav buttons wear the
            kit's one 2px ring inside their edge (CONTRAST.MD "focus ring"); the active label's lowest ratio
            corrected to 4.75:1.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): rendered colors named by token instead of
            old-palette readings; tab label contrast cited from the contrast gate; four stale library line refs corrected
            (lazy latch, <code>$pt</code> resolution, key handlers); tooling names dropped from reader-facing text; agent doc
            trimmed under the size aim; history sorted newest first.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Three v22 claims flipped
            back: the inner <code>div.p-tablist-tab-list</code> level exists again and carries
            <code>role="tablist"</code> (so the pass-through section is <code>tabList</code>, not
            <code>content</code>), <code>scrollStrategy</code> does not exist, and Aura is back on 2.x values —
            <code>tab.borderWidth: 0 0 1px 0</code> with an <code>activeBorderColor</code>, active bar 1px at
            <code>bottom: -1px</code>. Line refs re-derived against the Optimus bundles; the computed-style
            measurements were not re-taken.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1 / Aura 3.0, which redesigned the
            strip: the tab underline is gone upstream (<code>tab.borderWidth: 0</code>, borders transparent, active-bar
            at <code>bottom: 0</code>) — the kit's own 2px marker plus active-bar suppression still yields exactly one
            marker. The tablist pass-through section moved (<code>tabList</code> → <code>content</code>, all samples
            migrated), the v21 inner <code>p-tablist-tab-list</code> level is gone, <code>scrollStrategy</code> is new,
            and <code>[scrollable]</code> still does nothing. Line refs re-derived against 22.1.2.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Rewritten to state findings rather than how they were found. Corrected
            against the current kit stylesheet: the active tab now carries one underline (Aura's sliding bar is
            suppressed) and the kit ships no tab hover rule; the scroll chevrons are fed from the kit's i18n layer, not
            left English.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: the tabs/accordion/steps/routes decision table, a live
            playground with a rendered-panel counter, four Do/Don't pairs, an Aura-and-kit design tab, and the canonical
            agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TabsArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  /**
   * Measured values, quoted in the Design and Development tabs. Kept in one
   * object so the same number cannot drift between prose and table. Provenance
   * is Aura plus this kit's styles.scss, read as computed styles; colors are
   * named by token because they move with the visual style (ADR-0016).
   */
  readonly m = {
    tabBox: '100 × 47px ("Overview", stock font) — the width follows the label and the active style font; clears the 24px SC 2.5.8 floor in both axes',
    tabPadding: '12px 16px (the token says 1rem 1.125rem)',
    tabWeight: "600 (Aura's, untouched by the kit)",
    activeBorder: "2px solid var(--primary-color-fg) — the kit's contrast-adjusted accent foreground, per accent and mode",
    activeBar:
      'not rendered — the kit sets display: none on it; unsuppressed it is 1px tall and slides over 0.25s cubic-bezier(0.35, 0, 0.25, 1) in {primary.color}, a different shade from the border above',
    focusRing:
      "outline 2px solid var(--primary-color-fg) at outline-offset -2px — the kit's one ring, drawn inside the tab (Aura's 1px {focus.ring} is overridden); 3.88–17.85:1 on the page surfaces behind the transparent tab (CONTRAST.MD \"focus ring\")",
    transition: "border-color 0.2s, color 0.2s — the kit's two, replacing Aura's five-property transition",
    hover:
      "Aura's pair: the label goes from the kit's --text-color-secondary to {text.color}, and the bottom border from transparent to {content.border.color}",
    overflow:
      'nine tabs in a 22rem column measure a 908px strip in a 352px viewport. At rest exactly ONE chevron renders ("next"); after scrolling 200px both appear.',
    tabKey:
      'without the attribute, focus leaves the tab set entirely and lands on the next link after it; with a static tabindex="0" on the panel it lands on the panel itself (role="tabpanel")',
    keyboard:
      'ArrowRight moved focus from tab 1 to tab 2 while aria-selected stayed "true" on tab 1; Enter then moved it. With [selectOnFocus]="true" the same ArrowRight moved both.',
    stopPropagation:
      'A keydown dispatched on a tab never reaches a document listener, while the identical event dispatched on <body> does.',
    lazy: '3 of 3 panel bodies in the DOM with lazy off; 1 of 3 with lazy on, rising to 2 after visiting a second tab — and staying at 2 after switching back',
    panelFocus: 'the attribute is simply absent from the panel host',
  };

  // --- Playground state ------------------------------------------------------
  readonly countOptions = [
    { label: '3 tabs', value: 3 },
    { label: '5 tabs', value: 5 },
    { label: '9 tabs', value: 9 },
  ];

  readonly pgCount = signal(3);
  readonly pgLazy = signal(false);
  readonly pgSelectOnFocus = signal(false);
  readonly pgScrollable = signal(false);
  readonly pgNavigators = signal(true);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal(0);
  readonly panelReadout = signal('not counted yet');

  protected static readonly TAB_LABELS = [
    'Overview',
    'Activity',
    'Settings',
    'Members',
    'Billing',
    'Integrations',
    'Webhooks',
    'Audit log',
    'Danger zone',
  ];

  readonly pgTabs = computed(() =>
    TabsArticleComponent.TAB_LABELS.slice(0, this.pgCount()).map((label, value) => ({ label, value })),
  );

  /** Names the playground's tablist — the pass-through route documented in Usage. */
  readonly pgTablistPt = { tabList: { 'aria-label': 'Playground views' } };
  readonly basicPt = { tabList: { 'aria-label': 'Record views' } };
  readonly disabledPt = { tabList: { 'aria-label': 'Document states' } };
  readonly overflowPt = { tabList: { 'aria-label': 'Project sections' } };
  readonly iconsPt = { tabList: { 'aria-label': 'Document and comments' } };
  readonly scanPt = { tabList: { 'aria-label': 'Model criteria' } };
  readonly plainPt = { tabList: { 'aria-label': 'Data views, not shareable' } };
  readonly urlPt = { tabList: { 'aria-label': 'Data views, shareable' } };
  readonly manyPt = { tabList: { 'aria-label': 'Too many sections' } };
  readonly fewPt = { tabList: { 'aria-label': 'Three sections' } };
  readonly namedTablistPt = { tabList: { 'aria-label': 'Report views' } };

  readonly manyTabs = TabsArticleComponent.TAB_LABELS.map((label, value) => ({ label, value }));

  onCountChange(count: number): void {
    this.pgCount.set(count);
    if (this.pgValue() >= count) this.pgValue.set(0);
  }

  onPgValue(value: TabValue): void {
    if (typeof value === 'number') this.pgValue.set(value);
  }

  /**
   * `p-tabs` declares `value` as `ModelSignal<string | number | undefined>`
   * (@openng/optimus-ui/types/openng-optimus-ui-tabs.d.ts:89), so under `strictTemplates` a narrowly
   * typed signal cannot take `$event` directly. These two narrow it once,
   * instead of scattering casts through the template.
   */
  setNum(target: WritableSignal<number>, value: TabValue): void {
    if (typeof value === 'number') target.set(value);
  }

  setStr(target: WritableSignal<string>, value: TabValue): void {
    if (value !== undefined) target.set(String(value));
  }

  /**
   * Counts the rendered panel bodies inside the playground stage. The
   * `<p-tabpanel>` hosts always exist; only their CONTENT is conditional, so the
   * marker span is what tells lazy and eager apart. Guarded for SSR.
   */
  countPanels(): void {
    if (typeof document === 'undefined') return;
    const stage = document.getElementById('pg-stage');
    if (!stage) return;
    const rendered = stage.querySelectorAll('[data-panel-marker]').length;
    const total = this.pgCount();
    this.panelReadout.set(`${rendered} of ${total} panel bodies in the DOM (lazy ${this.pgLazy() ? 'on' : 'off'})`);
  }

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const attrs: string[] = ['[(value)]="view"'];
    if (this.pgLazy()) attrs.push('[lazy]="true"');
    if (this.pgSelectOnFocus()) attrs.push('[selectOnFocus]="true"');
    if (this.pgScrollable()) attrs.push('[scrollable]="true"');
    if (!this.pgNavigators()) attrs.push('[showNavigators]="false"');
    const tabs = this.pgTabs()
      .map((t) => {
        const dis = this.pgDisabled() && t.value === 2 ? ' [disabled]="true"' : '';
        return `    <p-tab [value]="${t.value}"${dis}>${t.label}</p-tab>`;
      })
      .join('\n');
    const panels = this.pgTabs()
      .map((t) => `    <p-tabpanel [value]="${t.value}">…</p-tabpanel>`)
      .join('\n');
    // The [pt] belongs on <p-tablist>, NOT on <p-tabs>: pt does not cascade to
    // children — `$pt` resolves only the component's own `pt` input
    // (openng-optimus-ui-basecomponent.mjs), and TabList reads its own. Emitting it on the
    // root would hand every copy-paste user exactly the nameless tablist this
    // guide writes a MUST rule against.
    return `<p-tabs ${attrs.join(' ')}>
  <p-tablist [pt]="{ tabList: { 'aria-label': 'Playground views' } }">
${tabs}
  </p-tablist>
  <p-tabpanels>
${panels}
  </p-tabpanels>
</p-tabs>`;
  });

  // --- Example state ---------------------------------------------------------
  readonly exBasic = signal(0);
  readonly exDisabled = signal(0);
  readonly exOverflow = signal(0);
  readonly exIcons = signal(0);
  readonly ddScanTab = signal(0);
  readonly ddScanPanels = signal<number[]>([0, 1, 2]);
  readonly ddPlainTab = signal('chart');
  readonly ddNameBad = signal(0);
  readonly ddNameGood = signal(0);
  readonly ddManyTab = signal(0);
  readonly ddFewTab = signal(0);

  /** p-accordion emits `number | number[] | undefined` in multiple mode. */
  onScanPanels(value: unknown): void {
    this.ddScanPanels.set(Array.isArray(value) ? (value as number[]) : []);
  }

  /**
   * The URL-mirrored tab of the Usage tab's second Do/Don't pair. The initial
   * value comes from the query parameter, so a reload (or a pasted link) lands
   * on the same panel; every switch replaces the URL instead of pushing, so the
   * back button is not littered with view changes.
   */
  readonly urlTab = signal<string>(this.route.snapshot.queryParamMap.get('view') === 'table' ? 'table' : 'chart');

  onUrlTab(value: TabValue): void {
    if (value === undefined) return;
    this.urlTab.set(String(value));
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: String(value) },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'Three views of one record',
      note: 'The baseline. Five elements, one value, and the ARIA wiring generated for you.',
      code: `<p-tabs [(value)]="view" [pt]="{ tabList: { 'aria-label': 'Record views' } }">
  <p-tablist>
    <p-tab [value]="0">Overview</p-tab>
    <p-tab [value]="1">Activity</p-tab>
    <p-tab [value]="2">Settings</p-tab>
  </p-tablist>
  <p-tabpanels>
    <p-tabpanel [value]="0">…</p-tabpanel>
    <p-tabpanel [value]="1">…</p-tabpanel>
    <p-tabpanel [value]="2">…</p-tabpanel>
  </p-tabpanels>
</p-tabs>`,
    },
    {
      id: 'disabled',
      title: 'A disabled tab',
      note: 'Skipped by the arrow keys, out of the tab order, still announced as disabled.',
      code: `<p-tab [value]="1" [disabled]="true">Review</p-tab>`,
    },
    {
      id: 'overflow',
      title: 'What overflow looks like',
      note: 'Nine tabs in a 22rem column. The strip scrolls with a hidden scrollbar; the chevrons are the only affordance.',
      code: `<!-- No [scrollable] needed: .p-tablist-viewport is overflow-x: auto always.
     [showNavigators]="false" would remove the chevrons — and with them the
     only visible sign that the strip scrolls at all. -->
<p-tabs [(value)]="section">
  <p-tablist>
    @for (t of sections(); track t.value) {
      <p-tab [value]="t.value">{{ t.label }}</p-tab>
    }
  </p-tablist>
  …
</p-tabs>`,
    },
    {
      id: 'icons',
      title: 'Icons and counts in a label',
      note: 'A tab projects arbitrary content — which means all of it becomes the accessible name.',
      code: `<p-tab [value]="1">
  <i class="pi pi-comments" aria-hidden="true"></i>
  <span>{{ t('doc.comments') }}</span>
  <span class="count-chip">{{ commentCount() }}</span>
</p-tab>
<!-- Announced as "Comments 4". Keep decorative icons aria-hidden, and make
     sure the number still reads as something when spoken. -->`,
    },
  ];

  readonly anatomySnippet: string = `<p-tabs class="p-tabs p-component" id="pn_id_12">      ← state holder
  <p-tablist class="p-tablist">                        ← overflow: hidden
    <button class="p-tablist-prev-button">…</button>    ← only while overflowing
    <div class="p-tablist-content p-tablist-viewport">  ← overflow-x: auto
      <div class="p-tablist-tab-list" role="tablist">   ← THE tablist
        <p-tab role="tab" id="pn_id_12_tab_0"
               aria-controls="pn_id_12_tabpanel_0"
               aria-selected="true" tabindex="0">…</p-tab>
        <p-tab role="tab" … tabindex="-1">…</p-tab>
        <span class="p-tablist-active-bar" role="presentation"></span>
      </div>
    </div>
    <button class="p-tablist-next-button">…</button>
  </p-tablist>
  <p-tabpanels class="p-tabpanels" role="presentation">
    <p-tabpanel role="tabpanel" id="pn_id_12_tabpanel_0"
                aria-labelledby="pn_id_12_tab_0">…</p-tabpanel>
    <p-tabpanel role="tabpanel" … hidden>…</p-tabpanel>
  </p-tabpanels>
</p-tabs>`;

  readonly devImport: string = `import { TabsModule } from '@openng/optimus-ui/tabs';

@Component({
  standalone: true,
  imports: [TabsModule],
  // ...
})`;

  readonly lazySnippet: string = `<!-- Whole set: nothing but the initial panel is created up front. -->
<p-tabs [(value)]="view" [lazy]="true"> … </p-tabs>

<!-- Or one expensive panel out of several. -->
<p-tabpanel [value]="'chart'" [lazy]="true">
  <app-heavy-chart />
</p-tabpanel>

<!-- Once rendered, a panel is never destroyed again:
     shouldRender = !lazy || hasBeenRendered || active   (openng-optimus-ui-tabs.mjs:797-805) -->`;

  readonly urlSnippet: string = `private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

// Initial value from the URL, so a reload or a shared link lands correctly.
readonly view = signal<'chart' | 'table'>(
  this.route.snapshot.queryParamMap.get('view') === 'table' ? 'table' : 'chart',
);

onView(value: 'chart' | 'table'): void {
  this.view.set(value);
  void this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { view: value },
    queryParamsHandling: 'merge',
    replaceUrl: true,   // a view switch is not a navigation step
  });
}

// template: <p-tabs [value]="view()" (valueChange)="onView($event)"> … </p-tabs>`;

  readonly i18nSnippet: string = `// Labels rebuild on a language switch because the array is a computed().
// The VALUES stay English/stable — they become DOM ids and URL parameters.
readonly tabs = computed(() => [
  { value: 'overview', label: this.i18n.translate('record.tab.overview') },
  { value: 'activity', label: this.i18n.translate('record.tab.activity') },
  { value: 'settings', label: this.i18n.translate('record.tab.settings') },
]);`;

  readonly primengTranslationSnippet: string = `// Static, for a single-language app: app.config.ts
// These two name the tab strip's scroll chevrons; the defaults are the
// English literals 'Previous' and 'Next' (openng-optimus-ui-config.mjs:185-186).
provideOptimus({
  theme: { preset: Aura, options: { prefix: 'p', darkModeSelector: '.dark-theme' } },
  translation: {
    aria: { previous: 'Zurück', next: 'Weiter' },
  },
});

// Runtime language switching: push the block again, and SPREAD it first —
// setTranslation merges one level deep, so a bare { aria: { … } } drops
// every key you did not list.
this.primeng.setTranslation({
  aria: {
    ...(this.primeng.translation.aria ?? {}),
    previous: t('optimus.previous'),
    next: t('optimus.next'),
  },
});`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { TabsModule } from '@openng/optimus-ui/tabs';

@Component({
  standalone: true,
  imports: [TabsModule],
  template: \`
    <p-tabs [value]="view()" (valueChange)="view.set($event)">
      <p-tablist [pt]="{ tabList: { 'aria-label': 'Views' } }">
        <p-tab [value]="'a'">A</p-tab>
        <p-tab [value]="'b'">B</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel [value]="'a'">Panel A</p-tabpanel>
        <p-tabpanel [value]="'b'">Panel B</p-tabpanel>
      </p-tabpanels>
    </p-tabs>\`,
})
class HostComponent {
  readonly view = signal('a');
}

describe('tabs', () => {
  it('pairs every tab with its panel and names the real tablist', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    // The role is on an inner div — asserting on <p-tablist> would pass a lie.
    const tablist = host.querySelector('[role="tablist"]')!;
    expect(tablist.getAttribute('aria-label')).toBe('Views');

    for (const tab of Array.from(host.querySelectorAll('[role="tab"]'))) {
      const panel = host.querySelector('#' + tab.getAttribute('aria-controls'));
      expect(panel).not.toBeNull();
      expect(panel!.getAttribute('aria-labelledby')).toBe(tab.id);
    }
  });

  it('does not activate on arrow keys (manual activation is the default)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const [first] = Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));

    first.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(first.getAttribute('aria-selected')).toBe('true');
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
