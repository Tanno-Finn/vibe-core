<!-- base -->
# lang-bn — Bengali (বাংলা) — language guide

> **Setup & sources live in [`bn.setup.md`](bn.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** বাংলা / Bengali (Bangla).
**BCP 47 code (base):** `bn`.
**BCP 47 code (simplified variant):** `bn-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed against the kit's language services, which use
`<code>-easy` throughout; a strict BCP 47 rendering would be a private-use subtag like
`bn-x-simple`, but the kit token is the convention that counts).
**Speaker reach:** ~**242 million** first-language speakers and ~**250 million** total speakers
(⚠ approximate — Wikipedia-tier summary figures, not a census or Ethnologue count; exact numbers
vary by source and year). National and official language of Bangladesh; official language in the
Indian states of West Bengal and Tripura and in the Barak Valley (Assam).
**Script + direction:** Bengali script (Bangla / *Bengali–Assamese*), an abugida of the
Brahmic family; **left-to-right**.
**Status:** planned — authored from external desk research, covering base `bn` and the
`bn-easy` pendant. Reviewed 2026-07-23 by a fresh model against the cited sources (fidelity
spot-check incl. byte-level script verification); **not yet reviewed by a native speaker** —
per the authoring directive's "second set of eyes" rule, this header records that gap
honestly. A later pass took the **§3 nested-quotation rule** to an authority hunt and to an
18-article usage census, and **found a contradiction**: attested Bengali press practice inverts the
CLDR levels. Both readings are now on the record there, unresolved. This guide is the pilot that
defines the per-language pattern.
**Easy or hard for this kit:** whitespace word separation *works* in Bengali's favor —
standard tokenization applies. The hard parts: conjunct shaping via the virama (হসন্ত) with
ZWJ/ZWNJ control, which needs a fully Indic-capable font and layout engine; native digits
(০–৯) under a lakh/crore grouping system; and a three-tier politeness system that forces a
register decision before any UI copy is written.

Sources: <https://en.wikipedia.org/wiki/Bengali_language> ·
<https://en.wikipedia.org/wiki/Bengali_alphabet>

---

## 1. Header block

See above. One-line orientation: Bengali is an Indo-Aryan, SOV, LTR abugida with a shared
written standard (চলিত ভাষা / *Chôlitôbhāṣā*) across Bangladesh and West Bengal; the
localization risks concentrate in conjunct rendering, native-digit/number-grouping, and
register.

---

## 4. Grammar for translators

**Word order.** Bengali is **SOV** (Subject–Object–Verb): the verb comes last. FSI teaches this
as the core pattern.

- ✅ **আমি বাংলা শিখছি** (Ami Bangla shikchhi) — "I am learning Bengali" (lit. *I Bengali
  learning-am*).
- ✅ **আমি স্কুলে যাচ্ছি** (Ami skul-e jacchhi) — "I am going to school" (lit. *I school-in
  going-am*); Bengali uses **postpositions**, not prepositions.
- ❌ **আমি যাচ্ছি স্কুলে** — verb kept mid-clause: understood, but marked/unidiomatic. UI text
  respects verb-final order.

**Register / politeness — and the project's choice.** Bengali has a **three-tier second-person
system**, each tier with its *own* verb endings; mismatching pronoun tier and verb conjugation
is socially marked and treated as ungrammatical:

| Pronoun | Tier | Used with |
|---|---|---|
| তুই (tui) | intimate / low | close friends, small children, in anger — rude if misused |
| তুমি (tumi) | familiar | peers, friends, spouses, younger people |
| আপনি (apni) | respectful / honorific | elders, strangers, teachers, officials, service, formal contexts |

Worked contrast ("Are you going home?"):

- তুই বাড়ি যাচ্ছিস? (intimate) · তুমি বাড়ি যাচ্ছ? (familiar) · আপনি বাড়ি যাচ্ছেন? (respectful).

**What the research supports:** for platforms addressing learners, parents, and teachers,
**আপনি (apni)** plus its polite verb endings (-en / -un) is the conventional, safest, and
cross-regionally respectful default (formal address with apni is especially common in
Bangladeshi educational/service contexts; West Bengal is somewhat more relaxed but still reads
apni as respectful).

> **Register decision (human-gate): আপনি (apni) — taken, recorded 2026-07-23, and in force.**
> Under the kit's [human-gate](../human-gate.md) rule the register is a decision the guide
> **records rather than invents**; this block is that record, and the evidence it rests on is the
> paragraph above — unambiguous here: the respectful tier with its polite verb endings (-en / -un)
> is the conventional register for educational platforms in both regions and the only tier that
> cannot read as condescending. The decision is **not pending anything**: it is settled for this
> platform and **binding for all second-person copy** in `bn` and `bn-easy` — no drift to
> তুমি/তুই, including in informal or playful passages. What it is *not* is an academy ruling; no
> Bangla Academy or Paschimbanga Akademi source prescribes a register for educational UI, and this
> record must not be cited as if one did.

The four to five grammar features that break naive EN/DE → BN translation:

**(1) SOV + postpositions** (see above). Prepositional/verb-mid calques read as foreign.

**(2) Politeness-marked pronouns *and* verbs must agree.** German du/Sie and English's
register-flat "you" do not carry over; the wrong tier in a formal UI is a social error.

- ✅ Formal help text: **আপনি এখানে ক্লিক করুন** (Apni ekhane klik korun) — "Please click here."
- ❌ Casual in a formal UI: **তুমি এখানে ক্লিক করো** (Tumi ekhane klik koro).

**(3) Third-person pronouns are not gendered.** Bengali distinguishes **distance/politeness,
not gender**: সে (se, familiar "he/she"), তিনি / উনি (tini / uni, respectful). Do **not**
import an English "he/she" gender split unless the context genuinely names a specific male or
female referent — otherwise use the neutral/honorific form.

- ❌ Inventing gender where the source is generic.
- ✅ **তিনি** for a respected, unspecified third person; **সে** for a familiar one.

**(4) Aspect / progressive is morphological.** English/German "be + verb-ing / am Lernen" maps
to Bengali progressive endings **…ছি / …ছেন**, not an auxiliary + participle calque.

- ✅ **আমি শিখছি** (I am learning) · **আপনি আসছেন** (you [formal] are coming).
- ❌ Calques like **আমি হয় শিখছি** or the colloquial/dialectal **আমি শিখতেছি** — not standard
  written Bengali.

**(5) Negation is pattern- and tense-specific.** Bengali places না / নয় / নেই relative to
tense and aspect; do not copy English word order.

- ✅ **করি না** — "do not do" (present negative). ✅ **করিনি** — "did not do" (perfective
  negative). These are distinct patterns, not interchangeable.

Sources: <https://www.fsi-language-courses.org/fsi-bengali-course/6-making-requests-and-offers/> ·
<https://cgdf.gov.bd/pages/static-pages/6922ddc7933eb65569e1636d> ·
<https://scispace.com/pdf/bengali-language-handbook-3on7brdyao.pdf> ·
<https://en.wikipedia.org/wiki/Bengali_grammar>

---

## 5. Numbers, dates, currency

**Digit system.** Bengali has native digits **০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯** (U+09E6–U+09EF). The CLDR
`bn` locale **defaults to Bengali digits** for plain and compact number formats. On the web both
Bengali and Western (0–9) digits appear; Bangladeshi general/educational content commonly uses
Bengali digits, while technical fields (e.g. programming exercises) may use Western digits where
appropriate. **Rule: pick one system per context and never mix systems inside a single number**
(see §11).

**Grouping — South Asian lakh/crore, not thousands.** Bengali groups by the lakh/crore system,
**not** by triples:

- ১,০০০ — one thousand (হাজার)
- ১,০০,০০০ — one **lakh** (লক্ষ / লাখ)
- ১,০০,০০,০০০ — one **crore** (কোটি)
- Full example: **১,২৩,৪৫,৬৭৮** (grouping `1,23,45,678`, *not* `12,345,678`).

Localized numeric output must use lakh/crore grouping and the textual units হাজার / লক্ষ /
কোটি, not million/billion, unless the source explicitly demands international formatting.

**Decimal separator.** CLDR `bn` uses **period `.` as the decimal separator** and **comma as
the group separator** — e.g. **১,২৩৪.৫৬** — aligning with English, *not* the European
comma-decimal. No evidence of comma-as-decimal in standard `bn` locale data.

**Dates & times (CLDR `bn`, Gregorian).**

| Format | Pattern | Example |
|---|---|---|
| Full | `EEEE, d MMMM, y` | বৃহস্পতিবার, ২৩ জুলাই, ২০২৬ |
| Long | `d MMMM, y` | ২৩ জুলাই, ২০২৬ |
| Medium | `d MMM, y` | ২৩ জুলাই, ২০২৬ |
| Short | `d/M/yy` | ২৩/৭/২৬ |
| Time (full) | `h:mm:ss a zzzz` | 12-hour clock with am/pm |

Bangladesh government portals use the Bangla full format (weekday, day, month, year) for public
pages; forms may use numeric `dd/mm/yyyy` with Bengali digits. **ISO 8601 (YYYY-MM-DD)** is a
backend/technical convention, not the end-user default for Bangla content.

**Currency.** The Bangladeshi taka sign **৳ (U+09F3 BENGALI RUPEE SIGN, alias "Bangladeshi
taka"; ISO 4217 BDT)**. Placement is variable — **৳১০০** (before) or **১০০৳** (after) both have
wide use; mixed English–Bangla contexts also write "Tk 100". For **Indian rupee** use the Latin
**₹** or the textual **রুপি / রুপী** — relying on ৳ for rupee is historically attested but now
ambiguous and discouraged. Other Bengali-block currency characters (U+09F2 rupee mark, numerator
signs U+09F4–U+09F9) are rarely used on the modern web. → Currency is deployment-specific; see
§9 (parameterize ৳ vs ₹).

Sources: <https://en.wikipedia.org/wiki/Bengali_numerals> ·
<https://en.wikipedia.org/wiki/Bengali_(Unicode_block)> ·
<https://www.unicode.org/cldr/charts/latest/summary/bn.html> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/bn.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (digit default, grouping, separators, and the date
table above re-checked against **CLDR 48.2**, 2026-03-17 — unchanged from the earlier reading) ·
<https://codepoints.net/U+09F3?lang=en> ·
<https://www.iso.org/fr/iso-8601-date-and-time-format.html>

---

## 6. Terminology strategy

**Transliteration.** For systematic Latin transliteration (slugs, identifiers, search indexes),
**ISO 15919:2001** is the most detailed, internationally recognized scheme (full Bengali vowel/
consonant/ligature tables, diacritic and ASCII variants). No single scheme dominates all domains
(ISO 15919, UNGEGN, National Library at Kolkata, Bangla Academy all differ). User-facing text
should never display raw transliteration; simplified phonetic Latin spellings sometimes used in
practice are ⚠ unverified (no standard behind them).

**Loanword policy.** Modern Bengali technical vocabulary mixes native/Sanskrit-derived terms
(তৎসম / তদ্ভব) with adapted international loanwords. Bangla Academy spelling rules describe how
foreign (esp. English) words are written to Bengali phonology — e.g. **অ্যা** for certain
English vowels: **অ্যাকাউন্ট** (account), **অ্যাসিড** (acid), **ক্যাসেট** (cassette), **ব্যাংক**
(bank), **ভ্যাট** (VAT). Official/government registers prefer native or Sanskrit-based coinages
and calques (e.g. *Rule of law* → **আইনের শাসন**); tech/AI communities more often keep the
English label transliterated into Bengali script and explain the concept in Bangla. **Working
rule: prefer the established sector term over a novel native coinage; keep well-known English
acronyms (AI, ML, NLP) in Latin.**

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give target term + original + a short plain gloss,
then use the target term alone afterwards. Instantiated in Bengali:

> **নিউরাল নেটওয়ার্ক** (neural network) — এমন একটি গণনামূলক মডেল যা মানব-মস্তিষ্কের নিউরনের
> অনুকরণে স্তরে স্তরে সাজানো। *("… a computational model arranged in layers, imitating the
> neurons of the human brain.")*

After first mention: **নিউরাল নেটওয়ার্ক** alone. Project coinages (C1) keep their original
spelling in Bengali text and are owned by the term-sheet, not this table.

**Seed field vocabulary (AI/ML).** These are field-standard terms **as used in Bengali sector
glossaries and educational content — not a Bangla Academy decree** (no formal academy-issued
AI/ML terminology list was found; **⚠ unverified in the strict institutional sense**). Use them,
but treat them as *field usage*, not canon:

| Concept (EN) | Bengali term | Notes | Provenance |
|---|---|---|---|
| Artificial Intelligence (AI) | কৃত্রিম বুদ্ধিমত্তা | Standard in media/education; keep "AI" in parens if useful | ⚠ field usage / sector glossaries — no academy source |
| Machine Learning (ML) | মেশিন লার্নিং | Loanword in Bengali script; widely used | ⚠ field usage / sector glossaries — no academy source |
| Deep Learning | ডিপ লার্নিং | Direct loan | ⚠ field usage / sector glossaries — no academy source |
| Neural Network | নিউরাল নেটওয়ার্ক | Standard rendering | ⚠ field usage / sector glossaries — no academy source |
| Natural Language Processing (NLP) | প্রাকৃতিক ভাষা প্রক্রিয়াকরণ | Used in Bengali ML/DL resources | ⚠ field usage / sector glossaries — no academy source |
| Data Science | ডাটা সায়েন্স / তথ্যবিজ্ঞান | Loan common in course titles; তথ্যবিজ্ঞান more formal | ⚠ field usage / sector glossaries — no academy source |
| Supervised Learning | Supervised লার্নিং / তত্ত্বাবধানে শেখা | Mixed; often keeps English label + Bangla explanation | ⚠ field usage / sector glossaries — no academy source |
| Unsupervised Learning | Unsupervised লার্নিং | Largely English label + explanation (native forms rare) | ⚠ field usage / sector glossaries — no academy source |
| Reinforcement Learning | রিইনফোর্সমেন্ট লার্নিং | Script loan; used in CSE content | ⚠ field usage / sector glossaries — no academy source |
| Algorithm | অ্যালগরিদম | Well-established scientific loanword | ⚠ field usage / sector glossaries — no academy source |
| Model (ML) | মডেল | General loanword | ⚠ field usage / sector glossaries — no academy source |
| Training Data | প্রশিক্ষণ ডেটা | Native + loanword mix | ⚠ field usage / sector glossaries — no academy source |
| Classification | শ্রেণিবিন্যাস / ক্লাসিফিকেশন | শ্রেণিবিন্যাস is the native-style form | ⚠ field usage / sector glossaries — no academy source |
| Regression | রিগ্রেশন | Loanword, sometimes glossed | ⚠ field usage / sector glossaries — no academy source |
| Feature | বৈশিষ্ট্য | Native word, used across the sciences | ⚠ field usage / sector glossaries — no academy source |
| Loss Function | লস ফাংশন | Loanword combination | ⚠ field usage / sector glossaries — no academy source |

Recommended default set for the platform: **কৃত্রিম বুদ্ধিমত্তা, মেশিন লার্নিং, ডিপ লার্নিং,
নিউরাল নেটওয়ার্ক, প্রাকৃতিক ভাষা প্রক্রিয়াকরণ, ডাটা সায়েন্স**, with English abbreviations in
parentheses on first use.

Sources: <https://cdn.standards.iteh.ai/samples/28333/a0a778b7b2034a91aab1e97b3a34d125/ISO-15919-2001.pdf> ·
<https://en.wikipedia.org/wiki/Bangla_Academy> ·
<https://app.shabdakosh.org/standard-spelling-rules-by-bangla-academy/> ·
<https://github.com/il6/Awesome-Bangla-AI> ·
<https://www.academia.edu/114350602/> (community glossary — weak provenance)

---

## 7. Idiom anti-patterns

**Stock-phrase idioms (EN → BN): idiomatic form ✅ vs literal calque ❌.** These are the common
English educational/technical stock phrases whose word-for-word transfer into Bengali reads as
foreign. Use the idiomatic column; the calque column is what a naive translation produces and
must be avoided.

| English phrase | Idiomatic Bengali ✅ | Literal calque to avoid ❌ | Provenance |
|---|---|---|---|
| step by step | ধাপে ধাপে | পদে পদে (means "at every step / repeatedly", not sequential) | translator craft, unsourced |
| under the hood | ভিতরে কীভাবে কাজ করে | হুডের নিচে | translator craft, unsourced |
| at a glance | এক নজরে | এক চাহনিতে (awkward here) | translator craft, unsourced |
| keep in mind | মাথায় রাখুন | মনে রাখুন (understood, but less idiomatic in technical prose) | translator craft, unsourced |
| by default | ডিফল্টভাবে / স্বাভাবিকভাবে | ডিফল্ট দ্বারা | translator craft, unsourced |
| out of the box | শুরু থেকেই ব্যবহারযোগ্য / প্রস্তুত অবস্থায় | বাক্সের বাইরে | translator craft, unsourced |
| from scratch | একেবারে শুরু থেকে | খোলা ঘষা থেকে | translator craft, unsourced |
| in the long run | দীর্ঘমেয়াদে | দীর্ঘ দৌড়ে | translator craft, unsourced |
| at the end of the day | শেষ বিচারে / শেষ পর্যন্ত | দিনের শেষে (too English-like) | translator craft, unsourced |
| state of the art | অত্যাধুনিক | শিল্পের অবস্থা | translator craft, unsourced |
| break it down | ভেঙে বুঝিয়ে বলুন / অংশে ভাগ করুন | এটা ভেঙে দিন (too literal) | translator craft, unsourced |
| a piece of cake | খুব সহজ কাজ | কেকের টুকরো | translator craft, unsourced |

**⚠ Provenance — confirm with a native speaker.** These renderings are localization judgment
(one generic reference cited, several forms self-marked unsourced by the research), *not* an
academy-sourced idiom dictionary. Treat the idiomatic column as a strong working default that a
native-speaker pass should confirm; the forms are context-sensitive and may vary by audience and
register.

Beyond stock phrases, the research also gives the closely related class of **literal-transfer
anti-patterns at the grammatical level** (re-derived from §4) — keep these alongside the idiom
table:

- ❌ **Preposition/verb-mid calque:** *আমি যাচ্ছি স্কুলে* (English word order) → ✅ **আমি স্কুলে
  যাচ্ছি** (SOV, postposition).
- ❌ **Progressive auxiliary calque:** *আমি হয় শিখছি* / colloquial *আমি শিখতেছি* → ✅ **আমি
  শিখছি** (morphological progressive).
- ❌ **English "he/she" gender forced onto a generic referent** → ✅ neutral **সে** / honorific
  **তিনি**.
- ❌ **Familiar register carried into formal UI:** *তুমি … করো* → ✅ **আপনি … করুন**.
- ❌ **English word-order negation** → ✅ tense-correct **করি না** / **করিনি**.

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.

Sources: idiom renderings — localization judgment, thin provenance (⚠ native-speaker confirmation
pending), <https://en.banglapedia.org/index.php/Bangla_Language> (generic reference only) ·
grammar-level anti-patterns re-derived from §4,
<https://www.fsi-language-courses.org/fsi-bengali-course/6-making-requests-and-offers/>

---

## 8. Simplified-language pendant (`bn-easy`)

### 8a. ❌ No codified Bengali plain-language standard exists — and the negative is a hard one

**This is an established absence, not a search that ran out of road.** The bodies that would hold
such a standard were reached and read, and each turns out to have a different remit:

| Body checked | Reachable? | Plain-language rules? | Claim |
|---|---|---|---|
| বাংলা একাডেমি (Bangla Academy, Dhaka) | yes | no — spelling and dictionary remit | ❌ established absence |
| পশ্চিমবঙ্গ বাংলা আকাদেমি (Kolkata) | via encyclopedia only | no — spelling/grammar reform remit | ❌ absence; ⚠ own site not read |
| Ministry of Public Administration, Bangladesh | yes, full PDFs obtained | no — it is a spelling wordlist | ❌ established absence |
| ISO 24495-1:2023 national adoption (BSTI / BIS) | partly | neither country on the adopter list | ❌ for the list; ⚠ for the catalogs |
| Bangla easy-read in the disability sector | yes | format accessibility only, no language rules | ⚠ mixed |
| A Simple-Bengali Wikimedia project | yes, machine-readable | does not exist | ❌ established absence |

**The two strongest pieces of evidence, because they are primary:**

1. **The Wikimedia site-matrix API**, queried directly, returns exactly **six** projects for `bn` —
   `bnwiki`, `bnwiktionary`, `bnwikibooks`, `bnwikiquote`, `bnwikisource`, `bnwikivoyage`. There is
   no `simple-bn` anywhere in the matrix; the only simplified-language Wikipedia in the entire
   matrix is **Simple English**. This is an enumeration published by the operator itself.
2. **The Bangladeshi state's flagship language manual is an orthography manual, and says so on its
   own title page.** `সরকারি কাজে ব্যবহারিক বাংলা` carries the subtitle
   **«বাংলা একাডেমির প্রমিত বাংলা বানানের নিয়ম অনুসরণে»** — *in conformity with Bangla Academy's
   standard Bangla **spelling** rules* — and its body from p. 8 is a four-column table headed
   **সঠিক | সঠিক নয় | সঠিক | সঠিক নয়** ("correct | not correct"). The ministry's own preface names
   the problem it solves as **অসামঞ্জস্য** (inconsistency), never **বোধগম্যতা** (comprehensibility).

> **→ The state's language-quality program for Bangla optimizes for correctness and uniformity,
> not for the reader.** That is why there is nothing to inherit here, and why §8b–§8f are built
> rather than cited.
>
> ⚠ Two Bangladeshi government PDFs are typeset in the legacy 8-bit SutonnyMJ font; passages taken
> from their text layer were decoded, not copied, and are marked where used.

**Consequence.** `bn-easy` takes its frame from
[accessibility-workflow](../accessibility-workflow.md) and its language-specific content from the
measurement below.

### 8b. The axis — a doublet axis, not an etymology axis

Three candidate axes were checked against sources; only one of them survives as an *actionable*
lever.

**সাধু ভাষা vs চলিত ভাষা** is the axis Bengali sources themselves frame in difficulty terms — it is
the only place a source says outright **দুর্বোধ্য** ("hard to understand") against **সহজবোধ্য**
("easily understood"). But it is a **settled historical shift, not a live lever**: চলিত has been
standard written Bangla since the mid-twentieth century, so modern text is already চলিত. সাধু
survives as a live problem only in the administrative and legal register. **Diagnostic, not
actionable.**

**তৎসম / তদ্ভব / দেশি / বিদেশি** — the four vocabulary strata — is the axis a translator will reach
for, and it is the one that has to be handled carefully. The encyclopedic description of তৎসম does
say those words belong to
**«সাধারণত প্রচলিত শব্দের চেয়ে উচ্চতর এবং অধিকতর চলনসই স্বরভঙ্গির অন্তর্ভুক্ত»** ("a higher and more
formal tone than common words"), and বামনদেব চক্রবর্তী writes of তদ্ভব that
**«খাঁটী বাংলা বলিতে এইসব তদ্ভব শব্দকেই বুঝায়»** ("by *genuine* Bangla it is precisely these তদ্ভব
words that are meant"). **But তৎসম is 40–44 % of the Bengali lexicon**, and the grammars' own তৎসম
exemplars include **সূর্য**, **ধর্ম**, **পিতা**, **মাতা** — ordinary, unmarked words. A stratum that
large cannot be a marked register.

> **→ The axis, stated so it can be tested:** a তৎসম word is the formal member **only where a
> living তদ্ভব or দেশি doublet actually survives beside it** (চন্দ্র/চাঁদ, গৃহ/ঘর, হস্ত/হাত). Where no
> doublet survives, the তৎসম word simply *is* the everyday word. **Etymology identifies candidates;
> only a living doublet makes a pair.** §8c tests whether even that survives contact with a corpus.

⚠ A third feature — **consonant-conjunct density** — is reported as a corpus-validated readability
feature for Bangla. It is carried into §8f as a structural lever, not into the word tables.

### 8c. Measuring the axis — two corpora from one publisher, plus an independent cross-check

#### 8c-i. Method

| Corpus | What it is | Size |
|---|---|---|
| **Plain** | **কিশোর আলো** — the children's and teenagers' magazine of the Prothom Alo house (prose sections: stories, interviews, features, sport, entertainment, lifestyle, letters, Q&A) | 479 articles, **380,301 word tokens** |
| **Standard** | **প্রথম আলো** — the same house's daily paper (Bangladesh, world, business, education, analysis, travel, health) | 417 articles, **219,750 word tokens** |
| **Cross-check** | Bengali-language encyclopedia `insource:` **page** counts — a volunteer corpus with a completely different contributor base and a written-formal register | ~160k articles |

**Why this pair.** Both titles come from **one house**: প্রথম আলো describes কিশোর আলো as its own
magazine, the two share the Karwan Bazar address and switchboard, and মতিউর রহমান is publisher of
both. The variable is **reader age**, not publisher, city, period, or house style. The register split
is directly observable in how each addresses its reader — কিশোর আলো writes
**«তোমরা … লেখো / পাঠাও»**, প্রথম আলো titles its reader column **«আপনিও লিখুন»**.

**Counting.** All text was NFC-normalized before tokenization, then tokenized on
`[\p{L}\p{M}]+`. Rates are **per 100,000 word tokens**; the raw count is printed in brackets on
every row so a thin signal is visible as thin. Both an **exact-form** count and a **prefix (stem)**
count are given where the difference matters, because Bengali suffixes case and definiteness onto
the noun.

> ⚠ **Four caveats that travel with every number below.**
>
> 1. **Genre is not held constant.** কিশোর আলো is a monthly magazine, প্রথম আলো a daily paper. Any
>    *content* word — বাংলাদেশ, ব্যাংক, রাজস্ব, বাজেট — measures subject matter, not register. That
>    is why the tables below are restricted to connectives, light verbs, degree words, and
>    general-purpose nouns.
> 2. **The plain corpus spans 2018-10 to 2026-07; the standard corpus 2026-03 to 2026-07.** Period
>    is not matched.
> 3. **A children's magazine is not a plain-language corpus.** It is written by adult journalists
>    *for* young readers. It is the closest reachable analog; no Bangla plain-language corpus was
>    located (§8a).
> 4. **Frequency is not comprehension.** These rows say which word the plainer-facing register
>    actually uses. No Bangla comprehension study was found.

#### 8c-ii. The rows the measurement supports

Etymologies are the verbatim English-Wiktionary Bengali-section templates, which distinguish
**learned borrowing from Sanskrit** (= তৎসম) from **inherited from Sanskrit** (= তদ্ভব).
**Community tier — an open collaborative dictionary, not a Bengali lexical authority; no
Bangla Academy dictionary lookup was performed.**

| Formal / learned | Everyday | Evidence | Tier |
|---|---|---|---|
| **এবং** | **আর** | এবং is `{{bor+\|bn\|sa\|एवम्}}`; আর is `{{inh+\|bn\|inc-mbn\|আঅর}}` — a genuine তৎসম/তদ্ভব pair. **এবং 199.8 plain vs 616.2 standard; আর 694.4 vs 181.1.** Encyclopedia **155,143 vs 28,013** — written-formal Bangla strongly prefers এবং | **Dictionary + Corpus** |
| **অত্যন্ত** | **খুব** | **অত্যন্ত 10.5 vs 39.1** (40/86 tokens); **খুব 241.4 vs 60.1** (918/132). খুব is `{{bor+\|bn\|fa-cls\|خُوب}}` — **the everyday intensifier is the Persian one** | **Dictionary + Corpus** |
| **মাধ্যমে** | **দিয়ে** | **মাধ্যমে 39.2 vs 130.6** (149/287); **দিয়ে 306.9 vs 153.8** (1,167/338). Encyclopedia 44,436 vs 40,082 | **Corpus** |
| **প্রয়োজন** | **দরকার** | **প্রয়োজন 23.7 vs 92.8** — a 3.9× formal skew. দরকার is `{{bor+\|bn\|fa-cls\|درکار}}` and runs **flat at 45.2 / 44.1** ⚠ so it is register-neutral, not a plain marker. Encyclopedia 14,289 vs 2,100 | **Dictionary + Corpus** |
| **সহায়তা** | **সাহায্য** | **সহায়তা 5.3 vs 41.4** (20/91); **সাহায্য 35.2 vs 26.4** (134/58). 🔴 **Both are Sanskrit-derived** — সাহায্য is `{{lbor\|bn\|sa\|साहाय्य}}`. Etymology cannot tell these two apart; only frequency can | **Dictionary + Corpus** |
| **প্রদান করা** | **দেওয়া** | **প্রদান 1.3 vs 19.1** (5/42), stem 1.6 vs 25.9; **দেওয়া 104.7 vs 186.6** ⚠ (দেওয়া is itself standard-skewed — the row rests on প্রদান's 14.7× formal skew, not on দেওয়া being plain) | **Corpus** |
| **গ্রহণ করা** | **নেওয়া** | **গ্রহণ 8.7 vs 41.9**, stem 11.0 vs 69.6 — a 6.3× formal skew for the Sanskritic verbal noun | **Corpus** ⚠ নেওয়া also leans standard (34.4 / 120.6) |
| **পিতা** | **বাবা** | পিতা is `{{lbor\|bn\|sa\|पिता}}`, বাবা is `{{inh+\|bn\|inc-ash\|*𑀩𑀸𑀩𑁆𑀩}}`. **পিতা 0.8 vs 0.0** against **বাবা 85.7 vs 10.9**. Encyclopedia near parity (12,060 / 12,105) — পিতা is the *encyclopedic* word | **Dictionary + Corpus** |

**The পিতা and গ্রহণ rows carry the pattern that actually matters:** what these formal members share
is not Sanskrit ancestry but **membership of the নাম-ধাতু pattern — a Sanskritic verbal noun plus a
light verb করা**. Replacing **প্রদান করা** with **দেওয়া** is not a synonym swap; it collapses a
two-word construction into one verb. That is the highest-yield lexical move in administrative Bangla
and it is a *structural* move, which is why §8f ranks it above vocabulary.

### 8d. 🔴 Do NOT "simplify" these — where the measurement contradicts the instinct

**This is the most important table in §8.** Every row is a substitution that "তৎসম = hard, তদ্ভব =
easy" recommends and that the corpora refute.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**গৃহ → ঘর**, **বৃক্ষ → গাছ**, **হস্ত → হাত**, **মস্তক → মাথা**, **দুগ্ধ → দুধ**, **কর্ণ → কান**, **চর্ম → চামড়া**, **অদ্য → আজ**~~ | 🔴 **The whole grammar-book doublet table is dead vocabulary.** As free words, **গৃহ, বৃক্ষ, হস্ত, মস্তক, কর্ণ, অদ্য all occur 0 times in 600,051 tokens** of modern Bangla journalism; দুগ্ধ occurs once, চর্ম once. They survive only inside compounds (গৃহযুদ্ধ, হস্তান্তর — গৃহ- stem 5.5/14.6, হস্ত- 1.6/13.2). **A translator will never meet these words in running text.** The table every Bangla grammar prints is a historical statement, not a simplification tool. |
| ~~**কিন্তু** → anything~~ | কিন্তু is `{{lbor\|bn\|sa\|किन्तु}}` — a **learned Sanskrit borrowing** — and it is the single most plain-skewed connective measured: **460.7 plain vs 175.7 standard** (1,752/386). The most তৎসম word in the connective inventory is the plainest one. |
| ~~**কারণ** → a native word~~ | Also from Sanskrit (`{{bor+\|bn\|sa\|कारण}}`), also plain-skewed: **133.6 vs 111.9**, stem 234.6 vs 281.7. Everyday. |
| ~~**শেষ**, **জন্য**, **অর্থ** → native words~~ | **শেষ** is `{{lbor\|bn\|sa\|शेष}}` and runs **169.3 plain vs 72.4 standard** — a plain marker. **জন্য** is `{{bor+\|bn\|sa\|जन्य}}` at 366.3 / 438.2, one of the commonest postpositions in the language. Only **অর্থ** (11.6 / 80.5, stem 57.1 / 400.0) is genuinely formal-skewed, and that is a finance-topic artifact. |
| ~~**কঠিন → শক্ত**~~ | 🔴 **Backwards twice over.** কঠিন is the Sanskrit borrowing (`{{lbor\|bn\|sa\|कठिन}}`) and শক্ত is the Persian one (`{{bor+\|bn\|fa-cls\|سخت}}`) — so the swap is not তৎসম→তদ্ভব at all. And কঠিন runs **flat at 52.6 / 45.5** while শক্ত reaches only **17.4 / 10.5**: the "plain" word is **three times rarer**. Encyclopedia 6,546 vs 2,760. |
| ~~**সহজ → সোজা**~~ | সহজ is `{{lbor\|bn\|sa\|सहज}}`, সোজা is inherited — the textbook shape. But সহজ runs **47.9 / 46.0** and সোজা only **15.8 / 2.7**. The inherited word is rarer, **and the senses have parted** — Wiktionary glosses সোজা as *straight* as well as *easy*. Swapping trades a common word for a rarer, more ambiguous one. |
| ~~**গগন → আকাশ**~~ | Wiktionary labels গগন `{{lb\|bn\|poetic}}` — so the instinct is right about the register — but **গগন scores 8.9 in the children's corpus and 0.0 in the adult paper** (34/0). The literary word is the one the *plain* corpus uses, because children's writing carries verse. And **আকাশ is itself a Sanskrit borrowing**, so any rule of the form "replace তৎসম with non-তৎসম" never fires here at all. |
| ~~**সূর্য**, **ধর্ম**, **মাতা** → native words~~ | তৎসম exemplars in every grammar, with **no living তদ্ভব doublet in general use**. সূর্য 6.3 / 2.7 (stem 18.4 / 15.5); ধর্ম 1.1 / 2.7. There is nothing to replace them with. |
| ~~**আজ**, **দুধ** as evidence that তদ্ভব = plain~~ | Both are inherited words that are **commoner in the adult paper**: আজ **52.6 vs 99.2**, দুধ **3.2 vs 8.2**. The stratum does not predict the direction. |

**And the direction that actually held.** The Persian- and Arabic-derived stratum kept turning up on
the *plain* side: **খুব** (`فا خُوب`) 241.4/60.1, **দরকার** (`درکار`) flat where তৎসম প্রয়োজন is
formal-skewed, **শুরু** (`شروع`, via Arabic) **226.1 vs 157.5**, **শক্ত** (`سخت`). **In Bengali the
borrowed word is repeatedly the everyday one and the "pure" word the formal one** — the exact
inverse of the purification instinct.

> **→ The rule that follows.** In Bangla, **do not simplify by etymology.** Simplify by
> **structure** (§8f), and make a lexical swap only where a *measured* register difference supports
> it — never because a word looks Sanskritic, and never from a grammar book's তৎসম/তদ্ভব table.

### 8e. 🔑 The address decision — `bn-easy` keeps আপনি

> **Decision, recorded so that nobody "fixes" it: `bn-easy` keeps আপনি. It does NOT switch to তুমি,
> and never to তুই.**

- ✅ **আপনি** + honorific verb — **করেন**, imperative **করুন / লিখুন / পাঠান** — in `bn` and `bn-easy` alike
- ❌ **তুমি** + **করো / লেখো / পাঠাও** — familiar is not simpler, only less respectful
- ❌ **তুই** + **করিস** — excluded outright

**The evidence, and what it does and does not show.** The measurement found the cleanest natural
experiment one could ask for: **one house making opposite address choices by audience.** In the
children's magazine **তুমি 206.7 vs 2.3** per 100k, **তোমার 193.8 vs 1.4**, imperative **করো 52.3 vs
0.5**, **পারো 58.4 vs 0.0**; in the daily paper the honorific imperative **করুন 30.9 vs 4.2** and
**পারেন 86.9 vs 26.8**. The split is total.

🔴 **But that is an audience-*age* correlation, and reading it as "simpler text takes তুমি" is the
error this subsection exists to prevent.** কিশোর আলো uses তুমি because its readers are children —
and note that **আপনি is itself *more* frequent in the children's magazine than in the paper (125.7
vs 23.7)**, because the magazine interviews adults. Frequency of তুমি tracks who is being spoken to,
not how hard the text is.

**Why আপনি, in three points:**

1. **তুমি carries no comprehension benefit.** It is not a simpler word; it is a less respectful one.
2. **`bn-easy` readers include adults with low literacy, adults with cognitive disabilities, and
   second-language readers.** Addressing an adult as তুমি because the text is simple is the
   infantilization failure mode of easy-read design.
3. **Bangla marks the choice far more heavily than European languages do.** The pronoun conjugates
   **every finite verb in the document** (করেন → করো), so an address decision is not a pronoun
   decision — it re-registers the whole text. And তুই is described by the teaching sources as
   something that **"can be extremely rude"** outside intimate relationships.

> ⚠ **This decision is reasoned craft, not a sourced finding.** No Bangla source anywhere discusses
> address register in simplified language — there is no standard to contain such a recommendation
> (§8a). It is recorded loudly because a reviewer who "warms up" `bn-easy` by switching to তুমি has
> made a large, whole-document change on an instinct the measurement does not support. **Do not
> accept that change without a native-reviewer ruling.**

**One inversion in the same spirit:** `bn-easy` should use **more** explicit **আপনি**, not fewer.
Where the base variant drops the subject for flow, the simplified variant states it.

### 8f. What `bn-easy` is built on — structure first, morphology second, vocabulary last

⚠ **Craft, derived from the sourced facts above and labeled as derivation.** Ordered by leverage,
highest first.

1. **Unpack the নাম-ধাতু / light-verb constructions. This is the main lever.** Sanskritic verbal
   noun + করা → a single verb: **প্রদান করা → দেওয়া**, **গ্রহণ করা → নেওয়া**, **প্রেরণ করা → পাঠানো**,
   **অবহিত করা → জানানো**. §8c measured the formal member of the first two at 14.7× and 6.3×
   standard-skew. This is a structural edit that also happens to shorten the sentence — which is why
   it outranks any word table.
2. **Split participial chains.** Bangla stacks non-finite participles (-ে, -য়ে) into long
   single-sentence chains; `bn-easy` breaks each into its own finite clause. **This overrides
   nothing in the base rules — it is the Bangla-specific form of the kit's "one idea per sentence".**
3. **Reduce compounding density** — সমাস and সন্ধি — and with it the consonant-conjunct load flagged
   in §8b. Prefer the analytic phrase over the welded compound.
4. **Prefer the measured everyday connective**: **আর** over **এবং**, **কিন্তু** unchanged, **দিয়ে**
   over **মাধ্যমে**, **খুব** over **অত্যন্ত**. Four rows, not a table of forty — that is all the
   measurement supports.
5. **Keep the technical term and explain it.** `bn-easy` uses the same term as the base variant,
   then "that means: …", then a concrete example — keep **নিউরাল নেটওয়ার্ক**, gloss it in plain
   Bangla, never replace it with a folksy stand-in. **This is the kit's term-preservation rule in
   its Bangla form and it is unchanged.**

**What it overrides in the base rules.** From
[accessibility-workflow](../accessibility-workflow.md), `bn-easy` keeps one idea per sentence, the
everyday-word preference, saying what *is* rather than what is not, the same word for the same
thing, the one-line "what is this" opener and the literal tone. It **overrides** two things: the
kit's ~8–12-word sentence target is applied as *one clause per sentence* rather than a word count,
because Bangla's agglutinated postpositions make a word count a poor proxy; and the kit's
SVO-simple structure is read as **SOV-simple**, respecting Bangla's surface order (§4). Digits stay
per §5/§11.

### 8g. What is still open

1. **No Bangla plain-language comprehension study was located.** Every row in §8c is a frequency
   claim. Frequency is not comprehension, and nothing here has been tested on a reader.
2. **The address decision (§8e) is unsourced craft.** It needs a native-reviewer ruling, ideally
   from someone working in Bangladeshi or West Bengali disability communication.
3. **The Bangla Academy dictionary was never queried.** Every etymology in §8c is Community tier.
   Promoting those rows to Official tier is the single cheapest quality upgrade available.
4. **The light-verb list in §8f item 1 is only half measured.** প্রদান and গ্রহণ carry corpus
   evidence; **প্রেরণ করা → পাঠানো** and **অবহিত করা → জানানো** do not — প্রেরণ occurs 1× and অবহিত
   0× in the plain corpus, so the corpus is silent rather than supportive.
5. **The corpora do not hold genre or period constant** (§8c-i caveats 1–2). A rerun against
   প্রথম আলো's *feature* sections rather than hard news would tighten every ratio.
6. **The reported 22,580-pair Bangla complex→simple word mapping and the 3,396-word easy-word list**
   from the readability literature were not retrievable (the source page returned HTTP 403). They
   are the right foundation for a real substitution table and remain unopened.
7. **সাধু residue in administrative Bangla** (§8b) is the register `bn-easy` will most often have to
   translate *out of*, and the two best sources on it were 403-blocked. Unmeasured.
8. **BSTI and BIS catalogs could not be queried** for an ISO 24495-1 adoption; that one sub-item
   in §8a is ⚠ inconclusive rather than ❌.

Sources: <https://meta.wikimedia.org/w/api.php?action=sitematrix&format=json> ·
<https://mopa.gov.bd/> · <https://mra.gov.bd/pages/static-pages/6922e0a5933eb65569e27ff6> ·
<https://www.iso.org/standard/78907.html> · <https://bn.wikipedia.org/wiki/তৎসম> ·
<https://bn.wikipedia.org/wiki/কিশোর_আলো> · <https://en.wikipedia.org/wiki/Prothom_Alo> ·
**Plain corpus** — 479 prose articles of *কিশোর আলো*, <https://www.kishoralo.com/>, enumerated via
the publisher's own story API at <https://www.prothomalo.com/api/v1/stories> ·
**Standard corpus** — 417 articles of *প্রথম আলো*, <https://www.prothomalo.com/> ·
**Address-register evidence** — <https://www.kishoralo.com/topic/লেখা-পাঠাব-যেভাবে> ·
<https://www.prothomalo.com/opinion/column/আপনিও-লিখুন> ·
**Encyclopedia cross-check** — `insource:` page counts via
<https://bn.wikipedia.org/w/api.php?action=query&list=search&srinfo=totalhits> ·
**Etymologies** — <https://en.wiktionary.org/wiki/কিন্তু> · <https://en.wiktionary.org/wiki/কারণ> ·
<https://en.wiktionary.org/wiki/শেষ> · <https://en.wiktionary.org/wiki/জন্য> ·
<https://en.wiktionary.org/wiki/সাহায্য> · <https://en.wiktionary.org/wiki/এবং> ·
<https://en.wiktionary.org/wiki/আর> · <https://en.wiktionary.org/wiki/খুব> ·
<https://en.wiktionary.org/wiki/দরকার> · <https://en.wiktionary.org/wiki/শুরু> ·
<https://en.wiktionary.org/wiki/কঠিন> · <https://en.wiktionary.org/wiki/শক্ত> ·
<https://en.wiktionary.org/wiki/সহজ> · <https://en.wiktionary.org/wiki/সোজা> ·
<https://en.wiktionary.org/wiki/গগন> · <https://en.wiktionary.org/wiki/আকাশ> ·
<https://en.wiktionary.org/wiki/চন্দ্র> · <https://en.wiktionary.org/wiki/চাঁদ> ·
<https://en.wiktionary.org/wiki/পিতা> · <https://en.wiktionary.org/wiki/বাবা> (Community tier — an
open collaborative dictionary, not a Bengali lexical authority) ·
[accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md)

---

## 9. Regional variation

**Which standard the project targets.** The written standard **চলিত ভাষা / *Chôlitôbhāṣā***,
based on central (Nadia / Kushtia) dialects, is shared across Bangladesh and West Bengal and is
the common basis for newspapers, official documents, and education. The project targets this
**shared written standard, with Bangla Academy spelling as the orthographic anchor** (widely
respected on both sides of the border), and **parameterizes** the few things that genuinely
differ by deployment.

**Differences table.**

| Axis | Bangladesh | West Bengal (India) |
|---|---|---|
| Authority | Bangla Academy (Dhaka) | Paschimbanga Bangla Akademi (Kolkata) |
| Currency | Bangladeshi taka **৳** (BDT) | Indian rupee **₹** (INR) |
| Vocabulary tendency | more Arabic/Persian/Urdu loans | more Sanskrit/Hindi-derived words |
| Honorifics | আপনি common even within family (incl. parents) | তুমি more frequent within family |
| Pronunciation | "Dhakaiya / Shuddho"; ষ → "sh" | "Kolkata Bangla"; different intonation/stress |

**Vocabulary contrast pairs.** water: **পানি** (BD) / **জল** (WB); prayer: **নামাজ** (BD) /
**প্রার্থনা** (WB); fasting: **রোজা** (BD) / **উপবাস** (WB). Finer pairs (salt **লবণ** BD /
**নুন** WB; "tomorrow" **কাল** BD / **আগামি** WB in some registers) rest **only on community/
forum sources — ⚠ unverified** provenance; use with care.

**Neutrality strategy (explicit).**

1. Orthography: follow **Bangla Academy standard spelling** for general language.
2. Register: use the **আপনি** register recorded in §4 + formal verb endings for all second-person
   copy — respectful in both regions.
3. Vocabulary: avoid strongly region-marked synonyms when an unmarked option exists; where a
   marked word is unavoidable, choose a context where either form works, or gloss once.
4. Technical terms: use the §6 sector terms; keep shared English acronyms (AI, ML, CPU).
5. Currency & administrative vocabulary: **parameterize per deployment** (৳ + Bangladeshi terms
   for Bangladesh; ₹ + Indian administrative vocabulary for West Bengal) while keeping the rest of
   the UI identical.

The two standards are mutually intelligible; differences are mainly accent and vocabulary, so a
single neutral written build serves both with the parameterized exceptions above.

Sources: <https://dailyinqilab.com/special/article/734723> ·
<https://en.wikipedia.org/wiki/Paschimbanga_Bangla_Akademi> ·
<https://en.wikipedia.org/wiki/Bangla_Academy>
(regional vocabulary/honorific contrasts additionally rest on community sources — see
⚠ markers above)

---

