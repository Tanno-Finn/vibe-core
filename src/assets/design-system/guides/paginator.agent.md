---
id: paginator
title: Paginator
category: library
tags: [navigation, collection, paging, a11y]
summary: The page bar Table and DataView embed, and the one you stand up yourself — buttons in no landmark, a page link whose accessible name is a bare digit, and a slot order no input can change.
related: [table, dataview, select, i18n-localization, scroller]
covers: [paginator]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Standalone paging, the six report placeholders rendered, rows-per-page, and the empty and single-page states
  usage: Standalone versus embedded, the nav wrapper and the polite region, Do/Don'ts, annotated source
  design: Aura token chain, the 40px target, the wrapping row at 360px, and which contrast rows do not exist
  development: Inputs and defaults, the fixed slot order, page math and the zero-rows floor, write-back contract
  i18n: The seven aria keys the paginator reads, the one nothing reads, and the digit that disagrees with its name
  history: Document changelog
---

## When to use
- A collection longer than a screen, in fixed chunks, that **you** render — a card grid, a `<ul>`, a server-paged report.
- Inside `p-table` or `p-dataview`, do **not** add one: both embed it and forward its inputs (`openng-optimus-ui-table.mjs:3104-3128`, `openng-optimus-ui-dataview.mjs:487-508`). Set `[paginator]="true"`.

## When not to use
- Under two pages, or an endless "load more" stream.
- Process steps → `p-stepper`; parallel views → `p-tabs`.

## Key API
`Paginator`/`PaginatorModule` from `@openng/optimus-ui/paginator`. `:NNN` = `openng-optimus-ui-paginator.mjs`.
- **Bind `rows` and `totalRecords`** — both default to `0` (`:233`, `:228`) and every page computation divides by `rows` (`:429-431`). `first` is the zero-based row offset (`:277-281`).
- `(onPageChange)` emits `{ page, first, rows, pageCount }` (`:454-468`); `PaginatorState` types every field optional, so read with a default. **No `firstChange`/`rowsChange`**: `[(first)]` is not two-way — set `first` in the handler.
- `pageLinkSize` (**5**, `:172`), `showPageLinks` (**true**, `:260`), `showFirstLastIcon` (**true**, `:223`), `alwaysShow` (**true**, `:183`; false hides a one-page bar, `:336-338`).
- `rowsPerPageOptions` — numbers plus at most one `{ showAll: 'All' }` object, whose value becomes `totalRecords` (`:406-422`); renders a `p-select` bound `[(ngModel)]="rows"` (`:641-655`).
- `showCurrentPageReport` + `currentPageReportTemplate` (default `'{currentPage} of {totalPages}'`, `:213`). **Six placeholders** — `{currentPage}`, `{totalPages}`, `{first}`, `{last}`, `{rows}`, `{totalRecords}` — each replaced once, not globally (`:523-531`).
- Also: `showJumpToPageDropdown`, `showJumpToPageInput` (a `p-inputnumber`, `:630-639`), `templateLeft`/`templateRight`, `locale`.
- **No layout input.** None in the input list (`:533`); the template fixes the order (`:534-671`): left slot, report, First, Prev, links, jump select, Next, Last, jump input, rows select, right slot. A layout string does nothing.

