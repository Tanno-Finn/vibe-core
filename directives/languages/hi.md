<!-- base -->
# lang-hi — Hindi (हिन्दी) — language guide

> **Setup & sources live in [`hi.setup.md`](hi.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** हिन्दी / Hindi. The written standard this guide targets is **Modern
Standard Hindi (MSH)** in the Devanagari script.
**BCP 47 code (base):** `hi`.
**BCP 47 code (simplified variant):** `hi-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`hi-x-simple`), but the kit
token `hi-easy` is the one that counts here.
**Speaker reach:** roughly **~425 million first-language speakers plus ~120 million second-language
speakers** (⚠ approximate — the total is methodology-dependent: sources differ on whether they
count only Modern Standard Hindi or a wider set of "Hindi-belt" varieties, so any single global
number is partly a counting decision, not a census fact). Official language of the Union of India
in Devanagari script (Constitution, Article 343), alongside English for many official purposes;
large diaspora communities (e.g. Fiji, and Hindi-speaking populations elsewhere).
**Script + direction:** Devanagari (देवनागरी), a Brahmic **abugida**; **left-to-right (LTR)**.
Consonants carry an inherent vowel; dependent vowel signs (मात्रा / *mātrā*) and the virama/halant
modify it, and consonant clusters form conjuncts — so shaping and cursor movement are more complex
than in Latin text even though direction is plain LTR.
**Status:** **planned — authored from external desk research; not yet reviewed by a native
speaker.** Covers base `hi` and the `hi-easy` pendant. Load-bearing typography anchors (Unicode
line-breaking, W3C Indic layout, the Devanagari block chart) were **independently re-fetched and
are confirmed** (see CITE-VERIFY in §2); the Indian-government terminology authorities (CSTT /
Rajbhasha) **could not be independently fetched — their servers refused the connection from the
research tool** — so their page content is recorded here on the strength of their being
well-established real bodies, not on a confirmed read. A later pass settled the previously open
question of **which quotation pair Hindi publishing actually uses**, by measurement across seven
publications rather than by prescription — see §3; the finding does **not** match the locale
default, and one earlier ❌ example was withdrawn as a result. Per the authoring directive's "second
set of eyes" rule, this header records these facts honestly.
**Easy or hard for this kit:** whitespace *works* in Hindi's favor — words are space-separated,
so ordinary tokenization and word-boundary highlighting apply. The hard parts: **conjunct shaping
via the virama/halant (्)**, which needs a fully Indic-capable font and layout engine;
**combining marks** (मात्रा vowel signs, the nukta ़, anusvāra/candrabindu) that are load-bearing
and must never be stripped or reordered; **native digits (०–९) under a lakh/crore grouping
system**; and a **register/vocabulary neutrality** problem (Sanskritized vs Persian/Urdu-marked
words) that shapes editorial choice on every page.

Sources: <https://en.wikipedia.org/wiki/Hindi> ·
<https://www.constitutionofindia.net/articles/article-343-official-language-of-the-union/> ·
<https://www.unicode.org/charts/PDF/U0900.pdf>

---

## 1. Header block

See above. One-line orientation: Hindi is an Indo-Aryan, **SOV**, LTR abugida with a shared
written standard (MSH) across the Hindi belt; localization risk concentrates in **conjunct/matra
rendering, native-digit + lakh/crore number formatting, honorific register (आप), and
Sanskritized-vs-Urdu vocabulary neutrality**.

Sources: see the header block's Sources line above (Wikipedia profile · Constitution Art. 343 ·
Unicode Devanagari chart).

---

## 4. Grammar for translators

**Word order.** Hindi is **SOV** (Subject–Object–Verb): the verb comes last, and case relations
are marked by **postpositions** *after* the noun, not prepositions before it.

- ✅ **मैं हिन्दी सीख रहा हूँ** — "I am learning Hindi" (lit. *I Hindi learning am*).
- ❌ **मैं सीख रहा हूँ हिन्दी** — verb pushed mid-clause (English order): understood but marked;
  UI copy keeps verb-final order.

**Register / politeness — and the project's recorded choice.** Hindi's second person has three
tiers, each with its own verb agreement: **तू** (intimate/low), **तुम** (familiar), **आप**
(respectful/honorific, grammatically plural). Educational and government Hindi conventionally
addresses the reader with **आप**; the round-2 research ties this to CSTT/Rajbhasha public-facing
usage and to formal-register teaching grammars (आप for older/higher-status/respected audiences,
the default for textbooks and official communication).

> **Register decision (human-gate): आप (āp) — taken and recorded.** On the quality argument the
> register is the **respectful/formal second person आप** for `hi` and
> `hi-easy`, consistent with the CSTT/Rajbhasha public-education sourcing above. **Binding for all
> second-person copy** — no drift to तुम/तू, including in informal or playful passages. आप takes
> **plural/honorific verb agreement** (e.g. imperative **-एं / -इए**: खोलें, कीजिए), and this
> agreement must be held consistently, not just the pronoun.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

The grammar features that break a naive EN/DE → HI translation:

**(1) Pronoun + honorific agreement (आप).** English's register-flat "you" and German du/Sie do not
carry the tier automatically; the wrong tier in a formal UI is a social error, and the *verb* must
agree with आप, not just the pronoun.

- ✅ **आप अपना खाता खोलें** — "Open your account" (आप + honorific imperative खोलें).
- ❌ **तुम अपना खाता खोलो** — familiar tier + familiar verb ending in a formal UI.

**(2) Gender agreement.** Adjectives, participles, and verb forms agree with the noun's
grammatical gender. A source with a single register-flat wording breaks when the Hindi noun's
gender is not respected.

- ✅ **नई पाठ-इकाई तैयार है** — "The new lesson(-unit) is ready" (इकाई is feminine → नई).
- ❌ **नया पाठ-इकाई तैयार है** — masculine adjective नया forced onto a feminine noun.

**(3) Postpositions, not prepositions.** Case/relation words follow the noun.

- ✅ **पाठ में** — "in the lesson" (postposition में *after* पाठ).
- ❌ **में पाठ** — English preposition-first order (reads as broken Hindi).

**(4) Light-verb (compound-verb) constructions.** A direct English lexical verb often isn't
natural; Hindi uses a noun/stem + a light verb (करना, होना, देना …).

- ✅ **खोज करें** / **खोजें** — "Do a search / Search".
- ❌ **एक खोज करो** — indefinite "a" calqued as एक + familiar करो; the natural form drops "एक" and
  keeps the आप register.

**(5) Relative–correlative (जो … वह …) structures.** English "what … is …" / "if … then …" maps
to paired जो…वह / अगर…तो forms, not a single embedded clause.

- ✅ **आप जो क्लिक करते हैं, वह सहेजा जाता है** — "What you click is saved."
- ❌ **आप क्लिक करते हैं वह सहेजा जाता है** — the जो correlative dropped; the clause link is lost.

Sources: (grammar features — round-1 desk research; register additionally per round-2
CSTT/Rajbhasha framing, ⚠ CSTT page unconfirmed, §2)
<https://en.wikipedia.org/wiki/Hindi_grammar> ·
<https://www.britannica.com/topic/Hindi-language>

---

## 5. Numbers, dates, currency

**Digit system.** Two systems appear on the Hindi web: **Devanagari digits ० १ २ ३ ४ ५ ६ ७ ८ ९**
(U+0966–U+096F) and **Western digits 0–9**. Constitution Article 343 names the numeral form for
**the official purposes of the Union** as the "**international form of Indian numerals**"; in
modern digital systems that is **in practice often** read as Western digits (⚠ the "official
software contexts" reading is the research's gloss on current practice, **not** the Article's
text — Article 343 concerns official purposes and says nothing about software).
General/educational Hindi content uses either. **Rule: pick one system per context and never mix
systems inside a single number** (see §11).

**Grouping — Indian lakh/crore, not thousands.** Hindi groups by the South Asian system:

- १,००० — one thousand (**हज़ार**)
- १,००,००० — one **lakh** (**लाख**)
- १,००,००,००० — one **crore** (**करोड़**)
- Full example: **१२,३४,५६७** (grouping `12,34,567`, **not** `1,234,567`).

Localized numeric output must use lakh/crore grouping and the units हज़ार / लाख / करोड़, not
million/billion, unless the source explicitly demands international formatting.

**Decimal separator.** A **dot `.`** is the decimal separator, with **comma as the group
separator** — confirmed against **CLDR 48.2** `hi` (grouping pattern `#,##,##0.###`, i.e. the
Indian grouping above with a dot decimal).

