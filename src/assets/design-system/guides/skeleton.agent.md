---
id: skeleton
title: Skeleton
category: library
tags: [loading, feedback, layout]
summary: Hold the layout open while data is in flight — and the honest choice between a skeleton, a spinner, a progress bar, and nothing at all.
related: [button, progress, select, timeline]
covers: [skeleton]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground comparing four answers to one wait, ragged text lines, circles vs borderRadius, sizing precedence, animation="none"
  usage: The loading-state table, Do/Don't pairs, and keeping the promise a skeleton makes
  design: Anatomy, sizing precedence, color in both themes, the shipped animation, the kit's reduced-motion answer, layout shift in two numbers
  development: All seven inputs, why inline styles beat your stylesheet, SSR, what a skeleton announces (nothing) and who is responsible instead
  i18n: The skeleton has no strings but the wait does: percentage vs pixel widths, progress labels, RTL
  history: Document changelog, one line per version
---

## When to use
- A wait of ~0.3–5 s whose **incoming layout you can draw**: a card grid, an article body, rows of known height.
- Replacing content in place, where a jump would move the text being read.
- Repeating structures: the placeholder says how much is coming.

## When not to use
- Under ~300 ms → nothing. A placeholder that appears and vanishes reads as a glitch.
- Shape unknown (0 or 200 rows, no telling) → `p-progressspinner`.
- Progress is measurable (bytes, steps, items) → `p-progressbar`.
- Under a blocking whole-page wait (`app-loading-overlay`) — a skeleton behind a blur is wasted.

## Key API
`SkeletonModule` from `@openng/optimus-ui/skeleton`. **Seven inputs** — plain `@Input()` properties, not signals (`openng-optimus-ui-skeleton.mjs:62-97`) — **no outputs**, empty template (`:124`).
- `width` (default `'100%'`), `height` (default `'1rem'`) — INLINE styles, so a stylesheet rule needs `!important` to move them.
- `size` — one length for both dimensions; **overrides `width`/`height`**.
- `shape` — `'rectangle'` (default) | `'circle'` (`border-radius: 50%`; pair with `size`, or a non-square box gives an ellipse).
- `borderRadius` — any length/percentage; unset falls back to `--p-skeleton-border-radius` (6px).
- `animation` — default `'wave'`; only the literal `'none'` is recognized (`:18`), so `"shimmer"`, `"pulse"` and typos are silently the wave.
- `styleClass` — `@deprecated` (`:62-67`) but still bound into the host class (`:130`); prefer `class`.

## Accessibility
- **A skeleton announces nothing and cannot be made to.** The host binds `[attr.aria-hidden]="true"` as a constant (`openng-optimus-ui-skeleton.mjs:129`); the accessibility tree holds no node for it.
- **The announcement is the container's job.** `role="status"` + `aria-busy="true"` on the region being replaced, plus a `.sr-only` sentence naming what loads (the `.sr-only` utility is global in `styles.scss`).
- **Drop `aria-busy` when the content lands** and swap the sentence for the result ("42 entries loaded"); a region that stays busy may never be read out.
- **Motion:** the shimmer is `1.2s infinite` and the shipped CSS has **no `prefers-reduced-motion` guard**. The kit's global `*, *::before, *::after` catch-all in `styles.scss` makes it `1e-05s`/`1` under `reduce` — `!important` because Optimus's runtime `<style>` lands after the stylesheet, `0.01ms` rather than `none` so `animationend` still fires. Elsewhere, add it yourself.

## Pitfalls
- Placeholder box ≠ content box. One 1rem bar standing in for three 1.5rem lines shifts everything below by **56px**; a matched three-bar pair by **0**.
- "Loading" derived from `list.length === 0` — an empty result and a failed fetch shimmer forever, and the error handler that sets `[]` turns the shimmer back on.
- Identical stacked bars: a spinner with extra DOM. Mirror the structure.
- A count live region still bound to the unloaded data announces "0 of 0" during the wait — worse than silence. Guard the region on a loaded count.
- Undefined spacing utilities (`mb-3`, `mt-2` — no PrimeFlex here) render nothing, and another component's encapsulated class cannot reach a skeleton. Space with `gap` on the container.
- Fixed `px` widths on text placeholders (German runs 20–40% longer).
- `p-progressbar` emits an invalid `aria-level` (`openng-optimus-ui-progressbar.mjs:181`); the standalone `StripInvalidAriaDirective` removes it only where a component imports it.

## Sources
- WAI-ARIA 1.2 `aria-busy`: https://www.w3.org/TR/wai-aria-1.2/#aria-busy — normative "being modified"; why it belongs on the container.
- APG live regions: https://www.w3.org/WAI/ARIA/apg/patterns/alert/ — why a wait is polite, not assertive.
- WCAG 2.2 SC 2.3.3: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — what an infinite shimmer engages.
- WCAG 2.2 SC 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html — the 5s rule a skeleton outliving its fetch breaks.
- web.dev CLS: https://web.dev/articles/cls — the metric matched dimensions protect.
- NN/g Response Times: https://www.nngroup.com/articles/response-times-3-important-limits/ — the duration bands: judgment, not measurement.
- Optimus UI Skeleton: https://optimus.openng.org/skeleton/ — the vendor API.

## Semantic mapping
Indicator first, then props:

| Intent | Reach for |
| --- | --- |
| Wait under ~300 ms | nothing; announce the result instead |
| Known layout, bounded duration | `p-skeleton` in a `role="status"` region |
| Unknown layout or duration | `p-progressspinner` (real `ariaLabel` input) |
| Measurable progress | `p-progressbar` + `[attr.aria-label]` on the host (no `ariaLabel` input, still nameable) |
| Text line | `width="70%"` `height="1rem"`, widths varied per line |
| Chip / pill | `borderRadius="999px"` + explicit size |
| Avatar / icon | `shape="circle"` + `size="3rem"` |
| Motion must stop | `animation="none"` — that exact string |

## Rules
- MUST: give the container `role="status"` + `aria-busy="true"` and a hidden sentence naming what loads; drop it on arrival.
- MUST: match the placeholder's box to the content's box; measure, do not estimate.
- MUST: drive loading from an explicit flag, never `collection.length === 0`.
- MUST: ship an error branch and an empty branch beside the loading one.
- SHOULD: percentage widths and `rem` heights; they survive translation and reflow.
- SHOULD: verify reduced motion by emulating the media feature, not by reading CSS.
- NEVER: put ARIA on a `<p-skeleton>` — it is `aria-hidden` and prunes itself from the tree.
- NEVER: reach for one when you cannot draw the layout, or under a blocking overlay.

## Default snippet
```html
<!-- The container announces; skeletons are decoration. Four branches, not two. -->
<section role="status" [attr.aria-busy]="loading() ? 'true' : null">
  @if (loading()) {
    <span class="sr-only">{{ t('entryList.loading') }}</span>
    @for (row of placeholderRows; track row) {
      <p-skeleton width="70%" height="1.25rem" />
      <p-skeleton height="1rem" />
    }
  } @else if (error()) {
    <p>{{ t('entryList.loadFailed') }}</p>
  } @else if (entries().length === 0) {
    <p>{{ t('entryList.noEntries') }}</p>
  } @else {
    <span class="sr-only">{{ t('entryList.loaded', { count: entries().length }) }}</span>
  }
</section>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
