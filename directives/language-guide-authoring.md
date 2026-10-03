<!-- base -->
# language-guide-authoring — directive

How to research and write a **language guide** — the durable, sourced reference for one
target language that a translator (human or agent) loads before touching that language.
[translation-quality](translation-quality.md) sets the universal bar (levels, terminology
classes, checks); a language guide is the language-specific layer underneath it: script,
grammar traps, number formats, idiom anti-patterns, and the local simplified-language
tradition. One guide always covers **both** the base language and its simplified variant.

## Two files, one guide

A guide is **two files**, split by *when* a reader needs a section — not by what kind of
content it is:

| File | Sections | Read |
|---|---|---|
| `directives/languages/<code>.md` | §1, §4–9 | on **every** translation job |
| `directives/languages/<code>.setup.md` | §2, §3, §10, §11 | **once**, when the language is added or verified |

Script inventories, font lists, `lang`/`dir` values and build-side verification are
settled once and then never consulted again while translating. Measured across the
corpus they are ~43 % of a guide, so leaving them in the working file made every
translation job carry them for nothing.

**Section numbers never change across the split.** A guide's prose refers to its own
sections constantly ("see §3", "the §2 authorities") — those references are plain text,
not links, and they stay correct only as long as a section keeps its number. §3 is
therefore §3 in both files, and the numbering in each file has gaps. That is intended;
`check-language-guide.mjs` knows which half owns which sections.

Only `<code>.md` is registered in [`directives/index.yml`](index.yml) (`id: lang-<code>`,
BCP 47 code, lowercase) — the setup file is reached from the guide's header pointer, so
the index keeps one entry per language rather than two.

## When to write one

- **Before the first bulk translation** into a language — a bulk run without a guide
  reproduces the same defects a hundred times.
- When reviews of an existing language keep surfacing the same class of finding — the
  guide is where that lesson becomes durable instead of re-learned.
- A guide may be written for a *planned* language ahead of need; mark its status in the
  header so nobody mistakes "guide exists" for "language shipped".

## The template

Every guide has these eleven sections, in this order. Each section states rules a
translator can act on — with a **right/wrong example pair in the target script** for every
rule that has a failure mode. A section that genuinely doesn't apply (e.g. regional
variation for Icelandic) says so in one line rather than disappearing.

1. **Header block.** Language name (native + English), BCP 47 code(s) incl. the simplified
   variant, speaker reach, script + direction, status (shipped / planned), and one line on
   what makes this language easy or hard for this kit (fonts, tokenization, shaping).
2. **Authorities & primary sources.** The national language academy / institute, the
   orthography reference, the Unicode chart for the script, one or two major localization
   style guides. Every claim in the guide must trace to one of these — this section is the
   guide's evidence base, not decoration.
3. **Script & typography.** Character inventory essentials, Unicode range(s), direction
   (an RTL guide must cover mirroring and bidi implications), whether whitespace
   tokenization works, required fonts, and known rendering pitfalls (conjuncts, shaping,
   combining marks), punctuation and quotation conventions, and the rule that
   romanization never appears in the UI.
4. **Grammar for translators.** Word order; the register/politeness system **and the
   project's chosen register** (that choice is an author decision the user approves —
   [human-gate](human-gate.md) — the guide records it, never invents it); then the three
   to five grammar features that break naive translation (gender/agreement, noun classes,
   ergativity, pro-drop, measure words…), each with a wrong/right pair. When the research
   supplies no contrastive pair for a feature, the legitimate move is **correct-form-only,
   gap-flagged**: give the sourced correct form, flag the missing pair explicitly for the
   next research round — never fabricate target-language prose to fill the slot, and never
   leave the absence unflagged.
5. **Numbers, dates, currency.** Digit system (native digits vs Western, and when each is
   used), grouping system (not every language groups by thousands), decimal separator,
   date and time formats, currency symbol placement.
