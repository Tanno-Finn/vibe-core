---
name: Standard Container
selector: app-standard-container
tags: [container, layout, surface]
status: documented
---

# Standard Container (`app-standard-container`)

## Purpose

The foundational card/section shell of the kit. It renders a bordered surface with an optional icon+title header, a content area, and an optional footer, in nine semantic color variants (`primary`, `secondary`, `success`, `warning`, `info`, `definition`, `demo`, `controls`, `danger`) that each map to a distinct accent color and default icon. It can be made collapsible (animated expand/collapse, a chevron disclosure button in the header; a mouse click anywhere else on the header toggles too) and auto-expands itself when the page loads with a URL fragment (`#id`) matching its host id. Several other registry components (`app-text-container`, `app-definition`, `app-quiz-container`) are built on top of it rather than duplicating this chrome.

## When to use

- Any content block that needs card-like chrome (border, padding, optional elevation) with a semantic color meaning (e.g. a warning box, a definition box, a demo panel).
- Sections that should be collapsible by the user, especially long pages where a header click should show/hide content.
- As the base when building a new didactic component that needs standard-container's header/content/footer structure instead of inventing new chrome.
- Deep-linkable sections (`/page#section-id`) that must force-expand when a user arrives via that fragment.

## When not to use

- Grid-of-cards layouts with icon/title/rating/chips/actions — use `app-generic-card` instead.
- A small, single-purpose color-coded callout (good/bad/info/warning one-liner) — `app-example-box` is lighter weight.
- A sidebar list of links/sources/definitions/books — use `app-info-box`.
- A metric/KPI tile — use `app-stat-card`.

## API

Single input object; no individual `@Input()`s beyond `config`.

| Input | Type | Default | Meaning |
|---|---|---|---|
| `config` | `ContainerConfig` | `{ type: 'secondary' }` | Full configuration object (below) |

`ContainerConfig` fields:

| Field | Type | Meaning |
|---|---|---|
| `type` | `'primary'\|'secondary'\|'success'\|'warning'\|'info'\|'definition'\|'demo'\|'controls'\|'danger'` | Drives accent color + default icon |
| `title` | `string?` | Static header title |
| `titleKey` | `string?` | i18n key for header title (wins over `title`) |
| `icon` | `string?` | PrimeIcon class override (defaults per `type`) |
| `size` | `'small'\|'medium'\|'large'\|'full'` | Legacy sizing hook; all variants render full width |
| `collapsible` | `boolean?` | Adds the disclosure button to the header (keyboard/AT) and makes the header's empty area a mouse toggle |
| `initiallyExpanded` | `boolean?` | Initial expand state when `collapsible` is true |
| `showFooter` | `boolean?` | Renders the `slot="footer"` projection when expanded |
| `customHeaderSlot` | `boolean?` | Replaces the built-in header with `slot="header"` projected content |
| `elevation` | `'none'\|'sm'\|'md'\|'lg'` | Box-shadow tier |
| `headingLevel` | `1\|2\|3\|4\|5\|6` | HTML heading tag for the title (WCAG 1.3.1 outline control) |

No `@Output()`s. Content projection: default `<ng-content>` renders in the content area; `[slot=header]` renders instead of the built-in header when `customHeaderSlot` is true; `[slot=footer]` renders in the footer when `showFooter` is true.

## Example

```html
<app-standard-container
  [config]="{
    type: 'info',
    title: 'Why gradient descent works',
    collapsible: true,
    initiallyExpanded: true,
    headingLevel: 2
  }">
  <p>Gradient descent follows the negative gradient of the loss function
  to iteratively reduce error.</p>
</app-standard-container>
```

## Accessibility

- When `collapsible`, the one keyboard/AT control is a real `<button type="button">` (the chevron) with `aria-expanded`, `aria-controls` pointing at the content region, and a stable accessible name (`ui.toggleSection` + `: <title>`). It is rendered for the built-in header **and** after a custom `slot="header"`, so a custom header is collapsible by keyboard too.
- The header itself carries **no** role and no `tabindex`; it only takes a mouse click as a convenience, and ignores clicks that land on an interactive element inside it (a button, link, input, anything with `tabindex`). So interactive content in a custom header, such as `app-text-container`'s info-tooltip buttons, stays reachable. (Until 2026-09-22 the whole header was `role="button"`, which flattened those inner buttons for screen readers: axe `nested-interactive`, A11Y-001.)
- Style hook: a collapsed header carries `.is-collapsed` (the signature blocks in `styles.scss` key on it). Do not key styles on `aria-expanded`, which now lives on the button.
- The collapsed content area gets `[attr.inert]` so it (and its focusable children) is removed from the tab order and AT tree while hidden.
- `headingLevel` lets the caller keep a correct document outline instead of always emitting an `h3`.
- Respects `prefers-reduced-motion` (disables the expand/collapse animation) and `prefers-contrast: high` (thicker border).
- Callers must still pick a `headingLevel` consistent with the surrounding page structure — the component does not infer nesting depth.
