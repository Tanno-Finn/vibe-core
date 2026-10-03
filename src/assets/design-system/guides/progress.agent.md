---
id: progress
title: Progress
category: library
tags: [loading, feedback, a11y]
summary: Say how much longer — a determinate bar when the work is countable, a spinner or an indeterminate strip when it is not.
related: [skeleton, button, feedback-messages]
covers: [progressbar, progressspinner, metergroup]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the value/fill gap, both modes, unit and content template, readout clipping, spinners, a metergroup
  usage: Indicator table with tree and reduced-motion columns, never fake the number, four Do/Don't pairs
  design: Anatomy, Aura token chains and contrast per theme, spinner color cycle, motion under reduce, sizing, narrow screens
  development: Inputs of both, host bindings, the invalid aria-level, naming, wiring, SSR, checklist, spec
  i18n: The four strings you ship, the unit concatenation trap, readout length, RTL
  history: Document changelog, one line per version
---

## When to use
- **Determinate `p-progressbar`** — the work is countable (bytes, rows, steps, files).
- **Indeterminate `p-progressbar`** — nothing to count, and the space is a strip.
- **`p-progressspinner`** — nothing to count, and the space is a block: a panel or an overlay.
- **`p-metergroup`** — a **level** made of parts, not a task moving to completion: context-window use, token shares, storage.

## When not to use
- The wait is short enough that the indicator flashes and vanishes → nothing.
- You can draw the incoming layout → `p-skeleton`.
- A level (battery, score) is not progress → `p-metergroup`, never a progressbar.
- You cannot name a numerator and a denominator → **not determinate**; a timer-driven value is a lie that stalls at 90%.

## Key API
`ProgressBarModule` (`@openng/optimus-ui/progressbar`), `ProgressSpinnerModule` (`…/progressspinner`), `MeterGroupModule` (`…/metergroup`), Optimus UI 2.0.2. No outputs on any. Three selectors each, camelCase included (`p-progressBar`, `p-progressSpinner`, `p-meterGroup`). `styleClass` is a `@deprecated` input on all three — write `class`.
- Bar: `value`, `mode` (`'determinate'` | `'indeterminate'`), `showValue` (**default `true`**), `unit` (default `'%'`, concatenated raw), `color` (inline background, bypasses the token), `valueStyleClass`, a `#content` template (value as `$implicit`, direct child, `:203-205`; `pTemplate="content"` binds too, `:206-208`). **No `ariaLabel` input.** Width from the parent; height `--p-progressbar-height` = 1.25rem (20px), readout 0.75rem.
- Spinner: `ariaLabel` (a real input), `strokeWidth` (`'2'`), `animationDuration` (`'2s'`), `fill`. 100px square until sized. **No determinate spinner:** five inputs, host binds `role="progressbar"` and a constant `aria-busy="true"`, never a value (`openng-optimus-ui-progressspinner.mjs:90`).
- Metergroup: `value: MeterItem[]` (`{ label, value, color, icon }`), `min` (0), `max` (100), `orientation`, `labelPosition` (`'start'` | `'end'`), `labelOrientation`; templates `#label`, `#meter`, `#start`, `#end`, `#icon`. No name input.

## Accessibility
- **`role="progressbar"` is always present** — static on the bar, host binding on the spinner. Spinner and indeterminate bar produce the **same** tree node (name, no value): the choice is visual.
- **Name it.** Bar and metergroup: `[attr.aria-label]` (renders everywhere; `[ariaLabel]` is a DOM-property binding, absent server-side). Spinner: the `ariaLabel` input.
- **`aria-valuenow` follows `value`**, dropped in indeterminate mode. Add `[attr.aria-valuetext]` when the percentage is not what the user needs ("18 of 40 sources").
- **Invalid attribute, still shipped:** the bar binds `[attr.aria-level]` to `value + unit` (`openng-optimus-ui-progressbar.mjs:136`, declared `:181`) — `aria-level="40%"`, indeterminate `"undefined%"`. `StripInvalidAriaDirective` removes it; standalone, so only where imported.
- **Metergroup is `role="meter"`** with `aria-valuemin`/`max` = `min`/`max` but `aria-valuenow` = the **total as a percent** (`openng-optimus-ui-metergroup.mjs:416-420`, `totalPercent()` `:303`). One value for the whole group: the parts exist only in the visible label list and in the colors — put the breakdown in `aria-valuetext`.
- **None is a live region.** Put completion in a `role="status"` region with an `.sr-only` sentence.
- **Motion:** neither progress stylesheet consults `prefers-reduced-motion`. The kit's global cap leaves the spinner a static arc and the **indeterminate bar an empty track.** Never its only feedback.

