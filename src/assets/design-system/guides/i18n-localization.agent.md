---
id: i18n-localization
title: I18n & Localization
category: foundations
tags: [i18n, localization, translation, easy-language]
summary: One JSON module per namespace per language, split into a small core bundle plus lazy chunks and read by a lookup that neither interpolates nor pluralizes — every miss walks a fallback chain ending in English, and a key missing there renders as itself.
related: [a11y-guidelines, typography, design-tokens, color-system, article-layout, demo-layout, hub-layout]
covers: []
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Four keys resolved live in the active variant, the same four across all four variants, and what an unresolved key renders
  usage: The shape of a key, the label pattern, call-site placeholder substitution, and three Do/Don't pairs
  design: Where a string lives, the fallback chain, why the easy variants are languages, text expansion measured, and narrow screens
  development: Adding a key, a namespace, or a language, the Optimus UI ARIA hand-off, what each gate enforces and misses, and a checklist
  i18n: Who names a language, why endonyms are literals, and the one picker label that is hard-coded English
  history: Document changelog, one line per version
---

## When to use
- Any user-visible string and the key that carries it.
- Adding a namespace, a language, or a simplified variant.
- Deciding what a reader sees when a key is absent in their language.
- Formatting a date or number, sorting, or searching translated text.

## When not to use
- Which scripts the font stack can render — use `typography`.
- The document `lang` attribute, ARIA names, and the right-to-left boundary — use `a11y-guidelines`.
- One library component's translatable inputs — that component's own guide, i18n tab.
- Per-language grammar and style — `directives/languages/`.

## Key API
Four variants — two base languages, a simplified sibling each — are declared in `src/config/languages.json` (default German, key source English); `src/config/language-rules.mts` derives every list and chain from it.

1. **Storage** — `src/assets/i18n/modules/<lang>/<namespace>.json`; the namespace is the filename stem **verbatim** (no case or kebab change). A simplified variant is a sibling directory, not an overlay.
2. **Build** — `scripts/build-i18n-bundles.ts` writes a core bundle per language plus one lazy chunk per namespace listed in `src/config/i18n-bundles.json`. A new namespace lands in the core unless the config marks it lazy.
3. **Lookup** — `TranslationService.translate('ns.key')` → string; `translateValue<T>()` → arrays/objects. State is signals: `currentLanguage$`, `translationsReady`, `translationsVersion` (bumps when a bundle lands, so a `computed()` re-resolves).
4. **Gating** — `translationReadyGuard` holds navigation (20 s at most) until the core and the route's namespaces (title keys plus its `i18n` list) load.
5. **Locale helpers** — `dateLocaleFor()`, `numberLocaleFor()`, `formatNumberFor()` in `src/app/utils/date-locale.ts` map a portal language to the house region (`en-US`, `de-DE`), easy suffix stripped. `foldForSearch()` in `src/app/utils/search-fold.ts` lower-cases and drops compound joiners (`·`, hyphens) — apply it to both sides of a comparison.
6. **Gates** (`build:verify`) — `scripts/check-i18n-keys.mjs` fails on a literal key English lacks, a key a variant lacks, an empty value, or more unreferenced keys than `ORPHAN_BASELINE` (0). A runtime-built key counts as referenced only under a `DYNAMIC_PREFIXES` entry (prefix plus reason); a prefix no source builds any more fails as stale. `scripts/check-house-style.mjs` fails on German `Sie`-address (outside `impressum.json`), gender forms (generic masculine), `»…«` or mismatched quotes („…“), a Mediopunkt outside long `de-easy` compound nouns, British spelling, and day-month-year English dates.

## Accessibility
- An unresolved key renders as the key, so a screen reader announces `glossary.title`.
- Optimus UI's screen-reader strings live in the `optimus.json` module and reach the library only via `setTranslation` in `src/app/services/optimus-a11y.service.ts`. Which to override, and `lang`/`dir`, belong to `a11y-guidelines`.

## Pitfalls
- **A misspelled namespace disables the gate for that key.** Only a literal whose first segment names an English module is checked; anything else renders raw.
- **A runtime-built key is an orphan to the gate.** `'toast.type.' + type` names no full key; without a `DYNAMIC_PREFIXES` entry its keys fail the build.
- **A lazy namespace missing from the route** loads on first lookup — after the raw key has flashed.
- **`translateValue()` has no fallback** — current language only, `null` on a miss.
- **No interpolation, no plural selector.** Substitute with `String.replace`; the corpus mixes `{n}` and `{{n}}`.
- **A bare `toLocaleString()` or `currentLanguage` as a locale.** The first formats in the browser's locale, not the page's; the second may carry `-easy`, and a regional code plus that suffix throws `RangeError`.
- **Search without folding.** `de-easy` writes `Code·review`, German `Code-Review`; an unfolded `includes()` misses one.

## Sources
- BCP 47 / RFC 5646: https://www.rfc-editor.org/rfc/rfc5646 — `-easy` is no registered tag; strip it before `Intl` or `lang`.
- ECMA-402: https://tc39.es/ecma402/ — the format and collation machinery the helpers feed.
- Unicode CLDR plural rules: https://cldr.unicode.org/index/cldr-spec/plural-rules — the forms a per-form key set covers.
- W3C i18n, text size in translation: https://www.w3.org/International/articles/article-text-size — the expansion budget.
- WCAG 2.2 SC 3.1.2: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html — a page mixing languages.

## Semantic mapping
| Intent | Mechanism |
| --- | --- |
| A visible string | `translate('ns.key')` inside a `computed()` |
| A date or number | `dateLocaleFor()` / `formatNumberFor()` with `currentIntlLocale` |
| A sort order | `localeCompare(b, currentIntlLocale)` |
| A search match | `foldForSearch()` on query and haystack |
| A simplified reading level | the `-easy` sibling language, not a flag |
| A count in a sentence | one key per form, plus `String.replace` |

## Rules
- MUST: add every key to all four variant directories, under `<namespace>.<path>` with the module filename spelled exactly.
- MUST: hold labels in a `computed()`; a key resolved once into a field freezes before the bundle lands.
- MUST: format dates and numbers through `src/app/utils/date-locale.ts`, never a bare `toLocaleString()` or a hard-coded locale.
- MUST: register a runtime-built key prefix in `DYNAMIC_PREFIXES` with its reason; delete a key nothing reads, in all four variants.
- MUST: spread the current `aria` block before pushing an Optimus UI ARIA key — the kit treats the merge as replacing it.
- SHOULD: list a page's lazy namespaces in its route's `i18n` array.
- SHOULD: budget roughly 1.4× the English width for a label that must not wrap, and size narrow columns for the longest unbroken token, not the longest word.
- NEVER: assemble a sentence from translated fragments.
- NEVER: translate an id, a route segment, a form `name`, or an option value.

## Default snippet
```ts
readonly labels = computed(() => ({
  title: this.i18n.translate('widget.title'),
  count: this.i18n.translate('widget.count').replace('{n}', formatNumberFor(this.n(), this.i18n.currentIntlLocale)),
}));
```
```json
// the same keys go into all four variant directories
{ "title": "Saved views", "count": "{n} views" }
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
