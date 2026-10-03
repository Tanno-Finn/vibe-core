<!-- base -->
# lang-nl — Dutch (Nederlands) — language guide

> **Setup & sources live in [`nl.setup.md`](nl.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Nederlands / Dutch.
**BCP 47 code (base):** `nl`.
**BCP 47 code (simplified variant):** `nl-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`nl-x-simple`), but the kit
token `nl-easy` is the one that counts here.
**Speaker reach:** roughly **22–24 million native speakers and about 28 million total speakers**
in common estimates, across the **Netherlands**, **Flanders** (northern Belgium), **Suriname**, and
the Dutch Caribbean (Aruba, Curaçao, Sint Maarten). This replaces the earlier "the research dossier
did **not** supply a sourced speaker count" note, which was **false**: the **companion research
pass** on the same brief opened with a cited profile paragraph and had simply never been merged.
⚠ Community-tier: the citation is a population-statistics aggregator, **not** one of the §2
authorities, and "common estimates" is the companion pass's own hedge — keep it. Official language
of the Netherlands, Belgium (Flanders + Brussels), and Suriname, and a
working language of the intergovernmental **Nederlandse Taalunie** (Netherlands, Flanders,
Suriname).
**Script + direction:** Latin alphabet (Latin-1 / Unicode); **left-to-right**. No romanization
applies. The only orthographically special unit is the **IJ** digraph.
**Status:** planned — authored from external desk research covering base `nl` and the `nl-easy`
pendant: a long main dossier plus a shorter **companion pass** on the same brief, whose speaker
profile, on-domain §7 stock phrases, and five new §6 terminology rows (plus two whose provenance
it corrects) were merged in on **2026-07-27**
(they had been sitting unused). The main dossier's quotes were **then independently reviewed
against their cited sources**, so the verbatim Dutch quotes below are trustworthy; the companion
pass carries **much weaker citations** and everything merged from it is marked at point of use.
**Not yet reviewed by a native speaker** — per the authoring directive's „second set of eyes“ rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.
**Easy or hard for this kit:** Dutch is an **easy** language for the kit's rendering stack — Latin
script, whitespace word separation (standard tokenization applies), no shaping/bidi, and any
competent Latin web font covers it. The risks are **linguistic, not typographic**, and four
dominate: **(1) the IJ digraph capitalizes as two letters** (*IJsland*, never *Ijsland*); **(2)
V2 / verb-final word order** breaks naive English→Dutch machine output; **(3) the je/jij-vs-u
register decision** (with a real NL-vs-Flanders formality gap); and **(4) false friends** —
*eventueel* ≠ „eventually“, *miljard* ≠ „billion“.

> **Editorial note on quotation marks in this guide.** This guide's own English prose uses the
> kit's house „low-high“ quotation marks. Dutch itself does **not** use that German-style low
> quote — §3 documents the correct Dutch marks and flags the „…“ form as a trap. So: „…“ in the
> running English text is house style; the Dutch **examples** always show Dutch marks.

Sources: <https://taalunie.org/> · <https://taaladvies.net/> ·
<https://en.wikipedia.org/wiki/IJ_(digraph)> ·
<https://worldpopulationreview.com/country-rankings/dutch-speaking-countries> (the 22–24 M / 28 M
speaker figures, as cited by the companion research pass — ⚠ community-tier aggregator, not
re-fetched here)

---

## 1. Header block

See above. One-line orientation: Dutch is a West-Germanic, LTR, whitespace-separated language with
a single cross-border written standard (**Standaardnederlands**) governed by the **Nederlandse
Taalunie**; the localization risks concentrate in **IJ capitalization, V2/verb-final syntax, the
je/u register choice, comma-decimal number formatting, and a handful of high-frequency false
friends**.

Sources: as the header block above — <https://taalunie.org/> · <https://taaladvies.net/>

---

## 4. Grammar for translators

**Word order — V2 in main clauses, verb-final in subclauses.** Dutch is an **SOV language with a V2
constraint**: the finite verb sits in **second position** in a main clause but goes to the **end**
in a subordinate clause. (This is textbook-standard Dutch syntax — editorial; the research's only
citation for it was a withheld tertiary source, see §2.)

- ✅ Main clause: **Ik lees vandaag het boek.** (finite verb *lees* in 2nd position)
- ✅ Fronted adverbial forces subject-verb inversion: **Vandaag lees ik het boek.** (verb still 2nd,
  subject *after* the verb)
- ❌ English SVO carried over after fronting: **Vandaag ik lees het boek.** (verb pushed to 3rd —
  the single most common machine-translation defect in Dutch)
- ✅ Subordinate clause sends the verb to the tail: **…omdat ik vandaag het boek lees.**
- ❌ Verb kept in 2nd position in a subclause: **…omdat ik lees vandaag het boek.**
- ✅ Separable verb splits, particle to the end: **Ik zet de computer aan** / **…omdat ik de
  computer aanzet.**

**Translator takeaway:** you cannot map English SVO 1:1. Fronting *anything* (a time phrase, „In
this lesson…“) triggers subject-verb inversion, and every *dat / omdat / als / terwijl / die* clause
sends the finite verb to the end. This is the highest-frequency source of stilted machine-Dutch.

**Register — je/jij vs u, and the project's recorded choice.** Dutch has an informal **je/jij**
(tutoyeren) and a formal **u** (vousvoyeren). The historical etiquette and the modern drift are both
sourced (Wikipedia):

> Tradition: „Volgens de etiquette wordt eenieder geacht om een ander met u aan te spreken, totdat
> een van beiden het initiatief neemt“.
> Modern drift: „Omstreeks 1980 ging de trend in de omgekeerde richting: tegenwoordig zegt men al
> heel vaak 'jij' tegen elkaar, bijvoorbeeld tegen ouders, werkgevers enz“ and „In het Nederlands
> is tutoyeren thans normaal tussen mensen die elkaar kennen en tegen jongeren“.

The choice matters because it changes verb agreement *and* the possessive: *jij hebt* / *u hebt*
(or *u heeft*), *jij kunt* / *u kunt*; possessive *je* → *uw*. In the Netherlands, learner-facing
educational and consumer-tech products overwhelmingly use informal **je/jij** (approachable,
modern, matching the „jongeren“/peers register above). Flanders is markedly more formal and reaches
for **u** far more readily (see §9).

> **Register decision (human-gate): je/jij (informal) — taken and recorded.** On the quality
> argument: for a **Netherlands-primary educational platform**, the
> default second-person register is **informal je/jij**, grounded in the sourced *tutoyeren* trend
> above (informal is now normal „tegen jongeren“ and between people who know each other).
> **`u` is the register for a Flanders-primary or formal deployment** — Flemish audiences read a
> Netherlands-tuned je/jij as too familiar (§9). **Binding for all second-person copy in `nl` and
> `nl-easy`:** pick **one** register per deployment and hold it consistently — mixing je and u
> within a single flow reads as an error, including in playful passages. Default build = je/jij;
> switch the whole build to u when Flanders is primary or the audience skews formal/older.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ informal (NL default): **Je kunt je voortgang opslaan.**
- ✅ formal (Flanders / formal build): **U kunt uw voortgang opslaan.**
- ❌ register mix in one flow: **Je kunt uw voortgang opslaan.** (je + uw — a defect)

**The five EN→NL traps that break naive translation:**

**(1) English „you“ hides the register decision.** Every sentence forces a je/u commitment, and
verb + possessive follow it (see the pairs above). A translator (or MT) that leaves „you“
register-flat cannot produce correct Dutch — the register must be chosen first (§ decision above).

**(2) False friend *eventueel* ≠ „eventually“.** *eventueel* means **possibly / if applicable**;
„eventually“ is **uiteindelijk**. (Editorial — classic Dutch false friend.)

- ✅ „The model will eventually converge“ → **Het model convergeert uiteindelijk.**
- ❌ **Het model convergeert eventueel.** (reads as „…possibly converges“)

**(3) The progressive („-ing“) has no 1:1 form.** English „is learning“ is usually simple present
in Dutch (*leert*), or the *aan het …* periphrasis (*is aan het leren*). Literal *is lerend* is
wrong. (Editorial.)

- ✅ „The system is learning from data“ → **Het systeem leert van data.**
- ❌ **Het systeem is lerend van data.**

**(4) Present perfect where English uses simple past.** Dutch prefers the *voltooid tegenwoordige
tijd* for recent/relevant events. (Editorial.)

- ✅ „We trained the model“ → **We hebben het model getraind.**
- ❌ (often stilted) **We trainden het model.**

**(5) Separable verbs split, and the particle lands far away.** Verbs like *aanzetten, invoeren,
opslaan, uitloggen* split in main clauses; MT frequently drops or misplaces the particle.
(Editorial.)

- ✅ „Enter your name“ → **Voer je naam in.** (the *in* detaches to the end)
- ❌ **Voer in je naam.** / **Voer je naam.** (particle misplaced or dropped)
- Note it *stays together* in an infinitival subclause: „Log in to continue“ → **Log in om verder
  te gaan.**

Sources: <https://nl.wikipedia.org/wiki/Tutoyeren_of_vousvoyeren> ·
<https://www.communicatierijk.nl/vakkennis/rijkswebsites/aanbevolen-richtlijnen/taalniveau-b1>
(register practice for websites) · word-order + false-friend + aspect features are editorial /
textbook-standard Dutch (see §2 provenance caveat)

---

## 5. Numbers, dates, currency

**Digit system.** Western digits **0–9** throughout; Dutch has no native alternate digit set. No
digit-system choice to make.

**Decimal separator = comma; grouping separator = dot (period).** This is the reverse of English.
The CLDR `nl` verify chart shows the grouped form **1.000.000** (period as the thousands
separator) and a comma decimal (**-123.456,7**) — re-confirmed against **CLDR 48.2**. So:

- ✅ twelve-and-a-half thousand = **12.500,5**; one-and-a-half million = **1.500.000**
- ❌ English formatting carried over: **12,500.5** / **1,500,000**

**Currency (euro).** The **€ symbol goes *before* the amount, with a space**. The
CLDR `nl` standard currency pattern is **`¤ #,##0.00`** — now read from **CLDR 48.2** release data
rather than from a search result, so the ⚠ that stood here is resolved.

⚠ **"Non-breaking" was a claim this guide could not support, and it is withdrawn.** An earlier
revision wrote *"before the amount, with a **non-breaking** space"* and asserted that the
non-breaking placement was read from the release data. Neither research pass says anything of the
kind — the words *non-breaking*, *nbsp*, and the codepoint U+00A0 appear **nowhere** in either of
them — and all seven euro literals in this guide (§3, §5, §10, §11) were written with an ordinary
U+0020, so the section prescribed one character and demonstrated another. What is sourced is the
**placement** (symbol first, then a space), not the identity of the space. Using U+00A0 there is a
perfectly defensible typographic decision, but it would be **this project's** decision and would
have to be recorded as one — and then every literal re-encoded to match. Neither is done here.

<!-- lang-check: space-codepoint:00A0 - U+00A0 is named twice in the §5 note above only to record
     that the earlier non-breaking-space claim was withdrawn as unsourced. The guide deliberately
     prescribes an ordinary space, so the character must NOT appear in any example; its absence is
     the correct state, not the defect this check normally catches. -->

- **Everyday form: € 1.234,56.** The separators (comma decimal, dot grouping) and the
  €-before placement are both in the release data; the composed string itself is still a
  composition of those rules, not a verbatim chart cell.
- Commercial copy often writes whole-euro amounts as **€ 12,-** (editorial).
- **Negative amounts — corrected.** The earlier claim that `nl` uses a *trailing* sign
  (`¤ #,##0.00-`) was **wrong**. CLDR 48.2 `nl` gives **`¤ #,##0.00;¤ -#,##0.00`** — the minus sits
  **between the symbol and the digits**: **€ -12,3**, not *€ 12,3-*. The accounting pattern
  parenthesizes instead: **(€ 12,30)**.

**Date format.** Little-endian **day-month-year**; dashes are standard — the CLDR 48.2 `nl` short
pattern is **`dd-MM-y`**. Wikipedia:
„dates are written using the little-endian pattern 'day–month–year' (DMY)“ and „dashes (-) are
typically used as separators, but slashes (/) are used as well.“ Month and weekday names are
**lowercase** in Dutch (editorial — standard orthography).

- ✅ July 25, 2026 → **25-07-2026** or long form **25 juli 2026**
- ❌ American middle-endian: **07-25-2026**; ❌ capitalized month: **25 Juli 2026**

**Time.** 24-hour clock, dot or colon separator, often followed by *uur*. Wikipedia: „time is
expressed in the 24-hour notation, with or without leading zero, using a period or colon as a
separator“ — e.g. **22.51 uur** / **09:12**.

**Large-number false friend (high-risk for AI/data copy).** Dutch **miljard = 10⁹** („billion“ in
English), while **biljoen = 10¹²**. English „billion“ → Dutch **miljard**, *never* *biljoen*.
(Editorial — a high-frequency numeric trap.)

- ✅ „3 billion parameters“ → **3 miljard parameters**
- ❌ **3 biljoen parameters** (off by a factor of 1000)

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/nl.html> (decimal comma, dot
grouping, sign placement) · <https://cldr.unicode.org/downloads/cldr-48> (release read: **CLDR
48.2**, 2026-03-17 — supersedes the earlier v44 chart; the separators were unchanged, the negative
currency form was corrected) ·
<https://en.wikipedia.org/wiki/Date_and_time_notation_in_the_Netherlands> ·
the composed „€ 1.234,56“ string is derived from the pattern, not a verbatim chart cell ·
the **non-breaking**-space claim that stood in this section is **withdrawn**: nothing in either
research pass supports it and every literal in the guide contradicted it — only the €-before-space
**placement** is sourced · *miljard ≠ billion* is editorial

