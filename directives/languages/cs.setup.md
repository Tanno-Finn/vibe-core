<!-- base -->
# lang-cs — Czech (čeština) — setup & sources

> **The translation guide itself is [`cs.md`](cs.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Czech has a
single clear scientific authority, which makes the strong sections unusually well-anchored.

- **Ústav pro jazyk český (ÚJČ), Czech Academy of Sciences** — the scientific authority on Czech;
  runs the public language-advisory service (jazyková poradna) and publishes the online reference.
  <https://ujc.cas.cz/> — „Účelem ÚJČ je uskutečňovat vědecký výzkum v oblasti českého jazyka a
  jazykového vzdělávání“.
- **Internetová jazyková příručka (prirucka.ujc.cas.cz)** — the primary free online reference for
  correct Czech usage (orthography + typography), published by ÚJČ. This guide leans on it for
  quotation marks (id=162), line-break/preposition rule (id=880), word division (id=135), money
  (id=786), and numbers (id=791). It is the single most practical reference for digital-content
  editors.
- **Pravidla českého pravopisu (PČP)** — the codifying handbook of Czech orthography; the ÚJČ
  editions are the authoritative ones.
  <https://cs.wikipedia.org/wiki/Pravidla_českého_pravopisu> — „Za nejzávaznější bývají považována
  vydání zpracovaná Ústavem pro jazyk český (ÚJČ) Akademie věd“; goal „sjednocení v zájmu
  celonárodní srozumitelnosti“.
- **Unicode — Latin Extended-A block (U+0100–U+017F)** — where the caron/ring Czech letters are
  encoded. <https://en.wikipedia.org/wiki/Latin_Extended-A> — „Range: U+0100..U+017F (128 code
  points)“.
- **Unicode CLDR — `cs` locale** — number, date, time, currency formats. Values checked against
  **CLDR 48.2 (2026-03-17)**; the chart links are Unicode's version-agnostic *latest* permalinks,
  so they track the current release rather than freezing a version number.
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/cs.html> ·
  <https://www.unicode.org/cldr/charts/latest/verify/dates/cs.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **ČSN 01 6910** — the Czech national typographic norm behind the preposition/line-break rule,
  cited by the ÚJČ page id=880. ⚠ **The norm's exact wording is paywalled and was not fetched** —
  it is invoked here only as the standard the ÚJČ page attributes the rule to.
- **Government / plain-language sources** — Úřad veřejného ochránce práv (*Jak psát srozumitelné
  úřední texty*) and MV ČR (*Metodika Easy to read*), used in §8.

**Source-tier caveat (read before trusting a section).** The dossier's **strong** sections —
typography (§3), authorities (§2), numbers/currency (§5), terminology (§6), plain language (§8) —
rest on ÚJČ / CLDR / government and carry verbatim quotes. The **weaker** sections — grammar (§4),
regional variation (§9), idioms (§7) — rest on **Wikipedia lead sentences and bilingual
dictionaries** (slovnik.seznam.cz, glosbe, one language-learning blog). Those are carried below
because they are the best available, but they are marked **⚠ community/dictionary-grade,
native-speaker confirmation pending** and must not be read as academy-sourced.

Sources: <https://ujc.cas.cz/> · <https://prirucka.ujc.cas.cz/?id=162> ·
<https://cs.wikipedia.org/wiki/Pravidla_českého_pravopisu> ·
<https://en.wikipedia.org/wiki/Latin_Extended-A> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/cs.html>

---

## 3. Script & typography

**(Strong section — ÚJČ + Unicode.)**

**Character inventory.** Czech is written in the **Latin script with three diacritics — háček (ˇ),
čárka (´), kroužek (˚)** (cs.wikipedia.org/wiki/Česká_abeceda — „jednak jejich vybraných variací s
diakritickými znaménky, tedy háčkem (ˇ), čárkou (´) a kroužkem (˚)“). The alphabet has **42 letters,
and the digraph *ch* counts as a single letter** (same source — „Obsahuje 42 písmen včetně ch“)
that sorts as one unit **between *h* and *i*** for collation (§10).

