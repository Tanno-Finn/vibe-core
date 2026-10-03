<!-- base -->
# lang-id — Indonesian (bahasa Indonesia) — language guide

> **Setup & sources live in [`id.setup.md`](id.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** bahasa Indonesia / Indonesian.
**BCP 47 code (base):** `id`.
**BCP 47 code (simplified variant):** `id-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`id-x-simple`), but the kit token `id-easy` is the one
that counts here. Note there is **no registered BCP 47 subtag for simplified language** in any
case (§9).
**Speaker reach:** ~**72 million** native speakers (2022) and ~**300 million** total including
second-language speakers (2022); the 2010 census total was **198,996,550**. ⚠ **Tertiary source** —
these figures come from the Indonesian-language reference encyclopedia, because the national
language agency's own portal refused connections throughout the research (§2). Treat the counts as
orientation, not as sourced constants. The **official status is primary-sourced**: the 1945
Constitution, Chapter XV, Article 36 — *"Bahasa Negara ialah Bahasa Indonesia."* Indonesian is
overwhelmingly an **L2 / national-unifier language**: most readers learned it at school, not at
home, which is exactly why the written standard is a genuinely neutral national register (§9).
**Script + direction:** **Latin script, 26 letters, no diacritics in native words**; **left-to-right**.
The one sanctioned diacritic is the circumflex **ê (U+00EA)**, and it is optional — a pronunciation
disambiguator, not a spelling requirement (§3).
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single
agent-native research dossier (self-fetched, quote-per-claim), then independently reviewed against
its cited sources. Covers base `id` and the `id-easy` pendant. Per the authoring directive's
"second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that
gap honestly.

**Section strength at a glance** (read this before trusting any one section):

| Section | Strength | Resting on |
|---|---|---|
| §2 Authorities | **Strong** | EYD V, KBBI VI, PASTI — all fetched; one honest ❌ (no digital style guide) |
| §3 Script & typography | **Strong** | EYD V rule-by-rule, UAX #14 rev 55, CLDR 48.2 delimiters, `hyph-id` |
| §4 Grammar | **Strong on the five features**, ⚠ on the meta-statement | KBBI VI + EYD V for every feature; head-initial framing unsourced |
| §5 Numbers/dates/currency | **Strong — two independent authorities agree** | CLDR 48.2 **and** EYD V, independently |
| §6 Terminology | **Unusually strong** | 13 of 15 terms carry an official **PASTI** record with a citable term ID |
| §7 Idioms | **Good** — most rows fetched from live Indonesian prose | Indonesian university/technical pages + KBBI VI; 3 rows ⚠ |
| §8 `id-easy` | **Honest ❌ + a real substitute** | No Indonesian easy-read standard exists; a government book-leveling standard supplies hard numbers |
| §9 Regional variation | **Strong on the ID/MY boundary and tagging** | KBBI VI, MABBIM, IANA registry, ISO 639-3 |

**Easy or hard for this kit:** **mechanically one of the easiest languages in the set** — Latin
script, whitespace tokenization, LTR, no shaping, no bidi, no romanization layer, effectively
ASCII-only running text. The difficulty is entirely **editorial**, and it concentrates in four
places: (1) the **EYD V / PUEBI recency trap** — the current norm reverted to the *older-sounding*
name, so stale 2015-era material reads as current (§2); (2) **standard vs non-standard word forms**
that pass every spellchecker — `algoritma` ✅ / `algoritme` ❌, `saraf` ✅ / `syaraf` ❌ (§6);
(3) **`percuma`**, a Malay false friend that turns a "free course" badge into "a pointless course"
(§7); and (4) **`kita` vs `kami`** (inclusive vs exclusive *we*), invisible to spellcheckers and to
non-native reviewers (§4).

Sources: <https://id.wikisource.org/wiki/Undang-Undang_Dasar_Negara_Republik_Indonesia_Tahun_1945>
(UUD 1945 Pasal 36) · <https://id.wikipedia.org/wiki/Bahasa_Indonesia> (speaker counts — ⚠ tertiary) ·
<https://ejaan.kemendikdasmen.go.id/eyd/> · <https://kbbi.kemendikdasmen.go.id/>

---

## 1. Header block

See above. One-line orientation: Indonesian is an Austronesian, SVO, LTR language in plain Latin
script with **no tense, no gender, no number marking, and no case** — its complexity sits in
**affixation, inclusive/exclusive pronouns, and a centrally curated terminology apparatus** rather
than in morphosyntactic agreement. The localization risks are **editorial and lexical**, not
typographic.

---

## 4. Grammar for translators

**(Strong on the five features — every one KBBI- or EYD-sourced. ⚠ on one meta-statement.)**

**Word order.** Indonesian is **SVO** and — critically for terminology — **head-initial**: the noun
comes first, its modifier second. This is the mirror image of English compounding.

| English | Indonesian | Structure |
|---|---|---|
| artificial intelligence | **kecerdasan buatan** | intelligence + artificial |
| machine learning | **pembelajaran mesin** | learning + machine |
| training data | **data latih** | data + training |
| deep learning | **pembelajaran mendalam** | learning + deep |

- ✅ **kecerdasan buatan** · ✅ **model bahasa besar**
- ❌ **buatan kecerdasan** · ❌ **mesin pembelajaran** — the classic machine-translation tell

⚠ **The head-initial meta-statement is unsourced.** The generalization ("hukum DM",
*diterangkan–menerangkan*) is standard textbook Indonesian grammar, but no primary source stating
it in these words could be fetched (the reference grammar's repository is down, §2c). It is
nonetheless **directly observable in the official terminology itself** — every EYD V and KBBI
headword above follows it — so **the pattern is evidenced even where the meta-statement is not.**
Treat the framing as ⚠, the examples as sourced.

### 4a. Register — the project's recorded choice

> **Register decision (human-gate): `Anda`, capitalized, used sparingly, paired with pronoun-free
> impersonal phrasing — taken and recorded.**
>
> **Binding for all second-person copy** in `id` and `id-easy`:
>
> - **Primary: `Anda`**, always with the **capital A** including mid-sentence (§3c — EYD V mandates
>   it). Use it **sparingly** — on first address in a passage, then let it fall away.
> - **Secondary, and the workhorse: pronoun-free impersonal phrasing**, which in Indonesian is very
>   often the natural form. Indonesian drops subjects far more readily than English does.
> - **`kita`** (inclusive *we*) is reserved for **genuine shared-learning framing** — "you and I,
>   together" — in explanatory prose.
> - **`kami`** (exclusive *we*) is reserved for **what the organization says about itself** — its
>   product, its policies, its team.
> - **Avoid `kamu`** unless a piece explicitly targets school-age learners; if that is ever
>   decided, it is decided once, platform-wide, and never mixed.
>
> **In UI microcopy (buttons, labels, toasts) drop the pronoun entirely.** In explanatory lesson
> prose, `Anda` on first address, then impersonal.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**Evidence for the decision.** KBBI VI defines `Anda` as **"kata sapaan kepada orang yang diajak
berbicara atau berkomunikasi (tidak membedakan tingkat, kedudukan, dan umur)"** — *it does not
distinguish rank, position, or age* (<https://kbbi.kemendikdasmen.go.id/entri/Anda>; **re-fetched
2026-07-26**). That parenthesis is the whole argument: `Anda` was deliberately coined as a
**status-neutral** address form, and it is the only form whose dictionary definition guarantees it
will not misfire on age or status across a very large and varied readership. `kamu`, by contrast, is
defined merely as **"pron orang kedua tunggal yang diajak bicara atau yang disapa"**
(<https://kbbi.kemendikdasmen.go.id/entri/kamu>) — **no neutrality clause at all**. It is the
intimate/downward form: natural between peers and from teacher to child, presumptuous from an
institution to an adult stranger.

`Anda`'s cost is a slight formality and distance — which is **exactly why it is paired with pronoun
avoidance** rather than repeated in every sentence. And pronoun avoidance is what Indonesian
institutional educational writing actually does: a government teacher-education page on AI in
education **avoids second-person address entirely**, using impersonal and inclusive-`kita`
constructions — **"Setiap orang tua perlu melakukan screening"**, **"kita tahu, bahwa setiap anak
memiliki keistimewaan"** (<https://ppg.kemendikdasmen.go.id/>).

- ✅ **Klik tombol berikut.** — pronoun-free imperative, the idiomatic default
- ❌ **Anda klik tombol berikut.** — pronoun where Indonesian would drop it; reads translated
- ✅ **Sudahkah Anda menyimpan pekerjaan Anda?** → better: ✅ **Sudahkah Anda menyimpan pekerjaan
  ini?** — one `Anda`, not two
- ❌ **Kamu klik tombol berikut.** — wrong register for an adult reader

⚠ **This recommendation is reasoned, not measured.** No published Indonesian UX-writing study
comparing `Anda` / `kamu` on comprehension or conversion could be fetched. The decision rests on
the KBBI definitions plus the observed government-education usage pattern. Flagged honestly; a
native-speaker or a measured study could refine it.

### 4b. The five features that break a naive EN → ID translation

#### (1) No grammatical tense — aspect is lexical

Indonesian verbs **do not inflect for time**. Time is carried by adverbial aspect markers, or by
nothing at all when context suffices. All three markers are KBBI-verified:

| Marker | KBBI VI verbatim | Function |
|---|---|---|
| **sudah** | **"adv telah jadi; telah sedia; selesai"** (<https://kbbi.kemendikdasmen.go.id/entri/sudah>) | perfective / completed |
| **sedang** | **"adv masih (dalam melakukan sesuatu); lagi; baru (saja)"** (<https://kbbi.kemendikdasmen.go.id/entri/sedang>) | progressive |
| **akan** | **"adv (untuk menyatakan sesuatu yang hendak terjadi, berarti) hendak"** (<https://kbbi.kemendikdasmen.go.id/entri/akan>) | prospective / future |

EN: *"The model has finished training. It is now generating output. Results will appear shortly."*
ID: *"Model **sudah** selesai dilatih. Model **sedang** menghasilkan keluaran. Hasil **akan** segera
muncul."*

**The trap runs in both directions.** Machine output **over-marks** — bolting `akan` / `sudah` onto
every English future and perfect — which reads labored. Native Indonesian omits the marker whenever
a time adverb or the discourse already fixes the time. Conversely, dropping a marker where English
relied purely on tense loses the information outright.

- ✅ **Besok kita bahas inferensi.** — *besok* already fixes the time; no `akan` needed
- ❌ **Besok kita akan akan membahas inferensi.** — over-marked and redundant
- ✅ **Model sudah selesai dilatih.** — the English perfect needs the marker here
- ❌ **Model selesai dilatih.** — for "has finished", the completion information is simply gone

**Reviewer instruction:** check every aspect marker for *necessity*, and check every English
perfect/future for a marker that went *missing*.

#### (2) Affixation — the base word is not the word

Indonesian derivation is dense, and EYD V is prescriptive about spelling it
(<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-turunan/>):

> **"Kata yang mendapat imbuhan (awalan, sisipan, akhiran, serta gabungan awalan dan akhiran)
> ditulis serangkai dengan imbuhannya."** — *berjalan, memudahkan, menulis, dijual, pembaca,
> semula, terbatas*

The productive machinery you will meet constantly, built on *latih* (train) and *ajar* (teach):

| Affix | Function | Example |
|---|---|---|
| `me(N)-` | active verb | **melatih** = to train |
| `di-` | **passive** verb | **dilatih** = to be trained |
| `ber-` | intransitive / stative | **belajar** = to learn |
| `-kan` | causative / benefactive | **melatihkan**; *memudahkan* = to make easy |
| `-i` | locative / iterative | *mengajari* = to teach (someone) |
| `pe(N)-…-an` | process nominal | **pelatihan** = training (the process) |
| `ke-…-an` | abstract nominal | **kecerdasan** = intelligence |
| `pe(N)-` | agent nominal | **pelatih** = trainer; *pembaca* = reader |

Three consequences:

- **`di-` passive is everywhere, and it is not a stylistic weakness in Indonesian.** *"Model dilatih
  dengan data ini"* is the natural rendering of "we train the model on this data". Forcing English
  active voice through produces stilted Indonesian.
  - ✅ **Model dilatih dengan data ini.**
  - ❌ **Kami melatih model dengan data ini.** — grammatical, but imports an English agent the
    Indonesian sentence did not need (and misuses `kami`, see (4))
- **`data latih` / `pelatihan` / `melatih` are three different words** — training-as-modifier,
  training-as-process, training-as-action. Choosing the wrong nominalization is a common
  terminology bug (§6).
- **`me(N)-` mutates the stem**: `me- + latih → melatih`, but `me- + proses → memproses`, and
  `me- + kirim → mengirim`. **You cannot build Indonesian verbs by string concatenation.** Never
  generate them programmatically; never let a translator invent one for an English root without
  checking KBBI or PASTI. For English roots, use the sanctioned hyphen instead (§3e).

#### (3) Reduplication for plural — and when NOT to use it

EYD V: **"Tanda hubung digunakan untuk menyambung unsur bentuk ulang"** — *anak-anak,
berulang-ulang, kupu-kupu, terus-menerus*; in compounds only the first element repeats —
**"kapal-kapal barang, kereta-kereta api"**.

**The trap: Indonesian nouns are number-neutral by default.** *model* already means "model(s)".
Reduplication is a **marked** choice meaning "various, an assortment of", and it is redundant when a
quantifier is already present.

- ✅ **tiga model** — ❌ **tiga model-model**
- ✅ **beberapa parameter** — ❌ **beberapa parameter-parameter**
- ✅ **model-model bahasa yang berbeda** — correct, because "assorted" is genuinely meant
- ❌ **anak2** for *anak-anak* — digit shorthand; never in published content

⚠ The specific prohibition "no reduplication after a numeral or quantifier" is standard prescriptive
teaching but **no source stating it verbatim could be fetched** — marked unverified. The *positive*
rules above are sourced. Likewise, no explicit ban on the `2` shorthand was found; EYD V simply
prescribes the hyphen unconditionally, so the prohibition is an inference from the positive rule.

**Translation instruction:** do **not** reflexively reduplicate to render an English plural `-s`.
Default to the bare noun. Note also that reduplication is not only plural — *berjalan-jalan* (to
stroll around) and *terus-menerus* (continuously) are aspectual/intensive, and *kupu-kupu*
(butterfly) is simply a lexical item with no singular.

#### (4) `kita` vs `kami` — inclusive vs exclusive "we"

English *we* is ambiguous; Indonesian **forces** the choice, and getting it wrong is socially
audible. Both KBBI-verified (**re-fetched 2026-07-26**):

| Pronoun | KBBI VI verbatim | Meaning |
|---|---|---|
| **kita** | **"pron pronomina persona pertama jamak, yang berbicara bersama dengan orang lain termasuk yang diajak bicara"** (<https://kbbi.kemendikdasmen.go.id/entri/kita>) | **INCLUSIVE** — includes the addressee |
| **kami** | **"pron orang pertama jamak yang berbicara bersama dengan orang lain (tidak termasuk yang diajak berbicara); yang menulis atas nama kelompok, tidak termasuk pembaca"** (<https://kbbi.kemendikdasmen.go.id/entri/kami>) | **EXCLUSIVE** — explicitly *"not including the reader"* |

The `kami` definition is unusually helpful: KBBI spells out **"tidak termasuk pembaca"** — *not
including the reader* — which is precisely the distinction a translator has to make.

| English (in an AI course) | Correct Indonesian | Why |
|---|---|---|
| "In this lesson, **we** will look at how a model learns." | ✅ **Kita** akan melihat… | reader + author together → inclusive |
| "**We** built this platform to make AI understandable." | ✅ **Kami** membangun platform ini… | the team, not the reader → exclusive |
| "**Our** privacy policy" | ✅ Kebijakan privasi **kami** | the organization's, not the reader's |
| "**Our** goal in this chapter" | ✅ Tujuan **kita** dalam bab ini | shared with the reader |

- ✅ **Kita akan melihat cara model belajar.** — ❌ **Kami akan melihat cara model belajar.**
- ✅ **Kebijakan privasi kami.** — ❌ **Kebijakan privasi kita.**

**Rule of thumb for this platform:** pedagogical narration = **kita**; anything the organization
says about itself, its product, its policies, or its team = **kami**. A stray `kami` in a "let's
explore this together" sentence instantly reads as the institution talking *at* the reader; a
`kita` in a privacy policy wrongly enrols the reader as a data controller. **Put this pair in the QA
checklist — it is invisible to spellcheckers and near-invisible to non-native reviewers** (§11).

⚠ Note KBBI also records a **second, colloquial sense** of `kita`: **"pron cak saya"** (*cak* =
colloquial register, §9). That sense is out of register for this platform; the inclusive-plural
sense is the one in play.

#### (5) Compound-word spelling — separate, joined, or hyphenated

Not a grammar trap exactly, but the highest-frequency orthography error in technical Indonesian.
EYD V (*Kata Turunan*):

- Compounds are written **separately** by default: **"duta besar, ibu kota, rumah sakit"**
- Joined **only** when taking a prefix *and* a suffix together: **"menggarisbawahi"**
- Still separate with prefix *or* suffix alone: **"bertepuk tangan"**
- A closed conventional list is joined: **"acapkali, bagaimana, kacamata, matahari, olahraga"**

- ✅ **data latih** · ✅ **jaringan saraf** · ✅ **model bahasa**
- ❌ **datalatih** · ❌ **jaringansaraf** · ❌ **modelbahasa**

Sources: <https://kbbi.kemendikdasmen.go.id/entri/Anda> ·
<https://kbbi.kemendikdasmen.go.id/entri/kamu> · <https://kbbi.kemendikdasmen.go.id/entri/kita> ·
<https://kbbi.kemendikdasmen.go.id/entri/kami> · <https://kbbi.kemendikdasmen.go.id/entri/sudah> ·
<https://kbbi.kemendikdasmen.go.id/entri/sedang> · <https://kbbi.kemendikdasmen.go.id/entri/akan> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/kata-turunan/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-hubung/> ·
<https://ppg.kemendikdasmen.go.id/> · <https://id.wikipedia.org/wiki/Reduplikasi> (⚠ tertiary,
reduplication background only)

---

## 5. Numbers, dates, currency

**(Strong section — and unusually so: two independent authorities agree throughout.)**

**This is worth stating explicitly: CLDR 48.2 (released 2026-03-17) and EYD V agree independently
on decimal comma, thousands dot, and `Rp` before the amount.** Locale data derived from usage and a
prescriptive national orthography norm converging is about as much confirmation as a formatting rule
can get. Where they diverge at all (the all-digit date separator), the guide says so.

### 5a. Numbers

| Property | Value | Source |
|---|---|---|
| Decimal separator | **`,`** (comma) | CLDR `id` decimal symbol — re-fetched, byte-verified 2026-07-26 |
| Group (thousands) separator | **`.`** (period) | CLDR `id` group symbol — re-fetched, byte-verified |
| Decimal pattern | **`#,##0.###`** | CLDR `id` standard decimalFormat |
| Percent pattern | **`#,##0%`** — **no space before `%`** | CLDR `id` percentFormat |
| Currency pattern | **`¤#,##0.00`** — symbol first, **no space** | CLDR `id` standard currencyFormat |
| Accounting pattern | **`¤#,##0.00`** — identical to standard | CLDR `id` accounting |
| minimumGroupingDigits | **`1`** — group from 1.000 upward | CLDR `id` |

(In CLDR pattern notation `,` and `.` are placeholders substituted by the locale's own symbols, so
`#,##0.###` renders as **1.234,5** in Indonesian. Values re-fetched this session from
`cldr-json/cldr-numbers-full/main/id/numbers.json` and dumped by codepoint.)

**EYD V agrees, independently:**

> **"Tanda titik digunakan untuk memisahkan bilangan ribuan atau kelipatannya yang menunjukkan
> jumlah."** — <https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik/>

> **"Tanda koma digunakan sebelum angka desimal atau di antara rupiah dan sen yang dinyatakan dengan
> angka."** — examples **12,5 m**, **27,3 kg**, **Rp500,50**, **Rp750,00**
> — <https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-koma/>

- ✅ Indonesian: **1.234,5** · **2.500.000 orang** · **12,5 m** · **75%**
- ❌ English format: **1,234.5** · **2,500,000 orang** · **12.5 m** · **75 %**

> ⚠ **The exception CLDR cannot express — do NOT group these.** The thousands dot is **not** used
> for numbers that do not express a quantity: **years, page numbers, account numbers, ID numbers**.
> EYD V names *tahun (1998)*, *nomor halaman (1553)*, *nomor rekening*, *NIP*.
>
> - ✅ **tahun 1998** · ✅ **halaman 1553**
> - ❌ **tahun 1.998** · ❌ **halaman 1.553**
>
> **This is a real bug source**: a blanket `toLocaleString('id-ID')` over every number in a template
> **will corrupt years and identifiers**. Format quantities and identifiers through different
> helpers (§10).

**Numerals vs words**, from *Angka dan Bilangan*
(<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/angka-dan-bilangan/>):

- **"Bilangan dalam teks yang dapat dinyatakan dengan satu kata ditulis dengan huruf"** —
  *"Mereka menonton drama itu sampai tiga kali"*
- Digits for measurements and values: *5 kilogram, 2 tahun 6 bulan, Rp5.000,00, 5%*
- A sentence may not open with a bare multi-word numeral — reorder or prefix:
  *"Sebanyak 2.500 orang peserta diundang"*
- Large round numbers may mix: **"Angka yang menunjukkan bilangan besar dapat ditulis sebagian
  dengan huruf"** — *"500 ribu dosis vaksin"*

### 5b. Currency

**Format: `Rp` immediately before the amount, no space, decimal comma, thousands dot.** Every EYD V
example is consistent — **Rp5.000,00**, **Rp500,50**, **Rp750,00** — and the CLDR pattern
`¤#,##0.00` with the symbol **Rp** produces exactly this. ISO 4217 code is **IDR**; use `Rp` in body
copy and `IDR` only in tabular or financial contexts.

- ✅ **Rp5.000,00** · ✅ **Rp50.000**
- ❌ **Rp 5.000** — space after the symbol
- ❌ **Rp5,000** — English grouping; **dangerous**, it reads as five rupiah and change
- ❌ **5.000 Rp** — the symbol precedes, always

⚠ **Sen (cents) are defunct in practice**; the `,00` tail is a formal/legal convention. For
consumer-facing educational copy **Rp50.000** reads more naturally than *Rp50.000,00*. This is a
**usage judgment, not a sourced rule** — EYD V's examples show the two-decimal form in formal
contexts.

### 5c. Dates and times

From CLDR 48.2 `id/ca-gregorian.json`:

| Format | Pattern | Rendered (July 26, 2026, 14:05) |
|---|---|---|
| Date, full | **`EEEE, dd MMMM y`** | Minggu, 26 Juli 2026 |
| Date, long | **`d MMMM y`** | 26 Juli 2026 |
| Date, medium | **`d MMM y`** | 26 Jul 2026 |
| Date, short | **`dd/MM/yy`** | 26/07/26 |
| Time, full | **`HH.mm.ss zzzz`** | 14.05.00 Waktu Indonesia Barat |
| Time, long | **`HH.mm.ss z`** | 14.05.00 WIB |
| Time, medium | **`HH.mm.ss`** | 14.05.00 |
| Time, short | **`HH.mm`** | **14.05** |

**Months (wide):** Januari, Februari, Maret, April, Mei, Juni, Juli, Agustus, September, Oktober,
November, Desember.
**Days (wide):** Minggu, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu.

> **🔑 The time separator is a FULL STOP, not a colon** — and this too is confirmed twice over. CLDR
> gives `HH.mm`; EYD V independently prescribes **"Tanda titik digunakan untuk memisahkan angka jam,
> menit, dan detik yang menunjukkan waktu atau jangka waktu."** with the examples **pukul 01.35.20**
> and **01.35.20 jam**. A hardcoded `14:05` in a template is a locale bug, and so is any duration
> widget rendering `1:35:20`.

- ✅ **14.05** · ✅ **pukul 01.35.20**
- ❌ **14:05** · ❌ **1:35:20**

**Other date rules:**

- **Order is day–month–year**, month spelled out and capitalized in prose.
  - ✅ **26 Juli 2026** — ❌ **Juli 26, 2026** (never US month-first)
- **All-digit dates take hyphens** per EYD V *Tanda Hubung* rule 3 — **"menyambung tanggal, bulan,
  dan tahun yang dinyatakan dengan angka"**, example *11-11-2022*. ⚠ **Here CLDR and EYD V do
  diverge**: CLDR's *short* pattern uses slashes (`dd/MM/yy`). Both circulate. **Pick one and be
  consistent** — hyphens for prose per EYD V, slashes acceptable in dense UI.
  - ✅ **11-11-2022** (prose) · ✅ **26/07/26** (dense UI) — but not both in one product
- **24-hour clock throughout.** All four CLDR time patterns use `HH`.
  - ✅ **20.45** — ❌ **8.45 PM**
- **Three time zones:** WIB (UTC+7), WITA (UTC+8), WIT (UTC+9). A national platform showing
  timestamps must say which — a bare *14.05* is ambiguous across the archipelago. ⚠ The zone
  abbreviations are standard usage; the UTC offsets are carried as commonly-known, not sourced here.
- **Years are never grouped** — see the §5a exception.

Sources: <https://cldr.unicode.org/index/downloads> (48.2, 2026-03-17) · CLDR `id/numbers.json` and
`id/ca-gregorian.json` (numbers re-fetched, byte-verified 2026-07-26) ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-titik/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-koma/> ·
<https://ejaan.kemendikdasmen.go.id/eyd/penulisan-kata/angka-dan-bilangan/>

---

## 6. Terminology strategy

**(Unusually strong section — and it is worth saying why: 13 of the 15 core terms carry an official
PASTI record with a citable, stable term ID. Most languages give you field usage and a shrug;
Indonesian gives you a government term-equivalence database you can link to by ID and re-check
later.)**

### 6a. Loanword policy: `padanan` vs `serapan`

Indonesian terminology is **centrally curated**. The national language agency runs a
term-equivalence program whose public face is **PASTI** (*Padanan Istilah*), holding
**"172.216 istilah dari 59 ranah"**, with the stated mission to **"menyebarluaskan padanan bahasa
Indonesia untuk istilah asing yang telah dipadankan"** (<https://pasti.kemendikdasmen.go.id/>).

**Four canonical intake routes**, per a regional language office
(<https://balaibahasajateng.kemendikdasmen.go.id/>):

- **adopsi** — **"mengambil bentuk dan makna kata asing yang diserap secara keseluruhan"** (taken
  whole: *model*, *token*)
- **adaptasi** — **"ejaan atau cara penulisannya disesuaikan ejaan bahasa Indonesia"** (respelled:
  *algoritma*, *inferensi*, *halusinasi*)
- **penerjemahan** — **"mengambil konsep yang terkandung dalam kata bahasa asing kemudian mencari
  padanannya"** (calqued: *kecerdasan buatan*, *model bahasa besar*)
- **kreasi**

**Source priority is fixed** by the *Pedoman Umum Pembentukan Istilah* (PUPI): material is drawn
**"terutama dari tiga golongan bahasa yang penting"** — Indonesian/Malay first, then related
Nusantara languages, then foreign languages
(<https://id.wikisource.org/wiki/Pedoman_Umum_Pembentukan_Istilah>). Crucially, **PUPI itself
authorizes keeping the loan** when doing so **"meningkatkan ketersalinan bahasa asing dan bahasa
Indonesia secara timbal balik"** — *when the English aids two-way traceability, keep it*. **That is
the license to retain `prompt`, `token` and `fine-tuning` without apology.**

**Respelling of absorbed terms is mechanical**, per EYD V *Unsur Serapan Umum*
(<https://ejaan.kemendikdasmen.go.id/eyd/unsur-serapan/umum/>):

| EYD V rule (verbatim) | Example |
|---|---|
| **"Huruf c (Inggris) yang diikuti a, o, u, atau konsonan menjadi k"** | construction → **konstruksi** |
| **"Huruf c yang diikuti e, i, oe, atau y menjadi s"** | cyber → **siber**; artificial → **artifisial** |
| **"Gabungan huruf ph menjadi f"** | phase → **fase** |
| **"Gabungan huruf th menjadi t"** | thesis → **tesis** |

**Derive, don't guess.** (Note this is one of the three areas where PUEBI-era material diverges —
§2a.)

**House pattern: Indonesian term first, English in parentheses on first use** — exactly what the
government's own teacher-education material does: **"Kecerdasan Buatan (Artificial Intelligence)"**
(<https://ppg.kemendikdasmen.go.id/>). This satisfies readers who learned the field in English
without abandoning the Indonesian term. The kit's **sandwich pattern** from
[translation-quality](../translation-quality.md) instantiates as:

> **kecerdasan buatan** (*artificial intelligence*, AI) — program komputer yang meniru kemampuan
> berpikir manusia. *(The explanatory clause is authored per the sandwich format; the term itself is
> sourced in the table below.)* Then **kecerdasan buatan** alone on every later mention.

**Three orthographic rules govern retained English** (all sourced in §3):

1. **Italicize foreign words** — *prompt*, *token*, *fine-tuning* take `<em>` / `<i lang="en">`.
   Proper nouns and organization names are **not** italicized.
2. **Hyphenate Indonesian affixes onto English roots** — ✅ *di-fine-tune*, ❌ *difine-tune*.
3. **Quote unfamiliar Indonesian coinages on introduction** — never in combination with italics on
   the same word.
4. **Lowercase all of it.** EYD V lists no rule capitalizing fields of study or technical terms.
   ✅ *kecerdasan buatan*, *pembelajaran mesin*, *model bahasa besar* mid-sentence; ❌ *Kecerdasan
   Buatan*, *Pembelajaran Mesin* — Title Case on Indonesian terms is an English-import habit.
   Acronyms stay capitalized (AI, LLM, JST).

### 6b. ⚠ Standard vs non-standard forms — real, common, and spellcheck-proof

**KBBI marks certain spellings `bentuk tidak baku` (non-standard form) outright.** These are not
stylistic preferences; they are the dictionary saying *this spelling is wrong*. And Indonesian
computer-science writing gets them wrong constantly — theses, course material, and blog posts are
full of the non-standard forms, which is precisely why translators copy them.

| ✅ Standard | ❌ Non-standard | Evidence | Provenance |
|---|---|---|---|
| **algoritma** | **algoritme** | KBBI VI entry `al.go.rit.ma` carries **"bentuk tidak baku: algoritme"**, with the definitions **"prosedur sistematis untuk memecahkan masalah matematis dalam langkah-langkah terbatas"** and **"n Man urutan logis pengambilan keputusan untuk pemecahan masalah"** | KBBI VI ✅ **primary, re-fetched 2026-07-26** · corroborated by PASTI **id=106571**, ranah Teknologi Informasi, *algorithm* → **"algoritma"** — **re-fetched 2026-07-26** |
| **saraf** | **syaraf** (and *sarap*) | KBBI VI entry `sa.raf 2` carries **"bentuk tidak baku: sarap 5, syaraf"**, sense **"n Anat jaringan yang mengatur kerja sama, menyalurkan rangsangan dari dan ke alat-alat tubuh"** | KBBI VI ✅ **primary, re-fetched 2026-07-26** |
| **praktik** | **praktek** | KBBI marks *praktek* non-standard | KBBI VI ✅ (dossier) |
| **apotek** | **apotik** | KBBI marks *apotik* **bentuk tidak baku** | KBBI VI ✅ (dossier) |

> **`algoritme` is the one that will slip past you.** It looks like a legitimate Indonesian
> adaptation — and it is widely used in Indonesian CS writing — but KBBI explicitly files it as
> `bentuk tidak baku`. **`algoritma` is the only correct form.** Likewise *jaringan syaraf tiruan*
> is extremely common in Indonesian theses and is simply **misspelled**: the standard form is
> **saraf**. Both belong in the deterministic check list (§11) — a plain string scan catches them,
> and nothing else will.

### 6c. ⚠ `pembelajaran` vs `pemelajaran` — a real semantic split, not a typo

Both are **standard KBBI headwords**. They differ by which side of the teaching relationship they
name (**re-fetched and confirmed 2026-07-26**):

| Form | KBBI VI verbatim | Meaning |
|---|---|---|
| **pembelajaran** | **"n proses, cara, atau perbuatan menjadikan belajar"** (<https://kbbi.kemendikdasmen.go.id/entri/pembelajaran>) | *causing to learn* — the **teaching** side |
| **pemelajaran** | **"n proses, cara, atau perbuatan mempelajari"** (<https://kbbi.kemendikdasmen.go.id/entri/pemelajaran>) | *the act of studying* — the **learner** side |

**PASTI consistently prefers `pemelajaran`** for ML compounds — *pemelajaran mesin*, *pemelajaran
mendalam*, *pemelajaran terbimbing* — on the logic that a machine *studies* rather than *teaches*.
**Actual Indonesian usage overwhelmingly writes `pembelajaran mesin`.**

> **Decision for this platform: use `pembelajaran mesin` in body copy, and gloss `pemelajaran
> mesin` once as the official Badan Bahasa form.**
>
> **Why:** the platform's job is comprehension, not prescription. `pembelajaran mesin` is what
> readers have seen in every Indonesian article, university page, and news item about the field —
> including a government higher-education learning platform, which writes **"pembelajaran mesin"**
> and glosses it as **"cabang dari kecerdasan buatan"**. Leading with the officially-preferred form
> would make correct terminology read as a typo to the very audience it is meant to serve. Glossing
> the PASTI form once discharges the obligation to the norm without paying that cost.
>
> **Never mix the two within one document.** Lock the choice in the term base; do not let
> translators re-litigate it per file.

- ✅ body copy: **pembelajaran mesin**
- ✅ one-time gloss: **pembelajaran mesin** (bentuk baku Badan Bahasa: *pemelajaran mesin*)
- ❌ mixing **pembelajaran mesin** and **pemelajaran mesin** across a document set

### 6d. Seed field vocabulary (AI/ML)

**Provenance column convention:** ✅ **PASTI id=…** means an official term record exists and is
re-checkable by ID; ✅ **KBBI** means a dictionary headword; **usage** means attested in live
Indonesian prose but not officially registered.

| Concept (EN) | Indonesian | Type | Provenance |
|---|---|---|---|
| artificial intelligence (AI) | **kecerdasan buatan**; *kecerdasan artifisial*; **AI** (acronym retained) | padanan | ✅ **PASTI id=106687**, ranah Teknologi Informasi: **"kecerdasan artifisial (KA); kecerdasan buatan (KB); AI"** · ✅ KBBI *kecerdasan buatan*, label **Komp**: **"program komputer dalam meniru kecerdasan manusia, seperti mengambil keputusan"** |
| machine learning | **pembelajaran mesin** (body copy) / *pemelajaran mesin* (PASTI) | padanan — **see §6c** | ✅ **PASTI id=168963**, ranah Pendidikan: **"pemelajaran mesin"** · usage: government higher-ed platform writes **"pembelajaran mesin"**, **"cabang dari kecerdasan buatan"** |
| neural network | **jaringan saraf tiruan** (JST — dominant usage) / *jaringan neural buatan* (PASTI) | padanan — **two competing coinages** | ✅ **PASTI id=161664**, ranah Teknik Listrik, *artificial neural network*: **"jaringan neural buatan"** · ✅ **PASTI id=66795**, TI, *neural network architecture*: **"arsitektur jaringan neural"** · usage ⚠ tertiary: **"Jaringan saraf tiruan merupakan jaringan dari unit pemroses kecil yang saling terhubung"** |
| training data | **data latih** / *data pelatihan*; *set data pelatihan* (PASTI) | padanan | ✅ **PASTI id=67047**, TI, *training data set*: **"set data pelatihan"** · academic usage: **"Model dilatih menggunakan data pelatihan dan dievaluasi menggunakan data pengujian"** |
| model | **model** | serapan (adopsi, unchanged) | ✅ **PASTI id=48995**, ranah Matematika: *model* → **"model"** · ✅ KBBI: **"n pola (contoh, acuan, ragam, dan sebagainya) dari sesuatu yang akan dibuat atau dihasilkan"** |
| dataset | **himpunan data**; **set data**; *dataset* (EN commonly retained) | padanan (two offered) | ✅ **PASTI id=66459**, TI: **"himpunan data; set data"** |
| prompt (AI sense) | ***prompt*** — retained, italicized | **retained EN — no official padanan** ⚠ | ✅ KBBI has **no entry**: **"Entri tidak ditemukan"** · PASTI holds only a networking sense, **id=110980**, *prompt (FTP)*: **"promp; FTP"** · usage keeps English |
| token | **token** | serapan (adopsi) — **dictionary-attested** | ✅ KBBI: **"to.ken /tokên/ n kemunculan kata, angka, atau huruf yang terpisahkan oleh spasi"** · ✅ **PASTI id=111638**, TI, *token passing*: **"pelewatan token"** |
| fine-tuning | ***fine tuning*** — retained, italicized; *penyetelan halus* attested but rare | **retained EN — no IT-domain padanan** ⚠ | ✅ **PASTI id=57516** gives **only the economics sense**: *fine tuning* → **"penyelarasan"**, ranah Ekonomi · AI usage retains English |
| inference | **inferensi** | serapan (adaptasi) — **not in PASTI** ⚠ | ✅ KBBI: **"in.fe.ren.si — n simpulan"** · PASTI: no *inference* entry (index range-checked, see method note) |
| algorithm | **algoritma** ✅ (**not** *algoritme* ❌) | serapan (adaptasi) | ✅ **PASTI id=106571**, TI: *algorithm* → **"algoritma"** — **re-fetched 2026-07-26** · ✅ KBBI, **"bentuk tidak baku: algoritme"** — **re-fetched 2026-07-26** (§6b) |
| deep learning | ***deep learning*** retained + glossed (recommended); *pembelajaran mendalam* / *pemelajaran mendalam* | padanan — **ambiguous, see below** | ✅ **PASTI id=66472**, ranah Teknologi Informasi: **"pemelajaran mendalam"**; duplicate **id=168872** under ranah Pendidikan |
| supervised learning | **pembelajaran terbimbing** / *pemelajaran terbimbing* | padanan | ✅ **PASTI id=67010**, TI: **"pemelajaran terbimbing"**; same padanan under ranah Pendidikan, **id=169054** |
| unsupervised learning | **pembelajaran tak terbimbing**; *pemelajaran takterbimbing* | padanan | ✅ **PASTI id=67061**, TI: **"pemelajaran takterbimbing"** · ⚠ usage lists three rivals |
| large language model (LLM) | **model bahasa besar**; **LLM** (acronym retained) | padanan (calque) | ✅ **PASTI id=172493**, ranah Teknologi Informasi: **"model bahasa besar"** · related: **PASTI id=66719**, *language modeling* → **"pemodelan bahasa"** |
| hallucination (AI sense) | **halusinasi** — **needs a gloss** | serapan, **sense-extended** | ✅ KBBI, label **Psi**: **"pengalaman indra tanpa adanya perangsang pada alat indra yang bersangkutan"** · ✅ **PASTI id=146593**, ranah **Sastra** |

**Bonus, verified, useful:** *peladen* = **"n Komp komputer dalam jejaring yang berfungsi sebagai
penyedia layanan ke komputer lain"** (server); *gawai* = **"peranti elektronik atau mekanik dengan
fungsi praktis; gadget; acang"** (device). Both KBBI.

Project coinages (class **C1** in [translation-quality](../translation-quality.md)) keep their
original spelling in Indonesian text and are owned by the term sheet, not by this table.

### 6e. Six remaining pitfalls

**① `jaringan saraf tiruan` (usage) ≠ `jaringan neural buatan` (PASTI).** Two independent coinages,
both defensible. Three sub-traps:

- ❌ **Never write `syaraf`** — KBBI marks it `bentuk tidak baku` (§6b).
- ⚠ **`tiruan` is not neutral.** KBBI glosses it **"bukan yang sejati (tulen); palsu; imitasi"**, so
  *jaringan saraf tiruan* faintly reads "fake neural network". PASTI's *buatan* ("made") avoids that.
- ❌ **Do not drop `tiruan`.** Bare *jaringan saraf* is the **biological** structure — KBBI labels
  *saraf* **`Anat`** (confirmed on re-fetch, §6b).
- ✅ **Recommendation: `jaringan saraf tiruan`**, abbreviated **JST** on second mention.

**② `data latih` vs `data pelatihan` vs `set data pelatihan`.** All three occur. `data latih` is a
compact root-compound; `data pelatihan` uses the *peN-…-an* nominalization and reads more formal;
PASTI's registered form is the longest. **Pick `data latih` for a learner-facing kit** — shortest,
clearest, widely attested — and stay consistent. ❌ **Never write `data training`** (mixed-code,
common but sloppy). Per §4b(2) the family is: **data latih** (modifier) / **pelatihan** (process) /
**melatih** (action) / **dilatih** (passive).

**③ `pembelajaran mendalam` collides with an education-policy term.** PASTI registers *deep
learning* twice — under **Teknologi Informasi** *and* under **Pendidikan**. ⚠ Additionally,
*"pembelajaran mendalam"* is reported to be the current Indonesian national-curriculum label for a
**pedagogical** approach; this could **not** be verified (the curriculum host refused connections) —
treat as unconfirmed but plausible. **In an AI-education text specifically, write *deep learning* in
italics on first use and gloss it.** This is the one term where retention beats the padanan, because
the Indonesian rendering is genuinely ambiguous **to exactly this audience**.

**④ `prompt` and `fine-tuning` have no sanctioned AI padanan — keep them in English, italicized.**
KBBI has no *prompt* entry at all; PASTI's only *prompt* record is a 1990s file-transfer sense and
its only *fine tuning* record is macroeconomic. This follows PUPI's own escape clause (§6a).
❌ **`perintah` for *prompt* loses the technical sense and should be avoided.** Verb forms are solved
by the hyphen rule: ✅ *di-fine-tune*, ✅ *mem-fine-tune*.

**⑤ `halusinasi` needs a gloss.** KBBI carries only the `Psi` clinical sense and PASTI files it
under **Sastra**. Indonesian readers will not automatically map it to model output. On first use:
✅ *halusinasi (keluaran model yang terdengar meyakinkan tetapi tidak benar)*.

**⑥ No plural marking in terms.** *data* is already a mass noun in KBBI — **"keterangan yang benar
dan nyata"**, with no plural/datum note. ❌ **Never write `data-data`** (reads colloquial), and never
reduplicate a coined term: ❌ *model-model bahasa* → ✅ *model bahasa* (§4b(3)).

### 6f. Method note on §6's sourcing

⚠ **PASTI's search form could not be driven over plain GET.** Entries were located by
binary-searching its alphabetical index (`istilah_list.php?char=X&page=N`) and fetching detail pages
directly. **The term IDs cited above are stable and re-checkable** — one of them (`id=106571`,
*algorithm* → *algoritma*, ranah Teknologi Informasi) was **re-fetched by ID this session and
confirmed**. However, the **absence** claims (no *inference*, no AI-sense *prompt* / *fine tuning*)
rest on exhaustive index range-checks rather than a search query, so they are **strong but not
absolute**.

Sources: <https://pasti.kemendikdasmen.go.id/> (ids 106687, 168963, 161664, 66795, 67047, 48995,
66459, 110980, 111638, 57516, 106571, 66472, 168872, 67010, 169054, 67061, 172493, 66719, 146593) ·
<https://kbbi.kemendikdasmen.go.id/> (algoritma, saraf, tiruan, kecerdasan buatan, artifisial,
inferensi, model, data, latih, token, prompt [not found], halusinasi, pembelajaran, pemelajaran,
peladen, gawai) · <https://ejaan.kemendikdasmen.go.id/eyd/unsur-serapan/umum/> ·
<https://id.wikisource.org/wiki/Pedoman_Umum_Pembentukan_Istilah> ·
<https://balaibahasajateng.kemendikdasmen.go.id/> · <https://ppg.kemendikdasmen.go.id/> ·
<https://id.wikipedia.org/> (⚠ tertiary, labeled inline)

---

## 7. Idiom anti-patterns

**(Good section — most rows are quoted from live Indonesian university, polytechnic, or technical
prose rather than from a bilingual dictionary. Three rows carry ⚠.)**

Indonesian technical and educational prose almost never renders English stock phrases word-for-word.
It either uses a **fixed descriptive collocation** (*di balik layar*, *langkah demi langkah*) or
**retains the English term with an Indonesian gloss**. **The literal calque is the single most
reliable marker of machine-shaped Indonesian.**

### 7a. 🔴 The highest-risk single string on the platform: "free of charge"

> **Use `gratis`. Never `percuma`.**
>
> KBBI VI lists **two** senses for `percuma`, and the order is the entire problem
> (**re-fetched and confirmed 2026-07-26**, <https://kbbi.kemendikdasmen.go.id/entri/percuma>):
>
> 1. **"a tidak ada gunanya (hasilnya dan sebagainya); sia-sia"** — *pointless, in vain, futile*
> 2. **"a cuma-cuma; gratis"** — *free of charge*
>
> **Sense 1 is first.** In Malaysian Malay, *percuma* means straightforwardly *without payment* —
> which is exactly why the word leaks into Indonesian copy from Malay sources and from translators
> working across both. **To an Indonesian reader it lands the other way first.**
>
> - ✅ **Kursus ini gratis.** — "This course is free."
> - ❌ **Kursus ini percuma.** — reads first as **"This course is pointless."**
>
> **This is a live, money-losing error**: it sits on exactly the strings that carry commercial
> weight — a "Free" badge, a pricing table, a call-to-action, a course card. A single word turns the
> most persuasive label on the page into a statement that the product is worthless, and it will pass
> every spellchecker, every grammar check, and every non-native review. **Put `percuma` on the
> forbidden-string list** (§11).

It doubles as the sharpest illustration of the §9 Indonesian-vs-Malay boundary: the two languages
share the word and disagree about what it means first.

### 7b. Core table

| English stock phrase | Idiomatic Indonesian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| free of charge | **gratis**; *cuma-cuma* | **percuma** — see §7a | ✅ KBBI *percuma*, sense order — **re-fetched 2026-07-26** |
| step by step | **langkah demi langkah**; *tahap demi tahap*, *secara bertahap* | *langkah oleh langkah*, *selangkah oleh selangkah* | University coding guide: **"Berikut panduan langkah demi langkah:"**. `demi` is the fixed distributive connector; `oleh` is the passive-agent preposition and produces nonsense |
| under the hood | **di balik layar**; for the mechanism itself *cara kerjanya* | *di bawah kap mesin*, *di bawah tudung* | Vocational-faculty article: **"Mereka bekerja di balik layar"**. Indonesian has no car-bonnet metaphor for internals |
| in a nutshell | **singkatnya**; *secara singkat*, *ringkasnya* | *dalam sebutir kacang*, *dalam tempurung kacang* | KBBI *singkat*: **"ringkas (tentang cerita, pidato, dan sebagainya)"** — the nut-shell image does not exist in Indonesian |
| keep in mind / bear in mind | **perlu diingat (bahwa)**; *ingatlah bahwa*, *perlu dicatat* | *simpan dalam pikiran*, *tanggung dalam benak* | Indonesian uses a passive impersonal, not an imperative "store in your mind": **"perlu diingat bahwa penggunaan teknologi AI juga membawa tantangan dan risiko…"** |
| the big picture | **gambaran besar**; *gambaran menyeluruh*, *gambaran utuh* | *gambar besar*, *foto besar* | University page: **"Perspektif memungkinkan siswa untuk melihat gambaran besar…"**. `gambar` = a physical picture; `gambaran` = a mental overview — dropping `-an` turns "the overall view" into "a large photograph" |
| best practice | **praktik terbaik** (English also acceptable in industry copy) | *latihan terbaik*, *praktek paling bagus* | Business glossary: **"Best Practice secara harfiah berarti 'praktik terbaik'."** `latihan` = drill/exercise, not professional practice; *praktek* is non-standard (§6b) |
| at a glance | **sekilas**; *selayang pandang*, *sekilas pandang* | *pada satu lirikan*, *dalam satu pandangan mata* | KBBI *sekilas*: **"sekejap mata; selayang pandang"** — it already carries "in one brief look", so no prepositional scaffolding is needed |
| from scratch | **dari nol**; *dari dasar*, *dari awal* | *dari goresan*, *dari garukan* | Indonesian learning material titles beginner tracks **"Belajar Coding dari Dasar untuk Pemula"** |
| cheat sheet | **catatan ringkas** (neutral, preferred); *lembar contekan / sontekan* | *lembar curang*, *lembar penipuan* | Encyclopedic (⚠ tertiary): **"Sontekan disebut juga lembar sontekan adalah serangkaian catatan ringkas yang digunakan untuk referensi cepat."** `curang`/`penipuan` = moral fraud — wrong register. In educational copy prefer neutral *catatan ringkas* to avoid the exam-cheating connotation |
| out of the box (= works unconfigured) | **siap pakai**; *langsung berfungsi tanpa pengaturan tambahan* | *di luar kotak* — **FALSE FRIEND** | In Indonesian, *di luar kotak* is already occupied by the **creativity** sense — an education portal defines it as **"berpikir yang kreatif dan inovatif melampaui batasan diri"**. Using it for "works by default" will be read as "think unconventionally" |
| trade-off | ***trade-off*** retained, glossed as *pengorbanan satu hal demi hal lain* / *kompromi* | *tukar-menukar*, *imbal balik* | Indonesian writing retains and glosses: **"Trade-off adalah suatu konsep ekonomi yang mengacu pada pengorbanan suatu hal untuk mendapatkan hal lain."** `tukar-menukar` = barter; `imbal balik` = reciprocity |
| garbage in, garbage out | **retain the English term**, then gloss: *data buruk menghasilkan keluaran yang buruk* | bare *sampah masuk, sampah keluar* with no gloss | State polytechnic article: **"Istilah 'Garbage In, Garbage Out' tidak pernah lebih relevan daripada dalam dunia AI"**. Bare *sampah* reads as household refuse |

### 7c. ⚠ Partially evidenced — use with care

| English stock phrase | Idiomatic Indonesian ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| ⚠ rule of thumb | *patokan umum*; *berdasarkan pengalaman*; *aturan praktis* ⚠ | *aturan ibu jari*, *aturan jempol* | ⚠ Encyclopedic rendering **"Berdasarkan pengalaman (rule of thumb)."** (tertiary); KBBI supports *patokan* = **"ketentuan yang menjadi dasar atau pegangan untuk melakukan sesuatu"**. *aturan praktis* is widely reported but no page quoting it verbatim could be fetched |
| ⚠ trial and error | *coba-coba*; *metode coba-coba*, *uji coba berulang* | *percobaan dan kesalahan* | ⚠ KBBI lists *coba-coba* (**"v mencoba-coba"**), but usage inside Indonesian ML prose could not be quoted (source returned 403). The calque reads as two unrelated nouns and loses the iterative sense |
| ⚠ edge case | *kasus tepi*; *kasus batas*, *kasus ekstrem* | *kasus sudut*, *kasus pinggir* | ⚠ Only a bilingual/localization source could be fetched, not native technical prose: **"Edge case merujuk pada situasi atau kondisi yang berada di batas ekstrem dari spektrum kemungkinan"**. Many Indonesian QA texts simply keep *edge case* in English |

### 7d. Peribahasa — and the cross-cutting rule

For this set of phrases, **no genuine Indonesian *peribahasa* is the natural equivalent.** The
renderings above are descriptive collocations, not proverbs.

- *di balik layar* is a **fixed figurative collocation**, not a peribahasa — KBBI's *layar* entry
  lists only literal senses with **no idiom sub-entry**. The figurative use is nonetheless standard
  in Indonesian technical writing.
- ⚠ Proverbs sometimes proposed for "step by step" (e.g. *sedikit demi sedikit, lama-lama menjadi
  bukit*) express **cumulative effort**, not **ordered procedure**, and are a register mismatch in
  instructional UI. **Not recommended.**

**Three strategies — and picking the wrong one is the tell:**

1. **Substitute a native collocation** — step by step, under the hood, in a nutshell, keep in mind,
   the big picture, at a glance, from scratch.
2. **Translate to a settled Indonesian term** — best practice → *praktik terbaik*; out of the box →
   *siap pakai*; cheat sheet → *catatan ringkas*.
3. **Retain the English term + gloss on first use** — trade-off, garbage in / garbage out, deep
   learning, and optionally edge case.

**Retention is normal and professional in Indonesian technical prose** (§6a); a forced calque is
not. The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: <https://kbbi.kemendikdasmen.go.id/entri/percuma> (re-fetched 2026-07-26) ·
<https://kbbi.kemendikdasmen.go.id/entri/singkat> · <https://kbbi.kemendikdasmen.go.id/entri/sekilas> ·
<https://kbbi.kemendikdasmen.go.id/entri/patokan> · <https://kbbi.kemendikdasmen.go.id/entri/coba-coba> ·
<https://kbbi.kemendikdasmen.go.id/entri/layar> (negative evidence — no idiom sub-entry) ·
ds.umsu.ac.id · terapan-ti.vokasi.unesa.ac.id · s1pbsi.fbs.unesa.ac.id · el.iti.ac.id ·
poltekbangplg.ac.id · universitas123.com · mahasiswaindonesia.id · bidangusaha.co.id ·
<https://id.wikipedia.org/> (⚠ tertiary, labeled inline)

---

## 8. Simplified-language pendant (`id-easy`)

**(Honest ❌ on the standard — plus a real, clearly-labeled quantitative substitute.)**

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages finds
the same seven answers in the same seven places.

**Read this before §8c: for Indonesian there is no corpus measurement, and this pass did not produce
one.** In most guides in this kit §8c counts a plain-register corpus against a standard one, and the
count overturns rows of the word table. **Here no count was run**, for two reasons that must not be
blurred together: the one same-publisher plain/standard lead — a children's magazine and the adult
newspaper published by the same house — **declines automated text collection**, a stated position that
the kit respects; and the graded-reader platforms, whose access policies are open, are **JavaScript
applications whose story text is not in the page at all**. The consequences: **§8d contains no measured
reversals**, the ⚠ rows of §8b's word table stay ⚠, and the numeric anchor for `id-easy` remains the
official sentence caps of §8a — which are sourced from an issuing body and are stronger than anything a
confounded pair could have produced.

### 8a. The standard — ❌ none exists, and ✅ the substitute that does

#### ❌ There is no Indonesian easy-read standard

> **No official Indonesian "Easy Read" / plain-language standard exists**, comparable to German
> *Leichte Sprache*, the EU Easy-to-Read guidelines, or UK Easy Read. No government-issued
> specification for simplifying language for readers with intellectual disability was found.

**Evidenced from the statute.** *UU No. 8 Tahun 2016 tentang Penyandang Disabilitas* — the
disability-rights act — names accessibility **modalities**, not linguistic simplification. Pasal 24:

> **"Hak berekspresi, berkomunikasi, dan memperoleh informasi untuk Penyandang Disabilitas meliputi
> hak:"** … **"b. mendapatkan informasi dan berkomunikasi melalui media yang mudah diakses; dan"** …
> **"c. menggunakan dan memperoleh fasilitas informasi dan komunikasi berupa bahasa isyarat, braille,
> dan komunikasi augmentatif dalam interaksi resmi."**

And the official elucidation defines the key phrase as **channel** accessibility:

> **"Yang dimaksud dengan 'media yang mudah diakses' adalah media komunikasi yang dapat diakses oleh
> berbagai ragam Penyandang Disabilitas."**

**Reading:** the statute is modality-based. **There is no legal hook for a mandated Indonesian
plain-language register. Any "Easy Indonesian" variant is a voluntary editorial standard — describe
it as such and never claim legal conformance.**

⚠ **Completeness caveat, stated honestly:** the research's web-search quota was exhausted partway
through. This is a **strong** negative, not an exhaustive one. A dedicated follow-up sweep on
*bacaan mudah* and on named disability organizations was **not** completed.

#### ✅ The substitute — a book-leveling standard, and what it is not

**What does exist, and is genuinely usable, is a government *book-leveling* standard**: the
**Pedoman Perjenjangan Buku**, issued by **Pusat Perbukuan, Badan Standar, Kurikulum, dan Asesmen
Pendidikan (BSKAP)** of the education ministry.

> **⚠ Label this correctly wherever it is cited. It is a *literacy* instrument, not a *disability*
> instrument, and not a national plain-language norm.** It is carried here because it is the only
> Indonesian source found that states **hard numeric limits on sentence and paragraph length** from
> an official issuing body — which makes it the defensible quantitative anchor for `id-easy` in the
> absence of a real standard. **Cite it as *inspired by*, never as compliance.**

It defines a leveled book as **"buku dengan materi, gambar, dan bahasa yang tingkat kesulitan atau
kompleksitasnya meningkat secara bertahap."** — and, crucially for an **adult** easy-language
variant, it explicitly **rejects age as the grading axis**:

> **"Catatan: Rentang usia merupakan kesetaraan jenjang, bukan menjadi acuan utama perjenjangan buku.
> Acuan utama tetap pada kemampuan membaca."**

That is the Indonesian standard itself saying reading ability, not age, is the criterion — exactly
the logic an Easy variant needs (adult reader, simplified text, no infantilization).

**The numbers** (all verbatim from the *Pedoman*):

| Jenjang | Reader class | Max words/sentence | Sentences & paragraphs per page | Vocabulary |
|---|---|---|---|---|
| **A** | Pembaca Dini | **"Maksimal 5 kata per kalimat."** | **"Maksimal 3 kalimat per halaman."** | — |
| **B1** | Pembaca Awal | **"Maksimal 7 kata per kalimat."** | **"Maksimal 5 kalimat per halaman."** | — |
| **B2** | Pembaca Awal | **"Maksimal 9 kata per kalimat."** | **"Maksimal 7 kalimat per halaman."** | **"Memuat 50–100 kata yang sering digunakan."** |
| **B3** | Pembaca Awal | **"Maksimal 12 kata per kalimat."** | **"Maksimal 3 paragraf per halaman (maksimal 3 kalimat per paragraf)."** | **"Memuat 100–200 kata yang sering digunakan."** |
| **C** | Pembaca Semenjana | **"Maksimal 12 kata per kalimat."** | **"Maksimal 4 paragraf per halaman (maksimal 5 kalimat per paragraf)."** | **"Menggunakan variasi kalimat tunggal dan kalimat majemuk."** |
| **D** | Pembaca Madya | — | — | **"Memuat lebih dari 600 kata."** |
| **E** | Pembaca Mahir | — | — | **"Memuat lebih dari 900 kata yang sering digunakan."** |

> **🔑 Anchor `id-easy` at Jenjang C.** It is the highest level that still carries an explicit
> sentence cap (**"Maksimal 12 kata per kalimat"**), it permits compound sentences, and it is not
> pitched at emergent child readers. For a harder-simplified tier, **B3** gives 12 words/sentence
> plus the 3-paragraph / 3-sentence page structure.

⚠ **Provenance caveats:** the fetched copy is a **slide-deck rendering** of the *Pedoman*, mirrored
on a book-publishers' association site; some slides carry a personal authorship line. **The issuing
bodies named on the cover are official.** The underlying regulation is referenced in search results
as **SK 030/P/2022** — that host returned ENOTFOUND, so **the regulation number is ⚠ unverified
(search-result title only, not fetched).**

#### ⚠ EYD is a correctness norm, NOT a plain-language norm

EYD V describes itself as **"Ejaan Bahasa Indonesia yang Disempurnakan (EYD) adalah pedoman resmi
yang dapat dipergunakan oleh instansi pemerintah dan swasta serta masyarakat dalam penggunaan bahasa
Indonesia secara baik dan benar."** (<https://ejaan.kemendikdasmen.go.id/>).

> **"Bahasa Indonesia yang baik dan benar" is a correctness/formality norm** — spelling, standard
> vocabulary, standard morphology. Following it pushes text *toward* the formal register, which is
> frequently the **opposite** of what an Easy variant needs. **EYD governs *how you spell*; nothing
> in it governs *how simply you write*.** Do not let a reviewer cite EYD as evidence that formal,
> nominalization-heavy prose is "correct Indonesian" for the easy tier.

#### ⚠ Readability formulas — do not use

Indonesian academic literature adapting Gunning Fog, Flesch Reading Ease, Fry Graph, and SMOG appears
to exist, but **the journal endpoints were unreachable** (one login wall, one HTTP 403). **No
readability formula officially adapted to or endorsed for Indonesian could be confirmed.** Treat
"use Flesch for Indonesian" as **unsupported** — Indonesian's agglutinative morphology and syllable
structure make direct transfer of English syllable-counting formulas dubious in any case. **Prefer
the *Perjenjangan Buku* words-per-sentence caps**, which are official and stated as absolute counts.

#### Term-preservation rule (restated, binding)

In `id-easy`, **keep the technical term and explain it** — never swap in a folksy stand-in. Keep e.g.
**kecerdasan buatan**, then *"artinya: …"*, then a concrete example. This is distinct from the
formal→everyday table in §8b, which targets bureaucratic *non-technical* vocabulary.

### 8b. The axis — 🔑 Indonesian formality is structural before it is lexical

**Name the axis, and note which half of it carries evidence.** Indonesian formality is carried mainly
by **affixed nominalizations** (`peng-…-an`, `pe-…-an`, `ke-…-an`) and by the **light-verb pattern**
`melakukan / mengadakan + nominalisation`. Unwinding these back into plain verbs is the single biggest
readability win, and it **directly serves** the 12-words-per-sentence cap of §8a.

- ✅ **menguji** — ❌ **melakukan pengujian**
- ✅ **melatih** — ❌ **mengadakan pelatihan**
- ✅ **menjelaskan** — ❌ **memberikan penjelasan**
- ✅ **melaksanakan** — ❌ **melakukan pelaksanaan**

**Put this above any word-swap list in the `id-easy` checklist.**

⚠ **What is sourced here, and what is not.** The **affix inventory itself is sourced** — EYD V's *Kata
Turunan* rule and the `peN-…-an` / `ke-…-an` derivations are quoted in §4b(2). The **register claim** —
that these forms are what make a text *feel* formal — is **this guide's own reading and carries no
citation.** It does not need one to be actionable, because the *Pedoman Perjenjangan Buku* supplies an
independent structural reason to unwind them: each unwinding removes words, and the Jenjang C anchor is
an absolute word count per sentence (§8a). **Follow the rule for the sourced reason; do not present the
register claim as sourced.**

**Formal → everyday word table.** Verified against KBBI VI where marked ✅. The evidence pattern is the
strongest lexical evidence this section has: **KBBI itself defines the hard word using the easy word.**
⚠ **Five rows carry no such evidence** and are marked; §8d says what may and may not be done with them.
**No corpus stands behind any row** — none was built (§8c) — so a ✅ here means *the dictionary glosses
the formal word with the everyday one*, and nothing about which of the two a reader meets more often.

| Formal / complex ❌ | Everyday equivalent ✅ | KBBI evidence |
|---|---|---|
| mengimplementasikan | **menerapkan**, melaksanakan | *implementasi*: **"n pelaksanaan; penerapan"** ✅ |
| mengoptimalkan | **membuat sebaik mungkin** | *optimal*: **"a terbaik; tertinggi"** ✅ |
| utilisasi | **penggunaan**, pemanfaatan | *utilisasi*: **"n pemanfaatan sesuatu secara praktis dan efektif"** ✅ |
| signifikan | **penting**, besar | *signifikan*: **"a penting; berarti"** ✅ |
| komprehensif | **menyeluruh**, lengkap | *komprehensif*: **"a luas dan lengkap (tentang ruang lingkup atau isi)"** ✅ |
| terminologi | **istilah** | *terminologi*: **"n peristilahan (tentang kata-kata)"**; *istilah*: **"n kata atau ungkapan khusus"** ✅ |
| apotik ❌ (misspelling) | **apotek** ✅ | KBBI marks *apotik* **bentuk tidak baku** ✅ |
| via | **lewat**, melalui | ⚠ unverified |
| sehubungan dengan | **karena** | ⚠ unverified |
| dalam rangka | **untuk** | ⚠ unverified |
| melakukan pengujian | **menguji** | ⚠ unverified (nominalization → verb; pattern is sound but not source-backed) |
| mengadakan pelatihan | **melatih** | ⚠ unverified (same light-verb pattern) |

### 8c. 🔴 The honest negative — the corpus attempt, and the two distinct reasons it failed

**What was sought.** The design this kit uses elsewhere: **one publisher, two editions of the same
material** — one standard, one plainer — so that publisher, genre, and topic are held constant and only
reading level varies. Failing that, a graded-reader collection carrying explicit level labels from a
single publisher.

**Indonesian has the right shape, and it is out of bounds.** This is the finding worth recording,
because it is not the usual "nothing exists" result: a long-running Indonesian **children's magazine**
and, **under the same publishing house**, its **adult general-news edition** are exactly the pair the
kit's design asks for — one house, one country, two reading levels. The graded-reader libraries below
are the same story a second time. Neither route produced a corpus, and **they failed for two different
reasons, which must be kept apart:**

> **(ii) The publisher declines automated text collection.** The children's magazine's access policy
> names a long list of **automated text-collection agents** and disallows them; the adult edition of
> the same house carries the same blanket block, extended to an archiving crawler. A third candidate —
> an Indonesian-language international broadcaster, considered as a simplified-register cross-check —
> states in the preamble of its access policy that its content may not be used **for training or
> fine-tuning AI models, for retrieval augmentation, or for building datasets**.
>
> **These are stated positions, not technical obstacles.** Each was read as a refusal: the host was
> dropped, and **no workaround was attempted.** None is to be attempted later either. That the pages
> are served over HTTP is not permission, and nothing in this guide should be read as an invitation to
> route around a publisher's decision. The only acceptable route to this material is a **licensed or
> manually agreed** one.

> **(iii) The text is not in the page.** The best-shaped leads of all — two international graded-reader
> libraries carrying **leveled Indonesian stories from one publisher**, plus a regional third — have
> **open access policies. They do not decline collection.** The problem is different in kind: each
> story URL returns the **identical few-kilobyte JavaScript application shell** with a generic title
> and no article body, because the content is assembled in the browser. On one of them the underlying
> data API answers `403 {"error":"unauthorized"}` and requires a key.
>
> **A client-rendered application is not a refusal and must not be filed as one.** Nobody said no; plain
> HTTP simply retrieves no Indonesian text. The distinction matters for §8g: a refusal is settled until
> the publisher decides otherwise, whereas this one is unblocked the moment an API key or a publisher
> export exists.

**Also checked, and unresolved.** Four host names for the Indonesian government's graded-reader
program (*Buku Bacaan Berjenjang*) **failed to resolve or connect** from the measurement network —
**not rejected on the merits, simply unreachable**; whether the program publishes collectible text is
unknown. And the shape that supplies a ready-made leveled pair in English — a "Simple Indonesian"
sister encyclopedia — **does not exist**: no such project is listed.

**No pair was built, and the reachable fallback is not a leveled one.** Two hosts were both reachable
and enumerable: an Indonesian-language broadcaster's news site and the Indonesian encyclopedia. **Both
are adult, general register.** They differ in genre (broadcast news against encyclopedic reference) and
in publisher, and **neither is graded**. They can serve as two independent adult-register cross-checks
against each other; **they cannot serve as a plain-against-standard pair, and were not used as one.**

**Consequence, stated plainly.** No frequency, ratio, or corpus size appears anywhere in this section,
because none was produced. §8d reverses nothing on evidence; the ⚠ rows of §8b stay ⚠; and the
quantitative anchor for `id-easy` remains the *Perjenjangan Buku* caps of §8a — official, absolute, and
stronger than any count a confounded pair could have yielded.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none is presented as one.** In the measured guides of this
kit, §8d is where a corpus count deletes or inverts a word pair. **Indonesian has no count** (§8c), so
this list does two narrower things: it marks what §8b's table rests on, and it carries one
cross-language finding as a reason to verify — never as an Indonesian result.

| Do **not** do this | Why |
|---|---|
| ~~read the ⚠ rows of §8b as evidence~~ | **`via`, `sehubungan dengan`, `dalam rangka`, `melakukan pengujian`, `mengadakan pelatihan` carry no source.** The last two follow the sourced structural pattern of §8b, which is why they are plausible; the first three are editorial judgment. Apply all five as hints, and never cite them. The ✅ rows are different in kind — there **KBBI itself defines the formal word with the everyday one**, which is dictionary evidence and the strongest lexical evidence in this section. |
| ~~assume the borrowed or learned word is the harder one~~ | **⚠ Cross-language finding, requiring local verification — not a fact about Indonesian.** Across the languages in this kit where a plain-against-standard count *was* run, one result recurs: **the learned or borrowed word is not reliably the harder one**, and a "simplification" frequently swaps a common word for a **rarer** one, making the text harder. **Rarity, not etymology, is what makes a word hard.** This bites in Indonesian specifically because §8b's ✅ rows are mostly Latinate borrowings replaced by native forms — and **a KBBI gloss tells you what a word means, never which of the two a reader meets more often.** No Indonesian count exists to confirm or refute the finding here. Verify each swap with a native reader; do not generalize the ✅ rows into "replace the borrowing". |
| ~~simplify by word length alone~~ | Same failure one step down: a shorter word is not automatically a commoner one. In Indonesian the reliable win is **unwinding the nominalization and the light verb** (§8b) — the sentence shrinks, the long `peng-…-an` forms go with it, and the Jenjang C word cap is served directly. |
| ~~voice-flip the `di-` passive~~ | ⚠ **The `di-` passive is NOT a defect in Indonesian** (§4b(2)). The kit's general "prefer active voice" rule must not be applied mechanically here: *"Model dilatih dengan data ini"* is plain, natural Indonesian, and forcing an English-style active agent into it makes the sentence **longer and stranger**, not simpler. Simplify by shortening and de-nominalizing, not by voice-flipping. |
| ~~cite EYD as evidence that formal prose is the "correct" easy tier~~ | EYD is a **correctness** norm and pushes text toward the formal register (§8a). It governs *how you spell*, not *how simply you write*. |
| ~~reach for a readability formula~~ | No formula officially adapted to or endorsed for Indonesian could be confirmed (§8a), and English syllable-counting transfers badly to Indonesian morphology. Use the *Perjenjangan Buku* word caps instead. |
| ~~claim legal or standard conformance~~ | *UU No. 8/2016* is **modality**-based, not linguistic (§8a): there is no legal hook for a mandated plain Indonesian. And the *Perjenjangan Buku* is a **literacy** instrument, not a disability one — cite it as **inspired by**, never as compliance. |
| ~~swap the technical term for a folksy stand-in~~ | Binding, restated from §8a: keep **kecerdasan buatan**, then *"artinya: …"*, then a concrete example. With no corpus, a replacement is a guess; an explanation is not. |
| ~~drift to `kamu`, or to colloquial `cak` forms~~ | Simplification is not informalization (§9) and simplified is not childish (§8e). |

> **→ The rule that follows.** For Indonesian, **the structural rule is the strong evidence and the
> word list is the weak evidence** — the reverse of the usual split, and it is why §8b names the axis
> structurally. Take the leverage from §8f in the order given, apply §8b's ✅ rows with the dictionary
> behind them, treat the ⚠ rows as hints, and record that no Indonesian count exists to promote either.

### 8e. 🔑 The address decision — `id-easy` keeps §4a's register, on evidence plus convention

> **Decision, recorded so that nobody "fixes" it: `id-easy` uses the register recorded in §4a —
> capitalized **`Anda`** used sparingly, with **pronoun-free impersonal phrasing** as the workhorse.
> It does NOT switch to `kamu`, and UI microcopy drops the pronoun entirely.**

- ✅ **Klik tombol berikut.** — pronoun-free imperative, in `id` and in `id-easy` alike
- ❌ **Kamu klik tombol berikut.** — wrong register for an adult reader, and no easier for being familiar

**The grounds are §4a's, and they are part evidence and part convention — say which.** The **evidence**
half is dictionary-grade: KBBI defines `Anda` with an explicit status-neutrality clause — **"(tidak
membedakan tingkat, kedudukan, dan umur)"**, *it does not distinguish rank, position, or age* — while
`kamu` carries **no neutrality clause at all**; and Indonesian government teacher-education material
observably avoids second-person address, using impersonal and inclusive-`kita` constructions. The
**convention** half is the choice itself: §4a records it under the kit's
[human-gate](../human-gate.md) rule as a **project decision, taken and recorded**, not a ruling by any
language authority — and §4a flags honestly that **the recommendation is reasoned, not measured**, since
no published Indonesian study comparing `Anda` and `kamu` on comprehension could be fetched. **Nothing
in §8 changes either half.**

**⚠ §8 adds nothing in either direction, and one source argues against drifting.** No source cited in
§8a states an address rule. With no corpus (§8c), there is no frequency evidence to appeal to. But the
*Perjenjangan Buku* does supply a sourced argument against the specific temptation to drop to `kamu`
because a text is simplified: the standard itself makes **reading ability, not age**, the grading
criterion — **"Rentang usia merupakan kesetaraan jenjang, bukan menjadi acuan utama perjenjangan buku.
Acuan utama tetap pada kemampuan membaca."** An adult reading at Jenjang C is an **adult**. Switching to
`kamu` marks age where the variant is marking reading level, which is precisely the infantilization
`id-easy` exists to avoid. **Treat §8 as silent on the choice of address, and this quote as binding on
the reason not to change it.**

### 8f. What `id-easy` is built on, in order of leverage

`id-easy` **inherits the kit's base simplified-language rules** from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md) — one idea
per sentence, everyday words, say what *is* not what *isn't*, active voice, a one-line "what is this"
opener, a consistent literal tone — and adds these **Indonesian-specific overlays**, in the order their
leverage actually runs:

1. **Unwind nominalizations and light verbs — first, and above any word-swap list** (§8b). The single
   biggest readability win in Indonesian, and the one that also buys the sentence cap: every unwinding
   removes words. ⚠ The register claim behind it is this guide's; the affix inventory and the word cap
   it serves are both sourced (§8b).
2. **≤ 12 words per sentence** (Jenjang C anchor, §8a) — **a sourced Indonesian figure**, stated as an
   absolute count by an official issuing body. Where it differs from the kit's own tighter ~8–12-word
   target, the kit figure may be used; the Indonesian number is the sourced anchor. For a
   harder-simplified tier, **B3** adds the 3-paragraph / 3-sentence page structure (§8a).
3. **The kit's base plain-language rules**, inherited as above — Indonesian contributes no easy-read
   standard of its own (§8a), so the base rules are not a fallback here but the actual rule set.
4. **Term preservation before substitution** — keep the technical term, then *"artinya: …"*, then an
   example (§8a). With no lexical corpus evidence available (§8c), explaining beats replacing.
5. **The recorded register, held steadily** (§8e) — sparing capitalized `Anda` plus pronoun-free
   phrasing. Do **not** drift to `kamu` for "friendliness"; simplified is not childish.
6. **Guardrail, not a lever: the `di-` passive is NOT a defect** (§4b(2), §8d). Do not let the kit's
   general active-voice rule fire on it. Shorten and de-nominalize instead.
7. **No colloquial (`cak`) forms** (§9) — simplification is not informalization.
8. **Vocabulary substitution last** — §8b's ✅ rows with the dictionary behind them, its ⚠ rows as hints
   only (§8d). Nothing here licenses a bulk find-and-replace over Indonesian vocabulary.

### 8g. What is still open

1. **The corpus that would settle this exists and is closed to automated collection.** A single house
   publishing a children's magazine and an adult newspaper is precisely the same-publisher pair the
   kit's design wants. It declines automated text collection (§8c), and that is to be respected, not
   circumvented. **A licensed or manually agreed route is the only route** — and it is the single
   highest-value thing a later pass could obtain for Indonesian.
2. **The graded-reader libraries are the best-shaped lead and the most tractable blocker.** Leveled
   Indonesian stories, one publisher, explicit reading levels, **and an open access policy** — blocked
   only by client-side rendering and an API key (§8c). **An API key or a publisher-supplied export
   unlocks a genuinely leveled Indonesian corpus.** Unlike item 1 this needs no change of position by
   anyone, only credentials.
3. **The government graded-reader program was unreachable** — four host names failed to resolve from
   the measurement network (§8c). Existence and content unverified; a run from another network could
   settle it cheaply.
4. **The ❌ on the easy-read standard is strong but not exhaustive** (§8a). The web-search quota ran out
   partway; a dedicated sweep on *bacaan mudah* and on named disability organizations was **not**
   completed.
5. **The *Perjenjangan Buku*'s underlying regulation number is ⚠ unverified** — cited in search results
   as SK 030/P/2022, but that host returned ENOTFOUND, so the number was never fetched (§8a). The
   fetched copy is a slide-deck rendering mirrored on a publishers'-association site; the issuing bodies
   on its cover are official.
6. **No Indonesian-adapted readability formula could be confirmed** (§8a) — the journal endpoints were a
   login wall and an HTTP 403. If an endorsed adaptation exists, it would give `id-easy` a second
   quantitative check alongside the word caps.
7. **Five rows of §8b's word table are ⚠ unverified** and none of the table has had a native-speaker
   pass. That pass is the cheapest available improvement to this section.
8. **The register claim in §8b is unsourced** — that nominalizations and light verbs are what *make*
   Indonesian prose feel formal. Either an Indonesian style authority states it, or it stays this
   guide's reading (the rule survives either way, on the word-count argument).
9. **The address decision is reasoned, not measured** (§8e, §4a). A native-speaker or a measured study
   could refine it; §8 cannot.
10. **Jenjang D and E carry no sentence cap at all** — the *Pedoman* states only vocabulary counts for
    them (§8a). Anchoring `id-easy` above C would therefore mean giving up the numeric anchor entirely,
    which is why C is the anchor.
11. **No comprehension evidence exists for any of this.** Nothing here has been tested on the readers
    `id-easy` is written for.

Sources: *Pedoman Perjenjangan Buku* (Pusat Perbukuan / BSKAP), slide-deck rendering mirrored at
`ikapi.org` ✅ fetched and text-extracted (⚠ see caveats in §8a) · UU No. 8/2016 full-text PDF ✅
fetched and text-extracted · <https://ejaan.kemendikdasmen.go.id/> ·
<https://kbbi.kemendikdasmen.go.id/> (implementasi, optimal, utilisasi, signifikan, komprehensif,
menyeluruh, terminologi, istilah, apotek; Anda / kamu re-fetched for §4a and cited in §8e) ·
`static.buku.kemdikbud.go.id` ❌ ENOTFOUND (SK number ⚠ unverified) · readability journals ❌ login
wall / 403 · **Corpus (§8c): none.** No count was run and no frequency, ratio, or corpus size is
reported anywhere in this section. The leads checked and their outcomes — a same-publisher
children's-magazine / adult-newspaper pair and an international broadcaster that **decline automated
text collection**; graded-reader libraries whose **story text is not in the page**; unreachable
government hosts; and a reachable but ungraded adult-register fallback that was **not** used as a
leveled pair — are recorded in §8c so that a later pass inherits the negative result instead of
repeating it. The kit's base rules in
[accessibility-workflow](../accessibility-workflow.md) govern `id-easy`.

---

## 9. Regional variation

**(Strong section — the ID/MY boundary, MABBIM, the `cak` register labels and the tagging rules are
all primary-sourced. Malaysian-side lexical claims carry ⚠ because the Malaysian dictionary portal
timed out.)**

### 9a. Indonesian and Malaysian Malay are two standards, not two dialects

They are **separate national standard languages with separate regulators**. From the Malaysian
language authority's own site:

> **"Majlis terdiri daripada Dewan Bahasa dan Pustaka Brunei Darussalam, Badan Pengembangan dan
> Pembinaan Bahasa Indonesia, dan Dewan Bahasa dan Pustaka Malaysia."**

Three sovereign standard bodies, one per country.

> **Practical consequence, binding: an `id` build must never be produced from, or merged with, Malay
> content.** They diverge in vocabulary, in preferred loan sources, and in register conventions.
> **Ship `id` from Indonesian sources only.**

### 9b. MABBIM — the coordinating council, and the limit of its reach

**MABBIM** = *Majlis Bahasa Brunei Darussalam-Indonesia-Malaysia*:

> **"MABBIM ialah sebuah badan kebahasaan serantau yang dianggotai oleh tiga negara, iaitu Negara
> Brunei Darussalam, Indonesia dan Malaysia."** · **"Asalnya Majlis ini dinamakan Majlis Bahasa
> Indonesia – Malaysia (MBIM), yang ditubuhkan pada 29 Disember 1972"** · **"…ditukar menjadi
> MABBIM… apabila negara Brunei Darussalam ikut serta sebagai anggota tetap Majlis ini pada
> 4 November 1985."** · **"Singapura telah ikut serta dalam Sidang ini sejak tahun 1985 sebagai
> negara pemerhati sehingga kini."**

Purpose, verbatim: **"Wadah kerjasama kebahasaan MABBIM ini bertujuan untuk membina dan mengembangkan
bahasa rasmi atau bahasa kebangsaan… menjadi bahasa peradaban tinggi, bahasa ilmu, bahasa sains,
bahasa teknologi moden, bahasa perusahaan, dan bahasa ekonomi."** The Indonesian ministry describes
the remit as coordination: **"Mabbim sejak awal berdiri menjadi simbol koordinasi kebijakan,
peristilahan tata bahasa, dan pelestarian bahasa negara anggota."**

> **Interpretation — important for terminology work.** MABBIM harmonizes **technical terminology
> (*peristilahan*)** and spelling conventions. It does **not** merge the standards and has no
> authority over everyday vocabulary. So **scientific and technical coinages often align across ID
> and MY, while ordinary prose diverges sharply.** For an AI-education platform this is a mixed
> blessing: the terminology layer may look similar; the running text will not. **Never conclude "the
> terms match, so the Malay copy is reusable."**

⚠ The commonly-repeated claim that the 1972 founding coincided with a **joint ID/MY spelling reform**
aligning the two orthographies is **unverified** — the date *29 Disember 1972* is verified, the
spelling-reform linkage is not.

### 9c. False friends across the boundary

| Word | Indonesian (`id`) — KBBI-verified | Malaysian Malay (`ms`/`zsm`) | Risk |
|---|---|---|---|
| **percuma** | **Two senses, sense 1 first**: **"a tidak ada gunanya (hasilnya dan sebagainya); sia-sia"**; sense 2 **"a cuma-cuma; gratis"** ✅ **re-fetched 2026-07-26** | *free of charge* ⚠ *(community-encyclopedia source; the Malaysian dictionary portal timed out)* | 🔴 **Highest — see §7a. Use `gratis`.** |
| **pejabat** | **"n pegawai pemerintah yang memegang jabatan penting (unsur pimpinan)"** = *an official (a person)*. The 'office' sense exists but is tagged **kl** (klasik/archaic) ✅ | = *office (the building/bureau)* — live usage on the Malaysian authority's own site: **"Pejabat Ketua Pengarah"** ✅ | 🔴 **High** — animate vs inanimate; silently wrong |
| **kantor** | **"n balai (gedung, rumah, ruang) tempat mengurus suatu pekerjaan"**; **"n tempat bekerja"** ✅ | *pejabat* used instead | 🟠 Use **kantor** in `id` |
| **karcis / tiket** | **Both standard Indonesian**, mutually defining — *tiket*: **"n karcis kapal, pesawat terbang, dan sebagainya"** ✅ | ⚠ unverified | 🟢 Low — see correction below |
| **apotek** | Standard; *apotik* flagged **bentuk tidak baku** ✅ | *farmasi* ⚠ unverified | 🟡 In `id`, the **spelling** error matters more than the ID/MY contrast |

- ✅ **Kursus ini gratis.** · ✅ **Kantor kami di Jakarta.**
- ❌ **Kursus ini percuma.** · ❌ **Pejabat kami di Jakarta.** (reads "our official is in Jakarta")

**⚠ Two corrections to commonly-repeated assumptions**, both evidence-based:

1. ***karcis* vs *tiket* is NOT a Dutch-vs-English ID/MY split.** KBBI defines each by the other;
   both are current standard Indonesian.
2. ***apotek* vs *apotik* is a spelling-standard issue, not a regional one.** *apotik* is simply
   substandard Indonesian (§6b).

### 9d. Formal vs colloquial (*bahasa baku* vs *bahasa gaul*) — and the `cak` label

Indonesian has a sharp **diglossia**, and KBBI encodes it directly with the usage label **`cak`**
(*ragam cakapan*, colloquial register) — the authoritative, quotable way to classify these forms:

| Colloquial ❌ | KBBI entry (verbatim) | Standard equivalent ✅ |
|---|---|---|
| **gue** | **"pron cak aku; saya"** ✅ | *saya* |
| **nggak** | **"adv cak tidak"** ✅ | *tidak* |
| **banget** | **"adv cak sangat"** ✅ | *sangat* |
| **kayak** | **"p cak sebagai; seperti"** ✅ | *seperti* |

That every one carries `cak` is the evidence: **KBBI recognizes them as real Indonesian words but
marks them as non-standard register.** They are not errors — they are the wrong *register* for an
educational platform. (Note from §4b(4) that even `kita` has a `cak` sense meaning *saya*; the label
is applied per-sense, not per-word.)

**Target register — "standard but warm":** *baku* grammar, conversational rhythm.

- ✅ **saya**, **Anda**, **tidak**, **sangat**, **seperti**, **menjelaskan**
- ❌ **gue**, **lu**, **nggak**, **banget**, **kayak**, **jelasin** — all colloquial
- ⚠ Avoid the colloquial **`-in` suffix** replacing standard `-kan` (*jelasin*, *bikinin* →
  *menjelaskan*, *membuatkan*). *(The pattern description is unverified; the `cak` labels above are
  the verified part.)*
- ⚠️ **But do not over-formalize.** Bureaucratic Indonesian (*dalam rangka*, *sehubungan dengan*,
  heavy `peng-…-an` stacking) is standard **and** unreadable. §8b's structural rule applies: plain
  verbs, short sentences, standard vocabulary.

**The target:** an Indonesian reader should recognize the text as correct enough for a schoolbook
and relaxed enough to read voluntarily.

### 9e. Neutrality strategy: ship one national `id`

> **Recommendation: no regional targeting. There is no `id-JV` / `id-SU` locale to build, and
> creating one would be a mistake.**

Reasoning, evidenced:

1. **Regional influence enters through the colloquial layer, which is already excluded.** The
   `cak`-marked stratum in §9d is precisely where regional and Jakarta forms live. Excluding `cak`
   excludes the problem.
2. **KBBI already isolates regional vocabulary with its own labels**, so it is identifiable and
   avoidable — the second homonym of *banget* is labeled **`Ss`** (Sundanese): **"n Ss penganan
   dari beras ketan yang dikukus"**, while the colloquial intensifier is `adv cak`. Standard
   Indonesian carries neither label.
3. **The standard is national by construction.** EYD V addresses itself to **"instansi pemerintah
   dan swasta serta masyarakat"** — one norm, nationwide, no regional variants.

A Javanese or Sundanese speaker reads standard Indonesian without friction; it is the shared
national language, not a second-best compromise (see the L2 point in the header).

### 9f. Locale and standard codes

Verified against the **IANA Language Subtag Registry**, `File-Date: 2026-06-14`:

| Subtag | Registry record (verbatim) |
|---|---|
| **`id`** | **"Subtag: id"** / **"Description: Indonesian"** / **"Added: 2005-10-16"** / **"Suppress-Script: Latn"** / **"Macrolanguage: ms"** |
| **`ms`** | **"Subtag: ms"** / **"Description: Malay (macrolanguage)"** / **"Suppress-Script: Latn"** / **"Scope: macrolanguage"** |
| **`zsm`** | **"Subtag: zsm"** / **"Description: Standard Malay"** / **"Added: 2009-07-29"** / **"Macrolanguage: ms"** |

Cross-checked against **ISO 639-3**: `ind` — Reference Name **"Indonesian"**, Scope "Individual",
Type "Living", **"Indonesian is a member of the macrolanguage Malay (macrolanguage)."**

**Tagging rules that follow:**

- ✅ **`id`** — the correct BCP 47 tag.
- ❌ **`id-Latn`** — `Suppress-Script: Latn` makes the script subtag redundant and non-canonical.
- ❌ **`id` → `ms` fallback** — `id` is **not** a subset of `ms`; both are *individual* languages
  under the `ms` macrolanguage. **Malay content is not an Indonesian fallback.** Check the
  locale-negotiation layer explicitly: generic macrolanguage-aware fallback logic **will** get this
  wrong, and the §7a `percuma` failure is exactly what it produces.
- `ms` is **ambiguous** (macrolanguage); **`zsm`** is the precise tag for Malaysian Standard Malay if
  ever added.
- For the Easy variant there is **no registered BCP 47 subtag** for simplified language — follow the
  kit convention (`id-easy`).

Sources: `dbp.gov.my` MABBIM page ✅ · `kemendikdasmen.go.id` MABBIM press release ✅ ·
<https://kbbi.kemendikdasmen.go.id/> (percuma, pejabat, kantor, tiket, karcis, apotek, gue, nggak,
banget, kayak) ✅ · IANA Language Subtag Registry ✅ (File-Date 2026-06-14) · `iso639-3.sil.org` ✅ ·
<https://ejaan.kemendikdasmen.go.id/> ✅ · `prpm.dbp.gov.my` ❌ timeout — **all Malaysian-side lexical
claims marked ⚠** · `loc.gov` ISO 639-2 ❌ 403 — superseded by the IANA registry

---

