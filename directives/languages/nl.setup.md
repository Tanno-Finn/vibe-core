<!-- base -->
# lang-nl — Dutch (Nederlands) — setup & sources

> **The translation guide itself is [`nl.md`](nl.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

<!-- lang-check: space-codepoint:00A0 - U+00A0 is named twice in the §5 note above only to record
     that the earlier non-breaking-space claim was withdrawn as unsourced. The guide deliberately
     prescribes an ordinary space, so the character must NOT appear in any example; its absence is
     the correct state, not the defect this check normally catches. -->

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **Nederlandse Taalunie** — the intergovernmental body (Netherlands, Flanders, Suriname) that sets
  official Dutch spelling and runs the clear-language campaign network. On its own remit:
  „De Taalunie zet zich al een aantal jaar actief in voor begrijpelijke overheidscommunicatie in
  Nederland en Vlaanderen.“ The authoritative word list / spelling guide (the *Leidraad* of *het
  Groene Boekje*) lives at **woordenlijst.org**.
  <https://taalunie.org/actueel/328/campagne-duidelijk-voor-begrijpelijke-overheidscommunicatie-van-start> ·
  <https://woordenlijst.org/> (Groene Boekje / Leidraad — appeared in research but **not**
  individually fetched; ⚠ verify before citing verbatim)
- **Taaladvies.net** — the Taalunie's public language-advice service; the practical first stop for
  spelling and punctuation rulings. Used below for the IJ capitalization rule and the
  quotation-mark conventions.
  <https://taaladvies.net/ijsland/> · <https://taaladvies.net/aanhalingstekens-algemeen/>
- **Genootschap Onze Taal (Taalloket)** — the most-used independent usage reference for editors and
  writers; a large, well-indexed advice base.
  <https://onzetaal.nl/taalloket/enkele-aanhalingstekens>
- **CommunicatieRijk** — the Dutch central-government communications guidance, home of the
  **taalniveau B1** recommendation for public-sector text (see §8).
  <https://www.communicatierijk.nl/vakkennis/rijkswebsites/aanbevolen-richtlijnen/taalniveau-b1>
- **The Unicode Standard + CLDR — `nl` locale.** Latin script; the `nl` number/date/currency
  patterns. ✅ **Re-read against CLDR 48.2 (2026-03-17)**, replacing this guide's earlier **v44**
  chart citation. The separator conventions were unchanged (**comma decimal, dot grouping**), the
  currency pattern **`¤ #,##0.00`** is now confirmed from the release data rather than from a
  search result — but the **negative** form was wrong and has been corrected in §5. The chart link
  is Unicode's version-agnostic *latest* permalink, so it tracks the current release.
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/nl.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **Noto Sans / Noto Serif** — broadly available open web fonts with full Latin + diaeresis
  coverage (é, ë, ï), safe defaults for Dutch.
  <https://fonts.google.com/noto/specimen/Noto+Sans> ·
  <https://fonts.google.com/noto/specimen/Noto+Serif>
- **Most-used general style references (editorial):** *Schrijfwijzer* (Jan Renkema) and the
  *Van Dale* dictionaries are the de-facto style and lexical references in Dutch editing alongside
  Onze Taal. (Editorial — widely known; not individually fetched.)

**Provenance caveat.** Several claims below rest on **Wikipedia** (IJ alphabetization, the V2
word-order summary, the tutoyeren register history, the date/time notation, and the NL-vs-Flanders
vocabulary contrasts) or on **editorial/textbook knowledge** (the false friends, one terminology
row). A third tier sits below both: material merged from the **companion research pass** — the
§Header speaker figures and seven §6 terminology rows — which arrived with
citations that do not actually underwrite it and is labeled **effectively uncited** at each point
of use. (The §7 stock-phrase table came from the same pass and was in the same state; it has since
been re-sourced row by row against the ANW, Taaladvies, and Dutch technical prose, and each row now
carries its own tier.) These are all marked where they are used; the primary
authorities above are the ones this guide leans on. One research source — a tertiary AI-generated
encyclopedia page cited for the V2 word-order claim — is **withheld under the kit's
source-neutrality rule** (no AI-vendor/tool names); the claim is textbook-standard Dutch syntax and
is kept as editorial, not on that citation.

Sources: the authority list above *is* this section's source list — every entry carries its URL
inline.

---

## 3. Script & typography

