<!-- base -->
# lang-ha — Hausa (Harshen Hausa) — language guide

> **Setup & sources live in [`ha.setup.md`](ha.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Harshen Hausa / Hausa.
**BCP 47 code (base):** `ha` — shipped as **`ha-Latn-NG`** (Latin *boko* script, Nigerian
convention; see §9). A Niger-targeted `ha-Latn-NE` and an Arabic-script `ha-Arab` (*ajami*) are
both real, recognized locales — neither is in scope (§3.5, §9).
**BCP 47 code (simplified variant):** `ha-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would use a private-use subtag
(`ha-x-simple`), but the kit token `ha-easy` is the one that counts here.
**Speaker reach — two figures that disagree, both reported.** English Wikipedia, citing
Ethnologue, gives **L1 58 million (2023–2024)** and **L2 36 million (2021–2024)** — roughly
**94 million** total, principally **Nigeria (67 million)** and **Niger (22 million)**, with
communities in Chad, Cameroon, Ghana, Sudan, and the Central African Republic where Hausa works as
a Sahelian trade lingua franca. A 2025 NLP survey puts it far higher, describing Hausa as
"understudied as a low-resource language despite having **over 120 million first-language (L1)
and 80 million second-language (L2) speakers worldwide**" (arXiv 2505.14311). **The two disagree
by roughly a factor of two; this guide reports both rather than picking one.** Either way, Hausa
is one of the largest languages on earth — and L2 speakers dominate the professional/technical
register, so most readers of this platform will be reading Hausa as a school or second language.
**Official status:** in **Nigeria** Hausa is a *national*, not official, language (English is
official). In **Niger** the position changed decisively in **March 2025** — French was demoted to
a working language and **Hausa was designated the official language**.
**Script + direction:** Latin script (*boko*), **left-to-right**. The distinguishing letters are
four **hooked consonants — ɓ ɗ ƙ ƴ** — which live in **Latin Extended-B** and are *separate
phonemes, not accented variants*, plus the **modifier-letter apostrophe ʼ (U+02BC), which CLDR
treats as a letter**.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single
agent-native research dossier (self-fetched, quote-per-claim), then independently reviewed against
its cited sources; four load-bearing anchors were re-fetched during authoring (the W3C/Unicode
Hausa *boko* script notes, CLDR `common/main/ha.xml`, and the CLDR `ha` `numbers.json` /
`currencies.json`) and all matched. **Source coverage is deliberately uneven and this guide
preserves that unevenness.** §3 (script/typography) and §5 (numbers/dates/currency) rest on
tier-A standards material and are strong. §2 and §4 rest partly on Hausa-language media and
academic-blog attestation with key primary sources unfetchable. **§7 (idioms) is entirely
craft-tier and unsourced.** **§8 (plain language) is a genuine ❌** — no codified Hausa
plain-language tradition was found. The underlying research also **exhausted its web-search budget
partway through**, so this is explicitly a **first pass** with a prioritized follow-up list (§2).
**Easy or hard for this kit:** structurally easy — Latin script, LTR, whitespace tokenization, no
shaping or bidi. Everything that bites is concentrated in three places: (1) **the four hooked
letters**, where a dropped hook is a *lexical* error, not a cosmetic one, and where font coverage
and naive case-transforms both fail (§3); (2) **the person-aspect complex**, which puts tense and
aspect in the *pronoun* rather than the verb, so fragment-level translation silently lands in the
wrong aspect (§4); (3) **the absence of any terminology authority** — nobody has ruled on how to
say "neural network" in Hausa, so the project glossary *is* the standard (§6).

Sources: <https://en.wikipedia.org/wiki/Hausa_language> · <https://arxiv.org/abs/2505.14311> ·
<https://globalvoices.org/2025/06/28/hausa-replaces-french-as-the-official-language-of-niger-in-a-bold-assertion-of-sovereignty/> ·
<https://r12a.github.io/scripts/latn/ha.html> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml>

---

## 1. Header block

See above. One-line orientation: Hausa is a Chadic (Afroasiatic) language, **strictly SVO**, LTR,
written in a Latin alphabet whose defining feature is four hooked consonants and a letter-valued
apostrophe. The localization risk is **not** script complexity — it is **character integrity**
(hooks and U+02BC surviving every hop of the pipeline), **aspect metadata** (strings must carry
their purpose), and **terminology governance** (there is no external authority to defer to).

---

## 4. Grammar for translators

**Mixed-tier section.** Word order, gender, plurals, and the genitive linker are sourced to a
linguistic reference and Wikipedia. **The TAM paradigm example in §4.2 is `⚠ unverified`** — the
underlying grammar-sketch PDF returned **403** and could not be quoted. **The honorific
sociolinguistics in §4.5 is `⚠`** for the same class of reason (both candidate sources
unfetchable). Native-speaker confirmation pending throughout.

### 4.1 Word order — SVO, and strict

"Hausa has a quite strict word order which is, like in most Chadic languages, SVO:
Subject-Verb-Indirect Object-Direct Object." Note that the **indirect object precedes the direct
object** —
the reverse of the English "give the answer to the model" ordering when no preposition is used.

### 4.2 The person-aspect complex (PAC) — the single biggest EN→HA breaker

Hausa does **not** conjugate the verb for tense/aspect. It conjugates a **preverbal pronoun
complex** that fuses person, gender, number **and** TAM into one obligatory element standing
before an invariant verb stem.

- Reference grammar: "The two categories of subject agreement … are marked via a preverbal
  complex. The first element of this complex is a variant form of a personal pronoun and the
  second is a TAM marker" — marking "subject agreement (person, gender and number) and TAM (tense,
  aspect, mood)."
- Wikipedia: "Hausa marks tense differences by different sets of subject pronouns, sometimes with
  the pronoun combined with some additional particle."
- The core aspectual contrast is reported as three-way — **perfective/completive, continuous,
  subjunctive** (subjunctive marker zero). **⚠ unverified:** this characterization *and the
  paradigm pair below* come from a search-result summary of an academic grammar sketch whose PDF
  returned **403**. Treat as a strong lead requiring native/editorial confirmation.

- ⚠ illustrative pair (**unverified**, per the caveat above): **`yā kāwō`** "he brought"
  (completive `yā`) vs **`yanā kāwōwā`** "he is bringing" (continuous `yanā`) — note the **verb
  also takes a different stem form** in the continuous. *(Tone/length marks shown here because
  this is a grammar illustration, not product copy — §3.6.)*

**Why this breaks naive translation.** An English-shaped mental model says "tense = a word you add
near the verb" (*will* run, *has* run). In Hausa there is no such word to add: **you must
re-select the whole subject pronoun.** A translator (human or machine) who keeps one pronoun form
and swaps a particle produces text that is either ungrammatical or silently in the wrong aspect —
and "wrong aspect" reads as fluent, so review will not catch it by feel.

For this platform the distinction bites hardest at:
**instructions** (imperative/subjunctive) vs **running-state descriptions** (continuous) vs
**results** (completive). "Click the button" / "The model is training" / "The model has finished
training" need **three different pronoun complexes**, not three different verbs.

**Rule** *(craft-tier)*: **never let a translator work on isolated UI fragments without knowing
whether the string is an instruction, a running-state description, or a completed-state report.
Ship that metadata with every string.** This is the single highest-value process change for `ha`.

### 4.3 Gender, and why English "you" is a trap — the register decision

Hausa marks **masculine/feminine** gender; "masculine words are usually unmarked and feminine ones
end in aa, yaa or waa", and gender is marked in the singular of the 2nd and 3rd persons.

**The breaker:** English `you` is genderless and number-ambiguous. Hausa singular 2nd person
forces a choice — **`ka` (m.) / `ki` (f.)**. A platform addressing an unknown individual learner
therefore has **no gender-neutral singular option**: every "you" string would be a forced, and
often wrong, gender assignment.

> **Register decision (human-gate): Kano-standard *Daidaitacciyar Hausa*, Nigerian convention
> (`ha-Latn-NG`), addressing the learner in the 2nd-person plural `ku` — taken and recorded.**
> Rationale, recorded: English singular "you" has **no gender-neutral Hausa equivalent**
> (`ka` m. / `ki` f.), so any singular address mis-genders part of the audience on every string.
> **Plural address solves gender-neutrality and number-neutrality at once, and reads as respect
> rather than distance.** This single decision removes an entire class of defects from the string
> catalog. **Binding for all second-person copy** in `ha` and `ha-easy`.
> **Salutations:** `Malam` (m.) / `Malama` (f.) are used for **direct salutations and named
> people only — never in UI chrome.** *(The politeness reading of plural address in Hausa
> specifically is ⚠ craft-tier inference; the grammatical availability of the plural forms is
> sourced. This is the one item most in need of a native-speaker signature.)*
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ plural `ku` (the recorded register): **`Ku danna maɓallin.`** · **`Ku gwada da kanku.`** ·
  **`A wannan darasi za ku koyi…`**
- ❌ gendered singular: **`Ka danna maɓallin.`** (masculine only) · **`Ki danna maɓallin.`**
  (feminine only) — each mis-addresses half the audience
- ❌ `Malam` as UI chrome (e.g. a button or a form label) — salutations only

### 4.4 Plurals and the genitive linker

**Plurals are irregular and must be looked up, never derived.** "Plural formation is complex and
not totally predictable. It is determined by the insertion of vowels, addition of affixes,
reduplication or tone change." Wikipedia cites the **20 plural classes proposed by Newman (2000)**,
using "suffixation, infixation, reduplication, or a combination of any of these processes."

**Breaker:** a UI that builds plurals programmatically (`item` → `items`) is **unimplementable** in
Hausa. Every pluralized noun in the product must be an **authored, dictionary-checked form**. Note
from CLDR that Hausa currency names do carry distinct `one`/`other` forms
(**`Nairar Nijeriya`** vs **`Nairorin Najeriya`**) — so the i18n framework's plural machinery *is*
exercised and must be given **real data, not generated data**.

- ✅ authored pair: **`Nairar Nijeriya`** (one) / **`Nairorin Najeriya`** (other) — the plural is
  not the singular plus a suffix
- ❌ a framework or translator inventing a regular suffixed plural

**The genitive linker.** Possession and modification use a linker suffixed to the head noun, which
**agrees with the head noun's gender**: masculine **`-n`**, feminine **`-r`**. Sourced example:
**`kàaká-n yáaròo`** ("grandfather-of boy").

**Breaker:** English **noun-noun compounding** ("machine learning", "data set", "language model")
has **no direct Hausa equivalent** — you cannot juxtapose two nouns. Every such compound must be
rebuilt with the linker on the correctly gendered head noun, or with a relative construction.

- ✅ **`fasahar ƙirƙirarriyar basira`** ("the technology **of** artificial intelligence" — feminine
  linker `-r` on `fasaha`). *(Attested in the media corpus in its ASCII-ified spelling
  `fasahar kirkirarriyar basira`; the hooked spelling is the correct one — §3.4, §6.)*
- ✅ **`samfuran harshe`** ("models **of** language")
- ❌ two juxtaposed nouns in the English pattern, with no linker

Choosing `-n` vs `-r` requires knowing the head noun's gender — exactly the thing a non-native or
automated pipeline gets wrong.

### 4.5 Register and honorifics

**Verified lexical facts:** **`mālàm`** (m.) is a title meaning "mister, Mr.", with feminine
**`mālàmā`** and plural **`mā̀làmai`**; it is "a clipping of *malami*" (scholar/teacher). That
teacher/scholar sense is why `Malam` / `Malama` read as a **respect-through-learning** honorific
rather than a bare civil title — highly apt for an educational context, and **notably not
gender-neutral**, which is why §4.3 confines it to salutations. *(In body copy, write **Malam** /
**Malama** without tone marks — §3.6.)*

⚠ **The broader honorific system is unverified.** Hausa address is reported as operating through
*name, descriptive, honorific and kinship* terms conditioned by education, occupational hierarchy,
social status, and intimacy — but **no readable primary source could be fetched** (one academic PDF
returned unparsable binary; the sociolinguistic address-patterns paper sat on a 403 host). This is
carried as a **lead from search-result summaries, not as verified fact**, and the guide draws no
rules from it.

### 4.6 The five features most likely to break a naive EN→HA translation

| # | Feature | Naive EN→HA failure | Correct handling |
|---|---|---|---|
| 1 | **Hooked letters are lexical** (§3.2) | `ƙasa` → `kasa`; hooks stripped by encoding, font, slugifier, or a translator on an English keyboard | UTF-8 + NFC, lint for `'k`/`k'` substitutes, QA the four glyphs in every font/weight/italic |
| 2 | **TAM lives in the pronoun, not the verb** (§4.2) | Translator keeps one pronoun and swaps a "tense word" → wrong aspect, reads fluent | Ship string-purpose metadata (instruction / ongoing state / completed result); never translate fragments blind |
| 3 | **Singular "you" is gendered** (§4.3) | Every `ka`/`ki` choice mis-genders half the audience | Address the learner as **plural `ku`** throughout (the recorded register) |
| 4 | **Plurals are unpredictable, 20+ classes** (§4.4) | Framework or translator invents a suffixed plural | Author every plural by hand against the dictionary; populate CLDR `one`/`other` with real forms |
| 5 | **No noun-noun compounding; gendered genitive linker `-n`/`-r`** (§4.4) | "machine learning" calqued as two juxtaposed nouns | Rebuild with the linker on the correctly gendered head noun |

**Bonus breaker #6 — tone and length are unwritten** (§3.6): single-word UI labels are
systematically ambiguous. Prefer short phrases over bare nouns for buttons and menu items.
*(craft-tier)*

Sources: <https://languagesgulper.com/eng/Hausa.html> · <https://en.wikipedia.org/wiki/Hausa_language> ·
<https://en.wiktionary.org/wiki/malam> · <https://unpkg.com/cldr-numbers-full@48.2.0/main/ha/currencies.json>
(⚠ TAM paradigm: grammar-sketch PDF `shs.hal.science/halshs-00647533` returned **403**, unquoted;
⚠ honorific sociolinguistics: `scholarworks.iu.edu` PDF unparsable, ResearchGate host blocked)

---

## 5. Numbers, dates, currency

**(Strong section — Unicode CLDR `ha`, tier A. `numbers.json`, `currencies.json` and
`common/main/ha.xml` were all re-fetched during authoring and matched exactly.)**

### 5.1 Digits and number formatting

| Property | Value | Note |
|---|---|---|
| Numbering system | **`latn`** — Western Arabic digits 0–9 | No Hausa-specific digit set |
| Decimal separator | **`.`** (period) | Same as English |
| Group separator | **`,`** (comma) | Same as English |
| Decimal pattern | **`#,##0.###`** | Grouping by 3 |
| Percent sign / pattern | **`%`** / **`#,##0%`** | **No space** before `%` in the pattern |

**Implication: Hausa is not a comma-decimal locale.** A German- or French-derived formatting
default is wrong here.

- ✅ **`1,234.56`** · ✅ **`45%`** (no space)
- ❌ **`1.234,56`** (comma-decimal — wrong locale family) · ❌ **`45 %`**

**Spelled-out cardinals** for body copy: **`ɗaya`** (1), **`biyu`** (2), **`goma`** (10),
**`ɗari`** (100). Note that **`ɗaya`** and **`ɗari`** both carry a hooked letter — spelled-out
numbers are themselves a hook-integrity test case.

### 5.2 Currency

| Property | Value |
|---|---|
| Currency pattern (standard **and** accounting) | **`¤ #,##0.00`** — **symbol, space, amount** |
| NGN symbol | **`₦`** (U+20A6 NAIRA SIGN) |
| NGN name | **`Nairar Najeriya`** · one: **`Nairar Nijeriya`** · other: **`Nairorin Najeriya`** |
| XOF (West African CFA franc) | symbol **`F CFA`** · name **`Kuɗin Sefa na Afirka Ta Yamma`** |
| XAF (Central African CFA franc) | symbol **`FCFA`** · name **`Kuɗin Sefa na Afirka Ta Tsakiya`** |

- ✅ **`₦ 1,234.56`** — symbol, **space**, amount (the space is in the CLDR pattern)
- ❌ **`₦1,234.56`** (glued) · ❌ **`1.234,56 ₦`** (amount-first with comma-decimal)

**Notes for implementers.**

- **Niger uses XOF, Nigeria uses NGN.** If the platform shows any prices it needs a **country**
  dimension, not just a language dimension (§9).
- **XOF and XAF have different symbol spellings** — `F CFA` (with space) vs `FCFA` (without). **Do
  not unify them.**
- Both CFA display names contain **ɗ** (`Kuɗin`) — another hook-integrity test case in data you
  did not author.
- ⚠ CLDR's own NGN data is internally inconsistent (`Najeriya` in the base and `-count-other`
  forms, `Nijeriya` in `-count-one`). Quoted as found; **prefer `Najeriya` for consistency in your
  own copy.**

