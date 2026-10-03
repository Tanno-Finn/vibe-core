<!-- base -->
# lang-vi — Vietnamese (tiếng Việt) — setup & sources

> **The translation guide itself is [`vi.md`](vi.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

**The finding, stated plainly first: there is no single unambiguous orthographic authority for
Vietnamese, and Vietnamese sources say so themselves.**

> **"Ngoài ra, chính tả tiếng Việt vẫn đang tồn tại các vấn đề tranh luận, chưa nhất quán trong cách
> ghi chép và sử dụng khác nhau trên thực tế."** · **"Chính tả tiếng Việt đang trong quá trình
> nghiên cứu, tập trung chuẩn hóa hệ thống toàn quốc."**
> — <https://vi.wikipedia.org/wiki/Chính_tả_tiếng_Việt> (community tier)

That is a community-tier source describing the state of play, and everything else in this guide
corroborates it: two live tone-placement conventions (§3g), an unresolved i/y question (§3h), and a
1984 instrument whose effect its own describers call limited.

### 2a. The honest hierarchy — normative, advisory, and merely influential

| Body / instrument | Status | What it actually controls |
|---|---|---|
| **Quyết định 240/QĐ** (Ministry of Education, 1984) | **Legally normative** — **"quy phạm pháp luật đầu tiên"** on Vietnamese orthography. ⚠ **Text never fetched** | Orthography, i/y, terminology — with "limited effect" per the English-language description |
| **Nghị định 30/2020/NĐ-CP, Phụ lục II** | **Legally normative for official documents.** ⚠ **Text never fetched** | *viết hoa* — capitalization rules in state documents (§3k) |
| **Viện Ngôn ngữ học** (Institute of Linguistics) | **Advisory only** | Research and dictionaries; it proposes, it does not promulgate |
| **Từ điển tiếng Việt**, ed. **Hoàng Phê**, Viện Ngôn ngữ học | **Influential, not legal** | The de facto lexical reference for academia and publishing |
| **Nhà Xuất bản Giáo dục** (Education Publishing House) | **De facto** | Actual school orthography — kiểu mới (§3g), the Sino-Vietnamese y-dài convention (§3h) |
| General usage and media | — | Retains kiểu cũ and habitual i/y spellings |

**The Institute's mandate is explicitly advisory**, not legislative — it is
**"một viện nghiên cứu khoa học chuyên ngành thuộc Viện Hàn lâm Khoa học xã hội Việt Nam"** whose
job is to supply **"các luận cứ khoa học cho việc hoạch định chính sách ngôn ngữ của Đảng và Nhà
nước"**. Normative instruments have come from the **Ministry of Education**:

> **"Năm 1984, Quyết định của Bộ trưởng Bộ Giáo dục: _Quy định về chính tả tiếng Việt và thuật ngữ
> tiếng Việt_ được ban hành và là quy phạm pháp luật đầu tiên về chính tả tiếng Việt."**
> — <https://vi.wikipedia.org/wiki/Chính_tả_tiếng_Việt>

with joint authorship confirmed from the Institute's side: **"Trung tâm Khoa học xã hội và Nhân văn
Quốc gia đã cùng Bộ Giáo dục xây dựng Quy định về chính tả tiếng Việt"**.

### 2b. ⚠ Neither legal instrument was read — and every rule attributed to one is second-hand

> **Binding consequence.** Everything this guide says about **Quyết định 240** and about
> **Nghị định 30/2020 Phụ lục II** is **secondary reporting**. Do not write, and do not let a brief
> imply, that either text was consulted. Where a rule in §3h or §3k would otherwise rest on them,
> the guide falls back on documented editorial practice and says so in place.

Recorded for method transparency, because two of these are load-bearing gaps:

| Target | Result |
|---|---|
| Two Vietnamese legal-document portals (Nghị định 30/2020) | **HTTP 403** |
| A third legal portal (Quyết định 240) | **HTTP 403** |
| A fourth legal portal | Served an **unrelated document**, login-gated |
| Government file archive, `30.signed.pdf` | Fetched 2.9 MB, but it is a **scanned image** with no extractable text |
| Government document viewer by `docid` | Resolved to an **unrelated decision** |
| Ministry of Education document index | **HTTP 404** |
| National statistics office (two hosts) | **TLS certificate mismatch**, then **ECONNRESET** |
| Ministry of Science and Technology | **ECONNREFUSED** |
| The international standards organization's catalog | **HTTP 403** |
| Constitution text on the Vietnamese source-text wiki | **HTTP 404** on a constructed URL |

**An OCR pass over the scanned government PDF, or one search-engine query, closes the two legal
gaps. That is the single most valuable fix available to this guide.**

### 2c. The dictionary — and a real counterfeit hazard

**Từ điển tiếng Việt**, Viện Ngôn ngữ học, chief editor **Hoàng Phê**, first published 1988 with
**"hơn 36 ngàn mục từ"**, awarded the State Prize for Science and Technology in 2005, is the closest
thing to a reference standard. Hoàng Phê also produced dedicated orthographic dictionaries —
*Từ điển chính tả tiếng Việt* (1985) and *Từ điển chính tả* (1995).

> ⚠ **Name the editor and the edition, never just "the Institute dictionary".** The Vietnamese-language
> encyclopedia warns that many publishers print low-quality dictionaries with inaccurate — sometimes
> seriously erroneous — definitions, **many of which falsely claim affiliation with Viện Ngôn ngữ
> học**. A translator told to "check the Institute dictionary" can easily be reading a counterfeit.

### 2d. Unicode, W3C, and locale data — the Official tier that *was* reachable

- **Unicode character database** — `util.unicode.org/UnicodeJsps/character.jsp?a=<hex>`, fetched
  **one codepoint at a time**. The character names, canonical decompositions, and combining classes
  in the **§3b and §3d tables** are quoted field values from it. ⚠ Codepoints named elsewhere in §3
  — the five tone marks of §3c among them — reach this guide through other sources and were **not**
  fetched from the character database individually.
- **UAX #15** (Unicode Normalization Forms) — the NFC recommendation and the Canonical Ordering
  Algorithm. **Anchor of §3e.**
- **UAX #14** (Line Breaking) — confirmed to contain **no Vietnamese-specific rules** (§3l).
- **W3C Character Model for the World Wide Web: String Matching** (charmod-norm) — the
  normalizing-transcoder definition and the SHOULD on Unicode encoding. Read §3e for what it does
  **not** say.
- **CLDR, locale `vi`** — `numbers.json`, `currencies.json`, `ca-gregorian.json`, `delimiters.json`,
  fetched as raw JSON **pinned to the published data release `48.2.0`** (`cldr-json` packages on the
  npm registry). **The pin is the point:** a published release is immutable, so every value quoted
  in §5 can still be checked against the URL it is quoted from. These links formerly pointed at the
  `cldr-json` `main` branch, which is pre-release development data. Re-read at the pin on
  2026-07-27: **every `vi` value below is unchanged.**

> ⚠ **Method warning that applies to every character in this guide.** The research fetch layer
> renders pages through a summarizing model, **and that model silently ASCII-flattens characters**.
> The first fetch of the `vi` delimiters file reported plain ASCII marks; only a re-fetch demanding
> codepoints returned U+201C, U+201D, U+2018, and U+2019. **Where this guide states a codepoint,
> trust the codepoint over the glyph**, and assume any Vietnamese text that has passed through a
> summarizing layer is corrupt until proven otherwise.

### 2e. ⚠ What no source in this guide can support

There is **no reachable official or academic Vietnamese AI/ML terminology standard** (§6e), **no
located Vietnamese plain-language standard** (§8a), and **no Official-tier Vietnamese government
source of any kind** behind §5 — both statistics-office hosts failed at the network layer. Section 5
rests on CLDR plus corroboration from running Vietnamese text.

Sources: <https://vi.wikipedia.org/wiki/Chính_tả_tiếng_Việt> ·
<https://vi.wikipedia.org/wiki/Viện_Ngôn_ngữ_học_(Việt_Nam)> · <https://vi.wikipedia.org/wiki/Hoàng_Phê> ·
<https://vi.wikipedia.org/wiki/Từ_điển_tiếng_Việt> · <https://en.wikipedia.org/wiki/Vietnamese_alphabet> ·
<https://www.unicode.org/reports/tr15/> · <https://www.w3.org/TR/charmod-norm/> ·
<https://www.unicode.org/reports/tr14/> · <https://util.unicode.org/UnicodeJsps/character.jsp?a=0111> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/vi/delimiters.json>

---

## 3. Script & typography

*Housekeeping convention for this document: verbatim Vietnamese citations are set in **bold**
without added quotation marks, so that any quotation character you see inside a citation is one the
source itself served.*

**This is the guide's center of gravity.** Vietnamese renders in any Latin pipeline without
complaint, which means an encoding defect ships instead of failing loudly. Read §3b through §3g in
order; they are one argument, not five topics.

### 3a. The alphabet — 29 letters, and four that are not in it

> **"bảng chữ cái La-tinh cho tiếng Việt hiện tại có 29 chữ cái"**
> — <https://vi.wikipedia.org/wiki/Chữ_Quốc_ngữ>

In order: **A, Ă, Â, B, C, D, Đ, E, Ê, G, H, I, K, L, M, N, O, Ô, Ơ, P, Q, R, S, T, U, Ư, V, X, Y.**

Note what is **absent — F, J, W, Z**:

> **"Bốn chữ cái F, J, W, Z vốn có trong bảng chữ cái tiếng Pháp, tiếng Anh hiện không được coi là
> chính thức trong tiếng Việt."** — <https://vi.wikipedia.org/wiki/Bảng_chữ_cái_tiếng_Việt>

They nevertheless appear constantly in AI/ML copy (`JSON`, `WiFi`, `F1`, `Z-score`) because such
tokens are kept in Latin form. That is not a violation — they are simply not *Vietnamese alphabet*
letters, and they must not drive a font or collation decision (§10).

### 3b. 🔑 The seven modified letters — and why **đ** is the diagnostic one

> **"Có 7 chữ cái biến thể bằng cách thêm dấu là Ă-Â-Đ-Ê-Ô-Ơ-Ư."**
> — <https://vi.wikipedia.org/wiki/Chữ_Quốc_ngữ>

Every row below was fetched individually from the Unicode character database; the name and the
decomposition are quoted field values.

| Letter | Codepoint | Unicode name | Canonical decomposition |
|---|---|---|---|
| **ă** | **U+0103** | `LATIN SMALL LETTER A WITH BREVE` | U+0061 U+0306 |
| **â** | **U+00E2** | `LATIN SMALL LETTER A WITH CIRCUMFLEX` | U+0061 U+0302 |
| **đ** | **U+0111** | `LATIN SMALL LETTER D WITH STROKE` | **none** — `Decomposition_Type: [None]` |
| **ê** | **U+00EA** | `LATIN SMALL LETTER E WITH CIRCUMFLEX` | U+0065 U+0302 |
| **ô** | **U+00F4** | `LATIN SMALL LETTER O WITH CIRCUMFLEX` | U+006F U+0302 |
| **ơ** | **U+01A1** | `LATIN SMALL LETTER O WITH HORN` | U+006F U+031B |
| **ư** | **U+01B0** | `LATIN SMALL LETTER U WITH HORN` | U+0075 U+031B |

> **🔑 `đ` U+0111 is the odd one out, and that makes it a useful diagnostic.** The
> stroke is **not a combining mark**, so U+0111 has no canonical decomposition and is **byte-identical
> in NFC and in NFD**. Any pipeline that "fixes" Vietnamese by stripping combining marks will
> therefore destroy **ă â ê ô ơ ư** and **leave đ standing**.
>
> **Read a corrupted file this way:** if the six other modified letters are mangled or flattened but
> every **đ** survives intact, you are looking at a **normalization or mark-stripping bug**, not at a
> legacy-encoding problem. If **đ** is damaged *too*, the byte stream itself is wrong (§3f).

**Uppercase forms:** Ă U+0102, Â U+00C2, Đ U+0110, Ê U+00CA, Ô U+00D4, Ơ U+01A0, Ư U+01AF.
⚠ **unverified** — these seven were **not** fetched individually; they follow the standard case
pairing, but confirm each at `util.unicode.org/UnicodeJsps/character.jsp?a=0102` and so on before
printing them as fact anywhere else.

**Which Unicode blocks hold Vietnamese:** precomposed forms are **"scattered throughout the Latin-1
Supplement, Latin Extended-A, Latin Extended-B, and Latin Extended Additional blocks."** The
Latin Extended Additional block (U+1E00–U+1EFF) carries the bulk — **"Ninety of the characters are
used in the Vietnamese alphabet."** — with the Vietnamese run at **U+1EA0 through U+1EF9**.
**Font coverage of "Latin Extended-A" alone is not enough** (§3m).

### 3c. The tone marks — five marks, six tones

> **"chữ quốc ngữ dùng năm ký hiệu gọi là 'dấu thanh' hoặc 'dấu', để biểu thị thanh điệu"**
> — <https://vi.wikipedia.org/wiki/Chữ_Quốc_ngữ>

The tones: **Ngang** (unmarked), **Huyền**, **Sắc**, **Hỏi**, **Ngã**, **Nặng**. The combining
codepoints are pinned by the Windows-1258 code page, which encodes tone marks *as* combining
characters and lists exactly:

> "U+0300 (grave accent), U+0309 (hook above), U+0323 (dot below), U+0301 (acute accent),
> U+0303 (tilde)" — <https://en.wikipedia.org/wiki/Windows-1258>

| Tone name | Combining codepoint |
|---|---|
| dấu huyền | **U+0300** `COMBINING GRAVE ACCENT` |
| dấu hỏi | **U+0309** `COMBINING HOOK ABOVE` |
| dấu nặng | **U+0323** `COMBINING DOT BELOW` |
| dấu sắc | **U+0301** `COMBINING ACUTE ACCENT` |
| dấu ngã | **U+0303** `COMBINING TILDE` |

> **🔴 Two codepoints must never appear in new content.**
> **"Early versions of Unicode encoded _dấu huyền_ and _dấu sắc_ as U+0340 ◌̀ COMBINING GRAVE TONE
> MARK and U+0341 ◌́ COMBINING ACUTE TONE MARK, respectively. In 2001, these two characters were
> deprecated as duplicate encodings of U+0300 ◌̀ COMBINING GRAVE ACCENT and U+0301 ◌́ COMBINING
> ACUTE ACCENT."** — <https://en.wikipedia.org/wiki/Vietnamese_language_and_computers>
>
> **U+0340 or U+0341 in a file means the content came out of a pre-2001 pipeline.** Add both to the
> forbidden-character list (§11).

### 3d. 🔑 Stacked diacritics — and the ordering that contradicts what you see

A Vietnamese vowel can carry **a quality diacritic and a tone mark at once**. These decompositions
are quoted field values from the Unicode character database:

| Char | Codepoint | Unicode name | One-step decomposition | Full NFD |
|---|---|---|---|---|
| **ế** | **U+1EBF** | `LATIN SMALL LETTER E WITH CIRCUMFLEX AND ACUTE` | U+00EA U+0301 | U+0065 U+0302 U+0301 |
| **ệ** | **U+1EC7** | `LATIN SMALL LETTER E WITH CIRCUMFLEX AND DOT BELOW` | **U+1EB9 U+0302** | **U+0065 U+0323 U+0302** |
| **ữ** | **U+1EEF** | `LATIN SMALL LETTER U WITH HORN AND TILDE` | U+01B0 U+0303 | U+0075 U+031B U+0303 |
| **ẹ** | **U+1EB9** | `LATIN SMALL LETTER E WITH DOT BELOW` | U+0065 U+0323 | U+0065 U+0323 |

> **Look at ệ U+1EC7 and do not trust your eyes.** Its canonical decomposition puts the **dot below
> first and the circumflex second** — even though visually the circumflex sits *inside*, against the
> letter, and the dot hangs *outside*, below it. Visual nesting is not encoding order.

That is the Canonical Ordering Algorithm at work. UAX #15:

> **"any sequences of combining marks that it contains are put into a well-defined order. This
> rearrangement of combining marks is done according to a subpart of the Unicode Normalization
> Algorithm known as the Canonical Ordering Algorithm. That algorithm sorts sequences of combining
> marks based on the value of their Canonical_Combining_Class (ccc) property."**
> — <https://www.unicode.org/reports/tr15/>

The three classes involved, as **symbolic names**, which is what the character-database page printed:

| Combining mark | Canonical_Combining_Class (quoted) |
|---|---|
| **U+0323** `COMBINING DOT BELOW` | **"Below"** |
| **U+0302** `COMBINING CIRCUMFLEX ACCENT` | **"Above"** |
| **U+031B** `COMBINING HORN` | **"Attached_Above_Right"** |

> ⚠ **The numeric ccc aliases were never fetched and are deliberately not printed here.** The page
> that was read gives symbolic names only. The **ordering consequence** — below-marks sort before
> above-marks, horn sorts before both — is directly attested by the decompositions in the table
> above and needs no number. **If you need the numbers, look them up; do not copy them out of a
> guide, and do not let one appear here without a fetched source.**

**The practical consequence for code.** In NFD a two-mark Vietnamese vowel is a **three-codepoint
sequence**; in NFC it is **one**. Naive code that takes `s[0]` of `ệ`, or slices "the first two
characters", gets a bare `e` and an orphaned mark. Both forms are valid Unicode and compare equal
under canonical equivalence — **but not under `===`, `==`, `strcmp`, a JSON key lookup, a filename
match, or CSS `content` matching.**

### 3e. 🔴 NFC is the target form — with the qualification stated honestly

**The recommendation, from UAX #15 summarizing the W3C position:**

> **"The W3C Character Model for the World Wide Web 1.0: Normalization and other W3C Specifications
> (such as XML 1.0 5th Edition) recommend using Normalization Form C for all content, because this
> form avoids potential interoperability problems arising from the use of canonically equivalent,
> yet different, character sequences in document formats on the Web."**
> — <https://www.unicode.org/reports/tr15/>

**W3C charmod-norm supplies the encoding SHOULD and the conversion path:**

> **"Content authors _SHOULD_ enter and store resources in a Unicode character encoding (generally
> UTF-8 on the Web)."** · **"For example, the W3C Validator warns when an HTML document is not fully
> in Unicode Normalization Form C."** · **"A normalizing transcoder is a transcoder that performs a
> conversion from a legacy character encoding to Unicode _and_ ensures that the result is in Unicode
> Normalization Form C (NFC)."** — <https://www.w3.org/TR/charmod-norm/>

