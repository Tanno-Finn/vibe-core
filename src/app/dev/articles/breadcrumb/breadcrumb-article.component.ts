import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb';
import { MenuItem } from '@openng/optimus-ui/api';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [FormsModule, BreadcrumbModule, ToggleSwitchModule, GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-breadcrumb-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-breadcrumb-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-breadcrumb-article .stage--narrow {
        width: 360px;
        max-width: 100%;
      }

      app-breadcrumb-article .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-block: 0.5rem 1rem;
      }

      app-breadcrumb-article .ctl {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      app-breadcrumb-article .slash {
        color: var(--text-color-secondary);
      }

      app-breadcrumb-article .checklist {
        line-height: 1.7;
      }

      app-breadcrumb-article .history {
        line-height: 1.7;
      }
    `;

/**
 * Guide article: Breadcrumb (Guides, category `library`).
 *
 * Subject: the trail that states where a page sits in a hierarchy — what
 * `p-breadcrumb` already ships for the landmark and for `aria-current`, which
 * `MenuItem` fields act, and what the caller is still left holding.
 *
 * Claims made here, with their provenance (Optimus UI 2.0.2,
 * openng-optimus-ui-breadcrumb.mjs unless noted):
 *   - The complete input list is five — model, style, styleClass, home,
 *     homeAriaLabel (:202); pt/dt/unstyled are signal inputs inherited from
 *     BaseComponent — pt, ptOptions, dt, unstyled, all four
 *     (openng-optimus-ui-basecomponent.mjs:428). There is no
 *     ariaLabel input, which is why pt.root is the only input-level naming route.
 *   - The root element IS a <nav> (:203) wrapping <ol class="p-breadcrumb-list">
 *     (:204). A caller-supplied <nav> around it nests two landmarks.
 *   - aria-current is the library's: isCurrentPage() takes the last item with
 *     visible !== false (:190-200); the plain branch stamps [attr.aria-current]
 *     (:316), the router branch [ariaCurrentWhenActive] (:355).
 *   - Every item anchor carries tabindex 0 unless disabled (:314, :347) and an
 *     href only when `url` is set (:308) — so a target-less last crumb is a
 *     focusable non-link.
 *   - url renders an href (:308, full document load); routerLink navigates
 *     in-app (:338) and forwards the RouterLink inputs (:349-354).
 *   - escape defaults to the escaping branch (:324), unlike p-menubar.
 *   - home and its leading separator are both conditional (:205, :284), so
 *     [home]="undefined" is identical to omitting the input.
 *   - Live class names come from the `classes` map (:19-27); the only
 *     p-menuitem-* token left is the hard-coded routerLinkActive value
 *     (:244, :339).
 *   - Layout from @openng/optimus-ui-styles/dist/breadcrumb/index.mjs:
 *     overflow-x:auto on the root (:5), flex-wrap:nowrap on the list (:14),
 *     hidden WebKit scrollbar (:28), the item focus ring (:47-51), the RTL
 *     separator rotation (:24).
 *   - Token values from @openng/optimus-ui-themes/dist/aura/breadcrumb/index.mjs
 *     and .../aura/base/index.mjs; contrast ratios quoted from
 *     docs/generated/CONTRAST.MD, never eyedropped.
 */
@Component({
  selector: 'app-breadcrumb-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'breadcrumb'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A breadcrumb is a one-line answer to "where am I". Everything below is the real Optimus UI component: a
          <code>p-breadcrumb</code> fed a <code>MenuItem[]</code>, with an optional <code>home</code> root item and a
          chevron the library draws between entries.
        </p>

        <h3>Playground</h3>
        <div class="stage">
          <p-breadcrumb
            [model]="playgroundModel()"
            [home]="playgroundHome()"
            [homeAriaLabel]="'Start page'"
            [pt]="navName"></p-breadcrumb>
        </div>
        <div class="controls">
          <label class="ctl" for="bc-home">
            <p-toggleswitch inputId="bc-home" [(ngModel)]="showHomeModel"></p-toggleswitch>
            <span>home item</span>
          </label>
          <label class="ctl" for="bc-deep">
            <p-toggleswitch inputId="bc-deep" [(ngModel)]="deepModel"></p-toggleswitch>
            <span>nine crumbs</span>
          </label>
          <label class="ctl" for="bc-inert">
            <p-toggleswitch inputId="bc-inert" [(ngModel)]="inertLastModel"></p-toggleswitch>
            <span>inert last crumb</span>
          </label>
        </div>
        <p class="src-note">
          The three switches drive nothing but the <code>model</code> and <code>home</code> inputs — the component has
          five inputs in total (<code>openng-optimus-ui-breadcrumb.mjs:202</code>), and none of them is a variant, a
          size or a density.
        </p>

        <h3>The rendered anatomy</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          The element structure and its class names, from the component template
          (<code>openng-optimus-ui-breadcrumb.mjs:203-205</code>) and the <code>classes</code> map (<code>:19-27</code>).
          Note the outermost element: the component <em>is</em> the <code>nav</code>.
        </p>

        <h3>A nine-crumb trail in a 360px column</h3>
        <div class="stage stage--narrow">
          <p-breadcrumb [model]="longTrail" [pt]="navName"></p-breadcrumb>
        </div>
        <p class="src-note">
          The column is exactly {{ m.narrowWidth }} wide. Nothing wraps and nothing truncates — drag inside the trail,
          or press <kbd>Tab</kbd> through it, and it scrolls sideways
          (<code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:5</code>, <code>:14</code>).
        </p>

        <h3>A separator of your own</h3>
        <div class="stage">
          <p-breadcrumb [model]="shortTrail" [pt]="navName">
            <ng-template #separator><span class="slash">/</span></ng-template>
          </p-breadcrumb>
        </div>
        <p class="src-note">
          The projected content replaces only the chevron; the <code>&lt;li&gt;</code> around it keeps
          <code>aria-hidden="true"</code> (<code>openng-optimus-ui-breadcrumb.mjs:285</code>, <code>:377</code>), so a
          separator can never carry meaning.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Three controls in this kit draw a horizontal row of short labels, and only one of them is about position in a
          hierarchy. Picking by appearance is how a breadcrumb ends up narrating a wizard.
        </p>

        <h3>Which control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The reader wants to know…</th>
                <th>Control</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>where this page sits, and how to go up</td>
                <td><code>p-breadcrumb</code></td>
                <td>An ordered list of ancestors, ending at the current page.</td>
              </tr>
              <tr>
                <td>where they could go next</td>
                <td><code>p-menubar</code>, or a <code>&lt;nav&gt;</code> of links</td>
                <td>A set of destinations is not an ancestry; nothing about it is ordered by depth.</td>
              </tr>
              <tr>
                <td>how far through a task they are</td>
                <td>a stepper</td>
                <td>Steps are completable and ordered in time; ancestors are neither.</td>
              </tr>
              <tr>
                <td>how they got here</td>
                <td>nothing — that is the back button</td>
                <td>A breadcrumb states the URL's structure, not the visit's history.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The delineation against a command bar is the one the Menubar guide draws from the other side; the ancestry
          claim is the component's own <code>&lt;ol&gt;</code> (<code>openng-optimus-ui-breadcrumb.mjs:204</code>).
        </p>

        <h3>Which <code>MenuItem</code> fields act</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Effect here</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>The visible text, escaped by default ({{ m.escapeDefault }}).</td>
              </tr>
              <tr>
                <td><code>routerLink</code></td>
                <td>In-app navigation, plus the RouterLink inputs the template forwards.</td>
              </tr>
              <tr>
                <td><code>url</code></td>
                <td>A plain <code>href</code> — the browser reloads the document.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>A class name on a <code>span</code> before the label.</td>
              </tr>
              <tr>
                <td><code>command</code></td>
                <td>Runs on click; with no link target the default is canceled first.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>Drops <code>tabindex</code>, cancels the click, emits nothing.</td>
              </tr>
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code> removes the item — and moves the current-page marker.</td>
              </tr>
              <tr>
                <td><code>items</code>, <code>separator</code>, <code>expanded</code>, <code>tooltip</code></td>
                <td>{{ m.inertFields }}</td>
              </tr>
              <tr>
                <td><code>'aria-current'</code></td>
                <td>{{ m.ariaCurrentField }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the two anchor branches, <code>openng-optimus-ui-breadcrumb.mjs:307-334</code> (plain) and
          <code>:337-372</code> (router); the inert fields are the ones the template never reads. Tooltips reach the
          item only through <code>tooltipOptions</code> on the <code>&lt;li&gt;</code> (<code>:299</code>).
        </p>

        <h3>Wiring</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>Where this kit's trail comes from</h3>
        <p>
          The site-wide trail is not hand-written. The kit's <code>app-breadcrumb</code> derives it from the router
          config: <code>routedPagesByPath()</code> indexes the routes that load a page and carry a
          <code>titleKey</code> (redirects, the wildcard, and <code>:param</code> paths are left out), and
          <code>routeBreadcrumbs()</code> turns the current path into at most two crumbs — the route's group
          (<code>groupTitleKey</code>, no link) and the page itself (<code>titleKey</code>). Home and any path that is
          not a routed page yield no trail, and the wrapper renders nothing for a trail of one. A deeper hierarchy is
          passed explicitly through <code>[customBreadcrumbs]</code>. There is no route-to-label map to keep in step: a
          trail can only name a route that exists. The wrapper already follows both Do's below: it renders one
          landmark — the library's own <code>&lt;nav&gt;</code>, named through <code>pt.root</code> — and its last
          crumb is the current page, with no link and <code>tabindex: '-1'</code>, while the library stamps
          <code>aria-current="page"</code> on it.
        </p>
        <p class="src-note">
          <code>routeBreadcrumbs()</code> in <code>src/app/components/shared/breadcrumb.component.ts</code>;
          <code>routedPagesByPath()</code> in <code>src/app/utils/routed-pages.ts</code>; the landmark, current-page and
          tab-stop behavior is held by <code>src/app/components/shared/breadcrumb.component.spec.ts</code>. The JSON-LD
          <code>BreadcrumbList</code> (<code>src/app/services/structured-data.service.ts</code>) reads the same index.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — wrap the component in your own nav</span>
            <div class="dd__stage">
              <nav aria-label="breadcrumb">
                <p-breadcrumb [model]="shortTrail"></p-breadcrumb>
              </nav>
            </div>
            <p class="dd__why">
              Two nested navigation landmarks for one trail. A screen-reader landmark list shows both, and the inner one
              is unnamed — the component root is already a <code>&lt;nav&gt;</code>.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name the nav the component already renders</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="shortTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              One landmark, named through <code>pt.root</code> — the only input-level route, because this component has no
              <code>ariaLabel</code> input.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — leave the last crumb linking to itself</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="lastLinkedTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              The current page is a tab stop that navigates nowhere the reader is not already. Give it a target and it
              is a self-link; give it none and it is still focusable, because every item anchor takes
              <code>tabindex="0"</code>.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — make the last crumb inert</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="lastInertTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              No <code>url</code>, no <code>routerLink</code>, <code>tabindex: '-1'</code>. The library still stamps
              <code>aria-current="page"</code> on it, so it keeps announcing as the current page.
            </p>
          </div>
        </div>

        <p class="src-note">
          The nested-landmark claim is the component root at
          <code>openng-optimus-ui-breadcrumb.mjs:203</code>; the unconditional tab stop is
          <code>[attr.tabindex]="menuitem?.disabled ? null : menuitem?.tabindex || '0'"</code> (<code>:314</code>,
          <code>:347</code>).
        </p>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" target="_blank" rel="noopener noreferrer"
              >W3C APG — Breadcrumb</a
            >
            — the <code>nav</code> + <code>aria-current</code> contract, and the plain-text current page.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/location.html" target="_blank" rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.8 Location</a
            >
            — why the trail exists.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — the cost of a last crumb that is a tab stop with nowhere to go.
          </li>
          <li>
            <a href="https://optimus.openng.org/breadcrumb/" target="_blank" rel="noopener noreferrer"
              >Optimus UI — Breadcrumb</a
            >
            — the vendor API, read against the 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The breadcrumb is styled from Aura tokens; <code>src/styles.scss</code> touches it once, in the shared layer —
          the crumb link is one entry of the kit's one focus-ring list — and no <code>html.style-&lt;name&gt;</code>
          block names it, so what you see is the Aura preset plus the active visual style's radius and the kit ring. A
          call site that passes <code>styleClass</code> adds its own on
          top — the kit's <code>app-breadcrumb</code> wrapper does exactly that, and unlike the dead deep selectors
          beside them, those rules land: <code>styleClass</code> is concatenated onto the root
          <code>&lt;nav&gt;</code>'s class list (<code>cn(cx('root'), styleClass)</code>,
          <code>openng-optimus-ui-breadcrumb.mjs:203</code>).
        </p>

        <h3>Aura token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What it paints</th>
                <th>Component token</th>
                <th>Resolves to</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>trail background</td>
                <td><code>breadcrumb.background</code></td>
                <td>{{ m.tokenBackground }}</td>
              </tr>
              <tr>
                <td>crumb label</td>
                <td><code>breadcrumb.item.color</code></td>
                <td>{{ m.tokenItemColor }}</td>
              </tr>
              <tr>
                <td>crumb label, hovered</td>
                <td><code>breadcrumb.item.hover.color</code></td>
                <td>{{ m.tokenItemHover }}</td>
              </tr>
              <tr>
                <td>chevron</td>
                <td><code>breadcrumb.separator.color</code></td>
                <td>{{ m.tokenSeparator }}</td>
              </tr>
              <tr>
                <td>crumb corner radius</td>
                <td><code>breadcrumb.item.border.radius</code></td>
                <td>{{ m.tokenRadius }}</td>
              </tr>
              <tr>
                <td>padding / gap</td>
                <td><code>breadcrumb.padding</code>, <code>breadcrumb.gap</code></td>
                <td>{{ m.tokenSpacing }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and their targets from
          <code>&#64;openng/optimus-ui-themes/dist/aura/breadcrumb/index.mjs</code>; the semantic layer they land in is
          <code>.../aura/base/index.mjs</code>. The radius chain ends at the active visual style, whose
          <code>presetOverrides</code> set <code>primitive.borderRadius</code>
          (<code>src/app/services/ui-styles.ts</code>) — the default style resolves it to 0.
        </p>

        <h3>The focus ring is the kit's one ring</h3>
        <p>
          Aura rings a crumb with <code>breadcrumb.item.focusRing.*</code>, pointed at the global
          <code>focus.ring.*</code> (1px). The kit replaces it with the ring every focusable Optimus part wears —
          {{ m.focusRing }}. Tab into the trail below and the ring is visible without any work on your side.
        </p>
        <div class="stage">
          <p-breadcrumb [model]="shortTrail" [pt]="navName"></p-breadcrumb>
        </div>
        <pre class="code-block"><code>{{ focusRuleSnippet }}</code></pre>
        <p class="src-note">
          Aura's rule is <code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:47-51</code>, its token targets
          <code>.../aura/breadcrumb/index.mjs</code> and <code>.../aura/base/index.mjs</code>; the kit rule
          (<code>.p-breadcrumb-item-link:focus-visible</code>) is in the one ring list of <code>src/styles.scss</code>,
          measured in <code>docs/generated/CONTRAST.MD</code> "focus ring". Both are plain class selectors with a
          pseudo-class; the two hover rules beside Aura's (<code>:53</code>, <code>:66</code>) are the descendant ones, so
          a wrapper element breaks none of them.
        </p>

        <h3>At 360px: it scrolls, it never wraps</h3>
        <p>
          {{ m.narrowStatement }} There is no breakpoint and no truncation anywhere in the component or in its
          stylesheet — the behavior is the same at every viewport, and the only lever the caller has is the length of
          <code>model</code>. Layout guidance: keep the trail at about five crumbs, or shorten it yourself (an ellipsis
          crumb with <code>tabindex: '-1'</code> standing in for the middle ancestors) rather than expecting the
          component to do it.
        </p>
        <p class="src-note">
          <code>overflow-x: auto</code> on the root and <code>flex-wrap: nowrap</code> on the list
          (<code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:5</code>, <code>:14</code>); the scrollbar is
          removed in WebKit at <code>:28</code>, which is what makes the overflow silent rather than merely narrow.
        </p>

        <h3>Contrast</h3>
        <p>
          The crumb colors above resolve inside <em>Aura's</em> surface palette, not this kit's
          <code>--surface-*</code>/<code>--text-*</code> tokens, so the kit's contrast compilat does not measure them —
          quoting a ratio from it for the rendered component would be quoting the wrong pair. What the compilat does
          settle is the pairing you get when you override the trail with kit tokens, which is the usual reason to touch
          it at all: {{ m.contrastSecondaryGround }}, and {{ m.contrastSecondaryCard }}.
        </p>
        <p class="src-note">
          Both rows quoted from <code>docs/generated/CONTRAST.MD</code>, section <code>## style: werkbund
          (default)</code> → <code>### light mode</code>; the lernwerkstatt, skizzenbuch, and blaupause sections carry
          their own numbers for the same pair, in both modes. Regenerated from the real token values by
          <code>scripts/check-contrast.mjs</code>. The Aura-native pairing (<code>&#123;text.muted.color&#125;</code> on
          <code>&#123;content.background&#125;</code>) is deliberately not given a number here: it is not a pair the
          contrast gate covers.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Five inputs, one output, two templates. The interesting part is not the surface — it is which of the
          accessibility contract the component already keeps, and which half it hands back.
        </p>

        <h3>The complete input list</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>model</code></td>
                <td><code>MenuItem[]</code></td>
                <td>{{ m.modelNote }}</td>
              </tr>
              <tr>
                <td><code>home</code></td>
                <td><code>MenuItem</code></td>
                <td>{{ m.homeNote }}</td>
              </tr>
              <tr>
                <td><code>homeAriaLabel</code></td>
                <td><code>string</code></td>
                <td>Names the home link; beaten by nothing, beats the config default.</td>
              </tr>
              <tr>
                <td><code>style</code> / <code>styleClass</code></td>
                <td><code>object</code> / <code>string</code></td>
                <td>{{ m.styleClassNote }}</td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>ptOptions</code> / <code>dt</code> / <code>unstyled</code></td>
                <td>signal inputs</td>
                <td>The four inherited from <code>BaseComponent</code>; <code>pt.root</code> is the naming route.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The five own inputs are the component's <code>inputs</code> map,
          <code>openng-optimus-ui-breadcrumb.mjs:202</code>; the inherited four —
          <code>pt</code>, <code>ptOptions</code>, <code>dt</code>, <code>unstyled</code> — are
          <code>openng-optimus-ui-basecomponent.mjs:428</code>. There is no <code>ariaLabel</code> and no
          <code>ariaLabelledBy</code> — <code>p-menubar</code> has both, this does not.
        </p>

        <h3>Naming the nav</h3>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          <code>ptm('root')</code> is bound onto the <code>&lt;nav&gt;</code> through the <code>pBind</code> host
          directive (<code>openng-optimus-ui-breadcrumb.mjs:203</code>), so any attribute placed under the
          <code>root</code> key lands on the landmark.
        </p>

        <h3>Who sets <code>aria-current</code></h3>
        <pre class="code-block"><code>{{ currentSnippet }}</code></pre>
        <p>
          Two consequences worth holding on to. <code>isCurrentPage</code> walks from the end and stops at the first
          item that is not <code>visible: false</code> — so hiding the leaf silently moves the current-page marker onto
          its parent. And the router branch routes the value through
          <code>ariaCurrentWhenActive</code>, which RouterLinkActive applies only while that link matches the URL: a
          last crumb pointing somewhere else announces nothing.
        </p>
        <p class="src-note">
          <code>isCurrentPage</code> at <code>openng-optimus-ui-breadcrumb.mjs:190-200</code>; the two consumers at
          <code>:316</code> (plain) and <code>:355</code> (router).
        </p>

        <h3>The last crumb is a tab stop either way</h3>
        <p>
          {{ m.tabStop }} APG's breadcrumb pattern has the current page as plain text, or as a link marked
          <code>aria-current="page"</code> — not as a focusable element with no destination. Setting
          <code>tabindex: '-1'</code> on the last item is what closes the gap; the attribute binding reads
          <code>menuitem?.tabindex</code> before falling back to <code>'0'</code>, so your value wins.
        </p>
        <p class="src-note">
          <code>[attr.tabindex]</code> on both anchor branches,
          <code>openng-optimus-ui-breadcrumb.mjs:314</code> and <code>:347</code>; the <code>href</code> that is
          <code>null</code> without a <code>url</code> at <code>:308</code>.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>No caller-supplied <code>&lt;nav&gt;</code> anywhere around the component.</li>
          <li>The landmark has a name, set through <code>pt.root</code>.</li>
          <li>Internal crumbs use <code>routerLink</code>; only external ones use <code>url</code>.</li>
          <li>The last crumb has no link target and <code>tabindex: '-1'</code>.</li>
          <li>The home item has an accessible name if it shows only an icon.</li>
          <li><code>model</code> is rebuilt as a new array on route and language change.</li>
          <li>No stylesheet rule mentions <code>p-menuitem-link</code>, <code>p-menuitem-text</code>,
            <code>p-menuitem-icon</code>, <code>p-breadcrumb-home</code> or <code>p-breadcrumb-chevron</code> — the map
            emits <code>p-breadcrumb-home-item</code> and <code>p-breadcrumb-item-icon</code>, so all five are dead.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Almost everything a breadcrumb says comes from your model. The library contributes exactly one string, and it
          only appears in a case you should be handling anyway.
        </p>

        <h3>The one library string</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Where it comes from</th>
                <th>When it is used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ m.ariaHomeValue }}</td>
                <td><code>config.translation.aria.home</code></td>
                <td>{{ m.ariaHomeWhen }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The fallback chain is <code>homeLinkAriaLabel</code>,
          <code>openng-optimus-ui-breadcrumb.mjs:125-131</code>; the default value is
          <code>openng-optimus-ui-config.mjs:188</code>. Every other word in the trail is a <code>label</code> you
          supplied.
        </p>

        <h3>Labels are a computed, never a cached string</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> reads the service's <code>translationsVersion</code> signal
          (<code>src/app/services/translation.service.ts</code>), so a <code>computed()</code> over it re-runs on a
          language switch and yields a new array — which is what the plain <code>&#64;Input()</code> needs in order to
          notice. There is no <code>instant()</code> on this service.
        </p>

        <h3>The icon-only home</h3>
        <p>
          A home item with an <code>icon</code> and no <code>label</code> renders an anchor whose only content is an
          icon <code>span</code> with no text — so the link has no accessible name unless you supply one: pass
          <code>homeAriaLabel</code> (translated, like any other visible string), or give the item a visible
          <code>label</code> — in which case the component deliberately emits no <code>aria-label</code>, so the visible
          text and the announced name stay the same string.
        </p>

        <h3>RTL</h3>
        <p>
          The chevron mirrors itself under RTL, and nothing else in the component needs a direction-aware rule: the list
          is a plain flex row, so the writing direction reverses the crumb order for free. Your labels still need their
          own review for length — a trail that fits in one line in English is the same nowrap-and-scroll row in a
          language that runs 40% longer.
        </p>
        <p class="src-note">
          <code>{{ m.rtlRule }}</code>,
          <code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:24</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the crumb link wears the kit's
            one 2px ring (CONTRAST.MD "focus ring"); the kit's <code>app-breadcrumb</code> renders one landmark and an
            unlinked current page.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Usage names where the kit's trail comes from (derived from the routes,
            no route map) and closes with annotated sources; playground switches named once, by their visible
            label; design notes the visual styles add no breadcrumb rule; contrast cited by section;
            <code>isCurrentPage</code> range corrected to <code>:190-200</code>; doc trimmed to the byte aim.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class BreadcrumbArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** The only input-level naming route: p-breadcrumb has no ariaLabel input (:202). */
  readonly navName = { root: { 'aria-label': 'Breadcrumb' } };

  // --- playground state ------------------------------------------------------
  readonly showHomeModel = signal(true);
  readonly deepModel = signal(false);
  readonly inertLastModel = signal(true);

  protected readonly shallow: MenuItem[] = [
    { label: 'Catalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
  ];

  protected readonly deep: MenuItem[] = [
    { label: 'Catalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Wayfinding', routerLink: '/dev/design' },
    { label: 'Hierarchical', routerLink: '/dev/design' },
    { label: 'Trails', routerLink: '/dev/design' },
    { label: 'Ancestors', routerLink: '/dev/design' },
    { label: 'Depth eight', routerLink: '/dev/design' },
    { label: 'Depth nine', routerLink: '/dev/design' },
  ];

  readonly playgroundModel = computed<MenuItem[]>(() => {
    const ancestors = this.deepModel() ? this.deep : this.shallow;
    const leaf: MenuItem = this.inertLastModel()
      ? { label: 'Breadcrumb', tabindex: '-1' }
      : { label: 'Breadcrumb', routerLink: '/dev/design/guide/breadcrumb' };
    return [...ancestors, leaf];
  });

  readonly playgroundHome = computed<MenuItem | undefined>(() =>
    this.showHomeModel() ? { routerLink: '/dev/design' } : undefined,
  );

  // --- static example models -------------------------------------------------
  readonly shortTrail: MenuItem[] = [
    { label: 'Catalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', tabindex: '-1' },
  ];

  readonly longTrail: MenuItem[] = [
    ...this.deep,
    { label: 'A leaf with a long name', tabindex: '-1' },
  ];

  readonly lastLinkedTrail: MenuItem[] = [
    { label: 'Catalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', routerLink: '/dev/design/guide/breadcrumb' },
  ];

  readonly lastInertTrail: MenuItem[] = [
    { label: 'Catalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', tabindex: '-1' },
  ];

  // --- measurements, as flat constants so the tab extractor resolves them -----
  readonly m = {
    narrowWidth: '360px',
    escapeDefault: 'the escape branch wins unless escape is explicitly false',
    inertFields: 'Never read by the template — a breadcrumb has no nesting, no own separator item, and no tooltip input',
    ariaCurrentField: 'Not a MenuItem field at all; the library sets aria-current itself',
    tokenBackground: '{content.background}',
    tokenItemColor: '{text.muted.color}, which is {surface.500} light and {surface.400} dark',
    tokenItemHover: '{text.color}',
    tokenSeparator: '{navigation.item.icon.color}',
    tokenRadius: '{content.border.radius} → {border.radius.md}, which the default visual style sets to 0',
    tokenSpacing: '1rem padding, 0.5rem gap — literals in the preset, not token references',
    focusRing:
      '2px solid --primary-color-fg at a 2px offset, on the page surface around the crumb: 3.88–17.85:1 across every style, mode and accent (SC 1.4.11 asks 3:1)',
    narrowStatement:
      'The trail keeps its intrinsic width at every viewport and scrolls horizontally inside its own root once it no longer fits; it never wraps to a second line and never truncates a label.',
    contrastSecondaryGround:
      '--text-color-secondary on --surface-ground is 7.14:1 in the werkbund style, light mode (SC 1.4.3 needs 4.5:1)',
    contrastSecondaryCard:
      '--text-color-secondary on --surface-card is 7.78:1 in that same style and mode; the other three visual styles carry their own rows in the compilat, down to 4.90:1 (blaupause, light mode)',
    modelNote: 'A plain @Input(), not a signal — assign a new array, mutation does nothing under OnPush',
    homeNote: 'undefined is identical to omitting it: the home item and its separator are both conditional',
    styleClassNote: 'Both land on the root nav; not deprecated here, unlike several sibling components',
    tabStop:
      'Every item anchor takes tabindex="0" unless the item is disabled, and its href is null when the item has no url — so a last crumb with no link target is still focusable and still not a link.',
    rtlRule: '.p-breadcrumb-separator-icon:dir(rtl) { transform: rotate(180deg); }',
    ariaHomeValue: "'Home'",
    ariaHomeWhen: 'Only when home has no visible label and no homeAriaLabel was passed',
  };

  readonly anatomySnippet: string = `<nav class="p-breadcrumb p-component" aria-label="…">   <!-- the component root IS the landmark -->
  <ol class="p-breadcrumb-list">
    <li class="p-breadcrumb-home-item">          <!-- only when [home] is set -->
      <a class="p-breadcrumb-item-link" tabindex="0" aria-label="…">
        <span class="p-breadcrumb-item-icon"></span>
      </a>
    </li>
    <li class="p-breadcrumb-separator" aria-hidden="true">…</li>
    <li class="p-breadcrumb-item">
      <a class="p-breadcrumb-item-link" href="…" tabindex="0">
        <span class="p-breadcrumb-item-label">Catalog</span>
      </a>
    </li>
    <li class="p-breadcrumb-separator" aria-hidden="true">…</li>
    <li class="p-breadcrumb-item">
      <a class="p-breadcrumb-item-link" tabindex="-1" aria-current="page">
        <span class="p-breadcrumb-item-label">Breadcrumb</span>
      </a>
    </li>
  </ol>
</nav>`;

  readonly wiringSnippet: string = `import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb';
import { MenuItem } from '@openng/optimus-ui/api';

@Component({ imports: [BreadcrumbModule], /* … */ })
export class ProductPage {
  // A computed, so a language switch produces a NEW array for the plain @Input().
  readonly crumbs = computed<MenuItem[]>(() => [
    { label: this.t('nav.catalog'), routerLink: '/catalog' },
    { label: this.t('nav.tools'), routerLink: '/catalog/tools' },
    { label: this.product().name, tabindex: '-1' },   // current page: inert
  ]);
}`;

  readonly ptSnippet: string = `<!-- There is no [ariaLabel] on p-breadcrumb. This is the input-level naming route. -->
<p-breadcrumb
  [model]="crumbs()"
  [pt]="{ root: { 'aria-label': labels().breadcrumbNav } }">
</p-breadcrumb>

<!-- And NOT this — the component root is already a nav: -->
<!-- <nav aria-label="breadcrumb"><p-breadcrumb …/></nav> -->`;

  readonly currentSnippet: string = `// openng-optimus-ui-breadcrumb.mjs:190-200 — the last VISIBLE item wins.
isCurrentPage(index) {
    if (!this.model) { return false; }
    for (let i = this.model.length - 1; i >= 0; i--) {
        if (this.model[i]?.visible !== false) { return i === index; }
    }
    return false;
}

// :316  plain anchor   [attr.aria-current]="isCurrentPage(i) ? 'page' : undefined"
// :355  router anchor  [ariaCurrentWhenActive]="isCurrentPage(i) ? 'page' : undefined"`;

  readonly focusRuleSnippet: string = `/* Aura: the item ring, pointed at the global 1px focus.ring. */
.p-breadcrumb-item-link:focus-visible {
    outline: dt('breadcrumb.item.focus.ring.width') dt('breadcrumb.item.focus.ring.style') dt('breadcrumb.item.focus.ring.color');
    outline-offset: dt('breadcrumb.item.focus.ring.offset');
}

/* The kit (src/styles.scss, one entry of the one ring list) wins with !important: */
.p-breadcrumb-item-link:focus-visible {
    outline: 2px solid var(--primary-color-fg) !important;
    outline-offset: 2px !important;
}`;

  readonly i18nSnippet: string = `// translate() reads the service's translationsVersion signal, so this computed()
// re-runs on a language switch — and the new array is what the plain @Input() needs.
readonly crumbs = computed<MenuItem[]>(() => [
  { label: this.i18n.translate('nav.catalog'), routerLink: '/catalog' },
  { label: this.i18n.translate('nav.tools'), tabindex: '-1' },
]);

readonly homeLabel = computed(() => this.i18n.translate('nav.home'));
// There is no instant() on this service; translate() is the only reader.`;
}
