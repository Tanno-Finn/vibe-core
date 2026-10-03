<!-- base -->
# lang-es — Spanish (español) — language guide

> **Setup & sources live in [`es.setup.md`](es.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** español / castellano — Spanish.
**BCP 47 code (base):** `es`.
**BCP 47 code (simplified variant):** `es-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`es-x-simple`), but the kit token `es-easy` is the one
that counts here.
**Speaker reach:** ~**599 million** speakers worldwide (≈**599.4 million**, Instituto Cervantes
2024 count, including native, limited-competence, and learner speakers). Official at state level
in Spain, across most of the Americas (from Mexico to Argentina and Chile), and in Equatorial
Guinea; co-official with indigenous or regional languages in several jurisdictions.
**Script + direction:** Latin script (`Latn`), core Unicode **Basic Latin U+0000–U+007F** plus
**Latin-1 Supplement U+0080–U+00FF** (for `á é í ó ú ü ñ ¿ ¡`); **left-to-right**.
**Status:** planned — authored from external desk research (a standard research pass plus one
targeted follow-up for the thin sections), covering base `es` and the `es-easy` pendant. A
**cite-verify pass (this revision, 2026-07-24)** independently confirmed the load-bearing
standards anchors (ISO 24495-1:2023, UNE-ISO 24495-1:2024, UNE 153101:2018 EX, the FundéuRAE
*inteligencia artificial* recommendation, CLDR 48.2 `es`); several authority sites (RAE, Fundéu,
ISO, UNE) block automated fetching and were corroborated via independent catalogs rather than
re-fetched directly — noted at point of use. **Not yet reviewed by a native speaker** — per the
authoring directive's "second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this
header records that gap honestly.
**Easy or hard for this kit:** Spanish is one of the *easy* languages for the kit. Latin script
with **whitespace word separation** — standard tokenization, word-boundary highlighting, and
hyphenation all work; **left-to-right**, no bidi, no contextual shaping. The real risks are small
and specific: **diacritic integrity** (`á é í ó ú ü` and `ñ` must survive fonts, encoding, and
machine translation intact — ASCII-flattening to `solucion`/`n` is the classic defect);
**mandatory paired punctuation** (opening `¿` and `¡` are not optional); the **decimal-comma vs
decimal-point** split between Spain and much of Latin America; and a **register decision**
(tú/usted/ustedes/vosotros) that had to be made before any second-person copy — now taken and recorded (§4).

Sources: <https://cvc.cervantes.es/> (Instituto Cervantes *El español en el mundo* 2024 figure,
599.4 M) · <https://www.rae.es/> · <https://www.unicode.org/charts/PDF/U0080.pdf>

---

## 1. Header block

See above. One-line orientation: Spanish is an Ibero-Romance, SVO (flexible), LTR language in the
Latin script with a strong pan-Hispanic standard governed jointly by the RAE and ASALE; the
localization risks concentrate in **diacritics, paired `¿¡` punctuation, number formatting
(decimal comma vs point), and register neutrality across Spain/Latin America**.

---

## 4. Grammar for translators

**Word order.** Spanish is **SVO** by default but **markedly more flexible than English** —
clitic pronouns, topicalization, and information focus routinely move constituents. Subject
pronouns are usually **dropped** (pro-drop): the verb ending carries the person.

- ✅ **Guardé el archivo** ("I saved the file") — no explicit *yo*.
- ❌ **Yo guardé el archivo** as plain neutral narration — the redundant *yo* calques English's
  obligatory subject pronoun (fine only for contrastive emphasis).

**Register — and the project's recorded choice.** Spanish second-person address is a system, not a
flat "you": **tú** (singular informal), **usted** (singular formal), **vosotros/vosotras**
(plural informal, **Spain only**), **ustedes** (plural — formal everywhere, and the *only* plural
in Latin America). Some regions use **voseo** (*vos*) instead of *tú*; that is regional and not
the project default.

> **Register decision (human-gate): tú (singular) + ustedes (pan-Hispanic
> neutral plural); vosotros avoided — taken and recorded.** It is recorded here as a project
> decision, **binding for all second-person copy in `es` and `es-easy`**. Rationale: an
> educational, learner-facing voice reads best with the close, informal **tú** in the singular,
> while **ustedes** as the plural is understood across *all* Spanish regions, whereas **vosotros**
> is peninsular-marked and reads as foreign to Latin-American audiences. Its source is a
> **neutral-Spanish localization style guide (localization source)** — *not* an RAE/ASALE ruling;
> the academies do not govern register. No drift to *vosotros* (verb forms *-áis/-éis*, pronoun
> *os*) and no unmarked *voseo*.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ singular: **Haz clic aquí para empezar.** (tú imperative)
- ✅ plural: **Hagan clic aquí para empezar.** (ustedes imperative — works pan-Hispanically)
- ❌ plural, peninsular: **Haced clic aquí para empezar.** (vosotros — avoided per the decision)

The grammar features that break a naive EN/DE → ES translation:

**(1) Gender & agreement are pervasive.** Every article, adjective, and participle agrees in
gender and number with its noun; a single English adjective form must be resolved.
- ✅ **la red neuronal está entrenada** · **el modelo está entrenado**
- ❌ **la red neuronal está entrenado** (adjective/participle not agreeing with feminine *red*).

**(2) Adjective placement changes meaning.** Most descriptive adjectives follow the noun;
pre-posing some shifts sense.
- ✅ **una explicación sencilla** ("a simple/plain explanation").
- ❌ **una simple explicación** — grammatical, but means "a *mere* explanation", not "a simple
  one". Placement is not free.

**(3) Clitic object pronouns attach and reorder.** English object pronouns map to Spanish clitics
that pre-pose to finite verbs or enclise onto infinitives/imperatives/gerunds — never in English
order.
- ✅ **vamos a verlo** / **lo vamos a ver** ("we're going to see it") · **se lo dije** ("I told
  it to him/her").
- ❌ **vamos a ver lo** / a word-for-word "to see it" with a detached English-order pronoun.

**(4) Subjunctive after recommendation, wish, or uncertainty.** Triggers that English leaves in
the indicative take the subjunctive in Spanish.
- ✅ **Es importante que hagas clic en Guardar.** ("It is important that you click Save.")
- ❌ **Es importante que haces clic…** (indicative *haces* where the subjunctive *hagas* is
  required).

**(5) Negation and `no` placement.** **`no` directly precedes the verb** (and any pre-posed
clitics); Spanish also uses grammatical double negation.
- ✅ **No lo entiendas mal.** ("Don't misunderstand it.") · **No hay ningún error.** (double
  negative is correct Spanish, not an error).
- ❌ **Lo no entiendas** / dropping the second negative element as in English (*No hay error* for
  "there is no error" is fine, but *No hay algún error* is wrong).

Sources: <https://www.rae.es/dpd/> (agreement, clitics, subjunctive, negation — canonical RAE
grammar/DPD; pages 403 to the crawler, corroborated via independent references) · register:
**neutral-Spanish localization style guide (localization source)**, vendor name/URL withheld per
the kit's source-neutrality rule; corroborated by commercial language-learning usage references
(brands withheld) confirming *vosotros* is peninsular-marked and *ustedes* the neutral plural.

---

## 5. Numbers, dates, currency

**Digit system.** Western Arabic numerals **0–9** throughout; no alternate digit set. No
native-digit complication (unlike Bengali/Arabic).

**Decimal separator — the Spain/Latin-America split.** This is the number defect that matters.
- **Spain (`es-ES`) and much of South America:** decimal separator is the **comma**, thousands
  grouped with a **dot** or **thin space**. CLDR `es` → **`1.234,5`** (dot group, comma decimal).
- **Mexico and much of the rest of Latin America (`es-419`/`es-MX`):** decimal separator is the
  **point**, thousands grouped with a **comma** → **`1,234.5`**.

- ✅ (es-ES) **3,14** · **1.234.567** (or **1 234 567**) · ❌ (es-ES) **3.14** / **1,234,567**.
- ✅ (es-MX) **3.14** · **1,234.5** · ❌ (es-MX) **3,14**.
- **Rule:** pick the separator convention **per target locale** and never mix conventions inside a
  single number or a single page (see §11). The RAE *Ortografía* recommends the **thin space** as
  the thousands separator (and discourages the dot/comma there to avoid ambiguity), while CLDR `es`
  ships the dot — reconcile per deployment; drive concrete formats from **live CLDR data**, not a
  value hard-coded here.
- **The thin space is a character, not a typed space.** The two gaps in the parenthesized
  alternative on the first ✅ line above are real **U+2009 THIN SPACE**, matching the RAE
  recommendation this guide names; an ordinary U+0020 is a different character and is not what RAE
  recommends. Copy that form rather than retyping it — on screen the two are indistinguishable.
  ⚠ RAE prescribes the thin space but this guide has **no source for its breaking behavior**, so
  it asserts **no** no-break variant — if line-breaking inside numbers matters for a deployment,
  decide it there and record the decision. The `10 €` spacing below is written with an ordinary
  space, which is all the cited source claims for it: it names "a space", not a particular one.

**Dates & times.** Order is **day-month-year**: **24/07/2026** or, written out, **24 de julio de
2026** (month name lowercase — Spanish does **not** capitalize month or weekday names). Time is
commonly **24-hour** in formal/technical interfaces (**14:30**), with 12-hour forms in some
consumer/regional contexts. **ISO 8601 (`YYYY-MM-DD`)** is a backend convention, not the end-user
default.

- ✅ **lunes, 24 de julio de 2026** · ❌ **Lunes, 24 de Julio de 2026** (wrongly capitalized
  weekday/month).

**Currency.** Placement is locale-specific — **parameterize per deployment (§9):**
- **Euro (Spain):** symbol **after** the amount with a space — **`10 €`** (RAE/typographic
  practice). ❌ **`€10`** in Spanish euro contexts.
- **Latin America:** the local symbol (often **`$`** for many pesos, plus disambiguating codes
  like MXN/ARS/COP) commonly precedes — **`$10`** — with wide regional variation.
- Precise per-country symbol/placement beyond the euro example is **⚠ region-specific**; drive it
  from CLDR locale data per market rather than hard-coding one placement.

Sources: <https://www.unicode.org/cldr/charts/latest/summary/es.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (CLDR 48, 2025-10-29; `es`
`1.234,5`, `es-MX` `1,234.5`) · <https://www.rae.es/ortografía/> (thin-space grouping,
lowercase months, `10 €` placement — canonical RAE, corroborated indirectly).

---

## 6. Terminology strategy

**Loanword policy.** Spanish technical usage keeps **entrenched loanwords** where they are the
norm (**software, internet, router, hardware, bit, byte**) but **prefers a Spanish equivalent
where an official recommendation exists** (Fundéu/RAE). The working rule: **prefer the sourced
Spanish term when there is one; otherwise keep the established sector term/loan** — do not coin a
novel native word just for purism. Transliteration is essentially N/A (Latin script); foreign
product/model names keep their spelling.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give the reader the Spanish term + the English
original + one short plain clause of what it means; then use the Spanish term alone afterwards.
Instantiated:

> **red neuronal** (*neural network*) — un modelo computacional organizado en capas de nodos que
> imita, de forma simplificada, las neuronas del cerebro. — then **red neuronal** alone on every
> later mention.

(The explanatory clause is authored per the sandwich format, not a sourced string.)

**Seed field vocabulary (AI / ML).** Two tiers by provenance:

**Fundéu-backed core (recommended, sourced):**

| Concept (EN) | Spanish term | Provenance |
|---|---|---|
| Artificial intelligence | **inteligencia artificial** — lowercase; sigla **IA** in caps | FundéuRAE ficha ✓ (independently confirmed) |
| Machine learning | **aprendizaje automático** | FundéuRAE ficha ✓ (research-cited; see caveat) |
| Deep learning | **aprendizaje profundo** | FundéuRAE ficha ✓ (research-cited; see caveat) |

**Established usage (no specific Fundéu/RAE ficha found — treat as field-standard, not academy
canon):**

| Concept (EN) | Spanish term | Note |
|---|---|---|
| Neural network | **red neuronal** | established usage, no Fundéu/RAE ficha |
| Model | **modelo** | general term |
| Dataset | **conjunto de datos** | established usage, no Fundéu/RAE ficha (*dataset* also seen) |
| Training | **entrenamiento** | established usage |
| Inference | **inferencia** | established usage |
| Classification | **clasificación** | established usage |
| Regression | **regresión** | established usage |
| Fine-tuning | **ajuste fino** | established usage, no Fundéu/RAE ficha (*fine-tuning* also seen) |
| Token | **token** | entrenched loan in NLP; established usage, no Fundéu/RAE ficha |
| Bias | **sesgo** | established usage, no Fundéu/RAE ficha for the AI sense |
| Overfitting | **sobreajuste** | established usage, no Fundéu/RAE ficha |
| Natural language processing | **procesamiento del lenguaje natural (PLN)** | established usage |

Recommended default set: **inteligencia artificial (IA), aprendizaje automático, aprendizaje
profundo, red neuronal, conjunto de datos, procesamiento del lenguaje natural (PLN)**, with the
English term in parentheses on first use. Freeze the chosen forms in the project glossary; project
coinages (C1) keep their original spelling and are owned by the term-sheet, not this table.

**Provenance caveat.** The FundéuRAE *inteligencia artificial* recommendation (lowercase +
uppercase sigla **IA**) was **independently confirmed** (FundéuRAE channels + a Fundéu mirror).
The *aprendizaje automático* / *aprendizaje profundo* fichas are **research-cited to Fundéu and
trusted as such**, but the Fundéu host blocks automated fetching, so the two specific ficha pages
**could not be re-fetched in this pass** — recorded honestly rather than shown as a fresh ✓.

Sources: <https://www.fundeu.es/recomendacion/inteligencia-artificial-ia-minusculas/> (IA ficha —
independently confirmed via FundéuRAE + mirror) ·
<https://www.fundeu.es/recomendacion/aprendizaje-automatico-mejor-que-machine-learning/> ·
<https://www.fundeu.es/recomendacion/aprendizaje-profundo-mejor-que-deep-learning/> (both
research-cited; host blocks the crawler — see caveat).

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → ES): idiomatic form ✅ vs literal calque ❌.** These are common
English educational/technical stock phrases whose word-for-word transfer into Spanish reads as
foreign. Use the idiomatic column; the calque column is what a naive translation produces and must
be avoided.

| English phrase | ✅ Idiomatic Spanish | ❌ Literal calque (wrong) | Provenance |
|---|---|---|---|
| step by step | paso a paso | paso por paso | translator craft, unsourced |
| under the hood | por dentro / internamente | bajo el capó | translator craft, unsourced |
| at a glance | de un vistazo | a un vistazo | translator craft, unsourced |
| keep in mind | ten en cuenta | mantén en mente | translator craft, unsourced |
| in the long run | a la larga | en la carrera larga | translator craft, unsourced |
| break it down | desglósalo / divídelo | rómpelo abajo | translator craft, unsourced |
| make sure | asegúrate de | haz seguro | translator craft, unsourced |
| on the fly | sobre la marcha | en la mosca | translator craft, unsourced |
| plug and play | listo para usar | enchufar y jugar | translator craft, unsourced |
| get up to speed | ponerse al día | subir a la velocidad | translator craft, unsourced |
| from scratch | desde cero | desde rascar | translator craft, unsourced |
| out of the box | listo para usar | fuera de la caja | translator craft, unsourced |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it. Default to
**concise, natural Spanish collocations**, then adapt by audience and grade level.

Beyond stock phrases, keep the **grammar-level literal-transfer anti-patterns** (re-derived from
§4) alongside this table:

- ❌ **Redundant subject pronoun** (*Yo guardé…*) → ✅ pro-drop **Guardé…**
- ❌ **Adjective mis-placed/mis-agreeing** (*una simple explicación* for "a simple one";
  *está entrenado* for *la red*) → ✅ **una explicación sencilla** / **está entrenada**.
- ❌ **English-order object pronoun** → ✅ clitic **verlo / lo vamos a ver / se lo dije**.
- ❌ **Indicative after a subjunctive trigger** (*que haces clic*) → ✅ **que hagas clic**.
- ❌ **Peninsular plural** (*Haced clic*) → ✅ recorded **Hagan clic** (ustedes).

**⚠ Provenance — confirm with a native speaker.** The idiom table is **round-1 research material,
localization judgment**, not an academy-sourced idiom dictionary. Treat the ✅ column as a strong
working default that a **native-speaker pass should confirm** — several renderings are
context-sensitive and may vary by region and register (e.g. *desglosar* vs *dividir*, or regional
preferences for *de un vistazo*). Ships **gap-flagged**: native-speaker confirmation pending.

Sources: idiom renderings — round-1 desk research, localization judgment (⚠ native-speaker
confirmation pending); grammar-level anti-patterns re-derived from §4 (<https://www.rae.es/dpd/>).

---

## 8. Simplified-language pendant (`es-easy`)

**Spanish HAS codified plain-/easy-language norms** — unlike the Bengali/Arabic pilots, this is
not a "no standard exists" case. The subsections below follow the kit's uniform 8a–8g order so
that a translator moving between languages finds the same seven answers in the same seven places.
What §8c–§8d add on top of the standards is the layer no standard supplies: **a count of which
words Spanish easy-reading publishing actually uses**, and the list of "simplifications" that
count refutes.

### 8a. The standards that do exist ✅

Two distinct, named traditions apply:

- **Lectura fácil (easy reading)** — for readers with cognitive/comprehension difficulties.
  Governed by **UNE 153101:2018 EX** *"Lectura Fácil. Pautas y recomendaciones para la
  elaboración de documentos"* — the first technical standard on easy reading issued by a
  standardization body (marked **EX / experimental**), with a validation companion **UNE
  153102:2018 EX**. Plena inclusión and allied organizations maintain the practical methodology.
- **Lenguaje claro (plain language)** — for the general public. Governed by **UNE-ISO
  24495-1:2024** *"Lenguaje claro. Parte 1: Principios rectores y directrices"*, Spain's adoption
  of **ISO 24495-1:2023**, built around the guiding principle that readers can **find**,
  **understand**, and **use** what they need.

**No mandated quantitative metric.** Critically, **neither standard fixes a universal "maximum N
words per sentence" rule.** ISO 24495-1 explicitly measures success by *whether readers can use
the document*, "rather than on mechanical measures such as readability formulas"; the UNE lectura
fácil guidance is qualitative (short sentences, concrete vocabulary, active voice, clear layout) —
**not** a single hard numeric threshold. **Do not invent one.** Any words-per-sentence figure the
kit uses is the **kit's own working target, not a Spanish norm.**

**The operative practice, not just the paper standard.** The working reference edition of Spanish
easy-reading is **Planeta fácil**, Plena inclusión's daily *lectura fácil* news site. Its own
description of itself: *"Planeta fácil es un proyecto de Plena inclusión que nace con un objetivo
claro: garantizar el derecho a la información para las personas con discapacidad intelectual y
dificultad de comprensión."* And on the method: *"Lectura fácil, una metodología que adapta los
textos para que sean comprensibles para las personas con discapacidad intelectual y dificultades
de comprensión. **Todos los textos son validados por personas con discapacidad** para garantizar
que se entienden."* Reader validation — the same non-waivable rule the French pendant records —
is therefore part of the Spanish method too, and this project cannot satisfy it; see §8g.

### 8b. Name the axis — the cultismo layer against the everyday word

The table below is not a random list of hard words; it runs one direction, and Spanish has precise
names for its two ends — the **DLE's own**, which makes the axis quotable rather than asserted:

- **cultismo** — *"Vocablo procedente de una lengua clásica que se toma en préstamo en una lengua
  moderna y **no pasa por las transformaciones fonéticas** propias de las voces populares o
  patrimoniales."*
- **patrimonial** (acepción Ling.) — *"Dicho de una palabra: Que, **a diferencia de los cultismos**,
  ha seguido en su evolución las leyes fonéticas propias del idioma."*

The clearest pair in the table is textbook: **adquirir** is *"Del lat. adquirĕre"* — taken whole,
unchanged — while **comprar** is *"Del lat. comparāre"*, the same kind of Latin word after fifteen
centuries of Spanish sound change. Likewise **efectuar** *"Del lat. effectus"* against **hacer**
*"Del lat. facĕre"*. **That is the direction `es-easy` runs: from the borrowed-whole learned word to
the one that grew in the mouth.**

**⚠ Do not over-apply it — the axis explains most of the table, not all of it.** The plain column is
not reliably patrimonial: **terminar** is *"Del lat. termināre"*, **necesitar** *"Del lat. mediev.
necessitare"*, and **avisar** is not Latin at all but *"Del fr. aviser"*. Where etymology and
familiarity disagree, **familiarity wins** — `es-easy` chooses the word the reader hears more often,
not the one with the older pedigree. A translator who starts "de-Latinizing" Spanish on principle
will wreck it, because Spanish is Latin.

**Complex → everyday word table.** **Tier is marked per row.** **DLE** = the *Diccionario de la
lengua española* either **defines the formal word using the everyday one** or lists it among its
`Sin.` — the pair is the academy dictionary's, not this guide's. **⚠ craft** = practical editorial
choice, unattested; it may also vary by region and audience. **⚠ The table as a whole ships
gap-flagged for native-speaker confirmation** — a shared sense in a dictionary is not proof that the
swap reads naturally in every register or every market, and none of the plain-language standards
above prescribes a word list.

| Formal / complex | Everyday Spanish | Tier — DLE evidence |
|---|---|---|
| adquirir | comprar | **DLE**: *"2. tr. **comprar** (‖ obtener por un precio). Sin.: comprar, mercar."* |
| requerir | necesitar | **DLE**: *"3. tr. **necesitar** (‖ tener necesidad). Sin.: necesitar, precisar, exigir."* |
| efectuar | hacer | **DLE**: *"Poner por obra o ejecutar algo… Sin.: **hacer**, realizar, ejecutar…"* |
| utilizar | usar | **DLE**: *"Hacer que algo sirva para un fin. Sin.: emplear, **usar**, servirse…"* |
| notificar | avisar | **DLE**: *"Dar noticia de algo o hacerlo saber con propósito cierto. Sin.: comunicar, **avisar**, informar…"* |
| finalizar | terminar | **DLE**: *"Poner o dar fin a algo. Sin.: **terminar**, acabar, concluir…"* |
| posteriormente | después | **DLE** (*posterior*): *"Que ocurre **después** de un momento dado."* |
| aproximadamente | más o menos | **DLE** (*aproximado*): *"Aproximativo, que se acerca **más o menos** a lo exacto."* |
| proporcionar | dar | ⚠ craft — DLE has *"Poner a disposición de alguien lo que necesita o le conviene"*, and lists *facilitar, suministrar, proveer, entregar* — but **not** *dar*; the reduction is this guide's |
| adicional | extra | ⚠ craft — DLE has *"Que se suma o añade a algo. Sin.: añadido, complementario."*; *extra* is not the dictionary's word, and it is a loan where *más* often reads plainer |

### 8c. Measure the axis

The axis above is a hypothesis until counted, and a dictionary synonym is not evidence about
register. Every row of the table was therefore counted in real Spanish easy-reading publishing.

| Corpus | What it is | Size |
|---|---|---|
| **A — plain** | **Planeta fácil**, Plena inclusión's daily *lectura fácil* news site (§8a) | **400 posts**, 2025-06-18 → 2026-07-27, **118,502 word tokens** after the fixed page template was stripped (121,217 before) |
| **B — standard** | **plenainclusion.org `/noticias/`** — the **same organization's** ordinary-register news feed | **367 posts**, 2024-11-28 → 2026-07-24, **132,591 word tokens** |
| **Cross-check** | **es.vikidia.org** (encyclopedia written for readers aged ~8–13) against **es.wikipedia.org** — `insource:` **page** hits, namespace 0, normalized per 1,000 content pages | 7,743 vs 2,127,762 articles |

**Method.** Both corpora were pulled as JSON through each site's WordPress REST API
(`/wp-json/wp/v2/posts`), stripped of HTML locally, case-folded, and tokenized on Unicode letter
runs. Rates are **per 100,000 tokens**, raw counts given alongside so the arithmetic can be
redone. Verb rows are counted as **lemma families** (every inflected form matching the stem),
because bare infinitives are near-zero in running text — *efectuar* as a token appears 0 times in
251,093 words of Spanish news across both registers.

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **The two corpora do not share a topic.** Planeta fácil covers general current affairs;
>    plenainclusion.org covers the organization's own sector business (*seminario* 176.5/100k,
>    *entidades* 175.7, *federaciones* 52.0 — all **0 or near-0** in A). The words that separate
>    the corpora most strongly are therefore **topical, not register**. Only topic-neutral pairs
>    are read as register evidence here; the topical keyness rows are discarded.
> 2. **Template boilerplate.** Every Planeta fácil article carries a fixed frame — *"Resumen a
>    lectura fácil de una noticia de …"*, *"Enlace a la noticia original"*, *"¡Aviso! no está en
>    lectura fácil"*, *"Glosario de palabras que están en negrita en el texto"*. It was stripped
>    before counting; residual heading words (*Resumen*, *Glosario*, *Aviso*) still inflate and are
>    marked wherever they are used.
> 3. **One publisher, one sector, peninsular Spanish.** That is deliberate — it controls for house
>    style and variety, so a difference is a *register* difference. It also means **nothing here is
>    established for Latin American Spanish** except where the cross-check agrees (§9).
> 4. **Frequency is not comprehension.** These rows say which word Spanish easy-reading publishing
>    actually prints. No Spanish comprehension study was located.

**The §8b table, measured.**

| Pair | A (plain) /100k | B (standard) /100k | Cross-check, per 1k pages | Verdict |
|---|---|---|---|---|
| efectuar → hacer | efectuar **0.0**; *hacer* family **818.6** (970) | efectuar **0.0**; *hacer* family **506.1** (671) | efectuar **0.39** vs **2.74** | ✅ holds — *efectuar* is absent from news in both registers, and 7× rarer in the children's encyclopedia |
| posteriormente → después | posteriormente **0.0**; después **60.8** (72) | posteriormente **0.0**; después **41.5** (55) | posteriormente **26.74** vs **96.39** | ✅ strongest row in the set — 3.6× rarer in the children's edition |
| finalizar → terminar | finalizar **0.0**; *terminar* family **21.9** (26) | finalizar **3.0** (4); *terminar* family **23.4** (31) | finalizar **3.62** vs **14.18**; terminar 11.37 vs 16.68 | ✅ for dropping *finalizar*; *terminar* itself is flat |
| adquirir → comprar | adquirir **0.8** (1); *comprar* family **52.3** (62) | adquirir **0.0**; *comprar* family **14.3** (19) | adquirir **2.84** vs **7.65**; comprar 8.78 vs 9.18 | ✅ for dropping *adquirir*; *comprar* is not itself a plain-register marker |
| proporcionar → dar | proporcionar **1.7** (2); *dar* family **129.1** | proporcionar **0.0**; *dar* family **122.2** | proporcionar **4.52** vs **9.91** | ⚠ the cross-check supports it; the news pair shows nothing either way |
| utilizar → usar | utilizar **2.5** (3); *usar* family **374.7** (444) | utilizar **12.1** (16); *usar* family **149.3** (198) | utilizar **23.51** vs **23.10** | ⚠ **split** — strong in news, **exact parity** in the encyclopedia pair (§8d) |
| requerir → necesitar | requerir **0.8**; necesitar **146.0** (173) | requerir **2.3**; necesitar **150.1** (199) | requerir 1.42 vs 1.67; necesitar 0.77 vs 1.00 | ⚠ **half** — *requerir* thins out, *necesitar* does **not** rise (§8d) |
| notificar → avisar | notificar **0.0**; *avisar* verb forms **18.6** (22) | notificar **0.0**; *avisar* verb forms **0.8** (1) | avisar **0.26** vs **0.78** | 🔴 the two measurements point opposite ways (§8d) |
| aproximadamente → más o menos | **0.0** | **0.0** | — | ❌ untestable — neither side occurs |
| adicional → extra | adicional **0.0**; extra **3.3** (4) | adicional **0.8** (1); extra **0.8** (1) | — | ❌ signal too thin to call |

### 8d. 🔴 The do-NOT-simplify list — where the measurement contradicts the instinct

**This is the highest-value table in §8.** Every row is a swap a translator applying "Latinate,
long, or learned = hard" would make, and every one of them is either unsupported or backwards.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~replace **información** with something shorter~~ | A five-syllable cultismo, and **the most over-represented topic-neutral abstract noun in the plain corpus: 372.1 /100k (441 tokens) against 199.1 (264)**. Nothing shorter takes its place. ⚠ It runs the other way on the encyclopedia axis (Vikidia **36.55** vs Wikipedia **76.55** per 1k), so this is a *news-register* finding, not a universal one. |
| ~~**obtener** → **conseguir** as a plainness move~~ | *conseguir* is **rarer** in the plain corpus, not commoner: **39.7 /100k (47) against 73.2 (97)**. *obtener* is flat (3.4 vs 2.3). The supposedly plainer verb is the one that drops. |
| ~~expect **necesitar** to be the easy-register word~~ | It is **flat to slightly lower** in the plain corpus: **146.0 vs 150.1**. Dropping *requerir* is right; treating *necesitar* as a simplification is a misreading of the same measurement. |
| ~~**notificar** → **avisar** as a rule~~ | Contested by its own evidence. In the news pair *avisar* rises (**18.6 vs 0.8**); in the children's encyclopedia it is **3× rarer** than in the adult one (**0.26 vs 0.78** per 1k). *notificar* is at **0.0** in both news corpora anyway, so the row buys almost nothing. ⚠ unsettled. |
| ~~treat **utilizar** as a hard word~~ | The encyclopedia cross-check puts *utilizar* and *usar* at **parity — 23.51 vs 23.10 per 1k**. Preferring *usar* in running prose is good craft; "*utilizar* is difficult Spanish" is **not a fact about Spanish**. |
| ~~paraphrase **glosario**, **resumen**, **original** into "plainer" wording~~ | These three cultismos are what Plena inclusión's *own* lectura fácil template calls its own furniture: *Resumen*, *Glosario de palabras que están en negrita en el texto*, *Enlace a la noticia original*. **The publication that defines Spanish easy-reading practice uses the learned word for its own parts.** (⚠ template text, counted separately: *glosario* **272** occurrences in A against **0** in B.) |
| ~~"upgrade" **gente** to **personas** in easy text~~ | Measured, both blanket directions are wrong: *gente* is **6× commoner** in the plain corpus (**77.6 vs 12.1**) while *personas* is **lower** there (**1,696 vs 1,932**). The standard corpus's *personas* load is **person-first disability terminology** (§6), not formality — so do not strip it where it is the correct term either. |
| ~~reach for the short, old-looking verb~~ | The Romance trap in its Spanish form: the shorter word is usually the **rarer** one. The *hallar* family scores **1 token in 251,093 words** across both corpora; *precisar*, *residir*, *abonar*, and *disponer* score **0**. Short is not plain. |
| ~~purge the formal connective **sin embargo**~~ | ⚠ thin but real: it is **not** eliminated in the plain corpus — **3.4 /100k (4 tokens) against 1.5 (2)**. *no obstante* is at 0.0 in both. (*además*, by contrast, does drop: 37.1 vs 83.0.) |

> **→ The rule that follows.** In Spanish, **do not simplify by etymology or by length**. Spanish
> *is* Latin; the learned-looking word is very often the everyday one. Simplify by **sentence
> architecture first** (§8f), and change a word only where the plain corpus actually shows the
> change — which, of the ten pairs measured, is four rows, not ten.

### 8e. 🔑 The address decision — `es-easy` keeps `tú` + `ustedes`, unchanged from §4

> **Decision, recorded so that nobody "fixes" it: `es-easy` uses the same address system as `es` —
> `tú` in the singular, `ustedes` in the plural (§4). It does NOT move to `usted`, and it does NOT
> move to `vosotros`.**

- ✅ **Haz clic aquí para empezar.** — in `es` and in `es-easy` alike
- ❌ **Haga clic aquí para empezar.** — *usted* is not clearer, only more distant
- ❌ **Haced clic aquí para empezar.** — *vosotros*, ruled out for a different reason (§9 neutrality)

**Why, and the reason is measured rather than assumed.** Spanish is the case where the kit's usual
finding — "the simplified variant must not drop to a familiar form" — **does not apply as stated**,
because the base register is *already* the familiar `tú`. The live question is the opposite one:
does easy-reading Spanish shift **up** to `usted` for institutional seriousness? It does not.
**In 251,093 words across both corpora, `usted`, `ustedes` and `vosotros` occur exactly 0 times
each.** Address in the plain corpus is `tú`-shaped throughout (*puedes* 56.5 /100k, *tienes* 18.6,
*quieres* 16.0). The `es-easy` variant therefore changes nothing about address — and a reviewer who
"formalizes" it has introduced a register the reference publication never uses.

⚠ **One honest limit:** the plain corpus addresses the reader **less often** than the standard one
(*puedes* 56.5 vs 156.9), because it is expository news rather than instructions. That is a genre
difference, not evidence that easy Spanish avoids direct address; the kit's own base rule to speak
to the reader directly stands.

### 8f. What the pendant is built on — structure first, vocabulary a distant second

In order of leverage for Spanish:

1. **Sentence architecture. This is the main lever.** Spanish inflection is not the obstacle
   (unlike agglutinating languages), and §8d shows the vocabulary lever is far weaker than it
   looks. Split one long sentence into two; keep SVO; no stacked subordinate clauses; one idea per
   sentence. This is where the measured difference between the corpora actually lives.
2. **Drop the four measured formal items** — *efectuar*, *posteriormente*, *finalizar*,
   *adquirir* — and otherwise leave the vocabulary alone unless §8c backs the change.
3. **Keep the orthography intact.** Diacritics and paired `¿ ¡` carry meaning; dropping them is an
   error in easy text exactly as it is in base text (§3).

**Base rules this overrides.** `es-easy` **follows** the kit's base simplified-language rules in
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one
idea per sentence; the kit's own ~8–12-word working target (**the kit's figure, not a UNE/ISO
mandate**); simple SVO; everyday words; say what *is*, not what *isn't*; the same word for the same
thing; numbers as digits (§5/§11); a one-line "what is this" opener; a consistent literal tone —
and **overrides none of them**, because neither UNE 153101 nor UNE-ISO 24495-1 issues a competing
number (§8a). What it **adds** is §8d: the base rule "use everyday words" is now bounded by a
measurement, not by intuition.

**Term-preservation rule (restated, binding).** In `es-easy`, **keep the technical term and
explain it** — never swap in a folksy stand-in. Use the same term as the base variant, then
"eso significa: …", then a concrete example (e.g. keep **red neuronal**, then explain it in plain
Spanish; do **not** replace it with an invented everyday word). §8d's *glosario* row is the same
rule seen from the other side: the reference publication keeps the hard word and glosses it.

### 8g. What is still open

1. **Reader validation cannot be met.** The Spanish method's own requirement — *"Todos los textos
   son validados por personas con discapacidad"* — is not satisfiable by this project. `es-easy`
   is therefore lectura-fácil-**informed**, not lectura fácil. It must not be labeled as the
   latter.
2. **The UNE standards were never read.** Both are paywalled; §8a rests on the standards body's
   catalog pages and on ISO's public abstract. Any claim about their internal rules stays out of
   this guide.
3. **Latin American Spanish is unmeasured.** Both corpora are peninsular and from one disability-
   sector publisher. Whether *gente*/*personas*, *conseguir*/*obtener*, or the *utilizar* parity
   behave the same way in Mexican or Río de la Plata Spanish is **unknown** (§9).
4. **The topic mismatch is unresolved.** A same-topic pair — e.g. one publisher's standard and
   lectura fácil versions of the *same* article — would isolate register far better than these two
   feeds. None was located as bulk-fetchable.
5. **The two contested rows need a native-speaker ruling:** *utilizar* → *usar* (parity in the
   cross-check) and *notificar* → *avisar* (measurements point opposite ways).
6. **No comprehension evidence.** Everything here is frequency. Whether the measured plain-corpus
   words are *understood* better was not established for Spanish.

Sources: <https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0060036> (UNE
153101:2018 EX) · <https://www.une.org/encuentra-tu-norma/busca-tu-norma/norma?c=N0072523>
(UNE-ISO 24495-1:2024) · <https://www.iso.org/standard/78907.html> (ISO 24495-1:2023 —
"rather than on mechanical measures such as readability formulas"; all three independently
confirmed) · <https://dle.rae.es/cultismo> · <https://dle.rae.es/patrimonial> and the per-headword
entries *adquirir, requerir, efectuar, utilizar, notificar, finalizar, posterior, aproximado,
proporcionar, adicional, hacer, comprar, usar, avisar, terminar, necesitar* — **all fetched
directly this pass and quoted verbatim**. Note for future passes: **dle.rae.es answered normally
here**, so the header's blanket "RAE blocks automated fetching" caveat did not apply to the
dictionary this time; it still stands for the other RAE properties cited in §2. ·
**Plain corpus (§8c)** — 400 posts of *Planeta fácil*, <https://planetafacil.plenainclusion.org/>,
fetched via <https://planetafacil.plenainclusion.org/wp-json/wp/v2/posts> ·
self-description and method quotes: <https://planetafacil.plenainclusion.org/que-es/> and
<https://planetafacil.plenainclusion.org/que-es/noticias-lectura-facil/> ·
**Standard corpus (§8c)** — 367 posts from <https://www.plenainclusion.org/noticias/>, fetched via
<https://www.plenainclusion.org/wp-json/wp/v2/posts> ·
**Cross-check (§8c)** — `insource:` page hits and site statistics from
<https://es.vikidia.org/w/api.php> and <https://es.wikipedia.org/w/api.php>
(Vikidia is Community tier — a volunteer children's encyclopedia, not a Spanish language
authority). The §8c/§8d frequencies are this guide's **own count**, reproducible from the URLs
above; the §8b word pairs remain DLE-tiered or ⚠ craft as marked per row.

---

## 9. Regional variation

**Which standard the project targets.** Spanish has one **shared written standard** governed
pan-Hispanically by RAE/ASALE; the major axis of variation is **Spain vs Latin America**. The
project targets a **neutral pan-Hispanic written build**, with the few genuinely divergent things
(number separators, currency, a little vocabulary) **parameterized per deployment**.

**Differences table.**

| Axis | Spain (`es-ES`) | Latin America (`es-419`) |
|---|---|---|
| Informal plural | **vosotros** (avoided per §4) | **ustedes** (also the formal plural) |
| Singular informal | **tú** | **tú**, or **vos** (*voseo*) in some regions |
| Decimal / grouping | **`1.234,5`** (comma decimal) | **`1,234.5`** in MX & much of LatAm (point decimal) |
| Currency | **euro `10 €`** | local symbols (`$` + MXN/ARS/COP…), often pre-posed |
| Vocabulary | *ordenador*, *móvil*, *coche* | *computadora*, *celular*, *carro/auto* |

**Neutrality strategy (explicit).**

1. **Register:** the recorded **tú + ustedes** (§4) — *ustedes* is itself the neutral plural that
   works in both regions; **no *vosotros***. This is the single biggest neutrality lever.
2. **Vocabulary:** prefer internationally transparent, unmarked terms; where a Spain-vs-LatAm
   split is unavoidable (*ordenador* vs *computadora*), choose the unmarked/technical option or a
   context where either works, and freeze it in the glossary.
3. **Numbers & currency:** **parameterize per market** (§5) — decimal comma + `€` for Spain;
   decimal point + local symbol for the relevant Latin-American market.
4. **Community/religious markers:** neutral educational writing **prefers general, descriptive
   terms** (*comunidad*, *personas usuarias*, *equipo*) over vocabulary marked by religious or
   community identity, keeping such markers only when the content genuinely requires that
   precision. (This neutralization principle comes from the **neutral-Spanish localization style
   guide (localization source)**, applied as a lexical-neutrality principle, not a closed list of
   examples — vendor name/URL withheld per the source-neutrality rule.)

A single neutral written build serves both regions with the parameterized exceptions above.

Sources: <https://www.unicode.org/cldr/charts/latest/summary/es.html> (`es` vs `es-419` number/format
differences) · register + community-neutrality: **neutral-Spanish localization style guide
(localization source)**, name/URL withheld per source-neutrality rule; regional vocabulary pairs —
round-1 desk research (localization judgment; ⚠ native-speaker confirmation recommended).

---

