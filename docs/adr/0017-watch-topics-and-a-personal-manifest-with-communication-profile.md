# ADR-0017 — Watch topics and a personal manifest with a communication profile

**Status:** accepted · **Date:** 2026-09-05 (measurements 2026-09-05 on the then-current `master`,
worktree carried an unrelated guide session in `src/app/dev/articles/tooltip/`)

## Context

The kit already interviews a new user on first contact and writes what it learns into a
personal manifest that every later session reads. The concept behind this decision (written
2026-08-11, accepted 2026-09-05) measured what exists and found the mechanism sound
but three things missing. This ADR records the decisions; it does not restate the paper.

### What was measured, not assumed (2026-09-05)

- **The manifest template** (`profile/USER-MANIFEST.template.md`) carries three zones and a
  block named `compensation` with **five booleans** — security, privacy, accessibility,
  tech_debt, cost. There is a `role:` field, and nothing anywhere reads it.
- **`compensation` has four readers in the kit** (`grep -rn compensation base directives
  .claude docs profile scripts src`, 9 hits, one of them an unrelated use of the word in
  `directives/languages/hr.md:449`): the template itself (1 hit), `directives/stewardship.md`
  (2), `.claude/skills/onboarding/SKILL.md` (3), `docs/onboarding.html` (3 — two prose
  preambles and the export line at :833).
- **The standing watch in `directives/stewardship.md` lists five topics.** Findability and
  page speed appear nowhere in the repository as watched topics.
- **Three of the five topics have an operative directive** (`security-workflow.md`,
  `accessibility-workflow.md`, `maintenance.md`); privacy and cost have none. None of the
  three answers the questions that come *before* the fix: why the topic exists in plain
  words, what trips the radar, how the check-in is phrased.
- **`base/SAFETY.md:68` states the guardrail** — "the user's profile modulates only the
  communication layer … Safety is not a profile setting" — in the vocabulary of the old
  block.
- **The registry gate** (`scripts/verify-harness.mjs`, check 8) reads every `file:` line of
  `directives/index.yml` and fails on a listed file that does not exist; its orphan check
  reads `directives/*.md` **non-recursively**, so a subdirectory is registered by choice,
  not by force — the same shape `directives/languages/` already uses.

### The gap

A user picks the whole package or nothing, without being told what any of it is; two
topics that bite beginners hardest are absent; the profession field feeds nothing; and
"how often does it speak up?" has no answer between on and off.

## Options considered

1. **Leave the booleans, add the two topics.** Rejected: on/off is the actual complaint —
   a user who wants a topic watched but rarely mentioned has to switch it off entirely.
2. **A numeric verbosity dial (0–10) or per-topic frequency settings.** Rejected: a
   configuration zoo whose behavior nobody can predict. Three named levels are the minimum
   that answers the question and the maximum that stays explainable in one line.
3. **Fold the playbooks into the existing operative directives.** Rejected: four of the
   seven topics have no such directive, and the three that do are paydown manuals. One
   uniform format across seven beats three extended files plus four new shapes.
4. **Ship a profession-to-analogy table.** Rejected: professions cannot be enumerated, and a
   table of twenty is worthless to the twenty-first user. The kit ships the derivation
   instruction instead; the derived world lands in the user's own manifest, where they can
   see and correct it.
5. **A separate profile artifact for communication.** Rejected: a second file describing the
   same person is drift waiting to happen (one canonical doc per component, ADR-0005).

## Decision

### D1 — `compensation` becomes `watch`, booleans become three levels

Seven topics, each with a level `quiet | normal | active`. The level tunes **routine
nudges only**; Yellow/Red warnings, `[hard]` rules, the cost pre-announcement, and the
posture report before publishing are level-independent. That sentence stays the most
repeated sentence in the system and is unchanged by this ADR.

*Why:* the old name explains itself to nobody, and three levels make "how often does it
speak up?" adjustable without opening a settings surface.

### D2 — Seven topics: the five that exist, plus findability and page speed

