---
name: Breadcrumb
selector: app-breadcrumb
tags: [navigation, breadcrumb, wayfinding]
status: documented
---

# Breadcrumb (`app-breadcrumb`)

## Purpose

A route-aware breadcrumb trail (Optimus UI `p-breadcrumb`) that maps the current URL to a translated list of ancestor links, with a "home" root item, the current page as the last entry (`aria-current="page"`, not a link), and a public API (`setBreadcrumbs`, `addBreadcrumb`, `removeBreadcrumb`, `clearBreadcrumbs`) for programmatic control. It re-renders on route change and on language change.

## When to use

- Multi-level routed pages where showing the ancestor path helps orientation (topic → sub-topic → detail).
- Pages that need a deeper trail than *group → page* — pass `[customBreadcrumbs]` explicitly instead of relying on auto-detection.

## When not to use

- Single-level/top-level pages — the component renders nothing (`@if (breadcrumbItems.length > 1)`) when there is only the home item, so adding it to shallow pages has no visible effect.
- Step-by-step process navigation (wizard, tutorial) — use `app-step-indicator` instead, breadcrumbs communicate hierarchy, not sequence.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `customBreadcrumbs` | `BreadcrumbItem[]?` | — | Explicit trail; overrides the trail derived from the current route |
| `showHome` | `boolean` | `true` | Shows the leading home (root) item; set `false` to render the trail without it |

The former `generateStructuredData` input and its stubbed `generateBreadcrumbStructuredData()` method (schema.org BreadcrumbList) have been **removed** — they were a never-wired portal SEO leftover (the `metaSeoService` call was commented-out TODO). Breadcrumbs no longer emit structured data.

`BreadcrumbItem`: `{ label: string; url?: string; translateKey?: string; icon?: string }`. The last item is always rendered as the current page, so its `url` is ignored; an item without a `url` renders as plain text.

No `@Output()`s. No content projection. Public methods (call via `@ViewChild`): `setBreadcrumbs()`, `addBreadcrumb()`, `removeBreadcrumb()`, `clearBreadcrumbs()`.

## Example

```html
<app-breadcrumb
  [customBreadcrumbs]="[
    { label: 'Guides', url: '/guides' },
    { label: 'Neural Networks', url: '/guides/neural-networks' }
  ]">
</app-breadcrumb>
```

## Accessibility

- One navigation landmark: `p-breadcrumb` renders its own `<nav>`, and the component labels it (`app.nav.breadcrumb`) through the pass-through (`[pt]="{ root: { 'aria-label': … } }"`) instead of wrapping it in a second `<nav>`.
- The last item is the current page: `p-breadcrumb` sets `aria-current="page"` on it (the last visible model item), and the component gives it no link and `tabindex="-1"` — it does not link to itself and is no tab stop. Styled as text (`--text-color`, semibold).
- An item without a `url` (the route group in a derived trail) is text too: no `href`, `tabindex="-1"`, so it is not a dead tab stop. Items with a `url` are router links in `--primary-color-fg`, underlined on hover.
- Hidden entirely in print (`@media print { app-breadcrumb { display: none } }` — the component is unencapsulated, so the rule names the element).
- Covered by `src/app/components/shared/breadcrumb.component.spec.ts` (landmark count, current page, no dead tab stop), rendered against the real `p-breadcrumb`.
- Without `[customBreadcrumbs]` the trail is derived from the live router config (`routeBreadcrumbs()`): the route's group (`groupTitleKey`, not linked) followed by the page (`titleKey`, linked). There is no hand-written route map, so the trail can only name a route that exists; home and unrouted paths yield no trail. `src/app/app.routes.maps.spec.ts` holds the remaining literal paths against `app.routes.ts`.
