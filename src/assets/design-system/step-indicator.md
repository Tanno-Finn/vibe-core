---
name: Step Indicator
selector: app-step-indicator
tags: [steps, progress, navigation, didactic]
status: documented
---

# Step Indicator (`app-step-indicator`)

## Purpose

A multi-step progress/tutorial indicator with three layouts (`horizontal`, `vertical`, `compact`), per-step status (`pending`/`active`/`completed`/`error`) rendered as a check, an X, a custom icon, or a step number, animated connector fills between steps, and optional click-to-navigate.

## When to use

- Multi-step tutorials, wizards, or onboarding flows with named, discrete stages.
- Visualizing a pipeline's stage-by-stage progress (e.g. data → train → evaluate → deploy).

## When not to use

- A simple linear reading-progress or single percentage — use `app-circular-progress` or a plain progress bar.
- A graded quiz's internal question progress — `app-quiz-container` already renders its own progress bar.
- A two-value comparison — use `app-split-bar`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `steps` | `StepItem[]` | `[]` | `{ id?, label/labelKey, description?/descriptionKey?, status (required), icon? }` |
| `layout` | `'horizontal'\|'vertical'\|'compact'` | `'horizontal'` | Visual arrangement |
| `showConnectors` | `boolean` | `true` | Renders the line between steps |
| `clickable` | `boolean` | `false` | Makes steps focusable/clickable and enables `stepClick` |
| `ariaLabel` | `string` | `'Progress steps'` | Accessible name for the list |

`StepItem.status`: `'pending' \| 'active' \| 'completed' \| 'error'`.

**Output:** `stepClick: EventEmitter<{ step: StepItem; index: number }>` — only emitted when `clickable` is `true`.

No content projection — steps are fully data-driven via `steps`.

## Example

```html
<app-step-indicator
  layout="horizontal"
  [steps]="[
    { label: 'Collect data', status: 'completed' },
    { label: 'Train model', status: 'active' },
    { label: 'Evaluate', status: 'pending' }
  ]">
</app-step-indicator>
```

## Accessibility

- The list uses `role="list"`/`role="listitem"` with `aria-label` on the container and `aria-current="step"` on the active item.
- When `clickable`, each step gets `tabindex="0"` plus Enter/Space handlers and a visible `:focus-visible` ring.
- Status is signaled by icon shape (check/X/number), not color alone.
- `prefers-reduced-motion` disables the pulse ring and connector-fill transitions.
- In `compact` layout the visible step labels/descriptions are omitted from the DOM, so each step carries a computed per-step `aria-label` (`"N. <label>"`, falling back to `"Step N"` when no label is set). Screen readers announce the step name/position even though it isn't shown visually. In `horizontal`/`vertical` layouts the visible label text serves this role and no `aria-label` is added.
