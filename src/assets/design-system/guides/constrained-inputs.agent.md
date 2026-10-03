---
id: constrained-inputs
title: Constrained Inputs
category: library
tags: [form, input, validation, security]
summary: Text fields that refuse the wrong keystroke — a fixed format, a one-time code, a secret, or a character class — and what each refusal costs.
related: [text-inputs, forms, inputnumber, a11y-guidelines]
covers: [inputmask, inputotp, password, keyfilter]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: A masked field, a six-box OTP, a password with meter and reveal, and a key-filtered field, each with its label wiring
  usage: Which constraint fits which value, Do/Don't pairs on naming and clearing, and where each control stops being right
  design: Token chains, the kit's per-style field edge, contrast rows per style and mode, OTP width arithmetic, icon overlap, 360px
  development: Full input tables, the keyboard contract per control, dead inputs, form wiring, and the A11y checklist
  i18n: The four library strings, why a mask is locale data, and why alpha filters reject non-Latin names
  history: Document changelog
---

## When to use
- **`p-inputmask`** — a value with one fixed written shape: telephone, IBAN, license key, postcode.
- **`p-inputOtp`** — a short code retyped from another device: SMS, authenticator, e-mail confirmation.
- **`p-password`** — a secret: a reveal affordance and an optional strength overlay on top of `type="password"`.
- **`[pKeyFilter]`** — a directive on *your own* `<input>`: refuse a character class (digits, hex, alphanumeric) where no fixed shape exists.

## When not to use
- A measured number → `p-inputnumber`; a date → `p-datepicker`; plain free text → `pInputText` (`text-inputs`).
- A mask for a value whose shape varies by country or carrier: a value that does not fit cannot be entered.
- `[pKeyFilter]` on a name, place, address, or any free text. `alpha`/`alphanum` are `[a-z_]`/`[a-z0-9_]` (`openng-optimus-ui-keyfilter.mjs:20`–`21`): they reject ä, ø, ł, and every non-Latin script.
- `p-inputOtp` for anything a person composes — boxes cap at `length`, no label surface.

## Key API
`InputMaskModule`, `InputOtpModule`, `PasswordModule`, `KeyFilterModule` (`@openng/optimus-ui/<name>`). Mask and password also ship a directive form (`[pInputMask]`, `[pPassword]`) with fewer inputs.

| Control | Shape | The inputs that decide behavior |
| --- | --- | --- |
| `p-inputmask, p-inputMask, p-input-mask` | component, CVA | `mask` (`9`=digit, `a`=`characterPattern`, `*`=either, `?`=rest optional, else literal), `slotChar` (`'_'`), `autoClear` (`true`), `unmask`, `keepBuffer`, `inputId`, `ariaLabel`, `showClear`; `(onComplete)`, `(onClear)` |
| `p-inputOtp, p-inputotp, p-input-otp` | component, CVA | `length` (`4`), `integerOnly`, `mask`, `readonly`, `tabindex`, `variant`, `size`; `(onChange)`, `(onFocus)`, `(onBlur)` |
| `p-password` | component, CVA | `toggleMask`, `feedback` (`true`), `promptLabel`/`weakLabel`/`mediumLabel`/`strongLabel`, `mediumRegex`/`strongRegex`, `inputId`, `ariaLabel`, `autocomplete`, `showClear`, `appendTo` |
| `[pKeyFilter]` | directive, validator only | `pKeyFilter` (named mask or `RegExp`), `pValidateOnly` |

- **`p-inputOtp` has no label surface.** No `inputId`, no `ariaLabel`, no `id` on any box (`openng-optimus-ui-inputotp.mjs:340`–`364`).
- **`[pKeyFilter]`'s input is named after the selector.** `pattern="…"` beside it sets only the native attribute.
- Mask and password inherit `pattern`, `min`, `max`, `step`, `inputSize` from the base input; only the mask reads `inputSize` (as `size`, `openng-optimus-ui-inputmask.mjs:1342`). The password's `maxlength` falls back to its older `maxLength` (`openng-optimus-ui-password.mjs:932`). `p-inputOtp` extends the editable holder instead (`openng-optimus-ui-inputotp.mjs:61`). Password's `showTransitionOptions`/`hideTransitionOptions` (`openng-optimus-ui-password.mjs:609`, `:615`) are no longer bound; its `p-overlay` (`:977`) takes `motionOptions`.
- The three components are `ControlValueAccessor`s; `[pInputMask]` writes its buffer into the element and re-dispatches `input` (`openng-optimus-ui-inputmask.mjs:328`, `:362`), so `ngModel` sees the masked string. `[pKeyFilter]` is only an `NG_VALIDATORS` provider — it never writes a value; its `(ngModelChange)` fires only on the Android path (`openng-optimus-ui-keyfilter.mjs:131`).
- Password `showClear` renders a second, ungated empty `<span (click)>` beside the icon (`openng-optimus-ui-password.mjs:949`).

