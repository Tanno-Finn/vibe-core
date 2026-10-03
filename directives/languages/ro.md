<!-- base -->
# lang-ro — Romanian (română) — language guide

> **Setup & sources live in [`ro.setup.md`](ro.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** română / Romanian.
**BCP 47 code (base):** `ro`.
**BCP 47 code (simplified variant):** `ro-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`ro-x-simple`), but the kit token `ro-easy` is the one
that counts here.
**Speaker reach:** ~**22–24 million** speakers — roughly 19 million in Romania (sole official
language) and ~2.5–3 million in the Republic of Moldova (where the state language is Romanian),
plus a large diaspora in Italy, Spain, Germany, and the Americas; one of the 24 official languages
of the EU. ⚠ The aggregate figure is **not** tied to a single primary demographic authority in the
source dossier — treat 22–24M as an approximate range from general reference, not a censused count.
**Script + direction:** Latin script with five special letters — **ă, â, î, ș, ț** (31-letter
alphabet); **left-to-right**. The two comma-below letters (**ș** U+0219, **ț** U+021B) drive the
single biggest real localization hazard for Romanian (§3).
**Status:** planned — authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources. Covers base `ro` and the
`ro-easy` pendant. **Not yet reviewed by a native speaker** — per the authoring directive's "second
set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.
The **strong** sections rest on **Academia Română / DOOM3 (doom.lingv.ro)**, **dexonline.ro**,
**secarica.ro**, and **Romanian Wikipedia**, and carry verbatim quotes; the **thin** sections
(grammar §4, idioms §7, regional variation §9, and the plain-language gap in §8) rest on educational
sites, translator judgment, and search-summary sources, and are marked **⚠ community-tier,
native-speaker confirmation pending** at point of use.
**Easy or hard for this kit:** genuinely easy in most respects — Latin script, whitespace
tokenization, LTR, no shaping or bidi. The three things that actually bite: (1) **the comma-below
vs cedilla trap** — Romanian requires **ș/ț = U+0219/U+021B**, but legacy text and many fonts/systems
still emit the Turkish **cedilla** forms **ş/ţ = U+015F/U+0163**, which are *wrong* and break
search/sort silently (§3, the #1 Romanian Unicode hazard); (2) **the â/î spelling rule** (î at word
start/end, â inside) and Romanian **quotation marks „…”** with inner **«…»**; and (3) **rich
morphology** — an **enclitic definite article** glued to the noun, three genders including a genuine
**neuter**, and **case shown through the article ending**, so naive dictionary-form output is
ungrammatical.

Sources: <https://doom.lingv.ro/> · <https://www.secarica.ro/ro/rou/s-uri-si-t-uri> ·
<https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> (speaker-reach line is editorial
background, ⚠ not from a single demographic authority)

---

## 1. Header block

See above. One-line orientation: Romanian is an Eastern Romance, SVO-but-flexible, LTR language in
Latin script; the localization risks concentrate in **the comma-below vs cedilla Unicode trap, the
â/î and quotation-mark conventions, and morphological richness (enclitic article, neuter gender,
case-via-article)** rather than in scripting or direction.

---

## 4. Grammar for translators

**⚠ Community-tier section.** The grammar facts below rest on **Romanian Wikipedia lead sentences**
plus educational sites (scoalavirtuala.ro, liceunet.ro) and two search-summary sources
(diacronia.ro, scribd) — **not** an academy grammar. They are standard, well-known facts, but the
right/wrong example pairs are **illustrative correct-form-only** (the correct side is standard
Romanian; the wrong side is a constructed naive-calque error), and the section is **native-speaker
confirmation pending**.

**Word order.** Romanian is **SVO by default but morphologically rich**, so order flexes for
emphasis. **Adjectives normally follow the noun** (*rețea neuronală*, *date de antrenament*), the
opposite of English — do not mechanically clone English adjective-before-noun order.

- ✅ **rețea neuronală** ("neural network" — adjective after noun) · **model antrenat** ("trained
  model")
- ❌ **neuronală rețea**, **antrenat model** (English order cloned onto Romanian)

### 4.1 Register — and the project's recorded choice

Romanian distinguishes **tu** (informal, singular, one familiar addressee) from **dumneavoastră**
(formal/respectful; grammatically **plural even for one person**, and **the verb stays plural**).
- „Pronumele de politețe (dumneavoastră, dumneata, dânsul, dânsa) se folosesc când vorbești
  respectuos cu cineva sau despre cineva.” — <https://scoalavirtuala.ro/cursuri/limba-romana-clasa-a-v-a/lectii/pronumele-personal-de-politete/>
- „'Dumneavoastră' este forma oficială, distantă — potrivită pentru directori, medici, persoane
  necunoscute.” — same source.
- The formal pronoun is **grammatically plural, and the verb remains plural** even for a single
  addressee — ⚠ search summary, <https://www.diacronia.ro/ro/indexing/details/V900/pdf>.

> **Register decision (apply): tu (informal) — decided.** Use **tu** across all
> **lessons / UI / microcopy** — the friendly, modern EdTech voice. Reserve **dumneavoastră** for
> **legal / consent / account** text, where distance is expected. Concretely this means the
> **tu verb agreement and tu-imperative** (*apeși*, *selectezi*, *vezi*, *reține*), not the plural
> dumneavoastră forms, in ordinary product copy.
>
> ⚠ **Never mix tu and dumneavoastră within one screen.** Register is **not a pronoun swap** — it
> re-conjugates *every* verb in the sentence, because dumneavoastră takes plural agreement even for
> one person: **tu apeși** vs **dumneavoastră apăsați**, **tu selectezi** vs **dumneavoastră
> selectați**, **tu vezi** vs **dumneavoastră vedeți**. Pick one register per surface and hold it.

- ✅ tu (the recorded register): **Apasă aici.** · **Selectează un model.** · **Nu uita să salvezi.**
- ❌ dumneavoastră in ordinary lesson copy: **Apăsați aici.** · **Selectați un model.** · **Nu uitați
  să salvați.** *(correct only on legal/consent/account surfaces, never mixed with tu on the same
  screen)*

### 4.2 Five features that break naive EN→RO translation

**(1) Postposed (enclitic) definite article.** Romanian has **no separate word "the"**; it glues onto
the noun's end (`-ul`, `-l`, `-a`, `-le`, `-lui`, `-lor`).
- „se atașează la sfârșitul cuvintelor pe care le determină, poziție în care se numește enclitic” —
  <https://ro.wikipedia.org/wiki/Articol_hot%C4%83r%C3%A2t>
- ✅ *model* → **modelul** ("the model") · *rețea* → **rețeaua** ("the network") · *date* →
  **datele** ("the data")
- ❌ leaving an English "the" untranslated (*the model*) or adding a stray free-standing article — the
  article must be **enclitic**, not a separate word.

**(2) Grammatical gender, including a genuine NEUTER.** Nouns are masculine, feminine, or **neuter**
(masculine-like in the singular, feminine-like in the plural), and every adjective/participle/article
must agree.
- ⚠ „Pentru genurile masculin și neutru, atât la singular cât și la plural, legătura … se face prin
  sunetul -u-.” (search summary, liceunet.ro)
- ✅ *algoritm* (m.) → **un algoritm bun** · *rețea* (f.) → **o rețea bună** · *model* (neuter) → **un
  model bun** / **două modele bune**
- ❌ freezing one adjective form across genders (*un rețea bun*, *o model bună*).

**(3) Adjective agreement & position.** Adjectives follow the noun and inflect for gender/number.
- ✅ **date etichetate** (labeled data, f.pl.) · **model antrenat** (m./n. sg.) · **modele
  antrenate** (pl.)
- ❌ an invariable English-style adjective (*date etichetat*, *modele antrenat*) — the ending must
  agree.

**(4) Case shown mostly through the article ending.** "of the model" = **modelului** (genitive), "to
the network" = **rețelei** (dative). English uses prepositions ("of", "to"); Romanian folds them into
the noun+article ending.
- ✅ **parametrii modelului** ("the parameters of the model") · **datele rețelei** ("the network's
  data")
- ❌ a stray preposition + dictionary form (*parametrii de model*, *datele la rețea*) where the
  genitive/dative ending is required.

**(5) Verb agreement is register-sensitive (restated).** Second person re-conjugates the whole verb:
*tu selectezi / apeși / vezi* vs *dumneavoastră selectați / apăsați / vedeți* — see §4.1. Choosing a
register is not a pronoun swap.

Sources (community-tier): <https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> ·
<https://ro.wikipedia.org/wiki/Articol_hot%C4%83r%C3%A2t> ·
<https://scoalavirtuala.ro/cursuri/limba-romana-clasa-a-v-a/lectii/pronumele-personal-de-politete/> ·
liceunet.ro ⚠ · diacronia.ro ⚠ (register/gender examples native-speaker-confirmation pending)

---

## 5. Numbers, dates, currency

**(Mixed — decimal separator is Wikipedia-anchored; grouping/currency rest on a labeled
localization blog ⚠, corroborated by Wikipedia. Cross-check against the current CLDR `ro` locale
before shipping — the dossier did not carry CLDR data, so no CLDR values are quoted here.)**

**Decimal separator = comma (virgulă).** „… de o virgulă în alte sisteme, cum este cel folosit în
România” — <https://ro.wikipedia.org/wiki/Separator_zecimal>

**Thousands grouping = period `.` in common use, but a (non-breaking) SPACE in official/typographic
style.** ⚠ „în documentele oficiale … ar trebui folosit un spațiu (insecabil) în loc de punct pentru
mii, deci 2 345,67 lei” — search summary, blog.silverpc.hu (localization blog), corroborated by
Wikipedia. So: `1.000` = one thousand; `3,14` = pi; official/typographic form `2 345,67`.

- ✅ Romanian: **3,14** (comma decimal) · **2 345,67** (space grouping, official) · **1.000** (period
  grouping, common)
- ❌ English format: **3.14** (period decimal) · **1,000.00** (comma grouping + period decimal)

**Dates** — day-first, **`zz.ll.aaaa`** (e.g. **26.07.2026**) or long form **26 iulie 2026**; **month
and weekday names are lowercase** in Romanian. **Time** — 24-hour clock, colon separator (**14:30**).

- ✅ **26.07.2026** · **26 iulie 2026** (lowercase month) · **14:30**
- ❌ **26 Iulie 2026** (capitalized month) · **2:30 PM** for end-user Romanian content

**Currency (Romania):** *leul*, plural *lei*, **ISO 4217 = RON**. The symbol/code goes **after** the
amount, with a space. ⚠ „'100 RON' sau '100 Lei' … cu simbolul după valoare, adesea cu spațiu” —
search summary, blog.silverpc.hu.
- ✅ **2 345,67 RON** · **19,99 lei**
- ❌ **RON 2 345,67** (symbol before) · **$19.99**-style formatting
- **Moldova** uses the **Moldovan leu (MDL)** — same word *leu*, different currency. If the platform
  serves Moldova, do **not** assume RON (§9).

Sources: <https://ro.wikipedia.org/wiki/Separator_zecimal> · blog.silverpc.hu ⚠ (localization blog,
corroborated by Romanian Wikipedia; verify against current CLDR `ro` before shipping)

---

## 6. Terminology strategy

**(Mixed — core-concept rows are Romanian-Wikipedia-anchored (strong); AI-*operational* rows lean on
a labeled localization-vendor page and are kept ⚠.)**

**Loanword vs native-coinage practice.** Romanian AI/ML vocabulary is **calque-heavy on native
roots** for core concepts (*inteligență artificială*, *învățare automată*, *rețea neuronală*) but
**borrows English wholesale** for newer/operational terms (*prompt*, *token*, *deep learning*, often
alongside a native gloss). Borrowed nouns **take Romanian inflection**: *prompt → prompturi*, *token
→ tokenuri* — respect the case/number (§4), don't freeze them in the citation form.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term, give target term + original + one short plain clause, then use the target
term alone afterwards. Instantiated in Romanian with a sourced term:

> **inteligență artificială** (artificial intelligence, IA) — capacitatea unei mașini de a imita
> abilități ale gândirii umane. *(explanatory clause authored per the sandwich format; the term
> itself is sourced below.)* Then **inteligență artificială** (or **IA**) alone on every later
> mention.

**Seed field vocabulary (AI/ML).** Freeze the chosen forms in the project glossary and don't mix
competing renderings. Rows tagged **(localization source) ⚠** come from a labeled enterprise
software **vendor** page — kept because non-vendor references lacked the operational term, and per the
vendor-neutral scrub the vendor is **not named** and the row stays ⚠.

| Concept (EN) | Romanian | Type | Provenance |
|---|---|---|---|
| artificial intelligence | **inteligență artificială (IA)** | calque | „inteligența artificială (IA) este inteligența mașinilor” — ro.wikipedia (AI) |
| machine learning | **învățare automată** | calque | „Învățare automată (în engleză, „machine learning”) este un subdomeniu al informaticii” — ro.wikipedia (ML) |
| neural network | **rețea neuronală** (also *rețea neurală*) | calque | ⚠ „Rețelele neurale … sunt o ramură din știința inteligenței artificiale” — ro.wikipedia (search summary) |
| training data | **date de antrenament** (also *date de antrenare*) | calque/hybrid | ⚠ „un set de date (numit date de antrenament), ajustându-și parametrii interni” — search summary |
| model | **model** | loan/internat. | „Modelele de limbaj mare … pot genera text de înaltă calitate” — ro.wikipedia (AI) |
| dataset | **set de date** | calque | ⚠ „Setul de date folosit pentru învățare poartă numele de set de antrenament” — search summary |
| prompt | **prompt** (pl. *prompturi*) | loanword | ⚠ „Un prompt AI este o instrucțiune text pe care o dai unui model” — search summary (prompturiai.ro) |
| token | **token** (pl. *tokenuri*) | loanword | ⚠ „Un „token” poate fi un cuvânt, o parte dintr-un cuvânt … sau chiar un semn de punctuație.” — **(localization source)** |
| fine-tuning | **ajustare fină** (also kept: *fine-tuning*) | calque/loan | ⚠ „… pregătirea datelor, pre-antrenarea, ajustarea fină și tehnicile de aliniere.” — **(localization source)** |
| inference | **inferență** | calque | ⚠ „… folosind un proces numit inferență de model.” — **(localization source)** |
| algorithm | **algoritm** | loan/internat. | „Un algoritm este un set de instrucțiuni neechivoce pe care un calculator … le poate executa.” — ro.wikipedia (AI) |
| deep learning | **învățare profundă** (EN *deep learning* also current) | calque/loan | „Deep learning a început să domine reperele din industrie în 2012” — ro.wikipedia (AI) |
| supervised learning | **învățare supervizată** (also *supravegheată*) | calque | ⚠ „Învățarea supravegheată implică antrenarea unui model pe un set de date etichetat” — search summary |
| unsupervised learning | **învățare nesupervizată** (also *nesupravegheată*) | calque | ⚠ „… ne confruntăm cu date care nu sunt etichetate … și explorăm setul de date” — search summary |
| large language model | **model lingvistic mare (LLM)** | calque | „Un model lingvistic mare (în engleză large language models, abreviat LLM)” — ro.wikipedia (LLM) |
| hallucination | **halucinație** | calque | ⚠ „LLM-urile experimentează … un fenomen numit halucinație …” — **(localization source)** |

**Consistency notes (pick one, freeze it):**
- *rețea neuronală* vs *rețea neurală* — recommend **neuronală** (more transparent to learners).
- *supervizată/nesupervizată* (calque) vs *supravegheată/nesupravegheată* (native) — pick one.
- *date de antrenament* vs *date de antrenare* — both fine; standardize.
- Keep borrowed *prompt / token / deep learning* as-is for a technical audience; **gloss once** in
  plain Romanian on first use for a general educational audience.

Sources: ro.wikipedia (AI, ML, rețea neurală, LLM) — non-vendor reference; operational rows =
**labeled localization-vendor source, vendor unnamed per scrub, kept ⚠**; prompturiai.ro / scribd —
unofficial, ⚠. *No AI product/model/company names are used per the vendor-neutral scrub.*

---

## 7. Idiom anti-patterns

**⚠ Translator-judgment section, native-speaker confirmation pending.** These renderings are
translator best-practice recommendations, **not** backed by a single dictionary citation — they are
standard-usage judgments. Prefer the idiomatic column; the calque column is the naive output to
avoid.

| English phrase | Idiomatic Romanian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | **pas cu pas** | *pas prin pas* | translator craft, unsourced |
| under the hood | **cum funcționează pe dinăuntru / în spatele scenei** | *sub capotă* (literal car-hood) | translator craft, unsourced |
| behind the scenes | **în culise** | *în spatele scenelor* (calque of plural "scenes") | translator craft, unsourced |
| rule of thumb | **regulă generală / regulă empirică** | *regula degetului mare* | translator craft, unsourced |
| out of the box | **gata de utilizare / din start** | *în afara cutiei* | translator craft, unsourced |
| keep in mind | **ține minte / reține** | *ține în minte* | translator craft, unsourced |
| trial and error | **încercare și eroare** | *proces și greșeală* | translator craft, unsourced |
| at a glance | **dintr-o privire** | *la o privire / la o sclipire* | translator craft, unsourced |
| the big picture | **imaginea de ansamblu** | *poza cea mare* | translator craft, unsourced |
| hands-on | **practic / aplicat** | *mâini-pe* | translator craft, unsourced |
| a black box | **cutie neagră** ✅ (this calque IS the accepted term) | — (calque is correct here) | translator craft, unsourced |
| to fine-tune (fig.) | **a ajusta / a rafina / a pune la punct** | *a acorda fin* | translator craft, unsourced |
| garbage in, garbage out | **gunoi la intrare, gunoi la ieșire** (often kept in EN + glossed) | (word-salad literal) | translator craft, unsourced |

Note the useful asymmetry: **most idioms must be de-calqued**, but a few technical metaphors
(*cutie neagră* = black box) have been adopted as the standard term and the calque is correct. When
unsure, prefer the plain descriptive Romanian over a clever idiom in educational copy. The general
law from [translation-quality](../translation-quality.md) applies: if a mental back-translation lands
exactly on the English wording, it is too literal — rework it.

Sources: translator best-practice judgments; ⚠ not individually citation-backed, flagged as
recommendations — native-speaker confirmation pending.

---

## 8. Simplified-language pendant (`ro-easy`)

Romanian has no codified plain-language norm, so this section follows the **uniform substitute
procedure** of [language-guide-authoring](../language-guide-authoring.md) §8 — subsections 8a–8g, in
that order, the same seven answers in the same seven places as every other guide built this way.

### 8a. ❌ / ⚠ The honest negative — what was searched, and what came back

**Established absence for the bodies that could be reached; an inconclusive search for two that
could not.** The two claims are kept apart on purpose.

| Body that would hold such a norm | Result | Level |
|---|---|---|
| **Inclusion Europe**, whose *Information for all* rules are the pan-European easy-to-read reference | The standards page says the rules can be downloaded **in English** and adds: *"You can also find the rules in 15 other languages."* Its own language menu enumerates them: English, Français, Deutsch, Italiano, Español, Hrvatski, Čeština, Eesti, Suomi, Magyar, Latviešu, Lithuanian, polski, Português, Slovenčina, Slovenian. **Romanian is not in that list.** | ❌ **established for this body** |
| **ASRO**, the Romanian standards body — the only place a national adoption of **ISO 24495-1:2023** (*Plain language*) would live | Its online catalog returned **HTTP 403** to this fetch, twice, on two different search paths. **Nothing was learned either way.** | ⚠ **not checked** |
| **ANPD**, Romania's disability-rights authority — the plausible home of an easy-read requirement | The accessibility framework page returned **HTTP 503**. **Nothing was learned either way.** | ⚠ **not checked** |
| **Academia Română / Institutul de Lingvistică** (§2) | The Academy's normative output is **orthography and morphology** — DOOM3. No plain-language document was located under it. **Absence of a located document is not proof of absence.** | ⚠ |

**What does exist in Romanian, and what tier it sits at:**

- A **humanitarian-sector tipsheet in Romanian**, *„Ce este limbajul simplu?”*, published jointly by
  a language-services NGO, an aid organization, and a volunteer-translator organization
  (November 2022). It is a **translated international tipsheet, not a Romanian norm** — Community
  tier — but it is the only Romanian-language plain-language guidance this pass located, and it is
  quotable: *„Utilizați doar propoziții scurte (mai puțin de 20 de cuvinte în engleză).”* — note that
  its own sentence-length figure is **explicitly stated for English**, not for Romanian. It also
  says *„Folosiți cuvinte obișnuite, din viața de zi cu zi”* and *„Folosiți diateza activă”*.
- **Graded readers for learners** (*Romanian Easy Readers*, levels A/B/C) — pedagogical, not an
  accessibility standard. ⚠ <https://www.easy-readers.ro/romanian-easy-readers-lectura-usoara-in-limba-romana/>
- **Simplified school texts** for pupils with learning difficulties (Asociația Supra) —
  special-education material, not a general norm. ⚠

> **→ Consequence.** `ro-easy` **inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md) — one idea per sentence, ~8–12 words,
> everyday words, say what *is*, one word per thing, digits for numbers, a one-line "what is this"
> opener. 8b–8f below are the **Romanian-specific layer on top of that**, and 8d is the part a
> translator will otherwise get backwards.

### 8b. Name the axis — Romanian's two Latin layers

**Hypothesis, not yet a finding:** what separates harder from plainer Romanian is **not** distance
from Latin. Romanian's plainest words *are* Latin. The split is between the **inherited** layer
(words that came down through speech) and the **re-borrowed neological** layer taken ready-made out
of French and Latin in the nineteenth century.

The encyclopedia's vocabulary article states both halves, and cites Brâncuș 2005 for the first
(**Community tier resting on an academic source**, not an academy publication):

> „**Vocabularul de bază al limbii române este în cea mai mare parte moștenit din latină.** […] Este
> revelator în această privință că 186 de cuvinte, adică 89,85% din cele 207 cuvinte pe care le
> conține lista Swadesh a limbii române sunt de această origine. **Sunt numai circa 2.000 de cuvinte
> moștenite din latină**, ceea ce nu este mult față de vocabularul total de circa 150.000 de cuvinte,
> **dar cele 2.000 fac parte din segmentul cel mai important al vocabularului.** Îi aparțin aproape
> toate cuvintele gramaticale și numeralele cardinale, precum și adjectivele, adverbele și verbele cu
> **sensul cel mai general**.”

> „**În secolul al XIX-lea**, societatea românească a început să se modernizeze sub influența Europei
> Occidentale, fenomen care a avut drept corolar, printre altele, **împrumutul masiv de cuvinte, mai
> ales franceze, latine și italiene**.”

The etymologies confirm the two layers word by word. DEX '09, via dexonline: *a face* „– Lat.
facere”, *a cere* „– Lat. quaerere”, *a începe* „– Lat. incipere”, *a vedea* „– Lat. videre”,
*a schimba* „– Lat. \*excambiare”, *a cumpăra* „– Lat. comparare” against *a utiliza* „– Din fr.
utiliser”, *a efectua* „– Din fr. effectuer, lat. effectuare”, *a solicita* „– Din fr. solliciter,
lat. sollicitare”, *a necesita* „– Din fr. nécessiter”, *a iniția* „– Din fr. initier, lat.
initiare”, *ulterior* „– Din fr. ultérieur, lat. ulterior”, *suplimentar* „– Din fr.
supplémentaire”, *a modifica* „– Din lat. modificare”.

**Two words a translator would file on this axis do not belong on it at all:** *a achiziționa* is an
internal derivation (DEX '09: „– Achiziție + suf. -ona”) and *a implementa* is an **anglicism**
(DEX '09: „– După engl. implement”).

**So the axis is: neological re-borrowing → inherited word.** 8c asks whether it survives counting.

### 8c. Measure the axis — two Romanian corpora, plus an independent cross-check

| Corpus | What it is | Size |
|---|---|---|
| **School** | **505 lesson pages** from a Romanian secondary-school lesson platform, grades V–VIII, written by teachers **for pupils** | 1,811,688 characters, **281,961 word tokens** |
| **Administrative** | **351 press releases** of the **Government of Romania** — the register that produces the neological layer at full strength | 981,058 characters, **134,993 word tokens** |
| **Cross-check** | Romanian-encyclopedia `insource:` **page** counts (article namespace, not occurrence counts) — a volunteer corpus with a completely different contributor base | whole ro article space |

Method: sitemap/listing enumeration, raw fetch, body extraction by content container, counts
normalized **per 100,000 word tokens**; raw token counts are given for every row so a thin signal is
visible as thin. Search patterns are Unicode-letter-bounded stems, not `\b` — an ASCII word boundary
would have split every Romanian word at its diacritic.

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **Two publishers, not one.** The directive's preferred design is one publisher's standard and
>    plainer editions; no Romanian publisher was found issuing both. What is measured here is
>    therefore **school register vs administrative register**, which is why only *general*
>    vocabulary is tabled — never a topic word. A content word would measure subject matter.
> 2. **The school corpus is not easy-language.** It is expository prose written by adults for
>    12–15-year-olds. **No Romanian easy-read corpus was located (8a)**; this is the closest
>    reachable analog.
> 3. **Frequency is not comprehension.** These rows say which word the pupil-facing register
>    *actually uses*. **No Romanian readability formula or comprehension study was located.**
> 4. **Romania only.** Both corpora are Romania-based; nothing here is established for Moldova (§9).

**Two by-products worth recording, since §3 makes claims about them.** First, the corpus
independently corroborates §3's cedilla trap from live Romanian publishing: the government corpus
carried **613** legacy cedilla characters (ş, ţ) against **62** in the school corpus — the wrong
letters are still being emitted by a state publisher today, and were normalized to ș/ț before
counting. Second, an entity-decoding bug in the first extraction pass silently deleted **every î and
â** from the government corpus and produced a table of confident, wrong numbers; it was caught by
counting the preposition **în**, which came back **zero** in 135k tokens of Romanian. **Check that a
common word is present before trusting a corpus.**

#### 8c-i. Where the axis holds

Left column = the neological form, right = the inherited or plain form. **Ratio** is school
per-100k ÷ administrative per-100k, so a number **below 1** means the word belongs to the
administrative register.

| Neological | Everyday | School /100k (raw) | Admin /100k (raw) | Ratio | Cross-check (pages) |
|---|---|---|---|---|---|
| **a utiliza** | **a folosi** | 1.8 (5) | 57.0 (77) | **0.03** | *a utilizat* 888 vs *a folosit* 5,713 |
| **a solicita** | **a cere** | 0.7 (2) | 65.9 (89) | **0.01** | *a solicitat* 1,396 vs *a cerut* 5,464 |
| **a modifica** | **a schimba** | 7.1 (20) | 80.7 (109) | **0.09** | *a modificat* 1,090 vs *a schimbat* 4,939 |
| **a achiziționa** | **a cumpăra** | **0.0 (0)** | 56.3 (76) | **0.00** | *a achiziționat* 1,648 vs *a cumpărat* 2,467 |
| **a implementa** | **a pune în practică** | **0.0 (0)** | 162.2 (219) | **0.00** | — |
| **a realiza** | **a face** | 6.0 (17) | 139.3 (188) | **0.04** | — |
| **a asigura** | (rephrase) | 1.8 (5) | 174.8 (236) | **0.01** | — |
| **a necesita** | **a avea nevoie de** | 1.1 (3) | 45.9 (62) | **0.02** | — |
| **a efectua** | **a face** | 11.7 (33) | 41.5 (56) | **0.28** | — |
| **în vederea** | **pentru** | 0.7 (2) | 43.7 (59) | **0.02** | — |
| **a iniția** | **a începe** | 14.5 (41) | 60.0 (81) | **0.24** | — |
| **suplimentar** | **în plus** | 9.9 (28) | 45.9 (62) | **0.22** | — |
| **a menționa** | **a spune** | 12.1 (34) | 58.5 (79) | **0.21** | — |
| **a proceda** | **a face** | 13.8 (39) | 45.2 (61) | **0.31** | — |
| **ulterior** | **mai târziu** | 0.7 (2) | 13.3 (18) | **0.05** | ⚠ *ulterior* 27,461 vs *mai târziu* 26,514 — **near parity** |
| **dificil** | **greu** | 3.5 (10) | 9.6 (13) | **0.37** | *greu* runs 14.2 school vs 6.7 admin — the pair splits cleanly |
| **a prezenta** | **a arăta** | 34.8 (98) | 88.2 (119) | **0.39** | *a arăta* runs 216.7 vs 56.3 |

The plain side moves the opposite way, which is what makes the axis real rather than an artifact of
one column: **a folosi 367.8 vs 14.8**, **a cere 70.2 vs 23.0**, **a face 284.4 vs 140.7**,
**a vedea 111.0 vs 11.1**, **a înțelege 391.5 vs 22.2**, **a găsi 102.5 vs 12.6**.

**Three rows in the previous edition of this table did not survive the count**, and saying so is the
point of counting:

- **`a vizualiza → a vedea` is not a register pair.** *a vizualiza* occurs **13 times in the
  pupil-facing corpus and 0 times in 134,993 tokens of government prose.** It is screen vocabulary,
  not administrative vocabulary — the row had it exactly backwards.
- **`suplimentar → în plus`: only the left half is evidence.** *în plus* runs 8.5 school vs 6.7
  admin — flat. The row survives because *suplimentar* is administrative, not because *în plus* is
  plain.
- **`a iniția → a începe`: same shape.** *a începe* runs 74.5 vs 79.3 — flat. It is simply the
  ordinary verb in both registers, which makes it a safe target and useless as evidence.
- **`a debuta`** rests on 1 school and 3 admin tokens. **Too thin to keep as a rule.**

### 8d. 🔴 Do NOT "simplify" these — where the measurement contradicts the instinct

**This is the highest-value table in §8.** Every row is a swap that "neologism = hard, inherited
Romanian = easy" recommends, and that the corpora refute. A translator applying the 8b axis
mechanically moves the text *away* from the register a Romanian pupil actually reads.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**a explica** → **a lămuri**~~ | *a explica* is a French neologism (DEX '09: „– Din fr. expliquer, lat. explicare”) and *a lămuri* is the inherited word („– Lat. lamina sau \*lam(i)nula”) — so the axis predicts the swap. Measured: **a explica 231.2 per 100k in the pupil-facing corpus against 8.1 in government prose (652 vs 11 tokens)**, a 28× school skew; *a lămuri* scores **4.6 (13 tokens) and 0.0**. The neologism is the school word by roughly fifty to one. |
| ~~**exemplu** → **pildă**~~ | *exemplu* („– Din fr. exemple, lat. exemplum”) scores **321.7 school vs 19.3 admin (907 vs 26)**. *pildă* occurs **once** in 281,961 pupil-facing tokens — and it is not even on the axis: DEX '09 gives it as „– Din magh. példa”, a **Hungarian** loan. |
| ~~**rapid** → **repede**~~ | The cleanest case in Romanian, because both descend from the *same* Latin word: *repede* is the inherited reflex („– Lat. rapidus, rapide”), *rapid* the nineteenth-century re-borrowing („– Din fr. rapide, lat. rapidus”). Measured: **rapid 86.9 vs repede 18.8 in the school corpus** — the re-borrowed form is **4.6× commoner in writing for children**. The cross-check agrees independently: **10,630 pages vs 4,428**. |
| ~~**a verifica**, **a identifica**, **a evita** → native paraphrases~~ | All three are French neologisms by DEX '09 („– Din fr. vérifier / identifier / éviter”) and all three are **school-skewed, not administration-skewed**: *a verifica* **205.3 vs 29.6 (6.9×)**, *a identifica* **164.6 vs 46.7 (3.5×)**, *a evita* **24.5 vs 5.2 (4.7×)**. These are the verbs a Romanian lesson is written with. |
| ~~**element**, **structură** → native paraphrases~~ | „– Din fr. élément” and „– Din fr. structurer”, and again school-skewed: **119.9 vs 20.0 (6.0×)** and **119.2 vs 42.2 (2.8×)**. |
| ~~**important** → **însemnat**~~ | *important* is a French neologism („– Din fr. important”) and **is** administration-skewed (37.6 vs 124.5) — so far so good. But the inherited alternative is not there to swap to: ***însemnat* occurs 0 times in the school corpus and 3 times in the administrative one.** The swap replaces a common word with a word that is not in use. |
| ~~reaching for the inherited synonym in general~~ | The inherited words a translator reaches for first are **near-absent from both corpora**: *a lămuri* 13 / 0, *pildă* 1 / 0, *a pricepe* 1 / 0, *a ocoli* 2 / 0, *a pomeni* 0 / 0, *însemnat* 0 / 3. **"Simplifying" this way trades a common word for a rare one** — the exact failure the procedure exists to catch. |

**Why the instinct fails — and this is sourced, not inferred.** The same encyclopedia article that
establishes the axis also records that the nineteenth-century borrowings **displaced** the inherited
words rather than sitting above them:

> „Mai ales din secolul al XIX-lea, multe cuvinte slave, grecești și turcești au fost înlocuite cu
> cuvinte latine și romanice occidentale. De exemplu, cuvântul slav *rod* a primit sinonimul latinesc
> *fruct* (**înlocuind moștenitul *frupt***), ceea ce a făcut ca *rod* să mai fie folosit numai în
> sens figurat și, **în plus, să fie simțit ca învechit**.”

The borrowed *fruct* is the everyday word; the inherited *frupt* is gone and the older synonym reads
as **învechit** — archaic. **A "return to the inherited word" can land on an archaism, and the
source says so in its own words.**

> **→ The rule that follows. In Romanian, do not simplify by etymology.** Simplify by **structure**
> (8f), and make a lexical swap only where a *measured* register difference supports it — never
> because a word looks like a French borrowing.

### 8e. 🔑 The address decision for `ro-easy`

> **Decision, recorded so nobody "fixes" it: `ro-easy` keeps §4.1's tu. The simplified variant does
> NOT change the address form in either direction.**

- ✅ `ro-easy`, same as `ro`: **Apasă butonul.** · **Alege un model.**
- ❌ `ro-easy` switched to the plural: **Apăsați butonul.** · **Alegeți un model.**

**Three reasons, in order of weight:**

1. **Register is a user decision, not the pendant's to change.** §4.1 records **tu** for lessons, UI,
   and microcopy under [human-gate](../human-gate.md). A variant that quietly re-registers the
   product would make the same reader hear two different voices depending on which toggle they are
   on.
2. **In Romanian the switch is not a pronoun swap — it re-conjugates every verb** (§4.1), and the
   polite form takes **plural agreement even for one person**. Every instruction gets
   morphologically heavier: **apeși → apăsați**, **vezi → vedeți**, **reține → rețineți**. For a
   variant whose main lever is *reducing* morphological weight (8f), that is the wrong direction.
   ⚠ **Craft, derived from §4.1's sourced agreement facts; no source measures the reading cost.**
3. **Consistency beats register tuning** for a reader moving between `ro` and `ro-easy`.

> ⚠ **The one piece of counter-evidence, recorded rather than buried.** The only Romanian-language
> plain-language guidance located (8a, Community tier) does **not** use *tu*. It addresses its own
> reader in the polite plural throughout — *„Este clar mesajul dumneavoastră?”*, *„Vă adresați
> publicului în mod direct?”* — and its explicit recommendation is *„Folosiți des pronumele „voi” și
> „noi”, pentru a vă ajuta să vă conectați cu cititorul”*. **That is one Community-tier document
> against a recorded user decision, and it is the general finding elsewhere in this kit that a
> simplified variant must not drop to a familiar form.** The Romanian case is unusual only because
> the base variant is *already* familiar, so there is no drop to make. **Flagged for the human gate:
> if a native reviewer rules that institutional *tu* reads as condescending to adult `ro-easy`
> readers, that decision belongs in §4.1 and changes both variants together — never `ro-easy` alone.**

### 8f. What `ro-easy` is built on — in order of leverage

1. **Structure first — this is the main lever.** One idea per sentence; break the long
   preposition-plus-genitive chains that Romanian administrative prose is made of. §4.2 (4) shows
   the mechanism: case rides on the article ending, so *parametrii modelului rețelei companiei*
   stacks four nouns before the reader reaches a verb. **Split it into two sentences with a verb in
   each.** This **overrides nothing** in the base rules — it instantiates
   [accessibility-workflow](../accessibility-workflow.md)'s "no nested or fronted clauses" for
   Romanian's actual failure shape.
2. **Morphology second.** Prefer the shorter *tu* forms (8e). Prefer an explicit subject and an
   active verb over the reflexive-passive that administrative Romanian defaults to (*se
   efectuează*, *se solicită*) — note that both of those verbs are already on the 8c list, so the
   structural and lexical fixes coincide. ⚠ **Craft, built from §4's sourced agreement facts.**
3. **Vocabulary last, and only from the 8c table.** This is where `ro-easy` **overrides** the base
   rule *"everyday words"*: in Romanian, **everyday does not mean inherited**. Use the measured
   left-hand column; do not extend the table by etymology (8d).
4. **Term preservation is unchanged and binding.** Keep *prompt*, *token*, *inteligență
   artificială* — then „adică: …” plus one concrete example. **Never a folksy stand-in**, and never
   a different word for the same thing on the next screen
   ([translation-quality](../translation-quality.md)).

### 8g. What is still open

1. **ASRO (HTTP 403) and ANPD (HTTP 503) were never reached.** Whether Romania has adopted
   ISO 24495-1, and whether ANPD imposes any easy-read duty, are **open questions, not answered
   ones**. This is the single highest-value item for the next round.
2. **No Romanian easy-read corpus was located.** The measurement rests on school prose as a proxy.
   If Asociația Supra's simplified school texts are obtainable in bulk, they would be a genuinely
   plainer corpus and should replace the proxy.
3. **Single-publisher control was not achieved.** A Romanian publisher issuing both a standard and a
   plainer edition would remove the topic-drift caveat entirely.
4. **`ulterior / mai târziu` splits between corpora and cross-check** (0.05 ratio vs near parity on
   the encyclopedia). One of the two corpora is measuring something other than register here, and
   the row should be treated as provisional.
5. **The 8e address question is open at the human gate** (see the counter-evidence note).
6. **Moldova is unmeasured.** Both corpora are Romania-based; §9's claim that one build serves both
   is not tested for the simplified variant.
7. **No Romanian readability metric or comprehension study was located** — every row here is a
   frequency claim, never a comprehension claim.

Sources: <https://easy-to-read.inclusion-europe.eu/european-standards/> ·
<https://www.inclusion-europe.eu/easy-to-read-standards-guidelines/> ·
<https://ro.wikipedia.org/wiki/Vocabularul_limbii_rom%C3%A2ne> (Community tier, citing Brâncuș 2005;
quotes verified against the article's raw wikitext) ·
**Etymologies and definitions** — <https://dexonline.ro/definitie/explica> and the sibling entries
*exemplu, rapid, repede, lămuri, pildă, verifica, identifica, evita, element, structura, important,
dificil, greu, ocoli, utiliza, efectua, solicita, necesita, achiziționa, iniția, modifica, ulterior,
suplimentar, implementa, folosi, cumpăra, cere, începe, schimba, vedea, face* — all fetched this
pass; etymologies quoted verbatim from the **DEX '09** article each page reproduces ·
**School corpus** — 505 lesson pages, <https://scoalavirtuala.ro/>, enumerated via
<https://scoalavirtuala.ro/sitemap.xml> ·
**Administrative corpus** — 351 press releases, <https://gov.ro/ro/media/comunicate> ·
**Cross-check** — `insource:` page counts via <https://ro.wikipedia.org/w/api.php> ·
**Romanian plain-language tipsheet** (Community tier, humanitarian sector, November 2022) —
<https://clearglobal.org/wp-content/uploads/2022/12/CLEAR-Global-What-is-plain-language-tipsheet-Romanian.pdf> ·
<https://www.easy-readers.ro/romanian-easy-readers-lectura-usoara-in-limba-romana/> ⚠ ·
<https://www.asociatia-supra.ro/texte-simplificate-pentru-limba-si-literatura-romana-de-descarcat/> ⚠ ·
ASRO catalog (HTTP 403, not reached) · ANPD accessibility framework (HTTP 503, not reached) ·
[accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md) · [human-gate](../human-gate.md)

---

## 9. Regional variation — Romania vs Moldova

**⚠ Community-tier section (Romanian Wikipedia).** The neutrality recommendation is editorial;
native-speaker confirmation pending.

**Same standard language.** Moldova's own institutions affirm identity with Romanian:
- „româna și moldoveneasca sunt una și aceeași limbă” (Justice Minister Ion Morei, 2002) —
  <https://ro.wikipedia.org/wiki/Limba_moldoveneasc%C4%83>
- Parliament of the Republic of Moldova, 2023: „limba moldovenească nu există și că limba română este
  limba oficială” — same source.
- Both states use the **Latin alphabet**; the old Cyrillic "Moldovan" survives only in the breakaway
  Transnistria region.

**Differences that do exist (lexical, mostly under Russian influence in Moldova):**
- ⚠ Regionalisms: *curechi* (MD) vs *varză* (RO, "cabbage"); *păpușoi* (MD) vs *porumb* (RO, "corn")
  — search summary, ro.wikipedia (Limba moldovenească).
- Russian-origin everyday loans are more common in Moldova.
- **Currency differs** — RON in Romania, MDL in Moldova (§5).

**What "neutral" usage looks like.** Write **standard literary Romanian per DOOM3** (the
Bucharest/literary norm). It is fully understood in Moldova and is the safe default. Avoid
Muntenian/Moldovan-only regionalisms and Russian-origin colloquialisms. For AI/ML content the
terminology is **identical across both states**, so **no dialect branching is needed** — one Romanian
build serves both, with only currency/locale settings varying.

- ✅ neutral: **porumb**, **varză**, standard DOOM3 spelling · ✅ set currency per market (RON / MDL)
- ❌ defaulting to Moldovan regionalisms (*păpușoi*, *curechi*) or assuming RON for Moldovan users

Sources: <https://ro.wikipedia.org/wiki/Limba_moldoveneasc%C4%83> ·
<https://ro.wikipedia.org/wiki/Limbile_Republicii_Moldova> (community-tier; neutrality recommendation
editorial — native-speaker confirmation pending)

---

