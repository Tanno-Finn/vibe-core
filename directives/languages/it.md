<!-- base -->
# lang-it — Italian (italiano) — language guide

> **Setup & sources live in [`it.setup.md`](it.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** italiano / Italian. The written standard this guide targets is
**italiano standard** — the national written norm of Treccani, national media, and the public
administration guidelines, not any regional variety.
**BCP 47 code (base):** `it`.
**BCP 47 code (simplified variant):** `it-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`it-x-simple`), but the kit
token `it-easy` is the one that counts here.
**Speaker reach:** between about **61.8 million and 67 million first-language speakers**,
"depending on methodology" — mostly in Italy, plus communities in Switzerland, San Marino, and the
Vatican, and a large diaspora. Italian has official status in **Italy, San Marino, Switzerland, and
Vatican City**. This replaces an earlier "the dossier did not supply a sourced speaker count"
note, which was **false**: the second research pass on the same brief opened with exactly this
cited profile paragraph, and it had never been merged. ⚠ Community-tier: the citation is a
general-reference language-statistics site, not a census — keep the range and the hedge, do not
quote a single round number.
**Swiss cantons — the removed claim, verified and restored in accurate form.** An earlier revision
carried an unsourced *"official of Ticino/Grigioni"* line and correctly deleted it pending
verification. It has now been checked against the two cantonal constitutions themselves, and the
two cantons turn out **not** to say the same thing:
**Grigioni names Italian an official language outright** — *Costituzione del Cantone dei Grigioni*
(110.100, del 14 settembre 2003, stato 1 luglio 2024), **Art. 3 "Lingue"**: "Il tedesco, il
romancio e l'italiano sono le lingue cantonali e ufficiali equivalenti dei Grigioni."
**Ticino never uses the phrase *lingua ufficiale*** in its constitution; it declares the canton
itself Italian-speaking — *Costituzione della Repubblica e Cantone Ticino del 14 dicembre 1997*,
**Art. 1**: "Il Cantone Ticino è una repubblica democratica di cultura e lingua italiane."
So the defensible wording is: Italian is **an official cantonal language of Grigioni by name**, and
Ticino is constitutionally an **Italian-language canton**. Do not flatten the two into one phrase —
the sources do not support it. (Cantonal-law tier, primary sources, fetched.)
**Script + direction:** Latin alphabet, **left-to-right**. The core alphabet is 21 letters
(*j, k, w, x, y* appear mainly in loanwords); accented vowels (à è é ì ò ù) are part of normal
orthography, not optional decoration.
**Status:** planned — authored from an **agent-native external research dossier** (self-fetched,
quote-per-claim; then independently reviewed against its cited sources).
Covers base `it` and the `it-easy` pendant. A **second research pass** was commissioned on the same
brief and **returned a refusal** — it states it could not do the A–H research for lack of
source-gathering tools — delivering nothing but the speaker-profile paragraph now in the header
above. Six sibling guides closed a known §7 gap by merging their second pass; `it` had nothing to
merge and carried §7 as a **declared open gap** rather than fake a table. That gap is now closed
the only way it could honestly be closed — by a **dedicated Italian-only research pass** that
gathered the on-domain stock phrases first-hand; §7 is a finished, per-row-sourced section, with
the two phrases that could **not** be sourced named and left out rather than invented.
**Not yet reviewed by a native speaker** — per the
authoring directive's "second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this
header records that gap honestly; several sections rest on editorial/standard-usage judgment and
are marked ⚠ at point of use.
**Easy or hard for this kit:** Italian is **easy** on the mechanics — Latin script, whitespace
word separation, standard tokenization, no shaping or bidi, and all accented vowels live in
Latin-1 Supplement so UTF-8 encoding is a non-issue. The traps are *editorial*, not technical:
the meaningful **é/è distinction** (*perché* vs *è*), the grammatically load-bearing
**apostrophe of elision** (*un'idea* fem. vs *un amico* masc.), **reversed number separators**
(1.234,56 — the mirror image of English), obligatory **gender/agreement**, and a small set of
high-frequency **false friends** (*eventualmente*, *attualmente*). The register decision (**tu**,
consistent) is settled and recorded in §4.

Sources: <https://www.treccani.it/enciclopedia/virgolette_(La-grammatica-italiana)/> ·
<https://designers.italia.it/design-system/fondamenti/tono-di-voce/> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://www.worlddata.info/languages/italian.php> (the 61.8–67 M range and the official-status
list — the one thing the second research pass supplied; ⚠ community-tier, not re-fetched here) ·
Swiss cantonal status, primary and fetched: <https://www.lexfind.ch/tolv/244968/it>
(*Costituzione del Cantone dei Grigioni* 110.100, Art. 3) ·
<https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/1>
(*Costituzione della Repubblica e Cantone Ticino*, Art. 1)

---

## 1. Header block

See above. One-line orientation: Italian is a Romance, SVO, pro-drop, LTR language with a highly
uniform national written standard; the localization risks concentrate in **accents and elision
(é/è, un'/un), reversed number/date formatting, gender/agreement, register consistency, and
false-friend calques** — not in script, fonts, or direction.

---

## 4. Grammar for translators

**Word order.** Baseline is **SVO** (*Il modello genera testo* — "The model generates text"), but
Italian word order is markedly more flexible than English because it is **pro-drop**: the subject
pronoun is dropped and verb morphology carries person/number. The subject is **omitted** unless
needed for contrast or clarity.

- ✅ *Puoi salvare il tuo lavoro* — "You can save your work."
- ❌ *Tu puoi salvare il tuo lavoro* — the explicit *Tu* is wrong-register / redundant for plain
  neutral copy.

**Adjective position.** Adjectives generally **follow** the noun (*rete neurale, intelligenza
artificiale*), though a small set precedes (*grande, buono, bello*) and some shift meaning by
position: *un grand'uomo* ("a great man") vs *un uomo grande* ("a big man").

**Register — tu / Lei / voi, and the project's recorded choice.**

- **tu** — informal singular, friendly/direct.
- **Lei** (capitalized, 3rd-person feminine grammar) — formal/polite singular, standard in
  institutional, commercial, and customer contexts.
- **voi** — plural "you"; also an archaic/southern deferential singular — **avoid** it as a
  politeness form in modern standard Italian (reads dated or regional).

The Italian public-sector and digital-content standard is **tu**. Designers Italia (*tono di
voce*): "Parla all'interlocutore in modo diretto usando il 'tu', evitando tanto il 'lei' e i
formalismi." The writing style guide reinforces direct, active address: "Utilizza forme verbali
attive."

> **Register decision (human-gate): tu (informal, consistent) — taken and recorded.** On the
> quality argument the evidence is unambiguous: **tu** is the
> Italian public-administration and digital-content convention (Designers Italia / AGID
> *tono di voce*: "usa il 'tu', evitando … il 'lei' e i formalismi"), warm and modern and correct
> for a learner-facing educational platform. **Binding for all second-person copy** in `it` and
> `it-easy` — no drift to **Lei** or **voi**, including in formal or playful passages. **Lei** is
> reserved only for a deliberately formal/corporate context, and is noted here solely for
> completeness; **never mix tu and Lei addressing the same reader.**
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**Imperatives follow the register (a visible consistency surface).** With **tu**, imperatives are
2nd-person: *Salva, Iscriviti, Scarica, Registrati*. With **Lei** they are subjunctive-based:
*Salvi, Si iscriva, Scarichi, Si registri*. Under the recorded **tu** register:

- ✅ *Salva il file · Iscriviti · Scarica l'app · Registrati sul sito*
- ❌ *Salvi il file · Si iscriva · Si registri* (Lei imperatives) — and, worse, **mixing**
  *Salva* then *Si registri* in the same flow is a visible inconsistency bug.

The grammar features that break a naive EN → IT translation:

**(1) Gender & article agreement is obligatory and drives elision.** Every noun is masculine or
feminine; articles, adjectives, and past participles must agree, and the choice cascades into the
apostrophe (§3). Anglicisms take a gender by convention: *l'intelligenza* (fem.), *il software*
(masc.), *la mail* / *l'email* (fem.), *il/lo prompt* (masc.).

- ✅ *un'idea* (fem.) · *un amico* (masc.) · *l'intelligenza artificiale* · *il software*
- ❌ Choosing the wrong gender — it cascades into wrong articles and adjectives.

**(2) English continuous "-ing" ≠ Italian gerund by default.** "You are learning" is normally the
simple present *Impari*; *stai imparando* only for genuinely ongoing action. "Learning is
important" uses the infinitive-as-noun.

- ✅ *Imparare è importante* — "Learning is important."
- ❌ *Imparando è importante* — gerund calque. Overusing *stare + gerundio* is a hallmark of
  machine-English.

**(3) Capitalization — lowercase far more than English.** Languages, nationalities-as-adjectives,
days, months, and "you" are lowercase; headings use **sentence case**, not Title Case.

- ✅ *italiano, lunedì, gennaio, tu* · heading *Corso di apprendimento automatico*
- ❌ *Italiano, Lunedì, Gennaio, Tu* · Title-Case heading *Corso Di Apprendimento Automatico* ·
  the raw calque *Machine Learning Course* → correct is *Corso di apprendimento automatico* (only
  the first word + proper nouns capitalized).

**(4) False friends (highest-risk silent errors).** ⚠ Editorial — classic false friends, no
single-URL authority, but well established:

- *eventualmente* means "possibly / if need be," **not** "in the end."
  - ✅ "Eventually it works" → *Alla fine funziona.*
  - ❌ *Eventualmente funziona.*
- *attualmente* means "currently," **not** "actually."
  - ✅ "It's actually free" → *In realtà è gratis.*
  - ❌ *Attualmente è gratis.*

Sources: <https://designers.italia.it/design-system/fondamenti/tono-di-voce/> ·
<https://docs.italia.it/italia/designers-italia/writing-toolkit/it/bozza/suggerimenti-di-scrittura/stile-di-scrittura.html> ·
gender/‑ing/capitalization traps: editorial-but-standard, derived from the dossier's contrastive
examples; false friends (4) ⚠ editorial (no single-URL authority).

---

## 5. Numbers, dates, currency

Current locale data: **CLDR 48** (released 2025-10-29; dot-release 48.2, 2026-03-17). The single
biggest translator trap in this section is that **Italian separators are the mirror image of
English** — never carry over an English-formatted number unchanged.

**Decimal separator: comma.** CLDR `it` reports **decimal symbol `,`**.
**Grouping (thousands) separator: period/dot.** CLDR `it` reports **group symbol `.`**.

- ✅ one thousand = **1.000** · π ≈ **3,14** · twelve-thousand-and-a-half = **12.500,5**
- ❌ English *1,000* / *3.14* / *12,500.5* carried over unchanged — the reversed separators
  corrupt the value.

**Currency.** CLDR `it` standard currency pattern is **`#,##0.00 ¤`**; the `¤` placeholder
resolves to **€**, placed **after** the amount with a (non-breaking) space.

- ✅ **1.234,56 €** (euro after the number, nbsp before it)
- ❌ *€1.234,56* (symbol before) · *1,234.56 €* (English separators)

**Percent.** CLDR pattern `#,##0%` → **50%**; with a fractional value, comma decimals: **2,5%**.

**Dates — little-endian dd/MM/yyyy.** Long form spells the month **lowercase**: *3 dicembre 2025*
(month name never capitalized; weekdays/months always lowercase).

- ✅ **03/12/2025** · **3 dicembre 2025**
- ❌ *12/03/2025* (MM/dd ambiguity) · *3 Dicembre 2025* (capitalized month)

**Time — 24-hour, HH:mm** with a colon: **21:00** (not *9:00 PM*).

**Translator cautions:** never carry over English "1,234.56" — it is **1.234,56** in Italian and
the reversed separators will corrupt meaning; put **€ after** the number with a non-breaking
space; use **dd/MM/yyyy** or the spelled-out lowercase month and avoid MM/dd ambiguity.

Sources: <https://cldr.unicode.org/downloads/cldr-48> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html> ·
<https://www.freeformatter.com/italy-standards-code-snippets.html> (CLDR-derived cross-check).

---

## 6. Terminology strategy

**Loanword vs coinage — the Italian pattern.** Italian *translates* the core conceptual
vocabulary (*intelligenza artificiale*, not "AI" the English way) but *retains* many operational
anglicisms (*prompt, chatbot, LLM, token, deep learning*). Treccani's *neologismi* register both.
The Treccani magazine analysis of AI Italian uses the Italian acronym **"IA" (Intelligenza
Artificiale)** while leaving **"chatbot," "prompt," "Large Language Model"** in English —
capturing the split exactly. **Acronym note: Italian prose prefers IA; the English AI is also
widespread** — pick one per project and hold it.

**Working policy.** Prefer the **Italian coinage** for conceptual/pedagogical vocabulary
(*intelligenza artificiale, apprendimento automatico, rete neurale, apprendimento profondo,
pregiudizio algoritmico*) — this matches Treccani and reads as proper educational Italian. Keep
operational **anglicisms** where they are the community norm (*prompt, chatbot, LLM, token*),
optionally glossing the Italian form on first use. **Anglicisms are invariable in the plural** —
*i chatbot, i prompt*, never *chatbots*.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give target term + original + a short plain gloss,
then use the target term alone afterwards. Instantiated with a sourced term:

> **intelligenza artificiale (IA)** (artificial intelligence) — *"disciplina che studia se e in
> che modo si possano riprodurre i processi mentali più complessi mediante l'uso di un
> computer"* (Treccani) — then **intelligenza artificiale** alone on every later mention.

Project coinages (C1) keep their original spelling in Italian text and are owned by the
term-sheet, not this table.

**Seed field vocabulary (AI/ML).** Terms 1–7 carry **verbatim Treccani definitions** (fetched);
the rest are standard/editorial usage with **native-speaker confirmation pending** — provenance
marked per row. Freeze the chosen forms in the project glossary; do not mix competing renderings.

| Concept (EN) | Italian term | Provenance |
|---|---|---|
| artificial intelligence (AI) | intelligenza artificiale (IA) | Treccani, verbatim ✓ |
| machine learning | apprendimento automatico | Treccani, verbatim ✓ (*machine learning* also current) |
| neural network | rete neurale (artificiale) | Treccani, verbatim ✓ |
| deep learning | apprendimento profondo | Treccani, verbatim ✓ (*deep learning* also kept) |
| generative AI | intelligenza artificiale generativa (IA generativa) | Treccani, verbatim ✓ |
| algorithmic bias | pregiudizio algoritmico | Treccani, verbatim ✓ |
| hallucination | allucinazione (dell'intelligenza artificiale) | Treccani, verbatim ✓ |
| algorithm | algoritmo (m., *gli algoritmi*) | ⚠ standard usage, verbatim Treccani not fetched |
| large language model (LLM) | modello linguistico di grandi dimensioni | ⚠ editorial — calque exists but **LLM** used untranslated in practice; no single Treccani headword |
| prompt | prompt (m., *il prompt*) | ⚠ retained English; listed among AI neologisms, verbatim page not fetched |
| training (a model) | addestramento (*addestrare un modello*) | ⚠ editorial/standard, no dedicated headword fetched |
| data / training data | dati (m. pl.) / dati di addestramento | ⚠ editorial/standard |
| supervised / unsupervised learning | apprendimento supervisionato / non supervisionato | ⚠ established calques, verbatim page not fetched |
| chatbot | chatbot (m., *il chatbot*) | ⚠ retained English; noted untranslated in the Treccani IA article, no verbatim definition |
| natural language processing (NLP) | elaborazione del linguaggio naturale | ⚠ editorial/standard; NLP also used |

**Recommended default set** for the platform: *intelligenza artificiale (IA), apprendimento
automatico, rete neurale, apprendimento profondo, pregiudizio algoritmico, allucinazione*, with
English abbreviations in parentheses on first use, and the operational anglicisms
(*prompt, chatbot, LLM, token*) kept where they are the community norm.

Sources: <https://www.treccani.it/enciclopedia/intelligenza-artificiale/> ·
<https://www.treccani.it/vocabolario/machine-learning_(Neologismi)/> ·
<https://www.treccani.it/enciclopedia/rete-neurale_(Enciclopedia-della-Matematica)/> ·
<https://www.treccani.it/vocabolario/deep-learning_(Neologismi)/> ·
<https://www.treccani.it/vocabolario/neo-intelligenza-artificiale-generativa_(Neologismi)/> ·
<https://www.treccani.it/vocabolario/neo-pregiudizio-algoritmico_(Neologismi)/> ·
<https://www.treccani.it/vocabolario/neo-allucinazione-della-o-di-intelligenza-artificiale_(Neologismi)/> ·
<https://www.treccani.it/magazine/lingua_italiana/speciali/l-ia-taliano-ovvero-la-lingua-italiana-sotto-la-luce-artificiale-dell-intelligenza/>
(loanword split / IA-vs-AI). Rows marked ⚠ are standard/editorial usage, native-speaker
confirmation pending.

---

## 7. Idiom anti-patterns

**What changed here, and why the old table is gone.** The previous revision of this section shipped
a **declared open gap** printed over a general-purpose ESL idiom list — *è un gioco da ragazzi*,
*in bocca al lupo*, *ogni morte di papa* — carried from the main dossier with every row self-marked
editorial craft. Declaring the gap was the right call at the time: the authoring directive asks §7
for the **stock phrases of educational and technical writing**, because those are the phrases this
platform's copy actually contains, and no research pass had ever gathered them for Italian. The gap
is now closed the only way it could honestly be closed — by **doing that research**, Italian-first,
one fetched source per row. The twelve general idioms are dropped as off-brief. Two phrases that
were researched and **could not** be sourced are named at the foot of the section and left out.

**How to read the table.** The ✅ column is the rendering an Italian educational or technical text
actually uses. The ❌ column is the **word-for-word rendering of the English** — what an unwarned
translator produces. That column is *constructed from the English*, not a claim about Italian
usage; where the near-literal happens to be correct Italian, the row says so instead of
manufacturing a fault. The **Provenance** column carries the tier and the evidence, and the tiers
are not interchangeable:

- **D** — found in a **bilingual-dictionary entry or a named §2 authority**, fetched, quoted.
- **T** — **no dictionary entry exists**; the rendering is attested in **running Italian technical
  or educational text**, fetched, quoted. Safe to teach; spot-check before it becomes a lint rule.
- **C** — **craft.** This guide's own judgment, attested nowhere. A **C** cell is never sourced,
  never a lint rule, and must not be quoted as if it were a dictionary finding.

| English stock phrase | ✅ Idiomatic Italian | ❌ Word-for-word calque to avoid | Provenance |
|---|---|---|---|
| step by step | *passo dopo passo* (avv.) · *passo passo* (agg.) · *per gradi* · *procedere per punti* | *passo di passo*; and leaving **step by step** untranslated in body copy | **D** WordReference en-it: "passo dopo passo, a poco a poco" (loc avv), "passo passo" (loc agg), "per gradi", "procedere per punti". ⚠ The image transfers here — the near-literal *is* the right answer |
| at a glance | *a colpo d'occhio* · *a prima vista* | *a uno sguardo* / *in uno sguardo* | **D** Treccani, *vocabolario*, s.v. *colpo*: "C. d'occhio … occhiata, il vedere (e il saper vedere) a un tratto: si distingue a c. d'occhio, subito, alla prima". WordReference adds "a prima vista" |
| rule of thumb | *regola generale* · *regola pratica* | *regola del pollice* | **D** WordReference: "regola generale". Glosbe en→it lists "regola generale", "regola pratica" **and** the calque "regola del pollice" — the calque circulates, the first two lead |
| trial and error | *(procedere) per tentativi ed errori* · *per prove ed errori* | *tentativo ed errore* (the singular word-for-word) | **D** it.wikipedia, *Tentativi ed errori*: "L'apprendimento per tentativi ed errori o per prove ed errori (in inglese *trial and error*…)". WordReference: "per tentativi ed errori", "apprendimento per tentativi" |
| keep in mind | *tieni presente* · *tieni a mente* | *tieni in mente* | **D** WordReference: "tenere a mente, tenere presente"; related "tenere conto", "tenere in conto" |
| out of the box (software) | *pronto all'uso* · *preconfigurato* · *preconfezionato* | *fuori dalla scatola* — and *fuori dagli schemi*, which is the **other** sense and the likelier error | **D** WordReference splits the senses explicitly: "pronto all'uso" (informatica) vs "fuori dagli schemi" (figurato, informale) |
| from scratch | *da zero* · *partire da zero* · *ex novo* | *dal graffio* | **D** WordReference: "dall'inizio, dal nulla, da zero, partendo da zero, iniziando da zero"; compound "partire da zero" |
| bear with me | *abbi pazienza* · *porta pazienza* | *sopporta con me* | **D** WordReference, compound *Bear with me*: "abbi pazienza, porta pazienza" — es. "Porta pazienza, ci vorranno solo cinque minuti." |
| the takeaway (the point) | *il punto* · *la morale* · *la cosa da ricordare* | *l'asporto* / *il da portar via* — the restaurant sense, which the dictionary lists **first** | **D** WordReference, "Traduzioni aggiuntive": "morale", "punto, succo", "cosa da ricordare"; the food sense "ristorante con servizio da asporto" heads the entry and is the trap |
| hands-on | *sul campo* · *concreto* · *partecipativo*; for teaching copy *pratico* (*esercitazione pratica*) | *mani sopra* / *con le mani su* | **D/C** WordReference: "partecipativo, effettivo", "sul campo", "concreto" — es. "Andy ha adottato un approccio concreto nella gestione giornaliera della compagnia." **C**: *pratico / esercitazione pratica* is this guide's rendering for the educational sense, not in the entry |
| in a nutshell | *in poche parole* · *in breve* · *in sintesi* | *in un guscio di noce* | **D** WordReference: "in poche parole, in due parole, in breve"; related "in sintesi", "per sommi capi", "in estrema sintesi" |
| on the fly | *al volo* | *sulla mosca* | **D** WordReference: "al volo" (loc avv), "di corsa, in movimento" |
| the big picture | *il quadro generale* · *il quadro d'insieme* | *la grande immagine* / *il grande quadro* | **D** WordReference: "quadro generale". **C**: *quadro d'insieme* is this guide's variant |
| best practice | *buona norma* · *buone pratiche* | *migliori pratiche* (superlative calque) | **D** WordReference: "buona norma". *buone pratiche* is attested in a §2 authority itself — Designers Italia / AGID content-design guidelines: "delle buone pratiche su linguaggio e composizione dei contenuti" |
| make sure | *assicurati di …* · *verifica che …* · *accertati che …* | *fai sicuro che* | **D** WordReference: "assicurarsi", "verificare, avere conferma", "accertarsi di [qlcs]" — es. "Assicurati di chiudere tutte le porte e le finestre prima di andartene." |
| break down (a concept) | *scomporre* · *suddividere* | *rompere giù* / *abbattere* | **D** WordReference, figurative sense: "scomporre" — es. "Possiamo scomporre il processo in diverse fasi separate." **C**: *suddividere* is this guide's variant |
| learning curve | *curva di apprendimento* | — the image transfers intact; the trap is *ripida*, which Italian readers take as physical steepness rather than difficulty | **D** it.wikipedia: "Il termine **curva di apprendimento** (*learning curve*) indica il rapporto tra la quantità di informazioni correttamente apprese e il tempo necessario per l'apprendimento." |
| edge case | *caso limite* · *casi limite* | *caso di bordo* / *caso marginale* | **T** No dictionary entry — Glosbe: "Al momento non abbiamo traduzioni per **edge case** nel dizionario". Attested in Italian university software-engineering material (Univ. di Parma, *Ingegneria del Software*, equivalence partitioning): "Si includono casi limite e valori non validi." |
| under the hood | *dietro le quinte* · *come funziona internamente* | *sotto il cofano* — a calque that **has** genuinely spread in Italian tech blogging, but still reads as translationese in educational prose | **T** No dictionary entry — Glosbe: "Al momento non abbiamo traduzioni per **under the hood** nel dizionario". *dietro le quinte* attested in Italian explanatory writing on algorithms: "Svolgono, pertanto, un ruolo fondamentale dietro le quinte nel determinare quali risultati vediamo quando effettuiamo una ricerca online." The calque is attested too: "…è ancora utile avere un'idea di come un modello di apprendimento automatico funziona sotto il cofano." |

**What is still open — narrowed, not papered over.** Two phrases the brief asked for were researched
and **could not be sourced**, so no row was written for them. This is the remaining gap, and it is
small and specific:

- **sanity check** — **no Italian rendering could be evidenced.** Glosbe has no entry ("Al momento
  non abbiamo traduzioni per **sanity check** nel dizionario"); Linguee resolves the phrase only by
  decomposition (*sanity* → "buonsenso"; *check* → "verifica", "controllo") and its parallel-text
  examples render neighboring concepts as "controllo di conformità" and "controlli di integrità
  dei dati", neither of which is the term; Reverso Context returned HTTP 403. Until a source turns
  up: **keep the English term and gloss it, or rephrase around it** — and treat any rendering you
  reach for as **C**, not as settled Italian.
- **good enough** — attested (WordReference: "abbastanza buono"; compound "non abbastanza buono,
  non abbastanza bravo"), but **no calque trap could be evidenced**: here the word-for-word
  rendering *is* the dictionary rendering. A row whose ❌ cell would have to be invented is not a
  row, so it stays out of the table rather than pad it.

**Register check — the table is already in tu (§4).** The imperatives arrive in the recorded **tu**
form — *tieni presente*, *abbi pazienza*, *porta pazienza*, *assicurati*, *verifica*, *accertati* —
and two of the dictionary examples are themselves tu-form ("Porta pazienza, ci vorranno solo cinque
minuti.", "Assicurati di chiudere tutte le porte e le finestre prima di andartene."). A row
restated with **Lei** (*tenga presente, abbia pazienza, si assicuri*) is a **register defect**
(§4), not a stylistic variant.

**The dropped rows, and why that is not lost work.** The twelve general idioms the previous
revision carried (*è un gioco da ragazzi, in bocca al lupo, ogni morte di papa, costare un occhio
della testa, prendere due piccioni con una fava, stringere i denti, quando gli asini voleranno,
per farla breve* …) are correct Italian but off-brief, and **no research pass ever sourced a single
one of them**; they are dropped rather than re-homed. One directional observation from that table
survives the deletion and is worth a reviewer's memory: Italian usually **swaps the image rather
than the words** (*due piccioni con una fava* — pigeons and a broad bean, not birds and a stone).
But not always — *step by step* and *learning curve* above are rows where the near-literal is the
correct answer, so **over-correction is a real failure mode too**.

**Transfer principle:** translate the *function and register*, not the words. The highest-risk
items for silent machine-translation errors are the ones where the English phrase looks
transparent — *rule of thumb*, *out of the box*, *the takeaway*, *under the hood* — because a
word-for-word rendering of those produces fluent-looking Italian that is simply wrong. The general
law from [translation-quality](../translation-quality.md) applies: if a mental back-translation
lands exactly on the English wording, it is too literal — rework it.

**Promotion rules.** **D** rows may be promoted into a §11 leak-scan rule (several already are).
**T** rows are safe to teach and to review against, but spot-check them before they become a
deterministic lint rule — they rest on attested usage, not on a dictionary ruling. **C** cells and
the two unsourced phrases above **never** become checklist or lint items.

Sources (idiom tier — bilingual dictionary and attested running text, one tier below §2's
authorities; native-speaker confirmation pending):
<https://www.wordreference.com/enit/> (the **D** rows: step by step, at a glance, rule of thumb,
trial and error, keep in mind, out of the box, from scratch, bear with me, the takeaway, hands-on,
in a nutshell, on the fly, the big picture, best practice, make sure, break down — and the
*good enough* entry behind the decision **not** to table it) ·
<https://www.treccani.it/vocabolario/colpo/> (*a colpo d'occhio*) ·
<https://it.glosbe.com/en/it/rule%20of%20thumb> (*regola generale · regola pratica · regola del
pollice*) · <https://it.wikipedia.org/wiki/Tentativi_ed_errori> ·
<https://it.wikipedia.org/wiki/Curva_di_apprendimento> ·
<https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/content-design/linguaggio.html>
(*buone pratiche*, §2 authority) · **T** rows: <https://www.ce.unipr.it/~aferrari/SE/SE/SE05-testing.html>
(*casi limite*) · <https://www.seozoom.it/algoritmi/> (*dietro le quinte*) ·
<https://deeplearningitalia.com/implementazione-e-spiegazione-della-foresta-casuale-in-python/>
(the *sotto il cofano* calque, attested and marked) · negative findings recorded above:
<https://it.glosbe.com/en/it/under%20the%20hood> · <https://it.glosbe.com/en/it/edge%20case> ·
<https://it.glosbe.com/en/it/sanity%20check> · <https://www.linguee.it/inglese-italiano/traduzione/sanity+check.html>.
The general-idiom table this section used to carry was unsourced in every research pass and has
been deleted.

---

## 8. Simplified-language pendant (`it-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: Italian now has a measured pendant, and it was blocked on a file format,
not on an absence.** An earlier pass recorded §8c as "no count was run" because the one
**same-publisher** pair it had found publishes its easy-language side as **PDFs** while the
standard side is HTML news. That was a pipeline limit, and it has been removed. Two pairs were
then built, and the stronger of the two is better than the pair the earlier pass was looking for:
**one publication that contains both registers of the same content** — a 2023 disability-rights
handbook issued with its own easy-to-read edition bound into the same volume. Publisher, house
style, topic, year, and content are all held constant and **register is the only variable**. §8b's
word table is therefore no longer all craft, and §8d now carries reversals that were **measured
twice, independently**.

### 8a. The standard — a real center of gravity, but no legally-binding Italian norm

**Tradition & authorities.** Italy's plain-language center of gravity for public/digital content
is the **Designers Italia / AGID "Guida al linguaggio della Pubblica Amministrazione"** (the
writing toolkit) and the PA design guidelines: make institutional content clear, short, and
reader-centered. Checklist prompts include "Tutte le frasi sono chiare, in un linguaggio semplice
e lineare?" and "Il testo è breve, diviso in paragrafi, in elenchi puntati?". Historic antecedents
(⚠ editorial, widely known but not fetched): the **Codice di stile** (Cassese, 1993) and
**Manuale di stile** (Fioritto, 1997) for administrative Italian.

**The second authority is now a fetched one.** The easy-language side of §8c's primary corpus
carries the **European Easy-to-Read logo** and names its rule source in its own text: *"Inclusion
Europe ha ideato una guida per scrivere testi in Easy to Read"*, and it defines the variety in
Italian as *"il linguaggio facile da leggere e da capire … una modalità di comunicazione di
informazioni"*. So the Italian easy-read tradition is **European guidance adopted in Italian by a
named national association**, published under the European mark — not an Italian-issued norm, and
not a mere advocacy page either.

**There is still no single legally-binding Italian "plain language" standard.** The Designers
Italia guide is the de-facto normative reference for web/PA content, and Easy-to-Read is the
reference for cognitive-accessibility versions. Both are **qualitative**: neither states a word
count. Every sentence-length figure in this section is therefore a **measurement of practice**,
never a quotation of a rule.

**Read the tier precisely.** `it-easy` may be described as *following* the Designers Italia / AGID
guidance and the European Easy-to-Read practice as adopted in Italian, never as *conforming to an
Italian plain-language standard*, because there is none to conform to.

**How `it-easy` relates to the kit's base rules.** `it-easy` inherits the kit's base
simplified-language rules from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) —
one idea per sentence; active voice; verbs over *-zione/-mento* nominalizations; everyday words;
digits as digits (§5/§11); a one-line "what is this" opener; and a consistent, literal tone. **One
of those base rules is overridden by measurement and one Italian-specific overlay is added**; both
are in §8f. The overlay: **hold the recorded tu register (§4) steadily** — no drift to Lei for
"formality," and the imperatives stay 2nd-person tu.

**Term-preservation (restated, binding).** In `it-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Use the same Italian term as the base variant, then
"cioè: …", then a concrete example (e.g. keep **rete neurale**, then explain it in plain Italian).
This is not a guess: *cioè* is the single most register-distinctive word in the primary corpus
(706.3 vs 0.0 per 100k), i.e. the easy edition's own house move is **explain in place**, not
replace.

### 8b. The axis the tradition claims — burocratese against linguaggio semplice

**The axis is stated by the source, not inferred by this guide.** The Designers Italia / AGID
writing guidance names the register it moves away from and the moves that get you out of it. Each
rule below is a **fetched quotation** from that guidance; where a claim is not, it carries a ⚠.

**Concrete rules (from the PA writing style guide):**

- Short, simple, concise sentences: "Usa uno stile semplice, breve e conciso. Evita frasi e
  paragrafi troppo lunghi."
- Active verb forms: "Utilizza forme verbali attive."
- Prefer **verbs over nominalizations** — avoid the *-zione / -mento* noun where a verb works
  ("usare i verbi invece delle forme nominali"). **Measured, and it is more complicated than the
  rule** — see §8d.
- Address the reader directly with **tu**, drop bureaucratese: "usa il 'tu', evitando … il 'lei'
  e i formalismi."
- Structure into paragraphs and bulleted lists.
- **Sentence length is now measured rather than asserted.** Across 62 easy-to-read leaflets from
  one issuing association: **mean 16.9 words, median 13, 59.6 % of sentences at 15 words or
  fewer**, against **mean 31.8 / median 28 / 22.2 %** in the same association's news archive
  (§8c). The commonly cited "~15–20 words" figure for easy Italian, previously ⚠ editorial in this
  guide, **lands inside the measured band** — but it is still not a figure any Italian authority
  states.

**What the source states and what it does not.** It states the **structural** axis and states it
as an issuing body. It supplies **no word list**: it never names which Italian words are the
everyday ones. The table below therefore does a job the source does not do — and, unlike the
earlier version of this guide, most of its rows are now **counted** rather than asserted.

**Complex → everyday word table (burocratese → linguaggio semplice).** The `evidence` column is
binding: **cite the tier, never just the row.** `measured` = the direction was counted in §8c's
corpora and holds; `thin` / `untestable` = the corpora cannot see the pair, which is **not** a
refutation (see §8d); `⚠ craft` = this guide's judgment, unsupported.

| Complex / bureaucratic | Everyday | Evidence |
|---|---|---|
| effettuare / effettuare il pagamento | fare / pagare | **measured** — *effettuare* 0.0 vs 10.9 per 100k; *fare* 353.3 vs 60.0 (secondary pair) |
| usufruire di | usare / avere | **measured** — *usufruire* 0.0 vs 13.1; *usare* 245.8 vs 1.1 |
| trasmettere la documentazione | inviare i documenti | **measured, half** — *documentazione → documenti* holds (0.0 vs 8.2 / 45.7 vs 5.5); *trasmettere → inviare* is 🔴 in §8d |
| è necessario che tu provveda a | devi | **measured** — *devi* 155.5 vs 0.0; *provvedere* itself is thin |
| nel caso in cui | se | **measured** — *se* 480.2 vs 162.5; and *ove → se*, *qualora → se* both hold |
| tale / tali | questo / questi | **measured, new row** — *tale* 2.3 vs 59.4, *questo* 442.5 vs 249.8 |
| ove / qualora | se | **measured, new row** — both formal forms are absent from the easy side |
| occorre | bisogna | **measured, new row** — *occorre* 0.0 vs 15.3; *bisogna* 77.7 vs 10.9 |
| utilizzare | usare | **measured, new row** — holds in the primary pair; *partial* in the secondary (see §8d) |
| altresì | anche | **measured in the primary pair only**; thin in the secondary |
| recarsi presso | andare a | thin — *recarsi* 0.0 vs 2.7, too rare to carry a direction |
| istanza | domanda / richiesta | thin — *istanza* 0.0 vs 2.2 |
| decorso il termine | dopo la scadenza | untestable — *decorso* absent from both corpora |
| al fine di | per | ⚠ craft — multi-word, not counted |
| in ordine a / in merito a | su / riguardo a | ⚠ craft — multi-word; *concernenti/inerenti → su* came back thin and flat |

### 8c. The corpus — two pairs, one of them a same-document pair

**What was sought, and what was found this time.** The design this kit uses elsewhere: **one
publisher, two editions of the same material**, one plainer and one standard, so that publisher,
genre, and topic are held constant and only register varies. Italian yields something better than
that and something weaker than that, so both are reported and kept apart.

**Primary pair — one document, two registers, nothing else varying.** A 2023 handbook on
disability language, issued by a national disability-inclusion association's legal-and-social
studies center with a government ministry and a national observatory, contains **its own
easy-to-read edition inside the same volume**, carrying the European Easy-to-Read logo (§8a).
The two halves say the same things about the same subject in the same year under the same
imprint. Sizes as counted, not as advertised:

| | pages | tokens | types | type/token | mean sentence | median | ≤15 words | tokens ≥12 chars |
|---|---|---|---|---|---|---|---|---|
| **standard half** | 51 | 14,642 | 2,956 | 0.202 | 34.95 | 28 | 19.8 % | 6.8 % |
| **easy-to-read half** | 114 | 15,150 | 1,919 | 0.127 | 25.29 | 22 | 27.7 % | 4.4 % |

**Secondary pair — larger, and genre-confounded on purpose.** 62 easy-to-read PDF documents
published by the same association against 400 articles from the same association's own news
archive. This is the pair the earlier pass identified and could not build. It has roughly six
times the tokens of the primary pair and it is the one with statistical power — but the plain
side is instructional leaflets (voting, medicines, rights, household tasks) and the standard side
is news, **so genre still varies with register**. It is used to confirm or refuse what the
primary pair suggests, never as the sole support for a row.

| | documents | tokens | types | mean sentence | median | ≤15 words | tokens ≥12 chars |
|---|---|---|---|---|---|---|---|
| **easy-to-read leaflets** | 62 | 87,465 | 8,146 | 16.87 | 13 | 59.6 % | 2.4 % |
| **news archive** | 400 | 183,359 | 17,840 | 31.76 | 28 | 22.2 % | 5.7 % |

**Method, so a reader can disagree with it.** Collection with the kit's own
[`corpus-measure`](../../scripts/corpus-measure.mjs): `pdf --urls … --alphabet` for both PDF
corpora, `fetch --urls … --selector` for the news archive, then `stats --sanity che` and
`compare`. The publisher's access policy permits automated collection (`Disallow:` empty for all
agents) and its sitemap enumerates both sides. Keyness (log-likelihood) was run **before** any
probe list was written, so the rows below were nominated by the data and not by intuition.

**🔴 Two extraction faults, both of which would have produced confident wrong numbers.** Neither
is a fact about Italian; both are recorded because the same shape will recur in any PDF corpus.

1. **The primary document's standard half is typeset in font subsets whose character map is
   broken** — about 27 % of its characters extract as Latin Extended-A/B noise. Crucially the loss
   is **not random**: the affected lines are exactly the ones carrying *ti*, *tt*, *ff*, *fi*, and
   *ffi* ligatures, which in Italian means the *-zione* and *attività* vocabulary the whole
   measurement is about. **Dropping the damaged lines would have deleted the evidence and left a
   plausible-looking table.** The map was reconstructed and the text decoded before counting.
2. **220 sentence-final periods decoded as the letter K.** Until that was found, the easy-read
   half measured a **longer** mean sentence than the standard half — 35.7 against 32.1, the exact
   reverse of the truth. It is the same artifact class as a page number breaking segmentation: a
   punctuation mark lost in extraction silently merges sentences.

`corpus-measure pdf` now gates on `--alphabet`, and the gate was confirmed to fire on this
document before being trusted: it rejects it with *"only 73 % of letters are in --alphabet"*. A
script-level check would **not** have caught it, because Latin Extended-A is still Latin.

**🔴 The glossary lead — chased, resolved, and it is not what it was hoped to be.** The
association's *"Le Parole Giuste"* is the publication behind the primary pair. It was pursued as a
possible **sourced complex→everyday word list**, which would have outranked any corpus for §8b.
It is not one. It is a **disability-language style guide** — which term respects the person and
which stigmatizes (*persona con disabilità*, not *disabile*, *diversamente abile*, or
*handicappato*) — derived from a North American journalism style guide. **It cannot settle a single
row of §8b's table**, because it is not about difficulty at all. Recorded so that nobody chases it
a third time. What it does carry is worth more: its own easy-to-read edition, i.e. the primary
pair.

**Still closed, and not to be reopened.** The gold-standard same-house pair — a children's weekly
and an adult magazine from one publishing house — remains unavailable because **the child-side
title's access policy disallows automated collection for all agents**. That is a stated position
of the publisher, not a technical fault; no workaround was attempted and none is to be. The same
applies to an Italian children's encyclopedia, out on two independent counts (a bot challenge
*and* a stated refusal). One regional public-administration lead advertising a *"lingua facile"*
offering is still **parked on enumeration, not on policy**.

### 8d. 🔴 The do-NOT-simplify list

**These rows are now measured, and the most valuable ones contradict the guidance this guide
quotes in §8b.**

| Do **not** do this | Why |
|---|---|
| ~~swap the *-zione* noun for its verb as a general rule~~ | **The sharpest measured reversal, and it was found twice independently.** §8b's sourced rule says "usare i verbi invece delle forme nominali". Two of the five nominalization pairs tested run **backwards**: *attuazione → attuare* (primary pair 0.0 vs 47.8 per 100k for the noun, 0.0 vs 13.7 for the verb; secondary 0.0 vs 17.5 / 0.0 vs 6.0) and *definizione → definire* (primary 13.2 vs 122.9 / 0.0 vs 20.5; secondary 2.3 vs 17.5 / 1.1 vs 11.5), both REVERSED in **both** corpora. Read the pattern, not the pair: the easy edition does not *replace* the abstract noun with its verb, it **drops the construction and re-says the sentence**. Where the noun names a thing the reader needs (*comunicazione*, *partecipazione*, *realizzazione*), the rule does hold. So: unwind a nominalization by **rewriting the clause**, never by substituting a word. |
| ~~assume the Latinate or bureaucratic word is the harder one~~ | Confirmed as a partial truth for Italian, with named exceptions. The measured wins (*effettuare → fare*, *usufruire → usare*, *tale → questo*, *ove/qualora → se*, *occorre → bisogna*) are real. But *presso → a*, *mediante → con* and *nonché → e* all come back **flat: no register signal** in the larger pair — the "everyday" member is not actually commoner in plain Italian. **Rarity, not etymology, is what makes a word hard**, and three of this guide's own compound-preposition rows failed on exactly that. |
| ~~read *trasmettere → inviare* as settled~~ | It came back **REVERSED** (formal 2.3 vs 5.5, everyday 1.1 vs 4.9) — but on counts small enough that the reversal is itself weak. Treat as **open**, not as a rule in either direction. Its sibling *documentazione → documenti* holds cleanly; a compound row can be right in one half and wrong in the other. |
| ~~promote *tali → questi* from the primary pair alone~~ | It **holds** in the same-document pair and is **flat** in the larger one. That divergence is what a second corpus is for. Use *tale → questo* (which holds in both) and leave the plural row as a hint. |
| ~~treat the untestable rows as refuted~~ | *decorso*, *istanza*, *recarsi*, *provvedere* return **untestable** or **thin**: the formal member is absent from both corpora. That is a fact about the corpora, not about the words. These belong to **administrative correspondence**, and both corpora are rights-and-information publishing. This is the fourth language in this kit where an official-register word list proved untestable against the only corpora that could be built — see the kit's backlog for the experiment that would close it. **A sourced list is never demoted because a mismatched corpus could not see it.** |
| ~~apply the kit's ~8–12-word sentence target to Italian~~ | **Measured override, see §8f.** Italian easy-read practice by an issuing body runs at **median 13 / mean 16.9** words (62 leaflets), and the expository easy-read edition runs at **median 22 / mean 25.3**. Nothing in Italian practice hits 8–12. Aim at the measured band and treat the kit's figure as the English calibration it is. |
| ~~simplify by word length alone~~ | Long words do fall — tokens of 12+ characters drop from 6.8 % to 4.4 % (primary) and 5.7 % to 2.4 % (secondary). But that is a *consequence* of rewriting, not a lever: shortening a word does not make it commoner. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, and now supported by the corpus: the easy edition's own signature move is *cioè* (706.3 vs 0.0 per 100k) — **keep the term and gloss it in place**. |
| ~~assume `it-easy` must address the reader as tu~~ | See §8e. Italian easy-read practice splits by genre and the measurement says so. |
| ~~drift the register in the name of simplicity~~ | `it-easy` keeps **tu** (§8e) because `it` does (§4). Simplified is not formal and not chatty; **never mix tu and Lei** addressing the same reader. |

**What the measurement also confirmed**, so it is not re-litigated: vocabulary narrows sharply
(type/token 0.202 → 0.127 on a same-size sample), sentences shorten by ~28 % within the same
document and by ~47 % across the leaflet/news pair, and the easy side's most distinctive words are
metalinguistic connectives and glosses (*cioè*, *vuol dire*, *bisogna*, *questo*, *per esempio*)
rather than a different stock of content words.

### 8e. 🔑 The address decision — `it-easy` keeps **tu**, and the corpus shows why the question is genre-shaped

> **Decision, recorded so that nobody "fixes" it: `it-easy` uses `tu`, exactly as `it` does (§4).
> It does NOT switch to `Lei` for "formality".**

- ✅ **Salva il file** · **Iscriviti** — the tu-imperative, in `it` and in `it-easy` alike
- ❌ **Salvi il file** · **Si iscriva** — correct Italian, but the Lei register, and therefore wrong
  for both variants

**The grounds are §4's**, which records **tu** as a **human-gated project decision** and says
plainly that it is not a ruling by any language authority. §8a's own source agrees with it:
"usa il 'tu', evitando … il 'lei' e i formalismi".

**And now there is frequency evidence — with a caveat the numbers themselves supply.** In the 62
easy-to-read leaflets, second-person address is overwhelming and it is **tu**: *puoi* 344.1 vs 1.1
per 100k in the news archive, *devi* 155.5 vs 0.0, *hai* 181.8 vs 1.6, *ti* 178.4 vs 4.4. A
secondary **voi** stream exists in the same corpus (*potete* 130.3, *dovete* 24.0, *vostro* 37.7),
so Italian easy-read practice is not uniform — but **nothing in either corpus supports Lei**.

**The caveat is the interesting part.** The easy-read edition in the *primary* pair barely
addresses the reader at all (*puoi* 26.4, *devi* 0.0, *hai* 0.0): it is expository, third-person,
"il Ministro dice che …". So the address form in Italian easy-read tracks **genre**, not register:
instructional leaflets address you directly, explanatory editions describe. `it-easy` is
instructional, which puts it in the tu column — and that is now an observation about Italian
practice, not only a project decision. What would still settle it is comprehension testing with
the readers `it-easy` is written for, which does not exist (§8g).

### 8f. What `it-easy` is built on, in order of leverage

1. **Sentence structure — the main lever, and the only one with both a citable issuing body and a
   number.** "Usa uno stile semplice, breve e conciso" (§8b), and the measured target is
   **median 13, mean ~17 words** for instructional easy Italian (§8c). This is where the real gain
   is.
2. **🔴 Override of a kit base rule, recorded with its numbers.** The kit's ~8–12-word sentence
   target is an **English calibration and does not transfer to Italian**. No Italian easy-read
   corpus measured here approaches it: 16.87 mean / 13 median across 62 issuing-body leaflets, and
   25.29 mean / 22 median in an expository easy-read edition. `it-easy` targets **≤15 words as the
   working rule and ~17 as the realistic mean**, and a translator who forces 8–12 is fighting the
   language's practice, not following the kit.
3. **Rewrite the clause, do not substitute the noun.** The nominalization rule survives as a
   *direction* and fails as a *swap* (§8d): *attuazione → attuare* and *definizione → definire*
   both run backwards. Unwind by re-saying the sentence.
4. **Term preservation before substitution** — keep the technical term, then "cioè: …", then an
   example. This is the easy edition's own most distinctive move in the corpus (§8d).
5. **The tu register (§4), held steadily** (§8e), imperatives 2nd-person, no mixing with Lei.
6. **Vocabulary substitution last, and by tier.** §8b's table now marks every row; **apply
   `measured` rows freely, `thin`/`untestable`/`⚠ craft` rows only as hints with a native reader in
   the loop.** Nothing here licenses a bulk find-and-replace over Italian vocabulary.
7. **The European "Lettura facile" / Easy-to-Read reference** (§8a) — cite it as **European
   guidance adopted in Italian**, never as an Italian-issued norm.

### 8g. What is still open

1. **The administrative-register rows remain untestable.** *decorso*, *istanza*, *recarsi*,
   *provvedere*, *al fine di*, *in ordine a* belong to administrative correspondence, and neither
   corpus contains that text type. The pairing that would put them in range is an
   **administrative-prose corpus against its own plain-language rewrites** — several public bodies
   publish both. Until then those rows stay ⚠ craft and are not to be promoted.
2. **Multi-word rows are not measured and the current tool cannot measure them.** Half of §8b's
   original table is phrases (*al fine di*, *nel caso in cui*, *in ordine a*), and `compare
   --probe` tests single tokens. An n-gram probe would settle them from the corpora already built.
3. **The gold-standard same-house pair is closed by policy, not by engineering.** The children's
   weekly declines automated text collection; that is to be respected, not circumvented.
4. **The regional public-administration lead is parked on enumeration.** Its policy does not refuse
   collection; only its listing method was not solved.
5. **No native-speaker pass on the table.** The `measured` rows no longer need one to be usable,
   but the ⚠ craft rows still do — and a native editor could also judge whether the flat
   compound-preposition rows are worth keeping as style advice after failing as frequency claims.
6. **The primary pair is small.** 14.6k and 15.2k tokens is enough for a strong keyness signal and
   not enough for rare words; every row above that rests on the primary pair alone is marked as
   such. The same document's third register — a Comunicazione Aumentativa Alternativa edition,
   96 pages of pictogram captions — was extracted but not used: at ~15.7k characters of telegraphic
   captions it is a different text type, not a third register of the same prose.
7. **The passive-voice rule was not tested.** The kit's blanket "prefer the active voice" has
   already failed measurement in another language. Nothing here checked it for Italian, so it is
   inherited unverified.
8. **The historic antecedents were not fetched** — the *Codice di stile* (1993) and *Manuale di
   stile* (1997) are cited from general knowledge, and nothing may be quoted from them.
9. **No comprehension evidence exists for any of this.** Whether the recommended forms are actually
   *understood* better was not established, in Italian or in the European Easy-to-Read practice
   §8a names.

Sources: <https://docs.italia.it/italia/designers-italia/design-linee-guida-docs/it/stabile/doc/content-design/linguaggio.html> ·
<https://docs.italia.it/italia/designers-italia/writing-toolkit/it/bozza/suggerimenti-di-scrittura/stile-di-scrittura.html> ·
<https://designers.italia.it/design-system/fondamenti/tono-di-voce/>. **Corpus (§8c):** four
corpora, all from <https://www.anffas.net/> (access policy permits automated collection;
`Disallow:` empty for all agents). Primary pair — the standard half (51 pages, 14,642 tokens) and
the easy-to-read half (114 pages, 15,150 tokens) of *"Le Parole Giuste"*, reached from
<https://www.anffas.net/it/le-parole-giuste/>. Secondary pair — 62 easy-to-read documents (87,465
tokens) listed at
<https://www.anffas.net/it/linguaggio-facile-da-leggere/documenti-facili-da-leggere/> against 400
articles (183,359 tokens) from the same site's news archive. Collected and counted with
[`scripts/corpus-measure.mjs`](../../scripts/corpus-measure.mjs) (`pdf --alphabet`, `fetch
--selector`, `stats --sanity che`, `compare --top` then `compare --probe`); the primary document's
broken font encoding was repaired before counting and both extraction faults are recorded in §8c.
The historic antecedents and the multi-word rows of §8b remain ⚠ editorial. Hosts that decline
automated collection — the same-house children's weekly, an Italian children's encyclopedia — are
recorded in §8c as **stated positions, not obstacles**. Base rules inherited from
[accessibility-workflow](../accessibility-workflow.md), with the sentence-length rule **overridden
by measurement** in §8f.

---

## 9. Regional variation

**Which standard the project targets — italiano standard.** Based historically on literary
Tuscan/Florentine, codified through Manzoni and the national school/broadcast norm, the **written
standard is highly uniform nationwide**. Regional differences are strongest in **pronunciation,
lexicon, and some syntax**, far less in formal writing. The project targets **italiano standard
neutro**: the national written norm of Treccani, national media, and the PA guidelines, which
reads correctly to all Italian speakers regardless of region.

**Regional layers.**

- **Dialects** (*dialetti*) — Napoletano, Siciliano, Veneto, Lombardo, etc. are **distinct
  Romance varieties, not "accents"**; separate from standard Italian and not used for
  cross-regional written content.
- **Regional Italian** (*italiano regionale*) — standard Italian colored by local lexicon and
  pragmatics. Community-marked vocabulary: north *anguria* vs center-south *cocomero*
  (watermelon); *scendere* used transitively in the south; geo-marking greetings/particles
  (*bella!*, *uè*). Some words are neutral-national, others read strongly local.

**Neutrality strategy (explicit).**

1. Use **italiano standard neutro** — the national written norm; no dialect.
2. Avoid strongly region-marked lexemes; **pick the pan-national synonym** when one exists.
3. Keep technical terms per §6; hold the recorded **tu** register per §4.
4. **Do not let it-CH data leak into it-IT formatting** (see below).

⚠ The "italiano neutro" framing is an **editorial synthesis** — the Designers Italia guide
implicitly targets this national-standard register but does not use the phrase.

**Swiss Italian (it-CH) — the one CLDR-backed divergence.** If targeting Switzerland, some lexical
and formatting differences apply. Notably **CLDR it-CH uses an apostrophe as the group separator**:
**1'000** — versus the dot for it (Italy): **1.000** (§5). Parameterize per deployment; never mix
the two number systems in one build.

**Where it-CH is actually spoken, and the legal footing** (primary-sourced; see the header). Italian
is **an official cantonal language of Grigioni by name** — *Costituzione del Cantone dei Grigioni*
Art. 3: "Il tedesco, il romancio e l'italiano sono le lingue cantonali e ufficiali equivalenti dei
Grigioni." **Ticino** is constitutionally an **Italian-language canton** without using the phrase
*lingua ufficiale* — Art. 1: "Il Cantone Ticino è una repubblica democratica di cultura e lingua
italiane." The Grigioni *Legge sulle lingue* (LCLing, 492.100) builds on that Art. 3 and makes the
canton's trilingualism a duty: its stated purpose includes "rafforzare il trilinguismo quale
caratteristica essenziale del Cantone" and "salvaguardare e promuovere la lingua romancia e
italiana". **Editorially this changes nothing** — Swiss Italian written norm is standard Italian,
so §9's neutrality strategy is unaffected; the divergence to parameterize remains the **number
grouping**, not the prose.

- ✅ it (Italy): **1.000** · it-CH: **1'000**
- ❌ it-CH grouping (*1'000*) leaking into an it-IT build, or vice versa.

Sources: it-CH grouping fact — CLDR `it`/`it-CH`
<https://www.unicode.org/cldr/charts/latest/verify/numbers/it.html>
· <https://cldr.unicode.org/downloads/cldr-48>. Cantonal legal footing (fetched, primary):
*Costituzione del Cantone dei Grigioni* 110.100, Art. 3 <https://www.lexfind.ch/tolv/244968/it> ·
*Costituzione della Repubblica e Cantone Ticino* del 14 dicembre 1997, Art. 1
<https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/1> ·
*Legge sulle lingue del Cantone dei Grigioni* (LCLing) 492.100
<https://www.lexfind.ch/tolv/51480/it>. Standard-Italian uniformity, dialect vs regional
layers, and the "italiano neutro" framing are ⚠ editorial synthesis (largely linguistic
common-ground, no single fetched authority).

---

