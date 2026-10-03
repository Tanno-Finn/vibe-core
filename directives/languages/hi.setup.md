<!-- base -->
# lang-hi — Hindi (हिन्दी) — setup & sources

> **The translation guide itself is [`hi.md`](hi.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. **CITE-VERIFY
outcome is marked inline: ✅ = re-fetched and confirmed; ⚠ = could not be independently confirmed
from here (server refused / binary / normalized from a mis-cited anchor).**

- **Unicode — Devanagari block (U+0900–U+097F).** The official code chart for the main Devanagari
  block. ✅ The canonical chart URL resolves (served as the official block PDF); the block range
  is standard. Note the current standard is **The Unicode Standard, Version 17.0** (the round-2
  research quoted 16.0 — treat as the version at research time, not a ceiling).
  <https://www.unicode.org/charts/PDF/U0900.pdf>
- **Unicode Standard Annex #14 — Unicode Line Breaking Algorithm.** ✅ **Confirmed** (re-fetched):
  title "Unicode Line Breaking Algorithm", **current Revision 55, Unicode 17.0.0, 2025-09-05**.
  It defines line-break behavior for **all** scripts including Brahmic ones. **Correction to the
  research:** the round-2 brief cited "version 44 (2024)" and generic classes "AL / CM / EX", and
  its anchor pointed at an archived `tr14-17.html` snapshot — **stale + mis-cited**. Normalized to
  the canonical URL below; and the *mechanism* is now the dedicated Brahmic classes
  **AK (Aksara), AS (Aksara Start), AP (Aksara Pre-Base), VI (Virama), VF (Virama Final)** used
  "only for scripts that use the Brahmic style of context analysis" — i.e. Devanagari line
  breaking is handled by these, not by treating every mark as generic CM.
  <https://www.unicode.org/reports/tr14/>
- **W3C — Indic Layout Requirements (`ilreq`).** ✅ **Confirmed** (re-fetched): title "Indic
  Layout Requirements", W3C Working Draft **May 29, 2020** (research said May 28 — normalized). It
  **does** treat the danda: "*Devanagari phrase separator । , U+0964 DEVANAGARI DANDA (called
  purna viram in Hindi) … properties … same as … FullStop*", and it frames segmentation around
  **orthographic syllables / grapheme-cluster boundaries**. ⚠ **Downgrade:** the research
  attributed "Indic scripts use whitespace as a word separator" and "line breaks must not occur
  between a consonant and its dependent vowel" to ILREQ as explicit quotes — the document does
  **not** state either in those words (it speaks of syllable-based segmentation). So: cite ILREQ
  for **danda-as-full-stop** and **orthographic-syllable integrity**; treat "Hindi words are
  whitespace-separated" as a general orthographic fact, not an ILREQ quotation.
  <https://www.w3.org/TR/ilreq/>
- **Unicode CLDR — `hi` locale** (digits, decimal/grouping separators, date/time formats,
  quotation marks). ✅ **Re-checked against CLDR 48.2 (2026-03-17)**, superseding the round-1
  CLDR 47 citation: `hi` still defaults to **Latin digits** with **Devanagari as the native
  system**, uses the **Indian lakh/crore grouping pattern `#,##,##0.###`**, a **dot decimal /
  comma group**, and the **₹-before-the-amount** currency pattern — i.e. the round-1 values still
  hold, only the version citation was stale. The chart link is Unicode's version-agnostic *latest*
  permalink, so it tracks the current release instead of freezing a version number.
  <https://www.unicode.org/cldr/charts/latest/summary/hi.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **CSTT — Commission for Scientific and Technical Terminology, Ministry of Education (India).**
  The mandated body for coining/standardizing Hindi (and other Indian-language) scientific and
  technical terminology; its online term bank "**shabd**" aggregates standardized terms. ⚠
  **Citation not independently verified:** `cstt.education.gov.in` and `shabd.education.gov.in`
  **refused the connection** (`ECONNREFUSED`) from the research tool, so their page content could
  not be read here. CSTT is a well-established real authority; this guide names it as the
  terminology *authority of record*, but does **not** claim to have confirmed any individual
  string against it.
  <https://www.shabd.education.gov.in/> · <https://www.cstt.education.gov.in/hi>
- **Department of Official Language (Rajbhasha), Ministry of Home Affairs (India).** Owner of the
  Official Language policy and the **Official Language Rules, 1976**; the practical style authority
  for government Hindi (danda default, standard Western punctuation adapted to Hindi). ⚠ Same
  connection refusal as CSTT — real body, page content unconfirmed here.
  <https://rajbhasha.gov.in/>