### 5.3 Dates and times

| Format | Pattern | Rendered example (2026-07-26) |
|---|---|---|
| full | **`EEEE d MMMM, y`** | **`Lahadi 26 Yuli, 2026`** |
| long | **`d MMMM, y`** | **`26 Yuli, 2026`** |
| medium | **`d MMM, y`** | **`26 Yul, 2026`** |
| short | **`d/M/yy`** | **`26/7/26`** |

**Day-month-year throughout, with a comma before the year** in the full/long/medium forms — that
comma is unusual and easy to lose.

- ✅ **`26 Yuli, 2026`** (comma before the year) · ✅ **`26/7/26`**
- ❌ **`26 Yuli 2026`** (comma dropped) · ❌ **`7/26/26`** (US M/d/y — never emit for Hausa)

**Month names (wide):** `Janairu, Faburairu, Maris, Afirilu, Mayu, Yuni, Yuli, Agusta, Satumba,
Oktoba, Nuwamba, Disamba`
**Day names (wide):** `Lahadi, Litinin, Talata, Laraba, Alhamis, Jummaʼa, Asabar`

Two things to notice. The **week is presented starting Sunday (`Lahadi`)**. And **`Jummaʼa`
(Friday) contains U+02BC** — the modifier-letter apostrophe from §3.3. A smart-quote filter or an
apostrophe-normalizing sanitizer **will corrupt the name of a weekday**.

