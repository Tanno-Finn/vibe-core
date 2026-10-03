import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { MeterGroupModule } from '@openng/optimus-ui/metergroup';
import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { ProgressSpinnerModule } from '@openng/optimus-ui/progressspinner';
import { SelectModule } from '@openng/optimus-ui/select';
import { SliderModule } from '@openng/optimus-ui/slider';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { StripInvalidAriaDirective } from '../../../directives/strip-invalid-aria.directive';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Progress — p-progressbar and p-progressspinner (SPEC N5, Guides).
 *
 * Renders through app-guide-shell and projects each tab body as an appGuideTab
 * template. Its subject is the pair of indicators that claim to answer "how
 * much longer": a determinate bar, which can, and an indeterminate bar or a
 * spinner, which cannot. The layout question (can I draw the incoming boxes)
 * belongs to the Skeleton guide and is not re-argued here.
 *
 * VERIFIED CLAIMS (source read at Optimus UI 2.0.2; colors named by their Aura
 * token, resolved for the default accent `sunset`):
 *   - p-progressbar host: a STATIC role="progressbar" attribute plus four
 *     property bindings, aria-valuemin 0, aria-valuenow value, aria-valuemax
 *     100 and aria-level "value + unit" — written straight in the host block,
 *     with no computed getter behind it (openng-optimus-ui-progressbar.mjs:136
 *     in the ɵcmp, declared copy :181). aria-level is invalid on that role and
 *     STILL SHIPS in Optimus 2.0.2; StripInvalidAriaDirective removes it, and being
 *     standalone it only runs where a component imports it.
 *   - In indeterminate mode value is undefined, so aria-valuenow is dropped
 *     (correct) while the same expression makes aria-level the string
 *     "undefined%" (the host expression is value + unit, unguarded).
 *   - p-progressspinner host: role="progressbar" plus a constant aria-busy="true"
 *     and aria-label from a real ariaLabel input
 *     (openng-optimus-ui-progressspinner.mjs:90, host block). PrimeNG 22's
 *     value/min/max inputs are NOT in Optimus: five inputs, no determinate
 *     spinner, no data-state — always a progressbar node with a name and no value.
 *   - Selectors: three per component, camelCase included —
 *     p-progressBar/p-progressbar/p-progress-bar and
 *     p-progressSpinner/p-progress-spinner/p-progressspinner. styleClass is back
 *     on both as an @deprecated (since v20) input, and pTemplate="content" binds
 *     again because the v21 PrimeTemplate ContentChildren query survived.
 *   - The determinate fill carries transition: width 1s ease-in-out
 *     (@openng/optimus-ui-styles/dist/progressbar/index.mjs), so aria-valuenow is
 *     already final while the fill is still traveling.
 *   - showValue text lives INSIDE the fill, which is overflow: hidden, so the
 *     readout is clipped at low values.
 *   - Both indeterminate keyframe sets and the spinner's three animations run
 *     with no prefers-reduced-motion guard; the kit's global catch-all in
 *     styles.scss caps them, which leaves the spinner a static arc and the
 *     indeterminate bar an empty track.
 *   - Aura ships the spinner as a four-color cycle (red/blue/green/yellow, Aura
 *     primitives that no visual style moves); green.500 and yellow.500 stay below
 *     3:1 on every light surface, white included. The kit sets all four stops to
 *     --primary-color-fg (styles.scss, .p-progressspinner), gated in
 *     docs/generated/CONTRAST.MD "progress spinner"; --primary-color is the kit's
 *     darker dark-mode background role and falls under 3:1 on every style's dark
 *     section. The bar's fill/track and readout pairs are gated too
 *     ("progressbar & slider"); the stock-cycle and track-vs-surface figures are
 *     computed from the token values per visual style.
 *   - Also covers p-metergroup (role="meter"): aria-valuenow is the total as a
 *     PERCENT while aria-valuemin/max are the raw min/max, no name input, and
 *     a segment without `color` renders with no background.
 *
 * The sentinel binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-progress-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    ProgressBarModule,
    ProgressSpinnerModule,
    MeterGroupModule,
    StripInvalidAriaDirective,
    SelectModule,
    SliderModule,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'progress'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two components, one question: <em>can you measure the thing you are waiting for?</em> A determinate
          <code>p-progressbar</code> answers "how much longer"; an indeterminate bar and a
          <code>p-progressspinner</code> answer only "still working". Everything below is live — the playground, the
          fill that arrives a second after the number, and the readout that vanishes when the fill gets narrow.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Progress bar playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-mode-label">Mode</span>
                <p-select
                  [ariaLabelledBy]="'pg-mode-label'"
                  size="small"
                  [options]="modeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgMode()"
                  (ngModelChange)="pgMode.set($event)"
                />
              </div>

              <div class="pg__field">
                <label class="pg__label" for="pg-value">Value — {{ pgValue() }}%</label>
                <p-slider
                  [ariaLabel]="'Progress value in percent'"
                  [min]="0"
                  [max]="100"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-showvalue">showValue</label>
                <p-toggleswitch
                  inputId="pg-showvalue"
                  [ngModel]="pgShowValue()"
                  (ngModelChange)="pgShowValue.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-unit-label">unit</span>
                <p-select
                  [ariaLabelledBy]="'pg-unit-label'"
                  size="small"
                  [options]="unitOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgUnit()"
                  (ngModelChange)="pgUnit.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-color">color input (bypasses the token)</label>
                <p-toggleswitch inputId="pg-color" [ngModel]="pgColor()" (ngModelChange)="pgColor.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-thin">Thin track (4px, kit reading-progress shape)</label>
                <p-toggleswitch inputId="pg-thin" [ngModel]="pgThin()" (ngModelChange)="pgThin.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <div class="pg__bar" [class.pg__bar--thin]="pgThin()">
                  <p-progressbar
                    [mode]="pgMode()"
                    [value]="pgValue()"
                    [showValue]="pgShowValue()"
                    [unit]="pgUnit()"
                    [color]="pgColor() ? '#7c3aed' : undefined"
                    [attr.aria-label]="'Importing sources'"
                    [attr.aria-valuetext]="pgMode() === 'determinate' ? pgValue() + ' percent imported' : null"
                  />
                </div>
                <p class="pg__hint">
                  Accessible name: <code>Importing sources</code>.
                  {{
                    pgMode() === 'determinate'
                      ? 'aria-valuenow=' + pgValue()
                      : 'No aria-valuenow — an indeterminate bar has no value to report.'
                  }}
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

        <!-- The value is instant, the fill is not -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The number arrives first, the fill arrives a second later</h3>
            <button type="button" class="copy-btn" (click)="jump()">Jump 0 to 100 in one tick</button>
          </div>
          <p class="ex__note">
            Press the button. <code>value</code> — and with it <code>aria-valuenow</code> — is 100 immediately; the
            shipped stylesheet animates the fill with a one-second <code>width</code> transition, so what a sighted user
            sees trails what a screen-reader user has already been told.
          </p>
          <div class="ex__stage ex__stage--block">
            <div class="jump__bar" #jumpBar>
              <p-progressbar [value]="jumpValue()" [showValue]="false" [attr.aria-label]="'Import progress'" />
            </div>
            <div class="jump__read">
              <span><strong>value / aria-valuenow:</strong> {{ jumpValue() }}</span>
              <span><strong>rendered fill:</strong> {{ jumpFillPct() }}%</span>
            </div>
          </div>
          <p class="src-note">
            The gap is the point, not a rendering artifact: sample the fill's width while the value is already final,
            and treat the transition as the reason a bar must not be the only channel for a value that matters.
          </p>
        </section>

        <!-- Determinate, indeterminate, spinner -->
        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage ex__stage--block">
              @switch (ex.id) {
                @case ('modes') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">determinate, 62%</span>
                      <div class="row__bar">
                        <p-progressbar [value]="62" [attr.aria-label]="'Uploading, determinate example'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">determinate, showValue off</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="62"
                          [showValue]="false"
                          [attr.aria-label]="'Uploading, no inline readout'"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">indeterminate</span>
                      <div class="row__bar">
                        <p-progressbar mode="indeterminate" [attr.aria-label]="'Searching, indeterminate example'" />
                      </div>
                    </div>
                  </div>
                }
                @case ('content') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">unit=" of 40"</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="12"
                          unit=" of 40"
                          [attr.aria-label]="'Sources checked'"
                          [attr.aria-valuetext]="'12 of 40 sources checked'"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">content template</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="72"
                          [attr.aria-label]="'Rendering pages'"
                          [attr.aria-valuetext]="'Step 5 of 7'"
                        >
                          <ng-template #content let-value>
                            <span class="bar__custom">Step 5 of 7 &middot; {{ value }}%</span>
                          </ng-template>
                        </p-progressbar>
                      </div>
                    </div>
                  </div>
                }
                @case ('clip') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">narrow bar, value=3, showValue on</span>
                      <div class="row__bar row__bar--narrow">
                        <p-progressbar [value]="3" [attr.aria-label]="'Clipped readout example'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">4px track, value=62, showValue on</span>
                      <div class="row__bar row__bar--thin">
                        <p-progressbar [value]="62" [attr.aria-label]="'Thin track readout example'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">same two values, readout outside</span>
                      <div class="row__bar row__bar--narrow row__bar--split">
                        <p-progressbar [value]="3" [showValue]="false" [attr.aria-label]="'Readout outside the bar'" />
                        <span class="row__pct">3%</span>
                      </div>
                    </div>
                  </div>
                }
                @case ('spinner') {
                  <div class="spin-grid">
                    <div class="spin-cell">
                      <span class="row__tag">defaults (100px)</span>
                      <p-progressspinner [ariaLabel]="'Loading, default spinner'" />
                    </div>
                    <div class="spin-cell">
                      <span class="row__tag">3rem, strokeWidth 4</span>
                      <p-progressspinner
                        strokeWidth="4"
                        [ariaLabel]="'Loading, small spinner'"
                        [style]="{ width: '3rem', height: '3rem' }"
                      />
                    </div>
                    <div class="spin-cell">
                      <span class="row__tag">animationDuration 6s</span>
                      <p-progressspinner
                        strokeWidth="4"
                        animationDuration="6s"
                        [ariaLabel]="'Loading, slow spinner'"
                        [style]="{ width: '3rem', height: '3rem' }"
                      />
                    </div>
                  </div>
                }
                @case ('meter') {
                  <div class="rows">
                    <p-metergroup
                      [value]="meterItems"
                      [attr.aria-label]="'Context window used'"
                      [attr.aria-valuetext]="meterValuetext"
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
        <h3>Which indicator, and what it costs</h3>
        <p>
          One question decides between the two modes of <code>p-progressbar</code>:
          <strong>is there a quantity you can actually count</strong> — bytes, rows, steps, files? If there is, a
          determinate bar is the only indicator that answers "how much longer". If there is not, everything else on this
          page is a way of saying "still working" and you should pick the one that fits the space. Whether the wait
          deserves a drawn layout instead is the Skeleton guide's question, not this one.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Reach for it when</th>
                <th>In the accessibility tree</th>
                <th>Under reduced motion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nothing</strong></td>
                <td>The wait is short enough that an indicator would flash and vanish.</td>
                <td>Nothing. Announce the <em>result</em>.</td>
                <td>Unchanged — the honest baseline.</td>
              </tr>
              <tr>
                <td><code>p-progressbar</code> determinate</td>
                <td>A countable quantity: bytes, rows, steps, items.</td>
                <td><code>progressbar</code> with a value ({{ axDeterminate }}).</td>
                <td>
                  Still readable: the fill is a width, not an animation. Only the one-second transition is capped.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar mode="indeterminate"</code></td>
                <td>Nothing to count, and the space is a strip: a toolbar edge, a card header.</td>
                <td><code>progressbar</code> with a name and <strong>no value</strong> ({{ axIndeterminate }}).</td>
                <td><strong>Invisible.</strong> {{ reducedIndeterminateFinding }}</td>
              </tr>
              <tr>
                <td><code>p-progressspinner</code></td>
                <td>Nothing to count and the space is a block: a panel, an overlay, a button neighborhood.</td>
                <td><code>progressbar</code> with a name and no value — same node type as the indeterminate bar.</td>
                <td>Survives as a static arc: the dash pattern stops mid-circle instead of disappearing.</td>
              </tr>
              <tr>
                <td><code>p-skeleton</code></td>
                <td>You can draw the incoming layout and want the box held open.</td>
                <td>Nothing — it is <code>aria-hidden</code>; the container announces.</td>
                <td>Shimmer capped; the boxes stay.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The tree column is an accessibility-tree read of each rendered indicator; the reduced-motion column is a
          computed-style read under the emulated media feature, both quoted with their numbers in the Design tab.
          <strong>What is not measured</strong> is the "reach for it when" column: that is a judgment about which
          channel carries the information, and the only hard part of it is honesty about whether you can count anything.
        </p>

        <h3>Never fake the number</h3>
        <p>
          A determinate bar is a promise with a unit attached. If the value comes from a timer rather than from work
          completed, you have built a progress bar that lies — and it lies in the most annoying way available, by
          reaching 90% and stopping. The rule is mechanical:
          <strong>if you cannot name the numerator and the denominator, the mode is indeterminate</strong>. "Requests
          finished / requests queued" is a bar. "Roughly how long this usually takes" is not.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a value invented by a timer</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="fakeValue()" [attr.aria-label]="'Simulated progress'" />
              </div>
              <button type="button" class="copy-btn" (click)="startFake()" [disabled]="faking()">
                {{ faking() ? 'Faking...' : 'Start the fake' }}
              </button>
            </div>
            <p class="dd__why">
              This bar is a <code>setInterval</code> with no connection to any work. It stalls at {{ fakeCeiling }}%
              because that is what invented progress always does: the timer runs out of guesses before the job runs out
              of work. Every number it announced to a screen reader was false.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — say "working" when that is all you know</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Working'" />
              </div>
              <span class="dd__aside">Same strip, no false claim.</span>
            </div>
            <p class="dd__why">
              The indeterminate mode drops <code>value</code>, and with it <code>aria-valuenow</code>: the node still
              says "in progress" and stops short of claiming a position. Switch to determinate the moment you have a
              real count — mixing the two over the life of one wait is fine and often right.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an indicator with no name</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="46" [showValue]="false" />
              </div>
              <span class="dd__aside">No <code>aria-label</code>, no wrapper.</span>
            </div>
            <p class="dd__why">
              <code>role="progressbar"</code> is a static host attribute, so the node always exists — an unnamed one is
              announced as a bare progress indicator with a percentage and no subject. {{ axUnnamedFinding }} There is
              <strong>no <code>ariaLabel</code> input on the bar</strong>, which is exactly why this is the common
              defect.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name it, and spell the value if it is not a percentage</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar
                  [value]="46"
                  [showValue]="false"
                  [attr.aria-label]="'Importing sources'"
                  [attr.aria-valuetext]="'18 of 40 sources imported'"
                />
              </div>
              <span class="dd__aside">Named, and the value reads as a count.</span>
            </div>
            <p class="dd__why">
              <code>[attr.aria-label]</code> is the spelling to reach for: an attribute binding renders in every
              renderer, including a server-side one, while the DOM-property spelling relies on ARIA reflection.
              <code>[attr.aria-valuetext]</code> replaces "46 percent" with the sentence a user can act on — the library
              sets no <code>aria-valuetext</code> of its own, so it is yours to add.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — trust showValue as the readout</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="4" [attr.aria-label]="'Clipped readout'" />
              </div>
              <span class="dd__aside">value=4, <code>showValue</code> on — and nothing legible.</span>
            </div>
            <p class="dd__why">
              The readout is rendered <em>inside</em> the fill, and the fill is <code>overflow: hidden</code>.
              {{ clipFinding }} A bar that is thin by design — a reading-progress strip, for instance — hides it at
              every value.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — put the number beside the bar</span>
            <div class="dd__stage">
              <div class="row__bar row__bar--split">
                <p-progressbar [value]="4" [showValue]="false" [attr.aria-label]="'Readout beside the bar'" />
                <span class="row__pct">4%</span>
              </div>
              <span class="dd__aside"><code>[showValue]="false"</code> plus your own label.</span>
            </div>
            <p class="dd__why">
              Your own label survives at any value, takes the type scale and the translation you meant, and can say "4
              of 100 files" instead of "4%". This is also the kit's shape for a progress strip: a thin track with the
              caption outside it.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an indeterminate bar as the only feedback</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Working, motion only'" />
              </div>
              <span class="dd__aside">Nothing here but movement.</span>
            </div>
            <p class="dd__why">
              The whole indicator <em>is</em> the animation: two pseudo-elements sweeping across an otherwise empty
              track. Cap the animation — which any reduced-motion setting does — and the strip reads as an empty box.
              {{ reducedIndeterminateFinding }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — pair it with a word, or use a spinner</span>
            <div class="dd__stage">
              <div class="dd__pair">
                <p-progressspinner
                  strokeWidth="4"
                  [ariaLabel]="'Working'"
                  [style]="{ width: '2rem', height: '2rem' }"
                />
                <span class="dd__aside">Static arc when motion is off — still visible.</span>
              </div>
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Checking sources'" />
              </div>
              <span class="dd__aside">Visible caption: "Checking sources..."</span>
            </div>
            <p class="dd__why">
              The spinner degrades to a visible arc because its dash pattern is a paint, not only a movement. An
              indeterminate bar is fine when something else — a caption, a disabled button, a spinner — still
              communicates without motion.
            </p>
          </div>
        </div>

        <h3>Two habits that cost nothing</h3>
        <ul>
          <li>
            <strong>One indicator per wait.</strong> A spinner in every row of a loading table is eleven progress nodes
            in the accessibility tree saying the same thing. Put one indicator on the region.
          </li>
          <li>
            <strong>End the wait out loud.</strong> A progressbar node reaching 100 is not an announcement; the polite
            live region that says "40 of 40 imported" is. The kit's convention for that region —
            <code>role="status"</code> plus a <code>.sr-only</code> sentence — is the same one the Skeleton guide
            documents, and the two indicators share it.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/meter/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Meter pattern</a
            >
            — the distinction this guide leans on at the top: a meter is a current level (disk full, battery), a
            progressbar is a task moving to completion. Choosing the wrong one produces a control that never ends or
            never starts.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#progressbar" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>progressbar</code> role</a
            >
            — normative: the role's required and supported properties, and the rule that an indeterminate progressbar
            omits <code>aria-valuenow</code> rather than sending zero. It also lists which roles
            <code>aria-level</code> belongs to, which is the whole story behind the kit's strip directive.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-valuetext</code></a
            >
            — the property that turns "46" into "18 of 40 sources"; normative advice to use it only when the raw number
            is not meaningful on its own.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 floor the fill has to clear against its track, and the reason the spinner's shipped color cycle
            is measured here rather than trusted.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.2 Pause, Stop, Hide</a
            >
            — five seconds of automatic movement is the ceiling. An indeterminate indicator that outlives its request
            breaks it, and both of these components animate forever by construction.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — the media feature neither component consults. The kit answers it globally, and the Design tab measures
            what each indicator looks like once it is honored.
          </li>
          <li>
            <a href="https://optimus.openng.org/progressbar" target="_blank" rel="noopener noreferrer">
              Optimus UI — ProgressBar</a
            >
            — the vendor API surface (seven inputs, no outputs in 2.0.2), verified here against the shipped source
            rather than quoted.
          </li>
          <li>
            <a href="https://optimus.openng.org/progressspinner" target="_blank" rel="noopener noreferrer">
              Optimus UI — ProgressSpinner</a
            >
            — five inputs in 2.0.2, among them a real <code>ariaLabel</code>: that input is the single biggest API
            difference between the two components in this guide.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <ul>
          <li>
            <strong>Bar host</strong> — <code>&lt;p-progressbar class="p-progressbar p-component"&gt;</code>:
            <code>display: block</code>, <code>position: relative</code>, <code>overflow: hidden</code>, the height and
            background from tokens, plus a <code>data-p</code> attribute carrying the mode.
          </li>
          <li>
            <strong>Fill</strong> — <code>.p-progressbar-value</code>, absolutely positioned, <code>height: 100%</code>,
            <code>width</code> written inline as <code>value%</code>, and <code>transition: width 1s ease-in-out</code>.
          </li>
          <li>
            <strong>Readout</strong> — <code>.p-progressbar-label</code>, a flex child <em>of the fill</em>. That
            nesting is the reason the number disappears at low values.
          </li>
          <li>
            <strong>Indeterminate</strong> — the same fill element with no width, carrying two pseudo-elements
            (<code>::before</code>, <code>::after</code>) that sweep across on 2.1 s loops, the second delayed by 1.15
            s.
          </li>
          <li>
            <strong>Spinner</strong> — a host with a <code>::before</code> padding trick for the square aspect ratio, an
            <code>&lt;svg&gt;</code>
            (<code>.p-progressspinner-spin</code>) rotating, and one
            <code>&lt;circle r="20"&gt;</code> (<code>.p-progressspinner-circle</code>) whose dash pattern and stroke
            color are themselves animated.
          </li>
        </ul>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-progressbar.mjs</code> (the class map at the top of the file, the
          template and host block in the ɵcmp at <code>:136</code>) and
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-progressspinner.mjs</code> (<code>:90</code>), plus their stylesheets
          <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code> and
          <code>&#64;openng/optimus-ui-styles/dist/progressspinner/index.mjs</code> (2.0.2). Optimus UI 2.0.2.
        </p>

        <h3>Token chain — the bar, both themes</h3>
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
                <td><code>--p-progressbar-height</code></td>
                <td><code>1.25rem</code>, literal (Aura 2.x — Aura 3.0 had shrunk it to 1.125rem)</td>
                <td colspan="2">
                  <code>{{ tokenHeight }}</code> = <code>{{ measuredHeight }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-background</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>
                  <code>{{ trackLight }}</code>
                </td>
                <td>
                  <code>{{ trackDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-value-background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>
                  <code>{{ fillLight }}</code>
                </td>
                <td>
                  <code>{{ fillDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-label-color</code></td>
                <td><code>&#123;primary.contrast.color&#125;</code></td>
                <td>
                  <code>{{ labelLight }}</code>
                </td>
                <td>
                  <code>{{ labelDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-border-radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code></td>
                <td colspan="2">
                  <code>{{ tokenRadius }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-label-font-size</code> / <code>-label-font-weight</code></td>
                <td>literals</td>
                <td colspan="2">
                  <code>{{ labelFont }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura sources from <code>&#64;openng/optimus-ui-themes/dist/aura/progressbar/index.mjs</code>
          (the whole preset is seven values). The track is Aura's stock <code>&#123;surface.200&#125;</code> (slate) /
          <code>&#123;surface.700&#125;</code> (zinc), which no visual style overrides. The fill and the readout follow
          the <strong>accent</strong>, not the visual style: <code>ThemeService</code> writes the accent into
          <code>semantic.primary</code>, so <code>&#123;primary.color&#125;</code> is the accent's step 500 in light
          and, in dark, a step of the ramp built from the accent's contrast-adjusted dark foreground
          (<code>primaryFgDark</code>) — the values shown are the default accent <code>sunset</code>. The radius
          follows the visual style's <code>border.radius.md</code>.
        </p>

        <h3>Contrast — what has to clear which bar</h3>
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
                <td>fill vs track (the information)</td>
                <td>SC 1.4.11, 3:1</td>
                <td>
                  <strong>{{ contrastFillTrackLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastFillTrackDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td><code>showValue</code> text on the fill</td>
                <td>SC 1.4.3, 4.5:1 (12px bold)</td>
                <td>
                  <strong>{{ contrastLabelLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastLabelDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td>track vs the surface around it</td>
                <td>none — decorative</td>
                <td>{{ contrastTrackSurfaceLight }}:1</td>
                <td>{{ contrastTrackSurfaceDark }}:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>Aura ships a four-color spinner cycle — the kit replaces it with one color</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stop</th>
                <th>Aura</th>
                <th>Light value</th>
                <th>vs light <code>--surface-section</code>, four styles</th>
                <th>Dark value</th>
                <th>vs dark <code>--surface-section</code>, four styles</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-progressspinner-color-one</code></td>
                <td><code>&#123;red.500&#125;</code> / <code>&#123;red.400&#125;</code></td>
                <td>
                  <code>{{ spinOneLight }}</code>
                </td>
                <td>{{ spinOneLightCr }}:1</td>
                <td>
                  <code>{{ spinOneDark }}</code>
                </td>
                <td>{{ spinOneDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-two</code></td>
                <td><code>&#123;blue.500&#125;</code> / <code>&#123;blue.400&#125;</code></td>
                <td>
                  <code>{{ spinTwoLight }}</code>
                </td>
                <td>{{ spinTwoLightCr }}:1</td>
                <td>
                  <code>{{ spinTwoDark }}</code>
                </td>
                <td>{{ spinTwoDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-three</code></td>
                <td><code>&#123;green.500&#125;</code> / <code>&#123;green.400&#125;</code></td>
                <td>
                  <code>{{ spinThreeLight }}</code>
                </td>
                <td>
                  <strong>{{ spinThreeLightCr }}:1</strong>
                </td>
                <td>
                  <code>{{ spinThreeDark }}</code>
                </td>
                <td>{{ spinThreeDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-four</code></td>
                <td><code>&#123;yellow.500&#125;</code> / <code>&#123;yellow.400&#125;</code></td>
                <td>
                  <code>{{ spinFourLight }}</code>
                </td>
                <td>
                  <strong>{{ spinFourLightCr }}:1</strong>
                </td>
                <td>
                  <code>{{ spinFourDark }}</code>
                </td>
                <td>{{ spinFourDarkCr }}:1</td>
              </tr>
              <tr>
                <td>all four stops set to <code>--primary-color-fg</code></td>
                <td>the kit (<code>styles.scss</code>), gated</td>
                <td>
                  <code>{{ brandLight }}</code>
                </td>
                <td>{{ contrastBrandLight }}:1</td>
                <td>
                  <code>{{ brandDark }}</code>
                </td>
                <td>{{ contrastBrandDark }}:1</td>
              </tr>
              <tr>
                <td>all four stops set to <code>--primary-color</code></td>
                <td>the trap, if you override</td>
                <td>
                  <code>{{ brandWrongLight }}</code>
                </td>
                <td>{{ contrastBrandWrongLight }}:1</td>
                <td>
                  <code>{{ brandWrongDark }}</code>
                </td>
                <td>
                  <strong>{{ contrastBrandWrongDark }}:1</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura sources from
          <code>&#64;openng/optimus-ui-themes/dist/aura/progressspinner/index.mjs</code> (four palette references per color
          scheme, nothing else); the stop values are Aura primitives and do not move with the visual style or the
          accent. {{ surfaceBasis }} Left alone, the green and yellow stops would
          <strong>fail the 3:1 non-text minimum on every light surface</strong>, and they are not optional stops: a
          six-second <code>@keyframes</code> block cycles the stroke through all four. {{ spinCycleFinding }}
        </p>
        <p class="src-note">
          Hence the kit rule — <strong>all four stops set to <code>--primary-color-fg</code></strong> on every
          <code>.p-progressspinner</code> — and, in the last row, the trap for anyone who overrides it: this kit carries
          two brand custom properties, and only the foreground one is tuned for contrast in both schemes.
          <code>--primary-color</code> is the kit's background role and resolves to a darker shade in dark mode, so
          scoping the spinner to it produces a stroke that all but disappears ({{ contrastBrandWrongDark }}:1) — worse
          than the stock cycle. <strong>Leave the kit rule alone, or measure your override in both schemes.</strong>
          The kit's own <code>app-loading-overlay</code> no longer pins a color of its own; it follows the same global
          rule. Every spinner in the Examples tab shows it.
        </p>

        <h3>Motion, exactly as shipped</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animation</th>
                <th>Shipped</th>
                <th>Under <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>determinate fill (<code>transition: width</code>)</td>
                <td>
                  <code>{{ transitionNormal }}</code>
                </td>
                <td>
                  <code>{{ transitionReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>indeterminate sweeps (<code>::before</code> / <code>::after</code>)</td>
                <td>
                  <code>{{ indetNormal }}</code>
                </td>
                <td>
                  <code>{{ indetReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>spinner rotation (<code>.p-progressspinner-spin</code>)</td>
                <td>
                  <code>{{ spinNormal }}</code>
                </td>
                <td>
                  <code>{{ spinReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>spinner dash + color cycle (<code>.p-progressspinner-circle</code>)</td>
                <td>
                  <code>{{ circleNormal }}</code>
                </td>
                <td>
                  <code>{{ circleReduced }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ motionNote }}
        </p>

        <h3>The consequence: one of these indicators disappears</h3>
        <p>
          Cap the animations and the two indeterminate indicators part company.
          <strong>The spinner survives</strong>: its arc is a dash pattern that happens to be animated, so a stopped
          animation still paints roughly three quarters of a circle. The <strong>indeterminate bar does not</strong>:
          {{ reducedIndeterminateFinding }} And because the track sits at roughly {{ contrastTrackSurfaceLight }}:1
          against the surface, what remains is not even clearly a bar.
        </p>
        <p class="src-note">
          Verify the pair in your own build: emulate <code>prefers-reduced-motion: reduce</code>
          and read the computed width of the sweeping pseudo-elements. Reading the CSS will not tell you which rule won,
          and reading a screenshot will not tell you why.
        </p>

        <h3>Sizing: the height token, and the shape the kit actually uses</h3>
        <p>
          The default bar is <code>{{ measuredHeight }}</code> tall — a chunky strip sized for the readout inside it. A
          progress indicator that is not meant to be read numerically usually wants to be much thinner, which is a
          per-region override of the height plus <code>[showValue]="false"</code>: the kit's reading-progress strip is a
          4px track with its caption beside it, and the pattern lives in <code>text-container.component.ts</code>. Two
          things travel with that decision: a thin track hides the built-in readout at every value, and a shorter
          <code>width</code> transition than the shipped one second keeps a fast-moving value from lagging visibly.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix comes from the kit's <code>provideOptimus</code> theme options in
          <code>app.config.ts</code>. Height, colors, and radius are ordinary custom properties, so a scoped block moves
          them; the fill's <code>width</code> is an inline style written by the component and cannot be overridden that
          way. Recoloring is where this gets expensive: {{ recolourCaution }}
        </p>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior. The bar is <code>display: block</code> and takes its container's width at
          every viewport, so it narrows with the layout; what fails first is the built-in readout, which the fill clips
          at low values — keep the number beside the bar. The spinner stays a fixed 100px square until you size it, and
          <code>p-metergroup</code> keeps its meters full-width while its label list wraps
          (<code>flex-wrap: wrap</code>). None of the three needs a breakpoint of its own.
        </p>
        <p class="src-note">
          Layout rules from <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code>,
          <code>…/progressspinner/index.mjs</code> and <code>…/metergroup/index.mjs</code> (2.0.2).
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing</strong> (default accent <code>sunset</code>; every accent is gated in CONTRAST.MD): SC 1.4.11
          for the fill against its track, 4.20:1 light / 4.61:1 dark (3.78:1 at the lowest accent), SC 1.4.3 for the
          <code>showValue</code> readout on the fill, 5.18:1 / 7.83:1, SC 1.4.11 for the spinner stroke, which the kit
          sets to <code>--primary-color-fg</code> (3.88:1 and up on every surface), and SC 4.1.2 for the role,
          present on both components, with <code>aria-valuenow</code> following the value and dropped in indeterminate
          mode. <strong>Failing:</strong> none of the measured criteria as the kit ships it — Aura's own four-color
          cycle would fail SC 1.4.11 (green {{ spinThreeLightCr }}:1, yellow {{ spinFourLightCr }}:1 on the light
          section surfaces), which is why the kit replaces it. <strong>Conditional:</strong> SC 4.1.2 on the bar, which also ships an <code>aria-level</code> invalid
          on this role — <code>40%</code> determinate, the literal <code>undefined%</code> indeterminate — wherever the
          stripping directive is not imported at the call site, and whose accessible name only you can supply; and SC
          2.2.2, which both components break by construction once an indeterminate indicator outlives the request it
          reports. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Two independent modules; neither has outputs, neither is a form control. The third import is not decoration —
          see the invalid-attribute section below.
        </p>

        <h3><code>p-progressbar</code> inputs</h3>
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
                <td><code>value</code></td>
                <td>number (<code>numberAttribute</code>)</td>
                <td>
                  0–100. Undefined in indeterminate mode; the fill width is written inline as <code>value%</code>.
                </td>
              </tr>
              <tr>
                <td><code>mode</code></td>
                <td><code>'determinate' | 'indeterminate'</code></td>
                <td>Default <code>'determinate'</code>. Any other string renders neither branch — an empty track.</td>
              </tr>
              <tr>
                <td><code>showValue</code></td>
                <td>boolean (<code>booleanAttribute</code>)</td>
                <td>
                  Default <strong><code>true</code></strong
                  >. Renders <code>value</code> + <code>unit</code> inside the fill. Hidden when <code>value</code> is 0
                  or null.
                </td>
              </tr>
              <tr>
                <td><code>unit</code></td>
                <td>string</td>
                <td>Default <code>'%'</code>, concatenated onto the number with no separator and no formatting.</td>
              </tr>
              <tr>
                <td><code>color</code></td>
                <td>string</td>
                <td>
                  Inline <code>background</code> on the fill. Bypasses the token, so it does not follow the theme —
                  reach for a scoped custom property instead.
                </td>
              </tr>
              <tr>
                <td><code>valueStyleClass</code></td>
                <td>string</td>
                <td>Class on the fill element; the supported way to style the fill without <code>::ng-deep</code>.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Back in Optimus:</strong> <code>styleClass</code> — PrimeNG 22 removed it, the v21 fork keeps
                  it as an <code>&#64;deprecated</code> input that still works. Write plain <code>class</code> anyway.
                  None of these are signal inputs; they are plain properties with <code>&#64;Input()</code> decorators.
                </td>
              </tr>
              <tr>
                <td><code>#content</code> template</td>
                <td><code>ng-template</code></td>
                <td>
                  Replaces the readout; receives the value as <code>$implicit</code>. Still rendered inside the fill; a
                  <code>ContentChild('content', &#123; descendants: false &#125;)</code>, so a direct child only.
                  <code>pTemplate="content"</code> binds too — the v21 <code>PrimeTemplate</code> query is still there.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3><code>p-progressspinner</code> inputs</h3>
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
                <td><code>ariaLabel</code></td>
                <td><em>unset</em></td>
                <td>A real input, bound to <code>aria-label</code> on the host. Set it — the role is always there.</td>
              </tr>
              <tr>
                <td><code>strokeWidth</code></td>
                <td><code>'2'</code></td>
                <td>
                  SVG stroke width on a <code>r="20"</code> circle in a <code>viewBox="25 25 50 50"</code>, so it scales
                  with the box.
                </td>
              </tr>
              <tr>
                <td><code>animationDuration</code></td>
                <td><code>'2s'</code></td>
                <td>
                  Inline on the <code>&lt;svg&gt;</code>; affects the <strong>rotation only</strong>. The dash and
                  color cycles keep their own durations.
                </td>
              </tr>
              <tr>
                <td><code>fill</code></td>
                <td><code>'none'</code></td>
                <td>The circle's fill; leave it unless you want a filled disc.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>No determinate spinner:</strong> the <code>value</code>/<code>min</code>/<code>max</code>
                  inputs PrimeNG 22 added are not in Optimus, and neither is the <code>data-state</code> attribute they
                  drove. Five inputs, and the host never carries an <code>aria-valuenow</code>. <code>styleClass</code>
                  is back here too, <code>&#64;deprecated</code> — use plain <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Both tables read from the shipped classes and their compiled input maps
          (<code>openng-optimus-ui-progressbar.mjs:136</code>,
          <code>openng-optimus-ui-progressspinner.mjs:90</code>, Optimus UI 2.0.2). Size is not an input on either component: the
          bar takes the width of its parent and its height from a token; the spinner is <code>100px</code> square from
          its own stylesheet until you give it a <code>[style]</code> or a class.
        </p>

        <h3>What the host emits</h3>
        <pre class="code-block"><code>{{ hostSnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>role="progressbar"</code> is a static attribute on the bar</strong>
            and a binding on the spinner. Either way it is always present: there is no "decorative" mode, and no way to
            opt a hidden indicator out of the tree short of
            <code>aria-hidden</code> on a wrapper.
          </li>
          <li>
            <strong><code>aria-valuenow</code> follows <code>value</code></strong
            >. In indeterminate mode <code>value</code> is undefined, Angular drops the attribute, and the node
            correctly reads as "in progress, position unknown".
          </li>
          <li>
            <strong>The spinner reports no value at all</strong> and adds <code>aria-busy="true"</code> to itself —
            which is why a wrapping live region, not the spinner, is what actually announces the wait.
          </li>
          <li>
            <strong>Neither component is a live region.</strong> A climbing <code>aria-valuenow</code> is polled by
            assistive tech, not announced. If the user must hear the outcome, say it in a
            <code>role="status"</code> region.
          </li>
        </ul>

        <h3>The invalid attribute, and the kit rule that follows from it</h3>
        <p>
          The bar's host block binds <code>[attr.aria-level]</code> to <code>value + unit</code> unconditionally.
          <code>aria-level</code> is defined for headings; on <code>role="progressbar"</code> it is invalid, and
          automated audits rate it critical. Two consequences worth knowing before you debug it:
        </p>
        <ul>
          <li>
            A determinate bar ships something like <code>aria-level="40%"</code> — and with a custom <code>unit</code>,
            whatever that concatenation produces (<code>aria-level="12 of 40"</code>). An
            <strong>indeterminate</strong> bar ships {{ ariaLevelIndeterminate }}, because the same expression runs with
            <code>value</code> undefined.
          </li>
          <li>
            The kit's answer is <code>StripInvalidAriaDirective</code>
            (<code>src/app/directives/strip-invalid-aria.directive.ts</code>), which removes the attribute and keeps
            removing it as change detection re-applies it. It is
            <strong>standalone and matches by element selector</strong>, so it attaches only inside a component that
            lists it in <code>imports</code>.
            <strong
              >Kit rule: wherever <code>ProgressBarModule</code> appears in an <code>imports</code> array, the directive
              appears next to it.</strong
            >
            Measured with it imported: {{ ariaLevelGuarded }}
          </li>
        </ul>
        <p class="src-note">
          Both readings come from the rendered host attributes, with and without the directive in the component's
          <code>imports</code>. To check a screen of your own, read the <code>role="progressbar"</code> element's
          attributes while the value moves — the attribute is re-applied on every tick, so a single snapshot is not
          enough.
        </p>

        <h3>Naming: the two spellings are not equivalent</h3>
        <p>
          The bar has <strong>no <code>ariaLabel</code> input</strong>. Writing <code>[ariaLabel]="…"</code> on the
          element still compiles — Angular falls back to a DOM-property binding, and the browser's ARIA reflection turns
          that property into the attribute. It works in a browser and produces nothing on a renderer without reflection,
          which includes server-side rendering. <code>[attr.aria-label]</code> is an attribute binding and is therefore
          the spelling that holds everywhere. The spinner does not have this problem: <code>ariaLabel</code> is a
          genuine input.
        </p>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>

        <h3>Wiring a real bar</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <p>
          Three details in that snippet earn their place. The value is derived from
          <em>counted work</em>, so it cannot lie. <code>aria-valuetext</code> carries the count, because "46" is not
          what the user wants to hear. And the region — not the bar — announces the end.
        </p>

        <h3>SSR</h3>
        <p>
          Both components are safe to prerender: no <code>window</code>, no timers, no measurement. What is not safe is
          the state around them. A bar that starts at <code>value = 0</code> prerenders as an empty track, so the static
          HTML shows a job that never started; an indeterminate bar prerenders as an empty strip whose only content is
          an animation the server never runs. Prefer rendering the resolved state, and remember that the strip directive
          is a browser-lifecycle guard — the attribute it removes may still be in server-rendered markup.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>What each indicator looks like to a screen reader</h4>
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
                <td>determinate bar, named</td>
                <td>{{ axDeterminate }}</td>
              </tr>
              <tr>
                <td>indeterminate bar, named</td>
                <td>{{ axIndeterminate }}</td>
              </tr>
              <tr>
                <td>spinner with <code>ariaLabel</code></td>
                <td>{{ axSpinner }}</td>
              </tr>
              <tr>
                <td>bar with no name</td>
                <td>{{ axUnnamedFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ axNote }}
        </p>

        <h4>Motion</h4>
        <p>
          Neither stylesheet consults <code>prefers-reduced-motion</code>. The kit neutralizes all of it globally from
          <code>styles.scss</code>, and the Design tab has the numbers per animation. Lifting either component into a
          project without that catch-all means two infinite animations with no opt-out — and the indeterminate bar is
          the one that needs a fallback, not just a slower loop.
        </p>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ The mode is honest: determinate only when a numerator and a denominator exist.</li>
          <li>
            ☐ The indicator has an accessible name — <code>[attr.aria-label]</code> on the bar,
            <code>ariaLabel</code> on the spinner, or a labeled wrapper.
          </li>
          <li>☐ <code>aria-valuetext</code> is set whenever the value is not a plain percentage.</li>
          <li>
            ☐ <code>ProgressBarModule</code> and <code>StripInvalidAriaDirective</code> are imported together; the
            rendered host carries no <code>aria-level</code>.
          </li>
          <li>
            ☐ The number the user needs is legible at low values — outside the fill, or <code>showValue</code> is off.
          </li>
          <li>
            ☐ There is a completion announcement in a polite live region, and an error branch for the wait that fails.
          </li>
          <li>
            ☐ Reduced motion was verified by emulating the media feature — especially for an indeterminate bar, which
            stops being visible at all.
          </li>
          <li>☐ One indicator per wait, not one per row.</li>
          <li>☐ Nothing about the wait depends on the fill's one-second transition having finished.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the three rules that rot first — the invalid attribute, the
          name, and the indeterminate mode's missing value:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>The library ships no strings — you ship four</h3>
        <p>
          Neither component reads anything from the Optimus translation config
          (<code>Optimus.setTranslation</code>): there is no "loading" string, no
          "percent complete", nothing to override. Everything a user hears or reads around a progress indicator is
          yours, and it is more than people expect:
        </p>
        <ul>
          <li>the <strong>accessible name</strong> — what is progressing ("Importing sources");</li>
          <li>
            the <strong><code>aria-valuetext</code></strong> — the value as a sentence ("18 of 40 sources imported");
          </li>
          <li>the <strong>visible caption</strong>, if the number sits beside the bar;</li>
          <li>the <strong>completion message</strong> in the live region — a plural, always.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>
          Bind all four through <code>computed()</code> so a language switch re-renders them; a plain field is captured
          once and goes stale on the next switch.
        </p>

        <h3><code>unit</code> is a string concatenation, and that is the trap</h3>
        <p>
          The built-in readout is <code>value</code> followed by <code>unit</code> with nothing in between and no
          formatting applied. Two things break in translation. The
          <strong>percent sign is not universally suffixed and not universally unspaced</strong>
          — French convention puts a non-breaking space before it, and several locales place the sign first — so a
          literal <code>'%'</code> is a Western-European default rather than a neutral one. And the
          <strong>number is not localized</strong>: it goes through plain interpolation, so a decimal value keeps its
          dot where a German reader expects a comma. If the number matters, render it yourself in the content template
          with the locale-aware formatting the rest of your app uses, and leave <code>unit</code> alone.
        </p>
        <p class="src-note">
          Read from the component's own template: the label element interpolates
          <code>value</code> and then <code>unit</code>, adjacent, with no separator and no number formatting;
          <code>unit</code> defaults to <code>'%'</code>.
        </p>

        <h3>Length: the readout has almost no room</h3>
        <p>
          A translated unit or a custom content template competes with the fill for space, and the fill is
          <code>overflow: hidden</code>. "12 of 40" is already a long readout at 30%; the same string in a language that
          runs 30% longer is clipped at a value where the English one fitted. This is the strongest practical argument
          for keeping the number <em>outside</em> the bar in a multilingual UI — outside, it wraps instead of vanishing.
        </p>

        <h3>RTL</h3>
        <p>
          The indeterminate keyframes are written with logical properties (<code>inset-inline-start</code> /
          <code>inset-inline-end</code>), so the sweep runs the correct way in a right-to-left document with no
          per-call-site work. The determinate fill is positioned from the inline start and grows inline, which mirrors
          correctly for the same reason. The spinner rotates clockwise regardless of direction, which is conventional
          and needs no mirroring.
        </p>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code>.
          <strong>Not verified by rendering an RTL locale</strong> — this kit ships left-to-right languages only, so
          there is nothing here to render it against.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the kit sets all four spinner
            stops to <code>--primary-color-fg</code> (the "scope it yourself" convention and demo removed); bar and
            spinner pairs cited from CONTRAST.MD, dark fill re-read from the <code>primaryFgDark</code> ramp.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            the fill and readout are named as accent-driven Aura tokens, the radius per style, surface-dependent ratios
            recomputed against the four styles' section surfaces and marked as outside the contrast gate; narrow-screen
            statement added; <code>p-metergroup</code> folded in (covers, agent-doc contract, one live example).
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): three of v0.3's findings
            flipped back to their v21 form — the camelCase selectors
            (<code>p-progressBar</code>/<code>p-progressSpinner</code>) compile again, <code>styleClass</code> is back on
            both as an <code>&#64;deprecated</code> input, and the spinner has no determinate mode
            (<code>value</code>/<code>min</code>/<code>max</code> and <code>data-state</code> are gone, five inputs).
            Aura 2.x puts the bar height back at <code>1.25rem</code> = 20px with a 12px readout, and resolves the
            spinner cycle through a <code>colorScheme</code> block instead of <code>light-dark()</code>, same colors.
            Line refs re-derived against the Optimus bundles (bar host <code>:136</code>, spinner
            <code>:90</code>); the invalid <code>aria-level</code> binding still ships, and it sits inline in the host
            block with no computed getter behind it.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0: camelCase selectors are
            gone (lowercase only); <code>styleClass</code> removed from both components; the invalid
            <code>aria-level</code> binding <strong>still ships</strong> (the
            <code>StripInvalidAriaDirective</code> rule stands); the spinner gained a determinate mode
            (<code>value</code>/<code>min</code>/<code>max</code>); bar height shrank to 18px with a 10px readout.
            Color measurements from 21 carry — the color tokens are unchanged.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide: the determinate/indeterminate/ spinner decision on the
            axis of what can be counted, measured token and contrast chains for both components in both themes, the
            reduced-motion divergence between spinner and indeterminate bar, the naming and invalid-attribute rules, and
            the canonical agent doc.
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
      .pg__field p-slider {
        margin: 0.6rem 0.2rem 0.2rem;
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
        justify-content: center;
        gap: var(--space-3);
        min-height: 9rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__bar {
        width: 100%;
      }
      .pg__bar--thin {
        --p-progressbar-height: 4px;
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
      .ex__stage--block {
        flex-direction: column;
        align-items: stretch;
      }

      .rows {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        width: 100%;
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 0;
      }
      .row__tag {
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }
      .row__bar {
        width: 100%;
        min-width: 0;
      }
      .row__bar--narrow {
        max-width: 200px;
      }
      .row__bar--thin {
        --p-progressbar-height: 4px;
      }
      .row__bar--split {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .row__bar--split p-progressbar {
        flex: 1;
      }
      .row__pct {
        flex: 0 0 auto;
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        color: var(--text-color);
      }
      .bar__custom {
        font-size: 0.7rem;
        white-space: nowrap;
      }

      .jump__bar {
        width: 100%;
      }
      .jump__read {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        font-size: 0.82rem;
        color: var(--text-color);
        font-variant-numeric: tabular-nums;
      }

      .spin-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--space-4);
        width: 100%;
        align-items: start;
      }
      .spin-cell {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
        min-width: 0;
      }
      @media (max-width: 900px) {
        .spin-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
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
      .dd__pair {
        display: flex;
        align-items: center;
        gap: var(--space-3);
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
export class ProgressArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;
  private fakeTimer: ReturnType<typeof setInterval> | null = null;
  private rafId: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      if (this.fakeTimer !== null) clearInterval(this.fakeTimer);
      if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.rafId);
    });
  }

  // --- Playground ------------------------------------------------------------
  readonly modeOptions = [
    { label: 'determinate (default)', value: 'determinate' },
    { label: 'indeterminate', value: 'indeterminate' },
  ];

  readonly unitOptions = [
    { label: '% (default)', value: '%' },
    { label: 'space + % (French style)', value: ' %' },
    { label: ' of 40', value: ' of 40' },
    { label: 'none', value: '' },
  ];

  readonly pgMode = signal<'determinate' | 'indeterminate'>('determinate');
  readonly pgValue = signal(40);
  readonly pgShowValue = signal(true);
  readonly pgUnit = signal('%');
  readonly pgColor = signal(false);
  readonly pgThin = signal(false);

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const indet = this.pgMode() === 'indeterminate';
    const value = indet ? '' : `\n  [value]="imported()"`;
    const show = this.pgShowValue() ? '' : `\n  [showValue]="false"`;
    const unit = this.pgUnit() === '%' ? '' : `\n  unit="${this.pgUnit()}"`;
    const color = this.pgColor() ? `\n  color="#7c3aed"  <!-- bypasses the token: no theme, no dark mode -->` : '';
    const mode = indet ? `\n  mode="indeterminate"` : '';
    const valuetext = indet
      ? ''
      : `\n  [attr.aria-valuetext]="t('import.valuetext', { done: done(), total: total() })"`;
    return `<p-progressbar${mode}${value}${show}${unit}${color}
  [attr.aria-label]="t('import.label')"${valuetext} />`;
  });

  // --- The value/fill gap ----------------------------------------------------
  readonly jumpValue = signal(0);
  readonly jumpFillPct = signal(0);
  private readonly jumpBar = viewChild<ElementRef<HTMLElement>>('jumpBar');

  /** Sets the value in one tick and samples the rendered fill for 1.4 s. */
  jump(): void {
    if (!this.isBrowser) return;
    this.jumpValue.set(this.jumpValue() >= 100 ? 0 : 100);
    const host = this.jumpBar()?.nativeElement;
    if (!host) return;
    const started = performance.now();
    const sample = () => {
      const bar = host.querySelector('.p-progressbar');
      const fill = host.querySelector('.p-progressbar-value');
      if (bar && fill) {
        const total = bar.getBoundingClientRect().width || 1;
        this.jumpFillPct.set(Math.round((fill.getBoundingClientRect().width / total) * 100));
      }
      if (performance.now() - started < 1400) {
        this.rafId = requestAnimationFrame(sample);
      } else {
        this.rafId = null;
      }
    };
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(sample);
  }

  // --- The faked bar ---------------------------------------------------------
  readonly fakeValue = signal(0);
  readonly faking = signal(false);
  readonly fakeCeiling = 90;

  /** A timer pretending to be work: fills to the ceiling and stalls there. */
  startFake(): void {
    if (!this.isBrowser || this.faking()) return;
    if (this.fakeTimer !== null) clearInterval(this.fakeTimer);
    this.faking.set(true);
    this.fakeValue.set(0);
    this.fakeTimer = setInterval(() => {
      const next = this.fakeValue() + Math.max(1, Math.round((this.fakeCeiling - this.fakeValue()) / 6));
      if (next >= this.fakeCeiling) {
        this.fakeValue.set(this.fakeCeiling);
        if (this.fakeTimer !== null) clearInterval(this.fakeTimer);
        this.fakeTimer = null;
        this.faking.set(false);
        return;
      }
      this.fakeValue.set(next);
    }, 220);
  }

  // --- Measured values -------------------------------------------------------
  readonly tokenHeight = '1.25rem';
  readonly measuredHeight = '20px';
  readonly tokenRadius =
    'border.radius.md of the visual style: 0 werkbund, 12px lernwerkstatt (default), 10px skizzenbuch, ' +
    '2px blaupause (Aura stock 6px)';
  readonly labelFont = '12px / 600';
  readonly trackLight = '#e2e8f0';
  readonly trackDark = '#3f3f46';
  readonly fillLight = '#c2410c';
  readonly fillDark = '#fb923c';
  readonly labelLight = '#ffffff';
  readonly labelDark = '#18181b';

  readonly contrastFillTrackLight = '4.20';
  readonly contrastFillTrackDark = '4.61';
  readonly contrastLabelLight = '5.18';
  readonly contrastLabelDark = '7.83';
  readonly contrastTrackSurfaceLight = '1.05–1.16';
  readonly contrastTrackSurfaceDark = '1.03–1.44';
  readonly contrastNote =
    'Default accent sunset. The first two rows are gated in docs/generated/CONTRAST.MD, group ' +
    '"progressbar & slider" (<accent>.progressbar.value.background on progressbar.background, ' +
    'and the label on the fill), for every accent and style: fill vs track 3.78–14.48:1, readout ' +
    '5.18–17.85:1. They compare the bar against itself and hold on any background. The third ' +
    'row depends on where you put the bar and is informational: the file lists the track on the ' +
    'ground and the card (progressbar.background, no criterion, 1.13–1.76:1), and against the ' +
    "four styles' --surface-section it is 1.05–1.16:1 in light and 1.03–1.44:1 in dark — " +
    'effectively invisible, which is exactly why an EMPTY bar reads as no bar at all.';

  readonly spinOneLight = '#ef4444';
  readonly spinTwoLight = '#3b82f6';
  readonly spinThreeLight = '#22c55e';
  readonly spinFourLight = '#eab308';
  readonly spinOneDark = '#f87171';
  readonly spinTwoDark = '#60a5fa';
  readonly spinThreeDark = '#4ade80';
  readonly spinFourDark = '#facc15';
  readonly spinOneLightCr = '3.21–3.55';
  readonly spinTwoLightCr = '3.14–3.47';
  readonly spinThreeLightCr = '1.95–2.15';
  readonly spinFourLightCr = '1.64–1.81';
  readonly spinOneDarkCr = '3.88–5.44';
  readonly spinTwoDarkCr = '4.22–5.92';
  readonly spinThreeDarkCr = '6.16–8.64';
  readonly spinFourDarkCr = '7.01–9.83';
  readonly brandLight = '#c2410c';
  readonly brandDark = '#fb923c';
  readonly contrastBrandLight = '4.42–4.89';
  readonly contrastBrandDark = '4.74–6.65';
  readonly brandWrongLight = '#c2410c';
  readonly brandWrongDark = '#9a3412';
  readonly contrastBrandWrongLight = '4.42–4.89';
  readonly contrastBrandWrongDark = '1.47–2.06';
  readonly recolourCaution =
    'the fill/track pair is the one nearest its 3:1 floor (4.20:1 light for the default accent, ' +
    '3.78:1 at the lowest, the fire accent in dark mode), so a lighter track or a darker fill can drop it below — and a ' +
    'recolor outside the tokens is no longer what the gate measures. The height override costs ' +
    'nothing; every color override has to be recomputed in both schemes.';
  readonly surfaceBasis =
    "Ratios against a surface are computed from the token values, against each visual style's " +
    '--surface-section (werkbund, lernwerkstatt, skizzenbuch, blaupause), and given as the range ' +
    'across the four; the last two rows use the default accent sunset. The kit row is gated ' +
    '("progress spinner", every accent: 3.88–17.85:1 across ground, card and section); the ' +
    'stock stops and the --primary-color trap are computed here, outside the gate.';

  readonly transitionNormal = 'width 1s ease-in-out';
  readonly transitionReduced = '1e-05s';
  readonly indetNormal = '2.1s infinite, second sweep delayed 1.15s';
  readonly indetReduced = '1e-05s, 1 iteration — and both sweeps 0px wide';
  readonly spinNormal = 'p-progressspinner-rotate 2s linear infinite';
  readonly spinReduced = '1e-05s, 1 iteration';
  readonly circleNormal = 'p-progressspinner-dash 1.5s + p-progressspinner-color 6s, both infinite';
  readonly circleReduced = '1e-05s, 1 iteration';
  readonly motionNote =
    'Durations and iteration counts are the computed style of the rendered elements — the ' +
    'fill, its ::before and ::after, the svg, and the circle — under each value of the ' +
    "media feature. The 1e-05s reading is the CSSOM serialization of the kit's 0.01ms; the " +
    'finding is not the exact number but that nothing here honors reduced motion on its own: ' +
    'without the global catch-all every row would read as the shipped column. Note that the ' +
    "spinner's animationDuration input only ever touches the rotation — the dash and color " +
    'cycles keep 1.5s and 6s whatever you pass.';
  readonly reducedIndeterminateFinding =
    'With the animation capped, both sweeping pseudo-elements compute to 0px wide, so the ' +
    'strip renders as an unfilled track.';

  readonly axDeterminate = 'the node carries the value from aria-valuenow and, when set, aria-valuetext beside it';
  readonly axIndeterminate = 'no value key at all — nothing in the node claims a position';
  readonly spinCycleFinding =
    'The keyframes interpolate between the stops, so the untouched stroke also passes through ' +
    "intermediate mixes; with the kit's four identical stops the stroke stays on the one accent " +
    'color throughout.';
  readonly axSpinner = 'name from ariaLabel, no value — indistinguishable from an indeterminate bar';
  readonly axUnnamedFinding =
    'In an accessibility-tree read, an unnamed BAR comes back with an empty name and its value ' +
    'still attached — a position with nothing it belongs to; an unnamed spinner comes back ' +
    'empty-named with no value either.';
  readonly axNote =
    'Accessibility-tree snapshots of the rendered examples on this page, one node per ' +
    'indicator. Two things are worth carrying away. Both value and value text sit on the node ' +
    'at the same time — aria-valuetext does not replace aria-valuenow there; ARIA gives it ' +
    'precedence when the value is SPOKEN, so a screen reader says the sentence instead of the ' +
    'percentage while the numeric value stays available. And a spinner and an indeterminate ' +
    'bar produce the same node, so the choice between them is visual, not semantic. Reproduce ' +
    'it by snapshotting the accessibility tree rooted on the indicator and reading name, value ' +
    'and value text.';

  readonly ariaLevelIndeterminate = 'the literal string aria-level="undefined%"';
  readonly ariaLevelGuarded =
    'no aria-level on any rendered bar, determinate or indeterminate, while aria-valuenow kept ' + 'updating.';
  readonly clipFinding =
    'Measured on a 200px-wide bar at value 3: the fill is 6px and the readout box is 17px, so ' +
    'the number is cut off — while the same value on a 910px bar has 27px of fill and shows it. ' +
    'The threshold is the text width, not the value.';

  // --- Static example data ---------------------------------------------------
  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'modes',
      title: 'The two modes, and the readout you usually turn off',
      note: 'Same component three times. The third one has no value to show and says so by omitting aria-valuenow.',
      code: `<!-- a counted quantity -->
<p-progressbar [value]="percentImported()" [attr.aria-label]="t('import.label')" />

<!-- the same bar without the built-in readout -->
<p-progressbar [value]="percentImported()" [showValue]="false"
  [attr.aria-label]="t('import.label')" />

<!-- nothing to count: no value, no aria-valuenow, no false promise -->
<p-progressbar mode="indeterminate" [attr.aria-label]="t('search.working')" />`,
    },
    {
      id: 'content',
      title: 'unit, and the content template that replaces the readout',
      note: 'unit is concatenated onto the number as-is. The content template receives the value as $implicit and still renders inside the fill.',
      code: `<!-- unit is appended verbatim: no separator, no formatting -->
<p-progressbar [value]="12" unit=" of 40"
  [attr.aria-label]="t('sources.label')"
  [attr.aria-valuetext]="t('sources.valuetext', { done: 12, total: 40 })" />

<!-- your own readout; still clipped by the fill, so keep it short -->
<p-progressbar [value]="72" [attr.aria-label]="t('render.label')"
  [attr.aria-valuetext]="t('render.step', { step: 5, of: 7 })">
  <ng-template #content let-value>
    <span class="bar__custom">{{ t('render.stepShort', { step: 5, of: 7 }) }}</span>
  </ng-template>
</p-progressbar>`,
    },
    {
      id: 'clip',
      title: 'Two ways the built-in readout disappears',
      note: 'The readout lives inside the fill, and the fill clips. A narrow bar at a low value cuts it off sideways; a thin track cuts it off top and bottom, at every value.',
      code: `<!-- narrow bar, low value: the fill is thinner than the text -->
<div style="max-width: 200px"><p-progressbar [value]="3" /></div>

<!-- thin track: the 12px readout does not fit a 4px box at any value -->
<div class="thin-track"><p-progressbar [value]="62" /></div>
/* .thin-track { --p-progressbar-height: 4px; } */

<!-- put the number where it survives every value, size, and language -->
<div class="bar-row">
  <p-progressbar [value]="3" [showValue]="false"
    [attr.aria-label]="t('upload.label')" />
  <span class="bar-row__pct">{{ 3 }}%</span>
</div>`,
    },
    {
      id: 'spinner',
      title: 'Spinner: size, stroke, and the one color',
      note: 'The first is untouched — 100px square. None of them cycles through four palette colors: the kit sets all four stops to --primary-color-fg globally, so every spinner is the one accent color in both schemes.',
      code: `<!-- 100px square until you size it; ariaLabel is a real input -->
<p-progressspinner [ariaLabel]="t('loading.label')" />

<!-- sized and thickened -->
<p-progressspinner strokeWidth="4" [ariaLabel]="t('loading.label')"
  [style]="{ width: '3rem', height: '3rem' }" />

/* Already in the kit (src/styles.scss) - no scoping needed: */
.p-progressspinner {
  --p-progressspinner-color-one: var(--primary-color-fg);
  --p-progressspinner-color-two: var(--primary-color-fg);
  --p-progressspinner-color-three: var(--primary-color-fg);
  --p-progressspinner-color-four: var(--primary-color-fg);
}`,
    },
    {
      id: 'meter',
      title: 'p-metergroup: a level made of parts, not a task',
      note: 'role="meter", named by you. aria-valuenow is the total as a percent of min..max, so keep min 0 / max 100 and say the breakdown in aria-valuetext. Every item needs a color: a segment without one has no background.',
      code: `<p-metergroup [value]="usage()"
  [attr.aria-label]="t('context.label')"
  [attr.aria-valuetext]="t('context.valuetext', { system: 12, chat: 38 })" />

// usage(): MeterItem[] - label, value, color (no default color), icon
[
  { label: 'System prompt', value: 12, color: 'var(--p-primary-color)' },
  { label: 'Conversation', value: 38, color: 'var(--text-color-secondary)' },
]`,
    },
  ];

  readonly meterItems = [
    { label: 'System prompt', value: 12, color: 'var(--p-primary-color)' },
    { label: 'Conversation', value: 38, color: 'var(--text-color-secondary)' },
  ];
  readonly meterValuetext = '50% of the context window used: system prompt 12%, conversation 38%';

  readonly devImport = `import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { ProgressSpinnerModule } from '@openng/optimus-ui/progressspinner';
// Not optional next to ProgressBarModule - see "the invalid attribute" below.
import { StripInvalidAriaDirective } from '../../directives/strip-invalid-aria.directive';

@Component({
  standalone: true,
  imports: [ProgressBarModule, StripInvalidAriaDirective, ProgressSpinnerModule],
  // ...
})`;

  readonly hostSnippet = `// @openng/optimus-ui/fesm2022/openng-optimus-ui-progressbar.mjs:136 (host block, 2.0.2)
host: {
    role: 'progressbar',                          // static: always in the tree
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuenow]': 'value',              // dropped when value is undefined
    '[attr.aria-valuemax]': '100',
    '[attr.aria-level]': 'value + unit',          // INVALID on this role, inline in the host block
    '[class]': "cn(cx('root'), styleClass)",
    '[attr.data-p]': 'dataP'
}

// @openng/optimus-ui/fesm2022/openng-optimus-ui-progressspinner.mjs:90 (host block, 2.0.2)
host: {
    '[attr.aria-label]': 'ariaLabel',             // a real input
    '[attr.role]': "'progressbar'",
    '[attr.aria-busy]': 'true',                   // on itself, not on your region
    '[class]': "cn(cx('root'), styleClass)"       // no aria-value* — no determinate spinner here
}`;

  readonly namingSnippet = `<!-- WRONG on the bar: no such input. Compiles to a DOM-property binding and
     depends on the browser reflecting ariaLabel onto the attribute. -->
<p-progressbar [value]="pct()" [ariaLabel]="label()" />

<!-- RIGHT on the bar: an attribute binding, renderer-independent. -->
<p-progressbar [value]="pct()" [attr.aria-label]="label()" />

<!-- RIGHT on the spinner: ariaLabel IS an input here. -->
<p-progressspinner [ariaLabel]="label()" />`;

  readonly wiringSnippet = `// The value is counted work, so it cannot lie.
readonly done  = signal(0);
readonly total = signal(0);
readonly percent = computed(() => {
  const t = this.total();
  return t === 0 ? 0 : Math.round((this.done() / t) * 100);
});
readonly label = computed(() => this.i18n.translate('import.label'));
readonly valuetext = computed(() =>
  this.i18n.translate('import.valuetext', { done: this.done(), total: this.total() }));
readonly finished = computed(() =>
  this.i18n.translate('import.finished', { count: this.done() }));

// template
<section role="status" [attr.aria-busy]="running() ? 'true' : null">
  @if (running()) {
    <div class="import-bar">
      <p-progressbar
        [value]="percent()"
        [showValue]="false"
        [attr.aria-label]="label()"
        [attr.aria-valuetext]="valuetext()" />
      <span class="import-bar__pct">{{ valuetext() }}</span>
    </div>
  } @else if (error()) {
    <p class="error">{{ errorLabel() }}</p>
  } @else {
    <span class="sr-only">{{ finished() }}</span>
  }
</section>`;

  readonly themingSnippet = `/* Scoped to one region: height, colors, and radius are ordinary tokens.
   Height is the safe one - it moves no contrast pair. Recoloring the track or
   the fill moves BOTH the fill/track pair and the readout, so measure after. */
.reading-progress-region {
  --p-progressbar-height: 4px;
}

/* A thin bar hides the built-in readout at every value, so turn it off and
   put the number beside the bar instead. */
<div class="reading-progress-region">
  <p-progressbar [value]="scrolled()" [showValue]="false"
    [attr.aria-label]="label()" />
  <span class="caption">{{ scrolled() }}%</span>
</div>

/* The fill's width is an inline style written by the component; a stylesheet
   rule cannot move it. Its transition, however, is yours: */
.reading-progress-region .p-progressbar-value { transition: width 0.3s ease; }`;

  readonly i18nSnippet = `// Four strings, none of them from the library.
readonly label = computed(() => this.i18n.translate('import.label'));
// "Importing sources"
readonly valuetext = computed(() =>
  this.i18n.translate('import.valuetext', { done: this.done(), total: this.total() }));
// "18 of 40 sources imported" - a sentence, not a number
readonly caption = computed(() =>
  this.i18n.translate('import.caption', { done: this.done(), total: this.total() }));
readonly finished = computed(() =>
  this.i18n.translate('import.finished', { count: this.done() }));   // a plural

// template: the bar carries the name and the value text, the region announces
<p-progressbar [value]="percent()" [showValue]="false"
  [attr.aria-label]="label()" [attr.aria-valuetext]="valuetext()" />`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { StripInvalidAriaDirective } from './directives/strip-invalid-aria.directive';

@Component({
  standalone: true,
  imports: [ProgressBarModule, StripInvalidAriaDirective],
  template: \`
    <p-progressbar
      [mode]="mode()"
      [value]="mode() === 'determinate' ? 40 : undefined"
      [attr.aria-label]="'Importing sources'"
      [attr.aria-valuetext]="'18 of 40 sources imported'" />\`,
})
class HostComponent {
  readonly mode = signal<'determinate' | 'indeterminate'>('determinate');
}

describe('progress bar semantics', () => {
  it('is named, quantified, and free of the invalid attribute', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('[role="progressbar"]');

    expect(bar.getAttribute('aria-label')).toBe('Importing sources');
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuetext')).toContain('40 sources');
    // Guard the regression the strip directive exists for:
    expect(bar.hasAttribute('aria-level')).toBe(false);
  });

  it('reports no value in indeterminate mode', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.mode.set('indeterminate');
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('[role="progressbar"]');

    // An indeterminate bar must not claim a position.
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
    expect(bar.getAttribute('aria-label')).toBe('Importing sources');
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