**Dates.** Day–month–year order (**DD-MM-YYYY**) is standard Indian usage; exact punctuation
varies by context. CLDR 48.2 `hi` gives short `d/M/yy`, medium `d MMM y`, long `d MMMM y`.
ISO 8601 (YYYY-MM-DD) is a backend/technical convention, not the end-user default.

**Currency.** Indian rupee, symbol **₹ (U+20B9)**, ISO 4217 **INR**, placed **before** the amount:
**₹500**. Currency does not vary across the Hindi belt.

- ✅ **₹500** · lakh/crore grouping **१२,३४,५६७**
- ❌ **500₹** · Western triple grouping **12,34,567 → 1,234,567** (wrong grouping for Hindi)

Sources: <https://www.constitutionofindia.net/articles/article-343-official-language-of-the-union/> ·
<https://www.unicode.org/cldr/charts/latest/summary/hi.html> ·
<https://cldr.unicode.org/downloads/cldr-48>
(separator, grouping, currency, and date values re-checked against **CLDR 48.2**, 2026-03-17,
superseding the round-1 CLDR 47 citation — the values were unchanged)

---

## 6. Terminology strategy

**Loanword vs coinage.** Hindi technical vocabulary mixes **established loanwords**, **calqued
native/Sanskrit-derived coinages**, and **English borrowings transliterated into Devanagari**.
Government and educational glossaries (CSTT/Rajbhasha) prefer standardized Hindi equivalents where
they exist; fast-moving fields more often keep the English label transliterated (मशीन लर्निंग) and
explain the concept in Hindi. **Working rule: prefer the established sector/CSTT term over a novel
coinage; keep well-known English acronyms (AI, ML, NLP) in Latin, glossed on first use.**

**Transliteration.** For slugs/identifiers/search indexes use a systematic Latin transliteration
(ISO 15919 is the standard scheme for Devanagari→Latin); never display raw transliteration in
user-facing body text.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give target term + original English + one short
plain gloss, then use the Hindi term alone afterwards. Instantiated:

