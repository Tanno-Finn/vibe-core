<!-- base -->
# lang-tl — Filipino / Tagalog (Filipino) — language guide

> **Setup & sources live in [`tl.setup.md`](tl.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Filipino / Filipino (the national language, based on Tagalog). Tagalog
(*Tagalog*) is the language Filipino is based on and remains a **separate legal entity** in Philippine
law — see §1 and §2 on why this guide labels the language **“Filipino”** to users while keying it `tl`.
**BCP 47 code (base):** `tl` — kept as the kit's content key. **Formatting locale: `fil-PH`** (see the
naming decision below; this is not cosmetic — CLDR has no `tl` locale).
**BCP 47 code (simplified variant):** `tl-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would use a private-use subtag (`tl-x-simple`),
but the kit token `tl-easy` is the one that counts here.
**Speaker reach:** the 2020 Census of Population and Housing found *“Tagalog is spoken in 10,522,507
households or 39.9 percent of the total 26,388,654 households in the country”* (Philippine Statistics
Authority, release 2023-42), and the companion release reports *“About one in every four (26.0%) of the
108.67 million household population in 2020 reported Tagalog as their ethnicity.”* **No figure for
Filipino as a second language was obtainable** — the commonly cited “≈45 million L1 / 80+ million
total” numbers could not be traced to a primary source and are **`⚠ unverified`**; this guide does not
repeat them. What is safe: Tagalog is the largest home language, and Filipino is the national language
taught nationwide, so effective reach is far larger than the household figure.
**Script + direction:** **Latin script, left-to-right, whitespace-separated words.** IANA records
`Suppress-Script: Latn` for `tl`, i.e. Latin is the default and `tl-Latn` should never be written. The
alphabet is **28 letters** and includes **Ñ** and the digraph **Ng** as full members (§3).
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `tl` and the `tl-easy` pendant. **This is a first pass:** the research run hit its
web-search budget (200/200) mid-task, and **every Philippine government domain returned HTTP 403**
(kwf.gov.ph, psa.gov.ph, officialgazette.gov.ph, deped.gov.ph, bsp.gov.ph, congress.gov.ph,
senate.gov.ph) — the two official KWF books this guide rests on were recovered **in full via the web
archive**. Coverage is unusually strong for §3/§5/§6 (KWF *legislates* them) and honestly thin for §7
(no Filipino authority legislates UI microcopy). Named gaps are listed in §2.
**Easy or hard for this kit:** *typographically* easy — Latin, LTR, whitespace tokenization, no
shaping, no bidi. *Grammatically* it is one of the harder languages in the kit, for three reasons that
have nothing to do with rendering: (1) the **focus / trigger system** — the verb affix decides which
participant is the `ang`-marked pivot, so English “avoid the passive” advice is actively harmful
(§4); (2) the **linker `na` / `-ng`**, which means `{adjective} {noun}` string concatenation produces
ungrammatical Filipino — strings must be authored whole (§4); (3) **`ka` vs `kayo` and the `po`
particle**, a register system that is *not* a T/V pronoun pair and is easy to get subtly wrong (§4).
The two build-level traps: the **peso sign ₱ (U+20B1) is outside the default `latin` font subset**
(§3), and **CLDR's `fil` ordinal rule emits `ika20` without the hyphen that KWF mandates** (§5, §10).

Sources: <https://lawphil.net/consti/cons1987.html> ·
<https://psa.gov.ph/content/tagalog-most-widely-spoken-language-home-2020-census-population-and-housing>
(canonical URL 403; retrieved via web archive) ·
<https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/supplementalMetadata.xml>

---

## 1. Header block

See above. One-line orientation: Filipino is an Austronesian, **predicate-initial (VSO)**, agglutinative,
LTR language in Latin script whose grammar is organized around **Austronesian alignment** (the focus /
trigger system) rather than around subject–verb–object roles. The localization risks concentrate in
**grammar (trigger system, linker, aspect, clitic order), register (`po` / `ka` / `kayo`), and
terminology policy (respell vs keep English)** — not in script or direction.

### The naming and locale-tag decision (apply this; it is not a preference)

> **Keep `tl` as the content key. Label the language “Filipino” in the UI. Map `tl → fil-PH` at the
> formatting layer.** Taken and recorded — a **human-gate** decision, meaning one the project had to
> make consciously and write down, not a sign-off obtained from anyone.

The decisive fact is a Standards fact, not an opinion: **CLDR canonicalizes `tl` to `fil`.**
`common/supplemental/supplementalMetadata.xml` line 243 reads
`<languageAlias type="tl" replacement="fil" reason="legacy"/> <!-- Tagalog -->` (line 479 does the same
for `tgl`, `reason="overlong"`). Consistent with that, **`common/main/fil.xml` returns HTTP 200 and
`common/main/tl.xml` returns HTTP 404** — *(all three facts re-fetched and confirmed 2026-07-26 for
this guide)*. So `tl` produces correct Filipino formatting **only through that alias**. Passing `fil`
(or `fil-PH`) explicitly is the version that cannot drift.

| Where | Use | Why |
|---|---|---|
| User-facing language name | **Filipino** (never “Tagalog”) | Constitutional name of the national language; “Tagalog” reads as the regional/ethnic language |
| Content key, `<html lang="…">`, URL segment | **`tl`** (the kit's existing key — do not churn URLs) | Valid BCP 47 primary subtag; `tgl` is *not* in the IANA registry, so `tl` is the only two-letter option |
| Anything ICU/CLDR-backed — `Intl.*`, number, date, currency, plural, collation | **`fil-PH`, passed explicitly** | CLDR has **no `tl` data**; `tl` works only via the legacy alias |
| Region | **`-PH`** | Region drives currency and date defaults |

**Legally, Filipino ≠ Tagalog.** RA 7104 (Commission on the Filipino Language Act, 1991) defines
*“(c) Filipino – refers to the national language of the Philippines.”* while **separately** listing
Tagalog among the major Philippine languages: *“The commissioners shall represent the major Philippine
languages, as defined in Section 3 of this Act: Tagalog, Cebuano, Ilocano, Hiligaynon and the major
language of Muslim Mindanao”* — *(both clauses re-fetched from lawphil.net and confirmed verbatim
2026-07-26 for this guide)*. The 1987 Constitution, Art. XIV §6: *“The national language of the
Philippines is Filipino. As it evolves, it shall be further developed and enriched on the basis of
existing Philippine and other languages.”* Historically the two names track the same object under
successive reforms — a KWF training deck lays out the sequence *“Tagalog bilang batayan ng wikang
pambansa: 1939-1959 … Pilipino: 1959-1973, 20 titik … Filipino: 1977, 31 titik … Filipino: 1987, 28
titik”*. Linguistically, community reference calls them *“varieties of the same language, sharing a big
bulk of common lexical items”*. **The `tl → fil-PH` mapping advice is craft-tier; the CLDR alias fact
behind it is Standards-tier and was re-verified.**

Sources: <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/supplementalMetadata.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/fil.xml> ·
<https://lawphil.net/statutes/repacts/ra1991/ra_7104_1991.html> ·
<https://lawphil.net/consti/cons1987.html> ·
<https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry> ·
<https://en.wikipedia.org/wiki/Tagalog_language> (Community — the “varieties of the same language” line)

---

## 4. Grammar for translators

### 4.0 Word order — predicate-initial

**VSO when a dominant order is forced.** WALS Online datapoint: *“Language: Tagalog Feature: Order of
Subject, Object and Verb … Value: VSO”* (Academic; Dryer, citing Kroeger 1993). Community reference
agrees the grammar is *“agglutinative, predicate-initial, and organized around the Austronesian
alignment system”*.

Consequence for UI copy: an English SVO sentence transposed word-for-word reads as marked or broken.

- ✅ predicate-first: **Natututo ang modelo mula sa datos.** (“The model learns from data.”)
- ❌ English order cloned: **Ang modelo natututo mula sa datos.**

### 4.1 Register — the project's recorded choice

Filipino's politeness system is **not** a T/V pronoun pair. There are **three dials**, not one:

1. **the pronoun** — familiar singular *ka / ikaw / mo / iyong* vs *kayo / ninyo / inyo*;
2. **the particle** — *po* / *ho* present or absent;
3. **whether the reader is addressed at all** — formal Filipino reference prose often addresses nobody.

`po` is an **enclitic respect particle**, not a pronoun: *“pô pnb : katagang pamitagan, gamit sa magálang
na pakikipag-usap lalo na sa pagtugon sa isang nakatatandang tumatawag o kumakausap”* (`pnb` =
particle-class marking). `kayo` **is** a genuine polite-singular as well as a plural: *“ka•yó pnh 1: sa
pangalawang panau-han at ginagamit sa pagkausap sa dalawa o mahigit na tao 2: ginagamit na isahan kung
tumutukoy sa nakatatanda bílang paggálang”* — and its genitive/oblique carries the same politeness
(*“nin•yó pnh … 2: gamit sa magálang na pag-uusap”*). Familiar singular: *“i•káw pnh 1: ikalawang
panauhan sa isahang anyo”*, clitic form *“ká pnh 1: isahang panghalip panao na nása ikalawang panauhan”*.
*(Community tier — `diksiyonaryo.ph`, whose publisher is unattributed; §2.)*

> ### Register decision (human-gate): `ka` / `ikaw` / `mo` / `iyong`. **No `po`.** Never `kayo` as a polite singular. — taken and recorded.
>
> **Binding for all second-person copy** in `tl` and `tl-easy`. This is **evidence-grounded, not a
> stylistic preference** — see the measured counts below.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**The evidence.** Six **official DepEd learner modules** spanning **Grade 2 to adult ALS**, produced by
**three independent offices**, were downloaded (all via web archive; `deped.gov.ph` is 403) and counted
by word-boundary regex over the extracted PDF text:

| Material | Level | `po` | `kayo` | `ka` | `mo` |
|---|---|---|---|---|---|
| Filipino 9, Q1 M1 (Panitikang Asyano) | Gr. 9 | **0** | 0 | 10 | 27 |
| Filipino 10, Q1 M1 (Mito mula sa Rome) | Gr. 10 | **0\*** | 1 | 18 | 52 |
| Komunikasyon at Pananaliksik, Q1 M6 | Gr. 11 SHS | **0** | 0 | 13 | 25 |
| UNESCO/DepEd **ALS** LS1 Filipino M01 (adults / out-of-school youth) | adult | **0** | **0** | 29 | 48 |
| Filipino 2, Q1 M2 — *Magagalang na Pananalita* | Gr. 2 | 84† | 8 | 19 | 44 |
| Filipino 3, Q1 M10 — *Magagalang na Salita* | Gr. 3 | 99† | 10 | 21 | 57 |

\* the single Grade-10 hit is the syllable inside the pronunciation gloss *“Poseidon (po-say-don)”*.
† Grades 2 and 3 are modules **about** polite speech — **every** `po` sits inside a quoted example
utterance the child is asked to produce, **never in the module's own instructional voice**.

**Zero `po` in any module's own voice**, including the two modules whose *subject* is `po`/`opo`, and
including the **adult** ALS module (`ka` 29, `mo` 48, `po` 0, `kayo` 0). The ALS module is the closest
available analog to a general-adult learning platform. Verbatim:

> *“Ang modyul na ito ay ginawa bilang tugon sa **iyong** pangangailangan. Layunin nitong matulungan
> **ka** sa **iyong** pag-aaral sa **iyong** sariling pamamaraan at bilis ng pagkatuto.”*
> *“Kung sakaling **ikaw** ay mahirapang sagutin ang mga gawain sa modyul na ito, huwag mag-aalinlangang
> konsultahin ang **iyong** guro… Laging itanim sa **iyong** isipang hindi **ka** nag-iisa.”*

And the single most instructive sentence in the corpus — Grade 2, from the module that *teaches* `po`:

> *“Magandang araw! Alam **mo** bang kinatutuwaan ng lahat ang batang marunong gumamit ng po at opo?
> Nais **mo** bang lalo **ka** pang kalugdan ng lahat?”*

It teaches `po` as **content** while addressing the reader with `mo` / `ka`.

**Why omitting `po` is safe — structural, not stylistic.** Unlike French *tu*/*vous*, `po` is an
**optional enclitic particle** layered on top of an independently chosen pronoun (*“pô (less respectful
form: hô): marker indicating politeness”*, listed among the enclitics — Community, `en.wikipedia.org/wiki/Tagalog_grammar`). **Omitting it yields neutral,
unmarked Filipino — not a rude T-form.** There is no way to “accidentally address the reader as *tu*”.
Corroborated by university course material: *“Although ‘po’ is significantly absent from speech of older
people and superiors and interchanges between equals, it is obligatory in the speech of ‘barrio’
folks”* (NIU SEAsite, Academic).

For comparison, **formal Filipino reference writing addresses nobody at all.** Measured over ~83,000
characters of instructional prose in the **Ortograpiyang Pambansa**: `po` **0**, `kayo` **0**, `ikaw`
**0**, `ninyo` **0** — instructions are impersonal imperatives (*“Tandaan:”*, *“Iwasan ang ‘Bigyan-’”*,
*“Mag-ingat lang sa mga tinatawag na salitang siyókoy”*). In the **MMP**, `po` appears **7 times and only
inside quoted dialogue examples**, never in the manual's own voice.

- ✅ recorded: **Piliin mo ang tamang sagot.** · **Subukan mo ito.** · **Hindi ka nag-iisa.** · **Tandaan:**
- ✅ also recorded — the impersonal imperative, mixed freely with direct address, exactly as DepEd does:
  **Piliin ang tamang sagot.** · **Basahin at unawain ang teksto.**
- ❌ **Piliin po ninyo ang tamang sagot.** (`po` + polite-singular `kayo`/`ninyo` — official-correspondence
  register, clashes with everything DepEd ships)
- ❌ **Subukan ninyo ito.** when addressing one reader (polite-singular `kayo`)

**The documented exceptions — both are surface-wide decisions, never per-string:**

1. **Spoken / audio address to a group.** The Phil-IRI examiner script — a *spoken* protocol — does use
   `po` + `kayo`: *“Ako po si ______. Sa araw na ito, hindi tayo magkakaroon ng regular na klase…
   Bibigyan lamang kayo ng 30 minuto”* — while the same package's *written* pupil instructions do not.
   If the platform ever renders **audio/voice address to a group**, switch to `po` + `kayo` **there and
   only there**.
2. **Support surfaces where the platform petitions the user.** *“Maraming salamat po sa inyong
   feedback”* is right on a feedback/support surface. Decide it **surface-wide**.

**Three consistency rules that follow:**

- **Reserve `kayo` for genuine plurals.** A polite-singular `kayo` also **forces plural agreement on
  every following clitic** — systematic drift across hundreds of strings.
- **Be consistent per surface.** Mixing `ka` and `kayo` on one screen is the most visible failure mode.
- **Warmth comes from lexis and direct address, not honorifics** — exactly as the ALS module does it
  (*“hindi ka nag-iisa”*).

*(Items 1–3 above and the consistency rules are **craft-tier layers**; the counts, the quoted module
text, and the particle-vs-pronoun structural argument are sourced.)*

### 4.2 The five things that break a naive EN → TL translation

#### (1) The voice / focus (trigger) system — the big one

**⚠ Community-tier (Wikipedia).** Filipino verbs do not choose a subject; the **affix on the verb selects
which participant is the `ang`-marked pivot**, and every other role re-marks accordingly. The verbal
morphology *“indicates which semantic role is associated with the topic ('ang'-marked) argument”*.
Worked pair, quoted:

> *“B‹um›ilí ng manggá sa palengke **ang lalaki**”* = “The man bought a mango at the market”
> (actor voice — the actor is `ang`)
> *“B‹in›ilí-∅ ng lalaki sa palengke **ang manggá**”* = “The mango was bought by the man at the market”
> (patient voice — the patient is `ang`, the actor drops to `ng`)

**Why it breaks translation:** English passive ↔ Filipino patient voice is **not** a stylistic swap.
Patient voice is the **unmarked, everyday** choice in Filipino for a definite affected object, whereas
English style guides push writers *away* from the passive. A translator trained on “avoid the passive”
will force actor voice everywhere and produce text that is grammatical but **subtly wrong-focused**.

- ✅ **Ginagamit ang datos upang sanayin ang modelo.** (“The data is used to train the model.” — patient
  voice; *datos* is `ang`)
- ❌ **Gumagamit ng datos upang sanayin ang modelo.** — forced actor voice leaves the actor unexpressed
  and dangling; wrong emphasis.

> **Rule of thumb (craft-tier):** whatever the English sentence is *about* must end up **`ang`-marked**,
> and the verb affix chosen to match. **Preserve the English topic, not the English voice.**

#### (2) `ang` / `ng` / `sa` — the case markers, and the `ng` vs `nang` trap

Three particles carry the roles English does with word order: **`ang`** = pivot/topic; **`ng`** =
non-pivot actor or indefinite object (and possession); **`sa`** = location, direction, definite oblique.
For people they become **`si / ni / kay`** (plural `sina / nina / kina`).

**`ng` and `nang` are different words.** Officially, Ortograpiyang Pambansa §9.1: *“lima (5) lámang ang
mga tuntunin”* for `nang` — as *noong* (temporal), as *upang/para* (purpose), as the contraction of
*na + ng*, for manner/degree adverbials, and as the linker of a repeated word. Verbatim example:
*“Binaril nang nakatalikod si Rizal.”* **Everything else takes `ng`.** This is the most common
native-speaker spelling error in the language and it will be in any human or machine draft.

- ✅ manner: **Binaril nang nakatalikod si Rizal.** · ✅ possession/object: **ang modelo ng kompanya**
- ❌ **Binaril ng nakatalikod si Rizal.** · ❌ **ang modelo nang kompanya**

**`na’ng` ≠ `nang`.** OP §9.2: *“Kailangang isulat ito nang may kudlit (’) upang ipahiwatig ang naganap
na kontraksiyon ng na at ng ang, gaya sa ‘Laganap na’ng himagsik…’”*

- ✅ **Laganap na’ng himagsik** (contraction of *na* + *ang*, with the U+2019 kudlit)
- ❌ **Laganap nang himagsik** · ❌ **Laganap na'ng himagsik** (ASCII apostrophe)

#### (3) Aspect, not tense

**⚠ Community-tier (Wikipedia) for the framing.** *“Tagalog verbs are conjugated for time using aspect
rather than tense”*. Three aspects — **completed** (`bumili`), **incompleted/ongoing** (`bumibili`),
**contemplated/not yet begun** (`bibili`) — formed largely by reduplication + affix, not by auxiliaries.

**Breakage:** English tense mapping is not 1:1, and machine drafts routinely flatten all three into the
completive.

| English | Filipino aspect | ✅ | ❌ |
|---|---|---|---|
| “A model learns from data” (general truth) | imperfective | **Natututo ang modelo mula sa datos.** | **Natuto ang modelo mula sa datos.** (completive — reads as a one-off past event) |
| “You will see a result” | contemplated | **Makikita mo ang resulta.** | **Nakita mo ang resulta.** (completive) |
| UI: “Loading…” | imperfective | **Naglo-load…** | **Na-load** |
| UI: “Loaded” | completive | **Na-load na** | **Naglo-load** |

#### (4) Enclitic particle order — a fixed queue

**⚠ Community-tier and explicitly flagged:** the ordering *“na/pa, ngâ, din/rin, daw/raw, pô/hô, ba”*
comes from Wikipedia; **KWF's manuals do not legislate clitic order**, so this ordering is
`⚠ not confirmed against an official source`.

**Breakage:** they are not free adverbs.

- ✅ **Tapos na ba?**  ·  ❌ **Tapos ba na?**

**What *is* officially constrained: `din`/`rin` and `daw`/`raw` alternate by the preceding sound.**
Ortograpiyang Pambansa §8.1: *“nagiging rin ang din o raw ang daw kapag sumusunod sa salitang
nagtatapos sa patinig o malapatinig o glide (W at Y)”*, with the counter-rule *“kapag ang sinusundang
salita ay nagtatapos sa -ri, -ra, -raw, o -ray, ang din o daw ay hindi nagiging rin o raw”*.

- ✅ **Masaya rin** (after a vowel) · ✅ **Malungkot din** (after a consonant) · ✅ **Maaari din**
  (counter-rule: previous word ends in *-ri*)
- ❌ **Masaya din** · ❌ **Malungkot rin** · ❌ **Maaari rin**

> **Engineering consequence — this is the important one.** The alternation **depends on the previous
> word**, so it **cannot survive naive string concatenation or variable interpolation**. A template like
> `{adjective} din` is wrong half the time. Author the whole string.

#### (5) Inclusive vs exclusive “we” — `tayo` vs `kami`

*“tá•yo pnh : panghalip panao na ginagamit ng higit sa isang tao na nagsasalita o sumusulat, at sa
pagtukoy sa kanilang sarili”* vs *“ka•mí pnh … tumutukoy sa panauhang pangmaramihan at nagsasalita,
**ngunit hindi kasáma ang kinakausap**”* (*“but not including the person addressed”*). English “we” is
ambiguous and the translator must decide **every time**. For a learning platform this is a **tone
decision, not a grammar detail**:

- ✅ teacher + learner together: **Tingnan natin ang isang halimbawa.** (“Let's look at an example.”)
- ✅ the organization, not the reader: **Gumagamit kami ng cookies.** (“We use cookies.”)
- ❌ **Gumagamit tayo ng cookies.** — this makes the platform claim the **user is part of the company**.
  It is the single most embarrassing pronoun error available in Filipino.

#### (6) Reduplication is meaningful morphology

**⚠ Community-tier for the framing; the spelling is Official.** *“A defining feature of the language is
its productive reduplication system”*. Reduplication marks **aspect** (`bibili`), **plurality/intensity**
(`mabilis` → `mabibilis`), and **diminution/approximation** (`bahay` → `bahay-bahay`). Spelled per
Ortograpiyang Pambansa §11.1: two-syllable words repeat wholly (*aráw-áraw*); longer words repeat only
the first two syllables and drop the final consonant of the second (*“pali-palíto suntok-suntukín
balu-baluktót”*, *“bali-baligtád”*); with a prefix, the prefix joins the repeated part
(*“pabálik-bálik”*).

- ✅ **araw-araw**, **pabalik-balik**, **bali-baligtad**
- ❌ **balik-balik** with the prefix stranded (*pa balik-balik*), ❌ **baligtad-baligtad**

> **Breakage:** truncating a Filipino string (“Naglo-lo…”) or reflowing it can **destroy a morpheme**,
> not just a letter. And a plural label built by string concat cannot produce `mabibilis` from
> `mabilis`.

### 4.3 The linker `na` / `-ng` — why strings must be authored whole

Modifier–head links require the ligature: **`-ng` after a vowel, `na` after a consonant, `-g` after
`n`.** *malaki* + *na* + *datos* → **malaking datos**; *mabilis* + *na* + *modelo* → **mabilis na
modelo**.

- ✅ **malaking datos** · ✅ **mabilis na modelo** · ✅ **tamang sagot**
- ❌ **malaki datos** · ❌ **mabilis modelo** · ❌ **tama sagot**

> **This is the #1 reason Filipino UI strings must be authored whole, not assembled.** Any template that
> concatenates `{adjective} {noun}` produces ungrammatical Filipino. *(Craft-tier framing; the ligature
> itself is elementary Filipino grammar and is visible throughout the KWF texts quoted above — e.g.
> *“malaking tulong”*, *“bagong hiram na salita”*.)*

Sources: <https://wals.info/valuesets/81A-tag> (Academic) ·
<https://seasite.niu.edu/trans/tagalog/EnglishtoTagalogTexts/greetings.htm> (Academic) ·
KWF *Ortograpiyang Pambansa* §§8.1, 9.1, 9.2, 11.1 (Official) ·
<https://en.wikipedia.org/wiki/Tagalog_grammar> · <https://en.wikipedia.org/wiki/Austronesian_alignment>
(**Community — trigger system, aspect framing, clitic order, reduplication**) ·
<https://diksiyonaryo.ph/> (Community, publisher unattributed — `po`, `opo`, `ho`, `kayo`, `ninyo`,
`ikaw`, `ka`, `tayo`, `kami`) · DepEd learner modules and the Phil-IRI package (Official; `deped.gov.ph`
403, recovered via web archive)

---

## 5. Numbers, dates, currency

**(The best-sourced section in this guide — KWF *legislates* it.)** Filipino is unusual in having an
**official national style manual that prescribes number, date, time, and money formatting**: the KWF
*Manwal sa Masinop na Pagsulat* (2014). Everything below is quoted from it unless marked otherwise.

### 5.1 Decimal separator = **period**. Grouping = **comma**. `1,234.56`.

> **MMP §12.4:** *“Sa Matematika, ginagamit ang tuldok sa sistemang desimal.”* — examples printed:
> *“3.1416 (halaga ng π) 2.54 sentimetro 1.414 (Pythagoras constant)”*

> **MMP §13.9:** *“Kapag kulang itó sa isá (1.00), nilalagyan itó ng zero bago ang puntong desimal upang
> higit na madalîng basáhin”* — examples: *“may mean na 0.37”*, *“Katumbas sa 0.028 o 2.8% ang tinubò
> niyá”*

> **MMP §13.6** (grouping, in the manual's own examples): *“Nása pagitan ng **1,900** at **2,100** ang
> mga táong nanood”*; *“biglang tumaas ang populasyon ng bansa mulâ **75,000** noong 1855 sa 1.3 milyon
> noong 1900”*

**This is officially prescribed, not merely conventional** — and it is confirmed three further ways:

- **CLDR `fil`** *(re-fetched 2026-07-26 for this guide)*: `"decimal": "."`, `"group": ","`, and
  `"decimalFormats-numberSystem-latn": { "standard": "#,##0.###" }`. The `fil` locale does **not**
  override root — `.`/`,` is inherited, not localized away.
- **CLDR's `fil` number exemplar set contains no space character** — `"numbers": "[\- ‑ , . % ‰ + − 0 1
  2 3 4 5 6 7 8 9]"` — so space-grouping is not expected *(also re-fetched)*.
