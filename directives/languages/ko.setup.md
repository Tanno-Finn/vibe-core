<!-- base -->
# lang-ko — Korean (한국어 / 조선말) — setup & sources

> **The translation guide itself is [`ko.md`](ko.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **국립국어원 — National Institute of Korean Language (NIKL)** — the South Korean government
  institute for the standard language. It **develops, maintains, and publishes** the four core
  norms — **한글 맞춤법** (Hangul Orthography), **표준어 규정** (Standard Language Rules),
  **외래어 표기법** (Loanword Transcription), and **국어의 로마자 표기법** (Revised Romanization
  of Korean) — plus the **문장 부호 해설** (Punctuation Guide) and the **온라인가나다** public Q&A
  service. **Attribution note:** these 어문규범 are **promulgated as ministerial notifications
  (고시) by the 문화체육관광부 / Ministry of Culture, Sports and Tourism** — RR as 고시 제2014-42호
  (superseding 문화관광부 고시 제2000-8호); the 문장 부호 revision rides on the 2014 한글 맞춤법
  amendment. So NIKL is the **developing/maintaining and publishing** body, the ministry is the
  **issuing** body — cite them in those roles, not interchangeably (§3). **⚠** the 고시 numbers come
  from a secondary reference; NIKL's norms subdomain `kornorms.korean.go.kr` was **DNS-unreachable
  (ENOTFOUND)** this session.
  <https://www.korean.go.kr/front_eng/main.do> ·
  <https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431> (문장 부호 해설) ·
  <https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=319561> (해요체 =
  비격식체)
- **The Unicode Standard 16.0.0 — Chapter 18 (East Asia), Hangul.** Encoding model, jamo,
  syllable composition, and the block ranges: Hangul Jamo **U+1100–U+11FF**, Hangul Compatibility
  Jamo **U+3130–U+318F**, Hangul Syllables **U+AC00–U+D7AF**.
  <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/>
- **Unicode CLDR — `ko` locale** (default numbering system `latn`; number, date, time formats).
  Drive concrete formats from current CLDR `ko` data, not from values quoted here. Cite the
  **version-agnostic permalink**, which Unicode maintains for exactly this purpose, so the guide does
  not go stale on each release:
  <https://www.unicode.org/cldr/charts/latest/summary/ko.html>
  — re-fetched this session, where it resolved to the **CLDR 48** charts and the page header reads
  **"CLDR Version 48.2"**, confirming `Numbering System default = latn` for `ko`. Current release
  train per Unicode's own downloads table: **CLDR 48 (2025-10-29) → 48.1 (2026-01-08) → 48.2
  (2026-03-17)**, with a JSON-only patch **48.2.1 (2026-07-08)**; summary charts are published for
  48, so `charts/latest/` is the stable thing to cite.
  <https://cldr.unicode.org/index/downloads> (release/date table)
- **TTA — 정보통신용어사전 (Telecommunications Technology Association ICT terminology
  dictionary)** — the authority this guide uses for *verifiable* technical terminology.
  Confirmed entries: **기계 학습** (machine learning, spaced) and **심층 기계 학습** (deep learning,
  synonym 딥러닝).
  <http://terms.tta.or.kr/dictionary/dictionaryView.do?word_seq=048323-10> ·
  <http://terms.tta.or.kr/dictionary/dictionaryView.do?subject=%EC%8B%AC%EC%B8%B5+%EA%B8%B0%EA%B3%84+%ED%95%99%EC%8A%B5>
- **Noto Sans KR / Nanum family** — widely used open web fonts with full modern-syllable coverage.
  <https://fonts.google.com/noto/specimen/Noto+Sans+KR>

**Provenance caveat.** The Round-1 research leaned on a **general-reference education page**
(`asiasociety.org/education/korean-language`) for several grammar and regional claims; that is a
survey source, not an academy, so those claims are kept only where independently plausible and are
re-anchored to NIKL where possible. One Round-2 TTA citation is **misattributed** (the 인공지능 URL
resolves to 기계독해 — see the header CITE-VERIFY note and §6). The North–South differences PDF is a
genuine NIKL publication but could not be text-verified by the fetcher (⚠), so §9 anchors the
두음법칙 rule to NIKL 한글 맞춤법 instead. Everything the research itself labeled *unsourced* is
carried below as **⚠ unverified**.

Sources: <https://www.korean.go.kr/front_eng/main.do> ·
<https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431> (문장 부호 해설) ·
<https://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=73&qna_seq=319561> ·
<https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/> ·
<https://www.unicode.org/cldr/charts/latest/summary/ko.html> ·
<https://cldr.unicode.org/index/downloads> ·
<http://terms.tta.or.kr/dictionary/dictionaryView.do?word_seq=048323-10> ·
<http://terms.tta.or.kr/dictionary/dictionaryView.do?subject=%EC%8B%AC%EC%B8%B5+%EA%B8%B0%EA%B3%84+%ED%95%99%EC%8A%B5> ·
<https://fonts.google.com/noto/specimen/Noto+Sans+KR>
(the 고시 numbers are secondary-sourced and `kornorms.korean.go.kr` was DNS-unreachable this
session; one TTA citation is **misattributed** — both flagged in the caveat above)

---

## 3. Script & typography

**Character inventory & Unicode model.** Korean is written in **Hangul (한글)**, a featural
alphabet of **자모 (jamo)** — consonant letters (자음) and vowel letters (모음) — that are **composed
into square syllable blocks**, each block an initial (초성) + medial (중성) + optional final (종성).
The Unicode model gives Korean **three** relevant blocks:

- **Hangul Syllables — U+AC00–U+D7AF** (block range): the **11,172 precomposed modern syllables**
  are assigned **U+AC00 (가) through U+D7A3 (힣)**; the remainder of the block (U+D7A4–U+D7AF) is
  unassigned. This is where the overwhelming majority of modern Korean text lives.
- **Hangul Jamo — U+1100–U+11FF**: the conjoining jamo used to *compose* syllables algorithmically
  (initial/medial/final forms).
- **Hangul Compatibility Jamo — U+3130–U+318F**: standalone jamo (e.g. ㄱ, ㅏ) used when a letter is
  cited *in isolation* — for a keyboard cap, a bullet, or "the letter ㅎ", **not** for composing
  running text.

Optional **Hanja (한자)** are ordinary **CJK Unified Ideographs (U+4E00–U+9FFF …)** and appear only
in limited disambiguation, academic, legal, and personal-name contexts.

**The top rendering/data risk — NFC vs NFD normalization (Korean's equivalent of the Bengali
zero-width trap).** A single visible syllable can be stored two ways: **precomposed** as one code
point in the Hangul Syllables block (**NFC**), or **decomposed** into its conjoining jamo from
U+1100–U+11FF (**NFD**). Both render identically when the font and engine are correct — but they
are **different byte sequences**. macOS filesystems and some input paths emit **NFD**; Windows and
most web content use **NFC**. A pipeline that mixes them will silently break exact-match search,
`===` string comparison, de-duplication, and length counts, and a naive "sanitizer" can mangle a
syllable into loose jamo.

- ✅ Right (NFC, precomposed): **한** = single code point **U+D55C**.
- ❌ Wrong (NFD leaked into an NFC pipeline): **한** stored as **U+1112 U+1161 U+11AB** (ㅎ+ㅏ+ㄴ) —
  looks identical, compares unequal, and breaks search/highlighting.

**Rule: normalize all Korean text to NFC at ingest and before any comparison, indexing, or
display** (see §10, §11).

**Direction & tokenization.** Korean is **LTR** (`Hang`/`Kore` script, standard LTR). Modern text is
**horizontal** and **whitespace-separated (띄어쓰기)**, so ordinary whitespace tokenization and
word-boundary highlighting work. No RTL/bidi handling is required. **But spacing is
grammar-sensitive** (see §4): 조사 (particles) attach with **no** space to their host noun, while
some dependent nouns (수, 것, 때) **take** a space — so a highlighter must respect Korean spacing,
not re-segment by English rules.

**Line breaking.** Korean does **not** use Latin-style hyphenation; the layout engine may break
between syllable blocks (and after particles) per script-aware rules. Ship a **Hangul-capable
line-break algorithm**; do **not** insert soft hyphens into Korean words.

**Punctuation & quotation (NIKL 문장 부호 해설).** For horizontal digital text the standard quotation
marks are **큰따옴표 “ ”** (U+201C/U+201D, for direct speech / quotations) and **작은따옴표 ‘ ’** (U+2018/U+2019,
for emphasis or a quote-within-a-quote). The traditional **낫표** marks remain standard for
**titles and names**: **겹낫표 『 』** (and the equivalent **겹화살괄호 《 》**, U+300A/U+300B) for
book/newspaper/whole-work titles; **홑낫표 「 」** (and **홑화살괄호 〈 〉**, U+3008/U+3009) for
subsections, artworks, laws, regulations, business names. Choose one system per house style and
hold it. (Glyph note: the NIKL guide's *web landing page* renders these loosely as `≪ ≫` and ASCII
`< >` in its table of contents; in digital body copy use the CJK punctuation code points above, not
the math operators ≪/≫ or ASCII angle brackets — the same no-ASCII-stand-in rule as for quotes.)

- ✅ Right: 직접 인용은 **“…”**, 책 제목은 **『…』**, 소제목·법령은 **「…」**.
- ❌ Wrong: bare ASCII `"..."` straight quotes standing in for 큰따옴표 in body copy, or using
  큰따옴표 where a title needs 겹낫표/겹화살괄호.

**Romanization in native-script text.** The official system is the **Revised Romanization of
Korean** (RR, 국어의 로마자 표기법). It is **issued by the 문화체육관광부 (Ministry of Culture,
Sports and Tourism)** as a ministerial notification — 고시 제2014-42호, superseding the original
문화관광부 고시 제2000-8호 — while **NIKL (국립국어원) developed the system and maintains it**,
publishing the rule text, the reference tables, and the public guidance. Do not credit NIKL as the
*issuing* authority; it is the developing/maintaining body. (**⚠ the 고시 numbers are corroborated
from a secondary reference, not a government page**: NIKL's 어문규범 subdomain `kornorms.korean.go.kr`
was **DNS-unreachable (ENOTFOUND) this session**, and the NIKL English RR page carries the rules
without naming an issuing body. The *ministry-vs-institute* split is the load-bearing correction; the
exact notification numbers should be re-confirmed against a government source when reachable.)
Romanization is **for identifiers, place/person names on
signage, and learner support — never a display substitute for Hangul in the UI.** Established Latin
acronyms (AI, ML, GPU, API, URL) are commonly left in Latin script inside Korean running text; that
is the *only* Latin allowed in body copy.

- ✅ Body copy in Hangul, acronyms in Latin: **AI 모델을 학습해요.**
- ❌ Romanized Korean standing in for Hangul: **AI model-eul haksup-haeyo.**

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/> ·
<https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431> (문장 부호 해설) ·
<https://www.korean.go.kr/front_eng/roman/roman_01.do> (Revised Romanization rules — re-fetched;
note this page carries the rule tables but **does not name an issuing body**) ·
<https://fonts.google.com/noto/specimen/Noto+Sans+KR>
(NFC/NFD guidance is standard Unicode normalization practice; the syllable-composition model is
from Unicode 16 ch.18 above. **RR issuing body = 문화체육관광부**, NIKL = developing/maintaining body,
§2 — the **고시 numbers are ⚠ secondary-sourced**, since `kornorms.korean.go.kr` was DNS-unreachable
this session)

