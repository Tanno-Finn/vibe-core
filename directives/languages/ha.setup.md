<!-- base -->
# lang-ha — Hausa (Harshen Hausa) — setup & sources

> **The translation guide itself is [`ha.md`](ha.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

<!-- lang-check: no-nested-quotes - Hausa deliberately prescribes ASCII quotes at both levels: U+2019 doubles as the glottalization apostrophe (see 3.3 and 3.7), so curly inner marks collide with the spelling system. CLDR ha's curly values are recorded above as an explicit divergence. -->

---

## 2. Authorities & primary sources

**The honest headline: Hausa has no living orthographic regulator with a public, fetchable,
dated output. The last binding pan-Hausa orthographic act was 1980.** There is no Hausa
equivalent of the Académie française or the Rat für deutsche Rechtschreibung publishing current
downloadable decisions. What exists is a historical chain of bodies, and one genuine government
source.

**The historical chain (⚠ attested only through Hausa-language media and an academic blog — both
of which are themselves ASCII-ified, see §3.4):**

- **Hukumar Kula da Lamurran Hausa — the Hausa Language Board (Nigeria, founded 1955).** Its
  principal output was the ***Rules for Hausa Orthography*, 1958**, still the foundational
  orthography document. ⚠ Two sources give **1955** and **1958** as the Board's founding
  year; the 1958 date is more likely the Rules publication. The discrepancy is left visible
  rather than resolved. ⚠ **No fetchable full text of the 1958
  Rules was found.**
- **Cibiyar Nazarin Harsunan Nijeriya — Centre for the Study of Nigerian Languages, Bayero
  University Kano.** The Board's functions passed here, and this is **the closest thing to a
  current adjudicating authority**. ⚠ **No first-party Bayero University page stating this
  mandate could be fetched** — the claim rests entirely on Hausa media / academic-blog
  attestation ("Cibiyar Nazarin Harsunan Nijeriya da ke karkashin Jami'ar Bayero, Kano, ita ce
  mai kula da ka'idoji da daidaita rubutun Hausa" — quoted as found; note the source's own
  ASCII-ified `karkashin` for `ƙarƙashin` and ASCII apostrophes).
- **The 1980 Niamey conference** — reported as "the last conference held on standardising Hausa
  writing … in Niamey, Niger, in 1980, under the leadership of the Organisation of African Unity".
  ⚠ Same media-tier attestation. **If accurate, the last binding pan-Hausa orthographic decision
  predates the web entirely.**

**The one genuine government source:**

- **NERDC — Nigerian Educational Research and Development Council**, institutional successor to
  the National Language Centre (which standardized the **Pan-Nigerian alphabet** in the 1980s —
  "A set of 33 Latin letters standardised by the National Language Centre of Nigeria in the
  1980s"). NERDC states its own mandate first-party: **"We promote and develop Nigerian Language,
  advise and implement all policies relating to language"**, operates a **Language Development
  Centre**, publishes a **National Language Policy**, and has done recent orthography work (a
  Gbagyi orthography launch, June 2024). <https://www.nerdc.gov.ng/> — **tier A.**

**Machine-readable and lexical authorities (the ones this guide actually leans on):**

- **Unicode CLDR, `ha` locale** — the authority for character inventory, number, date, and
  currency data. <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
  `cldr-json/cldr-numbers-full/main/ha/numbers.json` · `…/currencies.json`. **Re-fetched and
  confirmed during authoring.**
- **W3C / Unicode script notes for Hausa *boko*** — <https://r12a.github.io/scripts/latn/ha.html>
  — orthography, tone, hyphenation, casing. **Re-fetched and confirmed during authoring.** The
  companion *ajami* notes: <https://r12a.github.io/scripts/arab/ha.html>.
- **Newman, Paul & Roxana Ma Newman — *Hausa Dictionary: Hausa-English / English-Hausa*
  (*Ƙamusun Hausa*)** — the standard modern bilingual dictionary; marks tone and vowel length.
  **Treat as the primary lexical authority for this project.**
- **Newman, Paul — *The Hausa Language: An Encyclopedic Reference Grammar* (2000)** — the
  reference grammar (source of the "20 plural classes" analysis cited in §4).
- **Bargery, G. P. — *A Hausa-English Dictionary*** — ⚠ named in general reading only; not
  verified by fetch.
- **English Wiktionary Hausa** — large, free, tone- and length-marked, with an explicit written
  style policy. Excellent *working* reference; community-edited, so verify anything load-bearing
  against Newman.

**What does NOT exist, and what that means.** There is **no standards body adjudicating new
technical vocabulary in Hausa**, and no Hausa AI/ML terminology list from any authority. Cite the
*1958 Rules* and the Pan-Nigerian alphabet as the orthographic baseline; treat Bayero University
Kano's Centre as the address for adjudication; and accept that **for AI/ML vocabulary there is no
authority to appeal to at all.** The project glossary is therefore a **primary artifact, not a
derived one** — whatever it fixes becomes the de facto standard for these learners (§6).

**Blocked / unfetchable, disclosed.** **BBC Hausa** and **VOA Hausa** were both explicitly
requested as corpora and **neither was sampled** (see §6) — but for different reasons, and an
earlier revision of this guide was wrong about both. **BBC Hausa answers `200`, yet
`bbc.com/robots.txt` disallows a dozen named automated text-collection agents: it is off
limits, not merely unreached.** **VOA Hausa is collectable** — only path rules,
articles permitted, sitemap published — and was simply never sampled. Genuinely unfetchable were
academia.edu (403, including a directly on-topic paper on ASCII-ification of Hausa
text), a Hausa grammar-sketch PDF (403, §4), a Hausa greetings paper (unparsable), a Unicode
working-group *ajami* document (unparsable), hausadictionary.com (403), and
`en.wikiquote.org/wiki/Hausa_proverbs` (**404 — this is why §7 is craft-tier**). The research
additionally **exhausted its web-search budget partway through**, after which only direct
targeted fetches were possible. **Prioritized follow-up for the next research round:**
(1) BBC/VOA Hausa terminology via an unblocked route; (2) a Hausa proverb/idiom reference for §7;
(3) any adult-literacy simplified-Hausa guidelines for §8; (4) the 1958 *Rules* full text;
(5) a first-party Bayero University page for the Centre's mandate.

Sources: <https://www.nerdc.gov.ng/> · <https://hausa.leadership.ng/takaitaccen-tarihin-kaidojin-rubutun-hausa-ii/> ·
<http://tsangayaradabi.blogspot.com/2017/11/asali-da-ginuwar-daidaitaciyar-hausa-da.html> ·
<https://en.wikipedia.org/wiki/Pan-Nigerian_alphabet> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
<https://r12a.github.io/scripts/latn/ha.html> · <https://en.wikipedia.org/wiki/Hausa_language>

---

## 3. Script & typography

**(Strongest section — tier-A: Unicode / W3C / CLDR, re-fetched during authoring.)**

### 3.1 Character inventory

Modern standard Hausa is written in a Latin orthography called **boko**, made the official Hausa
alphabet in **1930** and, in Nigeria, based since the 1980s on the **Pan-Nigerian alphabet**. The
letter inventory:

> **A, B, Ɓ, C, D, Ɗ, E, F, G, H, I, J, K, Ƙ, L, M, N, O, R, S, Sh, T, Ts, U, W, Y, (Ƴ), Z**,
> plus the apostrophe.

Note what is **absent**: **P, Q, V, X** are not native letters (they occur only in unassimilated
foreign words). Note the **digraphs Sh and Ts**, which behave as single letters for alphabet
order (§10).

The machine-readable confirmation — and the exact set a correctly configured product should
accept and render — is the **CLDR `ha` exemplar-character set**:

```
[a b ɓ c d ɗ e f g h i j k ƙ l m n o r s {sh} t {ts} u w y ƴ z ʼ]
```

Two things to read out of that set: **ƴ is in it**, and so is **ʼ (U+02BC MODIFIER LETTER
APOSTROPHE)** — which means the apostrophe is a **letter**, not punctuation (§3.3).

### 3.2 The hooked letters — the whole technical story ✅ tier-A verified

**This is the #1 technical hazard for this language.** These four are phonemically distinct
consonants — *not* accented variants of b/d/k/y.

| Lower | CP | Upper | CP | Unicode name (lower) | Phonetic type |
|---|---|---|---|---|---|
| **ɓ** | **U+0253** | **Ɓ** | **U+0181** | LATIN SMALL LETTER B WITH HOOK | implosive |
| **ɗ** | **U+0257** | **Ɗ** | **U+018A** | LATIN SMALL LETTER D WITH HOOK | implosive |
| **ƙ** | **U+0199** | **Ƙ** | **U+0198** | LATIN SMALL LETTER K WITH HOOK | **ejective** |
| **ƴ** | **U+01B4** | **Ƴ** | **U+01B3** | LATIN SMALL LETTER Y WITH HOOK | glottalized palatal (Niger convention, §9) |

**Get the phonetics right when explaining this to a translator or a font vendor: ƙ is an
ejective, not an implosive.** The W3C/Unicode script notes are explicit — "Note that ƙ is an
ejective, rather than an implosive, like ɓ and ɗ." Three of the four hooks mark implosives;
**ƙ does not.**

**Dehooking is a correctness bug, not a cosmetic one.** A native Hausa speaker, in a documented
exchange about corpora with inconsistent diacritics, put it plainly: **"if you replace a 'hooked
word' with another word without hooks, the result is a different word and a different meaning"**,
and **"the use of the hooks is not optional"** (community source — a Hausa-language technology
blog; tier D, but the statement is corroborated lexically below).

**The lexical demonstration, independently checkable:** the English Wiktionary Hausa lemma
**ƙasa** /kʼá.sáː/ means "soil, earth", "ground", "land, country, nation". The **dehooked page
`kasa` carries entries for 26 languages and Hausa is not among them** — the dehooked form is
simply not a Hausa lemma. Likewise **ɗaya** is the numeral "one"; `daya` is not the lemma.
Dehooking does not "look slightly wrong" — it silently retargets or destroys the word.

- ✅ **ƙasa** (U+0199) — "land, country" · ✅ **ɗaya** — "one" · ✅ **ɓangare** — "part, section"
- ❌ **kasa** — not a Hausa lemma at all · ❌ **daya** · ❌ **bangare** — dehooked, meaning lost
- ❌ improvised keyboard substitutes: **k'asa**, **'kasa**, **d'aya**, **b'angare** — these are
  the classic workarounds for English keyboards and must never reach shipped copy

**Casing is a live failure mode.** "Hausa is bicameral, and applications may need to enable
transforms to allow the user to switch between cases." Uppercasing ɓɗƙƴ requires Unicode-aware
case mapping: a locale-naive ASCII `toUpperCase()` in an old runtime, or a CSS
`text-transform: uppercase` against a font lacking **Ɓ Ɗ Ƙ Ƴ**, produces tofu or leaves the
letters lowercase mid-heading.

- ✅ `ƙasa` → **`ƘASA`** (U+0198) · ✅ `ɗaya` → **`ƊAYA`** (U+018A)
- ❌ `ƙasa` → `ƙASA` (hook left lowercase — the transform or the font failed)

**Engineering rules that follow** *(craft-tier inference from the verified facts above)*:

1. Enforce **UTF-8 end to end**; never let a legacy encoding, a `latin1` DB column or a CSV
   round-trip touch Hausa strings.
2. **CI lint** rejecting any Hausa string containing `'b`, `'d`, `'k`, `b'`, `d'`, `k'` outside a
   whitelist — the classic improvised substitutes.
3. **Do not run accent-stripping / "slugify" over Hausa display text.** Slugs may strip; visible
   copy must not.
4. **Normalize to NFC.** All four hooked letters are atomic codepoints with no decomposition —
   but ensure no compatibility fold or search-normalizer is applied to *output*.
5. **Verify uppercase rendering explicitly** — Ɓ Ɗ Ƙ Ƴ in headings, buttons, and
   `text-transform: uppercase`, in every weight **and in italic** (a font can carry the upright
   hooks and miss the italics).

### 3.3 The apostrophe is a letter — ʼ U+02BC ✅ tier-A verified

The correct character is **ʼ U+02BC MODIFIER LETTER APOSTROPHE** — it is what CLDR's `ha`
exemplar set contains. It is a **letter**, not punctuation, and that distinction is operational:

- U+02BC does not trigger line-breaking, quote-curling, or `'`-escaping in most engines;
  `'` (U+0027) and `’` (U+2019) do.
- A **"smart quotes" filter that rewrites U+0027 → U+2019 silently corrupts Nigerian-convention
  Hausa**, in which this character is part of the *spelling* of words.
- Word-boundary regexes (`\b`) treat U+0027 and U+2019 as non-word characters, splitting a word
  like **ʼyaʼya** into fragments; U+02BC is word-forming.

- ✅ **ʼyaʼya** (U+02BC) · ✅ **Jummaʼa** (Friday — from CLDR, §5) · ✅ **naʼura mai kwakwalwa**
- ❌ **'ya'ya** (U+0027) · ❌ **’ya’ya** (U+2019, smart-quote damage) · ❌ **ʻyaʻya**
  (U+02BB, wrong modifier letter)

⚠ The W3C notes were reported as observing that media outlets in practice use U+0027 and U+2019
instead of U+02BC — that specific claim was **not captured as a clean verbatim string** and is
carried here as a lead. The **U+02BC recommendation itself is solidly attested by CLDR.**

### 3.4 Scraped Hausa web text is not a safe orthographic model ⚠ *(observed directly)*

**The dossier behind this guide documented the problem accidentally, which is the strongest form
of the evidence.** Several Hausa-language sources fetched during the research — **including a
Hausa-language newspaper article that is itself a history of Hausa orthography rules** — are
ASCII-ified. That article writes `kokarin` for **ƙoƙarin**, `karkashin` for **ƙarƙashin**, and
`bakaken` for **baƙaƙen**. *An orthography article that cannot render the orthography* is the
clearest possible evidence that **web-scraped Hausa cannot be trusted as an orthographic model.**

The consequence is concrete and applies to two different actors:

- **Any pipeline that mines the web for Hausa examples, seed corpora, glossary candidates, or
  few-shot material will silently import dehooked forms.** Do not build one without an
  ASCII-ification filter (§10, §11).
- **Any translator who copies a term from a Hausa web page will copy it dehooked.** The correct
  spelling must come from the dictionary (§2) or the frozen project glossary (§6), never from a
  search-result snippet.

A dedicated paper on exactly this phenomenon exists (*"ASCIIfication Of Hausa Digital
(Translated) Text, Bogus Rendition and Possible Solution"*) but the host returned **HTTP 403** and
it is **not cited as evidence** — recorded as a follow-up candidate only. ⚠

### 3.5 Ajami (Arabic-script Hausa) — document, do not ship

Hausa has a parallel, older Arabic-script tradition, in use "since at least the early 17th
century", whose current niche "tends to be restricted to Muslim contexts". It runs
**right-to-left**, but "numbers and embedded Latin text are read left-to-right" (i.e. bidi). It is
also, critically, **unstandardized**: **"there is no standard system of using ajami for Hausa, and
different writers may use letters with different values"**, with two competing traditions
(Warsh-based and Hafs-based).

**Verdict: ship `ha-Latn` boko only.** Ajami is a genuine and culturally important tradition, but
it is unstandardized, RTL (a full bidi layout pass), and confined to religious/poetic registers.
**If ajami is ever requested it is a separate locale — `ha-Arab`, which CLDR recognizes — with its
own layout direction, its own editor, and its own review. It is not a font swap and not a
transliteration of the boko build.** A Unicode working-group proposal document for additional
Hausa ajami characters exists but did not render through fetch — follow-up candidate, uncited. ⚠

**Romanization.** Not applicable in the usual sense: boko *is* the native Latin orthography, so
there is no transliteration layer to keep out of the UI. The only script question is boko vs
ajami, and that is a locale decision (above), not a rendering one.

### 3.6 Tone and vowel length are phonemic but unwritten ✅ tier-A verified

This is the second-biggest translator-facing property of Hausa writing.

- "Tone is not indicated in normal text."
- "Although long and short vowel sounds are phonemically distinctive, the Latin script orthography
  of Hausa doesn't distinguish between them in writing."
- A third unwritten contrast is reported too: the distinction between R [ɽ] and R̃ [r] (tier D).

Where marking *is* used — dictionaries, pedagogy, linguistics — the conventions are: **high tone
unmarked, low tone grave (`ˋ`), falling tone circumflex (`ˆ`); macron (`ˉ`) for long vowels, short
vowels unmarked.** The lexicographic guideline separates the contexts explicitly: diacritics
belong in **headwords**, not in page titles.

**The actionable consequence.** Standard written Hausa is systematically ambiguous in a way
English is not: one written string routinely represents several distinct words differing only in
tone and length. **ƙasa** alone is "land/country" with one tone-length pattern and "on the ground"
with another (/kʼá.sáː/ vs /kʼá.sà/, same spelling). Disambiguation comes from **context and
syntax, not orthography.** Therefore:

- **Never** let a single bare word carry meaning in UI chrome. A standalone monosyllabic button
  label is a genuine comprehension risk — prefer a short verb phrase.
- **Never** add tone marks to product copy "for clarity": it looks wrong to every ordinary reader
  and breaks search, sorting, and copy-paste.
- **Do** allow Hausa strings to run longer than the English source. Hausa buys its disambiguation
  with words.
- Glossary entries and a pronunciation guide *may* carry tone/length marks; body copy must not.

- ✅ button: **Fara darasi** ("start the lesson") — a phrase, unambiguous
- ❌ button: **Fara** alone — a bare word, ambiguous without context
- ❌ body copy: **ƙàsā** — tone/length marks do not belong in product copy

### 3.7 Direction, tokenization, line-breaking, punctuation

- **Direction:** boko is **LTR**, `dir="ltr"`. (Ajami is RTL — §3.5, out of scope.)
- **Tokenization:** "Words are separated by spaces." Standard Unicode word-break applies —
  word-based highlighting and search work normally, **provided U+02BC is treated as word-forming**
  (§3.3).
- **Hyphenation:** "Words can also be hyphenated. This is especially, but not solely, true for
  words that repeat the same sound" — i.e. **reduplicated forms are conventionally hyphenated**
  (`kaɗan-kaɗan`, `mataki-mataki`). There is **no attested Hausa hyphenation dictionary**, and
  browsers ship no `ha` pattern set. **Use `hyphens: manual`** plus `overflow-wrap: break-word` as
  the safety net; **never `hyphens: auto`**, which either no-ops or (with a wrong `lang`) breaks by
  English rules. *(craft-tier inference)*
- **Punctuation and quotation:** Hausa uses **ASCII/European punctuation**; there are no
  Hausa-specific marks. Quotations are surrounded by **straight ASCII double quotes**, with
  straight single quotes nested. **Curly quotes are a hazard in Hausa specifically**, because
  U+2019 is used by some writers as the glottalization apostrophe (§3.3) — a smart-quote filter
  aimed at prose will collide with the spelling system.
  - ✅ **"Danna nan"** (straight ASCII) · ✅ nested **'…'**
  - ❌ **“Danna nan”** (U+201C/U+201D curly) · ❌ **‘…’** (U+2018/U+2019 curly) — U+2019 in
    particular is indistinguishable from the improvised glottalization apostrophe
  - ⚠ **Deliberate divergence from the locale data, recorded not hidden.** The CLDR `ha` delimiters,
    read codepoint-by-codepoint from the pinned **CLDR 48.2** release this session, are
    `quotationStart` = **“ U+201C**, `quotationEnd` = **” U+201D**, `alternateQuotationStart` =
    **‘ U+2018**, `alternateQuotationEnd` = **’ U+2019** — i.e. CLDR prescribes exactly the curly
    marks this section forbids. Hausa is the one language in this set where the ASCII form is the
    *considered* choice rather than a flattening, because U+2019 is load-bearing in the orthography
    (§3.3). The kit's language-guide checker is therefore opted out of its nested-pair rule for
    `ha` on the line below, with this paragraph as the stated reason.

<!-- lang-check: no-nested-quotes - Hausa deliberately prescribes ASCII quotes at both levels: U+2019 doubles as the glottalization apostrophe (see 3.3 and 3.7), so curly inner marks collide with the spelling system. CLDR ha's curly values are recorded above as an explicit divergence. -->

- **`lang` attribute:** `lang="ha"` — or `lang="ha-Latn-NG"` if a Niger variant is ever added.
  This drives font fallback, hyphenation suppression, and screen-reader voice selection.

### 3.8 Fonts — many do not cover ɓ ɗ ƙ ƴ

The failure mode is documented first-party by a large type program: users without the right font
"saw gibberish or boxes instead of the correct letters", which prompted a **"newly defined 'African
Latin' glyph set"** rolled into open fonts; the same source notes that the **Noto** family covers
16 scripts serving 266 languages spoken in Africa.

| Font | Status | Note |
|---|---|---|
| **Noto Sans** / **Noto Serif** | ✅ safest choice | Full-coverage by design; the reference fallback for African Latin. Ship as the guaranteed fallback even if the brand font is something else. <https://fonts.google.com/noto> |
| **Questrial** | ✅ verified expanded | Named in the African Latin glyph-set expansion. Check it has the **uppercase** Ɓ Ɗ Ƙ Ƴ you need. |
| Classic web-safe faces (Arial, Helvetica, Georgia, Times) | ⚠ risky | Coverage of **U+0181 / U+018A / U+0198 / U+01B3 (uppercase)** is far less reliable than lowercase. |
| Brand / display fonts | ❌ assume broken | Almost never include the Latin Extended-B hooks. |

*(the ranking above is craft-tier, built on the verified coverage facts)*

**Mandatory pre-launch QA string.** Render this in **every font, every weight, upright and
italic, and in small-caps**, and eyeball it:

> **`Ɓɓ Ɗɗ Ƙƙ Ƴƴ — ƙasa, ɗaya, ɓangare, ʼyaʼya`**

Any box, any mid-word fallback-style break, any missing uppercase = **the font is not shippable
for `ha`.**

**Font-loading rule** *(craft-tier)*: put a Noto family in the `font-family` stack **after** the
brand font rather than relying on browser last-resort fallback, so a partially covering brand font
degrades to a designed glyph instead of a random system face — which would produce visible
mid-word style shifts on exactly the letters that matter most.

Sources: <https://r12a.github.io/scripts/latn/ha.html> · <https://r12a.github.io/scripts/arab/ha.html> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
<https://en.wikipedia.org/wiki/Boko_alphabet> · <https://en.wikipedia.org/wiki/Pan-Nigerian_alphabet> ·
<https://www.omniglot.com/writing/hausa.htm> · <https://en.wiktionary.org/wiki/%C6%99asa> ·
<https://en.wiktionary.org/wiki/kasa> · <https://en.wiktionary.org/wiki/%C9%97aya> ·
<https://hausaonline.wordpress.com/2008/06/26/typing-hooked-letters-in-hausa/> (community) ·
<https://www.amsoshi.com/2020/02/how-to-use-universal-hausa-hooked.html> (community) ·
<https://design.google/library/meet-questrial-African-languages-font> (vendor, first-party account
of the font-coverage failure) · <https://fonts.google.com/noto> ·
<https://www.unicode.org/cldr/charts/latest/summary/ha.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `ha` delimiter fields quoted in §3.7 were read
codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that chart;
this guide diverges from them deliberately and says so at the point of use)

---

## 10. Technical integration checklist

- **Encoding:** **UTF-8 end to end, normalized to NFC.** No `latin1` columns, no CSV round-trips,
  no compatibility folds applied to output. All four hooked letters are atomic codepoints with no
  decomposition (§3.2).
- **Fonts to ship:** a font with verified coverage of **ɓ ɗ ƙ ƴ and Ɓ Ɗ Ƙ Ƴ** — a **Noto** family
  (Noto Sans / Noto Serif) is the safe default and should sit in the stack **after** the brand
  font, not as browser last resort. **Uppercase and italic coverage fail more often than
  lowercase.** Run the QA string **`Ɓɓ Ɗɗ Ƙƙ Ƴƴ — ƙasa, ɗaya, ɓangare, ʼyaʼya`** in every
  font/weight/style before launch (§3.8). <https://fonts.google.com/noto>
- **`lang` / `dir`:** `lang="ha"` (or `lang="ha-Latn-NG"`), `lang="ha-easy"` for the simplified
  variant, **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage is
  WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **⚠ Do not mine the web for Hausa examples without an ASCII-ification filter.** Scraped Hausa
  text — including Hausa articles *about orthography* — is routinely dehooked (§3.4). Any pipeline
  that harvests Hausa strings for seed corpora, glossary candidates, few-shot material, or
  autocomplete **will silently import dehooked forms** and propagate them into shipped copy.
  Correct spellings come from the dictionary (§2) or the frozen glossary (§6) — **never from a
  search-result snippet**, and never by copy-paste from a Hausa web page.
- **Apostrophe handling:** **U+02BC is a letter.** Disable smart-quote / apostrophe-normalizing
  filters on Hausa content, treat U+02BC as word-forming in tokenizers and `\b` regexes, and use
  **`Jummaʼa` as the round-trip smoke test** through CMS → DB → export → render (§3.3, §5.3).
- **Case transforms:** use **Unicode-aware** case mapping only. Verify
  `text-transform: uppercase` on strings containing ɓ ɗ ƙ ƴ against the actual shipped font
  (§3.2).
- **No slugify over display text.** Accent/hook stripping may run on slugs and identifiers; it
  must never touch visible copy (§3.2).
- **Index alphabet for glossary navigation** — Hausa alphabet order, **not** codepoint order
  (a naive Unicode sort would exile ɓ ɗ ƙ ƴ to the end of the list, after `z`):
  `a b ɓ c d ɗ e f g h i j k ƙ l m n o r s sh t ts u w y (ƴ) z ʼ`. Each hooked letter sorts
  **immediately after its base letter**; **`sh` and `ts` are single letters**; **p, q, v, x are
  not native**. Drive this from **CLDR `ha` collation**, not from a codepoint sort.
- **Line-breaking / hyphenation:** **`hyphens: manual`** — there is no `ha` hyphenation dictionary
  and browsers ship no pattern set. Add `overflow-wrap: break-word` as the safety net. Hyphens are
  used **editorially** in reduplicated forms (`kaɗan-kaɗan`) and must be preserved (§3.7).
- **Plurals:** populate CLDR `one` / `other` with **authored, dictionary-checked forms**. Never
  generate a Hausa plural (§4.4).
- **String metadata:** ship each string's **purpose** (instruction / ongoing state / completed
  result) alongside the string — the PAC system makes this the difference between correct and
  silently wrong-aspect translation (§4.2).
