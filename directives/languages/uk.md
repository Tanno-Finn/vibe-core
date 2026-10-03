<!-- base -->
# lang-uk — Ukrainian (українська мова) — language guide

> **Setup & sources live in [`uk.setup.md`](uk.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** українська мова / Ukrainian.
**BCP 47 code (base):** `uk`.
**BCP 47 code (simplified variant):** `uk-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`uk-x-simple`), but the
kit token `uk-easy` is the one that counts here.
**Speaker reach:** estimates commonly place Ukrainian at roughly **30–34 million native speakers**,
overwhelmingly in Ukraine, where **it is the sole official state language**; sizeable diaspora
communities worldwide. (⚠ an estimate range, not a census count — pick and cite one authority
before quoting an exact number.)
**Script + direction:** Ukrainian Cyrillic alphabet, **33 letters**, in the Cyrillic block
**U+0400–U+04FF**; **left-to-right**. Whitespace word separation works — ordinary tokenization
applies, no bidi handling required.
**Status:** planned — authored from an **agent-native external research dossier** (self-fetched,
quote-per-claim, then independently reviewed against the cited sources; RU-contamination
self-check clean). Covers base `uk` and the `uk-easy` pendant. **Not yet reviewed by a fresh model against the
cited sources beyond this revision, and not yet reviewed by a native speaker** — per the
authoring directive's "second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this
header records both gaps honestly.
**Easy or hard for this kit:** the *easy* parts — LTR, whitespace-separated words, a single
codified literary standard, and a Cyrillic script fully covered by mainstream web fonts. The *hard*
parts, all editorial rather than technical: **(1)** a seven-case morphology that forbids reusing
one noun form across UI contexts and demands the **vocative** for direct address; **(2)** pervasive
**gender agreement** on adjectives and past-tense verbs, which breaks `{user} added`-style
placeholders; **(3)** the **ти/ви register** decision (settled below); and **(4)** the
**russism ↔ purism axis** — the real neutrality question in Ukrainian is not dialect but keeping
copy un-russified without tipping into archaizing purism. One script trap for fonts: the
Ukrainian-only letter **ґ/Ґ (U+0491/U+0490)** and the **apostrophe** are the glyphs a
"Russian-only Cyrillic" font silently omits.

Sources: <https://uk.wikipedia.org/wiki/Українська_мова> ·
<https://iul-nasu.org.ua/> (script/authority orientation — see §2 for verbatim) ·
<https://en.wikipedia.org/wiki/Ukrainian_language> (speaker range + sole-state-language status —
⚠ an estimate range, not a census count)

---

## 1. Header block

See above. One-line orientation: Ukrainian is an East-Slavic, free-word-order, LTR language written
in a 33-letter Ukrainian Cyrillic alphabet, with one codified literary standard (the 2019
*Український правопис*); the localization risks concentrate in **case morphology + vocative**,
**gender agreement**, **the ти/ви register**, and **russism-free neutral vocabulary** — not in
script, fonts, or direction.

Sources: evidence base as per the header-block footer above; full source inventory in §2.

---

## 4. Grammar for translators

**Word order.** Ukrainian is nominally **SVO** but **highly free** — the seven-case system marks
grammatical roles morphologically, so word order carries **topic/focus** (given information first,
new/emphasized information last). Do **not** preserve English order mechanically. ⚠ editorial /
standard-linguistics (no single authority fetched), but uncontroversial.

- ✅ Given→new: **Файл ви вже зберегли.** ("The file — you've already saved.")
- ❌ Mechanical English order forced as the only option, ignoring focus: **Ви вже зберегли файл**
  is fine as neutral order, but blindly fixing SVO everywhere flattens emphasis the source intended.

**Register / politeness — and the project's recorded choice.** Ukrainian distinguishes informal
singular **ти** from polite/plural **ви** (пошанна множина). Etiquette convention: "На «ви»
звертаємося при офіційних розмовах та під час спілкування з незнайомцями"; ти is for "друзі,
приятелі, родичі, діти, молоді люди одного віку." Capitalized **Ви** is reserved: it is written
"лише за шанобливого звертання до однієї особи … тільки у ділових документах або вітальних
листівках, запрошеннях чи ділових листах" — i.e. **personal formal letters, not running UI**.

> **Register decision (human-gate): ви (polite), lowercase — taken and recorded.** For a broad
> educational audience the default is **ви**, written **lowercase**
> in running UI and instructional text (capital **Ви** only for personal formal letters — invitations,
> greeting cards, business correspondence to one named person). ви reads as respectful and neutral to
> a broad adult readership. **ти is recorded as an *optional* warm peer-tone** for passages
> deliberately aimed at younger learners in a friendly voice — but pick ONE per surface and apply it
> consistently; no silent drift mid-flow. **Binding for all second-person copy** in `uk` and
> `uk-easy`: lowercase ви by default, ти only where a warm peer register is a deliberate editorial
> choice. (⚠ the "ти-for-edtech" convention is editorial, not an authority claim.)
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ Default UI: **Щоб продовжити, натисніть кнопку.** / **ви зберегли зміни** (polite, lowercase).
- ✅ Approved warm variant (whole surface): **ти зберіг / ти зберегла зміни** (peer tone — note the
  gendered past tense, see feature 3).
- ❌ Capital **Ви** in running UI: **Ви зберегли зміни** (reserved for personal formal letters —
  wrong register marker for a UI).

The grammar features that break a naive EN → UK translation:

**(1) Seven-case declension.** Ukrainian nouns, adjectives, and pronouns inflect for **seven cases**
(називний, родовий, давальний, знахідний, орудний, місцевий, кличний). English marks none of this.
One UI noun is **not** reusable across contexts:

- ✅ "Open the file" → **Відкрити файл** (accusative); "from the file" → **з файлу** (genitive);
  "in the file" → **у файлі** (locative).
- ❌ Reusing the nominative everywhere: **з файл**, **у файл** (ungrammatical — case not applied).

**(2) Vocative case (кличний відмінок) — the 7th case, mandatory for direct address.** Using the
nominative to address someone sounds foreign/rude. **Verbatim (uk.wikipedia reroute):** "Кли́чний
або зверта́льний відмі́нок чи вокати́в … непрямий відмінок, який позначає звертання до певної особи
чи предмета." Examples: друг → **друже**, пан → **пане**, Наталя → **Наталю**, Іван Петрович →
**Іване Петровичу**.

- ✅ **Вітаємо, дру́же!** (vocative).
- ❌ **Вітаємо, друг!** (nominative in direct address — reads as foreign/rude).

**(3) Gender & agreement.** Every noun is masculine / feminine / neuter, and adjectives, past-tense
verbs, and pronouns must agree. "It's ready" depends on the subject's gender: **готовий** (m) /
**готова** (f) / **готове** (n). Placeholders break: a past-tense verb must agree with the referent's
gender, so `{user} added` cannot be rendered word-for-word.

- ✅ Polite plural (gender-neutral in the plural): **ви зберегли** ("you saved").
- ✅ Singular ти, gender-matched: **ти зберіг** (m) / **ти зберегла** (f).
- ❌ `{user} додав` hard-coded masculine for an unknown-gender user → restructure or neutralize
  (e.g. impersonal **Зміни збережено** — "changes were saved", no gendered verb).

**(4) Verbal aspect (доконаний / недоконаний).** Verbs come in perfective/imperfective pairs;
English tense does not map 1:1. A button = **perfective** (complete the action); an in-progress /
habitual state = **imperfective**.

- ✅ Button "Save" → **Зберегти** (perfective); "Saving…" → **Збереження…** / progressive
  **зберігати** (imperfective).
- ❌ Using imperfective **зберігати** on a one-shot action button, or perfective **зберегти** for an
  ongoing "…ing" state — the wrong aspect makes UI copy feel off.

**(5) No articles + genitive of negation.** English "a/the" have no equivalent — **drop them**. And
negation often triggers the **genitive**:

- ✅ "I have no time" → **не маю ча́су** (genitive часу).
- ❌ **не маю час** (accusative after negation — ungrammatical calque from English).

Sources: <https://uk.wikipedia.org/wiki/Кличний_відмінок> (vocative — verbatim reroute) ·
etiquette/register summary (search-surfaced; underlying pages e.g. etyket.org.ua — ⚠ community-tier) ·
2019 *Правопис* (case system, aspect — codified norm, cited-not-quoted; §2) ·
word-order/aspect/negation framing ⚠ editorial / standard-linguistics

---

## 5. Numbers, dates, currency

Source: **CLDR `uk`** locale data — **verbatim / quote-grade** for separators and currency pattern.

**Digit system.** Western digits **0–9** throughout — Ukrainian uses no separate native digit set.

**Decimal separator — comma.** CLDR `uk` decimal separator = **`,`**.

- ✅ **3,14** · ❌ **3.14** (period-decimal is English, wrong for `uk`).

**Grouping — space, not comma or period.** CLDR `uk` group separator = **`" "`**, and §2 records it
by codepoint as the **no-break space U+00A0** so the number never wraps mid-value.

**U+00A0 and U+0020 are visually identical**, so this half of the rule can only be stated and
checked by codepoint — an ✅/❌ pair printing both would be byte-identical and would demonstrate
nothing. The examples below therefore write the entity, as the `pl` and `cs` guides do:

- ✅ **1&nbsp;000&nbsp;000** — separator is U+00A0.
- ❌ **1,000,000** (English) · ❌ **1.000.000** (German/other-European) — wrong character entirely.
- ❌ a plain **U+0020** between the groups: renders the same, but lets the figure wrap mid-number.

Where a template cannot carry an entity, emit the literal U+00A0 byte, and make sure no
whitespace-normalizing build step folds it back to U+0020. This sentence carries one literal
instance so the byte is present in this file and not merely named: **1 000 000**. It
is indistinguishable from a U+0020-separated figure by eye, by copy-paste into most editors, and in
every rendered view — which is exactly why the rule has to be stated and checked as a codepoint.

**Currency.** UAH — symbol **₴ (U+20B4)** or abbreviation **грн**. Per the CLDR standard pattern
**`#,##0.00 ¤`**, the symbol/abbreviation **follows the amount** with a space:

- ✅ **1&nbsp;250,00 ₴** · **1&nbsp;250 грн** (grouping separator U+00A0, as above).
- ❌ **₴1 250,00** (symbol-first — English placement) · ❌ **1,250.00 ₴** (English separators).

(⚠ the exact `symbol="₴"` / `displayName` mapping in `cldr-currencies uk` was not re-fetched
verbatim; **₴ = U+20B4** and the **postfix** placement follow directly from the `¤` position in the
verbatim pattern above.)

**Dates.** **Day-first, dot-separated: DD.MM.YYYY** — e.g. **25.07.2026**. The long form spells the
month in the **genitive**: **25 липня 2026 року** (not the nominative *липень*). Time is **24-hour,
colon-separated**: **14:30**.

- ✅ **25.07.2026** · **25 липня 2026 року** · **14:30**.
- ❌ **07/25/2026** (US month-first) · **25 липень 2026** (nominative month — must be genitive
  липня) · **2:30 PM** (12-hour am/pm is not the `uk` convention).

(⚠ the date/time patterns are stated from standard `uk` CLDR conventions; the `numbers.json` fetch
above confirms separators and currency verbatim, but `ca-gregorian.json` was **not** re-fetched
verbatim this session — treat **DD.MM.YYYY** and the genitive-month long form as reference-grade.)

### 5a. Plural categories — `uk` needs **four**, and a two-form build is wrong

**Verbatim from the pinned release** `cldr-core@48.2.0/supplemental/plurals.json`,
`plurals-type-cardinal → uk` — all four rules, character for character:

> `"pluralRule-count-one": "v = 0 and i % 10 = 1 and i % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …"`
>
> `"pluralRule-count-few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 @integer 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, …"`
>
> `"pluralRule-count-many": "v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14 @integer 0, 5~19, 100, 1000, 10000, 100000, 1000000, …"`
>
> `"pluralRule-count-other": "   @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"`

Read the sample lists, not just the rule text — they are the part that decides what an implementer
has to build:

| Category | Which counts land here | What the interface string needs |
|---|---|---|
| `one` | 1, 21, 31, 41, 101, 1001 — **but not 11** | nominative **singular** noun |
| `few` | 2–4, 22–24, 32–34, 102 — **but not 12–14** | the 2–4 form (nominative plural) |
| `many` | **0**, 5–19, 20, 25, 100, 1000 | **genitive plural** — and it is the form `0` takes |
| `other` | **decimals only** — the rule carries `@decimal` samples and **no `@integer` samples at all** | the fractional-count form (1,5 …) |

Three consequences a developer will hit:

1. **Four branches, not two.** `{n} lesson(s)` has no `uk` rendering. Wire counts through
   `Intl.PluralRules('uk')` / the framework's ICU plural selector and author all four messages.
2. **Zero is `many`, not `other`.** An empty-state string built on an English `other` branch
   ("0 lessons") gets the wrong Ukrainian noun form.
3. **`other` is unreachable from whole numbers.** A build that only fills `one` and `other` — the
   English shape — leaves every integer above 1 falling back to a decimal-only branch.

**Worked example — a counted noun in a course interface** (`урок` = lesson):

- ✅ `one` → **1 урок** · `few` → **2 / 3 / 4 уроки**, **22 уроки**, **34 уроки** ·
  `many` → **0 уроків**, **5 уроків**, **11 уроків**, **20 уроків**, **25 уроків** ·
  `other` → **1,5 уроку**.
- ❌ **2 урок** · ❌ **5 уроки** · ❌ **11 уроки** (11 is `many`, not `one`) · ❌ **0 уроків**
  emitted from an English `other` branch that also serves 2 and 5 · ❌ a hard-coded
  "1 урок(и)" bracket form.

⚠ The four Ukrainian word forms above are **standard grammar stated editorially**, not a fetched
dictionary paradigm — native-speaker confirmation pending, like the rest of the authored examples in
this guide. The **category boundaries** are not editorial: they are the verbatim rule text above.
The same three-way integer split is visible in shipped Ukrainian product UI — MediaWiki's `uk`
message file writes `category-article-count-limited` as
`У цій категорії {{PLURAL:$1|$1 сторінка|$1 сторінки|$1 сторінок}}.` (singular / 2–4 / genitive
plural), which is the `one` / `few` / `many` triple with the decimal-only `other` branch simply
absent from that message system.

**Ordinals are a separate rule set.** `cldr-core@48.2.0/supplemental/ordinals.json`,
`plurals-type-ordinal → uk`, gives `uk` **two** categories, not four:

> `"pluralRule-count-few": "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …"`
>
> `"pluralRule-count-other": " @integer 0~2, 4~16, 100, 1000, 10000, 100000, 1000000, …"`

So an ordinal label ("3rd lesson", "23rd attempt") must be selected with the **ordinal** rule set —
`Intl.PluralRules('uk', { type: 'ordinal' })` — and **must not** reuse the cardinal categories: the
memberships differ (3 is `few` as an ordinal, `few` as a cardinal too, but 2 is `few` as a cardinal
and `other` as an ordinal). ⚠ what the two ordinal branches mean morphologically is not stated here
— no grammar authority was fetched for it; only the selection rule is sourced.

Sources:
<https://www.unicode.org/cldr/charts/latest/verify/numbers/uk.html>
(decimal `,`, group ` `, pattern `#,##0.00 ¤` — verbatim) · ₴ = U+20B4 (Unicode) ·
date/time patterns ⚠ reference-grade `uk` CLDR convention (ca-gregorian not re-fetched) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> (all four `uk` cardinal rules —
verbatim, fetched from the pinned release) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/ordinals.json> (both `uk` ordinal rules —
verbatim) ·
<https://raw.githubusercontent.com/wikimedia/mediawiki/master/languages/i18n/uk.json>
(`category-article-count-limited` — verbatim, corpus-tier: shipped `uk` product UI, not a normative
source) · the four Ukrainian noun forms of *урок* ⚠ editorial (standard grammar, native review
pending)

---

## 6. Terminology strategy

**Loanword vs coinage.** Ukrainian AI/ML vocabulary is dominated by **native coinage / calque**
rather than raw loanword: "machine learning" → **машинне навчання** (native), "neural network" →
**нейронна мережа** (calque via нейрон). Raw transliterated internationalisms (алгоритм, дані,
модель) coexist. **Working rule: prefer the established native/calque term in body text**; a
transliterated loan (промпт, токен) is acceptable when the native form is unestablished, ideally
glossed on first use. Note the native purist alternative **«породжувальний»** exists alongside the
loan **«генеративний»**.

**Transliteration (slugs/identifiers).** For systematic Latin transliteration in slugs, search
indexes, and identifiers, use the **official 2010 Cabinet table** (§2, §3) — but **never** display
raw transliteration as user-facing text.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give target term + original + a short plain gloss, then
use the target term alone afterwards. Instantiated in Ukrainian:

> **нейронна мережа** (neural network) — обчислювальна модель, побудована шарами за зразком нейронів
> людського мозку. *(Then: **нейронна мережа** alone on every later mention.)*

(The Ukrainian term is sourced below; the explanatory clause is authored per the sandwich format,
not a sourced string.) Project coinages (C1) keep their original spelling and are owned by the
term-sheet, not this table.

**Where to settle a disputed term.** Ukraine has a **named national terminology authority** for this
field: the **Національний словник термінів зі штучного інтелекту (Словник ШІ 2.0)**, a
Ministry-linked dictionary explicitly aimed at unifying Ukrainian AI vocabulary (§2). **Route any
contested rendering to it before freezing the glossary** — in particular the pairs this table leaves
open (навчання/тренування, запит/промпт, генеративний/породжувальний). **⚠** Its entries were **not
fetched** for this guide, so **no row below is cited to it**; it is the authority to consult, not a
source already consulted.

**Seed field vocabulary (AI/ML).** Sourced rows carry a verbatim-quote citation; the rest are
**⚠ editorial** (established usage, no single fetched authority per row) — treat as *field usage* to
freeze in the project glossary, not canon.

| Concept (EN) | Ukrainian term | Type | Provenance |
|---|---|---|---|
| artificial intelligence | **штучний інтелект (ШІ)** | native | ✓ uk.wikipedia (verbatim: "Штучний інтелект (ШІ, штучний розум … AI) — це здатність обчислювальних систем виконувати завдання…") |
| machine learning | **машинне навчання (МН)** | native | ✓ uk.wikipedia (verbatim: "Маши́нне навча́ння (МН … machine learning, ML) — це галузь досліджень штучного інтелекту…") |
| neural network | **нейронна мережа / штучна нейронна мережа** | calque | ✓ uk.wikipedia (verbatim: "Породжувальні штучні нейронні мережі нещодавно змогли перевершити … багато попередніх підходів.") |
| deep learning | **глибоке навчання** | native | ✓ uk.wikipedia (title/lead) |
| generative AI | **генеративний ШІ / породжувальний ШІ** | loan+native | ✓ uk.wikipedia (native alt «породжувальний») |
| large language model | **велика мовна модель (ВММ)** | native | ⚠ editorial (established calque) |
| algorithm | **алгоритм** | loanword | ⚠ editorial (internationalism) |
| data | **дані** | native | ⚠ editorial |
| dataset | **набір даних** | native | ⚠ editorial |
| model | **модель** | loanword | ⚠ editorial |
| training (a model) | **навчання / тренування** | native/loan | ⚠ editorial (навчання preferred; тренування colloquial) |
| prompt | **запит / промпт** | native/loan | ⚠ editorial (both current; запит native, промпт loan) |
| chatbot | **чат-бот** | loanword | ⚠ editorial |
| supervised learning | **навчання з учителем** | calque | ⚠ editorial |
| deep neural network | **глибока нейронна мережа** | calque | ⚠ editorial |

Recommended default set: **штучний інтелект, машинне навчання, нейронна мережа, глибоке навчання**,
with the English abbreviation in parentheses on first use where useful.

Sources: <https://uk.wikipedia.org/wiki/Штучний_інтелект> ·
<https://uk.wikipedia.org/wiki/Машинне_навчання> · <https://uk.wikipedia.org/wiki/Глибоке_навчання>
(AI/ML/NN/DL definitions — verbatim) · remaining rows ⚠ editorial (established usage, per-row
authority not fetched) · terminology authority for escalation:
<https://www.tsatu.edu.ua/biblioteka/nacionalnyj-slovnyk-terminiv-zi-shtuchnoho-intelektu-slovnyk-shi-2-0-ai-dictionary-2-0/>
(⚠ named, entries not fetched — no row above rests on it)

---

## 7. Idiom anti-patterns

**Stock phrases of educational and technical writing (EN → UK): idiomatic form ✅ vs literal calque
❌.** These are the phrases that actually recur in course copy, UI help, and documentation. The table
arrived from a second research dossier whose per-row citations all pointed at a single general
encyclopedia article on the Ukrainian language — which does not evidence idiom equivalence. Rather
than ship that, **every row was taken back to a source**: **goroh.pp.ua** (which aggregates СУМ
tlumachennia, фразеологія, and a *Слововживання* layer drawing on «Мова – не калька», Voloshchak's
*Довідник з українського слововживання*, OnlineCorrector, and *Уроки державної мови*),
**r2u.org.ua** (Вирган–Пилинська 1959; Кримський–Єфремов 1924–33), and Ukrainian Wikipedia as
corpus. The tier column records what was found. **Only `dictionary` and `advice` rows may inform a
§11 check**; `corpus` rows evidence usage, not prescription.

| # | English phrase | ✅ Idiomatic Ukrainian | ❌ Literal calque (avoid) | ✅ tier |
|---|---|---|---|---|
| 1 | step by step | **крок за кроком** | ~~крок по кроку~~ — **rare, not wrong**: 2 corpus hits against 378 | **dictionary** |
| 2 | at a glance | **з першого погляду** | ~~на один погляд~~ — ⚠ craft | **dictionary** |
| 3 | keep in mind | **майте на увазі** | ~~тримайте в голові~~ — a ruling exists, but the same handbook endorses it elsewhere | **advice** + corpus |
| 4 | make sure | **переконайтеся** | *(none — see below)* | corpus (instructional) |
| 5 | for example | **наприклад** | *(none — see below)* | universal |
| 6 | in practice | **на практиці** | ~~в практиці~~ — **a different construction**: it takes a genitive (*в практиці НКВД* = "in the practice of…") | **dictionary** |
| 7 | on the other hand | **з іншого боку** | ~~з іншої сторони~~ — **documented, verbatim ruling** | **advice** |
| 8 | back and forth | **туди-сюди** | ~~взад і вперед~~ — **documented, verbatim ruling** | **advice** |
| 9 | one by one | **по одному** | ~~один за другим~~ — **documented, two handbooks** | **advice** |
| 10 | as soon as possible | **якнайшвидше** | ~~як можна швидше~~ — **documented, three stacked rulings** | **advice** |
| 11 | under the same roof | **в одному місці** (plainer) · **під одним дахом** (also fine for institutions) | *(none — see below)* | **dictionary** + corpus |

Rows 3 and 4 are already in the **ви** imperative, which matches the register decision in §4; keep
them that way and do not swap in ти-forms.

Worked example for this platform: "Read step by step" → **Читайте крок за кроком**, not a rendering
that preserves the English word order.

**The ✅ column, sourced.** Quotes are verbatim from the URLs in the Sources footer; corpus counts
are Ukrainian Wikipedia articles:

- **крок за кроком** — the фразеологія entry for *крок* glosses it "Дуже повільно, помалу" and
  "Поступово, у певній послідовності", with the literary example "Марта почала розповідати. Крок за
  кроком, слово за словом, нічого не приховуючи. (В. Собко)". The 1959 Russian–Ukrainian phrase
  dictionary gives it as the rendering of *шаг за шагом*: "ступінь по ступеню, ступінь за
  ступ(е)нем; крок за кроком". 378 corpus hits; government press uses it in headlines.
- **з першого погляду** — СУМ via goroh: "З пе́ршого по́гляду … (у знач. присл.) Спочатку, при
  першому враженні, одразу ж." 521 corpus hits. ⚠ **Do not substitute *на перший погляд*** — it is
  four times commoner but means "seemingly, superficially", which is wrong for a UI that shows
  everything at a glance. That distinction is more useful than the ❌ cell beside it.
- **майте на увазі** — the *Слововживання* layer lists *мати на увазі* among the recommended forms
  ("Правильніше: брати до відома (до уваги, на замітку, на розум) … мати на увазі"). 490 corpus hits
  for the infinitive, 40 for the ви-imperative, in exactly this register — "Майте на увазі, що
  підсумки можуть змінюватися залежно від рівня продуктивності".
- **переконайтеся** — corpus only, but squarely on register: 60 hits, overwhelmingly numbered
  step-by-step instructions — "Переконайтеся, що кінцевий продукт містить якомога більше вихідних
  матеріалів"; "Переконайтеся в тому, що ви підключилися до системи…".
- **на практиці** — the 1924–33 academic Russian–Ukrainian dictionary gives "досві́дчити на
  пра́ктиці". 4761 corpus hits.
- **з іншого боку** — 7359 corpus hits, and it is the *prescribed* form (see the ruling below).
  ⚠ A minority prescriptivist line (*Уроки державної мови*) prefers *з другого боку* in explicit
  enumerations (*з одного боку… з другого боку*); noted, not adopted.
- **туди-сюди**, **якнайшвидше**, **по одному** — each is the right-hand (recommended) side of a
  usage-handbook ruling; see below. 172 / 776 / 4540 corpus hits.
- **під одним дахом** — СУМ via goroh has only the literal sense ("В одному будинку, в одній
  квартирі"), but 336 corpus hits include the institutional/figurative use in fully edited prose:
  "Внутрішні, глобальні та онлайнові підрозділи розташовані під одним дахом, у Будинку Бі-бі-сі";
  "будівництво терміналу за принципом «усе під одним дахом»". The earlier restriction — "correct
  only where a literal shelter is meant" — is refuted by that corpus and has been dropped.

**Four ❌ cells were upgraded from invented strawmen to real, citable rulings.** This is the
strongest result of the pass: the ✅ column did not change, but the warnings now point at errors
Ukrainian usage handbooks actually record.

- **Row 7** — the old ❌ was *на іншій руці*, whose only two corpus hits are literal anatomy
  ("загинався один палець на іншій руці"). The documented error is *з іншої сторони*, with a
  verbatim ruling: "Оскільки іменники бік і сторона не є взаємозамінними синонімами в усіх
  значеннях, замініть вставну конструкцію з іншої, другої сторони на стилістично кращу: з іншого
  боку. **НЕ РЕКОМЕНДОВАНО:** З іншої сторони, треба дивитися на можливі наслідки.
  **РЕКОМЕНДОВАНО:** З іншого боку, треба дивитися на можливі наслідки."
- **Row 8** — the old ❌ was *назад і вперед*, which is the **prescribed** form ("узад і вперед
  Правильніше: назад і вперед; туди й сюди") and appears in 39 legitimate corpus hits. The real
  documented error sits one letter away: *взад і вперед* → "Ходити сюди й туди (туди-сюди; з кутка
  в куток)".
- **Row 9** — the old ❌ was *один за одним*, which two separate handbooks **prescribe** ("один за
  другим Правильніше: один за одним; один по одному"). The documented error is *один за другим*.
  ⚠ Note also that *по одному* ("one at a time") and *один за одним* ("one after another") are
  different senses, not competitors.
- **Row 10** — the old ❌ was *настільки скоро, наскільки можливо*, with one unrelated corpus hit.
  The documented error is *як можна швидше*, and the ruling names this row's ✅ as the correction:
  "як можна швидше Правильніше: якнайшвидше, щонайшвидше; якомога швидше". Two more rulings stack
  on it ("як можна скоріше…", "чим можна швидше…"). This is the only fully closed ✅/❌ pair in the
  table — the ✅ *is* the prescribed repair of the ❌.

**Two ❌ cells were removed, because they condemned prescribed Ukrainian or nothing at all.**

- **Row 5 was the worst.** The old ❌ *для прикладу* is a СУМ-registered set phrase (listed under
  *приклад* among "взяти приклад … для прикладу за прикладом до прикладу"), it is **prescribed** by
  the antisurzhyk handbook — whose entry runs "наприклад, приміром Правильніше: скажімо; візьмімо;
  для прикладу", i.e. it puts this guide's ✅ on the left and this guide's ❌ on the recommended
  right — and it has 760 corpus hits, including the article «Українська мова» itself. Both forms are
  good Ukrainian. The softening clause was not merely doing work; it was pointing the wrong way.
- **Row 4** — the old ❌ *зробіть впевнено* returns **zero** corpus hits and appears in no handbook.
  It is a word-by-word gloss no speaker produces. Two plausible real substitutes were tested and
  neither is an error either (*будьте впевнені* is attested only in the "rest assured" sense;
  *впевніться* is a legitimate variant), so no replacement was invented and the cell is empty.

**Row 1 was reworded rather than removed, and the reason matters.** *Крок по кроку* has no ruling
against it anywhere — zero occurrences in «Мова – не калька», no *Слововживання* entry — and the
Russian-interference story is not available, because the Russian source phrase is *шаг за шагом*,
which maps onto the **✅**, not the ❌. The `X по X-у` pattern is itself native and prescribed
(*ступінь по ступеню*, *один по одному*). What is true is the frequency gap: 2 corpus hits against
378. The cell now says that.

**⚠ Two source cautions a later editor must not lose.**

1. **«Мова – не калька» is not an error list.** Its columns are headed «Так кажуть…» (left) and
   «А ми радимо так…» (right), and the book's own blurb says its entries are "самобутні українські
   слова та вислови, **поставлені на противагу звичному (буденному) словниковому запасу** сучасних
   українців". The left column therefore contains ordinary correct words. **Left-column membership
   proves only that a more colorful native alternative exists — never that a form is an error.**
   Every ❌ ruling quoted above is right-column (endorsement) or an explicit `Правильніше:` /
   `НЕ РЕКОМЕНДОВАНО` line.
2. **Row 3's ruling is self-contradicted.** *тримати в голові* does carry "Правильніше: мати на
   думці" — but the same handbook's right column, under *Тримати в пам'яті*, recommends "тримати в
   голові що", and the phrase is live in edited prose ("необхідність тримати в голові вміст стеку").
   Treat it as the idiomatic-choice note the row now makes, not as a hard error.

**Under the hood — a register note, not a calque row.** The earlier table carried this as a row with
an empty ❌ cell, which teaches nothing about calques and invites a future editor to invent one.
It is moved here: use **всередині** in plain prose; **під капотом** is genuinely idiomatic in
Ukrainian technical writing, now corpus-confirmed — "Зміни під капотом включають міграцію на новий,
повністю апаратно прискорений графічний…" (KDE Plasma 5); "Під капотом процесне заміщення має два
шляхи виконання." Most of the 225 total hits are literal automotive; the figurative technical seam
is smaller but real. No calque exists to record against it.

**⚠ Apostrophe encoding when re-checking these sources.** The print handbook and government press
use the typographic apostrophe **’ (U+2019)** exclusively; the two dictionary **websites**
(goroh.pp.ua, r2u.org.ua) emit ASCII **' (U+0027)** throughout. That is a web-encoding artifact of
those sites, **not** an orthographic norm — this guide's §3 rule stands. Normalize their ASCII
apostrophes to ’ (U+2019) when quoting them (affects e.g. пам’яті, обов’язковий).

**General idioms — retained from an earlier revision, all ⚠ editorial.** A course translator will
rarely need them, but they are sound and worth keeping to hand: *it's raining cats and dogs* →
**ллє як з відра** · *piece of cake* → **раз плюнути** / **простіше простого** · *break a leg!* →
**ні пуху ні пера!** · *kill two birds with one stone* → **одним пострілом двох зайців** ·
*let the cat out of the bag* → **проговоритися** / **вибовкати**. (The earlier table also carried
*the ball is in your court* → *слово за тобою*, which is a **ти**-form and contradicts the guide's
own ви register — use **слово за вами** instead, or drop the phrase.)

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Beyond stock phrases, keep the **grammatical-level literal-transfer anti-patterns** (re-derived from
§4):

- ❌ **Nominative in direct address** → ✅ **vocative** (друже, not друг).
- ❌ **Reusing one noun case across UI contexts** → ✅ case per context (файл / з файлу / у файлі).
- ❌ **Accusative after negation** (не маю час) → ✅ **genitive of negation** (не маю часу).
- ❌ **Hard-coded gendered past-tense placeholder** (`{user} додав`) → ✅ restructure / impersonal
  (Зміни збережено).
- ❌ **English articles kept** (a/the) → ✅ dropped.

Sources: <https://britishskylines.com.ua/idiomy-v-anglijskij-movi/> (idioms-are-non-literal
principle — sourced) · **✅- and ❌-column attestations, each fetched and quoted above** —
<https://goroh.pp.ua/Фразеологія/крок> · <https://goroh.pp.ua/Фразеологія/погляд> ·
<https://goroh.pp.ua/Фразеологія/дах> · <https://goroh.pp.ua/Тлумачення/приклад> ·
<https://goroh.pp.ua/Слововживання/мати на увазі> ·
<https://goroh.pp.ua/Слововживання/тримати в голові> ·
<https://goroh.pp.ua/Слововживання/для прикладу> ·
<https://goroh.pp.ua/Слововживання/з іншого боку> (the verbatim
НЕ РЕКОМЕНДОВАНО / РЕКОМЕНДОВАНО ruling, row 7) ·
<https://goroh.pp.ua/Слововживання/назад і вперед> · <https://goroh.pp.ua/Слововживання/туди-сюди>
(rows 8) · <https://goroh.pp.ua/Слововживання/один за одним> (row 9) ·
<https://goroh.pp.ua/Слововживання/якнайшвидше> (the three stacked rulings, row 10) ·
<https://r2u.org.ua/s?w=шаг+за+шагом&scope=all&dicts=all&highlight=on> (Вирган–Пилинська 1959) ·
<https://r2u.org.ua/s?w=на+практике&scope=all&dicts=all&highlight=on> (Кримський–Єфремов 1924–33) ·
«Мова – не калька» (Береза / Зубрицька / Зелений, Апріорі 2015) read as full text from
<https://files.znu.edu.ua/files/Bibliobooks/Inshi72/0043860.pdf> — **read its two columns per the
caution above** · corpus counts and examples from `uk.wikipedia.org` and
<https://ukurier.gov.ua/uk/articles/krok-za-krokom/> (corpus tier — edited Ukrainian prose, **not**
a normative source) · the rows themselves came from a second research dossier whose only per-row
citation (<https://en.wikipedia.org/wiki/Ukrainian_language>) is a general language article and does
not evidence idiom equivalence · the retained general idioms are still
native-speaker-equivalent judgment — native-speaker confirmation pending for every row ·
grammar-level anti-patterns re-derived from §4 · fetch failures, for the record: **sum.in.ua**
(connection refused), **ukrlit.org** (connection refused), **sum20ua.com** (HTTP 403), and
`uk.wiktionary.org` has no *крок за кроком* page; **developer.mozilla.org has no `uk` locale at
all**, so no MDN corpus evidence is claimed anywhere in this section

---

## 8. Simplified-language pendant (`uk-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: for Ukrainian, the measurement is a negative result, and that is the
finding.** In most guides in this kit §8c counts a plain-register corpus against a standard one and
the count overturns rows of the word table. **Here it cannot.** No Ukrainian plain-register
publication could be located that is both reachable and collectable, so **nothing in this section
is corpus-backed**. The consequence has to be stated plainly rather than papered over: §8b's word
table is **editorial throughout**, §8d contains **no measured reversals**, and §8e rests on the
register decision §4 already recorded, not on evidence gathered here.

**Keep two findings apart, because the sources support only one of them.** *Ukrainian plain-language
activity exists but is not codified* and *no Ukrainian plain-language standard exists* are different
statements. The sources below support the **first**. There is real, state-adjacent plain-language
work — a civil-service course, a government communication series, an academic study — and there is
**no codified norm with quantitative thresholds** issued by anyone. Collapsing the two would throw
away the evidence this section actually has.

### 8a. The standard question — activity exists, and it is not codified

**Tradition — but no single binding state standard.** There is **no binding legal plain-language
standard** for Ukrainian equivalent to a law, but a **«проста мова» (plain language) tradition
exists and is actively growing**, promoted through government and NGO channels:

- **Дія.Освіта** (government platform) runs plain-language training — course "Plain Language for
  Complex Topics." <https://osvita.diia.gov.ua/courses/plain-language-for-complex-topics>
- **Cabinet of Ministers** promotion — the series «Просто мовою про складне» on accessible public
  communication («Проста мова — сильна держава»).
  <https://www.kmu.gov.ua/news/prosta-mova-sylna-derzhava-na-diiaosvita-ziavyvsia-serial-pro-dostupnu-publichnu-komunikatsiiu>
- **Academic grounding** (term «зрозуміла мова» / plain language) — NISS study.
  <https://niss.gov.ua/sites/default/files/2016-12/language-35506.pdf>
- **Practical NGO tipsheet (Ukrainian)** — «Що таке проста мова?» (⚠ PDF non-textual on fetch;
  title/existence confirmed via search — tips: short sentences, everyday words, active voice, one
  idea per sentence).
  <https://clearglobal.org/wp-content/uploads/2022/12/CLEAR-Global-What-is-plain-language-tipsheet-Ukrainian.pdf>

**The state language body, and what it is not.** Ukraine has a **National Commission for State
Language Standards** (`mova.gov.ua`), reached during the §8c scouting: the host answers, and it
permits automated collection. ⚠ **What it does not carry is a plain-language rule set.** The probe
found an **orthography and language-policy body** with no article archive at any reading level and
no plain-language norm published on it. Cite it, if at all, as the state standards body for the
language — **never** as the source of a Ukrainian plain-language standard, because none was found
there. (This is a different body from the **Ukrainian National Orthography Commission** recorded in
§2; do not merge the two.)

**⚠ Honest note.** Ukrainian plain language **lacks the quantitative, legally-mandated metrics** of
codified traditions elsewhere in this kit; the tradition is **younger and guidance-based** (respect,
clarity, accessibility) rather than rule-metric-based. Separately, **«Легке читання»** /
accessibility for cognitive disability is emerging but **not yet a codified national standard**.
This negative claim is editorial synthesis of the sources above.

**How `uk-easy` relates to the kit's base rules.** Because Ukrainian contributes **no quantified
national pendant**, `uk-easy` **inherits the kit's base simplified-language rules directly** — from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md): one
idea per sentence; the kit's own ~8–12-word working target (the kit's figure, **not** attributable to
a Ukrainian norm); simple structure (respecting Ukrainian's free word order — put given information
first); no stacked hard structures; everyday words; say what *is*, not what *isn't*; the same word
for the same thing; numbers as digits (Western 0–9, comma decimal, space grouping per §5); a one-line
"what is this" opener; and a consistent, literal tone (avoid irony and unexplained metaphor). The
Ukrainian-specific overlays: **hold the recorded ви register steadily** (§4) — no drift to capital Ви
or, if a warm ти surface was chosen, no mid-flow switch; and **prefer native everyday words over both
русизми and over-purist archaisms** (§9).