**Character inventory & Unicode range.** Dutch uses the standard **Latin alphabet** (Basic Latin
U+0041–U+007A) plus a few accented letters from **Latin-1 Supplement / Latin Extended-A** — chiefly
**é, ë, ï, ö, ü** in loanwords and the diaeresis (*trema*) that separates vowels belonging to
different syllables (*coördinatie*, *reëel*, *financiën*). No romanization applies; body content is
native Latin script throughout.

**The IJ digraph — capitalization (the single most important typographic trap).** When a word
beginning with *ij* is capitalized, **both letters capitalize together**. Taaladvies.net (Taalunie
advice service) states the rule and its exception verbatim:

> „Als een woord dat met een ij begint met een hoofdletter moet worden geschreven, moet de ij in
> zijn geheel in hoofdletters worden gezet.“
> „De ij vormt echter een uitzondering op deze regel en moet met twee hoofdletters worden
> geschreven.“

Therefore, at sentence start, in headings, in title-case UI labels, and in all-caps buttons:

- ✅ **IJsland**, **IJmuiden**, **IJssel**, **IJ**verkoop (all-caps)
- ❌ **Ijsland**, **Ijmuiden** — capitalizing only the *I* is the classic defect a naive
  title-caser produces.

**IJ alphabetization.** In dictionaries and sorting, *ij* is sorted as **i + j** (between *ih* and
*ik*), **not** as *y*. Wikipedia: „Dutch dictionaries since about 1850 invariably sort ij as an i
followed by a j“ (⚠ Wikipedia, not a primary authority; corroborated by a Taaladvies category page
that was not individually fetched — treat the sort order as editorial-confirmed).

**Unicode note on IJ — avoid the precomposed codepoint.** The precomposed **U+0132 Ĳ / U+0133 ĳ**
exist in Latin Extended-A but are **deprecated in practice**; Dutch text should be encoded as two
separate characters **`I`+`J` / `i`+`j`**, which is what dictionaries, fonts, and input methods
expect. (Editorial — the codepoints exist, but avoid them in content and in stored strings.)

- ✅ store/render `IJ` as `I` + `J` (two codepoints)
- ❌ store the ligature `Ĳ` (U+0132) — breaks search, sorting, and copy/paste.

**Punctuation & quotation marks.** Dutch defaults to **single** quotation marks for most functions;
**double** marks are reserved mainly for quotations. Taaladvies.net:

> „Enkele aanhalingstekens worden het meest gebruikt.“
> „Dubbele aanhalingstekens worden vrijwel alleen gebruikt om citaten weer te geven.“
> „Een citaat binnen een citaat wordt meestal met afwijkende aanhalingstekens gemarkeerd: enkele
> als het hele citaat tussen dubbele staat, of andersom.“

Onze Taal on where the single marks apply: „Enkele aanhalingstekens ('deze') kun je onder meer
gebruiken bij titels, bij ironisch taalgebruik en bij zelfbedachte woorden.“ Modern Dutch print and
web overwhelmingly use the **high-9 / high-6** marks ‘ ’ and “ ” (the „Angelsaksische“ / high-comma
style). The German-style **low-opening „…“ form is *not* the digital-content default** — do not
import it into Dutch copy (the Taalunie/Onze Taal authorities never prescribe low marks, and the
CLDR `nl` delimiters are the high forms). This is editorial synthesis grounded in the sourced rules
above.

- ✅ single for a coined/ironic term or title: **‘zelfrijdende’ auto**, **‘De avonden’**
- ✅ double only for a real citation: **“Ik kom morgen,” zei ze.**
- ❌ German low quotes in Dutch body copy: **„zelfrijdende“ auto** (this is exactly the trap; low
  marks read as an import error in Dutch)

**Whitespace & spacing.** Standard Western spacing: a single space after sentence punctuation, no
space before `.,;:!?`. The euro sign takes a space before the amount (`€ 1.234,56` — §5).

**Hyphenation & line-breaking.** Dutch permits soft hyphenation of long compounds, but the **ij
digraph must never be split across a line break** — keep `i` and `j` together. On the web, set
`lang="nl"` and let `hyphens: auto` use the Dutch hyphenation dictionary. The `lang="nl"` attribute
is load-bearing: hyphenation, spell-check, and font shaping all select Dutch rules from it.
(Editorial — Latin-script standard; the `lang` requirement is the concrete rule.)

