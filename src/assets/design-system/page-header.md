---
name: Page Header
selector: app-page-header
tags: [header, layout, title]
status: documented
---

# Page Header (`app-page-header`)

## Purpose

The top-of-page title block: a centered `<h1>` with a gradient text fill, a short decorative gradient bar underneath, and an optional subtitle. It is deliberately self-isolating in CSS (resets `text-align` and owns its own spacing) so it renders consistently regardless of the parent page's styles.

## When to use

- The single `<h1>` at the top of every routed page.
- Pages that want a subtitle line directly under the title (static text or an i18n key).
- Anywhere extra header content (e.g. meta chips, breadcrumbs) needs to sit directly below the title/bar/subtitle — pass it as projected content.

## When not to use

- Section or card headings within a page — use `app-standard-container`'s own header (`config.title` + `headingLevel`) or `app-generic-card`'s `title`, so the page keeps exactly one `<h1>`.
- More than one per page — a page must have a single `<h1>`; using this component twice breaks that invariant.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `title` | `string?` | — | Static title text |
| `titleKey` | `string?` | — | i18n key for the title (wins over `title` when set) |
| `subtitle` | `string?` | — | Static subtitle text |
| `subtitleKey` | `string?` | — | i18n key for the subtitle (wins over `subtitle` when set) |

No `@Output()`s. Content projection: default `<ng-content>` renders after the subtitle, inside `.ph-content`.

## Example

```html
<app-page-header
  title="Neural Networks"
  subtitle="From perceptrons to deep learning">
</app-page-header>
```

## Accessibility

- Renders a literal `<h1>` — do not pair with another `<h1>` on the same page.
- The gradient text uses the "icon-fg" (3:1) token tier rather than the stricter 4.5:1 body-text tier, which is correct because large (`clamp(1.75rem, 4vw, 2.25rem)`) bold text only requires 3:1 contrast under WCAG 1.4.3 ("Large Text").
- The decorative gradient bar has `aria-hidden="true"`.
- Text color and title both react to the active theme's `--primary-color`/`--gradient-accent-color` tokens automatically.
