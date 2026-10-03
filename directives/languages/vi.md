<!-- base -->
# lang-vi — Vietnamese (tiếng Việt) — language guide

> **Setup & sources live in [`vi.setup.md`](vi.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** tiếng Việt / Vietnamese.
**BCP 47 code (base):** `vi`.
**BCP 47 code (simplified variant):** `vi-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would need a private-use subtag
(`vi-x-simple`); the kit token `vi-easy` is the one that counts here, and there is **no registered
BCP 47 subtag for simplified language** in any case.
**Speaker reach:** ⚠ **community-tier, and the two available versions disagree on dating.** The
Vietnamese-language encyclopedia infobox gives **"L1: 86 triệu / L2: 11 triệu / Tổng: 97 triệu
(2019)"**; the English-language article agrees on the totals but dates them "L1: 86 million
(2019–2023) | L2: 11 million (2024)". Two facts matter more than the headline number:
**"Đây là tiếng mẹ đẻ của khoảng 85% dân cư Việt Nam"** — and the L2 population is **not** mainly
foreigners, it is **"ngôn ngữ thứ hai của 53 dân tộc thiểu số được công nhận tại Việt Nam"**.
Diaspora ~5.3 million, US-dominant. **A census-tier figure was not fetched; do not quote these as
official.**
**Script + direction:** **chữ Quốc ngữ** — Latin script with diacritics, **29 letters**,
**left-to-right**, whitespace-separated **syllables** (not words).
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `vi` and the `vi-easy` pendant. Per the authoring directive's "second set of
eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.

**Section strength at a glance** (read this before trusting any one section):

| Section | Strength | Resting on |
|---|---|---|
| §2 Authorities | **Honest ⚠ — the normative instruments were never read** | Two legal instruments named by secondary sources; every path to their text returned 403, 404, a wrong document, or a scan |
| §3 Script & typography | **Strong** — the guide's center of gravity | Unicode character database fetched per codepoint; UAX #14/#15; W3C charmod-norm; CLDR `vi` raw JSON |
| §4 Grammar | **Mixed** — word order and aspect sourced; two named holes | Community-tier grammar descriptions; `các`/`những` and serial verbs are **declared gaps**, not filled |
| §5 Numbers/dates/currency | **Strong, and the separator inversion is nailed** | CLDR `vi` numbers/currencies/dates JSON, corroborated by running Vietnamese text and press |
| §6 Terminology | **Attested but community-tier only** | No official or academic Vietnamese AI-terminology standard was reachable |
| §7 Idioms | **⚠ Essentially unsourced — proposals for native review** | Only the *structural* reason for calque failure is sourced (§4b) |
| §8 `vi-easy` | **Measured** — ⚠ still no Vietnamese plain-language standard | The obvious lexical strategy is sourced as **dangerous** (§8b) and now **measured as wrong** on six specific swaps (§8c-iii); a 383,052-token children's-paper / government-paper register contrast supplies evidence per row |
| §9 Regional variation | **Sourced on vocabulary pairs; ⚠ silent on which variety is the written norm** | Dialect-region article; the diaspora split is a declared gap |

**Easy or hard for this kit:** typographically it is Latin, LTR, whitespace-tokenized and needs no
shaping engine — and that is exactly what makes it dangerous, because **every failure looks like
working text**. The difficulty concentrates in four places, all of which pass a visual review:
(1) **Unicode normalization** — the same visible word exists as one codepoint or as three, and
a still-current legacy code page generates the decomposed form (§3f); (2) **two live tone-mark
placement conventions**, `hòa` vs `hoà`, which are **different letter sequences and therefore
invisible to any normalizer** (§3g); (3) the **inverted number separators** — decimal `,` and
grouping `.` — which render every mis-formatted figure readable but wrong (§5a); and (4) the
**address problem**, where Vietnamese offers no neutral second-person pronoun at all (§4a).

Sources: <https://vi.wikipedia.org/wiki/Tiếng_Việt> · <https://en.wikipedia.org/wiki/Vietnamese_language> ·
<https://vi.wikipedia.org/wiki/Người_Việt_hải_ngoại> · <https://en.wikipedia.org/wiki/Overseas_Vietnamese>

---

## 1. Header block

See above. One-line orientation: Vietnamese is an **isolating, head-initial, modifier-final**
language in a diacritic-dense Latin orthography, with **no inflection, no articles, no obligatory
plural and no obligatory tense** — so nothing English encodes morphologically survives the crossing.
Its complexity sits in **encoding, orthographic variation, and forms of address**, not in agreement
morphology. The `vi` reader is overwhelmingly inside Vietnam and reads a single written standard,
but the readership also includes several million L2 readers from Vietnam's recognized ethnic
minorities and roughly five million diaspora readers whose Vietnamese was frozen at emigration.
Register therefore stays plain and vocabulary mainstream-contemporary — while the **encoding must be
flawless**, because diaspora and older-Vietnam text pipelines are precisely where legacy 8-bit
encodings and decomposed Unicode still live.

---

## 4. Grammar for translators

**Word order.** Vietnamese is **head-initial and modifier-final** — the mirror image of English
compounding:

> **"Tiếng chính đứng trước, tiếng phụ đứng sau"** — <https://vi.wikipedia.org/wiki/Ngữ_pháp_tiếng_Việt>

with the full noun-phrase template: **"TOTALITY + ARTICLE + QUANTIFIER + CLASSIFIER + HEAD NOUN +
ATTRIBUTIVE MODIFIER(S) + DEMONSTRATIVE + PREPOSITIONAL PHRASE"**.

**There is no inflection to carry over at all:** no plural `-s`, no verb agreement, no case, no
articles. Every distinction English encodes morphologically is either dropped as redundant or
re-expressed lexically.

### 4a. Register — the address problem, and the project's recorded choice

**There is no neutral second-person form in Vietnamese.** The description is unambiguous: "There is
no single neutral form; instead, context determines whether kinship terms, titles, or name-based
reference is most suitable", and speakers "must assess relative age, status, and familiarity to
select appropriate terms." This is structural, not stylistic:

> **"Kinship terms in Vietnamese have become grammaticalized to a large extent and thus have
> developed grammatical functions similar to pronouns."**
> — <https://en.wikipedia.org/wiki/Vietnamese_grammar>

**What Vietnamese institutions actually do — measured, not assumed.** Three institutional sites were
fetched and checked for direct address:

| Site fetched | Finding |
|---|---|
| National government portal (Official) | **"purely impersonal/third-person constructions" throughout; no direct address at all.** Sample voice: **"Chính phủ vừa ban hành Nghị định..."** |
| Ministry of Education and Training (Official) | **"the site does not directly address readers using second-person pronouns"**. Sample: **"Bộ Giáo dục và Đào tạo (GDĐT) vừa ban hành Thông tư số 57/2026/TT-BGDĐT quy định về bảo đảm chất lượng giáo dục"** |
| National broadcaster (Community) | No direct-address form on the homepage; **"Khán giả"** appears only as a menu label |

**Educational and help content aimed at an unknown adult reader uses `bạn`.** Two independent
instances were fetched. An open encyclopedia's welcome page:

> **"Có nghĩa là bất kỳ ai, tất cả mọi người, kể cả bạn cũng có thể tham gia và sửa đổi các bài viết
> trên Wikipedia."** — <https://vi.wikipedia.org/wiki/Wikipedia:Chào_mừng>

and a major localized help site (vendor withheld, §6f), four consecutive instances:

> **"Bạn có thể bắt đầu bằng một nội dung tìm kiếm đơn giản, chẳng hạn như `sân bay gần nhất ở
> đâu?`."** · **"Nếu bạn muốn tìm một địa điểm hoặc sản phẩm tại một vị trí cụ thể, hãy thêm vị trí
> đó vào nội dung tìm kiếm."** · **"Hãy sử dụng những cụm từ có khả năng xuất hiện trên trang web mà
> bạn đang tìm kiếm."** · **"Nếu bạn không nhớ tên của một trang web, hãy thử tìm kiếm theo cách mọi
> người có thể mô tả về trang web đó."**

**Note the third and fourth examples.** They use **`hãy` + verb** — an imperative with **no pronoun
at all**. Avoidance-by-construction is operating *alongside* `bạn` in the same document, not instead
of it.

**The trade-offs, stated honestly:**

| Option | For | Against |
|---|---|---|
| **bạn** | The attested default for unknown adult readers in Vietnamese online educational and help content — two independent sources. **Does not encode gender.** Shortest and most frequent. Warm and accessible. | Described as "popular among young people as a way of addressing each other"; can read peer-ish to an older reader. Literally means *friend*. |
| **quý vị** | Maximally safe; never gives offense. | Sourced as one of the "pronouns that elevate the audience", glossed "esteemed guests" — it addresses a **collective**. Reads as broadcast or ceremonial and distances an individual learner. |
| **anh / chị / ông / bà** | Natural in real Vietnamese interaction. | Requires guessing the reader's **gender and relative age**. Impossible for an anonymous web audience; a wrong guess is actively rude. Non-starter. |
| **các bạn** | Correct for genuine plural or group address. | Plural only. Cannot address a single reader — fine in a course overview, wrong in an exercise. |
| **avoidance by construction** | What Vietnamese government institutions actually do (both Official-tier fetches above). Zero risk. Attested co-occurring with `bạn`. | Cannot be sustained across an interactive learning platform. Government portals only publish announcements; **they never have to say "you got this one right."** |

> **Register decision (human-gate): `bạn` as the platform's default second-person address, paired
> with systematic avoidance-by-construction wherever it is natural.** The decision is **taken and
> recorded**, on the evidence set out above; it is **not** a sourced ruling, because no such ruling
> exists. A downstream project that adopts this kit may of course record a different choice — what
> the guide forbids is leaving it implicit.
>
> **Binding for all second-person copy** in `vi` and `vi-easy`:
>
> - **Primary: `bạn`.** It is the **only form attested in this research for this exact use case** —
>   Vietnamese-language instructional content addressing an unknown adult reader online — and the
>   **only option that does not require guessing** the reader's gender or age.
> - **Workhorse: `hãy` + verb.** Attested in the same corpus that uses `bạn`, so the two coexist
>   naturally. It lowers pronoun density substantially without changing register.
> - **`các bạn` only for genuine plural or group address** — course intros, community features.
>   Never for a single reader doing a single exercise.
> - **Never mix `bạn` and `quý vị`** anywhere in the platform. The inconsistency reads as two
>   different products.
> - **`quý vị` is rejected on the sourced ground that it elevates a *collective*.** A learning
>   platform speaks to one person; `quý vị` would systematically mis-frame that as
>   broadcast-to-audience.
> - ⚠ **Craft, unsourced — flag for native review:** `chúng tôi` for the platform's own voice
>   (exclusive *we* — us, not you), `chúng ta` reserved for genuinely inclusive *we*
>   (**chúng ta cùng tìm hiểu**). **The `chúng tôi` / `chúng ta` split is a real distinction that
>   could not be sourced here.**
> - **For `vi-easy`: keep `bạn`, and *reduce* the avoidance.** See §8d — this inverts the usual
>   simplification advice and is the single most likely thing for a translator to "improve" back.

- ✅ **Hãy chọn một mô hình để bắt đầu.** — pronoun-free imperative, the attested `hãy` shape
- ❌ **Quý vị hãy chọn một mô hình để bắt đầu.** — ⚠ rule-derived, not a quoted error example:
  `quý vị` addresses a collective, which mis-frames a single learner

### 4b. Modifier order — where English noun-piles fall apart

English stacks modifiers **before** the noun; Vietnamese puts them **after**. In both attested cases
the English premodifier chain comes out in **exactly reversed order**:

| English | Vietnamese (attested) | Structure |
|---|---|---|
| large language model | **mô hình ngôn ngữ lớn** | model + language + large |
| artificial neural network | **mạng nơ-ron nhân tạo** | network + neuron + artificial |
| artificial intelligence | **trí tuệ nhân tạo** | intelligence + artificial |

- ✅ **mô hình ngôn ngữ lớn**
- ❌ **lớn ngôn ngữ mô hình** — ⚠ rule-derived: English order carried across, the classic
  machine-translation tell

**English three- and four-word premodifier stacks do not survive.** A phrase like *unsupervised
anomaly detection pipeline* must be re-analyzed, not mapped, and is often broken into a
prepositional phrase with `của` or `cho`. **This is the sourced structural reason word-for-word
transfer fails, and it governs §7 as well.**

### 4c. Classifiers — obligatory with a numeral or a demonstrative, and a real gap

The governing principle: **"Classifiers must agree semantically with the animacy of the head noun."**
The syntactic trigger, from the Vietnamese-language description:

> **"trong tiếng Việt, danh từ 'áo' đi kèm với loại từ 'chiếc' khi nào muốn thêm vào số từ ('hai
> chiếc áo') hoặc chỉ từ ('chiếc áo này')"** — <https://vi.wikipedia.org/wiki/Loại_từ>

The inventory that was sourced, with the source's own glosses:

| Classifier | Gloss (quoted) |
|---|---|
| **cái** | "used for most inanimate objects" |
| **chiếc** | "almost similar to cái, usually more connotative" |
| **con** | "usually for animals and children, but can be used to describe some non-living objects" |
| **người** | "used for people except infants" |
| **bài** | "used for compositions like songs, drawings, poems, essays, etc." |
| **cuốn / quyển** | "used for book-like objects (books, journals, etc.)" |

**Why this bites here.** English writes "a model", "three algorithms", "this neural network", "each
layer", "two datasets" constantly. Vietnamese cannot copy the bare noun into those frames: the
numeral or demonstrative demands a classifier, and the classifier must be **chosen**. **bài** is
directly relevant — an educational platform is full of lessons, articles, and exercises.

> ⚠ **Declared gap, and a consequential one: classifiers for the abstract nouns this platform uses
> most — model, algorithm, dataset, network, layer, parameter — could not be sourced.** The sourced
> glosses cover concrete objects, animals, and compositions. **A native reviewer must supply them.
> Do not let the guide, a term sheet, or a translator guess**, and do not derive one by analogy from
> `cái`.
>
> This section is **correct-form-only** by design: no wrong/right classifier pair is given, because
> no source attests a specific classifier error or its effect. `chiếc` versus `cái` is documented as
> a **connotation** difference, not a truth-conditional one.

### 4d. No obligatory tense — and the over-marking failure

> **"Although it is not required, Vietnamese has many particles that are used to mark tenses.
> However, they are not always used as context may suffice."**
> — <https://en.wikipedia.org/wiki/Vietnamese_grammar>

with **đã** (past), **đang** (continuous), **sẽ** (future). The Vietnamese-language description
classes them as **phó từ** — **"Những phó từ này thường bổ sung một số ý nghĩa liên quan đến hành
động, trạng thái"** — listing them among **"đã, đang, cũng, sẽ, vẫn, còn, đều, được, rất, thật, lắm,
quá..."**

**The characteristic EN→VI failure is over-marking**: sprinkling `đã` and `sẽ` on every clause
because the English carried a past or future tense. In expository AI writing **most statements are
timeless generalizations** and take **no marker at all**. Reserve `đã` / `đang` / `sẽ` for genuine
temporal contrast.

- ✅ **Mô hình học từ dữ liệu huấn luyện.**
- ❌ **Mô hình sẽ học từ dữ liệu huấn luyện.** — ⚠ rule-derived over-marking, not a quoted error
  example: the English present simple is a generalization, not a future

### 4e. ⚠ Plural: `các` and `những` — correct forms given, the rule declared missing

Both are attested plural markers, classed as **lượng từ**, words indicating **"lượng nhiều hay ít
của sự vật một cách khái quát"**, in a list given as **"những, cả mấy, các,..."**

> 🔴 **The difference between `các` and `những` is NOT sourced, and this guide does not state one.**
> Two sources were checked explicitly. The English-language grammar description "lists two plural
> articles but does not explicitly state a difference between các and những"; the Vietnamese-language
> one likewise "does not explicitly state a grammatical difference between các and những or their
> specific usage rules."
>
> There **is** a distinction widely taught for this pair. **It could not be sourced, so it is not
> written here, and it must not be written into a term sheet, a review comment, or a lint rule
> either.** This is a genuine hole in a high-frequency function-word pair. **Action: a native
> reviewer or a fetched grammar reference must close it before this guide ships.**

**What *is* safe to say, and it is the higher-yield rule anyway: plural is not obligatory.** A bare
noun is number-neutral, and an English plural `-s` should usually translate to **nothing at all**.
Over-using `các` and `những` to mirror English plurals is the predictable EN→VI failure.

- ✅ **Mô hình học từ dữ liệu.**
- ❌ **Các mô hình học từ các dữ liệu.** — ⚠ rule-derived over-marking, not a quoted error example

### 4f. 🔑 Sino-Vietnamese vs native register — and the inversion that traps simplifiers

This is the most important stylistic axis in Vietnamese, and it is well sourced. **Read the quote
carefully, because it inverts the naive assumption:**

> **"các từ thuần Việt trong ví dụ này cho cảm giác thô tục, ghê sợ hoặc đau đớn còn các từ Hán-Việt
> tạo cảm giác lịch sự, trung hòa"** — <https://vi.wikipedia.org/wiki/Từ_thuần_Việt>

("the native Vietnamese words in this example give a feeling of coarseness, revulsion, or pain, while
the Sino-Vietnamese words create a polite, neutral feeling.")

**Swapping Sino-Vietnamese for native words does not automatically produce friendlier text.** On
some semantic fields it produces **blunter, cruder, more visceral** text. This governs the whole of
§8.

And "Sino-Vietnamese = hard" is wrong as a blanket rule, because the *recognizably* learned stratum
is the **rarest** in everyday speech:

> **"Xét về tỷ lệ xuất hiện của ba loại từ Hán Việt trong những lời nói thường ngày của người Việt,
> từ Hán Việt, loại dễ phát hiện nhất lại chiếm tỷ lệ thấp nhất"** · **"hai loại khó phát hiện nhất
> là từ Hán Việt cổ và Hán Việt Việt hoá lại chiếm tỷ lệ cao nhất"** · **"Từ Hán Việt cổ và từ Hán
> Việt Việt hoá là những từ ngữ thường dùng hằng ngày, nằm trong lớp từ vựng cơ bản của tiếng Việt"**
> — <https://vi.wikipedia.org/wiki/Từ_Hán-Việt>

**Consequence for AI/ML prose:** the technical vocabulary is overwhelmingly Sino-Vietnamese —
`trí tuệ nhân tạo`, `thuật toán`, `mô hình`, `dữ liệu`, `huấn luyện`, `xử lý`, `độ chính xác`. That
is correct and unavoidable; it is the register technical writing lives in. **Do not "simplify" these
away.** (Hán-Việt is reported as over 35% of Vietnamese vocabulary.)

### 4g. ⚠ Serial verb constructions — requested, not written

Vietnamese is standardly described as having serial verb constructions, and the modifier-final,
particle-based structure above makes them directly relevant to translating English complex
predicates. **No fetchable source describing them was found, so nothing is written here.** A native
reviewer or an academic grammar reference is required. **Do not fill this from memory.**

Sources: <https://vi.wikipedia.org/wiki/Ngữ_pháp_tiếng_Việt> · <https://vi.wikipedia.org/wiki/Loại_từ> ·
<https://vi.wikipedia.org/wiki/Từ_thuần_Việt> · <https://vi.wikipedia.org/wiki/Từ_Hán-Việt> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Chào_mừng> ·
<https://en.wikipedia.org/wiki/Vietnamese_grammar> · <https://en.wikipedia.org/wiki/Vietnamese_pronouns> ·
<https://chinhphu.vn/> · <https://moet.gov.vn/Pages/home.aspx> · <https://vtv.vn/>

---

## 5. Numbers, dates, currency

**This section carries the errors that survive review.** The Vietnamese convention is the inverse of
English, so a wrong number is still a **readable** number — which is exactly why it passes QA.

### 5a. 🔴 The separators — inverted from English

From CLDR locale `vi`, `cldr-numbers-full/main/vi/numbers.json`, `symbols-numberSystem-latn`:

| Symbol | Value (quoted from the JSON) |
|---|---|
| `decimal` | **`","`** |
| `group` | **`"."`** |
| `percentSign` | `"%"` |
| `plusSign` | `"+"` · `minusSign` `"-"` · `approximatelySign` `"~"` |
| `exponential` | `"E"` · `superscriptingExponent` `"×"` |
| `perMille` | `"‰"` · `infinity` `"∞"` · `nan` `"NaN"` |
| `timeSeparator` | `":"` |

> **🔴 Decimal separator = comma `,` (U+002C). Group separator = period `.` (U+002E).**
> **`1,5` is one-point-five. `1.500` is one thousand five hundred.**

**Corroborated in running Vietnamese text**, not only in locale data: the Vietnamese-language
diaspora article prints population figures as **"2.183.000 (2019)"**, **"432.934 (2021)"**,
**"294.798 (2016)"**, **"240.514"**, **"215.491 (2022)"**, **"300.000–350.000"**. Second
corroboration: **"Modern Vietnamese uses comma as decimal separator when written in Arabic
numerals."**

> **🔴 The live propagation vector — this is how the error actually spreads, and it was caught in
> the research itself.** The **English-language** encyclopedia article *about the Vietnamese
> currency* writes amounts as **"100,000₫"** — English comma grouping, in an English article about
> Vietnam. **Every English-language source describing Vietnam will format numbers English-style.**
> Only Vietnamese-language sources model Vietnamese formatting. A translator working from English
> reference material copies the grouping across without ever noticing there was a decision to make.
>
> **Rule: never take a number's *formatting* from an English-language source about Vietnam — only
> its value.**

| Quantity | Vietnamese | English-style leak |
|---|---|---|
| one hundred thousand đồng | **100.000 ₫** | **100,000₫** |
| one thousand two hundred thirty-four point five six seven | **1.234,567** | **1,234.567** |

### 5b. Format patterns — read them correctly or you will invert the rule

| Pattern | Value (quoted) | Renders for `vi` as |
|---|---|---|
| Decimal standard | **`"#,##0.###"`** | **1.234,567** |
| Percent standard | **`"#,##0%"`** | **85%** — **no space before the percent sign** |
| Currency standard | **`"#,##0.00 ¤"`** | **1.234,00 ₫** — **symbol after the number, with a space** |

In CLDR pattern syntax the `,` and `.` inside a pattern are **placeholders**, replaced at format time
by the locale's `group` and `decimal` symbols. A reader who takes `#,##0.###` at face value will
conclude the opposite of the truth.

**Percent corroboration from Vietnamese business journalism:** **"giảm 51% so với cùng kỳ năm
ngoái"**, **"tăng gần 4% trong quý II so với năm ngoái"** — the sign is attached directly to the
digits.

- ✅ **Độ chính xác đạt 85%.**
- ❌ **Độ chính xác đạt 85 %.** — ⚠ rule-derived from the CLDR pattern and the press corroboration

### 5c. Currency — đồng, and why the decimals are dead

From `cldr-numbers-full/main/vi/currencies.json`:

| Field | Value (quoted) |
|---|---|
| VND `displayName` | **"Đồng Việt Nam"** |
| VND `displayName-count-other` | **"đồng Việt Nam"** |
| VND `symbol` / `symbol-alt-narrow` | **"₫"** |
| USD `symbol` | **"US$"** (narrow `"$"`) · EUR `symbol` **"€"** |

**The symbol, from the Unicode character database:** **₫ = U+20AB**, name **"DONG SIGN"**,
General_Category **"Currency_Symbol"**, Script **"Common"**.

**Note the capitalization split in CLDR** — **"Đồng Việt Nam"** capitalized as a standalone display
name, **"đồng Việt Nam"** lowercase when counted after a number. That is a real distinction, not
noise.

**Placement: after the number, with a space**, per the `#,##0.00 ¤` pattern and independently
confirmed — "In Vietnam, amounts are typically written with the symbol after the number".

**Subunits are dead.** 1 hào = 1/10 đồng and 1 xu = 1/100 đồng are both "unused in Vietnam for
several decades" through inflation, and "As of 2022, no coins are used."

> **So VND has an effective **zero** decimal places in practice, even though the CLDR standard
> currency pattern shows `.00`.** For a site quoting prices or figures, write **250.000 ₫**, not
> **250.000,00 ₫**.

**In running text Vietnamese journalism prefers the word to the symbol, and magnitude words to digit
strings:** **"526 tỷ đồng"**, **"130 tỷ USD"**, **"120 USD mỗi thùng"**.

### 5d. Dates and times — day first, 24-hour clock, and no month names to translate

From `cldr-dates-full/main/vi/ca-gregorian.json`:

| Format | Pattern (quoted) | Example |
|---|---|---|
| Date full | **`"EEEE, d MMMM, y"`** | Chủ Nhật, 26 tháng 7, 2026 |
| Date long | **`"d MMMM, y"`** | 26 tháng 7, 2026 |
| Date medium | **`"d MMM, y"`** | 26 thg 7, 2026 |
| Date short | **`"d/M/yy"`** | 26/7/26 |
| `yMd` / `Md` | **`"d/M/y"`** / **`"d/M"`** | 26/7/2026 · 26/7 |
| Time short / medium | **`"HH:mm"`** / **`"HH:mm:ss"`** | 14:30 |
| DateTime, all widths | **`"{0} {1}"`** | |

> **🔴 Day first, always — `d/M/y`, never `M/d/y`.** `03/04/2026` is **April 3** in Vietnamese and
> March 4 in American English. It is silently wrong and never caught by review. **Prefer the
> unambiguous `d MMMM, y` form over numeric dates wherever space allows.**

**24-hour clock is the CLDR default.** Day periods exist but are secondary: AM = **"SA"**,
PM = **"CH"** (abbreviations of *sáng* and *chiều*). Eras: BCE = **"TCN"**, CE = **"SCN"**.

**Months are the word *tháng* plus a number** — **tháng 1 … tháng 12**, abbreviated **thg 1 …
thg 12**.

> **Vietnamese has no month names. There is nothing to translate.** A translator "translating"
> *January* into anything other than **tháng 1** is a red flag. Note the consequences for sorting,
> string matching, and any UI that assumed alphabetic month labels.

**Days of the week:** **Chủ Nhật, Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy**; abbreviated
**CN, Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7**. The system is **ordinal** — *Thứ Hai* is literally
"the second", Monday — **Sunday is the first day** and the only one with a name rather than a
number. The abbreviated forms keep the word `Thứ` and switch to digits, which is unusual, and `CN`
breaks the pattern entirely.

### 5e. Large-number words — the system is not English's

> **"For numbers up to one million, native Vietnamese terms are often used the most, whilst mixed
> Sino-Vietnamese origin words and native Vietnamese words are used for units of one million or
> above."** — <https://en.wikipedia.org/wiki/Vietnamese_numerals>

| Value | Word |
|---|---|
| 1 000 | **nghìn** (Northern standard) / **ngàn** (Southern) |
| 1 000 000 | **triệu** |
| 10⁹ | **tỷ** |
| 10¹² | **nghìn tỷ** |
| 10¹⁵ | **triệu tỷ** |
| 10¹⁸ | **tỷ tỷ** |

with **mười triệu** and **trăm triệu** formed compositionally. **Vietnamese has no distinct word for
10¹²** — English *trillion* does **not** map to a single Vietnamese word; the system composes
`nghìn tỷ` and stacks up to `tỷ tỷ`. On the regional split, the source frames **nghìn** as "the
standard word in Northern Vietnam, whilst ngàn is the word used in the South" — see §9b.

**Vietnamese prose prefers magnitude words to digit walls**, which is directly useful for a platform
discussing parameter counts and dataset sizes: prefer **175 tỷ tham số** over a wall of digits and
group separators. ⚠ Note `tỷ` / `tỉ` is itself one of the i/y variants of §3h and must follow the
same house call.

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/vi/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/vi/currencies.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/vi/ca-gregorian.json> ·
<https://util.unicode.org/UnicodeJsps/character.jsp?a=20AB> ·
<https://en.wikipedia.org/wiki/Vietnamese_numerals> · <https://en.wikipedia.org/wiki/Vietnamese_dong>
(⚠ also the source of the English-grouping trap in §5a) ·
<https://vi.wikipedia.org/wiki/Người_Việt_hải_ngoại> · <https://vnexpress.net/kinh-doanh>

---

## 6. Terminology strategy

### 6a. 🔑 The sandwich pattern, already instantiated by Vietnamese technical writing

**The attested house pattern is: translate the term, then gloss the English in parentheses on first
use.** It is directly observable in the fetched corpus — **lớp đầu vào (input layer)**,
**trọng số (weight)**, **hàm kích hoạt (activation function)**, **thuật toán lan truyền ngược
(backpropagation)**, **Học máy (tiếng Anh: Machine learning)**. The fetch's own summary: "The
article consistently pairs Vietnamese terms with English equivalents in parentheses, reflecting
standard technical documentation conventions."

This **is** the kit's terminology sandwich from [translation-quality](../translation-quality.md),
already in use by the target language. Use it; do not invent a different convention.

| Convention | Correct | Wrong |
|---|---|---|
| Vietnamese term with an English gloss | **lớp ẩn (hidden layer)** | **hidden layer (lớp ẩn)** — English first inverts the pattern and the register |
| How often | Gloss **once per page, on first mention** | Gloss on every occurrence — turns prose into a glossary |

### 6b. What stays English outright

- **Acronyms** — AI, LLM, GPU, RBM, CNN, LSTM — kept as-is, with the expansion glossed
  (**viết tắt là AI**).
- **transformer** — "Kept untranslated as 'transformer' or 'kiến trúc transformer'".
- **token** — "The English term 'token' is used untranslated in technical contexts".

**Recommendation, grounded in the above:** translate concepts, keep acronyms and architecture names,
gloss in parentheses on first mention per page, never gloss twice.

### 6c. Seed vocabulary — the field's standard terms, as actually attested

All rows are **community-tier** (the Vietnamese-language encyclopedia). See §6e: no official or
academic Vietnamese AI-terminology standard was reachable, so every one of these is convergence, not
compliance.

| English | Vietnamese |
|---|---|
| artificial intelligence | **trí tuệ nhân tạo** |
| machine learning | **học máy** |
| deep learning | **học sâu** (also **học cấu trúc sâu**) |
| artificial neural network | **mạng nơ-ron nhân tạo** / **mạng thần kinh nhân tạo** — ⚠ see below |
| large language model | **mô hình ngôn ngữ lớn** (LLM retained) |
| algorithm | **thuật toán** |
| model | **mô hình** |
| training data | **dữ liệu huấn luyện** |
| dataset | **tập dữ liệu** |
| to train | **huấn luyện** (also **đào tạo**) |
| supervised learning | **học có giám sát** |
| unsupervised learning | **học không giám sát** |
| reinforcement learning | **học tăng cường** |
| input layer / hidden layer / output layer | **lớp đầu vào** / **lớp ẩn** / **lớp đầu ra** |
| weight | **trọng số** |
| activation function | **hàm kích hoạt** |
| backpropagation | **lan truyền ngược** |
| feature | **đặc trưng** (also **đặc điểm**) |
| accuracy | **độ chính xác** |
| pre-training | **huấn luyện trước** |
| fine-tuning | **tinh chỉnh** |
| hallucination | **ảo giác** |
| prompt | **lời nhắc** |
| prompt engineering | **kỹ thuật gợi ý** |
| big data | **dữ liệu lớn** |

> ⚠ **`máy học` could not be sourced at all.** The article title for it returned **HTTP 404**, and
> the fetch of the *Học máy* article reported that the variant "does not appear in the lead
> section". **Do not use `máy học`, do not list it as an accepted synonym, and do not claim it
> circulates.** Until a native reviewer confirms or rejects it, **học máy** is the form — it is
> solidly attested.

> ⚠ **`mạng thần kinh nhân tạo` vs `mạng nơ-ron nhân tạo` — both attested, primacy unclear.** One
> fetch reported *thần kinh* as the primary term with *nơ-ron* as an alternative redirect; yet the
> reachable article title was the *nơ-ron* one, and a third article uses *thần kinh* predominantly.
> **Three spellings circulate:** **nơ-ron** (hyphenated transliteration), **neuron** (raw Latin),
> **thần kinh** (Sino-Vietnamese calque, literally "nerve"). **Pick one, put it in the term sheet,
> and enforce it.** ⚠ Craft, unsourced: `thần kinh` reads more naturalized, `nơ-ron` more
> technical-modern.

### 6d. Loanwords — the phonological rule is clear, the hyphen is not

> **"Cách phát âm của các từ mượn cần phải phù hợp với hệ thống ngữ âm tiếng Việt"** ·
> **"Trong tiếng Việt chúng được nói như thế nào thì ghi lại bằng chữ quốc ngữ đúng như thế"**
> — <https://vi.wikipedia.org/wiki/Từ_mượn_trong_tiếng_Việt>

**The hyphenation is genuinely unsettled** — the same source documents **three coexisting
conventions for the same word**: syllables written **connected** (`vali`), **separated with spaces**
(`va li`), or **hyphenated** (`va-li`). Attested across the three styles: **cà phê**, **xà phòng**,
**ti vi**, **in-tơ-nét**.

> **There is no rule to follow here; there is only a house style to declare.** `nơ-ron` sits
> alongside `neuron` and would equally admit `nơ ron`. **Record the decision in the term sheet, not
> in a reviewer's head.**

**The countervailing trend is to keep the original.** The editorial manual: **"tên riêng và địa danh
nước ngoài nên được giữ như nguyên gốc (theo tiếng Anh hoặc ngôn ngữ tương đương)."** The title
convention goes further, prioritizing the *original language* over English and over Sino-Vietnamese
transliteration — **Roma** over "Rome", **Moskva** over **Mạc Tư Khoa** — and **preserving foreign
diacritics**: **"Céline Dion"** not "Celine Dion", **"Orbán Viktor"** not "Orban Viktor".

> 🔑 **Vietnamese practice is to preserve other languages' diacritics.** That is culturally
> consistent — a language this dependent on diacritics does not strip anyone else's — and it is a
> direct instruction for the name fields in this platform: **never ASCII-fold a foreign name.**

Transliteration is gated, not free: added transliterations are only permitted "after satisfying one
of specific conditions" — Sino-Vietnamese terms with historical documentation, or officially
documented modern transliterations with ten or more years of academic use.

### 6e. ⚠ No official terminology standard is reachable

**None was found.** No Vietnamese national standard on AI terminology (for example a national
adoption of the international AI-concepts vocabulary) could be located; the national standards
portal URL could not be constructed without a search engine, the science-and-technology ministry
host refused the connection, the international standards organization returned 403, and the
government portal homepage contained **no occurrence of "trí tuệ nhân tạo"** at all.

> **State this plainly wherever the terminology is questioned: Vietnamese AI terminology has no
> reachable official standard and rests on encyclopedic, academic, and industry convergence.**
> Every term in §6c is therefore a **house decision backed by attestation**, not a compliance
> requirement — and the term sheet, not this guide, is where each one becomes binding.

### 6f. Vendor, model, and product names

**Withheld.** Handling of vendor, model, and product names belongs to the **industry glossary**, which
is deliberately not reproduced in this public kit. The research withheld it; this guide keeps it
withheld. The only naming rules reproduced here are the *language* rules of §6d: keep the original
form, preserve its diacritics, and do not transliterate without meeting the documented conditions.

Sources: <https://vi.wikipedia.org/wiki/Trí_tuệ_nhân_tạo> · <https://vi.wikipedia.org/wiki/Học_máy> ·
<https://vi.wikipedia.org/wiki/Học_sâu> · <https://vi.wikipedia.org/wiki/Mạng_nơ-ron_nhân_tạo> ·
<https://vi.wikipedia.org/wiki/Mô_hình_ngôn_ngữ_lớn> ·
<https://vi.wikipedia.org/wiki/Từ_mượn_trong_tiếng_Việt> · <https://vi.wikipedia.org/wiki/Wikipedia:Tên_bài> ·
<https://vi.wikipedia.org/wiki/Wikipedia:Cẩm_nang_biên_soạn> · <https://chinhphu.vn/>

---

## 7. Idiom anti-patterns

> 🔴 **Read this section with its label on. Everything in the table below is craft judgment and
> unsourced.** No EN→VI idiom reference was fetchable. The Vietnamese renderings reuse vocabulary
> attested elsewhere in this guide where possible, but **no source attests these specific
> equivalences, and no source attests that the "why the calque fails" column describes real observed
> errors.** Per the correct-form-only rule, treat the middle column as **a proposal for native
> review** and the right column as **illustrative reasoning** — never as documented error data, and
> never as a lint rule.

The only sourced element here is the definition of the category itself: **"Thành ngữ là những từ
không nhằm mục đích để hiểu theo nghĩa thông thường, đồng thời ý nghĩa của một thành ngữ thường là
câu mang nghệ thuật ẩn dụ trong toàn bộ câu."**

| English phrasing common in edu-tech prose | ⚠ Proposed Vietnamese (unsourced) | ⚠ Why the word-for-word calque fails (unsourced) |
|---|---|---|
| "Let's dive into…" | *Chúng ta cùng tìm hiểu…* | A literal *dive* reads as physical swimming; the metaphor does not transfer |
| "under the hood" | *cách hoạt động bên trong* | The literal rendering names a car part; no established figurative use |
| "a black box" | *hộp đen* | This one likely **does** transfer (the aviation sense is international) — **flag for native confirmation rather than replacing** |
| "rule of thumb" | *nguyên tắc chung* | The literal thumb is meaningless; the origin metaphor is opaque even in English |
| "state of the art" | *tiên tiến nhất* / *hiện đại nhất* | The literal rendering reads as art criticism |
| "garbage in, garbage out" | needs a gloss, not an idiom | A calque is comprehensible but flat; better to state the principle — bad input data produces bad results |
| "training a model from scratch" | *huấn luyện mô hình từ đầu* | "from scratch" contains no scratch; *từ đầu* is the working sense |
| "cutting-edge" | *tiên tiến* | The literal rendering is a blade |
| "at a high level" (= broadly) | *một cách tổng quan* | The literal rendering reads as altitude or seniority — a real ambiguity, since *cao* is spatial |
| "you get the hang of it" | *bạn sẽ quen dần* | "hang" is untranslatable; the sense is habituation |
| "keep in mind that…" | *Lưu ý rằng…* | Calquing "hold in the head" is odd; *lưu ý* is the standard textual signal |
| "it boils down to…" | *tóm lại là…* | Literal boiling is culinary |

> **The one structural point that IS grounded**, and it is worth more than the whole table: English
> edu-tech prose is dense with **metaphorical premodifiers** — "cutting-edge techniques",
> "black-box models", "high-level overview". §4b establishes with sources that Vietnamese is
> head-initial and modifier-final, so these have to be **unpacked and re-ordered, not mapped**.
> **That is the real, sourced reason word-for-word idiom transfer fails in this pair**, independently
> of whether any individual row above survives native review.

- ✅ **Chúng ta cùng tìm hiểu cách một mô hình học từ dữ liệu.** — ⚠ unsourced proposal
- ❌ **Chúng ta cùng lặn vào cách một mô hình học từ dữ liệu.** — ⚠ illustrative reasoning only, not
  a documented error: the physical-swimming reading

Sources: <https://vi.wikipedia.org/wiki/Thành_ngữ> · <https://vi.wikipedia.org/wiki/Ngữ_pháp_tiếng_Việt> ·
<https://en.wikipedia.org/wiki/Vietnamese_grammar>

---

## 8. Simplified-language pendant (`vi-easy`)

### 8a. ⚠ No Vietnamese plain-language standard was located

**Honest negative finding, stated as "not found" rather than "does not exist".**

- The international standard exists — **"ISO 24495-1:2023: Plain language – Part 1: Governing
  principles and guidelines"**.
- The survey of countries with plain-language laws or standards names the United States, Canada,
  France, Israel, the European Union, Germany, and several US states. The explicit finding of the
  fetch: **"Vietnam: Vietnam is not mentioned anywhere in this article."**
- The standards organization's own catalog page returned **HTTP 403**, so **no check for a
  Vietnamese national adoption was possible**.

> ⚠ **This is a "could not find", not a "does not exist".** The research ran without a search tool
> and Vietnamese government hosts were largely unreachable (§2b). **A human should check for a
> national adoption of ISO 24495-1 and for accessibility provisions in Vietnam's disability
> legislation before this guide asserts absence.**
>
> **Consequence: `vi-easy` inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). Under the authoring directive that is a
> legitimate, complete answer — not a gap to fill with invented local norms.

