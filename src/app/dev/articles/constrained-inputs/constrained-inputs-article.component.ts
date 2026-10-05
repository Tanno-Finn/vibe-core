import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@openng/optimus-ui/inputmask';
import { InputOtpModule } from '@openng/optimus-ui/inputotp';
import { PasswordModule } from '@openng/optimus-ui/password';
import { KeyFilterModule } from '@openng/optimus-ui/keyfilter';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    InputMaskModule,
    InputOtpModule,
    PasswordModule,
    KeyFilterModule,
    InputTextModule,
    FormsModule,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-constrained-inputs-article .stage {
        padding: 1rem;
        background: var(--surface-section);
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-constrained-inputs-article .stage--col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        align-items: flex-start;
      }

      app-constrained-inputs-article .stage--row {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }

      app-constrained-inputs-article .stage--wrap {
        flex-wrap: wrap;
      }

      app-constrained-inputs-article .col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      app-constrained-inputs-article .field-label {
        font-weight: 600;
        font-size: 0.85rem;
      }

      app-constrained-inputs-article .hint,
      app-constrained-inputs-article .note {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        max-width: 30rem;
      }

      app-constrained-inputs-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      app-constrained-inputs-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      app-constrained-inputs-article .dd__stage {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        align-items: flex-start;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 4.5rem;
      }

      app-constrained-inputs-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-constrained-inputs-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-constrained-inputs-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-constrained-inputs-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-constrained-inputs-article .checklist,
      app-constrained-inputs-article .history {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-constrained-inputs-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Constrained Inputs (Guides, category `library`).
 *
 * Four ways a text field can refuse a keystroke. Every claim below was read off
 * the shipped source of Optimus UI 2.0.2 — the fesm2022 flat bundles
 * `openng-optimus-ui-{inputmask,inputotp,password,keyfilter}.mjs` and the
 * stylesheet bundles under `@openng/optimus-ui-styles/dist/`.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - inputmask ships BOTH a directive `[pInputMask]` (signal inputs, no
 *     `unmask`, extra `(onUnmaskedChange)`; :678, :683) and a component
 *     `p-inputmask, p-inputMask, p-input-mask` (:1327, :1378). Their input sets
 *     differ; the guide documents the component.
 *   - Mask tokens are built in `initMask()` (:900-935): `9` -> `[0-9]`,
 *     `a` -> `characterPattern` (default `[A-Za-z]`, :789), `*` -> either,
 *     `?` marks the start of the optional tail (:908-911), everything else is a
 *     literal pushed into the buffer.
 *   - `autoClear` default true (:724); the wipe is in `checkVal()` :1213-1220 —
 *     an incomplete value is replaced with the empty string and the buffer
 *     cleared. `onInputBlur` calls `checkVal()` unless `keepBuffer` (:1063-1068).
 *   - Enter (k === 13) calls `onInputBlur(e)` + `updateModel(e)` WITHOUT the
 *     field losing focus (:1108-1112) — so autoClear fires on Enter.
 *   - Escape (k === 27) restores `focusText`, the value captured at focus time
 *     (:1113-1119, capture at :1240).
 *   - Backspace/Delete are reimplemented with preventDefault (:1089-1107);
 *     `seekPrev`/`seekNext` skip literal positions, `shiftL` shifts the rest.
 *   - `mask` setter calls `initMask(); writeValue(''); onModelChange(...)`
 *     (:812-817) — reassigning the mask clears the value.
 *   - `unmask` branch in `updateModel` (:1291) vs `getUnmaskedValue` (:1276-1284).
 *   - Typing runs through `keypress` (:1356, handler :1121); Android Chrome is
 *     detected in `onInit` (:876-879) and routed to `handleAndroidInput`.
 *   - Paste is wired to `handleInputChange` (:1360) — a `setTimeout(0)` that
 *     re-runs `checkVal(true)`; no clipboard filtering of its own.
 *   - Focus places the caret via `setTimeout` (:1242-1253); a complete value is
 *     fully selected (:1247-1248).
 *   - Mask A11y surface: `[attr.aria-label]`, `[attr.aria-labelledBy]`,
 *     `[attr.aria-required]`, `[attr.id]="inputId"` (:1347-1349, :1333). No role.
 *   - Mask stylesheet is inline in the bundle (:20-56): `p-inputmask` is
 *     `position: relative` with NO display rule, `width: 100%` only under
 *     `:has(.p-inputtext-fluid)`, and an invalid tint rule keyed on
 *     `.ng-invalid.ng-dirty` (:39-42). The component also forwards its
 *     `invalid` input to the inner `pInputText` (:1336), as the password
 *     (openng-optimus-ui-password.mjs:936) and each OTP box
 *     (openng-optimus-ui-inputotp.mjs:349) do.
 *   - Kit layer: all four render an `input.p-inputtext`, so the per-style
 *     `html.style-<name> input.p-inputtext` border rule in src/styles.scss and
 *     the dark `.p-inputtext` token block apply to them, and so does the kit's
 *     `input.p-inputtext.p-invalid` rule (--semantic-red-fg, !important), which
 *     beats the per-style edge; their edge and text pairs are the "form field
 *     edge" / "form field text" rows of docs/generated/CONTRAST.MD. The password
 *     icon takes --text-color-secondary (`.p-password`, "form field icon").
 *   - OTP template :337-370: `length` bare `<input pInputText>` elements, no id,
 *     no aria-label, no role on the host (host binds `cx('root')` only, :417).
 *     First box `maxlength = length`, the rest 1 (:344).
 *   - OTP auto-advance keys off `event.inputType` (:187-192); `onKeyDown`
 *     (:258-291): ArrowLeft/Right move, ArrowUp/Down preventDefault, Backspace
 *     in an empty box steps back, `integerOnly` gates keys with /^[0-9]$/.
 *   - OTP paste: `onPaste` always preventDefault (:292-300); `handleOnPaste`
 *     splits from index 0 regardless of which box received it (:301-307).
 *   - OTP `mask` is boolean -> `inputType` password (:151-153) although its doc
 *     comment reads "Mask pattern" (:91-93). `integerOnly` -> inputmode numeric
 *     (:148-150).
 *   - Password reveal: `<svg (click)="onMaskToggle()">` with class only, no
 *     button, no tabindex, no name (:957 hide, :967 show). Clear icon same shape
 *     (:947). Meter label is a bare div (:988) inside a roleless overlay (:979).
 *   - Password strength: `mediumRegex` (:546), `strongRegex` (:551),
 *     `testStrength` (:843-851) — length alone never exceeds weak.
 *   - Password strings: component falls back to the library config store
 *     (:853-869, keys `passwordPrompt`/`weak`/`medium`/`strong`,
 *     openng-optimus-ui-api.mjs:811-814); the `[pPassword]` directive carries
 *     hard-coded English literals with no store lookup (:193-208).
 *   - Password dead inputs: `showTransitionOptions` (:609) and
 *     `hideTransitionOptions` (:615) are declared and never bound — the
 *     `p-overlay` at :977 takes `motionOptions` only.
 *   - Password stylesheet (@openng/optimus-ui-styles/dist/password/index.mjs):
 *     `.p-password { display: inline-flex }`, `::-ms-reveal { display: none }`,
 *     the meter-label width transition of 1s, and the padding-inline-end
 *     `:has()` rules that reserve room for one or two trailing icons.
 *   - Password tokens (@openng/optimus-ui-themes/dist/aura/password/index.mjs):
 *     meter height .75rem, background {content.border.color}, strength fills
 *     {red.500}/{amber.500}/{green.500} light and the .400 ramp dark.
 *   - OTP tokens (.../aura/inputotp/index.mjs): root gap 0.5rem, input width
 *     2.5rem, sm 2rem, lg 3rem; the stylesheet sets `display: flex` with no
 *     wrap (@openng/optimus-ui-styles/dist/inputotp/index.mjs).
 *   - There is no aura/inputmask token file: the masked field is painted from
 *     the inputtext family.
 *   - KeyFilter: directive `[pKeyFilter]` only, no element selector (:225);
 *     NG_VALIDATORS provider (:7-11) whose `validate()` returns an error only
 *     under `pValidateOnly` (:214). Named masks and the `/./` fallback in the
 *     `pattern` setter (:12-22, :58-69). `onKeyPress` tests
 *     `existingValue + char` (:178-179). `onPaste` (:184) has no
 *     `pValidateOnly` guard. `onInput` repair path is gated on `isAndroid` (:131).
 *
 * NOT MEASURED, therefore not claimed: screen-reader announcement text on real
 * AT, on-screen keyboard behavior on physical devices, and rendered contrast of
 * the strength meter fills (Aura preset colors, not kit tokens — no row exists
 * in the contrast compilat).
 */
@Component({
  selector: 'app-constrained-inputs-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'constrained-inputs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Four controls with one thing in common: they decide that some keystrokes do not belong in the field. What
          separates them is what they know about the value — a whole written shape, a length, a secret, or only a
          character class — and how much of that knowledge reaches the person typing.
        </p>

        <h3>A fixed written shape</h3>
        <div class="stage stage--col">
          <label class="field-label" for="ci-tel">Telephone</label>
          <p-inputmask
            inputId="ci-tel"
            mask="(999) 999-9999"
            [autoClear]="false"
            [(ngModel)]="tel"
            [pt]="telPt" />
          <span class="hint" id="ci-tel-hint">{{ m.maskHint }}</span>
          <span class="note">Model value: <code>{{ tel() || 'null' }}</code></span>
        </div>

        <h3>The same mask, unmasked model</h3>
        <div class="stage stage--col">
          <label class="field-label" for="ci-tel2">Telephone, digits only in the model</label>
          <p-inputmask inputId="ci-tel2" mask="(999) 999-9999" [autoClear]="false" [unmask]="true" [(ngModel)]="tel2" />
          <span class="note">Model value: <code>{{ tel2() || 'null' }}</code></span>
          <span class="hint">{{ m.unmaskHint }}</span>
        </div>

        <h3>A one-time code</h3>
        <div class="stage stage--col">
          <span class="field-label" id="ci-otp-label">Confirmation code</span>
          <div role="group" aria-labelledby="ci-otp-label" aria-describedby="ci-otp-hint">
            <p-inputOtp [length]="6" [integerOnly]="true" [(ngModel)]="otp" />
          </div>
          <span class="hint" id="ci-otp-hint">{{ m.otpHint }}</span>
        </div>

        <h3>A secret</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="ci-pw1">With meter and reveal</label>
            <p-password inputId="ci-pw1" [toggleMask]="true" autocomplete="new-password" [(ngModel)]="pw1" />
            <span class="hint">{{ m.pwMeterHint }}</span>
          </div>
          <div class="col">
            <label class="field-label" for="ci-pw2">Meter off</label>
            <p-password inputId="ci-pw2" [feedback]="false" autocomplete="current-password" [(ngModel)]="pw2" />
            <span class="hint">{{ m.pwPlainHint }}</span>
          </div>
        </div>

        <h3>A character class</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="ci-kf1">Positive integer (blocking)</label>
            <input pInputText id="ci-kf1" pKeyFilter="pint" inputmode="numeric" [ngModel]="kf1()" (ngModelChange)="kf1.set($event)" />
            <span class="hint">{{ m.kfBlockHint }}</span>
          </div>
          <div class="col">
            <label class="field-label" for="ci-kf2">Hex (validate only)</label>
            <input pInputText id="ci-kf2" pKeyFilter="hex" [pValidateOnly]="true" [ngModel]="kf2()" (ngModelChange)="kf2.set($event)" />
            <span class="hint">{{ m.kfValidateHint }}</span>
          </div>
        </div>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which constraint fits which value</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What you know about the value</th>
                <th>Control</th>
                <th>What it enforces</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>One fixed written shape, same for every visitor</td>
                <td><code>p-inputmask</code></td>
                <td>Position-by-position character classes plus literals; completeness is checked, not meaning.</td>
              </tr>
              <tr>
                <td>A short code of known length, retyped from elsewhere</td>
                <td><code>p-inputOtp</code></td>
                <td>Length and, with <code>integerOnly</code>, digits; nothing else.</td>
              </tr>
              <tr>
                <td>A secret</td>
                <td><code>p-password</code></td>
                <td>Nothing. It masks, optionally reveals, and optionally rates.</td>
              </tr>
              <tr>
                <td>Only a character class</td>
                <td><code>[pKeyFilter]</code></td>
                <td>Which characters may be typed or pasted; no length, no shape, no form error by default.</td>
              </tr>
              <tr>
                <td>A number you will compute with</td>
                <td><code>p-inputnumber</code></td>
                <td>Locale separators, min/max, stepping — the <code>inputnumber</code> guide.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Enforcement read off the shipped bundles: the mask's per-position tests in
          <code>openng-optimus-ui-inputmask.mjs:900</code>–<code>935</code>, the OTP's key gate in
          <code>openng-optimus-ui-inputotp.mjs:282</code>–<code>288</code>, and the filter's regexes in
          <code>openng-optimus-ui-keyfilter.mjs:12</code>–<code>22</code>.
        </p>

        <h3>Naming a control that has no label surface</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — six boxes with a heading beside them</span>
            <div class="dd__stage">
              <span class="field-label">Confirmation code</span>
              <p-inputOtp [length]="4" [integerOnly]="true" [(ngModel)]="ddOtpBad" />
            </div>
            <p class="dd__why">
              The boxes carry no <code>id</code>, no <code>aria-label</code> and no group role, so the heading is
              adjacent text and each box announces as an unnamed text field.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a named group around the boxes</span>
            <div class="dd__stage">
              <span class="field-label" id="ci-dd-otp">Confirmation code</span>
              <div role="group" aria-labelledby="ci-dd-otp">
                <p-inputOtp [length]="4" [integerOnly]="true" [(ngModel)]="ddOtpGood" />
              </div>
            </div>
            <p class="dd__why">
              The wrapper carries the role and the name, so the whole control is announced once, with the boxes as its
              children.
            </p>
          </div>
        </div>

        <h3>Leaving a masked field half-finished</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — default autoClear</span>
            <div class="dd__stage">
              <label class="field-label" for="ci-dd-m1">Telephone</label>
              <p-inputmask inputId="ci-dd-m1" mask="(999) 999-9999" [(ngModel)]="ddMaskBad" />
              <span class="note">{{ m.ddMaskBadNote }}</span>
            </div>
            <p class="dd__why">
              Type three digits and press <kbd>Tab</kbd> or <kbd>Enter</kbd>: the entry is discarded and the model set
              empty, with no message and nothing to undo it.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — keep the entry, let the form judge it</span>
            <div class="dd__stage">
              <label class="field-label" for="ci-dd-m2">Telephone</label>
              <p-inputmask inputId="ci-dd-m2" mask="(999) 999-9999" [autoClear]="false" [(ngModel)]="ddMaskGood" />
              <span class="note">{{ m.ddMaskGoodNote }}</span>
            </div>
            <p class="dd__why">
              The partial value survives the blur, so a validator can name what is missing instead of the field
              silently emptying itself.
            </p>
          </div>
        </div>

        <h3>Where each one stops</h3>
        <ul>
          <li>
            <strong>The mask stops at variability.</strong> Telephone, postcode, and identifier shapes differ per
            country. One mask serves one shape; a visitor whose number does not fit has no way to enter it.
          </li>
          <li>
            <strong>The OTP stops at composition.</strong> It is for a code a person copies, not one they invent: the
            boxes cap at <code>length</code>, each is its own tab stop, and there is no place to put a caption.
          </li>
          <li>
            <strong>The password stops at policy.</strong> The meter answers with three fixed words from two regexes;
            it cannot express "no reuse", "not your e-mail" or a length-only rule.
          </li>
          <li>
            <strong>The filter stops at language.</strong> A character class that is right for a license key is wrong
            for a name — see the i18n tab.
          </li>
        </ul>

        <h4>Sources</h4>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 3.3.2, Labels or Instructions</a>
            — the criterion a mask fails when the only statement of the format is its slot characters.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 2.1.1, Keyboard</a>
            — the criterion the stock password reveal fails; it is the reason this guide asks for your own button.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 SC 1.3.5, Identify Input Purpose</a>
            — the <code>autocomplete</code> tokens, including the one the OTP component cannot set.
          </li>
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noopener noreferrer">NIST SP 800-63B, Digital Identity Guidelines</a>
            — the primary source for preferring length over composition rules, which is exactly where the library's
            two strength regexes disagree with current guidance.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event" target="_blank" rel="noopener noreferrer">MDN, <code>keypress</code> event (deprecated)</a>
            — the event the key filter still blocks on, and the reason composition input escapes it.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete" target="_blank" rel="noopener noreferrer">MDN, <code>autocomplete</code> attribute</a>
            — the <code>one-time-code</code> token and the password tokens these fields should carry.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Where the paint comes from</h3>
        <p>
          All four are ordinary text fields underneath — the three components render an
          <code>&lt;input pInputText&gt;</code> and the key filter sits on yours — so they take the whole
          <code>inputtext</code> token family for border, fill, radius, and padding, and with it the kit layer: the
          per-style <code>html.style-&lt;name&gt; input.p-inputtext</code> rule in <code>src/styles.scss</code> sets
          the edge color per style, and its width too (2px in werkbund and lernwerkstatt, 1.5px in skizzenbuch;
          blaupause keeps the stock width; dark lernwerkstatt falls back to <code>--control-border</code>), and the dark <code>.p-inputtext</code> block
          re-points fill, text, edge, and placeholder to kit tokens. The kit's
          <code>.p-inputtext:focus-visible</code> rule gives every one of them, each OTP box included, the 2px
          <code>--primary-color-fg</code> ring at 2px offset that Aura's zeroed form-field ring leaves out. Only the
          parts that are unique to each control have tokens of their own.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Token chain</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OTP gap between boxes</td>
                <td><code>inputotp.gap</code></td>
                <td>{{ m.otpGap }}</td>
              </tr>
              <tr>
                <td>OTP box width</td>
                <td><code>inputotp.input.width</code> / <code>.sm</code> / <code>.lg</code></td>
                <td>{{ m.otpWidth }}</td>
              </tr>
              <tr>
                <td>Strength bar track</td>
                <td><code>password.meter.height</code>, <code>password.meter.background</code></td>
                <td>{{ m.meterTrack }}</td>
              </tr>
              <tr>
                <td>Strength bar fill</td>
                <td><code>password.strength.weak|medium|strong.background</code></td>
                <td>{{ m.meterFill }}</td>
              </tr>
              <tr>
                <td>Strength overlay</td>
                <td><code>password.overlay.*</code></td>
                <td>{{ m.pwOverlay }}</td>
              </tr>
              <tr>
                <td>Reveal and clear icon</td>
                <td><code>password.icon.color</code>, <code>form.field.padding.x</code>, <code>icon.size</code></td>
                <td>{{ m.pwIcon }}</td>
              </tr>
              <tr>
                <td>Masked field</td>
                <td>— none —</td>
                <td>{{ m.maskTokens }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and defaults from <code>&#64;openng/optimus-ui-themes/dist/aura/password/index.mjs</code> and
          <code>.../aura/inputotp/index.mjs</code>; the rules that consume them from
          <code>&#64;openng/optimus-ui-styles/dist/password/index.mjs</code> and <code>.../dist/inputotp/index.mjs</code>.
          There is no <code>aura/inputmask</code> entry in the theme package.
        </p>

        <h3>The strength meter, drawn</h3>
        <p>{{ m.meterProse }}</p>
        <p class="src-note">
          Widths and the label mapping from <code>openng-optimus-ui-password.mjs:801</code>–<code>833</code>; the 1s
          width transition from <code>.p-password-meter-label</code> in the password stylesheet.
        </p>

        <h3>Icons sit on top of the text</h3>
        <p>{{ m.iconOverlapProse }}</p>
        <p class="src-note">
          The reservation rules are the <code>:has(.p-password-toggle-mask-icon)</code> and
          <code>:has(.p-password-clear-icon)</code> selectors in the password stylesheet; the masked field's own clear
          icon is positioned by <code>.p-inputmask-clear-icon</code> in the rules inlined at
          <code>openng-optimus-ui-inputmask.mjs:20</code>–<code>56</code>.
        </p>

        <h3>Contrast</h3>
        <div class="table-wrap">
          <table>
            <caption>
              The field every one of the four renders, <code>input.p-inputtext</code> on
              <code>inputtext.background</code>, per visual style and mode
            </caption>
            <thead>
              <tr>
                <th>Style</th>
                <th>Mode</th>
                <th>Value text (SC 1.4.3, 4.5:1)</th>
                <th>Placeholder (SC 1.4.3, 4.5:1)</th>
                <th>Resting edge (SC 1.4.11, 3:1)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>light</td><td>10.35:1</td><td>4.76:1</td><td>18.73:1</td></tr>
              <tr><td>werkbund</td><td>dark</td><td>13.32:1</td><td>5.91:1</td><td>13.32:1</td></tr>
              <tr><td>lernwerkstatt</td><td>light</td><td>10.35:1</td><td>4.76:1</td><td>14.97:1</td></tr>
              <tr><td>lernwerkstatt</td><td>dark</td><td>11.63:1</td><td>5.93:1</td><td>4.42:1</td></tr>
              <tr><td>skizzenbuch</td><td>light</td><td>10.35:1</td><td>4.76:1</td><td>3.62:1</td></tr>
              <tr><td>skizzenbuch</td><td>dark</td><td>10.08:1</td><td>4.79:1</td><td>4.53:1</td></tr>
              <tr><td>blaupause</td><td>light</td><td>10.35:1</td><td>4.76:1</td><td>4.09:1</td></tr>
              <tr><td>blaupause</td><td>dark</td><td>9.35:1</td><td>5.14:1</td><td>3.25:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows of <code>docs/generated/CONTRAST.MD</code>, groups "form field text" (<code>inputtext.color</code>,
          <code>inputtext.placeholder.color</code>) and "form field edge" (the per-style
          <code>input.p-inputtext</code> border on <code>inputtext.background</code>), each style block, both modes.
          The light value text is Aura's stock <code>form.field.color</code> in every style; dark re-points it to
          <code>--text-color</code>. The password's reveal and clear icon take <code>--text-color-secondary</code>
          (kit rule <code>.p-password</code>, in place of Aura's surface.400): 4.79&#8211;7.78:1 on the field, "form
          field icon" (<code>password.icon.color</code>). The invalid edge, <code>--semantic-red-fg</code>, is
          5.66&#8211;7.93:1 on the same fill ("form field edge", <code>inputtext.invalid.border.color</code>).
        </p>
        <p>{{ m.contrastProse }}</p>

        <h3>How the invalid tint reaches each field</h3>
        <p>{{ m.invalidProse }}</p>
        <p class="src-note">
          The forwarded input at <code>openng-optimus-ui-inputmask.mjs:1336</code>,
          <code>openng-optimus-ui-password.mjs:936</code>, and <code>openng-optimus-ui-inputotp.mjs:349</code>; the
          form-class rules inlined at <code>openng-optimus-ui-inputmask.mjs:39</code>–<code>42</code> and
          <code>openng-optimus-ui-password.mjs:31</code>–<code>32</code>; <code>.p-inputtext.p-invalid</code> in
          <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>; the per-style
          <code>input.p-inputtext</code> rules and the kit's <code>input.p-inputtext.p-invalid</code> rule in
          <code>src/styles.scss</code>.
        </p>

        <h3>On a narrow screen</h3>
        <p>{{ m.responsiveProse }}</p>
        <p class="src-note">
          Widths and gap from the <code>inputotp</code> token file above; <code>display: flex</code> without a wrap
          declaration and <code>.p-password &#123; display: inline-flex &#125;</code> from the two stylesheets;
          <code>p-inputmask</code>'s <code>width: 100%</code> under <code>:has(.p-inputtext-fluid)</code> from the
          inlined mask rules.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Two shapes per family</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Import</th>
                <th>Selectors</th>
                <th>What it is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>InputMaskModule</code></td>
                <td><code>p-inputmask</code>, <code>p-inputMask</code>, <code>p-input-mask</code></td>
                <td>Component with a <code>ControlValueAccessor</code>; owns <code>unmask</code> and the clear icon.</td>
              </tr>
              <tr>
                <td><code>InputMaskModule</code></td>
                <td><code>[pInputMask]</code></td>
                <td>
                  Directive on your own <code>&lt;input&gt;</code>. Signal inputs, no <code>unmask</code>, an extra
                  <code>(onUnmaskedChange)</code>, and no editable-holder inputs.
                </td>
              </tr>
              <tr>
                <td><code>InputOtpModule</code></td>
                <td><code>p-inputOtp</code>, <code>p-inputotp</code>, <code>p-input-otp</code></td>
                <td>Component only.</td>
              </tr>
              <tr>
                <td><code>PasswordModule</code></td>
                <td><code>p-password</code></td>
                <td>Component with meter, overlay, and reveal.</td>
              </tr>
              <tr>
                <td><code>PasswordModule</code></td>
                <td><code>[pPassword]</code></td>
                <td>
                  Directive that builds its overlay imperatively into <code>document.body</code>; its four strength
                  strings are hard-coded English with no config lookup.
                </td>
              </tr>
              <tr>
                <td><code>KeyFilterModule</code></td>
                <td><code>[pKeyFilter]</code></td>
                <td>Directive only — there is no element form.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selector lists and metadata: <code>openng-optimus-ui-inputmask.mjs:678</code> and <code>:1327</code>,
          <code>openng-optimus-ui-inputotp.mjs:337</code>, <code>openng-optimus-ui-password.mjs:452</code> and
          <code>:914</code>, <code>openng-optimus-ui-keyfilter.mjs:225</code>. The directive's imperative panel is at
          <code>openng-optimus-ui-password.mjs:273</code>–<code>290</code>.
        </p>

        <h3>Mask syntax</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Character in <code>mask</code></th>
                <th>Accepts</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>9</code></td><td><code>[0-9]</code></td></tr>
              <tr><td><code>a</code></td><td><code>characterPattern</code>, default <code>[A-Za-z]</code></td></tr>
              <tr><td><code>*</code></td><td><code>characterPattern</code> or a digit</td></tr>
              <tr><td><code>?</code></td><td>Not a slot: everything after it is optional for completeness.</td></tr>
              <tr><td>anything else</td><td>A literal, written into the buffer and skipped by the caret.</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Built in <code>initMask()</code>, <code>openng-optimus-ui-inputmask.mjs:892</code>–<code>935</code>. Because
          <code>characterPattern</code> feeds both <code>a</code> and <code>*</code>, widening it for accents widens
          both.
        </p>

        <h3>Keyboard</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th><code>p-inputmask</code></th>
                <th><code>p-inputOtp</code></th>
                <th><code>p-password</code> / <code>[pKeyFilter]</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>One stop.</td>
                <td>One stop <em>per box</em> — a six-digit code costs six.</td>
                <td>One stop; the reveal icon is not in the order at all.</td>
              </tr>
              <tr>
                <td><kbd>Backspace</kbd></td>
                <td>Reimplemented: clears the previous slot and prevents the default.</td>
                <td>In an empty box, moves focus one box back.</td>
                <td>Native.</td>
              </tr>
              <tr>
                <td><kbd>Delete</kbd></td>
                <td>Reimplemented: clears the next slot.</td>
                <td>Allowed even at full length.</td>
                <td>Native.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Runs the blur path in place — with <code>autoClear</code> on, this empties the field.</td>
                <td>Nothing special; submits the form.</td>
                <td>Password: nothing special. Filter: passed through.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Restores the value the field had when it was focused.</td>
                <td>Nothing.</td>
                <td>Password: closes the strength overlay until the next keystroke.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> <kbd>→</kbd></td>
                <td>Native caret movement.</td>
                <td>Move between boxes, default prevented.</td>
                <td>Native.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> <kbd>↓</kbd></td>
                <td>Native.</td>
                <td>Swallowed.</td>
                <td>Native.</td>
              </tr>
              <tr>
                <td>Focus</td>
                <td>Caret jumps to the first free slot; a complete value is fully selected.</td>
                <td>The box's content is selected, so typing replaces it.</td>
                <td>Password: opens the overlay when <code>feedback</code> is on.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>onInputKeydown</code> at <code>openng-optimus-ui-inputmask.mjs:1077</code>–<code>1120</code> and the
          focus caret at <code>:1233</code>–<code>:1253</code>; <code>onKeyDown</code> at
          <code>openng-optimus-ui-inputotp.mjs:258</code>–<code>291</code> and the focus select at <code>:251</code>;
          the password overlay's focus and keyup handling at
          <code>openng-optimus-ui-password.mjs:773</code>–<code>800</code>.
        </p>

        <h3>Inputs that compile and do nothing</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Binding</th>
                <th>What actually happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;p-password [showTransitionOptions]="…"&gt;</code></td>
                <td>{{ m.deadPwTransition }}</td>
              </tr>
              <tr>
                <td><code>&lt;p-password [pattern]="…"&gt;</code>, <code>[min]</code>, <code>[max]</code>, <code>[step]</code></td>
                <td>{{ m.deadBaseInputs }}</td>
              </tr>
              <tr>
                <td><code>&lt;p-inputOtp [mask]="'999'"&gt;</code></td>
                <td>{{ m.deadOtpMask }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="pint" pattern="[0-9]*"&gt;</code></td>
                <td>{{ m.deadKfPattern }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="integer"&gt;</code> (misspelled mask)</td>
                <td>{{ m.deadKfTypo }}</td>
              </tr>
              <tr>
                <td><code>&lt;input pKeyFilter="pint" [(ngModel)]="v"&gt;</code></td>
                <td>{{ m.deadKfBanana }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The password declarations at <code>openng-optimus-ui-password.mjs:609</code> and <code>:615</code> against
          the <code>p-overlay</code> binding at <code>:977</code>; the OTP <code>mask</code> getter at
          <code>openng-optimus-ui-inputotp.mjs:151</code>–<code>153</code>; the filter's public input name in the
          directive metadata at <code>openng-optimus-ui-keyfilter.mjs:225</code> and the <code>/./</code> fallback in
          its <code>pattern</code> setter.
        </p>

        <h3>Wiring to a form</h3>
        <p>{{ m.formsProse }}</p>
        <pre class="code-block"><code>{{ formSnippet }}</code></pre>
        <p class="src-note">
          The value accessors are <code>INPUTMASK_VALUE_ACCESSOR</code>, <code>INPUT_OTP_VALUE_ACCESSOR</code> and
          <code>Password_VALUE_ACCESSOR</code> in the three bundles; the filter's validator is
          <code>KEYFILTER_VALIDATOR</code> at <code>openng-optimus-ui-keyfilter.mjs:7</code>–<code>11</code>.
        </p>

        <h3>Reaching the elements the templates keep private</h3>
        <p>{{ m.ptProse }}</p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          The OTP box binds <code>[pt]="ptm('pcInputText')"</code> at
          <code>openng-optimus-ui-inputotp.mjs:362</code>; the pass-through key is the class name in the same file's
          <code>classes</code> map at <code>:16</code>–<code>:19</code>.
        </p>

        <h3>Accessibility</h3>
        <ul>
          <li>
            <strong>Label what can be labeled.</strong> <code>p-inputmask</code> and <code>p-password</code> render a
            real <code>&lt;input&gt;</code> carrying <code>inputId</code>, so <code>&lt;label for&gt;</code> binds.
            <code>p-inputOtp</code> renders none of that: give it a <code>role="group"</code> wrapper with
            <code>aria-labelledby</code>.
          </li>
          <li>
            <strong>Ship your own reveal.</strong> The stock one is an <code>&lt;svg&gt;</code> with a click handler,
            and the library hides the browser's native reveal button in the same stylesheet — so a keyboard user has
            no way to unmask. A <code>&lt;button type="button"&gt;</code> with an
            <code>aria-pressed</code> state and a translated name is the fix.
          </li>
          <li>
            <strong>Announce the strength yourself if it matters.</strong> The meter's label is a plain
            <code>div</code> in an overlay with no role; render the same assessment into your own
            <code>aria-live="polite"</code> region, or turn <code>feedback</code> off.
          </li>
          <li>
            <strong>Write the format as text.</strong> The slot characters are the value, not a description — a person
            using a screen reader hears underscores, not "three digits, then four".
          </li>
          <li>
            <strong>Set <code>autocomplete</code>.</strong> <code>current-password</code> or
            <code>new-password</code> on the password; <code>one-time-code</code> on the OTP, which needs
            <code>[pt]</code> to get there.
          </li>
          <li>
            <strong>Never let a refusal be the only feedback.</strong> A blocked keystroke produces no event, no
            message and no sound.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ Mask and password fields have <code>inputId</code> and a real <code>&lt;label for&gt;</code>.</li>
          <li>☐ The OTP sits in a named <code>role="group"</code> wrapper that also states the expected length.</li>
          <li>☐ The accepted format is visible text linked by <code>aria-describedby</code> on the inner input (through <code>pt</code>) or on the OTP's group wrapper — not on the host element, and not only slot characters.</li>
          <li>☐ Revealing a password is possible from the keyboard, with a named button.</li>
          <li>☐ <code>[autoClear]="false"</code> anywhere a partial value must survive a blur or an <kbd>Enter</kbd>.</li>
          <li>☐ Validity comes from the form model, not from the mask or the filter.</li>
          <li>☐ <code>autocomplete</code> is set on password and OTP fields.</li>
          <li>☐ No character filter sits on a name, place, or free-text field.</li>
          <li>☐ Focus is visible on every one of these in <strong>both</strong> themes.</li>
        </ul>

        <h4>Test it</h4>
        <p>{{ m.testProse }}</p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Four strings you did not write</h3>
        <p>
          Three of these controls ship no user-visible text at all. <code>p-password</code> is the exception: with
          <code>feedback</code> on, the overlay shows a prompt and one of three verdicts.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Input that overrides it</th>
                <th>Fallback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prompt, shown while the field is empty</td>
                <td><code>promptLabel</code></td>
                <td>Library config key <code>passwordPrompt</code></td>
              </tr>
              <tr>
                <td>Weak</td>
                <td><code>weakLabel</code></td>
                <td>Library config key <code>weak</code></td>
              </tr>
              <tr>
                <td>Medium</td>
                <td><code>mediumLabel</code></td>
                <td>Library config key <code>medium</code></td>
              </tr>
              <tr>
                <td>Strong</td>
                <td><code>strongLabel</code></td>
                <td>Library config key <code>strong</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The four fallbacks are <code>promptText()</code>, <code>weakText()</code>, <code>mediumText()</code> and
          <code>strongText()</code> at <code>openng-optimus-ui-password.mjs:853</code>–<code>869</code>, reading the
          keys declared in <code>openng-optimus-ui-api.mjs:811</code>–<code>814</code>. The
          <code>[pPassword]</code> directive has the same four inputs but no lookup — its defaults are English
          literals at <code>:193</code>–<code>:208</code>.
        </p>
        <p>{{ m.i18nPwProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>The mask is locale data, not markup</h3>
        <ul>
          <li>
            <strong>The mask string belongs in the language bundle.</strong> Telephone groupings, postcode shapes, and
            national identifiers differ per country; so does the hint that mirrors them, and so can
            <code>slotChar</code>, which is what a person sees in every empty slot.
          </li>
          <li>
            <strong>Do not swap it under a filled field.</strong> Reassigning <code>mask</code> clears the value, so a
            language switch on a half-filled form loses the entry. Re-key the field, or resolve the mask once when
            the form is built.
          </li>
          <li>
            <strong><code>characterPattern</code> is Latin by default.</strong> It is <code>[A-Za-z]</code>, and it
            feeds both the <code>a</code> and the <code>*</code> mask tokens — widen it before masking anything a
            person might write with accents.
          </li>
        </ul>

        <h3>A character filter can be a language decision</h3>
        <p>{{ m.i18nFilterProse }}</p>
        <p class="src-note">
          The named masks are the <code>DEFAULT_MASKS</code> object at
          <code>openng-optimus-ui-keyfilter.mjs:12</code>–<code>22</code>; <code>alpha</code> is
          <code>/^[a-z_]*$/i</code> and <code>alphanum</code> <code>/^[a-z0-9_]*$/i</code>.
        </p>

        <h3>Length and layout</h3>
        <ul>
          <li>
            <strong>The three verdicts are single words in English and phrases elsewhere.</strong> The overlay is
            sized by the field it hangs under, so a longer verdict wraps rather than truncating — but check it at the
            narrowest field you ship.
          </li>
          <li>
            <strong>The OTP group's name and hint are the whole announcement.</strong> Nothing inside the control is
            readable, so those two strings carry the entire meaning in every language.
          </li>
          <li>
            <strong>A hint that names a format must be translated as a format.</strong> "10 digits" is not
            transliterated — the number of digits itself changes with the mask you chose for that locale.
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.2 — 2026-09-23 — Synced with the contrast and focus rounds: <code>[invalid]</code> alone now draws the
            kit's <code>--semantic-red-fg</code> edge on all four fields, the OTP boxes included; the password icon is the
            gated <code>--text-color-secondary</code> ("form field icon"). The invalid-tint prose, the icon row, and the
            contrast note say so.
          </li>
          <li>
            v1.1 — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): the Design tab
            names the kit layer all four fields render under (the per-style <code>input.p-inputtext</code> edge and the
            dark token block), cites the "form field text" and "form field edge" rows per style and mode, and states
            how the invalid tint reaches each field; the validity claim now includes the forwarded
            <code>invalid</code> input. Agent doc trimmed under its byte aim.
          </li>
          <li>v1.0 — 2026-09-07 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ConstrainedInputsArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly tel = signal<string | null>(null);
  /** Reaches the inner <input>: aria-describedby on the host element names nothing (openng-optimus-ui-inputmask.mjs:1331). */
  readonly telPt = { pcInputText: { root: { 'aria-describedby': 'ci-tel-hint' } } };
  readonly tel2 = signal<string | null>(null);
  readonly otp = signal<string | null>(null);
  readonly pw1 = signal<string | null>(null);
  readonly pw2 = signal<string | null>(null);
  readonly kf1 = signal<string | number | null>(null);
  readonly kf2 = signal<string | number | null>(null);
  readonly ddOtpBad = signal<string | null>(null);
  readonly ddOtpGood = signal<string | null>(null);
  readonly ddMaskBad = signal<string | null>(null);
  readonly ddMaskGood = signal<string | null>(null);

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    maskHint:
      'The field shows the whole mask from the moment it is focused, and the caret skips the literal characters. With autoClear switched off, an incomplete entry survives leaving the field.',
    unmaskHint:
      'Same mask, different model: unmask stores only the characters that matched a slot, so the parentheses, the space, and the hyphen never reach the form value. Pick one of the two per field and write the validators for it.',
    otpHint:
      'Six boxes, digits only. Paste the whole code into any box and it fills all six; the first box also accepts a typed multi-character value because its maxlength is the full length while every other box takes one.',
    pwMeterHint:
      'The overlay opens on focus and shows the prompt before anything is typed. The eye icon is a click target only — it is not in the tab order.',
    pwPlainHint: 'With feedback off there is no overlay and no strength assessment; the field is a masked text field.',
    kfBlockHint:
      'Blocking mode: a forbidden key never produces a character, and a paste containing one is refused whole. The form control is valid regardless of what the field holds.',
    kfValidateHint:
      'Validate-only mode: typing is unrestricted and the control reports validatePattern instead. Paste is still filtered — the paste handler is not covered by the switch.',

    ddMaskBadNote: 'autoClear is on by default.',
    ddMaskGoodNote: 'autoClear is off.',

    otpGap: '0.5rem, fixed — not size-dependent',
    otpWidth: '2.5rem default, 2rem small, 3rem large',
    meterTrack: '0.75rem high, filled with {content.border.color}',
    meterFill: '{red.500} / {amber.500} / {green.500} in light, the .400 ramp in dark',
    pwOverlay: 'The popover family: {overlay.popover.background}, .border.color, .border.radius, .padding, .shadow',
    pwIcon: '--text-color-secondary (kit; Aura {form.field.icon.color}); the field reserves 2 × padding.x + icon.size of trailing room per icon',
    maskTokens: 'No token file of its own — it is an inputtext with an inline positioning rule for the clear icon',

    meterProse:
      'The bar is a fixed-height track with a fill whose width is one of three literal percentages: 33.33% for weak, 66.66% for medium, 100% for strong, and zero when the field is empty. The fill animates its width over one second, so the bar is still moving when the next keystroke re-evaluates it. Weak, medium, and strong differ by fill color and by the word underneath — the width alone is the only non-color cue, and it is not announced.',

    iconOverlapProse:
      'The reveal and clear icons are absolutely positioned over the trailing edge of the field, and the stylesheet compensates by padding the input: one icon reserves twice the field padding plus one icon width, two icons reserve three times the padding plus two icon widths. That arithmetic is driven by :has() selectors on the rendered icons, so it is correct for the stock icons and silently wrong for an icon you add yourself — a custom affordance placed in the same corner will sit on top of the text.',

    contrastProse:
      "Every pair passes in every style. The thinnest margins are the light placeholder (4.76:1, stock Aura, the same in all four styles) and the dark blaupause edge (3.25:1). The strength meter is a different matter: its fills and track come from the Aura preset, the compilat has no row for them, and the guide states no number. If the meter's verdict has to be readable as color, measure the three fills against the track and the overlay background in your own build — and keep the word under the bar, because color alone is not a statement.",

    invalidProse:
      'Two paths paint the red edge. Every component forwards its invalid input to the inner pInputText, which then carries .p-invalid; the mask and the password additionally ship rules keyed on Angular\'s ng-invalid.ng-dirty classes on their host, and a key-filtered input of your own gets the inputtext rule for the same classes. In this kit the per-style html.style-<name> input.p-inputtext edge rule is more specific than .p-inputtext.p-invalid, so the kit adds input.p-inputtext.p-invalid with !important: [invalid] alone draws the --semantic-red-fg edge in every style, focused too — which matters most for the OTP boxes, which see no form classes and have that path only. The form-class rules land as well. The edge is still color alone: put the error message beside the field, and for the OTP beside the group.',

    responsiveProse:
      'The OTP control is the one with real width arithmetic: a flex row with no wrap declaration, so its width is length × box width + (length − 1) × 0.5rem. Six default boxes come to 17.5rem (280px) and fit a 360px viewport; eight come to 23.5rem (376px) and overflow it, because nothing wraps and nothing scrolls. Below that width, drop to the small box size (2rem, so eight boxes are 19.5rem) or give the wrapper its own horizontal scroll. The other three have no intrinsic responsive behavior at all: p-password is inline-flex and keeps its input at the browser default width unless you set fluid, at which point it becomes a flex box with a full-width input; p-inputmask has no display rule of its own and only reaches width: 100% when its inner input is fluid; and a key-filtered field is whatever your own input already was.',

    deadPwTransition:
      'Nothing. Both transition inputs are still declared on the component but the overlay it renders takes motionOptions instead, and neither value is bound anywhere in the template.',
    deadBaseInputs:
      'Nothing. These four come from the shared base input class and type-check under strictTemplates, but neither the mask nor the password reads them into the rendered element. Express the rule in the form model.',
    deadOtpMask:
      'Masks the boxes. Despite the "Mask pattern" doc comment the input is a boolean: any truthy value switches every box to type="password", and the string is never used as a pattern.',
    deadKfPattern:
      'Sets the native HTML pattern attribute and leaves the filter at its default. The filter\'s public input name is the selector itself; the class field called pattern is not what a template binds.',
    deadKfBanana:
      "Does not compile. The directive declares an ngModelChange output of its own, so under strictTemplates the property half of the two-way binding lands on NgModel and the event half on KeyFilter — NG8007. Write the halves separately, [ngModel] plus (ngModelChange).",
    deadKfTypo:
      'Disables the filter. An unrecognized name falls back to a regular expression matching any single character, so every keystroke passes and nothing reports the typo.',

    formsProse:
      'All three components register a value accessor, so ngModel and formControlName work without extra wiring; the key filter registers a validator instead and never writes a value. That asymmetry is the thing to plan around: in blocking mode the filter reports no error at all, so a value that arrived from patchValue, from an autofill, or from an initial load is never challenged. Give the control a real validator as well.',

    ptProse:
      'The OTP boxes are rendered by the component and exposed through nothing except the pass-through map, which is inherited from the shared base component and appears in no per-component input list. The key is the box class name, and the object it takes is written onto the rendered element — which is how an attribute the public API has no input for, such as the one-time-code autocomplete token, reaches the boxes.',

    testProse:
      'A spec in the kit\'s real setup (TestBed + Vitest via @angular/build:unit-test), asserting the one that bites hardest: a masked field left half-finished must keep what the person typed.',

    i18nPwProse:
      'Two consequences follow from the fallback chain. The component reads the library\'s own translation store, not this kit\'s TranslationService, so the words do not move when the page language changes unless that store is filled as well; and the [pPassword] directive has no lookup at all, so it stays English whatever you do to either store. Passing the four labels from a translated map is the route that works for both, and it is the only one that keeps the strings in the same place as the rest of your copy.',

    i18nFilterProse:
      'The named masks alpha and alphanum accept the Latin letters a–z plus the underscore, and nothing else — no ä, no ø, no ł, no Cyrillic, Greek, Arabic, or CJK. A name field carrying either of them is unusable for a large share of the people it is meant for, and the refusal is silent. Restrict a license key or a slug if you must; never a name, a place, or free text. Where a class really is needed across languages, pass your own RegExp with the Unicode property escapes for the script you accept, and remember that the filter is not a validator.',
  };

  readonly formSnippet: string = "// Reactive forms: the three components are value accessors, the filter is not.\n" +
    "form = this.fb.group({\n" +
    "  telephone: ['', [Validators.required, Validators.pattern(/^\\d{10}$/)]],\n" +
    "  code:      ['', [Validators.required, Validators.minLength(6)]],\n" +
    "  secret:    ['', [Validators.required, Validators.minLength(12)]],\n" +
    "});\n" +
    "\n" +
    "// <p-inputmask formControlName=\"telephone\" [unmask]=\"true\" [autoClear]=\"false\">\n" +
    "// <p-inputOtp  formControlName=\"code\" [length]=\"6\" [integerOnly]=\"true\">\n" +
    "// <p-password  formControlName=\"secret\" [feedback]=\"false\">\n" +
    "//\n" +
    "// [pKeyFilter] adds NG_VALIDATORS only, and only under pValidateOnly:\n" +
    "// <input pInputText formControlName=\"code\" pKeyFilter=\"pint\" [pValidateOnly]=\"true\">\n" +
    "//   -> control error { validatePattern: false } when the value breaks the mask.\n" +
    "// Without pValidateOnly the control is valid whatever it holds.";

  readonly ptSnippet: string = '<!-- The OTP boxes take no attributes through the public API. -->\n' +
    '<div role="group" [attr.aria-labelledby]="\'code-label\'">\n' +
    '  <p-inputOtp\n' +
    '    [length]="6"\n' +
    '    [integerOnly]="true"\n' +
    '    [pt]="otpPassThrough"\n' +
    '    formControlName="code" />\n' +
    '</div>\n' +
    '\n' +
    '// component class\n' +
    "readonly otpPassThrough = { pcInputText: { root: { autocomplete: 'one-time-code' } } };";

  readonly testSnippet: string = "it('keeps a partial masked value when autoClear is off', async () => {\n" +
    "  const fixture = TestBed.createComponent(HostComponent);\n" +
    "  fixture.detectChanges();\n" +
    "\n" +
    "  const input: HTMLInputElement = fixture.nativeElement.querySelector('p-inputmask input');\n" +
    "  input.focus();\n" +
    "  input.value = '(123) 4';\n" +
    "  input.dispatchEvent(new Event('input'));\n" +
    "  input.dispatchEvent(new Event('blur'));\n" +
    "  await fixture.whenStable();\n" +
    "  fixture.detectChanges();\n" +
    "\n" +
    "  // With the default autoClear this reads '' — the entry is discarded silently.\n" +
    "  expect(fixture.componentInstance.form.controls.telephone.value).toContain('123');\n" +
    "});";

  readonly i18nSnippet: string = "// Resolve the library's four strings through the kit's TranslationService,\n" +
    "// so they follow a language switch like every other label.\n" +
    "readonly labels = computed(() => ({\n" +
    "  secret:  this.i18n.translate('your-module.password.label'),\n" +
    "  prompt:  this.i18n.translate('your-module.password.prompt'),\n" +
    "  weak:    this.i18n.translate('your-module.password.weak'),\n" +
    "  medium:  this.i18n.translate('your-module.password.medium'),\n" +
    "  strong:  this.i18n.translate('your-module.password.strong'),\n" +
    "}));\n" +
    "\n" +
    "// <p-password\n" +
    "//   inputId=\"secret\"\n" +
    "//   [promptLabel]=\"labels().prompt\"\n" +
    "//   [weakLabel]=\"labels().weak\"\n" +
    "//   [mediumLabel]=\"labels().medium\"\n" +
    "//   [strongLabel]=\"labels().strong\" />";
}
