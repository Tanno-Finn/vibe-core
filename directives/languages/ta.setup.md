<!-- base -->
# lang-ta — Tamil (தமிழ்) — setup & sources

> **The translation guide itself is [`ta.md`](ta.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

> ⚠ **Read this section as a map of *who exists*, not as a verified statement of *what they
> mandate*.** The weakness is structural, not accidental: three Tamil Nadu and Indian government
> hosts failed at the network layer during research (`tamildevelopment.tn.gov.in` → DNS failure;
> `tn.gov.in` → connection refused; `censusindia.gov.in` → TLS certificate failure), and the
> research ran **without a web-search tool**, so there was no way to route around them. **Absence of
> a source here is weak evidence of absence in the world.**

### 2a. Legally normative — status sourced, instruments not read

| Body | Jurisdiction | Standing | Verified? |
|---|---|---|---|
| **Government of Tamil Nadu** | Tamil Nadu, India | Tamil is the state's official language; the community source dates this to the **Tamil Nadu Official Language Act, 1956** | Status ✅ community-tier; **the Act's text ❌ — both encyclopedia title variants returned 404** |
| **Directorate / Department of Tamil Development** (தமிழ் வளர்ச்சித் துறை) | Tamil Nadu | The department responsible for Tamil promotion and, by repute, terminology | ❌ **DNS failure.** ⚠ **unverified** — named from prior knowledge; existence, remit, and publications **all unconfirmed** |
| **Department of Official Languages** | Sri Lanka | Implements the constitutional co-official status of Tamil | ⚠ **Partial** — the homepage returned a language-selection shell; a deep link returned an unrelated certificate-verification page. **Remit not established** |
| **Government of Singapore** | Singapore | Tamil is one of four official languages | ✅ status community-tier; statute text ❌ |

### 2b. 🔴 Both official terminology glossaries were located and neither could be retrieved

This is the single most consequential gap in the guide, and it is why **§6 is labeled observation
throughout**.

- **Tamil Virtual Academy** (தமிழ் இணையக் கல்விக்கழகம்) is confirmed from its own site as a **Tamil
  Nadu government institution** — state logo, a `tn.gov.in` contact address, premises on the Anna
  University campus in Chennai — with a verified remit covering courses, a digital library, NLP
  research and, directly relevant here, **fonts, Tamil Unicode, keyboard interfaces, and a technical
  glossary**. ⚠ **The glossary's landing page exists (dated 09-08-2016) and contains no entries**;
  it points into a section that could not be reached. **So: a real terminology publisher, and zero
  verified terms from it.**
- **Tamil Language Council, Singapore** — remit verified verbatim, to *"promote the awareness and
  greater use of Tamil language among the Tamil speaking community in Singapore."* Its site
  references an **English–Tamil Glossary Book** produced by the **Ministry of Digital Development
  and Information** with the Council's support. ⚠ **The glossary could not be retrieved** — the
  resources path returned 404 and a direct fetch of the site timed out. **A national digital
  ministry's English–Tamil glossary is very likely the best official source for modern IT and AI
  terminology in Tamil, and it remains unread.**

> **Binding consequence for the whole guide.** Every Tamil term in §6 — and every Tamil term this
> guide reproduces anywhere outside a Unicode or CLDR citation — is **observed usage from a live
> corpus**. None of it is officially prescribed terminology. Do not write, and do not let a brief or
> a term-sheet imply, that any of it carries institutional sanction.

### 2c. Influential and reachable — the corpus that carries §4, §6, and the register census

The Tamil Wikimedia projects (`ta.wikipedia`, `ta.wiktionary`, `ta.wikibooks`, `ta.wikinews`,
`ta.wikiquote`, `ta.wikisource`, all confirmed to exist via the Wikimedia site-matrix API) carry
**no normative weight whatsoever**. They are used here for one thing only, and it is a legitimate
thing: **measuring what modern written Tamil actually does.** Where this guide reports a count
(§5b digit census, §5g grantha audit, §4a register census, §6c terminology), that count comes from
this corpus, fetched through an API that returns article text verbatim rather than through a
summarizing layer.

⚠ **Two media corpora were blocked** (an international broadcaster's Tamil service and a major Tamil
daily), so the news-register sample is **volunteer news wiki only** — smaller, older, and with a
contributor skew that probably **inflates the grantha-avoidance signal** in §5g. That finding is
real but possibly over-weighted.

### 2d. The Official tier that *was* reachable — Unicode and CLDR

- **The Unicode character database** (`UnicodeData.txt`, fetched whole and filtered by codepoint
  range). The block census in §3a — codepoints, official names, General_Category, canonical
  decompositions — is quoted field data from it. The chart PDF for the block returned unparsed
  binary and was **not** the source.
- **`CompositionExclusions.txt`** and **`DerivedNormalizationProps.txt`** — the evidence for §3d,
  the NFC finding.
- **The Unicode Standard core specification, chapter 12 §12.6** — extracted locally from a 3.4 MB
  page. The richest single source in this guide: two-part vowels, the puḷḷi-versus-anusvara warning,
  grantha, the āytam, confusable digits, the ௌ/ள homoglyph, the śrī equivalence recommendation, and
  the `ra` letterform divergence between India, Malaysia/Singapore, and Sri Lanka.
- **The Unicode Tamil FAQ** — the position on private-use-area syllabary re-encoding (§3j).
- **UAX #29** (Text Segmentation) — which uses Tamil as its own worked example of an extended
  grapheme cluster.
- **W3C ILREQ** — line breaking; ⚠ thin on Tamil and Devanagari-centric.
- **CLDR**, fetched as **raw locale XML pinned to the `release-48-2` tag** for `ta`, `ta_LK`,
  `ta_SG`, `ta_MY` and `root`, parsed locally with all `↑↑↑` inheritance markers resolved against
  `root`. Everything in §5 rests on this. **The pin is the point:** a release tag is immutable, so
  every value quoted below can still be checked against the URL it is quoted from. The `main`
  branch these links formerly pointed at is pre-release development data and **has since moved** —
  re-read at the pin on 2026-07-27, the `ta` values below are unchanged, but that could only be
  established by pinning.

### 2e. 🔴 The fetch layer corrupts Tamil characters — three confirmed defect classes

> **This is a method warning that governs every character in this guide, and it is not hypothetical:
> the research pass reproduced all three defects and had to route around them.**
>
> | Defect | Where it appeared | How it was routed around |
> |---|---|---|
> | Quotation marks silently flattened to ASCII | A script-notes page reported a codepoint while serving an ASCII glyph | Re-derived from **CLDR `root.xml` by codepoint**, not from prose |
> | **A Telugu character substituted for a Tamil one** | The same page rendered the Tamil `uu` vowel sign as **U+0C42 TELUGU VOWEL SIGN UU**, not U+0BC2 | Glyph discarded; taken from the Unicode core spec and the character database |
> | **The wrong combining mark for the puḷḷi** | An encyclopedia summary rendered the puḷḷi as **U+0B82 TAMIL SIGN ANUSVARA** | Discarded; the standard explicitly warns against exactly this confusion (§3e) |
>
> **Where this guide states a codepoint, trust the codepoint over the glyph.** And treat any Tamil
> string that reached you through a summarizing layer as corrupt until a byte census says otherwise.
> The research dossier behind this guide **caught this defect in its own quotation table after
> writing it** — the table named the correct codepoints while containing ASCII characters. Prose
> about codepoints is not evidence that the codepoints were written (§11).

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/DerivedNormalizationProps.txt> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> · <https://www.unicode.org/faq/tamil.html> ·
<https://www.unicode.org/reports/tr29/> · <https://www.w3.org/TR/ilreq/> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta.xml> ·
<https://www.tamilvu.org/en/technical-glossory> · <https://www.languagecouncils.sg/tamil/en> ·
<https://meta.wikimedia.org/w/api.php>

---

## 3. Script & typography

*Housekeeping convention for this document: Tamil strings are set in **bold** without added
quotation marks, so that any quotation character you see inside a citation is one the source itself
served.*

**This is the guide's center of gravity.** Tamil fails loudly when a font is missing and silently
when a string routine is naive — and the silent failures are the expensive ones.

### 3a. The block — a census from the character database, not from a chart

Extracted from `UnicodeData.txt` by codepoint range. Fields quoted: codepoint, official name,
General_Category, canonical decomposition.

**Independent vowels (12):**
**அ** `U+0B85` A · **ஆ** `U+0B86` AA · **இ** `U+0B87` I · **ஈ** `U+0B88` II · **உ** `U+0B89` U ·
**ஊ** `U+0B8A` UU · **எ** `U+0B8E` E · **ஏ** `U+0B8F` EE · **ஐ** `U+0B90` AI · **ஒ** `U+0B92` O ·
**ஓ** `U+0B93` OO · **ஔ** `U+0B94` AU — the last of which **decomposes to `U+0B92 U+0BD7`**.

**Native consonants (18):**
**க** `U+0B95` KA · **ங** `U+0B99` NGA · **ச** `U+0B9A` CA · **ஞ** `U+0B9E` NYA ·
**ட** `U+0B9F` TTA · **ண** `U+0BA3` NNA · **த** `U+0BA4` TA · **ந** `U+0BA8` NA ·
**ன** `U+0BA9` NNNA · **ப** `U+0BAA` PA · **ம** `U+0BAE` MA · **ய** `U+0BAF` YA ·
**ர** `U+0BB0` RA · **ற** `U+0BB1` RRA · **ல** `U+0BB2` LA · **ள** `U+0BB3` LLA ·
**ழ** `U+0BB4` LLLA · **வ** `U+0BB5` VA.

**Grantha consonants (5)** — status and use in §3f:
**ஜ** `U+0B9C` JA · **ஶ** `U+0BB6` SHA · **ஷ** `U+0BB7` SSA · **ஸ** `U+0BB8` SA ·
**ஹ** `U+0BB9` HA.

**Signs:** **ஂ** `U+0B82` SIGN ANUSVARA (category Mn) · **ஃ** `U+0B83` SIGN VISARGA (category **Lo**
— a *spacing* letter, the āytam) · **்** `U+0BCD` **SIGN VIRAMA** (Mn — the puḷḷi) ·
**ௐ** `U+0BD0` TAMIL OM · **ௗ** `U+0BD7` AU LENGTH MARK (Mc).

**Dependent vowel signs (11)** — note the General_Category split, which is what makes grapheme
clustering behave the way it does:

| Codepoint | Sign | Unicode name | Category | Canonical decomposition |
|---|---|---|---|---|
| `U+0BBE` | ா | VOWEL SIGN AA | Mc | — |
| `U+0BBF` | ி | VOWEL SIGN I | Mc | — |
| `U+0BC0` | ீ | VOWEL SIGN II | **Mn** | — |
| `U+0BC1` | ு | VOWEL SIGN U | Mc | — |
| `U+0BC2` | ூ | VOWEL SIGN UU | Mc | — |
| `U+0BC6` | ெ | VOWEL SIGN E | Mc | — |
| `U+0BC7` | ே | VOWEL SIGN EE | Mc | — |
| `U+0BC8` | ை | VOWEL SIGN AI | Mc | — |
| `U+0BCA` | ொ | VOWEL SIGN O | Mc | **`U+0BC6 U+0BBE`** |
| `U+0BCB` | ோ | VOWEL SIGN OO | Mc | **`U+0BC7 U+0BBE`** |
| `U+0BCC` | ௌ | VOWEL SIGN AU | Mc | **`U+0BC6 U+0BD7`** |

**Digits and numerals:** `U+0BE6`–`U+0BEF` **௦௧௨௩௪௫௬௭௮௯** TAMIL DIGIT ZERO…NINE (Nd) ·
**௰** `U+0BF0` NUMBER TEN · **௱** `U+0BF1` NUMBER ONE HUNDRED · **௲** `U+0BF2` NUMBER ONE THOUSAND
(No) · `U+0BF3`–`U+0BF8` day/month/year/debit/credit/as-above signs (So) · **௹** `U+0BF9`
**TAMIL RUPEE SIGN** (Sc) · **௺** `U+0BFA` NUMBER SIGN (So).

> ⚠ **U+0C42 is a Telugu character and must never appear in Tamil content.** It is named here only
> because the research fetch layer substituted it for the Tamil UU vowel sign `U+0BC2` (§2e). It
> belongs on the forbidden-character list (§11).

### 3b. Whitespace tokenization works — but a "word" is enormous

Tamil separates words with spaces, so there is no Thai- or Khmer-style segmentation problem. There
*is* a **length** problem, because Tamil is agglutinative (§4b): a single orthographic word can
carry seven morphemes. Long agglutinated words overflow narrow mobile containers.

🏠 **House rule (craft, low risk):** set `overflow-wrap: break-word` as a safety net, and do **not**
enable `hyphens: auto` for `lang="ta"` — see §3i for why the hyphenation evidence is contradictory.

### 3c. 🔑 Two-part and left-side vowels — visual position is not string index

**The Unicode Standard §12.6.2, verbatim:**

> **"Tamil also has several vowels that consist of elements which flank the consonant to which they
> are applied."**

> **"In these examples, the representation on the left, which is a single code point, is the
> preferred form and the form in common use for Tamil. In the process of rendering, these two-part
> vowels are transformed into the two separate glyphs equivalent to those on the right, which are
> then subject to vowel reordering."**

and on the left-side vowels:

> **"The Tamil vowels U+0BC6 ◌ெ TAMIL VOWEL SIGN E, U+0BC7 ◌ே TAMIL VOWEL SIGN EE, and U+0BC8 ◌ை
> TAMIL VOWEL SIGN AI are reordered in front of the consonant to which they are applied."**

> **"For either left-side vowels or two-part vowels, the ordering of the elements is unambiguous:
> the consonant or consonant cluster occurs first in the memory representation, followed by the
> vowel."**

**So six of the eleven vowel signs render somewhere other than after their consonant, and all eleven
are stored after it.** Any code that slices, truncates with an ellipsis, animates per character, or
"highlights the first letter" will cut a syllable in half and leave a floating vowel sign on screen:

- ✅ **கோ** — the first **extended grapheme cluster** of **கோடி**: `U+0B95` plus `U+0BCB`, kept whole
- ❌ **ோடி** — what a code-unit `slice(1)` returns: the vowel sign left orphaned, its consonant
  gone, rendering against whatever happens to precede it

⚠ Note which mark is orphaned there: **`U+0BCB` VOWEL SIGN OO**, a two-part vowel — **not** the
virama. Tamil marks with adjacent codepoints do very different jobs (§3e), and a bug report that
names the wrong one sends the reader hunting in the wrong place.

**UAX #29 uses Tamil as its own worked example** of an extended grapheme cluster:

> **"Tamil ni: 0BA8 ( ந ) TAMIL LETTER NA, 0BBF ( ி ) TAMIL VOWEL SIGN I"**

listed as **one** cluster via the rule **"Do not break before SpacingMarks"** (GB9a). Because most
Tamil vowel signs are category **Mc** (spacing marks — see the §3a table), extended grapheme
clusters are the correct unit for cursor movement, truncation, and character counts.

⚠ UAX #29 also notes that *"Some consonant cluster aksaras are not incorporated into the default
rules for extended grapheme clusters"* and may need tailoring. So a grapheme segmenter is right for
truncation but **is not guaranteed to match a Tamil teacher's notion of a letter** — do not build a
"count the letters" learning exercise on it without a native check.

### 3d. 🔑 The good news: NFC *repairs* Tamil instead of damaging it

**This is a genuine, verified difference from the other Indic scripts this kit covers, and it is
worth stating plainly.**

`CompositionExclusions.txt` and `DerivedNormalizationProps.txt` were both checked: **no Tamil
codepoint appears in either exclusion list** (the nearest entries, `U+0B5C` and `U+0B5D`, are
Oriya). The round-trip test under the character database:

```
U+0BCA  NFD -> U+0BC6 U+0BBE   NFC(NFD) -> U+0BCA   round-trip OK
U+0BCB  NFD -> U+0BC7 U+0BBE   NFC(NFD) -> U+0BCB   round-trip OK
U+0BCC  NFD -> U+0BC6 U+0BD7   NFC(NFD) -> U+0BCC   round-trip OK
U+0B94  NFD -> U+0B92 U+0BD7   NFC(NFD) -> U+0B94   round-trip OK
```

> **🔑 Normalizing Tamil content to NFC on ingest is safe, and it actively *fixes* decomposed input
> from a badly behaved keyboard or converter.** The research states this as a verified contrast with
> the other Indic scripts in this kit: **the Marathi eyelash-reph and the Punjabi nukta cannot be
> repaired by NFC; Tamil's two-part vowels can — Tamil is the opposite case.** ⚠ The *reason* those
> two resist NFC is not established here, only the fact that they do. The
> single-codepoint form is also what the standard calls "the preferred form and the form in common
> use" (§3c), so NFC and editorial preference point the same way for once.

> **🔴 And now what NFC does *not* cover — every one of these survives normalization untouched:**
>
> - **`U+0B82` written where `U+0BCD` belongs** (§3e). Different characters, not canonically
>   equivalent. NFC will not notice.
> - **`U+0BC6 U+0BB3` written where `U+0BCC` belongs** (§3g). Looks identical, normalizes to itself.
> - **A Telugu `U+0C42` substituted for a Tamil `U+0BC2`** (§2e, §3a).
> - **`ஸ்ரீ` versus `ஶ்ரீ`** (§3f) — the standard *recommends* treating the two as equivalent in
>   search, but they are **not** canonically equivalent and no normalizer will merge them.
> - **Sandhi variation** — **இயந்திரக் கற்றல்** versus **இயந்திர கற்றல்** (§4e). A spelling choice.
> - **Grantha variation in month names** — **ஜூன்** versus **சூன்** (§5g). A spelling choice.
> - **Private-use-area or legacy 8-bit encodings** (§3j). Those are not Unicode Tamil at all.
>
> **NFC is a floor, not a QA strategy.** Everything above needs its own deterministic check (§11).

### 3e. 🔴 The puḷḷi is U+0BCD — never U+0B82

**The Unicode Standard §12.6.1, verbatim:**

> **"An orthographic cluster consisting of multiple consonants (represented by <C1, U+0BCD ◌்
> TAMIL SIGN VIRAMA, C2, …>) is normally displayed with explicit viramas, which are called puḷḷi in
> Tamil."**

