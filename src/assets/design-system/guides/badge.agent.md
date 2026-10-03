---
id: badge
title: Badge, pBadge, and Overlay Badge
category: library
tags: [status, count, indicator, a11y]
summary: Three deliveries of one span, and the number inside it is bare text that names nothing — so where the badge node lands, and where the fact is said instead, is the whole decision.
related: [tags-and-chips, button, feedback-messages, a11y-guidelines, avatar]
covers: [badge, overlaybadge]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The three deliveries rendered side by side, the markup each emits, and the size and severity matrix
  usage: Choosing between component, directive, and wrapper, Do/Don't on the dot and on the sizing input, annotated source
  design: Aura token chain, what follows the accent and the visual style, why every size owes 4.5:1, which criterion a dot owes, RTL, narrow viewport
  development: Input maps for the component and the directive, the four inherited inputs, the wrapper's dead input, the additive style appliers
  i18n: Getting a number into a sentence when translate() takes only a key, and the cap and plural rules nobody ships
  history: Document changelog
---

## When to use
- **A count or state marker on something that already has a name** — unread items on a bell, results on a filter.

## When not to use
- **The badge is the only place the information exists.** It renders text and nothing else: neither bundle contains an `aria` attribute or a `role`, so a screen-reader user gets a naked "3".
- **The text is the thing itself** (a status word, a category) → `p-tag`. **Something to press** → `p-button`.

## Key API
One `<span class="p-badge">` in three deliveries. All three extend `BaseComponent` and so also take `dt`, `unstyled`, `pt`, `ptOptions` (`openng-optimus-ui-basecomponent.mjs:428`), which none of them declares.
- **`p-badge`** — 6 own inputs: `value`, `severity`, `size`, `badgeSize`, `badgeDisabled`, `styleClass` (deprecated). Template `{{ value() }}` (`openng-optimus-ui-badge.mjs:392`); the host is the badge; `badgeDisabled` sets `display: none` (`:400`).
- **`[pBadge]`** — 10 own inputs: `value`, `severity`, `size`, `badgeSize`, `badgeDisabled`, `badgeStyle`, `badgeStyleClass`, `pBadgePT`, `pBadgeUnstyled`, `ptBadgeDirective` (deprecated); `disabled` is aliased `badgeDisabled` (`:303`). **`pBadge` takes no value** — it is the selector (`:308`), so `pBadge="7"` sets nothing.
- **`p-overlayBadge`** — 7 own inputs; wraps content in a `div` and renders the badge as its sibling (`openng-optimus-ui-overlaybadge.mjs:103-106`); `styleClass` and `style` go to that badge, not the `div` (`:105`).
- `severity` is `success | info | warn | danger | secondary | contrast`; omitted is the primary palette (`openng-optimus-ui-badge.mjs:42-47`). `size` also accepts `small` (`:39`).

## Accessibility
- **The value reaches the accessibility tree as unrelated text** — the badge's own text content, with no role, name, or owner, so nothing ties "3" to what is counted.
- **Where the node lands decides whether it joins an accessible name.** The directive appends the span as the host's last child (`:262`), so a `<button>` named from content becomes "Inbox 3"; on a custom element it goes into the first child (`:155-157`). `p-overlayBadge` renders it beside the content (`openng-optimus-ui-overlaybadge.mjs:103-106`), where it never joins the name.
- **An empty `value` is exposed to nothing at all.** It renders as `p-badge-dot` (`openng-optimus-ui-badge.mjs:38`) with no text node — right when the dot repeats what the text says, wrong when the dot is the statement.
- **A changing count is silent.** Neither bundle has a live region or `role="status"`, so 2 → 3 announces nothing.
- Badge text owes **SC 1.4.3, 4.5:1** at every size — none reaches large-scale — and a meaningful dot owes **SC 1.4.11, 3:1**. All text pairs are **gated** (`docs/generated/CONTRAST.MD`, "badge", lowest 5.02:1): the kit's `.p-badge` rule fills success/info/warn/danger with `--semantic-<hue>-fg` (white text in light, the hue's 950 in dark); a dot's edge on the page has no row.
## Pitfalls
- **`size` is dead on the wrapper, noisy on the directive — and on the directive `badgeSize` only lands at creation.** On `p-overlayBadge` `size` is declared (`openng-optimus-ui-overlaybadge.mjs:139`, compiled list `:102`) but the template forwards only `badgeSize` (`:105`); its setter still logs (`:88`). On `[pBadge]` `size` logs on every assignment (`openng-optimus-ui-badge.mjs:126`) and is the only size input `onChanges` destructures (`:172`) or acts on (`:182-184`); `badgeSize` is applied while the span is built (`:257`, `:259`) and never re-read, so a later change does nothing.
- **The directive's `badgeStyleClass` and `badgeStyle` only ever add — when they apply at all.** `applyStyles` appends classes and sets style properties (`openng-optimus-ui-badge.mjs:266-275`); nothing removes the earlier ones, and a `badgeStyle` that is not an object is dropped without warning (`:267`).
- **No cap, no locale.** Neither bundle contains `Intl`, `toLocaleString` or a maximum; the value is stringified verbatim (`:219-220`). "99+" and grouped thousands are yours.
- **Theme-dependent:** the default badge is `{primary.color}` (the kit accent); the radius is `{border.radius.md}` from the visual style (0 in `werkbund`), while one-character and dot badges stay round.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-badge.mjs` — component, directive, and injected CSS.
- `.../openng-optimus-ui-overlaybadge.mjs` — the wrapper's template, positioning, dead input, and RTL difference.
- `.../openng-optimus-ui-basecomponent.mjs:428` — the four inputs all three accept and none declare.
- `@openng/optimus-ui-styles/dist/badge/index.mjs:2-14`, `:16-22` — the rules consuming the tokens; no max-width, wrapping, or media query.
- `@openng/optimus-ui-themes/dist/aura/badge/index.mjs` (exports `root`, `dot`, `sm`, `lg`, `xl`, `colorScheme`) — size steps and color pairs.
- WCAG 2.2 SC 1.4.3 https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — 4.5:1 and the large-scale threshold.
- WCAG 2.2 SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 a meaningful dot owes.
- WCAG 2.2 SC 4.1.3 https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html — what a count that changes without user action owes.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Count that belongs to a control | `pBadge [value]="…"` on it, plus an `aria-label` stating the count |
| Marker over a wrapped block | `p-overlayBadge`, meaning stated in surrounding text |
| Number beside its own words | `p-badge` |

## Rules
- MUST: state the fact in an accessible name or a status region you own; the badge is the picture.
- MUST: size with `badgeSize`; on `[pBadge]` set it at creation and never rebind it.
- MUST: compute cap and formatting in a `computed()` before binding `value`.
- NEVER: leave a control's name to its content while a `[pBadge]` sits inside it — the number joins the name where you did not choose.
- NEVER: ship a dot badge, or a count, as the only carrier of its meaning.

## Default snippet
```ts
readonly badgeText = computed(() => (this.unread() > 9 ? '9+' : String(this.unread())));
readonly bellLabel = computed(() =>
  this.i18n.translate('notifications.bell.labelWithCount').replace('{count}', String(this.unread())));
```
```html
<!-- aria-label overrides name-from-content -->
<button type="button" [attr.aria-label]="bellLabel()">
  <i class="pi pi-bell" aria-hidden="true"></i>
  <p-badge aria-hidden="true" [value]="badgeText()" severity="danger" badgeSize="small" />
</button>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