- **Government usage:** PSA homepage prints *“109,035,343”* (Total Population) and *“449,876”* (Birth);
  a BSP press release prints *“the Philippine Stock Exchange index (PSEi) to 6,321.24 in Q3 2023 from
  6,468.07 in Q2 2023”*.

- ✅ **1,234.56** · ✅ **0.37** (leading zero required below 1) · ✅ **109,035,343**
- ❌ **1.234,56** (European) · ❌ **1 234,56** (space grouping) · ❌ **.37** (missing leading zero)

**Percent — closed up, no space.** CLDR `fil`: `"percentFormats-numberSystem-latn": { "standard":
"#,##0%" }` *(re-fetched)*. KWF MMP §13.9 prints *“2.8%”* and *“mulâng 2.5% sa 0.85”*. PSA writes
*“4.1% Inflation Rate in November 2023”*.

- ✅ **50%** · ❌ **50 %** · ❌ **50 porsyento** in a data label (fine in prose, wrong in a chart axis)

### 5.2 Numerals vs spelled-out numbers

- **§13.1 (general rule):** *“sa mga hindi teknikal na gamit, binabaybay ang bílang mulâ zero hanggang
  sandaan”* — spell out 0–100.
- **§13.2 (alternative, KWF-recommended for publications/journalism — **use this one**):** *“Baybayín ang
  isang dihitong bílang at isulat naman sa numeral ang mulâ sampu pataas. Ito ang ginagamit ng mga
  peryodiko at iminumungkahing mas praktikal na gamitin.”* — **spell 0–9, numerals from 10 up.**
