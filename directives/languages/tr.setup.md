<!-- base -->
# lang-tr — Turkish (Türkçe) — setup & sources

> **The translation guide itself is [`tr.md`](tr.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **Türk Dil Kurumu (TDK)** — the official state language authority. Its **Yazım Kılavuzu**
  (spelling guide) is the normative orthography reference; its **Güncel Türkçe Sözlük (GTS)** is
  the current dictionary. Both are the anchors for the STRONG claims in §3 and §6.
  - Spelling / capitalization rules: <https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/>
  - Punctuation rules: <https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/>
  - Dictionary API (machine-readable, fetched successfully): `https://sozluk.gov.tr/gts?ara=<word>`
    returns JSON with an `anlam` (definition) field. **Note:** the `sozluk.gov.tr` web UI is a
    JavaScript SPA that returns no data to a fetcher; the `/gts?ara=…` **JSON API** is the working
    entry point.
- **TÜBİTAK Ansiklopedi** — the Turkish national science-and-technology council's encyclopedia,
  used for the AI/ML terms that TDK's general dictionary does not define.
  <https://ansiklopedi.tubitak.gov.tr/ansiklopedi/yapay_zeka_ve_makine_ogrenmesi>
- **Unicode CLDR — `tr` locale, release 48.2.0** (numbers, currency, date formats). Verified via
  the official **cldr-json** mirror; the version was confirmed from
  `cldr-core/package.json → "version": "48.2.0"`.
  - Numbers: <https://unpkg.com/cldr-numbers-full@48.2.0/main/tr/numbers.json>
  - Currency: <https://unpkg.com/cldr-numbers-full@48.2.0/main/tr/currencies.json>
  - Dates: <https://unpkg.com/cldr-dates-full@48.2.0/main/tr/ca-gregorian.json>
  - Version pin: <https://unpkg.com/cldr-core@48.2.0/package.json>
- **Unicode — the dotted/dotless i casing behavior.** The definitive engineering write-up of the
  Turkish-i problem (fetched, quoted in §3); the underlying code-point mappings live in Unicode's
  **SpecialCasing** data, which must be checked directly before shipping any casing code.
  <https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/>
- **Noto Sans** — a broadly available open web font with full Latin-Turkish coverage (dotted İ,
  dotless ı, ç ğ ö ş ü in both cases). <https://fonts.google.com/noto/specimen/Noto+Sans>

**Weak-provenance sources** the dossier also leaned on (kept only where a claim is plausible, and
marked at point of use): a community write-up on the sen/siz hierarchy
(<https://kelimelerbenim.com/siz-yerine-sen-demek-ve-turkcedeki-gizli-hitap-hiyerarsisi>); the
Turkish Wikipedia article on **Kıbrıs Türkçesi** (Cyprus Turkish) for the regional-variation
markers (<https://tr.wikipedia.org/wiki/K%C4%B1br%C4%B1s_T%C3%BCrk%C3%A7esi>); a community AI-terms
glossary (<https://github.com/deeplearningturkiye/turkce-yapay-zeka-terimleri/blob/master/oneriler.md>);
a bilingual idiom collection (<https://www.easyturkishgrammar.com/post/turkish-proverbs-idioms-sayings-english>);
and an academic article on **Kolay Dil** (easy/plain language) for §8
(<https://dergipark.org.tr/tr/pub/tkidergi/issue/86057/1478910>).

**Provenance caveat.** There is **no single dominant private "house style"** for Turkish digital
content equivalent to AP/Chicago; the TDK Yazım Kılavuzu is the de-facto orthographic base. The
dossier's claim that TDK is *the* "most-used digital style guide" is **⚠ editorial** — no primary
source establishes a single most-used digital style guide; TDK is authoritative for **orthography**,
which is the load-bearing part. The **İstanbul-Türkçesi-is-neutral** claim (§9) rests on a
search-summary, not a directly fetched primary source, and is marked ⚠ there.

Sources: <https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/> ·
<https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/> ·
<https://ansiklopedi.tubitak.gov.tr/ansiklopedi/yapay_zeka_ve_makine_ogrenmesi> ·
CLDR 48.2 version pin (data package `48.2.0`) <https://unpkg.com/cldr-core@48.2.0/package.json>
(this section is itself the source inventory; the weak-provenance tier and the "no single
house style" caveat are marked inline)

---

## 3. Script & typography

**Character inventory & the alphabet.** Modern Turkish uses a **29-letter Latin alphabet** (adopted
1928): a b c **ç** d e f g **ğ** h **ı** i j k l m n o **ö** p r s **ş** t u **ü** v y z. It has the
**four "i" letters** — dotted **İ / i** and dotless **I / ı** — plus **ç, ş, ğ, ö, ü**. It does
**not** contain **q, w, x** (those appear only in foreign names, acronyms, and un-adapted loans).
Romanization is **n/a** — the script is already Latin, so there is no transliteration layer and no
"romanization never appears in the UI" rule to police; the analogous rule here is that the **full
Turkish letter set must render** (below).

**⚠⚠ THE DOTTED/DOTLESS-i CASING TRAP — the single most important technical fact for Turkish.**
Case conversion **must be locale-aware** or it silently corrupts Turkish text *and breaks
comparisons and security checks*. The mapping that causes it:

- lowercase **i** (U+0069, dotted) uppercases to **İ** (U+0130, dotted capital), **not** `I`.
- lowercase **ı** (U+0131, dotless) uppercases to **I** (U+0049), and uppercase `I` lowercases to
  dotless **ı** under a Turkish locale.

Quoted from the fetched engineering write-up:
> "The uppercase for `i` in English is `I` (note the lack of a dot) but in Turkish it's dotted,
> `İ`. So while we have two i's (upper and lower), they have four."

And the consequence, same page:
> "If you don't pay attention to this, it's very easy to end up with a costly security bug as a
> result."

The write-up's concrete example is a **.NET** one, where `ToUpper()` is **culture-sensitive by
default** — under `tr-TR` the `i` uppercases to dotted `İ`, so the comparison fails:
> `"interesting".ToUpper() == "INTERESTING"` returns **False** under `tr-TR`.

A case-insensitive comparison of a protocol string, header, file extension, or identifier can
therefore **silently return the wrong answer** on a Turkish-locale machine.

**⚠⚠ Which call is the dangerous one is a per-platform question — and getting it backwards is
itself the bug.** The hazard is universal; the API that triggers it is not:

| Platform | Locale-**independent** (safe for identifiers) | Picks up the **ambient locale** (the bug surface) |
|---|---|---|
| JavaScript / TypeScript | `toUpperCase()` / `toLowerCase()` | `toLocaleUpperCase()` / `toLocaleLowerCase()` **with no locale argument** |
| .NET | `ToUpperInvariant()` / `ToLowerInvariant()` | `ToUpper()` / `ToLower()` with no `CultureInfo` |
| Java | `toUpperCase(Locale.ROOT)` | `toUpperCase()` with no `Locale` |

In ECMAScript, plain `toUpperCase()` performs Unicode **Default Case Conversion** and is therefore
locale-independent: it returns `"INTERESTING"` on a Turkish host too, and it takes **no** locale
argument — `toUpperCase('en-US')` is not a valid signature and the argument is ignored. So in
JavaScript the call to distrust is the `toLocale…` one, which is the exact **opposite** of the
.NET case the source describes.

- ✅ **UI display text** (labels, headings, a "shout" style): use the Turkish locale **explicitly** —
  `toLocaleUpperCase('tr')` / `toLocaleLowerCase('tr')` — so `i → İ` and `ı → I` correctly.
  e.g. *"iptal"* → **"İPTAL"** (cancel), *"ışık"* → **"IŞIK"** (light).
- ❌ **Identifiers / comparisons / security** (protocol strings, header names, file extensions,
  slugs, tokens, hostnames): **never** let the ambient locale decide. Take the locale-independent
  call from the left-hand column above — in JS that is bare `toUpperCase()` — so `"INDEX"` stays
  `"INDEX"`. e.g. treating `"title".toLocaleUpperCase('tr')` (→ **"TİTLE"**, dotted) as if it
  equaled `"TITLE"` is the classic silent bug.

The **.NET behavior above is sourced**; the per-platform table and the JS/Java rows are **⚠
editorial engineering guidance** — the dossier carried only the .NET example, so confirm each row
against your own runtime's casing documentation before shipping. The code-point mapping itself is
widely documented in **Unicode SpecialCasing** but was **not re-fetched here — verify against
Unicode SpecialCasing.txt before shipping casing code.** The rule is restated as a hard check in
§10 and §11.

**Capitalization of sentences (TDK — STRONG).** Verbatim from the TDK spelling rules:
> "Cümle büyük harfle başlar" *(a sentence begins with a capital letter).*

Exceptions/refinements, same source:
> "İki çizgi arasındaki açıklama cümleleri büyük harfle başlamaz" *(an explanatory clause set
> between two dashes does not begin with a capital).*
> "İki noktadan sonra gelen cümleler büyük harfle başlar" *(a full sentence after a colon is
> capitalized).*

- ✅ *"Kayıt tamamlandı: Hesabınız hazır."* — full sentence after the colon is capitalized.
- ❌ *"Kayıt tamamlandı: hesabınız hazır."* — a full clause after `:` left lower-case.

**Quotation marks (TDK — STRONG, glyphs verified by codepoint census).** TDK sets its own rule
headers in **curly/typographic** marks, and the ASCII straight quote does **not** appear in the
page's prose at all. A codepoint census of the fetched punctuation page's text content
(tags stripped) returned **U+0022 = 0** occurrences; the marks TDK actually prints are:

| TDK section header (verbatim) | Glyphs | Code points |
|---|---|---|
| `Tırnak İşareti ( “ ” )` | “ … ” | **U+201C** open / **U+201D** close |
| `Tırnak İşareti ( ‘ ’ )` (single/inner) | ‘ … ’ | **U+2018** open / **U+2019** close |
| `Kesme İşareti ( ’ )` | ’ | **U+2019** (apostrophe, see below) |

In the same census the page's text carried **22× U+201C**, **22× U+201D**, **111× U+2019**,
**3× U+2018** — and **zero** U+0022, **zero** U+00AB/U+00BB. **Rule: use the curly marks
(U+201C/U+201D), not the ASCII straight quote `"` (U+0022).** Verbatim from the rules themselves:
> "Başka bir kimseden veya yazıdan olduğu gibi aktarılan sözler tırnak içine alınır." *(material
> quoted verbatim from a person or a text is placed in quotation marks.)*
> "Özel olarak vurgulanmak istenen sözler tırnak içine alınır." *(specially emphasized words are
> placed in quotation marks.)*
> "Cümle içerisinde eserlerin ve yazıların adları ile bölüm başlıkları tırnak içine alınır."
> *(within a sentence, titles of works and section headings are placed in quotation marks.)*

- ✅ *O “yapay zekâ” terimini açıkladı.* — curly U+201C … U+201D, the TDK glyphs.
- ❌ *O "yapay zekâ" terimini açıkladı.* — ASCII U+0022 straight quotes standing in for both marks
  (the typographer's-quote-vs-typewriter-quote defect; U+0022 does not occur in TDK's own prose).

**⚠ Guillemets «…» — editorial observation, not a sourced rule.** The fetched TDK punctuation page
**does not address « » at all** (census: zero U+00AB, zero U+00BB), so TDK neither prescribes nor
proscribes them. The observation that guillemets read as literary/older in Turkish is **⚠ editorial**
and is *not* attributable to TDK. What **is** sourced is the positive rule above: the mark TDK names
and prints for quoting is the curly double quote. Prefer it; treat a guillemet in digital body copy
as a house-style deviation to query, not as a TDK violation.

**The apostrophe (kesme işareti) — high-frequency in UI (TDK — STRONG).** The glyph is **’ (U+2019)**,
per TDK's own header `Kesme İşareti ( ’ )` — **not** the ASCII typewriter apostrophe `'` (U+0027),
which does not occur in the page's prose. Two **separate numbered rules** are in play, and conflating
them is the usual source of error.

**Rule 1 — özel adlar (proper nouns) only.** Verbatim:
> "Özel adlara getirilen iyelik, durum ve bildirme ekleri kesme işaretiyle ayrılır." *(possessive,
> case, and copular suffixes added to proper names are separated with an apostrophe.)*

This covers **proper nouns**: *Türkiye’de*, *Atatürk’üm*, *Yunus Emre’yi*. It does **not** by itself
license the acronym case.

**Rule 3 — kısaltmalar (abbreviations/acronyms), a distinct rule.** Verbatim:
> "Kısaltmalara getirilen ekleri ayırmak için konur: TBMM’nin, TDK’nin, BM’de, ABD’de, TV’ye vb."
> *(placed to separate suffixes added to abbreviations.)*

So *TDK’nin* and *API’yi* are correct — but they are correct **under rule 3**, not rule 1. (TDK’s own
example list for rule 3 literally contains *TDK’nin*.)

- ✅ **Türkiye’de** (rule 1, proper noun) · **TDK’nin**, **API’yi** (rule 3, abbreviation).
- ❌ **Türkiyede** / **TDKnin** / **APIyi** — suffix glued on with no apostrophe.

**⚠⚠ THE UYARI THE RULE DOES *NOT* COVER — spelled-out institution names take NO apostrophe.** This
is the highest-frequency practical trap, because it looks like rule 1 but is explicitly excluded.
Verbatim from TDK, immediately adjacent to the rules above:
> "UYARI: Kurum, kuruluş, kurul, birleşim, oturum ve iş yeri adlarına gelen ekler kesmeyle ayrılmaz:
> Türkiye Büyük Millet Meclisine, Türk Dil Kurumundan, Türkiye Petrolleri Anonim Ortaklığına, Türk
> Dili ve Edebiyatı Bölümü Başkanlığının; Bakanlar Kurulunun, Danışma Kurulundan, Yürütme Kuruluna
> …" *(suffixes on the names of institutions, organizations, boards, sittings, sessions, and business
> premises are NOT separated with an apostrophe.)*

The decisive contrast — the **same institution**, abbreviated vs spelled out:

- ✅ **TDK’nin** / **TDK’den** — the **abbreviation** takes the apostrophe (rule 3).
- ✅ **Türk Dil Kurumundan** — the **spelled-out institution name** takes **no** apostrophe (UYARI).
- ❌ **Türk Dil Kurumu’ndan** — apostrophe wrongly applied to a spelled-out institution name. This is
  the exact error a translator produces by over-reading rule 1, and it is TDK-incorrect.
- ❌ **Türkiye Büyük Millet Meclisi’ne** → correct is **Türkiye Büyük Millet Meclisine**.

Two further TDK **UYARI**s that bite in UI copy, verbatim:
> "UYARI: Özel adlara getirilen yapım ekleri, çokluk eki ve bunlardan sonra gelen diğer ekler
> kesmeyle ayrılmaz: Türklük, Türkleşmek, Türkçü, Türkçülük, Türkçe, Müslümanlık … Avrupalı …"
> *(derivational suffixes and the plural suffix on proper names are NOT split off.)*
> "UYARI: Tırnak içine alınan sözlerden sonra gelen ekleri ayırmak için kesme işareti kullanılmaz:
> Elif Şafak’ın “Bit Palas”ını okudunuz mu?" *(no apostrophe before a suffix following a
> quoted phrase.)*

So: ✅ **Türkçenin**, **Avrupalılaşmak** — ❌ **Türkçe’nin**, **Avrupalı’laşmak**.

Because the suffix itself is chosen by vowel harmony *and* the last sound of the (foreign) name, a
brand/acronym in a template cannot take a hard-coded suffix — see §4 (agglutination, vowel harmony)
and §10.

**Whitespace, tokenization & line breaking.** Turkish is written **left-to-right, space-delimited**,
so **ordinary whitespace tokenization and word-boundary highlighting work**. Because Turkish is
agglutinative, single "words" get very long (suffix chains), so end-of-line hyphenation follows
syllable rules; UI should **allow soft wrapping and avoid hard-coded line breaks** inside words.
**⚠ editorial** (agglutination is sourced in §4; the soft-wrap recommendation is engineering
guidance).

**Fonts.** Any shipped font **must carry the full Turkish set** — dotted **İ**, dotless **ı**, and
**ç ş ğ ö ü** in both cases — and the app **must set `lang="tr"`** on the HTML root so the browser
applies Turkish casing and hyphenation. **Noto Sans** is a safe open default with full coverage.
**⚠ editorial** (the `lang="tr"` recommendation is engineering guidance; font coverage is a
verifiable property of the chosen font).

Sources: <https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/> ·
<https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/> ·
<https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/> ·
<https://fonts.google.com/noto/specimen/Noto+Sans> (Unicode SpecialCasing mapping ⚠ not re-fetched
— verify against Unicode SpecialCasing.txt; the **.NET `ToUpper()` example is the sourced one**,
while the per-platform JS/Java/.NET API table, the casing rule, and the soft-wrap/`lang`
recommendations are ⚠ editorial engineering guidance). The **quote/apostrophe glyphs, the `Tırnak İşareti ( “ ” )` and
`Kesme İşareti ( ’ )` headers, the kesme rules 1 and 3, and all four UYARI blocks** were re-fetched
from the TDK punctuation page and confirmed by a **codepoint census of the page's text content**
(U+0022 = 0, U+00AB/U+00BB = 0, U+201C = 22, U+201D = 22, U+2019 = 111, U+2018 = 3). The
guillemet-register remark is **⚠ editorial — TDK does not address « »**. *Quoting note:* TDK's page
carries **25 soft hyphens (U+00AD)** inserted for justification (e.g. `tır­nak`, `kulla­nılmaz`);
the quotes above reproduce the words **with U+00AD removed**, which is the only normalization
applied — they are otherwise byte-identical to the fetched page.

---

## 10. Technical integration checklist

- **⚠⚠ Locale-aware casing is the #1 engineering rule (see §3).** Turkish needs **two casing
  modes**: use the **Turkish locale** (`toLocaleUpperCase('tr')` / `toLocaleLowerCase('tr')`) for
  **UI display text** so `i → İ` and `ı → I`; use the **locale-independent** call for **identifiers,
  protocol strings, header names, file extensions, slugs, tokens, hostnames, and any case-insensitive
  comparison or security check** — in JS that is bare **`toUpperCase()` / `toLowerCase()`** (they take
  no locale argument and are already invariant), in .NET **`ToUpperInvariant()`**, in Java
  **`toUpperCase(Locale.ROOT)`** (§3 table). Mixing them corrupts text or silently returns the wrong
  comparison result. Verify the code-point mapping against **Unicode SpecialCasing.txt** before
  shipping casing code (⚠ mapping not re-fetched here; the per-platform API rows are ⚠ editorial).
- **`lang` / `dir` attributes.** Set **`lang="tr"`** (base) / **`lang="tr-easy"`** (simplified
  variant, subject to the §Header token note) and **`dir="ltr"`** throughout. Correct `lang` per
  variant and per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**; `lang="tr"` also
  lets the browser apply Turkish casing and hyphenation.
- **Fonts to ship.** A font with **full Latin-Turkish coverage** — dotted **İ**, dotless **ı**, and
  **ç ş ğ ö ü** in both cases. **Noto Sans** is a safe open default; test that the dotted-capital-İ
  and dotless-lowercase-ı render distinctly before relying on any build.
- **Quote & apostrophe glyphs.** Ship **curly** marks, not ASCII: **“ ” (U+201C/U+201D)** for
  tırnak işareti and **’ (U+2019)** for kesme işareti (§3 — TDK's own headers; U+0022 does not occur
  in TDK's prose). Make sure the CMS/editor's smart-quote substitution is on for `tr`, and that no
  build step "normalizes" curly marks back to ASCII `"`/`'`.
- **Apostrophe / suffix splitting — and the institution-name exception.** Suffixes on **proper
  nouns** (rule 1) and on **abbreviations** (rule 3) are split with **’**: *Türkiye’de*, *TDK’nin*,
  *API’yi*. **But suffixes on a spelled-out institution/organization name are NOT split** (TDK
  UYARI): *Türk Dil Kurumundan*, **not** *Türk Dil Kurumu’ndan*; *Türkiye Büyük Millet Meclisine*,
  not *…Meclisi’ne*. Derivational/plural suffixes on proper names are likewise unsplit
  (*Türkçenin*, not *Türkçe’nin*). Because the suffix is chosen by **vowel harmony** and the
  final sound of the (foreign) host, **never hard-code a suffix onto an interpolated name** in a
  template — compute it or avoid inflecting the injected value.
- **No string-concatenated morphology.** Agglutination + vowel harmony (§4) mean an inflected word
  cannot be spliced from `{{root}} + "<fixed suffix>"`; the root, harmony vowel, and case suffix
  interact. Translate whole phrases, not word-fragments.
- **Tokenization / highlighting.** Whitespace word separation works — standard word tokenizers and
  word-boundary highlighting apply. **Allow soft wrapping** and do **not** hard-code line breaks
  inside long suffix-chained words (§3, ⚠ editorial).
- **Index alphabet for glossary navigation.** Use **Turkish alphabetical order**, not the A–Z Latin
  order: **a b c ç d e f g ğ h ı i j k l m n o ö p r s ş t u ü v y z** (ç after c, ğ after g, **ı
  before i**, ö after o, ş after s, ü after u; **no q w x**). Drive collation from **CLDR `tr`
  collation data** rather than a hard-coded list where possible — the ı/i ordering is the exact place
  a default (English) collator gets Turkish wrong.
- **Digits & separators (§5).** Display numbers with **comma decimal / dot grouping** (`1.234,5`),
  day-first dot-separated dates (`25.07.2026`), and the ₺/`TL` symbol **after** the amount (verify
  the formatter). Keep Western digits and ISO-8601 (`YYYY-MM-DD`) in backends/identifiers/code.

Sources: <https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/> ·
<https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/> ·
<https://fonts.google.com/noto/specimen/Noto+Sans> ·
CLDR 48.2 `tr` (§5) (Unicode SpecialCasing mapping and the soft-wrap/`lang` items are ⚠ editorial
engineering guidance)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **⚠⚠ Locale-aware casing check.** Any casing call on **UI display text** must use the **Turkish
  locale**; any casing on **identifiers / comparisons / security-sensitive strings** must be
  **locale-independent**. Flag the calls that silently pick up the **ambient** locale: JS
  **`toLocaleUpperCase()` / `toLocaleLowerCase()` called with no locale argument**, .NET
  **`ToUpper()` / `ToLower()`** with no `CultureInfo`, Java **`toUpperCase()` / `toLowerCase()`**
  with no `Locale`. **Do *not* flag bare JS `toUpperCase()` / `toLowerCase()`** — in ECMAScript those
  are locale-independent and are the *correct* call for identifiers; a lint that flags them chases
  the wrong string and misses the real one (§3, §10). Spot-check that *"index"*/*"INDEX"* comparisons
  still hold under `tr-TR` and that *"iptal"→"İPTAL"* / *"ışık"→"IŞIK"* render correctly in display.
- **Script ratio.** The large majority of letters in `tr` content are **Latin with the Turkish
  set** (ç ğ ı i İ ö ş ü). A block of un-accented ASCII where Turkish letters are expected signals
  ASCII-flattening (e.g. *gelecegi* for *geleceği*, *isik* for *ışık*) — flag it.
- **Dotted/dotless-i integrity.** Flag suspected mojibake or ASCII-flattening of **ı/i/İ/I** —
  e.g. a bare `I` where `İ` was meant, or `i` where `ı` was meant. This is both a rendering defect
  and a casing defect.
- **Forbidden / suspicious characters.** **q, w, x** are **not** in the native Turkish alphabet;
  a bare q/w/x inside an otherwise-Turkish word signals an untranslated leak or a wrong character —
  *but allow them in foreign proper names, acronyms, URLs, and code* (e.g. *WhatsApp*, *max*, an
  API path).
- **Quote/apostrophe codepoint check (deterministic — verifiable by census).** In `tr` body copy the
  quotation marks must be **U+201C / U+201D** and the apostrophe **U+2019**. Flag any **U+0022**
  (ASCII `"`) or **U+0027** (ASCII `'`) in prose — TDK's punctuation page contains **zero U+0022** in
  its text, so an ASCII straight quote is a typographic defect, not a variant. Also flag stray
  **U+0060** (backtick) or **U+00B4** (acute) used as an apostrophe. *Scope the check to prose* —
  code blocks, JSON/string literals, URLs, and identifiers legitimately use ASCII quotes.
  Guillemets **«…» (U+00AB/U+00BB)** are **not** addressed by TDK (⚠ editorial, §3): flag them as a
  house-style deviation to review, **not** as a sourced TDK error.
- **Number & date formatting.** Decimal separator is **comma**, grouping is **dot** (`1.234,5`);
  dates are **day-first, dot-separated** (`25.07.2026`) — flag English `1,234.5` or `MM/DD/YYYY`.
- **Apostrophe / suffix splitting — both directions.** (a) Flag a **missing** apostrophe on a proper
  noun or an abbreviation: *Türkiye’de* not *Türkiyede*; *TDK’nin* not *TDKnin*. (b) Flag an
  **over-applied** apostrophe, which is the more common defect in machine-assisted output: a
  spelled-out **institution/organization name** must have **no** apostrophe before its suffix
  (*Türk Dil Kurumundan*, not *Türk Dil Kurumu’ndan*; *…Meclisine*, not *…Meclisi’ne*), and neither
  do derivational/plural suffixes on proper names (*Türkçenin*, not *Türkçe’nin*; *Avrupalılaşmak*,
  not *Avrupalı’laşmak*). Heuristic: an apostrophe directly after a multi-word capitalized name whose
  last word is an institution word (*Kurumu, Meclisi, Bakanlığı, Başkanlığı, Kurulu, Ortaklığı,
  Müdürlüğü*) is almost certainly wrong (§3 UYARI).
- **Question-particle presence.** Standard-Turkish yes/no questions carry the **`-mI` particle**
  (*Geliyor mu?*); flag a question mark with no particle and no other question word (a Cyprus-dialect
  marker / EN-word-order calque, §4, §9).
- **Register consistency (siz).** With **`siz`** recorded (§4), scan second-person copy for stray
  **`sen`** imperatives/possessives and for **mixed** forms within one flow (e.g. `siz` possessive
  `-ınız` + `sen` imperative `yap`) — a mismatch is both a social error and an inconsistency defect.
  (If the project was flipped to `sen`, invert the scan.)
- **Source-language leak scan (EN/DE → TR).** Left-in English function words (the, and, you,
  please), German umlauts/ß, or verb-*non*-final SVO word order (marked/*devrik*) surfacing where
  neutral verb-final order is wanted.

Sources: <https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/> ·
<https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/> ·
<https://tr.wikipedia.org/wiki/K%C4%B1br%C4%B1s_T%C3%BCrk%C3%A7esi> · CLDR 48.2 `tr` (§5)

---

*Provenance note:* this guide is built solely from an external desk-research **dossier** that was
self-fetched with a verbatim quote per claim, then independently reviewed against the cited
sources. The **STRONG** tiers carry those verbatim quotes — TDK
Yazım Kılavuzu (casing, capitalization, punctuation, apostrophe), CLDR 48.2 (numbers, dates,
currency), and TDK GTS + TÜBİTAK Ansiklopedi (terminology). The **community/editorial** material is
marked at point of use: the §4 grammar-trap example pairs (features 1–2 wiki-attested suffixal
morphology + editorial examples, features 3–4 standard-linguistics editorial, only the `-mI`
particle verbatim-quoted), the §6 [community] term rows (7–15),
the §9 İstanbul-Türkçesi neutrality claim (search summary), the §8 word-pairs (only *yanıt/cevap*
TDK-sourced), and the §2 "most-used digital style guide" claim (admitted unsourced). Every
**⚠** marker indicates a claim the dossier itself could not source, or engineering guidance drawn
from a sourced fact.

*Correction pass (punctuation, 2026-07-26).* The TDK punctuation page was re-fetched and its **text
content censused by codepoint**, which corrected three claims in the previous revision: (1) the
guide had asserted Turkish uses "the same glyphs as English" and printed ASCII `"` (U+0022) in its
quote examples — the census found **zero U+0022** in TDK's prose, and TDK headers its rules
`Tırnak İşareti ( “ ” )` (U+201C/U+201D) and `Kesme İşareti ( ’ )` (U+2019), so §3/§10/§11 now
specify those code points; (2) the "guillemets are literary/older" claim was presented as sourced —
the page contains **zero U+00AB/U+00BB** and TDK does not address « » at all, so the remark is now
marked **⚠ editorial** and the §11 check downgraded from "TDK violation" to "house-style deviation";
(3) the apostrophe rule was over-extended — TDK rule 1 covers **özel adlar** only, acronyms fall
under the separate **rule 3 (kısaltmalar)**, and TDK's adjacent **UYARI** (institution names spelled
out take **no** apostrophe — *Türk Dil Kurumundan*, not *Türk Dil Kurumu’ndan*) was missing
entirely and is now quoted verbatim with an explicit ✅/❌ pair in §3, §10, and §11. The **register decision is `siz` (taken and recorded, provisional default) —
a genuine, flippable fork to `sen`, community-sourced not a TDK rule.** A second-model and
native-speaker review against the §2 sources is still outstanding (see Status in the header).

*Correction pass (casing API + second-dossier merge, 2026-07-27).* Four things changed. (1) **The
casing paragraph in §3 stated the opposite of how JavaScript behaves.** The dossier's example is a
**.NET** one — `ToUpper()` is culture-sensitive by default — and the previous revision transposed
that onto `"interesting".toUpperCase()`, which in ECMAScript is **locale-independent** and returns
`"INTERESTING"` on a Turkish host too. It then prescribed `toUpperCase('en-US')`, an **invalid
signature** whose argument is silently ignored, and the §11 lint flagged bare `toUpperCase()` — the
*correct* invariant call — while missing the real JS bug surface, `toLocaleUpperCase()` called with
no locale argument. §3 now carries the sourced .NET example plus a per-platform table (JS / .NET /
Java, ⚠ editorial), §10 names the locale-independent call per platform, and §11 flags the ambient-locale
calls and explicitly exempts bare `toUpperCase()`. (2) The header's claim that the research supplied
**no speaker count** was false — a second research dossier opened with a cited ~85 M figure and the
official-status scope (Türkiye and Cypriot Turkish / Northern Cyprus contexts), both now carried;
the earlier "(alongside Greek) of Cyprus" claim, which was not in either dossier, is gone.
(3) **§5 had no time format at all**, which the template requires; TDK's written form `17.30`
(`HH.mm`, 24-hour) is merged from that second dossier and marked as its summary rather than a
re-fetch. (4) §7 shipped general proverbs where the authoring brief asks for stock phrases of
educational/technical writing; the on-domain table replaced them, with the second dossier's
non-evidencing citation stated plainly and the six fetch-verified proverbs retained in compressed
form.

*Evidence pass (§7 idiom table, 2026-07-27).* The stock-phrase table arrived with **no per-row
citation**. Every ✅ has now been taken back to a source and carries a tier — TDK's Güncel Türkçe
Sözlük, its Atasözleri ve Deyimler Sözlüğü, its *Bilgisayar Terimleri Karşılıklar Kılavuzu*, and
Turkish technical prose — and the tier decides whether a row may inform a §11 check. The
wrong-calque column stayed the weak half and is labeled **craft**: no source documents any of its
forms as an error Turkish translators actually make. **One row was deleted outright.** The
`user-friendly` row put *kullanıcı dostu* in the ❌ column — but that is **TDK's own prescribed
equivalent** for the English term, in TDK's computing glossary, while the row's ✅
(*kullanımı kolay*) is absent from the same glossary. The row was inverted, so it is gone rather
than flipped. Three more ❌ cells were removed: *bir bakışta doğru olarak* (not a calque — the ✅
with three words appended), *akılda tutmakta kal* (it embeds *akılda tutmak*, itself a TDK deyim, so
the cell condemned a valid idiom), and *üstüne inşa edilmiş* (correct Turkish; the difference from
the ✅ is register, not error). One ❌ was **replaced**: *kutudan dışarıda* has zero corpus
occurrences, while the calque Turkish tech writers actually produce — *kutudan çıktığı gibi* — is
attested, so the row now warns about the live risk instead of shadow-boxing. Two ✅ cells were also
corrected: *genel resim* is unsupported and was dropped, and *parçalara ayırmak* was added ahead of
*bölümlere ayırmak* for the abstract "break down" sense.
