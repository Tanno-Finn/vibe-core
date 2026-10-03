---
id: rating
title: Rating
category: library
tags: [rating, stars, radio, forms, a11y]
summary: A star strip that is not one control but a set of native radio inputs clipped to a pixel — no group role and no name of its own, a read-only mode that changes nothing an assistive technology can see, star labels that come from the shared library config rather than your template, and a re-selection that clears the value.
related: [radiobutton, selectbutton, slider, forms, a11y-guidelines, i18n-localization]
covers: [rating]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Live editable, read-only, and disabled strips, the emitted per-star markup, and a ten-star row
  usage: Rating against radio, slider, and segments, plus three Do/Don't pairs on naming, display-only scores, and icon shape
  design: Aura token chain, contrast across four visual styles and both modes, target size, and the narrow viewport
  development: The input and output map, the toggle-off, the init-only star count, and the focus-ring flag
  i18n: Which strings come from your template and which from the Optimus config, and what the star placeholder cannot express
  history: Document changelog
---

## When to use
- A reader **gives** a score on a coarse ordinal scale — ranked steps that need no labels.
- The value belongs to a form: `NG_VALUE_ACCESSOR` is registered (`openng-optimus-ui-rating.mjs:84-88`).

## When not to use
- **Displaying** a score → your own `role="img"` markup with a name (pattern: `app-generic-card`); `readonly` is not a display mode.
- **Named choices** rather than ranks → `radiobutton`; **two to four labeled ones** → `selectbutton`.
- **A fine or continuous scale** → `slider`; the row never wraps.

## Key API
`RatingModule` or the standalone `Rating` from `@openng/optimus-ui/rating`. Own inputs (`:266`, decorators `:376-408`): `stars` (`numberAttribute`, default 5 at `:109`), `readonly` and `autofocus` (`booleanAttribute`), `iconOn/OffClass`, `iconOn/OffStyle`. Outputs `onRate` (`{originalEvent, value}`), `onFocus` — suppressed while `readonly` or disabled (`:225-228`) — and `onBlur`. Content templates `#onicon`/`#officon` (`:399-404`), context `$implicit` = the star number.
- **Four inputs arrive by inheritance**, missing from that declaration: `disabled`, `name`, `required`, `invalid` (`openng-optimus-ui-baseeditableholder.mjs:58`). `required` and `disabled` reach every radio as an attribute (`:275`, `:277`); `invalid` only adds a class — see Pitfalls.
- **`stars` is init-only:** `starsArray` is built in `onInit` only (`:177-183`).
- **Icons.** On `star-fill`, off `star` (`:295`, `:306`) — two shapes. A class override swaps the svg for a `<span [ngClass]>` (`:292`, `:303`); the kit font is `@openng/icons` (`.pi-*`); an undefined class renders an empty span.

## Accessibility
- **There is no rating role and no group.** The host binds only `[class]` and `[attr.data-p]` (`:370-373`). Each star is a real `input[type=radio]` inside a clip-hidden `span.p-hidden-accessible` (`:266-312`, `openng-optimus-ui-base.mjs:28-42`): focusable and in the a11y tree.
- **Name the group on a real grouping element** — `<fieldset><legend>`, or `role="group"` with `aria-labelledby`. A name on `p-rating` sits on generic semantics and is not exposed.
- **The radios group themselves:** `name() || nameattr + '_name'` over a `uuid('pn_id_')` from `onInit` (`:178`, `:273`); the `name` input overrides it.
- **The component wires no keys** (no `keydown`/`keyup`): arrows are the browser's own radio handling, and their `change` enters the selection method whose clearing branch tests the focused star. Test the keyboard in every engine you support.
- **The visible focus ring is conditional.** `p-focus-visible` needs `isFocusVisibleItem` (`:38`), set from `event.sourceCapabilities?.firesTouchEvents === false` (`:227`), a non-standard Chromium-only property: elsewhere a tab-in draws no ring and the clipped radio shows none either. `onChange` sets it `true` (`:218`). When shown, it is the kit's 2px ring.
- **Target size.** At the preset values the option is a 16×16 CSS-pixel target 20 pixels from its neighbor's center — under SC 2.5.8 (AA) and outside its spacing exception.

## Pitfalls
- **`readonly` is not a read-only semantic.** It emits `[attr.readonly]` on a radio (`:276`) — undefined for that type — and a `p-readonly` class (`:30`), no `aria-readonly`: the radios stay tabbable and choosable to AT; only JS guards (`:197`, `:205`, `:225`) block the change.
- **Two ways to land on `null`.** `onOptionSelect` writes `null` when `focusedOptionIndex() === value || value === this.value` (`:206`) — the star holds the value **or** the focus, which `onInputFocus` records (`:226`); `onChange` routes there too (`:216-217`).
- **`invalid` renders nothing.** It adds `p-invalid` to both icons (`:41-42`); its sole rule sets a `stroke` (`@openng/optimus-ui-styles/dist/rating/index.mjs:50-52`, a `@todo`) from a token Aura never declares, and the stars paint with `fill`. Carry the error state yourself.
- **`setTranslation` merges only at the top level** (`openng-optimus-ui-config.mjs:246-249`): a bare `{ aria: { … } }` replaces the whole `aria` block. Spread the existing one.
- **A late language switch does not repaint the star labels:** the config publishes them on `translationObserver` (`openng-optimus-ui-config.mjs:241-242`), and this `OnPush` component never subscribes.

## Sources
- WCAG 2.2 SC 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — why the icons must differ in shape.
- WCAG 2.2 SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — the 24×24 the preset star misses.
- WAI-ARIA 1.2, the `generic` role: https://www.w3.org/TR/wai-aria-1.2/#generic — name from author prohibited: why a label on the host is dropped.
- HTML Standard, radio button state: https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio) — grouping by name; no readonly behavior.
- Optimus UI Rating: https://optimus.openng.org/rating/ — vendor API reference.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Name the group | `<fieldset><legend>`, or `role="group"` + `aria-labelledby` |
| Bind the value | `[(ngModel)]` / `formControlName`, `number \| null` |
| React to a change | `(onRate)`, `value` `null` on a clear |
| Show a fixed score | not this component — `role="img"` with a name |
| Change the icons | `iconOn/OffClass`, or `#onicon`/`#officon` |

## Rules
- MUST: wrap the strip in a labeled group; never put the name on `p-rating`.
- MUST: state the value in visible text, and give clearing its own control.
- MUST: treat `null` as a legal model value, and keep `stars` constant.
- MUST: use `role="img"` markup, not `readonly`, for a score the reader cannot change.
- SHOULD: set `translation.aria.star` / `aria.stars` before the strip renders; enlarge `rating.icon.size` and `rating.gap` where SC 2.5.8 is in scope.
- NEVER: override both icons with the same glyph, or rely on the focus ring appearing in every engine.

## Default snippet
```html
<!-- Legend names the group, text states the value, button clears it. -->
<fieldset class="score">
  <legend>{{ groupLabel() }}</legend>
  <p-rating [ngModel]="score()" (ngModelChange)="score.set($event)"
            (onRate)="submit($event.value)" />
  <p aria-live="polite">{{ scoreText() }}</p>
  <button type="button" (click)="score.set(null)">{{ clearLabel() }}</button>
</fieldset>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
