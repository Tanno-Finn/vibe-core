<!-- base -->
# lang-mr — Marathi (मराठी) — language guide

> **Setup & sources live in [`mr.setup.md`](mr.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** मराठी / Marathi.
**BCP 47 code (base):** `mr` (region form `mr-IN`).
**BCP 47 code (simplified variant):** `mr-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`mr-x-simple`), but the kit token `mr-easy` is the one
that counts here.
**Speaker reach:** **83 million** first-language speakers — “83 million native Marathi speakers in
India, according to the 2011 census” — plus roughly **16 million** second-language speakers
(2011 Census figures via en.wikipedia.org/wiki/Marathi_language). It is “the official language of
Maharashtra, and an additional official language in the state of Goa”, “one of the 22 scheduled
languages of India”, and it “was designated as a classical language by the Government of India in
October 2024” (same source). That classical status matters editorially: it strengthens the
institutional pull toward Sanskritic (tatsama) coinage in formal registers — a pull this guide
deliberately counteracts (§6, §9).
**Script + direction:** **Devanagari, U+0900–U+097F**, a **left-to-right abugida**. Specifically the
**Marathi variety of the script, बाळबोध (Balbodh)** — *not* Hindi Devanagari. Consonants carry an
inherent vowel; vowel signs (मात्रा) attach above, below, before, and after the base letter;
clusters ligate through the virama U+094D.
**Status:** planned — **not yet reviewed by a native speaker**. Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources; the Unicode Standard ch. 12 (rule R5), the Devanagari NamesList, `CompositionExclusions.txt`
and the CLDR `mr` locale files were **re-fetched and re-confirmed** during authoring. Covers base
`mr` and the `mr-easy` pendant. **Coverage is uneven and the guide is a first pass** — the research
search budget was exhausted before several lines of inquiry ran out. §3 (script) and §5
(numbers/dates) rest on Unicode and CLDR primary sources and are strong; §2 rests on live government
portals; §6 turns on a **load-bearing negative finding** (there is no official Marathi computing
terminology at all) and is honest about it; §4 rests on Wikipedia grammar articles and is marked
**⚠ community-tier**; §7 is **entirely craft-tier**; §8 records an honest ❌ (no codified plain-language
tradition). Per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records those gaps rather than smoothing
them.
**Easy or hard for this kit:** **hard, and hard in a way that hides itself.** Devanagari needs real
shaping (conjuncts, matra repositioning), so nothing about rendering is free. But the three things
that actually bite are: (1) the **eyelash reph**, whose correct encoding ends in an **invisible ZWJ**
that ordinary sanitizers delete without trace and that normalization cannot restore (§3 — the
centrepiece of this guide); (2) **ळ U+0933**, a Marathi letter absent from standard Hindi, which
Hindi-tuned fonts, keyboards, and webfont subsets quietly drop; and (3) **Hindi contamination** —
Marathi and Hindi share the script and much vocabulary, so a Hindi-ism in Marathi output *looks like
perfectly good Devanagari* and passes every automated and visual check. A Hindi-reading reviewer will
not catch it. Only a Marathi reader will.

Sources: <https://en.wikipedia.org/wiki/Marathi_language> · <https://en.wikipedia.org/wiki/Balbodh> ·
<https://www.unicode.org/charts/PDF/U0900.pdf> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/>

---

## 1. Header block

See above. One-line orientation: Marathi is an Indo-Aryan, **SOV**, LTR language written in the
**Balbodh variety of Devanagari**, with **three genders**, **split ergativity**, **postpositional
case suffixes** and an **inclusive/exclusive "we"** distinction; the localization risks concentrate
in **invisible-character integrity (the ZWJ of the eyelash reph)**, **script-shared contamination
from Hindi**, and **a total absence of official computing terminology** — not in direction or bidi.

---

## 4. Grammar for translators

**⚠ Community-tier section.** The grammar facts below rest on **Wikipedia grammar articles** (Marathi
grammar / Marathi language) — **no academic reference grammar was fetchable in full text** during
research. The features themselves are uncontroversial and cross-checked against the phonology and
schwa articles, but **paradigm detail (especially the full honorific verb-agreement tables) is
unverified** and must be confirmed by a native reviewer. Where the research supplied no contrastive
pair, this section gives the **sourced correct form only and flags the gap** rather than fabricating
Marathi prose.

### 4.1 Word order — SOV

> “The principal word order in Marathi is SOV (subject–object–verb).”
> — en.wikipedia.org/wiki/Marathi_grammar

The verb lands **at the end**. English UI copy built around an early verb ("Select a lesson to
continue") must be **restructured, not word-substituted**. A sentence translated left-to-right from
English will look grammatical and read as translationese.

**➜ Direct platform consequence: never build Marathi sentences by string concatenation.** A pattern
like `"You have " + n + " lessons left"` cannot be reordered into SOV by a template that assumes
English order. **Use whole-sentence keys with named placeholders**, and let the placeholder sit
anywhere in the string.

- ✅ whole-sentence key: `lesson.remaining = "…{count}…"` — the translator places `{count}` where
  Marathi needs it.
- ❌ concatenation: `t("youHave") + count + t("lessonsLeft")` — locks English order into the build.

### 4.2 Register — the central editorial decision (human-gate)

Marathi distinguishes **तू** (*tū*) "you" **informal** from **तुम्ही** (*tumhī*) "you"
**formal/plural**, and has a third, higher-deference option: **आपण** (*āpaṇa*), noted as
“extremely formal” (en.wikipedia.org/wiki/Marathi_grammar). Three rungs, not two:

| Pronoun | Register | Fit for an educational platform |
|---|---|---|
| **तू** | Informal singular; used to children, close peers, juniors | Risky — reads as talking down to an adult learner |
| **तुम्ही** | Formal / polite / plural | ✅ **this platform's register** |
| **आपण** (as "you") | Extremely formal, deferential | Too stiff — **and ambiguous**, see §4.4 |

> **Register decision (human-gate): तुम्ही, used consistently — taken and recorded.**
> **तुम्ही** addresses the learner throughout `mr` and `mr-easy`. Rationale: it is the neutral polite
> form, it works for an unknown adult audience, it does **not** patronize, and it is the standard
> register of Marathi textbooks and instructional prose. Decisively, it **keeps आपण free for the
> inclusive "let's"** (§4.4) — an AI course reaches for that constantly, and using आपण for both
> "you" and inclusive-"we" in the same paragraph is genuinely confusing. **Binding for all
> second-person copy; no drift to तू**, including in playful passages, unless a specific piece is
> explicitly aimed at children. Mixing तू and तुम्ही across screens is the worst outcome of all.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

> **⚠ Documented disagreement — recorded, not hidden.** The **one written source the research found**
> that addresses Marathi UI register **prescribes the higher आपण/आपला rung**:
>
> > “Formality and Tone should be respectable. For example yours should be translated as 'आपला' not as
> > 'तुमचा'”
> > — community localization style guide, `mr` (<https://mozilla-l10n.github.io/styleguides/mr/>,
> > community/open-source, not governmental)
>
> **Weighing both positions honestly.** *For आपण/आपला:* it is the only written-down recommendation for
> Marathi UI text that could be verified, and it comes from practicing Marathi localizers.
> *For तुम्ही (this guide's choice):* that guide governs **browser-product UI**, where deference to the
> user is the house voice. **This platform has a teaching voice** — warm and direct, not deferential —
> and तुम्ही is the register of Marathi instructional prose. Plus the आपण collision above.
> **This guide follows तुम्ही.** If a future house-voice decision goes markedly formal, आपण/आपला is a
> legitimate alternative — but then a *different* strategy for the inclusive "we" must be chosen at the
> same time. Either way this is decided **once, project-wide**, and recorded in the term sheet.
> *The pronoun inventory and register values are sourced; the weighing is editorial (`⚠ craft`) and
> should be confirmed with a native Marathi editor.*

- ✅ pronoun: **तुम्ही** · possessive **तुमचा / तुमची / तुमचे**
- ❌ pronoun: **तू** · possessive **तुझा / तुझी / तुझे** *(off-register for this platform)*

**Honorific verb agreement — the part that is easy to get half-right.** Politeness in Marathi is
**not only pronoun choice**: the verb must agree in the **plural/honorific** form as well. Choosing
तुम्ही and then leaving a singular verb produces a jarring, inconsistent register.

- ✅ polite-plural imperatives (the neutral instructional register): **करा** · **पाहा** · **वाचा**
- ❌ *the familiar singular (तू-series) imperative forms* — **⚠ gap-flagged, deliberately not spelled
  out here.** The research supplied no attested singular paradigm, and fabricating Marathi verb
  morphology is exactly what this guide must not do. **Next research round: fetch the honorific
  verb-agreement paradigm** (the शुद्धलेखन नियमावली / an academic reference grammar) and fill this pair.

### 4.3 Three genders — not two

> “There are three genders in Marathi: masculine, feminine, and neuter.”
> — en.wikipedia.org/wiki/Marathi_grammar

**A hard break from Hindi, which has two.** Agreement propagates: declinable adjectives ending in -आ
are “declined for the gender, number and case of the nouns they qualify”, and verbs likewise inflect
for gender (same source).

**Why this breaks naive translation:** every adjective, participle, and past-tense verb form in a
Marathi string is **locked to the gender of its noun**. A UI string with a placeholder — "Your {item}
is ready" — **cannot be translated once and reused**, because agreement changes with the gender of
whatever fills `{item}`. **Neuter is a genuinely separate class**, so a Hindi-trained pipeline that
only knows masculine/feminine will *systematically* produce wrong forms for neuter nouns.

- ✅ the genitive suffix is itself gender-marked: **-चा** (masc.) · **-ची** (fem.) · **-चे** (neut.)
- ❌ freezing one genitive form across all fillers (e.g. always **-चा**) — even "X's Y" is not a fixed
  string in Marathi.

### 4.4 आपण vs आम्ही — inclusive/exclusive "we"

Marathi splits the first-person plural: **आम्ही** (*āmhī*) "we" **exclusive** vs **आपण** (*āpaṇa*) "we"
**inclusive** (en.wikipedia.org/wiki/Marathi_grammar).

- **आम्ही** = we, *not including you* — the platform speaking about itself ("we built this course").
- **आपण** = we, *including you* — the reader is part of the group ("let's look at an example").

English "we" is ambiguous and maps to both. This matters **constantly** in educational copy, where
"we" is usually the **inclusive teaching voice**. Using आम्ही there makes the platform sound like it is
excluding the learner from the activity.

- ✅ inclusive teaching voice: **आपण आता एक प्रतिमान प्रशिक्षित करू.** ("now let's train a model")
- ❌ exclusive: **आम्ही आता एक प्रतिमान प्रशिक्षित करू.** (reads as: *we* will do it, *you* watch)
  *(⚠ `craft` — the pair is composed from the sourced inclusive/exclusive distinction plus the
  sourced term प्रतिमान (§6); the sentences themselves are authored, not attested.)*

⚠ **The collision, restated:** आपण is *both* inclusive-"we" *and* ultra-formal "you". That is a real
ambiguity in running text, and the decisive reason §4.2 chose तुम्ही.

### 4.5 Split ergativity — the agreement rule that inverts

> “Marathi is considered a split ergative language, i.e. it uses both nominative-accusative and
> ergative-absolutive alignment.”
> — en.wikipedia.org/wiki/Marathi_grammar

In the **perfective/past with a transitive verb**, the subject takes the ergative marker **-ने** and
**the verb agrees with the object, not the subject**. The sourced example:

> “मुलाने पुरी खाल्ली” — glossed *boy.MASC.SG-ERG puri.FEM.SG eat-**FEM**.SG.PST*, "The boy ate puri."
> (same source)

Note **खाल्ली is feminine**, agreeing with पुरी (fem.), even though the subject मुलगा is masculine.

- ✅ sourced: **मुलाने पुरी खाल्ली.** (ergative subject; verb agrees with the *object*)
- ❌ subject-agreement, the naive error: a masculine verb form agreeing with मुलाने instead of पुरी.
  *(⚠ described rather than spelled out — the research supplies no attested wrong form, and the
  point is the agreement target, not a particular misspelling.)*

Applied to platform copy: "The model processed the data" in a past/perfective frame **requires the
ergative subject marker and object agreement**. This is the construction most likely to be silently
wrong in machine-assisted output, because it **inverts** the rule that both English and
Hindi-influenced intuition suggest.

### 4.6 Postpositions and agglutinative case suffixes

“Affixation is largely suffixal in the language and postpositions are attested.”; true postpositions
“have a wide range of meanings and can be separated form the noun by clitics”
(en.wikipedia.org/wiki/Marathi_grammar). Core markers from the same source: **-ने**
(instrumental/ergative), **-ला** (accusative/dative sg.), **-चा/-ची/-चे** (genitive, itself
gender-inflected).

Relations attach **after** the noun, as **suffixes on the inflected oblique stem** — the noun changes
shape *before* the suffix lands. Two consequences:

1. **English prepositions have no positional equivalent.** "in the lesson", "to the course", "with the
   data" all become **noun + suffix**.
2. **Never inject a bare placeholder into a case slot.** `"Go to {courseName}"` needs `{courseName}` to
   carry a case suffix, which depends on the noun's gender and stem. **Either pre-inflect the
   placeholder value, or rewrite the sentence to avoid the case slot.** This is the classic i18n trap
   here, and the gender-marked genitive makes it worse.

- ✅ rewrite to avoid the slot: put the course name on its own line / in its own element, and phrase
  the sentence around it.
- ❌ `"{courseName} ला जा"` with an uninflected placeholder — the stem is wrong for most fillers.

### 4.7 ⚠ The Hindi-contamination warning — the most important practical rule

**Marathi is written in Devanagari but it is not Hindi.** Because the two share a script and much
Sanskritic vocabulary, **Hindi-isms in Marathi output are invisible to anyone who does not read
Marathi.** The output looks like well-formed Devanagari and passes every automated check and every
visual review. **Hindi-trained or Hindi-adjacent tooling silently produces Hindi-isms in Marathi.**

| Divergence | Sourced in | Hindi-contamination symptom |
|---|---|---|
| **ळ (U+0933)** exists in Marathi, not standard Hindi | §3.2 (Balbodh; r12a “ऱ,ळ”) | ल substituted for ळ — शाळा → शाला |
| **Eyelash reph र्‍** regular in Marathi | §3.3 (Balbodh; Unicode R5) | Ordinary reph र्य substituted, or the ZWJ dropped |
| **Three** genders vs Hindi's two | §4.3 | Neuter nouns given masculine/feminine agreement |
| **Split ergativity** with object agreement | §4.5 | Subject agreement in the perfective |
| **Anusvara** used differently | §3.6 | Hindi anusvara conventions transplanted |
| **Schwa retained medially**, unlike Hindi | §3.7 | Hindi-style romanization/TTS: *Prerna* for प्रेरणा |
| **Distinct pronoun system** (तू/तुम्ही/आपण; आम्ही ≠ आपण) | §4.2, §4.4 | Hindi आप-modeled register; inclusive/exclusive "we" collapsed |
| **Postpositions and case suffixes** differ | §4.6 | Hindi के लिए-shaped constructions instead of Marathi साठी |

**Practical mitigations** (`⚠ craft` — engineering recommendations, not sourced):

- Treat any Marathi produced by **Hindi-adjacent or multilingual tooling as draft**, never as
  shippable.
- **Never pivot EN → HI → MR.** Translate from the English source directly.
- **Automated tell-tales** (§11): a long Marathi document containing **no ळ at all**; a document with
  eyelash-bearing vocabulary and **zero U+200D**; **Hindi nuktas** (ज़ फ़ ख़) in body copy.
- **Require a native Marathi reviewer — not a Hindi speaker — for sign-off.** A Hindi reader will not
  notice most of the errors in the table above.

Sources (community-tier): <https://en.wikipedia.org/wiki/Marathi_grammar> ·
<https://en.wikipedia.org/wiki/Marathi_language> · <https://en.wikipedia.org/wiki/Anusvara> ·
<https://en.wikipedia.org/wiki/Schwa_deletion_in_Indo-Aryan_languages> ·
<https://en.wikipedia.org/wiki/Balbodh> · <https://mozilla-l10n.github.io/styleguides/mr/>
*(register disagreement, community/open-source)* — **no academic reference grammar was fetchable;
native-speaker confirmation pending**

---

## 5. Numbers, dates, currency

**(Strong section — CLDR `mr` locale JSON, re-fetched and re-confirmed 2026-07-26.)**

### 5.1 Digits — the CLDR default is a trap

CLDR's `mr` locale declares its **`defaultNumberingSystem` as `"deva"`** — Devanagari digits
**०१२३४५६७८९** (CLDR-JSON `mr/numbers.json`, **re-confirmed**). Devanagari digits occupy
**U+0966–U+096F**; the Unicode Standard notes “Each Indic script has a distinct set of digits
appropriate to that script” and that “positions U+xx66..U+xx6F and U+xxE6..U+xxEF code the Indic
script digits for each script” (Unicode 16.0.0, ch. 12).

**➜ This is a live formatting trap.** A standard ICU/`Intl` pipeline set to `mr` produces **Devanagari
digits by default** — dates as `२६/७/२६`, prices as `₹१,२३,४५६`. Real-world Marathi web content
overwhelmingly uses **Western (ASCII) digits**, and learners reading technical/AI content expect
Western digits for figures, code, percentages, and version numbers.

**Recommendation:** explicitly pin the numbering system to Latin — **`mr-u-nu-latn`** (or ICU
`NumberingSystem.LATIN`) — for all UI numerics. Use Devanagari digits only if deliberately chosen for
decorative or primary-school content. **Do not leave it to the default.** `⚠ craft` on the
recommendation; the CLDR default itself is verified.

- ✅ pinned: `new Intl.NumberFormat('mr-u-nu-latn')` → **1,23,456**
- ❌ default: `new Intl.NumberFormat('mr')` → **१,२३,४५६** (Devanagari digits, by accident)
- ❌ mixing both digit systems on one page — the most visible symptom of an unpinned pipeline.

**Separators are the same in both systems:** decimal `.` and group `,` for **latn** and **deva** alike
(same CLDR file, re-confirmed).

### 5.2 Grouping — lakh/crore (2,2,3), not thousands (3,3,3)

CLDR's `mr` standard decimal pattern is **`"#,##,##0.###"`** (`mr/numbers.json`, **re-confirmed**) —
the **Indian grouping system**. The rule: “Both systems indicate the first three digits to the left of
the decimal point as a group. Thereafter, the Indian system groups by two digits.”
(en.wikipedia.org/wiki/Indian_numbering_system).

| ✅ Indian grouping (correct for `mr`) | ❌ International grouping (wrong for `mr`) |
|---|---|
| **5,00,000** | 500,000 |
| **12,34,56,789** | 123,456,789 |

Unit words: **लाख** (*lākh*, 10⁵), **कोटी** (*koṭi*) or **करोड** (*karoḍ*) (10⁷), **अब्ज** (*abja*, 10⁹).

- ✅ Marathi: **कोटी** (also **करोड**, no nukta)
- ❌ **करोड़** — the Hindi form with a nukta (U+093C). A contamination tell (§4.7, §11).

**➜ Never hard-code `toLocaleString('en-US')` or a `\B(?=(\d{3})+(?!\d))` thousands regex for
Marathi.** Both produce Western grouping. Use the locale-aware formatter — which gets grouping right —
and override only the **numbering system** per §5.1.

- **Decimal separator:** `.` · **Group separator:** `,` · **Percent pattern:** **`"#,##0%"`**
  (all re-confirmed).

### 5.3 Currency

The Indian Rupee sign is **₹ U+20B9**, “Indian Rupee Sign”, “added to Unicode version 6.0 in October
2010” (Compart — community source). CLDR's `mr` standard currency pattern is **`"¤#,##0.00"`**
(**re-confirmed**): the symbol goes **before** the number, **with no space**, and the Indian grouping
of §5.2 applies.

- ✅ **₹1,23,456.00**
- ❌ **1,23,456.00 ₹** (symbol after) · ❌ **₹ 1,23,456.00** (space after the symbol) ·
  ❌ **₹123,456.00** (Western grouping)

Because U+20B9 postdates a lot of installed fonts, **verify your webfont actually contains the
glyph** — a missing ₹ renders as tofu. Fallback is the Devanagari abbreviation **रु.** `⚠ craft`.

### 5.4 Dates and times

From CLDR `mr` Gregorian data (`mr/ca-gregorian.json`, **re-fetched and re-confirmed**):

| Format | Date pattern | Time pattern |
|---|---|---|
| full | `EEEE, d MMMM, y` | `h:mm:ss a zzzz` |
| long | `d MMMM, y` | `h:mm:ss a z` |
| medium | `d MMM, y` | `h:mm:ss a` |
| short | `d/M/yy` | `h:mm a` |

- **Day–month–year order throughout.** `d/M/yy` — **never** `M/d/yy`. An American-ordered date is both
  wrong and dangerously ambiguous for days ≤ 12.
- **12-hour clock with an am/pm marker** (`h` + `a`), **not** 24-hour. This differs from most European
  locales in the kit — do not copy a European date/time config into `mr`.
- Note the **comma before the year** in the long/medium/full forms (`d MMMM, y`) — a Marathi-specific
  detail a generic Indic template will miss.

- ✅ short **26/7/26** · long **26 जुलै, 2026** style per `d MMMM, y` · time **9:15 am**
- ❌ **7/26/26** (US order) · ❌ **26 जुलै 2026** (missing the comma before the year) · ❌ **21:15**
  (24-hour)
- ❌ **२६ जुलै, 2026** — Devanagari day, Western year, one string. Digit systems must not be mixed
  (§5.1); a fully Devanagari **२६ जुलै, २०२६** is acceptable only where the decorative/primary-school
  option in §5.1 is deliberately chosen, and then for the whole surface.

Wide month names are Devanagari transliterations of the Gregorian months: **जानेवारी, फेब्रुवारी,
मार्च, एप्रिल, मे, जून, जुलै, ऑगस्ट, सप्टेंबर, ऑक्टोबर, नोव्हेंबर, डिसेंबर** (**re-confirmed**).
Note **जुलै** (July) and **ऑगस्ट** (August) — these are the **Marathi** forms and differ from the Hindi
ones. Another quiet contamination check.

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/mr/numbers.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/mr/ca-gregorian.json> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://en.wikipedia.org/wiki/Indian_numbering_system> ·
<https://www.compart.com/en/unicode/U+20B9> *(community source)*

---

## 6. Terminology strategy

**(The policy is well-evidenced; the term table is mixed — 13 of 19 rows sourced, 6 craft, labeled
per row. ⚠ No mainstream Marathi newspaper could be fetchable during research, so "press usage"
below rests on a single Marathi policy-research outlet, not a corpus. Read it as one data point.)**

### 6.1 The decisive negative: there is no computing terminology kosh

The government terminology portal **shabdakosh.marathi.gov.in is free, online, and browsable**, and it
carries substantial science and engineering volumes — physics, chemistry, biology, **mathematics**, and
**three** engineering volumes (mechanical, electrical, civil). See §2 for the entry counts.

> **❌ There is no dedicated संगणक / computer / IT परिभाषा कोश.**

**Verified three ways:** the portal index (43 glossaries — no computing entry); the Directorate's own
publications listing; and the in-glossary navigation list on `/ananya-glossary/9` (39 glossaries
enumerated), whose nearest neighbors are the three अभियांत्रिकी volumes.

**➜ Consequence, stated plainly because it is load-bearing: there is no official Marathi AI/ML
terminology at all.** Nothing in the परिभाषा कोश series covers *deep learning*, *dataset*,
*training*, *model in the ML sense*, *prediction*, *bias*, or *language model*. This is not a gap to
paper over — it is the fact that determines the whole terminology policy below, and it is why this
platform's term sheet has to make decisions no authority has made.

`⚠ residual caveat, reported honestly:` `coe.maharashtra.gov.in` (मराठी भाषा संगणनाचे उत्कृष्टता केंद्र
— Centre of Excellence for Marathi Language Computing), which hosted परिभाषा कोश e-books, **does not
resolve (DNS ENOTFOUND)**. That is exactly where a computing glossary would plausibly have lived, so
the ❌ carries a small unverifiable residue.

### 6.2 Routing around the gap — mathematics kosh plus encyclopedia

With no computing volume, computing vocabulary is sourced **indirectly**:

- **गणितशास्त्र परिभाषा कोश (mathematics, 3,919 entries)** — the one official volume that does carry
  computing-adjacent headwords. It yields **संगणक** (computer), **संभाव्यता** (probability),
  **प्रतिमान** (model), **जालव्यूह** (network), plus useful compounding material: `node — गाठबिंदु`,
  `computation — संगणना`, `calculation — परिगणन`, `pattern — सूत्रबंध`, `mapping — प्रतिचित्रण`,
  `nonlinear — अरेषीय`.
- **मराठी विश्वकोश (both editions)** — the only official source with genuinely modern computing
  articles.
- **Marathi Wikipedia** — for real-world usage, not authority.

### 6.3 The stated policy: prefer the loanword over an unrecognizable coinage

Marathi runs **two live registers** for technical vocabulary, and they diverge sharply: **Sanskritic
coinage** (the परिभाषा कोश and encyclopedia headwords — systematic, morphologically Marathi, and for
computing concepts largely *unknown to ordinary readers*) versus **Devanagari transliteration** (what
Marathi media, Marathi Wikipedia body text, and the state encyclopedia's own running prose actually
use).

**The decisive evidence is that the official encyclopedia itself code-switches.** Its data-mining
article opens with the loanword gloss “(डेटा खनन; डेटा मायनिंग; माहिती खनन)” and inside the article
uses **“मशिन लर्निंग”**, **“न्यूरल नेटवर्क”** and **“रीती (अल्गॉरिदम)”** — the coinage with the
**loanword parenthesized, not the reverse** (marathivishwakosh.org/60554/).

**If the state encyclopedia transliterates, a public-facing education platform certainly may.**

Marathi Wikipedia's computer-science category shows the split cleanly: Sanskritic titles for
**abstract** concepts (कृत्रिम बुद्धिमत्ता, नैसर्गिक भाषा प्रक्रिया, समांतर संगणन) but transliterated
titles for **concrete artifacts and named techniques** (अल्गोरिदम, कॉम्प्युटर नेटवर्क, क्लाउड
कॉम्प्युटिंग, मायक्रोकंट्रोलर, माउस).

> **➜ Platform terminology policy.**
> 1. **Lead with the established Marathi term where one is genuinely current** — कृत्रिम बुद्धिमत्ता,
>    संगणक, माहिती, संभाव्यता — and gloss the English loanword in parentheses on first use.
> 2. **Prefer a recognized loanword over an unrecognizable coinage.** Do **not** deploy obscure kosh
>    coinages as primary UI terms: **रीत** for *algorithm*, **आधारसामग्री** for *data*, **प्रायोजना**
>    for *programme* are officially attested and dead on arrival. Use **अल्गोरिदम**, **डेटा**,
>    **प्रोग्राम**.
> 3. This mirrors both the encyclopedia's own practice and the community style guide's explicit rule:
>    “Difficult concepts/ terminologies should be made easy to comprehend otherwise should be
>    transliterated.”
> 4. **Spell loanwords phonetically**, per the state-ratified 1972 writing rules (§8).
> 5. **Freeze one rendering per concept in the term sheet.** See §6.5 — drift here is visible to
>    readers.

**The sandwich pattern** (from [translation-quality](../translation-quality.md)) instantiated in
Marathi — on the *first* mention of an established domain term (class **C3**), give target term +
original + one short plain clause, then the target term alone thereafter. This is precisely the
encyclopedia's own `संगणक (कॉम्प्युटर)` move:

> **कृत्रिम बुद्धिमत्ता** (artificial intelligence, AI) — *one short plain clause explaining it.*
> Then **कृत्रिम बुद्धिमत्ता** alone on every later mention.
> *(The term is sourced below; the explanatory clause is authored per the sandwich format.)*

### 6.4 Seed field vocabulary (AI/ML)

**Provenance key:** `official` = attested in a fetched official/encyclopedic source ·
`attested` = attested in a fetched real-world Marathi source · `⚠ craft` = reasoned proposal,
**unsourced, requires native review**.
**13 of 19 rows are sourced; 6 are craft.**

| # | English | Recommended Marathi | Provenance | Evidence / note |
|---|---|---|---|---|
| 1 | artificial intelligence | **कृत्रिम बुद्धिमत्ता** | `official` + `attested` | mr.wiki: “कृत्रिम वस्तूने दर्शविलेल्या बुद्धिमान वर्तनास “कृत्रिम बुद्धिमत्ता” (artificial intelligence, AI) असे म्हणतात.”; also in Vishwakosh. Loanword आर्टिफिशियल इंटेलिजन्स also attested. |
| 2 | machine learning | **यंत्र शिक्षण** (formal) / **मशिन लर्निंग** (common) | `official` + `attested` | mr.wiki: “यंत्र शिक्षण ही कृत्रिम बुद्धिमत्तेची एक शाखा आहे.”; Vishwakosh uses “मशिन लर्निंग”. ⚠ **Three competing renderings — decide once** (§6.5). |
| 3 | deep learning | **डीप लर्निंग** (rec.) / सखोल शिक्षण | `⚠ craft` | No Marathi source found. Kosh renders *deep* as खोल, so सखोल शिक्षण is sound but unattested. Prefer the transliteration. |
| 4 | neural network | **न्यूरल नेटवर्क** / ज्ञानतंतू जाल | `official` + `attested` | Vishwakosh: “न्यूरल नेटवर्क”; mr.wiki AI article: ज्ञानतंतू जाल. |
| 5 | algorithm | **अल्गोरिदम** | `official` + `attested` | गणितशास्त्र कोश: “algorithm — रीत (स्‍त्री.)”; mr.wiki: “अल्गोरिदम किंवा कार्यप्रणाली म्हणजे…”. ⚠ Official **रीत** is unrecognizable — use अल्गोरिदम (policy §6.3). |
| 6 | data | **माहिती** (general) / **डेटा** (technical) | `official` + `attested` | Kosh: “data — n.pl. १ पक्ष (पु.) २ आधारसामग्री (स्‍त्री.)”; Vishwakosh coins विदा but glosses “(डेटा खनन; डेटा मायनिंग; माहिती खनन)”. |
| 7 | dataset | **डेटासंच** | `⚠ craft` | Not found in any fetched source. विदासंच = purist analog; डेटासंच = safer hybrid. |
| 8 | model | **प्रतिमान** | `official` | गणितशास्त्र कोश: “model — प्रतिमान (न.)”. Vishwakosh uses प्रतिकृती in the ML sense. |
| 9 | training | **प्रशिक्षण** | `attested` | Standard, well-understood Marathi; media renders ML as “यांत्रिक प्रशिक्षण”. |
| 10 | prediction | **अंदाज** / भाकीत | `⚠ craft` | ❌ *prediction* is **absent** from the mathematics kosh (letter P verified). अंदाज is everyday and safe. |
| 11 | computer | **संगणक** | `official` | Kosh: “computer — संगणक (पु.)”; Vishwakosh: “संगणक हे सांकेतिक स्वरूपातील माहितीवर संस्करण करणारे एक इलेक्ट्रॉनीय यंत्र आहे.” ✅ Fully established — use without hesitation. |
| 12 | software | **सॉफ्टवेअर** | `attested` | mr.wiki संगणक विज्ञान. Transliteration dominates; no Sanskritic rival in use. |
| 13 | hardware | **हार्डवेअर** | `attested` | mr.wiki संगणक विज्ञान. Loanword only. |
| 14 | programming / code | **प्रोग्रामिंग** / संगणक आज्ञावली ; code = **कोड** | `official` + `attested` | mr.wiki: “संगणक आज्ञावली किंवा कॉम्पुटर प्रोग्रामिंग ही एक अशी प्रक्रिया आहे…”. Kosh: “coding — संकेतन (न.)”, “programme — प्रायोजना (स्‍त्री.)” ⚠ प्रायोजना is dead on arrival. |
| 15 | automation | **स्वयंचलन** | `⚠ craft` | ❌ not found in the mathematics kosh (letter A verified). स्वयंचलित is common Marathi; स्वयंचलन is a regular derivation. |
| 16 | bias | **पूर्वग्रह** (social) / अभिनती (statistical) | `⚠ craft` | Unverified. पूर्वग्रह is right for *algorithmic bias* in an educational sense. ⚠ **The two senses must not be merged — flag for native review.** |
| 17 | probability | **संभाव्यता** | `official` | गणितशास्त्र कोश: “n. संभाव्यता (स्‍त्री.)”. Official and in ordinary use. |
| 18 | natural language processing | **नैसर्गिक भाषा प्रक्रिया** | `attested` | mr.wiki category title; media glosses “नॅचरल लँग्वेज प्रोसेसिंग म्हणजे नैसर्गिक भाषेवरील प्रक्रिया”. |
| 19 | language model | **भाषा प्रतिमान** / लँग्वेज मॉडेल | `⚠ craft` | Unattested. Composed from #8 प्रतिमान (`official`) + भाषा. |

**Supporting official terms** for building compounds (all `official`, गणितशास्त्र परिभाषा कोश):
`network — जालव्यूह (न.)` · `node — गाठबिंदु (पु.)` · `computation — संगणना (स्‍त्री.)` ·
`calculation — परिगणन (न.)` · `pattern — सूत्रबंध (पु.)` · `mapping — प्रतिचित्रण (न.)` ·
`nonlinear — अरेषीय`.

Project coinages (class **C1**) keep their original spelling in Marathi text and are owned by the term
sheet, not this table.

### 6.5 Where loanwords win, where they must not, and the unstable middle

**Loanwords win outright** for software artifacts and named techniques. One Marathi Wikipedia lead
sentence carries three transliterations:

> “संगणक आज्ञावली किंवा कॉम्पुटर प्रोग्रामिंग ही एक अशी प्रक्रिया आहे की ज्यामुळे कॉम्प्युटिंग
> समस्येचे निष्पादन करण्यायोग्य कॉम्प्यूटर प्रोग्रॅमवर मूळ स्वरूपाचे होते.”
> — mr.wikipedia.org/wiki/संगणक_आज्ञावली

⚠ **Note the same loanword spelled three ways in one sentence** — कॉम्पुटर / कॉम्प्युटर / कॉम्प्यूटर.
**Marathi transliterations are not orthographically standardized.** The platform must fix its own
spellings in the term sheet or drift is guaranteed.

**Sanskritic coinage wins** in exactly three places; do **not** transliterate here:

- **संगणक** for *computer* — universal, official, in schoolbooks. कॉम्प्युटर is informal.
- **कृत्रिम बुद्धिमत्ता** for *AI* — settled across encyclopedia, Wikipedia, and press.
- **माहिती** (data-as-information) and **संभाव्यता** (probability) — ordinary vocabulary, no loanword
  competitor.

**The unstable middle — two terms needing an explicit project decision:**

| Concept | Competing renderings | Status |
|---|---|---|
| machine learning | यंत्र शिक्षण / मशिन लर्निंग / यांत्रिक प्रशिक्षण | **undecided — term sheet must choose** |
| data | माहिती / डेटा / विदा | **undecided — term sheet must choose** |

**Drift here is visible to readers.** Never mix विदा and डेटा on the same page.

### 6.6 Honest gaps

- ❌ **No official Marathi terminology exists for any AI/ML-specific concept** (§6.1). Rows 3, 7, 10,
  15, 16, 19 are craft and require native review.
- ⚠ **No mainstream Marathi newspaper could be fetched** — the research search budget was exhausted
  before those queries ran. Press usage rests on **one** Marathi policy-research outlet, labeled
  *media, not official*. Do not read this section as evidence of corpus breadth.
- ⚠ No Marathi Wikipedia article was located for *deep learning*, *dataset*, or *bias*.

Sources: <https://shabdakosh.marathi.gov.in/ananya-glossary/9> ·
<https://marathivishwakosh.org/60554/> · <https://marathivishwakosh.org/65622/> ·
<https://vishwakosh.marathi.gov.in/33903/> ·
<https://mr.wikipedia.org/wiki/कृत्रिम_बुद्धिमत्ता> · <https://mr.wikipedia.org/wiki/यंत्र_शिक्षण> ·
<https://mr.wikipedia.org/wiki/अल्गोरिदम> · <https://mr.wikipedia.org/wiki/संगणक_आज्ञावली> ·
<https://mr.wikipedia.org/wiki/संगणक_विज्ञान> · <https://mr.wikipedia.org/wiki/वर्ग:संगणकशास्त्र> ·
<https://mozilla-l10n.github.io/styleguides/mr/> *(community)* ·
<https://www.orfonline.org/marathi/research/challenge-of-artificial-intelligence75613>
*(media, not official — the single press data point)*

---

## 7. Idiom anti-patterns

> ⚠ **Entirely craft-tier — every one of the 14 rows below is authored, none is attested.**
> **No fetched source documents idiomatic Marathi renderings of English UI/educational stock phrases.**
> These are constructed from the register principles in §4, §6, and §9 — **proposals for a native
> reviewer to ratify, not findings.** The obvious source for a future round is the
> **महाराष्ट्र वाक्संप्रदाय कोश** idiom dictionary (§2), which was not consulted in this pass.

Prefer the idiomatic column; the calque column is the naive output to avoid.

| # | English | Idiomatic Marathi ✅ | Literal calque to avoid ❌ — and why | Provenance |
|---|---|---|---|---|
| 1 | Let's get started | **चला, सुरुवात करूया.** | चला, सुरू केलेले मिळवूया — "get" is auxiliary here, not मिळवणे ("obtain"); the calque is nonsense. | `⚠ craft` |
| 2 | Try it yourself | **तुम्ही स्वतः करून पाहा.** | ते स्वतः प्रयत्न करा — प्रयत्न करणे takes an activity, not an object pronoun; Marathi drops "it". Natural frame is करून पाहणे. | `⚠ craft` |
| 3 | Step by step | **टप्प्याटप्प्याने** / पायरीपायरीने | पावलामागून पाऊल — पाऊल is a physical footstep; reads as walking, not staged instruction. | `⚠ craft` |
| 4 | Keep in mind | **लक्षात ठेवा.** | मनात ठेवा — means to keep something *to yourself* / harbor a feeling, not "remember this fact". | `⚠ craft` |
| 5 | In other words | **म्हणजेच** / थोडक्यात सांगायचे तर | इतर शब्दांत — इतर means "the remaining others" of a set; cannot mean "differently phrased". | `⚠ craft` |
| 6 | For example | **उदाहरणार्थ** (abbr. **उदा.**) | उदाहरणासाठी — -साठी marks purpose, turning an illustration into a stated goal. | `⚠ craft` |
| 7 | Learn more | **अधिक माहिती** / सविस्तर वाचा | अधिक शिका — as a link label this is an imperative to go study more; reads as a rebuke. | `⚠ craft` |
| 8 | Under the hood | **आतमध्ये काय घडते** / पडद्यामागे | बोनेटखाली — the car-hood metaphor does not exist in Marathi; reads as a literal car part. | `⚠ craft` |
| 9 | Rule of thumb | **ढोबळ नियम** / सर्वसाधारण नियम | अंगठ्याचा नियम — "the thumb's rule" is meaningless; carries none of the "approximate heuristic" sense. | `⚠ craft` |
| 10 | Trial and error | **चाचणी आणि चुकांतून शिकणे** / प्रयत्न-चुका पद्धत | खटला आणि चूक — खटला is a *court* trial; converts an experimental method into litigation. | `⚠ craft` |
| 11 | The bottom line | **थोडक्यात सांगायचे तर** / सारांश असा | तळाची ओळ — literally "the line at the bottom"; describes page layout, not a conclusion. | `⚠ craft` |
| 12 | Coming soon | **लवकरच येत आहे** | थोड्याच वेळात येत आहे — implies minutes away; over-promises on a roadmap. | `⚠ craft` |
| 13 | You're all set | **सगळी तयारी झाली!** | तुम्ही सर्व सेट आहात — "set" as सेट means "arranged/positioned"; says the *user* has been installed. | `⚠ craft` |
| 14 | Good to know | **हे माहीत असणे उपयोगी** / जाणून घ्यायला हरकत नाही | माहीत असणे चांगले — reads as a moral judgment ("it is virtuous to know"), not a low-stakes aside. | `⚠ craft` |

**Cross-cutting register notes** (`⚠ craft`):

- **Imperatives:** use the **polite plural** (**करा, पाहा, वाचा**), not the familiar singular — the
  -आ plural is the neutral instructional register for a public audience, and it is consistent with the
  **तुम्ही** decision in §4.2.
- **Inclusive "let's":** the **-ऊया** form (**करूया, पाहूया, शिकूया**) is the natural rendering of the
  English hortative — warm without being informal. Use it for section openers. It pairs with **आपण**
  (§4.4), never with आम्ही.
- **Avoid the administrative imperative** (करण्यात यावे, नोंद घ्यावी) in instructional copy — correct
  but bureaucratic (§8, §9).

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: **none.** No fetched source documents idiomatic Marathi equivalents of these stock phrases;
every row is authored, not attested. The register judgments draw on
<https://mr.wikipedia.org/wiki/मराठी_लेखन_नियम> (loanword-spelling rule) and
<https://mr.wikipedia.org/wiki/संगणक> (the gloss pattern), but **the renderings themselves require
native-speaker review before use.**

---

## 8. Simplified-language pendant (`mr-easy`)

### 8a. ❌ No codified Marathi plain-language standard was located

**What was searched, which bodies would hold such a standard, and what came back.**

| Checked | Why it would hold the standard | Result |
|---|---|---|
| The **plain-language survey** of national laws and standards | it enumerates the jurisdictions that legislate or standardize plain language | ❌ the jurisdictions it names are the United States, Canada, the United Kingdom, France, Germany, Israel, and the European Union, plus **ISO 24495-1:2023**. Asked directly, the fetch returned: **“Marathi: Does not appear. India: Does not appear.”** |
| The **easy-read survey** | it lists the languages in which easy-read guidance exists | ❌ it carries **eleven language editions** — Catalan, Czech, Spanish, Basque, Finnish, French, Galician, Korean, Portuguese, Russian, Swedish — and **Marathi, Hindi, and India appear nowhere in it** |
| **महाराष्ट्र राज्य मराठी विश्वकोश निर्मिती मंडळ**, the state encyclopedia board | it publishes the only state-run *graded* Marathi prose that exists (§8c) | ⚠ **it defines an audience, not a language rule**: “९ वी ते १२ वी या इयत्तांचे विद्यार्थी म्हणजे सर्वसाधारणपणे १४ ते १८ वयोगटातील मुले-मुली हा कुमार विश्वकोशाचा वाचकवर्ग अभिप्रेत आहे.” Nothing on that page states that the *language* of the teen edition is governed by rules |
| **GIGW** — Guidelines for Indian Government Websites and Apps | it is India's national web-content guideline, and its issuing bodies are named on the page: the **National Informatics Centre (NIC)**, the **STQC Directorate**, and **CERT-In** | ⚠ the Introduction page reached carries **no** plain-language, readability, or reading-level rule, and the guideline PDF 404'd at the URL tried. **Not established either way** |
| Marathi **disability, health-literacy, and नवसाक्षर** (neo-literate) publishers | that is where an easy-read tradition would most plausibly live | ⚠ **not swept** — a search-solvable gap, not a real-world absence |

**➜ Stated at the strength the evidence supports.** ❌ **No named, rule-bound simplified register of
Marathi is in force**: two independent surveys of the field return India and Marathi as absent, and
the one state body that produces graded Marathi publishes the *edition* without publishing the
*rule*. ⚠ The three rows marked ⚠ stay open, and none of them changes the consequence: **for
`mr-easy` you are authoring a convention, not adopting one.** Say that to reviewers.

### 8b. The axis — तत्सम vs तद्भव/देशी, offered as a hypothesis

**Marathi's obvious readability axis is its word stratum**, and unlike most such axes it is
formally named and taught. The encyclopedic definition:

> “जे संस्कृत शब्द मराठी भाषेत जसेच्या तसे काहीही बदल न होता आले आहेत त्यांना ‘तत्सम शब्द’ असे
> म्हणतात.”
> — mr.wikipedia, तत्सम शब्द (community tier)

Its example list opens **“राजा, भूगोल, चंचू, पुष्प, परंतु, भगवान, कर, पशु, अंध, जल, दीप, पृथ्वी,
तथापि, कवि, वायु, भीती, पुत्र…”** and further contains **वृक्ष**, **कार्य**, **पत्र**, **ग्रंथ** and
**आकाश**. **Four of the words this section goes on to measure — वृक्ष, परंतु, तथापि, कार्य — are on
that list by name**, which is why the axis is worth measuring rather than assuming.

Against the तत्सम pole sit the **तद्भव** words (Sanskrit inherited *with* change) and the **देशी**
words. The state encyclopedia's own entry on the देशीनाममाला defines the देशी class by exclusion:

> “ज्या शब्दांची व्युत्पत्ती व्याकरणाने सिद्ध करता येत नाही, संस्कृत कोशात जे शब्द सापडत नाहीत …
> अशा देशी शब्दांचे संकलन या कोशग्रंथात केले आहे”
> — मराठी विश्वकोश, देशीनाममाला (state-published encyclopedia)

⚠ **The classification is contested at the exact word this section turns on.** A Marathi grammar
site puts **झाड** in the देशी class — “जे मूळ महाराष्ट्रातील बोलीभाषेतले आहेत” — alongside ओटा,
डोंगर, बाजरी, गुडघा (community tier). An open collaborative dictionary derives the *same* word from
Sanskrit: **“Inherited from Old Marathi … from Maharastri Prakrit … from Sanskrit झाट (jhāṭa).”**
**If the two traditions cannot agree whether झाड is native or inherited, a translator sorting words
by how Sanskritic they look is not applying a criterion — they are guessing.** That is the whole
reason §8c counts instead of asserting.

**A second axis is already established elsewhere in this guide and needs no new evidence:** Marathi
is **SOV and head-final**, so participial chains stack *before* the verb and the reader carries all
of them to the end of the sentence (§4.1, §4.6). §8c measures that one too.

### 8c. Measuring both axes — the state encyclopedia's own two editions

**The design controls for publisher, variety, and subject matter at once.** The Maharashtra state
encyclopedia board runs two editions on one CMS: the adult **मराठी विश्वकोश** and the teen
**कुमार विश्वकोश** for 14-to-18-year-olds (§8a). Sampling the *same subject areas* from both gives a
register contrast with the topic held roughly fixed — the failure mode that makes most such
comparisons useless.

| Corpus | What it is | Size |
|---|---|---|
| **Teen** | **कुमार विश्वकोश**, categories वनस्पती (plants) and प्राणी (animals) | **768 articles, 342,066 Devanagari word tokens** |
| **Adult** | **मराठी विश्वकोश**, the matching adult categories वनस्पतिविज्ञान (botany) and प्राणिविज्ञान (zoology) — **same board, same site, same CMS** | **316 articles, 166,275 Devanagari word tokens** |
| **Cross-check** | mr.wikipedia `insource:` **page** counts — a volunteer corpus with a completely different contributor base, reported as pages containing the string, **not** as token frequencies | ~100k articles |

Both corpora were pulled through the site's own content API in July 2026, stripped of markup and
figure captions, and tokenized on letter-plus-combining-mark runs; **only tokens containing a
Devanagari letter were counted**, so URLs, Latin references, and English names are excluded.
Frequencies below are **per 100,000 Devanagari word tokens**; raw counts are given so a reader can
judge how thin a row is.

> ⚠ **Five caveats that travel with every number here.**
>
> 1. **One publisher, two editions.** That is the design, not an oversight: it makes a difference a
>    *register* difference. It also means **nothing here is established for Marathi journalism,
>    textbooks, or spoken usage** except where the cross-check agrees.
> 2. **Topic is controlled, not eliminated.** The adult botany/zoology articles run more towards
>    molecular biology than the teen ones do. Rows built on content words (organs, taxa) are
>    therefore excluded on principle; what is tabled is register-ish and function-ish vocabulary.
> 3. **Stem matching over-collects.** Every row below was re-checked against its actual token forms,
>    and pairs whose stems collided with unrelated words were **dropped, not reported** — जल (which
>    catches जलद *fast*), दंत (दंतुर, दंतिन) and काम (कामकरी, कामगंध) were all discarded this way.
> 4. **A teen encyclopedia is not a plain-language corpus.** It is written by adult specialists for
>    schoolchildren. It is the closest reachable analog in Marathi; no plain-language corpus exists
>    (§8a).
> 5. **Frequency is not comprehension.** These rows say which word the teen-facing register *uses*.
>    No Marathi comprehension study was located.

#### 8c-i. Sentence architecture — the one number this section can actually give `mr-easy`

Splitting both corpora on sentence-final punctuation and counting Devanagari tokens per sentence:

| | Teen edition | Adult edition |
|---|---|---|
| sentences measured | **37,142** | **15,427** |
| **mean words per sentence** | **9.1** | **10.7** |
| median | **8** | **10** |
| 75th / 90th percentile | **12 / 16** | **13 / 18** |
| sentences ≤ 15 words | **90.0 %** | **83.2 %** |
| sentences > 25 words | **0.9 %** | **2.6 %** |

**➜ This replaces the borrowed figure the previous edition of this guide carried.** The earlier
10–16-word target was taken from international easy-read practice and flagged as *not a Marathi
norm*. It no longer has to be: **in the state's own teen edition the median sentence is 8 words and
90 % of sentences are 15 words or shorter.** `mr-easy` therefore targets **≤ 15 words per sentence,
median around 8–10**, and treats anything past 25 words as a defect — a threshold the teen edition
crosses in fewer than 1 % of its sentences. ⚠ It is a description of one publisher's practice, not a
prescription anybody issued.

#### 8c-ii. Formal → everyday, where the measurement supports the swap

| Formal / तत्सम | Everyday | Teen per 100k (raw) | Adult per 100k (raw) | Cross-check (mr.wikipedia pages) | Verdict |
|---|---|---|---|---|---|
| **आवश्यक** | **गरजेचे / गरज** | 32.4 (111) vs गरज- 31.9 (109) | 141.9 (236) vs गरज- 36.7 (61) | आवश्यक 2,801 / गरजेचे 317 | ✅ **strongest row in the table** — आवश्यक is 4.4× commoner in the adult edition while गरज- is flat. ⚠ the wiki leans formal here |
| **विविध** | **वेगवेगळे** | 96.8 (331) vs वेगवेगळ- 105.0 (359) | 227.3 (378) vs वेगवेगळ- 87.2 (145) | विविध 6,007 / वेगवेगळ्या 1,808 | ✅ the two words cross over between the editions — the cleanest crossing found |
| **प्रारंभ / आरंभ** | **सुरुवात** | 8.2 (28) vs सुरुवात 34.5 (118) | 22.9 (38) vs सुरुवात 37.3 (62) | प्रारंभ 566 / सुरुवात 8,111 | ✅ and the cross-check is emphatic: सुरुवात is on 14× as many wiki pages |
| **निर्मिती** | **तयार करणे** | 44.1 (151) vs तयार- 375.4 (1,284) | 126.3 (210) vs तयार- 360.8 (600) | — | ✅ निर्मिती nearly triples in the adult edition; तयार- does not move |
| **अत्यंत** | **खूप** | 11.4 (39) vs खूप 31.0 (106) | 53.5 (89) vs खूप 36.1 (60) | अत्यंत 2,714 / खूप 2,416 | ✅ in the corpora; ⚠ the wiki has them at near parity |
| **सुमारे** | **जवळपास** | 5.3 (18) vs जवळपास 12.0 (41) | 74.0 (123) vs जवळपास 11.4 (19) | सुमारे 5,238 / जवळपास 978 | ✅ 14× adult skew — and ⚠ **the cross-check disagrees outright**: the wiki prefers सुमारे 5:1. Treat as house style unless a reviewer confirms |
| **संपूर्ण** | **पूर्ण** | 20.2 (69) vs पूर्ण- 91.5 (313) | 40.9 (68) vs पूर्ण- 78.2 (130) | संपूर्ण 5,042 | ✅ modest but consistent |
| **अल्प** | **कमी** | 8.5 (29) vs कमी 172.8 (591) | 23.5 (39) vs कमी 221.3 (368) | — | ✅ अल्प is adult-only in practice |
| **सूक्ष्म** | **लहान** | 118.1 (404) vs लहान 337.4 (1,154) | 120.3 (200) vs लहान 193.7 (322) | सूक्ष्म 421 / लहान 3,874 | ✅ लहान carries the row — सूक्ष्म itself is flat, so this is *add लहान*, not *delete सूक्ष्म* |
| **शक्य** | *rephrase with a verb* | 21.6 (74) | 63.7 (106) | शक्य 1,117 | ✅ 3× adult skew; no everyday one-word substitute was found, so the fix is structural (§8f) |
| **सदृश** | **सारखा** | 0.6 (2) vs सारख- 39.5 (135) | 6.6 (11) vs सारख- 34.9 (58) | — | ⚠ **2 and 11 raw tokens.** A hint, not a finding |

#### 8c-iii. Where the teen edition simply drops the word rather than replacing it

**परंतु** falls from 192.5 (320) in the adult edition to 104.4 (357) in the teen one — but **पण does
not rise to meet it** (22.8 vs 20.4). The same holds for **देखील** (12.3 vs 93.8) and **सुद्धा** (2.3
vs 17.4): both additive particles are *adult* words, and the teen edition uses neither. **The teen
register's move is not substitution — it is one clause per sentence, with the connective deleted
rather than swapped.** That is a structural finding wearing a lexical disguise, and it is why §8f
ranks structure above vocabulary.

### 8d. 🔴 The do-NOT-simplify list — where the measurement contradicts the instinct

**This is the section's highest-value output.** Every row is a swap that “तत्सम is hard, native is
easy” recommends, and that the two editions refute.

| Do **not** do this | Why — with the numbers |
|---|---|
| ~~**वृक्ष** → **झाड**~~ | **The flagship reversal.** वृक्ष is on the तत्सम list by name (§8b) — and it is **the teen edition's word**: 299.6 per 100k (1,025 tokens) against 51.1 (85) in the adult edition, a **5.9× skew towards the younger readership**. Native-looking **झाड** is *flat* across both (132.1 vs 125.7). Read as a within-edition ratio it is starker still: the teen edition writes **2.3 वृक्ष for every झाड**, the adult edition **0.41** — the preference **inverts**. ⚠ The cross-check has them at parity (464 vs 427 wiki pages), which says the inversion is a property of these editions, not of Marathi at large — but it kills the swap either way |
| ~~**उपयोग** → **वापर**~~ | **The most tempting swap in Marathi, and it buys nothing.** Bare-noun forms: उपयोग 136.5 teen vs 131.7 adult; वापर 159.0 vs 126.9. **Both words are used at essentially the same rate by both editions.** The pair carries no register signal at all; spending review effort on it is waste |
| ~~**साहाय्य** → **मदत**~~ | Both are **adult**-skewed by almost exactly the same factor (साहाय्य- 31.3 → 63.7; मदत- 38.3 → 81.8), and the within-edition ratio barely moves (2.6 vs 2.4 in साहाय्य's favor in *both*). **The swap is not a register move in this publisher.** ⚠ The cross-check points the other way — मदत is on 2,402 wiki pages against साहाय्य's 177 — so मदत is the *general* Marathi word while साहाय्य is this board's house style. Use मदत because it is commoner, not because it is simpler |
| ~~stripping **सामान्यपणे** as bureaucratic~~ | It looks like exactly the Sanskritic adverb an easy-language pass would delete. It is **6.3× commoner in the teen edition than the adult one** — 83.6 per 100k (286 tokens) vs 13.2 (22). ⚠ And only 203 wiki pages carry it, so this is **very likely the teen edition's house cadence** rather than general plain Marathi. Either way: **the frequency evidence does not support deleting it**, and a reviewer should rule before anyone does |
| ~~**कार्य** → **काम**~~ | कार्य is on the तत्सम list, so the swap looks obligatory. Measured, **both words are adult-skewed** (कार्य- 93.0 → 241.8) and the काम stem is unusable as evidence because it collects कामकरी and कामगंध (§8c caveat 3). **No support for the row; it was dropped rather than reported.** |
| ~~adding **देखील** to sound conversational~~ | It is the **adult** edition's particle by 7.6× (12.3 vs 93.8). Reaching for it makes text read older, not plainer |
| ~~sorting words by how Sanskritic they look~~ | §8b: the grammar tradition files **झाड** as देशी, the etymological dictionary derives it from Sanskrit झाट through Prakrit. **The classification the instinct depends on is contested at its own example word** |

> **➜ The rule that follows.** In Marathi, **do not simplify by etymology.** The तत्सम member of a
> doublet is frequently the one the younger readership actually meets. Simplify by **sentence
> architecture** (§8c-i, §8f) and make a lexical swap only where §8c-ii measured one — never because
> a word looks Sanskritic.

### 8e. 🔑 The address decision — `mr-easy` keeps तुम्ही

> **Decision, recorded so nobody “fixes” it: `mr-easy` addresses the reader as तुम्ही, exactly as
> `mr` does. It does not drop to तू.**

- ✅ `mr` and `mr-easy` alike: **तुम्ही** · possessive **तुमचा / तुमची / तुमचे** · imperatives **करा · पाहा · वाचा**
- ❌ in either variant: **तू** · possessive **तुझा / तुझी / तुझे**

**Why, and the third point is the one that gets forgotten:**

1. **तू carries no comprehension benefit.** It is not a shorter, commoner, or earlier-learned word
   than तुम्ही; it is a *less respectful* one. Nothing about it makes a sentence easier to parse.
2. **`mr-easy` readers include adults with low literacy** — the audience for whom being addressed as
   तू by an institution reads as being spoken down to. **Informality is not simplicity.**
3. **Honorific agreement travels with the pronoun** (§4.2): choosing तुम्ही and then leaving a
   singular verb produces a register that is half-polite and jarring. If a reviewer changes the
   pronoun, every verb in the sentence changes with it — which is precisely why this is decided once
   and written down.

⚠ **The corpus cannot settle this and does not pretend to.** Direct address is essentially absent
from both editions — **तुम्ही occurs 0 times in the 342,066-token teen corpus and once in the adult
one**; तू occurs once and zero times respectively. **An encyclopedia does not address its reader**,
so this decision rests on §4.2's reasoning and on the kit's general finding, not on measurement. It
also means a native-reviewer ruling is worth more here than anywhere else in §8.

**And the same inversion the other language guides record applies:** `mr-easy` should use **more**
explicit address than `mr`, not less. Where the base variant drops the pronoun for flow, the easy
variant says **तुम्ही** outright. ⚠ Craft, derived from the kit's base rules — no Marathi source
attests it.

### 8f. What `mr-easy` is built on — in order of leverage

**1 — Sentence architecture. This is the main lever and the only one with a measured target.**

- **One idea per sentence; ≤ 15 words, median 8–10** (§8c-i). Overrides nothing in
  [accessibility-workflow](../accessibility-workflow.md) — it *instantiates* the base rule with a
  Marathi number the base rules could not supply.
- **Break participial chains rather than nesting them.** Marathi is head-final: …करत असताना,
  …केल्यामुळे, …असल्याने all stack before the verb and the reader holds every one of them until the
  end. Prefer **finite verbs**, two sentences over one.
- **Delete the connective, do not swap it** (§8c-iii). Splitting into two sentences is what the teen
  register actually does; replacing परंतु with पण is what it does *not* do.
- **Prefer active over passive:** ❌ करण्यात येते → ✅ करतो / होते.
- **Do not copy the administrative register** — सदर, उपरोक्त, प्रस्तुत, अनुषंगाने, सबब signal a
  government circular, not a lesson.

**2 — Morphology and compounding, second in leverage.**

- **Do not build heavy Sanskrit compounds.** ❌ **माहिती-प्रक्रिया-प्रणाली-विकसन** is grammatical and
  unreadable → ✅ **माहितीवर प्रक्रिया करणारी प्रणाली तयार करणे**.
- **Unwind nominalizations into verbs** — this is what §8c-ii's निर्मिती → तयार करणे row really is,
  and it is why शक्य has no one-word replacement: rephrase the clause instead.

**3 — Vocabulary, last and smallest.** Use §8c-ii's eleven measured rows and nothing beyond them.
**Rows not in that table were not measured, and §8d is the record of what happens when they are.**

**Term-preservation rule (restated, binding).** In `mr-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Keep **कृत्रिम बुद्धिमत्ता**, then a “म्हणजे…” clause, then a
concrete example. For an AI platform specifically: कृत्रिम बुद्धिमत्ता is current and should be
**primary**; **यंत्र शिक्षण** carries a first-use gloss (मशिन लर्निंग); **डेटा** beats विदा in running
text. This is distinct from §8c-ii, which targets non-technical vocabulary. **The permission
structure is §6.3's and is sourced there:** the reference register itself glosses its Sanskritic
coinages with the English loanword — “संगणक (कॉम्प्युटर)”, “संकेतस्थळ (इंग्लिश: Website, वेबसाइट)”,
“विदा (इंग्रजी: Data - डेटा किंवा डाटा)”.

### 8g. What is still open

1. **The two ⚠ rows in §8a.** Has GIGW's full text a plain-language clause? Do Marathi disability,
   health-literacy, or नवसाक्षर publishers maintain an easy-read house rule? Both are search-solvable
   and neither was swept.
2. **Is the measurement a Vishwakosh house style or a Marathi register fact?** The cross-check
   already disagrees on two rows (सुमारे, साहाय्य) and flags सामान्यपणे as board-specific. **A second
   publisher pair — a newspaper and its children's supplement — would settle it**, and none was
   built here.
3. **वृक्ष and झाड need a native ruling.** The measurement says the तत्सम word is the teen-facing one;
   the cross-check says the two are at parity. Nobody should ship a rule on either word until a
   native editor has looked at the two editions side by side.
4. **No comprehension evidence exists for Marathi at all** — every number in §8c is a frequency, and
   frequency is a proxy. If a Marathi readability study or graded word list is ever located, §8c-ii
   should be re-derived from it.
5. **The address decision is unmeasured** (§8e) and rests on reasoning. It is the single most
   valuable question to put to a native reviewer.
6. **Sentence-length figures cover encyclopedic prose only.** Instructional prose — imperatives,
   second person, step lists — is a different genre and was not measured.

Sources: <https://en.wikipedia.org/wiki/Plain_language> · <https://en.wikipedia.org/wiki/Easy_read> ·
<https://guidelines.india.gov.in/introduction/> (GIGW issuing bodies; **no plain-language rule on the
page reached** — the guideline PDF 404'd) ·
<https://mr.wikipedia.org/wiki/तत्सम_शब्द> (community tier — the तत्सम definition and example list,
quoted verbatim) · <https://marathivyakaran.com/शब्दसिद्धी/> (community tier — the देशी class and its
examples) · <https://en.wiktionary.org/wiki/झाड> (community tier — the competing Sanskrit etymology) ·
<https://marathivishwakosh.org/34762/> (मराठी विश्वकोश, देशीनाममाला — state-published) ·
<https://marathivishwakosh.org/kv/> (कुमार विश्वकोश readership statement, quoted verbatim) ·
**Teen corpus** — 768 articles of कुमार विश्वकोश, categories वनस्पती and प्राणी, via
<https://marathivishwakosh.org/wp-json/wp/v2/posts?categories=3650,3651> ·
**Adult corpus** — 316 articles of मराठी विश्वकोश, categories वनस्पतिविज्ञान and प्राणिविज्ञान, via
<https://marathivishwakosh.org/wp-json/wp/v2/posts?categories=36,51> ·
**Cross-check** — `insource:` page counts via
<https://mr.wikipedia.org/w/api.php?action=query&list=search&srsearch=insource:%22%E0%A4%B5%E0%A5%83%E0%A4%95%E0%A5%8D%E0%A4%B7%22&srinfo=totalhits>
· <https://mr.wikipedia.org/wiki/मराठी_लेखन_नियम> and <https://mr.wikipedia.org/wiki/संगणक> (the §6.3
gloss pattern restated in §8f) · [accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md) — **not reached:** Marathi disability /
neo-literate publishers, the GIGW guideline PDF, StoryWeaver `/reading-levels` (403), `mahasamvad.in` (403)

