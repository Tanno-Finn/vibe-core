---
id: autocomplete
title: AutoComplete
category: library
tags: [form, search, suggestions]
summary: Type-ahead for an answer space too large, too remote, or too open for a dropdown — and the price of a control that shows nothing at rest.
related: [select, text-inputs, multiselect, tags-and-chips]
covers: [autocomplete]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, sizes, both dropdown modes, chips, a token field, forceSelection, a remote source
  usage: The control-choice table, the free-text default, three Do/Don't pairs, ranking suggestions
  design: Anatomy per mode, size tokens, measured heights, the state matrix per mode and visual style, the overlay, chips
  development: completeMethod contract, inputs, outputs, templates, custom properties, ARIA vs APG, keyboard
  i18n: Your strings, the one the kit localizes, and the four it does not, matching, length, RTL
  history: Document changelog
---

## When to use
- Candidates are **hundreds, remote, or unbounded**; the user can *name* the target.
- The answer may be a value nobody listed.
- `[multiple]` for a set the user assembles by typing.

## When not to use
- ~5–25 known options → `p-select`; ~15–60 → `p-select [filter]`. 2–6 → `p-radiobutton`; 2–4 exclusives → `p-selectbutton`.
- A set from a **known** list → `p-multiselect`. All rows must stay visible → `p-listbox`. None at all → `<input pInputText>`.
- A small static local list → native `<datalist>`.

## Key API
`AutoCompleteModule` from `@openng/optimus-ui/autocomplete`; a `ControlValueAccessor` extending `BaseInput`. **You do all the filtering.**
- `(completeMethod)` emits `{ originalEvent, query }`; you re-assign `[suggestions]`. Gated by `minQueryLength` (falls back to the deprecated `minLength`, default `1`, `:210`) and `delay` (`300` ms).
- `optionLabel` / `optionValue` / `optionDisabled`; `[group]` + `optionGroupLabel` + `optionGroupChildren`.
- Naming: `inputId` + `<label for>`; `ariaLabel` / `ariaLabelledBy` reach the input; `dropdownAriaLabel` (trigger) has **no default**.
- Modes: `[dropdown]` + `dropdownMode` (`'blank'` shows everything, `'current'` re-queries); `[multiple]`; `[typeahead]="false"` for a token field.
- Also `forceSelection`, `showClear`, `unique` (**true**), `autoOptionFocus` (**false**), `focusOnHover` (**true**), `emptyMessage`, the two selection messages. Outputs: `onSelect`, `onUnselect`, `onAdd`, `onClear`.
- The single-mode input reads `--p-inputtext-*`; the `--p-autocomplete-*` root tokens paint only the multiple-mode box.

## Accessibility
- **Name it with `<label for>` + `inputId`**: single mode renders `<input pInputText role="combobox">` (`openng-optimus-ui-autocomplete.mjs:1590-1634`, Optimus UI 2.0.2). Host `aria-label` / `aria-describedby` are ignored; reach the input via `[pt]="{ pcInputText: { root: { … } } }"`, **single mode only** — the multiple-mode input binds `ptm('input')` (`:1689-1726`), so a token field has no route.
- **The chip's remove icon is a roleless `<span>`**. `Backspace` in an empty text box removes the last chip; `←` enters the chips, where `←`/`→` and `Backspace` work (`:1020-1027`, `:1295-1313`); `Delete` is unhandled.
- **`forceSelection` erases silently**: without an exact, case-folded `optionLabel` match among the *visible* suggestions it empties the input and the model (`:985`, `:1373-1394`).
- Upstream gaps: group headers and the empty row are `role="option"` (`:1791`, `:1827`); the token-field combobox sits in an option; the clear icon is mouse-only; the status region lives in the overlay.
- **Both modes are kit-covered**: the 2px kit ring (`.p-inputtext:focus-visible`; `.p-autocomplete.p-focus .p-autocomplete-input-multiple`) and a gated edge — the token field's `--control-border` 3.25–5.51:1 ("form field edge"), dark fill `--surface-section`. Dropdown button, active suggestion, focused chip (both inside) ring the same.

## Pitfalls
- **The model holds raw text by default**: every keystroke is written to the form control unless `multiple` or `forceSelection` is set (`:963-965`).
- **Mutating `[suggestions]` shows nothing** — only a new array reference opens the overlay and lowers `loading` (`:839-848`); assign `[]` on the error branch too. Late responses are not reconciled.
- **`searchMessage` never renders**: its only consumer, the empty-results row (`:1827-1829`), takes the `emptySearchMessage` branch (`:737-739`). The count is never announced.
- `minQueryLength: 0` works for `forceSelection` (`??`, `:1379`) but not while typing (`||`, `:955`) — add `[minLength]="0"`. `searchLocale` is boolean-transformed (`:487`, `:1589`): `"de-DE"` arrives as `true`.
- **The red edge is not the message**: `[invalid]` alone paints `--semantic-red-fg` in both modes (kit rule `input.p-inputtext.p-invalid`; the token field via `.p-autocomplete.p-invalid`, `optimus-ui-styles/dist/autocomplete/index.mjs:183`, and `.ng-invalid.ng-dirty`, `:28-35`). Render error text.
- `#selecteditem` does nothing in single mode; token-field text is dropped without `addOnBlur`/`addOnTab`; `readonly` looks editable; `overflow: hidden` ancestors clip the overlay (`appendTo="body"`).

## Sources
- W3C APG — Combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- W3C APG — Editable Combobox with List Autocomplete: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
- WCAG 2.2 — Labels or Instructions (3.3.2): https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
- WCAG 2.2 — Focus Visible (2.4.7): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- MDN — `<datalist>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist
- Optimus UI — AutoComplete: https://optimus.openng.org/autocomplete/

## Semantic mapping
| Intent | Props |
| --- | --- |
| Give the empty field an affordance | `[dropdown]="true"` + `dropdownAriaLabel` |
| Answer must be one of ours | `[forceSelection]="true"` + a rule via `aria-describedby` |
| User invents the values (tags) | `[multiple]` `[typeahead]="false"` `[addOnBlur]="true"` |
| Remote source | `[minQueryLength]="2"` `[delay]="400"`, drop stale replies |

## Rules
- MUST: a visible caption bound with `<label for>` + `inputId`, and `dropdownAriaLabel` whenever `[dropdown]` is on.
- MUST: re-assign `[suggestions]` on every path, failure included; cap the results.
- MUST: keep the model type honest — `string` if free text is allowed, else your object, enforced by `forceSelection` or a validator plus a visible rule.
- MUST: bind every string (`placeholder`, `emptyMessage`, `dropdownAriaLabel`, selection messages) to translation keys.
- MUST NOT: name it with `placeholder` or `aria-label` on the host; call the chip's remove icon a keyboard affordance; signal invalidity by border color alone.
- SHOULD: prefer `p-select` while the list can be shown; rank by likelihood; never reorder while open.

## Default snippet
```html
<label for="city">{{ labels().city }}</label>
<p-autocomplete
  inputId="city"
  [dropdown]="true"
  [dropdownAriaLabel]="labels().showAllCities"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [emptyMessage]="labels().cityNoMatch"
  [(ngModel)]="city" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
