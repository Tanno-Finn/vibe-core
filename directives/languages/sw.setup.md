<!-- base -->
# lang-sw — Swahili (Kiswahili) — setup & sources

> **The translation guide itself is [`sw.md`](sw.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Note up front
that Swahili authority is **distributed across national and regional government bodies**, with
**BAKITA (Tanzania)** as the strongest single norm-setter.

- **BAKITA — Baraza la Kiswahili la Taifa (National Kiswahili Council), Tanzania.** The
  government council for Swahili standardization, terminology, and lexicography. Its site lists a
  dedicated **"Istilahi na Kamusi" (Terminology and Lexicography)** function and the flagship
  dictionary **Kamusi Kuu ya Kiswahili** (3rd ed.). This is the guide's primary orthography and
  terminology anchor. **✓ verified this pass** (page confirms government status + terminology/
  dictionary role). <https://www.bakita.go.tz/> ·
  <https://www.bakita.go.tz/index.php/pages/about-us> ·
  <https://www.bakita.go.tz/books/kamusi-kuu-ya-kiswahili-toleo-03>
- **East African Kiswahili Commission (EAKC / Kamisheni ya Kiswahili ya Afrika Mashariki).** The
  intergovernmental **East African Community** body mandated to promote, develop, coordinate, and
  harmonize Kiswahili across the region — the regional counterpart to BAKITA's national role.
  **⚠ URL unverified this pass:** the domain **eakc.go.ke** did not resolve during verification,
  and the EAC repository Protocol PDF 404'd; the EAC's own site confirms it operates **nine
  institutions** but does not enumerate them on the landing page. The Commission is real
  (documented EAC institution, based in Zanzibar); treat the specific URL as *to be confirmed*.
  <https://eakc.go.ke/> · <https://www.eac.int/>
- **National Kiswahili Council of Zanzibar (BAKIZA).** Named in Zanzibar statute text as the
  Zanzibar-level council; **no standalone official BAKIZA/BAKIKE domain was found** in the
  research (⚠). <https://www.zanzibarassembly.go.tz/storage/documents/acts/english/all/1674550430.pdf>
- **Unicode CLDR — `sw` locale** (number, date, time formats; separators; collation). The Unicode
  reference for Swahili web formatting. ✅ **Re-read against CLDR 48.2 (2026-03-17)**, replacing the
  research's **v44–v46** chart citations: `sw` uses a **dot decimal and comma group** (`#,##0.###`)
  and places the **currency symbol before the amount with a non-breaking space** — the separator
  values the research reported were correct, only the version citation was stale. Collation rows
  were **not** read in this pass and remain ⚠ (§10). The chart links are Unicode's version-agnostic
  *latest* permalinks, so they track the current release.
  <https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/sw.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **The Unicode Standard — Basic Latin (U+0000–U+007F) and Latin-1 / Latin Extended** for any
  borrowed names or quoted material; general punctuation guidance (typographic vs ASCII quotes/
  apostrophes). <https://www.unicode.org/charts/PDF/U0000.pdf> ·
  <https://www.unicode.org/reports/tr35/>
- **Noto Sans (Latin)** — a broadly usable open web font with full diacritic and punctuation
  coverage for Swahili's Latin needs. <https://fonts.google.com/noto/specimen/Noto+Sans>
- **Britannica — Swahili language** (high-level reference for word order, noun classes, verb
  morphology, register, and the "used in administration and primary education" claim underpinning
  the educational-register choice). <https://www.britannica.com/topic/Swahili-language>

**Non-primary / weak-provenance sources** the research also leaned on, kept only where a claim is
plausible and marked at point of use: an academic terminology paper describing BAKITA/TUKI(TATAKI)
as the institutional terminologists and the *Ngamizi* ICT list
<https://www.lingref.com/cpp/acal/36/paper1422.pdf>; a Colegio de México study of Standard-Swahili
standardization history <https://ceaa.colmex.mx/archivos/68/cuaderno_12.pdf>; INALCO's language
profile <https://www.inalco.fr/en/languages/swahili>; a software-localization style guide (not a
publisher house style) <https://mozilla-l10n.github.io/styleguides/sw/>; and library/proverb
catalog records for idioms.