> **"The puḷḷi is typically rendered as a dot centered above the character. It occasionally appears
> as small circle instead of a dot, but this glyph variant should be handled by the font, and not be
> represented by the similar-appearing U+0B82 ◌ஂ TAMIL SIGN ANUSVARA."**

**That is a homoglyph warning issued by the standard itself — and the research fetch layer walked
straight into it** (§2e). The dot above a consonant is **`U+0BCD`**. It is a `Mn` combining mark
whose job is to strip the inherent vowel, and it is everywhere in ordinary Tamil prose:

| | Word | Codepoints of the marked positions |
|---|---|---|
| ✅ | **மென்பொருள்** | ends `U+0BB3 U+0BCD`; the interior mark is `U+0BCD` after `U+0BA9` |
| ❌ | **மெனஂபொருளஂ** | the same word with `U+0B82` substituted — ⚠ constructed corruption, shown because this is precisely what a degraded pipeline produced |

**In modern Tamil prose `U+0B82` should occur essentially never.** Put it on the
forbidden-character scan (§11).

**Tamil needs far less joiner machinery than Devanagari**, and this is sourced:

> **"The situation is quite different for Tamil because the script uses very few consonant
> conjuncts."** · **"A wide variety of modern Tamil words are written without a conjunct form, with
> a fully visible puḷḷi."**