---

## 6. Terminology strategy

**Loanword vs coinage — the general pattern.** Technical Dutch freely mixes native **coinages**
(*kunstmatige intelligentie*, *machinaal leren*, *diep leren*, *neuraal netwerk*) with retained
**English loanwords** (*machine learning*, *deep learning*, *prompt*, *token*, *reinforcement
learning*). Real AI writing often keeps the English term or shows both, introducing the coinage
once. Wikipedia (machinaal leren): „Machinaal leren of machinelearning (ook vaak afgekort tot ML)
is een subset van kunstmatige intelligentie“ — loan and coinage coexisting. **For an educational
platform, lead with the Dutch coinage as the headword and gloss the English term on first use.**

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give target term + original + a short plain gloss, then
use the target term alone afterwards. Instantiated in Dutch:

> **neuraal netwerk** (neural network) — een rekenmodel dat in lagen is opgebouwd en, geïnspireerd
> op de neuronen in de hersenen, patronen uit data leert. *(“… a layered computational model,
> inspired by the neurons in the brain, that learns patterns from data.”)*

After first mention: **neuraal netwerk** alone. (The Dutch term is sourced below; the explanatory
clause is authored per the sandwich format, not a sourced string.) Project coinages (C1) keep their
original spelling in Dutch text and are owned by the term-sheet, not this table.

**Seed field vocabulary (AI/ML).** Field-standard renderings; provenance is marked per row. Prefer
the Dutch coinage as headword and gloss the English on first use.