### 8b. 🔴 The obvious simplification axis is the dangerous one

The natural axis for a Vietnamese easy-language variant is **Hán-Việt → thuần Việt**
(Sino-Vietnamese → native). **§4f establishes, in the source's own words, that this swap is not
reliably a simplification:**

> **"các từ thuần Việt trong ví dụ này cho cảm giác thô tục, ghê sợ hoặc đau đớn còn các từ Hán-Việt
> tạo cảm giác lịch sự, trung hòa"** — <https://vi.wikipedia.org/wiki/Từ_thuần_Việt>

**The native word is often the blunt, visceral one; the Sino-Vietnamese word is the polite, neutral
one.** A mechanical Hán-Việt→thuần-Việt pass over an educational text would make it **cruder, not
clearer**. And the underlying heuristic — "hard word = Sino-Vietnamese" — is itself unsound, because
the old and nativized Sino-Vietnamese strata are **"những từ ngữ thường dùng hằng ngày, nằm trong
lớp từ vựng cơ bản của tiếng Việt"**.

### 8c. The sourced register pairs — evidence of an axis, **not** a substitution list

| Hán-Việt (formal / learned) | Thuần Việt (everyday) |
|---|---|
| xuất huyết | **chảy máu** |
| từ trần | **chết** |
| thổ | **nôn** |
| hôn nhân | **đám cưới** |
| phụ nữ | **đàn bà** |
| phụ lão | **người già** |
| vị | **mùi** |
| phụ | **vợ** |

