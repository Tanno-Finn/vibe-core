---
id: typography
title: Typography
category: foundations
tags: [typography, fonts, readability, tokens]
summary: Three scales and seven family names, generously declared and sparsely applied — the global stylesheet sets a family on body and on headings but no unscoped size rule on prose, so heading sizes come from the user agent, type never moves with the viewport, and only two of the nine weight tokens have a real face behind them.
related: [design-tokens, color-system, a11y-guidelines, i18n-localization, ui-pattern-selection, article-layout]
covers: []
measured-against: '@openng/optimus-ui-themes@2.0.2'
tabs:
  examples: The size scale, the weight ladder, and the family tokens rendered live, plus the leading pair no global rule applies
  usage: The 13-step scale with its large-text threshold, what each family token is wired to, three Do/Don't pairs, and the utility-class trap
  design: Where typographic values are written, the two divergent mono stacks, what the global sheet actually paints, and behavior on a narrow screen
  development: Adding a step to a scale, switching the UI font at runtime, the five names that look like hooks, and an acceptance checklist
  i18n: The default stack entry by entry, the Latin-only face inventory behind the picker, and the dyslexia font's script gate
  history: Document changelog, one line per version
---

## When to use
- Any size, weight, leading, or font family in a component stylesheet.
- Text that must follow the reader's font choice, dyslexia-friendly font included.

## When not to use
- Which layer writes a value and which wins — the cascade; use `design-tokens`.
- Whether a text color may sit on a ground — a measured pair; use `color-system`.
- One library component's type — its sizes come from `--p-*`; use its guide.

## Key API
1. **Scales** — `design-tokens.scss` compiles Sass maps into `:root`: `--font-size-*` (13 steps, `0.75rem` to `8rem`, all `rem`), `--font-weight-*` (9 steps, 100–900), `--line-height-*` (6 steps, 1 to 2). `styles.scss` re-declares 8 sizes, 6 weights, and 5 leadings with identical values.
2. **Families** — `--font-sans`, `--font-serif`, `--font-mono`, `--font-heading`, `--font-display` from `design-tokens.scss`; `--font-base` and `--font-family` from `styles.scss`, both static and identical. `--font-base` is the authoritative UI-font token (its comment in `styles.scss`, the header of `font.service.ts`), `--font-family` the legacy alias `body` still reads; `--font-mono` is the code face.
3. **Runtime** — `font.service.ts` writes `--font-base` and `--font-family` as **inline style on `<html>`** when the reader picks a font, loading its `@font-face` sheet once. `applyStyleFonts` writes `--font-heading` and the body pair for the **active visual style**, from the self-hosted families in `src/app/services/ui-styles.ts`. An explicit reader choice (readable-font toggle included) clears `--font-heading` and wins for headings too.

Utilities `.text-<step>` (13) and `.font-<weight>` (9) compile to literals with `!important`, never `var()` — re-declaring `--font-size-sm` moves every rule reading it and leaves `.text-sm` where it was.

## Accessibility
- Every step is a `rem` and no rule pins `html { font-size }`, so the page scales with the reader's root size (SC 1.4.4).
- Large text under SC 1.4.3 starts at 24px, or 18.66px bold: `--font-size-2xl` and up qualify, `--font-size-xl` only at 700+. The contrast compilat measures color tokens, which have no size, so every text pair in it is judged at 4.5:1.
- Text colors come from the visual style: `--text-color` on `--surface-card` is 18.73:1 light / 14.86:1 dark in werkbund; `--text-color-secondary`'s tightest row over all four styles is 4.55:1 on `--surface-hover` (SC 1.4.3 needs 4.5:1). Quote `docs/generated/CONTRAST.MD`, group "body text", never eyedrop.
- Loadable body fonts ship 400 and 700 only, a style's heading face one weight; the browser resolves the rest — never let weight carry meaning alone.

## Pitfalls
- **`--font-mono` has two different values.** `design-tokens.scss` gives it eight entries, `styles.scss` five; the five-entry stack paints. Both lead with `Fira Code` and `JetBrains Mono`, which ship no `@font-face` — code renders in the first OS-resident entry.
- **`--font-family-mono` is not a token.** Declared nowhere; without a fallback the declaration is invalid at computed-value time and the UI font stays.
- **Five names look like component hooks and are inert** — `--button-font-weight`, `--tooltip-font-size`, `--code-font-family`, `--code-font-size`, `--code-line-height`. Library components read `--p-*`, and the kit sets no typographic `--p-*` name.
- **Headings take their family from the style, their size from the browser.** `h1`–`h6 { font-family: var(--font-heading) }` is their only rule; no element-level rule targets `p`, `a`, `code` or `pre` outside print. `body` gets a family and no `line-height`, so copy runs at the user agent's `normal`.
- **`--font-heading` is not a family of its own.** It resolves to `var(--font-base)` until a style writes it. `--font-display` leads with `Poppins` (no `@font-face`), `--font-sans` with `Inter` (loaded only once picked); both render a fallback by default.

## Sources
- CSS Fonts 4, font matching: https://www.w3.org/TR/css-fonts-4/#font-matching-algorithm — why 500 renders as 400 and 600 as 700.
- CSS Fonts 4, `font-display`: https://www.w3.org/TR/css-fonts-4/#font-display-desc — `swap` for the picker fonts against `block` for the icon font.
- HTML Standard, rendering: https://html.spec.whatwg.org/multipage/rendering.html#sections-and-headings — the `h1`–`h6` sizes the kit inherits.
- WCAG 2.2 SC 1.4.4: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html — the 200 % bar the `rem` scale satisfies.
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — the large-text definition that splits the scale at 24px.

## Semantic mapping
| Intent | Token |
| --- | --- |
| The UI font | `--font-base` |
| Code, keys, IDs, figures | `--font-mono` |
| Fine print, captions, table cells | `--font-size-sm` |
| Body copy | `--font-size-base` |
| Section heading | `--font-size-xl` … `--font-size-3xl` |
| Emphasis with a real face | `--font-weight-bold` |
| Heading leading / prose leading | `--line-height-tight` / `--line-height-relaxed` |

## Rules
- MUST: express every size, weight, and leading as `var(--token)`; no bare `px` or `pt` outside the print branch.
- MUST: use `var(--font-mono)` for monospace — never a hand-written stack, never `--font-family-mono`.
- MUST: leave `html { font-size }` unpinned — pinning it breaks resize.
- SHOULD: keep emphasis on 400 or 700, or give it a carrier besides weight.
- SHOULD: style headings explicitly; without a rule they are user-agent sizes, not scale steps.
- SHOULD: put breakpoint-dependent type in the component's own stylesheet, on a scale step — the kit ships no responsive type.
- NEVER: set `font-family` on a prose element — it opts the reader out of the font picker and the dyslexia-friendly font.
- NEVER: reach for `.text-*` / `.font-*` where a downstream project may re-skin the scale; they are literals.

## Default snippet
```css
/* Sizes and leading from the scale; the UI font stays the reader's. */
.article {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed); /* no global leading exists */
}
.article h2 {
  font-size: var(--font-size-2xl);  /* headings are browser default */
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-bold); /* 700 has a face; 500 does not */
}
.article code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
