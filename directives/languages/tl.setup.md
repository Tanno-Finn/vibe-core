<!-- base -->
# lang-tl — Filipino / Tagalog (Filipino) — setup & sources

> **The translation guide itself is [`tl.md`](tl.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Filipino is unusual
in the kit: it has **two official books that legislate orthography and style in detail**, both from
2014, both recovered in full. Tier labels follow the dossier: **Official** (Philippine state body or
statute) · **Standards** (Unicode/CLDR/IANA/ISO) · **Academic** · **Community** · **craft-tier** (this
guide's professional judgment, no source).

| Body / work | Tier | What it governs | Evidence |
|---|---|---|---|
| **Komisyon sa Wikang Filipino (KWF)** — Commission on the Filipino Language | Official, statutory (RA 7104, 1991; under the Office of the President) | The national language. RA 7104 §14 empowers it to *“Undertake or contract research and other studies to promote the evolution, development, enrichment and eventual standardization of Filipino”* and to *“Propose guidelines and standards for linguistic forms and expressions in all official communications, publications, textbooks and other reading and teaching materials.”* | <https://lawphil.net/statutes/repacts/ra1991/ra_7104_1991.html> |
| **Ortograpiyang Pambansa** (KWF, 2014 edisyon) — “OP” below | Official | Alphabet, *tuldik*, syllabification, hyphen (*gitling*), `ng`/`nang`, `din`/`rin`, loanword spelling policy | Colophon: *“Ortograpiyang Pambansa 2014 Edisyon / Karapatang-sipi © 2014 ng Komisyon sa Wikang Filipino … ISBN 978-971-0197-33-0”*. Canonical `kwf.gov.ph` PDF 403; recovered via web archive |
| **KWF Manwal sa Masinop na Pagsulat** (2014) — “MMP” below | Official | Punctuation **with an explicit Unicode table**, numbers, ordinals, dates, times, money, abbreviations, quotations | Colophon: *“KWF Manwal sa Masinop na Pagsulat / Karapatang-sipi © 2014 ni Virgilio S. Almario at ng Komisyon sa Wikang Filipino … ISBN 978-971-0197-34-7”*. Canonical PDF 403; recovered via web archive |
| **1987 Constitution, Art. XIV §§6–9** | Official | Language status; §9 mandates the language commission | <https://lawphil.net/consti/cons1987.html> |
| **KWF Diksiyonaryo ng Wikang Filipino** — `kwfdiksiyonaryo.ph` | Official | Whether a Filipino word exists, its etymology tag (`[ Esp ]` / `[ Ing ]`), whether a technical term is lemmatized under English or Filipino | Footer: *“©2025 Komisyon sa Wikang Filipino Website: kwf.gov.ph”*. **Use the `?query=<term>` path** — `/search` returns HTTP 500. *(Re-fetched 2026-07-26: `?query=computer` returns HTTP 200 with `Pinagmulang Wika: Ingles` and the cross-reference `→ KOMPIYÚTER`.)* |
| **KWF Patnubay sa Korespondensiya Opisyal** (4th ed.) | Official | Official-correspondence style; the closest thing to a national plain-writing charter (§8) | Canonical URL 403; recovered via web archive |
| **Department of Education (DepEd)** | Official | Adoption of the orthography in schools; the learner-module corpus behind the register decision (§4) | OP front matter lists *“Kautusang Pangkagawaran Blg. 34, s. 2013 ng Kagawaran ng Edukasyon”*; **⚠ the text of DepEd Order 34, s. 2013 itself was never retrieved** (deped.gov.ph 403, no archived copy located) |
| **Philippine Statistics Authority (PSA)**, **Bangko Sentral ng Pilipinas (BSP)** | Official | Attested real-world number, date, and currency formatting (§5) | Canonical URLs 403; recovered via web archive |
| **Unicode CLDR — `fil` locale** | Standards | Numbers, dates, times, currency, exemplar characters, collation index, ordinal rules | `cldr-json` `fil/numbers.json`, `fil/characters.json`, `fil/currencies.json`, `fil/ca-gregorian.json`; `common/rbnf/fil.xml`; `common/main/fil.xml` |
| **Unicode UCD / ISO 4217 / IANA registry** | Standards | ₱ U+20B1, PHP/608, `tl` and `fil` subtags, the Tagalog script block | <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> · <https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry> |
| **WALS Online 81A**; **NIU SEAsite** (Northern Illinois University) | Academic | Word order (VSO); the sociolinguistics of `po` | <https://wals.info/valuesets/81A-tag> · <https://seasite.niu.edu/trans/tagalog/EnglishtoTagalogTexts/greetings.htm> |
| **Mangila, B. B. (2018)**, *Pedagogic Code-Switching*, ELTEJ 1(3) | Academic | Taglish as *“the unmarked code of choice”* (§9) | <https://files.eric.ed.gov/fulltext/EJ1288199.pdf> |
| **`diksiyonaryo.ph`** (a separate site from KWF's) | Community — **⚠ publisher not stated on the site; attribution `⚠ unverified`** | Second-opinion lexicography; carries entries KWF's own site lacks (`kayo` sense 2, `opo`, `po`) | Site meta: *“Diksiyonaryo ng wikang Filipino: mga kahulugan, etimolohiya, at gamit ng mga salita.”* |
| **Tagalog Wikipedia / English Wikipedia** | Community | Trigger system, clitic order, reduplication, Taglish, *siyokoy*, and **measured usage counts** | Marked at point of use |
| **UP Diksiyonaryong Filipino** (UP Sentro ng Wikang Filipino) | — | The standard scholarly monolingual dictionary | **⚠ Never consulted. No public fetchable edition located; edition/year and contents `⚠ unverified`.** This is the single largest gap in this guide |

### Access note — what was blocked, and how the KWF books were recovered

**Every Philippine government domain tried returned HTTP 403** to both a fetch tool and to `curl` with a
browser user-agent: `kwf.gov.ph`, `psa.gov.ph`, `officialgazette.gov.ph`, `deped.gov.ph`, `bsp.gov.ph`,
`congress.gov.ph`, `senate.gov.ph`, `issuances-library.senate.gov.ph`. `researchgate.net`,
`academia.edu` and `glossa-journal.org` bot-blocked. **Do not retry these — the block is consistent and
domain-level.** The workaround that did work throughout: the **web archive** (`web/<timestamp>id_/<url>`
fetched with `curl`), which served the original KWF PDFs, PSA releases, and BSP press releases intact.
Two sources worked **directly** and carry a lot of weight: **`lawphil.net`** (statutes and the
Constitution) and **`kwfdiksiyonaryo.ph/?query=<term>`** (KWF's own dictionary, server-rendered on the
`?query=` path only). Legislative bill PDFs on `congress.gov.ph` / `docs.congress.hrep.online` are
**scanned images with no text layer**.

### Named gaps — state these honestly, do not paper over them

1. **UP Diksiyonaryong Filipino — never consulted.** Biggest terminology gap. A reviewer with Philippine
   library access should close it.
2. **DepEd Order 34, s. 2013** — the instrument adopting the Ortograpiyang Pambansa in schools; its
   text was never retrieved. `⚠ unverified` as to exact wording.
3. **`diksiyonaryo.ph` publisher unattributed** — its entry format matches the UP/KWF lexicographic
   tradition, but the site states no publisher. Treated as Community tier throughout.
4. **No digital/UI style guide for Filipino exists.** No KWF or DepEd guidance specific to software UI,
   web copy, or microcopy surfaced. The MMP is a **print-editorial** manual: its punctuation, number,
   date, and money rules transfer cleanly, but **button labels, form errors, and tone of voice are
   unlegislated** — hence §7 is craft-tier in its entirety.
5. **No Filipino form is attested anywhere for `bias` (AI sense), `prompt`, `dataset`, or UI `level`.**
   The §6 recommendations for those four rows are pure craft-tier.
6. **Search budget exhausted (200/200)** during the research run. Treat this guide as a first pass.

**One useful piece of official intent** for a learning platform, from the MMP's own preface: the
manual's stated goal is *“para matiyak na ang isang sulatin ay maiintindihan ng target na mambabasá”*
(“to make sure a text will be understood by its target reader”) — the closest thing Filipino has to an
official plain-writing charter (§8).

Sources: <https://lawphil.net/statutes/repacts/ra1991/ra_7104_1991.html> ·
<https://lawphil.net/consti/cons1987.html> · <https://kwfdiksiyonaryo.ph/?query=computer> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/fil/numbers.json> ·
<https://wals.info/valuesets/81A-tag> · <https://files.eric.ed.gov/fulltext/EJ1288199.pdf> ·
KWF *Ortograpiyang Pambansa* (2014, ISBN 978-971-0197-33-0) and *Manwal sa Masinop na Pagsulat*
(2014, ISBN 978-971-0197-34-7), canonical `kwf.gov.ph` PDFs 403, recovered via web archive

---

## 3. Script & typography

**(Strong section — KWF Ortograpiyang Pambansa + KWF Manwal sa Masinop na Pagsulat + Unicode/CLDR.)**

### 3.1 The alphabet — 28 letters, including Ñ and the digraph Ng

Ortograpiyang Pambansa §1.1 *Titik*:

> *“Ang alpabetong Filipino ay binubuo ng dalawampu’t walong (28) titik at kumakatawan ang bawat isa sa
> isang tunog. Binibigkas o binabása ang mga titik sa tunog-Ingles maliban sa Ñ.”*

Sequence: **A B C D E F G H I J K L M N Ñ Ng O P Q R S T U V W X Y Z** — **Ñ** (*enye*) and the digraph
**Ng** (*endyi*) are full alphabet members with their own sort positions. The 1987 reform added eight
letters to the 20-letter *abakada*: *“Tinanggap ang mga dagdag na titik na: C, F, J, Ñ, Q, V, X, at Z.”*

**Practical consequence:** an A–Z index or alphabetical nav that omits **Ñ** and **Ng** is wrong for
Filipino. KWF's own dictionary site renders the alphabet nav exactly as
`A B C D E F G H I J K L M N Ñ Ng O P Q R S T U V W X Y Z`.

### 3.2 *Tuldik* (accent marks) — the required codepoints

Ortograpiyang Pambansa §1.2:

> *“Sa abakadang Tagalog, tatlo ang pinalaganap nang tuldik: (1) ang tuldik na pahilís (´) na sumisimbolo
> sa diin at/o habà, (2) ang tuldik na paiwà (\`), at (3) ang tuldik na pakupyâ (^) na sumisimbolo sa
> impit na tunog. Kamakailan, idinagdag ang ikaapat, ang tuldik na patuldók, kahawig ng umlaut at
> dieresis ( ¨ ) upang kumatawan sa tunog na tinatawag na schwa”*

The same volume, §10.7 *“Kung Hahanapin sa Computer”*, prints an input table that fixes exactly which
characters are meant: *“a á – Alt 160 à – Alt 133 â – Alt 131 / e é … è … ê … ë … / Ñ Alt 165 ñ Alt 164 /
’ Alt 0146 (upang maiwasan ang baligtad ['\]) / – Alt 0150 (gatlang en) / — Alt 0151 (gatlang em)”*.

**Character inventory a Filipino build must render:**

| Group | Characters | Note |
|---|---|---|
| *pahilís* (acute) | **á é í ó ú** | stress and/or length |
| *paiwà* (grave) | **à è ì ò ù** | |
| *pakupyâ* (circumflex) | **â ê î ô û** | glottal stop |
| *patuldók* (diaeresis) | **ë** (U+00EB) | the **schwa**, newest addition — the one most likely missing from a hand-rolled charset test (e.g. *Mëranaw*, *Kankanaëy*) |
| *enye* | **Ñ ñ** (U+00D1 / U+00F1) | full alphabet member |
| Punctuation | **’ – —** | *kudlit*, *gatlang en*, *gatlang em* |

In running educational text the *tuldik* are used **selectively**, not on every word: *“Kung mahihirapang
markahan ang lahat ng salita, gamitin ang tuldik upang maipatiyak ang wastong bigkas lalò na sa mga
salitang magkakatulad ng baybay ngunit nagbabago ang kahulugan dahil sa bigkas.”* (OP §10).

- ✅ Mark accents where a minimal pair would otherwise be ambiguous: **páso / pasó / pasò / pasô**.
- ❌ Accenting every word throughout UI copy (over-marking; not what KWF's own prose does).
- ❌ ASCII-stripping the marks: **paso** everywhere, **enye → ny**, **ë → e**.

*(The selective-marking guidance is **craft-tier**; the quoted OP sentence is the Official warrant.)*

### 3.3 Punctuation and quotation marks — officially specified, with codepoints

The **KWF Manwal sa Masinop na Pagsulat** §12.68 *“YUNIKOWD NG BANTAS”* gives an explicit Unicode table.
Verbatim from the entries:

> *“paniping isahan (single quotation mark) … U+2018 (left single quotation mark); U+2019 (right single
> quotation mark)”*
> *“paniping dalawahan (double quotation mark) … U+201C (left double quotation mark); U+201D (right
> double quotation mark)”*
> *“kudlít … U+2019 (kapareho ng right single quotation mark)”*
> *“gatlang en … U+2013 … gatlang em … U+2014 … elipsis … U+2026”*

**Therefore Filipino uses curly English-style quotes “ ” / ‘ ’ — not guillemets, not low-9 quotes.**
This is a case where the correct convention *is* the same shape as English, and it is **prescribed by
name and codepoint**, not assumed. **Independently corroborated in CLDR** *(re-fetched 2026-07-26 for
this guide)*: `common/main/fil.xml` inherits its delimiters from root (`↑↑↑`), and root delimiters are
`quotationStart “` / `quotationEnd ”` / `alternateQuotationStart ‘` / `alternateQuotationEnd ’`; the
`fil` punctuation exemplar set is
`[\- ‐‑ – — , ; \: ! ? . … '‘’ "“” ( ) \[ \] § * / \& # ′ ″]` — it lists the curly pairs explicitly.

- ✅ Filipino: **“Piliin ang tamang sagot.”**  ·  ✅ nested: **“Ang tanong ay ‘bakit’, hindi ‘paano’.”**
- ❌ Straight ASCII: **"Piliin ang tamang sagot."**
- ❌ German-style low-9 open: **„Piliin ang tamang sagot.“**
- ❌ Guillemets: **«Piliin ang tamang sagot.»**

**The *kudlit* (apostrophe) is U+2019, not ASCII `'`.** It marks contraction — *iba’t iba*, *pagka’y*,
*dalawampu’t walo*. CLDR's own Filipino cardinal spellout ruleset writes it that way too
(`20: <%%number-times< pû[’t >>];`).

- ✅ **iba’t iba** (U+2019)  ·  ✅ **dalawampu’t walong titik**
- ❌ **iba't iba** (ASCII U+0027)  ·  ❌ **iba`t iba** (backtick)
- ❌ **iba’t-iba** — a *spelling* error, not just a punctuation one: OP §11.1 — *“Maling anyo din ang
  ‘iba’t-iba’ dahil hindi ito inuulit kundi kontraksiyon ng iba at iba.”* (it is a contraction, not a
  reduplication, so no hyphen).

**Basic punctuation set** (OP §1.2): *“Mga karaniwang bantas ang kuwít (,), tuldók (.), pananóng (?),
padamdám (!), tuldókkuwít (;), tutuldók (:), kudlít (’), at gitlíng (-).”*

**Quote-and-period placement follows the American convention.** MMP §12.5: *“pinananatili ang tuldok sa
loob ng panipi kung ang tuwirang sinipi ay nása hulihang bahagi ng pangungusap”* (period **inside** the
closing quote). But the semicolon goes **outside** — MMP §12.30: *“Laging isinusulat sa labas ng panipi
o panaklong ang tuldok-kuwit.”*

- ✅ **Sinabi niya, “Tapos na.”**  ·  ✅ **Sinabi niyang “tapos na”; umalis siya.**
- ❌ **Sinabi niya, “Tapos na”.**  ·  ❌ **Sinabi niyang “tapos na;” umalis siya.**

**No exclamation stacking in formal text** — MMP §12.25: *“Sa pormal na sulatín, hindi gumagamit ng higit
pa sa isang padamdam”*.

- ✅ **Tama!**  ·  ❌ **Tama!!!**

### 3.4 Hyphen (*gitling*) — grammatical, not decorative

Ortograpiyang Pambansa §11 gives twelve rules. The ones that bite in UI copy:

- **Reduplication (§11.1):** *“Ginagamit ang gitling sa mga salitang inuulit: anó-anó / aráw-áraw /
  gabí-gabí / sirâ-sirâ / ibá-ibá”*.
  - ✅ **araw-araw**, **hakbang-hakbang**  ·  ❌ **araw araw**, **hakbanghakbang**
- **Consonant + vowel juncture (§11.3):** *“pag-ása / ágam-ágam / mag-isá / pang-uménto”*.
  - ✅ **pag-aaral**, **mag-isa**  ·  ❌ **pagaaral**, **magisa**
- **Affix + unassimilated foreign word or proper noun (§11.3)** — **directly relevant to tech copy**:
  *“pa-cute, ngunit pakyut … maki-computer, ngunit makikompiyuter”*, *“maka-Filipino, ngunit makalupa”*.
  An English technical noun kept in English spelling takes a **hyphen** after a Filipino affix.
  - ✅ **i-download**, **mag-log in**, **i-click**, **maki-computer**
  - ❌ **idownload**, **maglog in**, **makicomputer**

### 3.5 Line-breaking and hyphenation — turn `hyphens: auto` off

MMP §12.44: *“Ginagamit ang gitling bílang senyas na naputol ang isang salita sa dulo ng isang linya …
Mahalaga na wasto ang pagpapantig sa naging pagputol”* — a line-break hyphen is only correct if the
**syllabification** is correct. The syllable rules are OP §2.2 (*“kapag may magkasunod na katinig sa loob
ng isang salita, ang una ay isinasáma sa sinundang patinig”*, giving `/ak•lat/`, `/os•pi•tal/`,
`/eks•per•to/`).

**Craft-tier build rule:** browsers do **not** reliably ship a `lang="tl"` / `lang="fil"` hyphenation
dictionary (`⚠ unverified` — not tested against a browser matrix). Because a wrong break violates a
**documented national rule** and is visible, set **`hyphens: manual`** (or simply do not set
`hyphens: auto`) for Filipino and let long words wrap whole.

- ✅ `hyphens: manual` — *pagsasanay* wraps whole
- ❌ `hyphens: auto` with no Filipino dictionary — risks *pagsas-anay* against OP §2.2

### 3.6 Web fonts — the ₱ trap

Anything with full Latin-1 covers **ñ Ñ ë á à â**. The one real trap is the **peso sign ₱ (U+20B1)**,
which sits **outside** the default `latin` subset. From the generated CSS for a Noto Sans web font:

- `/* latin */ … unicode-range: U+0000-00FF, U+0131, U+0152-0153, …` — covers ñ, ë, á, but **not** U+20B1;
- `/* latin-ext */ … unicode-range: U+0100-02BA, …, U+20A0-20AB, U+20AD-20C0, …` — **this** is the
  subset containing U+20B1.

Note the Euro U+20AC *is* specially pulled into `latin`; the peso is **not**. **Action:** if the build
subsets web fonts, **include `latin-ext` for Filipino** or ₱ will fall back to a system font mid-line.
`⚠` Scope caveat: this proves how the font service *subsets* the family, not that the font file lacks
the glyph.

- ✅ Ship `latin` **+ `latin-ext`** → **₱1,234.56** renders in the page font
- ❌ Ship `latin` only → **₱** falls back mid-line; ñ/ë are fine but the currency string looks broken

### 3.7 Collation — `Ng` is one element, and `ë` is missing from CLDR

CLDR treats the digraph as a single collation/index unit *(re-fetched 2026-07-26 for this guide)*.
`cldr-misc-full/main/fil/characters.json`:

> *“exemplarCharacters”: “[a b c d e f g h i j k l m n ñ {ng} o p q r s t u v w x y z]”*
> *“index”: “[A B C D E F G H I J K L M N Ñ {Ng} O P Q R S T U V W X Y Z]”*

The braces mean **Ng sorts and indexes as one letter, not as n+g** — relevant to any A–Z glossary widget.

⚠ **Real discrepancy:** CLDR's auxiliary set is *“[áàâ éèê íìî óòô úùû]”* — it **omits `ë`**, even
though KWF's orthography treats the schwa as part of the national inventory (§3.2). A character
whitelist or font subset derived from CLDR will **silently drop `ë`** from words like *Mëranaw* /
*Kankanaëy*. **Add U+00EB by hand.**

### 3.8 Baybayin — historical, non-operational

The pre-colonial *baybayin* script is culturally salient and appears in KWF's own history: *“Ang baybayin
ay binubuo ng labimpitong (17) simbolo na kumakatawan sa mga titik: 14 katinig at 3 patinig.”* It is
**not** used for modern running text, and KWF says so plainly: *“Mahigit dalawang siglo bago ganap na
tinanggap ng mga Kristiyanong Filipino ang alpabetong romano sa pagsulat at unti-unting nilimot ang
baybayin.”* Every Philippine government page fetched for the research — PSA, BSP, Official Gazette
(including the **Filipino-language** 1987 Constitution) and KWF itself — is entirely Latin script, with
zero U+1700–U+171F characters.

**Unicode naming trap:** the block is called **Tagalog**, not “Baybayin” — Blocks.txt: *“1700..171F;
Tagalog”*; ISO 15924: *“Tglg;370;Tagalog (Baybayin, Alibata);…”*. Related scripts are separate blocks
(*“1720..173F; Hanunoo”*, *“1740..175F; Buhid”*).

A “National Writing System Act” bill exists (House Bill 1022, 17th Congress), but the filed PDF is a
**scanned image with no text layer**, so nothing could be quoted from it; the only readable description
is tertiary (Community). **No evidence of enactment was found and no corresponding Republic Act was
located** — `⚠ unverified` as to its legislative history. **Do not claim it “passed”.**

> **Rule for this platform: never render Filipino content in baybayin.** Decorative use only, and only
> alongside the Latin text.

### 3.9 Romanization — not applicable

Filipino is natively a Latin-script language, so there is **no transliteration/romanization step** and
nothing to keep out of the UI (unlike Cyrillic/Arabic/Devanagari/CJK).

Sources: KWF *Ortograpiyang Pambansa* (2014) §§1.1, 1.2, 2.2, 10, 10.7, 11.1, 11.3 · KWF *Manwal sa
Masinop na Pagsulat* (2014) §§12.5, 12.25, 12.30, 12.44, 12.68 (canonical `kwf.gov.ph` PDFs 403,
recovered via web archive) ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/fil/characters.json> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt> ·
<https://www.unicode.org/iso15924/iso15924.txt> ·
<https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&display=swap> ·
<https://diksiyonaryo.ph/> · <https://en.wikipedia.org/wiki/Baybayin> (Community — the bill description)

---

## 10. Technical integration checklist

- **Locale mapping — do this first.** Content key stays **`tl`**; UI label is **“Filipino”**; but
  **every ICU/CLDR-backed call must be passed `fil-PH` explicitly** (`Intl.NumberFormat`,
  `Intl.DateTimeFormat`, `Intl.PluralRules`, `Intl.Collator`, server-side ICU). **CLDR has no `tl`
  locale — `common/main/tl.xml` is a 404**; `tl` resolves only through the legacy alias
  `tl → fil` (§1). Add a single mapping constant, not a per-call-site guess.
- **Ordinals — never ship ICU output unmodified.** CLDR `fil` `%digits-ordinal` emits **`ika20`**; KWF
  mandates **`ika-20`** (§5.3). And `%spellout-ordinal` emits **`ika ` + cardinal with a space** where
  KWF prescribes the closed-up form. **Implement `ika-` + `-` + numeral in the formatting layer** and
  add the check in §11.
- **Fonts to ship:** any font with full Latin-1 covers **ñ Ñ ë á à â**. **Ship the `latin-ext` subset as
  well** — the **peso sign ₱ (U+20B1)** is outside the default `latin` subset and will fall back
  mid-line (§3.6). A Noto family (Noto Sans / Noto Serif) is a safe default.
- **Add U+00EB (`ë`) to any character whitelist by hand.** CLDR's `fil` auxiliary exemplar set omits it,
  so a whitelist or subset derived from CLDR **silently drops `ë`** from *Mëranaw* / *Kankanaëy* (§3.7).
- **`lang` / `dir` attributes:** `lang="tl"` (base) and `lang="tl-easy"` (simplified variant, subject to
  the header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Hyphenation: set `hyphens: manual`** (or simply do not set `hyphens: auto`) for Filipino. A wrong
  break violates a documented national syllabification rule (OP §2.2 / MMP §12.44) and browsers do not
  reliably ship a Filipino hyphenation dictionary (§3.5, `⚠ unverified`). Let long words wrap whole.
- **Index alphabet for glossary navigation — 28 entries including Ñ and the digraph Ng:**
  `A B C D E F G H I J K L M N Ñ Ng O P Q R S T U V W X Y Z`. **Drive collation from CLDR `fil`**, whose
  index set brackets the digraph (`{Ng}`) so it sorts as **one letter, not n+g** (§3.7). A naive
  codepoint sort is wrong.
- **Strings must be authored whole — no `{adjective} {noun}` concatenation.** The linker `na` / `-ng`
  (§4.3) and the `din`/`rin` alternation (§4.2.4) both depend on the **preceding word**, so neither
  survives interpolation. Treat template assembly of Filipino noun phrases as a build-level anti-pattern.
- **Truncation is morpheme-unsafe.** Reduplication carries aspect and plurality (§4.2.6); truncating
  *“Naglo-load…”* can destroy a morpheme, not just a letter. Prefer wrapping or a designed short form
  over ellipsis truncation.
- **Numbers / dates / currency in display vs identifiers:** display per §5 (**`1,234.56`**, `50%`,
  `Hulyo 26, 2026`, `₱1,234.56` tight / `PHP 1,234.56` spaced, 12-hour time); keep Western digits and
  **ISO 8601 (`2026-07-26`)** for backends, identifiers, `datetime` attributes and code.
- **Punctuation normalization:** normalize straight quotes to **“ ” / ‘ ’** (U+201C/U+201D/U+2018/U+2019)
  and the *kudlit* to **U+2019** in body copy; use **en dash U+2013** for ranges (§3.3, §5.4).
- **Weekday name pin:** ship **`Miyerkules`** (the CLDR form) everywhere so machine-formatted and
  hand-written strings match, and record the KWF variant `Miyerkoles` in the glossary so a reviewer does
  not “correct” it (§5.4). **Do not use CLDR narrow month names** — the set is asymmetric.
- **No romanization layer, no baybayin.** Filipino is native Latin script (§3.9); never render content in
  the Tagalog/baybayin block (U+1700–U+171F) — decorative use only, alongside Latin (§3.8).

Sources: <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/supplemental/supplementalMetadata.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/rbnf/fil.xml> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/fil/characters.json> ·
<https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&display=swap> · KWF *Ortograpiyang Pambansa*
§§1.1, 2.2, 11 and *Manwal sa Masinop na Pagsulat* §§12.44, 12.68, 13.5 (Official, via web archive)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Register scan (the highest-value check).** The recorded register is `ka` / `ikaw` / `mo` / `iyong`,
  **no `po`** (§4.1).
  - Flag **any word-boundary `po` / `ho` / `opo`** in body copy. Allow-list: quoted example utterances,
    audio/voice-address strings, and the designated support surface — each must be an explicit
    exception, never an ad-hoc one.
  - Flag **`kayo` / `ninyo` / `inyo` / `inyong`** where the addressee is a single reader (polite-singular
    drift). Genuine plurals are fine.
  - Flag **mixed `ka` and `kayo` within one screen/surface** — the most visible failure mode.
- **`ng` vs `nang`.** Flag `nang` outside the five OP §9.1 licenses (temporal *noong*, purpose
  *upang/para*, *na + ng* contraction, manner/degree adverbial, repeated-word linker), and flag `ng`
  where a manner adverbial follows. Also flag **`na'ng` with an ASCII apostrophe** — it must be
  **`na’ng`** (U+2019).
- **`din` / `rin` and `daw` / `raw` alternation (§4.2.4).** Deterministic from the **preceding word's
  final character**: after a vowel or the glides W/Y → `rin`/`raw`; after other consonants → `din`/`daw`;
  **except** when the preceding word ends in `-ri`, `-ra`, `-raw`, `-ray` → `din`/`daw`. Flag violations,
  and flag **any template that interpolates a variable immediately before `din`/`rin`**.
- **Linker check.** Flag an adjective immediately followed by a noun with **no `na` / `-ng` / `-g`**
  (*malaki datos*, *mabilis modelo*) — §4.3. Flag any format string of the shape `{x} {noun}` in
  Filipino resources.
- **`tayo` vs `kami`.** Flag **`tayo` / `natin` / `atin`** in legal, privacy, cookie, billing, and
  company-voice strings (the organization must be **`kami` / `namin` / `amin`**); flag **`kami`** in
  lesson/tutorial “let's …” strings (must be **`tayo`**) — §4.2.5.
- **Number formatting.** Filipino uses **period decimal + comma grouping**. Flag `1.234,56`, `1 234,56`,
  a decimal comma inside a number, a **missing leading zero** below 1 (`.37`), and **`50 %`** with a
  space — §5.1.
- **Ordinal formatting.** Flag **`ika` immediately followed by a digit with no hyphen** (`ika20`) and
  **`ika ` + space + digit or spelled numeral** — both are the CLDR/ICU defaults and both are wrong
  (§5.3, §10). Correct: `ika-20`, or the closed-up spelled form `ikadalawampu`.
- **Currency.** Flag bare **`P20`** (ambiguous with the letter P), **spaced `₱ 1,234.56`**, symbol-after
  (**`1,234.56 ₱`**), and amounts with fewer than two decimals in a price context (§5.6). Pick one of
  `₱` / `PHP` / `Php` project-wide and flag the other two in the same surface.
- **Date formatting.** Flag bare numeric `d/m/y` and `m/d/y` in formal user-facing surfaces (KWF §13.18
  restricts all-numeric dates to informal writing); flag the month-first form **missing its comma**
  (*Hulyo 26 2026*); flag a **hyphen used for a year range** where an en dash (U+2013) is required.
- **Forbidden punctuation in body copy.**
  - No **straight ASCII quotes `"` `'`** — Filipino body copy uses **“ ”** (U+201C/U+201D) and **‘ ’**
    (U+2018/U+2019), prescribed by codepoint in MMP §12.68 (§3.3).
  - No **low-9 „…“** and no **guillemets « »** — those are other languages' conventions.
  - The ***kudlit* must be U+2019**, not ASCII `'` — flag `iba't iba`, `pagka'y`, `dalawampu't`.
  - Flag **`iba’t-iba`** (hyphenated) — an OP §11.1 spelling error, not just punctuation.
  - No **stacked exclamation marks** in formal copy (MMP §12.25).
- **Diacritic / character integrity.** Flag **`n` where `ñ` is required** in a known-`ñ` word, and any
  ASCII-flattening of the *tuldik* set (`á à â é è ê í ì î ó ò ô ú ù û`). **Specifically test for `ë`
  (U+00EB)** — it is absent from CLDR's `fil` auxiliary exemplar set and is the character a
  CLDR-derived whitelist silently drops (§3.7).
- ***Siyokoy* scan.** Flag the known malformed hybrids from §6.2 — **`paterno`** (use `padron`),
  `aspeto`, `imahe`, `konsernado`, `kontemporaryo`, `endorso`, `lebel`, `dayalogo`, `prayoridad`,
  `kritisismo`. Also flag any **new Spanish-looking coinage not present in the KWF dictionary**.
- **Terminology consistency.** Flag competing renderings of the same concept inside one build —
  `kompyuter` vs `kompiyuter` vs `computer`; `datos` vs `data`; `padron` vs `paterno`; `pagkatuto ng
  makina` vs `machine learning` used as the primary term. **Pick one per term (§6.4) and enforce it.**
- **Register/lexis scan for `tl-easy`.** Flag the Corpus-tier formal markers from §8b — `kaugnay (ng)`,
  `hinggil sa`, `ipatupad`, `naaayon sa`, `nararapat`, `isinasagawa`, `samakatuwid` — and any
  **`bigyang-` nominalization** (Official rule, MMP §11.6). **Do not** flag `mahalaga`, `maaari`,
  `pagsusuri`, `teknolohiya` — §8d shows those are already the plain forms.
- **Source-language leak scan (EN → TL).** Left-in English function words (*the*, *and*, *you*, *please*,
  *your*); English **clauses** (as opposed to permitted technical nouns, §9.3); English number/date
  formatting surfacing in Filipino text; and untranslated UI verbs where a Filipino verb exists
  (*i-open* instead of *Buksan*).
- **Script-ratio expectation.** `tl` content is Latin script; there is no script-ratio check to run — but
  **flag any codepoint in U+1700–U+171F** (the Tagalog/baybayin block), which must never appear in
  content (§3.8).

Sources: KWF *Ortograpiyang Pambansa* §§8.1, 9.1, 9.2, 11.1 and *Manwal sa Masinop na Pagsulat* §§12.25,
12.68, 13.5, 13.18 (Official, via web archive) ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/rbnf/fil.xml> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/fil/characters.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/fil/numbers.json>

---

## The five things to tell a Filipino translator first

1. **Address the reader as `ka` / `mo` / `iyong`. No `po`.** Six official DepEd modules, Grade 2 to
   adult, contain **zero `po` in their own instructional voice** (§4.1).
2. **Decimal point, comma grouping — `1,234.56`.** Officially prescribed by KWF §12.4, confirmed by
   CLDR `fil` and by government figures (§5.1).
3. **Keep English technical nouns; Filipino-ise the verbs.** *“Sinasanay ang modelo gamit ang dataset.”*
   This is what every existing Filipino localization does and what KWF's own orthography permits
   (§6.7, §9.3).
4. **Whatever the English sentence is *about* must end up `ang`-marked** — preserve the topic, not the
   voice. English “avoid the passive” advice is **actively harmful** in Filipino (§4.2.1).
5. **`tayo` includes the reader; `kami` excludes them.** *“Tingnan natin”* (lesson) vs *“Gumagamit kami
   ng cookies”* (company). Getting this backwards is the most embarrassing available error (§4.2.5).

---

*Provenance note:* this guide is **authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources.** Its **strong** sections —
§2 authorities, §3 script & typography, §5 numbers/dates/currency, §6 terminology policy — rest on the
two 2014 **KWF** books (*Ortograpiyang Pambansa*, ISBN 978-971-0197-33-0; *Manwal sa Masinop na Pagsulat*,
ISBN 978-971-0197-34-7), on **CLDR `fil`**, and on Philippine statute, and carry verbatim quotes. §4's
register subsection is **evidence-grounded** (measured counts over six official DepEd learner modules),
while §4's trigger-system, clitic-order, aspect, and reduplication material is **Community-tier
(Wikipedia)** and §4.0's word-order datapoint is **Academic (WALS)**. §7 is **craft-tier in its
entirety** — no Filipino authority legislates UI microcopy — and §8 records an honest **❌: no Filipino
plain-language standard exists** (verified across fifteen search lines), with the official *clear-writing*
rules carried as what they are.

The following anchors were **re-fetched during authoring (2026-07-26)** and confirmed:
CLDR `supplementalMetadata.xml` line 243 (`<languageAlias type="tl" replacement="fil" reason="legacy"/>`);
`common/main/fil.xml` → HTTP 200 vs `common/main/tl.xml` → HTTP 404;
`cldr-json` `fil/numbers.json` (`"decimal": "."`, `"group": ","`, `#,##0.###`, `#,##0%`, `¤#,##0.00`,
`¤ #,##0.00`); `fil/characters.json` (exemplar with `{ng}`, index with `{Ng}`, auxiliary **without** `ë`,
number exemplar without a space); `fil/currencies.json` (`"Piso ng Pilipinas"`, symbol `₱`);
`common/rbnf/fil.xml` (`%digits-ordinal: 0: ika=#,##0=;` and `%spellout-ordinal: 0: ika =%spellout-cardinal=;`);
`common/main/root.xml` delimiters (`“ ” ‘ ’`, inherited by `fil`);
`lawphil.net` RA 7104 (*“(c) Filipino – refers to the national language of the Philippines.”* and the
§5 major-languages clause); and `kwfdiksiyonaryo.ph/?query=computer` (HTTP 200, *Pinagmulang Wika: Ingles*,
`→ KOMPIYÚTER`, footer *“©2025 Komisyon sa Wikang Filipino”*).

Every ⚠ marker and tier label the dossier set has been preserved. **The Philippine government domains in
§2's access note are blocked at the domain level — do not retry them; use the web archive.** A
**native-speaker review is still outstanding** (see Status in the header), and the named gaps in §2 —
above all the **UP Diksiyonaryong Filipino, never consulted** — remain open.
