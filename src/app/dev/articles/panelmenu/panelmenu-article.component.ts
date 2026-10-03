import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import type { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { PanelMenuModule } from '@openng/optimus-ui/panelmenu';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: PanelMenu (Guides, category `library`).
 *
 * The `.mjs` files named below are the fesm2022 bundles of `@openng/optimus-ui`
 * at 2.0.2; the stylesheet is `@openng/optimus-ui-styles/dist/panelmenu/index.mjs`,
 * the preset `@openng/optimus-ui-themes/dist/aura/panelmenu/index.mjs`.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-panelmenu.mjs unless stated)
 *   - Three components in one bundle: PanelMenu (:1077, selector :1471), PanelMenuList
 *     (:650, ul[pPanelMenuList]) and PanelMenuSub (:160, ul[pPanelMenuSub]).
 *   - Header: div role="button" (:1331) with a literal [tabindex]="0" (:1330),
 *     aria-expanded (:1333), aria-label from the raw label (:1334), aria-controls
 *     (:1335), aria-disabled (:1336); the panel body is div role="region" (:1435)
 *     with aria-labelledby (:1437). Ids from getHeaderId/getContentId (:1223-1228).
 *   - Tree: PanelMenuSub host binds role="tree" (:607), [tabindex]="-1" (:608),
 *     aria-activedescendant (:609), aria-hidden="!parentExpanded" (:610). Rows are
 *     li role="treeitem" (:256) with aria-label (:258), aria-expanded only for
 *     groups (:259), aria-level/setsize/posinset (:260-262). Separators are
 *     li role="separator" (:252), a direct child of the tree.
 *   - Row anchors are tabbable while the panel is open: [attr.tabindex]="!!parentExpanded
 *     ? '0' : '-1'" on the url branch (:282) and on the routerLink branch (:344);
 *     the header's own anchors are hard-wired to -1 (:1348, :1398).
 *   - The activedescendant cursor desyncs from Tab: onFocus only acts when not yet
 *     focused (:791-798), onBlur only when focus left the list element (:799-806).
 *   - Focus styling: .p-panelmenu-item-link outline: 0 none in the Optimus override
 *     (:26-29); the row style is a background swap on .p-focus (styles :135); the
 *     header is outline: 0 none (styles :30) with a :focus-visible background swap
 *     (styles :70). No outline anywhere in either stylesheet. The kit
 *     (src/styles.scss) rings the header content on :focus-visible, the
 *     .p-focus row content, and the row content whose anchor has DOM focus
 *     (:has(> .p-panelmenu-item-link:focus-visible)) with its one 2px ring, and
 *     re-points the chevron and the item/header icon to --text-color-secondary.
 *   - Keyboard: PanelMenu.onHeaderKeyDown :1273-1294 (ArrowDown :1295, ArrowUp :1300,
 *     Home :1306, End :1310, Enter/Space :1314); PanelMenuList.onKeyDown :826-868 with
 *     ArrowDown :869, ArrowUp :874, ArrowLeft :879, ArrowRight :893, Home :910, End :914,
 *     Enter :918, Space :926, typeahead default arm :864-867 -> searchItems :943-984
 *     (buffer cleared after 500 ms, :978-981). Escape/Tab/PageUp/PageDown/Backspace
 *     are an explicit NOOP arm (:853-861). ArrowUp on the first row falls into
 *     changeFocusedItem's else branch (:775-784) and emits headerFocus.
 *   - State: onHeaderClick writes item.expanded (:1269) after clearing the siblings
 *     when !multiple (:1262-1268); collapseAll() writes it too (:1188-1192);
 *     PanelMenu.isItemActive is item.expanded and nothing else (:1208-1209). The model is
 *     iterated with track item (:1321), i.e. by identity.
 *   - Dead inputs: tabindex (declared :1123, forwarded :1453 -> :992) reaches only
 *     PanelMenuSub, whose host tabindex is the literal -1 (:608); transitionOptions
 *     (:1100) is forwarded (:1450, :996, :406) and never bound to the motion
 *     directive, which takes computedMotionOptions (:1441).
 *   - Templates: the plain header branch is guarded by !itemTemplate (:1344), the
 *     routerLink header branch (:1387) sits after the outlet (:1386) and is not.
 *   - escape: unset renders text on both levels (:1370 header, :313 row); false takes
 *     the [innerHTML] branch (:1376, :321). The bundle contains no bypassSecurityTrust
 *     and no SafeHtml pipe, so Angular's sanitizer runs.
 *   - onItemClick resolves command and then always emits itemToggle (:239-244);
 *     PanelMenuList.onItemToggle pushes the row onto activeItemPath (:807-825).
 *   - Layout: .p-panelmenu is display: flex, flex-direction: column (styles :2-7);
 *     submenu padding-inline-start is the submenu.indent token (styles :96-101),
 *     1rem in Aura; the stylesheet declares no width, no white-space, no
 *     text-overflow and no media query, and .p-panelmenu-item-link is
 *     overflow: hidden (styles :107-118). Collapse is a grid-rows container
 *     (styles :161-168) driven by pMotionName="p-collapsible" (:1439-1441).
 *   - Tokens: aura/panelmenu/index.mjs — root gap 0.5rem, panel padding 0.25rem,
 *     panel border 1px, item gap 0.5rem, submenu indent 1rem, item colors aliased
 *     to the navigation.* group, radii to content.border.radius.
 *   - No string comes from the library: the bundle reads no config.translation
 *     (the menubar hamburger does, openng-optimus-ui-config.mjs:187) and the only
 *     library-rendered glyphs are the chevron svgs (:285-302, :1356-1364).
 *   - docs/generated/CONTRAST.MD "menu focus" measures the ring, the chevron, the
 *     item icon and the focus tint on the menubar tokens and asserts panelmenu resolves to the
 *     same pairs, so Design quotes those rows.
 */