> **Pipeline smoke test (cheap, and it catches the whole class of bug): if `Jummaʼa` survives a
> full round-trip through your CMS, database, export, and render with U+02BC intact, your
> apostrophe handling is correct.**

⚠ CLDR's `ha` **time**-format entries inherit from the root locale (marked `↑↑↑` in the XML) and
were not resolved. **No Hausa time patterns are stated here** — resolve them from your i18n
library at build time rather than hardcoding.

Sources: <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ha/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ha/currencies.json> ·
<https://languagesgulper.com/eng/Hausa.html> (cardinals)

---

## 6. Terminology strategy

**Mixed tier, and the gap is stated up front. ⚠ BBC Hausa and VOA Hausa were both requested as
corpora and neither was sampled — no BBC or VOA terminology is reported anywhere in this guide.
The two are not equivalent, and an earlier note in this guide that lumped them together as
"blocked at the HTTP level" was wrong about both:**

- **BBC Hausa — off limits, and not for a technical reason.** The host answers `200`, but
  `bbc.com/robots.txt` carries `Disallow: /` for a dozen named automated text-collection
  agents, checked 2026-07-27. That is the publisher's stated position on this use.
  **Do not sample it**, and do not read the `200` as an invitation.
- **VOA Hausa — collectable.** `voahausa.com/robots.txt` carries only path rules
  (`/z/`, `/tv/`, `/radio/`, `/schedule/`, query strings, `/comments/`, `/embed/`); article
  paths are permitted, and a sitemap is published. It was simply never sampled. A later pass
  may build a corpus here. Everything marked [C] below comes from *other*
Hausa media: a Nigerian newspaper's Hausa edition, an international broadcaster's Hausa service,
and a Hausa science-news site. **This is not corpus coverage of Hausa AI journalism; it is a
handful of fetched articles.** Treat the table as a seed, not a survey.

### 6.1 How Hausa handles loanwords

Hausa has two established loan strata: **Arabic** (older, via Islam and scholarship — deeply
nativized) and **English/French** (modern, technical, still visibly foreign). The colonial-language
split maps onto the national split — Nigeria draws on English, Niger on French (§9).

Modern technical Hausa shows a **three-way strategy**:

1. **Phonological nativization of an English word** — `kwamfuta` (computer), `intanet`
   (internet), `fayil` (file), `robot`, `ta atomatik` (automatically).
2. **Native descriptive compounding** — `naʼura mai kwakwalwa` (computer, lit. "machine that has a
   brain"), `yanar gizo` (internet/web, lit. "spider's web"), `maɓallin rubutu` (keyboard, lit.
   "writing keys"), `ƙirƙirarriyar basira` (AI, lit. "created/invented intelligence").
3. **Code-switching — the English term left untouched**, very often in parentheses after a Hausa
   gloss. Hausa tech writers do **not** treat this as a failure.

### 6.2 The convention this platform adopts: Hausa term + English in parentheses on first use

**Virtually every Hausa source fetched that discusses AI writes the Hausa term and then puts the
English in parentheses** — `Kirkirarrar Basira (AI)`, `Fasahar kirkirarriyar basira (AI)`,
`Kirkirarriyar basirar Dan'adam ta zamani (Artificial Intelligence)`, `basirar wucin gadi (AI)`.
*(All four are quoted exactly as the sources write them — i.e. ASCII-ified, with plain apostrophes
and no hooks. **The convention is what is being attested here, not the spelling**; write the
recommended form with `ƙ` and U+02BC, per §3.2 / §3.4.)*
**This gloss-plus-parenthetical is the attested native convention for this domain — it is not a
crutch and not a translation failure.**

**Adopt it deliberately.** This is the kit's **sandwich pattern**
(see [translation-quality](../translation-quality.md)) instantiated in the language's own idiom:

> **ƙirƙirarriyar basira (AI)** — fasaha ce da ke sa naʼura ta iya koyo daga bayanai.
> *(Hausa term + English in parentheses on first use in a section, then one short plain clause;
> the Hausa term alone on every later mention. The explanatory clause is authored per the sandwich
> format; the term itself is attested below.)*

- ✅ first use: **`ƙirƙirarriyar basira (AI)`** — then **`ƙirƙirarriyar basira`** alone thereafter
- ❌ the English term alone with no Hausa rendering
- ❌ the parenthetical repeated on every mention (that *is* a crutch)

### 6.3 Seed vocabulary — with provenance, and with the gaps visible

**There is no standardized Hausa AI/ML terminology.** Three different Hausa renderings of
"artificial intelligence" circulate simultaneously, and the same encyclopedia uses more than one.
Rows marked **[E] craft** are constructions and **are not attested anywhere** — they are drafts
for a native editor.

