---
id: input-labels
title: Input Labels
category: library
tags: [form, label, a11y]
summary: The two hulls that move a label into the field — one that lifts on focus, one that never moves — neither of which ships a label, names your field, or leaves the label clickable.
related: [forms, text-inputs, select, a11y-guidelines, i18n-localization]
covers: [floatlabel, iftalabel]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both hulls live, the three float variants side by side, the placeholder trap and the bare-input failure rendered
  usage: What each hull needs from you, which children it can position, and two Do/Don't pairs
  design: The two token groups, the three lift geometries, what recolors a label, the kit rules around the hulls, narrow screens
  development: The component contract, the CSS keying of every state, icon and group combinations, and a checklist
  i18n: The one string these hulls carry, its length budget, and the direction handling already built in
  history: Document changelog, one line per version
---

## When to use
- The design requires the label inside the field's box, and you already write a real `<label for>`.
- `p-iftaLabel` — the label must stay readable while the field holds a value.
- `p-floatLabel` — a compact resting state matters more than a permanent label.

## When not to use
- The ordinary case: a label above the field, no hull — `forms`.
- A placeholder standing in for a label: never, under either hull.
- Icons, addons, and the fields themselves — `text-inputs`, `select`, `datepicker`; accessible names and focus — `a11y-guidelines`.

## Key API
Both are standalone, `OnPush`, `ViewEncapsulation.None`; their whole template is `<ng-content>` — no label, id, `for`, or aria attribute (`openng-optimus-ui-floatlabel.mjs:74`, `openng-optimus-ui-iftalabel.mjs:64`).

| | `FloatLabel` | `IftaLabel` |
| --- | --- | --- |
| Selectors | `p-floatlabel`, `p-floatLabel`, `p-float-label` (`:74`) | `p-iftalabel`, `p-iftaLabel`, `p-ifta-label` (`:64`) |
| Own inputs | `variant`: `over` (default) / `on` / `in` (`:72`) | none — the bundle never imports `Input` (`:3`) |
| Root classes | `p-floatlabel` plus `-over`/`-on`/`-in` (`:20-24`) | `p-iftalabel` (`:21`) |
| Entrypoint | `@openng/optimus-ui/floatlabel` | `@openng/optimus-ui/iftalabel` |

`dt`, `unstyled`, `pt`, `ptOptions` come from `BaseComponent` (`openng-optimus-ui-basecomponent.mjs:428`). The rest is CSS: a `display: block; position: relative` root and your `position: absolute` `<label>`. **You supply the label and the `for`/`id` pair.**

## Accessibility
- The accessible name is yours: `<label for="x">` plus `id="x"` on the rendered input. Where the focusable element is a `span[role="combobox"]` (select family), use a caption plus `ariaLabelledBy` (`forms`).
- **The label is not clickable.** Both set `pointer-events: none` on it (`@openng/optimus-ui-styles/dist/floatlabel/index.mjs:9`, `.../iftalabel/index.mjs:9`); only the field stays a target.
- The ifta label is `0.75rem` always (`iftalabel.font.size`). The float label inherits the field's size and shrinks to `0.75rem` only when lifted (`floatlabel.active.font.size`) — under `variant="over"`, above the field.
- The kit's `.p-floatlabel` rule (`src/styles.scss`) re-points Aura's placeholder-gray label (`{surface.500}`/`{surface.400}`, `aura/base/index.mjs`): rest and active `--text-color-secondary` (lifting shrinks, same contrast), focus `--text-color`, invalid `--semantic-red-fg` — `docs/generated/CONTRAST.MD`, "float label", 4.79:1 and up on the field. `.p-iftalabel` takes the same three colors, gated in the same group (iftalabel rows, 4.79:1 and up).
- Invalid state recolors the label and announces nothing; `aria-invalid` and `aria-describedby` are yours (`forms`).

