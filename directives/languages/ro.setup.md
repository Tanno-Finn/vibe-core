<!-- base -->
# lang-ro — Romanian (română) — setup & sources

> **The translation guide itself is [`ro.md`](ro.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Romanian has a
single clear normative authority, which makes the strong sections well-anchored.

- **Academia Română** — the supreme normative authority for the Romanian language, acting through
  its language institute below.
- **Institutul de Lingvistică „Iorgu Iordan – Alexandru Rosetti”** — the Academy institute that
  authors the normative dictionaries.
- **DOOM — *Dicționarul ortografic, ortoepic și morfologic al limbii române*.** The **current
  edition is DOOM3 (third edition)**, **printed in 2021 by Editura Univers Enciclopedic**, developed
  by the Institute of Linguistics, and **free online**.
  - doom.lingv.ro — „tipărită în 2021 la Editura Univers Enciclopedic”; the digital version carries
    „peste 65.000 de articole” and is offered under a Creative Commons license
    („disponibil sub licența Common Creative Atribuire-Necomercial-Partajare în Condiții Identice 4.0
    Internațional (CC BY-NC-SA 4.0)”) — <https://doom.lingv.ro/>. **This anchor was re-fetched and
    confirmed.** (Note: DOOM3 gives spelling/morphology, **not** definitions — use DEX for meaning.)
- **DEX — *Dicționarul explicativ al limbii române*** via **dexonline.ro** — definitions, usage, and
  a normative punctuation guide (quotation marks, §3). <https://dexonline.ro/>

**On a "digital style guide":** there is **no single authoritative Romanian government digital style
guide** equivalent to (say) GOV.UK style. Editorial norms come from **DOOM3** (spelling/morphology)
+ **dexonline/DEX** (meaning) + the academic *Gramatica limbii române* + newsroom house style. For a
web platform the workable stack is **DOOM3 for orthography, dexonline for meaning, and a consistent
internal glossary**. ⚠ The absence-of-a-standard claim is based on not finding one; treat it as
best-effort, not a proof of non-existence.

**Source-tier caveat (read before trusting a section).** The **strong** sections — typography (§3),
authorities (§2), and the core-terminology rows (§6) — rest on DOOM3 / dexonline / secarica.ro /
Romanian Wikipedia and carry verbatim quotes. The **thin** sections — grammar (§4), idioms (§7),
regional variation (§9), and the AI-*operational* terminology rows (§6) — rest on educational sites,
a labeled localization-vendor page, translator judgment, and search-summary sources. Those are
carried below because they are the best available, but they are marked **⚠ community-tier /
localization-source, native-speaker confirmation pending** and must not be read as academy-sourced.

Sources: <https://doom.lingv.ro/> · <https://dexonline.ro/> ·
<https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)>

---

## 3. Script & typography

**(Strong section — secarica.ro + dexonline + Romanian Wikipedia, three anchors re-fetched.)**

**Re-fetch log (review pass, 2026-07-27).** Three pages in this section carry quotes that go beyond
what the research dossier holds; they were fetched live and inspected **by codepoint** on 2026-07-27:

- <https://www.secarica.ro/ro/rou/s-uri-si-t-uri> — the §3.1 origin quote. The dossier carried only a
  search-summary paraphrase, so the whole verbatim is a re-fetch. **A previous revision of this guide
  printed the comma-below letters inside that quote where the source has the cedilla letters, i.e. it
  asserted the exact opposite of §3.1's table; corrected here and the dropped final clause
  (`… și U0163 (t cu sedilă)`) restored.**
- <https://elon.io/grammar/romanian/spelling/s-t-comma> — the visual-difference and
  why-it-breaks-silently quotes. The dossier carries these **truncated**; the text after the `…` in
  the visual-difference quote (`like a punctuation comma flipped down`, `(the same mark as in French
  garçon)`) and the second sentence of the search quote (`Search for "București" … zero results`) plus
  `mark a document as old, machine-mangled, or sloppily produced` are **expansions taken from this
  re-fetch, not from the dossier**. All were confirmed verbatim on the live page.
