---
id: radiobutton
title: Radio Button
category: library
tags: [form, choice, exclusive]
summary: Exactly one of a visible set — assembled from single radios, a shared name, and a fieldset, because the library ships no group.
related: [checkbox, selectbutton, select, toggleswitch]
covers: [radiobutton]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the canonical group, descriptions, sizes, outlined/filled, disabled/invalid, Other follow-up
  usage: Four questions, the control-choice table against every neighboring control, four rendered Do/Don't pairs, label wording
  design: Anatomy, the Aura token chain, contrast per mode and what moves with the accent, sizes, target size, disabled, focus, layout
  development: The three grouping mechanisms, inputs, outputs, forms, pitfalls, keyboard named vs nameless, A11y list
  i18n: What must never be translated (name, inputId, value), why vertical groups absorb length, RTL
  history: Document changelog
---

## When to use
- **Exactly one** answer from 2–5 named options, all visible, applied on submit.
- The choice is a **form field**: submitted, validated, or reset with the form.
- The answer can never legitimately be empty.

## When not to use
- Zero-to-many or an emptiable answer → `p-checkbox`: **no user gesture unchecks a radio.**
- **One boolean** → `p-checkbox`, `p-toggleswitch`, or `p-togglebutton`. A lone radio is a trap.
- 2–4 short exclusives applied on click → `p-selectbutton`; 6+ options → `p-select`; always
  visible → `p-listbox`; parallel views → `p-tabs`.
- No theming needed → plain `<input type="radio">`.

## Key API
`RadioButtonModule` from `@openng/optimus-ui/radiobutton`; a `ControlValueAccessor` over a REAL
`<input type="radio">` (openng-optimus-ui-radiobutton.mjs:269-291; bare line refs below cite it).
- **`name` is effectively required**: bound as `[attr.name]` (:274), and what makes the browser treat
  the set as one group. `formControlName` does NOT supply it. `name()` also scopes the library's
  `RadioControlRegistry` (:210-212; same form root + same `name()`, :106), which deselects siblings
  in the model.
- `value` (compared with `==`, :251; objects compare by reference, there is no `dataKey`), `inputId`
  (the `<label for>` target), `binary`, `size`, `variant` ('filled' recolors the unchecked box only),
  `disabled`, `required`, `invalid`, `tabindex` (`numberAttribute`), `autofocus`,
  `ariaLabel`/`ariaLabelledBy`, `pt` (plain `@Input`s, :132-168, except the signal inputs
  `size`/`variant`/`name`/`disabled`/`required`/`invalid`). `styleClass` is `@deprecated` (:153-158).
  **No `ariaDescribedBy`** — use `[pt]="{ input: { 'aria-describedby': … } }"`.
- `onClick` → `{ originalEvent, value }`, only from the radio that becomes checked (:225); `onFocus`,
  `onBlur`. **No `onChange` OUTPUT** (an internal handler of that name does, :214).
- `required`/`disabled` become real attributes; `[attr.value]` gets `modelValue()`, the checked
  **boolean** (:278, written from `this.checked` at :222 and :252).
- `ngModel` or `formControlName` is mandatory: `onInit` resolves `NgControl` with no fallback
  (:210-211). Selectors: `p-radioButton, p-radiobutton, p-radio-button` (:268).

## Accessibility
- One `radio` node per component, named by `<label for>` + `inputId`. **The host exposes nothing**.
- **`<fieldset>` + `<legend>` names the group** (a `group` node owning the radios); a heading above
  yields none. Where the question is already visible, give the legend `.sr-only` + `aria-labelledby`
  at that text (reference: `quiz-container.component.ts`).
- Keyboard is browser-native; the component binds no key handler. With a shared `name`: **one tab
  stop per group**, arrows move focus *and selection*, `Space` checks and never unchecks.
- `[invalid]` never reaches the accessibility tree (border only); `[required]` does. `disabled` is
  unfocusable and announced — put the reason in text.
- The unchecked ring is the kit's `--control-border` (`styles.scss` re-points
  `--p-radiobutton-border-color`; Aura's own token is 1.48:1): ≥ 3.85:1 in every style and mode.
  Checked fill ≥ 4.75:1 in every accent, no exception (`CONTRAST.MD`, "checkbox & radiobutton"). Invalid: `--semantic-red-fg`.
- Box 16/20/24px (`sm`/root/`lg`) — **only `size="large"` reaches the 24px SC 2.5.8 target**; the
  `<label>` row supplies it at the other two sizes.
- Focus: the kit ring (2px `--primary-color-fg`, offset 2px), "focus ring" ≥ 3.88:1,
  drawn on the box via `:has(.p-radiobutton-input:focus-visible)` — never hide or restyle that input.

## Pitfalls
- **No shared `name`** — passes a click test (the model unchecks the others) but costs a tab stop
  per radio and the group.
- **Outside a `<form>` the grouping scope is the document**: two groups sharing a `name` merge, and
  picking in the second unchecks the first. Namespace it.
- **`tabindex="-1"` to move the tab stop onto a wrapper row** reaches the input: the radios leave
  the tab order and the arrows die.
- **The `autofocus="true"`-on-every-radio bug is back**: `autofocus` is an uninitialized `@Input`
  (:163) piped into `[pAutoFocus]` (:286), so it arrives `undefined`, and AutoFocus strips the
  attribute only for a strict `false` (openng-optimus-ui-autofocus.mjs:23-27). No focus is stolen
  (:39 needs a truthy value), but bind `[autofocus]="false"` to clear the attribute.
- A native submit sends `value="true"`/`"false"`, not the option.

## Sources
- APG — Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- HTML — radio button state: https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)
- MDN — `<fieldset>`/`<legend>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
- WCAG 2.2 — 2.5.8 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 — 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- PrimeNG 21 — RadioButton (the code base Optimus forks): https://primeng.org/radiobutton

## Semantic mapping
Control choice: the two sections above.

| Intent | Props |
| --- | --- |
| One group, keyboard included | the same `[name]` on every radio, unique per page |
| Required, validated | `[required]="true"` + a described message; `[invalid]` is color |

## Rules
- MUST: the same `[name]` on every radio, a `<label for>` on each, and a `<fieldset><legend>` around
  the set.
- MUST: bind `ngModel` or `formControlName`, plus `name`.
- MUST NOT: `aria-*` on the host; `tabindex` on or around the radios; a single radio; one `name` for
  two groups outside a form; reading the answer from `FormData`.
- SHOULD: legend, labels, and errors from a translation `computed()`; ids, `name` and `value` from the
  option value, never the label.
- NEVER: a group whose answer may be empty, or where stepping through options has a side effect.

## Default snippet
```html
<fieldset>
  <legend>{{ t('shipping.legend') }}</legend>
  @for (o of shippingOptions(); track o.value) {
    <div class="rb-row">
      <p-radiobutton name="shipping" [inputId]="'ship-' + o.value"
        [value]="o.value" [(ngModel)]="shipping" />
      <label [for]="'ship-' + o.value">{{ o.label }}</label>
    </div>
  }
</fieldset>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
