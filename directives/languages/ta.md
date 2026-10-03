<!-- base -->
# lang-ta — Tamil (தமிழ்) — language guide

> **Setup & sources live in [`ta.setup.md`](ta.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** தமிழ் / Tamil.
**BCP 47 code (base):** `ta`.
**BCP 47 code (simplified variant):** `ta-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would need a private-use subtag
(`ta-x-simple`); the kit token `ta-easy` is the one that counts here, and there is **no registered
BCP 47 subtag for simplified language** in any case.
**Speaker reach:** ⚠ **one component is census-traceable, the headline total is not.** The
**2011 Census of India** figure reproduced by the English-language encyclopedia is
**69,026,881 mother-tongue speakers (5.70 % of India's population)**, plus 6,668,000 L2 and 900,985
L3. **Sri Lanka:** Sri Lankan Tamils **2,270,924 — 11.2 % of the population** (2012 census).
**Singapore:** ~36.7 % of Indian Singaporeans reported Tamil as the language most frequently spoken
at home (2010, down from 42.9 % in 2000), "just above 4 %" of the overall population.
**Malaysia:** no speaker figure obtained; **543 primary government schools use Tamil as the medium
of instruction**. The commonly quoted global aggregate — **L1 79 million, L2 7.6 million, total
86 million** — is a paywalled ethnological database reproduced by an encyclopedia infobox and was
**not fetched**. **Do not present "86 million" as census-derived.** The defensible sentence is:
*roughly 69 million mother-tongue speakers in India per the 2011 census, plus substantial
populations in Sri Lanka, Singapore and Malaysia and a global diaspora; commonly aggregated at
~79–86 million.*
**Official status:** official language of **Tamil Nadu** (and the first language recognized as a
classical language in India) and of **Puducherry**; **co-official and national language of
Sri Lanka** alongside Sinhala; **one of the four official languages of Singapore**; a **recognized
minority language in Malaysia**. All five statements are community-tier.
**Script + direction:** **Tamil script** — an abugida, Unicode block **U+0B80–U+0BFF**,
**left-to-right**, **whitespace-separated words**, no shaping-free shortcut: vowel signs reorder
around their consonant at render time.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `ta` and the `ta-easy` pendant. Per the authoring directive's "second set of
eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.

**Section strength at a glance** (read this before trusting any one section):

| Section | Strength | Resting on |
|---|---|---|
| §2 Authorities | **Honest ⚠ — a map of who exists, not of what they mandate** | Every Tamil Nadu government host failed at the network layer; **both official terminology glossaries were located and could not be retrieved** |
| §3 Script & typography | **Strong — the guide's center of gravity**, ⚠ except §3i and §3l | The Unicode character database parsed by codepoint range, the Unicode core specification §12.6 extracted locally, UAX #29, the Unicode Tamil FAQ — **but §3i (hyphenation) rests on two sources that contradict each other, and §3l (romanization) on no Tamil-specific source at all** |
| §4 Grammar | **Mixed** — single-sourced from a community grammar; register is **measured** | One community grammar reference; a 31,450-character register census over instructional Tamil |
| §5 Numbers/dates/currency | **Strong, and it carries three separate live bugs** | Raw CLDR locale XML for `ta`, `ta_LK`, `ta_SG`, `ta_MY` and `root`, parsed locally — **except the two counts in §5b and §5g, which come from the volunteer news corpus (§2c)** |
| §6 Terminology | **🔴 Observed usage only — no official prescription was retrieved** | A live encyclopedia and news corpus fetched through an API that preserves exact codepoints |
| §7 Idioms | **Deliberately half-empty** — strategy supplied, Tamil column **not** invented | The sourced diglossia and morphology facts; no Tamil idiom reference was reachable |
| §8 `ta-easy` | **Measured** — ⚠ still no Tamil plain-language standard | A learner/adult register contrast (94,383 word tokens) over the student and news editions of one Singapore Tamil daily, an encyclopedia cross-check, and dictionary-attested etymologies; **the measurement contradicts the naive Sanskrit→native swap** (§8b-iii) |
| §9 Regional variation | **Strong on the written/spoken split; ⚠ silent on caste-marked vocabulary** | Dialect articles; one Official-tier typographic divergence; the caste axis is sourced as *live*, not as a word list |

**Easy or hard for this kit:** Tamil is **mechanically demanding but unusually well-documented**,
and it comes with one genuine piece of good news that no other Indic language in this kit has.
(1) **Normalization helps here.** Tamil's two-part vowels are **not** composition exclusions and
round-trip cleanly under NFC — unlike the Marathi eyelash-reph and the Punjabi nukta, **NFC repairs
Tamil rather than damaging it** (§3d). (2) But **visual position is not string index**: three vowel
signs render *before* their consonant and three more *surround* it, while all of them are stored
*after* it, so every truncation, ellipsis, first-letter highlight, and per-character animation must
work on grapheme clusters (§3c). (3) The **puḷḷi is U+0BCD and never U+0B82** — the standard itself
warns about the confusion, and the research fetch layer walked straight into it (§3e). (4) **Numbers
carry three independent traps**, two of which split by country (§5). (5) And the **terminology
section is observation, not prescription** — both official glossaries were located and neither could
be read (§2b, §6).

Sources: <https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers_in_India> ·
<https://en.wikipedia.org/wiki/Sri_Lankan_Tamils> · <https://en.wikipedia.org/wiki/Languages_of_Singapore> ·
<https://en.wikipedia.org/wiki/Tamil_language> · <https://en.wikipedia.org/wiki/Tamil_Nadu>

---

## 1. Header block

See above. One-line orientation: Tamil is a **Dravidian, SOV, agglutinative, article-less** language
written in an abugida whose vowel signs reorder around the consonant — so nothing English encodes by
word order or by function words survives the crossing intact, and nothing a naive string routine
assumes about "the first character" survives either.

Two structural facts govern every decision in this guide, and they are worth stating before any
rule:

- **Tamil is diglossic, and this platform writes the high variety.** The formal literary register
  **செந்தமிழ்** (*Senthamizh*) is the language of textbooks, media, and public writing; the spoken
  varieties, collectively **கொடுந்தமிழ்** (*Kodunthamizh*), are the language of the home. Children
  grow up speaking only the low variety and **meet the formal one in school**. Writing formal Tamil
  is therefore not a stiffness choice — it is the only register the reader has ever *read* (§4a).
- **"Neutral Tamil" is a cross-border problem, not a dialect-leveling problem.** Tamil is
  simultaneously an Indian state language, a co-official national language of Sri Lanka, and an
  official language of Singapore. The reassuring part is sourced: the **written** standards across
  these countries differ minimally, while the **spoken** varieties differ considerably (§9a). The
  formal written register is what makes one Tamil variant serve four countries — and the splits with
  **real code impact are number formatting and clock conventions** (§5), not sentence construction.
  ⚠ Spelling and vocabulary do vary by country too (grantha-free month names §5g; the India-only
  scale words §9a) — those are consistency questions, not correctness ones.

Sources: <https://en.wikipedia.org/wiki/Diglossia> · <https://en.wikipedia.org/wiki/Tamil_language> ·
<https://en.wikipedia.org/wiki/Sri_Lankan_Tamil_dialects>

---

## 4. Grammar for translators

> ⚠ **Tier caveat for the whole section.** No academic or official Tamil grammar was reachable.
> Everything below except the register census is **single-sourced from a community grammar
> reference** and is offered as **orientation for translators, not as prescriptive grammar**. Per
> the authoring directive's correct-form-only rule, this section gives **sourced correct forms** and
> **does not invent "common errors"** to pair with them; where a contrastive pair would otherwise
> require fabricated Tamil, the gap is flagged instead.

**Word order — SOV:**

> **"Except in poetry, the subject precedes the object, and the verb concludes the sentence...the
> order is usually subject–object–verb (SOV)."**

### 4a. Register — the decision, and the census behind it

**The inventory.** Tamil offers four second-person forms plus a fourth strategy, avoidance:

| Form | Gloss from the source |
|---|---|
| **நீ** `U+0BA8 U+0BC0` | *"singular informal"* |
| **நீர்** | *"honorific singular"* |
| **நீங்கள்** `U+0BA8 U+0BC0 U+0B99 U+0BCD U+0B95 U+0BB3 U+0BCD` | *"plural"* — and the standard polite singular |
| **தாங்கள்** | *"honorific reflexive plural"* |

⚠ And the choice is **not a pronoun swap**: the finite verb carries person–number–gender agreement
(§4d), so the register decision **propagates into every verb ending in the text**. You cannot switch
between these forms with find-and-replace.

**The evidence — measured, not asserted.** A corpus of **7 instructional and help pages** from the
Tamil-language encyclopedia — the closest reachable analog to "an institution explaining a
procedure to an unknown adult reader" — fetched verbatim through an API and counted with
Tamil-aware boundaries, so that **நீங்கள்** cannot falsely match as **நீ**:

| Form | Occurrences in 31,450 characters |
|---|---|
| **நீ** (informal singular) | **0** |
| **நீங்கள்** (polite / plural) | **22** |
| **உங்கள்** (your, polite) | **22** |
| **உன்** / **உனது** (your, informal) | **0** |
| **நீர்** | **0** |
| **தாங்கள்** | **0** |
| **-வும்** polite imperative | **43** |

Per page: the two most instruction-heavy pages carry 7 and 14 instances of **நீங்கள்**; several
reference-style pages use **no second person at all**. Verbatim specimens, codepoint-verified:

> **நீங்கள் கண்ட அல்லது ஆக்கிய பக்கத்தை மறுபெயரிட பல காரணங்கள் இருக்கலாம்:**
> — *"There may be several reasons to rename a page you found or created."*

> **இச்செயலாற்றத்திற்கு நீங்கள் புகுபதிகை செய்திருக்க வேண்டும். உங்கள் பயனர் விருப்பத்தேர்வுகளில் :**
> — *"For this action you must be logged in. In your user preferences."*

**And the imperative pattern is equally clear.** Instructions use the **-வும் polite imperative** —
**சொடுக்கவும்** ("click"), **கொடுக்கவும்** ("give / enter"), **பார்க்கவும்** ("see"). A distinct
**-க optative** appears as a *UI label*: **நகர்த்துக** ("Move").

**Supporting evidence from expository prose:** the encyclopedia's AI article and the news sample
use **no second person whatsoever** — pure third-person exposition. **Avoidance is the attested
default for explaining; நீங்கள் appears specifically when the reader must act.**

**Trade-offs:**

| Option | For | Against |
|---|---|---|
| **நீங்கள்** | 22 of 22 second-person tokens in the instructional corpus; universally polite; safe for an adult of unknown age and status; works in all four countries | Slightly formal; can feel distant if over-used in encouragement copy |
| **நீ** | Warm and intimate; what a friendly tutor might use to a child | **0 occurrences in 31,450 characters of institutional Tamil.** To an adult stranger it ranges from over-familiar to insulting. The risk is asymmetric and severe |
| **நீர்** | Honorific singular | **0 occurrences.** Archaic or regionally marked in modern prose |
| **தாங்கள்** | Maximum deference | **0 occurrences.** Reads as officialese |
| **Avoidance** | Attested and idiomatic for exposition; sidesteps the problem | Cannot express "you got that right" — a learning platform must address the learner sometimes |

> **Register decision — taken, recorded, and binding for `ta` and `ta-easy`.** Under the kit's
> [human-gate](../human-gate.md) rule the register choice is an author decision that the guide
> **records rather than invents**; this is that record.
>
> **Use நீங்கள் with the possessive உங்கள் and the -வும் polite imperative for instructions, inside
> a base of third-person exposition that avoids second-person reference where it is natural.**
>
> 1. **It is the only form with positive evidence** — 22 against 0 for every alternative, in the
>    closest available analog to this use case.
> 2. **The risk is asymmetric.** நீங்கள் to a reader who would have accepted நீ is mildly formal, a
>    non-event; நீ to an adult stranger is a genuine insult.
> 3. **It survives the multi-country test** — polite in India, Sri Lanka, Singapore, and Malaysia
>    alike (§9).
> 4. **The hybrid matches native practice.** The corpus does not use நீங்கள் constantly; it explains
>    in the third person and switches to நீங்கள் plus **-வும்** exactly when the reader must do
>    something. **Mirror that rhythm** rather than injecting a "you" into every English sentence
>    that has one.
> 5. **It is diglossia-safe** — it belongs to the formal written register the platform is committed
>    to.
>
> A downstream project adopting this kit may of course record a different choice. What is forbidden
> is leaving it implicit — the choice propagates into every verb ending in the language.

- ✅ **நீங்கள்** — the address form for a reader of unknown age and status
- ❌ **நீ** — informal singular: attested in the grammar inventory, attested at **0 occurrences** in
  institutional prose, and insulting to an adult stranger

- ✅ **உங்கள்** — the polite possessive that agrees with நீங்கள்
- ❌ **உன்** — the informal possessive; mixing it with நீங்கள் breaks agreement as well as register

**Register beyond the pronoun — the diglossia decision.** The sourced description:

> **"Tamil, a Dravidian language and one of the eleven classical languages of India and spoken
> primarily in South Asia, is frequently cited as one of the clearest examples of diglossia."**

> **"The high variety, Senthamizh (Pure, old, beautiful or literary Tamil), is used in formal
> writing, public speaking, religious texts, media, and education, while the low varieties,
> collectively called Kodunthamizh (colloquial, spoken, crooked or vulgar Tamil), is used in daily
> speech."**

> **"Children grow up speaking only colloquial Tamil at home, and encounter formal Tamil later in
> education."**

corroborated from the language article: **"Centamiḻ is generally used in formal writing and
speech...the language of textbooks, of much of Tamil literature and of public speaking and debate."**

> **→ Write செந்தமிழ், the textbook register. This is not negotiable, and it is the answer to
> "sound human but not colloquial."**
>
> **The trap to warn translators about explicitly:** told to "sound natural and friendly", a Tamil
> translator's instinct pulls toward கொடுந்தமிழ், because that *is* natural speech. **In Tamil that
> is a register error, not a warmth improvement.** The formal register is not cold — it is the
> register of every textbook the reader has ever learned from, and the only one that reads as
> competent across four countries. **Warmth in Tamil comes from sentence rhythm, from addressing the
> reader with நீங்கள் at the right moment, and from encouragement — never from lowering the
> register.**

### 4b. Agglutination — why English string assembly fails outright

> **"an agglutinative language – words consist of a lexical root to which one or more affixes are
> attached."**

The worked example from the source: *pōkamuṭiyātavarkaḷukkāka*, "for the sake of those who cannot
go", decomposing as **go + be-possible + negation + nominalizer + plural + to + for**. **Seven
morphemes, one orthographic word.**

⚠ Craft consequences, derived from that sourced fact and labeled as derivation:

1. **Never concatenate UI strings.** An English pattern like `"Show " + n + " results"` cannot be
   assembled in Tamil: case and number marking on the noun and the form of the verb both depend on
   the slot. Use whole-sentence message templates with named placeholders.
2. **Word- and character-count heuristics break.** Tamil renders the same content in dramatically
   fewer, longer words; layout budgets tuned on English word counts mislead in both directions.
3. **Substring matching is unreliable** — an inflected form may share no visible suffix with its
   citation form. This governs search, filtering, and any highlight feature (§10).
4. **Do not space-split English compounds into Tamil** on the assumption that a two-word English
   term is a two-word Tamil term with a fixed join. See §4e.

### 4c. No articles — and the ஒரு reflex to resist

> **"Tamil has no articles. Definiteness and indefiniteness are indicated either by context or by
> special grammatical devices, such as using the number 'one' as an indefinite article."**

⚠ Craft: English *a model* and *the model* both map to bare **மாதிரி**.

- ✅ **மாதிரி** — for both "a model" and "the model"; definiteness comes from context
- ❌ **ஒரு மாதிரி** — ⚠ rule-derived, not a documented error: correct when genuine indefiniteness is
  meant, wrong as a reflex mirroring the English article

### 4d. Verb morphology — and the case system, with an honest hole

Verbs inflect for *"person, number, mood, tense, and voice"*; the source decomposes
*aḻintukkoṇṭiruntēṉ* as root + tense-voice marker + aspect marker + tense marker +
**person-number-gender marker**. That final marker is what makes §4a's register decision
irreversible-by-search.

**The case system.** The source's table lists nine cases plus the vocative:

| Case | Suffix, **as printed in the source** |
|---|---|
| nominative | -∅ |
| accusative | *-ai* |
| instrumental | *-āl*, *-(aik) koṇṭu* |
| sociative | *-ōṭu*, *-uṭaṉ* |
| dative | *-(uk)ku* |
| benefactive | *-(u)kkāka* |
| ablative | *-il(ē) iruntu*, *-iṭam iruntu* |
| genitive | *-atu*, *-uṭaiya* |
| locative | *-il(ē)*, *-iṭam*, *-kkul* |
| vocative | *-ē*, *-ā* |

> ⚠ **Declared gap, and deliberately not closed.** The source renders these suffixes in **romanized
> transliteration only**. They have **not** been back-converted into Tamil script here, because
> doing so would mean inventing orthography no source shows. **The case suffixes in Tamil script are
> not established by this guide.** A Tamil-script case table is a first-order item for the next
> research round or a native reviewer — and §3l means these romanized forms must never reach the UI.

### 4e. Sandhi — a live orthographic variable that needs a house call

> **"Sandhi (called puṇarcci in Tamil) rules in Tamil require euphonic changes during
> agglutination."**

**And it is attested unsettled in the corpus, which is the more useful evidence.** The
Tamil-language encyclopedia writes *machine learning* **both ways in the same article**:

| Form | Structure |
|---|---|
| **இயந்திரக் கற்றல்** | sandhi-doubled **`U+0B95 U+0BCD`** closing the first word |
| **இயந்திர கற்றல்** | no sandhi consonant |

**Neither is an error.** This is a genuine live variable, and if the platform does not decide, its
reviewers will "correct" it back and forth forever.

> 🏠 **House rule.** **Pick one form per term, record it in the term-sheet, and enforce it
> mechanically** (§11). This guide's default pick is **இயந்திர கற்றல்** — the form under which the
> corpus article was addressable — and that is a coin-flip resolved for consistency, **not** a
> sourced ruling. ⚠ A native reviewer may overturn it; what must not happen is that both forms ship.

Sources: <https://en.wikipedia.org/wiki/Tamil_grammar> · <https://en.wikipedia.org/wiki/Diglossia> ·
<https://en.wikipedia.org/wiki/Tamil_language> · <https://ta.wikipedia.org/w/api.php> ·
[human-gate](../human-gate.md)

---

## 5. Numbers, dates, currency

**Source for this entire section: CLDR, fetched as raw locale XML pinned to the `release-48-2`
tag** — `ta.xml`, `ta_LK.xml`, `ta_SG.xml`, `ta_MY.xml` and `root.xml` — parsed locally with all
inherit-from-root markers resolved against `root`. This is the best-evidenced section of the guide
**and the one most likely to ship a live bug**, because it carries **three independent traps**.

### 5a. 🔴 Trap one — Indian grouping, but only in two of the four countries

| Locale | `decimalFormat` pattern | Grouping |
|---|---|---|
| **`ta`** (default, India) | **`#,##,##0.###`** | **Indian 2-2-3** |
| **`ta_LK`** (Sri Lanka) | *no override* → inherits `#,##,##0.###` | **Indian 2-2-3** |
| **`ta_SG`** (Singapore) | **`#,##0.###`** | **Western 3-3-3** |
| **`ta_MY`** (Malaysia) | **`#,##0.###`** | **Western 3-3-3** |

**The same Tamil sentence formats numbers differently in Chennai and in Singapore.** For `12345678`:

- ✅ **1,23,45,678** — `ta` and `ta_LK`
- ❌ **12,345,678** — ⚠ wrong *only for those two locales*: this is the **correct** output for
  `ta_SG` and `ta_MY`, which is exactly why an un-localized formatter passes review

**Separators**, all inherited from root and verified by parse — `ta.xml` overrides none of them:
decimal **`.`** `U+002E` · group **`,`** `U+002C` · percent **`%`** `U+0025` · minus **`-`**
`U+002D` · plus **`+`** `U+002B` · list **`;`** `U+003B` · infinity **`∞`** `U+221E` · per-mille
**`‰`** `U+2030` · `NaN` · time separator **`:`** `U+003A`.

**`minimumGroupingDigits` = `1`** (inherited) → **1000 is written `1,000`**, with a separator.

**Percent:** `ta` overrides the pattern to **`#,##,##0%`** — Indian grouping, **no space before the
sign**. `ta_SG` and `ta_MY` override to `#,##0%`.

> **🔴 Never hand-format.** Use a locale-aware number formatter with the **full** locale tag
> (`ta-IN`, `ta-LK`, `ta-SG`, `ta-MY`) and let CLDR do the grouping.

### 5b. Digits — Western, and this was counted rather than assumed

The Unicode Standard §12.6.3 records the Tamil decimal digits at `U+0BE6`–`U+0BEF` and the
ten/hundred/thousand symbols as *"used for historical numbers"*; the script-notes reference states
that *"modern Tamil text uses Western digits"* and calls **௰ ௱ ௲** *"archaic"*.

**Measured** over 6 randomly sampled Tamil news-wiki articles, fetched verbatim:

| Measure | Count |
|---|---|
| Tamil digits `U+0BE6`–`U+0BEF` | **0** |
| Western digits `0`–`9` | **174** |

CLDR agrees structurally: `ta` inherits `<defaultNumberingSystem>latn</defaultNumberingSystem>` from
root, listing `tamldec` only as the `native` system and `taml` only as `traditional`.

- ✅ **2026** — Western digits, the rule for all Tamil content
- ❌ **௨௦௨௬** — Tamil digits: 0 occurrences in the sample, and confusable with Tamil letters (§3g)

### 5c. 🔴 Trap two — Indian *grouping* with Western *scale words*, in the same locale

**This one catches anyone who reasons "India ⇒ lakh and crore."** CLDR `ta` groups by lakh and crore
**and names the scales in millions and billions.** Verbatim from `ta.xml`, `decimalFormatLength
type="long"`:

```
<pattern type="1000">0 ஆயிரம்</pattern>
<pattern type="10000">00 ஆயிரம்</pattern>
<pattern type="100000">000 ஆயிரம்</pattern>
<pattern type="1000000">0 மில்லியன்</pattern>
<pattern type="10000000">00 மில்லியன்</pattern>
<pattern type="1000000000">0 பில்லியன்</pattern>
<pattern type="1000000000000">0 டிரில்லியன்</pattern>
```

So **100,000 is "100 thousand"**, not "1 lakh", and **10,000,000 is "10 million"**, not "1 crore" —
inside a locale whose *digit grouping* is 2-2-3. Short forms: **0ஆ** / **0மி** / **0பி** / **0டி**.

Codepoint-verified: **ஆயிரம்** `U+0B86 U+0BAF U+0BBF U+0BB0 U+0BAE U+0BCD` · **மில்லியன்**
`U+0BAE U+0BBF U+0BB2 U+0BCD U+0BB2 U+0BBF U+0BAF U+0BA9 U+0BCD` · **பில்லியன்**
`U+0BAA U+0BBF U+0BB2 U+0BCD U+0BB2 U+0BBF U+0BAF U+0BA9 U+0BCD`.

**Corroborated in the live corpus:** the news wiki writes **50 முதல் 200 மில்லியன் ஆண்டுகளில்**
("in 50 to 200 million years") and **300 மில்லியன் ஆண்டுகளுக்கு முன்னர்**. In that 6-article sample: **மில்லியன்** used; **கோடி** 0
occurrences; **இலட்சம்** / **லட்சம்** 0 occurrences.

**But lakh and crore do exist in Tamil** — **இலட்சம்** `U+0B87 U+0BB2 U+0B9F U+0BCD U+0B9A U+0BAE
U+0BCD` (10⁵) and **கோடி** `U+0B95 U+0BCB U+0B9F U+0BBF` (10⁷), with the community source noting
that *"The official usage of this system is limited to the nations of India, Pakistan and
Bangladesh."*

- ✅ **100 ஆயிரம்** — what CLDR's long format emits for 100,000, and what a formatted figure beside
  your prose will say
- ❌ **1 இலட்சம்** — ⚠ rule-derived: what "India means lakh" reasoning produces, contradicting the
  machine-formatted number next to it

> 🏠 **House rule.** For spelled-out magnitudes in prose prefer **மில்லியன் / பில்லியன்** — the CLDR
> and journalistic forms, what an AI-education audience reading about model and dataset sizes will
> meet, and **the only choice that reads naturally in Sri Lanka, Singapore, and Malaysia as well as
> India**. Reserve **இலட்சம்** and **கோடி** for India-specific monetary contexts. **Never mix the two
> systems in one sentence.**

⚠ **One CLDR internal inconsistency, reported and not resolved:** `ta.xml` gives
`currencyFormat type="standard"` as **`¤#,##,##0.00`** (Indian grouping) but
`currencyFormat type="accounting"` as **`¤#,##0.00;(¤#,##0.00)`** (Western grouping). This is read
from the file; **no source explaining it was found. Do not copy the accounting pattern by mistake.**

### 5d. Currency

**Standard pattern (`ta`):** **`¤#,##,##0.00`** — symbol **first, no space**. The
`alt="alphaNextToNumber"` variant is `¤ #,##,##0.00`, used when the "symbol" is alphabetic;
`alt="noCurrency"` is `#,##,##0.00`. **`ta_SG` and `ta_MY` override to `¤ #,##0.00`** — symbol,
space, Western grouping.

**Symbols, from the locale files:**

| Currency | `ta` | `ta_LK` | `ta_SG` | `ta_MY` |
|---|---|---|---|---|
| INR | **₹** `U+20B9` (inherited from root — see caveat) | — | — | — |
| LKR | — | **`Rs.`** (explicit override) | — | — |
| SGD | — | — | **`$`** | **`S$`** |
| MYR | — | — | **`RM`** | **`RM`** |
| USD | **`$`** | — | **`US$`** | — |

⚠ **Caveat on the rupee sign:** `ta.xml` carries an inherit-from-root marker for INR; **the
inheritance is verified, the resolved glyph is inferred from root inheritance** rather than read
directly out of `ta.xml`.

- ✅ **₹** `U+20B9` INDIAN RUPEE SIGN — the CLDR currency symbol
- ❌ **௹** `U+0BF9` TAMIL RUPEE SIGN — a real Tamil character, and **not** the CLDR currency symbol;
  it will not be recognized

**Currency display names, verbatim from `ta.xml`** — note the regular plural in **-கள்**:
**இந்திய ரூபாய்** / **இந்திய ரூபாய்கள்** · **இலங்கை ரூபாய்** / **இலங்கை ரூபாய்கள்** ·
**சிங்கப்பூர் டாலர்** / **சிங்கப்பூர் டாலர்கள்** · **மலேஷியன் ரிங்கிட்** / **மலேஷியன் ரிங்கிட்கள்** ·
**அமெரிக்க டாலர்** / **அமெரிக்க டாலர்கள்**.

### 5e. Dates

⚠ **Method note worth repeating for anyone re-checking this:** the Gregorian patterns were isolated
from the `calendar type="gregorian"` node specifically — **a naive search of `ta.xml` hits the
Chinese-calendar block first** and returns patterns that look plausible and are wrong.

| Length | Pattern | Renders as |
|---|---|---|
| full | **`EEEE, d MMMM, y`** | வெள்ளி, 26 ஜூலை, 2026 |
| long | **`d MMMM, y`** | 26 ஜூலை, 2026 |
| medium | **`d MMM, y`** | *(abbreviated month; see caveat)* |
| **short** | **`d/M/yy`** | 26/7/26 |

⚠ The abbreviated month names for the `medium` pattern were **not separately captured**; the wide
forms are below. Do not assume the abbreviation equals the wide form.

- ✅ **26/7/26** — `d/M/yy`, day before month
- ❌ **7/26/26** — ⚠ rule-derived: the US order, which for days ≤ 12 is silently ambiguous rather
  than visibly broken

**Note the comma before the year** in the full, long, and medium patterns. It is unusual and easy to
drop.

**Month names, `format`/`wide`:** **ஜனவரி · பிப்ரவரி · மார்ச் · ஏப்ரல் · மே · ஜூன் · ஜூலை · ஆகஸ்ட் ·
செப்டம்பர் · அக்டோபர் · நவம்பர் · டிசம்பர்**

**Weekdays, `format`/`wide`:** **ஞாயிறு · திங்கள் · செவ்வாய் · புதன் · வியாழன் · வெள்ளி · சனி** —
`short`: **ஞா · தி · செ · பு · வி · வெ · ச**

**Eras (`eraAbbr`):** **கி.மு.** / **கி.பி.** and **பொ.ச.மு** / **பொ.ச**.

**Day periods** — Tamil has a richer set than am/pm, verbatim: **நள்ளிரவு** (midnight) ·
**நண்பகல்** (noon) · **அதிகாலை** · **காலை** · **மதியம்** · **பிற்பகல்** · **மாலை** ·
**அந்தி மாலை** · **இரவு**. The `am` and `pm` fields themselves inherit from root.

### 5f. 🔴 Trap three — `ta_LK` silently switches to a 24-hour clock

| Locale | full | long | medium | **short** |
|---|---|---|---|---|
| **`ta`** (India, default) | `h:mm:ss a zzzz` | `h:mm:ss a z` | `h:mm:ss a` | **`h:mm a`** |
| **`ta_LK`** (Sri Lanka) | `HH:mm:ss zzzz` | `HH:mm:ss z` | `HH:mm:ss` | **`HH:mm`** |

**`ta_LK` explicitly overrides all four to 24-hour.** Time separator `:` `U+003A`, inherited.

- ✅ **14:30** — the `ta_LK` short time
- ❌ **2:30 PM** — ⚠ rule-derived for `ta_LK`: correct for `ta`, wrong for Sri Lanka, and nothing in
  the string looks broken

> **→ Do not hardcode a 12-hour clock for Tamil.** This is the second India/Sri Lanka split in this
> section and the one least likely to be caught by eye.

### 5g. ⚠ CLDR month names use grantha; a large body of real Tamil avoids them

A grantha audit (checking for **ஜ** `U+0B9C`, **ஶ** `U+0BB6`, **ஷ** `U+0BB7`, **ஸ** `U+0BB8`,
**ஹ** `U+0BB9`) was run over CLDR's month names against month names attested in the Tamil news wiki:

| Month | CLDR `ta` | grantha? | Attested in the news corpus | grantha? |
|---|---|---|---|---|
| January | **ஜனவரி** | **yes — ஜ** | *(not sampled)* | — |
| February | **பிப்ரவரி** | no | **பெப்ரவரி** | no |
| June | **ஜூன்** `U+0B9C U+0BC2 U+0BA9 U+0BCD` | **yes — ஜ** | **சூன்** `U+0B9A U+0BC2 U+0BA9 U+0BCD` | **no — ச** |
| July | **ஜூலை** | **yes — ஜ** | *(not sampled)* | — |
| August | **ஆகஸ்ட்** `U+0B86 U+0B95 U+0BB8 U+0BCD U+0B9F U+0BCD` | **yes — ஸ** | **ஆகத்து** `U+0B86 U+0B95 U+0BA4 U+0BCD U+0BA4 U+0BC1` | **no — த** |
| September | **செப்டம்பர்** | no | **செப்டெம்பர்** | no |

**Two independent axes of variation appear in month names alone:** grantha avoidance
(ஜூன்→சூன், ஆகஸ்ட்→ஆகத்து — the purist and Sri-Lankan-leaning convention) and plain spelling drift
(பிப்ரவரி/பெப்ரவரி, செப்டம்பர்/செப்டெம்பர்).

> 🏠 **House rule.** **Use the CLDR forms** — they are what a date formatter emits, and hand-written
> prose must not contradict machine-formatted UI dates on the same page. **But document the
> grantha-free variants**, because a Sri Lankan reviewer who "corrects" **ஜூன்** to **சூன்** is
> applying a real convention, not making a mistake.
>
> ⚠ **Weight this finding honestly:** the news corpus is a volunteer wiki with a contributor skew
> that probably **over-represents** grantha avoidance (§2c). The divergence is real; its prevalence
> is not established.

Sources: <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_LK.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_SG.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_MY.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://en.wikipedia.org/wiki/Indian_numbering_system> · <https://r12a.github.io/scripts/taml/ta.html> ·
<https://ta.wikinews.org/w/api.php>

---

## 6. Terminology strategy

> 🔴 **Read this before using a single term below. Every Tamil term in this section is OBSERVED
> USAGE, not official prescription.** The two bodies that would supply official terminology — a
> Tamil Nadu government institution's technical glossary and a Singapore ministry's English–Tamil
> glossary book — were **both located and neither could be retrieved** (§2b). The terms here were
> extracted verbatim from a live encyclopedia and news corpus through an API that preserves exact
> codepoints. **That is community-tier corpus evidence of what Tamil writers do. It is not a
> sanctioned term list, it must not be cited as one, and a term-sheet built on it must say so on its
> own front page.**

### 6a. The structural fact — Tamil has an organized purist tradition

> **"A strong strain of linguistic purism emerged in the early 20th century, culminating in the Pure
> Tamil Movement which called for removal of all Sanskritic elements from Tamil."**

The movement — *Tanittamil Iyakkam* — is described as *"a linguistic purism movement which advocated
to remove loanwords from Tamil language"*, pledged in 1916, and propagated by a named set of writers.
It targeted Sanskrit influence and resisted English dominance; advocates held that Sanskrit
loanwords perpetuated *"economic, cultural, and political servitude."* Implementation
**remained incomplete**, *"with English continuing to dominate urban life."*

⚠ **The article gives no concrete coinage examples**, so the classic word pairs a guide would want
are **not sourced** — see §8b, where that absence has consequences.

**Why this is the defining fact for terminology:** unlike languages where borrowing is the default,
Tamil has a century-old, institutionally-backed reflex to **coin native replacements**. The result
is that most AI and ML concepts have **an official-register Tamil coinage and a transliteration in
circulation simultaneously** — and the coinage often has *competitors*.

### 6b. 🔑 The sandwich pattern is native Tamil practice, not a translator's hedge

**The cleanest specimen in the corpus** is the opening line of the encyclopedia's *Unicode*
article:

> **ஒருங்குறி அல்லது யுனிகோட் (Unicode) என்பது…**

A coined native term (**ஒருங்குறி**, transparently "unified sign"), **and** a phonetic
transliteration (**யுனிகோட்**), **and** the English word in parentheses — **all three in the first
six words.** That is not sloppiness; it is the standard Tamil strategy for a term whose coinage has
not yet won. The same doubling appears for artificial intelligence, for machine translation, and for
*algorithm*.

The AI article opens the same way, with two Tamil terms offered in parallel, the English term in
parentheses and the English acronym left bare:

> **செயற்கை நுண்ணறிவு அல்லது செயற்கை அறிதிறன் (Artificial intelligence) (AI) - …**

- ✅ **செயற்கை நுண்ணறிவு (artificial intelligence)** — Tamil first, English glossed in parentheses on
  first mention, then Tamil alone
- ❌ **artificial intelligence (செயற்கை நுண்ணறிவு)** — ⚠ rule-derived: English-led, which inverts the
  attested pattern and reads as an English page with Tamil annotations

> 🏠 **House rule, resting on that attested pattern.** **On first mention write
> `<Tamil term> (<English term>)`; afterwards use the Tamil term alone.** Where two Tamil coinages
> compete, **pick one in the term-sheet and never alternate.** The **X அல்லது Y** construction is
> right for an encyclopedia defining a term once and **wrong for a learning platform that must stay
> internally consistent across a hundred pages.**

### 6c. Seed vocabulary — observed, with the competitors shown

⚠ **Every row is observed corpus usage.** Where two or three forms circulate, they are shown,
because hiding the competition would be the more dangerous simplification.

| English | Tamil form(s) attested | Note |
|---|---|---|
| artificial intelligence | **செயற்கை நுண்ணறிவு** / **செயற்கை அறிதிறன்** / **செயற்கை அறிவுத்திறன்** | **Three variants in circulation.** செயற்கை நுண்ணறிவு is the article title and most frequent |
| machine learning | **இயந்திரக் கற்றல்** / **இயந்திர கற்றல்** / **எந்திரக் கற்றல்** | Two axes: sandhi present/absent (§4e) and இயந்திரம்/எந்திரம் |
| deep learning | **ஆழமான கற்றல்** | stable |
| (artificial) neural network | **செயற்கை நரம்பியல் வலைப்பின்னல்** | **வலையமைப்பு** also occurs for "network" elsewhere |
| algorithm | **வழிமுறை**, also transliterated **அல்காரிதம்** | ⚠ ambiguity warning below |
| data | **தரவு**, plural **தரவுகள்** | very stable — use it |
| model | **மாதிரி**, also **படிமம்** | **மாதிரி** is the ML sense in the ML article |
| training | **பயிற்சி** | **பயிற்சியளிக்கப்பட்ட தரவு** = training data |
| supervised learning | **மேற்பார்வையிடப்பட்ட கற்றல்** | verbatim from the ML article |
| unsupervised learning | **மேற்பார்வை செய்யப்படாத கற்றல்** | verbatim |
| input / output | **உள்ளீடு** / **வெளியீடு** | |
| pattern | **வடிவம்**, plural **வடிவங்கள்** | |
| natural language processing | **இயற்கை மொழிச் செயலாக்கம்** | |
| machine translation | **இயந்திர மொழிபெயர்ப்பு** / **பொறிவழி மொழிபெயர்ப்பு** | two coinages, both offered by the article |
| computer | **கணினி** / **கணிப்பொறி** | both current |
| computer science | **கணினி அறிவியல்** / **கணினியியல்** | |
| software | **மென்பொருள்** | very stable |
| database | **தரவுத்தளம்** | stable |
| internet | **இணையம்** | stable, fully naturalized |
| Unicode | **ஒருங்குறி** / **யுனிகோட்** | the canonical illustration of §6b |
| font | **எழுத்துரு** | from the government institution's own site |
| keyboard | **விசைப்பலகை** | from the same |
| percent | **விழுக்காடு** (native) / **சதவீதம்** (Sanskritic) | **விழுக்காடு** 2 occurrences, **சதவீதம்** 0, in the news sample |
| robotics | **ரோபாட்டிக்ஸ்** | **transliterated, no native alternative offered** |

**Where the coinage has clearly won:** **இணையம்** (internet) and **மென்பொருள்** (software) appear
with **no transliteration offered at all**. **Where it has clearly lost:** **ரோபாட்டிக்ஸ்**
(robotics) appears transliterated with no native alternative. That contrast is the most useful thing
in the table — it tells you which terms need the English gloss and which do not.

⚠ **Ambiguity warning on வழிமுறை (algorithm).** The lexeme sits in a crowded neighborhood:
**வழிமுறை** also means way / method / procedure, and **நெறிமுறை** — a word also used for "protocol"
— titles an article that is actually about social norms and ethics. A disambiguated
mathematics-sense title returned *missing*. **Do not assume வழிமுறை unambiguously reads as
"algorithm"**; pair it with the English on first use, per §6b. Flagged as an unresolved terminology
risk.

### 6d. Transliteration conventions — observed, consistent, and they explain forms that look like typos

⚠ These are **observed conventions extracted from live text**, not cited rules. They are consistent
enough to act on and are labeled accordingly.

1. **`f` → ஃ + ப** (āytam plus PA) — attested **கலிஃபோர்னியா**, and backed by the Unicode
   Standard's statement that the āytam *"is used in the spelling of words borrowed into Tamil from
   English"* (§3f).
2. **Prosthetic initial vowel.** Tamil phonotactics bar certain consonants word-initially, so an
   epenthetic vowel is prefixed — attested **இடேவிசு** for the surname *Davis*, because **ட** cannot
   begin a Tamil word.
3. **Final `-s` or `-x` → `-சு` / `-க்சு`** — attested **காலின்சு** for *Collins*, **இடேவிசு** for
   *Davis*.
4. ⚠ **Hybrid Tamil-plus-Latin single words occur and must not be imitated.** One corpus instance
   welds a Tamil translation of "chat" directly onto a Latin product acronym with no separator. It
   appeared **exactly once**, it is an individual editor's coinage, and it breaks font shaping and
   word selection. **Do not create these.**

### 6e. What stays in Latin script

**Measured:** across the 6 news articles, **87 Latin-script tokens of three or more characters**
appear inside otherwise-Tamil text — among them *Amasia, America, British, Columbia, Corporation,
Eurasia, India, Institutions, Million, Nadu, Private, Schools, Science, Supercontinent*. The
encyclopedia's AI article likewise leaves product names, company names, system names, and the board
game *Go* bare in Latin, alongside the acronym **AI**.

> **→ Retaining English acronyms and proper nouns in Latin script inside Tamil prose is normal,
> attested practice. Keep `AI`, `API`, `URL`, `CPU`, `GPU` and model-name acronyms in Latin
> capitals. Do not transliterate acronyms.**

### 6f. Vendor, model, and product names

**Withheld, deliberately.** Product, model, and company names encountered during research are not
tabulated here. The general rule from §6e applies to them: **keep them in Latin script.** The corpus
shows the same names both transliterated and in Latin, which makes Latin the safer default for a
platform — transliterations of brand names are unstable, unsearchable, and differ between writers.

Sources: <https://ta.wikipedia.org/w/api.php> — the corpus was read through this endpoint, not through
article URLs, because it returns text verbatim; articles sampled include செயற்கை நுண்ணறிவு,
இயந்திர கற்றல், ஆழமான கற்றல், ஒருங்குறி, இணையம், மென்பொருள், தரவு, கணினி and நெறிமுறை ·
<https://en.wikipedia.org/wiki/Pure_Tamil_movement> ·
<https://en.wikipedia.org/wiki/Tamil_language> · <https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://www.tamilvu.org/en/technical-glossory> · <https://www.languagecouncils.sg/tamil/en> ·
[translation-quality](../translation-quality.md)

---

## 7. Idiom anti-patterns

> 🔴 **This section ships with its Tamil column empty, and that is the deliberate, correct outcome —
> not an oversight.** No Tamil dictionary, idiom reference, or phrasebook was reachable during
> research. **Proposing Tamil proverbs that cannot be attested would be the highest-risk fabrication
> available in this guide, and it would be undetectable to any reviewer who does not read Tamil.**
> What follows is the **strategy**, which *is* defensible from sourced facts, plus the English-side
> analysis.

### 7a. The governing rule — de-idiomatize, do not transfer

Grounded in two facts sourced elsewhere in this guide:

- **Diglossia (§4a).** Idioms are overwhelmingly a feature of the *spoken* low variety
  (கொடுந்தமிழ்). Importing them pulls the prose toward exactly the register the platform must avoid.
- **No articles, SOV, agglutination (§4b–4d).** English idioms are typically fixed *phrases*; Tamil
  morphology means a phrase-level calque usually produces something that is neither idiomatic nor
  grammatical.

> **→ Rule: for educational AI and ML prose, render the *meaning* in plain formal Tamil. Do not hunt
> for a Tamil proverb.** This also protects the multi-country standard (§9) — proverbs are among the
> most regionally variable vocabulary there is.

**The work happens on the English side, before the translator sees the string:**

- ✅ **"internally, in the underlying mechanism"** — the source phrase rewritten to its meaning, then
  translated
- ❌ **"under the hood"** — the idiom handed to a translator unchanged, inviting a calque nobody can
  audit

### 7b. The English-side watch list — rewrite these before translation

⚠ **Craft, English-side only. The "intended meaning" column is what the Tamil should express. No
Tamil renderings are given, by design.**

| English idiom | Intended meaning to render | Why the word-for-word calque fails |
|---|---|---|
| "under the hood" | internally, in the underlying mechanism | Calques to a car-bonnet image with no Tamil currency |
| "out of the box" | without additional configuration | Packaging-specific; reads as a literal container |
| "rule of thumb" | a rough practical guideline | Body-part calque, and a disputed etymology best avoided |
| "the bottom line" | the decisive point, the conclusion | Accounting metaphor; calques as a literal line |
| "black box" | a system whose internals cannot be inspected | ⚠ **Partial exception** — a technical term of art, not decoration. Render as a defined term and gloss it in English on first use per §6b |
| "training a model" | ⚠ **not an idiom — keep it** | Attested terminology (**பயிற்சி** plus **மாதிரி**, §6c). Do not "de-idiomatize" real vocabulary |
| "garbage in, garbage out" | poor input data yields poor output | A rhyming English formula; the rhyme will not survive — state the causal claim plainly |
| "cutting edge" | the most advanced current state | Blade metaphor; reads as a literal edge |
| "a game changer" | something that fundamentally alters the situation | Sports metaphor |
| "low-hanging fruit" | the easiest available gains | Agricultural metaphor; likely to read as literal fruit |
| "on the fly" | during operation, without stopping | Motion metaphor, opaque |
| "hallucination" (of a language model) | ⚠ **term of art — keep** | Do not use the medical or psychiatric word without a gloss; the ML sense is metaphorical and new. Treat as a §6b coinage-plus-English case |

> **Declared gap, carried forward and not filled.** The Tamil column of this table needs **a
> Tamil-speaking editor or a search-enabled research pass**. Until then, §7a is the operative rule
> and this table is a source-side rewrite checklist. **Nothing here may be turned into a lint rule
> or a translation memory entry.**

Sources: <https://en.wikipedia.org/wiki/Diglossia> · <https://en.wikipedia.org/wiki/Tamil_grammar> ·
<https://en.wikipedia.org/wiki/Tamil_language> · [translation-quality](../translation-quality.md)

---

## 8. Simplified-language pendant (`ta-easy`)

### 8a. ⚠ No Tamil plain-language standard was located

**Stated as "not found", never as "does not exist".** What was checked:

1. **Is there a simplified-register Tamil Wikimedia project?** The Wikimedia site-matrix API was
   parsed directly. Result: `simple` exists as a **Simple English** code with wiki, wiktionary,
   wikibooks, and wikiquote; for `ta` the projects are wiki, wiktionary, wikibooks, wikinews,
   wikiquote, and wikisource — **no simplified variant.** This is genuine negative evidence from an
   authoritative machine-readable index: **the Tamil-language community has not created a simplified
   project, although the mechanism plainly exists and is used for English.**
2. **Government plain-language guidance.** Tamil Nadu hosts were unreachable (§2); Sri Lanka's
   Department of Official Languages returned a language-selector shell. **Not established either
   way.**
3. **The NGO, health, and disability easy-read sector** — a likely home for Tamil easy-read material
   — **could not be checked at all** (no search budget). **This is a search-solvable gap, not a
   real-world absence.**

> **→ Consequence: `ta-easy` inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). Under the authoring directive that is a
> legitimate, complete answer — not a gap to fill with invented local norms.