**Term-preservation (restated, binding).** In `uk-easy`, **keep the technical term and explain it** —
never swap in a folksy stand-in. Use the same Ukrainian term as the base variant, then "це
означає: …", then a concrete example (e.g. keep **нейронна мережа**, then explain it in plain
Ukrainian).

### 8b. Name the axis — «просто» against «складне», and what is sourced about it

**The axis the tradition names for itself is plain-against-complex public communication, and it is
stated structurally, not lexically.** The government series carries the axis in its own title —
«Просто мовою про складне», *plainly, in language, about the complex* — and the accompanying framing
is «Проста мова — сильна держава». That is the direction `uk-easy` runs, named by the tradition
rather than by this guide.

**What the tradition says the plainer pole looks like** is the tipsheet's four rules, and they are
**four structural rules plus one lexical one**: short sentences · everyday words · active voice ·
one idea per sentence. ⚠ These are recorded here at **title-and-summary level**: the PDF came back
non-textual on fetch, so its running text has never been read into this guide, and no sentence,
worked example, or numeric threshold from it may be quoted. What survives is the shape of the advice,
which matches the kit's base rules and is why §8f leans on structure first.

**⚠ The lexical axis is asserted, not sourced.** The word table below runs an
**officialese-to-everyday** axis, and **no Ukrainian authority cited in this guide names that axis or
supplies these pairs.** Two of the four tipsheet rules (active voice, everyday words) point in its
general direction; nothing cited goes further. Read the table as a candidate list under a
plausible axis, not as a tradition's own inventory.