- **Numbers / dates / currency in display vs identifiers:** display per §5 (`1,234.56`,
  `26 Yuli, 2026`, `₦ 1,234.56` with the space); keep Western digits and ISO 8601 (YYYY-MM-DD) for
  backends, identifiers, and code. Resolve time patterns from the i18n library at build time —
  CLDR `ha` inherits them (§5.3).
- **Country vs language dimension:** currency depends on **country** (NGN for Nigeria, XOF for
  Niger), not on the `ha` language tag (§5.2, §9).
- **Regional variant as one switch:** keep `ʼy` ↔ `ƴ` as a single build-time transform so
  `ha-Latn-NE` can be added without touching strings (§9.3).
- **No romanization layer.** Boko is the native Latin orthography; ajami would be a **separate
  locale (`ha-Arab`) with its own direction and editor**, not a font swap or a transliteration of
  this build (§3.5).

Sources: <https://r12a.github.io/scripts/latn/ha.html> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
<https://en.wikipedia.org/wiki/Boko_alphabet> · <https://fonts.google.com/noto> ·
<https://design.google/library/meet-questrial-African-languages-font>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md).

- **Hook-integrity scan (the highest-value check for this language).** Scan Hausa output for
  **plain `b` / `d` / `k` / `y` where a hooked letter is expected.** Practically: maintain a
  denylist of the common dehooked forms and flag every occurrence —
  `kasa` → **`ƙasa`**, `daya` → **`ɗaya`**, `bangare` → **`ɓangare`**,
  `kirkira` / `kirkirarriyar` → **`ƙirƙira` / `ƙirƙirarriyar`**, `karkashin` → **`ƙarƙashin`**,
  `kokarin` → **`ƙoƙarin`**, `bakaken` → **`baƙaƙen`**, `kudin` → **`kuɗin`**,
  `maballi` → **`maɓalli`**. A dehooked form is **not a typo — it is a different word or a
  non-word** (§3.2). This check is what stops ASCII-ified web text (§3.4) from leaking into copy.
