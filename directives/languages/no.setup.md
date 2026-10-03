<!-- base -->
# lang-no — Norwegian (norsk / Bokmål) — setup & sources

> **The translation guide itself is [`no.md`](no.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Norwegian has a
single clear state authority (Språkrådet) plus a peer-reviewed national encyclopedia, which makes
the strong sections well-anchored.

- **Språkrådet** (the Language Council of Norway, *sprakradet.no*) — the state's official authority
  on Norwegian, setting orthography for **both** Bokmål and Nynorsk and running the *klarspråk*
  (plain-language) program. ⚠ **sprakradet.no returned HTTP 403 to automated fetch** in this
  research pass; its role and klarspråk content were rerouted to and corroborated via Store norske
  leksikon, which confirms it: "Språkrådet har en rekke retningslinjer for klarspråk som de deler på
  sine nettsider." (snl.no/klarspråk). The reroute to SNL is legitimate — do not treat the 403 as a
  reason to distrust the authority, only as the reason a primary quote from sprakradet.no is not
  reproduced here. **Update — the 403 is a historical fetch condition, not a standing one:
  sprakradet.no answered normally in the §8 sourcing pass**, and Språkrådet's own chancery-word list
  (**Kansellisten**) is now quoted directly in §8 rather than rerouted.
- **Official dictionaries / orthography (free, authoritative):** **Bokmålsordboka** and
  **Nynorskordboka** at **ordbokene.no** — the normative spelling reference maintained with the
  Universitetet i Bergen and Språkrådet. For technical/comprehensive Bokmål usage checks,
  **Det Norske Akademis ordbok (NAOB)** at <https://naob.no/>.
- **Store norske leksikon** (<https://snl.no>) — the peer-reviewed national encyclopedia; the best
  non-vendor authority for defining AI/ML concepts in Norwegian and for the Bokmål/Nynorsk facts.
- **Korrekturavdelingen.no** — a widely-cited practical norm reference for punctuation, numbers,
  dates, and idioms, used throughout §3/§5/§7 with verbatim quotes.
- **Public-sector klarspråk guidance:** **Digitaliseringsdirektoratet (DigDir)** and **KS** publish
  plain-language guidance for public digital services (SNL: they "tilbyr råd og veiledning i
  klarspråk"); these underpin §8.

**Source-tier caveat (read before trusting a section).** The **strong** sections — typography (§3),
authorities (§2), numbers/currency (§5), terminology policy (§6), plain language (§8), Bokmål/Nynorsk
(§9) — rest on snl.no / Korrekturavdelingen / ub.uio.no and carry verbatim quotes. The **thinner**
material — three terminology rows (*token*, *finjustering*, *inferens*), several idiom renderings
(§7), and some grammar example pairs (§4) — rests on general field usage or is illustrative
correct-form-only, and is marked at point of use as **⚠ unverified / native-speaker confirmation
pending**.

Sources: <https://snl.no/klarspr%C3%A5k> · <https://naob.no/> ·
<https://www.korrekturavdelingen.no/>

---

## 3. Script & typography

**(Strong section — snl.no + Korrekturavdelingen.)**

**Character inventory.** Norwegian is written in the **Latin script plus three extra letters — æ, ø,
å** (upper **Æ Ø Å**), which are alphabetized **last**, in that order: …x, y, z, **æ, ø, å**. There
is no other diacritic system in native words (é/à etc. appear only in loans like *idé*, *à la*).

**Unicode range.** Base ASCII letters come from Basic Latin (U+0041–U+007A); the three extra letters
all live in **Latin-1 Supplement (U+0080–U+00FF)**: **Æ U+00C6 / æ U+00E6**, **Ø U+00D8 / ø U+00F8**,
**Å U+00C5 / å U+00E5**. Because they are in Latin-1, virtually every modern font covers them — glyph
coverage is *not* the Norwegian risk (unlike Czech's Latin Extended-A). **Encode as UTF-8**; never
substitute ASCII digraphs (ae/oe/aa) and never emit the codepoints as mojibake.

- ✅ Norwegian: **læring**, **grønn**, **påvirke** (æ ø å intact, UTF-8)
- ❌ ASCII digraphs: **laering**, **groenn**, **paavirke**  ·  ❌ mojibake: **lÃ¦ring**, **grÃ¸nn**

**Compounds are one word (særskriving is the classic error).** Norwegian strongly prefers **closed
compounds**: *maskinlæring*, *treningsdata*, *språkmodell*. Splitting a compound into two words
("særskriving") is a frequent English-interference error and changes or breaks meaning.

- ✅ closed: **maskinlæring**, **språkmodell**, **treningssett**
- ❌ særskriving: **maskin læring**, **språk modell**, **trenings sett**

**Quotation marks — the one that is wrong first.** The Norwegian form is the **guillemets « »**
(pointing outward). Korrekturavdelingen: "Det anbefales at man bruker anførselstegnene **«** og
**»**. Disse tegnene er så å si enerådende i tradisjonell norsk typografi." Nested quotes use single
curly marks **‘ ’** (U+2018 / U+2019). Since a 2008 rule, punctuation goes **outside** the closing
mark unless it belongs to the quote: "Mellom hermeteikn (sitatteikn) skal det ikkje stå andre teikn
enn dei som høyrer til i den siterte teksten." (korrekturavdelingen.no/anforselstegn — verified
verbatim). Codepoints: **« U+00AB / » U+00BB**; nested **‘ U+2018 / ’ U+2019**.

- ✅ Norwegian: **«klikk her»**  ·  ✅ nested: **«sitat med ‘innskudd’ her»**
- ❌ straight ASCII: **"klikk her"**  ·  ❌ English curly (high-open/high-close): **“klikk her”**

**Hyphenation / line-breaking.** Standard Latin/CLDR line-breaking; a hyphen is used in coordinated
compounds that share a head — *for- og etterarbeid*, *tre- og firesifrede tall*. No unusual rules
beyond keeping æ/ø/å intact across a break. Set `lang="nb"` (or `lang="no"`) so the browser applies
Norwegian hyphenation with `hyphens: auto` (the `lang`-attribute recommendation is editorial).

**Web-font / rendering pitfalls.** Any font with full Latin-1 coverage renders æ ø å correctly
(system stacks and Noto — <https://fonts.google.com/noto> — all cover them). Real pitfalls, flagged
editorial in the dossier: (1) a font missing **ø** may fall back and shift the baseline; (2)
automated "smart quotes" inserting English “…” instead of « »; (3) mojibake when a pipeline is not
UTF-8 (Ã¦ / Ã¸ / Ã¥); (4) verify the number **group-separator space** (see §5) survives encoding as a
no-break space rather than being stripped.

**Romanization — not applicable.** Norwegian is natively Latin-script, so there is **no
transliteration/romanization step** and nothing to keep out of the UI.

Sources: <https://snl.no/norsk> · <https://www.korrekturavdelingen.no/anforselstegn.htm> ·
<https://en.wikipedia.org/wiki/Latin-1_Supplement>

---

## 10. Technical integration checklist

- **Fonts to ship:** any font with **full Latin-1 coverage** renders æ ø å; a **Noto** family (Noto
  Sans / Noto Serif) is a safe default. Glyph coverage is *not* the Norwegian risk (unlike scripts in
  Latin Extended-A) — verify instead that the **« … » guillemet glyphs** and the number-grouping
  **no-break space** render (§3, §5).
- **`lang` / `dir` attributes:** `lang="nb"` for the Bokmål base (`lang="no"` acceptable as the
  macro tag), `lang="nb-easy"`/`no-easy` for the simplified variant (subject to the §Header token
  note), and a **separate `lang="nn"`** build if Nynorsk is ever produced; **`dir="ltr"`** throughout.
  Correct `lang` per variant and per foreign passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="nb"`
  also switches on the browser's Norwegian hyphenation dictionary (§3).
- **Bokmål/Nynorsk isolation:** the build must **never mix** `nb` and `nn` content in one rendered
  text; treat them as two independent locales, not a fallback chain (§9).
- **Quotation marks:** normalize straight/English quotes in body copy to Norwegian **« … »**
  (U+00AB / U+00BB), nested single **‘ ’** (U+2018 / U+2019) (§3).
- **Numbers / dates / currency in display vs identifiers:** display per §5 — **comma decimal, space
  grouping** (`1 234,50`), **kr** space-separated (`500 kr`), day-month-year (`10.08.1962`) or written
  lowercase month (`10. august 2024`), 24-hour time (`14:30`); keep Western digits and ISO 8601
  (YYYY-MM-DD) for backends/identifiers/code.
- **Index alphabet for glossary navigation:** Norwegian collation puts **æ, ø, å last, in that
  order**: `a b c d e f g h i j k l m n o p q r s t u v w x y z æ ø å`. Drive this from **CLDR `nb`
  collation** rather than a naive Unicode-codepoint sort (which would misplace æ ø å).
- **Line-breaking / hyphenation:** `hyphens: auto` with `lang="nb"`; keep æ/ø/å intact across breaks;
  do not hand-insert hyphens except in shared-head coordinated compounds (*for- og etterarbeid*, §3).
- **Compound integrity (særskriving lint):** an editorial lint for erroneously space-split compounds
  (*maskin læring* → *maskinlæring*) is high-value, since særskriving is the top Norwegian writing
  defect (§3/§4).
- **No romanization step:** Norwegian is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://snl.no/norsk> · <https://www.korrekturavdelingen.no/anforselstegn.htm> ·
<https://www.korrekturavdelingen.no/dato-aarstall.htm>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Encoding / æ ø å integrity:** flag **mojibake** (Ã¦ / Ã¸ / Ã¥) and **ASCII digraph substitutes**
  (a body of "Norwegian" text with `ae`/`oe`/`aa` where æ/ø/å belong, or with *zero* æ/ø/å codepoints
  where they should occur) — signals a non-UTF-8 pipeline or ASCII-stripping (§3).
- **Forbidden punctuation in body copy:**
  - No **straight ASCII quotes `"` `'`** and no **English curly quotes “…” ‘…’** — Norwegian body
    copy uses **« … »** (U+00AB / U+00BB) and nested **‘ ’** (U+2018 / U+2019) (§3).
  - No **period-as-decimal or comma-as-thousands** inside numbers — Norwegian uses **comma decimal +
    space grouping** (`1 234,50`, not `1,234.50`) (§5).
- **Currency spacing / punctuation:** **kr** must be **space-separated** from the amount and carry
  **no period** — flag `kr.500` and `kr.` (§5).
- **Date format:** flag **capitalized month names** (*August* → *august*), **US month-day-year**
  ordering, and **slash** date separators in Norwegian prose (§5).
- **Særskriving (split-compound) scan:** flag space-split compounds where a closed compound is
  expected (*maskin læring*, *språk modell*, *trenings sett*) — the top Norwegian writing defect (§3/§4).
- **Register consistency (du, not De):** scan second-person copy for the **archaic *De* / *Dem* /
  *Deres*** polite forms — each is a register defect against the recorded *du* baseline (§4).
- **Bokmål/Nynorsk purity scan:** within a single `nb` text, flag **Nynorsk markers** (*eg*, *ikkje*,
  *kva*, *frå*, *-a* infinitives) — and vice-versa in an `nn` build. A text mixing the two standards is
  a defect (§9).
- **Collation sanity:** glossary/index ordering places **æ ø å last** in that order — flag a raw
  codepoint sort that scatters them (§10).
- **Source-language leak scan (EN → NB):** left-in English function words (the, and, you, please),
  English "the + noun" where a **definite suffix** is required (*den modell* → *modellen*, §4), missing
  **V2 inversion** after a fronted adverbial (§4), or English number/date formatting surfacing in
  Norwegian text.

Sources: <https://www.korrekturavdelingen.no/anforselstegn.htm> ·
<https://www.korrekturavdelingen.no/tall-siffer-gruppering.htm> ·
<https://www.korrekturavdelingen.no/dato-aarstall.htm> · <https://snl.no/norsk>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier**
(self-fetched, quote-per-claim), then **independently reviewed against its cited sources**. Its
**strong** sections (§2 authorities, §3 typography, §5 numbers/currency, §6 terminology policy, §8
plain language/klarspråk, §9 Bokmål/Nynorsk) rest on snl.no / Korrekturavdelingen / ub.uio.no and
carry verbatim quotes; its **thinner** material (three terminology rows — *token*, *finjustering*,
*inferens*; the §7 idioms; some §4 example pairs) rests on general field usage or is illustrative
correct-form-only, marked **⚠ unverified / native-speaker confirmation pending** at point of use. The
earlier **HTTP 403 from sprakradet.no** recorded in §2 no longer applies: in the §8 sourcing pass
sprakradet.no answered normally, so Språkrådet's **Kansellisten** is quoted directly, and
**språklova § 9** was verified verbatim against the statute on Lovdata (the section number, formerly
carried as ⚠ unverified, is correct). Four load-bearing anchors (snl.no/klarspråk, korrekturavdelingen
anførselstegn + dato-aarstall, snl.no/maskinlæring) were re-fetched and their verbatim quotes
confirmed. A native-speaker review against the §2 sources is still outstanding (see Status in the
header).
