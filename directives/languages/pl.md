<!-- base -->
# lang-pl — Polish (polski) — language guide

> **Setup & sources live in [`pl.setup.md`](pl.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** polski (język polski) / Polish.
**BCP 47 code (base):** `pl`.
**BCP 47 code (simplified variant):** `pl-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`pl-x-simple`), but the kit
token `pl-easy` is the one that counts here.
**Speaker reach:** the official language of **Poland**, with roughly **37–46 million native
speakers depending on the source**, and also used by Polish communities in neighboring countries
and the wider diaspora. **⚠ the range is a source-spread, not a single census figure** — pick and
cite one authority before quoting an exact number.
**Script + direction:** Latin script with **9 diacritic letters** (ą ć ę ł ń ó ś ź ż), 32-letter
alphabet; **left-to-right**. No bidi handling required.
**Status:** planned — authored from **external desk research** (self-fetched, one verbatim quote
per non-trivial claim, then independently reviewed against the cited sources). Covers base `pl` and the `pl-easy`
pendant. Reviewed against the cited sources at transform time; **not yet reviewed by a native
speaker** — per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.
**Easy or hard for this kit:** the *easy* part — Latin script, whitespace word separation
(standard tokenization works), no bidi, one national standard (no locale fork to maintain). The
*hard* part is grammar, and it hits the build directly: a **4-way plural** (one/few/many/other),
**past-tense gender agreement with no neutral form**, **7-case declension that breaks any UI noun
interpolated bare into a sentence**, a **non-breaking-space rule after one-letter words in titles**, and
**diacritic-stripping by some MT/LLM models** that silently ASCII-folds ł→l, ż→z, ą→a. Those five
are the recurring engineering pitfalls (§10, §11).

Sources: <https://en.wikipedia.org/wiki/Polish_alphabet> ·
<https://sjp.pwn.pl/zasady/Zasady-pisowni-i-interpunkcji;713485.html> ·
<https://en.wikipedia.org/wiki/Languages_of_Poland> (speaker range — a spread across sources,
⚠ not a census figure)

---

## 1. Header block

See above. One-line orientation: Polish is a West-Slavic, SVO-but-flexible, LTR language with a
single supra-regional written standard (**język ogólny**); the localization risks concentrate in
**inflection (7 cases, 4-way plural, gender agreement)**, **diacritic integrity**, and
**typographic detail (quotation style, non-breaking spaces)** — not in script or direction.

Sources: as the header block above — <https://en.wikipedia.org/wiki/Polish_alphabet> ·
<https://sjp.pwn.pl/zasady/Zasady-pisowni-i-interpunkcji;713485.html>

---

## 4. Grammar for translators

**Word order.** Base order is **SVO**, but Polish is strongly inflected, so order is flexible and
used for emphasis/topic — grammatical function is carried by **case endings, not position**.
English word-for-word order transferred onto Polish is a classic translator error. Plain-language
guidance recommends the canonical order for clarity: "Use a simple sentence construction: subject
+ verb + object" (Polish: *podmiot + orzeczenie + dopełnienie*). *(A secondary source claims Polish
word order "is not as crucial as in English" because case marks role — **⚠ not fetched verbatim**.)*

**Register — and the project's recorded choice.** Polish has a hard **T/V distinction**. Informal
**ty** takes 2nd-person verbs; formal **Pan** (to a man) / **Pani** (to a woman) / **Państwo**
(mixed/plural) behave grammatically like 3rd person — "zwrotom takim jak: 'Szanowna Pani',
'Szanowny Panie' zawsze towarzyszy czasownik w trzeciej osobie liczby pojedynczej." Using a
2nd-person verb with Pan/Pani reads as rude. Plain-language doctrine explicitly wants direct
personal address: "Pisz do ludzi, często używaj form osobowych. Do odbiorcy zwracaj się
bezpośrednio i pisz o swojej instytucji „my”."

> **Register decision (human-gate): ty (informal) — taken and recorded.** On the quality
> argument: for a warm book-companion learning tone, **ty** consistently is
> the register — direct, coaching, and explicitly backed by the gov.pl plain-language rule
> ("zwracaj się bezpośrednio…"). Modern Polish e-learning uses direct **ty** ("Zaloguj się",
> "Twój kurs", "Sprawdź, ile już umiesz"). **Binding for all second-person copy** in `pl` and
> `pl-easy` — no drift to Pan/Pani. **Pan/Pani remains noted** for institutional /
> official / adult-professional contexts, and stays the safe default *there* — but the two
> registers are **never mixed on one screen**.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

The grammar features that break a naive EN/DE → PL translation:

**(1) Seven-case declension.** Nouns, adjectives, and pronouns inflect through 7 cases (mianownik,
dopełniacz, celownik, biernik, narzędnik, miejscownik, wołacz). A noun's ending changes with its
syntactic role and after prepositions — **you cannot translate a UI term once and reuse the
string.** A bare `{noun}` interpolated into a sentence is grammatically wrong ~5/7 of the time.

- ✅ **trenujemy model** (accusative) · **parametry modelu** (genitive, *-u*) · **w modelu**
  (locative) · **modelem** (instrumental) — one lemma, five surface forms.
- ❌ Reusing one nominative string inside every sentence: *„parametry model”*, *„w model”*.

**(2) Grammatical gender + animacy.** Every noun is masculine / feminine / neuter, and masculine
splits by animacy; adjectives, participles, past-tense verbs, and numerals all agree. **Past tense
agrees with subject gender, and there is NO gender-neutral past form** — a register-flat EN "You
completed the course" has no neutral Polish rendering. Platforms rephrase to an impersonal form.

- ✅ **Ukończyłeś kurs** (to a man) · **Ukończyłaś kurs** (to a woman) · impersonal
  **Kurs ukończony** (avoids forcing gender).
- ❌ A single past-tense form assumed for an unknown-gender reader (there is no neutral one — this
  is exactly why the impersonal rephrase exists).

**(3) Verbal aspect (dokonany / niedokonany).** Almost every verb comes as an
imperfective/perfective pair; the choice encodes **completion, not tense** — perfectives
"wskazują czynności … które mają swój koniec (rezultat)", imperfectives those "które nie mają
swego zakończenia lub rezultatu", and "dla dokonanych tworzymy jedynie formy dwóch czasów:
przeszłego i przyszłego." Present tense can only be imperfective.

- ✅ A button = **Zapisz** (perfective imperative — one completed action); a progress hint =
  **Zapisywanie…** (imperfective verbal noun — ongoing).
- ❌ **Zapisywać** on a button, or **Zapisz…** as a progress spinner — the wrong aspect sounds
  broken.

**(4) Numeral–noun agreement (4-way plural).** Polish plural is **not one form**: 1 takes
nominative singular; 2–4 (and any number ending 2–4 except 12–14) take a special "paucal"; 5+ (and
11–14) take genitive plural. This maps to CLDR plural categories **one / few / many / other** for
`pl` (§5). **Never build "{n} point(s)" by appending an ending** — use the 4-way plural.

- ✅ **1 punkt** · **2 / 3 / 4 punkty** · **5 punktów** · **22 punkty** · **25 punktów**.
- ❌ **2 punkt**, **5 punkty**, or a hard-coded "1 punkt(y)" — grammatically wrong.

*(CLDR confirms `pl` is a 4-category plural language; the exact rule text was **⚠ not fetched
verbatim** but the category names are confirmed via CLDR docs — see §5.)*

**(5) Genitive "of"-chains, not glued nominal stacks.** English noun-piles and "of" chains
("machine learning model training data") must be re-cased into **genitive strings**, not calqued
as an SVO/nominal blob. Plain-language sources warn against nominalization: "Unikaj rzeczowników
odczasownikowych. To te, które kończą się na –anie, -enie, -cie."

- ✅ **dane treningowe modelu uczenia maszynowego** (genitive chain).
- ❌ Word-for-word English order glued together as stiff "translationese".

Sources: <https://www.gov.pl/web/sluzbacywilna/prosty-jezyk> ·
<https://zpe.gov.pl/a/jak-grzecznie-zwracac-sie-do-innych/D10dH22MH> ·
<https://zpe.gov.pl/a/aspekt-i-tryb-czasownika/D6rmPBCi4>
(word-order-flexibility secondary source & exact CLDR plural rule text ⚠ — see notes above)

---

## 5. Numbers, dates, currency

**Version anchor.** Values below are from **CLDR 48.2** (`pl` locale, 2026-03-17) — the current
stable maintenance release, as recorded in §2. (This line previously read "CLDR 48 / 48.1", which
contradicted §2; 48.2 is the release, and the release line runs 48 = 2025-10-29 → 48.1 = 2026-01-08
→ 48.2 = 2026-03-17. A claim about a future CLDR 49 date was removed — it could not be verified,
and the Unicode downloads index no longer serves the page it rested on.)

**Digits.** Western digits **0123456789** throughout; Polish has no separate native digit set.

**Decimal separator = comma; group separator = (narrow) space.** For `pl`, CLDR gives decimal =
`,` (comma) and group = ` ` (space). Grouping is by thousands, but `minimumGroupingDigits` means a
separator only appears from **5 digits up** (so `1000` but `10 000`) — **⚠ behavior described in
CLDR docs, not fetched verbatim from the `pl` data file.** Worked example (freeformatter, matches
CLDR): "Format: 999 999 999,99".

- ✅ `1234.56` → **1 234,56** · `10000` → **10 000** · `1000` → **1000**.
- ❌ **1,234.56** (English comma-thousands / dot-decimal) or **1.234,56** (dot-thousands).

**Dates.** Little-endian, **day first**; month name is **genitive** in long/full forms; 24-hour
clock is default. From the CLDR `pl` verify chart:

| Format | Example |
|---|---|
| Full | **piątek, 13 stycznia 2012** |
| Long | **13 stycznia 2012** (genitive month: *stycznia* = "of January") |
| Medium | **13 sty 2012** |
| Short / numeric | **13.01.2012** (dd.mm.yyyy with dots) |
| Time | **20:45** (24-hour) |
| Combined | **13 stycznia 2012, 20:45:59** |

- ✅ **13.01.2012** · **13 stycznia 2012**.
- ❌ **01/13/2012** (US month-first) or a nominative month **13 styczeń 2012** in a long date.

**Currency (PLN / zł).** The symbol **follows** the amount, after a space; decimals with a comma —
freeformatter: "Format: 999 999 999,99 zł" with "the Polish Zloty symbol (zł) positioned after the
number." Consistent with the CLDR `pl` currency pattern (symbol trails with space); the subunit is
*grosz* (1 zł = 100 gr).

- ✅ `1234.56 PLN` → **1 234,56 zł**.
- ❌ **zł 1234.56** (symbol-first, dot-decimal) or **1,234.56 zł**.

**⚠** The exact CLDR currency *pattern string* (`#,##0.00 ¤`) was **not fetched verbatim** (the
CLDR currency chart URL 404'd); placement is corroborated from the number-symbols chart +
freeformatter. Drive concrete output from live CLDR `pl` data.

Sources: <https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html> ·
<https://www.unicode.org/cldr/charts/latest/verify/dates/pl.html> ·
<https://www.freeformatter.com/poland-standards-code-snippets.html> ·
<https://cldr.unicode.org/downloads/cldr-48>

---

## 6. Terminology strategy

**Loanword vs coinage pattern.** Polish AI vocabulary is mostly **native calque/coinage** for
established concepts (*sztuczna inteligencja, uczenie maszynowe, sieć neuronowa, uczenie
głębokie/nadzorowane*) but keeps **English loanwords** for newer/technical tokens (*prompt,
transformer, token, embedding*). Acronyms usually stay English (ML, LLM, NLP). **Give the
Polish term first, then the English acronym in parentheses on first use.** Freeze one internal
list to avoid drift (e.g. always *głębokie uczenie*, never mixing with *uczenie dogłębne*).

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give the Polish term + the English original + one
short plain clause of what it means, then use the Polish term alone afterwards. Instantiated with a
sourced term:

> **sztuczna inteligencja** (artificial intelligence, AI) — *"dział informatyki … tworzący
> programy lub systemy komputerowe symulujące ludzkie myślenie"* — then **sztuczna inteligencja**
> alone on every later mention.

**Seed field vocabulary (AI / ML).** Field-standard renderings; provenance marked per row. The
industry glossary **turing.pl** (an industry site, **not an academy**) anchors most rows; PWN's
dictionary anchors the AI headword.

| Concept (EN) | Polish term | Provenance |
|---|---|---|
| Artificial intelligence (AI) | sztuczna inteligencja | PWN dictionary ✓ |
| Machine learning (ML) | uczenie maszynowe | turing.pl (industry) ✓ |
| Deep learning (DL) | głębokie uczenie / uczenie głębokie | turing.pl ✓ |
| Neural network | sieć neuronowa / sieci neuronowe | turing.pl ✓ |
| Large language model (LLM) | duży model językowy | turing.pl ✓ |
| Natural language processing (NLP) | przetwarzanie języka naturalnego | turing.pl ✓ |
| Supervised learning | uczenie nadzorowane | turing.pl ✓ |
| Unsupervised learning | uczenie nienadzorowane | turing.pl ✓ |
| Reinforcement learning | uczenie ze wzmocnieniem | turing.pl ✓ |
| Training data / training set | dane treningowe / zbiór treningowy | turing.pl ✓ |
| Prompt | prompt (loanword) | turing.pl ✓ |
| Transformer | transformer (loanword) | turing.pl ✓ |
| Generative AI | generatywna sztuczna inteligencja / generatywna AI | turing.pl ✓ |
| Algorithm | algorytm | ⚠ standard Latin loan, no dedicated authority fetched |
| Model / language model | model / model językowy | ⚠ standard, not isolated as a headword |
| Hallucination | halucynacja | ⚠ unsourced (loan-calque, standard in PL AI press) |
| Fine-tuning | strojenie / dostrajanie | ⚠ unsourced |
| Inference | wnioskowanie | ⚠ unsourced |
| Embedding | osadzenie / wektor osadzeń | ⚠ unsourced |
| Token | token (loanword) | ⚠ unsourced |

Treat the ⚠ rows as **field usage to confirm against a single frozen house glossary** (turing.pl +
sztucznainteligencja.org.pl/slownik as bases) before shipping. Project coinages (C1) keep their
original spelling and are owned by the term-sheet, not this table.

Sources: <https://sjp.pwn.pl/sjp/sztuczna-inteligencja;2466532.html> ·
<https://turing.pl/wiedza/sztuczna-inteligencja/slownik-pojec-ai> (industry glossary — not an
academy; the AI/ML rows) · sztucznainteligencja.org.pl/slownik (recommended second reference glossary)

