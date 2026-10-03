---
id: inputnumber
title: InputNumber
category: library
tags: [form, number, spinner, locale]
summary: A number the reader types or nudges — a real text input with role spinbutton, locale-aware formatting through Intl.NumberFormat, and optional spin buttons that are pointer-only decoration; the locale defaults to the browser, not the page.
related: [slider, text-inputs, select]
covers: [inputnumber]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Decimal and currency formatting live, the same value in two locales, spin buttons in their three layouts, and the invalid state
  usage: The wiring with min/max/step, what is and is not a number, the boundary table, and two Do/Don't pairs
  design: Where the field's visuals come from, the button token block, what the kit and visual styles change, and the narrow-screen answer
  development: The inherited input contract, the keyboard map with its zero-bound gap, event flow without onChange, and a checklist
  i18n: The locale input and why the kit passes currentIntlLocale, per-locale digits and separators, prefix and suffix keys
  history: Document changelog, one line per version
---

## When to use
- A quantity, threshold, or amount the reader **types or nudges** — where the exact value matters.
- Locale-formatted display: grouping separators, fraction digits, currency (`mode="currency"`).
- Beside a `p-slider` on one model: the slider for the coarse gesture, this field for precision (slider guide).

## When not to use
- Coarse, continuous adjustment where feel beats digits → `p-slider`.
- One of a few discrete values → `p-select` / `p-selectbutton`.
- Digit-shaped text that is not arithmetic — IDs, phone numbers, postal codes → `text-inputs` with an `inputmode`.
- Submit flow, error timing → `forms`.

## Key API
`InputNumberModule` from `@openng/optimus-ui/inputnumber`; selector `p-inputnumber` (alias `p-input-number`, `:1427`). Extends `BaseInput` (`openng-optimus-ui-inputnumber.mjs:127` — further `:refs` into that file): `required`, `invalid`, `disabled`, `name`, `min`/`max`/`step`, `fluid`, `variant`, `size` (`forms` guide). Its own inputs are plain v21 properties; only the inherited `min`/`max`/`invalid` are signals.

- **Formatting**: `mode` `'decimal'` (default, `:246`) or `'currency'` (then `currency` is required); `useGrouping` (true, `:261`), `minFractionDigits`/`maxFractionDigits`, `prefix`/`suffix`. **`locale` defaults to undefined** (`:236`) — `Intl.NumberFormat` then uses the runtime's locale, not the page's: pass the kit's `currentIntlLocale`.
- **Spinner**: `showButtons` (false, `:140`), `buttonLayout` `'stacked'` (default, `:150`) | `'horizontal'` | `'vertical'`; icons via `#incrementbuttonicon`/`#decrementbuttonicon`.
- **Editing**: `allowEmpty` (true, `:231`) — false snaps an emptied field back on blur; `showClear`; keys outside the locale's numerals, decimal, and minus are swallowed.
- **ARIA inputs**: `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy` — error wiring needs no `pt` detour.
- **Outputs**: `onInput` per keystroke with `{ value, formattedValue }` (`:1073`) — **no `onChange`**; `onFocus`, `onBlur`, `onKeyDown`, `onClear`.

## Accessibility
- A real `<input pInputText>` with `role="spinbutton"`, `aria-valuemin`/`max`/`now` (`:1266`, `:1272-1274`), and `inputmode="decimal"` (`:1294`) — `label[for]` + `inputId` works.
- **The spin buttons are decoration**: `tabindex="-1"`, `aria-hidden="true"`. The keyboard path: ArrowUp/ArrowDown spin ±`step` (`:673-679`), Home/End jump to `min`/`max`.
- **Home/End skip a zero bound**: the handler tests truthiness, so with `min="0"` Home does nothing (`:793-803`).
- Typing letters is silent. Range, step, and unit belong in a visible hint wired via `ariaDescribedBy`.
- **No `aria-invalid` is bound.** The red edge (`--semantic-red-fg`) shows for `[invalid]` alone — the kit's `input.p-inputtext.p-invalid` beats the style rule — and for `p-inputnumber.ng-invalid.ng-dirty > .p-inputtext` (`:23-27`); it is color only, so described error text carries the state. The field gets the kit's 2px focus ring.

## Pitfalls
- **The locale is the browser's, not the app's**: an unset `locale` formats by the OS. Bind `[locale]` to `currentIntlLocale`.
- **`input[type=number]` is not the fallback**: it forbids grouping/currency and changes value on scroll.
- **`mode="currency"` without `currency` throws** a `TypeError` from `Intl.NumberFormat`.
- **Waiting for `onChange`** — it does not exist; validate in your `computed()`.
- **An ID in a number field**: grouping inserts separators, leading zeros vanish, precision ends past 2^53.
- **`allowEmpty="false"` fights the correcting reader**: clearing to retype snaps a value back.
- **Buttons and field can carry different edges**: the field takes the style rule's outline, the spin buttons the kit's `--control-border` (3.25–5.51:1) with a `--text-color-secondary` icon — both gated (`CONTRAST.MD`, "form field edge").

## Sources
- WAI-ARIA APG, Spinbutton pattern: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/ — the keyboard contract the hidden buttons defer to.
- WAI-ARIA 1.2, `aria-valuenow`: https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow — what a spinbutton must expose.
- ECMA-402, `Intl.NumberFormat`: https://tc39.es/ecma402/#numberformat-objects — locale resolution and the currency requirement.
- HTML Living Standard, `inputmode`: https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode — digit keyboards without `type="number"`.
- PrimeNG InputNumber: https://primeng.org/inputnumber — upstream docs of the forked v21 line; claims here are checked against Optimus UI 2.0.2.

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| A plain quantity | defaults — `mode="decimal"`, grouping on |
| A money amount | `mode="currency"` + `currency` + the kit locale |
| A unit beside the number | `suffix` (translated key) |
| Nudging by pointer | `showButtons` — decoration; keyboard already spins |
| A bounded range | `min`/`max`/`step` — mirrored into ARIA |
| Empty as a legal state | `allowEmpty` (default) + your validator |
| An ID, phone, postal code | not this — `text-inputs` with `inputmode` |

## Rules
- MUST: bind `[locale]` to the kit's `currentIntlLocale` — never the browser's, never hard-coded.
- MUST: label via `label[for]`/`inputId`; wire hints and errors through `ariaDescribedBy`.
- MUST: keep to arithmetic values — IDs and codes go to `text-inputs`.
- MUST: state range and step in a visible hint when they constrain input.
- SHOULD: set `maxFractionDigits` where precision matters; the `Intl` default is 3.
- SHOULD: leave `showButtons` off in dense forms.
- NEVER: treat the spin buttons as the accessible path, or rely on Home/End reaching a bound of 0.

## Default snippet
```html
<label for="fx-amount">{{ t('form.amountLabel') }}</label>
<p-inputnumber
  inputId="fx-amount"
  mode="currency"
  currency="EUR"
  [locale]="i18n.currentIntlLocale"
  [min]="0"
  [max]="10000"
  [step]="10"
  [invalid]="shows('amount')"
  [ariaDescribedBy]="shows('amount') ? 'fx-amount-error' : 'fx-amount-hint'"
  [ngModel]="amount()"
  (ngModelChange)="amount.set($event)"
  name="amount"
/>
<small id="fx-amount-hint">{{ t('form.amountHint') }}</small>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
