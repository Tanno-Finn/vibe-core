---
id: toolbar
title: Toolbar, Button Group, and Split Button
category: library
tags: [action, group, menu, a11y]
summary: Buttons side by side — a toolbar role whose arrow keys you must add, a group nobody can name, and a split button whose menu drops focus on close.
related: [button, togglebutton, menu, selectbutton]
covers: [toolbar, buttongroup, splitbutton]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The shipped toolbar beside one with roving focus added, a labeled button group, a split button with focus restored
  usage: Toolbar vs group vs split button vs menu button vs selectbutton, Do/Don't on naming the chevron and the group, sources
  design: Toolbar and split-button tokens, the one joint per visual style, focus and contrast, narrow screens
  development: Input maps with the dead ones, the APG-versus-shipped keyboard matrix, roving-focus and focus-restore recipes
  i18n: No library strings, expandAriaLabel without a default, RTL joints and arrow keys, a translated menu model
  history: Document changelog
---

## When to use
- **`p-toolbar`** — three or more controls acting on one region (a demo stage, an editor), once you add arrow-key navigation.
- **`p-buttonGroup`** — two or three related actions that should read as one block, inside a group you name.
- **`p-splitbutton`** — one default action plus a few variants of it ("Save" / "Save as draft").

## When not to use
- A heading-plus-button row, or two buttons → a flex `div`; `role="toolbar"` promises a widget that is not there.
- Several actions, none the obvious default → `p-button` + `p-menu [popup]` (menu guide).
- One choice out of a few that stays selected → `p-selectbutton`; the group has no selected state.
- Toggle buttons in a group → the joining rules key on `.p-button`, not `.p-togglebutton` (togglebutton guide).

## Key API
- **`p-toolbar`** (`ToolbarModule`, `@openng/optimus-ui/toolbar`): inputs `ariaLabelledBy` and deprecated `styleClass` only (`openng-optimus-ui-toolbar.mjs:122`); a plain `aria-label` on the host works too. Slots: `<ng-template #start|#center|#end>` or `pTemplate` `start`/`left`, `end`/`right`, `center` (`:104-120`); plain projected content renders first (`:123`).
- **`p-buttonGroup`** (`ButtonGroupModule`, `@openng/optimus-ui/buttongroup`; also `p-buttongroup`, `p-button-group`): no inputs, no outputs (`openng-optimus-ui-buttongroup.mjs:69`).
- **`p-splitbutton`** (`SplitButtonModule`, `@openng/optimus-ui/splitbutton`):
  - Look: `label`, `icon`, `iconPos`, `severity`, `outlined`, `text`, `size`, `raised`, `rounded`.
  - Menu: `model: MenuItem[]` (a popup `p-tieredMenu`), `appendTo` (`'body'`), `menuStyle`, `menuStyleClass`.
  - Naming: `expandAriaLabel` names the chevron, no default (`openng-optimus-ui-splitbutton.mjs:399`); `menuButtonProps` overrides its `ariaLabel`/`ariaHasPopup`/`ariaExpanded`/`ariaControls` (`:399-402`); `buttonProps.ariaLabel` names the main button.
  - `disabled` sets both halves (`:227-231`); `buttonDisabled` is ignored once a `#content` template is used, which binds `disabled` (`:349`, `:376`). `dir` (`:179`) and `plain` (`:121`) are read nowhere.
  - Outputs: `onClick` (main button), `onDropdownClick` (no event on arrow-key open, `:322`), `onMenuShow`, `onMenuHide`.