- **Constitution of India — Article 343** (official language of the Union; "international form of
  Indian numerals" as the official numeral form). Secondary/legal reference, not re-fetched.
  <https://www.constitutionofindia.net/articles/article-343-official-language-of-the-union/>
- **Noto Sans / Noto Serif Devanagari** — open web fonts with broad Devanagari coverage and Indic
  OpenType shaping. ✅ The specimen page resolves (Google Fonts URLs are permitted).
  <https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari>

**Provenance caveat.** Several round-1 citations resolved to **community / blog / trade sources**
(a language-learning blog, a banking-sector blog) or to a **major search-vendor ML glossary**;
the vendor glossary name is **withheld here under the kit's source-neutrality rule** (no
AI-vendor/tool names) and is referred to generically below. All ⚠ markers indicate claims the
research could not source or that could not be confirmed from the authorities above.

Sources: <https://www.unicode.org/charts/PDF/U0900.pdf> · <https://www.unicode.org/reports/tr14/> ·
<https://www.w3.org/TR/ilreq/> · <https://www.unicode.org/cldr/charts/latest/summary/hi.html> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://www.constitutionofindia.net/articles/article-343-official-language-of-the-union/> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari>
(CSTT <https://www.cstt.education.gov.in/hi> and Rajbhasha <https://rajbhasha.gov.in/> are named as
the terminology/style authorities of record but **refused the connection** — listed as authorities,
not as fetched evidence.)

---

## 3. Script & typography

**Character inventory & Unicode range.** Hindi is written in **Devanagari**, an abugida encoded
in the main block **U+0900–U+097F**. Consonants carry an inherent *a*; dependent vowel signs
(**मात्रा**, e.g. ि ी ु ू े ै ो ौ) modify the inherent vowel; the **virama / halant (्, U+094D)**
suppresses it and drives conjunct formation. Other load-bearing marks: **anusvāra ं (U+0902)**,
**candrabindu ँ (U+0901)**, **visarga ः (U+0903)**, and the **nukta ़ (U+093C)** which forms
letters like क़ ख़ ग़ ज़ फ़ ड़ ढ़ (often used in Persian/Urdu-origin words). The sentence
terminator is the **danda । (U+0964)**; the **double danda ॥ (U+0965)** marks larger/verse
breaks. Native digits are **०–९ (U+0966–U+096F)**.

**Direction & tokenization.** Devanagari is **LTR** (`Deva` script). Words are
**whitespace-separated** in modern print and digital text, so ordinary whitespace tokenization
and word-based highlighting work. No RTL/bidi handling is required. (This whitespace fact is
general orthography, **not** attributed to ILREQ — see §2.)

**Conjuncts, virama, and combining-mark integrity (highest rendering risk).** Consonant clusters
combine via the **virama/halant** into conjunct glyphs (e.g. क् + ष → **क्ष**, त् + र → **त्र**,
ज् + ञ → **ज्ञ**). Correct output needs a font *and* a layout engine implementing Indic
ligature/shaping rules. **ZWJ (U+200D) / ZWNJ (U+200C)** can force or suppress specific conjunct
and half-forms; where content depends on a specific form, those zero-width characters are
load-bearing and a naive "sanitizer" that strips them will silently mis-render.

- ✅ Right (conjunct forms as intended): **कक्षा** ("class"), **विद्या** ("knowledge"),
  **हिन्दी** — matras and the virama sit on the correct base.
- ❌ Wrong (halant left visible / cluster broken by stripping a joiner): **कक्‍षा**, or a matra
  detached from its base like **कक ् षा** — a broken cluster reads as a rendering fault.

