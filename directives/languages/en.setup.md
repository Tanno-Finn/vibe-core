<!-- base -->
# lang-en — English — setup & sources

> **The translation guide itself is [`en.md`](en.md)**: §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

<!-- lang-check: no-nested-quotes - the kit's English content writes straight ASCII quotes and contains no nested quotation at all, so there is no observed inner convention to show; see the quotation paragraph in section 3 -->

---

## 2. Authorities & primary sources

**Tier used in this pass: the repo itself**, for the same reason as German (`de.setup.md` §2):
English is one of the kit's own languages, and the question is what the kit ships.

- **The English content**: `src/assets/i18n/modules/en/`, `…/en-easy/` and
  `src/assets/data/translations/*/en/`, `…/en-easy/`, counted by script (patterns in §11, corpus
  method in the guide's §8c).
- **The kit's glossary**: `src/assets/data/translations/glossary/en/*.json`.
- **The kit's own directives**: [translation-quality](../translation-quality.md) and
  [accessibility-workflow](../accessibility-workflow.md).
- **The kit's code where it formats language**: `src/config/languages.json`,
  `src/app/services/meta-seo.service.ts`.

**Named, not consulted in this pass (⚠ no web access).** English has no language academy; the
references a research round would check against are style and locale data:

- **CLDR `en` locale data** (numbers, dates):
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/en.html>.
- **ISO 24495-1** (plain-language principles) and **WCAG 2.2 SC 3.1.5**, both already cited by
  [accessibility-workflow](../accessibility-workflow.md).
- **Unicode General Punctuation chart** for quotation marks and dashes:
  <https://www.unicode.org/charts/PDF/U2000.pdf>.
- For the **variety**, the kit's own house style is the authority: **American
  English** (spelling, dates, serial comma), decided on 2026-09-23. No external
  American style manual is named; a research round could pick one to settle finer points.

**Source-tier caveat.** An observed rule in the guide says "the kit does X", with a count; a
decided rule says "decided on 2026-09-23: X". None says "X is correct English".

Sources: the repo paths listed above · the variety decision
(house style) · authority URLs named for the next research round, not fetched

---

## 3. Script & typography

**(Observed section: character counts over all English strings, 126 files per locale,
re-measured on 2026-09-23 after the American-English pass.)**

**Character inventory.** ASCII letters only in the content; no diacritics are needed. Punctuation
beyond ASCII: the em dash **—** (504 spaced in `en`), the en dash **–** (7 spaced), the ellipsis
**…** (5), and a few curly quotation marks.

**Direction & tokenization.** LTR, whitespace-separated. Compounds are open (*Agent Loop*), so
one German token often becomes two English tokens (guide §4).

**Quotation marks: straight quotes, with a few curly ones.**

| Style | `en` | `en-easy` | Where |
|---|---|---|---|
| straight ASCII double (U+0022) | 226 | 58 | prose, JSON and shell examples |
| curly **“…”** (U+201C … U+201D) | 13 / 13 | 7 / 7 | imprint, license and onboarding strings |
| straight ASCII single (U+0027) | 315 | 47 | apostrophes and single quotes |
| curly apostrophe **’** (U+2019) | 13 | 1 | a few article strings (*doesn’t*, *model’s*) |

The kit's English is **straight-quoted**. The curly marks sit in a handful of legal and
onboarding strings. Keep straight quotes in new English prose unless the user decides otherwise,
and never mix the two inside one string. Leave code, JSON and shell examples alone.

- ✅ consistent: **say "onboarding", and it becomes** *(illustrative, straight like most of the content)*
- ❌ mixed in one string: **say “onboarding" and it becomes** *(illustrative)*

**No nested quotation occurs** in the English content, so there is no observed inner convention
to record (the marker at the top of this file says so for the checker).

**Dashes.** The parenthetical dash is a **spaced em dash** (*word — word*, 504 in `en`). A spaced
ASCII hyphen stands in for a dash 341× (some of them ranges and command-line examples), and a
spaced en dash occurs 7×. No closed em dash (*word—word*) occurs.

- ✅ observed majority: **Your First Commands — The Starter Toolkit** (`articleTerminalIntro.commands.title`)
- ❌ hyphen standing in for a dash: **Your First Commands - The Starter Toolkit**

**Line-breaking / hyphenation.** The same few components set `hyphens: auto` as for German
(`de.setup.md` §3); `lang="en"` selects the English dictionary. No soft hyphens occur.

**Romanization: not applicable.**

Sources: census of `src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/`
(character, quotation and dash counts; patterns in §11)

---

## 10. Technical integration checklist

- **Fonts to ship:** English needs ASCII plus General Punctuation (**— – … “ ” ’**); every family
  the kit self-hosts covers it (`docs/THIRD-PARTY-FONTS.md`).
- **`lang` / `dir` attributes:** `lang="en"` for **both** `en` and `en-easy`; `MetaSeoService`
  strips the `-easy` suffix and is the only writer of `document.documentElement.lang`.
  `dir="ltr"`. `og:locale` is `en_US` for both, which matches the house style: American English,
  American dates (guide §9).
- **Index alphabet for glossary navigation:** derived from the entries with an `Intl.Collator`
  for the current locale; nothing English-specific to configure.
- **Numbers / dates in display vs identifiers:** display per the guide's §5. UI dates go through
  `dateLocaleFor()` (`src/app/utils/date-locale.ts`), which maps `en` and `en-easy` to `en-US`;
  never pass a bare `'en'` to `toLocaleDateString`, because its order then depends on the
  engine's default region. The bibliography export follows the UI language: English labels
  (*Accessed*, *Available at*), American dates (*August 16, 2026*) and `n.d.` for `en` and
  `en-easy` (`CITATION_LABELS`, `formatCitationDate` in `citation-formats.ts`).
- **Easy-variant fallback:** a missing `en-easy` file falls back to `en` before German
  (`fallbackChain()` in the content build).

Sources: `docs/THIRD-PARTY-FONTS.md` · `src/app/services/meta-seo.service.ts` (suffix strip,
`og:locale` map) · `src/app/pages/glossary/glossary.component.ts` ·
`src/app/utils/date-locale.ts` · `src/app/pages/sources/citation-formats.ts` ·
`scripts/build-unified-content.ts` (`fallbackChain`)

---

## 11. Verification additions

Language-specific deterministic checks for the list in
[translation-quality → Verification](../translation-quality.md). The patterns are the ones the
census used.

**Enforced by the build.** `scripts/check-house-style.mjs` runs in `npm run build:verify` (and so
in `npm run build:prod` and CI; alone: `npm run check:house-style`) over
`src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/`, without `sources` titles
and `searchTerms.json`, ignoring code spans, `<code>`, placeholders, tags and URLs. A finding is an
ERROR that fails the build; `--selftest` proves each rule on fixtures inside `verify-harness`.
The English rules:

- **`en-spelling`:** a British form from the short list in the guide's §9 (*colour, behaviour,
  centre, licence, catalogue, programme, organis…, per cent, grey*, …). A string that must keep one
  (a proper name, or a known miss a person has to fix) goes into `BRITISH_ALLOW` with its reason;
  an entry that no longer suppresses anything is reported as a WARN.