**Complex → everyday word table** (⚠ editorial — native-speaker register judgment, not a single
fetched authority; use as a candidate list a native speaker validates). **Every row is craft.** No
row carries a dictionary gloss, a norm, or a count; §8d records which kinds of row are least safe.

| Complex / formal | Everyday | Provenance |
|---|---|---|
| здійснювати | робити | ⚠ craft — unattested |
| застосовувати | використовувати / вживати | ⚠ craft — unattested |
| з метою | щоб | ⚠ craft — unattested |
| у зв'язку з | через | ⚠ craft — unattested |
| надати можливість | дозволити | ⚠ craft — unattested |
| отримати | дістати / одержати | ⚠ craft — unattested |
| скасувати | відмінити | ⚠ craft — unattested |
| функціонувати | працювати | ⚠ craft — unattested |
| ідентифікувати | розпізнати / впізнати | ⚠ craft — unattested |
| модифікувати | змінити | ⚠ craft — unattested |

### 8c. Measure the axis — the honest negative, and exactly how far it reaches

**What was sought.** The design this kit uses elsewhere: **one publisher, two editions of the same
material**, one standard and one plainer, so that register is the only thing that differs. Failing
that, any standalone graded corpus of Ukrainian at a stated reading level. **Neither was found**, so
no Ukrainian count exists and none is reported below. There are **no frequencies, no sentence
lengths and no corpus sizes** in this section, because none were produced.