⚠ **On the rows marked "companion pass".** The companion research pass carried its own 15-row Dutch
AI/ML term list, which had never been merged; five terms this table lacked (*kenmerk, voorspelling,
classificatie, regressie, inferentie*) and two it carried unsourced (*dataset*, *hallucinatie*) come
from it. Its evidence is thin and is **not** laundered here: the only URL it attaches to that list
is `taalunie.org/spelling-en-taaladvies`, a spelling-advice hub that does **not** carry these terms.
So those rows are **effectively uncited** — the renderings are ordinary technical Dutch and a
translator using them will be fine, but nothing in the research *attests* them, and they must not be
promoted to "settled" without a lexical source.

| Concept (EN) | Dutch term | Provenance |
|---|---|---|
| Artificial intelligence (AI) | kunstmatige intelligentie (KI) / artificiële intelligentie (AI) | Wikipedia: „Kunstmatige intelligentie (KI) of artificiële intelligentie (AI) is een brede term in de computerwetenschappen“ ✓ |
| Machine learning (ML) | machinaal leren / machinelearning | Wikipedia: „Machinaal leren of machinelearning (ook vaak afgekort tot ML)“ ✓ |
| Neural network | neuraal netwerk | Wikipedia: „een statistisch model, bijvoorbeeld een neuraal netwerk“ ✓ |
| Deep learning | diep leren / deep learning | Wikipedia: „sub-technieken zoals deep learning en reinforcement learning“; university LibGuide gloss ✓ (English form common) |
| Reinforcement learning | reinforcement learning / bekrachtigingsleren | Wikipedia (English form dominant) ✓; *bekrachtigingsleren* is the calque, less common — editorial |
| Algorithm | algoritme | university LibGuide: algoritme = „stappenplannen die problemen oplossen“ ✓ |
| (Large) language model (LLM) | (groot) taalmodel | LibGuide: taalmodel = „AI techniek die getraind is op grote hoeveelheden tekstdata…“ ✓; *groot taalmodel* rendering — editorial |
| Generative AI (GenAI) | generatieve AI (GenAI) | LibGuide: „door middel van prompts kun je GenAI-tools opdrachten geven…“ ✓ |
| Training data / to train | trainingsdata / trainen | LibGuide: „getraind op grote hoeveelheden tekstdata“ ✓ |
| Prompt | prompt | LibGuide uses it directly ✓ — loanword, no native coinage in common use |
| Pattern recognition | patroonherkenning | Wikipedia: „…vormen van patroonherkenning te digitaliseren“ ✓ |
| Model | model | Wikipedia: „een statistisch model“ ✓ — direct cognate |
| Data / dataset | data / dataset / gegevensverzameling | ⚠ companion pass, effectively uncited — it gives *dataset / gegevensverzameling* ("dataset is common; explanatory prose may prefer the native form"); *gegevens* as the plain native word is editorial |
| Hallucination (of a model) | hallucinatie / hallucineren | ⚠ companion pass, effectively uncited — listed as "increasingly used for model errors"; widely seen in NL AI journalism, flag before publishing |
| Token / tokenization | token / tokenisatie | ⚠ **unsourced** (editorial) — English loanwords, no established native coinage; verify if load-bearing |
| Feature | kenmerk | ⚠ companion pass, effectively uncited — "very common in explanatory Dutch" |
| Prediction | voorspelling | ⚠ companion pass, effectively uncited — given as the standard native term |
| Classification | classificatie | ⚠ companion pass, effectively uncited — given as the standard technical term |
| Regression | regressie | ⚠ companion pass, effectively uncited — given as the standard technical term |
| Inference | inferentie | ⚠ companion pass, effectively uncited — flagged there as technical/academic register |

**Guidance.** For a book/educational context prefer the Dutch coinage as headword (*kunstmatige
intelligentie, machinaal leren, neuraal netwerk, groot taalmodel, generatieve AI, algoritme,
trainingsdata*) and gloss the English in parentheses on first use. Keep *prompt, deep learning,
reinforcement learning, token* in English if the readers are already tech-adjacent; otherwise
gloss. Freeze the chosen forms in the project glossary and do not mix competing renderings.

Sources: <https://nl.wikipedia.org/wiki/Machinaal_leren> ·
<https://nl.wikipedia.org/wiki/Kunstmatige_intelligentie> ·
<https://libguides.library.uu.nl/Artificiele_Intelligentie> (university LibGuide — *deep learning*,
*algoritme*, *taalmodel*, *generatieve AI*, *trainingsdata*, *prompt*) · the rows marked
**companion pass** come from the second desk-research pass's AI/ML term list; the only URL that
pass attaches to the list is <https://taalunie.org/spelling-en-taaladvies>, which is a
spelling-advice hub and does **not** carry these terms — so they are cited here as
**effectively uncited**, not as Taalunie-attested · *token / tokenisatie* remains ⚠ unsourced /
editorial

---

## 7. Idiom anti-patterns

**What this section is now, and what it used to be.** The previous revision shipped a
**general-purpose ESL idiom list** — *raining cats and dogs*, *when pigs fly*, *break a leg* —
carried faithfully from the main dossier. That is not what §7 is for. The authoring directive asks
for the **stock phrases of educational and technical writing** (*step by step*, *under the hood*),
because those are the phrases this platform's copy actually contains: nobody translating an
AI course needs *als Pasen en Pinksteren op één dag vallen*, and the old table gave no help at all
with *under the hood*. The on-domain table below was sitting in the **companion research pass** the
whole time and had never been merged into any guide; this revision merges it.

**Provenance — how the rows were raised.** The companion pass delivered these rows with **no
per-row citation**: the only URL it attaches to the whole section is the root of `taaladvies.net`,
which is a language-advice front page and does not carry an idiom list. Rather than ship that,
**every ✅ was taken back to a source** — the Algemeen Nederlands Woordenboek (ANW, Instituut voor de
Nederlandse Taal), Taaladvies.net, Onze Taal, the free dictionary at `woorden.org`, and Dutch
technical/encyclopedic prose. The tier column records what was found. **Only `dictionary` and
`advice` rows may inform a §11 check**; `corpus` rows evidence usage, not prescription; `⚠ craft`
rows stay barred from tooling.

| English stock phrase | ✅ Idiomatic Dutch | ❌ Literal calque (wrong) | ✅ tier |
|---|---|---|---|
| step by step | **stap voor stap** | *stap door stap* — ⚠ craft | dictionary + corpus |
| under the hood | **onder de motorkap** | *(none — see below)* | **dictionary (ANW)** + corpus |
| at a glance | **in één oogopslag** | *bij een blik* — bare, as an adverbial; *bij een blik op X* is fine Dutch | dictionary + advice + corpus |
| from scratch | **vanaf nul** | *van kras* — ⚠ craft | corpus |
| keep in mind | **houd in gedachten** · **houd er rekening mee dat** | *bewaar in gedachten* — ⚠ craft | dictionary (base form) |
| make sure | **zorg ervoor dat** · **zorg dat** | *maak zeker* — ⚠ craft | **advice (Taaladvies)** |
| in plain language | **in duidelijke taal** | *(none — see below)* | campaign-attested + corpus |
| on the fly | **tussendoor** / **ad hoc** — ⚠ neither renders the technical sense | *op de vlieg* — ⚠ craft | dictionary (words only) |
| back and forth | **heen en weer** | *terug en vooruit* — **standard Dutch, incl. browser back/forward** | dictionary + corpus |
| out of the box | **kant-en-klaar** · **direct bruikbaar** / **standaard** | *uit de doos* — ⚠ craft | corpus |
| a rule of thumb | **vuistregel** | *regel van duim* — ⚠ craft, but the best-supported ❌ here | **dictionary ×3** |
| in the long run | **op de lange termijn** · **op lange termijn** | *in de lange run* — ⚠ craft | **dictionary** (both forms) |

**The ✅ column, sourced.** Quotes below are verbatim from the URLs in the Sources footer:

