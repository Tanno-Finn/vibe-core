---
name: Generic Card
selector: app-generic-card
tags: [card, layout, surface]
status: documented
---

# Generic Card (`app-generic-card`)

## Purpose

A flexible CSS-Grid card with four areas (header, content, metadata, footer) in a single container — no nested wrapper divs. Supports an icon+title header row, a star rating, header chips/tags, header action buttons, subtitle/description text or a fully custom content template, key-value metadata rows, and primary/secondary action buttons or a fully custom footer template. Responsive via container queries.

## When to use

- Grid-of-cards listings — tool catalogs, resource lists, demo overviews — that need a consistent icon/title/rating/chips/actions layout.
- Cards that need custom body or footer markup beyond the built-in fields — project it via the `#customContent`/`#customFooter` template references.

## When not to use

- A single metric/KPI tile — use `app-stat-card`.
- A container that needs collapse/expand behavior — use `app-standard-container`.
- A sidebar reference list — use `app-info-box`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `title` | `string?` | — | Card title |
| `headingLevel` | `2\|3\|4\|5\|6` | `3` | Heading tag for the title |
| `subtitle` | `string?` | — | Subtitle line |
| `description` | `string?` | — | Body description text |
| `icon` | `string?` | — | PrimeIcon suffix (rendered as `pi {{icon}}`) |
| `iconColor` | `string?` | — | Overrides the icon/accent color (CSS color value) |
| `rating` | `number?` | — | 0-5 star rating, rendered with `role="img"` |
| `hoverable` | `boolean` | `true` | Enables hover elevation and gates `cardClick` emission on mouse click |
| `interactive` | `boolean` | `false` | Makes the whole card a keyboard-operable control: adds `tabindex="0"`, `role="button"`, and Enter/Space activation. Leave `false` for passive surfaces (only child buttons focusable) |
| `ariaLabel` | `string?` | — | Accessible name for the card, applied only when `interactive` is `true` |
| `selected` | `boolean` | `false` | Selected visual state (accent border/ring) |
| `elevated` | `boolean` | `false` | Extra box-shadow |
| `borderColor` / `backgroundColor` | `string?` | — | CSS overrides for the card's border/background |
| `chips` | `CardChip[]?` | — | `{ label, style?, styleClass?, icon?, removable? }` header tags |
| `metaInfo` | `{icon?, label?, value}[]?` | — | Key-value rows in the metadata area |
| `headerActions` | `CardAction[]?` | — | Optimus UI `p-button`s in the header |
| `primaryActions` / `secondaryActions` | `CardAction[]?` | — | Native `<button>`s in the footer |

`CardAction`: `{ icon?, label?, severity?, outlined?, text?, size?, tooltip?, styleClass?, action: () => void, disabled? }`.

**Output:** `cardClick: EventEmitter<MouseEvent>` — emitted from the host `<article>` click handler, but only when `hoverable` is `true`.

Content projection: no default `<ng-content>`; instead two named `@ContentChild` template references — `#customContent` (renders inside the content area) and `#customFooter` (renders inside the footer area), both via `<ng-template>`.

## Example

```html
<app-generic-card
  title="K-Means Clustering"
  icon="pi-chart-scatter"
  description="Partition data into k clusters by minimizing within-cluster variance."
  [chips]="[{ label: 'Unsupervised' }, { label: 'Beginner' }]"
  [primaryActions]="[{ label: 'Open demo', icon: 'pi-play', action: openDemo }]">
</app-generic-card>
```

## Accessibility

- The rating uses `role="img"` with a full `aria-label` ("Rating: N out of 5 stars"); the individual star icons are `aria-hidden`.
- Header/footer action buttons carry their own `pTooltip`/`ariaLabel`/labels.
- Whole-card interaction is **opt-in** via `interactive`: because the component cannot tell whether a given card is a real control or a passive surface (both use `hoverable`), keyboard support is gated behind `interactive` rather than applied automatically. When `interactive` is `true`, the host `<article>` gets `tabindex="0"`, `role="button"`, an `aria-label` (via the `ariaLabel` input), and Enter/Space activation that emits `cardClick`, so keyboard-only users can operate it like a button. When `false` (default) the card stays a passive surface and only its child buttons are keyboard-reachable — so set `interactive` before relying on `cardClick` as the sole interaction. Note: a card marked `interactive` should not also contain focusable child buttons (nested controls inside a `role="button"` is an accessibility antipattern) — use one pattern or the other.
- `prefers-contrast: high` thickens borders; `prefers-reduced-motion` disables hover transitions.