---

## 9. Regional variation

**(Reasonably strong — verbatim quotes for the standard-language origin, five dialects, the Konkani
boundary and the Goa/Belgaum situation. The Hindi-interference *specifics* in §9.4 are the weak part
and are marked.)**

### 9.1 प्रमाण मराठी — the standard, and where it came from

Standard Marathi has a documented Pune-elite origin — this is not folklore:

> “They consulted Brahmins of Pune for this task and adopted the Sanskrit dominated dialect spoken by
> the elite in the city as the standard dialect for Marathi.”
> — en.wikipedia.org/wiki/Marathi_language

The Marathi-language encyclopedia says the same from the inside:
“प्रमाण मराठीतील पुणेरी मराठी बोली ही ज्यास्तीत ज्यास्त व्याकरणशुद्ध म्हणून ओंळखली जाते”
(mr.wikipedia — मराठी भाषा).

Two consequences worth encoding:

1. **Standard Marathi is Sanskrit-heavy by design.** Its prestige register **drifts formal
   automatically** — counteracting that drift is a deliberate editorial act, not laziness.
2. **The written standard is a print/academic standard, not a speech standard:** “Standard Marathi is
   based on dialects used by academics and the print media.” **Nobody's home speech *is* प्रमाण
   मराठी** — including in Pune.

