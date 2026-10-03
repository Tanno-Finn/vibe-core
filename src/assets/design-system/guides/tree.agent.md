---
id: tree
title: Tree, TreeTable, and TreeSelect
category: library
tags: ['data', 'hierarchy', 'a11y']
summary: Hierarchy in three shapes — a tree, a tree in a grid, and a tree in a form field, each with its own keyboard owner and its own naming gap.
related: ['table', 'select', 'multiselect', 'checkbox', 'a11y-guidelines', 'scroller']
covers: ['tree', 'treetable', 'treeselect', 'organizationchart']
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three shapes side by side, the same data as a treegrid, and the markup each one emits
  usage: Do/don't pairs for naming, the toggler column, and the org chart beside a tree; which shape fits which job
  design: Aura token chain, the two indent sources, focus ring, per-style contrast, and narrow screens incl. the org chart
  development: Full keyboard maps per component, the dead and hardcoded labels, what the org chart renders, checklist
  i18n: Which strings you pass, which come from the Optimus config, which are unreachable
  history: Document changelog
---

# Tree, TreeTable, and TreeSelect

Three components over one `TreeNode[]`, with different roles, different keyboard owners, and
different naming gaps — plus `p-organizationChart`, which draws the same data as a diagram and
carries no semantics at all. Never carry a claim from one to another.

## When to use

- **`p-tree`** — a hierarchy of one-label rows: `<ul role="tree">` of `<li role="treeitem">`,
  `aria-level`, `aria-posinset`, `aria-setsize` and `aria-expanded` unconditional
  (`openng-optimus-ui-tree.mjs:611-615`), `aria-selected` only under `single`/`multiple`.
- **`p-treeTable`** — the same hierarchy when rows need **columns**: a
  `<table role="treegrid">` (`openng-optimus-ui-treetable.mjs:2731`) whose `<tr>`/`<td>` you
  write. Tree semantics arrive only through `ttRow`.
- **`p-treeSelect`** — a hierarchy as a **form value**: `p-tree` in an overlay behind a
  `role="combobox"` input (`openng-optimus-ui-treeselect.mjs:934`), with `ControlValueAccessor`.

## When not to use

- **A flat list** — a one-level `p-tree` still emits `role="tree"`; use `p-select` or
  `p-listbox`.
- **A grid whose rows never nest** — `ttRow` wiring for nothing.
- **Page structure** — `role="tree"` is a widget, not a landmark; navigation is `<nav>`.
- **`p-organizationChart` as the only rendering of a hierarchy, or for choosing a node** — it
  emits nested layout tables with no roles and selects by mouse alone (see Accessibility).
  Use it only as an illustration beside a named `p-tree` or list holding the same data.

## Key API

| | `p-tree` | `p-treeTable` | `p-treeSelect` |
|---|---|---|---|
| root role | `tree` on `<ul>` | `treegrid` on `<table>` | `combobox` on a hidden `<input>` |
| node role | `treeitem` on `<li>`, emitted | `row`, only if you add `ttRow` | from the nested `p-tree` |
| keyboard owner | `UITreeNode.onKeyDown` (`:439`) | `TTRow.onKeyDown` (`:4939`) plus `TTSelectableRow.onKeyDown` (`:4252`) | `TreeSelect.onKeyDown` (`:661`), on the input only |

Shared: `virtualScroll`, `loading`, `onNodeExpand`, `onNodeCollapse`. Not shared: data is
`value` on `p-tree`/`p-treeTable` but `options` on `p-treeSelect`, and `filter`/`filterBy`
are missing from `p-treeTable`. `dt`, `unstyled`, `pt` and `ptOptions` are in no compiled
input list, being inherited from `openng-optimus-ui-basecomponent.mjs`. Expansion lives **on
the node object** (`node.expanded`) — mutate it and the tree expands.

`OrganizationChartModule` from `@openng/optimus-ui/organizationchart`, selector
`p-organizationChart`: `value` (a `TreeNode[]`, first entry is the root), `collapsible`,
`selectionMode` (`'single'` | `'multiple'`) + `[(selection)]`, outputs `onNodeSelect`,
`onNodeUnselect`, `onNodeExpand`, `onNodeCollapse`; node templates by `pTemplate` =
`node.type` (else `default`), plus `togglericon`. No `ariaLabel`/`ariaLabelledBy` input;
`preserveSpace` is deprecated (`openng-optimus-ui-organizationchart.mjs:352`).

