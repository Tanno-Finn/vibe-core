<!-- base -->
# Language-guide backlog

Work that would measurably improve `directives/languages/*.md` and is **not** blocked on a
decision — only on someone doing it. Each entry states what is known, what was already
tried and failed, the exact next step, and how to tell it worked.

Written for an agent picking this up cold. You should not need to rediscover anything here.

**Method and conventions:** [`directives/language-guide-authoring.md`](../directives/language-guide-authoring.md)
— read its "§8's uniform substitute procedure" and "Measuring a corpus without fooling
yourself" sections before starting. **Tool:** [`scripts/corpus-measure.mjs`](../scripts/corpus-measure.mjs).

---

## The tool in one screen

```bash
# collect
node scripts/corpus-measure.mjs fetch --wp        https://example.org      --out plain.json --max 250
node scripts/corpus-measure.mjs fetch --sitemap   https://example.org/sitemap.xml --out c.json --match '\-[0-9]{7}$'
node scripts/corpus-measure.mjs fetch --mediawiki https://example.org/api.php --random --out c.json
node scripts/corpus-measure.mjs fetch --urls      list.txt --selector 'itemprop="articleBody"' --out c.json

# describe (ALWAYS pass --sanity with a word that cannot be rare in the language)
node scripts/corpus-measure.mjs stats plain.json --sanity <word>

# contrast
node scripts/corpus-measure.mjs compare plain.json standard.json --top 30 --min 40
node scripts/corpus-measure.mjs compare plain.json standard.json --probe pairs.txt
```

`pairs.txt` is one candidate per line, `formal everyday`.

**Verdicts and what they mean.** A direction needs a **1.25×** ratio. Rows under **3 per
100k** — including when only the *formal* member is that rare — are reported as too thin to
judge. `untestable` means the corpora cannot see the word at all. **`untestable` and `thin`
are not `flat`, and none of them is a refutation.** Keeping those apart is the whole point;
see the finding below.

**The tool refuses** any host whose `robots.txt` disallows `/` for `User-agent: *` or for a
named automated text-collection agent, and any endpoint blocked by a path rule. **That
refusal is a finding for §8c, not an obstacle to route around.** Do not look for a way past
it and do not swap in a different user-agent string.

---

## 1 · PDF text extraction — ✅ done, and Italian turned out better than expected