---

## 7. Idiom anti-patterns

**Stock phrases of educational and technical writing (EN → PL): idiomatic form ✅ vs literal calque
❌.** These are the phrases that actually recur in course copy, UI help, and documentation. Idioms
almost never survive word-for-word into Polish — translate the *function/register*, then check
whether Polish has a fixed *frazeologizm*. Prefer the idiomatic column; the calque column is what a
naive translation produces and must be avoided.

**Evidence tiers in this table.** The second research dossier delivered these rows with **no
per-row citation** and said so itself ("these are idiomatic renderings rather than direct dictionary
citations, so the phrase choices are mostly **unsourced** from the retrieved pages"). Rather than
ship that hedge unchanged, **every ✅ was taken back to a source** — the PWN dictionary and its
Korpus Języka Polskiego, the Polish Wiktionary, the University of Warsaw's neologism observatory,
and gov.pl's own plain-language pages. The tier column records what was found. **Only `dictionary`
rows may inform a §11 check**; `corpus` rows evidence usage, not prescription; `⚠ craft` rows stay
barred from tooling.

| # | English phrase | ✅ Idiomatic Polish | ❌ Literal calque (wrong) | ✅ tier |
|---|---|---|---|---|
| 1 | step by step | **krok po kroku** | *(none — see below)* | dictionary (community) + corpus |
| 2 | under the hood | **pod maską** | *pod kapturem* — *kaptur* is the hood of a **coat**; it has no mechanical sense at all | **dictionary** + corpus |
| 3 | at a glance | **na pierwszy rzut oka** | *(none — see below)* | dictionary (community) + corpus |
| 4 | in plain language | **prostym językiem** (with a verb) · **w prostym języku** (of the text itself) | *(none — this is a slot rule, see below)* | corpus (incl. gov.pl) |
| 5 | on the fly | **w locie** (technical) · **na bieżąco** | *na locie* — grammatical, but **only ever governed** (*polegać na locie*); never the adverbial | corpus (technical) + dictionary (community) |
| 6 | rules of thumb | **zasady ogólne** / **praktyczne wskazówki** | *reguła kciuka* — a real calque, **but a recorded headword** marked *środ.*: jargon, not an error | dictionary (community) + corpus |
| 7 | out of the box | **od razu gotowy do użycia** · **po wyjęciu z pudełka** | *z pudełka* — ⚠ craft: clipped, reads as a literal box | corpus + IT glossary |
| 8 | keep in mind | **mieć na uwadze** | *trzymać w głowie* — ⚠ craft: unattested, not condemned | **dictionary** + corpus |
| 9 | boils down to | **sprowadza się do** | *gotuje się do* — **a true false friend**: good Polish meaning "prepares for" | **dictionary** + corpus |
| 10 | in a nutshell | **w skrócie** | *w orzeszku* — ⚠ craft | dictionary (community) + corpus |

**The ✅ column, sourced.** Quotes below are verbatim from the URLs in the Sources footer; corpus
counts are hits in the PWN Korpus Języka Polskiego, whose search is lemma-based (so a zero is
strong evidence, and a count is generous):

- **pod maską** — the Wiktionary entry for *maska* gives "część przednia samochodu, pod którą
  znajduje się silnik", and Polish technical prose carries the software metaphor in the same
  quotation marks English uses: pl.wikipedia, *Intel Pentium* — "nowa wersja układu Presler
  znajdującego się „pod maską”". 59 corpus hits.
- **na pierwszy rzut oka** — Wiktionary: "o wstępnej, pochopnej ocenie: na oko, pozornie, bez
  głębszej analizy". 204 corpus hits.
- **prostym językiem / w prostym języku** — both are gov.pl's own wording, four paragraphs apart on
  the same page: "Chcesz pisać **prostym językiem**?" and "Dzięki temu, że tekst jest
  **w prostym języku**, czytelnik: szybko znajduje informację". See the slot rule below.
- **w locie** — corpus-fixed in Polish technical writing, always in quotation marks:
  pl.wikipedia, *NTFS* — "kompresja danych „w locie”"; *TrueCrypt* — "szyfrowanie całych partycji
  „w locie”". ⚠ PWN does **not** lexicalize *w locie* as an idiom — a lookup redirects to the
  separate idiom **w lot** «natychmiast, szybko». So *w locie* is live technical metaphor, not a
  dictionary idiom; **na bieżąco** is the one with an entry ("w sposób cechujący się każdorazowym
  aktualizowaniem danej czynności", 225 corpus hits).
- **zasady ogólne / praktyczne wskazówki** — the Polish Wiktionary's own gloss of the *English*
  headword *rule of thumb* is essentially this column: "regułka, zasada, praktyczna wskazówka".
- **mieć na uwadze** — Wiktionary: "uwzględniać daną kwestię", synonyms "brać pod uwagę … 
  uwzględniać"; PWN lists it under *uwzględniać*. 110 corpus hits.
- **sprowadza się do** — PWN, entry *sprowadzić się / sprowadzać się*: "«stać się czymś, przestać
  różnić się od czegoś, ograniczyć się do czegoś»". 260 corpus hits.
- **w skrócie** — Wiktionary: "pot. zwięźle, w paru słowach". 182 corpus hits. Its gloss of the
  English *in a nutshell* is "w kilku słowach, zwięźle, streszczając, krótko mówiąc" — and mentions
  no nut.
- **po wyjęciu z pudełka** — the actually-attested Polish rendering of "out of the box":
  pl.wikipedia, *Linux* — "dystrybucji, która działałaby po „wyjęciu z pudełka”"; a Polish IT
  consultancy glossary defines OOTB as "funkcja dostępna jak „po wyjęciu z pudełka”". It has been
  added to ✅ because *od razu gotowy do użycia* is a paraphrase, not the idiom.

**⚠ The ❌ column is mostly craft — and it is the column that matters most.** A wrong calque is what
actually stops a translator making the error, and it is the least attestable thing here, because
dictionaries record what people write rather than the plausible-looking forms they might write. Only
**three** cells survive with real support, and each for a different reason:

- **Row 2 is the strongest, by lexical contrast.** The Wiktionary entry for *kaptur* has exactly two
  senses — "kraw. część płaszcza, kurtki lub bluzy służąca jako nakrycie głowy" and a figurative
  monastic one. No vehicle sense exists, and every corpus and encyclopedia hit is a literal cloth
  hood over a face. *Pod kapturem* is therefore not merely unidiomatic; it names the wrong object.
- **Row 9 is the best teaching cell in the table.** *Gotować się do* is perfectly good Polish that
  means **"to prepare oneself for"** — pl.wikipedia and the PWN corpus give "naród polski winien
  gotować się do nowej walki o niepodległość". The calque therefore does not produce nonsense; it
  produces a confident, fluent, wrong sentence. That is the trap worth printing.
- **Row 5 was narrowed.** *Na locie* is not gibberish: it has 33 corpus hits, all of them governed
  by a verb or adjective (*polegać na locie*, *koncentrować się na locie*). It simply never
  functions as the adverbial "on the fly". The cell now says that rather than "wrong".

Everything else in that column is **⚠ craft**: no Polish *kalki językowe* advice page, and no
Poradnia PWN answer, could be found naming any of these forms as an error. *Trzymać w głowie* and
*w orzeszku* return **zero** idiomatic hits in both the PWN corpus and Polish Wikipedia and have no
dictionary entry — good grounds for avoiding them, weak grounds for calling them documented
mistakes. **Do not promote the ❌ column into a §11 check.**

**Three ❌ cells were removed, because they condemned correct Polish or taught the wrong lesson.**

- **Row 1** flagged ❌ *krok za krokiem*. It is ordinary literary Polish — 48 PWN-corpus hits and
  half a dozen Wikipedia articles ("koalicja antyfrancuska … była nawet krok za krokiem wypierana";
  "*Arse* krok za krokiem piął się w górę"). It is a **different idiom**, with a more processual,
  often adversarial flavor, not a calque. *Krok po kroku* remains the better default for
  instructional copy; it is no longer the only permitted form.
- **Row 3** flagged ❌ *na jeden spojrzenie*. The immediate defect in that string is **gender
  agreement**, not calquing: *spojrzenie* is neuter (Wiktionary: "rzeczownik, rodzaj nijaki"), so
  the numeral would have to be *jedno*. A reader would take away that the phrase is the problem when
  the problem is a declension blunder — and the repaired *na jedno spojrzenie* is not a plausible
  English calque either. Removed rather than patched.
- **Row 4 was the most consequential.** The row previously flagged ❌ *w prostym języku* while
  invoking the gov.pl **prosty język** program — but that program's own guidance uses **both**
  forms, on one page. They are not competitors; they fill different grammatical slots:
  - **instrumental *prostym językiem*** = manner adverbial on a verb of writing or speaking —
    *pisać / mówić / napisane **prostym językiem***;
  - **locative *w prostym języku*** = attribute of the artifact — *tekst **w prostym języku***,
    *formatować tekst **w prostym języku***.
  ⚠ Note also that the flagship page `gov.pl/web/sluzbacywilna/prosty-jezyk`, cited elsewhere in
  this guide, contains **neither** inflected form — only the program name *Prosty język* and the
  genitive *zasady prostego języka*. The quotes above come from the `redakcyjne-abc` guidance page.
- **Row 6 was reworded rather than removed.** *Reguła kciuka* is the one form in this table a source
  names a calque outright — the University of Warsaw's neologism observatory records it with
  "&lt;kalka z ang. rule of a thumb&gt;". But the same source **admits it as a headword**, marked
  **środ.** (środowiskowy — restricted to a professional milieu, here finance and valuation) and
  defined "praktyczna zasada postępowania; reguła stosowana w określonej dziedzinie". With zero
  general-corpus hits, avoiding it in educational prose is right; calling it flatly wrong is not.
  The accurate teaching point is **register**.
- **Row 7 was reworded too.** No style guide condemns bare *z pudełka*, and the licensed Polish form
  differs from it by two words. It is clipped IT jargon that reads as a literal box outside
  developer talk — a precision note, not an error.

**General proverbs — sourced, but off-domain for this platform.** Two pairs from an earlier revision
rest on search summaries and are kept because the evidence is real, though a course translator will
rarely need them: *it's raining cats and dogs* → **leje jak z cebra** (not *pada kotami i psami*) ·
*a piece of cake* → **bułka z masłem** (not *kawałek ciasta*, which misses "easy"). Also worth
knowing: *trzymam kciuki* ("I hold my thumbs") is the Polish "fingers crossed".

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: <https://en.bab.la/dictionary/english-polish/it-s-raining-cats-and-dogs> (search summary,
*leje jak z cebra*) · <https://www.diki.pl/slownik-angielskiego?q=piece+of+cake> (**403 — search
summary only**, *bułka z masłem*) · **✅-column attestations, each fetched and quoted above** —
<https://sjp.pwn.pl/szukaj/sprowadza%C4%87%20si%C4%99.html> ·
<https://sjp.pwn.pl/szukaj/w%20locie.html> (which is why *w locie* is marked live metaphor, not a
PWN idiom) · <https://sjp.pwn.pl/szukaj/mie%C4%87%20na%20uwadze.html> ·
<https://pl.wiktionary.org/wiki/maska> · <https://pl.wiktionary.org/wiki/kaptur> ·
<https://pl.wiktionary.org/wiki/na_pierwszy_rzut_oka> ·
<https://pl.wiktionary.org/wiki/mie%C4%87_na_uwadze> · <https://pl.wiktionary.org/wiki/w_skr%C3%B3cie> ·
<https://pl.wiktionary.org/wiki/in_a_nutshell> · <https://pl.wiktionary.org/wiki/rule_of_thumb> ·
<https://pl.wiktionary.org/wiki/na_bie%C5%BC%C4%85co> · <https://pl.wiktionary.org/wiki/spojrzenie>
(community-tier dictionary — recorded as such, not laundered) ·
<https://nowewyrazy.uw.edu.pl/haslo/regula-kciuka.html> (Obserwatorium Językowe UW — the one source
naming a ❌ form a calque, and simultaneously admitting it as a *środ.* headword) ·
<https://www.gov.pl/web/redakcyjne-abc/najwazniejsze-zasady-prostego-jezyka> (both *prostym
językiem* and *w prostym języku*, on one page — the basis of the §7 slot rule) ·
corpus counts and examples from the PWN Korpus Języka Polskiego
(<https://sjp.pwn.pl/korpus/szukaj/krok%20za%20krokiem.html>,
<https://sjp.pwn.pl/korpus/szukaj/trzyma%C4%87%20w%20g%C5%82owie.html>,
<https://sjp.pwn.pl/korpus/szukaj/gotuje%20si%C4%99%20do.html> and the other rows' searches) and
from <https://pl.wikipedia.org/wiki/Intel_Pentium>, <https://pl.wikipedia.org/wiki/NTFS>,
<https://pl.wikipedia.org/wiki/TrueCrypt>, <https://pl.wikipedia.org/wiki/Linux> — corpus tier:
Polish technical and encyclopedic prose, **not** a normative source ·
<https://evolpe.pl/glosariusz/ootb-out-of-the-box/> (Polish IT consultancy glossary, community-tier)
· the rows themselves came from the second research dossier, which supplied them with no dictionary
citation and labeled them "mostly unsourced" itself · **the ❌ column remains ⚠ craft** apart from
rows 2, 5, and 9, and is barred from §11; native-speaker confirmation still pending for every row.
Fetch failures, for the record: `diki.pl` 403 (as above), `translatica.pl` served an **expired TLS
certificate**, and WSJP (`wsjp.pl`) could not be reached by word — its search returns HTTP 500 — so
**no WSJP evidence is claimed anywhere in this section**

---

## 8. Simplified-language pendant (`pl-easy`)

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

**Read this before §8c: Polish has the norm, and lost the corpus.** The two halves of this section
have very different strength and must not be averaged. **§8a and §8b stand:** Polish has a codified
plain-language norm with its **own national sentence-length figure**, a named morphological rule, a
university research unit behind it, and a legal driver. **§8c is a negative result:** no Polish
plain-register text could be collected, so **nothing in this section is corpus-backed**. Nothing was
measured, so nothing measured may be reported, and §8d contains no measured reversals. What failed
for Polish is **only the corpus** — none of the sourced material below is weakened by it.

**And the Polish negative has a particular shape, which §8c spells out.** Poland's plain-language
institutions are real, active, and easy to name. What they publish is **style guides, training
material and one-off rewritten official documents** — not an ongoing stream of text in simplified
Polish. That is why there is nothing to collect: not a missing website, but an **output shape**.

### 8a. The standard — Polish DOES have a codified plain-language norm

**Tradition & standard.** Polish has a recognized **"prosty język"** movement now anchored to an
international standard: "Prosty język rozwijał się jako ruch społeczny od początku XX wieku. Od roku
2023 jest jednolitym, międzynarodowym standardem **ISO 24495-1**." There is a legal driver — "banki
muszą używać w stosunku do konsumenta języka, którego trudność nie przekracza poziomu biegłości
**B2**." Note the two layers: (1) international **ISO 24495-1** (adopted for Polish), and (2)
**gov.pl "prosty język"** operational rules for public administration. There is **no single
legally-mandated national style guide for all content** (editorial), but banks/public bodies are
increasingly bound.

⚠ **Two things this guide has *about* rather than *from*.** **ISO 24495-1's own text was not read
here** — the claim above is quoted from a Polish source describing it, so **no requirement or
threshold from the standard itself may be cited**, and `pl-easy` must never be described as
conforming to it. The **B2 ceiling** is likewise recorded as a legal fact about banking language;
applying it would need a **CEFR-graded Polish word list**, and none is cited in this guide.

**Key org.** The **Pracownia Prostej Polszczyzny (Uniwersytet Wrocławski)** — "jednostka badawcza
Uniwersytetu Wrocławskiego. Działa od 2010 roku", uses a method "o nazwie MSPR", and is "jedyna w
Polsce uczelnia, która przyznaje certyfikaty prostego języka." ⚠ **Only the method's name is
recorded**; what MSPR measures or prescribes was not established here.

**How `pl-easy` relates to the kit's base rules.** `pl-easy` inherits the kit's base
simplified-language rules from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) —
one idea per sentence, SVO-simple structure, everyday words, digits as digits, a one-line "what is
this" opener, a consistent literal tone — **but overrides the sentence-length target with the
Polish national figure (15–20 words, §8b)** and holds the recorded **ty** register steadily
throughout (no drift to Pan/Pani for "formality", no drift within a screen).

