---
id: a11y-guidelines
title: Accessibility Guidelines
category: foundations
tags: [accessibility, a11y, wcag, focus, keyboard]
summary: Four global mechanisms and a set of conventions — one universal reduced-motion catch-all, one kit focus ring for every focusable Optimus UI part, one hidden-text class, and an app shell with a skip link — every other control is accessible here because its author wired the name, the ring, and the announcement.
related: [design-tokens, color-system, typography, i18n-localization, article-layout, demo-layout, hub-layout]
covers: []
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: The focus ring on three live controls, a media-query probe of your own preferences, a working live region, and the skip link in both states
  usage: Who owns the name, the ring, the announcement, and the motion, three Do/Don't pairs, and the criterion each habit answers
  design: The preference queries and where each is answered, the ring's shape and color token, what the shell adds, and narrow-screen target size
  development: Wiring a custom widget, the runtime patch layer and its retired patches, which checks run, one dead API, and an acceptance checklist
  i18n: Why names are bound not written, the library's own screen-reader vocabulary, who writes the document language, and no RTL
  history: Document changelog, one line per version
---

## When to use
- Wiring a control: its accessible name, its focus ring, its state announcement.
- Deciding whether a motion, a ring, or a hidden string is the kit's job or yours.
- Adding a reduced-motion, high-contrast, or forced-colors branch.

## When not to use
- Whether a foreground may sit on a ground — `color-system`.
- Text size, weight, or the reader's font choice — `typography`.
- One library component's ARIA and keyboard model — its guide (`button`, `dialog`).
- Auditing a whole app — `directives/accessibility-workflow.md`, `base/standards/A11Y.md`.

## Key API
Four global mechanisms. Three in `src/styles.scss`, one in the shell.

1. **Reduced motion** — a catch-all `@media (prefers-reduced-motion: reduce)` on `*`, `*::before`, `*::after`: animation and transition durations `0.01ms !important` (so `transitionend` still fires), one iteration, `scroll-behavior: auto`. Its JavaScript half is `src/app/utils/reduced-motion.ts`: every scroll call takes `behavior: scrollBehavior()`, timer-driven motion asks `prefersReducedMotion()` first.
2. **Focus ring** — the kit standard is a 2px solid `var(--primary-color-fg)` outline at 2px offset on `:focus-visible`. `styles.scss` draws it, `!important`, from ONE selector list covering every keyboard-focusable Optimus UI part and the cookie buttons, over Aura's 1px ring; parts in clipping containers ring inset (−2px), notice close buttons and image-preview actions in `currentColor`. Your own widgets draw their own.
3. **`.sr-only`** — the visually hidden class; no focus-revealing variant.
4. **App shell** (`src/app/app.component.ts`, `services/optimus-a11y.service.ts`) — a skip link to `#main-content` first; landmarks `header[role=banner]`, `nav`, a native `<main id="main-content" tabindex="-1">`, `footer[role=contentinfo]`; focus moved to `<main>` after each navigation (`preventScroll: true`); a `MutationObserver` patching one library role defect (`p-tabpanels`); the library's `aria.*` strings in the page language. The cookie settings dialog is `aria-modal` with `cdkTrapFocus` auto-capture; Escape or close returns focus to its trigger, or to `<main>` when the trigger is gone.

## Accessibility
- **SC 2.4.1, 2.4.3** — skip link and focus-to-`<main>` on every route. **SC 3.1.1** — `lang` is written at runtime; `dir` never is.
- **SC 1.4.11 for the ring** — `--primary-color-fg` is gated on both grounds for all ten palettes in all four styles, lowest 4.75:1; the ring itself in `focus ring`, lowest 3.48:1. `--primary-color`, which many component rules paint rings in, has no foreground row in `docs/generated/CONTRAST.MD`.
- **SC 1.4.3 / 1.4.11** — `scripts/check-contrast.mjs` gates kit token pairs and the Optimus UI widget pairs resolved from the preset as configured, per style and mode; its open exceptions (toggleswitch and slider tracks among them) head the compilat. `scripts/check-a11y.mjs` (axe-core, sampled routes) runs in CI.
- **SC 2.3.3** — CSS by the catch-all, JavaScript by the helper. **SC 2.5.8** (24 CSS px) — per control: `styles.scss` raises the 20×20 slider handle to 24×24, the cookie close button is 44×44; the `touch-target-*` utilities have no call site.

## Pitfalls
- **No hiding or focus-ring mixin exists** — `visually-hidden()` and the broken `focus-ring()` were deleted from `src/styles/design-tokens.scss` on 2026-09-24, and no component stylesheet can include a mixin anyway. Hide text with `.sr-only`; the ring is the kit ring rule in `src/styles.scss` — extend its list.
- **A hard-coded `behavior: 'smooth'`.** An explicit option overrides `scroll-behavior`; the CSS catch-all cannot reach it, nor a Web Animations call or a `requestAnimationFrame` loop.
- **`prefers-contrast` and `forced-colors` are feature-scoped.** Globally, only the glossary answers high contrast.
- **A patch that runs after render is a race** — give the name at the call site instead.

## Sources
- WCAG 2.2 SC 2.4.7: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html — the ring's bar.
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — 3:1 for a ring.
- WCAG 2.2 SC 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — 24 CSS px; 44px is SC 2.5.5 (AAA).
- W3C ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/patterns/ — the model a custom widget owes.
- CSSOM View: https://drafts.csswg.org/cssom-view/#dom-element-scrollintoview — an explicit `behavior` beats the CSS property.
- CSS Custom Properties L1: https://www.w3.org/TR/css-variables-1/ — invalid at computed-value time.

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| Bypass the header | The shell's skip link to `#main-content` |
| Name an icon-only control | `[attr.aria-label]` from a translation key |
| Show keyboard focus | `:focus-visible` — 2px solid `var(--primary-color-fg)`, 2px offset |
| Announce a state change | `.sr-only` + `aria-live="polite"` (`assertive` only to interrupt) |
| Scroll without forcing motion | `behavior: scrollBehavior()` |
| Gate JavaScript motion | `if (!prefersReducedMotion())` |

## Rules
- MUST: give every interactive element a `:focus-visible` rule, 2px solid at 2px offset.
- MUST: bind an accessible name from a translation key; a static `aria-label` is workshop-only.
- MUST: pair every visible state change with a live-region text, and every hue with a second carrier.
- MUST: quote contrast ratios from `docs/generated/CONTRAST.MD`, pair and criterion named.
- MUST: take scroll behavior from `scrollBehavior()` and ask `prefersReducedMotion()` before timer-driven motion.
- MUST: keep one writer for `document.documentElement.lang`.
- SHOULD: paint the ring in `--primary-color-fg`, not `--primary-color`, and give a touch control 24 CSS px of target itself.
- NEVER: bring back a hiding mixin beside `.sr-only`, write `outline: none` without a rendering replacement, or style bare `:focus` for `:focus-visible`.
- NEVER: render a second `<main>` in a page.

## Default snippet
```html
<button type="button" class="widget" [attr.aria-label]="translate('widget.open')">
  <i class="pi pi-cog" aria-hidden="true"></i>
</button>
<span class="sr-only" aria-live="polite">{{ spokenState() }}</span>
```
```css
/* No global rule draws this. */
.widget:focus-visible {
  outline: 2px solid var(--primary-color-fg);
  outline-offset: 2px;
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