**→ Do not port Hindi or Marathi ZWJ/ZWNJ logic to Tamil.** The standard mentions ZWNJ only for the
narrow case of forcing a visible puḷḷi in `kṣa` and `śrī`.

### 3f. Grantha letters, the āytam, and the purist objection

**The Unicode Standard §12.6.1:**

> **"The Tamil script has fewer consonants than the other Indic scripts."** · **"The Grantha script
> is often also used by Tamil speakers to write Sanskrit because Grantha contains these missing
> consonants."**

The community description is consistent: the grantha letters are *"regarded as supplementary to the
standard alphabet"* and are *"sometimes used to represent sounds not native to Tamil, that is, words
adopted from Sanskrit."*

**The purist objection is real and organized — and this guide can only attest that much.** The
encyclopedia article on the script cites a document titled *"Attempts to 'Pollute' Tamil Unicode
with Grantha Characters"*. ⚠ **That referenced document was not fetched.** What can be stated: the
citation exists, which evidences an organized objection; **its arguments cannot be characterized
here.** The broader purist context *is* solidly sourced — see §6a on the Pure Tamil movement.

**The āytam ஃ `U+0B83` is the loanword workhorse, and it is how Tamil spells `f`.**
The Unicode Standard §12.6.3, verbatim:

> **"The character U+0B83 ஃ TAMIL SIGN VISARGA is normally called aytham in Tamil. It is
> historically related to the visarga in other Indic scripts, but has become an ordinary spacing
> letter in Tamil. The aytham occurs in native Tamil words, but is frequently used as a modifying
> prefix before consonants used to represent foreign sounds. In particular, it is used in the
> spelling of words borrowed into Tamil from English or other languages."**

