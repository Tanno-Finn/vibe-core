---
id: togglebutton
title: Toggle Button
category: library
tags: [form, boolean, toggle, group]
summary: A button that stays pressed — its state lives in aria-pressed, and its label must not move with it; grouping belongs to the toolbar guide.
related: [selectbutton, toggleswitch, checkbox, button, toolbar]
covers: [togglebutton]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both components rendered, label and icon variants, sizes, fluid, the markup each emits
  usage: Switch vs checkbox vs segment vs toggle button, Do/Don't pairs on naming and state, annotated source and sources
  design: Aura token chain, the pressed pill, which criterion applies, focus, what each visual style adds, ripple, narrow screens
  development: Full input map including the eight inherited, the dead inputs, the pTemplate slots and their guards, forms
  i18n: The library's only two strings, translating a label that must not change, length, and RTL
  history: Document changelog
---

## When to use
- **One boolean that must look and behave like a button** — Bold, Mute, a map layer.
- **Icon-only state controls in a toolbar.**

## When not to use
- Waits for a submit → `p-checkbox`; lands immediately in a settings row → `p-toggleswitch`.
- **Two or more named, exclusive options** → `p-selectbutton`, which wraps this one.
- **A validated form field.** `required` and `name` are accepted but reach no attribute.
- A row of `p-button` actions → `p-buttonGroup`, documented in the toolbar guide. Around toggle buttons it joins nothing: its rules (and the kit's one-joint rule) key on `.p-button`; the root class here is `p-togglebutton` (`openng-optimus-ui-togglebutton.mjs:31`). Use `p-selectbutton`.

## Key API
`ToggleButtonModule` from `@openng/optimus-ui/togglebutton`; a `ControlValueAccessor` (ngModel, reactive forms). There is **no `checked` input** — state comes only from the form binding.
- `onLabel`/`offLabel` (defaults `'Yes'`/`'No'`, `openng-optimus-ui-togglebutton.mjs:136`, `:141`), `onIcon`/`offIcon`, `iconPos`, `size`, `fluid`, `tabindex`, `styleClass` (deprecated).
- `ariaLabel`/`ariaLabelledBy` — host attributes (`:280`) that fix the name independently of the visible label; equal `onLabel`/`offLabel` also freezes it (`:290`).
- **`[allowEmpty]="false"` makes pressing one-way** — only the literal `false` trips the toggle guard (`:120`); unset, a pressed button can always be un-pressed.
- Inherited, in no compiled input list: `required`, `invalid`, `disabled`, `name`, `dt`, `unstyled`, `pt`, `ptOptions`.
- Output `onChange` → `{ originalEvent, checked }` (`:125-128`), after the model write. Slots `<ng-template #icon>` / `#content` — the refs, not `pTemplate`.

## Accessibility
- The host is the custom element `p-togglebutton`, **not** a `<button>`: semantics are host attributes, `role="button"` plus `aria-pressed` bound `checked ? "true" : "false"` (`:280`), present in both states — the only channel that carries the state to a screen reader.
- **The default labels change the accessible name with the state**: with no `ariaLabel` the name is the label span, which `onLabel`/`offLabel` swap (`:290`) — "Show" becomes a different button, "Hide". Name it once; `aria-pressed` carries the state.
- Keyboard: `Enter` and `Space` only (`:107-118`); no arrows.
- **A disabled toggle button stays in the tab order**: `tabindex` defaults to `0` (`:177`), so the host binding's `-1` branch is unreachable (`:280`), and no `aria-disabled` ships.
- Focus: the kit's one ring, `.p-togglebutton:focus-visible` — 2px `--primary-color-fg` at 2px offset (CONTRAST.MD `focus ring`).
- Pressed = the inner pill. The kit repaints it (`.p-togglebutton` in `src/styles.scss`): segment `--surface-section`, pressed pill `--primary-color-fg`, its label `--surface-card`. Gated in CONTRAST.MD "togglebutton & selectbutton": pill on segment ≥ 3.88:1 (**SC 1.4.11**), pressed label ≥ 4.75:1, unpressed label (`--text-color-secondary`) ≥ 4.64:1 (**SC 1.4.3**). An icon pair adds a shape cue beyond the fill.

## Pitfalls
- **`inputId` and `autofocus` are dead** (`:172`, `:187`; read nowhere): no `id` reaches the DOM, so `<label for>` has no target.
- **`pTemplate="icon"` never renders, `pTemplate="content"` renders next to the default label**: the guards test the `#icon`/`#content` ContentChild (`:283`, `:282`), not the `PrimeTemplate` copy the outlet uses (`:281`).
- **`:disabled`/`:enabled` never match a custom element**: the `togglebutton.disabled.*` tokens are inert, the fade is the global `.p-disabled`, and the hover rule keeps applying to a disabled button. Select `.p-disabled` or the attribute with its value — the kit's press-in is `[data-p-disabled='false']:active`; bare, the attribute matches every button (bound to `$disabled()`, `:310`).
- The visual styles restyle the host (`.p-togglebutton` in each `html.style-<name>` block of `styles.scss`): outline, shadow, radius, font, and a press-in (blaupause instead uppercases the label). `Ripple` is a host directive (`:300`), so with the kit's `ripple: true` the host is `overflow: hidden` — see the Button guide.

## Sources
- `openng-optimus-ui-togglebutton.mjs` and `openng-optimus-ui-buttongroup.mjs` (bundle `@openng/optimus-ui/togglebutton`) — every behavior claim; inherited inputs from `openng-optimus-ui-baseeditableholder.mjs:58` and `openng-optimus-ui-basecomponent.mjs:428`.
- `@openng/optimus-ui-styles/dist/togglebutton/index.mjs`, `@openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs` — the dead `:disabled` rule; why pressed is a pill.
- WAI-ARIA 1.2 `aria-pressed` https://www.w3.org/TR/wai-aria-1.2/#aria-pressed — the attribute it sets.
- APG Button pattern, toggle section https://www.w3.org/WAI/ARIA/apg/patterns/button/ — the stable-name rule the defaults break.
- WCAG 2.2 SC 1.4.1 https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — what a color-only pressed state fails.
- WCAG 2.2 SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 the pill owes once it identifies the state.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Stable name, state in the attribute | `[ariaLabel]` once; `onLabel` = `offLabel` |
| A named row of actions | `p-buttonGroup` in a named wrapper (toolbar guide) |

## Rules
- MUST: name it once via `ariaLabel`/`ariaLabelledBy`, identical in both states.
- MUST: bind state through `[(ngModel)]` or a form control — there is no `checked` input.
- MUST: signal the pressed state by more than color: an icon pair, or a border.
- MUST NOT: rely on `inputId`, `autofocus`, `name`, or `required`, use `pTemplate` for a slot, or leave a disabled button in the tab order (set `[tabindex]="-1"`).
- SHOULD: build labels in a `computed()` off the translation service — `'Yes'`/`'No'` are English.

## Default snippet
```html
<!-- one name in both states; aria-pressed carries the state -->
<p-togglebutton
  [ariaLabel]="boldLabel()" [onLabel]="boldLabel()" [offLabel]="boldLabel()"
  onIcon="pi pi-check" offIcon="pi pi-minus" [(ngModel)]="bold" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
