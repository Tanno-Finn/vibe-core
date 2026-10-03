import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DrawerModule } from '@openng/optimus-ui/drawer';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { FocusReturn } from '../../../utils/focus-return';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Drawer — p-drawer (SPEC N5, Guides).
 *
 * Renders through app-guide-shell and projects each tab body as an appGuideTab
 * template. Its subject is the edge-anchored panel: the container you reach for
 * when a side task needs room but the page behind must stay where it is. The
 * "should this interrupt at all" argument belongs to the Dialog guide and is
 * only cross-referenced here.
 *
 * VERIFIED CLAIMS (read from the shipped source of Optimus UI 2.0.2, or measured
 * in the browser; provenance is carried in the tabs):
 *   - The panel is a LANDMARK, not a dialog: role="complementary" is a static
 *     attribute on the container (openng-optimus-ui-drawer.mjs:581) and there is no
 *     aria-modal and no ariaLabel/ariaLabelledBy input anywhere in the
 *     component. The only naming input is ariaCloseLabel (:226), which is
 *     forwarded to the close button's [ariaLabel] (:602).
 *   - Two of the four APG modal clauses are missing. pFocusTrap sits on the
 *     container (:583), but FocusTrap only prepends/appends two hidden
 *     sentinel spans (openng-optimus-ui-focustrap.mjs:47-66) — it never moves focus in,
 *     and Drawer has no focus() of its own, so opening leaves focus on the
 *     trigger. Nothing records or restores the opener either; the kit's answer
 *     is FocusReturn in src/app/utils/focus-return.ts.
 *   - Escape has TWO independent paths and they do different things. The
 *     document listener (bound at :490-491, body :511-520) runs only when
 *     closeOnEscape is true and calls close(), which emits visibleChange and
 *     onHide. The container's own (keydown) handler (:406-410) is NOT gated on closeOnEscape and calls
 *     hide(false), which tears the mask down without emitting anything.
 *   - modal is the master switch. enableModality() runs only under `if
 *     (this.modal)` (:416-418), and the mask click listener (:448-454) and
 *     blockBodyScroll() (:456-458) both live inside enableModality() (:436) — so dismissible and
 *     blockScroll are dead with [modal]="false".
 *   - The mask's removal is driven by a bare animationend listener with no
 *     timeout fallback (:472), while the container's leave goes through
 *     @openng/optimus-ui-motion, which resolves immediately when no animation is
 *     registered and additionally arms a timeout. Suppressing animations with
 *     `animation: none` therefore strands the mask; the kit's reduced-motion
 *     catch-all in styles.scss uses 0.01ms instead, and says why.
 *   - Under prefers-reduced-motion the motion layer skips the transition
 *     entirely (shouldSkipMotion in @openng/optimus-ui-motion/dist/index.mjs, safe
 *     defaults to true), so no p-drawer-enter-* class is ever applied.
 *   - Aura gives drawer.root only background/borderColor/color/shadow — there
 *     is no border-radius token, so the panel has square corners by design,
 *     and overlay.modal.borderRadius (used by p-dialog) does not reach it.
 *   - Positions are physical: .p-drawer-left pins left: 0 and the keyframes
 *     translate -100% on X, so left/right do not mirror in an RTL document
 *     even though the borders use logical properties.
 *
 * The sentinel binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-drawer-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    DrawerModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'drawer'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A drawer is a panel pinned to one edge of the viewport. It exists for the case a dialog handles badly: a side
          surface — navigation, filters, a detail view — that wants a lot of room while the page behind stays exactly
          where it was. Everything below is live, including the focus instrument, which is the part the library leaves
          to you.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Drawer playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-pos-label">position</span>
                <p-select
                  [ariaLabelledBy]="'pg-pos-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgPosition()"
                  (ngModelChange)="pgPosition.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-modal">modal <span class="pg__aside">(mask; gates the two below)</span></label>
                <p-toggleswitch inputId="pg-modal" [ngModel]="pgModal()" (ngModelChange)="pgModal.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-dismissible">dismissible <span class="pg__aside">(click the mask)</span></label>
                <p-toggleswitch
                  inputId="pg-dismissible"
                  [ngModel]="pgDismissible()"
                  (ngModelChange)="pgDismissible.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-escape">closeOnEscape</label>
                <p-toggleswitch inputId="pg-escape" [ngModel]="pgEscape()" (ngModelChange)="pgEscape.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-closable">closable <span class="pg__aside">(the header button)</span></label>
                <p-toggleswitch
                  inputId="pg-closable"
                  [ngModel]="pgClosable()"
                  (ngModelChange)="pgClosable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-blockscroll">blockScroll</label>
                <p-toggleswitch
                  inputId="pg-blockscroll"
                  [ngModel]="pgBlockScroll()"
                  (ngModelChange)="pgBlockScroll.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-sem-label">semantics via <code>pt</code></span>
                <p-select
                  [ariaLabelledBy]="'pg-sem-label'"
                  size="small"
                  [options]="semanticsOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSemantics()"
                  (ngModelChange)="pgSemantics.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <p-button [label]="'Open drawer'" size="small" (onClick)="openPlayground()" />
                <p class="pg__hint">{{ pgHint() }}</p>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>

          <p-drawer
            [visible]="pgVisible()"
            (visibleChange)="pgVisible.set($event)"
            [position]="pgPosition()"
            [header]="'Playground drawer'"
            [modal]="pgModal()"
            [dismissible]="pgDismissible()"
            [closeOnEscape]="pgEscape()"
            [closable]="pgClosable()"
            [blockScroll]="pgBlockScroll()"
            [ariaCloseLabel]="'Close the playground drawer'"
            [pt]="pgPt()"
            appendTo="body"
            [style]="pgSize()"
            (onHide)="onPlaygroundHide()"
          >
            <p>
              Whatever you switched on is in effect here. With <code>closable</code> off there is no header button, so
              the only ways out are Escape and — if it is on — the mask.
            </p>
            <p-button [label]="'Close'" size="small" severity="secondary" (onClick)="pgVisible.set(false)" />
          </p-drawer>
        </section>

        <!-- Focus instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">What focus does when a drawer opens and closes</h3>
          </div>
          <p class="ex__note">
            Open each one <strong>with the keyboard</strong> (Tab to the button, then Enter) and read the journal. The
            left one is the library as shipped: focus stays on the trigger, outside the panel that just appeared, and
            the next Tab presses walk the page behind the mask rather than entering the drawer. The focus trap only
            holds once focus is <em>inside</em>; getting it there, and giving it back afterwards, is the two lines on
            the right.
          </p>
          <div class="ex__stage">
            <div class="fj">
              <div class="fj__col">
                <span class="row__tag">Library defaults</span>
                <p-button [label]="'Open unwired'" size="small" severity="secondary" (onClick)="openFocusDemo(false)" />
                <ul class="fj__journal">
                  <li><strong>before open:</strong> {{ fjBare().before }}</li>
                  <li><strong>after open:</strong> {{ fjBare().opened }}</li>
                  <li><strong>after close:</strong> {{ fjBare().closed }}</li>
                </ul>
              </div>
              <div class="fj__col">
                <span class="row__tag">Focus moved in, focus returned</span>
                <p-button [label]="'Open wired'" size="small" (onClick)="openFocusDemo(true)" />
                <ul class="fj__journal">
                  <li><strong>before open:</strong> {{ fjWired().before }}</li>
                  <li><strong>after open:</strong> {{ fjWired().opened }}</li>
                  <li><strong>after close:</strong> {{ fjWired().closed }}</li>
                </ul>
              </div>
            </div>
          </div>
          <p class="src-note">
            Reproduce it in your own build without this page: open a drawer and read
            <code>document.activeElement</code> in the console, then close it and read again. Both readings must name
            the trigger.
          </p>
          <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

          <p-drawer
            [visible]="fjVisibleBare()"
            (visibleChange)="fjVisibleBare.set($event)"
            position="right"
            [header]="'Unwired drawer'"
            appendTo="body"
            [ariaCloseLabel]="'Close'"
            [style]="{ width: 'min(26rem, 100vw)' }"
            (onHide)="afterFocusDemo(false)"
          >
            <p>Nothing here received focus when the panel opened.</p>
            <p-button [label]="'A control'" size="small" severity="secondary" />
          </p-drawer>

          <p-drawer
            [visible]="fjVisibleWired()"
            (visibleChange)="fjVisibleWired.set($event)"
            position="right"
            [header]="'Wired drawer'"
            appendTo="body"
            [ariaCloseLabel]="'Close'"
            [style]="{ width: 'min(26rem, 100vw)' }"
            (onShow)="focusFirstControl()"
            (onHide)="afterFocusDemo(true)"
          >
            <p>The first control was focused on <code>(onShow)</code>.</p>
            <p-button [label]="'A control'" size="small" severity="secondary" styleClass="fj-first" />
          </p-drawer>
        </section>

        <!-- Navigation drawer -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Navigation, on the side it came from</h3>
            <button type="button" class="copy-btn" (click)="copy('nav', navSnippet)">
              {{ copiedId() === 'nav' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The classic use: a menu that lives off-canvas on small viewports. It is anchored left because that is the
            edge its trigger sits on, and the list is a real
            <code>&lt;nav&gt;</code> with its own name — the panel's own landmark is unnamed until you name it.
          </p>
          <div class="ex__stage">
            <p-button [label]="'Open menu'" icon="pi pi-bars" size="small" (onClick)="navVisible.set(true)" />
          </div>
          <pre class="code-block"><code>{{ navSnippet }}</code></pre>

          <p-drawer
            [visible]="navVisible()"
            (visibleChange)="navVisible.set($event)"
            position="left"
            [header]="'Menu'"
            appendTo="body"
            [ariaCloseLabel]="'Close the menu'"
          >
            <nav aria-label="Guide sections" class="navdemo">
              <ul>
                <li><a href="#" (click)="$event.preventDefault()">Overview</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Components</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Foundations</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Changelog</a></li>
              </ul>
            </nav>
          </p-drawer>
        </section>

        <!-- Detail drawer with a footer -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">A detail panel with a sticky footer</h3>
            <button type="button" class="copy-btn" (click)="copy('detail', detailSnippet)">
              {{ copiedId() === 'detail' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The right edge is the convention for "more about the thing I just clicked", and it is the one position where
            a width override is mandatory: the shipped 20rem is a menu width, not a reading width. The footer is a
            projected template, so it sits outside the scrolling content and its buttons stay reachable.
          </p>
          <div class="ex__stage">
            <p-button [label]="'Show details'" size="small" (onClick)="detailVisible.set(true)" />
          </div>
          <pre class="code-block"><code>{{ detailSnippet }}</code></pre>

          <p-drawer
            [visible]="detailVisible()"
            (visibleChange)="detailVisible.set($event)"
            position="right"
            [header]="'Sparrow, house'"
            appendTo="body"
            [ariaCloseLabel]="'Close the details'"
            [style]="{ width: 'min(34rem, 100vw)' }"
          >
            <p>
              Long content scrolls inside <code>.p-drawer-content</code>, which is the flex child with
              <code>overflow-y: auto</code>. The header and the footer do not scroll with it.
            </p>
            <p>
              Repeat that thought a few times and you have a realistic panel. The point is that the two chrome rows stay
              put while this paragraph moves.
            </p>
            <p>
              Repeat that thought a few times and you have a realistic panel. The point is that the two chrome rows stay
              put while this paragraph moves.
            </p>
            <p>
              Repeat that thought a few times and you have a realistic panel. The point is that the two chrome rows stay
              put while this paragraph moves.
            </p>
            <ng-template #footer>
              <div class="drawer-footer">
                <p-button
                  [label]="'Cancel'"
                  size="small"
                  severity="secondary"
                  [text]="true"
                  (onClick)="detailVisible.set(false)"
                />
                <p-button [label]="'Save'" size="small" (onClick)="detailVisible.set(false)" />
              </div>
            </ng-template>
          </p-drawer>
        </section>

        <!-- Bottom sheet -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Bottom edge: the sheet, and the height you have to set</h3>
            <button type="button" class="copy-btn" (click)="copy('sheet', sheetSnippet)">
              {{ copiedId() === 'sheet' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            <code>position="bottom"</code> ships at a fixed 10rem tall, which fits a confirmation row and nothing else.
            Anything real needs an explicit height — and a cap, so a long list does not become a full-screen panel that
            only looks like a sheet.
          </p>
          <div class="ex__stage">
            <p-button
              [label]="'Open filters'"
              icon="pi pi-filter"
              size="small"
              severity="secondary"
              (onClick)="sheetVisible.set(true)"
            />
          </div>
          <pre class="code-block"><code>{{ sheetSnippet }}</code></pre>

          <p-drawer
            [visible]="sheetVisible()"
            (visibleChange)="sheetVisible.set($event)"
            position="bottom"
            [header]="'Filters'"
            appendTo="body"
            [ariaCloseLabel]="'Close the filters'"
            [style]="{ height: 'min(22rem, 80vh)' }"
          >
            <p>Height set explicitly; the default would have clipped this paragraph.</p>
            <p-button [label]="'Apply'" size="small" (onClick)="sheetVisible.set(false)" />
          </p-drawer>
        </section>

        <!-- Headless -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Headless: your chrome, and then the naming is yours too</h3>
            <button type="button" class="copy-btn" (click)="copy('headless', headlessSnippet)">
              {{ copiedId() === 'headless' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The <code>headless</code> template replaces everything inside the panel: no header row, no close button, no
            content wrapper — and therefore no padding and no scroll container. It is the right choice when the panel's
            chrome is part of your design, and the wrong one if you were only trying to restyle the header.
          </p>
          <div class="ex__stage">
            <p-button
              [label]="'Open headless'"
              size="small"
              severity="secondary"
              (onClick)="headlessVisible.set(true)"
            />
          </div>
          <pre class="code-block"><code>{{ headlessSnippet }}</code></pre>

          <p-drawer
            [visible]="headlessVisible()"
            (visibleChange)="headlessVisible.set($event)"
            position="right"
            appendTo="body"
            [style]="{ width: 'min(24rem, 100vw)' }"
          >
            <ng-template #headless>
              <div class="headless">
                <div class="headless__bar">
                  <h2 class="headless__title">Own chrome</h2>
                  <p-button
                    icon="pi pi-times"
                    size="small"
                    [rounded]="true"
                    [text]="true"
                    severity="secondary"
                    [ariaLabel]="'Close'"
                    (onClick)="headlessVisible.set(false)"
                  />
                </div>
                <div class="headless__body">
                  <p>
                    Everything in here — including the padding and the fact that this area scrolls — is markup you
                    wrote.
                  </p>
                </div>
              </div>
            </ng-template>
          </p-drawer>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Is a drawer the right container at all?</h3>
        <p>
          A drawer answers one question well:
          <em>where does a large side surface go when the page behind it must stay put?</em> If that is not the
          question, one of its neighbors fits better. The table is ordered by how often each one is the real answer.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Container</th>
                <th>It is the answer when…</th>
                <th>What it is to a screen reader</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>an inline <code>&lt;section&gt;</code></td>
                <td>the content is part of the page and has room. The first answer, always.</td>
                <td>whatever you write</td>
              </tr>
              <tr>
                <td>a route</td>
                <td>it is linkable, reloadable, back-button-able, or long enough to be a page.</td>
                <td>a page</td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>
                  a wide side surface — nav, filters, a detail view — anchored to an edge, with the page behind still
                  visible.
                </td>
                <td>a <code>complementary</code> landmark, unnamed until you name it</td>
              </tr>
              <tr>
                <td><code>p-dialog</code></td>
                <td>
                  a self-contained sub-task that must block until it is finished, centered on the page. See the Dialog
                  guide.
                </td>
                <td><code>dialog</code>, with a literal <code>aria-modal="true"</code></td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>
                  a small transient panel anchored <em>to its trigger</em> — a menu, a filter pair, a definition. See
                  the Popover guide.
                </td>
                <td><code>dialog</code>, <code>aria-modal</code> while open</td>
              </tr>
              <tr>
                <td><code>p-confirmdialog</code></td>
                <td>"are you sure?" and nothing more.</td>
                <td><code>alertdialog</code></td>
              </tr>
              <tr>
                <td><code>p-menubar</code>, or a <code>&lt;nav&gt;</code> in the layout</td>
                <td>
                  primary navigation. A drawer is where that navigation <em>hides</em> on a narrow viewport, not where
                  it lives.
                </td>
                <td>a menu widget / a <code>navigation</code> landmark</td>
              </tr>
              <tr>
                <td><code>p-tabs</code> or an accordion</td>
                <td>you were reaching for a drawer to hold parallel views of the same subject.</td>
                <td>tablist / disclosure buttons</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The identities in the last column are read from each component's shipped template in Optimus UI 2.0.2 —
          <code>role="complementary"</code> for the drawer (<code>openng-optimus-ui-drawer.mjs:581</code>),
          <code>role="dialog"</code> plus <code>[attr.aria-modal]</code> for the popover
          (<code>openng-optimus-ui-popover.mjs:418-419</code>). They matter for the choice, because two containers that look alike on
          screen can be a landmark and a modal to a screen reader.
        </p>

        <h3>The drawer/dialog line, in one sentence each</h3>
        <ul>
          <li>
            <strong>Drawer</strong> — the page keeps its context and you need width or height: filters beside results, a
            record beside its list, navigation on mobile.
          </li>
          <li>
            <strong>Dialog</strong> — the page must wait, and the task is small enough to be centered: rename, confirm,
            one short form. Its <code>aria-modal="true"</code> is a literal, which the Dialog guide treats as a defect
            in its own right; what it does come with is the focus-in the drawer has no equivalent for.
          </li>
          <li>
            <strong>Both feel modal by default</strong> (mask on, Escape on, click-outside on), which is why the choice
            has to be made on the content, not on the behavior. The behavior is configurable in both; the shape and
            the reading order are not.
          </li>
        </ul>

        <h3>Which edge?</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th><code>position</code></th>
                <th>Shipped size</th>
                <th>Use it for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>left</code> (default)</td>
                <td>20rem wide, full height</td>
                <td>
                  navigation, and anything whose trigger is in a left-hand rail. The edge should match the trigger.
                </td>
              </tr>
              <tr>
                <td><code>right</code></td>
                <td>20rem wide, full height</td>
                <td>detail and inspector panels — the thing you clicked stays on the left. Widen it.</td>
              </tr>
              <tr>
                <td><code>top</code></td>
                <td>10rem tall, full width</td>
                <td>search and global notices. Rare: it covers the header the user was just using.</td>
              </tr>
              <tr>
                <td><code>bottom</code></td>
                <td>10rem tall, full width</td>
                <td>the mobile sheet — filters, sort, a share row. Set a height.</td>
              </tr>
              <tr>
                <td><code>full</code></td>
                <td>the whole viewport</td>
                <td>a mobile takeover. At that size, ask whether it should have been a route.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Sizes are the shipped defaults for the position classes; the Design tab has them as measured pixels together
          with the token they come from. There are two routes to a full-screen panel — <code>position="full"</code> and
          <code>[fullScreen]="true"</code> — and they are not the same thing; the Development tab has the difference.
        </p>

        <h3>House style</h3>
        <ul>
          <li>
            <strong>Set a width; never ship the default 20rem for content.</strong> The convention is a
            viewport-relative width with a cap: <code>[style]="&#123; width: 'min(34rem, 100vw)' &#125;"</code>. This
            kit's own detail drawer — the catalog page's entry panel in <code>catalog.component.ts</code> — is the
            reference implementation of that pattern.
          </li>
          <li>
            <strong><code>appendTo="body"</code>.</strong> The default is <code>'self'</code>, which leaves a
            <code>position: fixed</code> panel inside your component tree, where any ancestor with a
            <code>transform</code>, <code>filter</code> or <code>contain</code> reframes it. The mask is appended to
            <code>&lt;body&gt;</code> either way, so with the default the two halves of the overlay live in different
            stacking contexts.
          </li>
          <li>
            <strong>Name the panel.</strong> A <code>complementary</code> landmark with no accessible name is announced
            as "complementary" and nothing else. Either name the landmark through <code>pt</code>, or put a named region
            inside the panel — a <code>&lt;nav aria-label&gt;</code>, a heading — and treat the drawer as a wrapper.
          </li>
          <li>
            <strong>Set <code>ariaCloseLabel</code> whenever the header button is rendered.</strong> It has no default
            and no fallback.
          </li>
          <li>
            <strong>Wire focus in and focus back.</strong> Non-negotiable for a modal drawer, and good manners for a
            non-modal one. Details and code in Development.
          </li>
          <li>
            <strong>One drawer at a time.</strong> Two open drawers layer correctly, but they do not dismiss
            independently: one Escape closes <em>both</em>, because the condition the document listener checks passes
            for every open drawer. A panel over a panel has no back affordance either. Keep it to one.
          </li>
        </ul>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              A modal drawer with <code>[closable]="false"</code>, no focus wiring and no visible close control, on the
              assumption that the mask is enough. On a touch device the mask is a thin strip; with the keyboard, focus
              never entered the panel in the first place.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Leave the header button on, give it <code>ariaCloseLabel</code>, and add a real button in the footer for
              the primary way out. Escape and the mask are shortcuts, not the interface.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              A drawer holding a form whose submit button is at the bottom of the scrolling content. On a short viewport
              the action is below the fold of a panel that is already a scroll container inside a scroll container.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Project the actions as the <code>footer</code> template. It is a sibling of the content, not part of it,
              so it stays visible while the content scrolls.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              A drawer for a record that people will want to link to, reload, or reach with the back button. It has no
              URL, and Escape discards it with no trace.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Make it a route, and keep the drawer for the transient side surfaces around it. If you need both, drive
              <code>visible</code> from a query parameter.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              <code>[modal]="false"</code> with <code>[dismissible]="true"</code> and <code>[blockScroll]="true"</code>,
              expecting a light panel that still closes on an outside click and pins the page.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Decide first: modal (mask, dismissible, scroll lock all available) or non-modal (none of them — you own
              the outside-click handling). Both flags live inside the
              <code>modal</code> branch.
            </p>
          </div>
        </div>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — the four clauses a modal surface owes the user: a dialog role, an accessible name, focus moved in, focus
            returned. A modal drawer is judged against exactly this, and the Development tab measures which clauses the
            component keeps.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#complementary" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>complementary</code> role</a
            >
            — normative: what the role the drawer actually ships means (a supporting section of the page), and that a
            landmark is only useful once it has a name.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — why the attribute is a promise about the rest of the page being inert, and therefore why adding it to a
            drawer by hand is not a free upgrade.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — the criterion the missing focus return fails, in both directions: entering the panel and leaving it.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.2 No Keyboard Trap</a
            >
            — the reason <code>[closeOnEscape]="false"</code> plus an active focus trap needs a second, visible way out.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — the media feature behind the drawer's most surprising failure mode: how you suppress the 0.5s slide
            decides whether the mask is ever removed.
          </li>
          <li>
            <a href="https://primeng.org/drawer" target="_blank" rel="noopener noreferrer"> PrimeNG 21 — Drawer</a>
            — the vendor API surface Optimus forks. Verified here against the shipped source of Optimus UI 2.0.2, which
            is where the two deprecated inputs and the one that no longer does anything show up.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <ul>
          <li>
            <strong>Mask</strong> — a bare <code>&lt;div class="p-drawer-mask p-overlay-mask"&gt;</code> created
            imperatively and appended to <code>&lt;body&gt;</code>, <em>not</em> a parent of the panel. Fixed, full
            viewport, <code>z-index</code> one below the panel's.
          </li>
          <li>
            <strong>Panel</strong> — <code>.p-drawer.p-component.p-drawer-&lt;position&gt;</code>:
            <code>position: fixed</code>, <code>display: flex</code>, column direction, background and border and shadow
            from tokens, and <strong>no border-radius</strong> — Aura gives the drawer no radius token, so the corners
            are square on purpose. The kit's visual styles add one rule of their own: every
            <code>html.style-&lt;name&gt;</code> block in <code>styles.scss</code> outlines the edge that faces the
            page in <code>--style-outline</code> (1–3px by style), per position with logical sides — the inline end
            of a <code>left</code> drawer, the inline start of a <code>right</code> one, the block end / start of
            <code>top</code> / <code>bottom</code>.
          </li>
          <li>
            <strong>Header</strong> — <code>.p-drawer-header</code>, a flex row with <code>space-between</code> and
            <code>flex-shrink: 0</code>, holding the optional header template, the <code>.p-drawer-title</code> div, and
            the close button.
          </li>
          <li>
            <strong>Title</strong> — <code>.p-drawer-title</code> is a <code>&lt;div&gt;</code>, not a heading. It
            carries the title font tokens and no document structure.
          </li>
          <li>
            <strong>Content</strong> — <code>.p-drawer-content</code>: <code>flex-grow: 1</code> and
            <code>overflow-y: auto</code>. This is the scroll container, and the reason actions belong in the footer.
          </li>
          <li>
            <strong>Footer</strong> — <code>.p-drawer-footer</code>, rendered only when a footer template is projected.
          </li>
          <li>
            Sections carry <code>data-pc-section</code> (<code>header</code>, <code>content</code>, <code>footer</code>,
            <code>closeicon</code>) — the stable hooks for tests and for <code>pt</code>.
          </li>
        </ul>

        <h3>Token chain</h3>
        <p>
          Every drawer surface token is an alias of the shared <code>overlay.modal.*</code> group, so a drawer and a
          dialog are the same material by construction. Preset values from
          <code>&#64;openng/optimus-ui-themes/dist/aura/drawer/index.mjs</code> and the <code>overlay.modal</code> group in
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>; the last two columns are computed style on the
          rendered panel.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CSS variable</th>
                <th>Aura alias</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.varName) {
                <tr>
                  <td>
                    <code>{{ row.varName }}</code>
                  </td>
                  <td>{{ row.alias }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ tokenNote }}</p>

        <h3>Contrast</h3>
        <p>
          Measured against the panel's own painted background, not the page behind it — the drawer is an opaque surface,
          so what is behind the mask never participates.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light</th>
                <th>Dark</th>
                <th>Floor</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.pair) {
                <tr>
                  <td>{{ row.pair }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                  <td>{{ row.floor }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometry</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Value</th>
                <th>Where it comes from</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                  <td>{{ row.origin }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ geometryNote }}</p>

        <h3>The focus ring</h3>
        <p>{{ focusRingNote }}</p>

        <h3>Motion, and the one place it is not cosmetic</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animation</th>
                <th>Default</th>
                <th>Under <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              @for (row of motionRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.normal }}</td>
                  <td>{{ row.reduced }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          The panel's slide is decorative. <strong>The mask's fade is load-bearing:</strong> the component removes the
          mask from the DOM in an <code>animationend</code> handler with no timeout behind it. Kill that animation and
          the handler never fires. Measured with <code>animation: none</code> in force on the leave class: after closing
          the drawer the mask stays in <code>&lt;body&gt;</code>, full viewport, <code>pointer-events: auto</code>, and
          still returned by <code>elementFromPoint</code> at the center of the screen — clicks land on it, not on the
          page. That is a page nobody can use again. The panel itself is safe: its leave runs through
          <code>&#64;openng/optimus-ui-motion</code>, which resolves immediately when it finds no animation registered and arms a
          timeout on top of that.
        </p>
        <p>
          Honoring the preference properly is fine, and better than the default: under
          <code>reduce</code> the motion layer skips the panel transition outright — no
          <code>p-drawer-enter-*</code> class is ever applied — the kit's global rule shortens the mask's fade to 0.01
          ms, both animations still end, and the panel is removed from the DOM entirely instead of being parked at
          <code>display: none</code>.
        </p>
        <p class="src-note">
          This is why a reduced-motion rule must shorten animations rather than remove them, the way the global block in
          <code>styles.scss</code> does. Verify it in your own build: emulate
          <code>prefers-reduced-motion: reduce</code>, close a modal drawer, and count the
          <code>.p-drawer-mask</code> elements left in the document. The answer must be zero.
        </p>

        <h3>Restyling it</h3>
        <ul>
          <li>
            Scope the drawer tokens on a <code>styleClass</code>, e.g.
            <code>.inspector-panel &#123; --p-drawer-content-padding: 0; &#125;</code> for a panel whose content draws
            its own edges. The class lands on the panel element itself.
          </li>
          <li>
            Width and height belong in <code>[style]</code>, not in a token — the position classes set them as plain
            CSS, and an inline style is the only thing that beats them without a specificity fight.
          </li>
          <li>
            Set <code>border-width</code> deliberately. The base <code>.p-drawer</code> rule declares
            <code>border-style: solid</code> and a border color but <strong>no width</strong>, and each position class
            adds exactly one 1px logical edge — so three edges fall back to the CSS initial <code>medium</code> (3px).
            <code>.p-drawer-full</code> is the only library rule that sets all four to 1px. On top of that, each
            visual style's block outlines the page-facing edge in <code>--style-outline</code>, per position, so a
            <code>left</code> and a <code>right</code> drawer both get the outline where the page is; the three screen
            edges keep the library's <code>medium</code> width, which a <code>styleClass</code> can set to 0.
          </li>
          <li>
            The mask takes <code>maskStyle</code> as an object, serialized into an inline <code>style</code> attribute;
            there is no mask class input. Do <em>not</em> put the background there: the shared overlay rule and both of
            its keyframes read <code>var(--px-mask-background, …)</code>, so an animation that is still running — or has
            finished <code>forwards</code> — overrides your inline value. Set <code>--px-mask-background</code> instead
            and the rule and the keyframes agree.
          </li>
          <li>
            Anything reached with a descendant selector from outside needs <code>appendTo="body"</code> to be taken into
            account — the panel is not inside your component once it is appended, so <code>:host</code>-scoped styles do
            not reach it. The kit forbids <code>::ng-deep</code>; use a <code>styleClass</code> and a global rule.
          </li>
        </ul>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior: the position classes fix a left/right panel at 20rem and a top/bottom panel
          at 10rem at every viewport, with no breakpoint. On a 320px screen a stock left/right drawer is exactly as wide
          as the viewport, and the page it was meant to keep visible is gone. Give the panel a viewport-relative width
          with a cap — <code>[style]="&#123; width: 'min(34rem, 100vw)' &#125;"</code> — and accept that below the cap
          it becomes a full-screen sheet; if the page behind must stay readable on a phone, a drawer is the wrong
          container there.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing</strong> (gated in <code>docs/generated/CONTRAST.MD</code>, on the panel surface the drawer
          shares with the dialog): SC 1.4.3 for the panel text (10.35:1 light / 17.72:1 dark against a 4.5:1 floor), SC
          1.4.11 for the close-button icon (lowest 5.21:1) and for the kit focus ring against the panel (lowest
          5.18:1), SC 2.4.7 for that ring, and SC 2.5.8 for the close button at 40 x
          40px. <strong>Failing:</strong> SC 4.1.2 — the container is a static <code>complementary</code> landmark with
          no name input, measured in the tree as <code>complementary</code> with an empty name, and an unset
          <code>ariaCloseLabel</code> leaves the icon-only close button unnamed; and SC 2.4.3, since focus neither
          enters on open — it stays on the trigger while Tab walks the page behind the mask — nor returns to the opener
          on close. <strong>Conditional:</strong> SC 2.1.2 — once focus is inside it cycles and cannot leave, so the
          trap holds only while Escape works, and <code>[closeOnEscape]="false"</code> removes the mask while leaving
          the panel open, which needs a second, visible way out. <strong>AAA</strong> is not assessed for this
          component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>The API, with the defaults that matter</h3>
        <p>
          <code>DrawerModule</code> from <code>&#64;openng/optimus-ui/drawer</code>; the content is projected, and there
          is no service. Read from the shipped component in Optimus UI 2.0.2
          (<code>openng-optimus-ui-drawer.mjs</code>).
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code></td>
                <td>
                  Two-way, and <strong>not a signal</strong> — a plain getter/setter pair (:274-282) whose setter only
                  arms <code>modalVisible</code>. The motion system keeps the panel in the DOM
                  until the leave animation is over, and a closed panel <em>can</em> stay there at
                  <code>display: none</code> afterwards. Assert on <code>data-p-open</code> or the computed
                  <code>display</code>, never on the element's presence.
                </td>
              </tr>
              <tr>
                <td><code>position</code></td>
                <td><code>'left'</code></td>
                <td>
                  Signal input. <code>'left' | 'right' | 'top' | 'bottom'</code> — plus <code>'full'</code>, which the
                  class handles but the JSDoc does not list.
                </td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td>—</td>
                <td>Renders in a <code>&lt;div&gt;</code>, not a heading. See "Naming" below.</td>
              </tr>
              <tr>
                <td><code>modal</code></td>
                <td>
                  <strong><code>true</code></strong>
                </td>
                <td>
                  The master switch for the mask, and with it for <code>dismissible</code> and <code>blockScroll</code>.
                </td>
              </tr>
              <tr>
                <td><code>dismissible</code></td>
                <td><code>true</code></td>
                <td>Mask click closes. Read when the mask is created, i.e. at open.</td>
              </tr>
              <tr>
                <td><code>closeOnEscape</code></td>
                <td><code>true</code></td>
                <td>Governs the <em>document</em> Escape listener only. See "Escape" below.</td>
              </tr>
              <tr>
                <td><code>closable</code></td>
                <td><code>true</code></td>
                <td>
                  Renders the header close button — together with the deprecated <code>showCloseIcon</code>, which must
                  also be true.
                </td>
              </tr>
              <tr>
                <td><code>ariaCloseLabel</code></td>
                <td>—</td>
                <td>The component's only naming input, and it names the <em>button</em>.</td>
              </tr>
              <tr>
                <td><code>blockScroll</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>Locks body scroll — inside the <code>modal</code> branch.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>'self'</code></td>
                <td>Signal input, falling back to the global <code>overlayAppendTo</code>. Use <code>"body"</code>.</td>
              </tr>
              <tr>
                <td><code>fullScreen</code></td>
                <td><code>false</code></td>
                <td>Signal input. Not the same as <code>position="full"</code>; see below.</td>
              </tr>
              <tr>
                <td><code>maskStyle</code></td>
                <td>—</td>
                <td>An object, serialized to an inline style on the mask.</td>
              </tr>
              <tr>
                <td><code>closeButtonProps</code></td>
                <td><code>&#123; severity: 'secondary', text: true, rounded: true &#125;</code></td>
                <td>Passed straight to the inner <code>p-button</code>.</td>
              </tr>
              <tr>
                <td><code>style</code>, <code>styleClass</code></td>
                <td>—</td>
                <td>Both land on the panel element. Size lives here.</td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td>—</td>
                <td>Signal input, merged into the motion directive's options.</td>
              </tr>
              <tr>
                <td><code>autoZIndex</code>, <code>baseZIndex</code></td>
                <td><code>true</code>, <code>0</code></td>
                <td>Layering. Leave them alone unless you stack overlays from two libraries.</td>
              </tr>
              <tr>
                <td><code>showCloseIcon</code></td>
                <td><code>true</code></td>
                <td>
                  <strong>Deprecated</strong> in favor of <code>closable</code>. Still ANDed with it, so setting either
                  to false removes the button.
                </td>
              </tr>
              <tr>
                <td><code>transitionOptions</code></td>
                <td><code>'150ms cubic-bezier(0, 0, 0.2, 1)'</code></td>
                <td>
                  <strong>Still an input, and dead.</strong> Marked <code>&#64;deprecated since v21.0.0</code> (:263-268)
                  and read by nothing in the component — use <code>motionOptions</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Outputs: <code>visibleChange</code>, <code>onShow</code>, <code>onHide</code>. Templates:
          <code>#header</code>, <code>#footer</code>, <code>#content</code>, <code>#closeicon</code>,
          <code>#headless</code> — each also reachable as <code>pTemplate="…"</code>.
        </p>

        <h3>Escape closes twice, and only one of them tells you</h3>
        <p>
          There are two independent Escape paths, and they do different things. The
          <strong>document listener</strong> is bound on open, only when <code>closeOnEscape</code> is true, and it
          calls the component's <code>close()</code>: <code>visibleChange</code> and <code>onHide</code> are emitted and
          the panel leaves. The <strong>container's own <code>(keydown)</code> handler</strong> is gated on nothing at
          all and calls <code>hide(false)</code>, which suppresses <code>onHide</code>, never touches
          <code>visible</code>, and only dismantles the modality.
        </p>
        <p>
          With the defaults both fire and the second does the real work, so nothing looks wrong. Turn the flag off and
          the split becomes visible:
          <strong
            >with <code>[closeOnEscape]="false"</code> and focus inside the panel, Escape removes the mask and leaves
            the panel open</strong
          >
          — full size, still marked <code>data-p-open="true"</code>, now with the page behind it clickable again. Treat
          <code>closeOnEscape</code> as "Escape closes it properly", not as "Escape is disabled", and give a drawer that
          must stay open a second, visible way out.
        </p>
        <p>
          The document path has one more condition: it closes only if the panel's inline
          <code>z-index</code> equals what the layering utility reads back from that same attribute. With
          <code>[autoZIndex]="false"</code> nothing writes that inline value, the comparison fails, and Escape only
          removes the mask — the same end state as <code>[closeOnEscape]="false"</code>. Leave
          <code>autoZIndex</code> alone. The same self-referential comparison is why a second open drawer is not
          protected from the first drawer's Escape: it passes for every open panel.
        </p>
        <p class="src-note">
          Read from the component's source in Optimus UI 2.0.2 — the container handler and
          <code>hide(false)</code> at <code>openng-optimus-ui-drawer.mjs:406-410</code> versus
          <code>bindDocumentEscapeListener()</code> at <code>:511-520</code> and <code>close()</code> at
          <code>:430-435</code> — and confirmed in
          the browser for both states of the flag. Verify in your build by logging every close path from
          <code>(onHide)</code>: the paths that do not appear there are the ones that left the panel open.
        </p>

        <h3><code>modal</code> is the master switch</h3>
        <p>
          <code>enableModality()</code> is called from <code>show()</code> only when <code>modal</code> is true, and
          everything the overlay does to the rest of the page lives inside it: creating the mask, attaching the mask
          click listener when <code>dismissible</code> is set, and locking body scroll when <code>blockScroll</code> is
          set. So <code>[modal]="false"</code> silently disables both of those flags. There is one ordering detail on
          top: the click listener is attached when the mask is <em>created</em>, so switching
          <code>dismissible</code> from false to true while a drawer is open has no effect until the next open.
        </p>

        <h3>Two ways to fill the screen, and they differ</h3>
        <ul>
          <li>
            <code>position="full"</code> — the position class becomes <code>p-drawer-full</code>, so the panel goes 100%
            × 100% with <code>transition: none</code>, and the enter animation is the scale-and-fade
            <code>p-drawer-enter-full</code>. The <em>mask</em> keeps its ordinary classes.
          </li>
          <li>
            <code>[fullScreen]="true"</code> — adds <code>p-drawer-full</code> to the panel <em>and</em> to the mask,
            while the position class stays whatever <code>position</code> says. The panel therefore carries two size
            rules and the later one in the stylesheet wins.
          </li>
        </ul>
        <p>
          Pick one and stay with it. <code>position="full"</code> is the honest spelling for "this panel is the whole
          viewport"; <code>fullScreen</code> reads like a modifier of a positioned drawer and is the one that produces a
          class collision. Note also that the <code>fullScreen</code> input's own JSDoc in the shipped source describes
          a close icon — a copy-paste artifact, not a second behavior.
        </p>

        <h3>Naming, and what a screen reader actually gets</h3>
        <p>
          The panel is a <code>complementary</code> landmark with a static role and no <code>aria-modal</code>. There is
          no <code>ariaLabel</code> and no <code>ariaLabelledBy</code> input; <code>header</code> renders into a
          <code>&lt;div class="p-drawer-title"&gt;</code> that nothing points at. An unnamed landmark is announced by
          its role alone.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Markup</th>
                <th>Accessibility-tree node</th>
              </tr>
            </thead>
            <tbody>
              @for (row of axRows; track row.markup) {
                <tr>
                  <td>{{ row.markup }}</td>
                  <td>{{ row.node }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ axNote }}</p>
        <p>Two ways to fix it, and the choice depends on whether the drawer blocks:</p>
        <ul>
          <li>
            <strong>Non-modal side panel</strong> — keep <code>complementary</code> and give it a name through the
            pass-through API, or name a region <em>inside</em> the panel (a <code>&lt;nav aria-label&gt;</code>, an
            <code>&lt;h2&gt;</code>) and let the landmark stay generic. The second option needs no library knowledge and
            is the safer default.
          </li>
          <li>
            <strong>Modal drawer</strong> — a blocking surface should be a <code>dialog</code>. Override the role and
            add the name on the same pass-through route. Do <em>not</em> add <code>aria-modal="true"</code> as well
            unless you also make the rest of the page inert: the attribute promises that the outside is unreachable, and
            neither the drawer nor its mask sets <code>inert</code> or <code>aria-hidden</code> on anything.
          </li>
        </ul>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          The pass-through route is <code>pt.root</code> because the container is bound with
          <code>[pBind]="ptm('root')"</code>; the attributes it sets are applied after the template's static ones, which
          is what lets it override <code>role</code>. The header, content, footer, and close button are
          <code>pt.header</code>, <code>pt.content</code>, <code>pt.footer</code> and <code>pt.pcCloseButton</code>.
          Verify the result in the browser's accessibility tree, not in the DOM inspector.
        </p>

        <h3>Focus: what the library does, and the two things it does not</h3>
        <p>
          APG's modal contract has four clauses. The drawer keeps one and a half, and this is the whole reason the
          Examples tab has a focus instrument.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Clause</th>
                <th>Status in Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The surface has a dialog role</td>
                <td><strong>No</strong> — <code>complementary</code>, hard-coded.</td>
              </tr>
              <tr>
                <td>It has an accessible name</td>
                <td><strong>Not by default</strong> — no naming input for the panel.</td>
              </tr>
              <tr>
                <td>Focus moves into it on open</td>
                <td>
                  <strong>No</strong> — <code>pFocusTrap</code> only installs two hidden sentinel spans, and the
                  component never calls <code>focus()</code>. Focus stays on the trigger.
                </td>
              </tr>
              <tr>
                <td>Focus cycles inside while open</td>
                <td>
                  <strong>Yes, conditionally</strong> — the sentinels wrap Tab and Shift+Tab once focus is inside. Until
                  then Tab walks the page behind the mask, which is the same defect seen from the other side.
                </td>
              </tr>
              <tr>
                <td>Focus returns to the opener on close</td>
                <td><strong>No</strong> — nothing records the trigger.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ focusMeasuredNote }}</p>
        <p>
          Both gaps are yours to close, and both are three lines. Move focus in on
          <code>(onShow)</code> — to the first meaningful control, or to a heading you made focusable, never to the
          close button. Restore on <code>(onHide)</code>, which the component emits for the close button, the mask, and
          the document Escape path. The kit ships <code>FocusReturn</code> in
          <code>src/app/utils/focus-return.ts</code> for the second half; it is deliberately dumb, ignores
          <code>&lt;body&gt;</code>, and no-ops when the trigger has left the document.
        </p>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>SSR</h3>
        <p>
          The panel is inside an <code>&#64;if</code> on the component's internal <code>modalVisible</code> flag, so a
          closed drawer prerenders as nothing at all — which is correct, and also means none of its content is in the
          static HTML. Do not put content that has to be crawlable or readable without JavaScript inside a drawer. A
          drawer that starts open is a different matter: the mask is created with <code>document.body</code> and the
          focus trap's sentinel spans are created only in the browser, so the server-rendered markup and the hydrated
          one differ. Prefer starting closed and opening from an effect.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ The container decision was made on the content: the page behind still matters, and the surface needs an
            edge and width.
          </li>
          <li>
            ☐ A width (or height, for top/bottom) is set explicitly, viewport-relative with a cap. The shipped 20rem /
            10rem is not shipped to users.
          </li>
          <li>☐ <code>appendTo="body"</code>.</li>
          <li>☐ The panel has an accessible name — through <code>pt</code>, or through a named region inside it.</li>
          <li>
            ☐ A modal drawer either carries <code>role="dialog"</code> via <code>pt</code>, or is honestly non-modal.
            <code>aria-modal</code> is not set without inertness.
          </li>
          <li>
            ☐ Focus is moved into the panel on <code>(onShow)</code> and returned to the trigger on
            <code>(onHide)</code>, verified with the keyboard, not the mouse.
          </li>
          <li>☐ <code>ariaCloseLabel</code> is set and translated whenever the header button renders.</li>
          <li>☐ There is a visible way out that is not Escape and not the mask.</li>
          <li>☐ Actions are in the <code>footer</code> template, not at the bottom of the scrolling content.</li>
          <li>
            ☐ <code>dismissible</code> and <code>blockScroll</code> are only relied on together with
            <code>[modal]="true"</code>.
          </li>
          <li>☐ Reduced motion was emulated and the mask was gone from the DOM after closing.</li>
          <li>☐ Nothing inside the drawer needs to be crawlable, linkable, or reachable with the back button.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the three things that rot first — the name, the focus
          return, and the mask's removal:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Two strings, and one of them is easy to miss</h3>
        <p>
          The component reads <strong>nothing</strong> from the library's translation config — there is no
          <code>aria</code> entry it consults and nothing to push through <code>Optimus.setTranslation</code>. Everything a user
          hears comes from your template:
        </p>
        <ul>
          <li>
            <strong><code>header</code></strong> — the visible title. Bind it through a <code>computed()</code> so a
            language switch re-renders it; a plain field is read once and goes stale.
          </li>
          <li>
            <strong><code>ariaCloseLabel</code></strong> — the close button's accessible name. It has no default and no
            fallback, so an unset one leaves the button named by its icon, which is to say unnamed. This is the one
            people forget, because the button looks fine.
          </li>
          <li>
            <strong>The panel's own name</strong>, if you set one through <code>pt</code> — same rule: it is a string in
            your UI and belongs in the translation layer.
          </li>
          <li>
            <strong>Everything you project</strong>, including the footer's buttons and the headless template's chrome.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Length: a 20rem panel is a 20rem panel in every language</h3>
        <p>
          The header is a flex row with <code>space-between</code> and a <code>flex-shrink: 0</code>; the title is a
          1.5rem div beside a 40px button. A title that fits in English at the default width can wrap to two lines in
          German and push the header taller, or — with a long unbroken compound — overflow it. Two consequences: set the
          width from the longest language you ship, not from English, and keep the title short enough that it is a label
          rather than a sentence. The content below scrolls; the header does not.
        </p>

        <h3>RTL: physical position, logical border, and they disagree</h3>
        <p>
          A position class mixes the two coordinate systems in one rule:
          <code>.p-drawer-left</code> sets <code>left: 0</code> — physical — and
          <code>border-inline-end-width: 1px</code> — logical. In a left-to-right document they agree: the panel sits on
          the physical left and the single 1px edge is the one facing the page. Flip <code>dir</code> to
          <code>rtl</code> and <strong>both halves break at once</strong>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th><code>position</code></th>
                <th>LTR</th>
                <th>RTL</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.pos) {
                <tr>
                  <td>
                    <code>{{ row.pos }}</code>
                  </td>
                  <td>{{ row.ltr }}</td>
                  <td>{{ row.rtl }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          The panel does not move — <code>left: 0</code> is <code>left: 0</code> in any direction — while the border
          does: the 1px edge lands on the side that is flush with the viewport, while the remaining three stay at the
          CSS initial <code>medium</code> (3px), because the base rule sets no width. Swapping <code>left</code> and
          <code>right</code> for RTL fixes the side the panel comes from and leaves the border inverted, so it is not a
          fix on its own. Ship RTL and you set <code>border-width</code> explicitly, in a rule of your own.
        </p>
        <p class="src-note">
          {{ rtlNote }}
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the style outline sits
            on the page-facing edge per position (no longer <code>border-left</code> on every drawer); the close button
            takes the kit's 2px <code>--primary-color-fg</code> ring; panel text, close icon, and ring quoted from the
            gate.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): every
            <code>html.style-*</code> block in <code>styles.scss</code> outlines the drawer's left edge (and two
            flatten its radius) — now in the anatomy, the geometry table, and the restyling notes; token and
            contrast values labeled as the Aura stock palette, outside the contrast gate; the focus-ring note
            names the accent token instead of one accent's hex values; narrow-screen statement added; history
            newest first.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014, a fork of the PrimeNG 21 code
            base). Two v0.3 claims flipped back: the mask is appended to <code>&lt;body&gt;</code> unconditionally again
            (:455), and the border defect is present — the base rule still ships no <code>border-width</code>, so three
            edges sit at <code>medium</code> (3px). <code>visible</code> is a plain getter/setter again, not a
            <code>model()</code>, and <code>transitionOptions</code> is back as a dead <code>&#64;deprecated</code>
            input rather than removed. Aura tokens are the 2.x values (title 1.5rem again); all line refs re-derived
            against the Optimus bundles. Unchanged: the ungated container-Escape path, the bare
            <code>animationend</code> teardown, the unnamed <code>complementary</code> role.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1 / Themes 3.0. Two upstream fixes
            recorded: the border defect is gone (base rule now 1px, no more 3px <code>medium</code> edges) and the mask
            lands beside the container instead of always on <code>&lt;body&gt;</code>. <code>visible</code> is a
            <code>model()</code> signal; <code>transitionOptions</code> was removed (motion via
            <code>motionOptions</code>). Unchanged and re-confirmed: the ungated container-Escape path, the bare
            <code>animationend</code> mask teardown, the unnamed <code>complementary</code> role. Line refs re-derived;
            Aura drawer tokens changed only in title size (1.5→1.125rem).
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide: the container decision against dialog, popover,
            confirmdialog, menubar, a section, and a route; the five positions and their shipped sizes; the
            landmark-not-dialog naming story with the pass-through fix; the two Escape paths; <code>modal</code> as the
            master switch over <code>dismissible</code> and <code>blockScroll</code>; measured Aura token and contrast
            chains in both themes; the mask's <code>animationend</code> teardown under reduced motion; and the canonical
            agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
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
      h4 {
        margin: 1.2rem 0 0.5rem;
        font-size: 0.95rem;
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
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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
      .pg__aside {
        font-weight: 400;
        color: var(--text-color-secondary);
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
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--space-3);
        min-height: 9rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__hint {
        margin: 0;
        font-size: 0.78rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      @media (max-width: 640px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Examples --- */
      .ex {
        margin: 0 0 var(--space-6);
      }
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__title {
        margin: 0;
        font-size: 1rem;
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .ex__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .row__tag {
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      /* --- Focus journal --- */
      .fj {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-5);
        width: 100%;
      }
      .fj__col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
        min-width: 0;
      }
      .fj__journal {
        list-style: none;
        padding-left: 0;
        margin: 0;
        font-size: 0.8rem;
      }
      .fj__journal li {
        margin: 0.2rem 0;
        color: var(--text-color);
        overflow-wrap: anywhere;
      }
      @media (max-width: 640px) {
        .fj {
          grid-template-columns: 1fr;
        }
      }

      /* --- Drawer demo internals --- */
      .navdemo ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
      }
      .navdemo li {
        margin: 0;
      }
      .navdemo a {
        display: block;
        padding: 0.5rem 0.6rem;
        border-radius: var(--radius-md);
        color: var(--text-color);
        text-decoration: none;
      }
      .navdemo a:hover {
        background: var(--surface-section);
      }
      .navdemo a:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .drawer-footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
      }
      .headless {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .headless__bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-4);
        border-bottom: 1px solid var(--surface-border);
      }
      .headless__title {
        margin: 0;
        font-size: 1.05rem;
      }
      .headless__body {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-4);
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
      @media (max-width: 640px) {
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
    `,
  ],
})
export class DrawerArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer) clearTimeout(this.copyTimer);
    });
  }

  copy(id: string, text: string): void {
    if (!this.isBrowser || !navigator?.clipboard) return;
    void navigator.clipboard.writeText(text).then(() => {
      this.copiedId.set(id);
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copiedId.set(null), 1400);
    });
  }

  // ---------------------------------------------------------------- playground

  readonly positionOptions = [
    { label: 'left (default)', value: 'left' },
    { label: 'right', value: 'right' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' },
    { label: 'full', value: 'full' },
  ];

  readonly pgPosition = signal<'left' | 'right' | 'top' | 'bottom' | 'full'>('right');
  readonly pgModal = signal(true);
  readonly pgDismissible = signal(true);
  readonly pgEscape = signal(true);
  readonly pgClosable = signal(true);
  readonly pgBlockScroll = signal(false);
  readonly pgVisible = signal(false);

  readonly semanticsOptions = [
    { label: 'none — the shipped landmark', value: 'none' },
    { label: 'name only — named complementary', value: 'named' },
    { label: 'role + name — announces as a dialog', value: 'dialog' },
  ];

  readonly pgSemantics = signal<'none' | 'named' | 'dialog'>('dialog');

  /**
   * Pass-through objects; the route is `pt.root`, because the panel element is
   * bound with `[pBind]="ptm('root')"`. Attributes set there are applied after
   * the template's static ones, which is what lets `role` be overridden.
   */
  readonly pgPt = computed(() => {
    switch (this.pgSemantics()) {
      case 'named':
        return { root: { 'aria-label': 'Playground drawer' } };
      case 'dialog':
        return { root: { role: 'dialog', 'aria-label': 'Playground drawer' } };
      default:
        return undefined;
    }
  });

  private readonly playgroundFocus = new FocusReturn();

  readonly pgSize = computed<Record<string, string>>(() => {
    const pos = this.pgPosition();
    const size: Record<string, string> = {};
    if (pos === 'left' || pos === 'right') size['width'] = 'min(28rem, 100vw)';
    else if (pos === 'top' || pos === 'bottom') size['height'] = 'min(18rem, 80vh)';
    return size;
  });

  readonly pgHint = computed(() => {
    const parts: string[] = [];
    parts.push(
      this.pgModal()
        ? 'Modal: a mask is created and appended to body.'
        : 'Not modal: no mask — dismissible and blockScroll do nothing.',
    );
    if (this.pgModal() && !this.pgDismissible()) parts.push('The mask will not close it.');
    if (!this.pgClosable()) parts.push('No header button.');
    if (!this.pgEscape())
      parts.push(
        'Escape no longer closes it properly — but it still tears the mask down when focus is inside the panel.',
      );
    return parts.join(' ');
  });

  readonly pgCode = computed(() => {
    const pos = this.pgPosition();
    const size =
      pos === 'top' || pos === 'bottom'
        ? `[style]="{ height: 'min(18rem, 80vh)' }"`
        : pos === 'full'
          ? ''
          : `[style]="{ width: 'min(28rem, 100vw)' }"`;
    const lines = [
      '<p-drawer',
      `  [(visible)]="visible"`,
      `  position="${pos}"`,
      `  [header]="labels().title"`,
      `  [modal]="${this.pgModal()}"`,
      `  [dismissible]="${this.pgDismissible()}"`,
      `  [closeOnEscape]="${this.pgEscape()}"`,
      `  [closable]="${this.pgClosable()}"`,
      `  [blockScroll]="${this.pgBlockScroll()}"`,
      `  [ariaCloseLabel]="labels().close"`,
      '  appendTo="body"',
    ];
    if (this.pgSemantics() === 'named') {
      lines.push(`  [pt]="{ root: { 'aria-label': labels().title } }"`);
    } else if (this.pgSemantics() === 'dialog') {
      lines.push(`  [pt]="{ root: { role: 'dialog', 'aria-label': labels().title } }"`);
    }
    if (size) lines.push(`  ${size}`);
    lines.push('  (onShow)="focusFirstControl()"');
    lines.push('  (onHide)="restoreFocus()">');
    lines.push('  <!-- content -->');
    lines.push('</p-drawer>');
    return lines.join('\n');
  });

  openPlayground(): void {
    this.playgroundFocus.capture();
    this.pgVisible.set(true);
  }

  onPlaygroundHide(): void {
    this.playgroundFocus.restore();
  }

  // ------------------------------------------------------------ focus journal

  readonly fjVisibleBare = signal(false);
  readonly fjVisibleWired = signal(false);

  readonly fjBare = signal({ before: '—', opened: '—', closed: '—' });
  readonly fjWired = signal({ before: '—', opened: '—', closed: '—' });

  private readonly fjFocusReturn = new FocusReturn();

  openFocusDemo(wired: boolean): void {
    const before = this.describeActive();
    const target = wired ? this.fjWired : this.fjBare;
    target.set({ before, opened: 'measuring…', closed: '—' });
    if (wired) {
      this.fjFocusReturn.capture();
      this.fjVisibleWired.set(true);
    } else {
      this.fjVisibleBare.set(true);
    }
    if (!this.isBrowser) return;
    setTimeout(() => {
      target.update((s) => ({ ...s, opened: this.describeActive() }));
    }, 600);
  }

  /** The wiring the library omits: move focus to the first meaningful control. */
  focusFirstControl(): void {
    if (!this.isBrowser) return;
    const el = document.querySelector<HTMLElement>('.fj-first');
    el?.focus();
  }

  afterFocusDemo(wired: boolean): void {
    if (wired) this.fjFocusReturn.restore();
    if (!this.isBrowser) return;
    const target = wired ? this.fjWired : this.fjBare;
    setTimeout(() => {
      target.update((s) => ({ ...s, closed: this.describeActive() }));
    }, 300);
  }

  /** A short, readable name for whatever currently has focus. */
  private describeActive(): string {
    if (!this.isBrowser) return '—';
    const el = document.activeElement;
    if (!el || el === document.body) return 'body — nothing is focused';
    const tag = el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || (el.textContent || '').trim();
    const short = label.length > 28 ? label.slice(0, 28) + '…' : label;
    return short ? `${tag} "${short}"` : tag;
  }

  // ------------------------------------------------------------ other examples

  readonly navVisible = signal(false);
  readonly detailVisible = signal(false);
  readonly sheetVisible = signal(false);
  readonly headlessVisible = signal(false);

  // ---------------------------------------------------------------- snippets

  readonly navSnippet = [
    '<p-button [label]="labels().menu" icon="pi pi-bars" (onClick)="menuOpen.set(true)" />',
    '',
    '<p-drawer [(visible)]="menuOpen" position="left" [header]="labels().menu"',
    '  appendTo="body" [ariaCloseLabel]="labels().close">',
    '  <!-- the panel is a generic landmark; the nav inside carries the name -->',
    '  <nav [attr.aria-label]="labels().sections">',
    '    <ul> … </ul>',
    '  </nav>',
    '</p-drawer>',
  ].join('\n');

  readonly detailSnippet = [
    '<p-drawer [(visible)]="detailOpen" position="right"',
    '  [header]="entry().name" appendTo="body"',
    '  [ariaCloseLabel]="labels().close"',
    `  [style]="{ width: 'min(34rem, 100vw)' }"`,
    '  (onShow)="focusFirstControl()" (onHide)="restoreFocus()">',
    '',
    '  <!-- scrolls: .p-drawer-content is overflow-y: auto -->',
    '  <p>{{ entry().description }}</p>',
    '',
    '  <!-- does not scroll: a sibling of the content -->',
    '  <ng-template #footer>',
    '    <div class="drawer-footer">',
    '      <p-button [label]="labels().cancel" severity="secondary" [text]="true"',
    '        (onClick)="detailOpen.set(false)" />',
    '      <p-button [label]="labels().save" (onClick)="save()" />',
    '    </div>',
    '  </ng-template>',
    '</p-drawer>',
  ].join('\n');

  readonly sheetSnippet = [
    '<!-- position="bottom" ships 10rem tall: set a height, and cap it -->',
    '<p-drawer [(visible)]="filtersOpen" position="bottom"',
    '  [header]="labels().filters" appendTo="body"',
    '  [ariaCloseLabel]="labels().close"',
    `  [style]="{ height: 'min(22rem, 80vh)' }">`,
    '  <!-- filter controls -->',
    '</p-drawer>',
  ].join('\n');

  readonly headlessSnippet = [
    '<p-drawer [(visible)]="open" position="right" appendTo="body"',
    `  [style]="{ width: 'min(24rem, 100vw)' }">`,
    '  <!-- replaces header, content wrapper, and footer: padding and',
    '       scrolling are now yours, and so is the close control -->',
    '  <ng-template #headless>',
    '    <div class="panel">',
    '      <div class="panel__bar">',
    '        <h2>{{ labels().title }}</h2>',
    '        <p-button icon="pi pi-times" [rounded]="true" [text]="true"',
    '          severity="secondary" [ariaLabel]="labels().close"',
    '          (onClick)="open.set(false)" />',
    '      </div>',
    '      <div class="panel__body"> … </div>',
    '    </div>',
    '  </ng-template>',
    '</p-drawer>',
  ].join('\n');

  readonly focusSnippet = [
    '// The two clauses the component leaves open, in six lines.',
    'private readonly focusReturn = new FocusReturn();',
    '',
    'open(): void {',
    '  this.focusReturn.capture();   // before the panel exists',
    '  this.visible.set(true);',
    '}',
    '',
    'focusFirstControl(): void {     // (onShow)',
    '  this.firstControl()?.nativeElement.focus();',
    '}',
    '',
    'restoreFocus(): void {          // (onHide): close button, mask, document Escape',
    '  this.focusReturn.restore();',
    '}',
  ].join('\n');

  readonly ptSnippet = [
    '<!-- Non-modal side panel: keep the landmark, give it a name -->',
    '<p-drawer [(visible)]="open" position="right"',
    `  [pt]="{ root: { 'aria-label': labels().panelName } }">`,
    '  …',
    '</p-drawer>',
    '',
    '<!-- Modal drawer: a blocking surface should be a dialog.',
    '     No aria-modal — nothing outside is inert. -->',
    '<p-drawer [(visible)]="open" position="right" [modal]="true"',
    `  [pt]="{ root: { role: 'dialog', 'aria-label': labels().panelName } }"`,
    '  (onShow)="focusFirstControl()" (onHide)="restoreFocus()">',
    '  …',
    '</p-drawer>',
  ].join('\n');

  readonly wiringSnippet = [
    '@Component({',
    '  template: `',
    '    <p-button #trigger [label]="labels().open" (onClick)="open()" />',
    '',
    '    <p-drawer',
    '      [(visible)]="visible"',
    '      position="right"',
    '      [modal]="true"',
    '      [header]="labels().title"',
    '      [ariaCloseLabel]="labels().close"',
    '      appendTo="body"',
    `      [style]="{ width: 'min(34rem, 100vw)' }"`,
    `      [pt]="{ root: { role: 'dialog', 'aria-label': labels().title } }"`,
    '      (onShow)="focusFirstControl()"',
    '      (onHide)="closePanel()">',
    '      <input #firstControl pInputText [attr.aria-label]="labels().search" />',
    '      <ng-template #footer>',
    '        <p-button [label]="labels().done" (onClick)="visible.set(false)" />',
    '      </ng-template>',
    '    </p-drawer>',
    '  `,',
    '})',
    'export class InspectorComponent {',
    '  readonly visible = signal(false);',
    "  private readonly firstControl = viewChild<ElementRef<HTMLElement>>('firstControl');",
    '  private readonly focusReturn = new FocusReturn();',
    '',
    '  open(): void {',
    '    this.focusReturn.capture();',
    '    this.visible.set(true);',
    '  }',
    '',
    '  focusFirstControl(): void {',
    '    this.firstControl()?.nativeElement.focus();',
    '  }',
    '',
    '  closePanel(): void {',
    '    this.visible.set(false);',
    '    this.focusReturn.restore();',
    '  }',
    '}',
  ].join('\n');

  readonly i18nSnippet = [
    '// One computed map, so a language switch re-renders every string.',
    'readonly labels = computed(() => ({',
    "  title: this.i18n.t('inspector.title'),",
    "  close: this.i18n.t('inspector.close'),   // -> ariaCloseLabel, no default!",
    "  panelName: this.i18n.t('inspector.panelName'), // -> pt root aria-label",
    "  done: this.i18n.t('common.done'),",
    '}));',
  ].join('\n');

  readonly testSnippet = [
    "it('names the panel and returns focus to the trigger', async () => {",
    '  const fixture = TestBed.createComponent(InspectorComponent);',
    '  fixture.autoDetectChanges();',
    '',
    "  const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;",
    '  trigger.focus();',
    '  trigger.click();',
    '  await fixture.whenStable();',
    '',
    "  const panel = document.querySelector('.p-drawer')!;",
    "  expect(panel.getAttribute('role')).toBe('dialog');",
    "  expect(panel.getAttribute('aria-label')).toBeTruthy();",
    '  expect(panel.contains(document.activeElement)).toBe(true);',
    '',
    "  document.dispatchEvent(new KeyboardEvent('keydown', { which: 27 } as never));",
    '  await fixture.whenStable();',
    '  expect(document.activeElement).toBe(trigger);',
    '});',
    '',
    "it('leaves no mask behind', async () => {",
    '  // The mask is removed in an animationend handler: assert the DOM, not the flag.',
    "  expect(document.querySelectorAll('.p-drawer-mask').length).toBe(0);",
    '});',
  ].join('\n');

  // ------------------------------------------------------- measured reference
  // Aliases read from the Aura preset files; every value column is computed
  // style on the rendered panel / mask, one reading per color scheme.

  readonly tokenRows = [
    {
      varName: '--p-drawer-background',
      alias: '{overlay.modal.background}',
      light: 'rgb(255, 255, 255)',
      dark: 'rgb(24, 24, 27)',
    },
    {
      varName: '--p-drawer-color',
      alias: '{overlay.modal.color} -> {text.color}',
      light: 'rgb(51, 65, 85)',
      dark: 'rgb(255, 255, 255)',
    },
    {
      varName: '--p-drawer-border-color',
      alias: '{overlay.modal.border.color}',
      light: 'rgb(226, 232, 240)',
      dark: 'rgb(63, 63, 70)',
    },
    {
      varName: '--p-drawer-shadow',
      alias: '{overlay.modal.shadow}',
      light: '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)',
      dark: 'identical',
    },
    { varName: '--p-drawer-header-padding', alias: '{overlay.modal.padding}', light: '20px', dark: 'identical' },
    {
      varName: '--p-drawer-content-padding',
      alias: 'the same padding, minus the top edge',
      light: '0 20px 20px',
      dark: 'identical',
    },
    { varName: '--p-drawer-footer-padding', alias: '{overlay.modal.padding}', light: '20px', dark: 'identical' },
    {
      varName: '--p-drawer-title-font-size / -weight',
      alias: 'literals in the preset',
      light: '24px / 600',
      dark: 'identical',
    },
    { varName: '(no radius token exists)', alias: 'not part of the drawer group', light: '0px', dark: '0px' },
    {
      varName: '--px-mask-background',
      alias: 'mask.background, shared by every overlay',
      light: 'rgba(0, 0, 0, 0.4)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  ];

  readonly tokenNote =
    'Every surface token is an alias of overlay.modal.*, so the drawer and the dialog are the same material by construction — and neither the group nor the base stylesheet gives the panel a border radius, which is why the corners are square. The resolved values are the Aura stock surface palette (slate light, zinc dark): no visual style overrides these tokens, and the accent does not reach them. The mask is not styled from a drawer token at all: it takes the shared overlay mask background, and --px-mask-background is the variable both the rule and its keyframes read.';

  readonly contrastRows = [
    { pair: 'panel text (the inherited --p-drawer-color)', light: '10.35:1', dark: '17.72:1', floor: '4.5:1' },
    { pair: 'close-button icon (--text-color-secondary) on the panel', light: '5.21–7.78:1', dark: '6.78–8.48:1', floor: '3:1' },
    { pair: 'close-button focus ring (kit ring) against the panel', light: '5.18–17.85:1', dark: '6.40–16.93:1', floor: '3:1' },
  ];

  readonly contrastNote =
    'Quoted from the contrast gate, docs/generated/CONTRAST.MD. The drawer panel is the overlay.modal surface, the same value as the dialog panel (the "panel outline" rows list drawer.background beside the card), so the gate\'s dialog.background rows are the drawer\'s: "dialog" for the panel text and the close icon (the secondary text button\'s kit color, --text-color-secondary), "focus ring" for the kit\'s 2px --primary-color-fg ring on dialog.background, ranges across the four visual styles and, for the ring, the accents. Content that sets its own color is outside these numbers — measure it against the panel background, not against the page.';

  readonly geometryRows = [
    {
      what: 'left / right panel',
      value: '320px wide (20rem), full viewport height',
      origin: 'position class, plain CSS',
    },
    {
      what: 'top / bottom panel',
      value: '160px tall (10rem), full viewport width',
      origin: 'position class, plain CSS',
    },
    { what: 'position="full"', value: 'the whole viewport, transition: none', origin: 'p-drawer-full' },
    {
      what: 'border',
      value: '1px on the edge facing the page, 3px on the other three',
      origin: 'border-style: solid with no width',
    },
    { what: 'border, full screen', value: 'all four at 1px', origin: 'p-drawer-full sets border-width: 1px' },
    {
      what: 'border, kit visual styles',
      value: 'the page-facing edge only, 1–3px in --style-outline (logical side per position)',
      origin: 'html.style-<name> .p-drawer-<position> in styles.scss',
    },
    { what: 'border radius', value: '0px', origin: 'no token; werkbund and blaupause also set 0 explicitly' },
    { what: 'close button / its icon', value: '40 x 40px / 16 x 16px', origin: 'p-button, rounded + text' },
  ];

  readonly geometryNote =
    'Computed style on the position classes at a 1440 x 900 viewport. The three 3px edges are the CSS initial medium width showing through, and box-sizing is border-box, so they come out of the content width you set.';

  readonly focusRingNote =
    'Nothing at rest. Focused from the keyboard, the close button takes the kit focus ring: .p-button:focus-visible is in the one ring rule of styles.scss, a 2px solid --primary-color-fg outline at 2px offset with !important, drawn over the secondary button\'s own 1px ring (Aura {surface.600} / {surface.300}). The gate measures it on the panel surface (CONTRAST.MD, "focus ring" on dialog.background, lowest 5.18:1). Retuning --p-focus-ring-color therefore changes nothing here. Anything you project into the panel keeps the ring it would have had on the page.';

  readonly motionRows = [
    {
      what: 'panel enter / leave',
      normal: 'p-animate-drawer-enter|leave-<position>, 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
      reduced: 'skipped entirely — no p-drawer-enter-* class is applied',
    },
    {
      what: 'mask fade in / out',
      normal: 'p-animate-overlay-mask-enter|leave, 0.3s (mask.transitionDuration)',
      reduced: '0.01ms, from the kit global rule — still ends, so the mask is still removed',
    },
    {
      what: 'teardown after a close',
      normal: 'gated on the leave animation; the panel element can linger at display: none',
      reduced: 'nothing to wait for, so the unmount runs on the next frame',
    },
  ];

  readonly axRows = [
    { markup: 'as shipped', node: 'complementary, name "" — a landmark with no name' },
    { markup: '[pt]="{ root: { \'aria-label\': … } }"', node: 'complementary, name "Playground drawer"' },
    { markup: "[pt]=\"{ root: { role: 'dialog', 'aria-label': … } }\"", node: 'dialog, name "Playground drawer"' },
    { markup: 'close button with ariaCloseLabel', node: 'button, name "Close the menu"' },
    { markup: 'close button without it', node: 'no aria-label attribute at all; the only content is an <svg>' },
  ];

  readonly axNote =
    'Read from the browser accessibility tree with a drawer open, once per variant. aria-modal never appears unless you add it — and adding it is a claim about the rest of the page that nothing in the component backs up.';

  readonly rtlRows = [
    {
      pos: 'left',
      ltr: 'pinned left, borders 3/1/3/3 — the 1px edge faces the page',
      rtl: 'still pinned left, borders 3/3/3/1 — the 1px edge faces the viewport',
    },
    {
      pos: 'right',
      ltr: 'pinned right, borders 3/3/3/1 — the 1px edge faces the page',
      rtl: 'still pinned right, borders 3/1/3/3 — the 1px edge faces the viewport',
    },
  ];

  readonly rtlNote =
    'Computed style on the rendered panels with dir="ltr" and then dir="rtl" on the document; border widths read clockwise from the top. The logical values themselves never move — border-inline-start/end stay 3px/1px for a left drawer — only their physical mapping flips, which is exactly what makes the rule contradict its own pin. The one :dir(rtl) rule the stylesheet ships, on .p-drawer-mask, changes nothing here: in this library the mask has no children to reverse. The enter and leave keyframes translate on the X axis with fixed signs and do not mirror either.';

  readonly focusMeasuredNote =
    'Measured with the keyboard: after Enter on the trigger, document.activeElement is still the trigger, and the following eight Tab presses walk the controls of the page behind the mask without ever entering the panel. Once focus is inside, Tab and Shift+Tab cycle between the panel controls and do not leave it. Closing a panel that holds focus drops focus outside it — <body>, or whichever container survives the panel — never on the opener.';
}