> 🔴 **Read the caveat before using this table.** The source presents several of these pairs
> **specifically to illustrate that the native form is coarser**. `từ trần` → `chết` and
> `phụ nữ` → `đàn bà` are exactly that: the native word is blunter, and `đàn bà` can read as
> disrespectful where `phụ nữ` is neutral. **This table is evidence that the axis exists. It is not
> a replace-left-with-right list, and a script must never be pointed at it.**
>
> **This is eight rows, not the ten the template asks for. It is not padded.**

**A second source makes the heuristic behind the swap look worse still: much of the *everyday* layer
is itself Chinese-derived, just from an older stratum.** The encyclopedia's article on Hán-Việt
prints a comparison table headed **"Ví dụ về các từ tiếng Hán vay mượn"** whose two right-hand
columns are **"Từ Hán Việt cổ"** (Old Sino-Vietnamese) and **"Từ Hán Việt"** (Sino-Vietnamese) —
that is, both members of each doublet are borrowings:

| Old Sino-Vietnamese — reads as ordinary Vietnamese | Sino-Vietnamese — reads as learned |
|---|---|
| **mùi** | **vị** |
| **vốn** | **bản** |
| **việc** | **dịch** |
| **mũ** | **mão** |
| **giày** | **hài** |
| **vợ** | **phụ** |
| **lạy** | **lễ** |
| **phép** | **pháp** |