- <https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> and
  <https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)> — §3.2 / §3.3, already marked
  `(re-fetched)` inline.

**Character inventory.** Romanian is written in the **Latin script**, a **31-letter alphabet** with
five special letters: **ă, â, î, ș, ț**. Direction is **left-to-right**; words are
**whitespace-separated** with no special segmentation rules. Hyphenation follows syllabification, and
Romanian additionally uses an **orthographic hyphen (cratimă)** inside contracted forms — *într-o,
s-a, mi-e* — which is part of the spelling and **must never be deleted** in translation.

### 3.1 The comma-below vs cedilla hazard — the #1 Romanian Unicode trap

The correct Romanian letters are **ș = U+0219** (s with comma below) and **ț = U+021B** (t with comma
below). The look-alikes **ş = U+015F** and **ţ = U+0163** are the **Turkish cedilla** letters and are
**wrong for Romanian** — even though enormous amounts of legacy digital text and many older fonts
still emit them.

- Correct forms: „The correct letters are **ș** (comma below, U+0219) and **ț** (comma below,
  U+021B). The lookalikes **ş** (U+015F) and **ţ** (U+0163) are _Turkish_ cedilla letters.”
  — <https://elon.io/grammar/romanian/spelling/s-t-comma> *(grammar-teaching site; non-vendor)*
- Visual difference: a comma below „floats just under the letter with a small gap … like a
  punctuation comma flipped down”, whereas a cedilla „is a hook that curls and attaches directly to
  the bottom of the letter (the same mark as in French _garçon_).” — same source.
- Why it breaks silently: „To a computer, _ş_ (U+015F) and _ș_ (U+0219) are as different as _a_ and
  _b_. Search for "_București_" (correct) in a document that wrote "_Bucureşti_" (cedilla) and you may
  get **zero results**.” — same source. Cedilla forms also **scatter a sorted list** and „mark a
  document as old, machine-mangled, or sloppily produced.”
- Origin of the mess (re-fetched and confirmed, upgraded from ⚠): an early operating-system codepage
  implementation assigned Romanian to the Turkish cedilla codepoints — „caracterele Ş/ş și Ţ/ţ au
  atribuite codurile Unicode U015E (S cu sedilă), U015F (s cu sedilă), U0162 (T cu sedilă) și U0163
  (t cu sedilă)”, whereas Romanian requires „U0218 (S cu virgulă), U0219 (s cu virgulă), U021A (T cu
  virgulă) și U021B (t cu virgulă).” — <https://www.secarica.ro/ro/rou/s-uri-si-t-uri>
  — **read those two quotes by codepoint, not by eye.** The first one carries the **cedilla** letters
  **Ş U+015E / ş U+015F / Ţ U+0162 / ţ U+0163**, because the wrong codepoints are exactly what it is
  describing; the conjunction *și* inside it is correctly **ș U+0219**. The second quote names the
  comma-below codepoints Romanian actually requires. Printing comma-below letters in the first quote
  would invert the source and contradict the table below.

**Codepoints to standardize on (copy exactly):**

| Correct (comma-below) | Codepoint | Wrong (cedilla) | Codepoint |
|---|---|---|---|
| ș | U+0219 | ş | U+015F |
| Ș | U+0218 | Ş | U+015E |
| ț | U+021B | ţ | U+0163 |
| Ț | U+021A | Ţ | U+0162 |

- ✅ Romanian (comma-below): **București**, **și**, **înțelege**, **rețea neuronală**
- ❌ Cedilla forms: **Bucureşti**, **şi**, **înţelege**, **reţea neuronală** *(look nearly identical
  at small sizes; break search/sort)*

**Web-font / rendering pitfalls to enforce:**
- Ship a font that actually carries **comma-below glyphs** — a **Noto** family (Noto Sans / Noto
  Serif) or a modern system UI font is the safe default. Some fonts render U+0219/U+021B as a cedilla
  or as a `.notdef` box.