- ✅ break `be‑lang‑rijk`; keep `bij‑zon‑der` with the *ij* intact
- ❌ a break that splits `bi‑j...` inside the digraph

**Fonts & known pitfalls.** No special glyph coverage is needed beyond Latin-1 plus the accented
letters above; **Noto Sans / Noto Serif** or any competent Latin web font renders Dutch. The one
caveat: **`IJ` is two glyphs** — avoid fonts or OpenType features that fake a single ligated **Ĳ**,
so the digraph stays copy-paste- and search-safe.

Sources: <https://taaladvies.net/ijsland/> · <https://taaladvies.net/aanhalingstekens-algemeen/> ·
<https://onzetaal.nl/taalloket/enkele-aanhalingstekens> ·
<https://en.wikipedia.org/wiki/IJ_(digraph)> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/nl.html> ·
<https://fonts.google.com/noto/specimen/Noto+Sans>

---

## 10. Technical integration checklist

- **Fonts to ship.** Any competent Latin web font with Latin-1 + diaeresis coverage (é, ë, ï, ö, ü);
  **Noto Sans / Noto Serif** are safe defaults. **Do not** enable an OpenType feature that ligates
  `IJ` into a single **Ĳ** glyph — keep the digraph as two characters (§3).
- **`lang` / `dir` attributes.** `lang="nl"` (base) and `lang="nl-easy"` (simplified variant,
  subject to the §Header token note); use `lang="nl-BE"` for a Flanders build. **`dir="ltr"`**
  throughout. Correct `lang` per variant and per foreign passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA), and `lang="nl"` is what selects Dutch hyphenation, spell-check, and shaping (§3).
- **Line-breaking / hyphenation.** Enable `hyphens: auto` with `lang="nl"` so the browser uses the
  Dutch hyphenation dictionary; ensure the **ij digraph is never split** across a line break (§3).
- **Index alphabet for glossary navigation.** Standard **Latin A–Z**, with the **ij digraph sorted
  as `i` + `j`** (between *ih* and *ik*), **not** as *y* (§3). Drive collation from CLDR `nl`
  collation data rather than a hard-coded list if precision matters.
- **Tokenization / highlighting.** Whitespace word separation applies — standard word tokenizers and
  word-boundary highlighting work; no bidi or shaping handling is required.
- **Quotation marks in content.** Dutch high marks — single ‘ ’ by default, double “ ” for citations
  (§3). A content check should flag imported German **„…“** low quotes in Dutch body copy.
- **Numbers, dates, currency.** Comma decimal, dot grouping; `€ ` before the amount with a space;
  dates `dd-MM-yyyy` or „25 juli 2026“ (lowercase month); 24-hour time (§5). Keep Western digits for
  machine identifiers and ISO-8601 backends.
- **Zero-width / precomposed traps.** Do **not** store the precomposed `Ĳ` (U+0132) / `ĳ` (U+0133) —
  store `I`+`J` / `i`+`j` (§3); a normalization pass must not fold the two-character form into the
  ligature.

Sources: <https://fonts.google.com/noto/specimen/Noto+Sans> · <https://taaladvies.net/ijsland/> ·
<https://en.wikipedia.org/wiki/IJ_(digraph)> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/nl.html>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** The large majority of characters in `nl` content are **Basic Latin +
  Latin-1/Extended-A accents** (é, ë, ï, ö, ü). A run of non-Latin characters signals untranslated
  or wrong-script text.
- **IJ capitalization check.** Flag a capitalized word starting **`Ij`** at sentence start, in a
  heading, or in a title-cased label — it should be **`IJ`** (*IJsland*, not *Ijsland*, §3). Also
  flag the precomposed **`Ĳ` / `ĳ`** (U+0132 / U+0133) in stored text.
- **Quotation-mark style.** Flag German-style low **`„`** (U+201E) in Dutch body copy — Dutch uses
  high marks (single default, double for citations, §3). *(The guide's own English prose uses „…“ as
  house style; this check targets Dutch content, not the guide.)*
- **Number formatting.** Decimal separator is **comma**, grouping separator is **dot** — flag
  English-style `12,500.5` / `1,000,000` in Dutch content. Currency: **`€ `** before the amount with
  a space (§5).
- **Date format.** Little-endian **`dd-MM-yyyy`**; flag American middle-endian `MM-dd-yyyy` and
  capitalized month names (months/weekdays are lowercase in Dutch, §5).