## Pitfalls
- **A `placeholder` cancels a float label.** `:has(input[placeholder]) label` is a lift trigger (floatlabel styles `:37`): the label starts lifted, never returns, and stacks over the placeholder. IftaLabel has no such rule.
- **A bare `<input>` lifts only while focused.** `:has(input:focus)`/`:has(input:-webkit-autofill)` match any input (`:30`, `:32`), but the lift that survives blur keys on `.p-filled` (`openng-optimus-ui-inputtext.mjs:28`) or `.p-inputwrapper-filled` (`openng-optimus-ui-select.mjs:52` and seven siblings). The label padding is keyed to a fixed class list (floatlabel styles `:58-65`, iftalabel `:21-28`), extended by siblings (`select/index.mjs:238`, `multiselect/index.mjs:246`, `inputnumber/index.mjs:98`); a bare input gets none, and its value sits under the label.
- **`variant="over"` lifts the label out of the field**: `over.active.top` is `-1.25rem` (`@openng/optimus-ui-themes/dist/aura/floatlabel/index.mjs`) — reserve that space above.
- **`variant="on"` paints a chip** (`on.active.background`). In dark mode the kit paints it `--surface-section`, the fill of every dark kit field (input, select, textarea, multiselect, treeselect, autocomplete); only a custom fill shows it as a patch.
- **A leading icon collides with an ifta label.** FloatLabel shifts past it (`:has(.p-inputicon:first-child)`, floatlabel styles `:26`); IftaLabel only nudges the icon down (iftalabel styles `:44`).
- **A hull goes inside `p-inputgroup`, never around it.** The group styles a hull member as `display: flex; width: 100%` (`@openng/optimus-ui-styles/dist/inputgroup/index.mjs:4-9`), fixes radii (`:55-85`), and lifts the label over addons (`:93-96`); neither hull names the group, so a group inside a hull puts a leading addon under the label.
- **Disabled is not styled** — the field grays out, the label does not.
- **Two invalid triggers.** `:has(.p-invalid) label` follows your `[invalid]` (floatlabel styles `:102`, iftalabel `:33`); `:has(.ng-invalid.ng-dirty) label` is appended in the bundles (`openng-optimus-ui-floatlabel.mjs:14-16`, `openng-optimus-ui-iftalabel.mjs:16-18`) and recolors on the first keystroke. The kit's `input.p-inputtext.p-invalid` rule turns the edge `--semantic-red-fg` with the label, over the per-style edge rule.

## Sources
- Optimus UI 2.0.2 — `openng-optimus-ui-floatlabel.mjs`, `openng-optimus-ui-iftalabel.mjs`; `@openng/optimus-ui-styles/dist/{floatlabel,iftalabel,inputgroup}/index.mjs`; `@openng/optimus-ui-themes/dist/aura/{floatlabel,iftalabel}/index.mjs` — every line number above.
- `src/styles.scss` — the `.p-floatlabel` / `.p-iftalabel` token rules, the per-style `input.p-inputtext` rules, the dark field fills.
- `docs/generated/CONTRAST.MD` — "float label": floatlabel and iftalabel rows, the `on` chip on the fill.
- WCAG 2.2 SC 3.3.2, Labels or Instructions — what a placeholder-as-label fails: https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html
- WCAG 2.2 SC 1.4.3, Contrast (Minimum) — the bar for the 12px in-field label: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- HTML Living Standard, `label` — `for`/`id` binds, not proximity: https://html.spec.whatwg.org/multipage/forms.html#the-label-element
- MDN, `pointer-events` — what the hulls give up on the label: https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| Label above the field | no hull — plain `<label for>` |
| Label inside, always readable | `p-iftaLabel` |
| Inside when empty, above when filled | `p-floatLabel`, default `variant="over"` |
| On the field's top border | `p-floatLabel variant="on"` |
| Inside the field's top padding | `p-floatLabel variant="in"` |
| The accessible name | your `<label for>`, or `ariaLabelledBy` on a combobox host |
| The red label | `[invalid]` on the child control |
| Full width | the child's `fluid` — hulls are already `display: block` |

## Rules
- MUST write a real `<label for>` inside the hull and a matching `id` on the rendered input.
- MUST give the hull a library-classed child (`pInputText`, `pTextarea`, or a wrapper control), never a bare `<input>`.
- MUST NOT put a `placeholder` on a float-labeled field, a leading `p-inputicon` under `p-iftaLabel`, or a `p-inputgroup` inside a hull.
- MUST reserve `1.25rem` above a `variant="over"` field.
- MUST bind `[invalid]` yourself, with `aria-invalid` and `aria-describedby`.
- SHOULD prefer a plain label above the field; inside, prefer `p-iftaLabel`.

## Default snippet
```html
<p-iftaLabel>
  <input pInputText id="acct-name" name="acctName" [ngModel]="name()" (ngModelChange)="name.set($event)" [invalid]="nameError()" />
  <label for="acct-name">{{ translate('your-module.account.nameLabel') }}</label>
</p-iftaLabel>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