| Concept (EN) | Hausa | Literal | Provenance |
|---|---|---|---|
| artificial intelligence | **ƙirƙirarriyar basira** — **recommended** | "invented/created intelligence" | [C]/[D] — encyclopedia + two news services; most frequent form. Verbatim: *"Kirkirarrar Basira (AI) shine basirar injuna ko software, sabanin basirar ɗan adam ko dabbobi."* (source ASCII-ified — write it **`ƙ`**) |
| " (variant — **avoid**) | basirar wucin gadi | "temporary / stand-in intelligence" | [D] — dominant in encyclopedia bodies. **Semantic mismatch for "artificial"** (see §6.4) |
| " (variant) | hankali na wucin gadi | "artificial mind/sense" | [D] — used as an encyclopedia article title |
| machine learning | **koyon injina** — **recommended** | "learning of machines" | [D] — verbatim: *"A cikin basirar wucin gadi (AI), musamman koyon injina, cirewa shine cire wani ɓangare na tsarin AI"* |
| " (as used in media) | *machine learning* (English, untranslated) | — | [C] — a Hausa science-news site left it in English |
| algorithm | **algorithm** — borrowed, undeclined | — | [D] — verbatim: *"Algorithms na koyon injina galibi suna yin cutar wakilci…"*. **No native term attested** |
| data | **bayanai** | "information, reports" | [C]/[D] — universal across every source fetched |
| computer | **kwamfuta** | (loan) | [D] — encyclopedia lead |
| " (descriptive) | **naʼura mai kwakwalwa** | "machine with a brain" | [D] — verbatim: *"Kwamfuta ta kasance wata na'ura ce da za a iya tsara ta don aiwatar da jerin ayyukan ƙididdiga ko aiki na hankali (lissafi) ta atomatik."* (quoted as found — note the source gets **ƙ** right in `ƙididdiga` but uses an ASCII apostrophe in `na'ura`; **write U+02BC**) |
| to train (a model) | **horar da** | "to train, drill" | [C] — verbatim: *"An horar da AI ɗin ta hanyar amfani da bayanan sabbin duniyoyin da aka riga aka tabbatar da su"* |
| (language) model | **samfurin harshe** / pl. **samfuran harshe** | "specimen/sample of language" | [D] — verbatim: *"manyan samfuran harshe (LLMs)"*. ⚠ weak fit — see §6.4 |
| technology | **fasaha** | "skill, craft, technology" | [C]/[D] — universal. Verbatim: *"Fasahar kirkirarriyar basira (AI) da take tashe a wannan zamani namu na yau…"* (source ASCII-ified) |
| tool(s) | **kayan aiki** | "work things" | [C] — verbatim: *"Ta hanyar amfani da kayan aikin AI, zan iya kara yawan aiki"* |
| intelligence (human) | **basira** / **hankali** | "intelligence" / "sense, mind" | [D] |
| software | **software** or **shirye-shirye** | "programs" | [D] — both attested |
| automatically | **ta atomatik** (also `otumatik`) | (loan) | [C]/[D] |
| robot | **robot** | (loan) | [D] — encyclopedia article title |
| (algorithmic) bias | **cutarwar wakilci** / **son zuciya** | "harm of representation" / "partiality" | [D] — ⚠ two competing renderings, unresolved |
| internet | **intanet** / **yanar gizo** | (loan) / "spider's web" | [D] — community |
| deep learning | zurfin ilmantarwa | "depth of teaching/learning" | ⚠ [D] — from an encyclopedia summary, **not captured as a clean verbatim string** |
| neural network | hanyoyin sadarwa na wucin gadi | "artificial communication networks" | ⚠ [D] — same caveat, **and the calque has lost "neural"**. See §6.4 — **do not ship** |
| natural language processing | sarrafa harshe na halitta | "processing of natural language" | ⚠ [D] — same caveat |
| dataset / training data | bayanan horarwa | "training data" | **[E] craft** — constructed from *bayanai* + *horar da*; **not attested** |
| prediction | hasashe | "guess, forecast" | **[E] craft** — plausible, **unattested in this corpus** |
| model (generic) | ƙira / samfuri | "design/build" / "specimen" | **[E] craft** — see §6.4 |

### 6.4 Editorial rulings and the two open decisions

1. **Adopt `ƙirƙirarriyar basira` for "artificial intelligence"** — most frequently attested across
   independent media *and* encyclopedic sources, and transparent (`ƙirƙira` "to invent/create" +
   `basira` "intelligence"). **Write it with the hooks.** Every ASCII-ified source writes
   `kirkirarriyar`; **that is the disease, not the standard** (§3.4).
2. **Avoid `basirar wucin gadi`.** `wucin gadi` carries a "temporary / stopgap" sense — a genuine
   semantic mismatch for "artificial" that will actively mislead learners in a course *about* the
   subject.
3. **Use the gloss-plus-parenthetical convention** on first use per section (§6.2).
4. **Freeze `koyon injina` for machine learning** — attested, transparent, the only real candidate.
5. **Leave `algorithm` borrowed.** No native term is attested; inventing one would be worse than
   borrowing, and Hausa technical writing already borrows it.
6. **⚠ OPEN DECISION — "neural network". Do not ship `hanyoyin sadarwa na wucin gadi`:** the
   attested calque has dropped the "neural" component entirely and means roughly "artificial
   communication networks", which is actively misleading in a course that also discusses
   networking. **Craft alternative for native review [E]:** a descriptive
   `hanyar sadarwa ta jijiyoyi ta ƙirƙira`, or the borrowed *neural network* with a Hausa
   explanatory gloss. **Escalate to the native subject-matter editor.**
7. **⚠ OPEN DECISION — "model".** `samfuri` means "specimen / sample" — weak. It has a foothold
   (`samfuran harshe` is attested), but flag for native review whether `ƙira` or a borrowed
   *model* serves learners better.
8. **Build the glossary first, translate second.** Because no authority exists (§2), the first ~40
   terms fixed will propagate through the entire course. **Fix them with a native subject-matter
   editor before a single lesson is translated**, then freeze them.

Project coinages keep their original spelling in Hausa text and are owned by the term-sheet, not
this table.

Sources: Hausa Wikipedia (article leads, tier D) · a Nigerian newspaper's Hausa edition, an
international broadcaster's Hausa service and a Hausa science-news site (tier C, usage evidence
only) · a community computer-literacy primer (tier D) — **⚠ BBC Hausa and VOA Hausa NOT sampled;
BBC Hausa is off limits (its `robots.txt` disallows automated text-collection agents by name),
VOA Hausa is collectable and simply was not sampled — see §6**; ⚠ several rows carry no clean verbatim string and are marked at point of use;
[E] rows are unattested craft.

---

## 7. Idiom anti-patterns

> ⚠⚠ **THIS ENTIRE SECTION IS CRAFT-TIER AND UNSOURCED — not just individual rows.** ⚠⚠
>
> **No Hausa idiom or proverb reference could be fetched** (the obvious candidate,
> `en.wikiquote.org/wiki/Hausa_proverbs`, returned **HTTP 404**), and the research's web-search
> budget was exhausted before an alternative could be found. **Every Hausa rendering in the ✅
> column below is constructed** from vocabulary attested elsewhere in this guide plus general
> structural knowledge of the language. **They are a starting draft for a native editor to
> correct, not verified translations. Do not ship any row without native review.**
>
> The **❌ column is the more reliable half**: it identifies the failure mode a literal translator
> will produce, and that diagnosis holds even where the suggested rendering needs fixing.

| # | English stock phrase | Idiomatic Hausa (draft) ✅ | Literal calque ❌ | Why the calque fails | Provenance |
|---|---|---|---|---|---|
| 1 | "Let's get started." | `Mu fara.` | `Bari mu samu farawa.` | English *get* + verbal noun has no Hausa correlate; `samu` = "obtain" — nonsense here | **[E] craft, unsourced** |
| 2 | "In this lesson you will learn…" | `A wannan darasi za ku koyi…` | `Cikin wannan darasi kai za ka koya…` | Uses gendered singular `ka` (§4.3); `cikin` is physical "inside" | **[E] craft, unsourced** |
| 3 | "Try it yourself." | `Ku gwada da kanku.` | `Gwada shi kanka.` | Singular + gendered; `da kanku` ("by yourselves") is the natural reflexive | **[E] craft, unsourced** |
| 4 | "Keep in mind that…" | `Ku tuna cewa…` | `Ku ajiye a cikin hankali cewa…` | "Store in the mind" is not a Hausa image; `tuna` = "remember" is the idiom | **[E] craft, unsourced** |
| 5 | "Step by step" | `Mataki-mataki` | `Mataki ta mataki` | Hausa expresses distributive repetition by **hyphenated reduplication** (§3.7), not a preposition | **[E] craft, unsourced** |
| 6 | "Little by little" | `Kaɗan-kaɗan` | `Ƙarami ta ƙarami` | Same reduplication rule; note the **ɗ** | **[E] craft, unsourced** |
| 7 | "Under the hood" | `Yadda yake aiki a ciki` | `Ƙarƙashin murfin` | Automotive metaphor does not transfer; state the meaning ("how it works inside") | **[E] craft, unsourced** |
| 8 | "A rule of thumb" | `Ƙaʼidar gama-gari` | `Ƙaʼidar babban yatsa` | "Thumb rule" is opaque; "general rule" carries the sense. Note **ƙ** and **U+02BC** | **[E] craft, unsourced** |
| 9 | "Trial and error" | `Gwaji da kuskure` | `Shariʼa da kuskure` | `shariʼa` means legal judgment, not experiment — a genuine mistranslation risk | **[E] craft, unsourced** |
| 10 | "The bottom line is…" | `Abin da ya fi muhimmanci shi ne…` | `Layin ƙasa shi ne…` | Accounting metaphor; `layin ƙasa` reads as a literal line on the ground | **[E] craft, unsourced** |
| 11 | "It depends." | `Ya danganta.` | `Yana rataye a kan.` | "Hangs on" is an English image; `dangana` is the Hausa verb for "depend" | **[E] craft, unsourced** |
| 12 | "Practice makes perfect." | `Yawan aikatawa yana kai wa ga gwaninta.` | `Aikin yi yana yin cikakke.` | The calque is ungrammatical word-salad; render the meaning ("much doing leads to mastery") | **[E] craft, unsourced** |
| 13 | "Data-driven" | `Wanda bayanai ke jagoranta` | `Bayanai-tuƙi` | English compound-adjective formation does not exist in Hausa (§4.4); use a relative clause | **[E] craft, unsourced** |
| 14 | "Machine learning" | **`koyon injina`** | two juxtaposed nouns | Hausa has no noun-noun compounding; needs the genitive linker or a verbal-noun construction | **[D] attested** — the one sourced row in this table (§6.3) |

**Transferable rules extracted from the table** *(also craft-tier, but they generalize)*:

- **Body-part and vehicle metaphors do not transfer** (#7, #8, #10). State the meaning plainly.
- **English distributive/intensive patterns become Hausa reduplication with a hyphen** (#5, #6).
- **English compound adjectives become relative clauses** (#13).
- **Every "you" becomes plural `ku`** (#2, #3) — the highest-yield rule here, and the one that is
  actually decided (§4.3) rather than drafted.
- **Watch for false friends from the Arabic stratum** (#9 `shariʼa`) — some English-looking
  semantic mappings land on a religious or legal term.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: **none.** `en.wikiquote.org/wiki/Hausa_proverbs` returned **404**; no substitute idiom
reference was reachable within the research's search budget. Native-speaker review is a
precondition for shipping this section.

---

## 8. Simplified-language pendant (`ha-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: Hausa now has exactly one citable measurement, and it is structural, not
lexical.** In most guides in this kit §8c counts a plain-register corpus against a standard one and
the count overturns rows of the word table. Here the graded children's-book design that worked for
Swahili is **too small** — so its word list still measures what the stories are *about* rather than
how they are written, and **no lexical row of §8b is measured**. What has changed since the first
pass: the **sentence-length figure is repaired and now runs the right way round** (10.61 words at
reading levels 1–2 against 14.93 at level 3), because two extraction faults that had inverted it
were found and fixed. And the adult cross-check that would have repaired the lexical side is now
**closed on the publisher's stated position, not on a technical fault** — an earlier pass recorded
it as permitted and that was wrong. The consequences: **§8d still contains no measured lexical
reversal**, the word table in §8b stands exactly where it stood, and §8f gains one number it did
not have.

