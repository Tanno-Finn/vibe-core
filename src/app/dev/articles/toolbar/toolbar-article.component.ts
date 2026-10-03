import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ButtonGroupModule } from '@openng/optimus-ui/buttongroup';
import { SplitButtonModule } from '@openng/optimus-ui/splitbutton';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Toolbar, Button Group, and Split Button (Guides, category `library`).
 *
 * Subject: three ways of putting several buttons side by side — `p-toolbar` (a
 * layout container that claims role="toolbar"), `p-buttonGroup` (a visual joiner
 * with an unnamed group inside) and `p-splitbutton` (a default action plus a
 * popup TieredMenu). Everything below is read off the shipped source of Optimus
 * UI 2.0.2 unless a line says otherwise.
 *
 * CLAIMS AND THEIR PROVENANCE:
 *   - openng-optimus-ui-toolbar.mjs: host role="toolbar" (:170, compiled :122),
 *     inputs styleClass + ariaLabelledBy only (:122); template ng-content first,
 *     then start/center/end divs (:123-138); pTemplate types start|left,
 *     end|right, center (:104-120). No keydown binding, no tabindex handling.
 *   - openng-optimus-ui-buttongroup.mjs: no inputs (:69); template
 *     <span class="p-buttongroup" role="group"> (:70); the Optimus rules for
 *     p-button children (:11-33) use physical border-right (:16-19) beside
 *     logical radii (:25-33).
 *   - openng-optimus-ui-splitbutton.mjs: inputs (:86-249), disabled setter
 *     (:227-231), dropdown keydown ArrowDown/ArrowUp -> toggle (:320-325),
 *     dropdown aria attributes (:399-402), content-template branch binds
 *     [disabled]="disabled" (:349), default branch buttonDisabled (:376),
 *     TieredMenu without ariaLabel (:416-429); dir (:179) and plain (:121) are
 *     read nowhere.
 *   - openng-optimus-ui-tieredmenu.mjs: show() resets the focused index to -1
 *     (:1312), the list takes focus after the enter animation (:1236), the first
 *     ArrowDown picks item 0 (:1103-1107), hide(event, true) focuses
 *     relatedTarget || target (:1288), Escape (:1164-1168), Tab (:1169-1176),
 *     leaf click (:1037-1041).
 *   - Kit: the ThemeService button block (theme.service.ts) sets border with
 *     !important on filled and outlined buttons, and the per-style blocks of
 *     src/styles.scss do so again in lernwerkstatt, skizzenbuch and werkbund.
 *     That used to beat the library's joint (a doubled seam, computed style, all
 *     four styles). The "one joint" rule in src/styles.scss
 *     (`.p-buttongroup … .p-button:not(#kit-join)`, `.p-splitbutton-button`,
 *     `.p-splitbutton-dropdown`) re-applies it with an ID-weight selector and
 *     logical properties: the first segment's inline-end border is 0, so the
 *     joint is the second segment's single border. The widths in the Design
 *     table are that border, read from the same rules.
 *   - Focus: `.p-button:focus-visible` is in the kit's one ring rule (2px
 *     --primary-color-fg, 2px offset), measured in CONTRAST.MD "focus ring".
 */
