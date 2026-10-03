---
id: dataview
title: DataView, OrderList, and PickList
category: library
tags: [collection, reorder, transfer, a11y]
summary: Three list arrangements that share only their data shape — one renders cards you write yourself, two move rows for you, and none of them says out loud that a move happened.
related: [table, paginator, multiselect, select, button, a11y-guidelines, dragdrop]
covers: [dataview, orderlist, picklist]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three rendered side by side, the layout switch DataView does not ship, and what each move button emits
  usage: Which of the three a task wants, Do/Don't on the silent move and on the row label, annotated sources
  design: Aura token chain for all three, the opt-in responsive style element, the list edge and the kit rule that re-points it
  development: Input and output maps, the inert inputs, DataView's sort and filter branches, and each move algorithm at the end of the list
  i18n: Which strings the library holds, which eight aria labels the kit does not translate today, and the ones nobody can reach
  history: Document changelog
---

## When to use
- **`p-dataview`** — records as cards or tiles, with a paginator, a sort hook, and a list/grid flag. It renders no row: your `#list` / `#grid` template does (`openng-optimus-ui-dataview.mjs:511-530`).
- **`p-orderlist`** — one list whose **order is the value**: a multi-select listbox, four move buttons, `onReorder` per move.
- **`p-picklist`** — two lists whose **membership is the value**, reorderable within each: four transfer buttons, four reorder buttons per side.

## When not to use
- Records compared field by field in columns → `p-table`.
- A long collection in either list component: neither forwards `virtualScroll` to its listbox, so every row is in the DOM behind the `scrollHeight` clip, `14rem` (`openng-optimus-ui-orderlist.mjs:177`, `openng-optimus-ui-picklist.mjs:307`).
- Membership without order → `p-multiselect` or a checkbox group.

## Key API
All three extend `BaseComponent` and so also take `dt`, `unstyled`, `pt`, `ptOptions` (`openng-optimus-ui-basecomponent.mjs:428`), which none declares.
- **`p-dataview`** — `value`, `layout` (`'list' | 'grid'`, default `'list'`, `openng-optimus-ui-dataview.mjs:255`), `paginator`, `rows`, `first`, `totalRecords`, `lazy`, `sortField`, `sortOrder`, `filterBy`, `emptyMessage`; outputs `onPage`, `onSort`, `onLazyLoad`, `onChangeLayout`; content children `#list`, `#grid`, `#emptymessage`. **No layout switch ships** — the bundle exports four symbols, none a control (`:835`), and the `#listicon` / `#gridicon` it queries (`:334`, `:339`) are in no template.
- **`p-orderlist`** — `value` (reordered **in place**), `[(selection)]`, `dragdrop`, `filterBy`, `controlsPosition`, `scrollHeight`, `responsive` + `breakpoint`; output `onReorder`.
- **`p-picklist`** — `[(source)]` / `[(target)]` (`model()` signals, `openng-optimus-ui-picklist.mjs:95`, `:101`), `dragdrop`, `filterBy`, `showSourceControls` / `showTargetControls`, `keepSelection`, `responsive` + `breakpoint`; outputs `onMoveToTarget`, `onMoveToSource`, `onMoveAllToTarget`, `onMoveAllToSource`, `onSourceReorder`, `onTargetReorder` — each emitting an object `{ items }` (`:850`), where OrderList's `onReorder` emits the rows bare (`openng-optimus-ui-orderlist.mjs:506`).
- **`trackBy` is inert on all three** (`openng-optimus-ui-dataview.mjs:210`, `openng-optimus-ui-orderlist.mjs:172`, `openng-optimus-ui-picklist.mjs:192`, `:197`, `:202`): the list components render through `p-listbox`, whose compiled input list has none (`openng-optimus-ui-listbox.mjs:1353`), and DataView renders no row.

