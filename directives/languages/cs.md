<!-- base -->
# lang-cs — Czech (čeština) — language guide

> **Setup & sources live in [`cs.setup.md`](cs.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** čeština / Czech.
**BCP 47 code (base):** `cs`.
**BCP 47 code (simplified variant):** `cs-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`cs-x-simple`), but the kit token `cs-easy` is the one
that counts here.
**Speaker reach:** ~**10–11 million** speakers, overwhelmingly in Czechia, where it is the sole
official language; it is also one of the official languages of the EU (⚠ approximate — this figure
is general-reference background, **not** carried by the source dossier, which opened without a
speaker-count paragraph; treat as editorial context, not a sourced claim).
**Script + direction:** Latin script with three diacritics — háček (ˇ), čárka (´), kroužek (˚);
**left-to-right**. The accented letters (č ř ž š ě ů …) live partly in Latin Extended-A
(U+0100–U+017F), which drives the one real typographic risk (font coverage, §3).
**Status:** planned — authored from an **agent-native research dossier** (self-fetched, one verbatim
quote per claim), which was **then independently reviewed against its cited sources**. **Re-fetch log:
one quotation in §3 (the ÚJČ adjacent double+single quotation-mark rule) is *not* in the dossier; it
was re-fetched from <https://prirucka.ujc.cas.cz/?id=162> on 2026-07-27 and confirmed verbatim by
codepoint — see the inline declaration there. Every other quotation in this guide traces to the
dossier; where an inner mark was normalized (the dossier ASCII-flattens some closing marks), that is
noted at point of use.** Covers base `cs` and the `cs-easy` pendant. The strong
sections (typography, authorities, numbers/currency, terminology, plain-language) rest on **ÚJČ
(prirucka.ujc.cas.cz)**, **CLDR 48.2**, and **government sources**; the weaker sections (grammar,
regional variation, idioms) rest on **Wikipedia and bilingual dictionaries** and are marked as such
at point of use. **Not yet reviewed by a native speaker** — per the authoring directive's "second
set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.
This is the first guide built from an agent-native dossier rather than an operator-run research pass.
**Easy or hard for this kit:** genuinely easy in most respects — Latin script, whitespace
tokenization, LTR, no shaping or bidi. The three things that actually bite: (1) **web-font glyph
coverage** for Latin Extended-A (ř ě ů ď ť ň) — a font that lacks them makes Czech look broken;
(2) **Czech quotation marks „…“** (low-open, high-close) and the **non-breaking space after
one-letter prepositions** (k, s, v, z, o, u, a, i), the single most-forgotten Czech web-typography
rule; and (3) **seven-case declension** — one English noun maps to up to seven Czech surface forms,
so naive dictionary-form output is ungrammatical.

Sources: <https://prirucka.ujc.cas.cz/?id=162> · <https://prirucka.ujc.cas.cz/?id=880> ·
<https://en.wikipedia.org/wiki/Latin_Extended-A> (speaker-reach line is editorial background, not
from the dossier)

---

## 1. Header block

See above. One-line orientation: Czech is a West-Slavic, SVO-but-flexible, LTR language in Latin
script with heavy diacritics and seven-case declension; the localization risks concentrate in
**font glyph coverage, Czech-specific punctuation (quotation marks + NBSP-after-preposition), and
morphological richness (case, gender, aspect)** rather than in scripting or direction.

---

## 4. Grammar for translators

**⚠ Community-tier section.** The grammar facts below rest on **Wikipedia lead sentences**
(Czech declension / conjugation / language articles) plus one language-learning blog for the
register nuance — **not** an ÚJČ grammar. They are standard, well-known facts, but the right/wrong
example pairs are **illustrative correct-form-only** (the correct side is standard Czech; the wrong
side is a constructed naive-calque error), and the whole section is **native-speaker confirmation
pending**.

**Word order.** Czech is **SVO by default but flexible, governed by topic–focus**
(en.wikipedia.org/wiki/Czech_language — „Czech syntax has a subject–verb–object sentence structure.
In practice, however, word order is flexible and used to distinguish topic and focus“). Do **not**
mechanically preserve English word order; the **end position typically carries the new/focused
information**.

- ✅ neutral: **Otevřete soubor v editoru.** ("Open the file in the editor.")
- ✅ focus on *where*: **Soubor otevřete v editoru.** (the editor is the new information)
- ❌ blindly cloning English order into every sentence regardless of what is being focused.

**Register — and the project's recorded choice.** Czech has the **tykání (ty, informal) vs vykání
(vy, formal/polite)** distinction (en.wikipedia.org/wiki/T–V_distinction; informal/formal
characterization corroborated at a language-learning blog — „Using 'ty' signals friendliness and
familiarity“; *vy* is „Used when addressing one person in a polite or respectful way“ — ⚠ that
corroboration is a learning site, not a scholarly authority). Educational/instructional material
conventionally uses **vykání (vy)** as the neutral-respectful default.

> **Register decision (human-gate): vykání (vy) — taken and recorded.** The base register for the
> platform is **vy / vykání (the formal-polite V-form)**. It is the conventional
> neutral-respectful register for Czech educational content and the only one that
> cannot read as over-familiar to an adult reader. **Binding for all second-person
> copy** in `cs` and `cs-easy` — no drift to *ty / tykání*, including in informal or playful
> passages, unless a specific piece is explicitly aimed at children. Concretely this means the
> **vy-imperative (-te ending)** and **vy verb agreement**, not the ty-singular.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ vy (the recorded register): **Klikněte zde.** · **Zadejte své jméno.** · **Nezapomeňte uložit.**
- ❌ ty (not the platform register): **Klikni zde.** · **Zadej své jméno.** · **Nezapomeň uložit.**

The grammar features that break a naive EN → CS translation:

**(1) Seven-case declension.** Czech nouns/adjectives/pronouns decline in **7 cases** — nominative,
genitive, dative, accusative, vocative, locative, instrumental (en.wikipedia.org/wiki/Czech_declension
— „Czech has seven cases…“). One English noun maps to up to seven Czech surface forms; a translator
who picks the dictionary (nominative) form everywhere produces ungrammatical output.

- ✅ accusative object: **Vidím pána.** ("I see the man.")
- ❌ naive nominative-everywhere: **Vidím pán.** *(illustrative wrong form — the object must take the
  accusative *pána*, not the dictionary form *pán*.)*

**(2) Three genders + masculine animacy.** Three genders, and masculine nouns split further into
**animate vs inanimate** (same source — „The paradigm of nominal declension depends on the gender and
the ending in the nominative“). Animacy changes the accusative form:

- ✅ masculine **animate**: *pán* → accusative **pána** (form changes).
- ✅ masculine **inanimate**: *hrad* → accusative **hrad** (unchanged).
- ❌ treating all masculines alike (e.g. *pán* → *pán* in the accusative) — animacy is a live
  grammatical distinction, not just semantics.

**(3) Verbal aspect (dokonavý/nedokonavý — perfective/imperfective).** Aspect is grammaticalized and
has no 1:1 English equivalent (en.wikipedia.org/wiki/Czech_conjugation — „Czech verbs are
distinguished by aspect, they are either perfective or imperfective“ and „Perfective verbs indicate
the finality of the process. Therefore, they cannot express the present tense“). The translator must
**choose aspect per context**; English tense alone won't disambiguate.

- ✅ imperfective (process/ongoing): **psát** ("to write / to be writing").
- ✅ perfective (completed): **napsat** ("to write down / finish writing").
- ❌ using a perfective where an ongoing present is meant — a perfective **cannot form a present
  tense**. *("no direct English equivalent" is editorial framing; the sourced mechanism is the
  no-present-tense rule.)*

**(4) Adjective–noun gender agreement.** Adjectives agree with the noun's gender
(en.wikipedia.org/wiki/Czech_declension — „Adjective declension varies according to the gender of the
noun which they are related to“). One English adjective → three Czech forms:

- ✅ **mladý muž** (masc.) · **mladá žena** (fem.) · **mladé víno** (neut.) — all "young".
- ❌ reusing one adjective form across genders (e.g. *mladý žena*, *mladý víno*).

**(5) End-focus carries new information (re-stated from word order).** Because word order is
topic–focus driven, mechanically front-loading like English buries the point.

- ✅ **Výsledek zobrazíte tlačítkem Uložit.** (the button — the new information — sits at the end,
  where Czech places the focus.)
- ❌ verb-mid English cloning that ignores information structure. *(⚠ this pair is the thinnest —
  topic–focus placement is context-dependent; treat as guidance, confirm with a native speaker.)*

Sources (all community-tier): <https://en.wikipedia.org/wiki/Czech_declension> ·
<https://en.wikipedia.org/wiki/Czech_conjugation> · <https://en.wikipedia.org/wiki/Czech_language> ·
<https://en.wikipedia.org/wiki/T–V_distinction> ·
<https://talkpal.ai/culture/what-is-the-difference-between-ty-and-vy-in-czech/> (learning site —
register nuance, corroborative only)

---

## 5. Numbers, dates, currency

**(Strong section — CLDR 48.2, cross-checked with ÚJČ.)**

**Decimal separator = comma; grouping separator = space.** (CLDR 48.2 `cs`: decimal `,`, group
` `.) ÚJČ concurs: prirucka.ujc.cas.cz/?id=791 — „oddělujeme trojice řádů před a za desetinnou čárkou
mezerami“ and „Před desetinnou čárkou ani za ní mezera není (2,18 km)“.

**Digits grouped in threes with a space; comma marks decimals.** ÚJČ id=791 — „čísla, která mají více
než tři místa vlevo nebo vpravo od desetinné čárky, členíme do skupin o třech číslicích“. Worked
examples on the page: „6 378 km; 30 000 let; 2 500 000 obyvatel; 11 430,5 l; 34 145,50 Kč“. CLDR
verify chart confirms rendering: grouped „1 000“ / „-123 456,7“, decimal „1,1“.

- ✅ Czech: **1 234,50** (space groups, comma decimal)  ·  **2 500 000 obyvatel**
- ❌ English format: **1,234.50** (comma groups, period decimal)

**Currency — Kč after the amount, separated by a space.** prirucka.ujc.cas.cz/?id=786 — „Značku měny
lze uvádět za peněžní částkou, popř. i před ní. Číslo a značku oddělujeme mezerou: 100 Kč …“. Before
position is also permitted. **No space changes what the string means**: „Pokud mezi číslem a značkou
mezera není, čteme složený výraz jako přídavné jméno: 100Kč = stokorunový“. ÚJČ states this
**descriptively** — it says what the glued form *is read as*, and **does not call it an error**.
Prefer whole „500 Kč“ over „500,– Kč“. ISO 4217 code **CZK**, symbol **Kč**.

- ✅ **100 Kč** (amount + space + Kč)  ·  before-position **Kč 100** also allowed
- ❌ **100Kč** — **this guide's editorial rule, not an ÚJČ prohibition**: glued, the string reads as
  the adjective *stokorunový* ("hundred-crown") rather than the amount, so a money field must not
  emit it.

**Dates — day-month-year, numerals with trailing dots, month name in genitive when spelled.** CLDR
48.2 verify chart: full „pátek 13. ledna 2012“; long „13. ledna 2012“; medium/short numeric
„13. 1. 2012“; month-year „leden 2012“. Note the **genitive month *ledna*** (of January) in the long
form vs **nominative *leden*** in month-year. Weekday abbreviations „pá / so / ne“. Time is 24-hour
„20:45“ / „20:45:59“.

- ✅ long: **13. ledna 2012** (genitive month) · ✅ numeric: **13. 1. 2012** · ✅ time: **20:45**
- ❌ **13. leden 2012** (nominative month in the long form — should be genitive *ledna*)
- ❌ 12-hour **8:45 PM** for end-user Czech content (use 24-hour **20:45**)

### 5a. Plural categories — `cs` needs **four**, and they are **not** the Ukrainian or Polish four

**Verbatim from the pinned release** `cldr-core@48.2.0/supplemental/plurals.json`,
`plurals-type-cardinal → cs` — all four rules, character for character (the run of spaces inside
`many` and the single leading space inside `other` are in the source and are reproduced here):

> `"pluralRule-count-one": "i = 1 and v = 0 @integer 1"`
>
> `"pluralRule-count-few": "i = 2..4 and v = 0 @integer 2~4"`
>
> `"pluralRule-count-many": "v != 0   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"`
>
> `"pluralRule-count-other": " @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"`

In this notation `i` is the integer part of the number and `v` the count of visible fraction digits.
So `one` is the single value **1**; `few` is **2, 3, 4, and nothing else** — not 22, not 102; `many`
states **no condition on size at all**, only `v != 0`, i.e. "written with a fraction part"; and
`other` is stated with an **empty rule** and an `@integer` sample list — it is the catch-all that
takes **0 and every whole number from 5 upward**, 21, 22, and 100 included.

**What each category means for a translator.** Czech morphology answers this directly, and the ÚJČ
page on the counted noun after a numeral (prirucka.ujc.cas.cz/?id=792, *Počítaný předmět po
číslovkách*) is the authority already trusted elsewhere in this guide:

- **1–4 agree with the noun the way an adjective does** — „jsou číslovky jeden, dva, tři, čtyři svou
  povahou přídavná jména, tudíž se musí mluvnicky shodovat se jménem počítaného předmětu“. So the
  noun stands in the **nominative singular** after 1 and the **nominative plural** after 2–4.
- **From 5 upward the numeral behaves like a noun and governs the genitive plural** — „U ostatních
  základních číslovek, které jsou svou povahou podstatná jména, se jako základní prostředek
  vyjádření kvantovosti ustálil počítaný předmět ve 2. p. mn. č. (tzv. numerativ, genitiv
  numerativní“.
- **Decimals govern the genitive singular** — „Shoda počítaného předmětu po desetinných číslech se
  řídí podle desetin, setin atd., tvar počítaného předmětu je proto ve 2. p. j. č.: 0,2 metru,
  0,5 metru, 1,1 metru, po 1,2 metru, 2,2 metru“.

| Category | Which counts land here | What the interface string needs |
|---|---|---|
| `one` | **1** — and only 1 | nominative **singular** |
| `few` | **2, 3, 4** — and only those; **not** 22, 32, 102 | nominative **plural** |
| `many` | **fractions only** — 0,5 · 1,5 · 2,36; the rule carries `@decimal` samples and **no `@integer` samples at all** | **genitive singular** |
| `other` | **0**, 5–19, 20, **21, 22**, 100, 1000 — every remaining whole number | **genitive plural** (the numerativ) |

`[craft]` **Joining the two columns is this guide's reading.** ÚJČ describes Czech case government
and never mentions plural categories; the plural data states selection and never mentions case.
They line up cleanly and the worked example below is checked against a real paradigm, but the join
itself is editorial. **Zero is the one cell ÚJČ does not cover:** that 0 selects `other` is data
(the sample list above); that the noun then stands in the genitive plural is this guide's extension
of the numerativ rule, not an ÚJČ ruling.

**Consequences a developer meets.**

1. **Four branches, not two.** `{n} lekce` in the English one/other shape has no `cs` rendering.
   Wire counts through `Intl.PluralRules('cs')` or the framework's ICU plural selector and author
   all four messages.
2. **`many` is unreachable from an integer — but not therefore dead.** Every whole number selects
   `one`, `few` or `other`; `many` fires only when the formatted number carries a fraction part. A
   product whose counts are all item counts will never see it. That is not permission to leave it
   empty: the first message that formats an average, a score, or a duration (**1,5 hodiny**) has
   `many` as its only branch. Equally, a `many` string authored as if it meant "a large number" is
   code that can never run.
3. **`other` is the workhorse, not the fallback.** In English `other` is the plural-of-everything and
   `one` carries the weight; in Czech `other` is a **specific morphological form** — the genitive
   plural — that also happens to be the catch-all. **Zero lands here**, so the empty state
   („0 úkolů“) comes out of `other`, not out of a separate zero branch.
4. **`few` stops at 4.** 22 and 102 are `other` in Czech. ÚJČ records that after compound numerals
   ending in *jeden/dva/tři/čtyři* **both** constructions occur — „Po složených číslovkách končících
   na jeden, dva, tři, čtyři jsou v 1. p. možné tvary: dvacet jeden žák i dvacet jedna žáků, dvacet
   dva/tři/čtyři žáci i žáků“ — and that „Tvary 2. p. jsou běžnější a přirozenější.“ So *22 úkoly* is
   **not an error** in Czech; it is simply not what the `other` branch can carry, because that one
   branch must also serve 5, 11, and 100. Author `other` in the genitive plural and 22 comes out in
   the form ÚJČ calls the commoner and more natural one.

**Worked example — a counted noun in a course interface.** **úkol** ("task", "exercise"; masculine
inanimate, *rod: m. neživ.*). The forms are **not authored**: they are the ÚJČ paradigm at
prirucka.ujc.cas.cz/?slovo=úkol — 1. p. j. č. **úkol**, 2. p. j. č. **úkolu**, 1. p. mn. č.
**úkoly**, 2. p. mn. č. **úkolů**.

- ✅ `one` → **1 úkol** · `few` → **2 úkoly**, **3 úkoly**, **4 úkoly** · `other` → **0 úkolů**,
  **5 úkolů**, **11 úkolů**, **22 úkolů**, **100 úkolů** · `many` → **0,5 úkolu**, **1,5 úkolu**
- ❌ **5 úkoly** (5 and up take the genitive plural *úkolů*) · ❌ **2 úkolů** (2–4 agree adjectivally
  — nominative plural *úkoly*) · ❌ **1,5 úkolů** (a decimal takes the genitive singular *úkolu*) ·
  ❌ a hard-coded bracket form **1 úkol(y)**, which serves no branch correctly

⚠ **A homograph will hide the machinery — pick the test noun deliberately.** Take **lekce**
("lesson"; feminine): the ÚJČ paradigm at prirucka.ujc.cas.cz/?slovo=lekce gives **lekce** for
1. p. j. č., 2. p. j. č. **and** 1. p. mn. č., and **lekcí** only for 2. p. mn. č. Three of the four
branches therefore carry the **same string** — 1 lekce · 2 lekce · 1,5 lekce — and only `other`
differs: 5 lekcí. A translator who tests the wiring on *lekce* alone can reasonably conclude the
four branches are redundant. They are not; the next noun in the file is *úkol*.

The same integer split is visible in shipped Czech product UI: MediaWiki's `cs` message file writes
`category-article-count-limited` as
`Tato kategorie obsahuje {{PLURAL:$1|následující stránku|následující $1 stránky|následujících $1 stránek}}.`
— singular, then the 2–4 plural, then the genitive plural *stránek*, i.e. the `one` / `few` / `other`
triple with the fraction-only `many` branch simply absent from that message system. (⚠ corpus tier —
shipped product UI, not a normative source. The first two forms stand in the **accusative** there
because *obsahuje* governs it; the numeral fixes the *number*, the sentence fixes the *case* — that
last observation is this guide's reading of the ÚJČ rule above, not a quote.)

> ⚠ **Do not port the Ukrainian or Polish plural prose into Czech — the partition is inverted.**
> All three are Slavic, all three have exactly four cardinal categories, and the tables look
> interchangeable. They are not. In the **same fetched file**, `plurals-type-cardinal → uk` gives
> `many` as `"v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"`
> and `other` as `"   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"`;
> `plurals-type-cardinal → pl` gives `many` as
> `"v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"`
> with the same decimal-only `other`. **Czech swaps those two roles:** `many` is the fraction branch
> and `other` holds 0 and 5-and-up. Any sentence carried over from [uk](uk.md) §5a — "zero is
> `many`", "`other` is decimals only", "`other` is unreachable from whole numbers" — is **exactly
> backwards for `cs`**. Two further differences ride along: `few` **does not** extend to 22/32/102
> in Czech as it does in `uk` and `pl`, and Czech has **one** ordinal category where `uk` has two.
> The [pl](pl.md) guide carries no plural section at the time of writing, so there is nothing there
> to copy from either — the `pl` rules above are quoted from this section's own fetch.

**Ordinals are a separate — and much simpler — rule set.**
`cldr-core@48.2.0/supplemental/ordinals.json`, `plurals-type-ordinal → cs`, gives `cs` a **single**
category:

> `"pluralRule-count-other": " @integer 0~15, 100, 1000, 10000, 100000, 1000000, …"`

So `Intl.PluralRules('cs', { type: 'ordinal' })` returns `other` for every input, and an ordinal
label (**3. lekce**, **23. pokus**) needs exactly **one** message — there is no ordinal branch to
author and no ordinal switch to build. `[craft]` That is a statement about **selection only**:
Czech ordinals are adjectives and still inflect for gender and case (§4), and they are written with
a trailing dot (§5). The plural machinery touches none of that, and no grammar authority was fetched
here for the ordinal paradigm itself. Compare [uk](uk.md) §5a, where the ordinal set has **two**
categories — reusing a Ukrainian ordinal switch for Czech builds a branch that can never fire.

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/cs.html> ·
<https://www.unicode.org/cldr/charts/latest/verify/dates/cs.html> ·
<https://prirucka.ujc.cas.cz/?id=791> · <https://prirucka.ujc.cas.cz/?id=786> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> (all four `cs` cardinal rules, plus
the `uk` and `pl` rules quoted in the cross-reference warning — verbatim, fetched from the pinned
release 2026-07-27) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/ordinals.json> (the single `cs` ordinal rule —
verbatim, same fetch) · <https://prirucka.ujc.cas.cz/?id=792> (*Počítaný předmět po číslovkách* —
the three case rules, verbatim) · <https://prirucka.ujc.cas.cz/?slovo=úkol> ·
<https://prirucka.ujc.cas.cz/?slovo=lekce> (declension paradigms for the worked examples — ÚJČ
tables, not authored forms) ·
<https://raw.githubusercontent.com/wikimedia/mediawiki/master/languages/i18n/cs.json>
(`category-article-count-limited` — verbatim, corpus tier: shipped `cs` product UI, not a normative
source) · the mapping of case rules onto plural categories, and the genitive plural for zero, are
this guide's editorial reading (marked at point of use)

---

## 6. Terminology strategy

**(Strong section for the policy; the seed-table renderings are Wikipedia-lead-sentence sourced.)**

**Loanword vs native-coinage practice.** Conceptual/academic terms are **calqued or natively coined**
(umělá inteligence, strojové učení, hluboké učení, učení s/bez učitele); hands-on/product-level terms
**stay English loanwords** (prompt, token, chatbot, model, dataset, algoritmus); **hybrids are common**
(trénovací data, generativní umělá inteligence). (Nový encyklopedický slovník češtiny, ANGLICISMY —
„Hojně se v češtině využívají také výpůjčky z angličtiny…“.) **Working rule: prefer the established
sector term over a novel coinage; keep well-known English acronyms (AI, LLM, GenAI, NLP) and hands-on
loanwords in their usual form.** Loanwords **decline** like Czech nouns (e.g. *prompt* → *promptů*;
verb *tokenizace*) — respect the case (§4), don't freeze them in the nominative.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of an
established domain term (class **C3**), give target term + original + one short plain clause, then use
the target term alone afterwards. Instantiated in Czech with a sourced term:

> **umělá inteligence** (artificial intelligence, AI) — obor informatiky, který napodobuje schopnosti
> lidského myšlení. *(explanatory clause authored per the sandwich format; the term itself is sourced
> below.)* Then **umělá inteligence** alone on every later mention.

**Seed field vocabulary (AI/ML).** Field-standard renderings; each row carries the dossier's verbatim
Wikipedia-lead quote as provenance. Treat as **field usage** (no ÚJČ-issued AI terminology list
exists), freeze the chosen forms in the project glossary, and don't mix competing renderings.

| Concept (EN) | Czech | Type | Provenance (verbatim) |
|---|---|---|---|
| artificial intelligence | **umělá inteligence** (UI/AI) | calque | „Umělá inteligence (UI, anglicky artificial intelligence – zkráceně AI) je obor informatiky“ |
| machine learning | **strojové učení** | calque | „Strojové učení je podoblastí umělé inteligence…“ |
| neural network | **(umělá) neuronová síť** | calque/internat. | „Umělá neuronová síť … je jeden z výpočetních modelů“ |
| deep learning | **hluboké učení** | calque | „Hluboké učení (anglicky deep learning) je disciplína spadající do kategorie strojového učení.“ |
| large language model | **velký jazykový model** (LLM) | calque | „Velký jazykový model … je počítačový model jazyka založený na neuronové síti“ |
| training data | **trénovací data** | hybrid | „je obvykle potřeba dostatečně reprezentativní množství trénovacích dat.“ |
| algorithm | **algoritmus** | loanword | „Algoritmus je přesný návod či postup, kterým lze vyřešit daný typ úlohy.“ |
| dataset | **datová sada** / **datový set** | native + loan | „data … uspořádaná do tabulek a datových setů.“ (⚠ no verbatim for the native „datová sada“ — its govt/opendata glossary page 301-redirected) |
| supervised learning | **učení s učitelem** | calque ("with a teacher") | „Učení s učitelem je třída metod strojového učení…“ |
| unsupervised learning | **učení bez učitele** | calque ("without a teacher") | „Učení bez učitele je třída metod strojové učení.“ (sic — grammatical slip in source) |
| model | **model** | loan/internat. | „je počítačový model jazyka založený na neuronové síti…“ |
| prompt | **prompt** (also dotaz/požadavek; declines: promptů) | loanword | „metodologie navrhování efektivních požadavků či dotazů (promptů) velkým jazykovým modelům“ |
| token | **token** (verb: tokenizace) | loanword | „Tokenizace je převod textu na tokeny.“ |
| generative AI | **generativní umělá inteligence** (GenAI) | hybrid | „Generativní umělá inteligence … je umělá inteligence schopná generovat text, obrázky, videa“ |
| chatbot | **chatbot** (also konverzační agent) | loanword | „Chatbot (též chatterbot nebo konverzační agent) je označení pro počítačové programy…“ |

Project coinages (C1) keep their original spelling in Czech text and are owned by the term-sheet, not
this table.

Sources: <https://www.czechency.org/slovnik/ANGLICISMY> ·
<https://cs.wikipedia.org/wiki/Umělá_inteligence> · <https://cs.wikipedia.org/wiki/Strojové_učení> ·
<https://cs.wikipedia.org/wiki/Velký_jazykový_model> ·
<https://cs.wikipedia.org/wiki/Generativní_umělá_inteligence> ·
<https://cs.wikipedia.org/wiki/Chatbot> (seed renderings are Wikipedia-lead-sentence sourced —
field usage, not an academy decree)

---

## 7. Idiom anti-patterns

**⚠ Dictionary-grade section, native-speaker confirmation pending.** These renderings rest on
**bilingual dictionaries** (slovnik.seznam.cz, cs.glosbe.com) and Czech Wikipedia for two entries —
**not** an academy idiom dictionary. Ten of twelve are dictionary-sourced; two (the big picture, best
practice) are editorial where the dictionary gave only word-decomposition. Prefer the idiomatic
column; the calque column is the naive output to avoid.

| English phrase | Idiomatic Czech ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| let's get started | Začněme / Pusťme se do toho | Nechme nás začít | slovnik.seznam.cz — „začněme Let's get started.“ (*Pusťme se do toho* editorial variant) |
| step by step | krok za krokem / postupně | stupeň po stupni | slovnik.seznam.cz — „postupně, krok za krokem“ |
| keep in mind | mějte na paměti | držet v mysli | slovnik.seznam.cz — „Mějte stále na paměti, že …“ |
| at a glance | na první pohled | na jeden pohled / při jednom mrknutí | slovnik.seznam.cz — „na první pohled, okamžitě poznat ap.“ |
| trial and error | metoda pokus-omyl | zkouška a chyba / pokus a chyba | cs.wikipedia.org/wiki/Metoda_pokus-omyl — „Metoda pokus-omyl (v angličtině trial and error)…“ |
| rule of thumb | orientační pravidlo / přibližné pravidlo / od oka | pravidlo palce | cs.glosbe.com — lists „orientační pravidlo“, „přibližné pravidlo“, „odhad 'od oka'“ (glosbe flags *pravidlo palce* "less frequent") |
| hands-on | praktický (praktická zkušenost) | ruce-na / s rukama na | slovnik.seznam.cz — „praktický“ |
| in a nutshell | v kostce / ve zkratce / stručně řečeno | v oříšku / ve skořápce | slovnik.seznam.cz — *v kostce* = „in short/brief/a nutshell“ |
| food for thought | podnět k zamyšlení | jídlo k přemýšlení / potrava pro myšlenky | slovnik.seznam.cz — „give sb food for thought → dát komu podnět k zamyšlení“ |
| learning curve | křivka učení; for "steep" prefer náročné osvojení / než se to člověk naučí | učící křivka; *strmá* misread as physical steepness | slovnik.seznam.cz — „křivka učení“ |
| the big picture | celkový obraz / širší souvislosti / nadhled | velký obrázek / velký obraz | ⚠ editorial (seznam gives only word-decomposition) |
| best practice | osvědčený postup / osvědčená praxe | nejlepší praxe (common calque) | ⚠ editorial (no idiom entry on seznam) |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources (dictionary/community-tier): <https://slovnik.seznam.cz/> ·
<https://cs.glosbe.com/en/cs/rule%20of%20thumb> · <https://cs.wikipedia.org/wiki/Metoda_pokus-omyl>
(idiom renderings — native-speaker confirmation pending)

---

## 8. Simplified-language pendant (`cs-easy`)

**(Strong section — a named Czech tradition plus government methodologies exist.)** A corpus
measurement was run on 2026-07-27; it **moved where the weight sits** (8b) and **removed nothing**
from what is sourced. Everything in 8a stood before the measurement and stands after it.

### 8a. The standard and the authorities

**Named tradition: „Snadné čtení“ (Easy-to-Read).** A method of writing texts in simple form for
readers with limited comprehension (cs.wikipedia.org/wiki/Snadné_čtení — „Snadné čtení je metoda psaní
textů v jednoduché formě tak, aby byly srozumitelné lidem s omezenými schopnostmi porozumění textu“).
Target groups: people with dementia, intellectual disabilities, and foreigners with limited Czech.

**Concrete quantitative rules.** Same source — „psát krátké věty o maximální délce kolem 15 slov,
krátké odstavce o 5 větách“; „používat kladné věty místo záporných vět“; „používat činný slovesný rod
spíše než trpný“; „používat jednoduchá slova; složitější slova vysvětlit v textu“. So: **≤ ~15 words
per sentence, ~5 sentences per paragraph, active + positive phrasing, simple words with harder ones
explained in-text.** (Note this ~15-word figure is a *sourced Czech norm*, unlike the kit's own
~8–12-word target — where they differ, `cs-easy` may use the tighter kit figure but the Czech norm is
the sourced anchor.)

**Maintaining organizations / standards.** The article references the pan-European **Inclusion Europe**
easy-to-read standard and the Easy-to-Read logo; the Czech **Ministry of the Interior (MV ČR)** issued
an Easy-to-Read methodology (2018/2019). Government "srozumitelné texty" guidance also exists
(ochránce / vláda). **There is no single legally-binding Czech easy-language norm** — guidance is
methodological (editorial inference from the above, not a single verbatim "no standard exists" quote).

**Government plain-language authorities (principles + concrete rewrites).**
- Úřad veřejného ochránce práv, *Jak psát srozumitelné úřední texty* — §35 „Český výstižný výraz
  použijte před cizím“; §37 „Používejte obvyklé výrazy, ne úřední žargon“. Concrete rewrites:
  *relevantní → podstatné*, *sankce → pokuta*.
- MV ČR *Metodika Easy to read* — „Používejte jednoduchá slova, která lidé znají a rozumějí jim“;
  rewrite „Nepište ‚žadatel musí vyplnit formulář‘, napište ‚vyplňte formulář‘.“ (Note that MV
  rewrite is already **vy-imperative**, consistent with §4. ⚠ Inner marks normalized: the dossier
  renders the nested pair with double marks and an ASCII-flattened close; they are shown here as the
  single pair ‚ ‘ per §3's nesting rule. Wording unchanged.)

**How `cs-easy` relates to the kit's base rules.** `cs-easy` **inherits the kit's base
simplified-language rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) —
one idea per sentence, everyday words, say what *is* not what *isn't* (the sourced *kladné věty*
rule reinforces this), active voice (sourced *činný rod*), a one-line "what is this" opener, and a
consistent literal tone — and adds the **Czech-specific sourced overlays**: **≤ ~15 words/sentence,
~5 sentences/paragraph**, and the **term-preservation rule in 8d**. The one register overlay:
**hold the recorded vykání (vy) register steadily (§4) — do not drift to *ty* for "friendliness".**

### 8b. The axis — sentence length and personal address, not vocabulary

The sourced rules in 8a name three things at once: shorter sentences, plainer words, active and
positive phrasing. The measurement in 8c can see only some of that, and what it does see points at
**structure and person**:

| | A (simpler) | B (standard) |
|---|---|---|
| mean sentence length | **12.78** words | **18.06** words |
| `jsem` (1st person sg.) | **802.3** /100k | 180.8 /100k |
| `mi` ("to me") | **252.5** /100k | 40.1 /100k |

The simpler corpus speaks in the **first person** and addresses its reader **directly**; that is the
second clear signal beside sentence length. The **vocabulary** axis — the complex→everyday table in
8d — is exactly the axis these corpora **cannot** speak to (8c). So: the sourced word substitutions
keep their standing and their sourcing, but the two levers `cs-easy` can be *held to* with evidence
from this measurement are **sentence length** and **direct personal address**. Ordering follows in 8f.

### 8c. The corpus measurement (machine-run, 2026-07-27)

Tool: `scripts/corpus-measure.mjs` (this kit). Reproducible.

| | Publication | Genre | Docs | Tokens | Mean sentence |
|---|---|---|---|---|---|
| **A (simpler)** | Alík.cz „Alíkoviny“ | children's / youth portal | 250 | 205,907 | **12.78** |
| **B (standard)** | Český rozhlas Plus | analytical journalism | 250 | 137,171 | **18.06** |

Tokenizer self-test (`je`) passed: 1,706 hits in B.

⚠ **Confounds.** **Different publishers** — no Czech publisher runs a simpler edition of its own
output, so there is no same-house pair to compare. **Different genres** — a children's portal against
background journalism. And A carries a **forum/quiz component**, visible in the keyness as `b` / `c` /
`d` and `příspěvek`.

**Why no genre-matched standard corpus.** The large Czech news portals — **iDNES, Novinky, Seznam
Zprávy, Aktuálně, Deník, iRozhlas** — **decline automated text collection by name**, which is why
Rozhlas Plus stands in as corpus B.

**Thresholds, stated so the verdicts are checkable.** A direction is only claimed at a frequency
factor of **1.25×** or more. A row counts as **thin** below **3 per 100k** — **including when only the
formal word falls below it**, because a single occurrence carries no statement. Two labels follow, and
they mean different things:

- **thin** — the words are present but too rare here to judge the swap.
- **untestable** — the formal word is **absent from both corpora**: it belongs to a register these
  corpora do not contain.

Neither label is a refutation. Both say **not measurable here** — which is not the same finding as
**measured and refuted**, and must never be reported as one.

**🔑 Main finding: the word table is NOT testable against these corpora.** Fifteen pairs were probed
(the twelve rows of 8d plus the alternative renderings *provést*, *zahájit*, *podstatné*):

| Formal | Everyday | Formal A / B per 100k | Everyday A / B per 100k | Verdict |
|---|---|---|---|---|
| relevantní | důležité | 0 / 1.5 | 24.3 / 24.1 | thin — formal word too rare in both corpora to judge the swap |
| sankce | pokuta | 0 / 5.1 | 0 / 0.7 | thin — too few tokens to judge |
| realizovat | udělat | 0.5 / 1.5 | 18 / 19 | thin — formal word too rare in both corpora to judge the swap |
| informovat | říct | 1.5 / 0.7 | 30.6 / 14.6 | thin — formal word too rare in both corpora to judge the swap |
| disponovat | mít | 0 / 0 | 68 / 64.9 | untestable — formal word absent from both corpora |
| aplikovat | použít | 0 / 0.7 | 12.1 / 6.6 | thin — formal word too rare in both corpora to judge the swap |
| akceptovat | přijmout | 0.5 / 1.5 | 0 / 9.5 | thin — formal word too rare in both corpora to judge the swap |
| kontaktovat | spojit | 0 / 0 | 2.9 / 2.2 | untestable — formal word absent from both corpora |
| specifikovat | určit | 0 / 0 | 3.9 / 2.9 | untestable — formal word absent from both corpora |
| eliminovat | odstranit | 0 / 0.7 | 1 / 2.9 | thin — too few tokens to judge |
| iniciovat | začít | 0 / 0 | 12.6 / 13.9 | untestable — formal word absent from both corpora |
| verifikovat | ověřit | 0 / 0 | 3.4 / 1.5 | untestable — formal word absent from both corpora |
| provést | udělat | 0 / 2.2 | 18 / 19 | thin — formal word too rare in both corpora to judge the swap |
| zahájit | začít | 0 / 1.5 | 12.6 / 13.9 | thin — formal word too rare in both corpora to judge the swap |
| podstatné | důležité | 0.5 / 2.9 | 24.3 / 24.1 | thin — formal word too rare in both corpora to judge the swap |

**Ten rows are thin, five untestable — not one carries a verdict.** That is a finding about the
corpora, **not a count against the list**. The cause is structural: the list targets **bureaucratic
and administrative Czech**, and neither a children's portal nor a radio news service contains that
register. The same pattern is already recorded for [no](no.md) and [nl](nl.md) in this kit — three
languages, one shape, because the corpora that can be assembled are children's/news material while
the wordlists target officialese. It is a property of the available corpora, not a coincidence. **The
two ochránce-sourced rows keep their full standing**, which was never corpus-derived in the first
place.

⚠ **No lemmatization — verb and adjective rows are undercounted by construction.** Czech inflects
heavily and the tool counts **word forms**, not lemmas: *udělat*, *přijmout*, and the rest stand in
running text as conjugated forms that the count never reaches. Every verb and adjective figure above
is therefore **systematically too low**, and a lemmatized re-run would move them.

⚠ **Keyness artifacts — do NOT read these as language findings.**

| word | A /100k | B /100k | LL | favors |
|---|---|---|---|---|
| b | 375.4 | 0.7 | 775.8 | A |
| c | 376.9 | 5.8 | 717.7 | A |
| jsem | 802.3 | 180.8 | 669.4 | A |
| plus | 1.5 | 238.4 | 568.4 | B |
| příspěvek | 274.9 | 2.2 | 546 | A |
| foto | 1 | 223.8 | 540.8 | B |
| prosinec | 0.5 | 158.9 | 387.9 | B |
| d | 206.4 | 11.7 | 325.7 | A |
| alík | 151 | 0 | 317.6 | A |
| čtk | 0 | 109.4 | 275 | B |
| unie | 0.5 | 113 | 273.1 | B |
| mi | 252.5 | 40.1 | 269.1 | A |

`b`, `c`, `d` are **quiz answer letters**; `alík` / `příspěvek` are the **portal's own name** and its
**forum vocabulary**. On the other side, `plus`, `foto`, `čtk`, `prosinec` and `unie` are the standard
corpus's **brand token, photo credit, news agency**, and subject matter. **Only `jsem` and `mi` are
register signals** — those two, and the sentence length, are the whole of what this measurement
contributes.

### 8d. 🔴 do-NOT-simplify

**Term-preservation rule (binding).** In `cs-easy`, **keep the technical term and explain it** — never
swap in a folksy stand-in. Keep e.g. **umělá inteligence**, then „to znamená: …“, then a concrete
example. This is distinct from the complex→everyday table below, which targets bureaucratic
*non-technical* vocabulary.

- ✅ keep the term, then explain: **umělá inteligence** — „to znamená: …“ — then one concrete example.
- ❌ replacing the term with an invented everyday paraphrase, so the reader never meets the word the
  rest of the world uses.

**There are no measured reversals in this guide, and none may be invented.** A reversal would be a row
where the corpus showed the supposedly *simpler* word to be the rarer one. This measurement produced
**no such row** — because it produced no verdicts at all (8c). An empty result is not a license to
write one.

⚠ **Cross-language caution, requiring local verification.** In this kit's **measured** languages the
finding recurs that **the learned or borrowed word is not reliably the harder one**, and that a
"simplification" often swaps a common word for a **rarer** one. That is a caution carried in from
other languages — it is **not a Czech measurement**, and for Czech it remains **unverified in either
direction**. Before an editorial row below is applied as a rule, check the substitute is actually the
commoner word in Czech.

**Complex → everyday word table.** Two rows are **sourced** to the ochránce guide; the remaining ten
are **editorial** in the spirit of that guidance (⚠ — confirm with a native speaker). The corpus
column records what 8c could establish: for every row, nothing.

| Complex Czech | Everyday Czech | Sourcing | Corpus (8c) |
|---|---|---|---|
| relevantní (okolnosti) | podstatné / důležité | **sourced** — ochránce (*relevantní → podstatné*) | not measurable here (thin) |
| sankce | pokuta / trest | **sourced** — ochránce (*ukládání sankce → ukládání pokuty*) | not measurable here (thin) |
| realizovat | udělat / provést | editorial | not measurable here (thin, both renderings) |
| informovat (koho) | říct / dát vědět | editorial | not measurable here (thin) |
| disponovat (čím) | mít | editorial | not measurable here (untestable) |
| aplikovat | použít | editorial | not measurable here (thin) |
| akceptovat | přijmout / uznat | editorial | not measurable here (thin) |
| kontaktovat | ozvat se / spojit se s | editorial | not measurable here (untestable) |
| specifikovat | upřesnit / určit | editorial | not measurable here (untestable) |
| eliminovat | odstranit | editorial | not measurable here (thin) |
| iniciovat | zahájit / začít | editorial | not measurable here (untestable; *zahájit* thin) |
| verifikovat | ověřit | editorial | not measurable here (untestable) |

Read the last column as **"this corpus could neither confirm nor refute it"** — the sourced rows rest
on the ochránce guide and are unaffected; the editorial rows stay editorial and still await a native
speaker.

### 8e. 🔑 The address decision

**`cs-easy` holds vykání (vy)** — the register recorded in §4, on the grounds recorded there, and for
the reasons recorded there. The MV ČR rewrite quoted in 8a is itself already a **vy-imperative**
(„vyplňte formulář“), so the sourced easy-language material and the recorded register agree. No drift
to *ty* in `cs-easy` for the sake of friendliness.

**The corpus is silent on this, and says nothing either way.** The measurement contributes **nothing**
to the address question: the first-person signal in 8b (`jsem`, `mi`) is about **who speaks**, not
about which second-person form the reader is addressed with. The decision therefore rests entirely on
§4's recorded grounds — which is where it already rested.

### 8f. What `cs-easy` is built on — in order of leverage

1. **Sentence length.** The sourced norm of **≤ ~15 words** (8a), tightened to the kit's ~8–12 where
   the text allows; ~5 sentences per paragraph. This is the axis the measurement shows most clearly
   (12.78 vs 18.06).
2. **Direct personal address.** Speak to the reader, in the **vy** form (8e); the simpler corpus's
   first-person, directly-addressing voice is the second measured signal. Active voice (*činný rod*)
   and positive phrasing (*kladné věty*) belong here — both sourced in 8a.
3. **The sourced substitutions.** *relevantní → podstatné*, *sankce → pokuta*, plus the ochránce
   principles §35 (Czech expression before the foreign one) and §37 (ordinary words, not official
   jargon). Sourced, and applied.
4. **The editorial substitutions**, last — useful, in the spirit of the guidance, and neither
   confirmed nor refuted by any measurement (8d).

The ordering is deliberate: 1 and 2 are where the evidence is, 3 is where the sourcing is, 4 is where
the open questions are.

### 8g. What is still open

- **The wordlist is untested.** No evidence for or against any of the fifteen probed pairs (8c).
- **What corpus would test it:** **administrative prose against its own plain-language rewrites** —
  official Czech texts paired with the same texts rewritten to the ochránce / MV ČR guidance. That is
  the register the list targets, and the only pairing in which the swaps would actually appear. No
  such pair was available: no Czech publisher runs a simpler edition, and the large news portals
  decline automated collection (8c).
- **A lemmatized re-run.** The current figures count word forms; for verbs and adjectives they are
  too low by construction (8c), so thin rows may or may not survive lemmatization.
- **Native-speaker confirmation** for the ten editorial rows in 8d, and for the cross-language
  caution as it applies to Czech.
- **No comprehensibility evidence.** Nothing here measures whether readers understand the simplified
  text better — only how the two corpora differ.

Sources: <https://cs.wikipedia.org/wiki/Snadné_čtení> ·
<https://www.ochrance.cz/uploads-import/ESO/příručka/Prirucka_srozumitelneho_psani_tisk.pdf>
(PDF parsed via pdftotext) ·
<https://mv.gov.cz/soubor/easy-to-read-2019-metodika-srozumitelneho-a-zjednoduseneho-vyjadrovani-ve-verejne-sprave.aspx>
· corpus measurement 2026-07-27 via `scripts/corpus-measure.mjs` (corpora: Alík.cz „Alíkoviny“ and
Český rozhlas Plus, 250 documents each — machine-run and reproducible; all 8c figures come from it,
and it carries no verdict on the word table)

---

## 9. Regional variation

**⚠ Community-tier section (Wikipedia).** Sourced to Czech-language Wikipedia articles, not an ÚJČ
regional-usage study; the neutrality recommendation is editorial. Native-speaker confirmation pending.

**Standard vs Common Czech.** **spisovná čeština** (Standard/literary Czech) is the formal register
„used in official documents, formal literature, newspaper articles, education and occasionally public
speeches“ (en.wikipedia.org/wiki/Czech_language). **obecná čeština** (Common Czech) is „The most widely
spoken vernacular form of the language“ — an interdialect „influenced by spoken Standard Czech and the
Central Bohemian dialects of the Prague region.“

**Bohemia vs Moravia.** *Obecná čeština* is Bohemian/Prague-based; **Moravia is more dialectally
diverse and lacks a single unifying interdialect** (en.wikipedia.org/wiki/Moravian_dialects — „the
territory of Moravia is still linguistically diversified“, attributed to „absence of a single Moravian
cultural and political centre (analogous to Prague in Bohemia)“). Practical upshot: *obecná čeština*
forms (e.g. the **-ej for -ý** ending, *dobrej* for *dobrý*) read as Bohemian and can feel
non-neutral to Moravian readers.

**Neutrality strategy (explicit).** The project targets **spisovná čeština** as the neutral written
baseline. It is the register Wikipedia attributes to education; *obecná čeština* signals a
colloquial/regional voice and is **inappropriate as the default**.

- ✅ Standard: **dobrý den**, **to je dobrý nápad**, **děláte** (spisovná čeština)
- ❌ Common Czech in default content: **dobrej den**, **dobrej nápad**, **děláte → *děláš* colloquial
  drift** (obecná čeština -ej / familiar forms — reads as regional/casual)

There is otherwise **one written standard** — Czech does not split across separate national
orthographies — so a single neutral `cs` build serves all readers; the only axis to hold is
register (standard, not colloquial) and, per §4, vykání.

Sources (community-tier): <https://en.wikipedia.org/wiki/Czech_language> ·
<https://en.wikipedia.org/wiki/Moravian_dialects> (neutrality recommendation editorial —
native-speaker confirmation pending)

---

