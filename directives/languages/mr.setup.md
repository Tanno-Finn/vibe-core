<!-- base -->
# lang-mr — Marathi (मराठी) — setup & sources

> **The translation guide itself is [`mr.md`](mr.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Marathi has a real
state language apparatus, which makes §2, §3, and §5 well-anchored; what it conspicuously lacks is
anything covering software (§6, §8).

- **भाषा संचालनालय — Directorate of Languages, Government of Maharashtra** (est. 1960, under the
  मराठी भाषा विभाग). The state terminology and orthography authority. Its mandate includes
  “प्रशासनिक परिभाषा कोश व मार्गदर्शक पुस्तिका तयार करणे” (preparing administrative glossaries and
  guidance manuals). <https://directorate.marathi.gov.in/about/>
  It publishes the **शुद्धलेखन नियमावली**, the official orthography rules — the nearest thing to an
  official Marathi spelling authority, governing anusvara and ळ usage in formal writing.
  ⚠ **Its rule text could not be fetched**, so this guide cites the standard's existence, never its
  wording.
- **परिभाषा कोश — the official terminology dictionaries.**
  <https://shabdakosh.marathi.gov.in/> — self-described as
  “शासन व्यवहारासाठी शब्दकोश आणि शास्त्रीय व तांत्रिक परिभाषा कोश”, with the stated objective
  “आधुनिक तंत्रज्ञानाद्वारे विविध विषयावरील शास्त्रीय व तांत्रिक परिभाषा कोश तयार करणे”.
  **Free, online, browsable** per subject and per letter (`/ananya-glossary/<id>/<letter>`);
  ~38–43 volumes, 400,000+ entries in aggregate. Verified volumes include physics (13,646 entries),
  chemistry (11,044), biology (22,288), **mathematics (3,919)**, and mechanical (7,515), electrical
  (8,454) and civil (12,429) engineering. **➜ It contains no computing volume — see §6, where that
  negative is load-bearing.**
- **मराठी विश्वकोश — the Marathi Encyclopaedia**, a state-board publication in two editions:
  first edition (20 vols) <https://vishwakosh.marathi.gov.in/> (“मराठी विश्वकोश प्रथमावृत्ती”);
  second edition, ongoing, article-level, published by
  महाराष्ट्र राज्य मराठी विश्वकोश निर्मिती मंडळ — <https://marathivishwakosh.org/>. **Unlike the
  परिभाषा कोश it actually covers modern computing** (विदा खनन / Data Mining; संगणक शिक्षण). It is
  also descriptively looser and freely code-switches into loanwords — which is itself editorially
  useful (§6).
- **Major dictionaries**, hosted and searchable together at <https://bruhadkosh.org/about-kosh>
  (“मराठी बृहद्कोश”): Molesworth, Candy & Candy, *A dictionary, Marathi and English*, 2nd ed.
  (“Printed for government at the Bombay Education Society's press, Bombay (1857)”, ~60,000 words);
  **महाराष्ट्र शब्दकोश** by य. रा. दाते & चिं. ग. कर्वे (“१९३२ ते १९३८ या काळात एकूण सात खंडांत”,
  supplement 1950); and **महाराष्ट्र वाक्संप्रदाय कोश**, an idiom dictionary (the obvious future
  source for §7, which is currently unsourced). These are **register and morphology references, not
  technical-vocabulary references**.
  ⚠ **Do not conflate** the Date–Karve *शास्त्रीय परिभाषा कोश* — a scholarly, pre-independence
  scientific glossary — with the government भाषा संचालनालय परिभाषा कोश series. Different works.
- **Unicode.** The primary authority for everything in §3:
  the Standard 16.0.0, ch. 12 (South and Central Asia-I) —
  <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> (rule R5, the eyelash reph);
  the Devanagari NamesList — <https://www.unicode.org/charts/nameslist/n_0900.html>;
  the Devanagari code chart — <https://www.unicode.org/charts/PDF/U0900.pdf>; and
  `CompositionExclusions.txt` — <https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt>.
  **All four were re-fetched and re-confirmed while writing this guide.**
- **Unicode CLDR, `mr` locale** — number, date, time, and currency data.
  <https://www.unicode.org/cldr/charts/latest/summary/mr.html> (“Locale Data Summary for Marathi [mr]”),
  with the machine-readable source files
  <https://unpkg.com/cldr-numbers-full@48.2.0/main/mr/numbers.json>
  and
  <https://unpkg.com/cldr-dates-full@48.2.0/main/mr/ca-gregorian.json>
  (**both re-fetched and re-confirmed**). `mr` is a **well-supported locale** — plural rules and
  date/number formatting can be left to platform ICU, with the one override in §5.
- **Community localization style guide (`mr`)** — maintained by the Marathi localization community of
  a major open-source browser project: <https://mozilla-l10n.github.io/styleguides/mr/>.
  **Label: community / open-source, not governmental.** It is the *only written-down* Marathi UI-copy
  guidance that could be verified, and it is genuinely useful — but note it **disagrees with this
  guide's register decision** (§4), and that disagreement is recorded rather than hidden.
- **❌ There is NO official Marathi digital or UI-writing style guide.** The भाषा संचालनालय publishes
  orthography rules and administrative-prose manuals; nothing covers software UI, microcopy, or a
  terminology-vs-transliteration policy for products. That gap is why §6 has to construct a policy
  rather than cite one.

**Source-tier caveat (read before trusting a section).** **Strong:** §3 (script/typography — Unicode
primary sources, re-confirmed), §5 (numbers/dates/currency — CLDR JSON, re-confirmed), §2 (live
government portals with verbatim Marathi mandates), §9 (regional variation — verbatim quotes for the
standard-language origin, five dialects, the Konkani boundary, and the Goa/Belgaum situation).
**Weak, and marked at point of use:** §4 (grammar — **⚠ community-tier**, Wikipedia grammar articles;
no academic reference grammar was fetchable), §6 (policy is well-evidenced, but 6 of 19 term rows are
craft and **no mainstream Marathi newspaper could be fetched**, so press usage rests on a single
policy outlet, not a corpus), §7 (**entirely craft-tier — every row is authored, none attested**),
§8 (an honest ❌ plus adjacent practice).

**Blocked / unfetchable (documented, not retried).** ScriptSource (403) · the Google Fonts specimen
page for Noto Sans Devanagari (JS app, no body text) · `r12a.github.io/scripts/deva/mr` (404 — no
`mr` page exists; the `deva/hi` page covers Marathi and is used instead) ·
`coe.maharashtra.gov.in` (Centre of Excellence for Marathi Language Computing — **DNS ENOTFOUND**;
see the residual caveat in §6) · the Vishwakosh history page (403) ·
`shabdakosh.marathi.gov.in/search-dictionary` (404 — no public search endpoint; browse by glossary
and letter) · StoryWeaver `/reading-levels` (403) · `mahasamvad.in` Marathi Language Policy (403) ·
`thinkmaharashtra.com` (DNS timeout) · academia.edu Indori-Marathi study (403) · an IJRAR contact
study PDF (unreadable binary) · GIGW 3.0 (download-only PDF, unrendered).

Sources: <https://directorate.marathi.gov.in/about/> · <https://shabdakosh.marathi.gov.in/> ·
<https://vishwakosh.marathi.gov.in/> · <https://marathivishwakosh.org/> ·
<https://bruhadkosh.org/about-kosh> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/charts/nameslist/n_0900.html> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/cldr/charts/latest/summary/mr.html> ·
<https://mozilla-l10n.github.io/styleguides/mr/> *(community/open-source)*

---

## 3. Script & typography

**(Strong section — Unicode Standard 16.0.0, NamesList, and `CompositionExclusions.txt`, all
re-fetched and re-confirmed during authoring. This is the most technically load-bearing section of
the guide; the eyelash-reph subsection below is the part most implementations get wrong.)**

### 3.1 Block, direction, structure

Marathi is written in the Devanagari block, **U+0900–U+097F**, and the script “is a left-to-right
abugida” (en.wikipedia.org/wiki/Devanagari). Because it is an abugida, consonant letters carry an
inherent vowel; vowel signs (मात्रा) attach around the base letter (above, below, before, after), and
consonant clusters ligate through the virama. **U+094D** is “Devanagari Sign Virama”, glossed
“= halant (the preferred Hindi name)” and “suppresses inherent vowel” (Unicode NamesList, Devanagari).

**Practical consequences for the platform:**

- A Marathi grapheme cluster is frequently **several code points long**. **Never truncate by code
  point or by UTF-16 unit** (`substring`, `slice`, `[:n]`) — truncate by **grapheme cluster**, or you
  will sever a matra or a virama sequence from its base and render an orphaned mark.
- **Never uppercase.** Devanagari is unicameral; there is no case.
- Byte-length and character-length are both useless as proxies for visual length.

### 3.2 Balbodh — the two Marathi-specific things

The Marathi variety of the script is **बाळबोध (Balbodh)**: “Balabodh is a slightly modified style of
the Devanagari script used to write the Marathi language and the Korku language.” The defining
difference is stated explicitly:

> “What sets balabodha apart from the Devanagari script used for other languages is the more frequent
> and regular use of both **ळ** /ɭ/ (retroflex lateral flap) and **र्‍** (called the eyelash reph / raphar).”
> — en.wikipedia.org/wiki/Balbodh

An independent orthography reference states the same contrast in tooling terms: Marathi extends the
basic Hindi consonant set with two additional letters, “ऱ,ळ” (r12a Devanagari orthography notes,
W3C i18n author — expert-community tier).

**(a) ळ — U+0933 DEVANAGARI LETTER LLA.** The retroflex lateral, **phonemic in Marathi and absent
from standard Hindi**. Marathi phonology “contrasts…alveolar with retroflex laterals ([l] and [ɭ]
(Marathi letters ल and ळ respectively))”; historically “In Marathi, the Indo-Aryan /l/ split into a
retroflex lateral flap *ḷ* when singular and alveolar *l* when doubled”
(en.wikipedia.org/wiki/Marathi_language; /Marathi_phonology). It appears in extremely common
vocabulary. **Substituting ल for ळ is a spelling error, not a variant.**

- ✅ **शाळा** ("school") · **वेळ** ("time") · **खेळ** ("game") · **जवळ** ("near")
- ❌ **शाला** — the Hindi-biased substitution of ल for ळ. *(This is the contamination symptom named in
  §4's divergence table, not a stylistic variant.)*

> **Pipeline test string:** `शाळा वेळ खेळ जवळ` — if any of these renders or round-trips with ल, your
> font, keyboard mapping, transliteration layer, or webfont subset is Hindi-biased.

**(b) The eyelash reph.** This is where most implementations break, and the encoding detail is worth
stating precisely — see the next subsection.

### 3.3 The eyelash reph — correct encoding, resolved from primary sources

**When is it used?** “In Marathi, when 'र' is the first consonant of a consonant cluster and occurs at
the beginning of a syllable, it is written as an eyelash reph / raphar.”
(en.wikipedia.org/wiki/Balbodh). Orthography notes put it from the coda side: “When writing Marathi,
a RA coda is sometimes written using the so-called 'eyelash' form.” (r12a).

**How is it correctly encoded?** The Unicode Standard's Devanagari rules are explicit. **Rule R5**
governs it:

> “if the dead consonant RAd precedes ZERO WIDTH JOINER, then the half-consonant form RAh, depicted
> as eyelash-RA, is used instead of RAsup”
> — The Unicode Standard 16.0.0, Chapter 12

and the Standard confirms the Marathi relevance directly: “Marathi also makes use of the 'eyelash'
form of the letter RA, as discussed in rule R5.” (same source). **Both quotes re-fetched and
re-confirmed 2026-07-26.**

**➜ The correct sequence is exactly three code points:**

| Order | Code point | Character | Name |
|---|---|---|---|
| 1 | **U+0930** | र | DEVANAGARI LETTER RA |
| 2 | **U+094D** | ् | DEVANAGARI SIGN VIRAMA |
| 3 | **U+200D** | *(invisible)* | ZERO WIDTH JOINER |

i.e. `र` + `्` + ZWJ → **र्‍** , as in **र्‍या**, **दर्‍या**, **सर्‍या**.

**Without the ZWJ, the identical first two code points produce the *ordinary* reph** (the hook above
the following letter): र् + य → **र्य**. **The ZWJ is the only thing distinguishing the two, and it is
invisible.**

- ✅ eyelash reph, correct: **दर्‍या** = `0926 0930 094D 200D 092F 093E` *(द र ् ZWJ य ा)*
- ❌ ordinary reph — a different word shape: **दर्या** = `0926 0930 094D 092F 093E` *(the ZWJ is
  missing; this is what a stripped string degrades into)*

**➜ U+0931 ऱ is NOT the eyelash reph.** This is the single most common encoding error, and it is
wrong on the authority of the NamesList itself. **U+0931 DEVANAGARI LETTER RRA** is annotated
“for transcribing Dravidian alveolar r”, notes that its “half form is represented as 'Eyelash RA'”,
and — decisively — carries the canonical equivalence **≡ `0930` र `093C` ◌़**
(Unicode NamesList, Devanagari — **re-fetched and re-confirmed**). That is: **U+0931 is canonically
equivalent to र + nukta.** It is a Dravidian-transcription character with a legacy ISCII shaping
behavior, not the Marathi eyelash reph.

- ✅ **दर्‍या** — `0930 094D 200D` (RA + virama + ZWJ), per rule R5
- ❌ **दऱ्या** — `0931` (RRA ≡ र + nukta), a different character standing in for the eyelash

The confusion is understandable, because U+0931 *does* produce an eyelash shape in many fonts:
“the letter ऱ creates an eyelash form at the start of a conjunct *without* the need for the ZWJ”
(r12a). The Standard also preserves the ISCII legacy mapping: “In conformance with the ISCII
standard, the half-consonant form RRAh is represented as eyelash-RA.” (Unicode 16.0.0, ch. 12).
**So both spellings can look right on screen while being semantically different characters. Use the
ZWJ sequence.**

*(Note: U+0931 legitimately occurs in some source-verbatim spellings — the dialect name **वऱ्हाडी**
in §9 is quoted as its source spells it. A "no U+0931 anywhere" grep is therefore too blunt; the
check that matters is U+0931 **standing in for an eyelash reph** — see §11.)*

### 3.4 Hazard 1 — ZWJ stripping silently collapses the word, and passes visual QA

U+200D is commonly classed as an invisible formatting character and is stripped by sanitizers,
"clean-up" regexes (`\p{Cf}` and friends), naive slug and filename generators, CMS import filters,
and some translation-memory round-trips. Stripping it converts **र्‍य → र्य** — the eyelash reph
collapses into an ordinary reph.

**The text still renders as valid-looking Devanagari.** It does not tofu, it does not throw, it does
not look broken. **It passes visual QA, and a human reviewer will not catch it** — only a Marathi
reader comparing against the intended spelling will. **This is the single highest-risk item in the
whole Marathi pipeline.** Any pipeline that strips "invisible" characters as a hygiene measure
destroys Marathi orthography.

*The mechanism is sourced (rule R5: the ZWJ is what selects the eyelash form). The claim that
sanitizers commonly strip ZWJ is a general engineering observation — `⚠ craft`.*

### 3.5 Hazard 2 — normalization cannot repair it

**Checked directly against the authoritative exclusion list.** Under the heading “(1) Script
Specifics”, the Devanagari entries in `CompositionExclusions.txt` are exactly **`0958`–`095F`**
(QA, KHHA, GHHA, ZA, DDDHA, RHA, FA, YYA) — and **U+0929, U+0931, and U+0934 do not appear anywhere in
the file** (Unicode `CompositionExclusions.txt` — **re-fetched and re-confirmed 2026-07-26**).

Consequences, and they are asymmetric:

1. **U+0931 is *not* a composition exclusion, so NFC composes** र + ़ (U+0930 U+093C) **into ऱ
   (U+0931)**. Those two spellings unify under NFC — so byte-comparison of "the same" string can
   differ *before* normalization and agree *after*.
2. **The correct `र + ् + ZWJ` sequence is untouched by NFC/NFD.** ZWJ has no decomposition and is not
   removed by canonical normalization. It is at risk *only* from deliberate stripping (Hazard 1).
3. **Therefore the ZWJ must be whitelisted separately.** Normalize to NFC at ingest **and** exempt
   U+200D from every sanitizer, slugger, and filter. **You cannot normalize your way to correct
   eyelash spellings** — normalization cannot repair them, and NFKC or aggressive `\p{Cf}` filtering
   destroys them.
4. Conversely, the Hindi nukta letters **are** exclusions (`0958`–`095F`), so NFC leaves
   ज + ़ decomposed rather than composing it to ज़ — which is why a nukta-sequence check for
   Hindi-isms (§11) has to look for **both** the precomposed letter and the base+U+093C sequence.

*(Also note **U+0934 ऴ**, annotated “for transcribing Dravidian l” with the canonical equivalence
**≡ `0933` ळ `093C` ◌़**. It is **not** Marathi — do not let a nukta creep onto ळ.)*

### 3.6 Anusvara — differs from Hindi

The anusvara sign is **U+0902**, and its Marathi behavior is not Hindi's: “In Marathi, the anusvāra
is pronounced as a nasal that is homorganic to the following consonant (with the same place of
articulation)” (en.wikipedia.org/wiki/Anusvara). The same source notes Marathi uses the same dot to
mark **both** anusvara **and** retention of the inherent vowel — a distinction not paralleled in
Hindi or Sanskrit usage.

**Editorial rule: anusvara placement follows Marathi orthographic convention and must never be copied
from a Hindi source text.** Marathi anusvara has itself been subject to state orthography reform.
⚠ **Detailed prescriptive anusvara rules are unverified** — they live in the शुद्धलेखन नियमावली (§2),
whose text could not be fetched. Have a native reviewer check anusvara in any bulk output.

### 3.7 Schwa deletion — also differs from Hindi

A real Marathi/Hindi divergence with direct spelling, romanization, and TTS consequences:

> “However, in places where the schwa occurs in the middle of words, Marathi does exhibit a propensity
> to pronounce it far more regularly than Hindi.”
> — en.wikipedia.org/wiki/Schwa_deletion_in_Indo-Aryan_languages

The same source notes that, unlike Hindi, “comprehension of Marathi is not impeded if all schwas are
retained”, and gives the contrast प्रेरणा / मानसी / केतकी as **Prerana, Manasi, Ketaki** (Marathi)
rather than the Hindi-style *Prerna, Mansi, Ketki*.

- ✅ Marathi romanization (medial schwa retained): **Prerana**, **Manasi**, **Ketaki**
- ❌ Hindi-tuned romanization: **Prerna**, **Mansi**, **Ketki**

**Consequence:** any romanization, slug generation, TTS, or search-normalization component tuned for
Hindi will mis-handle Marathi names and vocabulary.

### 3.8 Word separation, line breaking, hyphenation

“Words are separated by spaces.” and “Devanagari text can be hyphenated during line wrap, though it
is not very common.” (r12a). So **whitespace tokenization works** for word-level features
(highlighting, search) — with the caveat from §3.1 that a *word* is still made of multi-code-point
clusters.

- Rely on standard Unicode line breaking at spaces.
- **Do not enable automatic hyphenation.** `hyphens: none` is the safe default — an English or German
  hyphenation dictionary applied to Devanagari will break inside conjuncts and produce nonsense.
- **Never break inside a grapheme cluster**, and avoid `word-break: break-all`, which splits
  conjuncts.

### 3.9 Punctuation and quotation marks

- **U+0964 ।** — “Devanagari Danda”, glossed “= purna viram” and “phrase separator” (NamesList).
  “U+0964 । DEVANAGARI DANDA is similar to a full stop. U+0965 ॥ DEVANAGARI DOUBLE DANDA marks the end
  of a verse in traditional texts.” (Unicode 16.0.0, ch. 12). Marathi prose uses **।** as the
  sentence-final period.
- **Spacing:** “Most style guides recommend to use no space before this punctuation, but use space
  after.” (r12a).
  - ✅ **हे उदाहरण आहे। पुढे पाहा।** (no space before the danda, space after)
  - ❌ **हे उदाहरण आहे ।पुढे पाहा।** (space before, none after)
- Question mark `?`, exclamation `!`, comma `,`, colon and semicolon are the **Western** characters.
- **Danda vs Latin period:** modern Marathi web and UI copy increasingly uses the Latin `.`
  instead of ।, especially in short UI strings. **Pick one convention and hold it across the entire
  platform** — mixing them within a page is the visible defect. `⚠ craft` (observation; not sourced to
  a style guide).
- **Quotation marks:** Marathi conventionally uses **double quotation marks “ ” (U+201C / U+201D)** and
  **single ‘ ’ (U+2018 / U+2019)** — i.e. the high-open/high-close English pair, *not* the German-style
  low-open form.
  ⚠ **Unverified:** no fetchable Marathi editorial style authority prescribes this. Treat it as the
  working convention, apply it consistently, and confirm with a native editor.
  - ✅ **“येथे क्लिक करा”** (U+201C … U+201D) · nested **“मजकूर ‘आत’ मजकूर”**
  - ❌ straight ASCII: **"येथे क्लिक करा"** (U+0022) · **'आत'** (U+0027)

### 3.10 Fonts and rendering

Use a font with **full Devanagari shaping** (GSUB/GPOS with `rphf`, `half`, `pref`, `blwf`, `abvs`) —
Devanagari conjunct formation is **not achievable with a plain cmap**. Available open families include
“Noto Sans Devanagari UI”, “Noto Serif Devanagari” and “Noto Sans Devanagari”
(<https://notofonts.github.io/devanagari/>). ⚠ That page did not state language coverage or license in
fetchable form and the specimen page is a JS app, so “Noto Sans Devanagari covers Marathi” is
**unverified by direct quote**, though the family is the standard choice.

**Font QA checklist, Marathi-specific** (`⚠ craft` — derived from the sourced facts above):

1. Render **र्‍य** (`0930 094D 200D 092F`) — must show the **eyelash**, not a reph hook.
2. Render **ळ** and **ल** side by side — must be **visually distinct**.
3. Render a deep conjunct stack, e.g. **क्ष्ण**, **र्त्य**, **द्ध**.
4. Check that **ि** (pre-base i-matra) and **ीं** (matra + anusvara) position correctly over conjuncts.
5. Verify **at small sizes** — Devanagari headline fonts often lose the eyelash distinction at 12–14 px.
6. Confirm the **webfont subset actually includes U+0933 and U+200D**. Aggressive subsetting by
   frequency-of-use over a **Hindi** corpus will drop ळ and break every Marathi page.

### 3.11 Romanization never appears in the UI

Marathi is written in Devanagari. Romanized Marathi (*shala*, *kruttrim buddhimatta*) belongs in
transliteration tooling, pronunciation aids, and internal identifiers — **never in body copy, labels, or
headings**. Where a romanization *is* generated (slugs, TTS, search normalization), it must be the
Marathi one, not the Hindi one (§3.7).

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/charts/nameslist/n_0900.html> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://en.wikipedia.org/wiki/Balbodh> · <https://en.wikipedia.org/wiki/Devanagari> ·
<https://en.wikipedia.org/wiki/Anusvara> ·
<https://en.wikipedia.org/wiki/Schwa_deletion_in_Indo-Aryan_languages> ·
<https://en.wikipedia.org/wiki/Marathi_phonology> · <https://r12a.github.io/scripts/deva/hi.html>
*(expert-community)* · <https://notofonts.github.io/devanagari/>

---

## 10. Technical integration checklist

- **Fonts to ship:** a family with **full Devanagari shaping** (`rphf`, `half`, `pref`, `blwf`,
  `abvs`) — **Noto Sans Devanagari / Noto Sans Devanagari UI / Noto Serif Devanagari** is the safe
  default (<https://notofonts.github.io/devanagari/>). Run the six-point font QA in §3.10 before
  shipping.
- **⚠ Webfont subsetting — force-include U+0933 (ळ) and U+200D (ZWJ).** Subsetting by
  frequency-of-use over a **Hindi** corpus drops ळ and breaks every Marathi page, and dropping ZWJ
  breaks every eyelash reph.
- **⚠ ZWJ whitelist — the single highest-value Marathi engineering rule.** Exempt **U+200D** from
  every sanitizer, "clean-up" regex (`\p{Cf}`), slug/filename generator, CMS import filter, and
  translation-memory round-trip. Stripping it silently rewrites Marathi words and **passes visual QA**
  (§3.4).
- **Normalization:** **NFC at ingest** — but note it **cannot repair eyelash spellings** and that NFC
  *composes* र + ़ into ऱ (U+0931) because U+0931 is **not** a composition exclusion (§3.5). Never
  NFKC user-facing Marathi content.
- **Text truncation:** by **grapheme cluster only**. Never by code point or UTF-16 unit (§3.1). Never
  uppercase (unicameral script).
- **`lang` / `dir` attributes:** `lang="mr"` (base) and `lang="mr-easy"` (simplified variant, subject
  to the header's token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Line-breaking / hyphenation:** rely on Unicode line breaking at spaces; set **`hyphens: none`** —
  no Devanagari hyphenation dictionary is assumed, and a Latin one will break inside conjuncts. Avoid
  `word-break: break-all` (§3.8).
- **Numbers / dates / currency in display vs identifiers:** display per §5 — **pin `mr-u-nu-latn`**,
  Indian grouping `#,##,##0.###`, `₹` prefixed with no space, `d/M/yy` with a 12-hour clock. Keep
  Western digits and ISO 8601 (`YYYY-MM-DD`) for backends, identifiers, and code.
- **Index alphabet for glossary navigation:** Devanagari order — vowels first, then consonants, with
  **ळ** in its Marathi position:
  `अ आ इ ई उ ऊ ए ऐ ओ औ अं अः क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह ळ`.
  **Drive the actual ordering from CLDR `mr` collation, not a codepoint sort** (a codepoint sort
  scatters matras and misplaces ळ). ⚠ **Editorial** — the research carries no Marathi collation
  source; verify against CLDR before shipping a glossary index.
- **Tokenization:** whitespace word separation works (§3.8), so word-level highlighting and search are
  viable — but a "word" is a multi-code-point cluster sequence; never index or highlight by character
  offset computed on code points.
- **No romanization in the UI** (§3.11). Where romanization *is* generated internally, it must use
  **Marathi** schwa behavior, not Hindi (§3.7).

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://notofonts.github.io/devanagari/> · <https://r12a.github.io/scripts/deva/hi.html> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/mr/numbers.json>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md). The first three are the
Marathi-specific ones that matter most — all three are one grep.

- **⚠ Missing-ळ alarm (contamination).** A long Marathi document containing **zero U+0933 (ळ)** is a
  near-certain signal of Hindi-pipeline damage or a Hindi-biased font subset (§3.2, §4.7). Flag it.
- **⚠ Missing-ZWJ alarm (eyelash reph destroyed).** A document with eyelash-bearing vocabulary but
  **zero U+200D** means the ZWJ was stripped somewhere in the pipeline (§3.4). The text will still
  render as valid Devanagari — **this check is the only thing that catches it**, because visual QA
  cannot.
- **⚠ U+0931 in eyelash position.** Flag **U+0931 (ऱ)** used where an eyelash reph is meant — the
  correct encoding is `0930 094D 200D` (§3.3). Note that U+0931 legitimately occurs in some proper
  names and dialect names (e.g. वऱ्हाडी, §9.2), so the check is *position-sensitive*, not a blanket
  ban. Equally, flag `0930 093C` (र + nukta) in running text, which NFC will silently compose into
  U+0931.
- **Nukta hygiene.** Flag **U+0934 (ऴ)** and any `0933 093C` (ळ + nukta) — neither is Marathi (§3.5).
  Flag **Hindi nuktas ज़ फ़ ख़** in body copy — check for **both** the precomposed letters
  (U+095B, U+095E, U+0959) **and** the base+U+093C sequences, since those code points *are*
  composition exclusions and therefore stay decomposed under NFC (§3.5, §9.4). Also flag **करोड़**
  (nukta) where Marathi writes **कोटी / करोड** (§5.2).
- **Script ratio.** `mr` content must be overwhelmingly Devanagari (U+0900–U+097F). A high Latin ratio
  in body copy signals untranslated strings or romanization leaking into the UI (§3.11) — allow for
  legitimate loanword-in-Latin glosses on first use.
- **Digit-system consistency.** Pick one system and hold it: no page may mix **Devanagari digits
  (U+0966–U+096F)** and **Western digits** (§5.1). The default failure is an unpinned `Intl`
  formatter — flag Devanagari digits anywhere UI numerics were expected.
- **Grouping check.** Reject Western thousands grouping in Marathi numerals — `1,234,567` is wrong;
  Marathi groups **2,2,3** (`12,34,567`) (§5.2).
- **Date-order check.** Reject `M/d/yy`; `mr` is `d/M/yy` with a 12-hour clock and an am/pm marker,
  and the long forms carry a **comma before the year** (§5.4).
- **Currency check.** `₹` (U+20B9) **prefixed, no space** — flag `1,000 ₹` and `₹ 1,000` (§5.3).
- **Forbidden punctuation in body copy.** No straight ASCII quotes `"` (U+0022) / `'` (U+0027) —
  Marathi body copy uses **“ ”** (U+201C / U+201D) and **‘ ’** (U+2018 / U+2019) (§3.9, ⚠ that
  convention is itself unverified). Check danda **।** (U+0964) spacing: no space before, space after.
  Flag **mixed danda and Latin period** within the same surface (§3.9).
- **Register consistency (तुम्ही).** तुम्ही is the decided register (§4.2, 2026-07-26). Scan
  second-person copy for stray **तू**-forms and the possessives **तुझा / तुझी / तुझे**; each is a
  register defect. Separately, flag **आपण used as "you"** — on this platform आपण is reserved for the
  inclusive "we" (§4.4).
- **Inclusive/exclusive "we".** Flag **आम्ही** in teaching copy where the inclusive **आपण** is meant
  (§4.4) — "now we'll train a model" is आपण, not आम्ही.
- **Dialect markers.** Flag Varhadi/Ahirani/Malvani verb endings, pronouns, and particles in default
  content; प्रमाण मराठी is the baseline (§9.6).
- **Terminology drift.** Flag competing renderings of the same concept on one page — **विदा vs डेटा**,
  **यंत्र शिक्षण vs मशिन लर्निंग vs यांत्रिक प्रशिक्षण** (§6.5) — and inconsistent loanword spellings
  (कॉम्पुटर / कॉम्प्युटर / कॉम्प्यूटर), which are **not** orthographically standardized in Marathi.
- **Bureaucratic-register leak.** Flag सदर, उपरोक्त, प्रस्तुत, अनुषंगाने, सबब and the administrative
  imperative करण्यात यावे / नोंद घ्यावी in instructional copy (§8.3).
- **Source-language leak scan (EN → MR).** Left-in English function words (the, and, you, please);
  English word order surviving into a non-SOV sentence (§4.1); bare uninflected placeholders sitting
  in a case slot (§4.6); English number/date formatting surfacing in Marathi text.
- **Konkani / border-dispute language.** Flag any copy describing Konkani as a Marathi dialect, or
  asserting Belgaum/Belagavi's state affiliation (§9.3, §9.5).

Sources: <https://www.unicode.org/charts/nameslist/n_0900.html> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/mr/numbers.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/mr/ca-gregorian.json>

---

*Provenance note:* this guide is **authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources.** During authoring, four
anchors were **re-fetched and re-confirmed**: the Unicode Standard 16.0.0 ch. 12 (rule R5 and the
Marathi eyelash sentence), the Devanagari NamesList (U+0931 “for transcribing Dravidian alveolar r”,
canonical equivalence ≡ `0930` `093C`; U+0934 ≡ `0933` `093C`; U+094D; U+0964),
`CompositionExclusions.txt` (Devanagari entries are exactly `0958`–`095F`; **U+0929, U+0931, and U+0934
are absent**), and the CLDR `mr` locale files (`defaultNumberingSystem: "deva"`, decimal pattern
`#,##,##0.###`, percent `#,##0%`, currency `¤#,##0.00`, and the four date/time patterns plus the wide
month names). Its **strong** sections (§3 script/typography, §5 numbers/dates/currency, §2
authorities, §9 regional variation) rest on Unicode, CLDR, and live government portals; its **weak**
sections are marked at point of use — **§4 grammar (⚠ community-tier, Wikipedia; no academic reference
grammar was fetchable)**, **§7 idioms (⚠ entirely craft-tier — every row authored, none attested)**,
**§6 (6 of 19 term rows craft; no mainstream Marathi newspaper fetchable, so press usage rests on a
single policy outlet)**, and **§8 (an honest ❌ — no codified Marathi plain-language tradition
exists)**. Every ⚠ and craft marker the dossier set has been preserved. The research search budget was
exhausted before several inquiries ran, so **this guide is explicitly a first pass**; a native-speaker
review is still outstanding (see Status in the header), and the two things a native reviewer must
settle first are the **register decision (§4.2)** and the **unstable middle of the glossary (§6.5)**.
