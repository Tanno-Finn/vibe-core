import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { Scroller, ScrollerModule } from '@openng/optimus-ui/scroller';
import { ButtonModule } from '@openng/optimus-ui/button';
import { scrollBehavior } from '../../../utils/reduced-motion';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

interface Row {
  id: number;
  label: string;
}

/**
 * Guide article: Scroller (Guides, category `library`).
 *
 * Subject: `p-scroller` — a virtual scroller that keeps only a slice of its items
 * in the DOM and fakes the rest with a spacer. The article's main message is the
 * cost of that slice: find-in-page, browse-mode reading, list size and focus all
 * stop at the edge of what is rendered.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-scroller.mjs, Optimus UI 2.0.2):
 *   - Root div: [attr.tabindex]="tabindex" with default 0 (:424, template :1184),
 *     no role, no aria-*, no keydown binding; (scroll) only (:1184).
 *   - Rendered slice: loadedItems = items.slice(first, last) (:516-536); viewport
 *     count ceil(size / itemSize), tolerance ceil(viewport / 2) (:790-803);
 *     last = first + viewport + 2 or 3 x tolerance (:807, :932-938).
 *   - Spacer height = items.length x itemSize (:885-899); content moved by
 *     translate3d (:905). itemSize is never measured.
 *   - getOptions(): index (absolute), count, first, last, even, odd (:1104-1115).
 *   - disabled renders <ng-content> plus the content template with ALL items
 *     (:1220-1225); scrollToIndex(index, behavior = 'auto') (:684);
 *     onScrollIndexChange emits { first, last } on a range change (:988-1003).
 *   - Root pt section bound through pBind (:1184) — attributes set with
 *     Renderer2.setAttribute (openng-optimus-ui-bind.mjs:47).
 *   - Tokens: @openng/optimus-ui-themes/dist/aura/virtualscroller/index.mjs.
 */