6. **Terminology strategy.** Transliteration conventions, the loanword policy (when an
   established loanword beats a native coinage), the sandwich pattern from
   [translation-quality](translation-quality.md) instantiated in this language, and a
   small seed table of the project's *field* vocabulary (the term-sheet owns project
   coinages; this table owns the field's standard terms in this language).
7. **Idiom anti-patterns.** The source language's recurring idioms and stock phrases with
   their idiomatic target rendering — and the literal rendering explicitly marked wrong.
   This is the single highest-yield section: literal idiom transfer is the most common
   review finding across languages.
8. **Simplified-language pendant.** The language's own plain-language tradition and its
   authorities (many languages have one — with its own name, rules, and organizations),
   its sentence-length norm, where it differs from the kit's base rules in
   [accessibility-workflow](accessibility-workflow.md), the term-preservation rule
   restated (keep the technical term, explain it — never a folksy stand-in), and a short
   complex→everyday word table for this language.

   **When no codified plain-language norm exists, the pendant is built, not skipped.**
   Roughly half the languages in a broad set have no standard to cite, and inheriting the
   kit's base rules wholesale leaves a translator with nothing language-specific at the
   exact point where the language matters most. Instead, follow §8's *uniform substitute
   procedure* below. An honest `❌ no standard was located` opens the section — and is
   then followed by a ruleset, not by silence.
9. **Regional variation.** Which regional standard the project targets and why; a
   differences table (script, currency, vocabulary tendencies) when the language spans
   regions. State the neutrality strategy explicitly.
10. **Technical integration checklist.** Fonts to ship, `lang`/`dir` attribute values,
    the A–Z (or script-appropriate) index alphabet for glossary navigation,
    line-breaking/hyphenation behavior, anything the build or a highlighting feature
    needs to know about tokenization.
11. **Verification additions.** Language-specific deterministic checks that plug into the
    check list in [translation-quality](translation-quality.md): a script-ratio
    expectation, a forbidden-character list, digit-system consistency, typical
    source-language leak patterns for *this* pair.

## §8's uniform substitute procedure — when no standard exists

Every guide whose language has no codified plain-language norm uses **these subsection
labels, in this order**. Uniformity is the point: a translator moving between languages
should find the same seven answers in the same seven places, and a reviewer should be
able to tell a missing answer from a differently-worded one.

- **8a. The honest negative.** What was searched, in which languages, and what came back.
  Name the bodies that *would* hold such a standard if it existed. `❌` when the absence
  is established, `⚠` when the search was inconclusive — those are different claims.
- **8b. Name the axis.** What actually makes text harder or easier *in this language* —
  and it is rarely vocabulary alone. Candidates seen so far: learned/borrowed vs
  inherited stratum, morphological weight, register, sentence architecture. Sourced.
- **8c. Measure the axis.** The axis is a hypothesis until counted. Take **two corpora
  from one publisher** (a standard edition and a plainer one — children's, learners', or
  simplified news), plus one independent cross-check, and report frequencies. State the
  method and the corpus size in the guide: a reader must be able to disagree with the
  measurement, which means seeing it.
- **8d. 🔴 The do-NOT-simplify list.** The rows where the measurement **contradicts the
  instinct**. This is the highest-value output of the whole procedure and the one a
  translator will otherwise get backwards. A section without it is not finished.
- **8e. 🔑 The address decision.** Whether the simplified variant changes the
  politeness/address form. The recurring finding is that it must **not** — informality
  reads as condescension toward exactly the audience the variant serves. State the
  decision and its reason, never leave it implied.
- **8f. What the pendant is built on.** Structure, morphology, or vocabulary — in order of
  leverage for this language, with the base rules it overrides named explicitly.
- **8g. What is still open.** The questions the research could not close, phrased so the
  next round can pick them up. An empty list here is a claim, not a formality.

**The naive assumption is measurably false.** Across the languages measured so far, the
learned or borrowed word is *not* reliably the harder one; the "simplification" a
translator reaches for first often replaces a common word with a rarer one. That is why
8c precedes 8d, and why 8d is worth more than the substitution table above it.