Catalog: `tech_debt`, `accessibility`, `security`, `seo`, `privacy`, `cost`,
`performance`. Defaults when the user chooses nothing: **`normal` for the first five,
`quiet` for `seo` and `performance`**.

*Why the split:* the five inherited topics protect against damage, the two new ones improve
a result. Protection is the default; optimization is an offer. Page speed is included
rather than deferred because the radar it needs — the build's bundle budget — already
exists, so its marginal cost is small, and "the site got slow" is a classic in beginner
projects.

### D3 — Findability starts quiet and is *proposed* per project

The interview may propose `normal` when the stated goal is a public site, and says why it
proposes it. The user decides.

*Why:* for a private or link-shared project, findability nudges are noise, and a misplaced
one in the first session damages the "it understands me" impression that the whole
interview exists to create.

### D4 — Playbooks live in `directives/watch/<topic>.md`, one per topic

A playbook is durable know-how that applies during normal work — a directive, not a skill
(*a directive guides, a skill is a task, a standard gates*). Each carries five sections:
the plain-words pitch (the same paragraph the interview delivers when asked "why does this
matter?"), the radar and what trips it, the check-in shape, the paydown (the recipe itself,
or a link to the operative directive that owns it), and the limits. Each gets a
`watch-<topic>` row in `directives/index.yml`, so an agent finds one playbook by registry
without loading seven.

*Why one file per topic:* the interview and the later behavior must read from the same
source, or the promise made in round three drifts from what the agent actually does.

### D5 — The level semantics are canonical in exactly one place

`directives/stewardship.md` owns the table (which radar runs, what is reported, when a
check-in happens, per level). Every other file points at it. The manifest template carries
the one-line guardrail, not a second copy of the table.

### D6 — Profession becomes a communication profile, asked in round one

A new `communication` block in Zone 1 holds the profession as a *communication world*, the
derived analogy domains, an on/off switch, and notes. `directives/communication.md` carries
the derivation instruction and its limits: at most one analogy per explanation, say so when
the picture limps, precision before picture in safety contexts, and no role-play in a
domain the agent only knows from the outside.

*Why round one:* the value comes precisely from being able to explain the watch topics in
round three in the user's own world. It is a single, skippable question.

*Why no enumeration:* see option 4.

### D7 — Migration happens on first read, not by a script

The manifest is gitignored and local to each user, so there is no fleet to migrate. An
agent that finds a `compensation` block reads it as `watch` levels — `true` to `normal`,
`false` to `quiet` — adds the two new topics at their catalog defaults, offers to rewrite
the block, and says what it did. It never rewrites Zone 1 silently.

That same rule is what keeps the kit consistent while the interview is converted in a later
step: an interview that still writes five booleans produces a manifest a converted agent
reads correctly.

## Consequences

- The template's Zone 1 gains `watch` (seven leveled entries) and `communication`, and
  loses `compensation`. Zone 2, Zone 3, and their contracts are untouched.
- `directives/stewardship.md` becomes the hub: the standing watch points at playbooks and
  carries the level table. Its one rule — *proactive means saying, not doing* — and the
  event-driven radars (license, reuse before build, decisions become records, posture
  before publish) stay exactly as they are and stay outside the catalog, because listing
  them would suggest they can be turned down.
- `base/SAFETY.md` changes vocabulary only: the guardrail sentence now names the `watch`
  levels. No rule, tier, or warning format changes.
- `directives/communication.md` gains the analogy mechanics. The split it already declares —
  this file is about talking to the user, content style lives elsewhere — is preserved.
- The interview skill, the offline questionnaire, and the explanatory docs still describe
  five boolean topics until they are converted. D7 is what makes that interval safe rather
  than broken.
- Six playbooks remain to be written; the standing watch marks them as planned, so no link
  points at nothing and the registry stays free of rows without files.
- The manifest stays gitignored (PRIV-001) and stays the only artifact describing a person.
  A topic switched to `quiet` is a communication preference; an exemption from a standard is
  still an override in `overrides/`, never a manifest entry.