and the same article lists further everyday words as Old Sino-Vietnamese readings: **tươi** (against
*tiên*), **bố** (against *phụ*), **xưa** (against *sơ*), **búa** (against *phủ*), **khéo** (against
*xảo*), **buồn** (against *phiền*). The thuần-Việt article adds **giếng-tỉnh, góc-giác,
bánh-bính**, and a set of Chinese-derived words that are simply not read with Hán-Việt
pronunciation at all: **rồng – long; sức – lực, xin – thỉnh**.

> ⚠ **Do not mine that table for substitutions.** It is **diachronic, not synonymic**: `pháp` and
> `phép`, or `lễ` and `lạy`, are different modern words with different meanings, not a formal and a
> plain way of saying one thing. It is quoted here for exactly one purpose — **it destroys the
> premise that "Sino-Vietnamese" and "hard" are the same category.** Two of vi's most ordinary
> words, **vợ** and **việc**, sit in the borrowed column.

**And the thuần-Việt article states outright why the pairs a `vi-easy` course needs do not exist.**
Native vocabulary is characterized as everyday-communication vocabulary, and then:

> **"Điều đó làm cho chúng không thể dùng để biểu thị các sắc thái nghĩa trang trọng hay khái
> quát."** — <https://vi.wikipedia.org/wiki/Từ_thuần_Việt>