## Accessibility
- **Toolbar: role without behavior.** The host is `role="toolbar"` (`openng-optimus-ui-toolbar.mjs:170`), but there is no keydown, no roving `tabindex`, no `aria-orientation`: every control stays a Tab stop and arrows do nothing. APG Toolbar wants one Tab stop plus ←/→ (Home/End optional). Add it (recipe below) or do not use the role.
- **Group: an unnamed group.** The template is `<span role="group">` around your buttons (`openng-optimus-ui-buttongroup.mjs:70`) and nothing reaches it; unnamed groups are usually not announced. Wrap it in `<div role="group" aria-labelledby="…">`.
- **Split button: two buttons plus a menu.** The chevron carries `aria-haspopup="true"`, `aria-expanded` and `aria-controls` (`openng-optimus-ui-splitbutton.mjs:400-402`); unnamed without `expandAriaLabel` — axe `button-name`. The `ul[role=menu]` is appended to `body` and gets no name (`:416-429`).
- **Split-button keyboard vs APG Menu Button.** ↓/↑/Enter/Space on the chevron open the menu (`:320-325`); focus lands on the list with no item active (`openng-optimus-ui-tieredmenu.mjs:1312`, `:1236`) — a second ↓ reaches item one; ↑ never jumps to the last.
- **Focus is lost on every keyboard close.** Escape focuses the `p-splitbutton` host (`openng-optimus-ui-splitbutton.mjs:318` → `openng-optimus-ui-tieredmenu.mjs:1288`), which is not focusable; item activation re-focuses the closing list (`:1037-1041`); Tab hides and moves on from the body-appended list (`:1169-1176`). Measured: focus ends on `body` in all three. SC 2.4.3 — restore it yourself.
- Ripple, focus ring (the kit's 2px `--primary-color-fg` ring, CONTRAST.MD `focus ring`) and label contrast are the button's (button guide); the toolbar frame (`{content.border.color}`) is decoration, not in the contrast gate.

## Pitfalls
- **Do not re-border the segments.** ThemeService and three style blocks force button borders with `!important`, which beat the library's joint; the kit's one-joint rule in `src/styles.scss` (`:not(#kit-join)`, logical properties) restores it — a new `!important` border on a group's buttons must be added there, or the seam doubles again.
- A toolbar's start/center/end groups do not wrap (`display: flex`, no wrap; `@openng/optimus-ui-styles/dist/toolbar/index.mjs`) — put buttons in your own wrapping container.
- `p-button` children get the library's `border-right: 0 none`, a physical side (`openng-optimus-ui-buttongroup.mjs:16-19`) — wrong under RTL; in this kit the logical one-joint rule overrides it.
- `MenuItem` labels render as HTML unless `escape: true` (menu guide).
- `tabindex` on a `p-button` host does not reach its inner `<button>` — roving focus needs native `pButton` buttons.

## Sources
- `@openng/optimus-ui` 2.0.2 `openng-optimus-ui-toolbar.mjs`, `openng-optimus-ui-buttongroup.mjs`, `openng-optimus-ui-splitbutton.mjs`, `openng-optimus-ui-tieredmenu.mjs` (`fesm2022`) — every behavior claim, by line.
- `@openng/optimus-ui-themes/dist/aura/{toolbar,splitbutton}/index.mjs`, `@openng/optimus-ui-styles/dist/{toolbar,buttongroup,splitbutton}/index.mjs` — tokens and joints.
- APG Toolbar https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ — one Tab stop, arrow keys, three-control threshold.
- APG Menu Button https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ — focus on open and close.
- WAI-ARIA 1.2 group https://www.w3.org/TR/wai-aria-1.2/#group — a group needs a name to be announced.
- WCAG 2.2 SC 2.4.3 https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — lost focus after close.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Control bar for a demo | `p-toolbar` + `aria-label` + roving `tabindex` on `pButton` buttons |
| Related actions as one block | `div role="group" aria-labelledby` › `p-buttonGroup` › `p-button`s |
| Default action + variants | `p-splitbutton` + `expandAriaLabel` + `(onMenuHide)` focus restore |
| Actions without a default | `p-button` + `p-menu [popup]` (menu guide) |
| Exclusive choice | `p-selectbutton` |

## Rules
- MUST: name every `p-toolbar` and give it arrow-key navigation, or drop the component.
- MUST: set `expandAriaLabel` on every `p-splitbutton`, bound to an i18n key.
- MUST: restore focus to the chevron in `onMenuHide` when focus is still inside `.p-tieredmenu-overlay` (snippet), deferred by a microtask.
- MUST: wrap a group whose buttons only make sense together in a named `role="group"`.
- SHOULD: `escape: true` on every `MenuItem`; keep a group to two or three segments.
- NEVER: a toolbar role on a layout row; a group of toggle buttons; a split button whose left half is a guess.

## Default snippet
```html
<p-splitbutton #save [label]="labels().save" [expandAriaLabel]="labels().moreSave"
               [model]="saveItems()" (onClick)="saveNow()" (onMenuHide)="restoreFocus()" />
```
```ts
private readonly save = viewChild('save', { read: ElementRef });
restoreFocus(): void {
  const host = this.save()?.nativeElement as HTMLElement | undefined;
  if (host?.ownerDocument.activeElement?.closest('.p-tieredmenu-overlay')) {
    queueMicrotask(() => host.querySelector<HTMLElement>('.p-splitbutton-dropdown')?.focus());
  }
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
