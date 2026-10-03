---
id: listbox
title: Listbox, MegaMenu, and CascadeSelect
category: library
tags: [selection, navigation, aria, overlay]
summary: Three components named after three ARIA roles — one keeps its promise with a hardcoded contradiction inside it, one keeps it but cannot say its own name, and one keeps it by declaring itself a tree.
related: [select, multiselect, menubar, autocomplete, a11y-guidelines, scroller]
covers: [listbox, megamenu, cascadeselect]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three rendered side by side, the roles each one emits, and the three-level MegaMenu model shape
  usage: A selection table, Do/Don't on the checkbox flags, on naming the cascade select, and on markup in a bar label
  design: Aura token chains, the focus mark each one draws, gated field edges and the ungated pairs left, narrow-viewport behavior
  development: Selectors and outputs, inputs unique to one component, declared-but-dropped members, the two matchMedia guards, a shipping checklist
  i18n: Which strings come from your template and which the library reads out of its own translation config
  history: Document changelog
---

## When to use
- **`p-listbox`** — choices that stay visible and operable without opening anything, with no trigger and no overlay.
- **`p-megaMenu`** — navigation whose bar entries open a panel of link **columns** (`openng-optimus-ui-megamenu.mjs:432-435`). Flatter than that is `p-menubar`.
- **`p-cascadeSelect`** — one value from a deep hierarchy whose intermediate levels are groups you pass through, never pick (groups render no `aria-selected`, `openng-optimus-ui-cascadeselect.mjs:285`).

## When not to use
- **A listbox for navigation, or a menu for a value** — `p-listbox` emits `role="listbox"` (`openng-optimus-ui-listbox.mjs:1501`), `p-megaMenu`'s root list `menubar` (`openng-optimus-ui-megamenu.mjs:280`), and each role has its own keyboard contract.
- **`p-listbox` for a long list meant to be typed at** — the filter is opt-in (`filter = false`, `:299`), the list capped at `scrollHeight = '14rem'` (`:258`).
- **`p-cascadeSelect` at two levels** — heavier than `p-select` with `group`, for nothing.

## Key API
All three extend `BaseComponent` (`dt`, `unstyled`, `pt`, `ptOptions`); Listbox and CascadeSelect extend `BaseEditableHolder` (`openng-optimus-ui-listbox.mjs:167`, `openng-optimus-ui-cascadeselect.mjs:452`), which makes both form controls and adds `required`, `invalid`, `disabled`, `name`. None of it is declared.

- **`p-listbox`** — the only one with `virtualScroll`, `dragdrop` and a built-in filter (`openng-optimus-ui-listbox.mjs:1353`). No `size`, no `variant`; `fluid` is its only signal input. `metaKeySelection = false` (`:319`): under `multiple` a plain click toggles.
- **`p-megaMenu`** — ten inputs, **no outputs at all**; activation runs through each item's `command`. `orientation` defaults to `'horizontal'` (`:750`), `breakpoint` to `'960px'` (`:770`). `model` is `MegaMenuItem[]`, whose `items` is `MenuItem[][]`: the columns.
- **`p-cascadeSelect`** — the only one with `size`, `variant`, `appendTo`, `motionOptions` as signal inputs, and the only one taking `value` as a plain input as well as through the form API (`openng-optimus-ui-cascadeselect.mjs:1441`).

## Accessibility
- **Naming.** CascadeSelect renders `aria-label` and `aria-labelledby` (`openng-optimus-ui-cascadeselect.mjs:1454-1455`) on a readonly `input` (`:1445`) inside `.p-hidden-accessible` (`:1442`); the text you see is a plain `span` (`:1467`), so a `<label for>` needs `inputId`. Listbox renders `aria-label` only; MegaMenu renders neither (see Pitfalls).
- **Focus.** All three hold DOM focus on one element and move a virtual cursor via `aria-activedescendant`. CascadeSelect's own ring chains to `form.field.focus.ring` (width 0 in `aura/base`); the kit's `.p-cascadeselect.p-focus` rule draws the 2px `--primary-color-fg` ring instead. The active listbox and cascade select option (`.p-focus`) take the kit ring inside them (`CONTRAST.MD`, "option list focus", listbox ≥ 4.45:1). MegaMenu's mobile button and keyboard-active item (`.p-megamenu-item.p-focus`, inside) take the same kit ring, and its chevron is `--text-color-secondary` — measured through the menubar rows ("menu focus", ring ≥ 4.73:1, chevron ≥ 4.76:1).
- **Edge.** The kit re-points both field edges to `--control-border` (`.p-listbox`, `.p-cascadeselect`): `CONTRAST.MD`, "form field edge", `listbox.border.color` 3.85–6.57:1, `cascadeselect.border.color` 3.25–5.51:1.
- Verify in the accessibility tree: the CascadeSelect combobox name must be your label, not the current value.