### 8b. The complex→everyday table — measured, and the axis runs backwards as often as forwards

**The obvious axis for a Tamil easy-language variant is Sanskrit-derived → native Tamil. Measured
against a learner corpus, that swap is wrong at least as often as it is right.** This section ships
a tiered table *and* the list of swaps the measurement kills — the second is the more valuable of
the two.

#### 8b-i. Method — two corpora from one publisher, plus an encyclopedia cross-check

| Corpus | What it is | Size |
|---|---|---|
| **Learner** | **மாணவர் முரசு** (*Maanavar Murasu*), the school-student edition of Singapore's Tamil daily **தமிழ் முரசு** | 144 articles, 284,148 characters, **30,995 word tokens** |
| **Adult** | The **same paper's** Singapore news section — same publisher, same national variety, same months | 320 articles, 619,787 characters, **63,388 word tokens** |
| **Cross-check** | Tamil-language encyclopedia `insource:` **page** counts (not occurrence counts), a volunteer corpus with a very different, India-weighted contributor base | ~180k articles |

Both corpora were sampled from articles published **2025-08 to 2026-07** and fetched as raw bytes.
Counts are normalized **per 100,000 word tokens**; raw token counts are given for every row so the
reader can see how thin a signal is. The cross-check exists for one purpose: **to tell a Singapore
house style apart from a general Tamil register**, and it earns its keep below.