- **Register consistency.** Once the §4 register is fixed for the build (je/jij default, or u for a
  formal/Flanders build), scan second-person copy for **drift** — a stray *u/uw* in a je/jij build
  or a stray *je/jij* in a u build, and mismatched verb agreement (*jij hebt* vs *u hebt/heeft*) — a
  mix is a defect.
- **False-friend scan.** Flag **eventueel** where „eventually“ (→ *uiteindelijk*) is meant, and
  **biljoen** where „billion“ (→ *miljard*) is meant (§4, §5).
- **Word-order / calque scan (EN → NL).** Flag verb-in-3rd-position after a fronted phrase
  (*Vandaag ik lees…*), verb-not-final in a *dat/omdat/als* subclause, a dropped/misplaced separable
  particle (*Voer in je naam*), and the *is + …end* progressive calque (*is lerend*).
- **Regional-marking scan (NL-primary build).** Flag BE-marked vocabulary where an unmarked
  pan-Dutch form exists (*rondpunt* → *rotonde*, *dampkap* → *afzuigkap*, *verwittigen* →
  *waarschuwen*), and the Flemish linking-s compounds (*vervoersbewijs*, *belastingsaangifte*), §9.
- **Source-language leak scan (EN → NL).** Left-in English function words (the, and, you, please),
  and untranslated UI verbs.

Sources: <https://taaladvies.net/ijsland/> · <https://en.wikipedia.org/wiki/IJ_(digraph)> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/nl.html> ·
<https://en.wikipedia.org/wiki/Date_and_time_notation_in_the_Netherlands>

---

*Provenance note:* this guide is built from external desk research on one brief — a main pass whose
Dutch quotes were **then independently reviewed against their cited sources** (the verbatim
quotes from Taaladvies, Taalunie, Onze Taal, CommunicatieRijk, and the CLDR/Wikipedia sources are
trustworthy), plus a **companion pass** merged on **2026-07-27**. Everything taken from the
companion pass is weaker evidence and is marked at point of use: the §Header speaker figures and
seven §6 terminology rows whose only attached URL does not carry the terms. Several other claims rest on
**Wikipedia** (IJ alphabetization, word order, tutoyeren
history, date/time notation, NL-vs-Flanders vocabulary) or on **editorial/textbook** knowledge (the
§4 false friends and aspect features); each is
marked at point of use. Three audit-mandated corrections are applied: the composed currency string
**„€ 1.234,56“ is presented as derived/editorial**, not as a fetched authority string (only its
separators and €-placement are sourced, §5); the **non-breaking-space** claim in §5 is
**withdrawn** as unsupported by either research pass and contradicted by every literal in the file;
and the **tertiary AI-generated source** cited for the
V2 word-order claim is **withheld under the kit's source-neutrality rule** (§2, §4). The §5
**negative-currency correction** (`¤ #,##0.00;¤ -#,##0.00`, against a dossier that stated a
trailing sign) stands unchanged and is deliberate. All **⚠**
markers indicate claims the research itself could not source, or that could not be confirmed from
the primary authorities in §2. A **native-speaker review** against the §2 sources is still
outstanding (see Status in the header).

*Evidence pass (§7 idiom table, 2026-07-27).* The stock-phrase table arrived from the companion pass
with **no per-row citation** and shipped as blanket "research-tier". Every ✅ has now been taken back
to a source and carries a tier — the ANW (Instituut voor de Nederlandse Taal), Taaladvies.net, Onze
Taal, `woorden.org`, and Dutch technical prose — and the tier decides whether a row may inform a §11
check. The wrong-calque column stayed the weak half and is now labeled **craft**: not one of its
forms could be sourced to a Dutch anglicism advice page, and the Taalunie's own page on the subject
says why — "Er bestaat geen vaste en/of uitputtende lijst van barbarismen in het Nederlands." Three
cells were **removed or narrowed** because they condemned ordinary Dutch: *onder de kap* (native
automotive idiom), *terug en vooruit* (the standard rendering of browser back/forward navigation),
and *bij een blik* (narrowed — *bij een blik op X* is fine). One correction is load-bearing beyond
§7: **in eenvoudige taal is not an error**. It is the Rijksoverheid's own label — it publishes
budget summaries as "Prinsjesdag 2025 in eenvoudige taal" — and it names the **Easy-Language**
register, i.e. what an `nl-easy` translator should be reaching for, while *duidelijke taal* is the
plain-language campaign's term. §8 should be read with that distinction in mind.
