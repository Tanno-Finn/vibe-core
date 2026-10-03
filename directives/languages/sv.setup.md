<!-- base -->
# lang-sv — Swedish (svenska) — setup & sources

> **The translation guide itself is [`sv.md`](sv.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

| Authority | Role | Source + verbatim |
|---|---|---|
| **Institutet för språk och folkminnen (Isof)** / **Språkrådet** | The state body for the care of Swedish; Språkrådet is its language-care department | <https://www.isof.se/svenska-spraket> — the official language authority; the department "Avdelningen Språkrådet" sits within Isof. |
| **Myndigheternas skrivregler** | The de-facto style guide for public / digital Swedish; the guide this platform leans on most | <https://www.isof.se/utforska/vagledningar/myndigheternas-skrivregler> — "En vägledning för alla som skriver inom myndigheter, kommuner och annan offentlig verksamhet"; published by Isof, with chapters on "att skriva klarspråk, att skriva för webben och hur man arbetar med text och form". |
| **Svenska skrivregler** | Språkrådet's general writing-rules reference | <https://www.isof.se/svenska-spraket/sprakrad-och-skrivregler> — named (with "Språkrådet rekommenderar") as one of Språkrådet's best-known works *(⚠ search summary)*. |
| **Svenska Akademien — SAOL / SO / SAOB** (svenska.se) | Spelling (SAOL), meaning (SO), historical (SAOB) — the spelling authority | <https://svenska.se/> — "Sök i tre ordböcker på en gång" (SAOL, SO, SAOB), published by "Svenska Akademien". SAOL is treated as the final arbiter of Swedish spelling. |
| **Svenska datatermgruppen** | Swedish IT / computing terminology recommendations | Its recommendations (e.g. *neuronnät*) are cited via <https://sv.wikipedia.org/wiki/Artificiellt_neuronn%C3%A4t>. **Its dedicated Isof page 404'd during research** — so Datatermgruppen recommendations reach this guide only *second-hand via Wikipedia*, not from the group's own pages (see §6). |
| **Unicode CLDR — `sv` locale** | Number, currency, and format data (the §5 evidence base) | <https://www.unicode.org/cldr/charts/latest/verify/numbers/sv.html> · <https://www.unicode.org/cldr/charts/latest/summary/sv.html> — checked against **CLDR 48.2 (2026-03-17)**; the links are Unicode's version-agnostic *latest* permalinks. These replace the guide's earlier raw-JSON links to the `main` development branch, which tracked unreleased data rather than a release. Values unchanged: comma decimal, no-break-space grouping, amount-then-symbol currency — note the `sv` minus sign is **U+2212**, not ASCII `-`. |

**Provenance caveat.** Sections **D (numbers)** and the **plain-language authorities (F → §8)**
rest on strong primary sources (CLDR-direct JSON; Isof / Språklagen / MTM, quoted verbatim).
**Script/typography (A → §3)** and **authorities (B → §2)** trace to Isof / svenska.se / Svenska
skrivregler. Most **AI/ML terminology (E → §6)** is **Wikipedia-tier**, not academy-sourced —
because the Svenska datatermgruppen page 404'd, the group's recommendations survive here only as
Wikipedia quotations. **Regional variation (G → §9)** leans partly on **search summaries** and is
marked ⚠ where it does. **Idioms (H → §7)** arrived editorial and have since been **re-sourced row
by row** against Svensk ordbok and the Korp corpus; each row now carries its own tier, and the
wrong-calque column stays **craft**. Every ⚠ the dossier raised is carried below.

Sources: the table above *is* this section's source list — <https://www.isof.se/svenska-spraket> ·
<https://svenska.se/> · CLDR `sv` JSON (URLs in the table)

---

## 3. Script & typography

**Character inventory & Unicode.** Swedish uses the Latin alphabet plus **three extra vowel
letters — å, ä, ö** — which are **distinct letters, not accented variants**, and sort **after z**
at the very end of the alphabet (…x, y, z, å, ä, ö). Their code points:

| Letter | Lower | Upper |
|---|---|---|
| å | U+00E5 | U+00C5 |
| ä | U+00E4 | U+00C4 |
| ö | U+00F6 | U+00D6 |

All six sit in the **Latin-1 Supplement** block (U+0080–U+00FF); serve everything as **UTF-8**.
(**⚠** — the dossier flagged these code-point values as stated from standard reference knowledge,
not fetched during research; they are standard, trivially verifiable Latin-1 Supplement values.)

**Never substitute digraphs.** Rendering å/ä/ö as aa/ae/oe (a German-style or ASCII fallback) is
**wrong in Swedish** — it produces a different, misspelled word.

- ✅ **påstående · färg · över · Malmö**
- ❌ **paastaaende · faerg · oever · Malmoe**

*(⚠ the four ✅ words are this guide's own examples — the dossier states the digraph rule but
supplies no example words. Note that **på väg** is two words in standard Swedish; a compound
*påväg* is a spelling error of exactly the word-joining kind §4(1) warns about, so it must not be
used as an å-exemplar.)*

**Quotation marks — the "raised nines" (upphöjda nior).** Swedish uses the **same right-curved
mark ” ” at *both* the opening and the closing position** (unlike English “ ”).

- <https://sv.wikipedia.org/wiki/Citattecken> — "Av dessa ska endast de som är upphöjda och ser
  ut som nior enligt Svenska skrivregler normalt användas i svenskan"
- Guillemets are a traditional alternative, and in Swedish tradition **both** point the *same*
  way (tip to the right): »…» — "I svenska är inledande och avslutande tecken av tradition oftast
  riktade åt samma håll, med spetsen åt höger: »...»" (same page).

**Practical rule for the platform:** default to **” ”** (double raised-nine curly quotes, U+201D
at both ends); guillemets »…» are acceptable but old-fashioned. Do **not** use German-style „…”
(low-high) or English “ ”. *(⚠ editorial synthesis of the two sourced quotes above.)*

- ✅ Swedish: **”maskininlärning”** (raised nine both ends)
- ❌ German-style: **„maskininlärning”** · ❌ English: **“maskininlärning”**

**The nested (inner) pair is ’…’ — the single raised nine, ’ U+2019 at both ends.** A quote inside
a quote switches to the single mark, which is the same character Swedish uses as an apostrophe.
From the same sv.wikipedia page: "Om citatet innehåller ett citat skrivs citattecknen kring det
inre citatet om till enkla citattecken (apostrofer): Prästen predikade: ”Minns att Jesus sade:
’Saliga de som sörjer, de skall bli tröstade.’”" The page's convention table labels the pair ’O’ as
"Svensk, finsk och ungersk citering". This agrees with the CLDR `sv` locale data, read
codepoint-by-codepoint from the pinned **CLDR 48.2** release this session:
`alternateQuotationStart` = **’ U+2019**, `alternateQuotationEnd` = **’ U+2019** — and
`quotationStart` = `quotationEnd` = **” U+201D**, independently confirming the raised nine at both
ends of the outer pair.

Examples below reuse the page's own sentence rather than an invented one; the two wrong variants are
that same string with only the inner marks swapped.

- ✅ Inner level: **”Minns att Jesus sade: ’Saliga de som sörjer, de skall bli tröstade.’”**
- ❌ English inner marks: **”Minns att Jesus sade: ‘Saliga de som sörjer, de skall bli tröstade.’”**
- ❌ ASCII apostrophes as the inner pair: **”Minns att Jesus sade: 'Saliga de som sörjer, de skall bli tröstade.'”**

**Whitespace, thousands & non-breaking space.** Swedish groups thousands with a **space** (§5).
That is a typographic non-breaking-space concern: use a **no-break space (U+00A0) inside numbers**
so a grouped number never breaks across a line.

**The two spaces are visually identical, so this rule can only be stated by codepoint.** An ordinary
space U+0020 and a no-break space U+00A0 render the same and cannot be told apart in a rendered
example — printing them side by side would produce a ✅/❌ pair that is byte-identical and therefore
demonstrates nothing. The rule is therefore written with the HTML entity, exactly as the `pl` and
`cs` guides do:

| Group separator | Codepoint | Written as | Behavior |
|---|---|---|---|
| ✅ no-break space | **U+00A0** | `10&nbsp;000` · `1&nbsp;000&nbsp;000` | the number never splits across a line |
| ❌ ordinary space | **U+0020** | `10 000` (a plain space bar) | the renderer may wrap between *10* and *000* |
| ❌ wrong character entirely | U+002C / U+002E | `10,000` · `10.000` | English/German grouping — a Swedish reader misparses it |

So: ✅ `10&nbsp;000` — ❌ `10 000`. Where a template cannot carry an entity, emit the literal
U+00A0 byte; a build step or sanitizer that "normalizes whitespace" must be configured **not** to
fold U+00A0 to U+0020.

This sentence carries one literal instance of the character so the byte is present in this file and
not merely named: **10 000**. It is indistinguishable from the ❌ row above by eye, by
copy-paste into most editors, and in every rendered view — which is the entire reason the rule has
to be stated as a codepoint and checked as a codepoint.

*(⚠ editorial — the space *grouping character* is sourced in §5; the NBSP recommendation is the
typographic consequence.)*

**Hyphenation (avstavning).** Governed by *Myndigheternas skrivregler*, which has a dedicated
chapter — the guide covers "stavning, avstavning, böjning, ordbildning, … skiljetecken, hop- och
särskrivning" (<https://www.isof.se/utforska/vagledningar/myndigheternas-skrivregler>). For the
web, rely on the browser's Swedish hyphenation dictionary via `lang="sv"` + CSS `hyphens: auto`
rather than hand-inserting hyphens. *(⚠ editorial for the CSS recommendation.)*

**Fonts & `lang`.** Set `lang="sv"` on `<html>` (or per block) so the browser applies Swedish
hyphenation, quotes, and locale-aware line breaking. Any shipped font must include **å ä ö**
glyphs — most complete Latin web fonts do (e.g. Noto Sans,
<https://fonts.google.com/noto/specimen/Noto+Sans>). *(⚠ editorial.)*

**Romanization.** Not applicable — Swedish is native Latin script; there is no transliteration
layer, and å/ä/ö are letters to preserve, not decorate.

Sources: <https://sv.wikipedia.org/wiki/Citattecken> (outer pair *and* the nested single raised
nine — both verbatim, re-fetched this session) ·
<https://www.isof.se/utforska/vagledningar/myndigheternas-skrivregler> ·
<https://svenska.se/> · <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.unicode.org/cldr/charts/latest/summary/sv.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `sv` delimiter fields were read
codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that chart)
(å/ä/ö code points are ⚠ standard reference values, not fetched)

