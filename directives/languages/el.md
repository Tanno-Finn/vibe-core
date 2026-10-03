<!-- base -->
# lang-el — Greek (Ελληνικά) — language guide

> **Setup & sources live in [`el.setup.md`](el.setup.md)** — §2 authorities &
> primary sources, §3 script & typography, §10 technical integration, §11 verification
> additions. Those four sections are read once, when the language is added or verified;
> this file holds the six a translator needs on every job. Section numbers are shared
> across both files, so a cross-reference like "§3" always means the same section.


**Native / English name:** Ελληνικά / Greek (Modern Standard Greek, Νέα Ελληνική).
**BCP 47 code (base):** `el`.
**BCP 47 code (simplified variant):** `el-easy` — the kit's `<code>-easy` convention for the
simplified-language pendant (applied throughout the kit's language services). A strict BCP 47
rendering would use a private-use subtag (`el-x-simple`), but the kit token `el-easy` is the one
that counts here.
**Speaker reach:** ~**12 million** native speakers in Greece and Cyprus, and **~25 million**
worldwide including diaspora and second-language speakers; sole official language of **Greece**
(spoken by ~99.5 % of the population) and — alongside Turkish nominally — of the **Republic of
Cyprus**, where in practice it is the only language used by the authorities.
**Script + direction:** the **Greek alphabet** (24 letters), **left-to-right**, whitespace-separated
words. Modern text is **monotonic** (single tonos accent, post-1982). The letters live in the
**Greek and Coptic** Unicode block **U+0370–U+03FF**; polytonic accented vowels (classical only)
live in **Greek Extended U+1F00–U+1FFF** and must not appear in modern content.
**Status:** planned — **not yet reviewed by a native speaker.** Authored from a single agent-native
research dossier (self-fetched, quote-per-claim), then independently reviewed against its cited
sources. Covers base `el` and the `el-easy` pendant. The **strong** sections (typography, authorities,
numbers/currency, and the sourced core of terminology) rest on **Unicode/CLDR**, the **Centre for the
Greek Language / Triantafyllidis** lexicographic tradition, and Greek Wikipedia lead sentences with
verbatim quotes; the **thinner** sections (grammar detail, idioms, regional variation, and the newest
AI terms) rest on Wikipedia, community/localization pages, and translator judgment, and are marked
as such at point of use. Four load-bearing anchors were spot-checked and confirmed verbatim (Unicode
Sigma, Greek-and-Coptic block, Πληθυντικός ευγενείας, Τεχνητή νοημοσύνη).
**Easy or hard for this kit:** middling. In its favor: LTR, whitespace tokenization, no shaping or
bidi, a single well-defined 24-letter script, and a strong native calque tradition for AI vocabulary.
The three things that actually bite: (1) the **final sigma ς vs medial σ** positional rule — naive
uppercase→lowercase or truncation produces the wrong form at word end; (2) **monotonic accent
handling** — precomposed accented vowels (ά έ ή ί ό ύ ώ) and accented capitals (Ά Έ) must survive
font subsetting and case changes, and ALL-CAPS drops accents; and (3) **three genders + four cases**,
so one English noun maps to many Greek surface forms and naive dictionary-form output is
ungrammatical. Plus the register fork (§4): the choice of **εσύ vs εσείς** cascades through every
verb and adjective ending.

Sources: <https://en.wikipedia.org/wiki/Greek_and_Coptic> · <https://en.wikipedia.org/wiki/Sigma> ·
<https://el.wikipedia.org/wiki/Νέα_ελληνική_γλώσσα> ·
<https://el.wikipedia.org/wiki/Μονοτονικό_σύστημα_της_ελληνικής_γλώσσας>

---

## 1. Header block

See above. One-line orientation: Greek is an independent Indo-European branch, **SVO-but-flexible**,
**LTR**, written in its own **24-letter monotonic alphabet**; the localization risks concentrate in
**final-sigma handling, monotonic accent survival (case changes + font subsetting), and rich
morphology (three genders, four cases, verb aspect)** — not in scripting or direction. The one
project-level decision that shapes every sentence is the register fork (§4).

---

## 4. Grammar for translators

**Word order.** Greek is **relatively free** thanks to its case morphology; the pragmatically neutral
default is **SVO**, but VSO and OVS are grammatical and used for emphasis / topicalization. Do **not**
preserve English word order mechanically — reorder so the **new/focused information** falls where
Greek naturally places it (often later in the clause).

**Register — and the project's recorded choice.** Greek has a two-way second-person distinction:

- **εσύ** = 2nd person **singular, informal/intimate** — friendly, familiar.
- **εσείς** = **plural** AND the **πληθυντικός ευγενείας (plural of politeness / formal "you")** —
  used toward strangers, superiors, and in formal settings; it conveys respect and social distance
  (el.wikipedia.org/wiki/Πληθυντικός_ευγενείας — the polite plural serves to *"καταδείξει ευγένεια,
  σεβασμό ή επιπλέον κοινωνική απόσταση"*).

> **Register decision (decided — apply): εσύ (informal singular).** Warmer, standard for modern
> consumer/education digital products, and consistent with the platform's teaching tone. Reserve
> **εσείς** (which is *also* the plural) **only for legal/formal notices** — terms of use, privacy
> policy, formal disclaimers. **Binding for all second-person copy** in `el` and `el-easy`.
>
> ⚠ **The choice cascades through EVERY verb and adjective/participle agreement ending** — 2sg vs 2pl
> forms, imperatives, possessives, and pro-dropped verb endings all change with it. **Pick one
> globally and never mix**: a single screen that switches between εσύ and εσείς reads as broken Greek.
> Because Greek is pro-drop, the register usually shows up not in a pronoun but in the **verb ending**
> — the most common place drift slips in unnoticed.

- ✅ εσύ (platform default): **Κάνε κλικ εδώ.** · **Μπορείς τώρα να αποθηκεύσεις.** · **Να έχεις υπόψη ότι…**
- ✅ εσείς (legal/formal notices only): **Κάντε κλικ εδώ.** · **Μπορείτε τώρα να αποθηκεύσετε.**
- ❌ mixing within the same context: **Κάνε κλικ… μπορείτε να αποθηκεύσετε** (2sg then 2pl — register drift)

The grammar features that break a naive EN → EL translation (⚠ **community/editorial-grade** — the
mechanisms are standard and attributed to the Triantafyllidis grammar tradition, but the example pairs
are **illustrative constructions**, correct-form-only where a sourced contrastive pair was
unavailable; native-speaker confirmation pending):

**(1) Three grammatical genders + agreeing articles.** Every noun is masculine, feminine, or neuter,
and the article agrees. "the model" → **το μοντέλο** (neuter); "the network" → **το δίκτυο** (neuter);
but "the method" → **η μέθοδος** (feminine). Adjectives must agree in gender/number/case. Getting the
article wrong is immediately visible to native readers.

- ✅ **ένα εκπαιδευμένο μοντέλο** (neuter) · **η επιβλεπόμενη μάθηση** (feminine)
- ❌ one adjective/article form across genders: **ένας εκπαιδευμένος μοντέλο** *(illustrative wrong
  form — article + adjective must agree with neuter μοντέλο)*

**(2) Four cases (nom. / gen. / acc. / voc.).** Nouns, articles, adjectives, and pronouns all decline;
Greek marks a word's role by **case**, where English relies on word order and prepositions. A
translator who reaches for the dictionary (nominative) form everywhere produces ungrammatical output.

- ✅ genitive "of the model": **η ακρίβεια του μοντέλου** · ✅ accusative object: **εκπαιδεύουμε το μοντέλο**
- ✅ plural declines too: **τα μοντέλα** (nom. pl.) → **των μοντέλων** (gen. pl.)
- ✅ vocative in direct address (onboarding): **Χρήστη, καλώς όρισες!** (nom. *Χρήστης* → voc. *Χρήστη*)
- ❌ nominative everywhere: **η ακρίβεια το μοντέλο** *(illustrative wrong form — needs genitive
  *του μοντέλου*)*

**(3) Verb aspect (perfective vs imperfective).** Greek grammaticalizes **aspect** independently of
tense. A single English verb often needs an aspect choice the translator must make deliberately; the
wrong aspect sounds off even when the tense is right.

- ✅ single action, perfective imperative (εσύ): **Πάτησε το κουμπί.** ("Press the button.")
- ✅ ongoing/repeated, imperfective: **Συνέχισε να εκπαιδεύεις το μοντέλο.** ("Keep training…")
- ❌ imperfective for a one-shot action: **Πάταγε το κουμπί** *(reads as "keep pressing / used to
  press" — wrong aspect for a single click)*

**(4) Pro-drop + rich verb agreement.** Subject pronouns are usually **omitted**; the verb ending
carries person and number, so it also carries the register (§4). Inserting εσύ/εσείς explicitly is
**emphatic**, not the default.

- ✅ εσύ, no pronoun: **Μπορείς τώρα να αποθηκεύσεις.** (the *-εις* ending encodes informal singular)
- ❌ needless pronoun in every sentence: **Εσύ μπορείς τώρα εσύ να αποθηκεύσεις** (emphatic/unnatural)

**(5) Genitive chains & noun compounding.** English stacks nouns ("machine learning training data");
Greek resolves these with **genitives or adjective+noun**, which changes length and can force
reordering. Left-branching English modifier stacks must be **unrolled**.

- ✅ **δεδομένα εκπαίδευσης μηχανικής μάθησης** ("machine-learning training data" — genitive chain)
- ❌ cloning the English noun-pile order token-for-token into Greek

Sources (grammar mechanisms — Triantafyllidis Νεοελληνική Γραμματική via greek-language.gr grammar
tools; register — el.wikipedia.org/wiki/Πληθυντικός_ευγενείας): example pairs are illustrative,
native-speaker confirmation pending.

---

## 5. Numbers, dates, currency

**(Strong section — CLDR `el`, corroborated by community usage; one 403 fallback noted.)**

**Decimal separator = comma (,); thousands separator = dot (.).** Example: **1.234.567,89**. This is
the mirror image of English. (CLDR `el`: decimal `,`, group `.` — cite the current CLDR release. A
community corroboration on translatum.gr returned **HTTP 403** and is **not** relied on; the pattern
is also shown as **24.141,92** in the dossier's search corpus.)

- ✅ Greek: **1.234,50** (dot groups, comma decimal) · **2.500.000** (2.5 million)
- ❌ English format in Greek copy: **1,234.50** (comma groups, period decimal)

**Currency = euro (€).** Both Greece and Cyprus use the euro. The symbol is placed **after** the
amount with a space: **1.234,50 €**. (CLDR `el` places the currency symbol after the number. `⚠`
confirm exact spacing against the current CLDR release; institutional texts sometimes spell it out as
**"1.234,50 ευρώ"**.)

- ✅ **1.234,50 €** · also spelled **1.234,50 ευρώ** · ❌ symbol before the amount: **€ 1.234,50**

**Dates — day-month-year.** Numeric with dots or slashes: **26/07/2026** or **26.07.2026**. Long form
spells the **month name in the genitive**: **26 Ιουλίου 2026** (Ιανουαρίου, Φεβρουαρίου, Μαρτίου …
Ιουλίου). Weekdays are capitalized: **Δευτέρα, Τρίτη, Τετάρτη, …**

- ✅ numeric: **26/07/2026** · long (genitive month): **26 Ιουλίου 2026**
- ❌ month in nominative in the long form: **26 Ιούλιος 2026** *(should be genitive *Ιουλίου*)*
- ❌ US month-first order for end-user Greek: **07/26/2026**

**Time — 24-hour clock** is standard: **14:30** (colon separator). Avoid 12-hour AM/PM for end-user
Greek content.

**Percent.** Number, space, then % is common: **25 %** (though **25%** also occurs).

Sources: CLDR `el` (Unicode — cite current release) · dossier search corpus (podilato98 / anaconda.gr)
`⚠` community-grade · translatum.gr `⚠ HTTP 403 fallback — not relied on`.

---

## 6. Terminology strategy

**(Strong for the policy and the sourced core; the newest AI terms are flagged.)**

**Loanword vs native-coinage practice.** Greek strongly prefers **native calques** for established
concepts (**τεχνητή νοημοσύνη**, **μηχανική μάθηση**), but **retains English loans** for very new /
unstable terms — often shown in quotes in Greek text (e.g. *"prompt"*, *"token"*). **Working rule for
this teaching platform:** present the **Greek calque as primary** and the **English term in
parentheses on first use** (Greek tech readers expect the English anchor); keep **ΤΝ** as the standard
abbreviation for τεχνητή νοημοσύνη. For token / fine-tuning / inference, prefer a **glossed English
term** until Greek usage stabilizes. Loanwords and calques **decline** like Greek nouns (§4) — respect
the case, don't freeze them in the nominative.

**The sandwich (from [translation-quality](../translation-quality.md)).** On the *first* mention of an
established domain term, give target term + original + one short plain clause, then use the target
term alone afterwards. Instantiated with a sourced term:

> **τεχνητή νοημοσύνη** (artificial intelligence, AI) — ο τομέας της πληροφορικής που σχεδιάζει
> συστήματα ικανά να επιτελούν εργασίες που απαιτούν ανθρώπινη νοημοσύνη. *(explanatory clause authored
> per the sandwich format; the term itself is sourced below.)* Then **ΤΝ** / **τεχνητή νοημοσύνη**
> alone on every later mention.

**Seed field vocabulary (AI/ML).** Field-standard renderings; the sourced rows carry a Greek-Wikipedia
lead quote as provenance. Freeze the chosen forms in the project glossary and don't mix competing
renderings. Rows marked `⚠` have **no settled Greek authority** and rest on academic/press/community
usage — keep the English term glossed until usage stabilizes.

| Concept (EN) | Greek (recommended) | Provenance / note |
|---|---|---|
| artificial intelligence | **τεχνητή νοημοσύνη** (abbr. **ΤΝ**) | *"Ο όρος **τεχνητή νοημοσύνη** (ΤΝ)…"* — el.wikipedia.org/wiki/Τεχνητή_νοημοσύνη (spot-checked ✅) |
| machine learning | **μηχανική μάθηση** | article title + definition — el.wikipedia.org/wiki/Μηχανική_μάθηση |
| neural network | **νευρωνικό δίκτυο** (neuter) | *"βαθιά νευρωνικά δίκτυα"* — el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη |
| deep learning | **βαθιά μάθηση** | *"Η βαθιά μάθηση είναι ένας εξειδικευμένος κλάδος της μηχανικής μάθησης"* — search corpus (msc-ai.iit.demokritos.gr) `⚠` |
| algorithm | **αλγόριθμος** (masc.) | *"αλγόριθμοι που μπορούν να μαθαίνουν από τα δεδομένα"* — el.wikipedia.org/wiki/Μηχανική_μάθηση |
| model | **μοντέλο** (neuter; pl. **μοντέλα**) | *"μοντέλα μηχανικής μάθησης"* — el.wikipedia.org/wiki/Τεχνητή_νοημοσύνη |
| training data | **δεδομένα εκπαίδευσης** (also **δεδομένα κατάρτισης**) | *"τα πρότυπα και τη δομή των δεδομένων κατάρτισης εισόδου"* — el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη |
| dataset | **σύνολο δεδομένων** (pl. **σύνολα δεδομένων**) | *"εκπαιδεύονται σε μεγάλα … σύνολα δεδομένων"* — el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη |
| training (verb) | **εκπαίδευση / εκπαιδεύω** (also **κατάρτιση**) | *"εκπαιδεύονται σε μεγάλα … σύνολα δεδομένων"* — el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη |
| supervised learning | **επιβλεπόμενη μάθηση** (WP variant: **επιτηρούμενη μάθηση**) | *"Επιτηρούμενη μάθηση … δέχεται τις παραδειγματικές εισόδους"* — el.wikipedia.org/wiki/Μηχανική_μάθηση |
| unsupervised learning | **μη επιβλεπόμενη μάθηση** (WP variant: **μη επιτηρούμενη**) | *"Μη επιτηρούμενη μάθηση … πρέπει να βρεί την δομή των δεδομένων"* — el.wikipedia.org/wiki/Μηχανική_μάθηση |
| large language model | **μεγάλο γλωσσικό μοντέλο** (pl. **μεγάλα γλωσσικά μοντέλα**, LLM) | *"Μεγάλα Γλωσσικά Μοντέλα (LLMs)"* — search corpus (NTUA thesis, dspace.lib.ntua.gr) `⚠` |
| prompt | **προτροπή** (English *"prompt"* often kept in quotes) | *"συχνά ως απάντηση σε \"prompts\""* — el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη; *προτροπή* attested in academic texts `⚠` |
| hallucination | **παραίσθηση** / **ψευδαίσθηση** (both circulate) | press/blog usage (gain.gr, daily.nb.org) — **non-authoritative** `⚠ unverified` |
| token | keep English **"token"** (optionally gloss **«μονάδα κειμένου»**) | **no settled Greek-authority term** — διακριτικό / τεκμήριο circulate `⚠ unverified` |
| fine-tuning | **λεπτομερής ρύθμιση** (also προσαρμογή / βελτιστοποίηση) | **no single settled term** — *λεπτομερής ρύθμιση* is the common calque `⚠ unverified` |
| inference | **συμπερασμός / εξαγωγή συμπερασμάτων** (ML runtime sense) | *συμπερασμός* is the logic term; ML-runtime sense **unsettled**, gloss recommended `⚠ unverified` |

**Coverage note:** the established calques (τεχνητή νοημοσύνη, μηχανική μάθηση, νευρωνικό δίκτυο,
αλγόριθμος, μοντέλο, σύνολο δεδομένων, εκπαίδευση, (μη) επιβλεπόμενη μάθηση) are well-attested; the
**newest terms — token, fine-tuning, inference, and (for a hard authority) hallucination — have no
settled Greek authority and are kept `⚠`**, per the scrub rule.

Sources: <https://el.wikipedia.org/wiki/Τεχνητή_νοημοσύνη> · <https://el.wikipedia.org/wiki/Μηχανική_μάθηση> ·
<https://el.wikipedia.org/wiki/Παραγωγική_τεχνητή_νοημοσύνη> (seed renderings are Wikipedia-lead / academic
usage — field usage, not an academy decree; newest terms flagged `⚠ unverified`).

---

## 7. Idiom anti-patterns

**⚠ Editorial-grade section, native-speaker confirmation pending.** These renderings are **translator
recommendations grounded in idiomatic Greek**, not verbatim source quotes. Prefer the idiomatic
column; the literal calque column is the naive output to avoid. (Second-person forms follow the
recorded **εσύ** register, §4.)

| English phrase | Idiomatic Greek ✓ | Literal calque to avoid ✗ | Provenance |
|---|---|---|---|
| step by step | **βήμα βήμα** / βήμα προς βήμα | σκαλί σκαλί ✗ | translator craft, unsourced |
| under the hood | **στο παρασκήνιο** / πώς λειτουργεί εσωτερικά | κάτω από το καπό ✗ (car-literal, odd) | translator craft, unsourced |
| rule of thumb | **εμπειρικός κανόνας** / πρακτικός κανόνας | κανόνας του αντίχειρα ✗ (meaningless) | translator craft, unsourced |
| out of the box | **έτοιμο προς χρήση** / χωρίς ρυθμίσεις | έξω από το κουτί ✗ | translator craft, unsourced |
| keep in mind | **να έχεις υπόψη** / θυμήσου ότι | κράτησε στο μυαλό ✗ | translator craft, unsourced |
| at a glance | **με μια ματιά** | *(idiomatic — correct)* | translator craft, unsourced |
| trial and error | **δοκιμή και λάθος** / με δοκιμές | δίκη και σφάλμα ✗ | translator craft, unsourced |
| the big picture | **η συνολική εικόνα** / το γενικό πλαίσιο | η μεγάλη εικόνα ✗ (unnatural) | translator craft, unsourced |
| hands-on | **πρακτική εξάσκηση** / με την πράξη | χέρια πάνω ✗ | translator craft, unsourced |
| cutting edge | **τεχνολογία αιχμής** / πρωτοποριακό | κόβουσα άκρη ✗ | translator craft, unsourced |
| a deep dive | **αναλυτική / εις βάθος παρουσίαση** | μια βαθιά βουτιά ✗ (jarring) | translator craft, unsourced |
| garbage in, garbage out | **σκουπίδια μέσα, σκουπίδια έξω** *(keep, but gloss it)* | calque alone is opaque — explain it ✗ | translator craft, unsourced |

The general law from [translation-quality](../translation-quality.md) applies: if a mental
back-translation lands exactly on the English wording, it is too literal — rework it.

Sources: translator recommendations (idiomatic Greek), native-speaker confirmation pending `⚠`.

---

## 8. Simplified-language pendant (`el-easy`)

### 8a. ❌ No Greek plain-language standard — and one state method that is not one

**Two different claims, kept apart.**

**❌ Established absence — a national plain-language standard.** The International Plain Language
Federation publishes the list of national standards bodies that have adopted or are selling
**ISO 24495-1:2023 Plain language**. The page names 23 countries — *"Austria (A) … Australia (A) …
Belgium (A) … Brazil (A) … Canada (S) … Czech Republic (A) … Denmark (A) … Finland (A) …
France (A) … Germany (A) … Ireland (A) … Italy (A) … Netherlands (S) … Norway (A) … Portugal (A) …
Slovak Republic (A) … South Africa (A) … Spain (A) … Sweden (A) … United Kingdom (S) …
United States (S)"* — and **Greece is not among them**; neither the word *Greece* nor *ELOT* occurs
anywhere on the page. **ΕΛΟΤ**, the Hellenic Organization for Standardization, is Greece's national
standards body and would be the adopting authority. Its own site search for `24495` returns no
standard; a draft page for a later part of the series (`standardsdevelopment.elot.gr/drafts/6386`,
*Plain language — Part 3: Science writing*) exists but is **login-gated**, so the state of Greek
participation in the series could not be read.

**⚠ Inconclusive — a government plain-language mandate.** The national disability strategy portal
(`amea.gov.gr/strategy/strategy-2024-2030`, *«Μια Ελλάδα με Όλους για Όλους»*) returned a
JavaScript shell: none of *εύκολη ανάγνωση*, *απλή γλώσσα*, *απλοποιημ-*, *κείμενο για όλους*
appears in the served bytes, **which proves nothing either way** because the body text never
arrived. Neither the **Κέντρο Ελληνικής Γλώσσας** nor the **Ακαδημία Αθηνών** was found to publish
a plain-language ruling; that search was not exhaustive.

**✅ What does exist, and it is more than most languages have.** Greece has a **state-published
Easy-to-Read method with an explicit rule list**: **«Κείμενο για Όλους»**, written by Κατερίνα
Αραμπατζή for the **Παιδαγωγικό Ινστιτούτο, Τμήμα Ειδικής Αγωγής και Εκπαίδευσης** (March 2009),
and applied by the **Ινστιτούτο Εκπαιδευτικής Πολιτικής (ΙΕΠ)** to produce adapted editions of the
national school textbooks. It is **not** a general-purpose plain-language standard: it is an
accessibility method in the European Easy-to-Read lineage (the document's own footnotes cite
Tronbacke and Freyhoff's *Make it Simple*), aimed at readers with intellectual disability,
developmental disorders, and autism, and it is scoped to education. A volunteer initiative
(`noesi.gr`, 2019) coordinated a Greek **translation** of the Inclusion Europe European standards —
again an import, not a Greek norm — and **that site announces its own shutdown for 31/07/2026**, so
treat its URLs as perishable.

> **→ Consequence.** `el-easy` inherits the kit's base rules from
> [accessibility-workflow](../accessibility-workflow.md) **and** overlays the «Κείμενο για Όλους»
> rules, which are quoted where they bite (§8e, §8f). The method gives **no sentence-length
> number** — its rule is the bare *"Οι προτάσεις πρέπει να είναι μικρές."* ("Sentences must be
> short.") **The ~8–12-word target used anywhere in this kit is the kit's figure and is not
> attributable to any Greek norm.**

### 8b. The axis, as a hypothesis: katharevousa residue → demotic word

Modern Greek carries the sediment of a century-long two-register split, and the national dictionary
of record — the **Λεξικό της Κοινής Νεοελληνικής (ΛΚΝ)**, Ίδρυμα Μανόλη Τριανταφυλλίδη, served by
the Κέντρο Ελληνικής Γλώσσας — defines both poles and, crucially, **labels individual headwords**
for the learned pole:

- **καθαρεύουσα**: *"τεχνητή μορφή της νεοελληνικής γλώσσας, μείγμα αρχαϊστικών και νεοελληνικών
  στοιχείων, που χρησιμοποιήθηκε ως επίσημη γλώσσα του ελληνικού κράτους"*
- **δημοτική**: *"η μορφή της νεοελληνικής κοινής γλώσσας, όπως διαμορφώθηκε ιδίως τα τελευταία
  εκατόν πενήντα χρόνια από τον προφορικό λόγο του Νεοέλληνα"* — and in the entry's own example
  sentence, *"Η ~ βαθμιαία επικράτησε σε όλους σχεδόν τους τομείς εκτοπίζοντας την καθαρεύουσα."*
- **λόγιος**, the label itself: *"που ανήκει ή που αναφέρεται στον έντεχνο, στον καλλιεργημένο
  (γραπτό) λόγο (σε αντιδιαστολή προς το λαϊκό) … Λόγια λέξη: α. που έχει λόγια προέλευση.
  β. που έχει λόγια χρήση."*

*(Fetch trap, re-confirmed this pass: the ΛΚΝ web pages serve several Greek capitals as **Latin
homoglyphs**. In the two sentences above the bytes carry Latin **H** U+0048 and Latin **N** U+004E
where Greek **Η** and **Ν** belong; they are normalized to Greek letters here. Do not copy that
corruption into shipped text.)*

**The hypothesis this yields is: a `el-easy` simplifier is removing katharevousa residue, and the
`λόγ.` mark identifies it.** That is a plausible story about the history of the language. §8c tests
whether it predicts what plain Greek actually does, and **§8d is the list of places where it does
not.**

### 8c. Measuring the axis — the ministry's own textbook, twice

**The pair is unusually clean: the same four books, standard edition and the state's own
Easy-to-Read adaptation, one publisher.** A third, unrelated adult corpus anchors the formal end.

| Corpus | What it is | Size |
|---|---|---|
| **Standard** | **Γλώσσα Δ΄ Δημοτικού «Πετώντας με τις λέξεις»** (τεύχη Α, Β, Γ) + **Μελέτη Περιβάλλοντος Δ΄ Δημοτικού**, βιβλία μαθητή, ΥΠΑΙΘ / ΙΕΠ, served by `ebooks.edu.gr` | 4 books, 442 pages, **79,335 Greek word tokens**, 11,886 distinct forms |
| **Plain** | **The same four titles** in the ministry's *«προσαρμοσμένη έκδοση … με τη μέθοδο easy to read - κείμενο για όλους»*, ΙΕΠ, served by `prosvasimo.iep.edu.gr` | 5 volumes, 941 pages, **87,751 Greek word tokens**, 8,095 distinct forms |
| **Cross-check** | **136 news articles** from four unrelated Greek publishers' feeds (the public broadcaster, a daily, two national news sites), fetched 2026-07 | **54,324 Greek word tokens** |

**Method.** PDFs fetched as bytes and converted with a standard text extractor; the first four and
last two pages of every volume dropped (imprint, credits, index); tokens are maximal runs of Greek
letters, NFC-normalized, accent-stripped, lowercased, final sigma folded; each row sums an explicit
list of inflected forms. **Counts are per 100,000 word tokens.** A reader who disagrees can re-run
it: the corpora are four named books and one feed sample.

**Two whole-corpus numbers, before any word list.**

| Measure | Cross-check (adult news) | Standard | Plain |
|---|---|---|---|
| Mean sentence length (words) | **22.1** | **11.6** | **11.3** |
| Median / 90th percentile | 20 / 40 | 9 / 22 | 10 / 21 |
| Sentences over 15 words | 64.5 % | 24.1 % | 21.0 % |
| Distinct word forms per 100k tokens | — | 14,982 | **9,225** |

**Read those two rows carefully, because they point in different directions.** The sentence-length
collapse happens between adult prose and the *ordinary* schoolbook (22.1 → 11.6); the Easy-to-Read
adaptation barely moves it further (11.6 → 11.3). What the adaptation *does* move is **vocabulary
breadth: 38 % fewer distinct word forms across a 10 % larger corpus.** ⚠ The sentence figures are
noisy — a text extractor cannot tell a heading, a poem line, or an exercise stem from a sentence, and
schoolbooks are full of all three — so treat the *direction* as informative and the decimals as not.

**Rows where the axis holds.** Formal member first, everyday member second; three columns are
news / standard / plain per 100k.

| Learned (`λόγ.` where marked) | news | std | plain | Everyday | news | std | plain |
|---|---|---|---|---|---|---|---|
| **ο οποίος** `[λόγ. < αρχ. ὁποῖος]` | **405.0** | 98.3 | **47.9** | **που** | 1237.0 | 1736.9 | 1900.8 |
| **αναφέρω** `[αρχ. & λόγ.]` | 112.3 | 29.0 | **1.1** | **λέω** `[μσν.]` | 114.1 | 243.3 | 535.6 |
| **παρουσιάζω** `[λόγ.]` | 31.3 | 20.2 | 4.6 | **δείχνω** `[μσν.]` | 29.5 | 70.6 | 240.5 |
| **θεωρώ** `[λόγ. < αρχ. θεωρῶ]` | 31.3 | 13.9 | **0.0** | **νομίζω** | 3.7 | 22.7 | 43.3 |
| **δημιουργώ** `[λόγ. < ελνστ.]` | 51.5 | 40.3 | 26.2 | **φτιάχνω** `[μσν.]` | 1.8 | 55.5 | 155.0 |
| **επιλέγω** `[λόγ. < αρχ.]` | 53.4 | 8.8 | 1.1 | **διαλέγω** `[αρχ.]` | 0.0 | 21.4 | 25.1 |
| **διότι** | 18.4 | 2.5 | 0.0 | **γιατί** | 51.5 | 194.1 | 209.7 |
| **εάν** | 16.6 | 3.8 | 0.0 | **αν** | 104.9 | 173.9 | 121.9 |
| **καθώς** | **156.5** | 21.4 | 5.7 | *(recast the clause)* | — | — | — |
| **ωστόσο** | 31.3 | 5.0 | 1.1 | **όμως** | 110.4 | 98.3 | 109.4 |
| **απαιτείται** `[λόγ.]` | 25.8 | 1.3 | 0.0 | **χρειάζεται** | 38.7 | 88.2 | 104.8 |
| **κατά τη διάρκεια** | 66.3 | 15.1 | 0.0 | **όταν** | 84.7 | 316.4 | 476.3 |
| **επιπλέον** | 31.3 | 2.5 | 0.0 | **ακόμα / ακόμη** | 156.5 | 112.2 | 204.0 |
| **λαμβάνω** | 12.9 | 3.8 | 0.0 | **παίρνω** | 33.1 | 90.8 | 83.2 |
| **επιθυμώ** | 18.4 | 3.8 | 1.1 | **θέλω** | 44.2 | 121.0 | 134.5 |
| **ομιλώ** | 14.7 | 6.3 | 2.3 | **μιλάω** | 53.4 | 60.5 | 75.2 |
| **προκειμένου να** | 42.3 | 0.0 | 0.0 | **για να** | — | — | — |
| **πραγματοποιώ** `[λόγ.]` | 22.1 | 1.3 | 0.0 | **κάνω** | — | 316.4 | 512.8 |
| **συνεπώς / επομένως** | 14.7 | 1.3 | 0.0 | **έτσι** | 27.6 | 114.7 | 118.5 |
| **αποτελεσματικός** `[λόγ.]` | 14.7 | 2.5 | 0.0 | *(paraphrase)* | — | — | — |
| **διαθέτω** `[λόγ. < αρχ. διατίθημι]` | 11.0 | 6.3 | 0.0 | **έχω** | — | 708.4 | 877.5 |
| **εντοπίζω** `[λόγ.]` | 11.0 | 0.0 | 0.0 | **βρίσκω** | 154.6 | 266.0 | 184.6 |

**And four words the previous edition of this table carried that no corpus could test.**
**δύναται**, **προβαίνω σε**, **τροποποιώ**, and **εκκίνηση / εκκινώ** score **0.0 in all three
corpora** — including adult national news. They are not wrong; they are **legal-administrative
Greek**, a register this platform does not write. Keeping them is harmless; ranking them first, as
the previous table did, pointed a translator at the least useful rows in the section.

### 8d. 🔴 Do NOT "simplify" these — nine findings that contradict the instinct

**This is the section's highest-value output.** Every row is a swap that "learned word = hard word,
demotic word = easy word" recommends, and that the measurement refutes.

| Do **not** do this | Why — with numbers |
|---|---|
| ~~**χρησιμοποιώ** → something plainer~~ | ΛΚΝ marks it learned — `[λόγ. χρήσιμ(ος) -ο- + -ποιώ απόδ. γαλλ. utiliser]`, the *same* learned-compound formation as πραγματοποιώ. Measured: **14.7 in adult news, 214.3 in the standard schoolbook, 177.8 in the Easy-to-Read edition.** It is **12× commoner in text written for children with reading difficulties than in adult journalism.** Its native rival **μεταχειρίζομαι** scores 1.8 / 5.0 / **0.0**. The learned word is the plain one and the native one is the rare one. |
| ~~**θεωρώ** → **νομίζω**, presented as learned → everyday~~ | The *swap* is right (θεωρώ 31.3 / 13.9 / **0.0**) but the *reason* is wrong: ΛΚΝ marks **νομίζω** learned too — `[αρχ. & λόγ. < αρχ. νομίζω]` — and it is the member that **rises** toward plain text (3.7 / 22.7 / **43.3**). **A `λόγ.` mark on the replacement did not stop it being the plain choice.** Use the measurement, not the label. |
| ~~**αρχίζω** → **ξεκινώ**~~ | Ranking **inverts** between registers. Adult news prefers ξεκινώ 44.2 to αρχίζω 16.6 (2.7 : 1). The Easy-to-Read edition prefers **αρχίζω 241.6** to ξεκινώ 34.2 (**7 : 1**). Plain educational Greek reaches for αρχίζω; "prefer the native-sounding ξεκινώ" is backwards here. |
| ~~**εκκίνηση / εκκινώ** → **ξεκίνημα / ξεκινάω**~~ | ΛΚΝ does derive ξεκινώ from the same root — *"[μσν. ξεκινώ < ἐκκινῶ (ἐκ- > ξε-)]"* — so the etymological story is sound. But **εκκίνηση and εκκινώ occur 0 times in all three corpora**, and **ξεκίνημα** scores 0.0 / 2.5 / 1.1. **The row is true and useless.** It taught a translator a rule about words nobody writes. |
| ~~**γνωρίζω** → **ξέρω**~~ | γνωρίζω 22.1 / 69.3 / **87.7**; ξέρω 12.9 / 49.2 / 70.7. γνωρίζω is **commoner than ξέρω in every corpus including the Easy-to-Read one**, and it *rises* toward the plain end. ΛΚΝ gives it no blanket learned mark either — `[αρχ. γνωρίζω]`, with `(λόγ.)` on one bureaucratic sense only. |
| ~~**παρατηρώ** → **βλέπω**~~ | παρατηρώ is `λόγ.`-marked, and it is **4× rarer in adult news (7.4) than in the schoolbooks (30.3 / 26.2)** — it barely moves between the two editions (0.87×). It is a classroom verb, not a formality marker. βλέπω does rise sharply (38.7 / 110.9 / 216.5), so **add βλέπω; do not remove παρατηρώ.** |
| ~~**κατοικώ / κάτοικος** → **μένω**~~ | `λόγ. < αρχ. κατοικῶ`, and **flat across all three corpora: 36.8 / 31.5 / 28.5.** A learned label with no register signal at all. |
| ~~Treating **ωστόσο** as "not on this axis"~~ | **This measurement refutes what the previous edition of this section asserted.** It argued that preferring όμως over ωστόσο is only a length preference because ωστόσο carries no `λόγ.` mark and a native etymology — re-verified this pass: the ΛΚΝ entry ends `[ως τόσο]` with no learned label. **But ωστόσο runs 31.3 / 5.0 / 1.1 — 28× commoner in adult news than in Easy-to-Read — while όμως is flat at 110.4 / 98.3 / 109.4.** It is one of the cleanest register markers found. **The etymological label was the wrong instrument; the corpus is the right one.** |
| ~~Applying the plain column to base `el` as well~~ | Two of the "everyday" winners are **near-absent from adult written Greek**: **φτιάχνω 1.8** and **διαλέγω 0.0** per 100k in the news corpus, against 155.0 and 25.1 in the Easy-to-Read edition. They are correct for `el-easy` and would read as childish in base `el`. **These rows are variant-specific, not global style advice.** |

> **→ The rule that follows.** In Greek, **do not simplify by etymology, and do not simplify by the
> `λόγ.` label either.** The label records where a word *came from*; it does not predict whether a
> reader knows it. Simplify by **structure first** (§8f) and, for vocabulary, only where a *measured*
> register gradient supports the swap.

### 8e. 🔑 The address decision — `el-easy` keeps **εσύ**, and the Greek method says so

> **Decision, recorded so nobody "fixes" it: `el-easy` uses **εσύ**, the same register as base `el`
> (§4). There is no address change between the two variants.**

- ✅ `el` and `el-easy` alike: **Πάτησε το κουμπί.** · **Μπορείς τώρα να αποθηκεύσεις.**
- ❌ switching the easy variant to **εσείς** for gravity: **Πατήστε το κουμπί.** — reserved for legal notices only (§4)

**Unusually for this kit, the decision is not craft — the national method prescribes it in so many
words.** «Κείμενο για Όλους» states: *"Χρησιμοποιούμε το β' ενικό. Για παράδειγμα αντί για «Ο
υποψήφιος θα πρέπει να μας αποστείλει» προτιμούμε το Στείλε μας ή αντί για «Πληροφορίες
διατίθενται στο» προτιμούμε το Πάρε πληροφορίες από το…"* — second person singular, with an
official-register example rewritten to it.

**Why this lands in the same place as the kit's usual finding by a different road.** The recurring
result elsewhere is that a simplified variant must **not** drop to a familiar form, because
informality reads as condescension. Greek cannot make that mistake in the same way: **its base
register is already the singular εσύ** (§4), so `el-easy` has nothing to drop to, and the state
method independently asks for exactly that form. **The decision is therefore "no change" — verified,
not assumed.** The condescension risk in Greek lives elsewhere: in *tone*, not in the pronoun. The
method itself warns about it — *"ας μην υποθέτουμε ότι, επειδή αφορά άτομα με δυσκολίες στην
πρόσβαση, επιτρέπεται να κάνουμε πρόχειρη δουλειά … θα πρέπει να είναι σαν «πραγματικό κείμενο» και
να αντιμετωπίζει με το δέοντα σεβασμό το κοινό στο οποίο απευθύνεται."*

⚠ **One internal contradiction in the source, reported rather than resolved.** The same rule list
says *"Χρησιμοποιούμε χρόνους στην οριστική και αποφεύγουμε υποτακτική και προστακτική"* (use the
indicative, avoid subjunctive and imperative) — and then gives **Στείλε μας** and **Πάρε
πληροφορίες**, which are imperatives, and adds *"Δε φοβόμαστε να δώσουμε οδηγίες."* For UI copy this
guide follows the examples over the rule: **imperatives are how instructions are given**, and the
document's own worked examples use them. Flag for a native reviewer.

### 8f. What `el-easy` is built on — structure first, vocabulary second

**In order of measured leverage.**

1. **Unpack `ο οποίος` relative clauses. This is the single strongest signal in the data**
   (405.0 → 98.3 → 47.9 across the three registers, while `που` rises) and it is `λόγ.`-marked in
   ΛΚΝ. It overrides nothing in the base rules; it is the Greek instantiation of "no stacked hard
   structures".
   - ✅ `el-easy`: **Το μοντέλο μαθαίνει από δεδομένα. Τα δεδομένα τα δίνουμε εμείς.**
   - ❌ learned relative chain: **Το μοντέλο μαθαίνει από δεδομένα, τα οποία παρέχονται από εμάς.**
2. **Narrow the vocabulary, do not shorten the sentences further.** The measurement says the
   ministry's adaptation spends its budget on **38 % fewer distinct word forms**, not on sentence
   length (11.6 → 11.3 words). Against adult prose, sentence length *is* the lever (22.1 → 11.6);
   against ordinary educational copy it is largely already spent. **Take the kit's ~8–12-word target
   as the working ceiling it always was, and put the effort into word choice.**
3. **Apply the measured swaps from §8c — and only those.** Every row not in that table is a guess.
4. **Line geometry, with a Greek-specific number.** The method fixes what no kit rule covers:
   *"Μια σειρά κειμένου θα πρέπει να περιλαμβάνει περίπου 60-72 χαρακτήρες ή 10-12 λέξεις"*, left
   alignment rather than justified (*"είναι καλύτερο η ευθυγράμμιση να γίνεται αριστερά"*), Arial or
   Helvetica, **size not below 12 and preferably 14**, headings two points larger, and **no ALL-CAPS,
   italics, or underlining** — which also protects the monotonic accents (§1). Its footnote carries a
   fact worth more than the rule: **the same 7 words occupy 27 characters in English and 36 in
   Greek**, so an English character budget under-sizes a Greek line by roughly a third.
5. **Keep the technical term and explain it — the method's own pattern.** «Κείμενο για Όλους»
   demonstrates it on a term of its own: *"αν παραθέσουμε την πρόταση «Το κράτος κάνει υποχρεωτικό
   το Σχεδιασμό για Όλους» θα πρέπει να εξηγήσουμε τον όρο … κατά τρόπο απλούστερο"*. So in
   `el-easy` keep **τεχνητή νοημοσύνη**, then *"αυτό σημαίνει: …"*, then a concrete example — never
   a folksy stand-in. The method is explicit that this is not the same as using only easy words:
   *"Αυτό δε σημαίνει ότι θα χρησιμοποιήσουμε μόνο απλές λέξεις αλλά λέξεις που ο αναγνώστης
   καταλαβαίνει."* **That sentence is the sourced warrant for §8d.**
6. **The method's remaining qualitative rules, which the kit's base rules already contain and which
   are quoted here so they are anchored in a Greek source rather than an imported one:**
   *"Γράφουμε με κυριολεξίες και αποφεύγουμε τις μεταφορές"*; *"Περιγράφουμε μια ιδέα σε κάθε
   πρόταση"*; *"Οι προτάσεις πρέπει να είναι μικρές"*; *"Προτιμάμε ενεργητική σύνταξη"* with the
   worked pair — instead of *«Τα δικαιώματα των αναπήρων προστατεύονται από το κράτος»*, prefer
   *«Το κράτος προστατεύει τα δικαιώματα των αναπήρων»*; and *"Κάθε πρόταση θα πρέπει να σταματά
   εκεί που θα κάναμε λογικά παύση, αν την αποδίδαμε σε προφορικό λόγο."*

### 8g. What is still open

1. **No native-speaker pass.** Every swap in §8c is a frequency fact, not a usage ruling. A gloss or
   a gradient shows two words share a register; it does not show the substitute reads naturally in
   `el-easy` UI copy.
2. **The corpora are children's education, and the platform is not.** Both measured corpora are
   Δ΄ Δημοτικού schoolbooks. Whether the same gradients hold for **adult** plain-language readers —
   the actual `el-easy` audience — is **untested**, and the Greek Easy-to-Read tradition is aimed at
   adults with intellectual disability at least as much as at children.
3. **No AI/ML vocabulary was measurable.** Nothing in §6's term table occurs in a Δ΄ Δημοτικού
   corpus. The `el-easy` rendering of τεχνητή νοημοσύνη, μοντέλο, δεδομένα rests on §6 plus the
   term-preservation rule, with no register evidence of its own.
4. **The ELOT question is not closed.** Whether Greece is participating in the ISO 24495 series at
   all could not be read behind the login gate on the standards-development portal. One authenticated
   look would settle it.
5. **No Greek readability formula.** Nothing equivalent to a calibrated Greek reading-ease score was
   located, so there is no way to score a draft; §8c's own numbers are the only instrument this guide
   can offer.
6. **The `noesi.gr` translation of the European Easy-to-Read standards disappears on 31/07/2026.**
   Whether the Greek text survives anywhere else was not established.

Sources: <https://www.iplfederation.org/standard-translations/> (national adoptions of ISO 24495-1;
Greece absent) · <https://elot.gr/?s=24495> · <https://standardsdevelopment.elot.gr/drafts/6386>
(login-gated) · <https://prosvasimo.iep.edu.gr/docs/pdf/Biblia/keimeno-gia-olous/keimeno_gia_olous-2.pdf>
(Κατερίνα Αραμπατζή, «Εισαγωγή στη μέθοδο “Κείμενο για Όλους”», Παιδαγωγικό Ινστιτούτο, Τμήμα Ειδικής
Αγωγής και Εκπαίδευσης, Μάρτιος 2009 — every method rule above quoted verbatim from the fetched PDF) ·
<https://prosvasimo.iep.edu.gr/el/149-logismika/easy-to-read> ·
<https://www.noesi.gr/blog/anaptyxi-odigion-gia-syntaktes-ylikoy-keimeno-gia-oloys-sta-ellinika-kai-metapoiisi-keimenon-se>
(Greek translation of the Inclusion Europe standards; site shutdown announced for 31/07/2026) ·
<https://amea.gov.gr/strategy/strategy-2024-2030> `⚠ JavaScript shell — no body text served, not relied on` ·
**Standard corpus** — <https://ebooks.edu.gr/ebooks/handle/8547/261> and
<https://ebooks.edu.gr/ebooks/handle/8547/258> (Γλώσσα Δ΄ Δημοτικού τεύχη Α/Β/Γ, Μελέτη Περιβάλλοντος
Δ΄ Δημοτικού, βιβλία μαθητή) ·
**Plain corpus** — <https://prosvasimo.iep.edu.gr/apps/easytoread_NOHTIKH_D/biblia_pdf.zip>
(ΙΕΠ, «προσαρμοσμένη έκδοση … με τη μέθοδο easy to read - κείμενο για όλους», same four titles) ·
**Cross-check corpus** — 136 articles from <https://www.ertnews.gr/feed/>, <https://www.efsyn.gr/rss.xml>,
<https://www.tovima.gr/feed/>, <https://www.in.gr/feed/> (fetched 2026-07) ·
**Register labels and etymologies** —
<https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/> (ΛΚΝ, Κέντρο
Ελληνικής Γλώσσας; entries *λόγιος, καθαρεύουσα, δημοτική, ο οποίος, αναφέρω, παρουσιάζω, τοποθετώ,
αρχίζω, ξεκινώ, χρησιμοποιώ, μεταχειρίζομαι, γνωρίζω, ξέρω, παρατηρώ, θεωρώ, νομίζω, δείχνω, φτιάχνω,
λέω, ρωτώ, βάζω, δημιουργώ, διαθέτω, πραγματοποιώ, επιλέγω, διαλέγω, εντοπίζω, κατοικώ, καθώς, ωστόσο*
— each fetched and quoted this pass) · [accessibility-workflow](../accessibility-workflow.md)
(inherited base rules and the kit's ~8–12-word target).

---

## 9. Regional variation

**⚠ Community-tier section (Greek Wikipedia paraphrase); neutrality recommendation editorial.**

- **Greece:** **Standard Modern Greek (SMG)** — the reference variety for all written/formal content.
- **Cyprus:** the **Cypriot dialect (κυπριακή διάλεκτος)** is the everyday **spoken** language of most
  Greek Cypriots, but is **almost never the written/official language** — written and official Cypriot
  Greek is SMG. A **diglossia** situation holds: SMG dominates through mass media, education, and the
  press (paraphrase of el.wikipedia.org/wiki/Κυπριακή_Διάλεκτος_της_Ελληνικής_Γλώσσας).

**Neutrality strategy (explicit).** Write **Standard Modern Greek (Greece norm)**. It is fully
understood and accepted in writing in Cyprus; Cypriot-dialect features would read as
informal/regional and are inappropriate for educational copy. A **single `el` variant serves both
markets** — no `el-CY` fork is needed for text (both use the euro; watch only currency/legal
specifics where they arise).

- ✅ SMG (neutral written baseline): **τι κάνεις;**, **θέλω**, **αυτό είναι**
- ❌ Cypriot-dialect features in default content: **ίντα κάμνεις;**, **θέλω το** (regional/spoken —
  reads as non-neutral) *(illustrative; native-speaker confirmation pending)*

Sources: <https://el.wikipedia.org/wiki/Κυπριακή_Διάλεκτος_της_Ελληνικής_Γλώσσας> (community-tier;
neutrality recommendation editorial — native-speaker confirmation pending).

---

