---
id: article-layout
title: Article Layout
category: layouts
tags: [layout, article, composition, headings]
summary: One template owns the page frame and the author owns the middle — a fixed reading order from lead to checkpoint, heading levels the blocks decide rather than hand-written tags, and one column that clips whatever it cannot fit.
related: [ui-pattern-selection, typography, a11y-guidelines, design-tokens, i18n-localization, demo-layout, hub-layout]
covers: [scrolltop]
measured-against: '@angular/core@22.1.4'
tabs:
  examples: The page skeleton with its two ownership bands, one container at two heading levels, and p-scrolltop inside a scrolling panel
  usage: The regions in document order, what the template needs from you and what each input drives, and three Do/Don't pairs
  design: The column and its clipping, the heading every shipped block emits, the two outline idioms, and the frame's breakpoint ladder
  development: The files a page is joined from, a minimal page, back to top with the kit FAB or p-scrolltop, checks, and a checklist
  i18n: Who translates what in the frame, the two shipped ways to keep the table of contents current, and where longer text pushes
  history: Document changelog, one line per version
---

## When to use
- Building a new article or lesson page, or deciding where a block belongs in its body.
- Choosing the heading level a block renders at.
- Adding a back-to-top control — the page's or a scrolling panel's.

## When not to use
- Choosing WHICH block answers a need — `ui-pattern-selection`, then that block's doc.
- Size and weight of the heading levels — `typography`.
- Focus order and accessible names in general — `a11y-guidelines`.
- Key naming and simplified variants — `i18n-localization`.

## Key API
`<app-lesson-template [meta] [tocItems]>` **is** the page; what you write is projected into it. It renders, in order: the `<article>` region, the single `<h1>` (`app-page-header`), the toolbar (back, meta chips, share), the viewport-fixed progress bar, the table-of-contents and Easy-Language buttons, your body, then the related-tools, resources, cited-sources, and related-content footers.

`meta: LessonMeta` requires `id`, `titleKey`, `readingTime`, `difficulty`, `difficultyKey`, `focus`; without it only the loading state renders. `id` must equal the article id under `src/assets/data/core/articles/` — footers, Easy-Language lookup, and button keys resolve through it. `focus` picks the Easy-Language content type (`theory`, `practice`); `categoryKey`, `subtitleKey`, `chapters`, `publishDate`, `draft`, `scheduledFor` each add one element.

`tocItems: TocItem[]` — `{ id, label }`, every `id` an element id in your body.

**Back to top.** The shell mounts `app-scroll-to-top-fab` once for every route: window scroll, visible past 1,000 px, named by `textContainer.backToTop`, reduced-motion aware. A page adds nothing. `<p-scrolltop>` (`@openng/optimus-ui/scrolltop`) is for a panel with its own scroll: `target="parent"` listens on the parent and renders sticky inside it (the default `window` is fixed bottom-right, over the kit FAB). Inputs: `threshold` (400), `behavior` (`'smooth'`), `buttonAriaLabel` (no default), `icon` or an `#icon` template (`openng-optimus-ui-scrolltop.mjs:79-131`). It renders a rounded `p-button` only past the threshold and removes it after the scroll back (`:184-197`).

## Accessibility
- The template opens the region and owns the only `h1`; a second of either gives two outlines.
- Heading level is an input: `app-standard-container`, `app-definition`, `app-checkpoint` take `headingLevel`, default 3; `app-text-container` is fixed at 2; `app-quiz-container` lands on 3; `app-example-box` joins no outline.
- Two idioms give a skip-free outline: the section owns the heading (`<section>` plus your `h2`, blocks at 3), or the block owns it (id on the block, `[headingLevel]="2"`).
- `p-scrolltop` is an icon-only button named by `buttonAriaLabel` alone (`:245`) — bind it from a translation key. Its `behavior` is an explicit scroll option the CSS reduced-motion rule cannot reach: pass `scrollBehavior()` from `src/app/utils/reduced-motion.ts`.

## Pitfalls
- **A list filled asynchronously.** The floating button is registered once, in the template's `ngAfterViewInit`, only if `tocItems.length > 0`. Fill the array in your own `ngOnInit`.
- **Labels bound once.** They are plain strings; rebuild them on a language change (a getter or a subscription).
- **A wide block with no scroller.** The column sets `overflow-x: hidden`: anything wider is clipped, with no way to scroll it back.
- **A `meta.id` the data lacks.** Nothing errors; footers and the Easy-Language button never appear.
- **A copied stylesheet.** Styles are component-scoped: a copied rule needs its media query too.
- **Focus after `p-scrolltop`.** The button unrenders once the panel is back at the top, and focus falls to the body; hand it to the panel's first heading from a `(click)` on the host.

## Sources
- HTML Living Standard, headings and outlines: https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines — a heading may be at most one level deeper than the previous.
- CSS Overflow Module Level 3: https://www.w3.org/TR/css-overflow-3/ — `hidden` clips and offers no scrolling interface.
- WCAG 2.2 SC 1.3.1, Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html — the level a block emits is the structure.
- CSSOM View, `scroll()` options: https://drafts.csswg.org/cssom-view/#dictdef-scrolltooptions — why an explicit `behavior` beats `scroll-behavior`.
- `src/app/pages/articles/seed-article-1/` — the blueprint page.

## Semantic mapping
| Intent | Where it goes |
| --- | --- |
| Frame, `h1`, toolbar, progress, buttons | `app-lesson-template` — never rebuilt |
| Opening paragraphs, no heading | the first section of the body |
| A topic the reader can jump to | `<section id>` plus your own `h2` |
| A titled block that is the whole section | the block, at `headingLevel` 2 |
| An aside the reader may skip | a collapsible `app-standard-container`, not in the list |
| Sources, tools, related reading | nothing — the template appends them |
| Back to the top of the page | nothing — the shell's `app-scroll-to-top-fab` |
| Back to the top of a scrolling panel | `<p-scrolltop target="parent">` inside it |

## Rules
- MUST: render exactly one `app-lesson-template` and project the body into it.
- MUST: keep `meta.id` identical to the article id under `src/assets/data/core/articles/`.
- MUST: fill `tocItems` in your own `ngOnInit`, every entry pointing at an element id, labels rebuilt on a language change.
- MUST: give any block that can outgrow the column its own `overflow-x: auto`.
- MUST: give a `p-scrolltop` `target="parent"`, a translated `buttonAriaLabel`, and `[behavior]="scrollBehavior()"`.
- SHOULD: close with takeaways, then quiz, then checkpoint.
- NEVER: add a second `h1`, `<article>`, progress bar, or window-level back-to-top button.
- NEVER: hand-write a heading tag for a block that renders its own title.

## Default snippet
```html
<app-lesson-template [meta]="meta" [tocItems]="tocItems">
  <section id="lead" class="article-section">
    <p class="lead-text">{{ t('articleExample.lead') }}</p>
  </section>

  <section id="repository" class="article-section">
    <h2>{{ t('articleExample.repository.title') }}</h2>
    <app-standard-container [config]="boxConfig">
      <p>{{ t('articleExample.repository.text') }}</p>
    </app-standard-container>
  </section>
</app-lesson-template>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
