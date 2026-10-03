<!-- base -->
# lang-ar — Arabic (العربية) — language guide

> **Setup & sources live in [`ar.setup.md`](ar.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** العربية / Arabic. The written standard this guide targets is Modern
Standard Arabic — العربية الفصحى الحديثة (MSA).
**BCP 47 code (base):** `ar`.
**BCP 47 code (simplified variant):** `ar-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (confirmed kit convention, applied throughout the kit's language
services). A strict BCP 47 rendering would use a private-use subtag (`ar-x-simple`), but the
kit token `ar-easy` is the one that counts here.
**Speaker reach:** Arabic is a **macrolanguage** — verbatim from the cited source: *Arabic is
classified as a “macrolanguage” in the ISO 639 standard and is assigned to [ara] as its
three-letter code*, covering ~28 individual language codes (Egyptian `arz`, Levantine `apc`,
Moroccan `ary`, Standard Arabic `arb`, …). ⚠ **No speaker total is asserted here.** The cited
Ethnologue entry now gates population figures (*This information is accessible only on our paid
product plans*), and Ethnologue's public top-200 list explicitly excludes macrolanguages
(*If macrolanguages were included, entries like Chinese and Arabic would each encompass multiple
distinct languages*) — so it does **not** support the "400 million first-language / 450+ million
total" split this guide previously stated. Commonly published estimates land **in the hundreds of
millions**, but the number swings hard on the counting method (L1 only vs L1+L2; MSA alone vs all
regional varieties), and the L1/total split is
exactly where such figures are most often mis-transcribed. **If you need a number, cite the source
and its counting method with it; do not present a bare total as fact.** Arabic is spoken across
North Africa and the Middle East, is an official language in many Arab League states, and is used
well beyond them in administration, education, media, and religion. For a translation platform the
practical default is **MSA**, the cross-border *written* standard used in formal and educational
contexts — not any regional dialect.
**Script + direction:** Arabic script, core block **U+0600–U+06FF**; **right-to-left (RTL)**.
RTL is not a display toggle — it pulls in the Unicode bidirectional algorithm, mixed LTR runs
(Latin acronyms, numbers, URLs) inside RTL sentences, contextual letter shaping/joining, and
RTL-aware punctuation. Those implications run through §3 and §10.
**Status:** planned — authored from **external desk research** (a deliberately thinner,
non-deep research pass; several sections came back sparse and say so — **§8 is no longer one of
them**: a later pass found a codified Arabic easy-reading standard the first pass had reported
as absent, and §8 is now built on its 19 verbatim rules). Covers base `ar` and the
`ar-easy` pendant. **Not yet reviewed by a fresh model against the cited sources, and not yet
reviewed by a native speaker** — per the authoring directive's "second set of eyes" rule
([QUAL-007](../../base/standards/QUALITY.md)), this header records both gaps honestly. A later pass
took the **§3 nested-quotation rule** to four Arabic normative sources (1912 treatise, Cairo
Academy, an Arabic encyclopedia, W3C alreq) and to a six-publication usage census: **every Arabic
authority reached defines one quotation pair and none has a nesting convention**, so the ⚠ is
narrowed and re-grounded rather than removed. This is
exemplar #2 of the pilot (Bengali was #1); its purpose is to exercise the RTL parts of the
template.
**Easy or hard for this kit:** whitespace *broadly* works in Arabic's favor — words are
space-separated, so ordinary tokenization mostly applies — **but** clitics attach
orthographically to their host word, so token boundaries are not identical to English (§10).
The hard parts are: **RTL + bidi** with mixed LTR runs; **contextual shaping/joining**, which
demands a full Arabic-OpenType font and forbids stored presentation-form code points; and
**pervasive grammatical gender**, which forced a register *and* a gender-in-addressing decision
before any second-person UI copy. That decision is now **taken and recorded** (§4): MSA formal-neutral base
register, with **rephrasing to avoid gendered second-person address** as the primary strategy and
**masculine as the conventional fallback** where a gendered form is unavoidable.

Sources: <https://www.ethnologue.com/language/ara/> ·
<https://www.unicode.org/faq/arabic.html> · <https://www.w3.org/TR/alreq/>

---

## 1. Header block

See above. One-line orientation: Arabic is a Semitic, RTL, cursive-joining script with a shared
written standard (MSA) across the Arab world; the localization risks concentrate in **bidi /
mixed-direction runs, contextual shaping, gendered agreement (register + addressing), and
digit-system choice**.

---

## 4. Grammar for translators

**Word order.** Formal written Arabic is classically **VSO**, but **SVO** is also common and is
often preferred in modern prose, headlines, and educational content where clarity matters. For
platform copy, SVO reads clearly and is safe.

**Register — and the project's recorded choice.** Educational platforms conventionally use a
**formal, neutral register: MSA — respectful but not ceremonial, without dialectal slang or
heavily religious phrasing** — a style meant to be clear, standard, and broadly pan-Arab. That
much the research supports. But MSA carries **grammatical gender in second-person address**, and
"you" is not register-flat: *"you are ready"* must be gendered —

- masculine: **أنتَ جاهز**
- feminine: **أنتِ جاهزة**

So the register decision has a *second* half unique to Arabic: how to handle gender when the
addressee is unknown or mixed. That decision is **taken** and recorded below.

> **Register decision (human-gate): taken and recorded.** Base register: **MSA, formal-neutral** (clear,
> standard, pan-Arab; no dialect, no ceremonial or sectarian phrasing). Grammatical-gender
> strategy for second-person addressing copy, where the audience gender is unknown or mixed —
> **binding for all second-person copy in `ar` and `ar-easy`**:
> - **Primary: strategy (c)** — **rephrase to avoid gendered second-person address**
>   (imperatives, verbal nouns, impersonal constructions) so no gender is forced.
> - **Fallback: strategy (a)** — **masculine as the conventional form**, used *only* where a
>   gendered form is unavoidable.
>
> Candidate list kept for transparency: **(a)** masculine as the conventional default;
> **(b)** dual-gender forms shown together (أنتَ/أنتِ … جاهز/جاهزة) — safest but verbose;
> **(c)** rephrase to avoid direct gendered address — *recorded as primary*. Hold this steadily
> across the platform; no drift into a second addressing strategy.
>
> Under the kit's [human-gate](../human-gate.md) rule this is a decision the project must make
> **consciously and write down**: the label marks the *obligation to decide*, not a sign-off that
> was obtained. It is a **project decision, taken and recorded here** on the evidence above —
> **not** a ruling by any language authority, and there is no such ruling to appeal to. A
> downstream project weighing the same evidence may record a different register; what this kit
> forbids is leaving the choice implicit.

The grammar features that break a naive EN/DE → AR translation:

**(1) Gender and agreement are pervasive.** Verbs, adjectives, demonstratives, and many pronouns
agree in gender (and number). A source with a single register-flat "you" or "the user" can break
the moment it is rendered, if the audience is mixed or unknown.
- ✅ **أنتَ جاهز** / **أنتِ جاهزة** — gender-matched.
- ❌ Assuming one gender silently for an unknown audience (this is exactly what the recorded
  decision above governs — rephrase first, masculine only as fallback — not a free choice for a
  translator).

**(2) The dual is productive.** Arabic has a distinct **dual** for two items or two people, so
"two lessons" may need **dual morphology**, not a plural form. Naive plural-for-two is a defect.
- ✅ **كتابان** — "two books"; the dual ending alone already carries "two."
- ❌ **كتابان اثنان** — redundant explicit "two" bolted onto a form that is already dual (a
  literal transfer from English "two books"). *(correct-form-only, unverified — see gap note.)*

**(3) Construct state (idāfa) for possession.** Instead of an "of"-phrase everywhere, Arabic
uses an **iḍāfa** chain.
- ✅ **كتاب الطالب** — "the student's book."
- ❌ An English-style "of/from" calque with **مِن** (*min* = "from"): *الكتاب من الطالب*
  (illustrative wrong form — reads as "the book *from* the student").

**(4) The definite article and adjective agreement are mandatory.** The article **ال** and
adjective definiteness / gender / number matching create errors when translated word-for-word
from English (which marks none of this on adjectives).
- ✅ **البيتُ الكبيرُ** — "the big house"; the adjective takes the article and agrees in
  definiteness, gender, and case.
- ❌ **البيت كبير** — for the intended "the big house," this drops adjective agreement and reads
  instead as a sentence, "the house is big." *(correct-form-only, unverified — see gap note.)*

**(5) Subject pronouns are often dropped (pro-drop).** Verb endings carry the subject, so
over-inserting explicit pronouns reads as repetitive and unnatural. Do not mirror every
English "you / it / they" with an explicit Arabic pronoun.
- ✅ **أذهب إلى المدرسة** — "I go to school"; the verb ending already encodes the subject.
- ❌ **أنا أذهب إلى المدرسة** — redundant explicit **أنا** ("I") for plain neutral narration, a
  calque of English's obligatory subject pronoun. *(correct-form-only, unverified — see gap note.)*

> **Example-pair note (correct-form-only, unverified).** Features (2), (4), and (5) now carry
> native-script right/wrong pairs (dual كتابان; article+adjective البيتُ الكبيرُ; pro-drop
> أذهب), supplied by the follow-up research round. **The research self-marked these pairs
> "unsourced"** — no Arabic academy or government grammar reference backs the exact wording, and
> they are recorded as **correct-form-only**: the correct forms are standard MSA, but they still
> need confirmation from a named grammar authority before they count as publication-grade. (The
> iḍāfa calque in (3) remains the one *constructed* wrong form, marked "illustrative wrong form"
> at point of use.)

The research also flags, without a clean contrastive Arabic pair, that **"the system updates
automatically"-type sentences** often want a **passive or impersonal** construction rather than a
direct calque, and that **relative clauses and participles frequently need restructuring, not
word substitution**. (These two rest on weak provenance — see §2 — but are plausible standard
MSA behavior; treat as guidance, not a sourced rule.)

Sources:
<https://imamhamzatcoed.edu.ng/library/ebooks/resources/Modern_Standard_Arabic_Reference_Grammar.pdf>
(hosted reference grammar — mirror; the gender / dual / iḍāfa / article / pro-drop features)

---

## 5. Numbers, dates, currency

**Digit system.** Two digit systems appear on the Arabic web: **Western digits 0123456789** and
**Arabic-Indic digits ٠١٢٣٤٥٦٧٨٩** (U+0660–U+0669). CLDR 48.2 encodes both for `ar`: the
**default numbering system is `latn`** (Western digits) with **`arab` recorded as the *native*
system** — which is why Arabic interfaces legitimately show either. In practice **Western digits**
dominate UI, finance, and technical contexts across pan-Arab interfaces, while **Arabic-Indic
digits** are common in formal Arabic presentation and in some regional locales (`ar-SA` flips the
default to `arab`). **Rule: pick one system per context and never mix systems inside a single
number** (see §11).

**Separators.** In the **`arab`** numbering system the **decimal separator is ٫** (U+066B ARABIC
DECIMAL SEPARATOR) and the **group separator is ٬** (U+066C ARABIC THOUSANDS SEPARATOR) — both
confirmed in CLDR 48.2 `ar`. In the **`latn`** system `ar` uses the Western **`.` decimal / `,`
group**. Grouping is plain triples (`#,##0.###`) in both. Note that the CLDR `ar` sign and percent
symbols carry **embedded bidi control characters** (ALM U+061C before the minus/plus in `arab`,
LRM U+200E in `latn`) — strip them and mixed-direction numbers will visually reorder (§3, §10).

**Dates.** CLDR 48.2 `ar` (Gregorian) gives **day-month-year ordering** throughout: full
`EEEE، d MMMM y` — note the **Arabic comma ، U+060C** — long `d MMMM y`, medium `dd‏/MM‏/y` and
short `d‏/M‏/y`, both of which embed **RLM U+200F** around the slashes so the date does not
reorder inside a bidi run. Times are **12-hour with am/pm** (`h:mm:ss a zzzz`). The `ar-SA` locale
additionally carries **Islamic (Hijri) calendar** data for religious and government contexts.

**Calendar policy (editorial default).** Calendar choice is a **content-policy** decision, not a
fixed locale rule. For a pan-Arab educational platform the neutral default is **Gregorian first,
with optional Hijri as a secondary display** where the audience, institution, or legal/religious
context benefits from it; **dual-dating** is common in **government / official / official-notice**
contexts where readers expect both systems. **Regional specifics are ⚠ unverified** — exact
per-country and per-sector expectations vary and the research self-flagged anything more specific
than this default as unsourced; standardize per target market (§9). *(Like the §3 bidi toolbox,
the research's citation for this guidance is mis-attributed — it resolved to a CLDR
number-formats page, not a calendar source — so the default itself is **source open**.)*

**Currency.** The CLDR 48.2 `ar` currency pattern is **`‏#,##0.00 ¤`** — amount first, then a
**non-breaking space**, then the symbol, with a leading **RLM (U+200F)** holding the run
right-to-left. Both invisible characters are physically present in that pattern string above: the
gap between the amount and `¤` is **U+00A0 NO-BREAK SPACE**, not U+0020, exactly as the RLM is a
real U+200F. Copy the string; retyping it silently substitutes an ordinary space and lets the
amount separate from its symbol at a line break inside an RTL run.
Beyond that pattern, placement is locale- and platform-dependent, and in formal
Arabic content the **currency name is often written out in Arabic** (name + amount,
RTL-consistent layout) rather than shown as a bare symbol — e.g. for the Saudi Riyal, editors
often prefer the Arabic currency name plus the amount. **Editorial symbol conventions beyond the
CLDR pattern remain ⚠ unverified** (the research flags them as unsourced and
implementation-specific); standardize them **per target market** and parameterize per deployment
(§9), rather than hard-coding one symbol placement.

Sources: <https://www.unicode.org/terminology/digits.html> ·
<https://www.unicode.org/cldr/charts/latest/summary/ar.html> ·
<https://www.unicode.org/cldr/charts/latest/verify/numbers/ar.html> ·
<https://cldr.unicode.org/downloads/cldr-48>
(the numbering-system, separator, date-pattern, and currency-pattern values above were read from
**CLDR 48.2**, 2026-03-17, replacing this guide's earlier v24 chart citation — the v24 rows were
never transcribed into the guide, so nothing was corrected, only filled in.)

---

## 6. Terminology strategy

**Loanword vs coinage.** Arabic technical vocabulary mixes **established borrowings, calqued
native coinages, and standardized institutional terms**. In formal digital content, terms are
chosen for **clarity and consistency, not purism**: official glossaries (SDAIA / KSGAAL; the UAE
AI dictionary) prefer standardized Arabic equivalents for high-visibility public content, while
**entrenched international loans are retained** where they are already the norm. Transliteration
is used mainly for **names, model/product names, and acronyms** — not as the default for ordinary
technical terms.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention
of an established domain term (class **C3**), give the reader all three at once — the Arabic
term, the original English term, and one short plain clause of what it means — then use the
Arabic term alone afterwards. Instantiated with a sourced term:

> **الذكاء الاصطناعي** (artificial intelligence) — *"…"* one plain clause of explanation, then
> **الذكاء الاصطناعي** alone on every later mention.

(The Arabic term is sourced below; the explanatory clause is authored per the sandwich format,
not a sourced string.)

**Seed field vocabulary (AI / ML).** Field-standard renderings drawn from official glossaries and
common Arabic technical usage. **Because Arabic AI glossaries are still being standardized, exact
preferred forms vary by institution** — freeze the chosen forms in the project glossary and do
**not** mix competing renderings within the platform. Provenance is marked per row.

| Concept (EN) | Arabic term | Provenance |
|---|---|---|
| Artificial intelligence | الذكاء الاصطناعي | news/official (standard) |
| Machine learning | التعلّم الآلي | semi-official (saudipedia data & AI glossary) ✓ |
| Deep learning | التعلّم العميق | ⚠ unverified (follow-up: unsourced) |
| Neural network | شبكة عصبية | community glossary — weak |
| Model | نموذج | UAE AI dictionary ✓ |
| Dataset | مجموعة بيانات | UAE AI dictionary ✓ |
| Data preprocessing | المعالجة المسبقة للبيانات | community glossary — weak |
| Natural language processing | معالجة اللغة الطبيعية | community glossary — weak |
| Computer vision | الرؤية الحاسوبية | ⚠ unverified (research: unsourced) |
| Training | تدريب | ⚠ unverified (follow-up: unsourced) |
| Inference | استدلال / استنتاج | ⚠ unverified (unsourced) |
| Token | وحدة رمزية / رمز لغوي | ⚠ unverified (unsourced) |
| Embedding | تضمين | ⚠ unverified (unsourced) |
| Fine-tuning | الضبط الدقيق | ⚠ unverified (unsourced) |
| Prompt | مطالبة / مُدخل نصي | ⚠ unverified (unsourced) |
| Hallucination | هلوسة | glossary site — weak |

Treat this table as **field usage to be confirmed against the official UAE AI dictionary and the
KSGAAL / SDAIA glossaries in §2**, not as canon. Project coinages (C1) keep their original
spelling and are owned by the term-sheet, not this table.

Sources:
<https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/the-arabic-dictionary-of-artificial-intelligence> ·
<https://www.arabnews.com/node/2046471/amp> ·
<https://english.aawsat.com/culture/5221062-icaire-launches-data-ai-glossary-mark-world-arabic-language-day> ·
<https://saudipedia.com/en/data-and-artificial-intelligence-glossary> (semi-official — machine
learning = التعلّم الآلي) ·
<https://github.com/nainiayoub/nlp-arabic-glossary> (community, weak) ·
<https://hala.academy/glossary> (glossary site, weak)