("That makes them unusable for expressing formal or **general/abstract** shades of meaning.")
**The gap in abstract vocabulary is therefore not a research failure — the source explains it.**
Vietnamese built its abstract and technical layer out of Sino-Vietnamese *because* the native layer
does not reach that far. **This narrows the declared gap rather than closing it:** there is a
sourced reason no thuần-Việt equivalents exist for `thuật toán`, `mô hình` or `dữ liệu`, which is
also the sourced reason §8d keeps them.

### 8c-ii. The measured register contrast — evidence per row

**What §8c above could not supply was evidence for any individual row.** This supplies it, for a set
of pairs chosen to be **topic-independent** (connectives, light verbs, degree words) so that a
difference reflects register rather than subject matter.

| Corpus | What it is | Size |
|---|---|---|
| **Plain** | **Thiếu niên Tiền phong và Nhi đồng**, the national children's and teenagers' newspaper | 277 articles, **198,629 word tokens** |
| **Official** | **Báo Chính phủ**, the Government's own e-newspaper | 188 articles, **184,423 word tokens** |

Both fetched 2026-07; counts normalized **per 100,000 word tokens**. Recurring boilerplate
(masthead, app promotion) was removed before counting. **Dictionary** rows additionally carry an
etymology and gloss from an open collaborative Vietnamese dictionary — **Community tier; no official
Vietnamese lexical authority was reachable (§2c, §2e).**

