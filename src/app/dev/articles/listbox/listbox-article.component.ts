import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MegaMenuItem } from '@openng/optimus-ui/api';
import { ListboxModule } from '@openng/optimus-ui/listbox';
import { MegaMenuModule } from '@openng/optimus-ui/megamenu';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { CascadeSelectDemoComponent } from './cascade-select-demo.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Listbox, MegaMenu, and CascadeSelect (Guides, category `library`).
 *
 * Three components named after three ARIA roles. Every claim below was read off the
 * shipped sources of Optimus UI 2.0.2; `openng-optimus-ui-listbox.mjs`,
 * `openng-optimus-ui-megamenu.mjs` and `openng-optimus-ui-cascadeselect.mjs` are the
 * fesm2022 bundles of those names, and each of them contains its template twice (the
 * compiled declaration and the decorator metadata) — the citations point at the first.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Listbox: `ul` carries `id + '_list'` (openng-optimus-ui-listbox.mjs:1499) and
 *     `role="listbox"` (:1501), items `role="option"` (:1536). `aria-multiselectable` is bound to the literal
 *     `true`, never to `multiple` (:1503). Group headers also carry `role="option"`
 *     and an id from the same sequence (:1521), while `ariaSetSize` filters groups out
 *     (:634-635). Pos-in-set is bound as `[attr.ariaPosInset]` — camelCase, so the DOM
 *     attribute is `ariaposinset` (:1543) — beside a correct `aria-setsize` (:1542).
 *     Per-option checkbox needs `checkbox && multiple` (:1560), header toggle needs
 *     `checkbox && multiple && showToggleAll` (:1383). No `ariaLabelledBy` input, no
 *     `size`, no `variant`; `fluid` is the only signal input (:1353). Defaults:
 *     `scrollHeight = '14rem'` (:258), `metaKeySelection = false` (:319),
 *     `filter = false` (:299), `highlightOnSelect = true` (:421). Filter input is
 *     `role="searchbox"` with `aria-owns` (:1412, :1415). Grep for `matchMedia`
 *     returns nothing in this bundle.
 *   - MegaMenu: MegaMenuSub's host binds `attr.role` to `root ? "menubar" : "menu"`,
 *     and its properties map carries no aria-label and no aria-labelledby
 *     (openng-optimus-ui-megamenu.mjs:280). `ariaLabel`/`ariaLabelledBy`
 *     are declared (:194-195) and forwarded into the sub (:1461, :1466) where nothing
 *     renders them. Items are `li role="menuitem"` (:296) whose anchors are forced to
 *     `tabindex="-1"` (:325). The label branch is `escape` truthy -> interpolated span,
 *     else `[innerHTML]` (:338-347), and `escape` has no default. The panel is
 *     `item.items` = columns, each column an array of submenus (:432-435), matching
 *     `MegaMenuItem.items: MenuItem[][]` in the public types;
 *     `MegaMenuItem` declares no `escape`, but carries `[key: string]: any` (openng-optimus-ui-api.d.ts:752), which
 *     `getItemProp` reads by name, so bar items escape too. `orientation = 'horizontal'` (:750),
 *     `breakpoint = '960px'` (:770), matchMedia guarded by `isPlatformBrowser` (:926).
 *     Ten inputs, zero outputs (:1423).
 *   - CascadeSelect: `role="combobox"` sits on a readonly `input` inside
 *     `.p-hidden-accessible` (openng-optimus-ui-cascadeselect.mjs:1447); the visible text
 *     is a plain `span` (:1467). `aria-haspopup` is `'tree'` (:1456) while the
 *     chevron `div` says `aria-haspopup="listbox"` and is `aria-hidden` (:1486).
 *     `aria-controls` is `id + '_tree'` (:1458); the overlay `ul` binds `role`,
 *     `aria-orientation` and `aria-label` but never an `id` (:1553-1556), and grep for
 *     `_tree` in the bundle returns only the two `aria-controls` lines. Items are
 *     `role="treeitem"` (:279) with `aria-level`/`aria-setsize`/`aria-posinset`
 *     (:280-286) and no `aria-expanded`; nested lists are `role="group"` (:313).
 *     `breakpoint = '960px'` (:629) with a `document.defaultView` feature test rather
 *     than `isPlatformBrowser` (:1402-1404); `mobileActive` is set (:1409) and read by
 *     nothing, the mobile classes keying on `queryMatches()` (:43, :70).
 *   - The three CascadeSelect demos render through `cascade-select-demo.component.ts`,
 *     which loads the package at runtime: `CascadeSelectSub.ɵfac` names `CascadeSelect`
 *     before that class exists (:274 against :452), which only the linker survives and
 *     the Vitest runner does not apply — the reasoning is in that file.
 *   - Tokens from the aura presets under @openng/optimus-ui-themes: the listbox preset
 *     has no `focusRing` key, the cascadeselect root has one that chains to
 *     `form.field.focus.ring` (width 0, style none in aura/base), and the megamenu one has
 *     it only under `mobileButton`, chained to the global `focus.ring`. The rules that
 *     consume them live in the matching packages under @openng/optimus-ui-styles: the
 *     listbox stylesheet marks focus with background and color only (:81-93), megamenu
 *     draws a ring on the mobile button alone (:273-277), cascadeselect's field rule
 *     (:24-29) changes the border color and draws a zero-width outline, and none of the
 *     three stylesheets contains an `@media` rule.
 *   - src/styles.scss re-points the resting edge of `.p-listbox` and `.p-cascadeselect`
 *     to --control-border, gives the cascade select the select's text, dark fill,
 *     invalid token, chevron color, and focus ring (`.p-cascadeselect.p-focus`); those
 *     pairs are rows in docs/generated/CONTRAST.MD ("form field edge", "form field text",
 *     "form field icon"). The keyboard-active option of the listbox and of the
 *     cascade select panel (`.p-focus`) carries the kit ring drawn inside it
 *     ("option list focus"). For p-megaMenu the kit rings the mobile button
 *     (`.p-megamenu-button:focus-visible`) and the keyboard-active
 *     item (`.p-megamenu-item.p-focus > .p-megamenu-item-content`, inside) and
 *     paints its submenu chevron --text-color-secondary. The gate measures the
 *     menubar rows for it ("menu focus"; the megamenu tokens are asserted equal)
 *     and accounts for every Optimus `.p-focus` rule (OPTIMUS_FOCUS_RULES).
 */
