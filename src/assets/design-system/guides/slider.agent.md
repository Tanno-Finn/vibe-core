---
id: slider
title: Slider
category: library
tags: [form, numeric, a11y]
summary: Drag a number when "about here" is the answer — and the honest cost of that choice for keyboard and screen-reader users.
related: [button, select, inputnumber, selectbutton, image]
covers: [slider]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, caption/value/name baseline, range with two handles, vertical orientation, slider plus number field, onChange vs onSlideEnd
  usage: Drag, type, or pick, Do/Don't pairs, and the rules of thumb that survived contact with the kit
  design: Anatomy, Aura's geometry tokens, the 24-pixel floor behind the kit's handle override, interaction states, width, and layout
  development: The full input list, outputs, CSS custom properties, SSR, the three naming patterns, keyboard, and the known gaps
  i18n: Your strings, numbers that are not language-neutral, the burden a control with no strings of its own shifts to you, half-supported RTL
  history: Document changelog, one line per version
---

## When to use
- The user steers an outcome and watches it change; "a bit more" is enough.
- Bounded value, and `(max - min) / step` is a keyboard cost you accept (roughly ≤ 100 presses).
- The exact number never has to be typed, pasted, or corrected.
- One interval whose ends read as one idea → `[range]="true"` (read the naming gap first).

## When not to use
- The user arrives with a number in mind → `p-inputnumber` (real `<input>`, working `inputId`, OS keypad).
- Precision sometimes matters → slider **and** `p-inputnumber` on one model.
- Steps are named, not measured ("Low / Medium / High") → `p-selectbutton` / `p-select`.
- Two merely adjacent values → two sliders, each with its own name.

## Key API
`SliderModule` from `@openng/optimus-ui/slider`; a `ControlValueAccessor`. Model = number, or `[start, end]` with `range`. Refs cite `openng-optimus-ui-slider.mjs`.
- The **complete** input list: `min`, `max`, `step`, `range`, `orientation`, `animate`, `styleClass` (`@deprecated`), `ariaLabel`, `ariaLabelledBy`, `tabindex`, `autofocus`, plus `disabled`/`invalid`/`required`/`name` from `BaseEditableHolder` (`:596`). **`inputId`, `size`, `fluid`, `variant`, `minStepsBetweenHandles`, `disabledMin/MaxHandle` do not exist** (upstream PrimeNG docs list some) — they land as inert host attributes.
- `onChange` fires on every tick (drag, arrow, track click). `onSlideEnd` fires on document `mouseup` after a drag (`:369-371`), on `touchend` (`:251-253`) and on track click (`:267-269`) — **never from the keyboard**.
- No `step` ≠ continuous: arrows move ±1 (`:312`, `:320`) and `getNormalizedValue` floors to integers (`:557-565`). With a `step`, drag stepping is relative to the *previous* value (`handleStepChange`, `:414-426`), not to a grid anchored at `min` — off-grid initial values stay off-grid.

## Accessibility
- The handle is a **`<span role="slider">`**, not a native input (`:629-656` single, `:658-708` range). **Only the `[ariaLabel]` / `[ariaLabelledBy]` inputs name it** (`:649-650`). Nothing carries an `id`, so `<label for>` binds to nothing; host `[attr.aria-label]` lands on the roleless host. Unlike `p-select` there is **no value fallback**: unnamed means unnamed.
- Keyboard (`onKeyDown`, `:273-305`): `←`/`↓` −step, `→`/`↑` +step, `Home`/`End` → min/max. **`PageUp`/`PageDown` jump ±10 only on a single handle without `step`** (`:317-318`, `:336-337`); otherwise they equal the arrows (`:308-313`, `:327-332`). `Esc`/`Enter`/`Space` unhandled.
- Upstream gaps: both `range` handles share one name (`:675-676`, `:701-702`); no `aria-valuetext`; **`disabled` only drops `tabindex`** (`:644`, `:670`, `:696`) — no disabled state is announced.
- Single handle: `aria-valuenow` is bound to `value` (`:647`) and carries fractions verbatim; never recompute it from the pixel offset. **Range handles have none:** `:673`/`:699` bind `value[i]`, but range mode stores `values` — write it from your own model at the call site (`ai-timeline.component.ts`).
- No global rescue: name the control at the call site. A MutationObserver copying the host `aria-label` down loses the race against the handle's class binding — do not build one.
- Handle **24 × 24** px on a **3 px** track: Aura ships 20 × 20 (`optimus-ui-themes/dist/aura/slider/index.mjs:1`), under SC 2.5.8, so `styles.scss` raises `--p-slider-handle-width`/`-height` on `.p-slider` (not `:root`, where the runtime `<style>` block wins). Track/ring: `--control-border`, ≥ 3.85:1. Focus: the kit ring (2px `--primary-color-fg`, offset 2px, "focus ring" ≥ 3.88:1); `outline-color` transitions over 0.2s: a computed style read in the same tick as `.focus()` reads transparent.

## Pitfalls
- No visible number next to the slider (it renders none) — the user cannot report what they set.
- `inputId` or `<label for>` doing the naming: silently dead; make the caption a plain `<span>`.
- Committing only on `onSlideEnd` — **keyboard users never reach it**, so their value never commits. Keep a path through `onChange`/the model.
- No width: the `display: block` host collapses as a flex item.
- A 1000+-step range: unaimable by mouse, unusable by keyboard.
- Expecting `[invalid]` to show: Aura has no invalid colors.

## Sources
- APG Slider — the keyboard contract: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- APG Multi-Thumb — "each thumb has a label": https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
- ARIA 1.2 `aria-valuetext` — raw numbers are not enough: https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext
- WCAG 2.2 SC 2.5.8 — the 24px target floor: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN `<label>` — the labelable-element list: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
- PrimeNG Slider — upstream API surface the Optimus fork inherits: https://primeng.org/slider

## Semantic mapping
Intent → props:

| Intent | Props |
| --- | --- |
| Coarse exploration | `[step]` sized so `(max-min)/step` ≤ ~100 |
| Exact value also needed | slider + `p-inputnumber`, one model |
| One interval, two ends | `[range]="true"` (one shared name) |
| Two independent bounds | two sliders, one `[ariaLabelledBy]` each |
| Expensive recompute | cheap in `onChange`, costly in `onSlideEnd` **plus** a keyboard path |
| Bigger hit target | `--p-slider-handle-width` / `-height` (kit already sets 24px) |

## Rules
- MUST: render the value as visible text; point `[ariaLabelledBy]` at that caption (or set `[ariaLabel]`).
- MUST NOT: name it via `<label for>` + `id`, host `[attr.aria-label]`, or `inputId` — all no-ops.
- MUST: give it an explicit width, and set `[step]` deliberately (no step = integers only).
- SHOULD: keep `(max-min)/step` ≤ ~100, pair with `p-inputnumber` above that, format the caption via `Intl.NumberFormat`.
- SHOULD: treat `onSlideEnd` as an optimization, never as the only commit path.
- NEVER: `[range]` for two values a user must tell apart by name.

## Default snippet
```html
<!-- The caption is the single source: it shows the value AND names the control. -->
<span class="field-label" id="threshold-label">
  {{ t('demo.threshold') }}: <strong>{{ thresholdFormatted() }}</strong>
</span>
<p-slider
  [ariaLabelledBy]="'threshold-label'"
  [min]="0" [max]="100" [step]="5"
  [(ngModel)]="threshold" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