@Component({
  selector: 'app-toolbar-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, ToolbarModule, ButtonModule, ButtonGroupModule, SplitButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'toolbar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Three components put buttons side by side, and each one promises a little more than it delivers. The toolbar
          announces a keyboard model it does not implement, the button group draws a group nobody can name, and the split
          button opens a menu it does not hand focus back from.
        </p>

        <h3>The toolbar as shipped</h3>
        <div class="stage">
          <p-toolbar aria-label="Demo controls (library default)">
            <ng-template #start>
              <div class="bar-group">
                <p-button label="Run" icon="pi pi-play" size="small" (onClick)="log('Run')" />
                <p-button label="Step" icon="pi pi-step-forward" size="small" severity="secondary" [outlined]="true" (onClick)="log('Step')" />
                <p-button label="Reset" icon="pi pi-refresh" size="small" severity="secondary" [outlined]="true" (onClick)="log('Reset')" />
              </div>
            </ng-template>
            <ng-template #end>
              <p-button icon="pi pi-cog" size="small" [text]="true" ariaLabel="Settings" (onClick)="log('Settings')" />
            </ng-template>
          </p-toolbar>
        </div>
        <p class="src-note">
          Press Tab through it: four buttons, four Tab stops, and the arrow keys do nothing. The host carries
          <code>role="toolbar"</code> (<code>openng-optimus-ui-toolbar.mjs:170</code>), but the component binds no
          <code>keydown</code> and manages no <code>tabindex</code> — its whole template is projection
          (<code>:123-138</code>).
        </p>

        <h3>The same toolbar with the arrow keys added</h3>
        <div class="stage">
          <p-toolbar aria-label="Demo controls (roving focus)" (keydown)="onToolbarKeydown($event)">
            <ng-template #start>
              <div class="bar-group">
                @for (tool of tools; track tool.id; let i = $index) {
                  <button
                    pButton
                    type="button"
                    size="small"
                    data-roving
                    [severity]="i === 0 ? undefined : 'secondary'"
                    [outlined]="i !== 0"
                    [attr.tabindex]="activeTool() === i ? 0 : -1"
                    (focus)="activeTool.set(i)"
                    (click)="log(tool.label)"
                  >
                    <i [class]="tool.icon" pButtonIcon aria-hidden="true"></i>
                    <span pButtonLabel>{{ tool.label }}</span>
                  </button>
                }
              </div>
            </ng-template>
            <ng-template #end>
              <button
                pButton
                type="button"
                size="small"
                [text]="true"
                data-roving
                aria-label="Settings"
                [attr.tabindex]="activeTool() === tools.length ? 0 : -1"
                (focus)="activeTool.set(tools.length)"
                (click)="log('Settings')"
              >
                <i class="pi pi-cog" pButtonIcon aria-hidden="true"></i>
              </button>
            </ng-template>
          </p-toolbar>
        </div>
        <p class="src-note">
          One Tab stop; <kbd>←</kbd>/<kbd>→</kbd> move between the buttons, <kbd>Home</kbd>/<kbd>End</kbd> jump to the
          ends, and Tab back in returns to the button you left. The handler sits on the <code>p-toolbar</code> host and
          moves a <code>tabindex="0"</code> through native <code>pButton</code> buttons — the recipe is in
          Development.
        </p>

        <h3>A button group</h3>
        <div class="stage">
          <p id="tb-zoom-label" class="stage__label">Zoom</p>
          <div role="group" aria-labelledby="tb-zoom-label">
            <p-buttonGroup>
              <p-button icon="pi pi-search-minus" ariaLabel="Zoom out" severity="secondary" [outlined]="true" size="small" (onClick)="log('Zoom out')" />
              <p-button label="100%" severity="secondary" [outlined]="true" size="small" (onClick)="log('Reset zoom')" />
              <p-button icon="pi pi-search-plus" ariaLabel="Zoom in" severity="secondary" [outlined]="true" size="small" (onClick)="log('Zoom in')" />
            </p-buttonGroup>
          </div>
        </div>
        <pre class="code-block"><code>{{ groupAnatomySnippet }}</code></pre>
        <p class="src-note">
          The component has no input at all (<code>openng-optimus-ui-buttongroup.mjs:69</code>); its template is one
          <code>&lt;span role="group"&gt;</code> around the projected buttons (<code>:70</code>). The name above comes
          from the wrapper <code>div role="group"</code> with <code>aria-labelledby</code>, which is yours to write.
        </p>

        <h3>A split button</h3>
        <div class="stage">
          <p-splitbutton
            #saveSplit
            label="Save"
            icon="pi pi-save"
            expandAriaLabel="More save options"
            [model]="saveItems"
            (onClick)="log('Save')"
            (onMenuHide)="onSaveMenuHide()"
          />
          <p class="stage__status" aria-live="polite">Last action: {{ lastAction() }}</p>
        </div>
        <p class="src-note">
          Open the menu with <kbd>↓</kbd> on the chevron, pick an entry or press <kbd>Esc</kbd>: focus comes back to
          the chevron. That return is added by this page's <code>onMenuHide</code> handler — the library's own
          restore aims at the non-focusable host element (see Development).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which one</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>You have</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>Three or more controls acting on one region (a demo stage, an editor)</td><td><code>p-toolbar</code> + your arrow keys</td><td>{{ m.whenToolbar }}</td></tr>
              <tr><td>Two or three related actions that should read as one block</td><td><code>p-buttonGroup</code> inside your own named group</td><td>{{ m.whenGroup }}</td></tr>
              <tr><td>One default action and a few variants of it</td><td><code>p-splitbutton</code></td><td>{{ m.whenSplit }}</td></tr>
              <tr><td>Several actions, none of them the obvious default</td><td><code>p-button</code> + <code>p-menu [popup]</code></td><td>{{ m.whenMenuButton }}</td></tr>
              <tr><td>One choice out of a few, which stays selected</td><td><code>p-selectbutton</code></td><td>{{ m.whenSelect }}</td></tr>
              <tr><td>A page header row with a title and a button</td><td>a flex <code>div</code></td><td>{{ m.whenPlainRow }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The toolbar threshold ("three or more controls") and the keyboard contracts are from the WAI-ARIA APG Toolbar
          and Menu Button patterns, linked in Sources.
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a split button without expandAriaLabel</span>
            <div class="dd__stage">
              <p-splitbutton label="Export" [model]="exportItems" (onClick)="log('Export')" />
            </div>
            <p class="dd__why">{{ m.ddUnnamedWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name the chevron</span>
            <div class="dd__stage">
              <p-splitbutton label="Export" expandAriaLabel="More export formats" [model]="exportItems" (onClick)="log('Export')" />
            </div>
            <p class="dd__why">{{ m.ddNamedWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          The chevron's name is <code>menuButtonProps?.ariaLabel || expandAriaLabel</code>, with no default
          (<code>openng-optimus-ui-splitbutton.mjs:399</code>); its only content is an SVG icon (<code>:406-414</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — count on the group to name itself</span>
            <div class="dd__stage">
              <p class="stage__label">Text size</p>
              <p-buttonGroup>
                <p-button label="Smaller" severity="secondary" [outlined]="true" size="small" (onClick)="log('Smaller text')" />
                <p-button label="Larger" severity="secondary" [outlined]="true" size="small" (onClick)="log('Larger text')" />
              </p-buttonGroup>
            </div>
            <p class="dd__why">{{ m.ddGroupBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — wrap it in a group you can label</span>
            <div class="dd__stage">
              <p id="tb-size-label" class="stage__label">Text size</p>
              <div role="group" aria-labelledby="tb-size-label">
                <p-buttonGroup>
                  <p-button label="Smaller" severity="secondary" [outlined]="true" size="small" (onClick)="log('Smaller text')" />
                  <p-button label="Larger" severity="secondary" [outlined]="true" size="small" (onClick)="log('Larger text')" />
                </p-buttonGroup>
              </div>
            </div>
            <p class="dd__why">{{ m.ddGroupGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          The inner <code>span role="group"</code> is created by the component template
          (<code>openng-optimus-ui-buttongroup.mjs:70</code>) and receives no attribute from the host.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA APG, Toolbar pattern</a>
            — the one-Tab-stop, arrow-key contract that <code>role="toolbar"</code> announces, and the three-control threshold.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA APG, Menu Button pattern</a>
            — where focus goes on open (first or last item) and on close (back to the button).
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#group" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA 1.2, role group</a>
            — why an unnamed group is a structure, not an announcement.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.3 Focus Order</a>
            — what a menu that drops focus on close owes.
          </li>
          <li>
            <code>&#64;openng/optimus-ui</code> 2.0.2 — <code>fesm2022/openng-optimus-ui-toolbar.mjs</code>,
            <code>openng-optimus-ui-buttongroup.mjs</code>, <code>openng-optimus-ui-splitbutton.mjs</code> and
            <code>openng-optimus-ui-tieredmenu.mjs</code>: every
            behavior claim on this page, cited by line.
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
              <tr><td><code>toolbar.background</code></td><td><code>&#123;content.background&#125;</code></td><td>{{ m.tokToolbarBg }}</td></tr>
              <tr><td><code>toolbar.border.color</code></td><td><code>&#123;content.border.color&#125;</code></td><td>{{ m.tokToolbarBorder }}</td></tr>
              <tr><td><code>toolbar.padding</code> / <code>gap</code></td><td><code>0.75rem</code> / <code>0.5rem</code></td><td>{{ m.tokToolbarSpace }}</td></tr>
              <tr><td><code>splitbutton.border.radius</code></td><td><code>&#123;form.field.border.radius&#125;</code></td><td>{{ m.tokSplitRadius }}</td></tr>
              <tr><td><code>splitbutton.rounded.border.radius</code></td><td><code>2rem</code></td><td>{{ m.tokSplitRounded }}</td></tr>
              <tr><td>button group</td><td>none</td><td>{{ m.tokGroup }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/toolbar/index.mjs</code> and
          <code>…/aura/splitbutton/index.mjs</code>; the button group ships no preset file, only rules in
          <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>.
        </p>

        <h3>The joint, per visual style</h3>
        <p>{{ m.seamIntro }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Visual style</th><th>Joint, filled split button (light / dark)</th><th>Joint, outlined group</th><th>Outer corners and shadow</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>3px / 2px</td><td>2px</td><td>{{ m.seamWerkbund }}</td></tr>
              <tr><td>lernwerkstatt</td><td>2px / 2px</td><td>2px</td><td>{{ m.seamLern }}</td></tr>
              <tr><td>skizzenbuch</td><td>1px / 2px</td><td>2px</td><td>{{ m.seamSkizze }}</td></tr>
              <tr><td>blaupause</td><td>1px / 2px</td><td>2px</td><td>{{ m.seamBlau }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The joint is the second segment's <code>border-inline-start</code>; the first segment's
          <code>border-inline-end-width</code> is 0. The widths are the button borders: the ThemeService button block
          in <code>src/app/services/theme.service.ts</code> (<code>border: var(--button-border, none)
          !important</code> on filled, <code>border: 2px solid … !important</code> on outlined) and, in lernwerkstatt,
          skizzenbuch and werkbund, the <code>.p-button:not(.p-button-text):not(.p-button-link)</code> rules in the
          <code>html.style-*</code> blocks of <code>src/styles.scss</code>. Those <code>!important</code> borders
          beat the library joints (<code>border-inline-end: 0 none</code> in
          <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code> and <code>…/splitbutton/index.mjs</code>,
          <code>border-right: 0 none</code> for <code>p-button</code> children,
          <code>openng-optimus-ui-buttongroup.mjs:16-19</code>), so the kit's "one joint" rule in
          <code>src/styles.scss</code> re-applies the joint with <code>!important</code> and an ID-weight selector
          (<code>:not(#kit-join)</code>). The inner radii are zeroed in every style.
        </p>

        <h3>Focus and contrast</h3>
        <p>{{ m.focusContrast }}</p>
        <p class="src-note">
          Ratios from <code>docs/generated/CONTRAST.MD</code>, werkbund block: <code>--control-border</code> on
          <code>--surface-card</code> is 5.23:1 light and 4.91:1 dark (SC 1.4.11 needs 3:1); the filled-button label
          pairs all meet 4.5:1 there. The ring: row <code>focus ring</code>, 3.88–17.85:1 on the page surfaces and
          the dialog panel. The toolbar's own <code>&#123;content.border.color&#125;</code> edge has no row in the
          compilat. The focused segment is lifted by <code>z-index: 1</code> in both library stylesheets
          (<code>.p-buttongroup .p-button:focus</code>, <code>.p-splitbutton-button.p-button:focus-visible</code>).
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>.p-toolbar</code> is <code>display: flex; flex-wrap: wrap; justify-content: space-between</code> and
          <code>.p-toolbar-start/-center/-end</code> are <code>display: flex</code> without wrap
          (<code>&#64;openng/optimus-ui-styles/dist/toolbar/index.mjs</code>); <code>.p-buttongroup</code> and
          <code>.p-splitbutton</code> are <code>inline-flex</code>. None of the three stylesheets contains a media query.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Component</th><th>Input</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-toolbar</code></td><td><code>ariaLabelledBy</code></td><td>{{ m.apiToolbarLabelledBy }}</td></tr>
              <tr><td><code>p-toolbar</code></td><td>templates <code>#start</code>, <code>#center</code>, <code>#end</code></td><td>{{ m.apiToolbarSlots }}</td></tr>
              <tr><td><code>p-buttonGroup</code></td><td>—</td><td>{{ m.apiGroup }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>label</code>, <code>icon</code>, <code>iconPos</code>, <code>severity</code>, <code>outlined</code>, <code>text</code>, <code>size</code>, <code>raised</code>, <code>rounded</code></td><td>{{ m.apiSplitLook }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>model</code></td><td>{{ m.apiSplitModel }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>expandAriaLabel</code>, <code>buttonProps</code>, <code>menuButtonProps</code></td><td>{{ m.apiSplitAria }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>disabled</code>, <code>buttonDisabled</code>, <code>menuButtonDisabled</code></td><td>{{ m.apiSplitDisabled }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>appendTo</code>, <code>menuStyle</code>, <code>menuStyleClass</code>, <code>tooltip</code>, <code>autofocus</code>, <code>tabindex</code></td><td>{{ m.apiSplitMisc }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>dir</code>, <code>plain</code></td><td>{{ m.apiSplitDead }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td>outputs <code>onClick</code>, <code>onDropdownClick</code>, <code>onMenuShow</code>, <code>onMenuHide</code></td><td>{{ m.apiSplitOutputs }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-toolbar.mjs:122</code>, <code>openng-optimus-ui-buttongroup.mjs:69</code>,
          <code>openng-optimus-ui-splitbutton.mjs:86-271</code> and its compiled input list at <code>:335</code>.
        </p>

        <h3>Keyboard: what the pattern asks and what ships</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Key</th><th>APG expects</th><th>Optimus 2.0.2 does</th></tr>
            </thead>
            <tbody>
              <tr><td>Tab into a toolbar</td><td>{{ m.kbTabApg }}</td><td>{{ m.kbTabShip }}</td></tr>
              <tr><td><kbd>←</kbd> <kbd>→</kbd> in a toolbar</td><td>{{ m.kbArrowApg }}</td><td>{{ m.kbArrowShip }}</td></tr>
              <tr><td><kbd>↓</kbd> on the chevron</td><td>{{ m.kbDownApg }}</td><td>{{ m.kbDownShip }}</td></tr>
              <tr><td><kbd>↑</kbd> on the chevron</td><td>{{ m.kbUpApg }}</td><td>{{ m.kbUpShip }}</td></tr>
              <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd> on the chevron</td><td>{{ m.kbEnterApg }}</td><td>{{ m.kbEnterShip }}</td></tr>
              <tr><td><kbd>Esc</kbd> in the menu</td><td>{{ m.kbEscApg }}</td><td>{{ m.kbEscShip }}</td></tr>
              <tr><td>Activating an item</td><td>{{ m.kbItemApg }}</td><td>{{ m.kbItemShip }}</td></tr>
              <tr><td><kbd>Tab</kbd> in the menu</td><td>{{ m.kbMenuTabApg }}</td><td>{{ m.kbMenuTabShip }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Split-button keys: <code>openng-optimus-ui-splitbutton.mjs:316-325</code>. Menu side:
          <code>openng-optimus-ui-tieredmenu.mjs</code> — <code>show()</code> resets the focused index (<code>:1312</code>),
          the list takes focus after the enter animation (<code>:1236</code>), <code>hide(event, true)</code> focuses
          <code>relatedTarget || target</code> (<code>:1288</code>), Escape (<code>:1164-1168</code>), Tab
          (<code>:1169-1176</code>), leaf activation (<code>:1037-1041</code>). The split button passes its host
          element as <code>currentTarget</code> (<code>openng-optimus-ui-splitbutton.mjs:318</code>), and a
          <code>p-splitbutton</code> element has no <code>tabindex</code>.
        </p>

        <h3>Recipe: roving focus on p-toolbar</h3>
        <pre class="code-block"><code>{{ rovingSnippet }}</code></pre>
        <p class="src-note">
          The pattern is the APG Toolbar's roving <code>tabindex</code>. Write it on native <code>pButton</code>
          buttons: a <code>p-button</code> component renders its own inner <code>&lt;button&gt;</code>, which a
          <code>tabindex</code> on the host does not reach.
        </p>

        <h3>Recipe: give focus back after the split-button menu</h3>
        <pre class="code-block"><code>{{ restoreSnippet }}</code></pre>
        <p class="src-note">
          <code>onMenuHide</code> fires from the menu's <code>hide()</code> for every close — Escape, Tab, item, outside
          click (<code>openng-optimus-ui-splitbutton.mjs:326-329</code>). Checking that focus is still inside the
          overlay (<code>.p-tieredmenu-overlay</code>, <code>openng-optimus-ui-tieredmenu.mjs:32</code>) restores it
          for the keyboard closes and leaves an outside click alone. On Tab the restore runs inside the keydown, so the
          browser's own Tab then moves on from the chevron.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkToolbarName }}</li>
          <li>{{ m.checkToolbarKeys }}</li>
          <li>{{ m.checkGroupName }}</li>
          <li>{{ m.checkSplitName }}</li>
          <li>{{ m.checkSplitFocus }}</li>
          <li>{{ m.checkSplitEscape }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Strings</h3>
        <p>{{ m.i18nStrings }}</p>
        <p class="src-note">
          None of the three templates contains a text node (<code>openng-optimus-ui-toolbar.mjs:123-138</code>,
          <code>openng-optimus-ui-buttongroup.mjs:70-72</code>, <code>openng-optimus-ui-splitbutton.mjs:336-429</code>)
          and none reads the Optimus translation configuration.
        </p>

        <h3>Right to left</h3>
        <p>{{ m.i18nRtl }}</p>
        <p class="src-note">
          Logical radii and <code>border-inline-end</code> in <code>&#64;openng/optimus-ui-styles/dist/splitbutton/index.mjs</code>
          and <code>…/buttongroup/index.mjs</code>; the physical <code>border-right</code> for <code>p-button</code>
          children in <code>openng-optimus-ui-buttongroup.mjs:16-19</code>. The split button's <code>dir</code> input
          is declared (<code>openng-optimus-ui-splitbutton.mjs:179</code>) and read nowhere.
        </p>

        <h3>A translated model</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the doubled joint is fixed by the kit's one-joint rule (Design table and RTL note rewritten), segments ring in the kit focus ring.</li>
          <li><strong>1.0</strong> — 2026-09-23 — First version: toolbar, button group and split button, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-toolbar-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }
      app-toolbar-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
      }
      app-toolbar-article .stage > p-toolbar {
        align-self: stretch;
      }
      app-toolbar-article .bar-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      app-toolbar-article .stage__label {
        margin: 0;
        font-weight: 600;
        font-size: 0.9rem;
      }
      app-toolbar-article .stage__status {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      app-toolbar-article kbd {
        font-family: var(--font-mono);
        font-size: 0.8em;
        border: 1px solid var(--surface-border);
        border-bottom-width: 2px;
        border-radius: var(--radius-sm);
        padding: 0.05em 0.4em;
      }
      app-toolbar-article code {
        font-family: var(--font-mono);
        font-size: 0.85em;
      }
      app-toolbar-article .src-note {
        max-width: 46rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 1.2rem;
      }
      app-toolbar-article .code-block {
        margin: 0 0 1rem;
        padding: 1rem;
        overflow-x: auto;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        font-size: 0.82rem;
        line-height: 1.55;
      }
      app-toolbar-article .table-wrap {
        overflow-x: auto;
        margin: 0 0 1rem;
      }
      app-toolbar-article table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      app-toolbar-article th,
      app-toolbar-article td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      app-toolbar-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }
      app-toolbar-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }
      app-toolbar-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }
      app-toolbar-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }
      app-toolbar-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      app-toolbar-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      app-toolbar-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }
      app-toolbar-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }
      app-toolbar-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }
      app-toolbar-article .sources a,
      app-toolbar-article .history strong {
        color: var(--primary-color-fg);
      }
      app-toolbar-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }
      @media (max-width: 640px) {
        app-toolbar-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ToolbarArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly lastAction = signal('none');
  readonly activeTool = signal(0);
  private readonly saveSplit = viewChild('saveSplit', { read: ElementRef });

  readonly tools = [
    { id: 'run', label: 'Run', icon: 'pi pi-play' },
    { id: 'step', label: 'Step', icon: 'pi pi-step-forward' },
    { id: 'reset', label: 'Reset', icon: 'pi pi-refresh' },
  ];

  readonly saveItems: MenuItem[] = [
    { label: 'Save as draft', escape: true, command: () => this.log('Save as draft') },
    { label: 'Save a copy', escape: true, command: () => this.log('Save a copy') },
  ];

  readonly exportItems: MenuItem[] = [
    { label: 'Export as CSV', escape: true, command: () => this.log('Export as CSV') },
    { label: 'Export as JSON', escape: true, command: () => this.log('Export as JSON') },
  ];

  log(action: string): void {
    this.lastAction.set(action);
  }

  /** Roving tabindex across every [data-roving] button inside the toolbar host. */
  onToolbarKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const bar = event.currentTarget as HTMLElement;
    const items = Array.from(bar.querySelectorAll<HTMLElement>('[data-roving]')).filter(
      (el) => !el.hasAttribute('disabled'),
    );
    const current = items.indexOf(event.target as HTMLElement);
    if (current === -1) return;
    const rtl = bar.ownerDocument.defaultView?.getComputedStyle(bar).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === forward) next = (current + 1) % items.length;
    else next = (current - 1 + items.length) % items.length;
    event.preventDefault();
    items[next].focus();
  }

  /** Hand focus back to the chevron when the menu closes by keyboard (focus still inside the overlay). */
  onSaveMenuHide(): void {
    const host = this.saveSplit()?.nativeElement as HTMLElement | undefined;
    const active = host?.ownerDocument.activeElement;
    if (active?.closest('.p-tieredmenu-overlay')) {
      // After the menu's own synchronous focus() calls, before a Tab's default action.
      queueMicrotask(() => host?.querySelector<HTMLElement>('.p-splitbutton-dropdown')?.focus());
    }
  }

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage — which one
    whenToolbar:
      'role="toolbar" tells a screen reader to expect one Tab stop and arrow keys between the controls. That pays off from three controls up, and only once you add the keys the component leaves out.',
    whenGroup:
      'The group joins borders and radii; the semantics you need — a name for the set — come from a wrapper you write, because the component takes no input.',
    whenSplit:
      'The left half runs the action most people want; the chevron holds its variants ("Save" beside "Save as draft"). If no action is the obvious default, the left half becomes a guess.',
    whenMenuButton:
      'One named button with aria-haspopup opens the list, and every action is one keystroke away from the same starting point. See the Menu guide for the popup contract.',
    whenSelect:
      'A button group has no selected state; joined buttons that look like a segmented control but forget the choice mislead both eyes and screen readers.',
    whenPlainRow:
      'role="toolbar" on a row that holds a heading, a text and one button announces a widget that is not there. Layout alone needs no role.',

    // usage — do/don't
    ddUnnamedWhy:
      'The chevron is an icon-only button with no default name, so a screen reader announces "button, collapsed, has popup" beside "Export" — a control with no purpose. Axe reports it as button-name.',
    ddNamedWhy:
      'expandAriaLabel names the chevron by what it opens. aria-expanded and aria-haspopup still carry the state; the name only has to say which options wait behind it.',
    ddGroupBadWhy:
      'The component renders span role="group" with no name and no way to pass one, and the visible "Text size" is just a paragraph. Unnamed groups are usually not announced, so the two buttons arrive as "Smaller" and "Larger" with no shared context.',
    ddGroupGoodWhy:
      'A div role="group" with aria-labelledby pointing at the visible heading gives the pair a name that screen readers announce on entry. The inner unnamed group stays, harmless.',

    // design
    tokToolbarBg: 'The bar background: the Aura content surface, the same as a card.',
    tokToolbarBorder: 'A one-pixel decorative frame; it identifies no control, so it owes no contrast ratio.',
    tokToolbarSpace: 'Padding around the bar and the gap between its start, center and end groups — not between your buttons, which sit in your own container.',
    tokSplitRadius: 'The outer corners of the pair; the inner corners are zeroed by the stylesheet.',
    tokSplitRounded: 'The outer corners under rounded="true".',
    tokGroup: 'No preset: the group only removes inner borders and radii of the buttons it holds.',
    seamIntro:
      'Both the group and the split button join their buttons by taking away the border on the inner edge. The kit paints every non-text button border with !important, which alone would outrank that removal and draw the joint twice; a kit rule in styles.scss re-applies the removal, so every visual style and mode shows one joint, as thick as the outer edge. The inner corners go square.',
    seamWerkbund: 'Square outer corners, no shadow: the segments read as two blocks pressed together.',
    seamLern: 'Pill-shaped outer corners (999px); each segment casts its own 2px offset shadow, onto its neighbor too.',
    seamSkizze: 'The hand-drawn outer radius; a soft shadow per segment.',
    seamBlau: '2px outer radius, no shadow — the flattest joint.',
    focusContrast:
      'Neither the toolbar nor the group draws a focus indicator of its own — each button keeps the kit focus ring (2px, the accent foreground, 2px offset), and the focused segment of a group or split button is lifted above its neighbor so the ring is not covered. Segment edges are button borders, so the button guide’s contrast applies unchanged; the toolbar frame is decoration.',
    narrow:
      'The toolbar wraps, its groups do not. .p-toolbar is a wrapping flex row, so below the width of its contents the end group drops under the start group; each group is a non-wrapping flex row and overflows its container when it alone is too wide. A button group and a split button are inline-flex and never wrap. Put your buttons in a wrapping flex container inside #start (as the examples do), keep a group to two or three segments, and under about 30rem move secondary actions into a menu button rather than letting the bar scroll sideways.',

    // development — inputs
    apiToolbarLabelledBy:
      'The only naming input. A plain aria-label attribute on the host works as well, because the host element is the one with the role.',
    apiToolbarSlots:
      'Template refs, or pTemplate "start"/"left", "end"/"right", "center". Plain projected content renders first, before the three slots.',
    apiGroup: 'No input and no output. Selectors p-buttonGroup, p-buttongroup, p-button-group.',
    apiSplitLook: 'Passed to both buttons (label and icon to the main one only). raised and rounded only add root classes.',
    apiSplitModel: 'MenuItem[] for the popup TieredMenu. Set escape: true on every entry — the tiered menu renders an unset escape as HTML.',
    apiSplitAria:
      'expandAriaLabel names the chevron; menuButtonProps can override its aria-label, aria-haspopup, aria-expanded and aria-controls. buttonProps.ariaLabel names the main button.',
    apiSplitDisabled:
      'disabled sets both halves. buttonDisabled alone is ignored once a content template is used, because that branch binds disabled instead.',
    apiSplitMisc: 'appendTo defaults to "body"; the rest pass straight through to the main button or the menu.',
    apiSplitDead: 'Declared and read nowhere — dir does not mirror anything, plain styles nothing.',
    apiSplitOutputs:
      'onClick only for the main button; onDropdownClick receives no event when the menu was opened by an arrow key.',

    // development — keyboard
    kbTabApg: 'One Tab stop for the whole toolbar, landing on the last-focused control.',
    kbTabShip: 'Every control is its own Tab stop.',
    kbArrowApg: 'Move focus to the previous or next control, optionally wrapping; Home and End jump to the ends.',
    kbArrowShip: 'Nothing. Add them yourself (recipe below).',
    kbDownApg: 'Open the menu and focus the first item.',
    kbDownShip: 'Toggles the menu; focus lands on the list with no item active, a second ArrowDown reaches item one.',
    kbUpApg: 'Open the menu and focus the last item (optional in the pattern).',
    kbUpShip: 'Same as ArrowDown: opens, no item active.',
    kbEnterApg: 'Open the menu and focus the first item.',
    kbEnterShip: 'Native button click: opens, list focused, no item active.',
    kbEscApg: 'Close the menu and return focus to the button.',
    kbEscShip: 'Closes, then focuses the p-splitbutton host, which is not focusable — focus is lost once the list is removed.',
    kbItemApg: 'Run the command, close the menu, focus the button (unless the command moves focus).',
    kbItemShip: 'Runs, closes, re-focuses the closing list — focus is lost.',
    kbMenuTabApg: 'Close the menu; focus moves on.',
    kbMenuTabShip: 'Closes; the list lives at the end of body, so Tab continues from there, not from the split button.',

    checkToolbarName: 'Name every p-toolbar (aria-label or ariaLabelledBy); a page with two unnamed toolbars offers two identical landmarks-in-spirit.',
    checkToolbarKeys: 'Either add roving focus with the arrow keys, or do not use p-toolbar — a row of two buttons needs no toolbar role.',
    checkGroupName: 'Wrap a button group whose buttons only make sense together in div role="group" with aria-labelledby.',
    checkSplitName: 'Set expandAriaLabel on every split button, bound to an i18n key.',
    checkSplitFocus: 'Handle onMenuHide and return focus to the chevron when it is still inside the overlay.',
    checkSplitEscape: 'Set escape: true on every model entry whose label you did not write yourself.',

    // i18n
    i18nStrings:
      'The library contributes no text. Everything readable is yours: the toolbar name, the split button label, expandAriaLabel (which has no default at all) and every MenuItem label. Translate them like any other template string, and let the labels grow — German runs longer, and a split button sizes to its label.',
    i18nRtl:
      'The split button mirrors correctly: its radii and the removed inner border are logical properties. The button group mirrors for native pButton children (logical rules), but not for p-button components: the extra rule that joins p-button children removes border-right, a physical side, so under dir="rtl" it would strip the outer edge instead of the joint. In this kit the forced button borders (Design tab) override both library rules, and the kit’s own joint rule that replaces them is written with logical properties, so the single joint lands on the inner edge in either direction. The roving recipe above reads the computed direction and swaps ArrowLeft and ArrowRight, which the APG pattern expects in a right-to-left toolbar.',
  };

  readonly groupAnatomySnippet =
    '<!-- What <p-buttonGroup> renders around three p-button children -->\n' +
    '<p-buttongroup>\n' +
    '  <span class="p-buttongroup p-component" role="group">  <!-- no name, no input to give one -->\n' +
    '    <p-button>…</p-button>\n' +
    '    <p-button>…</p-button>\n' +
    '    <p-button>…</p-button>\n' +
    '  </span>\n' +
    '</p-buttongroup>';

  readonly rovingSnippet =
    '<p-toolbar [attr.aria-label]="labels().controls" (keydown)="onToolbarKeydown($event)">\n' +
    '  <ng-template #start>\n' +
    '    @for (tool of tools; track tool.id; let i = $index) {\n' +
    '      <button pButton type="button" data-roving\n' +
    '              [attr.tabindex]="activeTool() === i ? 0 : -1"\n' +
    '              (focus)="activeTool.set(i)" (click)="run(tool)">\n' +
    '        <span pButtonLabel>{{ tool.label }}</span>\n' +
    '      </button>\n' +
    '    }\n' +
    '  </ng-template>\n' +
    '</p-toolbar>\n' +
    '\n' +
    'onToolbarKeydown(event: KeyboardEvent): void {\n' +
    '  if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;\n' +
    '  const bar = event.currentTarget as HTMLElement;\n' +
    '  const items = [...bar.querySelectorAll<HTMLElement>("[data-roving]:not([disabled])")];\n' +
    '  const i = items.indexOf(event.target as HTMLElement);\n' +
    '  if (i === -1) return;\n' +
    '  const fwd = getComputedStyle(bar).direction === "rtl" ? "ArrowLeft" : "ArrowRight";\n' +
    '  const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1\n' +
    '    : event.key === fwd ? (i + 1) % items.length : (i - 1 + items.length) % items.length;\n' +
    '  event.preventDefault();\n' +
    '  items[next].focus(); // (focus) moves the tabindex="0"\n' +
    '}';

  readonly restoreSnippet =
    '<p-splitbutton #save [label]="labels().save" [expandAriaLabel]="labels().moreSave"\n' +
    '               [model]="saveItems()" (onClick)="save()" (onMenuHide)="onSaveMenuHide()" />\n' +
    '\n' +
    'private readonly save = viewChild("save", { read: ElementRef });\n' +
    '\n' +
    'onSaveMenuHide(): void {\n' +
    '  const host = this.save()?.nativeElement as HTMLElement | undefined;\n' +
    '  const active = host?.ownerDocument.activeElement;\n' +
    '  // Keyboard closes and item clicks leave focus inside the overlay; an outside click does not.\n' +
    '  if (active?.closest(".p-tieredmenu-overlay")) {\n' +
    '    // A microtask: after the menu re-focuses its own list, before a Tab moves on.\n' +
    '    queueMicrotask(() => host?.querySelector<HTMLElement>(".p-splitbutton-dropdown")?.focus());\n' +
    '  }\n' +
    '}';

  readonly i18nSnippet =
    '// One computed, so a language switch rebuilds the whole model.\n' +
    'private readonly i18n = inject(TranslationService);\n' +
    'readonly saveItems = computed<MenuItem[]>(() => [\n' +
    '  { label: this.i18n.translate("editor.saveDraft"), escape: true, command: () => this.saveDraft() },\n' +
    '  { label: this.i18n.translate("editor.saveCopy"), escape: true, command: () => this.saveCopy() },\n' +
    ']);';
}
