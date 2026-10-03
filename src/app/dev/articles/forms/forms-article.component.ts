import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { IftaLabelModule } from '@openng/optimus-ui/iftalabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Forms (foundations).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs (guide-authoring: "Provenance, not process"):
 *   - @openng/optimus-ui@2.0.2 shipped source: BaseEditableHolder declares required/
 *     invalid/disabled/name as signal inputs, plus the ControlValueAccessor plumbing
 *     (openng-optimus-ui-baseeditableholder.mjs:11-56, $disabled composition :33);
 *     BaseInput adds fluid/variant/size/inputSize and the native mirrors, with
 *     hasFluid = fluid() ?? !!pcFluid (openng-optimus-ui-baseinput.mjs:7,:80). InputText
 *     maps the invalid input onto the p-invalid class
 *     (openng-optimus-ui-inputtext.mjs:31) and, new in the fork, re-adds a
 *     .ng-invalid.ng-dirty border rule of its own (:16-22; 22 bundles carry one).
 *   - Aura 2.x semantic.formField block, @openng/optimus-ui-themes@2.0.2
 *     (@openng/optimus-ui-themes/dist/aura/base/index.mjs): paddings, sm/lg font
 *     sizes (no base fontSize token), invalid colors, and a focus ring whose five
 *     members are all zero/none/transparent.
 *   - The kit's template-driven convention: FormsModule with signal-backed
 *     split bindings across the app; ReactiveFormsModule appears only inside
 *     this workshop's own articles. Reference implementation:
 *     src/app/pages/feedback/feedback.component.ts.
 *   - The kit-wide focus family rules and the .sr-only utility live in
 *     src/styles.scss.
 *   - The field hulls, all four a bare <ng-content> plus a host class:
 *     openng-optimus-ui-floatlabel.mjs:74 (variant :72; the Optimus-added
 *     .ng-invalid.ng-dirty label rule :14), openng-optimus-ui-iftalabel.mjs:64
 *     (no inputs of its own), openng-optimus-ui-iconfield.mjs:71 (iconPosition
 *     :63 producing the classes :13-14 that no stylesheet reads),
 *     openng-optimus-ui-fluid.mjs:9,:52 (a class with no CSS anywhere; the
 *     effect is the DI lookup at openng-optimus-ui-baseinput.mjs:7,:80).
 *     Their geometry lives in @openng/optimus-ui-styles/dist/{floatlabel,
 *     iftalabel,iconfield}/index.mjs — pointer-events:none on the label (:9 in
 *     both label packages), the placeholder lift trigger (floatlabel :37) and
 *     the :first-child/:last-child icon placement (iconfield :16-22).
 *   - required is declared at openng-optimus-ui-baseeditableholder.mjs:11;
 *     [pInputText]/[pTextarea] extend the model holder instead
 *     (openng-optimus-ui-inputtext.mjs:69, openng-optimus-ui-textarea.mjs:69)
 *     and never receive it. aria-required is emitted by autocomplete,
 *     datepicker, inputmask, inputnumber, and select only.
 *   - p-message carries static role="alert" aria-live="polite" host attributes
 *     (openng-optimus-ui-message.mjs:350-351) and renders no icon unless one is
 *     named (:249) — feedback-messages owns that anatomy.
 *   - Error-text contrast rows come from docs/generated/CONTRAST.MD, block
 *     "semantic text", styles werkbund light and dark; the re-pointed field
 *     edge and the kit's --semantic-red-fg invalid edge are gated there under
 *     "form field edge", the one kit focus ring under "focus ring".
 *   - [pAutoFocus] (covered here): openng-optimus-ui-autofocus.mjs — native
 *     attribute write :21-32, truthiness + isPlatformBrowser check :39, first
 *     focusable or host :41-47, once-only flag :48, input alias :61-64. The
 *     dialog's own first focus: openng-optimus-ui-dialog.mjs:620-627, :949-952.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-forms-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    AutoFocus,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    IftaLabelModule,
    GuideShellComponent,
    GuideTabDirective,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'forms'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A form is a contract about timing: what the reader is asked for, when the form is allowed to complain, and
          what happens to their attention once it answers. The three demos below render those three moments.
        </p>

        <h3>An error that waits for blur or submit</h3>
        <p>
          Type an invalid address and watch nothing happen; leave the field or press the button and the complaint
          appears — wired to the input by id, not floated nearby.
        </p>
        <form class="demo-form" (ngSubmit)="demoSubmit()" novalidate>
          <div class="field">
            <label for="fx-demo-email">E-mail</label>
            <input
              pInputText
              id="fx-demo-email"
              type="email"
              name="demo-email"
              autocomplete="off"
              placeholder="name&#64;example.org"
              [invalid]="demoShows()"
              [attr.aria-invalid]="demoShows()"
              [attr.aria-describedby]="demoShows() ? 'fx-demo-email-error' : null"
              [ngModel]="demoEmail()"
              (ngModelChange)="demoEmail.set($event)"
              (blur)="demoTouched.set(true)"
            />
            @if (demoShows()) {
              <small class="field-error" id="fx-demo-email-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Enter an address with an &#64; and a domain.
              </small>
            }
          </div>
          <div class="demo-actions">
            <button pButton type="submit"><span pButtonLabel>Submit</span></button>
            <button pButton type="button" severity="secondary" [outlined]="true" (click)="demoReset()">
              <span pButtonLabel>Reset the demo</span>
            </button>
          </div>
          <p class="demo-state" aria-live="polite">
            value valid: {{ demoValid() ? 'yes' : 'no' }} · touched: {{ demoTouched() ? 'yes' : 'no' }} · submitted:
            {{ demoSubmitted() ? 'yes' : 'no' }} · error visible: {{ demoShows() ? 'yes' : 'no' }}
          </p>
        </form>
        <p class="src-note">
          The gate is the component's own state, not the library's: Optimus's
          <code>invalid</code> input is a boolean signal input with no view of the Angular form control
          (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>); the touched-or-submitted timing is the kit convention from
          <code>src/app/pages/feedback/feedback.component.ts</code>.
        </p>

        <h3>The invalid wiring, off and on</h3>
        <p>
          The same field twice, second one with the full error triple bound. The border comes from
          <code>[invalid]</code>; what a screen reader learns comes from the two ARIA attributes beside it.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">healthy</span>
            <input
              pInputText
              type="text"
              [ngModel]="staticOk"
              name="fx-static-ok"
              aria-label="Healthy example field"
              readonly
            />
          </div>
          <div class="stage__item">
            <span class="stage__cap">invalid, fully wired</span>
            <input
              pInputText
              type="text"
              [ngModel]="staticBad"
              name="fx-static-bad"
              aria-label="Invalid example field"
              readonly
              [invalid]="true"
              aria-invalid="true"
              aria-describedby="fx-static-error"
            />
            <small class="field-error" id="fx-static-error">
              <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
              This date lies in the future.
            </small>
          </div>
        </div>
        <p class="src-note">
          <code>[invalid]</code> renders the <code>p-invalid</code> class (<code>openng-optimus-ui-inputtext.mjs:31</code>), which
          switches the border to the theme's invalid border color; the tokens are in the Design tab's table.
        </p>

        <h3>Three hulls, one label</h3>
        <p>
          The same field with the label attached three ways. All three are a real <code>&lt;label for&gt;</code> you
          wrote: <code>p-floatLabel</code> and <code>p-iftaLabel</code> project bare content and ship no label element
          of their own. Type into the middle one and the label lifts; tick the box and the float label never comes back
          down, because a <code>placeholder</code> attribute alone counts as "filled".
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">plain label above</span>
            <label for="fx-hull-plain">Display name</label>
            <input
              pInputText
              id="fx-hull-plain"
              type="text"
              name="fx-hull-plain"
              [ngModel]="hullName()"
              (ngModelChange)="hullName.set($event)"
            />
          </div>
          <div class="stage__item">
            <span class="stage__cap">p-floatLabel</span>
            <p-floatLabel>
              <input
                pInputText
                id="fx-hull-float"
                type="text"
                name="fx-hull-float"
                [attr.placeholder]="hullPlaceholder() ? 'e.g. Ada L.' : null"
                [ngModel]="hullName()"
                (ngModelChange)="hullName.set($event)"
              />
              <label for="fx-hull-float">Display name</label>
            </p-floatLabel>
          </div>
          <div class="stage__item">
            <span class="stage__cap">p-iftaLabel</span>
            <p-iftaLabel>
              <input
                pInputText
                id="fx-hull-ifta"
                type="text"
                name="fx-hull-ifta"
                [ngModel]="hullName()"
                (ngModelChange)="hullName.set($event)"
              />
              <label for="fx-hull-ifta">Display name</label>
            </p-iftaLabel>
          </div>
        </div>
        <div class="demo-actions">
          <label class="hull-toggle" for="fx-hull-ph">
            <input
              id="fx-hull-ph"
              type="checkbox"
              name="fx-hull-ph"
              [ngModel]="hullPlaceholder()"
              (ngModelChange)="hullPlaceholder.set($event)"
            />
            give the float-label field a placeholder
          </label>
          <button pButton type="button" severity="secondary" [outlined]="true" (click)="hullReset()">
            <span pButtonLabel>Reset the demo</span>
          </button>
        </div>
        <p class="src-note">
          The lift is pure CSS on the wrapper, and one of its triggers is
          <code>.p-floatlabel:has(input[placeholder]) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:37</code>). The ifta label never moves: its
          position is a single static rule (<code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:10</code>).
          Both wrappers also set <code>pointer-events: none</code> on the label (<code>:9</code> in each) — so clicking
          either label does not focus the field, which a plain label above the field does.
        </p>

        <h3>Focus into content you just revealed</h3>
        <p>
          The one place <code>[pAutoFocus]</code> belongs: content that the reader's own action has just put on screen.
          Press the button and the note field appears with focus already in it; close it and open it again, and the
          new field is focused again, because each <code>&#64;if</code> pass creates a new directive instance. Nothing on
          this page takes focus on load.
        </p>
        <div class="demo-form">
          <div class="demo-actions">
            <button pButton type="button" [attr.aria-expanded]="noteOpen()" (click)="toggleNote()">
              <span pButtonLabel>{{ noteOpen() ? 'Close the note field' : 'Add a note' }}</span>
            </button>
          </div>
          @if (noteOpen()) {
            <div class="field">
              <label for="fx-af-note">Note</label>
              <input pInputText id="fx-af-note" type="text" autocomplete="off" [pAutoFocus]="true" />
            </div>
          }
        </div>
        <p class="src-note">
          Focus is set from a <code>setTimeout</code> onto the host's first focusable descendant, or the host itself,
          and only while the input is truthy (<code>openng-optimus-ui-autofocus.mjs:38-50</code>). The situations where it
          is the wrong tool are the table in Development.
        </p>

        <h3>The whole machine: idle → sending → sent or error</h3>
        <p>
          A submit is a state, not a moment. While it runs the button is disabled and says so; the outcome replaces the
          form or renders an inline message — each state announced once through one polite region. The reference
          implementation of exactly this machine, with focus handoffs on every branch swap, ships at
          <code>/feedback</code>.
        </p>
        <pre class="code-block"><code>{{ machineSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          One field pattern, repeated: a label wired by id, the control, an optional hint, and an error that is present
          in the DOM only while it may show. The form owns the timing; the field owns the wiring.
        </p>

        <h3>The field pattern, part by part</h3>
        <pre class="code-block"><code>{{ fieldSnippet }}</code></pre>
        <ul>
          <li>
            <strong>The label</strong> targets the rendered input's id — on native elements the id you wrote, on wrapper
            components the <code>inputId</code> input. A control whose focusable element is a
            <code>span[role="combobox"]</code> (the select) can take no <code>label[for]</code>: give it a visible
            caption and point <code>ariaLabelledBy</code> at the caption's id.
          </li>
          <li>
            <strong>The error triple</strong> travels together: <code>[invalid]</code> draws the border,
            <code>aria-invalid</code> flags the state, and <code>aria-describedby</code> names the hint <em>and</em> the
            error id — so the explanation is read where the field is, not discovered by scanning.
          </li>
          <li>
            <strong><code>novalidate</code></strong> switches the browser's own bubbles off so your translated,
            field-anchored errors are the only voice. Keep the semantic <code>type</code> and
            <code>autocomplete</code> attributes anyway — they drive keyboards and autofill, not validation.
          </li>
        </ul>

        <h3>The state model: signals, one pure validator, a touched set</h3>
        <pre class="code-block"><code>{{ modelSnippet }}</code></pre>
        <p>
          Nothing here is library machinery: the draft is a plain object over the signals, the validator is a pure
          function returning error ids, and <code>shows()</code> is the only place the timing rule lives. A submit
          attempt marks every field touched at once, so all pending complaints appear together instead of one per hunt.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — complain on every keystroke</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-eager">Username</label>
                <input
                  pInputText
                  id="fx-dd-eager"
                  type="text"
                  name="fx-dd-eager"
                  [invalid]="eagerName().length > 0 && eagerName().length < 4"
                  [ngModel]="eagerName()"
                  (ngModelChange)="eagerName.set($event)"
                />
                @if (eagerName().length > 0 && eagerName().length < 4) {
                  <small class="field-error">
                    <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                    At least 4 characters.
                  </small>
                }
              </div>
            </div>
            <p class="dd__why">
              The field is marked wrong while the reader is still typing the right answer — the form shouts at work in
              progress, and a screen reader hears the complaint on every character.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — gate on leaving the field</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-calm">Username</label>
                <input
                  pInputText
                  id="fx-dd-calm"
                  type="text"
                  name="fx-dd-calm"
                  [invalid]="calmShows()"
                  [attr.aria-invalid]="calmShows()"
                  [attr.aria-describedby]="calmShows() ? 'fx-dd-calm-error' : null"
                  [ngModel]="calmName()"
                  (ngModelChange)="calmName.set($event)"
                  (blur)="calmTouched.set(true)"
                />
                @if (calmShows()) {
                  <small class="field-error" id="fx-dd-calm-error">
                    <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                    At least 4 characters.
                  </small>
                }
              </div>
            </div>
            <p class="dd__why">
              The same rule, applied once the reader has left the field or pressed submit — the error describes a
              finished answer, and the ARIA wiring appears with it.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the placeholder is the label</span>
            <div class="dd__stage">
              <div class="field">
                <input
                  pInputText
                  type="text"
                  name="fx-dd-ph"
                  placeholder="Your e-mail address"
                  aria-label="Bad example: placeholder as label"
                  [ngModel]="''"
                />
              </div>
            </div>
            <p class="dd__why">
              The name of the field vanishes on the first keystroke, placeholder contrast is below text contrast by
              design, and nothing survives for a label to point at — SC 3.3.2 asks for a label or instruction that
              stays.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a label that stays, a placeholder that demonstrates</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-lbl">E-mail</label>
                <input
                  pInputText
                  id="fx-dd-lbl"
                  type="email"
                  name="fx-dd-lbl"
                  placeholder="name&#64;example.org"
                  [ngModel]="''"
                />
              </div>
            </div>
            <p class="dd__why">
              The label carries the name and survives input; the placeholder is reduced to what it is good at — one
              worked example of the expected format.
            </p>
          </div>
        </div>

        <h3>The hulls around a field</h3>
        <p>
          Optimus ships four wrappers that sit around a control rather than being one. Each is a component whose whole
          template is <code>&lt;ng-content&gt;</code> plus a class on the host — they add geometry, never semantics, and
          none of them contributes a label, a name, or a description. What goes in the accessibility tree is still
          whatever you wrote inside them.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hull</th>
                <th>What it does</th>
                <th>What it does not do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-floatLabel</code></td>
                <td>positions your label over the field and lifts it on focus or content, by CSS alone</td>
                <td>ship a label; keep the label clickable; return the label once a placeholder exists</td>
              </tr>
              <tr>
                <td><code>p-iftaLabel</code></td>
                <td>positions your label inside the field's top padding, statically</td>
                <td>ship a label; keep the label clickable; accept any input of its own</td>
              </tr>
              <tr>
                <td><code>p-iconfield</code> + <code>p-inputicon</code></td>
                <td>absolutely positions a decorative icon at the field's leading or trailing edge</td>
                <td>make the icon an accessible name, a button, or a status</td>
              </tr>
              <tr>
                <td><code>p-fluid</code></td>
                <td>tells the controls that ask for it to render full-width</td>
                <td>carry any CSS of its own; reach controls that do not ask for it</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          All four templates are a bare <code>&lt;ng-content&gt;</code>:
          <code>openng-optimus-ui-floatlabel.mjs:74</code>, <code>openng-optimus-ui-iftalabel.mjs:64</code>,
          <code>openng-optimus-ui-iconfield.mjs:71</code>, <code>openng-optimus-ui-fluid.mjs:52</code>.
          <code>p-iftaLabel</code> and <code>p-fluid</code> declare no inputs at all; the four that appear on them
          anyway — <code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> — are inherited from
          <code>openng-optimus-ui-basecomponent.mjs:428</code>.
        </p>

        <h4>Choosing between the two label hulls</h4>
        <p>
          Prefer a plain label above the field. Where the design demands the label inside, <code>p-iftaLabel</code> is
          the safer of the two: its label is a static rule and stays legible at all times, while the float label is
          only visible over an empty, unfocused field and shrinks the moment it lifts. Neither is clickable — both
          wrappers set <code>pointer-events: none</code> on the label — so both give up the target area a normal label
          hands a motor-impaired or imprecise pointer user, and the float label additionally gives up a stable reading
          position. <strong>A placeholder cancels a float label entirely:</strong> one of the lift triggers is the mere
          presence of the attribute, so label and placeholder end up stacked, with the label small and raised from the
          first paint. If both are needed, that is the argument for a label above the field.
        </p>
        <p class="src-note">
          Reproduce: put a float label around a field, give the field a placeholder, and load the page without touching
          it. The label renders in its raised, shrunken state before any interaction.
        </p>

        <h4>The icon hull carries no meaning</h4>
        <p>
          <code>p-inputicon</code> renders a span with a class and your projected icon. It has no role, so a magnifier
          glyph beside a field says "search" to sighted readers only; put that word in the label. If the icon is meant
          to be pressed — reveal a password, clear a value, open a picker — it is a button, and an icon hull is the
          wrong container for it.
        </p>

        <h3>Sources, annotated</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 3.3.1 Error Identification</a
            >
            — the error is identified in text on the item in error; the reason errors are sentences with ids, not
            borders.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 3.3.2 Labels or Instructions</a
            >
            — the bar the placeholder-as-label pattern fails.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.3.5 Identify Input Purpose</a
            >
            — why name and e-mail fields carry <code>autocomplete</code> tokens even under <code>novalidate</code>.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html"
              target="_blank"
              rel="noopener noreferrer"
              >HTML Living Standard — form control infrastructure</a
            >
            — what <code>novalidate</code> switches off (the constraint-validation UI) and what it leaves on (types,
            autofill, submission).
          </li>
          <li>
            <a href="https://angular.dev/guide/forms/template-driven-forms" target="_blank" rel="noopener noreferrer"
              >Angular — template-driven forms</a
            >
            — the NgModel mechanics under the kit's split binding.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The theme prices every field the same: one padding pair, three sizes, one invalid color — and a focus ring it
          deliberately does not draw. What a form looks like is mostly what the formField token block says, plus the
          kit's two conventions on top.
        </p>

        <h3>The formField token block</h3>
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
                <td>font-size</td>
                <td>{{ m.smFont }}</td>
                <td>{{ m.baseFont }}</td>
                <td>{{ m.lgFont }}</td>
              </tr>
              <tr>
                <td>padding-x</td>
                <td>{{ m.smPadX }}</td>
                <td>{{ m.basePadX }}</td>
                <td>{{ m.lgPadX }}</td>
              </tr>
              <tr>
                <td>padding-y</td>
                <td>{{ m.smPadY }}</td>
                <td>{{ m.basePadY }}</td>
                <td>{{ m.lgPadY }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State token</th>
                <th>light</th>
                <th>dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>border</td>
                <td>surface.300</td>
                <td>surface.600</td>
              </tr>
              <tr>
                <td>focus border</td>
                <td colspan="2">primary.color (both themes)</td>
              </tr>
              <tr>
                <td>invalid border</td>
                <td>red.400</td>
                <td>red.300</td>
              </tr>
              <tr>
                <td>invalid placeholder</td>
                <td>red.600</td>
                <td>red.400</td>
              </tr>
              <tr>
                <td>disabled background</td>
                <td>surface.200</td>
                <td>surface.700</td>
              </tr>
              <tr>
                <td>focus ring</td>
                <td colspan="2">width 0 · style none · color transparent · offset 0 · shadow none</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          All values from the <code>semantic.formField</code> block of
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (Aura 2.x, themes 2.0.2). Only sm and lg are
          tokenized: there is no base <code>fontSize</code> token, and the base size is a literal
          <code>font-size: 1rem</code> in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>.
        </p>
        <p>
          Those are the preset's values; the resting edge, the invalid edge, and the dark field are not what renders
          here. Aura's <code>surface.300</code> edge is 1.48:1 on white, too faint to identify a control, so
          <code>src/styles.scss</code> re-points each field's own border token — select, multiselect, cascade select,
          listbox, autocomplete, the input-number buttons, the date picker's trigger button, textarea, checkbox, radio
          button — to
          <code>--control-border</code>, and every visual style block paints the edge of <code>input.p-inputtext</code> in
          its own outline token (<code>--style-outline</code>; <code>--style-outline-soft</code> in skizzenbuch), three
          of them at a heavier width (lernwerkstatt switches to
          <code>--control-border</code> in dark mode, where its outline is near-black). Aura's <code>red.400</code>
          invalid edge is 2.77:1 on white, so every field's invalid token points at <code>--semantic-red-fg</code>, and
          <code>input.p-inputtext.p-invalid</code> paints it over the style outline with <code>!important</code>. The
          dropdown chevrons and field icons take <code>--text-color-secondary</code>; the float and ifta labels rest on
          <code>--text-color-secondary</code>, turn <code>--text-color</code> on focus and the invalid red. In dark mode
          every field shell — text fields, textarea, select, multiselect, tree select, and the multiple-mode
          autocomplete box — rests on <code>--surface-section</code> with <code>--text-color</code> and
          <code>--control-placeholder</code>. Hover and disabled states keep reading the preset's tokens.
        </p>
        <p class="src-note">
          Rules in <code>src/styles.scss</code> (the element-scoped token blocks beside the select focus rule, the
          invalid-edge rule, and the <code>input.p-inputtext</code> rule in each <code>html.style-*</code> block); every
          resulting pair is gated in <code>docs/generated/CONTRAST.MD</code> under <em>form field edge</em>,
          <em>form field text</em>, <em>form field icon</em>, <em>float label</em>, and <em>field placeholder</em>, per
          style and mode — the
          control edges 3.25:1 and up, the invalid edge 5.66:1 and up.
        </p>
        <p>
          The zeroed focus ring is the load-bearing row: a form styled by the theme alone has
          <strong>no visible keyboard focus</strong> on its fields. The kit restores it with one ring in
          <code>src/styles.scss</code> — 2px solid <code>--primary-color-fg</code> at 2px offset — on
          <code>:focus-visible</code> for text fields, checkboxes, radio buttons, toggle switches, slider handles,
          buttons, and the date picker and autocomplete dropdown parts, and on the <code>.p-focus</code> host class for
          select, multiselect, cascade select, tree select, and the autocomplete token field (gated as
          <em>focus ring</em>, 3.88:1 and up); inside their option lists the keyboard-active option rings inside
          itself (<em>option list focus</em>), and so does the keyboard-focused chip of a multiple-mode autocomplete. A control kind outside that list brings its own rule;
          <strong>Accessibility Guidelines</strong> owns the standard.
        </p>

        <h3>Error text</h3>
        <p>
          An error is an icon plus a sentence in the red text tone, sitting under its field — color is the second
          carrier, never the only one. The counter variant (n / max) uses
          <code>tabular-nums</code> so the number does not wobble while typing, and turning red at the limit is again
          the second carrier: the "too long" sentence is the first.
        </p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Style / mode</th>
                <th>Foreground</th>
                <th>Background</th>
                <th>Ratio</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund · light</td>
                <td><code>--semantic-red-fg</code> <code>#b91c1c</code></td>
                <td><code>--surface-card</code> <code>#ffffff</code></td>
                <td>6.47:1</td>
                <td>1.4.3 (needs 4.5:1)</td>
              </tr>
              <tr>
                <td>werkbund · dark</td>
                <td><code>--semantic-red-fg</code> <code>#fca5a5</code></td>
                <td><code>--surface-card</code> <code>#1d1d21</code></td>
                <td>8.85:1</td>
                <td>1.4.3 (needs 4.5:1)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows from <code>docs/generated/CONTRAST.MD</code>, block <em>semantic text</em>. The same pair clears 4.5:1
          in all four styles in both modes, so the red error tone is never the thing that fails — which is exactly why
          the failure mode is the other one: a color that passes still says nothing to anyone who cannot see it.
        </p>

        <h3>What turns red when a label sits inside the field</h3>
        <p>
          The two label hulls each carry two invalid rules that recolor <em>your</em> label: one keyed on
          <code>.p-invalid</code>, which follows the <code>[invalid]</code> you bound, and one keyed on
          <code>.ng-invalid.ng-dirty</code>, which follows Angular's dirty state. The second is an Optimus addition,
          marked as such in the source.
        </p>
        <p class="src-note">
          The <code>.p-invalid</code> rules are
          <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:102</code> and
          <code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:33</code>; the dirty-keyed pair is appended in
          the components themselves, under a comment reading "For Optimus"
          (<code>openng-optimus-ui-floatlabel.mjs:14</code>, <code>openng-optimus-ui-iftalabel.mjs:16</code>).
        </p>
        <p>
          Both rules change a color and nothing else. Consequence: with a label inside the field and no sentence
          beneath it, the entire error is a hue change on the label — SC 1.4.1 in one line. And because the second rule
          answers <em>dirty</em>, that hue can arrive on the first keystroke, ahead of the touched-or-submitted gate.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          Fields are full-width at every viewport, so the column simply narrows; nothing reflows into a second column.
          The kit convention adds one breakpoint: below 600px the action row stacks, one full-width button per row,
          primary action first. Long labels and error sentences wrap — which is why errors sit under the field, where
          wrapping costs nothing.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Every editable Optimus component is the same component underneath: one base class carries the form contract, a
          second carries the input surface. Knowing the two lists is knowing what every control in a form will accept.
        </p>

        <h3>What every editable control inherits</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Members</th>
                <th>Where</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BaseEditableHolder</td>
                <td>
                  <code>required</code> · <code>invalid</code> · <code>disabled</code> · <code>name</code> (signal
                  inputs) + the ControlValueAccessor plumbing
                </td>
                <td><code>openng-optimus-ui-baseeditableholder.mjs:11-56</code></td>
              </tr>
              <tr>
                <td>BaseInput (input-like controls)</td>
                <td>
                  <code>fluid</code> · <code>variant</code> · <code>size</code> · <code>inputSize</code> ·
                  <code>pattern</code> · <code>min</code> / <code>max</code> / <code>step</code> ·
                  <code>minlength</code> / <code>maxlength</code>
                </td>
                <td><code>openng-optimus-ui-baseinput.mjs</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          &#64;openng/optimus-ui&#64;2.0.2 shipped source. Two compositions worth knowing:
          <code>$disabled = disabled() || _disabled()</code> — the input and Angular's <code>setDisabledState</code> OR
          together (<code>openng-optimus-ui-baseeditableholder.mjs:33</code>) — and the
          <code>hasFluid = fluid() ?? !!pcFluid</code> getter, which falls back to a <code>p-fluid</code> ancestor
          (<code>openng-optimus-ui-baseinput.mjs:7,:80</code>). The kit does
          not use <code>p-fluid</code>; it sets <code>width: 100%</code> in CSS.
        </p>

        <h3>What ng-invalid does — and why you still bind [invalid]</h3>
        <p>
          Angular decorates the host with <code>ng-invalid</code>/<code>ng-dirty</code>/<code>ng-touched</code>. The
          <code>invalid</code> input sets <code>p-invalid</code> (<code>openng-optimus-ui-inputtext.mjs:31</code>), which
          is the class the whole invalid look hangs off. But Optimus re-added a second, narrower rule that PrimeNG 22 had
          dropped: <code>.p-inputtext.ng-invalid.ng-dirty</code> repaints border and placeholder color on its own
          (<code>:16-22</code>) — 22 of the shipped bundles carry an equivalent block.
        </p>
        <p>
          So the two layers do meet now, and badly: that rule fires on <em>dirty</em>, i.e. the first keystroke, not on
          your touched-or-submitted gate, and it paints only a color — no <code>aria-invalid</code>, no sentence. A
          field can therefore go red while the guide's error is still correctly hidden. Compute validity yourself and
          bind the triple: <code>[invalid]</code> stays the one switch that carries the full, announced state, and it
          keeps the timing rule in one visible place instead of inside Angular's dirty/touched heuristics.
        </p>

        <h3>How a field says it is required</h3>
        <p>
          <code>required</code> is a signal input on the editable base class, documented there as "There must be a
          value (if set)". It validates nothing — like <code>invalid</code>, it is a boolean you set — but unlike
          <code>invalid</code> it does reach the DOM. <strong>How far it reaches depends on the control.</strong>
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Group</th>
                <th>Controls</th>
                <th>What lands on the rendered input</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>both</td>
                <td><code>p-autocomplete</code>, <code>p-datepicker</code>, <code>p-select</code></td>
                <td>native <code>required</code> and <code>aria-required</code></td>
              </tr>
              <tr>
                <td>native only</td>
                <td>
                  <code>p-checkbox</code>, <code>p-radiobutton</code>, <code>p-toggleswitch</code>,
                  <code>p-multiselect</code>, <code>p-cascadeselect</code>, <code>p-password</code>,
                  <code>p-inputotp</code>, <code>p-rating</code>, <code>p-knob</code>
                </td>
                <td>native <code>required</code> only</td>
              </tr>
              <tr>
                <td>native, plus a second switch</td>
                <td><code>p-inputmask</code>, <code>p-inputnumber</code></td>
                <td>
                  native <code>required</code>; their <code>aria-required</code> answers a separate
                  <code>ariaRequired</code> input, so setting one does not set the other
                </td>
              </tr>
              <tr>
                <td>neither</td>
                <td><code>[pInputText]</code>, <code>[pTextarea]</code></td>
                <td>no <code>required</code> input exists — you write the native attribute yourself</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>required</code> is declared once, at <code>openng-optimus-ui-baseeditableholder.mjs:11</code>. The two
          input directives extend the model holder instead (<code>openng-optimus-ui-inputtext.mjs:69</code>,
          <code>openng-optimus-ui-textarea.mjs:69</code>), so the contract stops one class short of them. The third
          row's split is visible side by side: <code>openng-optimus-ui-select.mjs:1712</code> binds
          <code>aria-required</code> to <code>required()</code>, while
          <code>openng-optimus-ui-inputnumber.mjs:1287</code> binds it to <code>ariaRequired</code>. Reproduce: set
          the flag on a control from each group and read the rendered attributes off the focusable element.
        </p>
        <p>
          Native <code>required</code> is enough to be announced — assistive technology reports it from the property,
          and <code>novalidate</code> suppresses only the browser's own error bubbles, not the state. So the honest
          answer is: the requirement <em>is</em> announced for every control that has the input, and
          <code>aria-required</code> in the first row is belt and braces. The gap that matters is the third row and the
          asterisk: a <code>*</code> in the label is a glyph with no meaning attached. Say the word in the label text,
          or mark the optional fields instead — and set the attribute regardless of what you print.
        </p>

        <h3>How an error reaches its field</h3>
        <p>
          <strong>No component ever links a message to a control for you.</strong> The link is an id you assign to the
          error node and an <code>aria-describedby</code> you bind on the control — the pair the field snippet in the
          Usage tab shows, and the reason both sides carry an id that only you keep in sync. Exactly one control even
          offers a typed input for it, <code>p-inputnumber</code>'s <code>ariaDescribedBy</code>; everywhere else you
          write the attribute on the host or, where the focusable element is rendered inside, reach it through the
          pass-through object shown further down.
        </p>
        <p>
          That makes the choice of error node a real one. <code>p-message</code> is the library's message anatomy, but
          its host is a permanent live region: it announces itself on render wherever focus is. As one field's error
          that is a second announcement on top of the description, and a submit that reveals four errors fires four of
          them. Keep <code>p-message</code> for the form-level failure — one node, one announcement — and let a field's
          error be a plain element that only <code>aria-describedby</code> reaches.
        </p>
        <pre class="code-block"><code>{{ errorNodeSnippet }}</code></pre>
        <p class="src-note">
          The live-region attributes are static host attributes on the message component, not inputs
          (<code>openng-optimus-ui-message.mjs:350-351</code>) — <strong>Feedback Messages</strong> owns that anatomy.
          The component also renders no icon unless one is named (<code>:249</code>), so a severity arrives as color
          plus your sentence.
        </p>

        <h3>Where <code>p-fluid</code> reaches, and where it stops</h3>
        <p>
          <code>p-fluid</code> looks like a styling wrapper and is not one: <strong>no stylesheet in the theme or the
          style package contains a <code>.p-fluid</code> rule.</strong> The class is inert. The effect travels by
          dependency injection instead — a control asks its ancestors for a <code>Fluid</code> instance and, if it
          finds one, renders full-width via its own fluid class.
        </p>
        <p>
          Only some controls ask. Some ask through the shared input base (<code>p-autocomplete</code>,
          <code>p-datepicker</code>, <code>p-inputmask</code>, <code>p-inputnumber</code>, <code>p-password</code>,
          <code>p-select</code>); the rest ask directly (<code>pButton</code>, <code>p-cascadeselect</code>,
          <code>[pInputText]</code>, <code>p-multiselect</code>, <code>[pTextarea]</code>, <code>p-treeselect</code>).
          Everything else — checkbox, radio button, toggle switch, select button, slider, rating, OTP — ignores the
          wrapper completely. Consequence: a form wrapped in one <code>p-fluid</code> comes out half-stretched, and the
          controls that stayed narrow are the ones nobody thinks to check.
        </p>
        <p class="src-note">
          The lookup is <code>inject(Fluid, &#123; optional: true, host: true, skipSelf: true &#125;)</code> with
          <code>hasFluid = fluid() ?? !!pcFluid</code> (<code>openng-optimus-ui-baseinput.mjs:7</code> and
          <code>:80</code>); the wrapper itself declares only its class
          (<code>openng-optimus-ui-fluid.mjs:9</code>). Reproduce: put one wrapper around a text field and a checkbox
          and compare their rendered widths. Where the wrapper does not reach, the per-control
          <code>[fluid]</code> input still works.
        </p>

        <h3>An input that changes nothing</h3>
        <p>
          <code>p-iconfield</code> takes an <code>iconPosition</code> of <code>'left'</code> or <code>'right'</code>
          and turns it into a class on the host. <strong>Neither class is styled anywhere.</strong> The icon's side is
          decided entirely by document order: the positioning rules key on <code>:first-child</code> and
          <code>:last-child</code>, and so does the padding that keeps the text clear of it. Write the icon before the
          input for a leading icon, after it for a trailing one, and treat <code>iconPosition</code> as a no-op.
        </p>
        <p class="src-note">
          The classes are produced at <code>openng-optimus-ui-iconfield.mjs:13-14</code> and consumed nowhere; the
          rules that actually place the icon are
          <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs:16-22</code>. Reproduce: render one icon field
          with the icon written first and the position set to the opposite side, and see which edge it occupies.
        </p>
        <p>
          Two further inputs on the same component are not for authors: <code>styleClass</code> is marked deprecated in
          favor of <code>class</code>, and <code>hostName</code> exists so the pass-through machinery can find its
          config entry.
        </p>

        <h3>Focus handoffs on branch swaps</h3>
        <p>
          Success panels, two-step confirmations, and cleared lists all destroy the element the user was standing on.
          Render first, then focus what replaced it:
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h3>Initial focus: where <code>pAutoFocus</code> belongs, and where it does not</h3>
        <p>
          <code>[pAutoFocus]</code> is a standalone directive with one input of the same name. Unless the input is
          <code>false</code> it writes a native <code>autofocus</code> attribute onto its host, written after insertion, so the
          browser's own autofocus processing never acts on it. When the input is truthy it also focuses, from a
          <code>setTimeout</code> after the view is checked, the host's first focusable descendant, or the host itself
          when there is none. It does so once per directive instance and only in the browser. Eighteen library bundles embed it, most behind an
          <code>autofocus</code> input of their own, so everything below holds for <code>p-select</code>'s
          <code>autofocus</code> as much as for the bare directive.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Who sets the first focus</th>
                <th>Why not <code>pAutoFocus</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A routed page loads</td>
                <td>The app shell: <code>&lt;main&gt;</code> on every <code>NavigationEnd</code></td>
                <td>
                  The directive's timer competes with the shell; a reader who lands mid-form skips the heading, the
                  instructions, and the skip link, and a touch keyboard covers half the screen
                </td>
              </tr>
              <tr>
                <td>A dialog opens</td>
                <td><code>p-dialog</code>'s <code>focusOnShow</code>: its first focusable, after the enter transition</td>
                <td>The dialog's own timer runs after the directive's and wins; put the right control first instead</td>
              </tr>
              <tr>
                <td>A submit fails validation</td>
                <td>Nobody, or your explicit <code>.focus()</code> on the first invalid field</td>
                <td>The fields already exist and their directives have already fired; nothing re-runs</td>
              </tr>
              <tr>
                <td>A branch swap replaces what had focus</td>
                <td>Your explicit <code>.focus()</code>, after the render (above)</td>
                <td>Works on a created branch, but the explicit call names the target and runs in a known order</td>
              </tr>
              <tr>
                <td>A click reveals an inline field or a next step</td>
                <td><code>[pAutoFocus]="true"</code> on the revealed field or its container</td>
                <td>— this is the use: the reader asked for the content, and focus follows the request</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ autofocusSnippet }}</code></pre>
        <p class="src-note">
          Directive behavior from <code>openng-optimus-ui-autofocus.mjs</code>: the attribute write <code>:21-32</code>,
          the truthiness check and <code>isPlatformBrowser</code> guard <code>:39</code>, the first-focusable lookup
          <code>:41-47</code>, the once-only flag <code>:48</code>, the <code>pAutoFocus</code> input alias
          <code>:61-64</code>. The dialog's first focus is <code>openng-optimus-ui-dialog.mjs:620-627</code> and
          <code>:949-952</code>; the shell's is the <code>NavigationEnd</code> subscription in
          <code>src/app/app.component.ts</code>.
        </p>

        <h3>Reaching an input the component does not expose</h3>
        <p>
          <code>p-checkbox</code> has no <code>ariaDescribedBy</code> input; the pass-through object is the supported
          route onto the real <code>&lt;input&gt;</code> it renders:
        </p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>
            ☐ Every control labeled — <code>label[for]</code>/<code>inputId</code>, or caption +
            <code>ariaLabelledBy</code> on combobox hosts.
          </li>
          <li>☐ <code>novalidate</code> on the form; errors translated and field-anchored.</li>
          <li>
            ☐ <code>[invalid]</code> + <code>aria-invalid</code> + <code>aria-describedby</code> bound together, gated
            on touched-or-submit.
          </li>
          <li>☐ Submit marks all fields touched; invalid submit changes no state it cannot explain.</li>
          <li>☐ Every branch swap hands focus to what replaced the branch.</li>
          <li>
            ☐ No <code>pAutoFocus</code> (or component <code>autofocus</code>) on page load or in a dialog; where it is
            used, it is bound — <code>[pAutoFocus]="true"</code> — on content the reader just revealed.
          </li>
          <li>☐ Outcome announced once: <code>role="status"</code> region + moved focus, no toast on top.</li>
          <li>☐ Overlay controls inside clipping containers carry <code>appendTo="body"</code>.</li>
          <li>☐ Keyboard focus visible on every control — family rules or your own <code>:focus-visible</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          A form is mostly strings: labels, hints, one error sentence per rule, and the two or three words on the submit
          button that change while it runs. All of them are keys; the only translations the library itself needs are its
          ARIA strings, which
          <strong>I18n &amp; Localization</strong> routes through the config bridge.
        </p>

        <h3>One key per field and rule</h3>
        <p>
          The error namespace is flat and per-rule (<code>error.emailInvalid</code>,
          <code>error.messageTooShort</code>, <code>error.consentRequired</code>) — a rule fires exactly one whole
          sentence. Never assemble an error from fragments: word order and case belong to the translator. The required
          mark is its own key rendered as text in the label, not a bare asterisk a screen reader reads as "star".
        </p>

        <h3>Where longer text pushes</h3>
        <ul>
          <li>
            <strong>Labels</strong> sit above full-width fields, so expansion wraps instead of colliding — budget
            roughly 1.4× the English width before assuming one line.
          </li>
          <li>
            <strong>Error sentences</strong> wrap under the field by design; the icon stays on the first line's left.
          </li>
          <li>
            <strong>The submit label</strong> changes while sending ("Submitting…"); size the button for the longer of
            the two states in the longest language, or accept the width jump.
          </li>
          <li>
            <strong>Placeholders</strong> are translated like any string but demonstrate format only — the label carries
            the name, so a truncated placeholder loses an example, not the field's meaning.
          </li>
          <li>
            <strong>The counter</strong> ("140 / 600") is language-neutral digits with an <code>sr-only</code> prefix
            naming what is counted — that prefix is the key.
          </li>
          <li>
            <strong>A label inside the field</strong> has no wrap room at all: it is absolutely positioned on a single
            line over or inside the control, and the float variant shrinks it further once lifted. A label that fits in
            English will run past the field's edge in German or Finnish rather than wrap. If a form must survive every
            language, the label goes above the field.
          </li>
        </ul>
        <p class="src-note">
          Key shapes and the fallback chain are <strong>I18n &amp; Localization</strong>'s ground; the 1.4× budget is
          the W3C text-size guidance that guide cites.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Synced with the contrast and focus rounds: Design adds the date
            picker's trigger edge, the kit label colors (float and ifta), the dark fill of every field shell, and the
            ring on the focused autocomplete chip, each gated in the compilat.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-23 — Synced with the contrast and focus rounds: Design lists every field
            the kit re-points to <code>--control-border</code>, the kit's <code>--semantic-red-fg</code> invalid edge
            (no longer "the preset's token"), the icon color, and where the one kit ring reaches, each gated in the
            compilat.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-09-23 — The guide now covers <code>[pAutoFocus]</code>: its contract in the
            agent doc, a live example on revealed content, and a Development table of where initial focus belongs
            instead (page load, dialogs, failed submits). Design states the kit's re-pointed field edge and dark field
            surface beside the preset table, gated in the contrast compilat.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): the "ng-invalid moves
            nothing" claim flipped — Optimus re-adds a <code>.ng-invalid.ng-dirty</code> border rule (22 bundles), so a
            field can go red on the first keystroke, ahead of the touched-or-submitted gate. Token table re-read off
            Aura 2.x: sm/base/lg paddings 0.375/0.5/0.625rem y and 0.625/0.75/0.875rem x, sm/lg font sizes 0.875/1.125rem
            with no base <code>fontSize</code> token (the 1rem base is a CSS literal); focus ring still fully zeroed.
            Base-class refs re-derived against the Optimus bundles (<code>hasFluid</code> at baseinput <code>:80</code>,
            not <code>:85</code>).
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-24 — Initial guide: the field pattern and its error triple, the
            signal-and-computed validation model with touched-gating, the base-class contract every editable control
            inherits (measured off primeng&#64;22.1.2 and the Aura 3.0 formField block), and the submit state machine
            with focus handoffs.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      .lead {
        margin: 0 0 var(--space-5);
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--text-color-secondary);
      }
      h3 {
        margin: var(--space-6) 0 var(--space-3);
        font-size: 1.05rem;
      }
      p {
        line-height: 1.65;
      }

      /* --- Live form demos --- */
      .demo-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-4);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        max-width: 30rem;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .field > label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }
      .field input {
        width: 100%;
      }
      .field-error {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--red-600);
      }
      .field-error i {
        margin-top: 0.15em;
        font-size: 0.85rem;
      }
      .demo-actions {
        display: flex;
        gap: var(--space-3);
        flex-wrap: wrap;
      }
      .hull-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-sm);
      }
      .demo-state {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }

      .stage {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        padding: var(--space-4);
        background: var(--surface-section);
        border-radius: var(--radius-md);
        margin: 0 0 var(--space-3);
      }
      .stage__item {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
        flex: 1 1 14rem;
      }
      .stage__cap {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
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
        border-left: 3px solid var(--semantic-red-fg, #b91c1c);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
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
        background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent);
        color: var(--semantic-red-fg, #b91c1c);
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

      .sources {
        padding-left: 1.1rem;
      }
      .sources li {
        margin: 0 0 var(--space-3);
        line-height: 1.6;
      }

      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
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
      .src-note {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-4);
      }
      .history strong {
        color: var(--primary-color-fg);
      }
    `,
  ],
})
export class FormsArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Live demo: touched-gating ------------------------------------------
  readonly demoEmail = signal('');
  readonly demoTouched = signal(false);
  readonly demoSubmitted = signal(false);
  readonly demoValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.demoEmail().trim()));
  readonly demoShows = computed(() => !this.demoValid() && (this.demoTouched() || this.demoSubmitted()));

  demoSubmit(): void {
    this.demoSubmitted.set(true);
  }

  demoReset(): void {
    this.demoEmail.set('');
    this.demoTouched.set(false);
    this.demoSubmitted.set(false);
  }

  // --- Three labeling hulls, one value -----------------------------------
  readonly hullName = signal('');
  readonly hullPlaceholder = signal(false);

  hullReset(): void {
    this.hullName.set('');
    this.hullPlaceholder.set(false);
  }

  // --- pAutoFocus on revealed content --------------------------------------
  readonly noteOpen = signal(false);

  toggleNote(): void {
    this.noteOpen.update((open) => !open);
  }

  // --- Static invalid matrix ----------------------------------------------
  readonly staticOk = '2024-11-03';
  readonly staticBad = '2044-11-03';

  // --- Do/Don't: eager vs calm validation ---------------------------------
  readonly eagerName = signal('');
  readonly calmName = signal('');
  readonly calmTouched = signal(false);
  readonly calmShows = computed(
    () => this.calmTouched() && this.calmName().trim().length > 0 && this.calmName().trim().length < 4,
  );

  // --- Measured values (flat, so the tab extractor resolves them) ---------
  readonly m = {
    smFont: '0.875rem (14px)',
    baseFont: '1rem (16px, CSS literal — no token)',
    lgFont: '1.125rem (18px)',
    smPadX: '0.625rem',
    basePadX: '0.75rem',
    lgPadX: '0.875rem',
    smPadY: '0.375rem',
    basePadY: '0.5rem',
    lgPadY: '0.625rem',
  };

  // --- Flat string constants: these resolve wherever the tab is read ------
  readonly fieldSnippet =
    '<div class="field">\n' +
    '  <label for="fx-email">{{ t(\'form.emailLabel\') }}</label>\n' +
    '  <input pInputText id="fx-email" type="email" name="email" autocomplete="email"\n' +
    '    [invalid]="shows(\'email\')"\n' +
    '    [attr.aria-invalid]="shows(\'email\')"\n' +
    "    [attr.aria-describedby]=\"shows('email') ? 'fx-email-error' : null\"\n" +
    '    [ngModel]="email()" (ngModelChange)="email.set($event)" (blur)="touch(\'email\')" />\n' +
    "  @if (shows('email')) {\n" +
    '    <small class="field-error" id="fx-email-error">\n' +
    '      <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>\n' +
    "      {{ t('form.error.email') }}\n" +
    '    </small>\n' +
    '  }\n' +
    '</div>';

  readonly modelSnippet =
    '// One signal per field; the draft is a plain object over them.\n' +
    "readonly email = signal('');\n" +
    "readonly message = signal('');\n" +
    'private readonly touched = signal<ReadonlySet<Field>>(new Set());\n' +
    '\n' +
    '// Validation is a pure function; the computed re-runs it on every edit.\n' +
    'private readonly errors = computed(() => validate(this.draft()));\n' +
    '\n' +
    '// The timing rule lives in exactly one place.\n' +
    'shows(field: Field): boolean {\n' +
    '  return this.errors().includes(field) && this.touched().has(field);\n' +
    '}\n' +
    '\n' +
    'submit(): void {\n' +
    '  this.touched.set(new Set(ALL_FIELDS));  // every complaint at once\n' +
    '  if (this.errors().length > 0) return;\n' +
    '  // ... idle -> sending -> sent | error\n' +
    '}';

  readonly machineSnippet =
    "type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';\n" +
    "readonly status = signal<SubmitStatus>('idle');\n" +
    '\n' +
    '// One polite region announces every state change; empty while idle.\n' +
    '// <p class="sr-only" role="status" aria-live="polite">{{ announcement() }}</p>\n' +
    '\n' +
    'async submit(): Promise<void> {\n' +
    "  if (this.status() === 'sending') return;   // no double submit\n" +
    '  this.touched.set(new Set(ALL_FIELDS));\n' +
    "  if (this.errors().length > 0) { this.status.set('idle'); return; }\n" +
    "  this.status.set('sending');                 // button disabled + relabeled\n" +
    '  try {\n' +
    '    await this.api.send(this.draft());\n' +
    "    this.status.set('sent');                  // success panel replaces the form\n" +
    '    this.moveFocusTo(this.successTitle);       // ...so focus must move with it\n' +
    '  } catch {\n' +
    "    this.status.set('error');                 // inline p-message, never a toast\n" +
    '  }\n' +
    '}';

  readonly focusSnippet =
    '/** Render the pending branch, then focus what it put on screen. */\n' +
    'private moveFocusTo(target: () => ElementRef<HTMLElement> | undefined): void {\n' +
    '  this.cdr.detectChanges();   // the target does not exist until the @if renders\n' +
    '  target()?.nativeElement.focus();\n' +
    '}';

  readonly errorNodeSnippet =
    '<!-- One field: a plain node, reached only through aria-describedby. -->\n' +
    '<input pInputText id="fx-city" name="city" required\n' +
    '  [invalid]="shows(\'city\')"\n' +
    '  [attr.aria-invalid]="shows(\'city\')"\n' +
    "  [attr.aria-describedby]=\"shows('city') ? 'fx-city-error' : null\" />\n" +
    "@if (shows('city')) {\n" +
    '  <small class="field-error" id="fx-city-error">…</small>\n' +
    '}\n' +
    '\n' +
    '<!-- The whole form: p-message, which announces itself once, on its own. -->\n' +
    '@if (status() === \'error\') {\n' +
    '  <p-message severity="error">{{ t(\'form.error.submit\') }}</p-message>\n' +
    '}';

  readonly autofocusSnippet =
    "import { AutoFocus } from '@openng/optimus-ui/autofocus';\n" +
    '\n' +
    '<!-- Bind it. A bare attribute passes the empty string, which the\n' +
    '     directive reads as false: nothing is focused. -->\n' +
    '<input pInputText pAutoFocus />                    <!-- does nothing -->\n' +
    '<input pInputText [pAutoFocus]="true" />           <!-- focuses -->\n' +
    '\n' +
    '<!-- Revealed by the reader: each @if pass is a new instance, so it\n' +
    '     focuses on every opening, never on page load. -->\n' +
    '@if (editing()) {\n' +
    '  <label for="note">{{ t(\'form.noteLabel\') }}</label>\n' +
    '  <input pInputText id="note" [pAutoFocus]="true" />\n' +
    '}';

  readonly ptSnippet =
    '<p-checkbox inputId="fx-consent" [binary]="true" name="consent"\n' +
    '  [invalid]="shows(\'consent\')"\n' +
    "  [pt]=\"{ input: { 'aria-describedby': shows('consent') ? 'fx-consent-error' : null } }\"\n" +
    '  [ngModel]="consent()" (ngModelChange)="onConsentChange($event)" />\n' +
    '<label for="fx-consent">I agree to the storage described above.</label>';
}
