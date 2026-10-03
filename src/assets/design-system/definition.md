---
name: Definition
selector: app-definition
tags: [definition, box, didactic, glossary]
status: documented
---

# Definition (`app-definition`)

## Purpose

A term-explanation block built on `app-standard-container` that lets the reader toggle between two framings of the same concept — typically an intuitive "Analogy" and a precise "Definition" — via a select-button in the header. Each side can carry its own optional worked example. In print, both variants render stacked instead of only the active one.

## When to use

- Glossary-style term explanations that benefit from both an intuitive analogy and a formal definition.
- Any concept where showing two angles (e.g. "in plain terms" vs "technically") helps different readers.

## When not to use

- A single short inline gloss next to a control or label — use `app-info-tooltip`.
- A list of many terms in a sidebar — use `app-info-box` with `type: 'definitions'`.
- Content that doesn't need a toggle, just a static callout — use `app-example-box`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `title` | `string` (required) | — | Term/heading text |
| `icon` | `string` | `'pi pi-book'` | Header icon |
| `type` | `ContainerType` | `'definition'` | Underlying container accent color |
| `elevation` | `'none'\|'sm'\|'md'\|'lg'` | `'sm'` | Passed to the container |
| `firstOptionLabel` | `string?` | i18n `definition.analogy` | Label for the first toggle option |
| `secondOptionLabel` | `string?` | i18n `definition.definition` | Label for the second toggle option |
| `firstOptionContent` | `string` (required) | — | HTML content for the first option |
| `secondOptionContent` | `string` (required) | — | HTML content for the second option |
| `firstOptionExample` | `string?` | — | Optional worked-example HTML for the first option |
| `secondOptionExample` | `string?` | — | Optional worked-example HTML for the second option |
| `showExample` | `boolean` | `true` | Toggles the example sections |
| `collapsible` | `boolean` | `false` | Passed to the container |
| `initiallyExpanded` | `boolean` | `true` | Passed to the container |
| `headingLevel` | `2\|3\|4\|5\|6` | `3` | Heading tag for the title (WCAG 1.3.1) |

No `@Output()`s. No content projection — all content is passed as string inputs rendered via `[innerHTML]`.

## Example

```html
<app-definition
  title="Overfitting"
  firstOptionContent="Like memorizing exam answers instead of understanding the subject — you ace the practice test but fail on new questions."
  secondOptionContent="A model that fits the training data (including its noise) so closely that it generalizes poorly to unseen data.">
</app-definition>
```

## Accessibility

- `headingLevel` is caller-controlled so the term heading fits the surrounding document outline.
- The toggle `p-selectButton` carries a translated `aria-label` (`definition.toggleViewLabel`).
- `firstOptionContent`/`secondOptionContent`/example fields render via `[innerHTML]` — supply trusted/sanitized HTML.
- Print stylesheet renders both options stacked (with a labeled heading per option) so nothing is lost when the interactive toggle isn't usable.
