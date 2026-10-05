import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PaginatorModule } from '@openng/optimus-ui/paginator';
import type { PaginatorState } from '@openng/optimus-ui/types/paginator';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, PaginatorModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-paginator-article .stage {
        padding: 1rem;
        background: var(--surface-section);
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-paginator-article .stage--col {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        align-items: stretch;
      }

      app-paginator-article .slice {
        margin: 0;
        padding-inline-start: 1.2rem;
        columns: 2;
        font-size: 0.9rem;
      }

      app-paginator-article .hint {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-paginator-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      app-paginator-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      app-paginator-article .dd__stage {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 4.5rem;
      }

      app-paginator-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-paginator-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-paginator-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-paginator-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-paginator-article .checklist,
      app-paginator-article .history {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-paginator-article .dd {
          grid-template-columns: 1fr;
        }

        app-paginator-article .slice {
          columns: 1;
        }
      }
    `;

/**
 * Guide article: Paginator (Guides, category `library`).
 *
 * The standalone page bar, and the same component `p-table` and `p-dataview`
 * embed. Every claim below was read off the shipped source of Optimus UI 2.0.2;
 * `openng-optimus-ui-paginator.mjs` (919 lines) is the fesm2022 flat bundle.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - No layout/`template` input exists: the compiled input list (:533) names 21
 *     inputs, none of them a layout string, and the slot order is fixed in the
 *     inline template (:534-671) — left slot, current-page report, First, Prev,
 *     page links, jump-to-page select, Next, Last, jump-to-page input,
 *     rows-per-page select, right slot.
 *   - Host bindings are `class` and `style.display` only (:533). No `nav`, no
 *     `role`, no `aria-live` anywhere in the bundle.
 *   - Nav buttons are `<button type="button">` with `[attr.aria-label]` from
 *     `getAriaLabel(…)` (:543 first, :554 prev, :608 next, :619 last), which
 *     reads `config.translation.aria[key]` (:366-368).
 *   - Page links carry `aria-current="page"` when active (:572) and their
 *     `aria-label` comes from `getPageAriaLabel` (:369-371) → `aria.pageLabel`,
 *     whose config default is the bare `'{page}'`
 *     (openng-optimus-ui-config.mjs:198).
 *   - Visible page digits go through `getLocalization` (:372-383), which maps
 *     them with `Intl.NumberFormat(this.locale)`; the aria-label does not.
 *   - The First button binds no `[disabled]` (:543) — only the `p-disabled`
 *     class (:25-30); `changePageToFirst` guards with `isFirstPage()` (:478-483).
 *     Prev/Next/Last do bind `[disabled]` (:554, :608, :619).
 *   - `jumpToPageInputLabel` exists in the config (:206 of the config bundle) but
 *     the `p-inputnumber` binds no `ariaLabel` (:630-639), and the key appears in
 *     no other bundle of the package.
 *   - `currentPageReport` getter (:523-531) replaces exactly six placeholders,
 *     each with a string pattern, so each is substituted once.
 *   - `changePage` emits `{ page, first, rows, pageCount }` (:454-468); no
 *     `firstChange`/`rowsChange` output is declared (:533).
 *   - Defaults: `pageLinkSize` 5 (:172), `alwaysShow` true (:183),
 *     `currentPageReportTemplate` '{currentPage} of {totalPages}' (:213),
 *     `showFirstLastIcon` true (:223), `totalRecords` 0 (:228), `rows` 0 (:233),
 *     `showPageLinks` true (:260).
 *   - `getPageCount()` = `Math.ceil(totalRecords / rows)` (:429-431);
 *     `getPage()` = `Math.floor(first / rows)` (:475-477); `empty()` compares the
 *     count to 0 (:517-519); `currentPage()` returns 0 when empty (:520-522).
 *   - `updateFirst()` steps back one page in a microtask (:469-474).
 *   - `rowsPerPageOptions` → `updateRowsPerPageOptions` (:406-422): labels pass
 *     through `getLocalization`, a `{showAll}` entry takes `totalRecords` as its
 *     value. The select is bound `[(ngModel)]="rows"` (:641-655).
 *   - `p-table` forwards 21 bindings to its embedded paginator, 19 of them paginator
 *     inputs plus the inherited pt/unstyled (openng-optimus-ui-table.mjs:3104-3128);
 *     `p-dataview` forwards 19 and omits
 *     `showJumpToPageInput` and `locale` (openng-optimus-ui-dataview.mjs:487-508).
 *   - Tokens from `@openng/optimus-ui-themes/dist/aura/paginator/index.mjs`
 *     (single-line dist bundle, cited by export name): root padding 0.5rem 1rem,
 *     gap 0.25rem; navButton width/height 2.5rem, borderRadius 50%, color
 *     `{text.muted.color}`, selectedBackground `{highlight.background}`, focusRing
 *     from the global `{focus.ring.*}` group; currentPageReport color
 *     `{text.muted.color}`; jumpToPageInput maxWidth 2.5rem.
 *   - `.p-paginator` is `display:flex` with `flex-wrap: wrap`
 *     (`@openng/optimus-ui-styles/dist/paginator/index.mjs`), and the
 *     `:focus-visible` rule covers page/first/prev/next/last.
 *   - `docs/generated/CONTRAST.MD` "table & paginator" measures the bar:
 *     the kit paints it --surface-card and gives the current page the accent's
 *     own pair (primary.color / primary.contrast.color, styles.scss); the idle
 *     glyph stays Aura's {text.muted.color}. Its buttons wear the kit's one
 *     focus ring, measured on paginator.background ("focus ring").
 *   - The kit's `syncAriaStrings` (src/app/services/optimus-a11y.service.ts) pushes
 *     OPTIMUS_ARIA_KEYS in the page language; all seven paginator keys are in it,
 *     pageLabel as a phrase ('Page {page}').
 */
@Component({
  selector: 'app-paginator-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'paginator'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          The paginator renders a row of buttons and emits a page. It never renders the collection, never fetches
          anything and never says out loud that the page changed — everything below is that one row with different
          props, plus the parts a caller has to bring.
        </p>

        <h3>The everyday shape, wired end to end</h3>
        <div class="stage stage--col">
          <ul class="slice">
            @for (item of visible(); track item) {
              <li>{{ item }}</li>
            }
          </ul>
          <nav aria-label="Sample records">
            <p-paginator
              [rows]="rows()"
              [first]="first()"
              [totalRecords]="total"
              [rowsPerPageOptions]="[5, 10, 20]"
              [showCurrentPageReport]="true"
              [currentPageReportTemplate]="m.reportWired"
              (onPageChange)="onPage($event)"
            />
          </nav>
          <p class="sr-only" aria-live="polite">{{ announcement() }}</p>
          <p class="hint">
            Live read-out — first: <code>{{ first() }}</code
            >, rows: <code>{{ rows() }}</code
            >, page: <code>{{ page() }}</code
            >. The polite region above is this page's, not the component's; change a page and a screen reader hears
            “{{ announcement() }}”.
          </p>
        </div>
        <p class="hint">{{ m.exWiredNote }}</p>

        <h3>The report placeholders, all six of them</h3>
        <div class="stage stage--col">
          <p-paginator
            [rows]="6"
            [first]="12"
            [totalRecords]="40"
            [showCurrentPageReport]="true"
            [showPageLinks]="false"
            [currentPageReportTemplate]="m.reportAllSix"
          />
        </div>
        <p class="src-note">
          The six names above are the complete set; the getter substitutes each of them once
          (<code>openng-optimus-ui-paginator.mjs:523-531</code>). A seventh name renders as itself.
        </p>

        <h3>Two states worth seeing before you ship them</h3>
        <div class="stage stage--col">
          <p class="hint">{{ m.exEmptyLabel }}</p>
          <p-paginator [rows]="10" [totalRecords]="0" [showCurrentPageReport]="true" />
          <p class="hint">{{ m.exSingleLabel }}</p>
          <p-paginator [rows]="10" [totalRecords]="4" [alwaysShow]="false" />
        </div>
        <p class="src-note">
          Empty is <code>empty()</code>, the page count compared to zero (<code>:517-519</code>); the vanished bar is
          the <code>display</code> host binding under <code>alwaysShow: false</code> (<code>:336-338</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          There are two paginators in this library and they are the same component. The question is never which one to
          use, but who owns the list: if a library renders the rows, it also renders the bar.
        </p>

        <h3>Standalone or embedded</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The collection is rendered by</th>
                <th>Reach for</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Your own template — cards, a list, a report</td>
                <td><code>p-paginator</code> standalone</td>
                <td>Nothing else knows the record count or where the slice starts.</td>
              </tr>
              <tr>
                <td><code>p-table</code></td>
                <td><code>[paginator]="true"</code> on the table</td>
                <td>The table already embeds this component and forwards twenty-one bindings to it (nineteen paginator inputs plus the inherited <code>pt</code> and <code>unstyled</code>).</td>
              </tr>
              <tr>
                <td><code>p-dataview</code></td>
                <td><code>[paginator]="true"</code> on the view</td>
                <td>Same component again, minus the jump-to-page input and the digit locale.</td>
              </tr>
              <tr>
                <td>A stream with no end</td>
                <td>A “load more” button</td>
                <td>Pages need a total; a feed has none.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The two embeddings and their forwarded inputs:
          <code>openng-optimus-ui-table.mjs:3104-3128</code> and
          <code>openng-optimus-ui-dataview.mjs:487-508</code>.
        </p>

        <h3>Give the bar a landmark and a voice</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the bare component, alone on the page</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [first]="20" [totalRecords]="80" />
            </div>
            <p class="dd__why">{{ m.ddNavBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a named nav around it and a polite region beside it</span>
            <div class="dd__stage">
              <nav aria-label="Search results">
                <p-paginator [rows]="10" [first]="20" [totalRecords]="80" />
              </nav>
              <p class="hint">plus <code>&lt;p class="sr-only" aria-live="polite"&gt;</code> you write on page change</p>
            </div>
            <p class="dd__why">{{ m.ddNavGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The bundle contains no <code>nav</code>, no <code>role</code> and no <code>aria-live</code>; the host's only
          bindings are <code>class</code> and <code>style.display</code>
          (<code>openng-optimus-ui-paginator.mjs:533</code>).
        </p>

        <h3>Never let First be the only way back</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — page links off, First as the reset</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [totalRecords]="80" [showPageLinks]="false" />
            </div>
            <p class="dd__why">{{ m.ddFirstBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — page links on, so page one is a link with a state</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [totalRecords]="80" />
            </div>
            <p class="dd__why">{{ m.ddFirstGood }}</p>
          </div>
        </div>
        <p class="src-note">
          On page one the First button carries the <code>p-disabled</code> class (<code>:25-30</code>) and no
          <code>[disabled]</code> attribute (<code>:543</code>), unlike Prev, Next, and Last (<code>:554</code>,
          <code>:608</code>, <code>:619</code>). Verify in the browser's accessibility tree: on page one the First
          button must be reported disabled, and today it is not.
        </p>

        <h3>Annotated source — the shape to copy</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-current" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — <code>aria-current</code></a
            >
            — why the current page link carries <code>page</code>, and why only one link may.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-changes.html" target="_blank" rel="noopener noreferrer"
              >WCAG 2.2 — SC 4.1.3 Status Messages</a
            >
            — a page swap that moves no focus still owes an announcement; the polite region above is that.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/"
              target="_blank"
              rel="noopener noreferrer"
              >W3C APG — Landmark Regions</a
            >
            — the named <code>nav</code> the component leaves to you.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The bar's geometry is the Aura preset's, and no visual style block touches it; only the root's corner radius
          (<code>&#123;content.border.radius&#125;</code>) follows the style. Its colors are the kit's business in three
          places, all in <code>src/styles.scss</code> and all measured by the contrast gate: the bar paints the style's
          <code>--surface-card</code>, the current page takes the accent's own filled pair, and every button wears the
          kit's one focus ring.
        </p>

        <h3>Aura tokens the bar is built from</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Paginator token defaults, Aura preset
            </caption>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>What it sizes or colors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>root.padding</code> / <code>root.gap</code></td>
                <td>{{ m.tokenRoot }}</td>
                <td>The band around the row, and the space between buttons</td>
              </tr>
              <tr>
                <td><code>navButton.width</code> / <code>height</code></td>
                <td>{{ m.tokenNavBox }}</td>
                <td>Every button in the row — the pointer target</td>
              </tr>
              <tr>
                <td><code>navButton.borderRadius</code></td>
                <td>{{ m.tokenNavRadius }}</td>
                <td>The round button chip</td>
              </tr>
              <tr>
                <td><code>navButton.color</code> / <code>selectedBackground</code></td>
                <td>{{ m.tokenNavColor }}</td>
                <td>Idle glyph color, and the fill behind the current page</td>
              </tr>
              <tr>
                <td><code>navButton.focusRing.*</code></td>
                <td>{{ m.tokenFocus }}</td>
                <td>Aura's ring, which the kit's one ring replaces on every button</td>
              </tr>
              <tr>
                <td><code>jumpToPageInput.maxWidth</code></td>
                <td>{{ m.tokenJump }}</td>
                <td>The number field under <code>showJumpToPageInput</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from <code>&#64;openng/optimus-ui-themes/dist/aura/paginator/index.mjs</code>; the
          rules that consume them, including the <code>:focus-visible</code> selector list, from
          <code>&#64;openng/optimus-ui-styles/dist/paginator/index.mjs</code>.
        </p>

        <h3>On a narrow screen the row wraps — it never scrolls and never truncates</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          <code>.p-paginator</code> is <code>display: flex</code> with <code>flex-wrap: wrap</code> and
          <code>justify-content: center</code> (<code>&#64;openng/optimus-ui-styles/dist/paginator/index.mjs</code>);
          the arithmetic uses the <code>navButton</code> and <code>root.gap</code> values from the table above.
        </p>

        <h3>What the contrast compilat measures here</h3>
        <p>{{ m.contrastGap }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, groups "table &amp; paginator" (the bar, the idle glyph, the current
          page) and "focus ring" (the ring on <code>paginator.background</code>); the fill and the current-page pair
          are re-pointed in the <code>.p-paginator</code> block of <code>src/styles.scss</code>, the ring comes from the
          kit's one ring list there.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Four numbers drive everything: <code>first</code>, <code>rows</code>, <code>totalRecords</code> and
          <code>pageLinkSize</code>. Three of them have defaults that do not work, and the component owns none of them
          for longer than a click.
        </p>

        <h3>Inputs and their shipped defaults</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>rows</code></td>
                <td><code>0</code></td>
                <td>Page size. Every page computation divides by it, so leaving it unset is not a default.</td>
              </tr>
              <tr>
                <td><code>totalRecords</code></td>
                <td><code>0</code></td>
                <td>The count the page math is derived from. Zero means the whole bar is inert but visible.</td>
              </tr>
              <tr>
                <td><code>first</code></td>
                <td><code>0</code></td>
                <td>Zero-based row offset — not a page index.</td>
              </tr>
              <tr>
                <td><code>pageLinkSize</code></td>
                <td><code>5</code></td>
                <td>How many numbered links show; the current page is kept near the middle.</td>
              </tr>
              <tr>
                <td><code>alwaysShow</code></td>
                <td><code>true</code></td>
                <td>Keeps the bar for a single page; <code>false</code> sets <code>display: none</code>.</td>
              </tr>
              <tr>
                <td><code>showFirstLastIcon</code> / <code>showPageLinks</code></td>
                <td><code>true</code> / <code>true</code></td>
                <td>The two flags that decide how wide the row gets.</td>
              </tr>
              <tr>
                <td><code>currentPageReportTemplate</code></td>
                <td><code>{{ m.reportDefault }}</code></td>
                <td>English prose with a placeholder in it — not a translation key.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declaration order in the bundle: <code>openng-optimus-ui-paginator.mjs:172</code>, <code>:183</code>,
          <code>:213</code>, <code>:223</code>, <code>:228</code>, <code>:233</code>, <code>:260</code>; <code>first</code> has no
          initializer on the input, its <code>0</code> comes from <code>_first = 0</code> at <code>:331</code>.
        </p>

        <h3>The write-back contract</h3>
        <p>{{ m.writeBack }}</p>
        <pre class="code-block"><code>{{ eventSnippet }}</code></pre>
        <p class="src-note">
          The emitted object is built in <code>changePage</code> (<code>:454-468</code>). The compiled output list
          declares <code>onPageChange</code> and nothing else (<code>:533</code>), which is why no two-way form of
          <code>first</code> or <code>rows</code> exists.
        </p>

        <h3>The slot order is not configurable</h3>
        <p>{{ m.slotOrder }}</p>
        <p class="src-note">
          Read off the inline template (<code>openng-optimus-ui-paginator.mjs:534-671</code>); the compiled input list
          at <code>:533</code> contains no layout input.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>{{ m.ck1 }}</li>
          <li>{{ m.ck2 }}</li>
          <li>{{ m.ck3 }}</li>
          <li>{{ m.ck4 }}</li>
          <li>{{ m.ck5 }}</li>
          <li>{{ m.ck6 }}</li>
          <li>{{ m.ck7 }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Not one string in this component comes from your template. Every button name is read from the shared Optimus
          config at render time — which the kit fills in the page language — and the page report is an English
          sentence with a placeholder in it, which only your binding can translate.
        </p>

        <h3>Where each string comes from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What is spoken or shown</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First / Previous / Next / Last button names</td>
                <td>
                  Config <code>aria</code>: <code>firstPageLabel</code>, <code>prevPageLabel</code>,
                  <code>nextPageLabel</code>, <code>lastPageLabel</code>
                </td>
              </tr>
              <tr>
                <td>Page link name</td>
                <td>Config <code>aria.pageLabel</code> — default is the bare number</td>
              </tr>
              <tr>
                <td>Rows-per-page select name</td>
                <td>Config <code>aria.rowsPerPageLabel</code></td>
              </tr>
              <tr>
                <td>Jump-to-page select name</td>
                <td>Config <code>aria.jumpToPageDropdownLabel</code></td>
              </tr>
              <tr>
                <td>Jump-to-page input name</td>
                <td>Nothing — the key exists and no component reads it</td>
              </tr>
              <tr>
                <td>The current-page report</td>
                <td>Your <code>currentPageReportTemplate</code> binding</td>
              </tr>
              <tr>
                <td>The <code>showAll</code> label in the rows options</td>
                <td>Your literal, inside the options array</td>
              </tr>
              <tr>
                <td>Visible page digits</td>
                <td><code>Intl.NumberFormat</code> under the <code>locale</code> input</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The seven keys and their English defaults sit in the shared <code>aria</code> block
          (<code>openng-optimus-ui-config.mjs:176-210</code>); the component reads them through
          <code>getAriaLabel</code> and <code>getPageAriaLabel</code>
          (<code>openng-optimus-ui-paginator.mjs:366-371</code>).
        </p>

        <h3>What the kit already hands over</h3>
        <p>{{ m.i18nGap }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>syncAriaStrings</code> and <code>OPTIMUS_ARIA_KEYS</code> in
          <code>src/app/services/optimus-a11y.service.ts</code>; the strings in
          <code>src/assets/i18n/modules/&lt;locale&gt;/optimus.json</code>. Extend the list, do not replace the call:
          <code>setTranslation</code> merges one level deep, so the <code>aria</code> block has to be spread before the
          keys are added.
        </p>

        <h3>Two things a language switch will not fix</h3>
        <ul class="checklist">
          <li>{{ m.i18nDigit }}</li>
          <li>{{ m.i18nReport }}</li>
        </ul>
        <p class="src-note">
          The digit split is <code>getLocalization</code> against the raw value in
          <code>getPageAriaLabel</code> (<code>openng-optimus-ui-paginator.mjs:369-383</code>); the report default is
          the string literal at <code>:213</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the bar paints
            <code>--surface-card</code>, the current page takes the accent's filled pair and every button the kit's one
            ring, all cited from CONTRAST.MD; the seven aria keys are now pushed by the kit in the page language.
          </li>
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line citations hold except the rows-per-page write-back (<code>:644</code>, not <code>:643</code>); the
            nav-button color token corrected (selected text is <code>highlight.color</code>); idle and current-page
            ratios added from the tokens; stated that no style block touches the bar; annotated Sources close Usage;
            agent doc trimmed.
          </li>
          <li><strong>v1.0</strong> — 2026-09-07 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class PaginatorArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** A stand-in collection for the wired example. */
  protected readonly records = Array.from({ length: 47 }, (_, i) => 'Record ' + String(i + 1));
  readonly total = this.records.length;

  readonly first = signal(0);
  readonly rows = signal(5);
  readonly announcement = signal('');
  readonly page = computed(() => Math.floor(this.first() / this.rows()) + 1);
  readonly visible = computed(() => this.records.slice(this.first(), this.first() + this.rows()));

  /** Every field of PaginatorState is optional in the type; the emitter fills all four (:454-468). */
  onPage(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? this.rows());
    this.announcement.set('Page ' + String((event.page ?? 0) + 1) + ' of ' + String(event.pageCount ?? 1));
  }

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    exWiredNote:
      'The slice, the read-out, and the announcement are all this page. The component contributed the row of buttons and one event; it did not touch the list, and it did not speak.',
    exEmptyLabel:
      'Nothing to page: totalRecords is 0, so Prev, Next, and Last are disabled, no page links render, and the report says 0 of 0 — while the bar itself stays on screen.',
    exSingleLabel:
      'One page only, with alwaysShow set to false: the host takes display none and the bar disappears entirely.',
    ddNavBad:
      'A screen-reader user meets an unlabeled group of buttons with no landmark to jump to and no way to tell which list it pages; after a click nothing is announced, because the component owns no live region.',
    ddNavGood:
      'The nav gives the bar a name and a landmark stop, and the polite region turns a silent DOM swap into a sentence. Both are yours to write: the library ships neither.',
    ddFirstBad:
      'Without page links, First is the only route back to the start — and on page one it is the one button that stays focusable and reports itself as enabled, so the keyboard user is told an action is available that does nothing.',
    ddFirstGood:
      'The numbered links give page one a target that carries aria-current, and Prev genuinely disables itself at the boundary. Keep First as a shortcut, never as the only path.',
    tokenRoot: '0.5rem 1rem padding, 0.25rem gap',
    tokenNavBox: '2.5rem min-width × 2.5rem height (40 × 40 px for one or two digits; wider pages grow)',
    tokenNavRadius: '50% — a circle',
    tokenNavColor:
      '{text.muted.color} idle; Aura: {highlight.color} on {highlight.background} for the current page — the kit re-points it to primary.color with primary.contrast.color',
    tokenFocus:
      'the global {focus.ring.*} group (1px) — the kit replaces it: 2px --primary-color-fg at a 2px offset',
    tokenJump: '2.5rem max-width',
    reportDefault: '{currentPage} of {totalPages}',
    reportWired: 'Records {first} to {last} of {totalRecords}',
    reportAllSix: 'page {currentPage}/{totalPages} · rows {rows} · {first}–{last} of {totalRecords}',
    responsive:
      'The bar is a wrapping flex row centered in its container: it reflows onto a second and third line and nothing is ever hidden, clipped, or scrolled. The default set — First, Prev, five page links, Next, Last — is nine 2.5rem buttons plus eight 0.25rem gaps, so it needs 24.5rem (392px) of content width and wraps below that; a rows-per-page select or a page report pushes the threshold higher. If a single line matters at 360px, lower pageLinkSize to 3 and set showFirstLastIcon to false rather than styling the row smaller.',
    contrastGap:
      'Every color pair of the bar is gated. The bar paints --surface-card (paginator.background on --surface-card, 1.00:1, so it never shows as a slab on a card). The idle glyph is Aura\'s {text.muted.color} on it: paginator.nav.button.color, 4.76:1 light and 5.12–6.56:1 dark by style — the pair nearest its floor. Aura marked the current page with the highlight tint alone (1.00–1.10:1 against the bar in light mode), so the kit gives it the accent\'s own filled pair instead: the fill paginator.nav.button.selected.background stands 4.75–17.85:1 off the bar (SC 1.4.11), and its label reads 5.18–17.85:1 on it (SC 1.4.3), across every style, mode and accent. The kit focus ring on the bar is the "focus ring" row on paginator.background, 4.75–17.85:1.',
    writeBack:
      'The component holds first and rows internally and hands them back once per page change. It emits no firstChange and no rowsChange, so square-bracket-parenthesis two-way binding does not exist here: the parent stays authoritative only if it writes both values back in the handler. This also covers the rows-per-page select, which writes rows straight into the component and reports it through the same single event.',
    slotOrder:
      'Left slot, current-page report, First, Prev, page links, jump-to-page select, Next, Last, jump-to-page input, rows-per-page select, right slot. That order is written into the template and no input reorders it — the visibility flags only remove parts. When something has to sit before or after the row, the two template slots are the whole answer, and their content is yours to make accessible.',
    ck1: 'rows and totalRecords are bound, and first is written back in the page handler.',
    ck2: 'The component sits inside a nav that names the collection it pages.',
    ck3: 'A polite region you own states the new page after every change.',
    ck4: 'aria.pageLabel is a phrase, so a page link is not announced as a bare digit — the kit pushes one in every language; keep it if you push your own.',
    ck5: 'currentPageReportTemplate comes from the translation layer, not from the English default; the seven aria keys already do (the kit pushes them).',
    ck6: 'The empty state is your own, not an inert bar sitting over nothing.',
    ck7: 'Focus ring, selected page, and idle glyph checked as computed style in both themes; the row checked at 360px, where it wraps.',
    i18nGap:
      'None left in the button names: the kit hands its aria keys (OPTIMUS_ARIA_KEYS) to the Optimus config in the page language on every language change, and all seven keys this component reads are among them — pageLabel as a phrase ("Page {page}", "Seite {page}") rather than the shipped bare placeholder. What stays yours is the report template below. A new key goes into that list and into the four optimus.json files, which a spec holds equal.',
    i18nDigit:
      'Setting locale localizes the visible digits through Intl.NumberFormat, but the accessible name is built from the raw value — under a non-Latin numbering locale the button shows one glyph and announces another. Either leave locale unset or accept that the two disagree.',
    i18nReport:
      'currentPageReportTemplate defaults to English prose that no translation layer can reach, because it is a default value and not a key. Bind it from your own strings in every language, including the ones where the word order around the placeholders differs.',
  };

  readonly usageSnippet: string = '<!-- The component pages; everything around it is yours -->\n' +
    '<nav [attr.aria-label]="t(\'your-module.resultsPagerName\')">\n' +
    '  <p-paginator\n' +
    '    [rows]="rows()"\n' +
    '    [first]="first()"\n' +
    '    [totalRecords]="total()"\n' +
    '    [rowsPerPageOptions]="[10, 20, 50]"\n' +
    '    [showCurrentPageReport]="true"\n' +
    '    [currentPageReportTemplate]="t(\'your-module.resultsPageReport\')"\n' +
    '    (onPageChange)="onPage($event)" />\n' +
    '</nav>\n' +
    '\n' +
    '<!-- The announcement the library does not make -->\n' +
    '<p class="sr-only" aria-live="polite">{{ announcement() }}</p>';

  readonly eventSnippet: string = '// onPageChange is the only output; there is no firstChange and no rowsChange.\n' +
    '// PaginatorState (@openng/optimus-ui/types/paginator) declares every field optional.\n' +
    'onPage(e: PaginatorState): void {\n' +
    '  this.first.set(e.first ?? 0); // zero-based ROW offset, not a page index\n' +
    '  this.rows.set(e.rows ?? 10);  // the rows-per-page select reports only through here\n' +
    '  this.announcement.set(this.t(\'your-module.resultsPageAnnounce\'));\n' +
    '  this.load(e.first, e.rows);\n' +
    '}';

  readonly i18nSnippet: string = '// What the kit already does (src/app/services/optimus-a11y.service.ts):\n' +
    '// every key in OPTIMUS_ARIA_KEYS — the seven paginator keys included —\n' +
    '// is read from optimus.json in the page language and handed over.\n' +
    'syncAriaStrings(): void {\n' +
    '  // setTranslation merges one level deep: spread the aria block first.\n' +
    '  const aria = { ...(this.optimus.translation.aria ?? {}) };\n' +
    '  for (const key of OPTIMUS_ARIA_KEYS) {\n' +
    '    aria[key] = this.translationService.translate(`optimus.${key}`);\n' +
    '  }\n' +
    '  this.optimus.setTranslation({ aria });\n' +
    '}\n' +
    '// en/optimus.json: "pageLabel": "Page {page}" — the default is bare "{page}"';
}
