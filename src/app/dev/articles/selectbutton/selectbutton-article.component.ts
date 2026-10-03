import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { TabsModule } from '@openng/optimus-ui/tabs';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: SelectButton (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>`; each tab body is an `appGuideTab`
 * template. Every example on the page is a real `p-selectbutton`, so the
 * rendered do/don't pairs and the segmented-control geometry are the component
 * itself rather than a picture of it.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Theme preset Aura, registered in app.config.ts. Token chain:
 *     `@openng/optimus-ui-themes/dist/aura/selectbutton/index.mjs` (root.borderRadius only)
 *     plus `@openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs` for every color,
 *     padding, and font token, resolving `{form.field.*}` / `{content.*}` /
 *     `{focus.ring.*}` from `@openng/optimus-ui-themes/dist/aura/base/index.mjs`.
 *   - Layout literals from `@openng/optimus-ui-styles/dist/selectbutton/index.mjs` and
 *     `@openng/optimus-ui-styles/dist/togglebutton/index.mjs`.
 *   - Structure: SelectButton renders one `p-togglebutton` per option
 *     (openng-optimus-ui-selectbutton.mjs:313-335, Optimus UI 2.0.2); the group host
 *     carries `role="group"` via a host binding (:312) and ToggleButton's host carries
 *     `role="button"` plus `aria-pressed` (openng-optimus-ui-togglebutton.mjs:280, host
 *     bindings). The group binds no per-segment ariaLabel - only onLabel/offLabel
 *     (:319-320) - and disabled segments stay in the tab order, because the -1
 *     fallback in the tabindex host binding is dead (togglebutton :280 vs :177).
 *   - The ThemeService gradient layer is scoped to `.p-button`, which the segments
 *     do not carry; the COLORS come from the `.p-togglebutton` rule in styles.scss:
 *     segment --surface-section, hover --surface-hover with --text-color,
 *     unpressed label --text-color-secondary, pressed pill --primary-color-fg with
 *     its label on --surface-card - all gated in CONTRAST.MD "togglebutton &
 *     selectbutton" (pill on segment >= 3.88:1). Focus: `.p-togglebutton:focus-visible`
 *     is in the kit's one ring rule (2px --primary-color-fg, "focus ring"). Geometry: every
 *     `html.style-<name>` block in styles.scss (ADR-0016) restyles `.p-togglebutton`
 *     (outline, shadow, radius, font, pressed-in transform), and each style's
 *     `presetOverrides.primitive.borderRadius` moves `{border.radius.md}`.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-selectbutton-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    SelectButtonModule,
    SelectModule,
    ToggleSwitchModule,
    TabsModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'selectbutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-selectbutton</code>: a row of connected segments where exactly one (or,
          in multiple mode, any number) is pressed. Start in the playground, then read the variants underneath with
          their markup.
        </p>

        <section class="pg" aria-label="SelectButton playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-count-label">Options</span>
                <p-select
                  [ariaLabelledBy]="'pg-count-label'"
                  size="small"
                  [options]="countOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgCount()"
                  (ngModelChange)="pgCount.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Size</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-multiple">Multiple</label>
                <p-toggleswitch
                  inputId="pg-multiple"
                  [ngModel]="pgMultiple()"
                  (ngModelChange)="pgMultiple.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-allowempty">Allow empty</label>
                <p-toggleswitch
                  inputId="pg-allowempty"
                  [ngModel]="pgAllowEmpty()"
                  (ngModelChange)="pgAllowEmpty.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-fluid">Fluid</label>
                <p-toggleswitch inputId="pg-fluid" [ngModel]="pgFluid()" (ngModelChange)="pgFluid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label" id="pg-preview-label">Preview</span>
              <div class="pg__stage">
                @if (pgMultiple()) {
                  <p-selectbutton
                    [ariaLabelledBy]="'pg-preview-label'"
                    [options]="pgOptions()"
                    optionLabel="label"
                    optionValue="value"
                    [multiple]="true"
                    [allowEmpty]="pgAllowEmpty()"
                    [size]="pgSizeInput()"
                    [fluid]="pgFluid()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgMultiValue()"
                    (ngModelChange)="pgMultiValue.set($event ?? [])"
                  />
                } @else {
                  <p-selectbutton
                    [ariaLabelledBy]="'pg-preview-label'"
                    [options]="pgOptions()"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="pgAllowEmpty()"
                    [size]="pgSizeInput()"
                    [fluid]="pgFluid()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                }
              </div>
              <p class="pg__readout">
                Model: <code>{{ pgReadout() }}</code>
              </p>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
          <p class="ex__note">
            Turn <em>Allow empty</em> on and click the pressed segment: the model goes to <code>null</code>. That is the
            shipped default — see the Usage tab.
          </p>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title" [id]="'ex-' + ex.id">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('canonical') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-canonical'"
                    [options]="periodOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="period()"
                    (ngModelChange)="period.set($event)"
                  />
                }
                @case ('three') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-three'"
                    [options]="densityOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="density()"
                    (ngModelChange)="density.set($event)"
                  />
                }
                @case ('multiple') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-multiple'"
                    [options]="dayOptions"
                    optionLabel="label"
                    optionValue="value"
                    [multiple]="true"
                    [ngModel]="days()"
                    (ngModelChange)="days.set($event ?? [])"
                  />
                  <span class="ex__readout">{{ daysReadout() }}</span>
                }
                @case ('item') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-item'"
                    [options]="alignOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="align()"
                    (ngModelChange)="align.set($event)"
                  >
                    <ng-template #item let-option>
                      <i [class]="option.icon" aria-hidden="true"></i>
                      <span>{{ option.label }}</span>
                    </ng-template>
                  </p-selectbutton>
                }
                @case ('sizes') {
                  <div class="ex__stack">
                    <p-selectbutton
                      size="small"
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeSmall()"
                      (ngModelChange)="sizeSmall.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeNormal()"
                      (ngModelChange)="sizeNormal.set($event)"
                    />
                    <p-selectbutton
                      size="large"
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeLarge()"
                      (ngModelChange)="sizeLarge.set($event)"
                    />
                  </div>
                }
                @case ('fluid') {
                  <div class="ex__stack">
                    <p-selectbutton
                      [fluid]="true"
                      [ariaLabelledBy]="'ex-fluid'"
                      [options]="densityOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="fluidValue()"
                      (ngModelChange)="fluidValue.set($event)"
                    />
                  </div>
                }
                @case ('states') {
                  <div class="ex__stack">
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [options]="planOptions"
                      optionLabel="label"
                      optionValue="value"
                      optionDisabled="soldOut"
                      [allowEmpty]="false"
                      [ngModel]="plan()"
                      (ngModelChange)="plan.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [invalid]="true"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="invalidValue()"
                      (ngModelChange)="invalidValue.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [disabled]="true"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="'month'"
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
        <p class="lead">
          SelectButton is the most mis-picked control in the library, because four other components sit within a hair of
          it. The whole of this tab is that boundary.
        </p>

        <h3>Four questions, in order</h3>
        <ol>
          <li>
            <strong>Does picking change what is on screen, or what a value is?</strong> Swapping between parallel
            <em>views of one subject</em> is navigation — <code>p-tabs</code>. Setting a value that something else then
            reads (a sort order, a chart period, a form field) is selection — SelectButton.
          </li>
          <li>
            <strong>Is the answer one yes/no, or one of several named things?</strong> One boolean that takes effect
            immediately is <code>p-toggleswitch</code>. Two <em>named</em> options ("Grid" / "List") have no rest
            position and are a SelectButton.
          </li>
          <li>
            <strong>Is this a form field that gets submitted and validated?</strong> Then the semantics the user's
            assistive technology expects are radio semantics — a radio group. SelectButton renders pressed buttons in a
            plain group, and contributes nothing to a native form submit.
          </li>
          <li>
            <strong>Do all the options fit on one line at your narrowest width?</strong> Two to four short labels:
            SelectButton. More than that, or long labels, or options that need explaining: <code>p-select</code>.
          </li>
        </ol>

        <h3>The control-choice table</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Control</th>
                <th>Why not SelectButton</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2&ndash;4 short, mutually exclusive values, always visible, applied instantly</td>
                <td>
                  <strong><code>p-selectbutton</code></strong>
                </td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td>Parallel views of one record (Overview / Activity / Settings)</td>
                <td><code>p-tabs</code></td>
                <td>
                  Tabs own <code>role="tablist"</code> and the panel wiring; a segmented control announces buttons, and
                  the panel is not associated with anything.
                </td>
              </tr>
              <tr>
                <td>One on/off setting that applies the instant it moves</td>
                <td><code>p-toggleswitch</code></td>
                <td>
                  An "On / Off" pair spends a whole segmented control on a state a switch shows in one glance &mdash;
                  and the switch has a rest position.
                </td>
              </tr>
              <tr>
                <td>One on/off state that must <em>look</em> like a button (a toolbar control, "Bold", "Mute")</td>
                <td><code>p-togglebutton</code></td>
                <td>
                  SelectButton is a group wrapper around exactly this component; a one-option group adds a
                  <code>role="group"</code>, an options array and a clearable model around a single pressed button.
                  Reach for the child directly &mdash; it takes <code>onLabel</code> / <code>offLabel</code>,
                  <code>onIcon</code> / <code>offIcon</code> and its own <code>ariaLabel</code>, none of which the group
                  exposes.
                </td>
              </tr>
              <tr>
                <td>A required choice inside a submitted, validated form</td>
                <td>radio group</td>
                <td>
                  No radio semantics, no <code>required</code> in the markup, no value in a native submit &mdash; see
                  the Development tab.
                </td>
              </tr>
              <tr>
                <td>5&ndash;25 options, or labels that do not fit a row</td>
                <td><code>p-select</code></td>
                <td>Segments never truncate; they wrap the row or push the layout.</td>
              </tr>
              <tr>
                <td>Zero-to-many independent options, in a form</td>
                <td>checkbox group</td>
                <td>
                  <code>[multiple]="true"</code> works, but announces pressed buttons rather than checkable items, and
                  no required or invalid state reaches the markup.
                </td>
              </tr>
              <tr>
                <td>Actions that <em>do</em> something (Export, Delete)</td>
                <td><code>p-button</code></td>
                <td>A pressed segment is a state, not a command; nothing here stays pressed after an action.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Four failures worth memorizing, rendered on both sides. The
          <span class="tag tag--bad">Don't</span> is on the left, the <span class="tag tag--good">Do</span> on the
          right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; a segmented control as page navigation</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-nav-bad'"
                [options]="sectionOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddNav()"
                (ngModelChange)="ddNav.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-nav-bad">
              Three buttons announce as buttons. Nothing tells anyone that a panel below belongs to the pressed one, and
              there is no panel keyboard contract.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; tabs, with real tab semantics</span>
            <div class="dd__stage">
              <p-tabs [value]="ddTab()" (valueChange)="onDdTab($event)">
                <p-tablist [pt]="{ tabList: { 'aria-label': 'Record sections' } }">
                  @for (s of sectionOptions; track s.value) {
                    <p-tab [value]="s.value">{{ s.label }}</p-tab>
                  }
                </p-tablist>
                <p-tabpanels>
                  @for (s of sectionOptions; track s.value) {
                    <p-tabpanel [value]="s.value" tabindex="0">
                      <span class="dd__panel">{{ s.label }} panel</span>
                    </p-tabpanel>
                  }
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              <code>role="tablist"</code>, arrow-key navigation, and each panel wired to its tab &mdash; the whole
              contract the segmented control lacks.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; On / Off as two segments</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-bool-bad'"
                [options]="onOffOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddBool()"
                (ngModelChange)="ddBool.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-bool-bad">
              Two segments, two words, and the state still has to be read off which one looks pressed. "Off" is also
              announced as a button you can press.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; one switch, one label</span>
            <div class="dd__stage">
              <div class="dd__switch">
                <label for="dd-notifications">Email notifications</label>
                <p-toggleswitch
                  inputId="dd-notifications"
                  [ngModel]="ddSwitch()"
                  (ngModelChange)="ddSwitch.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>role="switch"</code> carries the state, the label names the thing, and it takes a fraction of the
              width.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; six options in a row</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-many-bad'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddMany()"
                (ngModelChange)="ddMany.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-many-bad">
              Segments size to their content and never truncate, so a long set either wraps into a block or pushes the
              row wider than the column.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; a select, at a fixed width</span>
            <div class="dd__stage">
              <span class="pg__label" id="dd-country-label">Country</span>
              <p-select
                [ariaLabelledBy]="'dd-country-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddSelect()"
                (ngModelChange)="ddSelect.set($event)"
              />
            </div>
            <p class="dd__why">One trigger of predictable width, and the list grows without touching the layout.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; leave the default clearable</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-empty-bad'"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddEmpty()"
                (ngModelChange)="ddEmpty.set($event)"
              />
              <span class="ex__readout">Model: {{ ddEmpty() ?? 'null' }}</span>
            </div>
            <p class="dd__why" id="dd-empty-bad">
              Click the pressed segment: the model is <code>null</code> and every segment looks unpressed. Whatever
              reads that value now has no answer.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; <code>[allowEmpty]="false"</code></span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-empty-good'"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddKept()"
                (ngModelChange)="ddKept.set($event)"
              />
              <span class="ex__readout">Model: {{ ddKept() }}</span>
            </div>
            <p class="dd__why" id="dd-empty-good">
              Clicking the pressed segment is now a no-op, and the control always has an answer &mdash; which is what
              "one of these" means.
            </p>
          </div>
        </div>

        <h3>Writing the labels</h3>
        <ul>
          <li>
            <strong>Nouns and adjectives, not verbs.</strong> Segments are states ("Compact", "Week", "Grid"), not
            commands. A verb label reads as a button that does something and then stays stuck down.
          </li>
          <li>
            <strong>One word each where possible.</strong> The whole point of the control is that all the answers are
            visible at once; two-line segments defeat it.
          </li>
          <li>
            <strong>Parallel grammar across the set.</strong> "Day / Week / Month", never "Day / This week / Monthly".
          </li>
          <li>
            <strong>Name the group, not the options.</strong> The caption above the control says what is being chosen;
            the segments say the answers.
          </li>
        </ul>

        <h3>Annotated sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-pressed" target="_blank" rel="noopener noreferrer">
              W3C &mdash; WAI-ARIA 1.2, <code>aria-pressed</code></a
            >
            &mdash; defines the toggle-button state each segment actually exposes, and how it differs from
            <code>aria-checked</code>; the basis for the semantics section below.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Button pattern (incl. toggle buttons)</a
            >
            &mdash; the keyboard contract (Enter and Space) and the rule that a toggle button keeps one label while the
            state changes, never relabeling itself.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Radio Group pattern</a
            >
            &mdash; the arrow-key roving-tabindex contract a segmented control is often assumed to have; useful
            precisely because SelectButton does not implement it.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Tabs pattern</a
            >
            &mdash; what "navigation between parallel views" requires, and therefore what the first question in this tab
            is really asking.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; the 3:1 floor the pressed-state indicator is measured against in the Design tab.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            &mdash; the 4.5:1 floor for the segment labels, which the kit's label token holds in every style.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            &mdash; the 24&nbsp;CSS-px floor the default segment height is checked against.
          </li>
          <li>
            <a href="https://primeng.org/selectbutton" target="_blank" rel="noopener noreferrer">
              PrimeNG &mdash; SelectButton</a
            >
            &mdash; the upstream API surface Optimus forks, re-verified here against the shipped source rather than
            quoted.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          The host element is the group; it renders no wrapper of its own. Each option becomes a
          <code>p-togglebutton</code> child, and each of those wraps its label in an inner content span &mdash; the
          piece that actually carries the pressed look.
        </p>
        <ul>
          <li>
            <strong>Group</strong> &mdash; <code>.p-selectbutton</code>: <code>display: inline-flex</code>,
            <code>user-select: none</code>, and the outer corner radius.
          </li>
          <li>
            <strong>Segment</strong> &mdash; <code>.p-togglebutton</code>: background, 1px border, 0.25rem padding, and
            the focus outline. Inside the group its radius is reset to 0 and its border to <code>1px 1px 1px 0</code>,
            so neighbors share one edge; only the first and last segment get the outer radii back.
          </li>
          <li>
            <strong>Content</strong> &mdash; <code>.p-togglebutton-content</code>: the inner pill,
            <code>0.25rem 0.75rem</code> padding, centered flex with a 0.5rem gap. Its
            background is what changes when a segment is pressed.
          </li>
          <li>
            <strong>Label / icon</strong> &mdash; <code>.p-togglebutton-label</code> and
            <code>.p-togglebutton-icon</code>, both with <code>transition: none</code> so text never cross-fades.
          </li>
        </ul>
        <p class="src-note">
          Structure from <code>openng-optimus-ui-selectbutton.mjs:313-335</code> (one
          <code>p-togglebutton</code> per option, Optimus UI 2.0.2); layout literals from <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code> and
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>.
        </p>

        <h3>Token chain: Aura &rarr; kit</h3>
        <p>
          The <code>selectbutton</code> preset is nearly empty &mdash; it owns the outer radius and the invalid outline
          color, and nothing else. Every color, padding, and font token comes from the
          <code>togglebutton</code> preset.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura value</th>
                <th>Resolves to</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>selectbutton.border.radius</code></td>
                <td><code>&#123;form.field.border.radius&#125;</code></td>
                <td><code>&#123;border.radius.md&#125;</code> &mdash; per visual style (Aura stock 6px, werkbund 0)</td>
              </tr>
              <tr>
                <td><code>selectbutton.invalid.border.color</code></td>
                <td><code>&#123;form.field.invalid.border.color&#125;</code></td>
                <td>the shared form-error red</td>
              </tr>
              <tr>
                <td><code>togglebutton.padding</code></td>
                <td>0.25rem</td>
                <td>4px, all three sizes</td>
              </tr>
              <tr>
                <td><code>togglebutton.content.padding</code></td>
                <td>0.25rem 0.75rem</td>
                <td>4px / 12px, all three sizes</td>
              </tr>
              <tr>
                <td><code>togglebutton.font.size</code></td>
                <td>&mdash; no root token in Aura 2.x</td>
                <td>the stylesheet hard-codes <code>font-size: 1rem</code>; only sm/lg have tokens</td>
              </tr>
              <tr>
                <td><code>togglebutton.border.radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code></td>
                <td>per visual style (reset to 0 inside the group, except under skizzenbuch)</td>
              </tr>
              <tr>
                <td><code>togglebutton.gap</code></td>
                <td>0.5rem</td>
                <td>8px, icon &harr; label</td>
              </tr>
              <tr>
                <td><code>togglebutton.font.weight</code></td>
                <td>500</td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td><code>togglebutton.transition.duration</code></td>
                <td><code>&#123;form.field.transition.duration&#125;</code></td>
                <td>0.2s</td>
              </tr>
              <tr>
                <td><code>togglebutton.focus.ring.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>
                  1px solid <code>&#123;primary.color&#125;</code>, offset 2px &mdash; replaced by the kit ring: 2px
                  <code>--primary-color-fg</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-themes/dist/aura/selectbutton/index.mjs</code> and
          <code>&#8230;/aura/togglebutton/index.mjs</code>, resolving against <code>&#8230;/aura/base/index.mjs</code>.
          <strong>Note the focus ring:</strong> Aura's is the global 1px <code>focus.ring</code>; the kit draws its one
          ring instead (<code>.p-togglebutton:focus-visible</code> in <code>styles.scss</code>, 2px
          <code>--primary-color-fg</code> at 2px offset, <code>!important</code>) &mdash; the same ring as fields and
          buttons.
        </p>

        <h3>What the kit layers on top: the visual styles</h3>
        <p>
          The <code>ThemeService</code> gradient layer that repaints filled buttons is scoped to <code>.p-button</code>
          &mdash; a class the segments do not carry &mdash; so the <strong>colors</strong> come from a kit rule of
          their own: <code>.p-togglebutton</code> in <code>styles.scss</code> re-points the
          <code>--p-togglebutton-*</code> variables to the kit's surfaces, text colors, and accent foreground (next
          section). The
          <strong>shape</strong> is not: every visual style's <code>html.style-&lt;name&gt;</code> block in
          <code>styles.scss</code> (ADR-0016) targets <code>.p-togglebutton</code>, which is every segment.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Style</th>
                <th>What each segment gets</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>
                  <code>var(--style-bw) solid var(--style-outline)</code> border (3px light, 2px dark), radius 0, no
                  shadow, display font, pressed-in <code>translate(2px, 2px)</code> on
                  <code>[data-p-disabled='false']:active</code>
                </td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>2px outline plus a 2px offset shadow, display font at 700, pressed-in transform</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>1.5px outline, paper shadow, a hand-drawn radius on every segment, a 1px press</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>display font at 600, letter-spaced uppercase labels &mdash; no border change</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The <code>.p-togglebutton</code> selectors in the four <code>html.style-&lt;name&gt;</code> blocks of
          <code>styles.scss</code>. The press-in keys on the attribute with its value, because <code>:enabled</code>
          never matches the custom element. Two consequences: in three styles each segment carries its own ink
          outline, so segment boundaries are clear; and blaupause's uppercase labels are wider, which the width
          section below has to absorb.
        </p>

        <h3>How "pressed" is signaled</h3>
        <p>
          Aura signals selection with <strong>surfaces only</strong>: a white pill on a light-grey segment, no brand
          color anywhere. The kit keeps the mechanism &mdash; only the inner content pill and the label change &mdash;
          but fills the pill with the accent foreground, so the pressed segment reads at a glance.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Aura (light / dark)</th>
                <th>What the kit renders (both modes)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>group background</td>
                <td colspan="2">
                  none &mdash; <code>.p-selectbutton</code> paints nothing; the segments carry the fill
                </td>
              </tr>
              <tr>
                <td>segment background and border</td>
                <td><code>&#123;surface.100&#125;</code> / <code>&#123;surface.950&#125;</code></td>
                <td><code>--surface-section</code></td>
              </tr>
              <tr>
                <td>pressed segment background</td>
                <td>identical to the segment</td>
                <td>identical to the segment</td>
              </tr>
              <tr>
                <td>pressed <em>content</em> pill</td>
                <td><code>&#123;surface.0&#125;</code> / <code>&#123;surface.800&#125;</code></td>
                <td><code>--primary-color-fg</code></td>
              </tr>
              <tr>
                <td>label, unpressed</td>
                <td><code>&#123;surface.500&#125;</code> / <code>&#123;surface.400&#125;</code></td>
                <td><code>--text-color-secondary</code></td>
              </tr>
              <tr>
                <td>label and icon, pressed</td>
                <td><code>&#123;surface.900&#125;</code> / <code>&#123;surface.0&#125;</code></td>
                <td><code>--surface-card</code></td>
              </tr>
              <tr>
                <td>hover, unpressed</td>
                <td>label color only; <code>hover.background</code> equals the base</td>
                <td><code>--surface-hover</code> behind <code>--text-color</code></td>
              </tr>
              <tr>
                <td>pressed elevation</td>
                <td colspan="2"><code>content.checked.shadow</code> &mdash; two 1px shadows at 2% and 4% black</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>What the gate holds, in every style × accent × mode:</p>
        <ul>
          <li>
            <strong>The pressed pill clears the non-text contrast floor.</strong> Against the unpressed segment it
            measures <strong>{{ m.pressedContrastLight }}</strong> in light mode and
            <strong>{{ m.pressedContrastDark }}</strong> in dark mode across the accents of werkbund, lowest 3.88:1
            (blaupause dark, fire) &mdash; SC 1.4.11 asks for 3:1. Aura's own white pill was 1.10:1 light and 1.34:1
            dark. Forced-colors mode drops the fill, so the state then rests on <code>aria-pressed</code> and, if you
            add one, an icon.
          </li>
          <li>
            <strong>The labels clear SC 1.4.3.</strong> The unpressed label is <code>--text-color-secondary</code> on
            the segment: <strong>{{ m.labelContrastLight }}</strong> light and <strong>{{ m.labelContrastDark }}</strong>
            dark in werkbund, lowest 4.64:1 (blaupause, light). The pressed label on the pill:
            <strong>{{ m.pressedLabelLight }}</strong> light, <strong>{{ m.pressedLabelDark }}</strong> dark in
            werkbund, lowest 4.75:1. Do not override <code>--p-togglebutton-color</code> with a lighter grey; Aura's
            own value was 4.34:1.
          </li>
        </ul>
        <p class="src-note">
          Aura layers from <code>&#8230;/aura/togglebutton/index.mjs</code> (Aura 2.x: a
          <code>colorScheme.light</code> / <code>colorScheme.dark</code> block, no <code>light-dark()</code>); the kit
          column from the <code>.p-togglebutton</code> rule in <code>styles.scss</code>. Ratios quoted from
          <code>docs/generated/CONTRAST.MD</code>, <code>togglebutton &amp; selectbutton</code>:
          <code>&lt;accent&gt;.togglebutton.content.checked.background</code> on <code>togglebutton.background</code>
          (the pill), <code>togglebutton.checked.color</code> on the pill, and <code>togglebutton.color</code> on
          <code>togglebutton.background</code>.
        </p>

        <h3>Geometry and the size scale</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th><code>size="small"</code></th>
                <th>default</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>segment padding</td>
                <td colspan="3">0.25rem &mdash; unchanged by <code>size</code></td>
              </tr>
              <tr>
                <td>content padding</td>
                <td colspan="3">
                  0.25rem 0.75rem &mdash; unchanged by <code>size</code>
                </td>
              </tr>
              <tr>
                <td>segment height (token-derived)</td>
                <td>{{ m.hSmall }}</td>
                <td>{{ m.hDefault }}</td>
                <td>{{ m.hLarge }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The <code>sm</code> / <code>lg</code> blocks in <code>&#8230;/aura/togglebutton/index.mjs</code> override
          <em>only</em> <code>fontSize</code>; their padding values equal the defaults. Height is font-size &times;
          line-height plus the two fixed paddings and the border, which is why the scale is so shallow. The heights
          are for Aura's 1px border; a visual style's outline adds its extra width on both edges (werkbund light: 3px).
          Every size clears the 24px
          SC 2.5.8 floor; <code>small</code> is the one to check against 44px if you need SC 2.5.5.
        </p>

        <h3>Width: content-sized by default, equal segments with <code>fluid</code></h3>
        <p>
          Segments size to their labels, so a set of unequal words gives a ragged control and a longer translation
          silently widens it. <code>[fluid]="true"</code> puts <code>width: 100%</code> on the group and
          <code>flex: 1 1 0</code> on every segment &mdash; equal thirds, fixed outer width. <strong>Narrow
          screens:</strong> the control has no responsive behavior of its own; segments never move to a second row and
          never truncate, so below its content width a content-sized control overflows its container, and a fluid one
          wraps the labels inside each segment. That is the supported way
          to get a full-width segmented control; a hand-written <code>display: flex</code> rule on the group is not
          needed and will fight the shipped one.
        </p>
        <p class="src-note">
          <code>.p-selectbutton-fluid</code> and <code>.p-selectbutton-fluid .p-togglebutton</code> in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>.
        </p>

        <h3>Focus</h3>
        <p>
          Each segment is focusable in its own right, and the outline is drawn on the segment, not on the group. Because
          neighbors share a border, the shipped rule raises a focused segment with
          <code>position: relative; z-index: 1</code> so its ring is not painted over by the next segment. Measured on a
          focused segment: <strong>{{ m.focusOutline }}</strong> at offset <strong>{{ m.focusOffset }}</strong
          >, identical in both modes. Do not add <code>overflow: hidden</code> to an ancestor box that hugs the control
          &mdash; the ring is drawn 2px outside it.
        </p>
        <p class="src-note">
          The lift: <code>.p-selectbutton .p-togglebutton:focus-visible</code> in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>. The ring: the kit's one focus-ring
          rule in <code>styles.scss</code> (<code>.p-togglebutton:focus-visible</code>), measured in
          <code>docs/generated/CONTRAST.MD</code>, row <code>focus ring</code>, 3.88&ndash;17.85:1 on the page
          surfaces.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures &mdash; a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 2.1.1, with <code>Enter</code> and <code>Space</code> operating every segment and
          every segment its own tab stop; SC 2.4.7 with the ring measured in both modes ({{ m.focusOutline }} at offset
          {{ m.focusOffset }}); and SC 2.5.8, cleared by all three sizes at {{ m.hSmall }} / {{ m.hDefault }} /
          {{ m.hLarge }}; SC 1.4.11 on the pressed pill (lowest 3.88:1 against the segment) and SC 1.4.3 for every
          label, both gated in <code>CONTRAST.MD</code>. <strong>Failing:</strong> none of the measured criteria.
          <strong>Conditional:</strong> SC 4.1.2 &mdash; the
          group exposes toggle buttons with <code>aria-pressed</code>, but carries no name of its own and announces
          nothing until the call site supplies one. <strong>AAA</strong> is not assessed beyond the one criterion this
          guide touches: SC 2.5.5 asks 44px, which no measured segment height reaches.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ m.devImport }}</code></pre>
        <p>
          The selector accepts <code>p-selectbutton</code>, <code>p-selectbutton</code> and
          <code>p-select-button</code>. It is a <code>ControlValueAccessor</code>, so <code>ngModel</code> and reactive
          forms both bind.
        </p>

        <h3>Inputs</h3>
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
                <td><code>options</code></td>
                <td>any[]</td>
                <td>The option objects. Build them in a <code>computed()</code> so labels follow the language.</td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>
                  Field holding the visible label. Omitted, a <code>label</code> field on the option is used if it is
                  defined, and only failing that the option itself.
                </td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>
                  Field holding the model value.
                  <strong>Omit it and the model receives the whole option object</strong> whenever
                  <code>optionLabel</code> is set.
                </td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Field marking one option unusable; falls back to a <code>disabled</code> field on the option.</td>
              </tr>
              <tr>
                <td><code>multiple</code></td>
                <td>boolean</td>
                <td>Model becomes an array; every segment toggles independently.</td>
              </tr>
              <tr>
                <td><code>allowEmpty</code></td>
                <td>boolean</td>
                <td>
                  <strong>Default true.</strong> Clicking the pressed segment clears the model to <code>null</code>. Set
                  <code>false</code> for "exactly one of these".
                </td>
              </tr>
              <tr>
                <td><code>unselectable</code></td>
                <td>boolean</td>
                <td>
                  Legacy inverse of the above &mdash; a plain setter that writes
                  <code>allowEmpty = !value</code> (<code>openng-optimus-ui-selectbutton.mjs:103-106</code>), so both
                  inputs share one field and the order of assignment decides. Use <code>allowEmpty</code>, never both.
                </td>
              </tr>
              <tr>
                <td><code>dataKey</code></td>
                <td>string</td>
                <td>Identity field used to compare option values when they are objects.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Font-size only &mdash; see the Design tab.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Full width, equal segments.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Disables the whole group; the segments nevertheless stay in the tab order &mdash; see the pitfalls.
                </td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Adds a 1px outline in the error color. Nothing is announced &mdash; add text.</td>
              </tr>
              <tr>
                <td><code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>Ids naming the group. The only naming input there is.</td>
              </tr>
              <tr>
                <td><code>required</code>, <code>name</code></td>
                <td>boolean, string</td>
                <td>Accepted and inherited from the editable-holder base, but neither reaches the DOM here.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Forwarded to every segment, not just the first.</td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Accepted, never applied &mdash; see the pitfall below.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs read from the component declaration in
          <code>openng-optimus-ui-selectbutton.mjs</code> (Optimus UI 2.0.2 &mdash; plain
          <code>&#64;Input()</code> properties except <code>size</code> and <code>fluid</code>, which are signals;
          <code>styleClass</code> still exists but is forwarded onto every segment, <code>:316</code>, so prefer
          <code>class</code>);
          <code>required</code> / <code>invalid</code> / <code>disabled</code> / <code>name</code> are inherited from
          <code>BaseEditableHolder</code>. The object-model rule is the <code>getOptionValue</code> fallback at
          <code>openng-optimus-ui-selectbutton.mjs:195-197</code>.
        </p>

        <h3>Outputs and the item template</h3>
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
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>After the model is written; <code>value</code> is the new model, array in multiple mode.</td>
              </tr>
              <tr>
                <td><code>onOptionClick</code></td>
                <td><code>&#123; originalEvent, option, index &#125;</code></td>
                <td>
                  Same moment, but carries the option object and its index &mdash; use it when you need to know
                  <em>which</em> segment moved.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Neither output is emitted for a click that changes nothing (a pressed segment under
          <code>[allowEmpty]="false"</code>, or a disabled option). One content slot exists, replacing a segment's body:
        </p>
        <pre class="code-block"><code>{{ m.itemSnippet }}</code></pre>
        <p class="src-note">
          <code>onOptionSelect</code> returns early before any emit when the click is a no-op
          (<code>openng-optimus-ui-selectbutton.mjs:201-231</code>). The slot is the <code>#item</code> content child — a
          direct-children-only <code>&#64;ContentChild</code> (<code>&#123; descendants: false &#125;</code>,
          <code>:414-415</code>); the v21 <code>PrimeTemplate</code> query survives beside it
          (<code>:417-418</code>), so <code>pTemplate</code> binds again.
        </p>

        <h3>Forms</h3>
        <p>
          Reactive forms work through the value accessor, but there is no native form control in the DOM: no
          <code>input</code>, no <code>name</code> attribute, no value in a native submit. Treat it as an Angular-only
          field.
        </p>
        <pre class="code-block"><code>{{ m.formSnippet }}</code></pre>

        <h3>Pitfalls in the shipped implementation</h3>
        <ul>
          <li>
            <strong>Options are tracked by their label</strong>, not by value or index: the internal loop is
            <code>track getOptionLabel(option)</code>. Two options sharing a label produce duplicate track keys, and a
            language switch changes every key at once, so every segment is destroyed and rebuilt and focus inside the
            group is lost. Keep labels unique per control.
          </li>
          <li>
            <strong><code>tabindex</code> does nothing.</strong> The input exists and is transformed, but it is neither
            bound on the host nor forwarded to the segments. Each segment carries its own <code>tabindex="0"</code>, so
            an N-option control is N tab stops.
          </li>
          <li>
            <strong>There is no arrow-key navigation.</strong> The component defines a roving-tabindex helper and never
            calls it. Do not document arrow keys to your users, and do not assume the radio-group keyboard contract.
          </li>
          <li>
            <strong>A disabled segment stays in the tab order &mdash; and is not announced as disabled.</strong>
            ToggleButton's host binds
            <code>tabindex !== undefined ? tabindex : (!$disabled() ? 0 : -1)</code>
            (<code>openng-optimus-ui-togglebutton.mjs:280</code>), but <code>tabindex</code> defaults to
            <code>0</code> (<code>:177</code>) and SelectButton never overrides it, so the <code>&minus;1</code> branch
            can never run. PrimeNG 22 had fixed this; Optimus, forked from the v21 code base, keeps the dead fallback.
            The only disabled marker in the DOM is <code>data-p-disabled</code> &mdash; no
            <code>aria-disabled</code> &mdash; so keyboard focus lands on a segment that is silent, looks faded, and
            does nothing. If a choice must be excluded, prefer removing the option to disabling it; if you keep it, put
            the reason in text near the group.
          </li>
          <li>
            <strong>The component's own disabled tokens never apply.</strong> The disabled look comes from the global
            <code>.p-disabled</code> rule (opacity 0.6 plus <code>pointer-events: none</code>), not from
            <code>togglebutton.disabled.background/color</code>: the rule that would use them is written as
            <code>.p-togglebutton:disabled</code>, and <code>:disabled</code> never matches a custom element. The stale
            <code>cursor: pointer</code> you see on a disabled segment has the same cause. Do not spend time tuning
            <code>--p-togglebutton-disabled-*</code>; it is inert.
          </li>
          <li>
            <strong><code>[invalid]</code> is a 1px outline and nothing else</strong> &mdash; no
            <code>aria-invalid</code>, no description. Pair it with a visible message that the field references.
          </li>
          <li>
            <strong>Objects as model values</strong> need <code>dataKey</code>, otherwise equality is structural and a
            re-fetched option can stop matching the model.
          </li>
        </ul>

        <h3>Keyboard</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td>
                <td>
                  Moves to the <em>next segment</em>, not past the control. Every segment is its own tab stop
                  &mdash; disabled ones included.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Toggles the focused segment; the default is prevented.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Same as Enter.</td>
              </tr>
              <tr>
                <td><kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd></td>
                <td><strong>Nothing.</strong> No handler ships.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Nothing.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Key handling is ToggleButton's, not SelectButton's:
          <code>openng-optimus-ui-togglebutton.mjs:107-118</code> handles only <code>Enter</code> and <code>Space</code>. Verify
          the tab-stop count in the browser by tabbing through the control &mdash; a four-option group takes four
          presses to cross.
        </p>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>The group is a plain <code>role="group"</code></strong> and each option a
            <code>role="button"</code> with <code>aria-pressed</code> &mdash; not <code>radio</code>, not
            <code>aria-checked</code>. Screen-reader users hear "&lt;label&gt;, toggle button, pressed", with no "1 of
            3" position, because a group has no set semantics.
          </li>
          <li>
            <strong>Name the group with <code>ariaLabelledBy</code></strong> pointing at the visible caption. There is
            no <code>ariaLabel</code> input; a plain <code>[attr.aria-label]</code> on the host also lands, since the
            host is where the role sits &mdash; but a visible caption is better, and it is what the kit does (pattern
            pointer: <code>theme-picker.component.ts</code>).
          </li>
          <li>
            <strong>Unnamed, the group announces nothing at all</strong>, and the user hears three unrelated toggle
            buttons.
          </li>
          <li>
            <strong>Each segment keeps one label in both states</strong> &mdash; the pressed state is carried by
            <code>aria-pressed</code>. Never swap the text to "Selected".
          </li>
          <li>
            <strong>Do not add <code>role="radiogroup"</code></strong> to the host: the children are buttons, and a
            radiogroup whose children are not radios announces an empty set.
          </li>
          <li>
            <strong>Disabled options carry no <code>aria-disabled</code></strong> (and Tab still stops on them)
            &mdash; see the pitfall above. Removing the option beats disabling it.
          </li>
          <li>
            <strong>Contrast</strong> &mdash; the pressed pill and the labels pass SC 1.4.11 and 1.4.3 only on the
            kit's <code>.p-togglebutton</code> rule (Design tab), so do not override its tokens. The pill is still a
            fill that forced-colors mode drops; where the choice matters, back it with something else: an adjacent
            readout, or the view actually changing.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            &#9744; The group has an accessible name from <code>ariaLabelledBy</code> (or a host
            <code>aria-label</code>).
          </li>
          <li>&#9744; <code>[allowEmpty]="false"</code> whenever the value is required.</li>
          <li>&#9744; Two to four segments, all fitting on one line at the narrowest supported width.</li>
          <li>&#9744; Labels are unique, noun-shaped, and built in a <code>computed()</code>.</li>
          <li>&#9744; Tab-stop count equals the option count and every segment shows a focus ring.</li>
          <li>&#9744; The pressed state is discoverable without relying on the pill alone.</li>
          <li>&#9744; No arrow-key affordance is implied in the surrounding copy or help text.</li>
          <li>&#9744; If the value is submitted or validated, this is a radio group instead.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>), asserting the two facts most likely to regress &mdash; the pressed
          semantics and the clearable default:
        </p>
        <pre class="code-block"><code>{{ m.testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Every string on the control is yours</h3>
        <p>
          SelectButton and ToggleButton read nothing from the library's translation config &mdash; there is no
          <code>aria</code> key, no default label, nothing to feed through <code>setTranslation</code>. The segment
          labels and the group caption are the only text, and both come from your translation layer.
        </p>
        <pre class="code-block"><code>{{ m.i18nSnippet }}</code></pre>
        <p class="src-note">
          Neither <code>openng-optimus-ui-selectbutton.mjs</code> nor
          <code>openng-optimus-ui-togglebutton.mjs</code> references the library config or its translation object
          (re-verified, Optimus UI 2.0.2). The <code>onLabel</code> /
          <code>offLabel</code> defaults of "Yes" / "No" that ToggleButton carries are overwritten with your option
          label on every segment, so they can never surface here.
        </p>

        <h3>Label length is a layout risk, not a truncation risk</h3>
        <p>
          Segments size to content and never ellipsize. A translation that is 40% longer therefore widens the control
          until it wraps or overflows its column &mdash; German "Woche / Monat / Jahr" against English "Day / Week /
          Month" is already enough to move a toolbar. Two defenses, in order:
        </p>
        <ul>
          <li>
            <strong>Budget for the longest language you ship</strong> when you decide two, three, or four segments. A set
            that only fits in English is not a set.
          </li>
          <li>
            <strong><code>[fluid]="true"</code> inside a bounded container</strong> pins the outer width and divides it
            equally, so growth turns into narrower segments rather than a wider control. Labels then wrap inside a
            segment; check the tallest one.
          </li>
        </ul>

        <h3>Rebuild on language change</h3>
        <p>
          Build <code>options</code> in a <code>computed()</code> off the translation service, never as a plain field
          &mdash; a plain array freezes its labels at construction. Note the side effect: because the component tracks
          options by their label, a language switch destroys and recreates every segment, so focus inside the control is
          lost. If a language picker sits next to a segmented control, do not expect focus to survive the switch.
        </p>

        <h3>Easy-language and RTL</h3>
        <ul>
          <li>
            <strong>Easy-language variants</strong> want the plainest single word per segment and no abbreviations. If
            the plain wording will not fit three segments, that is the signal to use a select, not to shorten past
            comprehension.
          </li>
          <li>
            <strong>RTL is handled by the shipped CSS.</strong> The shared borders and the outer corners are expressed
            with logical properties (<code>border-inline-start-width</code>, <code>border-start-start-radius</code>), so
            the group mirrors correctly without work. The option <em>order</em> is your array's order &mdash; it mirrors
            visually, which is what a reader expects; do not reverse the array to compensate.
          </li>
        </ul>
        <p class="src-note">
          Logical-property rules in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>. This kit ships LTR languages only, so the RTL
          note is for downstream extensions.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the pressed pill is the
            kit's <code>--primary-color-fg</code> fill, gated ≥&nbsp;3.88:1 (was Aura's 1.10:1 / 1.34:1, ungated);
            segments ring in the kit focus ring; the press-in now fires; unpressed label lowest 4.64:1.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): the "kit adds no layer" claim replaced
            by what each style's <code>.p-togglebutton</code> rule does to every segment (outline, radius, font, press); the
            group radius is per style; label contrast cited from the contrast gate (the kit's
            <code>--text-color-secondary</code> label, lowest 4.76:1, replaces Aura's failing 4.34:1), the pill pair
            labeled as stock palette and ungated; the kit's label rule documented;
            narrow-screen statement added; "theme" wording moved to modes and accents; agent doc trimmed under the size aim.
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 2026-09-02 &mdash; Re-based on Optimus UI 2.0.2 (ADR-0014). Three v22 claims
            flipped back: disabled segments stay in the tab order (the <code>&minus;1</code> fallback is dead again
            because <code>tabindex</code> defaults to 0), the group binds no per-segment <code>ariaLabel</code> (only
            <code>onLabel</code> / <code>offLabel</code>), and <code>unselectable</code> is a plain setter writing
            <code>allowEmpty</code> rather than a separate signal input. Tokens are back on Aura 2.x &mdash; content
            padding 4/12px, no root font-size token (1rem hard-coded), size scale 14/16/18px &mdash; so the PrimeNG 21
            height measurements (37/39/42px) apply again; the color tokens and their contrast ratios are unchanged.
            All line refs re-derived against the Optimus bundles.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 2026-08-24 &mdash; Re-verified against PrimeNG 22.1.2 / Aura 3.0: disabled
            segments now leave the tab order (ToggleButton falls back to tabindex &minus;1 &mdash; the 21
            stays-focusable pitfall is fixed, the no-<code>aria-disabled</code> half remains); each segment gets
            <code>ariaLabel</code> = its option label; <code>unselectable</code> is a separate input overriding
            <code>allowEmpty</code>; content padding tightened to 2/10px and the font scale dropped one step (14px
            default); heights re-derived from tokens; line refs re-derived. Color measurements from 21 carry &mdash;
            the togglebutton color tokens are unchanged.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 2026-08-20 &mdash; WCAG 2.2 status roll-up added to the design tab: measured
            criteria summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 2026-07-30 &mdash; Initial guide: examples, the control-choice boundary
            against tabs / switch / radio / select, design tokens and contrast, development pitfalls, i18n, and the
            canonical agent doc.
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
      ul,
      ol {
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
      .pg__field label,
      .pg__label {
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
      .pg__stage > * {
        min-width: 0;
        max-width: 100%;
      }
      .pg__readout {
        margin: 0;
        font-size: var(--font-size-sm);
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
      .ex__stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-4);
      }
      .ex__readout {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-color-secondary);
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
        min-width: 0;
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
        overflow-x: auto;
      }
      .dd__switch {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .dd__switch label {
        font-size: 0.9rem;
      }
      .dd__panel {
        font-size: var(--font-size-sm);
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
export class SelectButtonArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  readonly copiedId = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Option sets -----------------------------------------------------------
  readonly periodOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];
  readonly densityOptions = [
    { label: 'Compact', value: 'compact' },
    { label: 'Cozy', value: 'cozy' },
    { label: 'Roomy', value: 'roomy' },
  ];
  readonly dayOptions = [
    { label: 'Mon', value: 'mon' },
    { label: 'Tue', value: 'tue' },
    { label: 'Wed', value: 'wed' },
    { label: 'Thu', value: 'thu' },
    { label: 'Fri', value: 'fri' },
  ];
  readonly alignOptions = [
    { label: 'Left', value: 'left', icon: 'pi pi-align-left' },
    { label: 'Center', value: 'center', icon: 'pi pi-align-center' },
    { label: 'Right', value: 'right', icon: 'pi pi-align-right' },
  ];
  readonly planOptions = [
    { label: 'Basic', value: 'basic', soldOut: false },
    { label: 'Pro', value: 'pro', soldOut: false },
    { label: 'Legacy', value: 'legacy', soldOut: true },
  ];
  readonly sectionOptions = [
    { label: 'Overview', value: 'overview' },
    { label: 'Activity', value: 'activity' },
    { label: 'Settings', value: 'settings' },
  ];
  readonly onOffOptions = [
    { label: 'On', value: true },
    { label: 'Off', value: false },
  ];
  readonly countryOptions = [
    { label: 'Germany', value: 'de' },
    { label: 'Austria', value: 'at' },
    { label: 'Switzerland', value: 'ch' },
    { label: 'Netherlands', value: 'nl' },
    { label: 'Luxembourg', value: 'lu' },
    { label: 'Liechtenstein', value: 'li' },
  ];

  // --- Example state ---------------------------------------------------------
  readonly period = signal('week');
  readonly density = signal('cozy');
  readonly days = signal<string[]>(['mon', 'wed']);
  readonly align = signal('left');
  readonly sizeSmall = signal('week');
  readonly sizeNormal = signal('week');
  readonly sizeLarge = signal('week');
  readonly fluidValue = signal('cozy');
  readonly plan = signal('basic');
  readonly invalidValue = signal<string | null>(null);

  readonly daysReadout = computed(() => {
    const v = this.days();
    return v.length ? v.join(', ') : '(none)';
  });

  // --- Do / Don't state ------------------------------------------------------
  readonly ddNav = signal('overview');
  readonly ddTab = signal<string>('overview');
  readonly ddBool = signal(true);
  readonly ddSwitch = signal(true);
  readonly ddMany = signal('de');
  readonly ddSelect = signal('de');
  readonly ddEmpty = signal<string | null>('week');
  readonly ddKept = signal('week');

  onDdTab(value: string | number | undefined): void {
    if (typeof value === 'string') this.ddTab.set(value);
  }

  // --- Playground ------------------------------------------------------------
  readonly countOptions = [
    { label: '2 options', value: 2 },
    { label: '3 options', value: 3 },
    { label: '4 options', value: 4 },
  ];
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgCount = signal(3);
  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgMultiple = signal(false);
  readonly pgAllowEmpty = signal(false);
  readonly pgFluid = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<string | null>('week');
  readonly pgMultiValue = signal<string[]>(['week']);

  private readonly pgPool = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  readonly pgOptions = computed(() => this.pgPool.slice(0, this.pgCount()));

  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  readonly pgReadout = computed(() => {
    if (this.pgMultiple()) {
      const v = this.pgMultiValue();
      return v.length ? JSON.stringify(v) : '[]';
    }
    const v = this.pgValue();
    return v === null || v === undefined ? 'null' : JSON.stringify(v);
  });

  readonly pgCode = computed(() => {
    const attrs: string[] = [
      '[ariaLabelledBy]="\'period-label\'"',
      '[options]="periodOptions()"',
      'optionLabel="label"',
      'optionValue="value"',
    ];
    if (this.pgMultiple()) attrs.push('[multiple]="true"');
    if (!this.pgAllowEmpty()) attrs.push('[allowEmpty]="false"');
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgFluid()) attrs.push('[fluid]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(ngModel)]="period"');
    return `<span class="field-label" id="period-label">{{ labels().period }}</span>\n<p-selectbutton\n  ${attrs.join('\n  ')} />`;
  });

  // --- Examples --------------------------------------------------------------
  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'canonical',
      title: 'The canonical case: one of three, always answered',
      note: 'Three short nouns, one line, and allowEmpty turned off so the value can never go null.',
      code: `<span class="field-label" id="period-label">Period</span>
<p-selectbutton
  [ariaLabelledBy]="'period-label'"
  [options]="periodOptions()"
  optionLabel="label"
  optionValue="value"
  [allowEmpty]="false"
  [(ngModel)]="period" />`,
    },
    {
      id: 'three',
      title: 'A density switch',
      note: 'The same shape driving a display setting instead of a filter.',
      code: `<p-selectbutton
  [ariaLabelledBy]="'density-label'"
  [options]="densityOptions()"
  optionLabel="label"
  optionValue="value"
  [allowEmpty]="false"
  [(ngModel)]="density" />`,
    },
    {
      id: 'multiple',
      title: 'Multiple mode',
      note: 'The model is an array and each segment toggles on its own. Five segments is already at the edge of what a row carries.',
      code: `<p-selectbutton
  [ariaLabelledBy]="'days-label'"
  [options]="dayOptions()"
  optionLabel="label"
  optionValue="value"
  [multiple]="true"
  [(ngModel)]="days" />`,
    },
    {
      id: 'item',
      title: 'Custom segment content',
      note: 'The #item template replaces a segment body. Icons are decorative here, so the label stays.',
      code: `<p-selectbutton
  [ariaLabelledBy]="'align-label'"
  [options]="alignOptions()"
  optionLabel="label"
  optionValue="value"
  [allowEmpty]="false"
  [(ngModel)]="align">
  <ng-template #item let-option>
    <i [class]="option.icon" aria-hidden="true"></i>
    <span>{{ option.label }}</span>
  </ng-template>
</p-selectbutton>`,
    },
    {
      id: 'sizes',
      title: 'Sizes: small, default, large',
      note: 'The size input moves the font-size and nothing else — the padding is identical in all three.',
      code: `<p-selectbutton size="small" … />
<p-selectbutton … />
<p-selectbutton size="large" … />`,
    },
    {
      id: 'fluid',
      title: 'Full width with equal segments',
      note: 'fluid puts width:100% on the group and flex:1 on every segment. Resize the window and the thirds stay equal.',
      code: `<p-selectbutton
  [fluid]="true"
  [ariaLabelledBy]="'density-label'"
  [options]="densityOptions()"
  optionLabel="label"
  optionValue="value"
  [allowEmpty]="false"
  [(ngModel)]="density" />`,
    },
    {
      id: 'states',
      title: 'One disabled option, an invalid group, a disabled group',
      note: 'Top: optionDisabled marks "Legacy" unusable — tab into the group and note that it still takes focus. Middle: [invalid] draws a 1px outline and announces nothing. Bottom: the whole group disabled.',
      code: `<p-selectbutton … optionDisabled="soldOut" [allowEmpty]="false" [(ngModel)]="plan" />
<p-selectbutton … [invalid]="true" [(ngModel)]="period" />
<p-selectbutton … [disabled]="true" [allowEmpty]="false" [(ngModel)]="period" />`,
    },
  ];

  /**
   * Measured values and code samples referenced from the tabs.
   *
   * Contrast ratios are quoted from the contrast gate; heights are computed from
   * the rendered examples on this page in both modes. The token sources are
   * cited beside each table.
   */
  readonly m = {
    // All from docs/generated/CONTRAST.MD, werkbund, "togglebutton & selectbutton";
    // the pill and the pressed label are ranges over the ten accents.
    pressedContrastLight: '4.42–15.25:1',
    pressedContrastDark: '5.44–14.39:1',
    labelContrastLight: '6.65:1',
    labelContrastDark: '5.91:1',
    pressedLabelLight: '5.18–17.85:1',
    pressedLabelDark: '6.07–16.06:1',
    // Rendered heights on the Aura 2.x togglebutton tokens (root 0.25rem, content
    // 0.25/0.75rem, sm 0.875rem / default 1rem / lg 1.125rem) with Aura's 1px border.
    hSmall: '≈37px',
    hDefault: '≈39px',
    hLarge: '≈42px',
    focusOutline: '2px solid, in the accent foreground (--primary-color-fg)',
    focusOffset: '2px',

    devImport: `import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';

@Component({
  standalone: true,
  imports: [SelectButtonModule, FormsModule],
  // ...
})`,

    itemSnippet: `<p-selectbutton [options]="alignOptions()" optionLabel="label" optionValue="value"
  [allowEmpty]="false" [(ngModel)]="align">
  <ng-template #item let-option let-i="index">
    <i [class]="option.icon" aria-hidden="true"></i>
    <span>{{ option.label }}</span>
  </ng-template>
</p-selectbutton>`,

    formSnippet: `// The value accessor binds, but nothing lands in a native submit:
// read the value off the form, not off FormData.
form = new FormGroup({
  period: new FormControl<'day' | 'week' | 'month'>('week', { nonNullable: true }),
});

// template
<p-selectbutton formControlName="period" [options]="periodOptions()"
  optionLabel="label" optionValue="value" [allowEmpty]="false"
  [ariaLabelledBy]="'period-label'" />`,

    i18nSnippet: `// labels() and periodOptions() are computed() off the kit's TranslationService,
// so both the caption and the segments follow a language switch.
readonly periodOptions = computed(() => [
  { label: this.t('report.period.day'), value: 'day' },
  { label: this.t('report.period.week'), value: 'week' },
  { label: this.t('report.period.month'), value: 'month' },
]);

// template
<span class="field-label" id="period-label">{{ labels().period }}</span>
<p-selectbutton [ariaLabelledBy]="'period-label'" [options]="periodOptions()"
  optionLabel="label" optionValue="value" [allowEmpty]="false"
  [(ngModel)]="period" />`,

    testSnippet: `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';

@Component({
  standalone: true,
  imports: [SelectButtonModule, FormsModule],
  template: \`<p-selectbutton [options]="options" optionLabel="label"
    optionValue="value" [ngModel]="value()" (ngModelChange)="value.set($event)" />\`,
})
class HostComponent {
  options = [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }];
  value = signal<string | null>('week');
}

describe('p-selectbutton semantics', () => {
  it('exposes each option as a pressed-state button, not a radio', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll('p-togglebutton');
    expect(segments.length).toBe(2);
    expect(segments[0].getAttribute('role')).toBe('button');
    expect(segments[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('clears the model when the pressed segment is clicked (allowEmpty default)', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const pressed = fixture.nativeElement.querySelectorAll('p-togglebutton')[1];
    pressed.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBeNull();
  });
});`,
  };

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