### 8a. The standard — **❌ none found**, and that is this section's headline result

**Honest finding: ❌.** The research found **no** Hausa equivalent of German *Leichte Sprache*,
English *Easy Read*, or a Plain-Language Act — **no standard, no certifying body, no published
rule set, and no readability formula calibrated for Hausa.** Given §2 (no active standardizing body
since 1980), that is unsurprising.

⚠ **Note the epistemic status precisely: this is a failure to find, not a proof of absence.** A
Nigerian or Nigerien adult-literacy program may well hold internal simplified-Hausa guidelines
that are not on the open web. Locating any such guidance is item (3) on the follow-up list (§2).
**This section is not dressed up beyond that finding.**

**Consequence, per the authoring directive's explicit provision for exactly this case:
`ha-easy` inherits the kit's base simplified-language rules wholesale** —
see [accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md):
one idea per sentence, the kit's own ~8–12-word working target (**a kit figure, not attributable
to any Hausa norm**), everyday words, say what *is* rather than what *isn't*, active voice, a
one-line "what is this" opener, and a consistent literal tone. **No Hausa sentence-length norm is
stated here, because none exists to state** — and §8c's measured sentence lengths do not supply one
either, because they are an artifact.

**Term-preservation rule (restated, binding).** In `ha-easy`, **keep the technical term and
explain it** — never swap in a folksy stand-in. Keep **ƙirƙirarriyar basira (AI)**, then a
"that means: …" clause, then a concrete example. This is distinct from the substitution table in
§8b, which targets *choice between existing renderings*, not replacement of the term.

### 8b. The axis — ⚠ **this guide's own**, read off a genre because no tradition states one

**There is no Hausa plain-language tradition to claim an axis (§8a), so nothing in this subsection
is a tradition's claim.** What the research did find is a **genre**: writers who simplify technical
content into Hausa for lay readers. The axis below is read off that practice and is **⚠ editorial
throughout** — inferred from §3, §4, and §6, with no plain-language source behind it. Where a
supporting fact *is* sourced, it is sourced for something else (script integrity, aspect marking,
glossing convention) and is cited to that section.

**What does exist, and is worth leaning on — a genre, not a standard.**

- **A living tradition of simplifying technical content into Hausa for lay audiences.** The
  community computer-literacy primer fetched during research exists precisely to make computing
  *"a saukake"* — "made easy" — in Hausa, aimed explicitly at young learners [D]. Hausa-language
  science journalism does the same job daily [C]. **These are the models to imitate. A genre, not
  a norm.**
- **Hausa's own descriptive-compounding instinct is already a plain-language device.**
  `naʼura mai kwakwalwa` ("machine that has a brain") explains itself; `kwamfuta` does not. For
  beginners, **the descriptive compound is often the plainer choice even though the loanword is
  shorter.** ⚠ This is the guide's axis in one sentence, and it is the claim §8d flags hardest:
  it asserts that the borrowed word is the harder one, and **nothing measured here shows that**.

**Hausa-specific overlays** *(craft-tier, derived from sourced facts elsewhere in this guide —
inferences from §3, §4, and §6, not from any plain-language source):*

1. **Prefer the self-explaining native compound over the short loanword** for beginners (§6.1).
2. **One idea per sentence.** The PAC system (§4.2) means a long multi-clause sentence forces the
   reader to track several aspect shifts.
3. **Avoid bare single-word labels.** Tone/length ambiguity (§3.6) makes isolated short words
   genuinely riskier in Hausa than in English: `Fara darasi` beats `Fara`.
4. **Address the learner in the plural `ku`** (§4.3) — the recorded register; solves
   gender-neutrality and reads as respect (§8e).
5. **Gloss every borrowed technical term on first use** — the attested native convention (§6.2)
   *is* plain-language practice here, and it is the one item in this section with attestation
   behind it.
6. **Never "simplify" by dehooking.** Some writers drop hooks to keep things simple; this makes
   the text **harder**, not easier — a dehooked word is a different word (§3.2).

**Complex → everyday word table — ⚠ entirely unsourced, do not ship unreviewed.**

⚠ **ENTIRELY CRAFT-TIER [E].** The individual words are attested elsewhere in this guide's
corpora, but **the pairings below are editorial judgment and are not sourced.** They are included
because a marked, reviewable draft is more useful than an empty section. **A native Hausa editor
must review every row before use.** **§8c probed nothing here** — the corpus that was built cannot
speak to any of these rows, so not one of them has moved, in either direction, on evidence.

