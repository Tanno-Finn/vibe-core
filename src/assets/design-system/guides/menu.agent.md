---
id: menu
title: Menu, TieredMenu, and ContextMenu
category: library
tags: [navigation, menu, overlay, a11y]
summary: Three vertical menus that share one MenuItem model and agree on almost nothing else — where focus lands, what a keyboard can reach, and who restores the trigger differs in each.
related: [menubar, panelmenu, popover, drawer, a11y-guidelines, toolbar]
covers: [menu, tieredmenu, contextmenu]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three menus rendered live, the attributes each root emits, the markup of one item, a group header
  usage: Which of the four and what it costs, Do/Don't on the pointer-only trigger and on escape:false, annotated source
  design: Shared Aura token chain, the focus indicator and the criterion it owes, panel placement per component, narrow viewport
  development: Input maps with the dead entries, the keyboard matrix, the extra tab stops, MenuItem fields per component
  i18n: Why no string comes from the library, a translated model as one computed, RTL and typeahead gaps
  history: Document changelog
---

## When to use
- **Commands off one control, or an inline panel** — `p-menu` flat, `p-tieredMenu` nested; `[popup]="true"` + `toggle($event)`, or neither inline.
- **Commands for a thing the user points at** — `p-contextMenu` with `[target]` or `[global]`.

## When not to use
- **Navigation.** `p-menu` renders both a `url` and a `routerLink` anchor (`openng-optimus-ui-menu.mjs:177`, `:191`), but all three hard-wire every anchor to `tabindex="-1"` (`:179`, `:193`) and announce the row as `menuitem`, never `link`. Destinations are `<nav>` + `<a>`.
- **A bar of menus** → `p-menubar`. **A value** → `p-select`. **Free content** → `p-popover`.

## Key API
All three extend `BaseComponent`, so they also take `dt`, `unstyled`, `pt`, `ptOptions` (`openng-optimus-ui-basecomponent.mjs:428`), absent from their compiled input lists. `model` differs: a setter that rebuilds the processed tree on `p-tieredMenu`/`p-contextMenu` (`openng-optimus-ui-tieredmenu.mjs:734`, `openng-optimus-ui-contextmenu.mjs:697`), a plain field the template iterates on `p-menu` (`:327`, `:965`).
- **`p-menu`** — `model`, `popup`, `tabindex` (`0`), `ariaLabel`/`ariaLabelledBy`, `appendTo` and the usual chrome (`:327-397`).
- **`p-tieredMenu`** — adds `breakpoint` (`'960px'`), `autoDisplay` (`true`) and `disabled`. `autoDisplay` only lets an item forward its mouseenter (`:246-250`); the menu acts on it only while `dirty` (`:1048`), set once a submenu was opened by click or key (`:1031`, `:1199`) — hover switches submenus, never opens the first.
- **`p-contextMenu`** — `triggerEvent` (`'contextmenu'`), `target`, `global`, `breakpoint`, `pressDelay` (`500`); no `popup` or `tabindex` (`openng-optimus-ui-contextmenu.mjs:1424`).
- **`MenuItem`:** all three read `badge`, but only `p-menu` (`:228-229`) and `p-contextMenu` (`openng-optimus-ui-contextmenu.mjs:339`) render a `<p-badge>`; the tiered menu a bare span (`openng-optimus-ui-tieredmenu.mjs:359`). `tooltip` is read by the tiered menu only (`:317`), `expanded`/`tooltipPosition` by none.

## Accessibility
- **The list is what a screen reader lands on.** `<ul role="menu">` with one `tabindex` and `aria-activedescendant` (`openng-optimus-ui-menu.mjs:897`); items are `<li role="menuitem">` named from `label`. `ariaLabel`/`ariaLabelledBy` are the only route in.
- **What the markup exposes, and what it omits.** A `p-menu` group header is `<li role="none">` (`:921`) with no `role="group"` and no `aria-labelledby` of its own — the list's (`:903`) names the whole menu; `aria-haspopup`, `aria-expanded`, `aria-setsize` and `aria-posinset` exist only on the nested pair (`openng-optimus-ui-tieredmenu.mjs:310-313`, `openng-optimus-ui-contextmenu.mjs:288-292`), and `aria-level` only on `p-contextMenu` (`:290`).
- **Aura's focus is a background swap** (`outline: 0 none`, no `:focus-visible` rule: `@openng/optimus-ui-styles/dist/menu/index.mjs:13`, `:51-53`; same in both siblings). The kit adds the ring: its one 2px `--primary-color-fg` ring inside the `.p-focus` item, and chevron and item icon (Aura 2.56:1) in `--text-color-secondary` (`src/styles.scss`; CONTRAST.MD "menu focus", 4.73:1+). Add none of your own.
- **Which key returns focus to the trigger differs.** In a `p-menu` popup Escape and Tab share one case (`:671-678`): both `focus(this.target)` then `hide()` without `preventDefault()`, so Tab then continues from the trigger. A `p-tieredMenu` **popup** restores it on Escape (`:1164-1168` via `:1288`; inline no trigger was recorded, so it lands on the root list); its Tab hides without the flag (`:1169-1176`). `p-contextMenu.hide()` has no `focus()` (`openng-optimus-ui-contextmenu.mjs:1253-1259`).

