---
id: fieldset
title: Fieldset and Panel
category: library
tags: [container, grouping, disclosure, a11y]
summary: Two boxes that look alike and are not — one renders a native fieldset and legend that names its group, the other a bold span that names nothing, and collapsing either hides the content without removing it.
related: [card, accordion, forms, a11y-guidelines]
covers: [fieldset, panel]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both components rendered open and collapsed, the markup each emits, and the two toggle anatomies side by side
  usage: Choosing between fieldset, panel, card, and accordion; Do/Don't on the group name and on the collapsed required field
  design: Aura token chain per component, the frame criterion with kit ratios, the focus ring, the narrow-viewport statement
  development: Input and template maps, the inherited four, the dead inputs, the hide strategy, the tabindex sweep, the unnamed region
  i18n: Legend and header as UI strings, length in a legend that wraps, and what stays untranslated
  history: Document changelog
---

## When to use
- **Form controls that belong under one name** → `p-fieldset`. It renders a real `<fieldset>` with a real `<legend>` (`openng-optimus-ui-fieldset.mjs:270-271`), so assistive technology gets a named group, not an outlined box.
- **A titled block of content that may collapse** → `p-panel`: header, optional footer, a toggle. Collapse only where the reader can afford not to see what is inside.

## When not to use
- Neither a name nor a role needed → `p-card`. Sibling sections opened independently → `p-accordion`: arrow keys, generated ids, a named region per panel.
- One control that needs a label, or a form's layout → `forms`; a fieldset around a single input names it twice.
- A titled block in a portal page → the kit's `app-standard-container`; a section of the outline → `<section>` plus a heading.

## Key API
Both inherit `dt`, `unstyled`, `pt`, `ptOptions` from `BaseComponent` (`openng-optimus-ui-basecomponent.mjs:428`), absent from both compiled input lists, and emit `collapsedChange`, `onBeforeToggle`, `onAfterToggle`.
- **`p-fieldset`** — 7 own inputs (`openng-optimus-ui-fieldset.mjs:269`): `legend`, `toggleable`, `collapsed`, `style`, `styleClass`, `transitionOptions`, `motionOptions`.
- **Root class, `style` and `styleClass` land on the inner `<fieldset>`** (`:270`); the host carries no class and no shipped rule. Size the group with a wrapper or `pt.root` — the same route to the native `disabled` this component does not expose (`:269`).
- **`p-panel`** — 11 own inputs (`openng-optimus-ui-panel.mjs:344`): `id`, `header`, `toggleable`, `collapsed`, `showHeader`, `toggler`, `iconPos`, `styleClass` (deprecated v20), `transitionOptions`, `toggleButtonProps`, `motionOptions`. Its root class is on the host (`:344`), made `display: block` by `@openng/optimus-ui-styles/dist/panel/index.mjs`.

## Accessibility
- **Only `p-fieldset` names a group, and neither emits a heading.** `<fieldset>` + `<legend>` (`:270-271`) name it natively; the `p-panel` title is a `<span>` (`openng-optimus-ui-panel.mjs:348`), bold only by the `panel.title.font.weight` token (Aura: `600`). Put a heading in `#header` — except on a toggleable `p-fieldset`, where that template renders inside the toggle `<button>` (`:305`, `:312-316`).
- **`p-fieldset`'s toggle is a real `<button>`** in the legend, with `aria-expanded`, `aria-controls` and `aria-label` on it (`:273-284`) — the right element.
- **`p-panel`'s is not.** a static `role="button"` (`:361`) and `attr.` bindings for `aria-label`, `aria-controls` and `aria-expanded` (`:363-365`) sit on the `<p-button>` custom element; the focusable `<button>` inside it (`openng-optimus-ui-button.mjs:833-849`) gets none. Repair both through Semantic mapping, then focus the toggle and read the focused node in the accessibility tree.
- A frame that alone carries the grouping owes **SC 1.4.11, 3:1**. The stock frame, `{content.border.color}`, is 1.13–1.76:1 on the kit grounds (`docs/generated/CONTRAST.MD`, informational rows `progressbar.background`, the same color): let the legend or header name the group, or re-point the frame to `--control-border` (3.97:1 and up). Both toggles wear the kit's 2px focus ring.