> **तंत्रिका नेटवर्क** (neural network) — एक ऐसा गणना-मॉडल जो मानव-मस्तिष्क के न्यूरॉन्स की तरह
> परतों में व्यवस्थित होता है। *("a computational model arranged in layers, like the neurons of
> the human brain.")* — then **तंत्रिका नेटवर्क** / **न्यूरल नेटवर्क** alone on later mentions.
> (The explanatory clause is authored per the sandwich format, not a sourced string.)

**Seed field vocabulary (AI/ML).** ⚠ **Provenance — read this before using the table.** The CSTT
AI/ML glossary is **still unpublished** (round-2: a trilingual AI/ML glossary of ~4,500 terms is
under expert review, not yet a citable list). The 15 renderings below therefore come from a
**vendor ML glossary (withheld under source-neutrality, §2)** and **community/blog sources** — so
**each term is marked "informal — not CSTT-verified"**, and the CSTT term bank ("shabd", §2) is
named as the **verification locus** to check each string against when it becomes reachable. Do
**not** claim CSTT authority for any individual string here.

| Concept (EN) | Hindi term(s) | Provenance / status |
|---|---|---|
| Artificial Intelligence (AI) | कृत्रिम बुद्धिमत्ता | informal — not CSTT-verified |
| Machine Learning (ML) | मशीन लर्निंग | informal — not CSTT-verified |
| Deep Learning | डीप लर्निंग / गहन अधिगम | informal — not CSTT-verified |
| Supervised Learning | पर्यवेक्षित शिक्षण | informal — not CSTT-verified |
| Unsupervised Learning | अपर्यवेक्षित शिक्षण | informal — not CSTT-verified |
| Reinforcement Learning | पुनर्बलन शिक्षण | informal — not CSTT-verified |
| Algorithm | एल्गोरिदम (⚠ the variant **एल्गोरिथम** also circulates — unsourced here) | informal — not CSTT-verified |
| Dataset | डेटासेट / डेटा-समूह | informal — not CSTT-verified |
| Training | प्रशिक्षण | informal — not CSTT-verified |
| Model | मॉडल | informal — not CSTT-verified |
| Inference | अनुमान / इनफ़रेंस | informal — not CSTT-verified |
| Neural Network | न्यूरल नेटवर्क / तंत्रिका नेटवर्क | informal — not CSTT-verified |
| Natural Language Processing (NLP) | प्राकृतिक भाषा संसाधन | informal — not CSTT-verified |
| Chatbot | चैटबॉट | informal — not CSTT-verified |
| Explainable AI | व्याख्येय एआई / समझाने योग्य एआई | informal — not CSTT-verified |

Freeze the chosen forms in the project glossary and do not mix competing renderings within the
platform. Project coinages (C1) keep their original spelling and are owned by the term-sheet, not
this table.

Sources: (individual AI/ML strings — vendor ML glossary withheld under source-neutrality + a
Hindi-learning blog; **informal, not CSTT-verified**) <https://hinlish.com/2024/02/artificial-intelligence-vocabulary/> ·
verification locus (⚠ unreachable from here — §2): <https://www.shabd.education.gov.in/> ·
transliteration standard: <https://en.wikipedia.org/wiki/ISO_15919>

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → HI): idiomatic form ✅ vs literal calque ❌.** These are common English
educational/technical stock phrases whose word-for-word transfer into Hindi reads as foreign. Use
the idiomatic column; the calque column is what a naive translation produces and must be avoided.

| English phrase | ✅ Idiomatic Hindi | ❌ Literal calque (wrong) | Provenance |
|---|---|---|---|
| step by step | चरण-दर-चरण | कदम से कदम | translator craft, unsourced |
| under the hood | अंदरूनी तौर पर / भीतर से | हुड के नीचे | translator craft, unsourced |
| out of the box | बिना अतिरिक्त सेटअप के | डिब्बे के बाहर | translator craft, unsourced |
| at a glance | एक नज़र में | एक ग्लांस पर | translator craft, unsourced |
| make sure | सुनिश्चित करें | बनाइए sure | translator craft, unsourced |
| break down | विस्तार से समझाना / विभाजित करना | तोड़ देना | translator craft, unsourced |
| rule of thumb | मोटे तौर पर नियम | अंगूठे का नियम | translator craft, unsourced |
| from scratch | शुरू से | खरोंच से | translator craft, unsourced |
| in the background | पृष्ठभूमि में | पीछे के ग्राउंड में | translator craft, unsourced |
| on the fly | तुरंत / चलते-चलते | उड़ान पर | translator craft, unsourced |
| keep in mind | ध्यान रखें | दिमाग में रखो | translator craft, unsourced |
| user-friendly | उपयोगकर्ता के अनुकूल | यूज़र-फ्रेंडली | translator craft, unsourced |

**⚠ Provenance — confirm with a native speaker.** These renderings are **localization judgment
from desk research**, not an academy-sourced idiom dictionary; forms are context-sensitive and
may vary by audience and register. Treat the idiomatic column as a strong working default a
native-speaker pass should confirm.

Beyond stock phrases, keep the **grammar-level literal-transfer anti-patterns** (re-derived from
§4) alongside the table:

- ❌ **Verb-mid / preposition-first calque** → ✅ SOV + postposition (**पाठ में**, verb last).
- ❌ **Familiar register in formal UI** (*तुम … खोलो*) → ✅ **आप … खोलें**.
- ❌ **Gender-mismatched adjective** (*नया इकाई*) → ✅ agreement (**नई इकाई**).
- ❌ **Dropped जो…वह correlative** → ✅ paired relative–correlative (§4).

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: idiom renderings — desk-research localization judgment, thin provenance (⚠
native-speaker confirmation pending); grammar-level anti-patterns re-derived from §4.

---

## 8. Simplified-language pendant (`hi-easy`)

### 8a. ❌ No codified Hindi plain-language standard exists — and Indian statute names one without requiring it

**The bodies that would hold such a standard were reached and read.** What came back, per body:

| Body / instrument | Reachable? | Plain-language rules for Hindi? | Claim |
|---|---|---|---|
| A Simple-Hindi Wikimedia project | yes, machine-readable | does not exist | ❌ established absence |
| केंद्रीय हिंदी निदेशालय (Central Hindi Directorate) | yes | no | ❌ established absence |
| केंद्रीय हिंदी संस्थान (Kendriya Hindi Sansthan) | yes, via `khs.ac.in` | no | ❌ established absence |
| राजभाषा विभाग (Department of Official Language) | yes | no methodology; one tool named *ई-सरल हिंदी वाक्यकोश*, never described | ⚠ partial |
| GIGW 3.0 (government website guidelines) | yes | plain language required, but qualitative and English-framed | ❌ absence of quantified Hindi rules |
| IS 17802 (Part 1) : 2021 — the binding ICT accessibility standard | yes, full text | Reading Level sits in the optional AAA tier | ❌ absence of a mandate |
| RPwD Act 2016 | yes, full text | "plain-language" appears only in a definition | ❌ absence of a duty |
| वैज्ञानिक तथा तकनीकी शब्दावली आयोग (CSTT) | **no — host unreachable** | unknown | ⚠ inconclusive |
| BIS adoption of ISO 24495-1:2023 | **no — catalog search returned 500** | not found | ⚠ inconclusive |