@Component({
  selector: 'app-scroller-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, ScrollerModule, ButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'scroller'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A virtual scroller keeps the page fast by keeping most of the list out of it. Everything a browser or a screen
          reader does with a list — find, read, count, keep focus — works only on the part that is there.
        </p>

        <h3>Ten thousand rows, a dozen in the DOM</h3>
        <div class="stage">
          <p-scroller
            [items]="rows"
            [itemSize]="rowSize"
            scrollHeight="240px"
            styleClass="demo-scroller"
            [pt]="plainPt"
            (onScrollIndexChange)="onRange($event)"
          >
            <ng-template #item let-row let-options="options">
              <div class="row" [class.row--odd]="options.odd" [style.height.px]="rowSize">{{ row.label }}</div>
            </ng-template>
          </p-scroller>
          <p class="stage__status">Rendered right now: rows {{ rangeFirst() + 1 }}–{{ rangeLast() }} of {{ rows.length }}.</p>
        </div>
        <p class="src-note">
          Search the page for "Row 10000" before scrolling: the only match is in this sentence, because that row does
          not exist yet. The scroller renders <code>items.slice(first, last)</code> (<code>openng-optimus-ui-scroller.mjs:516-536</code>)
          and stands in for the rest with a spacer of <code>items.length × itemSize</code> (<code>:885-899</code>).
        </p>

        <h3>The same list, with list semantics and a way to jump</h3>
        <div class="stage">
          <div class="jump">
            <label for="sc-jump">Go to row</label>
            <input id="sc-jump" type="number" min="1" [max]="rows.length" [value]="jumpTarget()" (input)="onJumpInput($event)" />
            <p-button label="Go" size="small" severity="secondary" [outlined]="true" (onClick)="jump()" />
          </div>
          <p-scroller #listScroller [items]="rows" [itemSize]="rowSize" scrollHeight="240px" styleClass="demo-scroller" [pt]="listPt">
            <ng-template #content let-items let-options="options">
              <ul role="list" [class]="options.contentStyleClass" [style]="options.contentStyle">
                @for (row of items; track row.id; let i = $index) {
                  <li
                    class="row"
                    [class.row--odd]="options.getItemOptions(i).odd"
                    [style.height.px]="rowSize"
                    [attr.aria-setsize]="rows.length"
                    [attr.aria-posinset]="options.getItemOptions(i).index + 1"
                  >
                    {{ row.label }}
                  </li>
                }
              </ul>
            </ng-template>
          </p-scroller>
        </div>
        <p class="src-note">
          The <code>#content</code> template renders a real <code>ul</code>/<code>li</code> and stamps
          <code>aria-setsize</code> and <code>aria-posinset</code> from <code>getItemOptions(i)</code>, whose
          <code>index</code> is absolute (<code>openng-optimus-ui-scroller.mjs:1104-1115</code>). The scroll container
          is named through <code>pt.root</code>. "Go" calls <code>scrollToIndex</code> with
          <code>scrollBehavior()</code> from <code>src/app/utils/reduced-motion.ts</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>When the slice is worth it</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The list</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>Thousands of uniform rows people scroll, pick or scan (logs, token lists, a big option set)</td><td><code>p-scroller</code></td><td>{{ m.whenScroller }}</td></tr>
              <tr><td>Hundreds of options inside a select or listbox</td><td><code>[virtualScroll]</code> on that component</td><td>{{ m.whenBuiltIn }}</td></tr>
              <tr><td>Text people read or search (glossary, article lists, timelines)</td><td>a plain list, filtered or paginated</td><td>{{ m.whenReading }}</td></tr>
              <tr><td>Items of different heights</td><td>a plain list or pagination</td><td>{{ m.whenVariable }}</td></tr>
              <tr><td>A few hundred simple rows</td><td>a plain list</td><td>{{ m.whenSmall }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The fixed height comes from the spacer and the transform: both are computed from <code>itemSize</code>
          alone (<code>openng-optimus-ui-scroller.mjs:885-914</code>); no row is ever measured.
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a glossary in a virtual scroller</span>
            <div class="dd__stage">
              <p-scroller [items]="terms" [itemSize]="rowSize" scrollHeight="160px" styleClass="demo-scroller" [pt]="termsPt">
                <ng-template #item let-term>
                  <p class="term term--clip" [style.height.px]="rowSize"><strong>{{ term.label }}</strong> — {{ definition }}</p>
                </ng-template>
              </p-scroller>
            </div>
            <p class="dd__why">{{ m.ddBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a plain, searchable list</span>
            <div class="dd__stage">
              <ul class="plain-list" tabindex="0" aria-label="Glossary terms (plain list)">
                @for (term of terms.slice(0, 40); track term.id) {
                  <li class="term"><strong>{{ term.label }}</strong> — {{ definition }}</li>
                }
              </ul>
            </div>
            <p class="dd__why">{{ m.ddGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Left: 400 entries held to <code>itemSize</code> 40, so each definition is cut to one line. Right: the first 40
          of the same entries as ordinary markup in a scrolling box, all of them in the DOM. Search the page for
          "Term 37": it is found on the right only.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-setsize" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA 1.2, aria-setsize and aria-posinset</a>
            — the attributes meant for exactly this case: a set whose members are not all in the DOM.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.3 Focus Order</a>
            — what a focused row that is removed from the DOM breaks.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.5 Multiple Ways</a>
            — why a jump or filter belongs beside a list that find-in-page cannot search.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.1.1 Keyboard</a>
            — the focusable scroll container is what lets keyboard users scroll at all.
          </li>
          <li>
            <code>&#64;openng/optimus-ui</code> 2.0.2 — <code>fesm2022/openng-optimus-ui-scroller.mjs</code>: every behavior
            claim on this page, cited by line.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Tokens</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>What it paints</th></tr>
            </thead>
            <tbody>
              <tr><td><code>virtualscroller.loader.mask.background</code></td><td><code>&#123;content.background&#125;</code></td><td>{{ m.tokMask }}</td></tr>
              <tr><td><code>virtualscroller.loader.mask.color</code></td><td><code>&#123;text.muted.color&#125;</code></td><td>{{ m.tokMaskColor }}</td></tr>
              <tr><td><code>virtualscroller.loader.icon.size</code></td><td><code>2rem</code></td><td>{{ m.tokIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/virtualscroller/index.mjs</code>. Rows have no
          token: their look is entirely your item template. None of these pairs is in
          <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Focus</h3>
        <p>{{ m.focus }}</p>
        <p class="src-note">
          <code>.p-virtualscroller</code> sets <code>outline: 0 none</code> in the component CSS
          (<code>openng-optimus-ui-scroller.mjs:15-22</code>). <code>src/styles.scss</code> lists
          <code>.p-virtualscroller:focus-visible</code> in the one kit ring, inset (offset <code>-2px</code>); the demos
          on this page add no outline of their own.
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>setSize()</code> writes <code>scrollHeight</code> (or the measured height) as an inline height
          (<code>openng-optimus-ui-scroller.mjs:865-884</code>); a window resize re-runs the range calculation only when
          the height changes (<code>:1058-1076</code>). <code>.p-virtualscroller-content</code> is
          <code>position: absolute; min-width: 100%</code> (<code>:24-30</code>). No media query in the component CSS.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs that decide behavior</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>items</code></td><td>—</td><td>{{ m.apiItems }}</td></tr>
              <tr><td><code>itemSize</code></td><td><code>0</code></td><td>{{ m.apiItemSize }}</td></tr>
              <tr><td><code>scrollHeight</code> / <code>scrollWidth</code></td><td>—</td><td>{{ m.apiScrollHeight }}</td></tr>
              <tr><td><code>orientation</code></td><td><code>'vertical'</code></td><td>{{ m.apiOrientation }}</td></tr>
              <tr><td><code>numToleratedItems</code></td><td>half a viewport</td><td>{{ m.apiTolerated }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.apiTabindex }}</td></tr>
              <tr><td><code>lazy</code>, <code>step</code>, <code>loading</code></td><td><code>false</code>, <code>0</code>, —</td><td>{{ m.apiLazy }}</td></tr>
              <tr><td><code>showLoader</code>, <code>delay</code></td><td><code>false</code>, <code>0</code></td><td>{{ m.apiLoader }}</td></tr>
              <tr><td><code>appendOnly</code></td><td><code>false</code></td><td>{{ m.apiAppendOnly }}</td></tr>
              <tr><td><code>disabled</code></td><td><code>false</code></td><td>{{ m.apiDisabled }}</td></tr>
              <tr><td><code>trackBy</code></td><td>item identity</td><td>{{ m.apiTrackBy }}</td></tr>
              <tr><td>outputs</td><td>—</td><td>{{ m.apiOutputs }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Setters and defaults at <code>openng-optimus-ui-scroller.mjs:148-446</code>; outputs <code>:405-417</code>;
          the compiled input list at <code>:1130</code>. <code>dt</code>, <code>unstyled</code>, <code>pt</code> and
          <code>ptOptions</code> are inherited from <code>BaseComponent</code>.
        </p>

        <h3>What assistive technology gets</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Need</th><th>Shipped</th><th>What you add</th></tr>
            </thead>
            <tbody>
              <tr><td>A name and role for the scroll box</td><td>{{ m.atNameShip }}</td><td>{{ m.atNameAdd }}</td></tr>
              <tr><td>List semantics and size</td><td>{{ m.atListShip }}</td><td>{{ m.atListAdd }}</td></tr>
              <tr><td>Keyboard scrolling</td><td>{{ m.atKeysShip }}</td><td>{{ m.atKeysAdd }}</td></tr>
              <tr><td>Focus on a row</td><td>{{ m.atFocusShip }}</td><td>{{ m.atFocusAdd }}</td></tr>
              <tr><td>Find-in-page, browse-mode reading</td><td>{{ m.atFindShip }}</td><td>{{ m.atFindAdd }}</td></tr>
              <tr><td>Loading state</td><td>{{ m.atLoadShip }}</td><td>{{ m.atLoadAdd }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Root template <code>openng-optimus-ui-scroller.mjs:1184</code> (tabindex, class, scroll listener, pBind —
          nothing else); the loader is an SVG spinner with no text (<code>:1214</code>). The removal of rows is the
          <code>&#64;for</code> over <code>loadedItems</code> (<code>:1189</code>).
        </p>

        <h3>Recipe: list semantics through the content template</h3>
        <pre class="code-block"><code>{{ listSnippet }}</code></pre>

        <h3>Recipe: jump to a row</h3>
        <pre class="code-block"><code>{{ jumpSnippet }}</code></pre>
        <p class="src-note">
          <code>scrollToIndex(index, behavior = 'auto')</code> (<code>openng-optimus-ui-scroller.mjs:684</code>) passes the
          behavior to <code>scrollTo</code>. An explicit <code>'smooth'</code> overrides the kit's reduced-motion CSS,
          so ask <code>scrollBehavior()</code>.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkNeed }}</li>
          <li>{{ m.checkSize }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkList }}</li>
          <li>{{ m.checkFind }}</li>
          <li>{{ m.checkFocus }}</li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the last focus round: the kit ring now lists
            <code>.p-virtualscroller:focus-visible</code> (inset), so the container's outline is no longer yours to draw.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the container's own outline
            is still yours, and now named as the kit ring's values (the kit's ring list leaves the container out).
          </li>
          <li><strong>1.0</strong> — 2026-09-23 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-scroller-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }
      app-scroller-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      app-scroller-article .stage__status {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      app-scroller-article .demo-scroller,
      app-scroller-article .plain-list {
        border: 1px solid var(--control-border);
      }
      app-scroller-article .plain-list:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      app-scroller-article ul.p-virtualscroller-content,
      app-scroller-article .plain-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      app-scroller-article .plain-list {
        max-height: 160px;
        overflow: auto;
      }
      app-scroller-article .row {
        display: flex;
        align-items: center;
        padding: 0 0.75rem;
        box-sizing: border-box;
      }
      app-scroller-article .row--odd {
        background: var(--surface-section);
      }
      app-scroller-article .demo-scroller .p-virtualscroller-content {
        width: 100%;
      }
      app-scroller-article .term {
        margin: 0;
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
        box-sizing: border-box;
      }
      app-scroller-article .term--clip {
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-block: 0;
      }
      app-scroller-article .jump {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }
      app-scroller-article .jump input {
        width: 7rem;
        padding: 0.3rem 0.5rem;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        color: var(--text-color);
        font: inherit;
      }
      app-scroller-article code,
      app-scroller-article .code-block {
        font-family: var(--font-mono);
        font-size: 0.85em;
      }
      app-scroller-article .src-note {
        max-width: 46rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 1.2rem;
      }
      app-scroller-article .code-block {
        margin: 0 0 1rem;
        padding: 1rem;
        overflow-x: auto;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        line-height: 1.55;
      }
      app-scroller-article .table-wrap {
        overflow-x: auto;
        margin: 0 0 1rem;
      }
      app-scroller-article table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      app-scroller-article th,
      app-scroller-article td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      app-scroller-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }
      app-scroller-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        min-width: 0;
      }
      app-scroller-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }
      app-scroller-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }
      app-scroller-article .dd__stage {
        padding: 0.75rem;
        background: var(--surface-section);
      }
      app-scroller-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      app-scroller-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }
      app-scroller-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }
      app-scroller-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }
      app-scroller-article .sources a,
      app-scroller-article .history strong {
        color: var(--primary-color-fg);
      }
      app-scroller-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }
      @media (max-width: 640px) {
        app-scroller-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ScrollerArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly rowSize = 40;
  readonly rows: Row[] = Array.from({ length: 10000 }, (_, i) => ({ id: i, label: 'Row ' + (i + 1) }));
  readonly terms: Row[] = Array.from({ length: 400 }, (_, i) => ({ id: i, label: 'Term ' + (i + 1) }));
  readonly definition =
    'a synthetic glossary definition, long enough to wrap onto a second or third line in a narrow column, the way real definitions do.';

  readonly plainPt = { root: { 'aria-label': 'Ten thousand rows (plain)', role: 'region' } };
  readonly listPt = { root: { 'aria-label': 'Ten thousand rows (list)', role: 'region' } };
  readonly termsPt = { root: { 'aria-label': 'Glossary terms (virtual)', role: 'region' } };

  readonly rangeFirst = signal(0);
  readonly rangeLast = signal(12);
  readonly jumpTarget = signal(5000);
  private readonly listScroller = viewChild<Scroller>('listScroller');

  onRange(event: { first: number | { rows: number }; last: number | { rows: number } }): void {
    const first = typeof event.first === 'number' ? event.first : event.first.rows;
    const last = typeof event.last === 'number' ? event.last : event.last.rows;
    this.rangeFirst.set(first);
    this.rangeLast.set(last);
  }

  onJumpInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value)) this.jumpTarget.set(value);
  }

  jump(): void {
    const index = Math.min(Math.max(1, Math.round(this.jumpTarget())), this.rows.length) - 1;
    this.listScroller()?.scrollToIndex(index, scrollBehavior());
  }

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage
    whenScroller:
      'Rendering cost grows with the DOM, and a few thousand rows of real components make a page stutter. When every row is the same height and nobody needs to search the page for one, the slice buys speed at an accessibility price you can pay down.',
    whenBuiltIn:
      'Select, listbox, multiselect, tree and table embed this same scroller behind a flag and handle the option semantics themselves; their guides cover it.',
    whenReading:
      'Find-in-page sees only rendered rows, and a screen reader in browse mode reads the DOM it is given. Readers search glossaries with Ctrl+F; give them all the text, and narrow it with a filter or pages instead.',
    whenVariable:
      'itemSize is one number for every row. The spacer and the content offset are computed from it and no row is ever measured, so a row of another height lands in the wrong place and the scroll range stops matching the content.',
    whenSmall:
      'A few hundred text rows are cheap for a browser. The slice would cost search, reading and focus stability for a speed-up nobody notices.',

    ddBadWhy:
      'One fixed row height forces every definition onto one clipped line, and only the dozen or so entries around the viewport exist: find-in-page misses the rest, and the text a reader came for is cut off in the ones it does show.',
    ddGoodWhy:
      'Every entry is in the DOM, so Ctrl+F finds "Term 37", a screen reader reads straight through, and each paragraph takes the height it needs. At glossary scale this costs nothing measurable.',

    // design
    tokMask: 'The overlay behind the loading spinner, only with showLoader and while loading.',
    tokMaskColor: 'The spinner color on that overlay.',
    tokIcon: 'Spinner size.',
    focus:
      'The scroll container is a Tab stop by default and its component CSS removes the outline. The kit’s one focus ring lists .p-virtualscroller:focus-visible, so a keyboard user who tabs in sees 2px of --primary-color-fg drawn inside the container — inside, because inside a select overlay or a table the scroller fills a clipping box edge to edge. The ring lies on the rows it scrolls; the "focus ring" rows of docs/generated/CONTRAST.MD measure it at 3.48:1 and up (SC 1.4.11 asks 3:1). Add no outline of your own.',
    narrow:
      'No intrinsic responsive behavior. Height is whatever scrollHeight says, written inline, at every viewport; the container’s width follows the parent. The content box inside is absolutely positioned with min-width: 100%, so a row that is too long for a narrow column does not wrap: it widens the content and the list scrolls sideways. Give the content box width: 100% (the demos here do) and keep each row to one line with an ellipsis; a wrapped row would break the fixed itemSize anyway. To change itemSize for a narrow layout, re-create the scroller — its resize listener re-runs the range calculation only when the height changes.',

    // development — inputs
    apiItems: 'The whole array. Only a slice of it is rendered at a time.',
    apiItemSize:
      'Required: the fixed height (vertical), width (horizontal) or [height, width] (both) of one item, in px. Never measured; the spacer is items.length × itemSize.',
    apiScrollHeight: 'The viewport size, written inline. "100%" makes the host fill its parent.',
    apiOrientation: "'vertical', 'horizontal' or 'both' (a 2-D grid of rows × columns).",
    apiTolerated: 'Extra items rendered around the viewport, ceil(viewport / 2) by default. More means smoother fast scrolling, a bigger DOM, a larger find-in-page window.',
    apiTabindex: 'On the scroll container. Keep it: without it a keyboard user cannot scroll a list with no focusable rows.',
    apiLazy: 'lazy emits onLazyLoad(first, last) and lets you fill items as the user scrolls; step sets the page size, loading shows the loader.',
    apiLoader: 'A loading overlay while delay (ms) debounces the range update. The default loader is an unlabeled spinner.',
    apiAppendOnly: 'Keeps every row rendered so far — the DOM only grows. Find-in-page then works behind the user, never ahead.',
    apiDisabled: 'Turns virtualization off: projected content and the content template render with all items. An honest "show all" or print path.',
    apiTrackBy: 'Row identity for the @for. Pass one when items are rebuilt, or every scroll re-creates rows.',
    apiOutputs: 'onScroll (every scroll event), onScrollIndexChange ({ first, last } on a range change), onLazyLoad.',

    // development — AT
    atNameShip: 'A div with tabindex="0" and no role or name.',
    atNameAdd: "pt: { root: { 'aria-label': …, role: 'region' } } — the name a user hears on tabbing in.",
    atListShip: 'Plain divs, no list role and no size: a screen reader can count only the dozen or so rows rendered.',
    atListAdd: 'A #content template with ul/li, aria-setsize = items.length and aria-posinset = getItemOptions(i).index + 1. Support for these on list items varies by screen reader; test yours.',
    atKeysShip: 'Browser-native: arrows, Page Up/Down, Home/End scroll the focused container.',
    atKeysAdd: 'Nothing, as long as the container keeps its tabindex (the kit ring shows its focus).',
    atFocusShip: 'A focused row that scrolls out of the slice is destroyed, and focus falls back to the document body.',
    atFocusAdd: 'Avoid focusable rows. If rows must act, keep focus on the container and move a highlight (aria-activedescendant), as listbox does.',
    atFindShip: 'Only rendered rows exist for Ctrl+F. A screen reader in browse mode reads the rendered rows; whether moving past the last one scrolls the container and renders more depends on the screen reader and browser.',
    atFindAdd: 'A filter or a jump-to control beside the list (SC 2.4.5), or no virtualization.',
    atLoadShip: 'A spinner SVG with no text and no live region.',
    atLoadAdd: 'A polite live region that says what is loading, fed from your lazy-load handler.',

    checkNeed: 'Confirm the list is long and uniform enough to need a slice; for reading and searching content, it is not.',
    checkSize: 'Give every row exactly itemSize of height, box-sizing included, and keep text to one line.',
    checkName: 'Name the scroll container through pt.root; leave its focus ring to the kit.',
    checkList: 'Render list semantics with aria-setsize and aria-posinset from getItemOptions().',
    checkFind: 'Offer a filter or jump-to control, because find-in-page sees only the slice.',
    checkFocus: 'Keep interactive controls out of the rows, or manage focus on the container.',
  };

  readonly listSnippet =
    '<p-scroller [items]="rows" [itemSize]="40" scrollHeight="240px"\n' +
    '            [pt]="{ root: { \'aria-label\': labels().rows, role: \'region\' } }">\n' +
    '  <ng-template #content let-items let-options="options">\n' +
    '    <!-- keep contentStyleClass: the scroller finds its content box by that class -->\n' +
    '    <ul role="list" [class]="options.contentStyleClass" [style]="options.contentStyle">\n' +
    '      @for (row of items; track row.id; let i = $index) {\n' +
    '        <li [style.height.px]="40"\n' +
    '            [attr.aria-setsize]="rows.length"\n' +
    '            [attr.aria-posinset]="options.getItemOptions(i).index + 1">{{ row.label }}</li>\n' +
    '      }\n' +
    '    </ul>\n' +
    '  </ng-template>\n' +
    '</p-scroller>';

  readonly jumpSnippet =
    'import { scrollBehavior } from "../../utils/reduced-motion";\n' +
    '\n' +
    'private readonly scroller = viewChild(Scroller);\n' +
    '\n' +
    'jumpTo(rowNumber: number): void {\n' +
    '  // zero-based index; "smooth" only when the user has not asked for reduced motion\n' +
    '  this.scroller()?.scrollToIndex(rowNumber - 1, scrollBehavior());\n' +
    '}';
}
