<!-- base -->
# lang-el — Greek (Ελληνικά) — setup & sources

> **The translation guide itself is [`el.md`](el.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

Greek has **no single prescriptive academy** dictating everyday usage; authority is distributed
across a small set of state-backed reference institutions. This section is the guide's evidence base —
every rule below traces back to one of these.

- **Κέντρο Ελληνικής Γλώσσας (Centre for the Greek Language)** — state body under the Ministry of
  Education. Hosts the canonical free online reference tools for Modern Greek.
  <https://www.greek-language.gr/> · <https://pyli.greek-language.gr/>
- **Λεξικό της Κοινής Νεοελληνικής (Triantafyllidis Dictionary)** — the standard **descriptive
  dictionary of contemporary usage**, published by the Institute of Modern Greek Studies (Manolis
  Triantafyllidis Foundation, Aristotle University of Thessaloniki), online and free. It is the
  practical arbiter for spelling and word choice in modern Greek.
  <https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/index.html> ·
  <https://ins.web.auth.gr/>
- **Νεοελληνική Γραμματική (Triantafyllidis Grammar)** — the de-facto reference grammar taught in
  Greek schools; the standard authority for case/gender/agreement facts in §4.
- **Ακαδημία Αθηνών (Academy of Athens)** — consulted on orthographic and terminology questions where
  relevant; **not** a day-to-day style authority.
- **Unicode — Greek and Coptic block (U+0370–U+03FF)** and the **Sigma** reference, for the script
  and case-folding facts in §3. <https://www.unicode.org/charts/PDF/U0370.pdf> ·
  <https://en.wikipedia.org/wiki/Greek_and_Coptic> · <https://en.wikipedia.org/wiki/Sigma>
- **Unicode CLDR — `el` locale** — number, date, time, and currency formats (§5). Cite the current
  CLDR release when instantiating exact patterns.

**Style-guide gap (itself a finding).** There is **no official state style guide for Greek web copy**
comparable to the national handbooks some other languages have. For institutional/EU-facing Greek,
follow the **EU Interinstitutional Style Guide (Greek section)** and the European Commission's
Greek-language department conventions; for general usage, adopt **EU + Triantafyllidis as the
composite standard**. Treat this gap as a reason for a native-speaker review, not something to paper
over.

**Source-tier caveat (read before trusting a section).** **Strong** sections — typography (§3),
authorities (§2), numbers/currency (§5), and the sourced core of terminology (§6) — rest on Unicode /
CLDR / the Triantafyllidis tradition / Greek Wikipedia lead sentences and carry verbatim quotes. The
**thinner** sections — grammar examples (§4), idioms (§7), simplified language (§8), regional
variation (§9), and the newest AI terms (token, fine-tuning, inference) — rest on Wikipedia
paraphrase, community/localization pages, and translator judgment. Those are carried below because
they are the best available, but they are marked **⚠ community/editorial-grade, native-speaker
confirmation pending** at point of use.

Sources: <https://www.greek-language.gr/> ·
<https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/index.html> ·
<https://ins.web.auth.gr/> · <https://en.wikipedia.org/wiki/Greek_and_Coptic> ·
<https://en.wikipedia.org/wiki/Sigma>

---

## 3. Script & typography

**(Strong section — Unicode + Sigma + monotonic reference; four anchors spot-checked verbatim.)**

**Character inventory.** Greek is written in its own **24-letter alphabet** (Α α, Β β, … Ω ω),
left-to-right, with spaces separating words — so ordinary whitespace tokenization and word-based
highlighting work, with no RTL/bidi handling. The seven vowels **α ε η ι ο υ ω** can all carry the
accent.

**Unicode range.** Modern **monotonic** Greek — letters, tonos, diaeresis — lives entirely in the
**Greek and Coptic** block **U+0370–U+03FF** (en.wikipedia.org/wiki/Greek_and_Coptic — verbatim:
*"Greek and Coptic is the Unicode block for representing modern (monotonic) Greek"*; the block spans
U+0370..U+03FF, **135 code points assigned** of 144). The separate **Greek Extended** block
**U+1F00–U+1FFF** holds the polytonic accented vowels needed only for classical / pre-1982 texts —
**do not use it for modern content.** Authoritative code chart: unicode.org/charts/PDF/U0370.pdf.

**Monotonic orthography (post-1982) — one accent only.** Modern Greek uses a single accent, the
**tonos** (τόνος, acute ´), plus the **diaeresis** (διαλυτικά ¨). The grave, circumflex, and breathing
marks of the older polytonic system are **abolished** for modern text
(el.wikipedia.org/wiki/Μονοτονικό_σύστημα — the system keeps *"την οξεία (που ονομάζεται τόνος)"* and
omits *"την βαρεία, την περισπωμένη και τα πνεύματα"*).

- Accented vowel set: **ά έ ή ί ό ύ ώ** (plus diaeresis **ϊ ϋ**, and combined **ΐ ΰ**).
- Polysyllabic words take a tonos; most monosyllables do **not** — a few disambiguating exceptions
  exist (e.g. disjunctive **ή** "or" vs the feminine article **η**).
- ✅ modern (monotonic): **νοημοσύνη**, **μάθηση**, **δίκτυο**
- ❌ polytonic accents/breathings in modern UI copy: **νοημοσύνῃ**, **ἡ μάθησις** (classical only)

**Final sigma (ς vs σ) — the real casing/rendering hazard.** Lowercase sigma has **two positional
forms**: **ς** word-finally, **σ** everywhere else. The **uppercase is a single Σ** — there is no
capital final sigma (en.wikipedia.org/wiki/Sigma — verbatim: *"uppercase Σ, lowercase σ, lowercase in
word-final position ς"* and *"When it is used at the end of a letter-case word … the final form (ς) is
used"*; the article's own example: in *Ὀδυσσεύς* *"the two lowercase sigmas (σ) in the center of the
name are distinct from the word-final sigma (ς) at the end"*). Code that naively maps `Σ→σ` when
lowercasing an all-caps string, or that truncates / reflows / concatenates text, produces wrong medial
forms at word end. Proper Unicode case-folding is **context-sensitive** (the `Final_Sigma` rule).

- ✅ correct lowercasing: **ΟΔΥΣΣΕΥΣ → οδυσσεύς** · **ΜΑΘΗΣΗ → μάθηση** · **ΔΙΚΤΥΟΣ → δίκτυος**
- ❌ naive `Σ→σ` everywhere: **οδυσσευσ** · **δικτυοσ** (medial σ stranded at word end)
- ❌ hand-swapping σ/ς after concatenation or hyphenation instead of locale-aware casing
- **QA action:** never hand-swap σ/ς; rely on locale-aware lowercasing; spot-check every word-final
  sigma after any automated case change, truncation, or string concatenation.

**Accented capitals (rendering pitfall).** By Greek convention an **initial capital keeps its tonos**
(**Ά**, **Έ**, **Ήλιος**), but a word set in **ALL CAPS drops accents** (**ΑΘΗΝΑ**, not *ΆΘΗΝΑ*).
Verify the shipped font actually carries **precomposed accented capitals** (Ά Έ Ή Ί Ό Ύ Ώ) and the
lowercase accented vowels — some display/UI fonts render them poorly or omit them. (`⚠` best-practice;
no single quotable authority for the ALL-CAPS-drops-accents convention.)

- ✅ initial cap with tonos: **Ά**νθρωπος · **Έ**ξυπνο σύστημα
- ✅ all-caps, accents dropped: **ΤΕΧΝΗΤΗ ΝΟΗΜΟΣΥΝΗ**
- ❌ accents inside all-caps: **ΤΕΧΝΗΤΉ ΝΟΗΜΟΣΎΝΗ**

**Punctuation (two Greek-specific glyphs) — and the codepoint trap in them.** The **Greek question
mark (erotimatiko)** is the semicolon glyph **`;` U+003B**; never a Latin `?` in Greek text. The
**áno teleía**, the Greek equivalent of the English semicolon, is **`·` U+00B7**.

**Do not author or grep for `U+037E` / `U+0387`.** Those two Greek-named codepoints exist, but the
Unicode Character Database gives each a **singleton canonical decomposition** —
`037E;GREEK QUESTION MARK;…;003B;` and `0387;GREEK ANO TELEIA;…;00B7;` — and singleton
decompositions are **never recomposed**. So `NFC(U+037E) → U+003B` and `NFC(U+0387) → U+00B7`:
neither character can survive in NFC-normalized content, which is what this kit ingests everywhere.
An authoring rule that inserts `U+0387` is silently undone by the first `normalize('NFC')`, and a QA
grep for `U+0387` returns zero hits forever. Write and check the **normalized** characters `U+003B`
and `U+00B7` (§11). Period and comma look as in English (but see §5 for their numeric roles).

- ✅ question: **Τι είναι η τεχνητή νοημοσύνη;**  ·  ❌ **Τι είναι η τεχνητή νοημοσύνη?**

**Quotation marks — guillemets are primary.** The primary Greek quotation marks are **« »**
(guillemets / γωνιώδη εισαγωγικά); nested quotes use straight/curly double quotes. This is confirmed
by localization/community guidance in the dossier and by Unicode **CLDR `el` delimiters** (primary
`« »`, secondary `“ ”`). (The community citations — panepistimiaka-frontistiria.gr, lexilogia.gr —
are `⚠` community-grade; CLDR is the authoritative corroboration.)

- ✅ Greek: **«κάνε κλικ εδώ»** · ✅ nested: **«το πεδίο “όνομα” είναι υποχρεωτικό»**
- ❌ straight ASCII: **"κάνε κλικ εδώ"** · ❌ English curly as primary: **“κάνε κλικ εδώ”**

**Web fonts.** **Noto Sans / Noto Serif** (Google Fonts, allowed) have complete monotonic (and
polytonic) coverage with correct final-sigma shaping and precomposed accented capitals — a safe
default. For any brand font, verify it actually ships **ς**, the precomposed accented vowels/capitals,
and the Greek `;` / `·`. **Font subsetting can strip Greek** — request the **`greek`** subset
explicitly (`greek-ext` only if any classical/polytonic text is present).

**Romanization — not applicable in the UI.** Greeklish (Latin-keyboard transliteration such as
*nohmosynh*) exists informally but **must never appear in native-script UI copy**. There is no
romanization layer to build or display.

Sources: <https://en.wikipedia.org/wiki/Greek_and_Coptic> · <https://en.wikipedia.org/wiki/Sigma> ·
<https://el.wikipedia.org/wiki/Μονοτονικό_σύστημα_της_ελληνικής_γλώσσας> ·
<https://www.unicode.org/charts/PDF/U0370.pdf> ·
<https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt> (the `U+037E`/`U+0387` singleton
decompositions — read from the UCD on 2026-07-27, beyond the research dossier, which conflated the
two Greek-named codepoints with the glyphs `;`/`·`) (guillemet corroboration: CLDR `el` delimiters;
community: panepistimiaka-frontistiria.gr, lexilogia.gr `⚠`)

---

## 10. Technical integration checklist

- **Fonts to ship:** a font with **full monotonic Greek coverage** — the lowercase accented vowels
  (ά έ ή ί ό ύ ώ ϊ ϋ ΐ ΰ), the **precomposed accented capitals** (Ά Έ Ή Ί Ό Ύ Ώ), the **final sigma
  ς**, and the erotimatiko / áno teleía glyphs `;` (U+003B) / `·` (U+00B7) — see §3 on why the
  Greek-named `U+037E` / `U+0387` never reach the font. A **Noto** family (Noto Sans / Noto Serif) is the
  safe default. Missing precomposed accented capitals and a missing/badly-shaped **ς** are the top
  Greek rendering defects (§3).
- **Font subsetting:** request the **`greek`** subset explicitly (`greek-ext` only for
  classical/polytonic passages). Naive subsetting silently strips Greek glyphs (§3).
- **`lang` / `dir` attributes:** `lang="el"` (base) and `lang="el-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Final-sigma-safe casing:** any uppercase↔lowercase transform, truncation, reflow, or
  concatenation must use **locale-aware, `Final_Sigma`-correct** casing — never a naive `Σ→σ` map.
  Lint for a medial **σ** at word end and a **ς** anywhere but word end (§3, §11).
- **Quotation marks:** normalize straight/English quotes in body copy to Greek **« »** (guillemets),
  nested **“ ”** (§3).
- **Greek question mark:** ensure the erotimatiko renders as `;` (**U+003B**), not a Latin `?`, in
  Greek text. Do **not** normalize to or lint for `U+037E` — NFC folds it to `U+003B` (§3).
- **Numbers / dates / currency in display vs identifiers:** display per §5 (dot grouping, comma
  decimal, `1.234,50 €` with the euro **after** the amount, `26/07/2026`, 24-hour time); keep Western
  digits and ISO 8601 (YYYY-MM-DD) for backends/identifiers/code.
- **Index alphabet for glossary navigation:** use **Greek (CLDR `el`) collation** —
  `α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ/ς τ υ φ χ ψ ω` — with **σ and ς collating as the same letter**,
  and accented vowels collating with their base vowel. Drive this from CLDR, not a raw
  codepoint sort.
- **No romanization step:** Greeklish must never surface in the UI — there is no transliteration layer
  to build or display (§3).

Sources: <https://en.wikipedia.org/wiki/Sigma> · <https://en.wikipedia.org/wiki/Greek_and_Coptic> ·
<https://www.unicode.org/charts/PDF/U0370.pdf> · CLDR `el` (collation, numbers — cite current release).

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script-ratio expectation:** `el` body copy should be **overwhelmingly Greek-block codepoints
  (U+0370–U+03FF)**. A near-total absence of Greek letters, or a body of Latin letters where Greek is
  expected, signals untranslated or **Greeklish** output — flag it.
- **Final-sigma integrity:** flag any **medial σ (U+03C3) at word end** and any **final ς (U+03C2) not
  at word end** — the classic defect after a naive case change, truncation, or concatenation (§3, §10).
- **Monotonic-only accents:** flag **polytonic marks** (grave, circumflex, breathings — Greek Extended
  U+1F00–U+1FFF) in modern content; modern Greek uses **only the tonos and diaeresis** (§3). Also flag
  **accents inside ALL-CAPS** words (convention: caps drop accents).
- **Forbidden punctuation in body copy:**
  - No **Latin `?`** in Greek text — the Greek question mark is the semicolon glyph `;` (**U+003B**).
    Write the check against `U+003B`, **not** `U+037E`: NFC folds `U+037E → U+003B`, so a
    `U+037E` grep can never match normalized text (§3). Likewise an áno-teleía check must look for
    `·` **U+00B7**, not `U+0387`. Note the consequence: after normalization the Greek question mark
    and the Latin semicolon are the **same codepoint**, so the only mechanical check available is the
    positive one — flag `?` in Greek body copy — not a codepoint-presence test for a "Greek" mark.
  - No **straight ASCII quotes `"` `'`** and no **English curly `“…”` as the *primary*** — Greek body
    copy uses **« »** (U+00AB / U+00BB), nested **“ ”** (§3).
  - No **period-as-decimal or comma-as-thousands** inside numbers — Greek uses **comma decimal + dot
    grouping** (`1.234,50`, not `1,234.50`) (§5).
- **Currency spacing/position:** the **€** must follow the amount with a space (`1.234,50 €`); flag a
  leading `€ 1.234,50` or a glued `1.234,50€` (§5).
- **Register consistency (εσύ):** εσύ (informal singular) is the recorded register (§4) — scan
  second-person copy for **stray εσείς / 2pl forms**: 2pl verb endings (*-ετε*, e.g. *πατήστε,
  αποθηκεύσετε, μπορείτε*), the pronoun *εσείς*, and 2pl imperatives, **outside** legal/formal notices.
  Because Greek is pro-drop, the tell is usually the **verb ending**, not a pronoun.
- **Latin-homoglyph leak:** flag Latin letters that impersonate Greek ones inside otherwise-Greek
  words — Latin `o/a/e/p/x/y/v` for Greek `ο/α/ε/ρ/χ/υ/ν` — a common copy-paste corruption invisible
  to the eye but wrong to search/collation.
- **Source-language leak scan (EN → EL):** left-in English function words (the, and, you, please),
  dictionary-form (nominative) nouns where an oblique case is required (§4), or English number/date
  formatting surfacing in Greek text.

Sources: <https://en.wikipedia.org/wiki/Sigma> ·
<https://el.wikipedia.org/wiki/Μονοτονικό_σύστημα_της_ελληνικής_γλώσσας> ·
<https://en.wikipedia.org/wiki/Greek_and_Coptic> · CLDR `el` (numbers/collation — cite current release).

---

*Provenance note:* this guide was **authored from a single agent-native research dossier
(self-fetched, quote-per-claim), then independently reviewed against its cited sources.** Four
load-bearing anchors were re-fetched and confirmed verbatim (Unicode **Sigma**, **Greek and Coptic**
block, **Πληθυντικός ευγενείας**, **Τεχνητή νοημοσύνη**). Its **strong** sections (§2 authorities,
§3 typography, §5 numbers/currency, and the sourced core of §6 terminology) rest on Unicode / CLDR /
the Triantafyllidis tradition / Greek Wikipedia and carry verbatim quotes; its **thinner** sections
(§4 grammar examples, §7 idioms, §8 simplified language, §9 regional variation, and the newest AI
terms in §6) rest on Wikipedia paraphrase, community/localization pages, and translator judgment, and
are marked **⚠ community/editorial-grade, native-speaker confirmation pending** at point of use. Every
⚠ / fallback marker the dossier set has been preserved; the newest AI terms (token, fine-tuning,
inference, hallucination) have **no settled Greek authority** and are kept `⚠`. A **native-speaker
review** against the §2 sources is still outstanding (see Status in the header).
