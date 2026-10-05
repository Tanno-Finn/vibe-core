import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { ProgressSpinnerModule } from '@openng/optimus-ui/progressspinner';
import { SelectModule } from '@openng/optimus-ui/select';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { StripInvalidAriaDirective } from '../../../directives/strip-invalid-aria.directive';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    SkeletonModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    StripInvalidAriaDirective,
    SelectModule,
    ToggleSwitchModule,
    ButtonModule,
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
        min-height: 11rem;
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

      /* --- The author card (real + placeholder) --- */
      .card {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        width: 100%;
      }
      .card__row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .card__lines {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .card__name {
        font-size: 1.05rem;
        color: var(--text-color);
      }
      .card__role {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      .card__bio {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      .avatar {
        flex: 0 0 auto;
        width: 3rem;
        height: 3rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--surface-border);
        color: var(--text-color);
        font-size: 0.9rem;
        font-weight: var(--font-weight-medium);
      }

      /* --- Four strategies --- */
      .strat {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--space-3);
        margin: 0 0 var(--space-4);
      }
      .strat__cell {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-3);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .strat__tag {
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }
      .strat__stage {
        min-height: 6.5rem;
        padding: var(--space-3);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .strat__why {
        margin: 0;
        font-size: 0.78rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      @media (max-width: 900px) {
        .strat {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 520px) {
        .strat {
          grid-template-columns: 1fr;
        }
      }

      .mini {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        width: 100%;
      }
      .mini--center {
        align-items: center;
        justify-content: center;
        min-height: 4rem;
      }
      .mini__title {
        font-size: 0.95rem;
        color: var(--text-color);
      }
      .mini__body {
        margin: 0;
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      .mini__pct {
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }
      .mini__blank {
        display: block;
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
      .stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        width: 100%;
        max-width: 26rem;
      }
      .stack--row {
        flex-direction: row;
        align-items: center;
        gap: var(--space-4);
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
        align-items: stretch;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__stage .copy-btn {
        align-self: flex-start;
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

      .shift {
        display: flex;
        flex-direction: column;
      }
      .shift__box {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      /* 3 bars x 1rem + 2 gaps x 0.75rem == 3 text lines x 1.5rem line-height. */
      .shift__box--lines {
        gap: 0.75rem;
      }
      .shift__text {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.5rem;
        color: var(--text-color);
      }
      .shift__marker {
        margin-top: var(--space-2);
        font-size: 0.72rem;
        color: var(--text-color-secondary);
        border-top: 1px dashed var(--surface-border);
        padding-top: var(--space-1);
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
      .copy-btn:disabled {
        opacity: 0.6;
        cursor: default;
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
 * Guide article: Skeleton / loading states (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the DECISION SPACE around a wait:
 * skeleton vs p-progressspinner vs p-progressbar vs nothing at all — plus what
 * the skeleton really does (and does not do) for accessibility and motion.
 *
 * VERIFIED CLAIMS (source read at Optimus UI 2.0.2; the contrast figures in the
 * Design tab are the informational "skeleton" rows of docs/generated/CONTRAST.MD):
 *   - `<p-skeleton>` renders an EMPTY element with a hard-coded
 *     `[attr.aria-hidden]="true"` host binding
 *     (@openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs:129, and in the compiled
 *     declaration at :116). There is no `role`, no `aria-busy`, no text: the
 *     component is invisible to assistive technology BY DESIGN, and the
 *     announcement is entirely the container's job.
 *   - Defaults, read from the class fields (plain `@Input()` properties, not
 *     signals): `shape='rectangle'` (:72), `animation='wave'` (:77),
 *     `width='100%'` (:92), `height='1rem'` (:97); `size` and `borderRadius`
 *     are undefined. `size` OVERRIDES width+height (the `containerStyle`
 *     getter branches on it). `styleClass` is back as a `@deprecated` input
 *     and IS read by the host class binding (:130) — seven inputs.
 *   - Only `animation === 'none'` is special-cased (:18 — it adds
 *     `p-skeleton-animation-none`). Every other string, including a typo, is
 *     silently the wave.
 *   - The shimmer is a `::after` pseudo-element running
 *     `p-skeleton-animation 1.2s infinite` (translateX -100% -> 100%) and there
 *     is NO `prefers-reduced-motion` guard in the shipped CSS
 *     (@openng/optimus-ui-styles/dist/skeleton/index.mjs, whole file). The kit rescues
 *     it globally: a `*, *::before, *::after` catch-all with `!important` in
 *     styles.scss, which is what beats Optimus's runtime <style> tag.
 *   - `p-progressbar` emits `aria-level` on `role="progressbar"` (invalid; ARIA
 *     allows it only on `role="heading"`) and has no `ariaLabel` input — but it
 *     IS a real node with a role, so `[attr.aria-label]` on the host names it
 *     and survives change detection. `StripInvalidAriaDirective`
 *     (src/app/directives/) removes the invalid attribute; being standalone, it
 *     applies where a component imports it, not globally.
 *   - A skeleton is decoration: contrast against its surface is ~1.2:1 in both
 *     themes, informational only (aria-hidden, no text, so SC 1.4.3/1.4.11 do
 *     not apply).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-skeleton-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'skeleton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A skeleton is a promise about the shape of what is coming. Everything below is a real <code>p-skeleton</code>;
          the playground swaps between the placeholder and the content it stands in for, because that swap — not the
          shimmer — is the thing that either works or shifts the page under the reader's cursor.
        </p>

        <!-- Playground: the loading state is itself a control. -->
        <section class="pg" aria-label="Skeleton playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-loading">Loading state</label>
                <p-toggleswitch inputId="pg-loading" [ngModel]="pgLoading()" (ngModelChange)="pgLoading.set($event)" />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-shape-label">Shape</span>
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

              <div class="pg__field">
                <span class="pg__label" id="pg-anim-label">Animation</span>
                <p-select
                  [ariaLabelledBy]="'pg-anim-label'"
                  size="small"
                  [options]="animationOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAnimation()"
                  (ngModelChange)="pgAnimation.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-radius-label">Border radius</span>
                <p-select
                  [ariaLabelledBy]="'pg-radius-label'"
                  size="small"
                  [options]="radiusOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgRadius()"
                  (ngModelChange)="pgRadius.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-announce">Announce the wait</label>
                <p-toggleswitch
                  inputId="pg-announce"
                  [ngModel]="pgAnnounce()"
                  (ngModelChange)="pgAnnounce.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview — an author card</span>
              <div class="pg__stage">
                @if (pgLoading()) {
                  <div
                    class="card"
                    [attr.aria-busy]="pgAnnounce() ? 'true' : null"
                    [attr.role]="pgAnnounce() ? 'status' : null"
                  >
                    @if (pgAnnounce()) {
                      <span class="sr-only">Loading the author card</span>
                    }
                    <div class="card__row">
                      <p-skeleton
                        [shape]="pgShape()"
                        [animation]="pgAnimation()"
                        [borderRadius]="pgRadius()"
                        size="3rem"
                      />
                      <div class="card__lines">
                        <p-skeleton
                          [animation]="pgAnimation()"
                          [borderRadius]="pgRadius()"
                          width="9rem"
                          height="1.25rem"
                        />
                        <p-skeleton
                          [animation]="pgAnimation()"
                          [borderRadius]="pgRadius()"
                          width="6rem"
                          height="1rem"
                        />
                      </div>
                    </div>
                    <p-skeleton [animation]="pgAnimation()" [borderRadius]="pgRadius()" width="100%" height="3rem" />
                  </div>
                } @else {
                  <div class="card">
                    <div class="card__row">
                      <span class="avatar" aria-hidden="true">AM</span>
                      <div class="card__lines">
                        <strong class="card__name">Ada M. Rivera</strong>
                        <span class="card__role">Research engineer</span>
                      </div>
                    </div>
                    <p class="card__bio">
                      Works on evaluation harnesses. Writes about why the benchmark you trust is usually measuring the
                      thing you already believed.
                    </p>
                  </div>
                }
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

        <!-- The whole decision space, running at once. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Four answers to the same wait, side by side</h3>
            <button type="button" class="copy-btn" (click)="startRun()" [disabled]="running()">
              {{ running() ? 'Running…' : 'Run a 2.5 s load' }}
            </button>
          </div>
          <p class="ex__note">
            Press the button and watch all four panels handle the <em>same</em> 2.5 second wait. The differences are not
            cosmetic: only one of them tells you how long, only one of them tells you what is coming, and only three of
            them tell you anything at all.
          </p>
          <div class="strat">
            <div class="strat__cell">
              <span class="strat__tag">Skeleton</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini" role="status" aria-busy="true">
                    <span class="sr-only">Loading the report</span>
                    <p-skeleton width="70%" height="1.25rem" />
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="88%" height="1rem" />
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quarterly report</strong>
                    <p class="mini__body">Eleven experiments, four of which reproduced.</p>
                  </div>
                }
              </div>
              <p class="strat__why">Layout is known, so the box never moves. Says nothing about duration.</p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Spinner</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini mini--center" role="status">
                    <span class="sr-only">Loading the report</span>
                    <!-- Optimus has styleClass back on p-progressspinner as @deprecated; the size still comes from [style] -->
                    <p-progressspinner
                      strokeWidth="4"
                      [ariaLabel]="'Loading the report'"
                      [style]="{ width: '2.5rem', height: '2.5rem' }"
                    />
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quarterly report</strong>
                    <p class="mini__body">Eleven experiments, four of which reproduced.</p>
                  </div>
                }
              </div>
              <p class="strat__why">
                Honest when you know neither the duration nor the shape. Costs a layout jump on arrival.
              </p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Progress bar</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini mini--center">
                    <p-progressbar
                      [value]="progress()"
                      [attr.aria-label]="'Loading the report'"
                      [style]="{ width: '100%' }"
                    />
                    <span class="mini__pct">{{ progress() }}%</span>
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quarterly report</strong>
                    <p class="mini__body">Eleven experiments, four of which reproduced.</p>
                  </div>
                }
              </div>
              <p class="strat__why">
                The only one that answers "how much longer" — and the only one you must not fake when you cannot
                measure.
              </p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Nothing</span>
              <div class="strat__stage">
                @if (!running()) {
                  <div class="mini">
                    <strong class="mini__title">Quarterly report</strong>
                    <p class="mini__body">Eleven experiments, four of which reproduced.</p>
                  </div>
                } @else {
                  <div class="mini mini--center"><span class="mini__blank">&nbsp;</span></div>
                }
              </div>
              <p class="strat__why">
                Right answer below roughly 300 ms — an indicator that appears and vanishes inside a blink reads as a
                glitch, not as feedback.
              </p>
            </div>
          </div>
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
                @case ('lines') {
                  <div class="stack" role="status" aria-busy="true">
                    <span class="sr-only">Loading the article</span>
                    <p-skeleton width="60%" height="1.75rem" />
                    <p-skeleton height="1rem" />
                    <p-skeleton height="1rem" />
                    <p-skeleton width="82%" height="1rem" />
                  </div>
                }
                @case ('circle') {
                  <div class="stack stack--row">
                    <p-skeleton shape="circle" size="3rem" />
                    <p-skeleton shape="circle" size="2rem" />
                    <p-skeleton shape="circle" size="1.25rem" />
                    <p-skeleton width="6rem" height="3rem" borderRadius="50%" />
                  </div>
                }
                @case ('sizing') {
                  <div class="stack">
                    <p-skeleton />
                    <p-skeleton width="12rem" height="2.5rem" />
                    <p-skeleton size="2.5rem" width="12rem" />
                    <p-skeleton width="12rem" height="2.5rem" borderRadius="999px" />
                  </div>
                }
                @case ('static') {
                  <div class="stack">
                    <p-skeleton height="1.5rem" animation="none" />
                    <p-skeleton height="1.5rem" animation="wave" />
                    <p-skeleton height="1.5rem" animation="shimmer" />
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
        <h3>Which loading state? The honest table</h3>
        <p>
          There is no default here. The choice falls out of two questions you can answer before you write any markup —
          <strong>do I know the shape of what is arriving?</strong> and
          <strong>do I know how long it will take?</strong> — plus a third that overrules both:
          <strong>is the wait long enough to be worth showing?</strong>
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Duration</th>
                <th>Layout</th>
                <th>What the user learns</th>
                <th>Who announces it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nothing</strong></td>
                <td>Under ~300 ms</td>
                <td>any</td>
                <td>Nothing — and nothing is what happened.</td>
                <td>Nobody. Announce the <em>result</em> instead.</td>
              </tr>
              <tr>
                <td><code>p-skeleton</code></td>
                <td>~0.3–5 s, unknown but bounded</td>
                <td><strong>known</strong> — you can draw the boxes</td>
                <td>What is coming and roughly how much of it. No timing.</td>
                <td>
                  <strong>You.</strong> Every skeleton is <code>aria-hidden="true"</code>; the container must carry it.
                </td>
              </tr>
              <tr>
                <td><code>p-progressspinner</code></td>
                <td>unknown, or beyond a few seconds</td>
                <td>unknown, or a whole view</td>
                <td>"Something is happening." Nothing else.</td>
                <td>
                  It has a real <code>ariaLabel</code> input bound to <code>[attr.aria-label]</code> on the host
                  (<code>openng-optimus-ui-progressspinner.mjs:111</code>, host block) — but still wrap it in
                  <code>role="status"</code>, or the name exists and nothing announces it.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar</code></td>
                <td><strong>measurable</strong> — bytes, steps, items</td>
                <td>any</td>
                <td>How far along, therefore how much longer.</td>
                <td>
                  <code>role="progressbar"</code> is a host attribute and there is
                  <strong>no <code>ariaLabel</code> input</strong> — but unlike a skeleton this IS a nameable node:
                  <code>[attr.aria-label]</code> on the host works (measured). See the kit defect below.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar mode="indeterminate"</code></td>
                <td>unknown, long</td>
                <td>any</td>
                <td>Same as a spinner, in a strip. Choose it for the space it fits, not for extra information.</td>
                <td>As above.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The "who announces it" column is measured and sourced (the
          <code>aria-hidden</code> host binding at <code>openng-optimus-ui-skeleton.mjs:129</code>; the accessibility-tree walk in
          the Development tab). The <strong>duration bands are a judgment, not a measurement</strong>. They encode
          Nielsen's three classic response-time limits — 0.1 s reads as instantaneous, 1 s keeps the user's flow of
          thought, 10 s is the ceiling on attention — and the ~300 ms floor is the point at which a placeholder that
          appears and disappears looks like a rendering fault rather than like feedback. Move the bands if your content
          disagrees; do not cite them as a finding.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a placeholder that is not the right size</span>
            <div class="dd__stage">
              <button type="button" class="copy-btn" (click)="toggleShift()">
                {{ shiftLoading() ? 'Show content' : 'Show skeleton' }}
              </button>
              <div class="shift">
                @if (shiftLoading()) {
                  <div class="shift__box" id="shift-bad-skeleton">
                    <p-skeleton width="100%" height="1rem" />
                  </div>
                } @else {
                  <div class="shift__box" id="shift-bad-real">
                    <p class="shift__text">
                      Three lines of summary text that the one-line placeholder never accounted for, so everything below
                      it jumps the moment the fetch resolves.
                    </p>
                  </div>
                }
                <div class="shift__marker">↑ everything under here moves</div>
              </div>
            </div>
            <p class="dd__why">
              Toggle it: the skeleton block is
              <strong>{{ shiftBadSkeletonPx }}px</strong> tall, the real content
              <strong>{{ shiftBadRealPx }}px</strong> — a <strong>{{ shiftBadDeltaPx }}px</strong> jump for every
              element below it. A skeleton that guesses the size has bought you the layout shift you were trying to
              avoid.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — reserve the real box</span>
            <div class="dd__stage">
              <button type="button" class="copy-btn" (click)="toggleShift()">
                {{ shiftLoading() ? 'Show content' : 'Show skeleton' }}
              </button>
              <div class="shift">
                @if (shiftLoading()) {
                  <div class="shift__box shift__box--lines" id="shift-good-skeleton">
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="64%" height="1rem" />
                  </div>
                } @else {
                  <div class="shift__box" id="shift-good-real">
                    <p class="shift__text">
                      Three lines of summary text that the three-line placeholder reserved exactly, so nothing below it
                      moves when the fetch resolves.
                    </p>
                  </div>
                }
                <div class="shift__marker">↑ nothing under here moves</div>
              </div>
            </div>
            <p class="dd__why">
              The same two reads: skeleton <strong>{{ shiftGoodSkeletonPx }}px</strong>, content
              <strong>{{ shiftGoodRealPx }}px</strong> — a <strong>{{ shiftGoodDeltaPx }}px</strong> delta. Match the
              line count and the line height, not "roughly a paragraph".
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — silence for the screen reader</span>
            <div class="dd__stage">
              <div class="mini">
                <p-skeleton width="70%" height="1.25rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              Both elements are <code>aria-hidden="true"</code> — that is a hard-coded host binding, not a default you
              can turn off (<code>openng-optimus-ui-skeleton.mjs:129</code>). With no wrapper, the accessibility tree shows an
              empty region: a screen-reader user hears the old content vanish and then nothing. The failure is easy to
              miss precisely because the visual side looks finished.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — let the container speak</span>
            <div class="dd__stage">
              <div class="mini" role="status" aria-busy="true">
                <span class="sr-only">Loading the report</span>
                <p-skeleton width="70%" height="1.25rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              <code>role="status"</code> makes the wrapper a polite live region; <code>aria-busy="true"</code> tells
              assistive tech the region is mid-update; the <code>.sr-only</code> line gives it something to say. Drop
              <code>aria-busy</code> and swap the text for the result when the data lands.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — derive "loading" from emptiness</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ emptyBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              An empty result and a failed request both look exactly like "still loading", so the shimmer never stops.
              The tell is an error handler that sets the collection to
              <code>[]</code> — with this shape, clearing the data <em>starts</em> the loading state instead of ending
              it, and the comment above such a line usually claims the opposite.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — three states, one explicit flag</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ emptyGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Loading, empty, and failed are three different things and the user deserves three different answers. A
              skeleton is only correct for the first one.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a skeleton for an unknowable shape</span>
            <div class="dd__stage">
              <div class="mini">
                <p-skeleton width="100%" height="1rem" />
                <p-skeleton width="100%" height="1rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              Search results that may be 0, 3, or 200 rows: any skeleton you draw is a guess, and a wrong guess is a
              layout shift plus a false promise about how much is coming.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a spinner when you cannot promise a shape</span>
            <div class="dd__stage">
              <div class="mini mini--center" role="status">
                <span class="sr-only">Searching</span>
                <p-progressspinner
                  strokeWidth="4"
                  [ariaLabel]="'Searching'"
                  [style]="{ width: '2.5rem', height: '2.5rem' }"
                />
              </div>
            </div>
            <p class="dd__why">
              A spinner promises nothing but activity, which is exactly what you know. Reserve the space it sits in so
              the results do not shove it aside on arrival.
            </p>
          </div>
        </div>

        <h3>The skeleton is a promise — keep it</h3>
        <ul>
          <li>
            <strong>Draw the layout, not a rectangle.</strong> Six identical gray bars are a spinner with extra DOM.
            Mirror the heading, the avatar, the paragraph, the chips.
          </li>
          <li>
            <strong>Vary the line widths.</strong> Real prose has a ragged last line; a perfectly flush block reads as a
            rendering artifact. A run like 100%, 98%, 92%, 85%, then a short 40/30% pair, reads as a paragraph.
          </li>
          <li>
            <strong>Cap the count.</strong> Show as many placeholder rows as fit the viewport, not as many as the
            response might contain. A screenful is generous already; a full-length placeholder list is a promise you
            cannot keep.
          </li>
          <li>
            <strong>Never let a skeleton be the terminal state.</strong> Every skeleton needs a timeout, an error branch,
            and an empty branch, or it becomes a permanent lie.
          </li>
          <li>
            <strong>Do not stack it with a global overlay.</strong> The kit already blurs the whole page behind
            <code>app-loading-overlay</code> during the translation-ready gate; a skeleton underneath that is invisible
            work.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-busy" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-busy</code></a
            >
            — the normative definition of "an element is being modified": set it on the container being replaced, not on
            the placeholders, and expect assistive tech to defer announcing until it clears. This is the spec behind the
            whole "who announces the wait" column.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/alert/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Alert pattern and live regions</a
            >
            — why a loading message belongs in a polite region (<code>role="status"</code>) rather than an assertive
            one: the wait is not an emergency and must not interrupt what the user is reading.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.3.3 Animation from Interactions (AAA)</a
            >
            — motion triggered by interaction must be disableable unless it is essential. A 1.2 s infinite shimmer is
            exactly that motion, and Optimus ships no opt-out; the Design tab covers the global rule that answers it.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.2 Pause, Stop, Hide</a
            >
            — the five-second rule for automatic moving content. A skeleton that outlives its fetch turns a compliant
            three-second wait into a permanent animation.
          </li>
          <li>
            <a href="https://web.dev/articles/cls" target="_blank" rel="noopener noreferrer">
              web.dev — Cumulative Layout Shift</a
            >
            — the metric the "matched dimensions" rule exists to protect. It is also the honest reason a mis-sized
            skeleton is worse than no skeleton: it shifts twice.
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/response-times-3-important-limits/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Response Times: The 3 Important Limits</a
            >
            — 0.1 s / 1 s / 10 s. The origin of the duration bands in the table above, quoted as the judgment it is
            rather than as a measured threshold.
          </li>
          <li>
            <a href="https://optimus.openng.org/skeleton/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Skeleton component</a
            >
            — the vendor API surface (seven inputs in 2.0.2, no outputs) that this guide maps onto the kit's conventions
            and then verifies against the shipped source.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — the media feature the shipped skeleton CSS does not consult, and the one the kit's global catch-all in
            <code>styles.scss</code> answers on its behalf.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy — an empty box and one pseudo-element</h3>
        <p>
          <code>p-skeleton</code> has the shortest template in Optimus: it is literally <code>template: ''</code>.
          Everything you see is the host element plus a <code>::after</code> pseudo-element, which is why a skeleton can
          never contain content and never needs to.
        </p>
        <ul>
          <li>
            <strong>Host</strong> — <code>&lt;p-skeleton class="p-skeleton p-component"&gt;</code>,
            <code>display: block</code>, <code>overflow: hidden</code>, <code>position: relative</code> (an inline style
            the component writes itself), plus <code>aria-hidden="true"</code> and a <code>data-p</code> attribute
            carrying the shape.
          </li>
          <li>
            <strong>Sizing</strong> — <code>width</code> / <code>height</code> / (or <code>size</code>) /
            <code>borderRadius</code> are written as <em>inline styles</em> by the <code>containerStyle</code> getter,
            so they beat any stylesheet rule that is not <code>!important</code>.
          </li>
          <li>
            <strong>Shimmer</strong> — <code>.p-skeleton::after</code>, absolutely positioned, a three-stop
            <code>linear-gradient</code> (transparent → highlight → transparent) translated from <code>-100%</code> to
            <code>100%</code>.
          </li>
          <li>
            <strong>Modifiers</strong> — <code>.p-skeleton-circle</code> (<code>border-radius: 50%</code>) and
            <code>.p-skeleton-animation-none</code> (<code>animation: none</code> on the pseudo-element). That is the
            entire class surface.
          </li>
        </ul>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs</code> (the class map at <code>:14-21</code>, the host
          bindings at <code>:128-133</code>, Optimus 2.0.2) and the stylesheet it imports,
          <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> — a single 50-line <code>style</code> string, quoted
          in full below.
        </p>

        <h3>Defaults and the sizing precedence</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>shape</code></td>
                <td><code>'rectangle'</code></td>
                <td>Only <code>'circle'</code> is special-cased; it adds <code>border-radius: 50%</code>.</td>
              </tr>
              <tr>
                <td><code>animation</code></td>
                <td><code>'wave'</code></td>
                <td>Only <code>'none'</code> is special-cased. See the trap below.</td>
              </tr>
              <tr>
                <td><code>width</code></td>
                <td><code>'100%'</code></td>
                <td>Inline <code>width</code>.</td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td><code>'1rem'</code></td>
                <td>
                  Inline <code>height</code> — measured <strong>{{ measuredDefaultHeight }}</strong> at the kit's root
                  font size.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><em>unset</em></td>
                <td>
                  <strong>Overrides both</strong> <code>width</code> and <code>height</code> with the same value — a
                  square (or, with <code>shape="circle"</code>, a circle).
                </td>
              </tr>
              <tr>
                <td><code>borderRadius</code></td>
                <td><em>unset</em></td>
                <td>Falls back to the theme token; any CSS length or <code>%</code> works.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Deprecated, not removed:</strong> <code>styleClass</code> — Optimus still declares it
                  (<code>&#64;deprecated since v20.0.0</code>) and the host reads it in
                  <code>cn(cx('root'), styleClass)</code> at <code>:130</code>, so the binding compiles and works. Use
                  plain <code>class</code> anyway.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults are the class field initializers in
          <code>openng-optimus-ui-skeleton.mjs</code> (<code>shape</code> :72, <code>animation</code> :77, <code>width</code> :92,
          <code>height</code> :97, Optimus 2.0.2); the precedence is the <code>containerStyle</code> getter, which
          branches <code>if (this.size)</code> before it ever looks at <code>width</code>/<code>height</code>. Box
          sizes are computed style on a rendered skeleton.
        </p>

        <h3>Color — both themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-skeleton-background</code></td>
                <td>
                  <code>{{ tokenBgLight }}</code>
                </td>
                <td>
                  <code>{{ tokenBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td>computed background (rendered)</td>
                <td>
                  <code>{{ computedBgLight }}</code>
                </td>
                <td>
                  <code>{{ computedBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td>surface it sits on</td>
                <td>
                  <code>{{ surfaceLight }}</code>
                </td>
                <td>
                  <code>{{ surfaceDark }}</code>
                </td>
              </tr>
              <tr>
                <td><strong>contrast, skeleton vs surface</strong> (CONTRAST.MD, informational)</td>
                <td>
                  <strong>{{ contrastLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td><code>--p-skeleton-animation-background</code> (the shimmer)</td>
                <td>
                  <code>{{ tokenShimmerLight }}</code>
                </td>
                <td>
                  <code>{{ tokenShimmerDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-skeleton-border-radius</code></td>
                <td colspan="2">
                  <code>{{ tokenRadius }}</code> — the shared content radius
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>The animation, exactly as shipped</h3>
        <pre class="code-block"><code>{{ shipedCss }}</code></pre>
        <p class="src-note">
          That is the complete stylesheet, copied from
          <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> and expanded from its escaped single-line form. Two
          things are worth reading twice. There is
          <strong>no <code>prefers-reduced-motion</code> block</strong> anywhere in it — the 1.2 s shimmer is
          unconditional and infinite. And there <em>is</em> an RTL keyframe keyed on <code>[dir='rtl']</code>, so the
          sweep reverses direction correctly in a right-to-left document without any per-call-site work.
        </p>

        <h3>Reduced motion: the kit answers what the library does not</h3>
        <p>
          <code>styles.scss</code> opens with a global <code>&#64;media (prefers-reduced-motion: reduce)</code> block
          that sets <code>animation-duration: 0.01ms !important</code> and
          <code>animation-iteration-count: 1 !important</code> on <code>*, *::before, *::after</code>. Two decisions in
          it are worth copying. The <code>!important</code> is not sloppiness: Optimus injects its component CSS from a
          runtime <code>&lt;style&gt;</code> tag that lands <em>after</em> the stylesheet, so on equal specificity the
          library would otherwise win. And the duration is <code>0.01ms</code> rather than <code>none</code>, so
          <code>animationend</code>/<code>transitionend</code> still fire and component logic waiting on them does not
          deadlock.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Emulated media feature</th>
                <th><code>.p-skeleton::after</code> animation-duration</th>
                <th>iteration-count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>prefers-reduced-motion: no-preference</code></td>
                <td>
                  <code>{{ motionNormalDuration }}</code>
                </td>
                <td>
                  <code>{{ motionNormalIterations }}</code>
                </td>
              </tr>
              <tr>
                <td><code>prefers-reduced-motion: reduce</code></td>
                <td>
                  <code>{{ motionReducedDuration }}</code>
                </td>
                <td>
                  <code>{{ motionReducedIterations }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ motionNote }}
        </p>

        <h3>Layout shift — the whole point, in two numbers</h3>
        <p>
          A skeleton exists to hold the box open. On the Do/Don't pair in the Usage tab, the mismatched pair moves
          everything below it by
          <strong>{{ shiftBadDeltaPx }}px</strong>; the matched pair moves it by
          <strong>{{ shiftGoodDeltaPx }}px</strong>. There is no clever version of this — you either measured the real
          content or you did not.
        </p>
        <p class="src-note">
          {{ shiftNote }}
        </p>

        <h3>Spacing: the class that is not there</h3>
        <p>
          The most common way a skeleton block quietly loses its rhythm is a utility class nobody defines.
          <code>mb-3</code>, <code>mb-2</code>, <code>mt-2</code> and their relatives look like Bootstrap or PrimeFlex,
          and neither is a dependency here — so <code>&lt;p-skeleton class="mb-3" /&gt;</code> compiles, renders, and
          adds no margin at all. A class that <em>is</em> defined inside some component's encapsulated styles is no
          better: emulated encapsulation keeps it from reaching a skeleton anywhere else. Space skeletons with the
          container (<code>gap</code> on a flex or grid parent), not with per-element classes; a gap cannot be silently
          absent.
        </p>
        <p class="src-note">
          To check a project for it: list every <code>class</code>/<code>styleClass</code>
          value used on a skeleton, then grep the global stylesheet and
          <code>node_modules</code> for each name. Anything that only appears in a component's <code>styles</code> array
          counts as missing.
        </p>

        <h3>Narrow screens</h3>
        <p>
          The skeleton has no responsive behavior of its own: <code>width</code> and <code>height</code> are inline
          styles, so a percentage width follows the container at every viewport and a fixed <code>px</code> width
          overflows it. The layout that must reflow is the one you mirror — if the real content switches from a grid to
          a single column below a breakpoint, the placeholder must switch at the same breakpoint, or the shift you built
          it to prevent happens anyway.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 2.2.2 for a reduced-motion user: the kit's global catch-all takes the shimmer
          from {{ motionNormalDuration }} / {{ motionNormalIterations }} to {{ motionReducedDuration }} /
          {{ motionReducedIterations }}, so it runs once rather than forever. <strong>Failing:</strong> none of the
          measured criteria fails. <strong>Conditional:</strong> SC 2.2.2 again wherever that catch-all is absent or the
          skeleton outlives its fetch — the shipped stylesheet contains no <code>prefers-reduced-motion</code> block, so
          the shimmer is otherwise unconditional; and SC 4.1.3, because the placeholder is <code>aria-hidden</code> by a
          constant binding and returns null in the accessibility tree, so the wait is announced only where the container
          carries the live region and drops <code>aria-busy</code> when the content lands. SC 1.4.3 and SC 1.4.11 are
          not claimed either way: the {{ contrastLight }}:1 light / {{ contrastDark }}:1 dark figures are recorded as
          informational, since a hidden placeholder carrying no text is outside both criteria. <strong>AAA</strong> is
          assessed only where this guide names it: SC 2.3.3 asks that such motion be disableable, the library ships no
          opt-out, and the kit's global rule is what answers it.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SkeletonModule</code> exports the standalone <code>Skeleton</code> component (you can also import
          <code>Skeleton</code> directly). There is no directive form, no <code>ControlValueAccessor</code>, and
          <strong>no outputs at all</strong> — a skeleton is pure presentation with nothing to listen to.
        </p>

        <h3>Inputs — all seven of them</h3>
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
                <td><code>shape</code></td>
                <td><code>'rectangle' | 'circle'</code></td>
                <td>
                  Default <code>'rectangle'</code>. <code>'circle'</code> adds the 50% radius class — pair it with
                  <code>size</code>, not with <code>width</code>/<code>height</code>.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>string</td>
                <td>
                  One CSS length applied to both dimensions. Wins over <code>width</code> and <code>height</code>.
                </td>
              </tr>
              <tr>
                <td><code>width</code></td>
                <td>string</td>
                <td>
                  Default <code>'100%'</code>. Percentages are what you usually want — they survive translation and
                  reflow.
                </td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td>string</td>
                <td>
                  Default <code>'1rem'</code>. Match the line-height of the text you are standing in for, not its
                  font-size.
                </td>
              </tr>
              <tr>
                <td><code>borderRadius</code></td>
                <td>string</td>
                <td>Any CSS length or percentage; unset falls back to the theme token.</td>
              </tr>
              <tr>
                <td><code>animation</code></td>
                <td>string</td>
                <td><code>'none'</code> disables the shimmer. Everything else is the wave — see the trap below.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td><strong>Deprecated since v20.0.0</strong> (the source says so). Use <code>class</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Verified against the <code>Skeleton</code> class in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs:62-97</code> and the compiled input map at
          <code>:116</code> (Optimus 2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>). The deprecation notice is
          the vendor's own JSDoc on the <code>styleClass</code>
          field.
        </p>

        <h3>The <code>animation</code> trap</h3>
        <p><code>animation</code> is typed as a free string and only ever compared against one literal:</p>
        <pre class="code-block"><code>{{ animationSourceSnippet }}</code></pre>
        <p>
          So <code>animation="shimmer"</code>, <code>animation="pulse"</code> and <code>animation="non"</code> all
          render the default wave, silently. The Examples tab renders all three side by side — the third bar is a typo
          and looks exactly like the second. If you need the shimmer gone, the only spelling that works is
          <code>animation="none"</code>; if you need it gone for a whole subtree, target
          <code>.p-skeleton::after</code> yourself.
        </p>

        <h3>Styling: inline styles beat your stylesheet</h3>
        <p>
          <code>width</code>, <code>height</code>, <code>size</code> and <code>borderRadius</code> are written to the
          element's <code>style</code> attribute by the <code>containerStyle</code> getter, so a CSS rule targeting
          <code>.p-skeleton</code> cannot change them without <code>!important</code>. Color and radius fallback come
          from tokens and are overridable normally:
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix is set in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). Token names from <code>&#64;openng/optimus-ui-themes/dist/aura/skeleton/index.mjs</code>, whose entire contents are
          <code>borderRadius</code>, <code>background</code> and <code>animationBackground</code> per color scheme —
          there is nothing else to theme.
        </p>

        <h3>SSR</h3>
        <p>
          The skeleton itself is SSR-safe: no <code>window</code>, no <code>document</code>, no timers. What is not
          automatically safe is the state <em>around</em> it. A component that starts with
          <code>loading = true</code> and clears it from a browser-only effect will prerender the skeleton into the
          static HTML, which is then what search engines and the first paint show. Either resolve the data during
          prerender or start from a state whose server render is the real content.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>What a skeleton announces: nothing, by design</h4>
        <p>The host binding is not a default — it is a constant:</p>
        <pre class="code-block"><code>{{ ariaHostSnippet }}</code></pre>
        <p>
          There is no input that changes it and no <code>pt</code> slot for the host's <code>aria-hidden</code> that
          survives the binding. The consequence in the accessibility tree: <strong>{{ a11yTreeFinding }}</strong>
        </p>
        <p class="src-note">
          {{ a11yTreeNote }}
        </p>

        <h4>So who is responsible? The container.</h4>
        <p>
          WAI-ARIA 1.2 defines <code>aria-busy</code> on the element <em>being modified</em> — the region whose content
          is about to be replaced — and it exists precisely so assistive technology can defer announcing a half-built
          subtree. That element is your list, your card grid, your article body. It is never the placeholder.
        </p>
        <pre class="code-block"><code>{{ containerSnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>role="status"</code></strong> makes the region polite: it is announced when the user is idle,
            and it never interrupts. Use <code>role="alert"</code> only if the wait itself is an error.
          </li>
          <li>
            <strong><code>aria-busy="true"</code></strong> while the placeholders are up, and
            <strong>removed</strong> when the content lands — a region that stays busy is a region that may never be
            announced.
          </li>
          <li>
            <strong>A visually hidden sentence</strong> gives the live region something to say. The
            <code>.sr-only</code> utility is defined globally in <code>styles.scss</code>.
          </li>
          <li>
            <strong>Announce the end, not just the start.</strong> Replacing the <code>.sr-only</code> text with "42
            entries loaded" turns the same region into the completion message for free.
          </li>
        </ul>

        <h4>Motion</h4>
        <p>
          The shimmer is decorative and infinite. It is safe here only because
          <code>styles.scss</code> neutralizes it globally under <code>prefers-reduced-motion: reduce</code> (Design
          tab). If you lift this component into a project without that catch-all, add
          <code>animation="none"</code> behind the media query yourself — Optimus will not do it for you.
        </p>

        <h4>Known upstream and kit gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Optimus:</strong> no reduced-motion guard in the skeleton stylesheet, and no way to opt a whole app
            out of the wave short of a global CSS rule.
          </li>
          <li>
            <strong>Optimus:</strong> <code>p-progressbar</code> emits <code>aria-level</code> on
            <code>role="progressbar"</code>, which ARIA allows only on <code>role="heading"</code>; axe-core rates it
            critical. It is not optional — the host block binds <code>'[attr.aria-level]': 'value + unit'</code>
            unconditionally, so an unguarded bar ships something like
            <code>aria-level="36%"</code>. The same component also has
            <strong>no <code>ariaLabel</code> input</strong> at all — its Optimus input list is
            <code>value, showValue, styleClass, valueStyleClass, unit, mode, color</code>
            (<code>openng-optimus-ui-progressbar.mjs:136</code>).
            <strong>That does not make it unnameable</strong>, and this is the one place a progress bar differs from a
            skeleton: it is a real node with <code>role="progressbar"</code>, so <code>[attr.aria-label]</code> on the
            host names it — and the name survives, tick after tick, while <code>aria-valuenow</code> climbs; Optimus's
            <code>Bind</code> host directive never overwrites it. The DOM-property spelling
            <code>[ariaLabel]</code> works the same way. A wrapping live region is the alternative, not the only option.
          </li>
          <li>
            <strong>Kit:</strong> the fix for the invalid attribute is
            <code>StripInvalidAriaDirective</code>
            (<code>src/app/directives/strip-invalid-aria.directive.ts</code>), and the trap is its own docstring
            wording: a <em>standalone</em> directive never attaches "globally", only where a component lists it in
            <code>imports</code>. Kit rule: wherever you render a <code>p-progressbar</code>, import the directive in
            that same component — one missing import and the guard silently does not run.
          </li>
          <li>
            <strong>Discipline, not a defect:</strong> the announcement, the error branch, and the empty branch have to
            be added by hand on every screen, because nothing in the component asks for them. That is why the checklist
            below leads with them.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ The wait is longer than the flicker threshold — otherwise show nothing.</li>
          <li>☐ You can draw the incoming layout. If not, this is a spinner, not a skeleton.</li>
          <li>☐ The placeholder's box matches the real content's box; you measured, not guessed.</li>
          <li>
            ☐ The container carries <code>role="status"</code> (or an equivalent live region) and
            <code>aria-busy="true"</code>, and a visually hidden sentence names what is loading.
          </li>
          <li>☐ <code>aria-busy</code> is <strong>removed</strong> when the content arrives.</li>
          <li>☐ "Loading" comes from an explicit flag — never from <code>list.length === 0</code>.</li>
          <li>☐ There is an error branch and an empty branch. The skeleton is not the terminal state.</li>
          <li>☐ Line widths vary; the placeholder mirrors the real structure rather than a stack of identical bars.</li>
          <li>☐ Reduced motion is honored — verified, not assumed (emulate the media feature).</li>
          <li>☐ No global blocking overlay is already covering the same region.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the announcement rule — it asserts the
          <em>container</em>, not the skeleton, carries the semantics, and guards the regression this guide exists to
          prevent:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>The skeleton has no strings — the wait does</h3>
        <p>
          <code>p-skeleton</code> renders no text and takes no label, so there is nothing in the component to translate.
          That is a trap, not a relief: the translatable part of a loading state is the sentence you put in the live
          region, and because the component does not ask for it, it is the part people forget.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Name the thing, not the act.</strong> "Loading the glossary" is useful; "Loading…" repeated on every
            screen is noise. Use one key per region.
          </li>
          <li>
            <strong>Translate the completion message too.</strong> The same region should end up saying "42 entries
            loaded", and that string is a plural — resolve it through the kit's <code>TranslationService</code> rather
            than concatenating a number onto a fragment.
          </li>
          <li>
            <strong>Bind through a <code>computed()</code></strong> so a language switch re-renders the live-region
            text; a plain field is captured once and goes stale.
          </li>
        </ul>

        <h3>Widths: percentages travel, pixels do not</h3>
        <p>
          Skeleton dimensions are the one part of a loading state that is genuinely language-neutral — but only if you
          write them that way. A placeholder at
          <code>width="70%"</code> stands in for a German heading as well as an English one; a placeholder at
          <code>width="180px"</code> was measured against one language and will be wrong in the other twenty-seven.
          German runs 20–40% longer than English, which is exactly the margin between "the box did not move" and "the
          box moved". Prefer percentages and <code>rem</code> heights; reserve fixed pixel widths for things that really
          are fixed, like an avatar or a badge.
        </p>
        <p class="src-note">
          The tell is a placeholder whose width is a round pixel number: <code>80px</code>, <code>100px</code>,
          <code>90px</code>. Those are almost always the widths of the chips or labels the author had on screen in one
          language, and they do not move when the text does.
        </p>

        <h3>Progress labels are the expensive ones</h3>
        <p>
          If you reach for <code>p-progressbar</code> instead, the cost changes shape: a determinate bar needs a label
          that carries a number ("Step 3 of 7", "12 of 40 sources"), and those are plural- and order-sensitive in a way
          "Loading" is not. That is a real reason to prefer a skeleton when the shape is known — it moves the wait into
          the layout instead of into the string catalog.
        </p>

        <h3>RTL: this one is fine</h3>
        <p>
          The shipped stylesheet defines a second keyframe,
          <code>p-skeleton-animation-rtl</code>, selected by <code>[dir='rtl'] .p-skeleton::after</code>, so the sweep
          runs right-to-left in an RTL document with no per-call-site work. Widths are percentages and the box is
          symmetrical, so nothing else needs mirroring.
        </p>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> (quoted in full in the Design tab).
          <strong>Not verified by rendering an RTL locale</strong> — the kit ships LTR languages only, so there is
          nothing here to render it against.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Contrast figures quoted from the informational CONTRAST.MD rows
            (1.13–1.23:1 light, 1.16–1.20:1 dark, four styles); the light fill corrected to Aura's stock
            <code>surface.200</code>, which the styles do not replace.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Color table restated as tokens for the visual styles (ADR-0016); the 1.17:1 / 1.19:1
            ratios are labeled as computed on the stock palette; radius follows the style;
            narrow-screen statement added; history ordered newest first.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): the v22 removal of
            <code>styleClass</code> is undone — Optimus ships it again as a <code>&#64;deprecated</code> input that the
            host actually reads, so the count is <strong>seven inputs</strong>, and they are plain
            <code>&#64;Input()</code> properties rather than signal inputs (<code>containerStyle</code> is a getter, not a
            computed). <code>p-progressSpinner</code>/<code>p-progress-spinner</code> are valid selectors again. Line
            refs re-derived against the Optimus bundles (defaults :72/:77/:92/:97, host block :128-133,
            <code>aria-hidden</code> :129 unchanged); the Aura tokens are back on their 2.x values, which are the ones
            already measured here, so the color and radius figures stand and were not re-measured.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0:
            <code>styleClass</code> removed (six inputs now; a leftover static <code>styleClass="…"</code> attribute on
            this page's spinner example was silently inert and got dropped); <code>aria-hidden</code> host binding,
            defaults, the <code>animation</code> special-casing and the sizing precedence all re-confirmed in the 22
            source with fresh line refs. Color measurements from 21 carry — the skeleton tokens are unchanged.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Per-screen inventories replaced by the rules they were evidence for;
            the spacing-class section rewritten as the general trap; dead ADR reference replaced by the reasoning it
            stood for.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: the loading-state decision table (skeleton / spinner /
            progress bar / nothing), a playground whose loading state is itself a control, a four-panel live comparison
            of the same 2.5 s wait, four rendered Do/Don't pairs, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SkeletonArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;
  protected runTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      if (this.runTimer !== null) clearInterval(this.runTimer);
    });
  }

  // --- Playground state ------------------------------------------------------
  readonly shapeOptions = [
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Circle', value: 'circle' },
  ];

  readonly animationOptions = [
    { label: 'wave (default)', value: 'wave' },
    { label: 'none', value: 'none' },
  ];

  readonly radiusOptions = [
    { label: 'theme default', value: '' },
    { label: '0 — sharp', value: '0' },
    { label: '12px', value: '12px' },
    { label: '999px — pill', value: '999px' },
  ];

  readonly pgLoading = signal(true);
  readonly pgShape = signal<'rectangle' | 'circle'>('circle');
  readonly pgAnimation = signal<'wave' | 'none'>('wave');
  readonly pgRadius = signal('');
  readonly pgAnnounce = signal(true);

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const radius = this.pgRadius() ? ` borderRadius="${this.pgRadius()}"` : '';
    const anim = this.pgAnimation() === 'none' ? ' animation="none"' : '';
    const shape = this.pgShape() === 'circle' ? ' shape="circle"' : '';
    const open = this.pgAnnounce()
      ? '<div class="card" role="status" aria-busy="true">\n  <span class="sr-only">{{ t(\'loading.authorCard\') }}</span>'
      : '<div class="card">';
    return `@if (loading()) {
  ${open}
    <p-skeleton${shape}${anim}${radius} size="3rem" />
    <p-skeleton${anim}${radius} width="9rem" height="1.25rem" />
    <p-skeleton${anim}${radius} width="6rem" height="1rem" />
    <p-skeleton${anim}${radius} width="100%" height="3rem" />
  </div>
} @else {
  <app-author-card [author]="author()" />
}`;
  });

  // --- The four-strategy race ------------------------------------------------
  readonly running = signal(false);
  readonly progress = signal(0);

  /** Runs the same 2.5 s wait through all four panels. Browser-only (SSR-safe). */
  startRun(): void {
    if (!this.isBrowser || this.running()) return;
    if (this.runTimer !== null) clearInterval(this.runTimer);
    this.running.set(true);
    this.progress.set(0);
    const step = 100 / 25;
    this.runTimer = setInterval(() => {
      const next = Math.min(100, Math.round(this.progress() + step));
      this.progress.set(next);
      if (next >= 100) {
        if (this.runTimer !== null) clearInterval(this.runTimer);
        this.runTimer = null;
        this.running.set(false);
      }
    }, 100);
  }

  // --- Layout-shift demo -----------------------------------------------------
  readonly shiftLoading = signal(true);

  toggleShift(): void {
    this.shiftLoading.update((v) => !v);
  }

  /**
   * Box heights of the two rendered pairs below, read with
   * getBoundingClientRect() at a 16px root font size. The mismatched skeleton is
   * one 1rem bar; the content it stands in for wraps to three lines at a 1.5rem
   * line-height, i.e. 72px. The matched pair is three 1rem bars with two 0.75rem
   * gaps — also exactly 72px, by construction rather than by luck.
   */
  readonly shiftBadSkeletonPx = 16;
  readonly shiftBadRealPx = 72;
  readonly shiftBadDeltaPx = 56;
  readonly shiftGoodSkeletonPx = 72;
  readonly shiftGoodRealPx = 72;
  readonly shiftGoodDeltaPx = 0;
  readonly shiftNote: string = 'Heights read with getBoundingClientRect() at a 16px root font size: 16 -> 72 for the ' +
    'mismatched pair, 72 -> 72 for the matched one. The matched pair is arithmetic, not ' +
    'eyeballing: 3 bars x 1rem + 2 gaps x 0.75rem equals 3 text lines x 1.5rem line-height. ' +
    'Change the type scale and you have to redo the sum.';

  // --- Design values, as read from the running theme --------------------------
  readonly measuredDefaultHeight: string = '16px (100% x 1rem: 416 x 16 in a 1280px viewport)';
  readonly tokenBgLight: string = '{surface.200}';
  readonly tokenBgDark: string = 'rgba(255,255,255,0.06)';
  readonly computedBgLight: string = "Aura's stock surface.200 (slate.200 #e2e8f0) in every style";
  readonly computedBgDark: string = '6% white, composited over the surface below';
  readonly surfaceLight: string = '--surface-ground / --surface-card';
  readonly surfaceDark: string = '--surface-ground / --surface-card';
  readonly contrastLight: string = '1.13–1.23';
  readonly contrastDark: string = '1.16–1.20';
  readonly tokenShimmerLight: string = 'rgba(255,255,255,0.4)';
  readonly tokenShimmerDark: string = 'rgba(255,255,255,0.04)';
  readonly tokenRadius: string = '{content.border.radius} (Aura 6px; 0 in the default visual style)';
  readonly contrastNote: string = 'Token values from @openng/optimus-ui-themes/dist/aura/skeleton/index.mjs — the whole file ' +
    'is three values: the light background resolves {surface.200}, the dark one is a hard-coded ' +
    "6% white. {surface.200} is Aura's own scale, which the visual styles do not replace; the " +
    "page surfaces are the kit's, written by ThemeService from the active style. The dark " +
    'figure is the composited one: a translucent placeholder looks better on paper than on ' +
    'screen. The ranges (1.13–1.23:1 light, 1.16–1.20:1 dark, over the four styles) are the ' +
    'informational "skeleton" rows of docs/generated/CONTRAST.MD, regenerated by the contrast ' +
    'gate on every build. CAVEAT: the numbers are informational, not a ' +
    'WCAG result. A skeleton is aria-hidden decoration carrying no text and no meaning, so ' +
    'SC 1.4.3 and SC 1.4.11 do not apply to it. They are quoted because a placeholder you ' +
    'cannot see is a placeholder that is not doing its job.';

  readonly motionNormalDuration: string = '1.2s';
  readonly motionNormalIterations: string = 'infinite';
  readonly motionReducedDuration: string = '1e-05s';
  readonly motionReducedIterations: string = '1';
  readonly motionNote: string = "Read from getComputedStyle(el, '::after').animationDuration and " +
    '.animationIterationCount on a rendered skeleton, once per emulated value of the media ' +
    "feature. The reduced reading is the CSSOM's serialization of the kit's 0.01ms; the " +
    'finding is not the exact number but that it is not 1.2s and that the shimmer runs once ' +
    'instead of forever. Without the global catch-all both rows would read 1.2s / infinite, ' +
    'because the shipped skeleton stylesheet contains no prefers-reduced-motion block at all. ' +
    'Verify this by emulating the media feature and reading the computed animation-duration — ' +
    'reading the CSS will not tell you which rule won. The same read settles the animation ' +
    'input: animation="none" computes to animation-name "none" (the element carries ' +
    '.p-skeleton-animation-none), while animation="shimmer" computes to ' +
    'p-skeleton-animation 1.2s — identical to the untouched default.';

  readonly a11yTreeFinding: string = 'a snapshot rooted on a <p-skeleton> returns null. The element is not in the tree, and ' +
    'neither is anything inside it; the wrapping status region, by contrast, appears with its ' +
    '.sr-only sentence as its name.';
  readonly a11yTreeNote: string = 'The mechanism is the host binding quoted above, not a heuristic: aria-hidden="true" ' +
    'prunes the element and all of its descendants, which is also why a label or a role you ' +
    'add to a skeleton can never surface. To confirm it in your own build, snapshot the ' +
    'accessibility tree rooted on the placeholder and again on its container.';

  // --- Static example data ---------------------------------------------------
  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'lines',
      title: 'Text lines with a ragged edge',
      note: 'The baseline. Vary the widths — a flush block reads as a rendering fault, not as prose.',
      code: `<div class="stack" role="status" aria-busy="true">
  <span class="sr-only">{{ t('loading.article') }}</span>
  <p-skeleton width="60%" height="1.75rem" />
  <p-skeleton height="1rem" />
  <p-skeleton height="1rem" />
  <p-skeleton width="82%" height="1rem" />
</div>`,
    },
    {
      id: 'circle',
      title: 'Circles: shape vs borderRadius',
      note: 'shape="circle" + size is the readable spelling; borderRadius="50%" on a non-square box gives you an ellipse.',
      code: `<p-skeleton shape="circle" size="3rem" />
<p-skeleton shape="circle" size="2rem" />
<p-skeleton shape="circle" size="1.25rem" />
<!-- not a circle: 6rem x 3rem with a 50% radius is an ellipse -->
<p-skeleton width="6rem" height="3rem" borderRadius="50%" />`,
    },
    {
      id: 'sizing',
      title: 'Defaults, width/height, and what size overrides',
      note: 'First bar: no inputs at all (100% x 1rem). Third bar: size wins — the width is ignored.',
      code: `<p-skeleton />                                   <!-- 100% x 1rem -->
<p-skeleton width="12rem" height="2.5rem" />
<p-skeleton size="2.5rem" width="12rem" />       <!-- size wins: 2.5rem square -->
<p-skeleton width="12rem" height="2.5rem" borderRadius="999px" />`,
    },
    {
      id: 'static',
      title: 'animation="none" — and the typo that does nothing',
      note: 'Only the exact string "none" is recognized. The third bar says animation="shimmer" and waves anyway.',
      code: `<p-skeleton height="1.5rem" animation="none" />     <!-- static -->
<p-skeleton height="1.5rem" animation="wave" />     <!-- the default -->
<p-skeleton height="1.5rem" animation="shimmer" />  <!-- silently the default -->`,
    },
  ];

  readonly devImport: string = `import { SkeletonModule } from '@openng/optimus-ui/skeleton';

@Component({
  standalone: true,
  imports: [SkeletonModule],
  // ...
})`;

  readonly animationSourceSnippet: string = `// @openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs:14-21
const classes = {
    root: ({ instance }) => [
        'p-skeleton p-component',
        {
            'p-skeleton-circle': instance.shape === 'circle',
            'p-skeleton-animation-none': instance.animation === 'none'
        }
    ]
};`;

  readonly ariaHostSnippet: string = `// @openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs:128-133 (Optimus 2.0.2)
host: {
    '[attr.aria-hidden]': 'true',
    '[class]': "cn(cx('root'), styleClass)",
    '[style]': 'containerStyle',
    '[attr.data-p]': 'dataP'
}`;

  readonly containerSnippet: string = `<!-- The container owns the announcement. The skeletons are decoration. -->
<section
  class="entries"
  role="status"
  [attr.aria-busy]="loading() ? 'true' : null">

  @if (loading()) {
    <span class="sr-only">{{ t('entryList.loading') }}</span>
    @for (row of placeholderRows; track row) {
      <p-skeleton width="70%" height="1.25rem" />
      <p-skeleton height="1rem" />
    }
  } @else if (error()) {
    <p class="error">{{ t('entryList.loadFailed') }}</p>
  } @else if (entries().length === 0) {
    <p class="empty">{{ t('entryList.noEntries') }}</p>
  } @else {
    <span class="sr-only">{{ t('entryList.loaded', { count: entries().length }) }}</span>
    <!-- real rows -->
  }
</section>`;

  readonly emptyBadSnippet: string = `// "Loading" inferred from an empty collection:
isLoadingEntries = computed(() => this.allEntries().length === 0);

// ...and the error handler, which now turns the shimmer back ON:
this.allEntries.set([]); // "Will trigger isLoadingEntries to false" — it will not`;

  readonly emptyGoodSnippet: string = `readonly loading = signal(true);
readonly error   = signal<string | null>(null);
readonly entries = signal<Entry[]>([]);

// on failure
this.loading.set(false);
this.error.set('entryList.loadFailed');`;

  readonly themingSnippet: string = `/* Scoped to one region. Color and the radius FALLBACK are tokens... */
.report-placeholder {
  --p-skeleton-background: var(--surface-border);
  --p-skeleton-animation-background: rgba(255, 255, 255, 0.18);
  --p-skeleton-border-radius: 2px;
}

/* ...but width/height/size/borderRadius are INLINE styles written by the
   component, so a plain rule can never move them: */
.report-placeholder .p-skeleton { height: 2rem !important; }  /* needs !important */

/* template */
<div class="report-placeholder"><p-skeleton /></div>`;

  readonly shipedCss: string = `/* @openng/optimus-ui-styles/dist/skeleton/index.mjs — the complete stylesheet */
.p-skeleton {
    display: block;
    overflow: hidden;
    background: dt('skeleton.background');
    border-radius: dt('skeleton.border.radius');
}

.p-skeleton::after {
    content: '';
    animation: p-skeleton-animation 1.2s infinite;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    background: linear-gradient(90deg,
        rgba(255, 255, 255, 0),
        dt('skeleton.animation.background'),
        rgba(255, 255, 255, 0));
}

[dir='rtl'] .p-skeleton::after { animation-name: p-skeleton-animation-rtl; }

.p-skeleton-circle { border-radius: 50%; }

.p-skeleton-animation-none::after { animation: none; }

@keyframes p-skeleton-animation {
    from { transform: translateX(-100%); }
    to   { transform: translateX(100%); }
}

@keyframes p-skeleton-animation-rtl {
    from { transform: translateX(100%); }
    to   { transform: translateX(-100%); }
}`;

  readonly i18nSnippet: string = `// The live-region text is the translatable part of a loading state.
readonly loadingLabel = computed(() =>
  this.i18n.translate('entryList.loading'));          // "Glossar wird geladen"

readonly loadedLabel = computed(() =>
  this.i18n.translate('entryList.loaded', { count: this.entries().length }));

// template
<section role="status" [attr.aria-busy]="loading() ? 'true' : null">
  <span class="sr-only">{{ loading() ? loadingLabel() : loadedLabel() }}</span>
  ...
</section>`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';

@Component({
  standalone: true,
  imports: [SkeletonModule],
  template: \`
    <section role="status" [attr.aria-busy]="loading() ? 'true' : null">
      @if (loading()) {
        <span class="sr-only">Loading the report</span>
        <p-skeleton width="70%" height="1.25rem" />
      } @else {
        <p>Quarterly report</p>
      }
    </section>\`,
})
class HostComponent {
  readonly loading = signal(true);
}

describe('skeleton loading state', () => {
  it('announces on the container, not on the placeholder', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const region = host.querySelector('[role="status"]')!;
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.querySelector('.sr-only')!.textContent).toContain('Loading');

    // The placeholder is invisible to AT and cannot be made visible.
    expect(host.querySelector('p-skeleton')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('clears aria-busy when the content arrives', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();

    const region = fixture.nativeElement.querySelector('[role="status"]');
    // Guard against the regression this guide exists to prevent:
    expect(region.hasAttribute('aria-busy')).toBe(false);
    expect(region.querySelector('p-skeleton')).toBeNull();
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