---

## 7. Idiom anti-patterns

This is the section the research answered **best** — a full inventory of stock EN/DE phrases with
an idiomatic MSA rendering and the literal calque marked wrong. Prefer the idiomatic form; the
calques "often sound foreign or obscure in MSA." **⚠ Weak provenance — the whole table rests on a
single community/course-wiki page (see Sources below); a native-speaker review pass should confirm
each rendering.**

| Source phrase (EN/DE) | ✅ Idiomatic Arabic | ❌ Literal calque (wrong) | Provenance |
|---|---|---|---|
| step by step | خطوة خطوة | خطوة بواسطة خطوة | ⚠ single community/course-wiki page (see Sources) |
| under the hood | في الخلفية / من الداخل | تحت الغطاء | ⚠ single community/course-wiki page (see Sources) |
| at a glance | لمحة سريعة | عند نظرة | ⚠ single community/course-wiki page (see Sources) |
| keep in mind | ضع في الحسبان | احتفظ في العقل | ⚠ single community/course-wiki page (see Sources) |
| by default | افتراضيًا | بواسطة الخطأ | ⚠ single community/course-wiki page (see Sources) |
| out of the box | مباشرة بعد التثبيت / جاهز للاستخدام | خارج الصندوق | ⚠ single community/course-wiki page (see Sources) |
| end to end | من البداية إلى النهاية | طرف إلى طرف | ⚠ single community/course-wiki page (see Sources) |
| from scratch | من الصفر | من الخدش | ⚠ single community/course-wiki page (see Sources) |
| break down | يشرح / يفكك | يكسر لأسفل | ⚠ single community/course-wiki page (see Sources) |
| roll out | يطرح / يطلق تدريجيًا | يلف إلى الخارج | ⚠ single community/course-wiki page (see Sources) |
| in the long run | على المدى الطويل | في الجري الطويل | ⚠ single community/course-wiki page (see Sources) |
| a bunch of | مجموعة من / عدد من | حفنة من | ⚠ single community/course-wiki page (see Sources) |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English/German wording, it is too literal — rework it.
Default to **concise MSA with simple verbs and natural collocations**, then adapt by audience and
grade level.