## Accessibility
- **Only mask and password can name themselves**: `inputId` plus `ariaLabel`/`ariaLabelledBy`; the mask also `ariaRequired`. Wrap `p-inputOtp` in `role="group"` with `aria-labelledby`, stating the length. OTP keys: <kbd>ArrowLeft</kbd>/<kbd>ArrowRight</kbd> move, <kbd>Backspace</kbd> in an empty box moves back, <kbd>ArrowUp</kbd>/<kbd>ArrowDown</kbd> are swallowed (`openng-optimus-ui-inputotp.mjs:258`–`291`); all boxes share one `name` and `tabindex` (`:351`–`352`).
- **The password reveal is not keyboard-operable**: a bare `<svg (click)>`, no `<button>`, `tabindex`, name, or `aria-pressed` (`openng-optimus-ui-password.mjs:957`, `:967`), and the browser's own reveal is hidden (`::-ms-reveal`, `@openng/optimus-ui-styles/dist/password/index.mjs:44`–`47`). Render your own `<button type="button">` over the same state.
- **The strength meter is silent**: its label is a plain `<div>`, no `role="status"`, no `aria-live` (`:988`), in a roleless overlay.
- **The mask puts slot characters in the value**: an empty field reads `___-____`, and there is no `aria-describedby` input. Link visible hint text via `[pt]="{ pcInputText: { root: { 'aria-describedby': 'id' } } }"` (`openng-optimus-ui-inputmask.mjs:1331`, same key on the password); on the host element it misses the focusable `<input>`.
- **Autofill:** `p-password` has `autocomplete` (`current-password`/`new-password`). `p-inputOtp` has none; `one-time-code` goes through `[pt]="{ pcInputText: { root: { autocomplete: 'one-time-code' } } }"` (`openng-optimus-ui-inputotp.mjs:362`).
- **A blocked keystroke is silent** — neither filter nor mask announces it.
- **Kit layer**: all four render `input.p-inputtext`, so the per-style edge, the dark token block, and the `:focus-visible` ring of `src/styles.scss` apply; edge and text pass in every style and mode (`docs/generated/CONTRAST.MD`, "form field edge"/"text"). The strength fills have no row.
- **Invalid tint**: all three components forward `invalid` to the inner input (`openng-optimus-ui-inputmask.mjs:1336`, `openng-optimus-ui-password.mjs:936`, `openng-optimus-ui-inputotp.mjs:349`); mask and password also tint from `ng-invalid.ng-dirty`. The kit's `input.p-inputtext.p-invalid` (`!important`) beats the per-style edge, so `[invalid]` alone — the OTP's only path — shows `--semantic-red-fg`. Password icon: `--text-color-secondary`, 4.79–7.78:1.