## Pitfalls
- **A single-select listbox still announces multi-select** — `aria-multiselectable` is bound to the literal `true`, not to `multiple` (`openng-optimus-ui-listbox.mjs:1503`).
- **Listbox group headers are announced as options.** Under `group` the header `li` carries `role="option"` and an id from the same sequence as real options (`:1521`), while `aria-setsize` counts only real ones (`:634-635`).
- **Listbox emits `ariaposinset`, not `aria-posinset`** — `[attr.ariaPosInset]` (`:1543`) is camelCase and nothing reads it, while `aria-setsize` beside it (`:1542`) is correct. Only Listbox: the other two spell it right (`openng-optimus-ui-megamenu.mjs:307`, `openng-optimus-ui-cascadeselect.mjs:286`).
- **MegaMenu has no accessible name.** `ariaLabel`/`ariaLabelledBy` are declared (`openng-optimus-ui-megamenu.mjs:194-195`) and forwarded into `MegaMenuSub`, whose host `properties` map (`:280`) carries no `aria-label` and no `aria-labelledby`.
- **MegaMenu item labels go through `innerHTML` unless you opt in**: `escape` truthy renders an interpolated span, anything else `[innerHTML]` (`:338-347`), and `escape` has no default (`openng-optimus-ui-api.d.ts:476`), so an unset label takes the `innerHTML` branch.
- **Undeclared item keys still reach the template.** `MenuItem` and `MegaMenuItem` carry `[key: string]: any` (`openng-optimus-ui-api.d.ts:604`, `:752`) and `getItemProp` reads a name off the raw object, so `escape` works on a bar item too — and a truthy `to` drops `aria-haspopup="menu"` (`openng-optimus-ui-megamenu.mjs:303`) while the `aria-expanded` beside it stays (`:304`).
- **CascadeSelect's `options` is typed `string[] | string | undefined`** (`@openng/optimus-ui/types/openng-optimus-ui-cascadeselect.d.ts:274`), so the object hierarchy it exists for needs a cast under `strictTemplates`. Only CascadeSelect: Listbox's `options` is `any[]`, and MegaMenu has no `options` input (`openng-optimus-ui-megamenu.mjs:1423`).
- **CascadeSelect's `aria-controls` points at nothing.** Open, the combobox references `id + '_tree'` (`openng-optimus-ui-cascadeselect.mjs:1458`); nothing in the bundle carries that id — the overlay list never binds one (`:1553-1559`).

## Sources
- `openng-optimus-ui-listbox.mjs` — where the literal `aria-multiselectable` and the camelCase pos-in-set binding are visible.
- `openng-optimus-ui-megamenu.mjs` — the sub component host block: menubar/menu split, absent name bindings.
- `openng-optimus-ui-cascadeselect.mjs` — the combobox-over-tree wiring and the unresolved `aria-controls` target.
- `@openng/optimus-ui/types/openng-optimus-ui-api.d.ts` — `MegaMenuItem.items` is `MenuItem[][]`, and the index signature that makes undeclared keys settable.
- `@openng/optimus-ui/types/openng-optimus-ui-cascadeselect.d.ts` — the `options` type a hierarchy cannot satisfy.
- `@openng/optimus-ui-themes/dist/aura/listbox/index.mjs` — the preset with no `focusRing` key, unlike the megamenu and cascadeselect ones.
- `@openng/optimus-ui-styles/dist/listbox/index.mjs` — an option's focus is background and color only (the kit adds the ring); it and its two counterparts carry no CSS media query, so the breakpoints here are JavaScript.
- W3C APG Listbox, Menu-and-Menubar, and Combobox — the contract each of the three roles puts on the author.
- WCAG SC 2.4.7 and SC 1.4.11 — why a focus mark of background and color alone falls short, and what the kit ring meets.

## Semantic mapping
| Component | Roles it renders | Gap against the name |
|---|---|---|
| `p-listbox` | `listbox` on the `ul`, `option` on items (`openng-optimus-ui-listbox.mjs:1536`) | kept — but always `aria-multiselectable`, and group headers are `option` too |
| `p-megaMenu` | `root ? "menubar" : "menu"` per list (`openng-optimus-ui-megamenu.mjs:280`), `menuitem` per `li` (`:296`) | kept in structure; the bar cannot be given a name |
| `p-cascadeSelect` | `combobox` → `tree` with `aria-orientation="horizontal"` → `treeitem` + `group` (`openng-optimus-ui-cascadeselect.mjs:1553`, `:279`) | a combobox over a **tree**, not a listbox; it announces `aria-haspopup="tree"` (`:1456`), the chevron's `listbox` sitting on an `aria-hidden` element (`:1486`) |

## Rules
- Name `p-listbox` with `ariaLabel`; there is no `ariaLabelledBy`. Wrap `p-megaMenu` in `<nav aria-label="…">` and do not rely on its `ariaLabel`.
- Set `escape: true` on every item, bar, or column, whose label is not a literal you wrote. Use `checkbox` only with `multiple` — alone it renders nothing (`openng-optimus-ui-listbox.mjs:1560`).
- Assume no shared mechanism: `p-listbox` has no breakpoint; the other two build a JavaScript `matchMedia` from their `breakpoint` input, whose default is `960px` (`openng-optimus-ui-megamenu.mjs:770`, `openng-optimus-ui-cascadeselect.mjs:629`), both behind a browser guard (`openng-optimus-ui-megamenu.mjs:926`, `openng-optimus-ui-cascadeselect.mjs:1402-1404`), so neither switches before the browser runs.
- Treat the defects above as present until the pin moves.

## Default snippet
```html
<p-listbox [options]="cities" optionLabel="name" [(ngModel)]="city" ariaLabel="Delivery city" />

<nav aria-label="Main"><p-megaMenu [model]="columns" /></nav>

<!-- regions is cast: the options input is typed string[] | string -->
<p-cascadeSelect [options]="regions" optionLabel="city" optionGroupLabel="name"
  [optionGroupChildren]="['states','cities']" placeholder="Select a city" ariaLabel="Delivery city" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