- Set **`lang="ro"`** on the root element so the browser/font can apply Romanian-preferred glyph
  shaping (some fonts locale-switch the ș/ț shape).
- **QA step:** grep the final bundle for **U+015F / U+0163 / U+015E / U+0162** and replace with the
  comma-below codepoints. Never rely on visual inspection alone — the two forms are nearly
  indistinguishable at UI sizes (§11).

### 3.2 The â/î spelling rule

**î** is written at the **immediate start and end** of a word; **â** is written **inside** a word.
- „î se scrie întotdeauna la începutul și la sfârșitul nemijlocit al cuvântului” … â appears „în
  corpul cuvintelor” — <https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> (re-fetched).
- ✅ **î** at edges: **î**nvăța, **î**nger, cobor**î** · ✅ **â** inside: c**â**nd, v**â**nt, rom**â**n,
  sf**â**nt
- ❌ **â** at a word edge (*ânvăța*, *cobora → coborâ* mis-split) or **î** inside a plain stem
  (*cînd*, *vînt* — the pre-1993 spelling; **not** current DOOM norm).

*(The â/î distinction was reinstated by Academia Română in 1993; the current DOOM3 norm uses it.)*

### 3.3 Punctuation & quotation marks

Primary Romanian quotation marks are **„…”** (opening low "99-below" **U+201E**, closing high
"99-above" **U+201D**); the inner / second-level marks are the guillemets **«…»** (U+00AB / U+00BB).
- Nesting rule: „ghilimelele «...» se așază în interiorul textului cuprins între ghilimelele
  [„...]” — <https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)> (re-fetched).
- ✅ Romanian: **„apasă aici”** · ✅ nested: **„un text «citat» în interior”**
- ❌ Straight ASCII **"apasă aici"** · ❌ English curly (high-open) **“apasă aici”**

**Romanization — not applicable.** Romanian is natively a Latin-script language, so there is **no
transliteration/romanization step** and nothing to keep out of the UI here.

Sources: <https://www.secarica.ro/ro/rou/s-uri-si-t-uri> ·
<https://elon.io/grammar/romanian/spelling/s-t-comma> ·
<https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> ·
<https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)>

---

## 10. Technical integration checklist

- **Fonts to ship:** a font that carries **comma-below ș/ț (U+0219/U+021B)** glyphs plus ă/â/î — a
  **Noto** family (Noto Sans / Noto Serif) is the safe default. Verify that ș/ț render as
  **comma-below, not cedilla**, and that the **„…”** low-9/high-6 quote glyphs exist (§3). Missing or
  cedilla-substituted comma-below glyphs are the top Romanian rendering defect.
- **`lang` / `dir` attributes:** `lang="ro"` (base) and `lang="ro-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="ro"` also lets the font apply
  Romanian-preferred ș/ț shaping (§3).
- **Comma-below normalization (highest-value Romanian automation):** the build or an editorial lint
  must **replace cedilla codepoints U+015F / U+0163 / U+015E / U+0162 with the comma-below forms
  U+0219 / U+021B / U+0218 / U+021A** across all `ro` content (§3/§11). This cannot be caught by eye.
- **Preserve the cratimă (orthographic hyphen):** never strip the hyphen in *într-o, s-a, mi-e* — it
  is part of the spelling, not optional punctuation (§3).
- **Quotation marks:** normalize straight/English quotes in body copy to Romanian **„…”** (U+201E
  open, U+201D close), nested **«…»** (U+00AB / U+00BB) (§3).
- **Index alphabet for glossary navigation:** Romanian collation order —
  `a ă â b c d e f g h i î j k l m n o p q r s ș t ț u v w x y z` (ă, â, î, ș, ț sort in their
  Romanian positions, not at the end). Drive this from **CLDR `ro` collation** rather than a naive
  Unicode-codepoint sort (which would misplace the diacritics and could split ș/ț from s/t).