**A measurement may override one of the kit's own base rules — and when it does, say so
in 8f.** The kit's simplified-language rules were calibrated on English, and not all of
them transfer. Two have already failed under measurement: the blanket "prefer the active
voice" (one language's own easy-read standard permits the passive, and its easy-read
corpus uses it slightly *more* than standard news), and the ~8–12-word sentence target
(strongly confirmed in some languages, statistically insignificant in one where
morphological load carried the register instead). A base rule that a language's corpus
contradicts is an English artifact, not a finding about that language. Record the
override with its numbers; do not quietly restate the base rule as though it had been
checked.

## The research path

Research one language properly and you are looking at dozens of fetches, hundreds of
pages, and a corpus you counted yourself. Four stages, deliberately separated so that no
single pass both gathers a fact and decides it is true:

1. **Research → a dossier file.** One agent per language, with its own web access,
   answering the brief below. Every claim carries a **verbatim quote** from the page it
   came from, or the marker `⚠ unverified`. Output is a **file on disk**, not a chat
   report. This matters beyond tidiness: a dossier survives a lost session, a context
   limit and a budget reset, so research is banked progress rather than work in flight.
2. **Blind transform.** A second agent writes the guide with **the dossier as its only
   content source** — no web access, no prior knowledge, and *no facts smuggled in
   through the prompt*. If it is not in the dossier, it does not enter the guide.
3. **Independent review.** A third agent, fresh, checks the guide **against the dossier's
   cited sources** at byte level. It narrows, flags, and removes; it does not add.
4. **Deterministic gates.** `check-language-guide.mjs`, `verify-harness.mjs`,
   `check-genericity.mjs`. Mechanical defects belong to a script, never to a reviewer.

Then commit — **strictly serially, one language at a time**, and bank a finished guide
before the review rather than holding the whole batch until the end. Work that is not
committed is work that a limit can take away.

**Triage, then a mini-brief rather than a bigger gun.** After the transform, count the
sections whose support is weak or unsourced. If that is several — half or more is a good
trigger — don't accept the gaps and don't rerun the whole brief at greater depth.
Generate a **targeted follow-up mini-brief** containing only the thin sections'
questions, run it, and fold the results in. Cheap standard research plus one targeted
follow-up beats one expensive pass for most languages; reserve deep research for
languages where even the standard pass returns mostly community content.

### Research brief template

````text
Research the following for the language <LANGUAGE> (BCP 47: <code>), for use in
translating an educational web platform. Begin with a one-paragraph profile:
approximate number of speakers (with source), where it is spoken, official
status. Then answer the sections below. For EVERY answer, cite a source URL —
prefer official bodies (language academies, Unicode, standards organizations,
major style guides), and cite the CURRENT version of any standards chart or
locale-data reference (e.g. the latest CLDR release, not an archived one).
Mark anything you cannot source as "unsourced".

A. Script & typography: writing system and Unicode range(s); text direction;
   whether words are whitespace-separated; hyphenation and line-breaking rules;
   fonts commonly required on the web and known rendering pitfalls; punctuation
   and quotation-mark conventions; rules on romanization in native-script text.
   For right-to-left languages, additionally: the bidi engineering toolbox for
   the web — the bdi element, LRM/RLM marks, the unicode-bidi CSS property,
   placeholder/interpolation order in template strings with embedded LTR
   content, neutral-character traps next to digits (ranges, percent,
   parentheses), and UI-mirroring conventions (icons, progress direction).
B. Authorities: the national language academy/institute(s) and their online
   references; the most widely used orthography/style guides for digital content.
C. Grammar for translators: basic word order; the politeness/register system and
   which register educational platforms conventionally use; the 3–5 grammar
   features most likely to break a naive translation from <SOURCE LANGUAGE>, each
   with a short example.
D. Numbers, dates, currency: digit system(s) in web use; digit grouping; decimal
   separator; common date/time formats; currency symbol(s) and placement.
