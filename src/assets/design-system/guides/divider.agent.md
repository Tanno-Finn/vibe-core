---
id: divider
title: Divider
category: library
tags: [divider, separator, layout, a11y, tokens]
summary: A one-pixel rule on a host that is always role="separator" — content projected into the line lands inside a role whose children are presentational, a vertical divider has no height of its own, and the border style needs both its classes to appear.
related: [card, tabs, menubar, design-tokens, ui-pattern-selection, a11y-guidelines]
covers: [divider]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three border styles, the three horizontal alignments, a vertical row, and the emitted markup
  usage: Divider against heading, fieldset, list markup, and plain margin, plus Do/Don't pairs on labels and vertical height
  design: Aura token chain, which contrast criterion applies to a rule, and the narrow viewport
  development: The input map including the four inherited ones, the undefined-class trap, and per-instance tokens
  i18n: What the library contributes (nothing), the direction-aware rules, and where a label belongs instead
  history: Document changelog
---

## When to use
- A thematic break **inside one region** that has no name — the meaning of `role="separator"`, and all this component can say.
- Visual rhythm between blocks, *knowingly*: the role ships either way (`openng-optimus-ui-divider.mjs:105`).

## When not to use
- **A named section** → heading plus `section`; a name projected into the line is not exposed (see Accessibility).
- **A named group of controls** → `fieldset`/`legend`: a separator bounds without grouping.
- **Rows of one list** → list markup plus a CSS border; a separator per row is a redundant second boundary.
- **Only spacing** → a margin. Do not buy a separator announcement to get 1rem of air.

## Key API
`DividerModule` or the standalone `Divider` from `@openng/optimus-ui/divider`. Own inputs (`openng-optimus-ui-divider.mjs:134-142`): `layout` (`horizontal` default, `:85`), `type` (`solid` default, `:90`), `align` (no default, `:95`), `styleClass` (deprecated since v20.0.0, `:77`). No outputs.
- **Four more inputs arrive by inheritance**, absent from the compiled input list at `:105`: `dt`, `unstyled`, `pt`, `ptOptions` — signal inputs on `BaseComponent` (`openng-optimus-ui-basecomponent.mjs:42-63`). `pt` has three sections: `host` and `root` are merged onto the host element (`:73`), `content` goes to the inner div (`:106`).
- **`align` is layout-specific**: `left/center/right` for `horizontal`, `top/center/bottom` for `vertical`, written as inline `justify-content` / `align-items` (`:11-16`). Left unset it is not neutral: the inline alignment falls to `center`, and a horizontal divider is still classed `p-divider-left` (`:13`, `:22`).
- **`type` never works alone.** Every border-style rule is a combined selector (`.p-divider-dashed.p-divider-horizontal:before` and siblings, `@openng/optimus-ui-styles/dist/divider/index.mjs`).

## Accessibility
- **The host is always a separator.** In the compiled component (`:105`) `role="separator"` stands under `host.attributes`, while `aria-orientation`, `class`, `style` and `data-p` stand under `host.properties`: a static attribute, never a binding. No input turns the role off.
- **Content lands inside that role.** The template is one `div.p-divider-content` around `<ng-content>` (`:117-121`), and WAI-ARIA 1.2 declares the children of `role="separator"` presentational — so a section named only that way has no name in the accessibility tree and no heading to navigate to. Verify in the browser accessibility tree: the separator node must expose no content of its own.
- **A decorative rule has no contrast criterion**; a rule that alone carries a distinction is a meaningful graphic and owes 3:1 under SC 1.4.11 — which the line never reaches: `{content.border.color}` is 1.13–1.76:1 on the kit grounds in every style and mode (`docs/generated/CONTRAST.MD`, informational rows `progressbar.background`, the same color).
- Not focusable, no key handling: nothing here enters the tab order.

## Pitfalls
- **A vertical divider has no height.** `.p-divider-vertical` sets `min-height: 100%`, its `:before` `height: 100%`; a percentage `min-height` against an auto-height containing block resolves to zero (CSS 2.1, 10.7), leaving only the preset's block padding — `0.5rem` above and below. Give it a stretching flex parent or an explicit height.
- **`p-divider-undefined`.** Root classes are concatenated from the raw values (`:17-30`). Bind `layout` or `type` to a possibly-undefined value and the emitted class matches no rule: no width, no margin, no line.
- **The content chip paints its own background** from `{content.background}` (`@openng/optimus-ui-themes/dist/aura/divider/index.mjs`), independent of the surface behind it. Correct with `dt`, not with a wrapper.
- **A mismatched `align` is silent**: `top`/`bottom` are read only for `vertical`, `left`/`right` only for `horizontal` (`:13-14`, `:22-27`); the wrong pairing sets neither class nor inline alignment.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-divider.mjs` — host bindings, template, inputs, class builder.
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-basecomponent.mjs:42-63` — the four inherited signal inputs.
- `@openng/optimus-ui-styles/dist/divider/index.mjs` — the whole visual behavior, cited by selector.
- `@openng/optimus-ui-themes/dist/aura/divider/index.mjs`, `.../aura/base/index.mjs` — tokens and their resolution.
- WAI-ARIA 1.2, role `separator` — the presentational-children characteristic.
- CSS 2.1, 10.7 — percentage `min-height` against an auto-height containing block.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Unnamed thematic break | `<p-divider />` |
| Named section | `<h2>` + `<section>`, any divider decorative |
| Named control group | `<fieldset><legend>` |
| Row boundaries in a list | `<ul>` + `border-block-start` |
| Vertical rule between inline items | flex row with `align-items: stretch`, `<p-divider layout="vertical" />` |

## Rules
- MUST: keep meaning out of the line — a name goes in a heading beside the divider, never inside it.
- MUST: bind `layout` and `type` to total values; let the component supply its own defaults.
- MUST: give a vertical divider a stretching parent or an explicit height before claiming it renders.
- SHOULD: switch `layout` yourself where a flex row wraps — the stylesheet carries no media query.
- SHOULD: use `dt` to depart from the preset for one instance; no visual style or accent touches a divider token (`src/app/services/theme.service.ts`).
- NEVER: use a divider where the boundary needs a name, or let a hairline alone carry a distinction.

## Default snippet
```html
<!-- The heading names the section; the rule is decoration beside it. -->
<h2>{{ sectionLabel() }}</h2>
<p-divider />

<!-- Vertical only inside a row that stretches its items. -->
<div style="display: flex; align-items: stretch">
  <span>Draft</span>
  <p-divider layout="vertical" />
  <span>Published</span>
</div>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