**Two different reasons a candidate failed, and they must not be blurred.**
**(i) No plain-language publication exists there** — the host is reachable and collectable, but
carries nothing written at a plainer reading level. **(ii) The publisher declines automated text
collection** — the material may well exist, but the publisher's answer to an automated request is
no. **(ii) is a publisher's position, and this guide records it as settled, not as an obstacle to
be worked around.** Nothing in this section may be read as a route past it.

| Candidate | Outcome | Which reason |
|---|---|---|
| `mova.gov.ua` — National Commission for State Language Standards | reachable, collection permitted; an orthography and language-policy body, no article archive at any reading level | **(i)** |
| `suspilne.media` — Ukrainian public broadcaster, the obvious place to look for a plainer public-service edition | automated requests are refused at the edge, before any collection policy is even served | **(ii)** |
| `barabooka.com.ua` — «Простір української дитячої книги», a real and active portal about Ukrainian children's books | reachable, collection permitted, enumerable — but the writing is **adult-register reviews and articles *about* children's books**, not graded text itself | **(i)** |
| `chytomo.com` — publishing-industry culture portal | reachable; adult-register writing about books, same as above, and its enumeration paths are closed | **(i)** |
| `vsviti.com.ua` | a general entertainment site with no relation to reading-level grading | **(i)** |
| `barvinok.in.ua`, `sonyashnyk.com.ua` | **false leads from domain guessing** — both resolve, but to an unrelated small web app and to a private kindergarten, not to the children's magazines whose names they echo | — |
| `kazkar.com.ua` | unusable: the connection fails at the transport layer | — |
| `prostomova.gov.ua`, `prostomova.com`, `pluska.ua`, `dytpalitra.com.ua`, `chytariki.com.ua`, `ijemchuzhyna.com`, `dyvoslovo.com`, `childrensmagazine.com.ua` | **do not resolve at all** — no such hosts | — |
| **«Барвінок»** — the classic children's monthly, searched for and traced 2026-07-29 | **the magazine ceased publication in 2019** and `barvinok.info` is now a **parked domain offered for sale**; its back issues sit in a state literary archive and, separately, as DjVu page scans on a hobbyist mirror. Not a live publication and not a text corpus | **(i)** |
| **«Пізнайко»** | live as a brand: `posnayko.com` redirects to `shop.posnayko.com`, a **storefront** selling the printed magazine. No free readable article archive | **(i)** |
| **«Джміль»** — `jmil.com.ua` | live, HTTP 200, and its collection policy is a bare `User-agent: *` with **no restrictions of any kind**. But the site is a **magazine portal**: covers, rubric teasers, MP3s, subscription links across ~80 issues (2013–2024) — **no full running text** | **(i)** |
| **`naiu.org.ua`** — National Assembly of People with Disabilities of Ukraine | **HTTP 200, collection permitted** (its `robots.txt` carries a `Sitemap:` line and nothing else). It publishes pages **explicitly marked «у форматі легкого читання»** *and* ordinary standard-register news on the same domain — i.e. the same-publisher shape this design wants. ⚠ **Not sized**: the sitemap index it advertises returns 404, so enumeration was not solved in this pass | **lead, verified permitted, unsized** |
| **`inclusion-ukraine.com`** — Inclusion Ukraine, «Легко читати (ФЛЧ)» | **HTTP 200, collection permitted** (`Disallow: /wp-admin/` only), and **enumerable**: a sitemap index with 14 sub-sitemaps, including a dedicated **`etr_legislation`** content type. ⚠ **Small**: 88 posts, 9 pages, 6 ETR-legislation items. Too thin to be a corpus by itself; the right size for the paired-rewrite experiment | **lead, verified permitted, small** |

