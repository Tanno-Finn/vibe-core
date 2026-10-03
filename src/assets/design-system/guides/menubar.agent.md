---
id: menubar
title: Menubar
category: library
tags: [navigation, menu, a11y]
summary: A bar of menus for commands — one tab stop, arrow keys inside, a second branch below a breakpoint, and the role question deciding whether it belongs in a site header.
related: [tabs, drawer, menu, panelmenu, button]
covers: [menubar]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, a three-level bar, the mobile branch pinned open, an LTR/RTL pair, the same nav as plain links
  usage: Which-navigation table, the a11y-tree reading, which pt keys survive on a chrome bar, sources, Do/Don't
  design: Aura tokens vs what this kit renders, Aura stock contrast per surface, the focus finding, geometry per style, motion
  development: Inputs, MenuItem fields, the measured keyboard matrix, templates, pt per branch, dead ends, SSR, checklist
  i18n: The one library string, model as a computed, the escape branch, length, the measured RTL result
  history: Document changelog
---

## When to use
- A menu of **commands** with submenus — an application's File/Edit bar: one tab stop, arrow keys inside, `item.command` per leaf.
- You accept the menu pattern's price: entries leave the tab order.

## When not to use
- **Website navigation.** Destinations are links: a `<nav>` plus `<a>`, this kit's convention (`src/app/components/frame/app-header.component.ts`).
- Parallel views → `p-tabs`. Phone nav → `p-drawer`. One button, one menu → `p-menu`/`p-tieredmenu`. Link columns → `p-megamenu`.

## Key API
- `MenubarModule` from `@openng/optimus-ui/menubar`. `model: MenuItem[]` is a plain setter that rebuilds the item tree (`openng-optimus-ui-menubar.mjs:660-663`); mutating in place does nothing — pass a new array (a `computed()`).
- `breakpoint` (**`'960px'`**, `:697`) feeds `matchMedia` once in `onInit` (`:787-788`, `:874`); later changes are inert.
- `autoDisplay` (**`true`**, `:687`) gates hover-opening (`:215`), only after a first click inside (`dirty`, `:929`/`:1010`). `autoHide`/`autoHideDelay` are read once (`:789-790`).
- `ariaLabel`/`ariaLabelledBy` land on the root list (`:1364-1365`), the only naming route. `styleClass` works (`@deprecated`, host class, `:1465`) — prefer `class`. `autoZIndex`/`baseZIndex` are **inert**: passed down (`:1360-1361`), read nowhere; the mobile panel takes `config.zIndex.menu` (`:985`).
- Outputs `onFocus`/`onBlur`; templates `#start`, `#end`, `#item`, `#menuicon`, `#submenuicon` (`descendants: false`). **No motion layer**: panels switch with `display`. `OnPush` (`:1461`).
- `MenuItem`: `label`/`items`/`command`/`icon`/`badge`/`separator`/`disabled`/`visible`/`url`/`routerLink`/`escape`/`styleClass` apply; tooltips only via `tooltipOptions`. **Not** read: `expanded`, `tabindex`, `tooltip`.

## Accessibility
- **Every list is `role="menubar"`** — a static host binding on the recursive component (`:587`), so submenus announce as menu bars too. Items are `role="menuitem"` (`:244`) with `aria-haspopup`, `aria-expanded`, `aria-setsize`/`aria-posinset` (`:251-254`); `disabled` items stay in the counts with `aria-disabled` (`:250`).
- **The name is the raw `label`** (`:249`): markup is announced verbatim whatever `escape` says, `#item` cannot override it, and a badge is never in it.
- One tab stop: the root `<ul tabindex="0">` (`:1357`) driving `aria-activedescendant` (`:1366`). Item anchors are `tabindex="-1"` (`:272`), yet still surface as `link` nodes duplicating the name.
- **Aura's focus indicator is a background swap** (1.10:1 light / 1.19:1 dark) and its chevron and item icon 2.56:1. The kit already fixes all three (`src/styles.scss`): the one 2px `--primary-color-fg` ring inside the `.p-focus` item, chevron and icon in `--text-color-secondary` — gated in CONTRAST.MD "menu focus" (ring 4.73:1+, chevron and icon 4.76:1+, bar and panel). Add no ring rule of your own.
- APG deviations: arrows do **not** wrap (`:1278-1281`); `ArrowDown` on a root leaf is not canceled — **the page scrolls** (`:1161-1168`); `Escape` closes **all** levels (`:999`); `Enter`/`Space` on a root group leaves the cursor outside.
- Mobile: the hamburger is an `<a role="button" tabindex="0">` (`:1333-1340`) named from `aria.navigation` (`openng-optimus-ui-config.mjs:187`); it wears the same kit ring.

## Pitfalls
- **An empty model still renders a menu bar** (the guard at `:1332` only hides the hamburger). `pt.rootList` with `tabindex: '-1'` and `'aria-hidden': 'true'` removes it; `role` cannot be set this way (`:587` wins). Never `aria-hidden` a menubar with items.
- **`escape` has no default**: labels go through `[innerHTML]` (`:285`/`:298`) unless `escape: true`.
- **`id="…"` as an attribute duplicates the id** onto host and root list; the `uuid('pn_id_')` fallback (`:794`) differs per platform.
- **Mobile `Escape` does not close**: `hide()` (`:993-1002`) never resets `mobileActive`; the panel stays open at `aria-expanded="true"`.
- **No collision handling**: at a viewport edge both panel levels overflow; neither flips.
- **Dead ends:** `aria-haspopup` reads `item.to` (`:251`), absent from `MenuItem`; a submenu's `aria-labelledby` (`:392`) dangles under a `routerLink` parent — only the plain branch stamps the id (`:289`/`:299`).
- **Radius follows the visual style** (`{border.radius.md}` via `presetOverrides`, `src/app/services/ui-styles.ts`), but the kit's header rule sets every `p-menubar` to radius 0.
- SSR prerenders the **desktop** branch; a narrow client repaints after hydration.

## Sources
- APG Menubar: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ — the pattern claimed, and the clauses missed.
- ARIA 1.2 `menuitem`: https://www.w3.org/TR/wai-aria-1.2/#menuitem — a choice in a menu, not a place.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — what Aura's focus swap and chevron miss.
- PrimeNG Menubar (the fork's upstream): https://primeng.org/menubar — defaults re-read in Optimus 2.0.2's source.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Command menu with submenus | grouped `[model]` + `ariaLabel` + `breakpoint` |
| Site navigation | none — `<nav>` + `<a>` |
| Header chrome | `[model]="[]"` + `#start`/`#end` + `pt.rootList` tabindex/aria-hidden |

## Rules
- MUST: entries are commands, not destinations; name the bar; `label` on every item.
- MUST: rebuild `model` as a new array on every change; set `breakpoint` to your layout's and walk **both** branches by keyboard.
- SHOULD: `escape: true` for plain-text catalogs; submenus clear of the viewport edge.
- NEVER: an empty model without `pt.rootList` silencing the list, `role` via `pt`, `styleClass`, or `expanded`/`tabindex`/`tooltip` on a `MenuItem`.

## Default snippet
```html
<!-- menuModel(): a computed<MenuItem[]>() over the translation service. -->
<p-menubar
  [model]="menuModel()" [ariaLabel]="labels().menuName"
  breakpoint="60rem" [autoHide]="true" class="command-bar">
  <ng-template #end><a routerLink="/help">{{ labels().help }}</a></ng-template>
</p-menubar>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