---

## 10. Technical integration checklist

Swedish is LTR Latin-script, so this checklist is short — the surface where Swedish breaks is
**encoding, compounding, and number format**, not shaping or bidi.

- **`lang` / `dir` attributes.** Set **`lang="sv"`** (base) / **`lang="sv-easy"`** (simplified
  variant, subject to the §Header token note) and **`dir="ltr"`** throughout. Correct `lang` per
  variant and per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)** and lets the
  browser apply Swedish hyphenation and quotes.
- **Encoding is load-bearing.** Serve everything as **UTF-8**; **å ä ö** (and Å Ä Ö) must round-trip
  intact through every build/sanitize/normalize step. A pass that ASCII-folds or digraph-substitutes
  them (å→aa, ä→ae, ö→oe) **silently corrupts the text** (§3). Add a verification check (§11).
- **Fonts to ship.** Any complete Latin web font with **å ä ö** coverage — **Noto Sans**
  (<https://fonts.google.com/noto/specimen/Noto+Sans>) is a safe default. No shaping/joining
  concerns.
- **Tokenization / highlighting.** Whitespace word separation works — standard word tokenizers and
  word-boundary highlighting apply. **But** Swedish **compounds** are single tokens
  (*maskininlärning*), so an English-tuned splitter must **not** break a compound at its internal
  morpheme boundary, and a "did you mean two words?" spell-heuristic must **not** suggest
  särskrivning (§4).
- **Hyphenation / line breaking.** Use the browser's Swedish dictionary via `lang="sv"` +
  `hyphens: auto`; do **not** hand-insert hyphens. Use a **no-break space U+00A0 inside grouped
  numbers** (`10&nbsp;000`) so a figure never wraps mid-number (§3, §5) — and make sure no
  whitespace-normalizing build step folds U+00A0 back to U+0020.
- **Numbers, dates, currency in display vs identifiers.** Display per §5 (comma decimal, **U+00A0**
  thousands, trailing **kr**, `yyyy-mm-dd` dates); keep Western `.`-decimal and ISO-8601 for
  machine identifiers, backends, and code.
- **Quotation marks.** Emit **” ”** (raised nines) in Swedish copy, not English “ ” or German
  „…” (§3); guillemets »…» only if a house style calls for the traditional look.
- **Index alphabet for glossary navigation.** Use the **Swedish collation order** — the Latin A–Z
  followed by **å, ä, ö at the end** (…x, y, z, å, ä, ö) — driven by **CLDR `sv` collation**, not a
  plain A–Z Latin index (which would misfile every å/ä/ö entry).
- **Slugs / identifiers.** For machine keys, fold å→a, ä→a, ö→o (ASCII) — but **never** display that
  fold as text; it is an identifier transform only.

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/sv.html> ·
<https://svenska.se/> · <https://fonts.google.com/noto/specimen/Noto+Sans> ·
<https://www.isof.se/utforska/vagledningar/myndigheternas-skrivregler>
(collation end-order and ASCII-fold rule are ⚠ editorial engineering conventions)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Encoding / digraph check (highest-value for Swedish).** Flag any word where an expected
  **å/ä/ö** appears as a digraph (**aa / ae / oe**) or as mojibake (`Ã¥` `Ã¤` `Ã¶`) — a sign the
  text was ASCII-folded or mis-encoded. Swedish body text must contain å/ä/ö as their real code
  points (U+00E5 / U+00E4 / U+00F6).
- **Number-format check.** Decimal separator is **comma** (3,14 — not 3.14); thousands separator is
  a **space, and specifically U+00A0** (`10&nbsp;000` — not 10,000 / 10.000); currency is
  **amount + space + kr** (249 kr — not kr 249). Flag English-format numbers left in place, and run
  the U+00A0 half as a **codepoint** check: a grouped figure whose separator is U+0020 renders
  correctly but wraps mid-number, so it cannot be caught by eye.
- **Compounding / särskrivning scan.** Flag suspected **särskrivning** — a known compound written as
  two words (e.g. *maskin inlärning* for *maskininlärning*) — a real Swedish error that can change
  meaning (§4).
- **Register consistency.** The §4 decision is **du (singular)**. Scan second-person copy for
  **singular formal *ni*** (e.g. "Vill Ni…") and flag it; allow *ni* only where the referent is a
  literal plural.
- **Quotation-mark consistency.** Swedish **” ”** (raised nines) in body copy — flag English “ ”
  and German „…” as house-style defects (§3).
- **V2 word-order spot-check.** After a fronted adverbial, the finite verb must come **before** the
  subject (Idag **arbetar jag**… — not Idag **jag arbetar**…); flag English-order SVO calques (§4).
- **Collation check.** Glossary/index sorting places **å ä ö after z**, not interleaved with a — a
  plain-Latin sort is a defect (§10).
- **Source-language leak scan (EN/DE → SV).** Left-in English function words (the, and, you,
  please), German umlauts on non-Swedish words / ß, English loan-verbs where a Swedish term exists
  (*downloada* → *ladda ner*), and mixed *neuronnät* / *neuralt nätverk* usage (freeze one, §6).

Sources: <https://www.unicode.org/cldr/charts/latest/verify/numbers/sv.html> ·
<https://sv.wikipedia.org/wiki/V2-ordf%C3%B6ljd> ·
<https://frageladan.isof.se/faqs/23349>
(compounding, collation, and digraph checks are ⚠ editorial engineering conventions derived from §§3–5)

---

*Provenance note:* this guide is built solely from a single **external desk-research pass**,
quote-per-claim, then independently reviewed against its cited sources. Its strongest evidence is
**numbers (§5, CLDR-direct JSON)** and the **plain-language authorities (§8, Isof / Språklagen §11
/ MTM, quoted verbatim)**; **AI/ML terminology (§6)** is **Wikipedia-tier**, with **5 terms
(NLP, stor språkmodell/LLM, transformator, generativ AI, prompt) marked ⚠ semi-verified /
community — not counted as sourced** — because the Svenska datatermgruppen page 404'd; **regional
variation (§9)** leans partly on search summaries; **idioms (§7)** are tiered per row (see the
evidence pass below). All
**⚠** markers indicate claims the research could not fully source. A native-speaker review against
the §2 sources is still outstanding (see Status in the header).

*Correction pass (byte-level defects + §1/§7 merge, 2026-07-27).* Four things changed. (1) The ✅
digraph exemplar printed **påväg**, a misspelling — standard Swedish is **på väg**, two words — in
a guide that names SAOL the spelling arbiter and warns about exactly this word-joining error; it is
now **påstående**, with a note that the ✅ words are the guide's own, since the dossier supplies
none. (2) The ✅/❌ pair demonstrating the no-break space was **byte-identical** — both halves
contained an ordinary U+0020, so the ✅ half did not contain the character it advertised. Because
U+00A0 and U+0020 are visually indistinguishable, §3 now states the rule as a **codepoint-named
table** using the `&nbsp;` entity (the pattern `pl` and `cs` already use) and carries one literal
U+00A0 so the byte is present in the file; §5, §10, and §11 were re-encoded to match. (3) The header
claimed the speaker figure was "not in the source dossier" — a second research dossier opened with
it, and it is now carried with its citation. (4) §7 shipped a general ESL idiom list where the
authoring brief asks for stock phrases of educational/technical writing; the on-domain table from
that second dossier replaced it, keeping the two entries whose *structural* lesson is worth having
(*elefanten i rummet*, *slå huvudet på spiken*).

*Evidence pass (§7 idiom table, 2026-07-27).* The stock-phrase table shipped as blanket "⚠
editorial" with a generic `svenska.se` pointer. Every ✅ has now been taken back to a source and
carries a tier — Svensk ordbok entry by entry, plus Språkbanken's Korp `EDIT` corpus — and the tier
decides whether a row may inform a §11 check; **7 of 10 ✅ cells turned out to be dictionary-
attested**, and the two retained general idioms verified on both of their structural claims. The
wrong-calque column was the weak half and is now labeled **craft**: only row 10
(*byggd på toppen av*) has positive evidence, and it is a real distribution result — all six
occurrences are literal geography, none figurative. **Four ❌ cells were removed because they
condemned dictionary-attested Swedish**: *under motorhuven* (an SO headword and a native compound —
the row was condemning the more explicit synonym of its own ✅), *bryt ner det* (an SO particle-verb
headword, listed in the imperative, and used by Göteborgs-Posten in the exact instructional sense),
*håll i minnet* (SO's own example under *hålla*; 142 corpus hits), and *i det långa loppet* (an SO
idiom carrying **no** register label, in formal Dagens Nyheter prose — the "colloquial, often less
exact" gloss was simply wrong). A fifth, *tumregel av tummen*, was removed as **incoherent**: the
string contains its own correct answer. *Den stora bilden* was reworded from wrong to ambiguous. One
✅ cell was corrected: *vid första anblicken* now leads row 5, because *i korthet* means "briefly, in
summary", which is not a glance.