**✅ The weakness this section declared has been closed by a second pass with search available
(2026-07-29), and the negative survived it — but its shape changed.** The first pass ran out of
search budget and probed domains from recall, which the two false leads above show was actively
misleading. The three named gaps have now been checked directly: **«Барвінок» is defunct and its
domain is parked, «Пізнайко» is a storefront, «Джміль» is a portal without full text** — three
independent reason-**(i)** findings, each with an HTTP status and a collection policy read from the
file. **Ukraine's classic children's press does not yield a corpus**, and that is now a searched
result rather than an unsearched one.

**What the search did turn up is a different shape entirely.** Ukrainian easy-language publishing
is not in the children's press; it is in the **disability sector**, under the name **«формат
легкого читання» (ФЛЧ)**, and two of its publishers permit collection outright. Neither is large
enough to be a corpus on its own. **One of them publishes easy-read rewrites of legislation** —
which is not a children's-book pair at all but the **administrative-text-against-its-own-rewrite**
design, the one pairing that could put an official plain-language wordlist in range. Sized and
recorded in the table above; §8g item 1 now points there.

**⚠ What is still unsearched:** a post-2022 government «проста мова» publishing program, and
whether the ФЛЧ publishers' standard-register siblings are large enough to pair against.

**What follows for the rest of §8.** With no corpus: §8b's table stands unmeasured and unrefuted;
§8d may not report a single measured reversal; §8e's address decision cannot be checked against
usage; and §8f must take its leverage from structure and from §4, which is where the sourced
material is.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none may be invented to fill the gap.** What this list can
do is separate the sourced from the unsourced, and carry in one caution established across the
languages in this kit that *were* measured.

