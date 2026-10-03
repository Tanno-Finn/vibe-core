---
id: breadcrumb
title: Breadcrumb
category: library
tags: [navigation, a11y, hierarchy]
summary: A trail saying where the page sits in a hierarchy — the nav landmark the library already renders, the aria-current it already sets, and a last crumb that stays a tab stop with nowhere to go.
related: [menubar, tabs, ui-pattern-selection, a11y-guidelines]
covers: [breadcrumb]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground over model, home and separator, the rendered anatomy, a nine-crumb trail at 360px
  usage: Breadcrumb vs menubar vs stepper, the MenuItem field table, url vs routerLink, the kit's route-derived trail, Do/Don't
  design: Aura token chain, the kit's one focus ring, the 360px scroll statement, contrast
  development: The five inputs, aria-current and isCurrentPage, the last-crumb tab stop, naming the nav via pt
  i18n: The one library string, the icon-only home name, labels as a computed, RTL chevron mirroring
  history: Document changelog
---

## When to use
- The page sits at a known depth in a **hierarchy** and the reader needs its ancestors plus one click up.
- The trail is **short and stable**: two to five crumbs, the same chain for every reader of that URL.

## When not to use
- **Choosing where to go next** → `p-menubar`, or a `<nav>` of links. A breadcrumb answers *where am I*.
- **Progress through a task** → a stepper: steps are ordered and completable, ancestors are neither.
- **Browser history** — the trail states the URL's structure, never how the reader arrived.
- A flat site: one crumb states nothing.

## Key API
`BreadcrumbModule` from `@openng/optimus-ui/breadcrumb`. The **complete input list is five** (`openng-optimus-ui-breadcrumb.mjs:202`): `model: MenuItem[]`, `home: MenuItem`, `homeAriaLabel`, `style`, `styleClass` — plus the signal inputs `pt`, `ptOptions`, `dt`, `unstyled` from `BaseComponent` (`openng-optimus-ui-basecomponent.mjs:428`). One output, `onItemClick`.
- **No `ariaLabel`**, unlike `p-menubar`. The root `<nav>` (`:203`) is named only through `[pt]="{ root: { 'aria-label': '…' } }"`.
- The five are plain `@Input()`s: assign a **new array** (a `computed()`); mutating `model` in place does nothing under `OnPush` (`:387`).
- **`MenuItem` fields that act:** `label`, `url`, `routerLink` (plus the RouterLink inputs, `:349-354`), `icon`, `command`, `disabled`, `visible`, `target`, `title`, `tabindex`, `badge`, `escape`, `id`, style/class fields, `tooltipOptions`. **Inert:** `items`, `separator`, `expanded`, `tooltip`.
- **`url` renders an `href` (`:308`) and reloads the document**; `routerLink` navigates in-app (`:338`).
- `escape` defaults to escaping (`:324`). A `disabled` item cancels the click and emits nothing (`:132-150`).
- Templates `#item` (replaces the whole link, the library's `aria-current` with it) and `#separator`.
- **In this kit**, `app-breadcrumb` derives the trail from the routes: `routeBreadcrumbs()` (`src/app/components/shared/breadcrumb.component.ts`) over `routedPagesByPath()` (`src/app/utils/routed-pages.ts`) — group (`groupTitleKey`, no link), then the current page (`titleKey`, no link, `tabindex: '-1'`); one landmark named via `pt.root`; `[customBreadcrumbs]` for deeper trails.

## Accessibility
- **The library renders the landmark**: root `<nav>` (`:203`) around `<ol class="p-breadcrumb-list">` (`:204`). A second `<nav>` around it nests two landmarks for one meaning.
- **`aria-current="page"` is the library's job.** `isCurrentPage()` (`:190-200`) picks the **last item whose `visible !== false`**; the plain branch stamps `[attr.aria-current]` (`:316`), the router branch `[ariaCurrentWhenActive]` (`:355`), which lands only while that link is the active route. An `'aria-current'` key on a `MenuItem` does nothing.
- **The last crumb stays a focusable link with nowhere to go**: every item is an `<a>` with `tabindex` `… || '0'` (`:314`) and a `null` `href` without `url`. Give it `tabindex: '-1'` and no link target; `aria-current` still lands.
- Separators are `<li aria-hidden="true">` (`:285`, `:377`), projected `#separator` content included.
- Focus: the kit's one 2px `--primary-color-fg` ring replaces Aura's 1px one on `.p-breadcrumb-item-link` (CONTRAST.MD "focus ring", 3.88:1+).
- **Home's name** (`homeLinkAriaLabel`, `:125-131`): `homeAriaLabel`; else a visible `home.label`; else the config string `aria.home` (`'Home'`, `openng-optimus-ui-config.mjs:188`).

## Pitfalls
- **`p-menuitem-*` selectors are inert.** Live classes: `p-breadcrumb-list`, `-home-item`, `-separator`, `-item`, `-item-link`, `-item-icon`, `-item-label` (`:19-27`). Rules on `.p-menuitem-link`, `.p-menuitem-text`, `.p-menuitem-icon`, `.p-breadcrumb-home`, `.p-breadcrumb-chevron` paint nothing.
- **No truncation, no wrapping.** `flex-wrap: nowrap` (`@openng/optimus-ui-styles/dist/breadcrumb/index.mjs:14`) plus `overflow-x: auto` (`:5`), WebKit scrollbar hidden (`:28`): a long trail scrolls sideways, invisibly.
- `[home]="undefined"` equals omitting it: the home `<li>` (`:205`) and its separator (`:284`) both drop out.
- `ViewEncapsulation.None` (`:387`): a rule on `p-breadcrumb` hits every breadcrumb — scope it through `styleClass`.

## Sources
- W3C APG — Breadcrumb: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ — the `nav` + `aria-current` contract.
- WCAG 2.2 SC 2.4.8 Location: https://www.w3.org/WAI/WCAG22/Understanding/location.html — why the trail exists.
- WCAG 2.2 SC 2.4.3 Focus Order: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — the cost of the dead last-crumb tab stop.
- Optimus UI — Breadcrumb: https://optimus.openng.org/breadcrumb/ — vendor API, re-read against the 2.0.2 source.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Name the landmark | `[pt]="{ root: { 'aria-label': '…' } }"` |
| In-app ancestors | `routerLink`, never `url` |
| Current page | last item: no link target, `tabindex: '-1'` |
| Icon-only home | `home` with `icon` plus `homeAriaLabel` |
| No home root | omit `home` |
| Own separator | `<ng-template #separator>` |

## Rules
- MUST NOT wrap `p-breadcrumb` in a `<nav>`; name its own nav through `pt.root`.
- MUST rebuild `model` as a new array on every route or language change.
- MUST use `routerLink` for in-app crumbs; MUST name an icon-only home.
- MUST derive a site trail from the routes, never from a hand-written route-to-label map.
- SHOULD make the last crumb inert and keep the trail under about five crumbs.
- NEVER set `aria-current` on a `MenuItem`, nest `items`, or style the dead selectors above.

## Default snippet
```html
<!-- crumbs(): computed<MenuItem[]>() over the translation service; the last
     entry carries no link. homeCrumb(): { icon: 'pi pi-home', routerLink: '/' }. -->
<p-breadcrumb
  [model]="crumbs()"
  [home]="homeCrumb()"
  [homeAriaLabel]="labels().home"
  [pt]="{ root: { 'aria-label': labels().breadcrumbNav } }"
  styleClass="product-trail">
</p-breadcrumb>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
