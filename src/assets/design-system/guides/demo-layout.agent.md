---
id: demo-layout
title: Demo Layout
category: layouts
tags: [layout, demo, canvas, controls]
summary: A demo is a page built from the kit blueprint, not a template — the stage comes before the controls in the document, the two-column switch queries the width of the demo itself rather than the viewport, and one live region announces discrete changes.
related: [article-layout, ui-pattern-selection, a11y-guidelines, design-tokens, i18n-localization, hub-layout]
covers: []
measured-against: '@angular/core@22.1.4'
tabs:
  examples: The blueprint page in the order it renders, the column switch shown at two widths, and the two shapes a demo ships as
  usage: The parts in document order, where a demo is registered, and three Do/Don't pairs
  design: The column switch declaration by declaration, the two grounds with their measured text pairs, the narrow-screen rule, one deleted API
  development: The blueprint's interactive core as a recipe, checks that need no browser, and an acceptance checklist
  i18n: How the blueprint resolves its strings, which strings the layout does not own, and where longer labels push
  history: Document changelog, one line per version
---

## When to use
- Building an interactive demo — a stage the reader manipulates through controls.
- Placing controls relative to the stage, and what moves when space narrows.
- Giving a demo its own route, or embedding a configured widget in an article.
- Reviewing a demo with its own frame or breakpoint.

## When not to use
- The page around prose — `h1`, toolbar, appended footers — `article-layout`.
- Choosing WHICH control answers a need — `ui-pattern-selection`.
- Focus order, canvas keyboard access, accessible names, announcements — `a11y-guidelines`.
- Token values, container widths, the spacing scale — `design-tokens`.
- Key naming, namespaces, and simplified variants — `i18n-localization`.

## Key API
No demo page template exists. The blueprint is `src/app/pages/example-demo/example-demo.component.ts`: copy it. Its order is `app-article` → `app-page-header` (the one `h1`) → an intro `app-example-box` → the interactive core in an `app-standard-container` (`type: 'demo'`, `headingLevel: 2`) → explainer, `app-checkpoint`, takeaways → `app-demo-related`.

The core is a lead paragraph and one grid: the **stage** first (a `canvas role="img"` with an `aria-label`, plus a forced-colors text summary), the **panel** second (labeled controls, then the buttons, then an `sr-only` live region). The component `:host` declares `container-type: inline-size`, and `@container (min-width: 700px)` turns the grid into `minmax(0, 1.3fr) minmax(15rem, 1fr)`. The panel carries its `--surface-section` ground, border, and padding at every width.

A widget an article embeds declares `config = input.required<XConfig>()` and draws no page frame: the article section supplies heading and context.

A routed demo is registered twice: an `ExtendedRoute` in `src/app/app.routes.ts` and a `DemoMeta` in `src/assets/data/core/demos/index.json`. `DemoMeta` requires `id, path, titleKey, descriptionKey, category, estimatedTime, difficulty, featured, icon, pageId`; `tags`, `related`, `publishDate`, and `mystery` are optional. Grid, hub, and release guard read that JSON; an unregistered path is let through ungated (`src/app/guards/demo-release.guard.ts` warns in dev).

## Accessibility
- The core sits under the container's `h2`; a sub-heading inside it is an `h3`.
- The canvas is `role="img"` with a translated `aria-label`; a text summary becomes visible under `forced-colors: active`, and its `aria-live` is `off` while the animation runs.
- The panel's `<p class="sr-only" aria-live="polite" aria-atomic="true">` is written on discrete changes only, never per frame.
- Every control has a visible label; a `p-select` is named through `[ariaLabelledBy]`, not a host attribute.
- Reduced motion disables the run control, and a note says so.
- `.sr-only` is global and every declaration carries `!important`: a component-local copy cannot win.

## Pitfalls
- **A viewport media query for the column switch.** A demo is mounted at several widths; query the container.
- **A local `.sr-only` rule.** It cannot win; adding `!important` is the wrong fix.
- **The layout API once named after this pattern.** `demo-layout()` and `--layout-demo-left/right/gap` were deleted from `src/styles/design-tokens.scss`; in older material they are not the shipped pattern.
- **A stage wider than the container.** The standard container clips its content box (`overflow: hidden` on the collapse wrapper): give the stage `width: 100%` and an `aspect-ratio`, a wide table its own `overflow-x: auto`.
- **Expecting a related-content footer for free.** A demo page mounts `app-demo-related` itself or has none.

## Sources
- CSS Containment Level 3: https://www.w3.org/TR/css-contain-3/ — `container-type: inline-size` establishes a query container on the inline axis; `@container` resolves against the nearest one.
- CSS Cascading Level 4: https://www.w3.org/TR/css-cascade-4/ — an important declaration beats a normal one.
- CSS Overflow Level 3: https://www.w3.org/TR/css-overflow-3/ — `hidden` clips to the padding box and offers no scrolling interface.
- WCAG 2.2 SC 4.1.3: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — a status message must reach the user "without receiving focus".
- `src/app/pages/example-demo/` — the blueprint, the one routed demo page.

## Semantic mapping
| Intent | Where it goes |
| --- | --- |
| Page title and subtitle | `app-page-header`, the one `h1` |
| The demo section | `app-standard-container`, `type: 'demo'`, `headingLevel: 2` |
| The thing being manipulated | the stage, first in the grid |
| Sliders, selects, buttons | the panel, second in the grid |
| Announcing a state change | the panel's `sr-only` live region |
| Restoring the starting state | one reset control, labeled by what it restores |

## Rules
- MUST: put the stage before the panel in the document.
- MUST: switch to two columns with `@container`, on a host declaring `container-type: inline-size`.
- MUST: name the canvas (`role="img"` + `aria-label`) and give it a text summary for forced colors.
- MUST: keep one `sr-only` `aria-live="polite"` region in the panel, and ship one reset control whose label names what it restores.
- MUST: register a routed demo in `app.routes.ts` AND `demos/index.json`.
- SHOULD: keep the panel column at a `15rem` floor, the stage the larger fraction.
- NEVER: switch this layout on the viewport width, or redeclare `.sr-only` in a component stylesheet.

## Default snippet
```html
<app-standard-container id="demo"
  [config]="{ titleKey: 'myDemo.demo.title', type: 'demo', headingLevel: 2 }">
  <div class="demo-layout">
    <div class="stage">
      <canvas #canvas class="demo-canvas" role="img"
              [attr.aria-label]="translate('myDemo.demo.canvasAria')"></canvas>
    </div>
    <div class="controls-panel">
      <p-button [label]="translate('myDemo.controls.reset')" icon="pi pi-refresh"
                styleClass="btn-mobile-full" (onClick)="reset()" />
      <p class="sr-only" aria-live="polite" aria-atomic="true">{{ statusMessage() }}</p>
    </div>
  </div>
</app-standard-container>
```
```css
:host { display: block; container-type: inline-size; }
.demo-layout { display: grid; grid-template-columns: 1fr; gap: var(--space-4); align-items: start; }
@container (min-width: 700px) {
  .demo-layout { grid-template-columns: minmax(0, 1.3fr) minmax(15rem, 1fr); }
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
