<!-- base -->
# lang-ru — Russian (русский) — language guide

> **Setup & sources live in [`ru.setup.md`](ru.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** русский язык / Russian. The written standard this guide targets is
standard written (literary) Russian — современный русский литературный язык.
**BCP 47 code (base):** `ru`.
**BCP 47 code (simplified variant):** `ru-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`ru-x-simple`), but the kit
token `ru-easy` is the one that counts here.
**Speaker reach:** roughly **258 million** speakers worldwide (⚠ approximate — a UNRIC/
Wikipedia-tier summary figure, not a census or Ethnologue count; the number varies by source and
by whether L2 speakers are included). Russian is an **East Slavic** language, the official
language of the Russian Federation, and has official or co-official status in several other
post-Soviet states and regions (Belarus, Kazakhstan, Kyrgyzstan, and others). For a translation
platform the practical default is **standard written Russian in Cyrillic**, driven by current
Unicode/CLDR `ru` locale data and the Academy's orthographic reference.
**Script + direction:** Cyrillic script, main Unicode block **U+0400–U+04FF**; **left-to-right**.
Words are whitespace-separated, so ordinary tokenization applies — no bidi, no cursive joining.
**Status:** planned — authored from **external desk research** whose first pass came back **weak**
on the editorial sections and was rescued by a targeted follow-up that restored the standards
infrastructure (Unicode, CLDR, the Academy institute, GOST route) but **not** the register,
plain-language, and regional-variation authorities. Covers base `ru` and the `ru-easy` pendant.
Load-bearing standards anchors were **re-verified in this revision** (Cyrillic range, CLDR
`ru` dates, ruble sign, the Vinogradov Institute domain — see CITE-VERIFY in §2); several came
back confirmed, one (the GOST-via-cntd route) was **unreachable from the verification
environment** and is downgraded accordingly. **Not yet reviewed by a native speaker** — per the
authoring directive's "second set of eyes" rule, this header records that gap honestly.
**Easy or hard for this kit:** the mechanics are **friendly** — Cyrillic is LTR, whitespace-
separated, no shaping/joining, broad web-font coverage. The hard parts are **grammatical, not
typographic**: a **six-case** declension system with pervasive gender/number agreement, **verbal
aspect** (perfective vs imperfective), **no articles**, and **free-ish word order** driven by
information structure — all of which make naive EN/DE → RU transfer read as foreign. Two small
script traps carry real weight: keeping **ё distinct from е**, and using **«…» guillemets** rather
than Latin quotes.

Sources: <https://en.wikipedia.org/wiki/Russian_language> · <https://www.ruslang.ru> ·
<https://www.unicode.org/charts/PDF/U0400.pdf>

---

## 1. Header block

See above. One-line orientation: Russian is a Slavic, LTR, Cyrillic language with a single
pan-Russian written standard; the localization risks concentrate in **case/agreement, aspect,
article-absence, word order, and the ё/quotation typographic details** — not in script rendering.

---

## 4. Grammar for translators

**Word order.** Russian's neutral order is **SVO**, but word order is **flexible**: case marking
and **information structure (тема/рема — topic/comment)** do the work English does with position,
so the last position tends to carry the new/focal information. A literal English word order often
sounds unnatural even when grammatical. (This SVO statement rests on a general grammar site —
**⚠ convention**, not an academy citation.)

- ✅ **Я вижу книгу** ("I see a [/the] book" — SVO, книга in the accusative **книгу**).
- ✅ **Книгу я уже прочитал** (object-first, marking «the book» as topic — perfectly natural,
  case makes the roles unambiguous).
- ❌ Fixing English order mechanically and dropping case: **Я вижу книга** (nominative where
  accusative is required) reads as broken.

**Register / politeness — and the project's choice.** Russian has a two-tier second person: **ты**
(informal singular) and **вы** (polite/formal singular, and plural). **вы** with a single addressee
takes **plural verb agreement**. Educational and institutional content conventionally addresses the
reader with **вы**.

> **Register decision (human-gate): вы (polite/formal second person) — taken and recorded.**
> **вы** is the conventional, non-condescending register for an
> educational platform addressing adult and mixed audiences, and takes polite plural agreement
> throughout. **Binding for all second-person copy** in `ru` and `ru-easy` — no drift to **ты**,
> including in informal or playful passages.
>
> **⚠ Sourcing note (convention, not academy-cited).** The *choice* is settled, but the research
> could **not** source the register convention to a strong authority — it rests only on a general
> grammar site (elon.io) and Wiktionary's Russian-pronoun appendix. So the **evidence tier is
> convention**, not a Gramota/Institute citation. Do not represent this as an academy ruling; it is
> a recorded editorial decision backed by weak sources.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ Formal help text (вы, plural agreement): **Нажмите кнопку, чтобы продолжить.** / **Вы можете
  изменить настройки в любой момент.**
- ❌ Informal register in a formal UI (ты, singular agreement): **Нажми кнопку, чтобы продолжить.**
  / **Ты можешь изменить настройки…**

The grammar features that break a naive EN/DE → RU translation:

**(1) Six-case declension.** Nouns, adjectives, pronouns, and numerals decline for
**nominative, genitive, dative, accusative, instrumental, prepositional**. The dictionary form is
rarely the form a sentence needs; a translator who leaves nouns in the nominative produces broken
Russian.

- ✅ **Я читаю книгу** (accusative object **книгу**) · **страница книги** (genitive «of the book»
  **книги**) · **на странице** (prepositional after **на**).
- ❌ **Я читаю книга** / **страница книга** — nominative left uninflected where a case is required.

**(2) Gender & agreement.** Every noun is masculine, feminine, or neuter; adjectives, past-tense
verbs, and many pronouns **agree in gender and number**.

- ✅ **новый курс** (m.) · **новая тема** (f.) · **новое задание** (n.) · **новые курсы** (pl.).
- ❌ **новый тема** / **новое курс** — adjective not matching noun gender.

**(3) Verbal aspect (perfective vs imperfective).** Most verbs come in an aspect pair; the choice
encodes whether the action is **completed/bounded** (perfective) or **ongoing/habitual/general**
(imperfective) — a distinction English carries with tense/context, not a separate verb. Picking the
wrong aspect changes meaning.

- ✅ **Я объясню** (perfective — "I will explain [and finish]") vs **Я объясняю** (imperfective —
  "I explain / am explaining").
- ✅ **Сохраните файл** (perfective imperative — do it once, completely) vs **Сохраняйте файл**
  (imperfective — keep saving / save regularly).
- ❌ Treating them as free variants, e.g. a one-time "Save" button labeled **Сохраняйте** (reads as
  "keep saving repeatedly").

**(4) No articles.** Russian has **no a/the**; definiteness is inferred from context and word order
(§ word order above). Do **not** invent a word to render an article, and do not assume the English
article maps to anything.

- ✅ **Курс начинается завтра** ("the/a course starts tomorrow" — no article, context decides).
- ❌ Inserting a demonstrative as a fake article everywhere: **Этот курс начинается завтра** only
  when you actually mean *this* course, not as a default rendering of "the".

**(5) Prepositions govern specific cases (and shift meaning).** A preposition selects a case, and
the same preposition + different case can mean different things.

- ✅ **в курсе** (prepositional — "in the course / aware") · **на странице** (prepositional — "on
  the page") · **для детей** (genitive — "for children").
- ❌ **в курс** / **на страницу** used where a static location (prepositional) is meant — the
  accusative forms **курс / страницу** shift the sense to motion/direction ("into the course",
  "onto the page").

Sources: <https://en.wiktionary.org/wiki/Appendix:Russian_pronouns> (ты/вы register — weak,
⚠ convention) · general Russian grammar description for SVO/flexible order (elon.io — weak,
⚠ convention) · case/aspect/agreement/article features are standard Russian grammar, anchored to
the Academy institute (ruslang.ru); the specific example pairs are **authored correct-form
illustrations**, standard Russian but **not** machine-confirmed against a named grammar page —
treat as correct-form pending a Gramota/Institute cross-check. <https://www.ruslang.ru>

---

## 5. Numbers, dates, currency

**Digit system.** Russian uses **Western Arabic digits 0–9** in all normal digital content (there
is no separate native digit set). No digit-system-mixing issue arises as in Indic/Arabic locales.

**Grouping & decimal separator (CLDR `ru`).** The **thousands group separator is a no-break space,
U+00A0** — not the ordinary space U+0020 — and the **decimal separator is a comma**. (The
no-break-space reading is this guide's own re-read of the CLDR 48.2 `ru` release data, §2.)

- ✅ **1 500** (one thousand five hundred) · **1 234 567** · **3,14** (pi) · **0,5** (one half).
- ❌ **1,500** / **1.500** for a thousand (English/German grouping) · **3.14** with a dot decimal.
- ⚠ **The gaps inside the two ✅ numbers are literal U+00A0 characters in this file, not spaces
  you can retype.** Copy them, or emit them from CLDR — a template that types U+0020 lets a
  number break across a line, which is the whole reason CLDR ships the no-break form.

**Dates & times (CLDR `ru`, Gregorian) — ✓ verified against the CLDR `ru` chart.** Russian uses
**day-month-year** ordering.

| Format | Pattern (CLDR 48.2 `ru`) | Example |
|---|---|---|
| Numeric (short) | `dd.MM.y` | **24.07.2026** |
| Long (textual) | `d MMMM y` + U+202F + `'г'.` | **24 июля 2026 г.** |
| Month + year | `LLLL y` + U+202F + `'г'.` | **июль 2026 г.** |
| Time (24-hour) | `HH:mm` | **21:45** |

⚠ **Pattern precision (corrected this pass).** The earlier table wrote the year suffix as a plain
`'г.'` after an ordinary space. CLDR 48.2 `ru` actually uses a **narrow no-break space (U+202F)**
before the abbreviation and quotes only the letter: `d MMMM y` + U+202F + `'г'.`. The **rendered**
result looks unchanged, but a template that substitutes an ordinary space will allow a line
break between the year and «г.» — which is exactly what the narrow no-break space prevents.
**The Example column above and the ✅ line below now carry the real U+202F**, so the strings in
this file are copy-safe; they are indistinguishable on screen from the U+0020 version, which is
precisely why they must be copied rather than retyped.

Notes: the month name in the long form is in the **genitive** (24 **июля**, not 24 июль); the
abbreviation **«г.»** (for *года*, "of the year") conventionally follows the year in textual dates;
Russian uses a **24-hour clock** in normal digital content. **ISO 8601 (YYYY-MM-DD)** is a
backend/technical convention, not the end-user default.

- ✅ **24 июля 2026 г.** (genitive month, «г.» suffix). ❌ **24 июль 2026** (nominative month, no
  «г.»).

**Currency.** The ruble sign is **₽ (U+20BD RUBLE SIGN)**, ISO 4217 **RUB** (✓ verified, Unicode
7.0). Conventional placement is **after the amount with a space**, following the CLDR `ru`
currency pattern (which drives placement — do not hard-code it as a free-text rule). Note the two
gaps in the ✅ examples are **different characters**: the one inside the amount is the U+00A0 group
separator established above, while the one **before ₽** is an ordinary U+0020 — this guide read
placement from CLDR, **not** the pattern's space character, so it asserts nothing about it. Drive
that gap from the CLDR pattern rather than from this line.

- ✅ **1 500 ₽** (amount, space, sign). Also written out: **1 500 руб.** / **1 500 рублей**
  (the noun agrees with the number — see agreement note below).
- ❌ **₽1 500** (leading, English-style) · **1 500₽** (no space).

**Number–noun agreement (a Russian-specific trap for generated strings).** The noun after a number
changes by the number's last digit: **1 рубль**, **2/3/4 рубля**, **5–20 рублей** (and similarly
день/дня/дней, курс/курса/курсов). A template that always appends the plural produces
**«2 рублей»**/**«1 рублей»** — wrong. Localized plural handling must use the **CLDR `ru` plural
categories (one / few / many / other)**, not a binary singular/plural.

- ✅ **1 день**, **2 дня**, **5 дней**. ❌ **1 дней**, **2 дней** (binary-plural output).

Sources: <https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (patterns re-read against **CLDR 48.2**, 2026-03-17,
replacing the earlier v46 chart — separator and ordering values unchanged, the year-suffix pattern
sharpened to the U+202F form) ·
<https://cldr.unicode.org/translation/number-currency-formats/number-and-currency-patterns> ·
<https://en.wikipedia.org/wiki/Russian_ruble_sign> (₽ / U+20BD, Unicode 7.0)

---

## 6. Terminology strategy

**Transliteration.** For systematic Latin transliteration (slugs, identifiers, search indexes),
**GOST 7.79-2000** (the Russian adaptation of ISO 9) is the reference reversible scheme. User-
facing text never displays raw transliteration (§3).

**Loanword policy.** Russian technical writing mixes **established loanwords** (kept when already
standard in the field) with **calques and native coinages** for newer concepts. In AI/ML both
patterns coexist. **Working rule: prefer the term standardized by GOST / used by mainstream Russian
technical sources over a novel coinage; keep well-known English acronyms (AI/ИИ, ML, NLP, GPU) in
their established Russian or Latin form.** Note that AI is commonly abbreviated **ИИ** (искусственный
интеллект) in Russian running text.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give the reader the Russian term + the original English +
one short plain clause, then use the Russian term alone afterwards. Instantiated:

> **нейронная сеть** (neural network) — вычислительная модель из связанных «нейронов»,
> организованных в слои, которая учится на данных. Далее в тексте — **нейронная сеть**.

After first mention: **нейронная сеть** alone. Project coinages (C1) keep their original spelling
and are owned by the term-sheet, not this table.

**Seed field vocabulary (AI / ML).** The core terms below trace to the **GOST AI/ML terminology
route via a standards database (§2)** — but that route was **⚠ unreachable in the verification
pass** (connection refused, likely geoblocked, not confirmed dead), so treat the whole table as
**field/standard usage to confirm against a reachable GOST text**, not as a machine-verified
citation. The **last four rows are explicitly unsourced glossary suggestions**, not GOST — marked
⚠; the **training** and **dataset** rows were likewise unsourced in the research (not in the
GOST-cited set) and carry the same marker.

| Concept (EN) | Russian term | Provenance |
|---|---|---|
| artificial intelligence | искусственный интеллект (ИИ) | GOST route (⚠ unreachable in verify) |
| machine learning | машинное обучение | GOST route (⚠ unreachable in verify) |
| deep learning | глубокое обучение | GOST route (⚠ unreachable in verify) |
| neural network | нейронная сеть | GOST route (⚠ unreachable in verify) |
| model | модель | GOST route (⚠ unreachable in verify) |
| training | обучение (модели) | ⚠ unsourced in research — not in the GOST-cited set |
| dataset | набор данных | ⚠ unsourced in research — not in the GOST-cited set |
| data annotation / labeling | разметка данных | GOST route (⚠ unreachable in verify) |
| natural language processing | обработка естественного языка | GOST route (⚠ unreachable in verify) |
| computer vision | компьютерное зрение | GOST route (⚠ unreachable in verify) |
| reinforcement learning | обучение с подкреплением | GOST route (⚠ unreachable in verify) |
| generative AI | генеративный ИИ | ⚠ unsourced glossary suggestion — not GOST |
| prompt | промпт | ⚠ unsourced glossary suggestion — not GOST |
| inference | инференс / вывод | ⚠ unsourced glossary suggestion — not GOST |
| hallucination | галлюцинация (модели) | ⚠ unsourced glossary suggestion — not GOST |

Recommended default set for the platform: **искусственный интеллект (ИИ), машинное обучение,
глубокое обучение, нейронная сеть, обработка естественного языка, набор данных**, with the English
term in parentheses on first use. **Freeze the chosen forms in the project glossary** and do not
mix competing renderings within the platform; confirm each against a reachable GOST text before
treating any as canon.

Sources: <https://docs.cntd.ru/document/566348046/titles/8P00LP> (GOST AI/ML terminology route —
**⚠ unreachable in verification**, connection refused) · transliteration: **GOST 7.79-2000** (ISO 9
adaptation) — named as the reference scheme, standard text not machine-read here.

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → RU): idiomatic form ✅ vs literal calque ❌.** These are common English
educational/technical stock phrases whose word-for-word transfer into Russian reads as foreign. Use
the idiomatic column.

| English phrase | Idiomatic Russian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | шаг за шагом | шаг по шагу | translator craft, unsourced |
| in plain language | простыми словами | в простом языке | translator craft, unsourced |
| at a glance | с первого взгляда | на взгляд | translator craft, unsourced |
| break it down | разобрать / разложить по частям | сломать вниз | translator craft, unsourced |
| keep in mind | иметь в виду / помнить | держать в уме (only lit. mental arithmetic) | translator craft, unsourced |
| by default | по умолчанию | по дефолту (slang) | translator craft, unsourced |
| a key point | важный / ключевой момент | ключевая точка | translator craft, unsourced |
| make sure | убедиться | сделать уверенность | translator craft, unsourced |
| from scratch | с нуля | с царапины | translator craft, unsourced |
| in the long run | в долгосрочной перспективе | в долгом беге | translator craft, unsourced |

**⚠ Two research "wrong calques" corrected — do not ship them as errors.** Round-1 marked **под
капотом** ("under the hood") and **из коробки** ("out of the box") as wrong calques. **They are
not errors** — both are *attested, common* Russian tech idioms (**«работает из коробки»**,
**«что под капотом»**). So the honest guidance is: prefer a neutral phrasing when writing for a
general audience, but **do not flag под капотом / из коробки as defects**:

- "under the hood" → neutral **«как это устроено внутри»**; **«под капотом»** is also idiomatic
  (attested), not wrong.
- "out of the box" → neutral **«сразу, без настройки»**; **«из коробки»** is also idiomatic
  (attested), not wrong.

**⚠ Provenance — confirm with a native speaker / the phraseology handbook.** This language's
round-1 idiom set was **weak** (it mislabeled two real idioms as errors, above). The table is
**localization judgment**, not an academy-sourced idiom dictionary; the **verification locus is
Gramota.ru's phraseology handbook** («Справочник по фразеологии», §2), which a native-speaker or
reachable-source pass should check each rendering against. Treat the ✅ column as a strong working
default pending that pass.

Beyond stock phrases, the grammar-level literal-transfer anti-patterns (re-derived from §4) belong
alongside the idiom table:

- ❌ **Nominative left uninflected** where a case is required (*Я читаю книга*) → ✅ **Я читаю
  книгу** (accusative).
- ❌ **Wrong aspect** for a one-time UI action (*Сохраняйте* on a one-shot button) → ✅ **Сохраните**.
- ❌ **Fake article** inserted for English "the/a" (*этот* as a default) → ✅ no article, context
  decides.
- ❌ **Informal register** carried into formal UI (*Нажми…*) → ✅ **Нажмите…** (вы).
- ❌ **Missing copula-dash** (*Москва столица России*) → ✅ **Москва — столица России**.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: <https://gramota.ru/biblioteka/spravochniki/spravochnik-po-frazeologii> (phraseology
handbook — **source family / verification locus**; live but bot-blocked to the fetcher, §2) ·
idiom renderings otherwise localization judgment (⚠ native-speaker confirmation pending; two
round-1 "wrong calques" corrected above).

---

## 8. Simplified-language pendant (`ru-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: for Russian, the measurement is a negative result, and that is the
finding.** In most guides in this kit §8c counts a plain-register corpus against a standard one and
the count overturns rows of the word table. **Here it cannot.** No reachable Russian publisher runs
both a standard and a plainer edition of the same material, so the only pair that could be built
differs in publisher, genre *and* topic at once — and Russian's inflection means a word-form count
systematically understates every verb and adjective in it. The consequence is the opposite of the
usual one: **the dictionary evidence in §8b is the stronger of the two bodies of evidence, and it
stands.** A dictionary with explicit register marking (**Офиц.**) is Official tier; this corpus is
Community tier with a known confound. Where the two disagree, the dictionary wins and the
disagreement is **recorded rather than resolved**.

### 8a. The standard question — no *Russian* national standard, but a Russian-*language* one exists

**Tradition — but no *Russian* national standard. There is, however, a codified standard in the
Russian language.** Russian has an **active plain-language / easy-read discussion**, commonly framed
as **«ясный язык»** ("clear language") and **«простой язык»** ("plain language"), and there is real
public-service and educational practice around it. No **Russian Federation** national standard with
quantitative thresholds (sentence length, vocabulary level, layout) was located — that finding
stands. **⚠ There is no named, codified "Plain Russian" standard with numeric rules issued in
Russia**; any such thresholds are house-specific.

**But a Russian-language plain-language standard does exist, and this pass found it: Belarusian
СТБ 2631-2023.** The Republican Scientific and Technical Library (РНТБ, a Belarusian state
institution) describes it as **«СТБ 2631-2023, BY „Ясный язык. Требования к процессу подготовки
информации на ясном языке“ устанавливает общие правила и принципы процесса подготовки информации на
ясном языке, разработки продукта на ясном языке, а также требования к специалистам по ясному языку
и их обязанностям в зависимости от выполняемых работ»**, in force **«с 1 февраля 2024 г.»**, and
names its audience — «с интеллектуальными нарушениями», «с расстройствами аутистического спектра»,
«со слабыми навыками чтения и письма», «с низким уровнем образования», «плохо владеющие языком
страны».
⚠ **Read the caveat before citing it.** It is a **Belarusian** national standard, not a Russian one,
and **its text is behind a reading-room wall** — the РНТБ page states you must visit the reading
room to work with it, so the *requirements themselves* were not read and no numeric threshold from
it may be quoted. What it establishes is narrower and still useful: a plain-language norm **written
in Russian** exists and is in force somewhere, so `ru-easy` is not writing into a vacuum. Cite it as
a Belarusian standard by its number — never as "the Russian plain-language standard".

**Keep the two claims apart.** "There is no Russian Federation standard" and "there is no standard
written in Russian" are different statements, and only the first one is true. Collapsing them would
lose the single piece of norm-level evidence this section has.

**How `ru-easy` relates to the kit's base rules.** Because Russian contributes **no quantified
national pendant**, `ru-easy` **inherits the kit's base simplified-language rules directly** — from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md): one
idea per sentence; the kit's own ~8–12-word working target (**the kit's figure, not attributable to
a Russian norm**); simple SVO structure; no stacked subordinate clauses; everyday words; say what
*is*, not what *isn't*; the same word for the same thing; numbers as digits (§5); a one-line "what
is this" opener; and a consistent, literal tone (avoid irony and unexplained metaphor). The Russian-
specific overlays: **hold the вы register (§4) steadily** — no drift to ты for "friendliness"; and
**keep ё distinct** (§3) — easy-read audiences benefit most from the disambiguation ё provides.