- **Improvised-substitute scan.** Reject any Hausa string containing `'b`, `'d`, `'k`, `b'`, `d'`,
  `k'` outside an explicit whitelist — the classic English-keyboard workarounds (§3.2).
- **Hooked-letter presence sanity check.** A body of Hausa text containing **zero** occurrences of
  ɓ ɗ ƙ ƴ across many paragraphs is a strong signal of ASCII-stripped, machine-mangled, or
  untranslated output. Flag for human inspection rather than auto-failing (short strings can
  legitimately lack them).
- **Apostrophe codepoint check.** In Hausa content the glottalization apostrophe must be
  **U+02BC**. Flag **U+0027** and **U+2019** adjacent to `y`, and flag any apostrophe-like
  character in a Hausa word that is not U+02BC (§3.3). Include **`Jummaʼa`** as a fixture string
  in the pipeline round-trip test (§5.3).
- **Regional-convention check.** In a `ha-Latn-NG` build, **`ƴ` (U+01B4) must not appear** — it is
  the Nigerien convention (§9.2). Conversely a `ha-Latn-NE` build should not carry `ʼy`.
- **Tone-mark check.** Body copy must carry **no tone or length marks** — flag grave, acute,
  circumflex, or macron on vowels in product copy. They are legitimate only in glossary headwords
  and pronunciation guides (§3.6).
