<!-- base -->
# lang-ms — Malay (Bahasa Melayu, Malaysian standard) — language guide

> **Setup & sources live in [`ms.setup.md`](ms.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Bahasa Melayu / Malay — **Malaysian standard** (*bahasa Melayu baku*).
**BCP 47 code (base):** `ms`.
**BCP 47 code (simplified variant):** `ms-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant. A strict BCP 47 rendering would need a private-use subtag
(`ms-x-simple`); the kit token `ms-easy` is the one that counts here, and there is **no registered
BCP 47 subtag for simplified language** in any case.
**Speaker reach:** ⚠ **deliberately not stated.** No primary source for L1/L2 speaker counts was
fetched during research, and a remembered figure is not a citation. **A human must supply this
number before it appears anywhere.** What *is* primary-sourced is the thing that actually drives
translation decisions — the **constitutional status**, quoted by the national language authority
itself: **"Dalam Perkara 152 Perlembagaan Persekutuan, Bahasa kebangsaan ialah bahasa Melayu dan
hendaklah dalam tulisan yang diperuntukkan melalui undang-undang oleh Parlimen."**
**Script + direction:** **Rumi** (Latin script), **26 letters, no diacritics** in running text;
**left-to-right**. **Jawi** (Arabic script) exists, is not prohibited, and is **not shipped** by this
kit — §3f documents it and says why.
**Status:** **planned — not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `ms` and the `ms-easy` pendant. Per the authoring directive's "second set of
eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header records that gap honestly.

**Section strength at a glance** (read this before trusting any one section):

| Section | Strength | Resting on |
|---|---|---|
| §2 Authorities | **Strong on who; honest ❌ on what** | DBP charter fetched; the four normative *books* are print-only and were **not** read (§2c) |
| §3 Script & typography | **Strong** | CLDR 48.2 `ms` (byte-level), Unicode character names, DBP advisory answers; one genuine DBP self-contradiction reported as such |
| §4 Grammar | **Strong** — every feature DBP-sourced | *Khidmat Nasihat* rulings, incl. the *Hukum Aneksi Persona* pair |
| §5 Numbers/dates/currency | **Strong, and the ms/id inversion is nailed** | CLDR `ms` **and** `id` side by side, plus DBP corroboration for decimal, thousands, `RM`, percent |
| §6 Terminology | **Strong where the term bank has entries; verified holes elsewhere** | *Istilah MABBIM* tri-national tables; three headline AI terms verified **absent** |
| §7 Idioms | **Renderings Official; the ❌ column is craft judgment** | *Kamus Inggeris–Melayu Dewan* via the reference portal |
| §8 `ms-easy` | **Strong on the word table; still ❌ on a standard** | No Malaysian plain-language standard located (§8a) — but the formal→everyday table is DBP's own *Kamus Pelajar* glosses plus a three-corpus frequency contrast (§8d–§8f) |
| §9 Regional variation | **Strong on ms/id; ⚠ thin on Singapore** | MABBIM tables; dictionary-vs-dictionary false-friend checks, including two **debunked** ones |

**Easy or hard for this kit:** **mechanically one of the easiest languages in the set** — Latin
script, whitespace tokenization, LTR, no shaping, no bidi, no romanization layer, effectively
ASCII-only running text, and exactly **one** plural category. The difficulty is entirely
**editorial**, and it concentrates in four places: (1) the **ms/id number-format inversion** —
decimal and grouping separators are *exactly swapped* between the two, and so is the compact-form
suffix for 10⁹ (§5a); (2) **Indonesian-sounding vocabulary** that passes every spellchecker
(*jaringan*, *perangkat lunak*, *pelatihan*, *kualitas*) (§6d, §9c); (3) **`bisa`**, which means
*venom* first in Malay and *can/able* first in Indonesian (§9c); and (4) the **agentive passive**
(*Hukum Aneksi Persona*) — English "…that you want to…" strings become `yang ingin anda <stem>` with
**no** `di-`, and getting this wrong marks the whole locale as machine-translated (§4c).

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=tulisan+Jawi+rasmi&d=175768> (Perkara 152) ·
<https://dbp.gov.my/objektif-penubuhan/> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/ms/characters.json>

---

## 1. Header block

See above. One-line orientation: Malay is a **head-initial**, LTR language in
plain Latin script with **no tense and no grammatical plural** — its complexity
sits in **affixation, the two passives, and a centrally curated tri-national terminology apparatus**
rather than in agreement morphology. The `ms` reader is overwhelmingly a **Malaysian institutional
reader**: schooled in *bahasa Melayu baku*, fluent in technical English alongside it. The failure
mode is therefore never "the reader will not understand an English loanword"; it is **"this reads as
Indonesian"** or **"this reads as a calque of English syntax."**

---

## 4. Grammar for translators

**Word order.** Malay is **SVO** and **head-initial**: the noun comes first, its modifier second —
the mirror image of English compounding. Every MABBIM term in §6 follows it.

| English | Malay | Structure |
|---|---|---|
| neural network | **rangkaian neural** | network + neural |
| computer system | **sistem komputer** | system + computer |
| language model | **model bahasa** | model + language |
| natural language processing | **pemprosesan bahasa tabii** | processing + language + natural |

- ✅ **rangkaian neural** · ✅ **model bahasa**
- ❌ **neural rangkaian** · ❌ **bahasa model** — English order; the classic machine-translation tell

**Definitions take `ialah`, not `adalah`.** DBP's *kata pemeri* rule:

> **"Kata pemeri 'ialah' menunjukkan persamaan dan hadir di hadapan frasa nama, contoh : Anak ialah
> anugerah Allah SWT; 'adalah' menunjukkan huraian dan hadir di hadapan frasa adjektif dan frasa
> sendi nama, contoh : Kursus ini adalah untuk pegawai atasan."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768> (20.02.2009)

DBP's own encyclopedia applies it: **"Kecerdasan buatan ialah cabang sains komputer."** This
decides roughly half the sentences in an educational glossary.

- ✅ **Kecerdasan buatan ialah cabang sains komputer.** — noun phrase → `ialah`
- ❌ **Kecerdasan buatan adalah cabang sains komputer.** — ⚠ rule-derived, not a quoted DBP error
  example: `adalah` before a *frasa nama* contradicts the rule above
- ✅ **Kursus ini adalah untuk pemula.** — prepositional phrase → `adalah` is correct here

### 4a. Register — the project's recorded choice

> **Register decision (human-gate): `anda`, lowercase, used sparingly, paired with
> avoidance-by-construction — taken and recorded.**
>
> **Binding for all second-person copy** in `ms` and `ms-easy`:
>
> - **Primary: `anda`**, written **lowercase** (`a` U+0061 `n` U+006E `d` U+0064 `a` U+0061) except
>   sentence-initially. **Capitalized *Anda* mid-sentence is an Indonesian marker** (§9c) and makes
>   the whole locale read as `id`.
> - **Workhorse: avoidance by construction.** Follow DBP's own house voice — imperatives softened
>   with `sila` (**"Sila rujuk…"**, **"Sila sesuaikan dengan konteks penggunaan anda"**), or
>   `Dapatkan…`, `Kongsikan…`, `Klik di sini`.
> - Reserve `anda` for **possessives** and for **relative clauses where a subject is unavoidable** —
>   *pandangan anda*, *keperluan anda*, *aplikasi yang ingin anda segerakkan*.
> - **Never `kamu`, `awak`, `engkau`, `kau`** in default content (see the table below).
> - **`tuan` / `puan` / `encik` / `cik` / `saudara` / `saudari` are address terms, not pronouns** —
>   DBP classifies them as **panggilan** tied to **"jantina, status dan situasi majlis"**. They
>   require knowing the reader's gender and status, which a web platform does not.
> - **For `ms-easy`: keep `anda`.** See §8c for the reasoning — this is the one place where the
>   obvious simplification is the wrong move.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

**Evidence 1 — DBP defines `anda` as the status-neutral pronoun.**

> **"Anda ialah kata ganti nama diri kedua yang tidak membezakan taraf, tingkat dan umur. Dalam
> majlis, perkataan anda jarang-jarang dugunakan kerana hadirin terdiri daripada pelbagai traf,
> tingkat dan umur yang melibatkan kesantunan berbahasa. Walau bagaimanapun, perkataan anda kerap
> digunakan dalam iklan."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=kata+ganti+nama+diri+kedua&d=175768> (24.07.2012)

Every alternative *asserts* a social relation. `kamu`: **"…biasanya digunakan apabila bercakap
dengan orang yang lebih muda daripada kita dan dalam situasi yang agak rasmi, misalnya apabila
seorang guru bercakap dengan muridnya."** `awak`: **"…digunakan apabila bercakap dengan orang yang
sama taraf atau sebaya dan biasanya dalam situasi yang tidak rasmi."** (20.04.2014). *engkau* / *kau*
appear in DBP's corpus only in literary dialogue. A web platform knows none of these facts about its
reader.

**Evidence 2 — DBP has approved `anda` for exactly this situation**, an instructor addressing
learners: **"Kata ganti nama diri kedua "anda" boleh digunakan dalam konteks ini."** (13.11.2009);
and generally: **"Anda dan awak merupakan kata ganti nama diri kedua dan boleh digunakan dalam
urusan formal dan tidak formal."** (14.06.2019).

**Evidence 3 — a measurement, not an impression.** Second-person forms counted in the served text of
eight Malaysian institutional and news homepages (fetch, strip markup, unescape entities,
case-insensitive whole-word count):

| Page fetched | text chars | **anda** | awak | kamu | engkau | kau | saudara | tuan | puan |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| National government portal (Official) | 15 214 | **17** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Science/technology ministry (Official) | 13 085 | **3** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| DBP's own site (Official) | 9 088 | **1** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Education ministry (Official) | 9 950 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 4 |
| Digital-government agency (Official) | 11 478 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Malay encyclopedia article (Community) | 11 295 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Malaysian news homepage A (Community) | 7 209 | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Malaysian news homepage B (Community) | 826 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**`awak`, `kamu`, `engkau` and `kau` occur exactly zero times across every Malaysian institutional
page measured.** `anda` is the only reader-facing pronoun that appears at all. Verbatim samples from
the national government portal: **"Apa yang anda cari?"**, **"Adakah portal ini membantu anda?"**,
**"Kongsikan pandangan anda"**, **"Anda digalakkan untuk merujuk portal rasmi…"** — and from DBP's
own cookie notice: **"Laman Web ini menggunakan cookies untuk memastikan anda mendapat pengalaman
terbaik di laman web ini."**

**The one DBP caveat against `anda` does not apply here.** It concerns addressing a live mixed-status
audience at a *majlis*, where DBP recommends *tuan-tuan dan puan-puan* — a spoken-ceremony
politeness constraint, not written web copy. The other caveat (**"kerap digunakan dalam iklan"**) is
a stylistic association, and it cuts the other way for a web product.

⚠ **Two honest limits on this decision.** (1) The lowercase spelling is **usage-derived, not
rule-cited**: DBP writes `anda` lowercase consistently across many fetched answers, but no explicit
DBP *rule* mandating lowercase was found. (2) No Malaysian UX-writing study comparing pronouns on
comprehension was fetched. The decision rests on the DBP definitions plus the measured corpus.

- ✅ **Sila rujuk panduan pengguna.** — pronoun-free imperative, DBP's own voice
- ❌ **Anda perlu rujuk panduan pengguna.** — capitalized *Anda* mid-string, and a pronoun where
  Malay drops it
- ✅ **Kongsikan pandangan anda.** — possessive `anda`, lowercase
- ❌ **Kongsikan pandangan Anda.** — Indonesian capitalization

### 4b. Affixation — the base word is not the word, and the affix carries meaning

Malay derives most of its vocabulary by affixing a root. DBP names four types:

> **"Terdapat empat jenis imbuhan iaitu imbuhan awalan… Imbuhan akhiran pula contohnya laut -
> menjadi lautan, ikut - menjadi ikutan. Imbuhan apitan pula contohnya tidak adil - menjadi
> ketidakadilan, salah guna - menjadi penyalahgunaan. Imbuhan kata sisipan pula contohnya - tapak
> menjadi telapak, kupas menjadi kelupas dan tunjuk menjadi telunjuk."** (17.03.2010)

**`peN-` vs `peN-…-an` is the pair that bites in AI/ML prose** — agent versus process. DBP explains
the capital `N` as a cover symbol for the allomorphs:

> **"Merujuk Tatabahasa Dewan, imbuhan peN...an, 'N' huruf besar kerana mewakili pe, per, peng,
> peny. Perubahan peN..an menjadi pe..an apabila bergabung dengan kata dasar yang bermula dengan
> huruf m,n,ng,r,l,y dan w. Contoh: lari - pelarian, waris - pewarisan, manakala contoh imbuhan pe
> sahaja: lari - pelari, sara - pesara."** (08.04.2010)

Applied to the domain: **pengguna** = *user* (agent) vs **penggunaan** = *use, usage* (process);
**pelajar** = *learner* vs **pembelajaran** = *learning* (process); **pelari** = *runner* vs
**pelarian** = *flight, escape*. Picking the wrong nominalization is a silent terminology bug.

**`-kan` vs `-i`:** **"imbuhan "i" membentuk kata kerja transitif yang membawa pengertian kausatif
(menyebabkan sesuatu terjadi), seperti sudahi; dan membawa pengertian lokatif (menyatakan unsur
tempat), seperti naiki."** (13.01.2016) — choose by context, not by ear.

**Attested errors — these are the wrong forms DBP itself names**, and the only quoted wrong forms
available:

> **"kesalahan imbuhan apitan dalam mententeramkan dan mengkagumkan dikagegorikan sebagai kesalahan
> imbuhan."** (15.02.2014) — the initial *t* / *k* of the root **must** assimilate.

- ✅ **menenteramkan** · ✅ **mengagumkan**
- ❌ **mententeramkan** · ❌ **mengkagumkan**

> **"Frasa yang betul ialah mendeklamasikan sajak. […] Contoh kata lain yang termasuk dalam kumpulan
> ini: mengabaikan bukan mengabai, menggelarkan bukan menggelar, mencantikkan bukan mencantik,
> menjatuhkan bukan menjatuh dan banyak lagi."** — some roots take `meN-…-kan` **obligatorily**;
> bare `meN-` is ungrammatical.

- ✅ **mengabaikan** · ✅ **menjatuhkan** · ✅ **mendeklamasikan**
- ❌ **mengabai** · ❌ **menjatuh** · ❌ **mendeklamasi**

**The opposite error exists too — over-affixing:** **"Penggunaan imbuhan meN pada kata kerja
transitif makan dan minum salah kerana kata-kata ini tidak memerlukan imbuhan meN."** (12.02.2010).
And bare verbs are fully legitimate: **"Kata kerja tunggal ialah kata yang terbentuk tanpa imbuhan.
[…] Antara contohnya termasuklah ada, balik, ikut, jaga, keluar, terbang dan sebagainya."**
(04.03.2024).

> **⚠ Gap DBP itself declares — do not derive, look it up.** On telling `pe-` from `per-`:
> **"Tidak ada panduan khusus untuk memudahkan kita mengetahui apakah kata dasar (sama ada bermula
> dengan huruf R atau tidak) bagi kata terbitan pe- dan per-, melainkan merujuk kamus dengan
> kerap."** (25.07.2009). **Instruction for translators: look the derived form up in the dictionary
> via PRPM; never build a Malay verb by string concatenation, and never let a script generate one.**

### 4c. 🔑 The passive, and `Hukum Aneksi Persona` — the highest-value grammar fact in this guide

Malay has **two** passives and they are not interchangeable. DBP states the constraint directly:

> **"Struktur binaan ayat pasif bagi kata ganti nama diri pertama dan kedua sama, iaitu tidak boleh
> menerima kata kerja dengan imbuhan pasif di-. Tidak ada perbezaan dalam struktur binaan ayat pasif
> tersebut."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=ayat+pasif&d=175768> (20.03.2014)

**Read that carefully: when the agent is a first- or second-person pronoun (*saya, kami, kita, anda,
kamu, awak*), the verb takes NO `di-`.** The agentive passive is `AGENT + bare verb stem`. DBP's own
worked examples:

> **"Ayat aktif: Kamu mesti menyiram sayur-sayuran di belakang rumah. Ayat pasif 1: Sayur-sayuran di
> belakang rumah mesti kamu siram."** — DBP: **"Kedua-dua ayat pasif tersebut adalah betul."**
> (14.02.2011); likewise **"Bilik darjah mereka bersihkan"** (09.03.2012).

The `di-` passive is for **third-person or unstated** agents, and `oleh` may be dropped:

> **"Untuk ayat pasif yang menggunakan kata kerja pasif di-, kata sendi nama oleh dalam ayat tersebut
> yang letaknya selepas kata kerja boleh digugurkan tanpa menjejaskan makna atau struktur ayat."**
> (25.08.2011) · definition (07.05.2007): **"Ayat Pasif ialah ayat yang mengandungi kata kerja yang
> mengutamakan objek asal sebagai judul atau unsur yang diterangkan. Contohnya: Kucing dikejar oleh
> anjing (daripada: Anjing mengejar kucing)."**

**Why this lands on every other UI string.** English educational and interface prose is built from
relative clauses of the shape *"the app you want to sync"*, *"the items you want to reorder"*. DBP
has ruled on exactly this construction, twice, and named the rule:

> **"Ayat yang betul ialah : Pilih aplikasi yang ingin anda segerakkan menggunakan profil ini.
> Mengikut hukum Aneksi Persona bagi kata ganti kedua dalam tatabahasa bahasa Melayu frasa yang
> betul ialah ingin anda."** (01.04.2009)
> · **"Ulangi langkah ini dengan mana-mana item yang ingin anda susun semula." Ayat tersebut betul
> dan mengikut hukum Aneksi Persona."** (30.08.2022)
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=penggunaan+anda&d=175768>

> **The pattern, verbatim from DBP's own examples:** `yang ingin anda <verb-stem>`.
> The stem may carry `-kan` (both DBP examples do), but it carries **no `di-`** and **no `meN-`**.

| English UI string | ✅ Malay | ❌ Wrong shape |
|---|---|---|
| "Choose the app you want to sync." | **Pilih aplikasi yang ingin anda segerakkan.** | ❌ *…yang ingin disegerakkan oleh anda.* |
| "Repeat this step for any item you want to reorder." | **Ulangi langkah ini dengan mana-mana item yang ingin anda susun semula.** | ❌ *…item yang anda ingin disusun semula.* |
| "the file you want to delete" | **fail yang ingin anda padamkan** | ❌ *fail yang ingin dipadamkan oleh anda* |

⚠ **Marking the ❌ column honestly:** DBP quotes only the **correct** forms. The wrong shapes above
are **rule-derived** — each is a `di-` passive with a second-person agent, which is precisely what
DBP's prohibition (**"tidak boleh menerima kata kerja dengan imbuhan pasif di-"**) excludes. They are
not quoted error examples, and no attested Malay error string for this construction was found.

**Word order around a modal is free**, with no meaning change — DBP on *"yang boleh anda gunakan"*
vs *"yang anda boleh gunakan"*: **"Kedua-dua frasa tersebut betul bergantung pada perkataan mana
yang tuan hendak dahulukan… Tidak ada perbezaan dari aspek makna cuma penekanan kepada perkataan
boleh atau anda."** (23.09.2012). Pick one for the string catalog and be consistent.

### 4d. No grammatical plural — and when reduplication is wrong

CLDR gives `ms` exactly **one** plural category:

> `ms → {"pluralRule-count-other": " @integer 0~15, 100, 1000, …"}` — **only `other`**
> — `cldr-core/supplemental/plurals.json`

**Never emit `one` / `few` / `many` message-format branches for `ms`.** (`id` is identical, and this
is one of the few things the two share exactly.)

Reduplication (*kata ganda*) marks plurality or diversity when it is not already implied, and is
written with a hyphen **- (U+002D HYPHEN-MINUS)**: *budak-budak*, *sayur-sayuran*, *kanak-kanak*,
*negara-negara*, *rumah-rumah* — all attested in DBP's own prose, e.g. **"Bumbung zink rumah-rumah di
kampung itu telah diterbangkan oleh angin ribut malam tadi."**

> **🏠 House rule (craft judgment — no DBP source found).** Do **not** reduplicate when a numeral or
> quantifier already marks plurality. English *"three models"* → **tiga model**. This is house style,
> not a cited rule; a DBP prohibition could not be located.
>
> - ✅ **tiga model** · ✅ **beberapa parameter**
> - ❌ **tiga model-model** · ❌ **beberapa parameter-parameter**

### 4e. Classifiers (*penjodoh bilangan*) — more optional than textbooks suggest

DBP repeats the same permissive formula in answer after answer:

> **"Tidak semua benda diberikan penjodoh bilangan. Penjodoh bilangan lazimnya mengikut bentuk atau
> konsep sesuatu benda. Setiap penjodoh bilangan tidak semestinya bergantung pada fizikal tetapi
> mengikut konteks atau kesesuaian dalam ayat."** (11.04.2020) · **"…penggunaan tanpa penjodoh
> bilangan tidak salah."** (04.01.2014)
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=penjodoh+bilangan&d=175768>

Directly usable: **"…penjodoh bilangan bagi "sistem" ialah "sebuah"."** (09.10.2023).

**Guide rule:** for abstract technical nouns (*model, algoritma, data, rangkaian*) **omit the
classifier** — DBP explicitly licenses that. Use **sebuah** for *sistem*. Use **orang** for people
(*15 orang*, attested in DBP's own worked example).

### 4f. Tense is absent — set the time frame once

Malay does not inflect for tense; time is carried by adverbs and aspect particles — *telah, sudah,
sedang, akan, belum, masih* — all attested in DBP's own sentences (**"telah diterbangkan"**,
**"sedang menyediakan"**, **"belum dilipat"**, **"akan menerima"**).

**Translation consequence:** an English past-perfect chain (*"the model had been trained on data
that had been collected…"*) must be **flattened**. Set the time frame once and let the rest of the
clause run tenseless; do not stack particles clause after clause.

- ✅ **Model itu telah dilatih dengan data yang dikumpulkan sebelum ini.**
- ❌ **Model itu telah sudah dilatih dengan data yang telah dikumpulkan sebelum ini.** — ⚠
  rule-derived over-marking, not a quoted DBP error example

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=imbuhan+-kan+dan+-i&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=ayat+pasif&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penggunaan+anda&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=kata+ganti+nama+diri+kedua&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penjodoh+bilangan&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bahasa+mudah+difahami&d=175768> ·
<https://www.malaysia.gov.my/my> · <https://dbp.gov.my/> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/plurals.json>

---

## 5. Numbers, dates, currency

### 5a. 🔴 The ms/id inversion — the highest-consequence formatting fact in this guide

**Malaysia uses the *opposite* separators to Indonesia.** Both columns below are from CLDR, fetched
as raw JSON and read by codepoint:

| Symbol | **`ms`** | codepoint | **`id`** | codepoint |
|---|---|---|---|---|
| `decimal` | **.** | **U+002E** FULL STOP | **,** | **U+002C** COMMA |
| `group` | **,** | **U+002C** COMMA | **.** | **U+002E** FULL STOP |
| `timeSeparator` | **:** | **U+003A** COLON | **.** | **U+002E** FULL STOP |
| `minusSign` | **-** | **U+002D** HYPHEN-MINUS | **-** | U+002D |
| `percentSign` | **%** | U+0025 | **%** | U+0025 |
| `list` | **;** | U+003B | **;** | U+003B |
| `superscriptingExponent` | **×** | U+00D7 MULTIPLICATION SIGN | **×** | U+00D7 |
| `perMille` | **‰** | U+2030 PER MILLE SIGN | **‰** | U+2030 |
| `infinity` | **∞** | U+221E INFINITY | **∞** | U+221E |

- ✅ Malay: **1,234.5** · **2,500,000 orang** · **0.123** · **8.1%**
- ❌ Indonesian format in a `ms` build: **1.234,5** · **2.500.000 orang** · **0,123** · **8,1%**

> ⚠ **`minusSign` is U+002D HYPHEN-MINUS, not U+2212 MINUS SIGN.** CLDR gives `ms` the ASCII
> hyphen-minus. Do not "improve" it.

**DBP corroborates both separators independently, with a primary Malaysian source:**

> **"Nombor kosong sebelum titik perpuluhan perlu ditulis, contohnya 0.123"** (23.06.2011) → decimal
> is the **period**, and **a leading zero is required**.
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=titik+perpuluhan&d=175768>

> **"Sistem pernomboran antarabangsa meletakkan tanda koma selepas nilai ribu: 8,000, 80,000, 800,000
> dan seterusnya."** (07.12.2018) → thousands separator is the **comma**.
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768>

⚠ **A space-grouped variant also occurs in DBP's own answers** — **"Penulisan dalam bentuk angka:
1 048 232 700 328"** (12.07.2017), **"Maka 6.1 bilion ditulis 6 100 000 000."** (18.08.2015). Those
appear inside worked examples of very large numbers; the 2018 answer is the one that states a
**rule**. **Use comma grouping**, consistent with CLDR, and do not be surprised by the space form in
source material.

**Format patterns, `ms`** (`cldr-numbers-full/main/ms/numbers.json`):

- `decimalFormats.standard = "#,##0.###"`
- `percentFormats.standard = "#,##0%"` — **percent sign attached, no space**; DBP's own prose agrees:
  **"…pertumbuhan sebanyak 8.1% berbanding tempoh yang sama tahun lepas"**
- `currencyFormats.standard = "¤#,##0.00"` — **symbol attached, no space**
- `currencyFormats.accounting = "¤#,##0.00;(¤#,##0.00)"` — negatives in parentheses (`id` has **no**
  negative branch, another silent divergence)

**Units are the exception: numeral + space + unit.** DBP: **"Bagi penulisan keluasan, kelajuan dan
dimensi, gunakan angka dan unit yang sesuai… contohnya 7 km."** (26.06.2023).

- ✅ **7 km** · ✅ **RM5** · ✅ **8.1%**
- ❌ **7km** · ❌ **RM 5** · ❌ **8.1 %**

### 5b. 🔴 The compact-form trap — `B` in `ms` is `M` in `id`

From `cldr-numbers-full/main/ms/numbers.json`, `decimalFormats.short`:

| Magnitude | **`ms`** | **`id`** |
|---|---|---|
| 10³ | **`0K`** | `0 rb` |
| 10⁶ | **`0J`** (J = *juta*) | `0 jt` |
| **10⁹** | **`0B`** (B = *bilion*) | **`0 M`** (M = *miliar*) |
| 10¹² | **`0T`** | `0 T` |

**Two things to flag.** (1) `ms` compact suffixes are **letters with no space** — `1.2K`, `3J`, `4B`;
`id` inserts **U+00A0 NO-BREAK SPACE** before its suffix. (2) `ms` uses **`B`** for 10⁹ where `id`
uses **`M`** — **reusing an `id` string for `ms` is a silent order-of-magnitude error**, and it is
invisible to every spellchecker and most reviewers.

- ✅ `ms`: **4B** = four **bilion** = 4 000 000 000
- ❌ `ms` string borrowed from `id`: **4 M** — reads as *miliar*, and `M` is not a `ms` suffix at all

### 5c. ⚠ `bilion` — DBP contradicted itself in public, on the same day

The long/short scale question genuinely bites in Malay, and DBP has published a self-correction on
it. **Both answers are dated 18.08.2015 and sit in the same advisory panel:**

> **First answer:** **"Satu bilion ialah satu juta juta, ditulis 1,000,000,000,000."** — i.e.
> **10¹²**, long scale.
>
> **Follow-up answer, same date, reversing it:** **"Untuk makluman tuan, Kamus Dewan menakrifkan
> bilion sebagai juta juta, iaitu mengandungi 12 angka sifar (1 000 000 000 000). Itulah juga sistem
> yang digunakan dalam Matematik. Walau bagaimanapun setelah disemak penggunaan dalam istilah juga
> kepada pihak yang berwenang dalam hal ini (Bank Negara Malaysia), bilion ditakrif sebagai ribu
> juta, iaitu mengandungi sembilan angka sifar (1 000 000 000). Maka 6.1 bilion ditulis
> 6 100 000 000."** — i.e. **10⁹**, short scale, on the central bank's authority.
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=bilion&d=175768>

> **Resolution for this kit: `bilion` = 10⁹ (short scale).** The dictionary's long-scale definition
> is the older layer; DBP itself set it aside after checking with the national financial authority,
> and DBP's later practice is short-scale throughout. **Report the contradiction rather than hiding
> it** — anyone who checks *Kamus Dewan* will find 10¹² and needs to know why this guide says
> otherwise.

DBP's own scale ordering, from a correction it issued on 12.07.2017: **"Satu trilion empat puluh
lapan bilion dua ratus tiga puluh dua juta tujuh ratus ribu tiga ratus dua puluh lapan. Penulisan
dalam bentuk angka: 1 048 232 700 328"** → the sequence is **ribu (10³) · juta (10⁶) · bilion (10⁹)
· trilion (10¹²)**.

**In that same correction DBP silently replaced three Indonesian forms** — a free ms/id divergence
list:

- ✅ **bilion** · ✅ **trilion** · ✅ **lapan**
- ❌ **biliun** · ❌ **triliun** · ❌ **delapan**

**RM72 bilion** and **RM231.2 bilion** are DBP-attested renderings; use `bilion` as a word after a
currency figure rather than nine zeroes.

### 5d. Numerals vs words — and the documented house deviation

Three separate DBP answers state the same rule:

> **"Dalam penulisan teks, nombor satu hingga sembilan dieja penuh dan nombor 10 ke atas ditulis
> nombor."** (04.03.2015, 27.05.2011, 24.03.2017)

The fuller *Gaya Dewan* Ed. 4 rule, as quoted by DBP (07.11.2023): numbers opening a sentence are
spelled out **"kecuali nombor yang menunjukkan tahun kalendar"** (*"1957 ialah tahun kemerdekaan bagi
negara ini."*); zero to nine are spelled out; **"Semua nombor dalam ayat boleh dieja atau ditulis
dengan angka jika lebih daripada sembilan tetapi penulisannya hendaklah selaras."**

> **🏠 House deviation, documented with its warrant.** The spell-out rule collides head-on with
> technical prose full of *3 lapisan*, *2 epok*, *8 ciri*. **Use digits throughout for quantities in
> technical and instructional contexts; apply the spell-out rule only in narrative body prose.** The
> warrant is DBP's own consistency clause — **"penulisannya hendaklah selaras"**. Record this as a
> deliberate house deviation, not as DBP's rule.

### 5e. Currency

> `MYR = {"displayName":"Ringgit Malaysia", "symbol":"RM", "symbol-alt-narrow":"RM"}`
> — `cldr-numbers-full/main/ms/currencies.json`

**No space between `RM` and the figure** — DBP, explicitly: **"Walau bagaimanapun dalam menulis nilai
ringgit, cara yang betul ialah RM5, RM10 dan RM100."** (23.01.2013), corroborated by DBP-corrected
sentences (**"RM72 bilion"**, **"merekodkan RM231.2 bilion"**).

- ✅ **RM5** · ✅ **RM1,250.00** · ✅ **RM72 bilion**
- ❌ **RM 5** · ❌ **RM1.250,00** (Indonesian separators) · ❌ **5 RM** (symbol never trails)

Neighboring currencies in CLDR `ms`: `SGD` *Dolar Singapura*, `BND` *Dolar Brunei*, `IDR` *Rupiah
Indonesia*, `EUR` *Euro*. ⚠ **Note `USD.symbol` in `ms` is the literal string `USD`, not `$`** — a
formatter that assumes `$` is producing something CLDR `ms` does not.

### 5f. Dates

From `cldr-dates-full/main/ms/ca-gregorian.json`:

| Format | Pattern | Rendered (July 26, 2026) |
|---|---|---|
| full | **`EEEE, d MMMM y`** | Ahad, 26 Julai 2026 |
| long | **`d MMMM y`** | 26 Julai 2026 |
| medium | **`d MMM y`** | 26 Jul 2026 |
| short | **`d/MM/yy`** | 26/07/26 |

**Months (wide):** Januari · Februari · **Mac** · April · Mei · Jun · **Julai** · **Ogos** ·
September · Oktober · November · **Disember**
**Months (abbreviated):** Jan · Feb · **Mac** · Apr · Mei · Jun · Jul · **Ogo** · Sep · Okt · Nov ·
**Dis**
**Days (wide):** Ahad · Isnin · Selasa · Rabu · Khamis · **Jumaat** · Sabtu
**Days (abbreviated):** Ahd · Isn · Sel · Rab · Kha · Jum · Sab

> **⚠ Divergence alert.** *Mac*, *Julai*, *Ogos*, *Disember* are the **Malaysian** forms. The
> Indonesian month names differ (the `id` set is **⚠ unverified** here — `id/ca-gregorian.json` was
> not fetched). **A month table copied from an `id` guide will be wrong in `ms` several times a
> year.** The `ms` column above was read straight from the locale data and is the one to use.

**DBP on writing dates:**

> **"Cara penulisan tarikh yang betul dalam penulisan surat rasmi ialah "Dengan hormatnya, surat tuan
> bertarikh 19 November 2025 …"."** (19.11.2025) · **"Penulisan yang betul ialah 19 April 2021."**
> (07.07.2021) · **"…untuk surat rasmi, perkataan "hb" tidak boleh digunakan. Contoh: 15hb Mei 2015,
> tidak boleh digunakan."** (14.05.2015) · **"Penulisan yang betul ialah 9 Feb. 2022"** (11.04.2022)
> · **"Pada kelazimannya, tarikh pada tahun yang sama tidak perlu diulang tahunnya. Contohnya, 30 Jun
> hingga 4 Julai 2025"** (09.06.2025)
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+tarikh&d=175768>

- ✅ **19 April 2021** · ✅ **9 Feb. 2022** (abbreviated month takes a period)
- ❌ **15hb Mei 2015** (DBP-attested error) · ❌ **April 19, 2021** (never US month-first)

⚠ **DBP explicitly disclaims having a numeric-date standard:** **"Pihak DBP tidak mempunyai format
standard berkenaan cara penulisan tarikh."** (29.03.2023) — it accepts both `4/7/2017` and
`4.7.2017`. **Use CLDR** (`d MMMM y` for long dates, `d/MM/yy` only where space forces it). Order is
**always day–month–year**.

**Week data:** `firstDay` **MY = mon**, **BN = mon**, **⚠ SG = sun** — a Singapore-facing calendar
starts its week differently. `measurementSystem` for MY is not overridden, so **metric**.

### 5g. Time — where DBP and CLDR disagree, and what to do about it

> `timeFormats = {"full":"h:mm:ss a zzzz", "long":"h:mm:ss a z", "medium":"h:mm:ss a",
> "short":"h:mm a"}` · `availableFormats: Hm = "HH:mm"` ·
> `dayPeriods.format.wide = {"am":"PG","pm":"PTG", …}`
> **⚠ Codepoint alert:** the 12-hour skeleton `hm` separates the time from the day-period marker with
> **U+202F `NARROW NO-BREAK SPACE`**, not U+0020. A pipeline that normalizes whitespace will silently
> change the rendered string.

**DBP's own guidance differs on two points:**

> **"Dalam konteks dan penggunaan umum untuk penulisan waktu, satu titik (2.00) digunakan manakala
> dalam bidang atau penulisan wacana matematik digunakan dua titik (2:00) untuk membezakan antara
> waktu dengan titik perpuluhan."** · **"Penggunaan yang betul 20:00 (dalam bidang matematik). Tidak
> perlu meletakkan malam apabila menggunakan sistem 24 jam."** (22.10.2019, repeated 22.04.2020)
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=titik+perpuluhan&d=175768>

> **"Penggunaan singkatan bahasa Inggeris “am” dan “pm” dalam bahasa Melayu ialah “pg.” dan “ptg.”
> atau “pg.” dan “mlm.”. Oleh itu, jawapan yang betul ialah 9 pg.- 5 ptg."** (05.09.2023)

> **⚠ Documented, reasoned deviation from DBP's default.** Use the **colon `:` (U+003A)** as the time
> separator. DBP itself assigns the colon to *bidang* / technical-mathematical writing and the full
> stop to *penggunaan umum*; an educational technology platform is squarely in the *bidang* case, and
> CLDR `ms` gives the colon as the locale's `timeSeparator`. **This is the one place this guide
> recommends against DBP's general-prose default; it is a decision, not an oversight.**
>
> For day-period markers, **use CLDR's `PG` / `PTG` for programmatically formatted timestamps and
> DBP's `pg.` / `ptg.` / `mlm.` when a time is written inside a sentence.**

- ✅ **14:05** · ✅ **9 pg.** in running prose · ✅ **20:00** with no *malam*
- ❌ **14.05** (the `id` separator, and DBP's general-prose form — deliberately not used here)
- ❌ **9 am** · ❌ **20:00 malam** (DBP-attested: redundant with a 24-hour clock)

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/ms/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/id/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/ms/currencies.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/ms/ca-gregorian.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/weekData.json> ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/measurementData.json> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=titik+perpuluhan&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+nombor&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bilion&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penulisan+tarikh&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+petik&d=175768>

---

## 6. Terminology strategy

### 6a. The term bank, and how to query it

**First stop for any term: the *Istilah MABBIM* panel** (§2b, `d=115704`). It returns the Indonesian,
Bruneian, and Malaysian term side by side, which means **one lookup answers both "what is the Malay
term?" and "is this an Indonesian form?"** Second stop: the dictionary panel (`d=73980`), which
carries *Kamus Dewan*, *Kamus Komputer*, *Kamus Teknologi Maklumat*, *Kamus Sains*, and *Kamus
Inggeris–Melayu Dewan*.

### 6b. The sandwich pattern, instantiated

The kit's terminology sandwich ([translation-quality](../translation-quality.md)) already has a
sanctioned Malay form (§3d): **Malay term first, English source term in parentheses, upright.** DBP's
own dictionary headwords are built this way — `muat turun(download)`, `rangkaian neural(neural
network)`, `sistem pakar(expert system)`.

- ✅ first use: **rangkaian neural (neural network)** — then plain **rangkaian neural** thereafter
- ❌ **neural network (rangkaian neural)** — English-first inverts the pattern and the register
- ✅ an English word running loose in the sentence takes italics: *fine-tuning*
- ❌ the same word italicized **inside** the parenthetical gloss — the rule exempts parentheses

### 6c. ⚠ Three headline AI terms are verified absent from the term bank

This is a real hole, not a fetch failure: the query for *pembelajaran mesin* **does** return
dictionary and *Kamus Sains* hits, so the portal search works — the English headwords simply are not
there.

| Term | PRPM status | What to use |
|---|---|---|
| **machine learning** | **"Carian kata tiada di dalam kamus terkini."**, zero result tabs | **pembelajaran mesin** — in real Malay use, but **no term-bank authority**; say so when it matters |
| **deep learning** | no *Istilah MABBIM* entry | ⚠ **genuinely unsettled**; *pembelajaran mendalam* has no encyclopedia article and no PRPM entry |
| **dataset** | zero result tabs | ⚠ **unsettled**; no rendering is proposed here — make one via the §6c fallback and record it in the term sheet as a house decision |
| **large language model** | no source found | ⚠ **unsettled** |
| **big data** | no source found | ⚠ **unsourced** |

**Rule: where PRPM has no entry, the guide says so and hands the translator a documented fallback —
it never implies DBP blessed a coinage.**

**The sanctioned fallback for a term with no Malay equivalent** is DBP's own procedure: orthographic
adaptation to Malay phonology, validated against media usage.

> **"Tidak ada padanan graphene dalam sumber rujukan kami. Namun begitu, media telah menggunakan
> perkataan grafin […] Berdasarkan penyesuaian ejaan terjemahan daripada bahasa Inggeris kepada
> bahasa Melayu, ejaan grafin adalah betul."** (07.12.2019)

That is the procedure to apply to *transformer*, *embedding*, *token* — adapt the spelling, check
that Malaysian media already write it that way, and record the decision in the term sheet. DBP also
sanctions **quotation marks around an unlisted English word** on first use: **"Sekiranya ingin
digunakan juga perkataan tersebut, boleh letakkan tanda pengikat kata…"** (07.10.2014).

### 6d. Seed vocabulary — the field's standard terms, with the ms/id/Brunei split

All rows verbatim from *Istilah MABBIM* (`d=115704`) unless noted. **The Malaysia column is the one
to use.**

| English source | Indonesia (`id`) | Brunei | **MALAYSIA (`ms`)** | Bidang |
|---|---|---|---|---|
| artificial intelligence | kecerdasan buatan | **kepintaran tiruan** | **kecerdasan buatan** | Teknologi Maklumat |
| neural network | **jejala neural** / **jaringan syaraf** | rangkaian neural | **rangkaian neural** | Kejuruteraan / Teknologi Maklumat |
| artificial neural network | *(term-bank data error in the `id` cell)* | rangkaian neutral buatan | **rangkaian neural buatan** | Kejuruteraan |
| algorithm | algoritma / **algoritme** (Matematik) | algoritma | **algoritma** | Teknologi Maklumat / Matematik |
| download | **ambil berkas / ambil data** | muat turun | **muat turun** | Teknologi Maklumat |
| training | **pelatihan** | latihan | **latihan** | Pendidikan |
| computer-based training | **pelatihan berbasis komputer** | latihan berasaskan komputer | **latihan berasaskan komputer** | Pendidikan |
| software | **perangkat lunak** | perisian | **perisian** | Teknologi Maklumat |
| software quality assurance | jaminan **kualitas** perangkat lunak | jaminan mutu perisian | **jaminan mutu perisian** | Teknologi Maklumat |
| software life cycle | siklus hidup perangkat lunak | kitaran hidup perisian | **kitar hayat perisian** | Teknologi Maklumat |
| user | pengguna; **pemakai** | *Tiada* | **pengguna** | Perpustakaan |
| user-friendly | **akrab-pengguna** | mesra pengguna | **mesra pengguna** | Teknologi Maklumat |
| user's guide | **petunjuk pemakai** | panduan pengguna | **panduan pengguna** | Teknologi Maklumat |
| user-centered design | **desain** terpusat pengguna | reka bentuk terpusat pengguna | **reka bentuk terpusat pengguna** | Teknologi Maklumat |
| network | **gajala, jaringan** | *Tiada* | **rangkaian** | Fizik |
| data | data | data | **data** | Teknologi Maklumat |
| data processing | **pengolahan data; pemrosesan data** | *Tiada* | **pengolahan data; pemprosesan data** | Ekonomi |
| data encryption | **enkripsi data / penyandian data** | penyulitan data | **penyulitan data** | Kejuruteraan |
| data integrity | **integritas data** | kewibawaan data | **keutuhan data** | Teknologi Maklumat |
| machine vision | visi mesin | visi mesin | **visi mesin** | Teknologi Maklumat |
| machine language | bahasa mesin | *Tiada* | **bahasa mesin** | Matematik |
| computer | komputer | *Tiada* | **komputer** | Fizik / Matematik |
| bias | bias | bias | **bias** | Perubatan |
| input | input | *Tiada* | **input** | Perubatan / Ekonomi |
| input register | **register input** | daftar input | **daftar input** | Teknologi Maklumat |
| natural language processing | — | — | **pemprosesan bahasa tabii** (*Kamus Komputer*, abbrev. **NLP**) | Teknologi Maklumat |
| expert system | — | — | **sistem pakar** (*Kamus Komputer*) | Teknologi Maklumat |
| machine learning | — | — | **pembelajaran mesin** ⚠ no term-bank entry (§6c) | — |

**Definitional anchors, verbatim from DBP:**

> **"kecerdasan buatan (artificial intelligence) — Bidang ilmu yang berkaitan dengan kajian yang
> memberi mesin kemampuan untuk berfikir seperti manusia atau kepandaian untuk membaiki dirinya. —
> Kamus Komputer"** · **"AI — Singkatan bagi artificial intelligence. Lihat kecerdasan buatan."** →
> **DBP itself keeps the English abbreviation `AI`. Do not invent a Malay acronym.**
> · Register calibration, from DBP's encyclopedia: **"Kecerdasan buatan ialah cabang sains komputer.
> Ia berkaitan dengan reka bentuk sistem komputer yang melakukan tugas yang kelihatan memerlukan
> kecerdasan. Tugas demikian termasuk penaakulan, penyesuaian dengan situasi baharu, dan pembelajaran
> kemahiran baharu."**

**Which English terms stay English:** **data**, **input**, **bias**, **model**, **AI** — each
Official-sourced from the term bank or *Kamus Komputer* — and **OCR**, which rests on ⚠
community-tier usage evidence only; plus the naturalized loans **algoritma, komputer, grafik, entiti, fungsi,
sistem, format, metrik** spelled per *Sistem Ejaan Rumi Baharu*. ⚠ Note that the native Malay *bias*
means refraction — **"membias menyimpang atau membelok dr arah yg semula"** — so the technical sense
is a homograph loan, not the native word.

- ✅ **muat turun** for *download* · ✅ **perisian** for *software* · ✅ **data**, kept as *data*
- ❌ **ambil berkas** · ❌ **perangkat lunak** · ❌ **maklumat** where *data* is meant

### 6e. 🔑 `Kamus Dewan`'s inline `Id` label — a built-in divergence detector

*Kamus Dewan* marks **Indonesian-only senses** inline with the label **`Id`**. This is the single
most efficient divergence check available to a translator, and it is free:

> **"pejabat [pe.ja.bat] | ڤجابت Definisi : 1. bangunan (ruang, bilik, dsb) tempat bekerja atau
> tempat diselenggarakan pelbagai urusan… 2. **Id** jabatan; 3. **Id** pegawai kerajaan yg memegang
> jawatan penting, pemegang jawatan, penjabat."**
> — <https://prpm.dbp.gov.my/Cari1?keyword=pejabat>

Sense 1 is Malaysian; senses 2 and 3 are flagged as Indonesian. The same mechanism appears elsewhere
— **"~ kebal a) Id kereta baja"** under *kereta*, **"lentur — 2. Id perubahan arah…"**.

> **Instruction for translators: when a word feels borderline, look it up in the dictionary panel and
> read the sense labels. An `Id` label means "this sense is Indonesian" — do not use that sense in
> `ms`.** No other free tool gives you a per-sense divergence verdict from the Malaysian side.

### 6f. The ms/id lexical heuristic — a pattern, not a rule

Generalizing from the term-bank table above. **Treat this as a strong smell test, not a law:**

- Indonesian prefers **Dutch/Latin-route loans**; Malaysian prefers **English-route loans or native
  coinages**: *kualitas* → **mutu**, *desain* → **reka bentuk**, *siklus* → **kitar**, *integritas* →
  **keutuhan**, *rekayasa* → **kejuruteraan**, *enkripsi* → **penyulitan**, *register* → **daftar**.
- **`-si` is usually shared** (*fragmentasi*, *agregasi*) — do **not** over-correct these.
- Indonesian `me-` + `p` drops the *p* (*pemrosesan*); Malaysian keeps the cluster —
  ✅ **pemprosesan** / ❌ **pemrosesan**.
- Indonesian `-e` in some Greek/Latin terms where Malaysian has `-a`: ✅ **algoritma** /
  ❌ **algoritme**.
- **`pe-…-an` where Malaysian has a bare root is a strong Indonesian tell**: ✅ **latihan** /
  ❌ **pelatihan** for *training*.
- **`rangkaian` (ms) vs `jaringan` (id)** for *network* — this one appears constantly in ML text and
  is the fastest way to spot an Indonesian-sourced translation.

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=artificial+intelligence&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=kecerdasan+buatan&d=73980> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=kecerdasan+buatan&d=243192> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=neural+network&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=software&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=user&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=training&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=download&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=data&d=115704> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bias&d=73980> ·
<https://prpm.dbp.gov.my/Cari1?keyword=machine+learning> (negative result) ·
<https://prpm.dbp.gov.my/Cari1?keyword=pejabat> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bilion&d=175768> (the *grafin* ruling) ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=tanda+pengikat+kata&d=175768> ·
<https://ms.wikipedia.org/wiki/Pembelajaran_mesin> (⚠ community-tier, usage evidence only)

---

## 7. Idiom anti-patterns

**Read the provenance column.** The **Malay renderings are Official** — they come from *Kamus
Inggeris–Melayu Dewan* through the reference portal, mostly with DBP's own example sentence. **The
"wrong calque" column is craft judgment in every row**, because DBP does not publish lists of
translation errors. Nothing in that column is a quoted attested error.

| # | English (educational-tech prose) | ✅ Malay rendering | ❌ Word-for-word calque | Provenance |
|---|---|---|---|---|
| 1 | rule of thumb | **mengikut kebiasaan** | *hukum ibu jari* | Official: **"rule of thumb — n mengikut kebiasaan."** |
| 2 | trial and error | **cuba-cuba** | *percubaan dan kesilapan* | Official: **"~ and error, cuba-cuba: … dia menggunakan kaedah cuba-cuba utk menyelesaikan masalah itu"** |
| 3 | in a nutshell | **pendek kata** (for "summarise concisely": **seringkas-ringkasnya**) | *dalam kulit kekeras* | Official: **"(to put it) in a ~, pendek kata: … pendek kata, lakonan itu tdk berjaya."** |
| 4 | trade-off | **keseimbangan** (noun); **menukarkan sst demi sst** (verb) | *tukar-mati*, *pertukaran* | Official: **"trade-off — n keseimbangan: there has to be a ~ between the quality of the dictionary and rapid publication, mesti ada keseimbangan antara mutu kamus dan penerbitan segera kamus tersebut."** — the dictionary's own example is an intellectual trade-off, exactly the AI-domain sense |
| 5 | keep / bear X in mind | **sentiasa ingat akan …** | *simpan dalam fikiran* | Official: **"bear in mind, sentiasa ingat akan sst: … jangan terseleweng oleh perincian; pastikan kamu sentiasa ingat akan objektif utama kamu"** |
| 6 | it does not make sense / the numbers do not add up | **tidak munasabah**, **tidak masuk akal**, **tidak dapat diterima** | *tidak membuat deria* | Official: **"~ up, … make sense, munasabah, masuk akal, dapat diterima: statements that just do not ~ up, kenyataan-kenyataan yg tdk munasabah"** |
| 7 | straightforward (of an explanation) | **mudah** | *lurus ke hadapan* | Official: **"plain — adj … 2. simple, not difficult, mudah: a ~ but effective style of writing, gaya penulisan yg mudah tetapi berkesan; 3. (of people, behaviour) straightforward, terus-terang"** — ⚠ **the two senses take different words**; for documentation use **mudah**, not *terus terang* |
| 8 | we have only scratched the surface | **baru menyentuh masalah luarannya sahaja** | *baru mencalarkan permukaan* | Official: **"~ the surface, (fig.) menyentuh: … setakat ini, kita baru menyentuh masalah luarannya sahaja"** |
| 9 | step by step | **langkah demi langkah** | *langkah oleh langkah* | ⚠ **corpus-attested, not dictionary-sanctioned** — the portal has **no** `step by step` idiom entry (verified: the query returns only *step-parent*, *step-ladder*, *step up*, *step out*); the construction is attested in Malay encyclopedic prose, **"Algoritma ialah tatacara langkah demi langkah…"** |
| 10 | however / that said | **walau bagaimanapun**; **namun begitu / namun demikian** | *bagaimanapun ia* | Official: **"however — conj walau bagaimanapun, namun /begitu, demikian/: … kami masih belum berjaya, walau bagaimanapun kami akan terus mencuba"** |
| 11 | at a glance / a fleeting look | **sepintas lalu**, **sekilas**, **selayang pandang** | *pada satu pandangan* | Official: **"fleeting — adj a. … (of glimpse, glance) sepintas lalu, sekilas (lalu), /sekilas, selayang /pandang…"** |
| 12 | put X first / prioritize | **mengutamakan**, **mendahulukan** | *letak X pertama* | Official: **"first — … put /so., st /~, /mengutamakan, mendahulukan/"** |

**Sentence connectors that DBP itself writes** — the model for transitional prose: *Walau
bagaimanapun*, *Oleh itu*, *Untuk makluman*, *Sila rujuk*, *Contohnya*, *Manakala*, *Sekiranya*.

### 7a. ⚠ Terms with no dictionary rendering — verified absent, flagged as gaps

Each of these returned **no** *Kamus Inggeris–Melayu Dewan* line. **No rendering is invented here.**

- **hands-on** — no entry.
- **pitfall** — no entry.
- **black box** — no entry. **This one matters for an AI guide** (*black-box model*): there is no
  sanctioned Malay rendering, so the term sheet must make and record a decision (§6c fallback).
- **state of the art** — nothing relevant returned.
- **learning curve** — ⚠ **unverified**: it appears only in the *Kamus Teknologi Maklumat* and
  finance-glossary panels, which were not opened.

### 7b. A register observation worth knowing

The *Kamus Inggeris–Melayu Dewan*'s own example sentences address a generic reader as **`kamu`** —
**"jika kamu sentiasa memastikan kamu nampak bangunan Dayabumi, kamu tdk akan sesat"**. **That is
didactic dictionary register and it is not the register a public-facing platform should copy** (§4a).
Do not take a dictionary example sentence as a model for product voice.

Sources: <https://prpm.dbp.gov.my/> (*Kamus Bahasa Inggeris* panel: `rule+of+thumb`,
`trial+and+error`, `in+a+nutshell`, `trade-off`, `keep+in+mind`, `make+sense`, `straightforward`,
`at+a+glance`, `for+instance`, `state+of+the+art`, `black+box`, `hands-on`, `pitfall`,
`step+by+step`, `learning+curve`) · <https://ms.wikipedia.org/wiki/Algoritma> (⚠ community-tier,
*langkah demi langkah* attestation only)

---

## 8. Simplified-language pendant (`ms-easy`)

### 8a. ❌ No Malaysian plain-language standard was located — and that is stated, not padded

**Honest negative finding.** No Malaysian plain-language or easy-read standard was found. What was
actually tried:

1. DBP's advisory archive was queried for plain-language guidance
   (`…keyword=bahasa+mudah+difahami&d=175768`). **Every returned answer is a member of the public
   asking DBP to explain something in simple terms — none is a standard.**
2. DBP's guidance index (`dbp.gov.my/pedoman-dan-panduan-bahasa-melayu/`) renders navigation only and
   links **no PDFs**.
3. `dbp.gov.my/pedoman-bahasa-melayu/` describes only two active *pedoman* projects — on
   **classifiers** and **acronyms**. Neither is plain language.
4. Malaysia's digital-government bodies were probed for web-content or accessibility guidance; none
   surfaced a plain-language document at a constructible URL, and one host timed out.

⚠ **The absence may be an artifact of method**: the research ran without a search tool, so it could
only reach URLs it could construct or discover. **State the finding as "not located", never as "does
not exist".**

> **Consequence: `ms-easy` inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). That is a legitimate, complete answer under
> the authoring directive — not a gap to fill with invented local norms.

### 8b. What *is* sourced, and can legitimately shape `ms-easy`

**① Stay inside *bahasa Melayu baku*.** DBP defines the standard/non-standard split, and frames
non-*baku* as **ungrammatical**, not merely informal:

> **"Bahasa Melayu baku ialah bahasa Melayu yang sempurna dari segi penggunaan aspek bahasanya, iaitu
> ejaan, tatabahasa, istilah, penggunaan kata dan laras bahasa serta sebutan. Biasanya bahasa Melayu
> baku digunakan dalam situasi rasmi. Sementara itu, bahasa Melayu tidak baku digunakan dalam situasi
> tidak rasmi, iaitu percakapan, dialog atau penulisan yang digunakan tidak mengikut tatabahasa yang
> betul."**
> — <https://prpm.dbp.gov.my/Cari1.aspx?keyword=bahasa+Melayu+baku&d=175768> (03.09.2024)

**Simplify vocabulary and sentence structure; do not drift toward colloquial Malay.** In this
language, "easier" must not mean "less standard".

**② Two simplification levers DBP explicitly permits** — both reduce sentence weight without
inventing vocabulary:

- **Drop the agent `oleh`** in a `di-` passive: **"kata sendi nama oleh… boleh digugurkan tanpa
  menjejaskan makna atau struktur ayat"** (§4c).
  - ✅ **Data itu dikumpulkan pada tahun lepas.** — ✅ also correct, and heavier: **Data itu
    dikumpulkan oleh pasukan kami pada tahun lepas.**
- **Drop the classifier**: **"penggunaan tanpa penjodoh bilangan tidak salah"** (§4e).
  - ✅ **tiga model** — ✅ also correct, and heavier: **tiga buah model**

**③ Keep the technical term, explain it.** The kit's term-preservation rule applies unchanged: an
`ms-easy` text still says **rangkaian neural** and then explains it in a following sentence. Never
substitute a folksy stand-in for a term the reader will meet elsewhere.

### 8c. 🔑 `ms-easy` keeps `anda` — do **not** switch to `kamu`

The obvious move is to reach for the warmer school-book pronoun. **Do not.** DBP's `kamu`-for-pupils
ruling is explicitly about **primary-school material addressed to children**: **"Lazimnya dalam buku
sekolah rendah, sapaan bagi murid ialah 'kamu'."** (21.09.2006), and DBP defines `kamu` by the
addressee being **"lebih muda daripada kita"**.

> Unless an `ms-easy` variant is explicitly **for children**, switching pronouns would **assert an
> age hierarchy over adult readers with low literacy** — a worse outcome than the slightly greater
> formality of `anda`. **Keep `anda`; simplify the sentences, not the pronoun.**

- ✅ `ms-easy`: **Sila klik butang ini. Anda akan melihat hasilnya.**
- ❌ `ms-easy`: **Sila klik butang ini. Kamu akan melihat hasilnya.** — ⚠ rule-derived from the DBP
  definitions, not a quoted DBP error example

### 8d. 🔑 The axis, named: in Malay the lever runs *inside* `baku`, never away from it

The obvious way to make a text easier is to move it toward the way people speak. **In Malay that is
the one direction that is closed**, and DBP says so in as many words. Asked directly whether the
everyday *dulu* may replace the standard *dahulu* in official writing:

> **"Perkataan “dulu” ialah bahasa percakapan dan bahasa percakapan tidak digunakan dalam penulisan
> atau urusan rasmi. Untuk urusan rasmi, perkataan yang betul ialah “dahulu”."** (12.08.2022)
> · and on the same axis, naming the dictionary label: **"Tau dan dahulu ialah bahasa percakapan,
> dalam Kamus Dewan dilabelkan sebagai bp. Bahasa percakapan tidak digunakan dalam konteks rasmi
> termasuklah iklan. Maka, penggunaan yang betul ialah "Rasa dahulu baru tahu"."** (09.01.2015)
> — <https://prpm.dbp.gov.my/Cari1?keyword=bahasa+percakapan&d=175768>
>
> ⚠ **DBP's own slip in the second quote:** it writes **"Tau dan dahulu"** where its own conclusion
> shows it means *tau* and **dulu**. The rule is unaffected; do not propagate the wording.

> **🔑 So the `ms-easy` axis is: `Kamus Dewan`-level vocabulary → `Kamus Pelajar`-level vocabulary,
> both of them inside `baku`.** It is **not** *baku* → *bahasa percakapan*, and it is **not**
> standard → dialect. §8b① states the constraint; this states the lever that remains.

**And DBP hands you the lever, already built.** PRPM serves *two* DBP dictionaries under the same
headword: ***Kamus Dewan Edisi Keempat*** (the full reference) and ***Kamus Pelajar Edisi Kedua***
(the school edition). Where both exist, **the *Kamus Pelajar* definition is DBP's own plain
paraphrase of the harder word**, written for a schoolchild — which is exactly the everyday equivalent
§8e needs, from the language authority, verbatim, with no invention anywhere in the chain. Two words
of a pair can also be separated by **presence**: a headword that *Kamus Dewan* carries and
*Kamus Pelajar* does not is, by DBP's own editorial decision, above school level.

⚠ **DBP's dictionary prose is abbreviated** — *dgn* = dengan, *drpd* = daripada, *dpt* = dapat,
*dsb* = dan sebagainya, *dll* = dan lain-lain, *utk* = untuk, *spt* = seperti, *sbg* = sebagai,
*yg* = yang, *bkn* = bukan, *ki* = kiasan. Three of its labels decide §8f and two of them are
DBP-sourced: **bp** = *bahasa percakapan*, stated by DBP itself — **"dalam Kamus Dewan dilabelkan
sebagai bp"** — and **Id** = the Indonesian sense (§6e). ⚠ **kep**, which *Kamus Pelajar* puts on
*tak* and *nak*, is **not** expanded by any fetched DBP source; what *is* quotable is *Kamus Dewan*'s
own gloss on the same headword, **"singkatan bagi tidak"**. Quotes below keep DBP's abbreviations;
**never let one reach shipped copy.**

### 8e. Formal → everyday word pairs

**Tier is marked per row.** **Official** = DBP's own *Kamus Pelajar* / *Kamus Dewan* gloss, quoted.
**Corpus** = measured by frequency contrast across the three corpora described under the table.
**craft** = this guide's judgment on which member is plainer.

| Formal / heavy | Everyday / plain | Evidence | Tier |
|---|---|---|---|
| **sebagaimana** | **seperti** | *Kamus Pelajar*: **"seperti (yg ada, yg dikehendaki, yg dirujuk dsb); sama halnya dgn"** · **200.5 vs 1.5** per 100k (law vs general press) — **134× formal skew, the strongest single marker in the set** | **Official + Corpus** |
| **sedemikian** | **seperti itu / begitu** | *Kamus Pelajar*: **"spt itu; sbg itu"** · **194.8 vs 2.3** per 100k — 85× skew | **Official + Corpus** |
| **lantaran** | **kerana** | *Kamus Pelajar*: **"oleh sebab; kerana"** · *lantaran* measures **0.0 per 100k in all three corpora**; *kerana* 92.0 / 52.6 / 45.1 | **Official + Corpus** |
| **berikutan** | **selepas** | *Kamus Pelajar*: **"ekoran drpd; akibat drpd; selepas"** · *selepas* **459.2** vs *berikutan* **13.9** per 100k in the press corpus — 33× | **Official + Corpus** |
| **melaksanakan** | **menjalankan / melakukan** | *Kamus Pelajar*: **"menjalankan (tugas, rancangan dll); melakukan"** · *melaksanakan* 139.2 (admin) vs 31.7 (press); *menjalankan* 104.4 (press) vs 21.7 (admin) — the pair skews **both** ways | **Official + Corpus** |
| **sekiranya** | **kalau / jika** | *Kamus Pelajar*: **"kalau; seandainya"** · *sekiranya* 80.4 (admin) vs 21.6 (press); *jika* 199.4 (press) | **Official + Corpus** |
| **seterusnya** | **selepas itu / kemudian** | *Kamus Pelajar*: **"selepas itu; sesudah itu; selanjutnya"** · 55.7 (admin) vs 7.7 (press) | **Official + Corpus** |
| **terdahulu** | **lebih awal** | *Kamus Pelajar*, whole definition: **"lebih awal"** · 38.4 (law) / 21.7 (admin) vs 10.0 (press) | **Official + Corpus** |
| **memperoleh** | **mendapat** | *Kamus Pelajar*: **"mendapat atau mencapai sesuatu dgn usaha"** | **Official** |
| **memaparkan** | **menunjukkan** | *Kamus Pelajar*: **"membuka atau menunjukkan supaya dpt dilihat dsb; mendedahkan"** | **Official** |
| **menyaksikan** | **melihat** | *Kamus Pelajar*: **"melihat sendiri; menghadiri"** | **Official** |
| **kediaman** | **rumah** | *Kamus Pelajar*: **"tempat tinggal (duduk dll): rumah (pondok dll) yg diduduki"** · *rumah* 173.9 vs *kediaman* 12.4 per 100k in the press corpus | **Official + Corpus** |
| **lazimnya** | **biasanya** | *Kamus Dewan*: **"biasanya, selalunya, umumnya"** — and *lazimnya* has **no *Kamus Pelajar* entry at all** while *biasanya* does: **"menurut yg lazim atau yg sudah-sudah; umumnya"** | **Official** |
| **merangkumi** | **meliputi / termasuk** | **no *Kamus Pelajar* entry**; *Kamus Dewan* glosses it only with equally heavy words (**"melingkupi, melingkungi, mencakupi, mencangkum"**) | craft |

**Corpus method** (Corpus-tier rows only): counts normalized **per 100,000 word tokens**, lowercased,
Latin-letter tokens, measured 2026-07-27 over three corpora fetched as raw bytes and parsed locally:

| Label | What it is | Tokens |
|---|---|---:|
| **general press** | 191 article-page fetches (two harvest passes, some overlap) off the homepages and section fronts of three Malaysian national news outlets — 961,346 characters | **129,367** |
| **administrative** | two MAMPU public-administration circular/compilation PDFs + two official-letter writing guidelines (a federal ministry's and a public university's) | **32,327** |
| **legal** | the Federal Constitution, Malay text, reprint as of October 15, 2020 | **104,224** |

⚠ **Three honest limits.** (1) **The general-press corpus is not a learner corpus.** Malaysia's school
textbooks are behind a school-account login and DBP's school magazines are sold, so **no Malaysian
learner corpus could be obtained** — the plain side is *general-audience journalism*, which sits
between a textbook and a circular. (2) The legal corpus states of itself: **"Teks ini HANYALAH
TERJEMAHAN oleh Jabatan Peguam Negara bagi Federal Constitution."** — it is the Attorney-General's
Malay rendering, so some of its heaviness may be translation, not native legal style. (3) The
administrative corpus is small and two of its four documents are manuals *about letter-writing*, the
most elevated register in the language. **Treat these numbers as diagnostic signals, not
lexicography** — the Official-tier column is what each row actually rests on.

### 8f. 🔴 Do NOT “simplify” these — the rows a translator will get backwards

**This is the highest-value part of §8.** Each row below is a swap that looks like a simplification,
is not one, and is refused by a source rather than by taste.

| Do **not** do this | Why |
|---|---|
| ~~*dahulu* → *dulu*~~ | DBP, verbatim: **"bahasa percakapan tidak digunakan dalam penulisan atau urusan rasmi. Untuk urusan rasmi, perkataan yang betul ialah “dahulu”."** *Kamus Dewan*'s entire entry for *dulu* is the line **"bp dahulu."** — a `bp` label and a cross-reference, nothing else. Measured: *dulu* **0.8** per 100k in the press corpus and **0.0** in both official corpora. **Official** |
| ~~*tahu* → *tau*~~ | Same DBP answer (09.01.2015). *tau* measures **0.0 per 100k in all three corpora.** **Official + Corpus** |
| ~~*tetapi* → *tapi*~~ | *Kamus Dewan* labels *tapi* **bp**; it has **no *Kamus Pelajar* entry**. Measured: *tapi* **0.0** in the administrative and legal corpora. **Official + Corpus** |
| ~~*tidak* → *tak*~~ | *Kamus Dewan*: **"singkatan bagi tidak"**; *Kamus Pelajar* tags it **kep**. The measurement is the interesting part: *tak* runs at **123.7** per 100k in the press corpus — because journalists quote speech — and at **0.0** in both official corpora. **Frequency in news is not a license.** **Official + Corpus** |
| ~~*hendak* → *nak*~~ | *Kamus Dewan*: **"kep hendak"**. *nak* 25.5 per 100k in press, **0.0** in both official corpora. **Official + Corpus** |
| ~~*boleh* → *bisa*~~ | *Kamus Dewan* gives *bisa* as **venom** first; the *can/able* sense carries the **Id** (Indonesian) sense label — **"Id boleh, dapat, mungkin"** (§6e, §9c). Measured: *bisa* **0.0 per 100k in all three Malaysian corpora.** **Official + Corpus** |
| ~~*keupayaan* → *kemampuan*~~ | ⚠ **Backwards.** *keupayaan* is the commoner Malaysian form — 14.7 (press) / 12.4 (admin) per 100k against *kemampuan* 7.7 / **0.0**. DBP's *Kamus Pelajar* uses *kemampuan* to *explain* *keupayaan* (**"kesanggupan atau kemampuan utk melakukan sesuatu"**), which is a definition, not a license to swap: in running Malaysian copy the swap trades a Malaysian word for an Indonesian-flavored one (§9c). **Corpus** |
| ~~*anda* → *kamu*~~ | §8c, and now measured: *kamu* is **0.0 per 100k across all three corpora.** **Corpus** |
| ~~*halaman* → *laman*~~ (in prose) | DBP: **"Laman ialah bahasa percakapan kepada perkataan halaman. Bahasa percakapan tidak diterima dalam penulisan formal."** (15.10.2008) — ⚠ **with DBP's own exception in the same answer**: **"dalam istilah bahasa Melayu, laman diterima. Contohnya laman web."** So *laman web* is correct; *laman* for a page of text is not. **Official** |
| ⚠ *justeru* as “therefore” | Not a simplification error but the same class of trap. *Kamus Pelajar*: **"1 kebetulan; tepat. 2 malahan; bahkan."** — DBP does **not** define *justeru* as *oleh itu*. If a sentence needs “therefore”, write **oleh itu**. **Official** |
| ⚠ any technical term | §8b③ is unchanged and outranks this whole section: **rangkaian neural** stays, and a following sentence explains it. |

- ✅ `ms-easy`: **Sila klik butang ini. Selepas itu, anda akan melihat hasilnya seperti dalam gambar.**
- ❌ `ms-easy`: **Sila klik butang ini. Seterusnya, anda akan menyaksikan hasilnya sebagaimana dalam
  gambar.** — three `Kamus Dewan`-level words where school-level ones exist
- ❌ `ms-easy`: **Klik butang ni. Lepas tu, kamu tak akan nampak apa-apa.** — the other failure, and
  the one this section exists to prevent: *ni*, *tu*, *tak*, and *kamu* left *baku* altogether, which
  §8d forbids. **Easier must never mean less standard.**

### 8g. What is still open

**Narrowed, not closed.** §8a's finding stands: **no Malaysian plain-language standard was located**,
and nothing above claims to be one — §8e is a *register* table built from DBP's two dictionaries plus
measurement, which is a different and weaker thing than a plain-language norm. Still outstanding, in
order of value: **(1) a Malaysian learner corpus** — school textbook text is behind a school-account
login and DBP's school magazines are sold, so the plain side of §8e's measurement is journalism
rather than teaching material; **(2)** whether Malaysia has adopted the international plain-language
standard as an `MS` standard — the national standards catalog host responds, but its search was
**not** driven in this pass, so this remains **unchecked, not answered**; **(3)** Malaysian
disability-policy (OKU) accessible-information guidance, still not obtained as machine-readable text.

Sources: <https://prpm.dbp.gov.my/Cari1.aspx?keyword=bahasa+Melayu+baku&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bahasa+mudah+difahami&d=175768> (negative result) ·
<https://prpm.dbp.gov.my/Cari1?keyword=bahasa+percakapan&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penggunaan+anda&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=ayat+pasif&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=penjodoh+bilangan&d=175768> ·
dictionary entries, one fetch per headword, at
<https://prpm.dbp.gov.my/Cari1?keyword=memperoleh> and the same URL pattern for *melaksanakan ·
menjalankan · mendapat · sekiranya · kalau · selepas · berikutan · lantaran · sebab · sedemikian ·
sebagaimana · seperti · terdahulu · seterusnya · menyaksikan · melihat · kediaman · memaparkan ·
menunjukkan · lazimnya · biasanya · keupayaan · kemampuan · merangkumi · mengemukakan · justeru ·
tapi · tak · nak · dulu · bisa* ·
<https://dbp.gov.my/pedoman-dan-panduan-bahasa-melayu/> (negative result) ·
<https://dbp.gov.my/pedoman-bahasa-melayu/> (negative result) ·
corpus texts fetched 2026-07-27:
<https://bhess.jpm.gov.my/wp-content/uploads/2024/06/Perlembagaan-Persekutuan-Cetakan-Semula-2020-1.pdf> ·
<https://dasar.jdn.gov.my/search-d/download-file/148/cf2b27658dfaf8158303ced9052a7a72> ·
<https://dasar.jdn.gov.my/search-d/download-file/347/5c82233d81c56cb111265bddb6f4b0e1> ·
<https://www.perpaduan.gov.my/images/2024/MUAT_TURUN/25-09-2024_SURAT_EDARAN_-_GARIS_PANDUAN_PENULISAN_SURAT_RASMI_MEMO_PERHUBUNGAN_EMEL_DAN_MINIT_BEBAS_DI_KPN_-_PINDAAN_2024.pdf> ·
<https://registrar.utm.my/polisiutm/wp-content/uploads/sites/429/2017/08/Garis-Panduan-PenulisanSuratRasmi.pdf> ·
<https://www.sinarharian.com.my/> · <https://www.astroawani.com/> · <https://www.bernama.com/bm/>

---

## 9. Regional variation

**Target: Malaysian standard written Malay (*bahasa Melayu baku*).** That is the register DBP
defines for formal situations (§8b) and the one every source in this guide models. Neutrality
strategy: **write what DBP writes.** DBP's own advisory prose is the reference voice — full
affixation, `ialah` for definitions, `sila` for instructions, *Walau bagaimanapun* / *Oleh itu* as
connectors. It is neither colloquial nor dialectal, and it carries no regional or community marking.

### 9a. Malaysia, Brunei, Indonesia

The MABBIM tables in §6d **are** the regional-variation evidence, published by DBP itself. Their
shape:

- **Malaysia and Brunei agree far more often than either agrees with Indonesia** — `muat turun`,
  `latihan`, `perisian`, `mesra pengguna`, `rangkaian neural` are shared, while Indonesia diverges
  (`ambil berkas`, `pelatihan`, `perangkat lunak`, `akrab-pengguna`, `jaringan syaraf`).
- **But Brunei is not Malaysia**, and the flagship term proves it: *artificial intelligence* is
  **kecerdasan buatan** in Malaysia and **kepintaran tiruan** in Brunei. Other Brunei-only forms
  observed: *kitaran hidup perisian* (MY: *kitar hayat perisian*), *kewibawaan data* (MY: *keutuhan
  data*). Everyday usage differs too — a Bruneian writing to DBP reported **"Di Brunei kami
  menggunakan istilah kurap susu"** for a skin condition DBP calls *ruam*.
- **Where Malaysia itself offers two variants**, the term bank lists them with a slash —
  *bias agregasi / bias pengagregatan*, *penyerpihan data; fragmentasi data*, *pengolahan data;
  pemprosesan data*. **Pick one per term in the term sheet and be consistent.**
- ⚠ **Brunei's Jawi status.** Jawi is widely described as co-official in Brunei; the only fetched
  statement is community-tier, and Brunei's own language authority could not be read (§2e). Its
  service menu does list **"Khidmat Jawi"**, which corroborates institutional support but is **not**
  a citation for co-official status. **⚠ unverified — a human must check the legal basis before the
  kit asserts it.**

### 9b. ⚠ Singapore — under-sourced, do not assert

Established: Singapore participates in MABBIM **as an observer only** — **"sebagai negara
pemerhati"** — and CLDR gives Singapore a different first day of week (`SG = sun` vs `MY = mon`).
**Beyond that, nothing was fetched.** The Malay-language path of the Singapore Malay language
council's site returns 404. **Do not assert Singaporean norms.**

### 9c. False friends — verified, and two popular ones debunked

Method: the Malaysian dictionary sense (via PRPM, Official Malaysian) against the Indonesian
dictionary (Official Indonesian). **Only pairs checked on both sides are listed.**

**✅ Verified divergence — `bisa` is the strongest case.**

| | Malaysian (`ms`) | Indonesian (`id`) |
|---|---|---|
| **bisa** | **"bisa I … 1. bahan beracun yg terdapat pd sesetengah jenis binatang (spt ular, kala, labah-labah, dsb)…"** — *venom* is sense 1 | **"bi.sa1 — v mampu (kuasa melakukan sesuatu); dapat"** — *can/able* is sense 1; the venom sense is `bi.sa2` |

> **The default reading flips.** **Never use `bisa` for "can" in `ms`.** Use **boleh** or **dapat**.

- ✅ **Anda boleh memuat turun fail ini.** · ✅ **Model ini dapat mengenal pasti corak.**
- ❌ **Anda bisa memuat turun fail ini.** — ⚠ rule-derived from the two dictionary entries, not a
  quoted error example

**✅ Verified divergence — `pejabat`.** In `ms`, *pejabat* is the **office (the place)**; in `id` it
is the **official (the person)**, and the "office" sense is marked archaic. See §6e — *Kamus Dewan*
flags the Indonesian senses itself with the `Id` label, which is what makes this pair unusually well
evidenced.

- ✅ **Pejabat kami di Kuala Lumpur.** — *our office is in KL*
- ❌ reading it the Indonesian way: *our official is in KL*

**✅ Verified, asymmetric — `banci`.** `ms` has two homographs, and sense I is **census**
(**"perhitungan (bilangan penduduk, lalu lintas, dll)"**); `id` has only the gender term, which is
pejorative. **Consequence: never use `banci` for "census" in text that may be read by Indonesian
speakers, and in `ms` prefer the full `bancian penduduk`.**

**❌ Debunked — `budak` is not a reliable false friend.** The popular claim is that *budak* means
*child* in Malay and *slave* in Indonesian. **Both dictionaries carry both senses, in the same
order:** `ms` **"1. anak, kanak-kanak… 2. hamba sahaya, pembantu rumah, abdi…"**; `id` **"n anak;
kanak-kanak"** then **"n antek; hamba; jongos; orang gajian"**. **The claim is not supported by the
two authorities. Stop repeating it.**

**❌ Debunked (downgraded) — `percuma` is weaker than usually claimed.** The folk version says
*percuma* = *free of charge* in Malay and *pointless* in Indonesian. In fact **both languages carry
both senses**, and the Malaysian dictionary lists *"tidak ada faedahnya… sia-sia"* **first** as well;
only the default reading in context differs. **Downgrade it from "false friend" to "ambiguous":
disambiguate with `secara percuma` or `tanpa bayaran` when "free of charge" is meant.**

- ✅ **Kursus ini ditawarkan tanpa bayaran.** · ✅ **Kursus ini percuma, tanpa sebarang bayaran.**
- ❌ bare **Kursus ini percuma.** in a pricing context — ⚠ craft judgment: ambiguous, not wrong

**✅ Orthographic divergence — `anda` vs `Anda`.** DBP writes **anda** lowercase mid-sentence
throughout its advisory answers; the Indonesian dictionary's own interface text writes **Anda**
capitalized mid-sentence consistently (**"memudahkan pencarian Anda melalui berbagai fitur…"**).
⚠ **No explicit DBP rule mandating lowercase was found — this is usage-derived** (§4a). It remains
the single cheapest tell that a `ms` string was written from `id` material.

**Other verified `ms` / `id` splits, collected:** *bilion / biliun*, *trilion / triliun*, *lapan /
delapan* (§5c); *Mac, Julai, Ogos, Disember* vs the Indonesian month set (§5f); *Jumaat* vs *Jum'at*
(§3e); plus the whole terminology heuristic in §6f.

> **Binding: an `ms` build must never be produced from, or merged with, Indonesian content, and the
> locale-negotiation layer must not fall back `ms` → `id` or `id` → `ms`** (§10). They are separate
> national standards with separate regulators; MABBIM harmonizes *terminology*, not running prose.

### 9d. Loanword layers — what is sourced, and what is deliberately left blank

- **Arabic layer — sourced.** The 1972 reform systematically re-spelled Arabic loans
  (*dharab* → *darab*, *kadhi* → *kadi*, *mudharat* → *mudarat*, *ma'af* → *maaf*, §3e). Weekday
  names (*Ahad, Isnin, Selasa, Rabu, Khamis, Jumaat, Sabtu*) are Arabic-derived, CLDR-verified.
  Register signal: religious, legal, formal-institutional.
- **English layer — sourced.** DBP documents the adaptation rule and its limits: **"penyesuaian ejaan
  bagi kata serapan daripada bahasa Inggeris dan bahasa-bahasa Eropah yang lain dibuat menurut
  peraturan penyesuaian huruf termasuklah perkataan zoo yang dikekalkan ejaannya seperti ejaan
  asal"** (18.10.2022). Register signal: technical, modern, administrative.
- **⚠ Sanskrit and Portuguese layers — no source fetched, deliberately left uncharacterized.** Do not
  let a reviewer's intuition fill this in; it needs a real reference.

Sources: <https://prpm.dbp.gov.my/Cari1?keyword=bisa> · <https://prpm.dbp.gov.my/Cari1?keyword=pejabat> ·
<https://prpm.dbp.gov.my/Cari1?keyword=budak> · <https://prpm.dbp.gov.my/Cari1?keyword=banci> ·
<https://prpm.dbp.gov.my/Cari1?keyword=percuma> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=bahasa+Melayu+baku&d=175768> ·
<https://prpm.dbp.gov.my/Cari1.aspx?keyword=ejaan+rumi+baharu&d=175768> ·
<https://dbp.gov.my/majlis-bahasa-brunei-darussalam-indonesia-malaysia-mabbim/> ·
<https://kbbi.kemendikdasmen.go.id/> (Indonesian side of each pair — cited to document divergence
only, never as an authority for `ms`) ·
<https://unpkg.com/cldr-core@48.2.0/supplemental/weekData.json> ·
<https://ms.wikipedia.org/wiki/Tulisan_Jawi> (⚠ community-tier, Brunei Jawi claim)

---

