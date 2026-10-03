import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * The subset of the `position` union this playground offers. The full
 * union also carries 'left' | 'right' | 'topleft' | 'bottomright'.
 */
type DialogPosition = 'center' | 'top' | 'bottom' | 'topright' | 'bottomleft';

/**
 * Guide article: Dialog (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the DECISION to interrupt at all —
 * p-dialog vs p-drawer vs p-popover vs p-confirmdialog vs an inline section —
 * and then the modal mechanics that decide whether the interruption is usable:
 * where focus goes, whether it is trapped, whether it comes back, and what the
 * dialog is actually called.
 *
 * VERIFIED CLAIMS (read from the shipped source or from the accessibility
 * tree; provenance in the tabs — Optimus UI 2.0.2,
 * node_modules/@openng/optimus-ui/package.json):
 *   - `aria-modal="true"` is a LITERAL in the template
 *     (openng-optimus-ui-dialog.mjs:1056, :1175) — it is emitted even with
 *     `[modal]="false"`, so a non-modal dialog tells assistive technology that
 *     the rest of the page is inert while it is not.
 *   - `ariaLabelledBy` is an INPUT signal in Optimus
 *     (openng-optimus-ui-dialog.mjs:380). What lands on the element is
 *     `computedAriaLabelledBy()` = `ariaLabelledBy() ?? headerId()` (:515),
 *     over `headerId = computed(() => header() !== null ? id + '_header'
 *     : null)` (:513). Unbound header = undefined = id present; the check is
 *     REACTIVE, so a header binding that ever evaluates to null removes the
 *     id and un-names the dialog live — unless you bind `ariaLabelledBy`
 *     yourself. The kit binds `[header]="''"` to make that state
 *     unreachable. The `<span [id]="headerId()">` only renders inside
 *     `*ngIf="showHeader"` with no header template projected (:1065-1066).
 *   - FOCUS ON OPEN is not the close button: `focus()` (:633-644) tries the
 *     CONTENT first, then the footer, then the header — first focusable element
 *     of each, called from `onAfterEnter` (:949-951) once the enter motion
 *     completes, then deferred by a `setTimeout` of `transitionOptions` ms
 *     (or 5) inside `_focus()` (:620-632).
 *   - FOCUS RETURN: there is no code for it. The component never records
 *     `document.activeElement` before opening, and `pFocusTrap`
 *     (openng-optimus-ui-focustrap.mjs) only adds two sentinel spans; nothing restores
 *     focus in `onAfterLeave`/`onContainerDestroy` (:960-971).
 *   - THE BACKGROUND IS NOT INERTED. `enableModality()` (:650-661) binds a mask
 *     mousedown listener and calls `blockBodyScroll()`; no `inert`, no
 *     `aria-hidden` on anything outside the dialog.
 *   - `[blockScroll]` alone does nothing: `blockBodyScroll()` is called from
 *     `enableModality()` under `if (this.modal)` only (:658-660); `blockScroll`
 *     appears in the component in exactly three places — its declaration
 *     (:222), the `data-p-scrollblocker-active` bookkeeping attribute, bound
 *     straight to `modal || blockScroll` in the template (:1034) — PrimeNG 22's
 *     `scrollBlockerActive` computed is gone again — and the maximize path
 *     (:679) (openng-optimus-ui-dialog.mjs, Optimus UI 2.0.2).
 *   - `dismissableMask` needs `closable`: `enableModality()` guards the mask
 *     mousedown listener with `if (this.closable && this.dismissableMask)`
 *     (:651).
 *   - `appendTo` defaults to `config.overlayAppendTo()`, which is `'self'`
 *     (openng-optimus-ui-config.mjs:88) — a dialog stays where you wrote it
 *     in the DOM unless you ask for `'body'`.
 *   - The close button gets `[ariaLabel]="closeAriaLabel"` (:1099) with no
 *     default and no translation fallback (unlike maximize/minimize,
 *     which read `TranslationKeys.ARIA`, :548-553).
 *   - ACCESSIBLE NAME: "" for `[showHeader]="false"`, the header text for
 *     `[header]`, the heading text for a `#header` that carries the
 *     context's `ariaLabelledBy` id; "" for a close button without
 *     `closeAriaLabel`.
 *   - FOCUS: on open the first focusable of content / footer / header wins, in
 *     that fallback order; Tab never leaves the dialog; after Escape focus is
 *     on `document.body`. Nothing outside the dialog gains `inert` or
 *     `aria-hidden`; `<body>` gains `p-overflow-hidden`.
 *   - AURA VALUES: mask rgba(0,0,0,0.4) light / rgba(0,0,0,0.6) dark;
 *     the close button's own 1px secondary ring ({surface.600} / {surface.300})
 *     is drawn over by the kit's one focus ring (`.p-button:focus-visible` in
 *     styles.scss: 2px --primary-color-fg at 2px offset), measured in
 *     CONTRAST.MD "focus ring" on dialog.background. The dialog
 *     frame (border, radius, shadow) is set per visual style in styles.scss
 *     (`html.style-<name> .p-dialog`); `.p-overlay-mask` is not overridden.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-dialog-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dialog'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every dialog below really opens. Start in the playground: it reports, live and in
          <em>your</em> browser, where focus landed when the dialog opened and where it went when the dialog closed —
          the two facts that decide whether a modal is usable at all.
        </p>

        <!-- Mini playground: configure a dialog, open it, read the focus report. -->
        <section class="pg" aria-label="Dialog playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-modal">modal</label>
                <p-toggleswitch inputId="pg-modal" [ngModel]="pgModal()" (ngModelChange)="pgModal.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-header">showHeader</label>
                <p-toggleswitch
                  inputId="pg-header"
                  [ngModel]="pgShowHeader()"
                  (ngModelChange)="pgShowHeader.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-closable">closable</label>
                <p-toggleswitch
                  inputId="pg-closable"
                  [ngModel]="pgClosable()"
                  (ngModelChange)="pgClosable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-escape">closeOnEscape</label>
                <p-toggleswitch
                  inputId="pg-escape"
                  [ngModel]="pgCloseOnEscape()"
                  (ngModelChange)="pgCloseOnEscape.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-mask">dismissableMask</label>
                <p-toggleswitch
                  inputId="pg-mask"
                  [ngModel]="pgDismissableMask()"
                  (ngModelChange)="pgDismissableMask.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-focus">focusOnShow</label>
                <p-toggleswitch
                  inputId="pg-focus"
                  [ngModel]="pgFocusOnShow()"
                  (ngModelChange)="pgFocusOnShow.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-trap">focusTrap</label>
                <p-toggleswitch inputId="pg-trap" [ngModel]="pgFocusTrap()" (ngModelChange)="pgFocusTrap.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-maximizable">maximizable</label>
                <p-toggleswitch
                  inputId="pg-maximizable"
                  [ngModel]="pgMaximizable()"
                  (ngModelChange)="pgMaximizable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-body">Body has a text field</label>
                <p-toggleswitch
                  inputId="pg-body"
                  [ngModel]="pgBodyFocusable()"
                  (ngModelChange)="pgBodyFocusable.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="pg-position-label">position</span>
                <p-select
                  [ariaLabelledBy]="'pg-position-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgPosition()"
                  (ngModelChange)="pgPosition.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <p-button
                  id="pg-trigger"
                  label="Open the dialog"
                  icon="pi pi-external-link"
                  (onClick)="openPlayground()"
                />

                <dl class="probe">
                  <dt>Focus after opening</dt>
                  <dd>{{ pgFocusOpenReport() }}</dd>
                  <dt>Focus after closing</dt>
                  <dd>{{ pgFocusCloseReport() }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <p-dialog
            [visible]="pgVisible()"
            (visibleChange)="pgVisible.set($event)"
            [header]="pgShowHeader() ? 'Rename this collection' : ''"
            [showHeader]="pgShowHeader()"
            [modal]="pgModal()"
            [closable]="pgClosable()"
            [closeOnEscape]="pgCloseOnEscape()"
            [dismissableMask]="pgDismissableMask()"
            [focusOnShow]="pgFocusOnShow()"
            [focusTrap]="pgFocusTrap()"
            [maximizable]="pgMaximizable()"
            [draggable]="false"
            [resizable]="false"
            [position]="pgPosition()"
            closeAriaLabel="Close the rename dialog"
            styleClass="pg-dialog"
            [style]="{ width: '90vw', maxWidth: '28rem' }"
            (onShow)="reportFocusAfterOpen()"
            (onHide)="reportFocusAfterClose()"
          >
            @if (pgBodyFocusable()) {
              <label class="dlg__label" for="pg-name">Collection name</label>
              <input
                pInputText
                id="pg-name"
                class="dlg__input"
                [ngModel]="pgName()"
                (ngModelChange)="pgName.set($event)"
              />
            } @else {
              <p class="dlg__text">This body has no focusable element at all — watch what the focus report says.</p>
            }
            <ng-template #footer>
              <p-button label="Cancel" severity="secondary" [text]="true" (onClick)="pgVisible.set(false)" />
              <p-button label="Rename" (onClick)="pgVisible.set(false)" />
            </ng-template>
          </p-dialog>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
          <p class="src-note">
            The focus report reads <code>document.activeElement</code> 300 ms after <code>(onShow)</code> and again on
            <code>(onHide)</code> — late enough to clear the library's own focus move, which runs from
            <code>onAfterEnter</code> once the enter motion completes (<code>openng-optimus-ui-dialog.mjs:633-644, :949-951</code
            >). Turn <code>focusOnShow</code> off, or empty the body, and the report tells you exactly what a keyboard
            user would experience.
          </p>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('basic') {
                  <p-button
                    id="ex-basic-trigger"
                    label="Delete the draft"
                    severity="danger"
                    [outlined]="true"
                    (onClick)="exBasic.set(true)"
                  />
                }
                @case ('form') {
                  <p-button id="ex-form-trigger" label="Edit the title" (onClick)="exForm.set(true)" />
                }
                @case ('headless') {
                  <p-button
                    id="ex-headless-trigger"
                    label="Open a custom-chrome dialog"
                    severity="secondary"
                    (onClick)="exHeadless.set(true)"
                  />
                }
                @case ('nonmodal') {
                  <p-button
                    id="ex-nonmodal-trigger"
                    label="Open a non-modal dialog"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="exNonModal.set(true)"
                  />
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }

        <!-- The four example dialogs live outside the @for so their markup stays readable. -->

        <p-dialog
          [visible]="exBasic()"
          (visibleChange)="exBasic.set($event)"
          header="Delete this draft?"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close without deleting"
          styleClass="ex-dialog"
          [style]="{ width: '90vw', maxWidth: '26rem' }"
          (onHide)="restoreFocus('ex-basic-trigger')"
        >
          <p class="dlg__text">The draft and its four revisions are removed. This cannot be undone.</p>
          <ng-template #footer>
            <p-button label="Keep the draft" severity="secondary" [text]="true" (onClick)="exBasic.set(false)" />
            <p-button label="Delete" severity="danger" (onClick)="exBasic.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exForm()"
          (visibleChange)="exForm.set($event)"
          header="Edit the title"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close the title editor"
          styleClass="ex-dialog"
          [style]="{ width: '90vw', maxWidth: '30rem' }"
          (onHide)="restoreFocus('ex-form-trigger')"
        >
          <label class="dlg__label" for="ex-form-title">Title</label>
          <input
            pInputText
            id="ex-form-title"
            class="dlg__input"
            [ngModel]="exFormTitle()"
            (ngModelChange)="exFormTitle.set($event)"
          />
          <p class="dlg__hint">
            Focus lands here on open, because the first focusable element of the CONTENT wins over the close button.
          </p>
          <ng-template #footer>
            <p-button label="Cancel" severity="secondary" [text]="true" (onClick)="exForm.set(false)" />
            <p-button label="Save" (onClick)="exForm.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exHeadless()"
          (visibleChange)="exHeadless.set($event)"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          styleClass="ex-dialog"
          closeAriaLabel="Close the custom-chrome dialog"
          [style]="{ width: '90vw', maxWidth: '26rem' }"
          (onHide)="restoreFocus('ex-headless-trigger')"
        >
          <ng-template #header let-ariaLabelledBy="ariaLabelledBy">
            <div class="dlg__own-header">
              <i class="pi pi-map" aria-hidden="true"></i>
              <h2 [id]="ariaLabelledBy" class="dlg__own-title">Your own chrome</h2>
            </div>
          </ng-template>
          <p class="dlg__text">
            This dialog draws its own header through <code>#header</code>, which hands you the generated
            <code>ariaLabelledBy</code> id in the template context. Put that id on your heading and the dialog keeps its
            name — and note that <code>showHeader</code> stays <strong>true</strong>: the header template lives inside
            <code>*ngIf="showHeader"</code>, so turning the header off would throw your own markup away as well.
          </p>
          <ng-template #footer>
            <p-button label="Close" (onClick)="exHeadless.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exNonModal()"
          (visibleChange)="exNonModal.set($event)"
          header="Non-modal — the background still works"
          [modal]="false"
          [draggable]="true"
          [resizable]="false"
          closeAriaLabel="Close the non-modal dialog"
          styleClass="ex-dialog"
          [position]="'topright'"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('ex-nonmodal-trigger')"
        >
          <p class="dlg__text">
            Try scrolling and clicking behind this one — it works. Then read what this dialog still tells a screen
            reader: <code>aria-modal="true"</code>.
          </p>
        </p-dialog>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>First question: does this have to interrupt?</h3>
        <p>
          A modal dialog is the most expensive container in the kit. It takes the whole viewport hostage, it moves focus
          away from whatever the user was doing, it has to be dismissed before anything else can happen, and — as the
          Development tab measures — it does
          <strong>not</strong> give focus back afterwards unless you write that yourself. The honest default is:
          <em>put it on the page</em>. Reach for <code>p-dialog</code> when the interruption is the point.
        </p>
        <p>
          Three questions, in order. <strong>Is the work a detour from the current task, or the task itself?</strong> If
          it is the task, it belongs on the page or on a route.
          <strong>Does the answer change what the user is looking at?</strong> If yes, hiding that view behind a mask is
          the wrong move — put the control next to the thing. <strong>Is losing the user's place acceptable?</strong> A
          modal that opens on a scrolled article and closes with focus at the top of the document has cost the user
          their place; that is the price you are paying, and you should be paying it for a reason.
        </p>

        <h3>Which container? The honest table</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Interrupts?</th>
                <th>Modal by default</th>
                <th>Dismissal</th>
                <th>Use it when</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>an inline section / <code>&lt;details&gt;</code></td>
                <td>no</td>
                <td>n/a</td>
                <td>nothing to dismiss</td>
                <td>
                  The default. The content belongs to the page, the user keeps their place, and there is no focus
                  contract to get wrong.
                </td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>no — the page stays live</td>
                <td>no mask; <code>dismissable = true</code></td>
                <td>Click outside, <kbd>Esc</kbd></td>
                <td>
                  A short, anchored aside about one element: a definition, a filter menu, a "what is this?". It is
                  <code>role="dialog"</code> too, so name it.
                </td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>yes, but keeps the page visible</td>
                <td><strong>yes</strong> — <code>modal = true</code></td>
                <td>Mask click (<code>dismissible = true</code>), <kbd>Esc</kbd>, close icon</td>
                <td>
                  A long secondary surface — filters, a detail panel, navigation — where the user wants the underlying
                  list still in view. Renders <code>role="complementary"</code>, not <code>dialog</code>.
                </td>
              </tr>
              <tr>
                <td><code>p-dialog</code></td>
                <td><strong>yes</strong>, with <code>[modal]="true"</code></td>
                <td>no — <code>modal = false</code> is the default</td>
                <td>
                  Close icon; <kbd>Esc</kbd> (<code>closeOnEscape = true</code>); mask click only with
                  <code>dismissableMask</code>
                </td>
                <td>
                  A self-contained sub-task the user asked for: rename, upload, a form too large for a popover, a media
                  viewer.
                </td>
              </tr>
              <tr>
                <td><code>p-confirmdialog</code></td>
                <td>yes</td>
                <td><strong>yes</strong></td>
                <td>Accept / reject buttons, <kbd>Esc</kbd></td>
                <td>
                  Exactly one thing: "are you sure?". It renders <code>role="alertdialog"</code> and focuses the accept
                  button by default (<code>defaultFocus = 'accept'</code>) — do not hand-roll this with a
                  <code>p-dialog</code>.
                </td>
              </tr>
              <tr>
                <td>a route</td>
                <td>replaces the view</td>
                <td>n/a</td>
                <td>Back button</td>
                <td>
                  Anything the user might link to, reload, or come back to. A dialog has no URL; a wizard behind one is
                  unshareable and un-bookmarkable.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The "modal by default" and "dismissal" columns are read from
          the shipped sources — <code>modal = false</code> (<code>openng-optimus-ui-dialog.mjs:172</code>),
          <code>closeOnEscape = true</code> (:177), <code>dismissableMask = false</code> (:182); drawer
          <code>modal = true</code> / <code>dismissible = true</code> (<code>openng-optimus-ui-drawer.mjs:241,251</code>) with
          <code>role="complementary"</code> (:581); popover
          <code>dismissable = true</code> (<code>openng-optimus-ui-popover.mjs:64</code>) rendering
          <code>role="dialog"</code> (:418); confirm dialog <code>role="alertdialog"</code>
          (<code>openng-optimus-ui-confirmdialog.mjs:523</code>) and
          <code>defaultFocus = 'accept'</code> (:233). The "use it when" column is a <em>judgment</em>.
        </p>

        <h3>The kit's house style for dialogs</h3>
        <p>Four conventions, and each of them exists because the library default is the other way round:</p>
        <ul>
          <li>
            <strong>Always modal, always three ways out.</strong>
            <code>[modal]="true" [closable]="true" [dismissableMask]="true" [closeOnEscape]="true"</code>. A dialog that
            blocks should look and behave like it blocks, and the user should never be cornered in it.
          </li>
          <li>
            <strong>Never draggable, never resizable.</strong> Both default to <code>true</code> and both are
            mouse-only, so leaving them on ships a feature no keyboard user can reach.
          </li>
          <li>
            <strong>Named, without exception.</strong> Three shapes do it: <code>[header]</code>;
            <code>#header</code> with the context's <code>ariaLabelledBy</code> id on the heading; or, when the whole
            header bar has to go, <code>[showHeader]="false"</code> with that same id on the heading you draw inside the
            content — which is what the kit's own hand-chromed dialogs do. The id is the invariant, not the header. What
            is not an option is dropping the header and writing a plain <code>&lt;h2&gt;</code>: Optimus emits
            <code>aria-labelledby</code> either way, so a heading that does not carry the id leaves the attribute
            pointing at an element that was never rendered, and the dialog ends up with the accessible name
            <strong>&quot;&quot; (the empty string)</strong> — the Development tab shows the mechanism.
          </li>
          <li>
            <strong>Focus goes back to the trigger.</strong> The kit keeps one small utility for this,
            <code>FocusReturn</code> in <code>src/app/utils/focus-return.ts</code>: capture before the overlay opens,
            restore from <code>(onHide)</code>. It is the pattern pointer for everything below — Optimus implements no
            part of it.
          </li>
        </ul>
        <p>
          Sizing is the fifth: <code>[style]</code> with a <code>vw</code> width plus a <code>maxWidth</code>. A fixed
          pixel width with no cap is the one recurring failure mode — it looks right on the machine it was written on
          and overflows a 360 px viewport.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live and openable. The
          <span class="tag tag--bad">Don't</span> is on the left, the <span class="tag tag--good">Do</span> on the
          right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — hide the header and put an &lt;h2&gt; in the body</span>
            <div class="dd__stage">
              <p-button
                id="dd-name-bad-trigger"
                label="Open the unnamed dialog"
                severity="secondary"
                (onClick)="ddNameBad.set(true)"
              />
            </div>
            <p class="dd__why">
              Accessible name: <strong>&quot;&quot; (the empty string)</strong>. Optimus still emits
              <code>aria-labelledby</code>, but the element it names was never rendered, and a heading inside the
              content is not a name.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — give it a real header</span>
            <div class="dd__stage">
              <p-button id="dd-name-good-trigger" label="Open the named dialog" (onClick)="ddNameGood.set(true)" />
            </div>
            <p class="dd__why">
              Accessible name: <strong>&quot;Export your sources&quot;</strong>. Either use <code>[header]</code>, or
              keep your own chrome via <code>#header</code> and put the context's <code>ariaLabelledBy</code> id on your
              heading — the Examples tab does exactly that.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — close and abandon the focus</span>
            <div class="dd__stage">
              <p-button
                id="dd-return-bad-trigger"
                label="Open, then press Esc"
                severity="secondary"
                (onClick)="openReturnBad()"
              />
              <span class="dd__probe"
                >After closing, focus was on: <strong>{{ ddReturnBadReport() }}</strong></span
              >
            </div>
            <p class="dd__why">
              Optimus never records the element that opened the dialog, so on close focus falls back to the document. A
              keyboard user is returned to the top of the page and has to tab all the way back.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — hand focus back in (onHide)</span>
            <div class="dd__stage">
              <p-button id="dd-return-good-trigger" label="Open, then press Esc" (onClick)="openReturnGood()" />
              <span class="dd__probe"
                >After closing, focus was on: <strong>{{ ddReturnGoodReport() }}</strong></span
              >
            </div>
            <p class="dd__why">
              Four lines: remember the trigger, and in <code>(onHide)</code> call <code>.focus()</code> on it. WCAG 2.2
              SC 2.4.3 is about a focus order that "preserves meaning and operability" — this is the whole of it.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a modal for something passive</span>
            <div class="dd__stage">
              <p-button
                id="dd-passive-bad-trigger"
                label="What is a token?"
                severity="secondary"
                [text]="true"
                (onClick)="ddPassiveBad.set(true)"
              />
            </div>
            <p class="dd__why">
              A one-sentence definition behind a mask: the reader loses the sentence they were reading, has to dismiss,
              and finds their place again. Glossary terms and footnotes are the classic offenders — the interruption
              costs more than the definition is worth.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — expand it in place</span>
            <div class="dd__stage">
              <button
                type="button"
                class="disclosure"
                [attr.aria-expanded]="ddPassiveOpen()"
                aria-controls="dd-passive-panel"
                (click)="ddPassiveOpen.set(!ddPassiveOpen())"
              >
                What is a token?
                <i
                  class="pi"
                  [class.pi-chevron-down]="!ddPassiveOpen()"
                  [class.pi-chevron-up]="ddPassiveOpen()"
                  aria-hidden="true"
                ></i>
              </button>
              <div id="dd-passive-panel" class="disclosure__panel" [hidden]="!ddPassiveOpen()">
                A token is the chunk a model actually reads — roughly a word-piece.
              </div>
            </div>
            <p class="dd__why">
              A disclosure button plus a panel. Nothing moves, nothing is trapped, the text stays where the reader left
              it — and there is no focus contract to honor.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — [modal]="false" for a blocking task</span>
            <div class="dd__stage">
              <p-button
                id="dd-modal-bad-trigger"
                label='Open a non-modal "modal"'
                severity="secondary"
                (onClick)="ddModalBad.set(true)"
              />
            </div>
            <p class="dd__why">
              The mask lets clicks through and the page keeps scrolling — but Optimus still writes
              <code>aria-modal="true"</code> on the dialog (<code>openng-optimus-ui-dialog.mjs:1056</code> is a literal). Assistive
              technology is told the rest of the page is unavailable while it is not.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — modal, or not a dialog</span>
            <div class="dd__stage">
              <p-button id="dd-modal-good-trigger" label="Open a real modal" (onClick)="ddModalGood.set(true)" />
            </div>
            <p class="dd__why">
              If the task blocks, set <code>[modal]="true"</code> so the mask, the scroll block, and the ARIA all agree.
              If it does not block, you wanted a popover, a drawer, or a panel on the page.
            </p>
          </div>
        </div>

        <!-- The Do/Don't dialogs. -->
        <p-dialog
          [visible]="ddNameBad()"
          (visibleChange)="ddNameBad.set($event)"
          [modal]="true"
          [showHeader]="false"
          [draggable]="false"
          [resizable]="false"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-name-bad-trigger')"
        >
          <h2 class="dlg__own-title">Export your sources</h2>
          <p class="dlg__text">A heading in the body is a heading, not a name.</p>
          <ng-template #footer>
            <p-button label="Close" (onClick)="ddNameBad.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="ddNameGood()"
          (visibleChange)="ddNameGood.set($event)"
          header="Export your sources"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close the export dialog"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-name-good-trigger')"
        >
          <p class="dlg__text">The header text is the dialog's accessible name.</p>
          <ng-template #footer>
            <p-button label="Close" (onClick)="ddNameGood.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="ddReturnBad()"
          (visibleChange)="ddReturnBad.set($event)"
          header="No focus return"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="reportReturnBad()"
        >
          <p class="dlg__text">Press <kbd>Esc</kbd> and look at the report behind this dialog.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddReturnGood()"
          (visibleChange)="ddReturnGood.set($event)"
          header="Focus comes back"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="reportReturnGood()"
        >
          <p class="dlg__text">Press <kbd>Esc</kbd> and look at the report behind this dialog.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddPassiveBad()"
          (visibleChange)="ddPassiveBad.set($event)"
          header="Token"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close the definition"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '22rem' }"
          (onHide)="restoreFocus('dd-passive-bad-trigger')"
        >
          <p class="dlg__text">A token is the chunk a model actually reads — roughly a word-piece.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddModalBad()"
          (visibleChange)="ddModalBad.set($event)"
          header="Not really modal"
          [modal]="false"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-modal-bad-trigger')"
        >
          <p class="dlg__text">Scroll the page behind this — it moves.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddModalGood()"
          (visibleChange)="ddModalGood.set($event)"
          header="Really modal"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Close"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-modal-good-trigger')"
        >
          <p class="dlg__text">Scroll the page behind this — it does not move.</p>
        </p-dialog>

        <h3>Write the dialog like a question, not a window</h3>
        <ul>
          <li>
            <strong>The header is the question.</strong> "Delete this draft?" beats "Confirmation". It is also the
            accessible name, so it is the first thing a screen reader announces.
          </li>
          <li>
            <strong>The buttons are the answers.</strong> Verb-first and specific — "Delete", "Keep the draft" — never
            "OK"/"Cancel" over a destructive action.
          </li>
          <li><strong>One dialog, one decision.</strong> If your dialog has tabs, it is a page.</li>
          <li>
            <strong>Do not stack dialogs.</strong> Optimus supports it (the Escape listener compares z-indexes and
            closes the topmost only), which is not the same as it being usable.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — the contract this guide checks Optimus against: the dialog is named, focus moves into it on open,
            <kbd>Tab</kbd> stays inside it, and "when the dialog closes, focus returns to the element that invoked it" —
            the one clause Optimus does not implement.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — "authors MUST ensure that ... content outside the dialog is inert"; the reference for why an unconditional
            <code>aria-modal="true"</code> on a non-modal dialog is a lie, and why blocking scroll is not the same as
            inerting the background.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — the criterion the missing focus return fails: a sequence that "preserves meaning and operability".
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.2 No Keyboard Trap</a
            >
            — a focus trap is only legal because <kbd>Esc</kbd> gets you out; turn <code>closeOnEscape</code> off and
            keep <code>focusTrap</code> on and you have built the failure case.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — the yardstick for the close button's focus ring, measured in both themes in the Design tab.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Dialog element</a
            >
            — what the platform gives you for free (top layer, <code>::backdrop</code>, real inertness, focus
            restoration) and Optimus re-implements by hand; the baseline this guide's gaps are measured against.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — the <code>inert</code> attribute</a
            >
            — the one-line mechanism that would make the background genuinely unavailable, and which no Optimus overlay
            uses.
          </li>
          <li>
            <a href="https://primeng.org/dialog" target="_blank" rel="noopener noreferrer">
              PrimeNG — Dialog component</a
            >
            — the upstream v21 API surface Optimus forks; this guide maps it onto the kit's conventions and then
            verifies it against the shipped source in <code>node_modules</code>.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          A visible dialog is two nested elements plus a body-scroll side effect. Nothing exists in the DOM while it is
          closed — the whole subtree is behind
          <code>&#64;if (renderMask())</code>.
        </p>
        <ul>
          <li>
            <strong>Mask</strong> — <code>div.p-dialog-mask</code>, <code>position: fixed</code>, full viewport,
            <code>display: flex</code>. It also carries the alignment: <code>position="topright"</code> becomes
            <code>justify-content: flex-end; align-items: flex-start</code> on the mask, not a coordinate on the dialog.
            Gets <code>.p-overlay-mask</code> (the tinted layer) only when <code>modal</code> or
            <code>dismissableMask</code> is set, and <code>pointer-events</code> is <code>auto</code> when modal,
            <code>none</code> when not.
          </li>
          <li>
            <strong>Root</strong> — <code>div.p-dialog</code> with <code>[attr.role]="role"</code> (default
            <code>'dialog'</code>), <code>aria-labelledby</code>, a hard-coded <code>aria-modal="true"</code>, and the
            <code>pFocusTrap</code> directive.
          </li>
          <li>
            <strong>Focus sentinels</strong> — two <code>span.p-hidden-accessible.p-hidden-focusable</code> nodes that
            <code>pFocusTrap</code> prepends and appends to the root; focusing one wraps you to the other end. That is
            the whole trap.
          </li>
          <li>
            <strong>Header</strong> — <code>div.p-dialog-header</code> (only with <code>showHeader</code>), containing
            <code>span.p-dialog-title</code> whose <code>id</code> is the <code>aria-labelledby</code> target, and
            <code>div.p-dialog-header-actions</code> with the maximize and close <code>p-button</code>s.
          </li>
          <li>
            <strong>Content</strong> — <code>div.p-dialog-content</code>: your projected content, and the element
            Optimus searches first when it moves focus on open.
          </li>
          <li>
            <strong>Footer</strong> — <code>div.p-dialog-footer</code>, rendered only if a footer template exists.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from the inline template in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-dialog.mjs</code> (mask 1007-1020, root 1022-1042, header 1049-1102, content
          1103-1106, footer 1107-1110), the mask inline styles at 22-47, and the sentinel spans in
          <code>openng-optimus-ui-focustrap.mjs</code> (<code>createHiddenFocusableElements</code>), and confirmed against
          computed style and the accessibility tree.
        </p>
        <p class="src-note">
          <strong>Where the mask lives.</strong> The mask's <code>parentElement</code> is the
          <code>&lt;p-dialog&gt;</code> host, not <code>&lt;body&gt;</code>: <code>appendTo</code> resolves to
          <code>config.overlayAppendTo()</code>, which is <code>'self'</code> (<code>openng-optimus-ui-config.mjs:88</code>), and
          <code>appendContainer()</code> moves the wrapper to the body <em>only</em> when it is not
          (<code>openng-optimus-ui-dialog.mjs:927-931</code>). The consequence follows from the source: the mask is
          <code>position: fixed</code>, so an ancestor with <code>display: none</code>, <code>transform</code>,
          <code>filter</code> or <code>contain</code> hides or reframes the whole overlay — a dialog declared inside a
          hidden tab panel can open at 0×0 and never reach the accessibility tree. <code>appendTo="body"</code> is the
          escape hatch.
        </p>

        <h3>Tokens and measured values</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Aura token</th>
                <th>Computed value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>mask background</td>
                <td>
                  <code>&#123;mask.background&#125;</code> — light <code>rgba(0,0,0,0.4)</code>, dark
                  <code>rgba(0,0,0,0.6)</code>
                </td>
                <td>light <strong>rgba(0, 0, 0, 0.4)</strong>, dark <strong>rgba(0, 0, 0, 0.6)</strong></td>
              </tr>
              <tr>
                <td>mask transition</td>
                <td><code>&#123;mask.transitionDuration&#125;</code> = 0.3s</td>
                <td>
                  computed <code>transition-duration: 0s</code> at rest — the enter/leave motion is class-driven, not a
                  standing transition
                </td>
              </tr>
              <tr>
                <td>dialog background</td>
                <td><code>&#123;overlay.modal.background&#125;</code></td>
                <td>
                  Aura's stock <code>surface.0</code> (#ffffff) light / <code>surface.900</code> (zinc #18181b) dark — the
                  visual styles do not replace Aura's surface scale
                </td>
              </tr>
              <tr>
                <td>dialog radius</td>
                <td>
                  <code>&#123;overlay.modal.border.radius&#125;</code> = <code>&#123;border.radius.xl&#125;</code> =
                  12px
                </td>
                <td>Set per visual style in <code>styles.scss</code> — see the note below</td>
              </tr>
              <tr>
                <td>dialog shadow</td>
                <td><code>0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)</code></td>
                <td>Set per visual style in <code>styles.scss</code> — see the note below</td>
              </tr>
              <tr>
                <td>header padding / gap</td>
                <td><code>&#123;overlay.modal.padding&#125;</code> = 1.25rem / 0.5rem</td>
                <td>padding 20px; computed <code>gap: normal</code>, so the 0.5rem header gap never materializes</td>
              </tr>
              <tr>
                <td>title</td>
                <td>font-size 1.25rem, weight 600</td>
                <td>20px / 600</td>
              </tr>
              <tr>
                <td>content padding</td>
                <td><code>0 1.25rem 1.25rem 1.25rem</code></td>
                <td>0px 20px 20px</td>
              </tr>
              <tr>
                <td>footer padding / gap</td>
                <td><code>0 1.25rem 1.25rem 1.25rem</code> / 0.5rem</td>
                <td>0px 20px 20px, gap 8px</td>
              </tr>
              <tr>
                <td>close button box</td>
                <td>
                  a <code>p-button</code> with
                  <code>&#123; severity: 'secondary', variant: 'text', rounded: true &#125;</code>
                </td>
                <td>40 × 40 px — clears the WCAG 2.5.8 24px floor</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names from <code>&#64;openng/optimus-ui-themes/dist/aura/dialog/index.mjs</code> resolved against
          <code>&#8230;/aura/base/index.mjs</code>; the right-hand column is computed style on an open dialog, read
          after the enter transition had finished. <strong>Re-measuring these is a trap worth knowing:</strong> read
          them in the same tick as the open and you get the <em>starting</em> values of the animation, not the resting
          ones.
        </p>
        <p class="src-note">
          <strong>The frame belongs to the visual style.</strong> Each style block in <code>styles.scss</code>
          (<code>html.style-&lt;name&gt; .p-dialog</code>) sets the dialog's border, radius, and shadow in its own
          outline language — <code>werkbund</code> draws a <code>--style-bw</code> border in
          <code>--style-outline</code>, radius 0, and an 8px offset shadow in <code>--style-offset</code>. The mask,
          padding, and typography stay Aura's; <code>.p-overlay-mask</code> is not overridden. Restyle a dialog per call
          site through <code>styleClass</code>, and expect the style block to win on border, radius, and shadow unless
          your selector is more specific.
        </p>

        <h3>The focus ring on the close button</h3>
        <p>
          The close button is a real <code>p-button</code>, so it gets the kit's button focus ring:
          <code>.p-button:focus-visible</code> is one selector of the single ring rule in <code>styles.scss</code>,
          2px solid <code>--primary-color-fg</code> at 2px offset with <code>!important</code>. That draws over the
          library's own ring for a secondary text button (1px solid <code>&#123;surface.600&#125;</code> /
          <code>&#123;surface.300&#125;</code>). On a focused close button:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Theme</th>
                <th>outline</th>
                <th>outline-offset</th>
                <th>box-shadow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>light</td>
                <td>2px solid <code>--primary-color-fg</code> (the kit ring)</td>
                <td>2px</td>
                <td>none</td>
              </tr>
              <tr>
                <td>dark</td>
                <td>2px solid <code>--primary-color-fg</code> (the dark accent foreground)</td>
                <td>2px</td>
                <td>none</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gated in <code>docs/generated/CONTRAST.MD</code>, row <code>focus ring</code> on
          <code>dialog.background</code>: 5.18–17.85:1 light, 6.40–16.93:1 dark across the styles and accents. To
          check it in your own build: focus the close button and read the computed <code>outline</code>, once per
          theme. Toggle the theme and let a frame pass before re-reading — the class swap
          does not land in the same tick.
        </p>

        <h3>Position is a mask alignment, not a coordinate</h3>
        <p>
          <code>position</code> takes <code>'center'</code> (default), <code>'top'</code>, <code>'bottom'</code>,
          <code>'left'</code>, <code>'right'</code> and the four corners. It is implemented as
          <code>justify-content</code> / <code>align-items</code> on the flex mask, so the dialog keeps its own width
          and simply parks in that corner. Two practical consequences: a <code>top</code> dialog stays reachable when
          the on-screen keyboard eats the lower half of a phone screen, and a <code>position</code> plus a large
          <code>maxHeight</code> is a better long-content answer than <code>maximizable</code>.
        </p>

        <h3>Width: pick a viewport width AND a cap</h3>
        <p>
          A dialog has no default width — it shrink-wraps its content, which on a 1440px screen means a two-sentence
          dialog can be 1000px wide and a long one can hit the viewport edge. The kit convention is
          <code>[style]="&#123; width: '90vw', maxWidth: '&#8230;' &#125;"</code>: <code>vw</code> for phones,
          <code>maxWidth</code> for desktops. A bare <code>width: '400px'</code> is the failure case — no cap means
          nothing on a wide screen, and no <code>vw</code> means an overflow at 360 px.
          <code>[breakpoints]</code> exists for per-screen widths and injects a <code>&lt;style&gt;</code> element at
          runtime; two values usually beat a map.
        </p>
        <p class="src-note">
          <code>breakpoints</code> → <code>createStyle()</code> (<code>openng-optimus-ui-dialog.mjs:704-728</code>), which appends
          a <code>&lt;style&gt;</code> to <code>document.head</code> guarded by <code>isPlatformBrowser</code>.
        </p>

        <h3>Motion</h3>
        <p>
          The dialog enters with the <code>p-dialog</code> motion preset and the mask with
          <code>p-overlay-mask-enter-active</code>; both are CSS-driven (<code>pMotion</code>). PrimeNG 22 had dropped
          <code>transitionOptions</code>; Optimus keeps the v21 input, but it only sets the fallback delay of the
          focus move — tune motion via <code>[motionOptions]</code> and <code>[maskMotionOptions]</code>. Measured transition on
          the dialog root: <strong>transition-property <code>all</code>, transition-duration <code>0s</code></strong
          >. Respect <code>prefers-reduced-motion</code> at the app level if you tune this — a scaling, fading overlay
          is exactly the kind of motion that triggers vestibular symptoms.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 2.5.8 for the close button at 40 × 40 px, and SC 2.4.7 together with SC 1.4.11
          for its ring — the kit's 2px <code>--primary-color-fg</code> ring at 2px offset, lowest 5.18:1 on the panel;
          the close icon lowest 5.21:1, panel text 10.35 / 17.72:1, and the style's outline 3.85–18.73:1 on the page
          (the "focus ring", "dialog", and "panel outline" rows of <code>docs/generated/CONTRAST.MD</code>).
          <strong>Failing:</strong> SC 2.4.3 — nothing records or restores the opener, and after Escape the
          measured <code>activeElement</code> is <code>document.body</code>, so a keyboard user lands back at the top of
          the page. <strong>Conditional:</strong> SC 4.1.2 — <code>[header]</code> names the dialog, but with
          <code>[showHeader]="false"</code> the measured name is empty and an unset <code>closeAriaLabel</code> leaves
          the close button unnamed, while <code>aria-modal</code> is a literal that still reads true under
          <code>[modal]="false"</code>, where the mask blocks neither pointer nor scroll; and SC 2.1.2, where the trap
          is legal only because Escape releases it — <code>closeOnEscape</code> off with <code>focusTrap</code> on is
          the failure case. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>DialogModule</code> exports the <code>&lt;p-dialog&gt;</code> component. Content is projected, so the
          dialog body is written where the dialog is declared — there is no service, no component factory, nothing to
          register. (The library also ships <code>DialogService</code> + <code>DynamicDialog</code> for opening a component
          imperatively — a separate API with its own, different focus contract; nothing in this guide transfers to it
          unchecked.)
        </p>

        <h3>Core inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code></td>
                <td>
                  Two-way (<code>[(visible)]</code>) or split into <code>[visible]</code> +
                  <code>(visibleChange)</code>. Setting it true is what mounts the whole subtree.
                </td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td>—</td>
                <td>The title text <em>and</em> the accessible name. Read "Naming" below before you leave it out.</td>
              </tr>
              <tr>
                <td><code>modal</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>
                  Tinted mask, mask click handling, body-scroll block. You almost always want <code>true</code>;
                  the library default is the other one.
                </td>
              </tr>
              <tr>
                <td><code>closable</code></td>
                <td><code>true</code></td>
                <td>Renders the close button — and gates <code>dismissableMask</code> and the Escape listener.</td>
              </tr>
              <tr>
                <td><code>closeOnEscape</code></td>
                <td><code>true</code></td>
                <td>Document-level <kbd>Esc</kbd> handler, bound only when <code>closable</code> is also true.</td>
              </tr>
              <tr>
                <td><code>dismissableMask</code></td>
                <td><code>false</code></td>
                <td>
                  Mask <em>mousedown</em> closes. Only bound when <code>modal</code> and <code>closable</code> are both
                  true.
                </td>
              </tr>
              <tr>
                <td><code>showHeader</code></td>
                <td><code>true</code></td>
                <td>
                  Turning it off removes the title, the close button — and the element the accessible name points at.
                </td>
              </tr>
              <tr>
                <td><code>focusOnShow</code></td>
                <td><code>true</code></td>
                <td>
                  Moves focus into the dialog after the enter transition. Where it lands is not obvious — see below.
                </td>
              </tr>
              <tr>
                <td><code>focusTrap</code></td>
                <td><code>true</code></td>
                <td>
                  Adds the two sentinel spans. Leave it on; a modal without it is a WCAG problem, not a preference.
                </td>
              </tr>
              <tr>
                <td><code>blockScroll</code></td>
                <td><code>false</code></td>
                <td>Documented as "block background scroll" — but see the pitfall: on its own it blocks nothing.</td>
              </tr>
              <tr>
                <td><code>draggable</code> / <code>resizable</code></td>
                <td>
                  <strong><code>true</code></strong> / <strong><code>true</code></strong>
                </td>
                <td>
                  Both mouse-only, both on by default. Kit convention is to turn both off; so should you, unless you
                  also ship a keyboard path.
                </td>
              </tr>
              <tr>
                <td><code>maximizable</code></td>
                <td><code>false</code></td>
                <td>Adds a second header button. Its label comes from the library's ARIA translations, not from you.</td>
              </tr>
              <tr>
                <td><code>position</code></td>
                <td><code>'center'</code></td>
                <td>Alignment on the mask (see Design).</td>
              </tr>
              <tr>
                <td><code>style</code> / <code>styleClass</code></td>
                <td>—</td>
                <td>Inline style / class on the dialog root. Width lives here.</td>
              </tr>
              <tr>
                <td><code>contentStyle</code> / <code>contentStyleClass</code></td>
                <td>—</td>
                <td>On <code>.p-dialog-content</code> — where you put <code>overflow</code> for a scrolling body.</td>
              </tr>
              <tr>
                <td><code>maskStyle</code> / <code>maskStyleClass</code></td>
                <td>—</td>
                <td>On the mask.</td>
              </tr>
              <tr>
                <td><code>closeAriaLabel</code></td>
                <td><strong>none</strong></td>
                <td>The close button's accessible name. There is no fallback — see i18n.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>'self'</code> (from the global config)</td>
                <td>
                  <code>'body'</code> escapes a clipping or transformed ancestor. New in the v21 config; older PrimeNG
                  appended to body by default.
                </td>
              </tr>
              <tr>
                <td><code>baseZIndex</code> / <code>autoZIndex</code></td>
                <td><code>0</code> / <code>true</code></td>
                <td>Layering. The Escape handler uses the z-index to decide which stacked dialog closes.</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td><code>'dialog'</code></td>
                <td>
                  Set <code>'alertdialog'</code> only for a genuine interruption — or use <code>p-confirmdialog</code>.
                </td>
              </tr>
              <tr>
                <td><code>breakpoints</code></td>
                <td>—</td>
                <td>A width map per media query; injects a runtime <code>&lt;style&gt;</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults read from the class fields in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-dialog.mjs</code> (<code>draggable</code> :152, <code>resizable</code> :157,
          <code>modal</code> :172, <code>closeOnEscape</code> :177, <code>dismissableMask</code> :182,
          <code>closable</code> :192, <code>showHeader</code> :217, <code>blockScroll</code> :222,
          <code>focusOnShow</code> :247, <code>focusTrap</code> :262, <code>role</code> :375) and cross-checked against
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-dialog.d.ts</code>
          (Optimus UI 2.0.2).
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>visibleChange</code></td>
                <td>Any visibility change — including the close button, <kbd>Esc</kbd> and the mask.</td>
              </tr>
              <tr>
                <td><code>onShow</code></td>
                <td>After the enter transition, right after focus was moved.</td>
              </tr>
              <tr>
                <td><code>onHide</code></td>
                <td>
                  After the leave transition and after teardown. <strong>This is where you restore focus.</strong>
                </td>
              </tr>
              <tr>
                <td><code>onMaximize</code></td>
                <td><code>&#123; maximized: boolean &#125;</code>.</td>
              </tr>
              <tr>
                <td><code>onResizeInit</code> / <code>onResizeEnd</code> / <code>onDragEnd</code></td>
                <td>Mouse gestures only.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Replaces</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#header</code></td>
                <td>The title area — and it receives <code>ariaLabelledBy</code> in its template context. Use it.</td>
              </tr>
              <tr>
                <td><code>#footer</code></td>
                <td>The action row.</td>
              </tr>
              <tr>
                <td><code>#content</code></td>
                <td>Alternative to plain content projection.</td>
              </tr>
              <tr>
                <td><code>#headless</code></td>
                <td>Replaces header, content, and footer entirely — you own all the chrome, including the name.</td>
              </tr>
              <tr>
                <td><code>#closeicon</code> / <code>"maximizeicon"</code> / <code>"minimizeicon"</code></td>
                <td>The three icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ headerTemplateSnippet }}</code></pre>
        <p class="src-note">
          The context object is built at
          <code>openng-optimus-ui-dialog.mjs:1067</code>: <code>context: &#123; ariaLabelledBy: computedAriaLabelledBy() &#125;</code>. This
          is the only supported way to keep your own header markup <em>and</em> a working accessible name.
        </p>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every dialog token is exposed as <code>--p-dialog-*</code>, and — unlike the select — nothing in the kit's
          <code>styles.scss</code> overrides them, so they all take effect. Scope them to a class, never to
          <code>:root</code>.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix comes from <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p', darkModeSelector: '.dark-theme' &#125;
            &#125; &#125;)</code
          >). Because the dialog is rendered where it is declared (<code>appendTo</code> defaults to
          <code>'self'</code>), a component-scoped stylesheet reaches it — but the emulated encapsulation attribute does
          not survive into the dialog's own subtree, so target it with <code>styleClass</code> and a global rule,
          exactly as the kit's call sites do.
        </p>

        <h3>SSR</h3>
        <p>
          Safe by construction: while <code>visible</code> is false, <code>renderMask()</code> is false and the
          component's entire template is empty, so a prerendered route contains no dialog at all. Everything that
          touches the DOM — <code>blockBodyScroll()</code>, the document listeners, <code>createStyle()</code> — runs
          from the enter transition or behind <code>isPlatformBrowser</code>. Your own code is the risk: an
          <code>(onShow)</code> handler that reads <code>document</code> or <code>window</code> needs the usual
          <code>isPlatformBrowser(platformId)</code> guard.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>
        <p>
          This is the section the guide exists for. A modal dialog has a four-clause contract (APG): it is
          <strong>named</strong>, focus <strong>moves in</strong>, focus <strong>stays in</strong>, and focus
          <strong>comes back</strong>. Optimus 2.0.2 implements two and a half of them.
        </p>

        <h4>1. Naming — and the trap in <code>[showHeader]="false"</code></h4>
        <p>Read from the accessibility tree; the mechanics are in the Optimus 2.0.2 source:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Accessible name</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>[header]="'Export your sources'"</code></td>
                <td>&quot;Export your sources&quot;</td>
                <td><strong>Works.</strong> The title span carries the generated id.</td>
              </tr>
              <tr>
                <td><code>[showHeader]="false"</code> + a plain <code>&lt;h2&gt;</code> in the body</td>
                <td>&quot;&quot; (the empty string)</td>
                <td>
                  <strong>Fails.</strong> <code>aria-labelledby</code> is still emitted and points at an id that does
                  not exist.
                </td>
              </tr>
              <tr>
                <td><code>#header</code> + <code>[id]="ariaLabelledBy"</code> on your heading</td>
                <td>&quot;Your own chrome&quot;</td>
                <td><strong>Works.</strong> Your chrome, the dialog's id.</td>
              </tr>
              <tr>
                <td>
                  <code>[header]="''"</code> + <code>[showHeader]="false"</code> +
                  <code>[attr.id]="dlg.computedAriaLabelledBy()"</code> on the heading you draw yourself (<code>#dlg</code> on
                  the <code>&lt;p-dialog&gt;</code>)
                </td>
                <td>that heading's text</td>
                <td>
                  <strong>Works.</strong> The id exists while <code>header() !== null</code> — an unbound header keeps
                  it, but the <code>''</code> guards against a binding that ever evaluates to <code>null</code> silently
                  un-naming the dialog.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>The mechanism.</strong> Optimus splits it in two. <code>ariaLabelledBy</code> is an
          <em>input</em> signal you may set yourself, and what reaches the element is
          <code>computedAriaLabelledBy() = ariaLabelledBy() ?? headerId()</code>
          (<code>openng-optimus-ui-dialog.mjs:380, :515</code>) over
          <code>headerId = computed(() =&gt; this.header() !== null ? this.id + '_header' : null)</code> (:513). An
          unbound <code>header</code> is <code>undefined</code>, and <code>undefined !== null</code>, so the id
          survives with no binding at all. The check is <em>reactive</em>:
          a <code>header</code> bound to an expression that is ever <code>null</code> — a not-yet-loaded translation, a
          cleared model — removes the id and un-names the dialog live, attribute and all, unless you bind
          <code>ariaLabelledBy</code>. The kit's dialogs bind
          <code>[header]="''"</code> to make that state unreachable. The element the library itself would name —
          <code>&lt;span [id]="headerId()"&gt;</code> at :1065-1066 — renders only inside
          <code>*ngIf="showHeader"</code> with no header template projected. The repair is unchanged in shape: a
          template reference variable on the <code>&lt;p-dialog&gt;</code> lets any heading you render claim the id.
        </p>

        <h4>2. Focus in — not where you would guess</h4>
        <p>
          <code>focus()</code> searches, in order, the <strong>content</strong>, then the footer, then the header,
          taking the first focusable element of the first container that has one
          (<code>openng-optimus-ui-dialog.mjs:633-644</code>). So a dialog whose body starts with a text field opens with the
          cursor in that field; a dialog whose body is prose opens with focus on the first footer button; and only a
          dialog with neither falls through to the close button. The three cases:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dialog body</th>
                <th><code>document.activeElement</code> after open</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>text input + footer buttons</td>
                <td>the text field — <code>&lt;input class="dlg__input"&gt;</code>, inside the dialog</td>
              </tr>
              <tr>
                <td>prose only, footer buttons</td>
                <td>the first footer button (&quot;Keep the draft&quot;)</td>
              </tr>
              <tr>
                <td>prose only, no footer, closable</td>
                <td>the close button (&quot;Close&quot;)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>document.activeElement</code> 300 ms after <code>(onShow)</code>. The delay is not optional:
          Optimus moves focus from <code>onAfterEnter</code>, after the enter motion and a short internal
          <code>setTimeout</code>, so anything read in the
          same tick reports the trigger, not the dialog — which is why the playground defers its probe too.
          <strong>Consequence for authors:</strong> if the first focusable thing in your content is destructive, it is
          now the default target of a stray <kbd>Enter</kbd>. Either order the content so the safe control comes first,
          or set <code>[focusOnShow]="false"</code> and move focus yourself.
        </p>

        <h4>3. Focus stays in</h4>
        <p>
          <code>pFocusTrap</code> prepends and appends a hidden, focusable <code>&lt;span&gt;</code> to the dialog root;
          focusing the last one sends you to the first real element and vice versa. Tabbing round a dialog therefore
          never leaves it: <strong>close button → input → Cancel → Save → close button → …</strong>, indefinitely.
        </p>
        <p class="src-note">
          Mechanism in <code>openng-optimus-ui-focustrap.mjs</code> (<code>onFirstHiddenElementFocus</code> /
          <code>onLastHiddenElementFocus</code>). Note what this is <em>not</em>: the background is never inerted, so a
          screen-reader user in browse mode and anything that programmatically focuses an element outside the dialog
          still reach the page behind. With a modal dialog open,
          <strong>nothing outside it gains <code>inert</code> or <code>aria-hidden</code></strong> —
          <code>&lt;main&gt;</code> reports <code>inert</code> <strong>false</strong> and <code>aria-hidden</code>
          <strong>null</strong>. The two real background effects are the class <code>p-overflow-hidden</code> on
          <code>&lt;body&gt;</code> (computed <code>overflow: hidden</code>) and the mask itself: hit-testing a
          background button through <code>document.elementFromPoint</code> returns <code>div.p-dialog-mask</code>, so
          the <em>pointer</em> is blocked — by a div, not by inertness.
        </p>

        <h4>4. Focus back — not implemented</h4>
        <p>
          There is no code in <code>Dialog</code> or in <code>FocusTrap</code> that records the previously focused
          element or restores it. <code>onAfterLeave()</code> tears down listeners, clears the z-index, and emits
          <code>onHide</code> (<code>openng-optimus-ui-dialog.mjs:960-989</code>) — and stops. Open a dialog from a button and
          press <kbd>Esc</kbd>, and <code>document.activeElement</code> is
          <strong><code>document.body</code> — nothing at all</strong>. The Do/Don't pair in the Usage tab reports this
          in your own browser.
        </p>
        <p>
          The fix is four lines, and every overlay needs them. The kit keeps them in one place rather than re-deriving
          them per call site — <code>FocusReturn</code> in <code>src/app/utils/focus-return.ts</code>, capture before
          open, restore from <code>(onHide)</code>:
        </p>
        <pre class="code-block"><code>{{ focusReturnSnippet }}</code></pre>

        <h4>Keyboard</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>
                  Closes — but only when <code>closeOnEscape</code> AND <code>closable</code> are true, and only the
                  dialog whose z-index is currently topmost. The listener is on <code>document</code>, so it fires
                  wherever focus is.
                </td>
              </tr>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd></td>
                <td>Cycles inside the dialog via the sentinel spans.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> on the close button</td>
                <td>Handled explicitly (<code>(keydown.enter)="close($event)"</code>) in addition to the click.</td>
              </tr>
              <tr>
                <td>drag / resize</td>
                <td>
                  <strong>Mouse only.</strong> No keyboard equivalent exists;
                  <code>[draggable]="false" [resizable]="false"</code> is the accessible default.
                </td>
              </tr>
              <tr>
                <td>maximize</td>
                <td>Keyboard-operable (it is a button), but its label comes from the library's ARIA translation table.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Escape handler: <code>bindDocumentEscapeListener()</code>
          (<code>openng-optimus-ui-dialog.mjs:906-919</code>), bound from
          <code>bindGlobalListeners()</code> under <code>if (this.closeOnEscape &amp;&amp; this.closable)</code> (:854).
          With <code>[closable]="false"</code> neither <kbd>Esc</kbd> nor a mask mousedown closes the dialog — the
          playground has a switch for it. <strong>Possible console noise:</strong> <code>close()</code> calls
          <code>event.preventDefault()</code> (<code>openng-optimus-ui-dialog.mjs:645-649</code>); if an
          <kbd>Esc</kbd> close logs <em>"Unable to preventDefault inside passive event listener invocation"</em>, it
          comes from the library, not from your call site.
        </p>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ You can say, in one sentence, why this content interrupts instead of sitting on the page.</li>
          <li>
            ☐ The dialog has an accessible name: <code>[header]</code>, or <code>#header</code> with
            <code>[id]="ariaLabelledBy"</code> on your own heading. Verified in the accessibility tree, not assumed.
          </li>
          <li>☐ <code>[modal]="true"</code> (the library default is <code>false</code>) whenever the task blocks.</li>
          <li>☐ <code>[draggable]="false" [resizable]="false"</code> unless you ship a keyboard path for both.</li>
          <li>☐ <kbd>Esc</kbd> closes it, and <code>[closable]="true"</code> so the listener is actually bound.</li>
          <li>☐ <code>(onHide)</code> returns focus to the element that opened it.</li>
          <li>☐ You know where focus lands on open, and it is not a destructive control.</li>
          <li>☐ <code>closeAriaLabel</code> is set and translated — there is no default.</li>
          <li>
            ☐ Width is <code>vw</code> + <code>maxWidth</code>; the body scrolls via <code>contentStyle</code>, the
            dialog does not overflow the viewport at 360 px.
          </li>
          <li>☐ Focus is visible on the close button in <strong>both</strong> themes.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the two rules this guide exists for — the dialog is
          named, and the name resolves to a real element:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Four strings, and one of them has no default</h3>
        <ul>
          <li>
            <strong><code>header</code></strong> — the title and the accessible name. Bind it to the kit's
            <code>TranslationService</code> through a <code>computed()</code>, or it freezes on a language switch.
          </li>
          <li>
            <strong><code>closeAriaLabel</code></strong> — the close button's name. Optimus binds
            <code>[ariaLabel]="closeAriaLabel"</code> with
            <strong>no default and no translation fallback</strong> (<code>openng-optimus-ui-dialog.mjs:304, :1099</code>), unlike the
            maximize/minimize buttons, which read <code>config.getTranslation(TranslationKeys.ARIA)</code> (:548-553).
            Left unset, the close button's accessible name is <strong>&quot;&quot; — the empty string</strong>.
          </li>
          <li>
            <strong>Your footer button labels</strong> — verb-first, translated, and long enough to wrap. German runs
            20-40% longer than English ("Delete" → "Unwiderruflich löschen").
          </li>
          <li><strong>The body</strong> — ordinary content; nothing dialog-specific.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Two rules follow, and they are easy to get backwards. <code>closeAriaLabel</code> only reaches something when
          the dialog actually renders its close button — with <code>[showHeader]="false"</code> there is no button for the
          label to land on, and setting it there is a no-op that reads like a fix. Conversely, any dialog that
          <em>does</em> keep the built-in close button and leaves the label unset ships a control named
          <strong>&quot;&quot;</strong>. Bind it through the kit's <code>TranslationService</code>, the same way as the
          header.
        </p>

        <h3>The library's own strings</h3>
        <p>
          The maximize/minimize labels come from the library's own ARIA table, not from your bindings.
          <code>app.config.ts</code> passes <code>provideOptimus</code> no <code>translation</code> block — a static one
          could not follow a language switch anyway. The kit instead pushes the strings through
          <code>Optimus.setTranslation</code> whenever the language changes, sourced from an <code>i18n</code> module
          per language (<code>optimus.json</code>), so a maximizable dialog announces the current language:
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> merges one level deep only, so the <code>aria</code>
          block is replaced wholesale — spread the current one first or the keys you did not list are lost. Only the
          vocabulary the rendered components actually read is translated; the library's date, filter, and file-upload strings
          stay at their English defaults on purpose.
        </p>

        <h3>Length: the dialog grows, the header does not wrap nicely</h3>
        <p>
          A dialog sized <code>90vw / maxWidth</code> handles a long translated body fine — it is the
          <em>header</em> and the <em>footer row</em> that break first: the title sits in a flex row next to the header
          actions, and two long button labels side by side will overflow a 24 rem dialog on a phone. Test the longest
          language you ship at 360 px, and let the footer buttons stack (<code>flex-wrap: wrap</code> on
          <code>.p-dialog-footer</code>, or full-width buttons on mobile, which is the kit's general rule for
          interactive UIs).
        </p>

        <h3>RTL</h3>
        <p>
          The dialog exposes an <code>rtl</code> input, and the header/footer are flex rows that reverse with
          <code>direction: rtl</code>; the <code>position</code> values <code>'left'</code>/<code>'right'</code> are
          <em>physical</em>, though — they map to <code>justify-content: flex-start</code>/<code>flex-end</code>, not to
          logical start/end. A downstream RTL locale would need those two values swapped. Not verified by rendering an
          RTL locale — the kit ships none.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the close button takes the
            kit's 2px <code>--primary-color-fg</code> ring (gated on the panel, lowest 5.18:1) in place of the 1px
            secondary ring; close icon lowest 5.21:1.
          </li>
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Contrast quoted from the gated CONTRAST.MD "dialog" and "panel
            outline" rows instead of the stock palette; the panel fill corrected to Aura's stock surface, which the
            styles do not replace.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — The agent doc now also covers <code>dynamicdialog</code>
            (<code>DialogService</code>, the <code>closable</code> trap, the <code>!== false</code> defaults) and
            <code>focustrap</code> (<code>pFocusTrap</code> against the kit's <code>cdkTrapFocus</code>).
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Corrected "styles.scss has no .p-dialog rule": every visual style sets the dialog frame
            (border, radius, shadow). Colors restated as tokens (ADR-0016); the config line
            reference for overlayAppendTo is :88; "measured on 21.1.9" notes removed; history
            ordered newest first.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Two v22 claims flipped back:
            <code>pTemplate</code> binds again (the v21 <code>PrimeTemplate</code> query survived the fork) and
            <code>transitionOptions</code> exists again, now only as the fallback delay of the focus move. Naming was
            modernized instead: <code>ariaLabelledBy</code> is an <em>input</em> signal and the id on
            <code>aria-labelledby</code> is <code>computedAriaLabelledBy() = ariaLabelledBy() ?? headerId()</code>, so
            the kit's hand-chromed dialogs now read <code>dlg.computedAriaLabelledBy()</code>. The
            <code>scrollBlockerActive</code> computed is gone (template binds <code>modal || blockScroll</code>
            directly), inputs are plain properties again, and every source line reference was re-derived against the
            <code>openng-optimus-ui-*</code> bundles. Aura tokens are back on 2.x values — the dialog title is 1.25rem
            and the footer gap 0.5rem again. Browser measurements (focus ring, computed styles, accessibility tree)
            were not re-taken.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1. <code>ariaLabelledBy</code> is a
            computed signal now (invoke it; a header that is ever <code>null</code> un-names the dialog live — the kit's
            dialogs bind <code>[header]="''"</code> as the guard). <code>pTemplate</code> binds nothing in v22 — all
            templates moved to reference names (<code>#header</code>, <code>#footer</code>).
            <code>transitionOptions</code> is gone; focus waits for the enter motion. All source line references
            re-derived against 22.1.2; the passive-listener console note downgraded to measured-on-21. Aura dialog
            tokens: title 1.25→1.125rem, footer gap 0.5→0.375rem; the rest carries over.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Call-site inventories replaced by the kit's house style and the
            <code>FocusReturn</code> pattern pointer; i18n section corrected to the runtime
            <code>setTranslation</code> path.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: container decision table, focus playground, four
            Do/Don't pairs, Aura design values, agent doc.
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
      kbd {
        font-family: var(--font-mono);
        font-size: 0.8em;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-bottom-width: 2px;
        border-radius: var(--radius-sm);
        padding: 0.05em 0.4em;
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
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__field--switch label {
        flex: 1;
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }
      .pg__field p-select {
        width: 100%;
      }
      .pg__preview {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
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
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      @media (max-width: 640px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      .probe {
        width: 100%;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.15rem;
      }
      .probe dt {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-color-secondary);
      }
      .probe dd {
        margin: 0 0 0.5rem;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-color);
        overflow-wrap: anywhere;
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
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .dd__probe {
        font-size: 0.75rem;
        font-family: var(--font-mono);
        color: var(--text-color-secondary);
        overflow-wrap: anywhere;
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

      .disclosure {
        appearance: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.8rem;
        font-family: inherit;
        font-size: 0.9rem;
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      .disclosure:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .disclosure__panel {
        font-size: 0.9rem;
        color: var(--text-color);
      }

      /* --- Dialog bodies --- */
      .dlg__text {
        margin: 0;
        line-height: 1.6;
      }
      .dlg__hint {
        margin: 0.6rem 0 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .dlg__label {
        display: block;
        margin-bottom: 0.35rem;
        font-size: 0.85rem;
        font-weight: var(--font-weight-medium);
      }
      .dlg__input {
        width: 100%;
      }
      .dlg__own-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }
      .dlg__own-title {
        margin: 0;
        font-size: 1.1rem;
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
export class DialogArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;
  /** Every deferred focus probe, so none of them outlives the component. */
  private readonly probeTimers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      for (const t of this.probeTimers) clearTimeout(t);
      this.probeTimers.clear();
    });
  }

  /**
   * Schedule a focus probe. The reads are deferred on purpose — the library moves
   * focus on a `setTimeout` of its own, and at `(onHide)` time the dialog
   * subtree is still attached — so every one of them has to be cancellable.
   */
  private probeLater(fn: () => void, delay: number): void {
    const t = setTimeout(() => {
      this.probeTimers.delete(t);
      fn();
    }, delay);
    this.probeTimers.add(t);
  }

  // --- Playground state ------------------------------------------------------
  readonly positionOptions: { label: string; value: DialogPosition }[] = [
    { label: 'center', value: 'center' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' },
    { label: 'topright', value: 'topright' },
    { label: 'bottomleft', value: 'bottomleft' },
  ];

  readonly pgVisible = signal(false);
  readonly pgModal = signal(true);
  readonly pgShowHeader = signal(true);
  readonly pgClosable = signal(true);
  readonly pgCloseOnEscape = signal(true);
  readonly pgDismissableMask = signal(true);
  readonly pgFocusOnShow = signal(true);
  readonly pgFocusTrap = signal(true);
  readonly pgMaximizable = signal(false);
  readonly pgBodyFocusable = signal(true);
  readonly pgPosition = signal<DialogPosition>('center');
  readonly pgName = signal('Sources for chapter 4');

  readonly pgFocusOpenReport = signal('— open the dialog to measure —');
  readonly pgFocusCloseReport = signal('— close it to measure —');

  /**
   * The playground's live evidence widget. `document.activeElement` is read 300 ms
   * after `(onShow)` because Optimus moves focus from onAfterEnter, once the enter
   * motion completes — reading earlier reports the trigger button and would make
   * this guide lie in the reader's own browser.
   */
  openPlayground(): void {
    this.pgFocusOpenReport.set('measuring…');
    this.pgFocusCloseReport.set('— close it to measure —');
    this.pgVisible.set(true);
  }

  reportFocusAfterOpen(): void {
    this.probeLater(() => this.pgFocusOpenReport.set(this.describeActiveElement()), 300);
  }

  reportFocusAfterClose(): void {
    // Deferred like the open probe: at `(onHide)` time the dialog subtree is
    // still attached and its element still focused, so an immediate read would
    // report a focus that is about to vanish.
    this.probeLater(() => this.pgFocusCloseReport.set(this.describeActiveElement()), 250);
  }

  /** SSR-safe description of the focused element, for the live focus probes. */
  private describeActiveElement(): string {
    if (typeof document === 'undefined') return 'not measurable during server rendering';
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'nothing — document.body (focus was lost)';
    // A detached node can still be document.activeElement for a few frames after
    // the dialog is torn down. Reporting it as "focused" would flatter the library.
    if (!el.isConnected) return 'nothing — the focused element was removed with the dialog';
    const tag = el.tagName.toLowerCase();
    const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)[0];
    const name = el.getAttribute('aria-label') ?? (el.textContent ?? '').trim().slice(0, 28);
    const where = el.closest('.p-dialog') ? 'inside the dialog' : 'outside the dialog';
    return `<${tag}${cls ? '.' + cls : ''}>${name ? ` "${name}"` : ''} — ${where}`;
  }

  /** The fix this guide argues for: hand focus back to the element that opened. */
  restoreFocus(triggerId: string): void {
    if (typeof document === 'undefined') return;
    const trigger = document.getElementById(triggerId);
    // The library's <p-button> renders a real <button> inside the host element.
    const focusable = trigger?.matches('button') ? trigger : (trigger?.querySelector('button') ?? trigger);
    focusable?.focus();
  }

  // --- Example dialogs -------------------------------------------------------
  readonly exBasic = signal(false);
  readonly exForm = signal(false);
  readonly exFormTitle = signal('Attention is all you need');
  readonly exHeadless = signal(false);
  readonly exNonModal = signal(false);

  // --- Do / Don't dialogs ----------------------------------------------------
  readonly ddNameBad = signal(false);
  readonly ddNameGood = signal(false);
  readonly ddReturnBad = signal(false);
  readonly ddReturnGood = signal(false);
  readonly ddPassiveBad = signal(false);
  readonly ddPassiveOpen = signal(false);
  readonly ddModalBad = signal(false);
  readonly ddModalGood = signal(false);

  readonly ddReturnBadReport = signal('— not measured yet —');
  readonly ddReturnGoodReport = signal('— not measured yet —');

  openReturnBad(): void {
    this.ddReturnBadReport.set('measuring…');
    this.ddReturnBad.set(true);
  }

  openReturnGood(): void {
    this.ddReturnGoodReport.set('measuring…');
    this.ddReturnGood.set(true);
  }

  /**
   * No restore — this is the "Don't", and the report shows what it costs. The
   * read is deferred one macrotask: at `(onHide)` time the removed close button
   * can still be `document.activeElement`, and reporting that would flatter
   * the library.
   */
  reportReturnBad(): void {
    this.probeLater(() => this.ddReturnBadReport.set(this.describeActiveElement()), 250);
  }

  /** Restore first, then report — the "Do". */
  reportReturnGood(): void {
    this.restoreFocus('dd-return-good-trigger');
    this.probeLater(() => this.ddReturnGoodReport.set(this.describeActiveElement()), 250);
  }

  // --- Generated markup ------------------------------------------------------
  readonly pgCode = computed(() => {
    const attrs: string[] = ['[(visible)]="visible"'];
    if (this.pgShowHeader()) attrs.push('[header]="t(\'rename.title\')"');
    else attrs.push('[showHeader]="false"');
    attrs.push(`[modal]="${this.pgModal()}"`);
    if (!this.pgClosable()) attrs.push('[closable]="false"');
    if (!this.pgCloseOnEscape()) attrs.push('[closeOnEscape]="false"');
    if (this.pgDismissableMask()) attrs.push('[dismissableMask]="true"');
    if (!this.pgFocusOnShow()) attrs.push('[focusOnShow]="false"');
    if (!this.pgFocusTrap()) attrs.push('[focusTrap]="false"');
    if (this.pgMaximizable()) attrs.push('[maximizable]="true"');
    if (this.pgPosition() !== 'center') attrs.push(`position="${this.pgPosition()}"`);
    attrs.push(
      '[draggable]="false"',
      '[resizable]="false"',
      '[closeAriaLabel]="t(\'ui.close\')"',
      `[style]="{ width: '90vw', maxWidth: '28rem' }"`,
      '(onHide)="restoreFocus(\'rename-trigger\')"',
    );
    const warn = this.pgShowHeader()
      ? ''
      : '<!-- No header: this dialog has NO accessible name. See the Usage tab. -->\n';
    return `${warn}<p-dialog\n  ${attrs.join('\n  ')}>\n  …\n</p-dialog>`;
  });

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'The baseline: a question with two answers',
      note: 'Header as the question, verb-first buttons, focus handed back on close.',
      code: `<p-button id="delete-trigger" [label]="t('draft.delete')"
  severity="danger" [outlined]="true" (onClick)="confirmVisible.set(true)" />

<p-dialog
  [(visible)]="confirmVisible"
  [header]="t('draft.deleteQuestion')"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [closeAriaLabel]="t('ui.close')"
  [style]="{ width: '90vw', maxWidth: '26rem' }"
  (onHide)="restoreFocus('delete-trigger')">
  <p>{{ t('draft.deleteBody') }}</p>
  <ng-template #footer>
    <p-button [label]="t('draft.keep')" severity="secondary" [text]="true"
      (onClick)="confirmVisible.set(false)" />
    <p-button [label]="t('draft.delete')" severity="danger" (onClick)="remove()" />
  </ng-template>
</p-dialog>`,
    },
    {
      id: 'form',
      title: 'A form in a dialog — mind where focus lands',
      note: 'The first focusable element of the CONTENT wins, so the cursor starts in the text field, not on the close button.',
      code: `<p-dialog [(visible)]="editVisible" [header]="t('title.edit')" [modal]="true"
  [draggable]="false" [resizable]="false" [closeAriaLabel]="t('ui.close')"
  [style]="{ width: '90vw', maxWidth: '30rem' }"
  (onHide)="restoreFocus('edit-trigger')">
  <label for="edit-title">{{ t('title.label') }}</label>
  <input pInputText id="edit-title" [(ngModel)]="title" />
  <ng-template #footer>
    <p-button [label]="t('ui.cancel')" severity="secondary" [text]="true"
      (onClick)="editVisible.set(false)" />
    <p-button [label]="t('title.save')" (onClick)="save()" />
  </ng-template>
</p-dialog>`,
    },
    {
      id: 'headless',
      title: 'Your own header — without losing the name',
      note: '#header hands you the generated ariaLabelledBy id in its context. Put it on your heading — and leave showHeader alone, because the template lives inside its *ngIf.',
      code: `<p-dialog [(visible)]="mapVisible" [modal]="true"
  [draggable]="false" [resizable]="false" [closeAriaLabel]="t('ui.close')"
  [style]="{ width: '92vw', maxWidth: '40rem' }"
  (onHide)="restoreFocus('map-trigger')">
  <ng-template #header let-ariaLabelledBy="ariaLabelledBy">
    <div class="own-header">
      <i class="pi pi-map" aria-hidden="true"></i>
      <h2 [id]="ariaLabelledBy">{{ t('map.title') }}</h2>
    </div>
  </ng-template>
  …
</p-dialog>`,
    },
    {
      id: 'nonmodal',
      title: 'Non-modal — and why it is rarely what you want',
      note: 'The page keeps working behind it, but the dialog still writes aria-modal="true". If it does not block, prefer a popover or a panel.',
      code: `<!-- Reported honestly: aria-modal="true" is a template literal in Optimus (v21 code),
     so this dialog claims modality it does not have. -->
<p-dialog [(visible)]="tipVisible" [header]="t('tip.title')" [modal]="false"
  position="topright" [draggable]="true" [resizable]="false"
  [closeAriaLabel]="t('ui.close')"
  [style]="{ width: '90vw', maxWidth: '24rem' }" />`,
    },
  ];

  readonly devImport = `import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  standalone: true,
  imports: [DialogModule, ButtonModule],
  // ...
})`;

  readonly headerTemplateSnippet = `<!-- showHeader stays TRUE: the header template renders inside its *ngIf,
     and this is what keeps the close button too. -->
<p-dialog [(visible)]="visible" [modal]="true">
  <!-- The context object carries the dialog's generated id. -->
  <ng-template #header let-ariaLabelledBy="ariaLabelledBy">
    <div class="my-header">
      <i class="pi pi-map" aria-hidden="true"></i>
      <h2 [id]="ariaLabelledBy">Knowledge map</h2>
    </div>
  </ng-template>
  …
</p-dialog>`;

  readonly themingSnippet = `/* Scoped to one dialog via styleClass — global rule, because the dialog's
   subtree does not carry the component's encapsulation attribute. */
.report-dialog {
  --p-dialog-border-radius: 8px;
  --p-dialog-header-padding: 1rem;
  --p-dialog-content-padding: 0 1rem 1rem 1rem;
  --p-dialog-title-font-size: 1.05rem;
}

/* A dialog whose body must scroll: cap the dialog, scroll the content. */
.report-dialog .p-dialog-content { overflow: auto; }

/* template */
<p-dialog styleClass="report-dialog"
  [style]="{ width: '90vw', maxWidth: '40rem', maxHeight: '80vh' }" … />`;

  readonly focusReturnSnippet = `// The whole utility: remember what had focus, hand it back.
export class FocusReturn {
  private trigger: HTMLElement | null = null;

  capture(): void {
    if (typeof document === 'undefined') return;              // SSR
    const active = document.activeElement;
    // <body> means "nothing focused" — capturing it would restore the bug.
    this.trigger =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }

  restore(): void {
    // A detached trigger cannot take focus; focus() on it silently lands on <body>.
    if (this.trigger?.isConnected) this.trigger.focus();
  }
}

// Component
private readonly focusReturn = new FocusReturn();

open(): void { this.focusReturn.capture(); this.visible.set(true); }

// (onHide) runs after the leave transition, for every close path:
// the close button, Esc, and the dismissable mask.
onHide(): void { this.focusReturn.restore(); }

// Template
<p-button label="Rename" (onClick)="open()" />
<p-dialog [(visible)]="visible" … (onHide)="onHide()"> … </p-dialog>`;

  readonly i18nSnippet = `// Header and close label rebuild on a language switch because they are computed().
readonly labels = computed(() => ({
  header: this.i18n.translate('draft.deleteQuestion'),
  close: this.i18n.translate('ui.close'),
  keep: this.i18n.translate('draft.keep'),
  remove: this.i18n.translate('draft.delete'),
}));

// Template
<p-dialog [header]="labels().header" [closeAriaLabel]="labels().close" … >`;

  readonly primengTranslationSnippet = `// Re-run on every language change, not once at bootstrap.
// Only the maximize/minimize buttons read these. The close button does NOT:
// its label comes from your [closeAriaLabel] and has no fallback.
private syncOptimusAriaStrings(): void {
  const t = (key: string) => this.i18n.translate('optimus.' + key);
  this.primeng.setTranslation({
    aria: {
      // Merge is one level deep: without the spread, every key you
      // do not list here falls back to the library's English default.
      ...(this.primeng.translation.aria ?? {}),
      maximizeLabel: t('maximizeLabel'),
      minimizeLabel: t('minimizeLabel'),
    },
  });
}`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  standalone: true,
  imports: [DialogModule],
  template: \`<p-dialog [(visible)]="visible" header="Delete this draft?"
    [modal]="true">Body</p-dialog>\`,
})
class HostComponent {
  visible = signal(true);
}

describe('dialog accessible name', () => {
  it('names the dialog with an id that actually resolves', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = document.querySelector('.p-dialog')!;
    const id = dialog.getAttribute('aria-labelledby');
    expect(id).toBeTruthy();
    // The regression this guide exists to prevent: [showHeader]="false"
    // leaves this id pointing at nothing.
    expect(document.getElementById(id!)?.textContent).toBe('Delete this draft?');
  });
});`;

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
