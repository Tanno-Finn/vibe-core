<!-- base -->
# lang-en — English — language guide

> **Setup & sources live in [`en.setup.md`](en.setup.md)**: §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.

**Native / English name:** English.
**BCP 47 code (base):** `en`.
**BCP 47 code (simplified variant):** `en-easy`, the kit's `<code>-easy` convention. The kit
labels this variant **Plain Language** and states that it is **not certified Easy Read** (§8a).
**Role in this kit:** one of the kit's **two own languages**. German is the reference language
(`src/config/languages.json`), so most English content is carried over **from German**. This
guide describes the English the kit already ships; the recurring risk is German showing
through (§4, §7).
**Speaker reach:** ⚠ not researched in this pass. The question this guide answers is what the kit
does.
**Script + direction:** Latin script, ASCII letters only in the content, **left-to-right**.
**Register (observed — see §4):** direct second person (**you**), with contractions
(*doesn't*, *it's*) in running text. English has no pronoun choice to make, so there was
nothing to decide.
**Variety (decided 2026-09-23 — see §5, §9):** **American English throughout**: US spelling,
US dates (*July 15, 2026*), and the serial comma always.
**Status:** **shipped (the kit's own language). The variety is decided house style; everything
else is observed practice.** American English was decided as house style on **2026-09-23**, the content
was normalized the same day, and `scripts/check-house-style.mjs` enforces the mechanically
checkable part (spelling list and date order, `en.setup.md` §11). The rest is written from a
**census of the kit's own English strings** (every string in `src/assets/i18n/modules/en*` and
`src/assets/data/translations/*/en*`, counted by script) plus the kit's own directives. **No
external authority was fetched** (no web access); §2 names the ones a later round should check
against. No native-speaker review of the guide itself yet
([QUAL-007](../../base/standards/QUALITY.md): honest status).
**Easy or hard for this kit:** trivial on the mechanics (ASCII letters, whitespace tokenization,
LTR). The problems were **variety and consistency** (American spelling beside British dates, the
serial comma about half the time); those are now decided and normalized. What remains is German
sentence shapes carried over from the reference language (§4, §7) and a few curly quotes among
straight ones (`en.setup.md` §3).

Sources: `src/config/languages.json` · the variety decision
(house style, 2026-09-23) · census of `src/assets/i18n/modules/en`, `en-easy` and
`src/assets/data/translations/*/en`, `en-easy` (126 files per locale on 2026-09-23; `sources`
titles and `searchTerms.json` excluded) · method in §8c and §11 · `scripts/check-house-style.mjs`

---

## 1. Header block

See above. One-line orientation: the kit's English is the target of a German-first workflow,
written to the reader as *you*, in **American English** (decided 2026-09-23). The practical risk
is German structure and idiom leaking into English.

---

## 4. Grammar for translators

**(Observed section: counts from a script census; the German-interference patterns come from
key-matched `de`/`en` pairs.)**

**Register: direct *you*, contractions allowed.** *you* occurs 853× in `en` and 1,193× in
`en-easy`; contractions (*doesn't*, *it's*, *you're*, *don't*) 45× in `en`, 9× in `en-easy`
(counted 2026-09-23). The German *du* and the formal *Sie* both land on *you*, so English has no
pronoun choice to make. The formality the German legal pages keep (`de.md` §4) can only travel
as **tone** (word choice, no contractions); whether the kit's English does that was not measured.

> **Register (observed): direct *you*.** The German register decision of 2026-09-23 (*du*,
> `de.md` §4) needs no English counterpart. Write new copy to the reader as *you*, and leave the
> legal pages' formal tone as it is. Whether contractions help the `en-easy` reader is not
> measured (§8g).

- ✅ observed: **Open your AI agent and say “onboarding”, and it becomes…** · **Click Play and
  watch step by step…**
- ❌ German formality carried over: **Please click on Play and observe step by step.**
  *(illustrative)*

**Person nouns and pronouns.** No *he or she*, *his or her* or *s/he* occurs (0). Person nouns
are neutral (*user*, *developer*, *reader*).

**German compounds become open compounds.** The glossary shows the pattern: *Agentenschleife* →
**Agent Loop**, *Agenten-Gedächtnis* → **Agent Memory**, *Instruktions-Datei* → **Instruction
File**, *Code-Review* → **Code Review**, *MCP-Server* → **MCP Server**.