- **§13.4:** *“ang higit na mainam, iwasang magsimula ng pangungusap sa bílang.”* — don't start a
  sentence with a numeral.
- **§13.6:** keep numeral/word style consistent within a paragraph.

**Craft-tier for this platform:** adopt **§13.2** (spell 0–9, numerals 10+), and use numerals
**unconditionally** in data, statistics, chart labels, step counters, and anything the user will compare.

- ✅ **tatlong hakbang** (3 spelled, prose) · ✅ **Hakbang 3 ng 12** (step counter — numerals)
- ❌ **3 hakbang** in flowing prose · ❌ **12 na porsiyento ang katumpakan** in a stat readout

### 5.3 Ordinals — `ika-` + hyphen + numeral, **and the ICU catch**

> **MMP §13.5:** *“Baybayín nang buo kapag hindî ginamitan ng gitling pagkatapos ng ika o pang, ngunit
> maglagay ng gitling pagkatapos ng ika- o pang- kung susundan ng numeral.”* — examples: *“panlima”*,
> *“pang-20”*, *“ikaapat”*, *“ika-10”*, *“ika-17”*

So: **`ika-` + hyphen + numeral** (`ika-3`, `ika-10`), **or** fully spelled without hyphen or space
(`ikatlo`, `ikasampu`) — but **never `ika3`, never `ika 3`**. Ortograpiyang Pambansa §11.8 confirms:
*“ika-8 ng umaga, ngunit ikawalo ng umaga … ika-100 anibersaryo, ngunit ikasandaang anibersaryo”*. KWF's
own prose uses it: *“ang sistemang abakada nitóng ika-20 siglo”*.

- ✅ **ika-20 siglo** · ✅ **ikadalawampung siglo** · ✅ **pang-20** · ✅ **ikaapat na hakbang**
- ❌ **ika20** · ❌ **ika 20** · ❌ **ika-dalawampu** (spelled form takes no hyphen)

> ### ⚠ Do not ship ICU/CLDR ordinal output for `fil` unmodified — it is wrong.
>
> *(Both rulesets re-fetched from `common/rbnf/fil.xml` and confirmed 2026-07-26 for this guide.)*
>
> - `%digits-ordinal` is defined as **`0: ika=#,##0=;`** → emits **`ika20`, with no hyphen**. This
>   directly contradicts KWF §13.5 and KWF's own writing.
> - `%spellout-ordinal` is defined as **`0: ika =%spellout-cardinal=;`** → emits **`ika ` + the spelled
>   cardinal, with a space** (e.g. *ika dalawampû*), where KWF prescribes the closed-up *ikadalawampu*.
>
> CLDR itself uses the hyphen elsewhere in the same locale (`"yw-count-one": "'ika'-w 'linggo' 'ng' Y"`),
> which is what makes this look like a data defect rather than a competing convention.
>
> **Format Filipino ordinals yourself: `ika-` + `-` + numeral.** Put this in the build, not in a
> reviewer's head (§10, §11).

**Plural category.** `fil` has one `one` category and `other` for everything else
(`<pluralRules locales="bal fil fr ga hy lo mo ms ro tl vi">` with `<pluralRule count="one">n = 1</pluralRule>`).
Filipino nouns are **not inflected for number**, so plural handling is mostly a **word-choice** problem
(`mga`), not a morphology problem.

- ✅ **ang mga modelo** (plural marked by the particle) · ❌ **ang mga modelos** (Spanish-style plural -s)

### 5.4 Dates

> **MMP §13.15 Kompletong Petsa:** *“May dalawang paraan ng pagsulat sa kompletong petsa: ang lumang
> sistemang buwan-araw-taón, gaya sa ‘Marso 9, 1944’ at ang bagong araw-buwan-taón, gaya sa ‘9 Marso
> 1944.’ Matipid ang ikalawa dahil walâ nang kuwit at mainam sa tekstong maraming kompletong petsa.”*

**Both orders are correct.** KWF prefers the second for economy and uses it in its own body text
(OP §11.12 prints *“23 Hulyo 1864–13 Mayo 1903 (Apolinario Mabini)”*). Month + year only: *“Marso 1944”*,
no comma.

**CLDR, however, defaults to month-first**: `"full": "EEEE, MMMM d, y"`, `"long": "MMMM d, y"`,
`"medium": "MMM d, y"`, `"short": "M/d/yy"`. Real Philippine government pages use **both orders,
sometimes on the same page** (PSA: *“Friday, December 29, 2023”* and *“as of May 1, 2020”* alongside
*“as of 31 July 2023”* and *“05 January 2024 (Friday)”*). The Filipino-language 1987 Constitution uses
month-first: *“Yaong mga isinilang bago sumapit ang Enero 17, 1973…”*.

**Resolution (craft-tier):** use **`MMMM d, y`** (*Hulyo 26, 2026*) for machine-formatted dates, because
that is the CLDR default and therefore what `Intl.DateTimeFormat('fil-PH')` produces anyway; KWF's
`d MMMM y` is fine in hand-written editorial prose. **Never emit a bare numeric `d/m/y`** — it is
ambiguous against the dominant `M/d/yy`, and KWF forbids all-numeric dates in formal writing:

> **§13.18 Petsang Numero Lahat:** *“Para makatipid, ginagamit sa **impormal** na sulatín ang petsang
> numero lahat, na maaaring hinahati sa pahilíg (9/3/44) o sa gitling (9-3-44). **Hindi ito dapat gamitin
> sa pormal na sulatín**”*

> **§13.19 Sistemang IOS [sic — ISO]:** *“Iminumungkahi ng International Organization for
> Standardization … ang pagsulat nang buong numeral sa sistemang taón-buwan-araw at ginagamitan ng
> gitling … Disyembre 27, 2013 magiging **2013-12-27**”*

- ✅ **Hulyo 26, 2026** (machine-formatted) · ✅ **26 Hulyo 2026** (editorial prose) · ✅ **2026-07-26**
  (identifiers, backends, `datetime` attributes)
- ❌ **26/7/2026** in any user-facing formal surface · ❌ **Hulyo 26 2026** (missing comma in the
  month-first form)

Also: **§13.14** years in numerals, abbreviated years take an apostrophe (*“Siyá ay mulâ sa klase ng
’92.”* — U+2019). **§13.16** centuries spelled out and lowercase (*“sa ikadalawampu’t isang siglo”*);
decades either way (*“noong mga dekada 80 at 90”*). **§11.12 / §12.45:** **en dash (U+2013)** for date
and time ranges — *“1882–1903”*, *“9:00–11:00”*, open-ended *“1870–”*.

- ✅ **1882–1903** (en dash) · ❌ **1882-1903** (hyphen) · ❌ **1882 — 1903** (em dash, spaced)

**Month and weekday names** — KWF-prescribed abbreviations take **no period**: *“Iminumungkahi ng gabay
na ito ang sumusunod na daglat at hindi nilalagyan ng tuldok”*.

