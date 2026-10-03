import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { IftaLabelModule } from '@openng/optimus-ui/iftalabel';
import { InputIconModule } from '@openng/optimus-ui/inputicon';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Input Labels (Guides, category `library`).
 *
 * Covers the two label hulls, `p-floatLabel` and `p-iftaLabel`. Every claim in
 * the tabs was read off the shipped source of Optimus UI 2.0.2.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Both components are standalone, OnPush, ViewEncapsulation.None, and their
 *     whole template is ` <ng-content></ng-content> `: no label element, no id,
 *     no `for`, no aria attribute (openng-optimus-ui-floatlabel.mjs:74,
 *     openng-optimus-ui-iftalabel.mjs:64). The accessible name is therefore the
 *     caller's alone — this is the guide's first sentence.
 *   - FloatLabel declares exactly one input, `variant`, defaulting to 'over'
 *     (:72); the three values map to `p-floatlabel-over/-on/-in` (:22-24).
 *     IftaLabel declares NONE — its bundle never imports `Input` at all (:3),
 *     and its class map is the single literal `root: 'p-iftalabel'` (:21).
 *   - Both bundles APPEND an Optimus-only rule over the upstream stylesheet:
 *     `:has(.ng-invalid.ng-dirty) label` (floatlabel :14-16, iftalabel :16-18).
 *     The `:has(.p-invalid)` twin lives in the style package instead
 *     (@openng/optimus-ui-styles/dist/floatlabel/index.mjs:102, iftalabel :33).
 *   - Geometry is entirely CSS in @openng/optimus-ui-styles/dist/{floatlabel,
 *     iftalabel}/index.mjs. Shared by both: root `display:block; position:relative`
 *     (:2-5), label `position:absolute; pointer-events:none` (:7-9 in each),
 *     `inset-inline-start` for the horizontal offset (fl :16, ifta :16) — a
 *     logical property, so RTL needs no author work.
 *   - Lift triggers for the float label (fl :30-38): `input:focus`,
 *     `input.p-filled`, `input:-webkit-autofill`, the textarea twins,
 *     `.p-inputwrapper-focus`, `.p-inputwrapper-filled`, and `input[placeholder]`
 *     / `textarea[placeholder]`. The placeholder ATTRIBUTE alone is a trigger.
 *   - `.p-filled` is added by pInputText (openng-optimus-ui-inputtext.mjs:28);
 *     `.p-inputwrapper-filled` by the eight wrapper bundles (select :52,
 *     autocomplete, cascadeselect, datepicker, inputnumber, multiselect,
 *     password, treeselect). A plain `<input>` carries neither.
 *   - Room for the label is reserved by a FIXED selector list: `.p-inputtext,
 *     .p-textarea, .p-select-label, .p-multiselect-label,
 *     .p-autocomplete-input-multiple, .p-cascadeselect-label, .p-treeselect-label`
 *     — under `.p-floatlabel-in` (fl :58-65) and unconditionally under
 *     `.p-iftalabel` (ifta :21-28). `variant="over"` and `variant="on"` reserve
 *     nothing.
 *   - Textarea special case, float only: `.p-floatlabel:has(.p-textarea) label`
 *     pins the resting label to the top padding instead of the vertical center
 *     (fl :21-24).
 *   - Leading icon: float shifts the label to
 *     `calc((form.field.padding.x * 2) + icon.size)` via
 *     `:has(.p-inputicon:first-child)` (fl :26-28). Ifta has NO horizontal rule;
 *     it only pushes the icon down (`.p-iftalabel .p-inputicon`, ifta :44-48).
 *   - Neither hull stylesheet contains "inputgroup" or "disabled"; the group's own sheet styles a hull
 *     as a member (inputgroup :4-14, :55-85, :93-96), so the hull goes inside the group, not around it.
 *   - Tokens (@openng/optimus-ui-themes/dist/aura/{floatlabel,iftalabel}/index.mjs):
 *     float root color/focusColor/activeColor/invalidColor, transitionDuration
 *     0.2s, positionX {form.field.padding.x}, fontWeight 500, active fontSize
 *     0.75rem / fontWeight 400; over.active.top -1.25rem; in.input.paddingTop
 *     1.5rem, in.active.top {form.field.padding.y}; on.borderRadius
 *     {border.radius.xs}, on.active.background {form.field.background},
 *     on.active.padding "0 0.125rem". Ifta root fontSize 0.75rem, fontWeight 400,
 *     top {form.field.padding.y}, input.paddingTop 1.5rem — and NO active color
 *     of its own.
 *   - Aura semantics (@openng/optimus-ui-themes/dist/aura/base/index.mjs,
 *     form.field group): floatLabelColor {surface.500} light / {surface.400}
 *     dark, floatLabelActiveColor the SAME values, floatLabelFocusColor
 *     {primary.600} light / {primary.color} dark, floatLabelInvalidColor
 *     {form.field.invalid.placeholder.color}. The placeholder color in the same
 *     group is {surface.500}/{surface.400} too.
 *   - src/styles.scss `.p-floatlabel` re-points the float label's own tokens:
 *     rest and active --text-color-secondary, focus --text-color, invalid
 *     --semantic-red-fg, and (dark) the `on` chip to --surface-section, the
 *     field's own fill. docs/generated/CONTRAST.MD measures them ("float
 *     label"). `.p-iftalabel` takes the same kit colours (rest
 *     --text-color-secondary, focus --text-color, invalid --semantic-red-fg),
 *     measured on the field fill in the same group (iftalabel rows), and the
 *     dark textarea / multiselect / treeselect / autocomplete-multiple fill is
 *     --surface-section like the input, so the `on` chip matches every field.
 *   - The child field: the per-style `input.p-inputtext` edge rule outranks
 *     `.p-inputtext.p-invalid`, and the kit's `input.p-inputtext.p-invalid`
 *     (--semantic-red-fg, !important) outranks it back, so edge and label agree.
 */
