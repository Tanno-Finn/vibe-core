<!-- base -->
# lang-ru — Russian (русский) — setup & sources

> **The translation guide itself is [`ru.md`](ru.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below should trace back to one of these. Note up
front: Russia has a **codifying institute** (the Academy of Sciences' language institute), but the
day-to-day orthographic/reference authority most editors actually cite is the **Gramota.ru**
portal, and there is **no single institutional authority for register, plain-language rules, or
cross-border regional norms** — those sections are gap-flagged below.

- **V. V. Vinogradov Russian Language Institute of the Russian Academy of Sciences** — the primary
  codifying institute for Russian; website **ruslang.ru**. **✓ verified in this pass:** the site
  identifies itself as «Институт русского языка им. В. В. Виноградова РАН». Its orthographic
  resource is the academic spelling reference **«Академос»** at **orfo.ruslang.ru**.
  <https://www.ruslang.ru> · <https://orfo.ruslang.ru/>
  (⚠ the specific «Академос» resource page was **not directly retrieved** in the research passes;
  the institute domain is verified, the exact Akademos landing page is not.)
- **Gramota.ru** — the most widely used practical Russian reference portal (dictionaries,
  handbooks/*справочники*, spelling and usage guidance), including a **phraseology handbook**
  («Справочник по фразеологии») that is the authoritative source family for idiom/calque checks
  (§7). <https://gramota.ru/> ·
  <https://gramota.ru/biblioteka/spravochniki/spravochnik-po-frazeologii>
  (⚠ in this verification pass gramota.ru returned **HTTP 403 to the automated fetcher** — it is a
  **live, bot-blocking site**, not a dead link; the portal's role is well established but the
  handbook text was not machine-read here.)
- **The Unicode Standard — Cyrillic block (U+0400–U+04FF).** The official code chart; **✓ range
  verified** in this pass (the Cyrillic block is U+0400–U+04FF, 256 code points, present since
  Unicode 1.0.0). <https://www.unicode.org/charts/PDF/U0400.pdf> ·
  <https://en.wikipedia.org/wiki/Cyrillic_(Unicode_block)> (readable range confirmation; the PDF
  chart is the primary but is binary and was not machine-parsed).
- **Unicode UAX #14 — line breaking.** Governs line-breaking behavior; Russian has no special
  hyphenation-rule page on an official standards body that the research could locate, so
  dictionary/engine hyphenation is the working rule (§3, §10).
  <https://www.unicode.org/reports/tr14/>
- **Unicode CLDR — `ru` locale** (number, date, time formats; decimal/grouping separators;
  currency patterns). **✓ re-verified against CLDR 48.2 (2026-03-17)**, superseding this guide's
  earlier v46 chart citation: the `ru` verify chart shows day-month-year ordering
  (`13.01.2012`, «13 января 2012 г.»), a **comma decimal with a no-break-space group separator**,
  and the **amount-then-symbol** currency pattern — the values were unchanged, only the version
  citation was stale. One pattern string in §5 was **sharpened** against the release data (see
  there). The chart link is Unicode's version-agnostic *latest* permalink, so it tracks the current
  release. <https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html> ·
  <https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns> ·
  release history: <https://cldr.unicode.org/downloads/cldr-48>
- **Ruble sign ₽ (U+20BD RUBLE SIGN).** **✓ verified:** encoded in Unicode 7.0 as U+20BD, the
  official Russian Federation currency sign. <https://en.wikipedia.org/wiki/Russian_ruble_sign>
- **GOST AI/ML terminology (Rosstandart), via a standards database.** The route for standardized
  Russian AI/ML terms (§6). **⚠ unreachable in this verification pass** — the `docs.cntd.ru`
  document refused the connection (likely geoblocked, **not** confirmed dead); the GOST route is
  therefore recorded as the **source family**, not as a machine-confirmed citation, and the
  seed-term provenance is downgraded to convention-strength pending a reachable read.
  <https://docs.cntd.ru/document/566348046/titles/8P00LP>

**Provenance caveat.** This language's **round-1 research came back weak**; a round-2 follow-up
restored A/B/D/E/H infrastructure but explicitly could **not** source three editorial areas. Where
a claim below rests only on a weak or convention-level source it is marked at point of use. In
particular: **word order and the register (ты/вы) choice rest on a general grammar site
(elon.io) and Wiktionary**, not an academy citation — treated as **⚠ convention**; the **AI-term
GOST route was unreachable** in verification; and **plain-language (§8) and cross-border regional
variation (§9) have no named authoritative standard** and are shipped **gap-flagged**. Do not
promote general-web grammar sites, plain-language association pages, or university/health-portal
country pages to normative rules.

Sources: <https://www.ruslang.ru> · <https://orfo.ruslang.ru/> · <https://gramota.ru/> ·
<https://www.unicode.org/charts/PDF/U0400.pdf> ·
<https://en.wikipedia.org/wiki/Cyrillic_(Unicode_block)> · <https://www.unicode.org/reports/tr14/> ·
<https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns> ·
<https://en.wikipedia.org/wiki/Russian_ruble_sign>
(gramota.ru returned HTTP 403 to the fetcher and the GOST route
<https://docs.cntd.ru/document/566348046/titles/8P00LP> refused the connection — both are listed
as authorities of record, **not** as fetched evidence.)

---

## 3. Script & typography

**Character inventory & Unicode range.** Russian is written in **Cyrillic**, main block
**U+0400–U+04FF** (verified range, §2). The modern Russian alphabet is 33 letters:

> а б в г д е **ё** ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я

**Keep ё distinct from е (highest-frequency Russian typographic trap).** **ё (U+0451)** is a
*separate letter*, not a decoration on **е (U+0435)**. In casual writing ё is often replaced by е,
but that replacement is **lossy** and, for a reference/educational platform, wrong: it changes
words and can change meaning.

- ✅ Right (ё preserved): **всё** ("everything"), **ещё** ("still / more"), **её** ("her"),
  **нёбо** ("palate"), **осёл** ("donkey"), **заём** ("loan").
- ❌ Wrong (ё flattened to е): **все** ("everyone" — a *different word* from всё), **осел** (reads
  as "sat down / settled", not "donkey"), **небо** ("sky", not "palate" — the flattened form of
  **нёбо**).

A build/normalization step that maps ё→е silently corrupts content; treat ё as a distinct
code point end-to-end (§11 checks the ratio and forbids the silent swap).

**Direction & tokenization.** Russian is **LTR**; words are **whitespace-separated**, so standard
word tokenization and word-boundary highlighting work. No RTL/bidi handling, no cursive joining,
no combining-mark shaping is required. (Combining stress accents appear only in dictionaries/
learner text, e.g. а́, and are not part of normal body copy.)

**Quotation marks — guillemets, not Latin quotes.** Standard Russian typography uses **angular
guillemets «…»** as the primary quotation marks, with **„…“** (low-opening / high-closing German-
style) as the conventional **nested** quote. Latin straight or curly quotes are an editorial defect
in Russian body copy.

- ✅ Right: **«Нажмите кнопку „Сохранить“»** (guillemets outer, low-high nested).
- ❌ Wrong: **"Нажмите кнопку "Сохранить""** (Latin quotes standing in for guillemets).

**Dashes.** The **em dash «—»** is heavily used in Russian: for direct speech, for parenthetical
breaks, and — distinctively — as a **copula replacement** where English uses "is" (Russian has no
present-tense "to be"):

- ✅ **Москва — столица России** ("Moscow is the capital of Russia" — the dash *is* the verb).
- ❌ **Москва столица России** (no dash) / **Москва есть столица России** (archaic/wrong for modern
  neutral prose).

**Punctuation names** (useful for glossary/UI copy): запятая (comma), точка (period), тире
(dash/em dash), дефис (hyphen), двоеточие (colon), точка с запятой (semicolon), вопросительный знак
(?), восклицательный знак (!), кавычки (quotation marks).

**Fonts & rendering.** Cyrillic has broad web-font coverage (most major families ship full
Cyrillic); the practical pitfalls are (a) fonts that cover Latin but **not** Cyrillic, silently
falling back and mixing glyph styles, and (b) fonts missing **ё** or rendering the italic Cyrillic
forms poorly (Russian italic can differ markedly from upright — e.g. italic **т** looks like Latin
*m*, **д** like *g*). Test a Cyrillic-complete face and check ё and the italic set.

**Romanization never appears in the UI.** Body content is Cyrillic. Romanization
(transliteration) is confined to slugs/identifiers (§10) and to established Latin acronyms; it is
**never** a display substitute for a Russian word. For systematic transliteration, **GOST
7.79-2000** (the Russian adaptation of ISO 9) is the reference system — used for slugs/search
keys, not for display. (The "keep acronyms in Latin, everything else in Cyrillic" practice is
sector convention, not an academy ruling — ⚠ convention.)

Sources: <https://www.unicode.org/charts/PDF/U0400.pdf> ·
<https://en.wikipedia.org/wiki/Cyrillic_(Unicode_block)> · <https://orfo.ruslang.ru/> ·
<https://www.unicode.org/reports/tr14/> · (guillemet / dash / ё conventions are standard Russian
typographic practice; the academy's orthographic portal is the anchor, exact rule pages not
machine-read — ⚠ convention where not chart-backed)

---

## 10. Technical integration checklist

- **Fonts to ship:** a **Cyrillic-complete** web font (full U+0400–U+04FF coverage, including **ё**
  and a well-designed **italic** Cyrillic set). Verify no silent Latin-only fallback that mixes
  glyph styles.
- **`lang` / `dir` attributes:** `lang="ru"` (base) and `lang="ru-easy"` (simplified variant,
  subject to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and
  per foreign passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **ё is load-bearing — never normalize it away.** Build steps, "sanitizers", and search/normalize
  passes must **not** map **ё (U+0451) → е (U+0435)**; that silently changes words (§3). If a
  search index folds ё→е for recall, keep the *display* string with ё intact.
- **Tokenization / highlighting:** whitespace word separation applies — standard word tokenizers and
  word-boundary highlighting work. Line breaking is engine/dictionary-driven (UAX #14); do **not**
  insert manual hyphens.
- **Quotation & dash normalization:** ensure the pipeline emits **«…»** (and nested **„…“**) and the
  **em dash «—»**, not Latin quotes or a hyphen — an auto-formatter tuned for English will
  "straighten" guillemets into `"` (§3).
- **Plural / number-agreement handling:** use **CLDR `ru` plural categories (one / few / many /
  other)** for any number+noun string (§5) — a binary singular/plural template produces
  «2 рублей»/«1 дней».
- **Number & date formatting:** space thousands separator, comma decimal, `dd.MM.yyyy` display,
  genitive month in textual dates, «г.» suffix, 24-hour clock (§5) — drive from CLDR `ru`, keep ISO
  8601 for backends/identifiers.
- **Index alphabet for glossary navigation:** use **Russian Cyrillic alphabetical order** (а б в г
  д е ё ж …), per **CLDR `ru` collation**, not an A–Z Latin index. (Collation conventionally treats
  ё with е; drive the index from CLDR `ru` collation data rather than a hand-coded list.)
- **Currency parameterization:** ₽ (U+20BD) for RU vs local currency per deployment (§9); do not
  hard-code one symbol.
- **Transliteration for slugs/identifiers:** GOST 7.79-2000 (ISO 9) for machine identifiers only —
  never as display text (§3, §6).

Sources: <https://www.unicode.org/charts/PDF/U0400.pdf> ·
<https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html> · <https://www.unicode.org/reports/tr14/> ·
<https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio:** the large majority of letters in `ru` content must fall in the **Cyrillic block
  (U+0400–U+04FF)**. A low Cyrillic-codepoint ratio signals untranslated source text left in place.
- **ё integrity:** flag any pipeline stage that maps **ё (U+0451) → е (U+0435)** in display strings;
  spot-check known ё-words (всё, ещё, её, нёбо) survive round-trips. A missing-ё ratio spike means a
  normalization pass ate the letter (§3, §10).
- **Forbidden / suspicious characters:**
  - No **Latin homoglyphs** standing in for Cyrillic letters inside a Russian word (Latin `a c e o p
    x` for Cyrillic `а с е о р х`) — a classic copy/paste and OCR defect; flag mixed-script tokens.
  - No **Latin transliteration** standing in for a Russian word in body text (Latin allowed only for
    established acronyms and for slugs/identifiers).
  - No **Latin quotation marks** (`"…"` / `'…'`) or straight hyphen used where **«…»** / **„…“** /
    em dash **«—»** are meant.
- **Digit / separator consistency:** thousands grouped with a **space**, decimal with a **comma**
  (§5); flag English-style `1,500` grouping or `3.14` dot-decimals in Russian content.
- **Number–noun agreement:** grouped number+noun strings use CLDR `ru` plural categories; flag
  binary-plural artifacts like **«1 дней»**, **«2 рублей»** (§5, §10).
- **Date format:** textual dates use **genitive month + «г.»** (24 **июля** 2026 **г.**), numeric
  dates `dd.MM.yyyy`; flag nominative-month («24 июль») or month-first ordering.
- **Register consistency:** the §4 register is **вы** (recorded). Scan second-person copy for stray
  **ты** pronouns and singular-familiar verb/imperative forms (Нажми, Ты можешь…) — a register slip
  is a consistency defect.
- **Case / aspect leak scan (EN/DE → RU):** nouns left in the **nominative** where a case is required
  (a hallmark of word-for-word transfer), wrong **aspect** on one-shot UI imperatives (imperfective
  «Сохраняйте» on a single-action button), a **missing copula dash** in «X — Y» equative sentences,
  and left-in English function words (the, and, you, please) or German umlauts/ß.

Sources: <https://www.unicode.org/charts/PDF/U0400.pdf> ·
<https://en.wikipedia.org/wiki/Cyrillic_(Unicode_block)> ·
<https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html>

---

*Provenance note:* this guide is built solely from an external desk-research pass whose **round-1
came back weak**; a targeted round-2 restored the standards infrastructure (Unicode Cyrillic range,
CLDR `ru` dates, ruble sign, the Vinogradov Institute domain, the GOST-via-database route, and the
Gramota phraseology source family) but **not** the register, plain-language, or cross-border
regional authorities. Load-bearing anchors were re-verified in this revision: **✓ confirmed**
— Cyrillic U+0400–U+04FF, CLDR `ru` day-month-year dates, ruble ₽ U+20BD, ruslang.ru = Vinogradov
Institute, CLDR currency-pattern behavior; **⚠ not confirmed here** — the **GOST AI-terminology
route** (docs.cntd, connection refused — likely geoblocked, not confirmed dead) and **gramota.ru**
(HTTP 403 to the fetcher — live but bot-blocked). All **⚠** markers indicate claims the research
could not source, that rest only on convention-level sources (register, word order), or that could
not be confirmed from the primary authorities in §2. The **register (вы) choice is taken and recorded**; its
**sourcing is convention-level, not academy-cited**. A native-speaker review against the §2 sources
is still outstanding (see Status in the header).