> ⚠ **Four caveats that travel with every number in this section.**
>
> 1. **Both corpora are one Singapore publisher.** That is deliberate — it controls for variety,
>    period, and house style, so a difference is a *register* difference. It also means **nothing
>    here is established for India or Sri Lanka** except where the cross-check agrees.
> 2. **The learner corpus is small.** 30,995 tokens means **one occurrence ≈ 3.2 per 100k**. Rows
>    resting on fewer than ~8 raw tokens are marked ⚠ and should be treated as a hint, not a finding.
> 3. **A student newspaper is not a graded reader.** It is written by adult journalists *for*
>    schoolchildren. It is the closest reachable analog to learner-register Tamil, not a
>    plain-language corpus — no such corpus was located (§8a).
> 4. **Frequency is not comprehension.** These rows say *which word the learner-facing register
>    actually uses*. No comprehension study was found for Tamil.

**Codepoint hygiene of the corpus itself, since §2e says to distrust fetched Tamil.** The learner
corpus was censused by codepoint before use: **U+0B82 TAMIL SIGN ANUSVARA occurs 0 times** against
**42,410 occurrences of U+0BCD TAMIL SIGN VIRAMA**; **U+0C42 TELUGU VOWEL SIGN UU occurs 0 times**
and the Telugu block is empty; the private-use area U+E000–U+F8FF is empty; **Tamil digits
U+0BE6–U+0BEF occur 0 times**; the text is NFC-stable; and typographic **U+201C** outnumbers ASCII
**U+0022** 262 to 2. **That is independent empirical corroboration of §3e, §3h, §3j, and §5b from a
professionally edited Tamil corpus** — the forbidden characters really are absent from real Tamil
publishing, not merely deprecated on paper.

