---
id: checkbox
title: Checkbox
category: library
tags: [form, choice, boolean]
summary: Zero-to-many independent choices — and the honest limits of checkbox groups and the indeterminate state.
related: [radiobutton, toggleswitch, select, button]
covers: [checkbox]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the three sizes, array-bound and independent-boolean groups, indeterminate, trueValue/falseValue, disabled/invalid/readonly
  usage: Checkbox, radio, or switch, Do/Don't pairs, and how to write the label
  design: Anatomy, the size scale with measured boxes, states in both themes, contrast numbers, and laying out the row rather than the box
  development: Both binding shapes, inputs and outputs, indeterminate, what carries a group's name, forms, readonly, keyboard, known gaps
  i18n: Every string is yours; label wrapping and its layout effect, why fragments do not compose, links inside labels, RTL
  history: Document changelog, one line per version
---

## When to use
- "Which of these apply?" — zero to many independent answers, applied on submit.
- One true/false statement: consent, opt-in, "remember me".
- A parent "select all" over a set — read the indeterminate pitfall first.
- Nothing ticked must be legal; if it is not, add validation, not a radio.

## When not to use
- Exactly one answer → `p-radiobutton` (a shared `name` buys exclusivity + arrow keys).
- Takes effect immediately → `p-toggleswitch`. 2–4 short exclusives inline → `p-selectbutton`.
- Many options behind a trigger → `p-multiselect`.

## Key API
`CheckboxModule` → `<p-checkbox>`, a `ControlValueAccessor` over a REAL `<input type="checkbox">`
(`openng-optimus-ui-checkbox.mjs:316-335`; every bare `:n` below cites that file).
- **Model shape**: `[binary]="true"` → one boolean (`trueValue`/`falseValue`, default `true`/`false`);
  omit it → each box carries a `value` and all bind ONE array, pushed/filtered for you (:257-267).
- `inputId` → the input's `id`, i.e. the `<label for>` target. Otherwise the `ariaLabel` /
  `ariaLabelledBy` inputs (:110, :115). No `ariaDescribedBy` — use `pt.input` (:331).
- Also `indeterminate`, `checkboxIcon`, `readonly`, `size`, `variant`, `disabled`, `invalid`,
  `required`, `name`, `tabindex`, `inputClass`/`inputStyle`, `pt`, plus `formControl` binding a
  reactive control directly (:151, :264-266). `styleClass` is `@deprecated` — prefer `class` (:136).
- `onChange` (`$event.checked` is the NEW MODEL VALUE — the whole array in a group, :276),
  `onFocus`, `onBlur`.

## Accessibility
- **`<label for>` + `inputId` names it** (measured in the a11y tree) — unlike `p-select`'s
  `<span>`, the focusable node is a labelable input.
- `[attr.aria-label]` on the HOST is ignored (name `""`, no role there). The `ariaLabel` input
  works; descriptions reach the input via `[pt]="{input:{…}}"` → `ptm('input')` (:331).
- **Groups**: Optimus ships none. `<fieldset>`+`<legend>` or `role="group"` + `aria-labelledby`
  expose a named `group` owning the boxes; a heading above them exposes none.
- Keyboard is native: `Tab` per box, `Space` toggles, `Enter` submits, arrows do nothing.
- Target 16/20/24 px (sm/default/lg, tokens `1`/`1.25`/`1.5rem`), hit area exactly the box:
  **only `large` meets SC 2.5.8 (24 px)** — keep the clickable label unless you ship `large` only.
- Contrast (SC 1.4.11, gated — CONTRAST.MD "checkbox & radiobutton"): unchecked edge
  `--control-border` (Aura's `surface.300`: 1.41:1) 3.85–5.51:1, checked fill ≥ 4.75, glyph ≥ 5.18.
- Focus, both themes: Aura's ring reads the global `{focus.ring.*}` tokens (1px primary — not the
  zeroed `form.field.focusRing` the select inherits); the kit's `styles.scss` `:has()` rule makes it
  2px solid `var(--primary-color-fg)` at 2px offset on the visible box ("focus ring", ≥ 3.88). The ring fades in via the
  `outline-color` transition (`@openng/optimus-ui-styles/dist/checkbox/index.mjs:42`); an instant
  probe reads no ring.

## Pitfalls
- **`indeterminate` is cosmetic.** It draws `svg[data-p-icon=minus]` (:347) and forces `checked`
  false (:210-212), but sets no `indeterminate` property and emits no `aria-checked` anywhere in
  the file. The a11y tree reports the mixed parent `checked: false`, not `mixed`; per spec it is
  not submitted either. Set `el.indeterminate` + `aria-checked="mixed"` yourself.
- `[indeterminate]` is a plain `@Input` mirrored into a signal by `onChanges` (:240-244) and
  cleared in `updateModel` (:273-275) — derive it from the children so the bound value flips, or
  it sticks after a click.
- `readonly` guards only `handleChange` (:278-282); the `[attr.readonly]` it stamps on the input
  (:325) is ignored by native checkboxes — a click flips `input.checked` while the box does not
  move. Use `disabled`.
- Two checkboxes for an exclusive choice (both tick); a checkbox that applies instantly (that is a
  switch); negative labels; two consents in one box; pre-ticked consents; text outside the `<label>`.
- Radii follow the active visual style (`presetOverrides` in `ui-styles.ts`); the default
  `werkbund` flattens them to 0.

## Sources
- APG — Checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- ARIA 1.2 — `aria-checked`/`mixed`: https://www.w3.org/TR/wai-aria-1.2/#aria-checked
- HTML — `indeterminate` is never submitted: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)
- MDN — labelable elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
- WCAG 2.2 — 2.5.8 Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 — 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Optimus UI — Checkbox: https://optimus.openng.org/checkbox/

## Semantic mapping
Intent → props:

| Intent | Props |
| --- | --- |
| The answer is a set | no `binary`, `value` per box, one array model |
| Independent flags | `[binary]="true"`, one boolean each |
| Payload wants `'yes'`/`'no'` | `trueValue`/`falseValue` |
| Parent of a partly-selected set | `[indeterminate]="mixed()"` **plus** the manual ARIA fix |
| A description, not a longer name | `[pt]="{ input: { 'aria-describedby': 'id' } }"` |

## Rules
- MUST: a `<label for>` on every checkbox, pointing at its `inputId`.
- MUST: wrap two or more in `<fieldset><legend>` (or `role="group"` + `aria-labelledby`).
- MUST NOT: put `aria-*` on the `<p-checkbox>` host — silently inert.
- MUST: with `indeterminate`, set the DOM property and `aria-checked="mixed"` too, and never submit
  the parent's value.
- SHOULD: label, legend, and error text via a translation `computed()`; the whole sentence in the
  label; `align-items: flex-start`.
- NEVER: a checkbox for a mutually exclusive choice or an instant setting; a pre-ticked consent;
  `readonly` where `disabled` is meant.

## Default snippet
```html
<fieldset class="cb-group">
  <legend>{{ labels().notifyLegend }}</legend>
  @for (ch of channels(); track ch.value) {
    <div class="cb-row">
      <p-checkbox [inputId]="'ch-' + ch.value" [value]="ch.value"
        [ngModel]="selected()" (ngModelChange)="selected.set($event)" />
      <label [for]="'ch-' + ch.value">{{ ch.label }}</label>
    </div>
  }
</fieldset>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
