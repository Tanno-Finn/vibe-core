<!-- base -->
# lang-pa — Punjabi (ਪੰਜਾਬੀ) — setup & sources

> **The translation guide itself is [`pa.md`](pa.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Punjabi is served
better institutionally than most Indian regional languages and worse than Hindi: there are real
bodies, but **there is no single fetchable orthography standard** (see the honest gap at the end of
this section).

**Language-specific authorities (all T1, all verified by fetch):**

- **Language Department, Punjab (ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ)** — a state government body, established
  January 1, 1948, in Patiala, and the nearest thing Punjabi has to a language regulator. Publishes
  **ਪੰਜਾਬ ਕੋਸ਼** (Punjab Dictionary), **ਪੰਜਾਬੀ ਵਿਸ਼ਵਕੋਸ਼** (Punjabi Encyclopedia) and an
  **ਆਨਲਾਈਨ ਸ਼ਬਦਾਵਲੀ** (online terminology database). Its stated aim is to make Punjabi functional in
  "ਸਿੱਖਿਆ, ਸਰਕਾਰ, ਰੁਜ਼ਗਾਰ ਅਤੇ ਪਰਿਵਾਰ". <https://bhashavibhagpunjab.org/>
- **Punjabi University, Patiala — Punjabipedia** — the university encyclopedia, with a bilingual
  dictionary and font converter. "© 2017 ਪੰਜਾਬੀ ਯੂਨੀਵਰਸਿਟੀ, ਪਟਿਆਲਾ". <https://punjabipedia.org/>
- **Punjabi (Gurmukhi, Shahmukhi) to English Dictionary** — the reference bilingual dictionary, and
  notably it covers **both** scripts. "Copyright © RCPLT, Punjabi University, Patiala (Punjab)
  India". <http://dic.learnpunjabi.org/>
- **ACTDPL / RCPLT, Punjabi University (learnpunjabi.org)** — the language-technology center. Hosts
  online Punjabi teaching, "A Reference Grammar of Punjabi (e-book/.pdf)" and a "Punjabi Grammar
  Checker". "© 2013 Research Centre for Technical Development of Punjabi Language, Literature and
  Culture, Punjabi University, Patiala (Punjab) INDIA 147 002." <http://www.learnpunjabi.org/>
- **SANGAM (ACTDPL)** — bidirectional **Gurmukhi ↔ Shahmukhi** transliteration; mission
  "Transcending Script Barriers". Relevant only to the §9 escape hatch, never to `pa` itself.
  <https://sangam.learnpunjabi.org/>
- **Punjabi University, Patiala — *Punjabi-English Dictionary*** — cited by a third party as **the**
  tone-annotation authority ("tone annotations in the examples below are based on those provided in
  Punjabi University, Patiala's *Punjabi-English Dictionary*"), which is itself a strong signal of
  its standing. <https://en.wikipedia.org/wiki/Punjabi_phonology>

**Standards-side authorities (T1, all verified by fetch):**

- **The Unicode Standard 16.0.0, Chapter 12 (South and Central Asia I)** — the normative description
  of Gurmukhi: subjoined forms, addak, tippi/bindi distribution, udaat/yakash, the ISCII wrinkle.
  <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/>
- **Unicode UCD — `CompositionExclusions.txt`** — the normative list behind §3's headline nukta
  finding. Re-fetched during authoring; the six Gurmukhi entries are exactly as documented.
  <https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt>
- **CLDR locale data for `pa`** — `likelySubtags.json` (script resolution), `numbers.json` (digit
  system, grouping, currency pattern), `currencies.json` (INR names and symbol), `plurals.json`
  (two categories, `one` covers 0..1), `ca-gregorian.json` (date and time patterns). All quoted
  verbatim in §5; `numbers.json` and `likelySubtags.json` re-fetched during authoring and confirmed.
  **CLDR re-read (2026-07-27): all five files were re-read against the pinned release CLDR 48.2 (data packages `48.2.0`)
  (published 2026-03-17), replacing this guide's earlier v46 citations — every value quoted in §5 was
  unchanged** (`defaultNumberingSystem: "latn"`, `#,##,##0.###` / `#,##,##0%` / `¤#,##,##0.00`, the
  `¤ #,##0.00` accounting inconsistency, the INR names and `₹`, the two plural categories, the four
  date and four time patterns, and `pa → pa-Guru-IN`). The date/time patterns additionally moved off
  the moving `cldr/main` branch onto that pinned release, so the quoted strings stay reproducible.
- **r12a — Punjabi orthography notes** — the practical script-behavior reference (reordering vowel
  sign, top-bar joining, line-breaking, digit usage, tone). Community-maintained but written against
  the Unicode data; used here as **corroboration**, never as the sole support for a normative rule.
  <https://r12a.github.io/scripts/guru/pa.html>
- **notofonts.github.io/gurmukhi** — the Noto Gurmukhi family listing (§3, §10). Used because the
  Google Fonts specimen page is JS-rendered and returned no content.
  <https://notofonts.github.io/gurmukhi/>

**⚠ Unverified — the statutory claim.** The **Punjab Official Language Act, 1967** reportedly defines
"Punjabi" as *Punjabi in Gurmukhi script* and made it the sole official language of Punjab state.
**The primary text could not be fetched:** the government PDF (prsindia.org) is a scan with no text
layer, and the case-law mirror (indiankanoon.org) returned HTTP 403. **The statutory
"Punjabi = Gurmukhi script" claim therefore stays `⚠ unverified`** and must not be cited as settled.
The *verified* fact that survives is the plain Wikipedia statement of Punjabi's official status in
Punjab. **Fallback candidate for a future round:** `indiacode.nic.in` —
<https://www.indiacode.nic.in/bitstream/123456789/22096/1/the_punjab_official_languages_act.pdf>
(not attempted; the research budget ran out before it could be rerouted).

**❌ Honest gap — there is no fetchable published orthography or spelling standard.** No official
"ਸ਼ਬਦ-ਜੋੜ ਨਿਯਮ" (standardized spelling rules) document for modern Punjabi could be fetched and
verified. Search results pointed to *ਪੰਜਾਬੀ ਸ਼ਬਦ-ਰੂਪ ਤੇ ਪੰਜਾਬੀ ਸ਼ਬਦ-ਜੋੜ ਕੋਸ਼* (ed. Dr. Harkirat Singh) as
the likeliest published spelling reference — ⚠ **never fetched, listed as a priority fallback
candidate.** **Consequence, and it is a real operational consequence: spelling variation in Punjabi
is genuine and unadjudicated.** You will find ਕੰਪਿਉਟਰ / ਕੰਪਿਊਟਰ and ਡਾਟਾ / ਡੇਟਾ side by side *inside a
single institutional corpus* (§6). **Fix this with a project glossary that freezes one form per term
— not by appealing to a standard, because there isn't one you can point at.**

**Source-tier caveat (read before trusting a section).** **Strong, T1-anchored:** §3 (Unicode + UCD +
r12a), §5 (CLDR, quoted verbatim), §2 (institutional sites, fetched). **Encyclopedic-tier only:**
§4 (Wikipedia grammar articles — standard facts, but not an ACTDPL grammar) and §6 (Punjabi
Wikipedia article titles, running text, and Wikidata `pa` labels — **the media tier is missing
entirely** because `bbc.com/punjabi` was host-blocked). **Honest negative:** §8. **Entirely
`[craft]`, unsourced:** §7, plus the §8 word table and the illustrative example pairs in §4.

Sources: <https://bhashavibhagpunjab.org/> · <https://punjabipedia.org/> ·
<http://dic.learnpunjabi.org/> · <http://www.learnpunjabi.org/> · <https://sangam.learnpunjabi.org/> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/numbers.json> ·
<https://r12a.github.io/scripts/guru/pa.html> · <https://en.wikipedia.org/wiki/Punjabi_phonology>

---

## 3. Script & typography

**(Strong section — Unicode 16.0.0 Ch. 12, the UCD, and r12a. This is the guide's best-supported
material and contains its most important technical finding.)**

### 3.1 Block, direction, tokenization, case

Gurmukhi is "a North Indian script used to write the Punjabi (or Panjabi) language of the Punjab
state of India" (Unicode 16.0.0, Ch. 12). Range: **U+0A00–U+0A7F** — **one block only, and it is
small**: "Unicode 17 has 1 dedicated Punjabi block, comprising 80 characters" (r12a).

- **Direction: LTR.** "Gurmukhi text runs left to right in horizontal lines. Words are separated by
  spaces." (r12a). **No bidi work, no mirroring, no `bdi`/LRM/RLM toolbox** — that burden belongs to
  `pa-Arab`, which this guide does not cover (§9).
- **Whitespace tokenization works.** Ordinary word-splitting and word-based highlighting are safe at
  the *word* level. They are **not** safe at the character level (§3.2).
- **No case distinction.** "There is no case distinction." (r12a). **Never apply
  `text-transform: uppercase` to Punjabi UI strings** — it is a no-op on Gurmukhi but mangles any
  embedded Latin (loanword acronyms, brand strings) inconsistently, producing a half-shouted line.
- **Inventory.** "Punjabi has 32 basic consonant letters" with "The inherent vowel for Punjabi is
  pronounced ə" (r12a). The traditional count is 35 — "Modern Gurmukhī has thirty-five original
  letters, hence its common alternative term *paintī* or 'the thirty-five'" (Wikipedia — Gurmukhi).
  The two counts agree: *paintī* counts the three vowel-bearers plus the 32 consonants.

**The top bar (shirorekha) — a CSS trap.** "Within a Gurmukhi word, spacing glyphs are joined
together at the top bar (shirorekha)." (r12a). Consequence: **any `letter-spacing` on Gurmukhi breaks
the headline bar** and makes words look shattered.

- ✅ `:lang(pa) { letter-spacing: normal; }` — and never inherit a tracked heading style into Punjabi.
- ❌ `h1 { letter-spacing: 0.08em }` applied globally — Gurmukhi headings visibly fall apart.

### 3.2 Matras (dependent vowel signs) — one of them reorders

"Post-consonant vowels are written using 9 combining marks (vowel signs)." (r12a); corroborated as
"nine vowel diacritics" (Wikipedia — Gurmukhi), encoded at **U+0A3E–U+0A42, U+0A47, U+0A48, U+0A4B,
U+0A4C**.

**The reordering trap:** "One vowel sign appears to the left of the base consonant letter or
cluster." … "The rendering process places the glyph before the base consonant without changing the
code points." (r12a). That sign is **sihari ਿ (U+0A3F)** `[derived — r12a states the behavior; the
identification of the specific sign is standard knowledge, not directly quoted]`.

- ✅ `ਕਿ` — stored as ਕ (U+0A15) then ਿ (U+0A3F); **drawn** with the ਿ to the **left** of ਕ.
- ❌ Reasoning about "the first character the user sees" from the first code point — it is wrong here.

Four rules follow, and all four describe real bugs a naive pipeline will hit:

1. **Never truncate by code unit.** `str.slice(0, n)`, `substring`, Python `[:n]` orphan matras.
   Truncate by **grapheme cluster** (`Intl.Segmenter` with `granularity: 'grapheme'`).
2. **Never reverse a Punjabi string**, and **never render one character at a time** — typewriter
   animations, per-character CSS animation, per-letter `<span>` wrapping all destroy shaping.
3. **Regex `.` and `[a-z]`-style character classes are meaningless here.** Use Unicode property
   escapes.
4. Logical order ≠ visual order. Any cursor, selection, or highlight logic that assumes otherwise is
   wrong.

### 3.3 Subjoined consonants (pairin akhar) — and why the famous "font bug" is not one

Gurmukhi, unlike most Indic scripts, has **only three** productive subjoined forms:

> "Three 'subscript' letters…are utilised in modern Gurmukhī: forms of ਹ *ha*, ਰ *ra*, and ਵ *va*."
> — Wikipedia — Gurmukhi

Shapes: "The subjoined form for RA is like a knot, while the subjoined HA and VA are written the same
as the base form, without the top bar, but are reduced in size." (Unicode 16.0.0, Ch. 12). Encoding:
"The stacking behavior is produced by adding 0A4D between the two characters to be stacked. The
lower character's shape and size are significantly reduced." (r12a); **U+0A4D is GURMUKHI SIGN
VIRAMA**.

**⚠ Correcting a widely-repeated claim — this is a genuine contribution of this guide.** A long-lived
open font issue is titled "Punjabi (Gurmukhi script):consonant+halant+consonant not handled
correctly" and complains that only four combinations stack — ਕ+halant+ਰ, ਕ+halant+ਵ, ਕ+halant+ਹ, and
ਕ+halant+ਯ — while e.g. ਕ+halant+ਗ renders side by side (googlefonts/noto-fonts issue #529, opened
2015, status *in-evaluation*). **Read against the two script sources above, that "bug" is largely
correct behavior:** modern Gurmukhi only *has* subjoined ਹ, ਰ, ਵ (plus the historical yakash from ਯ).

- ✅ Stacking that should occur: `ਪ੍ਰ` · `ਸ੍ਵ` · `ਵ੍ਹ`
- ❌ Filing ਕ + U+0A4D + ਗ rendering side-by-side as a rendering defect — it is the orthography, not
  the font.
- ❌ "Fixing" copy by inserting viramas to force stacks the orthography does not use.

**Craft rule** `[craft]`**:** if a translator's Punjabi contains a virama between two arbitrary
consonants, that is almost always a **transliteration artifact from Hindi/Sanskrit**, not Punjabi
orthography. This is cheaply automatable (§11).

### 3.4 Tippi ੰ vs bindi ਂ — the distinction that gets mangled

Both mark nasality. They are **not interchangeable**, and choosing by eye is the single most likely
Gurmukhi spelling error from a non-native pipeline.

- **U+0A70 GURMUKHI TIPPI** — ◌ੰ
- **U+0A02 GURMUKHI SIGN BINDI** — ◌ਂ
- **U+0A01 GURMUKHI SIGN ADAK BINDI** — rare; **do not use unless a source text has it.**

Function: "The diacritics ਟਿੱਪੀ *ṭippī* ( ੰ ) and ਬਿੰਦੀ *bindī* ( ਂ ) are used for producing a nasal
phoneme depending on the following obstruent or a nasal vowel at the end of a word." (Wikipedia —
Gurmukhi).

The distribution rule, from two independent sources that agree:

> "Present practice is to use *bindi* only with the dependent and independent forms of the vowels
> *aa*, *ii*, *ee*, *ai*, *oo*, and *au*, and with the independent vowels *u* and *uu*; *tippi* is
> used in the other contexts." — Unicode 16.0.0, Ch. 12

> "ੰ is used after consonants with an inherent vowel, and after the following vowels: ਇੰ, ਿੰ, ੁੰ, ੂੰ, ਅੰ"
> … "ਂ is used with the other vowels (dependent and independent). Most of these vowels have glyphs
> that extend above the top bar, and the bindu fits more easily into the space available." — r12a

**Practical summary:** *tippi* ੰ goes with the short/low vowels (inherent ਅ, and ਿ, ੁ, ੂ, ਇ); *bindi* ਂ
goes with the tall vowels whose glyphs already occupy the space above the top bar (ਾ, ੀ, ੇ, ੈ, ੋ, ੌ, and
independent ਉ / ਊ). **The rule is essentially typographic** — which is exactly why it feels arbitrary
and gets fudged.

- ✅ tippi after a low vowel: `ਹੁੰਦਾ` · ✅ tippi after inherent vowel: `ਅੰਦਰ`
- ✅ bindi after a tall vowel: `ਨਹੀਂ` · `ਦੋਂ`
- ❌ Swapping them by eye. Near-homographs like `ਤੁੰ` vs `ਤੂੰ` vs `ਤੁਂ` look nearly identical at UI sizes
  and are **different strings**.

**QA rule you can automate** `[craft — derived from the two quoted rules, not itself a sourced rule]`:
flag any **U+0A02 (bindi) directly after a bare consonant with no vowel sign**, and any **U+0A70
(tippi) after ਾ ੀ ੇ ੈ ੋ ੌ**. Both patterns are near-certainly wrong.

**Editorial rule:** never let anyone "clean up" Punjabi copy in a plain-text editor without a
Gurmukhi-aware reviewer.

### 3.5 Adhak ੱ (gemination) — and its counter-intuitive position

> "U+0A71 ◌ੱ GURMUKHI ADDAK is a special sign to indicate that the following consonant is geminate."
> — Unicode 16.0.0, Ch. 12

> "Consonant gemination is indicated, unusually for an Indian script, by a special diacritic that
> appears **before** the letter being lengthened." … "It is typed before the consonant (In this way
> it resembles the small tsu in Japanese)." — r12a

**Operationally:** the adhak precedes its consonant in *logical* order, so a pipeline that assumes
"combining marks follow their base" will mis-segment. And adhak is **phonemic, not decorative** —
dropping one changes the word:

- ✅ `ਪਤਾ` (*patā*, "address / knowledge") — no adhak.
- ✅ `ਪੱਤਾ` (*pattā*, "leaf") — with adhak. *(minimal pair marked `[craft]` in the source dossier —
  illustrative, not quoted from a reference work.)*
- ❌ Stripping ੱ as "an accent" during copy-editing — it is a different word, not a decoration.

### 3.6 Nukta letters and the normalization hazard — ⚠ THE HEADLINE FINDING

Punjabi writes Perso-Arabic loan sounds with dotted letters: "six supplementary consonants" —
**ਸ਼ ਖ਼ ਗ਼ ਜ਼ ਫ਼ ਲ਼** — "created by placing a dot (*bindī*) at the foot (*pairă*)" (Wikipedia — Gurmukhi).
Unicode: "The additional consonants (called *pairin bindi*; literally, 'with a dot in the foot,' in
Punjabi) are primarily used to differentiate Urdu or Persian loan words." (Ch. 12).

Precomposed code points exist for all six:

| Code point | Name | Letter (as rendered) |
|---|---|---|
| U+0A33 | GURMUKHI LETTER LLA | ਲ਼ |
| U+0A36 | GURMUKHI LETTER SHA | ਸ਼ |
| U+0A59 | GURMUKHI LETTER KHHA | ਖ਼ |
| U+0A5A | GURMUKHI LETTER GHHA | ਗ਼ |
| U+0A5B | GURMUKHI LETTER ZA | ਜ਼ |
| U+0A5E | GURMUKHI LETTER FA | ਫ਼ |

The nukta itself is **U+0A3C GURMUKHI SIGN NUKTA**.

⚠ **Read the third column carefully.** This guide is itself NFC-normalized, so each glyph in the
**Letter** column is the **decomposed `base + U+0A3C` sequence**, *not* the precomposed code point
named beside it — `U+0A33`, `U+0A36`, `U+0A59`, `U+0A5A`, `U+0A5B` and `U+0A5E` do not occur anywhere
in this file. That is the correct state, for exactly the reason given next; do not "repair" the
column into precomposed forms.

**And all six are in the Unicode Composition Exclusion Table.** These are the *only* lines in the
Gurmukhi range of the normative UCD file — re-fetched and confirmed during authoring:

```
0A33    #  GURMUKHI LETTER LLA
0A36    #  GURMUKHI LETTER SHA
0A59    #  GURMUKHI LETTER KHHA
0A5A    #  GURMUKHI LETTER GHHA
0A5B    #  GURMUKHI LETTER ZA
0A5E    #  GURMUKHI LETTER FA
```
> "This file lists the characters for the Composition Exclusion Table defined in UAX #15, Unicode
> Normalization Forms." — Unicode UCD, `CompositionExclusions.txt`

**What that means, and it is counter-intuitive: NFC does not recompose them.** r12a states the
consequence directly: "NFC does not recombine the parts into atomic characters. Instead,
normalisation produces decomposed forms for both NFC and NFD." … "The decomposed sequence of
letter+nukta is recommended by the Unicode Standard."

- ✅ **After NFC, ਸ਼ is the two-code-point sequence** ਸ (U+0A38) + ਼ (U+0A3C). **This is correct. Do not
  "fix" it.**
- ❌ Assuming NFC gives you the single code point U+0A36 — it does not, and code written on that
  assumption fails silently.
- ✅ `NFC(a) === NFC(b)` before any equality test on Punjabi strings.
- ❌ `a === b` on raw Punjabi strings — a translator's keyboard may emit U+0A36 while your build
  pipeline emits U+0A38 U+0A3C. **Visually identical, unequal strings.** This silently breaks
  translation-memory lookups, key matching, dedup, search, and diffing — the failure mode is *missing
  matches*, not errors, so nothing alerts you.

**Normalization rules for the platform:**

1. **Normalize all Punjabi content to NFC on ingest** — content files, translator submissions, TM
   entries, keys, and both sides of every comparison.
2. **Never compare Punjabi strings byte-wise or code-point-wise without normalizing both sides.**
3. **Grapheme-cluster everything.** After NFC, ਸ਼ is *two* code points and *one* grapheme. Length
   checks, truncation, and cursor logic must use grapheme clusters (§3.2).
4. **⚠ Historical wrinkle, quoted by Unicode itself:** "At the same time, ISCII-1991 does not consider
   U+0A36 to be equivalent to <0A38, 0A3C>, or U+0A33 to be equivalent to <0A32, 0A3C>." (Ch. 12).
   Legacy Punjabi corpora converted from ISCII may therefore carry the precomposed forms deliberately.
   **Normalize anyway, but expect mixed input.**
5. **ੜ (U+0A5C GURMUKHI LETTER RRA) is *not* in the exclusion list** and is a plain letter — a native
   Punjabi retroflex flap, not a loan-sound letter. **Do not lump it in with the nukta set.**

### 3.7 Rare marks — archaic, and a cheap high-signal check

> "U+0A51 ◌ੑ GURMUKHI SIGN UDAAT occurs in older texts and indicates a high tone."
> "U+0A75 ◌ੵ GURMUKHI SIGN YAKASH probably originated as a subjoined form of U+0A2F ਯ GURMUKHI
> LETTER YA." — Unicode 16.0.0, Ch. 12

**U+0A03 GURMUKHI SIGN VISARGA** also exists in the block.

**Guide rule:** all three are **scriptural / archaic** — they belong to Sikh liturgical and older
literary texts, not to modern educational prose. **If any of U+0A51, U+0A75, or U+0A03 appears in a
translated UI string, it is an error** — most likely a copy-paste from a scriptural source or an OCR
artifact. Cheap to detect, high signal (§11).

### 3.8 Punctuation, quotation marks, hyphenation, line-breaking

**Danda ।** "The ਡੰਡੀ *ḍaṇḍī* (।) is used in Gurmukhī to mark the end of a sentence." (Wikipedia —
Gurmukhi). r12a is more measured about modern practice: "Gurmukhi generally uses ASCII punctuation",
with "। may be used rather than a period at the end of a sentence" and "It is often separated from the
last word in the sentence by a small gap, but should not wrap alone to the beginning of the next
line." The character is **U+0964** (shared Indic danda) `[derived — no code-point page was fetched for
U+0964 in the research session; the identification is standard but flagged as such]`.

**➜ Guide decision:** pick **one** sentence terminator and hold it platform-wide. For a modern,
web-native educational product the recommendation is the **ASCII period `.`**, because r12a records
ASCII punctuation as general modern practice and because mixing `।` and `.` across strings reads as
careless. **This is a choice, not a finding** — the two sources pull in slightly different directions,
and the guide does not claim `।` is or is not standard modern practice.

- ✅ One terminator, consistently, across every string in the platform.
- ❌ `।` in half the strings and `.` in the other half.
- If `।` is chosen: it **must** be prevented from wrapping alone — `white-space: nowrap` on the
  terminal token, or a no-break space before it.

**Quotation marks — ⚠ convention unresolved.** The only sourced statement is weak: "Punjabi texts
typically use quotation marks. Of course, due to keyboard design, quotations may also be surrounded
by ASCII double and single quote marks." (r12a). **It does not name the preferred glyphs, and this
guide makes no claim about a Punjabi quotation-mark convention.**

**Practical recommendation** `[craft]`**:** use the same **curly double quotes as the English source,
U+201C “ and U+201D ”**, consistently, with nested quotes in **single curly quotes U+2018 ‘ and
U+2019 ’**. Do **not** ship straight ASCII quotes in prose.

- ✅ “ਜਾਰੀ ਰੱਖੋ” (U+201C … U+201D)  ·  ✅ nested: “ਧਿਆਨ ਰੱਖੋ, ‘ਸ਼ੁਰੂ ਕਰੋ’ ਦਬਾਓ” (U+2018 … U+2019)
- ❌ "ਜਾਰੀ ਰੱਖੋ" — straight ASCII U+0022 in body copy.
- ❌ Mixing curly and straight within one view.

**Hyphenation.** "Words are occasionally hyphenated." with the example **ਵਿਡਿਓ-ਗੇਮ** (r12a). That
describes **lexical** hyphens in compounds, **not** automatic line-break hyphenation. There is no
reliable Gurmukhi hyphenation dictionary, and inserting break hyphens into Gurmukhi is wrong.

- ✅ `:lang(pa) { hyphens: none; }`  ·  ✅ lexical hyphen in a compound: `ਵਿਡਿਓ-ਗੇਮ`
- ❌ `hyphens: auto` for Punjabi.

**Line-breaking.** "By default, Gurmukhi breaks lines at inter-word spaces", and justification works
by "stretching the inter-word spaces" (r12a). Space-delimited, like English.

- ✅ Default breaking at spaces; `overflow-wrap: anywhere` **only** as a last resort on genuinely
  unbreakable tokens such as URLs.
- ❌ `word-break: break-all` or `overflow-wrap: break-word` on Punjabi prose — they split grapheme
  clusters and produce broken shaping.

### 3.9 Fonts and rendering tests

The Noto project lists **"Noto Serif Gurmukhi"** and **"Noto Sans Gurmukhi"**, the sans being
"Available in extensive weight and width variations, including condensed and semi-condensed widths,
plus a separate UI variant (NotoSansGurmukhiUI)" (notofonts.github.io/gurmukhi). r12a names a wider
practical set: "Noto Serif Gurmukhi, Noto Sans Gurmukhi, Baloo Paaji 2, Raavi, Mukta Mahee, Gurmukhi
MN, and Arial MS Unicode".

**Recommended stack** `[craft, built on the two sourced facts above]`:

```css
:lang(pa) {
  font-family: "Noto Sans Gurmukhi", "Mukta Mahee", "Raavi", "Gurmukhi MN", sans-serif;
  letter-spacing: normal;   /* never track Gurmukhi — it breaks the top bar */
  hyphens: none;
}
```

Use the **UI** variant (`NotoSansGurmukhiUI`) for constrained chrome — buttons, tabs, table headers —
since it carries tightened vertical metrics for boxed layouts.

**Rendering pitfalls to test explicitly:**

| Test | What to check |
|---|---|
| Sihari reordering | `ਕਿ` — the ਿ must draw to the **left** of ਕ |
| Subjoined ਹ ਰ ਵ | `ਪ੍ਰ` `ਸ੍ਵ` `ਵ੍ਹ` — must stack, not sit side by side |
| Adhak + tippi together | `ਪੱਤਾ` `ਅੰਦਰ` `ਹੁੰਦਾ` — marks must not collide or clip |
| Nukta, decomposed | `ਸ਼ਬਦ` `ਜ਼ਰੂਰੀ` `ਫ਼ੋਨ` **after NFC** (letter + U+0A3C) — the dot must render below, not as tofu |
| Tall matra + bindi | `ਨਹੀਂ` `ਦੋਂ` — the bindi must clear the top bar |
| Mixed Latin | `AI ਅਤੇ ML` — Latin fallback must not shift the Gurmukhi baseline |

⚠ **Row 4 is the one that most often fails in older webfont subsets.** A subsetter that keeps U+0A36
but drops U+0A3C renders your NFC-normalized text as broken. **Always include U+0A3C in the subset
range — safest is to subset the whole block `U+0A00-0A7F`.**

**Romanization — never in the UI.** Transliterated Punjabi in Latin letters (e.g. writing *tusī̃* or
*shuru karo* instead of ਤੁਸੀਂ / ਸ਼ੁਰੂ ਕਰੋ) must not appear in shipped interface copy. Romanization
belongs to linguistic annotation only; a Latin-letter stand-in for Gurmukhi in a `pa` string is a
defect (§11).

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://r12a.github.io/scripts/guru/pa.html> · <https://en.wikipedia.org/wiki/Gurmukhi> ·
<https://en.wikipedia.org/wiki/Gurmukhi_(Unicode_block)> · <https://notofonts.github.io/gurmukhi/> ·
<https://github.com/googlefonts/noto-fonts/issues/529> (the "font bug" corrected above) ·
<https://www.compart.com/en/unicode/U+0A70> · <https://www.compart.com/en/unicode/U+0A5C>

---

## 10. Technical integration checklist

- **Fonts to ship:** **Noto Sans Gurmukhi** (with **NotoSansGurmukhiUI** for constrained chrome) as the
  primary, **Mukta Mahee / Raavi / Gurmukhi MN** as fallbacks; Noto Serif Gurmukhi where a serif is
  wanted (§3.9). **Verify ₹ (U+20B9) renders** in the chosen stack or fall back to a Latin font for the
  symbol (§5.3).
- **⚠ Font subsetting — subset the whole block `U+0A00-0A7F`.** A subsetter that keeps U+0A36 but
  **drops U+0A3C (nukta)** renders NFC-normalized Punjabi as broken glyphs. This is the top Gurmukhi
  rendering defect and it is caused by the normalization behavior in §3.6, so it will not reproduce in
  a naive precomposed test string.
- **`lang` / `dir` attributes:** `lang="pa"` (base) and `lang="pa-easy"` (simplified variant, subject to
  the header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). **Never emit `lang="pa"` on Shahmukhi content** — CLDR
  resolves it to `pa-Guru-IN` and every downstream consumer mishandles it (§1, §9).
- **Unicode normalization — NFC on ingest, everywhere.** Content files, translator submissions, TM
  entries, keys, and **both sides of every comparison**. Expect ਸ਼ to be **two code points** afterwards;
  that is correct (§3.6). Legacy ISCII-derived corpora may arrive precomposed — normalize anyway.
- **Grapheme-cluster segmentation for anything character-level:** truncation, length limits, cursor and
  selection logic, ellipsis. Use `Intl.Segmenter` with `granularity: 'grapheme'`. **No `slice`/
  `substring` by code unit, no string reversal, no per-character rendering or animation** (§3.2).
- **CSS for `:lang(pa)`:** `letter-spacing: normal` (tracking breaks the shirorekha top bar);
  `hyphens: none` (no Gurmukhi hyphenation dictionary exists); **no `word-break: break-all` and no
  `overflow-wrap: break-word`** on prose; **no `text-transform: uppercase`** (no-op on Gurmukhi, mangles
  embedded Latin) (§3.1, §3.8).
- **Tokenization:** whitespace word-splitting is safe at word level (word-based highlighting works).
  Character-level operations are **not** safe — see the grapheme-cluster rule above.
- **Numbers / dates / currency in display vs identifiers:** display via `Intl.NumberFormat('pa')` and
  `Intl.DateTimeFormat('pa')` — **2,2,3 grouping** (`1,00,000`), `.` decimal, `,` group, `₹` prefixed
  with no space, `d/M/yy` short dates (**day first**), `h:mm a` 12-hour time. Keep **Western digits and
  ISO 8601 (YYYY-MM-DD)** for backends, identifiers, and code. **Pass an explicit locale-aware formatter
  to charting libraries** — chart axes are the usual leak (§5.2).
- **Plurals:** wire **both** `one` and `other` for every countable string; remember **`one` covers
  n = 0** (§5.5).
- **Sentence terminator:** one choice, platform-wide (the recommendation is the ASCII period). If `।`
  U+0964 is chosen instead, **prevent it from wrapping alone** to the next line (§3.8).
- **Quotation marks:** normalize straight ASCII quotes in body copy to **U+201C “ / U+201D ”**, nested
  **U+2018 ‘ / U+2019 ’** (§3.8 — ⚠ this is a `[craft]` house convention, not a sourced Punjabi norm).
- **Index alphabet for glossary navigation:** ⚠ **gap — the research supplied no explicit Gurmukhi
  collation sequence.** What *is* established: 32 consonants plus three vowel-bearers (the 35 *paintī*),
  nine dependent vowel signs, and **six nukta letters that NFC leaves decomposed**. **Drive glossary
  ordering from CLDR `pa` collation, never from a raw code-point sort** — a code-point sort scatters the
  decomposed nukta letters away from their base letters and misplaces the combining marks. **Next
  research round: fetch the CLDR `pa` collation chart and record the explicit sequence here.**
- **No romanization in the UI:** Latin-letter transliteration of Punjabi never appears in shipped
  interface copy (§3.9).

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://r12a.github.io/scripts/guru/pa.html> · <https://notofonts.github.io/gurmukhi/> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/numbers.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/likelySubtags.json>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md).

- **⚠ Nukta normalization check (highest value — run it first).** Normalize **both sides to NFC before
  any string comparison** involving Punjabi. Additionally: **flag any occurrence of the precomposed
  code points U+0A33, U+0A36, U+0A59, U+0A5A, U+0A5B, U+0A5E in NFC-normalized content** — after NFC
  they should not be there, and their presence means something in the pipeline skipped normalization.
  The failure mode this catches is **silent**: mismatched TM lookups and key misses, not exceptions
  (§3.6).
- **⚠ Number-grouping test at ≥ 100,000 (mandatory).** Assert `100000` → **`1,00,000`**, `1000000` →
  **`10,00,000`**, `123456789` → **`12,34,56,789`**, and a currency amount → **`₹1,00,000.00`**.
  **A test that only checks `1,234` passes on completely broken code**, because below one lakh the
  Indian and Western systems are identical. Any fixture used for Punjabi number formatting must cross
  the lakh boundary (§5.2).
- **Digit-system consistency:** flag **any code point in U+0A66–U+0A6F** (Gurmukhi digits ੦–੯) inside a
  Punjabi string — legitimate only in decorative list counters, and a likely keyboard-layout accident
  anywhere else. Also flag mixed Western/Gurmukhi digits within one view (§5.1).
- **Forbidden characters — archaic marks:** flag **U+0A51 (udaat)**, **U+0A75 (yakash)** and **U+0A03
  (visarga)** in any UI string. All three are scriptural/archaic and almost certainly indicate a
  copy-paste from a liturgical source or an OCR artifact (§3.7).
- **Virama sanity check:** flag **U+0A4D between two consonants other than a following ਹ, ਰ, or ਵ**.
  Modern Gurmukhi has only those three subjoined forms; anything else is near-certainly a
  transliteration artifact from Hindi/Sanskrit (§3.3).
- **Tippi/bindi distribution check** `[craft — derived, not a sourced rule]`: flag **U+0A02 (bindi)
  directly after a bare consonant with no vowel sign**, and **U+0A70 (tippi) after ਾ ੀ ੇ ੈ ੋ ੌ**. Both
  patterns are near-certainly wrong (§3.4).
- **Register consistency (ਤੁਸੀਂ):** grep second-person copy for **ਤੂੰ**, **ਤੇਰਾ**, **ਤੇਰੀ**, **ਤੈਨੂੰ** —
  each hit is a register defect against the recorded baseline (§4). Also flag ਤੂੰ
  imperatives (`ਕਰ`, `ਰੱਖ`, `ਚੁਣ`, `ਵੇਖ`) where the ਤੁਸੀਂ forms (`ਕਰੋ`, `ਰੱਖੋ`, `ਚੁਣੋ`, `ਵੇਖੋ`) are
  expected. **Maintain an explicit exemption list** for quoted dialogue, songs, and scriptural
  quotations, where ਤੂੰ may be authentic.
- **Plural coverage at zero:** assert every countable string supplies **both** `one` and `other`, and
  **test at n = 0, 1, 2**. Punjabi's `one` covers **n = 0..1**, so English-derived plural logic breaks
  precisely in empty states and zero-count badges (§5.5).
- **Date-order check:** Punjabi short dates are **`d/M/yy` — day first, two-digit year**. Flag `M/d/y`
  output, hardcoded `HH:mm` 24-hour times (Punjabi uses `h:mm a`), and hand-translated month names
  (they must come from CLDR) (§5.4).
- **Currency formatting:** `₹` must sit **immediately before the amount with no space**, and the amount
  must carry lakh grouping — flag `₹ 100,000.00` (both defects) (§5.3).
- **Script-ratio expectation:** `pa` content should be overwhelmingly Gurmukhi (U+0A00–U+0A7F) plus
  Western digits and punctuation. **Flag Latin-letter romanization standing in for Gurmukhi** (e.g.
  *shuru karo* instead of ਸ਼ੁਰੂ ਕਰੋ), and flag **Latin homoglyphs or Devanagari code points** appearing
  inside otherwise-Gurmukhi words — Devanagari in a `pa` string usually means a Hindi source leaked
  through (§3.9).
- **Forbidden punctuation in body copy:** no **straight ASCII quotes `"` `'`** — Punjabi body copy uses
  **“…”** (U+201C / U+201D) with nested **‘…’** (U+2018 / U+2019) per the §3.8 house convention (⚠
  `[craft]`, not a sourced Punjabi norm). Also flag **mixed sentence terminators** — `।` (U+0964) and
  `.` must not both appear across the platform (§3.8).
- **CSS regression checks:** assert `letter-spacing: normal`, `hyphens: none`, and the absence of
  `text-transform: uppercase`, `word-break: break-all` and `overflow-wrap: break-word` on any selector
  reaching `:lang(pa)` prose (§3.1, §3.8, §10).
- **Rendering smoke test:** render the six §3.9 fixtures (`ਕਿ`, `ਪ੍ਰ`/`ਸ੍ਵ`/`ਵ੍ਹ`, `ਪੱਤਾ`/`ਅੰਦਰ`/`ਹੁੰਦਾ`,
  NFC-normalized `ਸ਼ਬਦ`/`ਜ਼ਰੂਰੀ`/`ਫ਼ੋਨ`, `ਨਹੀਂ`/`ਦੋਂ`, `AI ਅਤੇ ML`) after every font or subset change. The
  nukta row is the one that catches subsetting regressions.
- **Source-language leak scan (EN → PA):** left-in English function words; **verbs sitting
  mid-sentence** (Punjabi is SOV — a mid-clause verb is almost always a calque, §4/§7); concatenated
  strings where a variable follows the verb; English number/date formatting surfacing in Punjabi text;
  and body-part / car / food metaphors carried over literally (§7).

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/numbers.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/pa.xml> ·
<https://r12a.github.io/scripts/guru/pa.html>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources.** Three T1 anchors — the UCD
`CompositionExclusions.txt`, CLDR `pa` `numbers.json`, and CLDR `likelySubtags.json` — were **re-fetched
during authoring and confirmed verbatim**. Every ⚠, tier label (T1 / T2-enc / T2-txt) and `[craft]`
marker the dossier set has been carried through unchanged. **Coverage is uneven and the research was a
first pass:** the underlying web-search budget was exhausted mid-run, after which the researcher
continued via direct primary-source fetches — biasing the result towards standards data (§3, §5, §2 are
strong) and away from Punjabi-language media and community discussion (§6 lost its media tier when
`bbc.com/punjabi` was host-blocked; §8's negative finding is moderate, not conclusive; §7 is entirely
`[craft]`). Two decisions in this guide are **human-gate decisions — choices the project had to make
consciously and write down, not sign-offs obtained from anyone**: the **Gurmukhi script base** (§1 —
with its stated cost of excluding ~89 million Shahmukhi-side speakers) and the **ਤੁਸੀਂ register**
(§4). Both are taken and recorded; a downstream project weighing the same evidence may record
different ones. **No native-speaker review has taken place** — see Status in the header.