- **onder de motorkap** — the best-evidenced row in the table. The ANW lists it under *Vaste
  verbindingen* **with the figurative software sense spelled out**: "buiten het zicht voor de
  gebruiker werkzaam; op een wijze die onopgemerkt blijft voor de gebruiker", and its own example is
  a computing one — "Hoewel moderne computerprogramma's een grafische gebruikersinterface hebben,
  bestaan ze onder de motorkap nog steeds uit series instructies." Corpus: nl.wikipedia, *Unix* —
  "Ook macOS, het besturingssysteem van Apple, is \"onder de motorkap\" Unix".
- **zorg ervoor dat** — Taaladvies.net answers the exact construction: "Zowel *Zorg dat ze op tijd
  komt* als *Zorg ervoor dat ze op tijd komt* is correct." Its own worked example is in this guide's
  **je** register: "(3a) Zorg ervoor dat je schaapjes op het droge zijn." So **zorg dat** is equally
  correct and the row now says so. Corpus, same register: nl.wikipedia, *Eerste hulp bij ongevallen*
  — "Zorg ervoor dat je zelf, omstanders en het slachtoffer geen gevaar lopen".
- **vuistregel** — three independent entries. `woorden.org`: "algemene regel die je in de meeste
  gevallen kunt toepassen"; the Wiktionary entry records that "Het woord vuistregel staat in de
  Woordenlijst Nederlandse Taal van de Nederlandse Taalunie" — i.e. it is in the official word list;
  and the ANW carries the lemma. Corpus: nl.wikipedia, *Piano (instrument)* — "de vuistregel is dat
  men globaal twee keer per jaar … een stembeurt laat uitvoeren".
- **op de lange termijn / op lange termijn** — `woorden.org` gives "op de lange termijn (na lange
  tijd)"; the ANW gives the article-less variant under *Vaste verbindingen*: "op lange termijn —
  binnen of aan het eind van een lange periode vanaf nu." Both are standard; the row no longer
  implies only one is.
- **stap voor stap** — `woorden.org`, entry *stap*: "stap voor stap (langzaam en geleidelijk)".
  Corpus: nl.wikipedia, *YouTube* — "werd de website stap voor stap opgezet".
- **in één oogopslag** — `woorden.org`, entry *oogopslag*: "in een oogopslag zien (meteen zien)".
  Onze Taal's Taalloket uses the accented form in its own example sentence ("Ik zag in één oogopslag
  dat ze zich niet goed voelde"), which also settles the *één* spelling. Corpus: nl.wikipedia,
  *macOS* — "waarmee in één oogopslag het weer, wereldtijden, beurskoersen en vluchtinformatie te
  zien zijn".
- **houd in gedachten** — the dictionary attests the base form, not the imperative: `woorden.org`,
  entry *gedachte*, "iets in gedachten houden (iets onthouden)". ⚠ The bare imperative *houd in
  gedachten dat* is **rare** in Dutch running prose; **houd er rekening mee dat** is the commoner
  instructional form and has been added to ✅.