| # | Formal / technical | Everyday equivalent | Gloss of the plain form |
|---|---|---|---|
| 1 | `kwamfuta` | `naʼura mai kwakwalwa` | "machine with a brain" — self-explaining |
| 2 | `intanet` | `yanar gizo` | "spider's web" — visual and native |
| 3 | `ƙirƙirarriyar basira` | `naʼura mai iya koyo` | "a machine that can learn" |
| 4 | `koyon injina` | `yadda naʼura ke koyo` | "how a machine learns" |
| 5 | `bayanai` (abstract "data") | `bayanan da aka tara` | "the information that was gathered" |
| 6 | `algorithm` | `matakan aiki` | "the steps of the work" |
| 7 | `horar da samfuri` | `koyar da naʼura` | "teaching the machine" |
| 8 | `hasashe` | `tsammani` | "expectation, guess" — commoner word |
| 9 | `software` | `shirye-shirye` | "programs" — native plural |
| 10 | `sarrafa harshe na halitta` | `fahimtar magana` | "understanding speech/language" |
| 11 | `atomatik` | `da kansa` | "by itself" |
| 12 | `cutarwar wakilci` | `rashin adalci a sakamako` | "unfairness in the results" |

### 8c. 🔴 The corpus — the sentence figure is now real, the word list still is not, and the adult side is closed on policy

**The design was the best available for Hausa, and it was not a compromise.** The kit's preferred
shape — one publisher, two editions of the same material, one plainer and one standard — has a
second-best form that works: **graded children's books from a single publisher carrying that
publisher's own reading-level labels.** That is what was used, from the African Storybook library
(`africanstorybook.org`), whose access policy is **a single fully-permissive line**
(`User-agent: *`, no disallow).

**Keep the four findings apart, because they have four different consequences.** A corpus can be
unavailable because **(i) the publication does not exist**; **(ii) the publisher declines automated
text collection** — a **stated position**, respected as a refusal, never worked around; **(iii) the
text exists but in the wrong format**; or **(iv) the fetch was permitted and succeeded and the
extraction failed** — a technical wall a later pass can take down. **An earlier pass filed the adult
cross-check under (iv). That was wrong, and it is corrected below: it is (ii).**

**Hausa (Nigeria) holdings, enumerated from the publisher's own approved book list on
2026-07-29.**

| Level | Titles |
|---|---|
| 1 | 19 |
| 2 | 22 |
| 3 | 12 |
| 4 | 8 |
| 5 | 1 |

**⚠ These are not the numbers an earlier pass recorded**, which were 29 / 40 / 45 / 21 / 6 for a
total of 141. Re-enumerating the same list today returns **62** Hausa (Nigeria) titles, plus 19
Hausa (Niger) held separately. Both figures cannot be right and the discrepancy was not resolved:
either the library's approved list changed, or the earlier count included titles from a list this
pass did not use. **The figures above are what this pass counted, from the endpoint named in the
Sources footer**, and they make the size problem below worse, not better. A later pass should
re-enumerate rather than trust either number.

**What was built.** Each title was collected as **the publisher's own PDF edition**, which carries
clean text with the hooked letters intact — the tokenizer self-test passed on `da` and on the
hooked `ƙasa` in every corpus. **A = levels 1+2** against **B = level 3**, which is the re-balance
an earlier pass asked for; levels 4+5 are reported alongside and are too thin to carry anything.

| | titles | tokens | types | mean sentence | median | ≤15 words | tokens ≥12 chars |
|---|---|---|---|---|---|---|---|
| **levels 1–2** | 40 | 6,597 | 1,514 | 10.61 | 8 | 82.8 % | 0.4 % |
| **level 3** | 12 | 3,135 | 910 | 14.93 | 12 | 70.5 % | 0.5 % |
| **levels 4–5** | 9 | 2,978 | 841 | 14.11 | 12 | 69.2 % | 0.3 % |

**✅ 1. The sentence-length figure is repaired, and it now runs the right way round.** An earlier
pass reported **22.92 words for levels 1–2 against 16.90 for levels 4–5** — backwards, making the
easier books the longer-sentenced ones. Two extraction faults caused it and both are fixed in the
kit's collector: **standalone page numbers** sitting between book pages broke sentence detection,
and the library's **license and attribution front page** — four long sentences on every title,
never verbatim-identical because the author and the level change, so the recurring-line stripper
could not see it — was being counted as prose in short children's books. With both removed the
ordering is **10.61 → 14.93 → 14.11** words per sentence across levels 1–2, 3, and 4–5, over 622,
210, and 211 sentences. **That figure may be cited**, with its sample size and with what it is: a
measurement of one library's graded-reader practice, **not** a Hausa norm, since §8a establishes
that no Hausa authority states one.

**🔴 2. The word list is still unusable, and re-balancing did not fix it.** With 12 titles on the
standard side, the top of the distinguishing-word list is still **character names and story props**:
`kande`, `alto`, `bera`, `dorina`, `tanko` (names), `kunkuru` (tortoise), `damisa` (leopard),
`zomo` (hare), `anansi` (the spider of the folk tales). **That measures what the stories are about,
not how they are written.** For scale: the Swahili run over the same library had **247 titles
against 149**. **No frequency, ratio, or keyness rank from this pair appears anywhere in this guide
as a language finding, and none may be added later without a bigger sample.**

**🔴 3. The adult cross-check is closed by the publisher's stated position — correcting an earlier
finding.** An international broadcaster's Hausa service (`voahausa.com`) was the intended
standard-register side, and an earlier pass recorded it as *permitted*, with the note that it
"names no automated text-collection agent". **That is factually wrong.** Its `robots.txt` carries,
alongside its narrow path rules for `*`, a named block: `User-agent: AhrefsBot` / `Disallow: /`.
Under the rule this kit applies — **a host that disallows a named automated collection agent
outright has stated its position, and a user-agent string that is not on the list is not a
loophole** — the kit's collector refuses the host, and that refusal was **not overridden**.

**State the nuance, because the next pass will weigh it.** The named agent is a commercial
link-index crawler rather than a corpus or research agent, so this is a **conservative** reading of
the publisher's position and not an explicit refusal of corpus collection. The kit's rule is
deliberately conservative and is **not to be relaxed case by case by whoever happens to want the
corpus** — that is exactly the reasoning a rule like this exists to prevent. The route that remains
open is a licensed or manually agreed one, and only that. **A ~120,000-article Hausa adult corpus
is therefore recorded as unavailable on policy, not on engineering**, and §8g no longer lists an
extraction repair for it.

**One further document was rejected and reported rather than silently averaged in:** a single
level-1 title yielded no embedded text at all and is a probable scan. It was not OCR'd, because a
row derived from an OCR'd source belongs in a different evidence tier.

**Consequence, stated plainly.** §8b's word table stands where it stood — **entirely craft**. §8d
reverses no lexical row on evidence. What §8c now contributes is **one structural result that may
be cited** (sentence length by reading level, above), a negative on the adult corpus that is a
**policy** finding rather than a repairable fault, and the extraction fixes, which are in the tool
and will not have to be rediscovered.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none is presented as one.** In the measured guides of this
kit, §8d is where a corpus count deletes or inverts a word pair. **Hausa has a count and it is
unusable** (§8c), so this list does two narrower things: it marks what §8b's table and overlays do
and do not rest on, and it carries one cross-language finding as a warning to verify — never as a
Hausa result.

