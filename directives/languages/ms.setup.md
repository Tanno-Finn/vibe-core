<!-- base -->
# lang-ms — Malay (Bahasa Melayu, Malaysian standard) — setup & sources

> **The translation guide itself is [`ms.md`](ms.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

Malay has a clean institutional stack with one unusual property: **the normative texts are printed
books, and the free web portal is a window onto them rather than a substitute.** Read §2c before
citing anything as "the rule".

### 2a. The bodies

| Body | Jurisdiction | Standing | Free online? |
|---|---|---|---|
| **Dewan Bahasa dan Pustaka (DBP)** | Malaysia | **Official, statutory** | Portal + PRPM free; the normative books are print |
| **MABBIM** — *Majlis Bahasa Brunei Darussalam–Indonesia–Malaysia* | tri-national | **Official, coordinating** | Term tables free, via the PRPM `d=115704` panel |
| **Dewan Bahasa dan Pustaka Brunei Darussalam** | Brunei | Official | ⚠ Site HTTP-only; HTTPS host returns 404 with an expired certificate |
| **Majlis Bahasa Melayu Singapura (MBMS)** | Singapore | Official | ⚠ **unverified** — see §9b |
| Indonesia's national language agency (KBBI, EYD) | Indonesia | Official **for `id`, never for `ms`** | Free |

**DBP's remit, verbatim** (<https://dbp.gov.my/objektif-penubuhan/>):

> **"Membina dan memperkaya bahasa kebangsaan dalam semua bidang termasuk sains dan teknologi."** ·
> **"Membakukan ejaan dan sebutan, dan membentuk istilah yang sesuai dalam bahasa kebangsaan."** ·
> **"Menggalakkan penggunaan bahasa kebangsaan yang betul."**
> Legal basis: **"Perlembagaan Persekutuan; Akta 213 – Akta Dewan Bahasa dan Pustaka, 1959 (Disemak
> 1978); Akta A930 Akta Dewan Bahasa dan Pustaka (Pindaan dan Peluasan 1995)"**

