---
id: timeline
title: Timeline
category: library
tags: [layout, collection, a11y]
summary: A rail of markers with content beside it — six divs of pure geometry that ship no role, no name, and no keyboard, and an alternating layout with no narrow-screen answer.
related: [card, table, skeleton]
covers: [timeline]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Layout playground across align and layout, the rendered anatomy, the empty opposite half, the narrow-screen fallback
  usage: Delineation against the kit's two own timelines and the library alternatives, the slot contract, Do/Don'ts
  design: Aura token chain, the preset's rule set, geometry, why a :root token override is inert, the 360px statement
  development: The four inputs, slot queries, pt sections, OnPush and track semantics, SSR, checklist
  i18n: Zero library strings, the date in the opposite slot, length inside a fixed half-width, the hard-coded LTR root
  history: Document changelog
---

## When to use
- A **chronological or staged sequence** where order is the message, each entry is read, not chosen, and the rail geometry — marker, connector, two halves — is all you want. You accept a pure layout shell: no state, keyboard, or semantics.

## When not to use
- Progress through the app's flow → `p-steps`/`p-stepper`. Records compared by column → `p-table`. Collapsible chapters → `p-accordion`.
- **Inside portal content the kit's own timelines outrank it:** `app-timeline` (dated event list with `role="list"`/`listitem` and `headingLevel`) and `app-interactive-timeline` (year rail of `aria-pressed` buttons). `p-timeline` is for a full-page chronology.

## Key API
`TimelineModule` from `@openng/optimus-ui/timeline`; content projected — **no outputs, no methods, no service**. `:NNN` = `openng-optimus-ui-timeline.mjs`.
- **Four plain `@Input()`s**, no signals (`:157`): `value`, `layout` (`'vertical'|'horizontal'`, **'vertical'**), `align` (**'left'**), `styleClass` (deprecated, `:92`, still live — use `class`). `pt`/`dt`/`unstyled` are inherited (`openng-optimus-ui-basecomponent.mjs:428`).
- **`align` is typed `string`** (`types/openng-optimus-ui-timeline.d.ts:97`); its JSDoc omits `'alternate'` (`:94`), which is fully styled (`@openng/optimus-ui-styles/dist/timeline/index.mjs:32-50`, `:150-152`). The value becomes the root class `p-timeline-<align>` verbatim (`:14`): a typo styles nothing, errors nowhere. **`align="top"` has no rule**; only `p-timeline-bottom` does (styles `:154`).
- **Three slots, direct children only:** `#marker`/`#content`/`#opposite`, `ContentChild(…, { descendants: false })` (`:227`, `:230`, `:233`) — one wrapper deeper and the slot silently does not render. `pTemplate` also binds (`:234` → `:135-149`).
- **Pass-through sections** (`:13-21`): `host`, `root` (merged onto the host each `AfterViewChecked`, `:82-84`), `event`, `eventOpposite`, `eventSeparator`, `eventMarker`, `eventConnector`, `eventContent`. The root is `<p-timeline>` itself (`:212`).

## Accessibility
- **Nothing reaches the accessibility tree:** zero `role`, `aria`, `tabindex`, or `Output` in the bundle — six generic `<div>`s.
- **Restore list semantics through `pt`:** `{ root: { role: 'list', 'aria-label': … }, event: { role: 'listitem' } }`. The preset already resets the root like a list (`list-style: none`, styles `:7`).
- **DOM order is stable under every `align`:** opposite → separator → content (`:159-176`); `alternate` only flips even events visually (`row-reverse`, styles `:32-34`). `#opposite` is announced **before** its entry — the date and nothing else.
- **Marker and connector are decorative:** empty `<div>`s (`:167`, `:170`), needing no `aria-hidden`. A marker *template* with an icon does; a marker whose **color** encodes a category fails SC 1.4.1 without a text carrier.
- **Keyboard reaches only your slot content;** a scrolling horizontal timeline needs your own focusable, labeled container (SC 2.1.1).
- The marker ring and connector read Aura's `{content.border.color}` (1.13–1.76:1, `progressbar.background` rows); if they carry meaning, repaint from `--control-border` ("control boundary", ≥ 3.97:1 on the card, every style). No style block touches the timeline.

## Pitfalls
- **`value` is a plain `@Input()` under `OnPush`** (`:217`, `:208`): mutating in place renders nothing — assign a new array. `track event` is object identity (`:158`): rebuilt objects recreate every node.
- **The opposite box always renders, even empty** (`:160-162`), `flex: 1` beside `flex: 1` content (styles `:71-77`) — symmetric for `alternate`, half the width lost for `align="left"`. Reclaim it with `pt.eventOpposite` at `flex: 0`.
- **No responsive behavior:** no media query, no breakpoint input — still two columns at 360 px. Switch `align` from your own media query, or swap in a list.
- **Per-event alignment classes do not exist.** Only the root carries `p-timeline-<align>`; a `.p-timeline-event-left`/`-right` rule matches nothing — key on `:nth-child(odd|even)` or the root class.
- **A `:root` token override is inert:** `--p-timeline-*` is written to `:root,:host` by a runtime `<style>` injected after the app stylesheet (`@openng/optimus-ui-styled`) — scope overrides to an ancestor. `ViewEncapsulation.None` (`:209`): a bare `.p-timeline-event` rule retunes every timeline.

## Sources
- WAI-ARIA 1.2 `list`/`listitem`: https://www.w3.org/TR/wai-aria-1.2/#list — what `pt` restores.
- CSS Flexbox 1, Reordering and Accessibility: https://www.w3.org/TR/css-flexbox-1/#order-accessibility — the rule for `row-reverse`, i.e. `alternate`.
- WCAG 2.2 SC 1.3.2: https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html — what the alternating layout clears.
- WCAG 2.2 SC 1.4.1: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — why a color-coded marker needs a second carrier.
- Optimus UI Timeline: https://optimus.openng.org/timeline — vendor API, checked against 2.0.2 source.

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| A chronology assistive tech can enumerate | `[pt]` root `role: 'list'` + `aria-label`, event `role: 'listitem'` |
| Date beside the entry | `<ng-template #opposite>` — announced before the content |
| Single column, no wasted half | `align="left"` plus `pt.eventOpposite` at `flex: 0` |
| Category on the marker | icon `aria-hidden`, category as text in `#content` |

## Rules
- MUST: give the root a role and a name through `[pt].root`; assign a new array to `value`.
- MUST: keep every slot template a direct child of `<p-timeline>`; repeat any marker color as text.
- SHOULD: only the date in `#opposite`, as a `<time>`.
- NEVER: style `.p-timeline-event-left`/`-right`, override `--p-timeline-*` on `:root`, or trust `align` to type-check.

## Default snippet
```html
<p-timeline [value]="events()" align="alternate"
  [pt]="{ root: { role: 'list', 'aria-label': labels().chronology }, event: { role: 'listitem' } }">
  <ng-template #opposite let-event>
    <time [attr.datetime]="event.iso">{{ event.year }}</time></ng-template>
  <ng-template #marker let-event>
    <span class="tl-marker"><i [class]="event.icon" aria-hidden="true"></i></span></ng-template>
  <ng-template #content let-event>
    <h3>{{ event.title }}</h3><p>{{ event.summary }}</p></ng-template>
</p-timeline>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