Attested in the live corpus, *California*:

| | Form | Note |
|---|---|---|
| ✅ | **கலிஃபோர்னியா** | `U+0B83` ஃ + `U+0BAA` ப = the `f` sound — attested spelling |
| ❌ | **கலிபோர்னியா** | ⚠ rule-derived: bare `U+0BAA` ப for English `f` loses the distinction the āytam encodes |

**A translator who reaches for a grantha letter to spell `f` has picked the wrong tool.** The āytam
is the sourced device.

**`U+0BB6` ஶ SHA is a special case with a compatibility consequence.** §12.6.3 documents that it was
added only in **Unicode 4.1 (2005)** for the śrī ligature, and:

> **"Due to slow updates to implementations, both representations are widespread in existing text.
> Therefore, treating both representations as equivalent sequences is recommended."**

So **ஸ்ரீ** (`U+0BB8 U+0BCD U+0BB0 U+0BC0`) and **ஶ்ரீ** (`U+0BB6 U+0BCD U+0BB0 U+0BC0`) must compare
equal in search. Both are NFC-stable, and — as §3d says — **normalization will not merge them for
you**; the search layer has to.

### 3g. Confusable characters — two homoglyph traps inside correct-looking text

**Tamil digits versus Tamil letters.** The Unicode Standard §12.6.3, Table 12-29:

> **"In some Tamil fonts, the digits for two and eight look exactly like the letters u and a,
> respectively."**

The pairs the standard lists: **௧** `U+0BE7` vs **க** `U+0B95` · **௨** `U+0BE8` vs **உ** `U+0B89` ·
**௭** `U+0BED` vs **எ** `U+0B8E` · **௮** `U+0BEE` vs **அ** `U+0B85`. Since this platform bans Tamil
digits outright (§5b), the practical instruction is inverted and gets *easier*: **any codepoint in
`U+0BE6`–`U+0BEF` inside Tamil content is a probable typo for a Tamil letter.**

**The ௌ/ள trap — the dangerous one, because it hides inside a normal word.** §12.6.2:

> **"In the decompositions of these two vowel characters, the rightmost part is represented as the
> character U+0BD7 ◌ௗ TAMIL AU LENGTH MARK, which looks exactly like the separate character,
> U+0BB3 ள TAMIL LETTER LLA."**

> **"0BCC ◌ௌ ≡ 0BC6 ◌ெ + 0BD7 ◌ௗ ≠ 0BC6 ◌ெ + 0BB3 ள"**