**The three findings that carry the section:**

1. **The Wikimedia site-matrix API returns seven projects for `hi`** — wiki, wiktionary, wikibooks,
   wikiquote, wikisource, wikiversity, wikivoyage — **and no simplified variant.** `simple` exists in
   the matrix only as its own top-level entry (Simple English). The commonest bootstrap for a
   plain-language model, a simplified parallel encyclopedia, does not exist for Hindi.
2. **Indian statute names plain-language and then attaches nothing to it.** The RPwD Act 2016 lists
   it inside the §2(f) *definition* of "communication"; §42 requires only an undefined "accessible
   format". The standard that actually binds, **IS 17802 (Part 1) : 2021**, mandates WCAG
   **"at Level AA"** and parks *Reading Level* in the Level AAA table it explicitly tells you not to
   require — *"encouraged to consider"*. Easy-read appears once, permissively: the standard
   *"does not preclude the possibility of providing … easy-to-read information for persons with
   limited cognitive, language and learning abilities"*. A full-text scan of that standard returns
   **0 hits for `plain language`, 0 for `readab`, 0 for `simplif`, 0 for `Hindi`.**
3. **The constitutional pull runs the other way.** The Central Hindi Directorate quotes its own basis,
   Article 351: it is the Union's duty to secure Hindi's enrichment *"by drawing, wherever necessary
   or desirable, **for its vocabulary, primarily on Sanskrit** and secondarily on other languages."*
   **The state's language mandate points at the learned stratum, not at the reader.**

> **→ Consequence.** `hi-easy` takes its frame from
> [accessibility-workflow](../accessibility-workflow.md) and its language-specific content from the
> measurement below. Note the structural trap in GIGW's generic advice — *"Breaking up content into
> shorter sentences and paragraphs"*, *"Active voice is more direct"* — it is imported from English,
> and §8b shows sentence length is precisely the feature that **fails** to predict difficulty in
> Hindi.

### 8b. The axis — word-level and orthographic, not sentence-level

Two peer-reviewed readability studies from IIT Kharagpur measured this against human difficulty
ratings, and they agree.

**Sinha, Dasgupta & Basu (2014)** built a 100-document Hindi corpus (~1,000 words each, spanning
literature, news, blogs, and articles), had it rated by **25 native annotators** with
**Krippendorff's α = 0.81**, and correlated 18 features against the ratings:

| Feature | r | p |
|---|---|---|
| **number of jukta-akshars (consonant conjuncts)** | **0.81** | **0.001** |
| average lexical chain length | 0.79 | 0.002 |
| number of verb phrases | 0.76 | 0.03 |
| **average word length** | **0.75** | **0.01** |
| number of clauses | 0.73 | 0.003 |
| **average sentence length** | **0.63** | **0.14 — insignificant** |
| number of postpositions | 0.36 | 0.12 — insignificant |

Their own reading, verbatim: *"Average sentence length has been considered as a strong predictor of
text difficulty …, however, in our case although it has a moderate correlation with the user rating,
**the value is insignificant**."* And: *"**Postpositions in both sentence and discourse contexts have
insignificant effect on text comprehension.**"*

The earlier **Sinha, Sharma, Dasgupta & Basu (2012)** study, with 24 Hindi annotators, reaches the
same place — *"the best correlated factor with the user's perception of hardness of a text is the
number of **jukta-aksharas**"* — and separately shows why English formulas cannot be borrowed:
*"reading score of Flesch Reading Ease should lie in the range of 0-100, whereas for the Hindi or
Bangla texts, its value is more than 150. Grade levels of Flesch-Kincaid Grade Level are not even
positive."*

⚠ **Caveats the papers state themselves:** 24–25 highly educated adult annotators; R² ≤ 0.50 in the
2012 models; *"correlation does not provide a measure of causality"*. These are the best available
quantitative studies for Hindi, not settled science.

**And the stratum question, which is where a translator will go wrong.** तत्सम is *not* the hard
stratum. Measured against a 19.2-million-token Hindi news corpus, **देश (22,984) and तथापि (5) are
both तत्सम** — a ~4,600× frequency gap inside one stratum. समय (22,592), कारण (16,325), नाम (16,289),
राज्य (13,126), व्यक्ति (6,028) are all learned Sanskrit borrowings and all entirely everyday.

> **→ The axis, stated so it can be tested:** difficulty in Hindi tracks **conjunct density, word
> length and word frequency** — not etymological class and not sentence length. Conjunct clusters are
> unevenly distributed across the strata (तत्सम borrowings preserve Sanskrit clusters — आव**श्य**कता,
> व्य**क्ति**, प्र**श्न**, कार्या**न्व**यन — where तद्भव words simplified them, Sanskrit कर्म → Hindi
> काम), so conjunct density is in part a *measurable proxy* for Sanskritization. ⚠ **That bridge is an
> inference; neither study tags words by stratum.**

### 8c. Measuring the axis — two corpora from one publisher, plus an independent cross-check

#### 8c-i. Method

| Corpus | What it is | Size |
|---|---|---|
| **Plain (Level 1)** | Hindi books published by **Pratham Books** on its open reading platform, at the platform's own **reading Level 1** | 174 books, **22,469 Devanagari word tokens** |
| **Harder (Levels 4–5)** | **The same publisher's** Hindi books at reading **Levels 4 and 5** | 165 books, **234,114 word tokens** |
| **Cross-check** | The **Leipzig Corpora Collection** Hindi news corpus `hin_news_2011_1M` — 1,000,000 sentences, **19,177,172 tokens** of written adult journalism, an independent Academic-tier resource with a completely different provenance | 19.2M tokens |

