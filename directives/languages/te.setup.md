<!-- base -->
# lang-te — Telugu (తెలుగు) — setup & sources

> **The translation guide itself is [`te.md`](te.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

> ⚠ **Read this section as a map of *who exists*, not as a verified statement of *what they
> mandate*.** The weakness is structural, not accidental: **every Andhra Pradesh and Telangana
> state-government domain probed returned a connection failure** — and so did two **national**
> domains, the **Commission for Scientific and Technical Terminology** and the national council for
> educational research — not a 403, a refusal at the
> network layer — and the research ran **without a web-search tool** (the budget was exhausted before
> it began), so there was no way to route around them. **Absence of a source here is weak evidence of
> absence in the world.** Every URL in this guide was reached by construction or by crawling links
> out of a page already fetched.

### 2a. 🔴 Method note that governs every character below

The research pass **did not use a summarizing fetch layer.** An earlier pass in this series found
such a layer silently ASCII-flattening quotation marks, so this dossier fetched **raw bytes with
`curl`** and parsed them locally, verifying every codepoint against the **Unicode Character
Database** (`UnicodeData.txt`, `CompositionExclusions.txt`) and a local `unicodedata` runtime —
never from memory. **No Telugu string in the research was typed from recall.**

That discipline earned its keep in the one place lookalike glyphs actually turned up: the census PDF's
numerals extract as **Greek-block** codepoints, and the research recorded them **machine-read from the
extracted text, not from a glyph shape** — verbatim, *"because these lookalikes corrupt when copied"*
(§1). Two consequences for this guide, and both are operational:

> **Where this guide states a codepoint, trust the codepoint over the glyph.** And treat any Telugu
> string that reached you through a summarizing layer, a chat transcript, or a spreadsheet export as
> corrupt until a byte census says otherwise. Prose *about* codepoints is not evidence that the
> codepoints were written (§11).

### 2b. Legally normative — status sourced, instruments not read

| Body | Jurisdiction | Standing | Verified? |
|---|---|---|---|
| **Government of Telangana** / **Government of Andhra Pradesh** | Two Indian states | Telugu is the official language of both | Status ✅ community-tier; **every state domain ❌ connection failure** |
| **తెలుగు అకాడమి — Telugu Akademi** | Constituted by the Government of Andhra Pradesh, August 6, 1968 | The state terminology-and-textbook body; ~25 lakh textbooks a year; publisher of the Telugu dialect glossaries | ⚠ **Community tier only.** Its own domain **fails to connect**. And the same source records the institutional damage verbatim: *"After the division of the state, the institution was weakened by problems of dividing it up."* |
| **Suravaram Pratapa Reddy Telugu University**, Hyderabad | Telangana | Hosts a School of Language Development and a Centre for Languages and Translation Studies — a plausible place to route terminology questions | ✅ site reachable and self-identifying; **no published normative term list or style guide found on it** |
| State Official Language Acts | Both states | The instrument that would say whose spelling decisions bind whom | ❌ **not located.** The national statute portal responds and is the right place to look; finding them needed search |

> **⚠ Consequence, stated plainly: this guide has no primary state-government source.** Nothing in
> it may be presented as carrying state institutional backing, and no brief or term sheet may imply
> that it does.

### 2c. 🔴 The Official tier that *was* reachable — and the decisive negative it yielded

The Government of India / national language-institute portal describes itself verbatim as a project
*"with an objective of delivering knowledge in and about all the languages in India using multimedia
… through a portal"*. Its dictionary index lists **757 dictionary entries**, of which **68 are
Telugu-relevant**. The Telugu technical-glossary series is the **పారిభాషిక పదకోశం** (*Paribhashika
Padakosham*) — **thirteen subject volumes**, read verbatim from the page's own link table:

Mathematics & Statistics · Physics · Chemistry · Botany · Zoology · Geography · Geology · Medicine ·
Home Science · Commerce · History & Political Science · Public Administration · Evaluation Terms —
plus a Glossary of Administrative and Legal Terms and a Fundamental Administrative Terminology
volume.

> 🔴 **There is no computing, IT, informatics, electronics, engineering, or AI volume for Telugu.**
> All 757 catalog entries were searched programmatically for computing keywords. **The 14 hits are
> all in other languages** — the catalog ships a *Computer Science Glossary (English–Hindi)*, a
> *Glossary of Information Technology (English–Hindi)*, a *Glossary of Computer (English–Bodo)* and
> a Kannada computer-technology glossary. **Hindi, Bodo, and Kannada have an official computing
> glossary on this portal. Telugu does not.** This is verifiable in one page load, and it is the
> premise of §6.
>
> ⚠ **How far that negative reaches, stated honestly.** It is a finding about **this portal**. The
> research had no web search, and the Government of India's **Commission for Scientific and
> Technical Terminology** — the national body whose remit is exactly this vocabulary — **failed to
> connect**. So the defensible claim is *no official Telugu computing terminology was located*, not
> *none exists anywhere*.

Also cataloged and directly relevant elsewhere in this guide: a **Dictionary of Idioms**
(తెలుగు జాతీయాల కోశం, → §7), **Telangana** and **Rayalaseema** usage dictionaries and a general
regional-dialect dictionary (→ §9), a dictionary of journalistic language, the 19th-century
Brown dictionaries, and a Telugu word-frequency dictionary.

⚠ **Book *contents* are JavaScript-gated.** The catalog is established; the entries are not. **Not
one headword could be extracted** from any of the thirteen volumes, the idiom dictionary, the dialect
dictionaries or the school-level Telugu–Telugu dictionary. That single blockage is why §7 has no
Telugu idiom column and §8 has no complex→everyday table. **A human with a browser would close both.**

### 2d. Unicode and CLDR — parsed, not summarized

- **The Unicode character database** (`UnicodeData.txt`, fetched whole and filtered by codepoint
  range; the accompanying `ReadMe.txt` identifies it as *"final data files for the Unicode Character
  Database, for Version 17.0.0 of the Unicode Standard"*). The block census in §3a — codepoints,
  official names, General_Category, combining classes, the one canonical decomposition — is quoted
  field data from it.
- **`CompositionExclusions.txt`** — grepped across the whole `0Cxx` range: **no Telugu character is a
  composition exclusion** (§3f).
- **The Unicode Standard core specification, chapter 12 §12.7 Telugu** — the atomic-vowel "For Use /
  Do Not Use" table, headstroke replacement, conjunct formation with worked examples, the **ZWNJ
  blocking rule**, the **ZWJ reph rules**, the nakāra-pollu `U+0C5D`, and the position that danda is
  religious-text punctuation.
- **CLDR**, fetched as **raw locale XML** for `te` and `root`, **pinned to the `release-48-2` tag**,
  parsed locally with every `↑↑↑` inheritance marker resolved against `root`. Everything in §5 rests
  on this, including the shipped-locale-data ZWNJ finding. **The pin is the point:** a release tag
  is immutable, so every value quoted below can still be checked against the URL it is quoted from.
  The `main` branch these links formerly pointed at is pre-release development data and **has since
  moved** — re-read at the pin on 2026-07-27, the `te` values below are unchanged, but that could
  only be established by pinning.
- **A W3C internationalization lead's Telugu orthography notes** (Craft tier, page states "Updated
  28 April, 2026") — vowel-sign placement counts, the cluster-reordering statement, the quotation
  pair *including its nested form*, the danda marked infrequent, native digits marked infrequent,
  and the line-breaking discussion. The single most useful developer-facing description located.
- **A major platform vendor's Indic script-development documentation** (Craft tier) — the syllable
  grammar the shaper matches, the indivisibility of a shaped syllable, and the OpenType features a
  Telugu font must implement.

### 2e. The corpora — measurement, not authority

Four independent Telugu sources were fetched as raw bytes and counted. **They carry no normative
weight whatsoever** and are used for exactly one thing: measuring what modern written Telugu
actually does. Where this guide reports a count, it comes from these:

| Label | What it is | Size |
|---|---|---|
| **[E]** | The Telugu-language encyclopedia — 10 full articles via its own extract API | 194,153 characters |
| **[B]** | An international broadcaster's Telugu service — 14 article pages | 135,934 characters (108,968 Telugu) |
| **[N1]** | A Telugu daily newspaper homepage | 10,344 Telugu characters |
| **[N2]** | A second Telugu daily newspaper homepage | 73,391 Telugu characters |

⚠ **The press sample is small and one-day** (14 articles plus two homepages, harvested 2026-07-26).
The digit, danda, quotation, and ZWNJ findings are stark enough — zero against thousands — to survive
the sample size. **The terminology counts in §6 and the register counts in §4a are suggestive, not
definitive**, and are labeled that way at the point of use.

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/ReadMe.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://bharatavani.in/> · <https://bharatavani.in/home/dictionaries> ·
<https://www.teluguuniversity.ac.in/> · <https://te.wikipedia.org/wiki/తెలుగు అకాడమి> ·
<https://r12a.github.io/scripts/telu/te.html> ·
<https://learn.microsoft.com/en-us/typography/script-development/telugu> ·
<https://te.wikipedia.org/w/api.php> · <https://www.bbc.com/telugu> · <https://www.eenadu.net/> ·
<https://www.sakshi.com/> · <https://dsal.uchicago.edu/dictionaries/brown/> ·
<https://www.indiacode.nic.in/>

---

## 3. Script & typography

*Housekeeping convention for this document: Telugu strings are set in **bold** without added
quotation marks, so that any quotation character you see inside a citation is one the source itself
served. Where a sequence is deliberately malformed or is pure corruption, it is given as
**codepoints only** — writing it as glyphs would put the damage into this file's own bytes.*

### 3a. The block — a census from the character database, not from a chart

Telugu occupies **U+0C00–U+0C7F** with **101 assigned characters**. Extracted from `UnicodeData.txt`
by codepoint range; fields quoted are codepoint, official name, and General_Category.

🔑 **If you re-count this and get a different number, check your Unicode version before
assuming the guide is wrong.** `U+0C5C` TELUGU ARCHAIC SHRII was assigned in Unicode 17.0, so any
runtime still shipping Unicode 16 tables reports it as unassigned and yields 100. A count of 97
was carried in an earlier draft of this guide and is simply wrong; the figure above was taken
from the current `UnicodeData.txt` by direct fetch.

**Signs (5)** — shown on a dotted circle **◌** `U+25CC`, as the character charts do, because
these are marks and cannot stand alone:
**◌ఀ** `U+0C00` COMBINING CANDRABINDU ABOVE (Mn) · **◌ఁ** `U+0C01` CANDRABINDU (Mc) ·
**◌ం** `U+0C02` ANUSVARA (Mc) · **◌ః** `U+0C03` VISARGA (Mc) ·
**◌ఄ** `U+0C04` COMBINING ANUSVARA ABOVE (Mn).

**Independent vowels (14):**
**అ** `U+0C05` A · **ఆ** `U+0C06` AA · **ఇ** `U+0C07` I · **ఈ** `U+0C08` II · **ఉ** `U+0C09` U ·
**ఊ** `U+0C0A` UU · **ఋ** `U+0C0B` VOCALIC R · **ఌ** `U+0C0C` VOCALIC L · **ఎ** `U+0C0E` E ·
**ఏ** `U+0C0F` EE · **ఐ** `U+0C10` AI · **ఒ** `U+0C12` O · **ఓ** `U+0C13` OO · **ఔ** `U+0C14` AU.
⚠ Note the **gaps at `U+0C0D` and `U+0C11`** — those codepoints are unassigned. A range scan that
assumes contiguity will mis-handle them.

**Consonants (36):**
**క** `U+0C15` KA · **ఖ** `U+0C16` KHA · **గ** `U+0C17` GA · **ఘ** `U+0C18` GHA · **ఙ** `U+0C19` NGA ·
**చ** `U+0C1A` CA · **ఛ** `U+0C1B` CHA · **జ** `U+0C1C` JA · **ఝ** `U+0C1D` JHA · **ఞ** `U+0C1E` NYA ·
**ట** `U+0C1F` TTA · **ఠ** `U+0C20` TTHA · **డ** `U+0C21` DDA · **ఢ** `U+0C22` DDHA · **ణ** `U+0C23` NNA ·
**త** `U+0C24` TA · **థ** `U+0C25` THA · **ద** `U+0C26` DA · **ధ** `U+0C27` DHA · **న** `U+0C28` NA ·
**ప** `U+0C2A` PA · **ఫ** `U+0C2B` PHA · **బ** `U+0C2C` BA · **భ** `U+0C2D` BHA · **మ** `U+0C2E` MA ·
**య** `U+0C2F` YA · **ర** `U+0C30` RA · **ఱ** `U+0C31` RRA · **ల** `U+0C32` LA · **ళ** `U+0C33` LLA ·
**ఴ** `U+0C34` LLLA · **వ** `U+0C35` VA · **శ** `U+0C36` SHA · **ష** `U+0C37` SSA · **స** `U+0C38` SA ·
**హ** `U+0C39` HA. (⚠ **gap at `U+0C29`**.)

**Marks and dependent vowel signs:** **◌఼** `U+0C3C` NUKTA (Mn) · **ఽ** `U+0C3D` AVAGRAHA (Lo) ·
**ా** `U+0C3E` AA · **ి** `U+0C3F` I · **ీ** `U+0C40` II · **ు** `U+0C41` U (Mc) · **ూ** `U+0C42` UU (Mc) ·
**ృ** `U+0C43` VOCALIC R (Mc) · **ౄ** `U+0C44` VOCALIC RR (Mc) · **ె** `U+0C46` E · **ే** `U+0C47` EE ·
**ై** `U+0C48` AI · **ొ** `U+0C4A` O · **ో** `U+0C4B` OO · **ౌ** `U+0C4C` AU ·
**్** `U+0C4D` **VIRAMA**. (⚠ **gaps at `U+0C45` and `U+0C49`**.)

**Length marks:** `U+0C55` LENGTH MARK · `U+0C56` AI LENGTH MARK. **Both are traps — see §3f.**

**Additional letters:** **ౘ** `U+0C58` TSA · **ౙ** `U+0C59` DZA · **ౚ** `U+0C5A` RRRA ·
**౜** `U+0C5C` ARCHAIC SHRII · **ౝ** `U+0C5D` **NAKAARA POLLU** (§3g) · **ౠ** `U+0C60` VOCALIC RR ·
**ౡ** `U+0C61` VOCALIC LL · **◌ౢ** `U+0C62` · **◌ౣ** `U+0C63` vowel signs vocalic L / LL.

**Digits (`Nd`):** **౦ ౧ ౨ ౩ ౪ ౫ ౬ ౭ ౮ ౯** `U+0C66`–`U+0C6F`. **Banned in shipped copy — §3h.**

**Other:** **౷** `U+0C77` SIGN SIDDHAM (Po) · seven quaternary fraction digits (No), **౸** `U+0C78` through **౾** `U+0C7E` ·
**౿** `U+0C7F` SIGN TUUMU (So).

**Combining classes** (machine-read; they matter for normalization ordering): `U+0C4D` VIRAMA
**ccc=9** · `U+0C3C` NUKTA **ccc=7** · `U+0C55` LENGTH MARK **ccc=84** · `U+0C56` AI LENGTH MARK
**ccc=91** · all vowel signs and `U+0C02`/`U+0C03` **ccc=0**.

### 3b. Whitespace tokenization works — and a "word" can be very long

Telugu runs left-to-right in horizontal lines, words are separated by spaces, and — verbatim —
*"There is no case distinction."* So there is no segmentation problem, **and no capitalization
rules**: title-case logic and `text-transform: capitalize` are a no-op at best on Telugu text.

There *is* a length problem, and it is sourced: *"Telugu is an agglutinative language and Telugu
words can be long. This can lead to large gaps during justification, and sometimes words that are
longer than the available column width."* A single Telugu word can exceed a mobile column, a table
cell or a button label and will overflow rather than wrap, because there is nothing to break on.

🏠 **House rule (craft, low risk):** set `overflow-wrap: break-word` as a safety net on Telugu text
containers, budget extra `line-height` — Telugu marks extend well above and below the Latin
ascender/descender band — and never set `overflow: hidden` on a Telugu container without testing it.

### 3c. 🔑 No pre-base vowels — but visual order is still not string order

**Kill the imported assumption first.** The orthography notes count vowel-sign placements verbatim:

> **`2 post-base, eg. కు ku`** · **`8 superscript, eg. కి ki`** · **`1 super+subscript. eg. కై kaʲ`**
> **`At maximum, vowel components can occur concurrently on 2 sides of the base.`**

**Telugu has no pre-base (left-side) vowel signs.** The Devanagari trap — a vowel sign typed after
its consonant but drawn to its left — **does not exist here.** Do not port that warning from a Hindi
or Marathi guide; it wastes a translator's attention on a non-problem.

**The reordering that *does* exist is the cluster one, and it is the real trap.** Same source, on
conjuncts:

> **"Many subjoined forms rise above the baseline to the right of the initial consonant, but any
> vowel signs attached to the cluster appear above or to the right of the initial consonant (which
> may be between the two consonant glyphs in the latter case)."**

So in `C1 + virama + C2 + vowel-sign`, the vowel sign is **stored last** and **drawn attached to
C1** — visually *between* the two consonant glyphs. The platform vendor's shaping documentation
states the operational consequence:

> **"Once a syllable is shaped, it is indivisible. The cursor cannot be positioned within the
> syllable. Transformations discussed in this document do not cross syllable boundaries."**

and gives the internal ordering, with matras last:

> **"Syllable structure consists of the following parts: Reph + HalfConsonant(s) + MainConsonant(s)
> + BelowBaseConsonant(s) + PostBaseConsonant(s) + PreBaseReorderingRa + MatrasAndSigns"**

**→ Anything that reasons about "the character after position N" — cursor movement, highlight
ranges, per-character reveal animation, first-letter effects — will land in the wrong visual
place.** Use grapheme-cluster segmentation (§3l).

### 3d. Virama and the ottu/vattu — the core mechanic

The Unicode Standard §12.7, verbatim:

> **"Many Telugu letters have a v-shaped headstroke, which is a structural mark corresponding to the
> horizontal bar in Devanagari and the arch in Oriya. When a virama (called virāmamu in Telugu) or
> certain vowel signs are added to a letter with this headstroke, it is replaced"**

> **"Telugu consonant clusters are most commonly represented by a subscripted, and often
> transformed, consonant glyph for the second element of the cluster"**

with the standard's own worked examples: **గ** `U+0C17` + **్** `U+0C4D` + **గ** `U+0C17` → **గ్గ** ·
**క** `U+0C15` + `U+0C4D` + **క** `U+0C15` → **క్క** · `U+0C15` + `U+0C4D` + **య** `U+0C2F` → **క్య** ·
`U+0C15` + `U+0C4D` + **ష** `U+0C37` → **క్ష**. This subscript form is what Telugu tradition calls the
**ottu / vattu**; the vendor glossary defines it generically as *"A below-base form of a consonant."*

> **🔑 Encoding rule, exactly as the standard states it: a conjunct is not a separate character.** It
> is always `<consonant, U+0C4D, consonant>`. **There are no precomposed conjunct codepoints** —
> confirmed by the block census in §3a, which contains no conjunct characters at all.

**Gemination is common** — *"Gemination is quite common."* Telugu genuinely stacks a consonant on
itself, e.g. **క్క** = `U+0C15 U+0C4D U+0C15`. ⚠ **Any routine that "collapses repeated characters"
will destroy real Telugu words.**

### 3e. 🔴 ZWNJ — the single most consequential character in Telugu content

**The normative statement.** Unicode 17.0.0 §12.7, verbatim:

> **"U+200C ZERO WIDTH NON-JOINER is used to prevent U+0C4D ◌్ TELUGU SIGN VIRAMA from subscripting
> a following letter"**

with the worked example `U+0C15 U+0C4D U+200C U+0C15` → **క్‌క**. ⚠ The published text's own
transliteration gloss on that line reads "( kṣa )", which is a typo in the standard — the sequence
is k + ka. Flagged so nobody propagates it.

**ZWJ has normative uses too — and they are effectively dead in practice.** The standard documents
`U+200D` after the virama to force an explicit reph, and before the virama to suppress one; the
orthography notes summarize the division of labor as *"200C ( ZWNJ ) is used to prevent the
formation of a conjunct"* and *"200D ( ZWJ ) is used to control font glyph selection"*, warning of
the reph form that **"although not all fonts support it"**. ⚠ **This guide deliberately embeds no
`U+200D` character anywhere**, so that a byte scan of this file stays unambiguous; the reph
sequences are `U+0C30 U+0C4D U+200D U+0C2E` and `U+0C30 U+200D U+0C4D U+0C2E`, and you should not
need either.

**Now the usage reality — measured across four corpora:**

| Corpus | Scope | `U+200C` ZWNJ | `U+200D` ZWJ |
|---|---|---:|---:|
| **[E]** encyclopedia | 10 articles, 194,153 chars | **309** | **0** |
| **[B]** broadcaster | 14 pages, 135,934 chars | **649** | **0** |
| **[N1]** newspaper | homepage, 10,344 Telugu chars | **185** | **0** |
| **[N2]** newspaper | homepage, 73,391 Telugu chars | **1,219** | **4** |

**ZWNJ is pervasive in real Telugu text; ZWJ is effectively absent.** Of the 309 in **[E]**,
**297 are immediately preceded by `U+0C4D` VIRAMA**. The dominant pattern is exactly the normative
one: **virama + ZWNJ + consonant, blocking a conjunct at a morpheme seam**, typically where a Telugu
suffix attaches to a transliterated English stem. Attested, codepoints machine-read from page bytes:

| Word | Gloss | Codepoints |
|---|---|---|
| **నెట్‌వర్క్** | "network" | `U+0C28 U+0C46 U+0C1F U+0C4D U+200C U+0C35 U+0C30 U+0C4D U+0C15 U+0C4D` |
| **సాఫ్ట్‌వేర్** | "software" | `U+0C38 U+0C3E U+0C2B U+0C4D U+0C1F U+0C4D U+200C U+0C35 U+0C47 U+0C30 U+0C4D` |
| **ఇన్‌పుట్** | "input" | `U+0C07 U+0C28 U+0C4D U+200C U+0C2A U+0C41 U+0C1F U+0C4D` |
| **ఔట్‌పుట్** | "output" | `U+0C14 U+0C1F U+0C4D U+200C U+0C2A U+0C41 U+0C1F U+0C4D` |
| **అప్‌డేట్** | "update" | `U+0C05 U+0C2A U+0C4D U+200C U+0C21 U+0C47 U+0C1F U+0C4D` |
| **భారత్‌లో** | "in India" — stem + locative | `U+0C2D U+0C3E U+0C30 U+0C24 U+0C4D U+200C U+0C32 U+0C4B` |
| **డాలర్‌లు** | "dollars" — stem + plural | `U+0C21 U+0C3E U+0C32 U+0C30 U+0C4D U+200C U+0C32 U+0C41` |

**That last one is from CLDR's own `te.xml`** (§5e) — the joiner ships inside the locale data, so it
is not merely a journalistic habit. **ZWNJ is data, not dirt.**

| | Form | Bytes |
|---|---|---|
| ✅ | **నెట్‌వర్క్** | carries `U+200C` between `U+0C4D` and `U+0C35` — the attested spelling |
| ❌ | **నెట్వర్క్** | ⚠ constructed: the same string with `U+200C` stripped, which lets the virama subscript the following **వ** and changes the word |

**And now the noise, which a guide must get equally right.** Classifying every ZWNJ by what follows:

| Corpus | Total | Functional: virama + ZWNJ + consonant | **Word-final / before non-Telugu** | Other |
|---|---:|---:|---:|---:|
| **[E]** | 309 | 232 | **65 — 21 %** | 12 |
| **[B]** | 649 | 436 | **155 — 24 %** | 58 |

**Roughly one ZWNJ in four does nothing**: it sits at the end of a word, before a space or a comma,
where there is no following letter for the virama to subscript. Newspaper headlines are full of it.
It is a CMS or legacy-input-tool artifact, **it is conventional, and it is not a sign of a broken
source.**

**Worse: multi-ZWNJ runs.** Run-length distribution of consecutive `U+200C`: **[B]** has 553 runs of
1, **27 runs of 2, and 14 runs of 3**; **[E]** has 307 runs of 1 and 1 run of 2. Attested garbage,
given as codepoints only: `U+0C15 U+0C36 U+0C4D U+0C2E U+0C40 U+0C30 U+0C4D U+200C U+200C U+200C`
(three stacked); `… U+0C1C U+0C4D U+200C U+200C U+0C2E U+0C39 U+0C32 U+0C4D`; and one where the
joiners follow a **vowel sign** rather than a virama — `… U+0C1F U+0C30 U+0C41 U+200C U+200C U+0C28
U+0C41` — and therefore cannot possibly affect shaping.

> **🔴 The two rules that follow, and both matter:**
>
> 1. **Never strip `U+0C4D U+200C` before a consonant.** It is content. A pipeline that removes ZWNJ
>    "because it is invisible" alters thousands of words on any real Telugu page.
> 2. **Never use ZWNJ as a diff, equality, or dedupe signal.** Word-final, pre-punctuation,
>    post-vowel-sign, and repeated ZWNJ is noise that varies by CMS; two identical Telugu strings will
>    compare unequal on it. Normalize the *noise* class away for comparison, keep it in storage, and
>    never let a translation-memory match fail on it.

### 3f. Normalization — verified empirically, not assumed

Machine-verified with a local `unicodedata` runtime and cross-checked against `UnicodeData.txt`
field 6 and `CompositionExclusions.txt`:

| Input | NFC == input | NFD differs | NFD codepoints |
|---|---|---|---|
| **కై** `U+0C15 U+0C48` | yes | **yes** | `U+0C15 U+0C46 U+0C56` |
| **కీ** `U+0C15 U+0C40` | yes | no | unchanged |
| **కే** `U+0C15 U+0C47` | yes | no | unchanged |
| **కో** `U+0C15 U+0C4B` | yes | no | unchanged |
| **ఓ** `U+0C13` | yes | no | unchanged |
| **క్క** `U+0C15 U+0C4D U+0C15` | yes | no | unchanged |
| **నెట్‌వర్క్** (with ZWNJ) | yes | no | unchanged |

> **🔑 Exactly one Telugu character has a canonical decomposition: `U+0C48` AI → `U+0C46 U+0C56`.**
> Read verbatim from field 6 of its database line: **`0C48;TELUGU VOWEL SIGN AI;Mn;0;NSM;0C46 0C56;;;;N;;;;;`**
> And `CompositionExclusions.txt` was grepped across the whole `0Cxx` range: **no Telugu character is
> a composition exclusion.** Therefore **NFC always recomposes it back to `U+0C48`.**

**Practical rule: normalize to NFC on ingest and assert it in CI.** NFD silently lengthens every word
containing **ై**. ⚠ This guide gives that decomposed form as codepoints only and never as glyphs —
writing it out would make *this file* non-NFC, which is precisely the failure being described.

**NFKC does *not* remove ZWNJ or ZWJ** — verified: joiner sequences are byte-identical after NFKC.
**If joiners are disappearing from your pipeline, something other than Unicode normalization is
doing it.** Go find that thing.

**The "do not compose it yourself" rule.** §12.7 opens with it, verbatim:

> **"Telugu vowel letters and vowel signs are encoded atomically in Unicode, even if they can be
> analyzed visually as consisting of multiple parts. Table 12-31 shows the letters and signs that can
> be analyzed, the single code point that should be used to represent them in text, and the sequence
> of code points resulting from analysis that should not be used."**

The standard's own For-Use / Do-Not-Use table, reproduced as an example pair:

| | Correct — one atomic codepoint | Forbidden analytic sequence |
|---|---|---|
| ✅ | **ఓ** `U+0C13` LETTER OO | ❌ **ఒౕ** = `U+0C12` + `U+0C55` |
| ✅ | **ఔ** `U+0C14` LETTER AU | ❌ **ఒౌ** = `U+0C12` + `U+0C4C` |
| ✅ | **ీ** `U+0C40` VOWEL SIGN II | ❌ **ిౕ** = `U+0C3F` + `U+0C55` |
| ✅ | **ే** `U+0C47` VOWEL SIGN EE | ❌ **ెౕ** = `U+0C46` + `U+0C55` |
| ✅ | **ో** `U+0C4B` VOWEL SIGN OO | ❌ **ొౕ** = `U+0C4A` + `U+0C55` |

> **🔴 Note the asymmetry, because it is genuinely confusing and it decides your QA strategy.**
> **`U+0C55` sequences are forbidden *and* non-normalizing** — NFC will not fix them, they are simply
> wrong input, and they will compare unequal to the correct atomic character forever. Whereas
> **`U+0C56` inside the `U+0C48` decomposition is legitimate NFD and NFC does repair it.** The
> orthography notes add that `U+0C55` *"does not normally occur in Telugu text"*.
> **→ `U+0C55` anywhere in `te` content is a finding (§11). NFC is a floor, not a QA strategy.**

### 3g. The `U+0C5D` nakāra-pollu trap — added in Unicode 14

Unicode 17.0.0 §12.7, verbatim:

> **"A distinct form ౝ of a vowelless U+0C28 న TELUGU LETTER NA appears in older Telugu texts, and
> is known as nakāra-pollu . This form is represented by a separate character, U+0C5D ౝ TELUGU
> LETTER NAKAARA POLLU . The related form regularly used in modern texts takes an ordinary
> virama-joined shape న్ , as other consonants do … Prior to Unicode 14.0, these two distinct forms
> were treated as glyphic variants"**

| | Form | Codepoints |
|---|---|---|
| ✅ | **న్** — modern Telugu, a virama-joined NA | `U+0C28 U+0C4D` |
| ❌ | **ౝ** — archaic and scholarly only, **not** canonically equivalent to the above | `U+0C5D` |

**If `U+0C5D` turns up in translator output it came from a wrong keyboard layout or a bad
font-to-Unicode conversion.** Normalization will not unify the two.

### 3h. Digits — Telugu digits exist and are effectively dead

The orthography notes say it twice: *"Telugu has a set of native digits but doesn't often use them in
modern texts."* · *"Telugu has native digits, but they are only used infrequently."* The measurement
quantifies "infrequently":

| Corpus | Telugu digits `U+0C66`–`U+0C6F` | ASCII digits `0`–`9` |
|---|---:|---:|
| **[E]** encyclopedia (194,153 chars) | **1** | 2,940 |
| **[B]** broadcaster (135,934 chars) | **0** | 3,020 |
| **[N1]** newspaper | **0** | 149 |
| **[N2]** newspaper | **0** | 756 |

**One Telugu digit in roughly 6,900 digit tokens** — and that single occurrence is itself a
mixed-script accident, inside a date whose *year* is ASCII:

| | Date fragment | What it is |
|---|---|---|
| ✅ | **2022 మార్చి 3 న** | ASCII throughout, which is what every publisher measured here does |
| ❌ | **2022 మార్చి ౩ న** | the one attested occurrence: ASCII `2022` and Telugu **౩** `U+0C69` in the same date |

> **Guide rule: use ASCII digits `0`–`9`. Never render numerals in Telugu digits.** This is not a
> stylistic preference; it is what the measurement shows. Add `U+0C66`–`U+0C6F` to the
> forbidden-character scan (§11).

### 3i. Quotation marks — a sourced conflict, carried rather than resolved away

**What the locale data prescribes.** CLDR `te.xml` sets all four delimiters to the inheritance marker
`↑↑↑`, so Telugu takes the **root** defaults, extracted by codepoint rather than from prose:

| Role | Character | Codepoint | Unicode name |
|---|---|---|---|
| `quotationStart` | “ | **U+201C** | LEFT DOUBLE QUOTATION MARK |
| `quotationEnd` | ” | **U+201D** | RIGHT DOUBLE QUOTATION MARK |
| `alternateQuotationStart` | ‘ | **U+2018** | LEFT SINGLE QUOTATION MARK |
| `alternateQuotationEnd` | ’ | **U+2019** | RIGHT SINGLE QUOTATION MARK |

**The orthography notes give the same primary pair and state the nested convention explicitly** —
verbatim:

> **`initial  “  ”`**
> **`nested  ‘  ’`**
> **`Single quotation marks are used for quotations within quotations.`**

So the inner pair is sourced, not inferred: primary **“ ” U+201C / U+201D**, nested
**‘ ’ U+2018 / U+2019**.

**🔴 And now the conflict, because the press does something else entirely:**

| Corpus | `U+201C` | `U+201D` | `U+2018` | `U+2019` | `U+0022` |
|---|---:|---:|---:|---:|---:|
| **[E]** encyclopedia | 83 | 81 | 3 | 3 | 165 |
| **[B]** broadcaster | **0** | **0** | 52 | 46 | 86 |
| **[N1]** newspaper | **0** | **0** | 9 | 9 | 0 |
| **[N2]** newspaper | **0** | **0** | 99 | 99 | 19 |

**All three news publishers use zero curly double quotes.** Their workhorse is the **single** curly
pair, used where English would use doubles — and the broadcaster additionally **doubles the single
mark** to build a double quote, machine-read as `U+2018 U+2018 … U+2019 U+2019`, while using plain
ASCII for ordinary reported speech in body text. The encyclopedia, by contrast, does use the curly
double pair natively — including for the move this platform makes constantly, glossing a loanword:

> **పూర్వకాలంలో “కంప్యూటరు” (computer) అనే ఇంగ్లీషు పదాన్ని లెక్కలు చేసే వ్యక్తిని ఉద్దేశించి వాడేవారు**

⚠ **And note this detail, which breaks naive auto-typography:** a Telugu case suffix attaches
**directly outside the closing quote, with no space** — attested: **"కృత్రిమ మేధస్సు"ని**, the term
plus the accusative **ని**. Any rule that inserts a space after a closing quotation mark corrupts it.

🏠 **House rule, and it is a house rule rather than a finding, because the two sources genuinely
disagree:**

1. **Ship the CLDR/orthography pair.** Primary **“ ” U+201C / U+201D**, inner
   **‘ ’ U+2018 / U+2019**. It is the only pair with any normative backing and it round-trips.
2. **`U+0022` and `U+0027` must never appear in shipped Telugu copy** (§11).
3. **Do not flag incoming copy that uses single-curly-as-primary, or doubled singles, as an error.**
   It is Telugu newspaper house style. **Convert it; do not send it back as a defect.**

| | Form | Codepoints |
|---|---|---|
| ✅ | **“కృత్రిమ మేధ”** | opening `U+201C`, closing `U+201D` |
| ❌ | **"కృత్రిమ మేధ"** | ASCII `U+0022` both sides — zero occurrences permitted in shipped copy |

### 3j. Punctuation — and the danda that Telugu does not use

Unicode 17.0.0 §12.7, verbatim:

> **"Danda and double danda are used primarily in the domain of religious texts to indicate the
> equivalent of a comma and full stop, respectively. The danda and double danda marks as well as
> some other unified punctuation used with Telugu are found in the Devanagari block"**

The orthography notes agree, marking both as *infrequent* and stating *"Telugu uses ASCII punctuation,
but may also use a couple of indic punctuation marks"* and *"Telugu commonly uses ASCII parentheses"*. Note the characters live in the
**Devanagari** block — `U+0964` and `U+0965`. **There is no Telugu-specific danda.**

**The measurement is unambiguous.** `U+0964` occurrences: **[B]** 0 · **[N1]** 0 · **[N2]** 0 ·
**[E]** 5 — against **2,279** occurrences of `U+002E` period in **[E]** alone. And all five dandas
come from **one single article by one author**.

| | Sentence-final punctuation | Codepoint |
|---|---|---|
| ✅ | the ordinary period, e.g. **… ఉంది.** | `U+002E` |
| ❌ | a danda, written after the same clause | `U+0964` — a ported Devanagari habit; ⚠ **no Devanagari glyph is embedded anywhere in this guide**, by design, so that a stray-script scan of this file returns clean |

Working punctuation set, all ASCII: comma `U+002C` · period `U+002E` · question mark `U+003F` ·
exclamation `U+0021` · colon `U+003A` · semicolon `U+003B` · parentheses `U+0028` / `U+0029`.

### 3k. Line breaking

Verbatim, and this is the highest-value paragraph in the source material for a web platform:

> **"Spaces provide the main line break opportunities, however Telugu is an agglutinative language
> and Telugu words can be long. This can lead to large gaps during justification, and sometimes words
> that are longer than the available column width, so it is desirable to also hyphenate words."**

> **"Because of the length of Telugu words, in-word line-breaks (hyphenation) are very common and
> needed during layout, especially in narrow columns, such as newsprint."**

> **"Hyphenation mostly takes place at syllable boundaries, however there are also occasional
> exceptions and special cases."**

And: *"Telugu uses the so-called 'alphabetic' baseline, which is the same as for Latin and many other
scripts."*

⚠ **Declared gap:** **UAX #14 and UAX #29 were not parsed** in the research run — both were reachable
and were not spent on. **The normative `Line_Break` and `Grapheme_Cluster_Break` property values for
the Telugu block are therefore not established here.** A build that needs them must fetch those two
annexes. 🏠 **House rule until then:** `overflow-wrap: break-word` as the safety net; do not enable
automatic hyphenation for `lang="te"` without testing what the browser actually does at a syllable
boundary.

### 3l. String handling — measured, not theorized

Grapheme clusters are not codepoints, and codepoints are not what the reader sees. Measured on
**కృత్రిమ** ("artificial"), machine-read as `U+0C15 U+0C43 U+0C24 U+0C4D U+0C30 U+0C3F U+0C2E` —
**7 codepoints, 4 visible clusters**:

| Naive truncation | Result | Codepoints | What breaks |
|---|---|---|---|
| `w[:3]` | **కృత** | `U+0C15 U+0C43 U+0C24` | clean by luck |
| `w[:4]` | **కృత్** | `U+0C15 U+0C43 U+0C24 U+0C4D` | **dangling virama** — renders a bare vowel-killer |
| `w[:5]` | **కృత్ర** | `U+0C15 U+0C43 U+0C24 U+0C4D U+0C30` | conjunct half-formed |

> **🔴 Never truncate Telugu by codepoint or by UTF-16 code unit.** Use grapheme-cluster segmentation
> (`Intl.Segmenter` with `granularity: "grapheme"`). Never assume a character count maps to visual
> width. **Never cut a string immediately after `U+0C4D`.** Never place an ellipsis mid-cluster.

### 3m. Fonts — ship one, and QA the conjuncts

Reachable and verified as existing (HTTP 200, contents not inspected): **Noto Sans Telugu** and
**Noto Serif Telugu** on the open web-font library, the upstream Noto Telugu source repository, and
the system Telugu font documented by the platform vendor.

⚠ **No rendering test was run, and no font is named here as mis-rendering any conjunct.** That would
be invention. What *can* be stated, sourced, is what a Telugu font must implement — the shaper
interrogates these OpenType features, verbatim: **`Reph 'rphf'`** · **`Half forms 'half'`** ·
**`Pre-base-reordering forms of Ra/Rra 'pref'`** · **`Below-base forms 'blwf'`** ·
**`Post-base forms 'pstf'`** — and that conjoining behavior is **discovered from the font at load
time**, not assumed:

> **"in old shaping-engine implementations, all consonant properties were static: consonants were
> assumed to have particular conjoining forms. In the new implementation model, consonant conjoining
> behavior is a dynamic property."**

**Which means the same byte sequence legitimately renders differently in different fonts.** A font
without `blwf` for a given consonant will not stack it.

🏠 **House recommendation (craft):** ship a Telugu webfont rather than relying on system fallback, and
**visually QA this conjunct string**, every element of which is attested in the corpora:

**క్ష** `U+0C15 U+0C4D U+0C37` · **ష్ట్ర** `U+0C37 U+0C4D U+0C1F U+0C4D U+0C30` (a three-consonant
stack) · **ప్ర** `U+0C2A U+0C4D U+0C30` · **జ్ఞ** `U+0C1C U+0C4D U+0C1E` · **త్ర** `U+0C24 U+0C4D U+0C30` ·
**స్సు** `U+0C38 U+0C4D U+0C38 U+0C41` · **న్యూ** `U+0C28 U+0C4D U+0C2F U+0C42` · **ై** `U+0C48` on a
cluster · and a virama+ZWNJ seam such as **నెట్‌వర్క్**.

### 3n. Romanization never appears in the UI

🏠 **House rule.** Telugu interface text, content, and glossary entries are written in Telugu script.
Romanized Telugu (*vyāvahārikam*, *ottu*, *mīru*) belongs in **this guide and in translator-facing
notes only** — never in shipped copy, never as a fallback when a font is missing, never as a
"searchable" duplicate of a heading. ⚠ **No Telugu-specific source on romanization-in-native-text was
established.** This is the kit's own rule applied to Telugu, and it is marked as such rather than
dressed up as a sourced convention.

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/Public/UCD/latest/ucd/CompositionExclusions.txt> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://r12a.github.io/scripts/telu/te.html> ·
<https://learn.microsoft.com/en-us/typography/script-development/telugu> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+Telugu> · <https://github.com/notofonts/telugu> ·
<https://www.unicode.org/reports/tr14/> · <https://www.unicode.org/reports/tr29/>

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes:** `lang="te"` (base), `lang="te-easy"` (simplified variant, per the
  header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 / 3.1.2, and it drives spellcheck and screen-reader voice selection.
- **🔴 ZWNJ is content. Do not strip `U+200C`.** A `U+0C4D U+200C` sequence before a consonant is
  orthography — 297 of 309 joiners in the encyclopedia corpus sit exactly there, and CLDR itself
  ships one inside `te` locale data (§3e, §5e).
- **🔴 ZWNJ is also noise, and must never be an equality signal.** Word-final, pre-punctuation,
  post-vowel-sign, and repeated joiners are CMS artifacts — up to **24 %** of all occurrences.
  Normalize the noise class away **for comparison only**, keep the bytes in storage, and make sure no
  diff, dedupe, translation-memory match, or "did this string change" check fires on a joiner.
- **Normalize to NFC on ingest and assert it in CI.** Only `U+0C48` decomposes, nothing is a
  composition exclusion, so NFC **repairs** decomposed input (§3f). ⚠ **NFC is a floor:** it does not
  touch `U+0C55` analytic sequences, `U+0C5D`, joiner noise, or terminology inconsistency.
- **🔴 Truncate on grapheme clusters, never on code units.** A vowel sign is stored after the whole
  cluster and drawn on its first consonant, and a shaped syllable is indivisible (§3c). **Never cut
  immediately after `U+0C4D`** — it renders a bare vowel-killer (§3l).
- **🔴 Never concatenate UI strings.** Case is a suffix on the noun and the suffix crosses a ZWNJ
  seam (§4b). Whole-sentence message templates with named placeholders, always — and if you must
  concatenate, **emit the `U+200C`**.
- **Tokenization:** whitespace works. **Suffix stripping does not** — prefer substring or fuzzy
  matching over English-style stemming for search, filter, and highlight features.
- **Digits: ASCII `0`–`9` everywhere.** Never emit `U+0C66`–`U+0C6F` (§3h).
- **Numbers: Indian grouping `#,##,##0`.** `12345678` must render **1,23,45,678**. ⚠ The **percent**
  pattern is Western `#,##0%` in CLDR — that is correct, do not "fix" it (§5a).
- **🔴 Do not use compact notation for `te`.** It emits **మిలియన్ / బిలియన్**, not **లక్ష / కోటి**
  (§5c). Write the number out or hand-author the wording.
- **Percent: write శాతం in running prose**; reserve `%` `U+0025` for charts, tables, and dense data
  (§5d).
- **Plural keys: `one` and `other` only** for cardinals, **`other` only** for ordinals — and `one`
  does **not** cover zero (§5e).
- **Currency: `₹` `U+20B9` first, no space**, Indian grouping (§5e). **రూ.** is legitimate in
  newspaper-register body copy; **do not mix the two on one surface.**
- **Dates: day before month.** `dd-MM-yy` short, `d MMMM, y` long. ⚠ **Verify what your formatter
  emits for the AM/PM day period** — `te` inherits it from root and may print Latin (§5f).
- **Fonts are a requirement, not a preference.** Ship a Telugu webfont; conjunct stacking is driven by
  the font's `blwf`/`pstf`/`half` features and is discovered at load time, so **the same bytes render
  differently in different fonts** (§3m). ⚠ **No font is named here as bad — no rendering test was
  run.** Run the §3m conjunct string through visual QA yourself.
- **Line breaking:** space-based; long agglutinated words overflow. `overflow-wrap: break-word` as the
  safety net; **no automatic hyphenation for `lang="te"`** until the line-breaking properties are
  actually fetched (§3k). Budget extra `line-height`; never `overflow: hidden` untested.
- **No capitalization logic.** Telugu has **no case distinction**; `text-transform: capitalize` is a
  no-op at best (§3b).
- **Quotation marks:** normalize straight ASCII quotes in body copy to **“ ” U+201C / U+201D**, inner
  **‘ ’ U+2018 / U+2019** (§3i). ⚠ **Do not auto-insert a space after a closing quote** — Telugu case
  suffixes attach directly to it.
- **Index alphabet for glossary navigation** — the independent vowels followed by the consonants:
  **అ ఆ ఇ ఈ ఉ ఊ ఋ ఌ ఎ ఏ ఐ ఒ ఓ ఔ · క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ ట ఠ డ ఢ ణ త థ ద ధ న ప ఫ బ భ మ య ర ఱ ల ళ ఴ వ శ ష స హ**.
  ⚠ **No sourced Telugu collation order was established** — this is character-database order, not an
  attested dictionary order, and it is marked as such. Decide deliberately whether the archaic letters
  **ఱ** `U+0C31` and **ఴ** `U+0C34` get their own buckets.
- **Locale negotiation:** `te-easy` must resolve to Telugu content and never fall back to another
  language's easy variant.
- **Never ASCII-fold or romanize Telugu in the UI** (§3n). A name field is data.

Sources: <https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/root.xml> ·
<https://r12a.github.io/scripts/telu/te.html> ·
<https://learn.microsoft.com/en-us/typography/script-development/telugu> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+Telugu>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md). Ordered by yield.

- **🔴 The ZWNJ classifier — the highest-yield check in this language, and it has two halves.**
  - **Half one, destructive-edit detection:** flag any commit or import that **removes** a `U+200C`
    sitting between `U+0C4D` and a Telugu consonant. That joiner is content (§3e) and its removal
    changes the word silently.
  - **Half two, comparison hygiene:** before any equality, diff, dedupe, or translation-memory
    comparison, strip only the **noise** class — `U+200C` that is word-final, before a space or
    punctuation, immediately after a vowel sign, or consecutive with another `U+200C`. Assert that
    two strings differing *only* in noise-class joiners compare **equal**. ⚠ Report, never
    auto-rewrite stored content: the noise is conventional in real Telugu sources.
  - **Run-length alarm:** two or more consecutive `U+200C` is always a defect (attested up to three
    in a row in live press copy).
- **🔴 Forbidden-character scan.**
  - **`U+0C66`–`U+0C6F`** Telugu digits — banned outright (§3h). One occurrence in ~6,900 digit
    tokens across four corpora, and that one is a mixed-script accident.
  - **`U+0C55`** LENGTH MARK — the standard's own "do not use" analytic sequences, which **NFC will
    not repair** (§3f). Every occurrence is a finding.
  - **`U+0C5D`** NAKAARA POLLU — archaic; modern Telugu writes `U+0C28 U+0C4D` (§3g).
  - **`U+0964` / `U+0965`** danda and double danda — a ported Devanagari habit; **zero occurrences in
    all three press corpora** (§3j).
  - **`U+0022` and `U+0027`** ASCII quote and apostrophe in Telugu prose (§3i).
  - **Any Tamil, Kannada, Devanagari, Bengali, or Malayalam codepoint inside a `te` string.** Script
    mixing at codepoint level is the signature of a corrupted fetch or a bad paste (§2a).
  - **`U+FFFD`** — a decode already failed upstream.
- **🔴 NFC assertion (§3f).** Every `te` string must satisfy `s === s.normalize('NFC')`, on
  **translation JSON keys as well as values**. The fix here is safe — normalizing repairs Telugu.
  Report the offending codepoints, not just the file.
- **🔴 Dangling-virama scan (§3l).** Flag any string **ending** in `U+0C4D` where the source did not,
  and any truncation or ellipsis boundary that falls immediately after `U+0C4D`. This is what a
  code-unit `slice()` produces, and it renders a bare vowel-killer.
- **🔴 Number-grouping leak (§5a).** Flag Western `\d,\d{3},\d{3}` grouping in `te` content; Telugu
  groups **2-2-3**. Fixture: `12345678` → **1,23,45,678**.
- **🔴 Compact-notation leak (§5c).** Flag **మిలియన్** or **బిలియన్** in `te` prose. They are what the
  compact formatter emits and **not** what Telugu prose says; the prose scale words are **లక్ష** and
  **కోటి**.
- **🔴 Percent-sign leak (§5d).** Flag `U+0025` in running `te` prose — expected only in chart, table,
  and data contexts. The prose form is **శాతం**.
- **Date-order leak (§5f).** Flag `M/d/y`-shaped numeric dates anywhere in `te`. ⚠ **Do not** raise a
  missing comma before the year as an error: CLDR's `long` pattern carries one, but the harvested
  press dates drop it (§5f) — a consistency note at most.
- **Register check (§4a).** Flag **నువ్వు**, **నీవు**, **నీ** and **తమరు** anywhere in `te` or
  `te-easy` content — the census records **zero** occurrences of నీవు and తమరు, and the only నువ్వు is
  reported speech inside a story, never reader address. Flag the literary markers too: **-ము** noun
  endings (**రాష్ట్రము**-shaped), the **-ెను** past (**చేసెను**-shaped) and **-ముగా** adverbials. ⚠ Do
  **not** flag **ఉన్నది** — it is formal-but-current, not an error.
- **🔴 Terminology consistency (§6b, §6c).** Flag any document containing more than one of
  **కృత్రిమ మేధ** / **కృత్రిమ మేధస్సు** / **ఆర్టిఫిషియల్ ఇంటెలిజెన్స్**; or more than one of
  **యంత్ర అభ్యాసం** / **యంత్ర శిక్షణ** / **మర ప్రజ్ఞ** / **మెషిన్ లెర్నింగ్** / **మెషీన్ లెర్నింగ్**.
  ⚠ **The message must say "inconsistent", never "wrong"** — all of them are attested Telugu and **no
  authority has adjudicated between them** (§6a). The check enforces **the term sheet's pick**.
- **Transliteration-ending consistency (§6e).** Flag a corpus containing both the virama-final and the
  vowel-final spelling of the same loanword (**కంప్యూటర్** against **కంప్యూటరు**). Same rule: a
  consistency message, not an error message.
- **Gloss-pattern check (§6f).** Flag an English term appearing *before* its Telugu equivalent in a
  parenthetical pair, and flag the same term glossed more than once per page.
- **Acronym check (§6e).** Flag a Telugu-script transliteration of `AI`, `API`, `URL`, `CPU` or `GPU`
  in `te` content — including **ఏఐ** — where the term sheet says these stay in Latin capitals.
- **Script-ratio expectation.** Running `te` content should be **dense in `U+0C00`–`U+0C7F`**. Two
  useful inverses: a `te` string that is **pure ASCII** and longer than a few words is an untranslated
  English leak; a `te` string with **no** Telugu codepoints at all in a content field is a fallback
  that did not fire. ⚠ Some Latin is normal and attested — `AI`, `CNN`, `NLP` appear unconverted in
  real Telugu technical prose. **A high ratio is a review trigger, not a gate.**
- **Source-language leak scan (EN → TE):** left-in English function words, English-formatted numbers
  and dates, an English idiom rendered word-for-word (§7), and untranslated UI verbs.
- **⚠ Checks this guide cannot yet specify**, listed so they are not mistaken for clean bills of
  health: **line-break and grapheme-cluster property conformance** (the annexes were not parsed,
  §3k); **font-rendering correctness** for conjunct stacks (no rendering test was run, §3m); and any
  **plain-language readability metric** for `te-easy` (no norm exists to measure against, §8a).

Sources: <https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> ·
<https://www.unicode.org/versions/latest/core-spec/chapter-12/> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/te.xml> ·
<https://r12a.github.io/scripts/telu/te.html> · [translation-quality](../translation-quality.md) ·
[verification](../verification.md)
