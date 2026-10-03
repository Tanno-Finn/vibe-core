---
id: carousel
title: Carousel and Galleria
category: library
tags: [collection, media, motion, a11y]
summary: Mostly a guide on when not to hide content behind slides — and, where you do, the names, button types, and rotation controls the two components leave to you.
related: [card, stepper, dataview, button]
covers: [carousel, galleria]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: A named manual carousel, a rotating one with stop button, focus stop, hover pause and reduced motion, a galleria with thumbnails
  usage: Whether content belongs in a carousel, the click-through evidence, Do/Don't on hidden content and navigator names, sources
  design: Carousel and galleria tokens, indicator contrast and target size, narrow viewport and touch, motion
  development: API table, what each part exposes to assistive technology, recipes for rotation and an Escape-closing full screen
  i18n: The aria keys both components read, which the kit translates, per-instance labels, direction
  history: Document changelog
---

## When to use
- **Rarely.** A few optional, equal-weight items where the page still works if only the first is ever seen → `p-carousel`, manual.
- A set of related images meant to be compared → `p-galleria` with thumbnails.

## When not to use
- The key message, or anything a reader must see → put it on the page. About 1% of visitors click a home-page carousel, 84% of those on slide one (Runyon 2013).
- Three to eight teasers → a grid of cards (Card guide). Sequential steps → Stepper.
- Anything that must rotate on its own: moving content reads as advertising and outruns slow readers (Nielsen, NN/g 2013).

## Key API
`Carousel` (standalone) from `@openng/optimus-ui/carousel`; `GalleriaModule` from `@openng/optimus-ui/galleria` (`p-galleria` is not standalone, `openng-optimus-ui-galleria.mjs:628`).
- **Carousel**: `value`, `numVisible`/`numScroll` (1/1), `responsiveOptions` (`breakpoint`, `numVisible`, `numScroll`), `orientation`, `circular`, `showNavigators`/`showIndicators` (true), `autoplayInterval` (0), `prevButtonProps`/`nextButtonProps` (default `{ severity: 'secondary', text: true, rounded: true }`, `openng-optimus-ui-carousel.mjs:285-298`), `page` + `onPage`; templates `#item` (implicit item, no index), `#header`, `#footer`. Public `startAutoplay()`, `stopAutoplay(changeAllow = true)`, `isPlaying()` (`openng-optimus-ui-carousel.d.ts:357-359`).
- **Galleria**: `value`, `[(activeIndex)]`, `numVisible` (3), `showThumbnails` (true), `thumbnailsPosition`, `showItemNavigators` (false), `showIndicators` (false), `circular`, `autoPlay` (false, live input, `:1293-1300`), `transitionInterval` (4000), `shouldStopAutoplayByClick` (true), `fullScreen` + `[visible]`/`(visibleChange)`; templates `#item`, `#thumbnail`, `#caption`.

## Accessibility
- **Carousel host** is `role="region"` with no name (`:871`) — set `aria-label` on `p-carousel`.
- **Navigators are unnamed.** The label is bound to the `p-button` host (`:881`, `:945`); the inner button reads only `ariaLabel`/`buttonProps.ariaLabel` (`openng-optimus-ui-button.mjs:835`). The previous button has no `type` (`:878-897`). At the ends both stay enabled; only a `p-disabled` class marks them.
- Slides: `role="group"`, `aria-roledescription` "Slide", name from a **zero-based** index (`:917-920`). Off-page slides are `aria-hidden` but not inert (`:918`) — focusable content stays in the tab order. Circular trailing clones carry no `aria-hidden` (`:928-937`).
- Indicators: native buttons named from `pageLabel` ("Page 2" in the kit), `aria-current="page"`, roving tabindex, the kit's 2px ring; Arrow Left/Right move focus only (`:656-665`); Home/End/Tab handlers are unwired (`:675-691`). 32×8 px — SC 2.5.8 only by spacing. Active fill `primary.color` (4.75:1+); inactive `surface.200`/`surface.700`, the informational `progressbar.background` rows: 1.23–1.61:1 on the card — keep the named buttons visible.
- `aria-live` is polite **while** autoplay runs and off otherwise (carousel `:877`, galleria `:964`) — the reverse of APG.
- **Galleria**: item navigators are `<button role="navigation">` with no name (`:1394`, `:1415`) — leave them off. Indicators are `<li tabindex="0" aria-selected>` (`:1429-1438`). Thumbnails: `role="tablist"` without tabs (`:1974`), each named from `pageLabel` (`:1989`); keys Arrow Left/Right, Home, End, Enter, Space (`:1769-1797`) — name each image in `#item`. Full screen: `role="dialog"` + `aria-modal`, no name, focus trap (`:642-643`, `:664-665`), close button focused (`:583-587`), **no Escape handler, no focus return** (`:594-597`).
- **Rotation (SC 2.2.2)**: neither component has a stop control. Ship a stop/start button before the carousel; stop on `focusin`, pause on hover; do not start when `prefersReducedMotion()` (`src/app/utils/reduced-motion.ts`) is true.

