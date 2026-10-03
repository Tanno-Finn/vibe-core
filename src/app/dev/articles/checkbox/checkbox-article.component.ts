import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Checkbox (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the three things people get wrong about
 * checkboxes: choosing between checkbox / radio / switch, naming a checkbox
 * GROUP, and the `indeterminate` state.
 *
 * VERIFIED FACTS (measured, not believed — provenance quoted in the tabs):
 *   - p-checkbox DOES render a real `<input type="checkbox">`
 *     (@openng/optimus-ui/fesm2022/openng-optimus-ui-checkbox.mjs:316-335). That is the decisive
 *     contrast with p-select: `<label for>` + `inputId` is a WORKING naming
 *     pattern here, measured through Chrome's accessibility tree.
 *   - `[attr.aria-label]` on the <p-checkbox> HOST is still ignored — the host
 *     carries no role; the attribute must reach the input via the `ariaLabel`
 *     INPUT (bound at :328).
 *   - INDETERMINATE IS COSMETIC. The component renders a minus glyph
 *     (`svg[data-p-icon=minus]`, :347) and forces `checked` to false (:210-212 —
 *     a plain getter in Optimus, where PrimeNG 22 had a `computed()`),
 *     but it never sets the input's `indeterminate` IDL property and never emits
 *     `aria-checked="mixed"` (the string does not occur in the file). Measured: the
 *     accessibility tree reports the control as UNCHECKED while the minus is on
 *     screen. It is also never submitted — a native form serializes an
 *     unchecked box as nothing at all.
 *   - `[indeterminate]` is a plain @Input mirrored into a signal by `ngOnChanges`
 *     (:240-244; PrimeNG 22 used a constructor effect) and cleared inside
 *     `updateModel` (:273-275), so the bound value and the internal signal can
 *     desynchronize after a click.
 *   - `readonly` sets `[attr.readonly]` on the input (:325). `readonly` is not a
 *     valid attribute for a checkbox, so the browser still toggles the box; only
 *     `handleChange` (:278-282) declines to update the model.
 *   - FOCUS INDICATOR: the checkbox reads the GLOBAL `{focus.ring.*}` tokens
 *     (@openng/optimus-ui-themes/dist/aura/checkbox/index.mjs → width 1px, style solid,
 *     color {primary.color}, offset 2px from .../aura/base/index.mjs), NOT the
 *     zeroed `form.field.focusRing` the select inherits. The kit-wide
 *     styles.scss rule `.p-checkbox:has(.p-checkbox-input:focus-visible)
 *     .p-checkbox-box` overrides that to the kit standard: 2px solid
 *     --primary-color-fg at 2px offset, !important. Browser-measured
 *     2026-08-23, both themes; not re-measured on Optimus.
 *   - GROUPING: Optimus ships no checkbox group. `<fieldset>`+`<legend>` and
 *     `role="group"`+`aria-labelledby` each expose a named group node owning
 *     the boxes; a heading above them exposes none.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-checkbox-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    CheckboxModule,
    RadioButtonModule,
    SelectModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'checkbox'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-checkbox</code>. Unlike <code>p-select</code>, this component renders an
          actual <code>&lt;input type="checkbox"&gt;</code>, so the plain HTML habits work:
          <code>&lt;label for&gt;</code> names it, clicking the label toggles it, and <kbd>Space</kbd> is the activation
          key. Start in the playground, then read the three sections that follow it — sizes, groups, and the
          <code>indeterminate</code> state that is not what it looks like.
        </p>

        <!-- Mini playground: live-configure a checkbox and read back the markup. -->
        <section class="pg" aria-label="Checkbox playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

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
                <label for="pg-indeterminate">Indeterminate</label>
                <p-toggleswitch
                  inputId="pg-indeterminate"
                  [ngModel]="pgIndeterminate()"
                  (ngModelChange)="pgIndeterminate.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-invalid">Invalid</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-readonly">Readonly</label>
                <p-toggleswitch
                  inputId="pg-readonly"
                  [ngModel]="pgReadonly()"
                  (ngModelChange)="pgReadonly.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-icon">Custom icon</label>
                <p-toggleswitch inputId="pg-icon" [ngModel]="pgIcon()" (ngModelChange)="pgIcon.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <div class="cb-row">
                  <p-checkbox
                    id="pg-preview-cb"
                    inputId="pg-preview"
                    [binary]="true"
                    [size]="pgSizeInput()"
                    [indeterminate]="pgIndeterminate()"
                    [disabled]="pgDisabled()"
                    [invalid]="pgInvalid()"
                    [readonly]="pgReadonly()"
                    [checkboxIcon]="pgIcon() ? 'pi pi-bolt' : undefined"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                  <label for="pg-preview">Send me the release notes</label>
                </div>
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

        <!-- Sizes; the Design tab carries the numbers. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The three sizes, side by side</h3>
            <button type="button" class="copy-btn" (click)="copy('sizes', sizesCode)">
              {{ copiedId() === 'sizes' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            None of the three reaches the 24&nbsp;px minimum target size on its own — the clickable
            <code>&lt;label&gt;</code> next to it is what rescues that. The Design tab has the numbers.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="cb-row">
                <p-checkbox
                  id="sz-small"
                  inputId="sz-small-in"
                  size="small"
                  [binary]="true"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
                <label for="sz-small-in">Small</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  id="sz-normal"
                  inputId="sz-normal-in"
                  [binary]="true"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
                <label for="sz-normal-in">Default</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  id="sz-large"
                  inputId="sz-large-in"
                  size="large"
                  [binary]="true"
                  [ngModel]="szLarge()"
                  (ngModelChange)="szLarge.set($event)"
                />
                <label for="sz-large-in">Large</label>
              </div>
            </div>
          </div>
          <pre class="code-block"><code>{{ sizesCode }}</code></pre>
        </section>

        <!-- A group bound to ONE array. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">A group bound to one array</h3>
            <button type="button" class="copy-btn" (click)="copy('group-array', groupArrayCode)">
              {{ copiedId() === 'group-array' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            No <code>[binary]</code>: each box carries a <code>value</code> and they all bind the same array. Optimus
            adds and removes the value for you. The <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> is what
            gives the four boxes a shared name.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group" id="ex-channels">
              <legend>Notify me about</legend>
              @for (ch of channels; track ch.value) {
                <div class="cb-row">
                  <p-checkbox
                    [inputId]="'ch-' + ch.value"
                    [value]="ch.value"
                    [ngModel]="exChannels()"
                    (ngModelChange)="exChannels.set($event)"
                  />
                  <label [for]="'ch-' + ch.value">{{ ch.label }}</label>
                </div>
              }
            </fieldset>
          </div>
          <p class="ex__note">
            Model right now: <code>{{ exChannelsText() }}</code>
          </p>
          <pre class="code-block"><code>{{ groupArrayCode }}</code></pre>
        </section>

        <!-- A group of independent booleans. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">…or a group of independent booleans</h3>
            <button type="button" class="copy-btn" (click)="copy('group-bool', groupBoolCode)">
              {{ copiedId() === 'group-bool' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Same visual, different model. Use this when the answers are not one set: when each flag has its own meaning,
            its own default, and its own destination in the payload.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group">
              <legend>Account</legend>
              <div class="cb-row">
                <p-checkbox
                  inputId="bl-terms"
                  [binary]="true"
                  [ngModel]="blTerms()"
                  (ngModelChange)="blTerms.set($event)"
                />
                <label for="bl-terms">I accept the terms</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  inputId="bl-public"
                  [binary]="true"
                  [ngModel]="blPublic()"
                  (ngModelChange)="blPublic.set($event)"
                />
                <label for="bl-public">Make my profile public</label>
              </div>
            </fieldset>
          </div>
          <pre class="code-block"><code>{{ groupBoolCode }}</code></pre>
        </section>

        <!-- Indeterminate: the parent/child case. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Indeterminate: the parent of a partly-checked set</h3>
            <button type="button" class="copy-btn" (click)="copy('indeterminate', indeterminateCode)">
              {{ copiedId() === 'indeterminate' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The one honest use of <code>indeterminate</code>: a "select all" box whose children disagree. Tick one child
            and watch the parent. Then read the Development tab, because what you see is <strong>not</strong> what a
            screen reader hears.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group">
              <legend>Analytics events</legend>
              <div class="cb-row">
                <p-checkbox
                  inputId="tree-all"
                  [binary]="true"
                  [indeterminate]="treeSome()"
                  [ngModel]="treeAll()"
                  (ngModelChange)="setAllEvents($event)"
                />
                <label for="tree-all"><strong>All events</strong></label>
              </div>
              <div class="cb-children">
                @for (ev of events; track ev.key) {
                  <div class="cb-row">
                    <p-checkbox
                      [inputId]="'tree-' + ev.key"
                      [binary]="true"
                      [ngModel]="treeState()[ev.key]"
                      (ngModelChange)="setEvent(ev.key, $event)"
                    />
                    <label [for]="'tree-' + ev.key">{{ ev.label }}</label>
                  </div>
                }
              </div>
            </fieldset>
          </div>
          <p class="ex__note">
            Parent state right now: <code>{{ treeStateText() }}</code>
          </p>
          <pre class="code-block"><code>{{ indeterminateCode }}</code></pre>
        </section>

        <!-- trueValue / falseValue. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Non-boolean values: trueValue / falseValue</h3>
            <button type="button" class="copy-btn" (click)="copy('truefalse', trueFalseCode)">
              {{ copiedId() === 'truefalse' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            When the backend wants <code>'yes'</code> / <code>'no'</code> rather than <code>true</code> /
            <code>false</code>, keep the mapping in the template instead of translating it in three places.
          </p>
          <div class="ex__stage">
            <div class="cb-row">
              <p-checkbox
                inputId="tv-box"
                [binary]="true"
                trueValue="yes"
                falseValue="no"
                [ngModel]="tvValue()"
                (ngModelChange)="tvValue.set($event)"
              />
              <label for="tv-box">Subscribe to the digest</label>
            </div>
            <p class="ex__note">
              Model: <code>'{{ tvValue() }}'</code>
            </p>
          </div>
          <pre class="code-block"><code>{{ trueFalseCode }}</code></pre>
        </section>

        <!-- States. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Disabled, invalid, readonly</h3>
            <button type="button" class="copy-btn" (click)="copy('states', statesCode)">
              {{ copiedId() === 'states' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Three states that look similar and behave very differently — especially
            <code>readonly</code>, which is not a real HTML state for a checkbox. The Development tab has the
            measurement.
          </p>
          <div class="ex__stage">
            <div class="cb-row">
              <p-checkbox inputId="st-disabled" [binary]="true" [disabled]="true" [ngModel]="true" />
              <label for="st-disabled">Disabled, checked</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="st-disabled2" [binary]="true" [disabled]="true" [ngModel]="false" />
              <label for="st-disabled2">Disabled, unchecked</label>
            </div>
            <div class="cb-row">
              <p-checkbox
                inputId="st-invalid"
                [binary]="true"
                [invalid]="true"
                [ngModel]="stInvalid()"
                (ngModelChange)="stInvalid.set($event)"
              />
              <label for="st-invalid">Invalid (required, not ticked)</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="st-readonly" [binary]="true" [readonly]="true" [ngModel]="false" />
              <label for="st-readonly">Readonly</label>
            </div>
          </div>
          <pre class="code-block"><code>{{ statesCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Checkbox, radio, or switch?</h3>
        <p>
          Three controls, three different questions. The mistake is almost never "which one looks better" — it is asking
          the wrong question in the first place. Decide on
          <strong>how many answers are allowed</strong> and <strong>when the answer takes effect</strong>, and the
          control falls out.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Answers the question</th>
                <th>Selection</th>
                <th>When it takes effect</th>
                <th>Needs a group name</th>
                <th>Empty state</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-checkbox</code></td>
                <td>"Which of these apply?" — or, alone, "is this true?"</td>
                <td><strong>Zero to many</strong>, independent</td>
                <td>On submit / apply — the page does not move under the user</td>
                <td>Yes, when there is more than one</td>
                <td>Legal: nothing ticked is a valid answer</td>
              </tr>
              <tr>
                <td><code>p-radiobutton</code></td>
                <td>"Which <em>one</em>?"</td>
                <td><strong>Exactly one</strong>, mutually exclusive</td>
                <td>On submit / apply</td>
                <td>Yes, always — a lone radio is a bug</td>
                <td>Should be pre-selected; a radio cannot be un-picked</td>
              </tr>
              <tr>
                <td><code>p-toggleswitch</code></td>
                <td>"Turn this on or off — now."</td>
                <td>One boolean</td>
                <td><strong>Immediately</strong>, with visible consequence</td>
                <td>No — it names itself</td>
                <td>Always on or off; there is no third state</td>
              </tr>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>"Which one, out of 2–4 short options?"</td>
                <td>One (or many with <code>[multiple]</code>)</td>
                <td>Usually immediately — it is a view filter</td>
                <td>Yes</td>
                <td>Configurable with <code>[allowEmpty]</code></td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>"Which of these <em>many</em> apply?"</td>
                <td>Zero to many, behind an overlay</td>
                <td>On submit / apply</td>
                <td>Yes — the trigger needs a name</td>
                <td>Legal, shown as a placeholder</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> "Selection", "empty state" and the group-name column are
          behavior read from the Optimus&nbsp;UI 2.0.2 sources in <code>node_modules</code> and from the ARIA
          specification.
          "When it takes effect" is a <em>convention</em>, not a measurement — it is the checkbox/switch distinction the
          platform HIGs settled on, and it is the one that decides most arguments. The single hard rule underneath it: a
          control whose effect is instant must not sit inside a form the user still has to submit.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — checkboxes for an exclusive choice</span>
            <div class="dd__stage">
              <div class="cb-col">
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-x-monthly"
                    [binary]="true"
                    [ngModel]="ddExMonthly()"
                    (ngModelChange)="ddExMonthly.set($event)"
                  />
                  <label for="dd-x-monthly">Billed monthly</label>
                </div>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-x-yearly"
                    [binary]="true"
                    [ngModel]="ddExYearly()"
                    (ngModelChange)="ddExYearly.set($event)"
                  />
                  <label for="dd-x-yearly">Billed yearly</label>
                </div>
              </div>
            </div>
            <p class="dd__why">
              Tick both — the control lets you, because a checkbox has no concept of a sibling. The exclusivity then has
              to be re-implemented in TypeScript, and a screen reader is still told "checkbox, 1 of 2", not "radio
              button, 1 of 2".
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — radio buttons, in a named group</span>
            <div class="dd__stage">
              <fieldset class="cb-group cb-group--tight">
                <legend>Billing period</legend>
                <div class="cb-row">
                  <p-radiobutton
                    inputId="dd-r-monthly"
                    name="dd-billing"
                    value="monthly"
                    [ngModel]="ddBilling()"
                    (ngModelChange)="ddBilling.set($event)"
                  />
                  <label for="dd-r-monthly">Billed monthly</label>
                </div>
                <div class="cb-row">
                  <p-radiobutton
                    inputId="dd-r-yearly"
                    name="dd-billing"
                    value="yearly"
                    [ngModel]="ddBilling()"
                    (ngModelChange)="ddBilling.set($event)"
                  />
                  <label for="dd-r-yearly">Billed yearly</label>
                </div>
              </fieldset>
            </div>
            <p class="dd__why">
              The <code>name</code> makes the two a radio group in the browser's own model: exclusivity, arrow-key
              navigation and the "1 of 2" announcement come for free.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a checkbox that acts immediately</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-checkbox
                  inputId="dd-inst-bad"
                  [binary]="true"
                  [ngModel]="ddInstant()"
                  (ngModelChange)="ddInstant.set($event)"
                />
                <label for="dd-inst-bad">High contrast</label>
              </div>
            </div>
            <p class="dd__why">
              A checkbox reads as "part of a form I will submit". When it instead changes the app on the spot, the user
              has no <em>Cancel</em>, and the tick mark is a weak signal of a state that is now live.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a switch for an instant setting</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-toggleswitch
                  inputId="dd-inst-good"
                  [ngModel]="ddInstant()"
                  (ngModelChange)="ddInstant.set($event)"
                />
                <label for="dd-inst-good">High contrast</label>
              </div>
            </div>
            <p class="dd__why">
              The switch's whole visual language is "on / off, right now", and the thumb travels so the change is
              legible without reading. Same model, correct promise.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a group whose name is only a heading</span>
            <div class="dd__stage">
              <div class="cb-col" id="dd-group-bad">
                <span class="pg__label">Notify me about</span>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-gb-email"
                    [binary]="true"
                    [ngModel]="ddGroupBad()"
                    (ngModelChange)="ddGroupBad.set($event)"
                  />
                  <label for="dd-gb-email">Email</label>
                </div>
                <div class="cb-row">
                  <p-checkbox inputId="dd-gb-push" [binary]="true" [ngModel]="false" />
                  <label for="dd-gb-push">Push</label>
                </div>
              </div>
            </div>
            <p class="dd__why">
              A sighted user reads the caption above the boxes. A screen-reader user tabbing straight to the second box
              hears only "Push" — the shared context is a visual accident, not a relationship. It is the default shape a
              filter panel or a settings block falls into, because the caption already looks like it does the job.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — fieldset + legend</span>
            <div class="dd__stage">
              <fieldset class="cb-group cb-group--tight" id="dd-group-good">
                <legend>Notify me about</legend>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-gg-email"
                    [binary]="true"
                    [ngModel]="ddGroupGood()"
                    (ngModelChange)="ddGroupGood.set($event)"
                  />
                  <label for="dd-gg-email">Email</label>
                </div>
                <div class="cb-row">
                  <p-checkbox inputId="dd-gg-push" [binary]="true" [ngModel]="false" />
                  <label for="dd-gg-push">Push</label>
                </div>
              </fieldset>
            </div>
            <p class="dd__why">
              In the accessibility tree the <code>&lt;fieldset&gt;</code> exposes a <strong>group</strong> node named
              <strong>"Notify me about"</strong> that owns both checkboxes. The name is announced when focus enters the
              group.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — aria-label on the &lt;p-checkbox&gt; host</span>
            <div class="dd__stage">
              <p-checkbox
                id="dd-name-bad"
                [attr.aria-label]="'Accept the terms'"
                [binary]="true"
                [ngModel]="ddName()"
                (ngModelChange)="ddName.set($event)"
              />
            </div>
            <p class="dd__why">
              Measured accessible name: <strong>{{ ddNameBadMeasured }}</strong
              >. The attribute lands on the <code>&lt;p-checkbox&gt;</code> element, which has no role at all; the
              focusable <code>&lt;input&gt;</code> inside it never sees it. Exactly the trap the Select guide documents
              — and the only one that carries over.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — &lt;label for&gt; + inputId</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-checkbox
                  inputId="dd-name-good"
                  [binary]="true"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
                <label for="dd-name-good">Accept the terms</label>
              </div>
            </div>
            <p class="dd__why">
              Measured accessible name: <strong>"Accept the terms"</strong>. A real
              <code>&lt;input type="checkbox"&gt;</code> <em>is</em> a labelable element, so the pattern that fails on
              <code>p-select</code> is the correct one here — and it makes the label text a second, larger click target.
            </p>
          </div>
        </div>

        <h3>Writing the label</h3>
        <ul>
          <li>
            <strong>Positive phrasing.</strong> "Send me the newsletter", not "Do not send me the newsletter" — a ticked
            negative is a double negative, and users get it wrong.
          </li>
          <li>
            <strong>One statement per box.</strong> "I accept the terms and the privacy policy" is two consents behind
            one tick; regulators and users both dislike it.
          </li>
          <li>
            <strong>The label is the whole sentence, not a suffix.</strong> Put every word inside the
            <code>&lt;label&gt;</code>: text that sits outside it is neither announced with the control nor clickable.
          </li>
          <li>
            <strong>Do not pre-tick a consent.</strong> A checkbox that ships checked is a default, and a default is not
            a decision.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Checkbox pattern</a
            >
            — the roles/states contract this guide checks the component against, including the tri-state variant and the
            requirement that a mixed checkbox expose
            <code>aria-checked="mixed"</code>. It is the reference for the indeterminate finding in the Development tab.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-checked" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-checked</code></a
            >
            — defines <code>mixed</code> as a first-class value and says it applies to <code>checkbox</code>; the
            yardstick for "the minus glyph is not a state".
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG HTML — the Checkbox state</a
            >
            — the normative text for the <code>indeterminate</code> IDL attribute ("does not affect the result of form
            submission") and for why an unchecked box contributes no entry at all. Both claims in the Development tab
            trace here.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — the list of <em>labelable</em> elements. <code>&lt;input&gt;</code> is on it, which is the mechanism
            behind the working name here and the failing one on <code>p-select</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.1 Info and Relationships</a
            >
            — the criterion a checkbox group fails when its name is only a visually adjacent heading; the basis of the
            fieldset/legend do-don't pair.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24&nbsp;px floor the rendered box misses in all three sizes, and the "inline exception" that a
            clickable label does not automatically buy you.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 for control boundaries and states; the yardstick for the measured unchecked-border and checked-fill
            contrasts in the Design tab.
          </li>
          <li>
            <a href="https://optimus.openng.org/checkbox/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Checkbox component</a
            >
            — the vendor API surface this guide maps onto the kit's conventions and then verifies against the shipped
            source in <code>node_modules</code>.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>A <code>p-checkbox</code> is three elements deep, and the one you see is not the one you interact with:</p>
        <ul>
          <li>
            <strong>Root</strong> — the <code>&lt;p-checkbox&gt;</code> host, class <code>p-checkbox p-component</code>,
            <code>position: relative</code>, <code>display: inline-flex</code>, sized exactly to the box. It carries the
            state classes (<code>p-checkbox-checked p-highlight</code>, <code>p-disabled</code>, <code>p-invalid</code>,
            <code>p-variant-filled</code>) and the <code>data-p-checked</code> /
            <code>data-p-disabled</code> attributes. It has <strong>no role</strong> — nothing you put on it reaches
            assistive technology.
          </li>
          <li>
            <strong>Input</strong> — a genuine <code>&lt;input type="checkbox" class="p-checkbox-input"&gt;</code>,
            absolutely positioned over the whole root at <code>opacity: 0</code>, <code>z-index: 1</code>,
            <code>cursor: pointer</code>. This is the focusable, labelable, form-participating element. Everything
            accessibility-related belongs here.
          </li>
          <li>
            <strong>Box</strong> — <code>div.p-checkbox-box</code>, the thing you actually see: border, radius,
            background, and the transition.
          </li>
          <li>
            <strong>Icon</strong> — an inline <code>&lt;svg&gt;</code> inside the box:
            <code>data-p-icon="check"</code> when checked, <code>data-p-icon="minus"</code> when indeterminate.
            Replaceable by <code>checkboxIcon</code> (an icon class) or by a <code>#icon</code> template.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-checkbox.mjs</code> (the template at 312-341: the input at
          312-331, the box <code>div</code> at 332, the check <code>svg</code> at 336, the minus <code>svg</code> at
          338) and from the shipped stylesheet <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code> (<code
            >.p-checkbox-input &#123; opacity: 0; position: absolute; inset: 0; width: 100%; height: 100% &#125;</code
          >), and confirmed against computed style.
        </p>

        <h3>Size scale — tokens and measured boxes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>default</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-checkbox-width</code> / <code>-height</code></td>
                <td>1rem (16px)</td>
                <td>1.25rem (20px)</td>
                <td>1.5rem (24px)</td>
              </tr>
              <tr>
                <td><strong>box</strong> (token-derived)</td>
                <td>
                  <strong>{{ m.boxSmall }}</strong>
                </td>
                <td>
                  <strong>{{ m.boxNormal }}</strong>
                </td>
                <td>
                  <strong>{{ m.boxLarge }}</strong>
                </td>
              </tr>
              <tr>
                <td><strong>hit area</strong> (the input overlay, token-derived)</td>
                <td>
                  <strong>{{ m.hitSmall }}</strong>
                </td>
                <td>
                  <strong>{{ m.hitNormal }}</strong>
                </td>
                <td>
                  <strong>{{ m.hitLarge }}</strong>
                </td>
              </tr>
              <tr>
                <td><code>--p-checkbox-icon-size</code></td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
              </tr>
              <tr>
                <td>border-radius / border</td>
                <td colspan="3">{{ m.radius }} / 1px solid</td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">{{ m.transition }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token values from <code>&#64;openng/optimus-ui-themes/dist/aura/checkbox/index.mjs</code>
          (<code>width: '1.25rem'</code>, <code>sm: &#123; width: '1rem' &#125;</code>,
          <code>lg: &#123; width: '1.5rem' &#125;</code>); box and hit area are token-derived. The radius follows the
          active visual style's radius scale (<code>presetOverrides</code> in
          <code>src/app/services/ui-styles.ts</code>).
        </p>
        <p class="src-note">
          <strong>Target size is the finding here.</strong> WCAG 2.2 SC 2.5.8 asks for a 24&nbsp;×&nbsp;24&nbsp;px
          target. The hit area is the input overlay, which is exactly the size of the box — and on the 16 / 20 /
          24&nbsp;px scale <strong>only <code>large</code> reaches it</strong>, exactly, at 24&nbsp;×&nbsp;24;
          <code>small</code> and the default miss. There are two honest fixes: pair every checkbox with a
          <code>&lt;label for&gt;</code> (a second, much larger target — the pattern every example here uses), or give
          the row padding and enlarge the input overlay. Do not solve it by making the visible box bigger;
          20&nbsp;px is the intended visual weight at the default size.
        </p>

        <h3>Interaction states — both themes</h3>
        <p>
          Unlike the select, the checkbox's colors are <strong>not</strong> overridden by the kit: the one
          <code>styles.scss</code> checkbox rule is the focus ring (<code>.p-checkbox:has(…:focus-visible)</code>).
          Everything else is Aura's token layer, fed by the active visual style's surface scale and the accent's
          primary ramp — so the table names tokens, not colors.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token layer</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>rest</td>
                <td>
                  1px <code>--p-checkbox-border-color</code>, re-pointed by <code>styles.scss</code> to the kit's
                  <code>--control-border</code>, on <code>&#123;form.field.background&#125;</code>
                </td>
                <td>border {{ m.restBorderLight }}</td>
                <td>border {{ m.restBorderDark }}</td>
              </tr>
              <tr>
                <td>checked</td>
                <td>
                  background and border <code>&#123;primary.color&#125;</code>, glyph
                  <code>&#123;primary.contrast.color&#125;</code>
                </td>
                <td>fill {{ m.checkedBgLight }}, glyph {{ m.checkedIconLight }}</td>
                <td>fill {{ m.checkedBgDark }}, glyph {{ m.checkedIconDark }}</td>
              </tr>
              <tr>
                <td>hover</td>
                <td>
                  <code>:has(.p-checkbox-input:hover)</code> → border
                  <code>&#123;form.field.hover.border.color&#125;</code>; checked → the primary hover color
                </td>
                <td colspan="2">
                  A <code>:has()</code> selector on the root, so the hover target is the transparent input overlay — the
                  box reacts even though the pointer is over the input, not the box.
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <code>:has(.p-checkbox-input:focus-visible)</code> → an <strong>outline</strong> from the GLOBAL
                  <code>&#123;focus.ring.*&#125;</code> tokens (1px solid <code>&#123;primary.color&#125;</code>, offset
                  2px), not from the zeroed <code>form.field.focusRing</code> that the select inherits — overridden
                  by the kit's <code>styles.scss</code> <code>:has()</code> rule to 2px solid
                  <code>--primary-color-fg</code>
                </td>
                <td>outline {{ m.focusOutlineLight }}</td>
                <td>outline {{ m.focusOutlineDark }}</td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>
                  <code>opacity: 1</code> plus <code>&#123;form.field.disabled.background&#125;</code> and a muted glyph
                  — <em>not</em> the global 0.6 disabled opacity that buttons use
                </td>
                <td colspan="2">{{ m.disabledNote }}</td>
              </tr>
              <tr>
                <td>invalid</td>
                <td>
                  <code>.p-checkbox.p-invalid &gt; .p-checkbox-box</code> → border
                  <code>--p-checkbox-invalid-border-color</code> (kit: <code>--semantic-red-fg</code>). Optimus adds a second rule for
                  <code>.ng-invalid.ng-dirty</code>.
                </td>
                <td colspan="2">
                  A 1px border-color change and nothing else — never the only signal. Pair it with an error message and
                  <code>[attr.aria-describedby]</code> on a wrapper you control.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Measuring these in your style:</strong> read computed style on <code>.p-checkbox-box</code>, and
          reach the focus state with the keyboard, or <code>:focus-visible</code> does not apply and the ring is not
          there. Rules from
          <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code>; token definitions from
          <code>&#64;openng/optimus-ui-themes/dist/aura/checkbox/index.mjs</code> and the global <code>focusRing</code> block in
          <code>&#8230;/aura/base/index.mjs</code> (<code
            >width: '1px', style: 'solid', color: '&#123;primary.color&#125;', offset: '2px'</code
          >).
        </p>

        <h3>Contrast in the kit's styles (gated)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light (4 styles × 10 accents)</th>
                <th>Dark (4 styles × 10 accents)</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Unchecked border vs the surface behind it</td>
                <td>{{ m.contrastRestBorderLight }}</td>
                <td>{{ m.contrastRestBorderDark }}</td>
                <td>3:1 (SC 1.4.11 — the boundary is the only thing that says "control here")</td>
              </tr>
              <tr>
                <td>Checked fill vs the surface behind it</td>
                <td>{{ m.contrastCheckedLight }}</td>
                <td>{{ m.contrastCheckedDark }}</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>Check glyph vs the checked fill</td>
                <td>{{ m.contrastGlyphLight }}</td>
                <td>{{ m.contrastGlyphDark }}</td>
                <td>3:1 (it is the state indicator)</td>
              </tr>
              <tr>
                <td>Focus outline vs the surface behind it</td>
                <td>{{ m.contrastFocusLight }}</td>
                <td>{{ m.contrastFocusDark }}</td>
                <td>3:1 (SC 1.4.11, focus indicator)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ranges over every style and accent, quoted from the "checkbox &amp; radiobutton" rows of
          <code>docs/generated/CONTRAST.MD</code> — <code>checkbox.border.color</code>,
          <code>&lt;accent&gt;.primary.color</code>, <code>&lt;accent&gt;.checkbox.icon.checked.color</code> — and, for
          the ring, the "focus ring" rows (<code>&lt;accent&gt;.--primary-color-fg (kit focus ring)</code>). The
          gate recomputes them from the tokens on every build, so cite that file, not this table, when a number
          matters. The radiobutton edge and dot are the same pairs.
        </p>
        <p class="src-note">
          <strong>Why the unchecked box holds 3:1.</strong> Aura draws it in
          <code>&#123;form.field.border.color&#125;</code> (<code>surface.300</code>, 1.41:1 light / 1.34:1 dark on its
          stock palette) — an unticked box carries no other cue. The kit re-points <code>--p-checkbox-border-color</code>
          to <code>--control-border</code>, the control edge each style chooses to clear 3:1 on all of its surfaces;
          the empty fill no longer has to carry anything.
        </p>

        <h3>Layout: the row, not the box</h3>
        <p>
          The component sizes itself to the box and nothing else — no label, no gap, no row. The kit convention is a
          flex row:
        </p>
        <pre class="code-block"><code>{{ rowSnippet }}</code></pre>
        <p>
          Two details that are easy to get wrong. <strong>Alignment:</strong> use
          <code>align-items: flex-start</code> once a label can wrap to two lines, or the box floats to the vertical
          middle of the paragraph. <strong>Cursor:</strong> the label needs <code>cursor: pointer</code> of its own —
          the input's pointer cursor stops at the box.
        </p>
        <p>
          <strong>Narrow screens:</strong> the box has no responsive behavior — it keeps its token size at every
          viewport. What reflows is your row: the label wraps within the width the flex row leaves it, and
          <code>align-items: flex-start</code> keeps the box on the first line. A group has no layout of its own either: it stacks
          one row per box unless your markup says otherwise.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.2 (a real <code>&lt;input type="checkbox"&gt;</code>, named by
          <code>&lt;label for&gt;</code> plus <code>inputId</code>), SC 2.1.1 with the browser-native model — Tab per
          box, Space toggles — and SC 2.4.7 with the kit ring in <code>--primary-color-fg</code> in both themes (its
          ratios per style and accent are the "focus ring" rows of <code>docs/generated/CONTRAST.MD</code>).
          SC 1.4.11 on the unchecked edge, the checked fill and the glyph in every style and accent (gated, see the
          contrast table).
          <strong>Conditional:</strong> SC 2.5.8 — the hit area is the input overlay, 16 / 20 / 24 px, so only
          <code>large</code> is a
          24px target on its own and the clickable label carries the other two; and SC 1.3.1, where a group is a
          relationship only through <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> or
          <code>role="group"</code> with <code>aria-labelledby</code>, never through a heading placed above the boxes.
          <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>CheckboxModule</code> exports the <code>&lt;p-checkbox&gt;</code> component (also matched as
          <code>p-checkBox</code> and <code>p-check-box</code>). It is a <code>ControlValueAccessor</code>, so
          <code>[(ngModel)]</code> and reactive forms both work.
        </p>

        <h3>The two binding shapes</h3>
        <p>This is the decision that shapes the rest of the code, and Optimus makes it with a single flag:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>[binary]="true"</code></th>
                <th>default (<code>binary</code> unset)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Model</td>
                <td>One boolean per box</td>
                <td><strong>One array shared by every box in the group</strong></td>
              </tr>
              <tr>
                <td>Needs <code>value</code></td>
                <td>No</td>
                <td>Yes — it is the array member</td>
              </tr>
              <tr>
                <td>Toggling</td>
                <td><code>trueValue</code> ⇄ <code>falseValue</code></td>
                <td>Optimus pushes / filters <code>value</code> in the array for you</td>
              </tr>
              <tr>
                <td>Reach for it when</td>
                <td>The flags are independent: a consent, a preference, a single switch-like option in a form</td>
                <td>The answer <em>is</em> a set: "which categories", "which channels" — one field in the payload</td>
              </tr>
              <tr>
                <td>Watch out</td>
                <td>Nothing much</td>
                <td>
                  The array must exist. Starting from <code>null</code> works (Optimus creates one), starting from
                  <code>undefined</code> in a group whose first click is a de-select does not.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ bindingSnippet }}</code></pre>
        <p class="src-note">
          Read from <code>updateModel</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-checkbox.mjs:248-277</code>: the
          non-binary branch does <code>currentModelValue.filter(&#8230;)</code> when already checked and
          <code>[&#8230;currentModelValue, this.value]</code> otherwise (:257-267); the binary branch swaps
          <code>trueValue</code> / <code>falseValue</code> (plain properties, defaults <code>true</code> /
          <code>false</code>, :171, :176). The <code>checked</code> getter (:210-212) mirrors it —
          <code>contains(this.value, this.modelValue())</code> for a group, <code>modelValue() === trueValue</code> for
          a binary box.
        </p>

        <h3>Core inputs</h3>
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
                <td><code>binary</code></td>
                <td>boolean</td>
                <td>Switches the model shape (above). Unset means "array member".</td>
              </tr>
              <tr>
                <td><code>value</code></td>
                <td>any</td>
                <td>The array member for a group box. Also written to the input's <code>value</code> attribute.</td>
              </tr>
              <tr>
                <td><code>trueValue</code> / <code>falseValue</code></td>
                <td>any</td>
                <td>
                  Binary mode only. Defaults <code>true</code> / <code>false</code>; set them when the payload wants
                  <code>'yes'</code> / <code>'no'</code>.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  <strong>The id of the real input.</strong> This is what <code>&lt;label for&gt;</code> points at — and
                  unlike on <code>p-select</code>, it works.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Bound onto the input as <code>aria-label</code> / <code>aria-labelledby</code>. Use them only when a
                  visible label is genuinely impossible.
                </td>
              </tr>
              <tr>
                <td><code>indeterminate</code></td>
                <td>boolean</td>
                <td>
                  Draws a minus glyph and forces <code>checked</code> to false. <strong>Visual only</strong> — see
                  below.
                </td>
              </tr>
              <tr>
                <td><code>checkboxIcon</code></td>
                <td>string</td>
                <td>
                  An icon class replacing the check <code>&lt;svg&gt;</code>. Note it replaces the CHECK only; the
                  indeterminate minus is unaffected.
                </td>
              </tr>
              <tr>
                <td><code>readonly</code></td>
                <td>boolean</td>
                <td>
                  Blocks the model update in <code>handleChange</code>. It does <strong>not</strong> stop the browser
                  toggling the input — see the caveat below.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>boolean / string</td>
                <td>
                  From <code>BaseEditableHolder</code>. <code>required</code> renders the
                  <code>required</code> attribute; <code>name</code> renders <code>name</code>, which matters for native
                  submission.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Signal input; omit for the default.</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'filled' | 'outlined'</td>
                <td>
                  Signal input, falling back to the global <code>inputStyle</code> set in <code>app.config.ts</code>.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>
                  Lands on the input. <code>-1</code> makes the checkbox unreachable by keyboard — only correct if
                  something else in the row is focusable and does the job.
                </td>
              </tr>
              <tr>
                <td><code>inputClass</code> / <code>inputStyle</code></td>
                <td>string / object</td>
                <td>Applied to the transparent input — the lever for enlarging the hit area beyond the box.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Focus on init. Almost always wrong on a checkbox: it moves the reading position for everyone.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>
                  Present again on Optimus (<code>&#64;deprecated since v20</code>, :136); PrimeNG&nbsp;22 had removed
                  it. Use <code>class</code> anyway.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs verified against <code>&#64;openng/optimus-ui/types/openng-optimus-ui-checkbox.d.ts</code> (Optimus UI
          2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>) and the binding list in the component's
          <code>ɵcmp</code> declaration; <code>disabled</code> / <code>invalid</code> / <code>required</code> /
          <code>name</code> come from <code>openng-optimus-ui-baseeditableholder.d.ts</code>.
        </p>

        <h3>Outputs</h3>
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
                <td><code>CheckboxChangeEvent</code></td>
                <td>
                  The box was toggled. <code>$event.checked</code> is the <strong>new model value</strong> — for a group
                  that is the whole array, not a boolean. Read the type before you trust the name.
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>The input gained / lost focus. <code>onBlur</code> also marks the control touched.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>onChange.emit(&#123; checked: newModelValue, originalEvent: event &#125;)</code>
          at <code>openng-optimus-ui-checkbox.mjs:276</code> — the property is named <code>checked</code> but carries
          <code>newModelValue</code>, which in a group is the updated array.
        </p>

        <!-- ============ THE INDETERMINATE SECTION ============ -->
        <h3>Indeterminate: what it is, and the three things it is not</h3>
        <p>
          The legitimate use is a parent box over a set of children: all children ticked → parent checked; none → parent
          unchecked; some → parent <em>mixed</em>. The Examples tab renders exactly that. Wire it as a derived value,
          never as state you maintain by hand:
        </p>
        <pre class="code-block"><code>{{ indeterminateWireSnippet }}</code></pre>
        <p>Now the honest part.</p>
        <ol>
          <li>
            <strong>It is not a value.</strong> A checkbox has two values; the third state lives beside the value, not
            inside it. In Optimus the <code>checked</code> getter returns <code>false</code> whenever the internal
            indeterminate signal is set (<code>openng-optimus-ui-checkbox.mjs:210-212</code>), so the model reads as
            unticked
            while the minus is on screen.
          </li>
          <li>
            <strong>It is never submitted.</strong> Per the HTML specification the <code>indeterminate</code> IDL
            attribute "does not affect the result of form submission", and an unchecked checkbox contributes no entry at
            all. A mixed parent therefore sends <em>nothing</em>. Send the children.
          </li>
          <li><strong>In Optimus it is not announced either.</strong> {{ m.indeterminateA11y }}</li>
        </ol>
        <p class="src-note">
          <strong>Measured and read.</strong> The component renders
          <code>&lt;svg data-p-icon="minus"&gt;</code> inside an <code>&#64;if (_indeterminate())</code> block
          (<code>openng-optimus-ui-checkbox.mjs:346-348</code>) and binds <code>[checked]="checked"</code> on the input
          (:322) — but
          there is no <code>[indeterminate]</code> property binding anywhere in the file, and the string
          <code>aria-checked</code> does not occur in it at all. Read from the accessibility tree and the DOM property
          side by side:
          {{ m.indeterminateEvidence }}
        </p>
        <p>
          <strong>The workaround, and its cost.</strong> Set the DOM property and the ARIA state yourself on the real
          input. It is three lines, it is testable, and it is the only way the mixed state exists for anyone who is not
          looking at the screen:
        </p>
        <pre class="code-block"><code>{{ indeterminateFixSnippet }}</code></pre>
        <p class="src-note">
          This is a pattern to reach for, not a snippet lifted from production — written against the same
          <code>inputId</code> the component already gives you, so it costs nothing to adopt.
        </p>
        <p class="src-note">
          <strong>One more sharp edge.</strong> <code>indeterminate</code> is a plain <code>&#64;Input</code> whose
          value is copied into an internal signal in <code>ngOnChanges</code>
          (<code>openng-optimus-ui-checkbox.mjs:240-244</code>; PrimeNG&nbsp;22 did the same job in a constructor
          <code>effect</code>), and <code>updateModel</code> clears that
          signal after every click (:273-275). Because <code>ngOnChanges</code> only fires when the <em>bound</em> value
          changes, a binding that is still <code>true</code> after the click will not restore the state. Derive it from
          the children (as above) so the value genuinely flips, rather than pinning it to a constant.
        </p>

        <h3>Grouping: what actually carries the name</h3>
        <p>
          A lone checkbox names itself with its label. A <em>group</em> needs a second name — the question the boxes
          answer — and neither Optimus nor the checkbox itself provides one. There is no
          <code>p-checkbox-group</code> in Optimus&nbsp;UI 2.0.2 — the entry point exports <code>Checkbox</code>,
          <code>CheckboxModule</code>, <code>CheckboxClasses</code>, <code>CheckboxStyle</code> and the value accessor,
          and no group of any kind — so this is your markup. All three shapes below are rendered live, and measured:
        </p>
        <div class="ex__stage">
          <fieldset class="cb-group cb-group--tight" id="gp-fieldset">
            <legend>Fieldset and legend</legend>
            <div class="cb-row">
              <p-checkbox inputId="gp-fs-a" [binary]="true" [ngModel]="gpA()" (ngModelChange)="gpA.set($event)" />
              <label for="gp-fs-a">First</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-fs-b" [binary]="true" [ngModel]="false" />
              <label for="gp-fs-b">Second</label>
            </div>
          </fieldset>
          <div role="group" aria-labelledby="gp-role-label" id="gp-role" class="cb-col">
            <span class="pg__label" id="gp-role-label">Role group with aria-labelledby</span>
            <div class="cb-row">
              <p-checkbox inputId="gp-rl-a" [binary]="true" [ngModel]="gpB()" (ngModelChange)="gpB.set($event)" />
              <label for="gp-rl-a">First</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-rl-b" [binary]="true" [ngModel]="false" />
              <label for="gp-rl-b">Second</label>
            </div>
          </div>
          <div id="gp-none" class="cb-col">
            <span class="pg__label">A caption and nothing else</span>
            <div class="cb-row">
              <p-checkbox inputId="gp-nn-a" [binary]="true" [ngModel]="gpC()" (ngModelChange)="gpC.set($event)" />
              <label for="gp-nn-a">First</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-nn-b" [binary]="true" [ngModel]="false" />
              <label for="gp-nn-b">Second</label>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Measured accessible group</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code></td>
                <td>{{ m.groupFieldset }}</td>
                <td>
                  <strong>Preferred.</strong> No ARIA needed, survives a stylesheet reset, and the legend is a real
                  heading for sighted users too.
                </td>
              </tr>
              <tr>
                <td><code>role="group"</code> + <code>aria-labelledby</code></td>
                <td>{{ m.groupRole }}</td>
                <td>
                  <strong>Works.</strong> Reach for it when <code>&lt;fieldset&gt;</code>
                  fights your layout — it has stubborn default styles and a
                  <code>min-width: min-content</code> that breaks flex/grid children.
                </td>
              </tr>
              <tr>
                <td>A heading or <code>&lt;span&gt;</code> above the boxes</td>
                <td>{{ m.groupNone }}</td>
                <td>
                  <strong>Fails.</strong> Visual adjacency is not a relationship (WCAG SC 1.3.1) — and it is the shape a
                  group falls into by default, because the heading already looks like the name.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the accessibility tree: the node that owns the checkboxes, for each of the three shapes. If you use
          <code>&lt;fieldset&gt;</code>, reset it deliberately —
          <code>border: 0; margin: 0; padding: 0; min-width: 0</code> — rather than avoiding the element because of its
          defaults.
        </p>

        <h3>Forms</h3>
        <p>
          <code>p-checkbox</code> is a <code>ControlValueAccessor</code> and, unlike <code>p-select</code>, it
          <em>also</em> renders a real form control. That has two consequences worth knowing: the input participates in
          native submission when you give it a <code>name</code> and it sits inside a <code>&lt;form&gt;</code>, and an
          <strong>unchecked</strong> box contributes nothing at all to the submitted data — absence is the "false". If a
          backend needs an explicit false, send the model, not the form.
        </p>
        <p class="src-note">
          <code>[attr.name]="name()"</code> and <code>[attr.required]="required() ? '' : undefined"</code> at
          <code>openng-optimus-ui-checkbox.mjs:321, 324</code>; the submission behavior is the WHATWG rule linked in
          Sources.
          Stated from the spec and the source, not from a rendered native submission — verify it if you rely on it.
        </p>

        <h3>readonly is not what it says</h3>
        <p>
          <code>[readonly]="true"</code> renders the <code>readonly</code> attribute on the input
          (<code>openng-optimus-ui-checkbox.mjs:325</code>) — but <code>readonly</code> has no effect on a checkbox in
          HTML. The
          browser toggles the input anyway; only <code>handleChange</code> (:278-282) declines to update the model. The
          visible box therefore stays in its old state while the underlying input has flipped. {{ m.readonlyNote }} If
          you mean "cannot be changed", use <code>[disabled]="true"</code>; if you mean "shown for reference", render
          text.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>Naming: the pattern that fails on a select works here</h4>
        <p>
          The four patterns below are rendered live, side by side, so the table underneath can report what the
          accessibility tree actually says about each of them. The "name" column is what a screen reader announces.
        </p>
        <div class="ex__stage">
          <div class="cb-row">
            <p-checkbox inputId="nm-label" [binary]="true" [ngModel]="nmA()" (ngModelChange)="nmA.set($event)" />
            <label for="nm-label">Label for + inputId</label>
          </div>
          <div class="cb-row">
            <p-checkbox
              inputId="nm-aria"
              [binary]="true"
              ariaLabel="ariaLabel input"
              [ngModel]="nmB()"
              (ngModelChange)="nmB.set($event)"
            />
            <span aria-hidden="true">ariaLabel input</span>
          </div>
          <div class="cb-row">
            <p-checkbox
              inputId="nm-host"
              [attr.aria-label]="'aria-label on the host'"
              [binary]="true"
              [ngModel]="nmC()"
              (ngModelChange)="nmC.set($event)"
            />
            <span aria-hidden="true">aria-label on the host</span>
          </div>
          <div class="cb-row">
            <p-checkbox inputId="nm-none" [binary]="true" [ngModel]="nmD()" (ngModelChange)="nmD.set($event)" />
            <span aria-hidden="true">Nothing at all</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Measured accessible name</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>{{ m.nameLabelFor }}</td>
                <td>
                  <strong>Works — and is the default choice.</strong> The focusable element is a real
                  <code>&lt;input type="checkbox"&gt;</code>, which is labelable.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code> <em>inputs</em></td>
                <td>{{ m.nameAriaInput }}</td>
                <td>
                  <strong>Works.</strong> Bound onto the input (<code>openng-optimus-ui-checkbox.mjs:327-328</code>;
                  the inputs themselves are plain <code>&#64;Input</code>s at :110 / :115). Use only
                  when no visible label exists — you lose the second click target.
                </td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> on the <code>&lt;p-checkbox&gt;</code> host</td>
                <td>{{ m.nameHostAttr }}</td>
                <td>
                  <strong>Fails.</strong> The host has no role; the attribute never reaches the input. Same trap as on
                  <code>p-select</code>.
                </td>
              </tr>
              <tr>
                <td>Nothing — a bare box with adjacent text</td>
                <td>{{ m.nameNone }}</td>
                <td><strong>Fails.</strong> Announced as an unnamed checkbox.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Names read from the accessibility tree, one node per
          <code>inputId</code>. The mechanism is visible in the source: the input carries
          <code>[attr.id]="inputId"</code> (:318) and <code>[attr.aria-labelledby]</code> /
          <code>[attr.aria-label]</code> (:327-328), while the host binds only <code>class</code> and
          <code>data-p-*</code> attributes.
        </p>

        <h4>Keyboard</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Focus in / out. Every checkbox in a group is its own tab stop — that is correct, and it is the
                  difference from a radio group.
                </td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Toggles. The browser does this natively; Optimus adds no key handler at all.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  Nothing — it submits the surrounding form, as on any native checkbox. Do not add a handler for it.
                </td>
              </tr>
              <tr>
                <td>Arrow keys</td>
                <td>Nothing. Checkboxes are independent; arrow-key roving is the radio-group contract.</td>
              </tr>
              <tr>
                <td>Clicking the label</td>
                <td>
                  Toggles, because <code>&lt;label for&gt;</code> forwards activation to the input. This is free
                  behavior you get only if you use a real label.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-checkbox.mjs</code> binds <code>focus</code>, <code>blur</code> and <code>change</code> on the
          input (:332-334) and <strong>no</strong> <code>keydown</code> handler — every key behavior above is the
          browser's own, which is why it is reliable.
        </p>

        <h4>Known gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>No mixed state for assistive technology.</strong> The measurement above. This is an upstream gap;
            the workaround is yours to apply per call site.
          </li>
          <li>
            <strong>The host swallows ARIA.</strong> <code>[attr.aria-describedby]</code>,
            <code>[attr.aria-label]</code> and friends on <code>&lt;p-checkbox&gt;</code> are silently inert. There is
            no <code>ariaDescribedBy</code> input either — but there are two working routes: fold the description into
            the label text, or push the attribute onto the real input with the <code>pt</code> pass-through. See the
            next section.
          </li>
          <li>
            <strong>Target size.</strong> {{ m.hitNormal }} is under the 24&nbsp;px floor of WCAG 2.2 SC 2.5.8 — always
            ship the clickable label.
          </li>
          <li>
            <strong>No group semantics.</strong> Optimus ships no group component; if you do not write the
            <code>&lt;fieldset&gt;</code>, nobody does.
          </li>
        </ul>

        <h4>Reaching the real input: the <code>pt</code> pass-through</h4>
        <p>
          The component binds <code>[pBind]="ptm('input')"</code> on the input element
          (<code>openng-optimus-ui-checkbox.mjs:331</code>), and <code>pt</code> is an input on
          <code>BaseComponent</code> (<code>openng-optimus-ui-basecomponent.d.ts:51</code>). So any attribute you cannot pass
          through a named input — <code>aria-describedby</code>, <code>autocomplete</code>, a <code>data-*</code> hook
          for tests — can be routed onto the element that actually carries the role:
        </p>
        <div class="ex__stage">
          <div class="cb-col">
            <div class="cb-row">
              <p-checkbox
                inputId="pt-demo"
                [binary]="true"
                [pt]="ptDemoConfig"
                [ngModel]="ptDemo()"
                (ngModelChange)="ptDemo.set($event)"
              />
              <label for="pt-demo">Delete the archive as well</label>
            </div>
            <p class="ex__note" id="pt-demo-desc">This cannot be undone once the job has run.</p>
          </div>
        </div>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          Measured live on the specimen above: {{ m.ptDescribedBy }} Prefer a <code>&lt;label&gt;</code> that already
          says everything; reach for <code>pt</code> when the extra text must stay a <em>description</em> rather than
          become part of the name.
        </p>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ Every checkbox has a real <code>&lt;label for&gt;</code> pointing at its <code>inputId</code> — not a bare
            <code>&lt;span&gt;</code> beside it.
          </li>
          <li>
            ☐ No <code>[attr.aria-*]</code> on the <code>&lt;p-checkbox&gt;</code> host is doing accessibility work.
          </li>
          <li>
            ☐ More than one checkbox → a <code>&lt;fieldset&gt;&lt;legend&gt;</code> (or <code>role="group"</code> +
            <code>aria-labelledby</code>) carrying the question.
          </li>
          <li>☐ The choice is genuinely non-exclusive. If exactly one answer is allowed, it is a radio group.</li>
          <li>☐ The change takes effect on submit. If it applies instantly, it is a switch.</li>
          <li>☐ Labels are positively phrased and carry one statement each; no consent ships pre-ticked.</li>
          <li>☐ Focus is visible in <strong>both</strong> light and dark themes — check it, do not assume it.</li>
          <li>
            ☐ Using <code>indeterminate</code>? Then the DOM property and <code>aria-checked="mixed"</code> are set too,
            and the parent's value is never what gets submitted.
          </li>
          <li>☐ <code>readonly</code> is not being used where <code>disabled</code> is meant.</li>
          <li>
            ☐ Group bindings use one array with <code>value</code>, or independent booleans with
            <code>[binary]="true"</code> — not a confused mixture.
          </li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the two rules this guide exists to protect — the label
          really names the input, and the host carries no ARIA:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Every string here is yours</h3>
        <p>
          A pleasant difference from <code>p-select</code>: the checkbox ships <strong>no</strong> built-in text. There
          is no placeholder, no "Option List", no hard-coded English <code>aria-label</code> anywhere in the component —
          the template contains one <code>&lt;input&gt;</code>, one <code>&lt;div&gt;</code> and an icon, and every word
          on screen comes from your <code>&lt;label&gt;</code>. Nothing about a checkbox needs
          <code>provideOptimus(&#123; translation &#125;)</code>.
        </p>
        <p class="src-note">
          Verified by reading the whole template (<code>openng-optimus-ui-checkbox.mjs:316-351</code>): the only ARIA
          the
          component emits is what you passed in through <code>ariaLabel</code> / <code>ariaLabelledBy</code>.
        </p>
        <ul>
          <li>
            <strong>The label</strong> — bind it to a translation key, exactly like any other text. The kit's pattern is
            the <code>TranslationService</code>, resolved through a <code>computed()</code> so a language switch
            re-renders.
          </li>
          <li>
            <strong>The legend</strong> — the group's question is a string too, and it is the one people forget, because
            it looks like a heading rather than a control label.
          </li>
          <li><strong>The error message</strong> that goes with <code>[invalid]</code>.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Length: the label wraps, and that changes the layout</h3>
        <p>
          German consent sentences run 20–40% longer than English ("Ich stimme der Verarbeitung meiner Daten zu" vs "I
          agree to data processing"), and a checkbox label
          <em>wraps</em> — it does not truncate like a select trigger. Two consequences: the row must be
          <code>align-items: flex-start</code> so the box stays on the first line, and a two-column grid of checkboxes
          will go ragged in the longer languages. Test the layout in the longest language you ship, not in English.
        </p>
        <pre class="code-block"><code>{{ wrapSnippet }}</code></pre>

        <h3>Do not build a sentence out of fragments</h3>
        <p>
          The tempting shape is an interpolated "I accept the" followed by a separate link whose text is a second key:
        </p>
        <pre class="code-block"><code>{{ fragmentSnippet }}</code></pre>
        <p>
          It breaks in any language whose word order differs, and it puts half the sentence outside the label. Translate
          the whole sentence as one key with a placeholder for the link, and keep every fragment <em>inside</em> the
          <code>&lt;label&gt;</code>.
        </p>

        <h3>A link inside a label is a real conflict</h3>
        <p>
          "I accept the <em>terms</em>" with <em>terms</em> as a link puts a second interactive element inside the
          label: clicking the link also toggles the checkbox, and screen readers announce the link text as part of the
          checkbox name. The honest fixes are to move the link out of the label and next to it, or to open the terms in
          a dialog from a separate button. Do not fight it with <code>stopPropagation</code> — the announcement problem
          stays.
        </p>

        <h3>RTL: this one is fine</h3>
        <p>
          The shipped stylesheet positions the input with <code>inset-block-start</code> /
          <code>inset-inline-start</code>, i.e. logical properties, so the overlay follows the writing direction. What
          does <strong>not</strong> follow automatically is your own row: use <code>gap</code> and flex order rather
          than <code>margin-right</code>, and the row mirrors for free.
        </p>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code> (<code
            >.p-checkbox-input &#123; inset-block-start: 0; inset-inline-start: 0 &#125;</code
          >). Not verified by rendering an RTL locale — the kit ships none.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the focus-outline row and
            the WCAG roll-up cite the gate's "focus ring" rows (3.88:1 and up) instead of "brand foreground".
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Contrast table re-based on the gated CONTRAST.MD rows: the unchecked
            edge is <code>--control-border</code> (≥ 3.85:1), the dark fill the palette's dark foreground; the
            invalid edge is the kit red.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Colors restated as tokens for the visual styles (ADR-0016): the state table names
            Aura tokens, the contrast table is labeled as Aura's stock palette (the kit's styles
            are not in the contrast gate), and the focus ring points at the CONTRAST.MD
            brand-foreground rows. Corrected "no checkbox rule in styles.scss" (the focus ring is
            one); narrow-screen statement added; history ordered newest first.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): the box scale is back on the
            Aura&nbsp;2.x tokens 1 / 1.25 / 1.5rem, so <code>large</code> (24&nbsp;×&nbsp;24) now meets SC 2.5.8 while
            <code>small</code> and the default still miss it — the "every size misses it" finding no longer holds.
            <code>styleClass</code> exists again as a deprecated input, <code>checked</code> is a plain getter rather
            than a <code>computed()</code>, and <code>indeterminate</code> is mirrored by <code>ngOnChanges</code>
            instead of a constructor <code>effect</code>. All source line references re-derived against
            <code>openng-optimus-ui-checkbox.mjs</code>; contrast and focus-ring numbers were not re-measured (color
            tokens are unchanged).
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-23 — Re-measured against PrimeNG 22.1.0 / Themes 3.0.0. Aura 3.0 shrank the
            box scale from 16/20/24 to 14/18/20&nbsp;px (default re-measured at 18&nbsp;×&nbsp;18), so no size reaches
            SC 2.5.8's 24px on its own. The kit's <code>:has()</code> family rule now overrides Aura's 1px
            ring to the 2px kit standard (browser-verified, both themes). Source line references updated to the 22.1
            build; <code>styleClass</code> is removed, <code>formControl</code> is new, and the input now carries an
            inert <code>readonly</code> attribute. Color tokens are unchanged, so the measured contrast numbers stand.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Call-site counts and per-file attributions removed; measurement methods
            reduced to their citations.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: the checkbox / radio / switch table, a live playground,
            four rendered Do/Don't pairs, an Aura-measured design tab, and the canonical agent doc.
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

      /* --- The checkbox row: the kit convention this guide documents --- */
      .cb-row {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
      }
      .cb-row label {
        cursor: pointer;
        line-height: 1.35;
      }
      .cb-col {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .cb-group {
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        margin: 0;
        padding: var(--space-4);
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .cb-group legend {
        padding: 0 var(--space-2);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .cb-group--tight {
        border: 0;
        padding: 0;
      }
      .cb-group--tight legend {
        padding: 0;
        margin-bottom: var(--space-1);
      }
      .cb-children {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding-left: var(--space-5);
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
        gap: var(--space-4) var(--space-6);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .sizes {
        display: flex;
        flex-direction: column;
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
export class CheckboxArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  /**
   * MEASURED VALUES — every number rendered in the Design and Development tabs.
   *
   * Geometry is token-derived (the Aura 2.x checkbox width/height tokens).
   * Colors are token names, because their values follow the active visual
   * style and accent (ADR-0016); the contrast ratios are ranges quoted from
   * docs/generated/CONTRAST.MD (gated). Names and roles
   * from the accessibility tree. Kept in one object so a re-measurement is one
   * diff, and so no number in the prose is a belief.
   */
  readonly m = {
    // --- geometry ---
    boxSmall: '16 × 16 px',
    boxNormal: '20 × 20 px',
    boxLarge: '24 × 24 px',
    hitSmall: '16 × 16 px',
    hitNormal: '20 × 20 px',
    hitLarge: '24 × 24 px',
    radius: '{border.radius.sm} (Aura 4px; 0 in the default visual style)',
    transition: '0.2s',
    // --- color, light theme: token names (values follow the active style and accent) ---
    restBorderLight: '--control-border on a surface.0 fill',
    checkedBgLight: 'primary.500 (the accent)',
    checkedIconLight: 'primary contrast color (white)',
    focusOutlineLight: '2px solid --primary-color-fg, offset 2px (kit rule)',
    // --- color, dark theme ---
    restBorderDark: '--control-border on a surface.950 fill',
    checkedBgDark: "primary.500 (the accent's dark foreground)",
    checkedIconDark: 'primary contrast color (surface.900)',
    focusOutlineDark: '2px solid --primary-color-fg, offset 2px (kit rule)',
    disabledNote:
      'Opacity stays 1 in both themes; the box takes {form.field.disabled.background} and the glyph ' +
      '{form.field.disabled.color}. Note that a disabled CHECKED box loses the primary fill entirely — ' +
      'disabled-on and disabled-off differ only by a faint glyph.',
    // --- contrast ranges from docs/generated/CONTRAST.MD (4 styles × 10 accents, gated) ---
    contrastRestBorderLight: '3.85–5.23 : 1 — passes',
    contrastRestBorderDark: '3.97–5.51 : 1 — passes',
    contrastCheckedLight: '4.75–17.85 : 1 — passes',
    contrastCheckedDark: '4.75–17.58 : 1 — passes',
    contrastGlyphLight: '5.18–17.85 : 1 — passes',
    contrastGlyphDark: '6.40–16.93 : 1 — passes',
    contrastFocusLight: '4.42–17.85 : 1 on ground, card, section — passes ("focus ring")',
    contrastFocusDark: '3.88–17.58 : 1 on ground, card, section — passes ("focus ring")',
    // --- accessibility tree ---
    nameLabelFor: '"Label for + inputId" — the label text',
    nameAriaInput: '"ariaLabel input" — the input value',
    nameHostAttr: '"" — empty',
    nameNone: '"" — empty',
    groupFieldset: 'a group node named "Fieldset and legend", owning both boxes',
    groupRole: 'a group node named "Role group with aria-labelledby", owning both boxes',
    groupNone: 'no group node at all — the two boxes share no owner',
    indeterminateA11y:
      'Read from a mixed-state parent while the minus glyph was on screen: the accessibility ' +
      'tree reports role "checkbox", checked FALSE. Not "mixed" — ' +
      'plainly unchecked. A screen-reader user is told the parent is off, and the third state ' +
      'they are being shown does not exist for them.',
    indeterminateEvidence:
      'input.indeterminate === false, input.checked === false, aria-checked === null, ' +
      'svg[data-p-icon=minus] present, host class without p-checkbox-checked; the accessibility ' +
      'node reported checked: false.',
    ptDescribedBy:
      'the attribute landed on the input (aria-describedby="pt-demo-desc"), the host carried ' +
      'none, and the accessibility node reported name "Delete the archive as well" with ' +
      'description "This cannot be undone once the job has run." So the description is real, ' +
      'and it stayed out of the name.',
    readonlyNote:
      'Measured: clicking the readonly box left the host class without p-checkbox-checked (the ' +
      'visible box did not move) while input.checked flipped from false to true — the rendered ' +
      'state and the real control now disagree, and the accessibility tree follows the input.',
  };

  /** The measured name of the "Don't" naming example, quoted in the Usage tab. */
  readonly ddNameBadMeasured = '"" — empty, an unnamed checkbox';

  // --- Playground state ------------------------------------------------------
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgIndeterminate = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgInvalid = signal(false);
  readonly pgReadonly = signal(false);
  readonly pgIcon = signal(false);
  readonly pgValue = signal(true);

  /** 'normal' maps to the default (no size input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = ['inputId="release-notes"', '[binary]="true"'];
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgIndeterminate()) attrs.push('[indeterminate]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    if (this.pgInvalid()) attrs.push('[invalid]="true"');
    if (this.pgReadonly()) attrs.push('[readonly]="true"');
    if (this.pgIcon()) attrs.push('checkboxIcon="pi pi-bolt"');
    attrs.push('[(ngModel)]="releaseNotes"');
    return (
      `<div class="cb-row">\n  <p-checkbox\n    ${attrs.join('\n    ')} />\n` +
      `  <label for="release-notes">Send me the release notes</label>\n</div>`
    );
  });

  // --- Example state ---------------------------------------------------------
  readonly szSmall = signal(true);
  readonly szNormal = signal(true);
  readonly szLarge = signal(true);

  readonly channels = [
    { label: 'Email', value: 'email' },
    { label: 'Push notification', value: 'push' },
    { label: 'SMS', value: 'sms' },
    { label: 'In-app inbox', value: 'inapp' },
  ];
  readonly exChannels = signal<string[]>(['email']);
  readonly exChannelsText = computed(() =>
    this.exChannels().length ? `[${this.exChannels().join(', ')}]` : '[] (empty — a valid answer)',
  );

  readonly blTerms = signal(false);
  readonly blPublic = signal(true);

  readonly events = [
    { key: 'views', label: 'Page views' },
    { key: 'clicks', label: 'Click events' },
    { key: 'errors', label: 'Error reports' },
  ];
  readonly treeState = signal<Record<string, boolean>>({
    views: true,
    clicks: false,
    errors: false,
  });
  readonly treeAll = computed(() => this.events.every((e) => this.treeState()[e.key]));
  readonly treeNone = computed(() => this.events.every((e) => !this.treeState()[e.key]));
  /** Mixed = at least one on and at least one off. Derived, never hand-maintained. */
  readonly treeSome = computed(() => !this.treeAll() && !this.treeNone());
  readonly treeStateText = computed(() =>
    this.treeAll() ? 'checked' : this.treeSome() ? 'indeterminate (visually)' : 'unchecked',
  );

  setEvent(key: string, on: boolean): void {
    this.treeState.set({ ...this.treeState(), [key]: on });
  }

  setAllEvents(on: boolean): void {
    const next: Record<string, boolean> = {};
    for (const e of this.events) next[e.key] = on;
    this.treeState.set(next);
  }

  readonly tvValue = signal<'yes' | 'no'>('no');
  readonly stInvalid = signal(false);

  // --- Do / Don't state ------------------------------------------------------
  readonly ddExMonthly = signal(true);
  readonly ddExYearly = signal(false);
  readonly ddBilling = signal('monthly');
  readonly ddInstant = signal(false);
  readonly ddGroupBad = signal(true);
  readonly ddGroupGood = signal(true);
  readonly ddName = signal(false);

  /** The four live naming specimens + three grouping specimens in Development. */
  readonly nmA = signal(true);
  readonly nmB = signal(true);
  readonly nmC = signal(false);
  readonly nmD = signal(false);
  readonly ptDemo = signal(false);
  /** Pass-through config for the live `pt` specimen in the Development tab. */
  readonly ptDemoConfig = { input: { 'aria-describedby': 'pt-demo-desc' } };
  readonly gpA = signal(true);
  readonly gpB = signal(true);
  readonly gpC = signal(true);

  // --- Code snippets ---------------------------------------------------------
  readonly sizesCode = `<p-checkbox inputId="s"  size="small" [binary]="true" [(ngModel)]="a" />
<p-checkbox inputId="m"              [binary]="true" [(ngModel)]="b" />
<p-checkbox inputId="l"  size="large" [binary]="true" [(ngModel)]="c" />`;

  readonly groupArrayCode = `<!-- One array, four boxes. No [binary]. -->
<fieldset class="cb-group">
  <legend>{{ t('notify.legend') }}</legend>
  @for (ch of channels; track ch.value) {
    <div class="cb-row">
      <p-checkbox [inputId]="'ch-' + ch.value" [value]="ch.value"
        [(ngModel)]="selectedChannels" />
      <label [for]="'ch-' + ch.value">{{ ch.label }}</label>
    </div>
  }
</fieldset>

// selectedChannels: string[] = ['email'];`;

  readonly groupBoolCode = `<!-- Independent flags: [binary]="true", one signal each. -->
<fieldset class="cb-group">
  <legend>{{ t('account.legend') }}</legend>
  <div class="cb-row">
    <p-checkbox inputId="terms" [binary]="true" [(ngModel)]="acceptedTerms" />
    <label for="terms">{{ t('account.terms') }}</label>
  </div>
</fieldset>`;

  readonly indeterminateCode = `<!-- The parent's indeterminate state is DERIVED, never stored. -->
<p-checkbox inputId="all" [binary]="true"
  [indeterminate]="someButNotAll()"
  [ngModel]="allChecked()" (ngModelChange)="setAll($event)" />
<label for="all">All events</label>

// component
readonly allChecked  = computed(() => this.events.every(e => this.state()[e.key]));
readonly noneChecked = computed(() => this.events.every(e => !this.state()[e.key]));
readonly someButNotAll = computed(() => !this.allChecked() && !this.noneChecked());`;

  readonly trueFalseCode = `<p-checkbox inputId="digest" [binary]="true"
  trueValue="yes" falseValue="no" [(ngModel)]="digest" />
<label for="digest">Subscribe to the digest</label>

// digest: 'yes' | 'no' = 'no';`;

  readonly statesCode = `<p-checkbox inputId="a" [binary]="true" [disabled]="true" [(ngModel)]="a" />
<p-checkbox inputId="b" [binary]="true" [invalid]="form.controls.terms.invalid" [(ngModel)]="b" />
<p-checkbox inputId="c" [binary]="true" [readonly]="true" [(ngModel)]="c" />`;

  readonly rowSnippet = `<div class="cb-row">
  <p-checkbox inputId="terms" [binary]="true" [(ngModel)]="acceptedTerms" />
  <label for="terms">I accept the terms</label>
</div>

/* styles */
.cb-row { display: flex; align-items: flex-start; gap: var(--space-2); }
.cb-row label { cursor: pointer; line-height: 1.35; }`;

  readonly devImport = `import { CheckboxModule } from '@openng/optimus-ui/checkbox';

@Component({
  standalone: true,
  imports: [CheckboxModule, FormsModule],
  // ...
})`;

  readonly bindingSnippet = `// A) The answer is a SET -> one array, a value per box, no [binary]
selectedChannels: string[] = [];
// <p-checkbox [value]="'email'" [(ngModel)]="selectedChannels" inputId="ch-email" />

// B) Independent flags -> [binary]="true", one boolean each
acceptedTerms = signal(false);
// <p-checkbox [binary]="true" [ngModel]="acceptedTerms()"
//   (ngModelChange)="acceptedTerms.set($event)" inputId="terms" />`;

  readonly indeterminateWireSnippet = `readonly allChecked  = computed(() => this.rows().every(r => r.selected));
readonly noneChecked = computed(() => this.rows().every(r => !r.selected));
readonly mixed       = computed(() => !this.allChecked() && !this.noneChecked());

// template
// <p-checkbox inputId="all" [binary]="true" [indeterminate]="mixed()"
//   [ngModel]="allChecked()" (ngModelChange)="setAll($event)" />`;

  readonly indeterminateFixSnippet = `// Optimus draws the minus but tells assistive technology nothing.
// Set the DOM property AND the ARIA state on the real input yourself.
private readonly doc = inject(DOCUMENT);

private syncMixed(inputId: string, mixed: boolean, checked: boolean): void {
  const el = this.doc.getElementById(inputId) as HTMLInputElement | null;
  if (!el) return;                       // SSR / not yet rendered
  el.indeterminate = mixed;              // native tri-state
  el.setAttribute('aria-checked', mixed ? 'mixed' : String(checked));
}

// Call it from an effect() that reads the same computed the template binds.`;

  readonly i18nSnippet = `// Labels rebuild on a language switch because they are read through a computed().
readonly labels = computed(() => ({
  legend: this.i18n.translate('notify.legend'),
  email: this.i18n.translate('notify.channel.email'),
  push: this.i18n.translate('notify.channel.push'),
}));

// <legend>{{ labels().legend }}</legend>
// <label for="ch-email">{{ labels().email }}</label>`;

  readonly ptSnippet = `<p-checkbox inputId="pt-demo" [binary]="true"
  [pt]="{ input: { 'aria-describedby': 'pt-demo-desc' } }"
  [(ngModel)]="deleteArchive" />
<label for="pt-demo">Delete the archive as well</label>
<p id="pt-demo-desc">This cannot be undone once the job has run.</p>`;

  readonly fragmentSnippet = `<!-- Don't: three fragments, one of them outside the label. -->
<label for="terms">{{ t('consent.iAccept') }}</label>
<a href="/terms">{{ t('consent.terms') }}</a>

<!-- Do: one key, one sentence, everything inside the label. -->
<label for="terms">{{ t('consent.full') }}</label>
<!-- consent.full = "I accept the terms of service." -->`;

  readonly wrapSnippet = `/* The box stays on the first line when the sentence wraps. */
.cb-row { display: flex; align-items: flex-start; gap: var(--space-2); }

/* Not this: the box drifts to the vertical center of a two-line label. */
.cb-row--wrong { display: flex; align-items: center; }`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';

@Component({
  standalone: true,
  imports: [CheckboxModule],
  template: \`
    <p-checkbox inputId="terms" [binary]="true" />
    <label for="terms">I accept the terms</label>\`,
})
class HostComponent {}

describe('checkbox accessible name', () => {
  it('names the real input via <label for>, not the host', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    // p-checkbox renders a genuine input; that is what the label binds to.
    const input = host.querySelector('input[type="checkbox"]')!;
    expect(input.id).toBe('terms');
    expect(host.querySelector('label')!.getAttribute('for')).toBe('terms');

    // Guard against the regression this guide exists to prevent:
    expect(host.querySelector('p-checkbox')!.hasAttribute('aria-label')).toBe(false);
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