> ⚠ **Honest qualification — do not overstate this.** charmod-norm does **not** contain a blunt
> sentence saying all web content MUST be NFC. The normative force comes from UAX #15's summary of
> the W3C position, plus charmod-norm's SHOULD on Unicode encoding and its NFC-producing transcoder
> definition. **State it as "NFC is the recommended interchange form", never as a MUST.**

**Both forms genuinely circulate**, and the historical reason is a font bug:

> **"Because in the past some fonts implemented combining characters in a nonstandard way (see
> Verdana font), most people use precomposed characters when composing Vietnamese-language documents
> (except on Windows where Windows-1258 used combining characters)."**
> — <https://en.wikipedia.org/wiki/Vietnamese_alphabet>

**What breaks in the wrong form, concretely, on a platform like this one:**

- **NFD in JSON translation keys** → lookups miss. An NFC key does not match an NFD query string.
- **NFD in string comparison** → `===` fails between two visually identical strings.
- **NFD in `text-transform: uppercase`, `::first-letter`, or truncation by character count** → marks
  orphan onto the wrong glyph or get cut off.
- **NFD in search and filter** → the user types NFC from a modern input method, the corpus is NFD,
  zero results.
- **Mixed NFC and NFD inside one file** → duplicate-looking glossary entries, and diffs that show
  changes nobody can see.

