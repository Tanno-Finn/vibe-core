---
id: table
title: Table
category: library
tags: [data, collection, a11y]
summary: Records compared column by column — a harness around a table you write yourself, with correct sort state and a selection nobody can hear.
related: [select, checkbox, button, paginator, skeleton, timeline]
covers: [table]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, live selection and sort read-outs, empty state, paginator report, narrow scrolling
  usage: Seven shapes delineated, the library/template contract, house style, scope boundary, Do/Don'ts
  design: Anatomy, Aura token chain, contrast per row variant and theme, geometry, the inset focus rings
  development: API defaults, sorting, three selection mechanisms, a11y tree, responsive, SSR, checklist
  i18n: Three string families, frozen checkbox labels, the untranslatable page report, RTL
  history: Document changelog
---

## When to use
- Records are **compared across columns** and at least one of sorting, selection, or paging is real. Otherwise a plain `<table>` — `p-table` adds only state.

## When not to use
- One record's fields → a definition list or card.
- Rows nest → `p-treetable`. Cards as well as rows → `p-dataview`. Reordering *is* the task → `p-orderlist`.

## Key API
`TableModule` from `@openng/optimus-ui/table`. **The library owns the `<table>`, its three rowgroups and the paginator; every `<tr>`/`<th>`/`<td>` is yours.**
- `[value]`; `dataKey` — set it with selection or paging, or selection compares whole objects and dies on refetch.
- Sorting: `pSortableColumn="field"` + `<p-sortIcon field="…" />` (camelCase, `:4771`); `sortMode` (**'single'**), `defaultSortOrder` (**1**), `resetPageOnSort` (**true**), `customSort` + `(sortFunction)`.
- Selection: `selectionMode` (`'single'|'multiple'`, **row-click only**), `[(selection)]`, `[pSelectableRow]`; or `p-tableCheckbox` / `p-tableHeaderCheckbox` / `p-tableRadioButton`, independent of it. `metaKeySelection`: **false**.
- Paging: `[paginator]`, `[rows]`, `[first]`, `totalRecords` (**0** — a lazy table without it shows no pager), `alwaysShowPaginator` (**true**), `showCurrentPageReport` + `currentPageReportTemplate` (**`'{currentPage} of {totalPages}'`**).
- Presentation: `stripedRows`, `showGridlines`, `rowHover` (implied by `selectionMode`; a checkbox-only table needs it), `size` (`'small'|'large'`), `[tableStyle]` (`min-width`), `[scrollable]` + `scrollHeight`.
- Templates bind via reference names — `#caption`, `#header`, `#body`, `#footer`, `#summary`, `#emptymessage`, `#colgroup`. `pTemplate` still binds (the `PrimeTemplate` query survived, `:3080`, switched on `getType()` `:1329-1331`); reference names are house style.

## Accessibility
- **The frame is a plain table:** `role="table"` and three `role="rowgroup"` are static (`openng-optimus-ui-table.mjs:3205-3252`).
- **Name it.** The `#caption` band sits *outside* the `<table>` and names nothing. Use `[pt]="{ table: { 'aria-label': … } }"`.
- **`pSortableColumn` gets the state right and ships no control.** Static `role="columnheader"`, `tabindex="0"`, live `aria-sort` (`none` when unsorted), Enter and Space only (`:4682`).
- **Selection is silent by default.** `pSelectableRow` sets only a class, a roving `tabindex` and `data-p-selectable-row`; the kit's 4px accent bar (gated) is for the eye only. A row's `aria-selected` is ignored under `role="table"` — exposed only inside `grid`/`treegrid`. Fix: **a checkbox column** (preferred), or `[pt]="{ table: { role: 'grid' } }"` **plus** the attribute.
- **Row keyboard** (selectable rows): arrows, Home/End, Space/Enter select, Ctrl/Cmd+A takes the page. Clicks on `INPUT`/`BUTTON`/`A` are ignored (`:1764`) — an actions column never selects.
- **Checkbox names freeze.** The fallback `aria.selectRow/unselectRow` is assigned inside the selection subscription (`:5982` row/radio, `:6167` header): absent until the first selection, frozen after, deaf to a language switch. Always pass `[ariaLabel]` naming the record.

## Pitfalls
- **No empty state by default:** zero rows render a header over nothing. The `#emptymessage` template is a `<tr>` whose cell needs a `colspan`; announce a filtered one politely.
- **The stylesheet is unencapsulated:** a bare `.p-datatable-tbody { … }` rule anywhere retunes every table in the app.
- **Kit fills:** rows and headers paint `--surface-card`, so the dark 16 % selection tint lies over the card (gated, ≥ 6.59:1); rows and sort headers ring inside (the kit's 2px ring, "focus ring", inset).
- **`responsiveLayout` is back** (default `'scroll'`, `:943`), and so is `"stack"`, which injects a media query hiding the header cells (`:1324-1325` → `createResponsiveStyle()` `:3007-3046`) and costs every column its name. Never set it: scroll a `min-width` table; on a phone, drop columns rather than shrink them.

## Sources
- W3C APG — Table: https://www.w3.org/WAI/ARIA/apg/patterns/table/ — the shipped frame's baseline.
- W3C APG — Grid: https://www.w3.org/WAI/ARIA/apg/patterns/grid/ — the role selection forces, and its keyboard price.
- W3C WAI — Tables Tutorial: https://www.w3.org/WAI/tutorials/tables/ — `scope`, `caption`, headers: the parts you own.
- WAI-ARIA 1.2 — `aria-sort`: https://www.w3.org/TR/wai-aria-1.2/#aria-sort — allowed values, one direction at a time.
- WCAG 2.2 — 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — what color-only selection fails.
- PrimeNG — Table: https://primeng.org/table — upstream v21 docs; claims re-checked in the Optimus source.

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Comparable records, sortable | `p-table` + `pSortableColumn` + `p-sortIcon` |
| Selection a screen reader can hear | a `p-tableCheckbox` column (+ `[ariaLabel]`), or `role: 'grid'` + `[attr.aria-selected]` |

## Rules
- MUST: name the table via `[pt].table`, set `dataKey` with selection or paging, and ship an `emptymessage` row with a `colspan`.
- MUST: make selection audible, pass `[ariaLabel]` on every table checkbox/radio, and bind `currentPageReportTemplate` from the translation layer (its English default is no translation key).
- SHOULD: right-align numbers (headers too), set `min-width` and let the container scroll.
- NEVER: rely on a `caption` as the accessible name, or on `aria-selected` under `role="table"`.
- NEVER: extend this doc to virtual scroll, lazy loading, row edit, frozen columns, resize/reorder, expansion, or export — out of scope.

## Default snippet
```html
<p-table [value]="rows()" dataKey="id" selectionMode="single" [(selection)]="selected"
  [tableStyle]="{ 'min-width': '40rem' }"
  [pt]="{ table: { role: 'grid', 'aria-label': labels().tableName } }">
  <ng-template #header><tr>
    <th pSortableColumn="name">{{ labels().name }} <p-sortIcon field="name" /></th>
    <th class="num">{{ labels().size }}</th></tr></ng-template>
  <ng-template #body let-row>
    <tr [pSelectableRow]="row" [attr.aria-selected]="isSelected(row) ? true : null">
      <td>{{ row.name }}</td><td class="num">{{ row.size }}</td></tr></ng-template>
  <ng-template #emptymessage><tr>
    <td colspan="2"><span aria-live="polite">{{ labels().noMatches }}</span></td></tr></ng-template>
</p-table>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