Sources:
<https://sites.middlebury.edu/ewttalentwiki/2019/12/03/arabic-language-guide/> (idiom table —
weak provenance; a native-speaker review pass should confirm each rendering)

---

## 8. Simplified-language pendant (`ar-easy`)

### 8a. ✅ The standard — «المعايير العربية للقراءة المبسطة»

**This section previously reported that Arabic has no codified easy-read standard. That was wrong,
and correcting it is the point of this rewrite.** A codified, rule-level Arabic easy-reading
standard exists, was retrieved in full, and is written **for** Arabic rather than translated into
it. It is the only source in this section with an issuing body, and everything `ar-easy` is built on
starts here.

| | |
|---|---|
| **Title** | «المعايير العربية للقراءة المبسطة» — brand «بساطة / Simply» |
| **Issuing body** | **مدينة الشارقة للخدمات الإنسانية** (Sharjah City for Humanitarian Services), UAE |
| **Tier** | **Official** — an issuing humanitarian-services body. It is **not** an ISO or GSO standard and carries **no legal force**; it is a downloadable, rule-level document, and that is exactly what it may be cited as |
| **Audience** | adults with intellectual disability and learning difficulties — the document states it was trialled «مع عينات مختلفة من الأشخاص ذوي الإعاقة الذهنية وصعوبات التعلم» |
| **Extent** | **19 numbered writing rules**, 17 formatting rules, 21 image rules; the retrieved PDF is 8 pages |

**Provenance, in the document's own words** (تقديم, p. 02): it records a specialized workshop held
«خلال الفترة من 14 أكتوبر إلى 11 نوفمبر 2020» run with an external easy-read consultancy, and states
its output as «وكمخرج رئيسي لهذه الورشة تم إعداد معايير عربية للقراءة المبسطة، تتناسب مع طبيعة اللغة
العربية وذهنية القارئ العربي». Its stated purpose: «تهدف هذه المعايير إلى تمكين المؤسسات والجهات
الخدمية من إعداد وثائق القراءة المبسطة بطريقة معتمدة وموحدة».

**Terminology — the standard names itself, and rejects the alternatives by name.** Use
**«القراءة المبسطة»**. Verbatim (p. 03): «في اللغة العربية يتم استخدام مصطلح القراءة المبسطة كترجمة
اصطلاحية لمصطلح Easy Read لأنه يعبر عن تبسيط المادة المعقدة وتحويلها إلى مادة متاحة للقراءة حسب
مستوى مهارات القراءة المتوفرة لدى كل شخص.» It rejects the literal rendering — «أما الترجمة الحرفية
للمصطلح الإنجليزي "القراءة السهلة" هو مصطلح لا يشير إلى تحويل النص إلى الطريقة المبسطة» — and
reserves «القراءة الميسرة» for assistive-technology accessibility: «قد تشير إلى القراءة التي تستخدم
التقنيات المساندة للقراءة فتجعلها ميسرة مثل طريقة برايل أو قارئ الشاشة للأشخاص المكفوفين.»
**This is the one sourced terminology decision available for `ar-easy`; getting the label wrong
signals unfamiliarity to any Arabic accessibility practitioner.**

**The 19 writing rules, verbatim** («معايير الكتابة في مستندات القراءة المبسطة», p. 04). Quoted as
printed; none is paraphrased and none is transliterated.

| # | Rule (verbatim) |
|---|---|
| 01 | «الكتابة بشكل مجرد وملموس وسهل الفهم.» |
| 02 | «الكتابة بشكل مباشر ودون استخدام المقدمات الطويلة.» |
| 03 | «تبسيط العمل أو المادة والتخلي عن التداخلات أو التعقيدات في الحدث والمضمون.» |
| 04 | «التخلي عن استخدام الصورة اللفظية والاستعارات والتشبيهات الرمزية، التي قد لا يفهمها القارئ بشكل سليم.» |
| 05 | «الكتابة بشكل موجز دون تعقيد أو إعادة للأحداث أو المعلومة مما قد يربك القارئ.» |
| 06 | «كل فكرة يجب أن تكون فقرة مستقلة وقصيرة بحيث تكون مباشرة وواضحة.» |
| 07 | «على الرغم من ضرورة تفادي الكلمات الصعبة، لابد من مراعاة استخدام لغة تناسب البالغين وتحويل الكلمات الصعبة إلى كلمات سهلة الفهم.» |
| 08 | «عند استخدام كلمات صعبة أو مصطلحات جديدة لا بد من شرحها بطريقة سهلة، وكتابة الكلمة بالخط العريض.» |
| 09 | «كل فكرة واحدة تحتاج إلى صورة توضيحية.» |
| 10 | «يجب أن تكون الجمل قصيرة. لذلك قم بتقسيم الجمل الطويلة إلى جملتين قصيرتين أو أكثر.» |
| 11 | «يجب أن تتم صياغة الجمل بصيغة المعلوم في نصوص القراءة المبسطة مثلاً نقول: "فازت فرنسا على البرازيل في المباراة النهائية" ولا نقول "تم الفوز على فريق البرازيل في المباراة النهائية".» |
| 12 | «في حال استخدام كلمة معقدة، عليك أن تشرح معناها. يمكنك القيام بذلك من خلال كتابة الكلمة الجديدة بالخط العريض كإشارة واضحة بأننا سنقوم بشرح معناها و / أو شرح معنى الكلمة في الجملة اللاحقة و / أو شرح معنى الكلمة ضمن مربع كتابة text box في الصفحة نفسها.» |
| 13 | «استخدام العناوين الرئيسية لكل الأقسام الرئيسية في الوثيقة. يجب أن يكون في أعلى الصفحة.» |
| 14 | «استخدام العناوين الفرعية لتحديد كل قسم من الأقسام الرئيسية عند تناول موضوع أو مفهوم جديد.» |
| 15 | «استخدام أسلوب النقاط المتعددة، من الأساليب الموصى بها في القراءة المبسطة، وتكون كل نقطة عن عبارة قصيرة. ويجب البدء بجملة قصيرة استهلالية قبل تعديد النقاط.» |
| 16 | «مراعاة استخدام لغة حقوقية في التعامل مع كافة فئات المجتمع، وعدم الوصم.» |
| 17 | «من الأفضل كتابة الأرقام على شكل أرقام وليس على شكل كلمات.» |
| 18 | «ضرورة استخدام علامات الترقيم بشكل صحيح، وعدم المبالغة في استخدام علامات التنصيص.» |
| 19 | «ينصح بعدم استخدام العامية ويفضل استخدام المصطلح القريب وسهل الفهم.» |