## Pitfalls
- **`p-contextMenu` can be pointer-only.** It binds its trigger once at init — off `target`/`global`, on the branch `isIOS() || isAndroid()` picks (`openng-optimus-ui-contextmenu.mjs:861-891`): with neither set nothing binds, a later change inert.
- **An open submenu list is focusable.** The nested list gets no `tabindex` or keydown binding, so it keeps the sub default `0` (`openng-optimus-ui-tieredmenu.mjs:437-453`, `:158`; `openng-optimus-ui-contextmenu.mjs:414-428`, `:142`); it is `display: flex` only while its item is active (`:26`). Tab on the root list hides first (`:1169-1176`, `openng-optimus-ui-contextmenu.mjs:1148-1155`), but an inline `p-tieredMenu` binds no outside-click listener (`:1229-1231`, popup only) and blur clears only `dirty` (`:1212-1217`) — a submenu open before focus left stays in the tab order.
- **`p-menu` groups per model, not per item.** `hasSubMenu()` is `model.some(i => i.items)` (`:854`) and the template branches once on it (`:908`/`:964`): if ONE top-level entry has `items`, every one becomes a `<li role="none">` header (`:921`) and only children are `menuitem` (`:953`). Group all or none.
- **`escape` is inverted across the three.** `p-menu` renders text unless `escape: false` (`:223`), which then bypasses the sanitizer (`SafeHtmlPipe`, `:135`); `p-tieredMenu` (`openng-optimus-ui-tieredmenu.mjs:344`) and `p-contextMenu` (`openng-optimus-ui-contextmenu.mjs:324`) test the raw value, so an unset `escape` takes the `[innerHTML]` branch — sanitized there, but markup all the same. Set `escape: true` in those two.
- **`p-menu` has no typeahead, and none of the three wraps.** Its default branch is a bare `break` (`:679-680`).
- **Inputs that reach nothing:** `showTransitionOptions`/`hideTransitionOptions` on `p-menu` (`:358`, `:364`) and `p-tieredMenu` (`:782`, `:788`); `p-menu`'s `#header` template, queried (`:869`) but rendered in no branch — and a `pTemplate="header"` becomes the item template via the `default:` arm (`:554-556`); `p-tieredMenu`'s `disabled`, reaching only the root `tabindex` (`:1484`); and half of `p-contextMenu`'s `breakpoint`, its mobile class keyed on an uncalled signal on a component lacking it (`openng-optimus-ui-contextmenu.mjs:38`).

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-menu.mjs` — roles, list branches, the key handler.
- `.../openng-optimus-ui-tieredmenu.mjs` — submenu wiring, typeahead, the breakpoint's reach.
- `.../openng-optimus-ui-contextmenu.mjs` — the once-bound trigger, lost focus.
- `.../openng-optimus-ui-basecomponent.mjs:428` — four inputs all accept, none declare.
- `@openng/optimus-ui-styles/dist/menu/index.mjs` and its two siblings — the focus rule.
- APG Menu and Menubar https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ — the pattern claimed and missed.
- WCAG 2.2 SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 a focus indicator owes.
- WCAG 2.2 SC 2.4.3 https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html — what a lost focus owes.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Flat commands behind a control | `p-menu [popup]="true"` + a named button, `toggle($event)` |
| Nested commands | `p-tieredMenu` + `ariaLabel`, submenus silenced via `pt` |
| Commands for a pointed-at region | `p-contextMenu [target]` **plus** a button |

## Rules
- MUST: name every menu with `ariaLabel`/`ariaLabelledBy`; entries are commands with a `label`.
- MUST: give every `p-contextMenu` a keyboard route too and restore focus in `onHide` — `show()` positions from `event.pageX/pageY` (`:1267-1268`), which a keyboard-synthesized click does not carry.
- MUST: rebuild `model` as a new array on every change, language switches too.
- SHOULD: walk open, descend, ascend, close by keyboard.
- NEVER: `escape: false` in `p-menu`, or an unset `escape` in the other two, on a label you did not write; `expanded`/`tooltipPosition` on an item of these three (`p-panelmenu` reads `expanded` as its panel state); `disabled` as a guard against opening.

## Default snippet
```ts
readonly items = computed<MenuItem[]>(() => [
  { label: this.i18n.translate('doc.rename'), command: () => this.rename(), disabled: this.locked() },
]);
```
```html
<p-button [label]="labels().actions" (onClick)="docMenu.toggle($event)" />
<p-menu #docMenu [model]="items()" [popup]="true" [ariaLabel]="labels().actionsMenu" />
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
