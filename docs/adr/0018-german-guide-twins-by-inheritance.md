# ADR-0018 — German guide articles as twins that extend the English component

**Status:** accepted · **Date:** 2026-10-05

## Context and Problem Statement

The design-system workshop holds 61 guide articles (`/dev/design/guide/<id>`), each an
Angular component with a long inline template — measured prose, demo labels, tables, code
recipes — in English only. The rest of the portal is bilingual, so on `/de/…` the workshop
chrome is German and every guide body is English: the page looks broken. All 61 guides are
to be readable in German in full. How should a guide carry two languages?

## Decision Drivers

- **Guides are translated independently.** Several guides can be translated at the same
  time; no two translations may need to edit the same file.
- **The English article stays canonical and stable.** Its template is what
  `scripts/design-guides.mjs` slices tab by tab and what `check-design-guides.mjs` gates
  (harvest contracts, file citations). A translation must not disturb either.
- **Measured values and code exist once.** Line citations, contrast ratios and snippets
  must not fork between the languages.
- **Drift is detectable.** When the English article changes, a mechanical check must show
  that the German one no longer matches.
- **SSR-safe.** The workshop renders on the server in dev; no unguarded browser globals.

## Considered Options

1. **i18n keys** — move every sentence of every guide into the JSON modules (×4 locales)
   and render through `TranslationService`. The templates become key soup (thousands of
   keys for prose that today reads as markup), the CLI's tab slicer would serve keys instead of
   text, the English article stops being readable source, and every translator edits the
   shared `devWorkshop.json` modules — the parallel-work driver fails outright.
2. **Language-tagged templates in one file** — both languages in the same component,
   switched with `@if (de) { … } @else { … }` per block. Doubles the size of files that are
   already 50–150 KB, puts every translator into the English file (merge conflicts with
   any English fix), and breaks the tab slicer, which would serve both languages.
3. **A German twin by inheritance** — a second component per guide,
   `<id>-article.de.component.ts`, that `extends` the English class and supplies only a
   German template plus `override`s for English text held in class fields. A route-level
   switch renders the twin for a `de` base language.

## Decision Outcome

**Option 3.** Each translator creates exactly one new file per guide and never edits an
English one. State, handlers, measured values and snippets are inherited, so they exist
once. The English template, the CLI and the existing gates are untouched.

What makes it work:

- **One mechanical preparation of all 61 English files** (a script, one commit, no
  content change): the decorator's `imports` and `styles` became exported constants
  (`ARTICLE_IMPORTS`, `ARTICLE_STYLES`) the twin reuses — Angular's AOT compiler resolves
  an imported constant statically; local types became exported; `private` members became
  `protected`, so a twin can override English text a private field holds.
  `check-inline-templates.mjs` tracks the `const …_STYLES =` literal like an inline one.
- **Runtime switch.** Each guide route resolves the English class and, when it has one,
  the twin (`guideComponentsResolver`) before activation, and renders
  `GuideLanguageSwitchComponent`, which picks the class from the base language of
  `TranslationService.currentLanguage$` (`de`, `de-easy` → German; otherwise English) via
  `NgComponentOutlet`. Resolving both up front keeps the switch synchronous: server
  render, first browser render and a later language switch all pick from classes in hand.
  A guide without a twin renders English.
- **No shared hand-edited file.** Which guides have a twin is read off the disk by
  `scripts/sync-guide-translations.mjs` and written to
  `src/app/dev/articles/guide-translations.generated.ts`.
- **Registry.** `titleDe` and `summaryDe` sit beside `title` and `summary` in all 61
  entries (PARSER CONTRACT extended) and show in the guide header, related cards, gallery,
  quick-switch and agents index when the base language is `de`.
- **The agent doc stays English.** It is the contract for AI agents; on `de` the Agent tab
  says so in one German line and marks the rendered doc `lang="en"`.
- **Gate.** `scripts/check-guide-translations.mjs` compares each twin with its English
  article: same `appGuideTab` set, same element/attribute/binding tree (prose text and
  translatable attribute values ignored, inline phrasing compared as a multiset so German
  word order may move it), verbatim `<pre>`/`<code>`/`<kbd>` text, the twin's shape, and
  the generated map's freshness. It runs in `build:verify` and the harness (with a
  self-test); `check-house-style.mjs` applies the German house style to every twin.

## Consequences

- **Good:** parallel translation without conflicts — one new file per guide, then one
  sync run.
- **Good:** structural drift between the languages fails the build, with the first
  divergence named by line in both files.
- **Cost:** two templates per guide to keep in step. Reworded English prose is invisible
  to the parity gate; the authoring directive requires the German change in the same
  commit, and that rule is human-enforced.
- **Cost:** the English decorators now read `imports: ARTICLE_IMPORTS` and
  `styles: [ARTICLE_STYLES]` — a new guide follows that shape (`/new-guide`).
- **Cost:** on an English page the twin's chunk is not loaded, but on a German page the
  English chunk is (the twin extends it); both are dev-only workshop chunks, stripped from
  production with the rest of `src/app/dev/` (ADR-0004).
- **Watch:** if a third guide language is ever ordered, the switch takes a map per
  language instead of one `de` slot; the twin pattern itself scales unchanged.