**Why this pair.** One publisher, one language, and a **grading assigned by the publisher itself** —
so the variable is the intended reading level, not the house, the genre, or the period. That is a
tighter control than an adult/children's title pair, which cannot hold genre constant.

**Counting.** Text was taken from the publisher's own story API, NFC-normalized, then tokenized on
`[\p{L}\p{M}]+`. Rates are **per 100,000 word tokens**, with raw counts in brackets. Leipzig figures
are that corpus's own raw frequencies, not rates.

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **The Level 1 corpus is small — 22,469 tokens.** One occurrence ≈ 4.5 per 100k. Rows resting on
>    fewer than ~10 raw tokens are marked ⚠ and are a hint, not a finding. Level 1 picture books
>    carry very little text by design; this is a ceiling, not an oversight.
> 2. **Both tiers are children's books.** The pair measures *easy-children vs harder-children*, not
>    easy-adult vs standard-adult. **No adult plain-Hindi corpus exists** — that is the §8a finding
>    showing up as a measurement limit. The Leipzig cross-check is what supplies the adult register.
> 3. **Topic leaks at this corpus size.** ताली, कबड्डी, खुजली top the Level-1 keyness list because a
>    single book dominates. Only function words, connectives, degree words, and general nouns are
>    tabled.
> 4. **Frequency is not comprehension.** No Hindi comprehension study tests any individual pair below.

#### 8c-ii. The axis measured directly on the graded pair

Before any word table — does the axis of §8b actually separate the two tiers?

| Measure | Level 1 | Levels 4–5 | Change |
|---|---|---|---|
| **Conjunct density** (virama per 100 Devanagari letters) | **2.45** | **3.02** | **+23 %** |
| Average word length (characters) | 3.63 | 3.77 | +3.9 % |
| Words per sentence | 6.88 | 12.74 | +85 % |

**The conjunct-density gap is real and runs in the predicted direction** — independent corroboration
of the IIT-KGP result on a corpus neither paper used. 🔴 **But note the third row honestly: the
publisher's harder tier also has near-double the sentence length.** Publishers *do* shorten sentences
when leveling down; the readability studies say that is not what makes the text easier. **Both facts
are true, and the guide states both rather than picking the convenient one.**

**The clearest structural markers of the harder tier** are subordination, not length:
**जो** (relative-correlative) **40.3 at Level 1 vs 292.1 at Levels 4–5 — a 7.2× skew**, and the
complementizer **कि 260.0 vs 766.5**. Both fit the papers' significant features (clause count
r = 0.73, verb-phrase count r = 0.76) rather than the insignificant one.

#### 8c-iii. The rows the measurement supports

Etymologies are the verbatim English-Wiktionary Hindi-section templates
(`lbor`/`bor…|sa` = तत्सम, `inh…|pra` = तद्भव, `bor…|fa-cls`/`ar` = Perso-Arabic).
**Community tier — an open collaborative dictionary, not an Indian lexical authority.**

| Formal / learned | Everyday | Evidence | Tier |
|---|---|---|---|
| **तथा** / **एवं** | **और** | Both carry an explicit `{{lb\|hi\|literary}}` register label; तथा is `{{lbor\|hi\|sa\|तथा}}`, एवं `{{bor+\|hi\|sa\|एवम्}}`, और `{{inh+\|hi\|pra-sau\|𑀅𑀯𑀭}}`. News **10,220 / 9,706 vs 276,387** — और is **27×** commoner. Graded pair: तथा **0.0 vs 6.0**, एवं **0.0 vs 5.6**, और 1,586.9 / 2,084.8 — the literary connectives are **absent from Level 1 entirely** | **Dictionary + Corpus** |
| **परंतु** / **किंतु** | **लेकिन** | परंतु is `{{lbor\|hi\|sa\|परं तु}}`; लेकिन is `{{bor+\|hi\|fa-cls\|لیکِن}}`, from Arabic. News **215 / 140 vs 52,989** — **246× and 378×**. Graded: परंतु 1 token total | **Dictionary + Corpus** |
| **पुनः** | **फिर** | पुनः is `{{bor+\|hi\|sa\|पुनर्}}`. News **28 vs 17,152 — 613×**, the largest gap measured | **Dictionary + Corpus** |
| **अत्यंत** / **अत्यधिक** | **बहुत** | अत्यंत is `{{bor+\|hi\|sa\|अत्यन्त}}`; बहुत is `{{inh\|hi\|pra\|𑀩𑀳𑀼𑀢𑁆𑀢}}`. News **403 / 367 vs 14,238**. Graded: **बहुत 551.4 vs 343.0** — Level-1-skewed; अत्यंत **0.0 at Level 1** | **Dictionary + Corpus** |
| **आरंभ** / **प्रारंभ** | **शुरू** | शुरू is `{{bor+\|hi\|fa-cls\|شُرُوع}}`, from Arabic. News **218 / 355 vs 17,906**. Graded: आरंभ **0 in both tiers** | **Dictionary + Corpus** |
| **कार्य** | **काम** | `{{bor+\|hi\|sa\|कार्य}}` against `{{inh\|pra\|𑀓𑀫𑁆𑀫}}` — a real तत्सम/तद्भव doublet. News **3,964 vs 18,634**. Graded: कार्य **0.0 at Level 1 vs 12.4**; काम 80.7 / 196.8 | **Dictionary + Corpus** |
| **प्रश्न** | **सवाल** | `{{lbor\|hi\|sa\|प्रश्न}}` vs `{{bor\|fa-cls\|سُؤَال}}`. News **672 vs 6,597** | **Dictionary** ⚠ graded signal nil (0 / 9 tokens) |
| **आवश्यकता** | **ज़रूरत** | `{{bor+\|hi\|sa\|आवश्यकता}}` vs `{{bor+\|hi\|fa-cls\|ضرورت}}`. News **803 vs 6,219** (both spellings summed; the nuqta-less form dominates 8:1) | **Dictionary** |
| **सहायता** | **मदद** | `{{bor+\|hi\|sa\|सहायता}}` vs `{{bor+\|hi\|fa-cls\|مدد}}`. News **1,876 vs 8,504** | **Dictionary** ⚠ graded signal flat (13.4 / 14.5 vs 67.2 / 95.4) |
| **पुस्तक** | **किताब** | `{{lbor\|hi\|sa\|पुस्तक}}` vs `{{bor+\|hi\|fa-cls\|کِتَاب}}`. News **532 vs 1,397**; graded stem किताब **67.2 vs 39.8** — Level-1-skewed | **Dictionary + Corpus** ⚠ thin |
| **मकान** | **घर** | 🔴 **The "formal" word here is the Persian one** — मकان is `{{bor\|fa-cls\|مَکَان}}`, घर is `{{inh\|pra\|𑀖𑀭}}`. News **1,915 vs 10,828**; graded घर **313.8 vs 186.5** | **Dictionary + Corpus** |
| **कार्यान्वयन**, **प्रतिवेदन**, **तथापि** | *unpack, do not swap* | Bureaucratic Sanskrit compounds: news **64**, **46**, **5** — against काम at 18,634. All three are **0 in both graded tiers**. There is no one-word everyday equivalent; the repair is to rewrite the clause | **Corpus** |

