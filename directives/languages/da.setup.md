<!-- base -->
# lang-da — Danish (dansk) — setup & sources

> **The translation guide itself is [`da.md`](da.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Danish has a
single clear state language authority, which anchors the strong sections well.

- **Dansk Sprognævn (DSN)** — the official national language council; follows language development,
  advises, and **sets the spelling rules**. Its consumer portal **sproget.dk** hosts the searchable
  rules and the Q&A "svarbase". Primary sites: <https://dsn.dk/> · <https://sproget.dk/>.
- **Retskrivningsordbogen (RO)** — the authoritative orthography dictionary issued by DSN; current
  edition **November 2024** (in which DSN withdrew its recommendation of "nyt komma"). English
  Wikipedia (verified verbatim): *"Retskrivningsordbogen … is a Danish spelling dictionary published
  by the Danish Language Council to establish the official spelling of the Danish language."*
- **Den Danske Ordbog (ordnet.dk)** and **lex.dk / Den Store Danske** (Society for Danish Language
  and Literature) — the authoritative descriptive dictionary and encyclopedia, used here for meaning,
  usage, grammar, and the du/De register facts.
- **Unicode CLDR / LDML — `da` locale** — number, date, time, and currency locale data (decimal
  comma, full-stop grouping; currency = amount, no-break space, symbol). Checked against
  **CLDR 48.2 (2026-03-17)**; the chart link is Unicode's version-agnostic *latest* permalink,
  replacing the bare project landing page this guide previously cited.
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/da.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>.
- **Style guidance for digital content:** there is **no single mandated Danish digital style
  manual**; organizations follow DSN/RO plus an in-house *sprogguide*, and public-sector writing
  follows the **klarsprog** tradition, including the Ombudsman's *Håndbog i klarsprog* (§8).

**Source-tier caveat (read before trusting a section).** The **strong** sections — typography (§3),
authorities (§2), grammar register + core facts (§4), numbers/currency (§5), plain language (§8),
regional variation (§9) — rest on **DSN/sproget.dk, RO, lex.dk, da.wikipedia, CLDR** and carry
verbatim quotes. The **weaker** sections — the terminology **seed table** (§6) and the **idiom
table** (§7) — rest on **Danish educational/community glossaries** (ai-foralle.dk, viden.ai,
*labeled "(localization source)"*) and **translator craft**; they are the best available but are
marked **⚠ community/craft-tier, native-speaker confirmation pending** at point of use and must not
be read as academy-sourced.

Sources: <https://dsn.dk/> · <https://sproget.dk/> ·
<https://en.wikipedia.org/wiki/Retskrivningsordbogen> · <https://lex.dk/> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/da.html>

---

## 3. Script & typography

**(Strong section — DSN/sproget.dk, lex.dk, RO, Unicode.)**

**Character inventory.** Danish is written in the **Latin alphabet with 29 letters**: a–z plus
**æ, ø, å** at positions **27–29** (da.wikipedia, *"Det dansk-norske alfabet består af 29 bogstaver:
a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, æ, ø, å."*). Those three
letters are near-unique to Danish among Latin-script languages: **verified verbatim** at
sproget.dk — *"Æ, ø og å bruges kun i enkelte af de skriftsprog der – som dansk – skrives med
latinske bogstaver."* **Å is the youngest letter, introduced in 1948**; before that (and still in
proper names and older texts) the digraph **aa** was used, so **å** and **aa** alternate (e.g.
*Aarhus* / *Århus*) and *aa* collates as *å* (§10).

**Unicode range.** All Danish letters live in **Basic Latin (U+0000–U+007F)** and **Latin-1
Supplement (U+0080–U+00FF)** — **no extended block needed**. Code points: **æ U+00E6 / Æ U+00C6**,
**å U+00E5 / Å U+00C5**, **ø U+00F8 / Ø U+00D8** (the last confirmed verbatim in da.wikipedia:
*"I unicode er Ø U+00d8 og ø U+00f8."*). Store text as **NFC** — keep these as single precomposed
code points and avoid decomposed forms (e.g. *a* + combining ring), which break search and sorting.

**Direction & tokenization.** **LTR**; words are **whitespace-separated** with standard Unicode
word-break, so ordinary tokenization and word-based highlighting work with no RTL/bidi handling. The
one wrinkle is **compounding**: Danish writes noun compounds as a single token (*maskinlæringsmodel*,
*træningsdata*), so a term that is two words in English is one word — and one highlight span — in
Danish (§4).

**Quotation marks — the one that is always wrong first.** Danish has **two standard styles**: low-
high double commas **„…”** and inward guillemets **»…«** (lex.dk/anførselstegn: *"På dansk anvendes
to forskellige typer: dobbeltkommaer „…” og vinkler »…«."*). RO prescribes **no** fixed form — it is
an aesthetic choice, but **be consistent within a text**: *"Retskrivningsordbogen foreskriver ikke
nogen bestemt form, så det er et typografisk æstetisk valg, hvilke der anvendes."* Nested quotes use
single variants (*‘…’* / *‚…’* / *›…‹*). The English straight/curly style is *"vinder mere og mere
indpas på dansk"* but should not be the default. **Pick one native style and apply it everywhere.**

- ✅ Danish: **»klik her«**  ·  ✅ alt native style: **„klik her”**  ·  ✅ nested: **»tekst ›indeni‹ tekst«**
- ❌ Straight ASCII: **"klik her"**  ·  ❌ English curly (high-open, high-close): **“klik her”**

**Line-breaking / hyphenation.** Rules are in RO §§ 15–17 (*orddeling ved linjeskift*) and § 57
(*bindestreg*): division is marked with a hyphen at line end, **monosyllables are not divided**, and
you may not break so that an impossible initial consonant cluster starts the next line; division
follows meaningful word parts (compounds) or may disregard meaning for inflected/derived forms
(dsn.dk RO §15). Set `lang="da"` so the browser applies its Danish hyphenation dictionary with
`hyphens: auto`; do not hand-insert hyphens.

**Web fonts.** Because every Danish letter is Basic Latin / Latin-1 Supplement, **glyph coverage is a
non-issue** for any reasonable Latin web font — verify only that **æ ø å (upper and lower)** and the
**„…” / »…«** quotation glyphs render. A Noto family (Noto Sans / Noto Serif) is a safe default.

**Romanization — not applicable.** Danish is natively a Latin-script language; there is **no
transliteration/romanization step** and nothing to keep out of the UI.

Sources: <https://da.wikipedia.org/wiki/Det_dansk-norske_alfabet> ·
<https://sproget.dk/sprogviden/sprogtemaer/ae-oe-og-aa/> ·
<https://da.wikipedia.org/wiki/Ø_(bogstav)> · <https://lex.dk/anførselstegn> ·
<https://dsn.dk/ordboeger/retskrivningsordbogen/§-15-17-orddeling-ved-linjeskift/§-15-almindelige-retningslinjer/>

---

## 10. Technical integration checklist

- **Fonts to ship:** any reasonable Latin web font covers Danish — **glyph coverage is a non-issue**
  (æ ø å are Basic Latin / Latin-1 Supplement, §3). Verify only that **Æ æ / Ø ø / Å å** and the
  **„…” / »…«** quotation glyphs render. A **Noto** family (Noto Sans / Noto Serif) is a safe default.
- **`lang` / `dir` attributes:** `lang="da"` (base) and `lang="da-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="da"` also switches on the browser's
  Danish hyphenation dictionary (§3).
- **Quotation marks:** normalize straight/English quotes in body copy to one Danish native style —
  **»…«** (U+00BB / U+00AB) *or* **„…”** (U+201E open, U+201D close) — and keep it consistent;
  nested single **›…‹** / **‘…’** (§3).
- **Numbers / dates / currency in display vs identifiers:** display per §5 (full-stop grouping, comma
  decimal, `99,95 kr.` with the label after the amount and a space, `2.10.2003`, 24-hour time); keep
  Western digits and ISO 8601 (YYYY-MM-DD) for backends / identifiers / code.
- **Index alphabet for glossary navigation:** use **Danish collation order** — **æ, ø, å sort last,
  at positions 27–29**, *after* z, and **aa collates as å** (§3). Drive this from **CLDR `da`
  collation** rather than a naive Unicode-codepoint sort (which would misplace æ ø å and scatter *aa*
  names).
- **Compounding & tokenization:** expect **single-token compounds** (*træningsdata*, *sprogmodel*) —
  a glossary term or highlight span that is two words in English is **one word** in Danish (§4). Do
  not split compounds for matching.
- **Line-breaking / hyphenation:** `hyphens: auto` with `lang="da"`; monosyllables do not divide
  (§3). Do not hand-insert hyphens.
- **No romanization step:** Danish is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://da.wikipedia.org/wiki/Det_dansk-norske_alfabet> · <https://lex.dk/anførselstegn> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/da.html> ·
<https://dsn.dk/ordboeger/retskrivningsordbogen/§-15-17-orddeling-ved-linjeskift/§-15-almindelige-retningslinjer/>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script / diacritic presence:** `da` content is Latin script, but a **near-total absence of
  æ, ø, å** across a body of text that should be Danish signals ASCII-stripped output (e.g. *ae/oe/aa*
  homoglyph substitution) — flag it. Confirm the code points are the **precomposed** forms
  (U+00E6 / U+00F8 / U+00E5), not decomposed sequences.
- **Forbidden punctuation in body copy:**
  - No **straight ASCII quotes `"` `'`** and no **English curly quotes “…” ‘…’** in body copy —
    Danish uses **»…«** or **„…”** (and nested **›…‹** / **‘…’**), applied **consistently** (§3).
  - No **period-as-decimal or comma-as-thousands** inside numbers — Danish uses **comma decimal +
    full-stop (or space) grouping** (`12.345,67`, not `12,345.67`) (§5).
- **Currency placement:** the label **kr.** must come **after** the amount with a space in prose
  (`99,95 kr.`); flag `kr. 99,95` in running text (§5).
- **Date format:** flag **US month-first** (`10/2/2003`, `October 2`) and **capitalized month/weekday
  names** — Danish is day-month-year with lower-case month names (§5).
- **Compound integrity:** flag **spaced compounds** where Danish requires one word — a "split-
  compound" like *sprog model* / *trænings data* is a spelling error (§4).
- **Register consistency (du):** du is the recorded register (§4) — scan second-person copy for stray
  **De / Dem / Deres** forms (capital-D polite pronoun); each is a register defect against the
  recorded du baseline. (Do not flag lower-case *de* = "they".)
- **V2 word-order sanity:** after a **fronted adverbial** (Nu, Derfor, Så, Herefter…), the finite
  verb must be **second** (*Derfor kan modellen…*); flag *Derfor modellen kan…*-type SVO clones (§4).
- **Source-language leak scan (EN → DA):** left-in English function words (the, and, you, please),
  bare-English tech terms left uninflected where Danish grammar needs the enclitic article
  (*token* → *tokenet*, §6), or English number/date/currency formatting surfacing in Danish text.

Sources: <https://lex.dk/anførselstegn> ·
<https://sproget.dk/raad-og-regler/artikler-mv/svarbase/SV00015797> ·
<https://da.wikipedia.org/wiki/Det_dansk-norske_alfabet> ·
<https://lex.dk/inversion_-_omvendt_ledstilling/ordstilling> · <https://lex.dk/tiltaleform>

---

*Provenance note:* this guide is **authored from a single agent-native research dossier**
(self-fetched, quote-per-claim), then **independently reviewed against its cited sources**. Four
load-bearing anchors were re-fetched and confirmed verbatim: the Retskrivningsordbogen publisher/
purpose sentence (en.wikipedia), the *"Æ, ø og å bruges kun i enkelte af de skriftsprog…"* sentence
(sproget.dk), the du/De register facts *"På arbejdspladser er De blevet yderst sjældent"* /
*"Brugen af du blev stadig mere intens i løbet af 1900-tallet"* (lex.dk/tiltaleform), and the
*"Rækkefølgen i traditionel dansk datoangivelse er dag, måned og år."* date sentence (sproget.dk).
Its **strong** sections (§2 authorities, §3 typography, §4 grammar register + core facts, §5
numbers/currency, §8 plain language, §9 regional variation) rest on **DSN/sproget.dk, RO, lex.dk,
da.wikipedia, CLDR** and carry verbatim quotes; its **weaker** sections (§6 terminology seed table,
§7 idioms, and some §8 word-table rows) rest on **Danish educational/community glossaries
(localization sources) and translator craft** and are marked **⚠ community/craft-tier,
native-speaker confirmation pending** at point of use. Every ⚠ / editorial marker the dossier set has
been preserved. A native-speaker review against the §2 sources is still outstanding (see Status in
the header).