- **Bare-label check.** Flag single-word UI labels (buttons, menu items) in Hausa for human
  review: tone/length ambiguity makes isolated words genuinely risky (§3.6).
- **Forbidden punctuation in body copy.** No **curly quotes** — **“ ” (U+201C/U+201D)** and
  **‘ ’ (U+2018/U+2019)**. Hausa uses **straight ASCII quotes**, and U+2019 in particular collides
  with the glottalization apostrophe (§3.7).
- **Number-format check.** Decimal must be **`.`** and grouping **`,`** — flag comma-decimal
  (`1.234,56`) and any space grouping. Flag a space before `%` (§5.1).
- **Date-format check.** Day-month-year only; flag US `M/d/y`. Flag a **missing comma before the
  year** in the full/long/medium forms (`26 Yuli 2026` → `26 Yuli, 2026`) (§5.3).
- **Currency check.** `₦` must be **space-separated and amount-leading** (`₦ 1,234.56`) — flag
  glued or trailing forms. Flag NGN appearing in a Niger context and XOF in a Nigeria context;
  never unify `F CFA` and `FCFA` (§5.2).
- **Register consistency (`ku`).** The recorded register is 2nd-person **plural `ku`** (§4.3). Scan second-person copy for **gendered singular forms** — the pronouns
  `ka` / `ki`, and the singular PAC forms (`kana` / `kina` and their relatives). Each is a
  register defect against the recorded baseline. Flag `Malam` / `Malama` appearing in UI chrome
  rather than in salutations.
