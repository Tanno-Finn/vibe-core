<!-- base -->
# lang-id — Indonesian (bahasa Indonesia) — setup & sources

> **The translation guide itself is [`id.md`](id.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

**(Strong section — every authority below was fetched. One honest ❌.)**

Indonesian has an unusually clean institutional stack: one national agency, with three separate
public sub-portals that each serve a different layer of the norm.

- **Badan Pengembangan dan Pembinaan Bahasa ("Badan Bahasa")**, under the education ministry —
  governs everything: spelling, dictionary, terminology, grammar codification. ⚠ Its **national
  portal was unreachable** throughout the research (see the dead-link table below); the sub-portals
  below carry the primary normative content directly and were used instead.
- **EYD Edisi V** — *Ejaan Bahasa Indonesia yang Disempurnakan*, 5th edition. The **current**
  orthography norm, live and fetchable rule-by-rule at
  <https://ejaan.kemendikdasmen.go.id/eyd/>. **This is the linter spec.**
- **KBBI VI Daring** — *Kamus Besar Bahasa Indonesia*, 6th ed. online, at
  `kbbi.kemendikdasmen.go.id/entri/<word>`. Governs word existence, standard vs non-standard
  spelling, and **subject-field labels** (`Komp`, `Anat`, `Psi`, `cak`). A `Komp` label is how you
  tell a standardized computing coinage from a blog neologism. (Re-fetched 2026-07-26; the pages
  identify themselves as version `6.1.0.0-20260421183255`.)
- **PASTI** — *Padanan Istilah*, the official English→Indonesian term-equivalence database:
  **"Aplikasi Pasti memuat 172.216 istilah dari 59 ranah"**
  (<https://pasti.kemendikdasmen.go.id/history.php>). **First stop for any AI/ML term** (§6).
- **TBBBI** — *Tata Bahasa Baku Bahasa Indonesia*, 4th ed., the reference grammar. ⚠ It exists and
  is the standard citation, but **its record could not be fetched** (repository host down), so no
  claim in this guide rests on it.
- **Unicode UAX #14, Revision 55 (Unicode 17.0.0, 2025-09-05)** — the line-breaking algorithm
  (§3). <https://www.unicode.org/reports/tr14/>
- **Unicode CLDR 48.2 (2026-03-17)**, locale `id` — delimiters, numbers, dates (§3, §5).
  <https://cldr.unicode.org/index/downloads>
- **IANA Language Subtag Registry** (`File-Date: 2026-06-14`) and **ISO 639-3** — for tagging (§9).

### ⚠ 2a. The EYD / PUEBI recency trap — read this before writing any brief

**This is the single most consequential dating fact about Indonesian, and it is engineered to catch
you.** The current norm is **EYD Edisi V**, launched in **Jakarta on August 16, 2022**. It explicitly
supersedes PUEBI. Verbatim from the foreword (**re-fetched and confirmed 2026-07-26**):

> **"Ejaan Bahasa Indonesia yang Disempurnakan—atau yang lebih dikenal dengan singkatan EYD—edisi
> kelima ini merupakan pemutakhiran dari pedoman ejaan sebelumnya"** … **"yaitu Pedoman Umum Ejaan
> Bahasa Indonesia (PUEBI) yang ditetapkan oleh Keputusan Kepala Badan No. 0321/I/BS.00.00/2021"**,
> dated **"Jakarta, 16 Agustus 2022"**
> — <https://ejaan.kemendikdasmen.go.id/eyd/>

**Why this trap is different from an ordinary version bump: the branding went *backwards*.** The
norm was called EYD, was renamed **PUEBI** in 2015 (re-issued 2021), and then reverted to the
**older, better-known name "EYD"** in 2022. So a document saying "EYD" may be from 1972, 1987, or
2022, and a document saying "PUEBI" *sounds* like the newer one while being the superseded one.
Every instinct a reader has about which name is more modern is inverted.

**Stale PUEBI material is still actively served as authoritative.** The national library's digital
reading platform carries a **2019 PUEBI handbook** whose page states the book **"wajib dijadikan
panduan"** with **"aturan baku yang telah dibentuk oleh pakar bahasa"**
(<https://bintangpusnas.perpusnas.go.id/>). Stated honestly: that page does *not* itself claim
PUEBI is still in force — it is a 2019 book still on the shelf. **The trap is the reader's
inference, not the publisher's claim.** Which is precisely what makes it survive review.

> **→ Rule, binding: any brief, checklist, house style sheet, linter configuration, or translator
> prompt that cites "PUEBI" as the governing norm is ≥ 2022-stale and must be re-derived from
> EYD V.** Do not patch it; re-derive it. The concrete divergences a reviewer will hit are:
>
> 1. **the `ê` diacritic treatment** — EYD V sanctions **only `ê`** as the optional pepet marker;
>    `é` / `è` in inherited copy are a stale-era artifact to be reviewed, not silently kept (§3);
> 2. **the *unsur serapan* categories** — the loan-respelling rules that decide *algoritma*,
>    *inferensi*, *artifisial*, *halusinasi* (§6);
> 3. **the bound-form / hyphenation rules** — in particular the hyphen that attaches Indonesian
>    affixes to retained English roots (§3, §6).
>
> A **§11 check** enforces this: grep the project's own briefs and configs for the string `PUEBI`.

### 2b. ❌ There is no government digital-content style guide

**Honest negative finding.** No Indonesian government style guide for digital/web content —
nothing comparable to a national digital-service content manual — was found. What exists instead,
and what the house style must be built on:

1. **EYD V** — orthography and punctuation. Prescriptive, complete, free, fetchable rule-by-rule.
2. **KBBI VI** — word existence, standard spelling (*praktik* not *praktek*), field labels.
3. **PASTI** — terminology decisions.
4. **TBBBI** — grammar arbitration (⚠ unfetched).

**Consequence: this platform's own style sheet is the authority** for register, address form, and
terminology consistency. That is not a gap to apologize for — it is a mandate to write the
decisions down. §4 records the register decision; §6 records the terminology decisions.

### 2c. Dead and blocked hosts — and the legacy-link rot

Recorded for method transparency, and because it has a **maintenance consequence**: the education
ministry was renamed, and **every `kemdikbud.go.id` language link in any inherited link list is now
dead**. Do not retry these; rewrite them.

| Host | Result | Handling |
|---|---|---|
| `badanbahasa.kemendikdasmen.go.id` | **ECONNREFUSED** | Rerouted to the `ejaan.` / `kbbi.` / `pasti.` sub-portals, which serve the normative content directly |
| `badanbahasa.kemdikbud.go.id` | **ENOTFOUND** — ministry rename | Dead; rewrite to `kemendikdasmen.go.id` |
| `kbbi.kemdikbud.go.id` | **ENOTFOUND** — ministry rename | Rerouted → `kbbi.kemendikdasmen.go.id` ✅ |
| `repositori.kemdikbud.go.id` | **ENOTFOUND** — ministry rename | TBBBI metadata left ⚠ unverified |
| `peraturan.bpk.go.id` (national legal database) | **HTTP 403** | Rerouted → `id.wikisource.org` for statutory text (transcription source, labeled) |
| `prpm.dbp.gov.my` (Malaysian dictionary portal) | **timeout** | All Malaysian-side lexical claims in §9 carry ⚠ |

⚠ **Source-quality note.** §3, §5, and the orthographic parts of §4 and §6 rest almost entirely on
**primary official sources**. The **speaker counts** (header) and a few structural grammar
generalizations rest on **tertiary sources** and are labeled at point of use — because the
national agency's portal was unreachable, not because a primary source was skipped.

Sources: <https://ejaan.kemendikdasmen.go.id/eyd/> · <https://kbbi.kemendikdasmen.go.id/> ·
<https://pasti.kemendikdasmen.go.id/history.php> · <https://www.unicode.org/reports/tr14/> ·
<https://cldr.unicode.org/index/downloads> · <https://bintangpusnas.perpusnas.go.id/>

---

## 3. Script & typography

**(Strong section — EYD V rule-by-rule, UAX #14 rev 55, CLDR 48.2, `hyph-id`.)**

**Character inventory.** Indonesian uses the **Latin script with 26 letters** — EYD V: **"Huruf
dalam abjad bahasa Indonesia ada 26 seperti dalam tabel berikut."**
(<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-abjad/>) — and **five vowel
letters**: **"Vokal dalam bahasa Indonesia dilambangkan menjadi lima huruf, yaitu a, e, i, o, dan
u."** (<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-vokal/>). Running Indonesian
text is effectively **Basic Latin (U+0000–U+007F)**.

**Direction & tokenization.** **LTR**; words are **whitespace-separated**, so ordinary tokenization,
word-based highlighting, and default browser line-breaking are correct. **No RTL/bidi handling, no
shaping, no word-segmentation engine.**

### 3a. The one diacritic: ê (U+00EA)

Indonesian is usually described as "Latin, no diacritics". That is *almost* true, and the exception
is real. The letter `e` covers two phonemes — *taling* /e/ and *pepet* /ə/ — and normal running text
writes both as bare `e`. EYD V attaches a footnote to the vowel table (**re-fetched and confirmed
2026-07-26**):

> **"*) Untuk membedakan pengucapan, pada huruf e pepet dapat diberikan tanda diakritik (ê) yang
> dilafalkan [ə]."**
> — <https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-vokal/>

The minimal pairs given on that page: **teras / têras**, **seri / sêri**, **seret / sêrêt**.

- **Default: write bare `e`.** ✅ *teras* · ✅ *seri*
- The circumflex is an **optional disambiguator** (*"dapat diberikan"*), not a spelling requirement.
  Use it **only** in a pronunciation gloss or a glossary entry where a minimal pair would genuinely
  confuse: ✅ *pejabat teras [têras]*.
- ⚠ **`é` and `è` are not sanctioned.** The fetched EYD V vowel page documents **only `ê`**. Older
  material and many web tutorials show `é` / `è` for taling; no EYD V page sanctioning them could
  be fetched. **Corroborating census (this session):** the EYD V *Huruf Kapital* page contains
  exactly **one `é` and one `è`** — both inside the **French proper name** *André-Marie Ampère*, an
  example of capitalizing personal names, not an Indonesian orthographic sanction. Treat `é`/`è` in
  inherited Indonesian copy as **stale-era artifacts to be reviewed**, not silently kept (§2a).

- ✅ **ê** (U+00EA) — the sanctioned pepet marker, in glosses only
- ❌ **é** (U+00E9) / ❌ **è** (U+00E8) — not sanctioned for Indonesian by EYD V

**Font consequence:** if you ever emit `ê`, the font stack needs **Latin-1 Supplement (U+00EA)**,
not just Basic Latin. Any complete Latin webfont (a Noto Sans family from the open Google Fonts
library is a safe default) covers this; an aggressive `unicode-range: U+0020-007F` subset **does
not**, and will break exactly the glossary pronunciation glosses (§10).

### 3b. Quotation marks — quote the codepoints, and mind the split authority

**Use the curly marks. The codepoints are:**

| Level | Open | Close | Codepoints |
|---|---|---|---|
| Primary (double) | **“** | **”** | **U+201C** / **U+201D** |
| Inner (single) | **‘** | **’** | **U+2018** / **U+2019** |

These are **CLDR 48.2 locale `id`** values — `quotationStart` / `quotationEnd` and
`alternateQuotationStart` / `alternateQuotationEnd`. **Re-fetched and byte-verified this session**
(2026-07-26) directly from
<https://unpkg.com/cldr-misc-full@48.2.0/main/id/delimiters.json>,
decoded and dumped by codepoint: `0x201c`, `0x201d`, `0x2018`, `0x2019`. **None is U+0022 or
U+0027.**

- ✅ Indonesian: **“klik di sini”** — U+201C … U+201D
- ❌ Straight ASCII: **"klik di sini"** — U+0022 … U+0022
- ✅ nested: **“teks ‘di dalam’ teks”** — inner U+2018 … U+2019
- ❌ ASCII apostrophe as inner quote: **"teks 'di dalam' teks"** — U+0027

> ⚠ **Correction to a claim the dossier carried.** The dossier stated that CLDR and EYD V "agree on
> shape". **They agree on *function*, not on *glyph*.** A **codepoint census of the fetched EYD V
> *Tanda Petik* page (this session)** found **36× U+0022 and zero U+201C / U+201D** — the page's own
> heading renders as `Tanda Petik ("…")` with **ASCII U+0022**, and every example on it
> (*"Merdeka atau mati!"*, *"Pahlawanku"*, *"Maju Tak Gentar"*) uses ASCII. **So EYD V prescribes
> what quotation marks are *for*; it does not prescribe the glyph, and its own web rendering is
> ASCII.** The glyph authority for this kit is therefore **CLDR alone**. Do not cite EYD V as
> evidence for the curly glyphs.

**What EYD V does prescribe — three functions for double quotes**
(<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-petik/>):

1. **"Tanda petik digunakan untuk mengapit petikan langsung yang berasal dari pembicaraan, naskah,
   atau bahan tertulis lain."**
2. **"Tanda petik digunakan untuk mengapit judul puisi, judul lagu, judul artikel, judul naskah,
   judul bab buku, judul pidato/khotbah, atau tema/subtema yang terdapat di dalam kalimat."**
3. **"Tanda petik digunakan untuk mengapit istilah ilmiah yang kurang dikenal atau kata yang
   mempunyai arti khusus."**

*(Housekeeping note: the verbatim Indonesian citations throughout **this guide** are wrapped in
plain ASCII quotes, deliberately — that is how the source pages themselves render them, and it keeps
the cited strings byte-faithful. The **U+201C/U+201D rule above governs `id` product copy**, not the
citation apparatus of this document.)*

⚠ **Rule 3 overlaps with the italics rule below.** Pick **one** convention per content type —
**italics for English-language terms, quotes for Indonesian coinages being introduced** — and
document it. **Never do both to the same word.**

### 3c. Italics, capitalization, headings

**Foreign words are italicized.** EYD V: **"Huruf miring digunakan untuk menuliskan kata atau
ungkapan dalam bahasa daerah atau bahasa asing."** — with a carve-out: **"Nama diri, seperti nama
orang, lembaga, organisasi, atau merek dagang dalam bahasa asing atau bahasa daerah tidak ditulis
dengan huruf miring."** (<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-miring/>)

- ✅ *prompt*, *token*, *fine-tuning* set in `<em>` / `<i lang="en">` on first use
- ❌ organization and product names italicized — those are `nama diri` and stay upright

**`Anda` is always capitalized, mid-sentence included.** EYD V, *Huruf Kapital*, note (a) —
**re-fetched and confirmed 2026-07-26**: **"Kata Anda ditulis dengan huruf awal kapital."**, with
the examples **"Sudahkah Anda tahu?"** and **"Hanya teman Anda yang mengerti masalah itu."**
(<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-kapital/>). This is non-negotiable
and a very visible QA marker.

- ✅ **Sudahkah Anda tahu?** — capital A mid-sentence
- ❌ **Sudahkah anda tahu?** — lowercase; reads as sloppy immediately

**No period after headings.** EYD V: **"Tanda titik tidak digunakan pada akhir judul dan
subjudul."**, and likewise **"Tanda titik tidak digunakan di belakang angka terakhir... dalam judul
tabel, bagan, grafik, atau gambar"**
(<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik/>). Relevant for figure
and table captions in lesson pages.

- ✅ **Cara Kerja Model Bahasa** · ✅ **Tabel 1** — no trailing dot
- ❌ **Cara Kerja Model Bahasa.** · ❌ **Tabel 1.**

### 3d. Line breaking and hyphenation

**Baseline algorithm: UAX #14, Revision 55 (Unicode 17.0.0, 2025-09-05).** It describes its job as
producing **"a set of positions called 'break opportunities' that are appropriate points to begin a
new line."** and confirms that for space-separated scripts **"The space characters are used as
explicit break opportunities; they allow line breaks before most other characters."**
(<https://www.unicode.org/reports/tr14/>). **Indonesian therefore needs no special word
segmentation** — unlike Thai, Khmer, or Japanese. Default browser behavior is correct.

**Hyphenation exists and is worth enabling.** TeX/Hunspell patterns ship in the standard
`hyph-utf8` bundle; the TUG registry lists
**"Indonesian | indonesian | id | (2,2) | ASCII | GPL | Jörg Knappen, Terry Mart"**
(<https://www.hyphenation.org/>). The `(2,2)` means at least two characters before and after a
break. `<html lang="id">` + `hyphens: auto` works in engines that bundle the `id` dictionary, and
Indonesian genuinely benefits: affixed words are long (*mempertanggungjawabkan*,
*ketidakseimbangan*) and narrow mobile columns otherwise rag badly.

**Where Indonesian actually breaks words** — EYD V *pemenggalan kata*, which any hyphenation output
or manual `&shy;` pass must be sanity-checked against
(<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/pemenggalan-kata/>):

| Rule | EYD V verbatim | Examples |
|---|---|---|
| Diphthongs never split | **"Diftong ai, au, ei, dan oi tidak dipenggal."** | pan-dai, sau-da-ra, sur-vei, am-boi |
| Digraph consonants never split | **"Gabungan huruf konsonan yang melambangkan satu bunyi tidak dipenggal."** | ba-nyak, kong-res, makh-luk, masy-hur |
| Two consecutive consonants split between them | **"Jika di tengah kata dasar terdapat dua huruf konsonan yang berurutan, pemenggalannya dilakukan di antara kedua huruf konsonan itu."** | ban-tu, man-di, som-bong |
| Affixed words break at the morpheme boundary | **"Pemenggalan kata berimbuhan dilakukan di antara bentuk dasar dan unsur pembentuknya."** | ber-jalan, di-ambil, letak-kan, ke-kuat-an |

⚠ **`ng`, `ny`, `sy`, `kh` are single sounds.** A naive hyphenator or an automated soft-hyphen pass
that splits them produces visibly wrong Indonesian.

- ✅ **ba-nyak** · ✅ **kong-res** (the `ng` stays whole; the break falls after it)
- ❌ **ban-yak** · ❌ **kon-gres** (splits the digraph)

### 3e. The hyphen (tanda hubung) — and the one rule that matters most for AI copy

EYD V gives nine uses for the hyphen
(<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-hubung/>). Three bite in
technical copy:

- **Reduplication:** **"Tanda hubung digunakan untuk menyambung unsur bentuk ulang"** —
  *anak-anak, berulang-ulang* (§4).
- **Capital + lowercase, and letters + digits:** **"merangkaikan unsur yang berbeda, yaitu di antara
  huruf kapital dan nonkapital serta di antara huruf dan angka"** — *se-Indonesia, peringkat ke-2, D-3*.
- **🔑 Indonesian affix + foreign/regional/slang root:** **"merangkai unsur bahasa Indonesia dengan
  unsur bahasa daerah, bahasa asing, atau slang"**, with the official example **"mem-back up"**.

> **This last rule is the single most useful typographic rule in the guide for AI content.** It is
> the *sanctioned* mechanism for attaching Indonesian verbal morphology to a retained English
> technical root — so you never have to choose between correct Indonesian grammar and the English
> term your readers already know.

- ✅ **di-fine-tune** · ✅ **men-deploy** · ✅ **di-prompt** · ✅ **mem-fine-tune**
- ❌ **difine-tune** · ❌ **difinetune** · ❌ **di fine-tune**

**Romanization — not applicable.** Indonesian is natively a Latin-script language. There is **no
transliteration layer** to build or to keep out of the UI.

**Text expansion.** Indonesian words are long because affixation is dense. Test headline components
with *mempertanggungjawabkan* (23 characters) and *ketidakseimbangan*, not with English strings.
⚠ A ~25–35 % expansion over English is a **planning heuristic, not a measured constant** — the
dossier flagged it as unverified and it is carried as such.

Sources: <https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-abjad/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-vokal/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-kapital/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-huruf/huruf-miring/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/pemenggalan-kata/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-hubung/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-petik/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik/> ·
<https://www.unicode.org/reports/tr14/> · <https://www.hyphenation.org/> ·
CLDR 48.2 `id/delimiters.json` (re-fetched, byte-verified 2026-07-26)

---

## 10. Technical integration checklist

- **Fonts to ship:** any complete Latin webfont; a **Noto** family (Noto Sans / Noto Serif) is the
  safe default. Running Indonesian is effectively **Basic Latin**, so glyph coverage is a
  non-problem — **with one exception: do not subset to `unicode-range: U+0020-007F`**, or **ê
  (U+00EA)** disappears and the glossary pronunciation glosses break (§3a). Also confirm the font
  carries **“ ” ‘ ’ (U+201C/U+201D/U+2018/U+2019)**.
- **`lang` / `dir` attributes:** `lang="id"` (base) and `lang="id-easy"` (simplified variant, per
  the header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="id"` also drives **hyphenation
  dictionary selection, spellcheck, and screen-reader voice selection** — all three are silently
  wrong without it.
- **Locale negotiation — the `ms` trap:** explicitly **block any `id` → `ms` fallback** in the
  locale-negotiation layer (§9f). Generic macrolanguage-aware fallback will serve Malay to
  Indonesian readers, which is how `percuma` (§7a) gets into a product.
- **Number formatting — split your helpers:** a blanket `toLocaleString('id-ID')` **corrupts years,
  page numbers, account numbers, and IDs** by inserting the thousands dot (`1998` → `1.998`).
  **Quantities and identifiers must go through different helpers** (§5a).
- **Time separator is a period:** render `HH.mm` (`14.05`), never `HH:mm`. Audit hardcoded `:` in
  templates, duration widgets, countdown components, and chart axis labels (§5c).
- **Currency:** `Rp` **immediately before** the amount with **no space** — `Rp50.000`. Flag
  `Rp 50.000`, `Rp50,000` and `50.000 Rp` (§5b).
- **Quotation marks:** normalize straight ASCII quotes in body copy to **“ ” (U+201C/U+201D)** with
  nested **‘ ’ (U+2018/U+2019)** (§3b).
- **Hyphenation:** `hyphens: auto` with `lang="id"`; the `hyph-id` patterns are `(2,2)`. If soft
  hyphens are ever inserted programmatically, **guard the digraphs `ng`, `ny`, `sy`, `kh`** — they
  are single sounds and must not be split (§3d).
- **Index alphabet for glossary navigation:** plain **A–Z**, 26 letters, standard Latin collation.
  Indonesian needs no special collation rules — CLDR `id` collation is a plain Latin ordering. This
  is one of the genuinely easy parts.
- **Italic/quote convention for retained English:** decide **once** — italics for English terms,
  quotes for Indonesian coinages on introduction — and apply it mechanically. Mixed practice within
  one platform is the commonest Indonesian typography failure (§3b).
- **Text expansion allowance:** Indonesian words are long; test headline and button components with
  *mempertanggungjawabkan* and *ketidakseimbangan*, not with English strings. ⚠ ~25–35 % over
  English is a planning heuristic, not a measured figure (§3).
- **Time zones:** a national platform showing timestamps must label **WIB / WITA / WIT** — a bare
  `14.05` is ambiguous across the archipelago (§5c).
- **⚠ Link-rot maintenance (do this once, deliberately):** the education ministry was renamed, and
  **every `kemdikbud.go.id` language-authority link is dead** (`ENOTFOUND`, not a redirect). Sweep
  any inherited link list, bibliography, term sheet or research brief and rewrite
  `*.kemdikbud.go.id` → `*.kemendikdasmen.go.id`; verify each one resolves, because some hosts are
  down rather than moved (§2c). A dead source link silently downgrades a sourced claim to an
  unsourced one.
- **No romanization step:** Indonesian is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://ejaan.kemendikdasmen.go.id/eyd/> · CLDR 48.2 `id` (delimiters, numbers, dates) ·
<https://www.unicode.org/reports/tr14/> · <https://www.hyphenation.org/> · IANA Language Subtag
Registry

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **⚠ Stale-norm check (§2a) — run this on the project's own files, not on the content.** Grep every
  brief, style sheet, linter config, term sheet, and translator prompt for the string **`PUEBI`**.
  Any hit is **≥ 2022-stale** and must be re-derived from **EYD V**. Pay particular attention to
  rules touching the `ê` diacritic, the *unsur serapan* respelling categories, and bound-form
  hyphenation — those are the three places PUEBI-era guidance actually diverges.
- **Non-standard word forms (§6b) — a plain string scan, and nothing else catches these.** Flag in
  `id` body copy:
  - ❌ **`algoritme`** → ✅ **`algoritma`** (KBBI: `bentuk tidak baku`)
  - ❌ **`syaraf`** (and `sarap` in the nerve sense) → ✅ **`saraf`**
  - ❌ **`praktek`** → ✅ **`praktik`** · ❌ **`apotik`** → ✅ **`apotek`**
- **🔴 Forbidden string: `percuma` (§7a).** Flag **every** occurrence in `id` content, with priority
  on pricing, badges, buttons, and calls to action. ✅ **`gratis`** is the correct rendering of "free
  of charge". This check is worth running on its own, on every build.
- **Terminology consistency: `pembelajaran` vs `pemelajaran` (§6c).** Both are standard KBBI words,
  so a spellchecker will never flag either. Check that a document set uses **one** form
  consistently — the platform decision is **`pembelajaran mesin`** in body copy with a **one-time
  gloss** of *pemelajaran mesin*. Flag any document containing **both**.
- **Register consistency (§4a).**
  - Flag lowercase **`anda`** anywhere in body copy — EYD V mandates the capital **`Anda`** (§3c).
    This is a cheap, high-signal, fully deterministic check.
  - Flag **`kamu`**, **`kau`**, **`-mu`** in adult-facing copy — wrong register.
  - Flag **`Anda` density**: more than one `Anda` per two or three sentences means the pronoun-free
    phrasing was not applied. Prefer *"Klik tombol berikut"* over *"Anda klik tombol berikut"*.
- **`kita` vs `kami` (§4b(4)) — invisible to every automated check, so it needs a human pass.** Two
  targeted greps make it tractable: flag **`kami`** inside pedagogical narration ("in this lesson
  we…") and flag **`kita`** inside policy, legal, about-us, and product-description pages. KBBI's
  `kami` definition — **"tidak termasuk pembaca"** — is the test to apply.
- **Colloquial (`cak`) register leak (§9d):** flag **`gue`, `lu`, `nggak`, `banget`, `kayak`** and
  the colloquial **`-in`** verb suffix (*jelasin*, *bikinin*) in default content.
- **Number and date formatting (§5):**
  - Flag **period-as-decimal or comma-as-thousands** — Indonesian is **comma decimal + dot
    grouping** (`1.234,5`, not `1,234.5`).
  - Flag a **grouped year or identifier** — `1.998`, `halaman 1.553` are defects; years and IDs are
    never grouped.
  - Flag **`HH:mm`** time rendering — Indonesian uses the **period**: `14.05`.
  - Flag **`Rp` followed by a space**, **`Rp` after the amount**, and **English-grouped rupiah**
    (`Rp5,000`).
  - Flag **AM/PM** — the 24-hour clock throughout.
- **Quotation and apostrophe codepoints (§3b):** in `id` body copy, quotation marks must be
  **U+201C / U+201D** with inner **U+2018 / U+2019**. Flag **U+0022** and **U+0027**. ⚠ Note this is
  a **CLDR** rule, not an EYD V rule — EYD V prescribes function, and its own web pages render in
  ASCII, so do not expect the source pages to model the glyphs.
- **Diacritic check (§3a):** `id` running text should be **effectively ASCII**. Flag **`é` (U+00E9)**
  and **`è` (U+00E8)** in Indonesian words — neither is sanctioned by EYD V. **`ê` (U+00EA)** is
  legitimate **only** in pronunciation glosses and glossary entries; flag it in running body copy.
- **Compound spelling (§4b(5), §6e):** flag glued compounds — **`datalatih`**, **`jaringansaraf`**,
  **`modelbahasa`** — which must be two words.
- **Reduplication after a quantifier (§4b(3)):** flag a numeral or quantifier (*tiga*, *beberapa*,
  *banyak*, *semua*) followed by a hyphen-reduplicated noun (*tiga model-model*). Also flag
  **`data-data`** and the digit shorthand **`anak2`**-style forms.
- **Affix-on-English-root hyphenation (§3e):** flag an Indonesian prefix glued to an English root
  without the hyphen — **`difine-tune`**, **`mendeploy`**, **`diprompt`** → ✅ **`di-fine-tune`**,
  **`men-deploy`**, **`di-prompt`**.
- **Title Case leak (§6a):** flag **`Kecerdasan Buatan`**, **`Pembelajaran Mesin`**,
  **`Model Bahasa Besar`** mid-sentence — Indonesian technical terms are **lowercase**; Title Case is
  an English-import habit. Acronyms (AI, LLM, JST) stay capitalized.
- **Heading punctuation (§3c):** flag a **trailing period** on headings, subheadings, and
  figure/table captions.
- **`id-easy` sentence cap (§8a):** flag sentences over **12 words**, and flag the light-verb
  pattern **`melakukan` / `mengadakan` + nominalization** (*melakukan pengujian* → *menguji*), which
  is the highest-leverage simplification (§8b). ⚠ Do **not** flag the `di-` passive as a
  simplification defect in Indonesian (§8f).
- **Source-language leak scan (EN → ID):** left-in English function words (the, and, you, please),
  English number/date formatting surfacing in Indonesian text, mixed-code terms such as
  **`data training`** (→ ✅ **`data latih`**), and untranslated UI strings.

Sources: <https://ejaan.kemendikdasmen.go.id/eyd/> · <https://kbbi.kemendikdasmen.go.id/> ·
CLDR 48.2 `id` · <https://pasti.kemendikdasmen.go.id/>

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** Before
writing, a cite-spot-check **re-fetched load-bearing anchors this session (2026-07-26)**: the
**EYD V foreword** (PUEBI supersession, No. 0321/I/BS.00.00/2021, *Jakarta, 16 Agustus 2022* — all
confirmed verbatim); the **EYD V *Huruf Vokal*** page (the `ê` footnote and its minimal pairs —
confirmed); the **EYD V *Huruf Kapital*** page (the `Anda` capitalization note — confirmed); the
**EYD V *Tanda Petik*** page (**with a codepoint census that corrected a dossier claim**, see below);
**KBBI VI** entries for *algoritma*, *saraf*, *percuma*, *pembelajaran*, *pemelajaran*, *Anda*,
*kita*, *kami* (all confirmed, and the `kami` entry proved **stronger** than the dossier reported —
it spells out **"tidak termasuk pembaca"**); **PASTI term record `id=106571`** (*algorithm* →
*algoritma*, ranah Teknologi Informasi — confirmed by ID); and the **CLDR 48.2 `id`
delimiters and numbers** files, fetched raw and **dumped by codepoint** rather than read through a
summarizing layer.

**One dossier claim was downgraded by that check.** The dossier stated that CLDR and EYD V "agree on
shape" for quotation marks. A codepoint census of the fetched EYD V *Tanda Petik* page found **36×
U+0022 and zero U+201C/U+201D** — EYD V prescribes what quotation marks are *for*, not which glyphs
to use, and its own web rendering is ASCII throughout. §3b now attributes the curly glyphs to
**CLDR alone** and says so explicitly.

**Strong sections:** §2 authorities (with one honest ❌ — no digital style guide), §3 typography,
§5 numbers/dates/currency (two independent authorities agreeing), §6 terminology (13 of 15 terms
carry a citable PASTI term ID), §9 regional variation and tagging. **Thinner sections:** §4's
head-initial *meta-statement* (⚠ unsourced, though the pattern is evidenced in the official
terminology itself) and its reduplication-after-quantifier prohibition (⚠ unsourced); §7's three
⚠-marked idiom rows; §8, where the honest finding is that **no Indonesian easy-read standard
exists** and the quantitative anchor is a **book-leveling literacy standard used as a labeled
substitute**, not a national plain-language norm; the **speaker counts** in the header (⚠ tertiary).
Every ⚠ and editorial marker the dossier set has been preserved, and the dead/blocked hosts are
recorded in §2c with the link-rot consequence carried into §10.

**Register** (`Anda`, capitalized, sparing, paired with pronoun-free impersonal phrasing) is a
**human-gate decision** — one the project had to make consciously and write down, not a sign-off
obtained from anyone — recorded in §4a with its evidence and with its limitation
stated: it is **reasoned, not measured** — no published Indonesian UX-writing study was fetchable.
A **native-speaker review is still outstanding** (see Status in the header).
