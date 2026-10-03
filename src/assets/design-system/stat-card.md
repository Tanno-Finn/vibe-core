---
name: Stat Card
selector: app-stat-card
tags: [card, stat, metric, kpi]
status: documented
---

# Stat Card (`app-stat-card`)

## Purpose

A metric/KPI display card with four visual variants (`default`, `gradient`, `outlined`, `minimal`), an optional icon, an optional up/down trend badge with a value, an optional linear progress bar, and `compact`/`highlighted` modifiers. Value formatting supports a prefix, suffix, and fixed decimal places.

## When to use

- Dashboards, algorithm-run statistics, or "N correct out of M" summaries.
- A row of KPI tiles where each tile needs its own accent color (`color` input) and optional trend indicator.

## When not to use

- A ring/donut-style single progress metric — use `app-circular-progress`.
- A two-part proportion comparison (e.g. agree/disagree) — use `app-split-bar`.
- A card needing header actions, chips, or a custom footer — use `app-generic-card`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `label` / `labelKey` | `string?` | — | Stat name/description under the value |
| `value` | `number\|string` | `0` | The headline value; strings are shown as-is, numbers go through `decimals`/`toLocaleString` |
| `description` / `descriptionKey` | `string?` | — | Extra caption below the label |
| `icon` | `string?` | — | Icon class shown in the corner |
| `color` | `'primary'\|'blue'\|'green'\|'orange'\|'purple'\|'teal'\|'red'` | `'primary'` | Accent color for icon, progress fill, and gradient variant |
| `variant` | `'default'\|'gradient'\|'outlined'\|'minimal'` | `'default'` | Visual style |
| `trend` | `'up'\|'down'\|'neutral'?` | — | Shows an arrow badge; `'neutral'` renders nothing |
| `trendValue` | `string?` | — | Optional value shown next to the trend arrow |
| `prefix` / `suffix` | `string` | `''` | Wraps the formatted value |
| `decimals` | `number` | `0` | Fixed decimal places for numeric values |
| `highlighted` | `boolean` | `false` | Adds a primary-color outline ring |
| `compact` | `boolean` | `false` | Smaller padding/value font |
| `showProgress` | `boolean` | `false` | Renders a linear progress bar below the stat |
| `progressValue` | `number` | `0` | Progress bar fill percentage (0-100) |
| `progressLabel` | `string?` | — | Text shown to the right of the progress bar |

No `@Output()`s. No content projection — fully data-driven.

## Example

```html
<app-stat-card
  label="Quiz accuracy"
  [value]="87"
  suffix="%"
  icon="pi pi-check-circle"
  color="green"
  trend="up"
  trendValue="+5%">
</app-stat-card>
```

## Accessibility

- The trend arrow icon is paired with a visually-hidden (`sr-only`) translated label (`stat.trendUp`/`stat.trendDown`), so its meaning isn't color-or-icon-only for screen readers.
- The optional progress bar has `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` and an `aria-label` derived from the stat's label.
- The `gradient` variant forces white text with a text-shadow to keep contrast on colored backgrounds.
- `prefers-reduced-motion` disables hover/transition/progress-fill animations.