**Term-preservation rule (restated, binding).** In `ru-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Use the same term as the base variant, then «это значит: …»,
then a concrete example. E.g. keep **нейронная сеть**, then explain it in plain Russian; do not
replace it with an invented everyday word.

### 8b. Name the axis — канцелярит against neutral Russian

**Name the axis: канцелярит.** Russian has a name for exactly the register this table escapes, and
not naming it was the largest gap in this section. **Канцелярит** — bureaucratic officialese leaking
out of the office and into ordinary prose — was coined by **Корней Чуковский** in *«Живой как жизнь»*
(1962), whose sixth chapter carries the word as its title and opens on the register itself:
«учитывая вышеизложенное», «получив нижеследующее», «указанный период», «означенный спортинвентарь»,
«выдана данная справка». Chukovsky's demonstration of what the register does is still the clearest
statement of the axis: an agronomist who wrote *мокрая земля* and *глубокий снег* is told by his
editor, «В научной статье вы обязаны писать — глубокий снежный покров и избыточно увлажненная
почва». **The direction `ru-easy` runs is the reverse of that editor's.**
*(Community-tier for the coinage claim: the Russian-language encyclopedia records that the term
«был введён Корнеем Ивановичем Чуковским в книге „Живой как жизнь“ (1962) и построен „по образцу
колита, дифтерита, менингита“». The chapter text itself is quoted from a hosted copy of the book,
not a publisher's edition — treat the wording as reliable and the pagination as unavailable.)*

**Structural overlay — the part that matters more than the word list.** The canonical inventory of
канцелярит markers is Нора Галь's, in *«Слово живое и мёртвое»* (1972); each item is a rewrite rule
for `ru-easy`, and each one changes sentences rather than tokens:

1. **«Вытеснение глаголов причастиями, деепричастиями и существительными (особенно отглагольными)»**
   — put the verb back. *осуществление контроля* → *контролировать*; *в целях информирования* →
   *чтобы сообщить*. This is the single highest-yield edit in Russian easy language.
2. **«Нагромождение существительных в косвенных падежах, чаще всего длинные цепи существительных в
   одном и том же падеже — родительном»** — break genitive chains. *параметры модели сети компании*
   → two sentences.
3. **«Вытеснение активных оборотов пассивными»** — and with it the **`являться` copula**: the
   dictionary itself glosses *являться* as «Быть кем-, чем-л., представлять собой кого-, что-л.»
   (Кузнецов), so write *Это …* or *— *, not *является*.
4. **«Обилие придаточных предложений»** — split participial and gerundive adverbial clauses into
   their own sentences.
5. **«Повсеместное предпочтение длинного слова — короткому, официального или книжного —
   разговорному»** — which is the word table below, stated as a principle.

Chukovsky supplies the ✅/❌ pair himself, in a footnote to the same chapter, on rule 4:

- ✅ `ru-easy`: **«Я заболел и не мог пойти в школу.»** / **«Из-за болезни я не пошёл в школу.»**
- ❌ канцелярит: **«Будучи болен, я не мог пойти в школу.»**

*(Wording verbatim from the chapter's footnote; only the quotation marks are normalized to the
Russian «…» of §3.)*

**Complex → everyday word table — the dictionary's evidence, and the strongest lexical evidence this
section has.** Replace bureaucratic/nominalized vocabulary with the everyday word a general reader
would say aloud. **Tier is marked per row.** **БТС** = the *Большой толковый словарь русского языка*
(Кузнецов) either **marks the word Офиц.** or **defines it using the everyday word** offered here —
the pair is the dictionary's, not this guide's. **⚠ craft** = this guide's judgment, unattested.
**The table as a whole still wants a native-speaker pass** — no Russian plain-language norm stands
behind the *choice* of these pairs, only behind the glosses. **§8c probed this table against a
corpus and the probe came back unusable; the rows below therefore stand on the dictionary, and §8d
records where the probe pointed elsewhere.**

| Formal / bureaucratic | Everyday Russian | Tier — dictionary evidence |
|---|---|---|
| наличие | есть / когда есть | **БТС**, and the only row with an explicit register label: «НАЛИЧИЕ … ср. **Офиц.** Присутствие, существование», with the run-on «В наличии … Есть, имеется, налицо» |
| содействовать | помогать | **БТС**: «Оказать — оказывать содействие, **помочь — помогать** кому-, чему-л. в чём-л.; способствовать» |
| информирование | сообщение / сообщать | **БТС**: «ИНФОРМИРОВАТЬ … **Сообщить — сообщать** о положении дел…; осведомить — осведомлять кого-, что-л.» |
| предоставлять | давать | **БТС**: «ПРЕДОСТАВИТЬ … **Дать** возможность кому-л. обладать, распоряжаться, пользоваться чем-л.» |
| посредством | с помощью / через | **БТС**: «ПОСРЕДСТВОМ предлог… **При помощи** чего-л., **путём** чего-л.» — *через* is the everyday reduction and is ⚠ craft (and the one row the corpus probe pushes back on — §8d) |
| осуществление | выполнение | ⚠ craft — but see the sourced structural point: БТС glosses «О. руководство, контроль, наблюдение и т.п.» as «произвести действие, названное существительным», i.e. the light-verb-plus-noun frame itself. **Unwind it to the verb** (*осуществлять руководство* → *руководить*) rather than swapping one noun for another |
| осуществлять | делать | ⚠ craft — БТС defines it «Привести в исполнение, воплотить в действительность», not *делать* |
| реализовывать | сделать / запустить | ⚠ craft — БТС defines it with *осуществить*, itself formal; the pair is a double step this guide is taking on its own |
| направленный на | для | ⚠ craft — unattested |
| нормативный | который устанавливает правила | ⚠ craft — the earlier gloss *установленный* was **wrong in direction** and is corrected here: БТС has «Устанавливающий норму (нормы), правила чего-л.» — norm-**setting**, not norm-**set** |

### 8c. Measure the axis — what was attempted, and why the result carries structure but no word list

**What could not be built.** The design this kit uses elsewhere — one publisher, two editions of the
same material, one standard and one plainer — **could not be assembled for Russian**. No reachable
Russian publisher runs both. Unreachable from the measurement environment: `rg.ru`, `ria.ru`,
`mos.ru`, `edu.gov.ru`, `duma.gov.ru`, `rospotrebnadzor.ru` (no connection at all); `tass.ru` and
`nplus1.ru` (HTTP 403); `lenta.ru` answered its sitemap with a 302 and no entries. **No adult
easy-read Russian corpus was found in the reachable Russian web at all.**

**What was built instead — a pair that is foreign in publisher *and* genre.**

| | Publication | Kind | Docs | Tokens |
|---|---|---|---|---|
| **A — plainer** | Пионерская правда (`pionerka.ru`) | children's newspaper | 249 | 76,693 |
| **B — standard** | Наука и жизнь (`nkj.ru`) | popular science for adults | 237 | 140,098 |

**Structure — the most defensible thing this pair yields.**

| | A — plainer | B — standard |
|---|---|---|
| Mean sentence length | **12.08 words** | **13.88** |
| Median sentence length | 10 | 11 |
| Sentences ≤ 15 words | **74.8 %** | 66.2 % |
| Tokens longer than 11 characters | **4.6 %** | **7.0 %** |

The tokenizer self-test (`не`) passed in both corpora, so the token counts themselves are sound.
These two structural numbers move in the same direction as every structural rule in §8b, and they
are the part of the measurement §8f is allowed to lean on. ⚠ They are still measured across a
genre gap, so read them as **consistent with** the rules, not as a validation of them.

**🔴 Why the keyness list cannot become a word list.** The top-ranked distinguishing words are
dominated by **topic and page furniture**, not by register: `наука`, `жизнь`, `журнал`, `журнала`
are the standard magazine's own **title**; `корзину`, `уб`, `p`, `pdf` are shopping-basket and
download residue from a shop running on the standard publication's site; `пионерская`,
`пионерской`, `правды`, `война`, `прадед` are the children's paper's **proper name and subject
matter**. **None of these is a language finding and none of them may be reported as one.** What
survives the strip-out is a personal-address signal — `я` (642.8 vs 130.6 per 100k), `ты` (140.8 vs
10.0), `тебя`, `мне`, `мой` — which measures **genre, not difficulty**: a children's paper carrying
readers' letters and stories speaks to its audience directly. That is not evidence about what plain
Russian for adults looks like, and §8e refuses to use it as such.

**The §8b table, probed.** Read the verdict column with the two disqualifiers below it. **Tolerance
band: a row needs a factor of 1.25 in one direction to count as movement. Thin-row threshold: a row
whose members stay under 3 per 100k in *both* corpora is too sparse to judge.** Rates per 100,000
tokens, given as **A → B**.

| Formal word — A → B | Everyday word — A → B | Probe verdict | Form-stable enough to mean anything? |
|---|---|---|---|
| наличие 1.3 → 3.6 | есть 159.1 → 100.6 | holds | ✅ yes |
| посредством 0 → 7.1 | через 52.2 → 117.1 | reversed — the "everyday" word is *rarer* in the plainer corpus | ✅ yes |
| необходимо 9.1 → 24.3 | нужно 45.6 → 48.5 | flat — no register signal at the 1.25 band | ✅ yes |
| содействовать 1.3 → 0 | помогать 6.5 → 0.7 | partial | ⚠ no — inflecting verb |
| информирование 0 → 0.7 | сообщение 1.3 → 5.7 | reversed | ⚠ no — inflecting noun, and thin |
| предоставлять 0 → 0 | давать 2.6 → 2.1 | thin | ⚠ no — inflecting verb |
| осуществление 0 → 2.9 | выполнение 7.8 → 1.4 | holds | ⚠ no — inflecting noun |
| осуществлять 0 → 1.4 | делать 18.3 → 13.6 | holds | ⚠ no — inflecting verb |
| реализовывать 0 → 0 | сделать 41.7 → 33.5 | flat | ⚠ no — inflecting verb |
| нормативный 0 → 0 | правило 5.2 → 11.4 | reversed | ⚠ no — inflecting adjective, and thin on the formal side |
| являться 0 → 2.1 | быть 92.6 → 96.4 | flat | ⚠ no — inflecting verb |
| данный 0 → 0.7 | этот 90 → 95.6 | flat | ⚠ no — inflecting adjective/pronoun |
| использовать 2.6 → 23.6 | применять 0 → 1.4 | thin on the everyday side | ⚠ no — inflecting verb |
| получить 11.7 → 23.6 | взять 14.3 → 9.3 | holds | ⚠ no — inflecting verb |

**🔴 Two reasons this probe is NOT a refutation of §8b — and the distinction matters.** There is a
difference between *measured and refuted* and *not measurable here*. **Every row above is the
second.**

1. **Genre and topic shift with the register.** The two corpora differ in publisher, in subject, and
   in intended reader, not only in how plainly they are written. Any lexical difference between
   them has at least three candidate explanations and the measurement cannot separate them.
2. **No lemmatization, and Russian is strongly inflecting.** The counter counts **word forms**.
   *быть* really occurs as *есть* / *был* / *было* / *будет*; *являться* as *является* /
   *являются*. For verbs and adjectives the counts above are therefore **systematically too low**
   and the verdicts attached to them are **meaningless**, not negative. Only rows whose members do
   not inflect, or barely do, carry anything at all — which the measurement identifies as
   **`наличие`, `посредством` and `необходимо`**, the three marked ✅ in the last column.

**Consequence, stated plainly.** The dictionary glosses in §8b are Official tier; this corpus is
Community tier with a named confound and a known counting defect. **The dictionary stands. The
corpus does not overturn it, and no row of the §8b table is deleted on the strength of a probe
verdict.** What the corpus contributes is §8c's structural numbers, the three form-stable rows
carried forward into §8d, and an honest account of what could not be built.

### 8d. 🔴 The do-NOT-simplify list

Every entry here rests on the **dictionary**, or on one of the three form-stable corpus rows, or on
both. Rows resting only on the confounded corpus are marked **⚠ corpus-only** with what would
settle them.

| Do **not** do this | Why |
|---|---|
| ~~gloss **нормативный** as **установленный**~~ | **The reversal this section exists to catch.** The earlier gloss was **wrong in direction**: БТС has «Устанавливающий норму (нормы), правила чего-л.» — the word means norm-**setting**, not norm-**set**. Rewrite to *который устанавливает правила*. A wrong-direction gloss is worse than a formal word left in place, because it silently changes what the sentence says. |
| ~~swap **осуществление** for **выполнение** and call it done~~ | БТС glosses «О. руководство, контроль, наблюдение и т.п.» as «произвести действие, названное существительным» — the entry describes the **light-verb-plus-noun frame itself**. Replacing one abstract noun with another leaves the frame standing. **Unwind it to the verb**: *осуществлять руководство* → *руководить*. This is Нора Галь's rule 1 (§8b), and it is the highest-yield edit in Russian easy language. |
| ~~treat **осуществлять → делать** as dictionary-backed~~ | It is not. БТС defines *осуществлять* as «Привести в исполнение, воплотить в действительность» — not *делать*. The pair is ⚠ craft. Use it as a hint, prefer the verb-unwinding edit above, and do not cite the dictionary for it. |
| ~~treat **реализовывать → сделать** as one step~~ | БТС defines *реализовать* with *осуществить*, which is itself formal. The pair is a **double step this guide takes on its own** (⚠ craft): the dictionary gets you from *реализовывать* to another formal word, and the second leg is unattested. |
| ~~reach for **через** automatically when dropping **посредством**~~ | Half of this row is solid and half is not. Dropping *посредством* is supported from both sides — БТС glosses it away entirely («При помощи чего-л., путём чего-л.»), and it is the one formal word that is **absent from the plainer corpus and present in the standard one** (0 → 7.1 per 100k, a form-stable row). **But *через* is not the dictionary's word and the probe runs against it**: *через* is more than twice as common in the *standard* corpus (52.2 → 117.1). ⚠ Read that as unsettled, not as refuted — the corpora differ in genre. **Prefer the dictionary's own reduction, *с помощью*.** What would settle it: a lemmatized count over a plain and a standard edition from one publisher. |
| ~~expect a gain from **необходимо → нужно**~~ | ⚠ corpus-only, and the probe says **flat**: *нужно* runs 45.6 → 48.5 per 100k, inside the 1.25 tolerance band, i.e. no register signal. The formal member does sit lower in the plainer corpus (9.1 → 24.3), so *dropping* *необходимо* is defensible; **promoting *нужно* as a plainness marker is not demonstrated.** This row is form-stable, which is why it is here at all. What would settle it: an adult plain-register corpus, which does not exist in the reachable Russian web. |
| ~~present **направленный на → для** as sourced~~ | ⚠ **craft — unattested.** No dictionary evidence and no usable corpus evidence. Keep it as an editorial hint and never as a rule. |
| ~~read any verb or adjective row of the §8c probe as a verdict~~ | The probe counts **word forms** and Russian inflects. *содействовать*, *предоставлять*, *осуществлять*, *реализовывать*, *являться*, *использовать*, *получить*, *нормативный*, *данный* are all undercounted by an unknown factor. **"Reversed" and "flat" on those rows mean *not measured*, not *refuted*.** Their §8b glosses stand. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **нейронная сеть**, then «это значит: …», then a concrete example. |
| ~~simplify by word length alone~~ | The long-word share is a **structural** observation (4.6 % vs 7.0 % of tokens over 11 characters, §8c), not a license to swap individual long words for short ones. In Russian the reliable win is putting the verb back and breaking the genitive chain — the sentence shrinks, and the long nominalizations go with it. |

> **→ The rule that follows.** For Russian, **the word table is dictionary evidence and the corpus
> is not strong enough to edit it.** Apply the **БТС**-marked rows with confidence, apply the
> ⚠ craft rows as hints, and take the real leverage from §8b's structural rules — which is where
> §8c's numbers point too.

### 8e. 🔑 The address decision — `ru-easy` keeps **вы**, and the corpus cannot speak to it

> **Decision, recorded so that nobody "fixes" it: `ru-easy` uses `вы`, exactly as `ru` does (§4).
> It does NOT switch to `ты`.**

- ✅ **Нажмите кнопку, чтобы продолжить.** — in `ru` and in `ru-easy` alike
- ❌ **Нажми кнопку, чтобы продолжить.** — *ты* is not easier, only more familiar

**The grounds are §4's, and they are unchanged.** §4 records **вы** as a human-gated project
decision, binding for all second-person copy in `ru` and `ru-easy`, on the reasoning that **вы** is
the conventional, non-condescending register for an educational platform addressing adult and mixed
audiences. §4 also records honestly that the evidence tier for that convention is **convention, not
an academy ruling** — it rests on a general grammar site and Wiktionary's Russian-pronoun appendix.
Nothing in §8 strengthens or weakens that; the decision is carried over as recorded.

**⚠ The measurement cannot answer this question, in either direction.** The one place §8c shows a
large `ты` signal is corpus A — 140.8 per 100k against 10.0 in the standard corpus — and corpus A is
**Пионерская правда, a children's newspaper**. Its *ты* is addressed **to children**, not to adults
with reading difficulties. This is the same age-versus-difficulty confusion the French measurement
already identified, where address was shown to track **the reader's age, not the text's
difficulty**. Reading corpus A's *ты* as evidence about `ru-easy` would import exactly the
condescension the variant exists to avoid. **Treat §8c as silent on address.** What would settle it:
an adult Russian easy-read corpus, which §8c established does not exist in the reachable web.

### 8f. What `ru-easy` is built on, in order of leverage

1. **Sentence structure — the main lever, and the one the measurement supports.** Нора Галь's five
   markers in §8b, applied as rewrite rules: put the verb back in place of the verbal noun; break
   genitive chains; prefer active over passive and drop the *являться* copula; split participial
   and gerundive clauses into their own sentences. §8c's structural numbers move the same way —
   the plainer corpus runs **shorter sentences** (mean 12.08 vs 13.88 words; **74.8 % vs 66.2 %**
   of sentences at 15 words or fewer) and **fewer long words** (4.6 % vs 7.0 % of tokens over 11
   characters). ⚠ Measured across a genre gap, so this is corroboration, not proof.
2. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), inherited unchanged because Russian
   contributes no quantified national pendant (§8a). Note in passing that the plainer corpus's
   **median sentence of 10 words** sits inside the kit's ~8–12-word working target and its mean sits
   at the top edge — ⚠ a consistency observation against a children's newspaper, not a validation of
   the kit's figure, and certainly not a Russian norm.
3. **Term preservation before substitution** — keep the technical term, then «это значит: …», then
   an example (§8a). Explaining a hard word is safer than replacing it, and in Russian it is also
   what the dictionary evidence supports: §8b's glosses tell you what a formal word *means*, not
   which folksy word may stand in for it.
4. **The вы register (§4), held steadily** (§8e), and **ё kept distinct** (§3).
5. **Vocabulary substitution last, and led by the dictionary** — apply the **БТС**-marked rows of
   §8b; treat the ⚠ craft rows as hints; observe §8d. The corpus does not add rows and does not
   remove any.
6. **Belarusian СТБ 2631-2023 is context, not a rule set** (§8a). Its text was not read, so no
   number from it may be quoted, and `ru-easy` must never be described as conforming to it.

### 8g. What is still open

1. **The corpus that would settle this does not exist in reach.** What is needed is a **single
   Russian publisher issuing the same material in a standard and in a «ясный язык» edition** — the
   design used elsewhere in the kit. Failing that, an adult easy-read Russian corpus of any size
   would already be an improvement on a children's newspaper.
2. **Six government and news hosts were unreachable from the measurement environment** (`rg.ru`,
   `ria.ru`, `mos.ru`, `edu.gov.ru`, `duma.gov.ru`, `rospotrebnadzor.ru`, plus 403s from `tass.ru`
   and `nplus1.ru`). A run from a network that can reach them could plausibly build a **register**
   pair — regulatory prose against the same body's public explainer — which is the confound-free
   shape this measurement lacked.
3. **Lemmatization is a hard prerequisite for any future Russian count.** Word-form counting
   understates every verb and adjective by an unknown factor (§8c). Until a lemmatized count exists,
   the §8b rows for *содействовать*, *предоставлять*, *осуществлять*, *реализовывать*, *являться*,
   and *нормативный* remain dictionary-only.
4. **Four rows are ⚠ craft and unresolved:** *осуществление → выполнение*, *осуществлять → делать*,
   *реализовывать → сделать / запустить*, *направленный на → для*. The *посредством → через* leg is
   contested by the probe and provisionally resolved in favor of the dictionary's *с помощью*
   (§8d).
5. **СТБ 2631-2023's requirements were not read** — reading-room access only. No numeric threshold
   from it may be quoted, and whether it carries any is unknown.
6. **The address decision still rests on convention-tier sources** (§4), and §8c cannot reinforce it
   (§8e).
7. **No comprehension evidence exists for any of this.** Everything in §8c is frequency and sentence
   length. Whether the recommended forms are actually *understood* better by the `ru-easy` audience
   was not established, in Russian or in Belarusian practice.
8. **The word table has not had a native-speaker pass.** The glosses are the dictionary's; the
   *choice* of pairs is this guide's, and no Russian plain-language norm stands behind it.

Sources: <http://vivovoco.astronet.ru/VV/BOOKS/LANG/LANG_6.HTM> (К. Чуковский, *Живой как жизнь*,
глава шестая «Канцелярит» — hosted copy of the 1962 book; chapter text and footnote quoted verbatim)
· <https://ru.wikipedia.org/wiki/Канцелярит> (community-tier: the coinage claim and the Нора Галь
marker list, quoted verbatim from *Слово живое и мёртвое*, 1972) ·
<https://gufo.me/dict/kuznetsov/наличие> and the sibling entries *содействовать, информировать,
предоставить, посредством, осуществить, осуществление, реализовать, нормативный, являться* (Большой
толковый словарь русского языка под ред. С. А. Кузнецова, as served by that reference site; all
glosses above quoted verbatim, with the site's inline stress marking removed from the headwords) ·
<https://rlst.by/2024/07/29/standart-nedeli-stb-2631-2023-by-yasnyj-yazyk-trebovaniya-k-protsessu-podgotovki-informatsii-na-yasnom-yazyke/>
(РНТБ on **СТБ 2631-2023** — Belarusian, ⚠ standard text not read) ·
**Corpus (§8c)** — Пионерская правда (`pionerka.ru`, 249 documents) and Наука и жизнь (`nkj.ru`,
237 documents), crawled and counted with the repository's own `scripts/corpus-measure.mjs`; the
frequencies, sentence-length figures, and keyness ranking in §8c are **this guide's own count**, are
**Community tier**, and carry the publisher/genre/topic confound and the no-lemmatization defect
described in §8c. The unreachable hosts are listed in §8c and §8g so that a later run can retry
them — the kit's base rules in
[accessibility-workflow](../accessibility-workflow.md) govern `ru-easy`.

---

## 9. Regional variation

**Which standard the project targets.** The written standard is **pan-Russian standard Russian**,
essentially uniform in **orthography** across the whole Russian-speaking area; genuine differences
are in **vocabulary, register, institutional terminology, and currency**, not spelling. The project
targets this **single shared written standard** (Institute/Gramota orthography as the anchor) and
**parameterizes** the few things that genuinely differ by deployment.

**⚠ Gap-flagged — cross-border variation is weakly sourced.** The research could **not** find one
authoritative linguistic source cleanly stating spelling/vocabulary/currency differences across
**Russia (RU), Belarus (BY), Kazakhstan (KZ), and Kyrgyzstan (KG)**; the only standards-style trail
is Unicode/CLDR locale data for formatting. So the axes below are a **working orientation**, not a
sourced differences table.

| Axis | Russia (RU) | Other RU-speaking states (BY / KZ / KG) |
|---|---|---|
| Orthography | pan-Russian standard | same standard (differences are vocabulary/terminology, not spelling) |
| Currency | ruble **₽** (RUB) | local currencies (BYN / KZT / KGS) in local content — **parameterize** |
| Institutional vocabulary | RF terms | state-specific administrative terms in local content |

**Neutrality strategy (explicit).**

1. **Orthography:** follow the Institute/Gramota standard for general language — uniform across
   regions.
2. **Register:** the recorded **вы** register (§4) for all second-person copy — appropriate
   everywhere.
3. **Vocabulary:** prefer **unmarked pan-Russian terms**; avoid strongly regional or
   institution-specific synonyms where a neutral option exists.
4. **Community/religion-marked vocabulary:** neutral educational content prefers **general
   descriptors** and only uses confessionally- or community-marked vocabulary when the topic
   genuinely requires it. (The specifics of which terms mark which community are **⚠ unverified** —
   the research could not source this; treat as general editorial caution.)
5. **Currency & market specifics:** **parameterize per deployment** (₽ + RF terms for Russia; local
   currency + local administrative vocabulary elsewhere) while keeping the rest of the UI identical.

A single neutral written build serves the whole area, with the parameterized currency/vocabulary
exceptions above.

Sources: <https://www.unicode.org/cldr/charts/latest/verify/dates/ru.html> (locale-formatting trail
only) · **⚠ no single authoritative source** for RU/BY/KZ/KG spelling/vocabulary/currency
differences or for community-marked-vocabulary handling was located — section is gap-flagged.

---