| Month | Abbr. | | Month | Abbr. | | Day | Abbr. | | Day | Abbr. |
|---|---|---|---|---|---|---|---|---|---|---|
| Enero | Ene | | Hulyo | Hul | | Linggo | Lin | | Huwebes | Huw |
| Pebrero | Peb | | Agosto | Ago | | Lunes | Lun | | Biyernes | Biy |
| Marso | Mar | | Setyembre | Set | | Martes | Mar | | Sabado | Sab |
| Abril | Abr | | Oktubre | Okt | | Miyerkules | Miy | | | |
| Mayo | May | | Nobyembre | Nob | | | | | | |
| Hunyo | Hun | | Disyembre | Dis | | | | | | |

- **Collision: `Mar` = both Marso and Martes.** Do not use the abbreviations where both could occur.
- Month/day names are **capitalized** in Filipino (unlike Spanish), and **`Sabado` carries no accent**
  (unlike Spanish *sábado*).
- ⚠ **Discrepancy: CLDR spells Wednesday `Miyerkules`; the KWF style manual spells it `Miyerkoles`.**
  Both are in circulation. **Craft-tier call: use `Miyerkules`** (as in the table above) in everything,
  so machine-formatted and hand-written strings match — and **note the KWF form in the glossary so a
  reviewer does not “correct” it**. CLDR otherwise agrees on every name and abbreviation.
- ⚠ **Value corrected 2026-07-27 when the citation was pinned to the CLDR 48.2 release.** This bullet
  previously attributed the asymmetric set to CLDR's *narrow* months generally. Re-read at the pin,
  the asymmetry is in the **`stand-alone` narrow** set only — `"1": "E", "2": "P", "3": "M", "4":
  "A", "5": "M", "6": "Hun", "7": "Hul"…` — where single letters stop after May and the rest fall
  back to the abbreviated forms. The **`format` narrow** set is *not* asymmetric: it is `Ene, Peb,
  Mar, Abr, May, Hun, Hul, Ago, Set, Okt, Nob, Dis`, identical to the abbreviated set. Either way,
  **do not use narrow months** — the stand-alone set is unusable and the format set buys nothing over
  the abbreviations.
- Finally: **English month and weekday names are entirely normal in Philippine public writing** — every
  PSA and BSP page fetched was in English. Filipino month names are correct but are not automatically
  what a Filipino reader expects in a technical UI. **Pick one and be consistent.**

### 5.5 Time

> **MMP §13.20 Oras:** *“Isinusulat sa numero ang kompletong oras na sinusundan ng mga inisyals na **nu**
> (ng umaga), **nh** (ng hapon), at **ng** (ng gabi). Gamitan ng gitling upang ihiwalay ang numero sa oras
> at kung ikinakabit sa ika- at ala(s).”* — examples: *“7 nu, ika-7:00 nu, ngunit ikapito ng umaga / 9 ng,
> alas-9:00 ng, ngunit ikasiyam ng gabi / 5 nh, ika-5:00 nh, ngunit alas-singko ng hapon / 1 nh,
> ika-1:00 nh, ngunit ala-una ng hapon”*

So careful written Filipino uses a **12-hour clock with Filipino day-part markers (`nu` / `nh` / `ng`)**,
not `AM`/`PM`. `alas-` + Spanish numeral is the spoken idiom (*alas-dose ng tanghali*, *ala-una*), and OP
§11.8 adds *“Tandaan: Laging binabaybay ang oras na ala-una.”* 24-hour time is treated as **military**
usage (§13.21 *“Oras Militar”*).

CLDR `fil` is 12-hour throughout: `"full": "h:mm:ss a zzzz"`, `"short": "h:mm a"`; dayPeriods
*“midnight: hatinggabi, am: AM, noon: tanghaling-tapat, pm: PM, morning1: ng umaga, morning2:
madaling-araw, afternoon1: ng hapon, evening1: ng gabi”*. 24-hour exists only as a flexible skeleton
(`"Hm": "HH:mm"`), not as a locale default.

**Craft-tier for a web platform:** `AM`/`PM` is what phones and OS pickers show and is universally
understood — use it in **interactive/date-picker contexts** for consistency with the device; use
`nu`/`nh`/`ng` (or the spelled forms) **in prose**. **Do not mix within one screen.**

- ✅ picker/interactive: **9:00 AM** · ✅ prose: **ika-9:00 nu** / **ikasiyam ng umaga**
- ❌ **09:00** as a default user-facing time (military register) · ❌ mixing **9:00 AM** and **9 nu** on
  the same screen

### 5.6 Currency

> **MMP §13.10 Salapî:** *“Kapag isinulat sa numeral ang halaga, dapat na may puntong desimal at mga zero
> ito. **Iminumungkahi ring gamitin ang simbolong Php para sa salapi ng Filipinas.**”* — examples printed:
> *“Php20.00 Php74.00 Php100.00”*; on placement: *“karaniwang sinusulat na nauuna ang simbolo sa
> numeral”* (symbol **precedes** the amount).
> **§13.10 / §13.3:** whole amounts up to a hundred are spelled out (*“ang báon ko ay limang piso”*);
> large amounts use numerals + word (*“May 210 bilyong piso siyang deposito”*); finance shorthand
> *“Php375K”*.

**Slightly awkward, and worth stating plainly:** the KWF style manual recommends the **ASCII string
`Php`**, prefixed, no space, always two decimals — and **does not mention the peso sign ₱ at all** in the
money section. The peso sign is nonetheless what the central bank uses in its own press releases
(*“to about ₱16.7 trillion in October”*).

**Standards detail.** UnicodeData.txt: *“20B1;PESO SIGN;Sc;0;ET;;;;;N;;;;;”*; NamesList adds the alias
*“= Filipino peso sign”* and the warning *“extant and discontinued Latin-American peso currencies
(Mexican, Chilean, Colombian, etc.) use the dollar sign”* — **₱ is specifically the Philippine peso
sign.** ISO 4217: *“PHILIPPINES (THE) … Philippine Peso … PHP … 608 … 2”* minor units. CLDR `fil`
currency patterns *(re-fetched 2026-07-26)*: `"standard": "¤#,##0.00"`,
`"accounting": "¤#,##0.00;(¤#,##0.00)"`, and separately `"standard-alphaNextToNumber": "¤ #,##0.00"` —
**the spaced variant applies only when the currency display is alphabetic**. CLDR display name:
`"PHP": { "displayName": "Piso ng Pilipinas", … "symbol": "₱" }` *(re-fetched)*.

**Real Philippine government usage is genuinely inconsistent — all five forms occur in official text:**
`₱16.7 trillion` (no space), `Php92,168`, `P2,787,180.00`, `PHP50,000.00` (BSP); `PhP 307,109.00`,
`PhP 54.68` (PSA). **There is no single correct Philippine form; the platform must pick one.**

**Craft-tier recommendation.** AI/ML educational content probably needs **no currency at all**. If it
does (pricing, cost-of-compute examples):

- ✅ user-facing price: **₱1,234.56** — symbol, **no space**, two decimals (matches CLDR `¤#,##0.00` and
  central-bank usage). **Requires the `latin-ext` font subset (§3.6).**
- ✅ tables / alongside other currencies: **PHP 1,234.56** — alphabetic code, **with** a space (matches
  CLDR `standard-alphaNextToNumber`).
- ✅ text that must match KWF editorial style: **Php1,234.56**.
- ❌ **₱ 1,234.56** (spaced symbol) · ❌ **1,234.56 ₱** (symbol after) · ❌ **P20** — bare `P` is
  ambiguous with the letter P · ❌ **₱1,234.5** (one decimal; ISO 4217 minor units = 2)

Sources: KWF *Manwal sa Masinop na Pagsulat* (2014) §§12.4, 12.45, 13.1–13.21 and *Ortograpiyang
Pambansa* §§11.8, 11.12 (Official; canonical PDFs 403, recovered via web archive) ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/fil/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/fil/currencies.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/fil/ca-gregorian.json> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/rbnf/fil.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/ordinals.xml> ·
<https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml> ·
PSA and BSP pages (Official; canonical URLs 403, recovered via web archive)

---

## 6. Terminology strategy

**(Strong section for the *policy* — KWF's Ortograpiyang Pambansa legislates borrowing in seven explicit
layers. The *recommendations* in the seed table are mostly craft-tier on top of measured usage, and the
table says so per row.)**

### 6.1 The official borrowing policy, in the policy's own words

Filipino's orthography is unusually explicit about loanwords, and the policy is **layered**, not
“translate everything”.

**Layer 1 — the eight added letters exist mainly for *Philippine* languages, not for English.**
> **OP §4.1:** *“Isang radikal na pagbabago sa pagbaybay na pasulat ang paggamit ng walong (8) dagdag na
> titik sa modernisadong alpabeto: C, F, J, Ñ, Q, V, X, Z. Pangunahing gamit ng mga ito ang pagpapanatili
> ng mga kahawig na tunog sa pagsulat ng mga salita mula sa mga katutubong wika ng Filipinas.”*

**Layer 2 — do not “restore” already-assimilated loans.**
> **OP §4.2:** *“hindi kailangang ibalik sa orihinal na anyo ang mga hiram na salitang lumaganap na sa
> baybay ng mga ito alinsunod sa abakada … Hindi rin dapat ibalik ang pórma sa firma, ang bintaná sa
> ventana, ang kálye sa calle”*
> - ✅ **bintana**, **kalye**, **porma**  ·  ❌ **ventana**, **calle**, **firma**

**Layer 3 — genuinely new borrowings may be taken whole, unchanged.**
> **OP §4.4:** *“maaaring hiramin nang buo at walâng pagbabago ang fútbol, fertíl, fósil, vísa, vertebrá,
> zígzag … maraming salita mulang Ingles ang maaaring hiramin nang hindi nangangailangan ng pagbago sa
> ispeling, gaya ng fern, fólder, jam, jar, lével … devélop, ziggúrat, zip”*

**Layer 4 — C, Ñ, Q, X are restricted to three cases.**
> **OP §4.6:** *“Una, sa mga pangngalang pantangi na hiram sa wikang banyaga … Ikalawa, sa mga katawagang
> siyentipiko at teknikal, halimbawa, ‘carbon dioxide,’ ‘Albizia falcataria,’ … ‘x-axis,’ ‘oxygen,’
> ‘zeitgeist,’ ‘zero,’ ‘zygote.’ Ikatlo, sa mga salita na mahirap dagliang ireispel, halimbawa,
> ‘cauliflower,’ … ‘queen,’ ‘quiz,’ ‘mix,’ ‘pizza,’ ‘zebra.’”*
> **Case 2 — *katawagang siyentipiko at teknikal* — is the license this platform's terminology rests on.**

**Layer 5 — respelling English is encouraged, with five explicit stop conditions.**
> **OP §4.7:** *“ipinahihintulot at ginaganyak ang higit pang eksperimento sa reispeling o pagsasa-Filipino
> ng ispeling ng mga bagong hiram sa Ingles … Dapat madagdagan nang higit ang istámbay (stand by), iskúl
> (school), iskédyul (schedule), pulís (police) … búlding (building) … trápik (traffic) … bísnes
> (business)”*
> *“Ngunit tinitimpi ang pagsasa-Filipino ng ispeling ng mga bagong hiram kapag: (1) nagiging kakatwa o
> katawa-tawa ang anyo sa Filipino, (2) nagiging higit pang mahirap basáhin ang bagong anyo kaysa
> orihinal, (3) nasisira ang kabuluhang pangkultura, panrelihiyon, o pampolitika ng pinagmulan, (4) higit
> nang popular ang anyo sa orihinal, at (5) lumilikha ng kaguluhan ang bagong anyo dahil may kahawig na
> salita sa Filipino.”*
> Worked examples of when **not** to respell: *“Matagal mag-iisip ang makabása ng ‘karbon day-oksayd’
> bago niya maikonekta ito sa sangkap ng hangin.”* and *“Nakasanayan nang basahin ang duty-free kayâ
> ipagtataká ang karatulang ‘dyuti-fri.’”*
> **Stop conditions (2) and (4) are the ones that apply to almost every AI/ML term.**