E. Technical/scientific terminology: how established loanwords vs native
   coinages are handled in practice; standard transliteration conventions; the
   accepted terms for ~15 core concepts of <FIELD> in this language.
F. Simplified/plain language: this language's plain-language or easy-read
   traditions, named or not — which organizations maintain rules for them, any
   quantitative rules (sentence length, vocabulary, layout), whether an official
   standard or guideline document exists. Say explicitly which bodies you
   checked and what came back: an established absence is a finding, a search
   that ran out of road is a different one.
   If NO codified standard exists, do not stop there — instead:
   F1. Name the axis that actually separates harder from plainer text in this
       language (word stratum, morphology, register, sentence architecture),
       with sources.
   F2. MEASURE that axis. Take two corpora from a single publisher — a standard
       edition and a plainer one (children's, learners', or simplified news) —
       plus one independent cross-check, and report per-word frequencies with
       the corpus size. Do not assert the axis; count it.
   F3. Report the pairs where the measurement CONTRADICTS the intuition that
       the learned or borrowed word is the harder one. These reversals are the
       most valuable rows in the whole answer.
   F4. State whether the simplified variant should change the address or
       politeness form, and why.
   Then a table of ~10 complex/formal words with the everyday equivalents
   simplified text would use instead — each row marked with its evidence.
G. Regional variation: major regional standards, how they differ (script,
   spelling, vocabulary, currency), and what "neutral" usage looks like —
   including vocabulary that marks religious or community affiliation, and how
   neutral editorial writing handles it.
H. Idiom transfer: 8–12 stock phrases and metaphors common in <SOURCE LANGUAGE>
   educational/technical writing (e.g. "step by step", "under the hood"), each
   with an idiomatic rendering in <LANGUAGE> and the literal word-for-word
   calque shown and marked as wrong.
````

Replace `<FIELD>` with the project's actual domain so section E returns usable seed
terminology. Keep the brief itself vendor-neutral — it must run in any research tool.

## What goes wrong — learned the expensive way

Every item here cost a real defect in a committed guide. They are listed in the order
they bite.

- **The transform prompt is not a source.** A fact copied into the prompt from a research
  agent's *chat report* — rather than from its dossier file — is an unsourced claim
  wearing the dossier's authority. One reached a guide this way and the reviewer caught
  it. If it is not in the file, it does not go in the prompt either.
- **Minted terms.** A blind transform under pressure to fill a table will *coin* a
  plausible word in the target language. Detect it with a **token diff**: extract every
  target-script token from the guide, diff against the dossier, and investigate every
  token that is not a literal carry-over. It is mechanical and it finds what reading
  cannot.
- **Over-reading a real source.** More common than fabrication and much harder to see:
  the citation is genuine, the claim is a size larger than the citation supports. Review
  has to compare claim against quote, not merely check that a quote exists.
- **Inversions.** A guide occasionally states the *opposite* of what its cited source
  says. Only a byte-level read against the source catches this; no amount of internal
  consistency will.
- **A reviewer finding can itself be wrong.** One reviewer "corrected" a character count
  against its own runtime's Unicode version and was wrong on both the count and the
  reason; the dossier had been right. When a review contradicts a dossier, the tie is
  broken by the *authoritative data file*, not by whoever spoke last.
- **Checks that can never fire.** A verification rule written against a shape the corpus
  does not contain reads as coverage and is worth nothing. Before trusting a new check,
  confirm it fires on a known-bad case.
- **Scrub escapes hide in inline code.** A vendor name looks like a technical token
  inside backticks and slips past both eye and a naive filter. The scrub check must read
  the view that *retains* inline code.
- **Character claims vs bytes.** A guide can name a codepoint a dozen times and contain
  none of it — its own examples quietly using an ordinary space. Byte census, not
  proofreading: every named codepoint must be physically present, and every ✅/❌ pair
  must be byte-distinct.
- **A corrupted fetch layer is not a corrupted source.** When a page comes back with
  mangled characters, fetch the raw bytes directly and parse locally before recording the
  source as broken.