## Pitfalls
- `showValue` renders the readout **inside** the fill, which is `overflow: hidden`: a 200px bar at value 3 has 6px of fill for a 17px readout; a 4px track hides it at every value.
- The fill has `transition: width 1s ease-in-out` — `aria-valuenow` is final while the fill still travels.
- Aura's spinner cycles `{red|blue|green|yellow}.500` light / `.400` dark; green and yellow are under 3:1 on every light surface. **The kit already sets all four `--p-progressspinner-color-*` to `--primary-color-fg`** (`src/styles.scss`; CONTRAST.MD "progress spinner", 3.88:1+). Never override them with `--primary-color`, the darker dark-mode background role (under 3:1 on every dark section).
- `animationDuration` slows only the rotation; dash and color cycles keep 1.5s and 6s.
- Fill and readout follow the **accent** (`{primary.color}`; the dark ramp from `primaryFgDark`), gated in "progressbar & slider": fill vs track 3.78:1+, readout 5.18:1+. The radius follows the visual style (`{content.border.radius}`: 0 in `werkbund`).
- Metergroup with `min`/`max` other than 0/100: the `aria-valuenow` percent is announced against the raw range — keep 0/100 and scale the items.
- Metergroup items without `color` render **no segment background** (inline style only, `:296-302`); items with `value <= 0` render no segment (`:355`).
- Metergroup `labelPosition="start"` with `pTemplate="label"` renders **no labels** (`labelTemplate || labelTemplate`, `:335`) — use `#label`.
- Metergroup labels are hard-coded `label (NN%)` (`:120`): no locale number format — use `#label` for German or Easy Language.

## Sources
- WAI-ARIA 1.2 `progressbar`: https://www.w3.org/TR/wai-aria-1.2/#progressbar — required properties, why indeterminate omits `aria-valuenow`, where `aria-level` belongs.
- WAI-ARIA 1.2 `meter` / `aria-valuetext`: https://www.w3.org/TR/wai-aria-1.2/#meter — a level, not progress; when a number must become a sentence.
- APG Meter pattern: https://www.w3.org/WAI/ARIA/apg/patterns/meter/ — the level-vs-task line.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — 3:1 for fill vs track, spinner stroke, and meter segments.
- WCAG 2.2 SC 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html — the five-second ceiling indeterminate indicators break.
- Optimus UI: https://optimus.openng.org/progressbar , https://optimus.openng.org/progressspinner , https://optimus.openng.org/metergroup — vendor API, verified against the shipped source (2.0.2).

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Countable work | `p-progressbar [value]` + `[attr.aria-label]` (+ `[attr.aria-valuetext]`) |
| Unknown duration, in a strip | `mode="indeterminate"` + a caption or a spinner |
| Unknown duration, block of space | `p-progressspinner [ariaLabel]` |
| A level made of parts | `p-metergroup [value]` + `[attr.aria-label]` + `[attr.aria-valuetext]` |
| Number must stay legible | `[showValue]="false"` + your own label |

## Rules
- MUST: use determinate mode only for counted work, never for elapsed time.
- MUST: name every indicator — `[attr.aria-label]` on bar and metergroup, `ariaLabel` on the spinner.
- MUST: import `StripInvalidAriaDirective` in every component that imports `ProgressBarModule`.
- MUST: announce completion in a polite live region; the indicator does not do it.
- MUST: ship an error branch and an end for the wait.
- MUST: give every metergroup item a token `color`, keep `min` 0 / `max` 100, and state the parts in `aria-valuetext`.
- SHOULD: set `aria-valuetext` whenever the value is not a plain percentage.
- SHOULD: keep the number outside the bar, where it survives every value and language.
- SHOULD: verify reduced motion by emulating the media feature, above all for an indeterminate bar.
- NEVER: use the bar's `color` input for theming — it bypasses the token and the dark scheme.
- NEVER: re-scope the spinner stops the kit sets, least of all to `--primary-color`.
- NEVER: render one indicator per row of a collection.

## Default snippet
```html
<section role="status" [attr.aria-busy]="running() ? 'true' : null">
  @if (running()) {
    <div class="import-bar">
      <p-progressbar
        [value]="percent()"
        [showValue]="false"
        [attr.aria-label]="label()"
        [attr.aria-valuetext]="valuetext()" />
      <span class="import-bar__pct">{{ valuetext() }}</span>
    </div>
  } @else if (error()) {
    <p class="error">{{ errorLabel() }}</p>
  } @else {
    <span class="sr-only">{{ finished() }}</span>
  }
</section>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
