<!-- base -->
# lang-pa — Punjabi (ਪੰਜਾਬੀ) — language guide

> **Setup & sources live in [`pa.setup.md`](pa.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** ਪੰਜਾਬੀ / Punjabi.
**BCP 47 code (base):** `pa` — which, per CLDR, resolves to **`pa-Guru-IN`** (Gurmukhi script,
India). See the script decision below; it is the single most consequential line in this guide.
**BCP 47 code (simplified variant):** `pa-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`pa-x-simple`), but the kit token `pa-easy` is the one
that counts here.
**Speaker reach:** **~120 million native speakers is the defensible floor.** The commonly repeated
"~150 million" figure comes from the English Wikipedia lead ("approximately 150 million native
speakers") but **does not reconcile with that same article's own country breakdown** — 88.9 million
in Pakistan (2023 census) + 31.1 million in India (2011 census) + diaspora ≈ 122 million. ⚠ Treat
150 M as an upper, loosely-sourced figure (most plausibly including Western Punjabi / Lahnda
varieties and L2 speakers); **never present it as census-derived.** Diaspora: Canada 670,000 (2021),
UK 300,000 (2011), US 280,000.
**Script + direction:** **Gurmukhi**, Unicode block **U+0A00–U+0A7F** (80 characters, one block
only), **left-to-right**, whitespace-separated words, **no case distinction**. Punjabi's *other*
script — Shahmukhi, Perso-Arabic, right-to-left — is **out of scope by design** (§9), and that
exclusion is the largest single trade-off this guide makes.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a **single
agent-native research dossier** (self-fetched, quote-per-claim), then independently reviewed against
its cited sources; three T1 anchors (Unicode
`CompositionExclusions.txt`, CLDR `pa` `numbers.json`, CLDR `likelySubtags.json`) were re-fetched
during authoring and confirmed verbatim.
**Coverage is honestly uneven, and this is a first pass:** the research run exhausted its web-search
budget partway through and finished on direct primary-source fetches, which biased coverage *towards*
standards data and *away* from Punjabi-language media and community discussion. Concretely: §3
(script/typography), §5 (numbers/dates) and §2 (authorities) are **strong and T1-anchored**; §6
(terminology) is **encyclopedic-tier only** — the planned media corpus was host-blocked; §8 (plain
language) rests on an **honest negative finding of moderate, not conclusive, strength**; §7 (idioms)
is **entirely `[craft]` — unsourced proposals**. Covers base `pa` and the `pa-easy` pendant.
**Easy or hard for this kit:** **hard, and hard in ways that are invisible from an English desk.**
LTR and whitespace tokenization are the only easy parts. The four things that actually bite:
(1) **NFC leaves the six nukta letters decomposed** — all six are in Unicode's Composition Exclusion
Table, so ਸ਼ is two code points, and unnormalized string comparison silently breaks translation-memory
lookups and key matching (§3, the headline finding); (2) **the number system groups 2,2,3, not by
thousands** — `100000` must render `1,00,000`, and any test below one lakh passes on broken code
(§5); (3) **combining-mark hazards** — one vowel sign reorders to the *left* of its consonant, the
gemination mark *precedes* its consonant, and tippi vs bindi is a typographically-conditioned
distinction that gets fudged by anyone editing Punjabi in a plain-text box (§3); (4) **register is
verb morphology, not a pronoun** — choosing ਤੁਸੀਂ changes agreement across the clause, so it cannot
be flipped late in a project (§4).

Sources: <https://en.wikipedia.org/wiki/Punjabi_language> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/likelySubtags.json> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/numbers.json>

---

## 1. Header block

See above. One-line orientation: Punjabi is an Indo-Aryan, **SOV**, postpositional, **tonal**
(unusual for its family) language, written here in the **Gurmukhi abugida**, LTR; the localization
risks concentrate in **Unicode normalization of nukta letters, South-Asian digit grouping,
combining-mark handling, and a register choice that propagates through verb morphology** — not in
direction or shaping complexity.

### The script decision — read this before anything else

**Decided: the base locale is Gurmukhi (`pa-Guru`, India). Decision recorded 2026-07-26.**

This decision **goes against the raw speaker split**, and the guide says so openly rather than
implying the choice was obvious:

| | Gurmukhi (India) | Shahmukhi (Pakistan) |
|---|---|---|
| Native speakers | **31.1 million** (2011 census) | **88.9 million** (2023 census) |
| Wikipedia articles | 59,632 (`pa.wikipedia.org`) | **75,635** (`pnb.wikipedia.org`) |

**The larger population, and the larger digital corpus, are on the Shahmukhi side.** Both scripts are
live and normal digitally; neither is vestigial. The decision was made anyway, on four grounds, in
order of weight:

1. **CLDR already resolves the bare tag.** `"pa": "pa-Guru-IN"`, `"pa-Arab": "pa-Arab-PK"`,
   `"pa-PK": "pa-Arab-PK"` (CLDR `likelySubtags.json`, re-verified during authoring). Ship Shahmukhi
   under `lang="pa"` and **every** standards-conformant consumer — font fallback chains, screen
   readers, search engines, locale-aware number and date formatters — resolves it to `pa-Guru-IN` and
   mishandles the text. This is decisive for a web platform.
2. **RTL vs LTR is not a string swap.** Shahmukhi is `dir="rtl"`: mirrored layout, mirrored icons,
   mirrored progress indicators, bidi-safe concatenation, different digits, different fonts,
   different line-breaking. It is a full second locale build, not a translation file.
3. **Institutional backing.** Punjabi is the official language of Punjab state (India) and an
   additional official language in Haryana and Delhi; the entire language-technology infrastructure
   that exists (Punjabi University, Patiala — dictionaries, reference grammar, grammar checker,
   transliteration) is **Gurmukhi-based** (§2). The fetched sources assert only *demographic*
   dominance for Punjabi in Pakistan — they **do not assert official status** there. The larger
   speaker population has the weaker institutional footing.
4. **Diaspora skew.** `[craft — reasoned, not sourced]` The Canada/UK/US Punjabi-speaking populations
   are predominantly Sikh-heritage communities for whom Gurmukhi is the heritage script. No fetchable
   source quantifying diaspora script literacy was found; this is a judgment, not a finding.

**What this costs, stated plainly: this guide explicitly does not serve the ~89 million Punjabi
speakers in Pakistan.** That is the larger group, and this is a real trade-off, not a wash. A
Pakistani Punjabi reader who finds this guide should understand immediately that they are out of
scope **by design, not by neglect.**

**The escape hatch,** if a Shahmukhi edition is ever wanted: ship it as a **separate `pa-Arab`
locale**, seeded — *as a first draft only* — via Punjabi University's bidirectional Gurmukhi ↔
Shahmukhi transliteration system (SANGAM, ACTDPL, mission "Transcending Script Barriers"), then
**full native review** for register and vocabulary (transliteration converts letters, not word
choices) **plus a complete RTL layout pass**. The full fork table is in §9.

Sources: <https://en.wikipedia.org/wiki/Punjabi_language> · <https://en.wikipedia.org/wiki/Shahmukhi> ·
<https://pa.wikipedia.org/> · <https://pnb.wikipedia.org/> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/likelySubtags.json> ·
<https://sangam.learnpunjabi.org/>

---

## 4. Grammar for translators

**⚠ Encyclopedic-tier section.** The grammar facts rest on **Wikipedia's Punjabi grammar / language /
phonology articles** — standard, well-known facts, but **not** an ACTDPL reference grammar. The
example pairs are **`[craft]` illustrations authored by the researcher**, not quoted from a reference
work; each is marked at point of use. **Native-speaker confirmation pending.**

**Word order — the verb goes last.** "Punjabi has a canonical word order of subject–object–verb and
has postpositions, rather than prepositions." (Wikipedia — Punjabi grammar). This is the single
biggest structural difference from English and it has a direct UI consequence: **you cannot build
Punjabi sentences from English-ordered fragments.**

### Register decision — ਤੁਸੀਂ, including imperatives

> **Register decision (human-gate): ਤੁਸੀਂ (the formal/plural V-form) — taken and recorded.**
> **Binding for all second-person copy** in `pa` and `pa-easy`.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**Why, and why it cannot wait.** "The language has a T-V distinction in *tū̃* and *tusī̃*. This latter
'polite' form is also grammatically plural." (Wikipedia — Punjabi grammar). The crucial words are
*"also grammatically plural"*: **choosing ਤੁਸੀਂ is not a pronoun swap.** The verb, the imperative form,
and every agreeing participle change with it. **You cannot flip register late in a project by
find-and-replacing the pronoun** — which is exactly why this is decided up front rather than left to
translators.

**Evidence from real educational Punjabi.** Punjabi Wikipedia — a public, reader-facing, educational
text — addresses its readers in the ਤੁਸੀਂ form throughout:

> "ਤੁਸੀਂ ਵੀ ਇਸ ਵਿਸ਼ਵਕੋਸ਼ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾ ਸਕਦੇ ਹੋ।"
> "ਤੁਹਾਨੂੰ ਖ਼ਾਤਾ ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ ਦਾਖ਼ਲ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ"
> — pa.wikipedia.org

Note the verb form **ਸਕਦੇ ਹੋ** (plural/polite) rather than *ਸਕਦਾ ਹੈਂ* — **the agreement follows the
pronoun, exactly as predicted.** That is the mechanism in one line.

Further reasons: ਤੂੰ toward an adult stranger reads as **condescending or intimate**, which an
educational platform addressing unknown adults cannot risk; and ਤੁਸੀਂ is register-safe across the whole
audience — children, adults, elders, diaspora learners — whereas ਤੂੰ is safe only for a narrow slice.

**Imperatives take the ਤੁਸੀਂ form** `[craft — forms are standard; not individually quoted]`:

- ✅ `ਸ਼ੁਰੂ ਕਰੋ` (start) · `ਜਾਰੀ ਰੱਖੋ` (continue) · `ਚੁਣੋ` (choose) · `ਵੇਖੋ` (view)
- ❌ `ਕਰ` · `ਰੱਖ` · `ਚੁਣ` · `ਵੇਖ` — the ਤੂੰ singular imperative; a register defect.

**Automatable QA check** `[craft]`**:** grep the translation bundle for **ਤੂੰ**, **ਤੇਰਾ**, **ਤੇਰੀ**,
**ਤੈਨੂੰ**. Any hit in UI copy is a register break (§11).

**The one legitimate exception:** quoted dialogue, songs, or scriptural/literary quotations inside
*content*, where ਤੂੰ may be authentic. **Mark those strings as exempt explicitly** so the check does
not fight the content.

### The five features that break naive EN → PA

**(1) SOV order kills concatenated strings.** English `"Continue to " + moduleName` places the noun
after the verb; Punjabi puts the verb last, so appending a variable after the verb produces nonsense.
**Rule: every user-facing string is a whole sentence with its own placeholder.** `[craft — example
authored by the researcher]`

- ✅ `"{module} ਨੂੰ ਜਾਰੀ ਰੱਖੋ"` — one string, placeholder inside, verb last.
- ❌ `"ਜਾਰੀ ਰੱਖੋ " + module` — verb stranded mid-sentence.

**(2) Postpositions force the oblique case on the noun.** "Their use with a noun or verb requires the
noun or verb to take the oblique case, and they are the locus of grammatical function, or
'case-marking'" (Wikipedia — Punjabi grammar). **The noun itself changes shape depending on what
follows it**, so a placeholder that is grammatical in one sentence is ungrammatical in the next.

- ✅ Separate keys per case slot, **or** embed the postposition in the string so the translator can
  inflect around it.
- ❌ Reusing one bare noun placeholder across differently-cased slots.
- ⚠ **Gap flagged:** the research supplies **no contrastive Punjabi form pair** for oblique
  inflection. The rule is sourced; the wrong/right pair is deliberately left as a structural pair
  rather than fabricated. **Next research round: request an attested nominative/oblique pair.**

**(3) Gender agreement propagates through the whole clause.** "Declinable adjectives have endings
that change by the gender, number and case of the noun that they qualify." (Wikipedia — Punjabi
grammar). Punjabi nouns are masculine or feminine and **adjectives and verbs agree**; English has no
gender, so a variable noun injected into a Punjabi sentence **cannot be agreed with at build time**.
`[craft — the pair is the researcher's own illustration]`

- ✅ `ਪੂਰਾ ਹੋ ਗਿਆ` (agreeing with a masculine noun) · ✅ `ਪੂਰੀ ਹੋ ਗਈ` (feminine) — both "completed".
- ❌ Templating `"{item} ਪੂਰਾ ਹੋ ਗਿਆ"` across item types — the ending is wrong for half of them.
- ✅ Write the sentence per item type, or use a gender-neutral nominal construction the **translator**
  chooses.

**(4) The ergative — verb agreement flips in the past tense.** "Finite verbal agreement is with the
nominative subject, except in the transitive perfective, where it can be with the direct object, with
the erstwhile subject taking the ergative construction *-ne*." (Wikipedia — Punjabi grammar). In plain
terms: **in past-tense transitive sentences the subject takes ਨੇ and the verb agrees with the object,
not the subject.** "You completed the lesson" and "You completed the exercise" therefore take
*different verb endings* depending on the gender of the lesson/exercise.

- ✅ Every past-tense achievement/progress string gets **native review, every time.**
- ❌ Assuming an English-speaking reviewer can spot the error — this is invisible from English, and it
  is exactly where machine-assisted output goes wrong.
- ⚠ **Gap flagged:** no attested contrastive ergative pair was supplied by the research; none is
  invented here. **Next research round: request a sourced ਨੇ-construction pair.**

**(5) The T-V distinction is grammatically plural** — it changes verb morphology, not just a pronoun.
See the register decision above.

### Tone — real, unusual, and not a writing problem

"Punjabi is unusual among the Indo-Aryan languages and the broader Indo-European language family in
its usage of lexical tone" (Wikipedia — Punjabi language). "Two are distinguished in Punjabi: falling
and rising." … "About 75% of Punjabi words have no rising or falling tone, and this absence of tone is
described with a third label called 'level' tone." (Wikipedia — Punjabi phonology).

**Is tone written? Essentially no:** "Gurmukhi doesn't normally use tone diacritics. Instead, certain
character combinations serve to indicate high and low tones." (r12a). The tone-bearing letters are the
historical voiced aspirates plus ਹ — "Tonal consonants are any voiced aspirates /ʱ/ and the voiced
glottal fricative /ɦ/. These include the five voiced aspirated plosives *bh*, *dh*, *ḍh*, *jh* and
*gh*", i.e. **ਭ, ਧ, ਢ, ਝ, ਘ** and **ਹ**.

**For a text platform this means: do nothing special — tone is carried by ordinary spelling.** Three
consequences do land, though:

1. **Never "simplify" ਹ out of a word**, and never treat ਘ / ਝ / ਢ / ਧ / ਭ as interchangeable with
   ਗ / ਜ / ਡ / ਦ / ਬ. Those substitutions change *tone*, i.e. change the word.
2. **If pronunciation audio or text-to-speech is ever added**, tone becomes a first-class correctness
   problem needing native validation. Do not assume a generic Indic voice handles it.
3. **Do not use U+0A51 UDAAT to mark tone** in modern copy — Unicode records it as occurring "in older
   texts" (§3.7).

Sources (encyclopedic-tier): <https://en.wikipedia.org/wiki/Punjabi_grammar> ·
<https://en.wikipedia.org/wiki/Punjabi_language> · <https://en.wikipedia.org/wiki/Punjabi_phonology> ·
<https://pa.wikipedia.org/> (register evidence — reader-facing educational text) ·
<https://r12a.github.io/scripts/guru/pa.html> (tone not written)

---

## 5. Numbers, dates, currency

**(Strong section — every pattern below is quoted verbatim from CLDR data files, read from the pinned
release **CLDR 48.2** (data packages `48.2.0`, published 2026-03-17). `numbers.json` was re-fetched during authoring; all
five `pa` files were re-read against 48.2.0 on 2026-07-27, replacing this guide's earlier v46
citations, and **no quoted value changed** — see §2.)**

### 5.1 Digits: Western 0–9, not Gurmukhi

CLDR sets the default numbering system for `pa` to Latin digits:

> **defaultNumberingSystem:** `"latn"` — CLDR `cldr-numbers-full/main/pa/numbers.json`

This matches observed practice: **"Gurmukhi has its own set of decimal digits, however modern text
tends to use ASCII digits."** (r12a).

Gurmukhi digits do exist — "Gurmukhī has its own set of digits, or ਅੰਗੜੇ *aṅgăṛē*", **੦–੯ at
U+0A66–U+0A6F** — and CLDR carries a full `guru` numbering system alongside `latn`. Where do they
still appear? r12a is precise: "In some cases the choice of digits depends on the context. For
example, list counter styles often use Gurmukhi digits, whereas postcodes, route numbers, and ordinal
dates, etc. tend to use ASCII digits."

**➜ Rule: use Western digits (0–9) everywhere.** Prices, dates, percentages, scores, progress
counters, chart axes, version numbers — all Western. The **only** defensible use of ੦–੯ is decorative
**ordered-list counters** (`list-style-type: gurmukhi`), and even that should be a deliberate design
choice, not a default. **Never mix the two digit sets in one view.**

- ✅ `1,00,000` · `2026` · `75%` — Western digits.
- ❌ `੧,੦੦,੦੦੦` in running UI copy.

**Bug to watch for** `[craft]`**:** if a translator hand-types a "2" while in a Gurmukhi keyboard
layout, you may silently get **U+0A68 instead of U+0032** — visually plausible, but it fails every
numeric parse and sorts wrong. **Automatable check: any code point in U+0A66–U+0A6F inside a Punjabi
string is suspect** (§11).

### 5.2 The lakh/crore grouping — ⚠ THE FORMATTING TRAP

**This is the finding that most often ships broken.** CLDR's Punjabi patterns are **not** the Western
`#,##0.###`:

> **decimalFormats-numberSystem-latn standard:** `"#,##,##0.###"`
> **percentFormats-numberSystem-latn standard:** `"#,##,##0%"`
> **currencyFormats-numberSystem-latn standard:** `"¤#,##,##0.00"`
> **decimal symbol:** `"."` · **group symbol:** `","`
> — CLDR `cldr-numbers-full/main/pa/numbers.json` (re-fetched and confirmed during authoring)

The doubled `,##,` encodes the **South Asian 2,2,3 grouping**: three digits in the lowest group, then
**groups of two** above it. Scale names: "*lakh* (one hundred thousand, 10⁵) and *crore* (ten million,
10⁷)" … "the Indian system groups by two digits." (Wikipedia — Indian numbering system).

**Worked comparison — this is exactly what QA should diff:**

| Value | Western (`en-US`) | Punjabi (`pa`) |
|---:|---:|---:|
| 1 000 | `1,000` | `1,000` |
| 100 000 | `100,000` | **`1,00,000`** |
| 1 000 000 | `1,000,000` | **`10,00,000`** |
| 10 000 000 | `10,000,000` | **`1,00,00,000`** |
| 123 456 789 | `123,456,789` | **`12,34,56,789`** |

- ✅ `1,00,000` · `10,00,000` · `12,34,56,789`
- ❌ `100,000` · `1,000,000` · `123,456,789` in Punjabi output.

**➜ Rules:**

1. **Never hand-format numbers.** Use `Intl.NumberFormat('pa', …)` (or the server-side equivalent) and
   let CLDR apply `#,##,##0.###`. A hardcoded thousands-separator regex, or an English-locale
   formatter with a translated label, produces `1,000,000` where Punjabi requires `10,00,000`.
2. **⚠ Test with a number ≥ 100,000.** **Below one lakh the Indian and Western systems are
   identical** — so a test suite that only checks `1,234` will **pass while the feature is broken.**
   This is a mandatory verification instruction, not a suggestion (§11).
3. **Chart axes and data-viz labels are the usual leak.** Charting libraries commonly format ticks
   themselves with a Western default. Pass an explicit locale-aware formatter.
4. **Decimal separator is `.` and group separator is `,`** — same glyphs as English, **opposite of
   German**. Do not assume a European convention.
5. ⚠ **Inconsistency worth flagging:** the *same* CLDR file gives the **accounting** currency pattern
   as `"¤ #,##0.00"` — Western 3-grouping **and** a space, inconsistent with the standard pattern in
   the same locale. **Use the standard pattern for user-facing amounts; treat the accounting pattern
   as out of scope.**

### 5.3 Currency

> **INR displayName:** `"ਭਾਰਤੀ ਰੁਪਇਆ"` · **displayName-count-one:** `"ਭਾਰਤੀ ਰੁਪਇਆ"` ·
> **displayName-count-other:** `"ਭਾਰਤੀ ਰੁਪਏ"` · **symbol:** `"₹"` · **symbol-alt-narrow:** `"₹"`
> — CLDR `cldr-numbers-full/main/pa/currencies.json`

**Placement:** from the standard pattern `¤#,##,##0.00` — **symbol immediately before the number, no
space.** The symbol is **U+20B9 INDIAN RUPEE SIGN** `[derived — CLDR gives the glyph, not the code
point]`.

- ✅ `₹1,00,000.00` — symbol first, no space, lakh grouping.
- ❌ `₹ 100,000.00` — space after the symbol **and** Western grouping; two defects in one string.

**The currency name inflects:** ਭਾਰਤੀ ਰੁਪਇਆ (one) vs ਭਾਰਤੀ ਰੁਪਏ (other). If you ever spell out the
currency instead of using ₹, you need **both** forms and they must follow the CLDR plural rules below.

**Font check:** ₹ (U+20B9) is a relatively recent code point. Verify your Gurmukhi font stack renders
it, or explicitly fall back to a Latin font for the symbol — **a tofu box next to a price is a
trust-killer.**

### 5.4 Dates and times

Read from the CLDR `pa` Gregorian calendar data (**CLDR 48.2, released 2026-03-17**; see the
re-read note in §2):

```json
"dateFormats": { "full": "EEEE, d MMMM y", "long": "d MMMM y",
                 "medium": "d MMM y", "short": "d/M/yy" }
"timeFormats": { "full": "h:mm:ss a zzzz", "long": "h:mm:ss a z",
                 "medium": "h:mm:ss a", "short": "h:mm a" }
```
> — CLDR `cldr-dates-full/main/pa/ca-gregorian.json`

**➜ Rules:**

1. **Day precedes month.** `d/M/yy` — so `3/7/26` is **July 3, 2026, not March 7.**
   - ✅ `3/7/26` read as July 3; ✅ unambiguous display uses the medium form `d MMM y`.
   - ❌ Shipping a bare numeric date anywhere a user might act on it.
2. **Two-digit year in the short form.** If you need an unambiguous date, do not use `short`.
3. **12-hour clock with an AM/PM marker** (`h:mm a`), **not** 24-hour.
   - ✅ `h:mm a` via the locale formatter. ❌ Hardcoded `HH:mm`.
4. **Use `Intl.DateTimeFormat('pa', …)`** rather than a string template. **Month names come from CLDR
   and must not be hand-translated.**

### 5.5 Plurals — two forms, and `one` includes zero

> **pluralRule-count-one:** `"n = 0..1 @integer 0, 1 @decimal 0.0, 1.0, 0.00, 1.00, …"`
> **pluralRule-count-other:** `"@integer 2~17, 100, 1000, 10000, 100000, 1000000, … @decimal 0.1~0.9, …"`
> — CLDR `supplemental/plurals.json`

**Two categories, `one` and `other` — and `one` covers 0 as well as 1.** This differs from English,
where 0 takes the plural ("0 items"). **So a Punjabi plural rule mechanically copied from English is
wrong at zero — and 0 is precisely the value your empty states, unread counts, and progress indicators
display most often.**

- ✅ Supply **both** `one` and `other` for every countable string, and **test at n = 0, 1, 2.**
- ❌ Reusing the English plural logic, which sends n = 0 to the `other` form.

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/pa/currencies.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/pa/ca-gregorian.json> ·
<https://en.wikipedia.org/wiki/Indian_numbering_system> ·
<https://r12a.github.io/scripts/guru/pa.html>

---

## 6. Terminology strategy

**⚠ Encyclopedic-tier section, and it is weaker than it should be.** The seed table below rests on
**Punjabi Wikipedia article titles, Punjabi Wikipedia running text, and Wikidata `pa` labels**. The
research plan called for a **media tier** — Punjabi-language journalism — as the register and
terminology corpus, and **`bbc.com/punjabi` was host-blocked**, so that tier is **entirely missing**.
This section therefore reflects encyclopedic usage only and **must not be read as evidence of broad
corpus coverage.** The gap list in §6.3 is as important as the term table.

### 6.1 What the corpus actually does

Punjabi AI/ML terminology is **sparse, unstandardized, and visibly torn between three strategies**:
Sanskritic/Hindi-style coinage, Perso-Arabic-flavored coinage, and straight English transliteration.
The clearest single piece of evidence is the opening line of the Punjabi Wikipedia article on AI,
which **lists seven competing names for the same concept before defining it**:

> "ਮਸ਼ੀਨੀ ਬੁੱਧੀ, ਮਸ਼ੀਨੀ ਬੁੱਧੀਮਾਨਤਾ, ਮਸਨੂਈ ਬੁੱਧੀ, ਬਣਾਉਟੀ ਬੁੱਧੀ, ਬਣਾਵਟੀ ਬੌਧਿਕਤਾ, ਕ੍ਰਿਤਮ ਬੁੱਧੀ ਜਾਂ ਆਰਟੀਫਿਸ਼ਲ
> ਇੰਟੈਲਿਜੈਂਸ (ਏਆਈ), ਤਕਨੀਕ ਦੀ ਇੱਕ ਪ੍ਰਣਾਲੀ ਹੈ…" — pa.wikipedia, ਬਣਾਵਟੀ ਬੁੱਧੀ

**Read that as a finding, not a curiosity: there is no settled Punjabi word for "artificial
intelligence".** Seven variants in one sentence is what an unstandardized field looks like. Note also
**ਮਸਨੂਈ** (Perso-Arabic origin) sitting beside **ਕ੍ਰਿਤਮ** (Sanskritic) in the same list — Punjabi draws
on both registers, and that is precisely the axis that diverges across the border (§9).

**The dominant working strategy in running text is English transliteration plus a gloss.** The
deepfake article gives the English term *and* a Punjabi coinage in parentheses:

> "ਡੀਪਫੇਕ ਬਹੁਤ ਹੀ ਤਾਕਤਵਰ ਤਕਨੀਕ (ਆਰਟੀਫਿਸ਼ਲ ਇੰਟੈਲੀਜੈਂਸ) (ਮਸਨੂਈ ਬੁੱਧੀ) ਦੇ ਜ਼ਰੀਏ…" — pa.wikipedia, ਡੀਪਫੇਕ

…and the machine-learning article leads with the transliteration:

> "ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਇੱਕ ਕਿਸਮ ਦੀ ਬਣਾਵਟੀ ਬੌਧਿਕਤਾ (ਆਰਟੀਫਿਸ਼ਲ ਇੰਟੈਲੀਜੈਂਸ) ਹੈ…" — pa.wikipedia, ਮਸ਼ੀਨ ਲਰਨਿੰਗ

### 6.2 Terminology policy `[craft — a recommendation built on the sourced pattern above]`

1. **Prefer the transliterated English term as the primary label** for technical concepts — that is
   what the attested Punjabi corpus does, and what a Punjabi reader searching the web will meet.
2. **Gloss it once, on first use in a page, with a Punjabi coinage in parentheses** — the exact
   convention the corpus uses.
3. **Pick one variant per concept and freeze it in the project glossary.** With seven attested names
   for "AI", *any* choice is defensible and *no* choice is self-evident — but **inconsistency across
   the platform is indefensible**, and §2 establishes there is no spelling standard to appeal to.
4. **Where nothing is attested (most of the field), coin transparently:** transliterate the English
   and add a plain Punjabi explanation in body text, rather than inventing a scholarly compound
   nobody will recognize.

**The sandwich, instantiated** (the C3 first-mention pattern from
[translation-quality](../translation-quality.md)): on first mention give **target term + original +
one short plain clause**, then the target term alone thereafter. In Punjabi this coincides with the
attested corpus convention:

> **ਮਸ਼ੀਨ ਲਰਨਿੰਗ (ਮਸ਼ੀਨੀ ਸਿਖਲਾਈ)** — transliterated headword, Punjabi gloss in parentheses, then a
> one-sentence plain explanation. Thereafter **ਮਸ਼ੀਨ ਲਰਨਿੰਗ** alone. *(The paired gloss is the sourced
> corpus pattern; the explanatory clause is authored per the sandwich format.)*

Project coinages (C1) keep their original spelling in Punjabi text and are owned by the term-sheet,
not this table.

### 6.3 Seed field vocabulary — 20 attested terms, tier-labeled

**Tier key:** `T1` = standards/official body · `T2-enc` = Punjabi Wikipedia article title or Wikidata
`pa` label (encyclopedic, community-maintained, but a **real Punjabi-language attestation**) ·
`T2-txt` = appears in running Punjabi Wikipedia article text · ⚠ = **no Punjabi attestation found —
do not present as established.** **No `T1` row exists in this table** — the Language Department's
ਆਨਲਾਈਨ ਸ਼ਬਦਾਵਲੀ terminology database was listed on the department site but its deep link could not be
located, and it remains the strongest outstanding fallback candidate.

| # | English | Punjabi (Gurmukhi) | Tier | Provenance |
|---:|---|---|---|---|
| 1 | artificial intelligence | **ਬਣਾਵਟੀ ਬੁੱਧੀ** (article title); variants **ਮਸਨੂਈ ਬੁੱਧੀ**, **ਮਸ਼ੀਨੀ ਬੁੱਧੀ**, **ਬਣਾਉਟੀ ਬੁੱਧੀ**, **ਕ੍ਰਿਤਮ ਬੁੱਧੀ**, **ਆਰਟੀਫਿਸ਼ਲ ਇੰਟੈਲਿਜੈਂਸ**; abbrev. **ਏਆਈ** | T2-enc | pawiki title; Wikidata `pa` label **ਬਣਾਉਟੀ ਮਸ਼ੀਨੀ ਬੁੱਧੀ** (Q11660) |
| 2 | machine learning | **ਮਸ਼ੀਨ ਲਰਨਿੰਗ** | T2-enc | pawiki article title **and** Wikidata `pa` label |
| 3 | algorithm | **ਕਲਨ ਵਿਧੀ** (title) / **ਐਲਗੋਰਿਦਮ** (Wikidata label; also the form used in the ML article) | T2-enc | Q8366 — **note the split**: coinage as headword, transliteration in prose |
| 4 | data | **ਡਾਟਾ** (title & label) / **ਡੇਟਾ** (article text: "ਡੇਟਾ ਦੇ ਆਧਾਰ ਤੇ") | T2-enc + T2-txt | Q42848 — ⚠ **spelling unsettled** |
| 5 | computer | **ਕੰਪਿਉਟਰ** (title & label) / **ਕੰਪਿਊਟਰ** (article text) | T2-enc + T2-txt | Q68 — ⚠ **spelling unsettled** (ਿਉ vs ਿਊ) |
| 6 | software | **ਸਾਫ਼ਟਵੇਅਰ** | T2-enc | Q7397 |
| 7 | robot / robotics | **ਰੋਬੋਟ** / **ਰੋਬੋਟਿਕਸ** | T2-enc + T2-txt | Q11012; article text "ਰੋਬੋਟਿਕਸ ਲਈ ਸਮਰਥਨ" |
| 8 | computer vision | **ਕੰਪਿਉਟਰ ਵਿਜ਼ਨ** | T2-enc + T2-txt | Q844240; article text "ਕੰਪਿਊਟਰ ਵਿਜ਼ਨ ਵਿਖੇ…" |
| 9 | data science | **ਡਾਟਾ ਸਾਇੰਸ** (title) / **ਡਾਟਾ ਵਿਗਿਆਨ** (label) | T2-enc | Q2374463 |
| 10 | natural language processing | **ਨੈਚਰਲ ਲੈਂਗੁਏਜ ਪ੍ਰੋਸੈਸਿੰਗ** | T2-txt | Running text of the AI article — full transliteration |
| 11 | neural network | **ਨਿਊਰਲ ਨੈਟਵਰਕ** — attested **only inside** "ਕਨਵੋਲਿਊਸ਼ਨਲ ਨਿਊਰਲ ਨੈਟਵਰਕ" | T2-txt (weak) | Article text only. **No pawiki article and no Wikidata `pa` label** (Q192776) |
| 12 | model | **ਮਾਡਲ** | T2-txt | Article text: "ਮਾਡਲ ਲਰਨਿੰਗ" |
| 13 | training / pre-training | **ਪ੍ਰੀਟ੍ਰੇਨਿੰਗ** | T2-txt (weak) | Article text: "ਪ੍ਰੀਟ੍ਰੇਨਿੰਗ ਦੌਰਾਨ". Standalone "training" **not** clearly attested; ⚠ candidate **ਸਿਖਲਾਈ** (everyday word for training/instruction, used in the ML lead) |
| 14 | automation | **ਆਟੋਮੇਸ਼ਨ** | T2-txt | Article text |
| 15 | deepfake | **ਡੀਪਫੇਕ** | T2-enc | Dedicated pawiki article |
| 16 | internet | **ਇੰਟਰਨੈਟ** | T2-enc | Q75 |
| 17 | computer network | **ਕੰਪਿਊਟਰੀ ਜਾਲ** (title) / **ਕੰਪਿਊਟਰ ਨੈਟਵਰਕ** (label) | T2-enc | Q1301371 — coinage vs transliteration split again |
| 18 | information technology | **ਸੂਚਨਾ ਤਕਨਾਲੋਜੀ** (title) / **ਸੰਚਾਰ ਤਕਨੀਕੀ** (label) | T2-enc | Q11661 |
| 19 | code | **ਕੋਡ** | T2-enc | Q188889 |
| 20 | CPU | **ਸੈਂਟਰਲ ਪ੍ਰੋਸੈਸਿੰਗ ਯੂਨਿਟ** | T2-enc | Q5300 |

*(Wikidata labels were retrieved in one batch call with `languages=pa&sitefilter=pawiki`; Q-ids are
given so every row is independently checkable.)*

### 6.4 ⚠ The MISSING list — terms with **no** verifiable Punjabi attestation

Checked against **both** Wikidata `pa` labels and Punjabi Wikipedia sitelinks; nothing found:

| English | Status |
|---|---|
| **deep learning** | ⚠ **MISSING** — no `pa` label, no pawiki article (Q197536) |
| **artificial neural network** (as a headword) | ⚠ **MISSING** — no `pa` label, no pawiki article (Q192776) |
| **computer science** | ⚠ **MISSING** — no `pa` label, no pawiki article (Q21198). *A striking gap.* |
| training data · dataset · model training | ⚠ no attestation found |
| supervised / unsupervised learning | ⚠ no attestation found |
| large language model · token · prompt · inference | ⚠ no attestation found |
| overfitting · generalization · feature · label (ML sense) | ⚠ no attestation found |
| algorithmic bias · hallucination (AI sense) | ⚠ no attestation found |
| chatbot · recommendation system · classifier | ⚠ no attestation found |

**Do not invent Punjabi headwords for these and present them as standard.** The honest and useful move
for an educational platform is: **keep the English term in Gurmukhi transliteration, define it in plain
Punjabi on first use, and mark the glossary entry as a platform coinage.** That is exactly what the
attested corpus does for the terms it *does* have, and it is transparent to the reader.

Sources (encyclopedic-tier; **media tier missing — `bbc.com/punjabi` host-blocked**):
<https://pa.wikipedia.org/> · <https://www.wikidata.org/> (Q-ids listed per row) ·
<https://bhashavibhagpunjab.org/> (ਆਨਲਾਈਨ ਸ਼ਬਦਾਵਲੀ — deep link not located, outstanding T1 candidate)

---

## 7. Idiom anti-patterns

⚠ **This entire section is `[craft]` — unsourced.** Every Punjabi rendering below is the researcher's
own **proposal**, based on the grammar and register findings in §4. **None is quoted from a source, no
idiom dictionary was consulted, and no row has been confirmed by a native speaker.** Treat the whole
table as a starting point for a native reviewer, not as findings.

**The one column that *is* reliable is the calque column:** those are the constructions a word-for-word
pipeline will actually produce, and they are wrong on structural grounds already established in §4.

| # | English stock phrase | Idiomatic Punjabi ✅ `[craft]` | Literal calque ❌ | Why the calque fails | Provenance |
|---:|---|---|---|---|---|
| 1 | Let's dive in / Let's get started | **ਆਓ, ਸ਼ੁਰੂ ਕਰੀਏ** | ਆਓ ਅੰਦਰ ਗੋਤਾ ਲਾਈਏ | "Dive in" is not a Punjabi metaphor for beginning; the calque reads as literal swimming | `[craft]` |
| 2 | Under the hood | **ਅੰਦਰੂਨੀ ਤੌਰ 'ਤੇ ਕੀ ਹੁੰਦਾ ਹੈ** | ਬੋਨਟ ਦੇ ਹੇਠਾਂ | Car-engine metaphor doesn't carry; state the meaning plainly | `[craft]` |
| 3 | Rule of thumb | **ਆਮ ਨਿਯਮ** | ਅੰਗੂਠੇ ਦਾ ਨਿਯਮ | Body-part idiom is opaque and slightly absurd in Punjabi | `[craft]` |
| 4 | Keep in mind / Note that | **ਧਿਆਨ ਰੱਖੋ** | ਦਿਮਾਗ਼ ਵਿੱਚ ਰੱਖੋ | "Hold in the brain" is not idiomatic; ਧਿਆਨ ਰੱਖੋ is the natural imperative — **and note it is the ਤੁਸੀਂ form** | `[craft]` |
| 5 | Step by step | **ਕਦਮ-ਦਰ-ਕਦਮ** | ਕਦਮ ਨਾਲ ਕਦਮ | The `-ਦਰ-` linker is the idiomatic distributive; ਨਾਲ ("with") means something else entirely | `[craft]` |
| 6 | In a nutshell / In short | **ਸੰਖੇਪ ਵਿੱਚ** (formal) / **ਥੋੜ੍ਹੇ ਸ਼ਬਦਾਂ ਵਿੱਚ** (easy) | ਇੱਕ ਅਖਰੋਟ ਦੇ ਛਿਲਕੇ ਵਿੱਚ | Walnut-shell image is meaningless | `[craft]` |
| 7 | Try it yourself | **ਖ਼ੁਦ ਅਜ਼ਮਾ ਕੇ ਵੇਖੋ** | ਇਸਨੂੰ ਆਪਣੇ ਆਪ ਕੋਸ਼ਿਸ਼ ਕਰੋ | The calque mis-places the reflexive and loses the "and see" Punjabi wants; also **SOV — the verb must land last** | `[craft]` |
| 8 | You'll learn how to… | **ਤੁਸੀਂ ਸਿੱਖੋਗੇ ਕਿ …ਕਿਵੇਂ ਕਰਨਾ ਹੈ** | ਤੂੰ ਸਿੱਖੇਂਗਾ ਕਿਵੇਂ ਨੂੰ… | **Two failures**: wrong register (ਤੂੰ), and English clause order — "how" cannot lead the subordinate clause | `[craft]` |
| 9 | The takeaway is… | **ਮੁੱਖ ਗੱਲ ਇਹ ਹੈ ਕਿ…** | ਲੈ ਜਾਣ ਵਾਲੀ ਚੀਜ਼ | "Takeaway" as a noun has no Punjabi equivalent; the calque suggests food to go | `[craft]` |
| 10 | Common pitfall / Watch out for | **ਆਮ ਗ਼ਲਤੀ** / **ਇਸ ਤੋਂ ਬਚੋ** | ਆਮ ਟੋਆ | "Pit" is literal — a hole in the ground | `[craft]` |
| 11 | Roughly speaking / More or less | **ਲਗਭਗ** / **ਮੋਟੇ ਤੌਰ 'ਤੇ** | ਸਖ਼ਤ ਬੋਲਦਿਆਂ | *Rough* becomes "harsh" in the calque; the phrase collapses | `[craft]` |
| 12 | Hands-on (exercise) | **ਅਭਿਆਸ** / **ਖ਼ੁਦ ਕਰ ਕੇ ਸਿੱਖਣਾ** | ਹੱਥਾਂ-ਉੱਤੇ | Literal body-part compound; means nothing | `[craft]` |
| 13 | It depends | **ਇਹ ਹਾਲਾਤ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ** | ਇਹ ਨਿਰਭਰ ਕਰਦਾ ਹੈ | Punjabi ਨਿਰਭਰ ਕਰਨਾ needs its complement — a bare "it depends" is incomplete | `[craft]` |

**Cross-cutting craft rules extracted from the table:**

- **Assume every English metaphor drawn from cars, food, sport, or body parts is dead on arrival** and
  replace it with a plain statement of meaning.
- **Every imperative must be in the ਤੁਸੀਂ form** (§4): `ਵੇਖੋ`, `ਬਚੋ`, `ਰੱਖੋ`, `ਕਰੋ` — never `ਵੇਖ`, `ਬਚ`,
  `ਰੱਖ`, `ਕਰ`.
- **The verb lands last.** Any rendering where the Punjabi verb sits mid-sentence is almost certainly
  calqued.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: **none — this section is entirely `[craft]`.** It rests on the grammar and register findings
in §4 (Wikipedia — Punjabi grammar) and on nothing else. A native reviewer must confirm or replace
every row before any of it is used in production copy.

---

## 8. Simplified-language pendant (`pa-easy`)

### 8a. ❌ No codified Punjabi plain-language standard was located

**The strength of a negative matters, so it is stated per body rather than in one sentence.**

| Checked | Why it would hold the standard | Result |
|---|---|---|
| The **plain-language survey** of national laws and standards | it enumerates the jurisdictions that legislate or standardize plain language — the United States, Canada, the United Kingdom, France, Germany, Israel, the European Union, plus **ISO 24495-1:2023** | ❌ asked directly, the fetch returned **“Punjabi: Does not appear. India: Does not appear.”** |
| The **easy-read survey** | it lists the languages in which easy-read guidance exists | ❌ it carries **eleven language editions** — Catalan, Czech, Spanish, Basque, Finnish, French, Galician, Korean, Portuguese, Russian, Swedish — and **Punjabi, Hindi, and India appear nowhere in it** |
| **ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ** (Language Department Punjab) | it is the state language authority and the publisher of the **ਪੰਜਾਬੀ ਵਿਸ਼ਵਕੋਸ਼** used as a cross-check in §8c | ❌ its own site lists **ਪੰਜਾਬੀ ਵਿਸ਼ਵਕੋਸ਼**, **ਪੰਜਾਬ ਕੋਸ਼**, **ਆਨਲਾਈਨ ਸ਼ਬਦਾਵਲੀ**, **ਆਨਲਾਈਨ ਕੋਸ਼**, **ਈ-ਪੁਸਤਕ**, **ਈ-ਰਸਾਲੇ**, **ਆਡੀਓ ਪੁਸਤਕਾਂ** and **ਦੁਰਲੱਭ ਹੱਥਲਿਖਤਾਂ**. **No plain-language, easy-read, or readability guideline appears among them** |
| **Punjabi University, Patiala** — Research Centre for Technical Development of Punjabi Language, Literature and Culture | it is the language-technology and pedagogy center; a readability rule set would live here if anywhere | ❌ what it publishes is *A Start in Punjabi*, *A Reference Grammar of Punjabi*, a Gurmukhi–Shahmukhi dictionary, a POS tagger, a morphological analyzer, a grammar checker, a spell checker, and transliteration systems. **Teaching and tooling — no simplified-register specification** |
| The **Punjabi Wikimedia ecosystem** | a simplified edition is the mechanism a language community uses when it wants one, and it exists for English | ❌ the two Punjabi editions are `pa.wikipedia.org` and `pnb.wikipedia.org`; **both are standard-register and there is no simplified Punjabi edition** |
| **GIGW** — Guidelines for Indian Government Websites and Apps (NIC, STQC, CERT-In) | it is India's national web-content guideline | ⚠ the Introduction page reached carries **no** plain-language, readability, or reading-level rule, and the guideline PDF 404'd at the URL tried. **Not established either way** |
| Punjabi **disability, health-literacy, and diaspora public-sector** publishers | UK and Canadian public bodies translate for Punjabi-speaking communities and are the likeliest home of an easy-read house style | ⚠ **not swept.** A search-solvable gap, not a real-world absence |

**➜ Stated at the strength the evidence supports.** ❌ **There is no external rule set to point a
Punjabi translator at** — not from the state language authority, not from the university that builds
Punjabi language technology, not from the language community's own publishing. ⚠ Two rows stay open,
and neither changes the consequence: **`pa-easy` must be defined inside this guide, concretely enough
to be reviewable.** Do not upgrade this to “Punjabi has no plain-language tradition”.

### 8b. The axis — Sanskritic vs Perso-Arabic, offered as a hypothesis

**The stratum story is sourced and it is genuinely three-layered, which is why the instinct built on
it goes wrong.**

> **“Being an Indo-Aryan language, the core vocabulary of Punjabi consists of tadbhav words inherited
> from Sanskrit.”**
> **“It contains many loanwords from Persian and Arabic.”**
> **“many Persian words have been incorporated into Punjabi (such as zamīn, śahir etc.) and are used
> with a liberal approach. Through Persian, Punjabi also absorbed many Arabic-derived words like
> dukān, ġazal and more, as well as Turkic words.”**
> — en.wikipedia, *Punjabi language* (community tier)

And the sentence the whole of §8 turns on:

> **“In more formal contexts, hypercorrect Sanskritized versions of these words may be used”**
> — same article

**That is the axis, and note its shape.** The everyday layer is *tadbhav* — inherited, changed
Sanskrit — with a heavy Perso-Arabic overlay; the formal layer is *tatsama*, Sanskrit re-imported
unchanged, and the source calls the formal move **hypercorrect**. The Punjabi-language encyclopedia
states the same descent and the same borrowing without ranking the layers:

> “ਹੋਰ ਉੱਤਰੀ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਾਂਗ ਇਸ ਦਾ ਵੀ ਵਿਕਾਸ ਵੈਦਿਕ ਸੰਸਕ੍ਰਿਤ ਤੋਂ ਹੋਇਆ ਹੈ”
> “ਨਵੀਂ ਪੰਜਾਬੀ ਸ਼ਬਦਾਵਲੀ ਹੋਰ ਭਾਸ਼ਾਵਾਂ, ਜਿਵੇਂ ਹਿੰਦੀ, ਫ਼ਾਰਸੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਤੋਂ ਪ੍ਰਭਾਵਿਤ ਹੈ”
> — pa.wikipedia, ਪੰਜਾਬੀ ਭਾਸ਼ਾ (community tier)

⚠ **Nothing in either source says the Perso-Arabic word is the *easier* one.** “Formal contexts use
Sanskritized forms” licenses exactly one inference — that ਤਤਸਮ marks formality — and says nothing
about which member of a doublet a reader is likelier to know. **The previous edition of this guide
asserted that the Perso-Arabic column is “generally the more colloquial layer”. That was craft, it
was unsourced, and §8c tests it.**

**A second axis needs no new evidence and is already established in §4:** Punjabi is **SOV**, so the
verb arrives last and every modifier is carried to the end of the clause. Sentence length costs more
in Punjabi than in English for structural reasons, not stylistic ones.

### 8c. Measuring the axis — re-measured at three to nine times the size, and it changed the answers

**The design, and its one compromise.** Punjabi University, Patiala publishes a children's
encyclopedia, the **ਬਾਲ ਵਿਸ਼ਵਕੋਸ਼**, and — through the same Publication Bureau — a set of adult subject
encyclopedias. That is the single-publisher pair the method asks for. A second adult corpus is kept
alongside it: the general adult encyclopedias of **ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ** — same genre, same delivery
platform, **different publisher.** Both comparisons are reported; where they disagree, the guide
says so, and after the re-measurement they disagree more often than they used to.

**This section was rebuilt on 2026-07-29.** The first pass ran out of crawl budget and its
publisher-matched side — the one that holds house style constant — was **6,673 tokens**, too small
to carry anything. It is now **58,602**. Every number below is from the new corpora; where a first-pass
figure is quoted it is labeled as such, and **several of them did not survive.**

| Corpus | What it is | Publisher | Size now | Size in the first pass |
|---|---|---|---|---|
| **Children's** | **ਬਾਲ ਵਿਸ਼ਵਕੋਸ਼**, the ਭਾਸ਼ਾ, ਸਾਹਿਤ ਅਤੇ ਸੱਭਿਆਚਾਰ and ਸਮਾਜਿਕ ਵਿਗਿਆਨ volumes | ਪਬਲੀਕੇਸ਼ਨ ਬਿਊਰੋ, ਪੰਜਾਬੀ ਯੂਨੀਵਰਸਿਟੀ, ਪਟਿਆਲਾ | **74 entries, 57,565 tokens** | 24 entries, 20,603 |
| **Adult (publisher-matched)** | the Bureau's **ਸਹਿਤ ਕੋਸ਼**, **ਕਾਨੂੰਨੀ ਵਿਸ਼ਾ ਕੋਸ਼**, **ਪੰਜਾਬੀ ਵਿਆਕਰਨ … ਵਿਸ਼ਾ-ਕੋਸ਼**, **ਸਿੱਖ ਧਰਮ ਵਿਸ਼ਵਕੋਸ਼**, **ਜੁਗਰਾਫ਼ੀਏ ਦਾ ਵਿਸ਼ਾ-ਕੋਸ਼** and others | same as the children's volumes | **148 entries, 58,602 tokens** | 42 entries, **6,673** |
| **Adult (genre-matched)** | **ਪੰਜਾਬੀ ਵਿਸ਼ਵ ਕੋਸ਼**, **ਪੰਜਾਬ ਕੋਸ਼**, **ਮਹਾਨ ਕੋਸ਼** | ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ | **251 entries, 85,812 tokens** | 27 entries, 24,400 |
| **Cross-check** | `insource:` **page** counts on the Punjabi encyclopedia — a volunteer corpus, a different contributor base, and **page counts, not token frequencies** | — | tens of thousands of articles (unchanged) | — |

All three corpora come from the university's aggregation platform, whose `robots.txt` states no
restriction of any kind. It has **no sitemap and its autocomplete endpoint returns nothing**, so the
only enumeration is the link graph: entries link roughly fifty further headwords each. The corpus is
therefore a **breadth-first crawl from five seed headwords**, normalized to NFC and tokenized on
letter-plus-combining-mark runs; only tokens containing a Gurmukhi letter were counted. Frequencies
are **per 100,000 Gurmukhi word tokens**. Counted with
[`scripts/corpus-measure.mjs`](../../scripts/corpus-measure.mjs).

> 🔴 **Read these caveats before using any number below. Three of the five have been reduced by the
> re-measurement; two have not, and one is new.**
>
> 1. **One occurrence is now 1.7 per 100k** in the children's and publisher-matched corpora and 1.2
>    in the genre-matched one — against 4.9 and 4.1 in the first pass. Rows resting on fewer than
>    ~10 raw tokens are still marked or dropped, but the floor is three times lower.
> 2. **Topic is STILL NOT controlled, and this is the binding limitation.** The children's volumes
>    are about language, literature, culture, and social science; the adult sides are whatever the
>    crawl reached. Content words remain unusable as evidence.
> 3. **🆕 A breadth-first crawl is topic-clustered, not a random sample.** It walks outward from its
>    seeds through the entries those entries link, so neighboring headwords are over-represented.
>    Growing the corpus did **not** make it a random sample of Punjabi encyclopedia writing, and no
>    row below may be read as though it were.
> 4. **A children's encyclopedia is not a plain-language text.** It is written by adult specialists
>    for schoolchildren. No plain-language corpus of Punjabi exists (§8a).
> 5. **Frequency is not comprehension.** No Punjabi readability or comprehension study was located.

#### 8c-i. Sentence architecture — the first pass's result replicates, and now it can be explained

| | Children's | Adult (publisher-matched) | Adult (genre-matched) |
|---|---|---|---|
| sentences measured | 3,183 | 3,019 | 6,114 |
| **mean words per sentence** | **18.09** | **19.41** | **14.04** |
| median | 16 | 16 | 12 |
| sentences ≤ 15 words | 49.8 % | 46.8 % | 65.4 % |
| type/token ratio | 0.139 | 0.160 | 0.158 |
| first pass, mean | 18.1 | 20.1 | 15.3 |

**🔴 The result replicates almost exactly at three to nine times the size — and read against the
publisher column it is no longer a puzzle.** Within **one publisher**, the children's encyclopedia
and the adult subject encyclopedias sit **1.3 words apart** (18.09 against 19.41), with the same
median and nearly the same share of short sentences. The corpus that is genuinely different is the
**other publisher's** (14.04, median 12). **So the "children's text has longer sentences than adult
text" finding is a difference between publishing houses, not between registers** — the first pass
suspected genre and could not test it; the publisher-matched corpus was too small. It is now nine
times larger and it answers the question.

**What follows, and it is the same conclusion by a better route.** This corpus still **cannot
deliver a Punjabi sentence-length norm** — but the reason is now known rather than suspected. A
children's encyclopedia in this house is written at **adult sentence length**; the house simply does
not shorten sentences for children. `pa-easy` therefore keeps the kit's base one-idea-per-sentence
rule and its ≤ 12-word working target, **explicitly the kit's figure and not a Punjabi one**, and it
is departing from Punjabi publishing practice by a wide margin: **half of even the children's
edition's sentences run past 15 words.**

#### 8c-ii. Formal → everyday, after the re-measurement

**Two pairs are reported for every row**: **P** = children's against the **same publisher's** adult
encyclopedias (register-ish, house style held constant) and **G** = children's against the **other
publisher's** (genre-matched, publisher varies). **A row is only safe where both agree.**

| Formal | Everyday | P — same publisher | G — other publisher | Verdict now |
|---|---|---|---|---|
| **ਆਰੰਭ ਕਰਨਾ** | **ਸ਼ੁਰੂ ਕਰਨਾ** | ਆਰੰਭ 1.7 / 35.8 · ਸ਼ੁਰੂ 46.9 / 17.1 → **holds** | ਸ਼ੁਰੂ 46.9 / 46.6 → **flat** | ✅ **keep, on the controlled pair.** The formal word is nearly absent from the children's text and 21× denser in the same house's adult writing. G is flat because the other publisher uses ਸ਼ੁਰੂ just as freely — which is a fact about that house, not about difficulty |
| **ਪ੍ਰਯੋਗ ਕਰਨਾ** | **ਵਰਤੋਂ / ਵਰਤਣਾ** | ਪ੍ਰਯੋਗ 15.6 / 23.9 · ਵਰਤੋਂ 198 / 100.7 → **holds** | ਵਰਤੋਂ 198 / 44.3 → **holds** | ✅ **the strongest row in the section — the only one that holds in both pairs.** Use it |
| **ਅਧਿਕ** | **ਜ਼ਿਆਦਾ / ਵੱਧ** | ਅਧਿਕ 1.7 / 10.2 · ਜ਼ਿਆਦਾ 40 / 22.2 → **holds** | thin | ✅ keep on P; ⚠ G cannot see ਅਧਿਕ at all |
| **ਸਹਾਇਤਾ** | **ਮਦਦ** | ਸਹਾਇਤਾ 8.7 / 15.4 · ਮਦਦ 8.7 / 3.4 → **holds** | **flat** | ⚠ **upgraded from "direction only" to holds on P**, but G flattens it. Keep as a hint |
| ~~**ਕਾਰਜ** → **ਕੰਮ**~~ | | ਕਾਰਜ 165 / 39.2 · ਕੰਮ 76.4 / **129.7** → **REVERSED** | **flat** | 🔴 **withdrawn.** The first pass read this as a clean crossover on 32 and 26 tokens. At scale the everyday word **ਕੰਮ is commoner in the ADULT text**, and ਕਾਰਜ is 4× denser in the children's one. See §8d |
| ~~**ਪ੍ਰਸ਼ਨ** → **ਸਵਾਲ**~~ | | ਪ੍ਰਸ਼ਨ 13.9 / 10.2 · ਸਵਾਲ 6.9 / **15.4** → **REVERSED** | partial | 🔴 **withdrawn.** It survived the first pass on the wiki cross-check alone, with three tokens between the corpora. With tokens on both sides it runs the other way |
| ~~**ਅਤਿਅੰਤ** → **ਬਹੁਤ**~~ | | **thin** in both | **thin** | 🔴 **dropped.** ਅਤਿਅੰਤ occurs once in each corpus. Nine times the text did not make it measurable, which is itself the answer: it is not a word these publications use |

### 8d. 🔴 The do-NOT-simplify list — where the evidence contradicts the instinct

**The general claim the first edition of this guide made — that the Perso-Arabic column is the more
colloquial and therefore easier layer — still does not survive contact with the corpora. But the
re-measurement took down three of the rows that were used to argue it, and the flagship reversal is
one of them.** A row that changes under a bigger sample was never a finding; it was a small number.

| Do **not** do this | Why — with the numbers |
|---|---|
| ~~🆕 **read ਵਿੱਚ / ਵਿਚ or ਇੱਕ / ਇਕ as a register difference**~~ | **The largest signal in the whole comparison is orthographic, not lexical, and a keyness list will hand it to you as vocabulary.** ਵਿੱਚ runs **3,031 per 100k in the children's volumes against 80** in the same publisher's adult ones; ਵਿਚ runs **3.5 against 2,510**. Same word, two house spellings — likewise ਇੱਕ/ਇਕ and ਇਹਨਾਂ/ਇਨ੍ਹਾਂ. **These four pairs alone dominate the top of the keyness table.** They say nothing about difficulty, they must never enter a substitution list, and they are a standing warning that the two sides of this pair differ in **spelling policy** before they differ in anything else |
| ~~**ਕਾਰਜ** → **ਕੰਮ**~~ | 🔴 **A first-pass row, now reversed.** The everyday ਕੰਮ is **1.7× denser in the ADULT text** (129.7 against 76.4), while the formal ਕਾਰਜ is **4.2× denser in the children's** (165 against 39.2). Flat in the genre-matched pair. The first pass called it a clean crossover on 32 and 26 raw tokens; the direction did not survive |
| ~~**ਪ੍ਰਸ਼ਨ** → **ਸਵਾਲ**~~ | 🔴 **A first-pass row, now reversed.** ਸਵਾਲ is **2.2× denser in the adult text** (15.4 against 6.9). It had rested on a wiki page-count ratio with three corpus tokens behind it |
| ~~**ਪਰੰਤੂ** → **ਪਰ**, and the reasoning that came with it~~ | 🔴 **The first edition's flagship reversal is withdrawn.** It claimed ਪਰੰਤੂ was **8.9× commoner in the children's encyclopedia** on 15 tokens. At three times the size the pair is **flat: no register signal** — 62.5 against 52.9, with ਪਰ at 307.5 against 262.8, and flat in the genre-matched pair too. **The swap is not a reversal and it is not a fix either**; ਪਰੰਤੂ is simply not a register marker in these corpora. The recommendation that replaced it stands on its own grounds: **prefer a period to a connective** (§8f) |
| ~~**ਜਲ** → **ਪਾਣੀ** as a reversal~~ | 🔴 **Also withdrawn, and it inverts twice.** The first pass reported the children's text writing ਜਲ : ਪਾਣੀ at **1.9 : 1** on 28 and 15 tokens. At scale the children's text writes **ਪਾਣੀ 53.9 against ਜਲ 3.5 — 15 : 1 the other way**, and the pair reads *partial* on P and **REVERSED on G** because the other publisher uses ਜਲ ten times more (35.0). **Nothing here is a fact about difficulty; it is a fact about who is writing** |
| ~~**ਸ਼ਬਦ** → **ਲਫ਼ਜ਼**~~ | ✅ **Survives, and hardens.** The Perso-Arabic "everyday" word is **nearly unattested**: ਲਫ਼ਜ਼ 6.9 against 3.4 (P) and 1.2 (G), against ਸ਼ਬਦ at 493. Swapping trades a word every reader meets for one they may never have seen in print |
| ~~**ਸਥਾਨ** → **ਜਗ੍ਹਾ**~~ | ✅ **Survives in both pairs.** ਜਗ੍ਹਾ is rarer in the children's text than in either adult corpus (1.7 against 5.1 and 4.7) while ਸਥਾਨ is 3–7× denser there. **REVERSED** on both |
| ~~**ਪ੍ਰਭਾਵ** → **ਅਸਰ**~~ | ✅ **Survives in both pairs, and G sharpens it**: ਅਸਰ 3.5 in the children's text against 15.4 (P) and **46.6** (G). The Perso-Arabic word is the adult register's |
| ~~**ਵਿਸ਼ੇਸ਼** → **ਖ਼ਾਸ**~~ | ⚠ **REVERSED on P** (ਖ਼ਾਸ 38.2 against 51.2) and **flat on G**. Keep the warning; drop the confidence |
| ~~**ਪੁਸਤਕ** → **ਕਿਤਾਬ**~~ | 🔴 **Now the opposite of what the first pass reported.** It said "no register signal exists" and that ਪੁਸਤਕ led ਕਿਤਾਬ 2 : 1 inside the children's text. At scale the children's text writes **ਕਿਤਾਬ 60.8 against ਪੁਸਤਕ 33.0**, while ਕਿਤਾਬ is **absent from the same publisher's adult writing** (0.0) and near-absent from the other's (1.2). The swap now runs **the intuitive way**, which is exactly why it must be re-checked and not simply believed: it is the third row in this table to move under a bigger sample |
| ~~**ਦਰਖ਼ਤ** → or from **ਰੁੱਖ**~~ | **thin on P** (both words at 1.7); **REVERSED on G**, where the native ਰੁੱਖ is the *adult* corpus's word (8.2 against 1.7). The first pass's 10× wiki ratio is not visible in running text either way |
| ~~**ਸਮਾਪਤ** → **ਖ਼ਤਮ**, **ਪ੍ਰਾਪਤ** → **ਲੈਣਾ**, **ਨਿਰਧਾਰਿਤ** → **ਤੈਅ**~~ | 🆕 **All three come back REVERSED in both pairs** — the "everyday" member is rarer in the children's text every time. The first edition dropped these rows as unmeasurable; the bigger corpus can see them, and what it sees is the opposite of the instinct |
| ~~reaching for **ਬਹੁਤ** to sound plainer~~ | Now **flat within the publisher** (126.8 against 116.0) and adult-favoring across publishers (237.7). The first pass's "1.8× denser in the adult corpus" was a cross-publisher effect |
| ~~simplify by etymology, in either direction~~ | **The section's standing rule, and the re-measurement strengthened it.** "Sanskritic is hard" fails (ਵਿਸ਼ੇਸ਼, ਪ੍ਰਭਾਵ, ਪ੍ਰਾਪਤ); "Perso-Arabic is everyday" fails just as hard (ਲਫ਼ਜ਼, ਅਸਰ, ਜਗ੍ਹਾ, ਖ਼ਤਮ, ਤੈਅ). Simplify by **structure** (§8f), and make a lexical swap only on the two rows of §8c-ii that hold in both pairs |
| ~~🆕 **trust a row that moved when the corpus grew**~~ | Five rows changed verdict between a 6,673-token publisher-matched corpus and a 58,602-token one, and **one of them was this section's flagship result**. Where a row rests on fewer than ~20 raw tokens, the honest reading is *not yet measured*, whatever direction the arithmetic points |

### 8e. 🔑 The address decision — `pa-easy` keeps ਤੁਸੀਂ

> **Decision, recorded so nobody “fixes” it: `pa-easy` addresses the reader as ਤੁਸੀਂ, exactly as `pa`
> does. It does not drop to ਤੂੰ.**

- ✅ `pa` and `pa-easy` alike: **ਤੁਸੀਂ**, with plural/polite agreement — **ਸ਼ੁਰੂ ਕਰੋ · ਜਾਰੀ ਰੱਖੋ · ਚੁਣੋ · ਵੇਖੋ**
- ❌ in either variant: **ਤੂੰ**, with singular agreement — **ਕਰ · ਰੱਖ · ਚੁਣ · ਵੇਖ**

**Why, and the second point is the mechanical one:**

1. **ਤੂੰ carries no comprehension benefit.** It is not shorter, commoner, or earlier-learned than
   ਤੁਸੀਂ; it is *less respectful*. **Informality is not simplicity**, and the condescension risk is
   **worse** in an easy-language context, not better — the `pa-easy` audience includes adults with
   low literacy, exactly the readers for whom being addressed as ਤੂੰ by an institution stings.
2. **The pronoun is not a token, it is a paradigm.** §4 records the reason in one line: the polite
   form **“is also grammatically plural”**, so the verb, the imperative, and every agreeing participle
   move with it. A reviewer who “simplifies” the pronoun has silently rewritten the agreement of
   every sentence it appears in — which is why the decision is made once, project-wide, and why
   §11's grep for **ਤੂੰ · ਤੇਰਾ · ਤੇਰੀ · ਤੈਨੂੰ** applies to `pa-easy` unchanged.
3. **The one reader-facing educational Punjabi corpus that was checked agrees.** §4 quotes the
   Punjabi encyclopedia addressing its readers as **“ਤੁਸੀਂ ਵੀ ਇਸ ਵਿਸ਼ਵਕੋਸ਼ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾ ਸਕਦੇ ਹੋ।”** —
   note **ਸਕਦੇ ਹੋ**, the plural/polite agreement following the pronoun.

⚠ **§8c's corpora cannot test this and do not pretend to.** They are encyclopedia entries, a genre
that does not address its reader at all, so the decision rests on §4's reasoning rather than on
measurement. **A native-reviewer ruling is worth more here than anywhere else in §8.**

**And one inversion in the same spirit:** `pa-easy` should use **more** explicit address than `pa`,
not less. Where the base variant leaves the subject implicit for flow, the easy variant says
**ਤੁਸੀਂ** outright. ⚠ Craft, derived from the kit's base rules — no Punjabi source attests it.

### 8f. What `pa-easy` is built on — in order of leverage

**1 — Sentence architecture. This is the main lever, and the only one with a structural argument
behind it rather than a lexical guess.**

- **One idea per sentence.** Punjabi's **SOV** order holds the verb until the end of the clause, so
  every added modifier is a modifier the reader carries. Length costs more here than in English.
- **Prefer finite verbs to nominalizations** — unwind the `-ਕਰਨ` / `-ਤਾ` abstract-noun pattern into a
  verb rather than swapping one noun for another.
- **Prefer active voice.**
- **Split, do not connect.** Where a formal Punjabi sentence uses **ਪਰੰਤੂ** or a chain of relatives,
  the easy variant takes two sentences. **This overrides nothing in
  [accessibility-workflow](../accessibility-workflow.md) — it instantiates the base one-idea rule for
  a head-final language.**
- **No idioms, no proverbs, no wordplay** — doubly prudent given that §7 carries no verified
  renderings.

**2 — Vocabulary, and only the rows that hold in both pairs.** Use §8c-ii's table, and note that the
2026-07-29 re-measurement left **two** rows standing (ਪ੍ਰਯੋਗ → ਵਰਤੋਂ in both pairs, ਆਰੰਭ → ਸ਼ੁਰੂ in the
controlled one) and withdrew three. **Do not extend it by ear**: §8d is the record of what happens
when the etymological instinct is allowed to pick rows — and now also of what happens when a row is
allowed to rest on fifteen tokens.

**3 — Presentation.** Western digits, always (§5.1); spell out a small number only where the count is
not the point.

**Term-preservation rule (binding, restated).** In `pa-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Concretely: **ਐਲਗੋਰਿਦਮ** plus a one-sentence explanation
beats **ਕਲਨ ਵਿਧੀ** with no explanation. This is distinct from §8c, which targets **non-technical**
formal vocabulary.

### 8g. What is still open

1. **The two ⚠ rows in §8a.** Does GIGW's full text carry a plain-language clause? Do UK/Canadian
   public bodies that publish Punjabi maintain an easy-read house style? Both are search-solvable
   and neither was swept. **Until they are, the negative stays “moderate, not conclusive”.**
2. **The corpora are encyclopedias, and the size problem is solved while the genre problem is not.**
   The 2026-07-29 re-crawl took the publisher-matched side from 6,673 to 58,602 tokens and **five
   rows changed verdict**, including this section's former flagship (§8d). What it could not change
   is the genre: these are still encyclopedia entries from two Patiala houses, and §8c-i now shows
   the sentence-length difference to be **a difference between houses rather than between
   registers**. **A newspaper and its children's supplement, or a graded PSEB textbook pair, is
   still the thing that would settle whether any of these rows is a Punjabi register fact** —
   neither was built here (the state board's site returned **HTTP 403**).
3. **🆕 The crawl is topic-clustered and enlarging it further will not fix that.** The platform has
   no sitemap and its autocomplete endpoint returns nothing, so enumeration is a breadth-first walk
   of the link graph from five seeds (§8c). More pages means more of the same neighborhood. A
   later pass that wants a *representative* Punjabi encyclopedia corpus needs a different
   enumeration, not a longer run of this one.
4. **🆕 Two rows now hold and two are withdrawn, and the withdrawals are the lesson.** ਪ੍ਰਯੋਗ → ਵਰਤੋਂ
   holds in both pairs; ਆਰੰਭ → ਸ਼ੁਰੂ holds in the controlled one. ਕਾਰਜ → ਕੰਮ and ਪ੍ਰਸ਼ਨ → ਸਵਾਲ reversed
   under the bigger sample, and ਪਰੰਤੂ → ਪਰ went flat. **Anything in this guide resting on fewer than
   about twenty raw tokens should be treated as not yet measured**, whatever direction it points.
3. **The Shahmukhi side is entirely unmeasured.** §9 explains why this guide covers Gurmukhi only;
   the consequence for §8 is that **no claim here should be assumed to hold for Punjabi in Pakistan**,
   where the Perso-Arabic layer's status is likely different.
4. **No comprehension evidence exists for Punjabi.** Every number in §8c is a frequency, and
   frequency is a proxy for familiarity, not for understanding.
5. **The address decision is unmeasured** (§8e). It is the single most valuable question to put to a
   native reviewer.
6. **Several rows the previous edition of this guide shipped as craft were never testable** — the
   corpora simply do not contain them often enough. They were **dropped rather than carried forward
   unmeasured**; if a bigger corpus is ever built, they are the first thing to re-check.

Sources: <https://en.wikipedia.org/wiki/Plain_language> · <https://en.wikipedia.org/wiki/Easy_read> ·
<https://en.wikipedia.org/wiki/Punjabi_language> (community tier — the vocabulary-stratum and
“hypercorrect Sanskritized” quotes) · <https://pa.wikipedia.org/wiki/ਪੰਜਾਬੀ_ਭਾਸ਼ਾ> (community tier) ·
<https://bhashavibhagpunjab.org/> (ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ — publication list checked, **no plain-language
guideline**) · <http://www.learnpunjabi.org/> (Punjabi University, Patiala — Research Centre for
Technical Development of Punjabi Language, Literature and Culture; resource list checked, **none
simplified-register**) · <https://pa.wikipedia.org/> and `pnb.wikipedia.org` (**no simplified Punjabi
edition**) · <https://guidelines.india.gov.in/introduction/> (GIGW issuing bodies; **no
plain-language rule on the page reached** — the guideline PDF 404'd) ·
**Children's corpus** — **74 entries (57,565 tokens)** of ਬਾਲ ਵਿਸ਼ਵਕੋਸ਼ (ਪਬਲੀਕੇਸ਼ਨ ਬਿਊਰੋ, ਪੰਜਾਬੀ
ਯੂਨੀਵਰਸਿਟੀ, ਪਟਿਆਲਾ) · **adult corpora** — **251 entries (85,812 tokens)** of ਪੰਜਾਬੀ ਵਿਸ਼ਵ ਕੋਸ਼ / ਪੰਜਾਬ
ਕੋਸ਼ / ਮਹਾਨ ਕੋਸ਼ (ਭਾਸ਼ਾ ਵਿਭਾਗ ਪੰਜਾਬ) and **148 entries (58,602 tokens)** of the Bureau's adult subject
encyclopedias, all via <https://punjabipedia.org/> (access policy states no restriction of any
kind; **no sitemap and a non-responding autocomplete endpoint**, so enumeration is a breadth-first
crawl of the link graph — topic-clustered by construction, §8c). Re-crawled and re-counted
2026-07-29, replacing a first pass whose publisher-matched side was 6,673 tokens; **five rows
changed verdict**, and the first-pass figures are quoted in §8c/§8d only where they are being
withdrawn ·
**Cross-check** — `insource:` page counts via
<https://pa.wikipedia.org/w/api.php?action=query&list=search&srsearch=insource:%22%E0%A8%B8%E0%A8%BC%E0%A8%AC%E0%A8%A6%22&srinfo=totalhits>
· [accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md) · [human-gate](../human-gate.md) —
**not reached:** Punjabi disability / health-literacy / diaspora public-sector publishers, the GIGW
guideline PDF, the Punjab School Education Board site (HTTP 403). The §8f rules and the §8e
inversion are `[craft]` and carry no source.

---

## 9. Regional variation

### 9.1 What this guide covers

**Punjabi in Gurmukhi script (`pa` / `pa-Guru-IN`), Indian standard**, based on the **Majhi** standard
variety: "The Majhi dialect, which is transitional between the two main varieties, has been adopted as
standard Punjabi in India and Pakistan for education and mass media." (Wikipedia — Punjabi language).
Convenient detail: the **spoken** standard is shared across the border even though the **written**
systems are not. LTR · Western digits · Indian 2,2,3 grouping · ₹.

### 9.2 What this guide explicitly does NOT cover — the fork table

**Shahmukhi Punjabi (`pa-Arab`, Pakistan) is out of scope**, stated as an explicit exclusion with the
reasons on the record:

| Axis | Gurmukhi (`pa-Guru`, India) — **covered** | Shahmukhi (`pa-Arab`, Pakistan) — **not covered** |
|---|---|---|
| Script | Indic abugida, "Unicode range U+0A00–U+0A7F" | "right-to-left abjad-based script", "identical to the Urdu alphabet, but contains additional letters" |
| Direction | "runs left to right in horizontal lines" (LTR) | Right-to-left — full mirrored layout |
| Native speakers | 31.1 M (2011 census) | **88.9 M (2023 census)** — the larger group |
| Digits in practice | Western 0–9 (CLDR `latn`; "modern text tends to use ASCII digits") | Eastern Arabic-Indic — the Shahmukhi Wikipedia's own article counter reads "۷۵,۶۳۵" |
| BCP 47 resolution | **`"pa": "pa-Guru-IN"`** | **`"pa-Arab": "pa-Arab-PK"`**, **`"pa-PK": "pa-Arab-PK"`** |
| Lexical register | Draws freely on Sanskritic coinage (ਕ੍ਰਿਤਮ, ਬੌਧਿਕਤਾ) alongside Perso-Arabic (ਮਸਨੂਈ) — all seven attested in one sentence (§6.1) | Perso-Arabic register dominant ⚠ *(inference from the script/Urdu relationship — no source quantifying the lexical divergence could be fetched)* |
| Official status | Official language of Punjab state; additional official language in Haryana and Delhi | ⚠ The fetched sources assert **demographic** dominance only and **do not assert official status**. This guide does **not** claim Punjabi lacks official status in Pakistan — only that the sources reached do not assert it. |
| Digital corpus | 59,632 Wikipedia articles | **75,635** Wikipedia articles — **larger** |

**Both are living digital languages, and the Shahmukhi Wikipedia is the bigger one.** This exclusion is
a scoping decision driven by standards resolution, layout direction, and institutional backing — **not**
by any claim that Shahmukhi is minor.

### 9.3 Within-Gurmukhi variation and the neutrality strategy

`⚠ Under-researched in this session.` Punjabi has substantial dialect variation on the Indian side
(Majhi, Malwai, Doabi, Puadhi), but the standard-variety quote in §9.1 establishes the only thing the
guide needs to fix: **Majhi is the education/media standard on both sides of the border.**

**Neutrality strategy, explicit:** translators write **standard written Majhi-based Punjabi**, not
their home dialect.

- ✅ Standard written Punjabi as used in education and media, held consistently across the platform.
- ❌ Home-dialect forms in default content; ❌ creating a `pa-CA` or `pa-GB` locale. **Diaspora Punjabi
  (Canada/UK) shows heavy English code-mixing, but that is a *register* question, not a locale split.**

### 9.4 If a Shahmukhi edition is ever wanted — the path, in order

1. **Ship it as a separate locale `pa-Arab`**, never as content inside `pa` (§1, CLDR resolution).
2. **Full RTL layout pass** — `dir="rtl"`, mirrored icons, mirrored progress bars, mirrored charts,
   bidi-safe string concatenation. This is where the kit's RTL/bidi toolbox becomes relevant; **none of
   it applies to `pa`.**
3. **Different digit and font stacks** (Eastern Arabic-Indic digits; Perso-Arabic font coverage).
4. **Seed the text with the university transliteration system (SANGAM, Gurmukhi ↔ Shahmukhi) as a
   first draft only**, then **full native review for register** — transliteration converts letters, not
   vocabulary choices, and §6.1/§8.3 show the register axis is precisely where the two sides diverge.

Sources: <https://en.wikipedia.org/wiki/Punjabi_language> · <https://en.wikipedia.org/wiki/Shahmukhi> ·
<https://r12a.github.io/scripts/guru/pa.html> · <https://pa.wikipedia.org/> · <https://pnb.wikipedia.org/> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/likelySubtags.json> · <https://sangam.learnpunjabi.org/>

---