**Provenance caveat.** The research (two passes) could **not** locate: a standalone official BAKIKE
domain, a publisher-grade Swahili editorial style guide, a **current authoritative AI/ML glossary
covering the newer concepts**, a **named Swahili plain-language rulebook with quantitative
thresholds**, a Swahili-specific **hyphenation/line-breaking** standard, or a council-issued
**neutral-editorial rule** for religious/community-marked vocabulary. Each of these surfaces below
as a **⚠** at point of use — several are *real absences* (see §6, §8), not research failures.

Sources: <https://www.bakita.go.tz/> · <https://www.bakita.go.tz/index.php/pages/about-us> ·
<https://www.bakita.go.tz/books/kamusi-kuu-ya-kiswahili-toleo-03> · <https://www.eac.int/> ·
<https://www.zanzibarassembly.go.tz/storage/documents/acts/english/all/1674550430.pdf> ·
<https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
<https://cldr.unicode.org/downloads/cldr-48> · <https://www.unicode.org/reports/tr35/> ·
<https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.britannica.com/topic/Swahili-language>
(the EAKC domain <https://eakc.go.ke/> did not resolve this pass and is listed as an authority of
record, not as fetched evidence; the weak-provenance items are listed inline above with their
caveats and are not repeated here.)

---

## 3. Script & typography

**Character inventory & Unicode range.** Modern Standard Swahili is written in the **Latin
script** — ordinary **Basic Latin (U+0000–U+007F)**, plus Latin-1/Latin-Extended code points only
where borrowed names or quoted foreign material demand them. There are **no diacritics** in native
Swahili orthography and **no native digit system** (Western 0–9 throughout, §5). The distinctive
letters are **digraphs** — `ch`, `dh`, `gh`, `kh`, `ng'`, `ny`, `sh`, `th` — written as ordinary
letter sequences, not as special code points.

**Direction & tokenization.** Swahili is **LTR**. Words are **whitespace-separated**, so ordinary
whitespace tokenization and word-based highlighting work with no special handling. **No RTL, no
bidi, no contextual shaping, no combining-mark stacks** — the whole class of Arabic/Indic rendering
risks is absent here.

**The apostrophe in `ng'` (the one real orthographic trap).** The velar nasal is written **`ng'`**
— the digraph `ng` **plus an apostrophe** — and it contrasts with plain `ng`. Dropping the
apostrophe changes the word. The research's named typographic pitfall for Swahili is exactly this
class: **inconsistent handling of apostrophes and curly vs straight quotes across browsers and
input systems.** Two consequences:

- ✅ Right (apostrophe present): **ng'ombe** ("cow"), **ng'aa** ("shine").
- ❌ Wrong (apostrophe dropped): **ngombe**, **ngaa** — a different/incorrect string.

*(The `ng'` contrast is standard Swahili orthography; the specific pairs above are illustrative —
the research did not enumerate orthography rules letter-by-letter, so treat the examples as
correct-form illustrations, ⚠ not a cited rule table.)* **Pick one apostrophe character and hold
it** (§11): the typographic apostrophe **’ (U+2019)** is the polished editorial choice, but it must
be applied **consistently** — mixing `’` and ASCII `'` inside the same corpus is a defect, and a
"smart-quotes" pass that rewrites some `ng'` apostrophes but not others will fragment search and
collation.

**Fonts & known pitfalls.** Any modern Latin web font with good diacritic and punctuation coverage
works (**Noto Sans** is a safe default). The alphabet is **not** the risk; the risk is
**punctuation normalization** — curly quotes, apostrophes, and narrow punctuation rendered or
rewritten inconsistently across systems.

**Punctuation & quotation.** Standard Latin punctuation — comma, `?`, `!`, `:`, `;`, `()`, hyphen,
dash — as in English. For quotation in polished editorial text, Unicode's default guidance favors
**typographic quotes “ ” and ’** over straight ASCII quotes; lower-end systems fall back to ASCII.

- ✅ Editorial: “**Kiswahili Sanifu**” … ng’ombe … (typographic “ ” and ’, applied
  consistently — including the `ng'` apostrophe rendered as ’ throughout).
- ❌ Mixed straight/curly in the same body copy: "Kiswahili" … “Sanifu” … (inconsistent — a
  normalization defect, not a content one).

**The nested (inner) pair is ‘…’** — `alternateQuotationStart` = **‘ U+2018**,
`alternateQuotationEnd` = **’ U+2019** in the CLDR `sw` locale data, read codepoint-by-codepoint
from the pinned **CLDR 48.2** release this session; the same fetch gives the outer pair as
`quotationStart` = **“ U+201C** and `quotationEnd` = **” U+201D**, matching the rule above.

