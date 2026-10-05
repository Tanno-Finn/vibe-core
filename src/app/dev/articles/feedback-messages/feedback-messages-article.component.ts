import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, type ToastMessageOptions } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MessageModule } from '@openng/optimus-ui/message';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToastModule, type ToastPositionType } from '@openng/optimus-ui/toast';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    MessageModule,
    ToastModule,
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

      /* --- Shared surface --- */
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
        gap: var(--space-3);
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
      }
      .pg__hint {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .pg__code {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-2);
      }

      /* --- Two-up --- */
      .two {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-5);
        margin: 0 0 var(--space-4);
      }
      .two__cell {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
        min-width: 0;
      }
      .two__title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .two__note {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .two__cell p-message {
        width: 100%;
      }
      .probe {
        width: 100%;
        min-height: 3rem;
      }

      /* --- Severity matrix --- */
      .mx-controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        align-items: center;
        margin: 0 0 var(--space-4);
      }
      .mx-controls .pg__field {
        min-width: 11rem;
      }
      .mx {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
        margin: 0 0 var(--space-5);
      }
      .mx__col {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .mx__head {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }

      /* --- Instruments --- */
      .inst {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: var(--space-3);
        margin: 0 0 var(--space-5);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .inst__field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .inst__input {
        padding: 0.4rem 0.6rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-sm);
        background: var(--surface-card);
        color: var(--text-color);
        font: inherit;
      }
      .inst__out {
        flex-basis: 100%;
        margin: 0;
        display: grid;
        gap: 0.25rem;
      }
      .inst__out > div {
        display: grid;
        grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
        gap: var(--space-3);
      }
      .inst__out dt {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .inst__out dd {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: var(--text-color);
        word-break: break-word;
      }

      /* --- RTL demo --- */
      .rtl-demo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-card);
      }
      .rtl-demo p-message {
        width: 100%;
      }

      /* --- Do / Don't --- */
      .dd {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .dd__cell {
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-card);
      }
      .dd__why {
        margin: 0.4rem 0 0;
        font-size: 0.9rem;
        color: var(--text-color);
      }
      .tag {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        padding: 0.1rem 0.45rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--surface-border);
        color: var(--text-color-secondary);
      }
      .tag--bad {
        border-color: var(--red-500);
        color: var(--red-600);
      }
      .tag--good {
        border-color: var(--green-500);
        color: var(--green-600);
      }

      .copy-btn {
        font: inherit;
        font-size: var(--font-size-sm);
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        color: var(--text-color);
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
      td.bad {
        color: var(--red-600);
      }
      .check li {
        margin: 0.3rem 0;
      }
      .sources a,
      .history strong {
        color: var(--primary-color-fg);
      }
      @media (max-width: 900px) {
        .pg__grid,
        .two,
        .dd {
          grid-template-columns: minmax(0, 1fr);
        }
        .mx {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .copy-btn {
          transition: none;
        }
      }
    `;

/**
 * Guide article: Feedback Messages — p-message + p-toast (SPEC N5, Guides).
 *
 * One guide for one family: the two ways the system says something back. The
 * inline message stays with the thing it is about; the toast floats over the
 * page and leaves on a timer. The interesting content is the boundary between
 * them, and the fact that only one of the two is safe for anything the user
 * must act on.
 *
 * VERIFIED CLAIMS (read from the shipped source of Optimus UI 2.0.2; provenance
 * is carried in the tabs):
 *   - p-message carries BOTH role="alert" and aria-live="polite" as static host
 *     attributes (openng-optimus-ui-message.mjs:247, host block). role=alert implies an
 *     assertive live region, the explicit aria-live downgrades it, and the
 *     computed AX role stays "alert" either way.
 *   - p-toast's live region is NOT the container. The host renders only class,
 *     style, and data attributes (openng-optimus-ui-toast.mjs:682 host block);
 *     role="alert" aria-live="assertive" aria-atomic="true" sit on the
 *     per-message div (:227-229), which is created together with its text.
 *   - The toast close button carries a bare `autofocus` attribute
 *     (openng-optimus-ui-toast.mjs:275) — browsers do not act on it for a
 *     dynamically inserted button, so the toast does not steal
 *     focus. Optimus has NO handleFocusOnRemove: on close, focus falls to
 *     <body>.
 *   - MessageService is NOT providedIn: 'root' (openng-optimus-ui-api.mjs:329-364, no
 *     providedIn on the decorator) — an app that never provides it gets a
 *     NullInjectorError from p-toast, and two different providers give two
 *     silently disconnected buses.
 *   - Key routing is strict equality: canAdd() starts at
 *     `this.key === message.key` (openng-optimus-ui-toast.mjs:598) — a plain
 *     property again, not a signal — so an unkeyed toast takes only
 *     unkeyed messages and a keyed toast only its own key.
 *   - life resolves as `message?.life || this.life || 3000` (:175) — a message
 *     with life: 0 gets 3000, not "no timer"; that is what `sticky` is for.
 *   - BACK in Optimus (v21 API): p-message's text/escape/style/styleClass
 *     (openng-optimus-ui-message.mjs:89-158) compile and render again; the
 *     four transform/transition inputs on p-toast exist too (:468-486) but
 *     are never forwarded to a toast item, so they are inert — motionOptions
 *     drives the animation on both.
 *   - NO Sonner stacking: Optimus has no mode / stackGap / stackVisibleLimit
 *     and no swipe-to-dismiss; toasts are a plain for-loop list (:683). The
 *     pause is mouseenter/mouseleave only, and leaving RESTARTS the full life
 *     (:185-190).
 *   - p-message's dismissal is a CLASS, not a removal: close() only sets the
 *     visible signal to false (openng-optimus-ui-message.mjs:234-237); the
 *     host stamps .p-message-leave-active (host block, :247), whose keyframes end at
 *     opacity 0 and collapsed grid rows with `forwards`. The element stays in
 *     the DOM. Removal is your @if.
 *   - The toast's teardown goes through @openng/optimus-ui-motion, which skips motion
 *     entirely under prefers-reduced-motion (shouldSkipMotion, safe defaults to
 *     true) and falls back to an immediate resolve plus a timeout when no
 *     animation is registered — so, unlike the drawer's mask, a toast cannot be
 *     stranded by suppressed animations. p-message can: its collapse IS the
 *     animation.
 *   - Stacking: the toast root takes a z-index from the 'modal' tier on the
 *     first enter animation only (ZIndexUtils.set at
 *     openng-optimus-ui-toast.mjs:625-626), the same tier p-dialog and
 *     p-drawer use. No base rule outcascades the Aura 2.x toast.width token,
 *     so the root is 25rem wide.
 *
 * The sentinel binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-feedback-messages-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  providers: [MessageService],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'feedback-messages'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two components, one job: say what just happened. <code>p-message</code> is a box in the layout — it stays next
          to the thing it is about, and it stays until something removes it. <code>p-toast</code> is an overlay that
          appears in a corner and leaves on a timer. Everything below is live, including the instruments, because the
          differences that matter here are in the accessibility tree and in the timing, not in the markup.
        </p>

        <!-- The two shapes -->
        <section class="pg" aria-label="Inline message and toast, side by side">
          <div class="two">
            <div class="two__cell">
              <span class="two__title">Inline — <code>p-message</code></span>
              <p-message severity="warn"> Your session expires in 5 minutes. Save your draft to keep it. </p-message>
              <p class="two__note">In the flow, pushing the content below it down. Nothing removes it but you.</p>
            </div>
            <div class="two__cell">
              <span class="two__title">Overlay — <code>p-toast</code></span>
              <p-button label="Save draft" size="small" (onClick)="demoSave()" />
              <p class="two__note">
                Over the page, gone in three seconds, no layout cost — and no second chance to read it.
              </p>
            </div>
          </div>
        </section>

        <h3>The inline matrix</h3>
        <p>
          Six severities across three variants. The default variant is filled, <code>outlined</code> drops the
          background and keeps the ring, <code>simple</code> drops both and leaves colored text. The Design tab
          lists the contrast of every cell of this grid against its surface in both themes.
        </p>
        <div class="mx-controls">
          <div class="pg__field">
            <span class="pg__label" id="mx-size-label">size</span>
            <p-select
              [ariaLabelledBy]="'mx-size-label'"
              size="small"
              [options]="sizeOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="mxSize()"
              (ngModelChange)="mxSize.set($event)"
            />
          </div>
          <div class="pg__field pg__field--switch">
            <label for="mx-icon">show an icon</label>
            <p-toggleswitch inputId="mx-icon" [ngModel]="mxIcon()" (ngModelChange)="mxIcon.set($event)" />
          </div>
          <div class="pg__field pg__field--switch">
            <label for="mx-closable">closable</label>
            <p-toggleswitch inputId="mx-closable" [ngModel]="mxClosable()" (ngModelChange)="mxClosable.set($event)" />
          </div>
        </div>
        <div class="mx">
          @for (variant of variants; track variant.value) {
            <div class="mx__col">
              <span class="mx__head">{{ variant.label }}</span>
              @for (sev of severities; track sev) {
                <p-message
                  [severity]="sev"
                  [variant]="variant.value"
                  [size]="mxSize()"
                  [closable]="mxClosable()"
                  [icon]="mxIcon() ? iconFor(sev) : undefined"
                  [attr.data-mx]="sev + '/' + (variant.value || 'filled')"
                >
                  {{ sev }} — the quick brown fox
                </p-message>
              }
            </div>
          }
        </div>

        <h3>Closing an inline message removes nothing</h3>
        <p>
          <code>closable</code> gives you a close button; pressing it sets an internal signal and plays a collapse
          animation. The element is still there afterwards — collapsed, at opacity 0, and still an <code>alert</code> in
          the accessibility tree. Press both close buttons, then measure.
        </p>
        <div class="two">
          <div class="two__cell">
            <span class="two__title">Bare <code>closable</code></span>
            <div class="probe" data-probe="bare">
              <p-message severity="info" [closable]="true"> Closable, and nothing listens to it. </p-message>
            </div>
          </div>
          <div class="two__cell">
            <span class="two__title">Closable + <code>&#64;if</code></span>
            <div class="probe" data-probe="wired">
              @if (wiredVisible()) {
                <p-message severity="info" [closable]="true" (onClose)="wiredVisible.set(false)">
                  Closable, and the host removes it.
                </p-message>
              }
            </div>
          </div>
        </div>
        <div class="inst">
          <p-button label="Measure both probes" size="small" severity="secondary" (onClick)="measureProbes()" />
          <p-button label="Reset" size="small" severity="secondary" [text]="true" (onClick)="resetProbes()" />
          <dl class="inst__out">
            <div>
              <dt>bare probe</dt>
              <dd>{{ probeBare() }}</dd>
            </div>
            <div>
              <dt>wired probe</dt>
              <dd>{{ probeWired() }}</dd>
            </div>
          </dl>
        </div>

        <h3>Overriding what it announces</h3>
        <p>
          An inline message is an <code>alert</code> whether it deserves to be one or not. A read-only notice that is on
          the page from the first paint does not need to interrupt anyone; a validation summary that appears after a
          failed submit does. The pass-through is the only route to that decision — there is no input — and it is
          applied from a lifecycle hook, so it lands <em>after</em> the template's own attributes rather than losing to
          them.
        </p>
        <div class="inst">
          <div class="pg__field">
            <span class="pg__label" id="pt-label">pt.root</span>
            <p-select
              [ariaLabelledBy]="'pt-label'"
              size="small"
              [options]="ptOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="ptMode()"
              (ngModelChange)="ptMode.set($event)"
            />
          </div>
          <div class="probe" data-probe="pt">
            <p-message severity="info" [pt]="ptObject()"> This document is read-only. </p-message>
          </div>
          <p-button label="Read the rendered element" size="small" severity="secondary" (onClick)="measurePt()" />
          <dl class="inst__out">
            <div>
              <dt>rendered attributes</dt>
              <dd>{{ ptOut() }}</dd>
            </div>
            <div>
              <dt>variant="text"</dt>
              <dd>{{ variantTextOut() }}</dd>
            </div>
          </dl>
          <div class="probe" data-probe="variant-text">
            <p-message severity="info" variant="text"> A variant the typings offer and the theme does not. </p-message>
          </div>
        </div>

        <h3>Toast playground</h3>
        <p>
          One <code>p-toast</code> instance, driven by <code>MessageService.add()</code>. The code below the controls is
          the call, not the markup — the markup is one tag with a position.
        </p>
        <section class="pg" aria-label="Toast playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>
              <div class="pg__field">
                <span class="pg__label" id="tg-sev-label">severity</span>
                <p-select
                  [ariaLabelledBy]="'tg-sev-label'"
                  size="small"
                  [options]="severityOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgSeverity()"
                  (ngModelChange)="tgSeverity.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="tg-pos-label">position</span>
                <p-select
                  [ariaLabelledBy]="'tg-pos-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgPosition()"
                  (ngModelChange)="tgPosition.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="tg-life-label">life (ms)</span>
                <p-select
                  [ariaLabelledBy]="'tg-life-label'"
                  size="small"
                  [options]="lifeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgLife()"
                  (ngModelChange)="tgLife.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-sticky">sticky <span class="pg__aside">(ignores life)</span></label>
                <p-toggleswitch inputId="tg-sticky" [ngModel]="tgSticky()" (ngModelChange)="tgSticky.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-closable">closable</label>
                <p-toggleswitch
                  inputId="tg-closable"
                  [ngModel]="tgClosable()"
                  (ngModelChange)="tgClosable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-detail">detail line</label>
                <p-toggleswitch inputId="tg-detail" [ngModel]="tgDetail()" (ngModelChange)="tgDetail.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Trigger</span>
              <div class="pg__stage">
                <p-button label="Show toast" size="small" (onClick)="showToast()" />
                <p-button label="Show three" size="small" severity="secondary" (onClick)="showThree()" />
                <p-button
                  label="Show all six severities"
                  size="small"
                  severity="secondary"
                  (onClick)="showAllSeverities()"
                />
                <p-button label="Clear all" size="small" severity="secondary" [text]="true" (onClick)="clearToasts()" />
                <p class="pg__hint">{{ tgHint() }}</p>
              </div>
            </div>
          </div>
          <div class="pg__code">
            <span class="pg__code-label">MessageService call</span>
            <button type="button" class="copy-btn" (click)="copy('tg', tgCode())">
              {{ copiedId() === 'tg' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ tgCode() }}</code></pre>
        </section>

        <h3>What the toast does to focus, and what it announces</h3>
        <p>
          The close button ships with a bare <code>autofocus</code> attribute, which raises a fair question: does a
          toast pull focus away from whatever you were doing? Put focus in the field, show a toast, and read the
          instrument. Then close the toast by clicking its button and read the second row — a control that removes
          itself has to leave focus somewhere.
        </p>
        <div class="inst">
          <label class="inst__field">
            <span>Type here first, then press the button</span>
            <input type="text" class="inst__input" id="fj-input" />
          </label>
          <p-button label="Show a sticky toast and measure" size="small" (onClick)="measureFocusJourney()" />
          <dl class="inst__out">
            <div>
              <dt>focus before</dt>
              <dd>{{ fjBefore() }}</dd>
            </div>
            <div>
              <dt>focus 450 ms after it appeared</dt>
              <dd>{{ fjAfter() }}</dd>
            </div>
            <div>
              <dt>message element</dt>
              <dd>{{ fjAttrs() }}</dd>
            </div>
            <div>
              <dt>focus after closing it by click</dt>
              <dd>{{ fjClosed() }}</dd>
            </div>
          </dl>
        </div>

        <h3>Two buses, two toasts: <code>key</code></h3>
        <p>
          A second <code>p-toast</code> with <code>key="side"</code> shares the same service and takes only messages
          that carry the same key. Routing is exact equality, so the unkeyed toast never shows a keyed message either.
        </p>
        <div class="inst">
          <p-button label="add() with no key" size="small" severity="secondary" (onClick)="showUnkeyed()" />
          <p-button label="add({ key: 'side' })" size="small" severity="secondary" (onClick)="showKeyed()" />
          <p-button label="clear('side')" size="small" severity="secondary" [text]="true" (onClick)="clearKeyed()" />
        </div>

        <!-- The two live toast outlets -->
        <p-toast [position]="tgPosition()" />
        <p-toast key="side" position="bottom-left" />
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which surface</h3>
        <p>
          The choice is not "inline or overlay". It is: <em>how bad is it if nobody reads this?</em>
          A toast is the only surface in this table that answers "fine" — everything else exists because the answer was
          "not fine".
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Reach for</th>
                <th>Why not the others</th>
              </tr>
            </thead>
            <tbody>
              @for (row of surfaceRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>
                    <code>{{ row.use }}</code>
                  </td>
                  <td>{{ row.why }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>When a toast is the wrong answer</h3>
        <ul>
          <li>
            <strong>The message requires an action.</strong> "Upload failed — retry?" in a toast is a three-second
            window on a decision. Put the action where the failure is: an inline message with a button in it, or a
            dialog if it truly blocks.
          </li>
          <li>
            <strong>The message must be re-readable.</strong> A toast is gone and unrecoverable; there is no history, no
            log, nothing to scroll back to. If the user may need it twice, it belongs in the layout.
          </li>
          <li>
            <strong>The user cannot control the timing.</strong> A default toast disappears after three seconds whether
            or not it has been read — hovering pauses it, but only if you happen to be pointing at it, and a keyboard or
            screen-reader user has no equivalent. That is the WCAG "Timing Adjustable" argument in one sentence.
          </li>
          <li>
            <strong>It belongs to a form field.</strong> The kit's convention for validation is a hint element under the
            input, referenced by <code>aria-describedby</code>, plus <code>aria-invalid</code> on the control — see the
            Text Inputs guide. A message box floating above the form is not the same thing: the error has to be
            reachable from the field, in the field's own accessible description.
          </li>
          <li>
            <strong>It is progress, not an outcome.</strong> Work still in flight is a Progress or Skeleton surface; a
            message is for the result.
          </li>
        </ul>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              Report a failed save as a toast, because the success case is one too and symmetry feels tidy.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Split them: success leaves on a timer, failure stays. An error toast is either
              <code>sticky</code> or an inline message next to the thing that failed.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              <code>&lt;p-message [closable]="true"&gt;</code> and assume the close button removes it. It collapses to
              nothing and stays in the tree as an alert.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Wrap it in the <code>&#64;if</code> that owns its state and drop the state in <code>(onClose)</code>. The
              component's visibility signal is presentation; your condition is the truth.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              Put the whole sentence in <code>summary</code> because <code>detail</code> renders smaller and looks
              unimportant.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              <code>summary</code> is the outcome in three words; <code>detail</code> is the one sentence that follows.
              Both are read as one unit — the message is <code>aria-atomic</code>.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              Provide <code>MessageService</code> in two places — once in a component and once in the app — and then
              wonder why half the toasts never appear.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              One provider for one outlet. It has no <code>providedIn</code>, so the injector you put it in
              <em>is</em> the bus; a second one is a second bus nobody listens to.
            </p>
          </div>
        </div>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#alert" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>alert</code> role</a
            >
            — normative: an alert is an assertive live region for a time-sensitive message, and it must not be given
            focus. Both components ship the role; this is the definition they are measured against, including the
            aria-live value that comes with it.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            — the criterion that decides whether a confirmation counts as delivered: it must reach assistive technology
            without moving focus. Also the reason a live region has to exist before the text does.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.1 Timing Adjustable</a
            >
            — the three-second default read as a time limit on content, and the conditions under which an
            auto-dismissing message is defensible at all.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — the <code>autofocus</code> attribute</a
            >
            — what the attribute the toast's close button carries is specified to do, and why the question "does a toast
            steal focus" has to be answered by measurement rather than by reading the template.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <ul>
          <li>
            <strong>Inline message</strong> — the <code>&lt;p-message&gt;</code> element itself is the box:
            <code>display: grid</code> with one row, a border drawn as an <code>outline</code> (not a border), and a
            radius token. Inside it, a wrapper, a flex content row, an optional icon, the text span your projected
            content lands in, and the optional close button pushed out by <code>margin-inline-start: auto</code>.
          </li>
          <li>
            <strong>Toast root</strong> — <code>&lt;p-toast&gt;</code> stays where you declared it and is made an
            overlay by inline styles: <code>position: fixed</code> plus the two offsets its position implies, always
            <code>20px</code>. Width comes from a token; the root has no role and no name.
          </li>
          <li>
            <strong>Toast message</strong> — one div per message, with the border, radius, backdrop blur, and shadow,
            holding icon, a text column of <code>summary</code> + <code>detail</code>, and the close button. This div,
            not the root, is the live region.
          </li>
        </ul>
        <p class="src-note">{{ anatomyNote }}</p>

        <h3>The token chain</h3>
        <p>
          Both components resolve their surface from a per-severity block in the Aura preset. The shape is identical for
          all six severities, so one severity is enough to read the chain:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Property</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.token) {
                <tr>
                  <td>{{ row.el }}</td>
                  <td>
                    <code>{{ row.prop }}</code>
                  </td>
                  <td>
                    <code>{{ row.token }}</code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Two asymmetries are worth knowing before you restyle. The inline message draws its edge with
          <code>outline</code>, so it does not take part in layout and cannot be overridden with a
          <code>border</code> shorthand; the toast uses a real <code>border</code>. And the toast has a
          <code>detail</code> color token of its own, which is a different value from the message text color — the
          second line is deliberately quieter.
        </p>

        <h3>Contrast, gated</h3>
        <p>
          Every severity is a different surface, and each of them is a different surface again in dark mode and again
          per variant. Aura colors the severities from its <code>500</code>/<code>600</code> primitives, which failed
          4.5:1 in several cells (light warn 2.84:1 on its tint); the kit re-points the info, success, warn, and error
          text, icon, and outline of both components to its semantic inks (<code>--semantic-blue-fg</code>,
          <code>-green-fg</code>, <code>-orange-fg</code> for warn, <code>-red-fg</code>), and the secondary outlined /
          simple text to <code>--text-color-secondary</code>. The tint behind the filled box stays Aura's, so the dark
          fill is mostly the page behind it, and the page is the style's. The table gives the gated range across the
          four visual styles.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Surface</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.key) {
                <tr>
                  <td>{{ row.severity }}</td>
                  <td>{{ row.surface }}</td>
                  <td [class.bad]="row.lightFail">{{ row.light }}</td>
                  <td [class.bad]="row.darkFail">{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometry and the focus ring</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          <strong>On a narrow screen</strong> the two part ways. The inline message is a block in the flow: it takes its
          container's width and its text wraps. The toast has no intrinsic responsive behavior — the root keeps the
          <code>25rem</code> token width at every viewport and sits <code>20px</code> from its anchored edge, so below
          about <code>27.5rem</code> it runs off the opposite edge. Pass <code>breakpoints</code>, e.g.
          <code>&#123; '30rem': &#123; width: 'calc(100vw - 2.5rem)' &#125; &#125;</code>, which the toast writes into a
          media query with <code>!important</code>.
        </p>
        <p class="src-note">
          Root width from <code>&#64;openng/optimus-ui-styles/dist/toast/index.mjs</code> (<code>.p-toast</code>),
          offsets and the breakpoint rule from <code>openng-optimus-ui-toast.mjs:21-28</code> and <code>:641-649</code>.
        </p>

        <h3>Motion, and which of the two can be stranded</h3>
        <p>
          The two components animate through completely different machinery, and it decides what happens when animations
          are suppressed.
        </p>
        <ul>
          <li>
            <strong>The toast</strong> goes through the motion layer, which has three escape hatches: it skips motion
            entirely when the user prefers reduced motion, it resolves immediately when the element has no animation or
            transition registered, and it arms a timeout as a backstop. The removal is driven by the after-leave hook,
            so a toast still disappears with every animation turned off.
          </li>
          <li>
            <strong>The inline message</strong> has no such layer. Its collapse <em>is</em> the keyframe animation — the
            leave class ends at <code>opacity: 0</code> with <code>animation-fill-mode: forwards</code>. Kill the
            animation with <code>animation: none</code> and a "closed" message stays fully visible and fully
            interactive, because nothing else ever changed.
          </li>
          <li>
            The kit's global reduced-motion rule sets <code>animation-duration: 0.01ms</code> rather than
            <code>none</code>, which is exactly why this failure mode does not appear here: the collapse still runs,
            instantly. A local override that reaches for <code>none</code> reintroduces it.
          </li>
        </ul>
        <p class="src-note">{{ motionNote }}</p>

        <h3>Stacking</h3>
        <p>
          The toast root gets its <code>z-index</code> from the shared layer manager on the first enter animation, out
          of the same tier a dialog and a drawer use, and hands it back when the last message leaves. Two consequences:
          a toast opened <em>before</em> a modal sits below it, one opened after sits above it, and neither is above the
          other by design — the tier is shared, the order decides. If a toast must survive a modal, give it a
          <code>baseZIndex</code> above the tier.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Measured</th>
              </tr>
            </thead>
            <tbody>
              @for (row of stackRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.3 for the inline message, which is in the tree from the first render with
          <code>role="alert"</code> and <code>aria-live="polite"</code>, so a text change is announced without focus
          moving — and focus was measured not to move for either component, despite the bare <code>autofocus</code> on
          the toast's close button; SC 1.4.3 for every severity and variant over the style's ground and card, lowest
          4.60:1, gated in <code>docs/generated/CONTRAST.MD</code> (<code>message &amp; toast</code>); and SC 1.4.11 for
          the close button's ring, 2px in the notice's own text color, which carries that same ≥&nbsp;4.5:1.
          <strong>Failing:</strong> none of the measured criteria. <strong>Conditional:</strong> SC 1.4.3 for a toast
          floating over anything but the page ground or a card — the fill is semi-transparent, so the dark tint
          composites with whatever is behind it, and the gate measures only those two surfaces; SC 4.1.3 for the toast, whose alert node and text enter the
          tree in the same update — there is no content change to observe, only a freshly inserted alert, which browsers
          do map to a platform alert event but which is the fragile end of the mechanism; and SC 2.2.1, because the
          three-second default is a time limit only a pointer can pause, so a message that must be read has to be
          sticky. <strong>AAA</strong> is not assessed for these components.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3><code>p-message</code> — inputs with their shipped defaults</h3>
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
              @for (row of messageApiRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>
                    <code>{{ row.def }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Templates: <code>#container</code> (replaces the whole content and receives a <code>closeCallback</code>),
          <code>#icon</code>, <code>#closeicon</code>. Output: <code>(onClose)</code>. There is no visibility input at
          all — the component owns an internal signal and never exposes it, so the host's condition is the only handle
          you have.
        </p>

        <h3><code>p-toast</code> — inputs with their shipped defaults</h3>
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
              @for (row of toastApiRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>
                    <code>{{ row.def }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>The service contract</h3>
        <p>
          <code>MessageService</code> is a two-subject bus and nothing else — no store, no state, no replay. A toast
          created after an <code>add()</code> shows nothing; a message emitted with no toast mounted is lost. It carries
          no <code>providedIn</code>, so it must be provided by hand, and the injector you choose is the bus: providing
          it again in a component gives that subtree a private service and silently disconnects it from the app's
          outlet.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              @for (row of serviceRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>Every field of one message:</p>
        <pre class="code-block"><code>{{ messageOptionsSnippet }}</code></pre>

        <h3>Naming, roles, and what actually reaches the tree</h3>
        <p>
          Both components hard-code their live-region semantics as static attributes, and both route pass-through
          attributes onto the same element through the bind directive, applied from a lifecycle hook — after the
          template's own attributes. So the pass-through wins, on both change-detection strategies:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Ships</th>
                <th>Override route</th>
              </tr>
            </thead>
            <tbody>
              @for (row of ariaRows; track row.el) {
                <tr>
                  <td>{{ row.el }}</td>
                  <td>
                    <code>{{ row.ships }}</code>
                  </td>
                  <td>
                    <code>{{ row.route }}</code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ ariaNote }}</p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>

        <h3>The announcement problem, precisely</h3>
        <p>
          A live region is announced when its <em>contents</em> change while the region is already in the accessibility
          tree. The toast does not work that way, and the tree shows it: showing one adds the <code>alert</code> node
          and its text to the tree in the same update — the region and the content arrive together, so there is no
          content change to observe, only a new alert. Browsers do map a freshly inserted <code>alert</code> to a
          platform alert event, which is why toasts are usually heard; it is nevertheless the fragile end of the
          mechanism, and it is why the same message pushed into a region that was already on the page is the sturdier
          build — subscribe to the service and mirror it there. Verify in the browser's accessibility tree: exactly one
          node should carry <code>live="assertive"</code>, and it should be the message, not the root.
        </p>
        <p>
          The inline message has the opposite property and a different trap: it is in the tree from the first render —
          the server already sends it — so it announces nothing at load, and a message that merely
          <em>changes its text</em> is the case the region was made for. A message that appears because a condition
          flipped is announced as a new alert; one whose text you mutate is announced as a content change, and only
          reliably so because the role makes the region atomic. Either is fine; what is not fine is assuming the box is
          heard because it is visible.
        </p>

        <h3>Focus and the keyboard</h3>
        <ul>
          @for (item of focusRows; track item) {
            <li>{{ item }}</li>
          }
        </ul>

        <h3>SSR</h3>
        <p>{{ ssrNote }}</p>

        <h3>Accessibility checklist</h3>
        <ul class="check">
          @for (item of checklist; track item) {
            <li>{{ item }}</li>
          }
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the two facts from the table above: the inline message's
          live-region semantics are static host attributes, and the pass-through overrides them because it is written
          from a lifecycle hook.
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>One string comes from the library — and it is easy to leave in English</h3>
        <p>
          Everything a user reads in these two components comes from your code, with exactly one exception: the close
          button's accessible name. Both components take it from the library's own ARIA table
          (<code>translation.aria.close</code>, default <code>"Close"</code>), and neither offers an input to override
          it. There is no per-instance escape hatch — the only way to translate it is to push the table.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">{{ i18nNote }}</p>

        <h3>What you own</h3>
        <ul>
          <li>
            <strong><code>summary</code> and <code>detail</code></strong> — build them at <code>add()</code> time from
            the translation service. A toast is created once and never re-renders; a language switch after it appeared
            will not reach it, which is fine precisely because it is about to disappear.
          </li>
          <li>
            <strong>The inline message's projected content</strong> — this one <em>does</em> live on the page, so bind
            it through a <code>computed()</code> like any other text, or it goes stale on a language switch.
          </li>
          <li>
            <strong>An override name</strong>, if you set one through the pass-through — same rule, it is UI text.
          </li>
        </ul>

        <h3>Length: the toast is a fixed-width box with a hard-wrap</h3>
        <p>
          The toast root's width is fixed, not a max-width, so a longer language does not widen it — it grows downward.
          (The effective width is the <code>toast.width</code> token,
          <code>25rem</code> — see the design tab.) The stylesheet sets
          <code>white-space: pre-line</code> and <code>word-break: break-word</code> on the root: newlines in your
          string are honored (deliberate — you can format), and a long compound word will be broken mid-word rather
          than overflow. Neither is a substitute for a short summary. The inline message has no width of its own and
          takes the container's, so there the risk is the opposite one: a message the width of the page with a two-word
          sentence in it.
        </p>

        <h3>RTL</h3>
        <p>
          The stylesheet does not answer this one: render both components in a
          <code>dir="rtl"</code> subtree and compare the boxes with the same markup in LTR. Half of what follows mirrors
          and half does not.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>LTR</th>
                <th>RTL</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.ltr }}</td>
                  <td>{{ row.rtl }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ rtlNote }}</p>
        <p>Live, in an RTL subtree — the message mirrors, the corner does not:</p>
        <div class="rtl-demo" dir="rtl">
          <p-message severity="warn" [closable]="true"> ההודעה הזאת נטענת בכיוון ימין־לשמאל </p-message>
          <p-button label="הצג הודעה צפה" size="small" (onClick)="showRtlToast()" />
          <p-toast key="rtl" position="top-right" />
        </div>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: severities on the kit
            semantic inks, the contrast table quoted from the gate (lowest 4.60:1, no failing row), the close-button
            ring in the notice's own color; WCAG status updated.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): all line refs hold; the
            contrast table is labeled as the Aura stock palette (severity colors are Aura primitives no style
            overrides; the dark column follows the style's page) and marked as outside the contrast gate;
            message and toast radii follow the style's <code>border.radius.md</code>; a narrow-screen statement
            added to the design tab; the agent doc trimmed and its closing pointer
            line restored.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): every line ref re-derived
            against the Optimus bundles, and the toast now lives in its own bundle
            (<code>openng-optimus-ui-toast.mjs</code>). Three v22 claims are FALSE here: there is no Sonner stacking
            (<code>mode</code>/<code>stackGap</code>/<code>stackVisibleLimit</code> and swipe do not exist), no
            <code>handleFocusOnRemove</code> — focus falls to <code>&lt;body&gt;</code> — and hover-leave restarts the
            FULL life instead of resuming the remainder. The deprecated v21 inputs are back and compile
            (<code>text</code>/<code>escape</code>/<code>style</code>/<code>styleClass</code> even render; the
            transform/transition options are inert). Geometry is back on Aura 2.x: close buttons 28px, message text
            1rem, toast width the 25rem token with no base rule outcascading it, blur 1.5px light / 10px dark; the
            color values are unchanged, so the contrast table still carries.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1 (Aura 3.0): all line refs re-derived.
            Removed in v22: p-message <code>text</code>/<code>escape</code>/<code>style</code>/<code>styleClass</code>
            and the transition inputs of both components (deprecated-inert in 21) — bindings no longer compile;
            <code>motionOptions</code> replaces them. New in v22: the toast stacks Sonner-style by default
            (<code>mode</code>, <code>stackGap</code>, <code>stackVisibleLimit</code>, swipe-to-dismiss), a hover pause
            that resumes the <em>remaining</em> life, and focus moving to a neighboring toast on close. Aura 3.0
            compacted the geometry (message text 0.875rem, close buttons 24px, toast icons 1rem) and a late base rule
            pins the toast width to 18.75rem past the 22rem token; color tokens are unchanged, so the contrast table
            carries. Browser measurements not repeated are marked as measured on 21.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed. TestBed snippet
            added to the development tab.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide for the feedback family: the inline/overlay boundary
            against dialog, confirmdialog, field-level validation, and a persistent live region; the measured announce
            matrix for both components including the role/aria-live pair the inline message ships; the
            <code>autofocus</code> question settled by measurement; <code>MessageService</code> as an unrooted bus and
            its key routing; the collapse-is-an-animation pitfall that leaves a "closed" message on the page;
            per-severity contrast for both surfaces in both themes; the shared modal z-index tier; and the canonical
            agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FeedbackMessagesArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly messageService = inject(MessageService);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

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

  // ------------------------------------------------------------ inline matrix

  readonly severities = ['success', 'info', 'warn', 'error', 'secondary', 'contrast'] as const;

  readonly variants = [
    { label: 'default (filled)', value: undefined as undefined | 'outlined' | 'simple' },
    { label: 'outlined', value: 'outlined' as const },
    { label: 'simple', value: 'simple' as const },
  ];

  readonly sizeOptions = [
    { label: 'small', value: 'small' as const },
    { label: 'normal (unset)', value: undefined },
    { label: 'large', value: 'large' as const },
  ];

  readonly mxSize = signal<'small' | 'large' | undefined>(undefined);
  readonly mxIcon = signal(true);
  readonly mxClosable = signal(false);

  iconFor(severity: string): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }

  // ----------------------------------------------------------- removal probes

  readonly wiredVisible = signal(true);
  readonly probeBare = signal('press the close button, then measure');
  readonly probeWired = signal('press the close button, then measure');

  measureProbes(): void {
    if (!this.isBrowser) return;
    this.probeBare.set(this.describeProbe('bare'));
    this.probeWired.set(this.describeProbe('wired'));
  }

  resetProbes(): void {
    this.wiredVisible.set(true);
    this.probeBare.set('press the close button, then measure');
    this.probeWired.set('press the close button, then measure');
  }

  // browser-only: reached only from the demo button handlers.
  protected describeProbe(name: string): string {
    const host = document.querySelector(`[data-probe="${name}"]`);
    const el = host?.querySelector('p-message');
    if (!el) return 'no p-message element in the DOM';
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return `still in the DOM — role=${el.getAttribute('role')}, opacity ${cs.opacity}, height ${rect.height.toFixed(1)}px`;
  }

  // --------------------------------------------------------- pass-through probe

  readonly ptOptions = [
    { label: 'none — what it ships', value: 'none' },
    { label: "status + polite — don't interrupt", value: 'status' },
    { label: 'alert + assertive — interrupt', value: 'assertive' },
  ];

  readonly ptMode = signal<'none' | 'status' | 'assertive'>('status');

  readonly ptObject = computed(() => {
    switch (this.ptMode()) {
      case 'status':
        return { root: { role: 'status', 'aria-live': 'polite' } };
      case 'assertive':
        return { root: { role: 'alert', 'aria-live': 'assertive' } };
      default:
        return undefined;
    }
  });

  readonly ptOut = signal('press the button');
  readonly variantTextOut = signal('press the button');

  measurePt(): void {
    if (!this.isBrowser) return;
    const el = document.querySelector('[data-probe="pt"] p-message');
    this.ptOut.set(el ? `role=${el.getAttribute('role')} aria-live=${el.getAttribute('aria-live')}` : 'not rendered');
    const vt = document.querySelector('[data-probe="variant-text"] p-message');
    if (!vt) {
      this.variantTextOut.set('not rendered');
      return;
    }
    const cs = getComputedStyle(vt);
    this.variantTextOut.set(
      `class="${vt.className.replace(/ng-\S+\s*/g, '').trim()}" background=${cs.backgroundColor}`,
    );
  }

  // ------------------------------------------------------------- toast player

  readonly severityOptions = [
    { label: 'success', value: 'success' },
    { label: 'info (default)', value: 'info' },
    { label: 'warn', value: 'warn' },
    { label: 'error', value: 'error' },
    { label: 'secondary', value: 'secondary' },
    { label: 'contrast', value: 'contrast' },
  ];

  readonly positionOptions: { label: string; value: ToastPositionType }[] = [
    { label: 'top-right (default)', value: 'top-right' },
    { label: 'top-center', value: 'top-center' },
    { label: 'top-left', value: 'top-left' },
    { label: 'bottom-right', value: 'bottom-right' },
    { label: 'bottom-center', value: 'bottom-center' },
    { label: 'bottom-left', value: 'bottom-left' },
    { label: 'center', value: 'center' },
  ];

  readonly lifeOptions = [
    { label: '3000 (the default)', value: 3000 },
    { label: '1500', value: 1500 },
    { label: '8000', value: 8000 },
  ];

  readonly tgSeverity = signal('info');
  readonly tgPosition = signal<ToastPositionType>('top-right');
  readonly tgLife = signal(3000);
  readonly tgSticky = signal(false);
  readonly tgClosable = signal(true);
  readonly tgDetail = signal(true);

  readonly tgHint = computed(() => {
    const parts: string[] = [];
    parts.push(
      this.tgSticky()
        ? 'Sticky: no timer at all — it stays until it is closed or cleared.'
        : `Leaves after ${this.tgLife()} ms; pointing at it pauses the timer, moving away restarts it from the top.`,
    );
    if (!this.tgClosable()) parts.push('No close button: with sticky on, this leaves no way out but Clear all.');
    return parts.join(' ');
  });

  readonly tgCode = computed(() => {
    const lines = [
      'this.messageService.add({',
      `  severity: '${this.tgSeverity()}',`,
      `  summary: labels().savedTitle,`,
    ];
    if (this.tgDetail()) lines.push('  detail: labels().savedDetail,');
    if (this.tgSticky()) lines.push('  sticky: true,');
    else if (this.tgLife() !== 3000) lines.push(`  life: ${this.tgLife()},`);
    if (!this.tgClosable()) lines.push('  closable: false,');
    lines.push('});');
    lines.push('');
    lines.push(`<!-- the outlet, once, near the app root -->`);
    lines.push(`<p-toast position="${this.tgPosition()}" />`);
    return lines.join('\n');
  });

  protected toastPayload(severity: string): ToastMessageOptions {
    const msg: ToastMessageOptions = {
      severity,
      summary: this.summaryFor(severity),
      closable: this.tgClosable(),
    };
    if (this.tgDetail()) msg.detail = 'One sentence of context, no more than that.';
    if (this.tgSticky()) msg.sticky = true;
    else msg.life = this.tgLife();
    return msg;
  }

  protected summaryFor(severity: string): string {
    switch (severity) {
      case 'success':
        return 'Draft saved';
      case 'warn':
        return 'Saved with warnings';
      case 'error':
        return 'Save failed';
      case 'secondary':
        return 'Nothing to save';
      case 'contrast':
        return 'Autosave is on';
      default:
        return 'Draft saved';
    }
  }

  showToast(): void {
    this.messageService.add(this.toastPayload(this.tgSeverity()));
  }

  showThree(): void {
    this.messageService.addAll([this.toastPayload('info'), this.toastPayload('success'), this.toastPayload('warn')]);
  }

  showAllSeverities(): void {
    this.messageService.addAll(
      this.severities.map((s) => ({ ...this.toastPayload(s), sticky: true, life: undefined })),
    );
  }

  clearToasts(): void {
    this.messageService.clear();
  }

  demoSave(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Draft saved',
      detail: 'All changes are stored locally.',
    });
  }

  showUnkeyed(): void {
    this.messageService.add({ severity: 'info', summary: 'No key', detail: 'Only the unkeyed outlet takes this.' });
  }

  showKeyed(): void {
    this.messageService.add({
      key: 'side',
      severity: 'info',
      summary: 'key: side',
      detail: 'Bottom left, its own outlet.',
    });
  }

  clearKeyed(): void {
    this.messageService.clear('side');
  }

  showRtlToast(): void {
    this.messageService.add({
      key: 'rtl',
      severity: 'warn',
      summary: 'הודעה צפה',
      detail: 'שורת הסבר אחת',
      sticky: true,
    });
  }

  // ----------------------------------------------------------- focus journal

  readonly fjBefore = signal('—');
  readonly fjAfter = signal('—');
  readonly fjAttrs = signal('—');
  readonly fjClosed = signal('—');

  measureFocusJourney(): void {
    if (!this.isBrowser) return;
    const input = document.getElementById('fj-input') as HTMLInputElement | null;
    input?.focus();
    this.fjBefore.set(this.describeActive());
    this.fjAfter.set('measuring…');
    this.fjAttrs.set('measuring…');
    this.fjClosed.set('close the toast to measure');
    this.messageService.add({
      severity: 'info',
      summary: 'Focus probe',
      detail: 'Close me with the button in this toast.',
      sticky: true,
    });
    setTimeout(() => {
      this.fjAfter.set(this.describeActive());
      const el = document.querySelector('.p-toast-message');
      this.fjAttrs.set(
        el
          ? `role=${el.getAttribute('role')} aria-live=${el.getAttribute('aria-live')} aria-atomic=${el.getAttribute('aria-atomic')}`
          : 'no message element found',
      );
      const btn = document.querySelector<HTMLElement>('.p-toast-message .p-toast-close-button');
      btn?.addEventListener(
        'click',
        () => {
          setTimeout(() => this.fjClosed.set(this.describeActive()), 400);
        },
        { once: true },
      );
    }, 450);
  }

  // browser-only: reached only from the demo button handlers.
  protected describeActive(): string {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'document.body — nothing focused';
    const id = el.id ? `#${el.id}` : '';
    const cls =
      el.className && typeof el.className === 'string'
        ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
        : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  }

  // ------------------------------------------------------------------- usage

  readonly surfaceRows = [
    {
      what: 'A confirmation nobody needs to act on ("Saved")',
      use: 'p-toast',
      why: 'An inline box would push the layout for a fact that is stale in two seconds.',
    },
    {
      what: 'A condition that stays true (read-only mode, an expiring session, a failed sync)',
      use: 'p-message',
      why: 'A toast leaves; the condition does not. The message belongs next to what it constrains.',
    },
    {
      what: 'An error the user must fix in this form field',
      use: 'hint + aria-describedby',
      why: 'The error has to be part of the field description, reachable from the field itself — see the Text Inputs guide.',
    },
    {
      what: 'A question that blocks progress ("Delete this?")',
      use: 'p-confirmdialog',
      why: 'Neither surface takes an answer; a message with buttons in a corner is a dialog wearing the wrong role.',
    },
    {
      what: 'A failure with one obvious recovery ("Retry")',
      use: 'p-message + button',
      why: 'A toast is a three-second window on a decision. Keep the action next to the failure.',
    },
    {
      what: 'A running count, a filter result, a "3 of 47 shown"',
      use: 'a persistent live region',
      why: 'Neither component is a status region you own; a region that is already on the page announces its own updates reliably.',
    },
    {
      what: 'A notification in an app that already has a toast surface',
      use: 'the surface it already has',
      why: 'This kit is such an app: it mounts one toast container of its own at the app root, fed by its own service — app-toast-container is the reference implementation. A p-toast outlet next to it is a second overlay root competing in the same z-index tier, with its own bus, its own naming, and its own timers. Pick one per app.',
    },
  ];

  // ------------------------------------------------------------------ design

  readonly anatomyNote: string = 'Class names and structure read from the shipped component templates and the Aura stylesheets ' +
    'for message and toast, Optimus UI 2.0.2 / Aura 2.x.';

  readonly tokenRows = [
    { el: 'Message box', prop: 'background', token: 'message.<severity>.background' },
    { el: 'Message box', prop: 'outline-color', token: 'message.<severity>.border.color' },
    { el: 'Message box', prop: 'color', token: 'message.<severity>.color' },
    { el: 'Message box', prop: 'border-radius', token: 'message.border.radius' },
    {
      el: 'Message, outlined',
      prop: 'color / outline-color',
      token: 'message.<severity>.outlined.color / .outlined.border.color',
    },
    { el: 'Message, simple', prop: 'color', token: 'message.<severity>.simple.color' },
    {
      el: 'Message close button',
      prop: 'focus outline',
      token: 'message.<severity>.close.button.focus.ring.color — drawn over by the kit ring (currentColor)',
    },
    { el: 'Toast root', prop: 'width', token: 'toast.width' },
    {
      el: 'Toast message',
      prop: 'background / border-color / color',
      token: 'toast.<severity>.background / .border.color / .color',
    },
    { el: 'Toast detail line', prop: 'color', token: 'toast.<severity>.detail.color' },
    {
      el: 'Toast close button',
      prop: 'focus outline',
      token: 'focus.ring.* + toast.<severity>.close.button.focus.ring.color — drawn over by the kit ring (currentColor)',
    },
  ];

  readonly contrastNote: string = 'Quoted from docs/generated/CONTRAST.MD, group "message & toast": the text and icon color ' +
    '(one token) on the severity tint composited over --surface-ground and over --surface-card ' +
    '(filled box, message and toast alike), and the outlined / simple color on those two surfaces ' +
    '(outlined and simple share one value per severity). Ranges run across the four visual styles. ' +
    'The inks are the kit rules on .p-message and .p-toast in src/styles.scss; secondary and ' +
    'contrast filled keep Aura’s own pairs, gated all the same. The tint is not opaque — 95% in ' +
    'light, 16% in dark, plus a backdrop blur — so the dark column follows the page surface of the ' +
    'active style, and a toast floating over anything else composites with it: re-check there. ' +
    'The close button’s focus ring is drawn in currentColor, the notice text color, so it inherits ' +
    'each row’s ratio.';

  readonly contrastRows = [
    {
      key: 'success-filled',
      severity: 'success',
      surface: 'filled box',
      light: '4.79–4.80:1',
      dark: '7.09–10.11:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'success-outline',
      severity: 'success',
      surface: 'outlined / simple',
      light: '4.60–5.02:1',
      dark: '9.35–13.10:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'info-filled',
      severity: 'info',
      surface: 'filled box',
      light: '6.15–6.17:1',
      dark: '5.94–8.42:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'info-outline',
      severity: 'info',
      surface: 'outlined / simple',
      light: '6.14–6.70:1',
      dark: '7.28–10.20:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'warn-filled',
      severity: 'warn',
      surface: 'filled box',
      light: '5.01:1',
      dark: '5.92–8.07:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'warn-outline',
      severity: 'warn',
      surface: 'outlined / simple',
      light: '4.75–5.18:1',
      dark: '7.79–10.91:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'error-filled',
      severity: 'error',
      surface: 'filled box',
      light: '5.91–5.96:1',
      dark: '6.27–8.22:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'error-outline',
      severity: 'error',
      surface: 'outlined / simple',
      light: '5.93–6.47:1',
      dark: '6.92–9.69:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'secondary-filled',
      severity: 'secondary',
      surface: 'filled box',
      light: '6.92:1',
      dark: '10.08:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'secondary-outline',
      severity: 'secondary',
      surface: 'outlined / simple',
      light: '4.90–7.78:1',
      dark: '5.38–7.40:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'contrast-filled',
      severity: 'contrast',
      surface: 'filled box',
      light: '17.06:1',
      dark: '19.90:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'contrast-outline',
      severity: 'contrast',
      surface: 'outlined / simple',
      light: '11.35–18.73:1',
      dark: '11.32–16.28:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'detail',
      severity: 'all six',
      surface: 'toast detail line',
      light: '9.45–17.85:1',
      dark: '9.96–19.90:1',
      lightFail: false,
      darkFail: false,
    },
  ];

  readonly geometryRows = [
    // Optimus ships Aura 2.x — values below are the 2.x tokens; 3.0's compaction is gone.
    {
      what: 'Message content padding',
      value: '8px 12px; 6px 10px at size="small", 10px 14px at size="large"',
    },
    { what: 'Message text', value: '1rem / 500; 0.875rem small, 1.125rem large. Icon 1.125rem (1rem small, 1.25rem large).' },
    {
      what: 'Message edge',
      value:
        '1px outline (not a border); radius {content.border.radius} = {border.radius.md}, which the visual style sets: 0 werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause (Aura stock 6px); outlined raises the outline width, simple removes edge and shadow',
    },
    { what: 'Close button, both components', value: '28 x 28 px, fully round (Aura 2.x; 3.0 had shrunk it to 24)' },
    {
      what: 'Close-button focus ring',
      value:
        'The kit ring: 2px solid currentColor at 2px offset (styles.scss, over Aura’s 1px) — the severity text color, so its contrast against the box equals the text row above',
    },
    {
      what: 'Ring timing',
      value: 'outline-color is transitioned over 0.2s: read it after the transition, or you measure a fade in progress',
    },
    {
      what: 'Toast root',
      value:
        'position: fixed, 20px from each edge it is anchored to (inline styles, openng-optimus-ui-toast.mjs:21-28). Width: the toast.width token, 25rem — no base rule outcascades it',
    },
    {
      what: 'Toast message',
      value:
        '1px border + the same style-dependent radius; backdrop blur 1.5px in light, 10px in dark; toasts are a plain list, 1rem apart by margin — there is no stack gap token',
    },
    {
      what: 'Toast text',
      value: 'summary 1rem / 500, detail 0.875rem in its own color token',
    },
    {
      what: 'Toast close button',
      value: 'in flow but pulled into the corner with margin -25% / right -25%; mirrored by a :dir(rtl) rule',
    },
  ];

  readonly motionNote: string = 'Measured: under prefers-reduced-motion the toast still disappears on schedule, and it also ' +
    'disappears with animation: none forced on both elements. An inline message closed under ' +
    'animation: none stays at opacity 1 and full height with only the leave class applied.';

  readonly stackRows = [
    // Mechanism: ZIndexUtils.set('modal', …) at openng-optimus-ui-toast.mjs:625-626; tier base 1100 (config :236).
    {
      what: 'Toast root, first outlet',
      value:
        'z-index 1102 — the configured modal tier (1100) plus the layer manager’s increment. Until the first message animates in, the root carries no z-index of its own.',
    },
    {
      what: 'A second outlet',
      value: '1104 — each outlet takes its own value from the same tier as it first animates in',
    },
    { what: 'Dialog and drawer', value: 'the same tier: whichever surface enters last is on top' },
    {
      what: 'The catch',
      value:
        'the toast is not portalled to the body: a fixed element appended to the body at z-index 1 paints ON TOP of a toast at 1102, because a positioned ancestor with a z-index owns the toast’s stacking context',
    },
  ];

  // ------------------------------------------------------------- development

  readonly messageApiRows = [
    {
      name: 'severity',
      def: "'info'",
      note: 'success | info | warn | error | secondary | contrast. Unknown values still produce a class, so a typo renders an unstyled box.',
    },
    { name: 'variant', def: 'undefined', note: "'outlined' drops the fill, 'simple' drops fill, ring, and shadow." },
    { name: 'size', def: 'undefined', note: "'small' | 'large'; anything else is ignored." },
    { name: 'closable', def: 'false', note: 'Adds the close button. Does NOT remove the element — see Pitfalls.' },
    {
      name: 'life',
      def: 'undefined',
      note: 'A one-shot timer set on init that hides the message. Same non-removal caveat.',
    },
    {
      name: 'icon',
      def: 'undefined',
      note: 'A class string on an <i>. No default icon per severity — the inline message ships none.',
    },
    { name: 'closeIcon', def: 'undefined', note: 'Same, for the close button; otherwise an inline times SVG.' },
    {
      name: 'motionOptions',
      def: 'undefined',
      note: 'Options for the enter/leave motion; merged with the motion pass-through.',
    },
    {
      name: 'text / escape, style / styleClass, show/hideTransitionOptions',
      def: 'see note',
      note: 'Back as deprecated v21 inputs (openng-optimus-ui-message.mjs:89-158): text/escape/style/styleClass compile AND render; the two transition options compile but are inert — motionOptions drives the animation.',
    },
  ];

  readonly toastApiRows = [
    {
      name: 'position',
      def: "'top-right'",
      note: 'top/bottom × left/center/right, plus center. Physical corners — see the i18n tab.',
    },
    {
      name: 'life',
      def: '3000',
      note: 'The outlet default. A message may override it; a message with life: 0 falls back to this.',
    },
    { name: 'key', def: 'undefined', note: 'Exact-equality routing. Unkeyed outlet takes only unkeyed messages.' },
    {
      name: 'autoZIndex',
      def: 'true',
      note: 'Takes a z-index from the shared modal tier on the first enter, releases it when empty.',
    },
    {
      name: 'baseZIndex',
      def: '0',
      note: 'Falsy means "use the configured modal tier". Set it to sit above a dialog.',
    },
    {
      name: 'preventOpenDuplicates',
      def: 'false',
      note: 'Compares severity + summary + detail against the messages currently shown.',
    },
    {
      name: 'preventDuplicates',
      def: 'false',
      note: 'Same comparison against every message ever shown by this outlet.',
    },
    {
      name: 'breakpoints',
      def: 'undefined',
      note: 'Writes a <style> element into <head> with per-breakpoint overrides of the root.',
    },
    { name: 'motionOptions', def: 'undefined', note: 'Options for the motion layer; forwarded to every message.' },
    {
      name: 'styleClass, show/hideTransformOptions, show/hideTransitionOptions',
      def: 'see note',
      note: 'All four exist again (openng-optimus-ui-toast.mjs:468-486). styleClass lands on the host; the transform/transition options are never forwarded to a toast item, so they are inert.',
    },
  ];

  readonly serviceRows = [
    {
      name: 'add(message)',
      note: 'Pushes one message onto the bus. No return value, no handle, no way to update or dismiss that specific message afterwards.',
    },
    {
      name: 'addAll(messages)',
      note: 'One emission with an array; every mounted outlet filters it by key. Cheaper than N calls, same result.',
    },
    {
      name: 'clear(key?)',
      note: 'With a key, clears only the outlet carrying it; without one, clears every outlet. There is no "clear this one message".',
    },
    {
      name: 'messageObserver / clearObserver',
      note: 'The raw subjects. Subscribing yourself is the supported way to mirror messages into a log or a persistent live region.',
    },
  ];

  readonly messageOptionsSnippet = [
    'interface ToastMessageOptions {',
    "  severity?: string;   // 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'",
    '  summary?: string;    // the outcome, three words',
    '  detail?: string;     // one sentence; rendered smaller, in its own color token',
    '  key?: string;        // routes to the outlet with the same key — exact equality',
    '  life?: number;       // ms; falsy falls back to the outlet default (3000)',
    '  sticky?: boolean;    // no timer at all; the only honest error toast',
    '  closable?: boolean;  // only an explicit false removes the button',
    '  icon?: string;       // overrides the per-severity SVG',
    '  closeIcon?: string;',
    '  styleClass?: string; contentStyleClass?: string;',
    '  id?: any; data?: any; // your own payload, e.g. for a custom template',
    '}',
  ].join('\n');

  readonly ariaRows = [
    {
      el: 'Inline message, host element',
      ships: 'role="alert" aria-live="polite"',
      route: 'pt.root — measured: writes role="status" aria-live="polite" over both',
    },
    {
      el: 'Toast root',
      ships: 'no role, no name, no aria-live',
      route: 'pt.root — e.g. an aria-label; there is nothing to override',
    },
    {
      el: 'Toast message',
      ships: 'role="alert" aria-live="assertive" aria-atomic="true"',
      route: 'pt.message',
    },
    {
      el: 'Close button, both',
      ships: 'aria-label from the library config, default "Close"',
      route: 'Optimus.setTranslation — there is no input',
    },
  ];

  readonly ariaNote: string = 'The pair on the inline message is not a contradiction but a downgrade, and it resolves the ' +
    'way the specification says: in the accessibility tree the node is an alert with ' +
    'live="polite" and atomic=true (atomic comes from the role, not from the markup). The toast ' +
    'message is the only assertive live region either component produces. The pass-through ' +
    'reaches the tree, not just the DOM: with pt.root the same message is exposed as status, ' +
    'live="polite", and it wins on OnPush hosts too.';

  readonly ptSnippet = [
    '<!-- Inline message: downgrade an alert to a status region.',
    '     The pass-through is written from a lifecycle hook, so it overrides',
    '     the template attribute rather than losing to it. -->',
    '<p-message severity="info"',
    "  [pt]=\"{ root: { role: 'status', 'aria-live': 'polite' } }\">",
    '  {{ labels().readOnly }}',
    '</p-message>',
    '',
    '<!-- Toast: the same route reaches the ROOT, which has no role of its own.',
    '     The per-message alert lives one level down and is not addressable here. -->',
    '<p-toast [pt]="{ root: { \'aria-label\': labels().notifications } }" />',
  ].join('\n');

  readonly testSnippet = [
    "import { TestBed } from '@angular/core/testing';",
    "import { Component } from '@angular/core';",
    "import { MessageModule } from '@openng/optimus-ui/message';",
    '',
    '@Component({',
    '  standalone: true,',
    '  imports: [MessageModule],',
    '  template: `',
    '    <p-message severity="info">Saved</p-message>',
    '    <p-message severity="info" [pt]="{ root: { role: \'status\' } }">Read only</p-message>`,',
    '})',
    'class HostComponent {}',
    '',
    "describe('inline message live region', () => {",
    "  it('ships alert/polite, and lets the pass-through override the role', () => {",
    '    const fixture = TestBed.createComponent(HostComponent);',
    '    fixture.detectChanges();',
    "    const hosts = fixture.nativeElement.querySelectorAll('p-message');",
    '',
    '    // Static host attributes, so they are there from the very first render -',
    '    // which is also why an inline message announces nothing at load.',
    "    expect(hosts[0].getAttribute('role')).toBe('alert');",
    "    expect(hosts[0].getAttribute('aria-live')).toBe('polite');",
    '',
    '    // The pass-through is written from a lifecycle hook, after the template',
    '    // attributes, so it wins: this message is exposed as a status region.',
    "    expect(hosts[1].getAttribute('role')).toBe('status');",
    '  });',
    '});',
  ].join('\n');

  readonly focusRows = [
    'A toast does not take focus. Its close button carries a bare autofocus attribute, but the button is inserted into a live document rather than parsed with it, and browsers do not act on autofocus for such an element: focus stays in the field the user was typing in.',
    'The tab order contains each toast close button — at the position where you put the p-toast tag in the document, which is nowhere near what the user was doing. The message div itself carries no tabindex. Reaching a corner overlay close button can mean tabbing through the rest of the page first.',
    'Escape does nothing. There is no key handler anywhere in the component beyond keydown.enter on the close button; Space still works because the button is a native <button>.',
    'Closing a toast hands focus to nobody: Optimus has no handleFocusOnRemove, so the close button is removed with its message and focus falls to <body>. If a toast is dismissable, restore focus yourself in (onClose).',
    'Hovering the container pauses the timer and leaving RESTARTS the full life — mouseenter/mouseleave are the only listeners, there is no pointer-down and no swipe. Keyboard focus pauses nothing either: there is no focus listener.',
    'An inline message is not focusable and takes no part in the tab order until it has a close button. Once it is closable, that button is a tab stop that stays in the order even after the message has collapsed to nothing — one more reason the host must remove it.',
  ];

  readonly ssrNote: string = 'Both components render on the server, but only one of them renders anything. An inline ' +
    'message is in the served HTML complete with role="alert" and aria-live="polite", so it is ' +
    'part of the first paint and of the document a crawler sees; a toast outlet is an empty ' +
    'fixed container, because messages only ever arrive through the service at runtime. Two ' +
    'consequences: a message that must be visible without JavaScript has to be an inline one, ' +
    'and the toast root offsets are inline styles (20px per anchored edge, null for the ' +
    'unused ones — openng-optimus-ui-toast.mjs:21-28) — a reminder that those ' +
    'offsets are physical.';

  readonly checklist = [
    'Every toast that reports a failure is sticky, or the failure is also visible somewhere that stays.',
    'Nothing the user must act on lives only in a toast.',
    'The close button has a name in the current language — it comes from the library config, not from an input.',
    'summary and detail read as one sentence, because they are announced as one unit.',
    'No toast is used to announce a change the user just made with the keyboard while focus is elsewhere on the page — verify in the accessibility tree that the alert node appears.',
    'An inline message that can be dismissed is removed by its host condition, not just closed.',
    'A message whose text changes is rebuilt, not mutated, or the change is not announced.',
    'Color is never the only carrier of severity: the icon, or the wording, says it too.',
    'MessageService is provided exactly once for the outlet that must receive the messages.',
  ];

  // --------------------------------------------------------------------- i18n

  readonly i18nSnippet = [
    '// The close button of BOTH components reads config.translation.aria.close.',
    '// There is no input for it. Push the table whenever the language changes:',
    'private readonly primeng = inject(Optimus);',
    '',
    'private syncAriaStrings(lang: string): void {',
    '  this.primeng.setTranslation({',
    '    aria: {',
    '      ...(this.primeng.translation.aria ?? {}),',
    "      close: this.t('optimus.close'),",
    '    },',
    '  });',
    '}',
  ].join('\n');

  readonly i18nNote: string = 'setTranslation merges one level deep only, so the aria block is replaced wholesale — spread ' +
    'the current one first or the fifty keys you did not list fall back to English. The kit ' +
    'pushes this table on every language change; close is part of it because these two ' +
    'components are the only ones that read it.';

  readonly rtlRows = [
    {
      what: 'Inline message: icon, text, close button',
      ltr: 'icon left, close button right',
      rtl: 'mirrored — icon right, close button left',
    },
    {
      what: 'Toast message: icon, text, close button',
      ltr: 'icon left, close button right',
      rtl: 'mirrored, including the close button’s overhang, by a :dir(rtl) rule',
    },
    { what: 'Toast corner for position="top-right"', ltr: 'top right', rtl: 'still top right — unchanged' },
    {
      what: 'Toast offsets',
      ltr: 'right: 20px / top: 20px',
      rtl: 'right: 20px / top: 20px — physical, written as inline styles',
    },
  ];

  readonly rtlNote: string = 'The inside of both components mirrors correctly, because it is ' +
    'built from logical properties. The toast’s corner does not: position is a physical key ' +
    'compiled into inline top/right/bottom/left, so "top-right" is the end corner in LTR and the ' +
    'start corner in RTL — where a notification is conventionally not expected. Flip the position ' +
    'yourself when the document direction flips.';
}
