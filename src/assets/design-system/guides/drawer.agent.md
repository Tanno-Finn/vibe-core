---
id: drawer
title: Drawer
category: library
tags: [overlay, panel, a11y]
summary: A panel pinned to an edge of the screen — the container for a side surface the page behind must stay visible for, and the focus work the library leaves to you.
related: [dialog, popover, menubar, button]
covers: [drawer]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground over all five positions, a live focus journal, nav, detail with footer, sheet, headless
  usage: Container table against dialog, popover, confirmdialog, menubar, section, route; the edge table; Do/Don't
  design: Anatomy, Aura tokens and contrast per theme, geometry incl. borders per style, motion, the mask teardown, narrow screens
  development: Inputs with defaults, the two Escape paths, naming via pt, focus wiring, SSR, checklist, spec
  i18n: The two strings the library needs from you, header length, RTL, and the physical positions
  history: Document changelog
---

## When to use
- A wide side surface the page behind must stay visible for: filters beside results, a record beside its list, navigation off-canvas on mobile.
- Anchored to an edge and sized by you: `right` for detail, `left` for navigation, `bottom` for a sheet.

## When not to use
- It fits on the page → an inline `<section>`. Linkable or reloadable → a route; a drawer has no URL.
- Blocking sub-task, centered → `p-dialog`. "Are you sure?" → `p-confirmdialog`. Small, anchored to its trigger → `p-popover`.
- Primary navigation → `p-menubar` or a `<nav>` landmark; a drawer is where that *hides* on mobile.

## Key API
`DrawerModule` from `@openng/optimus-ui/drawer` (Optimus UI 2.0.2); content projected, no service.
- `[(visible)]` is a plain getter/setter pair, not a signal (openng-optimus-ui-drawer.mjs:274-282). `position`: `'left'` (default), `'right'`, `'top'`, `'bottom'`, `'full'`. `header` renders a `<div>`, never a heading.
- **`modal` (default `true`) is the master switch:** `dismissible` (`true`) and `blockScroll` (**`false`**) live inside its branch and do nothing without it.
- `closeOnEscape` (`true`) governs only the *document* Escape listener. `closable` (`true`) shows the close button, which `ariaCloseLabel` (no default) names — the only naming input.
- `appendTo` defaults to **`'self'`** — pass `"body"`. `style`/`styleClass` land on the panel; size belongs there. Also `maskStyle`, `autoZIndex`, `fullScreen`.
- `transitionOptions` is `@deprecated` and read by nothing (:263-268) — motion runs through `motionOptions` (:198). Outputs `visibleChange`, `onShow`, `onHide`; templates `#header`, `#footer`, `#content`, `#closeicon`, `#headless`.

## Accessibility
- **A landmark, not a dialog.** `role="complementary"` is static (:581); no `aria-modal`, no `ariaLabel`/`ariaLabelledBy` input, and `header` is a `<div>` nothing points at — the tree shows `complementary`, name `""`. An unset `ariaCloseLabel` leaves the icon-only close button unnamed.
- **Name it, and for a modal drawer re-role it, via `pt.root`** — Bind writes after the template's `role`, so `role: 'dialog'` there wins. Do **not** add `aria-modal`: nothing outside is made `inert`.
- **Focus neither enters nor returns.** `pFocusTrap` only installs two hidden sentinels (openng-optimus-ui-focustrap.mjs:47-66): focus stays on the trigger while Tab walks the page behind; closing never returns it to the opener. Move focus in on `(onShow)`, restore on `(onHide)` — kit helper `FocusReturn` in `src/app/utils/focus-return.ts`.
- Close button 40 x 40 px, the kit ring (2px `--primary-color-fg`); gated on the panel: ring ≥ 5.18:1, icon ≥ 5.21:1.

## Pitfalls
- **Escape has two paths.** The document listener (gated on `closeOnEscape`, :490-491, :511-520) calls `close()` and emits `onHide`; the container's `(keydown)` is gated on nothing and calls `hide(false)` (:406-410), which skips `onHide`, tears the mask down, and **leaves `visible` true**. `[autoZIndex]="false"` ends the same way.
- `dismissible` is read only when the mask is created.
- **The mask is removed in a bare `animationend` handler (:468-473).** Under `animation: none` it stays — full viewport, `pointer-events: auto`, every later click dead. Shorten durations, never remove them.
- A closed panel **can stay in the DOM at `display: none`**: assert `data-p-open`, never presence.
- Shipped sizes are 20rem (left/right) and 10rem (top/bottom) at every viewport: on a phone the panel is the viewport.
- **Border:** base `.p-drawer` sets `border-style: solid` with **no width**, so three edges compute to `medium` (3px); only the page-facing edge gets 1px. Each visual style's `html.style-<name>` block in `styles.scss` then outlines that page-facing edge per position (logical side, 1–3px `--style-outline`). Zero the screen edges on your `styleClass`. Radius is 0 in every style (no token).
- `position="full"` and `[fullScreen]="true"` are different rule sets: pick one. The mask always goes to `<body>` (:455).

## Sources
- APG Modal Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — the four clauses; this keeps 1.5.
- ARIA 1.2 `complementary`: https://www.w3.org/TR/wai-aria-1.2/#complementary — the shipped role, and why unnamed is useless.
- ARIA 1.2 `aria-modal`: https://www.w3.org/TR/wai-aria-1.2/#aria-modal — the promise that attribute makes about the page.
- WCAG 2.2 SC 2.4.3: https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — what the missing move-in and return fail.
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — the stranded mask.
- Optimus UI Drawer: https://optimus.openng.org/drawer — vendor API, checked against the shipped 2.0.2 source.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Side panel, page still readable | `position` + `[style]` size + `appendTo="body"` |
| Named landmark, or a dialog | `pt.root` with `aria-label`, plus `role: 'dialog'` when it blocks |

## Rules
- MUST: name the panel, via `pt.root` or a named region inside it.
- MUST: set width (or height) explicitly, viewport-relative with a cap.
- MUST: `appendTo="body"`; move focus in on `(onShow)`, return it on `(onHide)`.
- MUST: set and translate `ariaCloseLabel`, leave a way out that is neither Escape nor the mask, and put actions in `#footer`.
- SHOULD: `role="dialog"` via `pt.root` for a modal drawer, without `aria-modal`; keep `autoZIndex` on.
- NEVER: a drawer for content that must be linkable, crawlable, or reloadable.
- NEVER: `animation: none` on the overlay mask.

## Default snippet
```html
<!-- labels(): a computed() map from the translation service -->
<p-drawer
  [visible]="visible()" (visibleChange)="visible.set($event)"
  position="right" [modal]="true"
  [header]="labels().title" [ariaCloseLabel]="labels().close"
  appendTo="body" [style]="{ width: 'min(34rem, 100vw)' }"
  [pt]="{ root: { role: 'dialog', 'aria-label': labels().title } }"
  (onShow)="focusFirstControl()" (onHide)="closePanel()">
  <!-- content; focusFirstControl() focuses the first control here -->
  <ng-template #footer>
    <p-button [label]="labels().done" (onClick)="visible.set(false)" />
  </ng-template>
</p-drawer>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