**What that CLDR reading actually is (checked against the source data this pass).** The `sw` locale
file carries **no Swahili-specific quotation data at all**: all four delimiter fields in
`common/main/sw.xml` at the pinned release hold the CLDR **inheritance marker** `↑↑↑`, and the
values above are what `root.xml` supplies. UTS #35 (LDML, v48.2) defines that marker: "*There is a
special Inheritance Marker used in the main repository, which has the value ↑↑↑ … It is used
created during data submission to record that the inherited value has been verified for the current
locale and path*" (quoted verbatim, grammatical slip and all). So the pair is CLDR's cross-locale
default, **recorded as checked for `sw`** rather than authored from a Swahili typographic tradition
— weaker than a language ruling, stronger than nothing, and worth knowing before it is cited as
evidence about Swahili.

**The authority hunt, by name, and what it returned.** ⚠ **Still no Swahili language authority
states the inner pair.** Tried this pass: **BAKITA** (bakita.go.tz) — site reachable, but its
landing page contains **zero** occurrences of *uakifishaji*, *nukuu*, or *alama*; the council
publishes terminology and lexicography (§2), and no punctuation rulebook is reachable from the site.
**EAKC** (eakc.go.ke) — domain still does not resolve. **mwalimuwakiswahili.co.tz**, returned by
search as a punctuation reference — **DNS failure**. **Taifa Leo's own language column**
("UKUMBI WA LUGHA NA FASIHI: Alama za uakifishaji ambazo kila mwandishi anapaswa kuzifahamu")
— fetched and read: it classifies punctuation by function and does rule on capitalization after
quotation marks ("*Tumia herufi kubwa pia baada ya alama za uakifishaji zifuatazo: nukta, kiulizo,
mshangao, alama za nukuu na nukta pacha*"), but it **never names a quotation glyph** and says
nothing about nesting.

**What is sourced instead: attested usage, measured.** Three reputable Swahili publications, **20
articles, ~120,000 characters of article body text** (`<p>` text only), counted by codepoint this
pass:

| Publication | “ U+201C / ” U+201D | ‘ U+2018 / ’ U+2019 | ASCII `"` / `'` |
|---|---|---|---|
| Taifa Leo (Nation Media Group, KE) — 8 articles | 26 / 26 | 4 / 6 | 0 / 8 |
| Mwananchi (TZ) — 6 articles | 4 / 4 | 0 / 6 † | 30 / 0 |
| BBC Swahili — 6 articles | 0 / 0 | 8 / 8 ‡ | 80 / 107 |

† Read those six with the raw text in hand: **every one of Mwananchi's `’ U+2019` is inside an
English subscription banner** ("Don't miss out on the great content…"), not Swahili copy. A census
that only totals codepoints will report page furniture as house style. ‡ BBC Swahili's eight pairs
are all headline links in a repeated sidebar (‘asitisha’, ‘yana tija’), not article body — real
usage, but promotional-headline usage, not running prose.

Two things fall out. **(1) The single-inside-double *structure* is corroborated.** BBC Swahili
carries five quote-within-quote spans in six articles, every one of them a single mark inside a
double one — e.g. `"Baadaye nilimuuliza mmoja wao, 'Kwa nini hukusema lolote?'"` — which is the
shape CLDR prescribes, and no counter-shape appears anywhere in the sample. **(2) The *glyph*
choice is not settled by usage.** Taifa Leo sets its direct speech in typographic **“ ”** and
reserves the single pair for terms and titles (**‘Knockout’**, **‘mumps’**); Mwananchi and BBC
Swahili mostly ship ASCII. So this guide's editorial rule — typographic marks, held consistently
(§11) — is a **house choice among attested house choices**, not a deviation from a norm and not a
norm itself.

**A measured confirmation of the apostrophe collision below — in one publication, from one
character.** Taifa Leo's six `’ U+2019` split **three and three**: three are the `ng'` apostrophe
(**Mihang’o**, **ng’ambo**, **Matiang’i**) and three are closing single quotation marks
(**‘Knockout’**, **‘mumps’**, **‘Tutam’** — the first in running prose, the other two in headline
text). One codepoint, two jobs, inside one publication's pages — which is exactly why a "smart
quotes" or apostrophe-normalization pass cannot be told to fix one without touching the other.
(A fourth opening `‘` in that sample is closed with **′ U+2032
PRIME** instead of `’` — a live example of the normalization damage this section warns about.) Note
the
interaction with the `ng'` apostrophe discussed above: the closing inner mark and the
apostrophe are the **same character, ’ U+2019**, so an inner quote that ends immediately before or
after an `ng'` word puts two identical marks side by side. (The collision follows from the two
sourced values; the handling — ⚠ **editorial** — is to rephrase to a single quotation level there,
never to substitute a different mark.)

- ✅ Inner level: **“… ‘…’ …”** (outer U+201C/U+201D, inner U+2018/U+2019)
- ❌ ASCII apostrophes as the inner pair: **“… '…' …”**

**Romanization in native-script text.** **n/a** — the standard writing system is already Latin, so
there is no transliteration-into-UI question. English technical **acronyms** (AI, ML, GPU, API) are
commonly left in Latin inside Swahili running text; that is the only Latin-in-body case, and it is
sector convention rather than a cited rule (⚠).

Sources: <https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `sw` delimiter fields — outer and nested — were
read codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that
chart) · <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/sw.xml> and
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> (**fetched
this pass**: `sw.xml` holds the inheritance marker in all four delimiter fields; the values come
from `root.xml`) · <https://www.unicode.org/reports/tr35/tr35.html> (LDML v48.2 — the Inheritance
Marker definition quoted above, fetched this pass) ·
<https://www.unicode.org/charts/PDF/U0000.pdf> · <https://www.unicode.org/reports/tr35/> ·
<https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.britannica.com/topic/Swahili-language> ·
**attested-usage census (fetched and counted this pass, not an authority ruling):**
<https://taifaleo.nation.co.ke/michezo/kavulani-amwonya-asefa-aapa-kumlaza-mapema-kwenye-pambano-ndondi/>
(‘Knockout’) ·
<https://taifaleo.nation.co.ke/makala/afya-na-jamii/dalili-za-maambukizi-ya-matumbwitumbwi-yaani-mumps-miongoni-mwa-watoto/>
(‘mumps’) · <https://taifaleo.nation.co.ke/habari/hofu-tele-mauaji-ya-usiku-yakitanda-vijijini-kwale/> ·
<https://www.bbc.com/swahili/articles/c0l5g0wk6elo> (the quote-within-quote example) ·
<https://www.bbc.com/swahili/articles/c20yznyzx8wo> ·
<https://www.mwananchi.co.tz/mw/habari/kitaifa> (section front the six Mwananchi articles were drawn
from) · <https://taifaleo.nation.co.ke/makala/ukumbi-wa-lugha-na-fasihi-alama-za-uakifishaji-ambazo-kila-mwandishi-anapaswa-kuzifahamu/>
(the Kiswahili punctuation column quoted above — names no quotation glyph) ·
<https://www.bakita.go.tz/> (searched for punctuation guidance this pass: none)
— ⚠ **no Swahili-language authority states the nested rule**; the usage census corroborates the
single-inside-double *structure* only, and the glyph choice remains this guide's house decision.
(apostrophe/curly-quote pitfall — research-named; `ng'` example pairs are correct-form
illustrations, ⚠ not a cited orthography table)

