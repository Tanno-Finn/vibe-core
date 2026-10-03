<!-- base -->
# lang-ko — Korean (한국어 / 조선말) — language guide

> **Setup & sources live in [`ko.setup.md`](ko.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** 한국어 (South Korea) / 조선말 (North Korea) / Korean. The written
standard this guide targets is **South Korean 표준어 (Standard Language)** as codified by the
National Institute of Korean Language.
**BCP 47 code (base):** `ko`.
**BCP 47 code (simplified variant):** `ko-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`ko-x-simple`), but the
kit token `ko-easy` is the one that counts here.
**Speaker reach:** roughly **77–82 million** speakers, concentrated in South Korea and North
Korea, with sizable diaspora communities in China, Japan, the United States, and Central Asia.
Official national language in both Koreas. (⚠ approximate — summary figures, not a single census
or Ethnologue count; exact totals vary by source and year.)
**Script + direction:** **Hangul (한글)**, a featural alphabet whose letters (자모 / *jamo*) are
composed into **syllable blocks**; **left-to-right**, horizontally. Optional **Hanja (한자)** — CJK
ideographs — appear in limited disambiguation, academic, legal, and name contexts. Not an RTL
script; not a cursive-joining script — the hard part is **syllable composition / Unicode
normalization**, not shaping.
**Status:** planned — authored from **external desk research** (a standard Round-1 pass plus a
targeted Round-2 follow-up mini-brief on the thin sections: Unicode ranges, quotation marks,
register, AI terminology, plain-language norm, North–South differences). Covers base `ko` and the
`ko-easy` pendant. Load-bearing NIKL / Unicode / TTA citations were **independently re-fetched
during the transform** (see §CITE-VERIFY in the header note below); **not yet reviewed by a native
speaker** — per the authoring directive's "second set of eyes" rule, this header records that gap
honestly.
**Easy or hard for this kit:** Korean is **kind to tokenization** — words are whitespace-separated
(띄어쓰기) and written LTR, so ordinary word tokenizers and word-boundary highlighting broadly work.
It is **not** an RTL or contextual-shaping language, so none of the Arabic bidi machinery applies.
The genuinely hard parts are three: **(1) Unicode normalization** — the same syllable can be stored
precomposed (NFC) or decomposed into jamo (NFD), and a pipeline that mixes them silently breaks
search, comparison, and display; **(2) grammar-sensitive spacing** — 띄어쓰기 follows orthographic
rules, so token boundaries are not English-morphology boundaries; and **(3) honorifics + speech
levels** — an agglutinative register system that forces a register decision (now made — 해요체, §4)
before any UI copy is written.

Sources: <https://www.korean.go.kr/front_eng/main.do> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/>

> **Transform CITE-VERIFY note (fresh-fetch pass, 2026-07-24).** These load-bearing anchors were
> re-fetched and confirmed to support their claims: **Unicode 16.0.0 ch.18** (Hangul Jamo
> U+1100–U+11FF, Compatibility Jamo U+3130–U+318F, Hangul Syllables block U+AC00–U+D7AF) ✓;
> **NIKL 온라인가나다** — 해요체 = 비격식체, 하십시오체 = 격식체 ✓; **NIKL 문장 부호 해설** —
> 큰따옴표/작은따옴표, 겹낫표 『』/겹화살괄호, 홑낫표 「」/홑화살괄호 ✓ (the landing page's TOC
> renders the 화살괄호 loosely as ≪ ≫ / ASCII `< >`; proper code points in the §3 glyph note); **TTA 기계 학습**
> (spaced) = machine learning ✓; **TTA 심층 기계 학습** = deep learning, synonym 딥러닝 ✓;
> **CLDR `ko`** default numbering system = `latn` (Western digits) ✓. **One anchor failed:** the
> research's TTA URL for *artificial intelligence* (`word_seq=177513-1`) actually resolves to
> **기계독해** (machine reading comprehension), **not** 인공지능 — so 인공지능's *TTA citation* is
> **misattributed and downgraded to ⚠** at point of use (the term 인공지능 itself is the universally
> standard rendering; only its TTA anchor is bad). The **North–South 두음법칙 PDF** resolved as a
> binary the fetcher could not read (⚠ not text-verified), but the rule itself is canonical NIKL
> orthography (한글 맞춤법) and is anchored there instead.

> **Correction pass (citations, 2026-07-26).** Two citation defects found and fixed. (1) **RR
> issuing body was misattributed.** The guide credited **NIKL** as the authority for the Revised
> Romanization; RR is **issued by the 문화체육관광부 (Ministry of Culture, Sports and Tourism)** as
> 고시 제2014-42호, while NIKL **develops and maintains** it. Corrected in §2 and §3, keeping NIKL's
> real role. The NIKL English RR page was re-fetched and confirmed to carry the rule tables **without
> naming an issuing body**; `kornorms.korean.go.kr` was **DNS-unreachable (ENOTFOUND)**, so the
> 고시 numbers are marked **⚠ secondary-sourced**. (2) **CLDR citation was stale** (v47). Replaced
> throughout with Unicode's **version-agnostic permalink** `charts/latest/summary/ko.html`, which was
> re-fetched and resolved to the CLDR 48 charts, header **"CLDR Version 48.2"**, re-confirming
> `Numbering System default = latn` for `ko`; the release/date table
> (<https://cldr.unicode.org/index/downloads>) was fetched for the 48 / 48.1 / 48.2 / 48.2.1 dates.
> The optional §3 addition on 작은따옴표's "inner thought" use was **not made** — the 문장 부호 해설
> landing page serves only a table of contents, not the rule bodies, and the norms subdomain that
> hosts them was unreachable, so there was nothing quotable from a page actually fetched.

---

## 1. Header block

See above. One-line orientation: Korean is an agglutinative, **SOV**, **LTR** language written in
**Hangul syllable blocks** with a single dominant written standard (South Korean 표준어) for
international products; the localization risks concentrate in **Unicode normalization (NFC/NFD),
grammar-sensitive spacing, honorific/speech-level register, dual number systems, and
Sino-Korean-vs-loanword terminology**.

---

## 4. Grammar for translators

**Word order.** Korean is **SOV** (Subject–Object–Verb): the verb (or adjective-predicate) comes
**last**, and the language uses **postpositional particles (조사)**, not prepositions. English word
order must be restructured, not transcribed.

- ✅ **저는 한국어를 배워요** (jeo-neun hangugeo-reul baewoyo) — "I learn Korean" (lit. *I Korean
  learning*); verb-final.
- ✅ **학교에 가요** (hakgyo-e gayo) — "go to school"; **에** is a direction/location postposition.
- ❌ **저는 배워요 한국어를** — verb pulled mid-clause: understood, but marked/unidiomatic. UI text
  respects verb-final order.

**Register / politeness — and the project's recorded choice.** Korean encodes politeness in **speech
levels** (문체) realized as **sentence-final verb endings**, layered on top of **subject honorifics**
(the infix **-(으)시-** and honorific nouns/particles). The two levels a platform chooses between:

| Level | Name | Character | Ends in |
|---|---|---|---|
| **비격식체 (informal-polite)** | **해요체** | friendly, warm, polite-neutral | …-아요/어요/여요 (눌러요, 배워요) |
| **격식체 (formal-deferential)** | **합니다체 / 하십시오체** | formal, deferential, official | …-ㅂ니다/습니다, …-십시오 (누르십시오) |

NIKL's 온라인가나다 explicitly classifies **해요체 as 비격식체** and **하십시오체(합니다체) as
격식체** — the confirmed anchor for this split.

> **Register decision (human-gate): 해요체 (polite-informal, friendly-neutral) — taken and
> recorded.** For a learner-facing educational platform, **해요체** is warm and
> approachable without being casual, and it is the register learners meet first. The formal
> **합니다체 / 하십시오체 (격식체)** is noted as the alternative for official notices, legal/consent
> text, or a deliberately formal brand voice. **Binding for all sentence-final endings in `ko` and
> `ko-easy`** — no drift into 합니다체 for "seriousness" or into the plain **해라체 (…-다/…-어)** for
> "friendliness."
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

- ✅ 해요체 (the recorded register): **여기를 눌러요** / **눌러 보세요** — "Click here."
- ❌ Register drift in the same UI: **여기를 누르십시오** (합니다체) or plain **여기를 눌러** (해라체).

The grammar features that break a naive EN/DE → KO translation:

**(1) Topic (은/는) vs subject (이/가) marking.** Korean marks **topic** with **은/는** and **subject**
with **이/가**; English marks neither, so translators guess wrong. Broadly: 은/는 sets the theme /
contrast ("as for X"); 이/가 introduces or identifies new information.

- ✅ **이 책은 재미있어요** — "As for this book, it's interesting" (topic; the book is already in view).
- ✅ **선생님이 오셨어요** — "The teacher has arrived" (subject 이/가 introduces the new event).
- ❌ **선생님은 오셨어요** *as a plain arrival announcement* — the 은 reads contrastive ("*the teacher*,
  as opposed to someone else, arrived"), which is not what a neutral notification means.

**(2) Honorifics must agree with an honored subject.** When the grammatical subject is a person the
text honors (teacher, elder, the user), the predicate takes the honorific infix **-(으)시-** and
honorific nouns take **님**; omitting it where it is due reads as rude, using it for inanimate
subjects reads as wrong.

- ✅ **선생님이 오셨어요** — 오+**시**+었어요 → "The teacher came" (subject honored).
- ❌ **선생님이 왔어요** — plain verb for an honored subject: grammatically fine but socially
  under-marked in polite copy.
- ❌ **주문이 나오셨어요** — over-applied honorific to an inanimate subject ("your order *honorably*
  came out") — a widely criticized "사물 존대" error; use plain **나왔어요**.

**(3) "You" is a trap — 당신 is not a neutral second person.** English "you" has no safe one-word
Korean equivalent. **당신** is **marked** (distant, confrontational, or spousal) and must **not** be
used as a generic UI "you." Korean instead **drops the pronoun** (pro-drop) or uses a **role noun +
님** (회원님, 고객님) or the person's name.

- ✅ **저장되었어요** (subject dropped) / **회원님, 저장되었어요** — "Saved."
- ❌ **당신은 저장했어요** — a calque of English "you saved"; 당신 reads cold or hostile in UI copy.

**(4) No grammatical gender; pronouns are often dropped.** Korean has **no grammatical gender** and
no obligatory subject pronoun. Do **not** import an English "he/she" split: **그** (he) / **그녀**
(she) are literary and often avoided in neutral instructional writing — repeat the noun or omit.

- ✅ Omit or repeat the referent noun for a generic third person.
- ❌ Forcing **그/그녀** onto a generic referent because the English said "he/she."

**(5) Counters / measure words (분류사) with the dual number system.** Counting a noun needs a
**counter**, and the counter selects **native-Korean** numerals (하나·둘·셋 → 한·두·세) or
**Sino-Korean** numerals (일·이·삼) by counter class (§5). Bare-number calques are wrong.

- ✅ **사진 세 장** — "three photos" (native 세 + counter **장** for flat objects).
- ❌ **세 사진** / **사진 삼** — missing counter, or wrong (Sino) numeral series for this counter.

Sources: <https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=319561>
(해요체 = 비격식체 / 하십시오체 = 격식체) ·
<https://www.korean.go.kr/front_eng/main.do> (orthography & standard-language norms) ·
(topic/subject, honorific, counter, and pro-drop *features* are standard descriptive Korean grammar;
the 당신 caveat and 사물 존대 example are localization judgment — ⚠ native-speaker confirmation
pending; Round-1's grammar survey source `asiasociety.org/education/korean-language` was a general
reference and is not relied on for the pairs above)

---

## 5. Numbers, dates, currency

**Digit system.** Modern Korean UI **overwhelmingly uses Western digits 0–9**, and **CLDR `ko`
defaults to the `latn` numbering system** (confirmed). Korean number *words* come in **two series** —
**native Korean** (하나, 둘, 셋 …, used up to ~99, with counters, ages, hours) and **Sino-Korean**
(일, 이, 삼 …, used for dates, money, phone numbers, minutes, large numbers). This is a *word-choice*
issue, not a digit-display issue: on screen you show digits; in read-aloud/spelled contexts the
series matters. **Rule: pick one digit system per context and never mix systems inside a single
number** (§11).

**Grouping — spoken myriads vs written triples.** Korean number *naming* is **10,000-based**: the
units are **만** (10⁴), **억** (10⁸), **조** (10¹²), so *twelve thousand three hundred forty-five* is
grouped conceptually as **1만 2345**. But **digit grouping in interfaces uses Western comma triples**
(`12,345`). Do not invent 4-digit comma groups; when writing **units in words**, use 만/억/조 (not
million/billion).

- ✅ Digits with triple grouping: **1,234,567** · ✅ worded units: **123만 4567**.
- ❌ Four-digit comma grouping **1,2345,67** (not a Korean convention).

**Decimal & grouping separators.** CLDR `ko` uses **period `.` as the decimal separator** and
**comma `,` as the group separator** — e.g. **1,234.56** — aligning with English, *not* the European
comma-decimal. (The `latn` default is confirmed from CLDR `ko`; drive the exact separator/pattern
rows from live CLDR `ko` data — §10.)

**Dates & times.** The common formal digital order is **year-month-day**, and NIKL's convention for
an **all-numeral date is periods with spacing and a trailing period**: **2026. 7. 24.** For running
text the worded form **2026년 7월 24일** is standard. **ISO 8601 (YYYY-MM-DD)** is a
backend/technical convention, not the end-user default. Time uses **오전/오후** (AM/PM) with a
12-hour clock in most consumer UI.

- ✅ Numeral date: **2026. 7. 24.** · ✅ worded: **2026년 7월 24일**.
- ❌ Dropping the trailing period (**2026. 7. 24**) or using slashes **2026/7/24** as if English.

**Currency.** The South Korean won is the **won sign ₩ (U+20A9; ISO 4217 KRW)** *before* the amount,
or the word **원** *after* the amount: **₩10,000** or **10,000원**. North Korean won is a separate
currency (KPW) — not a `ko` default for international products (§9).

- ✅ **₩10,000** / **10,000원** · ❌ **원10,000** (word-unit before the number) or a bare `W`.

Sources: <https://www.unicode.org/cldr/charts/latest/summary/ko.html> (CLDR `ko` default numbering = `latn`) ·
<https://www.korean.go.kr/front_eng/main.do> (date-writing convention, 한글 맞춤법 appendix) ·
<https://www.iso.org/iso-8601-date-and-time-format.html>
(native-vs-Sino numeral usage and 만/억/조 myriad grouping are standard descriptive Korean number
facts; exact CLDR separator/pattern rows to be read from live `ko` data)

---

## 6. Terminology strategy

**Loanword vs coinage.** Korean technical vocabulary mixes **phonetic English loanwords** (written in
Hangul via the **외래어 표기법**), **Sino-Korean compounds**, and native coinages. In practice,
highly entrenched English tech terms are **borrowed phonetically** (모델, 프롬프트, 알고리즘), while
scholarly/administrative and standards writing prefers **transparent Sino-Korean compounds** where
one exists (인공지능, 신경망). Transliteration follows the **외래어 표기법**, not ad-hoc phonetic
spelling; romanization (RR) is for identifiers, not display (§3).

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of
an established domain term (class **C3**), give target term + original + a short plain gloss, then use
the target term alone afterwards. Instantiated with a sourced term:

> **기계 학습** (machine learning) — 데이터에서 규칙을 스스로 학습하는 방법이에요. 이후에는 그냥
> **기계 학습**이라고 써요.

After first mention: **기계 학습** alone. Project coinages (C1) keep their original spelling in Korean
text and are owned by the term-sheet, not this table.

**The TTA-verification split — read this before trusting the table.** Only **three** of the ~15 core
AI/ML terms could be confirmed against the **TTA ICT dictionary**, and TTA prefers **spaced
Sino-Korean forms** that differ from common industry loanwords:

- **기계 학습** (spaced) — TTA-confirmed machine-learning term. **Common industry usage says
  머신러닝** (loanword). **Term conflict:** freeze one — TTA **기계 학습** is the standards form,
  **머신러닝** is the colloquial/industry form; do not mix within the platform.
- **심층 기계 학습** — TTA-confirmed deep-learning term, with **딥러닝** listed as its synonym. Common
  usage overwhelmingly says **딥러닝**.
- **인공지능** — the universally standard rendering of "artificial intelligence," **but its TTA
  citation is ⚠ misattributed** (the research's URL resolves to 기계독해, not 인공지능 — header
  CITE-VERIFY note). Keep the term; treat the *TTA anchor* as unconfirmed.

The remaining twelve are **informal — not TTA-verified** (widely used field usage, no confirmed
standards entry):

| Concept (EN) | Korean term | Status |
|---|---|---|
| artificial intelligence | 인공지능 | universally standard; **⚠ TTA anchor misattributed** |
| machine learning | **기계 학습** (TTA) / 머신러닝 (common) | **TTA-verified** ✓ — term conflict noted |
| deep learning | **심층 기계 학습** (TTA) / 딥러닝 (common) | **TTA-verified** ✓ — synonym 딥러닝 |
| neural network | 신경망 / 인공 신경망 | informal — not TTA-verified |
| model | 모델 | informal — not TTA-verified |
| training | 학습 | informal — not TTA-verified |
| inference | 추론 | informal — not TTA-verified |
| dataset | 데이터셋 | informal — not TTA-verified |
| feature | 특성 / 특징 | informal — not TTA-verified |
| label | 레이블 | informal — not TTA-verified |
| classification | 분류 | informal — not TTA-verified |
| regression | 회귀 | informal — not TTA-verified |
| algorithm | 알고리즘 | informal — not TTA-verified |
| generative AI | 생성형 인공지능 | informal — not TTA-verified |
| prompt | 프롬프트 | informal — not TTA-verified |

Treat the "informal" rows as **field usage to freeze in the project glossary**, not canon; confirm
against TTA / NIKL before promoting any to standard. **Prefer the established sector term over a
novel native coinage; keep well-known English acronyms (AI, ML, NLP) in Latin.**

Sources: <http://terms.tta.or.kr/dictionary/dictionaryView.do?word_seq=048323-10> (기계 학습 = ML) ·
<http://terms.tta.or.kr/dictionary/dictionaryView.do?subject=%EC%8B%AC%EC%B8%B5+%EA%B8%B0%EA%B3%84+%ED%95%99%EC%8A%B5>
(심층 기계 학습 = deep learning, syn. 딥러닝) ·
<https://www.korean.go.kr/front_eng/main.do> (외래어 표기법 — loanword transcription) ·
(the twelve "informal" rows are field usage, **not** TTA/NIKL-confirmed — flagged in-table)

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → KO): idiomatic form ✅ vs literal calque ❌.** These are common English
educational/technical stock phrases whose word-for-word transfer into Korean reads as foreign. Use
the idiomatic column; the calque column is what a naive translation produces and must be avoided.

| English phrase | Idiomatic Korean ✅ | Literal calque to avoid ❌ |
|---|---|---|
| step by step | 단계별로 / 차근차근 | 스텝 바이 스텝 |
| under the hood | 내부적으로 / 안에서는 | 후드 아래에서 |
| in a nutshell | 한마디로 / 요약하면 | 견과 속에 |
| from scratch | 처음부터 | 스크래치부터 |
| keep in mind | 기억해 두세요 / 염두에 두세요 | 마음에 유지하세요 |
| break down | 나누어 설명하다 / 분해하다 | 부수다 |
| at a glance | 한눈에 | 한눈에 봐서 |
| plug and play | 바로 사용 가능 / 꽂으면 바로 사용 | 플러그 앤드 플레이 |
| rule of thumb | 대략적인 기준 | 엄지의 규칙 |
| on the fly | 즉석에서 / 실시간으로 | 날아가는 동안 |
| side by side | 나란히 / 함께 비교해서 | 옆으로 옆으로 |
| behind the scenes | 보이지 않는 곳에서 / 내부에서 | 장면 뒤에서 |

**⚠ Provenance — analyst-generated, gap-flagged (native-speaker confirmation pending).** Round-2
research explicitly found **no NIKL/TTA style reference** that governs idiom transfer, so this table
is **localization judgment**, not an academy-sourced idiom dictionary. Treat the idiomatic column as a
strong working default that a native-speaker pass should confirm; the endings shown are lemma/neutral
forms — in shipped copy they take the recorded **해요체** (e.g. 기억해 두세요, 요약하면요).

Beyond stock phrases, keep the **grammar-level literal-transfer anti-patterns** (re-derived from §4):

- ❌ **Verb-mid / preposition calque:** *저는 배워요 한국어를* → ✅ **저는 한국어를 배워요** (SOV,
  postposition).
- ❌ **English "you" → 당신:** *당신은 저장했어요* → ✅ **저장되었어요** / **회원님, 저장되었어요**.
- ❌ **Missing honorific for an honored subject:** *선생님이 왔어요* → ✅ **선생님이 오셨어요**.
- ❌ **Forced he/she on a generic referent** (그/그녀) → ✅ omit or repeat the noun.
- ❌ **Bare number without a counter:** *사진 삼* → ✅ **사진 세 장**.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: idiom renderings — **analyst-generated, thin provenance** (Round-2 found no NIKL/TTA idiom
reference; ⚠ native-speaker confirmation pending) · grammar-level anti-patterns re-derived from §4.

---

## 8. Simplified-language pendant (`ko-easy`)

**Lead with the structural finding, because two independent signals converge on it.** A machine
corpus measurement was run for this guide (§8c), and its clearest result is not about words at all:
**mean sentence length 12.15 어절 against 18.58**, and the clause-connecting suffixes `-고` at
**45.1 against 472.0 per 100k** and `-며` at **5.6 against 256.8**. The adult daily **chains
clauses**; the children's paper **ends sentences**. Sentence length and clause-chaining are the same
finding measured two ways, and that makes it a stronger claim than either would be on its own.
Alongside it, `있어요` runs **191.8 against 11.9** — the 해요체 polite everyday form is a register
marker in the plainer corpus (§8e).

🔴 **Read the agglutination limit in §8c before treating any row of the word table as measured.**
Korean is agglutinative and the tool counts **word forms**, so the **verb and adjective rows of
§8b's table are NOT MEASURED**. Unmeasured is a different finding from *flat*, and a different
finding again from *refuted*: "flat" reads as evidence, and there is none. Only the **form-stable
noun stems** were probed.

The subsections follow the kit's uniform 8a–8g order, so a translator moving between languages
finds the same seven answers in the same seven places.

### 8a. The tradition and its authorities

**A real public-language movement, but no quantified rule.** Korea has an official
**plain-public-language tradition (쉬운 공공언어)**: NIKL publishes the **「쉬운 공공언어 쓰기
길잡이」** and **「쉬운 공문서 쓰기 길잡이」** as downloadable guides for simplifying government and
public communication. These are real, maintained documents — **not** just informal tips. NIKL also
maintains the public refinement database **다듬은 말** (18,323 entries) and a 2021 research report
on improving administrative-document expression, both quoted in §8b.

**⚠ No numeric standard — the honest finding.** Round-2 research confirmed that the accessible page
fragments of these guides give **qualitative** guidance (shorter sentences, direct structure,
concrete vocabulary, fewer dense Sino-Korean administrative terms) but **no stable numeric rule** —
no "maximum sentence length" or fixed vocabulary-level threshold that could be cited. So there is
**no quantified Korean plain-language pendant** comparable to German *Leichte Sprache*, and nothing
in this section may be presented as conformance to a Korean plain-language standard: `ko-easy`
**follows** NIKL's guidance, it does not certify against a norm.

**How `ko-easy` relates to the kit's base rules.** Because Korean contributes **no quantified
national pendant**, `ko-easy` **inherits the kit's base simplified-language rules directly** — from
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md): one
idea per sentence; the kit's own ~8–12-word working target (the **kit's** figure, **not**
attributable to a Korean norm); simple structure (respecting Korean's SOV order); no stacked hard
structures; everyday words; digits as digits (Western 0–9, one system per context, §5/§11); a
one-line "what is this" opener; and a consistent, literal tone (avoid irony and unexplained
metaphor). The Korean-specific overlays: **hold the recorded 해요체 register steadily** (§4, §8e) —
no drift to 합니다체 or plain 해라체 — and **prefer everyday native/loanword vocabulary over dense
Sino-Korean administrative terms**, bounded by §8d rather than by intuition.

### 8b. The axis — the measurement moves it to structure; the lexical claim stays the tradition's own

**What the measurement says the axis is.** Four signals, all from §8c:

| Signal | A — children's paper | B — daily paper | Factor |
|---|---|---|---|
| mean sentence length (어절) | **12.15** | **18.58** (median 16) | 1.53× |
| `고` — clause-connecting suffix, per 100k | 45.1 | **472.0** | 10.5× |
| `며` — clause-connecting suffix, per 100k | 5.6 | **256.8** | 45.9× |
| `있어요` per 100k | **191.8** | 11.9 | 16.1× |

The first three are **one finding**: the standard paper strings sub-clauses together with `-고` and
`-며` and therefore runs long sentences; the plainer paper puts in a period instead. **The
measured axis for `ko-easy` is clause-chaining and sentence length, not vocabulary.** The fourth
signal is a register form, and it is handled separately in §8e.

**The tradition's own claim about the axis, kept as the tradition's claim: 어려운 한자어 → 쉬운
우리말.** The table below is one specific axis, not a list of hard words, and the authority states it
explicitly. NIKL introduces its **다듬은 말** database as
**"어려운 한자어나 외국어를 쉬운 우리말로 다듬은 말을 찾아볼 수 있습니다."** ("you can look up words
that refine difficult Sino-Korean or foreign words into easy native Korean"). That sentence *is* the
`ko-easy` lexical rule as its authority states it: **from the dense Sino-Korean administrative word
to the everyday native one.** ⚠ It is recorded here as **the tradition's claim**, not as a measured
result — §8c could not test it (the corpora contain no administrative register) and §8d says what
follows from that.

**And NIKL supplies an operational test for "difficult", which makes the axis extensible.** Its 2021
research report scores public-language texts, and defines the category it penalizes:
*"1) 복수의 연구진이 어려운 것으로 공통 지적한 것을 검토 대상으로 함. 2) 1)의 대상어들 중
**한국어기초사전에 등재되지 않은 경우 어려운 한자어로 간주**함. 3) 1)의 대상어들 중 **순화어가 있는
경우**(다듬은 말, 알기 쉬운 행정 용어) 어려운 한자어로 간주함."* So a translator can test a candidate
word instead of guessing: **is it in the 한국어기초사전 learner dictionary? does a 다듬은 말 entry
exist for it?** Two lookups, both free, both NIKL's own. *(⚠ This guide states the test; it did not
run it over the table below — the learner-dictionary search interface did not answer automated
queries this pass. The per-row evidence below comes from 표준국어대사전 instead. See §8g.)*

**And the method for finding the replacement is NIKL's too**, which is exactly how the table below
was checked: *"‘상이(相異)하다’는 ‘서로 다르다’라는 한자어이다. ‘다르다’라는 우리말을 사용하여 한자어에
익숙하지 않은 사람들에게도 전달력을 높여야 한다. **국어사전을 활용하여 한자어에 대응하는 우리말을
찾아내고**, 그 우리말을 이용하여 문장을 작성한다면 …"*

**Structural overlay — the lever that outranks the word list, and now the measured one.** Korean's
SOV, head-final syntax lets administrative writing stack nouns in front of the predicate and then end
on a bare nominal, and NIKL's report treats that as the readability defect, not the vocabulary. §8c
independently puts the plain/standard contrast in the same place, so these three rules are the only
part of §8 that is **both sourced and measured**:

1. **Do not stack nouns; use `-하다` and let the predicate carry the sense.**
   *"핵심 개념이 대부분 서술성 명사만으로 제시되어 가독성이 떨어지는 사례이다. ‘-하다’를 적극적으로
   사용하여 서술부의 내용이 쉽게 이해될 수 있도록 수정한다."* And: *"과도한 명사 중심의 나열로 가독성이
   저하된 사례이다. … 동사 중심의 표현으로 풀어서 설명하여야 한다."*
2. **Do not end a sentence on a `-음`/`-기` nominal form.** *"‘있음’과 같이 명사형으로 끝맺음으로써
   위압감을 준다. 이를 풀어서 ‘있습니다’와 같이 써 주도록 한다."* — the report's stated reason is not
   only comprehension but **tone**: the bare nominal ending reads as intimidating. In `ko-easy` the
   full predicate is required anyway, in the recorded **해요체** (§4): 있어요, not 있음.
3. **The two levers compound, and the report says so in one line:** *"‘실질적 자구노력’은 명사의
   나열로 의미 이해가 어렵고, 어려운 한자어가 사용되었으므로 ‘실질적인 자체 노력’으로 표현한다."*
   Noun-stack **and** difficult Sino-Korean, fixed together.

- ✅ `ko-easy`: **신청서를 내면 결과를 알려 드려요.**
- ❌ noun-stacked, `-음`-ended, Sino-Korean-dense: **신청서 제출 시 결과 통보 예정임.**

**Complex → everyday word table.** **Tier is marked per row.** **Official** = prescribed in NIKL's
own materials. **사전** = **표준국어대사전** (NIKL's standard dictionary) both confirms the headword
is 한자어 (it prints the 한자) **and glosses it with the everyday word** offered here — the pair is
the dictionary's, following the method NIKL prescribes above, not this guide's. **⚠ craft** = this
guide's judgment, unattested. **⚠ The table as a whole wants a native-speaker pass**: a gloss shows
the words share a sense, not that the swap reads naturally in `해요체` UI copy. 🔴 **Every verb and
adjective row below is unmeasured** — see §8c and §8d before promoting any of them to a rule.

| Formal / administrative | Everyday Korean | Tier — evidence |
|---|---|---|
| 상이(相異)하다 | 다르다 | **Official** — NIKL's report prescribes exactly this swap (quoted above) |
| ~하는 자(者) | ~하는 사람 | **Official** — *"‘자(者)’가 자주 나오는데, 사람으로 한정될 경우에는 한자 대신 ‘~하는 사람’으로 수정할 것을 권장한다."* |
| 종료(終了)하다 | 끝내다 | **사전**: 종료 = *"어떤 행동이나 일 따위가 끝남. 또는 행동이나 일 따위를 끝마침."* |
| 이용(利用)하다 | 쓰다 | **사전**: 이용 = *"대상을 필요에 따라 이롭게 씀."* |
| 반환(返還)하다 | 돌려주다 | **사전**: 반환 = *"빌리거나 차지했던 것을 되돌려줌."* |
| 문의(問議)하다 | 물어보다 | **사전**: 문의 = *"물어서 의논함."* |
| 안내문(案內文) | 알림글 | **사전**: 안내문 = *"어떤 내용을 소개하여 알려 주는 글."* |
| 확인(確認)하다 | 알아보다 | **사전**: 확인 = *"틀림없이 그러한가를 알아보거나 인정함."* — 알아보다 is the dictionary's word; the earlier 보다 / 살피다 is ⚠ craft and narrower |
| 개시(開始)하다 | 시작하다 | ⚠ **Sino → Sino, not Sino → native.** The dictionary does gloss 개시 as *"행동이나 일 따위를 시작함"*, but 시작(始作) is itself 한자어 — this row runs on **familiarity**, not on the axis. Keep it; do not generalize from it |
| 실시(實施)하다 | 하다 | ⚠ craft — the dictionary glosses 실시 as *"실제로 시행함"*, and 시행 is Sino-Korean too; *하다* is this guide's reduction |
| 신청(申請)하다 | 내다 / 넣다 | ⚠ craft — the dictionary has *"단체나 기관에 어떠한 사항을 말이나 문서로써 밝혀 요청함"*; neither 내다 nor 넣다 is its word |
| 증빙(證憑) 서류 | 확인 서류 | ⚠ craft — the dictionary has *"신빙성 있는 증거로 삼음. 또는 그 증거"*; 확인 서류 is a paraphrase, and 확인 is itself 한자어 |

**Term-preservation rule (restated, binding).** In `ko-easy`, **keep the technical term and explain
it** — never swap in a folksy stand-in. Use the same term as the base variant, then "그건 …라는
뜻이에요", then a concrete example. E.g. keep **기계 학습**, then explain it in plain Korean; do **not**
replace it with an invented everyday word.

### 8c. The corpus measurement (machine-run, 2026-07-27)

Tool: `scripts/corpus-measure.mjs` (this kit). Reproducible.

| | Publication | Genre | Docs | Tokens | Mean sentence |
|---|---|---|---|---|---|
| **A (simpler)** | 소년한국일보 `kidshankook.kr` | children's newspaper | 99 | 17,731 | **12.15** |
| **B (standard)** | 동아일보 `donga.com` | daily newspaper | 250 | 84,112 | **18.58** (median 16) |

Tokenizer self-test (`있다`) passed: 113 hits in A, 583 in B. The counted unit is the **어절** (word
phrase), **not** the morpheme — so the sentence lengths above are to be read in 어절, and they are
**not the same unit** as the kit's ~8–12-**word** working target (§8a). Do not equate the two.

#### 🔴 The limit that governs everything below: Korean is agglutinative

The tool counts **word forms**. A verb listed as `상이하다` occurs in running text as `상이한`,
`상이합니다`, `상이하고`; `이용하다` occurs as `이용해`, `이용하는`. **The verb and adjective rows of
§8b's table are therefore not measurable with this tool — they are UNMEASURED, not "flat".** The
distinction is load-bearing: *flat* would mean the count was run and found no register signal, which
is evidence; *unmeasured* means no count reached those rows at all. What was probed instead is the
**noun stems**, which are form-stable. Every number in the probe table below is a noun-stem count.

⚠ **Confounds.** **Different publishers.** Every same-publisher pair was unavailable: the children's
editions of the major newspapers **decline automated text collection**. That is a stated position of
those publishers, not a technical fault — it was treated as a refusal, no workaround was attempted,
and none is to be attempted. And **A is small**: 17,731 tokens means **one occurrence ≈ 5.6 per
100k**, so any row resting on one or two raw tokens is a hint, not a finding.

**Thresholds, stated so the verdicts are checkable.** A direction is only claimed at a frequency
factor of **1.25×** or more. A row counts as **thin** below **3 per 100k** — **including when only
the formal word falls below it**, because a single occurrence carries no statement. Three labels
follow, and they mean different things:

- **thin** — the words are present but too rare here to judge the swap.
- **untestable** — the word is **absent from both corpora**: it belongs to a register these corpora
  do not contain.
- **reversed** — the count runs against the expected direction.

**thin** and **untestable** are **not refutations.** Both say *not measurable here*, which is not the
same finding as *measured and refuted*, and must never be reported as one.

**The noun probe.** Fifteen noun-stem pairs were probed. Where §8b's everyday word is a **verb**
(끝내다, 쓰다, 돌려주다, 물어보다, 알아보다), a form-stable noun stood in for it, so the everyday
column below often tests a **proxy**, not the guide's actual replacement word.

| Formal | Everyday probe | Formal A / B per 100k | Everyday A / B per 100k | Verdict |
|---|---|---|---|---|
| 상이 | 차이 | 0 / 0 | 0 / 0 | untestable — both absent |
| 종료 | 마지막 | 0 / 4.8 | 39.5 / 22.6 | **holds** |
| 이용 | 사용 | 5.6 / 13.1 | 0 / 5.9 | 🔴 reversed on the everyday side |
| 반환 | 반납 | 0 / 26.2 | 0 / 0 | untestable — everyday word absent from both |
| 문의 | 질문 | 0 / 0 | 5.6 / 2.4 | untestable — formal word absent from both |
| 안내문 | 알림글 | 0 / 0 | 0 / 0 | untestable — both absent |
| 확인 | 점검 | 5.6 / 9.5 | 0 / 7.1 | 🔴 reversed on the everyday side |
| 개시 | 시작 | 0 / 1.2 | 0 / 15.5 | ⚠ thin — formal word too rare in both corpora |
| 실시 | 시행 | 0 / 2.4 | 0 / 5.9 | ⚠ thin — formal word too rare in both corpora |
| 신청 | 접수 | 11.3 / 10.7 | 11.3 / 5.9 | ⚠ partial — everyday word is plainer, formal word is no formality marker |
| 증빙 | 증거 | 0 / 0 | 0 / 4.8 | untestable — formal word absent from both |
| 서류 | 문서 | 0 / 3.6 | 0 / 3.6 | 🔴 labeled reversed; both members are absent from the plain corpus |
| 자 | 사람 | 11.3 / 17.8 | 50.8 / 27.3 | **holds** |
| 및 | 그리고 | 118.4 / 110.6 | 95.9 / 40.4 | ⚠ partial — everyday word is plainer, formal word is no formality marker |
| 등 | 같은 | 355.3 / 409.0 | 118.4 / 124.8 | flat — no register signal |

**Two rows hold, three run backwards, five are untestable, two thin, two partial, one flat.** The
five untestable rows carry the same cause as the thin ones: the word table targets **administrative
Korean**, and neither a children's newspaper nor a general daily contains that register — the
measurement says so of 문의 and 증빙 in as many words ("it belongs to a register these corpora do not
contain"). **The corpora cannot speak to the axis §8b's table is about.**

🔑 **The Official-tier rows are untouched by this measurement.** A national language institute that
explicitly recommends a substitution is stronger evidence than a 17,731-token corpus of one
children's newspaper. Where the two disagree, the norm wins and the disagreement is recorded (§8d);
no sourced row is demoted because the corpus is silent or points elsewhere.

⚠ **Artifacts — do NOT read these as language findings.** `슬퍼요` / `화나요` (297.2 each in B) are
**emotion reaction buttons** under the articles — interface furniture, not text — and they must not
be counted for or against anything said about 해요체 in §8e. `donga` is a brand string; `정준양`,
`어린이`, `그림`, `일까지` and `펴냄ㆍ값` are proper names or rubric labels of the children's paper
(the last from its book-tip lines).

### 8d. 🔴 The do-NOT-simplify list

**What this list can and cannot do for Korean.** It reports **only what the noun probe supports**,
with numbers. It **does not** touch the verb and adjective rows, because those were never counted.
And it carries one cross-language caution as a reason to verify — never as a Korean result.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~read the verb and adjective rows of §8b as measured, in either direction~~ | 🔴 They are **UNMEASURED, not unsupported and not flat.** The tool counts word forms and Korean inflects the stem (`상이하다` → `상이한` / `상이합니다` / `상이하고`), so no count ever reached them (§8c). Reporting them as "flat" would turn an absence of measurement into evidence. Their standing is whatever their **tier** says — Official, 사전, or ⚠ craft — unchanged by §8c |
| ~~demote **상이하다 → 다르다** or **~하는 자 → ~하는 사람** because the corpus is silent~~ | Both are **Official tier**, prescribed in NIKL's own report, and the institute outranks this corpus (§8c). The 상이 / 차이 probe returned **0 / 0 in both corpora** — untestable, which is not a refutation. The 자 / 사람 row is the **one row where the probe tested the guide's own pair, and it holds**: 자 **11.3 in the plain paper against 17.8 in the daily**, 사람 **50.8 against 27.3**. Both directions agree with the institute |
| ~~"fix" **이용** to **사용**~~ | The probe runs backwards on that swap: 사용 is **absent from the plain corpus and 5.9 /100k in the daily**, while 이용 itself is **5.6 in the plain paper against 13.1 in the daily**. So the Sino-Korean near-synonym 사용 is **not** the plain-register alternative. ⚠ This says nothing about §8b's actual row, 이용하다 → **쓰다**, which is a verb and unmeasured |
| ~~treat **확인** as a hard word to route around~~ | 확인 occurs in the plain paper (**5.6**) and is commoner in the daily (**9.5**) — a formal-ish direction — but the near-synonym 점검 is **absent from the plain corpus and 7.1 in the daily**, i.e. the swap target is the rarer word. §8b's own 증빙 서류 → **확인 서류** row leans on 확인 for exactly this reason. Again: the row's real replacement 알아보다 is a verb and unmeasured |
| ~~hunt **및** as a formality marker, or **등** at all~~ | 및 is **118.4 against 110.6** — a factor of 1.07, below the 1.25 threshold, so it is **no formality marker**. 그리고 *is* plainer (**95.9 against 40.4**), so rewriting 및 → 그리고 moves toward the plain register even though the word being replaced is not itself formal. 등 / 같은 is **flat in both members** (355.3 / 409.0 and 118.4 / 124.8) — **no register signal**; leave it alone |
| ~~assume the Sino-Korean member is automatically the harder one~~ | ⚠ **Cross-language finding, requiring local verification — not a fact about Korean.** Across the languages in this kit where a plain-against-standard count *was* run, one result recurs: **the learned or borrowed word is not reliably the harder one**, and a confident "simplification" repeatedly swapped a common word for a **rarer** one, making the text harder. **Rarity, not etymology, is what makes a word hard.** Korean's 한자어 / 우리말 axis is exactly the shape that caution targets |
| ~~apply a **사전**-tier or ⚠ craft Sino → native swap without local confirmation~~ | ⚠ Flagged, **not overturned.** The rows that perform a Sino → native swap on 사전 or craft evidence — 종료하다 → 끝내다, 이용하다 → 쓰다, 반환하다 → 돌려주다, 문의하다 → 물어보다, 안내문 → 알림글, 확인하다 → 알아보다, 신청하다 → 내다/넣다 — sit precisely where the cross-language caution bites, and **§8c could not test any of them**: the verb rows are unmeasured, and 안내문 / 알림글 came back **0 / 0 in both corpora**. Confirm each with a native reader before shipping it. **The two Official rows are not in this list and are not affected** |
| ~~treat **thin** or **untestable** as a verdict against a row~~ | They are findings about the **corpora**, not about the words. 문의 and 증빙 are **absent from both** corpora because they belong to an administrative register neither a children's newspaper nor a general daily contains (§8c). Nothing about the table follows from their absence |
| ~~read `슬퍼요` / `화나요` in the daily as counter-evidence on 해요체~~ | They are **emotion reaction buttons**, not text (§8c). Interface furniture never enters a register argument |
| ~~simplify by word length, or by swapping the technical term~~ | The general form of the trap, and the binding rule from §8a: **keep the term and explain it** — 기계 학습 stays 기계 학습, followed by "그건 …라는 뜻이에요" and an example. With the lexical axis untestable here, an explanation is safe where a replacement is a guess |

> **→ The rule that follows.** For Korean, **the measured leverage is structural, not lexical.**
> Split the clause chain and shorten the sentence — that is where §8c found a 1.53× contrast in
> sentence length and a 10–46× contrast in the connective suffixes. Change a **word** only on the
> strength of its **tier**: the two Official rows are prescribed by the institute and stand; the
> 사전 and ⚠ craft rows are hypotheses that this measurement could not test and a native reader
> still has to confirm.

### 8e. 🔑 The address and speech-level decision

> **Decision, recorded so that nobody "fixes" it: `ko-easy` holds the recorded 해요체 (§4), exactly
> as `ko` does. No drift into 합니다체 / 하십시오체 for "seriousness", none into plain 해라체 for
> "friendliness", and 당신 stays out of UI copy (§4).**

- ✅ full predicate in 해요체: **있어요**
- ❌ bare nominal ending: **있음**

**On what grounds the decision rests — and on what it does not.** The register choice was taken and
recorded in **§4** as a project decision under the kit's [human-gate](../human-gate.md) rule, on
NIKL's 온라인가나다 classification (해요체 = 비격식체, 하십시오체/합니다체 = 격식체) plus the
project's own judgment that 해요체 is the register a learner-facing platform wants. **That is where
the decision lives. §8c did not make it and does not override it.**

**What the corpus adds, and exactly how far it reaches.** `있어요` runs **191.8 per 100k in the
children's paper against 11.9 in the daily** — a 16× contrast, and the plainer corpus is the one
using it. **That is real support for the *form*: 해요체 behaves as a register marker in plainer
Korean prose.** ⚠ **It does not settle the *audience* question.** Corpus A is a **children's**
newspaper, and the French measurement in this kit established the trap directly: in that language
the familiar address form was absent from adult easy-read publishing and abundant in children's
news, i.e. **address tracks the reader's age, not the text's difficulty.** Whether 해요체 is the
right register for **adults with reading difficulties** — `ko-easy`'s actual audience — is a
question a children's newspaper cannot answer. The decision therefore stands on §4's recorded
grounds; the corpus corroborates the form and is silent on the audience.

⚠ And note the artifact trap in the other direction: `슬퍼요` / `화나요` occur at 297.2 per 100k in
the **standard** daily, which would look like 해요체 in a formal paper. They are **reaction
buttons**, not prose (§8c), and carry no register information at all.

### 8f. What `ko-easy` is built on, in order of leverage

1. **Split the clause chain, and shorten the sentence. This is the measured lever and it comes
   first.** The plain corpus runs **12.15 어절** per sentence against **18.58**, and the connective
   suffixes `-고` (**45.1 vs 472.0**) and `-며` (**5.6 vs 256.8**) show how the longer sentences are
   built. Where the source text hangs sub-clauses on `-고` / `-며`, **end the sentence and start a
   new one.** NIKL's own structural rules point the same way and are sourced (§8b): **do not stack
   nouns** — use `-하다` and let the predicate carry the sense — and **do not end on a `-음`/`-기`
   nominal**, which the report calls intimidating, not merely unclear. The kit's ~8–12-word target
   applies as the kit's figure, ⚠ remembering it is a **word** count while the measured figures are
   in **어절**.
2. **Then the institute's substitutions — the Official-tier rows only.** 상이하다 → 다르다 and
   ~하는 자 → ~하는 사람 are prescribed by NIKL and outrank this guide's judgment and this corpus
   alike. The 자 → 사람 row is additionally the one row the probe confirmed (§8d).
3. **Then craft, last and with a reader in the loop.** The **사전**-tier rows follow NIKL's own
   dictionary method, and the ⚠ craft rows are this guide's judgment. **§8c tested none of them**,
   and §8d flags every Sino → native swap among them as needing local confirmation. Apply them as
   hints, not rules.
4. **Never as a substitute for any of the above: keep the technical term and explain it** (§8b) —
   and hold the recorded **해요체** steadily (§8e).

**Base rules this overrides:** none. Korea supplies no quantified pendant (§8a), so `ko-easy`
inherits the kit's base simplified-language rules from
[accessibility-workflow](../accessibility-workflow.md) unchanged, with the base rule "use everyday
words" now **bounded by §8d** rather than by intuition.

### 8g. What is still open

1. **A morphological analyzer would make the verb and adjective rows testable.** They are the
   majority of §8b's table and none of them has ever been counted (§8c). Lemmatizing the corpora —
   or re-running the probe over stems rather than word forms — is the single change that would turn
   the largest unmeasured block in this section into evidence.
2. **NIKL's own difficulty test has never been run over the table.** The test is stated in §8b in
   the institute's own words — *is the word in the 한국어기초사전? does a 다듬은 말 entry exist for
   it?* — and this guide records that it **did not run it**: the learner-dictionary search interface
   did not answer automated queries this pass. Two free lookups per row would re-tier the whole
   table on the authority's own criterion, and would be worth more than another corpus.
3. **No same-publisher pair exists to be had.** Every one failed because the children's editions of
   the major newspapers **decline automated text collection** (§8c). That is a stated position, not
   an obstacle: a licensed or manually agreed route is the only route, and no later pass may work
   around it.
4. **The plain corpus is small.** 17,731 tokens, one occurrence ≈ 5.6 per 100k. Several probe rows
   rest on one or two raw tokens.
5. **Neither corpus contains the register the word table targets.** Both are journalism; the table is
   about administrative Korean. A public-administration corpus — the register NIKL's own guides
   address — is what would actually test §8b's axis.
6. **The 해요체 audience question is unresolved** (§8e): the corpus evidence for the form comes from
   a children's paper, and `ko-easy` serves adults.
7. **No comprehension evidence.** Everything in §8c is frequency. Whether any of these choices is
   *understood* better by the intended readers was not established, and no Korean comprehension
   study was located.
8. **The table as a whole still wants a native-speaker pass** (§8b): a dictionary gloss shows two
   words share a sense, not that the swap reads naturally in 해요체 copy.

Sources: <https://www.korean.go.kr/front/etcData/etcDataView.do?mn_id=&etc_seq=700&pageIndex=1>
(쉬운 공공언어 / 쉬운 공문서 쓰기 길잡이 — exists; **no numeric rule**) ·
<https://www.korean.go.kr/front/refine/refineList.do?mn_id=158> (NIKL **다듬은 말**, 18,323 entries —
the axis sentence quoted verbatim from the page) ·
<https://www.korean.go.kr/front/reportData/reportDataView.do?mn_id=45&report_seq=1122>
(국립국어원, 「행정문서 표현 개선 및 쉬운 공공언어 쓰기 지침 개발」, 연구책임자 정희창, 2021 — 425-page
PDF fetched and read this pass; the structural rules, the 상이하다 / 자(者) rows and the
difficulty test are quoted verbatim from it) ·
<https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%8B%A4%EC%8B%9C> (표준국어대사전
— every 사전-tier gloss above retrieved per headword and quoted verbatim) ·
**Corpus measurement (§8c–§8f)** — machine-run 2026-07-27 with `scripts/corpus-measure.mjs` in this
repository; corpus A <https://www.kidshankook.kr/> (소년한국일보, 99 documents, 17,731 어절 tokens),
corpus B <https://www.donga.com/> (동아일보, 250 documents, 84,112 어절 tokens). The frequencies,
sentence lengths, and verdicts in §8c–§8f are this guide's **own count**, reproducible from those
sources; they are **not** a Korean authority's figures and must never be cited as one ·
[accessibility-workflow](../accessibility-workflow.md) (inherited base rules & ~8–12-word target) ·
[human-gate](../human-gate.md) (the register decision recorded in §4 and restated in §8e)

---

## 9. Regional variation

**Which standard the project targets.** South Korea and North Korea share the language but differ in
**orthography, vocabulary, and foreign-word policy**. South Korean **표준어**, codified by NIKL, is
the **neutral choice for international products** unless the audience is specifically North Korean or
North-Korean diaspora. North Korea's **문화어** is more strongly purist, with different standard
vocabulary and spellings.

**두음법칙 (initial-sound rule) — the headline orthographic split.** South Korean standard applies the
**두음법칙**: certain word-initial ㄹ/ㄴ soften. North Korean spelling does **not**, keeping the
"hard" initial. Textbook contrast pairs:

| Meaning | South (표준어, with 두음법칙) | North (문화어, no 두음법칙) |
|---|---|---|
| history | **역사** | **력사** |
| woman | **여성** | **녀성** |
| labor | **노동** | **로동** |
| paradise | **낙원** | **락원** |

- ✅ South-standard build: **역사**, **여성**, **노동**.
- ❌ Mixing a North initial into a South build: **력사**, **녀성** (wrong-standard leak).

**Vocabulary divergence** shows up in modern/loan terms — e.g. North purist coinages like
**얼음보숭이** were once proposed for "ice cream," though NIKL materials note that everyday North
usage still favors **아이스크림/에스키모**. Neutral editorial writing picks the **South Korean
standard form** for general UI, help text, and documentation.

**Neutrality strategy (explicit).**

1. **Orthography:** follow **NIKL 한글 맞춤법 / 표준어** — including the **두음법칙** — for all general
   language.
2. **Register:** the recorded **해요체** (§4) throughout.
3. **Vocabulary:** prefer unmarked South-standard terms; avoid North-marked or region-marked forms
   unless the content deliberately signals a North Korean identity.
4. **Technical terms:** use the §6 terms; keep shared English acronyms (AI, ML, CPU).
5. **Currency:** South Korean **₩ (KRW)** by default (§5); North Korean KPW only for an explicitly
   North-Korean deployment.

The two standards are largely mutually intelligible; a single **South-standard neutral build** serves
international audiences.

Sources: <https://www.korean.go.kr/front_eng/main.do> (한글 맞춤법 — 두음법칙, 제10–12항; the
authoritative anchor for the pairs above) ·
<https://www.korean.go.kr/nkview/nklife/2015_4/25_0405.pdf> (NIKL North-Korean-language review —
두음법칙 & 얼음보숭이 example; **⚠ the PDF could not be text-verified by the fetcher**, so the rule is
anchored to 한글 맞춤법 above) · (Round-1's general-reference regional survey
`asiasociety.org/education/korean-language` is **not** relied on for the specific pairs)

---