## Pitfalls
- **Collapsed means `display: none`, never removed.** Both bind `pMotion` on the container (fieldset `:320`, panel `:390`); its hide strategy defaults to `'display'` (`openng-optimus-ui-motion.mjs:493`, applied `:23-24`), it has no unmount option (`:693`), and the strategy is not part of `motionOptions`. Values, registration, and validity survive.
- **A `required` control inside a collapsed group blocks interactive submission in silence** (not `form.submit()`, not a `novalidate` form) — it is not focusable, so constraint validation cannot report it. Keep required fields out of anything `toggleable`.
- **Expanding strips your `tabindex`.** `updateTabIndex()` calls `removeAttribute('tabindex')` on every focusable node in the content (fieldset `:237`, panel `:299`), killing a roving-tabindex widget on the first expand; it never runs from the `collapsed` setter (fieldset `:179-181`).
- **`p-panel`'s `onAfterToggle` fires only on expand.** Its content container wires `pMotionOnAfterEnter` and no `pMotionOnAfterLeave` (`openng-optimus-ui-panel.mjs:399`), unlike `p-fieldset` (`openng-optimus-ui-fieldset.mjs:329-330`); for both directions listen to `collapsedChange` (panel `:280`, `:285`).
- **A duplicate id and three dead inputs.** `p-panel`'s title span and toggle button share `id + '_header'` (`:348`, `:356`); `iconPos` sets classes no stylesheet defines (`:154`, `:33-35`); `transitionOptions` is declared on both, read by neither (fieldset `:128`, panel `:170`).

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-fieldset.mjs` and `.../openng-optimus-ui-panel.mjs` — the two templates: every claim about the native pair, the header div, the naming span, the duplicate id, and the misplaced ARIA.
- `.../openng-optimus-ui-button.mjs:833-849` — the inner `<button>` that takes focus, and the routes reaching it.
- `.../openng-optimus-ui-basecomponent.mjs:428` and `.../openng-optimus-ui-motion.mjs:493`, `:23-24` — the inherited four, and the hide strategy behind hidden-not-gone.
- `@openng/optimus-ui-styles/dist/fieldset/index.mjs` and its `panel` sibling, plus the same pair under `@openng/optimus-ui-themes/dist/aura/` — tokens and their rules; no media query.
- HTML `<fieldset>` https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element — the native naming a bold div cannot do.
- HTML constraint validation https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#interactively-validate-the-constraints — the step that stalls on a hidden required control.
- WCAG 2.2 SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 a group frame owes.
- WCAG 2.2 SC 4.1.2 https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html — why name and state on a non-focusable wrapper do not count.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Controls under one name | `p-fieldset [legend]`, no `toggleable` |
| Titled block that may collapse | `p-panel [header] [toggleable]` |
| Panel toggle name | `[toggleButtonProps]="{ ariaLabel: … }"` (button `:835`) |
| Panel toggle expanded state | `pt.pcToggleButton.root` (panel `:369` → button `:845`) |
| Native group disabling | `[pt]="{ root: { disabled: true } }"` |

## Rules
- MUST: `p-fieldset` for a group of form controls, `[legend]` set, short and translated.
- MUST: name and state the `p-panel` toggle through `toggleButtonProps` and `pt`.
- MUST: supply the heading yourself; keep required and error-bearing fields out of anything `toggleable`.
- SHOULD: `--control-border` on a frame that alone carries the grouping; on `p-panel` `class` over the deprecated `styleClass` (root class on the host, `:344`); on `p-fieldset` `styleClass` or `pt.root`, and a wrapper for size — a host `class` hits an unstyled wrapper (see Key API).
- NEVER: interactive content or a heading in a toggleable `p-fieldset`'s `#header`; a roving `tabindex` inside a toggleable group.
- NEVER: expect a collapse to unmount, or `transitionOptions` and `iconPos` to do anything.

## Default snippet
```html
<!-- required fields sit in a group that never collapses -->
<p-fieldset [legend]="legendText()">
  <label for="street">{{ streetLabel() }}</label>
  <input pInputText id="street" required />
</p-fieldset>

<p-panel [header]="notesTitle()" [toggleable]="true" [toggleButtonProps]="toggleProps()">
  <p>{{ notesBody() }}</p>
</p-panel>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
