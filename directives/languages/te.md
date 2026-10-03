<!-- base -->
# lang-te — Telugu (తెలుగు) — language guide

> **Setup & sources live in [`te.setup.md`](te.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** తెలుగు / Telugu.
**BCP 47 code (base):** `te`.
**BCP 47 code (simplified variant):** `te-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would need a private-use subtag
(`te-x-simple`); the kit token `te-easy` is the one that counts here, and there is **no registered
BCP 47 subtag for simplified language** in any case.
**Speaker reach:** **8,11,27,740 mother-tongue returns — 81,127,740 — being 6.70 % of India's
population**, from the *Language Atlas — India 2011* published by the Office of the Registrar
General & Census Commissioner (Official tier, Map 31). Two honest qualifications travel with that
number. (1) It is **L1 returns inside India in 2011**: it excludes L2 speakers and the diaspora, and
**no fetchable authoritative L2 or diaspora count was obtained** — the usual ethnological database
is paywalled. (2) 🔴 **The widely quoted round figure of "about 100 million Telugu speakers" is
rejected here as unsourced.** It comes from a community-tier encyclopedia lead, not from a primary
count, and this guide does not repeat it — ⚠ **do not reinstate it.** The census figure itself was
recovered from a PDF whose embedded font subset carries no `ToUnicode` mapping, so its digits
extract as Greek-block glyph codes; the decoding was validated by a contiguous mapping run, by an
independently decoded adjacent year token, and by an ASCII table row in the same document. See §2.
**Official status:** official language of **Telangana** and **Andhra Pradesh**, and of the **Yanam
district of Puducherry**; recognized as a second official language in several further states; one of
the languages designated **classical** by the Government of India. Community-tier.
**Script + direction:** **Telugu script** — an abugida, Unicode block **U+0C00–U+0C7F**,
**101 assigned characters**, **left-to-right**, **whitespace-separated words**, **no case
distinction**. Conjuncts are formed at render time from `<consonant, U+0C4D, consonant>`; there are
no precomposed conjunct codepoints.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `te` and the `te-easy` pendant. Per the authoring directive's "second set of
eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.

**Section strength at a glance** (read this before trusting any one section):

| Section | Strength | Resting on |
|---|---|---|
| §2 Authorities | **Honest ⚠ — a map of who exists, and one decisive negative** | Every Andhra Pradesh and Telangana state-government domain **refused connection**; the Government of India language portal's catalog *was* readable and is what carries §6 |
| §3 Script & typography | **Strong — the guide's center of gravity**, ⚠ but not uniformly Official tier | The Unicode character database parsed by codepoint range; the core specification §12.7; four independent Telugu corpora counted byte-by-byte — **plus two Craft-tier sources** (a W3C i18n lead's orthography notes, a platform vendor's shaping docs) which alone carry §3b, §3c's placement counts, §3i's nested pair, §3k, and §3m |
| §4 Grammar | **Mixed** — register is **measured**, the paradigms are **community-tier and partly missing** | Community grammar articles written in the very register this guide forbids; a four-corpus register census |
| §5 Numbers/dates/currency | **Strong, and it carries two live bugs** | Raw CLDR locale XML for `te` and `root`, parsed locally, plus a government document's own prose — but §5b, §5d, and §5e's *counts* are corpus measurement, not CLDR |
| §6 Terminology | **🔴 Observed usage only — and the absence of an official layer is itself sourced** | A government glossary catalog that has thirteen Telugu subject volumes and **no computing volume** |
| §7 Idioms | **Deliberately half-empty** — strategy supplied, the Telugu column **not** invented | One sourced idiom definition; the idiom dictionary is cataloged but its contents are not retrievable |
| §8 `te-easy` | **Word table delivered and measured; still ⚠ on a standard** | No Telugu plain-language standard located (§8a) — but the axis is named, and §8c/§8d ship a tiered table plus a 129,027-token corpus contrast that **contradicts** the naive Sanskritic→native swap |
| §9 Regional variation | **Sourced on lexicon and prestige; ⚠ answered only negatively on orthography** | Dialect and diglossia articles; a byte-level comparison of three publishers |

**Easy or hard for this kit:** Telugu is **mechanically forgiving in the places you expect trouble
and treacherous in one place you would not**. The good news is real and was verified rather than
assumed: **exactly one Telugu character has a canonical decomposition** (`U+0C48` → `U+0C46 U+0C56`),
**no Telugu character is a composition exclusion**, so NFC round-trips cleanly; there are **no
pre-base vowel signs**, so the classic Devanagari trap — a vowel typed after its consonant but drawn
to its left — **does not exist in Telugu** and must not be copied across from a Hindi or Marathi
guide (§3c). The trouble sits elsewhere:

1. **🔴 ZWNJ `U+200C` is pervasive, load-bearing, and about a quarter of it is noise** — 309 / 649 /
   185 / 1,219 occurrences across four corpora against essentially zero ZWJ, with one publisher
   carrying 27 doubled and **14 tripled** runs. Strip it and you change thousands of real words;
   trust it and you get false diffs (§3e).
2. **🔴 No official Telugu computing or AI terminology was located to defer to** — the government
   language portal's catalog positively shows the gap (§6a), and it means the term sheet is decided
   per project. ⚠ Read it as *none located*, not *none exists*: the national terminology commission's
   domain was unreachable (§2c).
3. **Logical order is not visual order inside a cluster**: a vowel sign is stored after the whole
   conjunct and drawn attached to its *first* consonant, and the shaped syllable is indivisible
   (§3c, §3l).
4. **Numbers carry two independent traps** — compact notation emits మిలియన్/బిలియన్ rather than
   లక్ష/కోటి, and the press writes శాతం where English writes `%` (§5).
5. **The standard reference sources and the actual press disagree about quotation marks**, and both
   facts have to travel together so a reviewer does not flag house style as an error (§3i).

Sources: <https://censusindia.gov.in/nada/index.php/catalog/42561/download/46187/Language_Atlas_2011.pdf> ·
<https://te.wikipedia.org/wiki/తెలుగు> · <https://en.wikipedia.org/wiki/Telugu_language> ·
<https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt>

---

## 1. Header block

See above. One-line orientation: Telugu is a **Dravidian, agglutinative, article-less** language
written in an abugida with **no pre-base vowel signs but heavy sub-joined conjuncts** — so English
loses its prepositions into noun suffixes, its articles entirely, and its assumption that the
*n*-th character of a string is the *n*-th thing on screen.

Three structural facts govern every decision in this guide, and they are worth stating before any
rule:

- **Telugu is diglossic, and this platform writes the modern standard, not the literary one.** The
  literary variety **గ్రాంథికం** and the current variety **వ్యావహారికం** — more precisely
  **శిష్ట వ్యావహారికం**, "cultivated current usage" — fought this out in a language movement running
  from roughly 1912 to 1940, and the modern variety won. The measurement confirms it: the literary
  past tense చేసెను occurs **zero times** across all four corpora (§4a).
- **The technical register has essentially no institutional coinage.** The Government of India's own
  language portal publishes **thirteen Telugu subject glossaries and not one for computing**, while
  shipping exactly such a glossary for three other Indian languages (§2c, §6a). Everything in §6 is
  therefore *observed usage*, and the observations disagree with each other.
- **One orthography, two lexical catchments.** Andhra Pradesh and Telangana separated in 2014; both
  keep Telugu as official language, the shared terminology institution was damaged by the split, and
  **no orthographic divergence was observed at byte level** — an observation of absence, which §9
  reports as exactly that and no more.

Sources: <https://te.wikipedia.org/wiki/వ్యావహారిక భాషోద్యమం> · <https://te.wikipedia.org/wiki/తెలుగు అకాడమి> ·
<https://bharatavani.in/home/dictionaries> · <https://r12a.github.io/scripts/telu/te.html>

---

## 4. Grammar for translators

> ⚠ **Tier caveat for this whole section.** The reachable Telugu grammar sources are **community
> tier**, and worse, several of them are themselves **written in the literary register this guide
> forbids** — the case article uses forms like వచ్చును and తెలియుచున్నవి that no modern editor would
> write. **Read them for the system, not for the style**, and expect a translator who consults Telugu
> grammar references to come back with exactly the register §4a rules out. Per the authoring
> directive's correct-form-only rule, this section gives **sourced correct forms** and **does not
> invent "common errors"** to pair with them; where a contrastive pair would require fabricated
> Telugu, the gap is flagged instead.

**Word order — SOV, ⚠ as a working assumption only.** The corpus is consistent with verb-final order
— an attested sentence about machine learning ends on its finite verb **అన్వేషిస్తుంది** — but
**a single example is not a sourced typological claim** and no grammar source stating it was
retrieved. ⚠ **Marked unverified.** What *is* safe, and follows from the case system below with a
source: **Telugu marks grammatical roles with suffixes, so an English sentence cannot be translated
by re-ordering words — the relations have to be re-encoded.**

### 4a. Register — the decision, and the census behind it

> **Decision, taken and recorded.** `te` and `te-easy` both address the reader as **మీరు**
> `U+0C2E U+0C40 U+0C30 U+0C41`, with the possessive **మీ** `U+0C2E U+0C40`, and use the
> respectful/plural **-ారు** verb ending for people. The whole platform writes **శిష్ట
> వ్యావహారికం**, never **గ్రాంథికం**. This is an author decision recorded per
> [human-gate](../human-gate.md) — it is documented here, not left pending.

**The inventory.**

| Form | Codepoints | What it is |
|---|---|---|
| **మీరు** | `U+0C2E U+0C40 U+0C30 U+0C41` | respectful **and** plural "you" |
| **నువ్వు** | `U+0C28 U+0C41 U+0C35 U+0C4D U+0C35 U+0C41` | familiar singular |
| **నీవు** | `U+0C28 U+0C40 U+0C35 U+0C41` | familiar singular, more literary |
| **తమరు** | `U+0C24 U+0C2E U+0C30 U+0C41` | high honorific |
| — | — | avoidance by construction: no pronoun, the verb carries the person |

Possessives: **మీ** `U+0C2E U+0C40` (respectful) versus **నీ** `U+0C28 U+0C40` (familiar).

**The evidence — counted across the four corpora:**

| Form | **[E]** | **[B]** | **[N1]** | **[N2]** |
|---|---:|---:|---:|---:|
| **మీరు** | 2 | **32** | 1 | 3 |
| **మీ** | 13 | **51** | 2 | 13 |
| నువ్వు | 0 | **1** | 0 | 2 |
| నీవు | **0** | **0** | **0** | **0** |
| తమరు | **0** | **0** | **0** | **0** |

**Two things stand out, and the second is the one that settles it.**

1. **The single broadcaster నువ్వు is not the journalistic voice.** It is reported speech inside a
   historical narrative — one ruler embracing another and calling him a man of great heart, inside
   quotation marks, in a story. **The publication addresses its reader as నువ్వు nowhere.**
2. **Where that publication addresses the reader directly — in service journalism, the closest genre
   to an educational explainer — it uses మీరు and మీ.** Attested, a tax explainer:
   **మీరు ఏడాదికి లక్ష రూపాయల కంటే ఎక్కువ అద్దె చెల్లిస్తున్నట్లయితే, మీ ఇం…** ("If **you** pay more than a lakh
   rupees rent per year, **your** hou[se]…").

| | Reader address | Evidence |
|---|---|---|
| ✅ | **మీరు** with **మీ** and the **-ారు** verb | the only form attested in direct reader address across four corpora |
| ❌ | **నువ్వు** with **నీ** in the same slot | zero attestations in institutional address; from an institution to an unknown adult this is a **social claim about the relationship**, not a friendliness gain |

⚠ **Honest limit: this is usage-derived, not rule-cited.** No style manual prescribing మీరు was
reachable — **every state-government domain refused connection** (§2b). The recommendation is read
off four corpora and is documented that way rather than dressed up as an authority's ruling.

**Why మీరు and not the alternatives**, in four lines: it is the only attested form; it **never
requires estimating the reader's age, seniority, or gender**, which an anonymous web platform cannot
do; it **collapses the singular/plural problem**, so one string serves one learner and a classroom;
and avoidance-by-construction does not actually remove the decision, because **the verb ending still
encodes the level** — while making feedback strings ("try again", "you got that right") stilted and
agentless.

**Beneath the pronoun sits the bigger decision: వ్యావహారికం, not గ్రాంథికం.** The literary variety is
**గ్రాంథికం** `U+0C17 U+0C4D U+0C30 U+0C3E U+0C02 U+0C25 U+0C3F U+0C15 U+0C02`; the modern standard is
**వ్యావహారికం** `U+0C35 U+0C4D U+0C2F U+0C3E U+0C35 U+0C39 U+0C3E U+0C30 U+0C3F U+0C15 U+0C02`, more
precisely **శిష్ట వ్యావహారికం**. The shift is documented history, not opinion: a language movement in
the first half of the 20th century, with dated milestones — a **1912-13** Government Order permitting
modern-language essays in the School Final examination, **1924** when a literary body officially
lifted its ban on the current language, **1937** when a newspaper began writing news and editorials
solely in the modern standard. Its leader's closing appeal to newspaper editors, **January 15, 1940**,
states the principle a translation guide is applying:

> **"దేశభాష ద్వారా విద్య బోధిస్తే కాని ప్రయోజనం లేదు. శిష్టజనవ్యావహారికభాష లోకంలో సదా వినబడుతూంటుంది. అది జీవంతో కలకలలాడుతూ ఉంటుంది. గ్రాంథికభాష గ్రంథాలలో కనబడేదే కాని వినబడేది కాదు. ప్రతిమ వంటిది."**

("There is no benefit unless education is taught through the language of the country. The cultivated
people's current language is heard everywhere. It is alive and vibrant. The literary language is seen
in books but never heard. It is like a statue.")

**And the measurement confirms the movement won:**

| Marker | **[E]** | **[B]** | **[N1]** | **[N2]** |
|---|---:|---:|---:|---:|
| **-ంగా** — current adverbial | **589** | **198** | **23** | **165** |
| -ముగా — literary adverbial | 7 | **0** | **0** | **0** |
| **రాష్ట్రం** — current, in **-ం** | **98** | 0 | **3** | 1 |
| రాష్ట్రము — literary, in **-ము** | **0** | **0** | **0** | **0** |
| **ఉంది** — current "is" | **82** | **31** | 0 | **24** |
| ఉన్నది — formal-but-current "is" | 1 | 14 | 0 | 0 |
| చేసెను — literary past | **0** | **0** | **0** | **0** |

| | Noun ending | Count in the corpora |
|---|---|---|
| ✅ | **రాష్ట్రం** — the **-ం** form | **102** across the four corpora |
| ❌ | **రాష్ట్రము** — the **-ము** form | **zero** occurrences anywhere |

**Prescribe: శిష్ట వ్యావహారికం.** Concretely — noun endings in **-ం** not **-ము**; verb forms in
**-ారు** / **-ింది**, not **-ెను**; adverbials in **-ంగా** not **-ముగా**; ordinary word separation
rather than heavy literary sandhi (§4f). ⚠ **One honest wrinkle:** **ఉన్నది** still appears 14 times
in the broadcaster corpus. It is **formal-but-current**, not dead literary — **do not present it to
translators as an error.** The clean markers are **-ము vs -ం** and the **-ెను** past.

### 4b. Agglutination — why English string assembly fails outright

English prepositional phrases become **suffixes on the noun**, not separate words. Attested, with
codepoints:

- **భారత్‌లో** = "India" + **లో** locative — `U+0C2D U+0C3E U+0C30 U+0C24 U+0C4D U+200C U+0C32 U+0C4B`
- **డాలర్‌లు** = "dollar" + **లు** plural — `U+0C21 U+0C3E U+0C32 U+0C30 U+0C4D U+200C U+0C32 U+0C41`
- **నెట్‌వర్క్‌ను** = "network" + **ను** accusative — `U+0C28 U+0C46 U+0C1F U+0C4D U+200C U+0C35 U+0C30 U+0C4D U+0C15 U+0C4D U+200C U+0C28 U+0C41`
- **ప్రోసెసర్‌లో** = "processor" + **లో** — `U+0C2A U+0C4D U+0C30 U+0C4B U+0C38 U+0C46 U+0C38 U+0C30 U+0C4D U+200C U+0C32 U+0C4B`
- **కంప్యూటర్‌లను** = "computer" + plural + accusative

**What this breaks in an AI platform, concretely:**

1. **🔴 Placeholder interpolation.** A `{model}` slot in "trained on {model}" needs a **case-inflected**
   Telugu form; the suffix depends on the noun's ending and on whether it is human or non-human
   (§4d). **A bare placeholder cannot carry it.** Build the whole phrase per string, or expose
   separate keys per case — **never let translators guess.**
2. **🔴 Notice the ZWNJ.** Every example above carries `U+0C4D U+200C` at the stem–suffix seam. **If
   your code concatenates stem + suffix at runtime, it must emit the ZWNJ**, or the stem's final
   consonant conjoins with the suffix's first consonant and produces a different word (§3e).
3. **UI width.** Agglutinated Telugu is long and unbreakable (§3b, §3k).
4. **Search and matching.** English-style suffix stripping mangles an agglutinative language. Prefer
   substring or fuzzy matching over naive stemming.

### 4c. The case system — eight vibhaktis, realized as suffixes

Community tier, verbatim: **"విభక్తులు వాక్యములోని వేర్వేరు పదములకు అన్వయము కలిగించు ప్రత్యయములు. … ఈ విభక్తులు
ఎనిమిది."** ("Vibhaktis are the suffixes that create agreement between the different words in a
sentence … **These vibhaktis are eight.**")

The source cites the suffixes in their **literary** shapes — e.g. **నిన్, నున్, లన్** for the
accusative and **చేతన్, చేన్, తోడన్, తోన్** for the instrumental, all with a final **-న్**. The modern
standard forms are shorter — **ను, తో, కు, లో** — which is exactly the గ్రాంథికం / వ్యావహారికం split of
§4a.

⚠ **Declared gap: there is no sourced modern-register table of all eight cases here, and none was
invented.** What is established: **the system is eight cases expressed as suffixes, not
prepositions.** A translator needing the full modern paradigm needs a reachable modern grammar or a
native reviewer.

### 4d. 🔑 The human / non-human split — and the AI personification trap

This is the Telugu-specific agreement fact that English speakers get wrong, and for an AI platform it
is the most consequential item in this section. The nominative rules, verbatim:

> **పుంలింగాలయిన, మహద్వాచకాలయిన శబ్దాలకు "డు" వస్తుంది. ఉదా: రాముడు, కృష్ణుడు**
> **అమహన్నపుంసకములకు, అదంత శబ్దాలకు "ము" వస్తుంది. ఉదా: వృక్షము, దైవము**
> **బహువచనంలో అన్ని శబ్దాలకు ప్రథమా విభక్త్యర్థంలో "లు" వస్తుంది. ఉదా: రాములు, సీతలు**

The operative terms are **మహత్** (*mahat*, "human/rational") against **అమహత్** (*amahat*,
"non-human"): masculine-**and-human** nouns take **డు**; non-human neuter takes **ము**; the plural
marker is **లు**.

**Why this is the trap.** English AI prose relentlessly personifies: *the model learns*, *the network
decides*, *the algorithm knows*, *the AI wants*. **In Telugu, choosing human-class agreement for a
model or an algorithm grammatically asserts that it is a person.** The encyclopedia's AI article
notably keeps machines in the non-human class and phrases intelligence as something *displayed by*
machines:

> **కంప్యూటర్ సైన్స్ లో, కృత్రిమ మేధ (ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ లేదా యంత్ర మేధస్సు - AI), అనేది యంత్రాలచేత ప్రదర్శించబడే మేధస్సు.**

("In computer science, artificial intelligence … is intelligence **displayed by machines**" —
**యంత్రాలచేత** is the instrumental: *by* machines.)

> **🔑 Rule: keep AI systems in the non-human class.** Render "the model learns" as something closer
> to *"learning happens by means of the model"* or *"the model performs learning"*, following the
> attested instrumental framing above. **Never let the honorific -ారు attach to a system** — that
> ending is for people (§4a).

⚠ **Correct-form-only, gap-flagged.** The sourced *correct* pattern is **యంత్రాలచేత ప్రదర్శించబడే**.
**No attested wrong form exists in the research**, and constructing a personified Telugu sentence to
label as wrong would be fabrication. **The pair is deliberately absent; the rule stands on the
attested correct form.** Next research round: find or elicit a real personification error.

### 4e. No articles

Telugu has no definite or indefinite article. English "a model", "the model" and "models" collapse;
the distinction must be carried by demonstratives, by context, or dropped. ⚠ Sourced only negatively
— no article appears in the case-suffix inventory and none is present in any corpus sentence quoted
in the research. **This is a structural absence, not a claim requiring a rule citation.**

### 4f. Sandhi — a register variable, not just a phonology one

Sandhi (**సంధి**) is a core component of Telugu grammar, listed as such in the grammar article's own
contents alongside **ప్రకృతి - వికృతి** (§8b). ⚠ **The sandhi article itself was not fetched and the
rules are not stated here.**

What the corpora *do* show, and what matters more for this platform: **the degree of fusion is a
register marker.** Heavy euphonic fusion across word boundaries is a గ్రాంథికం trait; modern
వ్యావహారికం prose fuses less and keeps words separate.

> **→ Do not "correct" a translator's un-fused, word-separated Telugu into fused literary forms.**
> That is a register regression, not a fix.

### 4g. The conjunction — a small thing that appears in every list

CLDR `te.xml` list pattern, verbatim: **`<listPatternPart type="end">{0} మరియు {1}</listPatternPart>`**.
**మరియు** `U+0C2E U+0C30 U+0C3F U+0C2F U+0C41` = "and". CLDR leaves `start` and `middle` inheriting
from root, so a three-item list is **A, B మరియు C** — comma-separated, with the conjunction only
before the last item.

Sources: <https://te.wikipedia.org/wiki/విభక్తి> · <https://te.wikipedia.org/wiki/తెలుగు వ్యాకరణం> ·
<https://te.wikipedia.org/wiki/వ్యావహారిక భాషోద్యమం> · <https://te.wikipedia.org/wiki/కృత్రిమ మేధస్సు> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://r12a.github.io/scripts/telu/te.html> · [human-gate](../human-gate.md) ·
[translation-quality](../translation-quality.md)

---

## 5. Numbers, dates, currency

**This section carries the most consequential traps for a platform built on English defaults.**

### 5a. Indian grouping — normative, and confirmed in a government document's own prose

**CLDR `te.xml`, verbatim:**

> **`<decimalFormatLength><decimalFormat><pattern>#,##,##0.###</pattern></decimalFormat></decimalFormatLength>`**
> **`<currencyFormat type="standard"><pattern>¤#,##,##0.00</pattern>`**

`#,##,##0` is **Indian grouping**: the *last* group has three digits, **every group before it has
two**. The orthography notes restate it independently: *"The CLDR standard-decimal pattern is
`#,##,##0.###`."*

**And it is corroborated by an Official-tier Telugu-language document writing its own numbers that
way** — the census Language Atlas gives the Telugu speaker count as **8,11,27,740** and India's
population as **1,21,08,54,977**, the latter verbatim from an ASCII table row. Read it as
`1 | 21 | 08 | 54 | 977`: 2-2-2-3.

| | Grouped figure | System |
|---|---|---|
| ✅ | **8,11,27,740** | Indian 2-2-3 grouping — as the government document itself writes it |
| ❌ | **81,127,740** | Western 3-3-3 grouping — the same quantity, the wrong convention for `te` |

> ⚠ **One asymmetry that is a real CLDR fact, not an error: the *percent* pattern is `#,##0%`** —
> Western grouping, inherited from root, while decimal and currency use Indian grouping. It only
> diverges above 9,999 %, so it rarely bites. **Do not "fix" it.**

### 5b. Lakh and crore — the lexical layer, which is what people actually write

Grouping is one thing; **the words** are the bigger deal, because in running Telugu prose large
numbers are usually **not written as long digit strings at all**. Across the three press corpora:
**లక్ష** ("lakh", 10⁵) **67** occurrences · **కోట్ల / కోటి** ("crore", 10⁷) **25**. And — the striking
part — **searching those corpora for genuine 2-2-3-grouped digit strings returned zero matches.**
Quantities are expressed **lexically**: digit + scale word.

Attested: **రూ.7 లక్షల వరకు బీమా** ("insurance up to Rs. 7 lakh") · **రూ. 50 వేల జరిమానా!** ("Rs. 50
thousand fine") · **జనాభా 40 లక్షకు పైగా కలిగిన నగరాల్లో** ("in cities with a population over 40 lakh") ·
and in the encyclopedia, **ఏటా అచ్చేసే పాఠ్యపుస్తకాలు దాదాపు 25 లక్షలు** ("about 25 lakh textbooks
printed per year").

Codepoints, machine-read: **లక్ష** `U+0C32 U+0C15 U+0C4D U+0C37` · **లక్షలు** `U+0C32 U+0C15 U+0C4D
U+0C37 U+0C32 U+0C41` · **కోటి** `U+0C15 U+0C4B U+0C1F U+0C3F` · **కోట్ల** `U+0C15 U+0C4B U+0C1F U+0C4D
U+0C32` · **వేయి** `U+0C35 U+0C47 U+0C2F U+0C3F` · **వేలు** `U+0C35 U+0C47 U+0C32 U+0C41`.

### 5c. 🔴 Trap one — compact notation emits the wrong scale words

**CLDR's compact/long number names for `te` are Western-scale.** Verbatim from `te.xml`:

> **`<pattern type="1000" count="other">0 వేలు</pattern>`**
> **`<pattern type="1000000" count="other">0 మిలియన్లు</pattern>`**
> **`<pattern type="10000000" count="other">00 మిలియన్లు</pattern>`**
> **`<pattern type="1000000000" count="other">0 బిలియన్లు</pattern>`**

So a compact-notation formatter for `te` produces **మిలియన్** ("million") and **బిలియన్**
("billion") — **not** లక్ష and కోటి. Ten million renders as **1 కోటి** in Telugu prose but comes out
of the compact formatter on the million scale.

| | Ten million, in running Telugu prose | Where it comes from |
|---|---|---|
| ✅ | **1 కోటి** | the scale word Telugu prose actually uses — 25 attestations of కోటి/కోట్ల in the press corpora |
| ❌ | **10 మిలియన్లు** | what the compact formatter emits from CLDR's own `te` patterns |

> **🔴 Guide rule: do not use compact notation for `te`.** Write the number out, or hand-author the
> lakh/crore wording. This is a live, checkable defect class and exactly the sort of thing an
> English-defaults platform ships without noticing (§11).

### 5d. 🔴 Trap two — the press writes the word, not the percent sign

| Form | **[E]** | **[B]** | **[N1]** | **[N2]** |
|---|---:|---:|---:|---:|
| **శాతం** `U+0C36 U+0C3E U+0C24 U+0C02` | 5 | **9** | 0 | **5** |
| `%` `U+0025` | 43 | **0** | **0** | **0** |

**Zero percent signs in all three news publishers.** Attested: **నమోదైన కేసుల్లో సుమారు 75 శాతం …**
("about 75 percent of registered cases") · **తమ జీతంలో 50 శాతం వరకు …** ("up to 50 percent of
salary") · and **అది ఇతర ప్రాంతాలకు 40 శాతంగా ఉంటుంది.** — note that last one: **శాతంగా**, the word
taking an adverbial suffix, **which a `%` sign cannot do.**

| | Percentage in running educational prose | Note |
|---|---|---|
| ✅ | **75 శాతం** | what all three publishers write; and it inflects |
| ❌ | **75%** | `U+0025` in running prose — an encyclopedia/statistical-table convention, 43 occurrences there and **zero** in the press |

**Guide rule: in running educational prose write the word. Reserve `%` for dense data displays,
charts, axis labels, and tables** — where the encyclopedia's own usage supports it.

### 5e. Separators, plural categories, currency

Resolved from `te.xml` → `root.xml` (all inherited):

| Symbol | Value | Codepoint |
|---|---|---|
| decimal separator | `.` | `U+002E` |
| grouping separator | `,` | `U+002C` |
| percent sign | `%` | `U+0025` |
| plus / minus | `+` / `-` | `U+002B` / `U+002D` |
| infinity | `∞` | `U+221E` |
| time separator | `:` | `U+003A` |

**Plural rules, verbatim from the supplemental data:** cardinals have **`one`** (`n = 1`) and
**`other`**; **ordinals have `other` only.** ⚠ **Note `one` does NOT include 0** — zero takes
`other`, unlike French or Punjabi. **Do not ship `zero`, `two`, `few` or `many` keys for Telugu**;
they will never be selected.

**Currency.** The INR symbol is **₹** `U+20B9`, resolved from root. Telugu display names, verbatim
from `te.xml`: **భారతదేశ రూపాయి** / plural **భారతదేశ రూపాయలు**; **అమెరికా డాలర్** / plural
**అమెరికా డాలర్‌లు** — and note that plural carries a **ZWNJ**, `U+0C21 U+0C3E U+0C32 U+0C30 U+0C4D
U+200C U+0C32 U+0C41`. **CLDR itself ships the joiner** (§3e).

The pattern `¤#,##,##0.00` puts the symbol **before** the number with **no space**; the spaced variant
is the `alphaNextToNumber` alternate, for alphabetic codes.

| | Amount | Why |
|---|---|---|
| ✅ | **₹1,00,000** | symbol first, no space, Indian grouping — the CLDR pattern |
| ❌ | **1,00,000 ₹** | symbol trailing after a space — not the `te` pattern |

**But observed press practice differs**, and a reviewer should know it: newspapers write **రూ.**
`U+0C30 U+0C42 U+002E` tight against the digit — **రూ.7 లక్షల** — while **₹** appears mainly in
encyclopedia infoboxes (**[E]** 15, **[N1]** 3, **[B]** 0, **[N2]** 0). 🏠 **House rule:** use
**₹ + ASCII digits** for UI and data display because it is the CLDR-conformant, locale-portable form;
**రూ.** is legitimate in hand-written body copy matching newspaper register. **Do not mix the two
within one surface.**

### 5f. Dates and time

**CLDR `te.xml`, gregorian, verbatim patterns:**

| Length | Pattern | Example shape |
|---|---|---|
| `full` | **`d, MMMM y, EEEE`** | 26, జులై 2026, ఆదివారం |
| `long` | **`d MMMM, y`** | 26 జులై, 2026 |
| `medium` | **`d MMM, y`** | 26 జులై, 2026 |
| `short` | **`dd-MM-yy`** | 26-07-26 |
| item `yMd` | **`d/M/y`** | 26/7/2026 |

**Day-month-year throughout.**

| | Numeric date | Reading |
|---|---|---|
| ✅ | **26-07-2026** | July 26, 2026 — day first, as every `te` pattern and every corpus date does |
| ❌ | **07-26-2026** | American ordering, which a Telugu reader will silently misread as a day |

**Month names**, verbatim from `te.xml`: **జనవరి** `U+0C1C U+0C28 U+0C35 U+0C30 U+0C3F` · **ఫిబ్రవరి** ·
**మార్చి** · **ఏప్రిల్** · **మే** `U+0C2E U+0C47` · **జూన్** · **జులై** · **ఆగస్టు** · **సెప్టెంబర్** ·
**అక్టోబర్** · **నవంబర్** · **డిసెంబర్**. **All twelve are transliterations of the Gregorian names**,
not Telugu-calendar months.

**Day names**, verbatim: **ఆదివారం** · **సోమవారం** · **మంగళవారం** · **బుధవారం** · **గురువారం** ·
**శుక్రవారం** · **శనివారం** — all ending in **-వారం** `U+0C35 U+0C3E U+0C30 U+0C02`.

**Observed practice matches on order:** dates harvested from the press read **22 జులై 2026**,
**21 జనవరి 2026**, **27 మే 2026**, and numerically **27/07/2026** and **26-07-2026**. **No
American-ordered date appeared anywhere.** ⚠ Note the press **drops the comma** that CLDR's `long`
pattern puts before the year — order matches, punctuation does not.

**Time:** `te.xml` gives **12-hour with a day-period marker** — `short: h:mm a`. ⚠ The day-period
names are **inherited from root**, so Telugu gets root's Latin **AM/PM** rather than a Telugu word.
**Not resolved in the research: what a formatter actually emits for `te`.** ⚠ **Verify before
shipping a clock**, and do not assume a translated day-period string exists.

Sources: <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/plurals.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/ordinals.xml> ·
<https://censusindia.gov.in/nada/index.php/catalog/42561/download/46187/Language_Atlas_2011.pdf> ·
<https://r12a.github.io/scripts/telu/te.html> · <https://en.wikipedia.org/wiki/Indian_numbering_system>

---

## 6. Terminology strategy

### 6a. 🔴 The structural fact — there is no official Telugu computing terminology to defer to

**This is the strongest finding in the research, and it is a negative one.** Restating §2c as this
section's premise: the Government of India's own language portal carries **thirteen Telugu subject
glossaries** — Physics, Chemistry, Botany, Zoology, Mathematics/Statistics, Geography, Geology,
Medicine, Home Science, Commerce, History/Political Science, Public Administration, Evaluation — and
**no computing, IT, informatics, electronics, engineering, or AI volume**, while publishing exactly
such a glossary for **Hindi**, **Bodo**, and **Kannada**.

> **🔴 Therefore: for AI and ML terminology in Telugu there is no official coinage to defer to.**
> **Any guide, brief, or term sheet that presents a Telugu AI term as "the official term" is inventing
> an authority.** The honest framing, and the one this guide uses throughout: *there is a widely used
> Telugu term, there are competing variants, and no body has adjudicated between them.*

The catalog finding is **positive evidence, not an absence of research** — the volumes were
enumerated and the gap read off them. ⚠ **But it is a finding about one portal**, and the national
terminology commission's own domain could not be reached (§2c), so state it as *none located*, never
as *none exists*. Either way it changes what the term sheet *is*: not a lookup of a canonical list,
but **a decision, taken per project and then enforced** (§11).

### 6b. "Artificial intelligence" — two live renderings, neither blessed

The encyclopedia's AI article offers **three namings in its own first sentence** (§4d), and its
**title disagrees with its own opening words**: the article is titled **కృత్రిమ మేధస్సు** while the
body opens **కృత్రిమ మేధ**.

| Form | Gloss | Codepoints | **[E]** / **[B]** / **[N1]** / **[N2]** |
|---|---|---|---|
| **కృత్రిమ మేధ** | "artificial intellect" | `U+0C15 U+0C43 U+0C24 U+0C4D U+0C30 U+0C3F U+0C2E` + `U+0C2E U+0C47 U+0C27` | **19 / 0 / 0 / 1** |
| **కృత్రిమ మేధస్సు** | "artificial intelligence" | + `U+0C2E U+0C47 U+0C27 U+0C38 U+0C4D U+0C38 U+0C41` | **11 / 0 / 0 / 1** |
| **ఆర్టిఫిషియల్ ఇంటెలిజెన్స్** | transliteration | — | 1 / 0 / 0 / 0 |
| **ఏఐ** | "AI" transliterated | `U+0C0F U+0C10` | 1 / 0 / 0 / 0 |
| `AI` in Latin | — | — | 8 across all corpora |

**కృత్రిమ** ("artificial") is stable; the head noun alternates between **మేధ** and **మేధస్సు** — the
same Sanskrit stem with and without the **-స్సు** extension. **Both are live and neither is
officially blessed.**

**The attested journalistic convention is Telugu term + Latin abbreviation in parentheses** — the one
press instance reads **కృత్రిమ మేధస్సు (AI) ఆధారంగా పనిచేసే …** ("working on the basis of artificial
intelligence (AI)").

🏠 **House rule (judgment, flagged as such):** pick **one** and use it everywhere; introduce it once
as **కృత్రిమ మేధ (AI)** and use Latin **AI** for subsequent short references, because that is the
attested pattern and `AI` is unambiguous to this reader. ⚠ **The press sample is small and not
AI-focused** — the counts are honest but they are not a survey of Telugu technology journalism.

### 6c. 🔴 "Machine learning" — four renderings, and a self-contradicting encyclopedia

**This is the worked example of why a term sheet must be decided per project rather than looked up.**
The encyclopedia has **two separate articles** for machine learning.

**Article one is titled యంత్ర శిక్షణ** ("machine training") — and its body opens with a **different**
term, verbatim:

> **యంత్ర అభ్యాసం (Machine Learning) అనేది కృత్రిమ మేధస్సు (Artificial Intelligence) లోని ఒక విభాగం.**

…and then, **three sentences later, switches again to the transliteration**:

> **మెషిన్ లెర్నింగ్ అనేది కంప్యూటర్లకు స్పష్టంగా ప్రోగ్రామ్ చేయకుండా నేర్చుకునే సామర్థ్యాన్ని ఇస్తుంది.**

**Article two is titled మర ప్రజ్ఞ** ("machine wisdom"), and its opening sentence manages **two
different transliterations of the same English words inside one sentence** — **మెషీన్ లెర్నింగ్** and
**మెషిన్‌ లర్నింగ్‌**.

⚠ **Look at the bytes of that second form, because it demonstrates §3e inside a terminology
problem.** It carries **two `U+200C`, and both are the noise class** — one before the space and one at
the end of the string, each sitting after a `U+0C4D` with no following consonant to block. Reproduced
verbatim rather than tidied, because it is the exact shape that defeats a naive consistency check: a
comparison on raw bytes sees **మెషిన్‌** and **మెషిన్** as two different terms when they are the same
word (§11).

> **So: one article, titled one way, opening with a second term, and on a transliteration by the
> third sentence. That is the ambient state of Telugu AI vocabulary, and it is not going to resolve
> itself before your course ships.**

| Form | Type | Codepoints |
|---|---|---|
| **యంత్ర అభ్యాసం** | calque, "machine practice/study" | `U+0C2F U+0C02 U+0C24 U+0C4D U+0C30` + `U+0C05 U+0C2D U+0C4D U+0C2F U+0C3E U+0C38 U+0C02` |
| **యంత్ర శిక్షణ** | calque, "machine training" | + `U+0C36 U+0C3F U+0C15 U+0C4D U+0C37 U+0C23` |
| **మర ప్రజ్ఞ** | calque, "machine wisdom" | `U+0C2E U+0C30` + `U+0C2A U+0C4D U+0C30 U+0C1C U+0C4D U+0C1E` |
| **మెషిన్ లెర్నింగ్** | transliteration | `U+0C2E U+0C46 U+0C37 U+0C3F U+0C28 U+0C4D` + `U+0C32 U+0C46 U+0C30 U+0C4D U+0C28 U+0C3F U+0C02 U+0C17 U+0C4D` |
| **మెషీన్ లెర్నింగ్** | transliteration variant, long **ీ** | `U+0C2E U+0C46 U+0C37 U+0C40 U+0C28 U+0C4D` + … |

| | Machine learning across one course | Verdict |
|---|---|---|
| ✅ | **యంత్ర అభ్యాసం** used in every lesson, glossed once on first mention | consistent — the term sheet has been enforced |
| ❌ | **యంత్ర శిక్షణ** in one lesson and **మెషిన్ లెర్నింగ్** in the next | **inconsistent, not "wrong"** — both are attested Telugu; the defect is that a reader meets two names for one concept |

> **🔴 The rule that follows directly: fix one form per concept in the term sheet and enforce it
> mechanically.** The ambient sources will not do it for you. **The failure mode here is not "wrong
> term", it is "four terms for one concept in one course."**

### 6d. What stays English — measured

Telugu-script transliteration against Sanskritic calque, counted across all four corpora:

| English | Transliteration (count) | Telugu calque (count) | Verdict |
|---|---|---|---|
| data | **డేటా** (23) | **దత్తాంశ** (12) | **both live**; transliteration ahead |
| computer | **కంప్యూటర్** (15) / **కంప్యూటరు** (180) | గణన యంత్రం (**0**) | **transliteration wins outright**; the calque is unattested |
| software | **సాఫ్ట్‌వేర్** (6) | — | transliteration only |
| internet | **ఇంటర్నెట్** (4) | — | transliteration only |
| deep learning | **డీప్ లెర్నింగ్** (5) | — | transliteration only |
| neural network | **న్యూరల్ నెట్‌వర్క్** (5) | — (0) | transliteration only |
| algorithm | **అల్గోరిథం** (4) / అల్గారిథమ్ (1) / అల్గారిథం (2) | — | transliteration, **three spellings** |
| model | మోడల్ (4) | **నమూనా** (11) | **calque ahead** |
| technology | టెక్నాలజీ (11) | **సాంకేతిక** (26) | **calque ahead** |

**The pattern is legible:** concrete artifacts and recent coinages stay English in Telugu script;
older or more abstract concepts have working Telugu words — **నమూనా** for model, **సాంకేతిక** for
technology, **కృత్రిమ మేధ** for AI itself. **Data sits exactly on the fence**, with both **డేటా** and
**దత్తాంశ** attested in the same corpus.

⚠ **On కంప్యూటరు (180):** that count is inflated by a **single long article** using the **-ు** final
spelling throughout. **Treat it as evidence that both endings exist, not as a 12:1 preference.**

### 6e. Transliteration conventions

⚠ **Inferred from the attested forms above — this is corpus inference, not a cited rule.**

1. **Final English consonants take a virama**, not a vowel, in modern press style: **నెట్‌వర్క్** ends
   `U+0C15 U+0C4D`; **మోడల్** ends `U+0C32 U+0C4D`; **ఇంటర్నెట్** ends `U+0C1F U+0C4D`.
2. **Compound English terms take a ZWNJ at the internal seam** where a virama would otherwise
   conjoin: **నెట్‌వర్క్**, **సాఫ్ట్‌వేర్**, **ఇన్‌పుట్**, **ఔట్‌పుట్**, **అప్‌డేట్**. **Systematic —
   reproduce it, never strip it** (§3e).
3. **Telugu suffixes attach directly to the transliterated stem, again across a ZWNJ**:
   **నెట్‌వర్క్‌ను**, **కంప్యూటర్‌లను**, **ప్రోసెసర్‌లో**, **డాలర్‌లు**.
4. **English vowel length is not reliably preserved** — **మెషిన్** against **మెషీన్**, **అల్గోరిథం**
   against **అల్గారిథమ్**, both attested. **There is no rule to appeal to.**
5. **Latin-script abbreviations stay in Latin** in running Telugu text: `AI`, `CNN`, `NLP` all appear
   unconverted — verbatim, **(ఆంగ్లం: Convolutional Neural Network, సంక్షిప్తంగా CNN)**.

🏠 **Two house decisions this guide requires the term sheet to settle once, not per word:**

| | Consonant-final loanword | Note |
|---|---|---|
| ✅ | **కంప్యూటర్** — the virama-final spelling, used everywhere | one ending chosen and enforced |
| ❌ | **కంప్యూటరు** — the vowel-final spelling mixed into the same course | ⚠ **not an error in Telugu** — both are attested; the defect is the mixture |

And the same for vowel length: **pick one spelling per term and lock it in the glossary.**

### 6f. The gloss pattern — how Telugu technical prose introduces a term

Attested repeatedly, and worth prescribing because it solves by observation the ambiguity §6a would
otherwise force this guide to settle by fiat:

> **`యంత్ర అభ్యాసం (Machine Learning) అనేది కృత్రిమ మేధస్సు (Artificial Intelligence) లోని ఒక విభాగం.`**
> **`కాన్వొల్యూషనల్ న్యూరల్ నెట్‌వర్క్ (ఆంగ్లం: Convolutional Neural Network, సంక్షిప్తంగా CNN)`**
> **`సహజ భాషా ప్రాసెసింగ్ (నేచురల్ లాంగ్వేజ్ ప్రాసెసింగ్) (NLP)`**

**Pattern: Telugu term first, then the English original in parentheses, on first mention only.**
**ఆంగ్లం** `U+0C06 U+0C02 U+0C17 U+0C4D U+0C32 U+0C02` = "English"; **సంక్షిప్తంగా** = "in short".
This is the [translation-quality](../translation-quality.md) sandwich pattern already instantiated by
native Telugu technical writing — **observed, not invented** — and for readers who will meet the
English terms elsewhere it is almost certainly the right house style.

🏠 **House operationalization:** the sourced pattern says *on first mention*; this guide reads that as
**once per page, not per occurrence**. Never invert the order to English-first.

### 6g. Vendor, model, and product names

**Withheld by scope.** Localized product interfaces are a real and often-consulted source of Telugu
computing vocabulary, and none is enumerated here. Where a proper noun must appear, it stays in its
own script and is not transliterated into Telugu unless the term sheet says otherwise.

Sources: <https://bharatavani.in/home/dictionaries> · <https://te.wikipedia.org/wiki/కృత్రిమ మేధస్సు> ·
<https://te.wikipedia.org/wiki/యంత్ర శిక్షణ> · <https://te.wikipedia.org/wiki/మర ప్రజ్ఞ> ·
<https://te.wikipedia.org/wiki/కంప్యూటర్> · <https://www.sakshi.com/> ·
[translation-quality](../translation-quality.md)

---

## 7. Idiom anti-patterns

> ⚠ **Tier declaration, up front and unambiguous: this section is CRAFT, and its Telugu column is
> deliberately empty.** The cataloged **Dictionary of Idioms** (తెలుగు జాతీయాల కోశం) is
> **content-inaccessible** (§2c), and the reachable idiom article defines the category and gives
> *Telugu-origin* idioms without supplying English→Telugu equivalents. **No Telugu idiomatic
> equivalent is invented here.** What follows is a strategy plus flagged craft judgment.

### 7a. What is sourced about Telugu idiom — and it settles the strategy

The idiom article's own definition, with a worked example that shows exactly why calquing fails in
both directions, verbatim:

> **ఒక జాతీయంలో ఉన్న పదాల అర్ధాన్ని ఉన్నదున్నట్లు పరిశీలిస్తే వచ్చే అర్థం వేరు, ఆ పదాల పొందికతోనే వచ్చే జాతీయానికి ఉండే అర్థం వేరు. ఉదాహరణకు "చేతికి ఎముక లేదు" అన్న జాతీయంలో ఉన్న పదాలకు విఘంటుపరంగా ఉండే అర్థం "ఎముక లేని చేయి. అనగా కేవలం కండరాలు మాత్రమే ఉండాలి" కాని ఈ జాతీయానికి అర్థం "ధారాళంగా దానమిచ్చే మనిషి" అని.**

("The meaning that comes from examining the words of an idiom literally is one thing; the meaning the
idiom has from the combination of those words is another. For example, in the idiom **చేతికి ఎముక
లేదు** the dictionary meaning of the words is *'a hand with no bone, i.e. only muscle'*, but the
meaning of the idiom is *'a person who gives generously'*.")

And the conclusion the guide internalizes, verbatim:

> **కనుక భాషతో పరిచయం ఉన్నవారికే ఆ భాషలో ఉన్న జాతీయం అర్ధమవుతుంది.**

("Therefore only those familiar with the language understand an idiom in that language.")

### 7b. 🔑 The governing rule — de-idiomatize, do not transfer

> **For an educational AI platform, English idioms are rewritten into plain statements rather than
> swapped for Telugu idioms.**

**Two sourced reasons.** (a) Idiom comprehension is gated on deep familiarity — the sentence quoted
above says so directly. (b) A `te-easy` variant is downstream (§8), and **idioms are the first thing
plain-language work removes**, so an idiom substituted in `te` has to be removed again in `te-easy`.
A third reason is editorial rather than sourced: **substituting an unrelated Telugu idiom silently
adds cultural content the English source did not have.**

### 7c. The English-side watch list — rewrite these before translation

⚠ **Craft, unsourced in its recommendations, and requiring native review before publication.** The
Telugu column is intentionally absent except for the one row where an attested Telugu solution
exists.

| # | English idiom in ed-tech prose | The calque to reject | Handling |
|---|---|---|---|
| 1 | "under the hood" | a car-bonnet metaphor, which is not Telugu | **De-idiomatize:** "internally", "in the internal working". Say what happens, not where the lid is |
| 2 | "black box" | a literal "black" + "box" reads as a physical dark box | **Keep the English term and gloss it** with the §6f pattern: term, English in parentheses, one clause of explanation |
| 3 | "train a model" | a training calque with **human-class** agreement asserts the model is a person (§4d) | Use the training/practice vocabulary but **keep the system in the non-human class** |
| 4 | "the model learns" | direct calque personifies | Follow the attested framing **యంత్రాలచేత ప్రదర్శించబడే** — "displayed *by* machines", instrumental, non-human. **Sourced pattern** (§4d) |
| 5 | "garbage in, garbage out" | a word-for-word pair produces nonsense | **Paraphrase to a plain statement:** poor input data produces poor results. Do not hunt for a proverb |
| 6 | "cutting-edge" / "state of the art" | a blade-edge calque | **De-idiomatize:** "the newest", "the most advanced" |
| 7 | "a rule of thumb" | a thumb calque reads as anatomy | **De-idiomatize:** "a rough guideline" |
| 8 | "in a nutshell" | a nut-shell calque | **Use the attested సంక్షిప్తంగా** `U+0C38 U+0C02 U+0C15 U+0C4D U+0C37 U+0C3F U+0C2A U+0C4D U+0C24 U+0C02 U+0C17 U+0C3E` ("in short"), which appears in real Telugu technical prose (§6e). **The one row with an attested Telugu solution** |
| 9 | "keep an eye on" a metric | an eye calque | **De-idiomatize:** "observe", "monitor" |
| 10 | "low-hanging fruit" | fruit on a branch | **De-idiomatize:** "the easiest cases first" |
| 11 | "the bottom line" | a line at the bottom | **De-idiomatize:** "the main point" |
| 12 | "you're on the right track" | a railway-track calque | **De-idiomatize into direct praise** — and note this string carries the register decision, because it addresses the reader: **మీరు** and the **-ారు** verb form (§4a) |

⚠ **Declared gap:** **no sourced Telugu idiom equivalents exist in this guide.** The idiom dictionary
is cataloged and unreadable; the article names the standard idiom compilers, which is a real lead
for a search-enabled or browser-equipped pass. **Until then the de-idiomatization strategy is the
deliverable, and it is a complete one.**

Sources: <https://te.wikipedia.org/wiki/జాతీయములు> · <https://te.wikipedia.org/wiki/తెలుగు సామెత> ·
<https://bharatavani.in/home/dictionaries> · <https://te.wikipedia.org/wiki/కృత్రిమ మేధస్సు> ·
[translation-quality](../translation-quality.md)

---

## 8. Simplified-language pendant (`te-easy`)

### 8a. ⚠ No Telugu plain-language standard was located

**Stated as "not found", never as "does not exist".** What was checked:

1. **The Government of India language portal**, whose Telugu catalog of 68 entries was enumerated
   in full: **no plain-language, easy-read, or simplified-Telugu title.**
2. **The Telugu-language encyclopedia index**, searched for the obvious terms — సులభ భాష ("easy
   language"), సరళ భాష ("simple language"), సులభ తెలుగు. **No hit resembling a plain-language norm**;
   the results were unrelated articles on sandhi, grammar, the alphabet, and a simple machine.
3. **There is no Telugu equivalent of the codified European easy-language norms** that the research
   could evidence.

⚠ **Caveat on the strength of that negative:** the research ran **without web search**, so this is
*"absent from the portals reachable and enumerable"*, not *"proven not to exist"*. A human with
search should re-check. Note also that this is the **normal case** — the same honest finding was
recorded for several earlier languages in this series; a codified plain-language norm outside a
handful of European languages is the exception, not the rule.

> **→ Consequence: `te-easy` inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). Under the authoring directive that is a
> legitimate, complete answer — not a gap to fill with invented local norms. **`te-easy` for Telugu is
> editorial policy, not conformance to a norm, and this guide says so rather than implying otherwise.**

### 8b. The axis that *does* exist, and is sourced — but it is **two** axes, not one

**The complex→everyday axis in Telugu is Sanskrit-derived vocabulary against native Dravidian
vocabulary**, and Telugu grammar names the pair explicitly. The grammar article's own component list
includes, verbatim:

> **ప్రకృతి - వికృతి**

(*prakruti–vikruti*: the Sanskrit source form and its Telugu-modified form.) **This is a standard
component of Telugu grammar teaching** — so the register axis is grammatically institutionalized even
though no plain-language *standard* exists. It is examined: a Telugu newspaper's teacher-recruitment
study portal opens its vocabulary unit with **పదసంపద, పదజాలం అనంతంగా ఉన్న తెలుగు భాషలో ఎక్కువగా వినియోగించే
పదాలకు అర్థాలు, నానార్థాలు, తర తరాలుగా రూపం మార్పులతో ఏర్పడే ప్రకృతి-వికృతులు, జాతీయాలను అభ్యర్థులు తెలుసుకోవాలి.**
(“candidates must know the meanings, the multiple senses, and the *prakruti–vikruti* forms produced
by change of shape across generations”.)

> **🔑 And here is the distinction that decides whether §8c is usable at all: “native everyday word”
> and “వికృతి” are two different categories, not one.** The grammar article's own four-way split of
> the Telugu lexicon, verbatim:
>
> **గ్రామ్యములు  (ఇవి అచ్చ తెలుగు పదములు)** · **ప్రాకృత పదములు (ఇవి సంస్కృతం నుండి అరువు తెచ్చుకున్న పదాలు)** ·
> **వికృత పదములు (ఇవి సంస్కృత పదాలకు కొన్ని మార్పులు చేయగా ఏర్పడిన పదాలు)** ·
> **అరువు పదములు (ఇవి ఉర్దూ, ఆంగ్లం మొదలగు భాషల నుండి అరువు తెచ్చుకున్న పదాలు)**
>
> with its own worked example on one English word, *happy*: **అలరాటం** (native) · **సంతోషం**
> (Sanskrit-derived) · **సంతసం** (వికృతి) · **ఖుషి** (loan).
>
> **So a వికృతి is not the native word — it is a third thing, a Sanskrit word reshaped inside
> Telugu.** The exam portal enforces the distinction directly: asked to pick the **incorrect**
> *prakruti–vikruti* pair from **1) ఆవేశం- ఆవేసం  2) ఆళి-ఓలి  3) గృహము- ఇల్లు  4) కథ- కత**, its answer
> key gives **29-3** — **గృహము–ఇల్లు is *not* a prakruti–vikruti pair**, because **ఇల్లు** is
> అచ్చ తెలుగు, native, not a reshaping of **గృహము**.
>
> **→ Two axes, and §8c measures both:** **(A)** Sanskrit-derived → **అచ్చ తెలుగు** native word, and
> **(B)** ప్రకృతి → వికృతి. **Only (A) produces everyday words. (B) is where the trap is.**

⚠ **Tier of the pair lists.** The grammar article carries Telugu Wikipedia's own “no sources given”
banner — **ఈ వ్యాసాన్ని ఏ మూలాల నుండి సేకరించిన సమాచారాన్ని ఆధారంగా చేసుకొని వ్రాసారో తెలపలేదు.** — and it
contains at least two demonstrable errors (§8c). **It is used here to *generate* candidate pairs, never
to certify one.** Every row in §8c is certified by a second source, by measurement, or by both.

The diglossia debate was fought partly on this ground, and its advocates' position reads like a
`te-easy` brief, verbatim:

> **వాడుక భాష ప్రజల భాష. గ్రాంథిక భాష పండితుల భాష.**

("The everyday language is the people's language. The literary language is the scholars' language.")

and, on textbooks specifically:

> **మారుతున్న కాలానికి అనుగుణంగా శాస్త్ర, సాంకేతిక రంగాలలో విజ్ఞానం పెంపొందించుకోవాలంటే పాఠ్యగ్రంథాలు వాడుక భాషలోనే ఉండాలి.**

("If knowledge in the scientific and technical fields is to be developed in keeping with changing
times, **textbooks must be in the everyday language**.")

**That is the closest thing to a sourced mandate for a `te-easy` variant this guide contains, and it
comes from the movement that won** (§4a).

### 8c. The complex→everyday word table — sourced, measured, and shorter than the template asks

**Tier is marked per row.** **Grammar-list** = the pair appears in the Telugu grammar article (§8b,
community tier, banner-flagged). **Exam-key** = the pair is confirmed by a Telugu newspaper's
teacher-recruitment study portal, dated 22-01-2024 and signed by its author — an independent,
editorially-controlled second source. **Dictionary** = the equivalence is stated on the Telugu
Wiktionary entry for the everyday word (community tier, but a fetched, quotable statement).
**Corpus** = measured; method under the table.

**Axis (A) — Sanskrit-derived → అచ్చ తెలుగు native word. This is the axis that works.**

| Sanskrit-derived (heavy) | Everyday Telugu | Corpus: formal / everyday | Tier |
|---|---|---:|---|
| **గృహం** | **ఇల్లు** | **0 / 15** | **Exam-key + Dictionary + Corpus** |
| **జలం** | **నీరు** | **0 / 19** | **Dictionary + Corpus** |
| **వృద్ధ** | **పెద్ద** | **1 / 105** | **Grammar-list + Corpus** — ⚠ **not exact synonyms**: **వృద్ధ** is *aged*, **పెద్ద** is *big / elder*. Use only where “elder” is the sense; §8g.3 |
| **భారం** | **బరువు** | **12 / 15** | **Grammar-list + Corpus** |
| **సహాయం** | **సాయం** | **12 / 14** | **Grammar-list + Corpus** |
| **కుఠారం** | **గొడ్డలి** | **0 / 52** | **Grammar-list + Corpus** |
| **భృంగారం** | **బంగారం** | **0 / 45** | **Exam-key + Corpus** |

The two Dictionary-tier rows rest on the Telugu Wiktionary entries themselves: **నీరు** lists
**;పర్యాయపదాలు: నీరము** and **;నానార్థాలు: ఉదకము · జలము · దాహం**, and **ఇల్లు** defines itself as
**ఇల్లు అంటే నివాసము ఉండే నిర్మాణము./గృహము** with **;నానార్ధాలు: నివాసము · గృహము · గేహము**.

🔑 **Read the “Exam-key” tier on row 1 the right way round.** The exam key's ruling on
**గృహము–ఇల్లు** is that it is **not** a *prakruti–vikruti* pair (§8b) — which is precisely what
qualifies it here: it is an **axis (A)** pair, Sanskrit-derived word against native word, and that is
the axis that produces everyday Telugu. **The exam key certifies the category, the corpus certifies
the direction.**

> **🔴 Seven rows, not ten, and it is not padded.** Every candidate pair that could not be certified
> was dropped rather than guessed at — including two that the grammar article gets **wrong**:
> **శాస్త్రము → చట్టము** is not a register pair at all (**చట్టం** means *law*; its 21 corpus
> occurrences are all legal contexts), and its first table row pairs **వుపవాసము** with **అమ్మ**, which
> is simply broken. **A source that ships errors like these cannot certify a row on its own** — which
> is why the tier column exists.

**Corpus method.** Measured 2026-07-27 over **1,097,461 characters / 129,027 Telugu word tokens**,
202 article pages fetched as raw bytes from three modern Telugu outlets (an international
broadcaster's Telugu service, and two Telugu news sites) and counted locally, never through a
summarizing layer (§2a). Counts are **exact whole-token matches**, with the **-ము / -ం** spelling
variants of the same word folded together (**భారము** and **భారం** count as one form).

⚠ **Three limits, and the third is the one that matters.** (1) Telugu is agglutinative, so an exact
token count **misses inflected forms** — **ఇంటికి** is not counted under **ఇల్లు**. **Every number
above is a floor**, and the *comparison between the two members of a row* is the finding, not the
absolute value. (2) Prefix matching was tried as a fix and **discarded as unusable**: **ఆస** matches
**ఆసక్తి** and **ఆసుపత్రి**, **కత** matches **కత్తి**. (3) The corpus is **press**, harvested on one
day; it is not a learner corpus and **no Telugu learner corpus was obtained** (§8g).

### 8d. 🔴 Do NOT “simplify” along axis (B) — the ప్రకృతి→వికృతి swap is a trap, and here is the measurement

**This is the highest-value part of §8.** A translator handed §8b's axis will reach for the వికృతి
column. **The వికృతి column is archaic.** Measured across the same 129,027 tokens, every one of these
native-looking forms occurs **exactly zero times** while its Sanskrit-derived partner is in ordinary
daily use:

**Every pair below is Grammar-list tier** — it is taken from the grammar article's own
*prakruti–vikruti* table (§8b), so these are pairs a Telugu source actively teaches. **Two are also
Exam-key tier**: **కథ – కత** is one of the three pairs the exam key's item 29 implicitly certifies as
*correct* (its answer is option 3, **గృహము–ఇల్లు**), and **ఆహారము – ఓగిరము** is certified outright by
its item 2. The corpus column is this guide's measurement.

| Do **not** rewrite this | as this | Corpus: kept form / “simpler” form |
|---|---|---:|
| **కథ** (story) | ~~**కత**~~ | **65 / 0** |
| **రాజు** (king) | ~~**రేడు**~~ | **57 / 0** |
| **రాత్రి** (night) | ~~**రాతిరి**~~ | **38 / 0** |
| **ఆహారం** (food) | ~~**ఓగిరం**~~ | **25 / 0** |
| **దృష్టి** (attention, view) | ~~**దిష్ఠి**~~ | **23 / 0** |
| **శక్తి** (power) | ~~**సత్తి**~~ | **23 / 0** |
| **కష్టం** (difficulty) | ~~**కస్తి**~~ | **18 / 0** |
| **విద్య** (education) | ~~**విద్దె**~~ | **18 / 0** |
| **భాష** (language) | ~~**బాస**~~ | **17 / 0** |
| **సందేహం** (doubt) | ~~**సందియం**~~ | **15 / 0** |
| **పుస్తకం** (book) | ~~**పొత్తం**~~ | **13 / 0** |
| **సముద్రం** (sea) | ~~**సంద్రం**~~ | **12 / 0** |
| **నిజం** (truth) | ~~**నిక్కం**~~ | **11 / 0** |

**ఆహారం → ఓగిరం is the exam-key's own certified pair** — asked for the వికృతి of **ఆహారము** against
**ఆకారము · భోజనము · తిండి · ఓగిరము**, the answer key gives **2-4**, i.e. **ఓగిరము**. So the pair is
*correct grammar* and *dead usage* at the same time. **That is the whole warning in one row.**

**And axis (A) inverts too, once the vocabulary turns abstract.** For basic concrete nouns the native
word wins (table in §8c). For the written, abstract vocabulary an educational text actually runs on,
**the Sanskrit-derived word IS the everyday word** and swapping it out makes the text stranger, not
simpler:

| Do **not** rewrite this | as this | Corpus | Where the pair comes from |
|---|---|---:|---|
| **సమయం** (time) | ~~**వేళ**~~ | **38 / 17** | Wiktionary **వేళ**: **వేళఆంటే రోజులో ఒక భాగాన్ని, మొత్తము రోజు ని కూడా వేళ గా వ్యవహరిస్తారు./సమయము/ కాలము** |
| **మార్గం** (way, method) | ~~**దారి**~~ | **25 / 7** | Wiktionary **దారి**: **పయనిచడానికి అనువైనది దారి ./మార్గం**, and its **;వ్యుత్పత్తి:** field reads **వైకృతము** — so this one is axis (B) after all |
| **ప్రారంభం** (beginning) | ~~**మొదలు**~~ | **24 / 7** | Wiktionary **మొదలు**, **;నానార్థాలు:** **అంకురార్పణ · ప్రారంభము** |
| **ఆహారం** (food) | ~~**తిండి**~~ | **25 / 3** | Wiktionary **తిండి**, **;వ్యుత్పత్తి:** **దేశ్యము** (native), **;నానార్థాలు:** **ఆహారము** — a clean axis (A) pair, and the native member still loses 25 to 3 |

> **🔴 Read §8c and §8d as one statement.** The Sanskritic↔native axis is **real, sourced, and
> grammatically institutionalized** — and it is **not a substitution rule**. It is a *lexical stratum*
> distinction, and only the concrete, high-frequency end of it lines up with “easier”. **A script must
> never be pointed at these tables**, and a reviewer who “improves” `te-easy` by pushing every
> Sanskrit-derived word toward its native or వికృతి partner has produced archaic Telugu, not easy
> Telugu. Where a row is not in §8c, **keep the word and explain it** (§8f.2, §8f.4).

### 8e. 🔴 `te-easy` keeps మీరు

> **Decision, recorded so that nobody "fixes" it: `te-easy` keeps మీరు. It does NOT switch to
> నువ్వు.**

| | Reader address in `te-easy` | Why |
|---|---|---|
| ✅ | **మీరు** with **మీ** — the same as `te` | easy-language work simplifies **vocabulary and syntax**, not social distance |
| ❌ | **నువ్వు** with **నీ** — "friendlier for an easy variant" | ⚠ familiar address from an institution to an unknown adult is a **social claim**, not a comprehension gain — and it is **unattested** in institutional Telugu (§4a) |

**`te-easy` readers include adults with lower literacy** — precisely the audience for whom being
addressed familiarly by an institution is most demeaning. **Simplify the morphology, keep the
courtesy.**

### 8f. What `te-easy` is actually built on

⚠ **Craft, derived from sourced facts elsewhere in this guide and labeled as derivation.**

1. **Stay in వ్యావహారికం**, and move along the Sanskritic→native axis **only where §8c has a measured
   row** — **ఇల్లు**, **నీరు**, **సాయం**, **బరువు**, **పెద్ద**. ⚠ **This point used to read “go
   further from Sanskritic vocabulary”; the measurement in §8d contradicts that** — pushed past the
   concrete basic vocabulary, the native and వికృతి forms are archaic, and the Sanskrit-derived word
   is the everyday one. **Where §8c is silent, keep the word.**
2. **🔑 Prefer the attested form over the "purer" one.** For computing artifacts this generally means
   the transliteration the reader has actually seen: **కంప్యూటర్**, not the calque **గణన యంత్రం**,
   which has **zero occurrences** across all four corpora (§6d). **This is the kit's term-preservation
   rule in its Telugu form — keep the technical term, explain it, never substitute a folksy
   stand-in.**
3. **Shorten sentences aggressively.** Agglutination already makes individual words long (§3b, §4b);
   long sentences compound into unparseable lines on a phone.
4. **Remove idioms entirely** (§7) — and **keep the term + English-gloss pattern** (§6f), which helps
   rather than hinders a reader whose technical exposure is English-mediated.
5. **Keep the -ారు verb forms.** The register decision propagates into every verb; it is not a
   pronoun swap (§4a).

### 8g. What is still open

**Narrowed, not closed.** §8a's finding stands unchanged: **no Telugu plain-language standard was
located**, and §8c is a *lexical-stratum* table plus a measurement — a weaker and different thing than
a norm. What a human should still get, in order of value:

1. **A Telugu learner corpus.** The state textbook boards' own domains **failed to connect** on this
   pass (**scert.telangana.gov.in** and **apscert.gov.in**, both a refusal at the network layer, as in
   §2), so the plain side of every number in §8c/§8d is **press**, not teaching material. With school
   textbook text, §8c's rows could be re-measured against the register they are actually written for.
2. **The school-level Telugu–Telugu dictionary**, still **catalog-visible and content-inaccessible**
   behind a JavaScript reader (§2c). It would raise several §8c rows from Grammar-list tier to
   dictionary tier and would certify the pairs the grammar article gets wrong.
3. **A Telugu editor** to rule on the four rows where the two members are not exact synonyms
   (**వృద్ధ**/**పెద్ద**, **మూలిక**/**మొక్క** — the latter dropped from §8c for exactly this reason).

Sources: <https://bharatavani.in/home/dictionaries> · <https://te.wikipedia.org/wiki/తెలుగు వ్యాకరణం> ·
<https://te.wikipedia.org/wiki/ప్రకృతి_-_వికృతి> (⚠ community tier, carries its own “no sources given”
banner; candidate generation only) ·
<https://te.wikipedia.org/w/index.php?title=ప్రకృతి_-_వికృతి&action=raw> (the pair table read as
wikitext rather than as rendered HTML) ·
<https://pratibha.eenadu.net/jobs/lesson/dsc/trt/dsc-telangana/telugumedium/vocabulary/2-1-8-836-1281-1678-13505-22084-23040004784>
(exam-key tier: a Telugu newspaper's teacher-recruitment study portal, posted 22-01-2024) ·
<https://te.wiktionary.org/wiki/నీరు> · <https://te.wiktionary.org/wiki/ఇల్లు> ·
<https://te.wiktionary.org/wiki/వేళ> · <https://te.wiktionary.org/wiki/దారి> ·
<https://te.wiktionary.org/wiki/మొదలు> · <https://te.wiktionary.org/wiki/మార్గము> ·
<https://te.wiktionary.org/wiki/తిండి> ·
<https://te.wikipedia.org/wiki/వ్యావహారిక భాషోద్యమం> · <https://dsal.uchicago.edu/dictionaries/brown/> ·
corpus fetched 2026-07-27 from <https://www.bbc.com/telugu> · <https://ntvtelugu.com/> ·
<https://www.eenadu.net/> · unreachable on this pass: <https://scert.telangana.gov.in/> ·
<https://apscert.gov.in/> ·
[accessibility-workflow](../accessibility-workflow.md) · [translation-quality](../translation-quality.md)

---

## 9. Regional variation

### 9a. Two states, one language — and dialect carries a prestige penalty

Andhra Pradesh and Telangana separated in **2014**; both retain Telugu as official language. The
dialect article states the social fact that governs neutral editorial writing, verbatim:

> **మాండలిక భాషని న్యూన ప్రామాణికం (Substandard form) గా చూస్తారు. అంటే ప్రధాన భాషకన్న తక్కువగా - చిన్నచూపు ఉంటుంది. మాండలిక భాష వ్యవహార ప్రధానమైనది.**

("Dialect is regarded as a substandard form. That is, it is looked down on as lesser than the main
language. Dialect is primarily a spoken matter.")

> **→ This is why neutral educational prose avoids regionally marked vocabulary: in Telugu, dialect
> carries an explicit prestige penalty, and marking your text as regional marks it as lesser.**

On the Telangana variety specifically: **ఉదాహరణకి తెలంగాణా తెలుగుపై ఉర్దూ ప్రభావం వల్ల ప్రత్యేకత
సంతరించుకుంది.** ("Telangana Telugu has acquired its distinctiveness through Urdu influence.")

### 9b. Which variety is neutral — a historical argument, not a current ruling

The diglossia article records the standard-setting argument, verbatim — and note this is **the
position the వ్యావహారికం advocates argued**, not a decree:

> **వాడుక భాషలో భేదాలున్నాయి. అయితే అందరూ కలిసి కోస్తా మాండాలికాన్నే వాడుతున్నారు. కాబట్టి కోస్తా మాండలిక ఆంధ్రమే అనుసంధాన భాషగా ఉంటుంది.**

("There are differences within the everyday language. However, everyone together uses the **coastal**
dialect. Therefore coastal-dialect Telugu will serve as the **link language**.") **కోస్తా** = coastal
Andhra.

⚠ **This is a ~1900s movement argument reported by a community source; it is not a current official
ruling, and it predates the 2014 bifurcation by a century.** Present it as the historical basis of the
standard. **Do not tell a Telangana reader that their variety is non-standard.**

**Corroborating evidence that the variation is lexically real and institutionally recognized:** the
government catalog carries dedicated dialect dictionaries for **Telangana** and for **Rayalaseema**,
plus a general regional-dialect dictionary — **and none for coastal Andhra.** Dictionaries get written
for the *marked* varieties; the absence of a coastal volume is itself evidence of which variety is
treated as unmarked.

### 9c. 🔴 Andhra Pradesh versus Telangana orthography — answered only negatively

**Established:** both states have Telugu as official language; the **lexicon** differs, with Urdu
influence identified as the distinguishing factor for Telangana; dedicated Telangana usage
dictionaries exist; and the shared terminology institution was **weakened by the split** (§2b).

**Not established, and this is the honest answer:**

> ⚠ **No evidence of divergent official orthography between the two states was found — and equally,
> no source explicitly affirming that the orthography is shared.** The domains that would carry such a
> statement **refused connection** (§2b). What the corpus shows is that **three publishers with
> different regional histories show no spelling-system differences** in the material measured: same
> character inventory, same ASCII digits, same punctuation, same ZWNJ conventions.
>
> **Report that as exactly what it is — an observation of absence at byte level.** 🔴 **Never upgrade
> it into "the two states use identical orthography, sourced."**

**Working position:** treat `te` as **one orthography, two lexical catchments**. Spell the same
everywhere; where a word choice is regionally marked, prefer the form attested in pan-Telugu national
media; and send genuine doubt to a native reviewer **who is told which state they are reviewing for**.

### 9d. ⚠ Caste-, occupation-, and religion-marked vocabulary — the axis is live, the word list is not

The dialect article documents the axis directly, verbatim:

> **కులాన్ని బట్టి, వృత్తిని బట్టి, మతాన్ని బట్టి మాండలిక భాషాభేదాలు ఏర్పడతాయి. … క్రైస్తవమతస్థులైన తెలుగువారి భాషకి, హిందూ మతస్థులైన తెలుగువారి భాషకి భేదాలు గమనించవచ్చును.**

("Dialect differences form according to caste, according to occupation, according to religion. …
Differences can be observed between the Telugu of Christians and the Telugu of Hindus.")

> 🔴 **What this guide will not do.** It will **not** list specific words to avoid. The occupational
> dialect dictionaries that would supply such a list are cataloged and **not served as text** (§2c).
> **The sourced statement is: the axis exists and is real. The unsourced part is: which words carry
> it.** State the principle, route lexical doubt to a native reviewer, and do not pretend to a
> blacklist.

### 9e. ⚠ Diaspora — not established

Destination countries are named by a community source; **no sourced statement about diaspora usage
differing from homeland usage was obtained.** For an educational platform this is probably low-stakes:
diaspora readers of Telugu-script content are overwhelmingly reading the same standard. ⚠ Marked
unverified rather than asserted either way.

Sources: <https://te.wikipedia.org/wiki/తెలుగు మాండలికాలు> · <https://te.wikipedia.org/wiki/వ్యావహారిక భాషోద్యమం> ·
<https://te.wikipedia.org/wiki/తెలుగు అకాడమి> · <https://bharatavani.in/home/dictionaries> ·
<https://en.wikipedia.org/wiki/Telugu_language>

---