Orthography is separately ratified (1972, §8.2a), so for web content there **is** a real right-and-wrong
for spelling.

### 9.2 The main varieties

| Variety | Region | Notes |
|---|---|---|
| **वऱ्हाडी / वैदर्भी** (Varhadi/Vaidarbhi) | Western Vidarbha — “बुलढाणा, वाशीम, अकोला, यवतमाळ, अमरावती आणि वर्धा या सहा जिल्ह्यांतून वऱ्हाडी बोलली जाते.” | Carries **literary prestige**: “म्हाइंभट यांचा 'लीळाचरित्र' हा मराठीतील पहिला गद्यग्रंथ वऱ्हाडी बोलीत लिहिला गेला” — *the first Marathi prose work is in Varhadi.* ➜ **Dialect ≠ substandard**; the reason to avoid it in web copy is **reach**, not quality. |
| **अहिराणी / खानदेशी** (Ahirani/Khandeshi) | Northwest — “जळगाव जिल्हा, धुळे, नंदुरबार, नाशिक ते मध्य प्रदेशातील बऱ्हाणपूर…” | ⚠ **Contested as to whether it is Marathi at all** — Khandeshi is classified as a *Western* Indo-Aryan language, “1.86 million” speakers (2011). Naming is politically live: “'Ahirani' and 'Khandeshi' are sometimes used interchangeably: Ahirani as the caste-based name (after Ahirs), and Khandesh as the region-based name.” |
| **मालवणी** (Malvani) | South Konkan — “दक्षिण रत्‍नागिरी आणि सिंधुदुर्ग जिल्ह्यात बोलली जाणारी ही बोली आहे.” | Classified as “a dialect of Konkani with significant number of loanwords from Marathi”. Culturally salient (“दशावतार या नाट्याचे सादरीकरण या भाषेतच केले जाते”) but **highly marked in writing**. |
| **झाडीबोली** (Zadi Boli) | Far-eastern Vidarbha — Gondia, Bhandara, Chandrapur, Gadchiroli, parts of Nagpur | “मराठीतील 'ण, छ, श, ष' ही व्यंजने झाडीबोलीत वापरली जात नाहीत”. ➜ Not a reason to change written content, but **a reason not to build phonetic/dictation exercises assuming those contrasts.** |
| **नागपुरी** | Nagpur region | The variety with explicit Hindi contact: “तसेच हिंदी शब्दांचाही प्रभाव आढळतो.” |
| **मराठवाडी** | Marathwada | ⚠ **Unverified — no fetched source** describes a distinct written Marathwada variety. Treat as a real folk-linguistic label whose written features could not be attested. |
| **तंजावर मराठी** and southern diaspora | Tamil Nadu, Telangana, north Kerala | “Thanjavur Marathi …, Namadeva Shimpi Marathi, Arey Marathi (Telangana), Kasaragod (north Kerala) and Bhavsar Marathi are some of the dialects of Marathi spoken by many descendants of Maharashtrians who migrated to Southern India.” |