@Component({
  selector: 'app-panelmenu-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, PanelMenuModule, ButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'panelmenu'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A stack of panels. Each header is a disclosure button; each open panel contains a tree of menu items.
          Everything below is live — open a panel with the mouse, then walk the same path with the keyboard, and
          watch where the arrow-key highlight is against the row Tab focused.
        </p>

        <h3>Panels rendered</h3>
        <div class="stage">
          <nav [attr.aria-label]="labels.docsNav" class="pm-demo">
            <p-panelmenu [model]="docs" [multiple]="true" />
          </nav>
        </div>
        <p class="src-note">
          Rendered from a <code>MenuItem[]</code> whose top level carries <code>items</code>. The chevron is the
          library's own svg, swapped by the active state (<code>openng-optimus-ui-panelmenu.mjs:1356-1364</code>).
        </p>

        <h3>What each level emits</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>level</th><th>element</th><th>attributes</th></tr>
            </thead>
            <tbody>
              <tr><td>panel header</td><td>{{ m.hdrEl }}</td><td>{{ m.hdrAttr }}</td></tr>
              <tr><td>panel body</td><td>{{ m.regionEl }}</td><td>{{ m.regionAttr }}</td></tr>
              <tr><td>item list</td><td>{{ m.treeEl }}</td><td>{{ m.treeAttr }}</td></tr>
              <tr><td>item row</td><td>{{ m.rowEl }}</td><td>{{ m.rowAttr }}</td></tr>
              <tr><td>row anchor</td><td>{{ m.linkEl }}</td><td>{{ m.linkAttr }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the templates: header <code>openng-optimus-ui-panelmenu.mjs:1330-1336</code>, region
          <code>:1435-1437</code>, tree host <code>:607-610</code>, row <code>:256-262</code>, anchors
          <code>:282</code> and <code>:344</code>. Verify in the browser's accessibility tree that the element you
          reach with Tab is not the element carrying <code>aria-activedescendant</code>.
        </p>

        <h3>The markup one header and one row produce</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Both ids are generated when the item has no <code>id</code>: <code>getHeaderId</code> and
          <code>getContentId</code> (<code>openng-optimus-ui-panelmenu.mjs:1223-1228</code>) off a
          <code>uuid('pn_id_')</code> fallback (<code>:1164</code>), so they differ per render.
        </p>

        <h3>Playground</h3>
        <div class="stage">
          <div class="controls">
            <p-button
              size="small"
              severity="secondary"
              [label]="multiple() ? labels.multipleOn : labels.multipleOff"
              (onClick)="multiple.set(!multiple())"
            />
            <p-button size="small" severity="secondary" [label]="labels.collapseAll" (onClick)="pm.collapseAll()" />
          </div>
          <nav [attr.aria-label]="labels.playgroundNav" class="pm-demo">
            <p-panelmenu #pm [model]="playground" [multiple]="multiple()" />
          </nav>
          <p class="readout" role="status">{{ labels.openNow }} {{ openPanels() }}</p>
        </div>
        <p class="src-note">
          <code>collapseAll()</code> is the component's one public method
          (<code>openng-optimus-ui-panelmenu.mjs:1188-1195</code>); the readout is this page reading
          <code>expanded</code> back off the same <code>MenuItem</code> objects the component writes to
          (<code>:1269</code>), which is where the panel state lives.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Reach for it when the sections are menus and the user needs more than one of them at a time. Everything
          else on this page follows from two decisions the component made: the panel state is stored in your model,
          and one widget carries two ARIA patterns.
        </p>

        <h3>PanelMenu, accordion, or plain navigation</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>you have</th><th>reach for</th><th>because</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.pickPmWhat }}</td><td><code>p-panelmenu</code></td><td>{{ m.pickPmWhy }}</td></tr>
              <tr><td>{{ m.pickAccWhat }}</td><td><code>p-accordion</code></td><td>{{ m.pickAccWhy }}</td></tr>
              <tr><td>{{ m.pickNavWhat }}</td><td>{{ m.pickNavHow }}</td><td>{{ m.pickNavWhy }}</td></tr>
              <tr><td>{{ m.pickMenuWhat }}</td><td><code>p-menu</code></td><td>{{ m.pickMenuWhy }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The <code>p-accordion</code> and <code>p-menu</code> rows are pointers, not summaries: both have their own
          guides, and nothing measured there is restated here.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — rebuild the model and let the panels close</span>
            <div class="dd__stage">
              <p-button size="small" severity="secondary" [label]="labels.switchLang" (onClick)="cycleLang()" />
              <nav [attr.aria-label]="labels.ddBadNav" class="pm-demo">
                <p-panelmenu [model]="volatile()" [multiple]="true" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddModelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — carry <code>expanded</code> in your own state</span>
            <div class="dd__stage">
              <p-button size="small" severity="secondary" [label]="labels.switchLang" (onClick)="cycleLang()" />
              <nav [attr.aria-label]="labels.ddGoodNav" class="pm-demo">
                <p-panelmenu [model]="stable()" [multiple]="true" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddModelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Open a panel in each, then press the button. The component stores the panel state nowhere but in the
          model object: <code>onHeaderClick</code> writes <code>item.expanded</code>
          (<code>openng-optimus-ui-panelmenu.mjs:1269</code>) and <code>isItemActive</code> reads that and nothing
          else (<code>:1208-1209</code>); the template tracks by identity (<code>:1321</code>). The right-hand model
          re-stamps <code>expanded</code> from a signal its headers' <code>command</code> updates
          (<code>:1259-1261</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — markup in a label</span>
            <div class="dd__stage">
              <nav [attr.aria-label]="labels.ddEscapeBad" class="pm-demo">
                <p-panelmenu [model]="escapedOff" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — plain labels, decoration through <code>icon</code></span>
            <div class="dd__stage">
              <nav [attr.aria-label]="labels.ddEscapeGood" class="pm-demo">
                <p-panelmenu [model]="escapedOn" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          With <code>escape: false</code> the visible label goes through <code>[innerHTML]</code>
          (<code>openng-optimus-ui-panelmenu.mjs:1376</code> header, <code>:321</code> row) while
          <code>aria-label</code> keeps the unparsed string (<code>:1334</code>, <code>:258</code>) — the two names
          diverge. The bundle contains no <code>bypassSecurityTrustHtml</code>, so Angular's sanitizer still runs on
          that branch.
        </p>

        <h3>Sources</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-panelmenu.mjs</code> — three components in one bundle; every role, key, and state
            write cited on this page comes from it.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs</code> — the focus rules, the indent, and the
            grid-rows collapse container.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-themes/dist/aura/panelmenu/index.mjs</code> — the token defaults resolved in
            Design.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" rel="noopener noreferrer" target="_blank"
              >APG Disclosure</a
            >
            — the pattern the headers implement, and the one the region relationship comes from.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" rel="noopener noreferrer" target="_blank"
              >APG Treeview</a
            >
            — the pattern the panel bodies claim, including the single tab stop it asks for.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 SC 2.4.7</a
            >
            and
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              rel="noopener noreferrer"
              target="_blank"
              >SC 1.4.11</a
            >
            — what a tab stop without an indicator owes, and the 3:1 the replacement needs.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The preset styles four things: the panel frame, the row rhythm, the indent per level, and two focus
          states that are both background swaps. Nothing else is opinionated — width, wrapping, and placement are
          the caller's.
        </p>

        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>what</th><th>token</th><th>Aura default</th></tr>
            </thead>
            <tbody>
              <tr><td>gap between panels</td><td><code>panelmenu.gap</code></td><td>{{ m.tokGap }}</td></tr>
              <tr><td>panel frame</td><td><code>panelmenu.panel.*</code></td><td>{{ m.tokPanel }}</td></tr>
              <tr><td>row padding and gap</td><td><code>panelmenu.item.*</code></td><td>{{ m.tokItem }}</td></tr>
              <tr><td>row focus state</td><td><code>panelmenu.item.focus.*</code></td><td>{{ m.tokFocus }}</td></tr>
              <tr><td>indent per level</td><td><code>panelmenu.submenu.indent</code></td><td>{{ m.tokIndent }}</td></tr>
              <tr><td>chevron color</td><td><code>panelmenu.submenu.icon.color</code></td><td>{{ m.tokChevron }}</td></tr>
              <tr><td>item and header icon</td><td><code>panelmenu.item.icon.color</code></td><td>{{ m.tokIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/panelmenu/index.mjs</code>; the
          <code>navigation.*</code> and <code>content.*</code> aliases resolve in the base preset. The kit's visual
          styles change only its radius scale through <code>definePreset</code>
          (<code>src/app/services/ui-styles.ts</code>) — square in werkbund, rounder in lernwerkstatt (the default) and
          skizzenbuch — so the radius you see is the active style's. The panel and row colors stay Aura's stock
          palette in every style; the shared layer of <code>src/styles.scss</code> adds the kit's one focus ring (next
          section) and puts the submenu chevron and the item and header icons in <code>--text-color-secondary</code>.
        </p>

        <h3>Three focus states, and what the kit draws</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>element</th><th>what the preset draws</th><th>what the kit adds</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.foHeaderEl }}</td><td>{{ m.foHeaderDraw }}</td><td>{{ m.foHeaderOwe }}</td></tr>
              <tr><td>{{ m.foRowEl }}</td><td>{{ m.foRowDraw }}</td><td>{{ m.foRowOwe }}</td></tr>
              <tr><td>{{ m.foLinkEl }}</td><td>{{ m.foLinkDraw }}</td><td>{{ m.foLinkOwe }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rules at <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:30</code> (header outline),
          <code>:70</code> (header focus background), <code>:135</code> (row background) and
          <code>openng-optimus-ui-panelmenu.mjs:26-29</code> (the Optimus override that clears the anchor's
          outline). The kit ring, chevron and icon are the "menu focus" rows of
          <code>docs/generated/CONTRAST.MD</code>, measured on the menubar's tokens; the gate asserts that the panelmenu
          panel, focus tint, chevron and icon resolve to the same values, so the rows stand for this component: ring
          4.73–16.30:1 on the focus tint and 5.18–17.85:1 on the panel, chevron and icon 4.76:1 and up — every style,
          mode and accent. Nothing is left to you (snippet below).
        </p>

        <pre class="code-block"><code>{{ focusRingSnippet }}</code></pre>

        <h3>On a narrow screen</h3>
        <p>
          Nothing reflows and nothing truncates. The root is a flex column with no width of its own, so it fills its
          container at every viewport; each level adds <code>1rem</code> of inline padding, and a label that no
          longer fits wraps inside its row, growing the row's height. There is no media query and no
          <code>text-overflow</code> in the stylesheet. At 360 px with three levels open, roughly 3 rem of the width
          is indent — cap the depth you offer, or give the deepest level its own <code>pt</code> padding, rather
          than expecting the component to compensate. One caveat: <code>.p-panelmenu-item-link</code> is
          <code>overflow: hidden</code>, so a single unbreakable token (a long URL as a label) is clipped rather
          than wrapped.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:2-7</code> (flex column),
          <code>:96-101</code> (indent, mirrored under <code>dir="rtl"</code> at <code>:103-105</code>),
          <code>:107-118</code> (the row anchor). The file declares no <code>width</code>, no
          <code>white-space</code>, no <code>text-overflow</code> and no <code>&#64;media</code> block.
        </p>

        <h3>Motion</h3>
        <p>
          The panel body is a <code>grid-template-rows</code> container whose row collapses to zero — the technique
          that animates to content height without measuring it. It is driven by the motion directive under the name
          <code>p-collapsible</code>, configured through <code>motionOptions</code>. The deprecated
          <code>transitionOptions</code> input does not reach it.
        </p>
        <p class="src-note">
          Container at <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:161-168</code>, directive
          bindings at <code>openng-optimus-ui-panelmenu.mjs:1439-1441</code>;
          <code>transitionOptions</code> is forwarded between the internal components (<code>:1450</code>,
          <code>:996</code>, <code>:406</code>) and read by none of them.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Two handlers, two focus models, and a state field that lives in your data. Wire it with that in mind and
          the component is unremarkable; wire it like an accordion and the panels close on every language switch.
        </p>

        <h3>Inputs, and what each one reaches</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>default</th><th>reaches</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td>{{ m.inModel }}</td></tr>
              <tr><td><code>multiple</code></td><td><code>false</code></td><td>{{ m.inMultiple }}</td></tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.inMotion }}</td></tr>
              <tr><td><code>id</code></td><td>generated</td><td>{{ m.inId }}</td></tr>
              <tr><td><code>styleClass</code></td><td>—</td><td>{{ m.inStyleClass }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.inTabindex }}</td></tr>
              <tr><td><code>transitionOptions</code></td><td>{{ m.inTransitionDefault }}</td><td>{{ m.inTransition }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations at <code>openng-optimus-ui-panelmenu.mjs:1083-1123</code>. The two dead entries are dead for
          different reasons: <code>tabindex</code> is forwarded (<code>:1453</code> to <code>:992</code>) to a list
          whose host binds the literal <code>-1</code> (<code>:608</code>) while the header tab stop is the literal
          <code>0</code> (<code>:1330</code>); <code>transitionOptions</code> is deprecated in favor of
          <code>motionOptions</code> and reaches no directive at all. The component also accepts
          <code>dt</code>, <code>unstyled</code>, <code>pt</code> and <code>ptOptions</code> from
          <code>BaseComponent</code>, which its own input list does not name.
        </p>

        <h3>The keyboard, per level</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>key</th><th>on a panel header</th><th>inside an open panel</th></tr>
            </thead>
            <tbody>
              <tr><td>Arrow Down</td><td>{{ m.kbDownH }}</td><td>{{ m.kbDownT }}</td></tr>
              <tr><td>Arrow Up</td><td>{{ m.kbUpH }}</td><td>{{ m.kbUpT }}</td></tr>
              <tr><td>Arrow Right / Left</td><td>{{ m.kbLatH }}</td><td>{{ m.kbLatT }}</td></tr>
              <tr><td>Home / End</td><td>{{ m.kbHomeH }}</td><td>{{ m.kbHomeT }}</td></tr>
              <tr><td>Enter / Space</td><td>{{ m.kbEnterH }}</td><td>{{ m.kbEnterT }}</td></tr>
              <tr><td>Escape</td><td>{{ m.kbEscH }}</td><td>{{ m.kbEscT }}</td></tr>
              <tr><td>Tab</td><td>{{ m.kbTabH }}</td><td>{{ m.kbTabT }}</td></tr>
              <tr><td>printable characters</td><td>{{ m.kbTypeH }}</td><td>{{ m.kbTypeT }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Header handler <code>openng-optimus-ui-panelmenu.mjs:1273-1318</code>, tree handler
          <code>:826-931</code> with the typeahead at <code>:943-984</code> and the explicit no-op arm at
          <code>:853-861</code>; the return to the header is <code>changeFocusedItem</code>'s else branch
          (<code>:775-784</code>).
        </p>

        <h3>Why Tab and the arrow keys disagree</h3>
        <p>
          The tree is an <code>aria-activedescendant</code> widget: the list element holds the focus, a
          <code>p-focus</code> class marks the current row, and arrow keys move that marker. The row anchors,
          however, are given <code>tabindex="0"</code> as soon as their panel is open — so the tab sequence of one
          open panel is: header, then every visible link inside it, then the next header. Tabbing between those
          links does not move the marker, because the list's focus handler only acts on the first entry and its
          blur handler only fires when focus leaves the list entirely. The result is a highlight sitting on one row
          while the browser's focus is on another. The kit rings both — the row whose anchor has focus and the
          marker row, which is the one Enter and Space act on — so after a Tab inside a panel two rows can wear the
          ring; after the first Tab into a panel they coincide.
        </p>
        <p class="src-note">
          Anchors at <code>openng-optimus-ui-panelmenu.mjs:282</code> and <code>:344</code>, the handlers at
          <code>:791-806</code>, the marker class at <code>:50-58</code>. Reproduce it in your build: open a panel,
          press Tab twice, and read <code>aria-activedescendant</code> on the list against
          <code>document.activeElement</code>.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>The component is named from outside — a <code>&lt;nav&gt;</code> or <code>&lt;section&gt;</code> with a label; neither the root nor any tree carries a name of its own.</li>
          <li>No focus rule of your own: the kit rings the header, the arrow-key row and the row whose anchor Tab reached.</li>
          <li>Every top-level entry has <code>items</code> — a header without them still announces <code>aria-expanded</code> and points at an empty region.</li>
          <li><code>expanded</code> is owned by the caller and re-stamped whenever <code>model</code> is rebuilt, language switches included.</li>
          <li>The whole path is walked twice: once with the arrow keys, once with Tab, because they visit different elements.</li>
          <li>No <code>escape: false</code> on a label you did not author — the accessible name keeps the markup even where the visible label renders it.</li>
          <li>Destinations that must be reachable are also reachable outside the panel menu; a collapsed panel is <code>aria-hidden</code> and its links are <code>tabindex="-1"</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Every string is yours. The component reads no translation config at all, which makes the language switch
          the interesting part: the new model must not take the open panels down with it.
        </p>

        <h3>What comes from where</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>string</th><th>source</th></tr>
            </thead>
            <tbody>
              <tr><td>header and row labels, badges</td><td>your <code>MenuItem[]</code></td></tr>
              <tr><td>the menu's accessible name</td><td>the element you wrap it in</td></tr>
              <tr><td>the expand/collapse affordance</td><td>a chevron svg — no text, and no label of its own</td></tr>
              <tr><td>anything the library ships</td><td>nothing; it reads no translation config</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Searched across the bundle: no <code>config.translation</code> reference and no user-facing literal, in
          contrast to <code>p-menubar</code>, whose hamburger borrows a name from
          <code>openng-optimus-ui-config.mjs:187</code>.
        </p>

        <h3>A translated model that keeps its panels open</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The keys above are placeholders in a <code>your-module.</code> namespace, not keys of this kit. The shape
          is what matters: the open state lives in a signal the header's <code>command</code> updates, and the
          computed model re-stamps <code>expanded</code> from it — otherwise the fresh objects a language switch
          produces arrive with <code>expanded</code> unset and every panel closes.
        </p>

        <h3>What this does not solve</h3>
        <ul class="checklist">
          <li>{{ m.i18nNameGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
          <li>{{ m.i18nTypeaheadGap }}</li>
        </ul>
        <p class="src-note">
          The first follows from <code>aria-label</code> taking the raw label
          (<code>openng-optimus-ui-panelmenu.mjs:1334</code>, <code>:258</code>); the second from the indent
          quoted in Design; the third from the typeahead comparing with a plain
          <code>toLocaleLowerCase().startsWith()</code> (<code>:709-711</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.3</strong> — 2026-09-23 — Synced with the last focus round: the row whose anchor Tab focused now
            wears the kit ring too, and the item and header icons are <code>--text-color-secondary</code>; no gap is
            left to the caller.
          </li>
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the header and the arrow-key
            row wear the kit's one 2px ring and the chevron is <code>--text-color-secondary</code>, cited from
            CONTRAST.MD "menu focus"; the Tab-reached row anchor is named as the one gap left.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles: every line
            reference holds (one indent range tightened to <code>:103-105</code>); design states that the styles change
            only the radius, never the colors; the playground readout is a status region; doc trimmed to the byte aim.
          </li>
          <li><strong>1.0</strong> — 2026-09-07 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-panelmenu-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-panelmenu-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-panelmenu-article .pm-demo {
        display: block;
        max-width: 22rem;
      }

      app-panelmenu-article .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-block-end: 0.75rem;
      }

      app-panelmenu-article .readout {
        margin-block: 0.75rem 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-panelmenu-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-panelmenu-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-panelmenu-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-panelmenu-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-panelmenu-article .dd__stage {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-panelmenu-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-panelmenu-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-panelmenu-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-panelmenu-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-panelmenu-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-panelmenu-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PanelmenuArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Visible strings of the live stages, kept out of the measurement object. */
  readonly labels = {
    docsNav: 'Documentation sections',
    playgroundNav: 'Playground sections',
    ddBadNav: 'Sections, model rebuilt without state',
    ddGoodNav: 'Sections, state carried by the caller',
    ddEscapeBad: 'Sections with markup in their labels',
    ddEscapeGood: 'Sections with plain labels',
    multipleOn: 'multiple: true',
    multipleOff: 'multiple: false',
    collapseAll: 'collapseAll()',
    switchLang: 'Switch language',
    openNow: 'Open right now:',
  };

  readonly multiple = signal(true);

  /** Which panels the caller-owned model keeps open, keyed by section id. */
  private readonly open = signal<Record<string, boolean>>({ guides: true });

  private readonly lang = signal(0);

  readonly docs: MenuItem[] = [
    {
      label: 'Getting started',
      icon: 'pi pi-play',
      expanded: true,
      items: [
        { label: 'Install' },
        { label: 'Project layout' },
        { label: 'First component', items: [{ label: 'Template' }, { label: 'Styles' }] },
      ],
    },
    {
      label: 'Guides',
      icon: 'pi pi-book',
      items: [{ label: 'Forms' }, { label: 'Navigation' }, { separator: true }, { label: 'Testing', disabled: true }],
    },
    { label: 'Reference', icon: 'pi pi-list', items: [{ label: 'Tokens' }, { label: 'Utilities' }] },
  ];

  readonly playground: MenuItem[] = [
    { label: 'Editing', icon: 'pi pi-pencil', items: [{ label: 'Rename' }, { label: 'Duplicate' }] },
    { label: 'Lifecycle', icon: 'pi pi-clock', items: [{ label: 'Archive' }, { label: 'Delete' }] },
    { label: 'Sharing', icon: 'pi pi-share-alt', items: [{ label: 'Invite' }, { label: 'Public link' }] },
  ];

  readonly escapedOff: MenuItem[] = [
    { label: '<b>Publish</b> now', escape: false, items: [{ label: 'To <i>staging</i>', escape: false }] },
    { label: 'Save as <i>draft</i>', escape: false, items: [{ label: 'Keep local' }] },
  ];

  readonly escapedOn: MenuItem[] = [
    { label: 'Publish now', icon: 'pi pi-send', items: [{ label: 'To staging' }] },
    { label: 'Save as draft', icon: 'pi pi-file', items: [{ label: 'Keep local' }] },
  ];

  /** The two sections both do/don't models are built from. */
  private readonly sections = [
    { id: 'guides', labels: ['Guides', 'Anleitungen'], children: ['Forms', 'Navigation'] },
    { id: 'reference', labels: ['Reference', 'Referenz'], children: ['Tokens', 'Utilities'] },
  ];

  /** Rebuilt on every language change, with no expansion state carried. */
  readonly volatile = computed<MenuItem[]>(() =>
    this.sections.map((s) => ({
      label: s.labels[this.lang()],
      items: s.children.map((c) => ({ label: c })),
    })),
  );

  /** The same model, with `expanded` re-stamped from the caller's own signal. */
  readonly stable = computed<MenuItem[]>(() =>
    this.sections.map((s) => ({
      label: s.labels[this.lang()],
      expanded: this.open()[s.id] ?? false,
      command: () => this.open.update((o) => ({ ...o, [s.id]: !o[s.id] })),
      items: s.children.map((c) => ({ label: c })),
    })),
  );

  /** Reads the panel state back off the same objects the component writes to. */
  openPanels(): string {
    const open = this.playground.filter((item) => item.expanded).map((item) => item.label);
    return open.length ? open.join(', ') : 'nothing';
  }

  cycleLang(): void {
    this.lang.update((l) => (l + 1) % 2);
  }

  /** Flat measurement constants — substituted by the tab extractor. */
  readonly m = {
    hdrEl: 'div, one per model entry',
    hdrAttr: 'role="button", tabindex="0", aria-expanded, aria-controls, aria-label, aria-disabled',
    regionEl: 'div wrapping the panel body',
    regionAttr: 'role="region", aria-labelledby pointing back at the header',
    treeEl: 'ul, one per open panel',
    treeAttr: 'role="tree", tabindex="-1", aria-activedescendant, aria-hidden while collapsed',
    rowEl: 'li, one per visible item',
    rowAttr: 'role="treeitem", aria-label, aria-level, aria-setsize, aria-posinset, aria-expanded only when it has children',
    linkEl: 'a inside the row, with href only when url or routerLink is set',
    linkAttr: 'tabindex="0" while the panel is open, "-1" while it is collapsed — a second tab stop per row',

    pickPmWhat: 'sections of menu items, several of them open at once',
    pickPmWhy: 'the only component here that nests menu items under collapsible headers',
    pickAccWhat: 'sections of arbitrary content',
    pickAccWhy: 'panel bodies here can only be a MenuItem[], never projected content',
    pickNavWhat: 'a site navigation whose entries are destinations',
    pickNavHow: 'nav plus a',
    pickNavWhy: 'the kit convention, and one focus model instead of a tree cursor beside the tab stops',
    pickMenuWhat: 'one list of commands, always visible',
    pickMenuWhy: 'no disclosure needed, and one documented focus model instead of two',

    ddModelBad:
      'The model is rebuilt from a computed on every switch, so the objects the component wrote expanded into are gone and every panel closes.',
    ddModelGood:
      'The same rebuild, but expanded is re-stamped from a signal the header command updates — the switch changes the language and nothing else.',
    ddEscapeBad:
      'The visible label renders the markup while the accessible name keeps the tags, so the row is announced as "b Publish /b now".',
    ddEscapeGood: 'One string, one name, and the decoration comes from icon instead.',

    tokGap: '0.5rem between panels',
    tokPanel: 'content background and border color, 1px border, 0.25rem padding, content radius',
    tokItem: 'navigation.item.padding, 0.5rem gap, content radius',
    tokFocus: 'navigation.item.focus.background and .color — a fill, not an outline',
    tokIndent: '1rem per level, mirrored under dir="rtl"',
    tokChevron:
      'navigation.submenu.icon.color, with a focus variant — the kit re-points both to --text-color-secondary',
    tokIcon:
      'navigation.item.icon.color (surface.400, 2.56:1 on white), with a focus variant — the kit re-points both to --text-color-secondary',

    foHeaderEl: '.p-panelmenu-header (the tab stop)',
    foHeaderDraw: 'a background and color swap under :focus-visible; outline is cleared to 0 none',
    foHeaderOwe: 'the one 2px --primary-color-fg ring on the header content, inside it (offset -2px)',
    foRowEl: '.p-panelmenu-item.p-focus (the arrow-key marker)',
    foRowDraw: 'the same background swap, keyed on a class the key handler sets',
    foRowOwe:
      'the same ring on the row content — it marks the virtual cursor, which after a Tab can sit on another row than the focused anchor',
    foLinkEl: '.p-panelmenu-item-link (the second tab stop)',
    foLinkDraw: 'nothing at all: outline: 0 none and no :focus-visible rule',
    foLinkOwe:
      'the same ring on its row content, keyed on the anchor’s :focus-visible — the element a Tab user actually focuses',

    inModel: 'the panel list; a plain field tracked by object identity, so a new array rebuilds every panel',
    inMultiple: 'whether opening one header clears the others by writing expanded: false into their model objects',
    inMotion: 'the collapse animation of every panel body',
    inId: 'the prefix of the generated header and content ids; a missing value is filled with a uuid, so ids differ per render',
    inStyleClass: 'the host class — deprecated, use class',
    inTabindex: 'nothing: the list it is forwarded to binds -1 on its host, and the header tab stop is a literal 0',
    inTransitionDefault: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
    inTransition: 'nothing: forwarded down two levels and read by no directive; deprecated in favor of motionOptions',

    kbDownH: 'next header, or into this panel\'s list when it is open',
    kbDownT: 'next visible row, disabled rows skipped; no wrap',
    kbUpH: 'previous header, or into the previous panel\'s list when that one is open',
    kbUpT: 'previous visible row; on the first row, back to the panel header',
    kbLatH: 'nothing — the handler has no branch for either',
    kbLatT: 'Right expands a group or moves into it; Left collapses it, or moves to the parent row',
    kbHomeH: 'first / last header, disabled ones skipped',
    kbHomeT: 'first / last row of this panel; it never leaves the tree',
    kbEnterH: 'toggles the panel (clicks the header link when there is one)',
    kbEnterT: 'clicks the row\'s anchor',
    kbEscH: 'nothing — no branch in the handler',
    kbEscT: 'nothing — an explicit no-op arm; no key closes a panel from inside it',
    kbTabH: 'the browser default: on to the first link of an open panel',
    kbTabT: 'the browser default: on to the next link, without moving the highlight',
    kbTypeH: 'nothing',
    kbTypeT: 'jumps to the next row whose label starts with the typed characters; the buffer clears after 500 ms',

    i18nNameGap:
      'A label with escape: false is announced with its markup, because the accessible name is the unparsed string — translations that carry emphasis tags are read out as tags.',
    i18nWidthGap:
      'Longer languages do not truncate, they wrap and grow the row, and each level has already spent 1rem of the available width on indent.',
    i18nTypeaheadGap:
      'The typeahead lowercases and compares from the start of the label, so it matches neither a middle word nor a diacritic-folded form.',
  };

  readonly emittedMarkupSnippet = `<!-- one panel: a disclosure button, a region, and a tree inside it -->
<div class="p-panelmenu-panel">
  <div id="pn_id_1_0_header" role="button" tabindex="0"
       aria-expanded="true" aria-controls="pn_id_1_0_content" aria-label="Guides"
       class="p-panelmenu-header p-panelmenu-header-active">
    <div class="p-panelmenu-header-content">
      <a class="p-panelmenu-header-link" tabindex="-1">
        <svg data-p-icon="chevron-down" class="p-panelmenu-submenu-icon"></svg>
        <span class="p-panelmenu-header-label">Guides</span>
      </a>
    </div>
  </div>
  <div id="pn_id_1_0_content" role="region" aria-labelledby="pn_id_1_0_header"
       class="p-panelmenu-content-container p-panelmenu-expanded">
    <ul role="tree" tabindex="-1" aria-activedescendant="pn_id_1_0_0" aria-hidden="false"
        class="p-panelmenu-root-list p-panelmenu-submenu">
      <li id="pn_id_1_0_0" role="treeitem" aria-label="Forms" aria-level="1"
          aria-setsize="3" aria-posinset="1" data-p-focused="true"
          class="p-panelmenu-item p-focus">
        <div class="p-panelmenu-item-content">
          <a class="p-panelmenu-item-link" tabindex="0">
            <span class="p-panelmenu-item-label">Forms</span>
          </a>
        </div>
      </li>
    </ul>
  </div>
</div>`;

  readonly focusRingSnippet = `/* Already in the kit (src/styles.scss, the one ring list):
   .p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content
   .p-panelmenu-item.p-focus > .p-panelmenu-item-content
   .p-panelmenu-item-content:has(> .p-panelmenu-item-link:focus-visible)
   -> outline: 2px solid var(--primary-color-fg); outline-offset: -2px.

   Add no rule of your own: a second ring would drift from this one. */`;

  readonly i18nSnippet = `// The open state belongs to the caller: the component only writes it into
// the MenuItem objects, which a rebuilt model replaces.
readonly open = signal<Record<string, boolean>>({ guides: true });

readonly items = computed<MenuItem[]>(() =>
  SECTIONS.map((s) => ({
    label: this.i18n.translate('your-module.nav.' + s.id),
    expanded: this.open()[s.id] ?? false,
    command: () => this.open.update((o) => ({ ...o, [s.id]: !o[s.id] })),
    items: s.children.map((c) => ({
      label: this.i18n.translate('your-module.nav.' + c.id),
      routerLink: c.route,
    })),
  })),
);`;
}
