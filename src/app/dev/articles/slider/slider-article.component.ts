import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { SelectModule } from '@openng/optimus-ui/select';
import { SliderModule } from '@openng/optimus-ui/slider';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** One rendered slider handle (its native range input), read out of the live DOM. */
export interface AriaRow {
  section: string;
  role: string;
  name: string;
  now: string;
  min: string;
  max: string;
  orientation: string;
}

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    SliderModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
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
      .src-inline {
        display: block;
        font-size: 0.78rem;
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
        align-items: center;
        justify-content: center;
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      /* The host has no intrinsic width — this is the rule the Usage tab talks about. */
      .pg__stage p-slider {
        width: 100%;
        max-width: 22rem;
        display: block;
      }
      .pg__stage--vertical p-slider {
        width: auto;
        height: 8rem;
      }
      .aria-panel {
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .aria-panel__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-2);
      }
      .aria-panel table {
        font-size: 0.82rem;
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
        gap: var(--space-5);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        min-width: 16rem;
        flex: 1;
      }
      .field p-slider {
        width: 100%;
        display: block;
      }
      .field--vertical {
        min-width: 8rem;
        flex: 0 0 auto;
        align-items: flex-start;
      }
      .field--vertical p-slider {
        width: auto;
        height: 8rem;
      }
      .paired {
        gap: var(--space-3);
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
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__stage .field {
        min-width: 0;
        width: 100%;
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
      .row--warn td:first-child {
        color: var(--semantic-red-fg);
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
 * Guide article: Slider (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the DECISION between dragging and
 * typing a number — p-slider vs p-inputnumber vs p-select — plus what
 * the kit really exposes to assistive technology.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (source read at Optimus UI 2.0.2; browser
 * measurements from the 21 pass are marked as such and were NOT re-measured):
 *   - p-slider has NO `inputId` input. The declared inputs are exactly
 *     `animate, min, max, orientation, step, range, styleClass, ariaLabel,
 *     ariaLabelledBy, tabindex, autofocus`
 *     (openng-optimus-ui-slider.mjs:596), plus `disabled/invalid/required/name`
 *     from BaseEditableHolder. `styleClass` is back (`@deprecated` since v20,
 *     still bound into the host class); PrimeNG 22's `minStepsBetweenHandles`,
 *     `disabledMinHandle`, `disabledMaxHandle` DO NOT EXIST here. Anything else
 *     passed to the tag lands as an inert HTML attribute on the host.
 *   - THE HANDLE IS A PLAIN `<span role="slider">`, not a native input
 *     (openng-optimus-ui-slider.mjs:629-656 single, :658-708 range) — PrimeNG 22's
 *     `<input type="range">` rebuild is not in this fork. `ariaLabel` /
 *     `ariaLabelledBy` are bound onto that span (:649-650); nothing else reaches
 *     it. It carries no `id`, so `<label for>` binds to nothing, and there is no
 *     value fallback: an unnamed slider has no accessible name at all.
 *     `disabled` only drops the tabindex (:644, :670, :696) — no disabled state
 *     is announced.
 *   - KEYBOARD (onKeyDown, :273-305): ArrowRight/ArrowUp +step,
 *     ArrowLeft/ArrowDown -step, Home -> min, End -> max, Escape/Enter/Space
 *     unhandled. PageUp/PageDown differ from the arrows ONLY when no `step` is
 *     set (then ±10, :317-318 / :336-337); with a `step`, and in range mode in
 *     every case (:308-313, :327-332), they equal the arrows. Dispatch is on
 *     `event.code`, so it survives non-QWERTY layouts.
 *   - RANGE: both handles receive the SAME `aria-label`/`aria-labelledby`
 *     (:675-676 and :701-702). There is no per-handle input.
 *   - `aria-valuenow` is bound to `value` on the single handle (:647) and carries
 *     fractions verbatim. The range handles bind `value[0]`/`value[1]` (:673/:699),
 *     but range mode stores the model in `values`, so they render WITHOUT
 *     aria-valuenow — measured by scripts/check-a11y.mjs on /ai-timeline, 2026-09-22.
 *   - VALUES do NOT snap to a grid anchored at `min`: with a `step`, stepping is
 *     relative to the previous value (handleStepChange :414-426), and
 *     `getNormalizedValue` (:557-565) floors when the step has no decimals — so
 *     off-grid initial values stay off-grid, and no `step` means integers.
 *   - `onSlideEnd` fires on document mouseup after a drag (:369-371), on
 *     touchend (:251-253) and on track click (:267-269) — NEVER from the
 *     keyboard. PrimeNG 22's change/blur emissions went with the native input.
 *   - GEOMETRY: Aura 2.x ships a 20x20 handle on a 3px track
 *     (@openng/optimus-ui-themes/dist/aura/slider/index.mjs:1). The kit raises the
 *     handle to 24x24 in `styles.scss`
 *     (`.p-slider { --p-slider-handle-width/-height }`) for WCAG 2.2 SC 2.5.8;
 *     the centering margins derive from the same tokens, so the handle stays on
 *     the track. Aura's handle focus ring is the GLOBAL `{focus.ring.*}` (1px),
 *     not the `{form.field.focusRing}` Aura zeroes; the kit's one ring rule
 *     (`.p-slider-handle:focus-visible`, 2px --primary-color-fg, offset 2px,
 *     !important) replaces it — CONTRAST.MD "focus ring".
 *   - No global runtime patch names sliders or rewrites their ARIA. Name at the
 *     call site or the control is nameless.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-slider-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'slider'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-slider</code>. The playground reads its own rendered handle back out of
          the DOM, so the ARIA panel underneath it is not a claim — it is what a screen reader is being handed. Note
          that <strong>every</strong> example names itself with the <code>[ariaLabel]</code> or
          <code>[ariaLabelledBy]</code> <em>input</em>, and every example shows its value as text: the Usage and
          Development tabs explain why both are non-negotiable.
        </p>

        <!-- Mini playground: live-configure a slider and read back both markup and ARIA. -->
        <section class="pg" aria-label="Slider playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-step-label">Step</span>
                <p-select
                  [ariaLabelledBy]="'pg-step-label'"
                  size="small"
                  [options]="stepOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgStep()"
                  (ngModelChange)="pgStep.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-range">Range (two handles)</label>
                <p-toggleswitch
                  inputId="pg-range"
                  [ngModel]="pgRange()"
                  (ngModelChange)="pgRange.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-vertical">Vertical</label>
                <p-toggleswitch
                  inputId="pg-vertical"
                  [ngModel]="pgVertical()"
                  (ngModelChange)="pgVertical.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-animate">Animate bar clicks</label>
                <p-toggleswitch inputId="pg-animate" [ngModel]="pgAnimate()" (ngModelChange)="pgAnimate.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event); scheduleRead()"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label" id="pg-preview-label">
                Preview — temperature:
                <strong>{{ pgReadout() }}</strong>
              </span>
              <div class="pg__stage" [class.pg__stage--vertical]="pgVertical()" #pgStage>
                @if (pgRange()) {
                  <p-slider
                    [ariaLabelledBy]="'pg-preview-label'"
                    [min]="0"
                    [max]="40"
                    [step]="pgStep() ?? undefined"
                    [range]="true"
                    [orientation]="pgVertical() ? 'vertical' : 'horizontal'"
                    [animate]="pgAnimate()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgRangeValue()"
                    (ngModelChange)="pgRangeValue.set($event)"
                    (onChange)="scheduleRead()"
                  />
                } @else {
                  <p-slider
                    [ariaLabelledBy]="'pg-preview-label'"
                    [min]="0"
                    [max]="40"
                    [step]="pgStep() ?? undefined"
                    [orientation]="pgVertical() ? 'vertical' : 'horizontal'"
                    [animate]="pgAnimate()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                    (onChange)="scheduleRead()"
                  />
                }
              </div>
            </div>
          </div>

          <!-- Live ARIA readout — measured, not asserted. -->
          <div class="aria-panel">
            <div class="aria-panel__head">
              <span class="pg__code-label">What assistive tech is handed, right now</span>
              <button type="button" class="copy-btn" (click)="scheduleRead()">Re-read</button>
            </div>
            @if (ariaRows().length === 0) {
              <p class="ex__note">Move a handle (or press Re-read) to sample the DOM.</p>
            } @else {
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Handle</th>
                      <th>role</th>
                      <th>accessible name</th>
                      <th>valuenow</th>
                      <th>min / max</th>
                      <th>orientation</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of ariaRows(); track row.section) {
                      <tr>
                        <td>
                          <code>{{ row.section }}</code>
                        </td>
                        <td>
                          <code>{{ row.role }}</code>
                        </td>
                        <td>{{ row.name }}</td>
                        <td>
                          <strong>{{ row.now }}</strong>
                        </td>
                        <td>{{ row.min }} / {{ row.max }}</td>
                        <td>{{ row.orientation }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <p class="ex__note">
                Model value: <code>{{ pgModelText() }}</code
                >. With <code>Step = none</code> the model is floored to whole numbers, and with two handles both rows
                carry the <em>same</em> name — neither is a quirk of the demo, both are explained in Development.
              </p>
            }
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
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
                  <div class="field">
                    <span class="pg__label" id="ex-basic-label">
                      Learning rate: <strong>{{ exBasic() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-basic-label'"
                      [min]="0"
                      [max]="100"
                      [step]="5"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('range') {
                  <div class="field">
                    <span class="pg__label" id="ex-range-label">
                      Year range: <strong>{{ exRange()[0] }} – {{ exRange()[1] }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-range-label'"
                      [min]="1950"
                      [max]="2026"
                      [step]="1"
                      [range]="true"
                      [ngModel]="exRange()"
                      (ngModelChange)="exRange.set($event)"
                    />
                  </div>
                }
                @case ('vertical') {
                  <div class="field field--vertical">
                    <span class="pg__label" id="ex-vertical-label">
                      Volume: <strong>{{ exVertical() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-vertical-label'"
                      orientation="vertical"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [ngModel]="exVertical()"
                      (ngModelChange)="exVertical.set($event)"
                    />
                  </div>
                }
                @case ('paired') {
                  <div class="field paired">
                    <span class="pg__label" id="ex-paired-label">
                      Budget (EUR): <strong>{{ exPaired() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-paired-label'"
                      [min]="0"
                      [max]="5000"
                      [step]="50"
                      [ngModel]="exPaired()"
                      (ngModelChange)="exPaired.set($event)"
                    />
                    <p-inputnumber
                      inputId="ex-paired-number"
                      ariaLabel="Budget in euro, exact value"
                      [min]="0"
                      [max]="5000"
                      [step]="50"
                      [showButtons]="true"
                      [ngModel]="exPaired()"
                      (ngModelChange)="exPaired.set($event ?? 0)"
                    />
                  </div>
                }
                @case ('commit') {
                  <div class="field">
                    <span class="pg__label" id="ex-commit-label">
                      Sample size: <strong>{{ exCommit() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-commit-label'"
                      [min]="1"
                      [max]="200"
                      [step]="1"
                      [ngModel]="exCommit()"
                      (onChange)="onCommitDrag($event)"
                      (onSlideEnd)="onCommitEnd()"
                    />
                    <p class="ex__note">
                      <code>onChange</code> fired <strong>{{ dragTicks() }}</strong> times, <code>onSlideEnd</code>
                      <strong>{{ commitTicks() }}</strong> times. Cheap work goes in the first, expensive work in the
                      second.
                    </p>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <span class="pg__label" id="ex-disabled-label"> Disabled: <strong>30</strong> </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-disabled-label'"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [disabled]="true"
                      [ngModel]="30"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-invalid-label">
                      Invalid: <strong>{{ exInvalid() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-invalid-label'"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [invalid]="true"
                      [ngModel]="exInvalid()"
                      (ngModelChange)="exInvalid.set($event)"
                    />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Drag, type, or pick? The honest table</h3>
        <p>
          A slider is the right control when the user is <strong>hunting for an effect, not entering a number</strong> —
          when "a bit more" is a complete thought and the result is visible while the handle moves. The moment the user
          arrives with a specific number in their head, dragging becomes a game of skill and the slider is the wrong
          control.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>The user's intent</th>
                <th>Value space</th>
                <th>Exact entry</th>
                <th>Keyboard cost of a big jump</th>
                <th>Touch / phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-slider</code></td>
                <td>"Somewhere around here" — steer an outcome and watch it change.</td>
                <td>Continuous or fine-grained numeric.</td>
                <td><strong>None.</strong> There is no text field to type into.</td>
                <td>
                  One <kbd>step</kbd> per arrow press; <kbd>PageUp</kbd>/<kbd>PageDown</kbd> equal the arrows
                  whenever a <code>step</code> is set, and always in range mode. 0–200 in steps of 1 is 200 presses;
                  <kbd>Home</kbd>/<kbd>End</kbd> jump to the ends.
                </td>
                <td>
                  A small disc on a 3px track — Aura's default sits under the WCAG 2.5.8 floor, and it is the one target
                  that must be hit precisely.
                </td>
              </tr>
              <tr>
                <td><code>p-inputnumber</code></td>
                <td>"It is 1750." The number itself is the answer.</td>
                <td>Any, including unbounded and decimal.</td>
                <td><strong>Yes</strong> — type, paste, correct a typo.</td>
                <td>Free: type it. <code>[showButtons]</code> adds ±step buttons.</td>
                <td>
                  A real <code>&lt;input&gt;</code>, so the OS numeric keypad appears and <code>inputId</code> +
                  <code>&lt;label for&gt;</code> genuinely work.
                </td>
              </tr>
              <tr>
                <td><code>p-slider</code> + <code>p-inputnumber</code>, same model</td>
                <td>Both: explore, then pin down.</td>
                <td>Bounded numeric where precision sometimes matters.</td>
                <td>Yes, via the field.</td>
                <td>Free.</td>
                <td>Costs vertical space; give the pair one caption and name both controls.</td>
              </tr>
              <tr>
                <td><code>p-select</code> / <code>p-selectbutton</code></td>
                <td>The steps are named, not measured ("Low / Medium / High").</td>
                <td>A handful of discrete levels.</td>
                <td>n/a — the user picks a label.</td>
                <td>One keystroke (type-ahead / arrow).</td>
                <td>Full-size targets; no aiming.</td>
              </tr>
              <tr>
                <td><code>p-slider [range]</code></td>
                <td>One interval whose two ends belong together ("1950 to 2026").</td>
                <td>Numeric interval.</td>
                <td>No.</td>
                <td>As above, per handle.</td>
                <td>
                  Two 20px targets that can end up on top of each other. Read the naming gap in Development before
                  choosing this.
                </td>
              </tr>
              <tr>
                <td>two separate sliders / fields</td>
                <td>Two values that merely happen to be adjacent.</td>
                <td>Any.</td>
                <td>Depends.</td>
                <td>Depends.</td>
                <td>The only option that lets each value carry its own name — which <code>[range]</code> cannot.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The behavior columns are read from the Optimus UI 2.0.2 sources
          in <code>node_modules</code>; the geometry numbers are the Aura 2.x tokens (Design and Development carry
          them). The intent column is a <em>judgment</em>: it encodes "is the
          number the answer, or is the number a dial", and you should overrule it when your content says otherwise. Kit
          convention: sliders are horizontal, every one of them is named through the <code>[ariaLabel]</code> /
          <code>[ariaLabelledBy]</code> input and shows its value as text — and the kit ships no numeric text input at
          all, so the <code>p-inputnumber</code> and "slider plus field" rows are documented from the library rather
          than from a call site you can read here.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a slider with no number</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-value-bad-label">Threshold</span>
                <p-slider
                  [ariaLabelledBy]="'dd-value-bad-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddValue()"
                  (ngModelChange)="ddValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>p-slider</code> renders no value anywhere — not in the handle, not in a tooltip, nowhere (the whole
              component is three <code>&lt;span&gt;</code>s around a hidden native range input; see the anatomy in
              Design). A sighted user is left guessing what they set, and cannot report it back to you in a bug report.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — show the value in the caption</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-value-good-label">
                  Threshold: <strong>{{ ddValue() }}%</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-value-good-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddValue()"
                  (ngModelChange)="ddValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              The caption carries the number <em>and</em> is the target of <code>[ariaLabelledBy]</code>, so the same
              text serves both readers. This is the kit convention for every slider it ships, and it is the reason it
              works.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — name it with &lt;label for&gt; or a host attribute</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-name-bad"
                  >Damping: <strong>{{ ddName() }}</strong></label
                >
                <p-slider
                  id="dd-name-bad"
                  [attr.aria-label]="'Damping'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Both mechanisms miss. <code>&lt;label for&gt;</code> resolves to nothing — <code>label.control</code> is
              <code>null</code>, because <code>&lt;p-slider&gt;</code> is a custom element and custom elements are not
              labelable — and the handle span inside it carries no <code>id</code> for a
              <code>for</code> to find. <code>[attr.aria-label]</code> lands on that same roleless host, not on the
              handle inside it. Nothing rescues either: the handle on the left has no accessible name at all.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — use the [ariaLabelledBy] input</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-name-good-label"
                  >Damping: <strong>{{ ddName() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-name-good-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              The input is bound as <code>[attr.aria-labelledby]</code> on the handle span that actually carries
              <code>role="slider"</code> (<code>openng-optimus-ui-slider.mjs:649</code>), so the name arrives without a patch — and because
              it points at the live caption, it stays correct when the value changes.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a range for two independent values</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-range-bad-label">
                  Min / max price: <strong>{{ ddRange()[0] }} / {{ ddRange()[1] }}</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-range-bad-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [range]="true"
                  [ngModel]="ddRange()"
                  (ngModelChange)="ddRange.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              One <code>ariaLabel</code> input, two handles — the kit puts the same string on both (<code
                >openng-optimus-ui-slider.mjs:675-676, :701-702</code
              >). The range example in the Examples tab shows the consequence in its own ARIA readout: two slider nodes
              with the same name, differing only in their value. A screen-reader user hears that name twice and must
              infer which end they are on. Two sliders cost one extra caption and remove the ambiguity entirely.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — two sliders, two names</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-range-good-lo"
                  >Lowest price: <strong>{{ ddLo() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-range-good-lo'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddLo()"
                  (ngModelChange)="setLo($event)"
                />
                <span class="pg__label" id="dd-range-good-hi"
                  >Highest price: <strong>{{ ddHi() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-range-good-hi'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddHi()"
                  (ngModelChange)="setHi($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Each end gets its own caption, its own accessible name, and its own keyboard focus stop, and you enforce
              the ordering yourself. Keep <code>[range]</code> for a single interval that reads as one idea ("the period
              shown"), where "start" and "end" are obvious from context.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — drag for a precise number</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-precise-bad-label">
                  Budget: <strong>{{ ddPreciseA() }} EUR</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-precise-bad-label'"
                  [min]="0"
                  [max]="5000"
                  [step]="1"
                  [ngModel]="ddPreciseA()"
                  (ngModelChange)="ddPreciseA.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              5 000 steps across roughly 500 pixels: one pixel is ten euros, so a mouse simply cannot express "1 750".
              By keyboard it is up to 5 000 arrow presses, because
              <kbd>PageUp</kbd> moves by <code>step</code> too. Motor-impaired and screen-reader users pay that cost in
              full.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — pair it with a field, or drop the slider</span>
            <div class="dd__stage">
              <div class="field paired">
                <span class="pg__label" id="dd-precise-good-label">
                  Budget: <strong>{{ ddPreciseB() }} EUR</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-precise-good-label'"
                  [min]="0"
                  [max]="5000"
                  [step]="50"
                  [ngModel]="ddPreciseB()"
                  (ngModelChange)="ddPreciseB.set($event)"
                />
                <p-inputnumber
                  inputId="dd-precise-number"
                  ariaLabel="Budget in euro, exact value"
                  [min]="0"
                  [max]="5000"
                  [showButtons]="true"
                  [ngModel]="ddPreciseB()"
                  (ngModelChange)="ddPreciseB.set($event ?? 0)"
                />
              </div>
            </div>
            <p class="dd__why">
              The slider keeps the coarse exploration (step 50, ~100 reachable positions); the field takes any exact
              value in one keystroke. If the exploration has no value at all, ship the field alone — a slider you cannot
              aim is decoration.
            </p>
          </div>
        </div>

        <h3>Rules of thumb that survived contact with the kit</h3>
        <ul>
          <li>
            <strong>Always render the value as text.</strong> The component shows nothing; the caption is the only
            readout, and it doubles as the accessible name.
          </li>
          <li>
            <strong>Count the arrow presses.</strong> <code>(max - min) / step</code> is the keyboard cost of crossing
            the range. Above roughly 100, either coarsen <code>step</code> or add a field — <kbd>PageUp</kbd> will not
            save you.
          </li>
          <li>
            <strong>Keep the effect visible while dragging.</strong> If the outcome only appears after release, the
            slider's one advantage is gone; use a field.
          </li>
          <li>
            <strong>Give it width explicitly.</strong> The host is <code>display: block</code>
            with no intrinsic width; inside a flex or grid child it can collapse. Kit convention: every call site sets
            it, either with a scoped
            <code>p-slider &#123; width: 100% &#125;</code> rule or inline
            <code>[style]="&#123;'width': '100%'&#125;"</code>. Nobody gets away without it.
          </li>
          <li>
            <strong>Never make it the only way to reach a value.</strong> WCAG 2.1.1 is about the keyboard, but a 5
            000-step slider is technically operable and practically not.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Slider pattern</a
            >
            — the keyboard contract this guide checks the kit against, including "Page Up: Increase the value by a
            larger amount" and the requirement that the
            <code>slider</code> role carries <code>aria-valuenow</code>, <code>aria-valuemin</code> and
            <code>aria-valuemax</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Multi-Thumb Slider pattern</a
            >
            — "Each thumb has an accessible label", the exact requirement the kit's single
            <code>ariaLabel</code> input cannot satisfy; the basis of the range Do/Don't above.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-valuetext</code></a
            >
            — "if the value is not a number, or the number is not the user-facing value", set valuetext; the reference
            for why a raw <code>aria-valuenow</code> is not enough for a percentage, a currency, or a damping factor.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24x24 CSS-pixel floor Aura's 20x20 handle sits below, the exception list it does not fall under, and
            therefore the reason this kit overrides the size tokens.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 for the parts of a control that convey state; the yardstick for the 3px track against the page
            background and for the focus outline.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — the criterion the Design tab measures the handle outline against, in both themes.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — the list of <em>labelable</em> elements. A custom element such as <code>&lt;p-slider&gt;</code> is not
            one, which is the mechanism behind the dead <code>&lt;label for&gt;</code>.
          </li>
          <li>
            <a href="https://primeng.org/slider" target="_blank" rel="noopener noreferrer">
              PrimeNG — Slider component</a
            >
            — the upstream API surface Optimus forks; this guide maps it onto the kit's conventions and then verifies
            every claim against the shipped Optimus source, which differs where the fork stayed on the v21 code.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          There is <em>no</em> native <code>&lt;input type="range"&gt;</code> here — PrimeNG 22's rebuild is not in this
          fork. The focusable element and the whole ARIA surface is the handle <code>&lt;span&gt;</code> itself. The
          host element is the track, and everything visible is a positioned <code>&lt;span&gt;</code>:
        </p>
        <ul>
          <li>
            <strong>Track</strong> — the <code>&lt;p-slider&gt;</code> host itself: <code>display: block</code>,
            <code>position: relative</code>, the track background and radius, plus the state classes
            (<code>p-disabled</code>, <code>p-invalid</code>, <code>p-slider-horizontal</code> / <code>-vertical</code>,
            <code>p-slider-animate</code>). In horizontal orientation its <em>height is the track thickness</em> — 3px.
          </li>
          <li>
            <strong>Range fill</strong> — <code>span.p-slider-range</code>, absolutely positioned, sized with
            <code>inset-inline-start</code> + <code>width</code> (logical, so it flips under RTL).
          </li>
          <li>
            <strong>Handle</strong> — <code>span.p-slider-handle</code>, the visible disc. It carries
            <code>role="slider"</code> itself, plus
            <code>aria-valuemin</code>/<code>-valuenow</code>/<code>-valuemax</code>, <code>aria-orientation</code>, the
            two naming attributes and the tab stop — the span is what receives focus and carries the accessible name;
            the focus ring is drawn by <code>.p-slider-handle:focus-visible</code>. With <code>[range]="true"</code>
            there are two handles, distinguished by <code>data-pc-section="startHandler"/"endHandler"</code>.
          </li>
          <li>
            <strong>Handle core</strong> — a <code>::before</code> pseudo-element, 16x16, painted in the surface color
            with a soft shadow, so the "ring" look is really a 20px disc with a 16px disc drawn on top.
          </li>
          <li>
            <strong>Nothing else.</strong> No value bubble, no ticks, no marks, no tooltip — if the user is to see the
            number, you render it.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-slider.mjs</code> (Optimus UI 2.0.2:
          range fill at :598-628, the single handle at :629-656 with its ARIA at :645-651, the two range handles at
          :658-708) and from the shipped stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code> (2.0.2 — no
          <code>.p-slider-input</code> rule exists, the ring is on the handle).
        </p>

        <h3>Geometry — Aura's tokens, and the one the kit changes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Token</th>
                <th>Aura default</th>
                <th>What this kit renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>track thickness</td>
                <td><code>--p-slider-track-size</code></td>
                <td>3px</td>
                <td>Same — host <code>height: 3px</code>, whatever the width</td>
              </tr>
              <tr>
                <td>track radius</td>
                <td><code>--p-slider-track-border-radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code> (6px)</td>
                <td>
                  The active visual style's radius scale (0 in <code>werkbund</code>, 12px in the default <code>lernwerkstatt</code>); host
                  <code>display: block</code> / <code>position: relative</code>
                </td>
              </tr>
              <tr>
                <td>track color</td>
                <td><code>--p-slider-track-background</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>
                  <code>--control-border</code> (kit, <code>styles.scss</code>) — Aura's <code>surface.200</code> /
                  <code>surface.700</code> measured 1.13–1.76:1 on the style grounds
                </td>
              </tr>
              <tr>
                <td>range fill</td>
                <td><code>--p-slider-range-background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>The theme primary, per selected color theme</td>
              </tr>
              <tr class="row--warn">
                <td><strong>handle</strong></td>
                <td><code>--p-slider-handle-width</code> / <code>-height</code></td>
                <td>20px / 20px</td>
                <td>
                  <strong>24 x 24</strong> — the kit raises both tokens on <code>.p-slider</code> in
                  <code>styles.scss</code>; see below
                </td>
              </tr>
              <tr>
                <td>handle radius</td>
                <td><code>--p-slider-handle-border-radius</code></td>
                <td>50%</td>
                <td>Same</td>
              </tr>
              <tr>
                <td>handle core (<code>::before</code>)</td>
                <td><code>--p-slider-handle-content-width</code> / <code>-height</code></td>
                <td>16px / 16px</td>
                <td>Same — shadow <code>0 0.5px 0 rgba(0,0,0,.08), 0 1px 1px rgba(0,0,0,.14)</code></td>
              </tr>
              <tr>
                <td>focus ring</td>
                <td><code>--p-slider-handle-focus-ring-*</code></td>
                <td>1px solid, offset 2px, no shadow</td>
                <td>2px solid <code>--primary-color-fg</code>, offset 2px (the kit ring); see the state table below</td>
              </tr>
              <tr>
                <td>transition</td>
                <td><code>--p-slider-transition-duration</code></td>
                <td>0.2s</td>
                <td>Same — on background/color/border/shadow/outline</td>
              </tr>
              <tr>
                <td>cursor</td>
                <td>—</td>
                <td><code>grab</code>, <code>touch-action: none</code></td>
                <td>Same</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and defaults from
          <code>&#64;openng/optimus-ui-themes/dist/aura/slider/index.mjs</code>
          (<code>track.size: '3px'</code>, <code>handle: &#123; width: '20px', height: '20px' &#125;</code>,
          <code>handle.content: &#123; width: '16px', height: '16px' &#125;</code>,
          <code>handle.focusRing: &#123;focus.ring.*&#125;</code>); box sizes are computed style on a rendered handle.
          Note which focus-ring token this is: the slider handle uses the <em>global</em>
          <code>&#123;focus.ring.*&#125;</code> (1px solid, offset 2px), <strong>not</strong> the
          <code>&#123;form.field.focusRing&#125;</code> that Aura zeroes out for text-like inputs — so even without
          this kit a slider gets a 1px outline. In this kit the one kit ring replaces it (2px, below).
        </p>

        <h3>The 24-pixel floor: why the kit overrides the handle size</h3>
        <p>
          WCAG 2.2 SC 2.5.8 asks for a 24 x 24 CSS-pixel target, and Aura's handle is
          <strong>20 x 20</strong> — four pixels short. None of the exceptions apply: the handle is not inline text, not
          user-agent-controlled, and not "essential" at that size. The 3px track is no help either; it is a wide target
          horizontally and almost nothing vertically. So the kit raises the two size tokens centrally:
        </p>
        <pre class="code-block"><code>{{ targetSizeSnippet }}</code></pre>
        <p>Three details make this override safe to copy, and they are the reason it is written this way:</p>
        <ul>
          <li>
            <strong>The handle stays on the track.</strong> Its centering margins are derived from the same two tokens
            (<code>margin-block-start: calc(-1 * calc(handle.height / 2))</code> in
            <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code>), so changing the tokens moves the margins with
            them. Setting <code>width</code>/<code>height</code> directly instead would knock the handle off-center.
          </li>
          <li>
            <strong>It is declared on <code>.p-slider</code>, not <code>:root</code>.</strong> The kit injects its own
            <code>:root</code> token block from a runtime <code>&lt;style&gt;</code> tag that lands after the kit
            stylesheet and would win on equal specificity. One class beats it without an <code>!important</code>.
          </li>
          <li>
            <strong>It is a token decision, not a call-site one.</strong> The alternative — a wrapper with vertical
            padding — enlarges the pointer target without changing the visual design, and is worth considering if a 24px
            disc is too heavy for your layout. Either way, decide it once and centrally.
          </li>
        </ul>
        <p class="src-note">
          Not claimed: no measurement on a real touch device. Contrast is gated: track and handle ring are
          <code>--control-border</code>, 3.85–5.23:1 light / 3.97–5.51:1 dark on ground and card in every style (the
          "progressbar &amp; slider" rows of <code>docs/generated/CONTRAST.MD</code>). Track clicks are worth knowing
          about regardless — a click anywhere on the host jumps the value to that position (host
          <code>click</code> → <code>onHostClick</code> → <code>onBarClick</code>,
          <code>openng-optimus-ui-slider.mjs:180-182, :259-271</code>).
        </p>

        <h3>Interaction states</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token layer</th>
                <th>What this kit renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>rest</td>
                <td>
                  handle background <code>&#123;content.border.color&#125;</code>, core in
                  <code>&#123;surface.0&#125;</code> (light) / <code>&#123;surface.950&#125;</code> (dark)
                </td>
                <td>
                  The kit re-points ring and track to <code>--control-border</code> and the core to
                  <code>--surface-card</code>: a ring ≥ 3:1 on every page surface (gated) around a card-colored disc.
                  Fill <code>&#123;primary.color&#125;</code>.
                </td>
              </tr>
              <tr>
                <td>hover</td>
                <td>
                  <code>.p-slider:not(.p-disabled) .p-slider-handle:hover</code> → background
                  <code>&#123;slider.handle.hover.background&#125;</code>, core →
                  <code>&#123;content.background&#125;</code>
                </td>
                <td>
                  Aura keeps the ring at rest color on hover; the kit darkens (light) / lightens (dark) it to
                  <code>--text-color-secondary</code>. Subtle by design; do not rely on it to signal affordance.
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <code>.p-slider-handle:focus-visible</code> → <code>outline</code> from
                  <code>&#123;focus.ring.width/style/color&#125;</code> with <code>&#123;focus.ring.offset&#125;</code>;
                  the base rule also sets <code>outline-color: transparent</code> at rest.
                </td>
                <td>
                  <strong>The kit ring.</strong> <code>.p-slider-handle:focus-visible</code> is in the kit's one ring
                  rule: <code>2px solid var(--primary-color-fg)</code> at <code>outline-offset: 2px</code>,
                  <code>!important</code>, both themes — the ring every field and button shows, in place of Aura's
                  1px.
                </td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>
                  <code>.p-disabled</code> on the host; the handle keeps its colors and the
                  <code>tabindex</code> attribute is removed entirely (<code
                    >[attr.tabindex]="$disabled() ? null : tabindex"</code
                  >).
                </td>
                <td>
                  The global <code>--p-disabled-opacity: 0.6</code> applies. Because the handle leaves the tab order
                  rather than being marked <code>aria-disabled</code>, a keyboard user cannot land on it to discover
                  that it is disabled — announce the reason in adjacent text.
                </td>
              </tr>
              <tr>
                <td>invalid</td>
                <td><code>[invalid]="true"</code> adds <code>p-invalid</code> to the host.</td>
                <td>
                  Aura's slider preset defines <strong>no</strong> invalid colors, so the class lands and nothing
                  changes visually. If invalid state must be visible on a slider, style <code>.p-invalid</code> yourself
                  and pair it with a text message.
                </td>
              </tr>
              <tr>
                <td>dragging</td>
                <td>
                  host gets <code>data-p-sliding="true"</code>; the handle's <code>transition</code> is set to
                  <code>none</code> while <code>dragging</code>.
                </td>
                <td>
                  Same. <code>[animate]="true"</code> adds <code>p-slider-animate</code>, which is removed during a drag
                  and restored on release, so only <em>clicks</em> animate.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>One trap worth repeating before you measure a focus ring.</strong>
          <code>outline-color</code> is part of the handle's <code>transition</code> list (<code
            >background, color, border-color, box-shadow, outline-color</code
          >, all <code>0.2s</code>), so a computed style read in the same tick as <code>.focus()</code> reports
          <code>outline-color: rgba(0,0,0,0)</code> — transparent — and looks exactly like a missing focus indicator. It
          is not: wait out the transition and the color is there. Any automated accessibility check that screenshots or
          samples immediately after focusing will report a false positive here. The state rules themselves are the
          shipped stylesheet in <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code> (2.0.2), and the class/attribute
          logic is <code>openng-optimus-ui-slider.mjs</code> (Optimus UI 2.0.2 — dragging is surfaced as a
          <code>data-p-sliding</code> host attribute, and the active range handle also gets
          <code>p-slider-handle-active</code>). The ring's color is the accent's <code>--primary-color-fg</code>,
          whose ratios on every page surface are the gated "focus ring" rows of CONTRAST.MD (≥ 3.88:1).
        </p>

        <h3>What the kit changes, and what it leaves alone</h3>
        <p>
          The global stylesheet touches the slider in three places: the two handle-size tokens above, the colors of
          track, handle ring and core (<code>--control-border</code>, <code>--surface-card</code>), and the focus ring
          (the kit's one ring rule, <code>!important</code>, so <code>--p-slider-handle-focus-ring-*</code> no longer
          lands). Everything
          else in the table is the unmodified Aura layer — unlike
          <code>p-select</code>, there is no <code>!important</code> color override fighting the tokens, so a
          downstream override of any other <code>--p-slider-*</code> property lands as written.
        </p>
        <p>
          Per-call-site restyling is a different matter and worth naming as a pattern: the timeline's date-range slider
          carries its own scoped block under a
          <code>styleClass</code> — a thicker track, a primary-colored handle with a surface border, a hover scale, and
          a focus shadow. That is a legitimate local design, but it means measurements taken on a restyled slider do not
          describe the default. When you quote geometry, quote it from an unstyled one.
        </p>

        <h3>Width and layout</h3>
        <p>
          The host is <code>display: block</code> with no width of its own, so it fills a block container and can
          collapse to nothing as a flex or grid item. Kit convention is therefore to set it at every call site — a
          scoped <code>p-slider &#123; width: 100%; display: block; &#125;</code> rule, or inline
          <code>[style]</code> where the component has no stylesheet of its own. Vertical sliders get
          <code>min-height: 100px</code> from the shipped stylesheet and a width equal to the track size — give them an
          explicit height or they stay at that minimum.
        </p>
        <p>
          <strong>Narrow screens:</strong> no breakpoint and no intrinsic responsive behavior. A horizontal slider
          stretches or shrinks with its container at any width while the 24px handle stays fixed, so a narrow track
          means fewer pixels per step, and a fine <code>step</code> becomes hard to aim by touch. Keep
          the track full-width on phones and pair it with <code>p-inputnumber</code> when precision matters.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 2.5.8, because the kit raises the handle to 24 x 24 where Aura 2.x ships 20
          x 20; SC 2.1.1 with the keyboard model from the Optimus 2.0.2 source (arrows by one step, <code>Home</code>
          and <code>End</code> to the bounds — the page keys collapse onto the arrows once a <code>step</code> is set,
          which is an APG shortfall, not a 2.1.1 failure); and SC 2.4.7 with the kit's <code>2px solid</code>
          <code>--primary-color-fg</code> ring at <code>outline-offset: 2px</code>, in both themes.
          <strong>Failing:</strong>
          SC 4.1.2 in range mode — both handles carry the same accessible name. The disabled case: there is no native
          input to carry a <code>disabled</code> attribute, so a disabled slider only
          loses its <code>tabindex</code> — unreachable and silently so. <strong>Conditional:</strong> SC 4.1.2 in
          single mode — the handle span exposes <code>role="slider"</code> with its value attributes, but only the two
          naming inputs name it and there is no value fallback, so unnamed means unnamed. SC 1.4.11 passes for track
          and handle ring (gated, ≥ 3.85:1) and for the focus ring (gated, "focus ring", ≥ 3.88:1).
          <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SliderModule</code> exports the <code>&lt;p-slider&gt;</code> component; there is no directive form. It
          is a <code>ControlValueAccessor</code> (<code>SLIDER_VALUE_ACCESSOR</code>), so <code>[(ngModel)]</code> and
          <code>formControlName</code> both work — with <code>[range]="true"</code> the model is a two-element array,
          otherwise a number.
        </p>

        <h3>Inputs — the whole list</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>min</code> / <code>max</code></td>
                <td>number (default 0 / 100)</td>
                <td>Boundaries. <code>numberAttribute</code>-transformed, so <code>min="0"</code> works too.</td>
              </tr>
              <tr>
                <td><code>step</code></td>
                <td>number</td>
                <td>
                  Increment. <strong>Read the section below</strong> — leaving it unset does not give you continuous
                  values.
                </td>
              </tr>
              <tr>
                <td><code>range</code></td>
                <td>boolean</td>
                <td>Two handles; the model becomes <code>[start, end]</code>.</td>
              </tr>
              <tr>
                <td><code>orientation</code></td>
                <td>'horizontal' | 'vertical'</td>
                <td>Vertical needs an explicit height (min 100px from the stylesheet).</td>
              </tr>
              <tr>
                <td><code>animate</code></td>
                <td>boolean</td>
                <td>Animates the handle when the user clicks the track. Suppressed during drags.</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  <strong>The only working accessible name.</strong> They land on the native range input inside each
                  handle. With <code>range</code>, both handles get the same one.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number (default 0)</td>
                <td>
                  Applied to every handle span. Set to <code>-1</code> only if something else moves focus there.
                </td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>
                  Via <code>pAutoFocus</code> — bound on the single handle and the range <em>start</em> handle only,
                  never the end handle.
                </td>
              </tr>
              <tr class="row--warn">
                <td>
                  <code>minStepsBetweenHandles</code>, <code>disabledMinHandle</code> / <code>disabledMaxHandle</code>
                </td>
                <td>—</td>
                <td>
                  <strong>Do not exist.</strong> PrimeNG 22 added them; Optimus forks the v21 code and has neither a
                  minimum handle distance nor per-handle disabling.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>signal inputs</td>
                <td>
                  Inherited from <code>BaseEditableHolder</code>. <code>disabled</code> only drops the handle's
                  <code>tabindex</code> and adds <code>p-disabled</code> — there is no native input to carry a real
                  <code>disabled</code> attribute; <code>invalid</code> adds a class Aura does not style.
                </td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>
                  Exists again and still works (concatenated into the host class, <code>:596</code>), but is
                  <code>&#64;deprecated</code> since v20 — prefer <code>class</code>.
                </td>
              </tr>
              <tr class="row--warn">
                <td><code>inputId</code></td>
                <td>—</td>
                <td>
                  <strong>Does not exist.</strong> Passing it writes an inert attribute onto the host element and names
                  nothing — the mistake is silent, because Angular does not complain about an unknown attribute on a
                  custom element.
                </td>
              </tr>
              <tr class="row--warn">
                <td><code>size</code>, <code>fluid</code>, <code>variant</code></td>
                <td>—</td>
                <td>
                  Do not exist either — the slider is not a <code>BaseInput</code>. There is no size scale; change
                  <code>--p-slider-track-size</code> and the handle tokens instead.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The complete declared input list is
          <code
            >animate, min, max, orientation, step, range, styleClass, ariaLabel, ariaLabelledBy, tabindex,
            autofocus</code
          >
          — read from the <code>inputs:</code> map of the compiled component
          (<code>openng-optimus-ui-slider.mjs:596</code>, Optimus UI 2.0.2) and cross-checked against <code>&#64;openng/optimus-ui/types/openng-optimus-ui-slider.d.ts</code>. Everything not in
          that list, plus <code>required</code> / <code>invalid</code> / <code>disabled</code> / <code>name</code> from
          <code>openng-optimus-ui-baseeditableholder.d.ts</code>, is either inherited or not a thing.
        </p>

        <h3>Outputs: <code>onChange</code> is not <code>onSlideEnd</code></h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>onChange</code></td>
                <td>
                  <code>&#123; event, value &#125;</code>, or <code>&#123; event, values &#125;</code> with
                  <code>range</code>
                </td>
                <td>
                  <strong>Every</strong> value update — each mousemove tick during a drag, each arrow press, each track
                  click.
                </td>
              </tr>
              <tr>
                <td><code>onSlideEnd</code></td>
                <td>same shape</td>
                <td>
                  Document <code>mouseup</code> after a drag, <code>touchend</code>, and a click on the track.
                  <strong>Never from the keyboard</strong> — PrimeNG 22's <code>change</code> and blur emissions went
                  with the native input.
                </td>
              </tr>
              <tr>
                <td><code>ngModelChange</code></td>
                <td>number | number[]</td>
                <td>Same cadence as <code>onChange</code> (both come out of <code>updateValue</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Put cheap, live feedback in <code>onChange</code> and anything expensive — a network call, a re-simulation, a
          URL update — in <code>onSlideEnd</code>. The v21 keyboard hole is back in full: arrows, page keys,
          <code>Home</code> and <code>End</code> emit only <code>onChange</code>, and no blur or <code>change</code>
          rescues them. Either debounce <code>onChange</code>, or handle both — <code>onSlideEnd</code> alone loses
          every keyboard-set value. The Examples tab counts both live.
        </p>
        <p class="src-note">
          Emission points read from <code>openng-optimus-ui-slider.mjs</code> (Optimus UI 2.0.2):
          <code>onChange</code> from <code>updateValue</code> (:531 range, :544 single), <code>onSlideEnd</code> from
          the document <code>mouseup</code> listener (:369-371), <code>onDragEnd</code> (:251-253) and
          <code>onBarClick</code> (:267-269) — and nowhere in <code>onKeyDown</code>
          (:273-305).
        </p>

        <h3><code>step</code> does more than you think</h3>
        <ul>
          <li>
            <strong>No <code>step</code> does not mean continuous.</strong> Arrows move ±1 (<code>:312</code>,
            <code>:320</code>) and <code>getNormalizedValue</code> floors the result (<code>:557-565</code>). An
            unstepped slider therefore yields whole numbers only. For 0.5-precision you must say
            <code>[step]="0.5"</code>.
          </li>
          <li>
            <strong>Fractional steps are rounded to the step's own decimal count</strong> via <code>toFixed</code> in
            <code>getNormalizedValue</code> (<code>:557-565</code>), which is what keeps <code>[step]="0.1"</code> from
            producing <code>0.30000000000000004</code>.
          </li>
          <li>
            <strong>The page keys only beat the arrows when there is no <code>step</code></strong> — then ±10
            (<code>:317-318</code>, <code>:336-337</code>). With a <code>step</code> set, and in range mode in every
            case (<code>:308-313</code>, <code>:327-332</code>), they move exactly one step. PrimeNG 22's 10 × step
            page jump is not in this fork.
          </li>
          <li>
            <strong>Values do not snap to a grid anchored at <code>min</code>.</strong>
            <code>handleStepChange</code> (<code>:414-426</code>) steps relative to the <em>previous</em> value, so a
            model that starts off-grid (say 7 with <code>[step]="5"</code>) keeps its offset for good — 7, 12, 17.
            Initialize on-grid or normalize the value yourself.
          </li>
        </ul>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every slider token is exposed as <code>--p-slider-*</code>. The kit's color and size tokens sit on the
          <code>.p-slider</code> element, so an override must name that element with a class of its own (snippet
          below); its only <code>!important</code> rule is the focus ring, which the ring tokens therefore no longer
          reach:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom property</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-slider-track-size</code> / <code>-background</code> / <code>-border-radius</code></td>
                <td>The bar itself (height when horizontal, width when vertical).</td>
              </tr>
              <tr>
                <td><code>--p-slider-range-background</code></td>
                <td>The filled portion.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-width</code> / <code>-height</code></td>
                <td>The hit target. Raise both to 24px to clear SC 2.5.8.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-background</code> / <code>-hover-background</code></td>
                <td>The outer disc.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-content-*</code></td>
                <td>The 16px core disc: size, radius, background, hover background, shadow.</td>
              </tr>
              <tr>
                <td>
                  <code>--p-slider-handle-focus-ring-width</code> / <code>-style</code> / <code>-color</code> /
                  <code>-offset</code> / <code>-shadow</code>
                </td>
                <td>
                  The focus outline. Aura ships 1px solid, offset 2px; in this kit the one kit ring
                  (<code>!important</code>) overrides width, style, color, and offset, so only <code>-shadow</code>
                  still lands.
                </td>
              </tr>
              <tr>
                <td><code>--p-slider-transition-duration</code></td>
                <td>0.2s on background, color, border, shadow, and outline.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix is set in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >); the token tree is <code>&#64;openng/optimus-ui-themes/dist/aura/slider/index.mjs</code>.
        </p>

        <h3>SSR</h3>
        <p>
          The component itself is server-safe — the only host listener in the metadata is <code>click</code>
          (<code>:596</code>), and the document-level <code>mousemove</code>/<code>mouseup</code> drag listeners are
          bound lazily in <code>bindDragListeners</code>, behind an <code>isPlatformBrowser</code> guard and inside
          <code>runOutsideAngular</code> (<code>:348-381</code>) — PrimeNG 22's guard-free host-pointer rewrite is not
          in this fork, but the v21 guard does the same job. Your
          <em>call site</em> is the risk: any code that reads the handle's geometry, or reads the DOM to verify what was
          announced (as the playground in the Examples tab does), must be guarded — that one reads the handle from a
          <code>viewChild</code> inside a browser-only guard.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>Naming: three patterns, one that works</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>What actually happens</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>id="x"</code> on <code>&lt;p-slider&gt;</code></td>
                <td>
                  <code>label.control</code> resolves to <code>null</code>. A custom element is not labelable, so the
                  label names nothing — and the caption still looks correct on screen, which is what makes this one hard
                  to notice.
                </td>
                <td><strong>Fails.</strong></td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> on <code>&lt;p-slider&gt;</code></td>
                <td>
                  The attribute sits on the host, which has no role, so the focusable handle spans inside it never
                  see it. The accessibility tree reports an empty name for every handle.
                </td>
                <td><strong>Fails.</strong></td>
              </tr>
              <tr>
                <td><code>[ariaLabel]</code> / <code>[ariaLabelledBy]</code> <em>inputs</em></td>
                <td>
                  Bound as <code>[attr.aria-label]</code> / <code>[attr.aria-labelledby]</code> directly on the handle
                  span that carries <code>role="slider"</code>
                  (<code>openng-optimus-ui-slider.mjs:649-650</code>), so the tree reports a <code>slider</code> with
                  the caption as its name and the model value as its value.
                </td>
                <td><strong>Works.</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Bindings verified in the Optimus UI 2.0.2 source; names read in the accessibility tree.
          <strong>Note the difference from <code>p-select</code>:</strong> where an unnamed select falls back to
          announcing its current value, an unnamed slider has <em>no</em> accessible name at all — the template binds
          <code>ariaLabel</code> with no fallback expression, so there is nothing to mistake for a working label. Verify
          in your own build: focus a handle and read its node in the browser's accessibility tree; the name must be your
          caption.
        </p>

        <h4>Do not try to rescue an unnamed slider globally</h4>
        <p>
          The naming rule above has an obvious-looking shortcut: install a
          <code>MutationObserver</code>, copy the host's <code>aria-label</code> down onto any handle that lacks one,
          and stamp a fallback literal on the rest. This kit built exactly that and then removed it. Two reasons, both
          of which generalize:
        </p>
        <ul>
          <li>
            <strong>The observer loses the race.</strong> It sees a handle span when the node is added, but the handle's
            class binding is applied afterwards — so on a route where handles appear without their own mutation record,
            the rule never runs. A naming mechanism whose outcome depends on render timing is not a naming mechanism; it
            makes the same call site pass on one screen and ship nameless on another.
          </li>
          <li>
            <strong>The fallback literal is untranslatable.</strong> A hard-coded <code>'Slider'</code> is one English
            word in every language, and it hides the real defect behind a name that is technically present and tells the
            user nothing.
          </li>
        </ul>
        <p>
          There is a second version of the same temptation: recomputing
          <code>aria-valuenow</code> from the handle's inline <code>inset-inline-start</code> percentage. On a single
          slider the kit binds the attribute to the model value (<code>openng-optimus-ui-slider.mjs:647</code>), so a
          pixel-derived, <code>Math.round</code>-ed replacement can only make a correct value worse. On a fractional step
          it does: a slider at <code>21.7</code> announces <code>22</code>, and one running 0 to 1 in steps of 0.1
          collapses every position onto <code>0</code> or <code>1</code>. The range handles are the exception, and the
          reason is not pixels: <code>:673</code>/<code>:699</code> bind <code>value[0]</code>/<code>value[1]</code>,
          but in range mode the component keeps its model in <code>values</code>, so both handles render with no
          <code>aria-valuenow</code> at all. The repair is the model you already hold, written at the call site.
        </p>
        <p class="src-note">
          Where this kit stands today: no global rule touches sliders, a single slider's <code>aria-valuenow</code> comes
          from the component, the one range slider in the app (the timeline's date range) writes its handles'
          <code>aria-valuenow</code> from its own <code>dateRange</code> signal, and every slider is named at its call
          site through <code>[ariaLabel]</code> or <code>[ariaLabelledBy]</code>. Found by <code>npm run check:a11y</code>
          on 2026-09-22.
        </p>

        <h4>Keyboard</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Contract (APG)</th>
                <th>Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Focus the thumb.</td>
                <td>Yes — each handle span is <code>tabindex="0"</code>, so a range slider is two tab stops.</td>
              </tr>
              <tr>
                <td><kbd>→</kbd> / <kbd>↑</kbd></td>
                <td>Increase by one step.</td>
                <td>+step.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> / <kbd>↓</kbd></td>
                <td>Decrease by one step.</td>
                <td>-step.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd></td>
                <td>Set to minimum.</td>
                <td>Yes — jumps straight to <code>min</code>.</td>
              </tr>
              <tr>
                <td><kbd>End</kbd></td>
                <td>Set to maximum.</td>
                <td>Yes — jumps straight to <code>max</code>.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>Change by a <em>larger</em> amount.</td>
                <td>
                  <strong>Only when no <code>step</code> is set</strong> — then ±10. With a <code>step</code>, and in
                  range mode always, they equal the arrows. PrimeNG 22's 10 × step jump is not in this fork.
                </td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd></td>
                <td>—</td>
                <td>Not handled; the value does not change.</td>
              </tr>
              <tr>
                <td>RTL</td>
                <td><kbd>←</kbd> should increase in a right-to-left layout.</td>
                <td>
                  Not implemented: <code>ArrowLeft</code> always decrements (<code>:306-324</code>), while pointer
                  positioning <em>is</em> RTL-aware. See the i18n tab.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>onKeyDown</code> (<code>openng-optimus-ui-slider.mjs:273-305</code>), dispatching on
          <code>event.code</code> — physical keys, so it survives non-QWERTY layouts. The page keys route through
          <code>decrementValue</code>/<code>incrementValue</code> with a <code>pageKey</code> flag that is only read on
          the stepless single-value branch (<code>:317-318</code>, <code>:336-337</code>). The 21 numbers were confirmed
          per key in the browser and this handler is the same v21 code, but re-measure per key if a claim here becomes
          load-bearing.
        </p>

        <h4>Known gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Two handles, one name.</strong> <code>ariaLabel</code> and <code>ariaLabelledBy</code> are bound
            onto both range handles (<code>:675-676</code>, <code>:701-702</code>). There is no per-handle input, so the
            APG multi-thumb requirement ("each thumb has an accessible label") cannot be met through the public API —
            only with a <code>pt</code> pass-through or two separate sliders. The range example in the Examples tab
            reads its own handles back out of the DOM and shows the duplicate name in its ARIA table.
          </li>
          <li>
            <strong>No <code>aria-valuetext</code>.</strong> The component never emits it and offers no input for it, so
            a value that is a proxy for something else (a percentage, a damping factor, a currency) is announced as a
            bare number. The kit's workaround is to bake the reading into the name —
            <code>[ariaLabel]="'Anzahl Punkte: ' + n()"</code> — which works, at the price of the number being announced
            twice (once as the name, once as the value).
          </li>
          <li>
            <strong>Disabled leaves the tab order, silently.</strong> There is no native input to carry a real
            <code>disabled</code> attribute; <code>$disabled()</code> only nulls the handle's <code>tabindex</code>
            (<code>:644</code>, <code>:670</code>, <code>:696</code>) while <code>role="slider"</code> stays. The
            handle is unfocusable and announces no disabled state, so keyboard users cannot land on it to discover
            why. Put the reason in text.
          </li>
          <li>
            <strong>Nothing announces the range's own bounds as text.</strong> <code>aria-valuemin</code>/<code
              >-valuemax</code
            >
            are numbers; if "1950" means "the beginning of the archive", say so in the caption.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ The current value is rendered as visible text next to the control.</li>
          <li>
            ☐ Named with the <code>[ariaLabel]</code> or <code>[ariaLabelledBy]</code> <strong>input</strong> — not
            <code>&lt;label for&gt;</code>, not <code>[attr.aria-label]</code> on the host, not
            <code>inputId</code> (which does not exist).
          </li>
          <li>☐ <code>(max - min) / step</code> is a number of arrow presses you would accept yourself.</li>
          <li>
            ☐ <kbd>Tab</kbd> reaches the handle, arrows move it, <kbd>Home</kbd>/<kbd>End</kbd> reach the bounds —
            verified in the browser, not assumed.
          </li>
          <li>☐ The focus outline is visible in <strong>both</strong> light and dark themes.</li>
          <li>
            ☐ Anything expensive is on <code>onSlideEnd</code> <em>and</em> still reachable by keyboard (which never
            fires it).
          </li>
          <li>☐ The slider has an explicit width (or a block container), and was checked at 360px.</li>
          <li>
            ☐ With <code>[range]</code>: the two ends are genuinely one interval, and the shared accessible name is a
            conscious trade-off.
          </li>
          <li>☐ The unit is in the caption, and the number's decimal separator is locale-formatted.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the naming rule — it asserts the <em>handle</em>, not the
          host, carries the name, and that nobody re-introduces <code>inputId</code>:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Your strings</h3>
        <ul>
          <li>
            <strong>The accessible name is content.</strong> Bind <code>[ariaLabel]</code> to a translated string, or
            point <code>[ariaLabelledBy]</code> at the caption you already translate — the second is better, because one
            string then cannot drift from the other.
          </li>
          <li>
            <strong>The unit belongs in the caption, not in the head of the reader.</strong> "Threshold: 42" is
            ambiguous; "Threshold: 42 %" is not — and the screen reader gets the unit for free when the caption is the
            label.
          </li>
          <li>
            <strong>If you bake the value into the name, rebuild it reactively.</strong> The kit's pattern is a
            <code>computed()</code> that concatenates a translated stem with the current value; a plain field is
            captured once and goes stale on a language switch.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Numbers are not language-neutral</h3>
        <p>
          <code>aria-valuenow</code> is always a plain machine number and you cannot change it, but the number
          <em>you</em> render is yours: 3.5 is "3,5" in German, and thousands separators differ everywhere. Format the
          visible value with <code>Intl.NumberFormat</code> (or Angular's <code>number</code> pipe) in the active
          language. If you also bake the value into <code>ariaLabel</code>, format it there too, or a German user hears
          the English form.
        </p>

        <h3>The slider has no strings of its own — which shifts the whole burden to you</h3>
        <p>
          Unlike the select or the tag, the kit's slider ships <strong>no</strong> built-in vocabulary: nothing in the
          translation service touches it, and there is no built-in label to override or forget. Every word a screen
          reader reads at a slider is a word you wrote, which sounds like good news and is really the opposite — a
          slider nobody named is not announced in bad English, it is announced as nothing at all. Bind
          <code>[ariaLabel]</code> or point <code>[ariaLabelledBy]</code> at a translated caption, and treat a global
          "fallback name" as the anti-pattern the Development tab describes: it is untranslatable by construction.
        </p>

        <h3>Length: captions wrap, sliders do not care</h3>
        <p>
          Unlike the select trigger, a slider has no text of its own to truncate, so translated labels cost you nothing
          inside the control. The pressure moves to the caption above it: "Anzahl der Stichproben pro Durchgang" is far
          longer than "Sample size", and a caption that wraps to two lines changes the height of every control row
          around it. Reserve the space, and test the layout in your longest language at 360px.
        </p>

        <h3>RTL: half-supported, and the missing half is the keyboard</h3>
        <ul>
          <li>
            <strong>Layout flips correctly.</strong> The range fill and the handles are positioned with
            <code>inset-inline-start</code>, and the pointer math is explicitly RTL-aware
            (<code>isRTL(this.el.nativeElement)</code>, <code>openng-optimus-ui-slider.mjs:451-463</code>), so dragging works in a
            right-to-left document.
          </li>
          <li>
            <strong>The keyboard does not flip.</strong> <code>ArrowLeft</code> is wired straight to
            <code>decrementValue</code> regardless of direction (<code>:276-280</code>), so in an RTL layout the left
            arrow moves the handle towards the visual right while lowering the value. APG expects the opposite mapping.
          </li>
        </ul>
        <p class="src-note">
          Read from the shipped source; <strong>not verified against a rendered RTL locale</strong>. Treat the layout
          half as "should work", and the keyboard half as a known defect to re-check before shipping any RTL language.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the handle's focus ring is
            the kit's 2px <code>--primary-color-fg</code> ring (was Aura's 1px), cited from "focus ring"; the "raise
            the ring token" advice, the theming claims, and the snippet follow the kit's element-scoped tokens.
          </li>
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Track and handle ring now <code>--control-border</code>, core
            <code>--surface-card</code> (kit); contrast quoted from the gated CONTRAST.MD rows (1.13:1 → ≥ 3.85:1).
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Colors and the track radius restated as tokens for the visual styles (ADR-0016); the
            dark rgb() readings replaced by the token fact they showed (handle and track share
            <code>&#123;content.border.color&#125;</code>); "measured on 21" notes removed; narrow-screen statement added.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): the fork carries the PrimeNG
            21 slider, so most of the v0.5 upgrades are gone again. The handle is a plain
            <code>&lt;span role="slider"&gt;</code> — no native <code>&lt;input type="range"&gt;</code>, no real
            <code>disabled</code> attribute, and <code>onSlideEnd</code> is once more unreachable from the keyboard;
            the page keys only beat the arrows when no <code>step</code> is set, values step from the previous value
            instead of snapping to a grid at <code>min</code>, <code>styleClass</code> exists again (deprecated) and
            <code>minStepsBetweenHandles</code> / <code>disabledMinHandle</code> / <code>disabledMaxHandle</code> do
            not exist. All line refs re-derived against
            <code>openng-optimus-ui-slider.mjs</code>; geometry re-read from Aura 2.x (20px handle, 3px track), so the
            kit's 24px override stays necessary. Browser measurements from the 21 pass were not repeated.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0. The handle was rebuilt
            upstream around a hidden native <code>&lt;input type="range"&gt;</code> — the ARIA surface, focus, and
            <code>disabled</code> semantics all moved onto it (the article's live ARIA readout and the test snippet were
            repointed). Upstream fixes documented: page keys now jump 10 × step for every handle, values snap to the
            step grid anchored at <code>min</code>, <code>onSlideEnd</code> fires on handle blur (keyboard users reach
            it, late). <code>styleClass</code> removed; new inputs <code>minStepsBetweenHandles</code> /
            <code>disabledMinHandle</code> / <code>disabledMaxHandle</code>. Geometry unchanged in Aura 3.0 (20px
            handle, 3px track) — the kit's 24px override stays necessary.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-07-30 — Truth and editorial pass: the runtime-patch chapter replaced by the
            current mechanism and a why-not rule, the geometry section rewritten around the kit's 24px handle override,
            call-site censuses replaced by conventions, evidence trimmed to citations.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-29 — Review pass: naming, geometry, and width claims re-verified;
            <code>data-pc-section</code> corrected to lowercase.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: the drag-vs-type decision table, a playground that reads
            its own ARIA back out of the DOM, four rendered Do/Don't pairs, the design tab, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SliderArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;
  protected readTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Browser-only by construction: afterNextRender never runs on the server,
    // which is what keeps the DOM read below out of the prerender path.
    afterNextRender(() => this.readAria());
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      if (this.readTimer !== null) clearTimeout(this.readTimer);
    });
  }

  // --- Playground ------------------------------------------------------------
  /** The stage wrapping the playground slider — the only DOM this article reads. */
  protected readonly pgStage = viewChild<ElementRef<HTMLElement>>('pgStage');

  readonly stepOptions = [
    { label: 'none (integers only)', value: null },
    { label: '0.1 — fractional', value: 0.1 },
    { label: '1', value: 1 },
    { label: '5', value: 5 },
  ];

  readonly pgStep = signal<number | null>(1);
  readonly pgRange = signal(false);
  readonly pgVertical = signal(false);
  readonly pgAnimate = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<number>(21);
  readonly pgRangeValue = signal<number[]>([8, 30]);

  /** Human-readable current model, used in the caption and the ARIA panel. */
  readonly pgReadout = computed(() =>
    this.pgRange() ? `${this.pgRangeValue()[0]} – ${this.pgRangeValue()[1]} °C` : `${this.pgValue()} °C`,
  );
  readonly pgModelText = computed(() =>
    this.pgRange() ? JSON.stringify(this.pgRangeValue()) : String(this.pgValue()),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = [`[ariaLabelledBy]="'temperature-label'"`, '[min]="0"', '[max]="40"'];
    const step = this.pgStep();
    if (step !== null) attrs.push(`[step]="${step}"`);
    if (this.pgRange()) attrs.push('[range]="true"');
    if (this.pgVertical()) attrs.push(`orientation="vertical"`);
    if (this.pgAnimate()) attrs.push('[animate]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(ngModel)]="temperature"');
    const caption = this.pgRange()
      ? `<span class="field-label" id="temperature-label">Temperature:\n  <strong>{{ temperature[0] }} – {{ temperature[1] }} °C</strong></span>`
      : `<span class="field-label" id="temperature-label">Temperature:\n  <strong>{{ temperature }} °C</strong></span>`;
    return `${caption}\n<p-slider\n  ${attrs.join('\n  ')} />`;
  });

  // --- Live ARIA readout -----------------------------------------------------
  readonly ariaRows = signal<AriaRow[]>([]);

  /**
   * Re-sample after the browser has applied the next render: the ARIA
   * attributes are template bindings and are not yet flushed while an event
   * handler runs, so a synchronous read would report the previous value.
   */
  scheduleRead(): void {
    if (this.readTimer !== null) clearTimeout(this.readTimer);
    this.readTimer = setTimeout(() => {
      this.readTimer = null;
      this.readAria();
    }, 0);
  }

  /**
   * Read the rendered handles straight out of the DOM. This is the article's
   * only DOM access; it is scoped to a `viewChild` and returns early when the
   * element is absent, which is also what makes it safe under SSR (the view
   * child never resolves on the server, and `afterNextRender` never fires there).
   */
  readAria(): void {
    const stage = this.pgStage()?.nativeElement;
    if (!stage) return;
    // Optimus UI 2.0.2: the ARIA surface is the handle span itself — there is
    // no native <input type="range"> in this fork.
    const inputs = Array.from(stage.querySelectorAll<HTMLElement>('.p-slider-handle'));
    this.ariaRows.set(
      inputs.map((h, i) => ({
        section: h.getAttribute('data-pc-section') ?? `handle ${i}`,
        role: h.getAttribute('role') ?? '(no role)',
        name:
          h.getAttribute('aria-label') ??
          (h.getAttribute('aria-labelledby')
            ? `via aria-labelledby="${h.getAttribute('aria-labelledby')}"`
            : '(no name)'),
        now: h.getAttribute('aria-valuenow') ?? '(absent)',
        min: h.getAttribute('aria-valuemin') ?? '—',
        max: h.getAttribute('aria-valuemax') ?? '—',
        orientation: h.getAttribute('aria-orientation') ?? '—',
      })),
    );
  }

  // --- Example state ---------------------------------------------------------
  readonly exBasic = signal(20);
  readonly exRange = signal<number[]>([1980, 2015]);
  readonly exVertical = signal(60);
  readonly exPaired = signal(1750);
  readonly exCommit = signal(50);
  readonly exInvalid = signal(80);

  readonly dragTicks = signal(0);
  readonly commitTicks = signal(0);

  onCommitDrag(event: { value?: number }): void {
    if (typeof event.value === 'number') this.exCommit.set(event.value);
    this.dragTicks.update((n) => n + 1);
  }

  onCommitEnd(): void {
    this.commitTicks.update((n) => n + 1);
  }

  // --- Do / Don't state ------------------------------------------------------
  readonly ddValue = signal(42);
  readonly ddName = signal(85);
  readonly ddRange = signal<number[]>([20, 70]);
  readonly ddLo = signal(20);
  readonly ddHi = signal(70);
  readonly ddPreciseA = signal(1750);
  readonly ddPreciseB = signal(1750);

  /** The ordering the `[range]` control would have enforced for us. */
  setLo(value: number): void {
    this.ddLo.set(Math.min(value, this.ddHi()));
  }

  setHi(value: number): void {
    this.ddHi.set(Math.max(value, this.ddLo()));
  }

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'The baseline: caption, value, name',
      note: 'The caption carries the number and is the target of [ariaLabelledBy]. One string, two audiences.',
      code: `<span class="field-label" id="lr-label">
  Learning rate: <strong>{{ learningRate() }}</strong>
</span>
<p-slider
  [ariaLabelledBy]="'lr-label'"
  [min]="0" [max]="100" [step]="5"
  [(ngModel)]="learningRate" />`,
    },
    {
      id: 'range',
      title: 'Range — one interval, two handles',
      note: 'The model becomes [start, end]. Tab twice to reach both handles; both announce the same name.',
      code: `<span class="field-label" id="years-label">
  Year range: <strong>{{ years()[0] }} – {{ years()[1] }}</strong>
</span>
<p-slider
  [ariaLabelledBy]="'years-label'"
  [min]="1950" [max]="2026" [step]="1"
  [range]="true"
  [(ngModel)]="years" />`,
    },
    {
      id: 'vertical',
      title: 'Vertical orientation',
      note: 'Needs an explicit height — the stylesheet only guarantees min-height 100px. Arrow keys still map up = more.',
      code: `<!-- host CSS: p-slider { height: 8rem; } -->
<p-slider
  [ariaLabelledBy]="'volume-label'"
  orientation="vertical"
  [min]="0" [max]="100" [step]="1"
  [(ngModel)]="volume" />`,
    },
    {
      id: 'paired',
      title: 'Slider plus number field, one model',
      note: 'The answer whenever precision sometimes matters. Note that p-inputnumber DOES have inputId — it renders a real <input>.',
      code: `<span class="field-label" id="budget-label">
  Budget (EUR): <strong>{{ budget() }}</strong>
</span>
<p-slider
  [ariaLabelledBy]="'budget-label'"
  [min]="0" [max]="5000" [step]="50"
  [(ngModel)]="budget" />
<p-inputnumber
  inputId="budget-number"
  [ariaLabel]="t('budget.exact')"
  [min]="0" [max]="5000" [showButtons]="true"
  [(ngModel)]="budget" />`,
    },
    {
      id: 'commit',
      title: 'onChange vs onSlideEnd',
      note: 'Drag the handle, then use the arrow keys: onSlideEnd never fires for keyboard input at all — only drag and track clicks reach it. Plan for that.',
      code: `<p-slider
  [ariaLabelledBy]="'samples-label'"
  [min]="1" [max]="200" [step]="1"
  [ngModel]="samples()"
  (onChange)="preview($event.value)"
  (onSlideEnd)="commit()" />

// Keyboard changes emit onChange only, and nothing else follows — debounce it, or you lose them.`,
    },
    {
      id: 'states',
      title: 'Disabled and invalid',
      note: 'Disabled removes the handle from the tab order entirely. Invalid adds a class Aura does not style — pair it with a message.',
      code: `<p-slider … [disabled]="true" [ngModel]="30" />
<p-slider … [invalid]="form.controls.threshold.invalid" [(ngModel)]="threshold" />`,
    },
  ];

  readonly devImport: string = `import { SliderModule } from '@openng/optimus-ui/slider';

@Component({
  standalone: true,
  imports: [SliderModule, FormsModule],
  // ...
})`;

  readonly targetSizeSnippet: string = `/* styles.scss — global, one rule.
   Declared on .p-slider rather than :root on purpose: the kit injects its own
   :root token block from a runtime <style> tag that lands after this file and
   would win on equal specificity. One class outranks it without !important.
   The handle's centering margins derive from these same two tokens, so raising
   them keeps the handle on the track. */
.p-slider {
  --p-slider-handle-width: 24px;   /* Aura ships 20px; WCAG 2.2 SC 2.5.8 asks 24 */
  --p-slider-handle-height: 24px;
}`;

  readonly themingSnippet: string = `/* Scoped to one field. The kit's .p-slider rules set the handle size and
   the track/handle colors on the same element, so this selector names both
   classes to outrank them. The focus ring is the kit's one ring rule
   (!important) — no --p-slider-handle-focus-ring-* token lands. */
.p-slider.chunky-slider {
  --p-slider-track-size: 6px;
  --p-slider-handle-width: 28px;   /* the global rule already gives you 24 */
  --p-slider-handle-height: 28px;
  --p-slider-handle-content-width: 18px;
  --p-slider-handle-content-height: 18px;
}

/* template */
<p-slider class="chunky-slider" … />`;

  readonly i18nSnippet: string = `// The caption is the single source: it shows the value AND names the control.
readonly thresholdCaption = computed(
  () => \`\${this.i18n.translate('demo.threshold')}: \${this.formatted()}\`,
);

// Locale-formatted, because 3.5 is "3,5" in German.
readonly formatted = computed(() =>
  new Intl.NumberFormat(this.i18n.currentLanguage(), {
    minimumFractionDigits: 1,
  }).format(this.threshold()),
);

/* template */
<span class="field-label" id="threshold-label">{{ thresholdCaption() }}</span>
<p-slider [ariaLabelledBy]="'threshold-label'" [min]="0" [max]="10" [step]="0.5"
  [(ngModel)]="threshold" />`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SliderModule } from '@openng/optimus-ui/slider';

@Component({
  standalone: true,
  imports: [SliderModule],
  template: \`
    <span id="threshold-label">Threshold</span>
    <p-slider [ariaLabelledBy]="'threshold-label'" [min]="0" [max]="10" [step]="1" />\`,
})
class HostComponent {}

describe('slider accessible name', () => {
  it('names the handle element, not the host', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    // Optimus UI 2.0.2: the focusable element is the .p-slider-handle span itself.
    const handle = host.querySelector('.p-slider-handle')!;
    expect(handle.getAttribute('aria-labelledby')).toBe('threshold-label');
    expect(handle.getAttribute('tabindex')).toBe('0');
    // Guard against the two regressions this guide exists to prevent:
    expect(host.querySelector('p-slider')!.hasAttribute('aria-label')).toBe(false);
    expect(host.querySelector('p-slider')!.hasAttribute('inputId')).toBe(false);
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