⚠ **The left column is "formal / learned", not "Hán-Việt".** Sino-Vietnamese origin is asserted only
where the dictionary entry actually carries an etymology — **gia tăng** (加增) below, and
**sử dụng** (使用), **giáo viên** (教員), **yêu cầu** (要求), **phụ huynh** (父兄) in §8c-iii. For
**hỗ trợ**, **phương pháp**, **quốc gia**, **vô cùng**, and **nhận thức** the entries fetched carry
**no etymology**, so this guide does not claim one; their place in the table rests on the
**measurement alone**.

| Formal / learned | Everyday | Evidence | Tier |
|---|---|---|---|
| **gia tăng** | **tăng** | gia tăng **36.9 official vs 7.6 children — a 4.9× official skew**, the cleanest single marker found; tăng runs 106.2 / 279.8. Sino-Vietnamese 加增, glossed *"Nâng cao lên, thêm vào"* | **Dictionary + Corpus** |
| **hỗ trợ** | **giúp** | **giúp 124.9 children vs 51.0 official — 2.4× plain skew**; hỗ trợ leans the other way, 102.2 / 126.9. The dictionary glosses hỗ trợ with the plain word itself: *"Giúp đỡ nhau, giúp thêm vào"* | **Dictionary + Corpus** |
| **do đó** / **vì vậy** | **nên** | **nên 96.7 children vs 27.1 official — 3.6×**. The learned connectives stay flat and low: do đó 3.0 / 4.9, vì vậy 22.7 / 21.1 | **Corpus** |
| **phương pháp** | **cách** | cách **187.3 children vs 110.1 official**; phương pháp 13.1 / 6.0. The dictionary defines phương pháp using the plain word: *"Lề lối và cách thức phải theo…"* | **Dictionary + Corpus** |
| **quốc gia** | **nước** | nước 325.7 / 483.7 against quốc gia 94.1 / 149.1 — **nước is 3.5× commoner than quốc gia in children's text** | **Corpus** |
| **vô cùng** | **rất** | rất **69.0 children vs 42.3 official**; vô cùng 9.6 / 2.7 | **Corpus** |
| **nhận thức** | **hiểu** | hiểu **42.8 children vs 17.4 official**; nhận thức 18.1 / 7.0 | **Corpus** ⚠ both lean plain; the ratio, not the direction, carries the row |

