import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataViewModule } from '@openng/optimus-ui/dataview';
import { OrderListModule } from '@openng/optimus-ui/orderlist';
import { PickListModule } from '@openng/optimus-ui/picklist';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

export interface Row {
  id: number;
  label: string;
}

export interface Card {
  id: number;
  title: string;
  note: string;
}

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, DataViewModule, OrderListModule, PickListModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-dataview-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-dataview-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-dataview-article .stage--split {
        display: grid;
        gap: 1.5rem;
      }

      app-dataview-article .stage__bar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-dataview-article .plain {
        font: inherit;
        padding: 0.25rem 0.7rem;
        border: 1px solid var(--control-border, var(--surface-border));
        background: var(--surface-ground);
        color: var(--text-color);
        cursor: pointer;
      }

      app-dataview-article .plain[aria-pressed='true'] {
        background: var(--surface-hover);
        font-weight: 600;
      }

      app-dataview-article .dv-list {
        margin: 0;
        padding-inline-start: 1.1rem;
      }

      app-dataview-article .dv-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
        gap: 0.6rem;
      }

      app-dataview-article .dv-tile {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.6rem;
        border: 1px solid var(--surface-border);
      }

      app-dataview-article .dd__caption {
        margin: 0.5rem 0 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        min-height: 1.2em;
      }
    `;

/**
 * Guide article: DataView, OrderList, and PickList (Guides, category `library`).
 *
 * Three list arrangements, one guide. Everything claimed here was read off the
 * shipped sources of Optimus UI 2.0.2: the flat bundles
 * openng-optimus-ui-dataview.mjs, openng-optimus-ui-orderlist.mjs, and
 * openng-optimus-ui-picklist.mjs, plus openng-optimus-ui-listbox.mjs (which
 * both list components embed) and openng-optimus-ui-config.mjs.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - DataView carries no ARIA and no role: its template (openng-optimus-ui-dataview.mjs:465-572)
 *     has neither. Its list and grid outlets are two separate blocks with no else
 *     (:511, :521); isEmpty() reads filteredValue || value (:426-429).
 *   - DataView ships no layout switch: the bundle exports DataView, DataViewClasses,
 *     DataViewModule, DataViewStyle (:835). listicon (:334) and gridicon (:339) are
 *     queried as content children and used in no template.
 *   - sort() (:395-425) sorts this.value in place (:401-416) in the non-lazy branch
 *     only (:396-399), then emits onSort outside the branch either way (:421-424);
 *     filter() (:441-454) splits filterBy (:444) and nulls filteredValue when the
 *     filter matches every row (:446-448).
 *   - The stylesheet defines .p-dataview, -header, -content, -footer, the two
 *     paginator borders and the loading overlay, and no rule for .p-dataview-list
 *     or .p-dataview-grid, although classes.root toggles both (:21-22).
 *   - OrderList and PickList both render through p-listbox and bind
 *     [optionLabel]="dataKey ?? 'name'" (openng-optimus-ui-orderlist.mjs:790,
 *     openng-optimus-ui-picklist.mjs:1363), so dataKey is used as the label field.
 *   - Rows are cdkDrag inside a cdkDropList (openng-optimus-ui-listbox.mjs:1445-1447,
 *     :1522); the move buttons are real buttons (openng-optimus-ui-orderlist.mjs:736,
 *     openng-optimus-ui-picklist.mjs:1292).
 *   - Neither list bundle contains aria-live or role="status" of its own; the polite
 *     regions come from the embedded listbox, and there are three of them:
 *     hiddenFilterResult (openng-optimus-ui-listbox.mjs:1435), hiddenEmptyMessage
 *     (:1609) and hiddenSelectedMessage (:1612-1613, selectedMessageText, defaults
 *     openng-optimus-ui-config.mjs:170-171). None reports a completed move. An
 *     OrderList move leaves all three untouched; a PickList transfer clears
 *     selectedItemsSource/Target (openng-optimus-ui-picklist.mjs:939, :990), which are
 *     the ngModel of the embedded listboxes (:1361, :1505), so the selected-message
 *     region falls back to emptySelectionMessage.
 *   - PickList moveBottomAriaLabel returns aria.moveDown (openng-optimus-ui-picklist.mjs:488);
 *     OrderList's returns aria.moveBottom (openng-optimus-ui-orderlist.mjs:343).
 *   - Break behavior: OrderList moveUp continues past a blocked item (:485-495) and
 *     moveDown likewise (:539-550); moveTop (:515-521) and moveBottom (:569-575) break.
 *     All four PickList reorder methods break (openng-optimus-ui-picklist.mjs:843,
 *     :865, :888, :910).
 *   - PickList never calls source.set/target.set/.update anywhere in the bundle; moves
 *     splice the held arrays (:926, :951). moveAllRight/moveAllLeft guard on
 *     isItemVisible (:950, :1001); moveLeft under keepSelection pushes the array (:987)
 *     where moveRight spreads it (:936).
 *   - Inert or unbound inputs: trackBy on all three (openng-optimus-ui-dataview.mjs:210,
 *     openng-optimus-ui-orderlist.mjs:172, openng-optimus-ui-picklist.mjs:192/:197/:202)
 *     against a Listbox declaration that has no trackBy input
 *     (openng-optimus-ui-listbox.mjs:1353); OrderList header (:81), ariaLabelledBy (:102)
 *     and ariaFilterLabel (:147); PickList ariaSourceFilterLabel (:282) and
 *     ariaTargetFilterLabel (:287) — each declared, none present in its template.
 *   - Responsive: both list components inject a style element only when responsive is
 *     set and only in the browser (openng-optimus-ui-orderlist.mjs:687-720,
 *     openng-optimus-ui-picklist.mjs:1232-1254), breakpoint 960px by default
 *     (:157 / :508). Their stylesheets carry no media query at all. PickList also
 *     watches matchMedia to flip its transfer icons (:1208-1225, :1437-1438).
 *   - Tokens: @openng/optimus-ui-themes/dist/aura/orderlist/index.mjs and
 *     .../aura/picklist/index.mjs each export root.gap 1.125rem and controls.gap
 *     0.5rem; .../aura/dataview/index.mjs exports root, header, content, footer, and
 *     the two paginator border objects.
 *   - Contrast: the embedded listbox frame reads {form.field.border.color}
 *     (@openng/optimus-ui-themes/dist/aura/listbox/index.mjs), Aura {surface.300} /
 *     {surface.600}. src/styles.scss re-points it to --control-border on .p-listbox,
 *     which reaches the lists inside p-orderlist and p-picklist; CONTRAST.MD
 *     measures it as "form field edge" listbox.border.color. Row text {text.color}
 *     on {content.background} = the "content panel" row; the .p-focus option
 *     wears the kit ring inside itself ("option list focus"); hover and
 *     selected text are in no row.
 *   - The i18n recipe uses an invented `your-module.*` namespace: the eight move keys
 *     exist in no translation module of the kit today.
 *   - The kit's Optimus aria sync (OPTIMUS_ARIA_KEYS in optimus-a11y.service.ts)
 *     passes the select/chip/tab/rating/dialog/notice, image-preview, carousel and
 *     paginator keys — none of the eight move labels, and nothing outside the aria
 *     block.
 */
@Component({
  selector: 'app-dataview-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dataview'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Three components that look like one family and are not. DataView is a frame around cards you write; the
          other two own their rows and give you buttons that move them. What they share is the part nobody sees: a
          move happens, and nothing is said about it.
        </p>

        <h3>DataView — the frame, and the switch it does not ship</h3>
        <div class="stage">
          <div class="stage__bar">
            <button type="button" class="plain" (click)="layout.set('list')" [attr.aria-pressed]="layout() === 'list'">
              list
            </button>
            <button type="button" class="plain" (click)="layout.set('grid')" [attr.aria-pressed]="layout() === 'grid'">
              grid
            </button>
          </div>
          <p-dataView [value]="cards" [layout]="layout()" [paginator]="true" [rows]="2">
            <ng-template #list let-items>
              <ul class="dv-list">
                @for (c of items; track c.id) {
                  <li><strong>{{ c.title }}</strong> — {{ c.note }}</li>
                }
              </ul>
            </ng-template>
            <ng-template #grid let-items>
              <div class="dv-grid">
                @for (c of items; track c.id) {
                  <div class="dv-tile"><strong>{{ c.title }}</strong><span>{{ c.note }}</span></div>
                }
              </div>
            </ng-template>
          </p-dataView>
        </div>
        <p class="src-note">
          Both templates and both toggle buttons above are written here, not supplied: the bundle
          <code>openng-optimus-ui-dataview.mjs</code> exports four symbols and none of them is a control
          (<code>:835</code>), and the <code>#listicon</code> / <code>#gridicon</code> content children it queries
          (<code>:334</code>, <code>:339</code>) appear in no template. The paginator is the component's own.
        </p>

        <h3>OrderList and PickList — rows the component owns</h3>
        <div class="stage stage--split">
          <p-orderlist
            [value]="order"
            [(selection)]="picked"
            [dragdrop]="true"
            scrollHeight="9rem"
            ariaLabel="Reading order"
          >
            <ng-template #item let-row>{{ row.label }}</ng-template>
          </p-orderlist>
          <p-picklist
            [source]="pool"
            [target]="chosen"
            [dragdrop]="true"
            scrollHeight="9rem"
            sourceHeader="Available"
            targetHeader="Chosen"
            sourceAriaLabel="Available topics"
            targetAriaLabel="Chosen topics"
            bottomButtonAriaLabel="Move to bottom"
          >
            <ng-template #item let-row>{{ row.label }}</ng-template>
          </p-picklist>
        </div>
        <p class="src-note">
          Both delegate rows, keys, and drag to <code>p-listbox</code>; the buttons are the components' own —
          OrderList's four in one group (<code>openng-optimus-ui-orderlist.mjs:735-782</code>), PickList's twelve in
          three: source controls (<code>openng-optimus-ui-picklist.mjs:1291-1354</code>), transfer controls, and the
          target controls that follow the second list.
        </p>

        <h3>What each move emits</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Action</th><th><code>p-orderlist</code></th><th><code>p-picklist</code></th></tr>
            </thead>
            <tbody>
              <tr><td>reorder inside a list</td><td><code>onReorder</code> (the moved items)</td><td><code>onSourceReorder</code> / <code>onTargetReorder</code></td></tr>
              <tr><td>move one across</td><td>—</td><td><code>onMoveToTarget</code> / <code>onMoveToSource</code></td></tr>
              <tr><td>move all across</td><td>—</td><td><code>onMoveAllToTarget</code> / <code>onMoveAllToSource</code></td></tr>
              <tr><td>the bound array changed</td><td><code>value</code> is reordered in place</td><td>the held arrays are spliced; <code>sourceChange</code> stays silent</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Output names from the compiled declarations in <code>openng-optimus-ui-orderlist.mjs:734</code> and
          <code>openng-optimus-ui-picklist.mjs:1289</code>; the last row from the absence of any
          <code>source.set</code>, <code>target.set</code> or <code>.update</code> call in the PickList bundle, whose
          moves splice the arrays the signals already hold (<code>:926</code>, <code>:951</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">{{ m.usageLead }}</p>

        <h3>Which of the three</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>The question the user is answering</th><th>Component</th></tr></thead>
            <tbody>
              <tr><td>"Which of these records do I want to look at?"</td><td><code>p-dataview</code></td></tr>
              <tr><td>"In what order should these run?"</td><td><code>p-orderlist</code></td></tr>
              <tr><td>"Which of these are in, and in what order?"</td><td><code>p-picklist</code></td></tr>
              <tr><td>"Which of these are in?" — order irrelevant</td><td><code>p-multiselect</code> or a checkbox group</td></tr>
              <tr><td>"How do these compare, field by field?"</td><td><code>p-table</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.chooseNote }}</p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — move the row and say nothing</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddBad" [dragdrop]="true" scrollHeight="7rem" ariaLabel="Steps">
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddSilentBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — state the item and its new position</span>
            <div class="dd__stage">
              <p-orderlist
                [value]="ddGood"
                [dragdrop]="true"
                scrollHeight="7rem"
                ariaLabel="Steps"
                (onReorder)="announce($event)"
              >
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
              <p class="dd__caption" role="status" aria-live="polite" aria-atomic="true">{{ moveMessage() }}</p>
            </div>
            <p class="dd__why">{{ m.ddSilentGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The embedded listbox carries three polite regions — filter result, empty message, and selection count
          (<code>openng-optimus-ui-listbox.mjs:1435</code>, <code>:1609</code>, <code>:1612-1613</code>, default
          strings <code>openng-optimus-ui-config.mjs:170-171</code>). None of them names a moved row. Both stages
          above are OrderLists, which leave the selection alone across a move, so the left one produces no
          announcement at all; the right stage's region is written here. On a PickList the picture differs without
          improving: a transfer empties the selection arrays that are the listbox's model
          (<code>openng-optimus-ui-picklist.mjs:939</code>, <code>:990</code>), so the region drops to "No selected
          item" — an announcement, but not one about the move.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — leave the row label to the default</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddBad" scrollHeight="7rem" ariaLabel="Steps, unlabeled"></p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddLabelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — supply an item template</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddGood" scrollHeight="7rem" ariaLabel="Steps">
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddLabelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both list components bind <code>[optionLabel]="dataKey ?? 'name'"</code> to the listbox
          (<code>openng-optimus-ui-orderlist.mjs:790</code>, <code>openng-optimus-ui-picklist.mjs:1363</code>), so rows
          of objects without a <code>name</code> field render as blank lines — as the left stage does.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The announcement helper is kit code, not library API. Verify it in the browser's accessibility tree: after a
          move the status node must carry the item's name and its new index.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">{{ m.designLead }}</p>

        <h3>What the theme actually sets</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Component</th><th>Aura tokens</th><th>What consumes them</th></tr></thead>
            <tbody>
              <tr><td><code>p-orderlist</code></td><td><code>root.gap</code> 1.125rem, <code>controls.gap</code> 0.5rem</td><td>a flex row and a flex column of buttons</td></tr>
              <tr><td><code>p-picklist</code></td><td><code>root.gap</code> 1.125rem, <code>controls.gap</code> 0.5rem</td><td>the same, plus <code>flex: 1 1 50%</code> per list container</td></tr>
              <tr><td><code>p-dataview</code></td><td><code>root</code>, <code>header</code>, <code>content</code>, <code>footer</code>, <code>paginatorTop</code>, <code>paginatorBottom</code></td><td>borders and padding on the frame only</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token values from <code>&#64;openng/optimus-ui-themes/dist/aura/orderlist/index.mjs</code>,
          <code>&#64;openng/optimus-ui-themes/dist/aura/picklist/index.mjs</code> and
          <code>&#64;openng/optimus-ui-themes/dist/aura/dataview/index.mjs</code>; the rules that read them from the
          three matching files under <code>&#64;openng/optimus-ui-styles/dist/</code>. Neither list stylesheet defines
          anything but those two flex containers, and the DataView stylesheet has no rule for
          <code>.p-dataview-list</code> or <code>.p-dataview-grid</code> even though its root class toggles both.
        </p>

        <h3>Contrast: the list edge is the kit's control border</h3>
        <p>{{ m.contrastEdge }}</p>
        <div class="table-wrap">
          <table>
            <caption>The list edge, the kit's control border, on the card</caption>
            <thead>
              <tr><th>Style</th><th>Mode</th><th><code>--control-border</code> on <code>--surface-card</code></th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>light</td><td>5.23:1</td></tr>
              <tr><td>werkbund</td><td>dark</td><td>4.91:1</td></tr>
              <tr><td>lernwerkstatt</td><td>light</td><td>4.15:1</td></tr>
              <tr><td>lernwerkstatt</td><td>dark</td><td>4.89:1</td></tr>
              <tr><td>skizzenbuch</td><td>light</td><td>4.22:1</td></tr>
              <tr><td>skizzenbuch</td><td>dark</td><td>4.25:1</td></tr>
              <tr><td>blaupause</td><td>light</td><td>4.09:1</td></tr>
              <tr><td>blaupause</td><td>dark</td><td>3.97:1</td></tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ edgeSnippet }}</code></pre>
        <p class="src-note">
          The embedded listbox reads <code>&#123;form.field.border.color&#125;</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/listbox/index.mjs</code>), Aura's
          <code>&#123;surface.300&#125;</code> light / <code>&#123;surface.600&#125;</code> dark. The kit re-points that
          edge per component in <code>src/styles.scss</code>, <code>.p-listbox</code> included, and the rule reaches
          the lists inside <code>p-orderlist</code> and <code>p-picklist</code>. The table quotes the compilat's
          <code>--control-border</code> on <code>--surface-card</code> rows ("control boundary", SC 1.4.11 needs 3:1);
          the same edge is the "form field edge" row <code>listbox.border.color</code>, 3.85:1 and up on every page
          surface. {{ m.contrastNote }}
        </p>

        <h3>On a narrow screen</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          The style element is created only when <code>responsive</code> is set and only in the browser
          (<code>openng-optimus-ui-orderlist.mjs:687-720</code>,
          <code>openng-optimus-ui-picklist.mjs:1232-1254</code>); <code>breakpoint</code> defaults to
          <code>960px</code> (<code>openng-optimus-ui-orderlist.mjs:157</code>,
          <code>openng-optimus-ui-picklist.mjs:508</code>). PickList additionally watches
          <code>matchMedia</code> and swaps its transfer arrows from horizontal to vertical
          (<code>:1208-1225</code>, <code>:1437-1438</code>); OrderList has no such watcher.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">{{ m.devLead }}</p>

        <h3>Inputs that are declared and reach nothing</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Input</th><th>On</th><th>Why it does nothing</th></tr></thead>
            <tbody>
              <tr><td><code>trackBy</code></td><td>all three</td><td>Listbox declares no <code>trackBy</code> input (<code>openng-optimus-ui-listbox.mjs:1353</code>); DataView renders no row</td></tr>
              <tr><td><code>sourceTrackBy</code>, <code>targetTrackBy</code></td><td><code>p-picklist</code></td><td>same, per list (<code>openng-optimus-ui-picklist.mjs:197</code>, <code>:202</code>)</td></tr>
              <tr><td><code>ariaLabelledBy</code></td><td><code>p-orderlist</code></td><td>declared at <code>:102</code>, bound in no template</td></tr>
              <tr><td><code>ariaFilterLabel</code></td><td><code>p-orderlist</code></td><td>declared at <code>:147</code>, bound in no template</td></tr>
              <tr><td><code>ariaSourceFilterLabel</code>, <code>ariaTargetFilterLabel</code></td><td><code>p-picklist</code></td><td>declared at <code>:282</code> / <code>:287</code>, bound in no template</td></tr>
              <tr><td><code>header</code></td><td><code>p-orderlist</code></td><td>declared at <code>:81</code>; only the <code>#header</code> template renders</td></tr>
              <tr><td><code>#listicon</code>, <code>#gridicon</code></td><td><code>p-dataview</code></td><td>queried at <code>:334</code> / <code>:339</code>, projected nowhere</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Each row is the pair "declaration present, template reference absent". The line number in a row belongs to
          the flat bundle of the selector in its "On" column, version 2.0.2:
          <code>p-dataview</code> → <code>openng-optimus-ui-dataview.mjs</code>, <code>p-orderlist</code> →
          <code>openng-optimus-ui-orderlist.mjs</code>, <code>p-picklist</code> →
          <code>openng-optimus-ui-picklist.mjs</code>.
        </p>

        <h3>What the eight reorder methods do at the end of the list</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Method</th><th>Item already at the end</th><th>Consequence for a multi-selection</th></tr></thead>
            <tbody>
              <tr><td>OrderList <code>moveUp</code>, <code>moveDown</code></td><td>skipped, loop continues</td><td>the others still move</td></tr>
              <tr><td>OrderList <code>moveTop</code>, <code>moveBottom</code></td><td><code>break</code></td><td>the rest of the selection is left where it is</td></tr>
              <tr><td>PickList, all four</td><td><code>break</code></td><td>a selection containing the first (or last) row moves nothing</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-orderlist.mjs:485-495</code> and <code>:539-550</code> against <code>:515-521</code>
          and <code>:569-575</code>; the four PickList <code>break</code>s are
          <code>openng-optimus-ui-picklist.mjs:843</code>, <code>:865</code>, <code>:888</code> and <code>:910</code>.
          The OrderList source carries the intent as a comment on <code>:494</code>.
        </p>

        <h3>PickList's transfer buttons and the filter</h3>
        <p>
          The two "move all" buttons transfer only the rows the filter has left visible: both loops test each item
          against the active filter before they take it. With a filter typed in, "move all" therefore moves a subset:
          the rows the filter hides stay in the source list, and the list looks empty only because the filter is
          still on. Clear the filter and they are back.
        </p>
        <p class="src-note">
          The guard is <code>isItemVisible</code> in both directions —
          <code>openng-optimus-ui-picklist.mjs:950</code> for the source list and <code>:1001</code> for the target.
        </p>

        <h3>DataView's two branches per operation</h3>
        <pre class="code-block"><code>{{ branchSnippet }}</code></pre>
        <p class="src-note">
          Quoted from <code>openng-optimus-ui-dataview.mjs:395-425</code>, <code>:441-454</code> and
          <code>:511-530</code>. The branch decides only what happens to the data — the lazy one asks you to reload,
          the other sorts the array you passed in place. <code>onSort</code> fires afterwards either way, outside the
          branch (<code>:421-424</code>), so a lazy caller receives both outputs for one click.
        </p>

        <h3>Checklist</h3>
        <ul>
          <li>A polite region of your own updates on every reorder and transfer output.</li>
          <li>Move buttons are visible wherever <code>dragdrop</code> is on.</li>
          <li>Both PickList lists are named, and <code>bottomButtonAriaLabel</code> is set.</li>
          <li>Every list component has an <code>#item</code> template or a <code>dataKey</code> naming a printable field.</li>
          <li><code>layout</code> is only ever <code>'list'</code> or <code>'grid'</code>.</li>
          <li>PickList results are read from the arrays or the outputs, never from <code>(sourceChange)</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">{{ m.i18nLead }}</p>

        <h3>Where each visible string comes from</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>String</th><th>Held by</th><th>Reaches the kit's languages?</th></tr></thead>
            <tbody>
              <tr><td>Row text</td><td>your <code>#item</code> template</td><td>yes — it is your template</td></tr>
              <tr><td>List and header captions</td><td><code>sourceHeader</code> / <code>targetHeader</code>, or a template</td><td>yes — you bind them</td></tr>
              <tr><td>The eight move-button names</td><td><code>config.translation.aria.move*</code></td><td>no — English defaults</td></tr>
              <tr><td>"&#123;0&#125; items selected", "No selected item"</td><td><code>config.translation</code>, one level above <code>aria</code></td><td>no — English defaults</td></tr>
              <tr><td>Empty and empty-filter messages</td><td><code>config.translation</code>, or the matching template</td><td>only via the template</td></tr>
              <tr><td>Filter placeholders</td><td><code>filterPlaceholder</code>, <code>sourceFilterPlaceholder</code>, <code>targetFilterPlaceholder</code></td><td>yes — you bind them</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults from <code>openng-optimus-ui-config.mjs:168-198</code>. The kit's Optimus sync passes an
          <code>aria</code> block built from <code>OPTIMUS_ARIA_KEYS</code> in
          <code>src/app/services/optimus-a11y.service.ts</code> — the select, chip, tab, multiselect, rating, dialog and
          notice keys plus the image-preview, carousel and paginator ones — none of the eight move labels, and nothing
          outside <code>aria</code>, which is why the two rows above say "no".
        </p>

        <h3>Adding the move labels</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> merges one level deep, so the <code>aria</code> block is replaced wholesale —
          spreading the current block first is what keeps the keys you did not list.
        </p>

        <h3>Length, and the two places it bites</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          The buttons are icon-only in both list components, so a translated label changes the accessible name and not
          the layout; the row text and the headers are the strings that widen.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the list edge is the kit's
            <code>--control-border</code> now (the listbox rule reaches both lists), cited from CONTRAST.MD; row text
            from the "content panel" row; the active option wears the kit ring; the pushed aria key list re-read.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Contrast corrected: the list edge is Aura's stock form-field border,
            which the kit does not re-point for the listbox; the kit-token rows are now the target after re-pointing,
            with the rule to do it.
          </li>
          <li><strong>1.0</strong> — 2026-09-06 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DataviewArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly layout = signal<'list' | 'grid'>('list');
  readonly moveMessage = signal('');

  readonly cards: Card[] = [
    { id: 1, title: 'Retrieval', note: 'find the passages first' },
    { id: 2, title: 'Grounding', note: 'answer only from them' },
    { id: 3, title: 'Citation', note: 'name where it came from' },
    { id: 4, title: 'Review', note: 'a human reads it last' },
  ];

  readonly order: Row[] = [
    { id: 1, label: 'Collect the sources' },
    { id: 2, label: 'Draft the answer' },
    { id: 3, label: 'Check the citations' },
    { id: 4, label: 'Publish' },
  ];

  picked: Row[] = [];

  readonly pool: Row[] = [
    { id: 1, label: 'Prompting' },
    { id: 2, label: 'Embeddings' },
    { id: 3, label: 'Evaluation' },
  ];

  readonly chosen: Row[] = [{ id: 4, label: 'Tokenization' }];

  readonly ddBad: Row[] = [
    { id: 1, label: 'Collect' },
    { id: 2, label: 'Draft' },
    { id: 3, label: 'Publish' },
  ];

  readonly ddGood: Row[] = [
    { id: 1, label: 'Collect' },
    { id: 2, label: 'Draft' },
    { id: 3, label: 'Publish' },
  ];

  announce(moved: Row[]): void {
    const first = moved[0];
    if (!first) {
      return;
    }
    const at = this.ddGood.indexOf(first) + 1;
    this.moveMessage.set(first.label + ', ' + at + ' of ' + this.ddGood.length);
  }

  readonly m = {
    usageLead:
      'The three answer different questions, and the wrong pick shows up as a control nobody can operate rather than as a layout complaint. Pick by the question the user is answering, then pay the accessibility bill the component leaves open.',
    chooseNote:
      'The split follows what each component owns: DataView owns paging and a layout flag, OrderList owns one array, PickList owns two. None of them owns a row.',
    ddSilentBad:
      'The move happens, the DOM changes, and the one status region this arrangement renders still reports the selection count — which the move did not change. A screen-reader user has no way to hear where the row went.',
    ddSilentGood:
      'A polite region of your own, updated from the reorder output, says the item and its new position. The same region serves the drag path and the button path, because both end in the same output.',
    ddLabelBad:
      'Without an item template the row prints the value of a field called name, and these rows have no such field — so the list renders blank lines that are still selectable and still movable.',
    ddLabelGood:
      'One template line decides what a row says. It is also the only way to give a row anything richer than a single field, since the label input takes one field path.',
    designLead:
      'There is almost no theme here. Two of the three are a flex container and a token for the gap; the third styles a frame and leaves the rows entirely to you. That makes the caller responsible for nearly everything a reader would call the design.',
    contrastEdge:
      'OrderList and PickList draw their list frame with the listbox they embed, and that frame reads the listbox border token. Aura’s stock edge misses the 3:1 a control boundary owes, so the kit re-points it to --control-border for every field shell, the listbox included — which is what these two lists render. Nothing to add on your side; the ratios below are what the frame measures.',
    contrastNote:
      'Row text is {text.color} on {content.background} — the "content panel" row, 10.35:1 light and 17.72:1 dark. The keyboard\'s active option (.p-listbox-option.p-focus) wears the kit\'s one 2px ring drawn inside it, measured on the list, the focus tint and the selected fills in the "option list focus" rows (3.48:1 and up). The hover fill ({surface.100} / {surface.800}) and the selected-option text are in no row; measure them in computed style rather than borrowing a neighbor.',
    responsive:
      'No intrinsic responsive behavior in any of the three. OrderList and PickList are flex rows that keep their side-by-side arrangement at every viewport and overflow their container once the lists and the button column no longer fit; DataView is a block whose grid layout is whatever CSS you wrote. Set responsive on either list component to opt into a stacked arrangement below breakpoint (960px by default), and give a DataView grid its own container query or media query — nothing in the library supplies one.',
    devLead:
      'The three carry a noticeable amount of declared surface that no template reads. Most of it is harmless; two entries are not, because they look exactly like the fix for a real accessibility problem.',
    i18nLead:
      'Almost every visible string in these three is either yours or an English default. The parts that are yours are the parts that carry meaning; the English defaults are the button names a screen-reader user hears.',
    i18nLength:
      'A translated row label can be several times the English length, and neither list component wraps or truncates for you: the row scrolls horizontally inside the list, and a long header pushes the list container wider before the flex row gives way.',
  };

  readonly usageSnippet: string = '<p-orderlist [value]="steps" [(selection)]="picked" dragdrop\n' +
    '             [ariaLabel]="listLabel()" (onReorder)="announce($event)">\n' +
    '  <ng-template #item let-row>{{ row.label }}</ng-template>\n' +
    '</p-orderlist>\n' +
    '\n' +
    '<!-- the announcement the library does not make -->\n' +
    '<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ moveMessage() }}</p>\n' +
    '\n' +
    '// announce() reads the position AFTER the move: the component has already\n' +
    '// reordered the array in place by the time the output fires.\n' +
    'announce(moved: Step[]): void {\n' +
    '  const at = this.steps.indexOf(moved[0]) + 1;\n' +
    '  this.moveMessage.set(`${moved[0].label}, ${at} of ${this.steps.length}`);\n' +
    '}';

  readonly edgeSnippet: string = '/* Already in the kit (src/styles.scss) — element-scoped, because Optimus\n' +
    '   resolves the form-field chain on :root. It reaches the listbox inside\n' +
    '   p-orderlist and p-picklist as well. */\n' +
    '.p-listbox {\n' +
    '  --p-listbox-border-color: var(--control-border);\n' +
    '}';

  readonly branchSnippet: string = '// sort(): the lazy branch never touches the array\n' +
    'sort() {\n' +
    '  this.first = 0;\n' +
    '  if (this.lazy) { this.onLazyLoad.emit(this.createLazyLoadMetadata()); }\n' +
    '  else if (this.value) { this.value.sort(/* in place, your array */); }\n' +
    '  this.onSort.emit({ sortField: this.sortField, sortOrder: this.sortOrder });\n' +
    '}\n' +
    '\n' +
    '// filter(): a filter that matches everything is discarded\n' +
    'if (this.filteredValue.length === this.value.length) { this.filteredValue = null; }\n' +
    '\n' +
    '// the two outlets: no else, so a third layout value renders neither\n' +
    "@if (layout === 'list') { <!-- your #list template --> }\n" +
    "@if (layout === 'grid') { <!-- your #grid template --> }";

  readonly i18nSnippet: string = '// None of the eight names exists in a translation module today: author them\n' +
    '// first, in a namespace of your own, and read them through your own helper.\n' +
    'const tr = (k: string) => this.i18n.translate(`your-module.${k}`);\n' +
    '\n' +
    '// setTranslation merges one level deep, so spread the current aria block first\n' +
    'this.optimus.setTranslation({\n' +
    '  aria: {\n' +
    '    ...(this.optimus.translation.aria ?? {}),\n' +
    "    moveUp: tr('moveUp'), moveTop: tr('moveTop'),\n" +
    "    moveDown: tr('moveDown'), moveBottom: tr('moveBottom'),\n" +
    "    moveToTarget: tr('moveToTarget'), moveToSource: tr('moveToSource'),\n" +
    "    moveAllToTarget: tr('moveAllToTarget'), moveAllToSource: tr('moveAllToSource'),\n" +
    '  },\n' +
    '});\n' +
    '\n' +
    '// PickList needs one override on top: its move-bottom button reads aria.moveDown\n' +
    '<p-picklist [bottomButtonAriaLabel]="tr(\'moveBottom\')" ... />';
}