### Measuring a corpus without fooling yourself

§8c produces numbers, and a number is believed in a way prose never is. Each of these
produced a *confident wrong result* before it was caught.

- **Verify the tokenizer on a word that cannot be rare.** An HTML-entity decoder that
  blanks unknown named entities silently deleted every `î` and `â` from a Romanian
  corpus; the frequency tables that followed looked entirely plausible. It was caught by
  counting the preposition `în` and getting **zero**. Before trusting any count, count
  something whose answer you already know.
- **Word boundaries are ASCII-only in most regex engines.** `\b` splits every word at a
  diacritic, so a naive pattern silently measures fragments. Use explicit
  `(?<!\p{L})` / `(?!\p{L})` lookarounds.
- **Strip the template before counting.** Page-builder shortcode residue made up 37 % of
  one easy-read corpus and manufactured 65 hits for a word that was not in the prose at
  all. A publication's own furniture — glossary headers, "easy read" banners, boilerplate
  — is not evidence about the language.
- **Let the data pick the rows.** Run a keyness or over/under-representation pass *first*,
  then write the probe list. Probing a list you wrote from intuition measures your
  intuition.
- **Two corpora are not enough.** Always add a **third, genre-matched** corpus. On one
  language it killed three findings the single publisher pair would otherwise have
  shipped as register rules — the pair had been measuring topic, not register.
- **Distinguish "not reachable by me" from "not reachable".** Record a failed fetch as a
  fact about the pass, never as a property of the source; see the same rule for mangled
  characters above. A source recorded as blocking is never retried. The subtle form: a
  host that answers an automated client with **HTTP 202 and an empty body** — including
  for `robots.txt` itself, so no policy can even be read. That is a challenge, not a
  refusal, and the two belong in different rows of §8c.
- **Respect `robots.txt`.** Several of the ideal same-publisher pairs disallow automated
  crawling by name. That is a real constraint on the method, not an obstacle to route
  around: say in 8c which pair you could not build and why. **The rule is deliberately
  conservative, and it is not to be relaxed case by case by whoever happens to want the
  corpus** — that reasoning is exactly what a rule like this exists to prevent. When the
  named agent is arguably not a text-collection agent, record the nuance in 8c and respect
  the refusal anyway.
- **A "we found nothing" negative reached without search is worth re-running, and it is
  worth re-running with the *right kind* of query.** Four guides carried such a negative
  and said so honestly. Re-run with search, two reversed. One of them reversed for a
  mechanical reason worth naming: the first pass probed **host names** (`ligetil.dk`,
  `letnyt.dk` …) and the publication it concluded did not exist is a **path** on the
  broadcaster's main domain. Probing invented hostnames can only ever find publications
  that happen to have their own domain.
- **The extraction can invert a result as easily as a page number can.** A lost sentence
  boundary merges sentences the way a stray page number splits them: 220 periods
  decoded as a letter, and the easy-read half measured a *longer* mean sentence than the
  standard half. **Check the direction of a sentence-length figure against the corpus's
  other statistics** — long-word share and type/token ratio — before believing it. When
  they disagree, the extraction is wrong, not the language.

### PDFs, when the plain side is a set of leaflets

For several languages the only plain-language material an issuing body publishes is PDFs,
and a corpus that exists and is permitted must not be recorded as unavailable because the
pipeline read HTML. `corpus-measure pdf` handles the format; these are its traps.

- **Embedded text first, always. OCR only for genuine scans, and then mark the tier.**
  Most digitally typeset documents carry a text layer. OCR is slower and has its own error
  class — confused characters and lost diacritics — so every row derived from an OCR'd
  source is a **different evidence tier** and says so. A document with no text layer is
  **reported as a probable scan**, never silently contributed as an empty string.