**Term-preservation (restated, binding).** In `pl-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Use the same Polish term as the base variant, then "to
znaczy: …", then a concrete example (e.g. keep **sieć neuronowa**, then explain it in plain
Polish).

### 8b. Name the axis — the Polish norm states it in four rules, and one of them is a claim about words

**Quantitative and structural rules (gov.pl, verbatim).** These are a genuine *national* pendant —
`pl-easy` uses them **instead of** falling back to the kit's generic figures where they differ:

- **Sentence length:** "Twórz krótkie zdania – do **15-20 wyrazów**." (Polish's own number — use
  it, not the kit's generic ~8–12-word target.)
- **Personal address:** "Pisz do ludzi, często używaj form osobowych. Do odbiorcy zwracaj się
  bezpośrednio…" — aligns with the recorded **ty** register (§4), and see §8e for what it does and
  does not settle.
- **Avoid nominalizations:** "Unikaj rzeczowników odczasownikowych. To te, które kończą się na
  –anie, -enie, -cie."
- **Short/plain words:** "Wybieraj krótsze i prostsze słowa, nie te rozbudowane, wielosylabowe,
  obcobrzmiące."
- Readability tooling used in Poland (editorial): **Jasnopis.pl** and **Logios.dev** score text
  difficulty. ⚠ Neither has been run on `pl-easy` copy in this project.

**So the axis, as the tradition itself states it, has three structural terms and one lexical term.**
Sentence length, personal forms, and the absence of verbal nouns are **structural and checkable**;
the fourth rule is a **claim about individual words** — that the plainer pole is the shorter, the
less polysyllabic and the **less foreign-sounding** one. That fourth rule is the load-bearing
assumption under the word table below, it is **the norm's claim and not this guide's**, and it is
also the exact claim §8d flags as unverified for Polish.

**The nominalization rule is the highest-leverage of the four**, because it changes sentences rather
than tokens: unwinding a verbal noun back into a verb usually shortens the sentence as a
by-product, which feeds the first rule too.

**Complex → everyday word table.** Officialese → everyday, the substitution `pl-easy` makes.
Provenance is marked per row; the four ✓ rows are sourced from Sektor 3.0, the ⚠ rows are standard
editorial substitutions — use as a candidate list, not canon. **No row has been counted** (§8c).

| Complex / officialese | Everyday | Provenance |
|---|---|---|
| dokonać oceny | ocenić | Sektor 3.0 ✓ — and the only row with **two** supports: it unwinds a light-verb-plus-noun frame, the shape the gov.pl nominalization rule targets (⚠ though *ocena* is not one of the –anie/-enie/-cie suffixes gov.pl names) |
| w dniu dzisiejszym | dzisiaj | Sektor 3.0 ✓ |
| uiścić (opłatę) | opłacić / zapłacić | Sektor 3.0 ✓ |
| niniejszy / przedmiotowy | ten / ta / to | Sektor 3.0 ✓ |
| albowiem / bowiem | bo / ponieważ | ⚠ editorial |
| posiadać | mieć | ⚠ editorial |
| w przypadku gdy | jeśli / gdy | ⚠ editorial |
| celem / w celu (dokonania) | żeby / aby | ⚠ editorial |
| dokonać zakupu | kupić | ⚠ editorial — same unwinding shape as the first row, without the Sektor 3.0 support |
| w związku z powyższym | dlatego | ⚠ editorial |
| przedłożyć dokument | złożyć / dać dokument | ⚠ editorial |
| stanowi | jest | ⚠ editorial |

### 8c. Measure the axis — the honest negative, and why it is the firmest of the three in this batch

**What was sought.** The design this kit uses elsewhere: **one publisher, two editions of the same
material**, one standard and one plainer, so that register is the only thing that differs. Failing
that, any standalone Polish publication written at a stated plainer reading level. **Neither was
obtained**, so no Polish count exists and none is reported below. There are **no frequencies and no
corpus sizes for simplified Polish** in this section, because no such corpus was built.

**Two different reasons a candidate failed, and they must not be blurred.**
**(i) No plain-language publication exists there** — the source is reachable, but nothing on it is
written at a plainer reading level. **(ii) The publisher declines automated text collection**, or
directs it to a different channel — the material exists, and the publisher's stated position governs
how it may be obtained. **(ii) is a publisher's position, and this guide records it as settled:
nothing here may be read as a route around one, and no such route is described.**

| Candidate | Outcome | Which reason |
|---|---|---|
| `gov.pl` "prosty język" — the government program's own pages | **no dedicated article hub exists**: one plausible path redirects to the gov.pl front page, another returns not-found. The program publishes **rules**, not a body of text written under them | **(i)** |
| Polish Wikinews (`pl.wikinews.org`) | fails on **two independent grounds**. It is **not plain language** — standard journalistic Polish, so at best a standard-register cross-check, never the plain half of a pair. And its **live enumeration path sits inside a blanket disallow** in the collection policy, with only narrow carve-outs; the publisher's sanctioned route for bulk text is its own dump service, not live queries. Confirmed reachable, and it reports **24,393 articles** | **(i)** + **(ii)** |
| Polish Wikibooks (`pl.wikibooks.org`), including the children's topical books | same collection-policy position as above, and additionally **too small and off-genre**: roughly **16 topic books**, not article-level content and not news, so nothing to pair an encyclopedic or journalistic standard against | **(i)** + **(ii)** |
| Government and foundation **ETR** material (*Tekst Łatwy do Czytania i zrozumienia*) | **known to exist** — and this is the important row. What exists is **one-off translated documents and laws**, not an enumerable ongoing corpus; **no live enumerable endpoint could be located at all** | **(i)**, for a *corpus*; the texts themselves are real |

**🔴 The shape of the Polish negative, and why it is the firmest of the three in this batch.** For
Ukrainian and Danish the finding is largely that hosts did not resolve or publishers declined. For
Polish the finding is **about what the tradition itself publishes**: the Pracownia certifies texts,
gov.pl publishes rules, ETR foundations rewrite individual documents — and **none of them runs an
ongoing publication in simplified Polish**. There is no Polish counterpart to the Norwegian or
Swedish easy-language newspapers. That is a structural absence, not a scouting miss, and it will not
be overturned by finding one more domain.

**✅ The weakness this section declared has been closed, and the finding held.** The first pass had
no search available and probed candidates recalled from general knowledge — a narrower net than a
survey, and flagged as such. A second pass with search (2026-07-29) re-ran it. **No ongoing
publication in simplified Polish was found, and the structural claim above is confirmed rather than
overturned**: what the search returns is exactly the shape §8c predicted — individual public bodies
publishing an **ETR page about themselves** (state archives, a regional fire service, a university
accessibility office), i.e. **one rewritten document at a time, per institution, with no stream and
no index**. Of the four languages in this kit whose §8c reported a weak negative, **Polish is the
one whose negative survived the search**. It is also the one whose §8g route (item 1) the search
made more concrete, not less: the rewrites are real, they are on public-sector domains, and each
has an original.

**⚠ What remains unverified:** whether any of those institutions publishes the *original* alongside
its ETR version in a form that can be paired automatically, and whether the certification body of
§8a publishes before-and-after texts (§8g item 2). Neither was settled here.

**What follows for the rest of §8.** With no corpus: §8b's four norm rules stand on gov.pl's own
wording and are **untested here on real copy**; §8b's word table stands unmeasured and unrefuted;
§8d may not report a single measured reversal; and §8e rests on the norm plus §4's recorded
decision, not on anything counted here.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none may be invented to fill the gap.** What this list can
do is separate the sourced from the unsourced, keep each sourced rule inside the claim it actually
makes, and carry in one caution established across the languages in this kit that *were* measured.

| Do **not** do this | Why |
|---|---|
| ~~treat "obcobrzmiące" as settling any individual row~~ | ⚠ **This is where the norm and a cross-language finding disagree, and neither can win here.** The gov.pl rule states that the plainer word is the shorter, less polysyllabic, less foreign-sounding one (§8b). Across the languages in this kit where a count *was* possible, the learned or borrowed member of a pair turned out **not to be reliably the harder one**, and a confident "simplification" repeatedly swapped a common word for a **rarer** one. Polish has no count (§8c), so: **follow the norm as the local authority for the general direction, and verify every individual substitution locally** — a borrowing a Polish reader meets daily is not made easier by replacing it with a rarer native word. |
| ~~cite the eight ⚠ editorial rows as prosty-język doctrine~~ | Only *dokonać oceny → ocenić*, *w dniu dzisiejszym → dzisiaj*, *uiścić → opłacić / zapłacić* and *niniejszy / przedmiotowy → ten / ta / to* carry a source (Sektor 3.0, §8b). The other eight are standard editorial substitutions. Never present them to a reviewer as gov.pl's or the Pracownia's wording. |
| ~~take the longer member of an "everyday" pair without thinking~~ | ⚠ craft, and the norm's own rules can pull against each other here. *albowiem / bowiem → bo / ponieważ* offers **bo**, which is shorter, and **ponieważ**, which is **longer than the formal word it replaces** — so the short-word rule and the everyday-word rule point different ways on one row, and no count exists to settle it. Prefer the short member unless the sentence genuinely needs the longer connective. |
| ~~swap one abstract noun for another and call the nominalization rule satisfied~~ | gov.pl's rule is "Unikaj rzeczowników odczasownikowych" — **unwind the verbal noun into a verb** (*dokonać oceny* → *ocenić*, *dokonać zakupu* → *kupić*). Replacing one noun with another leaves the frame standing, and the frame is what makes the sentence long. This is the highest-leverage edit in Polish easy language (§8b). |
| ~~claim conformance to ISO 24495-1 or to the B2 ceiling~~ | ⚠ The standard's **own text was not read here** (§8a), so no requirement from it may be quoted. The **B2 ceiling** is a legal fact about banking language, not an instrument this guide can apply: doing so needs a **CEFR-graded Polish word list**, and none is cited. Both are context. |
| ~~read a Jasnopis or Logios score as validation of this section~~ | ⚠ Both are recorded as editorial mentions (§8b) and **neither has been run on `pl-easy` copy**. A tool score is not the norm and is not evidence for any row of the word table. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **sieć neuronowa**, then "to znaczy: …", then a concrete example. With no corpus, explaining a hard word is the lexical move that rests on a stated rule rather than on judgment. |
| ~~read §8c as proof that no simplified Polish text exists~~ | It is proof that **no enumerable ongoing corpus of it exists**, and that **none was found under constrained tooling** (§8c). ETR rewrites of individual documents demonstrably **do** exist — they are just not published as a collectable series. §8g says what to do with that. |
| ~~work around a publisher's stated collection position~~ | The Wikimedia sources in §8c direct bulk text collection to their own dump service rather than to live queries. That is the publisher's position and it is recorded as settled, not as an obstacle with a technical answer. |

> **→ The rule that follows.** For Polish, **the structural rules are sourced and the word list is
> mostly not.** Apply the 15–20-word sentence figure, the nominalization rule, and the personal-forms
> rule with confidence; apply the four ✓ rows as advice and the eight ⚠ rows as hints; and treat the
> norm's short-and-native preference as a **direction**, not as a verdict on any individual pair.

### 8e. 🔑 The address decision — `pl-easy` keeps **ty**, and the norm supports part of that

> **Decision, recorded so that nobody "fixes" it: `pl-easy` uses `ty`, exactly as `pl` does (§4).
> Pan/Pani is not mixed in, and never within one screen.**

- ✅ `pl-easy` (ty): **Zaloguj się.** · **Sprawdź, ile już umiesz.**
- ❌ Pan/Pani drifting into the same surface: **Proszę się zalogować, jeśli Pan sobie życzy.**

**Part of this is norm-level, and part of it is the project's — keep the two apart.** The
**norm-level part**: gov.pl's plain-language rules explicitly require direct personal address —
"Pisz do ludzi, często używaj form osobowych. Do odbiorcy zwracaj się bezpośrednio i pisz o swojej
instytucji „my”" (§8b). That is a sourced instruction to write in personal forms and to address the
reader directly, and it rules out the impersonal officialese register outright.

⚠ **What the norm does not settle is `ty` versus `Pan/Pani`.** Pan/Pani is also direct address; it
simply takes third-person agreement (§4). The rule above therefore supports *personal, direct*
address without choosing between the two Polish registers. **The choice of `ty` is §4's recorded
human-gated project decision**, argued there on the warm book-companion tone and on modern Polish
e-learning usage — and §4 marks that usage argument as **editorial, not an authority claim**. §4 also
records that **Pan/Pani remains the safe default in institutional, official, and adult-professional
contexts**, and that the two registers are never mixed on one screen. Nothing in §8 strengthens or
weakens any of that; the decision is carried over as recorded.

**⚠ The measurement cannot answer this question, in either direction** — there is no measurement
(§8c). And the shortcut to refuse is the one other guides in this kit had to refuse: reading a
**children's** publication's address register as evidence about an easy-read variant for adults.
Across the measured languages, address was found to track **the reader's age, not the text's
difficulty**. `pl-easy` addresses adults who read with difficulty, so the register is held for the
reasons §4 gives, not because `ty` is assumed to be the "simpler" pronoun.

### 8f. What `pl-easy` is built on, in order of leverage

1. **The nominalization rule — the highest-leverage edit.** "Unikaj rzeczowników odczasownikowych"
   (§8b), applied as a rewrite rule: unwind the verbal noun back into a verb. It changes sentences,
   not tokens, and it shortens them as a by-product, which feeds rule 2.
2. **The Polish sentence-length figure — 15–20 words** (§8b), which **overrides** the kit's generic
   ~8–12-word target. It is the national number, quoted verbatim, and it is the one quantitative
   lever Polish contributes.
3. **Personal forms and direct address** (§8b), which is a structural rule as much as a register one:
   it removes the impersonal officialese frame that makes Polish administrative prose long.
4. **The kit's base plain-language rules** from
   [accessibility-workflow](../accessibility-workflow.md), for everything gov.pl does not cover
   (§8a) — one idea per sentence, say what *is* not what *isn't*, the same word for the same thing,
   a one-line "what is this" opener, a consistent literal tone.
5. **Term preservation before substitution** — keep the technical term, then "to znaczy: …", then an
   example (§8a). With no corpus, this is the safest lexical move in the section.
6. **The ty register (§4), held steadily** (§8e), with no Pan/Pani mixed into one surface.
7. **Vocabulary substitution last** — four ✓ rows applied as advice, eight ⚠ rows as hints, and a
   native-speaker pass treated as a prerequisite rather than a polish (§8b, §8d).
8. **ISO 24495-1, the B2 banking ceiling, and the Pracownia's MSPR method are context, not rule
   sets** (§8a). None of their texts or instruments is in hand here, and `pl-easy` must not be
   described as conforming to any of them.

### 8g. What is still open

1. **The corpus that would settle this — and for Polish the raw material demonstrably exists.**
   §8c established that ETR foundations and public bodies **rewrite individual official documents
   and laws** into a plainer Polish. Each such rewrite has an **original**. Pairing a rewritten
   document with the source document it was made from gives exactly the shape this kit wants: **one
   topic, one institution, register the only variable** — no publisher confound, no genre confound.
   Even a few dozen pairs would be the first real Polish measurement, and would test §8b's word
   table directly. What is missing is not the texts but a **published, enumerable collection** of
   them.
2. **The certification body is the other obvious place to look.** The Pracownia Prostej Polszczyzny
   certifies texts as plain Polish (§8a). ⚠ Whether it publishes before-and-after versions of what it
   certifies was **not established here** — but if it does, those are the same confound-free pairs as
   item 1, produced under the national norm itself.
3. **A single Polish publisher issuing standard and prosty-język editions of the same material**
   remains the ideal and none was found (§8c).
4. **The search was never run** (§8c). A later pass with search available should look for ETR
   publishers with a document index, for public bodies that publish a plain version alongside the
   original, and for any Polish easy-language periodical.
5. **The word table has not had a native-speaker pass.** Eight of twelve rows are ⚠ editorial, and
   the norm's short-and-native preference has not been checked against any Polish frequency data
   (§8d). This is the largest editorial debt in the section.
6. **The readability tools have never been run on `pl-easy` copy** — Jasnopis and Logios are recorded
   but unused (§8b). Scoring real copy needs no corpus and is the smallest useful piece of work here.
7. **ISO 24495-1's text was not read, and the MSPR method is only a name** (§8a). Whether either
   carries numeric thresholds that would change §8b is unknown.
8. **The B2 ceiling cannot be applied without a CEFR-graded Polish word list**, which this guide does
   not have (§8a, §8d).
9. **No comprehension evidence exists for any of this.** The norm's rules are about sentence length,
   morphology, and word choice; whether the forms they reward are actually *understood* better by the
   `pl-easy` audience was not established here.

Sources: <https://prostapolszczyzna.uwr.edu.pl/> ·
<https://www.gov.pl/web/sluzbacywilna/prosty-jezyk> ·
<https://sektor3-0.pl/blog/prosty-jezyk-czyli-jak-pisac-w-zrozumialy-sposob/> ·
register evidence and the recorded decision in §4 · complex→everyday pairs: four rows Sektor 3.0 ✓,
eight ⚠ editorial (§8b) · ⚠ **ISO 24495-1 cited *about*, never *from*** — its text was not read
(§8a) ·
**Corpus (§8c) — none.** No Polish plain-register corpus was built, so this section reports no
frequency and no corpus size for simplified Polish. The candidates probed, the two reasons they
failed, the publishers' stated collection positions, and the ⚠ constrained tooling under which the
null was reached are recorded in §8c; the kit's base rules in
[accessibility-workflow](../accessibility-workflow.md) govern `pl-easy` wherever gov.pl's rules do
not.

---

## 9. Regional variation

**Which standard the project targets.** The supra-regional, universal variety — **język ogólny**
(ogólnopolski / literacki) — is the norm for content: "Podstawową odmianą jest język ogólny, zwany
też ogólnopolskim lub ogólną odmianą polszczyzny, która ma charakter uniwersalny." Dialects /
*gwary* are not the general standard.

**No locale fork.** Polish is remarkably standardized: **one neutral written standard used
nationwide and for the diaspora — CLDR has no `pl-PL` vs `pl-XX` split.** "Neutral" = *język
ogólny*, no regional lexis, plain register. **There is essentially no locale fork to maintain for
Poland** — good news for i18n.

**Regionalisms to keep out of neutral copy.** Regionalisms are norm-approved locally but flag
origin — "mieszkańcy Krakowa używają zwrotu **wyjść na pole**, zamiast ogólnopolskiego **wyjść na
dwór**." Silesian (*ślōnski*) and Kashubian are separate ethnolects, not neutral Polish.

- ✅ neutral: **na dwór**, **bułka**, standard *język ogólny*.
- ❌ region-marked in neutral UI: **na pole** (Kraków/południe), Silesian/Kashubian forms.

*(The dialekt/gwara-vs-regionalizm distinction rests on a **⚠ secondary/summary** source; the
*na pole / na dwór* pair and the "one standard" ruling are sourced.)*

**Neutrality strategy (explicit).** Use *język ogólny* throughout; avoid strongly region-marked
synonyms when an unmarked option exists; keep shared English acronyms (AI, ML) per §6. A single
neutral build serves the whole audience — no per-region parameterization needed.

Sources:
<https://zpe.gov.pl/a/polszczyzna-niejedno-ma-imie-terytorialne-zawodowe-i-srodowiskowe-odmiany-wspolczesnego-jezyka-polskiego/DJ1MxREgK>
(standard-language ruling + *na pole/na dwór* regionalism; dialekt/gwara distinction ⚠ secondary)

---