- **`en-date`:** a spelled-out day-month-year date with a year (*15 July 2026*).

**Not enforced: the serial comma.** Whether *A, B and C* is a list or a clause plus a pair is not
decidable from the text (guide §9); check lists by eye.

**Checks for a reader or an ad-hoc script:**

- **German separators:** flag `\d{1,3}(\.\d{3})+` grouping (one survives today) and a decimal
  comma between digits in prose. Three-digit groups after a comma (*40,000*) are English grouping,
  not decimals.
- **German percent spacing:** flag `\d %` (4 today).
- **German date shapes:** flag *15. July* (day with a full stop).
- **Currency order:** flag *1.08 USD* and *150 Euro*; the kit writes *USD 1.08* and *150 euros*.
- **British forms beyond the gate's list:** the census compared 24 American/British pairs
  (*-ize/-ise* in any verb, *license/licence*, *program/programme*…); a British form the gate's
  short list misses is still a defect.
- **Mixed quotation pairs:** flag “ closed by a straight ", and a curly apostrophe next to straight
  quotes in the same string.
- **German leak (DE → EN):** *KI* as a term, German hyphenated compounds (*MCP-Server*,
  *Code-Review*), capitalized common nouns mid-sentence, and a German quotation mark „ in English
  prose.

Sources: `scripts/check-house-style.mjs` (the enforced rules and `BRITISH_ALLOW`) · the census
patterns above, run over `src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/`
· the corpus method in the guide's §8c

---

*Provenance note:* written from a **scripted census of the kit's own English strings** and the
kit's directives, without web access, and updated on 2026-09-23 to the house-style decision for
American English with the counts re-measured
after the normalizing pass. No external authority was fetched; §2 names them for the next round.
No native-speaker review of this guide yet (see Status in the guide's header).
