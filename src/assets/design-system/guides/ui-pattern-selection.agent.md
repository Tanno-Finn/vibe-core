---
id: ui-pattern-selection
title: UI Pattern Selection
category: foundations
tags: [patterns, decisions, reuse, components]
summary: Choose the layer before the control — five needs are answered by the kit itself before the library is reached, a documented library component states its own boundaries in its own guide, and what is left over is plain HTML.
related: [color-system, typography, article-layout, demo-layout, hub-layout]
covers: []
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Three ways to attach an explanation and a titled block built twice, kit primitive against library card, both rendered
  usage: The three-layer question, the needs the kit answers itself, the routing table into the owning guides, and three Do/Don't pairs
  design: The interruption ladder, the surface hierarchy, the corpus's two declared gaps, and which patterns a narrow screen rules out
  development: The decision as CLI calls, the registry-or-exclusion fork, what each gate can and cannot settle, and an acceptance checklist
  i18n: The three pattern choices a longer string overturns, and why a simplified reading level argues against icon-only controls
  history: Document changelog, one line per version
---

## When to use
- Choosing a control, container, overlay, or feedback channel.
- Deciding whether to build a component or reuse one that already exists.
- Settling a boundary between two candidate patterns before writing markup.

## When not to use
- The API, mechanics, or wiring of one chosen pattern — that pattern's own guide.
- Token values, color pairings, focus rings, name and string budgets — `design-tokens`, `color-system`, `a11y-guidelines`, `i18n-localization`.
- The anatomy of an article, demo, or hub page — `article-layout`, `demo-layout`, `hub-layout`; grid rhythm and spacing composition, nothing yet.
- Whether a new component belongs in the gallery — `directives/design-system.md` and `/new-component`.

## Key API
Three layers, asked in that order. Two of them answer without a judgment.

1. **Kit primitive** — `design-guides.mjs list --layer kit`, then `search "<need>" --scope all`. Each carries a six-section doc under `src/assets/design-system/`.
2. **Library guide** — `section <id> "when to use"` for one, `sections "When to use"` for all of them in one call, `bundle <id>` for a guide plus its neighbors. The owning guide is authoritative; `coverage` lists the library components no guide explains yet, whose boundaries exist only where a sibling mentions them.
3. **Plain HTML** — whenever the library component would add only state machinery you never switch on.

The reading ladder itself, and the reuse-before-build rule underneath it, are `directives/design-system.md`.

## Accessibility
- Choosing the pattern chooses the accessibility contract. A role nobody can reach is a wrong pattern, not a wiring defect; the wiring is `a11y-guidelines`.
- The explanation ladder: `pTooltip` restates an icon-only control's own name, `app-info-tooltip` carries one or two sentences and opens on click or focus, anything longer is body text.
- The native `title` attribute is not an explanation channel — user agents withhold the accessible exposure the HTML standard requires, so the standard discourages relying on it.
- An overlay has no address of its own: unless you mirror its state into the URL, nothing about it is linkable or reloadable — which alone can settle the choice.

## Pitfalls
- **Building before asking the gallery.** Every component file under `src/app/components/` is either registered in `src/app/dev/design-registry.ts` or listed in `src/app/dev/design-registry.exclusions.json` with a reason, and `scripts/check-design-system.mjs` fails on neither and on both. A near-duplicate pays that decision twice.
- **Reaching for the library where the kit has its own channel.** `ToastService` (rendered by `app-toast-container`) and `app-loading-overlay` are mounted by the shell; a second competes with the first.
- **Paraphrasing a threshold from memory.** Option counts, width limits, and the on-click/on-submit split live in the owning guide's `When to use`, and they move.
- **A dialog used as a container.** `dialog`: never the default; tabs or steps inside one mean it is a page.
- **A pattern chosen at the desktop width.** A segmented control that does not fit one line, a tab strip past roughly four labels and a column set on a phone all fail before styling.

## Sources
- W3C WAI-ARIA Authoring Practices, patterns index: https://www.w3.org/WAI/ARIA/apg/patterns/ — the keyboard contract each pattern name commits you to, library or not.
- WCAG 2.2 SC 1.4.13, Content on Hover or Focus: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html — what an author-built hover bubble owes; its user-agent exception excludes native tooltips.
- WCAG 2.2 SC 3.2.4, Consistent Identification: https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html — the cost of solving one need two ways in one product.
- WCAG 2.2 SC 1.3.1, Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html — the structure a visual pattern still owes.
- HTML Living Standard §3.2.6.1, the `title` attribute: https://html.spec.whatwg.org/multipage/dom.html#attr-title — the exposure it requires, and the reliance it discourages.

## Semantic mapping
| Intent | Pattern |
| --- | --- |
| A titled, optionally collapsible block | `app-standard-container` |
| Long-form prose with reading chrome | `app-text-container` |
| One or two sentences of help by a control | `app-info-tooltip` |
| The name of an icon-only control | `pTooltip`, beside the accessible name → `tooltip` |
| "It worked", gone in seconds | the kit's `ToastService` |
| A condition that stays true, beside what it constrains | `p-message` → `feedback-messages` |
| A wait whose incoming layout you can draw | `p-skeleton` → `skeleton` |
| A self-contained sub-task the user just asked for | `p-dialog` → `dialog` |
| A view that must be linkable | a route |
| Records compared across columns, with real sorting or paging | `p-table` → `table` |

## Rules
- MUST: ask the gallery before building — `list --layer kit`; roughly 80 % coverage means use or extend.
- MUST: read the owning guide's `When to use` before choosing between two library components, not a threshold you remember.
- MUST: use the kit's channel where it has one — `ToastService` for a transient notice, `app-loading-overlay` for the shell-level wait, `app-standard-container` for a titled block.
- MUST: give a view a route when it has to be linkable, reloadable, or shareable.
- SHOULD: take the least interruptive rung that still works — in place, then anchored, then edge panel, then modal.
- SHOULD: prefer plain HTML when the library component contributes only unused state.
- NEVER: put explanatory text in a native `title` attribute.
- NEVER: settle a pattern without checking it at the narrowest width you support.

## Default snippet
```sh
node scripts/design-guides.mjs list --layer kit                     # 1. does the kit ship it?
node scripts/design-guides.mjs section selectbutton "when to use"   # 2. who owns the boundary?
node scripts/design-guides.mjs bundle dialog                        #    (+ its neighbors)
# 3. neither -> plain HTML.
```
```html
<app-standard-container [config]="{ type: 'info', title: heading(), headingLevel: 2 }">
  <label>
    Threshold
    <app-info-tooltip [text]="help()" forLabel="Threshold"></app-info-tooltip>
  </label>
</app-standard-container>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