## Pitfalls
- **`autoClear` discards silently, and Enter triggers it.** An incomplete mask is wiped on blur and the model set empty (`openng-optimus-ui-inputmask.mjs:1213`–`1220`); <kbd>Enter</kbd> runs the same path without leaving the field (`:1108`–`:1112`).
- **Reassigning `mask` erases the value**: the setter calls `writeValue('')` (`:812`–`:817`), so a signal-bound mask clears the field on every switch.
- **`unmask` changes what the model holds**: `false` stores the whole buffer with literals and slot characters, `true` only the matched characters (`:1276`–`:1284`; switch in `updateModel`, `:1291`).
- **Pasting into any OTP box overwrites the whole code** from index 0 (`openng-optimus-ui-inputotp.mjs:301`–`307`), and `onPaste` always calls `preventDefault` unless disabled or readonly (`:292`–`:298`) — a paste failing `integerOnly` vanishes without feedback.
- **`p-inputOtp`'s `mask` is a boolean** that switches boxes to `type="password"` (`:151`–`:153`), not a pattern.
- **The strength meter is two regexes, not a policy.** Strong: lower + upper + digit, 8 characters; medium: two of three, 6; else weak (`openng-optimus-ui-password.mjs:546`, `:551`, `:843`–`:851`). A long passphrase reads "weak".
- **`[pKeyFilter]` blocks on `keypress` only**, which IME composition does not raise; the repair path is Android-only (`openng-optimus-ui-keyfilter.mjs:131`, guard `:156`). It tests `existingValue + newChar` (`:178`–`:179`), so a mid-string edit is judged against a string nobody typed.
- **`pValidateOnly` does not stop paste** (no guard at `:184`); the validator reports only in `pValidateOnly` mode, so in the default mode a value that arrived another way is never flagged.
- **`[(ngModel)]` on a key-filtered input fails NG8007**: `KeyFilter` declares its own `ngModelChange` output (`openng-optimus-ui-keyfilter.mjs:225`). Write `[ngModel]` + `(ngModelChange)`.
- **A misspelled filter name disables the filter**: unknown names fall back to `/./` (`pattern` setter, `:58`–`:69`).

## Sources
- Optimus UI 2.0.2 — `openng-optimus-ui-inputmask.mjs` (component `:700`–`1500`, directive `:100`–`700`), `openng-optimus-ui-inputotp.mjs`, `openng-optimus-ui-password.mjs`, `openng-optimus-ui-keyfilter.mjs`; `@openng/optimus-ui-styles/dist/password/index.mjs`; `@openng/optimus-ui-themes/dist/aura/inputotp/index.mjs` (box widths) — line numbers are the `ɵcmp` copy of each template.
- `docs/generated/CONTRAST.MD` — the field's edge and text pairs per style and mode.
- WCAG 2.2 SC 3.3.2, Labels or Instructions — a mask's format must be readable text: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
- WCAG 2.2 SC 1.3.5, Identify Input Purpose — the `autocomplete` tokens: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html
- WCAG 2.2 SC 2.1.1, Keyboard — what the pointer-only reveal fails: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- NIST SP 800-63B — length over composition rules; against blocking paste: https://pages.nist.gov/800-63-3/sp800-63b.html
- MDN, `autocomplete` — the `one-time-code` token: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- MDN, `keypress` (deprecated) — the event `[pKeyFilter]` filters on: https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event

## Semantic mapping

| Intent | Markup |
| --- | --- |
| Fixed written shape | `<p-inputmask mask="(999) 999-9999" inputId="tel" [autoClear]="false">` + `<label for>` + hint |
| Code from another device | `<div role="group" [attr.aria-labelledby]="…"><p-inputOtp [length]="6" [integerOnly]="true" /></div>` |
| Secret | `<p-password inputId="pw" autocomplete="current-password">` + your own reveal button |
| Digits, no fixed shape | `<input pInputText pKeyFilter="pint" inputmode="numeric">` |

## Rules
- MUST: give each a persistent label — `inputId` + `<label for>` for mask and password, a `role="group"` wrapper with `aria-labelledby` for the OTP.
- MUST: state the accepted format as visible, translated hint text, linked through `pt` on mask and password or `aria-describedby` on the OTP wrapper.
- MUST: ship your own `<button type="button">` if revealing a password is offered; set `autocomplete` on password and OTP fields.
- MUST NOT: rely on `[pKeyFilter]` or the mask for validity — validate in the form model.
- MUST NOT: filter characters on a name, place, or free-text field, or leave `autoClear` at its default where a person can leave a field half-finished.
- SHOULD: bind mask strings, `slotChar`, and the four strength labels from a translated map; keep `[feedback]` off unless your rule matches the two regexes.

## Default snippet
```html
<label for="pin-tel">{{ labels().telephone }}</label>
<p-inputmask
  inputId="pin-tel"
  [mask]="labels().telephoneMask"
  [autoClear]="false"
  [unmask]="true"
  formControlName="telephone"
  [pt]="{ pcInputText: { root: { 'aria-describedby': 'pin-tel-hint' } } }" />
<small id="pin-tel-hint">{{ labels().telephoneHint }}</small>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
