<!-- base -->
# lang-tr — Turkish (Türkçe) — language guide

> **Setup & sources live in [`tr.setup.md`](tr.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Türkçe / Turkish. The written standard this guide targets is
**standard İstanbul Türkçesi** (ölçünlü / standard Turkish), the neutral written variety.
**BCP 47 code (base):** `tr`.
**BCP 47 code (simplified variant):** `tr-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`tr-x-simple`), but the
kit token `tr-easy` is the one that counts here.
**Speaker reach:** roughly **85 million** native speakers ("roughly 85 million native speakers in
current locale/profile sources" — worldlanguagescatalog, `tur`); spoken primarily in Türkiye and
also in Cyprus, Northern Cyprus, and diaspora communities across Europe and beyond, with **official
status in Türkiye and in Cypriot Turkish / Northern Cyprus contexts**. **⚠ the figure is a
locale-profile aggregate, not a census count** — verify against a census / Ethnologue figure before
citing it as an exact number.
**Script + direction:** modern Turkish Latin alphabet (29 letters, adopted 1928); **left-to-right**.
No script shaping, no bidi, no conjuncts — but the alphabet carries the **dotted/dotless i pair**
(İ/i, I/ı) plus **ç ğ ö ş ü**, which is the source of this language's single most dangerous
engineering trap (§3, §10, §11).
**Status:** planned — authored from an **external desk-research dossier** that was self-fetched
with a verbatim quote per factual claim, then independently reviewed against the cited
sources. Covers base `tr` and the `tr-easy` pendant. The dossier's
**STRONG** tiers carry verbatim primary-source quotes — casing/capitalization/punctuation from the
**TDK Yazım Kılavuzu**, numbers/dates/currency from **CLDR 48.2**, terminology from the **TDK GTS
JSON API** and **TÜBİTAK Ansiklopedi**; the **community/editorial** tiers (grammar-trap examples,
most plain-language word-pairs, the İstanbul-Türkçesi neutrality claim, the
"digital house-style" claim) are marked honestly at point of use. §7's stock phrases were
re-sourced row by row against TDK's own dictionaries and Turkish technical prose and now carry a
tier each; their **wrong-calque column stays craft**. **Not yet reviewed by a fresh
model against the cited sources, and not yet reviewed by a native speaker** — per the authoring
directive's "second set of eyes" rule ([QUAL-007](../../base/standards/QUALITY.md)), this header
records both gaps honestly.
**Easy or hard for this kit:** the Latin script is **easy** — whitespace word separation works,
so ordinary tokenization and word-boundary highlighting apply; no RTL, no shaping, no combining
marks. The **hard** parts are all invisible: (1) **locale-aware casing** — the dotted/dotless i
means `toUpperCase`/`toLowerCase` under the default locale silently corrupts text and breaks
comparisons and security checks (§3, §10, §11); (2) **agglutination** — one Turkish "word" is a
whole English clause, so naive string concatenation of UI fragments breaks; (3) **vowel harmony**
— suffix vowels change to match the root, so no single suffix form can be hard-coded in a
template.

Sources: <https://tdk.gov.tr/icerik/yazim-kurallari/buyuk-harflerin-kullanildigi-yerler/> ·
<https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/> ·
<https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/> ·
<https://worldlanguagescatalog.vercel.app/languages/tur.html> (speaker count and official-status
scope — a locale/profile aggregate, ⚠ not a census)

---

## 1. Header block

See above. One-line orientation: Turkish is a **Turkic, agglutinative, SOV, LTR** language written
in a 29-letter Latin alphabet with a shared written standard (İstanbul Türkçesi) across Türkiye and
Cyprus; the localization risks concentrate in **locale-aware casing (the dotted/dotless i),
suffix-driven morphology (agglutination + vowel harmony), comma-decimal number formatting, and a
register fork (siz vs sen)**.

---

## 4. Grammar for translators

**Word order.** Turkish is **head-final: the default is Subject–Object–Verb (SOV)** — the verb comes
last, and modifiers precede their heads. Word order is relatively free for emphasis (the pre-verbal
slot is the focus position), but the neutral written order ends on the verb. **⚠ editorial**
(standard typological description; the marked *devrik cümle* "inverted sentence" is sourced in §9).

- ✅ **Öğrenci dersi tamamladı.** — "The student completed the lesson" (lit. *student lesson
  completed*), verb-final.
- ❌ **Öğrenci tamamladı dersi.** — verb kept mid-clause: understood, but marked/inverted (*devrik*);
  neutral UI copy stays verb-final.

**Register — sen vs siz — and the project's recorded choice.**
`sen` = 2nd-person singular / informal; `siz` = formal (and also the literal plural). Addressing a
stranger with `sen` is socially marked — verbatim from the community write-up:
> "Tanımadığınız bir insana sen diye hitap etmek iki şeyin göstergesi olabilir: Birincisi cehalet."
> *(addressing a stranger as `sen` can signal two things: the first is ignorance.)*

`siz` is what a stranger / non-intimate expects.

> **Register decision (human-gate): siz (formal-respectful) — taken and recorded (provisional
> default).** For this kit's **broad, adult, educational audience**, the project default is **`siz`**
> with its formal verb endings. **Binding for all second-person copy in `tr` and `tr-easy` — pick
> ONE and never mix `sen` and `siz` within a flow.**
>
> **This is a genuine fork, and the default is flippable.** `sen` (informal) is fully defensible for
> a deliberately **friendly, warm, or child-facing** tone — the direct-address style common in
> consumer language-learning and gamified education apps — and flipping the whole project to `sen`
> is a legitimate project decision, not an error. Two honesty caveats: (1) the register **basis is
> community-sourced** (the sen/siz hierarchy above), **not a TDK rule** — TDK does not prescribe
> which register a platform must use; (2) the choice **shapes every sentence**, so it is decided
> once, at project level, and held. If the audience or brand voice shifts child-facing/informal,
> re-open this gate and flip to `sen` consistently — do not drift.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ **siz (the recorded default):** *"Buraya tıklayın."* (Click here.) · *"Hesabınıza giriş yapın."*
  (Log in to your account.)
- ✅ **sen (only if the whole project is flipped):** *"Buraya tıkla."* · *"Hesabına giriş yap."*
- ❌ **Mixed within one flow:** *"Hesabınıza giriş yap."* — `siz` possessive (`-ınız`) glued to a
  `sen` imperative (`yap`). This inconsistency is the #1 register defect; scan for it (§11).

**The grammar features that break a naive EN/DE → TR translation.** The dossier attests suffixal
morphology (agglutination, vowel harmony, the `-mI` question particle) from the Turkish Wikipedia
Kıbrıs-Türkçesi page; the linguistic descriptions themselves are uncontroversial but the
right/wrong example pairs are **⚠ editorial** (constructed to illustrate the sourced pattern).
Attestation, feature by feature: **(1)–(2)** rest on the wiki-attested suffixal morphology plus
editorial examples; **(3)–(4)** are standard-linguistics editorial with **no page fetched**; only
the **(5)** `-mI` particle carries a direct verbatim quote.

**(1) Agglutination — one Turkish word = a whole English clause.** Suffixes stack onto a root in
fixed order (plural–possessive–case…), e.g. **ev** (house) → **evlerinizden** = "from your houses"
(*ev-ler-iniz-den*). Do **not** expect 1:1 word mapping, and **do not build inflected words by
string concatenation** in templates — the noun itself changes shape.
- ✅ **evlerinizden** (one inflected word carries "from your houses").
- ❌ Splicing a template like `{{noun}} + "lerinizden"` — the root, the harmony vowel, and the case
  suffix all interact; a fixed suffix string will be wrong for most nouns.

**(2) Vowel harmony — suffix vowels change to match the root.** The plural is **-ler** after front
vowels but **-lar** after back vowels; the same applies to case/possessive suffixes and to
loanwords. You **cannot hard-code a single suffix form** in a template.
- ✅ **evler** ("houses", front vowel) · **kitaplar** ("books", back vowel).
- ❌ **evlar** / **kitapler** — a single hard-coded suffix form applied regardless of the root's
  vowel.

**(3) No grammatical gender — and no gendered pronoun.** Turkish has a **single 3rd-person pronoun
`o`** = he / she / it. English "he/she" collapses to `o`; this removes the agreement problem but
creates ambiguity when translating *into* English. Do **not** invent a gender split.
- ✅ **O, dersi tamamladı.** — "He/She completed the lesson" (one pronoun, no gender).
- ❌ Inventing *"o (erkek) / o (kadın)"* or forcing an English "he/she" split where the source is
  generic.

**(4) Evidentiality — witnessed past `-DI` vs reported/inferred past `-mIş`.** Turkish grammatically
marks whether you **witnessed** an event or only **heard/infer** it. English has no grammatical
equivalent, so a translator must decide whether to add a hedge ("apparently / reportedly") when
rendering `-mIş`. Getting this wrong changes the **epistemic stance** of educational content.
- ✅ **Geldi.** — "He came" (I witnessed it). ✅ **Gelmiş.** — "He came" (apparently / I'm told).
- ❌ Flattening both to one English "he came" **and** dropping the reported-evidence nuance when
  going EN→TR — pick `-DI` vs `-mIş` deliberately, don't default.

**(5) Yes/no questions use the `-mI` particle, not word order (STRONG — quoted).** Questions are
formed with a **separate written particle** (*mu / mı / mü / mi*, harmonized, written separately),
not by intonation or word order alone. Verbatim (the source contrasts standard Turkish with the
Cyprus dialect, which *drops* it):
> "soru biçimcesi =mI genelde kullanılmaz ve soru, vurgu ile oluşturulur" *(in Cyprus the `-mI`
> question marker is generally not used, and the question is formed by stress).*

That is exactly why **standard** Turkish must keep the particle.
- ✅ **Geliyor mu?** — "Is he coming?" (particle present, written separately).
- ❌ **Geliyor?** — signaling the question by word order / intonation alone (a frequent EN→TR
  error; also a Cyprus-dialect marker, §9).

Sources: <https://tr.wikipedia.org/wiki/K%C4%B1br%C4%B1s_T%C3%BCrk%C3%A7esi> (suffixal morphology,
vowel-harmony archiphonemes, and the verbatim `-mI` quote) ·
<https://kelimelerbenim.com/siz-yerine-sen-demek-ve-turkcedeki-gizli-hitap-hiyerarsisi> (sen/siz —
community; the `siz`-is-respectful fact is sourced, the platform register recommendation is a
project decision, not a cited rule) · SOV description, evidentiality, gender, and the example pairs
are **⚠ editorial** (standard linguistics; pairs constructed to illustrate the sourced patterns)

---

## 5. Numbers, dates, currency

All values below are **STRONG** — read verbatim from **CLDR 48.2** `tr` locale data (§2).

**Digit system.** Turkish uses **Western digits 0–9** (no separate native digit set). The trap is
not the digits but the **separators, which are the opposite of English**.

**Decimal & grouping (opposite of English).**
- decimal separator = **comma**: CLDR `"decimal": ","`.
- grouping separator = **dot/period**: CLDR `"group": "."`.
- So "one thousand two hundred thirty-four point five" is written **1.234,5**.

- ✅ **1.234,5** — dot groups thousands, comma is the decimal.
- ❌ **1,234.5** — English convention (comma groups, dot decimals): a Turkish reader parses this as
  wrong or as a different number.

**Currency — Turkish Lira.**
- symbol = **₺** (and `symbol-alt-narrow` also **₺**): CLDR `"symbol": "₺"`.
- letters variant = **TL**: CLDR `"symbol-alt-variant": "TL"`.
- display name: CLDR `"displayName": "Türk lirası"`.
- currency pattern: CLDR `"pattern": "¤#,##0.00"` — the raw pattern puts the symbol slot **before**
  the amount, **but** everyday Turkish presentation places the symbol/`TL` **after** the amount
  (e.g. **49,90 ₺** / **49,90 TL**). The symbol-after-amount note is **⚠ editorial**; the pattern
  itself is verbatim. **Rule: verify the runtime formatter's output rather than hand-placing the
  symbol.**

- ✅ **49,90 ₺** / **49,90 TL** (comma decimal, symbol after — common usage).
- ❌ **₺49.90** (symbol before + English decimal).

**Dates (Gregorian, CLDR `tr`).**

| Format | Pattern | Example |
|---|---|---|
| Full | `d MMMM y EEEE` | 25 Temmuz 2026 Cumartesi |
| Long | `d MMMM y` | 25 Temmuz 2026 |
| Medium | `d MMM y` | 25 Tem 2026 |
| Short | `d.MM.y` | **25.07.2026** (day-first, dot-separated) |

- ✅ **25.07.2026** — day-first, dot separators (the `tr` short norm).
- ❌ **07/25/2026** — never use MM/DD/YYYY for Turkish; day-first, dot-separated is the norm.

**Time — the separator is a dot, not a colon.** The second desk-research dossier records TDK's own
written form: *"For time, TDK gives `17.30` as a standard written form and also allows worded times
in prose"* (TDK, *sayıların yazılışı*). So the written pattern is **`HH.mm`**, 24-hour, consistent
with the dot used as the date separator — and worded forms (*saat beş buçuk*) are legitimate in
running prose.

| Format | Pattern | Example |
|---|---|---|
| Time (written, 24-hour) | `HH.mm` | **17.30** |

- ✅ **17.30** — dot separator, 24-hour (the TDK written form).
- ❌ **17:30** — colon separator; ❌ **5:30 PM** — 12-hour clock with an English AM/PM marker.

**⚠** This row comes from the second dossier's TDK summary, **not** from a re-fetch of the TDK page
and **not** from CLDR: CLDR `tr` time patterns were not fetched for this guide, and a runtime
formatter may legitimately emit `17:30`. **Rule: if the value is machine-formatted, verify the
formatter's `tr` output rather than hand-writing the separator; the `HH.mm` rule governs
hand-authored copy.**

Sources:
<https://unpkg.com/cldr-numbers-full@48.2.0/main/tr/numbers.json> ·
<https://unpkg.com/cldr-numbers-full@48.2.0/main/tr/currencies.json> ·
<https://unpkg.com/cldr-dates-full@48.2.0/main/tr/ca-gregorian.json> ·
version pin <https://unpkg.com/cldr-core@48.2.0/package.json> ·
time format <https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/>
(CLDR 48.2; "TL/₺ after amount in common usage" is ⚠ editorial; the `17.30` time form is carried
from the second desk-research dossier's summary of that TDK page, ⚠ not independently re-fetched)

---

## 6. Terminology strategy

**Loanword vs native coinage.** TDK actively **Turkicizes** (öz-Türkçe coinage), so many terms have
both an older loanword and a TDK native form; the native form is often the modern written standard.
The dossier's directly attested pair (STRONG) is **yanıt → cevap** ("answer"), where the öz-Türkçe
*yanıt* cross-references the Arabic-origin loanword *cevap* in TDK's own dictionary:
> TDK GTS, `?ara=yanıt` — definition **"► cevap"** (i.e. *yanıt* is the öz-Türkçe equivalent of the
> loanword *cevap*).

**Working policy:** prefer the **established sector term over a novel native coinage**; keep
well-known international acronyms (AI, ML, GPU, API) in Latin and inflect them with the apostrophe
(§3: *API'yi*, *ML'nin*). Where TDK/TÜBİTAK give a settled Turkish term (below), use it.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give the reader the Turkish term + the English original +
one short plain clause of what it means, then use the Turkish term alone afterwards. Instantiated
with a sourced term:

> **yapay zekâ** (artificial intelligence) — *bir bilgisayarın insana benzer biçimde algılama,
> öğrenme ve karar verme yeteneği* — then **yapay zekâ** alone on every later mention.

(The Turkish term and the paraphrase are drawn from the sourced TDK GTS definition below; the exact
sandwich wording is authored per the format, not a quoted string.)

**Seed field vocabulary (AI / ML).** STRONG rows carry a verbatim TDK-GTS or TÜBİTAK quote;
**[community]** rows are field-standard usage cited to the community AI-terms glossary (widely used
but not in an official dictionary) — freeze the chosen forms in the project glossary and do **not**
mix competing renderings within the platform.

| # | English | Turkish (recommended) | Provenance + verbatim quote |
|---|---------|----------------------|-----------------------------|
| 1 | Artificial intelligence | **yapay zekâ** | **TDK GTS** — "Bir bilgisayarın … insana benzer biçimde algılama, öğrenme, fikir yürütme, karar verme, sorun çözme … yeteneği" |
| 2 | Machine learning | **makine öğrenmesi** | **TÜBİTAK Ansiklopedi** — "bilgisayarın bir olay ile ilgili bilgileri ve tecrübeleri öğrenerek gelecekte oluşacak benzeri olaylar hakkında kararlar verebilmesi" |
| 3 | Deep learning | **derin öğrenme** | **TÜBİTAK** — "Olayın genelini karakterize eden en ince ayrıntılara aşamalı olarak ulaşılmasına ise derin öğrenme denir" |
| 4 | (Artificial) neural network | **yapay sinir ağı** | **TÜBİTAK** — "Yapay hücreler ve bunların birbirleri ile bağlantılarından oluşan bir ağdır." |
| 5 | Algorithm | **algoritma** | **TDK GTS** — "iyi tanımlanmış kuralların ve işlemlerin adım adım uygulanmasıyla bir sorunun giderilmesi … Harezmi yolu" |
| 6 | Informatics / computing | **bilişim** | **TDK GTS** — "bilginin özellikle elektronik makineler aracılığıyla düzenli ve akla uygun bir biçimde işlenmesi bilimi; enformatik" |
| 7 | Neural network (short) | **sinir ağı** | [community] — glossary lists "Neural Network: Sinir ağı" |
| 8 | Convolutional neural network (CNN) | **evrişimli sinir ağları** | [community] — "Convolutional Neural Networks: evrişimli sinir ağları" |
| 9 | Recurrent neural network (RNN) | **tekrarlayan sinir ağları** | [community] — "Recurrent Neural Network (RNN): Tekrarlayan Sinir Ağları (proposed)" |
| 10 | Feature | **öznitelik** (also *özellik*) | [community] — "Feature: Öznitelik or özellik" |
| 11 | Layer | **katman** | [community] — "Layer: Katman (… 'çok katmanlı algılayıcı')" |
| 12 | Model | **model** | [community] — "Model: Model" |
| 13 | Dataset | **veri kümesi** | [community] lists "Dataset: Veriset"; **⚠** the more formal written form is *veri kümesi* (community source shows *veri seti / veriset* — editorial call) |
| 14 | Training | **eğitim / eğitmek** | [community] — "Training: Eğitim (implied in context)" |
| 15 | Gradient descent | **gradyan iniş** | [community] proposes *"Geçişli İniş"*; **⚠** no official standard — *gradyan iniş* is the more common industry form (editorial) |

Additional, **⚠ not directly re-fetched:** "fine-tuning → **ince ayar**"; "semantic network →
**anlambilimsel ağ**" (attributed to TÜBA in secondary sources — verify against TÜBA's own
dictionary before using).

Project coinages (C1) keep their original spelling in Turkish text and are owned by the term-sheet,
not this table.

Sources: <https://sozluk.gov.tr/gts?ara=yapay%20zek%C3%A2> · <https://sozluk.gov.tr/gts?ara=algoritma> ·
<https://sozluk.gov.tr/gts?ara=bili%C5%9Fim> · <https://sozluk.gov.tr/gts?ara=yan%C4%B1t> ·
<https://ansiklopedi.tubitak.gov.tr/ansiklopedi/yapay_zeka_ve_makine_ogrenmesi> ·
<https://github.com/deeplearningturkiye/turkce-yapay-zeka-terimleri/blob/master/oneriler.md>
(community glossary — rows 7–15 are field usage, not canon; *veri kümesi* and *gradyan iniş* are
⚠ editorial)

---

## 7. Idiom anti-patterns

**Stock phrases of educational and technical writing (EN → TR): idiomatic form ✅ vs literal calque
❌.** These are the phrases that actually recur in course copy, UI help, and documentation — the ones
a translator meets every day. Never calque them word-for-word into Turkish: idiomatic Turkish
instructional prose prefers **direct, concrete action wording over English metaphor transfer**, so
the English image usually has to be dropped rather than carried across.

**Evidence tiers in this table.** `TDK` = a Türk Dil Kurumu entry was fetched and quoted below —
the Güncel Türkçe Sözlük (`gts`), the Atasözleri ve Deyimler Sözlüğü (`atasozu`), or the
*Bilgisayar Terimleri Karşılıklar Kılavuzu* served by `sozluk.gov.tr/terim`. `corpus` = the phrase
was found in running Turkish technical or educational prose, quoted below; it evidences usage, not
prescription. `⚠ craft` = nothing was found at either tier — a competent editorial suggestion, and
**barred from §11**. Only `TDK` rows may become automated checks.

| # | English phrase | ✅ Idiomatic Turkish | ❌ Literal calque to avoid | ✅ tier |
|---|---------|--------------------|--------------------------|---|
| 1 | step by step | **adım adım** | *adım ile adım* — ⚠ craft | **TDK** |
| 2 | under the hood | **perde arkasında** / **arka planda** | *kaputun altında* — ⚠ craft (real Turkish, but only about actual cars) | **TDK** |
| 3 | in plain language | **sade bir dille** / **yalın bir dille** | *düz dilde* — ⚠ craft | corpus |
| 4 | at a glance | **bir bakışta** | *(none recorded — see the note below)* | corpus |
| 5 | keep in mind | **aklınızda tutun** (`siz`, §4) · *aklında tut* (`sen`) | *(none recorded — see the note below)* | **TDK** |
| 6 | make sure | **emin olun** / **kontrol edin** (`siz`, §4) | *yapmak emin* — ⚠ craft | **TDK** |
| 7 | for example | **örneğin** | *için örnek* — **grammatical Turkish with a different meaning**: "an example *for* X", never the discourse marker | **TDK** |
| 8 | break down into | **parçalara ayırmak** (abstract) / **bölümlere ayırmak** (into sections) | *aşağı kırmak* — ⚠ craft | corpus |
| 9 | built on top of | **üzerine kurulu** | *(none — see the note below)* | corpus |
| 10 | out of the box | **hazır halde** / **hazır olarak** | *kutudan çıktığı gibi* | corpus (both columns) |
| 11 | the big picture | **büyük resim** | *büyük tablo* — means **a physically large painting**, not the abstract whole | **TDK** |

**The ✅ column, sourced.** Each quote below was fetched from the URL given in the Sources footer:

- **1** — TDK's own English→Turkish computing glossary maps the exact lemma:
  `{"sozcuk":"adım adım", … "sozluk_ad":"Bilgisayar Terimleri Karşılıklar Kılavuzu","kist":"BTK","dilkarma":"step by step","ingiliz":"step by step","yaytar":"2007"}`. The GTS headword adds
  the sense: `"madde":"adım adım" … "anlam":"Belli bir sıra takip ederek; kademe kademe, basamak
  basamak"`. This is the strongest row in the table — a Turkish rendering matched to the English
  source phrase by the language authority itself.
- **2** — GTS headword `"madde":"perde arkası" … "anlam":"Bir şeyin görünürde olmayan gizli yanı"`
  and `"madde":"arka plan" … "anlam":"Bir şeyin gerisindeki görünüm; geri plan"`. ⚠ *perde arkası*
  is a **GTS headword, not a deyim** — the Atasözleri ve Deyimler endpoint returns
  `{"error":"Sonuç bulunamadı"}` for it. Cite it as a dictionary entry, not as an idiom entry.
- **3** — corpus only. tr.wikipedia, *Babanız Atatürk*: "çocuklar için **sade bir dille**
  hazırlanmış". *yalın bir dille* is attested in the same corpus and is the register-neutral
  variant. TDK lists no *sade dil* / *düz dil* compound at all.
- **4** — corpus: *Sinopsis* — "Sinopsis kelimesinin kökeni Yunancadan gelmektedir, **bir bakışta**
  okunabilen anlamına gelir." The sibling **ilk bakışta** *is* a GTS headword
  (`"anlam":"Görür görmez"`), which corroborates the construction.
- **5** — Atasözleri ve Deyimler Sözlüğü: `{"sozum":"(bir şeyi) aklında tutmak","turu2":"Deyim","anlami":"1) bellemek; 2) unutmamak…"}`. The `siz` imperative is attested in running prose
  ("…şeyleri **aklınızda tutun**: vicdan, şeref, istiklal…"), so the §4 register form is not a
  guess.
- **6** — Atasözleri ve Deyimler Sözlüğü: `{"sozum":"emin olmak","anlami":"inanmak, güvenmek…","turu2":"Deyim"}`. The instructional `siz` form is corpus-attested in exactly this register
  ("…Apple ID ile ilişkili olduğundan **emin olun**").
- **7** — GTS headword `"madde":"örneğin" … "anlam":"► söz gelişi"`.
- **8** — corpus. *parçalara ayırmak* is the better fit for the abstract "break a concept down"
  (*Cogito ergo sum*: "Her sorunu çözümü için gerekli sayıda **parçalara ayırmak**");
  *bölümlere ayırmak* skews toward partitioning something into named sections (*SystemRescue*:
  "diskleri **bölümlere ayırmak** ve bölümleri yeniden boyutlandırmak için").
- **9** — corpus: *Bulmaca oyunu* — "Bulmaca oyunu, bulmaca çözme **üzerine kurulu** video oyunu
  türüdür." (rendered text; the saved source is wiki markup).
- **10** — corpus: *Çekirdek (bilgisayar bilimi)* — "Windows NT aygıt sürücüleri … **hazır halde**
  dağıtılırken, Linux sistemlerde bağlama işlemi çalışma zamanında dinamik olarak yapılır."
- **11** — GTS headword, marked *mecaz*: `"madde":"büyük resim" … "anlam":"Bir konuya, olaya ait
  ayrıntıların oluşturduğu bütün; büyük fotoğraf"`, with the linked deyim *büyük resmi görmek*.
  ⚠ The variant *genel resim* that an earlier revision offered alongside it is **not** supported —
  it is not a TDK entry and the only corpus hits are irrelevant (a painting movement, a school
  name). It has been dropped.

**⚠ The ❌ column is craft, not documentation — and this is the column that matters.** A wrong
calque is what actually stops a translator making the error, and it is the hardest thing to source:
a plausible-looking wrong form is easy to invent and almost never appears in a dictionary, because
dictionaries record what people *do* write. **No source was found documenting any of these forms as
an error Turkish translators actually make.** What the fetches could establish is narrower, and is
stated per cell above: rows 1, 2, 3, 6, and 8 carry ❌ forms with **zero** occurrences in the Turkish
Wikipedia corpus — they are not phrases anyone writes, which makes them safe to print but weak as
warnings. Rows 7, 10, and 11 are the useful ones, because their ❌ forms are **attested Turkish that
means something else**, which is the error shape a translator can actually fall into. Do not read
the ❌ column as documented usage evidence, and do not promote any of it into §11.

**Three cells were removed rather than kept, and one row went with them.**

- **Row 4** previously read ❌ *bir bakışta doğru olarak*. That is not a calque of "at a glance" —
  it is the ✅ phrase with three words appended, corresponding to no English source expression, and
  it has zero corpus occurrences. It taught nothing and is gone.
- **Row 5** previously read ❌ *akılda tutmakta kal*. That string embeds **akılda tutmak**, which is
  itself a TDK deyim (`{"sozum":"akılda tutmak","anlami":"unutmamak.","turu2":"Deyim"}`) — a
  translator skimming the ❌ column would reasonably conclude that a valid TDK idiom is forbidden.
  Removed rather than reworded, because no replacement calque could be sourced.
- **Row 9** previously read ❌ *üstüne inşa edilmiş*. That is correct Turkish, corpus-attested
  (*Martı Evi*: "bir kayanın **üstüne inşa edilmiş** ahşap evdir"), and the *üzerine* variant is
  mainstream in exactly the software sense (*Logic Pro*: "Logic'in ses motoru **üzerine inşa
  edilmiş** bir başka uygulamadır"). The only difference from the ✅ is register — *üstüne* is more
  colloquial than *üzerine*. Condemning it was a defect; the cell is gone.
- **The `user-friendly` row is deleted outright.** It rendered ✅ *kullanımı kolay* against
  ❌ *kullanıcı dostu olan* — but **kullanıcı dostu is TDK's own prescribed equivalent for
  "user-friendly"**: `{"sozcuk":"kullanıcı dostu", … "sozluk_ad":"Bilgisayar Terimleri Karşılıklar
  Kılavuzu","dilkarma":"user-friendly","ingiliz":"user-friendly"}`. The row condemned the term the
  language authority prescribes, while its ✅ (*kullanımı kolay*) returns
  `{"error":"Sonuç bulunamadı"}` from the same glossary. Both are acceptable Turkish; the row as
  written was inverted, so it was removed rather than flipped.

**Row 10's ❌ was replaced, not invented.** The earlier cell read *kutudan dışarıda*, which has zero
corpus occurrences — shadow-boxing. The calque Turkish tech writers actually produce is
**kutudan çıktığı gibi**, and it is attested: *Açık kaynak video oyunu* — "GNOME veya KDE-etkin
Linux'u **kutudan çıktığı gibi** gündelik oyunlar için … daha iyi bir seçenek". Note that the
*Doom II* article sets the same phrase in scare quotes, which is weak evidence that Turkish writers
themselves feel it as a borrowing. ⚠ Treating it as *wrong* rather than as *borrowed* is still this
guide's editorial call.

**Register.** Rows 5 and 6 are given in the **`siz`** imperative, matching §4. The `sen` forms are
shown for row 5 only because the phrase is more often met that way in the wild; a `siz` build must
not mix them.

**Retained from the earlier revision — sourced, but general proverbs rather than platform copy.**
Six pairs were fetch-verified against a bilingual idiom collection and are kept here because the
evidence is real, though a course translator will rarely need them: *kill two birds with one stone*
→ **bir taşla iki kuş vurmak** · *the apple doesn't fall far from the tree* → **armut dibine düşer**
· *spill the beans* → **baklayı ağzından çıkarmak** · *an eye for an eye* → **göze göz, dişe diş** ·
*time is money* → **vakit nakittir** · *a friend in need is a friend indeed* → **iyi dost kara günde
belli olur**.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: <https://www.easyturkishgrammar.com/post/turkish-proverbs-idioms-sayings-english>
(the six retained proverbs, verbatim) · **✅-column attestations, each fetched and quoted above** —
<https://sozluk.gov.tr/terim?ara=ad%C4%B1m%20ad%C4%B1m> (BTK glossary, English lemma
*step by step*) · <https://sozluk.gov.tr/gts?ara=ad%C4%B1m%20ad%C4%B1m> ·
<https://sozluk.gov.tr/gts?ara=perde%20arkas%C4%B1> ·
<https://sozluk.gov.tr/gts?ara=arka%20plan> ·
<https://sozluk.gov.tr/gts?ara=ilk%20bak%C4%B1%C5%9Fta> ·
<https://sozluk.gov.tr/atasozu?ara=akl%C4%B1nda%20tutmak> ·
<https://sozluk.gov.tr/atasozu?ara=emin%20olmak> ·
<https://sozluk.gov.tr/gts?ara=%C3%B6rne%C4%9Fin> ·
<https://sozluk.gov.tr/gts?ara=b%C3%BCy%C3%BCk%20resim> · corpus rows quoted from
<https://tr.wikipedia.org/wiki/Sinopsis>, <https://tr.wikipedia.org/wiki/SystemRescue>,
<https://tr.wikipedia.org/wiki/Bulmaca_oyunu>,
<https://tr.wikipedia.org/wiki/%C3%87ekirdek_(bilgisayar_bilimi)> and
<https://tr.wikipedia.org/wiki/A%C3%A7%C4%B1k_kaynak_video_oyunu> (corpus tier — shipped Turkish
technical prose, **not** a normative source) · the deleted `user-friendly` row was checked against
<https://sozluk.gov.tr/terim?ara=kullan%C4%B1c%C4%B1%20dostu>, which is why it is deleted ·
**the whole ❌ column remains ⚠ craft** — no source documents any of these forms as an error Turkish
translators actually make, and it is therefore barred from §11 · the second research dossier's own
citation (<https://tdk.gov.tr/tdk/kurumsal/yazim-kilavuzu/>) is an orthography guide and does not
evidence idiom equivalence; native-speaker confirmation still pending for every row

---

## 8. Simplified-language pendant (`tr-easy`)

Turkish has a named plain-language field but **no ratified standard**, so this section follows the
**uniform substitute procedure** of [language-guide-authoring](../language-guide-authoring.md) §8 —
subsections 8a–8g, in that order.

### 8a. ⚠ / ❌ The honest negative — a field exists, a norm does not

**The distinction matters and is kept sharp: Turkish "Kolay Dil" is a real, funded, named research
field. It is not a codified standard, and the field says so itself.**

| Body / source that would hold such a norm | Result | Level |
|---|---|---|
| **Turkish Easy-Language research (Kolay Dil)** — Academic tier, and the finding comes from *inside* the field | A peer-reviewed article, *Türkçe Kolay Dil'e İlk Yaklaşımlar*, funded by Türkiye's national research council (project 123K021), states the position in its own words: **“Ülkemizde ise Kolay Dil çok yeni bir dilsel fenomendir”** and **“Türkçe Kolay Dil çalışmalara henüz başlanmış ve çalışmalar uygulama aşamasına geçilebilmesi için kuramsal hazırlık aşamasındadır.”** — work has only just begun and is at the theoretical-preparation stage. It defines the field as **“Kolay Dil, standart dili anlamakta güçlük çeken bireyler için iletişim engellerini en aza indirgemek için tasarlanmış”**. | ❌ **no ratified standard — established by the field's own statement** |
| **Inclusion Europe**, whose *Information for all* rules are the most widely translated easy-to-read standard | The standards page offers the rules **in English** and *"in 15 other languages"*; the menu enumerates English, Français, Deutsch, Italiano, Español, Hrvatski, Čeština, Eesti, Suomi, Magyar, Latviešu, Lithuanian, polski, Português, Slovenčina, Slovenian. **Türkçe is not among them.** | ❌ **established for this body** |
| **TDK** — Türk Dil Kurumu, the official language authority (§2) | Its online dictionary was **queried directly this pass** for 23 headwords and answered every one; it is a **lexicographic** authority and **no plain-language norm was located under it**. Absence of a located document is not proof of absence. | ⚠ |
| **TSE** — Türk Standardları Enstitüsü, where a Turkish adoption of **ISO 24495-1:2023** (*Plain language*) would sit | Landing page reachable; **no standards-catalog search was performed**. **Nothing was learned either way.** | ⚠ **not checked** |

**One conceptual point the source itself makes, and `tr-easy` has to choose between them.** The
article treats **Kolay Dil** (Easy Language) and **Basit Dil** (Plain Language) as two different
concepts and says it will set out their differences. **The kit's simplified variant sits closer to
Basit Dil than to Kolay Dil**, and 8g keeps that open rather than deciding it here.

> **→ Consequence.** `tr-easy` **inherits the kit's base rules wholesale** from
> [accessibility-workflow](../accessibility-workflow.md). 8b–8f are the Turkish layer on top, and 8d
> is the part a translator will otherwise get backwards.

### 8b. Name the axis — Ottoman Arabic/Persian loan vs öz-Türkçe

**Hypothesis, not yet a finding.** The obvious axis for a Turkish easy-language variant is the
**Ottoman Arabic-and-Persian loan → the öz-Türkçe (native/reformed) word**, because the twentieth
century's language reform deliberately created exactly that doublet: a learned Ottoman word and a
Turkic replacement, for hundreds of concepts. The historical simplification movement it grew out of
is **Yeni Lisan / Genç Kalemler (1911)**, which pushed to replace heavy Ottoman vocabulary with
plain spoken Turkish. ⚠ **That background is carried from the previous edition of this section and
rests on a search summary, not on a re-fetched primary source.**

**The etymologies, however, are Official tier and were fetched this pass.** TDK's own dictionary
labels every loanword's source language. From its entries: **cevap** *Arapça cevāb*, **mesele**
*Arapça mesʾele*, **misal** *Arapça mis̱āl*, **imkân** *Arapça imkān*, **ihtimal** *Arapça iḥtimāl*,
**netice** *Arapça netīce*, **şart** *Arapça şarṭ*, **kelime** *Arapça kelime*, **tecrübe** *Arapça
tecribe*, **hadise** *Arapça ḥādis̱e*, **vaka** *Arapça vaḳʿa*, **muhtemelen** *Arapça muḥtemelen*;
**problem** is *Fransızca problème*. The öz-Türkçe members — *yanıt, sorun, örnek, olanak, olasılık,
sonuç, koşul, sözcük, deneyim, olay* — carry **no** source-language label, which is the dictionary's
way of marking a word as Turkish.

**A second, sharper signal from the same authority: TDK's lemma structure.** Where TDK considers one
member of a doublet the main entry, that entry carries the full definition; the other is printed as
a bare cross-reference arrow **►** pointing at it. That is a *directional* judgment by the official
authority, and 8d shows it does **not** always point at the öz-Türkçe form.

### 8c. Measure the axis

| Corpus | What it is | Size |
|---|---|---|
| **Expository** | **400 articles** of the national research council's popular-science monthly — educational expository Turkish, the register closest to this platform's own | 960,505 characters, **121,713 word tokens** |
| **Children's sample** | **74 documents**: 59 online posts of the same publisher's children's science magazine plus 15 articles from the public broadcaster's children's news section | 69,792 characters, **8,588 word tokens** |
| **Cross-check** | Turkish-encyclopedia `insource:` **page** counts (article namespace, not occurrence counts) — a volunteer corpus with a completely different contributor base | whole tr article space |

Counts are normalized **per 100,000 word tokens**, raw counts in brackets. Turkish **dotted and
dotless I** (İ/I) were folded to i/ı before case-insensitive matching — the default lowercase
mapping turns İ into i plus a combining dot and would have silently missed matches.

> 🔴 **The single most important caveat, stated before any number: the graded design this directive
> prefers could not be built for Turkish, and it was not for want of trying.** What was attempted
> and what came back:
>
> - The public broadcaster's children's portal publishes **video and games only** — its sitemap
>   index contains exactly two children, `sitemap-pages` and `sitemap-videos`, and **no article
>   sitemap**.
> - The national news agency's `/tr/cocuk` section **resolves but carries no article links**.
> - The research council's children's science magazine has **59 posts online**, most of them issue
>   announcements; they yield **2,423 word tokens** of running text.
> - The broadcaster's children's news section exposes **15 articles** and no working pagination.
>
> **So the "children's sample" is 8,588 tokens — one occurrence is 11.6 per 100k.** It is reported
> for direction only and **no row below rests on it alone.** The load-bearing evidence is the
> 121,713-token expository corpus plus the encyclopedia cross-check.

⚠ Three further caveats. (1) **The expository corpus is one publisher and one genre**; a vocabulary
preference may be house style, which is exactly why the cross-check is there and why 8d reports
disagreements rather than averaging them away. (2) **Frequency is not comprehension** — no Turkish
readability formula or comprehension study was located. (3) `insource:` counts **pages, not
occurrences**, so the two measurements are not directly comparable in scale — only in direction.

#### 8c-i. The previous edition's table, counted

Every row below except the first was marked **⚠ editorial** in the previous edition. **E** =
expository corpus per 100k (raw), **K** = children's sample per 100k (raw), **W** = encyclopedia
pages.

| Loan | öz-Türkçe | E: loan | E: öz-T. | K | W | Verdict |
|---|---|---|---|---|---|---|
| **misal** | **örnek** | **0.0 (0)** | **192.3 (234)** | 0 / 34.9 | — | ✅ **Decisive** — *misal* does not occur once in 121,713 tokens |
| **netice** | **sonuç** | 1.6 (2) | **240.7 (293)** | 0 / 116.4 | — | ✅ **Decisive** |
| **hadise / vaka** | **olay** | 0.0 (0) / 22.2 (27) | **46.0 (56)** | 23.3 / 34.9 / 69.9 | — | ✅ *hadise* absent; *vaka* survives in its narrow "case" sense |
| **mesele** | **sorun** | 1.6 (2) | **54.2 (66)** | 0 / 81.5 | — | ✅ Confirmed (*problem*, a French loan, runs 22.2) |
| **tecrübe** | **deneyim** | 4.9 (6) | **70.7 (86)** | 11.6 / 46.6 | — | ✅ Confirmed |
| **ihtimal** | **olasılık** | 12.3 (15) | **36.2 (44)** | 0 / 0 | — | ✅ Confirmed |
| **şart** | **koşul** | 4.9 (6) | **73.9 (90)** | 11.6 / 0 | **şart 1,133 vs koşul 488** | ⚠ **Contested — see 8d** |
| **imkân** | **olanak** | **23.8 (29)** | 18.9 (23) | 11.6 / 0 | **imkân 1,261 vs olanak 4,924** | ⚠ **Contested — see 8d** |
| **kelime** | **sözcük** | **9.0 (11)** | 1.6 (2) | 0 / 0 | **kelime 5,961 vs sözcük 1,869** | 🔴 **Reversed — see 8d** |
| **cevap** | **yanıt** | **94.5 (115)** | 46.8 (57) | 0 / 46.6 | cevap 3,977 vs yanıt 4,365 | 🔴 **Reversed — see 8d** |
| **muhtemelen** | **büyük olasılıkla** | 2.5 (3) | 3.3 (4) | 0 / 0 | — | ⚠ **Both rare — see 8d** |

#### 8c-ii. The axis beyond the table — and it mostly holds

Ten further doublets were measured to see whether the axis is real or an artifact of the eleven rows
above. In the expository corpus the reformed word wins every one of them, several by total wipeout —
**the Ottoman member occurs zero times in 121,713 tokens** in six cases:

| Loan | E | öz-Türkçe | E |
|---|---|---|---|
| **vazife** | **0.0 (0)** | **görev** | 88.7 (108) |
| **tabiat** | **0.0 (0)** | **doğa** | 117.5 (143) |
| **mühim** | **0.0 (0)** | **önemli** | 186.5 (227) |
| **malumat** | **0.0 (0)** | **bilgi** | 437.1 (532) |
| **tesir** | **0.0 (0)** | **etki** | 398.5 (485) |
| **binaenaleyh** | **0.0 (0)** | **bu yüzden** | 35.3 (43) |
| **hususi** | 1.6 (2) | **özel** | 280.2 (341) |
| **vasıta** | 1.6 (2) | **araç** | 60.0 (73) |
| **zira** | 3.3 (4) | **çünkü** | 54.2 (66) |
| **millet** | 4.1 (5) | **ulus** | 60.0 (73) |
| **sebep** | 22.2 (27) | **neden** | 208.7 (254) |

> **This is the first language in this kit where the etymological instinct is measurably *mostly
> right*.** The reform won, and a translator can generally trust the direction. **That is precisely
> what makes 8d dangerous**: a translator who has learned "the reform won" will apply it to the five
> pairs where it did not.

### 8d. 🔴 Do NOT "simplify" these — the exceptions the general rule will run over

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**cevap** → **yanıt**~~ | **This was the previous edition's only TDK-sourced row, and the citation says the opposite of what the row claimed.** TDK's entry for **yanıt** is the bare cross-reference **“► cevap”** — the arrow points *at* cevap, meaning the definition lives at **cevap** and *yanıt* is the pointer. TDK's **cevap** entry carries the full gloss (*"Bir soruya, bir isteğe, bir söz, bir davranış veya yazıya verilen karşılık; yanıt"*). Frequency agrees: **cevap 94.5 vs yanıt 46.8** per 100k in the expository corpus, and the encyclopedia has them level (3,977 vs 4,365). **No source examined supports the swap.** |
| ~~**kelime** → **sözcük**~~ | **The strongest reversal in Turkish — three independent signals, all pointing the same way.** TDK prints **sözcük** as **“► kelime”**. The expository corpus has **kelime 9.0 vs sözcük 1.6** (5.6×). The encyclopedia has **5,961 vs 1,869** (3.2×). Replacing *kelime* with *sözcük* trades a common word for one that is three to six times rarer. |
| ~~**şart** → **koşul** (applied blind)~~ | **Genuinely contested, two signals to one.** TDK prints **koşul** as **“► şart”**, and the encyclopedia has **şart 1,133 vs koşul 488**. Only the expository corpus favors *koşul*, and there by a wide margin (73.9 vs 4.9). One publisher's house style is the most likely explanation. **Do not treat *şart* as an Ottoman relic; both are current.** |
| ~~**imkân** → **olanak** (applied blind)~~ | **Contested, and the two corpora point opposite ways.** Expository: **imkân 23.8 vs olanak 18.9** — the loan ahead. Encyclopedia: **olanak 4,924 vs imkân 1,261** — the reformed word ahead by 3.9×. **The pair is live in both directions; pick one per surface and freeze it, do not "correct" one into the other.** |
| ~~**muhtemelen** → **büyük olasılıkla**~~ | Measured at **2.5 vs 3.3 per 100k** — both rare, the difference is 3 tokens against 4. And the "simpler" option is **a three-word phrase replacing a single word**, which is longer to read, not plainer. A simplification that adds two words to every occurrence needs better evidence than this. |
| ~~**hayat** → **yaşam**~~ | Not in the previous table, but the swap a translator will reach for next. Expository: **hayat 123.2 vs yaşam 96.9** — the Arabic loan ahead. Encyclopedia: **yaşam 16,718 vs hayat 10,610** — the reformed word ahead. **Contested; *hayat* is ordinary modern Turkish, not Ottoman residue.** |

> **→ The rule that follows.** In Turkish, **the etymological axis is a good default and a bad
> algorithm.** Apply it where 8c-i and 8c-ii measured it; stop at the six rows above. And never
> "correct" a word that is merely *not the reformed one* — `cevap`, `kelime`, `hayat`, `şart` and
> `imkân` are ordinary contemporary Turkish, and treating them as Ottoman relics makes the text
> stranger, not simpler.

### 8e. 🔑 The address decision for `tr-easy`

> **Decision, recorded so nobody "fixes" it: `tr-easy` holds §4's `siz`. The simplified variant does
> NOT switch to `sen`.**

- ✅ `tr-easy`, same as `tr`: **Bir model seçin.** · **Buraya dokunun.**
- ❌ `tr-easy` dropped to the familiar form: **Bir model seç.** · **Buraya dokun.**

**Two reasons.**

1. **Informality is not comprehension, and here it is a slight.** `sen` from an institution to an
   adult stranger is markedly familiar in Turkish. `tr-easy` readers include adults with lower
   literacy and adults with cognitive disabilities — **precisely the audience for whom being
   addressed as `sen` by a service reads as being talked down to.** Switching register buys nothing
   a reader can use: `seçin` is one syllable longer than `seç`, and that is the entire saving.
2. **Register is a §4 decision and binds both variants.** A reader toggling between `tr` and
   `tr-easy` must not experience a change in who is speaking to them. If the whole project is ever
   flipped to `sen`, **both** variants flip together — never `tr-easy` alone.

⚠ **Craft, and marked as such.** No Turkish source was located that rules on address form for
simplified or accessible text; the Kolay Dil literature (8a) is at the theoretical-preparation stage
and does not yet reach this question. This rests on §4's recorded decision plus the kit's recurring
finding across languages.

### 8f. What `tr-easy` is built on — in order of leverage

1. **Break the suffix-chained nominalizations. This is the main lever.** Turkish packs what English
   spreads over a whole subordinate clause into a single suffixed word (`-dığı`, `-eceği`, `-mesi`,
   `-ması`), and stacks them. A `tr-easy` sentence should carry **one finite verb per idea**, with
   the nominalized clause unpacked into a separate sentence. This **overrides nothing** in the base
   rules — it names Turkish's actual shape for
   [accessibility-workflow](../accessibility-workflow.md)'s "no nested or fronted clauses".
   ⚠ **Craft, built on §4's sourced grammar; no Turkish source prescribes it.**
2. **Keep the subject short, because the verb comes last.** Turkish is SOV: every word before the
   verb is held open in the reader's memory. A long pre-verbal subject is the Turkish version of a
   garden path. ⚠ **Craft.**
3. **Vocabulary third, from 8c — and 8d overrides it.** Use the measured pairs; do not extend them
   by ear, and never "correct" the six do-not rows.
4. **Term preservation is unchanged and binding.** Keep **yapay zekâ** and the other §6 terms, then
   “yani: …”, then a concrete example. **Never a folksy stand-in**, and never a different word for
   the same thing on the next screen ([translation-quality](../translation-quality.md)).

### 8g. What is still open

1. **No adequate plainer Turkish corpus was located, and this is the biggest gap in the section.**
   8c records exactly what was tried and what came back. A Turkish primary-school textbook corpus
   (MEB) or a graded-reader collection would let the whole of 8c-i be re-measured against a genuine
   plain register instead of against an expository one.
2. **The children's sample is 8,588 tokens.** No row rests on it; it should be replaced, not
   enlarged by more of the same.
3. **Four pairs are contested across sources** — *şart/koşul*, *imkân/olanak*, *cevap/yanıt*,
   *hayat/yaşam*. A third, larger, differently-sourced corpus would settle them. Until then they are
   freeze-one-and-hold decisions, not corrections.
4. **The TSE catalog was not searched.** Whether Türkiye has adopted ISO 24495-1 is open.
5. **Kolay Dil is funded and moving.** The article cited in 8a is a *first* approach from a national
   research-council project. **This section should be re-run when that project publishes rules** —
   it is the one language in this batch where the negative in 8a has a visible expiry date.
6. **Kolay Dil or Basit Dil?** The source distinguishes Easy Language from Plain Language; which one
   `tr-easy` targets has not been decided, and it changes the sentence-length and vocabulary bar.
7. **The remaining rows still want a native-speaker pass.** Every verdict above is a frequency or a
   lexicographic-structure claim; register is a usage fact a native reviewer can correct and a count
   cannot.
8. **The Yeni Lisan / Genç Kalemler background is still ⚠** — carried from the previous edition on a
   search summary and not re-fetched this pass.

Sources: <https://dergipark.org.tr/tr/pub/tkidergi/issue/86057/1478910> (*Türkçe Kolay Dil'e İlk
Yaklaşımlar*, Türk Kültürü İncelemeleri Dergisi; national-research-council project 123K021 —
Academic tier; all three Turkish quotes re-fetched and verified against the article page this pass) ·
<https://easy-to-read.inclusion-europe.eu/european-standards/> ·
**Etymologies and lemma structure (Official tier)** — TDK Güncel Türkçe Sözlük via
<https://sozluk.gov.tr/gts?ara=yan%C4%B1t> and the sibling queries for *cevap, mesele, problem,
sorun, misal, örnek, imkân, olanak, ihtimal, olasılık, netice, sonuç, şart, koşul, kelime, sözcük,
tecrübe, deneyim, hadise, vaka, olay, muhtemelen* — all 23 fetched this pass ·
**Expository corpus** — 400 articles of the national research council's popular-science monthly,
<https://bilimteknik.tubitak.gov.tr/>, enumerated via
<https://bilimteknik.tubitak.gov.tr/post-sitemap.xml> ·
**Children's sample** — <https://bilimcocuk.tubitak.gov.tr/post-sitemap.xml> (59 posts) and
<https://www.trthaber.com/haber/cocuk/> (15 articles) ·
**Cross-check** — `insource:` page counts via <https://tr.wikipedia.org/w/api.php> ·
<https://www.trtcocuk.net.tr/feed/sitemap-index.xml> (video and page sitemaps only — the negative
recorded in 8c) · <https://www.tse.org.tr/> (not searched) ·
[accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md) · [human-gate](../human-gate.md)

