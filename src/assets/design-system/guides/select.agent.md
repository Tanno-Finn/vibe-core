---
id: select
title: Select
category: library
tags: [form, choice, overlay]
summary: Pick one value from a known list — and the honest table for when a dropdown is the wrong control.
related: [button, selectbutton, multiselect, autocomplete, scroller]
covers: [select]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the three sizes, grouped options, filtering, placeholder plus clear, custom option rendering, disabled/loading/invalid
  usage: The control-choice table, Do/Don't pairs, why a placeholder is not a label, and ordering options for the reader
  design: Anatomy, the size scale with measured heights, the two state layers, the overlay, and why the label truncates rather than wraps
  development: Inputs, outputs, templates, CSS custom properties, forms, the three naming patterns and the one that works, keyboard, upstream gaps
  i18n: Your five translatable strings, the two that come from the library, trigger truncation, filtering across languages, RTL
  history: Document changelog, one line per version
---

## When to use
- One value out of roughly 5–25 known options, and screen space is tight.
- The options need no explanation — the label alone is enough to choose.
- With `[filter]="true"`: 15–60 options the user can name (they type, they do not browse).
- Grouped catalogs whose groups mean something (mind the group-header gap below).

## When not to use
- 2–4 short exclusives → `p-selectbutton`. 2–6 to compare first → `p-radiobutton`.
- The answer is a set → `p-multiselect`. 60+, remote, or free text → `p-autocomplete`.
- Native submit or the OS wheel picker → native `<select>`; `p-select` renders no native form control.

## Key API
`SelectModule` from `@openng/optimus-ui/select`; a `ControlValueAccessor` (ngModel + reactive forms).
- `options` + `optionLabel` / `optionValue` / `optionDisabled`; omit `optionValue` to bind objects.
- Naming: `ariaLabel` / `ariaLabelledBy`. `inputId` sets the combobox id but does NOT make `<label for>` work.
- Filtering: `[filter]` + `filterBy`, `filterMatchMode` (`'contains'`), `filterLocale`, `filterPlaceholder`, `ariaFilterLabel`, `emptyFilterMessage`.
- Grouping: `[group]` + `optionGroupLabel` + `optionGroupChildren` (`'items'`).
- Also: `placeholder`, `[showClear]`, `[checkmark]`, `[loading]`, `[disabled]`, `[invalid]`, `size`, `fluid`, `appendTo`, `[virtualScroll]` + `virtualScrollItemSize`.
- Outputs: `onChange` (`$event.value`), `onFilter`, `onClear`, `onShow`/`onHide`, `onFocus`/`onBlur`, `onLazyLoad`.

## Accessibility
- **Name it with `[ariaLabelledBy]` (or `ariaLabel`) — nothing else works.** The focusable element is a `<span role="combobox">` (`openng-optimus-ui-select.mjs:1700`, Optimus UI 2.0.2): `<label for>` never binds to it, and `[attr.aria-label]` on the host lands on a roleless element. Both failures announce the *current value* as the name — the template falls back to `label()` (`:1701`). Verify in the accessibility tree.
- Keyboard: `↓`/`↑`/`Enter`/`Space` open; `Home`/`End`/`PageUp`/`PageDown` move; `Esc` closes and refocuses; printable characters type-ahead; `Delete` clears only with `showClear`; `Backspace` is a no-op.
- With `[filter]`, DOM focus moves into the filter input on open — translate `ariaFilterLabel`.
- Upstream gaps: group headers (`:1874`) and the empty row (`:1899`) carry `role="option"`; the trigger's `aria-label="dropdown trigger"` is a hard-coded English literal (`:1758`) that no input or translation reaches.
- State colors: never paint `.p-select-label`. Resting, disabled, and placeholder colors share that element (`optimus-ui-styles/dist/select/index.mjs:79/86/94`); one `color: … !important` erases all three. Re-point the token: `.p-select { --p-select-color: var(--text-color) }`, plus `--p-select-placeholder-color: var(--control-placeholder)` in `.dark-theme` (`CONTRAST.MD`, "field placeholder"). `src/app/styles-select-state.spec.ts` guards both.
- Focus: `.p-select.p-focus` in `styles.scss`, 2px `--primary-color-fg` outline at 2px offset, `!important` (Aura zeroes `form.field.focusRing`); the active option rings inside (`.p-select-option.p-focus`, ≥ 3.48:1). `--p-select-focus-ring-*` fails (rewritten on `:root` at runtime).
- Gated kit tokens: edge `--control-border` 3.25–5.51:1, icons `--text-color-secondary`, invalid `--semantic-red-fg`.
- The listbox name `aria.listLabel` (default `'Option List'`, `openng-optimus-ui-config.mjs:227`) translates only through `Optimus.setTranslation`; a `translation` block given once to `provideOptimus` freezes one language. Re-set it on every language change, spreading the current `aria` block (the merge is one level deep).

## Pitfalls
- `placeholder` as the label — it vanishes on selection, so it can never be the control's name.
- A dropdown for a binary; 40+ options, no `[filter]`.
- Fixed-width triggers truncate translated labels (ellipsis, no wrap).
- `options` as a plain field instead of `computed()` — labels freeze on language switch.
- `#item` without `#selectedItem` — list and trigger render differently. (`pTemplate` binds too, `:941-996`; reference names are the convention.)
- Overlay clipped by `overflow: hidden` ancestors → `appendTo="body"`.
- Assuming form submission carries the value — no hidden input.

## Sources
- W3C APG — Select-Only Combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
- W3C WAI-ARIA 1.2 — `listbox` (group vs option): https://www.w3.org/TR/wai-aria-1.2/#listbox
- WCAG 2.2 — Focus Visible (2.4.7): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- MDN — `<label>` and labelable elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
- PrimeNG — Select: https://primeng.org/select (upstream v21 API)

## Semantic mapping
Intent → props (control choice: see When to use):

| Intent | Props |
| --- | --- |
| Optional value the user can revoke | `placeholder` + `[showClear]="true"` |
| Nameable options beyond ~25 | `[filter]="true"` + `filterBy` |
| Meaningful categories | `[group]="true"` + `optionGroupLabel` |
| Selection must be unmissable | `[checkmark]="true"` (the selected tint is faint) |
| Async options in flight | `[loading]="true"` |
| Hundreds of options | `[virtualScroll]="true"` + `virtualScrollItemSize` |

## Rules
- MUST: name every select with `[ariaLabelledBy]` pointing at a visible caption, or `ariaLabel`.
- MUST NOT: name it via `<label for>` + `inputId` or `[attr.aria-label]` on the host — silently ignored.
- MUST: bind all text (`placeholder`, `filterPlaceholder`, `ariaFilterLabel`, `emptyMessage`, `emptyFilterMessage`, option labels) to translation keys, and build `options` in a `computed()`.
- SHOULD: `[filter]` beyond ~25 options; `[showClear]` when optional; `localeCompare` in the active language (keep natural orders unsorted); explicit width under translated labels.
- NEVER: a `p-select` for a two-option choice; `placeholder` doing the label's job; reordering options while open.

## Default snippet
```html
<!-- labels() is a computed() map resolved through the kit's TranslationService -->
<span class="field-label" id="chart-type-label">{{ labels().chartType }}</span>
<p-select
  [ariaLabelledBy]="'chart-type-label'"
  [options]="chartOptions()"
  optionLabel="label"
  optionValue="value"
  [placeholder]="labels().chartTypePlaceholder"
  [(ngModel)]="chartType" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