#### 8b-ii. Formal / learned → everyday

Tier per row. **Dictionary** = the pair is attested as a synonym pair, *with etymology*, in an open
collaborative dictionary — **Community tier, not an official Tamil terminology authority; §2b is
unchanged and no row here carries institutional sanction.** **Corpus** = measured as above.

| Formal / learned | Everyday | Evidence | Tier |
|---|---|---|---|
| **ஆரம்பம்** | **தொடக்கம்** | ஆரம்பம் is a borrowing from Sanskrit आरम्भ; தொடக்கம் is built on the native verb தொடங்கு; **each entry lists the other as its synonym**. Learner corpus **271.0 vs 16.1** per 100k (84 vs 5 tokens) — the native word is 17× commoner in learner text. Encyclopedia **2,461 vs 723** pages | **Dictionary + Corpus** |
| **சம்பந்தப்பட்ட** | **தொடர்புடைய** | சம்பந்தம் is a *learned* borrowing from Sanskrit सम्बन्ध, synonym தொடர்பு. சம்பந்த- is **0 in the learner corpus and 67.8 in adult news** (0 vs 43 tokens) — one of the cleanest formal-only markers found. Encyclopedia **704 vs 4,100** | **Dictionary + Corpus** |
| **உபயோகம்** | **பயன்பாடு** | உபயோகம் borrowed from Sanskrit उपयोग; its entry lists **பயன்பாடு** among the synonyms. Encyclopedia **103 vs 2,926** pages — the native compound has overwhelmingly won | **Dictionary** ⚠ corpus signal thin (2 vs 0 tokens) |
| **விஞ்ஞானம்** | **அறிவியல்** | விஞ்ஞானம் borrowed from Sanskrit विज्ञान; அறிவியல் is அறிவு + இயல்; each is listed as the other's synonym. Encyclopedia **178 vs 11,560** pages | **Dictionary** ⚠ corpus signal thin (2 vs 2 tokens) |
| **சுலபம்** | **எளிது / எளிமை** | சுலபம் borrowed from Sanskrit सुलभ, glossed *easy, accessible*; எளிமை is built on எளி; the two are listed as mutual synonyms. Learner corpus **எளி- 83.9 vs சுலப- 9.7** (26 vs 3 tokens); encyclopedia **144 vs 20** | **Dictionary + Corpus** ⚠ 3 tokens |
| **கணிப்பொறி** | **கணினி** | Not a Sanskrit axis at all — **two competing native coinages**, and one has won. கணிப்பொறி is **0 in both corpora**; encyclopedia **2,935 vs 178** in கணினி's favor | **Corpus** |