**Done 2026-07-29.** `corpus-measure.mjs` has a `pdf` command (embedded text via `pdftotext`,
scans reported rather than OCR'd, `--alphabet` gate against broken font encodings). Italian's
§8 is rewritten on **two measured pairs**; see `directives/languages/it.md` §8c.

**What the pass found that the plan did not anticipate — and what generalizes:**

- **The glossary is not a plain-language word list.** *"Le Parole Giuste"* is a
  **disability-language style guide** (which term respects the person) derived from a North
  American journalism style guide. It settles **no** row of §8b. The hope recorded here —
  "a sourced list could settle or kill seven craft rows" — was wrong about what the document
  is. Do not chase it again.
- **It contains something better: its own easy-to-read edition, bound into the same volume.**
  That is a *same-document* pair — publisher, house style, topic, year, and content all held
  constant, register the only variable — which is stronger than the same-publisher pair this
  entry was chasing.
- **A broken ToUnicode CMap reads as text and no script check can see it.** 27 % of that
  document extracted as Latin Extended-A/B noise, and the loss was **not random**: the
  affected lines were exactly the ligature-bearing ones (*ti*, *tt*, *ff*, *fi*), i.e. the
  *-zione* vocabulary the measurement was about. Dropping them would have produced a
  plausible-looking table built on deleted evidence. Hence `--alphabet`, which was confirmed
  to fire on that document before being trusted.
- **A lost period is the same artifact as a page number.** 220 sentence-final periods
  decoded as the letter `K`; until that was fixed the easy-read half measured a *longer* mean
  sentence than the standard half. Always check that the direction of the sentence-length
  figure is the one the corpus's own long-word and type/token figures point to.

---

## 2 · Hausa — ⛔ the adult source said no, and the premise of this entry was wrong

**Done 2026-07-29, with the opposite outcome to the one planned.** The graded-book faults are
fixed; the broadcaster is closed.

- **⛔ The broadcaster is not "permitted".** Its `robots.txt` carries, alongside its narrow path
  rules, `User-agent: AhrefsBot` / `Disallow: /`. Under this kit's rule — a host that disallows a
  named automated collection agent outright has stated its position — the collector **refuses**
  it, and the refusal was not overridden. The claim in the first version of this entry ("no named
  agent block") was **false**; it had been carried from an earlier pass without re-reading the
  file. **Do not re-open this host.** A licensed or manually agreed route is the only route.
  The nuance, for whoever weighs it next: the named agent is a commercial link-index crawler, so
  this is a conservative reading — and the rule is deliberately conservative precisely so that it
  is not relaxed by whoever happens to want the corpus.
- **✅ Both graded-book faults fixed, in the tool rather than by hand.** `pdf` mode strips
  standalone page numbers, and `--drop-until` cuts a license front page that does not repeat
  verbatim (author and level change, so the recurring-line stripper cannot see it) — that front
  page was adding four long sentences to every short children's book. Sentence length now runs
  the right way: **10.61 words at levels 1–2 against 14.93 at level 3**, superseding the
  backwards 22.92 / 16.90.
- **⚠ The title counts in this entry did not reproduce.** Re-enumerating the publisher's own
  approved list returns **62** Hausa (Nigeria) titles (19/22/12/8/1), not 141 (29/40/45/21/6).
  Unresolved; recorded in `ha.md` §8c as a discrepancy rather than silently overwritten.
- **The word list is still unusable and re-balancing did not change that.** 12 titles on the
  standard side still puts character names and story props at the top of the keyness list. One
  usable statistic in a corpus does not make the corpus usable.

**Still open:** which *other* permitted Hausa adult-register publisher exists. That is the
question now, not how to extract from the closed one.

---

## 3 · Punjabi — ✅ re-measured, and five rows changed verdict

**Done 2026-07-29.** Re-crawled and §8c/§8d rewritten. The publisher-matched side went from
**6,673 to 58,602 tokens**; children's 20,603 → 57,565; genre-matched 24,400 → 85,812.

**The open question is settled, and the answer is "publisher".** Within **one publisher**, the
children's encyclopedia and the adult subject encyclopedias sit **1.3 words apart** — 18.09 against
19.41, same median, same short-sentence share. The corpus that is different (14.04) belongs to the
**other** publisher. So the backwards sentence-length finding is **house style, not register**: this
house does not shorten sentences for children, and `pa-easy`'s ≤ 12-word target departs from Punjabi
publishing practice rather than tidying it.

**Five rows changed verdict, and the flagship went first.** ਪਰੰਤੂ → ਪਰ, reported as an 8.9×
reversal on 15 tokens, is now **flat**. ਕਾਰਜ → ਕੰਮ and ਪ੍ਰਸ਼ਨ → ਸਵਾਲ **reversed**. ਜਲ → ਪਾਣੀ inverted
twice over. ਪੁਸਤਕ → ਕਿਤਾਬ went from "no signal" to running the intuitive way. **Two rows survive**:
ਪ੍ਰਯੋਗ → ਵਰਤੋਂ in both pairs, ਆਰੰਭ → ਸ਼ੁਰੂ in the controlled one.

**Two things worth carrying to other languages:**

- **The largest signal in the comparison was orthographic.** ਵਿੱਚ / ਵਿਚ and ਇੱਕ / ਇਕ dominate the top
  of the keyness table — the same words under two house spellings, at ratios of 30 : 1 and better.
  A keyness list hands that to you as vocabulary. **Check the top rows for spelling policy before
  reading them as register.**
- **The tool's own defects show up in the keyness list, which is where to look for them.** An
  undecoded `&ndash;` ranked as a word at 1,070 per 100k in one corpus, and inline markup inside a
  word split ਗੁਰੂ into fragments that ranked too. Both were caught by *reading the top of the table*,
  not by inspecting the corpus.

**Still open, and it is not size:** the crawl is a breadth-first walk of the link graph (the platform
has no sitemap and a dead autocomplete endpoint), so it is **topic-clustered by construction**. More
pages means more of the same neighborhood. And these are still encyclopedias from two Patiala
houses; a newspaper with a children's supplement, or a graded schoolbook pair, is what would show
whether any row is a Punjabi register fact at all.

---

## 4 · Four weak negatives — ✅ re-scouted with search, and two of the four changed

**Done 2026-07-29.** Every candidate below was verified with an actual HTTP status and an actual
`robots.txt` read. Two negatives held, two did not.

- **⛔ Danish — the publication exists and its publisher says no.** The guide had concluded that
  **no** Danish counterpart to the Swedish and Norwegian easy-language papers existed. It does:
  **DR Ligetil**, the public broadcaster's standing easy-Danish news service, published alongside
  its ordinary news on the same domain — the ideal same-publisher pair. The first pass missed it
  because it probed *host names* (`ligetil.dk` …) and the service is a **path** on `dr.dk`.
  `dr.dk/robots.txt` names ~30 automated collection agents and disallows `/` for each; the
  collector refuses and the refusal stands. Danish is now a **pure policy negative**: stop
  searching, the only route left is a licensed one.
- **✅ Croatian — a pilot of exactly the right shape.** The **City of Zagreb** runs a
  «Lako za čitanje» program (2025, the first in Croatia): **8 easy-read PDF rewrites of its own
  city regulations**, which exist in standard Croatian from the same institution. `zagreb.hr`
  serves **no robots.txt at all**. Eight documents is a pilot, not a corpus — but register is the
  only variable, which is more than Croatian had. **Open work: find each original in the city's
  official gazette**, then count the pairs.
- **✅ Ukrainian — the named gap is closed, and the answer was in a different sector.**
  «Барвінок» ceased in 2019 and its domain is **parked and for sale**; «Пізнайко» is a
  **storefront**; «Джміль» is live and fully permitted (`User-agent: *`, no rules) but is a
  **portal of covers and teasers** across ~80 issues with no running text. Ukrainian easy-language
  publishing is in the **disability sector** as «формат легкого читання»: `naiu.org.ua` (permitted;
  publishes both registers on one domain; its advertised sitemap index **404s**, so enumeration is
  unsolved) and `inclusion-ukraine.com` (permitted, enumerable, **small** — 88 posts, 9 pages, and
  a dedicated `etr_legislation` type with 6 items).
- **✅ Polish — the negative survived the search, and got sharper.** What the search returns is
  exactly the shape the guide predicted: state archives, a regional fire service, and a university
  accessibility office each publishing **one ETR page about themselves**. No stream, no index. Of
  the four, Polish is the only negative that the search confirmed.

**The cross-cutting result:** three of these four now point at the **same** pairing — an official
text against its own institution's plain-language rewrite (Zagreb's regulations, Ukraine's ETR
legislation, Poland's ETR pages). That is entry 5's experiment, and it is no longer hypothetical.

---

## 5 · The cross-cutting finding — and the experiment that would settle it

Three languages produced the **same null result for the same reason**: not one row of their
official plain-language wordlists was testable against the corpora that could be built.

> The wordlists a country publishes describe **administrative correspondence**. The corpora
> that can actually be collected are **journalism**. They are talking about different text
> types, so the measurement is silent on the list **by construction**.

This is why `untestable` and `thin` exist as distinct verdicts. A reader must not mistake
that silence for a refutation, and a sourced list must never be demoted because a mismatched
corpus could not see it.

**Italian is now the fourth**, measured 2026-07-29 with a same-document pair: all eight of its
testable bureaucratic rows (*effettuare*, *usufruire*, *istanza*, *recarsi*, *trasmettere*,
*documentazione*, *decorso*, *provvedere*) return `untestable` — the formal member is absent from
**both** halves. The corpus was a rights-and-terminology publication; the list describes
administrative correspondence. Same null, same cause, fourth time.

**The experiment that would close it,** and it would serve every affected language at once:
build an **administrative-prose corpus against its own plain-language rewrites**. That is the only
pairing that puts the wordlists in range.

### ⏸ Status 2026-07-29 — the design is no longer hypothetical, and two candidates were each tested to a named blocker

Entry 4's re-scouting turned up three verified instances of exactly this pairing, all on public-sector
domains, all permitting collection. **Two were attempted. Both stop at a specific, bounded step —
neither at policy and neither at "does not exist".**

| Candidate | State | Blocker, precisely |
|---|---|---|
| **Croatian — City of Zagreb «Lako za čitanje»** (9 easy-read PDFs rewriting the city's own regulations; `zagreb.hr` serves **no robots.txt at all**) | **attempted, blocked** | **8 of the 9 are page scans with no text layer.** One extracted (1,165 tokens). The blocker is **OCR on eight known files at known URLs** — a small bounded job. No OCR was available in this environment. Every row derived from it must be marked **OCR evidence**: č ć đ š ž are what recognition loses first. Recorded in `hr.md` §8c/§8g. |
| **EU legislation summaries** — the obvious way to serve *every* affected language at once: plain-language summaries of legal acts, published by the same body, in all official languages, each linked 1:1 to its source act | **attempted, blocked** | The portal answers an automated client with **HTTP 202 and an empty body** — a challenge, and `robots.txt` itself returns 202/0, so **no policy could even be read**. Record as **not reachable by this pass**, never as a property of the source. Bulk access there is provided through published data services; that is the sanctioned route if anyone wants it. |
| **Ukrainian — `inclusion-ukraine.com`** `etr_legislation` (6 items, permitted, enumerable) | **not attempted** | Six items is a pilot at best; the open work is pairing each with the act it rewrites. |
| **Polish — state archives, a regional fire service, a university accessibility office**, each publishing one ETR page about itself | **not attempted** | Confirmed to exist by search (entry 4). No index; the pairing has to be assembled institution by institution. |

**⏭ Exact resumption point.** Start with **Croatian**, because it is the only candidate whose
plain side is already enumerated and whose blocker is one tool away:

1. OCR the eight scanned PDFs (cached locally, not in the repo). Sanity-check the output on a
   word that cannot be rare in Croatian (`je`) **and** on one carrying a diacritic, before
   trusting anything.
2. Find the standard originals of the four documents that name a city act — *Odluka o socijalnoj
   skrbi*, *Odluka o najmu stanova*, the disability-stipend decision, the disability-transport
   regulation — in the city's official gazette.
3. Count the pairs with `corpus-measure pdf … --alphabet 'abcdefghijklmnopqrstuvwxyzčćđšž'`, then
   `compare --probe` against `hr.md` §8b's twelve craft rows.
4. Nine pairs will not carry a frequency table. **Report sentence architecture and morphological
   load, and say plainly that the lexical rows remain craft** — the point of the experiment is to
   find out whether an administrative pair makes an official wordlist *testable at all*, not to
   settle Croatian vocabulary from nine documents.

---

## 6 · German and English — the kit's own languages, guides written from the repo only

**Done 2026-09-23, as a first pass.** `de.md` / `de.setup.md` and `en.md` / `en.setup.md` exist and
pass `check-language-guide`. They are unlike every other guide here: they describe **what the kit
already ships**, from a scripted census of its own strings, and **no external authority was
fetched** (no web access in that pass). §2 of each setup file names the authorities to check
against. Their §8c is the one measurement in this backlog that needed no outside corpus, because
the kit's `de`/`de-easy` and `en`/`en-easy` files are a same-publisher, same-topic pair by
construction (122 twin files per side).

**Done 2026-09-23: the house-style decisions.** Every row that was open here was
decided as house style: German
*du* everywhere (the legal pages may stay formal), generic masculine, „…“ quotation marks, the
Mediopunkt for long `de-easy` noun compounds (refined the same day: not in verbs, adjectives or
compounds of up to 10 letters, everyday words closed, long compounds split at every joint), and
American English with US dates and the serial comma. The
content got one normalizing pass per row; the rules now stand as decided in
[`directives/languages/de.md`](../directives/languages/de.md) (§3, §4, §8f) and
[`directives/languages/en.md`](../directives/languages/en.md) (§5, §9), and
`scripts/check-house-style.mjs` enforces what is mechanically checkable.

**What is open, in the order it is worth doing:**

1. **Commit the corpus extractor.** §8c's corpora were built by a small script that turns the
   i18n JSON into `corpus-measure` input (twin files only, strings of five or more words ending in
   sentence punctuation). It lives outside the repo. Committing it — as a `local` source for
   `corpus-measure.mjs` or a sibling script — makes the numbers re-runnable in one command.
2. **The external round.** Check the observed practice against the §2 authorities (Rat für
   deutsche Rechtschreibung, DIN 8581-1 / DIN SPEC 33429, CLDR `de`/`en`, ISO 24495-1), and add an
   outside plain-language corpus so §8 can say how the kit's Einfache Sprache and Plain Language
   compare with German and English practice beyond the kit.

**How to tell it worked:** met for the decisions: each guide's Status line now separates decided
house style from observed practice, and §4 of `de.md` quotes the recorded register decision
instead of a count. For the two open items: the §8c numbers re-run in one command, and §2's
authorities are cited as checked, not just named.

---

## What is deliberately *not* here

- **Sources whose publishers decline automated text collection.** Several otherwise-ideal
  same-publisher pairs are unavailable for that reason, including the one that would have
  made a Norwegian gold-standard pair. Those are settled positions, recorded in the relevant
  §8c, and are **not** backlog items.
- **Encyclopedia APIs whose `robots.txt` disallows the API path.** Bulk access there is
  provided through published data dumps; that is the sanctioned route if anyone wants it.