### 8d. 🔴 Do NOT "simplify" these — where the measurement contradicts the instinct

**This is the most important table in §8.** Every row is a substitution that "तत्सम is formal, replace
it" or "prefer the Perso-Arabic word" recommends, and that the corpora refute.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**समय → वक्त**~~ | समय is `{{lbor\|sa\|स॒म॒य}}` — तत्सम — and it is one of the commonest words in the language: news **22,592 vs 4,668, a 4.8× win for the Sanskrit word**. वक्त (`{{bor+\|hi\|fa-cls\|وَقْت}}`) is **0 in the Level-1 corpus**. The swap replaces a top-100 word with a rarer one. |
| ~~**कारण → वजह**~~ | Also तत्सम (`{{bor+\|hi\|sa\|कारण}}`), also commoner: news **16,325 vs 10,106**. |
| ~~**महिला → औरत**~~ | news **7,195 vs 150 — a 48× win for the तत्सम word**. औरत is `{{bor+\|hi\|fa-cls\|عَوْرَت}}`, from Arabic عَوْرَة, and Wiktionary's own gloss of the source word carries a register load this guide will not reproduce in a UI. **Both rarer and riskier.** |
| ~~**व्यक्ति → आदमी**~~ | 🔴 **Register-inverting.** व्यक्ति beats आदमी in written news **6,028 : 1,891**, but आदमी beats व्यक्ति in film dialogue **1,238 : 145** — and in the graded pair आदमी is **more** frequent in the *harder* tier (46.6 vs 9.0). Whichever you pick is wrong in the other register. Leave it alone. |
| ~~**कठिन → मुश्किल**~~ | 🔴 **The graded pair inverts the news corpus.** In news मुश्किल wins 3,198 : 864, so the swap looks safe — but in the publisher's own leveled books **कठिन scores 22.4 at Level 1 against 10.3 at Levels 4–5**, while **मुश्किल runs 4.5 at Level 1 against 24.0** at the harder levels. The Sanskrit word is the one the *easiest* tier uses. ⚠ Thin (5 / 24 and 1 / 56 raw tokens) — but it is a thin signal pointing the opposite way to the confident one, which is exactly the case where a translator should stop rather than swap. |
| ~~**देश, नाम, राज्य, जीवन, परिवार, क्षेत्र** → native words~~ | All तत्सम, all among the commonest words in written Hindi (देश **22,984**, नाम **16,289**, राज्य 13,126, क्षेत्र 11,509, परिवार 6,825, जीवन 5,534). A rule of the form "replace तत्सम with तद्भव" targets these first. **तत्सम is not a marked stratum; it is most of the vocabulary.** |
| ~~**संसार → दुनिया** as a general rule~~ | The news gap is real (148 vs 8,371) — but in the graded pair **दुनिया is 4× commoner in the *harder* tier** (17.9 vs 74.0). The word is not a plainness marker; it is an abstraction marker, and Level-1 books simply have less occasion for it. |
| ~~**सरकार → a "plainer" word**~~ | It *looks* तत्सम and is extremely frequent (**45,694**), but Wiktionary gives `{{bor+\|hi\|fa-cls\|سَرْکَار}}` — **it is Persian.** A worked example of why a stratum must be looked up, never inferred from the shape of the word. |
| ~~Shortening sentences as the primary lever~~ | Average sentence length correlates r = 0.63 with rated difficulty at **p = 0.14 — statistically insignificant** — while conjunct density reaches r = 0.81 at p = 0.001. **GIGW's "use shorter sentences" is imported from English and unsupported for Hindi.** Splitting sentences is harmless; treating it as the main lever misses the effect that was actually measured. |
| ~~Reducing postpositions / case marking~~ | r = 0.34–0.36, **insignificant** in the same study. Not a difficulty lever. |

**And the direction that did hold, stated as a heuristic rather than a rule.** For a clear majority of
the classic doublets, the Perso-Arabic word is the commoner one — किताब > पुस्तक, दुनिया > संसार,
ज़रूरत > आवश्यकता, मदद > सहायता, कोशिश > प्रयास, शुरू > आरंभ, सवाल > प्रश्न, उम्मीद > आशा,
लेकिन > परंतु. **But समय, कारण and महिला break it, and व्यक्ति inverts between registers.**

> **→ The rule that follows.** In Hindi, **do not simplify by etymology.** Simplify by
> **structure and conjunct load** (§8f), and make a lexical swap only where a *frequency lookup in a
> corpus matched to your register* supports it. "Prefer the Perso-Arabic word" is a good heuristic
> and a bad rule; "replace तत्सम" is neither.

