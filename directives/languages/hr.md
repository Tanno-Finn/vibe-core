<!-- base -->
# lang-hr — Croatian (hrvatski) — language guide

> **Setup & sources live in [`hr.setup.md`](hr.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** hrvatski / Croatian.
**BCP 47 code (base):** `hr`.
**BCP 47 code (simplified variant):** `hr-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`hr-x-simple`), but the kit token `hr-easy` is the one
that counts here.
**Speaker reach:** **more than 5.5 million** speakers in Croatia and Croatian communities abroad;
per the 2021 census, **3,687,735 residents** name it their mother tongue. Sole official language of
the Republic of Croatia, one of three official languages of Bosnia and Herzegovina, and — since the
July 1, 2013, accession — the **24th official language of the EU** (the 2021 census figure is
⚠ **partial** — it came back as a web-search aggregate attributed to the Institute / 2021 census and
was **not** confirmed against a primary census page this session).
**Script + direction:** Latin script (the **Gajica** alphabet, *hrvatska latinična abeceda*),
**left-to-right**. 30 letters — 27 single-character plus **three digraphs dž, lj, nj** (each one
letter) — with the five diacritic letters **č ć đ š ž**, which live in Latin Extended-A and drive the
one real typographic risk (font coverage, §3).
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `hr` and the `hr-easy` pendant. **Strong** sections rest on official bodies —
**Hrvatski pravopis (pravopis.hr)**, **Struna (struna.ihjj.hr)**, **Hrvatska školska gramatika
(gramatika.hr)** and the **Ministry of Finance (mfin.gov.hr)**: §2 authorities, §3 typography, §5
numbers/currency, and the policy of §6 terminology (with several AI terms Struna-backed). **Thin**
sections rest on Wikipedia / Wikibooks and applied-translation judgment and are marked at point of
use: §4 grammar (mixed — verbal aspect and the Vi-rule are official, cases/word-order are
encyclopedic), §7 idioms (researcher-applied), §8 plain language (an emerging, only-recently-codified
field), §9 regional variation. Per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records the missing native-speaker pass
honestly.
**Easy or hard for this kit:** easy in the mechanics — Latin script, whitespace tokenization, LTR, no
shaping or bidi. The things that actually bite: (1) **web-font glyph coverage** for **č ć đ š ž** — a
truncated Latin font renders **đ/Đ** as tofu or falls back mid-word; (2) **Croatian quotation marks
„…”** (low-open, high-close) and the **space-before-symbol** number rules (`50 %`, `99,90 €`), both
easy to lose to English defaults; and (3) **seven-case declension plus verbal aspect** — one English
noun maps to up to seven Croatian surface forms, so naive dictionary-form output is ungrammatical.

Sources: <https://hr.wikipedia.org/wiki/Hrvatski_jezik> · <https://hr.wikipedia.org/wiki/Gajica> ·
<https://european-union.europa.eu/principles-countries-history/languages_hr> (2021 census count is a
web-search aggregate — ⚠ partial, primary census page not confirmed this session)

---

## 1. Header block

See above. One-line orientation: Croatian is a South-Slavic, SVO-but-flexible, LTR language in the
Latin (Gajica) script with five diacritic letters and three digraphs, seven-case declension, and
grammatical verbal aspect; the localization risks concentrate in **font glyph coverage
(č ć đ š ž), Croatian-specific punctuation and number spacing, and morphological richness (case,
aspect, gender agreement)** — plus one non-mechanical axis: keeping the output **specifically
Croatian**, not drifting into Serbian/Bosnian/Montenegrin forms (§9).

---

## 4. Grammar for translators

**Mixed-tier section.** Verbal aspect (via **gramatika.hr**, official) and the Vi-capitalization rule
(via **pravopis.hr**, official) are academy-sourced; the **seven-case**, **word-order**, **gender-
agreement** and **no-article** facts are standard, well-known grammar carried from **Wikipedia** and
are **⚠ community-grade, native-speaker confirmation pending**. Where a contrastive pair is
constructed, the **correct side is standard Croatian** and the wrong side is a constructed
naive-calque error (correct-form-only where the wrong form is unverified).

**Word order.** Croatian is **relatively free SVO**: case endings carry grammatical roles, so
constituent order marks information structure/emphasis rather than subject vs object. **Clitics**
(unstressed *je, se, ću, mu, li*…) obey **second-position (Wackernagel)** placement — a frequent
source of unnatural machine output when English word order is copied blindly.

- ✅ **Model se istrenirao.** ("The model has trained itself.")
- ❌ **Model istrenirao se.** *(illustrative wrong form — the clitic *se* must sit in the second slot.)*

### Register — decided: **ti (informal)**

Croatian has the **ti (informal) vs Vi (formal/respectful)** second-person distinction, and both are
in live use. In **direct written address to one individual**, the respectful **Vi** pronoun and its
possessives are **capitalized: Vi, Vaš, Vama** (Hrvatski pravopis — „Velikim se početnim slovom pišu:
a) osobna i posvojna zamjenica za 2. lice jednine (Ti, Tvoj, Tebi) i za 2. lice množine (Vi, Vaš,
Vama) kad se u pisanome tekstu obraćamo pojedincu i želimo mu izraziti poštovanje.” — note the rule
covers **both** the singular respectful *Ti, Tvoj, Tebi* **and** the plural *Vi, Vaš, Vama*).

> **Register decision (author decision, applied): ti (informal) — the platform baseline.** The
> platform is a friendly, learner-facing companion, so it uses the informal **ti** throughout — the
> same choice made for the committed Polish guide's `ty`. This is **binding for all second-person
> copy** in `hr` and `hr-easy`: the **ti-imperative** and **ti verb agreement**, not the Vi-plural.
>
> **The Vi alternative (documented, not chosen).** **Vi** is the formal/respectful register; if a
> deployment ever needs it, its written pronouns/possessives are **capitalized in direct address
> (Vi / Vaš / Vama)** per pravopis.hr. **Pick ONE register globally and never mix** ti and Vi within a
> text — mixing reads as an error to every Croatian reader. The platform default is **ti**.

- ✅ ti (baseline): **Klikni ovdje.** · **Unesi svoje ime.** · **Ne zaboravi spremiti.**
- ❌ Vi-forms in the ti build: **Kliknite ovdje.** · **Unesite svoje ime.** · **Ne zaboravite spremiti.**
  *(correct Croatian — but the **wrong register** for this platform; only correct if a deployment
  switches wholesale to Vi.)*

The grammar features that break a naive EN → HR translation:

**(1) Seven cases (7 padeža).** Nominativ, genitiv, dativ, akuzativ, vokativ, lokativ, instrumental —
every noun/adjective/pronoun inflects, and English prepositional phrases collapse into case endings.
One English "model" surfaces as *model / modela / modelu / modelom*.

- ✅ **u modelu** (locative, "in the model") · **s modelom** (instrumental, "with the model") · **modela** (genitive, "of the model")
- ❌ nominative-everywhere: **u model**, **s model** *(illustrative wrong form — the preposition governs a case.)*

**(2) Verbal aspect (glagolski vid).** Verbs are **svršeni / nesvršeni / dvovidni**
(perfective / imperfective / bi-aspectual); English tense alone does not encode this, so the
translator must choose (gramatika.hr — „Glagoli se prema vidu dijele na svršene, nesvršene i
dvovidne.”).

- ✅ ongoing: **model uči** (imperfective, "the model learns / is learning")
- ✅ completed: **model je naučio** (perfective *naučiti*, "the model has learned")
- ❌ using a perfective where an ongoing present is meant.

**(3) Gender agreement (rod).** Three genders (m/f/n); adjectives, past participles, and possessives
agree in gender, number, and case. One English adjective → several Croatian forms.

- ✅ **istreniran** (m) · **istrenirana** (f) · **istrenirano** (n) — "trained"; *„neuronska mreža je istrenirana”* (f, because *mreža* is feminine)
- ❌ one form across genders: **neuronska mreža je istreniran**.

**(4) No articles.** Croatian has **no a/an/the**; the distinction is carried by word order,
demonstratives (*taj, ovaj*) or omitted. Leaving articles out is right; mechanically inserting
*jedan/taj* for every English article reads as translationese.

- ✅ **Unesi upit.** ("Enter a prompt.") — no article
- ❌ **Unesi jedan upit.** *(inserting *jedan* for the English "a" — translationese.)*

Sources: <https://gramatika.hr/pravilo/glagolski-vid/36/> (aspect — official) ·
<https://pravopis.hr/pravilo/rijeci-iz-postovanja-i-pocasti/21/> (Vi-capitalization — official) ·
<https://hr.wikipedia.org/wiki/Pade%C5%BE> (cases — community-grade, confirmation pending)

---

## 5. Numbers, dates, currency

**(Strong section — Hrvatski pravopis „Bjelina” + Ministry of Finance.)**

**Decimal separator = comma; no space after it.** Croatian uses the decimal **comma**, always
(Hrvatski pravopis, Bjelina — „iza zareza u decimalnome broju: 1,41” — no space after the decimal
comma). A decimal point is not part of Croatian orthography.

**Thousands grouping = space (financial: a period is permitted).** For numbers **10 000 or greater**,
group with a space; in financial contexts a period may stand in that gap (Hrvatski pravopis — „između
mjesta stotice i tisućice (kad je broj 10 000 ili veći)…: 10 000, 859 343 286” and „U financijskome
poslovanju može se na mjestu bjeline pisati i točka: 10.000, 859.343.286”).

- ✅ **1 250 000,75** (standard, space groups + comma decimal) · financial **1.250.000,75**
- ❌ English format: **1,250,000.75** (comma groups, period decimal)

**Space between number and symbol — currency, units, percent.** Hrvatski pravopis — „između broja i
oznake novčane jedinice: 99,90 €, 34 kn”, „između broja i znaka za mjernu jedinicu: 3 kg, 2 m,
220 V, 60 W, 5 °C”, „između broja i znaka za postotak i promil: 50 %, 62,5 %, 0,5 ‰”.

- ✅ **50 %** (space) · **99,90 €** (space, symbol after the amount) · **3 kg**
- ❌ **50%** · **99,90€** (glued — defect, flag in §11)

**Currency = euro (€) since 2023.** Croatia adopted the euro on **January 1, 2023**, at the fixed rate
**1 EUR = 7,53450 HRK**, replacing the kuna (Ministarstvo financija — „Dana 1. siječnja 2023.
Republika Hrvatska postaje dvadeseta država članica europodručja, a euro postaje službena novčana
jedinica i zakonsko sredstvo plaćanja u Republici Hrvatskoj.”). Post-2023 content uses **€ / EUR**,
with the symbol after the amount and a space (per the pravopis rule above): **1,50 €** / **1,50 eura**.
The letter code **EUR is invariable** (does not decline): *10 EUR, 55 EUR*. (⚠ CLDR `hr`
pattern-string specifics were **not fetched this session** — verify on cldr.unicode.org if exact
locale-data strings are needed; the placement/spacing above is anchored to pravopis.hr, not CLDR.)

**Dates & times.** Croatian dates are **day.month.year** with periods and a trailing period on the
year: **26. 7. 2026.** Ordinal numerals carry a trailing period; spelled-out months are **lowercase**
and take the **genitive** when a day precedes them: **26. srpnja 2026.** (siječanj, veljača, ožujak,
travanj, svibanj, lipanj, srpanj, kolovoz, rujan, listopad, studeni, prosinac). Time uses the
**24-hour** clock; the pravopis permits a **period** as the h:m separator (**14.30** or **14:30 h**).
(⚠ The exact date-format wording was **assembled from convention + the Bjelina spacing page**, not
fetched from a single primary date-rule page this session — spot-check against pravopis.hr's date
rules before publishing.)

- ✅ **26. 7. 2026.** · spelled **26. srpnja 2026.** (genitive, lowercase month) · time **14.30** / **14:30 h**
- ❌ **26. srpanj 2026.** (nominative month where genitive is required) · 12-hour **2:30 PM**

Sources: <https://pravopis.hr/pravilo/bjelina/54/> ·
<https://mfin.gov.hr/vijesti/od-1-sijecnja-2023-euro-je-sluzbena-novcana-jedinica-i-zakonsko-sredstvo-placanja-u-republici-hrvatskoj/3388>
(CLDR pattern strings and exact date-format wording — ⚠ not fetched this session)

---

## 6. Terminology strategy

**(Strong for the policy; the AI/ML seed table is part Struna-backed, part field usage.)**

**Loanword vs native-coinage practice.** Croatian coins **native terms** for most AI/ML concepts
(calques and native compounds are preferred over raw English), keeping the English in parentheses on
first use. **Struna (struna.ihjj.hr)** is the citable authority; where Struna has no entry, established
usage from Croatian CS faculties and tech press applies and is marked **⚠** here. Loanwords **decline**
like Croatian nouns (respect the case, §4) — don't freeze them in the nominative.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of an
established domain term, give target term + original + one short plain clause, then use the target term
alone afterwards. Instantiated with a Struna-sourced term:

> **umjetna inteligencija** (artificial intelligence, AI) — *„područje računalne znanosti koje se bavi
> izradom programa i sustava koji mogu automatski izvršavati zadatke za koje je potreban neki oblik
> inteligencije”* (Struna). Then **umjetna inteligencija** alone on every later mention.

**Seed field vocabulary (AI/ML).** Freeze the chosen forms in the project glossary; don't mix competing
renderings. **Struna-backed rows are marked ✅; rows without a codified Croatian standard keep ⚠ and
must be locked on a term sheet before bulk translation.**

| Concept (EN) | Croatian (recommended) | Provenance / status |
|---|---|---|
| artificial intelligence | **umjetna inteligencija** | ✅ Struna — def. „područje računalne znanosti koje se bavi izradom programa i sustava…” |
| deep learning | **duboko učenje** | ✅ Struna — „strojno učenje koje se odnosi na računala koja uče na temelju neuronskih mreža…” |
| neural network | **neuronska mreža** (artificial: **umjetna neuronska mreža**) | ✅ Struna (as *umjetna neuronska mreža*) |
| machine learning | **strojno učenje** | Field-standard; ⚠ exact Struna entry not confirmed this session |
| large language model | **veliki jezični model** (LLM) | ⚠ educational-source usage; keep the English acronym LLM |
| supervised / unsupervised learning | **nadzirano / nenadzirano učenje** | ⚠ well-established usage, non-Struna |
| algorithm | **algoritam** (decl. algoritam/algoritma) | Standard loanword; ⚠ no dedicated AI Struna entry surfaced |
| model | **model** (decl. model/modela/modelu/modelom) | Standard; context-defined |
| dataset | **skup podataka** | ⚠ educational usage, no codified standard — term-sheet decision |
| training data | **podatci za učenje** (also *podatci za obuku*) | ⚠ usage; note pravopis *podatci* vs common *podaci* — pick one |
| (to) train / training | **učiti / trenirati; učenje / obuka** | ⚠ non-Struna usage |
| token | **token** (process: **tokenizacija**) | ⚠ loanword, no native coinage settled |
| prompt | **upit** (also *naredba / poticaj*; English *prompt* frequent) | ⚠ no settled Croatian standard — recommend *upit* user-facing, gloss English once |
| fine-tuning | **fino ugađanje** (also *dodatno prilagođavanje*) | ⚠ **unverified** — common calque, no authoritative term; term-sheet decision |
| inference | **zaključivanje** (statistical: *statistička inferencija*) | ⚠ natural rendering, not from an AI Struna entry |
| hallucination (model) | **halucinacija** (halucinacije modela) | ⚠ **unverified** — direct loanword, standard usage, no term-base entry; gloss on first use |

**Guidance.** Prefer the native Croatian term, give the English in parentheses on first mention (e.g.
*veliki jezični model (LLM)*), and **lock every ⚠ row on a term sheet** before bulk translation —
especially **prompt, fine-tuning, inference, hallucination, dataset**, which have no single codified
Croatian standard. Note the pravopis-correct plural **podatci** (with -tc-) vs the very common
**podaci** — pick one and be consistent. Keep well-known English acronyms (AI, LLM, ML) in their usual
form. Project coinages keep their original spelling and are owned by the term-sheet, not this table.

Sources: <http://struna.ihjj.hr/naziv/umjetna-inteligencija/51832/> ·
<http://struna.ihjj.hr/naziv/duboko-ucenje/51745/> ·
<https://hr.wikipedia.org/wiki/Umjetna_neuronska_mre%C5%BEa> (LLM/token/dataset/prompt renderings are
field/educational usage — ⚠ not academy-issued, term-sheet decisions pending)

---

## 7. Idiom anti-patterns

**⚠ Researcher-applied section, native-speaker confirmation pending.** These renderings are grounded
in standard Croatian usage but are **applied translations, not sourced quotations** — treat them as
term-sheet recommendations. The one exception is **crna kutija**, an established Croatian term. Prefer
the idiomatic column; the calque column is the naive output to avoid. In educational copy, **prefer a
short explanation over a forced idiom.**

| English phrase | Idiomatic Croatian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | **korak po korak** | *stepenica po stepenica* | translator craft, unsourced |
| under the hood | **iza kulisa / kako to radi u pozadini** | *ispod haube* (car-only image) | translator craft, unsourced |
| rule of thumb | **okvirno pravilo / opće pravilo** | *pravilo palca* | translator craft, unsourced |
| out of the box | **odmah spremno za uporabu / bez dodatnih postavki** | *izvan kutije* | translator craft, unsourced |
| keep in mind | **imaj na umu** | *drži u umu* | translator craft, unsourced |
| at a glance | **na prvi pogled** | *na jedan pogled* | translator craft, unsourced |
| trial and error | **pokušaj i pogreška** | *suđenje i greška* (mistranslates "trial") | translator craft, unsourced |
| in a nutshell | **ukratko / u nekoliko riječi** | *u ljusci oraha* | translator craft, unsourced |
| the big picture | **šira slika / cjelina** | *velika slika* | translator craft, unsourced |
| hands-on | **praktičan / uz vlastito isprobavanje** | *ruke na* | translator craft, unsourced |
| cutting edge | **najnovije / vrhunsko (dostignuće)** | *rezni rub* | translator craft, unsourced |
| garbage in, garbage out | **loši podatci — loši rezultati** (gloss) | *smeće unutra, smeće van* | translator craft, unsourced |
| plug and play | **priključi i radi / odmah radi** | *utakni i igraj* | translator craft, unsourced |
| black box | **crna kutija** ✅ (this calque **is** the established term) | — | established Croatian term (§7 note) |

Note: the *keep in mind* / imperative rows above use the **ti** form (**imaj**, not *imajte*) per the
§4 register decision. The general law from [translation-quality](../translation-quality.md) applies: if
a mental back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: applied translations grounded in standard Croatian usage (researcher-applied — ⚠
native-speaker confirmation pending); **crna kutija** is an established Croatian term.

---

## 8. Simplified-language pendant (`hr-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages finds
the same seven answers in the same seven places.

**Read this before §8c: for Croatian there is no measurement, and this pass did not produce one.**
In most guides in this kit §8c counts a plain-register corpus against a standard one, and the count
overturns rows of the word table. **Here nothing could be counted, because there is nothing to count
against.** No Croatian easy-language publication was found to exist at all — no *jednostavan jezik* /
*lako čitljivo* news service, no graded-reader site carrying reading-level labels. The one fallback
pair that could have been assembled differs in publisher **and** genre and is not certified plain
language, so it was **rejected rather than used** (§8c). The consequences run through the whole
section: **§8d contains no measured reversals**, and the word table in §8b stands as editorial craft,
labeled as such row by row.

### 8a. The standard — an emerging field, and no Croatian norm

**⚠ Thin, only-recently-codified. Croatian's plain-language tradition is emerging, not
long-established.** It distinguishes **jednostavan jezik** (easy/simple language, for low-literacy or
cognitive-disability readers) from clear/"plain" writing for complex concepts, and the field is driven
by **disability-inclusion work and the EU "Information for all" easy-to-read standards** rather than by
a long-standing national plain-language authority. **No official Croatian government plain-language
style manual was found** — so `hr-easy` **inherits the kit's base simplified-language rules wholesale**
and adds only Croatian-specific care.

- logoped.hr — „Jednostavan jezik stvoren je s idejom da služi osobama koje nemaju dovoljno razvijene
  vještine pismenosti.” and „Jednostavan jezik se oslanja na jezičnu i grafičku prilagodbu teksta, što
  ga čini čitljivim i razumljivim.” (an easy-language advocacy page — **not** a government norm).
- Inclusion Europe (HR) — „Europski standardi za izradu lako razumljivih informacija” (pan-European
  easy-to-read guidelines: e.g. min. Arial 14, one font, everyday words). **Pan-European guidance
  published in Croatian is not a Croatian norm** — cite it as what it is, and never describe `hr-easy`
  as conforming to a Croatian standard, because there is none to conform to.

⚠ **A plain-language lab at a Croatian university surfaced only as an academic mention**, in
web-search results, during the corpus scouting for §8c. **No publication of its output was located**,
so it is recorded here as a lead for a later pass and **may not be cited as a standard, a norm, or a
text source.**

**How `hr-easy` relates to the kit's base rules.** `hr-easy` **inherits the kit's base
simplified-language rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one idea
per sentence, everyday words, say what *is* not what *isn't*, active voice, a one-line "what is this"
opener, a consistent literal tone — and adds the Croatian-specific overlays named in §8b. The one
register overlay: **hold the recorded ti register steadily (§4) — do not drift to Vi** (§8e).

**Term-preservation rule (restated, binding).** In `hr-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Keep e.g. **umjetna inteligencija**, then „to znači: …”, then a
concrete example. This is distinct from the complex→everyday table in §8b, which targets **formal /
Latinate non-technical** vocabulary.

### 8b. The axis the tradition claims — formal/Latinate against everyday Croatian

**The claimed axis.** Croatian easy-language practice, as far as the two sources above state it,
separates **everyday Croatian** from **formal, Latinate, and nominal-heavy prose**. Two of the three
overlays this guide applies are sourced; one is not, and is marked.

1. ✅ **Short sentences, one idea each, active voice, avoid metaphors** — the Inclusion Europe (HR)
   easy-to-read guidance, which is the only structural rule set in this section with a citable issuing
   body. **It is pan-European, published in Croatian; it is not Croatian-issued.**
2. ✅ **Everyday words** — same source, stated as a general principle. Note what it does **not** say:
   it does not name which Croatian words are the everyday ones, and it supplies no list.
3. ⚠ **Avoid piling up genitive chains and verbal nouns** — **craft, unsourced for Croatian.** No
   Croatian source consulted here states it. It is carried because the same lever *is* sourced for a
   sibling Slavic language in this kit — the Russian guide's §8b quotes Нора Галь's marker list, whose
   first two items are "put the verb back in place of the verbal noun" and "break the chains of nouns
   in the genitive". **That is evidence about Russian, not about Croatian.** Treat it as a strong
   hypothesis to verify with a native speaker, not as a Croatian rule.

⚠ **The native-vs-Latinate framing is this guide's own.** "Prefer the native everyday word over the
Latinate or formal one" is an editorial instinct, not something either source states, and §8d records
why it is unsafe as an algorithm.

**Complex / formal → everyday (Easy-Croatian direction).** ⚠ **Every row below is editorial craft.**
Unlike the measured guides in this kit, no corpus stands behind any of these pairs, and unlike the
Russian guide, no register-marking dictionary was consulted for them either. The tier column says so
per row so that no reader can pick one up as a measured result.

| Formal / complex | Everyday | English sense | Tier |
|---|---|---|---|
| primijeniti | upotrijebiti / rabiti | apply → use | ⚠ craft — unsourced |
| omogućiti | dati / pustiti da | enable → let | ⚠ craft — unsourced |
| tijekom / prilikom | dok / kad | during → while/when | ⚠ craft — unsourced |
| potrebno je | trebaš | it is necessary → you need | ⚠ craft — unsourced (ti form per §4) |
| posljedično / stoga | zato / tako | consequently → so | ⚠ craft — unsourced |
| pohraniti | spremiti | store/save → save | ⚠ craft — unsourced |
| konfigurirati | postaviti / namjestiti | configure → set up | ⚠ craft — unsourced |
| izvršiti | napraviti / učiniti | execute → do | ⚠ craft — unsourced |
| generirati | napraviti / stvoriti | generate → make/create | ⚠ craft — unsourced |
| modificirati | promijeniti | modify → change | ⚠ craft — unsourced |
| inicijalno | na početku / prvo | initially → at first | ⚠ craft — unsourced |
| prosljeđivati | slati (dalje) | forward → send on | ⚠ craft — unsourced |

(Note the *trebaš* row uses the **ti** form per §4; a Vi build would use *trebate*.)

### 8c. 🔴 The honest negative — what was sought, what was checked, and why nothing was usable

**What was sought.** The design this kit uses elsewhere: **one publisher, two editions of the same
material** — one standard, one plainer — so that publisher, genre, and topic are held constant and only
register varies. Failing that, a graded-reader collection with explicit reading-level labels from a
single publisher.

**The finding, and how a second pass changed it.** The first scouting pass concluded that **no genuine
easy-language / plain-language Croatian publication could be found**, and **no graded-reader site with
explicit reading-level labels** either — reason **(i)**, nothing to collect. **A second pass with
search available (2026-07-29) found a Croatian easy-language publisher, and it is a public
authority, not a press title.**

> **🔴 The City of Zagreb runs a «Lako za čitanje» (Easy to Read) program** — introduced in 2025,
> the first of its kind in Croatia — publishing easy-read versions of **its own city regulations**,
> written by trained city officials and checked with associations of people with intellectual
> disabilities. Verified: the landing page returns HTTP 200 and `zagreb.hr` serves **no `robots.txt`
> at all**, so nothing is disallowed. **⚠ It is nine documents — and eight of them are scans.**

**🔴 The pilot was attempted and it stops at OCR. Say that precisely, because it decides what the
next pass does.** All nine easy-read PDFs were fetched and put through the kit's collector. **Eight
carry no embedded text layer at all** — they are page images, and the tool reported them as probable
scans rather than contributing empty documents to a corpus. **One** has extractable text
(1,165 tokens, 56 sentences: mean 20.8 words, median 14, 55.4 % of sentences at 15 words or fewer,
3.3 % of tokens 12 characters or longer) — **a single document is a sample, not a measurement, and
no row of §8b may rest on it.**

**So the Croatian blocker is now specific.** It is not policy, not enumeration, and not format in the
general sense: it is **OCR**, on eight known files at known URLs. That is a small, bounded job — and
every row derived from it must be marked as **OCR evidence**, because character-level recognition
error is a real tier difference, and Croatian diacritics (č ć đ š ž) are exactly what OCR loses
first. No OCR was available in the environment that ran this pass.

**Why that is worth more than its size suggests.** These are not a plain-language publication next
to an unrelated standard one; they are **easy-read rewrites of documents that exist in standard
Croatian from the same institution on the same subject** — *Odluka o socijalnoj skrbi*, *Odluka o
najmu stanova*, a transport regulation. That is the **one design that holds publisher, topic, and
genre constant and varies only register**, and it is the pairing the kit's own backlog names as the
experiment that would put an official plain-language wordlist in range. **Eight pairs is a pilot,
not a corpus** — but it is a pilot of the right shape, which is not what this section had before.

**What remains reason (i).** No Croatian easy-language *periodical* was found, and no graded-reader
collection with reading-level labels. For a running plain-register stream, the finding stands:

> **(i) There is nothing to collect.** No such publication exists. No amount of crawling engineering
> changes that, and no future pass should be planned as though the obstacle were technical.

**Sources checked, and why each was unusable.**

| Host | Register it would have supplied | Why it was not used |
|---|---|---|
| **hrt.hr** — national public broadcaster | standard | **(ii) The publisher declines automated text collection.** Its `robots.txt` carries dedicated blocks disallowing several **named automated text-collection agents**. That is a **stated position of the publisher**, not a technical fault: it was treated as a refusal, the host was dropped, and **no workaround was attempted or is to be attempted.** |
| **lektire.skole.hr** — government schools portal | student-register non-fiction | Access policy clean, but **no working enumeration**: the posts endpoint returns an empty list and the sitemap an empty document. Nothing to iterate over. |
| **jutarnji.hr** — national daily | standard | Access policy clean, but the standard sitemap path answers with an HTML error page rather than XML. **No enumeration found within the scouting budget.** |
| **vecernji.hr** — national daily | standard | Access policy clean, but the sitemap path serves HTML and the posts endpoint is absent. **No enumeration found.** |
| **24sata.hr** — national daily | standard | Enumerable via its news sitemap only. Noted as a **backup standard-register cross-check**, never as a plain-language source. |

**Read the shape of that table.** Four of the five hosts would only ever have supplied the **standard**
side. Even if every enumeration problem in it were solved tomorrow, **the plain side would still be
missing**, which is why §8g does not list "retry the sitemaps" as the thing that would settle this.

**🔴 The fallback pair that was available, and was rejected.** A pair *could* have been assembled:
**lektira.hr** (~270 student-level literary summaries and analyses of school reading assignments,
cleanly enumerable) against **index.hr** (mainstream news, archive since 2002), with **dnevnik.hr** as
an independent third-publisher cross-check. **It was not used, and it must not be used.** The reasons
are cumulative, and each one alone would be disqualifying:

1. **lektira.hr is not plain language.** It is literary-analysis prose written for school students. No
   plain-language certification, no reading-level label, no easy-language editorial process.
2. **The genre differs** — book summary and analysis against general news reporting.
3. **The publisher differs**, so house style, editing, and audience vary with the register.

A count over that pair would measure **student-register non-fiction against general-audience news**.
Any lexical difference it produced would have at least three candidate explanations and the measurement
could not separate them — the same confound the Russian guide describes, without even the partial
compensation of a shared language-level norm. **A word list built on it would look like evidence and be
none, which is worse than an empty table.** It is recorded here so that a later pass does not
rediscover the pair and mistake availability for suitability.

**Consequence, stated plainly.** No frequency, ratio, or corpus size appears anywhere in this section,
because none was produced. The §8b table is craft; §8d cannot reverse any of its rows on evidence,
only mark them; and §8f takes its leverage from structure, where the one citable source in §8a
actually speaks.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none is presented as one.** In the measured guides of this
kit, §8d is where a corpus count deletes or inverts a word pair. **Croatian has no count**, so this
list does two narrower things: it marks what the §8b table does and does not rest on, and it carries
one cross-language finding as a warning to verify — never as a Croatian result.

| Do **not** do this | Why |
|---|---|
| ~~read any §8b row as measured~~ | **All twelve rows are ⚠ craft — unsourced.** They rest on this guide's editorial judgment, not on a corpus and not on a register-marking dictionary. Apply them as hints with a native speaker in the loop; never cite them as evidence, and never let a downstream reviewer promote them to rules because they appear in a table. |
| ~~assume the Latinate or international word is the harder one~~ | **⚠ Cross-language finding, requiring local verification — not a fact about Croatian.** Across the languages in this kit where a plain-against-standard count *was* run, one result recurs: **the learned or borrowed word is not reliably the harder one**, and a "simplification" frequently swaps a common word for a **rarer** one, making the text harder rather than easier. **Rarity, not etymology, is what makes a word hard.** No Croatian count exists to confirm or refute this for Croatian — so treat it as a reason to check each swap against a native reader's intuition, and never as a Croatian measurement. |
| ~~simplify by word length alone~~ | Same failure mode, one step down: a shorter word is not automatically a commoner one. In Croatian the structural levers of §8b — shorter sentences, one idea each, active voice, and (⚠ craft) unwinding verbal nouns and genitive chains — shrink the sentence and take the long nominalizations with it. That is the edit to reach for first. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **umjetna inteligencija**, then „to znači: …”, then a concrete example. Explaining a hard word is safer than replacing it — and with no corpus, a replacement is a guess. |
| ~~drift the register in the name of simplicity~~ | `hr-easy` keeps **ti** (§8e) because `hr` does. Simplified is not childish and not chatty; changing register is not a simplification, and §4 forbids mixing ti and Vi within a text in either variant. |
| ~~build a plain-vs-standard word list from lektira.hr against index.hr~~ | The pair is confounded on **publisher and genre**, and its "plain" half is **not plain language at all** (§8c). It was rejected deliberately. Rediscovering it later and using it would produce numbers that read as evidence and are not. |
| ~~treat hrt.hr as a crawling problem to be solved~~ | Its access policy names automated text-collection agents and disallows them. **That is a stated position, not an obstacle.** The kit does not work around it, and neither may a later pass; a licensed or manually agreed route is the only route. |
| ~~cite the university plain-language lab as a norm~~ | It surfaced as an academic mention only (§8a). No publication of its output was located, so there is nothing to cite, quote, or count. |

> **→ The rule that follows.** For Croatian, **the word table is the weakest evidence in this section
> and the structural rules are the strongest.** Take the leverage from §8f in the order given, apply
> §8b's rows as hints and only with a native speaker, and record honestly that the Croatian evidence
> base for lexical simplification is currently empty.

### 8e. 🔑 The address decision — `hr-easy` keeps **ti**, on convention rather than evidence

> **Decision, recorded so that nobody "fixes" it: `hr-easy` uses `ti`, exactly as `hr` does (§4). It
> does NOT switch to `Vi`, and it does not loosen further.**

- ✅ **Klikni ovdje.** — the ti-imperative, in `hr` and in `hr-easy` alike
- ❌ **Kliknite ovdje.** — correct Croatian, but the Vi register, and therefore wrong for both variants

**The grounds are §4's, and §4 states their tier honestly.** §4 records **ti** as an **author decision,
applied** — the platform baseline for a friendly, learner-facing companion, matching the committed
Polish guide's `ty`. It is **convention and project policy, not evidence**: no language authority rules
on which register an educational platform should use, and there is none to appeal to. What *is*
academy-sourced in §4 is the narrower orthographic rule that respectful **Vi / Vaš / Vama** are
capitalized in direct address (pravopis.hr) — a spelling rule about the alternative, not a ruling in
favor of either.

**⚠ §8 adds nothing in either direction.** Neither source cited in §8a speaks to address in easy
language: the advocacy page defines the audience and the adaptation, the pan-European guidance covers
structure, wording, and layout. And with no corpus (§8c), there is no frequency evidence to appeal to
either. **Treat §8 as silent on address; the decision is carried over from §4 as recorded.** What would
settle it: a Croatian easy-language publication addressing adults, of which none was found.

### 8f. What `hr-easy` is built on, in order of leverage

1. **Sentence structure — the main lever, and the only one with a citable issuing body.** Short
   sentences, one idea each, active voice, avoid metaphors (Inclusion Europe HR, §8b). This is where
   the real gain is, and it is the part of `hr-easy` that does not depend on the missing corpus.
2. **⚠ Unwinding verbal nouns and genitive chains** (§8b, craft for Croatian — sourced only for a
   sibling Slavic language in this kit). High expected yield in a seven-case language where a genitive
   chain can run four nouns deep, but **verify with a native speaker before making it a rule**.
3. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), inherited wholesale because Croatian
   contributes no quantified national pendant (§8a). The kit's own ~8–12-word working sentence target
   is **the kit's figure** — no Croatian norm states a word count, and none may be attributed to one.
4. **Term preservation before substitution** — keep the technical term, then „to znači: …”, then an
   example (§8a). With no lexical evidence available, explaining beats replacing.
5. **The ti register (§4), held steadily** (§8e), and the Croatian mechanics unchanged: the diacritics
   **č ć đ š ž** correct and rendering (§3), and the number/percent/currency spacing of §5. ⚠ Craft
   judgment, offered as a reason rather than a rule: a broken **đ** or a glued *50%* is a reading
   obstacle in any variant, and an easy-language reader has the least slack to absorb one.
6. **Vocabulary substitution last, and as hints only** — every row of §8b is craft (§8d). Nothing in
   this guide licenses a bulk find-and-replace over Croatian vocabulary.
7. **Layout, from the pan-European guidance** — min. Arial 14, one font (§8a). Cite it as
   pan-European easy-to-read guidance published in Croatian, never as a Croatian standard.

### 8g. What is still open

1. **The pilot the second pass found is blocked on OCR, and that is now the whole of the open
   work.** The City of Zagreb's «Lako za čitanje» PDFs (§8c) are easy-read rewrites of city
   regulations that exist in standard Croatian from the same institution — the only Croatian
   material where **register is the only variable**. Eight of the nine are **page scans**; one
   extracted. In order: **(a)** OCR the eight, marking every derived row as OCR evidence and
   checking č ć đ š ž survived; **(b)** locate each original — four of them name a city act
   (*Odluka o socijalnoj skrbi*, *Odluka o najmu stanova*, the disability-stipend decision, the
   disability-transport regulation) published in the city's official gazette; **(c)** count the
   pairs. Nine documents will not carry a frequency table; they will carry sentence architecture
   and morphological load. **Retrying the news sitemaps still would not help**: four of the five
   hosts in §8c supply the standard side only.
2. **The university plain-language lab is the one live lead** (§8a). Whether it has published anything
   collectible was not established. A pass with academic or library access could settle it; a web
   scouting pass could not.
3. **One publisher's material is out of reach by policy** (§8c). hrt.hr declines automated text
   collection, and that is to be respected, not circumvented. If a licensed or manually agreed route
   ever exists, that is the route.
4. **All twelve rows of the §8b table are craft, and none has had a native-speaker pass.** They are the
   single largest unverified block in this guide. A native reviewer could convert most of them into
   evidence-bearing rows in an afternoon — that is the cheapest available improvement to §8.
5. **The genitive-chain / verbal-noun rule is unsourced for Croatian** (§8b, item 3). Either a Croatian
   style authority states it, or it stays craft.
6. **The address decision rests on project convention** (§4), and §8 cannot reinforce it (§8e).
7. **No comprehension evidence exists for any of this.** Nothing here has been tested on the readers
   `hr-easy` is written for, in Croatian or in the pan-European guidance's own practice.
8. **Whether an official Croatian government plain-language style manual exists outside the web was not
   established** (§8a). The negative found here is a search result, not an exhaustive one.

Sources: <https://logoped.hr/sto-je-jednostavan-jezik/> ·
<https://www.inclusion-europe.eu/wp-content/uploads/2017/06/HR_Information_for_all.pdf>
(easy-language field is emerging — no official Croatian government plain-language norm found; the §8b
table is editorial craft, native-speaker confirmation pending) · **Corpus (§8c): none.** No count was
run and no frequency, ratio, or corpus size is reported anywhere in this section. The hosts checked and
rejected — hrt.hr (declines automated text collection), lektire.skole.hr, jutarnji.hr, vecernji.hr,
24sata.hr (no usable enumeration or standard-register only), and the deliberately rejected
lektira.hr / index.hr / dnevnik.hr fallback pair — are recorded in §8c so that a later pass inherits
the negative result instead of repeating it. The kit's base rules in
[accessibility-workflow](../accessibility-workflow.md) govern `hr-easy`.

---

## 9. Regional variation — what makes the target specifically Croatian

**⚠ Community-grade section (Wikipedia / Wikibooks), native-speaker confirmation pending.** Croatian,
Serbian, Bosnian, and Montenegrin are closely related Štokavian standards, but the platform's target is
**specifically Croatian**. Markers to enforce:

1. **Latin script only.** Croatian uses exclusively the **Latin (Gajica)** alphabet; Serbian's primary
   official script is Cyrillic. **Never deliver Cyrillic for `hr`** (hr.wikibooks.org — „Službeno i
   jedino pismo hrvatskog jezika je hrvatska latinična abeceda (Gajica)…”).
2. **Ijekavian reflex of yat** — the single most visible marker. Croatian standard is **ijekavian**:
   **mlijeko, vrijeme, dijete, riječ** — *not* ekavian *mleko, vreme, dete, reč* (Serbian standard).
3. **Vocabulary — native coinages over internationalisms.** **tisuća** (not *hiljada*), **računalo**
   (not *kompjuter*), **povijest** (not *istorija*), **tjedan, siječanj** (month names, not *januar*),
   **nogomet** (not *fudbal*). For tech: **poslužitelj** (server), **preglednik** (browser),
   **datoteka** (file), **sučelje** (interface), **mreža** (network), **podatci**.
4. **Orthography / morphology habits.** **đ as a single letter** (not *dj*, §3); **infinitive after
   modals** (Croatian *moram raditi*) over *da* + present (*moram da radim*); future **radit ću**
   (Croatian) vs *radiću*.

- ✅ Croatian: **tisuću riječi u datoteci na poslužitelju** (ijekavian, Latin, native tech vocab)
- ❌ non-Croatian drift: **hiljadu reči u fajlu na serveru** (ekavian + Serbian/Bosnian lexis)

**"Neutral" Croatian** = the standard novoštokavian-ijekavian written norm of the *Hrvatski pravopis*
and Struna: **Latin-only, ijekavian, native tech vocabulary, infinitive after modals,
đ / tisuća / računalo.** Avoid dialect (kajkavian / čakavian) and avoid Serbian/Bosnian lexical or
ekavian intrusions — the most common contamination in machine or pooled translation. **Honest gap:
there is no official Croatian *digital-content* style guide** to lean on for this (§2); the norm above
is assembled from pravopis.hr + Struna + the differences source.

Sources: <https://hr.wikibooks.org/wiki/Osnovni_razlikovni_rje%C4%8Dnik_hrvatskog_jezika_i_srpskog_jezika>
· <https://hr.wikipedia.org/wiki/Hrvatski_jezik> (regional markers — community-grade, confirmation
pending)

---

