<!-- base -->
# lang-ar — Arabic (العربية) — setup & sources

> **The translation guide itself is [`ar.md`](ar.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base. Note up front that Arabic has **no single global academy**
equivalent to the Académie française — authority is distributed across national bodies and
standards organizations.

- **Unicode — Arabic script.** The Arabic FAQ (contextual forms, bidi, why presentation forms
  should not be used for normal text) and the Arabic block **U+0600–U+06FF**.
  <https://www.unicode.org/faq/arabic.html>
- **W3C — Arabic Layout Requirements (`alreq`).** Script-aware shaping, bidi handling,
  justification, line-breaking for Arabic-script text.
  <https://www.w3.org/TR/alreq/>
- **Unicode CLDR — `ar` / `ar-SA` locale data** (numbering systems, decimal/grouping separators,
  date formats incl. Islamic calendar, embedded bidi controls in number and date patterns).
  Values in §5 were read from **CLDR 48.2 (2026-03-17)**, replacing this guide's earlier citation
  of a **v24 (2013) chart**; the links below are Unicode's version-agnostic *latest* permalinks, so
  they track the current release instead of freezing a version number. There is no
  `summary/ar_SA.html` chart — `ar-SA` differences are noted inline in §5 instead.
  <https://www.unicode.org/cldr/charts/latest/summary/ar.html> ·
  <https://www.unicode.org/cldr/charts/latest/verify/numbers/ar.html> · release history:
  <https://cldr.unicode.org/downloads/cldr-48>
- **Unicode — digit terminology** (Western vs Arabic-Indic digits and their separators).
  <https://www.unicode.org/terminology/digits.html>
- **King Salman Global Academy for Arabic Language (KSGAAL)** and the network of national
  **Arabic Language Academies**; national bodies such as the **UAE Arabic Language Centre**. For
  digital/technical terminology, the **Saudi Data and AI Authority (SDAIA)** and KSGAAL have
  published Arabic technical glossaries. (Referenced via news coverage — see provenance caveat.)
  <https://www.arabnews.com/node/2046471/amp>
- **UAE government — Arabic Dictionary of Artificial Intelligence** (an official, searchable
  modern-terminology reference; the anchor for the §6 seed table).
  <https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/the-arabic-dictionary-of-artificial-intelligence>

**Non-primary / weak-provenance sources** the research also leaned on (kept only where a claim
is plausible, and marked at point of use): a hosted PDF of a Modern Standard Arabic reference
grammar (a mirror, not an academy)
<https://imamhamzatcoed.edu.ng/library/ebooks/resources/Modern_Standard_Arabic_Reference_Grammar.pdf>;
a corporate Arabic style guide <https://www.aramco.com/-/media/publications/books/arabic_style-guide-v2.pdf>;
a commercial language-school blog <https://www.arabacademy.com/how-to-write-arabic-learn-letters-styles/>;
a university talent-wiki language guide <https://sites.middlebury.edu/ewttalentwiki/2019/12/03/arabic-language-guide/>;
community glossaries <https://github.com/nainiayoub/nlp-arabic-glossary> and
<https://hala.academy/glossary>; and news coverage of glossary launches
<https://english.aawsat.com/culture/5221062-icaire-launches-data-ai-glossary-mark-world-arabic-language-day>.

**Provenance caveat.** The research attached an academic **Journal of Arabic and Islamic
Studies** article (`jais/…/v13_08_magidow…`) to several *digital-editorial* and *grammar-style*
claims (the passive/relative-clause restructuring note in §4, the "neutral editorial avoids
dialectal markers" note in §9, and a "digital editorial references" note here). A dialectology
journal paper cannot plausibly be the source for house-style or web-editorial guidance, so that
citation is treated as **misattributed** and dropped as support for those claims; the claims are
kept only where independently plausible and are marked as resting on weak/no provenance. One
term source in the research was a commercial industry ML glossary; it is **withheld here per the
kit's source-neutrality rule** (no AI-vendor/tool names) — see §6. Everything the research itself
labeled *unsourced* is carried below as **⚠ unverified**.

Sources: <https://www.unicode.org/faq/arabic.html> · <https://www.w3.org/TR/alreq/> ·
<https://www.unicode.org/cldr/charts/latest/summary/ar.html> ·
<https://cldr.unicode.org/downloads/cldr-48> ·
<https://www.unicode.org/terminology/digits.html> ·
<https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/the-arabic-dictionary-of-artificial-intelligence>
(the weak-provenance and misattributed items are listed inline above with their caveats and are
**not** repeated here as evidence.)

---

## 3. Script & typography

**Character inventory & Unicode range.** Arabic is written in the Arabic script, encoded mainly
in the **Arabic block U+0600–U+06FF** (with Arabic Supplement / Extended ranges for less common
letters). Crucially, Arabic text is stored as **base letters that take contextual forms**
(initial / medial / final / isolated) at render time — **not** as separate code points per
shape. The **presentation-form** ranges exist for legacy interchange; they **must not be used
for normal text** (see the verification list, §11).

**Direction, bidi, and mixed runs (the central RTL fact).** Arabic runs **right-to-left**, but
real web text is *mixed-direction*, and correct display depends on the **Unicode bidirectional
algorithm**. Latin words, numbers, and URLs can sit inside an Arabic sentence **without being
visually reversed** *if* the markup and bidi handling are correct. This is the highest-frequency
RTL defect surface: a Latin acronym, a version number, or a URL dropped into RTL copy renders
scrambled when the surrounding direction context is wrong. Treat every mixed LTR run inside an
Arabic string as something to check, not assume.

**Bidi toolbox (concrete techniques).** The follow-up research supplied a working toolbox; it is
presented here as **guidance** because its citation is wrong (it pointed at a CLDR download page,
not a W3C i18n bidi article) — **source open / ⚠ citation misattributed**, techniques below are
standard bidi practice to confirm against the correct W3C i18n source:

- **`<bdi>` / `dir="auto"` for injected or unknown-direction inline text.** Wrap user-supplied or
  unknown-direction fragments in **`<bdi>`**; use **`dir="auto"`** when the direction cannot be
  known ahead of time so the engine infers it from the first strong character.
- **Explicit `dir="rtl"` / `dir="ltr"` on tightly wrapped known phrases.** When you *do* know a
  fragment's direction, assert it on a tight wrapper rather than relying on inheritance.
- **LRM / RLM (U+200E / U+200F) as a legacy / edge-case fix.** Directional marks keep an adjacent
  number or neighboring phrase from being absorbed into the wrong directional run — use sparingly,
  mainly for older or non-conformant browsers.
- **CSS `unicode-bidi` (`isolate` / `plaintext`) only as a rendering-level control.** For normal
  content, prefer semantic HTML isolation (`<bdi>`, `dir`) over CSS-level bidi hacks; reach for
  `unicode-bidi: isolate` / `plaintext` only when CSS-level behavior is genuinely needed.
- **Placeholder isolation in RTL template strings.** For `{0}`-style placeholders, wrap **each**
  placeholder value in isolation markup; if a placeholder itself carries embedded Latin content,
  isolate that embedded run too — nested opposite-direction fragments need **nested** isolation,
  not a single outer wrapper.
- **Neutral-character traps next to digits.** Punctuation, hyphens, ranges, symbols, and
  phone/MAC-style strings can "attach" to the wrong run, especially near numbers or mixed-script
  fragments; these inline cases need isolation or directional marks.
- **UI mirroring for RTL. ⚠ unverified.** Browsers auto-mirror the mirrored *characters*, but UI
  authors still typically mirror **icons, chevrons, navigation flow, progress direction, and
  slider affordances** so interaction direction matches reading direction. The research itself
  marked the exact icon/chevron mirroring policy **unsourced** — carried here as **⚠ unverified**.

**Tokenization & shaping.** Words are **whitespace-separated**, so ordinary word tokenization
mostly works — but **clitics attach orthographically** to their host word, so Arabic token
boundaries are not identical to English (a highlighter or word-splitter tuned for English will
mis-segment clitic-bearing words). Line breaking and shaping need **Arabic-aware rendering**;
the engine, not manual hyphenation, does the work.

**Fonts & known pitfalls.** Web fonts need **full Arabic OpenType support**: contextual
**joining**, ligatures, diacritic (harakat) handling, and correct **mark positioning**. The
recurring web pitfalls the research names: missing glyphs for extended letters; **broken shaping
from the wrong font stack**; poor handling of **mixed RTL/LTR runs**; and **overuse of
presentation forms or isolated-letter images instead of real text**.

**Hyphenation & line breaking.** Arabic does **not** use Latin-style hyphenation; line breaking
is handled by the browser / layout engine, and manual hyphen insertion is wrong. W3C `alreq`
stresses script-aware shaping, bidi handling, and proper **justification** behavior instead.

**Punctuation & quotation.** Formal Arabic uses RTL-adapted marks: the **Arabic comma ،**
(U+060C), the **Arabic question mark ؟** (U+061F), and the **Arabic semicolon ؛** (U+061B) —
widely used in formal writing and digital typography. Quotation practice varies by publisher;
**guillemets «…»** are the common editorial choice for quoted speech or terms, sometimes with
English-style quotes for embedded material, depending on house style. *(That guillemet claim no
longer rests on the weak UGC source in the footer: the 1912 foundational treatise and the Arabic
encyclopedia quoted below both name **« »** as the mark for verbatim quotation, and a 6-publication
census counted 120 «…» spans against 27 “…” — see the nested-pair block.)*

- ✅ Arabic marks in Arabic copy: `… ؟` / `… ،` / `«…»`
- ❌ Latin marks standing in for them in body copy: `… ?` / `… ,` / `"…"`

**The nested (inner) pair is ’…‘** — `alternateQuotationStart` = **’ U+2019**,
`alternateQuotationEnd` = **‘ U+2018** in the CLDR `ar` locale data, read codepoint-by-codepoint
from the pinned **CLDR 48.2** release this session. The same fetch gives the outer pair as
`quotationStart` = **” U+201D** and `quotationEnd` = **“ U+201C**. Worth knowing how solid that
datum is: `common/main/ar.xml` carries all four values **explicitly** in the release source — this
is a genuine `ar`-specific override, not the CLDR root default inherited under the locale's name.

**The authority hunt, by name, and what it returned.** Four Arabic normative sources were reached
and read in full this pass. **Every one of them defines exactly one quotation pair and none of them
has a nesting convention at all:**

- **أحمد زكي باشا, «الترقيم وعلاماته في اللغة العربية» (1912)** — the foundational Arabic
  punctuation treatise, full text fetched. Its canonical list of ten marks gives item (٩) as
  **التضبيب « »**, and the rule reads: "*(جـ) التضبيب وعلامته « » أي ضبتان توضع بينهما الجمل
  والعبارات المنقولة بالحرف*" ("*al-taḍbīb, its mark is « », i.e. two ḍabbas, between which are
  placed sentences and expressions quoted verbatim*"). One pair, **« » U+00AB/U+00BB**. No second
  level exists in his system.
- **مجمع اللغة العربية بالقاهرة (Academy of the Arabic Language, Cairo)** — a published ruling,
  fetched: "*النص المقتبس يوضع بين علامتي تنصيص " "*" ("*the quoted text is placed between the two
  quotation marks " "*"). One pair, and it is the **ASCII** one. (The live domain is
  **arabicacademy.gov.eg**; `majma.org.eg` does not resolve.)
- **موسوعة اللغة العربية — الدرر السنية** — has *two* pairs but splits them by **subject matter,
  not by depth**: "*وعادةً ما يُستخدَمُ المزدوجان «» مع النُّصوصِ النبَويَّةِ الشَّريفةِ، وعلامةُ
  التنصيصِ " " مع النُّصوصِ الأخرى*" ("*usually the muzdawijān «» are used with noble Prophetic
  texts, and the quotation mark " " with other texts*"). That is a different axis from nesting, and
  reading it as an inner/outer rule would misquote it.
- **W3C Arabic & Persian Layout Requirements** (Group Draft Note, October 2, 2025) — its punctuation
  inventory lists **`" ` U+0022 QUOTATION MARK** as used in Arabic, and contains **no « U+00AB,
  no “ U+201C and no ‘ U+2018 anywhere in the document**. It states no nesting rule.

**The one source that does name an Arabic inner pair — and why it is thin.** *Arabic orthography
notes v32* (the W3C i18n script-notes series) says: "*Two different styles of quotation mark can be
found in Arabic language texts. When quoted text appears within quoted text different characters are
used, though usually of the same type.*" It then gives **two** systems, not one:

| Style | Primary | Nested |
|---|---|---|
| guillemet | « U+00AB … » U+00BB | ‹ U+2039 … › U+203A |
| curly | ” U+201D … “ U+201C | ’ U+2019 … ‘ U+2018 |

The second row is character-for-character the CLDR `ar` data, so it **corroborates the nested pair
— but weakly**: the page's own citation for the claim is an unexpanded reference macro (it renders
the literal token `wqm` where a source should be), and the script notes and CLDR come from the same
Unicode/W3C ecosystem, so this is not independent confirmation. Its first row is more interesting:
it documents a **guillemet nesting system (‹ › inside « »)** that CLDR does not carry at all.

**Attested usage, measured.** Six Arabic publications (BBC Arabic, Al Jazeera, Al-Ahram Gate,
Al-Quds Al-Arabi, An-Nahar, Al-Ittihad), **~120,000 characters of Arabic-script text** across the
per-outlet samples — 18 fetched articles from the first three, front-page text only from the other
three, which the numbers below should be read against. Counted by codepoint this pass:

- **U+2018 ‘ and U+2019 ’ occur zero times** in Arabic context. The pair CLDR assigns to the Arabic
  inner level is simply **absent from the sample**.
- At the outer level, over the full 34-file fetch (~169,000 Arabic-script characters): **120** spans
  open « and close », **27** open “ and close ”, and **zero** run in the ”…“ order CLDR prescribes.
  BBC Arabic and Al Jazeera use ASCII `"` almost exclusively (172 and 192 occurrences); Al-Ahram and
  Al-Ittihad use « »; Al-Quds Al-Arabi uses both « » and “ ”.

**What this guide therefore claims.** ⚠ **Arabic has no attested indigenous nested-quotation norm
that this pass could reach.** CLDR's ’…‘ is a locale-data convention corroborated only from inside
its own ecosystem and unattested in the press sample; the guillemet family dominates real Arabic
copy, and the *one* documented Arabic nesting system that is not CLDR's puts **‹ › inside « »**.
Both go on the record here, unresolved: pick one system per surface, declare it, and hold it. What
is not in doubt on any reading: the inner marks are **real quotation characters, never an ASCII
apostrophe**.

- ✅ Inner marks per CLDR `ar`: **’** (U+2019) and **‘** (U+2018)
- ✅ Inner marks in the guillemet system, per the script notes: **‹** (U+2039) and **›** (U+203A)
- ❌ ASCII apostrophes standing in for either: `'…'`

**Romanization in native-script text.** Romanization is **normally avoided** in native-script
educational content, except for **foreign names, technical acronyms, or explicit learner-facing
support material**. Body content stays in Arabic script; a transliterated form appears only when
a specific pedagogical purpose requires it — never as a display substitute for an Arabic word.

Sources: <https://www.unicode.org/faq/arabic.html> · <https://www.w3.org/TR/alreq/> ·
<https://sites.middlebury.edu/ewttalentwiki/2019/12/03/arabic-language-guide/> (punctuation /
quotation / romanization notes — weak provenance, UGC guide) ·
<https://www.unicode.org/cldr/charts/latest/summary/ar.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `ar` delimiter fields — outer and nested — were
read codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that
chart) · <https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ar.xml>
(**fetched this pass** — confirms the four values are `ar`-specific, not inherited) ·
**Arabic normative sources fetched and quoted this pass:**
<https://www.safahat.org/books/82047270/1/> (أحمد زكي باشا, *الترقيم وعلاماته في اللغة العربية*,
1912 — التضبيب « » only) ·
<https://www.arabicacademy.gov.eg/ar/items/التصويب_لخطأ_ورد_في_نَصّ_مقتبَس> (Academy of the Arabic
Language, Cairo — `" "` only) · <https://dorar.net/arabia/2694/> (موسوعة اللغة العربية / الدرر
السنية — «» vs `" "` split by subject matter, not by depth) ·
<https://r12a.github.io/scripts/arab/arb.html> (*Arabic orthography notes v32* — the only source
naming an Arabic nested pair; its own citation for that claim is an unexpanded macro, ⚠) ·
**attested-usage census (fetched and counted this pass):** <https://www.bbc.com/arabic> ·
<https://www.aljazeera.net/> · <https://gate.ahram.org.eg/News/5837926.aspx> ·
<https://www.alquds.co.uk/> · <https://www.annahar.com/> · <https://www.aletihad.ae/>
— ⚠ **no Arabic-language authority states a nesting rule**; every one reached defines a single pair.