@Component({
  selector: 'app-input-labels-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    FloatLabelModule,
    IftaLabelModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'input-labels'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two wrappers, one job: put the label a caller already wrote somewhere inside the field's box. Neither ships a
          label, an id, or an aria attribute — the whole template of each is a bare content projection. Everything you
          see below is CSS reacting to classes the child control puts on itself.
        </p>

        <h3>The two hulls, side by side</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">p-floatLabel (default variant "over")</span>
            <p-floatLabel>
              <input
                pInputText
                id="il-float"
                name="il-float"
                [ngModel]="floatName()"
                (ngModelChange)="floatName.set($event)"
              />
              <label for="il-float">Display name</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">p-iftaLabel</span>
            <p-iftaLabel>
              <input
                pInputText
                id="il-ifta"
                name="il-ifta"
                [ngModel]="iftaName()"
                (ngModelChange)="iftaName.set($event)"
              />
              <label for="il-ifta">Display name</label>
            </p-iftaLabel>
          </div>
        </div>
        <p class="hint">{{ m.sideBySide }}</p>

        <h3>The three float variants</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">variant="over"</span>
            <p-floatLabel variant="over">
              <input pInputText id="il-v-over" name="il-v-over" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-over">City</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">variant="on"</span>
            <p-floatLabel variant="on">
              <input pInputText id="il-v-on" name="il-v-on" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-on">City</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">variant="in"</span>
            <p-floatLabel variant="in">
              <input pInputText id="il-v-in" name="il-v-in" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-in">City</label>
            </p-floatLabel>
          </div>
        </div>
        <div class="demo-actions">
          <button pButton type="button" severity="secondary" [outlined]="true" (click)="resetVariants()">
            <span pButtonLabel>Reset the demo</span>
          </button>
        </div>
        <p class="src-note">
          All three fields share one signal, so typing in any of them moves all three labels at once. The class that
          selects the geometry is <code>p-floatlabel-over</code>/<code>-on</code>/<code>-in</code>, emitted from the
          <code>variant</code> input (<code>openng-optimus-ui-floatlabel.mjs:22-24</code>, default
          <code>'over'</code> at <code>:72</code>).
        </p>

        <h3>The placeholder trap</h3>
        <p>{{ m.placeholderProse }}</p>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">no placeholder — the label rests in the field</span>
            <p-floatLabel>
              <input pInputText id="il-ph-off" name="il-ph-off" [ngModel]="phName()" (ngModelChange)="phName.set($event)" />
              <label for="il-ph-off">Nickname</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">placeholder="e.g. Ada" — the label never comes back</span>
            <p-floatLabel>
              <input
                pInputText
                id="il-ph-on"
                name="il-ph-on"
                placeholder="e.g. Ada"
                [ngModel]="phName()"
                (ngModelChange)="phName.set($event)"
              />
              <label for="il-ph-on">Nickname</label>
            </p-floatLabel>
          </div>
        </div>
        <p class="src-note">
          The right-hand field matches
          <code>.p-floatlabel:has(input[placeholder]) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:37</code>) from its first render: the attribute
          alone is one of the lift triggers, so the label is small and raised while the field is still empty.
        </p>

        <h3>What a bare input does to either hull</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">child with pInputText</span>
            <p-floatLabel>
              <input pInputText id="il-classed" name="il-classed" [ngModel]="bareName()" (ngModelChange)="bareName.set($event)" />
              <label for="il-classed">Street</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">child without pInputText — broken</span>
            <p-floatLabel>
              <input
                class="il-bare"
                id="il-bare"
                name="il-bare"
                [ngModel]="bareName()"
                (ngModelChange)="bareName.set($event)"
              />
              <label for="il-bare">Street</label>
            </p-floatLabel>
          </div>
        </div>
        <p class="src-note">
          The right-hand input never receives <code>.p-filled</code> — that class comes from the directive's own class
          map (<code>openng-optimus-ui-inputtext.mjs:28</code>) — so the only triggers left are <code>:has(input:focus)</code>
          and autofill (floatlabel styles :30, :32): the label lifts while you type and drops back over the value on blur. Both fields are bound to the same signal.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          A hull is three things at once: a wrapper element, a label you write, and a child control that carries the
          right classes. Leave out any one of them and the result is not a degraded label — it is no label, or a label
          welded across the value.
        </p>

        <h3>The complete field</h3>
        <pre class="code-block"><code>{{ fieldSnippet }}</code></pre>
        <p class="src-note">
          The <code>for</code>/<code>id</code> pair is what binds the label; nesting inside the hull binds nothing,
          because the hull's template is a bare <code>&lt;ng-content&gt;</code>
          (<code>openng-optimus-ui-floatlabel.mjs:74</code>, <code>openng-optimus-ui-iftalabel.mjs:64</code>).
        </p>

        <h3>Which children each hull can position</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Child</th>
                <th>Gets a lift trigger</th>
                <th>Gets label room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>input[pInputText]</code></td>
                <td><code>.p-filled</code>, <code>:focus</code>, autofill</td>
                <td>yes — <code>.p-inputtext</code> is on both padding lists</td>
              </tr>
              <tr>
                <td><code>textarea[pTextarea]</code></td>
                <td><code>.p-filled</code>, <code>:focus</code></td>
                <td>yes — plus a float-only resting rule that pins the label to the top</td>
              </tr>
              <tr>
                <td><code>p-select</code>, <code>p-multiselect</code>, <code>p-treeselect</code>, <code>p-cascadeselect</code></td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>yes — via their <code>…-label</code> element</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code> (multiple)</td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>yes — <code>.p-autocomplete-input-multiple</code></td>
              </tr>
              <tr>
                <td><code>p-datepicker</code>, <code>p-inputnumber</code>, <code>p-password</code></td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>yes — their rendered field is a <code>.p-inputtext</code></td>
              </tr>
              <tr>
                <td>a plain <code>&lt;input&gt;</code></td>
                <td>only <code>:focus</code> and a <code>placeholder</code> attribute</td>
                <td>no — it matches neither padding list</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Trigger selectors from <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:30-38</code>; the padding
          lists from <code>:58-65</code> (only under <code>.p-floatlabel-in</code>) and
          <code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:21-28</code> (unconditional). The classes
          themselves come from the controls: <code>openng-optimus-ui-inputtext.mjs:28</code> and
          <code>openng-optimus-ui-select.mjs:52</code> and its seven sibling wrapper bundles.
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a float label with a placeholder</span>
            <div class="dd__stage">
              <p-floatLabel>
                <input
                  pInputText
                  id="il-dd-bad"
                  name="il-dd-bad"
                  placeholder="you@example.org"
                  [ngModel]="ddMail()"
                  (ngModelChange)="ddMail.set($event)"
                />
                <label for="il-dd-bad">E-mail</label>
              </p-floatLabel>
            </div>
            <p class="dd__why">
              The attribute alone triggers the lift, so the label starts small and raised and never returns — the
              field has two competing captions and no resting state.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the format as a hint below the field</span>
            <div class="dd__stage">
              <p-floatLabel>
                <input
                  pInputText
                  id="il-dd-good"
                  name="il-dd-good"
                  aria-describedby="il-dd-good-hint"
                  [ngModel]="ddMail()"
                  (ngModelChange)="ddMail.set($event)"
                />
                <label for="il-dd-good">E-mail</label>
              </p-floatLabel>
              <span class="hint" id="il-dd-good-hint">Format: you&#64;example.org</span>
            </div>
            <p class="dd__why">
              The label keeps its resting position and its full size, and the format survives as a described-by hint
              instead of vanishing the moment someone types.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an ifta label over a leading icon</span>
            <div class="dd__stage">
              <p-iftaLabel>
                <p-iconfield>
                  <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                  <input pInputText id="il-dd-icon-bad" name="il-dd-icon-bad" [ngModel]="ddCity()" (ngModelChange)="ddCity.set($event)" />
                </p-iconfield>
                <label for="il-dd-icon-bad">City</label>
              </p-iftaLabel>
            </div>
            <p class="dd__why">
              The ifta stylesheet has no rule that moves the label past a leading icon, so the two share the same
              starting inset and overlap.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a float label, which is shifted for the icon</span>
            <div class="dd__stage">
              <p-floatLabel>
                <p-iconfield>
                  <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                  <input pInputText id="il-dd-icon-good" name="il-dd-icon-good" [ngModel]="ddCity()" (ngModelChange)="ddCity.set($event)" />
                </p-iconfield>
                <label for="il-dd-icon-good">City</label>
              </p-floatLabel>
            </div>
            <p class="dd__why">
              The float stylesheet carries a leading-icon rule that pushes the label past the icon, so both stay
              readable.
            </p>
          </div>
        </div>
        <p class="src-note">
          The rule that exists on one side only:
          <code>.p-floatlabel:has(.p-inputicon:first-child) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:26</code>). The ifta stylesheet's single icon
          rule adjusts the icon's vertical position instead (<code>.../iftalabel/index.mjs:44</code>).
        </p>

        <h3>Sources for this tab</h3>
        <ul class="src-list">
          <li>
            <a href="https://html.spec.whatwg.org/multipage/forms.html#the-label-element" rel="noopener noreferrer"
              >HTML Living Standard — the <code>label</code> element</a
            >: fixes that <code>for</code>/<code>id</code> is what binds a label, which is why nesting it in a hull that
            renders nothing binds nothing.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 3.3.2, Labels or Instructions</a
            >: the criterion a placeholder-as-label fails, and the reason both hulls still need a real label.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events" rel="noopener noreferrer"
              >MDN — <code>pointer-events</code></a
            >: what both hulls give up on the label element, and why click-to-focus stops working.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Each hull owns one token group, and the two groups are not symmetric: the float label has an active color
          and three geometries, the ifta label has one geometry and no active state at all.
        </p>

        <h3>Token groups, as shipped by Aura</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>floatlabel</code></th>
                <th><code>iftalabel</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>color</code></td>
                <td><code>&#123;form.field.float.label.color&#125;</code></td>
                <td>the same token</td>
              </tr>
              <tr>
                <td><code>focus.color</code></td>
                <td><code>&#123;form.field.float.label.focus.color&#125;</code></td>
                <td>the same token</td>
              </tr>
              <tr>
                <td><code>active.color</code></td>
                <td><code>&#123;form.field.float.label.active.color&#125;</code></td>
                <td>— no active color exists</td>
              </tr>
              <tr>
                <td><code>invalid.color</code></td>
                <td><code>&#123;form.field.float.label.invalid.color&#125;</code></td>
                <td>the same token</td>
              </tr>
              <tr>
                <td>font size</td>
                <td><code>1rem</code> at rest, <code>active.font.size</code> <code>0.75rem</code> lifted</td>
                <td><code>font.size</code> <code>0.75rem</code>, always</td>
              </tr>
              <tr>
                <td>font weight</td>
                <td><code>500</code> at rest, <code>400</code> lifted</td>
                <td><code>400</code>, always</td>
              </tr>
              <tr>
                <td><code>transition.duration</code></td>
                <td><code>0.2s</code></td>
                <td><code>0.2s</code> — on a label that never moves</td>
              </tr>
              <tr>
                <td>input padding top</td>
                <td><code>in.input.padding.top</code> <code>1.5rem</code> (variant <code>in</code> only)</td>
                <td><code>input.padding.top</code> <code>1.5rem</code>, always</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from <code>&#64;openng/optimus-ui-themes/dist/aura/floatlabel/index.mjs</code> and
          <code>.../aura/iftalabel/index.mjs</code>. The float label's resting size is not a token — it inherits, and
          only the lifted state is sized.
        </p>

        <h3>The three float geometries</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variant</th>
                <th>Lifted position</th>
                <th>Space it needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>over</code> (default)</td>
                <td><code>top: -1.25rem</code>, above the field's border</td>
                <td>1.25rem of clear space above the field</td>
              </tr>
              <tr>
                <td><code>on</code></td>
                <td><code>top: 0</code> with <code>translateY(-50%)</code> — centered on the border</td>
                <td>none vertically; it paints a background chip over the border</td>
              </tr>
              <tr>
                <td><code>in</code></td>
                <td><code>top: &#123;form.field.padding.y&#125;</code>, inside the field</td>
                <td>none — the field's own top padding grows to 1.5rem</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Positions from <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:79</code> (<code>in</code>),
          <code>:91-95</code> (<code>on</code>) and <code>:39</code> (the shared <code>over</code> lift); the values
          behind them are <code>over.active.top</code> <code>-1.25rem</code>,
          <code>on.active.background</code> <code>&#123;form.field.background&#125;</code> and
          <code>in.input.padding.top</code> <code>1.5rem</code> in
          <code>&#64;openng/optimus-ui-themes/dist/aura/floatlabel/index.mjs</code>.
        </p>

        <h3>What recolors a label</h3>
        <p>{{ m.colorProse }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, group "float label", measures the float label on the field fill in
          every style and mode (SC 1.4.3, needs 4.5:1): rest and active (<code>--text-color-secondary</code>)
          4.79&#8211;7.78:1, focus (<code>--text-color</code>) 9.35&#8211;18.73:1, invalid
          (<code>--semantic-red-fg</code>) 5.66&#8211;7.93:1. A <code>variant="over"</code> label lifted onto the page
          is the same <code>--text-color-secondary</code>, 4.90&#8211;7.78:1 on ground and card ("body text"). The ifta
          label takes the same three kit colors and is measured in the same group on the field fill
          (<code>iftalabel.color</code> 4.79&#8211;7.78:1, <code>iftalabel.focus.color</code> 9.35&#8211;18.73:1,
          <code>iftalabel.invalid.color</code> 5.66&#8211;7.93:1); Aura's dark <code>&#123;surface.400&#125;</code>
          was 4.19:1 under blaupause.
        </p>

        <h3>What the kit changes around the hulls</h3>
        <p>{{ m.kitProse }}</p>
        <p class="src-note">
          The <code>.p-floatlabel</code> and <code>.dark-theme .p-floatlabel</code> token rules, the per-style
          <code>html.style-&lt;name&gt; input.p-inputtext</code> rules, <code>input.p-inputtext.p-invalid</code>, and the
          <code>.dark-theme .p-inputtext</code> token block in <code>src/styles.scss</code>, against
          <code>.p-inputtext.p-invalid</code> in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> and
          <code>.p-floatlabel-on:has(…) label</code> at <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:91-95</code>.
          The <code>.p-iftalabel</code> token rule and the dark <code>.p-textarea</code>, <code>.p-multiselect</code>,
          <code>.p-treeselect</code> and <code>.p-autocomplete</code> fill blocks sit beside them.
        </p>

        <h3>On a narrow screen</h3>
        <p>{{ m.narrowProse }}</p>
        <p class="src-note">
          Both roots are <code>display: block; position: relative</code> and both labels are
          <code>position: absolute</code> with no width, wrapping, or truncation rule
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:2-19</code>,
          <code>.../iftalabel/index.mjs:2-19</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          There is almost no TypeScript here. One input on one of the two components, no outputs, no lifecycle beyond
          re-applying pass-through attributes — the behavior a caller debugs is nearly always a CSS selector that did
          or did not match.
        </p>

        <h3>The component contract</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>FloatLabel</code></th>
                <th><code>IftaLabel</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Selectors</td>
                <td><code>p-floatlabel</code>, <code>p-floatLabel</code>, <code>p-float-label</code></td>
                <td><code>p-iftalabel</code>, <code>p-iftaLabel</code>, <code>p-ifta-label</code></td>
              </tr>
              <tr>
                <td>Template</td>
                <td colspan="2">
                  <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> — nothing else, in both
                </td>
              </tr>
              <tr>
                <td>Own inputs</td>
                <td><code>variant</code>: <code>over</code> | <code>on</code> | <code>in</code>, default <code>over</code></td>
                <td>none — the bundle never imports <code>Input</code></td>
              </tr>
              <tr>
                <td>Outputs</td>
                <td colspan="2">none</td>
              </tr>
              <tr>
                <td>Inherited</td>
                <td colspan="2"><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> from <code>BaseComponent</code></td>
              </tr>
              <tr>
                <td>Root class</td>
                <td><code>p-floatlabel</code> + <code>-over</code>/<code>-on</code>/<code>-in</code></td>
                <td><code>p-iftalabel</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off <code>openng-optimus-ui-floatlabel.mjs:74</code> (selectors and template),
          <code>:72</code> (the <code>variant</code> default) and <code>:22-24</code> (the class map), against
          <code>openng-optimus-ui-iftalabel.mjs:64</code>, <code>:3</code> (the import list, with no
          <code>Input</code>) and <code>:21</code>.
        </p>

        <h3>What each state is keyed on</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Float label</th>
                <th>Ifta label</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Focused</td>
                <td><code>:has(input:focus)</code>, <code>:has(.p-inputwrapper-focus)</code> → lift + focus color</td>
                <td>focus color only; no movement</td>
              </tr>
              <tr>
                <td>Filled</td>
                <td><code>:has(input.p-filled)</code>, <code>:has(.p-inputwrapper-filled)</code> → lift + active color</td>
                <td>no rule — the label is already out of the way</td>
              </tr>
              <tr>
                <td>Autofilled</td>
                <td><code>:has(input:-webkit-autofill)</code> → lift</td>
                <td>no rule</td>
              </tr>
              <tr>
                <td>Has a placeholder</td>
                <td><code>:has(input[placeholder])</code> → permanent lift</td>
                <td>no rule</td>
              </tr>
              <tr>
                <td>Invalid, by binding</td>
                <td colspan="2"><code>:has(.p-invalid) label</code> → invalid color, in both</td>
              </tr>
              <tr>
                <td>Invalid, by Angular state</td>
                <td colspan="2"><code>:has(.ng-invalid.ng-dirty) label</code> → invalid color, in both</td>
              </tr>
              <tr>
                <td>Disabled</td>
                <td colspan="2">no rule in either stylesheet — the label keeps its color</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selectors from <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:30-56</code> and
          <code>.../iftalabel/index.mjs:33-42</code>; the <code>.ng-invalid.ng-dirty</code> pair is appended by Optimus
          in the component bundles themselves (<code>openng-optimus-ui-floatlabel.mjs:14-16</code>,
          <code>openng-optimus-ui-iftalabel.mjs:16-18</code>). Neither stylesheet contains the string
          <code>disabled</code>.
        </p>

        <h3>Debugging a label that will not move</h3>
        <p>{{ m.debugProse }}</p>
        <pre class="code-block"><code>{{ debugSnippet }}</code></pre>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>A real <code>&lt;label for&gt;</code> inside the hull, and a matching <code>id</code> on the rendered input.</li>
          <li>For a combobox host that takes no <code>for</code>, a caption plus <code>ariaLabelledBy</code> instead.</li>
          <li>No <code>placeholder</code> on a float-labeled field — the format goes into a described-by hint.</li>
          <li>A library-classed child, never a bare <code>&lt;input&gt;</code>.</li>
          <li>1.25rem of clear space above every <code>variant="over"</code> field.</li>
          <li>No leading <code>p-inputicon</code> under an ifta label, and a <code>p-inputgroup</code> around a hull, never inside it.</li>
          <li><code>[invalid]</code> bound alongside <code>aria-invalid</code> and <code>aria-describedby</code>.</li>
          <li>The label is not clickable — check that no instruction anywhere tells a user to click it.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          These hulls carry exactly one translated string, and it is one you wrote: the label. Nothing is read from the
          Optimus config object, and nothing needs a language-change hook. What does change with the language is how
          much room the string needs — and an in-field label has less of it than any other label position.
        </p>

        <h3>Where each string comes from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The label</td>
                <td>Your template — a translation key you own</td>
              </tr>
              <tr>
                <td>Anything else</td>
                <td>Nothing: neither bundle reads <code>getTranslation</code> or the config object</td>
              </tr>
              <tr>
                <td>Reading direction</td>
                <td>Handled — the horizontal offset is a logical property</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Both labels are offset with <code>inset-inline-start</code>, not <code>left</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:16</code>,
          <code>.../iftalabel/index.mjs:16</code>), and the leading-icon shift on the float label uses the same
          property (<code>:27</code>) — so an RTL document mirrors both hulls without author work.
        </p>

        <h3>The length budget</h3>
        <p>{{ m.i18nBudgetProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The <code>your-module.</code> prefix above is a placeholder: no such key exists in this kit. The label is
          absolutely positioned with no wrapping or truncation rule in either stylesheet, so a long translation
          overflows rather than clipping — which is why the budget is a translation instruction, not a CSS fix.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.3 — 2026-09-23 — Synced with the contrast and focus rounds: the ifta label takes the float label's
            kit colors and is gated in "float label" (iftalabel rows); the dark textarea, multiselect, treeselect, and
            multiple-mode autocomplete fill <code>--surface-section</code>, so the dark <code>on</code> chip patch on
            them is gone.
          </li>
          <li>
            v1.2 — 2026-09-23 — Synced with the contrast and focus rounds: the float label's colors are kit tokens now,
            gated in "float label" (rest and active <code>--text-color-secondary</code>, focus <code>--text-color</code>,
            invalid <code>--semantic-red-fg</code>); the dark <code>on</code> chip matches the field; the invalid edge
            turns red with the label. The ifta label stays on Aura's gray, its dark value still not on file.
          </li>
          <li>
            v1.1 — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): the light in-field
            label cites the "form field text" placeholder row it shares a value with; the dark label, focus color, and
            lifted over label are named as not on file; new Design section on the kit rules around the hulls (the
            invalid edge and the dark <code>on</code> chip); agent doc trimmed under its byte aim.
          </li>
          <li>v1.0 — 2026-09-07 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-input-labels-article .stage {
        padding: 1rem;
        background: var(--surface-section);
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-input-labels-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        align-items: flex-start;
      }

      app-input-labels-article .col {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        min-width: 0;
        flex: 1 1 14rem;
      }

      app-input-labels-article p-floatlabel {
        margin-top: 0.75rem;
      }

      app-input-labels-article .cap {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }

      app-input-labels-article .hint {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-input-labels-article .il-bare {
        font: inherit;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--control-border);
        border-radius: 0.25rem;
        background: var(--surface-card);
        color: var(--text-color);
        width: 100%;
      }

      app-input-labels-article .dd__stage {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding-top: 1.5rem;
      }

      app-input-labels-article .src-list {
        margin: 0.5rem 0 0;
        padding-inline-start: 1.1rem;
      }

      app-input-labels-article .src-list li {
        margin-bottom: 0.4rem;
      }
    `,
  ],
})
export class InputLabelsArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly floatName = signal('');
  readonly iftaName = signal('');
  readonly vName = signal('');
  readonly phName = signal('');
  readonly bareName = signal('Alan Turing Avenue');
  readonly ddMail = signal('');
  readonly ddCity = signal('');

  resetVariants(): void {
    this.vName.set('');
  }

  /** Flat measurement and prose constants — resolved by the tab extractor. */
  readonly m = {
    sideBySide:
      'Both fields hold a real label element you wrote. Type into the left one and its label lifts out of the field; ' +
      'the right label never moves, because its position is a single static rule. Click either label: nothing ' +
      'happens, because both hulls set pointer-events: none on it.',
    placeholderProse:
      'A placeholder is not a second caption under a float label — it is a permanent cancellation of the float. The ' +
      'mere presence of the attribute is one of the lift triggers, so the label starts small and raised over an ' +
      'empty field and never returns to its resting position.',
    colorProse:
      'Four states, three colors. At rest and when filled the float label uses the same value — Aura resolves both ' +
      'floatLabelColor and floatLabelActiveColor to {surface.500} in light mode and {surface.400} in dark, and this ' +
      'kit re-points both to --text-color-secondary — so lifting changes the size and the position, not the ' +
      "contrast. Focus darkens the label to --text-color (Aura's floatLabelFocusColor is {primary.600} light, " +
      '{primary.color} dark; the ring already says focused), and invalid takes --semantic-red-fg, the color of the ' +
      'invalid edge. The ifta label has no active color of its own at all: it sits at its resting value ' +
      'permanently, at 0.75rem, and the kit gives it the same three colors — --text-color-secondary, ' +
      '--text-color on focus, --semantic-red-fg when invalid.',
    kitProse:
      'The kit restyles the float label and the field inside both hulls, and the two now agree. Invalid: [invalid] ' +
      'on the child recolors the label through :has(.p-invalid), and the kit rule input.p-inputtext.p-invalid ' +
      '(!important) beats the per-style edge rule, so the edge turns --semantic-red-fg with it; the ' +
      'ng-invalid.ng-dirty rules land as well. The on variant: its lifted chip masks the top border, and in dark ' +
      'mode the kit paints it --surface-section, the fill every dark kit field has — input, select, textarea, ' +
      'multiselect, treeselect, and the multiple-mode autocomplete box — so the chip is invisible in every style ' +
      '("float label", on.active.background on the field, 1.00:1). Only a custom field background still shows it ' +
      'as a patch; re-point the chip to match.',
    narrowProse:
      'Neither hull reflows, stacks, or truncates at any viewport. Both roots are display: block, so they take the ' +
      'width of their container, and the label is absolutely positioned with no width, max-width, or white-space ' +
      'rule of its own — so a label longer than the field wraps onto a second absolutely positioned line and covers ' +
      'the value, at 360px exactly as at 1440px. Layout guidance: budget the label for the narrowest field the page ' +
      'ships, or put the label above the field and use no hull.',
    debugProse:
      'A label that stays put is almost always a selector that did not match, and there are only three candidates. ' +
      'Inspect the rendered input: if it has no .p-filled or .p-inputwrapper-filled class, the child is not a ' +
      'library control and nothing but focus lifts the label. If it has a placeholder attribute, the label was never down to ' +
      'begin with. If the field text sits under the label, the child is not on the padding list that reserves room.',
    i18nBudgetProse:
      'An in-field label competes with the value for the same box. The float label is at full size only while the ' +
      'field is empty, and at 0.75rem once lifted; the ifta label is at 0.75rem always and shares its line with ' +
      'nothing. German and Finnish labels commonly run 30 to 40 percent longer than English, and neither hull ' +
      'shortens, wraps gracefully, or truncates — so the budget belongs in the translation instructions for the key, ' +
      'not in a CSS rule.',
  };

  readonly fieldSnippet =
    '<!-- The hull renders nothing: the label, the id, and the for are all yours. -->\n' +
    '<p-iftaLabel>\n' +
    '  <input pInputText\n' +
    '         id="acct-name"\n' +
    '         name="acctName"\n' +
    '         [ngModel]="name()"\n' +
    '         (ngModelChange)="name.set($event)"\n' +
    '         [invalid]="nameError() !== null"\n' +
    '         aria-describedby="acct-name-error" />\n' +
    '  <label for="acct-name">{{ translate(\'your-module.account.nameLabel\') }}</label>\n' +
    '</p-iftaLabel>\n' +
    '<small id="acct-name-error" class="field-error">{{ nameError() }}</small>\n\n' +
    '<!-- The float label is the same shape, minus the placeholder you must not add. -->\n' +
    '<p-floatLabel variant="in">\n' +
    '  <input pInputText id="acct-city" name="acctCity" [(ngModel)]="city" />\n' +
    '  <label for="acct-city">{{ translate(\'your-module.account.cityLabel\') }}</label>\n' +
    '</p-floatLabel>';

  readonly debugSnippet =
    '// Three checks, in this order, on the rendered input element.\n' +
    '// 1. Is it a library control at all?\n' +
    "el.classList.contains('p-filled')              // pInputText / pTextarea, once non-empty\n" +
    "el.closest('.p-inputwrapper-filled')           // select, datepicker, password, …\n\n" +
    '// 2. Did a placeholder cancel the float before it started?\n' +
    "el.hasAttribute('placeholder')                 // if true, the label was never down\n\n" +
    '// 3. Is there room for the label?\n' +
    "getComputedStyle(el).paddingBlockStart         // 1.5rem under p-iftaLabel and\n" +
    '                                               // under p-floatLabel variant="in"';

  readonly i18nSnippet =
    '// One key per label, owned by your module. The `your-module.` prefix is a\n' +
    '// placeholder: no such key exists in this kit.\n' +
    "// Note the budget in the key's translation instructions, not in CSS:\n" +
    "//   your-module.account.nameLabel — in-field label, max ~18 characters\n" +
    '<p-floatLabel>\n' +
    '  <input pInputText id="acct-name" name="acctName" [(ngModel)]="name" />\n' +
    '  <label for="acct-name">{{ translate(\'your-module.account.nameLabel\') }}</label>\n' +
    '</p-floatLabel>';
}
