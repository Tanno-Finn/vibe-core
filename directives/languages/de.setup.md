<!-- base -->
# lang-de — German (Deutsch) — setup & sources

> **The translation guide itself is [`de.md`](de.md)**: §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This guide's evidence base is unusual, and the tiers must stay visible.

**Tier used in this pass: the repo itself, plus the house-style decisions.** German is the kit's own
reference language, so the question is what the kit *does*, and the kit's shipped strings answer
it. Four rows are not observations but **house-style decisions of 2026-09-23** (register, gender
style, quotation marks, `de-easy` compounds). Every
other rule in the guide traces to one of these:

- **The German content**: `src/assets/i18n/modules/de/`, `…/de-easy/` and
  `src/assets/data/translations/*/de/`, `…/de-easy/`. Counted by script (patterns in §11, corpus
  method in §8c).
- **The kit's glossary**: `src/assets/data/translations/glossary/de/*.json`, the seed table in §6.
- **The kit's own directives**: [translation-quality](../translation-quality.md) (terminology
  classes, the sandwich, the term-sheet) and [accessibility-workflow](../accessibility-workflow.md)
  (plain-language base rules and the named DIN norms).
- **The kit's code where it formats language**: `src/config/languages.json`,
  `src/app/services/meta-seo.service.ts` (`lang` attribute and `og:locale`),
  `src/app/pages/glossary/glossary.component.ts` (index letters).

**Named, not consulted in this pass (⚠ no web access).** These are the authorities a research
round should check the observed practice against. Nothing in the guide claims their content.

- **Rat für deutsche Rechtschreibung**: the official orthography rules (*Amtliches Regelwerk*).
  <https://www.rechtschreibrat.com/>
- **DIN 8581-1 *Einfache Sprache*** and **DIN SPEC 33429 *Leichte Sprache***: named by
  [accessibility-workflow](../accessibility-workflow.md) as reference examples.
- **Unicode charts** for the characters the guide names: Latin-1 Supplement
  <https://www.unicode.org/charts/PDF/U0080.pdf> and General Punctuation
  <https://www.unicode.org/charts/PDF/U2000.pdf>.
- **CLDR `de` locale data** for numbers and dates:
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/de.html>.

**Source-tier caveat.** An observed rule in this guide says "the kit does X" with a count; a
decided rule says "decided on 2026-09-23: X". Neither says "X is correct German". Where the
kit is inconsistent on a row nobody has decided (percent spacing, *z. B.* spacing), the guide
reports the split and hands the choice to the user rather than picking a winner from memory.

Sources: the repo paths listed above · the house-style
decisions of 2026-09-23 · authority URLs named for the next research round, not fetched

---

## 3. Script & typography

**(Quotation marks: decided 2026-09-23. Everything else: observed, character counts over all
German strings, 126 files per locale, re-measured after the normalizing pass of 2026-09-23.)**

**Character inventory.** Latin a–z plus **ä ö ü ß** and their capitals **Ä Ö Ü**, all precomposed
in Latin-1 Supplement. The capital sharp s **ẞ** does not occur in the content. `de-easy` also uses
the **Mediopunkt ·** (U+00B7, Latin-1) in long compound nouns (§8f in the guide; standard `de`
never does),
and both variants use the dashes **–** and **—** (General Punctuation; the spaced em dash 474× in
`de`).

**Direction & tokenization.** LTR, whitespace-separated. German writes noun compounds as one token
(*Sprachmodell*), so a two-word English term is often one German token and one highlight span.

**Quotation marks: „…“, decided 2026-09-23.**

> **Quotation style (decided 2026-09-23): „…“**
> (U+201E … U+201C) in all running German text, `de` and `de-easy`, with **‚…‘** (U+201A …
> U+2018) for a quotation inside a quotation. No »…« or ›…‹, no English “…”, and no straight
> quotes in prose. Code, JSON, shell examples, i18n keys and placeholders keep their straight
> quotes: they are syntax, not typography.