**Layer 6 — prefer Spanish over English when a Spanish cognate exists.**
> **OP §4.8:** *“iminumungkahi ang pagtitimpi sa lubhang pagsandig sa Ingles. Sa halip, maaaring unang
> piliin ang singkahulugang salita mulang Espanyol … Higit na magaang basáhin (at pantigin) ang
> estandardisasyón (estandardizacion) mulang Espanyol kaysa ‘istandardiseysiyon’ (standardization)
> mulang Ingles”*

**Layer 7 — the named trap: *siyokoy* words.**
> **OP §4.9:** *“Mag-ingat lang sa mga tinatawag na salitang siyókoy … mga salitang hindi Espanyol at
> hindi rin Ingles ang anyo at malimit na bunga ng kamangmangan sa wastong anyong Espanyol”* — with the
> canonical examples *“‘konsernado’”* (should be *konsernído*), *“‘aspeto’ na hindi ang Espanyol na
> aspecto”*, *“‘imahe’ na hindi ang wastong imahen (imagen)”*, *“‘kontemporaryo’ na hindi ang
> kontémporaneó”*, *“‘endorso’ … endóso”*, and the *level → “lebél”* case: *“Hindi kasi nilá alam na ang
> tunay na salitang Espanyol nitó ay nibél (nivel).”*
> **KWF's own escape hatch, verbatim — and it is the one a technical translator should take:**
> *“huwag ikahiya ang paggamit ng terminong Ingles kung iyon ang higit na alam”* — “don't be ashamed to
> use the English term if that's what's better known.”

> **This is the single most important paragraph in the whole evidence base for an AI/ML platform.** The
> national orthography itself says: **when in doubt on a technical term, use the English word rather than
> invent a Spanish-looking hybrid.**

### 6.2 The *siyokoy* table — malformed hybrids, and the one that matters for AI

The concept is Almario's and KWF enforces it: *“Ang siyokoy ay isang katawagan na tumutukoy sa mga salita
sa wikang Filipino na waring hinango sa parehong mga wikang Ingles at Kastila. Nilikha ni Virgilio
Almario ang katawagang ito.”* … *“Sa ilalim ng kaniyang pamamahala, itinuring ng Komisyon sa Wikang
Filipino na hindi wasto ang mga salitang siyokoy at hindi pinahintulutan ang paggamit ng mga ito.”*
(Community — tl.wikipedia). Almario in his own words: *“Dahil hindi bihasa sa Espanyol, nakalilikha sila
ng mga salitang siyokoy — hindi Ingles, hindi Espanyol (gaya ng ‘aspeto’ na hindi aspect ng Ingles at
hindi rin aspecto ng Espanyol).”*

| ❌ Siyokoy (wrong) | Real Spanish | English | ✅ Correct Filipino | Provenance |
|---|---|---|---|---|
| aspeto | *aspecto* | aspect | **aspekto** (or plain *mukha / dako*) | **Official** — OP §4.9, KWF's own example |
| imahe | *imagen* | image | **imahen** (or plain *larawan*) | **Official** — OP §4.9 |
| konsernado | — | concerned | **konsernido** — the coinage that named the phenomenon | **Official** — OP §4.9 |
| kontemporaryo | *contemporáneo* | contemporary | **kontemporaneo** (or plain *kapanahon / napapanahon*) | **Official** — OP §4.9 |
| endorso | *endoso* | endorsement | **endoso** | **Official** — OP §4.9 |
| lebel | *nivel* | level | **nibel** — but see §6.4: **no UI-`level` form is attested anywhere** | **Official** — OP §4.9 |
| dayalogo | *diálogo* | dialogue | **diyalogo** (or plain *pag-uusap*) | Community (tl.wikipedia *Siyokoy*) |
| prayoridad | *prioridad* | priority | **priyoridad** (or plain *pagkauna*) | Community |
| kritisismo | *crítica* | criticism | **kritika** | Community |
| **paterno** | *patrón* | **pattern** | **padron** ← **the one that matters for AI/ML** | Community + craft — see §6.4 |

**Safe for AI/ML because they match real Spanish:** `algoritmo`, `datos`, `modelo`, `awtomatiko`,
`artipisyal`, `robotika`, `padron`.
**Do not invent** `*neyral`, `*awtomatisasyon`, `*prediksyon-modelo` and similar hybrids.

### 6.3 There is no official Filipino AI terminology — this was checked

Three sourced findings:

**(a) KWF's own official dictionary lemmatizes computing under the *English* headword.**
`kwfdiksiyonaryo.ph?query=computer` returns *“computer … Bigkas kom•pyú•ter … Pinagmulang Wika Ingles …
TEKNOLOHIYA Mákináng elektroniko na ginagamit sa pag-iimbak at pagpoproseso ng mga datos … →
KOMPIYÚTER”*, and `?query=kompiyuter` returns *“kom•pi•yú•ter … Pinagmulang Salita computer … Tingnan ang
computer”* (“see *computer*”). **The respelled form is the cross-reference; English is the headword.**
*(Re-fetched 2026-07-26 for this guide: HTTP 200, `Pinagmulang Wika: Ingles`, `→ KOMPIYÚTER`, footer
“©2025 Komisyon sa Wikang Filipino”.)* `algoritmo`, `awtomasyon` and `kompyuter` return *“Walang
resulta”* — no entry at all.

**(b) Philippine government AI policy is written entirely in English.** The National AI Strategy Roadmap
page states its objectives in English throughout. ⚠ That page also says NAISR 2.0 *“has been superseded”*
and truncates before naming the successor — **the current strategy document was not located**.

**(c) Filipino-language journalism uses bare English `AI` inside Filipino syntax.** A Filipino-language
news desk writes: *“Itinuturing daw ni Ian Xavier Villanueva na life coach at therapist ang AI o
artificial intelligence chatbot na kaniyang nakaka-chat online.”* (Media/Community).

**(d) Tagalog Wikipedia coins Filipino terms but glosses them against English immediately** — *“Ang
pagkatuto ng makina ({{lang-en|machine learning}}) … nagbibigay-daan sa kompyuter na makapagbago ng
pag-aasal batay sa mga datos(o data)…”* (Community).

> **A hard usage number worth remembering, and a warning against confusing prescription with usage:**
> on tl.wikipedia, KWF's prescribed respelling **`kompiyuter` occurs on 0 pages**, while **`kompyuter`
> occurs on 579** and `computer` on 488 (counted via `insource:` search). **Prescription and usage have
> diverged.** This guide follows **usage** for `computer` and says so at the row.

### 6.4 Seed field vocabulary (AI/ML) — 20 terms

**Read the columns as three different things.** “Prescriptive / official” is what an authority says.
“Actually used” is measured (tl.wikipedia `insource:` page counts, KWF dictionary entries, journalism).
“Recommendation” is this guide's call. **Do not present prescription as usage.**

**Tier key:** `A` = KWF official/prescriptive · `B` = Philippine government usage · `C` = community
(tl.wikipedia, localization projects) · `D` = Filipino-language journalism · `★` = **craft-tier
recommendation — nothing prescribes it.**

| English | Prescriptive / official | Actually used (measured) | **Recommendation** | Tier |
|---|---|---|---|---|
| **artificial intelligence** | None. KWF has only the parts — `artipisyal`: *“Likhâ ng tao, sa halip na likás”*; `katalinuhan`: *“Katalasan ng isip; pagiging marunong”* | tl.wiki *“intelihensiyang artipisyal”* / *“artipisyal na katalinuhan”* (25 / 23 pages) vs `artificial intelligence` 37. Journalism: *“ang AI o artificial intelligence chatbot”* | First mention **artificial intelligence (AI)** + gloss *artipisyal na katalinuhan*; thereafter **AI** | ★ on A+C+D |
| **machine learning** | none found | tl.wiki article title *Pagkatuto ng makina* (21) vs `machine learning` 12 | **machine learning**, gloss *pagkatuto ng makina* once | ★ on C |
| **neural network** | none found | untranslated: *“Ang mga LLM ay mga artipisyal na neural network”* (13); **no tl.wiki article exists** | keep **neural network** / *artipisyal na neural network*. **Do not coin** | ★ on C |
| **deep learning** | none found | one attestation, as a gloss: *“pinagsamang mga salitang deep learning o malalim na pag-aaral”*; `insource:"malalim na pagkatuto"` → **0 hits** | keep **deep learning**. ⚠ *malalim na pag-aaral* elsewhere means “in-depth study” — gloss only where context disambiguates | ★ on C |
| **algorithm** | **not in the KWF dictionary** (*“Walang resulta para sa ‘algoritmo’”*) | tl.wiki *Algoritmo* (98) vs `algorithm` 30 | **algoritmo** — matches real Spanish, so *siyokoy*-safe | ★ on C |
| **data** | KWF headword is `datos` (*“Pinagmulang Salita dato+s … Espanyol”*); `data` → *“Tingnan ang dátos”* | `datos` 1780 pages; but same-sentence hedging *“mga datos(o data)”* | **datos** | **A** |
| **dataset** | none found | ⚠ **no Filipino form found anywhere** | **dataset**, or *set ng datos* | ★ (pure craft — flag to a reviewer) |
| **training** (a model) | KWF `pagsasanay`: *“Mapamaraang pagsasagawa ng mga aktibidad upang maging dalubhasa sa isang kasanayan”* | tl.wiki *“proseso ng pagsasanay”*, *“sinasanay na data(training set)”* | **pagsasanay**; verb **sanayin**; *training data* → **datos sa pagsasanay** | A + ★ |
| **model** | KWF `modelo` sense 2: *“Payak na paglalarawan ng anumang sistema o konsepto”* | `modelo` 1563 pages; *“malaking modelong pangwika”* | **modelo**. ⚠ the tl.wiki page titled *Modelo* is the **fashion** sense — link *Modelong matematikal* | **A** |
| **prediction** | KWF `hulà`: *“Pagsasabi ng maaaring mangyari sa hinaharap”* | *“paulit-ulit na paghula sa susunod na token o salita”*; `hula` 161 | **paghula** (the act) / **hula** (the output) | A + C |
| **bias** | KWF `kíling`: *“2. Pag-ayon sa isang panig. → KAMPÍ, PÁNIG”* — **not marked technical** | ⚠ **no attestation in an AI or statistical sense found** | use **bias** (English) first, gloss *pagkiling*. **Flag to a native reviewer — genuinely unsettled** | ★ (pure craft) |
| **large language model** | none found | *“malaking modelong pangwika o large language model ( LLM )”* | **large language model (LLM)**, gloss once | ★ on C |
| **prompt** | none found | ⚠ **no Filipino equivalent found in any source** | keep **prompt**. **Do not invent** | ★ (pure craft) |
| **chatbot** | not in KWF (`robot` is an entry, `chatbot` is not) | untranslated everywhere; 10 pages; used bare in news headlines | **chatbot** | C + D |
| **computer** | KWF headword is **`computer`**; cross-ref → `KOMPIYÚTER`; MMP: *“maki-computer, ngunit makikompiyuter”* | `kompyuter` **579** / `computer` 488 / **`kompiyuter` 0** | **kompyuter** in running prose. **Do not** use KWF's `kompiyuter` (zero usage) or the purist coinage *panuos* | ★ on A+C (**usage over prescription — deliberate**) |
| **computing / computer science** | KWF writes `computer` in its own prose | tl.wiki: *“Ang agham pangkompyuter o impormatika … o computer science sa wikang Ingles”* | *computer science* → **agham pangkompyuter**; *computing* → **kompyutasyon** | C |
| **automation** | **not in the KWF dictionary**; but `awtomatiko` is: *“Pinagmulang Salita automatico … Kusang gumagana”* | `awtomasyon` 10 / `automation` 17 | **awtomasyon**, adj. **awtomatiko** | ★ on A+C |
| **learn / learning** | KWF `matuto`: *“Magkaroon ng kaalaman o kabatiran; dumunong”* | localization: *“Mga talakayan para sa pag-aaral”*; tl.wiki uses *pagkatuto* for the ML sense | *learn* → **matuto**; *learning* (ML sense) → **pagkatuto**; *learning* (study) → **pag-aaral** | A + C |
| **accuracy** | KWF `tumpák`: *“Naaayon sa mga pamantayan ng kawastuan o inaasahang ayos”*, nominal `katumpakán` | attested with `modelo` in tl.wiki math/stats articles | **katumpakan** | A + C |
| **pattern** | KWF `padrón`: *“Modelong ginagamit na gabay sa paggawa ng isang disenyo … → PATTERN, HUWÁRAN”* | both circulate: *Pagkilala ng padron* (162) vs `paterno` (121) | **padron**. ⚠ **Avoid `paterno`** — Spanish *paterno* means “paternal” (pattern is *patrón*), so it has the exact profile of a *siyokoy* (§6.2) — **yet tl.wikipedia itself writes** *“pagkilala ng paterno(pattern recognition)”* | A + ★ |