---

## 10. Technical integration checklist

RTL and shaping make this checklist longer than for an LTR language — the details below are the
build/rendering surface where Arabic most often breaks.

- **`dir` / `lang` attributes.** Set **`dir="rtl"`** on Arabic content, and **`lang="ar"`**
  (base) / **`lang="ar-easy"`** (simplified variant, subject to the §Header token note). Correct
  `lang` per variant and per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**.
  `dir="ltr"` must be (re)asserted on embedded Latin/technical runs where the bidi algorithm
  alone does not resolve them cleanly.
- **Bidirectional algorithm & mixed runs.** Rely on the **Unicode bidirectional algorithm** for
  mixed-direction text; **test every mixed LTR run** — Latin acronyms, numbers, version strings,
  and **URLs** inside Arabic sentences — since these are the most common visual-scramble defects.
  Correct markup + bidi handling keeps them un-reversed. Apply the **bidi toolbox from §3**:
  **`<bdi>` / `dir="auto"`** for injected or unknown-direction inline text; explicit
  **`dir="rtl"` / `dir="ltr"`** on tightly wrapped known phrases; **LRM / RLM (U+200E / U+200F)**
  as a legacy/edge-case fix beside numbers or neighboring phrases; **CSS `unicode-bidi`
  (`isolate` / `plaintext`)** only as a rendering-level control (prefer semantic HTML isolation);
  **isolate each `{0}`-style placeholder** in RTL template strings (nested isolation for embedded
  Latin inside a placeholder); and watch **neutral-character traps** — punctuation, hyphens,
  ranges, phone/MAC-style strings — that attach to the wrong run near digits. *(Toolbox source
  open / ⚠ citation misattributed — see §3.)*
