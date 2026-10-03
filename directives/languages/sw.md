<!-- base -->
# lang-sw — Swahili (Kiswahili) — language guide

> **Setup & sources live in [`sw.setup.md`](sw.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Kiswahili / Swahili. The written standard this guide targets is
**Kiswahili Sanifu (Standard Swahili)**.
**BCP 47 code (base):** `sw`.
**BCP 47 code (simplified variant):** `sw-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`sw-x-simple`), but the
kit token `sw-easy` is the one that counts here.
**Speaker reach:** roughly **150–200 million** total speakers when first- and second-language
users are counted, of which about **5–10 million** are first-language speakers (⚠ approximate —
summary figures, not a single census/Ethnologue count; totals vary widely by source and by how
L2 speakers are counted). Official or national language in **Tanzania, Kenya, Uganda, the
Democratic Republic of the Congo, and Rwanda**; a working language of the **African Union**, and
(per the cited UNESCO article, ⚠ not fetched this pass) recognized at UNESCO as an official
language of its General Conference in 2025.
**Script + direction:** **Latin script** (modern standard use); **left-to-right**. Historical
Arabic-script writing (Ajami) exists but native web content is overwhelmingly Latin-based, so
this guide treats Latin as *the* script. No bidi, no shaping, no conjuncts.
**Status:** planned — authored from **external desk research** (a standard round-1 pass plus a
**deep round-2 follow-up** targeting the thin sections). Covers base `sw` and the `sw-easy`
pendant. **BAKITA's authority was verified against bakita.go.tz this pass; the regional East
African Kiswahili Commission (eakc.go.ke) domain did not resolve in verification and ships with a
⚠ URL-unverified marker (§2).** A later pass took the **§3 nested-quotation rule** to an authority
hunt (BAKITA, EAKC, the Taifa Leo language column — all recorded there by name and outcome) and,
failing that, to a **20-article usage census**; and gave **§8** the noun-class/agglutination axis it
had been missing. **Not yet reviewed by a fresh model against the cited sources, and
not yet reviewed by a native speaker** — per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records both gaps honestly. This guide is
the intended **form precedent for the kit's resource-poor tier** (Hausa, Tagalog, Punjabi,
Marathi, Telugu): its value is in showing how to render *genuine absences* — no canonical AI/ML
terminology, no codified plain-language standard — as honest, complete answers rather than padded
gaps.
**Easy or hard for this kit:** typographically **easy** — Latin script, LTR, whitespace-separated
words, ordinary line breaking, no shaping engine, and no native-digit system. The hard parts are
**grammatical, not visual**: pervasive **noun-class concord** (agreement propagates onto verbs,
adjectives, possessives, demonstratives) and **agglutinating verb morphology** (subject, tense,
object, and derivation pack into one word) — a naive English calque breaks on both. And the
single biggest content risk is **terminology**: a handful of core ICT terms are settled, but the
attested set is **small** — it stops at e-mail, internet, and computer — and **no authoritative
Swahili AI/ML glossary exists** (§6). Both are real absences the translator must manage, not a
lookup, and §6 names no house term where the sources name none.

Sources: <https://www.britannica.com/topic/Swahili-language> ·
<https://www.bakita.go.tz/> · <https://www.unicode.org/cldr/charts/latest/summary/sw.html>

---

## 1. Header block

See above. One-line orientation: Swahili is a **Bantu, SVO, LTR** language written in **Latin
script** with a shared written standard (**Kiswahili Sanifu**) across East Africa; the
localization risks concentrate in **noun-class agreement, verb agglutination, and the absence of a
canonical AI/ML terminology set** — not in script, direction, or digits.

---

## 4. Grammar for translators

**Word order.** Swahili is **SVO** (Subject–Verb–Object), like English at the clause level — so
gross word order rarely breaks. The breakage happens *inside* words, through agreement and verb
morphology.

**Register — and the project's recorded choice.** Educational and official materials
conventionally use **Kiswahili Sanifu (Standard Swahili)**: the neutral, standard written register,
avoiding urban code-mixing (e.g. Sheng), regional slang, and heavily religious or community-coded
phrasing. Britannica supports the high-level claim that Swahili serves administration and primary
education across Tanzania and Kenya, which underpins this register at a general level.

> **Register decision (human-gate): Kiswahili Sanifu (Standard Swahili) — taken and recorded.**
> *(Deliberate exception to the peer guides' shape: Swahili has **no T/V politeness tier and no
> grammatical gender**, so there is no address-form choice to gate. What was gated here is the
> **variety** — standard vs regional/code-mixed — not a formality level.)* Selected as the
> base register for `sw` and `sw-easy` — the standard written form used in East African education
> and administration, neutral across regions, no Sheng/slang, no dialectal or sectarian markers.
> **This is a recorded convention, NOT a directive documented by BAKITA or the EAKC:** the research
> could source the register only to Britannica-tier material, not to a council ruling. It is the
> right working default and is **binding for the platform**, but it must not be *overclaimed* as an
> academy-mandated standard. The quality argument is
> unambiguous here; binding for all `sw`/`sw-easy` copy. What is settled is the *choice*; the weak
> sourcing above stands (convention, not a council directive).
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

The features that break a naive EN/DE → SW translation:

**(1) Noun-class concord (the central feature).** Swahili nouns fall into **classes** (traditionally
numbered), and the class **propagates agreement** onto adjectives, verbs, possessives, and
demonstratives. An English adjective is invariant; a Swahili adjective must **carry the noun's class
prefix**.

- ✅ **kitabu kikubwa** — "big book" (*kitabu* is class 7 `ki-`; the adjective takes **ki-**).
- ✅ **vitabu vikubwa** — "big books" (class 8 `vi-`; adjective takes **vi-**).
- ❌ **kitabu kubwa** / **vitabu kubwa** — bare adjective stem with the concord prefix dropped.
  *(illustrative wrong form — constructed to show a dropped-concord calque; the correct forms
  above are from the research, the starred wrong forms are correct-form-only illustrations.)*

**(2) Verb agglutination — subject, tense, object, derivation in one word.** The Swahili verb packs
what English spreads across several words. Subject agreement is a **prefix on the verb**, so "the
child reads" is a single inflected form.

- ✅ **mtoto anasoma** — "the child reads / is reading" (*a-* class-1 subject prefix + *-na-*
  present + *soma* "read").
- ✅ **watoto wanasoma** — "the children read" (*wa-* class-2 subject prefix).
- ✅ **ninaweza kukusaidia** — "I can help you" (*ni-* "I" + *-na-* + *weza* "can"; *ku-ku-saidia*
  "to-you-help") — object and person are *inside* the verb complex.
- ❌ **mtoto wanasoma** — plural subject prefix on a singular noun (subject-concord mismatch).
  *(illustrative wrong form — constructed.)*

**(3) Pro-drop — the subject is already in the verb.** Because the subject prefix is obligatory on
the verb, **overt subject pronouns are normally dropped**. Forcing an English-style explicit
pronoun for every clause reads as repetitive and unnatural.

- ✅ **Anasoma** — "he/she reads" (subject carried by *a-*; no free pronoun needed).
- ❌ **Yeye anasoma** *as default neutral narration* — redundant free pronoun *yeye* ("he/she")
  calqued from English's obligatory subject. *(Grammatical for emphasis/contrast, but wrong as a
  blanket default — illustrative marked form.)*

**(4) No grammatical gender.** Swahili has **no he/she distinction**: **yeye** covers both, and
agreement never changes for gender. This *simplifies* gender-neutrality — but do **not** import an
English "he/she" split, and do not invent a gender where the source is generic.

- ✅ **yeye anasoma** — "he/she reads" (one neutral form).
- ❌ Manufacturing a masculine/feminine split to mirror an English "he or she." *(There is no
  gendered target form to choose between — the trap is inventing one.)*

Sources: <https://www.britannica.com/topic/Swahili-language> (word order, noun classes, verb
morphology, gender-neutral pronoun) · <https://ceaa.colmex.mx/archivos/68/cuaderno_12.pdf>
(standardization grounded in grammar/syntax/morphology) — starred wrong forms in (1)–(3) are
constructed correct-form-only illustrations, ⚠ not from a cited grammar authority.

---

## 5. Numbers, dates, currency

**Digit system.** Swahili web content uses **Western digits 0–9** — there is no native Swahili
digit set. CLDR `sw` number data shows standard decimal formatting.

**Decimal & grouping separators.** ✅ Confirmed against **CLDR 48.2** `sw`: **period `.` as the
decimal separator**, **comma as the group separator**, plain triple grouping (`#,##0.###`) —
e.g. **1,234.56**. This supersedes the research's v44–46 reading, which reported the same values;
the version citation was stale, the values were not. CLDR 48.2 also places the **currency symbol
before the amount with a non-breaking space** (`¤ #,##0.00`) — the gap in that pattern
string is a real **U+00A0 NO-BREAK SPACE**, not the ordinary space U+0020, and so is the gap in
each ✅ currency example below. They look identical on screen, which is the point: copy them, or
emit them from CLDR, but do not retype them. **Collation rows were not read** in
this pass — drive glossary ordering from live CLDR `sw` collation data (§10).

**Dates & time.** East African editorial practice is **day–month–year**, written numerically or
with month names; formal contexts commonly use the **24-hour clock**. Exact per-country/per-publisher
conventions vary and parts of this are **⚠ unsourced** in the research. **ISO 8601 (YYYY-MM-DD)** is
a backend/technical convention, not the end-user default.

- ✅ Editorial long form: **24 Julai 2026** (day–month–year, Swahili month name).
- ✅ Numeric: **24/07/2026**.

*(Swahili also has a traditional daytime-hours reckoning that begins at dawn; the research did not
address it, so this guide does **not** specify a traditional-clock rule — ⚠ out of scope, use the
standard 24-hour/12-hour clock unless a sourced requirement says otherwise.)*

**Currency.** The common interface symbols are **TSh** (Tanzanian shilling) and **KSh** (Kenyan
shilling), with the **currency name/abbreviation typically following the amount** in formal prose.
Currency is a **regional marker** (§9): **localize/parameterize TSh vs KSh per deployment** rather
than hard-coding one for all Swahili users.

- ✅ **TSh 5,000** / **5,000 TSh** (Tanzania) · **KSh 500** (Kenya).
- ❌ Hard-coding **TSh** for a Kenyan deployment (or vice versa) — a localization defect.

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/sw.html> ·
<https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (separators and currency pattern re-read against
**CLDR 48.2**, 2026-03-17, replacing the research's v44–46 charts — the values were unchanged) ·
date and TSh/KSh editorial practice — ⚠ partly unsourced.

---

## 6. Terminology strategy

**Loanword vs coinage.** Swahili technical vocabulary mixes **established loans** (from English and
Arabic) with **native or calqued coinages**. The institutional terminologists are **BAKITA** and
the University of Dar es Salaam / **TUKI–TATAKI** tradition. Working rule: **prefer the established
institutional/sector term over ad-hoc borrowing**, keep well-known English **acronyms** (AI, ML,
NLP) in Latin, and freeze the chosen form in the project glossary.

**The three core ICT terms below are settled — use them.** These are settled in everyday use and
documented in the terminology literature — though note the cited paper describes all three
(*barua pepe*, *mtandao*, *kompyuta*) as **informal, spontaneous coinages by users that became
standard**, not BAKITA/TUKI products; treat them as **field-standard by usage**:

| Concept (EN) | Swahili term | Provenance / status |
|---|---|---|
| Email | **barua pepe** | Established standard usage; an informal coinage that spread, per the cited paper — not an academy product. |
| Internet | **mtandao** | Established standard usage (also "network"); same informal-coinage origin. |
| Computer | **kompyuta** | Adopted loanword, established **in Tanzania**; Kenyan expert teams preferred **tarakishi** (so spelled in the cited paper; ⚠ the variant spelling **tarakilishi** also circulates, unsourced here), with **ngamizi** as a compromise list entry (regional split — §9). |

**That table is the whole of it — website, software, and data are ⚠ unsettled here.** The
terminology literature this guide can cite covers **e-mail, internet and computer** and stops
there: it carries **no entry** for *website*, for *software*, or for *data*. Earlier revisions of
this guide listed house terms for all three in the table above, with "widely used" / "both current"
provenance and no marker; **the research supports none of that**, so the rows are gone rather than
re-sourced. This guide therefore names **no settled Swahili term** for those three concepts.
Treat them exactly like the ⚠ AI/ML rows below: pick one form per concept, freeze it in the
**project glossary** for internal consistency, mark it there as a working choice, and never present
it in copy as standard Swahili. In particular, do **not** mint a phonetic respelling of the English
word to fill the software gap — that is the move the **Transliteration** rule at the end of this
section forbids, and there is no entrenched form to appeal to.

**AI/ML terminology is a REAL ABSENCE — not a research gap.** The research (two passes, including a
deep follow-up) could **not** find a current, authoritative, comprehensive Swahili **AI/ML**
glossary from BAKITA, TATAKI, or any council. This is a **genuine state of the language**: for the
newer AI concepts there is **no canonical Swahili term yet** — usage exists but is unstandardized
and varies by author. **Every term below therefore ships as ⚠ candidate / unstandardized.** Use
them as *working candidates*, freeze one per concept in the project glossary for internal
consistency, and do **not** present them as settled Swahili:

| Concept (EN) | Candidate Swahili term | Marker |
|---|---|---|
| Artificial intelligence (AI) | **akili bandia** | ⚠ candidate — widely used, no canonical source; keep "AI" in parens on first use |
| Machine learning (ML) | **ujifunzaji wa mashine** | ⚠ candidate — common calque, unstandardized |
| Deep learning | **ujifunzaji wa kina** | ⚠ candidate — common calque, unstandardized |
| Neural network | **mtandao wa neva** | ⚠ candidate — calque, unstandardized |
| Dataset | **seti ya data** | ⚠ candidate — loan/calque hybrid |
| Training (ML sense) | **mafunzo** | ⚠ candidate — general word, unstandardized in ML sense |
| Model | **modeli** | ⚠ candidate — borrowed form, common in tech use |
| Prediction | **utabiri** | ⚠ candidate — understandable, unstandardized |
| Classification | **uainishaji** | ⚠ candidate — technical noun, unstandardized |
| Regression | **urejeshaji** | ⚠ candidate — not settled |
| Algorithm | **algoriti** | ⚠ candidate — borrowed form, common in technical writing |
| Feature | **sifa / kipengele** | ⚠ candidate — context-dependent |
| Label | **lebo (ya data)** | ⚠ candidate — borrowed form |
| Bias | **upendeleo / upotofu** | ⚠ candidate — context-dependent |
| Overfitting | **kufitiana kupita kiasi** | ⚠ candidate — no fixed term |

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give target term + original + one short plain gloss, then
use the target term alone afterwards. Instantiated in Swahili — but note the term itself is a
candidate, so the sandwich also carries the concept honestly:

> **akili bandia** (artificial intelligence) — *mifumo ya kompyuta inayofanya kazi zinazohitaji
> akili ya binadamu* ("computer systems that do tasks needing human intelligence"), then **akili
> bandia** alone on later mentions.

Project coinages (C1) keep their original spelling in Swahili text and are owned by the term-sheet,
not this table.

**Transliteration.** Not a major issue — the script is already Latin. For borrowed technical terms,
**keep the institutional spelling** used by the glossary; do **not** invent phonetic spellings
unless already entrenched (e.g. *kompyuta*, *algoriti*).

Sources: <https://www.lingref.com/cpp/acal/36/paper1422.pdf> (BAKITA/TUKI as institutional
terminologists; *kompyuta* vs *tarakishi* vs *ngamizi*; *barua pepe*/*mtandao* described there as
informal coinages that became standard) · <https://www.bakita.go.tz/> ·
AI/ML rows — **⚠ candidate / unstandardized, a real absence** (no authoritative Swahili AI/ML
glossary found in either research pass) · the ICT table's attested set stops at **e-mail,
internet, and computer**: *website*, *software*, and *data* carry **no entry in any source available
to this guide**, and are recorded above as unsettled rather than filled with a house term.

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → SW): idiomatic form ✅ vs literal calque ❌.** These are the common
English educational/technical stock phrases whose word-for-word transfer into Swahili reads as
foreign. Use the idiomatic column; the calque column is what a naive translation produces and must
be avoided.

| English phrase | Idiomatic Swahili ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | hatua kwa hatua | kwa hatua na hatua | translator craft, unsourced |
| under the hood | ndani ya mfumo | chini ya kofia | translator craft, unsourced |
| at a glance | kwa muhtasari | kwa macho moja | translator craft, unsourced |
| on the fly | papo hapo | juu ya kuruka | translator craft, unsourced |
| get up to speed | pata uelewa wa haraka | simama hadi kasi | translator craft, unsourced |
| break it down | chambua / gawanya | vunja chini | translator craft, unsourced |
| in plain language | kwa lugha rahisi | katika lugha wazi kabisa | translator craft, unsourced |
| keep in mind | kumbuka | weka akilini | translator craft, unsourced |
| back and forth | kurudi na kwenda | nyuma na mbele | translator craft, unsourced |
| turn into | kuwa / badilika kuwa | geuka ndani ya | translator craft, unsourced |
| plug and play | tumia moja kwa moja | chomeka na cheza | translator craft, unsourced |
| out of the box | tayari kutumia | nje ya boksi | translator craft, unsourced |

Because Swahili idioms are more context-sensitive than English ones, the best rendering is the one
that **preserves function, not word order** — choose one neutral rendering per phrase and keep it
consistent across the platform. The general law from [translation-quality](../translation-quality.md)
applies: if a mental back-translation lands exactly on the English/German wording, it is too literal
— rework it.

**⚠ Provenance — confirm with a native speaker.** These renderings are **localization judgment**
(the research cited only generic references — Britannica, library/proverb catalog records — not an
academy idiom dictionary). Treat the idiomatic column as a strong working default that a
native-speaker pass should confirm; forms may vary by audience and region.

Sources: idiom renderings — localization judgment, thin provenance (⚠ native-speaker confirmation
pending): <https://www.britannica.com/topic/Swahili-language> ·
<https://library.kab.ac.ug/Record/3029/Similar?sid=22884127> (proverb/idiom catalog, generic).

---

## 8. Simplified-language pendant (`sw-easy`)

Swahili has no codified plain-language norm, so this section follows the **uniform substitute
procedure** of [language-guide-authoring](../language-guide-authoring.md) §8 — subsections 8a–8g, in
that order, the same seven answers a translator finds in every guide built this way.

### 8a. ❌ / ⚠ The honest negative — what was searched, and what came back

**Two catalogs could actually be enumerated, and both come back empty. Everything else is an
inconclusive search, and the two claims are kept apart.**

| Body that would hold such a norm | Result | Level |
|---|---|---|
| **BAKITA** — Baraza la Kiswahili la Taifa, Tanzania's national Swahili council and the §2 authority | Its **published book catalog was enumerated this pass**. What it sells: *Mwongozo wa Taifa wa Ufundishaji Kiswahili kwa Wageni* (national guide to teaching Swahili to foreigners), *Kamusi ya Shule za Msingi* (primary-school dictionary), *Kamusi Kuu ya Kiswahili*, *Istilahi za Kiswahili*. Its *Sheria* and *Kanuni* pages list only *Kanuni za Baraza la Kiswahili la Taifa za Mwaka 2016*. **No plain-language or easy-read guide appears in either list.** | ❌ **established for the catalog as published** |
| **Inclusion Europe**, whose *Information for all* rules are the most widely translated easy-to-read standard | The standards page offers the rules **in English** and *"in 15 other languages"*; its own menu enumerates them — English, Français, Deutsch, Italiano, Español, Hrvatski, Čeština, Eesti, Suomi, Magyar, Latviešu, Lithuanian, polski, Português, Slovenčina, Slovenian. **Kiswahili is not among them.** (A European body's silence on Swahili is expected; it is recorded because it removes the one route by which a ready-made translated standard might have existed.) | ❌ **established for this body** |
| **EAKC / Tume ya Kiswahili ya Afrika Mashariki** — the regional commission, the most likely home of a cross-border guideline | **`eakc.go.ke` did not resolve** (DNS failure) on this pass, exactly as §2 recorded. **Nothing was learned.** | ⚠ **not checked** |
| **CHAKITA**, Kenya's national Swahili association | Landing page reachable; it carries **no** plain-language, easy-read, or readability reference. **No catalog was reachable**, so this is a landing-page observation, not a catalog check. | ⚠ |
| **TBS**, Tanzania Bureau of Standards — where a national adoption of **ISO 24495-1:2023** (*Plain language*) would sit | Landing page reachable, no such reference on it; **no standards-catalog search was possible**. | ⚠ |
| A humanitarian-sector plain-language tipsheet series that **does** have a Romanian edition | The Kiswahili file paths in that series return **HTTP 404**. Suggestive only — the naming convention may differ. | ⚠ |

**The nearest thing that does exist** is not a norm but a **graded corpus**: a pan-African
open-license storybook library publishes Kiswahili books tagged with its own five reading levels —
**1 "first words", 2 "first sentences", 3 "first paragraphs", 4 "longer paragraphs", 5 "read
aloud"** (labels read from the library's own book metadata, 630 Kiswahili titles). **That ladder is
a publisher's plainness scale, not a standard** — but it is measurable, and 8c measures it.

> **→ Consequence.** `sw-easy` **inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). 8b–8f are the Swahili-specific layer on
> top, and 8d is the part a translator will otherwise get backwards.

### 8b. Name the axis — Arabic loan stratum vs Bantu-inherited stratum

**Hypothesis, not yet a finding.** The obvious axis for a Swahili easy-language variant is the
**Arabic loan layer → the inherited Bantu layer**, on the reasoning that the borrowed word is the
learned one. The encyclopedia states the loan share:

> "**About 40% of Swahili vocabulary consists of Arabic loanwords**" — and its source table gives
> Arabic (mainly Omani Arabic) 40%, English 4.6%, Portuguese 0.9–1.0%, Hindustani 0.7–3.9%, Persian
> 0.4–3.4%.

**The same article immediately supplies the reason to distrust that axis**, citing Thomas Spear:

> "In fact, **while taking account of daily vocabulary, using lists of one hundred words, 72–91% were
> inherited from the Sabaki language** (which is reported as a parent language) whereas 4–17% were
> loan words from other African languages. **Only 2–8% were from non-African languages, and Arabic
> loan words constituted a fraction of that.**"

**Those two numbers cannot both describe running text.** 40% is a *dictionary* count; 2–8% is a
*basic-vocabulary-list* count. Neither tells a translator what a Swahili child's book actually
contains — which is why 8c counts running text instead of citing either number.

**The competing axis, and the one §4 already names, is morphological**, not lexical: noun-class
concord and verb agglutination. Britannica states both halves — *"prefixes are also used to bring
verbs, adjectives, and demonstrative and possessive forms into agreement with the subject of a
sentence"*, with its worked example **wa-tu w-etu wa-le wa-kubwa wa-mekuja** ("those big people of
ours have come"), five words carrying five `w-`/`wa-` prefixes; and *"Verb stems may be extended by
means of varying suffixes, each one with its particular nuance of meaning"* — **funga**, **fungwa**,
**fungika**, **fungia**, **fungisha**. **8c measures both axes.**

### 8c. Measure the axis — a graded pair from one publisher, plus an independent cross-check

| Corpus | What it is | Size |
|---|---|---|
| **Graded–plain** | **247 Kiswahili books at the library's reading levels 1–2** ("first words", "first sentences") | 289,405 characters, **40,630 word tokens** |
| **Graded–harder** | **149 Kiswahili books at levels 4–5** ("longer paragraphs", "read aloud") — **same library, same collection, same license, same editorial process** | 503,835 characters, **71,524 word tokens** |
| **Cross-check** | **298 articles of a Kenyan Kiswahili daily newspaper** — adult journalism, an entirely different publisher, register, and country | 839,717 characters, **123,205 word tokens** |

Method: the library's own book index was parsed for `lang` and `level`, every Kiswahili title
fetched from its reader endpoint and reduced to running text; newspaper articles were enumerated
from the site's sitemap and extracted by content container. Counts are normalized **per 100,000 word
tokens** and raw counts are given, so a thin signal reads as thin.

> ⚠ **Four caveats, and the third is the one that matters most.**
>
> 1. **The graded pair is small.** 40,630 tokens at levels 1–2 means **one occurrence ≈ 2.5 per
>    100k**. Any row resting on fewer than about 5 raw tokens is a hint, not a finding.
> 2. **Reading levels are a publisher's editorial judgment**, not a validated readability
>    instrument. **No Swahili readability formula or comprehension study was located.**
> 3. **The graded corpora are narrative fiction and the cross-check is journalism.** Abstract and
>    administrative nouns are under-represented in the storybooks by **genre** as much as by
>    register. Every row below that involves such a noun carries that confound, and no expository
>    plain-Swahili corpus was located to remove it. **This is the single biggest weakness of this
>    measurement and it is not repairable from the data collected here.**
> 4. **Frequency is not comprehension.**

#### 8c-i. The morphological axis — measured, and it does not run the way the instinct says

| Corpus | Tokens | Mean word length | Words per sentence | Words ≥ 9 characters |
|---|---|---|---|---|
| **Graded–plain (levels 1–2)** | 40,630 | **5.66** | **10.7** | **16.1 %** |
| **Graded–harder (levels 4–5)** | 71,524 | **5.73** | **10.7** | 14.9 % |
| **Adult newspaper** | 123,205 | **5.63** | **20.6** | 14.6 % |

**Three results, and two of them overturn something.**

1. **Word length is flat across every register** — 5.66, 5.73, 5.63 characters. In Swahili, word
   length carries grammar, not difficulty. §8's previous edition said exactly this on grammatical
   grounds; it is now a measurement.
2. **Long words are commonest in the *easiest* corpus** — 16.1 % of tokens at levels 1–2 against
   14.6 % in adult journalism. **"Shorten the words" is measurably backwards in Swahili.**
3. **Sentence length is the register split, and it is large** — 10.7 words per sentence in *both*
   graded corpora against **20.6** in adult journalism, nearly double. The graded pair separates on
   vocabulary and text length; the newspaper separates on sentence architecture.

#### 8c-ii. The word rows — the previous edition's candidate table, counted

Every row below was marked **⚠ candidate, unsourced** in the previous edition. This is what counting
them produced. Columns: **P** = graded-plain (levels 1–2), **H** = graded-harder (levels 4–5),
**N** = newspaper, all per 100,000 tokens with raw counts in brackets.

| Formal / complex | Everyday | P | H | N | Verdict |
|---|---|---|---|---|---|
| **taarifa** | **habari** | 0.0 (0) / 2.5 (1) | 1.4 (1) / 37.7 (27) | 95.8 (118) / 78.7 (97) | **Direction holds, right column overstated** — see 8d |
| **kuwasilisha** | **kuonyesha / kusema** | **0.0 (0)** | **0.0 (0)** | 114.4 (141) | ✅ **Cleanest row in the table** — absent from *both* graded corpora, heavy in journalism |
| **idhini** | **ruhusa** | 0.0 (0) / 7.4 (3) | 0.0 (0) / 4.2 (3) | 31.7 (39) / 1.6 (2) | ✅ **Confirmed** — and *ruhusa* is commoner in children's books than in the paper |
| **dhana** | **wazo** | 0.0 (0) / 22.2 (9) | 0.0 (0) / 65.7 (47) | 7.3 (9) / 13.0 (16) | ✅ **Confirmed** — *dhana* absent from both graded corpora |
| **matumizi** | **kutumia** | 4.9 (2) / 147.7 (60) | 9.8 (7) / 236.3 (169) | 86.0 (106) / 204.5 (252) | ✅ **Confirmed** — de-nominalization, see 8f |
| **maelezo** | **kueleza** | 0.0 (0) / 81.2 (33) | 4.2 (3) / 134.2 (96) | 12.2 (15) / 241.1 (297) | ✅ **Confirmed for the verb**; ❌ **refuted for *ufafanuzi*** — see 8d |
| **ushiriki** | **kushiriki** | 2.5 (1) / 7.4 (3) | 12.6 (9) / 30.8 (22) | 126.6 (156) / 197.2 (243) | ✅ Direction holds ⚠ 1 token at levels 1–2 |
| **kufanikisha** | **kufanya** | 0.0 (0) / 260.9 (106) | 2.8 (2) / 436.2 (312) | 5.7 (7) / 296.3 (365) | ✅ Direction holds ⚠ only 9 tokens of *fanikisha* in total |
| **matokeo** | **faida** | 0.0 (0) / 2.5 (1) | 4.2 (3) / 19.6 (14) | 63.3 (78) / 14.6 (18) | ⚠ **Left side confirmed, right side is not a synonym** — see 8d |
| **kuendeleza** | **kuendelea / kukuza** | 4.9 (2) / 51.7 (21) | 21.0 (15) / 120.2 (86) | 29.2 (36) / 281.6 (347) | ⚠ **Left side holds, right side is not a synonym and is *most* frequent in the newspaper** |

### 8d. 🔴 Do NOT "simplify" these — where the measurement contradicts the instinct

**This is the highest-value part of §8.**

#### 8d-i. Etymology predicts nothing — Arabic loans sit at *both* ends of the register scale

Etymologies below are from an open collaborative dictionary — **Community tier**, though several of
the entries cite an academic reference work on Arabic loans in Swahili (Baldi 2020). Arabic etymons
are given **unvocalized**; the dictionary's own entries are vocalized.

| Arabic loanword | Arabic source | P (levels 1–2) | H (levels 4–5) | N (newspaper) | What it actually is |
|---|---|---|---|---|---|
| **rafiki** | رفيق | **322.4** (131) | 260.1 (186) | 22.7 (28) | **14× commoner in children's books than in the newspaper** |
| **kitabu** | كتاب | **73.8** (30) | 71.3 (51) | 1.6 (2) | **46× commoner in children's books** |
| **furaha** | فرح | **64.0** (26) | 114.6 (82) | 8.9 (11) | children's-book vocabulary |
| **shida** | شدة | **17.2** (7) | 28.0 (20) | 1.6 (2) | children's-book vocabulary |
| **sababu** | سبب | 118.1 (48) | 197.1 (141) | 126.6 (156) | universal, all three registers |
| **wakati** | وقت | 189.5 (77) | 233.5 (167) | 267.0 (329) | universal, all three registers |
| **lazima** | لازم | 59.1 (24) | 103.5 (74) | 49.5 (61) | **commoner in children's books than in the paper** |
| **taarifa** | تعريف | 0.0 (0) | 1.4 (1) | **95.8** (118) | administrative vocabulary |
| **idhini** | إذن | 0.0 (0) | 0.0 (0) | **31.7** (39) | administrative vocabulary |
| **ruhusa** | رخصة | 7.4 (3) | 4.2 (3) | 1.6 (2) | the **plainer** member of the *idhini/ruhusa* pair — **and it is Arabic too** |

> **The single most important line in this section:** the pair the previous edition recommended —
> **idhini → ruhusa** — is a swap **from one Arabic loan to another**, and it is a good swap. So is
> **taarifa → habari**: both are Arabic. Meanwhile *rafiki* and *kitabu*, two unmistakable Arabic
> loans, are the most children's-skewed content words in the whole measurement. **"De-Arabize to
> simplify" has no measured basis in Swahili.** Simplify by register, measured — never by
> etymology.

#### 8d-ii. Four specific swaps the count kills

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**maelezo** → **ufafanuzi**~~ | The previous edition offered *ufafanuzi* as the everyday equivalent. It occurs **once in 235,359 tokens across all three corpora** (0.0 / 0.0 / 0.8). *maelezo* itself runs 0.0 / 4.2 / 12.2. **The recommended "plain" word is rarer than the formal word it was meant to replace.** The other half of that row — *maelezo* → the verb **kueleza** (81.2 / 134.2 / 241.1) — is sound, and is what should be used. |
| ~~**matokeo** → **faida**~~ | *matokeo* is "results"; *faida* is "benefit, profit". **The swap changes the meaning**, which is a mistranslation wearing a simplification's clothes. *matokeo* is genuinely journalistic (0.0 / 4.2 / 63.3), so the left side is fine — the right side must be a real synonym or a rephrasing, not *faida*. |
| ~~**kuendeleza** → **kuendelea**~~ | Same failure: *kuendeleza* is "develop, promote", *kuendelea* is "continue". And *kuendelea* is **most frequent in the newspaper** (51.7 / 120.2 / **281.6**), so it is not a plainness marker in any case. |
| ~~assuming **habari** is a simple word~~ | *habari* appears **once** in 40,630 tokens of levels 1–2 (2.5 per 100k) and **78.7** in the newspaper. Within the graded pair it does beat *taarifa* 37.7 to 1.4, so the swap improves the text — but *habari* is **less administrative, not simple**, and a `sw-easy` writer should not treat it as an easy word. |

#### 8d-iii. Two things the previous edition asserted, and what the count says

- **"Word length here is grammar, not difficulty" — confirmed, and strengthened.** Mean word length
  is 5.66 / 5.73 / 5.63 across the three registers, and long words are **commonest in the easiest
  corpus**. Dropping a concord prefix to "shorten" a word produces an ungrammatical form, not an
  easier one.
  - ✅ `sw-easy`: **kitabu kikubwa** — the class-7 `ki-` stays on the adjective (§4).
  - ❌ "Simplified" by dropping the prefix: **kitabu kubwa**.
- **"The kit's ~8–12-word target measures the wrong unit in Swahili" — not supported.** That
  editorial inference argued a word budget imported from English buys *more* content per sentence in
  Swahili. Measured, **both graded corpora run 10.7 words per sentence — inside the kit's band** —
  while adult journalism runs **20.6**. On this evidence the kit's target is well calibrated for
  Swahili as written, and sentence length is the strongest single lever available. ⚠ **The graded
  corpora are narrative; this does not settle expository Swahili, and 8g keeps the question open.**

### 8e. 🔑 The address decision for `sw-easy`

> **Decision: `sw-easy` changes nothing about address, because Swahili gives it nothing to change —
> and it does NOT drop the standard variety.**

**Swahili has no T/V politeness tier** (§4), so the usual form of this question — does the
simplified variant switch to the familiar pronoun — **does not arise**. Recording that is not a
formality: it is the reason `sw-easy` cannot commit the error the other guides warn about.

**The Swahili form of the same question is *variety*, and the answer is the same.** §4's recorded
register decision is **Kiswahili Sanifu**, and it binds `sw` and `sw-easy` alike. A simplified
variant must **not** reach for Sheng, regional slang, or code-mixing to sound approachable:

- ✅ `sw-easy`, same standard variety as `sw`: **Chagua kifaa.**
- ❌ `sw-easy` dropped into urban code-mixed register to sound friendlier.

**The reason is the one that recurs across this kit's languages.** An institution that switches to
street register precisely when it is addressing readers who need plain text is signaling something
about those readers. Informality is not comprehension. And practically: §4's register decision was
gated once and applies to both variants — a pendant is not the place to re-open it.

⚠ **Craft, and marked as such.** No Swahili source was located that discusses register choice for
simplified or accessible text; this rests on §4's recorded decision plus the kit's general finding.
The positive half — that `sw-easy` should prefer **explicit subjects and direct second-person
address** over impersonal constructions — is **unmeasured** and is listed in 8g.

### 8f. What `sw-easy` is built on — in order of leverage

1. **Sentence length first — it is the only lever the measurement isolates cleanly.** 10.7 words per
   sentence in graded children's Swahili against 20.6 in adult journalism. Apply the kit's ~8–12
   target as written; the count says it is a reasonable Swahili number rather than an English import.
   This **overrides** the previous edition's instruction to treat the kit figure as measuring the
   wrong unit.
2. **Concord and agglutination are not simplification targets.** Keep every class prefix; word
   length is flat across registers (8c-i). This **overrides** a naive reading of the base rules'
   *"everyday words"* as *"short words"*.
3. **De-nominalize — abstract noun to a `ku-` infinitive on the same stem.** This is the one
   simplification move Swahili morphology makes structurally cheap, and it is now measured in three
   independent rows, all pointing the same way: **matumizi 4.9 → kutumia 147.7**, **maelezo 0.0 →
   kueleza 81.2**, **ushiriki 2.5 → kushiriki 7.4** (levels 1–2, per 100k). The noun states a
   concept; the infinitive states an action, which is what the base rules' *"say what is"* asks for.
4. **Vocabulary last, and never by etymology** (8d). Use 8c-ii's confirmed rows; do not extend the
   table by feel, and never by whether a word looks Arabic.
5. **Term preservation is unchanged and binding.** Keep the technical term — **akili bandia**
   (⚠ candidate, §6) — then "that means: …", then a concrete example. This matters *more* in Swahili
   than in a resource-rich language: since AI/ML terminology is unstandardized (§6), an ad-hoc
   "simple" substitute would compete with the frozen glossary term and fragment the corpus
   ([translation-quality](../translation-quality.md)).

### 8g. What is still open

1. **The EAKC domain is dead and the CHAKITA and TBS catalogs are not searchable.** Whether a
   regional East African plain-language guideline exists, and whether Tanzania or Kenya has adopted
   ISO 24495-1, are **open questions**. Highest-value item for the next round.
2. **No expository plain-Swahili corpus was located.** The graded corpora are narrative fiction, so
   every abstract-noun row in 8c-ii carries a genre confound alongside the register signal. A
   Kiswahili primary-school textbook corpus — BAKITA publishes a *Kamusi ya Shule za Msingi*, so the
   school register is a real, documented thing — would close this.
3. **The sentence-length finding needs an expository check** before it is applied to lessons.
4. **The levels 1–2 corpus is 40,630 tokens.** Rows resting on one or two occurrences are marked and
   should not be promoted to rules.
5. **The right column of two rows is still missing.** *matokeo* and *kuendeleza* are confirmed as
   formal, but no measured everyday synonym was found for either.
6. **Whether `sw-easy` should use more explicit second-person address is unmeasured** (8e).
7. **Regional coverage is one-sided.** The newspaper cross-check is Kenyan; Tanzanian journalistic
   Swahili is unmeasured, and §9 targets Tanzanian/BAKITA orthography as the anchor.
8. **No native-speaker pass.** Every row here is a frequency claim from running text; register is a
   usage fact that a native reviewer can correct and a count cannot.

Sources: <https://en.wikipedia.org/wiki/Swahili> (loan-share and Sabaki daily-vocabulary figures,
quotes verified against the article's exported wikitext; Community tier citing Spear) ·
<https://www.britannica.com/topic/Swahili-language> (concord and verb-extension quotes, and the
*wa-tu w-etu wa-le wa-kubwa wa-mekuja* and *funga / fungwa / fungika / fungia / fungisha* series) ·
<https://easy-to-read.inclusion-europe.eu/european-standards/> ·
<https://www.bakita.go.tz/books> · <https://www.bakita.go.tz/publications/regulations> ·
<https://www.chakita.org/> · <https://www.tbs.go.tz/> · `eakc.go.ke` (did not resolve) ·
**Graded corpora** — 247 books at reading levels 1–2 and 149 books at levels 4–5, enumerated from
the library index at <https://africanstorybook.org/booklist.php> and fetched from
<https://africanstorybook.org/> ·
**Newspaper cross-check** — 298 articles of <https://taifaleo.nation.co.ke/>, enumerated via
<https://taifaleo.nation.co.ke/wp-sitemap.xml> ·
**Etymologies** — <https://en.wiktionary.org/wiki/rafiki> and the sibling Swahili entries *kitabu,
sababu, lazima, wakati, shida, furaha, taarifa, idhini, ruhusa* (Community tier; several entries
cite Baldi 2020) · <https://www.w3.org/WAI/RD/2012/easy-to-read/paper11/> (general easy-to-read,
**not** Swahili-specific) · [accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md) · [human-gate](../human-gate.md)
---

## 9. Regional variation

**Which standard the project targets.** Standard Swahili derives historically from **Kiunguja**
(the Zanzibar dialect); institutional development then diverged by country. The project targets
**Kiswahili Sanifu with Tanzanian/BAKITA orthography as the anchor**, because Tanzania is the
strongest norm-setter for standard editorial Swahili, and **parameterizes** the few things that
genuinely differ by deployment.

**Differences table.**

| Axis | Tanzania | Kenya | DR Congo |
|---|---|---|---|
| Authority / norm | **BAKITA** (strongest norm-setter) | Kenyan councils; EAKC regional | — (contact-heavy variety) |
| Register tendency | conservative standard | **more English influence** in technical/educational registers | **Kingwana**: more local/French contact, regional vocabulary |
| Term example | **kompyuta** (computer) | **tarakishi** preferred by some experts (spelling per the cited paper; ⚠ variant **tarakilishi** circulates) | regional variation |
| Currency | **TSh** (Tanzanian shilling) | **KSh** (Kenyan shilling) | Congolese franc |

**Neutrality strategy (explicit).**

1. **Orthography:** follow **standard Tanzanian/BAKITA spelling** for general language.
2. **Register:** **Kiswahili Sanifu** (per §4) — conservative, cross-regionally transparent
   vocabulary.
3. **Vocabulary:** avoid **region-marked slang, coastal-dialect-specific choices, very local
   borrowings, and religious/community-coded formulae** unless the content specifically needs them;
   prefer broadly transparent alternatives. *(The research could **not** retrieve a council document
   that explicitly lays out a neutral-editorial rule for religious/community-marked words — this
   neutrality guidance is **⚠ practice, not a sourced rulebook**; the standardization bodies exist
   precisely to regulate such usage.)*
4. **Technical terms:** use the §6 forms; keep shared English acronyms (AI, ML, CPU).
5. **Currency & market specifics:** **parameterize per deployment** (TSh vs KSh) rather than
   hard-coding one for all Swahili users.

The regional standards are mutually intelligible; differences are mainly vocabulary and degree of
English/French contact, so a single neutral written build serves the region with the parameterized
exceptions above.

Sources: <https://www.inalco.fr/en/languages/swahili> ·
<https://ceaa.colmex.mx/archivos/68/cuaderno_12.pdf> (Kiunguja base; divergence across Tanzania,
Kenya, Congo/Kingwana) · <https://www.lingref.com/cpp/acal/36/paper1422.pdf> (kompyuta vs
tarakishi) — neutral-editorial rule for marked vocabulary is ⚠ practice, not a sourced council
document.

---

