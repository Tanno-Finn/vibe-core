---
id: card
title: Card
category: library
tags: [container, layout, surface]
summary: A surface with a shadow around self-contained content — six divs with no role, no heading, and no name, and the boundary work that leaves you.
related: [skeleton, table, tabs, button, timeline, carousel]
covers: [card]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Slot playground, the rendered anatomy with a styled/unstyled table, the equal-height row, a stretched-link card
  usage: Container table against panel, fieldset, section, and the kit containers; when p-card is wrong; three Do/Don't pairs
  design: The rules that style a card (5 preset + kit overrides), Aura token chain, contrast per theme, geometry
  development: The four inputs, the template routes and how each goes silent, pt targets, the body-stretch fix, checklist
  i18n: The two translatable inputs, length risk in a card grid, and the measured RTL result
  history: Document changelog
---

## When to use
- A surface around self-contained content: a grid tile, a list row, an error box.
- The surrounding page supplies the outline; you want a box, not a region, group, or section.

## When not to use
- The box needs a name in the accessibility tree, or collapses → `p-panel` (`role="region"` + `aria-labelledby`, real toggle; `openng-optimus-ui-panel.mjs:395-396`).
- Form controls under one label → `p-fieldset` (native `<fieldset>`/`<legend>`, `openng-optimus-ui-fieldset.mjs:270-271`).
- A section of the page outline → `<section>`/`<article>` plus a heading. A titled portal block → `app-standard-container` (i18n title key, real heading via `headingLevel`, collapsible); prose → `app-text-container`.
- The whole box is the control → a real link or button inside it, never a host handler.

## Key API
`CardModule` from `@openng/optimus-ui/card`; content projected, no outputs. `:NNN` = lines in `openng-optimus-ui-card.mjs`.
- **Four plain `@Input()`s.** `header` (string) renders into **`.p-card-title`**, not `.p-card-header` (`:207`); `subheader` into `.p-card-subtitle` (`:215`); both ignored when the matching template is present (`:208`, `:216`). `style` is a setter writing onto the host (`:113-128`); `styleClass` is `@deprecated` but live (`:198`). Style the host with `class`.
- Slots `header`, `title`, `subtitle`, `content`, `footer` via `#name` templates; the root is the `<p-card>` element itself. `pTemplate` binds too (`PrimeTemplate` query `:315-318` → `onAfterContentInit` `:173-196`).
- **The queries are asymmetric.** `#name` queries pass `{ descendants: false }` (`:300-315`): one wrapper deeper and the slot silently does not render. `headerFacet`/`footerFacet` are bare `ContentChild(Header|Footer)` (`:294-299`), so a nested `<p-header>` *is* found and yields an **empty** `.p-card-header`. A control-flow block resolves if true at content-init but never restores the slot later.
- `<p-header>`/`<p-footer>` come from `SharedModule` (`openng-optimus-ui-api.mjs:709`, `:722`); the standalone `Card` alone leaves them inert, no error. Prefer `#header`/`#footer`.

## Accessibility
- **The card contributes nothing.** No role, name, landmark, focus, or keyboard: host and all six inner `<div>`s are generic. Naming the box is your markup's job.
- **`[header]` is not a heading.** A 20px/500 `<div>`: looks like one, invisible to a heading list. Use `<ng-template #title><h3>…</h3></ng-template>`.
- A list of cards is a `<ul>`/`<li>`, or each card gets a role and name via `pt.root` (merged onto the host from `onAfterViewChecked`, `:96`).
- **The edge comes from the kit, not the card.** Card surface vs page ground is 1.02–1.13:1 in every visual style — no boundary. Each style block outlines `.p-card` with `--style-outline` ("panel outline", 3.85:1+); outside the kit only a faint shadow remains, and forced colors drop it. Legal (a card edge is not a UI component), but give tile-like cards a real border there.
- Subtitle (`{text.muted.color}`) is **4.76:1** on the white light card — AA at 16px with no headroom; never shrink or lighten it. Dark body text is the style's `--text-color` on `--surface-card` (CONTRAST.MD body-text rows).

## Pitfalls
- **`.p-card-caption` is dead.** In the class map (`:25`) and Aura ships `card.caption.gap`, but the template (`:198-233`) renders no caption: `pt.caption` no-ops.
- **The `display: block` trap.** The preset makes `.p-card` a flex column, but the bundle appends `.p-card { display: block }` after it (`:14-20`), so block wins. Equal-height rows need **three rules**: `p-card { display: flex; flex-direction: column }`, `.p-card-body { flex: 1 }`, `.p-card-footer { margin-top: auto }` — the inner two via `pt.body`/`pt.footer` when scoped.
- **The preset styles no header and no footer.** The footer inherits the body's 0.5rem gap; the header gets nothing — except in this kit's DARK mode, where `styles.scss` fills `.p-card-header` with `--surface-section` (`!important`).
- **Geometry is the style's.** Every style block sets the card's border, radius, and shadow (werkbund: radius 0; stock Aura: 12px). The host does not clip and no slot has a radius, so a filled header paints square corners: add `overflow: hidden`. Body padding and title are 1.25rem.
- **On a narrow screen** the card does nothing: width comes from the parent; the grid around it does the reflowing.

## Sources
- ARIA 1.2 `region`: https://www.w3.org/TR/wai-aria-1.2/#region — what `p-panel` has and `p-card` lacks.
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — the 4.5:1 the subtitle clears by 0.26.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — why a faint card edge is legal, not right.
- HTML `<fieldset>`: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element — the native grouping `p-fieldset` gives you.
- Optimus UI Card: https://optimus.openng.org/card/ — vendor API, checked against shipped source 2.0.2.

## Semantic mapping
| Intent | Props |
| --- | --- |
| Tile with a visible edge | the kit's style outline, or `class` with a border + `overflow: hidden` |
| Titled card in the outline | `<ng-template #title>` with a real heading |
| Named group for AT | `[pt]="{ root: { role: 'group', 'aria-labelledby': id } }"` |

## Rules
- MUST: one real heading per content card via `#title`, not `[header]` alone.
- MUST: every slot template an unconditional **direct child** of `<p-card>`; import `CardModule` (not bare `Card`) for `<p-header>`/`<p-footer>`.
- MUST: a visible edge wherever the boundary carries meaning — never the shadow alone; `overflow: hidden` when a slot has a background.
- SHOULD: actions in `#footer`; `class`, never `styleClass`; all three stretch rules on a row of cards with footers.
- NEVER: a click handler, `tabindex`, or `role="button"` on the host; a fixed card height; `pt.caption`.

## Default snippet
```html
<p-card class="event-card" [subheader]="labels().meta">
  <ng-template #title>
    <h3>{{ labels().title }}</h3>
  </ng-template>
  <p>{{ labels().teaser }}</p>
  <ng-template #footer>
    <p-button [label]="labels().read" (onClick)="open()" />
  </ng-template>
</p-card>

<!-- .event-card { overflow: hidden; } — outside the kit's style blocks add a border: 1px solid var(--surface-border) -->
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