- ✅ **MCP Server** · **Code Review** · **Instruction File**
- ❌ **MCP-Server** · **Code-Review** *(the German hyphen carried over)*

**German clause order, carried over.** A German sentence often fronts an adverbial and holds the
verb back; a literal English rendering keeps that order. Rebuild the sentence in subject-verb
order.

- ✅ **Auto save exists, but it is off out of the box.** *(observed, `articleDevEnvironment.comfort.autosave`)*
- ❌ **Automatic saving there is, but from the factory it is off.** *(illustrative word-for-word
  rendering of* „Automatisches Speichern gibt es, aber ab Werk ist es aus.“*)*

**Capitalization of nouns.** German capitalizes every noun; English does not. Headwords and
titles are a separate matter: the glossary uses Title Case headwords (*Agent Loop*), and titles
appear in both Title Case (*DNS Resolution: Step by Step*) and sentence case (*Your toolkit*).
No rule is recorded; keep the style of the neighboring strings.

Sources: census of `src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/`
(*you*, contractions, *he or she*; patterns in `en.setup.md` §11) ·
`src/assets/data/translations/glossary/en/*.json` against `…/de/*.json` (compound headwords) ·
key-matched pairs in `src/assets/i18n/modules/de/` and `…/en/` (clause-order example)

---

## 5. Numbers, dates, currency

**(Dates: decided 2026-09-23. Everything else: observed.)**

**Decimal point, comma for thousands.** **USD 2.50**, **40,000 euros**, **100,000 calls**. One
German-style group survives (*1.000*-type grouping, 1 occurrence in `en`).

- ✅ **100,000 calls** · **USD 1.08**
- ❌ **100.000 calls** · **USD 1,08** *(German separators)*

**Percent: glued, mostly.** `en` has **19 glued** (*80%*) against **4 spaced** (*70 %*). The
spaced form is the German pattern leaking through; write it glued. In running text the word is
**percent**, one word (American; *per cent* is British).

- ✅ **80%** · **89 percent**
- ❌ **80 %** *(German spacing)* · **89 per cent** *(British)*

**Dates: month-day-year, decided 2026-09-23.**

> **Dates (decided 2026-09-23): the American
> order.** Spelled out **July 15, 2026** (month, day, comma, year); numeric **07/15/2026** where a
> numeric date is unavoidable; ISO **2026-07-15** only as data. Never *15 July 2026*.

Before the decision the content wrote the British order (*15 July 2026*, 22 in `en`, 16 in
`en-easy`); the pass turned all of them around. After it: 22 month-first dates in `en`, 16 in
`en-easy`, 0 day-first. **Dates the app formats itself** go through `dateLocaleFor()`
(`src/app/utils/date-locale.ts`), which maps `en` and `en-easy` to `en-US`, so the order never
depends on the engine's default region for bare `en`; the bibliography export writes
*August 16, 2026* (`formatCitationDate` in `citation-formats.ts`). Never hand a bare `'en'` to
`toLocaleDateString`.

- ✅ **July 15, 2026**
- ❌ **15 July 2026** *(British order)* · **15. July 2026** *(German day stop)*

The gate (`check-house-style`, rule `en-date`) flags a spelled-out day-month-year date with a
year.

**Time: 24-hour.** **09:14**, **0:05** (14 occurrences); *1 AM* occurs once, in a narrative.

**Currency: ISO code before the amount, or the word after it.** **USD 2.50**, **USD 1.08** and
**150 euros**, **40,000 euros**. A symbol occurs once (**$50,000**). No euro sign occurs.

- ✅ **USD 1.08** · **150 euros**
- ❌ **1.08 USD** *(German order)* · **150 Euro** *(German spelling and capital)*

Sources: the date decision (house style, 2026-09-23) · census of
`src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/` (separator, percent,
date, time and currency patterns listed in `en.setup.md` §11) · `src/app/utils/date-locale.ts`
(`dateLocaleFor()`) · `src/app/pages/sources/citation-formats.ts` (`formatCitationDate`) ·
`scripts/check-house-style.mjs` (`en-date`)

---

## 6. Terminology strategy