**Unicode range.** Base ASCII letters and the acute-accented vowels **á é í ó ú ý** come from Basic
Latin (U+0000–U+007F) and Latin-1 Supplement (U+0080–U+00FF). The **caron letters (č ř ž š ě ď ť ň)
and ů (ring, U+016F)** live in **Latin Extended-A, U+0100–U+017F**
(en.wikipedia.org/wiki/Latin_Extended-A — „Range: U+0100..U+017F (128 code points)“; block purpose:
„accented and variant … Latin letters for writing mostly eastern European languages“). Confirmed
points e.g. Č U+010C / č U+010D, Ř U+0158 / ř U+0159.

**Direction & tokenization.** Czech is **LTR**; words are **whitespace-separated** with standard
Unicode word-break — so ordinary tokenization and word-based highlighting work with no RTL/bidi
handling. (The whitespace claim is editorial in the dossier — no dedicated authority page — but is
consistent with the line-break and hyphenation rules below, which presuppose space-separated words.)

**Quotation marks — the one that is always wrong first.** The ÚJČ-recommended Czech form is the
**"99 66" double low-high pair „ …“** (prirucka.ujc.cas.cz/?id=162 — „Jako základní se doporučují
uvozovky typu 99 66, tj. dvojité „ “.“). The **opening mark is the low U+201E „** and the **closing
is the high U+201C “**. They hug the marked text („Uvozovky přiléhají vždy těsně k výrazům, které
ohraničují …“). Variants exist (single ‚ ‘, guillemets » «, single › ‹) but the low-high double is the
default.

**Where a double and a single mark end up side by side.** This is **not** an exception to the hug
rule above — the hug rule is about the marks and the *text* they enclose, and ÚJČ states it without
qualification (*vždy těsně*). This is a separate rule, about the gap **between two adjacent
quotation marks** when a single pair closes immediately inside a double pair, so that they do not
merge into a visual "triple" quote:

> Pokud se vedle sebe objeví dvojité a jednoduché uvozovky, např. Petr to potvrdil: „Pepa říkal:
> ‚Franta je kanón.‘“, nesmí vytvořit „trojitou“ uvozovku. Jestliže v použitém počítačovém písmu není
> definována dostatečná mezera mezi dvojitými a jednoduchými uvozovacími znaménky, která by vzniku
> „trojité“ uvozovky zabránila, je třeba vložit mezi dvojité a jednoduché uvozovky tenkou mezeru nebo
> provést vyrovnání; běžnou mezislovní mezeru nevkládáme.

⚠ **Provenance: this quotation is not in the research dossier.** It was **re-fetched live from
<https://prirucka.ujc.cas.cz/?id=162> on 2026-07-27** and confirmed verbatim by codepoint — including
the inner marks, which are the **double** low-high pair (`„` U+201E … `“` U+201C) around *trojité*,
not the single pair an earlier revision of this guide printed there. Set as a block quote precisely
so those inner marks stay byte-faithful.

So: insert a thin space or kern between the two marks; **never** an ordinary word space. `[craft]`
**The mapping "tenkou mezeru" → U+2009 THIN SPACE is this guide's editorial reading** — ÚJČ names a
thin space typographically and does **not** name a code point. U+2009 is therefore **named here, not
shown**: no example in this guide contains the character, because the remedy is a font/kerning
decision rather than a string this kit ships. In a web build, check the collision against the
shipping font before relying on either remedy.

- ✅ Czech: „klikněte zde“  ·  ✅ nested: „text ‚uvnitř‘ text“
- ❌ Straight ASCII: "klikněte zde"  ·  ❌ English curly (high-open, high-close): “klikněte zde”