Independently, the encyclopedia's own article on technical terminology sorts specialist vocabulary
by everyday recognizability and puts **கணினி** in the middle band — terms it calls
*"தற்காலத்தில் பரவலாகப் புரிந்து கொள்ளக்கூடிய கலைச்சொற்கள்"* ("technical terms that are widely
understandable nowadays") — alongside **ஓசோன் படலம்** and **பாலைவனமாதல்**, while placing
**மூளை**, **பரப்பளவு** and **முக்கோணம்** in the band that is simply *"பொது வழக்கில் உள்ளவை"*
("in general use"). **That is a sourced warrant for §8c's "prefer the coinages that have won".**

#### 8b-iii. 🔴 Do NOT "simplify" these — the measurement contradicts the instinct

**This is the most important table in §8.** Every row is a swap a translator applying
"Sanskrit-derived = hard, native Tamil = easy" would make, and every one of them moves the text
*away* from the register a Tamil learner actually reads.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**ஆசிரியர்** → a native coinage~~ | ஆசிரியர் derives from Sanskrit आचार्य — and it is the **most learner-skewed content word in the whole measurement**: **267.8 per 100k in the student edition against 56.8 in adult news** (83 vs 36 tokens). It is simply what a Tamil child reads for *teacher*. |
| ~~**புத்தகம்** → **நூல்**~~ | புத்தகம் is borrowed from Sanskrit पुस्तक, yet scores **90.3 in the learner corpus against 9.5 in adult news** (28 vs 6). The native **நூல்** is *rarer* in learner text (22.6). The Sanskrit-derived word is the child-facing one. |
| ~~**வித்தியாசம்** → **வேறுபாடு**~~ | வித்தியாசம் from Sanskrit व्यत्यास: **25.8 learner vs 3.2 adult**; native வேறுபாடு sits flat at 6.5 / 6.3. **On the encyclopedia the ratio inverts — 370 vs 1,557 in the native word's favor.** So the native form is the *written-formal* choice and the Sanskrit-derived form the everyday one: exactly backwards from the instinct. |
| ~~**கஷ்டம்** → a native word~~ | A learned borrowing from Sanskrit कष्ट — and it appears **38.7 per 100k in the learner corpus and 0.0 in adult news** (12 vs 0). Learner-register only. |
| ~~**அனுபவம்** → a native word~~ | Sanskrit अनुभव; **145.2 learner vs 44.2 adult** (45 vs 28). |
| ~~**ஜூன்** → **சூன்**, **ஆகஸ்ட்** → **ஆகத்து**~~ | The grantha-free month names are **not** the everyday forms in professionally edited Tamil. Adult news: **ஜூன் 86.8 vs சூன் 4.7** (55 vs 3 tokens); **ஆகஸ்ட் 69.4 vs ஆகத்து 0.0** — **ஆகத்து does not occur once in either corpus.** ⚠ On the encyclopedia the two run close (ஜூன் 7,018 / சூன் 9,635; ஆகஸ்ட் 10,050 / ஆகத்து 7,789), which is exactly the contributor skew §2c predicted. **§5g's grantha-avoidance signal is real for the volunteer wiki and does not carry to a Tamil newspaper.** |
| ~~**சதவீதம்** → **விழுக்காடு**~~ | **This supersedes the row shipped in the previous edition of this guide.** It is not a complex→everyday pair. In the Singapore corpora **சதவீதம் occurs 0 times** and விழுக்காடு scores 271.3 (172 tokens) — the native coinage is not the *plain* option there, it is the *only* option, i.e. house style. On the India-weighted encyclopedia the two are at near parity (**1,436 vs 1,591**). **It is a regional / house-style split, not a register split**, and §9 is where it belongs. |

**Why the instinct fails — and this is sourced, not inferred.** The Tamil grammatical tradition's own
Sanskrit-loanword lists are unreliable in the same direction. The encyclopedia's article on
**வடசொல்** records that the classical commentators put genuinely Tamil words into their
vaṭacol lists: *"நீர், பட்டினம், பவளம், மானம், மீனம், முத்து, வட்டம், வரி, வீரம் முதலான
தமிழ்ச்சொற்களையும் உரையாசிரியர்கள் வடசொல் பட்டியலில் சேர்த்திருக்கின்றனர்"* ("the commentators
have also included in the vaṭacol list Tamil words such as நீர், பட்டினம், …"). **If the tradition
itself cannot reliably tell a Sanskrit loan from a Tamil word, a translator working by ear
certainly cannot** — and "this looks Sanskritic, replace it" is working by ear.

**And the pure-Tamil coinage lists are prescriptive by their own account.** The 1952
**வடசொல் தமிழ் அகர வரிசைச் சுருக்கம்** collects *"ஏறத்தாழ 1,465 வட சொற்களுக்கான தூய தமிழ்ச்
சொற்கள்"* ("pure Tamil words for approximately 1,465 vaṭacol"), and its stated purpose is
*"வடசொற்கலப்பின்றிப் பேசவும் எழுதவும் கற்பிப்பதற்காக"* — "in order to teach people to speak and
write without admixture of vaṭacol". **That is a language-politics program, not a comprehension
study**, and this guide does not reproduce its pairs as easy-language advice. ⚠ **The book's own
text was not retrieved**; only the encyclopedia's description of it.

> **→ The rule that follows.** In Tamil, **do not simplify by etymology.** The Sanskrit-derived
> member of a doublet is very often the everyday one. Simplify by **morphology** (§8c) and, where a
> lexical choice is genuinely available, by **the measured learner-register form** — never by which
> word looks more Sanskrit.

### 8c. 🔑 What `ta-easy` is actually built on — morphology, not register

⚠ **Craft, derived from sourced facts elsewhere in this guide and labeled as derivation.**

1. **Shorten the agglutination. This is the main lever.** The biggest comprehension obstacle in
   Tamil is not vocabulary but **morphological stacking** — §4b's sourced example packs seven
   morphemes into one word. **Split one long inflected word into two clauses.**
2. **Prefer the coinages that have won** — **இணையம்**, **மென்பொருள்**, **தரவு**, **கணினி** — over the
   contested ones (§6c).
3. **Keep the English gloss in easy mode.** Counter-intuitive, and deliberate: a `ta-easy` reader is
   *more* likely to have met "AI" than **செயற்கை நுண்ணறிவு**, because their technical exposure is
   English-mediated. **This is the kit's term-preservation rule in its Tamil form — keep the
   technical term, explain it, never substitute a folksy stand-in.**

### 8d. 🔴 The courtesy inversion — `ta-easy` keeps நீங்கள்

> **Decision, recorded so that nobody "fixes" it: `ta-easy` keeps நீங்கள். It does NOT switch to
> நீ.**

- ✅ **நீங்கள்** — in `ta` and in `ta-easy` alike
- ❌ **நீ** — informal is not simpler, it is only less respectful

**Why, in three points:**

1. **நீ carries no comprehension benefit.** It is not a simpler word; it is a less respectful one.
2. **`ta-easy` readers include adults with lower literacy** — precisely the audience for whom being
   addressed as நீ by an institution is most demeaning.
3. **Diglossia means the simplification lever in Tamil is morphological, not register-based**
   (§4a, §8c). **Simplify the morphology, keep the courtesy.**

**And one further inversion, in the same spirit:** `ta-easy` should **reduce the third-person
avoidance** of §4a and address the reader more consistently with an explicit **நீங்கள்**.
Third-person exposition raises processing load, and the base variant's elegant impersonal
constructions should be **unpacked into direct address**.

> ⚠ **Both inversions run against the usual simplification instinct, so they are stated loudly: a
> translator or reviewer who "improves" `ta-easy` by switching to நீ, or by removing explicit
> address, has made the text worse. Do not accept either change without a native-reviewer ruling.**

Sources: <https://meta.wikimedia.org/w/api.php> · <https://en.wikipedia.org/wiki/Pure_Tamil_movement> ·
<https://en.wikipedia.org/wiki/Diglossia> · <https://ta.wikinews.org/w/api.php> ·
**Learner corpus** — 144 articles of மாணவர் முரசு, <https://www.tamilmurasu.com.sg/maanavar-murasu>,
enumerated via <https://www.tamilmurasu.com.sg/sitemap.xml> ·
**Adult corpus** — 320 Singapore-section articles from the same paper, <https://www.tamilmurasu.com.sg/singapore> ·
**Encyclopedia cross-check** — `insource:` page counts via
<https://ta.wikipedia.org/w/api.php?action=query&list=search&srsearch=insource:%22%E0%AE%A4%E0%AF%8A%E0%AE%9F%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AE%AE%E0%AF%8D%22&srinfo=totalhits> ·
**Etymologies and synonym pairs** — <https://en.wiktionary.org/wiki/ஆரம்பம்> ·
<https://en.wiktionary.org/wiki/சுலபம்> · <https://en.wiktionary.org/wiki/உபயோகம்> ·
<https://en.wiktionary.org/wiki/சம்பந்தம்> · <https://en.wiktionary.org/wiki/விஞ்ஞானம்> ·
<https://en.wiktionary.org/wiki/ஆசிரியர்> · <https://en.wiktionary.org/wiki/புத்தகம்> ·
<https://en.wiktionary.org/wiki/வித்தியாசம்> · <https://en.wiktionary.org/wiki/கஷ்டம்> ·
<https://en.wiktionary.org/wiki/அனுபவம்> (Community tier — an open collaborative dictionary, not a
Tamil terminology authority) ·
<https://ta.wikipedia.org/wiki/கலைச்சொல்> · <https://ta.wikipedia.org/wiki/வடசொல்> ·
<https://ta.wikipedia.org/wiki/வடசொல்_தமிழ்_அகர_வரிசைச்_சுருக்கம்> ·
<https://ta.wikipedia.org/wiki/தனித்தமிழ்_இயக்கம்> ·
[accessibility-workflow](../accessibility-workflow.md) · [translation-quality](../translation-quality.md)