**Line breaking & hyphenation.** Handled by the **Unicode line-breaking algorithm (UAX #14)** via
its Brahmic classes (AK/AS/AP/VI/VF) — the engine, not manual hyphenation, does the work. **Hindi
web text does not use dictionary-style automatic hyphenation** (round-2 research, corroborated by
the ILREQ/UAX #14 framing): breaks fall at spaces and punctuation, and you must **not** insert
soft hyphens inside a syllable/conjunct.

- ✅ Break at a space: `… पाठ ␣ शुरू करें …`
- ❌ Soft hyphen inside a conjunct: `कक्␣षा` (splitting क्ष) — corrupts shaping.

**Punctuation & quotation.** The native period is the **danda ।**; other punctuation (comma,
`?`, `!`, `:`, `;`, `()`) follows standard forms adapted to Hindi, per Rajbhasha / CSTT editorial
practice (⚠ the specific style pages could not be fetched — see §2).

- ✅ Danda as sentence end in Hindi copy: **यह पाठ तैयार है।**
- ❌ Latin period standing in for the danda in formal body copy: **यह पाठ तैयार है.**
  (understood, but the danda is the Hindi convention).

**Quotation marks — the typographic pair, not the ASCII one.** The CLDR `hi` locale sets the
default quotation marks as **“ (U+201C) … ” (U+201D)**, with **‘ (U+2018) … ’ (U+2019)** for a
quote embedded inside a quote (Core Data → Alphabetic Information → Quotation Marks: Start “,
End ”, embedded-Start ‘, embedded-End ’ — CLDR `hi` summary chart, §2). ASCII `"` (U+0022) and
`'` (U+0027) are keyboard artifacts: widespread in practice, but not the typographic form, and
they defeat any nesting.

- ✅ **“यह पाठ तैयार है।”** · nested: **“उसने कहा, ‘अब शुरू करें’।”**
- ❌ **"यह पाठ तैयार है।"** (ASCII straight quotes) · **„यह पाठ तैयार है“** (German low-high pair —
  not the `hi` locale's form).

*(An earlier revision also listed **‘यह पाठ तैयार है’** as a wrong outer pair, on the reasoning that
single marks are the embedded level. **That is withdrawn:** the measurement below finds the single
pair carrying the primary level wherever Hindi publishing uses typographic marks at all. Single-as-
outer is a second attested system, not an error — what remains an error is mixing the two.)*

**What the CLDR reading actually is (checked against the source data this pass).** The `hi` locale
file carries **no Hindi-specific quotation data**: all four delimiter fields in
`common/main/hi.xml` at the pinned release hold the CLDR **inheritance marker** `↑↑↑`, and the
glyphs above come from `root.xml`. UTS #35 (LDML, v48.2) defines it: "*There is a special
Inheritance Marker used in the main repository, which has the value ↑↑↑ … It is used created during
data submission to record that the inherited value has been verified for the current locale and
path*" (verbatim, grammatical slip included). CLDR's assignment is therefore the cross-locale
default recorded as checked for `hi`, not a value authored from Hindi typographic practice.

**House usage, established by measurement — and it is not the CLDR assignment.** The open question
was never *which glyphs exist* but *which pair Hindi publishing actually uses*. Seven Hindi
publications, **38 fetched article files, ~208,000 Devanagari characters**, counted by codepoint
this pass (a mark counts only where a Devanagari character sits within three characters of it, so
English page furniture is excluded):

| Publication | “ U+201C / ” U+201D | ‘ U+2018 / ’ U+2019 | ASCII `"` / `'` |
|---|---|---|---|
| BBC Hindi — 6 | 0 / 0 | 0 / 0 | 118 / 168 |
| Navbharat Times — 6 | 0 / 0 | 0 / 0 | 0 / 65 |
| Amar Ujala — 6 | 0 / 0 | 0 / 0 | 39 / 40 |
| Dainik Jagran — 6 | 0 / 0 | 0 / 0 | 2 / 8 |
| Aaj Tak — 4 | 0 / 0 | 2 / 2 | 0 / 26 |
| Dainik Bhaskar — 4 | 1 / 1 | 25 / 26 | 4 / 18 |
| The Wire Hindi — 6 | 0 / 0 | 12 / 12 | 0 / 0 |

Two findings, and they are the answer to the open question. **(1) The double typographic pair is
effectively unused.** One “…” pair across the entire 38-file sample. **(2) Where typographic marks
are used at all, the SINGLE pair carries the primary level** — including full direct speech, not
merely titles. The Wire Hindi writes ‘…’ and nothing else:

> ‘परिजनों ने शवों की पहचान कर ली है. इस मामले में केस दर्ज किया जाएगा और आगे की जांच जारी है.’

alongside term use in the same house style (‘फोर्स ग्रेडिएंट’, ‘संसद चलो’). Everyone else ships
ASCII. **So: for Hindi, “ ” is a locale default rather than an observed house convention, and a
`hi` surface that emits ‘…’ as its primary quotation is following attested Hindi publishing, not
deviating from a norm.**

**One Hindi authority's own house usage points the same way.** The **Central Hindi Directorate
(केंद्रीय हिंदी निदेशालय), Department of Higher Education, Government of India** publishes
*देवनागरी लिपि तथा हिंदी वर्तनी का मानकीकरण*. Its 27-page PDF was fetched and counted this pass:
**26 × ‘ U+2018 and 28 × ’ U+2019; zero “ U+201C, zero ” U+201D, zero ASCII `"`.** It cites letters
and words in single marks throughout —

> बारह खड़ी में ‘ङ’ और ‘ञ’ नहीं रखे गए हैं।

⚠ Two caveats, stated plainly. That document **prescribes nothing about quotation marks** — it is a
script-and-spelling standardization document, so this is an authority's *house usage*, not a ruling.
And its embedded font map is partly broken, so much of its Devanagari extracts garbled; the
quotation characters and the sentence quoted above extract cleanly, and the **counts** are robust
because they do not depend on the consonant mapping.

⚠ **Scope of the citation:** CLDR is the source for *which glyphs*; a Rajbhasha/CSTT *style ruling*
on house usage (when to quote vs italicize, spacing around the danda) is still **not** confirmed
here. Tried by name this pass: **csttpublication.gov.in — DNS failure**; **cstt.education.gov.in —
connection timeout after ~21 s**; **rajbhasha.gov.in — HTTP 200 but contains no वर्तनी / विराम
चिह्न / उद्धरण style document at all** (searched, zero hits); **hi.wikipedia.org "उद्धरण चिह्न" —
HTTP 404, the article does not exist**. The measurement above replaces that gap with evidence of a
different kind — usage, not prescription — and is labeled as such.

**Romanization in native-script text.** CSTT policy direction is that Hindi technical content
should prefer **standardized Hindi terms**, with English kept only where no accepted Hindi
equivalent exists (⚠ the CSTT pages could not be fetched to confirm the exact wording). Practical
UI rule: **body content is Devanagari; romanization is confined to established Latin acronyms
(AI, ML, GPU, API) and to slugs/identifiers (§10)**, never used as a display substitute for a
Hindi word. Where an English label is retained, it is commonly *transliterated into Devanagari*
in learner-facing prose (e.g. मशीन लर्निंग) with the acronym in parentheses on first use.

Sources: <https://www.unicode.org/charts/PDF/U0900.pdf> ·
<https://www.unicode.org/reports/tr14/> · <https://www.w3.org/TR/ilreq/> ·
<https://www.unicode.org/cldr/charts/latest/summary/hi.html> (quotation-mark glyphs) ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/hi.xml> and
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> (**fetched
this pass**: `hi.xml` holds the inheritance marker in all four delimiter fields) ·
<https://www.unicode.org/reports/tr35/tr35.html> (LDML v48.2 — the Inheritance Marker definition
quoted above) · <https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari> ·
**house-usage evidence, fetched and counted this pass:**
<https://www.chd.education.gov.in/sites/default/files/devanagari-lipi.pdf> and its landing page
<https://www.chd.education.gov.in/devanagari-lipi-tatha-hindi-vartani-manakikaran-0> (Central Hindi
Directorate — 26 ‘ / 28 ’, zero “ ”; ⚠ house usage, **not** a prescription, and the PDF's font map
is partly broken) · <https://www.bbc.com/hindi> · <https://navbharattimes.indiatimes.com/> ·
<https://www.amarujala.com/> · <https://www.jagran.com/> · <https://www.aajtak.in/> ·
<https://www.bhaskar.com/> · <https://thewirehindi.com/333927/massive-explosion-at-an-assam-metal-processing-unit-four-workers-killed/>
(the quoted direct-speech example) — ⚠ **no CSTT/Rajbhasha style ruling was reached**:
csttpublication.gov.in DNS failure, cstt.education.gov.in connection timeout, rajbhasha.gov.in
reachable but carries no such document, hi.wikipedia "उद्धरण चिह्न" HTTP 404 (§2).

---

## 10. Technical integration checklist

- **Fonts to ship:** a fully Indic-capable Devanagari font with complete conjunct/matra/nukta
  coverage — **Noto Sans Devanagari** (or **Noto Serif Devanagari**) is the safe default;
  **test complex clusters** (क्ष, त्र, ज्ञ, श्र, half-forms) and nukta letters (क़ ज़ फ़) before
  relying on any build.
- **`lang` / `dir` attributes:** `lang="hi"` (base) and `lang="hi-easy"` (simplified variant,
  subject to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and
  per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**.
- **Combining marks are load-bearing:** matras (ि ी ु ू …), the virama/halant (्), nukta (़),
  anusvāra (ं), candrabindu (ँ), and **ZWJ/ZWNJ (U+200D/U+200C)** inside Devanagari strings carry
  meaning (§3). Build steps, "sanitizers", trim/normalize passes must **not** strip or reorder
  them — a normalization that drops a nukta or a zero-width joiner silently corrupts the word.
- **Tokenization / highlighting:** whitespace word separation applies — standard word tokenizers
  and word-boundary highlighting work. Do **not** insert hyphenation: Hindi web text uses no
  dictionary-style hyphenation (§3), and a soft hyphen inside a conjunct breaks shaping. Line
  breaking is UAX #14's job (Brahmic classes AK/AS/AP/VI/VF).
- **Index alphabet for glossary navigation:** use **Devanagari वर्णमाला order** (vowels
  अ आ इ ई … then consonants क ख ग …) per **CLDR `hi` collation** — **not** an A–Z Latin index.
  The research did not enumerate the full collation sequence; hand-listing it would be ⚠
  unverified, so **drive the index from CLDR `hi` collation data**, not a hard-coded list.
- **Digits in display vs identifiers:** display numbers per §5 (Devanagari or Western per context,
  lakh/crore grouping, `.` decimal); keep Western digits for machine identifiers, ISO-8601
  backends, and code.
- **Currency:** ₹ (U+20B9) before the amount (§5); INR is uniform across the Hindi belt — no
  per-region currency parameterization needed.

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari> ·
<https://www.unicode.org/charts/PDF/U0900.pdf> · <https://www.unicode.org/reports/tr14/> ·
<https://www.unicode.org/cldr/charts/latest/summary/hi.html> · <https://www.w3.org/TR/ilreq/>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio:** the large majority of letters in `hi` content must fall in the **Devanagari
  block (U+0900–U+097F)**. A low Devanagari-codepoint ratio signals untranslated source text left
  in place.
- **Forbidden / suspicious characters:**
  - No **Latin transliteration standing in for a Hindi word** in body text (Latin allowed only for
    established acronyms — AI, ML, GPU, API — and for slugs/identifiers).
  - The **danda । (U+0964) / double danda ॥ (U+0965)** are legitimate; flag other scripts'
    letters (e.g. Bengali/Tamil blocks) as wrong-script leaks.
  - No **Western digits inside an otherwise Devanagari-digit number**, and vice versa.
- **Digit-system consistency:** within a single number/field, digits are **either** all Devanagari
  (०–९) **or** all Western (0–9) — never mixed (e.g. `१2३` is a defect). Pick the system per
  context per §5.
- **Number-grouping check:** grouped numbers use **lakh/crore** grouping (`१२,३४,५६७`), not
  Western triples (`१२,३४५,६७८`); decimal separator `.`, group separator `,`; currency **₹**
  before the amount.
- **Combining-mark integrity:** spot-check that matras, nukta (़), virama (्), and anusvāra/
  candrabindu are present and correctly ordered on their base; flag any normalization pass that
  has stripped a nukta or a ZWJ/ZWNJ (U+200C/U+200D) where a conjunct/half-form depends on it.
- **Register consistency:** the §4 register is **आप** — scan second-person copy for stray **तू /
  तुम** pronouns *and* their familiar verb endings (a tier mismatch is both a social error and a
  grammar error).
- **Punctuation consistency:** danda **।** vs Latin period `.` used consistently per house style;
  no accidental double danda ॥ where a single is meant.
- **Source-language leak scan (EN/DE → HI):** left-in English function words (the, and, you,
  please), German umlauts/ß, or verb-mid SVO word order surfacing in Hindi sentences.

Sources: <https://www.unicode.org/charts/PDF/U0900.pdf> ·
<https://www.unicode.org/reports/tr14/> · <https://www.unicode.org/cldr/charts/latest/summary/hi.html>

---

*Provenance note:* this guide is built solely from an external desk-research pass (round-1 broad +
round-2 targeted follow-up). The **typography anchors were independently re-fetched and confirmed**
— UAX #14 (Rev 55 / Unicode 17.0.0), W3C ILREQ (WD May 29, 2020, danda + orthographic-syllable
integrity), and the canonical Devanagari block chart — with two research mis-cites corrected: the
UAX #14 anchor/version was stale (normalized to `unicode.org/reports/tr14/`, Brahmic classes
AK/AS/AP/VI/VF), and ILREQ was over-quoted for "whitespace word separator" (reframed as general
orthography). The **Indian-government terminology authorities (CSTT / Rajbhasha / shabd) refused
the connection from the research tool** — they are named as authorities of record but their page
content is **unconfirmed here**, and every AI/ML term in §6 is marked **"informal — not
CSTT-verified"** with the CSTT term bank named as the verification locus. All **⚠ unverified**
markers indicate claims the research could not source or that could not be confirmed from the §2
authorities. A native-speaker review (and a second-model pass against the §2 sources) is still
outstanding (see Status in the header).