- **UI mirroring (RTL). ⚠ unverified.** Browsers auto-mirror mirrored *characters*, but mirror
  **icons, chevrons, navigation flow, progress direction, and slider affordances** so interaction
  direction matches reading direction. The research marked the exact icon/chevron policy
  **unsourced**; treat as an RTL-design convention to confirm, not a sourced rule.
- **Contextual shaping / joining — store base characters, not presentation forms.** Ship a font
  with **full Arabic OpenType joining, ligature, diacritic, and mark-positioning** support.
  Store text as **base Arabic letters** and let the engine shape them; **never store
  presentation-form code points** (Arabic Presentation Forms) or isolated-letter images as
  "text." A "sanitizer" or normalization pass that rewrites to presentation forms will corrupt
  copy/paste, search, and reshaping.
- **Fonts to ship.** A fully Arabic-capable font with complete joining/ligature/mark coverage;
  **test the wrong-font-stack failure mode** (broken shaping) and **extended-letter glyph
  coverage** before relying on any build.
- **Line breaking & hyphenation.** Let the **browser / layout engine** break lines; do **not**
  insert manual hyphens or soft hyphens into Arabic words. Justification must be script-aware
  (W3C `alreq`).
- **Tokenization / highlighting.** Whitespace word separation *broadly* works, but **clitics
  attach to their host word** — a word-boundary highlighter tuned for English will mis-segment
  clitic-bearing tokens. Verify highlighting against real clitic-bearing Arabic before shipping.
