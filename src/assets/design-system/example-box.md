---
name: Example Box
selector: app-example-box
tags: [box, example, didactic]
status: documented
---

# Example Box (`app-example-box`)

## Purpose

A lightweight, color-coded callout box for a single example, comparison side, or short note. Five semantic types (`neutral`, `good`, `bad`, `info`, `warning`) each get a distinct left-border accent, tint, auto icon, and label styling. Supports a small uppercase label chip (e.g. "Before"/"After"), an optional title, plain-text or `<code>`-formatted content, and an optional "result" caption below.

## When to use

- Good/bad prompt or code comparisons ("Bad prompt" vs "Good prompt").
- Before/after pairs using the `label`/`labelKey` chip to distinguish sides.
- Any small, single-purpose colored callout that doesn't need full container chrome (collapse, footer, elevation).

## When not to use

- A sidebar list of multiple items (links, sources, books) — use `app-info-box`.
- A tagged/structured prompt framework display (e.g. RACE) with a copy button — use `app-prompt-example`.
- Content needing a collapsible header or footer slot — use `app-standard-container`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `type` | `'neutral'\|'good'\|'bad'\|'info'\|'warning'` | `'neutral'` | Drives border color, tint, and default icon |
| `title` / `titleKey` | `string` | `''` | Optional title line (icon + text); `titleKey` wins if both set |
| `content` / `contentKey` | `string` | `''` | Body text, used only when no content is projected |
| `label` / `labelKey` | `string` | `''` | Small uppercase chip (e.g. "Before") |
| `result` / `resultKey` | `string` | `''` | Optional caption below the content, separated by a dashed rule |
| `icon` | `string` | `''` | Overrides the type's default icon |
| `codeMode` | `boolean` | `false` | Renders `content`/`contentKey` inside a `<code>` block |

No `@Output()`s. Content projection: default `<ng-content>` renders alongside `content`/`contentKey` inside `.example-content` — use it for custom markup (e.g. a `<code>` block) instead of the string inputs.

## Example

```html
<app-example-box type="good" label="Good prompt" [codeMode]="true"
  content="Explain backpropagation to a beginner using a step-by-step analogy.">
</app-example-box>
```

## Accessibility

- The box has `role="region"` with `aria-label` set to the resolved title (when present).
- Type is signaled by both color (border/tint) and an icon/label text, not color alone.
- The auto/decorative `<i>` icon in the title row carries `aria-hidden="true"`, so screen readers skip the icon font glyph and announce only the title text.
- Respects reflow (WCAG 1.4.10) at a narrow width of its own column, not the window: the host is a query container (`container-type: inline-size`, `@container (max-width: 480px)`). Print styles too.