**The four load-bearing ones, and why.**

- **Rule 11 — active voice, with the construction to avoid named.** The counter-example is *not* the
  classical internal passive; it is the **modern periphrastic «تم» + مصدر** — «تم الفوز على فريق
  البرازيل» — i.e. precisely the nominalized bureaucratic register. The prescribed repair is a plain
  active clause, «فازت فرنسا…». This is a codified Arabic rule against nominalized passive
  officialese, and it is unusually specific for a document of this kind.
- **Rule 19 — no colloquial.** «ينصح بعدم استخدام العامية ويفضل استخدام المصطلح القريب وسهل الفهم.»
  Easing toward the reader's spoken variety is **closed off by the standard itself** (§8b).
- **Rule 07 — adult language.** «لغة تناسب البالغين»: simplification must not become
  infantilization. Read together with rule 16's «عدم الوصم», this is the upper wall of the corridor.
- **Rules 08 and 12 — explain in place, do not replace.** A hard or new word is set in bold and then
  explained — in the next sentence, or in a text box on the same page. **This is the kit's
  term-preservation rule, prescribed in Arabic by an Arabic standard rather than merely inherited.**

**Formatting and image rules worth carrying** (pp. 05–06, verbatim): «يجب أن يكون حجم النص 14 على
الأقل. ونستخدم الحجم 18 كمعيار.» · «يجب أن يكون حجم نص العناوين أكبر. العناوين الرئيسية بحجم 36،
والعناوين الفرعية بحجم 22.» · «يجب أن تكون الجملة الواحدة على سطر واحد.» · «كل وثيقة أو ملخص يجب أن
يكون قصيراً بحيث لا يزيد عدد صفحاته عن 20 صفحة كحد أقصى.» · «الصورة عادة توضع على الجهة اليسرى في نص
اللغة الإنجليزية، وعلى الجهة اليمنى في نص اللغة العربية.» · «قد نحتاج إلى عدد كبير من الصور، على
الأرجح للملف الواحد، يتم استخدام من 4 إلى 6 صور لكل صفحة.»

**Three honest gaps in the standard itself.**

1. ❌ **It says nothing about التشكيل.** Not one rule, in a document that is otherwise exhaustive
   about typography. That is a conspicuous silence, not an endorsement either way (§8b).
2. ❌ **It says nothing about how to address the reader.** No rule on أنت / أنتم or on gender. Rules
   10 and 12 use masculine second person («قم بتقسيم», «عليك أن تشرح») — but those address the
   *writer*, not the reader (§8e).
3. ⚠ **Its own references page (p. 08) is listed in the table of contents but absent from the
   retrieved file**, so the standard's evidential basis could not be read.

**What the correction does *not* change — four established absences.**

| Checked | Result |
|---|---|
| **ISO 24495-1 national adoption in Arabic** | ❌ **Established absence.** The plain-language federation's own adoption list carries no Arab country and no Arabic; two GCC national stores that are machine-readable list the standard as a foreign publication **for sale in English**, with no national prefix — the signature of "not adopted, not translated". ⚠ The Saudi, UAE, and Egyptian catalogs were never directly queried (§8g) |
| **A Simple-Arabic Wikimedia project** | ❌ **Established absence, and structurally blocked.** The site-matrix API returns seven `ar` projects, none simplified; the only Arabic siblings in the matrix are **dialect** wikis (`ary`, `arz`). Language-proposal policy excludes "different written forms of the same language" |
| **Inclusion Europe easy-to-read standards in Arabic** | ❌ Arabic appears on neither language list; the document is titled for **European** standards and makes no claim beyond them |
| **A plain-language remit at the Arabic language academies** | ❌ / ⚠ The Cairo academy's stated purposes are language preservation, a historical dictionary, and dialect study; its **تيسير** tradition is about simplifying the *teaching of grammar*, a different thing. Other academies were unreachable — absence not established |

Two near-misses worth naming so nobody re-finds them as rule sources: an international
disability-inclusion body's guidelines **exist in Arabic**, but that is an easy-read *output*
produced under review, not a rule set ❌; and the **official UAE Arabic writing guide** is a protocol
and orthography manual — rulers' titles, dates, phone numbers, hamza spelling — with **no section on
plain language, sentence length, reader address, passive voice, or vocabulary difficulty** ❌. The one
directly usable rule it carries is on tashkeel (§8b).

**How `ar-easy` relates to the kit's base rules.** Where the standard is **more specific** than the
kit's base plain-language rules in
[accessibility-workflow → "Plain / simplified-language rules"](../accessibility-workflow.md), **the
standard's rules apply** — one sentence per line, one idea per paragraph, active voice, bold-plus-
explain for hard words, one illustration per idea, ≥14 pt body text. Where it is silent — the kit's
~8–12-word working sentence target among them — `ar-easy` **inherits the kit's rules**, and the word
count stays **the kit's figure**: the standard says «يجب أن تكون الجمل قصيرة» and names **no number**,
so no word count may be attributed to it.

### 8b. The axis — vocabulary, and it is the only dimension that never stops mattering

**Tier: Academic.** The best-evidenced answer comes from the annotation guidelines of a
fine-grained Arabic readability corpus — **69,441 sentences (1M+ words) labeled across 19 levels,
from kindergarten to postgraduate** — whose scope is stated as *"Modern Standard Arabic (MSA) as
used in Egypt, the Gulf, and the Levant, leaving variations in other regions for future work."*

It defines six textual dimensions **and states which are usable at which levels**. That
qualification is the whole finding:

| Dimension | What the guidelines say, verbatim | Reach |
|---|---|---|
| **Vocabulary** | *"Central at all levels. Overlapping dialect and MSA vocabulary appear at easier levels; technical terms are introduced at harder levels. Arabized foreign words are treated as part of the language, while non-Arabic script is excluded."* | **all 19 levels** |
| Number of words | *"Counts unique printed words (ignoring punctuation and diacritics). Used only up to level 11-kaf (max 20 words)."* | stops at 11 |
| Morphology | *"Simpler forms appear at lower levels (e.g., present tense before past, singular before plural). Used up to level 13-mim."* | stops at 13 |
| Syntactic structures | *"Tracks sentence complexity, from single words (1-alif) to complex constructions. Used up to level 15-sin."* | stops at 15 |
| Orthography & phonology | *"Focuses on word length (syllables) and letters like Hamzas. Final diacritics are ignored (words read in waqf)…"* | — |
| Ideas & content | *"Evaluates needed prior knowledge, symbolic unpacking, and conceptual linking."* | all levels |

> **→ The axis, stated so it can be acted on. Vocabulary is the dominant lever, and above the
> mid-levels it is very nearly the only one.** Word count stops counting at level 11 of 19,
> morphology at 13, syntax at 15; everything above 15 is separated by **lexis and conceptual load
> alone** — the guidelines' own per-level reasoning for the top five levels reads *"Specialized
> vocabulary…"*, *"Specialized and uncommon vocabulary"*, *"Heritage vocabulary familiar to a novice
> specialist"*, *"Specialist vocabulary, symbolic poetic ideas requiring prior knowledge"*.

**Sentence length is a correlate, not the criterion.** The same source reports *"average sentence
length by level, which correlates strongly with readability (Pearson r=81%)"* — and states the
design principle against leaning on it: *"Objective Standardization defines levels using consistent
linguistic and content-based criteria, avoiding overreliance on surface features like word or
sentence length."* Short sentences remain a **rule of the standard** (§8a rules 06/10); they are not
what makes a text easy.