- ✅ **ௌ** — one codepoint, `U+0BCC`
- ❌ **ெள** — `U+0BC6` followed by `U+0BB3`: visually the same, a different word, and NFC-stable in
  the wrong form

**→ The sequence `U+0BC6` immediately followed by `U+0BB3` is almost certainly a mistyped
`U+0BCC`.** Add it to the byte-level scan (§11).

### 3h. Quotation marks — codepoints first, glyphs second

**CLDR `ta.xml` contains no `<delimiters>` override.** All four fields are inherit-from-root markers
— confirmed by octal dump: the element bodies are literally `U+2191 ↑` three times over. Tamil
therefore takes the **root defaults**, extracted from `root.xml` by codepoint rather than from any
prose summary:

| Role | Character | Codepoint | Unicode name |
|---|---|---|---|
| `quotationStart` | “ | **U+201C** | LEFT DOUBLE QUOTATION MARK |
| `quotationEnd` | ” | **U+201D** | RIGHT DOUBLE QUOTATION MARK |
| `alternateQuotationStart` | ‘ | **U+2018** | LEFT SINGLE QUOTATION MARK |
| `alternateQuotationEnd` | ’ | **U+2019** | RIGHT SINGLE QUOTATION MARK |

**Independently corroborated** by a script-notes reference reached by a different route, which gives
the same four codepoints for Tamil.

In `ta` body copy the marks are **“ ” U+201C / U+201D**, and the nested inner pair is
**‘ ’ U+2018 / U+2019** — worked example, byte-verified: “மாதிரி ‘தரவு’ என்பதைப்
பயன்படுத்துகிறது.”

- ✅ **“மாதிரி”** — typographic marks, `U+201C` and `U+201D`
- ❌ **"மாதிரி"** — ASCII `U+0022`, which must appear **zero** times in Tamil prose

⚠ The same applies to `U+0027`: no ASCII apostrophe in Tamil body copy.

### 3i. Punctuation, line breaking, and the hyphen question

**The Unicode Standard §12.6.3:** *"Danda and double danda marks as well as some other unified
punctuation used with Tamil are found in the Devanagari block."* — i.e. `U+0964` and `U+0965` are
*available*, and they are **not** the Tamil default.

**The script-notes reference is explicit:** *"Western punctuation is used generally"*; danda and
double danda *"appear occasionally."* The working set is the ASCII one: comma `U+002C`, semicolon
`U+003B`, colon `U+003A`, period `U+002E`, question mark `U+003F`, exclamation mark `U+0021`.

> **→ Tamil sentence-final punctuation is the ordinary period `U+002E`, not a danda.** A
> translator who ends Tamil sentences with `U+0964` has ported a Devanagari habit.

**Hyphenation — ⚠ unresolved, and deliberately left that way.** Two sources are in mild tension:

| Source | What it says |
|---|---|
| Script-notes reference (community) | Tamil *"words can be long"*; it is *"an agglutinative language"*; breaks fall *"at syllable boundaries. A hyphen is **not** usually added at the end of the line when a word is hyphenated."* |
| W3C ILREQ (Official-tier W3C Note) | *"The definition of Indic orthographic syllable may be used to break the line and a hyphen should be at the breaking point"*, noting that *"U+00AD (soft hyphen) is used in some languages such as Tamil and Malayalam."* |

⚠ ILREQ is Devanagari-centric and its Tamil-specific content is thin. **The two disagree on whether
the hyphen is drawn, and this guide does not prescribe.** ILREQ does supply one uncontested rule:
**do not start a new line with `U+002C`, `U+002E`, `U+003A` or `U+003B`.**

🏠 **House rule until this is resolved:** no automatic hyphenation for `lang="ta"`, `overflow-wrap`
as the safety net (§3b). Automatic hyphenation risks being *actively wrong* under the no-visible-
hyphen convention, and no evidence was found that browsers hyphenate Tamil correctly.

### 3j. 🔴 Standard Unicode only — the private-use-area re-encoding, and legacy 8-bit fonts

A syllabary-based re-encoding of Tamil in Unicode's **Private Use Area** circulates in the Tamil
Nadu ecosystem: instead of Unicode's abugida model (consonant plus vowel sign, composed at render
time), it assigns **one codepoint per syllable**, placed in the PUA. Its promoters include a Tamil
Nadu government institution, which hosts keyboard drivers and fonts for it; the community source
reports that *"The Government of Tamil Nadu has approved related keyboard layouts through official
orders."* ⚠ **The government order itself could not be fetched** — treat state approval as
*reported*, not verified. What *was* independently confirmed is that the institution's download
portal offers non-standard tooling, including a **Tamil Unicode converter** (தமிழி ஒருங்குறிமாற்றி),
a keyboard (கீழடி விசைப்பலகை) and its own font family — **the existence of a converter is itself
evidence of a live parallel encoding ecosystem.**

**The Unicode Consortium's position, from the dedicated Tamil FAQ.** ⚠ **Scoping caveat that must
travel with these quotes: the FAQ does not name any particular scheme.** It addresses the *general
class* — syllabary re-encoding in the PUA. Quote it as such:

> **"Private-use characters may overlap between different implementations, so general purpose
> programs cannot assume any particular interpretation of such characters."**

> **"In general interchange, such as in search engines, private-use characters are typically treated
> as unknown characters or ignored."**

> **"private-use characters are inappropriate for open interchange."**

> **"A syllable-based re-encoding of Tamil, if aimed at NLP issues, is, therefore, essentially out of
> scope for the Unicode Standard."**

Note that Unicode *did* accommodate the underlying processing motivation without moving the
encoding: §12.6.5 defines **Tamil named character sequences** and observes that *"In implementations
such as natural language processing, where it may be useful to treat such Tamil text elements as
single code points for ease of processing, Tamil named character sequences could be mapped to code
points in a contiguous segment of the Private Use Area."* — **PUA mapping is sanctioned as an
internal processing trick and explicitly not as an interchange format.**

