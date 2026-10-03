---
name: Split Bar
selector: app-split-bar
tags: [chart, bar, proportion, viz]
status: documented
---

# Split Bar (`app-split-bar`)

## Purpose

A horizontal bar showing two complementary proportions (e.g. agreed/rejected, pro/contra, group A/group B) that always sum to 100%, with a tick marker at the boundary and left/right-aligned percentage labels underneath, colored to match each side. Colors default to theme-adaptive semantic green (left) and red (right) but can be overridden.

## When to use

- Any two-way, complementary-proportion comparison that should read as a single compact bar rather than two separate stats.
- Vote/consent splits, binary demographic breakdowns, before/after ratios.

## When not to use

- More than two categories — not supported; use a different chart type.
- A single standalone progress value — use `app-circular-progress` or `app-stat-card` with `showProgress`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `leftValue` | `number` (required) | `0` | Left-side percentage (0-100); right side is `100 - leftValue`, clamped |
| `leftLabel` | `string` (required) | `''` | Label text under the left side |
| `rightLabel` | `string` (required) | `''` | Label text under the right side |
| `leftIcon` | `string?` | — | Optional PrimeIcon class before the left label |
| `rightIcon` | `string?` | — | Optional PrimeIcon class after the right label |
| `leftColor` | `string` | `'var(--semantic-green-fg)'` | CSS color for the left fill/label |
| `rightColor` | `string` | `'var(--semantic-red-fg)'` | CSS color for the right (background) fill/label |
| `ariaLabel` | `string?` | — | Accessible name for the progressbar; when omitted, a default combining both labels and rounded percentages is computed (e.g. "In favor 64%, Against 36%") |

No `@Output()`s. No content projection.

## Example

```html
<app-split-bar
  [leftValue]="64"
  leftLabel="In favor"
  rightLabel="Against"
  ariaLabel="Survey result: 64 percent in favor, 36 percent against">
</app-split-bar>
```

## Accessibility

- `role="progressbar"` with `aria-valuenow` (the left value), `aria-valuemin="0"`, `aria-valuemax="100"`.
- The `aria-label` defaults to a computed string combining both labels and their rounded percentages ("`leftLabel` X%, `rightLabel` Y%") when `ariaLabel` is not passed; pass `ariaLabel` explicitly to override it with a more descriptive name.
- The tick marker and icons are `aria-hidden`; the numeric percentages are visible text, not color-only.
- `prefers-reduced-motion` disables the fill/marker transition.