## Accessibility

- **Name the tree.** `p-tree` and `p-treeSelect` take `ariaLabel`/`ariaLabelledBy`;
  `p-treeTable` takes neither, and its `caption` template is no `<caption>` — it renders a
  header `<div>` *before* the `<table role="treegrid">`
  (`openng-optimus-ui-treetable.mjs:2678`, `:2731`), naming nothing. The name belongs on the
  table element, via the `pt` entry for `table` that `Bind` writes on as an attribute
  (`openng-optimus-ui-bind.mjs:31-49`).
- **`p-treeSelect`'s name falls back to the value.** Without `ariaLabel` — the expression
  never consults `ariaLabelledBy` — `aria-label` becomes the joined selected labels, else the
  placeholder, else nothing (`openng-optimus-ui-treeselect.mjs:946`, `get label()` `:913`).
  `ariaLabelledBy` rescues it by accname precedence, not by the component.
- **Roving `tabindex` starts wrong in both list components.** Every `ttRow` carries a literal
  `tabindex="0"` (`openng-optimus-ui-treetable.mjs:5081`); `p-tree` renders
  `index === 0 ? 0 : -1` (`openng-optimus-ui-tree.mjs:616`) over a sibling `$index` (`:712`),
  so every expanded group's first child is a tab stop — under `virtualScroll` `index` is the
  flat row index (`:1976`) and only one node is. Both repair on the first `Tab` (`:537`,
  treetable `:5013`).
- **None of the three implements typeahead** — no character buffer in the three `keydown`
  switches (`openng-optimus-ui-tree.mjs:439`, `openng-optimus-ui-treeselect.mjs:661`,
  `openng-optimus-ui-treetable.mjs:4939`). `Home`/`End` exist in the last alone and query
  `tr[aria-level="<current level>"]`, not the grid (`:5002`, `:5007`).
- **`p-treeSelect` uses focus, not `aria-activedescendant`**: `ArrowDown` focuses the first
  node once the panel is in the DOM, and returns early while it is not
  (`openng-optimus-ui-treeselect.mjs:707`).
- **`p-organizationChart` has no accessibility semantics.** The file holds no `role=` and no
  `aria-` attribute: nested layout `<table>`s (`openng-optimus-ui-organizationchart.mjs:498`,
  `:164-225`) with blank connector cells (`:213-214`); the node is a `<div (click)>` with no
  tabindex or key handler (`:169`), so `selectionMode` is mouse-only and shown by a class alone
  (`:21`, `:440-474`). Under `collapsible` the toggle is `<a tabindex="0">` with no `href`, role,
  name, or `aria-expanded`, toggled by Enter/Space (`:180`). With neither `collapsible` nor
  `selectionMode` nothing is focusable, so a wrapper with `aria-hidden="true"` is safe when a
  named `p-tree` carries the same data.

## Pitfalls

- **`p-tree`'s `togglerAriaLabel` is dead** — declared (`openng-optimus-ui-tree.mjs:1014`),
  bound in no template; the toggle button is `tabindex="-1"` with no name. `p-treeTable` takes
  the Optimus config (`openng-optimus-ui-treetable.mjs:5118`); `p-treeSelect` forwards
  nothing to the `<p-tree>` in its overlay (`openng-optimus-ui-treeselect.mjs:1021`).
- **`ArrowUp` in `p-tree` leaves two tab stops behind**: pressed on the node it hands
  `focusRowChange` (`openng-optimus-ui-tree.mjs:591`) the `<p-treeNode>` host (`:476`), where
  `ArrowDown` (`:489`) and `ArrowLeft` (`:518`) hand it the `<li>` carrying the attribute.
  Pressed on the toggle button all three resolve the same `<li>`.
- **`ArrowRight` is a no-op on an expanded node, and throws on a row with no button** —
  `openng-optimus-ui-tree.mjs:507` and `openng-optimus-ui-treetable.mjs:4980` both guard on
  `!expanded`, so the APG's "move to first child" half never runs; `:4982` then reads
  `findSingle(currentTarget, 'button').style` unguarded; the toggler renders for
  leaves too and hides itself with `visibility` (`:5148`), so it satisfies the lookup.
