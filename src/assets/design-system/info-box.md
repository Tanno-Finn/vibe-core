---
name: Info Box
selector: app-info-box
tags: [callout, box, info, didactic]
status: documented
---

# Info Box (`app-info-box`)

## Purpose

A single, unified renderer for sidebar reference cards. It supports five content shapes through one `type` field — `books` (cover image + title + author + buy/view link), `links` (external link list with an "external" arrow), `sources`/`references` (numbered, academic-style citation list), `definitions`/`definition` (term list), and `info` (free-form title+description items) — so that pages needing a sidebar card don't each reimplement the visual chrome and risk drifting apart.

## When to use

- A sidebar or aside card listing recommended books, external links, academic sources, or term definitions.
- Any place that previously duplicated ad-hoc sidebar-card markup — route it through the shared `type` variants instead.

## When not to use

- A single inline example or good/bad callout — use `app-example-box`.
- A single term with a toggleable analogy/definition pair — use `app-definition`.
- Long-form article body content — use `app-text-container`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `box` | `InfoBoxData` (required) | — | `{ type, title, content?, items? }` — fully data-driven, no template slots |
| `viewLabel` | `string` | `'View'` | Label for the "view" link on `books` items; pass a localized string |

`InfoBoxData.type`: `'books' \| 'links' \| 'sources' \| 'references' \| 'definitions' \| 'definition' \| 'info' \| string`. `references` is normalized to `sources`, `definition` to `definitions`.

`InfoBoxItem`: `{ title?, description?, url?, author?, year?, image? }`.

No `@Output()`s. No content projection — everything renders from `box`.

## Example

```html
<app-info-box
  [box]="{
    type: 'sources',
    title: 'Sources',
    items: [
      { title: 'Attention Is All You Need', author: 'Vaswani et al.', year: 2017, url: 'https://arxiv.org/abs/1706.03762' }
    ]
  }">
</app-info-box>
```

## Accessibility

- `box.content` (the optional intro paragraph) is rendered via `[innerHTML]` — supply trusted/sanitized HTML.
- Item titles/descriptions are plain text interpolation (auto-escaped).
- External links (`http…`) get `target="_blank"`, `rel="noopener noreferrer"`, and a visible "↗" glyph so the affordance isn't color-only; internal links (`/…`) stay in the same tab with no extra marker.
- `sources`/`references` render as a semantic numbered `<ol>` so screen readers announce citation numbers.
- Decorative title-bar icons carry `aria-hidden="true"`.
