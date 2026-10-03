<!-- base -->
# lang-fi — Finnish (suomi) — language guide

> **Setup & sources live in [`fi.setup.md`](fi.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** suomi / Finnish.
**BCP 47 code (base):** `fi`.
**BCP 47 code (simplified variant):** `fi-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`fi-x-simple`), but the kit token `fi-easy` is the one
that counts here. Finnish plain language has a strong national name of its own — **selkokieli** — so
`fi-easy` maps onto a codified, measurable tradition rather than an ad-hoc simplification (§8).
**Speaker reach:** ~**5+ million** speakers — ≈4.7 million native and ≈0.5 million second-language
speakers in Finland (fi.wikipedia.org/wiki/Suomen_kieli — „Suomessa suomen kieltä puhuu
äidinkielenään noin 4,7 miljoonaa ja toisena kielenään taas noin 0,5 miljoonaa ihmistä“; consistent
with Statistics Finland's ~4.8 m native figure). It is a majority and (with Swedish) co-official
national language of Finland, an official language of the EU, and a recognized minority language in
Sweden.
**Script + direction:** Latin script with two Finnish-specific letters — **ä** and **ö** (**å**
occurs only in Swedish loanwords/names); **left-to-right**. All letters live in Basic Latin
(U+0000–U+007F) plus Latin-1 Supplement (U+0080–U+00FF), so glyph coverage is a non-issue for any
mainstream font — the one real risk is an ASCII-folding pipeline that turns ä→a / ö→o and changes
meaning (§3).
**Status:** planned — **not yet reviewed by a native speaker.** Authored from a single
**agent-native research dossier** (self-fetched, quote-per-claim); the load-bearing anchors
(quotation marks, selkomittari, SFS AI terms, register) carry verbatim source quotes in the
dossier. Covers base `fi` and the `fi-easy` pendant. **Strong** sections
(typography, authorities, numbers/dates/currency, plain language) rest on **Kotus / Kielitoimiston
ohjepankki**, **Kielikello**, **Selkokeskus** and **SFS** and carry verbatim quotes; **thinner**
sections (AI micro-terminology, idioms, regional variation) rest on Wikipedia and Finnish
vendor/education glossaries and are marked `⚠` at point of use.
**Easy or hard for this kit:** easy on the mechanical axes — Latin script, whitespace tokenization,
LTR, no shaping or bidi, full glyph coverage in any Latin-1 font. What actually bites is
**morphology**: Finnish has **15 cases**, **agglutination** (4–6 English words can collapse into one
inflected Finnish word), **no articles**, the **partitive** aspect trap, and **no grammatical
gender** — so dictionary-form output is ungrammatical and UI string-length planning must assume
Finnish words run long (§4). Two typography points are also easy to get wrong: the **quotation mark
is `”…”` (U+201D at *both* ends)**, not the German „…“, and long compounds need real
`hyphens: auto` line-breaking (§3).

Sources: <https://fi.wikipedia.org/wiki/Suomen_kieli> ·
<https://kielitoimistonohjepankki.fi/ohje/lainausmerkit/> · <https://selkokeskus.fi/selkokieli/>

---

## 1. Header block

See above. One-line orientation: Finnish is a Uralic (Finnic), SVO-but-highly-flexible, LTR language
in Latin script with **no diacritic-coverage problem** but **heavy agglutinative morphology**; the
localization risks concentrate in **morphology (15 cases, agglutination, partitive, no articles)**,
one **Finnish-specific quotation mark (`”…”` both ends)**, and **compound line-breaking** — not in
scripting, direction, or fonts.

---

## 4. Grammar for translators

**⚠ Mixed-tier section.** The register decision rests on **Kielikello (Kotus)** and is strong; the
morphology facts rest on **fi.wikipedia.org/wiki/Suomen_kieli** and **/Suomen_kielioppi**
(community-tier, standard well-known facts). The right/wrong example pairs are **illustrative,
correct-form-only** (the correct side is standard Finnish; the wrong side is a constructed
naive-calque error), and the whole section is **native-speaker confirmation pending**.

**Word order.** Finnish is basically **SVO but highly flexible**; word order encodes information
structure (topic/focus), while grammatical role is carried by **case endings**, not position. Do
**not** mechanically preserve English word order — the end position typically carries the
new/focused information.

**Register — and the project's recorded choice.** Finnish has the **sinä (informal singular) vs te
(formal, *teitittely*)** distinction. Finland has broadly become a *sinutteleva* (informal-address)
society — Kielikello (Kotus): „Muutamassa vuosikymmenessä Suomesta on tullut sinutteleva
yhteiskunta.“ Even public authorities favor sinä, especially for sensitive topics or younger
audiences: „sinuttelu sopii teitittelyä paremmin esimerkiksi tilanteisiin, joissa käsitellään
arkaluonteisia puheenaiheita tai puhutellaan nuoria asiakkaita.“

> **Register decision (human-gate): sinä (informal), in yleiskieli — apply, do not re-litigate.**
> Finland is a *sinutteleva* society
> and even authorities favor **sinä**; it is the natural neutral register for an educational
> platform. **Binding for all second-person copy** in `fi` and `fi-easy`. Reserve **te**
> (*teitittely*) **only** for explicitly formal or institutional notices (e.g. a legal/consent
> notice addressed to an unknown adult) — never as the default voice. Concretely this means the
> **sinä-imperative** (2nd-person singular, e.g. *klikkaa*, *kirjoita*, *muista*) and **sinä verb
> agreement**, not the te-plural (*klikatkaa*, *kirjoittakaa*).
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ sinä (the recorded register): **Klikkaa tästä.** · **Kirjoita nimesi.** · **Muista tallentaa.**
- ❌ te (not the platform default): **Klikatkaa tästä.** · **Kirjoittakaa nimenne.** · **Muistakaa
  tallentaa.**

The grammar features that break a naive EN → FI translation:

**(1) 15 grammatical cases — no prepositions for most relations.** fi.wikipedia.org/wiki/Suomen_kieli
— „15 sijamuotoa“. English preposition phrases become a **single inflected noun**: "in the house" =
*talossa* (inessive of *talo*); "into the model" ≈ *malliin* (illative). You cannot translate a
preposition string word-for-word — you inflect the noun.

- ✅ **talossa** ("in the house") · **malliin** ("into the model")
- ❌ naive preposition + dictionary form: **in talo**, **into malli** *(illustrative wrong — the
  relation must be a case ending on the noun, not a separate preposition)*

**(2) Agglutination — stacked suffixes.** Multiple grammatical meanings pile onto one stem:
*talo+i+ssa+ni+kin* = "also in my houses" (fi.wikipedia.org/wiki/Suomen_kieli — „talo+i+ssa+ni+kin“).
**One Finnish word can equal 4–6 English words** — plan UI string length and truncation accordingly;
Finnish runs long.

- ✅ **taloissanikin** (one word = "also in my houses")
- ❌ splitting the suffixes into separate tokens, or assuming English-length strings will fit.

**(3) No articles.** Finnish has **no "the/a"**; definiteness is shown by word order, case (partitive
vs accusative) and context. **Drop** English articles — do not render them; inserting a demonstrative
for every "the" reads as unnatural.

- ✅ **Avaa tiedosto.** ("Open the file.")
- ❌ **Avaa se tiedosto.** *(a demonstrative *se* for every English "the" — over-marks and reads
  unnatural)*

**(4) Partitive case — the classic trap.** The partitive marks partial/indefinite objects, amounts,
negation, and follows many verbs and numbers (fi.wikipedia.org/wiki/Suomen_kielioppi —
„kieliopilliset sijat ... nominatiivi, partitiivi, genetiivi ja akkusatiivi“). Object case changes
aspect/meaning: "I read a book" → *Luen kirjaa* (partitive, ongoing) vs *Luen kirjan* (accusative,
completed). Getting the object case wrong changes the meaning.

- ✅ ongoing: **Luen kirjaa.** · ✅ completed: **Luen kirjan.**
- ❌ using the accusative *Luen kirjan* where an ongoing/partial action is meant (or vice versa) —
  the object case is not free variation.

**(5) No grammatical gender.** fi.wikipedia.org/wiki/Suomen_kieli — „Substantiiveilla ei ole
kieliopillista sukua.“ One pronoun **hän** covers he/she (spoken *se* for both). English gendered
pronouns collapse to one — and there is **no gender agreement** to track on adjectives, which
simplifies adjective handling.

- ✅ **hän** for both "he" and "she" (no gendered split, no agreement)
- ❌ inventing a gender distinction or trying to preserve English "he/she" as two Finnish pronouns.

**Bonus trap: consonant gradation & vowel harmony.** Stems change on inflection (*malli → mallissa*;
back/front vowel harmony picks *-ssa* vs *-ssä*). A pipeline that concatenates endings mechanically
onto an unchanged stem produces wrong forms — respect gradation and harmony (§11 flags this as a
check).

Sources: <https://fi.wikipedia.org/wiki/Suomen_kieli> · <https://fi.wikipedia.org/wiki/Suomen_kielioppi>
(morphology — community-tier) · <https://kielikello.fi/sina-vai-te-viranomaisviestinnassa/>
(register — authority/Kotus)

---

## 5. Numbers, dates, currency

**(Strong section — Kielitoimiston ohjepankki / Kotus. CLDR alignment noted.)**

**Decimal separator = comma.** „29,90 €“ is the standard price form (comma decimal) —
kielitoimistonohjepankki.fi/ohje/rahasummat/. So `1,50 €` = one euro fifty.

**Digit grouping = space (non-breaking), not comma or period.** „10 000 000 €“ (ten million) — same
source. Groups of three, separated by a (non-breaking) space.

- ✅ Finnish: **1 234,50** (space groups, comma decimal) · **2 500 000**
- ❌ English format: **1,234.50** (comma groups, period decimal)

**Currency — symbol AFTER the amount, separated by a space.** „Luvun ja tunnuksen (tai lyhenteen)
väliin tulee tyhjä väli“ (kielitoimistonohjepankki.fi/ohje/rahasummat/). So **`29,90 €`** and
**`1 499 £`** — postfix symbol with a space, unlike English "$29.90". Inflectional endings attach to
the code/symbol with a colon: *800 €:n* ("of 800 euros"). Large sums use *milj.* / *mrd.* (e.g.
*10 milj. €*), not "M€" except in tight tables. ISO 4217 code **EUR**, symbol **€**.

- ✅ **29,90 €** (amount + space + symbol postfix) · ✅ **800 €:n** (inflected)
- ❌ **€29,90** / **$29.90** (prefix symbol, English style) · ❌ **29,90€** (no space)

**Time = 24-hour, hours and minutes separated by a PERIOD, not a colon.** „tuntien ja minuuttien
välissä käytetään pistettä (esimerkiksi: Kokous alkoi kello 9.15)“ (via ohjepankki,
ajanilmaukset-kellonajat). So **`9.15`**, not `9:15`.

- ✅ **9.15**, **14.30** · ❌ **9:15**, **2:30 PM**

**Dates = day-first with periods:** **`28.1.2026`** (d.m.yyyy), each element followed by a period.
Ranges use the en-dash: „28.1.–12.3.“ (kielitoimistonohjepankki.fi/ohje/ajanilmaukset-aikavalit).

- ✅ **28.1.2026** · ✅ range **28.1.–12.3.** · ❌ **1/28/2026** (US) · ❌ **2026-01-28** for
  end-user display (keep ISO 8601 for backends/identifiers only)

**CLDR alignment.** The above matches the CLDR `fi` locale (decimal comma, group = non-breaking
space, currency symbol postfix, `d.M.y` dates, 24-hour time). ⚠ the CLDR `fi` chart was not fetched
directly for this guide — cite the current CLDR release for machine-format defaults.

Sources: <https://kielitoimistonohjepankki.fi/ohje/rahasummat/> ·
<https://kielitoimistonohjepankki.fi/ohje/ajanilmaukset-kellonajat-merkinta-ja-taivutus/> ·
<https://kielitoimistonohjepankki.fi/ohje/ajanilmaukset-aikavalit-1-1-31-1/>

---

## 6. Terminology strategy

**(Policy is well-anchored — SFS + Kotus practice. The AI micro-term rows are
vendor/education-sourced and marked `⚠`.)**

**Loanword vs native-coinage practice.** Finnish **strongly prefers native coinages over English
loanwords** — *tekoäly* (a native compound, lit. "artificial intelligence") rather than "AI" as a
word. There is an active standardization effort: SFS is producing Finnish AI terms so that „kaikki
tekoälyn parissa toimivat ymmärtävät alan termistön samalla tavalla“
(sfs.fi/tekoalyn-suomenkieliset-termit/); authoritative anchors are **SFS-EN-ISO/IEC 22989**,
**Tieteen termipankki**, and (⚠ shell-only) TEPA. **Working rule:** prefer the native/standard form,
keep the English term in parentheses on first use for searchability (e.g. *suuri kielimalli (LLM)*).
Loanwords **inflect** like Finnish nouns — respect the case (§4), don't freeze them in the
nominative.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term, give target term + original acronym + one short plain clause, then use
the target term alone afterwards:

> **suuri kielimalli** (large language model, LLM) — tietokonemalli, joka on opetettu suurella
> tekstimäärällä ja tuottaa kieltä. *(explanatory clause authored per the sandwich format; the term
> itself is sourced below.)* Then **suuri kielimalli** alone on every later mention.

**Seed field vocabulary (AI/ML).** ✅ = standard/authority-backed; ⚠ = vendor/education or unquoted
usage (re-confirm against tieteentermipankki.fi before shipping user-facing strings). AI micro-terms
(token, prompt, fine-tuning, inference, hallucination) are vendor/education-sourced only and stay
`⚠`.

| Concept (EN) | Finnish (recommended) | Tier + provenance |
|---|---|---|
| artificial intelligence | **tekoäly** | ✅ SFS standard term (sfs.fi/tekoalyn-suomenkieliset-termit/) |
| machine learning | **koneoppiminen** | ✅ SFS standard term (same source) |
| neural network | **neuroverkko** (also *hermoverkko*) | ⚠ vendor/community (sap.com/finland; fi.wikipedia Syväoppiminen) |
| deep learning | **syväoppiminen** | ⚠ vendor + fi.wikipedia.org/wiki/Syväoppiminen |
| algorithm | **algoritmi** | ⚠ standard loan-adaptation; no single quote fetched |
| model | **malli** | ⚠ generic native word; ubiquitous, no single quote |
| dataset | **aineisto** / **datajoukko** / **tietoaineisto** | ⚠ *aineisto* academic, *datajoukko* in ML |
| training data | **opetusdata** (also *koulutus-/harjoitusdata*) | ⚠ vendor (haltu.fi / aimiten.fi) |
| large language model (LLM) | **suuri kielimalli** | ⚠ vendor (aimiten.fi, haltu.fi) |
| prompt | **kehote** (system prompt = **järjestelmäkehote**); colloq. *promptti* | ⚠ vendor (aimiten.fi/sanasto) |
| token | **token** (some use *sana-osa*) | ⚠ vendor (aimiten.fi/sanasto) — accepted loan |
| fine-tuning | **hienosäätö** | ⚠ vendor (aisanomat.fi / aimiten.fi) |
| inference | **päättely** (also loan *inferenssi*) | ⚠ vendor (aimiten.fi/sanasto) |
| supervised / unsupervised learning | **ohjattu / ohjaamaton oppiminen** | ⚠ standard FI calques (also *valvottu/valvomaton*); no single quote |
| hallucination | **hallusinaatio** | ⚠ vendor (aimiten.fi/sanasto) — accepted loan |

**Guidance:** prefer the native/standard forms (*tekoäly, koneoppiminen, syväoppiminen, kehote,
päättely, opetusdata, ohjattu/ohjaamaton oppiminen*); *token* and *hallusinaatio* are accepted loans.
For anything user-facing, verify the final term against **Tieteen termipankki** — the
vendor/education glossaries above are **not authorities**, and TEPA could not be quoted. Freeze the
chosen forms in the project glossary and don't mix competing renderings.

Sources: <https://sfs.fi/tekoalyn-suomenkieliset-termit/> (standards body — authority) ·
<https://tieteentermipankki.fi/> (term-bank reroute for verification) ·
<https://fi.wikipedia.org/wiki/Syväoppiminen> (community) · vendor/education glossaries sap.com,
haltu.fi, aimiten.fi, aisanomat.fi (non-authority, `⚠`)

---

## 7. Idiom anti-patterns

**⚠ Editorial/translation-craft section, native-speaker confirmation pending.** These renderings are
translation-craft recommendations from the dossier; **none carries a single dictionary quote** —
validate tone in context. Prefer the idiomatic column; the literal calque column is the naive output
to avoid.

| English phrase | Idiomatic Finnish ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | *vaihe vaiheelta* / *askel askeleelta* | *portaalta portaalle* (nonsense) | translator craft, unsourced |
| under the hood | *taustalla toimii…* / *konepellin alla* | *hupun alla* (a hood/cowl, not a car) | translator craft, unsourced |
| rule of thumb | *nyrkkisääntö* | *peukalon sääntö* (not Finnish) | translator craft, unsourced |
| out of the box | *suoraan käyttövalmiina* / *sellaisenaan* | *laatikon ulkopuolelta* | translator craft, unsourced |
| think outside the box | *ajatella ennakkoluulottomasti* | *laatikon ulkopuolella* (only half-established `⚠`) | translator craft, unsourced |
| keep in mind | *pidä mielessä* / *muista* | *säilytä mielessä* (stilted) | translator craft, unsourced |
| a piece of cake | *helppo nakki* | *palanen kakkua* (literal cake) | translator craft, unsourced |
| the big picture | *kokonaiskuva* | *iso kuva* (means a large image) | translator craft, unsourced |
| hands-on | *käytännönläheinen* / *itse tekemällä* | *kädet päällä* | translator craft, unsourced |
| trial and error | *yritys ja erehdys* | *koe ja virhe* | translator craft, unsourced |
| state of the art | *huipputason* / *alan viimeisintä kehitystä* | *taiteen tila* ("state of art") | translator craft, unsourced |
| cutting edge | *huippumoderni* / *eturintaman* | *leikkaava reuna* | translator craft, unsourced |
| at the end of the day | *loppujen lopuksi* / *viime kädessä* | *päivän lopussa* (a literal end of day) | translator craft, unsourced |

**Guidance:** Finnish tolerates far fewer live metaphors in expository text than English; when in
doubt, translate the **meaning plainly** rather than importing an English image. In **selko** text,
drop idioms entirely (§8: „Käytä tavallisia kielikuvia tai sanontoja, vältä erikoisempia“). The
general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: agent-native dossier translation-craft recommendations (no dictionary quote per row —
native-speaker confirmation pending).

---

## 8. Simplified-language pendant (`fi-easy`) — **selkokieli**

Finnish is one of the languages that *has* a codified pendant, so 8a–8b record the standard rather
than an absence. 8c–8g then do what the standard alone cannot: they count a real corpus, and report
the rows where the count contradicts what a translator would otherwise assume.

*(Finnish quotations below use the ”…” form required by §3 — U+201D at both ends.)*

### 8a. ✅ A codified standard exists, is named, and is measurable

Finnish plain language is unusually institutionalized. Authority: **Selkokeskus** (part of
Kehitysvammaliitto), which maintains the definition, the mark (*selkotunnus*), and the measurement
instrument (*selkomittari*).

**Definition (authority, verbatim).** ”Selkokieli on suomen kielen muoto, joka on mukautettu
sisällöltään, sanastoltaan ja rakenteeltaan yleiskieltä luettavammaksi ja ymmärrettävämmäksi”
(selkokeskus.fi/selkokieli/selkokielen-maaritelma/). Audience: ”Se on suunnattu ihmisille, joilla on
vaikeuksia lukea tai ymmärtää yleiskieltä.”

**Scale of need (2025 assessment).** ”selkokieltä tarvitsee Suomessa 632 000–812 000 ihmistä eli noin
11–14 prosenttia väestöstä” (selkokeskus.fi/selkokieli/selkokielen-tarve/) — up from the 2019
estimate of 650 000–750 000. Plain Finnish is a large, real audience, not an edge case.

**The official measure — Selkokielen mittari 2.0 (Plain-Language Meter).** The current instrument
scores a text against Finland's plain-language criteria
(selkokeskus.fi/selkokieli/selkokielen-mittari/selkokielen-mittarin-ohjeet-ja-kriteerit/):

- **96 criteria** across four sections: **Teksti kokonaisuutena** (text as a whole) — 27 ·
  **Sanat** (vocabulary) — 16 · **Kielen rakenteet** (language structures) — 24 · **Ulkoasu ja
  kuvitus** (layout & images) — 29 criteria.
- **Scoring scale (main criteria), verbatim:** **3** = ”vastaa hyvin väittämää” · **2** = ”vastaa
  osittain väittämää” · **1** = ”vastaa huonosti väittämää” · **0** = not applicable. A text is
  plain language only if **every evaluable main criterion scores 2 or 3** (a 1 flags a problem).
  ⚠ the "every main criterion ≥ 2" rule is the dossier's restatement; the quote-verified anchor is
  the **average threshold** below.
- **Overall thresholds:** **average ≥ 2.5** = the text is plain language (”Teksti on selkokieltä”) ·
  **2.0–2.4** = close to plain language, needs refinement · **below 2.0** fails.
- **Body-text font size 12–16 pt, verbatim:** ”12–16 pistettä leipätekstissä”.

### 8b. The axis the authority itself names — structure and abstraction, not foreignness

The criteria page is explicit about *what* it grades, and the list is dominated by **sentence
architecture** and **abstraction**, not by word origin. Verbatim, from the criteria page:

- **Sentence structures.** ”Virkerakenteet ovat yksinkertaisia. Sivulauseita on pääosin vain yksi.”
  (simple sentence structures; **mostly only one subordinate clause**) · ”Tekstissä käytetään suoraa
  sanajärjestystä (esim. subjekti, predikaatti, objekti).” · ”Predikaatti sijaitsee lauseen
  alkupuolella.” · ”Teksti ei ole liian tiivistä; myöskään yhteen lauseeseen ei ole pakattu liikaa
  asiaa.”
- **Abstraction is the vocabulary axis.** ”Aihetta käsitellään pääosin konkreettisten toimijoiden ja
  ihmisten kautta ( hakija , poliisi , me ). Toimijoina on vain vähän abstrakteja substantiiveja
  ( suunnitelma koskee , asiakaslähtöisyys on , avoimuus toteutuu ).” **The rule is
  concrete-vs-abstract, and it says nothing about native-vs-borrowed.** 8d shows why that
  distinction matters.
- **Nominalization, precisely scoped.** ”Tekstissä ei ole substantiivityylisiä ilmauksia (ns.
  substantiivitauti, esim. Projektin toteutuksen suunnittelu aikataulutetaan. ).” — the target is
  the *stacked* noun chain (”noun disease”), not the `-minen` suffix as such.
- **No double negation.** ”Lauseessa ei esitetä kaksinkertaista kieltoa ( Laskuja ei saa jättää
  maksamatta. ).”
- **Obligation vs option must be linguistically distinct.** ”Tekstissä erotetaan kielellisesti, mikä
  on lukijalle pakollista ( täytyä , pitää ), mikä taas mahdollista tai suositeltavaa ( voida ,
  kannattaa ).”

**Further quantitative / concrete rules (from the measure & guidance).**
- Sentences mostly short: ”Lauseet ja virkkeet ovat pääosin lyhyitä” (measure criteria page).
- Emphasis sparing: ”Kursiivia tai lihavointia on vain lyhyissä korostuksissa” (same).
- Avoid many long words; avoid ”huomattavan paljon pitkiä sanoja” (same).
- Use ordinary structures, avoid participial constructions (*lauseenvastikkeet*): use ”tavallisia
  kielen rakenteita” and avoid ”lauseenvastikkeita”
  (selkokeskus.fi/selkokieli/nain-puhut-selkokielta/sanat-ja-kielen-rakenteet-selkopuheessa/).
- Use common idioms only, avoid unusual metaphors: ”Käytä tavallisia kielikuvia tai sanontoja, vältä
  erikoisempia” (same page).
- Explain a hard word in its immediate context; prefer concrete, high-frequency everyday words (same
  page).

**Complex/formal → selko everyday word table.** ✅ the first six are verbatim example pairs from
Selkokeskus (selkokeskus.fi/selkokieli/nain-puhut-selkokielta/sanat-ja-kielen-rakenteet-selkopuheessa/);
the remaining four were carried as `⚠ editorial` in the previous edition and are now backed — or
qualified — by the corpus counts in 8c. Frequencies are per 100,000 word tokens, raw counts in
brackets, in the order **selko / Ketju / news**.

| Vaikea / muodollinen | Selko / arkikieli | English | Sourcing |
|---|---|---|---|
| oleellinen | tärkeä | essential → important | ✅ Selkokeskus verbatim pair; corpus **1.4 (1) / 21.9 (36) / 4.0 (1)** |
| raportoida | kertoa | report → tell | ✅ Selkokeskus verbatim pair; corpus **0.0 (0) / 9.7 (16) / 47.7 (12)** |
| toimijat | ihmiset | actors/agents → people | ✅ Selkokeskus verbatim pair; corpus **1.4 (1) / 41.4 (68) / 0.0 (0)** |
| tehdä omatoimisesti | tehdä itse | do independently → do yourself | ✅ Selkokeskus verbatim pair |
| havaita | nähdä | perceive → see | ✅ Selkokeskus verbatim pair; corpus **8.2 (6) / 27.4 (45) / 19.9 (5)** |
| kuljetuspalvelu | posti | delivery service → post | ✅ Selkokeskus verbatim pair |
| hyödyntää | käyttää | utilize → use | **Corpus** — **2.7 (2) / 29.8 (49) / 8.0 (2)**; formal member is near-absent from selko |
| edellyttää | vaatia / tarvita | require → need | **Corpus** — **0.0 (0) / 59.7 (98) / 0.0 (0)**; zero in selko, but also zero in the news corpus, so the pair separates *magazine* prose, not news ⚠ |
| soveltaa | käyttää | apply → use | **Corpus** — **1.4 (1) / 39.6 (65) / 0.0 (0)**; same qualification as *edellyttää* ⚠ |
| mahdollistaa | tehdä mahdolliseksi / auttaa | enable → make possible / help | ⚠ **corpus does not support this as a register pair** — **9.5 (7) / 79.7 (131) / 11.9 (3)**: selko and standard news are level. Genre marker, not register marker |

Two additions the corpus produced on its own, both clean in *both* comparisons:

| Vaikea / muodollinen | Selko / arkikieli | English | Sourcing |
|---|---|---|---|
| sekä | ja | as well as → and | **Corpus** — **92.5 (68) / 427.4 (702) / 183.0 (46)**; selko lowest against both standard corpora |
| …:sta johtuen / …:n myötä | koska … | owing to / in the wake of → because | **Corpus** — **2.7 (2) / 40.8 (67) / 55.7 (14)** against **koska 153.7 (113) / 96.2 (158) / 47.7 (12)**; selko replaces the postpositional causal with an explicit clause |

### 8c. Measuring the axis — two corpora from one publisher, plus a genre-matched cross-check

**Method.** Article bodies were fetched as raw bytes and reduced to running text (WordPress
`entry-content` paragraphs, or JSON-LD `articleBody` where a site ships one), lower-cased; a token is
a maximal run of Finnish letters. Finnish is agglutinative, so probes are **stem-prefix regular
expressions over surface tokens**, not lemmas — every row therefore aggregates inflected forms, and
raw counts are printed beside every rate so a reader can see how thin a signal is. Frequencies are
per **100,000 word tokens**. A sentence boundary is `.`, `!`, `?`, `:` or a newline.

| Corpus | What it is | Publisher | Articles | Word tokens |
|---|---|---|---|---|
| **Selko** | **Selkosanomat** — Finland's selkokieli newspaper. Its own page furniture states the publisher: ”Julkaisija: Selkokeskus / Kehitysvammaliitto” | Kehitysvammaliitto | **492** | **73,508** |
| **Standard, same house** | **Ketju** — ”Kehitysvammaliiton julkaisema Ketju on enemmän kuin perinteinen järjestölehti”; general-register professional journalism | Kehitysvammaliitto | **256** | **164,264** |
| **Cross-check** | **MTV Uutiset** (mtvuutiset.fi) — standard-Finnish general news from a commercial broadcaster with no connection to the other two | MTV Oy | **118** | **25,142** |

Selkosanomat articles were sampled **evenly across the whole online archive** (every *n*-th of the
4,833 article URLs in the site's own sitemaps) so the corpus is not one period; Ketju was crawled
from its public archive; the MTV corpus is that site's current rolling article sitemap, fetched
2026-07-27.

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **The single-publisher pair does not control for topic.** Selkosanomat is general news; Ketju is
>    disability-sector journalism. That is the pair's weakness, and it is exactly why the third
>    corpus exists: **a row that separates Selkosanomat from Ketju but not from MTV news is reported
>    as a genre effect, not a register effect.** Several rows died that way — see 8d.
> 2. **The cross-check corpus is small.** 25,142 tokens means **one occurrence ≈ 4.0 per 100k**.
> 3. **Stem-prefix matching over-collects.** `^käytt` catches *käyttää*, *käyttö*, *käyttäjä*
>    alike. The rates are register signals, not lemma frequencies.
> 4. **Frequency is not comprehension.** No comprehension study for selkokieli was located; these
>    numbers say what the register *does*, not what a reader understands.

**Structure — this is where the register actually lives.**

| Metric | Selkosanomat (selko) | Ketju (yleiskieli) | MTV Uutiset (yleiskieli news) |
|---|---|---|---|
| Word tokens | 73,508 | 164,264 | 25,142 |
| Sentences | 9,784 | 13,223 | 2,437 |
| **Mean sentence length (words)** | **7.49** | 12.41 | 10.27 |
| Median sentence length | **7** | 12 | 9 |
| Mean word length (chars) | 7.17 | 7.72 | 7.33 |
| Words ≥ 7 chars | 51.9 % | 55.1 % | 53.0 % |
| **Words ≥ 12 chars** | **11.0 %** | 16.3 % | 13.1 % |

**Sentence length separates selkokieli from *both* standard corpora, and by a wide margin — 7.5
words against 10.3 and 12.4.** Long-compound share moves in the same direction but only about half
as far (11.0 % vs 13.1 % against genre-matched news). Every lexical row in 8b is smaller than this.

**Morphology and voice.**

| Probe (regex over tokens) | Selko | Ketju | MTV news |
|---|---|---|---|
| `-minen` nominalization family | 836.6 (615) | 1882.3 (3092) | **883.0 (222)** |
| Passive present `-taan/-tään` | **1210.8 (890)** | 1164.6 (1913) | 986.4 (248) |
| Passive past `-ttiin/-tiin` | 457.1 (336) | 520.5 (855) | 564.8 (142) |
| **Passive, both tenses** | **1667.9** | 1685.1 | 1551.2 |
| `ja` | 2637.8 (1939) | 4019.7 (6603) | 3257.5 (819) |
| `mutta` | 161.9 (119) | 400.6 (658) | 449.4 (113) |

**Concrete vs abstract internationalisms** — the test of the "borrowed word = hard word" instinct:

| Probe | Selko | Ketju | MTV news |
|---|---|---|---|
| `euro-` | **330.6 (243)** | 27.4 (45) | 147.2 (37) |
| `prosentti-` | **77.5 (57)** | 36.5 (60) | 31.8 (8) |
| `kilometri-` | **38.1 (28)** | 4.9 (8) | 15.9 (4) |
| `kriisi-` | **23.1 (17)** | 9.7 (16) | 4.0 (1) |
| `televisio`/`tv` | 80.3 (59) | 12.8 (21) | 75.6 (19) |
| `informaatio-` | **0.0 (0)** | 5.5 (9) | 0.0 (0) |
| `organisaatio-` | **0.0 (0)** | 43.8 (72) | 0.0 (0) |
| `kommunikaatio-` | **0.0 (0)** | 32.9 (54) | 0.0 (0) |
| `motivaatio-` | **0.0 (0)** | 9.7 (16) | 4.0 (1) |
| `resurss-` | **0.0 (0)** | 26.8 (44) | 8.0 (2) |
| `konkreetti-` | **0.0 (0)** | 29.2 (48) | 0.0 (0) |

### 8d. 🔴 Do NOT "simplify" these — where the measurement contradicts the instinct

**This is the highest-value table in §8.** Every row is a change a translator applying the usual
instincts would make, and every one of them is unsupported or actively wrong for Finnish.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~Strip the passive out of `fi-easy` because the kit's base rules say "active voice"~~ | **Selkokieli uses the passive at least as much as standard Finnish.** Both tenses together: **selko 1667.9 vs Ketju 1685.1 vs news 1551.2** per 100k — selko is *above* the genre-matched news corpus. And the authority does not ban it: ”Tekstissä käytetään passiivia vain silloin, kun tekijä ei ole tiedossa tai tekijän mainitseminen ei ole olennaista ( Presidentinvaalit järjestetään kuuden vuoden välein. Talo on rakennettu 1920-luvulla. )”. **The real rule is scoped, not global**: ”Lukijalle suunnattuja ohjeita ei esitetä passiivimuodossa ( lomake täytetään ).” Kill the passive in *instructions to the reader*; leave it alone elsewhere. |
| ~~Hunt down every `-minen` noun~~ | Against the genre-matched news corpus the `-minen` family is **level**: **selko 836.6 vs news 883.0**. Only the professional magazine is high (1882.3). A translator who deletes `-minen` nouns from a news-register text is not moving it toward selkokieli. What Selkokeskus actually forbids is the *stack*: ”Tekstissä ei ole substantiivityylisiä ilmauksia (ns. substantiivitauti, esim. Projektin toteutuksen suunnittelu aikataulutetaan. ).” **Unstack the chain; keep the single noun.** |
| ~~Replace an international word with a native Finnish one~~ | **Concrete internationalisms are *more* frequent in selko than in standard news**, not less: *euro* **330.6 vs 147.2**, *prosentti* **77.5 vs 31.8**, *kilometri* **38.1 vs 15.9**, *kriisi* **23.1 vs 4.0**; *televisio/tv* is level. What actually vanishes from selko is the **abstract** Latinate noun — *informaatio*, *organisaatio*, *kommunikaatio*, *motivaatio*, *resurssi*, *konkreettinen* are all **0 occurrences in 73,508 selko tokens**. The axis is concrete vs abstract, and Selkokeskus says so itself (8b). ⚠ The five concrete rows are quantity/news words and Selkosanomat is number-heavy news; the *direction* is consistent across all five, the *size* is topic-exposed. |
| ~~Swap a Latinate word for a "plain" native one like *eräs* or *ohella*~~ | **They look plain and are not.** *eräs* runs **4.1 (3) selko / 65.7 (108) Ketju / 4.0 (1) news**; *ohella / ohessa* runs **0.0 / 45.7 (75) / 0.0**. Read off the single-publisher pair alone, both would have been declared "formal words selko avoids" — the news cross-check shows they separate **magazine narration from news**, not standard from selko. **This row is here as much for the method as for the words: a two-corpus finding that the third corpus does not reproduce is not a register finding.** |
| ~~Assume the recommended everyday word is a marker of easy Finnish~~ | The *replacements* in 8b's table are commoner in **standard** text than in selko: *kertoa* **220.4 selko vs 620.5 news**; *käyttää* 182.3 vs 135.2 in news but 298.3 in Ketju; *tarvita* 117.0 vs 311.7 in Ketju. The swaps are still right — the formal member really is absent from selko — but **the replacement earns no simplification credit on its own.** Substituting words without shortening the sentence changes almost nothing measurable. |
| ~~Treat `mahdollistaa` as a formal word to purge~~ | **selko 9.5 (7) vs news 11.9 (3)** — level. It was carried as an `⚠ editorial` row in the previous edition of this guide; the measurement does not support it as a register pair and the row is now marked accordingly in 8b. |

> **→ The rule that follows.** In Finnish, **do not simplify by etymology and do not simplify by
> suffix.** Simplify by **sentence architecture** first (7.5 words, one subordinate clause), by
> **unstacking noun chains** second, and by **replacing abstract nouns with concrete actors** third.
> A concrete international word is not a defect; an abstract native compound often is.

### 8e. 🔑 The address decision — `fi-easy` keeps **sinä**, and makes it explicit

> **Decision, recorded so nobody "fixes" it: `fi-easy` keeps the `sinä` register of §4, and uses it
> *more* explicitly than the base variant. It does NOT switch to `te`, and it does NOT drop into a
> childish tone.**

- ✅ **sinä** / second-person singular / possessive suffix — in `fi` and in `fi-easy` alike
- ❌ **te** (teitittely) — distancing officialese, not respect, in a text meant to be easy
- ❌ a chummy or teacherly voice — a different failure with the same cause

**Why, and it is sourced rather than inferred.** Finnish is unusual here: for most languages the
question is whether the simplified variant may drop to a familiar form. In Finnish `sinä` is
*already* the neutral default (§4), so the live risk runs the other way — toward impersonal
officialese, or toward talking down. Selkokeskus's criteria address both:

1. **Direct address is a criterion, not a stylistic option.** ”Teksti on suunnattu selkeästi
   lukijalle esimerkiksi suoran puhuttelun avulla (esim. pronomini sinä , yksikön toinen persoona
   kirjoita tai omistusliite nimesi ).”
2. **Condescension is explicitly a defect.** ”Teksti ei aliarvioi lukijaa. Se ei esimerkiksi selitä
   liikaa tai ole liian opettavainen.” — *the text does not underestimate the reader; it does not,
   for example, over-explain or become too didactic.* **Informality is not a simplification lever
   and over-explaining is a scored fault.**
3. **The reader is an agent, not a recipient.** ”Lukijaa ei esitetä liian usein passiivisena tai
   avun kohteena, vaan lukija on myös aktiivinen toimija.”
4. **One sourced exception.** Indirect address is permitted where direct address would not sit
   naturally: ”Asioista kerrotaan yleisellä tasolla tai tekstissä hyödynnetään epäsuoraa puhuttelua
   silloin, kun suora puhuttelu ei tunnu luontevalta esimerkiksi tekstin tyylin, tekstilajin,
   tekstissä käsiteltävien arkaluonteisten puheenaiheiden tai liiallisen suoran puhuttelun takia.”

- ✅ `fi-easy`: **Täytä lomake. Lähetä se meille.**
- ❌ passive instruction: **Lomake täytetään ja lähetetään.**

### 8f. What the pendant is built on — in order of leverage

**Structure ≫ morphology > vocabulary.** The measurement puts numbers on that ordering, so it is
stated as a work order rather than a list of virtues.

1. **Sentence architecture — the main lever.** Target the measured selko profile: **mean ~7.5 words,
   median 7**, ”Sivulauseita on pääosin vain yksi”, direct S-V-O order, predicate early. Where the
   kit's own ~8–12-word base target and the Finnish measurement differ, **the Finnish number is the
   tighter one and it wins.**
2. **Morphology — unstack, do not de-suffix.** Break noun chains (*substantiivitauti*) into finite
   clauses; drop *lauseenvastikkeet* and postpositional causals (*johtuen*, *myötä* → *koska*).
   **Leave the passive alone except in instructions to the reader** (8d, 8e).
3. **Vocabulary — abstract → concrete, not foreign → native.** Replace abstract nouns with concrete
   actors; use *ja* rather than *sekä*; keep concrete internationalisms. The 8b table applies here,
   with its per-row qualifications.
4. **Layout.** **12–16 pt** body text (”12–16 pistettä leipätekstissä”), sparing emphasis, generous
   spacing.

**Base rules this overrides.** `fi-easy` inherits the kit's base simplified-language rules from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one
idea per sentence, everyday words, say what *is* not what *isn't*, a one-line "what is this" opener,
a consistent literal tone — **except** for one, named explicitly: **the kit's blanket "prefer active
voice" rule does not hold for Finnish** and is replaced by the scoped rule in 8d. The kit's
~8–12-word sentence target is tightened to the measured ~7.5.

**Term-preservation rule (restated, binding).** In `fi-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Keep e.g. **tekoäly**, then gloss it in context:
*tekoäly = tietokoneohjelma, joka oppii*. This is distinct from the complex→everyday table in 8b,
which targets bureaucratic *non-technical* vocabulary. For an AI/ML platform: shorten sentences (one
idea each), gloss unavoidable terms in context, unstack noun chains, prefer concrete actors, use
*sinä* address, and keep 12–16 pt body text with generous layout.

### 8g. What is still open

1. **No comprehension evidence.** Every number here is a frequency. Whether a selko reader
   *understands* *prosentti* better than a native paraphrase is untested, and no Finnish
   comprehension study was located.
2. **The topic confound is not fully removed.** Ketju is disability-sector journalism and
   Selkosanomat is general news. The MTV cross-check is genre-matched but small (25k tokens). A
   larger genre-matched standard corpus would firm up the concrete-internationalism rows in
   particular.
3. **The obvious best pair could not be used.** **Yle** publishes both *Yle Uutiset selkosuomeksi*
   and *Yle Uutiset* — same publisher, same domain, same day, which would remove the topic confound
   entirely. `yle.fi/robots.txt` disallows automated AI crawling by name and the article host
   returned **HTTP 403** during this pass, so the pair was not built. **Anyone repeating this
   measurement with permission should start there.**
4. **The `selkomittari` itself was never applied.** This section measures corpora against each
   other; it does not score any text on the official 96-criterion instrument. The full instrument
   document (as opposed to the criteria web page) was not retrieved, and the ⚠ on the "every main
   criterion ≥ 2" restatement in 8a is still open.
5. **`tehdä omatoimisesti → tehdä itse` and `kuljetuspalvelu → posti`** are Selkokeskus's own example
   pairs but were **too rare to measure** in either corpus; they stay on the authority's word alone.
6. **Spoken selkokieli** (*selkopuhe*) has its own Selkokeskus guidance and is not covered here; this
   section is about written `fi-easy` only.

Sources: <https://selkokeskus.fi/selkokieli/selkokielen-maaritelma/> ·
<https://selkokeskus.fi/selkokieli/selkokielen-tarve/> ·
<https://selkokeskus.fi/selkokieli/selkokielen-mittari/selkokielen-mittarin-ohjeet-ja-kriteerit/>
(Official tier — Selkokeskus / Kehitysvammaliitto; every criterion quoted in 8b, 8d, and 8e is
verbatim from this page) ·
<https://selkokeskus.fi/selkokieli/nain-puhut-selkokielta/sanat-ja-kielen-rakenteet-selkopuheessa/> ·
**Selko corpus** — 492 articles of Selkosanomat sampled evenly across the site's own sitemaps
<https://selkosanomat.fi/wp-sitemap.xml>, 73,508 word tokens ·
**Same-publisher standard corpus** — 256 articles of Ketju crawled from
<https://ketju-lehti.fi/arkisto/>, 164,264 word tokens ·
**Independent cross-check** — 118 standard-Finnish news articles from
<https://www.mtvuutiset.fi/sitemap.xml>, 25,142 word tokens; corpora fetched 2026-07-27 ·
<https://yle.fi/robots.txt> (why the Yle pair was not used) ·
[accessibility-workflow](../accessibility-workflow.md) · [translation-quality](../translation-quality.md)

---

## 9. Regional variation

**⚠ Community-tier section (Wikipedia + Kotus framework); neutrality recommendation editorial.**
Native-speaker confirmation pending.

**One written standard.** Finnish has a strong **diglossia** between **yleiskieli / kirjakieli**
(standard written) and **puhekieli** (colloquial/spoken), plus western vs eastern dialect groups —
but there is **only one written standard**, with no competing regional written norms (unlike, e.g.,
Norwegian). A single neutral `fi` build serves all readers. ⚠ no single verbatim quote on "one
written standard" was fetched; it is confirmed by the absence of any regional written standard in
Kotus references and by the single authority (Kotus) governing *yleiskieli*.

**"Neutral" written Finnish = yleiskieli.** Standardized spelling/inflection per Kielitoimiston
sanakirja + ohjepankki. Avoid dialect/colloquial forms — *mä/sä* for *minä/sinä*, colloquial verb
endings — and avoid slang. For an educational platform, translate into **yleiskieli**, with the
optional **selko** variant (§8) and **sinä** address (§4). Spoken-style *mä/sä* only if a
deliberately casual brand voice is wanted — otherwise it reads as non-standard.

- ✅ yleiskieli: **sinä**, **minä**, **klikkaa tästä** · ✅ selko variant per §8
- ❌ puhekieli in default content: **sä**, **mä**, colloquial endings (reads as non-standard/regional)

The only axes to hold are **register** (yleiskieli, not puhekieli; §9) and the **sinä** decision
(§4) — there is no second orthography to reconcile.

Sources: <https://fi.wikipedia.org/wiki/Suomen_kieli> (community) · Kotus authority framework
(<https://kielitoimistonohjepankki.fi/>)

---

