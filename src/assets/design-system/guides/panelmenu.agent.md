---
id: panelmenu
title: PanelMenu
category: library
tags: [navigation, menu, disclosure, a11y]
summary: A stack of collapsible panels whose headers are disclosure buttons and whose bodies are ARIA trees — two focus models in one widget, and expansion state that lives in your model objects.
related: [menu, menubar, accordion, a11y-guidelines]
covers: [panelmenu]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Rendered panels, the attributes each level emits, the markup of a header and of a tree row, a live playground
  usage: Panelmenu against accordion and plain nav, Do/Don't on the tab order and on a computed model, annotated sources
  design: Aura token chain, the two focus styles and the ring the kit adds to all three stops, indentation, narrow viewport, motion
  development: Input map with the dead entries, the measured keyboard matrix per level, MenuItem fields, checklist
  i18n: Why no string comes from the library, a translated model that keeps its open panels, label length
  history: Document changelog
---

## When to use
- A **vertical, collapsible menu**: sections that each open one item tree — sidebar navigation, a command catalog, a filter tree.
- You accept that open/closed state is written into your `MenuItem` objects (Pitfalls).

## When not to use
- **Prose per section** → `p-accordion`; bodies are only `MenuItem[]`.
- **Site navigation.** The kit's convention is `<nav>` plus `<a>` (`components/frame/app-header.component.ts`).
- **Commands off a trigger** → `menu`; **a horizontal bar** → `menubar`.

## Key API
`PanelMenuModule` from `@openng/optimus-ui/panelmenu` (`openng-optimus-ui-panelmenu.mjs:1471`), `OnPush`, plus `dt`/`unstyled`/`pt`/`ptOptions`.
- **`model: MenuItem[]`** — a plain field iterated with `track item` (`:1321`); open/closed is `item.expanded` (`:1209`, `:738`).
- **`multiple`** (`false`, `:1094`) — while false, opening a header writes `expanded = false` into every other model object (`:1262-1268`).
- `id`, `styleClass` (deprecated → `class`), **`motionOptions`** (`:1441`), `collapseAll()` (`:1188`), templates `#headericon`, `#submenuicon`, `#item`.
- **Dead:** `tabindex` (`:1123`) reaches a list whose host binds a literal `-1` (`:608`); the header tab stop is a literal `0` (`:1330`). `transitionOptions` (`:1100`, deprecated) is only passed between the internal components (`:1450`, `:996`, `:406`).
- **`MenuItem`:** as in `menu`, plus `expanded`, `headerClass`, and `command` on a header (`:1259-1261`) as on a row (`:241`).
- Styling: the visual styles change only the radius (`src/app/services/ui-styles.ts`); panel colors are Aura stock, chevron and item/header icon the kit's `--text-color-secondary` (CONTRAST.MD "menu focus", 4.76:1+).

## Accessibility
- **Two patterns, nothing joins them.** A header is `<div role="button" tabindex="0">` with `aria-expanded`/`aria-controls` (`:1330-1336`) onto a `role="region"` (`:1435-1437`) — APG disclosure. The region holds `<ul role="tree" tabindex="-1" aria-activedescendant>`, `aria-hidden` while collapsed (`:607-610`), with `role="treeitem"` rows carrying `aria-level`/`-setsize`/`-posinset` (`:256-262`).
- **Two focus models.** The tree moves a virtual cursor, yet every row anchor of an open panel is `tabindex="0"` (`:282`, `:344`). `onFocus` sets the cursor once (`:791-798`), `onBlur` clears it only when focus leaves the list (`:799-806`) — Tab leaves the highlight on the first row.
- **The kit rings all three.** `.p-panelmenu-item-link` is `outline: 0 none` (`openng-optimus-ui-panelmenu.mjs:26-29`). The one 2px ring covers the header (`:focus-visible`), the `.p-focus` row (`@openng/optimus-ui-styles/dist/panelmenu/index.mjs:135`, set by arrows; Enter acts on it) and the row whose anchor Tab focused (`:has(> .p-panelmenu-item-link:focus-visible)`) — 4.73:1+, "menu focus". After a Tab inside a panel two rows can ring.
- **`aria-expanded`/`aria-controls` are unconditional on headers** (`:1333-1335`): one without `items` still announces as collapsible. Both levels take `aria-label` from the raw `label` (`:1334`, `:258`); nothing names the root — name it from outside.
- **Keyboard.** Headers (`:1273-1294`): arrows move header to header, Arrow Down on an open one enters its tree (`:1295-1305`), Home/End, Enter/Space toggle. Tree (`:826-868`): Up/Down over visible rows, Right/Left expand/collapse or move level (`:879-909`), Enter/Space click the anchor (`:918-928`), typeahead (`:943-983`), Arrow Up on the first row returns to the header (`:775-783`). **Escape and Tab are no-ops** (`:853-861`).

## Pitfalls
- **Expansion state lives in your model.** `onHeaderClick` writes `item.expanded` (`:1269`), as do `collapseAll()` (`:1188-1192`) and the `!multiple` loop; the nested list re-copies it on every change (`:738`, `:684-686`). A `computed<MenuItem[]>()` returns fresh objects and **resets every open panel**: hold `expanded` yourself and stamp it onto each rebuild.
- **`#item` plus a `routerLink` header renders twice**: the plain branch is guarded (`:1344`), the router branch (`:1387`) after the outlet (`:1386`) is not.
- **A disabled header is still a tab stop** (`:1330`), though the click is refused (`:1254-1258`) and arrows skip it (`:1238-1247`).
- **`escape: false` splits name from label**: the `[innerHTML]` branch (`:1376`, `:321`) renders markup while `aria-label` keeps the raw string.
- **Clicking a leaf also toggles it** (`:239-244`, `:807-825`).

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-panelmenu.mjs` — templates, both key handlers, the state writes.
- `@openng/optimus-ui-styles/dist/panelmenu/index.mjs` and `.../aura/panelmenu/index.mjs` (themes) — focus rules, indent, tokens.
- APG Disclosure https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ — what the headers implement.
- APG Treeview https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ — what the bodies claim.
- WCAG 2.2 SC 2.4.7 https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html and SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — what the indicator owes.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Collapsible sections of menu items | `p-panelmenu [model]` inside a named `<nav>` |
| Collapsible sections of content | `p-accordion` |
| One section list, always open | `p-menu` inline, or `<ul>` + `<a>` |

## Rules
- MUST: name the component from outside; add no focus rule (the kit rings header, cursor and Tab row).
- MUST: own `expanded` and re-stamp it whenever `model` is rebuilt.
- MUST: walk header → row → back by arrows, then by Tab.
- SHOULD: give every header `items`; leave `escape` unset; use `class`.
- NEVER: `escape: false` on a label you did not author; `tabindex`/`transitionOptions` as live inputs.

## Default snippet
```ts
readonly open = signal<Record<string, boolean>>({ docs: true });
readonly items = computed<MenuItem[]>(() => this.sections().map((s) => ({
  label: this.i18n.translate(s.labelKey),
  expanded: this.open()[s.id] ?? false,
  command: () => this.open.update((o) => ({ ...o, [s.id]: !o[s.id] })),
  items: s.children.map((c) => ({ label: this.i18n.translate(c.labelKey), routerLink: c.route })),
})));
```
```html
<nav [attr.aria-label]="labels().sectionNav">
  <p-panelmenu [model]="items()" [multiple]="true" class="section-nav" />
</nav>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