**(Observed section: the kit's own glossary is the seed table.)**

**The English headword is the field's term.** For the 36 glossary entries that German keeps in
English, the English headword is the same word, so there is nothing to translate (*Prompt*,
*Commit*, *Context Window*, *Vibe Coding*). For the eight German forms, English uses the field's
own term:

| German headword in the kit | English headword in the kit |
|---|---|
| KI-Agent | **AI Agent** |
| Agentenschleife | **Agent Loop** |
| Agenten-Gedächtnis | **Agent Memory** |
| Agentischer Workflow | **Agentic Workflow** |
| Digitaler Zwilling | **Digital Twin** |
| Leitplanken | **Guardrails** |
| Instruktions-Datei | **Instruction File** |
| Welt-Modelle | **World Models** |

**KI → AI, always.** The German *KI* never appears in English content as a term.

**The sandwich (from [translation-quality](../translation-quality.md)).** Introduce the term,
then say what it means in plain words, then use the term alone. `en-easy` does this in the same
place `de-easy` does: *"This is called reinforcement learning. Reinforcement learning means:
learning through trials."*

Project coinages (C1 terms) are owned by the term-sheet in
[translation-quality](../translation-quality.md), not by this table.

Sources: `src/assets/data/translations/glossary/en/*.json` and `…/de/*.json` (`term` fields; the
five `seed-term-*` placeholders excluded) · `src/assets/i18n/modules/en-easy/easyLanguage.json`

---

## 7. Idiom anti-patterns

**(Observed section: each ✅ rendering is one the kit shipped for the German string under the
same i18n key. The ❌ calques are illustrative, the literal output to avoid.)**

The kit's content moves **German → English**, so this table runs that way. The general law from
[translation-quality](../translation-quality.md) applies: if a back-translation lands word for
word on the German, the English is too literal.

| German | English, as the kit renders it ✅ | Literal calque ❌ | Where |
|---|---|---|---|
| Das Wichtigste auf einen Blick | **Key Takeaways** | *The most important at one glance* | `article*.takeaways.containerTitle` |
| Faustregel | **rule of thumb** | *fist rule* | `articleSecondBrain.privacy.text2` |
| hinter den Kulissen | **behind the scenes** | *behind the backdrops* | `articleApisMcp.enrichment.introText` |
| im Hintergrund | **behind the scenes** | *in the background* (fine, but not what the kit chose) | `articleNetworkingApis.apis.misconception.text` |
| bei null (starten) | **from scratch** | *at zero* | `articleContextEngineering.takeaways.point2` |
| ab Werk | **out of the box** | *from the factory* | `articleDevEnvironment.comfort.autosave` |
| Ausprobieren | **trial and error** | *trying out* | `easyLanguage.content.artRlPrinciple.title` |
| Anfassen statt nur lesen | **Hands-on instead of just reading** | *Touching instead of only reading* | `home.showcase.demos.title` |
| Vertiefung | **Deep dive** | *Deepening* | `articleAgentTests.coverage.deepDive.title` |
| Das Fazit | **The bottom line** | *The fazit* | `articleVibecoding.risks.bottomLine` |
| Spielwiese | **Playground** | *Play meadow* | `settings.playground.title` |
| Werkzeugkasten | **toolkit** | *tool box of the starter* | `articleTerminalIntro.commands.title` |
| Schritt für Schritt | **step by step** | *step for step* | 32 keys, e.g. `articleGitIntro.enrichment.sectionTitle` |

Sources: key-matched `de`/`en` pairs in `src/assets/i18n/modules/de/*.json` and
`src/assets/i18n/modules/en/*.json` (key paths in the table) · ❌ column illustrative, not observed

---

## 8. Simplified-language pendant (`en-easy`)

The subsections follow the kit's uniform 8a–8g order.

**Read this first: the measurement is of the kit's own pair.** `en` and `en-easy` are parallel
files with the same keys and topics, so §8c compares register and nothing else. It describes the
kit's Plain Language, not English plain language in general.

### 8a. The standard — the kit calls it Plain Language, not Easy Read

**The kit's label and disclaimer.** The variant is **Plain Language** in the UI
(`settings.language.easyLanguage`), and the accessibility page says **"Plain Language is not certified
Easy Read"** (`accessibility.limitLanguageLabel`). Keep that wording; never call `en-easy`
"Easy Read".

**Named standards, as the kit cites them.** [accessibility-workflow](../accessibility-workflow.md)
names **ISO 24495-1** (plain-language principles) and **WCAG 2.2 SC 3.1.5** *Reading Level* as
references. ⚠ Neither was consulted for this guide.

**Base rules and term preservation.** `en-easy` inherits the base rules in
[accessibility-workflow](../accessibility-workflow.md). Term preservation holds in practice:
*model* and *algorithm* occur at the same rate in both variants (§8c).

### 8b. Name the axis — clause structure first

The keyness pass puts **function words at the top**: *and*, *of*, *as*, *that*, *to*, *which* are
all rarer in `en-easy`; *you*, *it*, *then*, *this*, *is*, *only*, *there*, *does* are all more
frequent. As in German, the kit's plainer English is built from **short main clauses** rather than
from easier nouns.

**Complex → everyday table, measured on the pair.** Rates per 100,000 tokens, `en-easy` / `en`.

| Standard | Everyday | standard word | everyday word | Verdict |
|---|---|---|---|---|
| directory | folder | 1.4 / 49.1 | 68.1 / 47.9 | holds |
| large | big | 40.6 / 58.4 | 76.8 / 9.4 | holds |
| however | but | 0 / 14.0 | 349.3 / 265.4 | holds |
| therefore | so | 11.6 / 30.4 | 237.7 / 180.0 | holds |
| require | need | 1.4 / 9.4 | 120.3 / 50.3 | holds |
| provide | give | 1.4 / 7.0 | 71.0 / 33.9 | holds |
| because | so | 62.3 / 148.5 | 237.7 / 180.0 | holds |
| utilize | use | 0 / 0 | 259.5 / 145.0 | untestable: *utilize* never occurs |

### 8c. Measure the axis — the kit's own pair

**Method.** As in `de.md` §8c: every string in the i18n modules and content translations for `en`
and `en-easy`, a file kept only when both twins exist (122 per side), tags and placeholders
stripped, only strings of five or more words that end in sentence punctuation. Counted with
`scripts/corpus-measure.mjs stats` and `compare` (`--min 40`, `--probe` for §8b). Sanity word
*the*: 6,044 hits in `en`, 4,951 in `en-easy`.

| | `en` | `en-easy` |
|---|---|---|
| tokens | 85,546 | 68,992 |
| sentences | 7,098 | 10,773 |
| mean / median sentence length (words) | 12.05 / 10 | 6.40 / 6 |
| sentences under 16 words | 74.3 % | 99.4 % |
| tokens over 11 characters | 1.6 % | 0.7 % |
| type/token ratio | 0.080 | 0.063 |

**The direction check passes**: sentence length, long-word share and type/token ratio all point the
same way.

### 8d. 🔴 The do-NOT-simplify list

| Do **not** do this | Why (measured on the pair) |
|---|---|
| ~~replace *which* with *that* to simplify~~ | Both are rarer in `en-easy` (*which* 136.2 vs 282.9, *that* 766.8 vs 1,160.8). The kit drops the relative clause; it does not swap the pronoun. |
| ~~swap *images* for *pictures*~~ | *images* is not a formality marker here: 63.8 in `en-easy` against 53.8 in `en`. `en-easy` uses both. |
| ~~replace *model* or *algorithm* with a folksy stand-in~~ | Flat across the pair (*model* 268 vs 312, *algorithm* 45 vs 47). The kit keeps them. |
| ~~call `en-easy` "Easy Read"~~ | The kit's own label says it is not certified Easy Read (§8a). |

> **→ The rule that follows.** Split the sentence before you swap a word.

### 8e. 🔑 The address decision — `en-easy` keeps *you*, and uses it more

> **`en-easy` addresses the reader as *you*, like `en`, and more often** (2,132 vs 1,281 per
> 100k in the paired corpus). There is no other register to switch to.

- ✅ `en-easy`: **You can change the language at the top.** *(observed, `easyLanguage.dialog.fullPortalNotice`)*
- ❌ `en-easy`: **The language can be changed at the top by the user.**

⚠ The count shows what the kit does, not whether *you* helps the `en-easy` reader.

### 8f. What `en-easy` is built on, in order of leverage

1. **Sentence splitting.** Mean 6.40 words against 12.05; 99.4 % of sentences under 16 words.
   That is below the base rules' ~8–12-word working target, which works here as a ceiling.
2. **Main clause + connector** (*so*, *but*, *then*) instead of subordinate and relative clauses (§8b, §8d).
3. **Term preservation with the sandwich** (§6, §8a).
4. **Direct *you*, used more often** (§8e).
5. **Word swaps last**, and only the ones §8b shows holding.

### 8g. What is still open

1. **Contractions in `en-easy`.** They occur (9×); whether they help or hurt the Plain Language
   reader is not measured.
2. **The corpus extractor is not committed** (see `de.md` §8g).
3. **No comprehension evidence and no outside corpus.** The pair shows the house style only.

American or British English and the serial comma were open here until 2026-09-23; both are
decided now (§5, §9) and apply to `en-easy` exactly as to `en`.

Sources: `src/assets/i18n/modules/en/settings.json`, `…/en/accessibility.json`
(`limitLanguageLabel`) · corpus: the kit's paired `en`/`en-easy` strings, 122 files per side,
85,546 / 68,992 tokens, measured with `scripts/corpus-measure.mjs` (method in §8c) ·
[accessibility-workflow](../accessibility-workflow.md) (base rules, ISO 24495-1, WCAG 3.1.5)

---

## 9. Regional variation

**(Decided 2026-09-23.)**

> **Variety (decided 2026-09-23): American
> English throughout**, in `en` and `en-easy`, and in the English docs. US spelling (*color*,
> *behavior*, *organize*, *center*, *license* as noun and verb, *catalog*, *program*, *modeling*,
> *labeled*, *gray*, *percent*, *judgment*), US dates (§5), and the **serial comma always**
> (*red, green, and blue*). Quotations and proper names keep their own spelling (an institution
> called *… Centre* stays *Centre*); bibliographic titles in `sources` are never restyled.

**One regional build, and it matches.** The kit ships one `en` (and `en-easy`); the `og:locale`
it announces for both is `en_US`, and the dates now say the same thing (§5).

Before the decision the content mixed varieties: 332 American against 128 British forms across
24 spelling pairs in `en`, British dates, and the serial comma in about half of the three-item
lists. The pass of 2026-09-23 normalized all three. Measured after it:

| Feature | `en` (US / UK) | `en-easy` (US / UK) |
|---|---|---|
| *behavior* / *behaviour* | 38 / 0 | 21 / 0 |
| *color* / *colour* | 20 / 0 | 24 / 0 |
| *favorite* / *favourite* | 15 / 0 | 16 / 0 |
| *catalog* / *catalogue* | 10 / 0 | 6 / 0 |
| *percent* / *per cent* | 36 / 1 ⚠ | 40 / 0 |
| date order | *July 15, 2026* (22) / 0 | 16 / 0 |

⚠ The one *per cent* left (`articleSecretsSecurity.json`, `secret.misconception1.text`) is a
known miss: the repo's safety hook refuses agent writes to a file with *Secret* in its name, so a
person has to make that one-word edit. `check-house-style` carries it as an explicit, reasoned
allowlist entry and reports the entry as stale once the string is fixed.

**Serial (Oxford) comma: always.** *X, Y, and Z*, also with *or*. This rule is **not
mechanically checked**: whether *A, B and C* is a three-item list or a clause followed by a pair
(*…in the baseline, between 51 and 67…*) cannot be decided from the text, and a pattern count
over `en` finds mostly the latter among its "no serial comma" hits. Check it when you write or
review a list.

- ✅ **Visualize the behavior of the model.** · **Prompts, tools, and memory.**
- ❌ **Visualise the behaviour of the model.** · **Prompts, tools and memory.**

**What the gate checks.** `check-house-style` (rule `en-spelling`) flags a short, explicit list of
British forms: *colour, behaviour, favour, honour, labour, neighbour, centre, metre, licence,
catalogue, programme, organis…, recognis…, analyse, optimis…, summaris…, visualis…, prioritis…,
customis…, modelling, labelled, travelled, cancelled, judgement, whilst, amongst, per cent,
grey*. The list is short on purpose: every entry is a form American English never uses, so a
hit is never a false positive (*analyses* is left out, because it is also the American plural
of *analysis*).

Sources: the variety decision (house style, 2026-09-23) · census
of `src/assets/i18n/modules/en*/` and `src/assets/data/translations/*/en*/` before and after the
pass (spelling pairs, date orders, list commas; patterns in `en.setup.md` §11) ·
`src/app/services/meta-seo.service.ts` (`og:locale` `en_US`) · `scripts/check-house-style.mjs`
(`en-spelling`, `BRITISH_ALLOW`)

---
