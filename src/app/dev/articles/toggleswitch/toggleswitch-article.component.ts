import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { SelectModule } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: ToggleSwitch (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the single most common form mix-up in
 * this kit: SWITCH versus CHECKBOX — a switch is a light switch (it acts the
 * moment it moves), a checkbox is a selection that some later action commits.
 *
 * Claims this guide makes, with their provenance (Optimus UI 2.0.2; browser
 * measurements from the 21 pass are marked — the toggleswitch color tokens hold
 * the same values in Optimus's Aura 2.x preset, so color numbers carry):
 *   - The rendered control is a real native form control: an
 *     `<input type="checkbox" role="switch">` covering the whole component at
 *     `opacity: 0` (openng-optimus-ui-toggleswitch.mjs:219-244).
 *   - Naming: `<label for>` + `inputId` works (the focusable element is a
 *     labelable `<input>`, unlike `p-select`); `ariaLabel` also works and beats
 *     a `<label for>` when both are present (:229-230, :221). Both are plain
 *     properties here, not signals.
 *   - Keyboard: no key handler ships — only a host click listener
 *     (`onHostClick`, :164), so the contract is the native checkbox one:
 *     Space toggles, Enter does not.
 *   - `size` is STILL a no-op (an input signal at :134 that nothing reads): the
 *     Aura preset has no `sm`/`lg` keys
 *     (`@openng/optimus-ui-themes/dist/aura/toggleswitch/index.mjs`) and the shipped
 *     stylesheet no size selector (`@openng/optimus-ui-styles/dist/toggleswitch`).
 *   - Geometry is back on the Aura 2.x values: 2.5 × 1.5rem (40 × 24px) with a
 *     1rem handle — the control sits exactly ON the 24px SC 2.5.8 floor again
 *     (PrimeNG 22 / Aura 3.0 had shrunk it to 36 × 22 with a 14px handle).
 *   - Focus ring: Aura points this component at the GLOBAL `focus.ring` (1px
 *     solid, `{primary.color}`, 2px offset — aura/base), not the zeroed
 *     `form.field.focusRing`. The kit's one ring rule in `styles.scss`
 *     (`.p-toggleswitch:has(.p-toggleswitch-input:focus-visible)
 *     .p-toggleswitch-slider`, 2px --primary-color-fg, !important) replaces it.
 *   - `readonly` is enforced only in the toggle guard (:180): no attribute, no
 *     `aria-readonly`, so the native checkbox drifts away from the model.
 *   - `styles.scss` `.p-toggleswitch` re-points the OFF track to
 *     --control-border and the handle to --surface-card (CONTRAST.MD
 *     "toggleswitch"); the ON state stays Aura's. The invalid border
 *     is --semantic-red-fg (was Aura red.400, 2.77:1 on white), measured by the
 *     `inputtext.invalid.border.color` rows ("form field edge"), whose note
 *     says the toggleswitch reads the same colour.
 *   - `p-inputSwitch` stays gone (no `inputswitch` entry point ships), but the
 *     camelCase `p-toggleSwitch` alias is back: the selector is
 *     `p-toggleswitch, p-toggleSwitch, p-toggle-switch` (:250). `styleClass` is
 *     likewise back as a `@deprecated` but working input (:285).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-toggleswitch-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    ToggleSwitchModule,
    CheckboxModule,
    SelectModule,
    SelectButtonModule,
    ButtonModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'toggleswitch'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-toggleswitch</code>. A switch is a <strong>light switch</strong>: the
          moment the handle moves, the thing it controls has changed. If your screen has a Save button that the switch
          is waiting for, you wanted a checkbox — the Usage tab makes that call with a table and four rendered pairs.
        </p>

        <!-- Mini playground: live-configure a switch and read back the markup. -->
        <section class="pg" aria-label="Toggle switch playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Size (see the note)</span>
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
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
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
                <label for="pg-invalid">Invalid</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-required">Required</label>
                <p-toggleswitch
                  inputId="pg-required"
                  [ngModel]="pgRequired()"
                  (ngModelChange)="pgRequired.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <div class="switch-row">
                  <label for="pg-preview">Dark mode</label>
                  <p-toggleswitch
                    inputId="pg-preview"
                    [size]="pgSizeInput()"
                    [disabled]="pgDisabled()"
                    [readonly]="pgReadonly()"
                    [invalid]="pgInvalid()"
                    [required]="pgRequired()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                </div>
                <p class="pg__readout">
                  Model value: <code>{{ pgValue() }}</code>
                </p>
              </div>
            </div>
          </div>

          <p class="ex__note">
            <strong>The Size control does nothing</strong> — and that is the point. The Aura preset for this component
            defines no small/large tokens and the shipped stylesheet has no size selector, so
            <code>size="small"</code> and <code>size="large"</code>
            render identically to the default (measured; see the Design tab).
          </p>

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
                  <div class="switch-row">
                    <label for="ex-basic">Show the circle</label>
                    <p-toggleswitch inputId="ex-basic" [ngModel]="exBasic()" (ngModelChange)="exBasic.set($event)" />
                  </div>
                }
                @case ('described') {
                  <div class="setting-row">
                    <span class="setting-text">
                      <label class="setting-title" for="ex-described">Glossary highlighting</label>
                      <span class="setting-desc" id="ex-described-desc">
                        Marks known terms in every article and opens a definition on click.
                      </span>
                    </span>
                    <p-toggleswitch
                      inputId="ex-described"
                      [ngModel]="exDescribed()"
                      (ngModelChange)="exDescribed.set($event)"
                    />
                  </div>
                }
                @case ('values') {
                  <div class="switch-row">
                    <label for="ex-values">Newest first</label>
                    <p-toggleswitch
                      inputId="ex-values"
                      trueValue="desc"
                      falseValue="asc"
                      [ngModel]="exValues()"
                      (ngModelChange)="exValues.set($event)"
                    />
                    <code class="readout">{{ exValues() }}</code>
                  </div>
                }
                @case ('states') {
                  <div class="switch-row">
                    <label for="ex-st-off">Off</label>
                    <p-toggleswitch inputId="ex-st-off" [ngModel]="false" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-on">On</label>
                    <p-toggleswitch inputId="ex-st-on" [ngModel]="true" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-dis">Disabled, off</label>
                    <p-toggleswitch inputId="ex-st-dis" [disabled]="true" [ngModel]="false" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-dison">Disabled, on</label>
                    <p-toggleswitch inputId="ex-st-dison" [disabled]="true" [ngModel]="true" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-inv">Invalid</label>
                    <p-toggleswitch inputId="ex-st-inv" [invalid]="true" [ngModel]="false" />
                  </div>
                }
                @case ('handle') {
                  <div class="switch-row">
                    <label for="ex-handle">Sound</label>
                    <p-toggleswitch inputId="ex-handle" [ngModel]="exHandle()" (ngModelChange)="exHandle.set($event)">
                      <ng-template #handle let-checked="checked">
                        <i
                          class="pi"
                          [class.pi-volume-up]="checked"
                          [class.pi-volume-off]="!checked"
                          aria-hidden="true"
                        ></i>
                      </ng-template>
                    </p-toggleswitch>
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
        <h3>Switch or checkbox? One question decides it</h3>
        <p>
          <strong>Does the change take effect the instant the control moves?</strong> If yes, it is a switch. If the
          user must still press something — Save, Apply, Submit, Search — it is a checkbox. Everything else (shape,
          size, how modern it looks) is decoration on top of that single question.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>p-toggleswitch</code></th>
                <th><code>p-checkbox</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mental model</td>
                <td>A light switch — the room is already brighter.</td>
                <td>A form field — you are filling in an answer.</td>
              </tr>
              <tr>
                <td>When the effect lands</td>
                <td><strong>Immediately</strong>, on toggle.</td>
                <td>When some later action commits the form.</td>
              </tr>
              <tr>
                <td>Announced role</td>
                <td><code>switch</code> — "on" / "off" (measured).</td>
                <td><code>checkbox</code> — "checked" / "not checked".</td>
              </tr>
              <tr>
                <td>Cardinality</td>
                <td>Exactly one independent boolean.</td>
                <td>One boolean, or one item of a set you can check several of.</td>
              </tr>
              <tr>
                <td>Groups</td>
                <td>A stack of unrelated settings, each acting alone.</td>
                <td>A list where "select all" and "3 of 7 selected" make sense.</td>
              </tr>
              <tr>
                <td>Indeterminate / partial</td>
                <td>Impossible — a switch has two positions.</td>
                <td>Native: <code>indeterminate</code>.</td>
              </tr>
              <tr>
                <td>Required-to-proceed</td>
                <td>Wrong control ("accept the terms" is not a light switch).</td>
                <td>The right one — and it validates.</td>
              </tr>
              <tr>
                <td>Undo</td>
                <td>Toggling back must genuinely undo it, cheaply.</td>
                <td>Cancel discards the whole form.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The "announced role" row is measured in the accessibility
          tree. The rest is a <em>design judgment</em> distilled from the two primary sources in the list below — the
          ARIA <code>switch</code> role definition ("represents an on/off switch") and the APG switch pattern. No vendor
          prescribes it; if your product has a convention, that convention wins, but write it down. The row is worth
          checking in your own build, because a hand-styled checkbox sitting in a column of real switches looks
          identical and announces differently.
        </p>

        <h3>The gray zone: settings pages that auto-save</h3>
        <p>
          The honest edge case. A settings page with no Save button is exactly where switches belong — the toggle
          <em>is</em> the commit. But three things have to be true, and they are what most implementations skip:
        </p>
        <ul>
          <li>
            <strong>The write really is immediate</strong>, not queued behind a Save that appears later. If a "You have
            unsaved changes" bar can show up, you have checkboxes wearing a switch's clothes.
          </li>
          <li>
            <strong>Failure is visible.</strong> An instant write can fail (offline, rejected by the server). Then the
            switch must move back <em>and</em> say why — a switch that silently springs back is worse than no feedback
            at all.
          </li>
          <li>
            <strong>The result is perceivable or reversible.</strong> "Dark mode" shows itself. "Delete my history" does
            not, and is destructive — that one needs a button and a confirmation, not a toggle.
          </li>
        </ul>
        <p>
          Kit convention: every settings switch writes through a service on
          <code>(ngModelChange)</code>, and no screen that carries switches also carries a Save button — see
          <code>user-settings</code> for the reference row. The one shape to keep out is a switch picking between two
          <em>named</em> options: that is a choice, not an on/off state (see the first pair below).
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a switch between two named options</span>
            <div class="dd__stage">
              <div class="two-sided">
                <span [class.two-sided--active]="!ddScope()">Filtered (12)</span>
                <p-toggleswitch
                  inputId="dd-scope-bad"
                  ariaLabel="Export scope"
                  [ngModel]="ddScope()"
                  (ngModelChange)="ddScope.set($event)"
                />
                <span [class.two-sided--active]="ddScope()">All (238)</span>
              </div>
            </div>
            <p class="dd__why">
              Neither side is "off", so the switch has no natural rest position, and a screen reader hears "Export
              scope, switch, on" — the word "All" is nowhere in the name. The tell is the markup: a caption on
              <em>both</em> sides of a switch means the control is a two-option chooser wearing a switch.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name both choices</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-scope-good-label">Export scope</span>
                <p-selectbutton
                  [ariaLabelledBy]="'dd-scope-good-label'"
                  [options]="scopeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [allowEmpty]="false"
                  [ngModel]="ddScopeValue()"
                  (ngModelChange)="ddScopeValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Two exclusive, equally weighted alternatives are a
              <code>p-selectbutton</code>: both labels are readable at rest, both are announced, and the group has one
              accessible name.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a switch that waits for Save</span>
            <div class="dd__stage">
              <div class="mini-form">
                <div class="switch-row">
                  <label for="dd-defer-bad">Send me the newsletter</label>
                  <p-toggleswitch
                    inputId="dd-defer-bad"
                    [ngModel]="ddDeferBad()"
                    (ngModelChange)="ddDeferBad.set($event)"
                  />
                </div>
                <p-button label="Save" size="small" severity="secondary" [disabled]="true" />
              </div>
            </div>
            <p class="dd__why">
              The handle has moved, so the user believes it is done — but nothing happened until Save. Every switch in a
              form with a submit button is a promise the page breaks.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — deferred state is a checkbox</span>
            <div class="dd__stage">
              <div class="mini-form">
                <div class="switch-row">
                  <p-checkbox
                    inputId="dd-defer-good"
                    [binary]="true"
                    [ngModel]="ddDeferGood()"
                    (ngModelChange)="ddDeferGood.set($event)"
                  />
                  <label for="dd-defer-good">Send me the newsletter</label>
                </div>
                <p-button label="Save" size="small" severity="secondary" [disabled]="true" />
              </div>
            </div>
            <p class="dd__why">
              A checkbox reads as "an answer I am filling in", and the Save button is the moment it becomes true. Same
              model, honest promise.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a caption that is only a &lt;span&gt;</span>
            <div class="dd__stage">
              <div class="switch-row">
                <span>Show the circle</span>
                <p-toggleswitch [ngModel]="ddNameBad()" (ngModelChange)="ddNameBad.set($event)" />
              </div>
              <p class="dd__readout">measured accessible name: <code>""</code> — empty</p>
            </div>
            <p class="dd__why">
              It looks labeled and is not. With no <code>inputId</code>, no <code>ariaLabel</code> and no
              <code>&lt;label&gt;</code>, the accessible name comes out <strong>empty</strong>: a screen reader
              announces "switch, on" with no idea what is on. The caption is also dead as a click target.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — &lt;label for&gt; + inputId</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-name-good">Show the circle</label>
                <p-toggleswitch
                  inputId="dd-name-good"
                  [ngModel]="ddNameGood()"
                  (ngModelChange)="ddNameGood.set($event)"
                />
              </div>
              <p class="dd__readout">measured accessible name: <code>"Show the circle"</code></p>
            </div>
            <p class="dd__why">
              Two attributes, three wins: the name is right, the caption becomes part of the target, and — unlike
              <code>p-select</code> — this works at all, because the focusable element here really is a labelable
              <code>&lt;input&gt;</code>.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — [readonly] to freeze a switch</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-ro-bad">Auto-sync (readonly)</label>
                <p-toggleswitch
                  inputId="dd-ro-bad"
                  [readonly]="true"
                  [ngModel]="ddReadonly()"
                  (ngModelChange)="ddReadonly.set($event)"
                />
              </div>
              <p class="dd__readout">
                model <code>{{ ddReadonly() }}</code>
              </p>
            </div>
            <p class="dd__why">
              The model is protected, but the control still takes focus, still swallows
              <kbd>Space</kbd>, and carries no <code>aria-readonly</code> — so it announces as a perfectly operable
              switch that quietly refuses. Nothing on screen says why.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — [disabled], with the reason next to it</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-ro-good">Auto-sync</label>
                <p-toggleswitch inputId="dd-ro-good" [disabled]="true" [ngModel]="true" />
              </div>
              <p class="dd__readout">Needs an account — sign in to change this.</p>
            </div>
            <p class="dd__why">
              <code>[disabled]</code> puts <code>disabled</code> on the real input, so the state is announced, the
              control leaves the tab order, and the sentence underneath supplies the missing "why". Kit convention: a
              disabled switch always ships the reason as visible text — see <code>theme-picker</code> for the reference
              row.
            </p>
          </div>
        </div>

        <h3>Write the label as a thing, not as a command</h3>
        <ul>
          <li>
            <strong>A noun or a state, never a verb phrase.</strong> "Dark mode", "Glossary highlighting", "Auto-sync" —
            not "Enable dark mode". A switch already carries the verb in its position; a label that also says "enable"
            reads as a button and leaves "off" ambiguous ("did I disable enabling?").
          </li>
          <li>
            <strong>Never negate.</strong> "Hide the sidebar" turns the off position into a double negative. Flip the
            wording, not the meaning.
          </li>
          <li>
            <strong>Do not put the state in the label.</strong> "Dark mode: on" fights the control that already says on,
            and it drifts the moment the two disagree.
          </li>
          <li>
            <strong>Put explanation in a description, not in the name.</strong> A short second line under the label —
            the kit's settings-row pattern — beats a long label that the switch pushes off the line.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#switch" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, the <code>switch</code> role</a
            >
            — defines a switch as "a type of checkbox that represents on/off values, as opposed to checked/unchecked
            values", and requires <code>aria-checked</code>. It is the normative basis for the whole
            switch-versus-checkbox split above, and for expecting <code>role="switch"</code> in the rendered DOM.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Switch pattern</a
            >
            — the keyboard contract this guide checks the component against: "Space: toggles the switch", with
            <kbd>Enter</kbd> listed only as an optional extra. That is exactly what the measurement in Development
            found.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — color may not be the only carrier of information. It is why the sliding handle position matters as much
            as the track color, and why a switch must not be the only place a state is visible.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 for the parts of a control that convey its state. The yardstick for the measured track and handle
            contrasts in the Design tab.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — 24 × 24 CSS pixels. The switch measures 40 × 24, i.e. it passes on exactly the floor, which is the reason
            the Design tab argues for a label as an extra target.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — the list of labelable elements (an <code>&lt;input&gt;</code> is one) and the activation behavior that
            forwards a label click to its control: the mechanism behind both the working name and the wrapping-label
            pair above.
          </li>
          <li>
            <a href="https://optimus.openng.org/toggleswitch/" target="_blank" rel="noopener noreferrer">
              Optimus UI — ToggleSwitch component</a
            >
            — the vendor API surface (inputs, output, handle template) this guide maps onto the kit and then verifies
            against the shipped source in <code>node_modules</code>.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy — three elements, one of them invisible</h3>
        <ul>
          <li>
            <strong>Root</strong> — the <code>&lt;p-toggleswitch&gt;</code> host itself (<code
              >display: inline-block</code
            >, <code>position: relative</code>), sized by the width/height tokens. It carries the state classes
            (<code>p-toggleswitch-checked</code>, <code>p-disabled</code>, <code>p-invalid</code>) plus
            <code>data-p-checked</code> / <code>data-p-disabled</code> attributes you can style or test against.
          </li>
          <li>
            <strong>Input</strong> — <code>input.p-toggleswitch-input</code>, <code>type="checkbox"</code> with
            <code>role="switch"</code>, absolutely positioned over the whole component at <code>opacity: 0</code> and
            <code>z-index: 1</code>. <em>This</em> is what focus, clicks, and the keyboard actually hit — the visible
            parts are decoration underneath it.
          </li>
          <li>
            <strong>Slider</strong> — <code>div.p-toggleswitch-slider</code>, the track: full size, 1px border, 30px
            radius, and the element that carries the focus outline.
          </li>
          <li>
            <strong>Handle</strong> — <code>div.p-toggleswitch-handle</code>, a 1rem circle positioned with
            <code>inset-inline-start</code> (logical, so it flips under RTL) and animated over
            <code>slide.duration</code>. An optional <code>#handle</code> template renders inside it with a
            <code>checked</code> context value.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-toggleswitch.mjs</code> (Optimus UI 2.0.2, the component
          template at :219-244) and from the shipped stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/toggleswitch/index.mjs</code> (2.0.2); roles confirmed in the
          accessibility tree.
        </p>

        <h3>Geometry (Optimus's Aura 2.x preset, token-derived)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Token</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Control</td>
                <td><code>--p-toggleswitch-width</code> / <code>-height</code></td>
                <td>
                  2.5rem × 1.5rem = <strong>40 × 24 px</strong> — exactly on the SC 2.5.8 floor.
                </td>
              </tr>
              <tr>
                <td>Handle</td>
                <td><code>--p-toggleswitch-handle-size</code></td>
                <td>1rem = <strong>16 × 16 px</strong></td>
              </tr>
              <tr>
                <td>Inset</td>
                <td><code>--p-toggleswitch-gap</code></td>
                <td>0.25rem (4px) on each side</td>
              </tr>
              <tr>
                <td>Handle travel</td>
                <td>derived</td>
                <td>
                  <code>width − (handle + 2·gap)</code> = 16px of travel — <code>inset-inline-start</code> 4px → 20px
                </td>
              </tr>
              <tr>
                <td>Radius</td>
                <td><code>--p-toggleswitch-border-radius</code></td>
                <td>30px (fully round at this height); handle 50%</td>
              </tr>
              <tr>
                <td>Border</td>
                <td><code>--p-toggleswitch-border-width</code></td>
                <td>1px, color <code>transparent</code> in every state except invalid</td>
              </tr>
              <tr>
                <td>Slide</td>
                <td><code>--p-toggleswitch-slide-duration</code></td>
                <td>0.2s on <code>inset-inline-start</code></td>
              </tr>
              <tr>
                <td>Color transition</td>
                <td><code>--p-toggleswitch-transition-duration</code></td>
                <td>0.2s</td>
              </tr>
              <tr>
                <td><code>size="small"</code> / <code>"large"</code></td>
                <td>—</td>
                <td>
                  <strong>No effect</strong> — no <code>sm</code>/<code>lg</code> tokens or selectors in Optimus's
                  Aura preset.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>The size no-op is a source fact, not a theming accident.</strong>
          <code>&#64;openng/optimus-ui-themes/dist/aura/toggleswitch/index.mjs</code> contains no <code>sm</code>/<code>lg</code>
          keys at all, and the shipped stylesheet builds its rules out of exactly five class names —
          <code>.p-toggleswitch</code>, <code>-input</code>, <code>-slider</code>, <code>-handle</code>,
          <code>-checked</code> — with <strong>no size-scoped selector among them</strong>. The <code>size</code> input
          exists (an input signal, <code>:134</code>) and is accepted silently — nothing in the component reads it. If you need a smaller switch, override the three
          geometry custom properties yourself; the snippet is in Development.
        </p>
        <p class="src-note">
          <strong>Target size.</strong> 40 × 24 px clears WCAG 2.2 SC 2.5.8 (24 × 24) on exactly the minimum in one
          axis, and misses the AAA 44 × 44 of SC 2.5.5 by a wide margin. A <code>&lt;label for&gt;</code> next to it
          costs nothing and roughly triples the target, which is the strongest practical reason to always ship one.
        </p>

        <h3>State colors — both themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Part</th>
                <th>Dark theme</th>
                <th>Light theme</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="2">off</td>
                <td>track</td>
                <td colspan="2"><code>--control-border</code> (kit; Aura: <code>&#123;surface.700&#125;</code> / <code>&#123;surface.300&#125;</code>)</td>
              </tr>
              <tr>
                <td>handle</td>
                <td colspan="2"><code>--surface-card</code> (kit; Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.0&#125;</code>)</td>
              </tr>
              <tr>
                <td rowspan="2">on</td>
                <td>track</td>
                <td colspan="2"><code>&#123;primary.color&#125;</code></td>
              </tr>
              <tr>
                <td>handle</td>
                <td><code>&#123;surface.900&#125;</code></td>
                <td><code>&#123;surface.0&#125;</code></td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>track / handle</td>
                <td colspan="2">
                  Own tokens, <strong>opacity stays 1</strong> — the shipped CSS sets
                  <code>.p-toggleswitch.p-disabled &#123; opacity: 1 &#125;</code>, so this control does
                  <em>not</em> use the global 0.6 disabled opacity that buttons do.
                </td>
              </tr>
              <tr>
                <td>invalid</td>
                <td>track border</td>
                <td colspan="2">
                  <code>--p-toggleswitch-invalid-border-color</code> — re-pointed by the kit's
                  <code>.p-toggleswitch</code> rule to <code>--semantic-red-fg</code> (Aura's red.400 was 2.77:1 on
                  white), gated through the <code>inputtext.invalid.border.color</code> rows ("form field edge",
                  5.93:1 and up on ground and card); the border is the <em>only</em> invalid signal, and it is 1px on
                  a transparent-bordered control.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names from <code>&#64;openng/optimus-ui-themes/dist/aura/toggleswitch/index.mjs</code>. The OFF
          state is re-pointed by the kit (<code>styles.scss</code>, <code>.p-toggleswitch</code>): the switch's border is
          <code>transparent</code>, so the off track is its only edge, and Aura's stock track measured 1.26–1.76:1 on
          the style grounds, its white light handle 1.48:1 on that track. The ON state is Aura's: the accent
          (<code>primary.color</code>) with a <code>surface.0</code> / <code>surface.900</code> handle.
        </p>

        <h3>Contrast in the kit's styles (gated)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Dark (4 styles × 10 accents)</th>
                <th>Light (4 styles × 10 accents)</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>off track vs page (ground, card)</td>
                <td>{{ contrast.offVsPageDark }}:1</td>
                <td>{{ contrast.offVsPageLight }}:1</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>handle vs its track, off</td>
                <td>{{ contrast.handleOffDark }}:1</td>
                <td>{{ contrast.handleOffLight }}:1</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>handle vs its track, on</td>
                <td>{{ contrast.handleOnDark }}:1</td>
                <td>{{ contrast.handleOnLight }}:1</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>on track vs page</td>
                <td>{{ contrast.onVsPageDark }}:1</td>
                <td>{{ contrast.onVsPageLight }}:1</td>
                <td>3:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ranges quoted from the "toggleswitch" rows of <code>docs/generated/CONTRAST.MD</code> (the on track is the
          accent's <code>primary.color</code> row in "checkbox &amp; radiobutton"); the gate recomputes them on every
          build. Against <code>--surface-section</code> the off track is the "control boundary" row of the same file.
          The handle still moves, so the state is never carried by color alone — keep it that way.
        </p>
        <h3>Focus — the kit ring</h3>
        <p>
          The Aura preset points this component's <code>focusRing</code> at the <strong>global</strong> focus ring —
          width 1px, style solid, color <code>&#123;primary.color&#125;</code>, offset 2px — not at
          <code>form.field.focusRing</code>, which Aura zeroes out for the select. Aura's rule is
          <code>.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider</code>;
          the kit's one ring rule in <code>styles.scss</code> names the same slider
          (<code>.p-toggleswitch:has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider</code>) and draws
          <code>2px solid var(--primary-color-fg)</code> at <code>outline-offset: 2px</code>, <code>!important</code>,
          so:
        </p>
        <ul>
          <li>The outline lands on the <em>slider</em>, not on the invisible input.</li>
          <li>
            It is <code>:focus-visible</code>, so a mouse click focuses without drawing a ring — correct behavior, and
            the reason a programmatic <code>.focus()</code> in a test may show no outline.
          </li>
          <li>
            It is the same 2px ring every field and button in the kit shows, in both themes, gated as "focus ring" in
            <code>docs/generated/CONTRAST.MD</code> (3.88:1 and up on the page surfaces).
          </li>
        </ul>

        <h3>Layout: label left, switch right — and never centered</h3>
        <p>
          Both kit patterns put the switch at the trailing edge of a row and the label at the leading edge
          (<code>user-settings</code>, <code>theme-picker</code>). Keep it: a column of switches at a shared right edge
          is scannable as a list of states, and the label is free to wrap without moving the control. Two rules that
          follow from the geometry above:
        </p>
        <ul>
          <li>
            <strong>Give the row a fixed switch column</strong> so the handles line up; a switch that shifts with label
            length reads as noise.
          </li>
          <li>
            <strong>Do not shrink the row below the control.</strong> At 24px tall the switch only just meets the
            target-size floor, with nothing to spare; vertical padding on the row and the clickable label are what make
            it a comfortable target.
          </li>
        </ul>
        <p>
          <strong>Narrow screens:</strong> the switch has no responsive behavior — it stays 40 × 24 px at every
          viewport and never shrinks. Only the label reflows: give it <code>flex: 1; min-width: 0</code> so it wraps to
          a second line beside the fixed switch column instead of pushing the control out of the row.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 4.1.2 (one <code>switch</code> node in the accessibility tree, named by its label
          or by <code>ariaLabel</code>, with <code>aria-checked</code> flipping on toggle), SC 2.1.1 with the native
          checkbox model — Space toggles, Enter does nothing, which APG permits — SC 2.4.7 with the kit ring in both
          themes (gated, "focus ring"), and SC 1.4.11 for the off track, both handles and the on track in every style and accent
          (gated; lowest {{ contrast.lowest }}:1, see the contrast table). SC
          2.5.8 <strong>passes</strong> — the control is 40 × 24 px (token-derived), exactly on the floor, and the
          labeled row is still the sane target. <strong>Conditional:</strong> SC 1.4.1 — the on/off change is carried by the moving
          handle as well as by color, but the invalid state is a 1px border color and nothing else; and SC 2.5.3,
          which holds only as long as a visible caption and an <code>ariaLabel</code> on the same switch say the same
          thing. <strong>AAA</strong> is assessed only where this guide measures it: SC 2.5.5 (44 × 44) is missed at 40
          × 24 px; no other AAA criterion is assessed.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>ToggleSwitchModule</code> exports the component. The selector accepts three spellings —
          <code>p-toggleswitch</code>, <code>p-toggleSwitch</code> and <code>p-toggle-switch</code> (<code>:250</code>);
          PrimeNG 22 had dropped the camelCase alias, Optimus keeps the v21 set. This kit uses the lowercase one
          everywhere, so that one spelling still finds every call site. The PrimeNG 20 name
          <code>p-inputSwitch</code> is <strong>gone</strong>: there is no <code>inputswitch</code> entry point in
          Optimus, and the kit has zero occurrences of it.
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
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Sets the <code>id</code> of the real <code>&lt;input&gt;</code>. <strong>Use it</strong> — this is
                  what makes <code>&lt;label for&gt;</code> work.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Bound as <code>aria-label</code> / <code>aria-labelledby</code> on the input. Either one
                  <em>overrides</em> a <code>&lt;label for&gt;</code>.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  From <code>BaseEditableHolder</code>. Puts a real <code>disabled</code> attribute on the input: not
                  focusable, announced, blocked.
                </td>
              </tr>
              <tr>
                <td><code>readonly</code></td>
                <td>boolean</td>
                <td>
                  Blocks the click handler only — no attribute, no <code>aria-readonly</code>, still focusable. See the
                  warning below.
                </td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Adds <code>p-invalid</code>; renders as a 1px border color and nothing else.</td>
              </tr>
              <tr>
                <td><code>required</code></td>
                <td>boolean</td>
                <td>
                  Sets the <code>required</code> attribute on the input. On a switch this is usually a smell — see
                  Usage.
                </td>
              </tr>
              <tr>
                <td><code>trueValue</code> / <code>falseValue</code></td>
                <td>any</td>
                <td>
                  What the model holds in each position (default <code>true</code>/<code>false</code>).
                  <code>checked()</code> is <code>modelValue() === trueValue</code> — strict equality, so objects will
                  not match.
                </td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td>string</td>
                <td>Written straight onto the input's <code>name</code> attribute.</td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Passed to the input. Leave it alone unless you have a real reason.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Via <code>pAutoFocus</code> on the input.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>
                  <strong>Accepted and ignored</strong> — no size tokens or selectors exist for this component (Design
                  tab).
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Back from v21:</strong> <code>styleClass</code> — PrimeNG 22 removed it, Optimus ships it
                  again as a <code>&#64;deprecated</code> input that still lands on the host
                  (<code>cn(cx('root'), styleClass)</code>, <code>:285</code>). Prefer plain <code>class</code>. Only
                  <code>size</code> is a signal input; the rest are plain <code>&#64;Input()</code> properties, with
                  <code>disabled</code>/<code>invalid</code>/<code>required</code>/<code>name</code> coming as signals
                  from <code>BaseEditableHolder</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the <code>ToggleSwitch</code> class in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-toggleswitch.mjs:86-216</code> and
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-toggleswitch.d.ts</code> (Optimus UI 2.0.2,
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>disabled</code>, <code>invalid</code>,
          <code>required</code> and <code>name</code> come from <code>BaseEditableHolder</code>.
        </p>

        <h3>Output — one, and it fires after the model</h3>
        <pre class="code-block"><code>{{ outputSnippet }}</code></pre>
        <p>
          <code>onChange</code> emits <code>&#123; originalEvent, checked &#125;</code> where <code>checked</code> is
          the <em>new</em> model value (<code>trueValue</code>/<code>falseValue</code>, not necessarily a boolean). It
          fires <em>after</em> <code>ngModelChange</code>, so pick one — using both means writing the same state twice.
          The one legitimate combination is deliberate: <code>[(ngModel)]</code> holds the value and
          <code>(onChange)</code> fires the side effect, which is the shape <code>language-picker</code> uses for its
          easy-language toggle.
        </p>

        <h3>Custom handle</h3>
        <p>
          A <code>#handle</code> template renders inside the moving circle and receives a <code>checked</code> context
          value — the only content slot this component has. Keep it to an icon: the handle is 16 × 16 px and does not
          grow.
        </p>
        <pre class="code-block"><code>{{ handleSnippet }}</code></pre>
        <p class="src-note">
          Content query at <code>openng-optimus-ui-toggleswitch.mjs:319-321</code>
          (<code>&#64;ContentChild('handle', &#123; descendants: false &#125;)</code>), rendered at :240-242 with
          <code>context: &#123; checked: checked() &#125;</code>. Any icon inside it is decorative — the state is
          already in <code>aria-checked</code>, so mark it <code>aria-hidden="true"</code> and never let the icon be the
          only cue.
        </p>

        <h3>Theming with CSS custom properties</h3>
        <p>
          <code>styles.scss</code> touches this component in three places: a <code>.p-toggleswitch</code> block
          re-points the off track and handle colors on the element (an ancestor cannot override those; name the
          element), a second one the invalid border to <code>--semantic-red-fg</code>, and the kit's
          one ring rule draws the focus ring with <code>!important</code>, so the <code>-focus-ring-*</code> tokens do
          not land. Every size token still wins from an ancestor:
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix and <code>darkModeSelector: '.dark-theme'</code> come from the kit's
          <code>provideOptimus</code> theme options in <code>app.config.ts</code>. Scope overrides to a class — a global
          <code>:root</code> override changes every switch in the app at once.
        </p>

        <h3>Forms — this one really is a form control</h3>
        <p>
          Unlike <code>p-select</code>, a toggle switch renders a genuine <code>&lt;input type="checkbox"&gt;</code> and
          writes <code>[attr.name]</code> onto it, so a native form submission does see it. Two caveats before you rely
          on that:
        </p>
        <ul>
          <li>
            The component never sets a <code>value</code> attribute, so a checked switch submits the HTML default
            <code>on</code> — <em>not</em> your <code>trueValue</code>. An unchecked one submits nothing at all, which
            is normal checkbox behavior and a classic source of "the flag never turns off" bugs.
          </li>
          <li>
            <code>trueValue</code>/<code>falseValue</code> live purely in the Angular model. They are invisible to a
            native submit.
          </li>
        </ul>
        <p>
          For everything Angular, it is a plain <code>ControlValueAccessor</code>: <code>[(ngModel)]</code>,
          <code>formControlName</code> and validators all work, and <code>ng-invalid.ng-dirty</code> gets its own border
          rule shipped by the component itself (<code>openng-optimus-ui-toggleswitch.mjs:19-21</code>).
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>Naming: three patterns, and which one wins</h4>
        <p>The "name" column is what the accessibility tree reports, i.e. what a screen reader announces:</p>
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
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>The label's text — role <code>switch</code></td>
                <td>
                  <strong>Works</strong>, and gives a click target too. The focusable element is a real
                  <code>&lt;input&gt;</code>, which is labelable.
                </td>
              </tr>
              <tr>
                <td><code>[ariaLabel]</code> + <code>inputId</code>, caption in a <code>&lt;span&gt;</code></td>
                <td>The <code>ariaLabel</code> string — role <code>switch</code></td>
                <td>
                  <strong>Works</strong> for the name, but the visible caption is not clickable: the target stays 36 ×
                  22.
                </td>
              </tr>
              <tr>
                <td>Both at once</td>
                <td>The <code>ariaLabel</code> string</td>
                <td>
                  <strong>Works, and hides a trap.</strong> <code>aria-label</code> beats the label element, so if the
                  two texts ever drift the visible text is not the spoken one — a WCAG 2.5.3 (Label in Name) failure
                  waiting to happen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The mechanism is in the source: <code>ariaLabel</code> and <code>ariaLabelledBy</code> are bound as attributes
          on the input (<code>openng-optimus-ui-toggleswitch.mjs:229-230</code>), and <code>inputId</code> becomes its
          <code>id</code> (:221) — all three are plain properties in Optimus, not signals. <strong>Pick one</strong>: a sibling <code>&lt;label for&gt;</code> if the caption is
          visible (preferred — bigger target), or <code>ariaLabel</code> if it genuinely is not. To check a screen of
          switches in your own build, read the accessibility tree and confirm every node with role <em>switch</em>
          carries the caption you see next to it.
        </p>

        <h4>Keyboard — Space only</h4>
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
                <td><kbd>Tab</kbd></td>
                <td>Focus in / out. The input is a normal tab stop unless <code>[disabled]</code>.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>
                  <strong>Toggles</strong> (measured): <code>aria-checked</code> flips, the host gains
                  <code>p-toggleswitch-checked</code> and <code>data-p-checked="true"</code>.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  <strong>Nothing</strong> (measured). Native checkbox behavior — and APG lists Enter as optional, so
                  this is conformant, not broken.
                </td>
              </tr>
              <tr>
                <td>Arrow keys</td>
                <td>Nothing.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The component has <strong>no keyboard handler at all</strong> — the only listener is the host
          <code>click</code> handler <code>onHostClick</code> (<code>openng-optimus-ui-toggleswitch.mjs:164</code>); everything
          keyboard comes from the native checkbox, whose activation behavior dispatches a <code>click</code> that
          bubbles to the host. Two consequences worth knowing: the switch is keyboard-operable for free, and inside a
          <code>&lt;form&gt;</code> <kbd>Enter</kbd> will submit the form rather than toggle.
        </p>

        <h4>[readonly] does not do what it says</h4>
        <p>
          <code>readonly</code> is checked in the toggle guard only (<code>openng-optimus-ui-toggleswitch.mjs:180</code>). The
          rendered input gets no <code>readonly</code> attribute — which would be inert on a checkbox anyway — no
          <code>disabled</code>, and no <code>aria-readonly</code>. So a readonly switch is announced as an ordinary
          operable switch, takes focus, accepts <kbd>Space</kbd>, and refuses silently. Worse, the browser flips the
          native input's <code>checked</code> property on that click while the Angular binding sees no change and
          therefore never writes it back. <strong>Use <code>[disabled]</code></strong
          >, and put the reason in visible text next to it.
        </p>
        <p class="src-note">
          Measured: a single click on a readonly switch leaves the native <code>checked</code> property at
          <code>false</code> while <code>aria-checked</code> still reads <code>"true"</code> and the host still carries
          <code>p-toggleswitch-checked</code>. The visible switch never lies; the DOM underneath it does. If you inherit
          a <code>[readonly]</code> switch, click it once and compare the input's <code>checked</code> property with its
          <code>aria-checked</code> attribute.
        </p>

        <h4>Two things people expect that are not true here</h4>
        <ul>
          <li>
            <strong>Wrapping the switch in its own <code>&lt;label&gt;</code> does <em>not</em> double-toggle.</strong>
            It is a reasonable fear — the host has a click listener and a label forwards clicks to its control — but
            measured, one gesture produces exactly one model change, whether the click lands on the switch or on the
            label text. The reason is in the anatomy: the invisible input covers the whole control at
            <code>z-index: 1</code>, so a "click on the slider" already targets the input, and the label's activation
            behavior is skipped for its own control. A sibling <code>&lt;label for&gt;</code> is still the better shape
            (it survives restructuring and reads clearer), but this is a preference, not a bug.
          </li>
          <li>
            <strong
              >Every rendered switch carries <code>autofocus="true"</code> in the DOM — and none of them
              autofocuses.</strong
            >
            The attribute is unconditional; focus stays wherever the page put it. The cause is a strict comparison in
            the <code>pAutoFocus</code> directive the component binds unconditionally: it removes the attribute only
            <code>if (this.autofocus === false)</code> and otherwise <em>sets</em> it
            (<code>openng-optimus-ui-autofocus.mjs:25-29</code>) — and an unset input is <code>undefined</code>, not
            <code>false</code>. The actual focusing is guarded separately by a truthiness check (:39), which is why
            nothing moves. Harmless today, but do not use <code>[autofocus]</code> on a switch as a test hook: the
            attribute is there either way.
          </li>
        </ul>

        <h4>Everything else the kit has to supply itself</h4>
        <ul>
          <li>
            <strong>There are no vendor strings in this component.</strong> Not one label, title, or fallback — the DOM
            it renders is an input and two divs. Every word a user hears is yours, which is a rare and good thing
            (compare the select's hard-coded "dropdown trigger").
          </li>
          <li>
            <strong>A description needs wiring by hand.</strong> There is no <code>ariaDescribedBy</code> input. If the
            row has a second explanatory line, put an <code>id</code> on it and reach the input from outside, or accept
            that the description is visual only.
          </li>
          <li>
            <strong>State changes are silent.</strong> <code>aria-checked</code> flips, which most screen readers
            announce on a focused control — but if flipping the switch changes something elsewhere on the page, that
            change needs its own live region.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ The change takes effect immediately — otherwise this is a checkbox.</li>
          <li>
            ☐ Named exactly once: a sibling <code>&lt;label for&gt;</code> + <code>inputId</code>, <em>or</em>
            <code>ariaLabel</code> — not both with different text.
          </li>
          <li>☐ The label is a noun or a state, not a command, and is not negated.</li>
          <li>
            ☐ Reachable with <kbd>Tab</kbd>, toggles with <kbd>Space</kbd>; the focus ring is visible in
            <strong>both</strong> themes.
          </li>
          <li>☐ An <em>off</em> switch is still visible on the surface you put it on — it has no border of its own.</li>
          <li>
            ☐ Frozen state uses <code>[disabled]</code>, never <code>[readonly]</code>, and the reason is written next
            to it.
          </li>
          <li>
            ☐ The row gives the label enough padding to be a target — the switch alone is 22px tall, under the 24px
            floor.
          </li>
          <li>☐ If the write can fail, the failure moves the switch back <em>and</em> says so.</li>
          <li>☐ Not used to choose between two named options — that is a <code>p-selectbutton</code>.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the two rules this guide exists to protect — the control is
          a <code>switch</code>, and the label really names it:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Every string is yours</h3>
        <p>
          This is the unusual one: <code>p-toggleswitch</code> ships <strong>no text at all</strong>. No placeholder, no
          fallback name, no hard-coded English aria-label — the rendered DOM is one input and two empty divs. So there
          is nothing to fix in <code>provideOptimus(&#123; translation: … &#125;)</code>, and equally nothing to hide
          behind: if a switch is unnamed, that is entirely your call site.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Read from the component template (<code>openng-optimus-ui-toggleswitch.mjs:220-244</code>): the only attributes carrying
          text are the ones you bind, so the rendered input's <code>aria-label</code> is exactly the string you passed
          in.
        </p>

        <h3>Label length is a layout problem, not a truncation problem</h3>
        <p>
          The switch is a fixed 40px box that never shrinks, so a longer translated label pushes the row instead of
          clipping the control. German settings labels run 20-40% longer than English ("Glossary highlighting" →
          "Glossar-Hervorhebungen"), and the description line under them grows more. Give the label column
          <code>min-width: 0</code> and let it wrap; keep the switch in a fixed trailing column. Test the longest
          language you ship at 360px width — that is where a two-line label first collides with the control.
        </p>

        <h3>Do not translate on/off — the control already says it</h3>
        <ul>
          <li>
            The state is carried by <code>aria-checked</code>, which the screen reader renders in the user's own
            language. Adding a visible "On"/"Off" text means translating a word the platform already speaks, and it
            drifts the moment the two disagree.
          </li>
          <li>
            If you <em>do</em> show a label on each side, you have built a two-option chooser and translated two labels
            that the accessible name does not include. Use a <code>p-selectbutton</code> — one name, both options
            translated once.
          </li>
          <li>
            Never build the label by concatenating fragments (<code>t('enable') + ' ' + t('darkMode')</code>). Word
            order differs per language; ship one key per label.
          </li>
        </ul>

        <h3>RTL: nothing to do</h3>
        <p>
          The handle is positioned with <code>inset-inline-start</code> and the track uses a symmetric radius, so under
          <code>direction: rtl</code> the switch slides the other way on its own — the "on" position ends up on the
          left, which is the correct convention for RTL scripts. Nothing here needs per-call-site work.
        </p>
        <p class="src-note">
          Read from the shipped stylesheet (<code>&#64;openng/optimus-ui-styles/dist/toggleswitch/index.mjs</code>: the handle's
          <code>inset-inline-start: dt('toggleswitch.gap')</code> and the checked rule that computes
          <code>width − (handle.size + gap)</code>). <strong>Not verified by rendering an RTL locale</strong> — this kit
          ships LTR languages only.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the invalid border is
            the kit's <code>--semantic-red-fg</code>, gated through the <code>inputtext.invalid.border.color</code>
            rows, no longer Aura's ungated red.
          </li>
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the focus ring is the kit's
            2px <code>--primary-color-fg</code> ring on the slider (was Aura's 1px), cited from "focus ring"; the
            "raise the ring token" advice and snippet are gone, the theming note names the kit's two rules, and the
            invalid border is named as Aura's ungated red.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — The kit now re-points the off state (track
            <code>--control-border</code>, handle <code>--surface-card</code>); the contrast table quotes the gated
            CONTRAST.MD rows (lowest 3.85:1) instead of the stock palette's two failures.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — State colors restated as Aura tokens for the visual styles (ADR-0016); the contrast table
            is labeled as Aura's stock palette (the kit's styles are not in the contrast gate); the
            autofocus truthiness check cited at :39; narrow-screen statement added in Design;
            version-comparison asides and test-rig references trimmed.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Three v0.4 claims flipped
            back: the geometry is on the Aura 2.x values again (2.5 × 1.5rem = <strong>40 × 24 px</strong>, 1rem handle,
            16px travel), so SC 2.5.8 passes on the minimum instead of failing; the camelCase
            <code>p-toggleSwitch</code> selector alias and <code>styleClass</code> both exist again (the latter as a
            <code>&#64;deprecated</code> but working input). Only <code>size</code> is a signal input — it is still a
            no-op — while <code>inputId</code>/<code>ariaLabel</code>/<code>ariaLabelledBy</code> are plain properties;
            all line refs re-derived against the Optimus bundle. Color tokens hold the same values, so the contrast
            numbers from 21 still carry.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0: the control shrank to 36
            × 22 px with a 14px handle — <strong>now under the 24px SC 2.5.8 floor</strong> that 2.x hit exactly;
            <code>styleClass</code> and the camelCase <code>p-toggleSwitch</code> selector alias removed;
            <code>size</code> confirmed still a no-op; all line refs re-derived. Color measurements from 21 carry — the
            toggleswitch color tokens are unchanged.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Rewritten to state findings rather than how they were found; call-site
            references replaced by kit conventions.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: switch versus checkbox, a live playground, four Do/Don't
            pairs, geometry, colors, contrast, and focus in both themes.
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
        align-items: stretch;
        justify-content: center;
        gap: var(--space-3);
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
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
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }

      /* A switch row: label leading, control trailing — the kit's own pattern. */
      .switch-row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .switch-row label {
        flex: 1;
        min-width: 0;
        font-size: 0.9rem;
      }
      .setting-row {
        display: flex;
        align-items: flex-start;
        gap: var(--space-4);
      }
      .setting-text {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        flex: 1;
        min-width: 0;
      }
      .setting-title {
        font-size: 0.9rem;
        font-weight: var(--font-weight-medium);
      }
      .setting-desc {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .readout {
        flex: 0 0 auto;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 12rem;
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
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
        justify-content: center;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .dd__readout {
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

      /* The two-sided antipattern, rendered honestly. */
      .two-sided {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      .two-sided--active {
        color: var(--text-color);
        font-weight: var(--font-weight-medium);
      }
      .switch-row > span:first-child {
        flex: 1;
        min-width: 0;
        font-size: 0.9rem;
      }
      .mini-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        align-items: flex-start;
      }
      .mini-form .switch-row {
        width: 100%;
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
export class ToggleSwitchArticleComponent {
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
   * Contrast ranges quoted from docs/generated/CONTRAST.MD (4 styles × 10
   * accents, gated). Held as data so the table and the prose quote the same
   * numbers and cannot drift apart.
   */
  readonly contrast = {
    offVsPageDark: '3.97–5.51',
    offVsPageLight: '3.85–5.23',
    handleOffDark: '3.97–4.91',
    handleOffLight: '4.09–5.23',
    handleOnDark: '6.40–16.93',
    handleOnLight: '5.18–17.85',
    onVsPageDark: '4.75–17.58',
    onVsPageLight: '4.75–17.85',
    lowest: '3.85',
  };

  // --- Playground state ------------------------------------------------------
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgDisabled = signal(false);
  readonly pgReadonly = signal(false);
  readonly pgInvalid = signal(false);
  readonly pgRequired = signal(false);
  readonly pgValue = signal(true);

  /** 'normal' maps to the default (no size input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = ['inputId="dark-mode"'];
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"  <!-- ignored -->`);
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    if (this.pgReadonly()) attrs.push('[readonly]="true"');
    if (this.pgInvalid()) attrs.push('[invalid]="true"');
    if (this.pgRequired()) attrs.push('[required]="true"');
    attrs.push('[(ngModel)]="darkMode"');
    return `<label for="dark-mode">Dark mode</label>\n<p-toggleswitch\n  ${attrs.join('\n  ')} />`;
  });

  // --- Example state ---------------------------------------------------------
  readonly exBasic = signal(true);
  readonly exDescribed = signal(true);
  readonly exValues = signal<'asc' | 'desc'>('desc');
  readonly exHandle = signal(true);

  // --- Do / Don't state ------------------------------------------------------
  readonly ddScope = signal(false);
  readonly ddScopeValue = signal<'filtered' | 'all'>('filtered');
  readonly scopeOptions = [
    { label: 'Filtered (12)', value: 'filtered' },
    { label: 'All (238)', value: 'all' },
  ];
  readonly ddDeferBad = signal(false);
  readonly ddDeferGood = signal(false);
  readonly ddReadonly = signal(true);

  /** The naming pair: same visual row, one of them nameless. */
  readonly ddNameBad = signal(true);
  readonly ddNameGood = signal(true);

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'The default: label, switch, immediate effect',
      note: 'A sibling label with for + inputId. One name, one target, no ARIA needed.',
      code: `<label for="show-circle">Show the circle</label>
<p-toggleswitch inputId="show-circle" [(ngModel)]="showCircle" />`,
    },
    {
      id: 'described',
      title: 'A settings row with a description',
      note: 'The label names it; the second line explains it. Keep the explanation out of the name.',
      code: `<div class="setting-row">
  <span class="setting-text">
    <label class="setting-title" for="glossary">{{ t('settings.glossary') }}</label>
    <span class="setting-desc" id="glossary-desc">{{ t('settings.glossaryDescription') }}</span>
  </span>
  <p-toggleswitch inputId="glossary"
    [ngModel]="glossaryEnabled()" (ngModelChange)="setGlossary($event)" />
</div>`,
    },
    {
      id: 'values',
      title: 'Non-boolean model: trueValue / falseValue',
      note: 'The model holds your own values — and the label says what ON means ("Newest first"), not what the field is about ("Sort order"). A switch has no room to name the other side.',
      code: `<label for="sort-order">{{ t('sort.newestFirst') }}</label>
<p-toggleswitch inputId="sort-order"
  trueValue="desc" falseValue="asc"
  [(ngModel)]="sortOrder" />`,
    },
    {
      id: 'states',
      title: 'Every state side by side',
      note: 'Disabled keeps full opacity here (the shipped stylesheet sets opacity 1 for this component); invalid is a 1px border and nothing else.',
      code: `<p-toggleswitch inputId="s1" [ngModel]="false" />
<p-toggleswitch inputId="s2" [ngModel]="true" />
<p-toggleswitch inputId="s3" [disabled]="true" [ngModel]="false" />
<p-toggleswitch inputId="s4" [disabled]="true" [ngModel]="true" />
<p-toggleswitch inputId="s5" [invalid]="true" [ngModel]="false" />`,
    },
    {
      id: 'handle',
      title: 'Custom handle template',
      note: 'The only content slot. It gets a checked context value — and the icon stays decorative.',
      code: `<p-toggleswitch inputId="sound" [(ngModel)]="soundOn">
  <ng-template #handle let-checked="checked">
    <i class="pi" [class.pi-volume-up]="checked"
      [class.pi-volume-off]="!checked" aria-hidden="true"></i>
  </ng-template>
</p-toggleswitch>`,
    },
  ];

  readonly devImport = `import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';

@Component({
  standalone: true,
  imports: [ToggleSwitchModule, FormsModule],
  // ...
})`;

  readonly outputSnippet = `<p-toggleswitch inputId="easy-language"
  [(ngModel)]="isEasyMode"
  (onChange)="applyEasyMode($event.checked)"
  [ariaLabel]="easyLanguageLabel" />

// onChange payload: { originalEvent: Event, checked: <trueValue | falseValue> }`;

  readonly handleSnippet = `<p-toggleswitch inputId="sound" [(ngModel)]="soundOn">
  <ng-template #handle let-checked="checked">
    <i class="pi" [class.pi-volume-up]="checked"
      [class.pi-volume-off]="!checked" aria-hidden="true"></i>
  </ng-template>
</p-toggleswitch>`;

  readonly themingSnippet = `/* Scoped to one screen. styles.scss sets no size token on .p-toggleswitch,
   so these win from an ancestor. (Its track and handle colors sit on the
   element itself, and the focus ring is the kit's one !important ring.) */
.dense-settings {
  --p-toggleswitch-width: 2rem;
  --p-toggleswitch-height: 1.25rem;
  --p-toggleswitch-handle-size: 0.875rem;
  --p-toggleswitch-gap: 0.1875rem;
}

/* template */
<div class="dense-settings">
  <p-toggleswitch inputId="compact" [(ngModel)]="value" />
</div>`;

  readonly i18nSnippet = `// One key per label. Never concatenate — word order is not universal.
<label [for]="'dark-mode'">{{ t('settings.appearance.darkMode') }}</label>
<p-toggleswitch inputId="dark-mode"
  [ngModel]="themeService.isDark()" (ngModelChange)="themeService.setDark($event)" />

// If there is no visible caption, name it explicitly instead:
<p-toggleswitch inputId="dark-mode" [ariaLabel]="t('settings.appearance.darkMode')" … />`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';

@Component({
  standalone: true,
  imports: [ToggleSwitchModule, FormsModule],
  template: \`
    <label for="dark-mode">Dark mode</label>
    <p-toggleswitch inputId="dark-mode" [(ngModel)]="darkMode" />\`,
})
class HostComponent {
  darkMode = false;
}

describe('toggle switch semantics', () => {
  it('renders a switch that its label names', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector<HTMLInputElement>('input.p-toggleswitch-input')!;

    // It is a checkbox re-roled as a switch — that is what "on/off" announces.
    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');

    // The label really binds (an <input> is labelable — a p-select's span is not).
    expect(input.labels?.[0]?.textContent?.trim()).toBe('Dark mode');

    // Guard the regression this guide exists to prevent: no second name.
    expect(input.hasAttribute('aria-label')).toBe(false);
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