- **Numbers / dates / currency in display vs identifiers:** display per §5 (comma decimal, space or
  period grouping, `2 345,67 RON` with space, `26.07.2026`, 24-hour time, lowercase months); keep
  Western digits and ISO 8601 (YYYY-MM-DD) for backends/identifiers/code. Cross-check display formats
  against the current CLDR `ro` locale.
- **No romanization step:** Romanian is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://www.secarica.ro/ro/rou/s-uri-si-t-uri> ·
<https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> ·
<https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Cedilla-form scan (the top Romanian defect):** flag **any** occurrence of **U+015F ş / U+0163 ţ /
  U+015E Ş / U+0162 Ţ** in `ro` content — these must be the comma-below **U+0219 ș / U+021B ț / U+0218
  Ș / U+021A Ț**. This is deterministic and cannot be eyeballed; make it a hard build check (§3).
- **Diacritic-presence check:** a near-total absence of **ă â î ș ț** across a body of text that
  should be Romanian signals ASCII-stripped or untranslated output — flag it.
- **â/î sanity:** flag **î inside a stem** (*cînd*, *vînt* — pre-1993 spelling) and **â at a word
  edge**; current DOOM norm is î at start/end, â inside (§3.2).
- **Forbidden punctuation in body copy:** no straight ASCII `"` `'` and no English curly “…” — Romanian
  body copy uses **„…”** (U+201E / U+201D) with nested **«…»** (§3.3). Do not strip the **cratimă**
  hyphen in *într-o / s-a / mi-e*.
- **Number/currency format:** no period-as-decimal or comma-as-thousands inside numbers — Romanian
  uses **comma decimal** (`3,14`, not `3.14`); currency **symbol/code after** the amount with a space
  (`19,99 lei`, `2 345,67 RON`), never before (§5).
- **Register consistency (tu):** tu is the recorded register (§4) — scan second-person copy for
  **stray dumneavoastră forms** (plural verb agreement *apăsați / selectați / vedeți*, the pronoun
  *dumneavoastră*) in ordinary lesson/UI copy, and flag **any screen that mixes tu and dumneavoastră**
  (verb agreement changes throughout). dumneavoastră is correct only on legal/consent/account
  surfaces.
- **Regionalism scan:** flag Moldovan-only regionalisms (*curechi*, *păpușoi*) in default content
  where the standard DOOM3 form (*varză*, *porumb*) is expected (§9).
- **Source-language leak scan (EN → RO):** left-in English function words (the, and, you, please), a
  stray free-standing "the" where the enclitic article is required (§4), invariable adjectives that
  fail to agree, or English number/date formatting surfacing in Romanian text.

Sources: <https://www.secarica.ro/ro/rou/s-uri-si-t-uri> ·
<https://ro.wikipedia.org/wiki/Ortografia_limbii_rom%C3%A2ne> ·
<https://dexonline.ro/article/08._Semnele_cit%C4%83rii_(ghilimelele)> ·
<https://ro.wikipedia.org/wiki/Separator_zecimal>

---

*Provenance note:* this guide is **authored from a single agent-native research dossier**
(self-fetched, quote-per-claim), then **independently reviewed against its cited sources**. During
that review, four load-bearing anchors were re-fetched and confirmed — **doom.lingv.ro** (DOOM3,
printed 2021, Univers Enciclopedic, free under CC BY-NC-SA), **dexonline.ro** (quotation-mark rule),
**secarica.ro** (comma-below vs cedilla codepoints + the legacy-codepage origin, which upgraded
that claim from ⚠ to confirmed), and **ro.wikipedia Ortografia** (the â/î rule). Its **strong**
sections (§2 authorities, §3 typography, and the core-concept rows of §6) rest on those anchors and
carry verbatim quotes; its **thin** sections (§4 grammar, §7 idioms, §9 regional variation, the
AI-operational rows of §6, and the plain-language gap in §8) rest on educational sites, a labeled
localization-vendor page (vendor unnamed per the vendor-neutral scrub), translator judgment, and
search summaries, and are marked **⚠** at point of use. No AI product/model/company names appear.
**A native-speaker review is still outstanding** (see Status in the header).