> **🔴 Rule: normalize every Vietnamese string to NFC on ingest, assert it in CI, and never
> normalize at render time only.** Render-time normalization hides the defect from reviewers while
> leaving every stored key wrong. ⚠ One well-known additional NFD source — filesystem behavior on
> one desktop operating system — is **deliberately not asserted here**: no source for it was
> fetched.

**One place NFD is harmless:** line breaking. UAX #14 — **"Combining character sequences are treated
as units for the purpose of line breaking. The line breaking behavior of the sequence is that of the
base character."** A decomposed vowel will not be split from its marks at a line end (§3l).

### 3f. Legacy encodings — how to recognize what you have been handed

> **"The most commonly used of them were VISCII, VSCII (TCVN 5712:1993), VNI, VPS and Windows-1258."**
> — <https://en.wikipedia.org/wiki/Vietnamese_language_and_computers>

They persist because the desktop-publishing font ecosystem locked them in: **"Many Vietnamese fonts
intended for desktop publishing are encoded in VNI or TCVN3 (VSCII). Such fonts are known as 'ABC
fonts'."** Any material coming from a Vietnamese print or DTP workflow, a 1990s–2000s government
office document, or a diaspora archive is a live candidate for legacy bytes.

**Windows-1258 — the live NFD generator, and the dangerous one.** The code page "makes use of
combining diacritical marks" and **"may not always round-trip Unicode encoded Vietnamese due to
changes caused by Unicode normalization"**. Text converted from it can look **completely correct**
and still be **decomposed**. It survives visual review and fails string comparison — this is the
one **sourced** route by which a `vi` corpus ends up silently NFD (§3e). ⚠ It is not established to
be the only one, or the commonest: no ranking of NFD sources was fetched, and at least one other
well-known source is deliberately left unasserted in §3e.