*(Typographic note: the dialect name **वऱ्हाडी** is spelled with **U+0931 ऱ** as its sources spell it.
That is a source-verbatim spelling, **not** an eyelash reph — see §3.3 and the §11 check.)*

### 9.3 The Konkani boundary — separate language, politically sensitive

- The dispute traces to an 1807 essay that called Konkani “a 'dialect of Maharashtra.'”
- **Settled in 1975:** a Sahitya Akademi expert committee concluded that “Konkani was indeed an
  independent and literary language, classified as an Indo-European language.”
- Official language of Goa from 1987; added to the Eighth Schedule in 1992.

> **➜ Guide rule: never describe Konkani as a form of Marathi** — not in body text, not in tooltips,
> not in language-picker grouping. Konkani is a separate entry.

Note the internal tension: **Malvani is classified as a Konkani dialect while being spoken in a
Maharashtra district and heavily Marathi-influenced.** Do **not** try to resolve that in UI copy;
simply avoid asserting either direction.

### 9.4 The Marathi–Hindi boundary

**Where they contact:** the northern and eastern edges. Nagpuri Marathi shows direct Hindi lexical
influence (“तसेच हिंदी शब्दांचाही प्रभाव आढळतो.”); the Khandeshi/Ahirani belt runs continuously into
Madhya Pradesh (“…नाशिक ते मध्य प्रदेशातील बऱ्हाणपूर…”).