## Accessibility
- **No landmark, no name, no announcement.** The host binds only `class` and `style.display` (`:533`); no `nav`, `role`, or `aria-live`. Wrap it in a named `<nav>` and announce the new page in your own polite region on `(onPageChange)`.
- The four nav buttons are real `<button type="button">`, named from config keys `firstPageLabel`, `prevPageLabel`, `nextPageLabel`, `lastPageLabel` (`:543`, `:554`, `:608`, `:619`): Tab reaches each; no roving tabindex, no arrow keys.
- **The active page link carries `aria-current="page"`** (`:572`) and is named by the bare number: `getPageAriaLabel` fills `aria.pageLabel` (`:369-371`), whose default is the literal `'{page}'` (`openng-optimus-ui-config.mjs:198`): "3"; the kit pushes all seven keys, `'Page {page}'` included (`OPTIMUS_ARIA_KEYS`).
- **First is never `disabled`.** Prev, Next, and Last bind `[disabled]` (`:554`, `:608`, `:619`); First gets only the `p-disabled` class (`:25-30`, `:543`), so on page one it is a tab stop announced as enabled that does nothing (`:478-483`).
- **The jump-to-page input has no accessible name**: the `p-inputnumber` binds no `ariaLabel` (`:630-639`), and `aria.jumpToPageInputLabel` is read by nothing. Name it through `pt`, or leave it off. The rows-per-page `p-select` gets `[ariaLabel]` from `aria.rowsPerPageLabel` (`:651`).
- Nav buttons are 40 px (`navButton` `2.5rem`, Aura): clear SC 2.5.8's 24 px, miss SC 2.5.5 AAA's 44 px. Kit, gated ("table & paginator"): bar `--surface-card`, glyph 4.76+, current page the accent's pair, the 2px ring.

## Pitfalls
- **`rows` unset is division by zero.** `getPageCount()` is `Math.ceil(totalRecords / rows)` (`:429-431`), `getPage()` is `Math.floor(first / rows)` (`:475-477`): at `rows = 0` both are `NaN` or `Infinity`.
- **`totalRecords = 0`** makes `empty()` true (`:517-519`): Prev/Next/Last disabled, no page links, `{currentPage}` renders `0` (`:520-522`) — and the bar still renders (`alwaysShow`). Show an empty state instead.
- **A shrinking result set pages back exactly one step**: `updateFirst()` runs `changePage(page - 1)` when `first` passes `totalRecords` (`:469-474`), never clamping to the new last page.
- **The rows-per-page select writes `rows` into the component directly** (`:644`) and reports only through `onPageChange`; a parent `rows` signal that ignores it drifts from the screen.
- **`showJumpToPageDropdown` builds one option per page up front** (`:447-451`): 10 000 records at 10 rows is a thousand-item select.

## Sources
- `openng-optimus-ui-paginator.mjs` — inputs, defaults, page math, slot order.
- `openng-optimus-ui-config.mjs:176-210` — the English `aria` defaults, `pageLabel: '{page}'` included.
- `openng-optimus-ui-table.mjs:3104-3128`, `openng-optimus-ui-dataview.mjs:487-508` — forwarding.
- `@openng/optimus-ui-themes/dist/aura/paginator/index.mjs` — the token groups.
- `@openng/optimus-ui-styles/dist/paginator/index.mjs` — `flex-wrap` and `:focus-visible`.
- WAI-ARIA 1.2 `aria-current`: https://www.w3.org/TR/wai-aria-1.2/#aria-current — why `page`, on one link only.
- WCAG 2.2 SC 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/status-changes.html — a page swap without a focus move owes an announcement.
- W3C APG Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/ — the `nav` left to you.

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Paging a collection you render yourself | named `<nav>` + `p-paginator` + your own polite region |
| Paging rows or cards a library renders | `[paginator]="true"` on `p-table` / `p-dataview` |

## Rules
- MUST: bind `rows` and `totalRecords`, write `first` back in `(onPageChange)`, and wrap the bar in a named `<nav>` with your own polite region.
- MUST: bind `currentPageReportTemplate` from your strings — the kit's `syncAriaStrings` covers the seven aria keys, not the report.
- NEVER: rely on First being disabled on page one, or on a layout string to reorder the row.

## Default snippet
```html
<nav [attr.aria-label]="t('your-module.pagerName')">
  <p-paginator
    [rows]="rows()" [first]="first()" [totalRecords]="total()"
    [showCurrentPageReport]="true"
    [currentPageReportTemplate]="t('your-module.pageReport')"
    (onPageChange)="onPage($event)" />
</nav>
<p class="sr-only" aria-live="polite">{{ announcement() }}</p>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