**TCVN3 / VSCII (TCVN 5712:1993)** — an Official Vietnamese national standard, "also known by the
aliases VSCII, ISO-IR-180, .VN, and ABC", in three variants: VSCII-3 (ASCII intact plus 75
Vietnamese characters), VSCII-2 (a superset adding 16 accented uppercase letters, 5 combining
diacritics, ISO 2022-compatible), VSCII-1 (replaces 12 control characters, breaking ISO 2022). Its
single most recognizable trait:

> **"Tone marks on uppercase vowels is accomplished in TCVN3 by switching to an all-capital font."**
> — <https://en.wikipedia.org/wiki/Vietnamese_Standard_Code_for_Information_Interchange>

**TCVN3 has no room for accented capitals — they live in a *separate font*.** That is why TCVN3
documents arrive as font pairs, and why headings break independently of body text.

**VISCII** — **"VISCII (viết tắt của tiếng Anh Vietnamese Standard Code for Information Interchange,
tức là 'Mã chuẩn tiếng Việt để trao đổi thông tin')"**, proposed by the Viet-Std group in 1992 and
documented in **RFC 1456**. It is an 8-bit set that **replaces some C0 control characters** to fit
Vietnamese into 256 bytes — origin diaspora/standards-community, which is why it surfaces in older
overseas Vietnamese material.

**VNI** is two different things, and conflating them wastes a day. As an encoding it is a
company-owned code page — **"Bảng mã do công ty VNI (Vietnam-International) sở hữu bản quyền"**. As
an input convention it is **"một trong số các quy ước nhập tiếng Việt từ bàn phím quốc tế vào văn
bản trên máy tính theo kiểu nhập số sau chữ cái"**, where **"phần mềm tự động chuyển các số từ quy
ước này sang chữ cái đặc biệt hay dấu thanh tương ứng"**. The keys: **1** sắc, **2** huyền,
**3** hỏi, **4** ngã, **5** nặng, **0** remove; **a8** ă, **a6** â, **d9** đ, **e6** ê, **o6** ô,
**o7** ơ, **u7** ư.

> ⚠ **The recognition heuristics below are craft inference, not a sourced reference.** No
> mojibake-signature reference was fetchable. They follow from the sourced facts above and are
> offered as hypotheses to test, never as rules to cite.
>
> - **TCVN3 misread:** lowercase turns to soup **while capitals look almost fine but have lost all
>   their accents** — because the accented capitals were never in the byte stream, they were in the
>   other font. That asymmetry is the tell.
> - **VISCII or VSCII-1 misread:** because they overwrite **control characters**, the damage reaches
>   into the control range, so the text tends to **break parsers** rather than merely look ugly.
> - **Windows-1258 converted:** the text looks **right** and is **decomposed**. Check with a
>   normalization assertion, not with your eyes.
> - **VNI input leakage:** stray digits sitting after vowels are **un-converted input**, not an
>   encoding fault at all — a different bug with a different fix.

> **🔴 Instruction for translators: never hand-repair legacy-damaged source or reference material.
> Re-request it as UTF-8 in NFC.** Hand repair reintroduces the exact ambiguities §3b and §3d exist
> to prevent.

### 3g. 🔴 kiểu cũ vs kiểu mới — a live contest, and no normalizer will save you

**This is genuinely contested and this guide reports the contest rather than settling it.**

> **"Hiện nay có 2 quan điểm về cách đặt dấu thanh thường được gọi là 'kiểu cũ' và 'kiểu mới'."** ·
> **"'hòa' là một cách đặt dấu thanh khác cho 'hoà', trong đó, 'hòa' còn gọi là cách đặt dấu thanh
> 'cũ'."** · **"Quy tắc 'kiểu cũ' có phần căn cứ trên nhãn quan, giữ vị trí dấu ở giữa hay gần
> giữa"** — <https://vi.wikipedia.org/wiki/Quy_tắc_đặt_dấu_thanh_trong_chữ_quốc_ngữ>

**kiểu cũ is aesthetic** — keep the mark visually centered over the vowel cluster. **kiểu mới is
phonological** — put the mark on the nucleus vowel. The contrast sets, verbatim from the source's
comparison table:

| kiểu cũ | kiểu mới |
|---|---|
| **òa, óa, ỏa, õa, ọa** | **oà, oá, oả, oã, oạ** |
| **òe, óe, ỏe, õe, ọe** | **oè, oé, oẻ, oẽ, oẹ** |
| **ùy, úy, ủy, ũy, ụy** | **uỳ, uý, uỷ, uỹ, uỵ** |

Worked kiểu mới examples given by the source: **hoà, hoè, quỳ, quà, quờ, thuỷ, nguỵ, hoàn, quét**.
Words where **both styles agree** (single nucleus, or a closed syllable): **yếu, uốn, ườn, tiến,
chuyến, muốn, mượn** · **nghĩa, tủa, cứa, thùa, khứa**.

**Who does what.** **"Đến năm 2022, các sách giáo khoa ở Việt Nam đặt dấu thanh theo 'kiểu mới'
(_Hoá học_ thay vì _Hóa học_)."** The English-language description of the same split adds that "the
new style is usually used in textbooks published by Nhà Xuất bản Giáo dục, while most people still
prefer the old style in casual uses." And on what school orthography teaches: **"_Quy tắc dấu thanh
phổ thông:_ tính đến năm 2020, quy tắc dấu thanh chính tả được giảng dạy phổ thông đó là dấu thanh
được đặt trên chữ cái âm chính"**.

