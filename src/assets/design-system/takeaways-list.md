---
name: Takeaways List
selector: app-takeaways-list
tags: [list, summary, didactic]
status: documented
---

# Takeaways List (`app-takeaways-list`)

## Purpose

Renders a numbered "key takeaways" block by parsing a single translation string that already uses a lightweight markdown convention — `1. **Title**: text\n\n2. **Title** — text...` — into a proper `<ol>` with bold titles. It exists because interpolating that string directly (`{{ text }}`) would show literal asterisks; parsing it once here keeps the translation files untouched and reusable across articles/languages.

## When to use

- Rendering a "Kernaussagen"/"key takeaways" summary from a translation string that follows the numbered-bold-title markdown pattern.
- Any translated closing-summary text block that mixes numbered bold-title items with an optional trailing closing paragraph.

## When not to use

- You already have structured data (an array of `{title, text}` objects) rather than a markdown string — just render a plain `<ol>` directly.
- The list needs per-item completion tracking — use `app-checkpoint` instead.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `text` | `string` (setter-based) | — | The raw translation string to parse |

No `@Output()`s. No content projection — output is derived entirely from `text`.

Parsing rules: a new item starts at a line matching `^\d+\.`; a `**bold**` right after the number becomes the item's title, the rest becomes its text; plain numbered lines with no bold become title-less items; any block that doesn't match a numbered pattern is collected into a trailing `closing` paragraph.

## Example

```html
<app-takeaways-list
  text="1. **Bias-variance tradeoff**: more model capacity reduces bias but increases variance.

2. **Regularization**: penalizing large weights helps control variance.

In short, model complexity is a dial, not a switch.">
</app-takeaways-list>
```

## Accessibility

- Renders a semantic `<ol>`/`<li>` list, so screen readers announce item numbers automatically (no manual "1." text needed in the source string).
- Titles and body text both go through the `appHighlight` directive (glossary-term highlighting) — accessibility of highlighted terms depends on that directive's own behavior.
- If the source string doesn't match the expected numbered-bold pattern at all, the whole block silently falls back to the `closing` paragraph — verify translated strings still follow the convention after edits.