---

## 9. Regional variation

**Which standard the project targets: standard İstanbul Türkçesi.** The standard written language is
based on the **Istanbul dialect** (ölçünlü / standard Turkish). From the standard-Turkish search
source:
> "Türkiye Türkçesinin genel kabul görülmüş ve yazı diline aktarılmış ağzı, İstanbul ağzıdır."
> *(the generally accepted spoken form of Turkey Turkish, carried into the written language, is the
> Istanbul dialect.)*
> **⚠** search-summary, **not directly fetched** — treat as attributed; verify if load-bearing.

For this guide, **target standard İstanbul Türkçesi / ölçünlü Turkish** as the neutral variety.

**Turkey Turkish vs Cyprus Turkish (Kıbrıs Türkçesi).** Cyprus Turkish is a **dialect (ağız)** of
Turkish, not a separate language, but it is community-marked and should be **avoided in a neutral
guide.** Verbatim:
> "Kıbrıs Türkçesi, Kıbrıs Türkleri tarafından konuşulan Türkçe ağzıdır." *(Cyprus Turkish is the
> Turkish dialect spoken by Turkish Cypriots.)*

**Differences table** (from the Kıbrıs-Türkçesi source):

| Axis | Standard İstanbul Türkçesi (target) | Cyprus Turkish (avoid in neutral copy) |
|---|---|---|
| Yes/no question | `-mI` particle kept — **Geliyor mu?** | particle dropped, question by stress — "soru biçimcesi =mI genelde kullanılmaz" |
| Consonant voicing | standard | shifts *t↔d, k↔g* (kurt→gurd, taş→daş), *b↔p, s↔z* (patates→badadez), nasal *n↔ñ* (son→soñ) |
| Aspect | progressive **-Iyor** | aorist **-(A/I)r** often used where standard uses -Iyor |
| Syntax | verb-final, neutral | inverted **devrik cümleler** common |
| Vocabulary | standard | substantial Cypriot-Greek borrowing → distinct lexicon |

**Neutrality strategy (explicit).**
1. Write in **standard İstanbul Türkçesi / ölçünlü Turkish**.
2. **Keep the `-mI` question particle** and verb-final neutral order (the Cyprus markers above are
   exactly what to avoid).
3. Do **not** localize into Cyprus dialect — **the same `tr` text serves both Türkiye and Cyprus
   audiences** for written UI.

**⚠ editorial** (the neutrality recommendation is judgment, supported by the sourced dialect facts
above).

Sources: <https://tr.wikipedia.org/wiki/K%C4%B1br%C4%B1s_T%C3%BCrk%C3%A7esi> (Cyprus-Turkish
definition, phonetic/grammar/vocabulary markers, verbatim) · İstanbul-Türkçesi-is-neutral claim is
⚠ (search summary, not directly fetched)

---