- **Plural-generation check.** Flag any Hausa plural produced by a code path rather than an
  authored string; verify CLDR `one` / `other` slots contain distinct authored forms (§4.4).
- **Compounding check.** Flag adjacent bare nouns in Hausa that mirror an English noun-noun
  compound — Hausa needs the genitive linker `-n` / `-r` or a relative construction (§4.4).
- **Script check.** `ha` content is **Latin (boko)**. Any **Arabic-script** run inside a `ha`
  build is a defect — ajami is a separate locale (`ha-Arab`, §3.5).
- **Source-language leak scan (EN → HA).** Left-in English function words (the, and, you, please)
  and English number/date formatting surfacing in Hausa text. **Do not flag** the
  Hausa-term-plus-English-parenthetical on first use — that is the *correct*, attested convention
  (§6.2); flag it only when it repeats on every mention.
- **Font/glyph render check.** Automated or manual render of
  **`Ɓɓ Ɗɗ Ƙƙ Ƴƴ — ƙasa, ɗaya, ɓangare, ʼyaʼya`** in every shipped font, weight, italic, and
  small-caps; any tofu or mid-word style break fails the font (§3.8).

Sources: <https://r12a.github.io/scripts/latn/ha.html> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ha.xml> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ha/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ha/currencies.json> ·
<https://en.wiktionary.org/wiki/%C6%99asa>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** During
authoring, four load-bearing anchors were **re-fetched and confirmed verbatim**: the W3C/Unicode
Hausa *boko* script notes (`r12a.github.io/scripts/latn/ha.html` — the ejective-ƙ statement, the
ƴ/ʼy split, the tone and vowel-length statements, word separation, hyphenation, bicameral casing),
CLDR `common/main/ha.xml` (exemplar set, date patterns, month and day names), and the CLDR `ha`
`numbers.json` and `currencies.json` (separators, patterns, NGN/XOF/XAF).
**Coverage is uneven by construction and the guide preserves that.** §3 and §5 are tier-A strong.
§2 is honest about a **1980** last-binding-act and a Bayero University Kano mandate attested only
through Hausa media; **NERDC is the one genuine first-party government source.** §4 carries an
`⚠ unverified` TAM paradigm and `⚠` honorific sociolinguistics. §6 rests on ~20 terms with
verbatim attestations, **but BBC Hausa and VOA Hausa were blocked and NOT sampled** — this is a
handful of articles, not corpus coverage. **§7 is entirely craft-tier and unsourced** (the proverb
reference 404'd). **§8 is a genuine ❌** — no codified Hausa plain-language tradition was found,
and `ha-easy` inherits the kit's base rules. §9 documents the ƴ/ʼy split and states plainly that
**no systematic Nigeria/Niger difference list could be verified.** The underlying research also
**exhausted its web-search budget** partway through, so this is a **first pass** with a prioritized
follow-up list (§2). **A native-speaker review is outstanding and is a precondition for shipping
§6 (open decisions), §7 and §8.**