> ⚠ **Caveats, stated as plainly as the numbers.** (1) **Topic drift is real** — the government
> paper writes about finance and administration, the children's paper about school, so any
> *content* word (`doanh nghiệp`, `thí sinh`) measures subject matter, not register. That is why
> only function-ish vocabulary is tabled. (2) **The children's paper is written by adult
> journalists**, not graded for reading level; it is the closest reachable plain-register corpus,
> not a plain-language corpus — none was located (§8a). (3) **Frequency is not comprehension.**

### 8c-iii. 🔴 Do NOT "simplify" these — six swaps the measurement kills

**This is the more useful half of the measurement.** Every row below is a substitution that
"Hán-Việt = hard, thuần Việt = easy" recommends, and that the corpora refute.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**giáo viên** → **người dạy học**~~ | The thuần-Việt article offers *người dạy học* as a **definition of what thuần Việt means**, not as a usage recommendation — and the dictionary's own entry for giáo viên is itself *"Người dạy học ở bậc phổ thông"*. Measured: **giáo viên 50.3 per 100k in the children's paper against 4.9 in the government paper**. The children's paper uses the Sino-Vietnamese word ten times more than the state does. |
| ~~**phụ huynh** → **cha mẹ**~~ | phụ huynh is Sino-Vietnamese (父兄) and the obvious candidate for replacement — but it scores **19.1 in the children's paper against cha mẹ at 11.1**. The Hán-Việt form is the commoner one in writing aimed at children. |
| ~~**sử dụng** → **dùng**~~ | The single most tempting swap in Vietnamese, and it is wrong. sử dụng is Sino-Vietnamese (使用), glossed *"Dùng trong một công việc"* — and in the **children's** paper **sử dụng scores 127.4 against dùng at 65.4**. The learned form is twice as common in writing for children. |
| ~~**hiện nay** → **bây giờ**~~ | bây giờ scores **0.5 per 100k in both corpora** — it is spoken Vietnamese, near-absent from written Vietnamese of *either* register. hiện nay scores **20.1 in both**, identical. Swapping trades a written word for a spoken one and gains nothing. |
| ~~**đồng thời** → **cùng lúc**~~ | đồng thời **124.4 / 128.0**; cùng lúc **1.5 / 0.5**. The "plain" alternative is essentially unattested in edited writing. |
| ~~**yêu cầu** → **đòi hỏi**~~ | The dictionary defines yêu cầu as *"Sự đòi hỏi"*, which makes the swap look safe — but it defines **đòi hỏi** as *"Yêu cầu quá nhiều, quá cao"*, an *excessive* demand. **The substitution changes the meaning**, exactly the §8b failure mode in miniature. Measured: yêu cầu 70.5 / 100.9, đòi hỏi 6.5 / 6.0. |

> **→ The rule that follows, and it is the same shape as §8b's.** In Vietnamese, **do not simplify by
> etymology.** Simplify by **structure** (§8d), and make a lexical swap only where a *measured*
> register difference supports it — never because a word looks Sino-Vietnamese.

### 8d. 🔑 What `vi-easy` is built on — structure, not vocabulary; and the address inversion

> ⚠ **Craft judgment, unsourced — offered because the sourced material actively warns against the
> lexical approach (§8b), not because a Vietnamese source endorses the structural one.**

**Build `vi-easy` on structural simplification:** shorter sentences, one idea per sentence, explicit
subjects, active constructions, no stacked modifiers, and **glossing technical terms rather than
replacing them**.

**Keep the Sino-Vietnamese technical terms** — `trí tuệ nhân tạo`, `thuật toán`, `mô hình`. They are
the standard names of the things, and replacing them would leave the reader **unable to recognize
the concept anywhere else**. This is the kit's term-preservation rule, and it is unchanged here:
keep the technical term, explain it, never substitute a folksy stand-in.

