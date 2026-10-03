<!-- base -->
# lang-no — Norwegian (norsk / Bokmål) — language guide

> **Setup & sources live in [`no.setup.md`](no.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** norsk (Bokmål) / Norwegian.
**BCP 47 code (base):** `no` — the macrolanguage tag. The base target of this guide is
**Bokmål** (`nb`); the co-equal written standard **Nynorsk** (`nn`) is a *separate* target,
not a variant of this file (see §9).
**BCP 47 code (simplified variant):** `no-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`no-x-simple`), but the kit token `no-easy` is the one
that counts here.
**Speaker reach:** ~**5.5 million** inhabitants of Norway, where Norwegian is co-official
alongside the Sámi languages ("Norsk er det språket som brukes av flest i Norge, og er offisielt
språk i landet ved siden av de samiske språkene." — snl.no/norsk). Note this is a **written-norm**
guide, not a speaker-count split: essentially all Norwegians read both Bokmål and Nynorsk, so the
~90 % / 10–15 % figure below describes *which written standard people write*, not two populations.
**Script + direction:** Latin script plus three extra letters — **æ ø å** (upper Æ Ø Å), which
sort *last* in that order; **left-to-right**. The extra letters live in Latin-1 Supplement
(U+0080–U+00FF), so glyph coverage is rarely a problem in modern fonts — the real risks are
encoding (mojibake) and punctuation, not shaping.
**Status:** planned — **not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `no` (Bokmål) and the `no-easy` pendant. The **strong** sections (typography,
authorities, numbers/dates/currency, terminology, plain-language/klarspråk, Bokmål-vs-Nynorsk) rest
on **Store norske leksikon (snl.no)**, **Korrekturavdelingen.no**, and **ub.uio.no**, and carry
verbatim quotes. The **thinner** sections (some grammar example pairs, idioms, and three terminology
rows) rest on language-learning references and general field usage, and are flagged as such at point
of use. Per the authoring directive's "second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)),
this header records the missing native-speaker gap honestly.
**Easy or hard for this kit:** mostly easy — Latin script, whitespace tokenization, LTR, no shaping
or bidi. The things that actually bite: (1) **UTF-8 integrity for æ ø å** — a non-UTF-8 pipeline
produces mojibake (Ã¦ / Ã¸ / Ã¥), and ASCII digraphs (ae/oe/aa) are wrong; (2) **Norwegian
quotation marks « »** (guillemets) plus **comma-decimal / space-grouping** numbers, both of which an
English pipeline gets wrong by default; and (3) **the Bokmål/Nynorsk split** — two official written
standards that must never be mixed in one text, where "Norwegian" is not a single translation target
(§9).

Sources: <https://snl.no/norsk> · <https://fonts.google.com/noto>

---

## 1. Header block

See above. One-line orientation: Norwegian (Bokmål) is a North-Germanic, SVO-with-strict-V2, LTR
language in Latin script with three extra vowels (æ ø å) and suffixed definiteness; the localization
risks concentrate in **encoding integrity (æ ø å), Norwegian-specific punctuation and number
formatting, and the two-written-standard split (Bokmål vs Nynorsk)** rather than in scripting or
direction.

---

## 4. Grammar for translators (Bokmål)

**(Mixed: word order + register are sourced; the feature example pairs are partly illustrative
correct-form-only — native-speaker confirmation pending where noted.)**

**Basic word order.** SVO with a strict **V2 rule**: the finite verb is always the **second
constituent** in a main clause ("I norske helsetninger står verbet alltid på plass 2." —
lingu.no/V2). When a clause opens with anything other than the subject (an adverbial, an object),
subject and verb **invert**: *I morgen kommer jeg* ("Tomorrow come I"). The classic
English-interference error is to keep English order without inverting — lingu flags *"I morgen jeg
kommer"* as explicitly **FEIL** (wrong).

- ✅ inverted after fronted adverbial: **I morgen kommer jeg.**
- ❌ English order, no inversion: **I morgen jeg kommer.**

**Register — and the project's recorded choice.**

> **Register decision (human-gate): du (informal), moderate Bokmål — taken and recorded.**
> Modern Norwegian
> uses **du** ("you") universally, including formal and educational contexts; the old polite pronoun
> **De** is **archaic/ceremonial and is not used.** The base register is **moderate/mainstream
> Bokmål** with a friendly, direct voice — active verbs, short sentences — which is the
> **klarspråk** norm **Norwegian public authorities** are legally required to follow under
> språkloven, and which public-facing educational content conventionally adopts (§8). The legal
> duty binds the public sector; private educational content follows the norm by convention, not
> by law.
> **Binding for all second-person copy** in `no` and `no-easy`: address the reader as *du*, never
> *De*.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ du (the recorded register): **Klikk her.** · **Skriv inn navnet ditt.** · **Husk å lagre.**
- ❌ De (archaic): **Klikk her, er De snill.** · possessive **Deres** for a single reader.

**Five features that break a naive English→Norwegian translation:**

**(1) Definiteness is a suffix, not a preposed article.** "the model" = **modellen** (not *den
modell*); "the training data" = **treningsdataene**. English "the + noun" becomes a suffixed form
(-en/-et/-a/-ene). With an adjective, Bokmål uses **double definiteness** (article *and* suffix):
"the neural network" → **det nevrale nettverket**.

- ✅ **modellen** · **det nevrale nettverket**
- ❌ **den modell** · **det nevrale nettverk** (missing the definite suffix)

**(2) Three genders; adjective/article must agree.** *en algoritme* (m), *et nettverk* (n),
*ei/en bok* (f). Neuter singular indefinite adjective takes **-t** (*et dypt nettverk*);
plural/definite takes **-e** (*dype nettverk*). Copying English's invariant adjective produces
agreement errors.

- ✅ **et dypt nettverk** (neuter -t) · **dype nettverk** (plural -e)
- ❌ **et dyp nettverk** · **dyp nettverk** for the plural

**(3) V2 / inversion** (restated as a feature). Inserting an adverbial or fronting an object without
inverting the finite verb is the single most common calque error (see the pair above).

**(4) Compounds are written as one word.** English noun-noun phrases become closed compounds:
"language model" → **språkmodell**, "training set" → **treningssett**. "large language model" keeps
the adjective separate but compounds the noun → **stor språkmodell**. Splitting them ("særskriving")
is a real, frequent error.

- ✅ **språkmodell**, **treningssett**
- ❌ **språk modell**, **trenings sett**

**(5) No continuous aspect; simpler tense system.** English "is training / is being trained" → simple
present **trener / trenes** (or **blir trent**). The **-s passive** (*modellen trenes*) and the
periphrastic *bli*-passive (*modellen blir trent*) both exist; don't calque the English progressive
with an invented *er trening*-style construction. *(⚠ The exact passive-choice nuance is
usage-illustrative — native-speaker confirmation pending; the no-progressive rule itself is standard.)*

- ✅ **Modellen trenes.** / **Modellen blir trent.**
- ❌ **Modellen er trenende.** (calqued progressive)

Sources: <https://lingu.no/posts/v2-verbet-pa-annen-plass-setningen> ·
<https://snl.no/maskinl%C3%A6ring> (V2 + register sourced; feature example pairs partly illustrative
correct-form-only, native-speaker confirmation pending)

---

## 5. Numbers, dates, currency

**(Strong section — Korrekturavdelingen + open-std/CLDR-aligned locale.)**

**Decimal separator = comma.** Norwegian uses a **comma** for decimals, not a period: **3,14**.
Korrekturavdelingen warns that the grouping comma is an English trait, not a Norwegian one: "Engelsk – men ikke norsk – har komma når
store tall skal grupperes." The Bokmål locale reference confirms: "The decimal separator is COMMA
<,>" (open-std WG20 n854).

**Digit grouping = space** (a non-breaking / narrow no-break space), in groups of three from
**10 000** upward. Korrekturavdelingen: "Fra og med 10 000 ordnes tallet i grupper på tre sifre."
Four-digit numbers are usually written without a separator (*1500* or *1 500*). **Years take no
grouping:** *2024*, never *2 024*.

- ✅ Norwegian: **1 234,50** (space groups, comma decimal) · **2 500 000** · year **2024**
- ❌ English format: **1,234.50** (comma groups, period decimal) · year **2 024**

*(Historical caveat carried from the dossier: an older ISO/locale monetary spec used a period as the
thousands separator — "kr 9.876.543,21" — but current Språkrådet-aligned practice is the space.
Prefer the space; treat the period grouping as **legacy**.)*

**Dates.** Everyday/running text uses **day-month-year**: **10.8.1962** or **10.08.1962**
("Ingen mellomrom! Ikke skråstrek!" — no spaces, no slash). A written-out month is **lowercase**
with a space after the day's period: **10. august 2024** ("Navn på måneder skal ha liten
forbokstav." / "Merk mellomrommet etter punktumet!"). Technical/ISO **year-month-day**
(**1962-08-10**) is accepted for technical use (korrekturavdelingen.no/dato-aarstall — all verified
verbatim). **Time** uses a colon (Språkrådet-approved 2014): **14:30** (dot form *14.30* also seen).

- ✅ numeric: **10.08.1962** · ✅ written: **10. august 2024** · ✅ ISO: **1962-08-10** · time **14:30**
- ❌ **10. August 2024** (capitalized month) · ❌ **10/8-1962** (slash) · ❌ **8.10.1962** (US m-d-y)

**Currency.** The currency is the **krone** (plural *kroner*); abbreviation **kr** (ISO code
**NOK**). "kr" takes **no period** (measure/currency abbreviations are unpunctuated). In prose, spell
it out: **4500 kroner**. In compact form *kr* goes **before or after** the amount — **kr 500** or
**500 kr** — with *500 kroner* preferred in prose; decimals use the comma: **kr 1 499,90**. Use
**nkr** only if several currencies appear together.

- ✅ **500 kroner** / **kr 500** / **500 kr** / **kr 1 499,90**
- ❌ **kr. 500** (period on the abbreviation) · ❌ **$500** / **500 NOK** in end-user prose

**Display vs identifiers.** Format per the above for display; keep Western digits and ISO 8601
(YYYY-MM-DD) for backends, identifiers, and code.

Sources: <https://www.korrekturavdelingen.no/tall-siffer-gruppering.htm> ·
<https://www.korrekturavdelingen.no/dato-aarstall.htm> ·
<https://www.open-std.org/jtc1/sc22/wg20/docs/n854-Bokmal.htm> · <https://snl.no/tusenskille>

---

## 6. Terminology strategy (AI/ML, Bokmål)

**(Strong section for the policy and most rows; three rows are ⚠ unverified as marked.)**

**Loanword vs native-coinage practice.** Norwegian AI terminology mixes **native compounds**
(*maskinlæring*, *dyplæring*, *treningsdata*) with **direct English loans** kept where no settled
term exists (*token*, sometimes *prompt*). The umbrella term is **kunstig intelligens**, routinely
abbreviated **KI** (English "AI" is understood, but *KI* is the native abbreviation). **Working
rule:** prefer the established native term where one exists; keep well-known loanwords in their usual
form; introduce a native term and gloss the loan on first use.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give target term + original + one short plain clause, then
use the target term alone afterwards. Instantiated with a sourced term:

> **kunstig intelligens** (artificial intelligence, KI) — informasjonsteknologi som justerer sin egen
> aktivitet og derfor tilsynelatende virker intelligent. *(explanatory clause per the sandwich
> format; the term itself is sourced below.)* Then **kunstig intelligens** / **KI** alone on later
> mentions.

**Note on "prompt":** native-leaning texts use **ledetekst**; the plain loan *prompt* and *instruks*
also circulate. For an educational platform, introduce **ledetekst** and gloss *(prompt)* on first use.

**Seed field vocabulary (AI/ML, Bokmål).** Field-standard renderings; each sourced row carries the
dossier's verbatim quote. Freeze the chosen forms in the project glossary; don't mix competing
renderings.

| Concept (EN) | Norwegian (Bokmål) | Provenance (verbatim) |
|---|---|---|
| artificial intelligence | **kunstig intelligens (KI)** | "Kunstig intelligens er informasjonsteknologi som justerer sin egen aktivitet…" (snl.no/kunstig_intelligens) |
| machine learning | **maskinlæring** | "Maskinlæring er en spesialisering innen kunstig intelligens hvor man bruker statistiske metoder…" (snl.no/maskinlæring — verified verbatim) |
| neural network | **nevralt nettverk** (also *kunstig nevralt nettverk*) | "Nevrale nettverk er en teknikk som brukes som byggesteiner innen maskinlæring og kunstig intelligens." (snl.no/nevralt_nettverk) |
| training data | **treningsdata** | "Eksempeldataene som maskinlæringsmodeller lærer fra kalles treningsdata." (snl.no/generativ_kunstig_intelligens) |
| model | **modell** | "Modellen trenes opp på treningssettet." (snl.no/maskinlæring) |
| dataset | **datasett** | "Datasettet deles typisk opp i et treningssett og et testsett." (snl.no/maskinlæring — verified verbatim) |
| prompt | **ledetekst** / **instruks** (loan *prompt* common) | "Når du skriver en instruks (\"prompt\") i tekstboksen, genererer modellen et svar…" (ub.uio.no store språkmodeller) |
| token | **token** (loan; occ. *symbol/tekstbit*) | ⚠ unverified — no authoritative Norwegian gloss quoted; *token* used untranslated in Norwegian technical writing. |
| fine-tuning | **finjustering** | ⚠ unverified against a quote — *finjustering* is the established native calque but not quoted from an authority this pass. |
| inference | **inferens** / **slutning** | ⚠ unverified — both forms used; no authoritative quote captured. |
| algorithm | **algoritme** | "…forsøker algoritmen selv å finne strukturen i inngangsverdiene…" (snl.no/maskinlæring — *algoritme* confirmed present) |
| deep learning | **dyplæring** | "Dyplæring er en metode hvor man bygger et nevralt nettverk med mange lag." (snl.no/kunstig_intelligens) |
| supervised / unsupervised learning | **veiledet / ikke-veiledet læring** | "Maskinen finner en ukjent funksjon fra eksempler." (veiledet) / "…har maskinen ikke tilgang til utgangsverdier…" (ikke-veiledet) (snl.no/maskinlæring) |
| large language model | **stor språkmodell (LLM)** | "En stor språkmodell, fra engelsk Large Language Model (LLM), er en type kunstig intelligens (KI)…" (ub.uio.no) |
| hallucination | **hallusinasjon** | "Slike feilaktige eller oppdiktede svar kalles ofte hallusinasjoner." (snl.no/generativ_kunstig_intelligens) |

Project coinages (C1) keep their original spelling in Norwegian text and are owned by the term-sheet,
not this table.

Sources: <https://snl.no/kunstig_intelligens> · <https://snl.no/maskinl%C3%A6ring> ·
<https://snl.no/nevralt_nettverk> · <https://snl.no/generativ_kunstig_intelligens> ·
<https://www.ub.uio.no/fag/jus/ki-verktoy/store-sprakmodeller.html> (rows *token*, *finjustering*,
*inferens* are ⚠ unverified — field usage, not academy-sourced)

---

## 7. Idiom anti-patterns

**⚠ Dictionary/usage-grade section, native-speaker confirmation pending.** These renderings rest on
**Korrekturavdelingen** and **NAOB** for two entries and on general field usage for the rest — not an
academy idiom dictionary. Prefer the idiomatic column; the calque column is the naive output to avoid.

| English phrase | Idiomatic Norwegian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | **skritt for skritt** / **trinn for trinn** | *stønn for stønn* | *skritt for skritt* is itself the natural form (usage) |
| rule of thumb | **tommelfingerregel** | *tommelregel* / *tommel-regel* | naob.no/tommelfingerregel — "grov, overordnet regel som er anvendelig og lett å huske" |
| under the hood | **bak kulissene** / **under overflaten** / **slik det fungerer internt** | *under panseret* (literally the car hood — **not** used figuratively) | usage |
| keep in mind | **husk (at)** / **ha i mente** | *hold i sinnet* | usage |
| at first glance | **ved første øyekast** | *ved første blikk* (understood but weaker) | usage |
| in a nutshell | **kort fortalt** / **i korte trekk** | *i et nøtteskall* (calque; marked/foreign) | usage |
| trial and error | **prøving og feiling** | *prøve og feil* | usage |
| the big picture | **helhetsbildet** / **det store bildet** | *det store maleriet* | usage |
| hands-on | **praktisk** / **hands-on** (loan accepted) / **læring ved å gjøre** | *hender-på* | usage |
| out of the box | **rett ut av boksen** (product) / **ferdig oppsett**; for ideas **utenfor boksen** | *ut av esken* (context-wrong) | usage |
| get the hang of it | **få taket på det** | *få hengen av det* | usage |
| a piece of cake | **en lek** / **enkelt som bare det** | *et stykke kake* | usage |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: <https://naob.no/ordbok/tommelfingerregel> ·
<https://www.korrekturavdelingen.no/ord-uttrykk-idiomer.htm> (idiom renderings — native-speaker
confirmation pending)

---

## 8. Simplified-language pendant (`no-easy`)

**(Strong section for the standard — a named, law-backed Norwegian tradition exists, and the word
table below rests on the national plain-language list. The corpus measurement added in 8c is a
separate and much weaker instrument, and the first thing it establishes is its own blind spot.)**

Norwegian *has* a codified plain-language tradition, so **8a–8b** record a standard rather than an
absence. **8c** adds a machine measurement of two Norwegian corpora — and the honest headline is that
the measurement **cannot see** the national word list this section rests on. Nine of the list's words
occur **zero times in both corpora**, because the list targets **administrative and legal** Norwegian
and neither a newspaper nor a popular-science magazine contains that register. That is a finding
about the corpora, **not** evidence against the list; the list's dictionary entries remain the better
source and keep their place below. What the corpus *can* carry is **structure**. On the lexical side
only two rows moved at all, and **both of those run backwards**: no pair in these corpora comes back
supported.

### 8a. ✅ The standard: klarspråk, backed by law, with named authorities

**Named tradition: klarspråk (plain language), backed by law.** Norway has a strong, institutionalized
plain-language tradition — **klarspråk** (also *klart språk*). SNL defines it: "Klarspråk er
kommunikasjon som gjør at mottakerne kan finne informasjonen de trenger, forstå og vurdere
informasjonen og kunne bruke den." The three-part standard is "klart, korrekt og tilpasset
mottakerne." (snl.no/klarspråk — verified verbatim). It is a **legal requirement** for the public
sector under **språklova** (the Language Act): the statute was fetched from Lovdata this pass, and
the section number and wording are **primary-sourced** — **§ 9. Klart språk: "Offentlege organ
skal kommunisere på eit klart og korrekt språk som er tilpassa målgruppa."** (lov 21. mai 2021
nr. 42, on Lovdata — verified verbatim; the Act is written in **Nynorsk**, which is why the
statutory wording differs in form from the Bokmål paraphrase SNL gives. Quote the statute in
Nynorsk or paraphrase it in Bokmål — do not present a Bokmål rewording as the text of the law.)
*(This supersedes the earlier ⚠ on the section number: "§9" is correct.)*

**Maintaining organizations.** **Språkrådet** (lead), **Digitaliseringsdirektoratet (DigDir)** and
**KS** provide klarspråk guidance and resources for public digital services (snl.no/klarspråk —
confirmed verbatim that all three are named).

**Quantitative rules.** There is **no single mandated numeric readability threshold**, but klarspråk
guidance consistently prescribes: address the reader as **du**, use **active verbs**, **short
sentences (one idea per sentence)**, **common words over bureaucratic ones**, and **explain necessary
jargon**. Where the kit's own base rule sets a tighter ~8–12-word target, `no-easy` may use the
tighter kit figure; klarspråk supplies the sourced principles, not a competing number. The corpus in
8c gives the first Norwegian-specific number to sit beside them: the plain corpus averages **10.45**
words per sentence against **16.83** in the standard corpus, which lands just inside the kit target.

**Who this is for (sourced audience figure).** KS — one of the three klarspråk bodies named above —
puts the size of the audience at "For 15–20 prosent av voksne i Norge er det utfordrende å lese og
forstå tekster fra det offentlige", and adds the point that keeps `no-easy` from being treated as a
niche build: "Brukere med leseutfordringer utgjør ikke en egen målgruppe – de finnes i alle
målgrupper."

*(Note: Norwegian also has a "lettlest" easy-read tradition for cognitive accessibility, distinct from
klarspråk's plain-administrative focus; for an educational platform, klarspråk principles are the
primary reference. The plain-side corpus in 8c is a **lettlest** newspaper, which is worth keeping in
mind when reading its numbers: it is the easy-read tradition being measured, not klarspråk's own
administrative-rewrite output.)*

### 8b. The axis — kansellistil — and where the measurement moves it

**Name the axis: what the table strips out is kansellistil — Danish-chancery style.** The word table
below is not an arbitrary list of hard words; it is one specific historical layer. SNL: "Kansellistil
er en upersonlig og tung uttrykksform som man tidligere særlig brukte i regjeringskontorer
(kansellier), se departementsstil." (snl.no/kansellistil — verified verbatim). Bokmål grew out of
the Dano-Norwegian written language (§9), and the chancery register came with it; **the direction
`no-easy` simplification runs is from that chancery layer back to the everyday Norwegian word.**
Språkrådet maintains the list of exactly these words — **Kansellisten**, "Ord og uttrykk som kan
byttes ut" — and defines the layer in its own words: "Kansellisten er en liste med litt stive ord og
uttrykk som sjelden brukes i dagligspråket, men som ofte forekommer i brev og andre tekster fra det
offentlige. Slike «kanselliord» kan skape unødig avstand mellom avsender og mottaker." A translator
who knows the axis can extend the table and look up new cases in Kansellisten; a translator who only
has the table can do neither.

**⚠ Where the measurement relocates the axis.** Kansellisten's own framing already puts sentence
architecture ahead of vocabulary, and the corpus counts in 8c push much further in that direction:
between the two Norwegian corpora measured, **sentence length and subordination separate plain from
standard prose cleanly, and vocabulary does not separate them at all.** Mean sentence length runs
**10.45 against 16.83** words and the subordinate-clause marker `som` runs **968.8 against 1,692.7**
per 100k, while every chancery word the corpus could reach came back flat, reversed, or absent —
**not one came back supported.**
This does **not** demote Kansellisten — the corpora simply do not contain the register it targets
(8c) — but it does fix the order of work: **rebuild the sentence first, swap words second.**

**Structural overlay (Official — Språkrådet's own rewrite rules).** Kansellisten lists the markers of
kansellistil as "lange og kompliserte setninger med mange innskudd", "upersonlige uttrykksmåter (man
og en, passiv)", "substantivtunge setninger", "partisippformer (foreliggende, beliggende,
hjemmehørende, gjeldende)", "innskutte komplekse ledd", "enkel bestemmelse (denne bok, dette
dokument)" and "stive og foreldede ord og uttrykk". Four of its rewrite rules transfer directly to
`no-easy`, and they matter **more** than the word list because they change sentences, not tokens —
which is exactly what the corpus numbers above independently say:

1. **Verb, not noun.** "I stedet for «foreta en vurdering av saken» kan du skrive «vurdere saken»."
   And: "I stedet for «Informasjon fås ved henvendelse til …» kan du skrive «Du kan få informasjon
   hvis du henvender deg til …»."
2. **Be personal.** "I stedet for «Det vises til brev av ...» kan du skrive «Vi (eller f.eks.
   departementet) viser til brev av ...»." This is the same lever as the recorded *du* address.
3. **Unpack participles and embedded complex phrases.** "det ovenfor beskrevne → det som er beskrevet
   ovenfor"; "de i erklæringen øvrige klausuler → de øvrige klausulene i erklæringen".
4. **Double definiteness, not single.** "denne lov / dette dokument" reads stiff; write *denne loven*,
   *dette dokumentet* — which is also the §4 rule, so `no-easy` gets it for free.

- ✅ `no-easy`: **Du kan få informasjon hvis du henvender deg til oss. Vi vurderer saken.**
- ❌ kansellistil: **Informasjon fås ved henvendelse til undertegnede, hvoretter det vil bli foretatt
  en vurdering av den foreliggende sak.**

**Complex → everyday word table.** **Tier is marked per row, and the tiers are unchanged by the
corpus measurement.** **Kansellisten** = the pair is in **Språkrådet's own list**, quoted in the
dictionary's wording. **⚠ craft** = the word is not in Kansellisten and the pair is this guide's
judgment — plausible klarspråk advice, not a Språkrådet ruling. **The table as a whole still wants a
native-speaker pass**: a word list cannot tell you which substitution is right in a given sentence,
and Kansellisten says so of itself — "Kansellisten er ment som en veiledning, ikke som en
«svarteliste»." The corpus column in 8c is **not** a tier and must not be read as one: a row marked
*untestable there* is a row the corpora could not reach, and it keeps its Kansellisten standing in
full.

| Formal / bureaucratic | Everyday (klarspråk) | English | Tier |
|---|---|---|---|
| anvendelse / komme til anvendelse | bruk / brukes, gjelde | use / apply | **Kansellisten**: "anvendelse → bruk"; "komme til anvendelse → kunne brukes, bli brukt, bli praktisert, gjelde" |
| vedrørende / vedrøre | om, som gjelder | about / regarding | **Kansellisten**: "vedrørende → om, i forbindelse med, som gjelder, som henger sammen med"; "vedrøre → angå, gjelde, ha sammenheng med" |
| angående | om | concerning | **Kansellisten**: "angående → om", with the note "Det er ikke alltid nødvendig å ha med dette ordet i f.eks. overskrifter." |
| samtlige | alle | all | **Kansellisten**: "samtlige → alle" |
| oppebære | få, ha, motta, innkassere | receive / draw | **Kansellisten**: "oppebære → få, ha, motta, innkassere"; "oppebære trygd → få trygd" |
| erlegge | betale | pay | **Kansellisten**: "erlegge → betale", with the pair "Hytteeier må erlegge tilknytningsavgiften." → "Hytteeieren må betale tilknytningsavgiften." |
| erverve | kjøpe, skaffe seg | acquire | **Kansellisten**: "erverve en tomt → kjøpe en tomt"; "erverve seg rett til → skaffe seg rett til" |
| ovennevnte | nevnte, som er nevnt ovenfor | the above-mentioned | **Kansellisten**: "ovennevnte → nevnte, som nevnes / er nevnt ovenfor" |
| tillike | også, i tillegg, dessuten | also | **Kansellisten**: "tillike → også, i tillegg, dessuten" |
| foreta en vurdering av | vurdere | assess | **Kansellisten** (rewrite rule): "I stedet for «foreta en vurdering av saken» kan du skrive «vurdere saken»." |
| benytte | bruke | use | ⚠ craft — **not in Kansellisten** |
| erholde | få | receive | ⚠ craft — **not in Kansellisten** |
| inneha | ha | have / hold | ⚠ craft — **not in Kansellisten** |
| samt | og | and | ⚠ craft — **not in Kansellisten** (*samtlige* is; *samt* is not) |
| i henhold til | etter / som | according to | ⚠ craft — **not in Kansellisten**; the nearest entry is "i medhold av → i samsvar med, med hjemmel i, etter" |
| eksempelvis | for eksempel | for example | ⚠ craft — **not in Kansellisten** |

**Two rows removed — Kansellisten puts these words on the *plain* side.** This is the part a word
list will get backwards, so it is stated outright:

- ~~*dersom* → *hvis / om*~~ — **Språkrådet recommends *dersom***. Kansellisten's replacement for
  "så fremt" is "hvis, om, **dersom**". Treating *dersom* as chancery is simplifying in the wrong
  direction. **The corpus agrees, independently:** the row runs backwards there too (8c, 8d).
- ~~*på bakgrunn av* → *på grunn av / fordi*~~ — Kansellisten uses "**på bakgrunn av**" as one of its
  *plain* replacements for the chancery "hensett til" ("hensett til → i betraktning av, med tanke på,
  på bakgrunn av"). Shortening it further can be an editorial choice; it is **not** a klarspråk rule,
  and the row was carrying a claim the national list contradicts.

### 8c. The measurement — two Bokmål corpora, and what they cannot see

**Tool:** `scripts/corpus-measure.mjs` in this repo. Frequencies below are per **100,000 word
tokens**.

| | Publication | Kind | Documents | Word tokens | Mean sentence |
|---|---|---|---|---|---|
| **A (plain)** | Klar Tale (`klartale.no`) | Norway's only lettlest newspaper | **250** | **55,225** | **10.45** |
| **B (standard)** | `forskning.no` | Popular science | **250** | **218,060** | **16.83** |

**Reproducibility — the exact run these numbers come from.** Corpus A: **250 documents, 55,225 word
tokens**. Corpus B: **250 documents, 218,060 word tokens**. Both fetched and counted on
**2026-07-27** with `scripts/corpus-measure.mjs`. Quote those four figures together with any number
taken from this section: a rate per 100k is only checkable against the token count it was divided by,
and a reader who cannot tell which corpus size produced a figure cannot reproduce it. If a re-run
returns different document or token counts, the corpus has changed and **every rate in 8c and 8d is
stale** — re-derive them rather than mixing old rates with new counts.

🔑 **Both corpora are Bokmål, so the written norm is controlled** — and that was a deliberate choice,
not luck. The obvious plain-side alternative (Framtida.no) writes **Nynorsk**; that pairing would
have measured Norway's two written standards (§9) against each other instead of measuring register.
The tokenizer was self-tested on `ikke` and passed.

> ⚠ **Four caveats that travel with every number in 8c and 8d.**
>
> 1. **Different publishers.** The ideal pair would have been Klar Tale against the sister
>    publication of the same group — a same-house pair controls for house style. That publisher
>    **declines automated text collection**, so it fell away and a second house had to be used.
> 2. **Different genres.** Lettlest *news* against popular *science*. Genre and register are
>    therefore confounded in every row, which is why the keyness list below is almost entirely topic.
> 3. **Corpus A is small** — 55,225 tokens. **One single token ≈ 1.8 per 100k.**
> 4. **No lemmatization.** Word forms are counted, not lemmas, so a row about a *construction*
>    ("foreta en vurdering av") is not the same thing as a count of the bare word form.

**Thresholds, stated so a reader can tell a refutation from a blind spot.**

- **Tolerance band 1.25×.** A pair counts as *supported* only if the everyday member runs at least
  **1.25×** more frequent in A than in B (and the formal member the other way). A smaller gap is
  reported **flat** — measured, and no register signal.
- **Thin floor 3 per 100k.** Below that, a "signal" in corpus A can be one or two sentences. Rows
  under the floor carry no verdict on their own.
- **untestable** means the formal word occurs **nowhere in either corpus**. That is a statement about
  **what these corpora contain**, not about the word: it is *not* a refutation, and a row marked
  untestable keeps its Kansellisten standing in 8b unchanged.

**Row by row.** Formal member and everyday member, each as *A / B* per 100k.

| Formal | Everyday | Formal A / B | Everyday A / B | Verdict |
|---|---|---|---|---|
| anvendelse | bruk | 0 / 0 | 19.9 / 48.6 | **untestable** — formal word absent from both corpora |
| vedrørende | om | 0 / 0 | 592.1 / 768.1 | **untestable** — formal word absent from both corpora |
| angående | om | 0 / 0 | 592.1 / 768.1 | **untestable** — formal word absent from both corpora |
| oppebære | motta | 0 / 0 | 5.4 / 1.4 | **untestable** — formal word absent from both corpora |
| erlegge | betale | 0 / 0 | 27.2 / 2.3 | **untestable** — formal word absent from both corpora |
| erverve | kjøpe | 0 / 0 | 10.9 / 2.3 | **untestable** — formal word absent from both corpora |
| ovennevnte | nevnte | 0 / 0 | 0 / 0 | **untestable** — both members absent |
| tillike | også | 0 / 0 | 431 / 388.9 | **untestable** — formal word absent from both corpora |
| erholde | få | 0 / 0 | 173.8 / 162.3 | **untestable** — formal word absent from both corpora |
| samtlige | alle | 0 / 0.5 | 155.7 / 130.7 | flat — no register signal (1.19×, inside the band) |
| benytte | bruke | 0 / 0.9 | 50.7 / 48.2 | flat — no register signal |
| foreta | gjøre | 0 / 0.9 | 96 / 78 | flat — no register signal (1.23×, inside the band) |
| imidlertid | men | 1.8 / 14.7 | 418.3 / 464.6 | flat — no register signal |
| vurdering | vurdere | 3.6 / 5.5 | 7.2 / 11.5 | 🔴 **REVERSED** — the "everyday" form is rarer in the plain corpus |
| dersom | hvis | 5.4 / 22.9 | 57.9 / 97.7 | 🔴 **REVERSED** — the "everyday" form is rarer in the plain corpus |

**No row is supported.** Nine are untestable, four come back flat (`samtlige`, `benytte`, `foreta`,
`imidlertid`) and two run backwards. **Not one of the fifteen pairs shows the everyday member
clearing the 1.25× band in the plain corpus** — which is a statement about what these two corpora
can see, not a verdict on the pairs.

**Nine of the fifteen rows are untestable, and that is the main result.** `anvendelse`, `vedrørende`,
`angående`, `oppebære`, `erlegge`, `erverve`, `ovennevnte`, `tillike` and `erholde` occur **zero
times in both corpora**. Kansellisten targets **administrative and legal** Norwegian; a news outlet
and a science magazine do not write it. **This is not a counter-argument to the list — the list's
dictionary evidence is simply the better source here, and the corpus can neither support nor refute
it.** Anyone re-reading these numbers should read them as a property of the sample, not of Norwegian.

**Structure — the most load-bearing part of the measurement.**

| Metric | A (plain) | B (standard) |
|---|---|---|
| **Mean sentence length (words)** | **10.45** | **16.83** |
| Median sentence length (words) | **9** | — |
| Sentences of **15 words or fewer** | **84.7 %** | — |
| Tokens **over 11 characters** | **3.1 %** | — |
| `som` — relative pronoun, subordinate-clause marker | **968.8** /100k | **1,692.7** /100k |
| `jeg` — first person | **418.3** /100k | **124.3** /100k |

Subordinate-clause density is the second clear contrast beside sentence length. Together they are the
only part of this measurement that separates the two corpora decisively, and they are what 8f builds
on first. The three A-only rows have no B counterpart in this run, so read them as a **profile of the
plain corpus**, not as a contrast: they say what lettlest prose looks like, not how far it sits from
standard prose. `jeg` is the one lexical item that behaves like a register marker rather than a topic
word — it runs **more than three times** as often in the plain corpus — but note it is a first-person
signal, not an address signal, and 8e does not lean on it.

**⚠ Keyness is dominated by topic, not by register — do not read these as language findings.** The
strongest keyness terms are simply what each publication writes about: `ntb` (a news agency), `vm`,
`fotball-vm`, `politiet`, `kampen`, `frankrike`, `tirsdag`, `juli`, `mål` are news topics on the A
side; `forskning`, `forskerne`, `foto` are the standard corpus's own subject matter; and `ios` is an
app-promotion artifact in the page furniture. None of them is evidence about plain Norwegian. Only
two keyness items look like genuine register signals: `som` and the first-person `jeg` (**418.3**
against **124.3** per 100k), both in the structure table above.

### 8d. 🔴 Do NOT "simplify" these — where the measurement runs against the instinct

Only two rows moved at all, and **both of them run backwards.** Both deserve a translator's
attention, because both are substitutions a translator would otherwise make on reflex.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~Replace *dersom* with *hvis* "because *hvis* is the everyday word"~~ | **The corpus runs the other way.** *dersom* **5.4 (A) / 22.9 (B)**; *hvis* **57.9 (A) / 97.7 (B)** per 100k. *hvis* is **less** frequent in the plain corpus than in the standard one — the opposite of what the substitution assumes. This **converges with Kansellisten**, which lists *dersom* among its own *plain* replacements (8b, "Two rows removed"). Two independent instruments now say the same thing, so treat this as settled: **do not "simplify" *dersom* away.** |
| ~~Replace the noun *vurdering* with the verb *vurdere* as a blanket rule~~ | **Backwards in the counts:** *vurdering* **3.6 (A) / 5.5 (B)**; *vurdere* **7.2 (A) / 11.5 (B)**. The verb is **rarer** in the plain corpus. ⚠ Read with the no-lemmatization caveat: Kansellisten's rule is about the **construction** "foreta en vurdering av saken → vurdere saken", and the corpus counted bare word forms, so the two are not measuring the same object. What follows is narrow and safe: **unpack the nominal construction when you meet it; do not hunt down the noun *vurdering* wherever it appears.** |

**No row holds.** Not one of the fifteen pairs came back supported. The nearest thing to a positive
result was `foreta → gjøre` — *foreta* **0 (A) / 0.9 (B)**, *gjøre* **96 (A) / 78 (B)** — and it does
**not** clear the bar: the formal member sits under the thin floor in both corpora, and the everyday
member's **1.23×** gap falls **inside** the 1.25× band, so the row is **flat: no register signal**.
Direction alone is not a finding. Treat `foreta → gjøre` exactly as the other flat rows are treated
below — kept on Kansellisten's authority, carrying no corpus support of its own.

**The nine untestable rows are deliberately NOT on this list.** `anvendelse`, `vedrørende`,
`angående`, `oppebære`, `erlegge`, `erverve`, `ovennevnte`, `tillike` and `erholde` score zero in
both corpora, which means the measurement never got a look at them. Putting a Språkrådet-sourced,
dictionary-grade pair on a do-not-simplify list because a mismatched corpus could not see it would
invert the evidence. **They stay in the 8b table at full Kansellisten tier, and they stay in use.**
The four flat rows — `samtlige`, `benytte`, `foreta`, `imidlertid` — were measured and showed no
register signal either way, which is likewise no reason to drop them. **Only the two reversed rows
above change what a translator should do.**

### 8e. 🔑 The address decision — `no-easy` keeps **du**, and the corpus has nothing to say about it

> **Decision, recorded so nobody "fixes" it: `no-easy` keeps the *du* register recorded in §4, and
> never uses *De*.**

The ground for this is **convention plus the klarspråk guidance in 8a**, not measurement. Modern
Norwegian uses **du** universally, including in formal and educational contexts; **De** is
archaic/ceremonial and is not used (§4). Klarspråk guidance names *du*-address explicitly, and
Kansellisten's "be personal" rewrite rule (8b) pushes the same way.

**The corpus adds nothing here, in either direction, and this section will not pretend otherwise.**
The measurement did not test address at all — Norwegian uses *du* throughout both corpora as a matter
of course, so there was no contrast to measure. Stating a convention as a convention is the accurate
move; dressing it as corpus evidence would be a fabricated warrant for a decision that does not need
one.

- ✅ `no-easy`: **Klikk her.** · **Skriv inn navnet ditt.** · **Husk å lagre.**
- ❌ archaic *De*: **Klikk her, er De snill.** · possessive **Deres** for a single reader.

### 8f. What `no-easy` is built on — in order of leverage

**1. Structure first — this is where the measured difference actually is.** Target the plain corpus's
**mean sentence length of 10.45 words** (against 16.83 in standard prose), which sits inside the
kit's ~8–12-word base target, with a **median of 9** and **84.7 % of sentences at 15 words or fewer**
— that last figure is the most usable check on a draft, because it is a pass/fail per sentence rather
than an average to be gamed. Then cut subordinate clauses hard: the marker `som` runs **968.8 per
100k in the plain corpus against 1,692.7** in the standard one — roughly **half the density**. One
idea per sentence. Then apply Språkrådet's four rewrite rules from 8b (verb not noun; be personal;
unpack participles and embedded phrases; double definiteness), which change sentences rather than
tokens and therefore move the same numbers.

**2. The word table second, on its own authority.** The 8b complex→everyday table stands on
**Kansellisten**, Språkrådet's own chancery-word list, quoted in the dictionary's wording — *not* on
the corpus, which could not reach nine of its rows. Use it as Kansellisten itself asks to be used:
"Kansellisten er ment som en veiledning, ikke som en «svarteliste»." Two exceptions carried down from
8d: leave *dersom* alone, and unpack the *vurdering* **construction** rather than chasing the noun.
Expect the word swaps to earn less than the sentence work — **no row in 8c came back supported**,
while both structural metrics separated the corpora decisively.

**3. The kit's base rules, inherited.** `no-easy` **inherits the kit's base simplified-language
rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one
idea per sentence, everyday words, say what *is* not what *isn't*, active voice, a one-line "what is
this" opener, a consistent literal tone — and adds the **Norwegian-sourced overlays** above. The one
register overlay: **hold the recorded *du* register (never *De*) and keep the moderate-Bokmål voice
(§4, §9).**

**4. Term preservation, binding.** In `no-easy`, **keep the technical term and explain it** — never
swap in a folksy stand-in. Keep e.g. **kunstig intelligens**, then "det betyr: …", then a concrete
example. This is distinct from the 8b table, which targets bureaucratic *non-technical* vocabulary.

### 8g. Still open

- **The measurement never tested Kansellisten, and a corpus that could still does not exist here.**
  The pairing that would actually test the list is **administrative prose against its own
  plain-language rewrites** — the same authority's letters, forms and decisions before and after a
  klarspråk revision. Until such a pair is measured, the list rests on its dictionary evidence, which
  is the appropriate footing for it.
- **The genre and publisher confounds are unresolved.** A same-house pair was unavailable because
  that publisher declines automated text collection; a lettlest *news* corpus against a popular
  *science* corpus cannot separate register from subject matter, which is exactly what the keyness
  list in 8c demonstrates.
- **Two rows sit within 0.05 of the 1.25× band edge**, so their flat-vs-reversed labels are an
  artifact of where the cutoff was drawn as much as of the language: a slightly different threshold
  would move them. `foreta → gjøre` at **1.23×** is the clearest case. Any conclusion that depends on
  a near-edge row should be treated as undecided rather than settled, and the band itself is a
  convention of this measurement, not a norm from any authority.
- **Corpus A is thin** (55,225 tokens, one token ≈ 1.8 per 100k). Every low-frequency row in 8c is
  fragile by construction.
- **No comprehension evidence.** Nothing measured here says what a reader understands — only what the
  registers *do*. Klarspråk supplies principles, not a readability threshold (8a).
- **The 8b table still wants a native-speaker pass**, as does this whole guide (see the Status line in
  the header). A word list cannot tell a translator which substitution fits a given sentence, and the
  ⚠ craft rows in particular are this guide's judgment rather than a Språkrådet ruling.

Sources: <https://snl.no/klarspr%C3%A5k> · <https://snl.no/kansellistil> ·
<https://lovdata.no/dokument/NL/lov/2021-05-21-42> (språklova § 9 — statutory text verified
verbatim) · <https://sprakradet.no/godt-og-korrekt-sprak/praktisk-sprakbruk/kansellisten/> and its
full-list PDF <https://sprakradet.no/wp-content/uploads/kansellisten_2009_enogenside.pdf>
(Kansellisten — Språkrådet's own chancery-word list; all table pairs and rewrite rules above quoted
verbatim from it) · <https://www.ks.no/fagomrader/digitalisering/digital-kompetanse/klart-sprak-i-digitale-selvbetjeningslosninger/sprak/klare-ord-og-setninger/>
(KS — audience figure, quoted verbatim) · corpus measurement 8c/8d: <https://klartale.no> (Klar Tale,
plain corpus — 250 documents, 55,225 word tokens) · <https://forskning.no> (standard corpus — 250
documents, 218,060 word tokens), both counted 2026-07-27 with `scripts/corpus-measure.mjs` in this
repo — machine-measured, reproducible against those counts, and confounded as stated in 8c.
**Note for future passes: sprakradet.no and lovdata.no both answered normally this pass** — the
earlier HTTP 403 recorded in §2 no longer holds, and the klarspråk material above is primary-sourced
rather than rerouted via SNL.

---

## 9. Regional variation — Bokmål vs Nynorsk

**(Strong section — snl.no. This is the defining fact of Norwegian localization.)**

Norwegian's defining feature is its **two co-equal official written standards** — **Bokmål** and
**Nynorsk**. This is **not a dialect footnote and not a spoken accent**: Nynorsk is a **full, official
written standard**, formally equal to Bokmål, and the choice changes the spelling, morphology, and
often the vocabulary of nearly every sentence. SNL: Bokmål is "basert på dansk og det dansk-norske
talespråket" while Nynorsk is "basert på ulike norske talespråk eller dialekter" (snl.no/bokmål,
snl.no/nynorsk). Usage split: **Bokmål "blir brukt av rundt 90 prosent av dem som skriver norsk i
Norge"**, Nynorsk "blir alminnelig antatt å ligge mellom 10 og 15 prosent" (schools 2022/23: "11,5
prosent av grunnskoleelevene hadde nynorsk som opplæringsspråk").

**Base target = Bokmål.** Bokmål is the default written form for ~85–90 % of readers and the standard
for digital/educational content, so it is this guide's base target. There is **no meaningful
speaker-count difference** — essentially all Norwegians read both — the split is about *written norm*,
not population.

**How the two standards differ (a few examples):**
- **Vocabulary/spelling:** *jeg* (bm) vs *eg* (nn) "I"; *ikke* vs *ikkje* "not"; *hva* vs *kva*
  "what"; *fra* vs *frå* "from".
- **Verb infinitives:** Bokmål (Danish-influenced) takes **-e** (*å lære*); Nynorsk may take **-a**
  (*å læra*).
- **Gender forms:** Nynorsk uses three genders consistently with distinct feminine forms; in Bokmål
  the feminine is optional and often merges into masculine (*ei bok* ↔ *en bok*).

**What a "neutral" Bokmål target looks like:** moderate/mainstream Bokmål — the register a national
broadcaster or newspaper uses. Prefer common everyday Bokmål spellings from ordbokene.no, avoid
conservative Riksmål forms (*efter*, *sprog*) and avoid radical/dialectal forms; keep the *du*-address
(§4).

**Do not mix Bokmål and Nynorsk within one text — ever.** If the platform must serve Nynorsk users,
that is a **separate full translation pass** (`nn`), not a variant of this Bokmål (`nb`) file. The two
standards are held in **separate builds**; a single file mixing *jeg*/*eg* or *ikke*/*ikkje* is a
defect, not a neutral compromise. Locale codes: **Bokmål `nb`, Nynorsk `nn`, macro `no`**.

- ✅ consistent Bokmål: **Jeg vet ikke hva som skjer.**
- ✅ consistent Nynorsk (separate `nn` build): **Eg veit ikkje kva som skjer.**
- ❌ mixed within one text: **Eg vet ikkje hva som skjer.** (Nynorsk *Eg/ikkje* + Bokmål *vet/hva*;
  sentences illustrative, built on the sourced contrast pairs above)

Sources: <https://snl.no/bokm%C3%A5l> · <https://snl.no/nynorsk> · <https://snl.no/norsk>

---

