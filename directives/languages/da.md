<!-- base -->
# lang-da — Danish (dansk) — language guide

> **Setup & sources live in [`da.setup.md`](da.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** dansk / Danish.
**BCP 47 code (base):** `da`.
**BCP 47 code (simplified variant):** `da-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`da-x-simple`), but the kit token `da-easy` is the one
that counts here.
**Speaker reach:** ~**6 million** speakers, chiefly in Denmark — its sole official language — and
also in South Schleswig (Germany), the Faroe Islands and Greenland, where it is co-official
alongside the local languages (lex.dk / Trap Danmark: *"Det danske sprog tales af ca. seks
millioner mennesker, hovedsageligt i Danmark, men også i Sydslesvig, på Færøerne og Grønland."*).
**Script + direction:** Latin script, **29 letters** — a–z plus **æ, ø, å** at positions 27–29;
**left-to-right**. Every Danish letter lives in Basic Latin (U+0000–U+007F) or Latin-1 Supplement
(U+0080–U+00FF) — no extended Unicode block is needed, which makes font coverage the *easy* part
(§3).
**Register (decided — see §4):** **du (informal), written in rigsdansk (the neutral written
norm).** Formal **De/Dem/Deres** is archaic and deferential — *"På arbejdspladser er De blevet
yderst sjældent"* (lex.dk/tiltaleform) — and is **deliberately not used**. du is the unmarked,
expected register for teaching, help text, and UI.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Section support is uneven and is marked per section: the **authority-backed (strong)**
sections rest on **Dansk Sprognævn / sproget.dk**, **Retskrivningsordbogen**, **lex.dk**,
**CLDR/LDML**, and **da.wikipedia**; the **community/dictionary/craft-tier** sections
(terminology seed table, idioms, some plain-language rows) rest on Danish educational glossaries and
translator craft and say so at point of use. Per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records the missing native-speaker review
honestly.
**Easy or hard for this kit:** genuinely easy on the mechanics — Latin script, whitespace
tokenization, LTR, no shaping or bidi, and **no extended Unicode block** (æ ø å are all precomposed
Latin-1 code points). The three things that actually bite: (1) **Danish quotation marks** — the low-
high pair **„…”** or inward guillemets **»…«**, never the English straight/curly default (§3);
(2) **heavy noun compounding** — English "training data" / "language model" become *one* Danish word
(*træningsdata*, *sprogmodel*); writing them spaced ("*sprog model*") is a real spelling error (§4);
and (3) **V2 word order with inversion** — front anything other than the subject and the finite verb
must still come second (*"Derfor kan modellen…"*, not *"Derfor modellen kan…"*), which naive
English SVO cloning gets wrong.

Sources: <https://lex.dk/sproget_i_Danmark> · <https://lex.dk/tiltaleform> ·
<https://da.wikipedia.org/wiki/Dansk_(sprog)>

---

## 1. Header block

See above. One-line orientation: Danish is a North-Germanic (East-Scandinavian), **V2** LTR language
in a 29-letter Latin alphabet; the localization risks concentrate in **punctuation (Danish
quotation marks), compounding, V2 inversion, and comma-as-decimal number formatting** rather than in
scripting, direction, or glyph coverage. National authority: **Dansk Sprognævn (dsn.dk)**;
orthographic norm: **Retskrivningsordbogen (RO)**, current edition **November 2024**.

---

## 4. Grammar for translators

**(Strong section — lex.dk + da.wikipedia; the register facts are lex.dk-sourced and verified.)**

**Word order — V2 with inversion.** Danish is a **V2 (verb-second) language** in main clauses: the
finite verb sits in second position, and fronting **any** non-subject element triggers **inversion**
(subject after the verb). Verbatim: *"Et hvilket som helst ord eller udtryk (bortset fra
konjunktioner) først i sætningen forårsager på dansk inversion."* (lex.dk). Subordinate clauses
instead put the finite verb after the subject and any adverbs (*"Ledsætningsmønstret altid har
subjektet først, fulgt af eventuelle adverbialer og det finitte verbal således på tredje plads."*).
English SVO carried over naively produces wrong order whenever a sentence starts with anything but
the subject.

- ✅ fronted adverb, verb still second: **Nu lærer modellen mønstrene.** ("Now the model learns the
  patterns.")
- ❌ English SVO cloned after a fronted element: **Nu modellen lærer mønstrene.** *(illustrative
  wrong form — after fronted* Nu *the finite verb must come second)*

**Register — the project's decision.** Modern Danish overwhelmingly uses informal **du** for "you".
Formal **De/Dem/Deres** is archaic and deferential — **verified verbatim**: *"På arbejdspladser er De
blevet yderst sjældent"* and *"Brugen af du blev stadig mere intens i løbet af 1900-tallet"*
(lex.dk/tiltaleform). De survives only in some service branches toward adult customers and very
formal letters.

> **Register decision (human-gate): du (informal), in rigsdansk — apply, do not re-litigate.**
> The platform uses **du** throughout — the unmarked, expected register for teaching, help text, and
> UI. Formal **De** would read as stiff, ironic or officious and is **deliberately NOT used**.
> Binding for all second-person copy in `da` and `da-easy`. (Capital-**D** *De* only ever appears in
> the polite pronoun; lower-case *de* = "they" — do not confuse them.)
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ du (the recorded register): **Klik her.** · **Skriv dit navn.** · **Husk at gemme.**
- ❌ De (not the platform register): **Klik her, hvis De ønsker det.** · **Skriv Deres navn.**

The grammar features that break a naive EN → DA translation:

**(1) Enclitic (suffixed) definite article.** Danish attaches "the" as a **suffix**, not a separate
word (da.wikipedia: *"Substantivets … angives ved en affiksering af den bestemte artikel - nominativ:
huset; stamform: (et) hus."*). So *the model* = **modellen**, not *den model*. A separate *den/det*
appears only when the noun carries an adjective (*den trænede model*).

- ✅ **modellen** ("the model") · ✅ with adjective: **den trænede model**
- ❌ **den model** *(illustrative wrong form — bare definite is the enclitic* -en*, not a free article)*

**(2) Two genders (fælleskøn / intetkøn) drive every article, adjective, and pronoun ending.**
~75 % of nouns are **common gender** (**en**-words, definite **-en**); the rest **neuter** (**et**-
words, definite **-et**) (da.wikipedia/Fælleskøn: *"fælleskønsord tager -en, mens intetkønsord tager
-et."*). Gender is largely unpredictable and must be memorized per noun.

- ✅ common: **en algoritme → algoritmen** · ✅ neuter: **et netværk → netværket**, **et datasæt → datasættet**
- ❌ **et algoritme** / **en netværk** *(illustrative wrong form — wrong gender flips every downstream ending)*

**(3) Adjective agreement (gender + number + definiteness).** Adjectives inflect: add **-t** for
neuter singular and **-e** for plural and definite. English adjectives are invariant, so missing
agreement is an immediate tell of machine-literal output.

- ✅ **en stor model** / **et stort netværk** / **de store modeler** / **den store model**
- ❌ **et stor netværk** / **de stor modeler** *(illustrative wrong form — neuter needs* -t*, plural/definite need* -e*)*

**(4) V2 inversion after fronted adverbials** (restated — the single most common structural error).

- ✅ **Derfor kan modellen generalisere.**
- ❌ **Derfor modellen kan generalisere.** *(illustrative wrong form)*

**(5) Compounding, not spaced phrases.** English noun+noun becomes **one** Danish word — *training
data* → **træningsdata**, *language model* → **sprogmodel**. Writing them spaced ("*sprog model*")
is a genuine spelling error and can change meaning.

- ✅ **sprogmodel**, **træningsdata**, **maskinlæringsmodel**
- ❌ **sprog model**, **trænings data** *(illustrative wrong form — "split-compound", an English-interference error)*

Sources: <https://lex.dk/inversion_-_omvendt_ledstilling/ordstilling> · <https://lex.dk/tiltaleform> ·
<https://da.wikipedia.org/wiki/Dansk_(sprog)> · <https://da.wikipedia.org/wiki/Fælleskøn>

---

## 5. Numbers, dates, currency

**(Strong section — CLDR/LDML `da` locale, cross-checked with DSN/sproget.dk.)**

**Decimal separator = comma; grouping = period (or space).** Danish is the **mirror image of
English**: decimal `,` and thousands `.` (CLDR/LDML `da`). English 12,345.67 → Danish **12.345,67**;
one million = **1.000.000**.

- ✅ Danish: **12.345,67**  ·  **1.000.000**
- ❌ English format: **12,345.67**  ·  **1,000,000**

**Dates — day-month-year.** Traditional Danish order is **day, month, year** — **verified
verbatim**: *"Rækkefølgen i traditionel dansk datoangivelse er dag, måned og år."* (sproget.dk).
All-numeric forms (verified on the same page): **2.10.2003**, **2.10.03**;
spelled-out: **2. oktober 2003**; the word *den* / *d.* may precede but is optional. The
ISO order (year-month-day) is also accepted. **Month and weekday names are lower-case.**

- ✅ numeric: **2.10.2003** · ✅ spelled: **2. oktober 2003** · ✅ ISO: **2003-10-02**
- ❌ **October 2, 2003** / **10/2/2003** (US month-first) · ❌ **2. Oktober** (capitalized month)

**Time.** The **24-hour clock** is standard; separator is a period or colon — **kl. 14.30** / **14:30**.

- ✅ **kl. 14.30** / **14:30**  ·  ❌ **2:30 PM** for end-user Danish content

**Currency — the krone, label after the amount.** Abbreviation **kr.** (also **DKK**, ISO 4217). In
running text the currency label comes **after** the number, with a space (sproget.dk: *"I løbende
tekst står betegnelsen for møntenheden efter tallet."* — treated like an SI unit, *"stilles efter
tallet og med mellemrum"*). DSN examples: *"10 kr., 100 skr., 15 $, 1.000.000 JPY"*. The pattern
*100,- kr.* with a dash for whole kroner is also common.

- ✅ **99,95 kr.**  ·  ✅ whole amount: **100,- kr.**  ·  ✅ finance/tables: **DKK** may precede
- ❌ **kr. 99,95** in prose · ❌ **$15** glued before the number (Danish: **15 $**)

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/da.html> (CLDR 48.2 `da`: decimal comma, group period) ·
<https://sproget.dk/raad-og-regler/artikler-mv/svarbase/sv00000046/> ·
<https://sproget.dk/raad-og-regler/artikler-mv/svarbase/SV00015797>

---

## 6. Terminology strategy

**(Policy is authority-grounded; the seed-table renderings are community/encyclopedic-sourced —
labeled per row.)**

**Loanword vs native-coinage practice.** Danish freely **borrows English tech terms**, often keeping
the English spelling (*token*, *prompt*, *deep learning*, *machine learning*) while also maintaining
well-established native calques (*maskinlæring*, *sprogmodel*, *neuralt netværk*, *kunstig
intelligens*). Borrowed nouns are **naturalized into Danish grammar** — they take a gender and the
enclitic article: *token → tokenet*, *prompt → prompten*, *model → modellen* — so **respect the
inflection (§4); don't freeze them in the bare English form.** Danish frequently offers **both** an
English and a Danish form; the **Danish calque is preferred in formal/educational registers**, the
English form is common in practitioner speech.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term, give the Danish term + the English original + one short plain clause, then
use the Danish term alone afterwards:

> **kunstig intelligens** (artificial intelligence, AI) — et område af datalogien, der efterligner
> menneskelige evner som at lære og løse problemer. *(explanatory clause authored per the sandwich
> format; the term itself is sourced below.)* Then **kunstig intelligens** alone on every later
> mention.

**Seed field vocabulary (AI/ML).** Field-standard renderings. Rows sourced to **lex.dk /
da.wikipedia** are encyclopedic; rows sourced to **ai-foralle.dk / viden.ai** are Danish educational
**(localization source)** glossaries, **not** a national authority; rows marked **⚠** are unverified
against a quotable source but are standard, well-formed Danish. Freeze the chosen forms in the
project glossary and don't mix competing renderings.

| Concept (EN) | Danish (recommended) | Type | Provenance |
|---|---|---|---|
| artificial intelligence | **kunstig intelligens** (AI) | calque | lex/DTU (search) — *"Kunstig intelligens kaldes også AI efter det engelske udtryk artificial intelligence."* |
| machine learning | **maskinlæring** | calque | da.wikipedia — *"Maskinlæring er et underområde indenfor datalogi og kunstig intelligens"* |
| neural network | **neuralt netværk** | calque | lex.dk — *"Neurale netværk er … netværk af kunstige nerveceller brugt i kunstig intelligens."* |
| model | **model** (modellen) | loan/internat. | ai-foralle.dk (localization source) — *"Det færdige produkt, der kommer ud af træningsprocessen."* |
| dataset | **datasæt** (datasættet) | native | ⚠ no dedicated authority quote; standard, grammatically neuter (*et datasæt → datasættet*) |
| training data | **træningsdata** | compound | ⚠ no standalone entry; da.wikipedia uses *"en stor mængde eksempeldata"* — *træningsdata* is the standard compound |
| prompt | **prompt** (prompten) | loanword | ai-foralle.dk (localization source) — *"Den besked eller instruktion, du giver til en AI."* |
| token | **token** (tokenet) | loanword | ai-foralle.dk (localization source) — *"Et token er typisk et ord eller en del af et ord."* |
| fine-tuning | **finjustering** | calque | ai-foralle.dk (localization source) — *"At tage en færdigtrænet AI-model og træne den lidt ekstra på specifikke data"* |
| inference | **inferens** | loan/internat. | ai-foralle.dk (localization source) — *"Når en færdigtrænet AI-model faktisk bruges til at give svar eller lave forudsigelser."* |
| algorithm | **algoritme** | loan/internat. | da.wikipedia — *"konstruerer algoritmer, der på basis af en stor mængde eksempeldata, kan finde … sammenhænge"* |
| deep learning | **dyb læring** / *deep learning* | calque + loan | ai-foralle.dk (localization source); da.wikipedia — *"Deep learning er mønstergenkendelse igennem kunstige neurale netværk"* |
| supervised learning | **overvåget (superviseret) læring** | calque | ai-foralle.dk (localization source) — *"En form for machine learning, hvor AI-en trænes med data, der allerede har de rigtige svar."* |
| unsupervised learning | **ikke-overvåget (uovervåget) læring** | calque | ⚠ no direct quote; formed by negation of *overvåget læring* |
| large language model | **stor sprogmodel** (sprogmodel / LLM) | calque | viden.ai (localization source) — *"En sprogmodel – også kaldet LLM … er en type kunstig intelligens, der er trænet på en stor mængde tekstuel data."* |
| hallucination | **hallucination** | loan/internat. | ai-foralle.dk (localization source) — *"Når en AI selvsikkert præsenterer information, der er forkert eller opdigtet."* |

Project coinages keep their original spelling in Danish text and are owned by the term-sheet, not
this table.

Sources: <https://da.wikipedia.org/wiki/Maskinlæring> · <https://lex.dk/neurale_netværk> ·
<https://www.ai-foralle.dk/ai-glossar> (localization source) · viden.ai (localization source) —
seed renderings are glossary/encyclopedic-sourced field usage, not an academy decree.

---

## 7. Idiom anti-patterns

**⚠ Translator-craft section, native-speaker confirmation pending.** These renderings reflect
standard Danish usage but are **not** drawn from an academy idiom dictionary; the dossier flags the
table as translator-craft, not an authority claim. Prefer the idiomatic column; the calque column is
the naive output to avoid.

| English phrase | Idiomatic Danish ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | **trin for trin** / **skridt for skridt** | *trappe ved trappe* (nonsense) | translator craft, unsourced |
| under the hood | **bag kulisserne** / **under motorhjelmen** (tech) | *under hætten* (reads as a clothing hood) | translator craft, unsourced |
| rule of thumb | **tommelfingerregel** | *regel af tommelfinger* (ungrammatical) | translator craft, unsourced |
| out of the box | **ud af boksen** (fig.) / **lige til at gå til** (ready-made) | *ude af kassen* (physically removed from a crate) | translator craft, unsourced |
| keep in mind | **husk på** / **vær opmærksom på** | *hold i sindet* (not idiomatic) | translator craft, unsourced |
| big picture | **det store billede** / **helheden** | *stort billede* (just a large photo) | translator craft, unsourced |
| trial and error | **at prøve sig frem** / **forsøg og fejl** | *prøve og fejl* (understandable but stilted) | translator craft, unsourced |
| cutting-edge | **banebrydende** / *state of the art* | *skærende kant* (a physical sharp edge) | translator craft, unsourced |
| a black box | **en sort boks** / *black box* (both transfer) | *sort kasse* (acceptable but less idiomatic in tech) | translator craft, unsourced |
| from scratch | **fra bunden** / **helt forfra** | *fra ridse* (nonsense) | translator craft, unsourced |
| the bottom line | **kort sagt** / **det afgørende er** | *den nederste linje* (just the last line of text) | translator craft, unsourced |
| hands-on | **praktisk** / *hands-on* | *hænder på* (ungrammatical) | translator craft, unsourced |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: translator-craft renderings reflecting standard Danish usage; ⚠ table not individually
source-quoted (per the dossier's section H note) — native-speaker confirmation pending.

---

## 8. Simplified-language pendant (`da-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: Danish has the standard, and lost the corpus.** The two halves of this
section have very different strength and must not be averaged. **§8a and §8b stand:** Denmark has a
named plain-language tradition, a named institution behind it, and — rarest of all in this kit — a
**quantitative, formula-level definition of the axis** with a published scale. **§8c is a negative
result:** no Danish plain-register text could be collected, so **nothing in this section is
corpus-backed**. Nothing was measured, so nothing measured may be reported, and §8d contains no
measured reversals. What failed for Danish is **only the corpus** — none of the sourced material
below is weakened by it.

### 8a. The standard — klarsprog and letlæst, named, institutional, and not legally binding

**Named tradition: klarsprog + letlæst.** Denmark has a strong **plain-language ("klarsprog")**
tradition, driven largely by the public sector; DSN works with public institutions on citizen-facing
writing, and klarsprog is understood as language that is correct, clear, and adapted to user needs —
write briefly, precisely, and avoid unnecessary technical terms. The Ombudsman publishes a *Håndbog i
klarsprog*. **letlæst** ("easy-read") means easy to read and understand (ordnet.dk/DDO), and Danish
easy-read tooling targets readers with dyslexia and reading difficulty. There is **no single
legally-binding plain-language standard**, but klarsprog norms are widely applied and municipalities
run *sprogpolitik* programs.

**How `da-easy` relates to the kit's base rules.** `da-easy` **inherits the kit's base
simplified-language rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one
idea per sentence, everyday words, say what *is* not what *isn't*, active voice, a one-line "what is
this" opener, and a consistent literal tone — and adds the **Danish-specific sourced overlays**:
short sentences, common words, one idea per sentence, direct **du** address, generous layout, and a
**LIX target in the low-to-mid 20s** (≤24 for the most accessible material, per the scale in §8b).
The register overlay: **hold the recorded du register (§4) — never drift to *De* for "formality".**

**Term-preservation rule (restated, binding).** In `da-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Keep e.g. **kunstig intelligens**, then *"det betyder: …"*,
then a concrete example. This is distinct from the complex→everyday table in §8b, which targets
bureaucratic *non-technical* vocabulary.

### 8b. Name the axis — LIX, and it is the tradition's own formula

**The Danish tradition names its axis quantitatively, which almost none of the others in this kit
do.** The dominant Danish metric is **LIX (læsbarhedsindeks)**, launched 1968 by C.H. Björnsson.
Formula: **average sentence length (words) + percentage of long words (≥7 letters)** — verbatim
*"PL + LO-% = lix"*, where PL = *"den gennemsnitlige punktum- eller periodelængde målt i antal ord"*
and long words are *"procentdelen af lange ord i teksten"* (dansksproghistorie.dk). Scale:
**≤24 "meget let", 25–34 "let", 35–44 "middel", 45–54 "svær", 55+ "meget svær".**

**Read what the formula does and does not claim.** LIX asserts that what separates plainer Danish
from standard Danish is **two text-level quantities**: how long the sentences run, and **what share
of the text's words are long**. That is the axis, stated by the tradition, with a scale attached —
and it is a **text-level** claim in both terms. ⚠ **It is not a claim about any individual word.**
The second term is a *percentage across a text*; nothing in the formula says that swapping one long
word for one short one leaves a reader better off, and §8d says why that matters here.

⚠ **The band `da-easy` targets is this guide's application of the scale, not a quoted
recommendation.** Learning materials for a broad audience target roughly **LIX 25–34 ("let")** and
very accessible / easy-read aims for **≤24** — the scale's own labels are sourced, the decision to
aim `da-easy` at them is the project's.

**Complex → everyday word table.** The *anvende→bruge*, *såfremt→hvis*, *foretage→gøre*
substitutions are canonical klarsprog advice; the table as a whole is **⚠ not individually
source-quoted** — confirm with a native speaker. Provenance is marked per row so that a reviewer can
see at a glance which rows have a tradition behind them and which are this guide's judgment.

| Formal / heavy Danish | Everyday (klarsprog) | Provenance |
|---|---|---|
| anvende | bruge | canonical klarsprog advice — ⚠ not individually source-quoted |
| foretage | gøre / lave | canonical klarsprog advice — ⚠ not individually source-quoted |
| såfremt | hvis | canonical klarsprog advice — ⚠ not individually source-quoted |
| erhverve | få / købe | ⚠ editorial |
| angående / vedrørende | om | ⚠ editorial |
| efterfølgende | bagefter / derefter | ⚠ editorial |
| forinden | før / inden | ⚠ editorial |
| medføre | betyde / føre til | ⚠ editorial |
| eksempelvis | for eksempel | ⚠ editorial |
| assistere | hjælpe | ⚠ editorial |

### 8c. Measure the axis — the honest negative, and why it is a policy finding rather than a technical one

**What was sought.** The design this kit uses elsewhere: **one publisher, two editions of the same
material**, one standard and one plainer — for Danish, the natural shape would have been a
public-service broadcaster's plainer news edition against its ordinary output. Failing that, any
standalone Danish publication written at a stated easy reading level. **Neither was obtained**, so
no Danish count exists and none is reported below. There are **no frequencies and no corpus sizes**
in this section, because no corpus was built.

**Two different reasons a candidate failed, and they must not be blurred.**
**(i) No plain-language publication exists there** — nothing is published at a plainer reading
level, or the host does not exist at all. **(ii) The publisher declines automated text
collection** — the material exists, and the publisher's answer to an automated request is no.
**(ii) is a publisher's stated position, and this guide records it as settled.** For Danish it is
the dominant reason, which makes this negative a **policy** finding, not a technical one: **nothing
in this section may be read as a route around a publisher's decision, and no such route is
described.**

| Candidate | Outcome | Which reason |
|---|---|---|
| **DR Ligetil (`dr.dk/ligetil`) — the Danish counterpart this section previously reported as non-existent. It exists.** DR publishes a standing easy-Danish news service under that name, for readers with dyslexia, language learners, and uncertain readers, alongside its ordinary news on the same domain — i.e. **exactly the same-publisher pair this design asks for** | **the publisher declines automated text collection, in the strongest form seen anywhere in this kit**: `dr.dk/robots.txt` names roughly **thirty** automated collection agents individually and disallows `/` for each. Re-tested 2026-07-29; the kit's collector refuses the host and the refusal was **not** overridden | **(ii)** |
| TV2 (`tv2.dk`) | its published collection policy names roughly seventy automated text-collection agents and disallows them under a single blanket rule | **(ii)** |
| Ekstra Bladet (`ekstrabladet.dk`) | collection policy names automated text-collection agents individually and disallows them | **(ii)** |
| Politiken, Berlingske, Jyllands-Posten — the three major broadsheets | each names automated text-collection agents in its collection policy and disallows them; one adds blanket disallow rules on top | **(ii)** |
| `nordjyske.dk`, `sn.dk` — regional titles | same policy, so this is not a national-title phenomenon | **(ii)** |
| Altinget, Kristeligt Dagblad — niche dailies | same policy | **(ii)** |
| `ligetil.dk`, `letnyt.dk`, `nemnyt.dk`, `ligetil.digst.dk`, `klartale.dk` | **do not resolve at all** — no such hosts. **🔴 But the inference drawn from that was wrong**: the Danish service is a *path* on the broadcaster's own domain, `dr.dk/ligetil`, not a host of its own, so probing host names could never have found it. Note the genuine false friend: **"Klar Tale" is a Norwegian easy-language paper, not a Danish one** | **(i) for the host names, and the conclusion drawn from them is withdrawn** |
| `handicap.dk` (Danske Handicaporganisationer), `ordblindeforeningen.dk` (the dyslexia association) | reachable, collection permitted, no restrictions at all — but neither carries a substantial easy-language archive: one returned an empty sitemap, and no easy-reading section was found on either front page | **(i)** |
| `dknyt.dk` | reachable, **collection fully permitted with no restrictions of any kind**, and genuinely enumerable: a sitemap index leading to four sub-sitemaps, one of which alone lists **45,038 URL entries**, with articles back to roughly 2017. But it is a **syndicated wire-style news aggregator in standard register** with **no plain-language sibling** | **(i)**, for the pair |

**🔴 The shape of the Danish negative, restated after a second pass — and it changed.** It is
**not** paywalling, **not** small language size, and **not** a technical obstacle. The first pass
concluded that Danish had been hit by both reasons at once: a press that declines collection, *and*
no Danish counterpart to the Swedish and Norwegian easy-language newspapers existing at all. **The
second half of that was wrong and is withdrawn.** A search — which the first pass could not run
(see the caveat below) — finds the counterpart immediately: **DR Ligetil**, the public-service
broadcaster's standing easy-Danish news service. So Danish is a **pure reason-(ii) negative**: the
publication exists, it is exactly the right shape, and its publisher's answer to automated
collection is no. **That changes what a later pass should do** — stop searching for a Danish
easy-language publication, because it has been found; the only remaining route is a licensed or
manually agreed one.

**✅ The weakness this section used to declare has been closed, and it cost the section a claim.**
The first pass ran out of search budget before the Danish scouting began, so its list was direct
probing of host names recalled or guessed rather than a search. A second pass with search available
(2026-07-29) re-ran it and found the publication the first pass had concluded did not exist —
which is precisely the failure mode a "found nothing without searching" negative has, and why it
was flagged. **Reason (ii) findings remain firm** — each publisher's collection policy was read
directly, and DR's was re-read. **The one reason-(i) conclusion that mattered is withdrawn.**
Reason-(i) rows about *other* Danish organizations (the disability and dyslexia associations)
stand: they were reachable, permitted, and carried no substantial easy-language archive.

**What follows for the rest of §8.** With no corpus: §8b's LIX axis stands on its published formula
and scale and is **untested here on real copy**; §8b's word table stands unmeasured and unrefuted;
§8d may not report a single measured reversal; and §8e's address decision rests on §4's sourced
usage facts, not on anything counted here.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none may be invented to fill the gap.** What this list can
do is separate the sourced from the unsourced, keep LIX inside the claim it actually makes, and
carry in one caution established across the languages in this kit that *were* measured.

| Do **not** do this | Why |
|---|---|
| ~~read LIX as a license to swap individual long words for short ones~~ | LIX's second term is a **percentage of long words across a text** (§8b), not a verdict on any word. A substitution that trades one long word for a shorter multi-word phrase moves the two terms of the formula **in opposite directions** — the long-word share falls while the average sentence length rises — and the formula alone cannot say the reader gained anything. **Score real copy; do not score a word list.** |
| ~~assume the learned or borrowed word is the harder one~~ | ⚠ **Cross-language caution, not a fact about Danish.** Across the languages in this kit where a count *was* possible, the learned or borrowed member of a pair turned out **not to be reliably the harder one**, and a confident "simplification" repeatedly swapped a common word for a **rarer** one. Danish has no count, so this is imported as a **caution requiring local verification** — it bites hardest on rows like *assistere → hjælpe* and *erhverve → få / købe*, where the formal member may be the word a reader meets more often. |
| ~~cite the seven ⚠ editorial rows as klarsprog doctrine~~ | Only *anvende → bruge*, *foretage → gøre / lave* and *såfremt → hvis* are recorded as canonical klarsprog advice, and even those are **⚠ not individually source-quoted** (§8b). The other seven are this guide's judgment. Never present any of them to a reviewer as DSN's or the Ombudsman's wording. |
| ~~treat the LIX band as a Danish rule for learning material~~ | ⚠ The **scale labels** are sourced; **aiming `da-easy` at ≤24** is the project's application of them (§8b). It is a defensible target and it is not a citation. |
| ~~let the kit's word target and the LIX band be reconciled by assertion~~ | The kit's ~8–12-word working sentence target and LIX's sentence-length term are **two different instruments**, and **no measurement here reconciles them**. ⚠ Apply the LIX band as the Danish figure and the kit's target as the kit's, and record any conflict rather than splitting the difference. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **kunstig intelligens**, then *"det betyder: …"*, then a concrete example. With no corpus, explaining a hard word is the lexical move that rests on a stated rule rather than on judgment. |
| ~~read §8c as proof that no Danish letlæst publication exists~~ | It is proof that **none was found without a search** (§8c). The reason-**(i)** findings are the weak half of that section. |
| ~~work around a publisher that declines automated collection~~ | Most of §8c is publishers' stated positions. They are recorded as settled. Do not treat a policy decision as a technical problem with a technical answer. |

> **→ The rule that follows.** For Danish, **the axis is sourced and the word list is not.** Score
> whole copy against LIX, take the structural klarsprog advice with confidence, apply the three
> canonical lexical rows as advice and the other seven as hints — and let a native speaker settle
> the table, because no measurement in this kit will.

### 8e. 🔑 The address decision — `da-easy` keeps **du**, on §4's sourced grounds

> **Decision, recorded so that nobody "fixes" it: `da-easy` uses `du`, exactly as `da` does (§4). It
> does NOT switch to `De`.**

- ✅ `da-easy`: **Klik her.** · **Skriv dit navn.** · **Husk at gemme.**
- ❌ `De` (not the platform register): **Klik her, hvis De ønsker det.** · **Skriv Deres navn.**

**The grounds are §4's, and for Danish they are unusually solid.** §4 records **du** as a
human-gated project decision binding for all second-person copy in `da` and `da-easy`, resting on
**verbatim lex.dk evidence** that formal **De** has become rare — *"På arbejdspladser er De blevet
yderst sjældent"* — and that *"Brugen af du blev stadig mere intens i løbet af 1900-tallet"*. **De**
survives in some service branches and very formal letters. Direct **du** address is also part of the
klarsprog overlay `da-easy` already applies (§8a). ⚠ Keep the tiers straight even so: the **usage
facts are sourced**, the **decision taken on them is the project's** under the kit's human-gate rule,
not a ruling by any language authority.

**⚠ The measurement cannot answer this question, in either direction** — there is no measurement
(§8c). And the shortcut to refuse is the one other guides in this kit had to refuse: reading a
**children's** publication's address register as evidence about an easy-read variant for adults.
Across the measured languages, address was found to track **the reader's age, not the text's
difficulty**. `da-easy` addresses adults who read with difficulty; the register stays **du** because
§4's evidence says **du** is the ordinary Danish register for everyone, not because it is the
"simpler" of the two.

### 8f. What `da-easy` is built on, in order of leverage

1. **LIX, applied to whole copy — the quantitative lever Danish contributes and most languages in
   this kit do not have.** Score the finished text, target the low-to-mid 20s (⚠ the band is this
   guide's application of the sourced scale, §8b), and read a bad score as a prompt to **split
   sentences**, which moves both terms of the formula at once.
2. **Structural klarsprog advice** — short sentences, one idea per sentence, active voice, generous
   layout, avoid unnecessary technical terms (§8a). This is where a bad LIX score is actually fixed,
   and it is sourced to the tradition rather than to a word list.
3. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), inherited unchanged (§8a). ⚠ Where the
   kit's sentence-length target and the LIX band pull differently, record the conflict rather than
   resolving it by assertion (§8d).
4. **Term preservation before substitution** — keep the technical term, then *"det betyder: …"*, then
   an example (§8a). With no corpus, this is the safest lexical move in the section.
5. **The du register (§4), held steadily** (§8e).
6. **Vocabulary substitution last** — three canonical rows applied as advice, seven ⚠ editorial rows
   applied as hints, and a native-speaker pass treated as a prerequisite rather than a polish (§8b,
   §8d).

### 8g. What is still open

1. **The corpus that would settle this — and Danish is one half of the way there.** What is needed
   is a **single Danish publisher issuing the same material in a standard and in a klarsprog or
   letlæst edition**. Failing that, the cheapest path is unusually concrete for Danish: an **open,
   collectable standard-register baseline already exists** (`dknyt.dk`, §8c), so **only the plain
   side is missing**. Any adult Danish publication written at a stated easy reading level, with a
   collection policy that permits it, would make a first measurement possible. ⚠ A pair assembled
   that way still differs in **publisher, genre, and topic**, so it would yield structural
   observations at best, not a clean lexical verdict — the one-publisher design remains the target.
2. **A public authority's own two registers is the confound-free shape to look for.** A Danish
   public body that publishes both a regulatory text and its own klarsprog explainer of that text
   would give a **register** pair from one publisher on one topic — the design §8c could not
   assemble from the press, and the one that would test §8b's table properly.
3. **LIX has never been run on `da-easy` copy in this project.** The axis is sourced, the target band
   is set, and no text produced under this guide has been scored. That is the smallest useful piece
   of work in this section and needs no corpus at all.
4. **The word table has not had a native-speaker pass, and no row is individually source-quoted** —
   including the three recorded as canonical (§8b). Sourcing those three to a named klarsprog
   publication would raise the table's floor immediately.
5. **The search has now been run** (2026-07-29), and it closed the wrong half of §8c's negative: the
   Danish letlæst publisher for adults with reading difficulty **exists** — DR Ligetil — and
   declines automated collection (§8c). **Do not spend another pass looking for it.** What is still
   unsearched is the second half of the old item: **municipal or state *sprogpolitik* programs
   that publish their own rewritten texts alongside the originals**, which is item 2's shape and
   the only route left that does not require a license.
6. **No comprehension evidence exists for any of this.** LIX is a formula over sentence and word
   length; whether the forms it rewards are actually *understood* better by the `da-easy` audience
   was not established here.

Sources: <https://www.dansksproghistorie.dk/144/> (LIX formula & scale) ·
<https://dsn.dk/nyt-fra-sprognaevnet/september-2017/skrivearbejdet-i-det-offentlige-hvordan-staar-det-til/>
· <https://ordnet.dk/ddo/ordbog/letlæst> · register evidence in §4 (lex.dk/tiltaleform, quoted
verbatim there) · complex→everyday pairs: three rows canonical klarsprog advice, seven ⚠ editorial;
**no row individually source-quoted** (§8b) ·
**Corpus (§8c) — none.** No Danish plain-register corpus was built, so this section reports no
frequency and no corpus size. The candidates probed, the two reasons they failed — most of them a
publisher's stated position on automated text collection — and the ⚠ exhausted search budget that
weakens the other half of the finding are recorded in §8c; the kit's base rules in
[accessibility-workflow](../accessibility-workflow.md) govern `da-easy`.

---

## 9. Regional variation

**(Strong section — da.wikipedia / lex.dk.)**

**The neutral standard is rigsdansk.** The pan-regional written and spoken standard is **rigsdansk**
(also *rigsmål / rigssprog / standarddansk*), based historically on Zealandic/Copenhagen usage and
now the normative form as traditional dialects recede: *"De traditionelle dialekter er på retur og
erstattes efterhånden af et landsdækkende rigsdansk."* (da.wikipedia). Rigsdansk is the variant
independent of features traceable to a particular region, social placement, or generation.

**Neutrality strategy (explicit).** For a national educational platform, **write rigsdansk** — it is
what learners expect in print and instruction, and it is the written norm codified by
Retskrivningsordbogen. Spoken dialect features (West/South Jutish, Bornholmsk, etc.) do **not**
affect the written norm.

- ✅ rigsdansk (default): **standard RO orthography and neutral vocabulary**
- ❌ broad-dialect spellings or regionalisms in default content

**One written standard.** The Danish written standard is **uniform across Denmark** — Danish does not
split across separate national orthographies, so a **single neutral `da` build serves all readers**.
Faroese/Greenlandic contexts are handled locally, but the Danish written standard itself is uniform;
the only axes to hold are register (du, §4) and rigsdansk vs dialect.

Sources: <https://da.wikipedia.org/wiki/Rigsdansk> · <https://da.wikipedia.org/wiki/Dansk_(sprog)>

---