> **🔴 The address inversion — flagged loudly because it is the opposite of the usual advice.**
>
> **`vi-easy` keeps `bạn` — and *reduces* the avoidance-by-construction of §4a.**
>
> 1. **Keep `bạn`.** Consistency across variants matters more than register tuning: a reader
>    switching between `vi` and `vi-easy` must not experience a change in who is speaking to them.
>    `bạn` is also the shortest, highest-frequency, and earliest-learned option — every alternative is
>    longer or rarer, which are exactly the wrong properties for an easy-language variant.
> 2. **Use *fewer* pronoun-free constructions, not more.** Easy language wants **explicit subjects**.
>    Where the base variant elegantly drops the pronoun for flow, `vi-easy` should say **bạn**
>    outright.
>
> ⚠ **This inverts the usual simplification instinct, so it is stated here explicitly: a translator
> or reviewer who "improves" `vi-easy` by removing the pronouns has made the text harder, not
> easier. Do not accept that change without a native-reviewer ruling.**

| Same instruction | `vi` (base) — avoidance is welcome | `vi-easy` — explicit subject preferred |
|---|---|---|
| Choose a model | **Hãy chọn một mô hình.** | **Bạn hãy chọn một mô hình.** |
| Now compare the results | **Sau đó so sánh kết quả.** | **Sau đó bạn so sánh kết quả.** |

⚠ Both columns are **craft**, built from the attested `bạn` and `hãy` forms of §4a; **no source
attests the `vi-easy` column specifically.**

Sources: <https://en.wikipedia.org/wiki/Plain_language> · <https://vi.wikipedia.org/wiki/Từ_thuần_Việt> ·
<https://vi.wikipedia.org/wiki/Từ_Hán-Việt> · <https://vi.wikipedia.org/wiki/Wikipedia:Chào_mừng> ·
**Plain corpus** — 277 articles of *Thiếu niên Tiền phong và Nhi đồng*, <https://thieunien.vn/>,
enumerated via <https://thieunien.vn/sitemap.xml> ·
**Official corpus** — 188 articles of *Báo Chính phủ*, <https://baochinhphu.vn/> ·
**Etymologies and glosses** — <https://vi.wiktionary.org/wiki/sử_dụng> ·
<https://vi.wiktionary.org/wiki/gia_tăng> · <https://vi.wiktionary.org/wiki/hỗ_trợ> ·
<https://vi.wiktionary.org/wiki/phương_pháp> · <https://vi.wiktionary.org/wiki/giáo_viên> ·
<https://vi.wiktionary.org/wiki/phụ_huynh> · <https://vi.wiktionary.org/wiki/yêu_cầu> ·
<https://vi.wiktionary.org/wiki/đòi_hỏi> · <https://vi.wiktionary.org/wiki/đồng_thời> ·
<https://vi.wiktionary.org/wiki/bây_giờ> (Community tier — an open collaborative dictionary; no
official Vietnamese lexical authority was reachable, §2c) ·
[accessibility-workflow](../accessibility-workflow.md)

---

## 9. Regional variation

### 9a. The three dialect regions, and the vocabulary pattern that matters

> **"chủ yếu có ba vùng phương ngữ chính: phương ngữ Bắc (Bắc Bộ), phương ngữ Trung (Bắc Trung Bộ),
> phương ngữ Nam (Nam Trung Bộ và Nam Bộ)"** — <https://vi.wikipedia.org/wiki/Phương_ngữ_tiếng_Việt>

The same source documents a systematic pattern worth internalizing: **many Vietnamese compounds are
built from two near-synonyms, and North and South each lexicalize a *different half* of the pair.**

**North takes the first element, South the second** — from the compounds **"thóc lúa, giẫm đạp, đón
rước, lừa gạt, sắc bén"**: North `thóc` / South `lúa`; North `giẫm` / South `đạp`; North `đón` /
South `rước`; North `lừa` / South `gạt`; North `sắc` / South `bén`.

**And the reverse** — from **"dơ bẩn, đau ốm, lời lãi, bao bọc, mai mối"**: South `dơ` / North `bẩn`;
South `đau` / North `ốm`; South `lời` / North `lãi`; South `bao` / North `bọc`; South `mai` /
North `mối`.

**Southern items that have already entered common Vietnamese** — **"các từ của tiếng Nam Bộ nhập vào
tiếng Việt chung là biểu hiện rõ nhất: bột giặt, kem giặt, gạch bông, bông tai, máy lạnh"**. These
are **not** regional markers any more and need no avoidance.

### 9b. ⚠ Which variety is the neutral written standard — no clean answer was sourced

**This guide does not manufacture one.**

- The dialect article was checked directly: **"The document does not explicitly identify which
  variety serves as the standard written language."**
- The English-language description addresses the **orthography's historical basis**, not a modern
  prestige norm: the 17th-century dictionary that founded the spelling system "reflects the
  pronunciation of the Vietnamese of Hanoi at that time", while the resulting written standard is
  "closer to the modern Saigon dialect than the modern Hanoi dialect".

> ⚠ **That last point is about the phonological correspondence of the spelling system, not about
> which region's vocabulary is the written norm. Do not conflate them** — it is an easy and
> confident-sounding mistake.

**What can be said with sourcing:** the education system and central state publishing operate in
Hanoi institutions (§2a), which is what drives kiểu mới and the school i/y convention; and **nghìn**
is described as **"the standard word"** against Southern `ngàn` — the closest thing to a neutrality
ruling on any regional pair that could be sourced.

> **🏠 House recommendation (craft, flagged as such).** Write the northern/central-state written
> standard for a neutral educational register: **nghìn**, not `ngàn`. Avoid the strongly
> region-marked halves of the pair lists in §9a where a neutral option exists. Accept the Southern
> items the source says have already merged into **tiếng Việt chung**. And keep technical vocabulary
> in its Sino-Vietnamese standard form — it is regionally neutral **because it is learned rather than
> inherited** (§4f).

### 9c. ⚠ Diaspora Vietnamese — demographics sourced, the lexical split is not

Roughly 5.3 million readers, US-dominant, with significant populations in Japan, South Korea,
Cambodia, Taiwan, France, Australia, Canada, and Germany. On language maintenance, the
Vietnamese-language source: **"việc duy trì tiếng Việt và giữ gìn bản sắc văn hoá dân tộc truyền
thống đang là thách thức lớn đối với tương lai của cộng đồng"**.

> 🔴 **The well-known claims about diaspora divergence could NOT be sourced** — that overseas
> Vietnamese, especially the US community, preserves pre-1975 Southern terminology, differs on
> political and administrative vocabulary, and diverges from post-1975 mainland coinages. **This is
> a real and consequential phenomenon for several million readers, and it is a declared gap. It is
> not written as fact here, and it must not be written as fact anywhere downstream until a native
> reviewer supplies it.**

⚠ One further caution inherited from the research: a quoted diaspora sentence came back from the
fetch layer with a non-idiomatic tail, almost certainly a truncation artifact of the summarizing
model. It is deliberately not reproduced. **Treat any Vietnamese string that reached you through a
summarizing layer as suspect** (§2d).

Sources: <https://vi.wikipedia.org/wiki/Phương_ngữ_tiếng_Việt> · <https://vi.wikipedia.org/wiki/Người_Việt_hải_ngoại> ·
<https://en.wikipedia.org/wiki/Vietnamese_numerals> · <https://en.wikipedia.org/wiki/Vietnamese_language> ·
<https://en.wikipedia.org/wiki/Overseas_Vietnamese>

---

