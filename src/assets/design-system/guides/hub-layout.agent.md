---
id: hub-layout
title: Hub Layout
category: layouts
tags: [layout, hub, grid, cards]
summary: An overview page is a page-wide grid of registry-fed cards — one template ships for it and takes no projected content, the grid answers the viewport because the hub owns the page, and the state that replaces the cards has to say whether nothing matched or nothing loaded.
related: [article-layout, demo-layout, ui-pattern-selection, a11y-guidelines, design-tokens, i18n-localization]
covers: []
measured-against: '@angular/core@22.1.4'
tabs:
  examples: The hub in its four parts, one grid recipe shown at three widths, and the three data states side by side
  usage: What the template takes and what it ignores, the mapping from a registry record, and three Do/Don't pairs
  design: The track recipe and the column ladder it produces, the muted-text cliff, the narrow-screen rule, one deleted API
  development: The files a hub is joined from, a minimal hand-composed hub, checks that need no browser, and an acceptance checklist
  i18n: Which strings the frame owns, why a category is a key fragment, and where longer labels push
  history: Document changelog, one line per version
---

## When to use
- Building an overview page: many items of one kind, each a card.
- Adding search, category, or difficulty filtering over such a collection.
- Deciding what the page shows while loading, after a failed load, and on no match.
- Reviewing a listing page's grid, cards, or empty state.

## When not to use
- The page around one article's prose — `article-layout`.
- A demo page, its stage and controls — `demo-layout`.
- Choosing WHICH control filters — `ui-pattern-selection`.
- Focus order, accessible names, live-region wording — `a11y-guidelines`.
- Token values, container-width and spacing scales — `design-tokens`.

## Key API
`<app-content-hub-template [config] [items] [loading] [loadFailed] (retry)>` is a **closed box**: it declares no `ng-content`, so everything arrives as data. Unasked it renders the page header, a search field, filter chips for any axis with more than one value, a sort control, a skeleton grid, the card grid, and one state band per cause — no-match with clear-filters, or load-failed with a retry.

`config: ContentHubConfig` requires `titleKey`, `subtitleKey`, `ctaLabelKey`; `fromParam` is optional. Every field is read.

`items: ContentItem[]` requires `id`, `path`, `titleKey`, `descriptionKey`, `category`; `difficulty`, `estimatedTime`, `featured`, `draft`, `publishDate`, `icon`, and `tags` are optional; each but `tags` (unused) adds a badge, a chip, or a filter axis, so a field dropped in the mapping silently never appears. `items` is a signal input; `loading`/`loadFailed` are signals you own.

A hub composed by hand must assemble the same four parts: `app-page-header` (the only `h1`), a filter region, the collection, and the state that replaces it.

## Accessibility
- One `h1`, from `app-page-header`. The card heading sits one level below whatever groups the cards: `h2` under the page title, `h3` under a group heading.
- The empty state replaces the cards, so its heading takes the level the cards had — otherwise the outline skips exactly when the page is emptiest.
- A card that navigates is an `<a>`: `role="button"` costs the URL affordances no key handler gives back. Filter chips are the inverse: native `<button>`s with `aria-pressed`, changing a view rather than going anywhere.
- Announce the result count from one polite live region, kept silent while data is in flight. Skeletons are `aria-hidden`, so the load needs its own `role="status"` with `aria-busy`.

## Pitfalls
- **A `computed()` over a plain `@Input` array.** Only signals read during the derivation are tracked, and an input array is not one: it caches its first value and never recomputes. Filter options built this way freeze at their skeleton-pass value.
- **`empty` used as `loading`.** Deriving "still loading" from an empty collection makes a failed load indistinguishable from one in flight, permanently. Three states need three conditions.
- **A hard-coded element id inside a card.** Rendered N times, a static `id` — or a counter restarting per group — becomes N duplicates; every `aria-labelledby` resolves to the first.
- **A category treated as text.** It is a concatenated key fragment: an unknown value renders its raw dotted path, invisible to the key gate.
- **A `minmax()` floor without `min(…, 100%)`.** `auto-fill` falls back to one repetition, but a track whose floor exceeds the container still overflows it.
- **The template already meets these rules:** its card CTA is an `<a pButton routerLink>` described by the card title, its state headings are `h2` like the cards, its status region announces the filtered count 500 ms after the last change. Hand-composing, copy those.

## Sources
- CSS Grid Layout Module Level 2, repeat-to-fill: https://www.w3.org/TR/css-grid-2/ — with `auto-fill`, "if any number of repetitions would overflow, then 1 repetition".
- Angular signals: https://angular.dev/guide/signals — only signals read during the derivation are tracked; the value is cached.
- WCAG 2.2 SC 4.1.3, Status Messages: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — a result count is a status message: it must reach the user without receiving focus.
- WAI-ARIA Authoring Practices, Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/ — a toggle button carries `aria-pressed`; the state is the attribute, not the styling.
- `src/app/pages/demos-overview/` — the blueprint: the one page on the hub template.

## Semantic mapping
| Intent | Where it goes |
| --- | --- |
| Page title and standfirst | `app-page-header` — never a second `h1` |
| Narrowing the collection | the filter region, above the collection |
| How many survived the filter | one polite live region, not a heading |
| One item | one card, heading level set by its grouping |
| Where the card leads | an `<a>` around the card, or its one CTA |
| Nothing matched | the empty state, with a control that clears the filters |
| Nothing loaded | a distinct error state, with a retry |

## Rules
- MUST: give the page one `h1` from `app-page-header`, keep the card heading one level below its grouping, and give the empty state that same level.
- MUST: lay the collection out with `repeat(auto-fill|auto-fit, minmax(min(<floor>, 100%), 1fr))` and a `var(--space-*)` gap.
- MUST: distinguish loading, load failure, and empty-after-filter by three separate conditions.
- MUST: announce the result count in one polite live region per page.
- MUST: derive filter options and filtered items from signals, never from a plain `@Input` array.
- SHOULD: make the whole card an `<a>` when it has one destination.
- SHOULD: collapse the grid to one column at the kit's `768px` step.
- NEVER: give an element inside a card a static id.
- NEVER: render `category` as text instead of resolving it through its key namespace.
- NEVER: offer "clear the filters" in a state no filter produced.

## Default snippet
```html
<!-- Delegated: the mapping into ContentItem is what you own. -->
<app-content-hub-template [config]="hubConfig" [items]="items()"
  [loading]="loading" [loadFailed]="loadFailed" (retry)="load()" />
```
```css
/* Hand-composed: the collection and its one collapse step. */
.hub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: var(--space-6);
}
@media (max-width: 768px) { .hub-grid { grid-template-columns: 1fr; } }
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