---

## 10. Technical integration checklist

- **Normalize to NFC (load-bearing).** Normalize **all** Korean text to **NFC at ingest** and before
  any comparison, indexing, de-duplication, search, or display. Sources that emit **NFD** (some macOS
  paths, some input methods) will otherwise store the same syllable as loose jamo (U+1100–U+11FF) that
  compares unequal to the precomposed form (§3). A "sanitizer" that reorders or strips jamo will
  corrupt syllables.
- **Fonts to ship:** a font with full **modern-syllable** coverage — **Noto Sans KR** (or Nanum) is
  the safe default; if Hanja may appear, ship a face with **CJK Unified Ideograph** coverage too.
- **`lang` / `dir` attributes:** `lang="ko"` (base) and `lang="ko-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**. No bidi/mirroring machinery is needed.
- **Tokenization / highlighting / spacing:** whitespace word separation applies, but respect Korean
  **띄어쓰기** — 조사 (particles) attach with **no** space; dependent nouns (수, 것, 때) take a space.
  A word-boundary highlighter tuned for English must not re-segment around particles. Do **not** insert
  hyphenation; let the layout engine break between syllable blocks.
- **Index alphabet for glossary navigation:** use **Hangul 가나다순 (ga-na-da order)** — the
  consonant-then-vowel jamo collation from **CLDR `ko` collation data** — **not** an A–Z Latin index.
  Drive the index from CLDR `ko` collation rather than a hand-listed sequence.
- **Numbers / dates / currency:** display per §5 — Western digits, `.` decimal / `,` triple grouping,
  numeral date **2026. 7. 24.**, **₩**/**원** currency. Keep Western digits and **ISO 8601** in
  backends and code; drive concrete number/date **patterns from live CLDR `ko` data**, not from values
  quoted here.
- **Punctuation:** 큰따옴표/작은따옴표 for quotes, 겹낫표『』/홑낫표「」 (or 화살괄호) for titles per §3
  house style — not bare ASCII straight quotes in body copy.

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/> (syllable model,
NFC/NFD) · <https://fonts.google.com/noto/specimen/Noto+Sans+KR> ·
<https://www.unicode.org/cldr/charts/latest/summary/ko.html> (CLDR `ko` — numbering, collation, patterns) ·
<https://www.korean.go.kr/front/etcData/etcDataView.do?etc_seq=431> (punctuation)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **NFC normalization check (highest priority):** all Korean text is **NFC** — flag any **conjoining
  jamo (U+1100–U+11FF)** left standing where a precomposed syllable (U+AC00–U+D7A3) is expected; a
  decomposed leak means an NFD source slipped past normalization (§3, §10).
- **Script ratio:** the large majority of characters in `ko` content fall in the **Hangul Syllables
  block (U+AC00–U+D7A3)**. A low Hangul ratio signals untranslated source text left in place.
- **Forbidden / suspicious characters:**
  - No **Compatibility Jamo (U+3130–U+318F)** inside running text (allowed only when citing a letter
    in isolation, e.g. "ㅎ").
  - No **Japanese kana** (U+3040–U+30FF) or other wrong-script leaks; **Hanja (CJK ideographs)** are
    allowed only in the limited disambiguation/name contexts of §3.
  - No **Latin romanization standing in for a Korean word** in body text (Latin allowed only for
    established acronyms — AI, ML, GPU, API — and for slugs/identifiers).
- **Digit-system consistency:** within a single number/field, digits are **all Western (0–9)** (the
  `ko` default), never mixed with number-word series inside one figure; grouping is **triples with
  `,`**, decimal is `.` — no 4-digit myriad comma groups in digit display (§5).
- **Date format:** numeral dates use **`YYYY. M. D.`** with the trailing period (2026. 7. 24.), not
  slashes; ISO 8601 confined to backends.
- **Register consistency:** the recorded **해요체** (§4) holds across sentence-final endings — scan
  for stray **합니다체 (…-ㅂ니다/-십시오)** or plain **해라체 (…-다/…-어)** endings in user-facing copy.
- **Honorific / address consistency:** flag **당신** used as a generic "you" (§4), a missing
  **-(으)시-** on a predicate whose subject is honored, and **사물 존대** (honorific applied to an
  inanimate subject).
- **Wrong-standard leak (South build):** flag **North 두음법칙** initials (력사, 녀성, 로동, 락원) and
  other 문화어-marked vocabulary in a South-standard build (§9).
- **Source-language leak scan (EN/DE → KO):** left-in English function words (the, and, you, please),
  German umlauts / ß, or verb-mid SVO word order surfacing in Korean sentences.

Sources: <https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-18/> ·
<https://www.unicode.org/cldr/charts/latest/summary/ko.html> ·
<https://www.korean.go.kr/front_eng/main.do>

---

*Provenance note:* this guide is built solely from an **external desk-research pass** (Round-1
standard + a targeted Round-2 follow-up on the thin sections). Load-bearing NIKL / Unicode / TTA /
CLDR anchors were **independently re-fetched during the transform** and are recorded in the header
CITE-VERIFY note; one TTA anchor (인공지능) was found **misattributed** and is downgraded at point of
use, and the North-Korean-language PDF could not be text-verified (rule re-anchored to 한글 맞춤법).
Round-1's general-reference grammar/regional survey source was not relied on for the example pairs.
All **⚠ unverified** markers indicate claims the research itself could not source, or that could not
be confirmed from the primary authorities in §2. The §7 idiom table is **analyst-generated,
gap-flagged**. A native-speaker review against the §2 sources is still outstanding (see Status in the
header).