- **🔴 A broken font encoding reads as text, and a script check cannot see it.** A subset
  font with a damaged character map put 27 % of an Italian document into Latin Extended-A —
  which *is* Latin, so it passes a script test and produces a frequency table that looks
  entirely plausible. **Always pass `--alphabet` with the letters the language actually
  uses** (§3 of the guide lists them), and **confirm the gate fires on a known-bad document
  before trusting it**.
- **The damage is rarely random, so dropping the damaged part is not a safe fallback.** In
  that document the affected lines were exactly the ones carrying *ti*, *tt*, *ff*, and *fi*
  ligatures — i.e. the *-zione* and *attività* vocabulary the measurement was about.
  Dropping them would have deleted the evidence and left a clean-looking table.
- **A license or attribution front page is furniture the recurring-line stripper cannot
  see**, because the author and the level change from file to file. On a short children's
  book it is a large share of the text, and it moved the plainer corpus's mean sentence
  length the wrong way. `--drop-until` cuts it.
- **Not every document that looks like a corpus is one.** A "glossary" chased for two
  passes as a possible sourced complex→everyday word list turned out to be a
  *respectful-terminology* style guide — about which word dignifies a person, not which
  word is harder. Read enough of a document to know what kind of document it is before
  planning a measurement on it.

**Cost reality.** A language done properly through all four stages runs to roughly
650k tokens across three sequential agents; a §8-only measurement pass on an existing
guide runs 110k–280k depending on how hard the corpus is to find. §8c is the expensive
step either way — it means fetching and counting hundreds of articles. Budget **per
language, not per batch**, say the number out loud before starting a wave, and measure
the first language before extrapolating to the rest.

**Most of that cost is avoidable, and the fix is a script.** The dominant expense is not
reasoning and not writing — the written §8 is ~200 lines, under 1 % of the spend. It is
that every fetched page stays in context and is re-sent on every subsequent step, ~2.5k
tokens per tool call across 80–160 calls. Fetching, tokenizing, tallying, and keyness are
ordinary programs; run them **as committed scripts** whose output is a frequency table on
disk, and the model reads the table instead of the corpus. That also makes the
measurement reproducible, which a model counting inside its own context can never be.

## Quality bar

- **Evidence over prose.** Every rule traces to section 2's authorities; Unicode facts
  link the official chart; no belief-based tables. Unsourced research output is verified
  or visibly marked — never silently kept.
  ([content-integrity](content-integrity.md) source-tier discipline applies.)
- **Native-script examples.** A rule without a right/wrong pair in the actual script is a
  claim, not a rule.
- **Fresh content only.** Never import text from another project's language guides —
  write from primary sources. (Same rule as [guide-authoring](guide-authoring.md).)
- **Register is a user decision.** The politeness/register choice shapes every sentence
  in the language; it is approved like a term-sheet, then recorded in section 4.
- **Second set of eyes.** A new guide gets a review pass by a fresh model against the
  cited sources; when a native speaker is available, prefer them. If neither happened,
  the header says so — honest status ([QUAL-007](../base/standards/QUALITY.md)).

## Work already scoped and waiting

Improvements to existing guides that are blocked only on someone doing them — with what was
already tried, what failed and why, and the exact next step — live in
[`docs/LANGUAGE-GUIDE-BACKLOG.MD`](../docs/LANGUAGE-GUIDE-BACKLOG.MD). Read it before
starting fresh work on a language: two of the entries are extraction faults in this kit's own
tooling rather than gaps in the world, and one is a corpus that already exists and only needs
folding in. Add to it whenever a pass ends with something scoped but undone — a backlog entry
costs a paragraph, rediscovering the same dead end costs a whole research round.

## Keep this directive in lockstep

Any change to the template — sections added, removed, reordered, moved between the two
files, or the research brief — updates **this directive and
`scripts/check-language-guide.mjs` in the same commit**, and existing guides get a
follow-up migration wave (tracked, not silent). The checker encodes which half owns which
sections; a template change that skips it either passes broken guides or fails correct
ones. A stale template mass-produces structurally inconsistent guides; see the same rule
in [guide-authoring](guide-authoring.md).