| Do **not** do this | Why |
|---|---|
| ~~read any row of the §8b table as measured~~ | **All twelve rows are ⚠ craft — unsourced pairings.** The individual words are attested elsewhere in this guide; the *pairing* of a formal member with an everyday one is this guide's editorial judgment. §8c produced no count that touches them. Apply them as hints with a native Hausa editor in the loop, and never let a downstream reviewer promote them to rules because they appear in a table. |
| ~~assume the loanword is the harder one~~ | **⚠ Cross-language finding, requiring local verification — not a fact about Hausa.** Across the languages in this kit where a plain-against-standard count *was* run, one result recurs: **the learned or borrowed word is not reliably the harder one**, and a "simplification" frequently swaps a common word for a **rarer** one, making the text harder rather than easier. **Rarity, not etymology, is what makes a word hard.** This bites in Hausa specifically, because §8b's whole axis is *native descriptive compound over short loanword* and rows 1, 2, 6, 9, and 11 of the table do exactly that swap. A Hausa reader who meets `kwamfuta` daily is not helped by `naʼura mai kwakwalwa` if the compound is the rarer form — and **§8c cannot tell you which is rarer.** Verify every such swap with a native reader; do not generalize the axis into "replace the borrowing". |
| ~~quote the old 22.92 / 16.90 words-per-sentence pair~~ | **Those two numbers were an extraction artifact and they ran backwards** (§8c): page numbers between book pages and a license front page broke sentence detection. Both faults are fixed and the repaired figures — **10.61 / 14.93 / 14.11** words across reading levels 1–2, 3, and 4–5 — supersede them. Cite the new pair with its sample size and with what it is: **one library's graded-reader practice, not a Hausa norm** (§8a). |
| ~~treat the repaired sentence figure as license to read the word list~~ | Different statistics need different sample sizes. 622 sentences carry a mean sentence length; **12 titles on the standard side do not carry a frequency table**, and the top of its keyness list is still character names and story props (§8c). One usable result in a corpus does not make the corpus usable. |
| ~~re-open the VOA Hausa extraction~~ | **The host's `robots.txt` blocks a named automated collection agent with `Disallow: /`** (§8c), so under this kit's rule it is a **stated position**, not a technical wall — correcting an earlier pass that recorded the opposite. The kit's collector refuses it and the refusal was not overridden. A licensed or manually agreed route is the only route; a different user-agent string is not one. |
| ~~simplify by word length alone~~ | In Hausa this fails in the **opposite** direction from most languages: §8b's own preferred plain form, the descriptive compound, is **longer** than the loanword it replaces. Length is not the axis here, and no measurement in this guide establishes what the axis is. The reliable structural win is **one idea per sentence** (§8b overlay 2), which shortens the sentence without picking a word. |
| ~~"simplify" by dehooking~~ | **The one hard prohibition in this section, and it is sourced (§3.2).** Dropping ɓ ɗ ƙ ƴ to "keep things simple" makes the text **harder**: a dehooked word is a **different word**, not a plainer spelling of the same one. This is a lexical error, not a cosmetic one, and it is worse in `ha-easy` than in `ha` because the reader has the least slack to absorb it. |
| ~~reduce a UI label to a single word for simplicity~~ | Tone and length are unwritten in Hausa (§3.6), so an isolated short word is systematically ambiguous — `Fara darasi` beats `Fara`. Fewer words is not automatically easier when the words that remain are ambiguous. ⚠ Craft, reasoned from a sourced orthographic fact. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **ƙirƙirarriyar basira (AI)**, then a "that means: …" clause, then a concrete example. With no lexical evidence available (§8c), a replacement is a guess; an explanation is not. |
| ~~drift the register in the name of simplicity~~ | `ha-easy` keeps the plural **`ku`** (§8e) because `ha` does (§4.3). The gendered singulars `ka` / `ki` are not simpler — each mis-addresses half the audience. |

> **→ The rule that follows.** For Hausa, **nothing in §8 is a measured lexical result.** The
> leverage is structural and orthographic — one idea per sentence, glossing on first use, hooks
> intact — and the word table is a draft for a native editor, not a substitution list to run.

### 8e. 🔑 The address decision — `ha-easy` keeps the plural **ku**, on the grounds §4.3 records

> **Decision, recorded so that nobody "fixes" it: `ha-easy` uses the plural `ku`, exactly as `ha`
> does (§4.3). It does NOT switch to a singular for "friendliness".**

- ✅ **`Ku danna maɓallin.`** — the plural, in `ha` and in `ha-easy` alike
- ❌ **`Ka danna maɓallin.`** (masculine only) · **`Ki danna maɓallin.`** (feminine only) — each
  mis-addresses half the audience

**The grounds are §4.3's, and they are of two different kinds — say which is which.** One is
**grammatical and concrete**: Hausa's singular "you" is gendered, so every `ka` / `ki` choice
mis-genders half the readership; the plural `ku` is the form that does not. The other is
**convention**: that `ku` is the register this guide records for a learner-facing platform and that
it "reads as respect" is a **project decision written down, not a ruling by any language
authority** — §2 records that there is no active standardizing body to appeal to, and none was
found for address (§4.5 carries the broader honorific system as an unverified lead, not as fact).
`ha-easy` changes neither part.

**⚠ §8 adds nothing in either direction, and §8c could not have helped even if it had worked.** No
source in §8a speaks to address, because there is no §8a source. And the corpus that was built is a
**children's book collection** (§8c): whatever address it uses is addressed **to children**, which
tracks the reader's *age*, not the text's *difficulty*. Reading it as evidence about `ha-easy`
would import exactly the condescension the variant exists to avoid. **Treat §8 as silent on
address.** What would settle it: adult Hausa easy-reading material, of which none was found.

### 8f. What `ha-easy` is built on, in order of leverage

1. **Sentence structure — the main lever, and the one that needs no lexical evidence.** One idea
   per sentence (§8b overlay 2), reasoned from a **sourced** grammatical fact: the person-aspect
   complex puts tense and aspect in the pronoun (§4.2), so a long multi-clause sentence makes the
   reader track several aspect shifts at once. ⚠ The inference is this guide's; the grammar behind
   it is not.
2. **Glossing every borrowed technical term on first use** (§8b overlay 5) — **the attested native
   convention** (§6.2), and therefore the strongest-standing item in this section. Paired with the
   binding term-preservation rule (§8a): keep the term, then "that means: …", then an example.
   Explaining a hard word is safer than replacing it, and with no usable corpus a replacement is a
   guess.
3. **Character integrity — hooks and the modifier apostrophe intact.** ɓ ɗ ƙ ƴ and ʼ (U+02BC) are
   **letters, not decoration** (§3.2, §3.3); dehooking is a lexical error and is prohibited outright
   (§8d). An easy-language reader has the least capacity to repair a corrupted word.
4. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), inherited because Hausa contributes no
   national pendant at all (§8a) — with **one figure now measured rather than inherited**. No Hausa
   authority states a sentence-length norm, but one library's graded Hausa readers do run at
   **10.61 words per sentence (median 8, 82.8 % at 15 words or fewer) at reading levels 1–2**,
   against 14.93 at level 3 (§8c). That **brackets the kit's ~8–12-word target rather than
   contradicting it**, which is worth stating precisely: it is the first Hausa number in this
   section that supports the base rule instead of merely inheriting it, and it is a measurement of
   children's-book practice, not of adult easy-language Hausa, which nothing here measures.
5. **The plural `ku` register (§4.3), held steadily** (§8e), and short phrases in place of bare
   one-word labels (§3.6) — ⚠ craft, offered as a reason rather than a rule.
6. **The self-explaining native compound over the short loanword — a hint, and the section's most
   exposed claim.** It is the axis §8b reads off the genre, and §8d flags it: nothing measured shows
   the borrowing is the harder member. Use it where a native reader confirms it; never as a
   find-and-replace.
7. **Vocabulary substitution last, and as a draft only** — every row of §8b's table is craft and
   none has had a native pass. Nothing in this guide licenses a bulk substitution over Hausa
   vocabulary.

### 8g. What is still open

1. **The lexical side needs a bigger standard-register corpus, and the obvious one is closed.**
   The graded library's Hausa holding is 62 approved Nigeria titles across all five levels (§8c);
   the Swahili run over the same library had four times that. The adult cross-check that would have
   supplied the standard side is **out on the publisher's stated position** (§8c), so the open
   question is *which other permitted Hausa adult-register publisher exists*, not how to extract
   from that one. **Do not re-open the closed host.**