---

## 9. Regional variation

### 9a. The reassuring headline — and it is sourced

> **"the differences between the standard written languages across the globe is minimal but the
> spoken varieties differ considerably."**

**That is the most important sentence in this section.** Written formal Tamil is substantially
unified across India, Sri Lanka, Singapore, and Malaysia; the divergence is concentrated in *speech*.
Because this platform writes formal prose (§4a), **one Tamil variant serves all four countries.**
That is a materially easier position than a language with two competing written standards.

**Neutrality strategy, stated explicitly:** formal written **செந்தமிழ்**, CLDR orthography for dates
and numbers with **locale-aware formatting rather than hardcoded patterns**, the coined-term-plus-
English-gloss pattern on first use (§6b), Latin-script acronyms, Western digits. **Avoid:** spoken
forms, Tamil digits, and India-only monetary framing (**இலட்சம்** / **கோடி**) in globally-read prose.

- ✅ **மில்லியன்** — in prose read across four countries
- ❌ **கோடி** — ⚠ in that same globally-read prose: a correct Tamil word, and an India-only framing
  that recorded **0 occurrences** in the 6-article news sample (§5c). ⚠ That sample's contributor
  base is mixed and volunteer (§2c); it is not evidence about the Indian press specifically

### 9b. Spoken Sri Lankan Tamil is genuinely distant — which is why nobody writes it