**Diglossia is why this axis is narrower in Arabic than in a European plain language.** Ferguson's
definition, quoted from the academic source: the superposed variety is *"learned largely by formal
education and is used for most written and formal spoken purposes but is not used by any section of
the community for ordinary conversation."* A plain German or English text can move toward the
reader's home language. **A plain Arabic text cannot, without ceasing to be MSA** — and the standard
closes that door explicitly (rule 19).

**Both sources resolve the tension the same way, and it is not by going dialect.** The readability
guidelines say *"Overlapping dialect and MSA vocabulary appear at easier levels"* — the lever is the
**shared MSA∩everyday-speech lexis**: words that are simultaneously good MSA and recognizable from
spoken life. Not dialect grammar; dialect-overlapping *vocabulary*. **That intersection is the
operational definition of "plainer Arabic" in this guide.** ⚠ It is also where §8d's sharpest
caution applies.

**Etymology is not the axis.** *"Arabized foreign words are treated as part of the language"* — a
معرَّب loan written in Arabic script counts as ordinary vocabulary and is **not** penalized as
foreign; only Latin-script material is excluded outright. What difficulty tracks is **technicality**:
*"technical terms are introduced at harder levels."*

**التشكيل is an open design decision, not a settled rule.** Four positions, all sourced, all
different:

1. The readability guidelines **deliberately do not rely on diacritics**: *"While diacritics can aid
   comprehension, we assess readability without relying on them… In ambiguous cases, we choose the
   simpler meaning, e.g., هذه سلطة بدون خيار is read as 'a salad without cucumbers' not 'an authority
   without choices'."*
2. A children's-book leveling framework cited within it treats **"use of diacritics"** as one of ten
   key design criteria — alongside, notably, **"vocabulary and its proximity to dialects"**.
3. The **official UAE writing guide** (Official): «لا يشترط إضافة علامات التشكيل كاملة في النصوص،
   ولكن يجب ذلك عند اقتباس آية قرآنية، كما يجب إضافة التنوين في مواقعها الصحيحة.»
4. The **adult easy-read standard is silent** (§8a).

⚠ **Reading of that spread, marked as a reading:** full vocalization is a children's-book and
language-learning convention; the adult standard spends its entire "help the reader" budget on
**images** instead (21 image rules, 4–6 images per page). Live graded Arabic news for learners
*does* vocalize fully — its simplified article opens «فِي غَزَّةَ حَربٌ صَعبَةٌ مُنذُ أَكثَرَ مِنْ
سَنَتَينِ.» Whichever way `ar-easy` goes, the evidence supports it, which means the choice has to be
made on a reader model and **tested, not assumed** (§8g).

**The word pairs — 14 defensible rows.** Tier: **Academic**, from a manual Arabic simplification
program: a 5-level, 40K-lemma readability lexicon, its thesaurus, and the only manually simplified
Arabic parallel corpus, in which professional linguists rewrote 15 novels down two readability
levels. Register labels marked *literary* come from an open collaborative dictionary (**Community**
tier — a checkable register claim, not an authority).

*Group 1 — both sides level-annotated.*

| formal MSA | plainer MSA | sense | evidence | derivation |
|---|---|---|---|---|
| عَسير | صَعْب | difficult | dictionary register label *literary*; the plain member sits at **Level II** (grades 2–3) in the readability lexicon | corpus-derived |
| لَئِنْ | إذا | if | **Level IV** against **Level II** — two levels apart | corpus-derived |
| لَدُنْ | عِنْدَ / لَدى | at, by, with | **Level V** against **Level III** | corpus-derived |
| قابِليّة | قُدْرة | ability, capacity | thesaurus figure, synonyms of طاقة: **Level-4** against **Level-2** | corpus-derived |
| رَبَضَ | جَلَسَ | crouched → sat | worked word-level example: the L5 form is rewritten to جلس at Level 4 | corpus-derived |
| ظَعَنَ | سافَرَ / اِرْتَحَلَ | to depart, travel | dictionary label *literary* plus its own synonym list; **Level V** | corpus-derived |
| أنَّى | أينَما / حَيْثُما | wherever | dictionary synonym list; **Level V** | corpus-derived |

*Group 2 — observed substitutions in the parallel corpus.* These are what professional simplifiers
actually **did**, level 5→4→3, with the gloss line making the direction unambiguous.

| formal MSA | plainer MSA | sense | evidence | derivation |
|---|---|---|---|---|
| شَنّ | بَدْء | launching → starting | Level-5 → Level-4 | corpus-derived (observed) |
| بادَرَ (يبادرون) | أسْرَعَ (يسرعون) | take to → hurry to | Level-4 → Level-3 | corpus-derived (observed) |
| غارة (الغارات) | هُجوم (الهجمات) | raid → attack | Level-4 → Level-3 | corpus-derived (observed) |
| فَتْك | قَتْل | slaughter → killing | Level-4 → Level-3 | corpus-derived (observed) |
| رُقْعة | مِنْطَقة | area, domain | Level-4 → Level-3 | corpus-derived (observed) |
| تَمَدُّن | تَطَوُّر | civilization → progress | Level-4 → Level-3 | corpus-derived (observed) |
| مُضارَعة (ضارَعَ) | تَشَبُّه (شابَهَ) | emulate → imitate | Level-5 → Level-4 | corpus-derived (observed) |

⚠ **Transcription caveat that travels with group 2.** These substitutions are printed as small
colored inline Arabic inside a PDF table. **Two further substitutions in that same table were
deliberately dropped rather than guessed** because the Arabic could not be read reliably. Every row
above deserves a second pair of eyes against the source PDF before it goes into production (§8g).

*Group 3 — the hard side is level-annotated, the plain side is a proposal.* Usable as **"this word
is hard"** evidence only; the right-hand column is **not** a citation.

| formal MSA (leveled) | proposed plainer MSA | sense | level | derivation |
|---|---|---|---|---|
| هَيْضَة | الكوليرا | cholera | Level V | hard side corpus-derived · replacement editorial |
| أَدَمَة | جِلْد | epidermis → skin | Level V | hard side corpus-derived · replacement editorial |
| نَكَثَ | نَقَضَ / أخْلَفَ | to break a promise | Level IV | hard side corpus-derived · replacement editorial |
| طُمَأْنينة | راحة / هُدوء | tranquility | Level IV | hard side corpus-derived · replacement editorial |
| مَبْعَث | سَبَب | cause, factor | Level V (rank 9,789) | hard side corpus-derived · replacement editorial |
| كادِر | مُوَظَّفون / عامِلون | cadres, staff | Level V (rank 3,761) | hard side corpus-derived · replacement editorial |
| ثَكَل | حُزْن | bereavement → grief | Level V (rank 14,252) | hard side corpus-derived · replacement editorial |
| إجْراء | خُطْوة | procedure → step | Level IV (rank 375) | hard side corpus-derived · replacement editorial |

*Group 4 — synonymy sourced, difficulty not.* No readability evidence that the left side is harder.

| formal MSA | plainer MSA | sense | derivation |
|---|---|---|---|
| اِبْتاعَ | اِشْتَرى | to buy | dictionary synonymy only — **editorial** as a difficulty claim |
| ثَمَّةَ | هُناكَ | there is | dictionary synonymy only — **editorial** as a difficulty claim |

*Group 5 — a craft-tier UI register list.* Three explicit avoid→prefer swaps from a large software
vendor's Arabic localization style guide, printed under a heading about avoiding an unnecessarily
formal tone: **كذلك → أيضاً** · **اللاحق → التالي** · **يتسنى لك → يمكنك**. Tier: **craft**. The
third is the same formal-periphrasis→plain-modal move the level data shows for other lemmas.

*Group 6 — carried over from this guide's earlier pass.* ⚠ **Weak provenance — a corporate style
guide and a commercial school blog; no corpus and no register-marking dictionary stands behind any
row.** Kept because they are plausible editorial swaps, tiered so nobody promotes them:
**إجراء → عمل / خطوة** · **متاح → موجود / يمكن** · **يُرجى → من فضلك** · **يعرض → يبيّن / يظهر** ·
**يُرجى إدخال → اكتب** · **يُرجى التحقق → تأكد** · **البيانات → المعلومات** ·
**المستخدم النهائي → المستخدم** · **يُستحسن → الأفضل** · **يوصى بـ → نوصي بـ**. One row is
independently corroborated: **إجراء → خطوة** also appears in group 3 with the formal member
level-annotated. The rest are not. Two carry recorded conflicts — see §8d.

