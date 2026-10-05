import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PopoverModule } from '@openng/optimus-ui/popover';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    PopoverModule,
    ButtonModule,
    AutoFocusModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    TooltipModule,
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

      /* --- Live focus probe --- */
      .probe {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: var(--space-2) var(--space-3);
        margin: 0 0 var(--space-5);
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--surface-border);
        border-left: 3px solid var(--primary-color-fg);
        border-radius: var(--radius-md);
        background: var(--surface-card);
      }
      .probe__label {
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }
      /* One fixed line box, clipped: the read-out's text changes on every focus
       move, and a popover is positioned exactly ONCE. If this box could grow or
       shrink, the reflow would slide the trigger out from under an open panel. */
      .probe__value {
        flex: 1 1 100%;
        min-width: 0;
        height: 1.5rem;
        line-height: 1.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.82rem;
      }
      .probe__hint {
        flex: 1 1 20rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
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
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .ex__stage--split {
        justify-content: space-between;
        align-items: flex-start;
      }
      .ex__aside {
        flex: 1 1 16rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .prose {
        flex: 1 1 100%;
        line-height: 1.9;
        color: var(--text-color);
      }
      .place {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .place--right {
        margin-left: auto;
        text-align: right;
      }

      .scrollbox {
        max-height: 6.5rem;
        overflow-y: auto;
        padding: var(--space-4);
        margin-bottom: var(--space-3);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-card);
      }
      .scrollbox:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .scrollbox__filler {
        margin: 0 0 var(--space-4);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }

      /* --- Panel content (inside the popovers) --- */
      .panel {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        max-width: 22rem;
        padding: var(--space-3);
      }
      .panel--prose {
        max-width: 24rem;
      }
      .panel--tall {
        max-width: 20rem;
      }
      .panel--wide {
        max-width: 34rem;
      }
      .panel__title {
        margin: 0 0 var(--space-1);
        font-size: 0.95rem;
      }
      .panel__body {
        margin: 0;
        font-size: var(--font-size-sm);
        line-height: 1.55;
      }
      .panel__label {
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
      }
      .panel__row {
        display: flex;
        gap: var(--space-2);
        justify-content: flex-end;
        margin-top: var(--space-2);
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
        border-left: 3px solid var(--semantic-green-fg);
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
      .dd__aside {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
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
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
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
    `;

/**
 * Guide article: Popover — p-popover (SPEC N5, Guides).
 *
 * Renders through app-guide-shell and projects each tab body as an appGuideTab
 * template. Its subject is the anchored, non-modal panel: content that belongs
 * to the thing the user just clicked, shown next to it, with the page still
 * live behind it. The modal case belongs to the Dialog guide and is delineated
 * here rather than re-argued.
 *
 * VERIFIED CLAIMS (measured or read from the shipped source; provenance in the tabs):
 *   - appendTo defaults to 'body' (input('body'),
 *     @openng/optimus-ui/fesm2022/openng-optimus-ui-popover.mjs:80). The JSDoc above it
 *     still says @defaultValue 'self' (:77) - the fork carried the v21 doc/code
 *     mismatch over; the code wins.
 *   - The panel root is role="dialog" with [attr.aria-modal]="overlayVisible"
 *     (:418-419), so an open popover claims modality while nothing is inert,
 *     no mask exists, and no focus trap is installed.
 *   - focusOnShow (default true) focuses the FIRST element carrying the
 *     autofocus ATTRIBUTE: focus() is findSingle(container, '[autofocus]') on a
 *     5 ms timeout (:322-329). And every p-button writes that attribute, because
 *     AutoFocus.onAfterContentChecked sets it unless its input is exactly false
 *     (openng-optimus-ui-autofocus.mjs:23-28) while Button binds it to
 *     `autofocus || buttonProps?.autofocus`, i.e. undefined by default
 *     (openng-optimus-ui-button.mjs:844). So a panel containing buttons focuses its first
 *     button; a panel of plain markup focuses nothing.
 *   - Nothing records or restores the opener; there is no focus trap and no
 *     inertness. With appendTo="body" the panel is the last child of <body>,
 *     so Tab from the trigger continues into the PAGE, not into the panel.
 *   - Escape is a document-level host listener (:342-344) that calls hide()
 *     unconditionally: it cannot be switched off, it fires with focus anywhere
 *     in the document, and it does not restore focus.
 *   - Positioning is one call to absolutePosition (:269) at open time: below the
 *     target and left-aligned, flipped above when target bottom + panel height
 *     exceeds the viewport, right-aligned when the panel would overflow the
 *     right edge. No position input exists. It never re-aligns — a scroll of a
 *     scrollable ancestor of the target hides it (:364-375) and a window resize
 *     hides it on non-touch devices (:345-349).
 *   - ariaCloseLabel is a declared input that no template and no method reads
 *     (:91 is its only occurrence outside the compiled input map) — the panel
 *     ships no close button at all. showTransitionOptions / hideTransitionOptions
 *     are likewise still declared (:107, :113), deprecated since v21 and read by
 *     nothing; motion runs through motionOptions and the p-anchored-overlay
 *     animation.
 *   - p-button renders the clickable <button> INSIDE its own host element, so
 *     an attribute binding written on <p-button> lands on the roleless wrapper.
 *     The inner button binds ptm('root') (openng-optimus-ui-button.mjs:845), so the
 *     disclosure attributes must be routed through [pt].
 *   - Motion is skipped under prefers-reduced-motion because @openng/optimus-ui-motion
 *     defaults `safe` to true and shouldSkipMotion() then returns true — and the
 *     skip path still invokes the enter hooks, so positioning, the document
 *     listeners and focus all still run.
 *
 * The sentinel binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-popover-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'popover'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A popover is a panel anchored to the thing you clicked, with the page still live behind it. Everything below
          is real <code>p-popover</code>: the playground, the live focus read-out that shows where the caret actually
          goes, the panel that flips above its trigger near the bottom of the window, and the one that right-aligns at
          the edge of the screen.
        </p>

        <!-- Live focus read-out -->
        <section class="probe" aria-live="off">
          <span class="probe__label">document.activeElement</span>
          <code class="probe__value">{{ activeDesc() }}</code>
          <span class="probe__hint">
            Open any panel below and watch this line. It is the fastest way to see where focus actually goes: to the
            first element inside the panel carrying the
            <code>autofocus</code> attribute — which, in this library version, is its first <code>p-button</code> unless
            you choose otherwise.
          </span>
        </section>

        <!-- Playground -->
        <section class="pg" aria-label="Popover playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-dismissable">dismissable (outside click closes)</label>
                <p-toggleswitch
                  inputId="pg-dismissable"
                  [ngModel]="pgDismissable()"
                  (ngModelChange)="pgDismissable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autofocus">an element with the autofocus attribute inside</label>
                <p-toggleswitch
                  inputId="pg-autofocus"
                  [ngModel]="pgAutofocus()"
                  (ngModelChange)="pgAutofocus.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-focusonshow">focusOnShow (default on)</label>
                <p-toggleswitch
                  inputId="pg-focusonshow"
                  [ngModel]="pgFocusOnShow()"
                  (ngModelChange)="pgFocusOnShow.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-appendto-label">appendTo</span>
                <p-select
                  [ariaLabelledBy]="'pg-appendto-label'"
                  size="small"
                  [options]="appendToOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAppendTo()"
                  (ngModelChange)="pgAppendTo.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-name">give the panel an accessible name</label>
                <p-toggleswitch inputId="pg-name" [ngModel]="pgNamed()" (ngModelChange)="pgNamed.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <p-button
                  id="pg-trigger"
                  label="Column settings"
                  icon="pi pi-sliders-h"
                  severity="secondary"
                  [outlined]="true"
                  [pt]="pgTriggerPt()"
                  (onClick)="pgPanel.toggle($event)"
                />
                <p-popover
                  #pgPanel
                  [dismissable]="pgDismissable()"
                  [focusOnShow]="pgFocusOnShow()"
                  [appendTo]="pgAppendTo()"
                  [ariaLabel]="pgNamed() ? 'Column settings' : undefined"
                  [pt]="ptPanelId"
                  (onShow)="pgOpen.set(true)"
                  (onHide)="pgOpen.set(false)"
                >
                  <div class="panel">
                    <h4 class="panel__title">Column settings</h4>
                    @if (pgAutofocus()) {
                      <label class="panel__label" for="pg-filter">Filter columns</label>
                      <input pInputText id="pg-filter" [pAutoFocus]="true" placeholder="Type to filter" />
                    } @else {
                      <p class="panel__body">
                        No field carries the autofocus attribute — but the two buttons below do, whether you asked for
                        it or not, so focus lands on Reset.
                      </p>
                    }
                    <div class="panel__row">
                      <p-button label="Reset" severity="secondary" [text]="true" size="small" />
                      <p-button label="Apply" size="small" (onClick)="pgPanel.hide()" />
                    </div>
                  </div>
                </p-popover>
                <p class="pg__hint">
                  {{ pgOpen() ? 'Open' : 'Closed' }} &middot; the panel is <code>role="dialog"</code> with
                  <code>aria-modal="{{ pgOpen() }}"</code> whenever it is open, whatever the rest of this configuration
                  says.
                </p>
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
        </section>

        <!-- Passive detail -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The canonical case: detail the user asked to see</h3>
            <button type="button" class="copy-btn" (click)="copy('detail', detailCode)">
              {{ copiedId() === 'detail' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Passive content, one trigger, nothing to submit. The trigger is an ordinary button that reports its own
            state; the panel is named, so the node in the accessibility tree is not an anonymous dialog.
          </p>
          <div class="ex__stage">
            <span class="prose">
              Retrieval-augmented generation grounds an answer in retrieved documents
              <p-button
                id="detail-trigger"
                label="What is grounding?"
                [link]="true"
                size="small"
                [pt]="detailTriggerPt()"
                (onClick)="detailPanel.toggle($event)"
              />
              before the model writes a word.
            </span>
            <p-popover
              #detailPanel
              [ariaLabel]="'Grounding, definition'"
              (onShow)="detailOpen.set(true)"
              (onHide)="detailOpen.set(false)"
            >
              <div class="panel panel--prose">
                <h4 class="panel__title">Grounding</h4>
                <p class="panel__body">
                  Tying a generated statement to a retrieved source, so the claim can be checked instead of believed. An
                  ungrounded answer may still be correct — it just carries no evidence with it.
                </p>
              </div>
            </p-popover>
          </div>
          <pre class="code-block"><code>{{ detailCode }}</code></pre>
        </section>

        <!-- Interactive panel with autofocus + closeCallback -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">An interactive panel: autofocus in, closeCallback out</h3>
            <button type="button" class="copy-btn" (click)="copy('form', formCode)">
              {{ copiedId() === 'form' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The moment the panel contains a control, focus has to go into it — and that takes an element with the
            <code>autofocus</code> attribute, which is what <code>pAutoFocus</code> writes. The close button here comes
            from the <code>#content</code> template's <code>closeCallback</code>, the only close affordance the
            component offers.
          </p>
          <div class="ex__stage">
            <p-button
              id="form-trigger"
              label="Add label"
              icon="pi pi-tag"
              size="small"
              [pt]="formTriggerPt()"
              (onClick)="formPanel.toggle($event)"
            />
            <p-popover #formPanel [ariaLabel]="'Add label'" (onShow)="formOpen.set(true)" (onHide)="onFormHide()">
              <ng-template #content let-close="closeCallback">
                <div class="panel">
                  <h4 class="panel__title">Add label</h4>
                  <label class="panel__label" for="label-name">Name</label>
                  <input
                    pInputText
                    id="label-name"
                    [pAutoFocus]="true"
                    [ngModel]="labelName()"
                    (ngModelChange)="labelName.set($event)"
                  />
                  <div class="panel__row">
                    <p-button
                      label="Cancel"
                      severity="secondary"
                      [text]="true"
                      size="small"
                      (onClick)="close($event)"
                    />
                    <p-button label="Save" size="small" (onClick)="close($event)" />
                  </div>
                </div>
              </ng-template>
            </p-popover>
            <span class="ex__aside">
              Focus returns to the trigger on <code>(onHide)</code> — the component does not do that for you. Last saved
              name: <code>{{ savedName() || '—' }}</code>
            </span>
          </div>
          <pre class="code-block"><code>{{ formCode }}</code></pre>
        </section>

        <!-- Positioning: flip and edge -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Where it lands: below, flipped above, or right-aligned</h3>
            <button type="button" class="copy-btn" (click)="copy('place', placeCode)">
              {{ copiedId() === 'place' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            There is no <code>position</code> input. The panel is placed below its trigger and aligned to the trigger's
            inline start; it flips above when it would not fit below, and shifts to align its right edge when it would
            overflow the right of the viewport. To see the flip, scroll this page until the left-hand trigger sits near
            the bottom of the window, then open it.
          </p>
          <div class="ex__stage ex__stage--split">
            <div class="place place--left">
              <p-button
                id="flip-trigger"
                label="Opens below, or above"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="flipPanel.toggle($event)"
              />
              <p-popover #flipPanel [ariaLabel]="'Placement demonstration'">
                <div class="panel panel--tall">
                  <h4 class="panel__title">Placement</h4>
                  <p class="panel__body">
                    Tall enough not to fit under a trigger near the bottom of the window. When it flips, the root gains
                    <code>p-popover-flipped</code> and <code>data-p-popover-flipped="true"</code>, and the CSS arrow
                    moves from the top edge to the bottom.
                  </p>
                </div>
              </p-popover>
            </div>
            <div class="place place--right">
              <p-button
                id="edge-trigger"
                label="Opens at the right edge"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="edgePanel.toggle($event)"
              />
              <p-popover #edgePanel [ariaLabel]="'Right edge demonstration'">
                <div class="panel panel--wide">
                  <h4 class="panel__title">Right edge</h4>
                  <p class="panel__body">
                    Wider than the space left of the viewport edge, so the panel's right edge is pulled back to the
                    trigger's right edge and the arrow slides along to stay over the trigger.
                  </p>
                </div>
              </p-popover>
            </div>
          </div>
          <pre class="code-block"><code>{{ placeCode }}</code></pre>
        </section>

        <!-- Dismissal -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Dismissal: outside click, Escape, scroll, resize</h3>
            <button type="button" class="copy-btn" (click)="copy('dismiss', dismissCode)">
              {{ copiedId() === 'dismiss' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The left panel is the default. The right one sets
            <code>[dismissable]="false"</code>: clicking the page no longer closes it — but Escape still does, from
            anywhere in the document, because that listener has no switch. The third trigger lives in a scrolling box,
            which is the dismissal nobody expects.
          </p>
          <div class="ex__stage ex__stage--split">
            <div class="place">
              <p-button
                id="dismiss-default"
                label="dismissable (default)"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="dismissA.toggle($event)"
              />
              <p-popover #dismissA [ariaLabel]="'Dismissable panel'">
                <div class="panel panel--prose">
                  <p class="panel__body">Click anywhere outside, or press Escape.</p>
                </div>
              </p-popover>
            </div>
            <div class="place">
              <p-button
                id="dismiss-sticky"
                label="dismissable false"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="dismissB.toggle($event)"
              />
              <p-popover #dismissB [dismissable]="false" [ariaLabel]="'Sticky panel'">
                <div class="panel panel--prose">
                  <p class="panel__body">
                    An outside click leaves this open. Escape closes it anyway — there is no
                    <code>closeOnEscape</code> on this component.
                  </p>
                </div>
              </p-popover>
            </div>
          </div>
          <div class="scrollbox" tabindex="0" role="group" aria-label="Scrolling container">
            <p class="scrollbox__filler">Scroll this box while the panel is open.</p>
            <p-button
              id="scroll-trigger"
              label="Trigger inside a scrolling box"
              size="small"
              severity="secondary"
              [outlined]="true"
              (onClick)="scrollPanel.toggle($event)"
            />
            <p-popover #scrollPanel [ariaLabel]="'Scroll dismissal demonstration'">
              <div class="panel panel--prose">
                <p class="panel__body">
                  Scrolling the box closes this. The panel is positioned once, at open time, and the component's answer
                  to the anchor moving is to hide rather than re-align.
                </p>
              </div>
            </p-popover>
            <p class="scrollbox__filler">More content, so the box actually scrolls.</p>
            <p class="scrollbox__filler">And more.</p>
          </div>
          <pre class="code-block"><code>{{ dismissCode }}</code></pre>
        </section>

        <!-- Against a tooltip -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Side by side with a tooltip</h3>
            <button type="button" class="copy-btn" (click)="copy('vs', vsCode)">
              {{ copiedId() === 'vs' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Same anchor, same corner of the screen, two different contracts. Hover the first button and click the
            second. The tooltip cannot be reached with the keyboard once shown and cannot hold a link; the popover can
            hold anything and closes on Escape. The panel here also takes the other naming route —
            <code>[ariaLabelledBy]</code> pointing at its own heading rather than <code>[ariaLabel]</code>.
          </p>
          <div class="ex__stage">
            <p-button
              label="Hover me (tooltip)"
              size="small"
              severity="secondary"
              [outlined]="true"
              pTooltip="A short, non-interactive hint. Nothing in here can be clicked."
              tooltipPosition="bottom"
            />
            <p-button
              id="vs-trigger"
              label="Click me (popover)"
              size="small"
              [pt]="vsTriggerPt()"
              (onClick)="vsPanel.toggle($event)"
            />
            <p-popover
              #vsPanel
              [ariaLabelledBy]="'vs-heading'"
              (onShow)="vsOpen.set(true)"
              (onHide)="vsOpen.set(false)"
            >
              <div class="panel panel--prose">
                <h4 class="panel__title" id="vs-heading">Interactive content</h4>
                <p class="panel__body">
                  Interactive content is the whole difference:
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >a link a keyboard can reach</a
                  >, and a button.
                </p>
                <div class="panel__row">
                  <p-button label="Close" size="small" severity="secondary" [text]="true" (onClick)="vsPanel.hide()" />
                </div>
              </div>
            </p-popover>
          </div>
          <pre class="code-block"><code>{{ vsCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which anchored surface, and what each one promises</h3>
        <p>
          Popover sits in the middle of a family of overlays that all look similar and behave nothing alike. Two
          questions settle it almost every time: <strong>can the content be interacted with</strong>, and
          <strong>must the rest of the page wait</strong>. A tooltip fails the first, a dialog answers yes to the
          second, and a popover is what is left: interactive content that the page does not have to stop for.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Surface</th>
                <th>Reach for it when</th>
                <th>In the accessibility tree</th>
                <th>Dismissal</th>
                <th>Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nothing</strong> — put it on the page</td>
                <td>The content is part of the page's subject, not a detour. Always the first answer.</td>
                <td>Ordinary content, in reading order.</td>
                <td>None needed.</td>
                <td>Unchanged.</td>
              </tr>
              <tr>
                <td><strong>Inline disclosure</strong> — a button plus <code>&#64;if</code></td>
                <td>Passive detail that can live in flow: a definition, a footnote, an explanation.</td>
                <td>Content in DOM order, after its trigger.</td>
                <td>The same button.</td>
                <td>Stays on the trigger; the content is the next tab stop. No overlay machinery at all.</td>
              </tr>
              <tr>
                <td><code>pTooltip</code></td>
                <td>A short hint about a control that the user does not need to touch.</td>
                <td>
                  A <code>role="tooltip"</code> node (<code>openng-optimus-ui-tooltip.mjs:479</code>) that is
                  <strong>not</strong> linked to the trigger by <code>aria-describedby</code>.
                </td>
                <td>Pointer leaves, blur, or Escape (<code>hideOnEscape</code>).</td>
                <td>
                  Never moves. Nothing inside is reachable — a link or a button in a tooltip is unusable by
                  construction.
                </td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>
                  Interactive or substantial content belonging to one trigger, with the page still usable behind it.
                </td>
                <td>
                  <code>role="dialog"</code> with <code>aria-modal="true"</code> while open ({{ ariaModalFinding }}).
                </td>
                <td>Outside click (<code>dismissable</code>, default on), Escape, ancestor scroll, window resize.</td>
                <td>{{ focusSummary }}</td>
              </tr>
              <tr>
                <td><code>p-menu [popup]</code> / <code>p-tieredmenu</code></td>
                <td>The panel is a list of <em>commands</em> and nothing else.</td>
                <td><code>role="menu"</code> with menu items and a roving <code>tabindex</code>.</td>
                <td>Outside click, Escape, choosing an item.</td>
                <td>
                  Into the list, arrow keys between items — the menu keyboard contract, which a popover full of buttons
                  does not have.
                </td>
              </tr>
              <tr>
                <td><code>p-confirmpopup</code></td>
                <td>"Delete this?" next to the button that would delete it.</td>
                <td>
                  <code>role="alertdialog"</code>
                  (<code>openng-optimus-ui-confirmpopup.mjs:502</code>), with a focus trap and
                  <code>autofocus</code> on one of its two buttons.
                </td>
                <td>Accept, reject, outside click, Escape.</td>
                <td>
                  Into the panel, and trapped there. The one anchored surface in the library that does the focus work
                  for you.
                </td>
              </tr>
              <tr>
                <td><code>p-dialog [modal]</code></td>
                <td>
                  A sub-task that must block: a form too big for a panel, a destructive confirmation with consequences
                  to read.
                </td>
                <td><code>role="dialog"</code>, <code>aria-modal="true"</code>, plus a mask.</td>
                <td>Close button, Escape, mask click.</td>
                <td>
                  Into the content, trapped by <code>pFocusTrap</code>, and <em>not</em> restored — see the Dialog
                  guide.
                </td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>A long side surface — navigation, a filter rail — with the page still in view.</td>
                <td><code>role="complementary"</code>.</td>
                <td>Close button, Escape, mask click.</td>
                <td>Into the drawer; modal by default.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The tree column is an accessibility-tree read of each rendered surface or the role attribute in the shipped
          template at the cited line; the focus and dismissal columns for <code>p-popover</code> are measured, and the
          numbers are in the Development tab. <strong>What is not measured</strong> is the "reach for it when" column —
          that is a judgment, and the honest form of it is the two questions above the table.
        </p>

        <h3>The trigger is half the component</h3>
        <p>
          <code>p-popover</code> ships no trigger. You bring a button and call <code>toggle($event)</code> on the panel
          — which means the disclosure semantics are yours too, and they are the part most often missing. Three things,
          none of them optional:
        </p>
        <ul>
          <li>
            <strong><code>aria-expanded</code></strong> bound to the open state, so a screen-reader user knows the panel
            exists and whether it is showing. The state comes from <code>(onShow)</code> / <code>(onHide)</code>, or
            from the panel reference's <code>overlayVisible</code>.
          </li>
          <li>
            <strong><code>aria-haspopup="dialog"</code></strong
            >, because that is the role the panel actually announces. <code>"true"</code> is the legacy spelling and
            means <code>"menu"</code> — accurate only if you really put a menu in there.
          </li>
          <li>
            <strong>An accessible name on the panel</strong> — <code>[ariaLabel]</code> or
            <code>[ariaLabelledBy]</code>. A <code>dialog</code> node with no name is announced as an anonymous dialog,
            and a user who lands in it has no idea what it is for.
          </li>
        </ul>

        <h4>Where those attributes have to land</h4>
        <p>
          With <code>p-button</code> as the trigger this is the trap the pattern actually dies on.
          <code>&lt;p-button&gt;</code> is a component element and the clickable <code>&lt;button&gt;</code> is rendered
          <em>inside</em> it, so an attribute binding written on <code>&lt;p-button&gt;</code> stays on the wrapper —
          which has no role and is not what a screen reader announces. {{ wrapperAttrFinding }}
        </p>
        <p>
          The route that reaches the real button is the pass-through object: the inner button binds the
          <code>root</code> section, so <code>[pt]="&#123; root: &#123; 'aria-expanded': … &#125; &#125;"</code> lands
          on it. Build it in a <code>computed()</code> rather than as an inline literal — a fresh object on every
          change-detection pass re-sets a signal input for no reason. A plain <code>&lt;button&gt;</code> trigger has
          none of this problem, which is a legitimate reason to prefer one for a disclosure.
        </p>
        <p>
          <code>aria-controls</code> is worth adding when you can: the panel's root has no id of its own, so give it one
          through the same mechanism on the popover —
          <code>[pt]="&#123; root: &#123; id: 'my-panel' &#125; &#125;"</code> — and point the trigger at it.
          {{ ptIdFinding }} It is the weakest of the four, since support for <code>aria-controls</code> is patchy, and
          the first three carry the pattern on their own.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — attributes on the wrapper, no name on the panel</span>
            <div class="dd__stage">
              <p-button
                id="bad-trigger"
                label="Details"
                size="small"
                severity="secondary"
                [outlined]="true"
                [attr.aria-expanded]="badOpen()"
                [attr.aria-haspopup]="'dialog'"
                (onClick)="badName.toggle($event)"
              />
              <p-popover #badName (onShow)="badOpen.set(true)" (onHide)="badOpen.set(false)">
                <div class="panel panel--prose">
                  <p class="panel__body">Two sentences of detail, in an anonymous dialog.</p>
                </div>
              </p-popover>
              <span class="dd__aside">The bindings look right and reach nothing.</span>
            </div>
            <p class="dd__why">
              Two defects at once. The disclosure attributes are written on
              <code>&lt;p-button&gt;</code>, so they sit on the wrapper element rather than on the button a screen
              reader announces — {{ wrapperAttrFinding }} And the panel has no name: {{ unnamedFinding }} The word
              "Details" is on the button, not on the dialog, so it is not what the user hears once they are inside.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a disclosure trigger and a named panel</span>
            <div class="dd__stage">
              <p-button label="Details" size="small" [pt]="goodTriggerPt()" (onClick)="goodName.toggle($event)" />
              <p-popover
                #goodName
                [ariaLabel]="'Shipment details'"
                (onShow)="goodOpen.set(true)"
                (onHide)="goodOpen.set(false)"
              >
                <div class="panel panel--prose">
                  <h4 class="panel__title">Shipment details</h4>
                  <p class="panel__body">The same two sentences, in a dialog with a name.</p>
                </div>
              </p-popover>
              <span class="dd__aside">Same three facts, routed through <code>[pt]</code>.</span>
            </div>
            <p class="dd__why">
              The same attributes, delivered through the pass-through object so they land on the inner
              <code>&lt;button&gt;</code>, plus a name on the panel. The visible heading and the accessible name should
              be the same words — that is what makes the panel and the button read as one thing.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — interactive content in a tooltip</span>
            <div class="dd__stage">
              <p-button
                label="Hover for options"
                size="small"
                severity="secondary"
                [outlined]="true"
                pTooltip="Rename, Duplicate, Delete — none of these can be clicked."
                tooltipPosition="bottom"
              />
              <span class="dd__aside">Hover it, then try to reach the words with Tab.</span>
            </div>
            <p class="dd__why">
              A tooltip disappears when the pointer leaves the trigger and is not in the tab order, so anything inside
              it is decoration. It is also not wired to the trigger with <code>aria-describedby</code>, so its text is
              not part of what the trigger announces. Content worth interacting with needs a surface that can be
              entered.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a popover for anything clickable</span>
            <div class="dd__stage">
              <p-button label="Options" size="small" [pt]="optTriggerPt()" (onClick)="optPanel.toggle($event)" />
              <p-popover #optPanel [ariaLabel]="'Options'" (onShow)="optOpen.set(true)" (onHide)="optOpen.set(false)">
                <div class="panel">
                  <p-button label="Rename" size="small" severity="secondary" [text]="true" />
                  <p-button label="Duplicate" size="small" severity="secondary" [text]="true" />
                </div>
              </p-popover>
              <span class="dd__aside">Reachable, dismissible, named.</span>
            </div>
            <p class="dd__why">
              If the panel is nothing but commands, <code>p-menu [popup]</code> is the better fit — it brings the
              arrow-key contract a row of buttons in a dialog does not have. The rule of thumb: commands only, use a
              menu; anything else, a popover.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — leave the focus target to chance</span>
            <div class="dd__stage">
              <p-button
                label="Rename"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="badForm.toggle($event)"
              />
              <p-popover #badForm [ariaLabel]="'Rename, unfocused'">
                <div class="panel">
                  <label class="panel__label" for="bad-rename">New name</label>
                  <input pInputText id="bad-rename" />
                  <div class="panel__row">
                    <p-button label="Save" size="small" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Open it and watch the focus read-out at the top of Examples.</span>
            </div>
            <p class="dd__why">
              <code>focusOnShow</code> is on by default and focuses the first element carrying the
              <code>autofocus</code> <em>attribute</em> — and {{ autofocusAttrFinding }} So opening this panel puts the
              caret on <strong>Save</strong>, past the field the user came to type in. Nothing restores focus afterwards
              either, and because the panel is appended to <code>&lt;body&gt;</code>, Tab from the trigger continues
              into the page rather than into the panel. {{ tabOrderFinding }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — autofocus in, focus restored out</span>
            <div class="dd__stage">
              <p-button
                id="good-form-trigger"
                label="Rename"
                size="small"
                [pt]="goodFormTriggerPt()"
                (onClick)="goodForm.toggle($event)"
              />
              <p-popover #goodForm [ariaLabel]="'Rename'" (onShow)="goodFormOpen.set(true)" (onHide)="onGoodFormHide()">
                <div class="panel">
                  <label class="panel__label" for="good-rename">New name</label>
                  <input pInputText id="good-rename" [pAutoFocus]="true" />
                  <div class="panel__row">
                    <p-button label="Save" size="small" (onClick)="goodForm.hide()" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Focus goes to the field, and comes back to the button.</span>
            </div>
            <p class="dd__why">
              Two additions decide it. <code>pAutoFocus</code> on the field writes the <code>autofocus</code> attribute
              the component searches for, and because the search takes the <em>first</em> match in document order, a
              field above the buttons wins. And <code>(onHide)</code> puts focus back on the trigger, because nothing in
              the component records where it came from — without that, dismissing the panel drops the caret on
              <code>&lt;body&gt;</code>.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — treat it as a modal because it says so</span>
            <div class="dd__stage">
              <p-button
                label="Confirm deletion"
                size="small"
                severity="danger"
                [outlined]="true"
                (onClick)="badModal.toggle($event)"
              />
              <p-popover #badModal [ariaLabel]="'Confirm deletion'">
                <div class="panel panel--prose">
                  <p class="panel__body">
                    Delete 12 items? While this is open the page behind it is fully clickable, tabbable, and scrollable.
                  </p>
                  <div class="panel__row">
                    <p-button label="Delete" size="small" severity="danger" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Open it and Tab: you leave immediately.</span>
            </div>
            <p class="dd__why">
              The root sets <code>aria-modal="true"</code> whenever it is visible, and that is the only modal thing
              about it: no mask, no <code>inert</code>, no focus trap, nothing blocking scroll. A destructive
              confirmation that a stray Tab can walk out of is the wrong container.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — pick the surface that matches the stakes</span>
            <div class="dd__stage">
              <span class="dd__aside">
                Destructive and anchored → <code>p-confirmpopup</code>: same placement, plus a real focus trap and
                <code>role="alertdialog"</code>.
              </span>
              <span class="dd__aside"> Blocking and substantial → <code>p-dialog [modal]="true"</code>. </span>
              <span class="dd__aside"> Reversible and cheap → a popover, or no overlay at all. </span>
            </div>
            <p class="dd__why">
              Popover is the right answer for content the user can walk away from without consequence. The moment
              leaving mid-task costs something, the surface has to hold focus — and this one does not, whatever its ARIA
              says.
            </p>
          </div>
        </div>

        <h3>Two habits that cost nothing</h3>
        <ul>
          <li>
            <strong>One panel per page, conceptually.</strong> A popover per table row is a popover per row of markup
            and a swarm of triggers that all say "more". Anchor one panel and re-target it:
            <code>toggle(event, target)</code> takes the element to anchor to, and the component re-shows itself against
            the new target when the target changed.
          </li>
          <li>
            <strong>Assume it will be dismissed by accident.</strong> Outside click, Escape, an ancestor scroll, and a
            window resize all close it, and none of them ask. Anything typed into a popover is either saved as it
            changes or cheap to lose.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — the contract <code>role="dialog"</code> plus <code>aria-modal="true"</code>
            promises: focus moves in, stays in, and returns, and everything outside is inert. This component announces
            the role and keeps none of the clauses, which is the single most important thing to know about it.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Disclosure pattern</a
            >
            — the trigger half: a button with <code>aria-expanded</code> controlling content. It is the pattern the
            popover's own markup does not cover, and the reason <code>aria-expanded</code> is on the required list here
            rather than the nice-to-have one.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-haspopup</code></a
            >
            — normative: the allowed values, and the fact that <code>"true"</code> is equivalent to <code>"menu"</code>.
            That equivalence is why a popover trigger should say <code>"dialog"</code>.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — the property's meaning is a promise about the rest of the page, and authors are told that content outside
            must be made inert. A hard-bound <code>true</code> on a non-modal panel is a defect, not a style choice.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — what an overlay appended to <code>&lt;body&gt;</code> puts at risk: the tab order after the trigger is DOM
            order, not visual order, unless you move focus yourself.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.13 Content on Hover or Focus</a
            >
            — dismissible, hoverable, persistent. It is the clause that rules out hover as a popover trigger and the
            reason the tooltip/popover line matters for compliance and not only for taste.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Popover_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Popover API</a
            >
            — the platform baseline this component predates: top layer, light dismiss,
            <code>popovertarget</code> wiring the trigger for free. Useful as the yardstick for what the library is
            hand-rolling and where it falls short.
          </li>
          <li>
            <a href="https://primeng.org/popover" target="_blank" rel="noopener noreferrer"> PrimeNG — Popover</a>
            — upstream docs for the v21 API that Optimus UI forks; verified here against the shipped source of
            &#64;openng/optimus-ui 2.0.2 rather than quoted, and three of the documented inputs turn out to be
            unreachable.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <ul>
          <li>
            <strong>Host</strong> — <code>&lt;p-popover&gt;</code>. Renders nothing itself; with the default
            <code>appendTo</code> the panel is not even its child.
          </li>
          <li>
            <strong>Root</strong> — <code>div.p-popover.p-component</code>, created only once the panel has been shown
            at least once (the template is inside a <code>&#64;if (render)</code>).
            <code>position: absolute</code> comes from the component's own inline style map, the coordinates from the
            positioning call, and the layer from <code>ZIndexUtils</code>.
          </li>
          <li>
            <strong>Content</strong> — <code>div.p-popover-content</code>, one padding token, no scroll container, and no
            max-height. Projected content and the <code>#content</code> template both render here.
          </li>
          <li>
            <strong>Arrow</strong> — two CSS triangles, <code>::before</code> (border color) and
            <code>::after</code> (background), sized from <code>--p-popover-gutter</code> and positioned at
            <code>calc(arrow-offset + arrow-left)</code>. The same gutter is the panel's
            <code>margin-block-start</code>, so the arrow's height and the gap are one number.
          </li>
          <li>
            <strong>Flipped</strong> — <code>.p-popover-flipped</code> plus
            <code>data-p-popover-flipped="true"</code> when the panel sits above its trigger: the margin moves to the
            block end and both triangles swap to the bottom edge.
          </li>
        </ul>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-popover.mjs</code> (class map <code>:22-25</code>, inline style
          <code>:19-21</code>, template <code>:411-434</code>) and its stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/popover/index.mjs</code>. On
          <code>&#64;openng/optimus-ui-themes</code> 2.0.2 (an Aura 2.x fork) <code>arrowOffset</code> is
          <code>1.25rem</code> again — the one token PrimeNG's Themes 3.0 had moved to <code>1.125rem</code>. The gutter
          stays <code>10px</code>; every other value is a reference into <code>overlay.popover.*</code>.
        </p>

        <h3>Token chain, both themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura source</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-popover-background</code></td>
                <td>
                  <code>&#123;overlay.popover.background&#125;</code> → <code>&#123;surface.0&#125;</code> /
                  <code>&#123;surface.900&#125;</code>
                </td>
                <td>
                  <code>{{ tokBgLight }}</code>
                </td>
                <td>
                  <code>{{ tokBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-color</code></td>
                <td><code>&#123;overlay.popover.color&#125;</code> → <code>&#123;text.color&#125;</code></td>
                <td>
                  <code>{{ tokTextLight }}</code>
                </td>
                <td>
                  <code>{{ tokTextDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-border-color</code></td>
                <td>
                  <code>&#123;overlay.popover.border.color&#125;</code> → <code>&#123;surface.200&#125;</code> /
                  <code>&#123;surface.700&#125;</code>
                </td>
                <td>
                  <code>{{ tokBorderLight }}</code>
                </td>
                <td>
                  <code>{{ tokBorderDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-border-radius</code></td>
                <td>
                  <code>&#123;overlay.popover.border.radius&#125;</code> → <code>&#123;border.radius.md&#125;</code>
                </td>
                <td colspan="2">
                  <code>{{ tokRadius }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-content-padding</code></td>
                <td><code>&#123;overlay.popover.padding&#125;</code></td>
                <td colspan="2">
                  <code>{{ tokPadding }}</code> — {{ contentPaddingNote }}
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-gutter</code></td>
                <td>literal in the popover preset</td>
                <td colspan="2">
                  <code>{{ tokGutter }}</code> — the gap <em>and</em> the arrow size
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-arrow-offset</code></td>
                <td>literal in the popover preset</td>
                <td colspan="2">
                  <code>{{ tokArrowOffset }}</code> from the panel's inline start
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-arrow-left</code></td>
                <td><strong>no preset value</strong> — written as an inline custom property by the positioning code</td>
                <td colspan="2">{{ arrowLeftFinding }}</td>
              </tr>
              <tr>
                <td><code>--p-popover-shadow</code></td>
                <td><code>&#123;overlay.popover.shadow&#125;</code>, shared with the select overlay and menus</td>
                <td colspan="2">
                  <code>{{ tokShadow }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura sources from <code>&#64;openng/optimus-ui-themes/dist/aura/popover/index.mjs</code> — eight values (seven on
          <code>root</code>, one on <code>content</code>), six of them indirections and two literals. The indirections
          resolve in <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>, and not all in one place: radius,
          padding, and shadow sit in the top-level <code>overlay.popover</code> block, while background, border color,
          and text color live per scheme under <code>colorScheme.light</code> / <code>.dark</code>. The resolved
          background and text are the Aura stock surface palette (slate light, zinc dark), which no visual style and
          no accent overrides; the border is the kit's: the <code>.p-popover</code> rule in <code>styles.scss</code>
          sets <code>--p-popover-border-color</code> to <code>--style-outline</code>. The radius follows the visual style's
          <code>border.radius.md</code>. There is <strong>no width or max-width token</strong>: the panel is sized entirely by its content.
        </p>

        <h3>Contrast — measured against the surfaces actually painted</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Requirement</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>panel text on panel background</td>
                <td>SC 1.4.3, 4.5:1</td>
                <td>
                  <strong>{{ crTextLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ crTextDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td>panel border against what is behind the panel</td>
                <td>SC 1.4.11, 3:1 for a boundary that carries meaning</td>
                <td>{{ crBorderLight }}:1</td>
                <td>{{ crBorderDark }}:1</td>
              </tr>
              <tr>
                <td>panel background against what is behind it</td>
                <td>none — but it is what makes the panel readable as a layer</td>
                <td>{{ crBgLight }}:1</td>
                <td>{{ crBgDark }}:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>Placement, exactly as computed</h3>
        <p>
          One call to <code>absolutePosition(container, target, false)</code> at open time decides everything, and it is
          worth knowing its four branches because there is no input that overrides them:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>panel fits below the trigger</td>
                <td>
                  Top edge at the trigger's bottom, plus the gutter as <code>margin-block-start</code>.
                  <code>transform-origin: top</code>.
                </td>
              </tr>
              <tr>
                <td>trigger bottom + panel height exceeds the viewport height</td>
                <td>
                  Flipped above: top edge at the trigger's top minus the panel height,
                  <code>transform-origin: bottom</code>, the gutter margin moved to the block end, and the arrow moved
                  to the bottom edge. Clamped to the top of the <em>viewport</em> if that would be negative — the
                  fallback is the window's scroll offset, not zero. {{ flipFinding }}
                </td>
              </tr>
              <tr>
                <td>panel fits horizontally</td>
                <td>
                  Inline start aligned with the trigger's inline start; the arrow sits at the fixed
                  <code>arrow-offset</code>.
                </td>
              </tr>
              <tr>
                <td>panel would overflow the right of the viewport</td>
                <td>
                  Pulled left so its right edge meets the trigger's right edge (clamped at 0), and
                  <code>--p-popover-arrow-left</code> is set to the difference minus twice the border radius so the
                  arrow stays over the trigger. {{ edgeFinding }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Branches read from <code>absolutePosition</code> in <code>&#64;openng/optimus-ui-utils/dist/dom/index.mjs</code> and
          the arrow arithmetic from <code>align()</code> in
          <code>openng-optimus-ui-popover.mjs:267-283</code>; the two findings in the table are computed-style
          and geometry reads on a rendered panel. Note what is <em>not</em> in the list: there is no vertical centering,
          no left/right placement, and no re-alignment after the fact — the panel closes instead. {{ scrollFinding }}
          {{ resizeFinding }}
        </p>

        <h3>Motion</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Shipped</th>
                <th>Under <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>enter (<code>.p-anchored-overlay-enter-active</code>)</td>
                <td>
                  <code>{{ motionEnter }}</code>
                </td>
                <td>
                  <code>{{ motionEnterReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>leave (<code>.p-anchored-overlay-leave-active</code>)</td>
                <td>
                  <code>{{ motionLeave }}</code>
                </td>
                <td>
                  <code>{{ motionLeaveReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>the two deprecated transition inputs</td>
                <td colspan="2">Still inputs, still unread. {{ deadTransitionFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>p-anchored-overlay</code> is the motion <em>name</em> — the prefix of the <code>-enter-active</code> /
          <code>-leave-active</code> classes. The keyframes it points at are
          <code>p-animate-anchored-overlay-enter</code> and <code>-leave</code>, defined once in
          <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>: opacity 0 → 1 with <code>scale(0.93)</code> → 1 over
          300 ms, shared with every anchored overlay in the library. Unlike most of this library's motion it
          <strong>does</strong> honor the media feature on its own: <code>&#64;openng/optimus-ui-motion</code> defaults its
          <code>safe</code> option to <code>true</code> and skips the animation when
          <code>prefers-reduced-motion</code> is set. {{ reducedStillWorksFinding }} Override the duration through
          <code>motionOptions</code>, never through the deprecated transition inputs.
        </p>

        <h3>Sizing is entirely yours</h3>
        <p>
          There is no width token, no <code>max-height</code>, and no scroll container. A panel holding a paragraph is
          as wide as the paragraph wants to be; a panel holding a long list grows until it runs off the bottom of the
          window, where nothing scrolls it because the page behind is what scrolls — and scrolling a scrollable ancestor
          of the trigger closes the panel. Two rules follow, and they are the whole of popover styling:
        </p>
        <pre class="code-block"><code>{{ sizingSnippet }}</code></pre>
        <p class="src-note">
          Cap the width so translations cannot stretch the panel across the viewport, and cap the content height with
          its own scroll container so a long panel stays reachable. Both are ordinary CSS on your own content wrapper —
          no <code>::ng-deep</code> needed, because the panel's padding is a custom property and everything inside it is
          yours. The <code>styleClass</code> input reaches the root if you need the panel itself.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior. The panel keeps its content width at every viewport and is placed once, at
          open; a right-edge collision only realigns it to the trigger's right edge, it never shrinks. A panel wider
          than a phone screen therefore runs off one side — cap the wrapper with
          <code>max-width: min(24rem, calc(100vw - 2rem))</code>. On touch devices a window resize (the on-screen
          keyboard opening) does not close it (<code>openng-optimus-ui-popover.mjs:345-349</code>), so it can stay
          where the trigger used to be.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 1.4.3 for panel text on the panel background, 10.35:1 light and 17.72:1 dark
          (Aura stock palette, computed from the tokens), and
          SC 2.1.1 for dismissal — a document-level Escape listener with no switch, closing the panel with focus
          anywhere. <strong>Failing:</strong> SC 2.4.3 — focus is never returned; measured after Escape the active
          element is the body, and because the panel is the body's last child one Tab from the trigger leaves for the
          page. The panel border is not counted against SC 1.4.11 — a panel edge is neither a control boundary nor a
          state indicator — but it clears 3:1 anyway: the kit's <code>--style-outline</code>, gated at 3.97:1 or more
          against the card (<code>panel outline</code> in <code>docs/generated/CONTRAST.MD</code>). <strong>Conditional:</strong> SC 4.1.2 — the panel's name
          and the trigger's <code>aria-expanded</code> and <code>aria-haspopup</code> are yours to supply; unnamed, the
          panel announces as a dialog with an empty name, and on a button host those attributes reach the inner button
          only through the pass-through input. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Before v18 this component was <code>p-overlayPanel</code> / <code>OverlayPanelModule</code>; that entry point
          no longer exists (removed in v18), so older examples and answers need translating before they compile.
        </p>
        <p>
          One standalone component, no service, no trigger, no <code>visible</code> input: you hold a template reference
          and call methods on it. State lives in the component instance as <code>overlayVisible</code>, which is
          readable but not bindable — mirror it into a signal from <code>(onShow)</code> / <code>(onHide)</code> if the
          trigger needs it, which it does.
        </p>

        <h3>Inputs</h3>
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
                <td><code>appendTo</code></td>
                <td><code>'body'</code></td>
                <td>
                  Signal input. <strong>The JSDoc one line above it still says <code>'self'</code></strong> — the code
                  is <code>input('body')</code>. Keep it: the positioning code writes document-absolute coordinates, so
                  a panel appended anywhere with a positioned offset parent lands in the wrong place.
                </td>
              </tr>
              <tr>
                <td><code>dismissable</code></td>
                <td><code>true</code></td>
                <td>
                  Outside click closes. The document listener is bound either way and returns early when this is false,
                  so turning it off does not save a listener.
                </td>
              </tr>
              <tr>
                <td><code>focusOnShow</code></td>
                <td><code>true</code></td>
                <td>
                  Focuses the <strong>first element carrying the <code>autofocus</code> attribute</strong> in document
                  order, and nothing else — but read {{ autofocusAttrFinding }}
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td><em>unset</em></td>
                <td>The panel's accessible name. One of them is required in practice — see Accessibility.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td><em>unset</em></td>
                <td>Class on the root, merged with the component's own classes.</td>
              </tr>
              <tr>
                <td><code>style</code></td>
                <td><em>unset</em></td>
                <td>
                  <code>ngStyle</code> on the root. Applied <em>after</em> the inline <code>position: absolute</code> —
                  do not put positioning in here.
                </td>
              </tr>
              <tr>
                <td><code>autoZIndex</code> / <code>baseZIndex</code></td>
                <td><code>true</code> / <code>0</code></td>
                <td>
                  Layer management through the shared overlay counter. Leave them alone unless you have a stacking
                  conflict.
                </td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td><em>unset</em></td>
                <td>
                  Signal input, merged over the pass-through <code>motion</code> object. The supported way to change or
                  disable the animation.
                </td>
              </tr>
              <tr>
                <td><code>ariaCloseLabel</code></td>
                <td><em>unset</em></td>
                <td><strong>Dead — still, in Optimus 2.0.2.</strong> {{ deadCloseLabelFinding }}</td>
              </tr>
              <tr>
                <td><code>showTransitionOptions</code> / <code>hideTransitionOptions</code></td>
                <td><code>'.12s …'</code> / <code>'.1s linear'</code></td>
                <td>
                  <strong>Deprecated since v21 and unread.</strong> Neither value reaches the template; the animation is
                  the 300 ms <code>p-anchored-overlay</code> one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the shipped class and its compiled input map (<code>openng-optimus-ui-popover.mjs:54-126</code> and
          the ɵcmp input map (:410), &#64;openng/optimus-ui 2.0.2). The three flagged rows are the reason to read the source rather than the
          input list: a documented input that no template consumes looks identical to a working one from the outside.
        </p>

        <h3>Methods, outputs, templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Shape</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>toggle(event, target?)</code></td>
                <td>method</td>
                <td>
                  The normal entry point. With a second argument you anchor one panel to many triggers; when the target
                  changed it hides, then re-shows against the new one.
                </td>
              </tr>
              <tr>
                <td><code>show(event, target?)</code> / <code>hide()</code></td>
                <td>method</td>
                <td>
                  <code>show</code> takes the anchor from the argument, then <code>currentTarget</code>, then
                  <code>target</code> — pass the event.
                </td>
              </tr>
              <tr>
                <td><code>overlayVisible</code></td>
                <td>property</td>
                <td>
                  Plain boolean, read only in practice. It can feed the trigger's expanded state if you accept reading a
                  non-signal in a template, but a signal mirrored from <code>(onShow)</code> / <code>(onHide)</code> is
                  what a <code>computed()</code> pass-through object needs.
                </td>
              </tr>
              <tr>
                <td><code>(onShow)</code></td>
                <td>emits <code>null</code></td>
                <td>Fires from the enter hook, after positioning and after the listeners are bound.</td>
              </tr>
              <tr>
                <td><code>(onHide)</code></td>
                <td>emits <code>&#123;&#125;</code></td>
                <td>
                  Fires after the leave animation, once the panel is torn down. <strong>Restore focus here.</strong>
                </td>
              </tr>
              <tr>
                <td><code>#content</code> / <code>pTemplate="content"</code></td>
                <td><code>ng-template</code></td>
                <td>
                  Context is <code>&#123; closeCallback &#125;</code> — the only close affordance in the component. Both
                  spellings bind: the fork kept the v21 <code>PrimeTemplate</code> query (<code>:163-171</code>), and the
                  outlet takes <code>contentTemplate || _contentTemplate</code> (<code>:431</code>). Projected
                  <code>&lt;ng-content&gt;</code> and this template both render, so use one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The four focus questions</h3>
        <p>The same four this kit asks of every overlay. A popover answers one of them by itself:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Does focus move <strong>in</strong>?</td>
                <td>{{ focusInFinding }}</td>
              </tr>
              <tr>
                <td>Does focus <strong>stay</strong> in?</td>
                <td>No. There is no focus trap and no <code>inert</code>. {{ tabOrderFinding }}</td>
              </tr>
              <tr>
                <td>Does Escape get you <strong>out</strong>?</td>
                <td>Yes, and you cannot turn it off. {{ escapeFinding }}</td>
              </tr>
              <tr>
                <td>Does focus come <strong>back</strong>?</td>
                <td>{{ focusBackFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Answers read from <code>document.activeElement</code> around each transition and from the rendered DOM, plus
          <code>focus()</code> and the Escape host listener in <code>openng-optimus-ui-popover.mjs:322-328</code> and
          <code>:332-334</code>. Reproduce it in your own build by logging <code>document.activeElement</code> on
          <code>focusin</code> while you open, Tab through, and dismiss a panel.
        </p>
        <p>
          Which makes the focus target something you have to choose rather than inherit. A panel of
          <strong>passive</strong> content should leave focus on the trigger — the user reads it and carries on — but a
          <code>p-button</code> anywhere inside takes that decision away, so a passive panel with a Close button in it
          steals focus on open. An <strong>interactive</strong> panel wants focus on its first field, which means
          putting <code>pAutoFocus</code> there and letting document order do the rest. Either way, two lines decide it:
          the intended <code>autofocus</code> target, and <code>[autofocus]="false"</code> on any
          <code>p-button</code> that should not be one (the directive removes the attribute for exactly that value, and
          only that value).
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h3>Dismissal has four causes, and two of them surprise people</h3>
        <ul>
          <li>
            <strong>Outside click</strong> — a document <code>click</code> listener (<code>touchstart</code> on iOS).
            Clicks inside the panel, inside the trigger, or flagged by the shared overlay service are ignored.
          </li>
          <li>
            <strong>Escape</strong> — a <code>document:keydown.escape</code> host listener that calls
            <code>hide()</code>. It is bound per instance for the lifetime of the component, not only while open, and
            there is no input to disable it.
          </li>
          <li>
            <strong>Ancestor scroll</strong> — every ancestor of the <em>trigger</em> whose computed overflow is
            <code>auto</code> or <code>scroll</code> gets a scroll listener that hides the panel. The document itself is
            excluded, so ordinary page scroll does not close it. {{ scrollFinding }}
          </li>
          <li>
            <strong>Window resize</strong> — hides the panel, except on touch devices, where the check exists because a
            software keyboard fires a resize. {{ resizeFinding }}
          </li>
        </ul>
        <p class="src-note">
          Read from <code>bindDocumentClickListener</code> (<code>:168-185</code>), the Escape host listener
          (<code>:332-334</code>), <code>bindScrollListener</code> (<code>:360-371</code>) and
          <code>onWindowResize</code> (<code>:341-345</code>); the scroll and resize findings are behavioral reads on a
          rendered panel.
        </p>

        <h3>Wiring the trigger</h3>
        <pre class="code-block"><code>{{ triggerSnippet }}</code></pre>
        <p>
          The one non-obvious line is the pass-through id. The root element gets a generated attribute selector but no
          <code>id</code>, so <code>aria-controls</code> has nothing to point at until you supply one — and the
          pass-through object is the supported route to the root's attributes. {{ ptIdFinding }}
        </p>

        <h3>SSR</h3>
        <p>
          Safe, and cheaper than it looks. The panel's markup is inside
          <code>&#64;if (render)</code> and <code>render</code> only becomes true on the first <code>show()</code>, so a
          server render emits <strong>nothing</strong> — no hidden content in the HTML, no content to hydrate, and no
          crawler seeing panel text as page text. The three listeners are all behind
          <code>isPlatformBrowser</code> guards. Two consequences: content in a popover is invisible to anything reading
          the static HTML (never put anything you want indexed in one), and the first open pays for creating the
          content, so keep heavy work out of the panel body or lazy-load it on <code>(onShow)</code>.
        </p>

        <h3>Teardown waits for a change-detection pass</h3>
        <p>
          <code>hide()</code> sets <code>overlayVisible</code> false and calls
          <code>markForCheck</code> (<code>:334-337</code>). The <em>teardown</em> happens later, at the end of the
          leave animation: the leave hook sets <code>render</code> false and emits <code>(onHide)</code> but does
          <strong>not</strong> mark the view itself (<code>:304-321</code>) — it relies on the view marking its output
          binding provides, so on this <code>OnPush</code> component the element goes away on the following
          change-detection pass.
        </p>
        <p>
          Two things follow, and neither is dangerous. In a <strong>fixture</strong> nothing runs change detection for
          you, so asserting "closed" by the absence of <code>.p-popover</code> is unreliable — assert on
          <code>overlayVisible</code>, or on the element's computed <code>display</code>. And a dismissed panel's
          content can still be queryable in the document, so a popover is not a place for anything you would not put on
          the page anyway. A heavy panel body also keeps its cost after the first open rather than paying it again.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>What the panel looks like to a screen reader</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rendered</th>
                <th>Accessibility-tree node</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>panel with <code>[ariaLabel]</code></td>
                <td>{{ axNamed }}</td>
              </tr>
              <tr>
                <td>panel with no name</td>
                <td>{{ unnamedFinding }}</td>
              </tr>
              <tr>
                <td>panel with <code>[ariaLabelledBy]</code></td>
                <td>{{ labelledByFinding }}</td>
              </tr>
              <tr>
                <td>trigger, panel open</td>
                <td>{{ axTrigger }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ axNote }}
        </p>

        <h4>The role and the promise it does not keep</h4>
        <p>
          The root is <code>role="dialog"</code> with <code>[attr.aria-modal]="overlayVisible"</code>, so every open
          popover announces itself as a modal dialog. APG's modal contract has four clauses — focus in, focus stays,
          focus returns, everything else inert — and this component implements <strong>none</strong> of them: no mask,
          no <code>inert</code>, no <code>aria-hidden</code> on the rest of the page, no focus trap, and no focus
          record.
          {{ ariaModalFinding }}
        </p>
        <p>
          Two practical consequences. Do not put anything in a popover that must not be abandoned halfway — a stray Tab
          leaves it silently. And expect the screen-reader announcement to over-promise: a user told "dialog" reasonably
          expects the rest of the page to be out of reach, and it is not. Where that mismatch actually matters, use
          <code>p-dialog [modal]="true"</code> or <code>p-confirmpopup</code>, both of which install a real trap.
        </p>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ The trigger is a real <code>button</code>, and the <code>aria-expanded</code> /
            <code>aria-haspopup="dialog"</code> pair is on <em>that</em> element — read back from the accessibility
            tree, not from the markup. On a <code>p-button</code> that means the <code>[pt]</code> route.
          </li>
          <li>
            ☐ The panel has an accessible name (<code>[ariaLabel]</code> or <code>[ariaLabelledBy]</code>), and it
            matches the visible heading.
          </li>
          <li>
            ☐ If the panel contains a control, the first one carries <code>pAutoFocus</code>; if it does not, focus
            deliberately stays on the trigger.
          </li>
          <li>
            ☐ <code>(onHide)</code> restores focus to the trigger — verified for Escape, for an outside click, and for
            the panel's own close button.
          </li>
          <li>☐ Nothing in the panel is destructive or unsaveable, because every dismissal path is silent.</li>
          <li>☐ The panel has a width cap and, if it can grow, a scrolling content box.</li>
          <li>
            ☐ Placement checked near the bottom and the right edge of the window: it flips and right-aligns, and the
            arrow follows.
          </li>
          <li>
            ☐ Contrast of the panel against the surface it floats over measured in both themes — the panel is a layer,
            and the border is what says so.
          </li>
          <li>
            ☐ No content that must be indexed, translated by a crawler, or present without JavaScript lives inside the
            panel.
          </li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the three things that rot first — the disclosure wiring,
          the panel's name, and the focus restore:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>The library ships no strings — you ship four</h3>
        <p>
          <code>p-popover</code> reads nothing from the Optimus translation config: there is no "close", no "more
          information", nothing to override with <code>setTranslation</code>. Every word around a popover is yours, and
          there are more of them than the markup suggests:
        </p>
        <ul>
          <li>
            the <strong>trigger label</strong> — and it has to name the content, not the gesture: "Shipment details",
            not "More";
          </li>
          <li>
            the <strong>panel's accessible name</strong> (<code>[ariaLabel]</code>), which should be the same words as
            the visible heading;
          </li>
          <li>the <strong>panel content</strong>, including the heading;</li>
          <li>
            the <strong>label of any close button you render yourself</strong> — the component has none, and its
            <code>ariaCloseLabel</code> input is dead, so this string only exists if you wrote the button.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>
          Bind all four through <code>computed()</code> so a language switch re-renders them. A plain field is captured
          once and goes stale on the next switch — and a popover is exactly where that goes unnoticed, because a closed
          panel is not on screen to look wrong.
        </p>

        <h3>Length: the panel has no width of its own</h3>
        <p>
          This is the translation trap specific to this component. With no width token and no
          <code>max-width</code>, the panel is sized by its content — so a string that runs 30% longer produces a 30%
          wider panel, and one long unbroken word produces a panel wider than the viewport, which the placement code
          then jams against the right edge. A <code>max-width</code> on your content wrapper is not polish here; it is
          the difference between a panel and a bar across the screen. Give it one, in <code>rem</code> or
          <code>ch</code>, and let the text wrap.
        </p>

        <h3>RTL</h3>
        <p>
          The stylesheet is written with logical properties — <code>margin-block-start</code> for the gutter, so the
          flip works in both writing modes — but the <em>arrow</em> is placed with a physical <code>left</code>, and the
          horizontal placement is computed as a left-edge coordinate. {{ rtlFinding }}
        </p>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-styles/dist/popover/index.mjs</code> (the arrow rules use <code>left</code> and
          <code>margin-left</code>) and from the direction branch in <code>absolutePosition</code>, which writes the
          same left-edge number to <code>inset-inline-end</code> when the panel's computed direction is right-to-left.
          If you ship an RTL locale, verify the panel's position against its trigger before trusting the placement, and
          expect to pin the arrow yourself.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the panel border is the
            kit's <code>--style-outline</code> (was Aura's 1.23:1 edge), gated in <code>panel outline</code> at
            3.97:1 or more against the card; token table, contrast table, and WCAG status updated.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): panel
            colors labeled as the Aura stock palette (no style, accent, or kit rule touches them), radius per
            visual style, the surface-behind ratios recomputed against each style's <code>--surface-card</code>
            and marked as outside the contrast gate; tooltip and confirmpopup role citations corrected to
            <code>:479</code> and <code>:502</code>; narrow-screen statement added.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Three v22 findings flipped
            back to their v21 form: <code>overlayVisible</code> and <code>render</code> are plain booleans again (not
            signals), <code>showTransitionOptions</code>/<code>hideTransitionOptions</code> are still declared inputs
            (deprecated, read by nothing) rather than removed, <code>pTemplate="content"</code> binds again alongside
            <code>#content</code>, and the <code>appendTo</code> JSDoc/code mismatch ('self' vs <code>input('body')</code>)
            is back — the fork did not carry PrimeNG's fix. All line references re-derived against
            <code>openng-optimus-ui-popover.mjs</code> 2.0.2; on the Aura 2.x token fork <code>arrowOffset</code> is
            <code>1.25rem</code> again. <code>ariaCloseLabel</code> is still declared and still read by nothing.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1: <code>overlayVisible</code> is a
            signal now (invoke it), the appendTo JSDoc/code mismatch is fixed upstream ('body' everywhere),
            <code>showTransitionOptions</code>/<code>hideTransitionOptions</code> were removed outright (motion via
            <code>motionOptions</code>/<code>pMotion</code>), the content template binds via
            <code>#content</code> (<code>pTemplate</code> is dead in v22), and <code>ariaCloseLabel</code> is still
            declared and still read by nothing. All source line references re-derived against 22.1.2; Aura popover
            tokens changed only in <code>arrowOffset</code>.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide: the popover/tooltip/dialog/ menu delineation on the axes
            of interactivity and blocking, the measured token and contrast chains in both themes, the placement and
            dismissal mechanics including flip and edge collision, the four focus questions with their measured answers,
            the three unreachable inputs, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class PopoverArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  /** Live description of document.activeElement — the focus read-out. */
  readonly activeDesc = signal('(nothing yet — click or Tab somewhere)');
  protected focusListener: ((e: Event) => void) | null = null;

  constructor() {
    if (this.isBrowser) {
      this.focusListener = () => this.activeDesc.set(this.describeActive());
      document.addEventListener('focusin', this.focusListener, true);
      document.addEventListener('focusout', this.focusListener, true);
    }
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      if (this.isBrowser && this.focusListener) {
        document.removeEventListener('focusin', this.focusListener, true);
        document.removeEventListener('focusout', this.focusListener, true);
      }
    });
  }

  /**
   * A short, readable identifier for whatever currently holds focus.
   * browser-only: reached only from a focusin listener.
   */
  protected describeActive(): string {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'body — nothing focused';
    const tag = el.tagName.toLowerCase();
    const id = el.id ? '#' + el.id : '';
    const label = el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 28) ?? '';
    const inPanel = el.closest('.p-popover') ? '  [inside the panel]' : '';
    return tag + id + (label ? ' "' + label + '"' : '') + inPanel;
  }

  // --- Playground ------------------------------------------------------------
  readonly appendToOptions = [
    { label: "'body' (default)", value: 'body' },
    { label: "'self' — positioning breaks", value: 'self' },
  ];

  /**
   * Pass-through object giving the panel root an id, so the trigger's
   * aria-controls has something to point at. A stable field, not an inline
   * literal: `pt` is a signal input, and a fresh object per change-detection
   * pass would recompute the merged attribute maps on every cycle.
   */
  readonly ptPanelId = { root: { id: 'pg-panel' } };

  readonly pgDismissable = signal(true);
  readonly pgAutofocus = signal(false);
  readonly pgFocusOnShow = signal(true);
  readonly pgAppendTo = signal<'body' | 'self'>('body');
  readonly pgNamed = signal(true);
  readonly pgOpen = signal(false);

  // --- Example state ---------------------------------------------------------
  readonly detailOpen = signal(false);
  readonly formOpen = signal(false);
  readonly vsOpen = signal(false);
  readonly goodOpen = signal(false);
  readonly optOpen = signal(false);
  readonly goodFormOpen = signal(false);
  readonly badOpen = signal(false);
  readonly labelName = signal('');
  readonly savedName = signal('');

  /**
   * The disclosure attributes, routed to the p-button's INNER button through the
   * pass-through object. Written on `<p-button>` itself they would land on the
   * host element, which carries no role — see the Usage tab.
   */
  protected disclosurePt(open: () => boolean, controls?: string) {
    return computed(() => ({
      root: {
        'aria-expanded': String(open()),
        'aria-haspopup': 'dialog',
        ...(controls ? { 'aria-controls': controls } : {}),
      },
    }));
  }

  readonly pgTriggerPt = this.disclosurePt(this.pgOpen, 'pg-panel');
  readonly detailTriggerPt = this.disclosurePt(this.detailOpen);
  readonly formTriggerPt = this.disclosurePt(this.formOpen);
  readonly vsTriggerPt = this.disclosurePt(this.vsOpen);
  readonly goodTriggerPt = this.disclosurePt(this.goodOpen);
  readonly optTriggerPt = this.disclosurePt(this.optOpen);
  readonly goodFormTriggerPt = this.disclosurePt(this.goodFormOpen);

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const dismiss = this.pgDismissable() ? '' : '\n  [dismissable]="false"';
    const focusOn = this.pgFocusOnShow() ? '' : '\n  [focusOnShow]="false"';
    const append =
      this.pgAppendTo() === 'body'
        ? ''
        : '\n  appendTo="self"  <!-- document-absolute coordinates: expect it to land wrong -->';
    const name = this.pgNamed()
      ? '\n  [ariaLabel]="labels().columnSettings"'
      : '\n  <!-- no name: an anonymous dialog in the tree -->';
    const auto = this.pgAutofocus()
      ? '\n    <input pInputText [pAutoFocus]="true" />'
      : '\n    <p class="hint">nothing here carries the autofocus attribute</p>';
    return `<!-- The disclosure attributes go through [pt], or they land on the
     <p-button> wrapper instead of the button. triggerPt is a computed():
     ({ root: { 'aria-expanded': String(open()), 'aria-haspopup': 'dialog',
                'aria-controls': 'columns-panel' } }) -->
<p-button
  [label]="labels().columnSettings"
  [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />

<p-popover #panel${dismiss}${focusOn}${append}${name}
  [pt]="{ root: { id: 'columns-panel' } }"
  (onShow)="open.set(true)"
  (onHide)="open.set(false)">
  <div class="panel">${auto}
  </div>
</p-popover>`;
  });

  onFormHide(): void {
    this.formOpen.set(false);
    this.savedName.set(this.labelName());
    this.restoreFocus('form-trigger');
  }

  onGoodFormHide(): void {
    this.goodFormOpen.set(false);
    this.restoreFocus('good-form-trigger');
  }

  /** The restore the component does not do: put focus back on the opener. */
  protected restoreFocus(triggerId: string): void {
    if (!this.isBrowser) return;
    const host = document.getElementById(triggerId);
    const focusable = host?.matches('button') ? host : host?.querySelector('button');
    (focusable as HTMLElement | null)?.focus();
  }

  // --- Measured values -------------------------------------------------------
  readonly tokBgLight: string = '#ffffff';
  readonly tokBgDark: string = '#18181b';
  readonly tokTextLight: string = '#334155';
  readonly tokTextDark: string = '#ffffff';
  readonly tokBorderLight: string = 'the kit: --style-outline (Aura #e2e8f0)';
  readonly tokBorderDark: string = 'the kit: --style-outline (Aura #3f3f46)';
  readonly tokRadius: string = '0 werkbund, 12px lernwerkstatt (default), 10px skizzenbuch, 2px blaupause (Aura stock 6px)';
  readonly tokPadding: string = '0.75rem';
  readonly tokGutter: string = '10px';
  readonly tokArrowOffset: string = '1.25rem = 20px';
  readonly tokShadow: string = '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)';

  readonly crTextLight: string = '10.35';
  readonly crTextDark: string = '17.72';
  readonly crBorderLight: string = '4.09–18.73';
  readonly crBorderDark: string = '3.97–14.86';
  readonly crBgLight: string = '1.00';
  readonly crBgDark: string = '1.05–1.35';
  readonly contrastNote: string = 'The surface behind the panel is the kit\'s --surface-card — #ffffff in light for all four ' +
    'visual styles, and per style in dark; ranges run across the four. The border and the ' +
    'background rows are gated in docs/generated/CONTRAST.MD, group "panel outline": the kit ' +
    'rule .p-popover in styles.scss re-points --p-popover-border-color to --style-outline, the ' +
    'same ink the styles give cards and dialogs (Aura\'s own edge was 1.23:1 on white), and the ' +
    'gate measures it on the card and the ground; the background pair is listed there as ' +
    'informational. The text pair is Aura\'s own ({overlay.popover.color} on the panel), ' +
    'computed from the token values, and clears 4.5:1 with room to spare in both. The panel ' +
    'background still matches the card it floats over (1.00:1 in light, 1.05:1 in dark ' +
    'werkbund), so the style outline is what marks the layer, with the 10% shadow as a second ' +
    'cue. The arrow\'s outer triangle takes the same border color.';
  readonly contentPaddingNote: string = 'an ordinary custom property, which is also how to change it. Scope any override to one ' +
    'panel; an unencapsulated rule for .p-popover-content retunes every popover in the app';

  readonly arrowLeftFinding: string = 'Measured 0px whenever the panel is inline-start-aligned with its trigger; on a panel ' +
    'that had to right-align it was written as 339.89px, moving the arrow from its 20px ' +
    'resting offset to 359.89px.';
  readonly flipFinding: string = 'Measured on a flipped panel: both the class and the data attribute are set, ' +
    'margin-block-start becomes -10px and margin-block-end 10px, and the panel sits exactly ' +
    'one gutter above its trigger.';
  readonly edgeFinding: string = "Measured on a right-aligned panel: its right edge lands on the trigger's right edge, " +
    'and the arrow variable is written with the distance the panel moved (339.89px on the ' +
    'panel measured), carrying the arrow from its 20px resting offset back towards the trigger.';
  readonly scrollFinding: string = 'Measured: scrolling an overflow:auto ancestor of the trigger hides the panel, while ' +
    'scrolling the page does not - there it stays one gutter below its trigger throughout.';
  readonly resizeFinding: string = 'Measured: any window resize hides an open panel outright, off touch devices.';
  readonly ptIdFinding: string = "Measured: the pass-through id lands on the root element, so the trigger's aria-controls " +
    'resolves to a node that exists.';
  readonly rtlFinding: string = 'Measured with dir="rtl": placement is NOT mirrored. The panel\'s LEFT edge still meets ' +
    "the trigger's left edge, so it hangs off the trigger's inline end by whatever the panel " +
    'is wider than the trigger, and the arrow stays at a physical left of 20px - it no longer ' +
    'marks the anchor.';

  readonly motionEnter: string = 'p-animate-anchored-overlay-enter, 300ms cubic-bezier(.19,1,.22,1): opacity 0 to 1, scale(0.93) to 1';
  readonly motionLeave: string = 'p-animate-anchored-overlay-leave, 300ms, the same curve';
  readonly motionEnterReduced: string = 'never applied - no p-anchored-overlay class appears on the root at all';
  readonly motionLeaveReduced: string = 'never applied';
  readonly reducedStillWorksFinding: string = 'Measured under the emulated media feature: the enter classes never appear on the root at ' +
    'all, the panel is opaque from the first frame, still appended to body and positioned ' +
    'against its trigger, and Escape still closes it. The skip path calls the enter hooks ' +
    'synchronously, so no behavior rides on the animation. Emulate the feature and read the ' +
    'root class list to confirm it in your own build.';
  readonly deadTransitionFinding: string = 'PrimeNG 22 dropped them; Optimus keeps the v21 inputs (openng-optimus-ui-popover.mjs:107 ' +
    'and :113, deprecated since v21.0.0) but reads neither - the template binds motionOptions ' +
    '(pMotion) instead, so setting them changes nothing.';
  readonly deadCloseLabelFinding: string = 'Declared at openng-optimus-ui-popover.mjs:91 and read by no template and no method. ' +
    'Measured on the rendered panel: its only child is .p-popover-content, and ' +
    'there is no close button for the label to name. Render your own close button and ' +
    'label that.';

  readonly ariaModalFinding: string = 'measured in the accessibility tree as a dialog with modal: true, while the page behind ' +
    'it stays clickable, tabbable, and scrollable';
  readonly focusSummary: string = 'In only to an element with the autofocus attribute - which every p-button has. No trap, no restore. Escape always closes.';
  readonly focusInFinding: string = 'Only to the first element carrying the autofocus attribute, in document order. Measured: ' +
    'a panel holding an input and two p-buttons focuses the first BUTTON; put pAutoFocus on ' +
    'the input and focus goes there instead; a panel of plain markup leaves focus on the trigger.';
  readonly focusBackFinding: string = 'No. Measured after Escape from a panel that held focus: document.activeElement is body.';
  readonly escapeFinding: string = 'Measured: Escape closes the panel with focus outside it, and closes it even with dismissable off.';
  readonly tabOrderFinding: string = 'Measured: with focus on the trigger, one Tab moves to the next control on the PAGE and the panel stays open.';
  readonly axNamed: string = 'dialog, name from ariaLabel, modal: true';
  readonly axTrigger: string = 'button, name from the label, expanded: true, haspopup: "dialog" - when the attributes are routed through [pt]';
  readonly unnamedFinding: string = 'measured in the accessibility tree, the node comes back as a dialog with an empty name.';
  readonly labelledByFinding: string = 'dialog named from the referenced element. The capitalized [attr.aria-labelledBy] in the ' +
    'shipped template lands as the lowercase attribute, because setAttribute lowercases ' +
    'attribute names in an HTML document.';
  readonly axNote: string = 'Read from the accessibility tree of a rendered panel and its trigger. Two ' +
    'things are worth carrying away. The dialog node is present and modal whatever else you ' +
    'configure, so its name is the only part of that announcement you control - and an ' +
    'unnamed panel is announced as an anonymous dialog. And the trigger carries the ' +
    'disclosure state only if the attributes reached the button element: read that from the ' +
    'tree rather than from the markup, because the markup can look correct and reach nothing.';
  readonly wrapperAttrFinding: string = 'measured on the rendered DOM, the bindings sit on the p-button element, which carries ' +
    'no role, while the inner button a screen reader announces has neither attribute. ' +
    'Routed through [pt], the same button comes back from the accessibility tree with ' +
    'expanded: true and haspopup: "dialog".';
  readonly autofocusAttrFinding: string = 'in Optimus 2.0.2 every p-button writes one: the AutoFocus directive sets the attribute ' +
    'unless its input is exactly false (openng-optimus-ui-autofocus.mjs:23-28), and Button ' +
    'binds it to autofocus || buttonProps?.autofocus, which is undefined by default ' +
    '(openng-optimus-ui-button.mjs:844). So the panel focuses its first button.';

  // --- Static example snippets ----------------------------------------------
  readonly detailCode: string = `<!-- labels() and triggerPt() are computed(); triggerPt carries the disclosure
     attributes through [pt], so they reach the inner <button>. -->
<p-button [label]="labels().whatIsGrounding" [link]="true"
  [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />

<p-popover #panel [ariaLabel]="labels().groundingTitle"
  (onShow)="open.set(true)" (onHide)="open.set(false)">
  <div class="panel">
    <h4>{{ labels().groundingTitle }}</h4>
    <p>{{ labels().groundingBody }}</p>
  </div>
</p-popover>`;

  readonly formCode: string = `<p-button id="add-label-trigger" [label]="labels().addLabel"
  [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />

<p-popover #panel [ariaLabel]="labels().addLabel"
  (onShow)="open.set(true)" (onHide)="onHide()">
  <!-- closeCallback is the ONLY close affordance the component offers -->
  <ng-template #content let-close="closeCallback">
    <div class="panel">
      <label for="label-name">{{ labels().name }}</label>
      <!-- pAutoFocus writes the real autofocus attribute, which is what
           focusOnShow looks for. Without it focus never enters the panel. -->
      <input pInputText id="label-name" [pAutoFocus]="true" [(ngModel)]="name" />
      <p-button [label]="labels().save" (onClick)="close($event)" />
    </div>
  </ng-template>
</p-popover>

// component: nothing restores focus for you
onHide(): void {
  this.open.set(false);
  document.getElementById('add-label-trigger')?.querySelector('button')?.focus();
}`;

  readonly placeCode: string = `<!-- There is no position input. Placement is computed once, at open time:
     below and inline-start-aligned, flipped above when it does not fit,
     right-aligned when it would overflow the viewport's right edge. -->
<p-button [label]="labels().placement" (onClick)="panel.toggle($event)" />
<p-popover #panel [ariaLabel]="labels().placement">
  <div class="panel">...</div>
</p-popover>

/* The one thing worth styling: a width cap, because there is no width token. */
.panel { max-width: 22rem; }`;

  readonly dismissCode: string = `<!-- Default: outside click and Escape both close it. -->
<p-popover #a [ariaLabel]="labels().panel">...</p-popover>

<!-- dismissable off: an outside click no longer closes it.
     Escape still does - there is no closeOnEscape input on this component. -->
<p-popover #b [dismissable]="false" [ariaLabel]="labels().panel">...</p-popover>

<!-- A trigger inside an overflow:auto ancestor: scrolling that ancestor hides
     the panel, because it is positioned once and never re-aligned. -->
<div class="scrolling-box">
  <p-button [label]="labels().open" (onClick)="c.toggle($event)" />
  <p-popover #c [ariaLabel]="labels().panel">...</p-popover>
</div>`;

  readonly vsCode: string = `<!-- A hint about a control: short, non-interactive, hover or focus. -->
<p-button [label]="labels().save" [pTooltip]="labels().saveHint" tooltipPosition="bottom" />

<!-- Anything a user must reach: a panel, opened by a click. -->
<p-button [label]="labels().options"
  [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />
<p-popover #panel [ariaLabel]="labels().options"
  (onShow)="open.set(true)" (onHide)="open.set(false)">
  <a [href]="docsUrl">{{ labels().readTheDocs }}</a>
</p-popover>`;

  readonly devImport: string = `import { PopoverModule } from '@openng/optimus-ui/popover';
// Only if a control inside the panel must receive focus on open:
import { AutoFocusModule } from '@openng/optimus-ui/autofocus';

@Component({
  standalone: true,
  imports: [PopoverModule, AutoFocusModule, ButtonModule],
  // ...
})`;

  readonly focusSnippet: string = `// The lines the component does not write for you.

// 1. Focus IN - focusOnShow (default true) focuses the FIRST element carrying
//    the autofocus attribute, in document order. pAutoFocus writes it.
<input pInputText [pAutoFocus]="true" [(ngModel)]="query" />

//    ...and every p-button writes it too, whether you asked or not. In a panel
//    where a button must NOT be the focus target, opt it out explicitly:
//    only the literal value false makes the directive remove the attribute.
<p-button [label]="labels().reset" [autofocus]="false" />

// 2. Focus BACK - nothing records the opener, so every dismissal path
//    (Escape, outside click, your own close button) ends on <body>.
<p-popover #panel [ariaLabel]="labels().panel" (onHide)="restore()">

restore(): void {
  this.open.set(false);
  this.trigger()?.nativeElement.querySelector('button')?.focus();
}`;

  readonly triggerSnippet: string = `<!-- The disclosure half of the component, which p-popover does not ship.
     Written on <p-button> these three attributes would sit on the host element;
     [pt] puts them on the <button> a screen reader announces. -->
<p-button
  #trigger
  [label]="labels().columnSettings"
  [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />

<p-popover
  #panel
  [ariaLabel]="labels().columnSettings"
  [pt]="{ root: { id: 'columns-panel' } }"
  (onShow)="open.set(true)"
  (onHide)="onHide()">
  <div class="panel">...</div>
</p-popover>`;

  readonly sizingSnippet: string = `/* 1. Cap the width. There is no width token, so the panel is as wide as its
      content - and a translation 30% longer is a panel 30% wider. */
.popover-panel { max-width: 22rem; }

/* 2. Cap the height, with a scroll container of your own. The panel has no
      max-height and no scrolling: a long list grows off the bottom of the
      window, and the page behind it is what scrolls. */
.popover-panel__list { max-height: 16rem; overflow-y: auto; }

/* The content padding is an ordinary custom property, so a scoped override
   needs no ::ng-deep. styleClass reaches the root if you need the panel. */
.compact-popover { --p-popover-content-padding: 0.5rem; }`;

  readonly i18nSnippet: string = `// Four strings, none of them from the library.
readonly labels = computed(() => ({
  // 1. the trigger: name the CONTENT, not the gesture
  trigger: this.i18n.translate('shipment.detailsTrigger'),   // "Shipment details"
  // 2. the panel's accessible name - the same words as the heading
  panel: this.i18n.translate('shipment.detailsTitle'),
  // 3. the content
  body: this.i18n.translate('shipment.detailsBody'),
  // 4. only exists because YOU render the close button
  close: this.i18n.translate('common.close'),
}));

// template
<p-button [label]="labels().trigger" [pt]="triggerPt()"
  (onClick)="panel.toggle($event)" />
<p-popover #panel [ariaLabel]="labels().panel">
  <div class="popover-panel">
    <h4>{{ labels().panel }}</h4>
    <p>{{ labels().body }}</p>
  </div>
</p-popover>`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component, computed, signal, viewChild } from '@angular/core';
import { PopoverModule, Popover } from '@openng/optimus-ui/popover';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  standalone: true,
  imports: [PopoverModule, ButtonModule],
  template: \`
    <!-- [pt], not [attr.aria-*]: on <p-button> the attributes would land on the
         host element and this spec's assertions could never pass. -->
    <p-button id="t" label="Details" [pt]="triggerPt()"
      (onClick)="panel().toggle($event)" />
    <p-popover [ariaLabel]="'Shipment details'"
      (onShow)="open.set(true)" (onHide)="onHide()">
      <p>Detail</p>
    </p-popover>\`,
})
class HostComponent {
  readonly panel = viewChild.required(Popover);
  readonly open = signal(false);
  readonly triggerPt = computed(() => ({
    root: { 'aria-expanded': String(this.open()), 'aria-haspopup': 'dialog' },
  }));
  onHide(): void {
    this.open.set(false);
    document.querySelector<HTMLElement>('#t button')?.focus();
  }
}

describe('popover disclosure contract', () => {
  it('names the panel and reports the trigger state', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('#t button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');

    fixture.componentInstance.panel().show(new MouseEvent('click'), trigger);
    fixture.detectChanges();
    // appendTo defaults to 'body', so the panel is NOT inside the fixture.
    const panel = document.querySelector('.p-popover');
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Shipment details');
  });

  it('puts focus back on the trigger when it closes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('#t button');
    fixture.componentInstance.panel().show(new MouseEvent('click'), trigger);
    fixture.detectChanges();

    fixture.componentInstance.onHide();
    // The component restores nothing; this asserts YOUR restore.
    expect(document.activeElement).toBe(trigger);
    // NOT expect(document.querySelector('.p-popover')).toBeNull(): teardown waits
    // for a change-detection pass, and in a fixture you are the one who runs it.
    expect(fixture.componentInstance.panel().overlayVisible).toBe(false);
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
        /* clipboard denied - leave the label unchanged */
      },
    );
  }
}