> **→ Verdict, stated flatly.** The platform uses **standard Unicode Tamil (`U+0B80`–`U+0BFF`),
> UTF-8, NFC.** PUA-encoded content is invisible to search engines, breaks screen readers, breaks
> copy-paste and will not survive any normalization step. **If Tamil source material arrives from a
> government or academic source and renders as garbage, or is legible only with one specific font,
> suspect a PUA syllabary encoding or a legacy 8-bit encoding and convert it before ingest.** Quick
> detector: legitimate Tamil is dense in `U+0B80`–`U+0BFF`; PUA text sits in `U+E000`–`U+F8FF`.

### 3k. Fonts — never fall back to a system default

Enumerated by machine-parsing the metadata index of the open web-font library: of **1,942 families,
17 declare a `tamil` subset**. Sixteen of them, with designers where the metadata gives them:

*Anek Tamil* (Ek Type) · *Arima* · *Baloo Thambi 2* (Ek Type) · *Catamaran* (Pria Ravichandran) ·
*Coiny* · *Hind Madurai* (Indian Type Foundry) · *Karla Tamil Inclined* and *Karla Tamil Upright*
(Jonathan Pinhorn) · *Kavivanar* · *Meera Inimai* (SMC) · *Mukta Malar* (Ek Type) ·
**Noto Sans Tamil** · **Noto Serif Tamil** · *Oi* · *Pavanam* · **Tiro Tamil** (Tiro Typeworks —
Fernando Mello, Fiona Ross, Kaja Słojewska).

⚠ The seventeenth is a vendor house typeface and is omitted here under the kit's vendor-neutrality
rule; nothing in the recommendation depends on it.

🏠 **House recommendation (craft):** *Noto Sans Tamil* for UI — widest coverage and maintained by the
same body that maintains the encoding; *Catamaran* or *Hind Madurai* for a more contemporary UI
voice; *Tiro Tamil* for long-form reading. **Never fall back to a system default without a
Tamil-capable font in the stack** — Tamil reordering and ligation is font-driven, and a missing font
yields tofu or, worse, unshaped sequences that a reviewer may mistake for bad translation.

⚠ **Do not ship the legacy non-Unicode fonts** distributed alongside the PUA tooling in §3j.

### 3l. Romanization never appears in the UI

🏠 **House rule.** Tamil interface text, content, and glossary entries are written in Tamil script.
Romanized Tamil (*Senthamizh*, *puḷḷi*, *nīṅkaḷ*) belongs in **this guide and in translator-facing
notes only** — never in shipped copy, never as a fallback when a font is missing, never as a
"searchable" duplicate of a heading.