### 8c. The corpus attempt — the design, and why 3 articles per level killed it

**What was sought, and why this one was worth trying.** A graded-news publisher puts **the same
article at three reading levels on one page** — المستوى الأول / الثاني / الثالث — under the **same
media network** as its standard-register news site («جميع الحقوق محفوظة © 2026 شبكة الجزيرة
الاعلامية» on both). **That is the cleanest design in this whole kit**: not two publications
compared, but one article at three levels — same author, same facts, same house style, **only the
level varies**. Nothing else found for Arabic comes close to holding that many variables constant.

**What actually came back: 3 articles per level, roughly 3,000 characters each.** That is the entire
yield.

**Why it failed — enumeration, not permission.** Nobody declined anything; the text is simply not
reachable in bulk.

- **No sitemap and no feed on the graded side.** `/sitemap.xml`, `/sitemap_index.xml`, `/ar/rss.xml`
  and `/ar/articles` all returned **404**, and the site's access-policy file carries **no sitemap
  directive** at all.
- **The listing pagination exposes almost nothing.** A category listing returned **one** article;
  its `?page=1` returned **"No articles found"**.
- **The ID space is sparse, and brute force was tried and lost.** Article URLs come in two shapes,
  `/ar/articles/pages/<id>` and `/ar/node/<id>`, with observed IDs around **20744–22915**. An earlier
  sweep across that space returned **2,233 not-found responses for 3 hits**.

**Why nothing from it may be quoted.** Three articles per level is **too small to carry any claim** —
not a thin signal, no signal. **No frequency, ratio, count, or corpus size from this attempt appears
anywhere in §8**, and §8d therefore reverses nothing on measurement. If a later pass finds this
attempt referenced somewhere as evidence, it is being misread.

**What would make it work.** In descending order of realism: a **publisher export or an API key**
for the graded side; an **enumerable index** (a sitemap, a feed, or working listing pagination) if
the publisher ever adds one; or a **licensed or manually agreed** route. What would *not* work is a
wider brute-force sweep — the 2,233-to-3 ratio is the measurement that settles that, and repeating
it would burn a lot of requests for the same three articles. **This remains the best corpus
opportunity for Arabic and should be the first thing a later pass retries.**

**Other pairs checked, so the negative is inherited rather than repeated.**