**Why it is a risk for *written* Marathi specifically:** Marathi and Hindi share Devanagari and a
large Sanskrit-derived vocabulary, so **a Hindi-ism is visually invisible** — it does not look foreign
the way an English word does (§4.7).

Typical failure modes (`⚠ craft` — extrapolated from the shared-script facts, **not** from a fetched
contrastive study):

- Hindi postposition/case habits bleeding in (के लिए-shaped constructions instead of Marathi
  **साठी**).
- Hindi lexical substitutions where Marathi has its own word — ❌ ज़रूरत / ज़्यादा for ✅ **गरज** /
  **जास्त**.
- Hindi verb-formation and honorific patterns, which do not map onto Marathi's (§4.2).
- **Nukta dots (ज़, फ़, ख़) that are normal in Hindi orthography and out of place in standard Marathi**
  — a cheap automated check (§11).

⚠ **Sourcing gap, reported honestly:** all three academic sources on Hindi–Marathi contact were
unusable (an MP-region study PDF downloaded as unreadable binary; an Indori-Marathi study returned
403; an eastern-Vidarbha phonology paper was not obtainable). **Only the general fact of Hindi
influence on Nagpuri Marathi is attested; the specific documented borrowing inventory is unverified.**

### 9.5 Marathi outside Maharashtra

