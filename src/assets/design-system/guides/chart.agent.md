---
id: chart
title: Chart
category: library
tags: [chart, canvas, a11y, bundle]
summary: A thin wrapper around a chart.js canvas the kit installs but never renders — 208 kB of dependency that has to stay lazy, a redraw that fires only when data or options change identity, and one opaque canvas that says nothing to a screen reader until a data table stands beside it.
related: [table, demo-layout, a11y-guidelines, color-system, ui-pattern-selection]
covers: [chart]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The emitted canvas anatomy, the figure-plus-table composition, and the rendered table fallback
  usage: Chart against table against a hand-drawn canvas, what passes through to chart.js, three Do/Don't pairs
  design: Series colors from kit tokens across four visual styles, the theme switch, sizing, and the narrow viewport
  development: The nine inputs, the reinit lifecycle, the measured bundle cost, and the keyboard gap
  i18n: Which strings the canvas carries, why a language switch needs new objects, and RTL
  history: Document changelog
---

## When to use
- A **numeric series whose shape is the message** — a trend, a distribution, parts of a whole — and exact figures are secondary.
- The dependency can arrive **lazily**: `chart.js` 4.5.1 and the wrapper are one `openng-optimus-ui-chart` chunk, 207.97 kB raw / 62.38 kB transfer (production build).
- The chart is **read-only**; point selection exists only under a pointer.

## When not to use
- **Exact values, or under about six data points** → a `<table>` (`table`).
- **A stage the reader manipulates** frame by frame → draw on a 2D context yourself, as `src/app/pages/example-demo/example-demo.component.ts` does.
- **One ratio or completion state** → `progress`.
- **Anything reachable from the app shell**, or a budgeted route — see Pitfalls. Never as decoration.

## Key API
`ChartModule`, or the standalone `UIChart`, from `@openng/optimus-ui/chart` (Optimus UI 2.0.2). **Nine own inputs** (`openng-optimus-ui-chart.mjs:192`): `type`, `data`, `options`, `plugins`, `width`, `height`, `responsive` (a `booleanAttribute`, default `true` at `:82`), `ariaLabel`, `ariaLabelledBy` — plus `pt`, `ptOptions`, `dt`, `unstyled` from `BaseComponent`. One output, `onDataSelect`.
- **`data` and `options` are getter/setter pairs** (`:97-114`); each setter calls `reinit()` (`:178-183`): destroy, then `initChart()`. **Identity must change:** pushing into `data.datasets[0].data` redraws nothing. Before the first draw (`onAfterViewInit`, `:131-134`) `reinit()` is a no-op (`:179`).
- `initChart()` (`:144-161`) runs only under `isPlatformBrowser` (`:145`), outside the zone (`:152`).
- Methods: `refresh()` → `chart.update()` (`:173-177`), `getCanvas()` (`:162`), `getBase64Image()` (`:165`).
- `type`, `plugins`, and `options` reach `new Chart(...)` unchanged (`:153-158`): Chart.js options are the real API.

## Accessibility
- The component **is one `<canvas role="img">`** with `[attr.aria-label]` and `[attr.aria-labelledby]` (`:193-201`) and **nothing between the canvas tags**, where HTML puts fallback content. Assistive technology sees one opaque node: a name, no structure.
- **SC 1.1.1 asks for an equivalent, not a label.** `ariaLabel` names it; the numbers still have to arrive as text: a `<figure>` with a `<figcaption>`, and a real `<table>` of the same rows beside it, visible or in a `<details>`.
- **There is no keyboard path.** `onCanvasClick` (`:135-143`) is bound to `(click)` only; no `tabindex`, no key handler, so `onDataSelect` needs a pointer. Give anything a click triggers a DOM control too.
- **Color alone must not carry meaning (SC 1.4.1):** give each series `pointStyle`, `borderDash`, or a direct label, and name it in legend and table.
- The kit's reduced-motion catch-all is CSS only (`a11y-guidelines`); Chart.js animates in JavaScript — read `prefers-reduced-motion` and pass `options.animation: false`.

## Pitfalls
- **`generateLegend()` (`:168-172`) throws.** It forwards to `chart.generateLegend()`, dropped in Chart.js v3 and undefined in 4.5.1. Use `options.plugins.legend`.
- **The component mutates your `options`:** it writes `responsive` (`:147`) and, with `width` or `height` set, `maintainAspectRatio = false` (`:149-151`). Never share one options object between charts.
- **A theme or style switch does not repaint:** a color string never consults CSS. Rebuild `options`, and `data` for series colors, as new objects.
- **A static import costs the initial bundle.** `chart.js/auto` (`:4`) runs `Chart.register(...registerables)` at module scope and is in `chart.js`'s own `sideEffects`: never tree-shaken. Reach it from a lazy route or a dynamic `import()`, as `src/app/shared/optimus-prebundle.ts` does behind `isDevMode()`.
- **Prerendering draws nothing.** `initChart` is browser-guarded (`:145`), so server-rendered markup carries an empty canvas.

## Sources
- WCAG 2.2 SC 1.1.1 Non-text Content: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html — a text alternative serving the equivalent purpose; a short name is not one.
- WCAG 2.2 SC 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — why a series needs a second carrier.
- WCAG 2.2 SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 a graphical object owes its ground.
- HTML Standard, the canvas element: https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element — the fallback content this template omits.
- Optimus UI Chart: https://optimus.openng.org/chart/ — vendor API, re-read against the 2.0.2 source.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Name the graphic | `[ariaLabel]`, or `[ariaLabelledBy]` pointing at the `figcaption` |
| The text alternative | a `<table>` you write — the component offers no route for one |
| Redraw after a change | assign a **new** `data` or `options` object |
| Update in place | `refresh()` on a `@ViewChild(UIChart)` |
| Fixed box | `[width]` / `[height]` — which sets `maintainAspectRatio: false` for you |
| Fluid box | leave both unset, size the parent, keep `responsive` |
| Legend | `options.plugins.legend` — never `generateLegend()` |

## Rules
- MUST: name the graphic (`ariaLabel`/`ariaLabelledBy`) and pair it with a `<table>` carrying the numbers.
- MUST: reach `@openng/optimus-ui/chart` only from a lazy route or a dynamic `import()`.
- MUST: assign new `data` and `options` objects; in-place mutation never redraws.
- MUST: give every series a carrier besides color, colored from kit tokens (`color-system`).
- SHOULD: rebuild `options` on a theme or visual-style switch, and pass `animation: false` under `prefers-reduced-motion`.
- SHOULD: offer a DOM control for anything `onDataSelect` triggers.
- NEVER: call `generateLegend()`, share one `options` object, or chart what a table answers.

## Default snippet
```html
<!-- Caption names it, table carries it; chartData()/chartOptions() are
     computeds over language and theme, so a switch yields NEW objects. -->
<figure class="revenue">
  <figcaption id="revenue-cap">Revenue per quarter, 2025</figcaption>
  <p-chart type="bar" [data]="chartData()" [options]="chartOptions()"
           ariaLabelledBy="revenue-cap"></p-chart>
  <details>
    <summary>Data table</summary>
    <!-- the same rows the chart draws, as a real table -->
  </details>
</figure>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