| Candidate | Result |
|---|---|
| A UAE media group's children's magazine + its adult daily — **same parent company, confirmed on the publisher's own brand pages** | ❌ **Dead in practice.** The magazine's domain now **301-redirects to a video streaming catalog** (the publisher's own migration campaign tag is on the redirect). The only surviving digital edition is a **paywalled page-image PDF replica** with no extractable article HTML |
| A Kuwaiti cultural council's adult magazine + its children's title — one publisher, exactly the right shape | ⚠ **Untested. Every fetch returned 403**, in a pattern that looks like generic bot-blocking rather than paywalling. **The best untested candidate that remains** |
| A major Egyptian paper + its children's title | ⚠ **403**; and the shared-publisher claim is Community-tier only, unverified |
| Two further children's magazines | ❌ Both **ceased print publication**, no successor web article site |
| An Omani daily | ❌ Renders, but **no children's section**; the historical supplement is not online |
| An independent graded, vowelled Arabic news site | ❌ Renders and is graded, but **fails the single-publisher requirement** — no adult sibling title |
| The adult daily above, taken alone | ✅ **Enumerable** — its sitemap index carries **456 monthly sitemaps spanning 2003–2026**, ~500 URLs per month, with unescaped Arabic in the URLs. **Standard register only**, so it is half a pair, not a pair |

> ⚠ Every **403** above means *not retrievable by plain automated fetch*. **No header-spoofing and no
> browser automation were attempted, and none should be** without a licensed or manually agreed
> route. 403 is not proof of inaccessibility, and it is not an invitation either.

**Nothing was lost by this failure — and that is a measured statement, not consolation.** A
three-article-per-level corpus could have supported a handful of frequency rows. What §8 has instead
is a **19-rule Official standard written for Arabic** (§8a) and a **19-level, 69,441-sentence
readability annotation plus a manual simplification corpus** (§8b) — an issuing body and a leveled
lexicon, both of which outrank any count that pair could have produced.

### 8d. 🔴 The do-NOT-simplify list

**No row here is a measured reversal, and none was invented to fill the gap.** In the measured guides
of this kit, §8d is where a corpus count deletes or inverts a word pair. **Arabic has no count**
(§8c), so this list does three narrower things: it marks what §8b's tables do and do not rest on, it
carries one cross-language caution as a reason to verify, and it **records a conflict between that
caution and the standard's own rules rather than resolving it**.

| Do **not** do this | Why |
|---|---|
| ~~assume the learned, literary, or borrowed word is the harder one~~ | **⚠ Cross-language finding, requiring local verification — not a fact about Arabic.** Across the languages in this kit where a plain-against-standard count *was* run, one result recurs: **the learned or borrowed word is not reliably the harder one**, and a "simplification" frequently swaps a common word for a **rarer** one, making the text harder rather than easier. **Rarity, not etymology, is what makes a word hard.** Arabic has one source pointing the same way — *"Arabized foreign words are treated as part of the language"*, and difficulty tracks *"technical terms"*, not origin (§8b) — but **no Arabic count exists** to confirm or refute the finding for Arabic. Verify each swap with a native reader |
| ~~resolve the conflict between that caution and rules 07 / 08 / 12 / 19~~ | 🔴 **Recorded, not resolved.** The standard **mandates substitution**: rule 07 requires «تحويل الكلمات الصعبة إلى كلمات سهلة الفهم», rule 19 «يفضل استخدام المصطلح القريب وسهل الفهم». The cross-language caution says substitution is exactly where the damage happens. **Both are on the table and neither can win here**, because no Arabic measurement exists. What reconciles them *in the standard's own text* is rules 08 and 12 — bold the hard word and **explain** it — which is a substitution-free route to the same goal. **Prefer the explain-in-place route; treat every replacement as a hypothesis about frequency that nobody has tested** |
| ~~read any group-3, 4, 5, or 6 row as measured~~ | Group 1 and group 2 (14 rows) are **corpus-derived** — both members level-annotated, or the substitution observed in a manual simplification corpus. **Group 3's replacements are editorial proposals**, sourced only on the hard side. **Group 4 is dictionary synonymy with no difficulty evidence. Group 5 is craft. Group 6 is weak-provenance editorial.** Never cite a group-3-to-6 row as evidence, and never let a reviewer promote one because it appears in a table |
| ~~ease toward dialect because "overlapping dialect and MSA vocabulary appear at easier levels"~~ | 🔴 **The naive reading of that line is refuted by the same research program.** The readability lexicon's own annotator table shows annotators from Egypt, the Levant, and the Gulf disagreeing **by up to 4 levels** on dialect-adjacent words such as فَرُّوج and كُبَّة. **Dialect-proximate vocabulary is not reliably easier — it is easier *for some regions*.** And rule 19 forbids العامية outright. The lever is the MSA∩everyday intersection (§8b), which is narrower than "words that sound spoken" |
| ~~simplify by word length alone~~ | Same failure one step down: a shorter word is not automatically a commoner one. The readability guidelines say so directly — levels are defined *"avoiding overreliance on surface features like word or sentence length"* |
| ~~swap the technical term for a folksy stand-in~~ | **Binding, and for once it is prescribed rather than inherited.** Rules 08 and 12: keep the term, set it in bold, then explain it in the next sentence or in a text box. Keep **الذكاء الاصطناعي**, then «هذا يعني: …», then a concrete example. With no corpus, an explanation rests on a stated rule; a replacement is a guess |
| ~~loosen the register in the name of friendliness~~ | Rule 07 demands «لغة تناسب البالغين» and rule 16 forbids stigmatizing; rule 19 forbids العامية. **The corridor has both walls sourced** — you may not ease down toward a children's register, and you may not ease sideways into dialect. That is narrower than European easy-language traditions enjoy, and it is the defining constraint on `ar-easy` |
| ~~use المصدر / a verbal noun to dodge gendered address, without noticing the cost~~ | ⚠ **Recorded conflict.** The craft localization guide recommends the gerund/مصدر precisely as a gender-neutrality device (§8e) — and **nominalization is exactly what rule 11 attacks** in «تم الفوز». Neither source acknowledges the trade-off. Use §4's rephrasing strategy where it does not nominalize; where it does, you are buying neutrality with the construction the standard tells you to remove |
| ~~apply group 6's **يُرجى → من فضلك** row mechanically~~ | ⚠ **Craft reading, flagged not settled.** The same craft guide names **يُرجى** as one of its gender-neutral frames, while **من فضلك** carries the gendered second-person clitic that §4's primary strategy exists to avoid. The row is not wrong, but it interacts with the address decision and must not be run as a find-and-replace |
| ~~assert that SVO is easier than VSO, or that shorter إضافة chains read easier~~ | ⚠ **Unsourced.** **No source was found measuring word order, genitive-chain depth, or و/ف coordination against Arabic comprehension.** §4 records SVO as clear and safe for platform copy — that is a **style** judgment and it stands; do **not** promote it into an `ar-easy` readability rule, and do not invent a chain-depth limit |
| ~~treat tashkeel as a settled easy-read rule in either direction~~ | Four sourced positions, all different (§8b), and the adult standard is silent. Full vocalization is neither prescribed nor forbidden here. Decide it on a reader model and test it |
| ~~claim conformance to ISO 24495-1, a GSO standard, or "the Arabic plain-language standard"~~ | ❌ There is **no Arabic adoption of ISO 24495-1** (§8a), and the standard that *does* exist is issued by a humanitarian-services body **without legal force**. Cite it as what it is: a codified, Official-tier Arabic easy-read rule set. Anything stronger is a false claim |
| ~~quote a number from the corpus attempt~~ | Three articles per level (§8c). No figure from it appears in §8, and none may be added |

> **→ The rule that follows.** For Arabic, **the structural and typographic rules are the strong
> evidence and the word table is the weak end** — the reverse of the measured guides in this kit,
> because here the issuing body exists and the corpus does not. Apply §8a's rules with confidence,
> apply group 1 and 2 as tiered hints, and treat every other row as something a native reviewer has
> yet to see.

### 8e. 🔑 The address decision — the standard is silent, so §4 carries it

> **Decision, recorded so that nobody "fixes" it: `ar-easy` uses the §4 strategy unchanged — MSA
> formal-neutral, **rephrase to avoid gendered second-person address** as the primary route, with
> **masculine as the conventional fallback** only where a gendered form is unavoidable. `ar-easy`
> does not open a second addressing strategy "for friendliness".**

**What is sourced, and what is carried over — the split, stated plainly.**

| Question | Where the answer comes from |
|---|---|
| **Which pronoun / gender to address the reader with** | ❌ **The standard says nothing.** No rule on أنت / أنتم and none on gender. Its masculine second-person forms («قم بتقسيم», «عليك أن تشرح») address the **writer**, not the reader — they are not a ruling on reader address. **→ §4's recorded decision carries it, on §4's grounds** |
| **How formal / how warm the register may be** | ✅ **The standard rules on this.** Rule 07 «لغة تناسب البالغين» — adult language; rule 16 «عدم الوصم» — no stigmatizing; rule 19 «ينصح بعدم استخدام العامية». **Informality is permitted at the level of word choice and sentence rhythm; it is forbidden at the level of variety and at the level of dignity** |
| **Whether to use the bare imperative or a verbal-noun frame** | ⚠ **craft, and self-contradictory in its own source** (below) |
| **Whether honorific address (حضرتك / سيادتك) is available** | ⚠ **Weakly sourced hypothesis, not a finding** (below) |

**§4's grounds, restated because they are the operative ones.** §4 records the register/gender
decision as a **project decision, taken and recorded** — not a ruling by any language authority, and
there is none to appeal to. §8 adds **no evidence in either direction** on pronoun choice, and with
no corpus (§8c) there is no frequency evidence to appeal to either. **Treat §8 as silent on
addressing; hold §4 steadily.**

**The craft layer, tiered as craft.** A large software vendor's Arabic localization style guide is
the de-facto Arabic UI register reference and says: address the reader in the **second person**
directly; do **not** render possessive "your" as **الخاص بك** (*"not preferred in Arabic"* — use كاف
الخطاب on first occurrence, or skip it); and prefer the **bare imperative** over the قم بـ + مصدر
periphrasis — *"you can say: افتح التطبيق instead of قم بفتح التطبيق."*

⚠ **That guide contradicts itself, and you should know before copying it.** One section prescribes
the bare imperative; another, on avoiding gender bias, says *"When writing instructions, avoid the
imperative form. Instead, use a gerund"* — both in the same document, unreconciled by any source.
Its documented gender-neutral devices are worth having regardless: plural noun forms for
generalization (الأشخاص، الطلاب، الأفراد), both-gender pairs where a position is named
(معلم ومعلمة), the frames يجب / يُرجى / يمكنك, and collective nouns —
**المشاركون / المشاركات → الحضور** · **موظفون / موظفات → فريق عمل** ·
**العاملون / العاملات → القوى العاملة / طاقم العمل** · **مندوب مبيعات → فريق المبيعات** ·
**المصنّع → الشركة المصنّعة / الجهة المصنّعة** · **دار رعاية المسنين → دار رعاية كبار السن**.
Note the cost recorded in §8d: the gerund route buys neutrality with the nominalization rule 11
removes.

⚠ **حضرتك / سيادتك — treat as unavailable, on a hypothesis rather than a finding.** Three attempts
to fetch a citable characterization returned **403**, and one paper could not be read past its title
page. The only signal in hand is that a teaching resource locates **حضرتك** in **Egyptian Arabic** —
i.e. عامية. **If that holds, it is closed off for an MSA-based variant by rule 19.** Recorded as a
strong hypothesis; do not cite it as established, and do not reach for these forms meanwhile.

### 8f. What `ar-easy` is built on, in order of leverage

1. **The standard's sentence and paragraph rules — the main lever, and the only part with an issuing
   body.** Rule 10 (split long sentences into two or more short ones), rule 06 (one idea = one short
   standalone paragraph), rule 15 (bulleted points, each a short phrase, introduced by a short lead
   sentence), plus the layout rule that physically enforces it — «يجب أن تكون الجملة الواحدة على سطر
   واحد.» **Where these are more specific than the kit's base rules, they win** (§8a).
2. **Active voice, aimed at the construction the standard names.** Rule 11: kill the **«تم» + مصدر**
   periphrasis and write a plain active clause. This is the single highest-yield structural edit in
   bureaucratic Arabic, it is codified, and it shortens the sentence as a side effect — which is why
   it outranks every word table.
3. **Explain in place instead of replacing.** Rules 08 and 12: set the hard or new term in bold, then
   explain it — next sentence, or a text box on the same page. Keep **الذكاء الاصطناعي**, then
   «هذا يعني: …», then a concrete example. **This is the kit's term-preservation rule in its Arabic
   form, and here it is prescribed rather than inherited** (§8a, §8d).
4. **Illustration, carried at the weight the standard gives it.** Rule 09 — «كل فكرة واحدة تحتاج إلى
   صورة توضيحية» — backed by 21 image rules and 4–6 images per page. The standard invests its whole
   reader-support budget here rather than in tashkeel, and a text-only `ar-easy` is not what this
   standard describes.
5. **Register discipline, both walls.** Rule 07 (adult language), rule 16 (no stigmatizing), rule 19
   (no العامية), plus §4's register/gender strategy held steadily (§8e). Simplified is not childish
   and not dialectal.
6. **Vocabulary, last and as tiered hints.** The MSA∩everyday intersection (§8b), worked through
   group 1 and group 2 only; groups 3–6 are hints for a native reviewer, never a find-and-replace
   (§8d).
7. **Typography and layout from the standard's own numbers.** Body text ≥ 14 pt with **18 as the
   working standard**; headings 36, subheadings 22; simple non-decorative Arabic and Latin faces;
   images on the **right** in Arabic text; documents kept short. ⚠ **Craft note, offered as a reason
   rather than a rule:** these are print/PDF document-design rules, so a page-count limit does not
   map onto a web platform unchanged — the point sizes, the one-sentence-per-line rule, and the image
   side do map, and should be honored.
8. **The kit's base rules where the standard is silent**, from
   [accessibility-workflow](../accessibility-workflow.md) — say what *is* rather than what is not,
   the same word for the same thing, a one-line "what is this" opener, a consistent literal tone. The
   kit's ~8–12-word sentence target is **the kit's figure**: the standard says «قصيرة» and gives no
   number. Numbers as digits per rule 17 — «من الأفضل كتابة الأرقام على شكل أرقام» — with **one digit
   system per context** per §5/§11, and the RTL mechanics of §3 unchanged.

### 8g. What is still open

1. **The corpus route is the biggest single gap, and it has a named first move.** The graded-news
   publisher of §8c remains the best design available for Arabic — same article, three levels, one
   page. What is needed is a **publisher export, an API key, or an enumerable index**; a wider
   brute-force sweep is ruled out by the 2,233-to-3 result. Second move: the Kuwaiti adult +
   children's pair, **untested behind 403s**, which is the right shape and has never actually been
   read.
2. **The standard's own references page is missing from the retrieved PDF** (§8a), so its evidential
   basis is unverified. ⚠ Its launch report is **403**, so the launch date and launching official are
   **search-snippet level and are not asserted here**; the workshop date (Oct–Nov 2020) *is* in the
   standard itself and is quoted from it.
3. **No Arabic comprehension study was located.** Every level claim in §8b is a **readability
   annotation** by trained annotators, not a reader test. Nothing in this section has been tested on
   the readers `ar-easy` is written for.
4. **The leveled lexicon is license-gated**, its live thesaurus refused connection, and the obvious
   Arabic dictionary site returned **403** — so there is **no bulk word-level data to work from**
   without applying for the academic license. That application is the cheapest available upgrade to
   §8b.
5. **Two substitutions from the parallel corpus were dropped as unreadable** rather than guessed, and
   the seven retained ones warrant a visual re-check against the source PDF (§8b).
6. **No Arabic plain-language wordlist exists in reachable form.** Searches for «اللغة السهلة»،
   «تبسيط النصوص»، «الكلمات الصعبة ومرادفاتها السهلة» returned popular "hardest words" listicles with
   no substitution guidance. **There appears to be no published Arabic equivalent of a
   plain-language substitution list.** That is a real gap, not a search failure.
7. **No source on VSO/SVO, إضافة chain depth, or و/ف coordination against comprehension** (§8d).
8. **No source testing academy-coined native terms against naturalized loanwords** for reader
   difficulty. Given §6's glossary work, this is the open question with the most direct effect on
   terminology policy.
9. **Tashkeel is an open design decision** (§8b) and should be **tested, not assumed**.
10. **حضرتك / سيادتك rest on three 403s** (§8e); the Egyptian-vernacular placement is a hypothesis.
11. **Three national standards catalogs (Saudi, UAE, Egyptian) were never directly queried**, and
    the UAE government's own **Arabic content guide** — cited as a source by the official writing
    guide but absent from its publisher's public resources page — **could not be located**. That is
    the most likely place a UAE government plain-language rule set would live.
12. **§8 has had no native-speaker review.** The verbatim Arabic above is quoted, not composed, which
    limits the damage — but the tiering of groups 3–6, and every editorial replacement in them, needs
    a native reviewer before any of it becomes a rule.

Sources: **The standard (Official)** —
<https://www.schs.ae/storage/app/media/easy-read/EasyReadStander-A.pdf> ·
<https://www.schs.ae/en/easy-read> · **Readability annotation & levels (Academic)** —
<https://arxiv.org/pdf/2410.08674> · **Manual simplification lexicon, thesaurus and parallel corpus
(Academic)** — <https://aclanthology.org/2020.lrec-1.373.pdf> ·
<https://aclanthology.org/2020.coling-demos.11.pdf> ·
<https://aclanthology.org/2024.lrec-main.1398.pdf> · <https://aclanthology.org/2024.arabicnlp-1.5.pdf> ·
**Diglossia (Academic)** — <https://ccat.sas.upenn.edu/~haroldfs/messeas/diglossia/node3.html> ·
**Gendered address (Academic)** — <https://arxiv.org/abs/2110.09216> ·
**Register labels & synonymy (Community — an open collaborative dictionary, not an Arabic lexical
authority)** — <https://en.wiktionary.org/wiki/عسير> · <https://en.wiktionary.org/wiki/لدن> ·
<https://en.wiktionary.org/wiki/ظعن> · <https://en.wiktionary.org/wiki/أنى> ·
<https://en.wiktionary.org/wiki/ربض> · <https://en.wiktionary.org/wiki/غارة> ·
<https://en.wiktionary.org/wiki/فتك> · <https://en.wiktionary.org/wiki/رقعة> ·
<https://en.wiktionary.org/wiki/تمدن> · <https://en.wiktionary.org/wiki/ضارع> ·
<https://en.wiktionary.org/wiki/هيضة> · <https://en.wiktionary.org/wiki/نكث> ·
<https://en.wiktionary.org/wiki/طمأنينة> · <https://en.wiktionary.org/wiki/ثكل> ·
<https://en.wiktionary.org/wiki/ابتاع> · <https://en.wiktionary.org/wiki/ثمة> ·
**UI register & gender-neutral devices (craft)** —
<https://download.microsoft.com/download/5/6/d/56d1774f-ac3f-4ad9-80af-a6dfd5df419d/ara-sau-StyleGuide.pdf> ·
**Established absences (Official)** —
<https://www.iplfederation.org/standard-translations/> · <https://www.iplfederation.org/iso-standard/> ·
<https://bsmd.moic.gov.bh/store/standards/iso:pub:std:IS:78907/ISO%2024495-1:2023> ·
<https://meta.wikimedia.org/wiki/Language_proposal_policy> ·
<https://easy-to-read.inclusion-europe.eu/european-standards/> ·
<https://www.inclusion-europe.eu/easy-to-read-standards-guidelines/> ·
**Tashkeel, official position (Official)** —
<https://assets.u.ae/api/public/content/099a857080a643859f7ad902f2b3c435?v=62991e2b> ·
<https://tdra.gov.ae/ar/Pages/Resources> ·
**Corpus attempt (§8c)** — graded article and publisher identity at
<https://learning.aljazeera.net/ar/articles/pages/22915> and
<https://learning.aljazeera.net/en/pages/about-us>; enumeration checked at
<https://learning.aljazeera.net/robots.txt> (no sitemap directive), against
<https://www.aljazeera.net/robots.txt> and <https://www.aletihad.ae/robots.txt>; publisher-ownership
checks at <https://www.admn.ae/ar/brand/4197609/ماجد> and <https://www.admn.ae/ar/brand/4197243/الاتحاد>.
**No corpus was built and no count was produced** — 3 articles per level, roughly 3,000 characters
each, is recorded in §8c so that a later pass inherits the negative instead of repeating it. ·
**Carried over from this guide's earlier pass (weak provenance, group 6)** —
<https://www.aramco.com/-/media/publications/books/arabic_style-guide-v2.pdf> (corporate style
guide) · <https://www.arabacademy.com/how-to-write-arabic-learn-letters-styles/> (commercial school
blog) · [accessibility-workflow](../accessibility-workflow.md) ·
[translation-quality](../translation-quality.md)

