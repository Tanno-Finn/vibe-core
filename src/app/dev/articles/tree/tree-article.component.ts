import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import type { TreeNode } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { OrganizationChartModule } from '@openng/optimus-ui/organizationchart';
import { TreeModule } from '@openng/optimus-ui/tree';
import { TreeSelectModule } from '@openng/optimus-ui/treeselect';
import { TreeTableModule } from '@openng/optimus-ui/treetable';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    TreeModule,
    TreeTableModule,
    TreeSelectModule,
    OrganizationChartModule,
    ButtonModule,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-tree-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-tree-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-tree-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 1.5rem;
      }

      app-tree-article .col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        min-width: 0;
      }

      app-tree-article .lbl {
        font-size: 0.72rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      app-tree-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-tree-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-tree-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-tree-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-tree-article .dd__stage {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-tree-article .dd__stage--scroll,
      app-tree-article .dd__scroll {
        overflow-x: auto;
        max-width: 100%;
      }

      app-tree-article .dd__stage--col {
        flex-direction: column;
        align-items: stretch;
      }

      app-tree-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-tree-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-tree-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-tree-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-tree-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-tree-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Tree, TreeTable, and TreeSelect (Guides, category `library`).
 *
 * One node model, three widgets that do not agree with each other. Everything the
 * article claims was read off the shipped sources of Optimus UI 2.0.2:
 * the fesm2022 bundles `openng-optimus-ui-tree.mjs`,
 * `openng-optimus-ui-treetable.mjs` and `openng-optimus-ui-treeselect.mjs`.
 *
 * CLAIMS AND THEIR PROVENANCE — per component, never carried across
 *   p-tree (openng-optimus-ui-tree.mjs)
 *     - Root `<ul role="tree">` with aria-label/aria-labelledby from the ariaLabel
 *       and ariaLabelledBy inputs (:1962, and :1997 for the non-virtual branch).
 *       Child groups are `<ul role="group">` (:711).
 *     - Node `<li role="treeitem">` (:618) carries aria-label, aria-checked,
 *       aria-setsize, aria-selected, aria-expanded, aria-posinset, aria-level
 *       (:609-615) and the keydown binding (:619).
 *     - tabindex is `index === 0 ? 0 : -1` (:616); `index` is the `$index` of the
 *       sibling loop (:718), so every group's first child starts as a tab stop.
 *       setAllNodesTabIndexes (:537) collapses that on the first Tab.
 *     - onKeyDown (:439) handles ArrowDown/Up/Right/Left, Enter, Space,
 *       NumpadEnter, and Tab, and nothing else: no Home, no End, no typeahead.
 *     - onArrowUp (:475) passes `event.target.parentElement` — the <p-treeNode>
 *       host — into focusRowChange (:591), which writes tabIndex on it; onArrowDown
 *       (:488) and onArrowLeft (:517) pass the <li> that carries the attribute.
 *     - onArrowRight (:507) is guarded by `!expanded && !isNodeLeaf`, so an
 *       already-expanded node moves nowhere.
 *     - togglerAriaLabel is declared as an input (:1014, compiled list :1885) and
 *       appears in neither template; the toggle button is `tabindex="-1"` with no
 *       aria-label of any kind.
 *     - Indentation: the stylesheet sets padding-inline-start on
 *       .p-tree-node-children (@openng/optimus-ui-styles/dist/tree/index.mjs:27),
 *       token tree.indent = 1rem in the Aura preset
 *       (@openng/optimus-ui-themes/dist/aura/tree/index.mjs). The inline `padding-left: level * indentation + 'rem'`
 *       (openng-optimus-ui-tree.mjs:627) only ever computes a length under
 *       virtualScroll, because [indentation] is bound in that branch alone
 *       (openng-optimus-ui-tree.mjs:1978); the field has no default
 *       (openng-optimus-ui-tree.mjs:158) and Tree.indentation = 1.5
 *       (openng-optimus-ui-tree.mjs:1094) does not reach it otherwise.
 *     - Filter input (:1909-1921) has placeholder only — no aria-label, no
 *       aria-labelledby, no associated <label>.
 *   p-treeTable (openng-optimus-ui-treetable.mjs)
 *     - `<table role="treegrid">` (:2731) with thead/tbody/tfoot role="rowgroup".
 *     - ttRow (:5081) contributes role="row", a literal tabindex "0",
 *       aria-expanded and aria-level; its onKeyDown (:4939) handles
 *       ArrowDown/Up/Right/Left, Tab, Home, and End — no Enter, no Space.
 *     - Enter/Space live on ttSelectableRow (:4252 -> onEnterKey :4267), a separate
 *       directive with its own aria-selected binding (:4288).
 *     - onHomeKey (:5002) and onEndKey (:5007) both query
 *       `tr[aria-level="${this.level}"]`, i.e. the current depth only.
 *     - onArrowRightKey (:4980) reads findSingle(currentTarget, 'button').style
 *       with no null check, and is guarded by `!this.expanded`.
 *     - The toggler button is tabindex="-1" with `[style.visibility]` (:5141-5151);
 *       its aria-label comes from config.translation.aria.expandRow/collapseRow
 *       (:5118), not from an input.
 *     - ttSortableColumn (:3899) contributes role="columnheader" and aria-sort.
 *   p-treeSelect (openng-optimus-ui-treeselect.mjs)
 *     - Hidden `<input role="combobox">` (:934) with aria-haspopup="tree" (:943),
 *       aria-expanded (:944) and aria-controls only while open (:942).
 *     - aria-label is `ariaLabel || (label === 'p-emptylabel' ? undefined : label)`
 *       (:946); `get label()` (:913) returns the joined selected labels, else the
 *       placeholder, else undefined.
 *     - The dropdown trigger is `<div role="button">` with the literal English
 *       aria-label "treeselect trigger" (:981).
 *     - onKeyDown (:661) is bound on the input alone (:940); it handles ArrowDown,
 *       Space, Enter, Escape, and Tab. onArrowDown (:707) focuses the first
 *       `[data-pc-section="node"]` in the panel. The file contains no
 *       aria-activedescendant.
 *   Cross-cutting
 *     - None of the three stylesheets under @openng/optimus-ui-styles/dist carries
 *       a media query. .p-tree-root sets overflow:auto, its height coming from
 *       [style.max-height]="scrollHeight" (openng-optimus-ui-tree.mjs:1995); the
 *       tree stylesheet declares no white-space at all, while the treeselect
 *       label sets white-space:nowrap with text-overflow:ellipsis.
 *     - docs/generated/CONTRAST.MD has no tree, treetable, or treeselect row. The
 *       node label is Aura {text.color} on the root's {content.background}
 *       ({surface.0} light, {surface.900} dark) — the "content panel" pair; the
 *       selected pair is the table's highlight pair, and the kit focus ring
 *       is measured on the same fills, so the Design tab quotes those rows.
 *   p-organizationChart (openng-optimus-ui-organizationchart.mjs)
 *     - Rendered as nested layout <table>s (:498, node template :164-225): the
 *       node is a <div (click)> (:169) with no tabindex, no keydown, no role; the
 *       connector rows are <td>&nbsp;</td> cells (:213-214). The file contains no
 *       role= and no aria- attribute at all.
 *     - The toggle is <a tabindex="0"> with no href, no role, no name, and no
 *       aria-expanded, toggled by click, Enter, and Space (:180); its glyph is a
 *       chevron-down when expanded (:182-187). Collapsed children are hidden with
 *       visibility (getChildStyle :123-127).
 *     - Selection happens in onNodeClick only (:440-474) and shows as the class
 *       p-organizationchart-node-selected (:21) — mouse-only, never announced.
 *     - preserveSpace is deprecated (:352). The stylesheet
 *       (@openng/optimus-ui-styles/dist/organizationchart/index.mjs) has no media
 *       query and no overflow rule; toggle button size token 1.5rem
 *       (@openng/optimus-ui-themes/dist/aura/organizationchart/index.mjs).
 */
@Component({
  selector: 'app-tree-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tree'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          One <code>TreeNode[]</code>, three widgets. They share the data and almost nothing else: the tree is a list
          of <code>treeitem</code>s, the tree table is a <code>treegrid</code> whose rows you write yourself, and the
          tree select is a combobox with a tree hanging off it. Which one you pick decides who owns the keyboard.
        </p>

        <h3>The three shapes</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-tree</span>
            <p-tree [value]="nodes" selectionMode="single" ariaLabel="Sample folders" />
          </div>
          <div class="col">
            <span class="lbl">p-treeSelect</span>
            <p-treeSelect [options]="nodes" ariaLabel="Destination folder" placeholder="Pick a folder" />
          </div>
        </div>
        <p class="src-note">
          The tree renders <code>role="tree"</code> on its list and <code>role="treeitem"</code> per node
          (<code>openng-optimus-ui-tree.mjs:1997</code> for this non-virtual case, <code>:1962</code> under
          <code>virtualScroll</code>, <code>:618</code>); the tree select renders a hidden
          <code>role="combobox"</code> input in front of the same component
          (<code>openng-optimus-ui-treeselect.mjs:934</code>).
        </p>

        <h3>The same data as a treegrid</h3>
        <div class="stage">
          <p-treeTable [value]="nodes" [pt]="treeTablePt">
            <ng-template pTemplate="caption">Sample folders, by size</ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Size</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
              <tr [ttRow]="rowNode">
                <td>
                  <p-treeTableToggler [rowNode]="rowNode" />
                  {{ rowData.name }}
                </td>
                <td>{{ rowData.size }}</td>
              </tr>
            </ng-template>
          </p-treeTable>
        </div>
        <p class="src-note">
          The <code>role="treegrid"</code> is on the table element
          (<code>openng-optimus-ui-treetable.mjs:2731</code>); <code>role="row"</code>, <code>aria-expanded</code> and
          <code>aria-level</code> arrive only through the <code>ttRow</code> directive on the row
          (<code>:5081</code>) — a row without it is a plain <code>&lt;tr&gt;</code>. The
          <code>caption</code> template is not a <code>&lt;caption&gt;</code>: it renders a header
          <code>&lt;div&gt;</code> before the table (<code>:2678</code>), which is why the name here comes from
          <code>[pt]="&#123; table: &#123; 'aria-label': … &#125; &#125;"</code> instead.
        </p>

        <h3>What each one emits</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Node attributes from <code>openng-optimus-ui-tree.mjs:609-618</code>; row attributes from the
          <code>ttRow</code> host block in <code>openng-optimus-ui-treetable.mjs:5081</code>; combobox attributes from
          <code>openng-optimus-ui-treeselect.mjs:934-946</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Name the control, not the value</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a tree select with no naming input</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ nameBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ariaLabel, so the name survives selection</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ nameGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The fallback chain is <code>ariaLabel || (label === 'p-emptylabel' ? undefined : label)</code>
          (<code>openng-optimus-ui-treeselect.mjs:946</code>), and <code>label</code> is the joined selected labels,
          else the placeholder, else undefined (<code>:913</code>). Verify in the browser's accessibility tree: the
          combobox name must be the field label, not the current selection.
        </p>

        <h3>Keep a toggler in every row</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a row whose first cell is plain text</span>
            <div class="dd__stage">
              <p-treeTable [value]="nodes" [pt]="togglerBadPt">
                <ng-template pTemplate="header">
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                  <tr [ttRow]="rowNode">
                    <td>{{ rowData.name }}</td>
                  </tr>
                </ng-template>
              </p-treeTable>
            </div>
            <p class="dd__why">{{ m.ddTogglerBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the toggler first, leaves included</span>
            <div class="dd__stage">
              <p-treeTable [value]="nodes" [pt]="togglerGoodPt">
                <ng-template pTemplate="header">
                  <tr>
                    <th scope="col">Name</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                  <tr [ttRow]="rowNode">
                    <td>
                      <p-treeTableToggler [rowNode]="rowNode" />
                      {{ rowData.name }}
                    </td>
                  </tr>
                </ng-template>
              </p-treeTable>
            </div>
            <p class="dd__why">{{ m.ddTogglerGood }}</p>
          </div>
        </div>
        <p class="src-note">
          <code>onArrowRightKey</code> reads <code>findSingle(currentTarget, 'button').style</code> with no null check
          (<code>openng-optimus-ui-treetable.mjs:4980</code>); the toggler renders for leaves too and hides itself with
          <code>[style.visibility]</code> (<code>:5141-5151</code>), which is why it is the safe way to satisfy that
          lookup.
        </p>

        <h3>Which component for which job</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Job</th>
                <th scope="col">Component</th>
                <th scope="col">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hierarchy, one label per row</td>
                <td><code>p-tree</code></td>
                <td>{{ m.pickTree }}</td>
              </tr>
              <tr>
                <td>Hierarchy with columns</td>
                <td><code>p-treeTable</code></td>
                <td>{{ m.pickTreeTable }}</td>
              </tr>
              <tr>
                <td>Hierarchy as a form value</td>
                <td><code>p-treeSelect</code></td>
                <td>{{ m.pickTreeSelect }}</td>
              </tr>
              <tr>
                <td>One level, no nesting</td>
                <td><code>p-select</code> / <code>p-listbox</code></td>
                <td>{{ m.pickFlat }}</td>
              </tr>
              <tr>
                <td>Reporting lines drawn as a diagram</td>
                <td><code>p-organizationChart</code>, beside a <code>p-tree</code></td>
                <td>{{ m.pickOrgChart }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Roles per row read off <code>openng-optimus-ui-tree.mjs:1997</code>,
          <code>openng-optimus-ui-treetable.mjs:2731</code> and
          <code>openng-optimus-ui-treeselect.mjs:934</code>; the organization chart emits no role at all
          (<code>openng-optimus-ui-organizationchart.mjs:164-225</code>).
        </p>

        <h3>An organization chart is a picture, not a tree</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the chart as the only way to read or pick a node</span>
            <div class="dd__stage dd__stage--scroll">
              <p-organizationChart [value]="orgNodes" [collapsible]="true" selectionMode="single" />
            </div>
            <p class="dd__why">{{ m.ddOrgBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a named tree carries the content; a static chart only illustrates it</span>
            <div class="dd__stage dd__stage--col">
              <p-tree [value]="orgTreeNodes" ariaLabel="Reporting lines" />
              <div class="dd__scroll" aria-hidden="true">
                <p-organizationChart [value]="orgTreeNodes" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddOrgGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The node is a <code>&lt;div (click)&gt;</code> with no tabindex or key handler
          (<code>openng-optimus-ui-organizationchart.mjs:169</code>); the toggle is an
          <code>&lt;a tabindex="0"&gt;</code> without <code>href</code>, role, name, or <code>aria-expanded</code>
          (<code>:180</code>), rendered only under <code>collapsible</code> (<code>:178</code>). Without
          <code>collapsible</code> and <code>selectionMode</code> the chart holds nothing focusable, which is what makes
          <code>aria-hidden</code> on its wrapper safe.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ annotatedSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Aura token chain, p-tree</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Part</th>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>node padding</td>
                <td><code>tree.node.padding</code></td>
                <td>{{ m.tkNodePadding }}</td>
              </tr>
              <tr>
                <td>node selected background</td>
                <td><code>tree.node.selectedBackground</code></td>
                <td>{{ m.tkSelectedBg }}</td>
              </tr>
              <tr>
                <td>node focus ring offset</td>
                <td><code>tree.node.focusRing.offset</code></td>
                <td>{{ m.tkFocusOffset }}</td>
              </tr>
              <tr>
                <td>toggle button size</td>
                <td><code>tree.nodeToggleButton.size</code></td>
                <td>{{ m.tkToggleSize }}</td>
              </tr>
              <tr>
                <td>group indent</td>
                <td><code>tree.indent</code></td>
                <td>{{ m.tkIndent }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from
          <code>&#64;openng/optimus-ui-themes/dist/aura/tree/index.mjs</code>, whose default export is
          <code>&#123;root,node,nodeIcon,nodeToggleButton,loadingIcon,filter,css&#125;</code> — the toggle button is a
          top-level key, not a child of <code>node</code>. The rules that consume the tokens live in
          <code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs</code> and spell the same values differently
          (<code>dt('tree.node.toggle.button.size')</code>, <code>dt('tree.node.selected.background')</code>) — the
          preset carries the flat names, the stylesheet the dotted ones.
        </p>

        <h3>Two indents, one input</h3>
        <p>{{ m.indentProse }}</p>
        <p class="src-note">
          Stylesheet side: <code>padding-inline-start: dt('tree.indent')</code> on
          <code>.p-tree-node-children</code> (<code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs:27</code>).
          Template side: <code>[style.paddingLeft]="level * indentation + 'rem'"</code>
          (<code>openng-optimus-ui-tree.mjs:627</code>), fed by <code>[indentation]="indentation"</code> in the
          virtual-scroll branch alone (<code>:1978</code>); the consuming field is declared without a default
          (<code>:158</code>), so <code>Tree.indentation = 1.5</code> (<code>:1094</code>) reaches it only there.
        </p>

        <h3>Contrast, per style and mode</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Node label on the tree background, per style and mode
            </caption>
            <thead>
              <tr>
                <th scope="col">Style</th>
                <th scope="col">Light</th>
                <th scope="col">Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>{{ m.crLight }}</td>
                <td>{{ m.crDark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The node label is <code>&#123;text.color&#125;</code> on the root's
          <code>&#123;content.background&#125;</code> (<code>&#64;openng/optimus-ui-themes/dist/aura/tree/index.mjs</code>),
          not the kit's <code>--text-color</code>. <code>docs/generated/CONTRAST.MD</code> has no tree row, but its
          "content panel" rows measure exactly that pair (<code>text.color</code> on <code>content.background</code>,
          <code>&#123;surface.0&#125;</code> / <code>&#123;surface.900&#125;</code>), criterion SC 1.4.3 (needs
          4.5:1).
        </p>
        <p class="src-note">{{ m.crGap }}</p>

        <h3>On a narrow screen</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          None of <code>&#64;openng/optimus-ui-styles/dist/tree/index.mjs</code>,
          <code>&#64;openng/optimus-ui-styles/dist/treetable/index.mjs</code> or
          <code>&#64;openng/optimus-ui-styles/dist/treeselect/index.mjs</code> contains a media query.
          <code>.p-tree-root</code> sets <code>overflow: auto</code>, with its height coming from
          <code>[style.max-height]="scrollHeight"</code> (<code>openng-optimus-ui-tree.mjs:1995</code>); the tree
          stylesheet declares no <code>white-space</code> anywhere, while the tree select's label sets
          <code>white-space: nowrap</code> with <code>text-overflow: ellipsis</code>.
        </p>
        <p>{{ m.responsiveOrg }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/organizationchart/index.mjs</code> holds no media query and no
          overflow rule; the chart table is centered with <code>margin: 0 auto</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Keyboard, key by key</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col"><code>p-tree</code></th>
                <th scope="col"><code>p-treeTable</code></th>
                <th scope="col"><code>p-treeSelect</code> input</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ArrowDown / ArrowUp</td>
                <td>{{ m.kbTreeUpDown }}</td>
                <td>{{ m.kbTtUpDown }}</td>
                <td>{{ m.kbTsDown }}</td>
              </tr>
              <tr>
                <td>ArrowRight</td>
                <td>{{ m.kbTreeRight }}</td>
                <td>{{ m.kbTtRight }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>ArrowLeft</td>
                <td>{{ m.kbTreeLeft }}</td>
                <td>{{ m.kbTtLeft }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>Enter / Space</td>
                <td>{{ m.kbTreeEnter }}</td>
                <td>{{ m.kbTtEnter }}</td>
                <td>{{ m.kbTsEnter }}</td>
              </tr>
              <tr>
                <td>Home / End</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbTtHomeEnd }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
              <tr>
                <td>Escape</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbTsEscape }}</td>
              </tr>
              <tr>
                <td>Typeahead</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
                <td>{{ m.kbNone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Switch statements read off <code>openng-optimus-ui-tree.mjs:439</code>,
          <code>openng-optimus-ui-treetable.mjs:4939</code> (plus <code>:4252</code> for Enter and Space) and
          <code>openng-optimus-ui-treeselect.mjs:661</code>. A key absent from a switch is a key the component does
          not handle.
        </p>

        <h3>Labels: one input, one config key, one literal</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">String</th>
                <th scope="col">Where it comes from</th>
                <th scope="col">Reachable?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tree</code> toggle button</td>
                <td>{{ m.lblTreeToggler }}</td>
                <td>{{ m.lblNo }}</td>
              </tr>
              <tr>
                <td><code>p-treeTable</code> toggle button</td>
                <td>{{ m.lblTtToggler }}</td>
                <td>{{ m.lblConfig }}</td>
              </tr>
              <tr>
                <td><code>p-treeSelect</code> dropdown trigger</td>
                <td>{{ m.lblTsTrigger }}</td>
                <td>{{ m.lblNo }}</td>
              </tr>
              <tr>
                <td><code>p-tree</code> filter field</td>
                <td>{{ m.lblTreeFilter }}</td>
                <td>{{ m.lblInput }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>togglerAriaLabel</code> is declared at <code>openng-optimus-ui-tree.mjs:1014</code> and bound in
          neither of that file's node templates; the tree table's label getter is
          <code>openng-optimus-ui-treetable.mjs:5118</code>; the tree select's trigger label is the literal at
          <code>openng-optimus-ui-treeselect.mjs:981</code>.
        </p>

        <h3>What p-organizationChart gives assistive technology</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Part</th>
                <th scope="col">What is rendered</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Structure</td>
                <td>{{ m.ocStructure }}</td>
              </tr>
              <tr>
                <td>Node</td>
                <td>{{ m.ocNode }}</td>
              </tr>
              <tr>
                <td>Toggle (<code>collapsible</code>)</td>
                <td>{{ m.ocToggle }}</td>
              </tr>
              <tr>
                <td>Selection (<code>selectionMode</code>)</td>
                <td>{{ m.ocSelection }}</td>
              </tr>
              <tr>
                <td>Collapsed branch</td>
                <td>{{ m.ocCollapsed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off <code>openng-optimus-ui-organizationchart.mjs</code>, Optimus UI 2.0.2: the root table (<code>:498</code>),
          the node template (<code>:164-225</code>), <code>onNodeClick</code> (<code>:440-474</code>),
          <code>getChildStyle</code> (<code>:123-127</code>), and the selected class (<code>:21</code>). The file contains
          no <code>role=</code> and no <code>aria-</code> attribute.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.chkName }}</li>
          <li>{{ m.chkCaption }}</li>
          <li>{{ m.chkToggler }}</li>
          <li>{{ m.chkTabstops }}</li>
          <li>{{ m.chkExpanded }}</li>
          <li>{{ m.chkState }}</li>
          <li>{{ m.chkOrgChart }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Where each string lives</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">String</th>
                <th scope="col">Source</th>
                <th scope="col">What you do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Node labels</td>
                <td>{{ m.i18nNodesSrc }}</td>
                <td>{{ m.i18nNodesDo }}</td>
              </tr>
              <tr>
                <td>Tree / field name</td>
                <td>{{ m.i18nNameSrc }}</td>
                <td>{{ m.i18nNameDo }}</td>
              </tr>
              <tr>
                <td>Filter placeholder</td>
                <td>{{ m.i18nFilterSrc }}</td>
                <td>{{ m.i18nFilterDo }}</td>
              </tr>
              <tr>
                <td>Expand / collapse row</td>
                <td>{{ m.i18nExpandSrc }}</td>
                <td>{{ m.i18nExpandDo }}</td>
              </tr>
              <tr>
                <td>Tree select trigger</td>
                <td>{{ m.i18nTriggerSrc }}</td>
                <td>{{ m.i18nTriggerDo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Config keys from <code>openng-optimus-ui-treetable.mjs:5118</code>; the untranslatable literal from
          <code>openng-optimus-ui-treeselect.mjs:981</code>. The kit's own convention is a single
          <code>setTranslation</code> merge of the <code>aria</code> block driven by the translation service — the
          reference implementation is <code>syncAriaStrings</code> in <code>OptimusA11yService</code>, run by the root app component.
        </p>

        <h3>Adding the two row keys</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          {{ m.i18nMergeNote }} (<code>openng-optimus-ui-config.mjs:246</code>)
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="checklist">
          <li>{{ m.hist4 }}</li>
          <li>{{ m.hist3 }}</li>
          <li>{{ m.hist2 }}</li>
          <li>{{ m.hist1 }}</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TreeArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly nodes: TreeNode[] = [
    {
      key: '0',
      label: 'Documents',
      data: { name: 'Documents', size: '75 kb' },
      expanded: true,
      children: [
        { key: '0-0', label: 'Invoices', data: { name: 'Invoices', size: '30 kb' } },
        { key: '0-1', label: 'Contracts', data: { name: 'Contracts', size: '45 kb' } },
      ],
    },
    {
      key: '1',
      label: 'Pictures',
      data: { name: 'Pictures', size: '150 kb' },
      children: [{ key: '1-0', label: 'Holiday', data: { name: 'Holiday', size: '150 kb' } }],
    },
  ];

  /** Two copies: toggling writes `expanded` onto the node objects, so the Don't chart
   *  gets its own; in the Do pair the static chart follows the tree's expansion. */
  readonly orgNodes: TreeNode[] = TreeArticleComponent.orgData();
  readonly orgTreeNodes: TreeNode[] = TreeArticleComponent.orgData();

  protected static orgData(): TreeNode[] {
    return [
      {
        label: 'Editor in chief',
        expanded: true,
        children: [
          { label: 'Science desk', expanded: true, children: [{ label: 'Data team' }] },
          { label: 'Design desk' },
        ],
      },
    ];
  }

  readonly selected = signal<TreeNode | null>(null);

  /** Names the treegrid: the caption template renders outside the table, so it cannot. */
  readonly treeTablePt = { table: { 'aria-label': 'Sample folders, by size' } };
  readonly togglerBadPt = { table: { 'aria-label': 'Folders without a toggler column' } };
  readonly togglerGoodPt = { table: { 'aria-label': 'Folders with a toggler column' } };

  readonly nameBadSnippet: string = `<p-treeSelect
  [options]="nodes"
  placeholder="Pick a folder" />`;

  readonly nameGoodSnippet: string = `<p-treeSelect
  [options]="nodes"
  ariaLabel="Destination folder"
  placeholder="Pick a folder" />`;

  readonly emittedMarkupSnippet: string = `<!-- p-tree -->
<ul role="tree" aria-label="Sample folders">
  <p-treeNode>            <!-- component host, between the list and the item -->
    <li role="treeitem" aria-level="1" aria-posinset="1" aria-setsize="2"
        aria-expanded="true" aria-selected="false" tabindex="0">…
      <ul role="group"> <p-treeNode> … </p-treeNode> </ul>
    </li>
  </p-treeNode>
</ul>

<!-- p-treeTable, with ttRow on the row -->
<table role="treegrid">
  <tbody role="rowgroup">
    <tr role="row" aria-level="1" aria-expanded="true" tabindex="0"> … </tr>
  </tbody>
</table>

<!-- p-treeSelect -->
<input role="combobox" aria-haspopup="tree" aria-expanded="false" aria-label="…">`;

  readonly annotatedSnippet: string = `import { TreeModule } from '@openng/optimus-ui/tree';
import type { TreeNode } from '@openng/optimus-ui/api';

// Expansion lives on the node object, not in the component:
// flipping node.expanded in your data expands the tree.
nodes: TreeNode[] = [
  { key: '0', label: 'Documents', expanded: true, children: [ /* … */ ] },
];

// ariaLabel or ariaLabelledBy is not optional — without one the
// tree has no accessible name, and a tree select borrows its value.
<p-tree
  [value]="nodes"
  selectionMode="single"
  [(selection)]="selected"
  ariaLabel="Document folders"
  (onNodeExpand)="load($event.node)"
/>`;

  readonly i18nSnippet: string = `// setTranslation merges one level deep, so spread the current
// aria block or the keys you do not list are lost.
optimus.setTranslation({
  aria: {
    ...(optimus.translation.aria ?? {}),
    expandRow: t('expandRow'),
    collapseRow: t('collapseRow'),
  },
});`;

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    ddNameBad:
      'With neither ariaLabel nor ariaLabelledBy the combobox name falls back to the label expression: the joined selected labels once something is picked, the placeholder before that, and nothing at all if there is no placeholder either. The name changes every time the value does.',
    ddNameGood:
      'ariaLabel wins the fallback outright, so the field is announced by what it is for rather than by what is currently in it, and the announcement does not move when the selection does.',
    ddTogglerBad:
      'No toggler, so no way to open a branch by pointer at all — and ArrowRight on such a row looks up the first button inside it and reads a property off the result without checking for null, so the key raises a TypeError instead of expanding. Tab into this table and press ArrowRight on a row to see it.',
    ddTogglerGood:
      'The toggler is present on every row, leaves included — it hides itself with visibility rather than being removed — so the lookup always finds an element and the row expands.',

    pickTree: 'Nodes are list items with tree semantics emitted for you; nothing to wire.',
    pickTreeTable:
      'You own the row markup, so you own the columns — and the ttRow directive that supplies role, level, and expanded state.',
    pickTreeSelect:
      'Implements ControlValueAccessor, so it binds to ngModel or a reactive control like any other field.',
    pickFlat:
      'A single-level p-tree still announces itself as a tree, which promises a hierarchy that is not there.',
    pickOrgChart:
      'The chart is a visual layout with no roles and a mouse-only selection; it illustrates a hierarchy that must also exist in a form assistive technology can walk.',
    ddOrgBad:
      'Collapsible and selectable, the chart looks interactive, but a keyboard user reaches only the unnamed toggles, never a node; a screen reader hears nested layout tables and blank connector cells with no level, no position, and no expanded or selected state.',
    ddOrgGood:
      'The named p-tree carries the hierarchy with levels, positions, and keyboard. The chart beside it has neither collapsible nor selectionMode, so it holds nothing focusable, and its wrapper is aria-hidden so the layout tables are not read twice.',

    tkNodePadding: '0.25rem 0.5rem',
    tkSelectedBg: '{highlight.background}',
    tkFocusOffset:
      "-1px for Aura's 1px ring — the kit replaces it with its one ring, 2px --primary-color-fg at -2px, inside the node (the toggle button is tabindex -1 and never rings)",
    tkToggleSize: '1.75rem square, border-radius 50%',
    tkIndent: '1rem',

    indentProse:
      'A default tree is indented from one place only: the stylesheet gives every child group a start padding of one indent token. The node content carries a second, inline left padding of level times the indentation input — but that input is passed down in the virtual-scroll branch alone. Without virtualScroll it is never bound, the product is NaN, and the browser drops the declaration, so indentation has no effect at all there. Under virtualScroll both paddings apply, and because the inline one is a physical left padding while the stylesheet uses a logical inline-start, that is also the only case in which the two disagree under RTL.',

    crLight: '10.35:1',
    crDark: '17.72:1',
    crGap:
      'The selected label is {highlight.color} on {highlight.background}, the pair the "table & paginator" rows measure as datatable.row.selected.color on its background (6.59–20.38:1). The kit focus ring, drawn inside the node, is measured in the "focus ring" rows: on content.background (the dialog.background values) 5.18–17.85:1, and as "kit focus ring, inset" on the hover fill and the selection highlight 3.48–17.32:1 (SC 1.4.11, 3:1). Not in the compilat: the node icons ({text.muted.color}) and the organization chart node border ({content.border.color}). The selected node has no bar like the table row, so selection is the fill alone (1.00–1.68:1 against the rest fill) — a design that must tell selected from unselected by more than color adds its own marker.',

    responsive:
      'None of the three components reflows: not one of the three stylesheets carries a media query. The tree root scrolls horizontally; vertically it scrolls only once you set scrollHeight, because that input is what caps its height. Nothing in the tree stylesheet sets white-space, so a long label wraps inside its node rather than being clipped, and deep nesting narrows the label column instead of hiding it. The tree table is a real table and behaves like one — it overflows its container, which is why the kit wraps every table in a scrolling container. The tree select keeps its field width and truncates the selected label with an ellipsis, so a long multi-selection reads as a fragment. Layout guidance: give all three a min-width: 0 flex parent, and prefer the tree over the tree table below roughly 40rem, because a column set that is legible at desktop width is a horizontal scroll on a phone.',

    kbTreeUpDown: 'Moves to the previous/next visible node, crossing levels',
    kbTtUpDown: 'Moves to the previous/next sibling row element',
    kbTsDown: 'Opens the popup when closed; the same handler then focuses the first node, but only once the panel is in the DOM',
    kbTreeRight: 'Expands a collapsed branch, then moves into it; no-op when already expanded',
    kbTtRight: 'Expands a collapsed row; no-op when already expanded',
    kbTreeLeft: 'Collapses an expanded node, else moves to the parent',
    kbTtLeft: 'Collapses an expanded row and restores focus',
    kbTreeEnter: 'Selects the node (Enter, Space, and NumpadEnter)',
    kbTtEnter: 'Only via ttSelectableRow, not ttRow — a row without it ignores both keys',
    kbTsEnter: 'Opens the popup when it is closed',
    kbTtHomeEnd: 'First/last row at the current aria-level, not of the grid',
    kbTsEscape: 'Closes the popup — but only while focus is still on the input',
    kbNone: 'Not handled',

    lblTreeToggler:
      'Nothing. The togglerAriaLabel input exists but is bound in no template, and the button carries no aria-label.',
    lblTtToggler: 'The aria.expandRow / aria.collapseRow keys of the Optimus config translation.',
    lblTsTrigger: 'A hardcoded English string in the template.',
    lblTreeFilter: 'The filterPlaceholder input, rendered as a placeholder attribute only.',
    lblNo: 'No — not without a custom template',
    lblConfig: 'Yes, via setTranslation',
    lblInput: 'Yes, via the input',

    chkName:
      'p-tree and p-treeSelect have an ariaLabel or ariaLabelledBy, and the tree select name does not change when the selection does.',
    chkCaption:
      'p-treeTable carries an accessible name on its table element through pt — not through the caption template, which renders outside the table; sortable headers carry ttSortableColumn so aria-sort is emitted.',
    chkToggler: 'Every p-treeTable row starts with p-treeTableToggler, leaves included.',
    chkTabstops:
      'Tab into the widget once and out again, then back in: only one node or row is a tab stop. Before that first Tab, more than one is.',
    chkExpanded:
      'ArrowRight on an already-expanded node is known not to move focus; if your users need it, handle the key yourself.',
    chkState: 'Expansion and selection are stored on your node objects, and your code treats them as its own state.',
    chkOrgChart:
      'A p-organizationChart never stands alone: the same hierarchy is available as a named p-tree or list, and a chart that is only an illustration has no collapsible or selectionMode.',

    ocStructure:
      'Nested layout tables, one per node, with blank connector cells between levels — no tree, treeitem, or group role, and no role override on the tables.',
    ocNode:
      'A div with a click handler: no tabindex, no key handler, no role. Its label or your node template is plain text.',
    ocToggle:
      'An anchor with tabindex 0 but no href, no role, no accessible name, and no aria-expanded; Enter and Space toggle it. The icon is the only cue, and it points down when the branch is open.',
    ocSelection: 'Pointer only, and shown by a CSS class alone — nothing is announced and no key selects a node.',
    ocCollapsed:
      'Hidden with visibility, so it leaves the accessibility tree while still taking its space in the layout.',
    responsiveOrg:
      'The organization chart does not reflow either: it is a table as wide as its widest level, centered, with no overflow handling of its own. Put it in a container with overflow-x: auto, and on a phone show the tree instead — a four-level chart is a horizontal scroll at 360px.',

    i18nNodesSrc: 'Your data — the label field of each TreeNode.',
    i18nNodesDo: 'Translate at the data layer; the components never touch node text.',
    i18nNameSrc: 'Your template — ariaLabel, ariaLabelledBy, or the pt entry for the tree table.',
    i18nNameDo: 'Bind a translated string; never leave it to the value fallback.',
    i18nFilterSrc: 'Your template — filterPlaceholder.',
    i18nFilterDo: 'Bind a translated string; it is the field’s only accessible name.',
    i18nExpandSrc: 'The Optimus config translation, keys aria.expandRow and aria.collapseRow.',
    i18nExpandDo: 'Add both keys to whatever call assembles the kit’s aria block; a key that call does not list keeps its English default.',
    i18nTriggerSrc: 'A literal in the tree select template.',
    i18nTriggerDo:
      'Unreachable: no input, no config key. Treat the trigger as unnamed in every language and make sure the field itself is named.',
    i18nMergeNote:
      'setTranslation merges one level deep only, so the aria object is replaced wholesale — spread the current block first or every key you did not list reverts to its English default.',

    hist4:
      'v1.3 (2026-09-23) — synced with the contrast and focus rounds: tree nodes, tree-table rows and sort headers wear the kit’s one 2px ring inside their edge; node label and selected pair cited from the gated "content panel" and "table & paginator" rows.',
    hist3:
      'v1.2 (2026-09-23) — p-organizationChart covered (when not to use it, what it renders, narrow screens); node-label contrast re-cited from the token pair the tree actually paints; history newest first.',
    hist1: 'v1 (2026-09-06) — first version, measured against @openng/optimus-ui 2.0.2.',
    hist2:
      'v1.1 (2026-09-06) — review pass: the treegrid is named through pt rather than a caption, indentation is documented as virtual-scroll-only, aria-selected as mode-dependent, and the toggler do/don’t pair now renders.',
  };
}