- **Goa.** The 1987 Official Language Act establishes “Konkani in the Devanagari script” as official,
  while “Marathi may also be used for all or any of the official purposes.” Marathi speakers are
  ~**10.9%** of Goa's population (2011), second to Konkani at 66.1%.
- **Karnataka border (Belgaum/Belagavi).** Maharashtra claims “865 disputed villages” plus “Belgaum
  city”, “Nippani, Khanapur and Nandgad” and others; 1951 figures cited “Belgaum city: 60%” Marathi
  speakers. After the 1956 States Reorganization Act, “Belgaum—because of its Kannada plurality—was
  incorporated into the newly formed state of Karnataka”.
  > **➜ Guide rule: this is an active political dispute.** Never render Belgaum/Belagavi as "in
  > Maharashtra" or "in Karnataka" in a way that reads as a claim, and avoid maps that take a side.
- **Madhya Pradesh and beyond.** The Khandeshi/Ahirani belt reaches Burhanpur; Marathi is also spoken
  in parts of Gujarat, Telangana, Tamil Nadu, and north Kerala.

### 9.6 The neutrality strategy — what neutral web Marathi looks like

1. **Write standard प्रमाण मराठी in Devanagari, per the 1972-ratified writing rules.** It is the only
   variety with statewide + out-of-state reach and a settled orthography.