Before the decision three styles coexisted: „…“ as the majority, »…« in 17 pairs, and straight
quotes in prose, some of them closing a German opening mark (*„Tabelle"*). After the pass:

| Style | `de` | `de-easy` | Note |
|---|---|---|---|
| **„…“** (U+201E … U+201C) | 161 / 161 | 38 / 38 | every opening mark is closed |
| **»…«** (U+00BB … U+00AB) | 0 | 0 | converted |
| straight ASCII (U+0022) | 46 | 2 | all inside code: `git commit -m "…"`, JSON, `cd "Mein Ordner"` |

- ✅ matched German pair: **„Barriere melden“**
- ❌ mixed pair: **„Tabelle"** *(before the pass: open German, close ASCII)*

**Inner (nested) quotation: ‚…‘** (U+201A … U+2018): **„Er fragte: ‚Wo ist die Datei?‘“**. No
nested quotation occurs in the content at the moment; the last four ‚ in `de` were single-level
quotations closed with an ASCII apostrophe (*‚halluziniert'*) and became „…“.

- ✅ matched inner pair: **‚Wo ist die Datei?‘**
- ❌ mixed inner pair: **‚halluziniert'**

**What the gate checks.** `check-house-style` flags »…« and ›…‹ (rule `de-guillemets`), and „
closed by a straight ", ‚ closed by a straight ', and the English closing mark ” (rule
`de-quote-pair`). A straight quote pair in German prose is **not** flagged: the same strings
carry code with straight quotes, and no pattern separates the two without false positives. That
part of the rule needs a reader.

**Dashes.** The parenthetical dash is a **spaced em dash** (*Wort — Wort*, 474 in `de`); a spaced
en dash occurs 39×, and a spaced ASCII hyphen stands in for a dash 375× (some of them are
ranges and command-line examples). No closed em dash (*Wort—Wort*) occurs.

- ✅ observed majority: **Deine ersten Befehle — Der Starter-Werkzeugkasten**
  (`articleTerminalIntro.commands.title`)
- ❌ hyphen standing in for a dash: **Deine ersten Befehle - Der Starter-Werkzeugkasten**

**Ellipsis.** Three full stops (28 in `de`) outnumber the ellipsis character … (5). Either is
readable; keep the file's existing form.

**Line-breaking / hyphenation.** A few components set `hyphens: auto`
(`text-container.component.ts`, `quiz-container.component.ts`, `catalog.component.ts`), which uses
the browser's dictionary for the document language. `de-easy` pages carry `lang="de"` (§10), so
they hyphenate as German too. No soft hyphens occur in the content.

**Romanization: not applicable.** German is natively Latin script.

Sources: the quotation decision (house style, 2026-09-23) ·
census of `src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/` after the pass
(character and quotation counts; patterns in §11) · `scripts/check-house-style.mjs`
(`de-guillemets`, `de-quote-pair`) · `src/app/components/shared/text-container.component.ts`,
`quiz-container.component.ts`, `src/app/pages/catalog/catalog.component.ts` (`hyphens: auto`)

---

## 10. Technical integration checklist

- **Fonts to ship:** the kit self-hosts 14 OFL families from `@fontsource/*` and loads them on
  demand (`docs/THIRD-PARTY-FONTS.md`). German needs nothing beyond Latin-1 and General
  Punctuation: **ä ö ü ß Ä Ö Ü**, **· – —** and the quotation marks in §3. Spot-check **„ “ ‚ ‘**
  in a newly added family.
- **`lang` / `dir` attributes:** `lang="de"` for **both** `de` and `de-easy`. `MetaSeoService`
  strips the `-easy` suffix because no language subtag exists for it, and it is the only writer of
  `document.documentElement.lang` (`app.component.ts` says why). `dir="ltr"`. `og:locale` is `de_DE`
  for both variants.
- **Index alphabet for glossary navigation:** derived from the entries, not hard-coded. Each
  term's first letter is upper-cased for the current locale and sorted with an `Intl.Collator`
  (`sensitivity: 'base'`). An umlaut-initial term would get its own **Ä/Ö/Ü** button, sorted
  after its base letter. No German glossary term starts with an umlaut today.
- **Numbers / dates in display vs identifiers:** display per §5 of the guide; the app formats UI
  dates through `dateLocaleFor()` (`src/app/utils/date-locale.ts`), which maps `de` and `de-easy`
  to `de-DE`. The bibliography export follows the UI language: German labels (*Zugriff*,
  *Verfügbar unter*), German dates (*05.03.2026*) and the no-date marker `o. J.` for `de` and
  `de-easy` (`CITATION_LABELS`, `formatCitationDate` in `citation-formats.ts`).
- **Compounds, search & highlighting:** glossary highlighting matches the German headword, so a
  hyphenated headword (*Code-Review*) does not match an open spelling (*Code Review*) in body text
  (§6 of the guide lists the known splits). The glossary **search** is spelling-tolerant:
  `foldForSearch()` (`src/app/utils/search-fold.ts`) drops the Mediopunkt and the hyphen family on
  both sides, so *Code-Review*, *Codereview* and the `de-easy` headword *Code·review* find each
  other.
- **Easy-variant fallback:** a missing `de-easy` file falls back to `de` before English
  (`fallbackChain()` in the content build; `UnifiedContentService` for the bundle).

Sources: `docs/THIRD-PARTY-FONTS.md` · `src/app/services/meta-seo.service.ts` (suffix strip,
`og:locale` map) · `src/app/app.component.ts` (single `lang` writer) ·
`src/app/pages/glossary/glossary.component.ts` (`groupKeyOf`, `alphabetLetters`) ·
`src/app/utils/date-locale.ts` · `src/app/utils/search-fold.ts` ·
`src/app/pages/sources/citation-formats.ts` · `scripts/build-unified-content.ts` (`fallbackChain`)

---

## 11. Verification additions

Language-specific deterministic checks for the list in
[translation-quality → Verification](../translation-quality.md). Each pattern below is the one the
census in the guide used, so a re-run reproduces its numbers.

**Enforced by the build.** `scripts/check-house-style.mjs` runs in `npm run build:verify` (and so
in `npm run build:prod` and CI; alone: `npm run check:house-style`) over
`src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/`, without `sources` titles
and `searchTerms.json`, ignoring code spans, `<code>`, placeholders, tags and URLs. Every finding
is an ERROR that fails the build; `--selftest` proves each rule on fixtures and runs inside
`verify-harness`. The German rules:

- **`de-register`:** a capital *Sie*, *Ihnen*, *Ihr…* after a word or comma (this includes every
  imperative + *Sie*), outside `impressum.json` (guide §4). Sentence-initial *Sie* is not
  checked.
- **`de-guillemets`:** any »…« or ›…‹.
- **`de-quote-pair`:** „ closed by a straight ", ‚ closed by a straight ', and ” in German.
- **`de-gender`:** *\*innen*, *:innen*, *_innen*, */innen*, *-Innen* / Binnen-I, their singulars,
  and pair forms (*Nutzerinnen und Nutzer*, *die Nutzerin oder der Nutzer*).
- **`de-mediopunkt`:** a Mediopunkt between letters in standard `de`.
- **`de-easy-hyphen`:** in `de-easy`, a two-part hyphen compound of full words, except the
  cases of guide §8f rule 6 and the English terms, code tokens and pronunciation spellings the
  script lists by name; the message says whether to close it (≤ 10 letters) or use the dot.
- **`de-easy-wordclass`:** in `de-easy`, a Mediopunkt word that is not a noun: it starts
  lower-case (*zusammen·hängen*, *nicht·linear*), its first part is a listed particle or prefix
  (*Vor·wissen*, *Meta·daten*), or its last part is a listed infinitive (*Code·schreiben*) or
  adjective part (*Regel·basierte*).
- **`de-easy-short`:** in `de-easy`, a Mediopunkt compound of ≤ 10 letters unless a part is on
  the name/English list (`FOREIGN_PARTS`: *Git·befehle*, *Wetter·app*), and a stop-listed word
  (`STOP_LIST`: *Schreibtisch*, *Werkzeug*) split anywhere, also inside a longer compound.
- **`de-easy-split`:** in `de-easy`, a closed word that shares a stem with a Mediopunkt word
  elsewhere (*Testdatei* beside *Test·dateien*): one compound, one spelling.
- **`de-easy-deep`:** in `de-easy`, a part of ≥ 11 letters that is split elsewhere
  (*Datenschutz·details* beside *Daten·schutz*), or two parts of a 3+-part compound written
  closed elsewhere.

**Checks for a reader or an ad-hoc script** (not enforced; either undecidable without false
positives or not a decided row):

- **Straight quotes in prose:** a " pair outside code in German running text (§3).
- **Long closed compounds in `de-easy`:** a closed noun of 11+ letters that never appears split
  (a compound or a derivation? — *Laufzeitumgebung* vs *Entwicklung*), and nominalized verbs
  ending in *-speichern*, *-spielen*, *-laden* (also noun plurals). Census pattern: capitalized
  words of ≥ 11 letters without `·` or `-` in `de-easy`, reviewed by hand (guide §8f).
- **Formal address at sentence start:** *Sie können …* as the first words of a sentence.
- **Number separators:** flag `\d{1,3}(,\d{3})+` (English grouping) and a decimal point between
  digits in prose. Version numbers and parameters (*2.2*, *0.1*) are expected false positives.
- **Percent consistency:** within one string, flag a mix of glued `\d%` and spaced `\d %`.
- **Date format:** flag month-first English dates (*Juli 15, 2026*) and `\d{1,2}/\d{1,2}/\d{4}`.
- **Abbreviation spacing:** within one file, flag a mix of *z. B.* and *z.B.*.
- **Source-language leak (EN → DE):** English function words in German prose (*the*, *and*,
  *please*), *AI* where the kit writes *KI*, and open English compounds (*MCP Server*) where the
  glossary hyphenates.

Sources: `scripts/check-house-style.mjs` (the enforced rules and their allowlists) · the census
patterns above, run over `src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/`
· the corpus method in the guide's §8c

---

*Provenance note:* written from a **scripted census of the kit's own German strings** and the kit's
directives, without web access, and updated on 2026-09-23 to the kit's house-style decisions
(register, gender, quotation marks, `de-easy` compounds)
with the counts re-measured after the normalizing pass. No external authority was fetched; §2
names them for the next round. The counts are reproducible from the patterns in §11 and the corpus
method in §8c. No native-speaker review of this guide yet (see Status in the guide's header).