Project coinages (class C1) keep their original spelling in Filipino text and are owned by the
term-sheet, not this table.

### 6.5 What existing Filipino software localizations settled on — the house rule

All **Community tier**; taken from the projects' own string files (a wiki engine's `tl.json`, a browser's
`tl` `.ftl` files, a learning-management system's `tl` langpack).

| Concept | Wiki engine `tl` | Browser `tl` | LMS `tl` |
|---|---|---|---|
| file | *“Listahan ng file”*, *“Mag-upload ng file”* | *“Alisin ang File”*, *“Magbukas ng File”* | `'file' = 'File'` |
| download | *“diskargahin”* | *“Mga Download”*, *“Payagan ang Download”* | `'download' = 'I-download'` **and** `= 'Ilusong'` (inconsistent) |
| settings | — | *“Mga setting”* | `'settings' = 'Mga setting'` |
| account | *“Gumawa ng account”* | *“Account”* | `'createaccount' = 'Likhain ang bago kong account'` |
| search | *“Hanapin”* / *“Maghanap”* | — | `'search' = 'Maghanap'` **and** `= 'Hanapin'` |
| save | *“I-save ang pahina”*, *“Itala ang binago”* | — | `'save' = 'I-save'` |
| level | ⚠ not found | ⚠ not found | ⚠ not found |

> ### Nativize the verb; keep the noun.
> *File*, *Download*, *Account*, *Username*, *setting* stay English. The **verbs** around them are
> Filipino: *Alisin, Magbukas, Payagan, Likhain, I-save, I-upload, I-download.*