> **"Sri Lankan Tamils predominantly speak Tamil and its Sri Lankan dialects which are more
> conservative than the dialects spoken in India."** · **"Sri Lankan Tamil dialects retain many
> words and grammatical forms that are not in everyday use in Tamil Nadu."**

The Jaffna variety *"retains many words which were used in Sangam literature"* and preserves a
*"three way deictic distinction"* lost elsewhere; it is *"to an extent not mutually intelligible"*
with Indian dialects and *"frequently mistaken for Malayalam by native Indian Tamil speakers."*

> **→ Never write spoken Tamil. It is the single choice that actively breaks the multi-country
> standard.** ⚠ Per the correct-form-only rule, **no spoken-form example is given here** — none was
> sourced, and inventing colloquial Tamil to label as wrong would be fabrication. The rule stands on
> the sourced description alone.

### 9c. A real typographic divergence — and it is a font decision, not a translator's problem

**The Unicode Standard §12.6.3**, on the shape of **ர** `U+0BB0` RA when it ligates with the puḷḷi
and the `i`/`ii` vowel signs:

> **"various governmental bodies mandate that the basic shape of the consonant ra ர should be used
> for these ligatures as well, especially in school textbooks. Media and literary publications in
> Malaysia and Singapore mostly use the unchanged form of ra ர. Sri Lanka, on the other hand,
> specifies the use of the changed forms."**

