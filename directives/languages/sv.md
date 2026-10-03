<!-- base -->
# lang-sv — Swedish (svenska) — language guide

> **Setup & sources live in [`sv.setup.md`](sv.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** svenska / Swedish. The written standard this guide targets is
**rikssvenska / sverigesvenska** (Sweden Swedish); Finland-Swedish (`sv-FI`) is treated as
regional variation in §9.
**BCP 47 code (base):** `sv`.
**BCP 47 code (simplified variant):** `sv-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`sv-x-simple`), but the kit token `sv-easy` is the one
that counts here.
**Speaker reach:** spoken by roughly **10 million** people, "mainly in Sweden and also in Finland,
where it is one of the two national languages and has official status"; also official on **Åland**,
and an official language of the EU. **⚠ the figure is a round summary number, not a census count** —
confirm against a census / Ethnologue figure before treating it as exact.
**Script + direction:** Latin alphabet plus the three extra vowel letters **å ä ö**;
**left-to-right**. No romanization applies — Swedish is already written in Latin script.
**Status:** planned — authored from a single **external desk-research pass** (quote-per-claim,
then independently reviewed against its cited sources). Covers base `sv` and the `sv-easy` pendant.
**Not yet reviewed by a native speaker**, and this revision is the first structured pass over
the research — per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.
**Easy or hard for this kit:** Swedish is **structurally easy** for this kit — Latin script,
whitespace word separation (standard tokenization applies), no shaping or bidi. The real risks
are narrow and specific: **å ä ö must survive as UTF-8** (never degraded to digraphs aa/ae/oe);
**compounding** (English two-word noun phrases become one Swedish word — splitting them is a
real error that can change meaning); **V2 word order** (a fronted element forces subject–verb
inversion); the **en/ett gender** and **double-definiteness** systems; and the number format
(**comma decimal, space thousands, trailing `kr`**). The register question is settled: post
du-reform, informal **du** is the default (§4).

Sources: <https://svenska.se/> · <https://www.isof.se/svenska-spraket> ·
<https://en.wikipedia.org/wiki/Swedish_language> (speaker reach, Finland/Åland official status —
⚠ a round summary figure, not a census count)

---

## 1. Header block

See above. One-line orientation: Swedish is a North-Germanic, **V2**, LTR, whitespace-separated
Latin-script language with a shared written standard (rikssvenska) and a settled informal
register (du); the localization risks concentrate in **å/ä/ö encoding, compounding, V2
inversion, en/ett gender + double definiteness, and the comma-decimal / space-thousands / `kr`
number format**.

Sources: as the header block above — <https://svenska.se/> · <https://www.isof.se/svenska-spraket> ·
<https://en.wikipedia.org/wiki/Swedish_language> (speaker reach — ⚠ a round summary figure)

---

## 4. Grammar for translators

**Word order — V2 (verb second).** Swedish is a strict **V2** language: in a main clause the
finite verb is the **second constituent**.

- <https://sv.wikipedia.org/wiki/V2-ordf%C3%B6ljd> — "V2-ordföljd är … ett ordföljdssystem där
  predikatsverbet i regel måste komma på andra plats bland leden i en sats"
- <https://sv.wikipedia.org/wiki/V2-ordf%C3%B6ljd> — "Svenskan är ett tydligt exempel på ett
  V2-språk"

The consequence that breaks naive translation: **fronting an adverbial forces subject–verb
inversion** (omvänd ordföljd). A translator who calques English SVO after a fronted element
produces ungrammatical Swedish.

- ✅ **Idag arbetar jag hemifrån.** (verb *arbetar* before subject *jag*)
- ❌ **Idag jag arbetar hemifrån.** (English SVO order — wrong)

*(The illustrative "Nu äter han päron" fronting example in the dossier came from a search summary,
not a single fetched authority page; the V2 rule itself is sourced above.)*

**Register — du vs ni (post du-reform), the project's recorded choice.** Since the **du-reform**
(late 1960s–1970s), Swedish uses informal **du** as the default address to everyone, including in
public and official contexts. Formal **ni** is *not* the polite default and can read as odd or —
to older speakers — slightly condescending when used as a singular formal.

- <https://frageladan.isof.se/faqs/23349> — "Det allmänna duandet inleddes på 1960-talet"; it was
  "genomförd under 1970-talet"; "en process som skedde gradvis under många år".

> **Register decision (human-gate): du — informal singular — taken and recorded.** On the quality
> argument, the sourced du-reform facts are unambiguous:
> **du (singular)** is the modern Swedish default for everyone, and using **ni** as a *singular
> formal* would be marked. **Binding for all second-person copy in `sv` and `sv-easy`:** address
> the reader as **du**; use **ni only as the literal plural** ("you all"). No drift to a singular
> formal *ni* — including in formal or instructional passages. *(Finland-Swedish keeps polite
> singular *ni* more often — see §9; it is out of scope for the neutral `sv` build.)*
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ **Klicka här, så kommer du vidare.** (du — singular reader)
- ✅ **Ni** — only when addressing several people literally: **Ni kan alla logga in.**
- ❌ **Ni** as a formal singular to one reader: **Vill Ni klicka här?** (marked / old-fashioned)

The grammar features that break a naive EN/DE → SV translation:

**(1) Compounding (sammansättning) — and särskrivning is a real error.** English noun phrases are
often written as **one word** in Swedish; splitting them ("särskrivning") is an error that can
change meaning. Compounding is a listed topic in *Myndigheternas skrivregler* ("hop- och
särskrivning", §2).

- ✅ **maskininlärning** (one word) · ❌ **maskin inlärning** (two words)
- Classic minimal pair: ✅ **en rökfri dag** ("a smoke-free day") vs ❌ **en rök fri dag**
  (≈ "a smoke, free day" — a different, unintended reading). *(⚠ editorial — the well-known
  Swedish teaching example; compounding as a topic is sourced.)*

**(2) En/ett gender (two genders).** Every noun is **common (en)** or **neuter (ett)**, and that
choice controls the article, the definite ending, and adjective agreement. It is lexically
memorized, not derivable — pick the wrong gender and the phrase is immediately wrong.

- ✅ **ett hus → huset** · ✅ **en bil → bilen**
- ❌ **en hus** · ❌ **ett bil** *(⚠ editorial — basic Swedish grammar.)*

**(3) V2 inversion after a fronted element** (see the rule above). ✅ **Idag arbetar jag…** /
❌ **Idag jag arbetar…** Sourced by the V2 rule above.

**(4) Definiteness is a suffix, plus double definiteness with an adjective.** "The" is usually a
**word ending**, and when an adjective is present Swedish marks definiteness **twice** (article
*+* adjective *+* suffix).

- ✅ **det stora huset** (article *det* + adjective *stora* + suffix *-et*)
- ❌ **stora huset** alone (missing the article) · ❌ **det stor hus** (missing agreement + suffix)
  *(⚠ editorial — basic grammar.)*

**(5) False-friend / anglicism drift.** Where an established Swedish term exists, it should win in
edited educational copy over an English calque or loan-verb.

- ✅ **ladda ner / ladda ned** · ❌ **downloada**
- ✅ **neuronnät** (recommended, §6) in edited text · ❌ the calque **neuralt nätverk**
  *(term sourced in §6; the *download* example is ⚠ editorial.)*

Sources: <https://sv.wikipedia.org/wiki/V2-ordf%C3%B6ljd> ·
<https://frageladan.isof.se/faqs/23349> ·
<https://www.isof.se/utforska/vagledningar/myndigheternas-skrivregler>
(gender / double-definiteness / compounding minimal-pair examples are ⚠ editorial standard grammar)

---

## 5. Numbers, dates, currency

Source for this section unless noted: **CLDR `sv`** number data (Unicode CLDR JSON, `main`) —
fetched raw. This is the strongest-evidence section in the guide.

**Digit system.** Western digits **0–9** throughout (no native-digit alternative).

**Decimal separator = comma.** CLDR `sv` symbols: decimal = **`","`**.

- ✅ **3,14** · ❌ **3.14**

**Group (thousands) separator = space.** CLDR `sv` symbols: group = **`" "`** (a space; emit the
**no-break space U+00A0** so numbers don't break across lines, §3). Decimal pattern =
**`"#,##0.###"`** (groups of three).

- ✅ **10&nbsp;000** · **1&nbsp;000&nbsp;000** — the separator is U+00A0, written as the entity
  because U+00A0 and U+0020 are visually identical (§3).
- ❌ **10,000** · ❌ **10.000** — English/German grouping characters.
- ❌ a plain U+0020 between the groups: it renders the same but lets the number wrap mid-figure.

**List separator** = **`";"`** (CLDR `sv`) — relevant when joining values in prose or UI lists.

**Currency — symbol *follows* the amount, after a space.** CLDR `sv` currency pattern =
**`"#,##0.00 ¤"`** (the `¤` placeholder is last). The Swedish krona: displayName **"svensk
krona"**, plural **"svenska kronor"**, symbol **"kr"**
(<https://www.unicode.org/cldr/charts/latest/summary/sv.html>).

- ✅ **1&nbsp;234,50 kr** · ✅ **249 kr** · ✅ **249 SEK** (amount first, unit after; the thousands
  separator is U+00A0 as above)
- ❌ **kr 249** · ❌ **$249**-style leading symbol *(⚠ the "amount-first" ordering is editorial but
  directly implied by the `¤`-last CLDR pattern. The space **between amount and unit** was not
  read by codepoint from the CLDR pattern — U+0020 is shown here; if the unit must not detach from
  the figure, set U+00A0 there too as a house-style decision.)*

**Dates.** Swedish very commonly uses the **ISO-style `yyyy-mm-dd`** (e.g. **2026-07-25**), which
is the everyday numeric date form in Sweden. For prose, spell the month: **25 juli 2026**.

- ✅ numeric: **2026-07-25** · ✅ prose: **25 juli 2026**
- ❌ US-style **07/25/2026** · ❌ **25.07.2026** (German-style dotted)

**⚠** The specific "recommended by *Myndigheternas skrivregler*" wording was **not** fetched
verbatim (the guide's date-format page was not opened). Treat the *recommendation* as ⚠ editorial;
the **prevalence** of `yyyy-mm-dd` in everyday Swedish is well established.

**Time.** 24-hour clock; the separator is a **colon or a period** depending on house style
(**14:30** / **14.30**). *(⚠ editorial — CLDR time symbols not individually quoted here.)*

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/sv.html> ·
<https://www.unicode.org/cldr/charts/latest/summary/sv.html>
(date recommendation + time separator are ⚠ editorial; currency ordering ⚠ implied by the CLDR pattern)

---

## 6. Terminology strategy

**Loanword vs coinage.** Swedish strongly favors **native compounds/coinages** over raw English
loanwords in edited educational text (e.g. *maskininlärning*, *djupinlärning*, *neuronnät*), even
where the English term also circulates colloquially. Where **Svenska datatermgruppen** recommends
a Swedish term, use it — but note the provenance caveat below.

**Transliteration.** None — Swedish is Latin-script; slugs/identifiers can use the ASCII fold of
å→a, ä→a, ö→o for machine keys only, never as display text (§10).

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give the Swedish term + the English original + one
short plain gloss, then use the Swedish term alone afterwards. Instantiated with a sourced term:

> **neuronnät** (neural network) — en beräkningsmodell uppbyggd av sammankopplade noder i lager,
> löst inspirerad av hjärnans nervceller. *("… a computational model of interconnected nodes in
> layers, loosely inspired by the brain's nerve cells.")*

After first mention: **neuronnät** alone. Project coinages (C1) keep their original spelling in
Swedish text and are owned by the term-sheet, not this table.

**Provenance tiering (audit-mandated).** The Svenska datatermgruppen page **404'd during
research**, so *no term below is academy-sourced*. Terms split into three tiers:

- **Wikipedia-tier** (a verbatim Swedish-Wikipedia definition was fetched) — usable, but Wikipedia
  is the source, not a language authority.
- **⚠ semi-verified / community** — the dossier's citation was a **search summary** (marked "via
  search") or a search-rendered form, **not** a fetched authority page. **Per the audit these must
  not be counted as sourced.**
- **⚠ editorial** — a transparent Swedish compound or adopted loan the research did not separately
  fetch.

| EN | Swedish (recommended) | Tier | Source + verbatim |
|---|---|---|---|
| artificial intelligence | **artificiell intelligens (AI)** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Artificiell_intelligens> — standard Swedish term (definition not separately quoted). |
| machine learning | **maskininlärning** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Maskininl%C3%A4rning> — "Maskininlärning (engelska: machine learning) är ett område inom artificiell intelligens" |
| deep learning | **djupinlärning** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Maskininl%C3%A4rning> — "Djupinlärning (Deep Learning) är en avancerad form av maskininlärning" |
| (artificial) neural network | **neuronnät** / artificiellt neuronnät | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Artificiellt_neuronn%C3%A4t> — "Ett **neuronnät** (rekommenderad term enligt Svenska datatermgruppen) eller artificiellt neuronnät (ANN)" (Datatermgruppen cited *via Wikipedia only* — its own page 404'd). |
| supervised learning | **väglett lärande** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Maskininl%C3%A4rning> — "Väglett lärande (supervised learning)" |
| unsupervised learning | **icke-väglett lärande** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Maskininl%C3%A4rning> — "Icke-väglett lärning (unsupervised learning)" (spelled *lärning* in the article) |
| language model | **språkmodell** | Wikipedia-tier | <https://sv.wikipedia.org/wiki/Spr%C3%A5kmodell> — "Språkmodell (engelska: language model) är en statistisk modell och sannolikhetsfördelning" |
| large language model (LLM) | **stor språkmodell (LLM)** | ⚠ semi-verified / community | <https://sv.wikipedia.org/wiki/Stor_spr%C3%A5kmodell> **(via search)** — "En stor språkmodell (engelska: large language model, LLM) är en modern form av språkmodell". **Not counted as sourced.** |
| generative AI | **generativ artificiell intelligens / generativ AI** | ⚠ semi-verified / community | <https://sv.wikipedia.org/wiki/Generativ_artificiell_intelligens> — "Generativ artificiell intelligens (även generativ AI) är artificiell intelligens som kan generera text, bilder, videor…". **Per audit, treated as semi-verified — not counted as sourced.** |
| prompt | **prompt** (pl. prompter) | ⚠ semi-verified / community | <https://sv.wikipedia.org/wiki/Generativ_artificiell_intelligens> — "…som svar på specifika instruktioner (så kallade prompter)". **Per audit, treated as semi-verified.** |
| transformer (architecture) | **transformator** / transformer | ⚠ semi-verified / community | <https://sv.wikipedia.org/wiki/Spr%C3%A5kmodell> **(via search)** — "arkitekturer som recurrent neural networks (RNN) eller transformatorer (Transformers)". **Not counted as sourced.** |
| natural language processing (NLP) | **naturlig språkbehandling** | ⚠ semi-verified / community | From a **search summary** (Datatermgruppen-style rendering), **not** a fetched authority page. **Not counted as sourced.** |
| algorithm | **algoritm** | ⚠ editorial | standard Swedish term; not separately fetched. |
| training data | **träningsdata** | ⚠ editorial | transparent Swedish compound; not separately fetched. |
| hallucination (LLM) | **hallucination / hallucinera** | ⚠ editorial | adopted loan; not separately fetched. |
| fine-tuning | **finjustering** | ⚠ editorial | standard compound; not separately fetched. |

**Recommended default set** for the platform: **artificiell intelligens (AI), maskininlärning,
djupinlärning, neuronnät, språkmodell**, with the English term in parentheses on first use. Freeze
the chosen forms in the project glossary and do **not** mix competing renderings (e.g. do not
alternate *neuronnät* and *neuralt nätverk*, or *transformator* and *transformer*, within the
platform). Treat the whole table as **field usage to confirm against Svenska datatermgruppen once
its pages are reachable**, not as canon.

Sources: <https://sv.wikipedia.org/wiki/Artificiell_intelligens> ·
<https://sv.wikipedia.org/wiki/Maskininl%C3%A4rning> ·
<https://sv.wikipedia.org/wiki/Artificiellt_neuronn%C3%A4t> ·
<https://sv.wikipedia.org/wiki/Spr%C3%A5kmodell> ·
<https://sv.wikipedia.org/wiki/Generativ_artificiell_intelligens>
(the 5 "via search" / search-summary terms are ⚠ semi-verified — not counted as sourced;
Datatermgruppen's own page 404'd)

---

## 7. Idiom anti-patterns

**Stock phrases of educational and technical writing (EN → SV): idiomatic form ✅ vs literal calque
❌.** These are the phrases that actually recur in course copy, UI help, and documentation. The table
arrived from a second research dossier whose §H attached only a general link to the Swedish
Academy's language page — which does **not** evidence idiom equivalence. Rather than ship that,
**every ✅ was taken back to a source**: **Svensk ordbok (SO)** at `svenska.se`, and Språkbanken's
**Korp** corpus (the `EDIT` set — 19 corpora of edited Swedish: DN, GP, Press 95–98, SUC3,
Myndighet, Åtta Sidor, Webbnyheter, sv.wikipedia). The tier column records what was found.
**Only `dictionary` rows may inform a §11 check**; `corpus` rows evidence usage, not prescription.

⚠ Cite `https://svenska.se/so/?sok=<ord>` for a human reader and
`https://svenska.se/api/search/so?q=<ord>&exactMatch=true` for a machine check. The
`svenska.se/tri/f_so.php?sok=` shape returns HTTP 200 with an empty shell and must **not** be cited.

| # | English phrase | ✅ Idiomatic Swedish | ❌ Literal calque (wrong) | ✅ tier |
|---|---|---|---|---|
| 1 | step by step | **steg för steg** | *steg av steg* — ⚠ craft | **dictionary** (SO idiom) |
| 2 | under the hood | **under huven** | *(none — see below)* | corpus (276) |
| 3 | break it down | **dela upp det** | *(none — see below)* | **dictionary** + corpus |
| 4 | keep in mind | **tänk på** | *(none — see below)* | **dictionary** |
| 5 | at a glance | **vid första anblicken** · **i korthet** · **med en snabb blick** | *vid en blick* — ⚠ craft; rare, and always needs *på X* | **dictionary** + corpus |
| 6 | the big picture | **helhetsbilden** | *den stora bilden* — **ambiguous, not wrong**: most often a physically large picture | **dictionary** |
| 7 | a deep dive | **fördjupning** | *ett djupt dyk* — ⚠ craft | **dictionary** (SO sense 2) |
| 8 | rule of thumb | **tumregel** | *(none — see below)* | **dictionary** |
| 9 | in the long run | **på lång sikt** | *(none — see below)* | **dictionary** (SO idiom) |
| 10 | built on top of | **byggd ovanpå** / **baserad på** | *byggd på toppen av* — **genuinely wrong** in the software sense | corpus (technical) |

**The ✅ column, sourced.** Quotes below are verbatim from Svensk ordbok unless marked corpus;
counts are Korp `EDIT` hits:

- **steg för steg** — SO lists it as an idiom under *steg*, glossed "successivt", with the example
  "steg för steg har de förvandlat sitt familjeslott till ett elegant hotell". 1253 corpus hits;
  Åtta Sidor (Sweden's easy-language newspaper) writes "Arbetet ska göras steg för steg i samarbete
  med myndigheter och organisationer."
- **tänk på** — SO, under *tänka* with the preposition *på*: "beakta, ta hänsyn till", example
  "lite tystare, ni måste tänka på att klockan är mycket". 2215 corpus hits.
- **vid första anblicken** — SO, under *anblick*: "vid första anblicken verkar problemet kanske
  olösligt". ⚠ It has been **added to ✅ as the leading option**, because it is the native idiom the
  row was missing: *i korthet* means "briefly, in summary" (SO: "i korthet är läget följande …"),
  which is a summary, not a glance.
- **helhetsbilden** — SO, under *helhetsbild*: "övergripande uppfattning och förståelse av något
  betraktat som helt", example "hon försökte skaffa sig en helhetsbild av kommunens service".
- **fördjupning** — SO sense 2: "mer grundläggande eller inträngande (intellektuell) behandling",
  example "utbildningen ger möjligheter till fördjupning inom ett av de tre angivna områdena".
- **tumregel** — SO: "enkel regel som stämmer någorlunda i normalfallet".
- **på lång sikt** — SO carries it as an idiom under *sikt*: "på lång/längre sikt" → "med tanke på
  en mer avlägsen framtid".
- **dela upp det** — SO lists the particle verb *dela upp*; 64 corpus hits.
- **byggd ovanpå / baserad på** — corpus only, but squarely technical: sv.wikipedia, *Node.js* —
  "Node.js är byggt ovanpå Googles snabba JavaScript-motor V8"; *Edubuntu* — "Edubuntu är byggt
  ovanpå Ubuntu".

**⚠ The ❌ column is craft, and it was the weakest thing in this guide.** A wrong calque is what
actually stops a translator making the error, and it is the least attestable column, because
dictionaries record what people write rather than the plausible forms they might write. **No Swedish
anglicism advice page could be found naming any of these forms as an error** — and Språkrådet's own
language adviser warns against exactly this reflex, in an article about handling English in Swedish
text: phrase-level translation loans are "märkligt nog … ofta den typen av anglicism som retar flest
människor", and of one much-disliked example he writes "Just det uttrycket är **helt idiomatisk
svenska**, så avogheten är lite svår att förstå." What could be established here is only absence:
*steg av steg* and *ett djupt dyk* return **zero** hits in both Korp `EDIT` and sv.wikipedia. That is
honest support for avoiding them, and no support at all for calling them documented errors.

**Only row 10's ❌ carries positive evidence**, and it is worth the space: *byggd på toppen av* has
six occurrences across Korp and sv.wikipedia and **every one is literal physical geography**
("Sankt Paulskatedralen är byggd på toppen av Ludgate Hill"; "Erebunifästningen är byggd på toppen
av den 65 meter höga kullen Arin Berd"). Zero figurative or software uses. That is a real
distribution result, not an absence, and it is the one ❌ in this table a §11 check could act on.

**Four ❌ cells were removed, because they condemned dictionary-attested Swedish.**

- **under the hood** — ❌ *under motorhuven*. *Motorhuv* is a **native Swedish compound with its own
  SO headword** ("uppfällbart överliggande skydd för bilmotor"), listed by SO as a compound of
  *huv*. The row was condemning the more explicit native synonym of its own ✅. The only defensible
  claim is relative frequency in the figurative sense (276 vs 65), which is a preference, not a
  rule.
- **break it down** — ❌ *bryt ner det*. SO carries a **full headword for the particle verb**
  *bryta ner / bryta ned*, and explicitly lists the imperative form *bryt ner*. Worse for the old
  cell: edited Swedish uses the exact condemned string in the exact instructional sense — Göteborgs-
  Posten, "Bryt ner det i mindre steg tills du vågar utmana rädslan och göra det."
- **keep in mind** — ❌ *håll i minnet*. SO's own example under *hålla* is "hon höll bilden av honom
  i minnet", and the phrase runs to 142 corpus hits for *hålla i minnet* (6 for the imperative),
  including Dagens Nyheter: "Vi bör också hålla i minnet att alla inblandade ställdes inför en unik
  situation."
- **in the long run** — ❌ *i det långa loppet*, previously dismissed as "colloquial, often less
  exact". **SO lists it as an idiom** under *lopp*: "i det långa loppet" → "över en längre
  tidsperiod", and it carries **no register label** — which matters, because SO does label
  colloquialisms (in the *spik* article, *spiken i botten* is marked `vardagligt`). 430 corpus hits,
  including formal Dagens Nyheter prose: "staten i det långa loppet inte förmår ställa upp med allt
  kapital som behövs".
- **rule of thumb** — ❌ *tumregel av tummen* is gone as **incoherent, not merely unattested**: the
  string contains the correct answer (*tumregel*) and then appends a redundant gloss, so no
  translator would ever produce it. It is a manufactured strawman. The plausible literal alternative
  *regel av tummen* is also zero in both Korp and sv.wikipedia, so there is no real error available
  to swap in and the row is now positive-only.
- **the big picture** — ❌ *den stora bilden* was reworded rather than removed. Most of its 56 corpus
  hits are literal ("På den stora bilden lägger människor blommor vid platsen för morden"), but
  figurative uses exist in edited prose. The objection is **ambiguity**, and Språkrådet names that
  exact mechanism: "I vissa fall konkurrerar ett nytt översättningslån med en äldre svensk
  betydelse."

**General idioms — kept for the two structural lessons they carry, and both lessons now check out.**
Two entries from an earlier revision are worth retaining even though a course translator rarely
needs the phrase itself — and unlike before, both claims are sourced rather than asserted:

- **"the elephant in the room"** → *elefanten i rummet* really is a case where the literal transfer
  **has** become idiomatic Swedish: SO carries it under *elefant*, glossed "stort problem eller
  känsligt ämne, som alla känner till, men undviker att prata om", and sv.wikipedia has its own
  article under that title. **dictionary** tier.
- **"hit the nail on the head"** → *att slå huvudet på spiken* really does **flip the word order**:
  SO lists "slå/träffa huvudet på spiken" → "träffa rätt" under both *spik* and *huvud*. English
  hits **the nail** on **the head**; Swedish hits **the head** on **the nail** — the two nouns are
  swapped, so a translator copying the English order produces the wrong image. **dictionary** tier.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: **✅-column attestations, each fetched and quoted above** — Svensk ordbok via
<https://svenska.se/so/?sok=steg> · <https://svenska.se/so/?sok=t%C3%A4nka> ·
<https://svenska.se/so/?sok=anblick> · <https://svenska.se/so/?sok=korthet> ·
<https://svenska.se/so/?sok=helhetsbild> · <https://svenska.se/so/?sok=f%C3%B6rdjupning> ·
<https://svenska.se/so/?sok=tumregel> · <https://svenska.se/so/?sok=sikt> ·
<https://svenska.se/so/?sok=dela> (machine-checkable at
`https://svenska.se/api/search/so?q=<ord>&exactMatch=true`; the `tri/f_so.php` shape is dead and is
not cited) · the removed ❌ cells were checked against <https://svenska.se/so/?sok=motorhuv>,
<https://svenska.se/so/?sok=bryta%20ner>, <https://svenska.se/so/?sok=h%C3%A5lla> and
<https://svenska.se/so/?sok=lopp>, which is why they are removed · the two retained general idioms
against <https://svenska.se/so/?sok=elefant>, <https://svenska.se/so/?sok=spik> and
<https://svenska.se/so/?sok=huvud> · corpus counts and examples from Språkbanken's Korp `EDIT` set
(<https://ws.spraakbanken.gu.se/ws/korp/v8/>) and sv.wikipedia — corpus tier: edited Swedish,
**not** a normative source · <https://sprakbruk.fi/artiklar/hur-ska-vi-hantera-engelskan-i-vara-texter/>
(Ola Karlsson, språkvårdare at Språkrådet — the caution against over-flagging phrase-level
translation loans, and the "competing older sense" mechanism behind row 6) · the rows themselves
came from a second desk-research dossier that supplied **no** idiom-dictionary citation (its only
attached link, <https://www.svenskaakademien.se/en/the-swedish-language>, is a general language
page) · **the ❌ column remains ⚠ craft** apart from row 10, and is barred from §11;
native-speaker confirmation still pending for every row · Rikstermbanken was tried and **no working
query shape was found** (every `termposter?term=` URL 404'd), so nothing here rests on it

---

## 8. Simplified-language pendant (`sv-easy`)

Swedish has **two distinct, codified plain-language traditions** — this is a language *with* a
national pendant, unlike the Bengali/Arabic exemplars. They are **not the same level**, so **8a**
records both standards and the bodies that maintain them, and **8b** the axis they name. **No
corpus measurement was made for Swedish** — 8c says so plainly and nothing below may be read as a
frequency result.

### 8a. ✅ The standards and their authorities — klarspråk (statutory) and lättläst (MTM)

**Klarspråk (plain official language) — a legal duty.** Legally mandated for public bodies.

- Definition: <https://www.isof.se/svenska-spraket/klarsprak/lar-dig-mer-om-klarsprak/vad-ar-klarsprak>
  — "Att använda klarspråk innebär att anpassa formuleringar, struktur och utformning till de
  avsedda mottagarnas behov och intresse."
- **Language-law paragraph — Språklagen § 11** (same page): "Språket i offentlig verksamhet ska
  vara vårdat, enkelt och begripligt." (well-maintained, simple, comprehensible)
- Tooling: **Klarspråkshjälpen** (checklists / tests) at Isof —
  <https://www.isof.se/svenska-spraket/klarsprak/klarsprakshjalpen/skriv-klarsprak>.
- **Is there an official standard?** Yes — klarspråk is a statutory requirement (§11), Isof /
  Språkrådet is the authority, and *Myndigheternas skrivregler* is the operative rulebook (§2).
  *(⚠ "standard" framed editorially from these sourced facts.)*

**Lättläst / LL (easy-to-read) — a stronger simplification** for readers with reading
difficulties; the authority is **MTM (Myndigheten för tillgängliga medier)**; the news brand is
**8 Sidor**.

- <https://www.mtm.se/kunskap-om-tillganglig-lasning/vad-ar-tillganglig-lasning/om-lasning-och-funktionsnedsattningar/vad-ar-lattlast/>
  — "Lättlästa texter har kortare meningar utan svåra eller ovanliga ord."; also "rak och enkel
  handling med få rader på varje sida" and "stöd av förklarande bilder."
- **Audience per MTM:** intellectual disability, neuropsychiatric conditions, dementia,
  inexperienced readers, and Swedish learners (same page).
- **Graded levels (⚠ search summary — not a single fetched page):** LL-förlaget uses **levels
  1–6**, Vilja uses **XS–XXL**; a joint LL-level scheme was launched for adult readers ("Med sex
  tydligt definierade nivåer"). <https://www.mynewsdesk.com/se/mtm/pressreleases/gemensamma-nivaaer-vaegleder-laesarna-till-laettlaest-3383647>.

### 8b. The axis — "vårdat, enkelt och begripligt" and "kortare meningar utan svåra eller ovanliga ord"

Both traditions state the axis in their own words, quoted in 8a above. Klarspråk puts it as
recipient adaptation — "Att använda klarspråk innebär att anpassa formuleringar, struktur och
utformning till de avsedda mottagarnas behov och intresse." — with the statutory floor "Språket i
offentlig verksamhet ska vara vårdat, enkelt och begripligt." Lättläst names two concrete
dimensions instead: "Lättlästa texter har kortare meningar utan svåra eller ovanliga ord.", plus
"rak och enkel handling med få rader på varje sida" and "stöd av förklarande bilder."

**Sentence length and word difficulty are the two dimensions the lättläst definition names**, and
the table below covers only the second of them. The structural half of the axis is carried in 8f,
which is why it is ranked first there.

**Complex → everyday word table** (⚠ editorial — standard klarspråk substitutions; the *principle*
"utan svåra eller ovanliga ord" is sourced above, the specific pairs are editorial):

| Complex / formal | Everyday (klarspråk / lättläst) |
|---|---|
| erhålla | få |
| avseende / gällande | om |
| samtliga | alla |
| ansökan | det du söker / att söka |
| innevarande | den här (månaden osv.) |
| tillhandahålla | ge / erbjuda |
| vidta åtgärder | göra något |
| information avseende | information om |
| under förutsättning att | om |
| på grund av | för att / eftersom |

### 8c. The corpus measurement — **none was made for Swedish**

**No plain-against-standard corpus measurement was run for Swedish.** There is no Swedish corpus
here, no document or token count, and no per-100,000 frequency anywhere in this section — and none
may be inferred, quoted, or added on the strength of another language's numbers.

The word table in 8b is marked **⚠ editorial** for exactly that reason: its rows are the standard
klarspråk substitutions the tradition itself publishes, carried here on this guide's editorial
judgment. The *principle* — "utan svåra eller ovanliga ord" — is sourced in 8a; the specific pairs
are not, and no frequency contrast was measured to support or refute any of them. Read every row as
a substitution the tradition offers, never as a measured register signal.

### 8d. 🔴 Do NOT "simplify" these

Swedish has no corpus (8c), so this list is **not** measurement-derived and reverses no word pair.
It records the standing do-not instruction that a translator applying English plain-language
instincts is most likely to break:

| Do **not** do this | Why |
|---|---|
| ~~"Simplify" numbers into English-style formats~~ | Keep numbers in the **§5 format — comma decimal, space thousands**. |

Two further standing "do not" rules sit elsewhere in this section because they are decisions rather
than word swaps: **never drift to formal *ni*** (8e), and **never swap a technical term for a folksy
stand-in** (8f, point 4).

### 8e. 🔑 The address decision — `sv-easy` keeps **du**

> **Decision: `sv-easy` holds the du register recorded in §4 steadily throughout — never drift to
> formal *ni* for "distance".**

**The grounds are convention plus the §4 record, not evidence produced in §8.** §4 carries the
sourced du-reform facts and the human-gated register decision taken on them: post du-reform,
informal **du** is the default address to everyone, including in public and official contexts, and
*ni* is used only as the literal plural. `sv-easy` inherits that decision unchanged.

**Nothing in §8 tests address, in either direction.** No Swedish measurement exists (8c), so there
is no frequency evidence to appeal to here. Stating the decision as convention is the accurate move;
dressing it as evidence would be a warrant this section did not earn.

*(Finland-Swedish keeps polite singular ni more often — see §9; it is out of scope for the
neutral `sv` build.)*

### 8f. What `sv-easy` is built on — in order of leverage

Swedish **does** contribute a codified pendant, so `sv-easy` is anchored in **klarspråk
(Språklagen §11) + lättläst (MTM)** — "vårdat, enkelt och begripligt", "kortare meningar utan svåra
eller ovanliga ord" — *on top of* the kit's base simplified-language rules. The order below follows
**which rung is sourced**, not a measured effect: MTM names shorter sentences in the definition
itself, while the specific word pairs are this guide's editorial judgment (8b, 8c). No Swedish
measurement ranks them.

**1. Structure first — the half of the axis the tradition states in its own definition.** Prefer
**short main clauses**; MSA-style front-heavy subordinate stacking works against the "kortare
meningar" rule. One idea per sentence, and the kit's own ~8–12-word working target.

**2. The word table second, on its editorial footing.** The 8b complex→everyday table carries the
sourced *principle* and editorial *pairs* (8c). Use it as a prompt for a plainer word, not as a
substitution list to apply mechanically.

**3. The kit's base rules, inherited.** `sv-easy` inherits the kit's base simplified-language rules
from [accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md)
(one idea per sentence; the kit's own ~8–12-word working target; everyday words; consistent
literal tone; a one-line "what is this" opener). The Swedish-specific overlays on top of them: hold
the **du** register (§4) steadily throughout (8e); prefer short main clauses; and keep numbers in
the §5 format — comma decimal, space thousands (8d).

**4. Term preservation, binding.** In `sv-easy`, **keep the technical term and explain it** — never
swap in a folksy stand-in. Use the same Swedish term as the base variant, then "det betyder: …",
then a concrete example (e.g. keep **neuronnät**, then explain it in plain Swedish). This is
distinct from the 8b table, which targets bureaucratic *non-technical* vocabulary.

### 8g. Still open

- **No corpus measurement exists for Swedish** (8c). Nothing in this section is a frequency result,
  and no row has been tested against a plain-versus-standard contrast.
- **The 8b word pairs are ⚠ editorial.** The principle "utan svåra eller ovanliga ord" is sourced;
  the specific pairs are not, and the guide has had no native-speaker review (see the Status line in
  the header).
- **"Standard" in 8a is framed editorially** from the sourced facts — klarspråk's statutory footing
  (§11), the Isof / Språkrådet authority and *Myndigheternas skrivregler* are each sourced, the word
  "standard" over them is this guide's framing.
- **The LL graded-level scheme rests on a ⚠ search summary, not a single fetched page** —
  LL-förlaget's levels 1–6, Vilja's XS–XXL and the joint adult scheme ("Med sex tydligt definierade
  nivåer") should be confirmed against the issuing bodies' own pages before any of them is used to
  grade `sv-easy` output.
- **No comprehension evidence.** Neither tradition supplies a readability threshold here, and
  nothing in this section says what a Swedish reader actually understands.

Sources: <https://www.isof.se/svenska-spraket/klarsprak/lar-dig-mer-om-klarsprak/vad-ar-klarsprak> ·
<https://www.isof.se/svenska-spraket/klarsprak/klarsprakshjalpen/skriv-klarsprak> ·
<https://www.mtm.se/kunskap-om-tillganglig-lasning/vad-ar-tillganglig-lasning/om-lasning-och-funktionsnedsattningar/vad-ar-lattlast/> ·
<https://www.mynewsdesk.com/se/mtm/pressreleases/gemensamma-nivaaer-vaegleder-laesarna-till-laettlaest-3383647>
(LL level scheme is ⚠ search summary; the word pairs are ⚠ editorial) · **no corpus measurement was
made for Swedish** (8c) — no figure in this section is machine-measured

---

## 9. Regional variation

**Which standard the project targets.** For a general educational platform, target
**rikssvenska / sverigesvenska** (Sweden Swedish) — the largest audience and the variety of Isof /
SAOL. *(⚠ editorial recommendation.)*

**Finlandssvenska (`sv-FI`)** is a recognized variety differing mainly in pronunciation, plus some
vocabulary and a few grammar quirks:

- <https://sv.wikipedia.org/wiki/Finlandssvenska> — "Uttal, prosodi, ett antal ord och ett fåtal
  egenheter i grammatiken skiljer finlandssvenskan från rikssvenskan."
- **Finlandismer** (words used only/mainly in Finland, or with a different meaning there): e.g.
  Finland-Swedish "jag slipper OCH simma" vs rikssvenska "jag kan bada"; "tuta" vs "sova"; the
  grammar quirk "Den mannen tror jag inte att kommer hit." (extra *att*). Classic finlandism:
  **semla** = a plain bread roll in Finland vs a cream bun in Sweden. *(The semla contrast rests
  on a ⚠ search summary of the Isof dialektblogg.)*
- Reference dictionary: **Finlandssvensk ordbok** (Institutet för de inhemska språken), ~**2 550**
  headwords — <https://sprakinstitutet.fi/ordbocker/finlandssvensk-ordbok/> *(⚠ headword count
  from a search summary).*
- **Tone difference relevant to register:** Sweden Swedish is markedly informal (frequent *du*,
  praise words "jättebra", "kanon"); Finland-Swedish keeps more neutral/impersonal distance and
  retains polite **ni** more often. <https://www.isof.se/dialekter/pa-gang/dialektbloggen/inlagg/2021-12-01-skillnader-och-likheter-i-finlandssvenska-och-sverigesvenska>
  — Sweden: "man uttrycker sig gärna informellt och skapar närhet genom att använda t.ex. *du*
  ofta"; Finland: "man kan … hålla en viss distans genom att uttrycka sig mer opersonligt och
  neutralt".

**Neutrality strategy (explicit).**

1. **Author in rikssvenska**; Isof / SAOL spelling is the orthographic anchor.
2. **Register:** the recorded **du** default (§4) — which is *itself* a rikssvenska norm; the
   Finland-Swedish tendency to keep polite *ni* is **out of scope** for the neutral `sv` build.
3. **Vocabulary:** **avoid finlandismer** in the neutral variant; where a word differs (semla,
   slippa, tuta), use the rikssvenska sense.
4. Only branch to **`sv-FI`** if you explicitly serve a Finland-Swedish audience — then re-open the
   register question (polite *ni* is more alive there).

**⚠ Provenance note for this section:** several of the finlandism examples, the semla contrast, and
the Finlandssvensk ordbok headword count reach this guide via **search summaries**, not fully
fetched authority pages; the Wikipedia "skiljer finlandssvenskan" quote and the Isof dialektblogg
quotes are the firmest. Treat the finlandism list as illustrative.

Sources: <https://sv.wikipedia.org/wiki/Finlandssvenska> ·
<https://www.isof.se/dialekter/pa-gang/dialektbloggen/inlagg/2021-12-01-skillnader-och-likheter-i-finlandssvenska-och-sverigesvenska> ·
<https://sprakinstitutet.fi/ordbocker/finlandssvensk-ordbok/>
(finlandism examples, semla, and headword count are ⚠ search-summary provenance)

---

