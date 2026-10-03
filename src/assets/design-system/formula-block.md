---
name: Formula Block
selector: app-formula-block
tags: [math, formula, didactic]
status: documented
---

# Formula Block (`app-formula-block`)

## Purpose

A block-level `<figure>` for displaying mathematical formulas using system math fonts (Cambria Math / STIX Two Math / Noto Sans Math, with Georgia/serif fallback) and plain HTML (`<sub>`/`<sup>`, Unicode math symbols) — no external dependency like KaTeX or MathJax. Intended for math-heavy articles (e.g. linear algebra, calculus).

## When to use

- Displaying a standalone formula with an optional caption/label, in a math or algorithm-explainer article.
- Content authored with Unicode math symbols plus `<sub>`/`<sup>` tags (optionally nesting other didactic math components like a fraction block).

## When not to use

- Inline formulas within a sentence — this component renders block-level `<figure>` semantics; keep short inline math as plain text with `<sub>`/`<sup>`.
- General code or prompt snippets — use `app-prompt-example`.
- Formulas that need full MathML/screen-reader-readable math semantics — this component has no such support (see Accessibility).

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `label` | `string?` | — | Static caption shown above the formula |
| `labelKey` | `string?` | — | i18n key for the caption (wins over `label`) |
| `ariaLabel` | `string?` | — | Overrides the figure's `aria-label` (falls back to `label`) |

No `@Output()`s. Content projection: default `<ng-content>` holds the formula markup itself.

## Example

```html
<app-formula-block label="Gradient Descent Update">
  w<sub>new</sub> = w<sub>old</sub> &minus; &eta; &middot; &nabla;L(w)
</app-formula-block>
```

## Accessibility

- Wraps content in `<figure role="math">` with `aria-label` set to `ariaLabel || label`; a `<figcaption>` renders the visible label.
- The formula content wrapper has `tabindex="0"` so it can be scrolled into view / receive keyboard focus when the block is narrow (its own width at most 768px, an `@container` rule on the host) and becomes horizontally scrollable.
- The formula itself is rendered as visual Unicode + `<sub>`/`<sup>`, not MathML — screen readers only get the `aria-label` summary, not a spoken rendition of the formula, so authors should keep `label`/`ariaLabel` descriptive of what the formula computes.
- `page-break-inside: avoid` in print so formulas aren't split across pages.