> ⚠ **No binding legal ruling was found.** No government decision, decree, or circular mandating
> either style was fetched, and the tone-placement source states outright that it carries no such
> prescriptive authority beyond the 2022 textbook statement. **The honest picture: kiểu mới is the
> schoolbook and state-publisher norm; kiểu cũ remains the majority habit in general writing;
> neither is an error, and an adult reader will find both perfectly normal.**

> **🏠 House rule — a corpus-consistency decision, not a correctness ruling.** Pick **one** and
> enforce it corpus-wide. For an educational platform, **kiểu mới** is the defensible pick on the
> sourced ground that it is what Vietnamese textbooks use as of 2022 and what school orthography
> teaches. **Write this down as house style. Never present it as compliance with a rule, and never
> let a reviewer "correct" an adult reader's kiểu cũ habit into an error report.**

> **🔴 The engineering payload — this is the part that costs money.** kiểu cũ and kiểu mới are
> **different letter sequences**: the mark sits on a different base vowel. They are therefore
> **not** a Unicode normalization difference. **NFC and NFD will not reconcile them, and no
> normalizer, no `String.normalize`, no ICU collation-neutral comparison and no CI encoding check
> will ever catch a document that mixes them.** `hòa` and `hoà` will sit in the same glossary as two
> distinct strings, look identical to every reviewer, and split your search index. It needs a lint
> rule of its own (§11).

| House style (kiểu mới) | The other convention (kiểu cũ) — correct Vietnamese, wrong for this corpus |
|---|---|
| **hoà** | **hòa** |
| **thuỷ** | **thủy** |
| **nguỵ** | **ngụy** |
| **hoá học** | **hóa học** |

### 3h. ⚠ i vs y — the least consistent area of the orthography, and `kĩ`/`kỹ` is unresolved

The Vietnamese-language source states the situation with unusual candor:

> **"Mặc dù có nhiều quy định ban hành nhưng cách dùng của chữ i và y dường như vẫn là thiếu nhất
> quán nhất trong suốt chiều dài lịch sử chính tả tiếng Việt"**
> — <https://vi.wikipedia.org/wiki/Chính_tả_tiếng_Việt>

**One official attempt exists and it did not settle the matter.** The 1984 Ministry of Education
instrument proposed that ⟨y⟩ represent /i/ only in specific contexts, but: **"These efforts seem to
have had limited effect. In textbooks published by Nhà Xuất bản Giáo dục ('Publishing House of
Education'), ⟨y⟩ is used to represent /i/ only in Sino-Vietnamese words... Most people and the
popular media continue to use the spelling that they are most accustomed to."** ⚠ **The instrument's
own text was never fetched** (§2b) — everything here about it is secondary.

**The most concrete operational rule that could be fetched** is an editorial manual, community tier:

> **"Dùng **i-ngắn** với các phụ âm **B-, H-, K-, L-, M-, T-**. Ví dụ: bí ẩn, hi vọng, ki bo, phân
> li, bánh mì, ti tiện…"** — <https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn/Chính_tả>

with the complementary principle: **i-ngắn** for non-Sino-Vietnamese words where the sound stands
alone, **y-dài** for Sino-Vietnamese words in the same position.

> **🔴 `kĩ thuật` vs `kỹ thuật`: the two sourced principles conflict on this exact word, and no
> source resolves it.** The consonant list puts `k-` in the **i-ngắn** column, which points to
> **kĩ thuật**. The Sino-Vietnamese principle points to **kỹ thuật**, because `kỹ` is Sino-Vietnamese.
> **Both principles are sourced. They disagree. This guide does not pick a winner** — which is
> precisely why the same source calls i/y the least consistent area of Vietnamese orthography.
>
> ⚠ A frequency claim would settle it in practice, and **no frequency evidence was fetched**. Do not
> let an impression about "what people write" enter the term sheet as a fact.

**What the guide *does* require:** the choice is a **house call**, it must be **logged as a house
call**, and it must be applied to the **whole family** — not word by word. The family this platform
will hit: **kĩ/kỹ · lí/lý** (as in `lý thuyết`, `xử lý`) **· mĩ/mỹ · kì/kỳ · quí/quý · tỉ/tỷ**.

Note the interaction with §4a: **quý vị** contains the y-dài `quý`. If the register decision ever
brings that form into the corpus, it must match the house i/y call.

### 3i. Quotation marks — codepoints first

**From CLDR locale `vi` (`cldr-misc-full/main/vi/delimiters.json`), re-fetched with an explicit
codepoint demand after the first fetch came back ASCII-flattened (§2d):**

| Level | Open | Close | Codepoints | Unicode names |
|---|---|---|---|---|
| Primary (double) | **“** | **”** | **U+201C** / **U+201D** | `LEFT DOUBLE QUOTATION MARK` / `RIGHT DOUBLE QUOTATION MARK` |
| Inner (single) | **‘** | **’** | **U+2018** / **U+2019** | `LEFT SINGLE QUOTATION MARK` / `RIGHT SINGLE QUOTATION MARK` |

- ✅ Vietnamese: **“học máy”** — U+201C … U+201D
- ❌ Straight ASCII: **"học máy"** — U+0022 … U+0022
- ✅ nested, the inner pair sitting inside the outer pair: **“thuật ngữ ‘mạng nơ-ron’ trong câu”**
- ❌ the same string with an ASCII apostrophe as the inner mark: **“thuật ngữ 'mạng nơ-ron' trong câu”**

**The nesting order is the English convention** — double outside, single inside — **not** the German
or the French one. Never ASCII `"` U+0022 or `'` U+0027 in body copy.

> ⚠ **Guillemets « » — genuinely unresolved.** The Vietnamese punctuation article mentions them
> **only as a description of French and Russian practice**. **No source establishes whether « » is
> used in Vietnamese publishing.** French typographic influence makes it plausible; plausible is not
> sourced. **Gap — flagged, not filled.** Do not introduce guillemets into `vi` copy on the strength
> of an intuition, and do not "correct" them out of quoted material either.

**U+2019 does double duty** as the correct apostrophe. Vietnamese has little native use for one, but
it appears in retained English terms and in foreign names (§6d).

### 3j. Spacing around punctuation — French style did **not** survive

This is one of the cleanest rules available, and it is worth stating positively because translators
arriving from French-influenced habits or from FR source files get it wrong reliably:

> **"Sau các dấu câu như dấu chấm (.), dấu phẩy (,)...ở giữa hai câu **cần có một khoảng trắng**"** ·
> **"Giữa từ cuối của câu và các dấu câu không có khoảng trống."**
> — <https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn>

**No space before `.` `,` `:` `;` `?` `!` — one space after.** Despite roughly eighty years of French
orthographic contact, the French thin space before punctuation did not enter standard Vietnamese
practice. It is trivially lintable (§11).

- ✅ **Học máy là một lĩnh vực của trí tuệ nhân tạo, và nó học từ dữ liệu.**
- ❌ **Học máy là một lĩnh vực của trí tuệ nhân tạo , và nó học từ dữ liệu .**

**Number ranges take an en dash with no spaces**, from the same manual:

> **"ta viết các con số và nối giữa các dấu gạch ngang (Ví dụ: '20–30' là đúng, '20 – 30' là sai)."**

| Convention | Correct | Wrong |
|---|---|---|
| Numeric range | **20–30** — en dash **– U+2013**, no spaces | **20 – 30** — spaces around the dash |

### 3k. Capitalization — sentence case, and one contested area left open

> **"Tên bài được viết bằng chữ thường với chữ cái đầu viết hoa"** · **"các từ không được viết hoa
> trừ khi chúng được viết hoa như vậy ở giữa câu"** — <https://vi.wikipedia.org/wiki/Wikipedia:Tên_bài>
> · **"Chỉ viết hoa chữ cái đầu tiên của tiêu đề và các danh từ riêng (theo quy tắc viết hoa đầu
> câu)"** — <https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn>

