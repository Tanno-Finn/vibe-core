<!-- base -->
# lang-fr — French (français) — language guide

> **Setup & sources live in [`fr.setup.md`](fr.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** français / French.
**BCP 47 code (base):** `fr`.
**BCP 47 code (simplified variant):** `fr-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services; a strict BCP 47
rendering would be a private-use subtag like `fr-x-simple`, but the kit token `fr-easy` is the
one that counts here). The French plain-language tradition itself is named **FALC** (Facile à
Lire et à Comprendre) — see §8.
**Speaker reach:** about **396 million speakers worldwide** — the figure the *Organisation
internationale de la Francophonie* (OIF) reports. This replaces an earlier "not supplied by this
dossier" note that was **false**: the second research pass on the same brief opened with a cited
profile paragraph, and it had simply never been merged. ⚠ Community-tier: the citation is a
Wikipedia list of countries where French is official, *quoting* OIF — not an OIF page, and not one
of this guide's §2 authorities. French is official or co-official across France, much of
francophone Africa, Canada (Québec), Belgium, Switzerland, Luxembourg, and Monaco, and is a working
language of many international organizations. ⚠ The **first-language** count is a different and
much smaller number, and **neither** research pass supplies one — do not quote a native-speaker
figure from this guide.
**Script + direction:** Latin script (with diacritics and the ligature œ); **left-to-right**.
No bidi, no shaping, no romanization question — the localization risk for French is not the
alphabet but its **typographic micro-rules** (the space *before* `; : ? !`, guillemets, the
decimal comma, currency-after) and the **tu/vous** register choice.
**Status:** planned — authored from external desk research on one brief, covering base `fr` and the
`fr-easy` pendant: a long main dossier (research date 2026-07-25) plus a shorter **companion pass** on the
same brief, whose speaker profile, on-domain §7 stock phrases, and four §6 terminology attestations
were merged in on **2026-07-27** (they had been sitting unused; the earlier revision of this guide
was built from the main dossier alone and said so). The main dossier was **then
independently reviewed against its cited sources**, so its verbatim quotes are trusted
and its own `⚠` markers are carried through unchanged; the companion pass carries **weaker
citations** and everything merged from it is marked at point of use. This guide has **not yet been reviewed by
a native speaker**; per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)) the header records that gap honestly. Section-level
support is mixed and marked per section: **strong** (B authorities, E terminology, D dates via a
government source, F/FALC via Unapei) vs **community-tier** (A typography, G regional, C
traps/register, D number-formatting) — see each section's Sources footer.
**Easy or hard for this kit:** **easy** on the mechanics that break other languages — Latin
alphabet, whitespace word separation (standard tokenization and word-boundary highlighting
work), LTR, no shaping or bidi. **Hard** on four French-specific traps that a naive pipeline gets
wrong every time: (1) the **narrow no-break space U+202F before `; : ? !`** and inside guillemets;
(2) **guillemets « »** rather than `"…"`; (3) numbers with a **comma decimal** and a **U+202F**
thousands separator, and currency **after** the amount (`12,50 €`); (4) the **tu/vous** register
decision, resolved below to **vous** (§4). Plus a font-coverage gotcha: cheap fonts drop **œ/Œ**,
**Ÿ**, U+202F, the typographic apostrophe ’, and accented capitals (É À Ç).

Sources: <https://www.academie-francaise.fr/linstitution/les-missions> ·
<https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable> ·
<https://culture.fr/franceterme/terme/INFO948> ·
<https://en.wikipedia.org/wiki/List_of_countries_and_territories_where_French_is_an_official_language>
(the OIF ~396 M figure and the official-status list, as cited by the companion research pass —
⚠ community-tier, quoting OIF at second hand)

---

## 1. Header block

See above. One-line orientation: French is an Indo-European, SVO, LTR Latin-script language with
a strongly codified typographic tradition; the localization risks concentrate in **punctuation
spacing (U+202F), guillemets, number/date/currency formatting, tu/vous register**, and
**font coverage of œ / Ÿ / accented capitals**.

---

## 4. Grammar for translators

Support here is **strong on the sourced traps and the register evidence** (Wiktionnaire faux-amis
×5, frello tu/vous, OQLF *faire du sens*) but **community-tier on word-order basics** (standard
grammar, not separately fetched). Marked per point.

**Word order.** French is **SVO** like English, but three things trip up a naive transfer:
adjectives usually **follow** the noun; a small set of common adjectives (*grand, petit, bon,
beau, nouveau, jeune, vieux…*) **precede** it; and object/reflexive pronouns come **before** the
verb. ⚠ standard grammar, not separately fetched.

- ✅ `une voiture rouge` (adjective after the noun) · `un grand livre` (short common adjective
  before) · `je te le donne` (pronouns before the verb).
- ❌ `une rouge voiture` (English adjective-before order) · `je donne te le` (pronouns after the
  verb).

**Register — tu vs vous, and the project's recorded choice.** French forces a T/V choice on every
second-person address. From frello.fr: *"On utilize vous (= vouvoiement) avec une personne qu'on
ne connaît pas ou pour marquer le respect ou la distance"* and *"On utilize tu (= tutoiement) avec
une personne qu'on connaît bien comme un ami, un membre de la famille ou avec un enfant."* In
classroom reality students are tutored by peers but **never tutoie the teacher** (dossier search
summary: *"a student would not address their teacher with informal address, regardless of the
teacher"*).

> **Register decision (human-gate): vous — taken and recorded.** On the quality argument,
> **vous** (vouvoiement) is adopted as the platform's respectful,
> cross-audience default for all instructional copy addressed to the learner. **Binding for all
> second-person copy in `fr` and `fr-easy`** — no drift to *tu* in informal or playful passages.
> **Honest note on its status:** this is a **project / editorial decision, not an academy ruling.**
> The dossier is explicit that *"there is no single locked convention"* and hedges the vous
> recommendation itself as editorial (*"⚠ editorial recommendation grounded in the sourced quotes
> above; no single official rule exists"*). What *is* sourced is the meaning of each form (frello)
> and that vous is the safe, respectful default for an unknown adult audience. **Exception noted,
> not adopted:** products deliberately targeting **children/teens** conventionally choose *tu* and
> apply it consistently — if the brand ever pivots to that audience, the register must be
> re-decided and re-recorded, not silently mixed (mixing tu/vous is jarring).
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**Three to five EN→FR traps that break naive translation** (each with a right/wrong pair):

**(1) False friend *actually*.** English *actually* = **en réalité / en fait**, **not**
*actuellement* (which means *currently*). Wiktionnaire faux-amis: *"actually (adv.) : en réalité,
en fait"* vs *"actuellement : currently, presently, at the moment."*
- ✅ "Actually, it's free" → **En fait, c’est gratuit.**
- ❌ **Actuellement, c’est gratuit** (says "*currently* it's free").

**(2) False friend *eventually*.** = **finalement / un jour ou l'autre**, **not** *éventuellement*
(= *possibly*). Wiktionnaire: *"eventually (adv.) : … finalement, un jour ou l'autre"* vs
*"éventuellement (adv.) : possibly, if need be."*
- ✅ "You'll eventually understand" → **Vous finirez par comprendre.**
- ❌ **Vous comprendrez éventuellement** (says "you'll *possibly* understand").

**(3) False friend *library*.** = **bibliothèque**; *librairie* = **bookshop**. Wiktionnaire:
*"library (n) : bibliothèque"* / *"librairie (n f) : bookshop."*
- ✅ "a code library" → **une bibliothèque de code.**
- ❌ **une librairie de code** (a *bookshop* of code).

**(4) False friend *sensible*.** English *sensible* = **raisonnable / judicieux**; French
*sensible* = **sensitive**. Wiktionnaire: *"sensible (a) : raisonnable, judicieux, avisé"* vs
*"sensible (a) : sensitive, touchy."*
- ✅ "a sensible default" → **un choix par défaut raisonnable.**
- ❌ **un choix par défaut sensible** (a *sensitive* default).

**(5) Anglicism calque *faire du sens*.** *To make sense* calqued as *faire du sens* is
**déconseillé** — use **avoir du sens**. OQLF: *"L'expression faire du sens résulte
vraisemblablement de l'influence de l'anglais make (dans to make sense)"*; recommended:
*"avoir du sens", "être logique", "tenir debout."*
- ✅ **Cela a du sens.** / **C’est logique.**
- ❌ **Cela fait du sens.**

Sources: <https://fr.wiktionary.org/wiki/Annexe:Faux-amis_anglais-fran%C3%A7ais> ·
<https://www.frello.fr/grammaire/le-tutoiement-et-le-vouvoiement> ·
<https://vitrinelinguistique.oqlf.gouv.qc.ca/23499/les-emprunts-a-langlais/emprunts-syntaxiques/lemprunt-deconseille-faire-du-sens>
· (word-order basics ⚠ standard grammar, not separately fetched; the vous recommendation is
**editorial** per the dossier, taken and recorded as a project decision above)

---

## 5. Numbers, dates, currency

**Mixed support, marked per item.** Dates are **strong** (verbatim, a government source,
Canada.ca). Number/currency **formatting** is **community-tier**: the dossier drew the actual
fr-FR values from **localization.guide**, *not* from raw CLDR locale data — ⚠ **flag this** and
drive concrete build output from live CLDR `fr` data, not from values quoted here.

**Number formatting (fr-FR).** Decimal separator is a **comma `,`**; the group separator is a
**narrow no-break space U+202F**. So `1234567.89` renders as **`1 234 567,89`** (U+202F between
each group of three, comma before the decimals). Source: localization.guide/country/fr (decimal
`,`; group separator "narrow no-break space"; example `1 234 567,89`).

- ✅ `1 234 567,89` (U+202F thousands, comma decimal).
- ❌ `1,234,567.89` (English: comma thousands, period decimal).
- ❌ `1.234.567,89` (period thousands — German/other-European style, not French).

**Why U+202F for grouping (rationale, not the change record).** The CLDR-side move away from a
plain no-break space was a deliberate correctness fix. The Unicode mailing-list rationale:
*"the migration from the wrong U+00A0 to the correct U+202F as group separator should be synched
across all locales using space instead of comma or period."* ⚠ that link is the **proposal /
rationale**; the *shipped* fr value **U+202F** is confirmed by localization.guide, not by the
mailing list. **CLDR version:** the dossier cites **CLDR 48** (release Oct 29, 2025) with
maintenance **48.1** (Jan 8, 2026) as the most recent — ⚠ via search summary; check live.

**Currency (EUR).** Symbol **follows** the amount, with a (no-break) space. localization.guide:
*"€ (EUR)"* placed *"After number with space → 1 234 567,89 €."*
- ✅ `12,50 €` (amount, no-break space, then €).
- ❌ `€12,50` (English/US symbol-first placement).
- The space before € should be a **no-break space** so it never wraps to a new line.

**Dates.** Pattern is **day–month–year**, month **spelled out in lowercase**, **no comma**. From
Canada.ca (Clés de la rédaction): *"Dans une date, on écrit généralement le jour et l'année en
chiffres et le mois en lettres"*; *"Le mois prend une minuscule initiale"*; *"Pour désigner le
premier jour du mois on écrit 1er et non 1"*; *"On ne met pas de virgule entre le mois et
l'année"* (example given: *"9 janvier 2026"*). The CLDR long-date pattern for fr is `d MMMM y`
(⚠ pattern string known via search summary, not fetched from raw CLDR).

- ✅ `9 janvier 2026` · `1er mars 2026` (first of the month → `1er`).
- ❌ `9 Janvier 2026` (capitalized month) · `9 janvier, 2026` (comma before the year) ·
  `janvier 9, 2026` (English month-first order) · `1 mars 2026` (should be `1er`).

**Line-break protection (⚠ editorial).** Keep day+month+year together and number+unit / number+€
together with no-break spaces, so a date or a price never splits across lines.

Sources: <https://www.nos-langues.canada.ca/cles-de-la-redaction/date-regles-decriture>
(dates — strong, government source) · <https://localization.guide/country/fr> (numbers +
currency — **community-tier, NOT raw CLDR** ⚠) ·
<https://corp.unicode.org/pipermail/unicode/2018-September/007028.html> (U+202F **rationale**
only) · <https://cldr.unicode.org/downloads/cldr-48> (CLDR 48, ⚠ via search
summary) · (exact CLDR `fr` pattern strings ⚠ not fetched from raw CLDR — drive from live data)

---

## 6. Terminology strategy

Support here is **strong**: almost every term below is sourced to **FranceTerme** (the
*Journal officiel* delivery site) and/or the **OQLF GDT**. Two "learning-type" terms are
⚠ unsourced-by-direct-fetch (standard official terms not individually fetched).

**Loanword vs coinage — the French policy.** France's **Commission d'enrichissement** coins
French replacements for foreign terms and publishes them as recommended terms; the Québec **OQLF**
does the same, often more aggressively against anglicisms. In practice: **loanwords are tolerated
in speech, but the official/educational register prefers the French coinage.** So *chatbot*,
*deep learning*, *machine learning* are understood loanwords, but instructional copy should
**prefer the French terms** below and keep the English in parentheses on first mention. When
France (FranceTerme) and Québec (OQLF) agree — as they do for most AI vocabulary — use the shared
official term.

**Transliteration / romanization.** Not applicable (native Latin script). Latin acronyms
(IA, ML, GPU, API) stay in Latin inside French running text.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give target term + original + a short plain gloss,
then use the target term alone. Instantiated with a sourced term:

> **intelligence artificielle** (artificial intelligence, IA) — *champ interdisciplinaire visant
> à comprendre les mécanismes de la cognition et à les imiter par un dispositif matériel et
> logiciel.* Afterwards: **intelligence artificielle** (or **IA**) alone.

(The French term and its FranceTerme definition are sourced below; the short gloss is authored per
the sandwich format.)

**Seed field vocabulary (AI / ML).** Official French equivalents, each sourced to FranceTerme
and/or OQLF. Use these in preference to the English loanword in instructional copy.

| Concept (EN) | French term | Source / note |
|---|---|---|
| Artificial intelligence (AI) | **intelligence artificielle (IA)** | FranceTerme INFO948 ✓ |
| Machine learning (ML) | **apprentissage automatique** (syn. *apprentissage machine*) | FranceTerme INFO939 + OQLF 26552500 ✓ |
| Deep learning | **apprentissage profond** | FranceTerme INFO946 ✓ |
| Artificial neural network | **réseau de neurones artificiels** (short: *réseau de neurones*) | FranceTerme new-terms article ✓ |
| Supervised learning | **apprentissage supervisé** | OQLF fiche 26552501 (⚠ title confirmed; definition not separately fetched) |
| Unsupervised learning | **apprentissage non supervisé** | ⚠ list-level — in the OQLF AI-vocabulary list carried by the companion pass; no individual fiche fetched |
| Reinforcement learning | **apprentissage par renforcement** | ⚠ list-level — same OQLF list, no individual fiche fetched |
| Transfer learning | **apprentissage par transfert** | FranceTerme new-terms article ✓ |
| Adversarial ML (AML) | **apprentissage antagoniste** | FranceTerme new-terms article ✓ |
| Large language model (LLM) | **grand modèle de langage (GML)** | FranceTerme new-terms article ✓ |
| Transformer | **transformeur** | FranceTerme new-terms article ✓ |
| Generative / foundation model | **modèle génératif** | FranceTerme new-terms article ✓ |
| Chatbot / conversational agent | **dialogueur** | FranceTerme new-terms article ✓ (French coinage for a conversational service derived from pretrained models) |
| Prompt | **instruction** | FranceTerme new-terms article ✓ |
| (Text) token | **jeton textuel** | FranceTerme new-terms article ✓ |
| Hallucination (of a model) | **hallucination d’IA** | ⚠ list-level — OQLF list via the companion pass; no individual fiche fetched |
| Algorithmic discrimination | **discrimination algorithmique** | ⚠ list-level — OQLF list via the companion pass; no individual fiche fetched |

**Bonus terms attested in the same FranceTerme article:** **modèle préentraîné** (*pretrained
model*), **génération automatique de texte / d’image / d’audio** (*AI text/image/audio
generation*), **modèle à bruit statistique** (*diffusion model*).

Project coinages (C1) keep their original spelling in French text and are owned by the
term-sheet, not this table.

Sources: <https://culture.fr/franceterme/terme/INFO948> ·
<https://culture.fr/franceterme/terme/INFO939> ·
<https://culture.fr/franceterme/terme/INFO946> ·
<https://culture.fr/franceterme/En-francais-dans-le-texte/Intelligence-artificielle-une-nouvelle-generation-de-termes>
· <https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/26552500/apprentissage-automatique>
· <https://www.oqlf.gouv.qc.ca/office/communiques/2026/20260615_vitrine_linguistique_reference_pour_les_questions_sur_le_francais.aspx>
(the OQLF-cited AI-term list the companion research pass carried — it is the attestation for the
four rows marked *list-level*: *apprentissage non supervisé*, *apprentissage par renforcement*,
*hallucination d’IA*, *discrimination algorithmique*. ⚠ It is a **list**, not a per-term fiche, and
it was not re-fetched here) · (education.gouv.fr *Journal officiel* page was **403-blocked**;
rerouted via culture.fr)

---

## 7. Idiom anti-patterns

**What this section is now, and what it used to be.** The previous revision shipped a
**general-purpose ESL idiom list** — *raining cats and dogs*, *break a leg*, *once in a blue
moon* — carried faithfully from the main dossier. That is not what §7 is for. The authoring
directive asks for the **stock phrases of educational and technical writing** (*step by step*,
*under the hood*), because those are the phrases this platform's copy actually contains: a
translator writing AI-course text will never need *il pleut des cordes* and got no help with
*under the hood*. The on-domain table below was sitting in the **companion research pass** the
whole time and had never been merged into any guide; this revision merges it.

**Provenance — how the rows were raised.** The companion pass delivered these rows **with no
per-row citation**: its idiom section opens with a sentence the research itself marks unsourced
(*"some stock phrases do have established idiomatic equivalents"*), and the only URL it carries
anywhere in that section is attached to a closing remark about style, not to the renderings. Rather
than ship that, **every ✅ was taken back to a source** — Le Robert, the OQLF's *Grand dictionnaire
terminologique*, the Wiktionnaire, and French-language technical documentation. The tier column
below records what was actually found. **Only `dictionary` rows may inform a §11 check**; `corpus`
rows evidence usage, not prescription; `⚠ craft` rows stay barred from tooling.

| English stock phrase | ✅ Idiomatic French | ❌ Literal calque to avoid | ✅ tier |
|---|---|---|---|
| step by step | **pas à pas** | *(none — see below)* | **dictionary** |
| under the hood | **sous le capot** (internals) · **en coulisses** (behind the scenes) | *(none — see below)* | **dictionary** |
| at a glance | **en un coup d’œil** | *à un regard* — ⚠ craft | **dictionary** + corpus |
| in the background | **en arrière-plan** | *dans le fond* — **real French, different meaning** ("au fond, à vrai dire") | dictionary (community) + corpus |
| from scratch | **à partir de zéro** | *depuis zéro* — attested in the same sense; **less idiomatic, not wrong** | corpus |
| keep in mind | **gardez à l’esprit** | *tenez dans l’esprit* — ⚠ craft | corpus |
| on the fly | **à la volée** | *sur la mouche* — ⚠ craft | **dictionary** + corpus |
| rule of thumb | **règle empirique** · **au doigt mouillé** (informal) | *règle du pouce* — calque, non idiomatic; **no authority rules against it** | **dictionary** (OQLF GDT) |
| make sure | **vérifiez que / assurez-vous que** | *faites sûr que* — ⚠ craft | corpus |
| break down (a concept) | **décomposer / détailler** | *casser vers le bas* — ⚠ craft | **dictionary** + corpus |
| set up | **configurer / mettre en place** | *mettre en haut* — ⚠ craft | **dictionary** + corpus |
| plug and play | **prêt à l’emploi** | *brancher et jouer* — exists only as an etymological gloss | dictionary (community) |
| it makes sense | **ça a du sens / c’est logique** | *ça fait du sens* — **déconseillé, with a ruling** | **dictionary** (OQLF) |

**The ✅ column, sourced.** Quotes below are verbatim from the URLs in the Sources footer:

- **pas à pas** — Le Robert, entry *pas*: "Pas à pas, à pas comptés : lentement, avec précaution."
  The Wiktionnaire entry glosses it "(Sens figuré) Doucement, progressivement" and gives the English
  equivalent *step by step* directly. Corpus: French MDN — "Vous développerez ici, pas à pas, un jeu
  simple consistant à faire deviner un nombre."
- **sous le capot / en coulisses** — Le Robert, entry *capot*: "Regarder sous le capot, au figuré
  observer le fonctionnement de qqch." The Wiktionnaire has *sous le capot* as a headword tagged
  **(Informatique)**: "Dans son fonctionnement interne ; concernant la partie non visible pour
  l’utilisateur" — with *under the hood* as the English equivalent. Le Robert's *coulisse* carries
  the separate figurative sense "Le côté caché, secret."
- **en un coup d’œil** — Le Robert, entry *œil*: "Coup d’œil : regard rapide." (the full *en un*
  form is corpus-tier: the FAO publishes its *at a glance* country pages in French as "Le pays en un
  coup d’œil").
- **en arrière-plan** — Wiktionnaire, tagged (Informatique): "En parlant d’un programme, tournant de
  manière invisible pendant qu’un autre program est visible et utilisé activement sur l’appareil."
  Corpus: French MDN — "tant que la revalidation de la réponse a lieu en arrière-plan".
- **à partir de zéro** — corpus only; no dictionary entry was found for the fixed string. French MDN
  writing guide: "écrire chaque article à partir de zéro si le temps le permet."
- **gardez à l’esprit** — corpus only. CNRTL's *esprit* article carries the neighboring locution
  *avoir qqc. présent à l’esprit* but not *garder à l’esprit*; the phrase itself is abundant in
  French MDN ("les lignes directrices générales à garder à l’esprit").
- **à la volée** — Le Robert, entry *volée*: "À la volée ; à toute volée : en faisant un mouvement
  ample, avec force." The computing sense is corpus-fixed: French MDN describes JavaScript as
  "interprété (ou compilé à la volée)".
- **règle empirique** — OQLF *Grand dictionnaire terminologique*, which pairs it with the English
  term *rule of thumb* on the same fiche: "formule mathématique élaborée à partir du rapport entre
  le prix et certaines variables, et reposant sur l’expérience, l’observation, le ouï-dire".
- **décomposer** — Le Robert: "Diviser, séparer en éléments constitutifs." · **configurer** — Le
  Robert, with the exact IT sense: "Informatique Programmer (un élément d’un système) pour assurer
  son fonctionnement selon un certain mode. Configurer une imprimante."
- **prêt à l’emploi** — Wiktionnaire, tagged (Informatique): "Se dit d’un équipement électronique
  utilizable dès sa connexion", listing *plug-and-play* as the English. ⚠ The entry credits
  **FranceTerme / DGLFLF** for the term; that fiche could **not** be fetched (culture.fr 404'd on
  every URL pattern tried), so the official attribution is reported **as stated by the Wiktionnaire**
  and is not independently verified.
- **ça a du sens / c’est logique** — the OQLF fiche recommends both by name: "on privilégiera,
  outre l’emploi de avoir du sens, des expressions telles que être logique, être sensé, être une
  bonne idée, tenir debout."

**⚠ The ❌ column is craft, and this is the column that matters most.** A wrong calque is what
actually stops a translator making the error — and it is the least attestable thing in the table,
because dictionaries record what people write, not the plausible-looking forms they might write.
**No French anglicism or *calque* advice page was found documenting any of these forms as an error,
with exactly one exception (the last row).** What could be established is narrower: *tenez dans
l’esprit*, *faites sûr que*, and *brancher et jouer* return **zero** occurrences in French Wikipedia
article space — they are not phrases anyone writes, which makes them safe to print but weak as
warnings; *sur la mouche*, *casser vers le bas*, and *à un regard* occur only in unrelated syntax.
Read this column as "not idiomatic", never as "documented mistake", and **do not promote it into a
§11 check**.

**One row is genuinely documented — cite it and nothing else as a rule.** The OQLF has a published
*emprunt déconseillé* fiche for *faire du sens*: "L’emploi de l’expression **faire du sens** …
est déconseillé", explained as "l’influence de l’anglais make (dans to make sense), qu’on a traduit
et qu’on a substitué au verbe avoir dans avoir du sens", with the exact wrong string shown:
"Ce que tu dis me semble logique. (et non : Ce que tu dis **fait du sens**.)" That is the one ❌ in
this table an automated check may act on.

**Three ❌ cells were removed or downgraded, because they condemned correct French.**

- **step by step** previously flagged ❌ *étape par étape*. It is ordinary, high-frequency
  educational French — French MDN alone uses it repeatedly ("Dans ce tutoriel étape par étape, vous
  implémenterez un jeu en utilisant du pur JavaScript"; "déroulons l’algorithme de la cascade étape
  par étape"). The cell is gone; *pas à pas* remains the better default, not the only permitted
  form.
- **under the hood** was **inverted**. The previous revision put *en coulisses* in ✅ and
  *sous le capot* in ❌ — but *sous le capot* is a Le Robert figurative locution **and** a
  Wiktionnaire headword tagged (Informatique) glossing precisely "under the hood", and it appears in
  Mozilla's own French release notes ("De nombreux changements sous le capot"). Both now sit in ✅
  with the distinction spelled out: *sous le capot* is the internal machinery, *en coulisses* is
  what happens out of sight. They are **not** interchangeable, which is the useful lesson the row
  was previously hiding.
- **from scratch** softened *depuis zéro* from wrong to less idiomatic: French Wikipedia uses it in
  exactly the from-scratch sense ("un moteur libre compatible avec GoldSrc a été créé depuis zéro
  par des développeurs amateurs").
- **rule of thumb** softened *règle du pouce*. It is a calque and *règle empirique* is the right
  default — but the Canadian terminology bank does record *règle du pouce* as a French term (in one
  historical family-law record), and **no OQLF *emprunt déconseillé* fiche exists for it**. French
  Wikipedia keeps the English phrase as its own article title and offers **au doigt mouillé** as the
  French expression, now added to ✅ for the informal register.

**Register check — the table agrees with §4.** The imperatives arrive in the **vous** form
(*gardez*, *vérifiez*, *assurez-vous*), which is the recorded register, and all three are attested
in that form (French MDN: "Vérifiez que votre HTML est aussi sémantique que possible";
"assurez-vous que : les pages sont cohérentes"). If a row is ever restated in the *tu* form, that is
a register defect, not a stylistic variant.

**Dropped rows from the earlier general-idiom table, and why that is not lost work.** Of the twelve
general idioms the previous revision carried, only two were sourced at all: *il pleut des cordes*
(renestance.com) and *ça a du sens*
(OQLF). The second is a genuine stock phrase of explanatory writing and is kept above with its
citation; the first and the ten unsourced rows are correct French but off-brief, and are dropped
rather than re-homed. Two directional observations from that table are worth keeping in a
reviewer's head even so: French often **swaps the image rather than the words** (*avoir d’autres
chats à fouetter*, not fish), and **some images transfer intact** — so a rendering that looks like
a calque is occasionally the right answer, and over-correction is a real failure mode.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources:
<https://vitrinelinguistique.oqlf.gouv.qc.ca/23499/les-emprunts-a-langlais/emprunts-syntaxiques/lemprunt-deconseille-faire-du-sens>
(*faire du sens* déconseillé — the one ruling in the table, ❌ included) ·
<https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/507297/regle-empirique>
(GDT fiche pairing *règle empirique* with *rule of thumb*) ·
<https://dictionnaire.lerobert.com/definition/pas> · <https://dictionnaire.lerobert.com/definition/capot> ·
<https://dictionnaire.lerobert.com/definition/coulisse> · <https://dictionnaire.lerobert.com/definition/oeil> ·
<https://dictionnaire.lerobert.com/definition/volee> · <https://dictionnaire.lerobert.com/definition/decomposer> ·
<https://dictionnaire.lerobert.com/definition/configurer> ·
<https://fr.wiktionary.org/wiki/pas_%C3%A0_pas> · <https://fr.wiktionary.org/wiki/sous_le_capot> ·
<https://fr.wiktionary.org/wiki/en_arri%C3%A8re-plan> ·
<https://fr.wiktionary.org/wiki/pr%C3%AAt_%C3%A0_l%E2%80%99emploi>
(community-tier dictionary — recorded as such, not laundered; its FranceTerme attribution could
**not** be verified, culture.fr 404'd) · corpus rows quoted from French MDN
(<https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting>,
<https://developer.mozilla.org/fr/docs/Web/JavaScript>,
<https://developer.mozilla.org/fr/docs/MDN/Writing_guidelines/Writing_style_guide>) and
<https://fr.wikipedia.org/wiki/Rule_of_thumb> (*au doigt mouillé*) — corpus tier: French technical
and encyclopedic prose, **not** a normative source ·
<https://renestance.com/blog/top-10-french-weather-idioms> (the dropped *il pleut des cordes* row —
retained here so the evidence trail for the deletion stays readable) · the rows themselves came from
the **companion desk-research pass on the same brief**, which supplied them **without per-row
citations**; the only URL its idiom section carries,
<https://en.wikipedia.org/wiki/French_language>, is attached to a closing style remark and does
**not** underwrite anything · **the ❌ column remains ⚠ craft** apart from the OQLF row, and is
barred from §11; native-speaker confirmation still pending for every row.

---

## 8. Simplified-language pendant (`fr-easy`)

**Strong support:** unlike most languages in this kit, French **has a named, organized
plain-language tradition** — **FALC (Facile à Lire et à Comprendre)** — sourced below to Unapei
and fr.wikipedia with verbatim quotes. The subsections follow the kit's uniform 8a–8g order, so a
translator moving between languages finds the same seven answers in the same seven places. What
§8c–§8d add on top of FALC is the layer FALC itself does not supply: **a count of which words
French easy-read publishing actually prints**, and the list of "simplifications" that count kills.

### 8a. The standard that does exist ✅

**Tradition & name.** FALC is the French implementation of Inclusion Europe's easy-to-read
guidelines. fr.wikipedia: *"Le FALC est issu d'un partenariat associant huit pays européens de
2007 à 2009, Pathways"*; and on the European origin: *"En 1988, en Europe, la Ligue
internationale des associations pour les personnes handicapées mentales (ILSMH) devenue Inclusion
Europe a développé les Directives européennes."*

**Maintaining organizations (France).** Adapted and maintained in France by **Unapei** (with
**Nous Aussi**, the self-advocates' association). fr.wikipedia: *"Le FALC est décrit dans un
document publié en France par l'Union nationale des associations de parents, de personnes
handicapées mentales et de leurs amis (Unapei)."* The reference document is Unapei's
*"L'information pour tous : Règles européennes pour une information facile à lire et à
comprendre."*

**Is it an official standard?** **Method with European consensus and a recognizable logo, but
not a binding legal norm** (unlike an ISO standard). The **single non-waivable rule** is
participation of the target readers. falc.unapei.org: *"La première des règles à laquelle on ne
peut déroger si l'on veut que son texte soit du FALC est celle de l'implication des personnes en
situation de handicap intellectuel."*

**Quantitative / concrete FALC rules (verbatim).** From falc.unapei.org: *"Faire des phrases
simples et courtes"*; *"Utiliser des mots simples, faciles à comprendre"*; *"Expliquer les mots
difficiles"*; *"Utiliser une police bâton sans empattement"*; *"Ecrire suffisamment grand (au
minimum corps 14)"*; *"Ne pas mettre trop de texte sur une page"*; *"Aligner le texte à gauche"*;
*"Utiliser des images pour faciliter la compréhension."* From fr.wikipedia: *"phrases courtes
(idéalement, une phrase tient sur une ligne)"*; *"pas de métaphores, car difficiles à
comprendre"*; *"utiliser des phrases actives plutôt que des phrases passives"*; *"mots simples et
précis ; attention aux pronoms « je », « lui » ou « il »."*

**Operational rules for `fr-easy`:** one idea per sentence (ideally one line); **body ≥ 14 pt**;
**sans-serif** (*police bâton sans empattement*); **left-aligned**; **active voice**; **no
metaphors**; **explain hard words**; **support with images**. These are FALC's own quantified
rules — where they are more specific than the kit's base plain-language rules in
[accessibility-workflow](../accessibility-workflow.md), **FALC's numbers apply** (e.g. the
≥14 pt body and sans-serif requirement); otherwise `fr-easy` inherits the kit's base rules.

### 8b. Name the axis — the one thing FALC states but never defines

FALC's lexical rule is a single line: *"Utiliser des mots simples, faciles à comprendre"*, backed
by *"Expliquer les mots difficiles"*. **It publishes no list of which French words are which.**
That gap is the whole reason §8c exists: the rule is real and quotable, the axis it names is not
operationalized anywhere in the sourced material, and a translator left alone with *"mots
simples"* will fall back on the intuition that the long Latinate verb is the hard one.

The candidate axis for French is the **register ladder** (*soutenu* → *courant* → *familier*)
crossed with **nominalization** — the administrative habit of turning verbs into `-tion` nouns.
⚠ **Standard French grammar, not separately fetched**, and deliberately treated here as a
*hypothesis to be counted* rather than as a rule. The sourced part is FALC's own preference for
active over passive: *"utiliser des phrases actives plutôt que des phrases passives"*.

**Complex → everyday word table (⚠ editorial).** These follow FALC's *"mots simples"* rule but
are an **editorial application**, not a fetched published list. **§8c measures every row of it,
and §8d lists the rows the measurement breaks.**

⚠ **One row was recorded as contested, and §8c settles it.** The companion research pass carries
its own simplification list and runs one pair **the other way round**: it gives formal
*information* → everyday **renseignement**, where the table below gives *renseignements* →
**informations**. Neither list is a fetched published substitution list. **The measurement backs
the table below**: *renseignements* is roughly six times rarer than *informations* in every corpus
counted, in both registers (§8c). The row is no longer unsettled — see §8d.

| Formal / complex | Everyday French |
|---|---|
| utiliser | se servir de |
| effectuer / réaliser | faire |
| débuter | commencer |
| acquérir | acheter / obtenir |
| nécessiter | avoir besoin de |
| autoriser | permettre / laisser |
| renseignements | informations (or: infos) |
| dysfonctionnement | problème / panne |
| ultérieurement | plus tard |
| s’abstenir de | ne pas … / éviter de |

### 8c. Measure the axis

| Corpus | What it is | Size |
|---|---|---|
| **A — plain (FALC)** | Adult **easy-read** news and explainers from two French FALC publishers: **falc.apajh.org** (21 posts, 2025-04 → 2025-10) and **falc.unapei.org** (53 posts, 2020-02 → 2026-07) | 74 posts, **19,438 word tokens** |
| **B — standard** | **apajh.org** association news — the **same publisher as the first half of A** | 357 posts, 2018-05 → 2026-07, **125,183 tokens** |
| **Cross-check 1** | **1jour1actu.com** — daily news written for readers aged ~8–13 (Milan Presse); a *different* plain register with far more data | 390 articles (the 400 most recent, fetched 2026-07-27), **106,547 tokens** |
| **Cross-check 2** | **fr.vikidia.org** (encyclopedia for ~8–13) against **fr.wikipedia.org** — `insource:` **page** hits, namespace 0, per 1,000 content pages | 45,749 vs 2,771,427 articles |

**Method.** A and B and cross-check 1 were pulled as JSON through each site's WordPress REST API
(`/wp-json/wp/v2/posts`), stripped of HTML **and of page-builder shortcode residue** locally, then
case-folded and tokenized on Unicode letter runs. Rates are **per 100,000 tokens**, raw counts in
brackets. Verb rows are **lemma families** (all inflected forms on the stem).

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **The plain corpus is small.** 19,438 tokens means **one occurrence ≈ 5.1 per 100,000**. Any
>    row resting on fewer than ~8 raw tokens is a hint, not a finding, and is marked.
> 2. **The strict single-publisher control is smaller still.** APAJH alone gives **3,111 FALC
>    tokens** against 125,183 standard tokens. Unapei's FALC feed is pooled into A to buy usable
>    power, at the cost of mixing two houses on the plain side. Where APAJH alone and the pooled
>    corpus disagree, the guide says so.
> 3. **Topic differs.** FALC output is explanatory (rights, services, procedures); apajh.org is
>    association news (congress, federation, partnerships). Procedural vocabulary — *utiliser*,
>    *obtenir*, *information* — is inflated in A for reasons that are partly genre. **The two
>    cross-checks exist precisely to separate genre from register**, and they earn their keep.
> 4. **Frequency is not comprehension.** No French comprehension study was located. FALC's own
>    validity test is reader participation (§8a), not word counts.

**The §8b table, measured.**

| Pair | A — FALC /100k (n) | B — standard /100k (n) | Children's news /100k | Vikidia vs Wikipedia, per 1k | Verdict |
|---|---|---|---|---|---|
| ultérieurement → plus tard | **0.0** | **0.0** | 0.0 | **0.42 vs 4.78** | ✅ strongest row — 11× rarer in the children's encyclopedia |
| autoriser → laisser | autoriser **0.0**; laisser **0.0** | autoriser **4.0** (5); laisser **12.0** (15) | laisser 19.7 | autoriser **0.48 vs 1.02**; laisser **17.29 vs 14.49** | ✅ drop *autoriser*; *laisser* is the form that rises |
| acquérir → acheter | acquérir **10.3** (2) ⚠ | acquérir **3.2** (4) | acquérir **0.0** | acquérir **2.01 vs 3.43**; acheter **8.35 vs 5.18** | ✅ on both cross-checks; ⚠ the 2 FALC tokens point the other way |
| dysfonctionnement → problème | **0.0** | **2.4** (3) | 0.0 | **0.50 vs 0.85** | ✅ for dropping *dysfonctionnement*; *problème* itself does not behave as a plain marker (§8d) |
| débuter → commencer | débuter 10.3 (2) ⚠; commencer 15.4 (3) ⚠ | débuter 7.2 (9); commencer 8.0 (10) | commencer 28.2 | débuter **1.03 vs 2.04**; commencer 9.33 vs 8.92 | ✅ weak — *débuter* halves, *commencer* is flat |
| renseignements → informations | renseignement 5.1 (1); information **164.6** (32) | renseignement 0.8 (1); information 22.4 (28) | information 26.3 | renseignements **2.64 vs 5.02**; informations 16.46 vs 28.63 | ✅ **direction settled** — *renseignements* is ~6× the rarer word in every corpus |
| nécessiter → avoir besoin de | nécessiter **15.4** (3); besoin 133.8 | nécessiter **13.6** (17); besoin 113.4 | nécessiter **1.9** | nécessiter **0.61 vs 0.87** | ⚠ flat in the pair; only the children's registers drop it |
| effectuer / réaliser → faire | effectuer 5.1 (1); réaliser **51.4** (10); *faire* **221.2** | effectuer 1.6 (2); réaliser **28.8** (36); *faire* **308.3** | *faire* 527.5; réaliser 49.7 | effectuer 6.36 vs 7.69; réaliser **14.19 vs 19.58** | 🔴 mixed — see §8d |
| utiliser → se servir de | utiliser **72.0** (14); se servir **46.3** (9) | utiliser **10.4** (13); se servir **7.2** (9) | utiliser 73.2 | utiliser **23.52 vs 16.43**; se servir **2.51 vs 1.23** | 🔴 **backwards** — see §8d |
| s'abstenir de → ne pas | **0.0** | **0.0** | 0.0 | — | ❌ untestable — neither side occurs |

### 8d. 🔴 The do-NOT-simplify list — where the measurement contradicts the instinct

**This is the highest-value table in §8**, and for French it removes or qualifies four of the ten
rows above.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**utiliser** → **se servir de**~~ | The instinct is exactly backwards. *utiliser* is **7× commoner in FALC text than in the same association's standard prose (72.0 vs 10.4)** and **1.4× commoner in the children's encyclopedia than in the adult one (23.52 vs 16.43 per 1k)**. Meanwhile *se servir de* — the "plainer", more Germanic-feeling periphrasis — is **9× rarer than *utiliser*** in that same children's encyclopedia (2.51 vs 23.52). **Swapping a common Latinate verb for a rarer phrasal one is the classic Romance mistake, and this is it in one row.** |
| ~~assume **faire** is what easy French reaches for~~ | In adult easy-read French *faire* is **less** frequent than in ordinary association prose: **221.2 vs 308.3 /100k**. It does rise sharply in *children's* news (527.5) — so "use *faire*" is advice about writing for children, not about writing plainly for adults. |
| ~~**réaliser** → **faire** as a blanket rule~~ | The two measurements disagree: *réaliser* is **1.8× commoner in FALC** than in standard prose (51.4 vs 28.8) but **rarer in the children's encyclopedia** than the adult one (14.19 vs 19.58 per 1k). ⚠ unsettled — do not apply it blindly in either direction. |
| ~~**autoriser** → **permettre**~~ | Half of the row is wrong. Dropping *autoriser* is supported; **but *permettre* is itself the more formal member** — **19.30 vs 30.73 per 1k**, i.e. *less* frequent in the children's encyclopedia — while *laisser* rises (17.29 vs 14.49). **Rewrite to *laisser*, not to *permettre*.** |
| ~~treat **obtenir** as a hard word~~ | Parity in the cross-check (**19.63 vs 20.16** per 1k) and **5.7× commoner in FALC than in standard prose** (77.2 vs 13.6). A learned-looking Latinate verb that easy-read French uses freely. |
| ~~**dysfonctionnement** → **problème** as a plainness gain~~ | Dropping *dysfonctionnement* is right (0.0 in FALC, 0.50 vs 0.85 per 1k). But *problème* is **lower** in FALC than in standard prose (5.1 vs 11.2) and at **parity** in the encyclopedia pair (19.02 vs 20.75). You gain by deleting the rare word, not by promoting *problème*. |
| ~~"fix" **information** to **renseignement**~~ | The companion pass's direction is **refuted**. *renseignements* runs **2.64 vs 5.02** per 1k (Vikidia vs Wikipedia) and **1 token in 19,438** of FALC; *informations* runs **16.46 / 28.63** and **164.6 /100k** in FALC. ⚠ Note the honest wrinkle: *informations* is itself *lower* in the children's encyclopedia than the adult one, so this settles **which of the two words to pick**, not that *information* is a plain-language word. |
| ~~reach for the shorter or more "native-feeling" option on principle~~ | The general form of the trap: in French the plainer-feeling alternative is usually the **rarer** one. *se servir de* (2.51/1k) against *utiliser* (23.52); *renseignements* (2.64) against *informations* (16.46). **Rarity, not etymology, is what makes a word hard.** |

> **→ The rule that follows.** In French, **do not simplify by etymology or by word length.**
> Change a word only where §8c shows the plainer register actually uses the replacement more —
> which, of ten candidate rows, is four confirmed, one settled-by-direction, two qualified, and
> three refuted or untestable. The remaining leverage is in FALC's **structural and typographic**
> rules (§8f), which are sourced, quantified, and much stronger than any word list.

### 8e. 🔑 The address decision — `fr-easy` keeps **vous**, and the measurement says why

> **Decision, recorded so that nobody "fixes" it: `fr-easy` uses `vous`, exactly as `fr` does
> (§4). It does NOT switch to `tu`.**

- ✅ **Vous pouvez commencer ici.** — in `fr` and in `fr-easy` alike
- ❌ **Tu peux commencer ici.** — *tu* is not easier, it is only more familiar

**Why, and this one is measured rather than asserted.** French makes the usual finding testable,
because two different "plainer" registers can be counted side by side:

| Corpus | `tu` /100k | `toi` /100k | `vous` /100k |
|---|---|---|---|
| **FALC — adult easy-read** | **0.0** (0 tokens) | **0.0** | **97.7** (19) |
| **1jour1actu — news for ages 8–13** | **441.1** (470) | **85.4** (91) | 46.0 |
| **apajh.org — adult standard** | 6.4 (8) | 4.0 | 167.0 |

**In 19,438 words of French easy-read publishing, `tu` occurs zero times.** The form that
collapses to *tu* is not the *simplified* register — it is the *children's* register. Address in
French therefore tracks **the reader's age, not the text's difficulty**, and `fr-easy` serves
adults who need plain language, not children. Dropping to *tu* would be exactly the condescension
the variant exists to avoid.

This is **consistent with §4**, which records **vous** as binding for `fr` *and* `fr-easy` and
already notes the children/teens exception as "noted, not adopted". §8c supplies the evidence §4
did not have. (FALC's own caution about *« je », « lui », « il »* is about **clear referents**, not
register — keep referents explicit.)

### 8f. What the pendant is built on — FALC's structure and typography first, vocabulary last

In order of leverage for French:

1. **FALC's structural and typographic rules. This is the main lever, and it is the sourced one.**
   One idea per sentence, ideally one line; **body ≥ 14 pt**; **sans-serif**; **left-aligned**;
   **active voice**; **no metaphors**; **images in support**. All quoted verbatim in §8a.
2. **Explain the hard word rather than replace it** — FALC's *"Expliquer les mots difficiles"* is
   a rule about *glossing*, not about substitution, and §8d shows why that ordering is right.
3. **Vocabulary substitution last, and only the rows §8c confirms** — drop *ultérieurement*,
   *autoriser*, *acquérir*, *dysfonctionnement*; prefer *informations* over *renseignements*.
   Leave the rest alone.

**Base rules this overrides.** Where FALC is **more specific** than the kit's base
simplified-language rules in [accessibility-workflow](../accessibility-workflow.md), **FALC's
numbers win** — the ≥14 pt body size and the sans-serif requirement have no counterpart in the
base rules and are binding for `fr-easy`. Everything else (one idea per sentence, everyday words,
say what *is* not what *isn't*, the same word for the same thing, a one-line "what is this"
opener, a consistent literal tone) is **inherited unchanged** — with the base rule "use everyday
words" now **bounded by §8d** rather than by intuition.

**Term-preservation rule (restated, binding).** In `fr-easy`, **keep the technical term and
explain it** — never swap in a folksy stand-in. Use the same term as the base variant (e.g. keep
**intelligence artificielle**), then *"cela veut dire : …"*, then a concrete example. This is
FALC's *"Expliquer les mots difficiles"* applied to the domain vocabulary of §6.

### 8g. What is still open

1. **FALC's non-waivable rule cannot be met.** *"La première des règles à laquelle on ne peut
   déroger … est celle de l'implication des personnes en situation de handicap intellectuel."*
   This project cannot run that validation. `fr-easy` is therefore **FALC-informed, not FALC** —
   and must never carry the FALC logo or the claim.
2. **The plain corpus is thin and mixes two houses.** 19,438 tokens, of which only 3,111 come from
   the publisher that also supplies the standard corpus. A larger single-publisher FALC feed would
   settle the *réaliser* and *acquérir* rows that currently rest on 2 tokens each.
3. **Two rows stay contested:** *réaliser → faire* (the two measurements point opposite ways) and
   whether *informations* is genuinely plain or merely the commoner of two options.
4. **Regional FALC is unmeasured.** Both plain publishers are French. Belgian, Swiss, and Québécois
   easy-read practice — and any Québec-specific vocabulary preference — were not counted (§9).
5. **No comprehension evidence.** Everything in §8c is frequency. Whether the measured words are
   *understood* better by FALC's audience was not established.
6. **The typographic rules were not verified against the kit's rendering.** FALC's ≥14 pt and
   sans-serif requirements are recorded here but their implementation belongs to the design layer,
   and no check currently enforces them.

Sources: <https://falc.unapei.org/quest-ce-que-le-falc/les-regles-du-falc/> ·
<https://fr.wikipedia.org/wiki/Facile_%C3%A0_lire_et_%C3%A0_comprendre> ·
<https://www.unapei.org/> (*L'information pour tous*) ·
<https://www.info.gouv.fr/accessibilite/la-methode-facile-a-lire-et-a-comprendre-falc>
(the government FALC page the companion research pass cites for its own simplification list — the
list that contests the *information / renseignement* pair; ⚠ not re-fetched here, and the companion
pass labels its own pairs "editorial simplifications rather than fixed dictionary substitutions") ·
(the complex→everyday word pairs are **⚠ editorial** application of the *mots simples* rule, not a
fetched list) ·
**Plain corpus (§8c)** — <https://falc.apajh.org/> and <https://falc.unapei.org/>, fetched via
their `…/wp-json/wp/v2/posts` endpoints ·
**Standard corpus (§8c)** — <https://www.apajh.org/> via <https://www.apajh.org/wp-json/wp/v2/posts> ·
**Children's-news cross-check (§8c)** — <https://www.1jour1actu.com/> via
<https://www.1jour1actu.com/wp-json/wp/v2/posts> ·
**Encyclopedia cross-check (§8c)** — `insource:` page hits and site statistics from
<https://fr.vikidia.org/w/api.php> and <https://fr.wikipedia.org/w/api.php> (Vikidia is Community
tier — a volunteer children's encyclopedia, not a French language authority; only aggregate hit
counts were requested, no article text was collected). The §8c/§8d/§8e frequencies are this
guide's **own count**, reproducible from the URLs above.

---

## 9. Regional variation

**Community-tier** (fetched from fr.wikipedia; the Belgium/Switzerland numerals are common
knowledge, not separately fetched). France vs Québec vs Belgium/Switzerland differences are
**overwhelmingly lexical and phonetic, with almost no grammatical divergence** in formal writing.
fr.wikipedia (Français québécois): *"À l'écrit formel, le français québécois est syntaxiquement
presque identique au français normalisé et ne s'en distingue que marginalement sur le plan
lexical."*

**Differences table.**

| Axis | France | Québec | Belgium / Switzerland |
|---|---|---|---|
| Formal written grammar | shared standard | *"syntaxiquement presque identique"* to France | shared standard |
| Numerals 70 / 90 | soixante-dix / quatre-vingt-dix | soixante-dix / quatre-vingt-dix | **septante / nonante** (⚠ common knowledge; CH also *huitante/octante* for 80 in some cantons) |
| Anglicism tendency | borrows more from English | prefers French alternatives | mixed |
| Example split | **week-end** | **fin de semaine** | — |
| Authority | Académie française / FranceTerme | OQLF | (regional bodies) |

Illustrative lexical splits: **week-end (France) / fin de semaine (Québec)**; **char** is current
and neutral in Québec but reads as very regional in France (dossier search summary). ⚠ the
septante/nonante numerals are common knowledge, not separately fetched.

**What "neutral" / "international" French is.** There is **no officially codified pan-francophone
standard**; *"français international"* is a contested notion invoked mainly to mean "align with
European written French." fr.wikipedia notes exogénistes *"se retranchent souvent derrière la
notion de 'français international'"* (a theoretical norm, not a single documented usage), and the
OQLF works alongside the Académie française while respecting Québec particularities.

**Neutrality strategy (explicit).** For a platform serving all francophone regions:
1. Write **formal, European-French-leaning "neutral" French** — Québec written French is
   *"syntaxiquement presque identique"* to it, so a single build serves both.
2. Avoid **France-only slang and Québec-only regionalisms** in core UI / instructional copy.
3. Spell out numbers unambiguously where **70 / 90** could confuse (septante/nonante vs
   soixante-dix/quatre-vingt-dix).
4. Prefer the **FranceTerme / OQLF official term** when both agree (they usually do for AI
   vocabulary, §6).
5. **Parameterize** region-specific variants (currency, date wording, *week-end / fin de
   semaine*) only if you ship region-specific builds.

⚠ this neutrality recommendation is **editorial**, grounded in the sourced Québec-vs-France quote.

Sources: <https://fr.wikipedia.org/wiki/Fran%C3%A7ais_qu%C3%A9b%C3%A9cois> (Québec-vs-France —
community-tier fr.wikipedia) · (Belgium/Switzerland numerals ⚠ common knowledge, not fetched;
neutrality strategy ⚠ editorial)

---

