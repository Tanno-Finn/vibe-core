<!-- base -->
# lang-bn — Bengali (বাংলা) — setup & sources

> **The translation guide itself is [`bn.md`](bn.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **Bangla Academy (বাংলা একাডেমি), Dhaka** — the government-supported national institution
  for the Bengali language in Bangladesh; the principal authority on spelling reform and
  standardization. Its **বাংলা একাডেমি প্রমিত বাংলা বানানের নিয়ম** ("Standard/Promita Bangla
  Spelling Rules") is the core prescriptive orthography for Bangladesh, and government manuals
  instruct offices to follow it.
  <https://en.wikipedia.org/wiki/Bangla_Academy> ·
  <https://archive.org/details/bangla-academy-promito-bangla-bananer-niyom-2015> ·
  <https://app.shabdakosh.org/standard-spelling-rules-by-bangla-academy/>
- **Paschimbanga Bangla Akademi (পশ্চিমবঙ্গ বাংলা আকাদেমি), Kolkata** — the official
  regulatory body for Bengali in West Bengal (India), founded 1986; publishes spelling
  dictionaries (*Akademi Banan Abidhan*) and grammar references respected by boards and
  universities in West Bengal and Tripura.
  <https://en.wikipedia.org/wiki/Paschimbanga_Bangla_Akademi>
- **The Unicode Standard — Bengali block (U+0980–U+09FF)** and the Bengali charts/FAQ material
  (conjunct/reph behavior, ZWJ/ZWNJ guidance).
  <https://en.wiktionary.org/wiki/Appendix:Unicode/Bengali> ·
  <https://www.unicode.org/Public/UNIDATA/NamesList.txt> ·
  <https://unicode.org/L2/L2003/03209-bengali-reph.pdf> ·
  <https://en.wikipedia.org/wiki/Bengali_(Unicode_block)>
- **Unicode CLDR — `bn` locale** (number, date, time formats; default digits). ✅ **Re-checked
  against CLDR 48.2 (2026-03-17)**, superseding this guide's earlier v43/v46 chart citations: `bn`
  still defaults to the **Bengali digit system**, uses the **lakh/crore grouping pattern
  `#,##,##0.###`** with a **dot decimal / comma group**, and carries the §5 date patterns
  unchanged — the values were stale only in their version citation, not in substance. The chart
  links are Unicode's version-agnostic *latest* permalinks, so they track the current release.
  <https://www.unicode.org/cldr/charts/latest/summary/bn.html> ·
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/bn.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **ISO 15919:2001** — international transliteration of Devanagari and related Indic scripts
  (incl. Bengali) to Latin. <https://cdn.standards.iteh.ai/samples/28333/a0a778b7b2034a91aab1e97b3a34d125/ISO-15919-2001.pdf>
- **UNGEGN working-group report on Bengali romanization** (the 1972/1977 UN system, and the
  note that there is no evidence it is used in practice).
  <https://unstats.un.org/unsd/ungegn/working_groups/wg5/documents/wgrr4bengali.pdf>
- **Noto Sans Bengali** — widely used open web font with broad glyph coverage.
  <https://fonts.google.com/noto/specimen/Noto+Sans+Bengali>
- **FSI Bengali course** — reference grammar material for word order, register, aspect.
  <https://www.fsi-language-courses.org/fsi-bengali-course/6-making-requests-and-offers/>
- **Bangladesh government usage manuals** — "সরকারি কাজে ব্যবহারিক বাংলা", "প্রমিত বাংলা
  ব্যবহারের নিয়ম", "প্রশাসনিক পরিভাষা" — operationalize Bangla Academy spelling and
  terminology for official writing.
  <https://mopa.gov.bd/> · <https://cgdf.gov.bd/pages/static-pages/6922ddc7933eb65569e1636d>

**Provenance caveat:** several research citations resolved to community/UGC or commercial
sources (a translation-platform style guide, forum threads, video material). Where a claim
below rests *only* on such a source it is marked at point of use; the authorities above are
the ones this guide leans on.

Sources: <https://en.wikipedia.org/wiki/Bangla_Academy> ·
<https://archive.org/details/bangla-academy-promito-bangla-bananer-niyom-2015> ·
<https://en.wikipedia.org/wiki/Paschimbanga_Bangla_Akademi> ·
<https://en.wikipedia.org/wiki/Bengali_(Unicode_block)> ·
<https://www.unicode.org/cldr/charts/latest/summary/bn.html> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://unstats.un.org/unsd/ungegn/working_groups/wg5/documents/wgrr4bengali.pdf> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+Bengali> ·
<https://www.fsi-language-courses.org/fsi-bengali-course/6-making-requests-and-offers/>

---

## 3. Script & typography

**Character inventory & Unicode range.** Bengali is written in the Bengali script, an abugida:
consonants carry an inherent vowel, dependent vowel signs (মাত্রা / *matra*) modify it. The
main block is **U+0980–U+09FF** ("Bengali"), covering letters, dependent vowel signs, the
virama, native digits, and some punctuation. The **danda** sentence marks (। ॥) are *not* in
the Bengali block — they are shared Indic punctuation encoded in the Devanagari block at
**U+0964 DEVANAGARI DANDA** and **U+0965 DEVANAGARI DOUBLE DANDA**. The taka currency sign is
**U+09F3 BENGALI RUPEE SIGN** (alias "Bangladeshi taka sign").

**Direction & tokenization.** Bengali is **LTR** (`Beng` script, standard LTR directionality).
Words are **separated by whitespace** in modern print and digital text — so ordinary
whitespace tokenization and word-based highlighting work. No RTL/bidi handling is required.

**Conjuncts, virama, and the ZWJ/ZWNJ trap (highest rendering risk).** Consonant clusters are
formed with **U+09CD BENGALI SIGN VIRAMA (হসন্ত / *hasant*)**, which suppresses the inherent
vowel and produces conjunct glyphs and special forms (ya-phala, ra-phala, ba-phala). Correct
output requires a font *and* a layout engine that implement Indic ligature/shaping rules.
Unicode's guidance: **ZWNJ (U+200C)** after a virama shows the virama and prevents the default
conjunct; **ZWJ (U+200D)** in certain positions forces special forms (e.g. ya-phala vs reph).

- ✅ Right (ZWNJ forces the intended non-conjunct): `উ + দ + virama + ZWNJ + য …` → **উদ্‌যাপন**
  ("celebration").
- ❌ Wrong (missing ZWNJ collapses to the wrong conjunct): **উদ্যাপন**.

This means: the shipped font must fully cover conjuncts and falas, and content that depends on
a specific ligated/non-ligated form must carry the correct ZWJ/ZWNJ — a naive copy that strips
zero-width characters will silently mis-render.

**Fonts & known pitfalls.** Noto Sans Bengali is a broadly usable web font, but *complex
clusters must be tested* — historically some builds mis-rendered particular conjuncts (e.g.
`ত্ত্র` TTA-RA not forming a ligature) before font fixes. Paschimbanga Bangla Akademi has also
produced a Bengali font aligned to its spelling; its web deployment details are limited
(⚠ unverified for web use).

**Punctuation & quotation.** The native sentence terminator is the **danda ।** (a period);
the **double danda ॥** marks larger breaks/verse. Contemporary prose freely mixes Western marks
— comma, `?`, `!`, `:`, `;`, `()`, hyphen, dash — alongside or instead of the danda. Bengali
names for these exist and are worth knowing for glossary/UI copy: কমা (comma), সেমিকোলন
(semicolon), দাঁড়ি / পূর্ণচ্ছেদ (danda / period), প্রশ্নবোধক চিহ্ন (`?`), বিস্ময় চিহ্ন
(`!`), কোলন (`:`). For quotations, the convention is **double quotes “ ”** for direct speech
and for marking tool/feature names (angular « » also occurs); follow the source's quotation
structure. (The "double quotes for feature names" rule comes from a commercial localization
style guide — treat as a style convention, not an academy ruling.)

**The nested (inner) pair is ‘…’** — `alternateQuotationStart` = **‘ U+2018**,
`alternateQuotationEnd` = **’ U+2019** in the CLDR `bn` locale data, read codepoint-by-codepoint
from the pinned **CLDR 48.2** release this session. The same fetch confirms the outer pair the
paragraph above describes: `quotationStart` = **“ U+201C**, `quotationEnd` = **” U+201D**.

**What that CLDR reading actually is (checked against the source data this pass).** The `bn` locale
file carries **no Bengali-specific quotation data at all**: all four delimiter fields in
`common/main/bn.xml` at the pinned release hold the CLDR **inheritance marker** `↑↑↑`, and the
values above come from `root.xml`. UTS #35 (LDML, v48.2) defines it: "*There is a special
Inheritance Marker used in the main repository, which has the value ↑↑↑ … It is used created during
data submission to record that the inherited value has been verified for the current locale and
path*" (verbatim, grammatical slip included). So this is CLDR's cross-locale default recorded as
checked for `bn` — not a value authored from Bengali typographic practice. That distinction turns
out to matter, because Bengali practice runs the other way.

**⚠ Contradiction on the record: attested Bengali press usage inverts the CLDR levels.** Three
Bengali publications, 18 articles, ~98,000 Bengali-script characters, counted by codepoint this
pass:

| Publication | ‘ U+2018 / ’ U+2019 | “ U+201C / ” U+201D | ASCII `"` / `'` |
|---|---|---|---|
| Prothom Alo — 6 articles | 23 / 23 | 1 / 1 | 0 / 0 |
| Jugantor — 6 articles | 28 / 32 | 0 / 0 | 0 / 0 |
| BBC Bangla — 6 articles | 1 / 1 | 0 / 0 | 108 / 108 |

The **single** pair carries the primary level, and the double pair is nearly absent — at Prothom
Alo its one appearance in the whole sample *is* the inner mark of a nested quotation. Three nested
quotations were fetched and read codepoint-by-codepoint, all three the same way round:

> ‘আমি চিন্তিত ছিলাম। … কিন্তু জিমি রাজি হননি। তিনি শুধু বলেছিলেন, “না।”’

Outer **‘ U+2018 … ’ U+2019**, inner **“ U+201C … ” U+201D** — the exact inverse of the CLDR
assignment. No counter-shaped example appeared anywhere in the sample.

**And a Bengali prescriptive claim that agrees with CLDR, at UGC tier.** The Bengali Wikipedia
article on যতিচিহ্ন states, under its heading for the double mark: "*যদি উদ্ধৃতির ভেতরে আরেকটি
উদ্ধৃতি থাকে তখন প্রথমটির ক্ষেত্রে দুই উদ্ধৃতি চিহ্ন এবং ভেতরের উদ্ধৃতির জন্য এক উদ্ধৃতি চিহ্ন
হবে*" ("*if there is another quotation inside a quotation, then for the first one there will be
double quotation marks, and for the inner quotation a single one*"), while its heading for the
single mark says the single pair encloses "*বক্তার প্রত্যক্ষ উক্তি*" ("*a speaker's direct
utterance*") — the two statements sit oddly together, and both headings print **ASCII** `'` and `"`
rather than any typographic mark. It is UGC, but it carries a real print citation: **হায়াৎ মামুদ,
*বাংলা লেখার নিয়মকানুন*, প্রতীক, ঢাকা, ২০১৫ (first published ১৯৯২), pp. ১২০–১৪০, ISBN 984 446 045 X**.
⚠ **That book was not obtained** — the page range is an unverified pointer for a print check, and it
is worth noting that the rule as stated is also the American-English convention.

**So the conflict stands, unresolved, and both sides are recorded.** No state academy ruling was
reached (see the failure list in the footer). Pick one system per surface and hold it globally;
whichever is picked, the inner marks are **real quotation characters, never an ASCII apostrophe**,
which in Bengali copy is indistinguishable from a stray typewriter mark.

- ✅ CLDR / prescriptive reading, inner level: **“… ‘…’ …”** (outer U+201C/U+201D, inner U+2018/U+2019)
- ✅ Attested press reading, inner level: **‘… “…” …’** (outer U+2018/U+2019, inner U+201C/U+201D)
- ❌ ASCII apostrophes as the inner pair: **“… '…' …”**

(The Bengali example above is a fetched sentence, not a constructed one; the mark-only lines show
the two systems side by side because the sources genuinely disagree about which is Bengali.)

**Romanization in native-script text.** No single Bengali romanization dominates everyday use;
multiple schemes coexist — **ISO 15919:2001**, the **UNGEGN** UN system (which the UNGEGN
report says shows no evidence of practical use in Bangladesh or India), the **National Library
at Kolkata** scheme, and **Bangla Academy**'s own rules. Practical UI consequence: English
technical acronyms (AI, ML, GPU, login) are commonly *left in Latin script* inside Bengali
running text. **There is no explicit official rule governing where romanization may or may not
appear in native-script Bengali** — ⚠ unverified beyond the transliteration standards
themselves; the "keep acronyms in Latin, everything else in Bengali script" practice is
sector convention, not a sourced rule. For the UI, the working rule stands: **body content is
Bengali script; romanization is confined to established Latin acronyms and to slugs/identifiers
(§10), never used as a display substitute for a Bengali word.**

Sources: <https://en.wikipedia.org/wiki/Bengali_language> ·
<https://en.wikipedia.org/wiki/Bengali_alphabet> ·
<https://en.wiktionary.org/wiki/Appendix:Unicode/Bengali> ·
<https://www.unicode.org/Public/UNIDATA/NamesList.txt> ·
<https://unicode.org/L2/L2003/03209-bengali-reph.pdf> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+Bengali> ·
<https://www.unicode.org/cldr/charts/latest/summary/bn.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `bn` delimiter fields — outer and nested — were
read codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that
chart) · <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/bn.xml> and
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> (**fetched
this pass**: `bn.xml` holds the inheritance marker in all four delimiter fields) ·
<https://www.unicode.org/reports/tr35/tr35.html> (LDML v48.2 — the Inheritance Marker definition
quoted above) · **attested-usage census (fetched and counted this pass):**
<https://www.prothomalo.com/entertainment/song/pbzkawx5k2> and
<https://www.prothomalo.com/entertainment/tv/kq6r5nikkf> and
<https://www.prothomalo.com/bangladesh/district/q5bl8ymvoz> (the three verified nested quotations —
single outside, double inside) · <https://www.jugantor.com/> · <https://www.bbc.com/bengali> ·
**prescriptive counter-claim (UGC tier):**
<https://bn.wikipedia.org/wiki/%E0%A6%AF%E0%A6%A4%E0%A6%BF%E0%A6%9A%E0%A6%BF%E0%A6%B9%E0%A7%8D%E0%A6%A8>
(raw wikitext read; cites হায়াৎ মামুদ, *বাংলা লেখার নিয়মকানুন*, pp. ১২০–১৪০ — ⚠ **the book itself
was not obtained**) · <https://banglaacademy.gov.bd/> (**fetched this pass**: the served site
carries no বিরামচিহ্ন/উদ্ধৃতি rules text — searched, zero hits) ·
<https://unstats.un.org/unsd/ungegn/working_groups/wg5/documents/wgrr4bengali.pdf> ·
<https://en.wiktionary.org/wiki/Wiktionary_talk:Bengali_transliteration>
— ⚠ **still no Bengali state-academy ruling on the nested pair.** Reached and failed by name this
pass: **Anandabazar Patrika, Bangla Tribune, Samakal, Ittefaq — all HTTP 403**; the Paschimbanga
Bangla Akademi domains did **not resolve**; NCTB's textbook pages are **JS-gated**, so the
বিরামচিহ্ন chapter was never read.

---

## 10. Technical integration checklist

- **Fonts to ship:** a fully Indic-capable Bengali font with complete conjunct/fala coverage —
  **Noto Sans Bengali** is the safe default; **test complex clusters** (e.g. `ত্ত্র`, ya-phala/
  ra-phala forms) before relying on any build.
- **`lang` / `dir` attributes:** `lang="bn"` (base) and `lang="bn-easy"` (simplified variant,
  subject to the §Header ⚠ on the exact token); **`dir="ltr"`** throughout. Correct `lang` per
  variant and per foreign passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Zero-width characters are load-bearing:** ZWJ (U+200D) / ZWNJ (U+200C) inside Bengali strings
  carry meaning (§3). Build steps, "sanitizers", and copy/normalization passes must **not** strip
  them; a trim/normalize that removes zero-width chars will silently corrupt conjunct rendering.
- **Tokenization / highlighting:** whitespace word separation applies — standard word tokenizers
  and word-boundary highlighting work. Do **not** insert hyphenation: inserting soft hyphens
  inside conjuncts risks broken shaping (§3). (That Bengali avoids Latin-style hyphenation
  generally is ⚠ unverified — the research did not address hyphenation; the no-soft-hyphen rule
  stands on the conjunct-shaping risk alone.)
- **Index alphabet for glossary navigation:** use **Bengali script (বর্ণমালা) order**, i.e. the
  script's own vowel-then-consonant collation, per the **CLDR `bn` collation** (letters in
  U+0980–U+09FF) — **not** an A–Z Latin index. The research did not enumerate the full letter
  sequence; hand-listing it here would be ⚠ unverified, so drive the index from CLDR `bn`
  collation data rather than a hard-coded list.
- **Digits in identifiers vs display:** display numbers per §5 (native ০–৯, lakh/crore grouping,
  `.` decimal); keep Western digits for machine identifiers, dates in ISO 8601 backends, and code.
- **Currency parameterization:** ৳ (U+09F3) vs ₹ per deployment (§9); do not hard-code one symbol.

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans+Bengali> ·
<https://en.wiktionary.org/wiki/Appendix:Unicode/Bengali> ·
<https://www.unicode.org/cldr/charts/latest/summary/bn.html> ·
<https://en.wikipedia.org/wiki/Bengali_(Unicode_block)>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio:** the large majority of letters in `bn` content must be in the **Bengali block
  (U+0980–U+09FF)**. A low Bengali-codepoint ratio signals untranslated source text left in place.
- **Forbidden / suspicious characters:**
  - No **Latin transliteration standing in for a Bengali word** in body text (Latin is allowed
    only for established acronyms — AI, ML, GPU, API — and for slugs/identifiers).
  - No **Devanagari letters** (U+0900–U+0963, U+0966–U+097F). *Exception:* the shared **danda
    U+0964 / double danda U+0965** are legitimately used with Bengali — allow those two, flag any
    other Devanagari codepoint as a wrong-script leak.
  - No **Western digits inside an otherwise Bengali-digit number**, and vice versa (see below).
- **Digit-system consistency:** within a single number/field, digits are **either** all Bengali
  (০–৯) **or** all Western (0–9) — never mixed (e.g. `১2৩` is a defect). Pick the system per
  context per §5 and check it holds.
- **Zero-width integrity:** ZWJ/ZWNJ present where a conjunct form depends on them (spot-check
  known cases like উদ্‌যাপন); flag if a normalization pass has stripped U+200C/U+200D.
- **Number-grouping check:** grouped numbers use **lakh/crore** grouping (`১,২৩,৪৫,৬৭৮`), not
  Western triples (`১২,৩৪৫,৬৭৮`); decimal separator is `.`, group separator `,`.
- **Register consistency:** the `apni` register is recorded and in force (§4) — this check runs
  unconditionally. Scan for stray **তুমি/তুই** pronouns and their verb endings in second-person UI
  copy — a tier mismatch is both a social error and a grammar error.
- **Source-language leak scan (EN/DE → BN):** left-in English function words (the, and, you,
  please), German umlauts/ß, or verb-mid SVO word order surfacing in Bengali sentences.
- **Punctuation consistency:** danda **।** vs Latin period `.` used consistently per the chosen
  house style; no accidental Devanagari double danda where a single is meant.

Sources: <https://en.wikipedia.org/wiki/Bengali_(Unicode_block)> ·
<https://en.wiktionary.org/wiki/Appendix:Unicode/Bengali> ·
<https://www.unicode.org/cldr/charts/latest/summary/bn.html>

---

*Provenance note:* this guide is built solely from an external desk-research pass; several
research citations resolved to community, forum, video, or commercial sources and are marked at
point of use. All `⚠ unverified` markers indicate claims the research itself could not source, or
that could not be confirmed from the primary authorities in §2. A second-model or native-speaker
review against the §2 sources is still outstanding (see Status in the header).
