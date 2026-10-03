<!-- base -->
# lang-fi — Finnish (suomi) — setup & sources

> **The translation guide itself is [`fi.md`](fi.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Finnish has a
single clear state language-planning authority (Kotus), which makes the typography, numbers, and
register sections unusually well-anchored.

- **Kotimaisten kielten keskus (Kotus)** — the Institute for the Languages of Finland, the official
  language-planning authority (kotus.fi). Its **suomen kielen lautakunta** (Finnish Language Board)
  issues the standard-language recommendations.
- **Kielitoimiston ohjepankki** — Kotus's free online usage/orthography guide, the day-to-day
  reference for spelling, punctuation, numbers, dates, and names
  (<https://kielitoimistonohjepankki.fi/>). It carries the load for §3 (quotation marks,
  hyphenation) and §5 (numbers/dates/currency). Topic areas: *Merkit, numerot ja lyhenteet · Nimet ·
  Sana · Lause · Teksti*.
- **Kielitoimiston sanakirja** — Kotus's authoritative dictionary of standard Finnish
  (kielitoimistonsanakirja.fi), the canonical spelling/inflection reference. ⚠ **not separately
  fetched** for this guide, but it is the reference to resolve any specific inflection.
- **Kielikello** — Kotus's language-guidance journal (kielikello.fi), the source for the register
  decision in §4.
- **Selkokeskus** (part of Kehitysvammaliitto) — the authority for **selkokieli** (plain Finnish):
  maintains the definition, the mark (*selkotunnus*) and the measurement instrument
  (*selkomittari*). Carries §8 (selkokeskus.fi).
- **SFS (Suomen Standardisoimisliitto)** — the Finnish standards body; its committee work on Finnish
  AI terminology and **SFS-EN-ISO/IEC 22989** (AI concepts/terminology) anchor part of §6
  (sfs.fi).
- **Terminology term-banks: Tieteen termipankki** (tieteentermipankki.fi) and **Sanastokeskus /
  TEPA** (termipankki.fi). ⚠ **The TEPA search page returned only a search-UI shell — its entry
  definitions did not render and could not be quoted.** Use **tieteentermipankki.fi** as the working
  reroute for term verification; treat TEPA as unconfirmed for this guide.
- **Digital-content style guide:** no single national web style guide exists. In practice teams
  follow Kielitoimiston ohjepankki plus the Web Accessibility obligations
  (*saavutettavuusdirektiivi*) and, for plain content, Selkokeskus. ⚠ editorial inference — no single
  authoritative "digital content" style guide was identified.

**Source-tier caveat (read before trusting a section).** The **strong** sections — typography (§3),
authorities (§2), numbers/dates/currency (§5), plain language (§8) — rest on Kotus / Kielikello /
Selkokeskus / SFS and carry verbatim quotes. The **thinner** sections — the AI micro-terminology
rows in §6 (token, prompt, fine-tuning, inference, hallucination), idioms (§7), and regional
variation (§9) — rest on **Wikipedia and Finnish vendor/education glossaries** and are marked
**⚠ vendor/community-grade, native-speaker confirmation pending** at point of use. AI micro-terms in
particular must be re-confirmed against **tieteentermipankki.fi** before shipping user-facing
strings.

Sources: <https://kotus.fi/> · <https://kielitoimistonohjepankki.fi/> · <https://kielikello.fi/> ·
<https://selkokeskus.fi/> · <https://sfs.fi/tekoalyn-suomenkieliset-termit/> ·
<https://tieteentermipankki.fi/>

---

## 3. Script & typography

**(Strong section — Kotus / Kielitoimiston ohjepankki + Unicode.)**

**Character inventory.** Finnish is written in the **Latin alphabet with the two Finnish-specific
letters ä and ö**; **å** appears only in Swedish loanwords and names. There are **no other
diacritics** and no digraph-as-letter complications. All characters live in **Basic Latin
(U+0000–U+007F)** plus **Latin-1 Supplement (U+0080–U+00FF)**: ä = U+00E4 / Ä = U+00C4, ö = U+00F6 /
Ö = U+00D6, å = U+00E5 / Å = U+00C5.

**Unicode range & font coverage.** Because everything sits in Basic Latin + Latin-1 Supplement,
**any mainstream web font renders Finnish correctly** — Google-Fonts / Noto families (e.g. Noto
Sans, Noto Serif) are safe. There is **no Latin-Extended glyph-coverage risk** as in Czech or
Polish. The one real defect mode is a **pipeline that ASCII-folds ä→a / ö→o**, which changes meaning
(*tälle* "to this" ≠ *talle* "to a stall"; *säästä* ≠ *saasta*) — this must never happen in storage,
display, or search-normalization of visible text.

- ✅ Finnish: **tekoäly**, **säästää**, **työ**, **älä**  ·  ✅ Swedish-origin name: **Åström**
- ❌ ASCII-folded: **tekoaly**, **saastaa**, **tyo**, **ala** (meaning-changing, looks broken)

**Direction & tokenization.** Finnish is **LTR**; words are **whitespace-separated** with standard
Unicode word-break — ordinary tokenization and word-based highlighting work with no RTL/bidi
handling. (Editorial, consistent with the hyphenation rules below, which presuppose space-separated
words.)

**Quotation marks — the one that is always wrong first.** Finnish uses the **right curly double
quote `”` (U+201D) at BOTH ends** — the "9-9" style, the **same mark opening and closing** — **not**
the German „…“ low-then-high pair, and not straight ASCII quotes.
Kielitoimiston ohjepankki (Kotus): „Suomenkielisessä tekstissä käytettävät kokolainausmerkit ovat
kaarevat”, ja ne ovat samanmuotoiset lainatun jakson alussa ja lopussa.“ No space between the mark
and the quoted text: „Lainausmerkki kirjoitetaan ilman välilyöntiä kiinni lainauksen aloittavaan tai
lopettavaan sanaan tai välimerkkiin.“ Nested/half quotes use the single **puolilainausmerkki**
(’…’, likewise the same 9-shaped mark both ends). ⚠ the exact wording of the puolilainausmerkki page
was not fetched.

- ✅ Finnish: **”klikkaa tästä”** (U+201D both ends, no inner spaces)  ·  ✅ nested: **”teksti
  ’sisällä’ teksti”**
- ❌ German style: **„klikkaa tästä“**  ·  ❌ English curly: **“klikkaa tästä”** (high-open,
  high-close)  ·  ❌ straight ASCII: **"klikkaa tästä"**  ·  ❌ guillemets: **«klikkaa tästä»**

**Hyphenation / line-breaking — matters because Finnish builds very long compounds.** Kotus rules:
the syllable/line break falls **before a consonant+vowel combination** („Tavuraja on aina
konsonantin ja vokaalin yhdistelmän edellä“) and **between two different vowels that don't form a
diphthong** („Tavuraja on sellaisten eri vokaalien välissä, jotka eivät muodosta diftongia“).
**Never orphan a single vowel on its own line** („Yhden vokaalin tavua ei jätetä yksin omalle
rivilleen“ — so `o-/mena` is wrong; break `ome-/na`). Long compounds should preferably break **at
the compound-part boundary** („Yhdyssanat jaetaan eri riveille mieluiten yhdyssanan osien rajalta“).

- ✅ break `ome-na`, `tieto-kone`, `teko-äly`  ·  ❌ orphan `o-mena`, mid-diphthong `ty-ö`
- **Web implication:** set `lang="fi"` and `hyphens: auto` so the browser applies Finnish
  hyphenation and breaks long compounds; otherwise Finnish compounds overflow narrow columns.

**Romanization — not applicable.** Finnish is natively a Latin-script language, so there is **no
transliteration/romanization step** and nothing to keep out of the UI.

Sources: <https://kielitoimistonohjepankki.fi/ohje/lainausmerkit/> ·
<https://kielitoimistonohjepankki.fi/ohje/tavutus-yleisperiaatteet/> ·
<https://fi.wikipedia.org/wiki/Suomen_kieli> (character inventory / speaker context)

---

## 10. Technical integration checklist

- **Fonts to ship:** any font with **full Latin-1 coverage** renders ä/ö/å correctly — a **Noto**
  family (Noto Sans / Noto Serif) or any mainstream web font is safe. **No Latin-Extended coverage
  risk** (unlike Czech/Polish). Ensure the font carries the **”…” (U+201D) quote glyph** (§3).
- **`lang` / `dir` attributes:** `lang="fi"` (base) and `lang="fi-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="fi"` also switches on the browser's Finnish
  hyphenation dictionary (§3).
- **Quotation marks:** normalize straight/English/German quotes in body copy to Finnish **”…”**
  (U+201D at **both** ends), nested single **’…’** (§3). This is the highest-value Finnish
  typographic automation — the mark is different from German and from English.
- **ASCII-fold guard:** never let a storage/display/search-normalization step fold **ä→a / ö→o** —
  it changes meaning (§3). Keep ä/ö as their own codepoints end-to-end.
- **Line-breaking / hyphenation:** `hyphens: auto` with `lang="fi"` so long Finnish compounds break
  at syllable/compound boundaries and never orphan a single vowel (§3). Do not hand-insert hyphens.
- **String-length budget:** assume Finnish strings run **longer** than English (agglutination stacks
  4–6 English words into one word; §4) — size buttons, labels, and truncation for the long case.
- **Numbers / dates / currency in display vs identifiers:** display per §5 (space grouping, comma
  decimal, `29,90 €` with postfix symbol + space, `28.1.2026`, 24-hour `9.15`); keep Western digits
  and ISO 8601 (YYYY-MM-DD) for backends/identifiers/code.
- **Index alphabet for glossary navigation:** Finnish collation order is
  `a b c d e f g h i j k l m n o p q r s t u v w x y z å ä ö` — **å, ä, ö sort at the END, after z**
  (ä and ö are distinct letters, not variants of a/o). Drive this from **CLDR `fi` collation** rather
  than a naive Unicode-codepoint sort (which would misplace ä/ö). ⚠ collation order stated from
  standard Finnish alphabet convention; the CLDR `fi` chart was not fetched for this guide.
- **No romanization step:** Finnish is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://kielitoimistonohjepankki.fi/ohje/lainausmerkit/> ·
<https://kielitoimistonohjepankki.fi/ohje/tavutus-yleisperiaatteet/> ·
<https://fi.wikipedia.org/wiki/Suomen_kieli>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Diacritic presence:** `fi` content should carry **ä / ö** at a normal rate. A near-total absence
  of ä/ö across a body of text that should be Finnish signals **ASCII-folded** or untranslated output
  — flag it.
- **Forbidden ASCII-fold pairs:** flag suspicious tokens where ä/ö appear to have been stripped
  (*tekoaly*, *saastaa*, *tyo*) — meaning-changing defects (§3).
- **Forbidden punctuation in body copy:**
  - Quotation marks must be Finnish **”…”** (U+201D at **both** ends) — flag straight ASCII `"` `'`,
    English curly **“…”**, and especially **German „…“** (low-open) in Finnish body copy (§3).
  - No **period-as-decimal or comma-as-thousands** inside numbers — Finnish uses **comma decimal +
    (non-breaking) space grouping** (`1 234,50`, not `1,234.50`) (§5).
- **Currency spacing / placement:** `€` must be **postfix** and **space-separated** from the amount
  (`29,90 €`) — flag prefix `€29,90` and glued `29,90€` (§5).
- **Time separator:** Finnish uses a **period** between hours and minutes (`9.15`) — flag colon
  `9:15` and 12-hour `AM/PM` in end-user Finnish content (§5).
- **Register consistency (sinä):** sinä is the recorded register (§4) — scan second-person copy for
  stray **te-forms**: te-imperatives (*klikatkaa*, *kirjoittakaa*, *muistakaa*), the pronoun *te* /
  possessive *teidän*, and te verb agreement — each is a register defect against the sinä baseline
  (except in an explicitly formal/institutional notice, §4).
- **Standard vs colloquial (yleiskieli):** flag **puhekieli markers** in default content — *mä / sä*
  for *minä / sinä* and colloquial verb endings — where yleiskieli is expected (§9).
- **Morphology sanity:** flag likely **dictionary-form (nominative) nouns where an oblique case is
  required** (§4 — cases/partitive), and **stems that ignore consonant gradation / vowel harmony**
  (mechanically concatenated endings, e.g. a back-vowel *-ssa* on a front-vowel stem).
- **Collation sanity:** glossary/index ordering must place **å ä ö after z** (distinct letters) —
  flag a raw codepoint sort that scatters ä/ö among a/o (§10).
- **Source-language leak scan (EN → FI):** left-in English function words (the, a, and, you,
  please), untranslated English articles rendered as Finnish demonstratives for every "the" (§4), or
  English number/date/currency formatting surfacing in Finnish text.

Sources: <https://kielitoimistonohjepankki.fi/ohje/lainausmerkit/> ·
<https://kielitoimistonohjepankki.fi/ohje/rahasummat/> ·
<https://fi.wikipedia.org/wiki/Suomen_kieli> ·
<https://selkokeskus.fi/selkokieli/selkokielen-mittari/selkokielen-mittarin-ohjeet-ja-kriteerit/>

---

*Provenance note:* this guide is **authored from a single agent-native research dossier**
(self-fetched, quote-per-claim). Its **strong** sections (§2 authorities, §3 typography, §5
numbers/dates/currency, §8 plain language) rest on Kotus / Kielitoimiston ohjepankki / Kielikello /
Selkokeskus / SFS and carry verbatim quotes; its **thinner** sections (§4 morphology, §6 AI
micro-terminology, §7 idioms, §9 regional variation) rest on Wikipedia and Finnish vendor/education
glossaries and are marked **⚠ community/vendor-grade, native-speaker confirmation pending** at point
of use. The **TEPA term-bank returned only a search-UI shell** and could not be quoted;
**tieteentermipankki.fi** is the working reroute for term verification. Every ⚠ / editorial marker
the dossier set has been preserved. A **native-speaker review is still outstanding** (see Status in
the header).