**Sentence case, never Title Case.** This is a high-frequency EN→VI error: English UI strings,
headings, buttons, and nav labels arrive in Title Case and get carried across unchanged.

- ✅ **Cách huấn luyện một mô hình ngôn ngữ lớn**
- ❌ **Cách Huấn Luyện Một Mô Hình Ngôn Ngữ Lớn**

> ⚠ **Where it gets contested, and where this guide stops.** Vietnamese writes each syllable
> separately, so multi-syllable proper nouns raise the question of how far capitalization extends
> through a long organization or place name. A government instrument addresses exactly this —
> **Nghị định 30/2020/NĐ-CP, Phụ lục II**, on *viết hoa* in official documents — and **it was never
> fetched** (§2b). The rules above are **editorial-manual practice**, community tier. **Do not
> present them as the state rule, and do not invent a rule for long organization names.**

### 3l. Line breaking and hyphenation — abundant opportunities, no hyphenation

UAX #14 **does not treat Vietnamese specially**: a thorough read of the report found no mention of
Vietnamese and no distinct case for it. The general rules apply — **"The Western style is commonly
used for scripts employing the space character."** and **"The space characters are used as explicit
break opportunities; they allow line breaks before most other characters."**

**The Vietnamese fact that changes everything:** the orthography **separates every syllable with a
space**. `trí tuệ nhân tạo` is **four space-separated tokens**, not one word. So there is never a
shortage of break opportunities and **hyphenation is not needed at all** — but the renderer will
also happily break a multi-syllable *term* across lines, splitting `trí tuệ` from `nhân tạo`, or
breaking `mạng nơ-ron` at its hyphen.

> ⚠ **No Vietnamese hyphenation dictionary or language-specific rule set was found.** Craft
> recommendation, flagged as such: set `hyphens: none`, ship **no** `vi` hyphenation dictionary, and
> hold short technical terms together selectively with **U+00A0 NO-BREAK SPACE** or
> `white-space: nowrap`. **Never soft hyphens and never `<wbr>` inside Vietnamese words** — both
> invite a break at a place the orthography does not sanction.

Because combining sequences break as units (§3e), a decomposed vowel is one of the very few places
NFD does no harm here.

### 3m. Fonts — the ransom-note effect is the signature failure

> **"It is common for two diacritics to be placed on a single Vietnamese vowel. Some fonts (like
> Arial, Times New Roman,..) stack these diacritics, while others (like Calibri,...) offset the tone
> mark."** · **"Due to the high density of Vietnamese-specific characters in Vietnamese text, Web
> browsers that implement font substitution reliably produce a ransom note effect when the webpage
> specifies an inadequate font."** — <https://en.wikipedia.org/wiki/Vietnamese_language_and_computers>

Two legitimate design strategies exist for stacked marks — **vertical stacking** and **lateral
offset** — and they are not visually interchangeable. A font that does neither, or that lacks
U+1EA0–U+1EF9 entirely, triggers substitution; and because Vietnamese diacritic density is so high,
the resulting every-fifth-character-in-another-face effect is far more obvious than in other
Latin-script languages. **It is also the cheapest thing in this guide to test for.**

**Coverage requirement:** **U+1EA0–U+1EF9** *plus* U+0102/U+0103, U+00C2/U+00E2, U+0110/U+0111,
U+00CA/U+00EA, U+00D4/U+00F4, U+01A0/U+01A1, U+01AF/U+01B0.

**Test string** — exercises stacking, horn, dot-below, and the đ exception in one line:

> **Điện tử — Chuyển đổi số — nghiên cứu kỹ thuật ứng dụng trí tuệ nhân tạo**

(Note that this string contains **kỹ**, one of the contested i/y words of §3h; swap it for the
house form once that call is logged.)

⚠ **No sourced list of "fonts that handle Vietnamese properly" exists in this guide.** Two typography
references were attempted and returned nothing usable and a 404 respectively. The Arial / Times /
Calibri / Verdana observations above are the only sourced statements on Vietnamese type available
here. ⚠ Craft, unsourced: Vietnamese needs **more leading than English at the same size**, because
stacked marks are the first thing to collide with the line above — check at small sizes and with
tight `line-height`.

**Romanization never appears in the UI.** The point is moot in the usual sense — chữ Quốc ngữ *is*
Latin, so there is no transliteration layer to build. What must be kept out of the UI instead is
**tone-stripped Vietnamese** (`tieng Viet` for `tiếng Việt`): it is not a romanization, it is
damaged text, and it is what a broken pipeline produces (§3b).