- **`indentation` is inert without `virtualScroll`** — it is bound in the virtual branch alone
  (`openng-optimus-ui-tree.mjs:1978`), so the field stays unset (`:158`) and the inline
  `level * indentation + 'rem'` (`:627`) becomes `NaNrem`, which the browser drops. A default
  `p-tree` is indented by the stylesheet alone
  (`@openng/optimus-ui-styles/dist/tree/index.mjs:27`).
- **`p-tree`'s filter input is unnamed** — `placeholder` only
  (`openng-optimus-ui-tree.mjs:1916`), so `filterPlaceholder` is its whole accessible name.
- **`Escape` in the `p-treeSelect` popup is not this component's**: its only `keydown` binding
  is on the hidden input (`openng-optimus-ui-treeselect.mjs:940`).
- **`p-organizationChart` shows nothing without `expanded: true`** on each parent node — a
  collapsed branch is `visibility: hidden` (`getChildStyle`, `:123-127`) yet keeps its space. It
  has no media query or overflow rule, so wrap it in `overflow-x: auto` and show the tree on a
  phone.

## Sources

- `openng-optimus-ui-tree.mjs` (fesm2022) — the node template and every `p-tree` key handler.
- `openng-optimus-ui-treetable.mjs` — the `ttRow`/`ttSelectableRow` host bindings that carry
  the treegrid's roles, tab stops, and selection.
- `openng-optimus-ui-treeselect.mjs` — the combobox naming expression and the focus move.
- `openng-optimus-ui-basecomponent.mjs` and `openng-optimus-ui-bind.mjs` — the inherited
  inputs, and the directive that turns a `pt` section into attributes.
- `openng-optimus-ui-organizationchart.mjs` — the chart's table template, click-only node, and
  unnamed toggle.
- `@openng/optimus-ui-styles/dist/{tree,treetable,treeselect,organizationchart}/index.mjs` and
  `@openng/optimus-ui-themes/dist/aura/tree/index.mjs` — the rules and token values the Design
  tab quotes.
- W3C APG *Tree View* and *Treegrid* — the `Home`/`End`, typeahead and expanded-`ArrowRight`
  behaviors the bundles do not implement.
- `docs/generated/CONTRAST.MD` — no tree row; the node label is the "content panel" pair
  (10.35:1 light, 17.72:1 dark), the selected label the table's highlight pair (6.59–20.38:1).
  Nodes and tree-table rows wear the kit's 2px `--primary-color-fg` ring inside their edge
  ("focus ring", 3.48–17.85:1); a selected node has no bar, only the tint.

## Semantic mapping

- Disclosure of a *node*, not a panel: `aria-expanded` sits on the `treeitem`/`row`, never on
  a toggle button. `p-treeSelect`'s own two are the popup's, on the input and on
  the trigger `<div role="button">` (`openng-optimus-ui-treeselect.mjs:944`, `:981`);
  node disclosure comes from the `<p-tree>` in its overlay (`:1021`).
- Selection is `aria-selected` conditionally: in `p-tree` only under `single`/`multiple`, since
  in `checkbox` mode `get selected()` is `undefined` and `aria-checked` replaces it — never
  both (`openng-optimus-ui-tree.mjs:198-203`, `:610`, `:612`). On the tree table it comes from
  `ttSelectableRow` (`openng-optimus-ui-treetable.mjs:4288`), not `ttRow`.
- Depth is `aria-level`, 1-based (`openng-optimus-ui-tree.mjs:615`); indentation announces
  nothing.
- The popup is a tree in a combobox, not a listbox: `aria-haspopup` is `'tree'`
  (`openng-optimus-ui-treeselect.mjs:943`).

## Rules

1. Give `p-tree` and `p-treeSelect` an `ariaLabel` or `ariaLabelledBy`; name a `p-treeTable`
   through its `pt` entry for `table`. Never let a combobox name itself from its value.
2. Never assume a keyboard behavior transfers between the three — check the handler named in
   Key API.
3. Keep a `p-treeTableToggler` in every row's first cell, leaves included.
4. Do not use `togglerAriaLabel`; template the `p-tree` toggler if it must be named.
5. Never ship `p-organizationChart` alone or with `selectionMode`; pair it with a named
   `p-tree` of the same data and keep the chart non-interactive.

## Default snippet

```html
<p-tree
  [value]="nodes"
  selectionMode="single"
  [(selection)]="selected"
  ariaLabel="Document folders"
  (onNodeExpand)="load($event.node)"
/>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