| Do **not** do this | Why |
|---|---|
| ~~cite any row of the §8b table as sourced~~ | **All ten rows are ⚠ craft.** No Ukrainian authority in this guide supplies them and no count tests them. Use them as candidates a native speaker validates, and never quote the guide as their authority. |
| ~~assume the learned or borrowed word is the harder one~~ | ⚠ **Cross-language caution, not a fact about Ukrainian.** Across the languages in this kit where a count *was* possible, the learned or borrowed member of a pair turned out **not to be reliably the harder one**, and a confident "simplification" repeatedly swapped a common word for a **rarer** one. Ukrainian has no count, so this is imported as a **caution requiring local verification** — it hits the borrowing-to-native rows hardest (*функціонувати → працювати*, *ідентифікувати → розпізнати*, *модифікувати → змінити*), where the borrowing may well be the word the reader meets more often. |
| ~~treat a near-synonym swap as a simplification~~ | ⚠ craft. Rows like *отримати → дістати / одержати*, *скасувати → відмінити* and *застосовувати → використовувати* replace one word with another of the **same register family and comparable length** — *використовувати* is the **longer** string of its pair. Without a count there is no evidence a reader gains anything, and §9's rule applies before any of them: prefer native everyday words over both русизми and over-purist archaisms. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **нейронна мережа**, then "це означає: …", then a concrete example. Explaining a hard word is safer than replacing it — and with no corpus, it is the only lexical move here that rests on a stated rule rather than on judgment. |
| ~~simplify by word length alone~~ | Nothing in the cited Ukrainian material licenses it, and no long-word measurement exists for Ukrainian. The sourced advice is **structural** — short sentences, one idea, active voice (§8b) — which shortens sentences as a by-product without betting on individual words. |
| ~~read §8c as proof that no Ukrainian plain-register source exists~~ | It is proof that **none was found without a search**, over a probe list that included two demonstrable false leads (§8c). The classic children's press was never checked. Downgrading "not found" to "does not exist" would license inventing a substitute. |
| ~~work around the one publisher that refuses automated collection~~ | `suspilne.media` refuses automated requests, and that is **the publisher's position** (§8c). It is recorded as settled. Do not treat it as a technical problem with a technical answer. |

