---
id: scroller
title: Scroller
category: library
tags: [list, performance, a11y]
summary: Virtual scrolling for long uniform lists — and the honest cost: find-in-page, list size, and focus stop at the edge of the rendered slice.
related: [listbox, select, paginator, tree]
covers: [scroller]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Ten thousand rows with a live rendered-range readout, and the same list with list semantics and a jump-to control
  usage: When a slice is worth it and when a plain list is, Do/Don't on a glossary in a scroller, annotated sources
  design: Loader tokens, the container's focus ring, and what happens in a narrow column
  development: Inputs that decide behavior, what assistive technology gets and what you add, list and jump recipes
  history: Document changelog
---

## When to use
- Thousands of **uniform, one-line rows** people scroll, pick or scan (logs, token lists, big option sets), where DOM size makes the page stutter.
- Inside select, listbox, multiselect, tree or table, use their `virtualScroll` flag instead — they embed this component and supply the option semantics.

## When not to use
- **Text people read or search** (glossary, article or timeline lists) → a plain list with a filter or `p-paginator`. Find-in-page sees only rendered rows.
- **Rows of different heights** → a plain list; `itemSize` is one number and no row is measured.
- **A few hundred simple rows** → a plain list; the browser handles it, and search, reading and focus stay intact.
- **Focusable controls in rows** → a focused row that leaves the slice is destroyed.

## Key API
`ScrollerModule` / `Scroller` from `@openng/optimus-ui/scroller` (selectors `p-scroller`, `p-virtualscroller`).
- `items` (the whole array), `itemSize` (px; `[h, w]` for `orientation="both"`; required, default `0`), `scrollHeight`/`scrollWidth` (written inline), `orientation` (`'vertical'`).
- Rendered slice: `items.slice(first, last)` (`openng-optimus-ui-scroller.mjs:516-536`) = viewport + 2–3 × `numToleratedItems` (default half a viewport, `:795`, `:807`); spacer = `items.length × itemSize` (`:885-899`), content moved by `translate3d` (`:905`).
- Templates: `#item` (`let-item let-options="options"`; `options.index` absolute, `count`, `first`, `last`, `even`, `odd`, `:1104-1115`), `#content` (`let-items let-options`; keep `options.contentStyleClass` and `options.contentStyle` on your root — the scroller finds its content box by that class), `#loader`, `#loadericon`.
- `lazy` + `step` + `loading` → `onLazyLoad({ first, last })`; `showLoader` + `delay`; `appendOnly` (DOM only grows); `trackBy`; `tabindex` (`0`); `disabled` renders everything, no virtualization (`:1220-1225`).
- Methods: `scrollToIndex(index, behavior = 'auto')` (`:684`), `scrollTo(options)`. Outputs: `onScroll`, `onScrollIndexChange({ first, last })` (`:1002`), `onLazyLoad`.
- Inherited `pt`: `pt.root` attributes land on the scroll container via `pBind` (`:1184`).

## Accessibility
- **The container is a named nothing.** A `div` with `tabindex="0"`, no role, no name, no keydown (`:1184`); arrows and Page keys scroll it natively. Name it: `[pt]="{ root: { 'aria-label': …, role: 'region' } }"`. Its CSS sets `outline: 0 none` (`:15-22`); the kit's one ring lists `.p-virtualscroller:focus-visible` and draws 2px `--primary-color-fg` inside it (CONTRAST.MD "focus ring", 3.48:1 and up). Add no outline of your own.
- **No list semantics, no size.** Rows are plain `div`s; a screen reader can count only the dozen or so rendered. Use a `#content` template with `ul role="list"`/`li`, `aria-setsize = items.length`, `aria-posinset = getItemOptions(i).index + 1`; screen-reader support on list items varies — test yours.
- **Find-in-page and browse mode see the slice.** Unrendered rows do not exist; whether a screen reader's virtual cursor scrolls the container to render more depends on screen reader and browser. Offer a filter or jump-to (SC 2.4.5).
- **Focus on a row is lost when it scrolls away.** Measured: a focused row removed from the slice leaves focus on `body` (SC 2.4.3). Keep rows non-focusable, or focus the container and move `aria-activedescendant` (as listbox does).
- **The loader is silent**: an SVG spinner without text (`:1214`). Announce loading in your own polite live region.
- `scrollToIndex(i, 'smooth')` bypasses the kit's reduced-motion CSS; pass `scrollBehavior()` from `src/app/utils/reduced-motion.ts`.

## Pitfalls
- A row whose rendered height differs from `itemSize` (padding, borders, wrapping text) desynchronizes spacer and offset — set `height: itemSize` and `box-sizing: border-box` on every row.
- `.p-virtualscroller-content` is `position: absolute; min-width: 100%` (`:24-30`): long rows do not wrap, they widen the content and scroll sideways. Give it `width: 100%` and ellipsize.
- A `#content` template without `options.contentStyleClass` loses the content box lookup (`:657`) and its transform.
- Resize re-runs the range only on a height change (`:1058-1076`); re-create the scroller to change `itemSize`.
- Without `trackBy`, rebuilt item objects re-create every row on each range change.

## Sources
- `@openng/optimus-ui` 2.0.2 `fesm2022/openng-optimus-ui-scroller.mjs` — every behavior claim, by line.
- `@openng/optimus-ui-themes/dist/aura/virtualscroller/index.mjs` — loader tokens; none in the contrast gate.
- WAI-ARIA 1.2 aria-setsize https://www.w3.org/TR/wai-aria-1.2/#aria-setsize — size of a set not fully in the DOM.
- WCAG 2.2 SC 2.4.3 https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — focus lost with a removed row.
- WCAG 2.2 SC 2.4.5 https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html — a second way to a row find-in-page cannot reach.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Long uniform list | `p-scroller` + `pt.root` name/role + `#content` `ul`/`li` with setsize/posinset |
| Reach a far row | number input + button → `scrollToIndex(n - 1, scrollBehavior())` |
| Print or "show all" | `[disabled]="true"` |
| Readable, searchable content | plain list + filter or `p-paginator` |

## Rules
- MUST: fix every row to exactly `itemSize`, one line, `box-sizing: border-box`.
- MUST: name the container through `pt.root`; keep its `tabindex` — the kit ring shows its focus.
- MUST: offer a filter or jump-to control beside a virtual list.
- SHOULD: render list semantics with `aria-setsize`/`aria-posinset` from `getItemOptions()`.
- NEVER: virtualize reading content (glossary, articles), variable-height rows, or rows with focusable controls.

## Default snippet
```html
<p-scroller [items]="rows" [itemSize]="40" scrollHeight="240px"
            [pt]="{ root: { 'aria-label': labels().rows, role: 'region' } }">
  <ng-template #content let-items let-options="options">
    <ul role="list" [class]="options.contentStyleClass" [style]="options.contentStyle">
      @for (row of items; track row.id; let i = $index) {
        <li [style.height.px]="40" [attr.aria-setsize]="rows.length"
            [attr.aria-posinset]="options.getItemOptions(i).index + 1">{{ row.label }}</li>
      }
    </ul>
  </ng-template>
</p-scroller>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