### 8e. 🔑 The address decision — `hi-easy` keeps आप

> **Decision, recorded so that nobody "fixes" it: `hi-easy` keeps आप. It does NOT switch to तुम, and
> never to तू.**

- ✅ **आप** — in `hi` and in `hi-easy` alike
- ❌ **तुम** — familiar is not simpler, only less respectful
- ❌ **तू** — intimate; excluded outright

**Why, in four points — and the third is the one that settles it:**

1. **Written public Hindi is overwhelmingly आप.** In the 19.2M-token news corpus, **आप 12,335 against
   तुम 750 and तू 236** — a 16× and 52× margin; आपको 6,884 against तुम्हें 201. The formal/familiar
   split in Hindi tracks **written-public vs spoken-intimate**, not simple vs complex: in film and TV
   dialogue the picture inverts, with तुम्हें (2,383) overtaking आपको (963).
2. **तू carries real social risk.** It is characterized as *intimate*; directed at a stranger it reads
   as disrespect, not friendliness.
3. 🔑 **आप costs nothing in grammatical complexity.** The sourced description of the system is that
   *"the second-person intimate conjugations are grammatically singular while the second-person
   familiar and formal conjugations are grammatically plural"* — **तुम and आप take the same plural
   agreement.** Choosing आप therefore buys politeness for free: there is no simplicity to trade away.
   This is the argument that makes the decision safe rather than merely preferred.
4. **`hi-easy` readers include adults.** Downshifting register toward an adult reader because the text
   is simple is the infantilization failure mode of easy-read design.

> ⚠ **This decision is reasoned from sourced facts; it is not itself a sourced recommendation.** No
> Hindi source found — not GIGW, not the RPwD Act, not IS 17802, not the Hindi language institutes —
> discusses address form as a simplification device in either direction. The German plain-language
> convention of preferring less formal address has **no Hindi analog in any source reachable here**,
> and the corpus says the opposite is the norm for written public text. **A reviewer who "warms up"
> `hi-easy` to तुम has made a whole-document change on an instinct nothing supports. Do not accept it
> without a native-reviewer ruling.**

⚠ A complete verb-agreement paradigm table could not be retrieved verbatim; the three-way scale and
the singular/plural split are sourced, the full paradigm is not.

### 8f. What `hi-easy` is built on — conjuncts and clauses first, vocabulary last

⚠ **Craft, derived from the sourced facts above and labeled as derivation.** Ordered by leverage,
highest first — and the order is itself the finding, because it is nearly the reverse of what the
generic advice suggests.

1. **Reduce conjunct load. This is the main lever, and it is the measured one.** Conjunct density is
   the single highest-correlating readability feature for Hindi (r = 0.81, p = 0.001) and it separates
   the publisher's own graded tiers by 23 %. In practice this means preferring the everyday member of
   a doublet where one exists — **काम** over **कार्य**, **घर** over **मकान** — and, more importantly,
   **rewriting the bureaucratic Sanskrit compounds rather than swapping them**: कार्यान्वयन,
   प्रतिवेदन and परिप्रेक्ष्य have no one-word everyday equivalent, so the repair is to restate the
   clause.
2. **Cut subordination, not sentence length.** Clause count (r = 0.73) and verb-phrase count
   (r = 0.76) are significant; sentence length is not. The graded pair shows where this bites:
   **जो** is 7.2× commoner in the harder tier. `hi-easy` prefers two coordinate finite clauses to one
   relative-correlative **जो … वह** construction, and reaches for **कि**-complementation less often.
3. **Prefer the measured everyday connective** — **और** over **तथा** / **एवं**, **लेकिन** over
   **परंतु** / **किंतु**, **फिर** over **पुनः**, **बहुत** over **अत्यंत**, **शुरू** over **आरंभ**.
   Five rows, not a table of forty; that is all the measurement supports.
4. **Keep the technical term and explain it.** `hi-easy` uses the same term as the base variant, then
   "that means: …", then a concrete example — keep **तंत्रिका नेटवर्क / न्यूरल नेटवर्क**, gloss it in
   plain Hindi, never substitute a folksy stand-in. **This is the kit's term-preservation rule in its
   Hindi form and it is unchanged.** ⚠ Note the live tension with §8a's Article 351: the officially
   coined Sanskrit term is not automatically the recognizable one, and a `hi-easy` reader's technical
   exposure is often English-mediated. Where the two compete, gloss both on first use.

**What it overrides in the base rules.** From
[accessibility-workflow](../accessibility-workflow.md), `hi-easy` keeps one idea per sentence, the
everyday-word preference, saying what *is* rather than what is not, the same word for the same thing,
the one-line "what is this" opener and the literal tone. It **overrides** two things:

- 🔴 **The kit's ~8–12-word sentence target is demoted from a lever to a side effect.** It is not
  abandoned — short sentences remain good practice and the publisher's own easy tier averages 6.88
  words per sentence against 12.74 — but for Hindi it must not displace conjunct and clause work,
  because sentence length is the feature that did **not** reach significance (p = 0.14). Hit the word
  count if it falls out; never buy it by welding clauses into longer compounds.
- **The kit's SVO-simple structure is read as SOV-simple**, respecting Hindi's surface order (§4).

Digits stay per §5/§11.

### 8g. What is still open

1. **No adult plain-Hindi corpus exists**, so §8c measures easy-children against harder-children and
   leans on a news corpus for the adult register. An adult simplified tier is the single biggest
   missing input.
2. **The Level-1 corpus is 22,469 tokens.** Every row marked ⚠ in §8c-iii and the कठिन/मुश्किल
   reversal in §8d need a larger easy corpus before they are more than a signal.
3. **CSTT was unreachable** across every attempt. Its coining doctrine — and whether it mentions
   सरलता at all — is unknown, not absent. This is the largest unfetched official source.