> **→ The rule that follows.** For Ukrainian, **the leverage is structural and the word table is a
> hypothesis.** Apply §8b's four structural rules and the kit's base rules with confidence; apply
> every lexical row as a hint a native speaker confirms; and never present a §8b row to a reviewer
> as though a Ukrainian authority stood behind it.

### 8e. 🔑 The address decision — `uk-easy` keeps lowercase **ви**, on §4's convention grounds

> **Decision, recorded so that nobody "fixes" it: `uk-easy` uses lowercase `ви`, exactly as `uk`
> does (§4). It does NOT switch to `ти` for "friendliness", and it does NOT capitalize `Ви`.**

- ✅ `uk-easy`: **Щоб продовжити, натисніть кнопку.**
- ❌ Capital Ви in running UI: **Ви зберегли зміни** (reserved for personal formal letters)

**The grounds are §4's, and they are convention, not evidence.** §4 records **ви**, lowercase, as a
human-gated project decision binding for all second-person copy in `uk` and `uk-easy`, on etiquette
convention: ви for official conversation and strangers, ти for friends, relatives, children, and
peers of the same age; capital **Ви** reserved for business documents, greeting cards, invitations,
and letters — **not running UI**. §4 also records honestly that the warm-ти option for a young
audience is **editorial, not an authority claim**. Nothing in §8 strengthens or weakens any of that;
the decision is carried over as recorded. ⚠ Say plainly what tier this is: **convention, plus a
project decision taken on it.** There is no Ukrainian ruling to appeal to, and this section did not
find one.