- **vanaf nul**, **direct bruikbaar** — corpus only; no dictionary entry was found for either fixed
  string (`woorden.org` has no *vanaf nul*, and the ANW returns "sorry, dit artikel staat (nog) niet
  in het ANW" for *nul*). nl.wikipedia, *Windows Vista* — "opnieuw begonnen zijn vanaf nul". ⚠ For
  "out of the box", **kant-en-klaar** carries far more corpus weight than *direct bruikbaar* and has
  been promoted to the front of the cell; Dutch technical prose also simply keeps the English
  (*Object Pascal*: "werkt het vaak niet out-of-the-box").
- **tussendoor / ad hoc** — ⚠ **a semantic mismatch this table previously hid.** Both are
  dictionary-attested words (`woorden.org`: *tussendoor* = "tussen andere dingen of werkzaamheden
  door"; *ad hoc* = "voor dit speciale geval"), but **neither renders the technical sense of "on the
  fly"** — *while running, dynamically*. Dutch technical writing keeps the English for that sense
  (nl.wikipedia, *Glitch (muziek)*: "meer ruimte voor free-styling en \"on the fly\" remixing").
  Treat this row as covering the everyday sense only.

**⚠ The ❌ column is craft — and the national language authority says so about the whole method.**
A wrong calque is what actually stops a translator making the error, and it is the least attestable
column in the table. **Not one of these forms could be sourced to a Dutch anglicism or
*steenkolenengels* advice page**, and Taaladvies.net's own page on the subject explains why that is
not an accident: "Er bestaat geen vaste en/of uitputtende lijst van barbarismen in het Nederlands",
and it states that "de termen barbarisme, anglicisme, gallicisme en germanisme in de adviezen op
Taaladvies.net niet gebruikt" worden. The forms it does discuss (*een beslissing maken*,
*actie nemen*) are none of ours. What could be established is narrower: *stap door stap*,
*bewaar in gedachten*, *regel van duim*, and *in de lange run* return **zero** occurrences in Dutch
Wikipedia article space, and *duimregel* is not a defined Dutch word at all. Read this column as
"not idiomatic", never as "documented mistake", and **do not promote it into a §11 check**.

**Three ❌ cells were removed or reworded, because they condemned ordinary Dutch.**

- **in plain language** — the previous revision flagged ❌ *in eenvoudige taal* and argued the row
  was load-bearing because it walked away from the national campaign's vocabulary. Half of that is
  right: the campaign really does say *duidelijke taal* — `directduidelijk.nl` opens "Direct
  Duidelijk staat voor duidelijke taal." But **eenvoudige taal is the Dutch government's own term
  too, for a different register**: the Rijksoverheid publishes its budget summaries under the
  heading "Prinsjesdag 2025 in eenvoudige taal". That is the **Easy-Language** register — precisely
  what this platform ships as `de-easy` / `en-easy`. So the two are a **distinction, not an error**:
  *duidelijke taal* is plain language, *eenvoudige taal* is easy language, and an `nl-easy`
  translator should be reaching for the second. The ❌ is gone and §8 should be read with this in
  mind.
- **under the hood** — ❌ *onder de kap* is native Dutch automotive idiom, not a calque:
  nl.wikipedia, *Volkswagen Golf* — "Deze auto heeft een 2.0 TDI Common Rail diesel onder de kap",
  and the same construction recurs for the Renault Clio, Subaru Impreza, and Ford Focus. What is
  *not* attested is *onder de kap* in the figurative software sense — but that is a much weaker
  claim than "wrong", so the cell is gone rather than restated.
- **back and forth** — ❌ *terug en vooruit* is good Dutch, and in this guide's own domain: it is the
  standard rendering of **browser back/forward navigation**. nl.wikipedia, *Microsoft Edge* —
  "ondersteuning voor veegbewegingen om terug en vooruit te gaan". It is only wrong as a rendering
  of repeated to-and-fro motion; the cell now says that instead of forbidding the phrase.
- **at a glance** — ❌ *bij een blik* was narrowed rather than removed: *bij een blik op X* is
  grammatical Dutch ("on looking at X" — nl.wikipedia, *Vierlandenpunt*: "bij een blik op de
  wereldkaart"), and it is only the bare adverbial standing in for "at a glance" that fails.

**Register.** *houd in gedachten*, *houd er rekening mee dat*, and *zorg ervoor dat* are **je/jij**
imperatives, which is the recorded §4 register — and the Taaladvies and EHBO quotes above are
themselves in that register, so this is sourced rather than assumed. A *u*-build has to restate them
(*houdt u er rekening mee*, *zorgt u ervoor dat*) rather than mix registers.

**Dropped rows, and why that is not lost work.** Two of the twelve general idioms the previous
revision carried were genuinely fetch-sourced — *het regent pijpenstelen* and *twee vliegen in één
klap* — and both remain correct Dutch. They are dropped rather than re-homed because neither is a
phrase this platform's copy produces; their citations stay in the Sources footer so the deletion
stays auditable. The other ten were self-marked editorial.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it. Keep the
grammar-level anti-patterns from §4 alongside this table (V2/verb-final calques, the *is lerend*
progressive calque, the split-verb particle drop, the *eventueel*/*miljard* false friends).

Sources: **✅-column attestations, each fetched and quoted above** —
<https://anw.ivdnt.org/article/motorkap> (ANW *vaste verbinding*, with the figurative software
sense) · <https://anw.ivdnt.org/article/termijn> · <https://anw.ivdnt.org/article/vuistregel> ·
<https://taaladvies.net/zorgen-dat-of-ervoor-zorgen-dat/> (Taalunie advice, exact imperative, exact
**je** register) · <https://onzetaal.nl/taalloket/een-van-de> (*in één oogopslag* in Onze Taal's own
example) · <https://www.woorden.org/woord/stap> · <https://www.woorden.org/woord/oogopslag> ·
<https://www.woorden.org/woord/gedachte> · <https://www.woorden.org/woord/vuistregel> ·
<https://www.woorden.org/woord/termijn> · <https://www.woorden.org/woord/heen> ·
<https://www.woorden.org/woord/tussendoor> · <https://www.woorden.org/woord/ad%20hoc>
(a free general dictionary, not a Taalunie publication — recorded as such, not laundered) ·
<https://nl.wiktionary.org/wiki/vuistregel> (community-tier, but it records the Taalunie
*Woordenlijst* membership) · <https://www.directduidelijk.nl/> (the plain-language campaign's own
wording) · <https://www.rijksoverheid.nl/actueel/nieuws/2025/09/16/prinsjesdag-2025-in-eenvoudige-taal>
(the government's own *eenvoudige taal* heading — why that ❌ was removed) ·
<https://taaladvies.net/barbarismen-anglicismen-gallicismen-germanismen-algemeen/> (the Taalunie's
statement that no fixed list of barbarisms exists — the basis for tiering the whole ❌ column as
craft) · corpus rows quoted from <https://nl.wikipedia.org/wiki/Unix>,
<https://nl.wikipedia.org/wiki/Eerste_hulp_bij_ongevallen>,
<https://nl.wikipedia.org/wiki/Volkswagen_Golf>, <https://nl.wikipedia.org/wiki/Microsoft_Edge>,
<https://nl.wikipedia.org/wiki/Windows_Vista>, <https://nl.wikipedia.org/wiki/MacOS>,
<https://nl.wikipedia.org/wiki/YouTube> and <https://nl.wikipedia.org/wiki/Piano_(instrument)>
(corpus tier — Dutch technical and encyclopedic prose, **not** a normative source) ·
the rows themselves came from the **companion desk-research pass on the same
brief**, which supplied them **without per-row citations**; the only URL its idiom section carries
is <https://taaladvies.net/> (site root), which does **not** underwrite anything · **the ❌ column
remains ⚠ craft** and is barred from §11; native-speaker confirmation still pending for every row ·
<https://blogs.transparent.com/dutch/dutch-idioms-25-its-raining/> (*pijpenstelen*) and
<https://www.ensie.nl/nederlandse-spreekwoorden/twee-vliegen-in-een-klap-of-lap-slaan-of-vangen>
(*twee vliegen in één klap*) — the two fetched rows of the previous, off-brief table, retained here
so the evidence trail for their removal stays readable

---

## 8. Simplified-language pendant (`nl-easy`)

**(Strong section for the standard — Dutch has a named, government-backed plain-language tradition,
so 8a–8b record a standard rather than an absence, and `nl-easy` does not simply inherit the kit's
base rules wholesale. The corpus measurement added in 8c is a separate and much weaker instrument,
and the first thing it establishes is its own blind spot: both corpora are Belgian Dutch (Flemish),
which is not the variety this guide targets, and the word list this section rests on targets a
bureaucratic register neither corpus contains.)**

What the measurement *does* carry is **structure**, and it moves the section's center of gravity.
Five word pairs come back **reversed**, and they share one explanation: the recommended everyday
words are subordinate-clause introducers and modals, and easy-language practice does not avoid the
words — it avoids the **construction**, splitting one sentence into two main clauses instead. Mean
sentence length says the same thing directly: **10.10 against 14.98** words. So the first `nl-easy`
rule is **split the sentence**, not **swap the word**. One base rule *was* measured and *is*
supported: the passive auxiliary `worden` runs roughly **ten times rarer** in the plain corpus, which
backs the active-voice rule for Dutch — worth stating outright, because the same base rule failed
under measurement in Finnish, so it is not a rule that transfers automatically.

### 8a. ✅ The standard: taalniveau B1 and the „Duidelijk.“ campaign

**Tradition & official framework — taalniveau B1 + „Duidelijk.“.** The Netherlands centers plain
language on **taalniveau B1** (CEFR B1) and the national **Direct Duidelijk / „Duidelijk.“**
campaign. CommunicatieRijk on B1:

> „Taalniveau B1 staat voor eenvoudig Nederlands.“
> „De overgrote meerderheid van de bevolking begrijpt teksten op taalniveau B1.“
> Rules: „eenvoudige woorden die bijna iedereen gebruikt“ and „korte, eenvoudige en actieve zinnen“.

The Taalunie on the „Duidelijk.“ campaign (Taalunie + Ministry of the Interior + Gebruiker
Centraal):

> „Op maandag 10 oktober 2022 startte de campagne 'Duidelijk.', die overheden in Nederland
> aanspoort werk te maken van begrijpelijke communicatie.“
> Problem scale: „Voor een derde van alle Nederlanders is informatie van de overheid lastig te
> begrijpen.“
> The *Direct Duidelijk Deal* pledge: „Dat is een intentieverklaring voor overheden: een afspraak
> binnen je organisatie om duidelijk te communiceren.“

**Two Dutch names, two registers — and `nl-easy` is the second one.** §7 settled this against the
government's own wording: *duidelijke taal* is what the national campaign calls **plain language**
(„Direct Duidelijk staat voor duidelijke taal.“), while *eenvoudige taal* is the term the
Rijksoverheid itself uses for the **easy-language** register (its budget summaries are published
under the heading „Prinsjesdag 2025 in eenvoudige taal“). An `nl-easy` translator is reaching for
**eenvoudige taal**; the B1 material below is the plain-language layer it sits on top of.

**Is there one official standard?** No single legally-binding numeric standard; **B1 is the de-facto
recommended target** for government / broad-public content, with **A2** offered for low-literate
audiences (⚠ the „~20% find B1 too hard / ~2.5 million low-literate → offer A2“ figure is a
paraphrase from a search result, not a fetched authority string).

**Quantitative B1 rules (craft consensus; sourced where marked, else editorial):**

- Short sentences, one main idea per sentence (rule of thumb ~10–15 words; ⚠ editorial — commonly
  taught, not a Taalunie decree). **The measurement now puts a Dutch-specific number beside this
  heuristic: 10.10 words in the plain corpus against 14.98 in the standard one (8c).**
- **Active voice** — „actieve zinnen“ (sourced above). **This is the one base rule the measurement
  independently supports for Dutch** (`worden`, 8c).
- **Simple, common words** — „eenvoudige woorden die bijna iedereen gebruikt“ (sourced above).
- Avoid empty bureaucratic connectors (*in het kader van*, *met betrekking tot* → drop or replace
  with *bij / aan / over*).
- Clear headings/subheadings; address the reader directly (editorial; 8e).

### 8b. The axis — ambtelijke taal — and where the measurement relocates it

**Name the axis: what the table below strips out is *ambtelijke taal*, Dutch officialese.** The word
list is not an arbitrary collection of hard words; it is one specific layer — the vocabulary of
letters, forms, and decisions from public bodies, which is exactly the register the „Duidelijk.“
campaign was launched against („Voor een derde van alle Nederlanders is informatie van de overheid
lastig te begrijpen“, 8a). A translator who knows the axis can extend the table; a translator who
only has the table cannot.

**⚠ Where the measurement relocates the axis — from vocabulary to sentence architecture.** Between
the two corpora measured in 8c, **sentence length separates plain from standard prose cleanly and
the word list barely registers at all.** Mean sentence length runs **10.10 against 14.98** words;
of the fifteen pairs put to the corpus, **eight are untestable, one is thin, five run backwards, and
exactly one comes back partially supported**. This does **not** demote the word list — the corpora do
not contain the register it targets (8c) — but it does fix the order of work: **rebuild the sentence
first, swap words second.** And the five reversals are not noise: they have a single structural
explanation, set out in 8d.

**Term-preservation rule (restated, binding).** In `nl-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Use the same term as the base variant, then „dat betekent:
…“, then a concrete example. E.g. keep **neuraal netwerk**, then explain it in plain Dutch; do
**not** replace it with an invented everyday word. This is distinct from the table below, which
targets bureaucratic *non-technical* vocabulary.

**Complex → everyday word table (`nl-easy`).** From the kankan.nl „Helder Nederlands“ ambtelijke-taal
list (fetched); the two bonus rows are marked. **The corpus column in 8c is not a tier and must not
be read as one:** a row the corpora could not reach keeps its standing on the list's own authority,
unchanged.

| Formal / bureaucratic | Everyday Dutch | In the 8c measurement |
|---|---|---|
| aangaande | over | untestable — formal word absent from both corpora |
| aangezien | omdat | 🔴 **reversed** — see 8d |
| aanvang | begin | 🔴 **reversed** — see 8d |
| abusievelijk | per ongeluk | untestable — both members absent |
| afgezien van | behalve | not measured |
| als gevolg van | door | not measured |
| alvorens | voordat | thin — too few tokens to judge |
| betreffende | over | untestable — formal word absent from both corpora |
| bijgevolg | dus | untestable — formal word absent from both corpora |
| conform | volgens | 🔴 **reversed** — see 8d |
| derhalve | daarom *(bonus)* | partial — the only row with any support |
| met betrekking tot | over *(bonus)* | not measured |

### 8c. The measurement — two **Flemish** corpora, and what they cannot see

**Tool:** `scripts/corpus-measure.mjs` in this repo. Frequencies below are per **100,000 word
tokens**. Both corpora were fetched and counted on **2026-07-27**.

| | Publication | Kind | Documents | Word tokens | Mean sentence |
|---|---|---|---|---|---|
| **A (plain)** | Wablieft (`wablieft.be`) | Easy-language newspaper, **Flanders** | **250** | **46,462** | **10.10** |
| **B (standard)** | BRUZZ (`bruzz.be`) | Regional journalism, **Brussels** | **250** | **63,981** | **14.98** |

Quote those four figures together with any number taken from this section: a rate per 100k is only
checkable against the token count it was divided by. If a re-run returns different document or token
counts, the corpus has changed and **every rate in 8c and 8d is stale** — re-derive them rather than
mixing old rates with new counts. The tokenizer was self-tested on `niet` (232 hits) and passed.

> ⚠ **The caveat that outranks every number below: both corpora are Belgian Dutch (Flemish).**
> This is **not** the standard variety this guide targets — the recorded default is
> Netherlands-standard Dutch (§9), and the §4 register decision is explicitly a Netherlands-primary
> one. **Every claim in 8c and 8d is therefore a claim about Flemish usage.** It is not stated in
> passing and it is not a footnote: a reader who carries these numbers over to Netherlands Dutch is
> carrying them further than the measurement goes. What would fix it is named in 8g.

> ⚠ **Three further caveats that travel with every number in 8c and 8d.**
>
> 1. **Different publishers, not a sister pair.** A same-house pair would control for house style.
>    Every large Netherlands and Flemish press publisher approached either **declines automated text
>    collection** or blocks it at the firewall, so two unrelated houses had to be used and house
>    style is confounded into every row.
> 2. **Both corpora are small** — 46,462 and 63,981 tokens. **One single token ≈ 2.2 per 100k in A
>    and ≈ 1.6 per 100k in B**, so every low-frequency row below is fragile by construction.
> 3. **Wablieft articles are very short** (mean **186 tokens** per article). That is **genre, not
>    only register**, and it inflates any contrast that depends on document shape.
>
> No lemmatization was done: word forms are counted, not lemmas.

**Thresholds, stated so a reader can tell a refutation from a blind spot.**

- **Tolerance band 1.25×.** A pair counts as *supported* only if the everyday member runs at least
  **1.25×** more frequent in A than in B (and the formal member the other way). A smaller gap is
  reported **flat** — measured, and no register signal.
- **Thin floor 3 per 100k.** Below that in both corpora, a „signal“ can be one or two sentences. Rows
  under the floor carry no verdict of their own.
- **untestable** means the formal word occurs **nowhere in either corpus**. That is a statement about
  **what these corpora contain**, not about the word: it is *not* a refutation, and a row marked
  untestable keeps its 8b standing in full.

**Row by row.** Formal member and everyday member, each as *A / B* per 100k. Nine of the fifteen
pairs are rows of the 8b table; the six marked *(extra)* are formal Dutch pairs the measurement's own
pair list carried beyond it, and they are reported here rather than promoted into 8b.

| Formal | Everyday | Formal A / B | Everyday A / B | Verdict |
|---|---|---|---|---|
| aangaande | over | 0 / 0 | 421.9 / 170.4 | **untestable** — formal word absent from both corpora |
| betreffende | over | 0 / 0 | 421.9 / 170.4 | **untestable** — formal word absent from both corpora |
| bijgevolg | dus | 0 / 0 | 64.6 / 114.1 | **untestable** — formal word absent from both corpora |
| teneinde *(extra)* | om | 0 / 0 | 400.3 / 548.6 | **untestable** — formal word absent from both corpora |
| verkrijgen *(extra)* | krijgen | 0 / 0 | 73.2 / 70.3 | **untestable** — formal word absent from both corpora |
| benodigde *(extra)* | nodige | 0 / 0 | 0 / 9.4 | **untestable** — formal word absent from both corpora |
| gaarne *(extra)* | graag | 0 / 0 | 116.2 / 34.4 | **untestable** — formal word absent from both corpora |
| abusievelijk | ongeluk | 0 / 0 | 0 / 0 | **untestable** — both members absent |
| alvorens | voordat | 0 / 4.7 | 0 / 1.6 | **thin** — too few tokens to judge |
| derhalve | daarom | 8.6 / 0 | 111.9 / 17.2 | **partial** — the everyday member is plainer, but the formal word is not behaving as a formality marker |
| aangezien | omdat | 0 / 1.6 | 34.4 / 76.6 | 🔴 **REVERSED** — the „everyday“ member is rarer in the plain corpus |
| aanvang | begin | 0 / 3.1 | 12.9 / 20.3 | 🔴 **REVERSED** — the „everyday“ member is rarer in the plain corpus |
| conform | volgens | 0 / 4.7 | 38.7 / 68.8 | 🔴 **REVERSED** — the „everyday“ member is rarer in the plain corpus |
| indien *(extra)* | als | 0 / 3.1 | 228.1 / 492.3 | 🔴 **REVERSED** — the „everyday“ member is rarer in the plain corpus |
| dienen *(extra)* | moeten | 0 / 3.1 | 64.6 / 126.6 | 🔴 **REVERSED** — the „everyday“ member is rarer in the plain corpus |

**Seven formal words score zero in both corpora, and that is the main lexical result.** `aangaande`,
`betreffende`, `bijgevolg`, `teneinde`, `verkrijgen`, `benodigde` and `gaarne` occur **nowhere** in
either corpus, while their everyday counterparts are well attested — and `abusievelijk / ongeluk` is
an eighth row where **both** members are absent. The list targets **bureaucratic correspondence**;
a newspaper does not write it. **These are reported as untestable in these corpora, explicitly not as
evidence against the list** — the corpus can neither support nor refute them, and the list's own
authority (8b) is the better source here. Three 8b rows (*afgezien van*, *als gevolg van*, *met
betrekking tot*) were not put to the corpus at all.

**The one row with any support is `derhalve → daarom`, and it is half a result.** *daarom* runs
**111.9 (A) / 17.2 (B)** — the everyday member behaves exactly as the list predicts, well clear of
the 1.25× band. But *derhalve* runs **8.6 (A) / 0 (B)**, i.e. the *formal* word is commoner in the
**plain** corpus, so it is not acting as a formality marker at all. At 8.6 per 100k in a 46,462-token
corpus that is roughly four tokens; treat the row as suggestive, not settled.

**Structure — the load-bearing part of the measurement.**

| Metric | A (plain) | B (standard) |
|---|---|---|
| **Mean sentence length (words)** | **10.10** | **14.98** |
| `worden` — passive auxiliary | **25.8** /100k | **256.3** /100k |
| `je` — informal address | **1,661.6** /100k | 348.5 /100k |

`worden` is the finding that changes a kit rule from asserted to measured: the passive auxiliary is
roughly **ten times rarer** in the plain corpus, so **the kit's active-voice base rule is supported
for Dutch**. That is worth saying explicitly rather than assuming, because the same rule went the
other way in Finnish, where the plain-language corpus used the passive at least as much as standard
prose. A base rule that survives measurement in one language has not thereby survived it in another.

**⚠ Keyness is dominated by house vocabulary, not by register — do not read these as language
findings.** The strongest keyness terms on the plain side are that publication's own brand and
navigation vocabulary (its masthead and prize/paper compounds, a stray demo token, a section label,
and two very short function words that ride on the short-article genre), and on the standard side its
own brand plus a football club, a feed label, and a local nickname. None of them is evidence about
plain Dutch. **Only `je` and `worden` are register signals**, and both are in the table above.

### 8d. 🔴 Do NOT „simplify“ these — five reversals with one explanation

Five pairs come back backwards: in each one the recommended **everyday** word is *rarer* in the plain
corpus than in the standard one.

| Pair | Formal A / B | Everyday A / B |
|---|---|---|
| `aangezien → omdat` | 0 / 1.6 | **34.4 / 76.6** |
| `indien → als` | 0 / 3.1 | **228.1 / 492.3** |
| `dienen → moeten` | 0 / 3.1 | **64.6 / 126.6** |
| `conform → volgens` | 0 / 4.7 | **38.7 / 68.8** |
| `aanvang → begin` | 0 / 3.1 | **12.9 / 20.3** |

🔑 **This is not five separate results. It is one, and it is structural.** `omdat`, `als` and `dus`
are **subordinate-clause introducers**, and *moeten* is a modal that pulls its main verb to the end
of the clause (§4). Easy-language Dutch is not avoiding these **words** — it is avoiding the
**construction that needs them**: it splits the sentence into **two main clauses** instead of
building a main clause plus a subclause. Fewer subclauses means fewer subclause introducers, which is
precisely what the counts show. The sentence-length figures corroborate it directly:
**10.10 against 14.98** words. `dus` runs the same way even though its own row is untestable — **64.6
(A) / 114.1 (B)** — which is what a construction-level effect looks like from a second angle.

🔑 **The instruction that follows, and it replaces the table row.** The 8b line „replace *aangezien*
with *omdat*“ points a translator in the wrong direction: it invites a lexical swap inside a sentence
shape that easy-language Dutch does not build in the first place. **The attested practice is: split
the sentence.** Take the causal, conditional, or obligation relation out of a subordinate clause and
state it as two main clauses. This is a **structural rule, not a lexical one**, and it is the single
highest-leverage thing in this section.

Concretely, using §4's own examples of the two sentence shapes: `nl-easy` prefers the **main-clause**
shape, where the finite verb sits second — **Ik lees vandaag het boek.** Where base `nl` would run
one sentence on into a subclause with the verb at the tail — **…omdat ik vandaag het boek lees.** —
`nl-easy` breaks the sentence there and starts a new main clause. Both are correct Dutch (§4); the
point is which one `nl-easy` builds by default.

**The eight untestable rows are deliberately NOT on this list.** `aangaande`, `betreffende`,
`bijgevolg`, `teneinde`, `verkrijgen`, `benodigde`, `gaarne` and `abusievelijk` score zero in both
corpora, which means the measurement never got a look at them. Putting a sourced pair on a
do-not-simplify list because a mismatched corpus could not see it would invert the evidence. **They
stay in the 8b table at full tier, and they stay in use.** The same holds for the thin row
(`alvorens → voordat`) and for the three rows never measured.

### 8e. 🔑 The address decision — `nl-easy` holds the §4 register

> **Decision, recorded so nobody „fixes“ it: `nl-easy` holds the register recorded in §4 — informal
> **je/jij** in the default Netherlands-primary build, **u** in a Flanders-primary or formal build —
> and holds it steadily across the whole variant.** Do not drift to the other register for
> „friendliness“; a mixed flow reads as an error (§4).

**The corpus evidence here is unusually strong for this kit, and it is worth saying why.** `je` runs
**1,661.6 per 100k in the plain corpus against 348.5** in the standard one — the largest register
contrast in the measurement. Elsewhere in this kit an address finding of that shape has come from a
**children's** corpus, where informal address is a property of the audience's age and transfers
poorly to adult educational copy. **This plain source is written for adults with reading
difficulties**, not for children, so the informal address it uses is a property of the *easy-language
register* rather than of a child readership. That makes the evidence stronger than the usual case —
it is pointing at exactly the audience `nl-easy` serves.

**Two limits, kept in view.** It is a **one-corpus** finding, and the corpus is **Flemish** (8c) —
which is the more formal of the two markets (§4, §9), so if anything it is the harder place to find
high informal-address rates. And it does not overrule the §4 decision: the register is chosen per
deployment, and 8e binds `nl-easy` to whichever register §4 records, not to `je` unconditionally.

- ✅ informal, the default build (§4): **Je kunt je voortgang opslaan.**
- ✅ formal build (Flanders / formal audience): **U kunt uw voortgang opslaan.**
- ❌ register mix in one flow: **Je kunt uw voortgang opslaan.** (je + uw — a defect)

### 8f. What `nl-easy` is built on — in order of leverage

**1. Sentence splitting first — this is where the measured difference actually is.** Target the plain
corpus's **mean sentence length of 10.10 words** (against 14.98 in standard prose), which sits just
outside the kit's ~8–12-word base target and inside the Dutch ~10–15-word B1 heuristic (8a); treat
both as working targets, not decrees. Then do the thing the five reversals in 8d actually attest:
**take the subordinate clause out.** State a cause, a condition, or an obligation as its own main
clause rather than hanging it off the previous one with *omdat / als / dienen te*. One idea per
sentence. This outranks every word swap in this section.

**2. Active voice second — now measured, not just asserted.** `worden` runs **25.8 per 100k in the
plain corpus against 256.3** in the standard one, roughly a **tenfold** difference (8c). CommunicatieRijk's
own B1 rule says the same thing in words — „korte, eenvoudige en actieve zinnen“ (8a) — so the
sourced rule and the measurement converge here. Name the actor and let the verb be active.

**3. The word table third, on its own authority.** The 8b complex→everyday table stands on the
kankan.nl „Helder Nederlands“ ambtelijke-taal list, **not** on the corpus, which could not reach
eight of its rows and never measured three more. Use it for the bureaucratic vocabulary it was built
for — public-body correspondence — and expect it to earn less than the sentence work. **Carry down
the 8d exception: do not treat the five reversed rows as lexical swaps; split the sentence instead.**

**4. The kit's base rules, inherited.** `nl-easy` **keeps** the kit's base simplified-language rules
from [accessibility-workflow → „Plain / simplified-language
rules“](../accessibility-workflow.md) — one idea per sentence, say what *is* not what *isn't*, the
same word for the same thing, a one-line „what is this“ opener, a consistent literal tone (avoid
irony and unexplained metaphor) — and adds the sourced Dutch B1 / „Duidelijk.“ overlay above.
Register overlay: **hold the §4 register steadily** (8e).

**5. Term preservation, binding.** In `nl-easy`, **keep the technical term and explain it** (8b) —
keep **neuraal netwerk**, then „dat betekent: …“, then a concrete example. Never swap in a folksy
stand-in.

### 8g. Still open

- **Nothing here speaks to Netherlands Dutch.** Both corpora are Flemish (8c), while the guide's
  recorded default is Netherlands-standard Dutch (§9) and the §4 register decision is
  Netherlands-primary. **The corpus that would fix this is a Netherlands plain/easy-language source
  paired with a Netherlands standard-prose source** — ideally two publications of the same house, so
  house style is controlled. Every large Netherlands and Flemish publisher approached either declines
  automated text collection or blocks it at the firewall, which is why that pair does not exist here.
  Until it does, treat 8c and 8d as **Flemish** findings and re-run before generalizing.
- **The measurement never tested the word list, and a corpus that could still does not exist here.**
  The pairing that would actually test it is **public-body correspondence against its own
  plain-language rewrites** — the same authority's letters and decisions before and after a
  *duidelijke taal* revision. Until such a pair is measured, the list rests on its own evidence.
- **The shared explanation in 8d fits the connective and modal rows best.** `omdat`, `als`, `dus` and
  `moeten` are subordination and modality; **`aanvang → begin` is a noun pair** and does not follow
  from sentence splitting, and it rides on small numbers (**12.9 / 20.3**, with the formal member at
  the thin floor). Read that row as measured-but-unexplained rather than as a fifth instance.
- **Publisher, genre, and document length are confounded.** Two unrelated houses, easy-language *news*
  against regional *journalism*, and a plain corpus whose articles average **186 tokens** — genre and
  register cannot be separated in any single row.
- **Both corpora are small** (46,462 / 63,981 tokens; one token ≈ 2.2 / 1.6 per 100k) and **no
  lemmatization** was done, so word-form counts are not lemma counts.
- **No comprehension evidence.** Nothing measured here says what a reader understands — only what the
  registers *do*. B1 supplies principles and a de-facto target level, not a validated readability
  threshold (8a), and the A2 figure in 8a remains a ⚠ paraphrase.
- **The 8b table still wants a native-speaker pass**, as does this whole guide (see the Status line in
  the header). A word list cannot tell a translator which substitution fits a given sentence.

Sources: <https://www.communicatierijk.nl/vakkennis/rijkswebsites/aanbevolen-richtlijnen/taalniveau-b1>
(B1: 2 quotes + „actieve zinnen“ / „eenvoudige woorden…“) ·
<https://taalunie.org/actueel/328/campagne-duidelijk-voor-begrijpelijke-overheidscommunicatie-van-start>
(„Duidelijk.“ campaign — 3 quotes) · <https://kankan.nl/helder-nederlands/> (word-pair list) ·
<https://www.directduidelijk.nl/> and
<https://www.rijksoverheid.nl/actueel/nieuws/2025/09/16/prinsjesdag-2025-in-eenvoudige-taal>
(the *duidelijke taal* / *eenvoudige taal* register distinction, both quoted in §7) ·
corpus measurement 8c/8d/8e: <https://wablieft.be> (plain corpus — 250 documents, 46,462 word
tokens, mean sentence 10.10) · <https://www.bruzz.be> (standard corpus — 250 documents, 63,981 word
tokens, mean sentence 14.98), both fetched and counted **2026-07-27** with
`scripts/corpus-measure.mjs` in this repo — machine-measured, reproducible against those counts, and
confounded as stated in 8c; **both corpora are Belgian Dutch (Flemish)**, so every corpus number in
this section is a claim about Flemish usage · sentence-length heuristic + A2 figure are ⚠ editorial /
paraphrase

---

## 9. Regional variation

**Which standard the project targets.** There is **no separate „neutral“ third variety** of Dutch.
**Neutral = Netherlands-Dutch standard vocabulary that is also understood and accepted in Flanders**,
avoiding both Netherlands-only slang and Flemish/Belgian-only words, and avoiding *tussentaal* (the
informal Flemish in-between register). For a platform serving both markets, write
**Standaardnederlands**, prefer the pan-Dutch word when NL and BE differ, and — if forced to choose
— the Netherlands standard has the widest reach. (Editorial synthesis grounded in the sourced
definition below.)

**Belgian standard Dutch — definition (sourced).** Wikipedia (Belgisch-Nederlands): „Belgisch-
Nederlands of Zuid-Nederlands is de aanduiding voor woorden, uitdrukkingen en grammaticale
constructies die alleen in de Belgische variant van het Standaardnederlands algemeen voorkomen.“
The Taalunie recognizes Belgian standard Dutch as „het Nederlands dat algemeen bruikbaar is in het
publieke domein in België“ (same page). ⚠ Wikipedia-tier provenance for the regional contrasts in
this section.

**Grammatical difference example (compound linking-s).** Same page: „In Nederland spreekt men van
een vervoerbewijs en belastingaangifte, terwijl men in Vlaanderen spreekt van een vervoersbewijs en
belastingsaangifte.“ (Flanders inserts a linking *-s-* where the Netherlands does not.)

**Vocabulary contrast (choose the pan-Dutch / NL-standard form when in doubt):**

| Concept | Netherlands (prefer) | Flanders / Belgium (marked) |
|---|---|---|
| roundabout | rotonde | rondpunt |
| extractor hood | afzuigkap | dampkap |
| to warn / notify | waarschuwen | verwittigen |
| dry cleaner's | stomerij | droogkuis |
| dress | jurk | kleedje |
| butcher | slager | beenhouwer |
| to clean | schoonmaken | kuisen |
| fridge | koelkast | frigo (French loan) |
| bicycle | fiets | velo (French loan) |
| jam | jam | confituur |

(Belgian-marked colloquial extras from search corroboration: *goesting* „zin/appetite“, *kot*
„student room“, *kriek*. ⚠ community/forum provenance — use with care.)

- ✅ pan-Dutch, understood everywhere: **rotonde**
- ❌ BE-marked in an NL-primary build: **rondpunt**

**Register caveat — the formality gap.** Flanders is notably more formal: **u** is used far more
readily than in the Netherlands (see §4 and the tutoyeren tradition quote). A Netherlands-tuned
**je/jij** product can read as too familiar to a Flemish audience. **Decide the primary market
before fixing register** (§4): NL-primary → je/jij; Flanders-primary or formal → u.

**Neutrality strategy (explicit).**

1. **Orthography:** follow Taalunie / *Groene Boekje* standard spelling (shared across NL and BE).
2. **Register:** per the §4 decision — je/jij for NL-primary, u for Flanders-primary/formal; hold it
   consistently.
3. **Vocabulary:** prefer the unmarked pan-Dutch word; where NL and BE differ and a marked word is
   unavoidable, choose a context where either works, or gloss once. Default to the NL-standard form
   for widest reach.
4. **Technical terms:** use the §6 sector terms; keep shared acronyms (AI, ML) as-is. Note NL tends
   to *KI*/*AI*, Flanders often *AI* — spell out *kunstmatige intelligentie (AI)* on first use.

Sources: <https://nl.wikipedia.org/wiki/Belgisch-Nederlands> (definition, Taalunie definition,
linking-s example, vocabulary list — all fetched) ·
<https://nl.wikipedia.org/wiki/Tutoyeren_of_vousvoyeren> (Flanders formality) · colloquial extras
rest on community/search sources — ⚠ provenance

---