Sources: <https://vi.wikipedia.org/wiki/Chữ_Quốc_ngữ> · <https://vi.wikipedia.org/wiki/Bảng_chữ_cái_tiếng_Việt> ·
<https://vi.wikipedia.org/wiki/Quy_tắc_đặt_dấu_thanh_trong_chữ_quốc_ngữ> ·
<https://vi.wikipedia.org/wiki/Chính_tả_tiếng_Việt> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn/Chính_tả> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Tên_bài> · <https://vi.wikipedia.org/wiki/Dấu_câu> ·
<https://vi.wikipedia.org/wiki/VISCII> · <https://vi.wikipedia.org/wiki/VNI> ·
<https://vi.wikipedia.org/wiki/Bộ_gõ_tiếng_Việt> ·
<https://www.unicode.org/reports/tr15/> · <https://www.w3.org/TR/charmod-norm/> ·
<https://www.unicode.org/reports/tr14/> ·
<https://util.unicode.org/UnicodeJsps/character.jsp?a=1EC7> ·
<https://util.unicode.org/UnicodeJsps/character.jsp?a=0323> ·
<https://en.wikipedia.org/wiki/Vietnamese_alphabet> ·
<https://en.wikipedia.org/wiki/Vietnamese_language_and_computers> ·
<https://en.wikipedia.org/wiki/Latin_Extended_Additional> · <https://en.wikipedia.org/wiki/Windows-1258> ·
<https://en.wikipedia.org/wiki/Vietnamese_Standard_Code_for_Information_Interchange> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/vi/delimiters.json>

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes:** `lang="vi"` (base), `lang="vi-easy"` (simplified variant, per the
  header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 / 3.1.2, and it also drives spellcheck and screen-reader voice selection.
- **🔴 Normalize to NFC on ingest, and assert it in CI.** Every Vietnamese string that enters the
  repository — translation JSON, glossary, content, name fields — is normalized **once, at ingest**,
  and the assertion runs on every build. **Never normalize at render time only**: it hides the defect
  from reviewers while every stored key stays wrong (§3e).
- **🔴 The kiểu cũ / kiểu mới lint is a separate rule and nothing else will catch it.** `hòa` and
  `hoà` are different letter sequences, not normalization variants, so encoding checks, NFC
  assertions and collation-insensitive comparison are all blind to a document that mixes them
  (§3g). Build a word-list lint against the house style.
- **🔴 Number formatting — decimal `,` (U+002C), group `.` (U+002E).** Verify with a fixture: the
  value that English renders as `1,234.5` must render as **1.234,5**. An un-localized
  number-formatting call produces English grouping that is **wrong but readable**, which is why it
  survives QA (§5a).
- **Currency:** **₫ U+20AB** *after* the amount with a space — `250.000 ₫`. Use **zero** decimal
  places in practice, even though the CLDR standard currency pattern shows two (§5c). Prefer the
  word `đồng` and magnitude words (`526 tỷ đồng`) in running prose.
- **Percent is closed up:** `85%`, never a space before the sign.
- **Dates:** **day first** — `d/M/y`, never `M/d/y`. Prefer `d MMMM, y` in content. 24-hour clock,
  `HH:mm`. **Months are `tháng` + a number and must never be "translated"** (§5d).
- **Font coverage is a hard requirement, not a preference:** **U+1EA0–U+1EF9** plus U+0102/U+0103,
  U+00C2/U+00E2, U+0110/U+0111, U+00CA/U+00EA, U+00D4/U+00F4, U+01A0/U+01A1, U+01AF/U+01B0.
  Coverage of Latin Extended-A alone is not enough; the failure mode is the **ransom-note effect**,
  which is unusually visible in Vietnamese because of diacritic density (§3m). Test with the §3m
  string.
- **Leading:** ⚠ craft, unsourced — allow **more leading than English at the same size**; stacked
  marks collide with the line above first. Check at small sizes and with tight `line-height`.
- **Line breaking and hyphenation:** standard space-based Latin breaking. **Set `hyphens: none` and
  ship no `vi` hyphenation dictionary** — none was found, and the orthography does not need one.
  Hold short technical terms together with **U+00A0 NO-BREAK SPACE** or `white-space: nowrap`;
  **never soft hyphens, never `<wbr>` inside Vietnamese words** (§3l).
- **Tokenization:** whitespace tokenization works, **but a token is a syllable, not a word**.
  `trí tuệ nhân tạo` is four tokens. Any word-based highlighting, search-term matching, truncation,
  or "first N words" feature must be told that, or it will cut a term in half.
- **Truncation by character count is unsafe on NFD input** and merely unfortunate on NFC — always
  truncate on grapheme clusters, never on code units (§3d).
- **Index alphabet for glossary navigation — 29 letters, not 26:** **A Ă Â B C D Đ E Ê G H I K L M N
  O Ô Ơ P Q R S T U Ư V X Y**. **F, J, W, and Z are not Vietnamese alphabet letters** (§3a) even
  though they appear in retained Latin tokens, so decide deliberately whether the index carries an
  extra bucket for them.
- **Quotation marks:** normalize straight ASCII quotes in body copy to **“ ” U+201C / U+201D** with
  inner **‘ ’ U+2018 / U+2019**; confirm the shipped font carries all four (§3i).
- **Never ASCII-fold a foreign name.** Vietnamese practice preserves other languages' diacritics
  (§6d); a name field is data.
- **Locale negotiation:** `vi-easy` must resolve to Vietnamese content, never fall back to a
  different language's easy variant; and no fallback may hand a `vi` reader an English-formatted
  number (§5a).

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/vi/numbers.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/vi/ca-gregorian.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/vi/delimiters.json> ·
<https://www.unicode.org/reports/tr14/> · <https://www.unicode.org/reports/tr15/> ·
<https://util.unicode.org/UnicodeJsps/character.jsp?a=20AB> ·
<https://en.wikipedia.org/wiki/Latin_Extended_Additional> ·
<https://en.wikipedia.org/wiki/Vietnamese_language_and_computers> ·
<https://vi.wikipedia.org/wiki/Bảng_chữ_cái_tiếng_Việt>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md). Ordered by yield.

- **🔴 NFC assertion — the single highest-yield check in this language.** Every `vi` string must
  satisfy `s === s.normalize('NFC')`. Report the offending codepoints, not just the file: an NFD
  Vietnamese vowel is a 2- or 3-codepoint sequence and the report has to say which (§3d).
  - Run it on **translation JSON keys as well as values**. A decomposed key fails lookup silently.
- **🔴 Forbidden-character list:**
  - **U+0340** `COMBINING GRAVE TONE MARK` and **U+0341** `COMBINING ACUTE TONE MARK` — deprecated
    since 2001; their presence means a pre-2001 pipeline (§3c).
  - **U+FFFD** — a decode already failed upstream.
  - Any C0 control byte in text content — a VISCII/VSCII-1 tell (§3f).
- **🔴 The `đ`-survivor test (§3b).** Flag any `vi` file where **ă â ê ô ơ ư** are rare or absent
  **while `đ` U+0111 is present at normal frequency**. That asymmetry is the signature of a
  mark-stripping bug, because U+0111 has no canonical decomposition and survives what destroys the
  other six. Cheap, and it catches a class of damage nothing else sees.
- **🔴 kiểu cũ / kiểu mới consistency (§3g).** A word-list scan for both spellings of the same word
  — `hòa`/`hoà`, `thủy`/`thuỷ`, `ngụy`/`nguỵ`, `hóa`/`hoá` — flagging any document that contains
  **both**, and any occurrence that contradicts the house style. **No normalizer, encoding check, or
  collation setting will ever catch this.**
- **🔴 English number-grouping leak (§5a).** Flag `\d,\d{3}` in `vi` content — a digit, a comma, and
  exactly three digits is English grouping, and the most likely source is an English-language
  reference about Vietnam or an un-localized formatting call. Also flag a period used as a decimal
  point in a figure with two decimal places.
- **🔴 Date-order leak (§5d).** Flag `M/d/y`-shaped numeric dates and any month rendered as a word
  other than **tháng N** / **thg N**.
- **i/y consistency (§3h).** Flag documents containing both members of any pair in the family
  **kĩ/kỹ · lí/lý · mĩ/mỹ · kì/kỳ · quí/quý · tỉ/tỷ**. ⚠ The check enforces **the house call**,
  which this guide deliberately does not make — and for `kĩ`/`kỹ` the two sourced principles
  conflict, so the message must say "inconsistent", never "wrong".
- **Quotation codepoints (§3i).** In `vi` body copy the marks must be **“ ” U+201C / U+201D** with
  inner **‘ ’ U+2018 / U+2019**. Flag **U+0022** and **U+0027**. ⚠ Do **not** auto-flag « » as
  wrong: no source establishes whether guillemets are used in Vietnamese publishing.
- **Spacing before punctuation (§3j).** Flag any whitespace immediately before `.` `,` `:` `;` `?`
  `!` — French style did not survive into Vietnamese, and this is trivially deterministic. Flag a
  spaced en dash in a numeric range (`20 – 30`); the sourced form is **20–30**.
- **Sentence-case check (§3k).** Flag headings, buttons, and nav labels where a second or subsequent
  word is capitalized and is not a proper noun — English Title Case carried across. ⚠ Not fully
  deterministic: Vietnamese proper nouns are multi-syllable and each syllable may legitimately be
  capitalized, and **the state instrument that governs this was never read**.
- **Register check (§4a).** Flag **`quý vị`** anywhere in default content, and flag any document
  containing **both** `bạn` and `quý vị`. Flag `anh`, `chị`, `ông`, `bà` used as reader address.
  🏠 Optionally flag `bạn` **density** in `vi` (avoidance not applied) — and note that in `vi-easy`
  the threshold runs the **other way** (§8d), so the two variants need different rules or none.
- **Tense over-marking (§4d).** Flag a high density of `đã` / `sẽ` in expository passages for human
  review. Most statements in this domain are timeless generalizations and take no marker.
- **Plural over-marking (§4e).** Flag `các` / `những` density for human review. ⚠ The check can flag
  frequency only. **It must not attempt to choose between `các` and `những`** — no sourced rule for
  that distinction exists, and a lint rule asserting one would launder a guess into an
  automated verdict.
- **Terminology consistency (§6c).** Flag documents containing more than one of **mạng nơ-ron
  nhân tạo** / **mạng thần kinh nhân tạo** / **mạng neuron nhân tạo**. Flag **máy học** on sight —
  it is unsourced (§6c). Flag mixed loanword styles for the same word (`nơ-ron` / `nơ ron` /
  `neuron`), which the sources show is a genuine three-way convention split with no rule (§6d).
- **Gloss-pattern check (§6a).** Flag an English term appearing *before* its Vietnamese equivalent
  in a parenthetical pair, and flag the same term glossed more than once per page.
- **Regional-marker scan (§9a).** Flag the strongly region-marked halves of the sourced compound
  pairs, and flag **ngàn** where the house standard is **nghìn**.
- **Script-ratio expectation.** `vi` content is Latin throughout, so a script-ratio check is weak
  here. The useful inverse is a **diacritic-density floor**: running Vietnamese prose carries
  diacritics at high frequency, so a `vi` string that is **pure ASCII** and longer than a few words
  is either an untranslated English leak or tone-stripped Vietnamese (§3m). Both are defects.
- **Source-language leak scan (EN → VI):** left-in English function words (*the, and, you, please*),
  English-format numbers and dates in Vietnamese text, English premodifier order in compounds
  (§4b), Title Case headings, and untranslated UI strings.

Sources: <https://www.unicode.org/reports/tr15/> · <https://www.w3.org/TR/charmod-norm/> ·
<https://util.unicode.org/UnicodeJsps/character.jsp?a=0111> ·
<https://en.wikipedia.org/wiki/Vietnamese_language_and_computers> ·
<https://vi.wikipedia.org/wiki/Quy_tắc_đặt_dấu_thanh_trong_chữ_quốc_ngữ> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/vi/numbers.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/vi/delimiters.json>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** The dossier
was compiled **without a web-search tool** — every source was reached by constructing a URL directly
— which biases coverage toward institutions with predictable URLs (Unicode, W3C, CLDR, the
Vietnamese- and English-language encyclopedias) and against Vietnamese official and legal material,
which sits behind 403s, login walls, and image-only scans. **§2 (authorities), §7 (idioms) and §8
(plain language) are thin for exactly that reason, and each says so in place rather than filling the
gap.** A further hazard governs every character here: the fetch layer **silently ASCII-flattened
quotation marks** on a first attempt and had to be re-fetched with an explicit codepoint demand —
which is why this guide states codepoints beside glyphs throughout, and why **the codepoint is the
authority wherever the two could disagree**.

**Carried through as open gaps** — none is closed by this guide, and each is marked ⚠ where it
appears: the text of the 1984 orthography decision and of the 2020 capitalization instrument, both
cited only second-hand (§2b, §3h, §3k); the **`các` / `những`** distinction, which two sources
explicitly decline to state (§4e); **`kĩ` vs `kỹ`**, where the two sourced principles conflict on
that exact word (§3h); **`máy học`**, which could not be sourced at all (§6c); classifiers for the
abstract technical nouns this platform uses most (§4c); **serial verb constructions**, requested and
not written (§4g); the diaspora lexical divergence (§9c); whether **« »** guillemets are used in
Vietnamese publishing (§3i); mojibake signatures per legacy encoding, which are craft inference
(§3f); a Vietnamese plain-language standard, established as **not located** rather than absent
(§8a); the **uppercase codepoints** for the seven modified letters, which were not fetched
individually (§3b); the **numeric combining-class values**, which the character-database page never
printed and which are therefore not reproduced here (§3d); an Official-tier Vietnamese government
source of any kind behind §5; and census-tier speaker figures (§header).

**Deliberately withheld:** the industry glossary of model, product, and company names. The research
withheld it; this guide keeps it withheld, and reproduces only the *language* rules on foreign names
(§6d).

**Strong sections:** §3 script and typography (Unicode fetched per codepoint), §5 numbers and dates
(CLDR raw JSON plus corroboration in running Vietnamese text), §4a register (measured against three
institutional sites and two instructional corpora), §4f the Sino-Vietnamese register inversion.
**Honest ⚠ sections:** §2 (neither legal instrument read), §7 (idiom renderings are proposals for
native review), §8 (no plain-language standard located, eight sourced pairs rather than ten, and
those are evidence of an axis rather than a substitution list), §9b (no sourced answer on the
neutral written variety). **Not reviewed by a native speaker.**