**India (school textbooks) and Malaysia/Singapore prefer the unchanged form; Sri Lanka specifies the
changed one.** The codepoints are **identical** (`U+0BB0`) in both cases.

> **→ This is invisible to translators and unfixable in content. It is a font-selection question.**
> A guide that tells translators to "watch out for ra" wastes their time; **telling the front-end
> team that Tamil letterform preferences vary by country is useful.** No content rule follows.

**The divergences with real code impact are in §5:** Indian grouping in `ta` and `ta_LK` versus
Western grouping in `ta_SG` and `ta_MY` (§5a), and the 24-hour clock in `ta_LK` (§5f). **Grantha
avoidance leans Sri Lankan and purist** (§5g).

### 9d. ⚠ Caste- and religion-marked vocabulary — the axis is live, the word list is not established

**This is stated exactly as far as the evidence goes and no further.**

What can be reported factually:

- The Tamil news wiki uses **தலித்** (*Dalit*) as **ordinary, neutral journalistic vocabulary** in a
  report on a caste-related incident. **That establishes what the current press term is. It
  establishes nothing about what to avoid.**
- The Pure Tamil movement evidence (§6a) shows that Sanskrit-derived vocabulary carries **political**
  charge in Tamil, not merely stylistic charge — advocates framed Sanskrit loanwords as marking
  *"economic, cultural, and political servitude."*

> 🔴 **What this guide will not do.** It will **not** assert which specific words are caste-marked.
> The tempting inference — that because Sanskritic vocabulary correlates historically with certain
> registers, the Sanskrit↔native axis is *also* a caste-marked axis — **has no source behind it**,
> and writing it down would launder a plausible guess into a rule that a translator would then apply
> to real copy.
>
> **The sourced statement is: the axis exists and is politically live. The unsourced part is: which
> words carry it. A Tamil-speaking human editor is required here, and this is explicitly not a gap
> that a better search tool would obviously close.**

Sources: <https://en.wikipedia.org/wiki/Sri_Lankan_Tamil_dialects> · <https://en.wikipedia.org/wiki/Sri_Lankan_Tamils> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://en.wikipedia.org/wiki/Pure_Tamil_movement> · <https://ta.wikinews.org/w/api.php> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ta_LK.xml>

---