**MABBIM's membership, verbatim**
(<https://dbp.gov.my/majlis-bahasa-brunei-darussalam-indonesia-malaysia-mabbim/>):

> **"MABBIM ialah sebuah badan kebahasaan serantau yang dianggotai oleh tiga negara, iaitu Negara
> Brunei Darussalam, Indonesia dan Malaysia."** · **"Singapura telah ikut serta dalam Sidang ini
> sejak tahun 1985 sebagai negara pemerhati sehingga kini."**

### 2b. 🔑 PRPM — how to actually reach the evidence

**Pusat Rujukan Persuratan Melayu (PRPM)**, <https://prpm.dbp.gov.my/>, is DBP's public reference
portal and the single most productive source for `ms`. Its result panels are addressable directly:

```
https://prpm.dbp.gov.my/Cari1.aspx?keyword=<urlencoded>&d=<panel-id>
```

| `d=` | Panel | What it gives |
|---|---|---|
| `73980` | Kamus Bahasa Melayu | *Kamus Dewan* / *Kamus Komputer* / *Kamus Pelajar* entries — **and the `Id` sense label**, §6e |
| `115704` | **Istilah MABBIM** | five columns: *Istilah Sumber · Istilah Indonesia · Istilah Brunei · Istilah Malaysia · Bidang* |
| `175768` | **Khidmat Nasihat** | DBP's dated public language-advisory archive |
| `10456` / `243192` / `202792` | Artikel Majalah / Ensiklopedia / Buku | DBP corpus |

Two of these deserve to be named as the working authorities of this guide:

- **Istilah MABBIM (`d=115704`)** publishes the Indonesian, Bruneian, and Malaysian term for the same
  English source term **side by side**. It settles ms/id divergence questions with an Official source
  from the Malaysian side. Nothing else in the free web does this.
- **Khidmat Nasihat (`d=175768`)** is DBP answering the public in writing, **with dates**. It is
  normative in practice and is the only free, quotable route to rules that otherwise live in the
  print books. **Almost every rule in this guide traces to it.**

⚠ **PRPM result panels are paginated** (`1 2 3 … 10 …`) and the research read **page 1 only** for
each term. Longer term lists exist behind those pages; an absence found on page 1 is suggestive, not
conclusive, unless the query returned zero result tabs at all (§6c).

### 2c. ❌ The normative books were not read — and every book-derived rule here is second-hand

DBP's advisory answers repeatedly point at **four print books**. These are the actual normative
texts:

| Book | Governs | Page citations DBP itself gave |
|---|---|---|
| **Gaya Dewan** (Ed. 3 2005 / **Ed. 4**) | house style: punctuation, capitals, italics, numbers | quotes p. 125 (Ed. 4) / p. 77 (Ed. 3); italics p. 153; capitals p. 147; numbers pp. 161–162 (Ed. 4), pp. 87–94 (Ed. 3) |
| **Tatabahasa Dewan** (Ed. 3, DBP 2015) | grammar | affixes pp. 107–132, pp. 121–122; classifiers p. 106; passive pp. 411, 490; verb forms p. 67, pp. 150–217 |
| **Pedoman Ejaan dan Sebutan Bahasa Melayu** | spelling + pronunciation | cited in the 16.05.2018 answer |
| **Daftar Kata Bahasa Melayu Rumi–Sebutan–Jawi** | the Rumi↔Jawi↔pronunciation register | cited 18.10.2022, 20.11.2023 |

⚠ **None of the four could be fetched.** `https://dbp.gov.my/pedoman-dan-panduan-bahasa-melayu/`
renders navigation only and links **no PDFs**; `https://dbp.gov.my/pedoman-bahasa-melayu/` describes
only two *in-progress* projects — **"Penggubalan Pedoman Bahasa Melayu-Penjodoh Bilangan Bahasa
Melayu dan Penggubalan Pedoman Bahasa Melayu Akronim Bahasa Melayu."**

> **Binding consequence:** every rule in this guide that traces to *Gaya Dewan* or *Tatabahasa
> Dewan* is cited **at second hand, through DBP's own dated advisory answers**. That is a legitimate
> Official source and each has a verbatim, dated quote. **Do not write, or let a brief imply, that
> the books were read.** A human with a DBP bookshelf closes this gap and it is the single most
> valuable fix available to this guide.

### 2d. Unicode and locale data

- **Unicode Character Database** — <https://www.unicode.org/Public/UNIDATA/UnicodeData.txt>; every
  character name in this guide is verbatim from it.
- **CLDR, locale `ms`** — delimiters, characters, numbers, currencies, dates, plus the supplemental
  `plurals`, `weekData` and `measurementData` files. Fetched as raw JSON and read **by codepoint**,
  not through a summarizing layer. The `ms.xml` locale file marks nearly all number symbols as
  inherited (`↑↑↑`), i.e. **`ms` deliberately does not override root behavior** where it is silent.
- **CLDR, locale `id`** — fetched **only** to document the divergence in §5 and §9. It is never an
  authority for `ms`.

### 2e. Dead and blocked hosts

Recorded for method transparency, and because two of them are load-bearing gaps:

| Host | Result | Consequence |
|---|---|---|
| `mabbim.dbp.gov.my` | **DNS: ENOTFOUND** | MABBIM is reachable only through DBP's page and the PRPM `d=115704` panel |
| `https://www.dbp.gov.bn/` | **HTTP 404, expired certificate** | Brunei's authority reachable only at `http://www.dbp.gov.bn/Theme/Home.aspx`, a JavaScript-gated app; §9a claims stay thin |
| `https://www.languagecouncils.sg/mbms/ms` | **HTTP 404** (only `/en` exists) | No Singaporean remit statement fetched — §9b is ⚠ throughout |
| `https://www.jpm.gov.my/` | **timeout** | Part of the failed plain-language search, §8 |
| Indonesia's EYD rule pages | HTTP 200, **JavaScript-rendered bodies** | Indonesian rules here rest on **CLDR `id`** and the Indonesian dictionary, **not** on EYD |

Sources: <https://dbp.gov.my/objektif-penubuhan/> ·
<https://dbp.gov.my/majlis-bahasa-brunei-darussalam-indonesia-malaysia-mabbim/> ·
<https://dbp.gov.my/pedoman-dan-panduan-bahasa-melayu/> · <https://dbp.gov.my/pedoman-bahasa-melayu/> ·
<https://prpm.dbp.gov.my/> · <https://prpm.dbp.gov.my/Cari1.aspx?keyword=imbuhan+-kan+dan+-i&d=175768> ·
<https://www.unicode.org/Public/UNIDATA/UnicodeData.txt> ·
<https://raw.githubusercontent.com/unicode-org/cldr/release-48-2/common/main/ms.xml> ·
<http://www.dbp.gov.bn/Theme/Home.aspx>

---

## 3. Script & typography

*Housekeeping convention for this document: verbatim Malay citations are set in **bold** without
added quotation marks, so that the quotation characters you see inside a citation are the ones the
source itself served. Where a source's own straight or curly marks are the point, that is stated.*

### 3a. Rumi is the operative script

**Rumi (Latin) is the official script for Malay**, per DBP quoting the constitution:

> **"Tulisan rasmi bagi bahasa Melayu juga dinyatakan di dalam Artikel 152 sebagai rumi atau tulisan
> Latin. Walau bagaimanapun, penggunaan Tulisan Jawi tidak dilarang."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=tulisan+Jawi+rasmi&d=175768> (14.04.2014)

**The current spelling system** is *Sistem Ejaan Rumi Baharu Bahasa Malaysia*, in force since
August 16, 1972, and still current:

> **"Sistem ejaan Rumi yang digunakan sekarang ialah Sistem Ejaan Rumi Baharu Bahasa Malaysia yang
> dirasmikan penggunaannya pada 16 Ogos 1972."** (16.05.2018) · **"Sistem ejaan bahasa Melayu ialah
> sistem yang pada umumnya berdasarkan kaedah fonemik, iaitu unit-unit bunyi yang berfungsi sahaja
> yang dilambangkan dengan huruf."** (18.03.2013)
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=ejaan+rumi+baharu&d=175768>

**The alphabet carries no diacritics.** CLDR's exemplar set for `ms` is the bare 26-letter Latin
alphabet with an **empty auxiliary set**:

> `exemplarCharacters = [a b c d e f g h i j k l m n o p q r s t u v w x y z]` → U+0061 … U+007A ·
> `auxiliary = []` · `index = [A B C D E F G H I J K L M N O P Q R S T U V W X Y Z]`
> — `cldr-misc-full/main/ms/characters.json`

> **Rule: no acute, grave, circumflex, cedilla, or macron ever appears in normal `ms` running text.**
> There is one narrow exception, and it is **dictionary metalanguage, not orthography**: *Kamus
> Dewan* uses **é (U+00E9)** inside pronunciation brackets to mark the pepet/taling distinction —
> **"kereta [ke.ré.ta] | کريتا"** — and **ʔ (U+0294 LATIN LETTER GLOTTAL STOP)** likewise, as in
> **"budak [bu.daʔ]"**. Never carry either into body copy.

- ✅ **kereta** — as written in body copy
- ❌ **keréta** — the dictionary pronunciation form, leaked into prose

**Direction & tokenization.** LTR; words are whitespace-separated. Ordinary tokenization,
word-based highlighting, and default browser line-breaking are correct. No bidi, no shaping, no
word-segmentation engine. **Romanization is not applicable** — Rumi *is* Latin; there is no
transliteration layer to build or to keep out of the UI.

### 3b. Quotation marks — codepoints first

**Use the curly marks. The codepoints, from CLDR locale `ms`
(`cldr-misc-full/main/ms/delimiters.json`), with the Unicode names verbatim from UnicodeData.txt:**

| Level | Open | Close | Codepoints | Unicode names |
|---|---|---|---|---|
| Primary (double) | **“** | **”** | **U+201C** / **U+201D** | `LEFT DOUBLE QUOTATION MARK` / `RIGHT DOUBLE QUOTATION MARK` |
| Inner (single) | **‘** | **’** | **U+2018** / **U+2019** | `LEFT SINGLE QUOTATION MARK` / `RIGHT SINGLE QUOTATION MARK` |

- ✅ Malay: **“klik di sini”** — U+201C … U+201D
- ❌ Straight ASCII: **"klik di sini"** — U+0022 … U+0022
- ✅ nested, the inner pair inside the outer pair: **“istilah ‘rangkaian neural’ dalam ayat”**
- ❌ same string with an ASCII apostrophe as the inner mark: **“istilah 'rangkaian neural' dalam ayat”**

**DBP states the nesting rule itself** — single marks are for a quotation already inside a quotation:

> **"Terdapat dua tanda petik yang biasa digunakan dalam penulisan, iaitu tanda petik (“ ”) dan
> tanda petik tunggal (‘ ’). […] Tanda petik tunggal (‘ ’) pula, ialah biasanya digunakan dalam
> ungkapan atau ayat yang sudah diapit tanda petik. Untuk memahami dengan lebih mendalam, sila
> rujuk buku Gaya Dewan, Edisi Ke-4, halaman 125."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+petik&d=175768> (05.09.2023)

⚠ **DBP's own corpus is genuinely mixed, and you should expect that rather than be surprised by it.**
The 05.09.2023 answer above is served with the HTML entities `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;`
— byte-verified as U+201C, U+201D, U+2018, U+2019. Older answers (2007–2016) are typed with straight
`"` (U+0022) and `'` (U+0027); the 06.10.2016 statement of the same nesting rule reads **"Tanda
petik tunggal (' ') digunakan dalam ungkapan atau ayat yang sudah diapit tanda petik (" ")."**
**The rule is identical in both; only the typography differs.** CLDR's `ms` punctuation inventory
honestly lists both pairs. **The glyph authority for this kit is CLDR; DBP is the authority for what
the marks are *for*.**

### 3c. ⚠ Punctuation inside or outside the closing mark — three DBP rulings, three answers

**Do not expect a doctrine here; there is not one.** Four fetched answers, from the same advisory
archive, do not agree:

| Date | What DBP said | Effect |
|---|---|---|
| 29.07.2013 | **"Tanda petik diletakkan selepas tanda noktah."** | period **inside** |
| 14.10.2017 | **"…tanda koma sebelum penutup pengikat kata seperti dalam ayat yang berikut: "Bila sampai?" tanya Husin. "Kalau aku mati, kaujaga kuburku," kata Pak Ali."** | for reported speech, comma **inside** |
| 23.04.2020 | **"Jika penulisan dialog, didahului dengan tanda noktah dan diikuti tanda petik, manakala jika menulis sesuatu perkara, didahului dengan tanda petik dan diikuti dengan noktah."** | dialogue **inside**; other quoted material **outside** |
| 17.11.2011 | worked example: **"Saya benar-benar percaya kebenaran kata-kata mutiara "semua yang berlaku itu ada sebabnya"."** | non-dialogue, period **outside** |

> **🏠 House rule — this is a house rule, not DBP doctrine.** An educational web product has almost
> no fictional dialogue, so follow the *non-dialogue* pattern that the 23.04.2020 and 17.11.2011
> answers describe:
> **quoted term or phrase first, sentence punctuation outside the closing mark.** It is the branch
> DBP itself assigns to non-dialogue writing, it is internally consistent, and it is the one that
> does not corrupt interpolated software strings. Write it down in the style sheet as a decision;
> never present it as "DBP requires".
>
> - ✅ house rule: **Konsep ini dipanggil “rangkaian neural”.** — period after the closing mark
> - ❌ house rule violated: **Konsep ini dipanggil “rangkaian neural.”** — period pulled inside

### 3d. When *not* to use quotation marks — and the gloss pattern that matters most

> **"Tajuk atau judul buku, jenama dan nama lagu tidak perlu ditulis dengan tanda pengikat kata."**
> (17.03.2007) · and, on the names of well-known social platforms (07.10.2014): they take no
> quotation marks **"kerana ketiga-tiganya ialah laman sosial (nama khas)"** — *because they are
> proper names*.
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+pengikat+kata&d=175768>

**Foreign words take italics instead** — with an exception that is directly load-bearing for an
AI glossary:

> **"…huruf italik atau huruf condong boleh digunakan bagi perkataan bahasa asing yang terdapat
> dalam teks bahasa Melayu. Contohnya lingua franca, mala fide dan prima facie. Jika perkataan dalam
> bahasa asing tersebut berada dalam tanda kurung, sama ada dalam bentuk ayat lengkap atau rangkai
> kata yang menjadi padanan maksud sebelumnya, perkataan tersebut tidak perlu diitalikkan.
> Contohnya, suai pada (copy fitting), kebebasan seni (poetic license) dan kos sut (marginal cost)."**
> — same panel (05.09.2023)

> **🔑 The sanctioned Malay glossing pattern is `padanan Melayu (english term)` — Malay first,
> English in parentheses, and the parenthesized English is *not* italicized.** DBP's own dictionary
> headwords are built this way: `muat turun(download)`, `rangkaian neural(neural network)`,
> `sistem pakar(expert system)`. This is the kit's terminology sandwich (§6b) already instantiated
> by the language authority — use it, and do not invent a different convention.

| Convention | ✅ correct | ❌ wrong |
|---|---|---|
| Malay term with an English gloss | **rangkaian neural (neural network)** | **rangkaian neural (*neural network*)** — italicized inside the parentheses, which the rule exempts |
| Order of the pair | **sistem pakar (expert system)** | **expert system (sistem pakar)** — English first inverts pattern and register |
| A foreign phrase running loose in the sentence | *lingua franca*, italicized | lingua franca, left upright |

**Title case:** capitals go on proper nouns, sentence openings, and the start of direct speech
(**"Sila rujuk buku Gaya Dewan Edisi Ke-4, halaman 147."**). In a headline, function words such as
*yang* stay lowercase — DBP's own corrected headline: **"Apakah yang Perlu Anda Tahu Mengenai Ubat
Anda"**.

### 3e. The apostrophe — a spelling error in Malay words, a title marker in names

**In Arabic-derived common words the apostrophe is dropped, and writing it is a spelling error.**
DBP is unambiguous:

> **"Kesalahan ejaan, contohnya ejaan sharat sepatutnya syarat, ma’af sepatutnya maaf."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=imbuhan+-kan+dan+-i&d=175768> (15.02.2014)

Byte-level detail worth having: the apostrophe DBP typed in the *wrong* form is **’ (U+2019)** — a
right single quotation mark, not an ASCII apostrophe — and the corrected form **maaf** contains no
apostrophe of any kind, just two adjacent `a` (U+0061 U+0061).

- ✅ **maaf** · ✅ **syarat** · ✅ **darab** · ✅ **kadi** · ✅ **mudarat**
- ❌ **ma’af** · ❌ **sharat** · ❌ **dharab** · ❌ **kadhi** · ❌ **mudharat**

The same 1972 reform removed the Arabic digraph *dh*: **"Ejaan Rumi baharu yang huruf lamanya
terkandung "dh" menjadi "d" […] seperti dharab menjadi darab, kadhi menjadi kadi dan mudharat
menjadi mudarat."** (12.03.2024). Independent corroboration from locale data: the weekday is
**Jumaat** in CLDR `ms` — never *Jum'at*, which is the Indonesian-influenced/older form.

**Where the apostrophe survives:** gazetted proper names and royal titles. DBP distinguishes
**Dato'** from **Datuk** by conferring authority — **"Dato' ialah gelaran kebesaran yang dianugerah
oleh sultan negeri-negeri Melayu, manakala Datuk ialah gelaran kebesaran yang dianugerah oleh Yang
di-Pertuan Agong…"** (16.01.2010). Titles are data, not prose: **never normalize the apostrophe out
of a name field.**

**Terminology note:** the Malay name for the apostrophe character is **tanda koma atas** —
**"Perkataan "apostrophe" dalam bahasa Melayu diterjemahkan kepada tanda koma atas."** (01.06.2018).

### 3f. Jawi — documented, deliberately not shipped

**Status.** Jawi is not the official script and is not prohibited:

> **"Kini hanya tulisan rumi yang digunakan dalam sistem ejaan bahasa Melayu. Sistem ejaan Jawi masih
> digunakan, namun penggunaannya tidak meluas dalam persuratan Melayu mutakhir."** (13.11.2011)
> · **"…pihak DBP tidak mempunyai sebarang standard penulisan Jawi bagi surat rasmi."** (20.11.2023)
> · **"…pihak DBP tidak membuat semakan dokumen dalam tulisan Jawi."** (04.07.2025)
> · the orthography that does exist: **"…sistem tulisan dan ejaan Jawi yang digunakan sekarang ialah
> sistem yang termuat dalam buku Pedoman Ejaan Jawi yang Disempurnakan… Abjad Jawi bahasa Melayu
> sekarang mengandungi 37 huruf bentuk tunggal yang tersusun."** (07.11.2013)

> **Decision: ship `ms` in Rumi only.** Four sourced reasons: (1) Rumi is the constitutionally
> designated official script; (2) DBP itself says Jawi usage is **"tidak meluas"** in modern Malay
> writing; (3) DBP publishes **no** Jawi standard for official prose **and will not review** Jawi
> documents, so there is no authority to appeal to when a rendering is disputed; (4) Rumi→Jawi is
> not a solved 1:1 transform. **If Jawi is ever wanted, it is a separate hand-authored locale, never
> a script transform of `ms`.**

**The codepoints, for anyone who attempts it anyway.** Jawi lives in the **Arabic** block
(U+0600–U+06FF) plus **Arabic Extended-A**. The six letters added to the Arabic alphabet
specifically for Malay, with names verbatim from UnicodeData.txt:

| Glyph | Codepoint | Unicode name | Malay value |
|---|---|---|---|
| **چ** | **U+0686** | `ARABIC LETTER TCHEH` | *ca* |
| **ڠ** | **U+06A0** | `ARABIC LETTER AIN WITH THREE DOTS ABOVE` | *nga* |
| **ڤ** | **U+06A4** | `ARABIC LETTER VEH` | *pa* |
| **ݢ** | **U+0762** | `ARABIC LETTER KEHEH WITH DOT ABOVE` | *ga* |
| **ۏ** | **U+06CF** | `ARABIC LETTER WAW WITH DOT ABOVE` | *va* |
| **ڽ** | **U+06BD** | `ARABIC LETTER NOON WITH THREE DOTS ABOVE` | *nya* |

> **⚠ The KEHEH trap — the one thing naive Arabic-locale tooling gets wrong.** DBP prints the Jawi
> spelling beside every dictionary headword, and it writes Malay *k* with **ک U+06A9
> `ARABIC LETTER KEHEH`**, **not** with **U+0643 `ARABIC LETTER KAF`**. Extracted from the served
> bytes of **"kereta [ke.ré.ta] | کريتا"**: ک U+06A9 · ر U+0631 · ي U+064A · ت U+062A · ا U+0627.
> Together with **U+0762** (which most system Arabic fonts do **not** cover) these are the two
> codepoints that break a Jawi rendering silently.

Other DBP Jawi spellings extracted the same way, useful as test fixtures: **"percuma | ڤرچوما"**,
**"pejabat | ڤجابت"**, **"budak | بودق"**, **"banci | بانچي"**.

**Numerals inside Jawi text are Western Arabic digits, written left-to-right:**
**"…untuk penulisan nombor dalam Jawi, sama seperti penulisan nombor Rumi, iaitu 1, 2, 3, 4, 5, 6,
7, 8, 9. […] Oleh itu, penulisan nombor Jawi yang betul ialah 16 – 98 bukan ٩٨ – ١٦."** (04.07.2025)

### 3g. ⚠ Line breaking, hyphenation, and fonts — no Malaysian source found

**Honest negative finding.** No authoritative Malaysian statement on hyphenation, line-breaking, or
typeface selection for Malay was located, and none is invented here. What can be stated safely:

- `ms` in Rumi is plain Basic-Latin text; **no special line-breaking behavior is required** —
  standard Latin word-boundary breaking applies, and CLDR `ms` inherits root segmentation.
- The one real typographic hazard is the **hyphen in reduplication** — *kanak-kanak*,
  *sayur-sayuran*, *budak-budak*, *rumah-rumah*. These are single lexemes and a line break at that
  hyphen is undesirable. **⚠ DBP has no published rule on this that could be fetched — treat
  non-breaking handling as house style, not as a cited rule** (§10).
- Fonts: **⚠ no source.** Any complete Latin webfont covers running `ms`. If Jawi is ever shipped,
  an Arabic font with **Arabic Extended-A (U+0762)** coverage is required.

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=tulisan+Jawi+rasmi&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=ejaan+rumi+baharu&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+petik&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+pengikat+kata&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=imbuhan+-kan+dan+-i&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=apostrof&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=koma+di+atas&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768> ·
<https://prpm.dbp.gov.my/Cari1?keyword=kereta> · <https://prpm.dbp.gov.my/Cari1?keyword=budak> ·
<https://www.unicode.org/Public/UNIDATA/UnicodeData.txt> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/ms/delimiters.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/ms/characters.json> ·
<https://ms.wikipedia.org/wiki/Tulisan_Jawi> (⚠ community-tier, Jawi letter inventory only)

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes:** `lang="ms"` (base), `lang="ms-easy"` (simplified variant, per the
  header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage
  is WCAG 2.2 SC 3.1.1 / 3.1.2. `lang="ms"` also drives spellcheck and screen-reader voice
  selection.
- **🔴 Locale negotiation — block `ms` ⇄ `id` fallback explicitly.** Generic macrolanguage-aware
  fallback will serve Indonesian to Malaysian readers and vice versa. Given §5a, that alone corrupts
  every number on the page (§9c).
- **🔴 Number formatting — never reuse an `id` formatter.** `ms` is **decimal `.` (U+002E)** and
  **group `,` (U+002C)**; `id` is exactly inverted. Verify with a fixture: **1,234.5** must render
  from the same value that `id` renders as **1.234,5**.
- **🔴 Compact forms:** `ms` uses **`K` / `J` / `B` / `T`** with **no space**. An `id` string carrying
  `M` for 10⁹ is an order-of-magnitude bug in `ms` (§5b). Add a fixture for 4 000 000 000 → **4B**.
- **Plural rules:** `ms` has **only `other`**. Message-format branches for `one` / `few` / `many` are
  dead code and a sign the file was copied from another locale (§4d).
- **Time separator is a colon:** render `HH:mm` (`14:05`) per CLDR and the documented deviation in
  §5g. ⚠ `14.05` is **not** automatically an `id` leak — it is also DBP's own *penggunaan umum*
  form (§5g); it is wrong here only against this guide's documented deviation.
- **⚠ U+202F in 12-hour times:** CLDR's `ms` 12-hour skeleton separates the time from `PG` / `PTG`
  with **U+202F NARROW NO-BREAK SPACE**. A whitespace-normalizing build step will silently rewrite
  it; if you deliberately replace it with U+0020, do so as a decision and test the result.
- **Currency:** `RM` **immediately before** the amount, **no space** — `RM5`, `RM1,250.00`. Flag
  `RM 5`, trailing `RM`, and Indonesian-separator amounts. ⚠ `USD` in `ms` has the literal symbol
  string `USD`, not `$`.
- **Units take a space:** `7 km`, `2 GB` — unlike currency and percent, which are closed up (§5a).
- **Quotation marks:** normalize straight ASCII quotes in body copy to **“ ” (U+201C / U+201D)** with
  inner **‘ ’ (U+2018 / U+2019)**; confirm the shipped font carries all four.
- **Fonts:** ⚠ no sourced Malaysian guidance. Running `ms` is effectively **Basic Latin**, so any
  complete Latin webfont works. **If Jawi is ever attempted**, an Arabic font with **Arabic Extended-A
  (U+0762)** coverage is required — most system Arabic fonts lack it (§3f).
- **Index alphabet for glossary navigation:** plain **A–Z**, 26 letters, straight from CLDR's `ms`
  index set. No special collation, no diacritic folding needed.
- **Line breaking:** standard Latin word-boundary breaking; `ms` inherits root segmentation. ⚠ No
  sourced hyphenation rules for Malay — do **not** enable an automatic hyphenator you cannot verify.
- **🏠 Reduplication hyphens:** prefer non-breaking handling for *kanak-kanak*, *sayur-sayuran*,
  *rumah-rumah* — they are single lexemes. Craft judgment, not a cited rule (§3g).
- **Apostrophes are data in name fields:** `Dato'` is a distinct title from `Datuk`. Never normalize
  or strip the apostrophe out of names, even while flagging it inside ordinary words (§3e).
- **Calendar:** `firstDay` **mon** for `MY` (⚠ `sun` for `SG` if you ever serve Singapore); metric
  units throughout; date order **day–month–year**, `d MMMM y` for long dates.
- **No romanization step, and no script transform:** Rumi *is* Latin. **Jawi is a separate
  hand-authored locale if it is ever wanted — never a transform of `ms`** (§3f).

Sources: <https://unpkg.com/cldr-misc-full@48.2.0/main/ms/characters.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ms/numbers.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/ms/ca-gregorian.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/weekData.json> ·
<https://www.unicode.org/Public/UNIDATA/UnicodeData.txt> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=koma+di+atas&d=175768>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md). Ordered by yield.

- **🔴 Indonesian-vocabulary scan (§6f, §9c) — a plain string scan, and nothing else catches these.**
  Flag in `ms` content:
  - ❌ **`jaringan`** → ✅ **`rangkaian`** · ❌ **`perangkat lunak`** → ✅ **`perisian`**
  - ❌ **`pelatihan`** → ✅ **`latihan`** · ❌ **`kualitas`** → ✅ **`mutu`**
  - ❌ **`desain`** → ✅ **`reka bentuk`** · ❌ **`siklus`** → ✅ **`kitar`**
  - ❌ **`integritas`** → ✅ **`keutuhan`** · ❌ **`rekayasa`** → ✅ **`kejuruteraan`**
  - ❌ **`enkripsi`** → ✅ **`penyulitan`** · ❌ **`pemrosesan`** → ✅ **`pemprosesan`**
  - ❌ **`algoritme`** → ✅ **`algoritma`** · ❌ **`jaringan syaraf`** → ✅ **`rangkaian neural`**
  - ❌ **`biliun` / `triliun` / `delapan`** → ✅ **`bilion` / `trilion` / `lapan`**
  - ❌ **`Maret` / `Agustus` / `Desember` / `Juli`** → ✅ **`Mac` / `Ogos` / `Disember` / `Julai`**
    (⚠ the `ms` column is CLDR-verified; the `id` forms are unverified here — §5f)
- **🔴 Register check (§4a):**
  - Flag **capitalized `Anda`** anywhere except sentence-initially — it is the loudest Indonesian
    tell in the language. ⚠ Exempt title-case headings: DBP's own corrected headline writes
    **"Apakah yang Perlu Anda Tahu Mengenai Ubat Anda"** (§3d), so the check is not fully
    deterministic in headings.
  - Flag **`kamu`**, **`awak`**, **`engkau`**, **`kau`**, and the clitic **`-mu`** in default
    content — wrong register (and zero-occurrence in the measured institutional corpus).
  - 🏠 Flag **`anda` density** — house threshold, no source: more than one `anda` per two or three
    sentences suggests avoidance-by-construction was not applied.
- **🔴 `bisa` (§9c):** flag **every** occurrence in `ms` content. In Malay the first sense is *venom*;
  the intended word is almost always **`boleh`** or **`dapat`**. Worth running on its own.
- **🔴 Number and date formatting (§5):**
  - Flag **comma-as-decimal or dot-as-thousands** — `ms` is **dot decimal + comma grouping**
    (`1,234.5`, never `1.234,5`).
  - Flag a decimal with **no leading zero** — DBP requires `0.123`, not `.123`.
  - Flag **`HH.mm`** time rendering — `ms` uses the **colon** (§5g).
  - Flag **`RM` followed by a space**, **`RM` after the amount**, and Indonesian-separator ringgit
    amounts.
  - Flag a **space before `%`** — the percent sign is closed up.
  - Flag **`M`** as a compact suffix, and any compact suffix preceded by a space or U+00A0 (§5b).
  - Flag **`hb`** in dates (`15hb Mei`) — DBP-attested error — and any US month-first date.
- **Passive-voice check (§4c) — the highest-value editorial check.** Flag **`di-` + verb** occurring
  with a first- or second-person agent (`oleh anda`, `oleh saya`, `oleh kami`, `oleh kita`). The
  correct shape is `AGENT + bare stem`: **`yang ingin anda <stem>`**. This one needs a human to
  confirm each hit, but the grep makes it tractable.
- **`ialah` / `adalah` check (§4):** flag **`adalah`** immediately followed by a determiner-less noun
  phrase in definition sentences; definitions take **`ialah`**.
- **Affix checks (§4b):** flag the DBP-attested wrong forms **`mententeramkan`**, **`mengkagumkan`**,
  **`mengabai`**, **`menggelar`** (in the "to name" sense), **`mencantik`**, **`menjatuh`**,
  **`mendeklamasi`**. Flag any Malay verb built by concatenation in code or by a translator without
  a dictionary lookup.
- **Apostrophe check (§3e):** flag **U+2019** and **U+0027** inside Malay words — `ma’af` is
  DBP-attested as a spelling error, `jum’at` is the non-`ms` weekday form (§3e). **Whitelist name
  fields**, where `Dato'` is correct.
- **Diacritic check (§3a):** `ms` running text should be **effectively ASCII**. Flag **é (U+00E9)**
  and **ʔ (U+0294)** in body copy — both are dictionary metalanguage only.
- **Quotation codepoints (§3b):** in `ms` body copy, quotation marks must be **“ ” (U+201C / U+201D)**
  with inner **‘ ’ (U+2018 / U+2019)**. Flag **" (U+0022)** and **' (U+0027)**. ⚠ Note this is a **CLDR** rule: DBP's
  own corpus is mixed, so do not expect the source pages to model the glyphs.
- **Punctuation placement (§3c):** flag a period or comma **inside** a closing quotation mark in
  non-dialogue text. ⚠ This enforces the **house rule**, not DBP doctrine — say so in the check's own
  message, because DBP has ruled both ways.
- **Reduplication after a quantifier (§4d):** flag a numeral or quantifier (*tiga*, *beberapa*,
  *banyak*, *semua*) followed by a hyphen-reduplicated noun. 🏠 House rule.
- **Plural-branch check (§4d):** flag any `ms` message file containing `one` / `few` / `many` plural
  branches — `ms` has only `other`.
- **Terminology consistency (§6d):** where the term bank lists two Malaysian variants
  (*pengolahan data* / *pemprosesan data*, *bias agregasi* / *bias pengagregatan*), flag documents
  containing **both**.
- **Unsettled-term watch (§6c):** flag **machine learning**, **deep learning**, **dataset**,
  **large language model**, **big data** for human review — none has term-bank backing, so every
  rendering is a house decision that must match the term sheet.
- **Source-language leak scan (EN → MS):** left-in English function words (*the, and, you, please*),
  English-format numbers and dates surfacing in Malay text, English word order in compounds
  (*neural rangkaian*), and untranslated UI strings.

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=imbuhan+-kan+dan+-i&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=ayat+pasif&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penggunaan+anda&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=titik+perpuluhan&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+tarikh&d=175768> ·
<https://prpm.dbp.gov.my/Cari1?keyword=bisa> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ms/numbers.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/ms/delimiters.json>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** The dossier
was compiled without a web-search tool — every source was reached by constructing or discovering a
URL directly — which biases coverage toward institutions with predictable URLs (the Malaysian
language authority's reference portal, Unicode/CLDR) and against material findable only by search.
**§8 (plain language) and parts of §9 (Singapore, loanword layers) are thin for exactly that reason,
and each says so in place rather than filling the gap.**

**Carried through as open gaps** — none of these is closed by this guide, and each is marked ⚠ where
it appears: speaker numbers (§header); the four normative DBP books, all cited **second-hand**
through dated advisory answers (§2c); a Malaysian plain-language standard (§8a); Brunei's legal basis
for Jawi (§9a); the Singapore language council's remit (§9b); Indonesian month names (§5f); Malaysian
hyphenation, line-breaking, and font guidance (§3g); `ms-BN` / `ms-SG` CLDR variants; Sanskrit and
Portuguese loanword layers (§9d); the Malaysian AI-policy corpus in Malay; and the fact that PRPM
result panels are paginated and only page 1 was read (§2b).

**Deliberately withheld:** the industry glossary of model, product, and company names. The dossier
withheld it; this guide keeps it withheld. The only naming rules reproduced here are DBP's own
*language* rulings — that proper platform names take neither quotation marks nor translation, and
that **"Teks yang telah dicapdagangkan, dikekalkan seperti yang berdaftar."**

**Strong sections:** §3 typography, §4 grammar, §5 numbers (the ms/id inversion is verified from both
locales' raw data), §6 terminology where the term bank has entries, §9 on the ms/id boundary.
**Honest ❌ sections:** §8 (no plain-language standard located, no word table), §7a (five idioms with
no dictionary rendering), §6c (three headline AI terms verified absent from the term bank).
**Not reviewed by a native speaker.**