- **Punctuation.** Use Arabic **،** (U+060C), **؟** (U+061F), **؛** (U+061B), and guillemets
  **«…»** in Arabic copy, not their Latin equivalents (§3).
- **Digits in display vs identifiers.** Display numbers per §5 (one digit system per context;
  Arabic-Indic separators ٫ / ٬ where Arabic-Indic digits are used); keep Western digits for
  machine identifiers, ISO-8601 backends, and code.
- **Index alphabet for glossary navigation.** Use **Arabic abjad/alphabetical order**, not an A–Z
  Latin index. No research pass enumerated the collation sequence, and this pass did not read the
  `ar` collation rows either — so **hand-listing the order here would be ⚠ unverified**. Drive the
  glossary index from **CLDR `ar` collation data** (current release) rather than a hard-coded list.
- **Logical vs physical CSS properties.** ⚠ **unverified against the research** — the research
  does not address CSS. As standard RTL engineering practice, prefer **logical properties**
  (`margin-inline-start`, `padding-inline-end`, `text-align: start`) over physical
  left/right ones so layout mirrors correctly under `dir="rtl"`; treat this as an engineering
  convention to confirm, not a sourced rule.

Sources: <https://www.unicode.org/faq/arabic.html> · <https://www.w3.org/TR/alreq/> ·
<https://www.unicode.org/cldr/charts/latest/summary/ar.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (current release **CLDR 48.2**, 2026-03-17) ·
**bidi toolbox
source open / ⚠ misattributed** — the follow-up cited a CLDR download page, not the correct W3C
i18n bidi article; confirm the techniques against W3C i18n before treating as sourced.

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** The large majority of letters in `ar` content must fall in the **Arabic block
  U+0600–U+06FF**. A low Arabic-codepoint ratio signals untranslated source text left in place.
