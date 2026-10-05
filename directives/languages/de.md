<!-- base -->
# lang-de — German (Deutsch) — language guide

> **Setup & sources live in [`de.setup.md`](de.setup.md)**: §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.

**Native / English name:** Deutsch / German.
**BCP 47 code (base):** `de`.
**BCP 47 code (simplified variant):** `de-easy`, the kit's `<code>-easy` convention. The kit
labels this variant **„Einfache Sprache“**, never „Leichte Sprache“ (§8a).
**Role in this kit:** one of the kit's **two own languages** and its **reference language**
(`src/config/languages.json`: `"referenceLanguage": "de"`, `"isReference": true`). Content is
authored in German first and carried into English, so this guide describes a house style that
already exists rather than preparing a translation into a new language.
**Speaker reach:** ⚠ not researched in this pass. The question this guide answers is what the kit
does, not how many people read German.
**Script + direction:** Latin script with ä ö ü ß, **left-to-right**.
**Register (decided 2026-09-23 — see §4):** **du**, lower-case, everywhere, `de-easy`
included. Only the legal pages (imprint and privacy notice, both in `impressum.json`) may
stay with **Sie**.
**Status:** **shipped (the kit's own language). Four rows are decided house style, the rest
is observed practice.** Register, gender style, quotation marks and the `de-easy` compound spelling were
decided as the kit's house style on **2026-09-23**, and the content was normalized to them
the same day;
`scripts/check-house-style.mjs` enforces the mechanically checkable part (§11). Everything else
(numbers, percent, abbreviations, terminology) is written from a **census of the kit's own
German strings** (every string in `src/assets/i18n/modules/de*` and
`src/assets/data/translations/*/de*`, counted by script) plus the kit's own directives. **No
external authority was fetched** (no web access), so an observed rule means "this is what the
repo does", not "this is what the Duden says". §2 names the authorities a later research round
should check against. No native-speaker review of the guide itself yet
([QUAL-007](../../base/standards/QUALITY.md): honest status).
**Easy or hard for this kit:** easy on the mechanics (Latin script, whitespace tokenization, LTR,
four precomposed letters in Latin-1). What went wrong in this repo was **consistency**, not
correctness of any single string: three quotation styles, du and Sie in the same module, three
spellings of one `de-easy` compound. Those rows are now decided (§3, §4, §8f) and gated; glued vs
spaced percent signs (§5) are still open.

Sources: `src/config/languages.json` · the house-style
decisions of 2026-09-23 · census of `src/assets/i18n/modules/de`, `de-easy` and
`src/assets/data/translations/*/de`, `de-easy` (126 files per locale on 2026-09-23;
`sources` titles and `searchTerms.json` excluded) · method in §8c and §11 ·
`scripts/check-house-style.mjs`

---

## 1. Header block

See above. One-line orientation: German is the kit's reference language, written in the du
register with Latin script, the generic masculine and „…“ as the quotation style; `de-easy`
marks the joints of long compound nouns with the Mediopunkt. The localization risk in this repo is **drift between
files**, which is why those rows are now decided and gated. National orthography authority
(named, not consulted here): the **Rat für deutsche Rechtschreibung** (§2).

---

## 4. Grammar for translators

**(Register and gender style: decided 2026-09-23. Grammar features: observed, the ones the kit's
own `de`/`de-easy` pair shows to be load-bearing, see §8c.)**

**Word order.** Verb-second in main clauses, verb-final in subordinate clauses. Where this bites
in the kit is §8: `de-easy` uses the verb-final subordinate clause far less (*dass* is 5.6×
rarer, *weil* 4.8× rarer than in `de`, §8c) and writes main clauses joined by *darum*, *dann* or
*aber* instead.

- ✅ `de-easy` (observed pattern): **Das Programm lernt. Darum wird es besser.**
- ❌ in `de-easy`: **Das Programm wird besser, weil es lernt, dass manche Züge schlecht sind.**
  *(illustrative: two stacked subordinate clauses)*

**Register: du, decided 2026-09-23.**

> **Register (decided 2026-09-23): the kit says
> *du* to the reader everywhere, in `de` and in `de-easy`.** Lower-case *du*, *dich*, *dir*,
> *dein…*. The one exception is the legal pages, imprint and privacy notice, which both live in
> `impressum.json`; they **may** stay formal (*Sie*). No other string addresses the reader as *Sie*,
> not a UI hint, not an error message, not a demo.

Before the decision, *du* was the majority (~91 % in `de`, ~93 % in `de-easy`) and *Sie* sat in
the legal pages and in a scatter of UI strings (search hints, the quiz, the export dialog, error
and share messages, SEO descriptions, the seed entries). The normalizing pass of 2026-09-23
converted all of them. Measured afterwards over the 126 files per locale:

| Locale | du-forms (du, dich, dir, dein…) | Sie-forms after a word, outside `impressum.json` | Sie-forms in `impressum.json` |
|---|---|---|---|
| `de` | 1,193 | 0 | 32 |
| `de-easy` | 1,485 | 0 | 58 |

- ✅ **Wähle Format und Dateityp für den Export.** · **Du kannst oben die Sprache wechseln.**
- ❌ **Wählen Sie Format und Dateityp für den Export.** *(the export dialog before the pass)*

**What the gate checks, and what it cannot.** `check-house-style` (rule `de-register`) flags a
capitalized *Sie*, *Ihnen* or *Ihr…* that follows a word or a comma: mid-sentence, the pronoun
*sie* (she/they) is lower-case, so a capital there is always address, and every imperative such
as *Wählen Sie* has that shape. A **sentence-initial** *Sie* is not flagged, because it far more
often means *she* or *they* (about 280 such sentences in the content). A formal *Sie können …* at
the start of a sentence therefore still needs a reader.

**Gender and person nouns: generic masculine, decided 2026-09-23.**

> **Gender style (decided 2026-09-23): the
> generic masculine everywhere**: app strings, content and the German docs alike. *der Nutzer*,
> *die Entwickler*, *jeder Leser*. No pair forms (*Nutzerinnen und Nutzer*, *die Nutzerin oder
> der Nutzer*), no gender star, colon, underscore, slash or Binnen-I (*Nutzer\*innen*,
> *Nutzer:innen*, *Nutzer_innen*, *Nutzer/-innen*, *NutzerInnen*). **Participle nouns stay
> allowed** where they read naturally (*Lernende*, *Studierende*); they are not a gender form.

After the pass the content has 0 star, colon, underscore, slash or Binnen-I forms and 0 pair
forms; *Nutzer*, *Benutzer*, *Anwender*, *Leser*, *Entwickler*, *Schüler* and their plurals occur
78× in `de`, the participle *Lernende* 8×. The German docs mirrors (`docs/de/`), which used pair
and colon forms, follow the same rule.

- ✅ **Der Nutzer bestätigt den Schritt.** · **Lernende sehen ihren Fortschritt.**
- ❌ **Nutzer:innen** · **Nutzer\*innen** · **die Nutzerin oder der Nutzer**

**Compounds with English parts take a hyphen (standard `de`).** Where a German compound joins an
English term, the glossary hyphenates it; the English source writes it open. `de-easy` writes the
same compounds with a Mediopunkt (*Code·review*, *System·prompt*) or closed when short and
lexicalized (*Chatbot*), and keeps the hyphen when a part is an abbreviation (*KI-Agent*,
*MCP-Server*; §8f).

- ✅ **Code-Review** · **MCP-Server** · **System-Prompt** · **KI-Agent** *(glossary `de` terms)*
- ❌ **Code Review** · **MCP Server** *(English open spelling carried into German)*

**Case and agreement on loanwords.** Loans keep German grammar: *der Prompt*, *die Prompts*,
*des Modells*. `de-easy` uses the genitive much less (*des* is 4.2× rarer than in `de`, §8c),
but **not by swapping in *von***: *von* runs at about the same rate in both (501 vs 562 per
100k). The genitive goes away with the long noun phrase that carried it.

- ✅ `de-easy`: **Das Modell gibt ein Ergebnis.** *(illustrative: the phrase is rebuilt)*
- ❌ `de-easy`: **das Ergebnis der Berechnung des Modells** *(illustrative: stacked genitives)*

Sources: the register and gender decisions (house style,
2026-09-23) · `src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/` (register
and gender census after the pass, patterns in §11) · `scripts/check-house-style.mjs`
(`de-register`, `de-gender`) · `src/assets/data/translations/glossary/de/*.json` (compound
terms) · §8c keyness table (dass, weil, des)

---

## 5. Numbers, dates, currency

**(Observed section: counts over all German strings; the app's own date formatting read from
source.)**

**Decimal comma, dot for thousands.** The German content writes **0,861**, **9,94 Prozent**,
**1,08 USD**, and groups thousands with a dot: **100.000**, **21.730**, **1.250**. A handful of
decimal points survive where a value is quoted as a parameter or version (*0.1 = kurzfristig*,
*WCAG 2.2*, *CC BY 4.0*); those are identifiers, not prose numbers.

- ✅ **9,94 Prozent** · **100.000 Testfälle**
- ❌ **9.94 Prozent** · **100,000 Testfälle** *(English separators)*

**Percent: both forms occur, glued is the majority.** `de` has **34 glued** (*80%*) against **6
spaced** (*70 %*); `de-easy` 10 against 4. The kit has not chosen. Write whichever the file you are
editing already uses, and don't mix the two inside one text. ⚠ The spaced form is the one German
typographic guidance usually names. That is a claim for §2's authorities to confirm, not a repo
fact.

- ✅ consistent within one text: **rund 80% … die kritischen 20%**
- ❌ mixed within one text: **rund 80% … eine Reduktion um 70 %**

**Dates: day-month-year.** Spelled-out dates are **15. Juli 2026** (21 in `de`, 15 in `de-easy`);
numeric dates are **01.12.1999** / **11.08.2026** (3). ISO **2026-08-11** appears once, as data.
The app formats dates at runtime through `dateLocaleFor()` (`src/app/utils/date-locale.ts`),
which maps `de` and `de-easy` to `de-DE` so the order never depends on the engine's default; the
bibliography export writes German citations with **05.03.2026** (`formatCitationDate`).

- ✅ **15. Juli 2026** · **11.08.2026**
- ❌ **Juli 15, 2026** · **08/11/2026**

**Time: 24-hour.** **14:30** (14 occurrences). No *a.m./p.m.* anywhere.

**Currency: the unit follows the amount.** **9,00 Euro**, **1,08 USD**, **7,5 Mio. EUR**. The euro
sign occurs once in `de` (after the number). No currency precedes an amount.

- ✅ **1,08 USD** · **9,00 Euro**
- ❌ **USD 1,08** · **€9,00**

**Abbreviations with a full stop: the spacing is inconsistent.** *z. B.* occurs 9× spaced and 12×
unspaced (*z.B.*) in `de`; *d. h.* does not occur. Neither form uses a no-break space. Keep a
file's existing form; see §11 for the check.

Sources: census of `src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/`
(decimal, grouping, percent, date, time, currency and abbreviation patterns listed in §11) ·
`src/app/utils/date-locale.ts` (`dateLocaleFor()`, used by the news, learning-area,
learning-path, feedback and content-hub dates) · `src/app/pages/sources/citation-formats.ts`
(`formatCitationDate`)

---

## 6. Terminology strategy

**(Observed section: the kit's own glossary is the seed table.)**

**Loanword practice: the English term usually stays.** Of the kit's 44 real glossary entries,
**36 keep the English term in German** (*Prompt*, *Commit*, *Context Window*, *Prompt Injection*,
*Vibe Coding*, *Retrieval-Augmented Generation (RAG)*), three of them only re-hyphenated
(*Code-Review*, *MCP-Server*, *System-Prompt*, §4). Eight use a German form, and they fall into
two groups:

- **A German compound where one reads naturally:** *Agentenschleife* (Agent Loop),
  *Agenten-Gedächtnis* (Agent Memory), *Instruktions-Datei* (Instruction File), *Welt-Modelle*
  (World Models), *Digitaler Zwilling* (Digital Twin), *Leitplanken* (Guardrails), *Agentischer
  Workflow* (Agentic Workflow).
- **AI → KI** everywhere: *KI-Agent*; *KI* 642× in `de` against *AI* 23× (the English
  abbreviation survives in proper names and quotations).

**One term, two spellings, flagged.** *Hallucination* is the glossary headword while the running
text uses the German *Halluzination* 9× (and *Hallucination* 5×). *Code-Review* (8×) and *Code
Review* (1×) both occur. Pick the glossary form when you touch such a string.

**The sandwich (from [translation-quality](../translation-quality.md)), as the kit writes it.**
The German content introduces a kept English term and explains it right after. `de-easy` does this
most visibly: *„Das heißt Reinforcement Learning. Reinforcement Learning bedeutet: Lernen durch
Versuche.“* Keep the term, give the German explanation, then use the term alone.

**Seed field vocabulary (the kit's glossary, `de` / `en`).**

| Concept (EN headword) | German headword in the kit | Type |
|---|---|---|
| AI Agent | **KI-Agent** | calque + loan |
| Agent Loop | **Agentenschleife** | native compound |
| Agent Memory | **Agenten-Gedächtnis** | native compound |
| Agentic Workflow | **Agentischer Workflow** | adapted adjective + loan |
| Code Review | **Code-Review** | loan, hyphenated |
| Digital Twin | **Digitaler Zwilling** | calque |
| Guardrails | **Leitplanken** | calque |
| Instruction File | **Instruktions-Datei** | native compound |
| MCP Server | **MCP-Server** | loan, hyphenated |
| System Prompt | **System-Prompt** | loan, hyphenated |
| World Models | **Welt-Modelle** | calque, hyphenated |
| Prompt · Commit · Diff · Build · Linter · Repository | **unchanged** | loan |
| Context Window · Function Calling · Prompt Engineering | **unchanged** | loan |
| Hallucination | **Hallucination** (headword) / *Halluzination* (body text) | ⚠ split, see above |

Project coinages (C1 terms) are owned by the term-sheet in
[translation-quality](../translation-quality.md), not by this table.

Sources: `src/assets/data/translations/glossary/de/*.json` and `…/en/*.json` (`term` fields; the
five `seed-term-*` placeholders excluded) · census counts for KI/AI, Halluzination/Hallucination,
Code-Review/Code Review over `src/assets/i18n/modules/de*/` and `src/assets/data/translations/*/de*/`
· `src/assets/i18n/modules/de-easy/easyLanguage.json` (the sandwich example)

---

## 7. Idiom anti-patterns

**(Observed section: each ✅ rendering is one the kit actually shipped, found by matching the
same i18n key in `de` and `en`. The ❌ calques are illustrative, the literal output to avoid.)**

The kit's content moves mostly **German → English**, but the pairs below hold in both
directions. The general law from [translation-quality](../translation-quality.md) applies: if a
back-translation lands word for word on the source, it is too literal.

| English | German, as the kit renders it ✅ | Literal calque ❌ | Where |
|---|---|---|---|
| Key Takeaways | **Das Wichtigste auf einen Blick** | *Schlüssel-Mitnahmen* | `article*.takeaways.containerTitle` |
| step by step | **Schritt für Schritt** | *Schritt bei Schritt* | 32 keys, e.g. `articleGitIntro.enrichment.sectionTitle` |
| behind the scenes | **hinter den Kulissen** / **im Hintergrund** | *hinter den Szenen* | `articleApisMcp.enrichment.introText`, `articleNetworkingApis.*` |
| rule of thumb | **Faustregel** | *Regel des Daumens* | `articleSecondBrain.privacy.text2` |
| from scratch | **bei null** / **komplett neu** | *von Kratzer* | `articleContextEngineering.takeaways.point2` |
| out of the box | **ab Werk** | *aus der Box heraus* | `articleDevEnvironment.comfort.autosave` |
| trial and error | **Ausprobieren** | *Versuch und Irrtum* (stiff in `de-easy`) | `easyLanguage.content.artRlPrinciple.title` |
| hands-on | **Anfassen statt nur lesen** | *Hände drauf* | `home.showcase.demos.title` |
| deep dive | **Vertiefung** | *tiefer Tauchgang* | `articleAgentTests.coverage.deepDive.title` |
| the bottom line | **Das Fazit** | *die untere Linie* | `articleVibecoding.risks.bottomLine` |
| at a glance | **auf einen Blick** | *bei einem Blick* | `home.showcase.timeline.title` |
| playground | **Spielwiese** | *Spielplatz* (a children's playground) | `settings.playground.title` |
| toolkit | **Werkzeugkasten** | *Werkzeugsatz* | `home.showcase.tools.title` |

**Two renderings that stayed English on purpose.** *Best Practice(s)* and *under the hood* →
*Unter der Haube* are kept close to the English in the kit (`articleVibecoding.misconceptions.safe.text`,
`learningPaths.underTheHood.title`). Treat them as established, not as calques to fix.

Sources: key-matched `de`/`en` pairs in `src/assets/i18n/modules/de/*.json` and
`src/assets/i18n/modules/en/*.json` (key paths in the table) · ❌ column illustrative, not observed

---

## 8. Simplified-language pendant (`de-easy`)

The subsections follow the kit's uniform 8a–8g order.

**Read this first: German is the one language in this kit where §8c needed no outside corpus.**
The kit ships `de` and `de-easy` as parallel files: same keys, same topics, same publisher, written
for different readers. That is the same-document pair the authoring directive calls the strongest
design, and it is on disk. What the measurement describes is **what this kit's Einfache Sprache
does**. It is evidence about the house style, not about German plain language in general.

### 8a. The standard — the kit calls it Einfache Sprache and says what it is not

**The kit's own label and disclaimer.** The variant is called **„Einfache Sprache“** in the UI
(`settings.language.easyLanguage`), and the accessibility page states the boundary itself: *„Einfache
Sprache ist keine geprüfte Leichte Sprache“*. The texts are written with AI support and edited,
they follow the basic principles of Leichte Sprache (short sentences, simple words, clear
structure), and they are **not checked by a test group of people with learning difficulties**
(`accessibility.limitLanguageText`). Keep that wording: never call `de-easy` „Leichte Sprache“.

**Named national norms, as the kit cites them.** [accessibility-workflow](../accessibility-workflow.md)
names **DIN 8581-1 *Einfache Sprache*** and **DIN SPEC 33429 *Leichte Sprache*** as marked
reference examples, binding only where local law says so. ⚠ Neither was consulted for this guide;
§2 lists them for the next round.

**How `de-easy` relates to the kit's base rules.** It inherits the base rules in
[accessibility-workflow](../accessibility-workflow.md) (one idea per sentence, everyday words,
keep and explain the technical term, digits for numbers, a consistent literal tone). §8c shows
where the kit's German practice goes further than those rules.

**Term preservation (binding, restated).** Keep the technical term and explain it. The kit does
this: *Modell* and *Algorithmus* occur at the same rate in `de-easy` as in `de` (§8c), and the
sandwich *„Reinforcement Learning bedeutet: Lernen durch Versuche“* is the pattern (§6).

### 8b. Name the axis — clause structure first, words second

The keyness pass over the pair (§8c) puts **grammatical words at the top, not vocabulary**: the
largest differences are *und*, *dass*, *sondern*, *des*, *weil*, *bevor*, *statt* (all rarer in
`de-easy`) and *dann*, *darum*, *es*, *gibt*, *heißt*, *aber* (all more frequent). The axis that
separates the kit's plainer German from its standard German is **clause architecture**:
subordinate clauses and genitives out, short main clauses with a connector in.

**Complex → everyday table, measured on the pair.** Rates per 100,000 tokens, `de-easy` / `de`.

| Standard | Everyday | standard word | everyday word | Verdict |
|---|---|---|---|---|
| weil (clause) | darum (new sentence) | 27.4 / 131.6 | 108.2 / 13.9 | holds |
| deshalb | darum | 41.1 / 113.8 | 108.2 / 13.9 | holds |
| jedoch | aber | 0 / 6.3 | 364.1 / 194.8 | holds |
| ermöglicht | hilft | 1.5 / 11.4 | 131.0 / 35.4 | holds |
| verwenden | benutzen | 4.6 / 13.9 | 22.9 / 3.8 | holds |
| Verzeichnis | Ordner | 1.5 / 13.9 | 68.6 / 51.9 | holds |
| erhalten | bekommen | 6.1 / 12.6 | 16.8 / 13.9 | flat |

### 8c. Measure the axis — the kit's own pair

**Method.** Two corpora built from the repo: every string value in the i18n modules and the
content translations for `de` and for `de-easy`, **keeping a file only when both twins exist**
(122 files per side), HTML tags and `{{placeholders}}` stripped, and **only strings of five or
more words that end in sentence punctuation** (UI labels are not sentences). Counted with
`scripts/corpus-measure.mjs stats` and `compare` (`--min 40`, and `--probe` for the table in
§8b). Sanity word *und*: 2,007 hits in `de`, 799 in `de-easy`, so the tokenizer sees it.

| | `de` | `de-easy` |
|---|---|---|
| tokens | 79,053 | 65,636 |
| sentences | 7,110 | 10,846 |
| mean / median sentence length (words) | 11.12 / 9 | 6.05 / 6 |
| sentences under 16 words | 78.3 % | 99.5 % |
| tokens over 11 characters | 6.5 % | 3.4 % |
| type/token ratio | 0.137 | 0.102 |

**The direction check passes.** Shorter sentences, fewer long words and a lower type/token ratio all
point the same way, so the sentence-length figure is not an extraction artifact. ⚠ The splitter
breaks after *z. B.* and after a day number such as *15.*; that shortens both sides a little and
German more than English. It does not change the direction.

**Address, measured.** *du* runs at 1,688 per 100k in `de-easy` against 1,049 in `de`: the plainer
variant addresses the reader **more** often, in the same register.

### 8d. 🔴 The do-NOT-simplify list

| Do **not** do this | Why (measured on the pair) |
|---|---|
| ~~replace *dass* with a different conjunction~~ | *dass* is 5.6× rarer in `de-easy` (47.2 vs 263.1), but no substitute rises in its place. The kit drops the clause and writes two sentences. A word swap keeps the structure the variant is avoiding. |
| ~~swap *nutzen* for *benutzen*~~ | *nutzen* is **more** frequent in `de-easy` (123.4 vs 70.8). It is not a formality marker in this kit. |
| ~~swap *Rechner* or *Computer* in either direction to "simplify"~~ | Both are more frequent in `de-easy` (*Computer* 371.7 vs 53.1, *Rechner* 44.2 vs 31.6). The plain variant names the machine more often, it does not prefer one name. |
| ~~replace *Bilder* with a paraphrase~~ | *Bilder* is already the plainer choice: 115.8 vs 40.5. |
| ~~replace a technical term with a folksy stand-in~~ | *Modell* (181 vs 202) and *Algorithmus* (47 vs 39) are flat. The kit keeps them; keep them. |
| ~~call `de-easy` „Leichte Sprache“~~ | The kit's own disclaimer says it is not (§8a). |

> **→ The rule that follows.** In this kit, German gets plainer by **splitting sentences**, not
> by swapping words. When a `de-easy` sentence feels hard, look for the subordinate clause first.

### 8e. 🔑 The address decision — `de-easy` keeps du

> **`de-easy` uses du, exactly as `de` does (§4), and addresses the reader more often.** It
> does NOT switch to Sie. The legal pages are the exception in both variants.

- ✅ `de-easy`: **Du kannst oben die Sprache wechseln.** *(observed, `easyLanguage.dialog.fullPortalNotice`)*
- ❌ `de-easy`: **Sie können oben die Sprache wechseln.**

This is the register decision of 2026-09-23 (§4), which names `de-easy` explicitly. ⚠ No
count can say whether du *helps* the `de-easy` audience; the decision is a house-style choice,
not a measured effect.

### 8f. What `de-easy` is built on, in order of leverage

1. **Sentence splitting.** Mean 6.05 words against 11.12, 99.5 % of sentences under 16 words. This is
   the kit's main lever. Note: it runs **below** the base rules' ~8–12-word working target; the
   base rule is a ceiling here, not a goal to lengthen towards.
2. **Main clause + connector instead of subordinate clause** (*darum*, *dann*, *aber*; §8b).
3. **Fewer genitives** (*des* 4.2× rarer), dropped with the long noun phrase rather than
   replaced by *von* (which is flat, §4).
4. **Term preservation with the sandwich** (§6, §8a).
5. **du, used more often** (§8e).
6. **Word swaps last**, and only the ones §8b shows holding.

**Compound spelling in `de-easy`: the Mediopunkt, decided 2026-09-23.** Before the decision
the same compound appeared three ways (*Computerprogramm*, *Computer·programm*,
*Computer-Programm*). The house style chose the **Mediopunkt** (U+00B7 ·) for
`de-easy`; **standard `de` uses no Mediopunkt** and keeps
ordinary German orthography. A first pass split every compound whose parts showed anywhere, and
it split too much: wrong German (*Grund·speichern anmachen*), verbs and adjectives
(*zusammen·hängen*, *nicht·linear*), short everyday words (*Werk·zeug* 85×, *Start·seite*,
*Wörter·buch*), while long compounds stayed half-closed (*Produktlebenszyklus·management*). The
user refined the rule the same day: **the Mediopunkt marks the joints of long, hard compound
nouns, and nothing else.**

> **The rule (decided 2026-09-23).** Count the letters of the compound's **base form**
> (nominative singular, joiners not counted).
>
> 1. **Nouns only.** No Mediopunkt in a verb, adjective, adverb or participle, and none after a
>    particle or prefix (*zusammen-*, *zurück-*, *nicht-*, *meist-*, *mehr-*, *vor-*, *gegen-*,
>    *selbst-*, *meta-*, *hyper-* …): *zusammenhängen*, *regelbasiert*, *nicht linear*,
>    *Vorwissen*, *Metadaten*. A nominalized verb gets no Mediopunkt either; if the closed form
>    reads badly, rephrase: *Code·schreiben* → *Code schreiben*, *das Fortschritt·speichern* →
>    *das Speichern von deinem Fortschritt*, *Recht auf Vergessen·werden* → *Recht, vergessen zu
>    werden*.
> 2. **Short compounds are closed.** A base form of **10 letters or fewer** is written as one
>    word, in every inflected form: *Werkzeug(e/n)*, *Startseite*, *Wörterbuch*, *Webseite(n)*,
>    *Lernpfad(e)*, *Regeldatei*, *Chatbot*, *Testdatei* and *Testdateien*.
> 3. **Long compounds are split at every joint**, recursively: split at the main joint, then
>    treat each part by the same rule. A part of 10 letters or fewer stays closed, even if it is
>    a compound itself (*Werkzeug·kasten*, *Git·zeitleiste*); a longer part that is a compound
>    is split again (*Produkt·lebens·zyklus·management*, *Daten·schutz·grund·verordnung*,
>    *Computer·schnitt·stelle*). A long part that is a derivation, not a compound, stays whole
>    (*Entwicklungs·umgebung*, *Verständnis·check*).
> 4. **Stop-list: lexicalized words stay closed at any length** — words every reader knows as
>    one word, or whose meaning does not come from the parts: *Schreibtisch*, *Telefonnummer*,
>    *Telefonbuch*, *Kühlschrank*, *Meilenstein*, *Mittelpunkt*, *Schwerpunkt*, *Reihenfolge*,
>    *Leerzeichen*, *Screenreader*, *Hyperparameter*. The list with reasons is `STOP_LIST` in
>    `scripts/check-house-style.mjs`; add to it rather than split an everyday word.
> 5. **Names and English words keep the joint in a short compound**, where the closed form would
>    hide it: *Git·befehle*, *Turing·test*, *Wetter·app*, *Tab·taste*, *Code·review*,
>    *Cookie·wahl*. English words that German writes closed are not exempt (*Chatbot*,
>    *Webseite*, *Spamfilter*). The list is `FOREIGN_PARTS` in the same script.
> 6. **The hyphen stays** where it did (the old rule (c)): a part is an **abbreviation** (all
>    capitals, two or more letters), a **single letter** or **contains a digit** (*KI-Agent*,
>    *MCP-Server*, *E-Mail*, *K-Means*, *3D-Modell*, *10-mal*); compounds of **three or more
>    hyphenated parts** (*Deep-Learning-Grundlagen*); **English fixed terms** hyphenated in English
>    (*Few-Shot*, *Fine-Tuning*, *Opt-Out*, *Retrieval-Augmented Generation*); **code tokens**
>    (*git-Ordner*, */new-content*); **pronunciation spellings** (*Kohd-Riwju*, *Ei-Ai*). Any
>    other hyphen between two full words becomes closed (≤ 10 letters) or a Mediopunkt.
> 7. **One compound, one spelling**, the second part lower-case after the dot. Glossary terms
>    (`term`, `alternativeNames`) follow the same rule, and the body texts write a term exactly
>    as the headword does: highlighting matches the string, not its folded form.

- ✅ `de-easy`: **Ein Computer·programm hilft dir.** · **Nimm ein Werkzeug von der Startseite.**
  · **Die Daten·schutz·grund·verordnung schützt dich.** · **Der KI-Agent schreibt eine E-Mail.**
- ❌ `de-easy`: **Nimm ein Werk·zeug von der Start·seite.** *(short, everyday)* ·
  **Wie Dinge zusammen·hängen.** *(verb)* · **Die Datenschutz·grundverordnung** *(half split)* ·
  **Grund·speichern anmachen** *(a nominalized verb, and not German)* · **Der KI·agent** *(abbreviation)*

Measured after the second pass, over the 125 `de-easy` files the gate reads (`searchTerms.json`
and `sources` excluded): **951 Mediopunkt compounds in 93 files** (before: 1,275 in 102), 9 of
them with three or more parts; 47 are short compounds kept by rule 5 (27 distinct).
*Computer·programm* 4×, *Sprach·modell…* 13×, *Lern·fortschritt…* 15×, *Laufzeit·umgebung* 18×;
*Werkzeug…* is closed again (85×), and so is *Webseite…* (31×). The pass removed the dot from
483 compounds (short, non-noun or stop-listed), split 9 half-split compounds further, split 174
closed long compounds and rewrote 18 phrases.

**What the gate checks.** `check-house-style` enforces the mechanical part: `de-easy-wordclass`
(a Mediopunkt word that starts lower-case, one after a listed particle, one ending in a listed
infinitive or adjective part — *speichern*, *spielen* and *laden* are left out because they are
also noun plurals, so *Fortschritt·speichern* needs a reader); `de-easy-short` (≤ 10 letters
without a `FOREIGN_PARTS` part, and any `STOP_LIST` word split by a dot, also inside a longer
compound); `de-easy-split` (a closed word and a Mediopunkt word that share a stem, e.g.
*Testdatei* beside *Test·dateien*); `de-easy-deep` (a long part that the corpus splits elsewhere,
or two parts of a 3-part compound that it writes closed elsewhere); `de-easy-hyphen` (rule 6);
`de-mediopunkt` (any Mediopunkt in standard `de`, except a string that quotes the `de-easy`
spelling as an example — each such string sits in `MEDIOPUNKT_ALLOW` with its reason). **Not checked:** a long compound written
closed that never appears split (*Laufzeitumgebung* before this pass) — telling a compound from
a derivation needs a dictionary, so that stays with the reader; and the base-form length of an
inflected word, which the gate only approximates by stems. **Search:** the glossary search folds
the Mediopunkt and the hyphen family away on both sides (`foldForSearch()` in
`src/app/utils/search-fold.ts`), so a reader who types *Code-Review* or *Codereview* still finds
*Code·review*, and *Werk·zeug* still finds *Werkzeug*.

### 8g. What is still open

1. **The corpus extractor is not committed.** §8c's method is described exactly, but the small
   script that turns i18n JSON into `corpus-measure` input lives outside the repo. Committing it
   would make the numbers re-runnable in one command.
2. **No comprehension evidence.** The measurement says what the kit writes, not whether readers
   understand it better. No reader test group has seen `de-easy` (§8a says so publicly). That
   includes the Mediopunkt: it is a house-style decision, not a tested aid, and so are its
   thresholds (10 letters, the stop-list, the name/English exception in §8f).
3. **No outside corpus was compared.** Whether the kit's Einfache Sprache is closer to DIN 8581-1
   or to Leichte Sprache practice would need an external German plain-language corpus.

Compound style, register and gender style were open here until 2026-09-23; they are decided now
(§8f, §4).

Sources: `src/assets/i18n/modules/de/settings.json`, `…/de/accessibility.json`
(`limitLanguageLabel`, `limitLanguageText`), `…/de-easy/easyLanguage.json` · corpus: the kit's
paired `de`/`de-easy` strings, 122 files per side, 79,053 / 65,636 tokens, measured with
`scripts/corpus-measure.mjs` (method in §8c) · [accessibility-workflow](../accessibility-workflow.md)
(base rules and the named DIN norms) · the Mediopunkt
decision (house style, 2026-09-23) · compound census after the pass over `src/assets/i18n/modules/de-easy/`
and `src/assets/data/translations/*/de-easy/` · `scripts/check-house-style.mjs` ·
`src/app/utils/search-fold.ts`

---

## 9. Regional variation

**(Observed section.)**

**One German, no regional build.** The kit ships a single `de` (and `de-easy`); there is no `de-AT`
or `de-CH` locale in `src/config/languages.json`. The spelling is the **ß-using standard**: *ß*
occurs throughout (*heißt*, *groß*, *Maß*), so Swiss orthography (ss for ß) is not the target.

- ✅ **heißt** · **groß**
- ❌ **heisst** · **gross** *(Swiss spelling, not the kit's target)*

**Neutrality strategy.** Write standard German without regionalisms. The currency in examples is
the **euro** (*9,00 Euro*) or a named ISO code (*USD*); no Swiss franc occurs. ⚠ A reader in
Austria or Switzerland gets the same text; no regional vocabulary review has been done.

Sources: `src/config/languages.json` (locale list) · census of `src/assets/i18n/modules/de*/`
(ß spellings, currency mentions)

---