**Line-breaking — non-breaking space after one-letter prepositions (most-forgotten web rule).**
The one-letter non-syllabic prepositions **k, s, v, z** and syllabic **o, u** plus the conjunctions
**a, i** must **not be stranded at the end of a line** — insert a non-breaking space after them
(prirucka.ujc.cas.cz/?id=880 — „ve spojení neslabičných předložek k, s, v, z s následujícím slovem,
např. k mostu, s bratrem, v Plzni, z nádraží“ and „ve spojení slabičných předložek o, u a spojek a, i
… např. u babičky, o páté“). ÚJČ attributes this to ČSN 01 6910 (§2; norm text ⚠ paywalled).

- ✅ `v&nbsp;Plzni`, `k&nbsp;mostu`, `a&nbsp;proto` (preposition/conjunction held to next word)
- ❌ `v` or `k` or `a` left alone at the end of a line

**Hyphenation / word division.** Only multi-syllable words divide, and written division ≠ spoken
syllabification (prirucka.ujc.cas.cz/?id=135 — „V češtině dělíme pouze slova víceslabičná.“ and
„dělení slov v písmu na konci řádku není vždy totožné s členěním slov na slabiky v mluvené řeči“).
Set `lang="cs"` so the browser's Czech hyphenation dictionary applies with `hyphens: auto` (the
`lang`-attribute recommendation is editorial).

**Web-font pitfall (the real risk).** The shipped font **must cover Latin Extended-A (ř ě ů ď ť ň)**
or Czech text falls back and looks broken (range sourced at A3). Practical pitfalls, flagged
editorial in the dossier: (a) many display/webfonts omit **ů, ě, ř** — verify glyph coverage before
shipping; (b) the caron on **ď, ť, ľ** is drawn as a **raised apostrophe-like stroke, not a centered
wedge** — a font that renders a generic centered caron there is wrong; (c) ensure the font carries the
**„…“ low-9/high-6 quotation glyphs**. A Noto family (e.g. Noto Sans/Serif) with full Latin coverage
is a safe default.

**Romanization — not applicable.** Czech is natively a Latin-script language, so there is **no
transliteration/romanization step** (unlike Cyrillic/Arabic/CJK). There is nothing to keep out of
the UI here.

Sources: <https://cs.wikipedia.org/wiki/Česká_abeceda> ·
<https://en.wikipedia.org/wiki/Latin_Extended-A> · <https://prirucka.ujc.cas.cz/?id=162> ·
<https://prirucka.ujc.cas.cz/?id=880> · <https://prirucka.ujc.cas.cz/?id=135>

---

## 10. Technical integration checklist

- **Fonts to ship:** a font with **full Latin Extended-A coverage** (ř ě ů ď ť ň, and the ů ring) —
  a **Noto** family (Noto Sans / Noto Serif) is the safe default. **Verify the caron on ď/ť/ľ renders
  as a raised stroke, not a centered wedge**, and that the **„…“ low-9/high-6 quote glyphs** exist
  (§3). Missing Extended-A glyphs are the top Czech rendering defect.
- **`lang` / `dir` attributes:** `lang="cs"` (base) and `lang="cs-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="cs"` also switches on the browser's
  Czech hyphenation dictionary (§3).
- **Non-breaking space after one-letter prepositions/conjunctions (k, s, v, z, o, u, a, i):** the
  build or an editorial lint should insert `&nbsp;` (or U+00A0) after these so they are never stranded
  at a line end (§3, ÚJČ id=880 / ČSN 01 6910). This is the highest-value Czech typographic automation.
- **Quotation marks:** normalize straight/English quotes in body copy to Czech **„ …“** (U+201E open,
  U+201C close), nested single **‚ ‘** (§3).
- **Index alphabet for glossary navigation:** use **Czech collation order**, in which **ch is one
  letter sorting between h and i**, and the accented letters sort in their Czech positions:
  `a á b c č d ď e é ě f g h ch i í j k l m n ň o ó p q r ř s š t ť u ú ů v w x y ý z ž`. Drive this
  from **CLDR `cs` collation** rather than a naive Unicode-codepoint sort (which would misplace *ch*
  and the diacritics).