- **No stored presentation forms.** Flag any code point in the **Arabic Presentation Forms**
  ranges (U+FB50–U+FDFF, U+FE70–U+FEFF) in stored text — text must be base characters shaped at
  render time, never presentation forms (§3, §10).
- **Bidi / mixed-run sanity.** Spot-check that embedded **Latin acronyms, numbers, and URLs**
  inside Arabic strings display un-reversed; flag runs that depend on ad-hoc reordering instead
  of correct `dir`/bidi handling.
- **Digit-system consistency.** Within a single number/field, digits are **either** all
  Arabic-Indic (٠–٩) **or** all Western (0–9) — never mixed (e.g. `١2٣` is a defect). Pick the
  system per context per §5 and check it holds; where Arabic-Indic digits are used, separators are
  **٫** (decimal) / **٬** (thousands).
- **Punctuation consistency.** Arabic **، ؟ ؛** used consistently in Arabic copy rather than
  their Latin equivalents; guillemets **«…»** per house style.
- **No Latin transliteration standing in for an Arabic word** in body text (Latin allowed only
  for established acronyms and for slugs/identifiers, §3/§6).
- **Register / gender consistency.** The §4 register+gender strategy is **taken and recorded**: MSA
  formal-neutral, with **rephrasing to avoid gendered second-person address (strategy c)** as the
  primary form and **masculine fallback (a) only where unavoidable**. Scan second-person copy for
  drift — flag **stray gendered direct-address forms** that strategy (c) would have rephrased
  away, any **feminine or dual address** slipped in against the masculine-only fallback, and any
  **dialectal address** — each is both a grammar and a consistency defect.
- **Source-language leak scan (EN/DE → AR).** Left-in English function words (the, and, you,
  please), German umlauts / ß, or English-order calques (e.g. an "of/from" **مِن** possessive
  where an iḍāfa is wanted, §4) surfacing in Arabic sentences.

Sources: <https://www.unicode.org/faq/arabic.html> ·
<https://www.unicode.org/terminology/digits.html> ·
<https://www.unicode.org/cldr/charts/latest/summary/ar.html>

---

*Provenance note:* this guide is built solely from a **thin (non-deep) external desk-research
pass**; several research citations resolved to community, commercial, or academic sources of
uneven relevance (one academic paper appears misattributed to editorial claims — see §2), and are
marked at point of use. All **⚠ unverified** markers indicate claims the research itself could not
source, or that could not be confirmed from the primary authorities in §2. One term-source was
withheld under the kit's source-neutrality rule. A second-model and native-speaker review against
the §2 sources is still outstanding (see Status in the header).