2. **Zero dialect markers.** No Varhadi/Ahirani/Malvani verb endings, pronouns, or particles — not
   because they are lesser (the first Marathi prose book is Varhadi) but because each marker excludes
   most readers.
3. **But do NOT over-Sanskritize in the name of "standard."** The Pune-elite origin means the default
   drift is toward a Sanskrit-dominated register. **Neutral ≠ maximally tatsama.** Aim at the register
   of a **well-edited Marathi newspaper or textbook**, not the परिभाषा कोश.
4. **Accept the English-loanword register urban readers actually use** — कॉम्प्युटर, मोबाईल, वेबसाइट,
   डेटा, ऑनलाइन, फाइल — and **spell them phonetically** (§8.2a). The reference literature does this
   itself (§8.4 rows 1–4).
5. **Guard the Hindi border, not the English one.** English loanwords are visible and self-correcting;
   **Hindi-isms are invisible in shared script.** Put Hindi-interference checks in the review pass,
   not English-loanword purges.
6. **Guard the Konkani border politically.** Separate language, separate entry, never grouped under
   Marathi.

Sources: <https://en.wikipedia.org/wiki/Marathi_language> ·
<https://en.wikipedia.org/wiki/Marathi_dialects> · <https://en.wikipedia.org/wiki/Ahirani_language> ·
<https://en.wikipedia.org/wiki/Malvani_language> · <https://en.wikipedia.org/wiki/Konkani_language> ·
<https://en.wikipedia.org/wiki/Belgaum_border_dispute> ·
<https://en.wikipedia.org/wiki/Languages_of_Goa> ·
<https://mr.wikipedia.org/wiki/मराठीतील_बोलीभाषा> · <https://mr.wikipedia.org/wiki/मराठी_भाषा> ·
<https://mr.wikipedia.org/wiki/मराठी_लेखन_नियम>

---

