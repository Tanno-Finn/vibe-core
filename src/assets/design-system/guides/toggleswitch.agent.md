---
id: toggleswitch
title: Toggle Switch
category: library
tags: [form, boolean, settings]
summary: An on/off state that takes effect the instant it moves — and the line between a switch and a checkbox.
related: [checkbox, selectbutton, button, select]
covers: [toggleswitch]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, the default label-and-switch row, a settings row with description, trueValue/falseValue, every state, a custom handle
  usage: The one question that decides switch or checkbox, auto-saving settings pages, Do/Don't pairs, writing the label as a thing
  design: Anatomy including the invisible element, measured Aura geometry, state colors in both themes, gated contrast per style, focus, layout
  development: Inputs, the output that fires after the model, custom handle, forms, the three naming patterns, Space-only keyboard, readonly
  i18n: Every string is yours, label length as a layout problem, why not to translate on/off, RTL
  history: Document changelog, one line per version
---

## When to use
- One independent boolean whose effect lands **immediately** — no Save, no Apply. A light switch.
- Settings rows that auto-save on `(ngModelChange)` — the kit's convention for every switch it ships.
- The result is perceivable or cheaply reversible: dark mode, highlighting, sound.

## When not to use
- The change waits for a submit → `p-checkbox`. That is the deciding question.
- Two **named** options ("Filtered"/"All") → `p-selectbutton`; a switch has no rest position there.
- One item of a set, or anything needing `indeterminate` → `p-checkbox`.
- "Accept the terms", or anything destructive → checkbox, or a button with confirmation.

## Key API
`ToggleSwitchModule` from `@openng/optimus-ui/toggleswitch` (Optimus UI 2.0.2); a `ControlValueAccessor` (ngModel + reactive forms).
- Naming: `inputId` (+ sibling `<label for>`) **or** `ariaLabel`/`ariaLabelledBy` — not both with different text.
- `trueValue`/`falseValue`: model values per position; `checked()` is `modelValue() === trueValue` (strict).
- `disabled`, `invalid`, `required`, `name`, `tabindex`, `autofocus`, `readonly` (see Pitfalls).
- `size` exists (input signal, :134) but is **still ignored** — nothing reads it; no small/large tokens or selectors ship.
- Output `onChange` → `{ originalEvent, checked }`, after `ngModelChange`. Slot: `<ng-template #handle let-checked="checked">` (direct child; the query is `{ descendants: false }`, :319-321). `pTemplate="handle"` also binds — the `PrimeTemplate` query is back (:322-324).
- Selector: `p-toggleswitch`/`p-toggleSwitch`/`p-toggle-switch` (:250). Use the lowercase one.
- `styleClass` is back as a `@deprecated` input and still lands on the host (`cn(cx('root'), styleClass)`, :285); prefer `class`.

## Accessibility
- Renders a real `<input type="checkbox" role="switch">` (openng-optimus-ui-toggleswitch.mjs:219-244) that `@openng/optimus-ui-styles/dist/toggleswitch` lays over the whole control at `opacity: 0`, `z-index: 1`. Role in the accessibility tree: `switch`.
- **`<label for>` + `inputId` works** — the focusable element is a labelable `<input>`, unlike `p-select`. Prefer it; it also triples the target.
- `ariaLabel` also works and **beats** a `<label for>`; using both risks a WCAG 2.5.3 drift.
- Keyboard: **Space toggles, Enter does nothing** (measured). No key handler ships — native checkbox behavior, which APG's switch pattern permits.
- Focus: the kit ring (2px `--primary-color-fg`, 2px offset, "focus ring" ≥ 3.88:1) on `.p-toggleswitch-slider` via `:has(.p-toggleswitch-input:focus-visible)`, replacing Aura's 1px global ring.
- Target **40 × 24 px** (2.5 × 1.5rem) — **exactly on** the 24px SC 2.5.8 minimum. Ship a `<label for>` row for a real target.
- No vendor strings at all; every announced word is yours. No `ariaDescribedBy` input.

## Pitfalls
- `[readonly]` blocks only the toggle handler (:180): no attribute, no `aria-readonly`, still focusable, still swallows Space — a click desyncs the native `checked` property from `aria-checked` (verified in the DOM). Use `[disabled]`.
- A caption in a bare `<span>` names nothing — accessible name `""` (measured). Use `inputId` + `<label for>`.
- A switch with a text label on each side is a two-option chooser in disguise — a shape to avoid.
- Native submit sends `on`, never your `trueValue` — the component sets no `value` attribute.
- Verb labels ("Enable dark mode") and negations ("Hide sidebar") make "off" ambiguous.
- `size="small"` silently does nothing; override the geometry properties instead.
- Transparent border, so the off track is the only edge. Aura's stock track (`{surface.700}` / `{surface.300}`) was 1.26–1.76:1, so `styles.scss` re-points it to `--control-border` and the off handle to `--surface-card`: gated in CONTRAST.MD "toggleswitch", lowest 3.85:1 (SC 1.4.11). Don't override those tokens per call site.
- NOT a bug (measured): a wrapping `<label>` does not double-toggle; the input covers the control, so the click already targets it.

## Sources
- WAI-ARIA 1.2, `switch` role: https://www.w3.org/TR/wai-aria-1.2/#switch
- APG Switch pattern (Space toggles; Enter optional): https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2 SC 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- MDN, labelable elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
- Optimus UI ToggleSwitch: https://optimus.openng.org/toggleswitch/

## Semantic mapping
Control choice itself: see the two sections above. Intent → props:

| Intent | Props |
| --- | --- |
| Visible caption exists | `inputId` + sibling `<label for>` |
| No visible caption | `[ariaLabel]` (alone) |
| Model is not boolean | `trueValue`/`falseValue`; the label says what ON means, not what the field is about |
| Not changeable now | `[disabled]="true"` + a visible reason |
| Validation failed | `[invalid]="true"` (1px `--semantic-red-fg` border, gated — still add text) |
| Side effect on change | `(onChange)` with `[(ngModel)]`, or `(ngModelChange)` alone |
| Smaller switch | `--p-toggleswitch-width/-height/-handle-size/-gap` |

## Rules
- MUST: name every switch exactly once — `inputId` + `<label for>`, or `ariaLabel`.
- MUST: let the change take effect on toggle; if a Save button commits it, use `p-checkbox`.
- MUST NOT: use `[readonly]`, name it with a bare `<span>`, or label it with a verb phrase.
- SHOULD: noun/state label, unnegated; explanation in a second line; revert visibly on write failure.
- SHOULD: pad the row — the control alone is 24px tall, exactly on the target floor and no more.
- NEVER: a switch between two named options; a switch for "accept the terms" or a destructive action; visible "On"/"Off" text duplicating `aria-checked`.

## Default snippet
```html
<!-- label leads, switch trails; the write happens on change, not on Save -->
<div class="switch-row">
  <label for="glossary">{{ t('settings.appearance.glossaryHighlighting') }}</label>
  <p-toggleswitch
    inputId="glossary"
    [ngModel]="settings.glossaryEnabled()"
    (ngModelChange)="settings.setGlossary($event)" />
</div>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
