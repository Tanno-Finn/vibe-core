---
id: multiselect
title: MultiSelect
category: library
tags: [form, selection, multiple, filter]
summary: Pick a set from a known list in one compact field — a checkbox listbox behind a combobox trigger, a summary label that collapses past three selections, and a filter that ships switched on; in the list a selected row carries both a checked checkbox and a highlight tint.
related: [select, autocomplete, checkbox, tags-and-chips]
covers: [multiselect]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Comma and chip display live, the three-label overflow, filtering and toggle-all, and the invalid state wired
  usage: Options wiring and dataKey, the display decision, the boundary table against its four neighbors, and Do/Don't pairs
  design: The formField-aliased tokens per visual style, what the kit restyles and leaves, the selected row, and the narrow-screen answer
  development: The editable-base contract, the template reference names, keyboard map, appendTo, and an acceptance checklist
  i18n: Which strings the kit bridge already pushes, the untranslated overflow label, and expansion in chips and summaries
  history: Document changelog, one line per version
---

## When to use
- The answer is a **set** from a known, finite list — roughly 8 to 60 options.
- The selection must summarize into one field-sized control.
- Readers find options by typing: the built-in filter ships enabled.

## When not to use
- One value → `p-select`. 60+, remote, or free text → `p-autocomplete` (`multiple` covers remote sets).
- Few, always-visible options → a `p-checkbox` group.
- The set is edited as visible tokens outside an overlay → `tags-and-chips`.
- Submit flow, error timing → `forms`.

## Key API
`MultiSelectModule` from `@openng/optimus-ui/multiselect`; selector `p-multiselect`. Extends the editable base (`required`, `invalid`, `disabled`, `name`, ControlValueAccessor); the model is an **array**.

- **Options**: `options`, `optionLabel`, `optionValue`, `optionDisabled`; `group` + `optionGroupLabel`/`optionGroupChildren`. Without `optionValue` the model holds whole objects compared by reference — set `dataKey` (`:413`).
- **Display**: `display` `'comma'` (default, `:595`) or `'chip'`. Past `maxSelectedLabels` (default 3, `:977`) the field collapses to a summary; `selectedItemsLabel` overrides it, `{0}` is the count.
- **Panel**: `filter` is **on by default** (`:388`), `filterBy`/`filterFields` widen the match, `resetFilterOnHide` defaults false (`:470`). `showToggleAll` (true) renders the header checkbox; `selectionLimit` caps the set; `showClear`; `scrollHeight`, `virtualScroll`, `lazy`; `appendTo`; `highlightOnSelect` (true, `:677`) tints selected rows.
- **Templates**: `#item`, `#selecteditems`, `#group`, `#header`, `#filter`, `#footer`, `#empty`, `#emptyfilter`, plus icon slots. `pTemplate="item"` still binds (v21 query, `:1846`); prefer the names.
- **Outputs**: `onChange`, `onFilter`, `onRemove` (chip), `onSelectAllChange`, `onClear`, `onPanelShow`/`onPanelHide`. `overlayVisible` is one-way (no `overlayVisibleChange`).

## Accessibility
- The focusable element is a hidden input with `role="combobox"`, `aria-haspopup="listbox"` (`:1857`) — no `label[for]` reaches it: visible caption plus `ariaLabelledBy`, as with `p-select`.
- The list is `role="listbox"` with `aria-multiselectable="true"`; options are `role="option"` with `aria-selected`, `aria-checked`, and set-size/position (`:2069`, `:245`).
- `aria.listLabel` (the list) and `aria.selectAll`/`aria.unselectAll` (header checkbox, `:999`) come from the config bridge — all three are keys the kit pushes (`i18n-localization`).
- Keyboard: arrows, Home/End, PageUp/Down; Space/Enter toggles; Shift+arrows extend; Ctrl/Cmd+A selects all visible (`:1329`); typing searches. Name the `role="searchbox"` filter via `ariaFilterLabel`.
- **Focus is kit-provided.** Aura zeroes the root ring; the kit's `.p-multiselect:not(.p-disabled).p-focus` draws the 2px `--primary-color-fg` ring and border; the active option rings inside (`CONTRAST.MD`, "focus ring", "option list focus").

## Pitfalls
- **The overflow label is untranslated in this kit.** Past `maxSelectedLabels` the text is the top-level `selectionMessage` ('{0} items selected', `openng-optimus-ui-config.mjs:170`), which the kit bridge (`aria.*` only) does not push. Pass a translated `selectedItemsLabel`.
- **A selected row is tinted, not just checked** (`{highlight.background}`, `{primary.50}` light) — check it against your accent.
- **Whole-object values without `dataKey`**: a model from a second fetch matches nothing.
- **`filter` on by default** — a five-option list gets a needless search box.
- **Ctrl/Cmd+A never toggles**; the header checkbox does.
- **The field is on kit tokens.** Edge (`--control-border`, 3.25–5.51:1), icons (`--text-color-secondary`, 4.79–7.78:1), invalid edge (`--semantic-red-fg`), dark fill `--surface-section` ("form field edge"/"icon"/"text").
- **`overflow: hidden` ancestors** clip the overlay — `appendTo="body"`.

## Sources
- WAI-ARIA APG, Listbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ — the multi-select keyboard contract.
- WAI-ARIA 1.2, `aria-multiselectable`: https://www.w3.org/TR/wai-aria-1.2/#aria-multiselectable — what the list announces first.
- WAI-ARIA APG, Combobox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ — the trigger half.
- WCAG 2.2 SC 4.1.2, Name Role Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html — why the caption must reach the combobox.
- PrimeNG MultiSelect: https://primeng.org/multiselect — upstream docs of the forked code base; claims here are checked against Optimus UI 2.0.2.

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| A set from a known list | `p-multiselect` with `optionValue` (or `dataKey`) |
| Compact summary between uses | `display="comma"` + `maxSelectedLabels` |
| Each pick visible as a token | `display="chip"` — list stays the removal path |
| "All of them" | `showToggleAll` header checkbox |
| Inside a clipping container | `appendTo="body"` |

## Rules
- MUST: give the control a visible caption wired via `ariaLabelledBy`.
- MUST: set `optionValue` or `dataKey` whenever the model outlives the options array.
- MUST: gate `invalid` through the form (`forms`) and append the visible error's id to `ariaLabelledBy` — the combobox has no `aria-invalid` or `ariaDescribedBy` route.
- MUST: translate the overflow — `selectedItemsLabel` or a bridged `selectionMessage`.
- MUST: verify a visible keyboard focus on the closed field.
- SHOULD: switch `filter` off under ~8 options; set `resetFilterOnHide` when it stays on.
- SHOULD: prefer `display="comma"` in dense forms.
- NEVER: concatenate option labels into a summary — word order belongs to the translator.
- NEVER: rely on the chip remove icon as the only removal path — unchecking the option is the accessible one.

## Default snippet
```html
<span class="field-label" id="fx-tags-label">{{ t('form.topicsLabel') }}</span>
<p-multiselect
  inputId="fx-topics"
  [ariaLabelledBy]="shows('topics') ? 'fx-tags-label fx-topics-err' : 'fx-tags-label'"
  [options]="topicOptions()"
  optionLabel="label"
  optionValue="value"
  [filter]="false"
  [selectedItemsLabel]="t('form.topicsSelected')"
  appendTo="body"
  [invalid]="shows('topics')"
  [ngModel]="topics()"
  (ngModelChange)="topics.set($event)"
  name="topics"
/>
@if (shows('topics')) { <small id="fx-topics-err">{{ t('form.topicsError') }}</small> }
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