## Pitfalls
- Any navigation stops carousel autoplay for good (`:626`, `:637`, `:646`); changing `autoplayInterval` later neither starts nor stops it.
- `startAutoplay()` does not clear a running interval (`:746-759`) — guard with `isPlaying()`. It uses `autoplayInterval` as the delay, so a 0 steps as fast as the browser allows — keep it above zero.
- `responsiveOptions` breakpoints: CSS media query from the string (`:512-545`), JS match by `parseInt` against `window.innerWidth` (`:553-557`) — use px, never rem.
- Touch: every cancelable `touchmove` on the viewport is prevented (`:789-793`), so a vertical scroll starting on the carousel does not scroll the page.
- A replacement `prevButtonProps` object drops the defaults — restate severity, text, rounded.
- The slide transition is inline 500 ms (`:737`); the kit's reduced-motion rule cuts it, but not the timers.
- The kit hands `slide`, `pageLabel`, `prevPageLabel`, `nextPageLabel` and `close` over in the page language (`OPTIMUS_ARIA_KEYS`); `slideNumber` stays the bare, zero-based number on purpose.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-carousel.mjs`, `openng-optimus-ui-galleria.mjs` — every role, key, and timer above; aria defaults in `openng-optimus-ui-config.mjs` (`:184`, `:198`, `:201-202`, `:220-221`).
- APG Carousel: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ — rotation control, focus stop, hover pause, live region off while rotating.
- WCAG 2.2 SC 2.2.2: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html — the stop control.
- Nielsen, NN/g 2013: https://www.nngroup.com/articles/auto-forwarding/ — usability case against rotation.
- Runyon 2013: https://erikrunyon.com/2013/01/carousel-interaction-stats/ — measured click-through.

## Semantic mapping
| Intent | Build |
| --- | --- |
| Few optional items | `p-carousel` + `aria-label` + named/typed `buttonProps` |
| Image set to compare | `p-galleria`, thumbnails on, item navigators off |
| Rotation (avoid) | `autoplayInterval` + own stop button + focus stop + hover pause |
| Rotation under reduced motion | not started; the button may start it |
| Full-screen viewer | `[fullScreen]` + own Escape + focus return |

## Rules
- MUST: decide first whether the content belongs in a carousel at all.
- MUST: name the carousel with `aria-label`, and each navigator through `buttonProps.ariaLabel` with `type: 'button'`.
- MUST: give any rotation a visible stop/start button, stop on focus, pause on hover, and skip it under reduced motion.
- MUST: name each galleria image in the `#item` template.
- SHOULD: keep slide content non-interactive, or make off-page slides inert.
- SHOULD: keep navigators visible; indicators alone are faint (inactive ~1.2:1) and pass target size only by spacing.
- NEVER: put the page's key message in a carousel.
- NEVER: enable galleria item navigators, or full screen without Escape and focus return.

## Default snippet
```html
<p-carousel [value]="items" [numVisible]="1"
  [attr.aria-label]="labels().region"
  [prevButtonProps]="prevProps()" [nextButtonProps]="nextProps()">
  <ng-template #item let-item><h3>{{ item.term }}</h3><p>{{ item.text }}</p></ng-template>
</p-carousel>
```
```ts
readonly prevProps = computed<ButtonProps>(() => ({
  severity: 'secondary', text: true, rounded: true, type: 'button',
  ariaLabel: this.i18n.translate('carousel.previous'),
}));
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
