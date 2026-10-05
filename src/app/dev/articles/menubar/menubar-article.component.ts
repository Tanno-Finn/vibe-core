import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MenubarModule } from '@openng/optimus-ui/menubar';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    MenubarModule,
    ButtonModule,
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
        grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
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
        padding: var(--space-5);
        padding-bottom: 9rem;
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
      }
      .pg__code {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      @media (max-width: 720px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      .journal {
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        padding: var(--space-3);
        background: var(--surface-section);
      }
      .journal__label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .journal__empty {
        margin: var(--space-1) 0 0;
        font-size: 0.82rem;
        color: var(--text-color-secondary);
      }
      .journal__list {
        margin: var(--space-1) 0 0;
        padding-left: 1.2rem;
        font-family: var(--font-mono);
        font-size: 0.76rem;
      }
      .journal__list li {
        margin: 0.1rem 0;
      }

      /* --- Examples --- */
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        max-width: 46rem;
      }
      .ex__stage {
        display: block;
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-ground);
      }
      .ex__stage--tall {
        padding-bottom: 12rem;
      }
      .ex__stage--dir {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        padding-bottom: 12rem;
      }
      @media (max-width: 800px) {
        .ex__stage--dir {
          grid-template-columns: 1fr;
        }
      }
      .dir-cell {
        min-width: 0;
      }
      .dir-cell__label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-2);
        font-family: var(--font-mono);
      }
      .dir-end {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }
      .chrome-brand {
        font-size: 0.95rem;
        color: var(--text-color);
      }

      /* --- The plain-nav comparison --- */
      .plain-nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .plain-nav a {
        display: inline-block;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-sm);
        color: var(--text-color);
        text-decoration: none;
      }
      .plain-nav a:hover {
        background: var(--surface-section);
        text-decoration: underline;
      }
      .plain-nav a[aria-current='page'] {
        font-weight: var(--font-weight-medium);
        box-shadow: inset 0 -2px 0 var(--primary-color-fg);
      }
      .plain-nav a:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
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
        background: var(--surface-ground);
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
      @media (max-width: 720px) {
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
      .code-block--inline {
        margin: 0;
        font-size: 0.75rem;
        background: var(--surface-card);
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
 * Guide article: Menubar (`p-menubar`) — SPEC N5, Guides.
 *
 * Menubar is the most machinery-heavy navigation component in the library: two
 * components (Menubar + the recursive MenubarSub), a service, a matchMedia
 * listener, a keyboard state machine over `aria-activedescendant`, and a second
 * rendering branch below a breakpoint. The guide is therefore about the two
 * things that decide whether it is the right component at all — the ROLES it
 * emits, and what its keyboard model actually does. Line refs are the shipped
 * Optimus UI 2.0.2 bundles.
 *
 * VERIFIED CLAIMS (source read at Optimus UI 2.0.2, or measured in the browser;
 * provenance is carried in the tabs):
 *   - Every list the component renders is `role="menubar"`: the host binding is
 *     the static string `'[attr.role]': "'menubar'"` (openng-optimus-ui-menubar.mjs:587)
 *     on MenubarSub, which is both the root list and every submenu. Measured in
 *     the accessibility tree (21): root and submenu both come back as "menubar".
 *   - Items are `role="menuitem"` on the `<li>` (openng-optimus-ui-menubar.mjs:244) and
 *     carry `aria-label` = the raw item label (:249) — measured (21), that raw
 *     string is the accessible name even when the label contains markup. The
 *     anchor sits inside at `[attr.tabindex]="-1"` (:272) and, measured in
 *     Chrome's accessibility tree, still surfaces as a nested `link` node with
 *     the same name, although it has no `href` at all unless `item.url`/
 *     `routerLink` is set. So each destination is a menuitem containing a link
 *     nobody can Tab to.
 *   - One tab stop: the root `<ul>` is `tabindex="0"` (openng-optimus-ui-menubar.mjs:1357)
 *     and `aria-activedescendant` is a MenubarSub host binding fed from the
 *     root (:1366). No roving tabindex.
 *   - `model` is a plain setter again (PrimeNG 22 had a signal input); it
 *     rebuilds `_processedItems` on assignment (:660-663). Mutating the array
 *     in place still does nothing.
 *   - `autoDisplay` defaults to TRUE (openng-optimus-ui-menubar.mjs:687) — root
 *     submenus open on hover (gate :215) — but only after a first mousedown or
 *     click sets `dirty` (:929, :1010).
 *   - The keyboard matrix was measured key by key on 21; the deviations are
 *     also source-confirmed in Optimus: ArrowDown on a root item WITHOUT a submenu
 *     does nothing and does not preventDefault (:1161-1168), so the page
 *     scrolls; arrows never wrap (findNextItemIndex falls back to the same
 *     index, :1278-1281).
 *   - Escape does not walk the chain: `onEscapeKey` calls `hide(event, true)`
 *     (:1246-1249), which empties the whole `activeItemPath` (:999) — from a
 *     level-3 submenu, one Escape closes everything.
 *   - The mobile branch is a media query, not a resize handler:
 *     `matchMedia('(max-width: ' + breakpoint + ')')` (:874), default breakpoint
 *     `'960px'` (:697). The hamburger is an `<a role="button" tabindex="0">`
 *     (:1333-1340) named from `config.translation.aria.navigation`
 *     (openng-optimus-ui-config.mjs:187) — the only string the library supplies.
 *   - Dead paths in Optimus 2.0.2: `styleClass` is back (v21 API, @deprecated,
 *     read into the host class :1465); the `aria-haspopup` guard reads `item.to` (:251), which is not
 *     a field of MenuItem; MenubarSub declares `ariaLabel`, `ariaLabelledBy`,
 *     `autoZIndex` and `baseZIndex` inputs and `menuFocus`/`menuBlur`/
 *     `menuKeydown` outputs that its own template never reads or emits — the
 *     mobile panel's z-index comes from `config.zIndex.menu` directly (:985).
 *   - `MenuItem.escape` has no default, so the falsy branch wins and labels
 *     render through `[innerHTML]` (:285/:298) — measured (21): `<b>` in a
 *     label renders bold unless `escape: true` is set per item.
 *   - Submenu `aria-labelledby` points at the parent item's label span (:392).
 *     That span carries the id only in the non-router branch (:289, :299); the
 *     routerLink branch (:349-357) sets none, so a routerLink parent leaves a
 *     dangling reference — measured (21) on a rendered pair.
 *   - Contrast: surfaces and labels are Aura stock-palette pairs, computed
 *     from the preset hex values. Aura's focus indicator is a background
 *     change only (1.10:1 light / 1.19:1 dark) and its chevron 2.56:1 light;
 *     the kit adds the one 2px focus ring to the .p-focus item and the
 *     hamburger and re-points the chevron and the item icon, Aura
 *     2.56:1 too, to --text-color-secondary — all gated in
 *     docs/generated/CONTRAST.MD "menu focus".
 *     Geometry from the tokens (bar 8x12px, items 8x12px, 28px mobile button,
 *     16px mobile indent); radii follow the active visual style.
 *   - Measured (21) keyboard deviations from APG: Enter/Space on a root group
 *     opens the panel but leaves the cursor outside it; character search does
 *     not cancel the event. No-wrap and the ArrowDown leak are source-confirmed
 *     in Optimus (see above).
 *   - `id` is an INPUT, not a host attribute: writing it leaves the attribute on
 *     the host AND puts the same value on the root list — measured, two elements
 *     with one id.
 *   - An empty model still renders a 0x0 `ul[role=menubar][tabindex=0]` tab
 *     stop; pt.rootList { tabindex: '-1', 'aria-hidden': 'true' } silences it.
 *   - RTL was measured, not read: `dir="rtl"` against `dir="ltr"` on identical
 *     menubars, box metrics for the nested submenu, the chevron, and the end slot.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-menubar-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'menubar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A horizontal bar of menus, driven by an array of <code>MenuItem</code>s, with a second rendering branch that
          turns into a hamburger below a breakpoint. It is a real menu widget in the ARIA sense — one tab stop, arrow
          keys inside, submenus that open and close — and that is both its strength and the reason it is the wrong
          component for most website navigation. The playground is a live <code>p-menubar</code>; every control below
          changes an input.
        </p>

        <section class="pg" aria-label="Menubar playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-shape-label">Item shape</span>
                <p-select
                  [ariaLabelledBy]="'pg-shape-label'"
                  size="small"
                  [options]="shapeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgShape()"
                  (ngModelChange)="pgShape.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autodisplay">Open on hover (autoDisplay)</label>
                <p-toggleswitch
                  inputId="pg-autodisplay"
                  [ngModel]="pgAutoDisplay()"
                  (ngModelChange)="pgAutoDisplay.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autohide">Close when the mouse leaves (autoHide)</label>
                <p-toggleswitch
                  inputId="pg-autohide"
                  [ngModel]="pgAutoHide()"
                  (ngModelChange)="pgAutoHide.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-mobile">Force the mobile branch</label>
                <p-toggleswitch inputId="pg-mobile" [ngModel]="pgMobile()" (ngModelChange)="pgMobile.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <p-menubar
                  [model]="pgModel()"
                  [autoDisplay]="pgAutoDisplay()"
                  [autoHide]="pgAutoHide()"
                  [breakpoint]="pgBreakpoint()"
                  ariaLabel="Playground menu"
                  (onFocus)="log('menu focused')"
                  (onBlur)="log('menu blurred')"
                />
              </div>
              <p class="ex__note">
                Tab reaches the bar once; from there the arrow keys move a virtual cursor. The breakpoint is pinned to a
                value that either always or never matches, so the branch is the switch above rather than your window
                width.
              </p>
              <div class="journal" role="status" aria-live="polite" aria-atomic="false">
                <span class="journal__label">Journal</span>
                @if (journal().length === 0) {
                  <p class="journal__empty">Nothing yet — focus the bar and press a key.</p>
                } @else {
                  <ol class="journal__list">
                    @for (line of journal(); track line.id) {
                      <li>{{ line.text }}</li>
                    }
                  </ol>
                }
              </div>
            </div>
          </div>

          <div class="pg__code">
            <div class="ex__head">
              <span class="pg__code-label">Markup</span>
              <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
                {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block code-block--inline"><code>{{ pgCode() }}</code></pre>
          </div>
        </section>

        <h3>The anatomy, rendered</h3>
        <p class="ex__note">
          Three levels, opened by keyboard or mouse. Every list you can see below — the bar itself and both panels — is
          the same component instance recursing, which is why they all carry the same role.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-nested">
          <p-menubar [model]="nestedModel" breakpoint="1px" ariaLabel="Anatomy menu" />
        </div>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Menubar parts, their element, and their shipped styling
            </caption>
            <thead>
              <tr>
                <th>Class</th>
                <th>Element</th>
                <th>What it is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menubar</code></td>
                <td>the <code>&lt;p-menubar&gt;</code> host</td>
                <td>The bar: flex row, background, border, radius, padding.</td>
              </tr>
              <tr>
                <td><code>p-menubar-start</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>Only rendered when a <code>#start</code> template exists.</td>
              </tr>
              <tr>
                <td><code>p-menubar-button</code></td>
                <td><code>&lt;a role="button"&gt;</code></td>
                <td>The hamburger. <code>display: none</code> until the bar is in its mobile branch.</td>
              </tr>
              <tr>
                <td><code>p-menubar-root-list</code></td>
                <td><code>&lt;ul tabindex="0"&gt;</code></td>
                <td>The single tab stop, and the element that owns <code>aria-activedescendant</code>.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item</code></td>
                <td><code>&lt;li role="menuitem"&gt;</code></td>
                <td>Carries the state classes and every <code>aria-*</code> the item has.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-content</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>The hit area and the box the focus/hover/active background paints.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-link</code></td>
                <td><code>&lt;a tabindex="-1"&gt;</code></td>
                <td>The anchor. Unfocusable by design; the padding lives here.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-icon</code> / <code>-label</code></td>
                <td><code>&lt;span&gt;</code></td>
                <td>From <code>item.icon</code> and <code>item.label</code>.</td>
              </tr>
              <tr>
                <td><code>p-menubar-submenu-icon</code></td>
                <td><code>&lt;svg&gt;</code></td>
                <td>Chevron: down at root level, right below it.</td>
              </tr>
              <tr>
                <td><code>p-menubar-submenu</code></td>
                <td><code>&lt;ul role="menubar"&gt;</code></td>
                <td>The panel. Absolutely positioned, <code>z-index: 1</code>, no collision handling.</td>
              </tr>
              <tr>
                <td><code>p-menubar-separator</code></td>
                <td><code>&lt;li role="separator"&gt;</code></td>
                <td>From <code>item.separator</code>. Styled only inside a submenu.</td>
              </tr>
              <tr>
                <td><code>p-menubar-end</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>Always rendered — with the <code>#end</code> template, or with projected content.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The mobile branch, on a desktop screen</h3>
        <p class="ex__note">
          Below the breakpoint the same markup renders differently: the bar collapses to a hamburger, the root list
          becomes an absolutely positioned panel under the bar, and submenus stop flying out — they indent in place,
          accordion-style. This instance is pinned into that branch so it is visible whatever your window does.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-mobile">
          <p-menubar [model]="nestedModel" breakpoint="99999px" ariaLabel="Mobile branch menu" />
        </div>
        <p class="src-note">
          The hamburger is the tab stop while the panel is shut; opening it with Enter moves focus onto the root list,
          which is where the item keyboard model lives in either branch. Measured here: <kbd>ArrowRight</kbd> still
          steps between top-level entries although they are now stacked vertically, and <kbd>Escape</kbd> returns focus
          to the hamburger <strong>without closing the panel</strong> — it stays open, and
          <code>aria-expanded</code> stays <code>true</code>.
        </p>

        <h3>Direction</h3>
        <p class="ex__note">
          The same model, twice, differing only in the <code>dir</code> attribute on the wrapper. Open a submenu in
          each: the flow, the end slot, and the mobile panel mirror; the flyout offset of a second-level panel and the
          chevron glyph do not.
        </p>
        <div class="ex__stage ex__stage--dir">
          <div class="dir-cell" id="fx-ltr" dir="ltr">
            <span class="dir-cell__label">dir="ltr"</span>
            <p-menubar [model]="dirModel" breakpoint="1px" ariaLabel="LTR menu">
              <ng-template #end><span class="dir-end">end slot</span></ng-template>
            </p-menubar>
          </div>
          <div class="dir-cell" id="fx-rtl" dir="rtl">
            <span class="dir-cell__label">dir="rtl"</span>
            <p-menubar [model]="dirModel" breakpoint="1px" ariaLabel="RTL menu">
              <ng-template #end><span class="dir-end">end slot</span></ng-template>
            </p-menubar>
          </div>
        </div>
        <p class="src-note">Numbers for both runs are in the i18n tab.</p>

        <h3>The same navigation without a menubar</h3>
        <p class="ex__note">
          For comparison: a landmark and a list of links. Every entry is a tab stop, every entry is a link to a screen
          reader, the browser's own find-in-page reaches it, and middle-click opens it in a tab. Nothing below is a
          component.
        </p>
        <div class="ex__stage">
          <nav class="plain-nav" aria-label="Plain navigation example">
            <ul>
              <li><a href="#fx-nested" aria-current="page">Overview</a></li>
              <li><a href="#fx-nested">Methods</a></li>
              <li><a href="#fx-nested">Glossary</a></li>
              <li><a href="#fx-nested">Timeline</a></li>
            </ul>
          </nav>
        </div>
        <pre class="code-block"><code>{{ plainNavSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which navigation</h3>
        <p>
          The question that decides this is not "horizontal or vertical" but <em>what the entries are</em>. A menubar is
          a menu of <strong>commands</strong> — the File/Edit bar of an application. Site sections are not commands;
          they are places, and places are links.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>You want</th>
                <th>Reach for</th>
                <th>Because</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The primary navigation of a website or content app</td>
                <td><code>&lt;nav&gt;</code> + a list of <code>&lt;a&gt;</code></td>
                <td>
                  Each destination stays a link: focusable, findable, openable in a new tab, announced as "link". A
                  menubar makes each one a <code>menuitem</code> whose anchor is <code>tabindex="-1"</code>.
                </td>
              </tr>
              <tr>
                <td>An application menu of commands, grouped, with submenus</td>
                <td><code>p-menubar</code></td>
                <td>
                  That is exactly the ARIA menubar pattern: one tab stop, arrow-key traversal, commands behind
                  <code>item.command</code>.
                </td>
              </tr>
              <tr>
                <td>Parallel views of one subject, all in the same page</td>
                <td><code>p-tabs</code></td>
                <td>Tabs own a panel each and announce the relationship. A menubar owns nothing; it just fires.</td>
              </tr>
              <tr>
                <td>The same primary navigation on a phone</td>
                <td><code>p-drawer</code> holding the <code>&lt;nav&gt;</code></td>
                <td>
                  An off-canvas panel you control, with your own trigger and your own focus handling — rather than a
                  second, differently-behaving branch of a menu widget.
                </td>
              </tr>
              <tr>
                <td>A menu that hangs off one button</td>
                <td><code>p-menu</code> (flat) or <code>p-tieredmenu</code> (nested)</td>
                <td>
                  Same item model, same keyboard machinery, no bar. A menubar with one root item is a tieredmenu with
                  extra chrome.
                </td>
              </tr>
              <tr>
                <td>A wide panel with columns of links under each entry</td>
                <td><code>p-megamenu</code></td>
                <td>
                  Its model is a grid of columns; a menubar submenu is a single narrow column with a
                  <code>12.5rem</code> minimum.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The role question, answered honestly</h3>
        <p>
          The APG menubar pattern is defined for application menus, and it buys its single tab stop by taking the
          entries out of the tab order. That trade is right for File/Edit/View and wrong for a site header, and the ARIA
          specification says so in its own terms: <code>menuitem</code> is "an option in a set of choices contained by a
          menu", not a destination. Sites that use it anyway hand every keyboard and screen-reader user a navigation
          that behaves like a menu.
        </p>
        <p>
          What the component actually renders, read out of the accessibility tree: the bar is a <code>menubar</code>;
          each entry is a <code>menuitem</code> named from <code>item.label</code>; and inside each one sits a nested
          <code>link</code> node carrying the same name — an anchor with no <code>href</code> at all unless you gave the
          item a <code>url</code> or a <code>routerLink</code>, and at <code>tabindex="-1"</code> either way. Every
          submenu is a <code>menubar</code> too, because the role is a static host binding on the recursive component
          (<code>openng-optimus-ui-menubar.mjs:587</code>), so a panel is announced as a second menu bar rather than as the menu
          it is.
        </p>
        <p>
          Two consequences. A destination in this bar is announced twice — once as a menu item, once as the link inside
          it — and is reachable only through the menu's own arrow keys: no Tab, no find-in-page, no middle-click. And
          the nested link is a link in name only, because without a <code>url</code> or a <code>routerLink</code> it has
          no address to go to. Verify it in your own build: open a submenu and read the accessibility tree; the panel
          should say "menu", and here it says "menu bar".
        </p>
        <p class="src-note">
          <strong>Kit convention.</strong> Primary navigation in this kit is a <code>&lt;nav&gt;</code> landmark with a
          translated <code>aria-label</code>, a skip link ahead of it, and a search-driven site map behind one button —
          <code>src/app/components/frame/app-header.component.ts</code> is the reference implementation (the skip link
          sits in <code>src/app/app.component.ts</code>). Where a <code>p-menubar</code> appears there,
          it is the header's flex container, not a menu: its model is empty and its content lives in
          <code>#start</code> and <code>#end</code>.
        </p>

        <h3>If you use it as chrome, silence it</h3>
        <p>
          Using the bar purely for layout — <code>#start</code> and <code>#end</code>, no model — still leaves a real
          <code>&lt;ul role="menubar" tabindex="0"&gt;</code> in the page. Measured on such a bar: a 0x0 box, no
          children, and a place in the document's sequential tab order between whatever precedes and follows the header.
          There is no input for it, and pass-through only reaches <em>part</em> of it.
        </p>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Which pass-through keys on the root list survive
            </caption>
            <thead>
              <tr>
                <th>Key</th>
                <th>Holds?</th>
                <th>Measured</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>tabindex: '-1'</code></td>
                <td><strong>Yes</strong></td>
                <td>
                  The component writes <code>tabindex</code> once, as a static attribute, so the pass-through write is
                  the last one. Present from the first paint — it is already in the server-rendered HTML — and the list
                  is out of the sequential tab order on every host.
                </td>
              </tr>
              <tr>
                <td><code>'aria-hidden': 'true'</code></td>
                <td><strong>Yes</strong></td>
                <td>
                  Nothing in the component writes it. Measured on two hosts: the empty list is
                  <em>gone from the accessibility tree</em> — no node, no name.
                </td>
              </tr>
              <tr>
                <td><code>role</code> — any value</td>
                <td><strong>No</strong></td>
                <td>
                  <code>role</code> is a host binding the component asserts itself
                  (<code>openng-optimus-ui-menubar.mjs:587</code>). On an <code>OnPush</code> host, <code>'presentation'</code>,
                  <code>'none'</code> and <code>null</code> alike lose: the list still read <code>menubar</code> at load
                  and after a tab switch, a resize, a scroll, and a click elsewhere. Only a mousedown on the bar itself
                  flipped it. On a default-change-detection host the later pass does arrive — so the outcome depends on
                  a strategy chosen elsewhere.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          So the reliable pair is <code>tabindex</code> plus <code>aria-hidden</code>, and the role is left where it is.
          That is also the better ARIA: <code>role="presentation"</code> on an element carrying
          <code>tabindex="-1"</code> is a contradiction the specification resolves by ignoring the role.
        </p>
        <p class="dd__why">
          <strong>Only for a bar with no model.</strong> Putting <code>aria-hidden</code> on something that can take
          focus is a defect; this is safe precisely because an empty menubar has no items, no hamburger, and no code path
          that focuses the list. Never put it on a menubar that actually has entries.
        </p>
        <div class="ex__stage" id="fx-chrome">
          <p-menubar [model]="emptyModel" breakpoint="1px" [pt]="chromePt">
            <ng-template #start><strong class="chrome-brand">Brand</strong></ng-template>
            <ng-template #end><span class="dir-end">controls</span></ng-template>
          </p-menubar>
        </div>
        <pre class="code-block"><code>{{ chromePtSnippet }}</code></pre>
        <p class="src-note">
          Two flex containers and a heading cost less than a component here, and they need no errata. Reach for the
          pass-through only when the bar is already in place.
        </p>

        <h3>Do / Don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage" id="fx-badnav">
              <p-menubar [model]="badNavModel" breakpoint="1px" ariaLabel="Sections" />
            </div>
            <p class="dd__why">
              Site sections as menu items. Four destinations behind one tab stop, each announced as a menu item wrapping
              a link that cannot be tabbed to, and not a submenu in sight to justify the widget. The chevron-less
              entries also break the pattern's own promise: the arrow keys move a cursor over things that are not
              choices.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <nav class="plain-nav" aria-label="Do example">
                <ul>
                  <li><a href="#fx-nested" aria-current="page">Overview</a></li>
                  <li><a href="#fx-nested">Methods</a></li>
                  <li><a href="#fx-nested">Glossary</a></li>
                  <li><a href="#fx-nested">Timeline</a></li>
                </ul>
              </nav>
            </div>
            <p class="dd__why">
              A landmark, a list, four links, <code>aria-current="page"</code> on the one you are on. It is smaller, it
              survives without JavaScript, and it is what users of every assistive technology already know.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>menuItems.push(&#123; label: 'New' &#125;)</code> — mutating the array you passed to
                <code>[model]</code>.
              </p>
            </div>
            <p class="dd__why">
              <code>model</code> is a plain setter that rebuilds the item tree from the value assigned
              (<code>openng-optimus-ui-menubar.mjs:660-663</code>). Mutating in place never re-runs the setter, so the
              new entry is invisible until something else reassigns the input.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>model = [...menuItems, &#123; label: 'New' &#125;]</code>, or a <code>computed()</code> that
                returns a fresh array.
              </p>
            </div>
            <p class="dd__why">
              A new array reference recomputes the tree and keeps the keys the keyboard model indexes by consistent with
              what is on screen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage">
              <p class="dd__why">
                Leave <code>breakpoint</code> at its default and hope: at <code>960px</code> the bar silently becomes a
                hamburger, on a tablet in portrait as much as on a phone.
              </p>
            </div>
            <p class="dd__why">
              The switch is a media query created once from the input (<code>openng-optimus-ui-menubar.mjs:874</code>), so it is
              your layout's breakpoint that has to match it, not the other way round.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                Set <code>breakpoint</code> to the same value your stylesheet switches on, and walk both branches: the
                same handler runs in each, but not with the same result — Escape does not close the mobile panel.
              </p>
            </div>
            <p class="dd__why">
              Changing the input later has no effect: the listener is built in
              <code>onInit</code> and never rebuilt.
            </p>
          </div>
        </div>

        <h3>Annotated source</h3>
        <p class="ex__note">A command menu, written the way the component wants to be used.</p>
        <pre class="code-block"><code>{{ annotatedSource }}</code></pre>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C ARIA Authoring Practices — Menubar</a
            >
            — the pattern this component claims. Its keyboard section is what the measured matrix in Development is
            checked against, wrapping and Enter/Space included.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#menuitem" target="_blank" rel="noopener noreferrer"
              >ARIA 1.2 — <code>menuitem</code></a
            >
            — "an option in a set of choices contained by a menu". The single sentence that decides the whole "is this
            navigation?" question above.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#presentation" target="_blank" rel="noopener noreferrer"
              >ARIA 1.2 — <code>presentation</code></a
            >
            — why a <code>presentation</code> role on a focusable element is ignored, which is why the chrome recipe
            does not try to set one.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 that Aura's focus background (1.10:1), chevron and item icon (2.56:1) miss, and the kit's ring,
            chevron and icon clear.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 2.4.7 Focus Visible</a
            >
            — what an indicator you cannot see fails, and the reason a background swap is not enough on its own.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24px minimum, which the Optimus hamburger (28x28 by token) clears.
          </li>
          <li>
            <a href="https://primeng.org/menubar" target="_blank" rel="noopener noreferrer">PrimeNG — Menubar</a> — the
            upstream API docs for the fork. Every default in this guide was re-read in the shipped source of Optimus UI
            2.0.2 rather than taken from here.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Two surfaces, not one</h3>
        <p>
          The bar and the submenu panel are separately themed — two token groups, both resolving to
          <code>&#123;content.background&#125;</code> — and they sit on different things: the bar on the page ground, the
          panel on the bar. Every contrast question below is therefore asked against both surfaces. The surfaces and
          labels are Aura's stock palette, the same in every style; the kit adds two rules of its own in
          <code>src/styles.scss</code> — the one 2px focus ring on the focused item and the hamburger, and the submenu
          chevron and item icon in <code>--text-color-secondary</code> — and a style changes the radius and, through the
          accent, the ring.
        </p>

        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura source</th>
                <th>Resolves to</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>menubar.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code> / <code>#18181b</code></td>
              </tr>
              <tr>
                <td><code>menubar.borderColor</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td><code>#e2e8f0</code> / <code>#3f3f46</code></td>
              </tr>
              <tr>
                <td><code>menubar.padding</code> / <code>gap</code></td>
                <td>literal</td>
                <td><code>0.5rem 0.75rem</code> / <code>0.5rem</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.color</code></td>
                <td><code>&#123;navigation.item.color&#125;</code></td>
                <td><code>#334155</code> / <code>#ffffff</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.focusBackground</code></td>
                <td><code>&#123;navigation.item.focus.background&#125;</code></td>
                <td><code>#f1f5f9</code> / <code>#27272a</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.activeBackground</code></td>
                <td><code>&#123;navigation.item.active.background&#125;</code></td>
                <td>the same two values — focus and active are one look</td>
              </tr>
              <tr>
                <td><code>menubar.baseItem.padding</code></td>
                <td><code>&#123;navigation.item.padding&#125;</code></td>
                <td><code>0.5rem 0.75rem</code> — root level</td>
              </tr>
              <tr>
                <td><code>menubar.item.padding</code></td>
                <td><code>&#123;navigation.item.padding&#125;</code></td>
                <td>same value, submenu level</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code> / <code>#18181b</code> — identical to the bar</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.shadow</code></td>
                <td><code>&#123;overlay.navigation.shadow&#125;</code></td>
                <td><code>0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)</code></td>
              </tr>
              <tr>
                <td><code>menubar.submenu.mobileIndent</code></td>
                <td>literal</td>
                <td><code>1rem</code> → 16px</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.icon.size</code></td>
                <td><code>&#123;navigation.submenu.icon.size&#125;</code></td>
                <td><code>0.875rem</code> → 14px</td>
              </tr>
              <tr>
                <td><code>menubar.separator.borderColor</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td><code>#e2e8f0</code> / <code>#3f3f46</code></td>
              </tr>
              <tr>
                <td><code>menubar.mobileButton.size</code></td>
                <td>literal</td>
                <td><code>1.75rem</code> → 28px, <code>border-radius: 50%</code></td>
              </tr>
              <tr>
                <td><code>menubar.mobileButton.focusRing.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>
                  Aura: <code>1px solid</code> at <code>2px</code> offset in <code>&#123;primary.color&#125;</code>.
                  Replaced by the kit's one ring: <code>2px solid var(--primary-color-fg)</code> at <code>2px</code>
                </td>
              </tr>
              <tr>
                <td><code>menubar.submenu.icon.color</code> (rest, focus, active)</td>
                <td><code>&#123;navigation.submenu.icon.color&#125;</code></td>
                <td>
                  Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code>. Re-pointed by the kit
                  to <code>var(--text-color-secondary)</code> in all three states
                </td>
              </tr>
              <tr>
                <td><code>menubar.item.icon.color</code> (rest, focus, active)</td>
                <td><code>&#123;navigation.item.icon.color&#125;</code></td>
                <td>
                  Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code>. Re-pointed by the kit
                  to <code>var(--text-color-secondary)</code> in all three states
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token definitions: <code>&#64;openng/optimus-ui-themes/dist/aura/menubar/index.mjs</code>; the hex values are
          Aura's stock surface palette (slate light, zinc dark) from <code>.../aura/base/index.mjs</code>, which no
          visual style's <code>presetOverrides</code> (<code>src/app/services/ui-styles.ts</code>) replaces. The two kit
          rows come from <code>src/styles.scss</code>: the <code>.p-menubar</code> chevron and icon block and the one
          focus-ring list.
        </p>

        <h3>Contrast against the surface behind</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light</th>
                <th>Dark</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>bar background vs the page behind it</td>
                <td>measure</td>
                <td>measure</td>
                <td>
                  Depends on the visual style's <code>--surface-ground</code>, which is not an Aura token: near 1:1 is
                  the expectation, so the bar's 1px border carries the boundary.
                </td>
              </tr>
              <tr>
                <td>item label on the bar</td>
                <td>10.35:1</td>
                <td>17.72:1</td>
                <td>Comfortable in both themes.</td>
              </tr>
              <tr>
                <td>item label on the submenu panel</td>
                <td>10.35:1</td>
                <td>17.72:1</td>
                <td>The same, because the panel background equals the bar background.</td>
              </tr>
              <tr>
                <td>submenu chevron, on the bar / on the focus background (gated)</td>
                <td>5.21–7.78:1 / 4.76–7.11:1</td>
                <td>6.78–8.48:1 / 5.70–7.13:1</td>
                <td>
                  The kit's <code>--text-color-secondary</code>; Aura's own <code>&#123;surface.400&#125;</code> was
                  2.56:1. The chevron is the only sign that an entry opens a menu, so it is meaningful, not decorative.
                </td>
              </tr>
              <tr>
                <td>item icon, on the bar / on the focus background (gated)</td>
                <td>5.21–7.78:1 / 4.76–7.11:1</td>
                <td>6.78–8.48:1 / 5.70–7.13:1</td>
                <td>
                  The kit's <code>--text-color-secondary</code>; Aura's own
                  <code>&#123;navigation.item.icon.color&#125;</code> was 2.56:1. Held to 3:1 so an icon-only item holds.
                </td>
              </tr>
              <tr>
                <td>focus background vs the bar, and vs the submenu panel</td>
                <td>1.10:1</td>
                <td>1.19:1</td>
                <td>Informational (gated, no minimum) — the kit ring below is the indicator, not this swap.</td>
              </tr>
              <tr>
                <td><strong>kit focus ring on the focus background / on the bar (gated)</strong></td>
                <td><strong>4.73–16.30:1 / 5.18–17.85:1</strong></td>
                <td><strong>5.38–14.24:1 / 6.40–16.93:1</strong></td>
                <td>Every accent and style; the panel equals the bar, so the same numbers hold there.</td>
              </tr>
              <tr>
                <td>label on the focus background</td>
                <td>13.35:1</td>
                <td>14.89:1</td>
                <td>The text stays legible. It is the box around it that does not read.</td>
              </tr>
              <tr>
                <td>submenu panel vs what is behind it</td>
                <td>1.00:1</td>
                <td>1.00:1</td>
                <td>Panel over bar: the shadow and the 1px border are the only separation.</td>
              </tr>
              <tr>
                <td>separator and panel border, on the panel</td>
                <td>1.23:1</td>
                <td>1.70:1</td>
                <td>A hairline. Fine as decoration, useless as structure.</td>
              </tr>
              <tr>
                <td>hamburger glyph on the bar</td>
                <td>4.76:1</td>
                <td>6.91:1</td>
                <td>Passes.</td>
              </tr>
              <tr>
                <td>hamburger focus ring on the bar (gated)</td>
                <td>5.18–17.85:1</td>
                <td>6.40–16.93:1</td>
                <td>The kit's one ring, outside the 28px button, on the bar's own background.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows marked gated are measured on every build in <code>docs/generated/CONTRAST.MD</code>, group "menu focus"
          (the chevron, the item icon, the focus background, the ring on both surfaces, across every style, mode and accent). The rest
          are computed from the Aura stock hex values the token table resolves to (light: slate on
          <code>#ffffff</code>; dark: zinc on <code>#18181b</code>) — the same in every visual style; the bar-vs-page
          row depends on the style and has no fixed number.
        </p>

        <h3>The focus indicator: Aura's swap, and the kit's ring</h3>
        <p>
          There is no <code>:focus-visible</code> rule for menu items in the shipped stylesheet. The root list keeps
          DOM focus and marks the item under the keyboard cursor with the <code>.p-focus</code> class (the
          <code>aria-activedescendant</code> model), and Aura shows that item only by swapping its background to
          <code>menubar.item.focus.background</code> — the same value hover uses, <strong>1.10:1</strong> against the
          bar in the light theme and <strong>1.19:1</strong> in the dark one, on the panel exactly as on the bar.
        </p>
        <p>
          The kit already adds the real indicator: <code>.p-menubar-item.p-focus &gt; .p-menubar-item-content</code>
          is one entry of its one focus-ring list in <code>src/styles.scss</code> — 2px
          <code>--primary-color-fg</code>, drawn inside the item (offset -2px) because the items sit 2px apart in a
          panel that clips, and keyed with <code>&gt;</code> so a focused parent does not ring its whole open submenu.
          It clears 3:1 on both surfaces (table above), and because hover shows no ring, focus and hover can now be told
          apart. Do not add a second ring rule.
        </p>

        <h3>Geometry</h3>
        <ul>
          <li>
            <strong>Bar, as the tokens define it:</strong> padding 8px&nbsp;12px, gap 8px, a 1px border, and the radius
            <code>&#123;content.border.radius&#125;</code> → <code>&#123;border.radius.md&#125;</code>, which the active
            visual style sets: 0 in werkbund, 12px in the default lernwerkstatt, 10px skizzenbuch, 2px blaupause (Aura
            stock: 6px).
          </li>
          <li>
            <strong>Bar, as this kit renders it:</strong> a rule in
            <code>src/app/components/frame/app-header.component.ts</code> — unscoped, because that component uses
            <code>ViewEncapsulation.None</code> — sets every <code>p-menubar</code> in the app to
            <code>border-radius: 0</code>, <code>padding: 0.4rem 1rem</code> (6.4px&nbsp;16px) and
            <code>position: relative</code>, so the radius above never shows on a bar. Each
            <code>html.style-&lt;name&gt;</code> block in <code>src/styles.scss</code> also restyles the header bar
            (<code>.main-menubar</code>): no border but a bottom edge in <code>--style-outline</code>. Item padding is not
            overridden.
          </li>
          <li>
            <strong>Root items:</strong> link padding 8px&nbsp;12px, content radius <code>&#123;border.radius.md&#125;</code>
            from <code>menubar.baseItem.*</code> — a different token pair from the one submenu items use, whose radius is
            <code>&#123;border.radius.sm&#125;</code> (0 in werkbund; Aura stock 4px). The chevron is 14x14, pushed to the
            end with <code>margin-left: auto</code>.
          </li>
          <li>
            <strong>Submenu panel:</strong> a <code>min-width</code> of 12.5rem (200px) and no maximum, padding 4px, gap
            2px, radius <code>&#123;border.radius.md&#125;</code>, <code>z-index: 1</code>.
          </li>
          <li>
            <strong>On a narrow screen:</strong> below <code>breakpoint</code> (default <code>960px</code>, read once at
            init) the bar switches to its hamburger branch; above it, a bar that runs out of width wraps its root list to
            a second row (<code>flex-wrap: wrap</code>) and never scrolls. Set <code>breakpoint</code> to your layout's
            own.
          </li>
          <li>
            <strong>Positioning is static, and nothing avoids a collision.</strong> The first-level panel has no
            <code>top</code>/<code>left</code> rule at all — it sits at its static position, so its containing block is
            whatever positioned ancestor it happens to find. The second level is <code>left: 100%; top: 0</code>.
            With the bar against the right edge of the viewport, both panels end past it, the document does not grow to
            reach them, and neither flips.
          </li>
          <li>
            <strong>Mobile branch:</strong> the button is 28x28 (the <code>1.75rem</code> token) at
            <code>border-radius: 50%</code> — clear of the 24px minimum of SC 2.5.8. The root list becomes an absolutely
            positioned, full-width panel under the bar; submenus turn <code>position: static</code>, full width, with a
            16px <code>padding-inline-start</code> and no shadow or border. The chevrons carry the open/closed state
            here: a root entry's chevron is untransformed while shut and rotated <code>-180deg</code> once its panel is
            open; a nested group's sits at <code>rotate(90deg)</code> shut and <code>rotate(-90deg)</code> open
            (<code>&#64;openng/optimus-ui-styles/dist/menubar/index.mjs:251-260</code>).
          </li>
        </ul>

        <h3>Motion and forced colors</h3>
        <p>
          Exactly one thing animates: <code>transform 0.2s</code> on the mobile chevrons. The panels are switched with
          <code>display</code>, so nothing can be stranded mid-transition — and the item hover/focus transition
          <em>does not run at all</em>.
        </p>
        <p class="src-note">
          That last part contradicts the token, and the token is the trap.
          <code>menubar.transitionDuration</code> (an alias of the semantic <code>transition.duration</code>) resolves
          to <code>0.2s</code> and the base rule asks for <code>transition: background …, color …</code> on
          <code>.p-menubar-item-content</code> — but the preset also ships a bulk rule naming
          <code>div.p-menubar-item-content</code> among two dozen selectors with <code>transition: none</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/css/index.mjs</code>). Higher specificity wins: the computed
          <code>transition-property</code> is <code>none</code> with reduced motion off, while the custom property still
          reports <code>0.2s</code>. Read the computed style, never the token, before tuning this.
        </p>
        <p>
          Under forced colors author backgrounds are replaced by the system palette, so a focus state carried by
          background alone would have nothing left to carry it — the second reason the kit's ring is an outline rather
          than a stronger swap. Unlike the numbers above, that is an expectation from how forced-colors mode works, not
          something measured here.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 1.4.3 for the item labels, 10.35:1 light / 17.72:1 dark on the bar and on the
          panel alike; SC 2.1.1, with Home/End, level traversal, disabled and separator skips, and Tab out all measured
          working; SC 1.4.11 for the hamburger glyph (4.76:1 / 6.91:1), for the submenu chevron and the item icon (4.76:1 and up,
          gated) and for the kit focus ring on the items and the hamburger (4.73:1 and up on every surface it meets, gated); SC
          2.4.7, that ring being drawn in both themes and distinct from hover; and SC 2.5.8 for the 28x28px mobile
          button. <strong>Failing:</strong> none of the measured criteria, as the kit ships it — Aura alone fails SC
          1.4.11 three times (the 1.10:1 focus swap, the 2.56:1 chevron and the 2.56:1 item icon), which is what the kit
          rules fix. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs, with the defaults the source actually has</h3>
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
                <td><code>model</code></td>
                <td><em>undefined</em></td>
                <td>
                  <code>MenuItem[]</code>. A plain setter again in Optimus (PrimeNG 22 had a signal input); assigning
                  rebuilds the processed item tree (<code>openng-optimus-ui-menubar.mjs:660-663</code>). Mutating the
                  array in place does nothing.
                </td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>'960px'</code></td>
                <td>
                  Fed into <code>matchMedia('(max-width: …)')</code> once, in <code>onInit</code> (<code>:787-788</code>,
                  <code>:874</code>). Changing it later has no effect.
                </td>
              </tr>
              <tr>
                <td><code>autoDisplay</code></td>
                <td>
                  <strong><code>true</code></strong>
                </td>
                <td>
                  Root submenus open on hover (<code>:687</code>, gate <code>:215</code>) — but only after the first
                  mousedown or click inside the bar (<code>:929</code>, <code>:1010</code>).
                </td>
              </tr>
              <tr>
                <td><code>autoHide</code></td>
                <td><em>undefined</em> (falsy)</td>
                <td>
                  Close the open path when the pointer leaves the bar. Read once in <code>onInit</code> into the service
                  (<code>:789</code>), so it is not reactive.
                </td>
              </tr>
              <tr>
                <td><code>autoHideDelay</code></td>
                <td><code>100</code></td>
                <td>
                  Milliseconds before <code>autoHide</code> fires. Also read once into the service (<code>:790</code>).
                </td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td>—</td>
                <td>
                  <strong>Gone.</strong> PrimeNG 22's motion layer is not in the Optimus fork: the bundle contains no
                  <code>pMotion</code> and no <code>motionOptions</code> input. Submenus are switched with
                  <code>display</code>.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td><em>undefined</em></td>
                <td>
                  Land on the root list (<code>:1364-1365</code>). One of the two is the only way to name the menu.
                </td>
              </tr>
              <tr>
                <td><code>id</code></td>
                <td>generated</td>
                <td>
                  The root list's id and the stem of every item id; falls back to
                  <code>uuid('pn_id_')</code> (<code>:794</code>).
                </td>
              </tr>
              <tr>
                <td><code>autoZIndex</code> / <code>baseZIndex</code></td>
                <td><code>true</code> / <code>0</code></td>
                <td>
                  <strong>Inert.</strong> Declared (<code>:676</code>, <code>:681</code>) and passed down
                  (<code>:1360-1361</code>), but no template reads either. The one layering call takes its value from
                  the global config (<code>:985</code>); desktop submenus are a plain <code>z-index: 1</code>.
                </td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>—</td>
                <td>
                  <strong>Back in Optimus</strong> — PrimeNG 22 removed it, the v21 fork still declares it
                  (<code>:671</code>) and reads it into the host class (<code>:1465</code>). Still
                  <code>&#64;deprecated</code> since v20; use plain <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Outputs are <code>onFocus</code> and <code>onBlur</code> only, both from the root list. There is no "submenu
          opened", no "item selected": item activation is <code>item.command</code>, per item.
        </p>

        <h3>Which MenuItem fields this component reads</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Effect in a menubar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>
                  The visible text <em>and</em> the item's <code>aria-label</code> (<code>:249</code>) — so a custom
                  <code>#item</code> template does not change the announced name.
                </td>
              </tr>
              <tr>
                <td><code>items</code></td>
                <td>
                  Makes it a group: chevron, <code>aria-haspopup="menu"</code>, <code>aria-expanded</code>, and a nested
                  list.
                </td>
              </tr>
              <tr>
                <td><code>command</code></td>
                <td>Called with <code>&#123; originalEvent, item &#125;</code> on click and on Enter/Space.</td>
              </tr>
              <tr>
                <td>
                  <code>routerLink</code> + <code>queryParams</code>, <code>fragment</code>, <code>state</code>, …
                </td>
                <td>
                  Switches to the router branch; the anchor gets
                  <code>routerLinkActive="p-menubar-item-link-active"</code> — a class with no shipped rule, so style it
                  yourself.
                </td>
              </tr>
              <tr>
                <td><code>url</code>, <code>target</code>, <code>title</code></td>
                <td>Plain-anchor branch. Still <code>tabindex="-1"</code>.</td>
              </tr>
              <tr>
                <td><code>icon</code>, <code>iconClass</code>, <code>iconStyle</code></td>
                <td>
                  Class list on the icon span. No <code>aria-hidden</code> is set — decorative icons are your problem.
                </td>
              </tr>
              <tr>
                <td><code>badge</code>, <code>badgeStyleClass</code></td>
                <td>
                  Renders a <code>p-badge</code> inside the link. The badge text is not part of the item's accessible
                  name, because <code>aria-label</code> overrides the subtree.
                </td>
              </tr>
              <tr>
                <td><code>separator</code></td>
                <td>
                  Renders <code>&lt;li role="separator"&gt;</code>. Styled only inside a submenu — a separator between
                  root items is invisible.
                </td>
              </tr>
              <tr>
                <td><code>visible: false</code></td>
                <td>
                  The item is not rendered at all, and drops out of the <code>aria-setsize</code>/<code
                    >aria-posinset</code
                  >
                  counts.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>
                  Skipped by the keyboard model and given <code>aria-disabled="true"</code> (<code>:250</code>) — but it
                  <strong>stays in the set</strong>. On a two-item panel whose second entry is disabled:
                  <code>aria-posinset="2"</code> of <code>aria-setsize="2"</code>. Only separators are excluded from the
                  counts (<code>:233-239</code>).
                </td>
              </tr>
              <tr>
                <td><code>escape</code></td>
                <td>
                  <strong>No default.</strong> Falsy means the label goes through
                  <code>[innerHTML]</code> (<code>:298</code>, <code>:356</code>) — see the i18n tab.
                </td>
              </tr>
              <tr>
                <td><code>tooltipOptions</code></td>
                <td>
                  The only tooltip route. <code>item.tooltip</code> and <code>item.tooltipPosition</code> exist on the
                  interface and are <strong>not read</strong> here.
                </td>
              </tr>
              <tr>
                <td>
                  <code>id</code>, <code>style</code>, <code>styleClass</code>, <code>labelClass</code>,
                  <code>linkClass</code>, <code>automationId</code>
                </td>
                <td>Pass straight through to the corresponding element.</td>
              </tr>
              <tr>
                <td><code>expanded</code>, <code>tabindex</code></td>
                <td>
                  <strong>Not read.</strong> Open state is the component's own <code>activeItemPath</code>; tab order is
                  fixed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Keyboard, measured key by key</h3>
        <p>
          Focus lands on the root list once; from there a virtual cursor moves through
          <code>aria-activedescendant</code> and <code>document.activeElement</code> never changes. The table below is
          what the keys did on a rendered three-level bar. Four entries deviate from the APG menubar pattern, and one of
          them leaks to the page.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>On a root item</th>
                <th>Inside a submenu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code> in</td>
                <td colspan="2">
                  The cursor goes to the first enabled item. In the mobile branch the hamburger is the stop while the
                  panel is shut.
                </td>
              </tr>
              <tr>
                <td><code>ArrowRight</code> / <code>ArrowLeft</code></td>
                <td>
                  Next / previous root item. <strong>No wrapping</strong> — at either end the cursor simply stops.
                </td>
                <td>
                  Right opens a group and moves into it, and does nothing on a leaf. Left closes the panel and returns
                  to its parent item.
                </td>
              </tr>
              <tr>
                <td><code>ArrowDown</code></td>
                <td>
                  On a group: opens the panel and focuses its <em>first</em> item.
                  <strong
                    >On an item without a submenu: nothing happens and the event is not canceled — the page
                    scrolls.</strong
                  >
                </td>
                <td>Next item; separators and disabled entries are skipped. No wrapping.</td>
              </tr>
              <tr>
                <td><code>ArrowUp</code></td>
                <td>
                  On a group: opens the panel and focuses its <em>last</em> item. On a leaf: nothing, but the event
                  <em>is</em> canceled.
                </td>
                <td>Previous item; from the first one it leaves the panel and closes it.</td>
              </tr>
              <tr>
                <td><code>Home</code> / <code>End</code></td>
                <td>First / last root item.</td>
                <td>First / last item of the open panel.</td>
              </tr>
              <tr>
                <td><code>Enter</code> / <code>Space</code></td>
                <td>
                  On a group: opens the panel but <strong>leaves the cursor on the root item</strong>, so an arrow key
                  is still needed to get in.
                </td>
                <td>Runs <code>item.command</code> or follows the link, and closes the menu.</td>
              </tr>
              <tr>
                <td><code>Escape</code></td>
                <td colspan="2">
                  <strong>Closes every open panel at once</strong>, from any depth, and puts the cursor back on the root
                  item. It does not step out one level.
                </td>
              </tr>
              <tr>
                <td>a printable character</td>
                <td colspan="2">
                  Jumps to the next item at the current level whose label starts with it, wrapping around, with a
                  500&nbsp;ms buffer for multi-character search. The event is <strong>not</strong> canceled.
                </td>
              </tr>
              <tr>
                <td><code>Tab</code> out</td>
                <td colspan="2">
                  Closes everything and moves on to the next element in the page. Focus never comes back into the bar by
                  itself.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="src-note">
          <strong>The mobile branch runs the same handler, and one key behaves differently there.</strong> With the
          panel open: <kbd>Escape</kbd> puts focus back on the hamburger but does
          not close the panel — <code>hide()</code> never resets <code>mobileActive</code>
          (<code>:993-1002</code>), so the list stays visible with
          <code>aria-expanded="true"</code>. Close it from your own code if Escape has to mean closed, and remember that
          the arrow keys still traverse a horizontal bar while the panel is stacked.
        </p>

        <h3>Templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Template</th>
                <th>Where it lands</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#start</code></td>
                <td>
                  A <code>&lt;div class="p-menubar-start"&gt;</code> before the hamburger. Not rendered at all when
                  absent.
                </td>
              </tr>
              <tr>
                <td><code>#end</code></td>
                <td>
                  <code>&lt;div class="p-menubar-end"&gt;</code>. When absent, the same box renders with your projected
                  content instead — so the box always exists.
                </td>
              </tr>
              <tr>
                <td><code>#item</code></td>
                <td>
                  Replaces the whole anchor, with context <code>&#123; $implicit: item, root: boolean &#125;</code>. You
                  then own the anchor, the icon, and the label — but not the <code>aria-label</code>, which still comes
                  from <code>item.label</code>.
                </td>
              </tr>
              <tr>
                <td><code>#menuicon</code></td>
                <td>Replaces the hamburger glyph.</td>
              </tr>
              <tr>
                <td><code>#submenuicon</code></td>
                <td>
                  Replaces <strong>both</strong> chevrons — the down one at root level and the right one below it — with
                  one template. There is no root flag in its context.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          All five queries are <code>&#123; descendants: false &#125;</code>: the template must be a direct child of
          <code>&lt;p-menubar&gt;</code>. The legacy <code>pTemplate</code> spelling <strong>partly works again</strong>
          in Optimus: PrimeNG 22 had dropped it, the fork's v21 code base keeps the
          <code>&#64;ContentChildren(PrimeTemplate)</code> query (<code>:1326</code>) and harvests all five names into
          <code>_startTemplate</code>…<code>_itemTemplate</code> (<code>:829-849</code>). Four of them are read as
          <code>x || _x</code> fallbacks (<code>:1327</code>, <code>:1346</code>, <code>:1367</code>,
          <code>:1380</code>) — but <code>_itemTemplate</code> is never read: the root list binds bare
          <code>[itemTemplate]="itemTemplate"</code> (<code>:1356</code>), so <code>pTemplate="item"</code> still
          renders nothing. Use the <code>#</code> reference names only.
        </p>

        <h3>Pass-through, and which branch each key exists in</h3>
        <p>
          <code>pt</code> is passed down into every submenu level (<code>openng-optimus-ui-menubar.mjs:396</code>), so a key that
          names an item part applies at <em>all</em> levels at once — there is no per-level selector. Two keys exist
          only in one branch:
        </p>
        <ul>
          <li>
            <code>root</code> / <code>host</code> — merged onto the <code>&lt;p-menubar&gt;</code> host from
            <code>onAfterViewChecked</code> (<code>:652</code>). Both branches.
          </li>
          <li>
            <code>rootList</code> — the <code>&lt;ul&gt;</code>. Both branches; the only route to its
            <code>role</code> and <code>tabindex</code>.
          </li>
          <li>
            <code>button</code>, <code>buttonIcon</code> — <strong>mobile branch only.</strong> The element is in the
            DOM above the breakpoint but <code>display: none</code>, and it is not rendered at all when
            <code>model</code> is empty. Its <code>aria-expanded</code> is bound to an undefined field until the first
            toggle, so a bar that has never been opened ships the button <em>without</em> the attribute; measured, it
            appears as <code>"false"</code> only after the panel has been closed once. Write it through
            <code>pt.button</code> if that matters.
          </li>
          <li>
            <code>start</code> — <strong>only when a <code>#start</code> template exists</strong>; <code>end</code> is
            always present.
          </li>
          <li>
            <code>item</code>, <code>itemContent</code>, <code>itemLink</code>, <code>itemIcon</code>,
            <code>itemLabel</code>, <code>submenuIcon</code>, <code>submenu</code>, <code>separator</code>,
            <code>pcBadge</code> — every level. The item-level keys receive a context object with <code>item</code>,
            <code>index</code>, <code>active</code>, <code>focused</code>, <code>disabled</code> and
            <code>level</code> (<code>:220-229</code>), which is how you reach one level only.
          </li>
        </ul>

        <h3>Dead ends in Optimus UI 2.0.2</h3>
        <ul>
          <li>
            <strong>The submenu role is hard-coded, and pass-through cannot take it back.</strong> The host binding
            <code>'[attr.role]': "'menubar'"</code> (<code>:587</code>) sits on the recursive component, so every
            submenu is a menu bar too. On an <code>OnPush</code> host: <code>pt.rootList</code> with
            <code>role</code> set to <code>presentation</code>, <code>none</code> or <code>null</code> still read
            <code>menubar</code> at load and through every interaction that did not touch the bar — the component
            re-asserts the binding, and only its own change detection settles it. Other keys are unaffected:
            <code>tabindex</code> and <code>aria-hidden</code> hold, because nothing else writes them. And one
            <code>pt</code> key applies to every level at once.
          </li>
          <li>
            <strong><code>item.to</code> does not exist.</strong> The <code>aria-haspopup</code> guard reads it
            (<code>:251</code>); <code>MenuItem</code> has no such field, so every group gets
            <code>aria-haspopup="menu"</code>, router links included.
          </li>
          <li>
            <strong>The plain <code>id="…"</code> spelling duplicates the id.</strong> The value becomes the root list's
            id and the stem of every item id, and the literal attribute <em>also</em> stays on the
            <code>&lt;p-menubar&gt;</code> element — measured, two elements in the document with one id. Written as a
            binding, <code>[id]="expr"</code>, Angular sets the input without emitting a host attribute and there is no
            duplicate. Prefer the binding, or put the id on a wrapper.
          </li>
          <li>
            <strong>The accessible name is the raw label string.</strong> The <code>aria-label</code> on the
            <code>&lt;li&gt;</code> is <code>item.label</code> verbatim (<code>:249</code>) — a label
            containing markup is announced with the markup in it, whatever <code>escape</code> says, and a custom
            <code>#item</code> template cannot change it. It also overrides everything inside, so a badge is never part
            of the name.
          </li>
          <li>
            <strong>MenubarSub's own surface is largely inert.</strong> Its <code>ariaLabel</code>,
            <code>ariaLabelledBy</code>, <code>autoZIndex</code> and <code>baseZIndex</code> inputs are never read by
            its template, and its <code>menuFocus</code>, <code>menuBlur</code> and <code>menuKeydown</code> outputs are
            never emitted. The parent binds two of them anyway (<code>:1360-1361</code>). Do not target them.
          </li>
          <li>
            <strong>A submenu's <code>aria-labelledby</code> can dangle.</strong> It points at the parent label span's
            id (<code>:392</code>); that id is set in the plain-anchor branch (<code>:289</code>, <code>:299</code>) and
            <em>not</em> in the router branch (<code>:349-357</code>). A group whose parent item uses
            <code>routerLink</code> therefore names its panel after an id that is not in the document. Check it the way
            you would any reference: read the panel in the accessibility tree and see whether it has a name.
          </li>
        </ul>

        <h3>SSR</h3>
        <p>
          The only browser API is <code>matchMedia</code>, and it sits behind an <code>isPlatformBrowser</code> guard
          (<code>openng-optimus-ui-menubar.mjs:871-885</code>), so the component prerenders. What it prerenders is always the
          <strong>desktop branch</strong>: the media-query signal starts <code>false</code> and is filled in on the
          client. Measured on the server response for a bar pinned into the mobile branch — the root element carries
          <code>p-menubar</code> and not <code>p-menubar-mobile</code>, so a narrow client repaints into the hamburger
          after hydration.
        </p>
        <p class="src-note">
          The generated <code>id</code> is a per-instance <code>uuid('pn_id_')</code>
          (<code>:794</code>), produced independently on each platform, so the server render and the client do not share
          it. Nothing outside the component may reference it — set
          <code>id</code> yourself when you need a stable handle.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>☐ The entries really are commands. If they are destinations, this is the wrong component.</li>
          <li>
            ☐ <code>ariaLabel</code> or <code>ariaLabelledBy</code> is set and translated — without it the menu bar has
            no name.
          </li>
          <li>☐ Every item has a <code>label</code>; an icon-only item has no accessible name at all.</li>
          <li>
            ☐ <code>escape</code> set to match the catalog — plain text means <code>escape: true</code> on every item.
          </li>
          <li>
            ☐ <code>breakpoint</code> matches your own layout breakpoint, and both branches were walked with the
            keyboard.
          </li>
          <li>
            ☐ The bar is not the only route to anything behind it: a closed submenu is invisible to find-in-page, and no
            entry can be opened in a new tab.
          </li>
          <li>
            ☐ No focus rule of your own on the items — the kit's ring already marks the <code>.p-focus</code> item on
            the bar and the panel (4.73:1 and up); a second rule would drift from it.
          </li>
          <li>
            ☐ No submenu sits close enough to a viewport edge to be clipped: nothing in this component repositions.
          </li>
          <li>☐ No markup in any <code>label</code> — it lands verbatim in the accessible name.</li>
          <li>☐ <code>class</code> — <code>styleClass</code> compiles again in Optimus but stays deprecated.</li>
          <li>
            ☐ Verify in the browser's accessibility tree: the bar is named, items are announced with the label you
            translated, and you have decided that "menu bar" is what a submenu should say.
          </li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the two structural facts above: the root list is the
          single tab stop and carries the name, and a submenu panel is rendered as a second <code>menubar</code> rather
          than as a menu.
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>One string from the library, everything else from you</h3>
        <p>
          The hamburger's accessible name is
          <code>config.translation.aria.navigation</code>, default
          <code>'Navigation'</code> (<code>openng-optimus-ui-config.mjs:187</code>). It is the only string
          <code>p-menubar</code> takes from the Optimus translation config, it only exists in the mobile branch, and it
          is not reachable through an input — set it globally, or override the element's <code>aria-label</code> through
          <code>pt.button</code>.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Everything else — item labels, the menu's own name, badge text — comes from your model. Because
          <code>model</code> only rebuilds its item tree on assignment, a language switch has to produce a
          <em>new array</em>: a
          <code>computed()</code> over the translation service does that; a field assigned once in the constructor does
          not, and the bar keeps the language it was born in.
        </p>

        <h3>Labels are HTML unless you say otherwise</h3>
        <p>
          <code>MenuItem.escape</code> does what its name says — and it has <strong>no default</strong>, so the falsy
          branch wins and an unset label goes through <code>[innerHTML]</code> (<code>openng-optimus-ui-menubar.mjs:298</code>).
          With the same string in two items: left unset, the label becomes real markup — a
          <code>&lt;b&gt;</code> child at font-weight 700, and <code>&amp;amp;</code> decoded to <code>&amp;</code>.
          With <code>escape: true</code> it is printed verbatim, entities and tags included.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-escape">
          <p-menubar [model]="escapeModel" breakpoint="1px" ariaLabel="Escape demo" />
        </div>
        <p class="ex__note">
          Both entries carry the same label string. The first leaves
          <code>escape</code> unset; the second sets <code>escape: true</code>.
        </p>
        <p>
          Angular's sanitizer strips scripts, so this is not an injection hole — it is a correctness one, and which
          setting is right depends on what your catalog stores.
          <strong>Plain-text catalog — the normal case: set <code>escape: true</code></strong>
          on every item, and a label containing <code>&amp;</code> or <code>&lt;</code> shows exactly those characters.
          <strong>Entity-encoded catalog: leave it unset</strong>, and accept that any stray tag in a translation
          becomes live markup. What you must not do is mix the two, because the same entry then reads differently in the
          menubar than it does everywhere else in the app.
        </p>

        <h3>Length</h3>
        <ul>
          <li>
            The root list is <code>flex-wrap: wrap</code>, so a bar that is too narrow grows a second row rather than
            scrolling — and the bar's height changes with the language. Nothing truncates.
          </li>
          <li>
            A submenu panel has <code>min-width: 12.5rem</code> and no maximum: one long entry widens the whole panel,
            and a panel that grows past the viewport edge is not moved back.
          </li>
          <li>
            In the mobile branch the panel is <code>width: 100%</code> of the bar, so long labels wrap there instead.
            Check the language with the longest words, not the longest sentence.
          </li>
        </ul>

        <h3>RTL</h3>
        <p>
          Measured on two identical menubars differing only in <code>dir</code>, with a second-level submenu open in
          each. Most of the bar mirrors; the flyout does not.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Mirrors</th>
                <th>Measured</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order of the root items</td>
                <td>Yes</td>
                <td>The first item moves from the left edge to the right one and the rest follow.</td>
              </tr>
              <tr>
                <td>The <code>#end</code> slot</td>
                <td>Yes</td>
                <td>
                  Its auto margin flips: <code>margin-left: 188.7px</code> becomes <code>margin-right: 188.7px</code> —
                  same box, other side.
                </td>
              </tr>
              <tr>
                <td>First-level panel</td>
                <td>Yes</td>
                <td>
                  It has no positioning rule and follows its static position, so it aligns to the item's start edge in
                  both directions.
                </td>
              </tr>
              <tr>
                <td>Position of the submenu chevron</td>
                <td>Yes</td>
                <td>The auto margin flips the same way, so it stays at the inline end of its row.</td>
              </tr>
              <tr>
                <td>Root-level chevron</td>
                <td>n/a</td>
                <td>It points down. Nothing to mirror, and nothing moves.</td>
              </tr>
              <tr>
                <td><strong>Second-level panel</strong></td>
                <td><strong>No</strong></td>
                <td>
                  Its rule is the physical <code>left: 100%</code> with no direction-aware counterpart. Measured:
                  computed <code>left: 190px</code> in <em>both</em> directions, so the panel starts at the parent
                  item's <em>physical</em> right edge either way. In LTR that is forwards, away from the parent panel.
                  In RTL it is backwards: the flyout overlaps the parent panel's right edge by 5px and the remaining
                  195px hang outside it.
                </td>
              </tr>
              <tr>
                <td><strong>Chevron glyph</strong></td>
                <td><strong>No</strong></td>
                <td>
                  It stays the right-pointing icon at every level, so in RTL it points away from the reading direction.
                </td>
              </tr>
              <tr>
                <td>Mobile panel</td>
                <td>Identical</td>
                <td>It is the full width of the bar, so both directions measure the same box.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          To reproduce: render the same model under <code>dir="rtl"</code> and <code>dir="ltr"</code>, open a
          second-level submenu in each, and compare <code>getBoundingClientRect()</code> for the panel against its
          parent item.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Synced with the last focus round: the item icon is
            <code>--text-color-secondary</code> in all three states and gated in "menu focus"; the conditional SC 1.4.11
            note is gone.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the focused item and the
            hamburger wear the kit's one 2px ring, the submenu chevron is <code>--text-color-secondary</code>; both
            cited from CONTRAST.MD "menu focus", and the two SC 1.4.11 failures moved to "fixed by the kit".
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles. Design: colors labeled as Aura's stock
            palette (no style overrides them) with the page-ground and accent-dependent rows marked "measure";
            the focus ring follows <code>&#123;primary.color&#125;</code>, radii follow the active style; the kit's
            header rule is cited in <code>app-header.component.ts</code>; one explicit narrow-screen statement.
            Nine stale line refs corrected (<code>:249</code>, <code>:250</code>, <code>:298</code>, <code>:392</code>,
            <code>:587</code>, <code>:652</code>, <code>:794</code>, <code>:993-1002</code>, <code>:1360-1361</code>);
            build-version measurement markers removed; history newest first; doc trimmed to the byte aim.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): every line ref re-derived
            against the Optimus bundles. Four claims flipped back to their v21 form — <code>model</code> is a plain
            setter, not a signal input; <code>styleClass</code> exists and is read into the host class;
            <code>pTemplate</code> is harvested again (though <code>pTemplate="item"</code> is still never read); and
            <code>motionOptions</code>/<code>pMotion</code> are gone with the motion layer, so panels switch on
            <code>display</code>. Geometry is back on Aura 2.x tokens: bar and items 8x12px, mobile button 28px, mobile
            indent 16px; color tokens resolve to the same values, so the contrast numbers still carry. Browser
            measurements were not repeated and stay marked "measured (21)".
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1 (Aura 3.0): all line refs re-derived;
            <code>model</code> is a signal input with a <code>computed()</code> item tree; <code>styleClass</code> and
            the legacy <code>pTemplate</code> route were removed; <code>motionOptions</code> and motion-layer submenu
            animation are new; the mobile-Escape bug, the no-wrap arrows, and the ArrowDown page-scroll leak are now
            source-confirmed. Aura 3.0 geometry: bar 6x10px, items 4x10px, mobile button 24px (now exactly the SC 2.5.8
            minimum), mobile indent 14px; color tokens unchanged, so all contrast numbers carry. Browser measurements
            not repeated are marked "measured (21)".
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed. TestBed snippet
            added to the development tab.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — The chrome recipe now names the two pass-through keys that hold and
            says why <code>role</code> is not one of them; a Sources section; and corrections to the motion,
            <code>autoZIndex</code>, disabled-in-set, bar-geometry, RTL-overlap, and mobile-chevron statements.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide: the navigation decision table and the role question
            answered from the accessibility tree, the complete input and <code>MenuItem</code> surface with the defaults
            the source has, a keyboard matrix measured key by key, the Aura token chain with contrast per surface and
            theme in both themes, the focus-indicator finding, the mobile branch and its pass-through routes, the
            <code>escape</code> behavior, a measured RTL result, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MenubarArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Journal ---------------------------------------------------------------
  readonly journal = signal<{ id: number; text: string }[]>([]);
  protected journalSeq = 0;

  log(text: string): void {
    this.journal.update((lines) => [{ id: ++this.journalSeq, text }, ...lines].slice(0, 6));
  }

  // --- Playground state ------------------------------------------------------
  readonly shapeOptions = [
    { label: 'Labels only', value: 'plain' },
    { label: 'Icons, a badge, a separator', value: 'rich' },
    { label: 'With a disabled entry', value: 'disabled' },
  ];

  readonly pgShape = signal<'plain' | 'rich' | 'disabled'>('rich');
  readonly pgAutoDisplay = signal(true);
  readonly pgAutoHide = signal(false);
  readonly pgMobile = signal(false);

  /**
   * Pinned to a query that always or never matches, so the example is about the
   * branch and not about the reader's window width.
   */
  readonly pgBreakpoint = computed(() => (this.pgMobile() ? '99999px' : '1px'));

  readonly pgModel = computed<MenuItem[]>(() => {
    const shape = this.pgShape();
    const rich = shape === 'rich';
    const file: MenuItem[] = [
      { label: 'New', escape: true, icon: rich ? 'pi pi-plus' : undefined, command: () => this.log('command: New') },
      {
        label: 'Open',
        escape: true,
        icon: rich ? 'pi pi-folder-open' : undefined,
        command: () => this.log('command: Open'),
      },
      ...(rich ? [{ separator: true } as MenuItem] : []),
      {
        label: 'Export',
        escape: true,
        items: [
          { label: 'As Markdown', escape: true, command: () => this.log('command: Export / Markdown') },
          { label: 'As JSON', escape: true, command: () => this.log('command: Export / JSON') },
        ],
      },
    ];
    return [
      { label: 'File', escape: true, icon: rich ? 'pi pi-file' : undefined, items: file },
      {
        label: 'Edit',
        escape: true,
        icon: rich ? 'pi pi-pencil' : undefined,
        items: [
          { label: 'Undo', escape: true, command: () => this.log('command: Undo') },
          {
            label: 'Redo',
            escape: true,
            disabled: shape === 'disabled',
            command: () => this.log('command: Redo'),
          },
        ],
      },
      {
        label: 'Help',
        escape: true,
        badge: rich ? '2' : undefined,
        command: () => this.log('command: Help'),
      },
    ];
  });

  readonly pgCode = computed(() => {
    const lines = [
      '<p-menubar',
      '  [model]="menuModel()"          <!-- a computed(), so a language switch rebuilds it -->',
      `  [autoDisplay]="${this.pgAutoDisplay()}"`,
      `  [autoHide]="${this.pgAutoHide()}"`,
      `  breakpoint="${this.pgMobile() ? '99999px' : '1px'}"`,
      '  [ariaLabel]="labels().menuName"',
      '  (onFocus)="…" (onBlur)="…" />',
    ];
    return lines.join('\n');
  });

  // --- Static fixtures -------------------------------------------------------
  readonly nestedModel: MenuItem[] = [
    {
      label: 'File',
      escape: true,
      icon: 'pi pi-file',
      items: [
        { label: 'New', escape: true, icon: 'pi pi-plus' },
        { separator: true },
        {
          label: 'Export',
          escape: true,
          items: [
            { label: 'As Markdown', escape: true },
            { label: 'As JSON', escape: true },
            { label: 'As a printable page', escape: true },
          ],
        },
      ],
    },
    {
      label: 'Edit',
      escape: true,
      icon: 'pi pi-pencil',
      items: [
        { label: 'Undo', escape: true },
        { label: 'Redo', escape: true, disabled: true },
      ],
    },
    { label: 'Help', escape: true, badge: '2' },
  ];

  readonly dirModel: MenuItem[] = [
    {
      label: 'Menu',
      escape: true,
      items: [
        {
          label: 'Submenu',
          escape: true,
          items: [
            { label: 'Leaf one', escape: true },
            { label: 'Leaf two', escape: true },
          ],
        },
        { label: 'Plain entry', escape: true },
      ],
    },
    { label: 'Second', escape: true },
  ];

  /** The same label twice: once with `escape` unset, once with it set. */
  protected readonly escapeLabel: string = 'Tools &amp; <b>beta</b>';

  readonly escapeModel: MenuItem[] = [{ label: this.escapeLabel }, { label: this.escapeLabel, escape: true }];

  /** A bar used as header chrome: no menu, so the empty list is silenced. */
  readonly emptyModel: MenuItem[] = [];
  readonly chromePt = { rootList: { tabindex: '-1', 'aria-hidden': 'true' } };

  readonly badNavModel: MenuItem[] = [
    { label: 'Overview', escape: true },
    { label: 'Methods', escape: true },
    { label: 'Glossary', escape: true },
    { label: 'Timeline', escape: true },
  ];

  // --- Snippets --------------------------------------------------------------
  readonly plainNavSnippet: string = `<nav [attr.aria-label]="labels().mainNav">
  <ul class="site-nav">
    @for (link of links(); track link.route) {
      <li>
        <a [routerLink]="link.route" routerLinkActive="site-nav--current"
           [attr.aria-current]="link.current ? 'page' : null">{{ link.label }}</a>
      </li>
    }
  </ul>
</nav>`;

  readonly chromePtSnippet: string = `<!-- A menubar used as header chrome: no model, so no menu.
     Only two pass-through keys are reliable here. tabindex is a plain
     attribute the component writes once, so this write is the last one;
     aria-hidden is written by nobody else. role is a host binding the
     component re-asserts, so it is left alone - the empty list keeps
     role="menubar" and is simply not in the accessibility tree any more.
     Safe ONLY because the model is empty: nothing here can focus the list. -->
<p-menubar [model]="[]"
  [pt]="{ rootList: { tabindex: '-1', 'aria-hidden': 'true' } }">
  <ng-template #start>…</ng-template>
  <ng-template #end>…</ng-template>
</p-menubar>`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MenubarModule } from '@openng/optimus-ui/menubar';
import { MenuItem } from '@openng/optimus-ui/api';

@Component({
  standalone: true,
  imports: [MenubarModule],
  // breakpoint="1px" keeps the desktop branch on every viewport the runner has.
  template: \`<p-menubar [model]="items" ariaLabel="Main" breakpoint="1px" />\`,
})
class HostComponent {
  items: MenuItem[] = [{ label: 'File', items: [{ label: 'Open' }] }];
}

describe('menubar structure', () => {
  it('names the root list, keeps one tab stop, and makes the panel a menubar too', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const lists = host.querySelectorAll('[role="menubar"]');
    // The root list is the named element and the component's single tab stop.
    expect(lists[0].getAttribute('aria-label')).toBe('Main');
    expect(lists[0].getAttribute('tabindex')).toBe('0');

    // The finding this guide records: role="menubar" is a static host binding on
    // the recursive sub-component, so the submenu panel - present in the DOM and
    // only hidden with display - announces as a second menu BAR, not as a menu.
    expect(lists.length).toBe(2);

    // Entries are menuitems named from item.label, and the anchor inside one is
    // not a tab stop of its own.
    const item = host.querySelector('[role="menuitem"]')!;
    expect(item.getAttribute('aria-label')).toBe('File');
    expect(item.querySelector('a')!.getAttribute('tabindex')).toBe('-1');
  });
});`;

  readonly annotatedSource: string = `<p-menubar
  [model]="menuModel()"                  <!-- computed(): a new array per language change -->
  [ariaLabel]="labels().menuName"        <!-- the only name the menu bar gets -->
  breakpoint="60rem"                     <!-- the same value your layout switches on -->
  [autoDisplay]="true"                   <!-- default; hover-opens after the first click -->
  [autoHide]="true"                      <!-- close the open path when the pointer leaves -->
  class="app-command-bar">               <!-- 'class'; styleClass exists but is deprecated -->

  <ng-template #end>                     <!-- direct child; the query is descendants:false -->
    <button type="button" class="app-command-bar__profile">…</button>
  </ng-template>
</p-menubar>

/* menuModel(): every label escaped, every leaf a command.
   readonly menuModel = computed<MenuItem[]>(() => [
     { label: this.t('menu.file'), escape: true, items: [
       { label: this.t('menu.file.new'), escape: true, command: () => this.create() },
     ] },
   ]); */`;

  readonly i18nSnippet: string = `// The hamburger's name comes from the global config, not from an input.
provideOptimus({
  translation: { aria: { navigation: 'Hauptmenü' } },
});

// Per instance, through pass-through, when one bar needs its own wording:
// <p-menubar [pt]="{ button: { 'aria-label': labels().openMenu } }">

// Item labels: one computed() over the translation service — a new array per language.
readonly menuModel = computed<MenuItem[]>(() => [
  { label: this.t.translate('menu.file'), escape: true, items: [...] },
]);`;

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
