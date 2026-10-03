---
name: Circular Progress
selector: app-circular-progress
tags: [progress, chart, indicator]
status: documented
---

# Circular Progress (`app-circular-progress`)

## Purpose

A ring/donut progress indicator whose conic-gradient fill color is, by default, computed from the progress value itself — interpolated from red (0%) through orange and yellow to green (100%) — or forced to a fixed color via the `color` input, with the percentage printed in the center and glow/shadow intensity scaling with progress. The ring diameter is set by `size`. This is the `components/ui/` implementation that the design registry points at.

## When to use

- A single-metric circular progress display (score, completion percentage, health indicator) where the red-to-green color mapping itself is meant to communicate status at a glance.

## When not to use

- You need a linear bar rather than a ring — use `app-stat-card` with `showProgress`, or `app-split-bar` for a two-sided proportion.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `value` | `number` | `0` | Progress 0-100; clamped internally |
| `label` | `string` | `''` | Optional caption shown under the percentage |
| `size` | `'small'\|'medium'\|'large'` | `'medium'` | Sets the ring diameter: `small` 100px, `medium` 140px, `large` 180px (applied inline, so it overrides the responsive shrink) |
| `color` | `'green'\|'blue'\|'orange'\|'purple'?` | — (interpolated) | When set, forces a fixed ring/glow color (green/blue/orange/purple) regardless of value. When omitted (default), the color is interpolated from the value (red→orange→yellow→green) |

No `@Output()`s. No content projection — fully data-driven via `value`/`label`.

## Example

```html
<app-circular-progress [value]="72" label="Test coverage"></app-circular-progress>
```

## Accessibility

- `role="progressbar"` with `aria-valuenow`/`aria-valuemin="0"`/`aria-valuemax="100"` and an `aria-label` (defaults to `"Progress: {value} percent"` if `label` is empty).
- The visible percentage and label text are `aria-hidden="true"` — intentional, to avoid double-announcing the same information already in `aria-label`.
- The ring itself has `tabindex="0"` and a visible `:focus-visible` outline, so it's reachable via keyboard even though it isn't interactive.
- `prefers-reduced-motion` disables the hover-scale, box-shadow transition, and percentage fade-in animation.