## Accessibility
- **A completed move is announced by none of the three.** No bundle contains `aria-live` or `role="status"`. The embedded listbox brings three polite regions — filter result, empty message, selection count (`openng-optimus-ui-listbox.mjs:1435`, `:1609`, `:1612-1613`) — and not one of them names a moved item: an OrderList move touches none of them, while every PickList transfer empties the selection array that is the listbox's model (`openng-optimus-ui-picklist.mjs:939`, `:990`), so that region drops to "No selected item" (`openng-optimus-ui-config.mjs:171`). **Own a polite region and state the new position** on `onReorder`, the two reorder outputs, and the `onMove*` outputs.
- **Drag reorder is pointer-only in both list components**: rows are `cdkDrag` in a `cdkDropList` (`openng-optimus-ui-listbox.mjs:1445-1447`, `:1522`), and the CDK opens a drag from `mousedown` / `touchstart` only (`@angular/cdk@22.1.4`, `fesm2022/drag-drop.mjs:719`). The keyboard path is the move buttons, real `<button type="button">` (`openng-optimus-ui-orderlist.mjs:736`, `openng-optimus-ui-picklist.mjs:1292`) — **never hide them while `dragdrop` is on**. The listbox's own keys cover navigation and selection only.
- **PickList's move-bottom button is mislabeled**: `moveBottomAriaLabel` returns `aria.moveDown` (`openng-optimus-ui-picklist.mjs:488`), so two buttons per side share a name; OrderList's returns `aria.moveBottom` (`openng-optimus-ui-orderlist.mjs:343`).
- **Four naming inputs are bound nowhere**: `openng-optimus-ui-orderlist.mjs` declares `ariaLabelledBy` (`:102`) and `ariaFilterLabel` (`:147`) but binds only `ariaLabel` (`:798`); `openng-optimus-ui-picklist.mjs` declares `ariaSourceFilterLabel` (`:282`) and `ariaTargetFilterLabel` (`:287`) but binds only `sourceAriaLabel` / `targetAriaLabel` (`:1358`, `:1502`).
- **The list edge is the kit's.** Aura's stock `{surface.300}` / `{surface.600}` frame misses 3:1; `src/styles.scss` sets `.p-listbox { --p-listbox-border-color: var(--control-border); }`, which reaches the lists inside both components (CONTRAST.MD "form field edge", `listbox.border.color`: 3.85:1+ on every page surface); the active option wears the kit's inset ring ("option list focus"). Add nothing.
- **DataView emits no ARIA and no `role`**: every role, name, and heading inside a card is yours; the embedded paginator adds `aria-label` on its nav buttons and `aria-current="page"` on the active link, but no `nav`, no `role` and no live region (`openng-optimus-ui-paginator.mjs:533`, `:543`–`:619`).

## Pitfalls
- **DataView renders an empty box for any `layout` but the two.** List and grid are separate `@if`s with no else (`openng-optimus-ui-dataview.mjs:511`, `:521`), while `isEmpty()` reads `filteredValue || value` (`:426-429`), so the empty message stays hidden too.
- **A row's label is `option.name` unless you say otherwise.** Both list components bind `[optionLabel]="dataKey ?? 'name'"` (`openng-optimus-ui-orderlist.mjs:790`, `openng-optimus-ui-picklist.mjs:1363`): `dataKey`, documented as the identity field, is used as the *label* field.
- **PickList never writes its own model signals**: `source.set` / `target.set` / `.update` occur nowhere in the bundle; every move splices the held arrays (`:926`, `:951`). `(sourceChange)` / `(targetChange)` therefore do not fire on an internal move.
- **The two `moveUp` implementations disagree about a blocked item.** OrderList carries on past an item already at the top (`openng-optimus-ui-orderlist.mjs:485-495`); PickList `break`s (`openng-optimus-ui-picklist.mjs:842-844`), so a multi-selection containing the first row moves **nothing**. PickList's other three break the same way; of OrderList's four, only `moveUp` and `moveDown` do not.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-dataview.mjs` — the whole DataView surface, and the proof of no ARIA and no switch.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-orderlist.mjs` — its move algorithms and listbox bindings.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-picklist.mjs` — the transfer paths and the getter with the move-bottom defect.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-listbox.mjs` — where both list components delegate rows, keys, and drag, and where their polite regions sit.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-basecomponent.mjs` — the four inputs all three inherit and none declares.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs:168-198` — the English defaults behind every message and aria label they read.
- W3C APG — Listbox: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ — the pattern the embedded list implements, with its keyboard contract.
- WCAG 2.2 SC 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/status-changes.html — why a move that shifts no focus still owes an announcement.
- WCAG 2.2 SC 2.5.7: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html — the single-pointer alternative the buttons satisfy.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Records as cards, paged | `p-dataview` + your `#list` / `#grid` template |
| Order is the answer | `p-orderlist` + a live region you own |
| In or out, and in what order | `p-picklist`, both lists named, `bottomButtonAriaLabel` set |

## Rules
- MUST: announce every completed move yourself — item and new position — from a polite region you own.
- MUST: name both PickList lists, and set `bottomButtonAriaLabel` to undo the shared label.
- MUST: on both list components, ship an `#item` template or point `dataKey` at the label field.
- MUST: keep the move buttons visible whenever `dragdrop` is on — that is the keyboard path.
- MUST: read PickList results from the arrays or the outputs, never from `(sourceChange)`.
- NEVER: bind `layout` to anything but `'list'` or `'grid'`, and never rely on `trackBy` here.

## Default snippet
```html
<p-orderlist [value]="rows" [(selection)]="picked" dragdrop
             [ariaLabel]="listLabel()" (onReorder)="announceMove($event)">
  <ng-template #item let-row>{{ row.label }}</ng-template>
</p-orderlist>
<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ moveMessage() }}</p>
```
```ts
announceMove([first]: Row[]): void {
  const at = this.rows.indexOf(first) + 1;
  this.moveMessage.set(`${first.label}, ${at} of ${this.rows.length}`);
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