---

## 10. Technical integration checklist

Latin-script LTR makes this checklist short — the surface where Swahili breaks is grammar and
terminology, not rendering.

- **`lang` / `dir` attributes.** Set **`lang="sw"`** (base) / **`lang="sw-easy"`** (simplified
  variant, subject to the §Header token note) and **`dir="ltr"`** throughout. Correct `lang` per
  variant and per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**.
- **Fonts to ship.** Any modern **Latin** font with full diacritic + punctuation coverage — **Noto
  Sans** is a safe default. No Indic/Arabic shaping engine needed; no complex-cluster testing.
- **Apostrophe integrity (`ng'`).** The `ng'` apostrophe is **load-bearing** (§3). Choose one
  apostrophe character — typographic **’ (U+2019)** for editorial polish — and apply it
  **consistently**; a "smart-quotes"/normalization pass must **not** rewrite some `ng'` apostrophes
  and leave others, and must not strip them.
- **Tokenization / highlighting.** Whitespace word separation applies — standard word tokenizers and
  word-boundary highlighting work with no special handling.
- **Line breaking / hyphenation.** Ordinary Latin line breaking. **No Swahili-specific hyphenation
  or line-breaking standard was found (⚠ unsourced)** — so **do not insert manual/soft hyphens**;
  keep breaks conservative and avoid forced breaks inside morpheme-heavy (agglutinated) words, and
  let the engine break at whitespace.