- **Line-breaking / hyphenation:** `hyphens: auto` with `lang="cs"`; only multi-syllable words divide
  (§3). Do not hand-insert hyphens.
- **Numbers / dates / currency in display vs identifiers:** display per §5 (space grouping, comma
  decimal, `100 Kč` with space, `13. 1. 2012`, 24-hour time); keep Western digits and ISO 8601
  (YYYY-MM-DD) for backends/identifiers/code.
- **No romanization step:** Czech is native Latin script — there is no transliteration layer to build
  or guard (§3).

Sources: <https://cs.wikipedia.org/wiki/Česká_abeceda> · <https://prirucka.ujc.cas.cz/?id=880> ·
<https://prirucka.ujc.cas.cz/?id=162> · <https://en.wikipedia.org/wiki/Latin_Extended-A> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/cs.html>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script / diacritic presence:** `cs` content is Latin script, but a **near-total absence of the
  Czech diacritics** (č ř ž š ě ů á é í ý and friends) across a body of text signals ASCII-stripped or
  untranslated output. Flag text that should be Czech but carries no Extended-A / accented codepoints.
- **Forbidden punctuation in body copy:**
  - No **straight ASCII quotes `"` `'`** and no **English curly quotes “…” ‘…’** — Czech body copy uses
    **„…“** (U+201E / U+201C) and nested **‚…‘** (§3).
  - No **period-as-decimal or comma-as-thousands** inside numbers — Czech uses **comma decimal +
    space grouping** (`1 234,50`, not `1,234.50`) (§5).
- **NBSP-after-preposition check:** flag a one-letter preposition/conjunction (**k, s, v, z, o, u, a,
  i**) followed by an ordinary space at or near a line break — it should be a non-breaking space (§3/§10).
- **Currency spacing:** `Kč` must be **space-separated** from the amount (`100 Kč`); flag `100Kč`
  (glued, ÚJČ reads it as the adjective *stokorunový* — a defect **by this guide's editorial rule**,
  not by an ÚJČ prohibition) (§5).
- **Collation sanity:** glossary/index ordering treats **ch as a single letter between h and i** and
  places accented letters per Czech collation — flag a raw codepoint sort that scatters *ch* and the
  diacritics (§10).
- **Register consistency (vykání):** vy is the recorded register (§4) — scan
  second-person copy for **stray
  *ty*-forms** — ty-imperatives (*klikni*, *zadej*, *nezapomeň*), the pronoun *ty* / possessive *tvůj*,
  and ty verb agreement — each is a register defect against the recorded vy baseline.
- **Standard vs Common Czech:** flag **obecná čeština markers** in default content — the **-ej for -ý**
  ending (*dobrej*), and other colloquial forms — where spisovná čeština is expected (§9).
- **Source-language leak scan (EN → CS):** left-in English function words (the, and, you, please),
  dictionary-form (nominative) nouns where an oblique case is required (§4), or English number/date
  formatting surfacing in Czech text.

Sources: <https://prirucka.ujc.cas.cz/?id=162> · <https://prirucka.ujc.cas.cz/?id=791> ·
<https://prirucka.ujc.cas.cz/?id=786> · <https://cs.wikipedia.org/wiki/Česká_abeceda> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/cs.html>

---

*Provenance note:* this guide is built solely from an **agent-native research dossier** (self-fetched,
one verbatim quote per claim), then **independently reviewed against its cited sources**. Its
**strong** sections (§2 authorities, §3 typography, §5 numbers/currency, §6 terminology
policy, §8 plain language) rest on ÚJČ / CLDR 48.2 / government and carry verbatim quotes; its
**weaker** sections (§4 grammar, §7 idioms, §9 regional variation) rest on Wikipedia and bilingual
dictionaries and are marked **⚠ community/dictionary-grade, native-speaker confirmation pending** at
point of use. Every ⚠ / editorial marker the dossier set has been preserved. A native-speaker review
against the §2 sources is still outstanding (see Status in the header).