Where a translator *did* nativize the technical noun, quality dropped visibly and consistency broke —
the LMS renders `download` as both *I-download* and *Ilusong*, and *preferences* as *“Mas-ibig”*, which
is not idiomatic UI Filipino. Coverage is also thin generally in Filipino localization projects (one
distribution reports *“Status 57 strings are translated to this language (from 1190190)”*; one desktop
project's `tl` team page says *“This team does not exist.”*).

### 6.6 The sandwich pattern, instantiated

On the *first* mention of an established domain term (class **C3**), give the term + the Filipino gloss +
one short plain clause, then use the short form alone afterwards:

> **machine learning** (*pagkatuto ng makina*) — paraan kung saan natututo ang kompyuter mula sa datos
> nang hindi tuwirang pinoprograma. *(The explanatory clause is authored per the sandwich format; the
> terms themselves are sourced in §6.4.)*

Then **machine learning** alone on every later mention.

### 6.7 Policy to hand to translators (craft-tier, derived from §6.1–§6.6)

1. **Keep the English term** for terms of art the learner will meet in English elsewhere (`machine
   learning`, `neural network`, `training data`, `prompt`, `token`, `overfitting`). Sanctioned by OP
   §4.6 case 2 (*katawagang siyentipiko at teknikal*) and §4.7 stop conditions (2) and (4).
2. **Use the established Spanish-derived Filipino word where one genuinely exists in the dictionary** —
   *datos*, *makina*, *artipisyal*, *modelo*, *algoritmo*. This is OP §4.8.
3. **Gloss on first use, then use the short form** (§6.6).
4. **Never invent a *siyokoy*.** If unsure whether a Spanish-looking form is real, check the KWF
   dictionary; if it is not there, **use English**.
5. **Verbs and glue stay Filipino.** Even in heavily English-lexical text the grammar must be fully
   Filipino.
   - ✅ **Sinasanay ang modelo gamit ang malaking dataset.**
   - ❌ **Tine-train ang model gamit ang big dataset.**
6. **Pick one form per term and hold it.** Philippine practice is genuinely inconsistent — a single
   DepEd ICT module writes *“paggamit ng computer, internet at email”* in one objective and *“paggamit
   ng kompyuter,internet, at email”* in the next (⚠ third-party mirror; `deped.gov.ph` is 403, so this
   is **reported** DepEd content, Community tier). **Consistency is the kit's whole value-add.**

Sources: KWF *Ortograpiyang Pambansa* §§4.1, 4.2, 4.4, 4.6, 4.7, 4.8, 4.9 (Official; PDF 403, via web
archive) · <https://kwfdiksiyonaryo.ph/?query=computer> (Official) ·
<https://tl.wikipedia.org/wiki/Siyokoy_(lingguwistika)> · <https://tl.wikipedia.org/wiki/Pagkatuto_ng_makina>
· tl.wikipedia `insource:` page counts (Community, measured) · <http://paulmorrow.ca/siyokoy.htm>
(Community) · localization string files of three open-source projects (Community) ·
<https://naisr.cair.ph/strategy-framework/> (Official; ⚠ superseded, successor not located)

---

## 7. Idiom anti-patterns

> **⚠ This entire table is craft-tier, by necessity.** **No Filipino authority legislates UI
> microcopy** — the KWF manuals are print-editorial guides (§2, gap 4). Three rows carry **Official
> precedent** for the *form* (marked in the provenance column); the rest are this guide's professional
> judgment. **Native-speaker confirmation pending.** The ❌ column is the literal rendering a careless
> or machine translation produces and that a reviewer should reject.

| # | English | ✅ Idiomatic Filipino | ❌ Literal calque — wrong | Why / provenance |
|---|---|---|---|---|
| 1 | Let's take a look at… | **Tingnan natin ang…** | *Kunin natin ang isang tingin sa…* | “take a look” is not a Filipino collocation; note **natin** (inclusive) — the reader is included (§4.2.5). **craft** |
| 2 | Try it yourself | **Subukan mo** | *Subukan mo ang sarili mo* | the calque means “test yourself as a person”; *subukan* already takes the task as object. **craft** |
| 3 | Keep in mind that… | **Tandaan na…** / **Tandaan:** | *Panatilihin sa isip na…* | KWF's own manuals use bare *“Tandaan:”* as the sectional reminder marker — **Official precedent** (OP §11.8) |
| 4 | In other words | **Sa madaling salita** | *Sa ibang mga salita* | *sa madaling salita* (“in easy words”) is the fixed Filipino equivalent. **craft** |
| 5 | For example | **Halimbawa,** | *Para sa halimbawa* | *halimbawa* stands alone as a sentence adverb; KWF uses exactly this throughout (*“Halimbawa, hindi dapat ibalik ang F…”*, OP §4.2) — **Official precedent** |
| 6 | Step by step | **Hakbang-hakbang** | *Hakbang sa pamamagitan ng hakbang* | reduplication is the Filipino device for iterative sequence (§4.2.6); **the hyphen is required** — **Official** for the spelling (OP §11.1) |
| 7 | It depends | **Depende (iyon)** / **Nakadepende iyon sa…** | *Ito ay umaasa* | *umasa* is “to hope / rely on emotionally”, not “depend on a condition”. **craft** |
| 8 | Under the hood | **Sa likod ng eksena** / **Kung paano ito gumagana sa loob** | *Sa ilalim ng talukap ng makina* | no Filipino car-hood idiom; use “behind the scenes” or drop the metaphor. **craft** |
| 9 | Rule of thumb | **Pangkalahatang tuntunin** / **Madaling gabay** | *Tuntunin ng hinlalaki* | the thumb image is meaningless in Filipino and mildly comic. **craft** |
| 10 | Train a model | **Sanayin ang modelo** / **Turuan ang modelo** | *Mag-tren ng modelo* | *tren* is a railway train; *sanayin* = “to drill / train” is the correct root (cf. *pagsasanay*, §6.4). **craft** on a sourced term |
| 11 | Trial and error | **Pagsubok at pagkakamali** / **Paulit-ulit na pagsubok** | *Pagsubok at kamalian* | *kamalian* is abstract “wrongness”; *pagkakamali* is “the making of a mistake”. **craft** |
| 12 | You're on the right track | **Tama ang direksiyon mo** / **Nasa tamang landas ka** | *Ikaw ay nasa tamang riles* | *riles* = railway rails; the track metaphor does not carry. **craft** |
| 13 | Get started (button) | **Magsimula** | *Kunin ang nagsimula* | single imperative verb; do not translate the light verb “get”. **craft** |
| 14 | Learn more (link) | **Alamin pa** / **Matuto pa** | *Matuto ng higit pa* | *pa* as the enclitic “more / still” is the natural form, and it sits in the clitic queue (§4.2.4). **craft** |
| 15 | Coming soon | **Malapit nang dumating** / **Paparating na** | *Darating malapit* | Filipino puts the aspect on the verb, not on an adverb of nearness (§4.2.3). **craft** |

**Two systemic notes for the reviewer, both craft-tier:**

- **English verbs with Filipino affixes** (*“i-download”*, *“mag-log in”*, *“i-click”*) are ubiquitous in
  real Philippine tech usage and, per Ortograpiyang Pambansa §11.3, are **spelled with a hyphen** when
  the English spelling is kept (*“pa-cute, ngunit pakyut”* is the rule's own model). They are acceptable
  in UI verbs where **no Filipino verb exists** (*i-download*), but not where one does — ✅ **Buksan**,
  ❌ *i-open*. (*I-save* is tolerable; *Itago* is **not** the same thing — it means “hide/keep away”.)
- **Do not translate proper product/feature names.** If the platform has named sections, keep the names
  and translate only the surrounding frame.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: **craft-tier throughout**, with Official precedent on rows 3, 5, and 6 from KWF *Ortograpiyang
Pambansa* §§4.2, 11.1, 11.3, 11.8 (Official; PDF 403, via web archive). No Filipino style guide
legislates UI microcopy — see §2, gap 4. Native-speaker confirmation pending.

---

## 8. Simplified-language pendant (`tl-easy`)

**8a** records what exists and what does not — the absence of a Filipino plain-language standard was
verified, not assumed, and three usable things sit near the gap. **8b** names the axis the official
clear-writing material draws and carries the word table. **8c** documents the corpus measurement
behind the Corpus-tier rows: two corpora, their sizes, the method, and its caveat. **8d** is the list
the corpus *contradicts*.

### 8a. Is there a Filipino plain-language tradition? — **❌ No. And the absence was verified, not assumed.**

**There is no Filipino “Leichte Sprache” / “Easy Read” standard: no rule set, no certification, no
issuing body, no readability formula.** Fifteen distinct search lines were run (in Filipino and English)
covering KWF, DepEd, the Civil Service Commission, the National Council on Disability Affairs,
disability easy-read, simplified Bible translations, and Filipino readability formulas; a **full-text
sweep of the 248 KB KWF style manual for *payak* returned 0 hits**; an archive-index sweep of
`ncda.gov.ph` filtered on `accessib|plain|easy|information` surfaced only WCAG **web**-accessibility
material, nothing cognitive. **The absence is real, not a search failure.**

> **Consequence: `tl-easy` inherits the kit's base simplified-language rules wholesale** from
> [accessibility-workflow → “Plain / simplified-language rules”](../accessibility-workflow.md) — one idea
> per sentence, everyday words, say what *is* rather than what *isn't*, active voice, a one-line “what is
> this” opener, a consistent literal tone. That is a **legitimate, complete answer**, not a gap to pad
> over. What follows are the **Filipino-specific overlays that *do* have official warrant** — they are
> clear-writing rules, and this guide carries them **as what they are**, not as a plain-language standard.

**Three things exist near the gap, and all three are usable:**

**(a) A plain-language law that has never passed — for 17 years.** The Senate's own subject index for
“PLAIN LANGUAGE” lists eight Senate bills across five Congresses and **no Republic Act**: *“Senate Bill
No. 3138, 14th Congress of the Republic”* / *“PLAIN LANGUAGE ACT”* / *“Date filed March 24, 2009”*;
*“Senate Bill No. 1092, 16th Congress … PLAIN WRITING FOR PUBLIC SERVICE ACT OF 2013”*; *“Senate Bill No.
273, 19th Congress … PLAIN LANGUAGE IN GOVERNMENT DOCUMENTS ACT … Date filed November 7, 2022”*. Re-filed
in June 2025 as **House Bill 46, 20th Congress**: *“AN ACT REQUIRING THE USE OF PLAIN LANGUAGE IN ALL
GOVERNMENT ISSUED PUBLIC ADVISORIES, NOTICES, ANNOUNCEMENTS AND SIMILAR DOCUMENTS”*, mandating agencies
*“to adopt the use of plain language in English, Filipino and/or other regional languages or dialects”*,
with *“the Komisyon sa Wikang Filipino (KWF) shall be tapped to facilitate the necessary
capacity-building activities”*. **Critically, the bill contains no linguistic rules** — it delegates
everything to implementing rules that do not exist, because it is not law.

**(b) The nearest thing to an official plain-writing ruleset: KWF's *Patnubay sa Korespondensiya
Opisyal* (4th ed.)** — a manual for *official correspondence*, not public explainers, but three of its
seven principles transfer directly (Official; canonical URL 403, recovered via web archive):

| Principle | KWF's words |
|---|---|
| **Malinaw** (clear) | *“Ito ay di dapat maging mahaba o maligoy. Higit na epektibo ang maiikling pangungusap. Tandaan na ang kasimplihan ay daan ng madaling pagunawa.”* |
| **Maikli** (concise) | *“Iwasan ang paglalakip ng mga detalyeng walang kabuluhan.”* |
| **Kumbersasyonal** | *“Sabihin sa natural na pamamaraan ang nais iparating… Gumamit ng sariling pananalita at iwasan ang pagkamaligoy.”* |

*“ang kasimplihan ay daan ng madaling pagunawa”* (“simplicity is the road to easy understanding”) is a
quotable, **official, Filipino-language** warrant for plain writing. The Patnubay's editors describe
deliberately de-jargonizing the edition: *“Napalitan ang ilang salitang may kalabuan at asiwang
pagkabuo, at pinalitan ng higit na madaling unawain at bigkasin.”*
⚠ **Caveat:** its fourth principle **Magalang** (*“Napakahalaga ng himig (tone) ng pagpapahayag.”*) pulls
the **opposite** way, toward honorific letter-register — and would conflict with the §4 register
decision. **Take the three, leave the fourth.**

**(c) No readability formula exists.** Filipino readability is an open research problem, not a writer's
tool. Imperial & Ong, *“Under the Microscope: Interpreting Readability Assessment Models for Filipino”*
(Academic) reports *“54 different linguistic predictors spanning surface-based, lexical, language model,
syllable structure, and morphological features—the most extensive study on the Filipino language to
date”*, achieving *“a 66.1% accuracy using Random Forest”* over three coarse levels of **children's
books** (*“A total of 174 children's fictional books and 91 reading passages”*). DepEd's official
leveling instrument, the **Phil-IRI**, sets Filipino levels by **empirical validation with pupils, not
by formula**: *“The Graded Passages range from Grade 2 to Grade 7 Readability levels for English and
Grade 1 to Grade 7 Readability levels for Filipino”*, *“revalidated to the present group of learners in
2016”*. Searching the whole Phil-IRI manual for *Fry*, *word count*, *sentence length* returns **zero
hits. There is no Filipino Flesch–Kincaid.**

### 8b. The axis — verb over noun-phrase, plain Filipino word over impressive borrowing

No Filipino tradition names a plain-versus-standard axis, because no tradition exists (8a). What the
**official** clear-writing material does name is two directions of rewrite, and the corpus in 8c adds a
third contrast on top of them: **official-correspondence register against learner-material register.**
The three together are the axis this section works on.

**Two official clear-writing rules that are directly usable.** The MMP frames itself explicitly as a
plainness manual rather than a style-elegance manual: *“unang-unang dapat linawin na patnubay ito sa
masinop at maingat na pagsulat; hindi sa malikhain at magandang pagsulat … ang higit na layunin … ay
ituro ang mga pamantayan para sa higit na mabilis na komunikasyon. Ang ibig sabihin, para matiyak na ang
isang sulatin ay maiintindihan ng target na mambabasá.”* And it supplies a genuine **anti-nominalization
rule**:

> **MMP §11.6 “Iwasan ang ‘Bigyan-’”:** *“Magtipid sa paggawa ng tambalang salita, lalò’t hindi
> kailangan. Halimbawa, isang bisyo na ang pagdurugtong ng anumang nais sabihin sa bigyan- gaya sa
> bigyang-diin at bigyang-pansin. Marami ang nagsasabing ‘bigyang-pugay’ samantalang puwede naman at mas
> maikli pa ang nagpugay; ‘bigyang-parangal’ samantalang puwede itong parangalan; ‘bigyang-tulong’
> samantalang higit na idyomatiko ang tulungan. Kahit ang ‘bigyang-pansin’ ay puwede nang pinansin.”*

That is, verbatim from the national style manual: **prefer the simple verb to the noun-phrase
construction.** And OP §4.9 supplies the second — **prefer a plain Filipino word to an
impressive-sounding borrowing**: *“maaaring higit na maintindihan ng madla kung ang katapat na salita sa
Filipino ang gagamitin: mukhâ o dakò, laráwan o hulágway, magbubukíd o magsasaká, kapanahón o
nápápanahón, pinilì o pinagtibay.”*

**Formal → everyday word pairs.** Tier is marked **per row**. **Official** = prescribed by KWF.
**Corpus** = measured by frequency contrast between a DepEd learner-material corpus and a KWF
official-correspondence corpus (corpora, sizes, and method in 8c). **craft** = this guide's judgment on
which member is plainer.

| Formal / heavy | Everyday / plain | Note | Tier |
|---|---|---|---|
| bigyang-diin | **idiin / diinan** | KWF names *bigyang-* constructions a “vice” and prescribes the simple verb | **Official** (MMP §11.6) |
| bigyang-pansin | **pansinin** | same rule, KWF's own example | **Official** (MMP §11.6) |
| bigyang-tulong | **tulungan** | KWF: *“higit na idyomatiko ang tulungan”* | **Official** (MMP §11.6) |
| bigyang-parangal | **parangalan** | KWF's own example | **Official** (MMP §11.6) |
| kontemporaryo (*siyokoy*) | **kapanahon / napapanahon** | KWF gives these as the plain replacements | **Official** (OP §4.9) |
| imahe (*siyokoy*) | **larawan / hulagway** | KWF's own plain-word list | **Official** (OP §4.9) |
| **kaugnay (ng)** | **tungkol sa** | 5.7 vs **80.4** per 100k — **14× formal skew**, the strongest single marker | **Corpus** |
| **hinggil sa** | **tungkol sa** | 3.8 vs **37.3** — 10× skew | **Corpus** |
| **ipatupad** | **gawin / sundin** | 0.6 vs **12.8** — 20× skew | **Corpus** |
| **naaayon sa** | **ayon sa** | 0.6 vs **9.3** — 15× skew | **Corpus** |
| **nararapat** | **dapat** | 4.5 vs **35.0** — 8× skew | **Corpus** |
| **isinasagawa** | **ginagawa** | plain form is 9× commoner in learner text (31.8 vs 3.5) | **Corpus** |
| **samakatuwid** | **kaya** | `kaya` dominates learner prose at 165.0 per 100k | **Corpus** |
| **ngunit** | **pero** | `pero` 20.4 in learner text, **0.0** in official correspondence — a clean informality lever | **Corpus** |
| pagsasakatuparan | pagtupad / paggawa | both rare in both corpora — weak signal | craft |
| kaalinsabay | kasabay | *kaalinsabay* absent from both corpora; genuinely rare | craft |
| magkaroon ng | may | *“may resulta”* beats *“magkaroon ng resulta”* | craft |
| matapos nito | pagkatapos | plainer sequencing | craft |
| gayunpaman | pero / ngunit | essay register → everyday | craft |

### 8c. The corpus measurement — a DepEd learner corpus against a KWF official-correspondence corpus

**Corpus method** (Corpus-tier rows only): normalized counts per 100,000 words. **Plain corpus** = 6
DepEd learner modules (Gr. 2, 3, 9, 10, SHS, ALS) + the full Phil-IRI package (156,989 words). **Formal
corpus** = KWF *Patnubay sa Korespondensiya Opisyal* (85,766 words).
⚠ **Caveat:** the formal corpus is a **single manual about letters to dignitaries** — the most elevated
register in Filipino — so the skews are **amplified**. Treat these as **diagnostic signals, not
lexicography.**

Every per-100k figure in this section comes from that pair: the **Corpus**-tier rows of the 8b table and
the counts quoted in 8d. Quote a rate together with the corpus size it was divided by — a figure whose
corpus is unstated is not checkable, and if a re-run returns different word counts the rates are stale
rather than merely different. Rows marked **craft** in 8b were *not* separated by this measurement
(*pagsasakatuparan* and *kaalinsabay* are rare or absent in both corpora), and rows marked **Official**
stand on KWF's prescription, not on these counts.

### 8d. 🔴 Three assumptions the corpus *contradicts* — do NOT “simplify” these

The rows most likely to be got backwards by a translator applying English plain-language instincts:

| Do **not** do this | Why |
|---|---|
| ~~*mahalaga* → *importante*~~ | **`mahalaga` IS the plain word.** Learner corpus 18.5 vs official 4.7; the Spanish loan `importante` is 0.6 / 0.0 — near-absent from *written* Filipino. |
| ~~*maaari* → *puwede*~~ | **`maaari` is the written form.** 31.2 / 33.8 vs `puwede` 3.2 / 1.2. `puwede` is spoken-colloquial; DepEd's own learner materials overwhelmingly write `maaari`. |
| ~~*pagsusuri* → something simpler~~ | **`pagsusuri` is core curriculum vocabulary**, 53.5 per 100k in the learner corpus. Leave it alone. |
| ~~*teknolohiya* → *makabagong kagamitan*~~ | The corpus signal here is **contaminated** (the official-corpus hits come from a bilingual glossary). **No evidence** `teknolohiya` is formal. |

### 8e. 🔑 The address decision — `tl-easy` holds the §4 register: `ka` / `mo` / `iyong`, **no `po`**

> **Decision: hold the §4 register — `ka` / `mo` / `iyong`, no `po`, never `kayo` as a polite
> singular. Same rule as the base variant.**

**The grounds are evidence, and they are recorded in §4, not here.** §4's register decision rests on
measured `po` / `kayo` / `ka` / `mo` counts across six official DepEd learner modules spanning Grade 2
to adult ALS, produced by three independent offices — which is why §4 states it as evidence-grounded
rather than a stylistic preference. For `tl-easy` specifically, the DepEd **ALS** module — written for
adults with interrupted schooling — is the single best model available and uses exactly this register.

Two limits on that warrant, both already recorded: it is a **project decision taken under the kit's
human-gate rule, not a ruling by any language authority** (§4 — there is no such ruling to appeal to),
and it runs **against** the fourth Patnubay principle *Magalang*, which pulls toward honorific
letter-register (8a (b)). This section takes the three principles and leaves the fourth.

### 8f. What `tl-easy` is built on — in order of leverage

The overlay rules are **craft-tier on top of the kit base rules** unless a rung says otherwise; the two
Official rungs are marked as such.

1. **One idea per sentence; ~15 words maximum.** *(craft — no Filipino norm sets a number; the kit's own
   ~8–12-word target may be used where tighter.)* The Patnubay's *Malinaw* principle points the same
   way without a figure — *“Higit na epektibo ang maiikling pangungusap.”* (8a (b)).
2. **Prefer actor voice in instructions** (*“Pindutin ang pindutan”*), **patient voice for statements
   about the thing** (*“Ginagamit ang datos…”*) — §4.2.1.
3. **Replace `bigyang-X` and `pagsasa-X-an` nominalizations with verbs** — **Official rule**, MMP §11.6
   (8b).
4. **Use `tungkol sa`, `dapat`, `ginagawa`, `kaya`, and allow `pero`** — all corpus-confirmed as the
   learner-material register (8b, 8c).
5. **Avoid Spanish-heavy academic vocabulary where a Tagalog root exists** (*pag-aaral* over *estudyo*,
   *tanong* over *kuwestiyon*) — **but see 8d**: `mahalaga`, `maaari` and `pagsusuri` are already the
   plain written forms and must **not** be “simplified”.
6. **The kit's base rules, inherited wholesale** — one idea per sentence, everyday words, say what *is*
   rather than what *isn't*, active voice, a one-line “what is this” opener, a consistent literal tone
   (8a). With no Filipino standard to inherit from, this is the floor the overlays sit on.
7. **Term preservation, binding.** In `tl-easy`, **keep the technical term and explain it** — never swap
   in a folksy stand-in. Keep e.g. **machine learning**, then *“Ibig sabihin: …”*, then a concrete
   example. This is **distinct** from the formal→everyday table in 8b, which targets **bureaucratic
   non-technical** vocabulary.

- ✅ **machine learning** (*pagkatuto ng makina*) — Ibig sabihin: natututo ang kompyuter mula sa datos.
- ❌ replacing *machine learning* with a vague everyday paraphrase (*“matalinong programa”*) and never
  naming the term.

- ✅ `tl-easy`: **Natututo ang modelo mula sa datos. Ibig sabihin: nakikita nito ang padron sa datos.
  Pagkatapos, nakakagawa ito ng hula.**
- ❌ `tl-easy`: **Kaugnay ng nabanggit, nararapat na bigyang-diin na ang pagsasakatuparan ng pagsasanay
  ng modelo ay isinasagawa sa pamamagitan ng malaking dataset.** (nominalizations, `kaugnay`,
  `nararapat`, `isinasagawa` — every Corpus-tier formal marker at once)

### 8g. Still open

- **There is no Filipino plain-language standard to adopt** (8a). The plain-language bill has not passed
  in 17 years, and even the current House Bill 46 **contains no linguistic rules** — it delegates them to
  implementing rules that do not exist. There is nothing to inherit until that changes.
- **No readability formula and no threshold** (8a (c)). Filipino readability is an open research problem;
  the Phil-IRI levels by empirical validation with pupils, not by formula, and there is no Filipino
  Flesch–Kincaid. The ~15-word maximum in 8f is therefore **craft**, not a norm.
- **⚠ The formal corpus is a single manual about letters to dignitaries** — the most elevated register in
  Filipino — so every skew in 8b and 8d is **amplified**. Diagnostic signals, not lexicography (8c).
- **⚠ One row is contaminated rather than decided:** *teknolohiya*'s official-corpus hits come from a
  bilingual glossary, so there is **no evidence** it is formal (8d). It is neither confirmed nor refuted.
- **⚠ Recorded conflict inside the one official source.** The Patnubay's *Magalang* principle pulls
  toward honorific letter-register and would conflict with the §4 register decision (8a (b), 8e). Taking
  three of its principles and leaving the fourth is this guide's resolution, not the manual's.
- **The craft-tier rows in 8b were not measured.** *pagsasakatuparan*, *kaalinsabay*, *magkaroon ng*,
  *matapos nito*, and *gayunpaman* rest on this guide's judgment — the first two because both members are
  rare or absent in both corpora.
- **No native-speaker review, and every government domain returned 403** (see the Status line in the
  header): the two official KWF books this section rests on were recovered via the web archive.

Sources: KWF *Patnubay sa Korespondensiya Opisyal* (4th ed.) and *Manwal sa Masinop na Pagsulat* §11.6 and
preface, *Ortograpiyang Pambansa* §4.9 (Official; canonical URLs 403, recovered via web archive) ·
<https://arxiv.org/pdf/2110.00157> (Academic) · Phil-IRI package (Official, via web archive) · Senate
subject index and House Bill 46, 20th Congress (Official, via web archive) · corpus counts measured over
the DepEd/Phil-IRI and KWF corpora described above

---

## 9. Regional variation

### 9.1 Filipino (standard) vs Tagalog dialects

**⚠ Community-tier.** The standard is **Manila-based**. Community reference lists the dialect zones as
*“Bataan, Batangas, Bulacan, Lubang, Manila, Marinduque, Puray, Tanay–Paete, Tayabas, and Soccsksargen”*,
and notes candidly that *“no comprehensive dialectology has been done in the Tagalog-speaking regions”*.
The differences that matter to a translator are **lexical and clitic-level** (Batangas *ala eh*, distinct
verb paradigms in Marinduque), **not orthographic**.

> **Neutrality strategy (explicit): target Manila-standard Filipino and ignore dialect variation
> entirely.** There is **one written standard** — Filipino does not split across separate national
> orthographies — so a single neutral `tl` build serves all readers.

- ✅ **Oo, tama iyan.** (standard) · ❌ **Oo, tama iyan, ala eh.** (Batangas-marked)

### 9.2 The other Philippine languages are *languages*, not variants

This is a **localization-planning fact, not pedantry**:

- **RA 7104 §5** treats them as separate: *“The commissioners shall represent the major Philippine
  languages … Tagalog, Cebuano, Ilocano, Hiligaynon and the major language of Muslim Mindanao”*
  *(re-fetched and confirmed verbatim 2026-07-26 for this guide)* (Official).
- **IANA** assigns them independent primary subtags: `Type: language / Subtag: ceb / Description:
  Cebuano` (Standards).
- The **2020 census counts them separately**: *“Bisaya/Binisaya was the second most generally spoken
  language at home with 4.21 million households (16.0%)”*, followed by Hiligaynon/Ilonggo, Ilocano,
  Cebuano (Official).
- **KWF's own 2014 publication** puts the national total at *“isang daan at pitumpu’t pitong aktibong
  wika”* — **177 active languages** (Official).

> **Consequence:** a Cebuano, Ilocano, or Hiligaynon speaker is **not** served by the Filipino build the
> way a Bavarian is served by German. They will *understand* Filipino (it is the national school
> language) but it is an **L2**. **Do not label the build “Philippines” — label it “Filipino”.**

### 9.3 Taglish — the honest observation

Code-switching is the actual language of urban educated Philippine life. Community reference: *“Taglish
or Englog is code-switching and/or code-mixing in the use of Tagalog and English”*, it is *“widely used in
the Philippines”* and *“has become the de facto lingua franca among the urbanized and/or educated middle
class”*, while *“prescriptivists of English and Tagalog discourage its use”*.

**Academic confirmation, for the classroom register specifically** — Mangila (2018), *Pedagogic
Code-Switching*, ELTEJ 1(3):

> *“Thompson (2003) frequently observes this phenomenon in television advertisements, public interviews,
> radio shows, basketball commentaries, and other media sites and later describes the prevalent use of
> Tagalog and English code switching as ‘Taglish.’”*
> *“Bolton (2003) also argues that this preponderance of ‘Taglish’ in Manila and in other provinces makes
> code switching ‘the unmarked code of choice’.”*
> *“the results revealed that the teachers frequently used code-switching mostly for instructional or
> content acquisition.”*

**“The unmarked code of choice”** is the operative phrase. **In Filipino, English technical nouns inside
Filipino syntax are register-neutral, not a translation failure.** The register lever is **grammar and
connective tissue** — verb affixation, `ang`/`ng`/`sa`, `mga`, the linker `na`/`-ng` — **not** noun
nativization. Formality is raised by avoiding English *clauses* and slang, **not** by replacing English
*terms* with coinages. KWF itself points at the cause: *“Malinaw ding epekto ito ng lubhang pagkalantad ng
paningin ng mga Filipino sa mga kasangkapang biswal (iskrin, karatula, bilbord) na nagtataglay ng mga
salitang banyaga sa mga orihinal na anyong banyaga.”* (OP §4.7, Official) — **screens keep foreign words
in foreign spelling. A web platform is a screen.**

**The tension is real and cannot be waved away:** a Filipino text about AI that uses only KWF-sanctioned
vocabulary will read as *more* foreign to its audience than one that keeps the English technical nouns.
But **full Taglish is informal and will read as unserious** for a learning platform.

> **Craft-tier resolution — “formal Filipino matrix, English technical lexicon”:**

| Layer | Language | Example |
|---|---|---|
| Sentence frame, verbs, particles, markers, connectives | **Filipino, always** | *Ginagamit ang…*, *Kapag…*, *upang…*, *ang / ng / sa* |
| Technical terms of art | **English, unrespelled** | *machine learning, neural network, dataset, prompt, bias* |
| Everyday nouns that have a normal Filipino word | **Filipino** | *datos, larawan, tanong, sagot, halimbawa, hakbang* |
| Discourse fillers, slang, `kasi`/`naman`/`talaga`-heavy phrasing, English verbs with Filipino affixes in body copy (*“i-check mo”*) | **Avoid in body copy** | reserve for quoted speech |

- ✅ **Sinasanay ang modelo gamit ang malaking dataset upang matukoy nito ang padron sa datos.**
- ❌ purist: **Sinasanay ang huwaran gamit ang malaking kalipunan ng datos upang matukoy nito ang
  paterno.** (coined/`siyokoy`-adjacent — reads more foreign than the English)
- ❌ full Taglish: **Tine-train ang model gamit ang big dataset para ma-detect niya yung pattern kasi
  ganun talaga.**

Sources: <https://en.wikipedia.org/wiki/Tagalog_language> · <https://en.wikipedia.org/wiki/Taglish>
(Community) · <https://files.eric.ed.gov/fulltext/EJ1288199.pdf> (Academic) ·
<https://lawphil.net/statutes/repacts/ra1991/ra_7104_1991.html> ·
<https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry> · PSA 2020 census
release and KWF *Ortograpiyang Pambansa* foreword and §4.7 (Official; canonical URLs 403, via web archive)

---

