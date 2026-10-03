---
id: tooltip
title: Tooltip
category: library
tags: [overlay, hint, directive, a11y]
summary: An attribute directive that builds a detached role="tooltip" node on show and deletes it on hide — nothing ties it to the trigger, the default binding is pointer-only, and on touch it lasts as long as the press.
related: [popover, button, ui-pattern-selection, a11y-guidelines, i18n-localization]
covers: [tooltip]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Default placement, hover versus focus binding, the four positions and their fallbacks, and the emitted node
  usage: Which explanation surface to pick, Do/Don't on naming and on hover-only hints, annotated source
  design: Aura token chain and the style radius, which contrast criterion applies and why no ratio is quoted, narrow viewport, stacking
  development: Full input map including the four inherited ones, the disabled-host trap, and the node's lifecycle
  i18n: What the library contributes (nothing), the reactive-label pattern, and length, line breaks, and direction
  history: Document changelog
---

## When to use
- **A restatement of a control that is already named** — an icon-only button's label, a shortcut, the full text of a truncated cell (`showOnEllipsis`, `openng-optimus-ui-tooltip.mjs:430-432`).
- A hint whose loss costs nothing.

## When not to use
- **As the accessible name**: the node has `role="tooltip"` (`:479`) and no `aria-describedby`, `id`, or `title` anywhere in the file.
- **For anything the task needs**: the default binding is pointer-only (`:71`, `:249-261`).
- **Interactive content** → `p-popover`; the node is out of the tab order and `pointer-events: none` by default (`:498-500`).
- **Validation messages** → an inline node; this one does not exist while hidden (`:734-750`).

## Key API
Standalone directive `Tooltip` / `TooltipModule` from `@openng/optimus-ui/tooltip`, selector `[pTooltip]` (`:782`, `:787`). **Aliases**: `content` is `pTooltip` (`:831-833`), `disabled` is `tooltipDisabled` (`:834-836`).
- `tooltipPosition` — `right` (`:170`); per-position fallback chain (`:568-573`), tried only while out of viewport (`:575-582`, `:673-681`).
- `tooltipEvent` — `hover` (`:71`, `:171`); `focus`/`blur` bind **only** for `focus` or `both` (`:262-271`); hover also binds `click`, which closes (`:421-423`).
- `autoHide` (`true`) → `pointer-events: none` (`:498-500`); `false` makes the node hoverable (`:501-504`, `:378-381`).
- `hideOnEscape` (`true`) → document `keydown.escape` (`:447-452`), inert as an input (Pitfalls). `life` hides after its duration (`:441-446`).
- `escape` (`true`) inserts text; `false` assigns `innerHTML` (`:558-564`).
- `appendTo` — effectively `'body'` (`:172`, `:488-493`); `fitContent` (`true`) → `width: fit-content` (`:495-497`).
- Inherited, absent from the input list at `:782`: `dt`, `unstyled`, `pt`, `ptOptions` (`openng-optimus-ui-basecomponent.mjs:42-63`, declared `:428`). Also `pTooltipPT`, `pTooltipUnstyled`, deprecated `ptTooltip` (`:214-232`). No outputs.

## Accessibility
- **No association.** `role="tooltip"` (`:479`) and nothing else; the options-bag id (`:186`) is set (`:338`) and never applied. An icon button with only a tooltip is unnamed in the accessibility tree.
- **SC 1.4.13 is partly on you.** *Dismissible* holds (Escape, `:447-452`); *hoverable* needs `autoHide="false"`; *persistent* only while `life` is unset; content on **focus** needs `tooltipEvent="both"`.
- **Touch is one press long**: `touchstart` shows, `touchend` hides while `autoHide` is on (`:386-398`); with it off, a document `touchstart` outside closes (`:399-408`).
- Bubble text owes **SC 1.4.3, 4.5:1**: `{surface.0}` on `{surface.700}` (Aura grays, same in every style), **not in the contrast gate**; see Design.