4. **BIS adoption of ISO 24495-1:2023 is unresolved** (catalog search returned HTTP 500).
5. **ई-सरल हिंदी वाक्यकोश** — the one government artifact whose name claims "simple Hindi" — is named
   on the official-language portal and never described. It should be opened by hand.
6. **Hindi morphology is under-sourced in this section.** Compound/vector verbs (ले जाना, कर देना),
   conjunct verbs with करना/होना, and the जो…वह relative-correlative were not obtainable as quotable
   grammar; §8f item 2 rests on the corpus skew for **जो**, not on a grammatical description.
7. **The conjunct-density ↔ Sanskritization bridge in §8b is an inference**, not a finding. Neither
   readability paper tags vocabulary by stratum. It is testable and untested.
8. **Every frequency here is a raw surface form** — no lemmatization. Inflected variants are not
   aggregated, so the ratios are lower bounds and pairs with different inflectional spread are not
   perfectly comparable.
9. **The address decision (§8e) has no source in either direction** and needs a native-reviewer
   ruling.

Sources: <https://meta.wikimedia.org/w/api.php?action=sitematrix&format=json> ·
<https://www.chd.education.gov.in/en> · <https://rajbhasha.gov.in/> ·
<https://guidelines.india.gov.in/activity/crafting-clear-and-concise-content-writing-strategies-for-government-websites/> ·
**IS 17802 (Part 1) : 2021** — full text via <https://archive.org/metadata/gov.in.is.17802.1.2021> ·
**RPwD Act 2016** — <https://cdnbbsr.s3waas.gov.in/s36ee69d3769e832ec77c9584e0b7ba112/uploads/2025/03/202503251422104079.pdf> ·
<https://www.iso.org/standard/78907.html> ·
**Readability studies (Academic)** — <https://aclanthology.org/W14-5134.pdf> ·
<https://aclanthology.org/C12-2111.pdf> ·
**Graded corpora** — 174 Level-1 and 165 Level-4/5 Hindi books by Pratham Books,
<https://storyweaver.org.in/>, enumerated and fetched via the platform's own story API at
`https://storyweaver.org.in/api/v1/books-search` and `https://storyweaver.org.in/api/v1/stories/<slug>/read` ·
**News cross-check** — Leipzig Corpora Collection `hin_news_2011_1M`,
<https://api.wortschatz-leipzig.de/ws/corpora/availableCorpora> ·
**Spoken-register cross-check** — <https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/hi/hi_full.txt> ·
**Etymologies and register labels** — <https://en.wiktionary.org/wiki/तथा> ·
<https://en.wiktionary.org/wiki/एवं> · <https://en.wiktionary.org/wiki/और> ·
<https://en.wiktionary.org/wiki/परंतु> · <https://en.wiktionary.org/wiki/लेकिन> ·
<https://en.wiktionary.org/wiki/पुनः> · <https://en.wiktionary.org/wiki/फिर> ·
<https://en.wiktionary.org/wiki/अत्यंत> · <https://en.wiktionary.org/wiki/बहुत> ·
<https://en.wiktionary.org/wiki/शुरू> · <https://en.wiktionary.org/wiki/कार्य> ·
<https://en.wiktionary.org/wiki/काम> · <https://en.wiktionary.org/wiki/घर> ·
<https://en.wiktionary.org/wiki/मकान> · <https://en.wiktionary.org/wiki/किताब> ·
<https://en.wiktionary.org/wiki/पुस्तक> · <https://en.wiktionary.org/wiki/समय> ·
<https://en.wiktionary.org/wiki/कारण> · <https://en.wiktionary.org/wiki/महिला> ·
<https://en.wiktionary.org/wiki/औरत> · <https://en.wiktionary.org/wiki/व्यक्ति> ·
<https://en.wiktionary.org/wiki/आदमी> · <https://en.wiktionary.org/wiki/कठिन> ·
<https://en.wiktionary.org/wiki/मुश्किल> (Community tier — an open collaborative dictionary, not an
Indian lexical authority) ·
**Address system** — <https://en.wikipedia.org/wiki/Hindustani_grammar> ·
[accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md)

---

## 9. Regional variation

**Which standard the project targets.** Modern Standard Hindi is shared across the Hindi belt in
**one script (Devanagari)** and **one currency (₹)**; the major axis of variation for an
educational platform is **not** script but **register and vocabulary** — Hindi can lean
Sanskritized, neutral, or Persian/Urdu-influenced depending on audience. The project targets a
**pan-Indian neutral MSH**, anchored on CSTT/Rajbhasha "Pan-Indian" terminology (widely taught,
often Sanskrit-derived but cross-regionally understood), avoiding community-marked extremes.

**Neutrality strategy (explicit).**

1. **Register:** the recorded **आप** register + honorific verb agreement (§4), throughout.
2. **Vocabulary:** prefer unmarked, widely-taught standard terms; avoid strongly Sanskritized
   *or* strongly Urdu/Persian-marked synonyms where a neutral option exists.
3. **Religious/community-marked vocabulary:** words like **नमाज़ / रोज़ा / दुआ** signal
   Muslim/Urdu usage and **पूजा / व्रत / आरती** signal Hindu-religious usage; neutral editorial
   writing prefers a **non-religious term such as प्रार्थना** ("prayer") when addressing a broad
   audience.
4. **Numerals:** Devanagari vs Western digits is an audience/product choice (§5), applied
   consistently per context — not a regional split.
5. **Technical terms:** use the §6 sector terms; keep shared English acronyms (AI, ML, CPU).

Script and currency are uniform, so a single neutral written build serves the whole Hindi belt;
the work is vocabulary/register neutrality, not per-region forks.

Sources: <https://www.britannica.com/topic/Hindi-language/Vocabulary> (register/vocabulary
variation — round-1) · CSTT "Pan-Indian terminology" framing ⚠ unconfirmed (server refused, §2);
religious-marker examples — desk-research judgment, native-speaker confirmation advisable.

---