2. **Re-enumerate before trusting either title count.** This pass counted 19 / 22 / 12 / 8 / 1;
   an earlier pass recorded 29 / 40 / 45 / 21 / 6. The discrepancy is unresolved (§8c) and a third
   count is cheap.
3. **Hausa (Niger) was left out of the pair on purpose.** The library holds 19 further titles under
   that label, weighted toward level 4. Folding them in would grow the thin standard side — but it
   would mix two regional varieties **unevenly across the two halves**, which is a confound, not a
   sample. If a later pass wants them, it must balance them across both sides or report the variety
   split.
4. **One title is a scan** and was reported rather than counted (§8c). OCR would place any row
   derived from it in a different evidence tier; it is one book and it is not worth that.
5. **All twelve rows of the §8b table are craft and none has had a native-speaker pass.** They are
   the largest unverified block in this section. A native Hausa editor could convert most of them
   into evidence-bearing rows — the cheapest available improvement to §8, and the one that does not
   wait on any host.
6. **No Hausa plain-language guidance was located, and the negative is a search result, not an
   exhaustive one** (§8a). A Nigerian or Nigerien adult-literacy program may hold internal
   simplified-Hausa guidelines off the open web; this is item (3) on the §2 follow-up list.
7. **The measured sentence length is children's-book practice, not adult easy-language practice.**
   §8f says so and it must stay said: nothing in this kit has measured how an adult Hausa text
   written for easy reading is built.
8. **The address decision rests partly on convention** (§4.3), and §8 cannot reinforce it (§8e).
9. **No comprehension evidence exists for any of this.** Whether the recommended forms are actually
   *understood* better was not established.

Sources: **none for the plain-language tradition itself — the ❌ finding is the section's headline
result.** The genre observations rest on a community computer-literacy primer [D] and Hausa science
journalism [C]; the overlays and the word table are craft-tier inference from §3/§4/§6 and are
marked as such. **Corpus (§8c)** — graded Hausa (Nigeria) titles from the African Storybook library
(<https://africanstorybook.org/>, access policy fully permissive), enumerated from
`/lists/booklist.approved.php` on 2026-07-29 and collected as the publisher's own PDF editions:
**40 titles at reading levels 1–2 (6,597 tokens) against 12 at level 3 (3,135 tokens)**, with
levels 4–5 (9 titles, 2,978 tokens) reported alongside. Counted with the repository's own
[`scripts/corpus-measure.mjs`](../../scripts/corpus-measure.mjs) (`pdf --alphabet --drop-until`,
`stats --sanity da` and `--sanity ƙasa`, `compare`). The counts are **this guide's own** and
**Community tier**. **The sentence-length result may be cited; the word list may not** — it is
dominated by story topic (§8c). The intended adult cross-check, an international broadcaster's
Hausa service (`voahausa.com`), is **closed on the publisher's stated position**: its `robots.txt`
disallows a named automated collection agent outright, the kit's collector refuses the host, and
the refusal was **not overridden** (§8c, §8d). Base rules inherited from
[accessibility-workflow](../accessibility-workflow.md), with the sentence-length target now
**supported by a Hausa measurement** rather than only inherited (§8f).

---

## 9. Regional variation

### 9.1 The written norm is Kano-based — *Daidaitacciyar Hausa*

The Kano dialect was established as **Daidaitacciyar Hausa** (Standard Hausa) [C/D]. Wikipedia
concurs, naming both eastern varieties: "The Daura (Dauranci) and Kano (Kananci) dialects are the
standard", and notes that international broadcasters use these varieties in their Hausa
programming. Wiktionary's phonological transcriptions are explicitly given for "Standard Kano
Hausa".

**Put *Daidaitacciyar Hausa* in the style guide by name** — it is the recognized Hausa term for the
written standard, and it is Kano-based. Note the geminate `cc`; the spelling `Daidaitaciyar` is
also seen in the wild [C, observed variation].

### 9.2 Nigeria vs Niger — what is actually verified, and what is not

| Dimension | Nigeria | Niger |
|---|---|---|
| **Glottalized palatal** | **ʼy** (U+02BC + y) | **ƴ** (U+01B4) |
| **Colonial substrate shaping spelling** | English | French |
| **Alphabet basis** | Pan-Nigerian alphabet (National Language Centre, 1980s) | Nigerien conventions |
| **Language status** | *National* language; English official | **Official language since March 2025** |
| **Currency** | NGN **₦** | XOF **`F CFA`** |
| **Standardizing address** | Bayero University Kano / NERDC | ⚠ not identified by this research |

Verbatim support: "ƴ is used in Niger, and ʼy is used in Nigeria." [A] · "The letter ⟨ƴ⟩ is used
only in Niger; in Nigeria it is written ⟨ʼy⟩." and "differences in boko used in Niger and Nigeria
due to different pronunciations in the French and English languages" [B/D] · "Since the 1980s,
Nigerian boko has been based on the Pan-Nigerian alphabet." [B/D] · "French was relegated to the
status of a working language, whilst Hausa was designated as the official language" (Niger, March
2025) [C].

- ✅ Nigerian convention (**this platform**): **`ʼyaʼya`** — U+02BC + `y`
- ✅ Nigerien convention (**not shipped**): **`ƴaƴa`** — U+01B4
- ❌ **`'ya'ya`** / **`’ya’ya`** — ASCII or curly apostrophe standing in for U+02BC (§3.3)
- ❌ **`ƴ`** appearing inside a `ha-Latn-NG` build — wrong regional convention (§11)

> ⚠ **Beyond the ƴ / ʼy split, no systematic Nigeria-vs-Niger difference list could be verified,
> and none is manufactured here.** The "French vs English pronunciation" statement is real but
> vague. The obvious expectation — that Niger Hausa borrows technical vocabulary through French
> while Nigerian Hausa borrows through English — is **plausible and unverified**; no source
> documenting it was found, and **no examples are invented to fill the gap.** Filling this out is
> a follow-up research item.

### 9.3 Neutrality strategy — explicit

**Ship Nigerian-convention Kano-standard Hausa (`ha-Latn-NG`) as the single default** (§4.3). Rationale, recorded:

1. **Audience weight** — Nigeria has roughly three times Niger's Hausa population (67m vs 22m).
2. **The written standard is already Kano-based**, and Kano is in Nigeria — *Daidaitacciyar Hausa*
   *is* the Nigerian norm (§9.1).
3. **The lexicographic default aligns** — "Nigerian Hausa is the default" [D — the largest open
   Hausa lexicographic project's editorial guideline].
4. **It is the safer typographic choice** — `ʼy` (U+02BC + y) survives in more fonts than `ƴ`
   (U+01B4), which is the rarest of the four hooked letters (it appears only *parenthesized* even
   in the Boko-alphabet letter table, §3.1).

**But do not treat Niger as out of scope.** Given Hausa's 2025 elevation to official language
there, a Nigerien audience is likely to grow. Design for it now, cheaply:

- Keep the `ʼy` / `ƴ` distinction as a **single build-time transform**, not scattered through the
  strings. One rule, one switch.
- Keep currency **out of hardcoded copy** (NGN vs XOF, §5.2).
- Use **`ha-Latn-NG`** as the shipped locale identifier so **`ha-Latn-NE`** can be added later
  without renaming anything.
- Ajami is **not** a regional variant of this build — it is a separate script locale, `ha-Arab`
  (§3.5).

Sources: <https://r12a.github.io/scripts/latn/ha.html> · <https://en.wikipedia.org/wiki/Boko_alphabet> ·
<https://www.omniglot.com/writing/hausa.htm> · <https://en.wikipedia.org/wiki/Hausa_language> ·
<https://en.wiktionary.org/wiki/Wiktionary:Hausa_entry_guidelines> (community editorial guideline) ·
<http://tsangayaradabi.blogspot.com/2017/11/asali-da-ginuwar-daidaitaciyar-hausa-da.html> ·
<https://globalvoices.org/2025/06/28/hausa-replaces-french-as-the-official-language-of-niger-in-a-bold-assertion-of-sovereignty/>

---