⚠ **No Tamil-specific source on romanization-in-native-text was established** by the research. This
is the kit's own rule, applied to Tamil, and it is marked as such rather than dressed up as a
sourced convention.

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/reports/tr29/> · <https://www.unicode.org/faq/tamil.html> ·
<https://www.w3.org/TR/ilreq/> · <https://r12a.github.io/scripts/taml/ta.html> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://en.wikipedia.org/wiki/Tamil_script> · <https://en.wikipedia.org/wiki/Tamil_All_Character_Encoding> ·
<https://fonts.google.com/metadata/fonts>

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes:** `lang="ta"` (base), `lang="ta-easy"` (simplified variant, per the
  header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 / 3.1.2, and it drives spellcheck and screen-reader voice selection.
- **🔑 Normalize to NFC on ingest, and assert it in CI — and know that here it *helps*.** Tamil
  two-part vowels are not composition exclusions, so NFC **repairs** decomposed input rather than
  freezing it (§3d). ⚠ **But NFC is a floor:** it does not touch the U+0B82 substitution, the
  ௌ/ெள confusion, a Telugu character in Tamil text, the śrī spelling split, sandhi variation, or
  grantha variation. Each needs its own check (§11).
- **🔴 Encoding: standard Unicode Tamil `U+0B80`–`U+0BFF`, UTF-8, NFC only.** Reject any ingest whose
  content is dense in the Private Use Area `U+E000`–`U+F8FF`, or which is legible only under one
  specific font — that is a PUA syllabary or a legacy 8-bit encoding (§3j).
- **🔴 Truncate on grapheme clusters, never on code units.** Six of eleven vowel signs render before
  or around their consonant while stored after it (§3c). Use a locale-aware grapheme segmenter for
  ellipsis, "first letter" effects, per-character animation, and character counts. ⚠ It is not
  guaranteed to match a Tamil teacher's notion of a letter — do not build a letter-counting exercise
  on it unreviewed.
- **🔴 Never concatenate UI strings.** Tamil case and number marking on the noun and the verb form
  both depend on the slot (§4b). Whole-sentence message templates with named placeholders, always.
- **Tokenization:** whitespace tokenization works. But **substring matching does not** — an inflected
  form may share no visible affix with its citation form (§4b). Any search, filter, or
  highlight-the-term feature must be told this, or it will silently miss matches.
- **Numbers: pass the full locale tag**, `ta-IN`, `ta-LK`, `ta-SG` or `ta-MY`, to every
  locale-aware formatter, and never hand-format. A fixture must show `12345678` rendering as
  **1,23,45,678** under `ta-IN` and **12,345,678** under `ta-SG` (§5a).
- **Digits: Western `0`–`9` everywhere.** Never emit Tamil digits (§5b).
- **Percent is closed up:** the CLDR `ta` pattern is `#,##,##0%` — **no space before the sign**
  (§5a).
- **Currency: `₹` `U+20B9` first, no space** under `ta`; **symbol, space, Western grouping** under
  `ta_SG` and `ta_MY`; **`Rs.`** for LKR under `ta_LK` (§5d). **Never `௹` `U+0BF9`.**
- **Dates: day before month.** `d/M/yy` short, `d MMMM, y` long — **keep the comma before the year**
  (§5e). Use the CLDR month names, and expect Sri Lankan reviewers to prefer grantha-free variants
  (§5g).
- **🔴 Clock: `ta_LK` is 24-hour.** Do not hardcode a 12-hour format for Tamil (§5f).
- **Fonts are a hard requirement, not a preference.** Ship a Tamil-capable font — *Noto Sans Tamil*
  by default — and never let the stack fall through to a system default: shaping and vowel
  reordering are font-driven (§3k). ⚠ Letterform conventions for **ர** differ by country and are a
  font decision, not a content one (§9c).
- **Line breaking:** space-based. **Set no automatic hyphenation for `lang="ta"`** — the two sources
  disagree on whether a hyphen is even drawn (§3i). Use `overflow-wrap: break-word` as the safety net
  for long agglutinated words, and do not start a line with `U+002C`, `U+002E`, `U+003A` or
  `U+003B`.
- **Do not port Indic joiner logic.** Tamil uses very few conjuncts and needs far less ZWJ/ZWNJ
  machinery than Devanagari (§3e). A ZWNJ in Tamil content is a finding, not a default.
- **Search must treat `ஸ்ரீ` and `ஶ்ரீ` as equivalent** — the standard recommends it and no
  normalizer does it for you (§3f).
- **Quotation marks:** normalize straight ASCII quotes in body copy to **“ ” U+201C / U+201D**, inner
  **‘ ’ U+2018 / U+2019**; confirm the shipped font carries all four (§3h).
- **Index alphabet for glossary navigation** — the 12 independent vowels followed by the 18 native
  consonants: **அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ · க ங ச ஞ ட ண த ந ன ப ம ய ர ற ல ள ழ வ**. ⚠ **Decide
  deliberately** whether the five grantha letters **ஜ ஶ ஷ ஸ ஹ** get their own buckets: they are
  described as *supplementary* to the alphabet (§3f), they are needed for CLDR month names and
  loanwords, and the decision is editorial. **No sourced Tamil collation order was established** —
  this list is the character-database order, not an attested dictionary order, and it is marked as
  such.
- **Locale negotiation:** `ta-easy` must resolve to Tamil content and never fall back to another
  language's easy variant; and no fallback may hand a `ta-LK` reader a 12-hour clock or a `ta-SG`
  reader Indian grouping.
- **Never ASCII-fold or romanize Tamil in the UI** (§3l). A name field is data.

Sources: <https://www.unicode.org/versions/latest/core-spec/chapter-12/> · <https://www.unicode.org/reports/tr29/> ·
<https://www.unicode.org/faq/tamil.html> · <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_LK.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_SG.xml> ·
<https://www.w3.org/TR/ilreq/> · <https://fonts.google.com/metadata/fonts>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md). Ordered by yield.

- **🔴 Forbidden-character scan — the highest-yield check in this language.**
  - **`U+0B82`** TAMIL SIGN ANUSVARA. In modern Tamil prose it should occur **essentially never**,
    and the standard itself warns that it is mistaken for the puḷḷi (§3e). Every occurrence is a
    finding.
  - **`U+0C42`** and any other Telugu, Devanagari, Bengali, or Malayalam codepoint inside a `ta`
    string. The research fetch layer substituted a Telugu vowel sign for a Tamil one; **script
    mixing at codepoint level is the signature** (§2e).
  - **`U+0BE6`–`U+0BEF`** Tamil digits. Banned by §5b — and, given the font confusables in §3g, any
    occurrence is a probable typo for a Tamil **letter**, not a deliberate numeral.
  - **`U+0BF9`** TAMIL RUPEE SIGN — never the currency symbol (§5d).
  - **`U+0964` / `U+0965`** danda and double danda — a ported Devanagari habit (§3i).
  - **Anything in `U+E000`–`U+F8FF`** — a private-use syllabary encoding (§3j).
  - **`U+FFFD`** — a decode already failed upstream.
- **🔴 The ௌ sequence check (§3g).** Flag `U+0BC6` immediately followed by `U+0BB3`: it is visually
  identical to `U+0BCC` and it is almost certainly a mistyped one. **Nothing else catches this** —
  the wrong form is valid Unicode, NFC-stable, and renders correctly.
- **🔴 NFC assertion (§3d).** Every `ta` string must satisfy `s === s.normalize('NFC')`, on
  **translation JSON keys as well as values**. Unlike Marathi or Punjabi, the fix here is safe:
  normalizing *repairs* Tamil. Report the offending codepoints, not just the file.
- **🔴 Script-ratio expectation.** Running `ta` content should be **dense in `U+0B80`–`U+0BFF`**. Two
  useful inverses: a `ta` string that is **pure ASCII** and longer than a few words is an
  untranslated English leak; a `ta` string with **no** Tamil codepoints at all in a content field is
  a fallback that did not fire.
- **🔴 Number-grouping leak, per locale (§5a).** For `ta` and `ta_LK` flag Western `\d,\d{3},\d{3}`
  grouping; for `ta_SG` and `ta_MY` flag Indian `\d,\d{2},\d{3}` grouping. **The same string is
  correct in one pair of locales and wrong in the other**, so this check must be locale-scoped or it
  will produce noise in both directions.
- **🔴 Scale-word consistency (§5c).** Flag any document containing **both** a
  மில்லியன்/பில்லியன் scale word and an இலட்சம்/கோடி scale word. Flag **இலட்சம்** or **கோடி** in
  content flagged as globally-read. ⚠ Flag, do not auto-replace: both systems are correct Tamil in
  their own context.
- **🔴 Clock and date leaks (§5e, §5f).** Flag `M/d/y`-shaped numeric dates anywhere in `ta`. Flag
  12-hour time strings in `ta-LK` content and 24-hour ones where `ta-IN` formatting is expected.
  Flag a missing comma before the year in a spelled-out date.
- **Quotation codepoints (§3h).** In `ta` body copy the marks must be **“ ” U+201C / U+201D** with
  inner **‘ ’ U+2018 / U+2019**. Flag **U+0022** and **U+0027** in Tamil prose. This check must run
  on the **bytes**, never on a rendered or summarized view — a summarizing layer flattens exactly
  these characters and the flattening is invisible in prose (§2e).
- **Terminology consistency (§6c, §4e).** Flag any document containing more than one of
  **செயற்கை நுண்ணறிவு** / **செயற்கை அறிதிறன்** / **செயற்கை அறிவுத்திறன்**; more than one of
  **இயந்திரக் கற்றல்** / **இயந்திர கற்றல்** / **எந்திரக் கற்றல்**; or both **கணினி** and
  **கணிப்பொறி** where the term-sheet has picked one. ⚠ The check enforces **the house pick**, which
  §4e states is a coin-flip resolved for consistency — so the message must say **"inconsistent"**,
  never "wrong".
- **Sandhi consistency (§4e).** A narrower version of the above, worth its own rule because it is
  purely orthographic: flag both the sandhi-doubled and the undoubled spelling of the same compound
  term in one corpus.
- **Grantha-variant scan (§5g).** Flag documents mixing **ஜூன்**/**சூன்** or
  **ஆகஸ்ட்**/**ஆகத்து**. ⚠ **Neither is an error** — the message is a consistency message, and the
  house pick is the CLDR form because a date formatter will emit it on the same page.
- **śrī equivalence (§3f).** Search and glossary lookup must fold `U+0BB8 U+0BCD U+0BB0 U+0BC0` and
  `U+0BB6 U+0BCD U+0BB0 U+0BC0` together. Test it; no normalizer does this.
- **Register check (§4a).** Flag **நீ**, **உன்**, **உனது**, **நீர்** and **தாங்கள்** anywhere in `ta`
  or `ta-easy` content — the census records **0** occurrences of every one of them in institutional
  Tamil. 🏠 Optionally track **நீங்கள்** density: in `ta` it should be low (exposition avoids the
  second person), and in `ta-easy` the threshold runs the **other way** (§8d), so the two variants
  need different rules or none.
- **Gloss-pattern check (§6b).** Flag an English term appearing *before* its Tamil equivalent in a
  parenthetical pair, and flag the same term glossed more than once per page. Flag the
  **X அல்லது Y** double-coinage construction in platform copy — it is right for an encyclopedia and
  wrong here.
- **Acronym check (§6e).** Flag a transliterated form of `AI`, `API`, `URL`, `CPU` or `GPU` in Tamil
  content; these stay in Latin capitals. And flag any **single token mixing Tamil letters and Latin
  letters with no separator** — attested once in the corpus as an individual coinage, and it breaks
  shaping (§6d).
- **Latin-script ratio, as a soft signal.** Some Latin in Tamil prose is normal and attested (87
  tokens across 6 news articles, §6e). A *high* ratio is a leak. This is a review trigger, not a
  gate.
- **Source-language leak scan (EN → TA):** left-in English function words, English-formatted numbers
  and dates, US date order, Title Case headings, and untranslated UI strings.
- **⚠ What must NOT be automated.** No lint rule may (a) decide between the two attested
  complex→everyday pairs in §8b, (b) enforce any caste-marked-vocabulary list — none is established
  (§9d), or (c) check Tamil idiom renderings — §7 ships with the Tamil column empty by design. A
  rule in any of these three areas would launder a guess into an automated verdict.

Sources: <https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://www.unicode.org/reports/tr29/> · [translation-quality](../translation-quality.md)

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** The
dossier was compiled **without a web-search tool** — every source was reached by constructing a URL
directly — which biases coverage toward institutions with predictable URLs (Unicode, the character
database, CLDR, the Wikimedia APIs) and against Tamil Nadu government material, which failed at the
DNS, connection, and TLS layers. **§2 (authorities), §6 (terminology), §7 (idioms), §8 (plain
language) and §9d (caste-marked vocabulary) are thin for exactly that reason, and each says so in
place rather than filling the gap.** A further hazard governs every character here: the fetch layer
**substituted a Telugu vowel sign for a Tamil one, rendered the puḷḷi as the anusvara, and
ASCII-flattened quotation marks** — which is why this guide states codepoints beside glyphs
throughout, and why **the codepoint is the authority wherever the two could disagree**.

**Carried through as open gaps** — none is closed by this guide, and each is marked ⚠ where it
appears: **the two official terminology glossaries**, both located and neither retrieved, which is
why every term in §6 is observed usage rather than prescription (§2b); the **Tamil Nadu Official
Language Act text** and the **Directorate of Tamil Development**, whose very existence is unverified
(§2a); Sri Lanka's Department of Official Languages remit (§2a); the **case suffixes in Tamil
script**, which exist here only in the source's romanization because back-converting them would mean
inventing orthography (§4d); the **sandhi pick** in §4e, resolved for consistency rather than
sourced; the **abbreviated month names** for the CLDR medium date pattern (§5e); the **INR symbol**,
inherited rather than read directly (§5d); the **CLDR standard-versus-accounting grouping
contradiction**, reported and unexplained (§5c); the arguments of the **grantha purist objection**,
whose citation exists but whose document was not fetched (§3f); whether **state approval** of the
private-use-area encoding is real (§3j); the **hyphenation question**, where two sources contradict
each other (§3i); a **sourced Tamil collation order** for the glossary index (§10); the **Tamil
column of §7**, deliberately empty; the **complex→everyday table**, shipped at two attested rows
rather than a padded ten (§8b); **caste-marked vocabulary**, where the axis is sourced as live and
the word list is not established and was not guessed (§9d); and **census-tier speaker figures**
beyond India's 2011 count (header).

**Deliberately withheld:** the industry glossary of model, product, and company names. The research
withheld it; this guide keeps it withheld and reproduces only the *language* rules on foreign names
(§6d, §6f).

**Strong sections:** §3 script and typography (the character database parsed by codepoint range, the
core specification extracted locally, UAX #29), §5 numbers and dates (raw CLDR locale XML for four
Tamil locales plus root), §4a register (measured over 31,450 characters of instructional Tamil).
**Honest ⚠ sections:** §2 (no Tamil Nadu government source was reachable), §6 (observation, never
prescription), §7 (Tamil column empty by design), §8 (no plain-language standard located; two
attested pairs, not ten), §9d (the axis, not the words). **Not reviewed by a native speaker.**