## Pitfalls
- **A disabled control kills its own tooltip.** Pointer listeners sit on the host (`:253-255`), focus on the inner `.p-component` (`:265-268`); a disabled native control fires neither, and on `p-button` the focus target is the disabled inner `<button>`. Wrap it in an enabled, focusable element; bind `tooltipDisabled`, never `disabled`.
- **Inputs and readers miss each other.** `onChanges` writes no `hideOnEscape`/`fitContent` key (`:276-341`), yet `:447` reads `getOption('hideOnEscape')` and `:495` reads `this.fitContent`: only `[tooltipOptions]="{ hideOnEscape: false }"` (`:341`) reaches Escape. `$appendTo` (`:166`) is read nowhere. `tooltipEvent` binds once (`:245-274`, unbound `:767-768`); a later change re-writes the bag (`:279-280`) and rebinds nothing.
- **`escape="false"` is an HTML sink** (`:562-564`).
- **Scroll and resize close, not re-place** (`:682-684`, `:697-706`).
- **z-index is not 1100.** `tooltipZIndex: 'auto'` (`:175`) stacks on base `config.zIndex.tooltip = 1100` (`openng-optimus-ui-config.mjs:239`, same as `modal` at `:236`), derived from the last entry (`openng-optimus-ui-utils.mjs:284-289`): opening order decides.
- **Radius follows the visual style** (`overlay.popover.border.radius` → `border.radius.md`, 0 in `werkbund`).

## Sources
- `@openng/optimus-ui/fesm2022/`: `openng-optimus-ui-tooltip.mjs` (directive, events, lifecycle, placement), `openng-optimus-ui-basecomponent.mjs:42-63`, `openng-optimus-ui-config.mjs:236-239` (z-index bases; no tooltip translation), `openng-optimus-ui-utils.mjs:284-289` (derived z-index).
- `@openng/optimus-ui-styles/dist/tooltip/index.mjs` — cap, wrapping, arrow; no media query. `@openng/optimus-ui-themes/dist/aura/tooltip/index.mjs` and `.../aura/base/index.mjs` — tokens and what `{surface.700}`/`{surface.0}` resolve to.
- WCAG 2.2 SC 1.4.13: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html — the three properties the defaults only partly meet.
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — 4.5:1 for text that is not large-scale.
- WAI-ARIA 1.2 `tooltip`: https://www.w3.org/TR/wai-aria-1.2/#tooltip — what the role promises.
- W3C APG Tooltip: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ — the `aria-describedby` link this directive never writes.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Name an icon-only control | `aria-label` on the control, `pTooltip` beside it |
| Restate a shortcut or truncated value | `pTooltip` (+ `showOnEllipsis`) |
| A sentence or two of help | a click-or-focus help surface |
| Anything interactive | `p-popover` |
| Field-level error | inline node + `aria-describedby` |

## Rules
- MUST: name the trigger itself; the tooltip repeats it.
- MUST: set `tooltipEvent="both"` wherever the trigger can take focus.
- MUST: keep `escape` at `true` for any string a user can influence.
- SHOULD: `autoHide="false"` for more than a couple of words; `top`/`bottom` in narrow columns and direction-flipping pages.
- NEVER: a link, button, or field in a tooltip; never the only carrier of a fact; never `life` on content a reader must finish.

## Default snippet
```html
<!-- The name lives on the control; the tooltip restates it. -->
<button type="button" [attr.aria-label]="deleteLabel()"
        [pTooltip]="deleteLabel()" tooltipEvent="both" tooltipPosition="bottom">
  <i class="pi pi-trash" aria-hidden="true"></i>
</button>

<!-- Longer hint: reachable by keyboard, hoverable so it can be read. -->
<p-button label="Export" [pTooltip]="exportHint()"
          tooltipEvent="both" [autoHide]="false" tooltipPosition="bottom" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
