import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ContextMenuModule } from '@openng/optimus-ui/contextmenu';
import { MenuModule } from '@openng/optimus-ui/menu';
import { TieredMenuModule } from '@openng/optimus-ui/tieredmenu';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, MenuModule, TieredMenuModule, ContextMenuModule, ButtonModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-menu-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-menu-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-menu-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 1.5rem;
      }

      app-menu-article .col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      app-menu-article .lbl {
        font-size: 0.72rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      app-menu-article .target {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 12rem;
        min-height: 4rem;
        padding: 0.75rem;
        text-align: center;
        font-size: 0.85rem;
        border: 1px dashed var(--surface-border);
        background: var(--surface-section);
      }

      app-menu-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-menu-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-menu-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-menu-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-menu-article .dd__stage {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-menu-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-menu-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-menu-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-menu-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-menu-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-menu-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Menu, TieredMenu, and ContextMenu (Guides, category `library`).
 *
 * Three vertical menus that share a model and diverge in everything else. The
 * `.mjs` files named below are the fesm2022 bundles of `@openng/optimus-ui`
 * at 2.0.2.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - p-menu: ul role="menu" (openng-optimus-ui-menu.mjs:897) with tabindex from getTabIndexValue()
 *     (:899, input default 0 at :384) and aria-activedescendant (:901); items are
 *     li role="menuitem" (:953 grouped branch, :983 flat branch) with aria-label
 *     from the label; anchors inside carry tabindex="-1" (:179/:193). The other two
 *     hard-wire the same on both of their anchor branches, in both sub templates
 *     (openng-optimus-ui-tieredmenu.mjs:331, :340, :377, :399, :532, :541, :578;
 *     openng-optimus-ui-contextmenu.mjs:310, :320, :356, :377, :506, :516, :552).
 *   - p-menu group headers are li role="none" (:921) — no role="group" and no
 *     aria-labelledby of its own; the list element itself binds one (:903).
 *   - p-menu keyboard: onListKeyDown :648-682, default branch is a bare break
 *     (:679-680) so there is no typeahead; Escape and Tab share one case that
 *     focuses the trigger and hides when popup, with no preventDefault (:671-678),
 *     so Tab's own sequential navigation continues from the trigger; Alt+ArrowUp
 *     does the same (:688-693); arrows do not
 *     wrap (findNextOptionIndex :718, changeFocusedOptionIndex clamps :728-733).
 *   - p-menu popup opening focuses the LIST (:574) and onListFocus only sets the
 *     first item when NOT popup (:632), so a popup opens with nothing highlighted.
 *   - p-menu dead surface: showTransitionOptions (:358) and hideTransitionOptions
 *     (:364) are declared inputs read nowhere; the #header template is queried in
 *     the compiled declaration (:869) and declared (:520-521) but rendered in no
 *     branch of the template; a pTemplate="header" is not ignored either, the
 *     default arm of onAfterContentInit (:554-556) makes it the item template.
 *   - escape is inverted across the three. p-menu renders the label as text unless
 *     escape:false (openng-optimus-ui-menu.mjs:223), which routes it through SafeHtmlPipe and
 *     its bypassSecurityTrustHtml (:135). p-tieredMenu (openng-optimus-ui-tieredmenu.mjs:344,
 *     getItemProp :189) and p-contextMenu (openng-optimus-ui-contextmenu.mjs:324,
 *     getItemProp :167) test the raw value instead, so an unset escape is falsy and takes
 *     the #htmlLabel branch, which binds [innerHTML] (openng-optimus-ui-tieredmenu.mjs:355,
 *     openng-optimus-ui-contextmenu.mjs:335). Neither of those two bundles contains
 *     bypassSecurityTrustHtml or safeHtml, so Angular's sanitizer still runs there.
 *   - MenuItem badge is read by all three: p-menu (:228-229) and p-contextMenu
 *     (openng-optimus-ui-contextmenu.mjs:339) render a p-badge, p-tieredMenu a bare
 *     span.p-menuitem-badge (openng-optimus-ui-tieredmenu.mjs:359, :418).
 *   - p-menu branches on hasSubMenu() per MODEL, not per item (:854): the grouped
 *     branch (:908) renders every non-separator top-level entry as the li
 *     role="none" header (:921) and only submenu.items as menuitem (:953).
 *   - p-tieredMenu: sub list ul role="menu" with [tabindex]="tabindex" and
 *     aria-orientation (openng-optimus-ui-tieredmenu.mjs:270-277); items carry aria-haspopup (:310),
 *     aria-expanded (:311), aria-setsize (:312), aria-posinset (:313). The root sub
 *     gets [tabindex] (:1484); the NESTED sub (:437-453) does not, so it keeps
 *     TieredMenuSub's own default of 0 (:158) and no keydown/focus/blur wiring.
 *   - p-tieredMenu keyboard: onKeyDown :1056-1102 including typeahead (:1096-1099,
 *     buffer cleared after 500 ms :1339-1342); ArrowRight enters (:1108-1118),
 *     ArrowLeft leaves one level (:1136-1151); Escape hides with the focus flag
 *     (:1164-1168), Tab hides without it (:1169-1176); hide() :1281-1290.
 *   - p-tieredMenu inline never highlights: the first-item call in onMenuFocus is
 *     commented out (:1209). The breakpoint INPUT is read once, when onInit (:923)
 *     builds the media query (:941-951); the match itself stays live through the
 *     change listener (:948-950). It adds p-tieredmenu-mobile to the root (:33),
 *     which the stylesheet stacks submenus under
 *     (@openng/optimus-ui-styles/dist/tieredmenu/index.mjs:128-134, indent token
 *     submenu.mobileIndent = 1rem), and suppresses hover-open (:1201);
 *   - p-tieredMenu hover: TieredMenuSub forwards a mouseenter only when autoDisplay
 *     (:246-250), and TieredMenu acts on it only while dirty (:1046-1055), which is
 *     set by a click or key activation (:1031, :1199) and cleared on blur and hide
 *     (:1216, :1289) — hover switches submenus, it does not open the first.
 *   - p-tieredMenu hide(event, isFocus) focuses relatedTarget || target || the root
 *     list (:1288); target and relatedTarget are set only in the popup branch of
 *     show() (:1304-1308), so an inline menu falls back to the root list.
 *   - p-tieredMenu dead surface: `disabled` reaches nothing but [tabindex] (:1484);
 *     showTransitionOptions (:782) and hideTransitionOptions (:788) are read nowhere.
 *   - p-contextMenu binds its trigger once in onInit (:858-859 -> :864-891) off
 *     `global`/`target`; with neither set nothing is bound. It positions from
 *     event.pageX/pageY (:1267-1268, used at :1278-1279) and flips both axes
 *     (:1283-1290, whole method :1275-1301). hide() (:1253-1259) has no focus() call.
 *     show() also reads only event.pageX/pageY for placement, so a click a browser
 *     synthesizes from Enter or Space on a button carries no coordinates.
 *   - p-contextMenu breakpoint is half dead: p-contextmenu-mobile is keyed on
 *     `instance.queryMatches` without calling the signal (:38) and `instance`
 *     there is the ContextMenuSub, which has no such member (its fields are at
 *     :129-142), so the stacked-submenu rule
 *     (@openng/optimus-ui-styles/dist/contextmenu/index.mjs:124-135) never applies.
 *     ContextMenuSub declares autoZIndex/baseZIndex (:132-133), ContextMenu binds
 *     both (:1449-1450), and the sub reads neither.
 *   - Submenu placement: TieredMenuSub.positionSubmenu (:182-188) delegates to
 *     nestedPosition (@openng/optimus-ui-utils/dist/dom/index.mjs, minified,
 *     cited by export), which flips both axes and writes inset-inline-start;
 *     ContextMenuSub.position (:231-244) sets top to 0px unconditionally, flips
 *     only horizontally and writes the physical left.
 *   - Aura's focus is a background/color swap in all three: styles menu/index.mjs:51-53,
 *     tieredmenu/index.mjs:80-82, contextmenu/index.mjs:81-83, with outline: 0 none
 *     on the lists (:13, :16, :16) and no :focus-visible rule anywhere. The kit
 *     rings the .p-focus item (src/styles.scss, the one ring list) and
 *     re-points the tiered/context chevron and the item icon of all
 *     three, Aura surface.400 at 2.56:1, to --text-color-secondary.
 *   - min-width: 12.5rem on all three roots (menu :7, tieredmenu :7, contextmenu
 *     :8); zero @media and zero max-height/overflow-y in all three stylesheets.
 *   - Token values from @openng/optimus-ui-themes/dist/aura/base/index.mjs and the
 *     three aura/<component>/index.mjs presets — all minified single-line dist
 *     files, cited by path and export rather than by line.
 *   - No bundle contains config.translation or any library-supplied string.
 *   - docs/generated/CONTRAST.MD "menu focus" measures the ring, the chevron,
 *     the item icon and the focus tint on the menubar tokens and asserts that menu,
 *     tieredmenu and contextmenu resolve to the same pairs, so Design quotes it.
 */
@Component({
  selector: 'app-menu-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'menu'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Three components, one <code>MenuItem[]</code>, and three different answers to the same three questions:
          where does focus go, what can a keyboard reach, and who decides where the panel lands. Everything below is
          live — open each one and walk it with the keyboard rather than the mouse.
        </p>

        <h3>The three menus, rendered</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-menu, inline</span>
            <p-menu [model]="flat" [ariaLabel]="labels.inlineMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-menu, popup</span>
            <p-button label="Actions" size="small" severity="secondary" (onClick)="popupMenu.toggle($event)" />
            <p-menu #popupMenu [model]="flat" [popup]="true" [ariaLabel]="labels.popupMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-tieredMenu, inline</span>
            <p-tieredMenu [model]="tiered" [ariaLabel]="labels.tieredMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-contextMenu, on a target</span>
            <div #ctxTarget class="target" tabindex="0" role="group" [attr.aria-label]="labels.ctxTarget">
              {{ labels.ctxHint }}
            </div>
            <p-button label="Open menu" size="small" severity="secondary" (onClick)="ctxMenu.show($event)" />
            <p-contextMenu #ctxMenu [target]="ctxTarget" [model]="tiered" [ariaLabel]="labels.ctxMenu" />
          </div>
        </div>
        <p class="src-note">
          The popup is opened by the component's own <code>toggle()</code>
          (<code>openng-optimus-ui-menu.mjs:476-482</code>); the context menu listens for a
          <code>contextmenu</code> event on the element bound to <code>target</code>
          (<code>openng-optimus-ui-contextmenu.mjs:864-891</code>) and is opened here from a button as well, because a
          right-click is not a keyboard gesture.
        </p>

        <h3>What each root emits</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>component</th><th>list element</th><th>item element</th><th>relationship attributes on the item</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menu</code></td>
                <td>{{ m.menuList }}</td>
                <td>{{ m.menuItem }}</td>
                <td>{{ m.menuRel }}</td>
              </tr>
              <tr>
                <td><code>p-tieredMenu</code></td>
                <td>{{ m.tieredList }}</td>
                <td>{{ m.tieredItem }}</td>
                <td>{{ m.tieredRel }}</td>
              </tr>
              <tr>
                <td><code>p-contextMenu</code></td>
                <td>{{ m.ctxList }}</td>
                <td>{{ m.ctxItem }}</td>
                <td>{{ m.ctxRel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the templates: <code>openng-optimus-ui-menu.mjs:897</code> and <code>:953</code>/<code>:983</code>,
          <code>openng-optimus-ui-tieredmenu.mjs:270-277</code> and <code>:303-313</code>,
          <code>openng-optimus-ui-contextmenu.mjs:250-258</code> and <code>:281-292</code>. Verify in the browser's
          accessibility tree that the list you focus is the one that carries the name you set.
        </p>

        <h3>The markup a single item produces</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          The anchor is present whether or not the item has a destination. There are two anchor branches: one takes
          an <code>href</code> from <code>url</code> (<code>openng-optimus-ui-menu.mjs:177</code>), the other is a
          <code>routerLink</code> anchor whose <code>href</code> Angular's own directive writes
          (<code>:191</code>). Both hard-wire <code>tabindex="-1"</code> (<code>:179</code>, <code>:193</code>), and so do the
          anchor branches of the other two (<code>openng-optimus-ui-tieredmenu.mjs:331</code>,
          <code>openng-optimus-ui-contextmenu.mjs:310</code>), which is what keeps the item out of the tab sequence — so <code>routerLink</code> is read, but a menu entry
          is still not a reachable destination.
        </p>

        <h3>A group header in <code>p-menu</code></h3>
        <div class="stage">
          <p-menu [model]="grouped" [ariaLabel]="labels.groupedMenu" />
        </div>
        <p class="src-note">
          The decision is taken once for the whole model, not per item: <code>hasSubMenu()</code> is
          <code>model.some(i =&gt; i.items)</code> (<code>openng-optimus-ui-menu.mjs:854</code>) and the template
          branches on it at <code>:908</code> and <code>:964</code>. In the grouped branch every non-separator
          top-level entry is rendered as <code>&lt;li role="none"&gt;</code> (<code>:921</code>) and only
          <code>submenu.items</code> become <code>role="menuitem"</code> rows (<code>:953</code>) — so a top-level
          entry without <code>items</code>, in a model where any other entry has them, ends up as a label with no
          role, no name, and no click handler. The header carries neither <code>role="group"</code> nor an <code>aria-labelledby</code> of its
          own — the one <code>aria-labelledby</code> in the bundle sits on the list element
          (<code>:903</code>) and names the whole menu — so the visual grouping has no counterpart in the
          accessibility tree.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Pick by the shape of the model and by the gesture that opens it. A flat list of commands is
          <code>p-menu</code>; nested commands are <code>p-tieredMenu</code>; commands that belong to a thing you
          right-click are <code>p-contextMenu</code>. A horizontal bar of menus is <code>p-menubar</code>, which has
          its own guide.
        </p>

        <h3>Which of the four, and what it costs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>component</th><th>reach for it when</th><th>opened by</th><th>the price</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menu</code></td>
                <td>{{ m.pickMenu }}</td>
                <td>{{ m.openMenu }}</td>
                <td>{{ m.costMenu }}</td>
              </tr>
              <tr>
                <td><code>p-tieredMenu</code></td>
                <td>{{ m.pickTiered }}</td>
                <td>{{ m.openTiered }}</td>
                <td>{{ m.costTiered }}</td>
              </tr>
              <tr>
                <td><code>p-contextMenu</code></td>
                <td>{{ m.pickCtx }}</td>
                <td>{{ m.openCtx }}</td>
                <td>{{ m.costCtx }}</td>
              </tr>
              <tr>
                <td><code>p-menubar</code></td>
                <td>{{ m.pickBar }}</td>
                <td>{{ m.openBar }}</td>
                <td>{{ m.costBar }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The <code>p-menubar</code> row is a pointer, not a summary: that component has its own guide with its own
          measurements, and nothing about it is restated here.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — commands only a right-click can reach</span>
            <div class="dd__stage">
              <div #ddTargetBad class="target" tabindex="0" role="group" [attr.aria-label]="labels.ddBadTarget">
                {{ labels.ddBadHint }}
              </div>
              <p-contextMenu #ddBadMenu [target]="ddTargetBad" [model]="flat" [ariaLabel]="labels.ddBadMenu" />
            </div>
            <p class="dd__why">{{ m.ddCtxBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the same commands behind a real control as well</span>
            <div class="dd__stage">
              <div #ddTargetGood class="target" tabindex="0" role="group" [attr.aria-label]="labels.ddGoodTarget">
                {{ labels.ddGoodHint }}
              </div>
              <p-button label="Row actions" size="small" severity="secondary" (onClick)="ddGoodMenu.show($event)" />
              <p-contextMenu #ddGoodMenu [target]="ddTargetGood" [model]="flat" [ariaLabel]="labels.ddGoodMenu" />
            </div>
            <p class="dd__why">{{ m.ddCtxGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The only listener the component binds is for <code>triggerEvent</code>, default
          <code>contextmenu</code> (<code>openng-optimus-ui-contextmenu.mjs:708</code>,
          <code>:864-891</code>), and it is bound once during initialization, off whichever of
          <code>global</code> and <code>target</code> is set at that moment. Which of the two paths is taken is
          decided there as well, from <code>isIOS() || isAndroid()</code> (<code>:861-863</code>) rather than from a
          touch capability — and on that branch it is not one listener but two, <code>touchstart</code> and
          <code>touchend</code> (<code>:880-886</code>), driving a long press with <code>pressDelay</code> 500 ms
          (<code>:763</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — markup in a label via <code>escape: false</code></span>
            <div class="dd__stage">
              <p-menu [model]="escapedOff" [ariaLabel]="labels.ddEscapeBad" />
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a plain label, decoration from <code>icon</code></span>
            <div class="dd__stage">
              <p-menu [model]="escapedOn" [ariaLabel]="labels.ddEscapeGood" />
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages bind two items to the same component; on the left <code>escape</code> is switched off and the
          labels carry markup, on the right neither is true. The default branch interpolates the label as text
          (<code>openng-optimus-ui-menu.mjs:223</code>); <code>escape: false</code> takes the other branch
          (<code>:225</code>), which pipes the label through <code>SafeHtmlPipe</code> — and that pipe calls
          <code>bypassSecurityTrustHtml</code> (<code>:135</code>), so Angular's sanitizer is switched off for that
          string. The same pipe returns the value untouched outside the browser (<code>:132-134</code>). That polarity is
          <code>p-menu</code>'s alone: <code>p-tieredMenu</code> and <code>p-contextMenu</code> test the raw
          value through <code>getItemProp</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:344</code>, <code>openng-optimus-ui-contextmenu.mjs:324</code>),
          so an unset <code>escape</code> is falsy there and the label goes down the
          <code>#htmlLabel</code> branch with <code>[innerHTML]</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:355</code>, <code>openng-optimus-ui-contextmenu.mjs:335</code>).
          Neither of those two bundles carries <code>bypassSecurityTrustHtml</code> or
          <code>safeHtml</code>, so Angular still sanitizes what it renders — but the default there is
          markup, not text, and only <code>escape: true</code> gets the text branch.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>model</code> is not the same construct in the three. On <code>p-tieredMenu</code> and
          <code>p-contextMenu</code> it is a setter that rebuilds the processed item tree once per assignment
          (<code>openng-optimus-ui-tieredmenu.mjs:734</code>,
          <code>openng-optimus-ui-contextmenu.mjs:697-699</code>), so a mutation of the array never reaches the view
          at all. On <code>p-menu</code> it is a plain field (<code>openng-optimus-ui-menu.mjs:327</code>) that the
          template iterates directly (<code>:965</code>) under <code>OnPush</code> (<code>:1001</code>), so a
          mutation surfaces whenever the component is checked next rather than when you made it. Either way the kit's
          convention is a <code>computed()</code> that returns a fresh array, which is also what makes a language
          switch propagate.
        </p>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C APG — Menu and Menubar</a
            >
            — the menu pattern all three claim: roles, the keyboard contract, and where focus returns on close.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 a background-only focus indicator owes.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — what a menu that closes without restoring its trigger, or leaves an open submenu in the tab order, owes.
          </li>
          <li>
            <code>openng-optimus-ui-menu.mjs</code>, <code>openng-optimus-ui-tieredmenu.mjs</code>, and
            <code>openng-optimus-ui-contextmenu.mjs</code> in <code>&#64;openng/optimus-ui/fesm2022</code> (2.0.2) — the shipped source every line reference in this guide points into.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          All three are the same box: a bordered surface with a padded list of padded rows, drawn from the Aura
          preset's shared <code>navigation</code> group. What differs visually is only the shadow, the submenu, and
          whether the panel is placed by a trigger or by a pointer.
        </p>

        <h3>The shared token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>part</th><th>preset key</th><th>resolved value</th></tr>
            </thead>
            <tbody>
              <tr><td>list padding / gap</td><td><code>navigation.list</code></td><td>{{ m.tokList }}</td></tr>
              <tr><td>item padding / gap</td><td><code>navigation.item</code></td><td>{{ m.tokItem }}</td></tr>
              <tr><td>item corner</td><td><code>navigation.item.borderRadius</code></td><td>{{ m.tokItemRadius }}</td></tr>
              <tr><td>group header</td><td><code>navigation.submenuLabel</code></td><td>{{ m.tokSubmenuLabel }}</td></tr>
              <tr><td>submenu chevron</td><td><code>navigation.submenuIcon.size</code></td><td>{{ m.tokSubmenuIcon }}</td></tr>
              <tr><td>panel shadow</td><td><code>overlay.navigation.shadow</code></td><td>{{ m.tokShadow }}</td></tr>
              <tr><td>focused row</td><td><code>navigation.item.focusBackground</code></td><td>{{ m.tokFocusBg }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Keys and values from <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> and the three
          component presets <code>&#64;openng/optimus-ui-themes/dist/aura/menu/index.mjs</code>,
          <code>.../aura/tieredmenu/index.mjs</code> and <code>.../aura/contextmenu/index.mjs</code> — minified
          single-line bundles, so they are cited by path and export (<code>root</code>, <code>list</code>,
          <code>item</code>, <code>separator</code>, plus <code>submenuLabel</code> on menu and
          <code>submenu</code>/<code>submenuIcon</code> on the other two). All three presets resolve
          <code>root.shadow</code> to the same <code>overlay.navigation.shadow</code>; what differs is where the
          stylesheet paints it. <code>p-contextMenu</code> paints it on its root unconditionally
          (<code>&#64;openng/optimus-ui-styles/dist/contextmenu/index.mjs:7</code>), the other two only on their
          popup root class (<code>.../menu/index.mjs:69-70</code> with
          <code>openng-optimus-ui-menu.mjs:34</code>, <code>.../tieredmenu/index.mjs:123-125</code> with
          <code>openng-optimus-ui-tieredmenu.mjs:32</code>) — so an inline <code>p-menu</code> or
          <code>p-tieredMenu</code> is flat, a popup of either is not.
        </p>
        <p>
          <strong>Across the visual styles.</strong> Only the corners move: the panel's
          <code>&#123;content.border.radius&#125;</code> and the row's <code>&#123;border.radius.sm&#125;</code> resolve
          through the active style's <code>presetOverrides</code> (<code>src/app/services/ui-styles.ts</code>) — square in
          werkbund, rounder in lernwerkstatt (the default) and skizzenbuch, near-square in blaupause. No style overrides the
          <code>navigation</code> color tokens, so the panel and label colors are Aura's stock palette in every style.
          <code>src/styles.scss</code> adds the kit's one focus ring on the focused item of all three, and puts the item
          icon of all three and the submenu chevron of the tiered and context menus in
          <code>--text-color-secondary</code>.
        </p>

        <h3>The focus indicator: the kit's ring</h3>
        <p>
          Aura draws no focus ring. In all three stylesheets the list sets <code>outline: 0 none</code> and the focused
          row — marked with the <code>.p-focus</code> class, since DOM focus stays on the list — is drawn by swapping
          its background and text color; no <code>:focus-visible</code> rule exists in any of them. The kit adds the
          ring every focusable Optimus part wears: 2px <code>--primary-color-fg</code> on the focused item's content
          box, drawn inside it (offset -2px) because the rows sit 2px apart in a panel that clips. It has to stand off
          both the focus tint inside and the panel outside, and it does, on every style, mode and accent.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>surface</th><th>criterion</th><th>threshold</th><th>what clears it (CONTRAST.MD "menu focus")</th></tr>
            </thead>
            <tbody>
              <tr><td>item label</td><td>SC 1.4.3</td><td>4.5:1</td><td>{{ m.crLabel }}</td></tr>
              <tr><td>focused row</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crFocus }}</td></tr>
              <tr><td>submenu chevron</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crChevron }}</td></tr>
              <tr><td>item icon</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The rules: <code>&#64;openng/optimus-ui-styles/dist/menu/index.mjs:13</code> and <code>:51-53</code>,
          <code>.../tieredmenu/index.mjs:16</code> and <code>:80-82</code>,
          <code>.../contextmenu/index.mjs:16</code> and <code>:81-83</code>. The ratios are the "menu focus" rows of
          <code>docs/generated/CONTRAST.MD</code>: measured on the menubar's tokens, and the gate asserts that menu,
          tiered menu and context menu resolve to the same panel, tint, chevron and icon — so the rows stand for all
          three.
          Aura's tint alone is listed there as informational (1.10:1 light, 1.19:1 dark), the reason the kit adds the
          ring.
        </p>

        <h3>Where each panel is placed</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>panel</th><th>anchored to</th><th>collision handling</th><th>writing direction</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.posMenuWhat }}</td><td>{{ m.posMenuAnchor }}</td><td>{{ m.posMenuFlip }}</td><td>{{ m.posMenuDir }}</td></tr>
              <tr><td>{{ m.posTieredWhat }}</td><td>{{ m.posTieredAnchor }}</td><td>{{ m.posTieredFlip }}</td><td>{{ m.posTieredDir }}</td></tr>
              <tr><td>{{ m.posCtxWhat }}</td><td>{{ m.posCtxAnchor }}</td><td>{{ m.posCtxFlip }}</td><td>{{ m.posCtxDir }}</td></tr>
              <tr><td>{{ m.posCtxSubWhat }}</td><td>{{ m.posCtxSubAnchor }}</td><td>{{ m.posCtxSubFlip }}</td><td>{{ m.posCtxSubDir }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-tieredmenu.mjs:182-188</code> delegates to <code>nestedPosition</code>, an export of
          <code>&#64;openng/optimus-ui-utils/dist/dom/index.mjs</code> (minified, cited by export), which computes
          both a horizontal and a vertical offset and writes <code>inset-inline-start</code>;
          <code>openng-optimus-ui-contextmenu.mjs:231-244</code> writes <code>top: 0px</code> unconditionally and the
          physical <code>left</code>. The context menu's own root is placed from the event's page coordinates and
          flips on both axes (<code>:1275-1301</code>).
        </p>

        <h3>On a narrow screen</h3>
        <p>
          <code>p-menu</code> and <code>p-contextMenu</code> have no responsive behavior;
          <code>p-tieredMenu</code> has exactly one. Every root carries <code>min-width: 12.5rem</code> (200px), and
          none of the three stylesheets contains a media query, a <code>max-height</code> or an
          <code>overflow-y</code> — so no panel ever narrows below 200px and none scrolls inside itself however long
          the model gets. What <code>p-tieredMenu</code> adds is a breakpoint in JavaScript rather than in CSS: below
          <code>breakpoint</code> (default <code>960px</code>) it puts <code>p-tieredmenu-mobile</code> on its root
          and its submenus stop flying out — they stack in flow, unshadowed, indented by 1rem. The context menu ships
          the same stylesheet rules but never gets the class, so it never stacks. Layout guidance: keep the model
          short enough to fit the viewport height, give an inline menu a parent that may scroll, place a popup trigger
          where 200px still fits beside it — and do not count on the stacked form outside
          <code>p-tieredMenu</code>.
        </p>
        <p class="src-note">
          <code>min-width</code> at <code>&#64;openng/optimus-ui-styles/dist/menu/index.mjs:7</code>,
          <code>.../tieredmenu/index.mjs:7</code>, <code>.../contextmenu/index.mjs:8</code>; none of the three
          contains a <code>&#64;media</code> rule, a <code>max-height</code> or an <code>overflow-y</code>. The
          tiered menu's switch is not a CSS media query but a <code>matchMedia</code> listener in the bundle:
          <code>breakpoint</code>, default <code>960px</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:760</code>), is turned into a query during
          <code>onInit</code> (<code>:941-951</code>) whose result drives <code>p-tieredmenu-mobile</code> in the
          root class map (<code>:33</code>), and <code>.../tieredmenu/index.mjs:128-134</code> makes every submenu
          under that class <code>position: static</code> with the indent token
          <code>submenu.mobileIndent</code> (1rem). The same rules exist at
          <code>.../contextmenu/index.mjs:124-135</code>, where the class is never set.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Three input surfaces that look alike and are not. Each declares inputs it never reads, and each accepts four
          it does not declare. The tables below mark, for every input, whether the value reaches something that reads
          it.
        </p>

        <h3><code>p-menu</code> — own inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>default</th><th>reaches</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td>{{ m.inMenuModel }}</td></tr>
              <tr><td><code>popup</code></td><td><code>false</code></td><td>{{ m.inMenuPopup }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.inMenuTabindex }}</td></tr>
              <tr><td><code>ariaLabel</code>, <code>ariaLabelledBy</code></td><td>—</td><td>{{ m.inMenuAria }}</td></tr>
              <tr><td><code>appendTo</code></td><td>config default</td><td>{{ m.inMenuAppendTo }}</td></tr>
              <tr><td><code>autoZIndex</code>, <code>baseZIndex</code></td><td><code>true</code>, <code>0</code></td><td>{{ m.inMenuZ }}</td></tr>
              <tr><td><code>id</code>, <code>style</code>, <code>styleClass</code></td><td>generated id</td><td>{{ m.inMenuChrome }}</td></tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.inMenuMotion }}</td></tr>
              <tr><td><code>showTransitionOptions</code>, <code>hideTransitionOptions</code></td><td>set</td><td>{{ m.inMenuDeadTransition }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations at <code>openng-optimus-ui-menu.mjs:327-397</code>, compiled input list at <code>:869</code>.
          The two transition inputs hold defaults and appear nowhere else in the file. The
          <code>#header</code> template is queried (<code>:869</code>, field at <code>:520-521</code>) and the
          content query does assign it, but it appears in no branch of the template — <code>#start</code>,
          <code>#end</code>, <code>#item</code> and <code>#submenuheader</code> are the four that render. A
          <code>pTemplate="header"</code> is worse than ignored: <code>onAfterContentInit</code> has no
          <code>header</code> case, so it falls into the <code>default</code> arm (<code>:554-556</code>) and
          silently becomes the item template.
        </p>

        <h3><code>p-tieredMenu</code> and <code>p-contextMenu</code> — what differs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>popup</code></td><td>{{ m.cmpPopupT }}</td><td>{{ m.cmpPopupC }}</td></tr>
              <tr><td><code>target</code>, <code>global</code></td><td>{{ m.cmpTargetT }}</td><td>{{ m.cmpTargetC }}</td></tr>
              <tr><td><code>triggerEvent</code></td><td>{{ m.cmpTriggerT }}</td><td>{{ m.cmpTriggerC }}</td></tr>
              <tr><td><code>breakpoint</code></td><td>{{ m.cmpBreakT }}</td><td>{{ m.cmpBreakC }}</td></tr>
              <tr><td><code>autoDisplay</code></td><td>{{ m.cmpAutoT }}</td><td>{{ m.cmpAutoC }}</td></tr>
              <tr><td><code>disabled</code></td><td>{{ m.cmpDisabledT }}</td><td>{{ m.cmpDisabledC }}</td></tr>
              <tr><td><code>tabindex</code></td><td>{{ m.cmpTabT }}</td><td>{{ m.cmpTabC }}</td></tr>
              <tr><td><code>pressDelay</code></td><td>{{ m.cmpPressT }}</td><td>{{ m.cmpPressC }}</td></tr>
              <tr><td><code>showTransitionOptions</code>, <code>hideTransitionOptions</code></td><td>{{ m.cmpTransT }}</td><td>{{ m.cmpTransC }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Compiled input lists at <code>openng-optimus-ui-tieredmenu.mjs:1459</code> and
          <code>openng-optimus-ui-contextmenu.mjs:1424</code>. The half-dead
          <code>breakpoint</code> on the context menu is the class map at
          <code>openng-optimus-ui-contextmenu.mjs:38</code>: it reads <code>instance.queryMatches</code> without
          calling the signal, and the instance passed there is the <code>ContextMenuSub</code>, whose fields
          (<code>:129-142</code>) contain no such member — while the tiered menu's equivalent at
          <code>openng-optimus-ui-tieredmenu.mjs:33</code> calls the signal on a component that has it.
        </p>

        <h3>Keys, measured against the three key handlers</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>key</th><th><code>p-menu</code></th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Arrow Down / Up</td><td>{{ m.kbArrowM }}</td><td>{{ m.kbArrowT }}</td><td>{{ m.kbArrowC }}</td></tr>
              <tr><td>Arrow Right / Left</td><td>{{ m.kbLatM }}</td><td>{{ m.kbLatT }}</td><td>{{ m.kbLatC }}</td></tr>
              <tr><td>Home / End</td><td>{{ m.kbHomeM }}</td><td>{{ m.kbHomeT }}</td><td>{{ m.kbHomeC }}</td></tr>
              <tr><td>Enter / Space</td><td>{{ m.kbEnterM }}</td><td>{{ m.kbEnterT }}</td><td>{{ m.kbEnterC }}</td></tr>
              <tr><td>Escape</td><td>{{ m.kbEscM }}</td><td>{{ m.kbEscT }}</td><td>{{ m.kbEscC }}</td></tr>
              <tr><td>Tab</td><td>{{ m.kbTabM }}</td><td>{{ m.kbTabT }}</td><td>{{ m.kbTabC }}</td></tr>
              <tr><td>printable character</td><td>{{ m.kbTypeM }}</td><td>{{ m.kbTypeT }}</td><td>{{ m.kbTypeC }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Handlers: <code>openng-optimus-ui-menu.mjs:648-733</code>,
          <code>openng-optimus-ui-tieredmenu.mjs:1056-1102</code>,
          <code>openng-optimus-ui-contextmenu.mjs:1038-1084</code>. Nothing is highlighted when a menu opens: a
          <code>p-menu</code> popup focuses the list without selecting an item
          (<code>openng-optimus-ui-menu.mjs:574</code>, <code>:632</code>) and the equivalent call for an inline
          <code>p-tieredMenu</code> is commented out (<code>openng-optimus-ui-tieredmenu.mjs:1209</code>) — the first
          arrow key repairs it. A <code>p-tieredMenu</code> popup and a <code>p-contextMenu</code> each focus their
          root list once the overlay has entered (<code>openng-optimus-ui-tieredmenu.mjs:1229-1237</code>,
          <code>openng-optimus-ui-contextmenu.mjs:1205-1208</code>). The Escape and Tab rows for <code>p-menu</code>
          come out of one shared case (<code>openng-optimus-ui-menu.mjs:671-678</code>) that calls
          <code>focus(this.target)</code> and then <code>hide()</code> for both keys and calls no
          <code>preventDefault()</code>, so Tab's own sequential navigation carries on from the trigger.
        </p>

        <h3>The extra tab stops in a nested menu</h3>
        <pre class="code-block"><code>{{ tabStopSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-tieredmenu.mjs:437-453</code> and
          <code>openng-optimus-ui-contextmenu.mjs:414-428</code> instantiate the nested list without binding
          <code>tabindex</code> and without wiring <code>menuKeydown</code>, <code>menuFocus</code> or
          <code>menuBlur</code>; the sub component's own default is <code>0</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:158</code>,
          <code>openng-optimus-ui-contextmenu.mjs:142</code>), and the list element binds it directly
          (<code>:273</code> and <code>:254</code>). That makes an open submenu list focusable, but it is
          <code>display: flex</code> only while its item is active
          (<code>openng-optimus-ui-tieredmenu.mjs:26</code>) and Tab on the root list runs <code>hide()</code> first
          (<code>:1169-1176</code>; the context menu has its own at
          <code>openng-optimus-ui-contextmenu.mjs:1148-1155</code>), which clears every level. What keeps the case
          alive is that an inline <code>p-tieredMenu</code> binds no outside-click listener — the binding sits behind
          <code>if (this.popup)</code> in <code>onOverlayAfterEnter</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:1229-1231</code>) — and <code>onMenuBlur</code>
          (<code>:1212-1217</code>) clears only <code>dirty</code> and the focused-item info, never
          <code>activeItemPath</code>. A submenu opened by click or key therefore stays open, and stays
          <code>display: flex</code>, after focus has moved away. Which element Tab actually reaches then is a browser question the bundle does
          not answer; check it in the browser. The context menu's nested list also receives no
          <code>ariaLabelledBy</code>, where the tiered menu passes the parent item's id.
        </p>

        <h3><code>MenuItem</code> fields, per component</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>field</th><th><code>p-menu</code></th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>label</code>, <code>icon</code>, <code>command</code>, <code>disabled</code>, <code>visible</code>, <code>separator</code>, <code>url</code>, <code>routerLink</code>, <code>styleClass</code>, <code>escape</code></td><td>{{ m.miCore }}</td><td>{{ m.miCore }}</td><td>{{ m.miCore }}</td></tr>
              <tr><td><code>items</code></td><td>{{ m.miItemsM }}</td><td>{{ m.miItemsT }}</td><td>{{ m.miItemsT }}</td></tr>
              <tr><td><code>badge</code></td><td>{{ m.miBadgeM }}</td><td>{{ m.miBadgeT }}</td><td>{{ m.miBadgeM }}</td></tr>
              <tr><td><code>tooltip</code></td><td>{{ m.miNo }}</td><td>{{ m.miYes }}</td><td>{{ m.miNo }}</td></tr>
              <tr><td><code>tooltipOptions</code></td><td>{{ m.miYes }}</td><td>{{ m.miYes }}</td><td>{{ m.miYes }}</td></tr>
              <tr><td><code>expanded</code>, <code>tooltipPosition</code></td><td>{{ m.miNo }}</td><td>{{ m.miNo }}</td><td>{{ m.miNo }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The interface is declared in <code>&#64;openng/optimus-ui/types/openng-optimus-ui-api.d.ts</code>, which is
          shared by every menu-shaped component in the library — so a field existing on the type says nothing about
          whether the component you bound it to reads it. <code>label</code> and <code>disabled</code> may also be
          functions and are resolved before use (<code>openng-optimus-ui-menu.mjs:623-628</code>).
        </p>

        <h3>Four inputs none of the three declares</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>what it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pt</code></td><td>pass-through attributes per internal section</td></tr>
              <tr><td><code>ptOptions</code></td><td>how a <code>pt</code> object merges with the preset's own</td></tr>
              <tr><td><code>unstyled</code></td><td>renders without the preset's classes</td></tr>
              <tr><td><code>dt</code></td><td>design-token overrides scoped to this instance</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared once on <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>) and inherited by all three, which is why none of them
          lists these in its own compiled inputs. Read the base class before calling any Optimus input table complete.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>Every menu has a name — <code>ariaLabel</code> or <code>ariaLabelledBy</code> — because the list is what a screen reader lands on.</li>
          <li>Every entry is a command with a <code>label</code>; destinations are links outside a menu.</li>
          <li>No focus rule of your own on the items — the kit's one ring already marks the focused row on the tint and the panel; a second rule would drift.</li>
          <li>Nothing is reachable only through a right-click or only through hover.</li>
          <li>The whole path — open, into a submenu, back out, close — is walked by keyboard, including whatever an open nested list adds to the tab order.</li>
          <li><code>model</code> is rebuilt as a new array on every change, language switches included.</li>
          <li>No <code>escape: false</code> on a label built from anything a user or an API supplied — and in a <code>p-tieredMenu</code> or <code>p-contextMenu</code>, an explicit <code>escape: true</code>, because an unset value renders the label as markup there.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          None of the three contributes a single string. Where the menubar borrows a name for its hamburger from the
          library's translation config, these have no built-in text at all — every label, every name, every empty
          state is yours, and all of it arrives through <code>model</code>.
        </p>

        <h3>What comes from where</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>string</th><th>source</th></tr>
            </thead>
            <tbody>
              <tr><td>item labels, group headers, badge text</td><td>your <code>MenuItem[]</code></td></tr>
              <tr><td>the menu's accessible name</td><td>your <code>ariaLabel</code>, or an element you point <code>ariaLabelledBy</code> at</td></tr>
              <tr><td>the trigger's label and its "opens a menu" hint</td><td>yours, on the button — no component writes it</td></tr>
              <tr><td>anything the library ships</td><td>nothing; none of the three reads the translation config</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Searched across all three bundles: no <code>config.translation</code> reference and no literal user-facing
          string. The one library-rendered glyph is the submenu chevron, an <code>svg</code> marked
          <code>aria-hidden</code> (<code>openng-optimus-ui-tieredmenu.mjs:421-427</code>).
        </p>

        <h3>A translated model that survives a language switch</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> takes a key and nothing else
          (<code>translation.service.ts</code>), so the call belongs inside a <code>computed()</code>: the signal
          re-evaluates on a language change and hands the component a new array, which is the only kind of change its
          <code>model</code> setter reacts to.
        </p>

        <h3>What this does not solve</h3>
        <ul class="checklist">
          <li>{{ m.i18nRtlGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
          <li>{{ m.i18nTypeaheadGap }}</li>
        </ul>
        <p class="src-note">
          The first is the placement difference quoted in Design; the second follows from the fixed
          <code>min-width</code> and the absence of any wrapping rule; the third from the typeahead comparing the
          typed characters against the label with a plain lowercase comparison
          (<code>openng-optimus-ui-tieredmenu.mjs:1316-1343</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.3</strong> — 2026-09-23 — Synced with the last focus round: the item icon of all three menus is
            <code>--text-color-secondary</code>, gated in "menu focus".
          </li>
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the focused item wears the
            kit's one 2px ring and the tiered/context chevron is <code>--text-color-secondary</code>, both cited from
            CONTRAST.MD "menu focus"; the "ship your own ring" advice removed.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles: every line
            reference holds; design names what the styles change (corner radii only, no color or menu rule) and points at
            the Aura stock focus pair computed in the menubar guide; Usage closes with annotated sources.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MenuArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Visible strings of the live stages, kept out of the measurement object. */
  readonly labels = {
    inlineMenu: 'Document actions',
    popupMenu: 'Document actions, popup',
    tieredMenu: 'Export options',
    groupedMenu: 'Document actions by section',
    ctxMenu: 'Actions for the sample region',
    ctxTarget: 'Sample region',
    ctxHint: 'Right-click here, or press the context-menu key',
    ddBadMenu: 'Row actions, right-click only',
    ddBadTarget: 'Sample row without a control',
    ddBadHint: 'Right-click is the only way in',
    ddGoodMenu: 'Row actions',
    ddGoodTarget: 'Sample row with a control',
    ddGoodHint: 'Right-click, or use the button',
    ddEscapeBad: 'Labels with markup',
    ddEscapeGood: 'Plain labels',
  };

  readonly flat: MenuItem[] = [
    { label: 'Rename', icon: 'pi pi-pencil' },
    { label: 'Duplicate', icon: 'pi pi-copy' },
    { separator: true },
    { label: 'Archive', icon: 'pi pi-inbox' },
    { label: 'Delete', icon: 'pi pi-trash', disabled: true },
  ];

  readonly grouped: MenuItem[] = [
    { label: 'Editing', items: [{ label: 'Rename', icon: 'pi pi-pencil' }, { label: 'Duplicate', icon: 'pi pi-copy' }] },
    { label: 'Lifecycle', items: [{ label: 'Archive', icon: 'pi pi-inbox' }, { label: 'Delete', icon: 'pi pi-trash' }] },
  ];

  readonly tiered: MenuItem[] = [
    { label: 'Rename', icon: 'pi pi-pencil' },
    {
      label: 'Export',
      icon: 'pi pi-upload',
      items: [
        { label: 'As CSV' },
        { label: 'As JSON' },
        { label: 'As archive', items: [{ label: 'Zip' }, { label: 'Tar' }] },
      ],
    },
    { separator: true },
    { label: 'Delete', icon: 'pi pi-trash' },
  ];

  readonly escapedOff: MenuItem[] = [
    { label: '<b>Publish</b> now', escape: false },
    { label: 'Save as <i>draft</i>', escape: false },
  ];

  readonly escapedOn: MenuItem[] = [
    { label: 'Publish now', icon: 'pi pi-send' },
    { label: 'Save as draft', icon: 'pi pi-file' },
  ];

  /** Flat measurement constants — substituted by the tab extractor. */
  readonly m = {
    menuList: 'ul role="menu", tabindex from the input, aria-activedescendant',
    menuItem: 'li role="menuitem", aria-label, aria-disabled',
    menuRel: 'none — a flat list has no haspopup, expanded, setsize, or posinset',
    tieredList: 'ul role="menu", tabindex, aria-orientation="vertical", aria-activedescendant',
    tieredItem: 'li role="menuitem", aria-label, aria-disabled',
    tieredRel: 'aria-haspopup and aria-expanded on group items, aria-setsize and aria-posinset on all',
    ctxList: 'ul role="menu", tabindex, aria-orientation="vertical", aria-activedescendant',
    ctxItem: 'li role="menuitem", aria-label, aria-disabled',
    ctxRel: 'the tiered menu\'s four plus aria-level, which the tiered menu does not set',

    pickMenu: 'one flat list of commands hangs off one control, or sits inline as a panel',
    openMenu: 'toggle() from your trigger, or nothing at all when inline',
    costMenu: 'no submenus and no typeahead; a group header is a decorative row with no accessible grouping',
    pickTiered: 'the same, but the commands nest',
    openTiered: 'toggle() from your trigger; the first submenu by click, Enter, or ArrowRight, hover only switches after that; nothing when inline',
    costTiered: 'a submenu list still open after focus moved away is focusable in its own right, and Tab out does not restore the trigger',
    pickCtx: 'commands belong to a region or a row the user points at',
    openCtx: 'a contextmenu event on target or on the document, or a long press on touch',
    costCtx: 'closing restores focus to nothing, and the trigger binding is read once at initialization',
    pickBar: 'the commands sit in a horizontal bar of menus',
    openBar: 'covered by the menubar guide',
    costBar: 'a separate component with its own guide — nothing about it is repeated here',

    tokList: 'padding 0.25rem 0.25rem, gap 2px',
    tokItem: 'padding 0.5rem 0.75rem, gap 0.5rem',
    tokItemRadius: '{border.radius.sm}',
    tokSubmenuLabel: 'padding 0.5rem 0.75rem, font-weight 600 (p-menu only)',
    tokSubmenuIcon: '0.875rem',
    tokShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    tokFocusBg: '{surface.100} light / {surface.800} dark, text {text.hover.color}',

    crLabel:
      'The label color against the panel background, at every state including the focused one — Aura stock, not gated here; the menubar guide computes it at 10.35:1 light, 17.72:1 dark.',
    crFocus:
      'The kit ring against the focus tint and against the panel: 4.73–16.30:1 and 5.18–17.85:1 across every style, mode and accent. The tint alone is 1.10:1 / 1.19:1, informational.',
    crChevron:
      'The kit chevron (--text-color-secondary) on the panel and on the focus tint: 5.21–8.48:1 and 4.76–7.13:1 — the only signal that an item has a submenu (tiered and context menu; p-menu has none).',
    crIcon:
      'The kit icon color (--text-color-secondary; Aura surface.400 was 2.56:1) on the panel and on the focus tint: 5.21–8.48:1 and 4.76–7.13:1 — held to 3:1 so an icon-only item holds.',

    posMenuWhat: 'p-menu popup',
    posMenuAnchor: 'the element that dispatched the event passed to toggle()',
    posMenuFlip: 'delegated to the library positioning helper; closes on window resize and on scroll of an ancestor',
    posMenuDir: 'not applicable — one panel, no lateral offset',
    posTieredWhat: 'p-tieredMenu submenu',
    posTieredAnchor: 'the parent item',
    posTieredFlip: 'horizontal and vertical offsets computed against the viewport',
    posTieredDir: 'logical — writes inset-inline-start, so it mirrors under dir="rtl"',
    posCtxWhat: 'p-contextMenu root',
    posCtxAnchor: 'the event page coordinates plus one pixel',
    posCtxFlip: 'flips left and up at the right and bottom edges, then clamps into the scroll area',
    posCtxDir: 'physical left and top, computed from the pointer',
    posCtxSubWhat: 'p-contextMenu submenu',
    posCtxSubAnchor: 'the parent item',
    posCtxSubFlip: 'horizontal only — top is set to 0px on every open, so a deep submenu runs off the bottom',
    posCtxSubDir: 'physical left, so it does not mirror under dir="rtl"',

    inMenuModel: 'a plain field, not a setter; the template iterates the array directly under OnPush, so a mutated array re-renders only at the component\'s next check',
    inMenuPopup: 'the whole overlay path — positioning, the document click listener, the focus return on Escape',
    inMenuTabindex: 'the list element; this is the single tab stop of the component',
    inMenuAria: 'the list element, and they are the only naming route the component offers',
    inMenuAppendTo: 'where the overlay container is moved on open, and restored from on close',
    inMenuZ: 'the layering of the popup container; both are read on every open',
    inMenuChrome: 'the container element; a missing id is generated, so it differs per render',
    inMenuMotion: 'the motion directive on the overlay container',
    inMenuDeadTransition: 'nothing — declared with defaults and read nowhere in the bundle',

    cmpPopupT: 'yes — toggle() from a trigger, or leave it out for an inline panel',
    cmpPopupC: 'no such input; it is always an overlay',
    cmpTargetT: 'no such inputs',
    cmpTargetC: 'yes, and they are read once during initialization; with neither set no listener is bound at all',
    cmpTriggerT: 'no such input',
    cmpTriggerC: 'yes, default contextmenu; swapped for a long press on iOS and Android',
    cmpBreakT: 'live: adds the mobile class to the root, which stacks the submenus, and suppresses hover-opening below it. The input value is read once at init, the match itself stays live through a change listener',
    cmpBreakC: 'half dead: the hover suppression works, the mobile class never applies',
    cmpAutoT: 'yes, default true — but it only forwards the mouseenter; the menu acts on it while dirty, which a click or key activation sets, so hover never opens the first submenu',
    cmpAutoC: 'no such input; hovering always opens the submenu',
    cmpDisabledT: 'only reaches the root list tabindex; it does not block hover or a programmatic show()',
    cmpDisabledC: 'no such input',
    cmpTabT: 'yes, on the root list only',
    cmpTabC: 'no such input; the root list keeps the sub component default of 0',
    cmpPressT: 'no such input',
    cmpPressC: 'yes, 500 ms, used for the touch long press',
    cmpTransT: 'declared with defaults and read nowhere',
    cmpTransC: 'not declared',

    kbArrowM: 'moves one item, skipping disabled ones; does not wrap at either end',
    kbArrowT: 'moves one item, skipping disabled ones; does not wrap',
    kbArrowC: 'moves one item, skipping disabled ones; does not wrap',
    kbLatM: 'nothing — the list is flat',
    kbLatT: 'Right opens the submenu and moves into it; Left closes one level',
    kbLatC: 'Right opens the submenu and moves into it; Left closes one level',
    kbHomeM: 'first item / last item',
    kbHomeT: 'first item / last item',
    kbHomeC: 'first item / last item',
    kbEnterM: 'clicks the focused item; in a popup the trigger is focused first, then the menu closes',
    kbEnterT: 'clicks the focused item',
    kbEnterC: 'clicks the focused item',
    kbEscM: 'in a popup: focuses the trigger and closes; inline: nothing',
    kbEscT: 'closes every open level, not just the current submenu; in a popup the trigger is focused again, inline the root list is',
    kbEscC: 'closes the menu; nothing is focused afterwards',
    kbTabM: 'in a popup: focuses the trigger and closes, without preventDefault — so the browser tabs on from the trigger',
    kbTabT: 'closes the menu without restoring the trigger',
    kbTabC: 'closes the menu without restoring anything',
    kbTypeM: 'nothing — the key handler has no branch for printable characters',
    kbTypeT: 'jumps to the next item whose label starts with the typed characters; buffer clears after 500 ms',
    kbTypeC: 'the same typeahead',

    miCore: 'read',
    miItemsM: 'read as a group header, and once one item has it every top-level item becomes one; the children are flattened into the same flat list',
    miItemsT: 'read as a submenu, to any depth',
    miBadgeM: 'read',
    miBadgeT: 'read, but as a plain span rather than a p-badge',
    miYes: 'read',
    miNo: 'not read',

    ddCtxBad:
      'The only listener is for a pointer gesture, so the commands exist for a mouse user and for nobody else — and the panel gives no visible hint that it is there.',
    ddCtxGood:
      'The same model behind a control that is in the tab order and has a name, so the commands are reachable without a pointer; the right-click stays as the shortcut it is. One caveat: show() positions the panel from the event\'s page coordinates, which a click synthesized from Enter or Space does not carry — check where it lands and hand show() coordinates of your own if it opens at the page corner.',
    ddEscapeBad:
      'The label is inserted as HTML with the sanitizer bypassed, so a label assembled from anything a user or an API supplied is an injection point — and the accessible name is the raw string, angle brackets and all, because aria-label is bound to the unparsed label.',
    ddEscapeGood:
      'The label is a text node, its accessible name is exactly the words in it, and the visual emphasis comes from the icon slot the component already provides.',

    i18nRtlGap:
      'Mirroring is not uniform: the tiered menu places its submenus logically and the context menu places them physically, so under dir="rtl" the two do not behave alike.',
    i18nWidthGap:
      'Length: the panel has a fixed minimum width, no maximum, and no wrapping rule, so a longer translation widens the panel rather than reflowing it.',
    i18nTypeaheadGap:
      'Typeahead matches the label from its first characters, so it follows the translated word rather than a stable shortcut, and a language whose input needs composition does not reach it at all.',
  };

  readonly emittedMarkupSnippet: string = '<!-- one p-menu item: the li carries the role and the name, the anchor carries nothing -->\n' +
    '<li id="pn_id_1_0" class="p-menu-item" role="menuitem" aria-label="Rename"\n' +
    '    aria-disabled="false" data-p-focused="false">\n' +
    '  <div class="p-menu-item-content">\n' +
    '    <a class="p-menu-item-link" tabindex="-1">          <!-- no href unless url is set -->\n' +
    '      <span class="p-menu-item-icon pi pi-pencil"></span>\n' +
    '      <span class="p-menu-item-label">Rename</span>\n' +
    '    </a>\n' +
    '  </div>\n' +
    '</li>\n\n' +
    '<!-- a p-tieredMenu group item adds the two relationship attributes -->\n' +
    '<li role="menuitem" aria-label="Export" aria-haspopup="menu" aria-expanded="false"\n' +
    '    aria-setsize="3" aria-posinset="2"> ... </li>';

  readonly usageSnippet: string = '// A menu model is data, and the component only reacts to a NEW array.\n' +
    'readonly items = computed<MenuItem[]>(() => [\n' +
    "  { label: this.i18n.translate('doc.menu.rename'), icon: 'pi pi-pencil', command: () => this.rename() },\n" +
    "  { label: this.i18n.translate('doc.menu.duplicate'), command: () => this.duplicate() },\n" +
    '  { separator: true },\n' +
    "  { label: this.i18n.translate('doc.menu.delete'), command: () => this.remove(), disabled: this.locked() },\n" +
    ']);\n\n' +
    '<!-- The trigger owns the name and the state; the menu owns only its own name. -->\n' +
    '<p-button [label]="labels().actions" (onClick)="docMenu.toggle($event)" />\n' +
    '<p-menu #docMenu [model]="items()" [popup]="true" [ariaLabel]="labels().actionsMenu" />\n\n' +
    '<!-- No focus rule here: the kit rings the .p-focus item globally (src/styles.scss). -->';

  readonly tabStopSnippet: string = '// tieredmenu / contextmenu: the nested list is created without a tabindex binding,\n' +
    '// so it falls back to the sub component default of 0 and is focusable on its own.\n' +
    '<p-tieredmenusub *ngIf="isItemVisible(processedItem) && isItemGroup(processedItem)"\n' +
    '                 [items]="processedItem.items"\n' +
    '                 [level]="level + 1">   <!-- no [tabindex], no (menuKeydown) -->\n' +
    '</p-tieredmenusub>\n\n' +
    '// Consequence for the caller: a submenu still open after focus has moved away is a\n' +
    '// focusable list of its own. Tab ON the root list hides the menu first, but an inline\n' +
    '// tieredMenu binds no outside-click listener (:1229-1231, popup only) and its blur\n' +
    '// clears only dirty (:1212-1217), so the submenu survives a click into the page.\n' +
    '// Silence the nested list through the submenu section pt addresses (:278 / :252):\n' +
    "// [pt]=\"{ submenu: { tabindex: '-1' } }\"";

  readonly i18nSnippet: string = '// translate() takes a key and nothing else, and the model must be a fresh array,\n' +
    '// so the whole model is one computed() over the translation signal.\n' +
    'readonly exportMenu = computed<MenuItem[]>(() => [\n' +
    "  { label: this.i18n.translate('export.csv'), command: () => this.exportCsv() },\n" +
    "  { label: this.i18n.translate('export.asJson'), command: () => this.exportJson() },\n" +
    ']);\n\n' +
    'readonly menuName = computed(() => this.i18n.translate(\'export.menuName\'));\n\n' +
    '<p-tieredMenu [model]="exportMenu()" [ariaLabel]="menuName()" />';
}