**⚠ The measurement cannot answer this question, in either direction** — there is no measurement
(§8c). And the one shortcut that would have been available is the one to refuse: reading a
**children's** publication's *ти* as evidence about `uk-easy`. Across the measured languages in this
kit, address was found to track **the reader's age, not the text's difficulty**; importing a
children's register into an adult easy-read variant imports exactly the condescension the variant
exists to avoid. **`uk-easy` addresses adults who read with difficulty, and the register stays ви.**

**⚠ One lead, recorded as a lead and not as a datum.** The NGO tipsheet cited in §8a is reported to
devote a page to Ukrainian with four numbered rules and a worked complex-to-everyday pair, and its
model sentence is reported to keep the formal address form — which, if read, would be the one piece
of *evidence* this subsection has rather than convention. **It has not been read here:** the PDF came
back non-textual on fetch (§8a), so no sentence from it is quoted and its address form is **not
asserted** as a finding. A later pass that extracts the text can promote this from a lead to a datum;
until then §8e stands on §4.

### 8f. What `uk-easy` is built on, in order of leverage

1. **Sentence structure — the main lever, and the only one with Ukrainian material behind it.** The
   tipsheet's rules as rewrite rules (§8b): short sentences · one idea per sentence · active voice.
   ⚠ Recorded at summary level only — the PDF was not read as text — so apply them as advice that
   matches the kit's base rules, not as a quotable Ukrainian norm.
2. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), inherited unchanged because Ukrainian
   contributes no quantified national pendant (§8a) — including the kit's own ~8–12-word working
   target, which is **the kit's figure and not attributable to any Ukrainian source**.
3. **Term preservation before substitution** — keep the technical term, then "це означає: …", then
   an example (§8a). With no dictionary evidence and no corpus, explaining a hard word is the safest
   lexical move available in Ukrainian.
4. **The ви register (§4), held steadily** (§8e), and Ukrainian's free word order used deliberately:
   **given information first** (§4), which is the structural edit that most often makes a Ukrainian
   sentence land on first reading.
5. **Vocabulary substitution last, and flagged as craft throughout** — §8b's rows are candidates,
   §8d says which kinds are least safe, and a native-speaker pass is a prerequisite, not a polish.
6. **The state-adjacent training material is context, not a rule set** (§8a). The course, the
   government series and the NISS study establish that `uk-easy` is not writing into a vacuum; none
   of them supplies a threshold, and `uk-easy` must never be described as conforming to any of them.

### 8g. What is still open

1. **The corpus that would settle this.** What is needed is a **single Ukrainian publisher issuing
   the same material in a standard and in a plainer edition** — the design used elsewhere in the
   kit, which removes the publisher, genre, and topic confounds in one move. Failing that, in
   descending order of usefulness: an **adult** easy-read Ukrainian corpus of any size at a stated
   reading level; a register pair from one institution (regulatory prose against that body's own
   public explainer); a graded children's corpus, which would be usable only for structure and
   **never** for address (§8e). Any of these makes §8b testable; without one, every lexical row
   stays a hypothesis.
2. **The search has been run** (2026-07-29) and the classic children's press is settled: «Барвінок»
   defunct, «Пізнайко» a storefront, «Джміль» a portal without running text (§8c). **Do not probe
   those three again.** What replaced that item is more specific and more promising: **size the two
   ФЛЧ publishers' standard-register siblings** (`naiu.org.ua` publishes both registers on one
   domain; its advertised sitemap index 404s, so enumeration is the open work), and **pair
   `inclusion-ukraine.com`'s easy-read legislation items against the legislation they rewrite** —
   six items is small, but it is the only Ukrainian pairing found that holds institution and topic
   constant. A post-2022 government «проста мова» publishing initiative is still unsearched.
3. **The tipsheet PDF has never been read as text.** It is reported to carry four numbered rules and
   a worked complex-to-everyday pair with a model sentence in the formal address form. Extracting it
   would add the only Ukrainian-specific evidence §8b and §8e could have (§8e).
4. **The word table has not had a native-speaker pass.** All ten rows are ⚠ craft; the axis itself is
   asserted (§8b). This is the single largest editorial debt in the section.
5. **The state standards body carries no plain-language rule set** that this work could find (§8a).
   Whether one is in preparation is unknown, and worth re-checking.
6. **«Легке читання» is not codified.** Whether an easy-read norm for cognitive accessibility is
   emerging in Ukraine, and under whose authority, was not established.
7. **No comprehension evidence exists for any of this.** Nothing here has been tested on readers.
   Whether the recommended forms are actually *understood* better by the `uk-easy` audience was not
   established.

Sources: <https://osvita.diia.gov.ua/courses/plain-language-for-complex-topics> ·
<https://www.kmu.gov.ua/news/prosta-mova-sylna-derzhava-na-diiaosvita-ziavyvsia-serial-pro-dostupnu-publichnu-komunikatsiiu> ·
<https://niss.gov.ua/sites/default/files/2016-12/language-35506.pdf> ·
<https://clearglobal.org/wp-content/uploads/2022/12/CLEAR-Global-What-is-plain-language-tipsheet-Ukrainian.pdf>
(existence and title confirmed; ⚠ PDF non-textual on fetch — never read as running text) ·
complex→everyday pairs ⚠ editorial, every row craft (§8b) ·
**Corpus (§8c) — none.** No Ukrainian plain-register corpus was built, so this section reports no
frequency, no sentence length, and no corpus size. The candidates probed, the two reasons they
failed, and the ⚠ exhausted search budget that makes this negative a weak one are recorded in §8c;
the kit's base rules in [accessibility-workflow](../accessibility-workflow.md) govern `uk-easy`.

---

## 9. Regional variation

**One codified standard.** There is a single codified **standard literary Ukrainian** (літературна
норма), governed by the 2019 *Правопис* and the Institute of the Ukrainian Language (§2). Regional
dialects exist (southwestern/Galician, southeastern/Dnipro-based, northern/Polissian), but **standard
written Ukrainian is dialect-neutral** and is what an educational platform must use. The project
targets this **shared literary standard** — there is no BD/WB-style split to parameterize.

**What "neutral" is.** Neutral = the codified literary norm: modern spelling, native vocabulary where
established, no dialectal or regional coloring, no slang. For a national audience, avoid strongly
Galician regionalisms in body text.

**The real editorial axis — russism ↔ purism (not dialect).** The live neutrality question in
Ukrainian is the **русизми/суржик ↔ over-purism spectrum**. Neutral editorial writing:

- ✅ **Rejects русизми / суржик** — use the standard Ukrainian form:
  - ✅ **брати участь** · ❌ *приймати участь* (russism)
  - ✅ **наступний** · ❌ *слідуючий* (russism)
- ✅ **Avoids extreme purism / archaism** that reads as affected — prefer widely-accepted
  **аеропорт** over the purist coinage *летовище*; judge вертоліт vs гелікоптер case by case.
- Result: mainstream, codified, **un-russified but not archaizing**.

⚠ This synthesis is editorial (grounded in the §2 norm-authority); the specific русизм examples are
standard usage-guide knowledge, not a single fetched quote.

Sources: <https://iul-nasu.org.ua/> (norm authority — §2) · 2019 *Правопис* (literary standard —
cited-not-quoted, §2) · русизм/purism examples ⚠ editorial (usage-guide knowledge)

---