- **Index alphabet for glossary navigation.** Latin **A–Z** collation, driven from **CLDR `sw`
  collation data** (current release). Note that Swahili conventionally handles **digraphs** (`ch`,
  `sh`, `ny`, `ng'` …) and treats **q / x** as marginal (loanwords only). The research did **not**
  enumerate the collation sequence, so **do not hand-list it — drive the index from CLDR `sw`**
  (⚠ hand-listing would be unverified).
- **Digits in display vs identifiers.** Display numbers per §5 (Western 0–9, `.` decimal, per live
  CLDR `sw`); keep Western digits for machine identifiers, ISO-8601 backends, and code.
- **Currency parameterization.** **TSh vs KSh per deployment** (§9); do not hard-code one symbol.
- **Terminology freezing.** Because AI/ML terms are **candidates, not canon** (§6), the build's
  glossary must **pin one form per concept** and enforce it — inconsistency here is the most likely
  Swahili-specific corpus defect.

Sources: <https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (drive collation/
number values from current CLDR `sw`) · <https://fonts.google.com/noto/specimen/Noto+Sans> —
hyphenation and collation-sequence specifics are ⚠ unsourced (drive from CLDR).

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** The large majority of characters in `sw` content must be **Basic Latin
  (U+0000–U+007F)** (plus occasional Latin-1/Extended in borrowed names). A block of non-Latin
  script signals untranslated source text or a wrong-language leak.
- **Apostrophe consistency (`ng'`).** Exactly **one** apostrophe character across the corpus (`’`
  **or** ASCII `'`, chosen once); flag mixed usage, and flag any `ng`/`ny`-context where a `ng'`
  apostrophe appears to have been stripped by normalization.
- **Quote consistency.** Typographic **“ ” ’** used consistently in editorial copy (or ASCII
  consistently in plain contexts) — flag mixed straight/curly quotes within one body of text.
- **Digit-system consistency.** Western digits **0–9** throughout; `.` decimal / `,` grouping per
  live CLDR `sw`. Flag stray non-Western digits.
- **Source-language leak scan (EN/DE → SW).** Left-in English function words (the, and, you,
  please), German umlauts/ß, or English-style **redundant subject pronouns** (*mimi/wewe/yeye*
  before every verb, §4) or **dropped noun-class concord** surfacing in Swahili sentences.
- **Concord spot-check (review-level, not fully deterministic).** Adjectives/verbs carry the
  correct **noun-class prefix** (e.g. *kitabu kikubwa* not *kitabu kubwa*; *watoto wanasoma* not
  *watoto anasoma*). Flag obvious singular/plural prefix mismatches for human review.
- **No invented gender split.** Swahili has none (§4) — flag any translation that manufactures a
  masculine/feminine pair where the source is generic; expect the single neutral **yeye**.
- **Terminology consistency.** AI/ML terms match the **frozen project-glossary candidate** (§6) —
  since none is canonical, drift between competing renderings (e.g. *mtandao wa neva* vs another
  coinage for "neural network") is the highest-yield defect; one form per concept, enforced.

Sources: <https://www.unicode.org/cldr/charts/latest/summary/sw.html> ·
<https://www.unicode.org/charts/PDF/U0000.pdf> · concord/pronoun/gender checks derived from §4
(<https://www.britannica.com/topic/Swahili-language>).

---

*Provenance note:* this guide is built solely from an external desk-research pass (standard round-1
plus a deep round-2 follow-up). **BAKITA's authority was verified against bakita.go.tz this pass;
the EAKC domain (eakc.go.ke) did not resolve in verification and its citation ships ⚠
URL-unverified.** The chosen base register **Kiswahili Sanifu** is a recorded **convention**, not a
BAKITA/EAKC-documented directive. Two findings are **real absences of the language's
infrastructure, not research gaps**: there is **no authoritative Swahili AI/ML glossary** (§6 terms
ship ⚠ candidate) and **no codified Swahili plain-language standard** (§8 inherits the kit's base
rules wholesale). All **⚠** markers indicate claims the research could not source or that could not
be confirmed from the §2 authorities. A second-model and native-speaker review against the §2
sources is still outstanding (see Status in the header).