---

## 9. Regional variation

**Which standard the project targets.** The written standard for educational content is **MSA**,
shared across the Arab world; **regional dialects** are for informal chat, user-support messages,
community features, and localized examples where a country-specific audience is explicit.
Differences across regions include **vocabulary, some spelling preferences, number usage, and
currency naming**, but the **script stays Arabic and the formal orthography is shared**. This
mutual written standard is why a single neutral MSA build serves a pan-Arab audience.

**Neutrality strategy (explicit).**

1. **Register:** MSA, formal-neutral (per the recorded §4 decision). Avoid **dialectal
   markers and local idioms** unless the audience is specifically local.
2. **Vocabulary:** prefer unmarked standard MSA terms; avoid region-marked synonyms where an
   unmarked option exists.
3. **Community/religious formulas:** neutral educational content **generally omits or minimizes**
   sect- or region-associated religious formulae, except in quotations, religious-studies
   content, or culturally specific examples. (The specifics of *which* formulae mark which
   community, and exactly how neutral editing handles them, are **⚠ unverified** — the research
   flagged this as unsourced.)
4. **Currency & market specifics:** parameterize per deployment (§5) rather than hard-coding.

For pan-Arab platforms, standard MSA with a straightforward register and no community-identity
markers is the safest choice because it **maximizes comprehension across regions**.

Sources: (the "neutral editorial avoids dialectal markers" claim was research-attributed to a
dialectology journal article that cannot support it — see §2 provenance caveat; the claim is
kept as plausible general practice, weak provenance)
<https://www.arabacademy.com/how-to-write-arabic-learn-letters-styles/> (commercial — weak)

---