@Component({
  selector: 'app-listbox-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, GuideShellComponent, GuideTabDirective, ListboxModule, MegaMenuModule, CascadeSelectDemoComponent],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'listbox'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Three ways to pick something, and three different answers to the question "what is this, in the
          accessibility tree". One is a list you select from, one is a bar of menus, and one calls itself a combobox
          and opens a tree. The names suggest a family; the markup does not.
        </p>

        <h3>All three, rendered</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-listbox</span>
            <p-listbox
              [options]="cities"
              optionLabel="name"
              ariaLabel="Delivery city"
              [ngModel]="city()"
              (ngModelChange)="city.set($event)"
            />
          </div>
          <div class="col">
            <span class="lbl">p-cascadeSelect</span>
            <app-cascade-select-demo
              [options]="regions"
              [optionGroupChildren]="groupChildren"
              placeholder="Select a city"
              ariaLabel="Delivery city"
              [(value)]="cascadeCity"
            />
          </div>
        </div>
        <div class="stage">
          <span class="lbl">p-megaMenu</span>
          <nav aria-label="Product">
            <p-megaMenu [model]="megaModel" />
          </nav>
        </div>
        <p class="src-note">
          Roles read off the shipped templates: <code>openng-optimus-ui-listbox.mjs:1501</code>,
          <code>openng-optimus-ui-megamenu.mjs:280</code> and
          <code>openng-optimus-ui-cascadeselect.mjs:1447</code>.
        </p>

        <h3>What each one puts in the accessibility tree</h3>
        <div class="table-wrap">
          <table>
            <caption>
              ARIA emitted by the three components, Optimus UI 2.0.2
            </caption>
            <thead>
              <tr>
                <th>Attribute</th>
                <th><code>p-listbox</code></th>
                <th><code>p-megaMenu</code></th>
                <th><code>p-cascadeSelect</code></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>container role</td><td>{{ m.roleListbox }}</td><td>{{ m.roleMega }}</td><td>{{ m.roleCascade }}</td></tr>
              <tr><td>item role</td><td><code>option</code></td><td><code>menuitem</code></td><td><code>treeitem</code></td></tr>
              <tr><td><code>aria-label</code></td><td>{{ m.nameListbox }}</td><td>{{ m.nameMega }}</td><td>{{ m.nameCascade }}</td></tr>
              <tr><td><code>aria-labelledby</code></td><td>{{ m.byListbox }}</td><td>{{ m.byMega }}</td><td>{{ m.byCascade }}</td></tr>
              <tr><td><code>aria-activedescendant</code></td><td>{{ m.adYes }}</td><td>{{ m.adYes }}</td><td>{{ m.adYes }}</td></tr>
              <tr><td><code>aria-setsize</code></td><td>{{ m.setListbox }}</td><td>{{ m.setMega }}</td><td>{{ m.setCascade }}</td></tr>
              <tr><td><code>aria-posinset</code></td><td>{{ m.posListbox }}</td><td>{{ m.posMega }}</td><td>{{ m.posCascade }}</td></tr>
              <tr><td><code>aria-expanded</code> on a group</td><td>{{ m.expListbox }}</td><td>{{ m.expMega }}</td><td>{{ m.expCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off <code>openng-optimus-ui-listbox.mjs:1501-1543</code>,
          <code>openng-optimus-ui-megamenu.mjs:280-307</code> and
          <code>openng-optimus-ui-cascadeselect.mjs:279-286</code> plus
          <code>openng-optimus-ui-cascadeselect.mjs:1447-1459</code>.
        </p>
        <p>{{ m.tabindexNote }}</p>
        <p class="src-note">
          The anchor binding is <code>[attr.tabindex]="-1"</code> in the item template
          (<code>openng-optimus-ui-megamenu.mjs:325</code>).
        </p>

        <h3>The MegaMenu model is three levels deep</h3>
        <pre class="code-block"><code>{{ modelShapeSnippet }}</code></pre>
        <p class="src-note">
          The nesting is not a convention you can vary: the panel template iterates
          <code>processedItem.items</code> as columns and each column as submenus
          (<code>openng-optimus-ui-megamenu.mjs:432-435</code>), and the public type declares
          <code>MegaMenuItem.items</code> as <code>MenuItem[][]</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The three do not share a mechanism, so the choice is not cosmetic. Pick by what the thing IS — a value, a
          route, or a value that lives at the bottom of a hierarchy — and then honor the two contracts each of them
          leaves to you: the name, and the flag combinations that actually render something.
        </p>

        <h3>Choosing</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The task</th><th>Component</th><th>Why this one</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.taskAll }}</td><td><code>p-listbox</code></td><td>{{ m.whyListbox }}</td></tr>
              <tr><td>{{ m.taskNav }}</td><td><code>p-megaMenu</code></td><td>{{ m.whyMega }}</td></tr>
              <tr><td>{{ m.taskDeep }}</td><td><code>p-cascadeSelect</code></td><td>{{ m.whyCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The in-place claim is the list the component renders inline
          (<code>openng-optimus-ui-listbox.mjs:1497</code>), against the panel that <code>MegaMenuSub</code>
          hides with <code>style.display</code> (<code>openng-optimus-ui-megamenu.mjs:280</code>) and the
          CascadeSelect overlay; the depth claim is the group branch at
          <code>openng-optimus-ui-cascadeselect.mjs:285</code>, which emits no
          <code>aria-selected</code> for a group.
        </p>

        <h3>Checkbox listbox: one flag is not enough</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — checkbox without multiple</span>
            <div class="dd__stage">
              <p-listbox
                [options]="cities"
                optionLabel="name"
                [checkbox]="true"
                ariaLabel="Cities, checkbox only"
                [ngModel]="ddSingle()"
                (ngModelChange)="ddSingle.set($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddCheckboxBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — checkbox with multiple</span>
            <div class="dd__stage">
              <p-listbox
                [options]="cities"
                optionLabel="name"
                [checkbox]="true"
                [multiple]="true"
                ariaLabel="Cities, multi-select"
                [ngModel]="ddMulti()"
                (ngModelChange)="ddMulti.set($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddCheckboxGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The per-option checkbox is guarded by <code>checkbox &amp;&amp; multiple</code>
          (<code>openng-optimus-ui-listbox.mjs:1560</code>) and the header toggle by
          <code>checkbox &amp;&amp; multiple &amp;&amp; showToggleAll</code> (<code>:1383</code>).
        </p>

        <h3>CascadeSelect: the visible text and the name are two different nodes</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — no placeholder, no name</span>
            <div class="dd__stage">
              <app-cascade-select-demo [options]="regions" [optionGroupChildren]="groupChildren" />
              <pre class="code-block"><code>{{ ddCascadeBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddCascadeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — placeholder plus ariaLabel</span>
            <div class="dd__stage">
              <app-cascade-select-demo
                [options]="regions"
                [optionGroupChildren]="groupChildren"
                placeholder="Select a city"
                ariaLabel="Delivery city"
              />
              <pre class="code-block"><code>{{ ddCascadeGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddCascadeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The empty field is the <code>span</code> at
          <code>openng-optimus-ui-cascadeselect.mjs:1467</code>; the name lives on the hidden input at
          <code>:1447-1455</code>, which is also why a <code>&lt;label for&gt;</code> has to target
          <code>inputId</code>.
        </p>

        <h3>MegaMenu bar labels go through innerHTML</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — markup in a bar label</span>
            <div class="dd__stage">
              <nav aria-label="Markup demo, don't">
                <p-megaMenu [model]="escapeBadModel" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — escape: true on the bar item</span>
            <div class="dd__stage">
              <nav aria-label="Markup demo, do">
                <p-megaMenu [model]="escapeGoodModel" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The branch is <code>escape</code> truthy → interpolated span, anything else →
          <code>[innerHTML]</code> (<code>openng-optimus-ui-megamenu.mjs:338-347</code>), and
          <code>escape</code> has no default (<code>openng-optimus-ui-api.d.ts:476</code>).
          <code>MegaMenuItem</code> declares no <code>escape</code>, but it carries
          <code>[key: string]: any</code> (<code>openng-optimus-ui-api.d.ts:752</code>), and bar and columns
          are the same <code>MegaMenuSub</code> template, so a bar item takes the escaping branch too.
        </p>

        <h3>Naming each of the three</h3>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>
        <p class="src-note">
          <code>ariaLabel</code> reaches the list on <code>openng-optimus-ui-listbox.mjs:1507</code> and the
          hidden input on <code>openng-optimus-ui-cascadeselect.mjs:1454</code>. For MegaMenu the input is
          forwarded into <code>MegaMenuSub</code> (<code>openng-optimus-ui-megamenu.mjs:1461</code>) and that
          component's host binds no name attribute (<code>:280</code>), so the wrapper carries it instead.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Listbox pattern</a
            >
            — the role, selection, and naming contract <code>p-listbox</code> is checked against.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Menu and Menubar pattern</a
            >
            — the keyboard and naming contract of the menubar <code>p-megaMenu</code> renders.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Combobox pattern</a
            >
            — what a combobox owes its popup, here a tree, including the <code>aria-controls</code> reference.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 a field edge and a focus ring have to meet.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Two of the three take their surface from the form-field chain and one from the content chain. The kit
          re-points the two field edges to <code>--control-border</code>, like the select and textarea beside them,
          and treats the closed cascade select as the select it is: same text, dark fill, chevron color, invalid red,
          and 2px focus ring. MegaMenu gets that ring on its mobile button
          (<code>.p-megamenu-button:focus-visible</code>) and a <code>--text-color-secondary</code> submenu chevron.
          Inside the lists, the keyboard-active listbox and cascade select option and the keyboard-active mega menu
          item carry the same ring drawn inside them; no focus mark is left to background and color alone.
        </p>

        <h3>Aura preset roots</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Component</th><th>Root background / border</th><th>Focus ring in the preset</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-listbox</code></td><td>{{ m.tokListbox }}</td><td>{{ m.ringListbox }}</td></tr>
              <tr><td><code>p-megaMenu</code></td><td>{{ m.tokMega }}</td><td>{{ m.ringMega }}</td></tr>
              <tr><td><code>p-cascadeSelect</code></td><td>{{ m.tokCascade }}</td><td>{{ m.ringCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names from
          <code>&#64;openng/optimus-ui-themes/dist/aura/listbox/index.mjs</code>,
          <code>&#64;openng/optimus-ui-themes/dist/aura/megamenu/index.mjs</code> and
          <code>&#64;openng/optimus-ui-themes/dist/aura/cascadeselect/index.mjs</code>; the rules that consume
          them from the matching packages under <code>&#64;openng/optimus-ui-styles</code>.
        </p>

        <h3>Contrast: what this guide may cite, and what it may not</h3>
        <div class="table-wrap">
          <table>
            <caption>
              The pairs these components owe, and where the contrast gate stands on each (every style, both modes)
            </caption>
            <thead>
              <tr><th>Pair</th><th>On</th><th>Row in the compilat?</th><th>Criterion</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.crEdgePair }}</td><td><code>p-listbox</code>, <code>p-cascadeSelect</code></td><td>{{ m.crEdgeRow }}</td><td>{{ m.crEdge }}</td></tr>
              <tr><td>{{ m.crFieldPair }}</td><td><code>p-cascadeSelect</code></td><td>{{ m.crFieldRow }}</td><td>{{ m.crField }}</td></tr>
              <tr><td>{{ m.crOptionPair }}</td><td><code>p-listbox</code>, <code>p-cascadeSelect</code></td><td>{{ m.crOptionRow }}</td><td>{{ m.crOption }}</td></tr>
              <tr><td>{{ m.crFocusPair }}</td><td><code>p-megaMenu</code></td><td>{{ m.crFocusRow }}</td><td>{{ m.crFocus }}</td></tr>
              <tr><td>{{ m.crTextPair }}</td><td>all three</td><td>{{ m.crNone }}</td><td>{{ m.crText }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> measures the two field edges under their own names
          (<code>listbox.border.color</code>, <code>cascadeselect.border.color</code>), because
          <code>src/styles.scss</code> re-points each component's own token (the <code>.p-listbox</code> and
          <code>.p-cascadeselect</code> rules) rather than the shared <code>form.field.border.color</code>, which
          Optimus resolves on <code>:root</code>. The active option's ring is in the kit's one ring rule
          (<code>.p-listbox-option.p-focus</code>,
          <code>.p-cascadeselect-option.p-focus &gt; .p-cascadeselect-option-content</code>, offset -2px) and measured
          on the option fills it meets ("option list focus"). The mega menu item's ring
          (<code>.p-megamenu-item.p-focus &gt; .p-megamenu-item-content</code>, inside) and its chevron are measured
          through the menubar rows ("menu focus"): the gate asserts the megamenu's panel and chevron tokens equal the
          menubar's. The option text has no row: that is Aura's <code>list.option.*</code>, which no kit rule
          re-points.
        </p>
        <p class="src-note">
          Focus on the closed cascade select: the kit's <code>.p-cascadeselect.p-focus</code> rule draws 2px solid
          <code>--primary-color-fg</code> at 2px offset plus a border in the same color (<code>!important</code>, both
          modes) — the select's ring, gated as "focus ring" (3.88:1 and up).
        </p>

        <h3>Narrow viewports</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          Neither <code>&#64;openng/optimus-ui-styles/dist/listbox/index.mjs</code> nor its megamenu and
          cascadeselect counterparts contain an <code>&#64;media</code> rule; the breakpoints are JavaScript
          (<code>openng-optimus-ui-megamenu.mjs:928</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:1404</code>), and the listbox cap is the inline
          <code>max-height</code> bound to <code>scrollHeight</code> over a container with
          <code>overflow: auto</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          The three overlap far less than the family resemblance suggests. What follows is what belongs to exactly
          one of them, what is declared but never rendered, and the two different ways two of them ask the browser
          about its width.
        </p>

        <h3>Selectors and shape</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Component</th><th>Accepted selectors</th><th>Outputs</th></tr>
            </thead>
            <tbody>
              <tr><td>Listbox</td><td>{{ m.selListbox }}</td><td>{{ m.outListbox }}</td></tr>
              <tr><td>MegaMenu</td><td>{{ m.selMega }}</td><td>{{ m.outMega }}</td></tr>
              <tr><td>CascadeSelect</td><td>{{ m.selCascade }}</td><td>{{ m.outCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selector strings and output maps from the compiled declarations:
          <code>openng-optimus-ui-listbox.mjs:1353</code>, <code>openng-optimus-ui-megamenu.mjs:1423</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:1441</code>.
        </p>

        <h3>Inputs only one of the three has</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>On</th><th>What it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>virtualScroll</code>, <code>dragdrop</code>, <code>filter</code></td><td><code>p-listbox</code></td><td>{{ m.onlyListbox }}</td></tr>
              <tr><td><code>size</code>, <code>variant</code>, <code>appendTo</code>, <code>motionOptions</code></td><td><code>p-cascadeSelect</code></td><td>{{ m.onlyCascade }}</td></tr>
              <tr><td><code>orientation</code></td><td><code>p-megaMenu</code></td><td>{{ m.onlyMega }}</td></tr>
              <tr><td><code>fluid</code></td><td>{{ m.fluidWhere }}</td><td>{{ m.fluidWhat }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Compiled input lists, <code>openng-optimus-ui-listbox.mjs:1353</code>,
          <code>openng-optimus-ui-megamenu.mjs:1423</code> and
          <code>openng-optimus-ui-cascadeselect.mjs:1441</code>; the MegaMenu default is at
          <code>openng-optimus-ui-megamenu.mjs:750</code>.
        </p>

        <h3>Declared and then dropped</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Declared at</th><th>What happens to it</th></tr>
            </thead>
            <tbody>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td><code>openng-optimus-ui-megamenu.mjs:194-195</code></td><td>{{ m.deadMegaName }}</td></tr>
              <tr><td><code>mobileActive</code></td><td><code>openng-optimus-ui-cascadeselect.mjs:1332</code></td><td>{{ m.deadMobileActive }}</td></tr>
              <tr><td><code>aria-controls</code> target</td><td><code>openng-optimus-ui-cascadeselect.mjs:1458</code></td><td>{{ m.deadControls }}</td></tr>
              <tr><td><code>[attr.ariaPosInset]</code></td><td><code>openng-optimus-ui-listbox.mjs:1543</code></td><td>{{ m.deadPosInset }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Each row is a binding that exists in the shipped template or class body and produces no reachable effect.
          The <code>mobileActive</code> row is the absence of a read: the signal is declared
          (<code>openng-optimus-ui-cascadeselect.mjs:1332</code>) and set (<code>:1409</code>), and no expression
          in the bundle takes its value.
        </p>

        <h3>Two components, two different width guards</h3>
        <pre class="code-block"><code>{{ matchMediaSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-megamenu.mjs:926-928</code> and
          <code>openng-optimus-ui-cascadeselect.mjs:1402-1404</code>. The difference matters when the component
          is rendered on a server: one is switched off by platform, the other by whether a
          <code>defaultView</code> with <code>matchMedia</code> exists.
        </p>

        <h3>Checklist before shipping any of the three</h3>
        <ul class="checklist">
          <li>{{ m.chkName }}</li>
          <li>{{ m.chkFlags }}</li>
          <li>{{ m.chkEscape }}</li>
          <li>{{ m.chkFocus }}</li>
          <li>{{ m.chkEdge }}</li>
          <li>{{ m.chkMulti }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Some of the strings these components announce never pass through your template. They are read out of the
          library's own translation config, which means translating the page is not the same as translating the
          component.
        </p>

        <h3>Strings the library supplies for itself</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Component</th><th>Where it comes from</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.i18nToggleAll }}</td><td><code>p-listbox</code></td><td><code>translation.aria.selectAll</code> / <code>unselectAll</code></td></tr>
              <tr><td>{{ m.i18nEmptyFilter }}</td><td><code>p-listbox</code></td><td>{{ m.i18nEmptyChain }}</td></tr>
              <tr><td>{{ m.i18nNav }}</td><td><code>p-megaMenu</code></td><td><code>translation.aria.navigation</code></td></tr>
              <tr><td>{{ m.i18nListLabel }}</td><td><code>p-cascadeSelect</code></td><td><code>getTranslation(ARIA).listLabel</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-listbox.mjs:643-644</code> and <code>:622-623</code>,
          <code>openng-optimus-ui-megamenu.mjs:1439</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:792-793</code>.
        </p>

        <h3>The counted message uses a positional token</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-listbox.mjs:631-632</code> replaces every <code>&#123;0&#125;</code> in the
          configured string, and picks the selection count or the empty-selection message depending on whether
          anything is selected — so a translation that drops the token loses the number silently.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.3</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the keyboard-active
            mega menu item takes the kit ring inside it and its chevron is <code>--text-color-secondary</code>, both
            measured through the menubar rows ("menu focus"); the lead, contrast table, and checklist no longer name a
            background-only focus mark.
          </li>
          <li>
            <strong>v1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the listbox and cascade
            select edges are now the kit's <code>--control-border</code> with rows of their own in "form field edge",
            the closed cascade select takes the select's text, chevron, invalid red, and 2px ring
            (<code>.p-cascadeselect.p-focus</code>), and the mega menu's mobile button and the keyboard-active listbox
            and cascade select option the same ring ("option list focus"); the lead, contrast table, and checklist say
            so. The mega menu item still marks focus by background alone.
          </li>
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            the cascade select's focus ring is stated as resolving to width 0 (border color only); the Design tab
            names the stock resting edge of listbox and cascade select, which no kit rule re-points, and replaces
            the per-style "no row" grid with the three pairs these components owe; closing Sources added to Usage.
          </li>
          <li><strong>v1.0</strong> — first published. Measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-listbox-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-listbox-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-listbox-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 1.5rem;
      }

      app-listbox-article .col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      app-listbox-article .lbl {
        font-size: 0.72rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      app-listbox-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-listbox-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.9rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-listbox-article .dd__stage {
        padding: 0.6rem 0;
      }

      app-listbox-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-listbox-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-listbox-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-listbox-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-listbox-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-listbox-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ListboxArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly cities = [
    { name: 'Bremen', code: 'HB' },
    { name: 'Dresden', code: 'DD' },
    { name: 'Kiel', code: 'KI' },
    { name: 'Mainz', code: 'MZ' },
  ];

  readonly groupChildren = ['states', 'cities'];

  /**
   * CascadeSelect declares `options` as `string[] | string | undefined`, so binding a hierarchy
   * of objects — the only thing the component is for — straight to `<p-cascadeSelect>` needs a
   * cast (`as unknown as string[]`) under `strictTemplates`. Here it reaches the component through
   * `app-cascade-select-demo`, whose `createComponent` bindings are untyped, so no cast appears.
   * Listbox's `options` is `any[]`; MegaMenu has no `options` input, its hierarchy arriving
   * through `model` as `MegaMenuItem[]`.
   */
  readonly regions = [
    {
      name: 'Nord',
      states: [
        { name: 'Schleswig-Holstein', cities: [{ city: 'Kiel' }, { city: 'Lübeck' }] },
        { name: 'Bremen', cities: [{ city: 'Bremen' }, { city: 'Bremerhaven' }] },
      ],
    },
    {
      name: 'Ost',
      states: [{ name: 'Sachsen', cities: [{ city: 'Dresden' }, { city: 'Leipzig' }] }],
    },
  ];

  readonly megaModel: MegaMenuItem[] = [
    {
      label: 'Hardware',
      items: [
        [
          { label: 'Displays', items: [{ label: 'Monitors', escape: true }, { label: 'Projectors', escape: true }] },
          { label: 'Input', items: [{ label: 'Keyboards', escape: true }, { label: 'Mice', escape: true }] },
        ],
        [{ label: 'Storage', items: [{ label: 'SSD', escape: true }, { label: 'NAS', escape: true }] }],
      ],
    },
    {
      label: 'Software',
      items: [[{ label: 'Tools', items: [{ label: 'Editors', escape: true }, { label: 'Terminals', escape: true }] }]],
    },
  ];

  readonly escapeBadModel: MegaMenuItem[] = [
    { label: 'Deals <strong>new</strong>', items: [[{ label: 'Offers', items: [{ label: 'Bundles', escape: true }] }]] },
  ];

  readonly escapeGoodModel: MegaMenuItem[] = [
    { label: 'Deals <strong>new</strong>', escape: true, items: [[{ label: 'Offers', items: [{ label: 'Bundles', escape: true }] }]] },
  ];

  readonly city = signal<{ name: string; code: string } | null>(null);
  readonly cascadeCity = signal<unknown>(null);
  readonly ddSingle = signal<{ name: string; code: string } | null>(null);
  readonly ddMulti = signal<{ name: string; code: string }[]>([]);

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    roleListbox: 'listbox, on the ul',
    roleMega: 'menubar on the root list, menu on every panel list',
    roleCascade: 'combobox on a hidden input, tree on the overlay list',
    nameListbox: 'rendered from ariaLabel',
    nameMega: 'input exists, nothing renders it',
    nameCascade: 'rendered from ariaLabel',
    byListbox: 'no such input',
    byMega: 'input exists, nothing renders it',
    byCascade: 'rendered from ariaLabelledBy',
    adYes: 'yes',
    setListbox: 'yes, and it excludes group headers',
    setMega: 'yes',
    setCascade: 'yes, the length of the current level',
    posListbox: 'no — the binding produces ariaposinset instead',
    posMega: 'yes',
    posCascade: 'yes',
    expListbox: 'not applicable, groups are options',
    expMega: 'yes, on a group item',
    expCascade: 'no, group treeitems carry none',

    taskAll: 'Every choice must stay on screen and be usable without opening anything',
    taskNav: 'Top-level navigation whose entries open a panel of link columns',
    taskDeep: 'One value that sits at the bottom of a hierarchy of groups',
    whyListbox: 'The only one of the three that renders its whole option set in place, with no trigger and no overlay.',
    whyMega: 'The only one whose model is columns of submenus rather than a flat list.',
    whyCascade: 'Its intermediate levels are groups you traverse, and a group cannot be selected.',

    ddCheckboxBad:
      'The checkbox flag alone renders no checkbox and no toggle-all: both are guarded by multiple as well, so the list looks like an ordinary single-select and the affordance the caller asked for is silently absent.',
    ddCheckboxGood:
      'With both flags the per-option checkbox and the header toggle appear, which is the only configuration in which the checkbox input has any visible effect.',
    ddCascadeBad:
      'The visible label is a plain span, so with no value and no placeholder the field shows nothing at all — and with no ariaLabel the hidden combobox has no name either, leaving the control unlabeled in both channels at once.',
    ddCascadeGood:
      'The placeholder fills the visible span and ariaLabel names the hidden input, so the sighted reader and the accessibility tree get an answer from different nodes, which is how this component is built.',
    ddEscapeBad:
      'A bar label containing markup is rendered through innerHTML, so the tags are interpreted rather than shown: escape is unset on this item and has no default, which puts the label in that branch.',
    ddEscapeGood:
      'The same label with escape: true takes the interpolating branch and shows the markup as text. MegaMenuItem does not declare escape, but it carries an index signature, and the bar runs the same item template as the columns.',

    tokListbox: 'form.field.background / form.field.border.color',
    tokMega: 'content.background / content.border.color',
    tokCascade: 'form.field.background / form.field.border.color, plus hover and focus border colors',
    ringListbox: 'none — the preset has no focusRing key, and the stylesheet marks focus with option background and text color only; in this kit the active option takes the kit ring (below)',
    ringMega: 'only for the mobile hamburger button (megamenu.mobile.button.focus.ring.*); Aura marks items by navigation.item.focus.background alone — in this kit the active item takes the kit ring (below)',
    ringCascade:
      'a key that resolves to nothing: cascadeselect.focus.ring chains to form.field.focus.ring, which Aura ships as width 0, style none — in this kit the .p-cascadeselect.p-focus rule draws the 2px ring instead (below)',

    crNone: 'no row',
    crEdgePair: 'resting edge: --control-border (kit rule; Aura stock surface.300 / surface.600) on ground, card, and the field fill',
    crEdgeRow:
      '"form field edge": listbox.border.color 3.85–6.57:1, cascadeselect.border.color 3.25–5.51:1',
    crEdge: 'SC 1.4.11, 3:1 wherever the edge is what identifies the field — always for the closed cascade select. Met in every style and mode',
    crFieldPair: 'closed field: value text, placeholder, and dropdown chevron on the field fill',
    crFieldRow:
      '"form field text" (value 9.35:1 and up, placeholder 4.76:1 and up) and "form field icon" (chevron, --text-color-secondary, 4.79–7.78:1)',
    crField: 'SC 1.4.3, 4.5:1 for the text; SC 1.4.11, 3:1 for the chevron. Met in every style and mode',
    crOptionPair: 'the keyboard-active option: the kit ring (2px --primary-color-fg, inside the option) against the option fill — resting, focus tint, selected',
    crOptionRow: '"option list focus": 3.48:1 and up over all option lists; the listbox rows 4.45:1 and up',
    crOption: 'SC 1.4.11, 3:1, and SC 2.4.7 — met in every style, accent, and mode (the focus tint alone is 1.10–1.19:1)',
    crFocusPair: 'the keyboard-active mega menu item: the kit ring (2px --primary-color-fg, inside the item) on the focus background and the panel, and the --text-color-secondary chevron',
    crFocusRow:
      '"menu focus" (menubar rows stand for it): ring 4.73:1 and up, chevron 4.76:1 and up; the focus tint alone is 1.10–1.19:1 (informational)',
    crTextPair: 'option and item text on the resting, focused, and selected backgrounds',
    crText: 'SC 1.4.3, 4.5:1 at the preset font sizes',
    tabindexNote:
      'MegaMenu goes further than the virtual cursor: every item anchor is pinned to ' +
      'tabindex="-1", so the roving focus is the only way in and a browser-native Tab ' +
      'into a menu item never happens.',
    crFocus:
      'SC 1.4.11, 3:1, and SC 2.4.7 — met by the ring in every style, accent, and mode; the focus background is no longer the only mark',
    responsive:
      'p-listbox has no responsive behavior and no breakpoint: it keeps its intrinsic width at every viewport and caps its own height at scrollHeight (14rem by default), scrolling inside that. p-megaMenu and p-cascadeSelect both switch layout at a JavaScript breakpoint of max-width 960px — the mega menu collapses its bar behind a hamburger button and the cascade select turns its side-flyout levels into indented inline lists. Layout guidance: give the listbox a min-width: 0 flex parent if it must shrink, and set breakpoint explicitly on the other two rather than relying on 960px matching your grid.',

    selListbox: 'p-listbox, p-listBox, p-list-box',
    selMega: 'p-megaMenu, p-megamenu, p-mega-menu',
    selCascade: 'p-cascadeSelect, p-cascadeselect, p-cascade-select',
    outListbox: 'onChange, onClick, onDblClick, onFilter, onFocus, onBlur, onSelectAllChange, onLazyLoad, onDrop',
    outMega: 'none at all — activation runs through each item command',
    outCascade: 'onChange, onGroupChange, onShow, onHide, onClear, onBeforeShow, onBeforeHide, onFocus, onBlur',

    onlyListbox: 'Virtualized rows, CDK drag-and-drop reordering, and a built-in filter field with role searchbox.',
    onlyCascade: 'Field sizing, filled or outlined variant, overlay target, and the overlay motion options.',
    onlyMega: 'Horizontal or vertical bar; it also selects which submenu chevron is drawn.',
    fluidWhere: 'p-listbox and p-cascadeSelect',
    fluidWhat: 'A signal input on both; p-megaMenu has no width input of any kind.',

    deadMegaName:
      'Forwarded into the sub component, whose host properties map carries no aria-label and no aria-labelledby — so neither input reaches the DOM.',
    deadMobileActive:
      'Set to false by the resize listener and never read: both mobile classes key on queryMatches() instead.',
    deadControls:
      'References an id of the form <id>_tree that no element in the bundle is given, because the overlay list binds role, aria-orientation, and aria-label but never id.',
    deadPosInset:
      'The attribute name is camelCase, so the DOM receives ariaposinset; the correctly spelled aria-setsize sits on the same element.',

    chkName: 'Every instance has a name: ariaLabel on the listbox and the cascade select, a labeled nav wrapper around the mega menu.',
    chkFlags: 'checkbox is never set without multiple.',
    chkEscape: 'Every item whose label is not a literal you wrote carries escape: true, bar entries included.',
    chkFocus:
      'Outside this kit, the theme gives the mega menu item a focus mark that is not a color change alone (its preset ships no ring); here the kit already rings the active item inside, like the active listbox and cascade select option (gated, "menu focus").',
    chkEdge:
      'Outside this kit, the resting edge of the listbox and the cascade select is re-pointed to clear 3:1 against its ground; here the kit already does it (--control-border, gated).',
    chkMulti: 'A single-select listbox is documented as announcing aria-multiselectable, since the binding is a literal on the ul the component renders itself.',

    i18nToggleAll: 'The header toggle-all checkbox label',
    i18nEmptyFilter: 'The message shown when a filter matches nothing',
    i18nEmptyChain: 'emptyFilterMessage input, else translation.emptySearchMessage, else translation.emptyFilterMessage, else an empty string',
    i18nNav: 'The mobile hamburger button label',
    i18nListLabel: 'The accessible name of the overlay tree',
  };

  readonly modelShapeSnippet =
    '// MegaMenuItem.items is MenuItem[][] — an array of COLUMNS, not of links.\n' +
    'readonly model: MegaMenuItem[] = [\n' +
    '  {\n' +
    "    label: 'Hardware',            // level 1: the bar entry\n" +
    '    items: [\n' +
    '      [                           // level 2: one column of the panel\n' +
    "        { label: 'Displays',      // level 3: a submenu inside that column\n" +
    "          items: [{ label: 'Monitors', escape: true }] },\n" +
    "        { label: 'Input', items: [{ label: 'Keyboards', escape: true }] },\n" +
    '      ],\n' +
    "      [ { label: 'Storage', items: [{ label: 'SSD', escape: true }] } ],\n" +
    '    ],\n' +
    '  },\n' +
    '];';

  /**
   * The library markup the two CascadeSelect stages above stand for.
   *
   * What renders there is `<app-cascade-select-demo>`, a kit wrapper that exists only
   * because the 2.0.2 bundle cannot be evaluated unlinked — and a reader harvesting
   * the do/don't pairs (`design-guides.mjs blocks dodont`) would otherwise be shown
   * that selector, with `optionLabel` and `optionGroupLabel` hidden inside it. The
   * harvest substitutes string constants, so putting the real markup in one puts
   * `p-cascadeSelect` back in front of whoever reads the pair.
   */
  readonly ddCascadeBadSnippet =
    '<!-- what this stage is: no placeholder, and no name on the hidden input -->\n' +
    '<p-cascadeSelect\n' +
    '  [options]="regions" optionLabel="city" optionGroupLabel="name"\n' +
    '  [optionGroupChildren]="[\'states\', \'cities\']" />';

  readonly ddCascadeGoodSnippet =
    '<!-- the visible span and the accessible name are two different nodes -->\n' +
    '<p-cascadeSelect\n' +
    '  [options]="regions" optionLabel="city" optionGroupLabel="name"\n' +
    '  [optionGroupChildren]="[\'states\', \'cities\']"\n' +
    '  placeholder="Select a city" ariaLabel="Delivery city" />';

  readonly namingSnippet =
    '<!-- listbox: ariaLabel is the only naming input; there is no ariaLabelledBy -->\n' +
    '<p-listbox [options]="cities" optionLabel="name" ariaLabel="Delivery city" />\n\n' +
    '<!-- cascade select: the name goes on the hidden combobox input -->\n' +
    '<label [attr.for]="\'city-input\'">Delivery city</label>\n' +
    '<p-cascadeSelect inputId="city-input" [options]="regions" optionLabel="city" />\n\n' +
    '<!-- mega menu: the component renders no name, so the landmark carries it -->\n' +
    '<nav aria-label="Product"><p-megaMenu [model]="model" /></nav>';

  readonly matchMediaSnippet =
    '// MegaMenu — guarded by the Angular platform id\n' +
    'bindMatchMediaListener() {\n' +
    '  if (isPlatformBrowser(this.platformId)) {\n' +
    '    const query = window.matchMedia(`(max-width: ${this.breakpoint})`);\n' +
    '  }\n' +
    '}\n\n' +
    '// CascadeSelect — guarded by feature detection on the document view\n' +
    'bindMatchMediaListener() {\n' +
    '  const window = this.document.defaultView;\n' +
    '  if (window && window.matchMedia) {\n' +
    '    const query = window.matchMedia(`(max-width: ${this.breakpoint})`);\n' +
    '  }\n' +
    '}';

  readonly i18nSnippet =
    '// Listbox builds its live-region message by positional replacement, not by key\n' +
    "// selectionMessage input, else config.translation.selectionMessage, else ''\n" +
    '//   "{0} items selected"  ->  "3 items selected"\n' +
    '//   a translation without {0} renders without the number, and nothing warns\n\n' +
    '<p-listbox [options]="cities" optionLabel="name" [multiple]="true"\n' +
    '           selectionMessage="{0} Orte ausgewählt"\n' +
    '           emptySelectionMessage="Kein Ort ausgewählt"\n' +
    '           ariaLabel="Lieferort" />';
}
