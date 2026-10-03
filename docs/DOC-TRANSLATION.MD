<!-- base -->
# Translating user-facing docs

How a user-facing document ships in two languages without the translation silently
rotting behind its source. This is the convention the drift gate
(`scripts/check-doc-drift.mjs`) enforces and every translation pass follows. Every doc in
the set is translated today; this describes how the next one joins it.

## Which docs this covers

Two audiences, two rules:

- **Agent-facing artifacts stay English-canonical and are NOT mirrored.** `AGENTS.md`,
  `base/`, `directives/`, `docs/adr/`, `docs/CONSTITUTION.MD`, `docs/DESIGN-SYSTEM.MD`,
  the per-component docs, skills (the kit's and the packs'), the packs' `presets/`,
  `kit.json`, `specs/`, and `JOURNAL.md`. English is the shared working
  language for agents across tools; one source keeps docs and code from drifting (same
  reasoning as `docs/DESIGN-SYSTEM.MD` → *Translation*).
- **User-facing docs are bilingual.** A document a human *reads to use or learn from the
  kit* has a canonical version in one language and a translated **mirror** in the other.
  The manifest holds 35 entries: 28 are English-canonical with a German mirror (the docs
  under `docs/`, `README.md`, the root community docs, and each pack's `README.md`,
  `GUARDRAILS.md` and `examples/README.md`), and 7 are German-canonical with an English
  mirror — the teacher pack's pilot kit in `packs/teacher/pilot/`, which was written in German for a pilot
  with German-speaking teachers and records `canonical: de` / `mirror-lang: en`. English
  as the default canonical language is a deliberate choice for an open-source kit with an
  international audience; the pilot kit is the one decided exception (2026-09-25), because
  its German text is the one the pilot actually uses.

  The mechanism is symmetric: the canonical language is recorded per entry and nothing in
  the gate assumes a direction. A new German-authored user doc is a decision to make, not a
  default — write it in English unless, like the pilot kit, its readers are German first.

  A pack's `GUARDRAILS.md` has both audiences: every job reads it as preconditions, and the
  pack README sends people there to learn how pupil data, drafts, sources and copyright are
  handled. It is in the bilingual set since 2026-09-25; the jobs keep reading the English
  source, and the German `GUARDRAILS.de.md` beside it is for the person.

**Output scaffolds and sample outputs are not documents.** A pack's fill-in templates
(`packs/*/assets/templates/*.vorlage.md`) and `profile/USER-MANIFEST.template.md` are
scaffolds an agent fills and writes out *in the manifest language* (`packs/teacher/README.md`:
"writes teacher material in the manifest language"); a second-language copy would be a
second scaffold to keep in step, not something a person reads. The packs' worked examples
(`packs/*/examples/*` apart from their `README.md`) are sample outputs, German by the packs'
design. Both are exempt; each `examples/README.md` — the part a person reads to understand
the samples — is bilingual.

**Inclusion rule (be explicit):** a doc is in the bilingual set iff its audience is the
human *using or learning from* the kit (not an AI agent *operating* it) **and** it is a
standalone prose/HTML document rather than in-app content routed through the Angular i18n
system. Membership is not sniffed from language heuristics — it is **declared** in
`docs/translation-manifest.json` (see below), which is robust and reviewable.

**Where the gate looks.** Declaring membership is only half of it: an undeclared doc would
otherwise ship monolingual and the gate would stay green, because it could only validate
what it had been told about. So the manifest also declares `userFacingPaths` — the trees
(`docs/tutorial`, `docs/how-to`, `docs/explanation`, `packs`), the loose files (`README.md`,
the root community docs, the books, `profile/USER-MANIFEST.template.md` and the GitHub
templates) and the documents sitting directly in `docs/`. Every document found there must be
a declared `source` or `mirror`, **or** exempt with a written reason: `exempt` names single
files, `exemptGlobs` whole groups (`packs/*/skills/**`, `packs/*/assets/**`,
`packs/*/examples/**`, `packs/*/presets/**`). A declared pair wins
over an exempting glob, which is how each `examples/README.md` stays in the set while its
sample outputs are exempt; a glob that matches no document fails, so a stale one cannot
quietly swallow whatever lands there next. Adding a user-facing doc and forgetting to
register it fails the gate.

**The exemptions, and why.** They live in exactly one place — `exempt` and `exemptGlobs` in
`docs/translation-manifest.json`, each with its reason — so this document does not need to
be kept in sync with a second copy. In short: `docs/onboarding.html` is self-contained
bilingual (an inline `de`/`en` dictionary and a live toggle; a live interactive form is
better kept in one file than forked into two); the scaffolds and sample outputs above are
not documents; `CHANGELOG.md`, `JOURNAL.md` and `OPEN-QUESTIONS.md` are running books
(`base/BOOKKEEPING.md`) that a mirror would double entry by entry; the GitHub issue and
pull-request templates are forms GitHub offers one file at a time; and the rest — the pack
skills and presets, `docs/CONSTITUTION.MD`, `docs/DESIGN-SYSTEM.MD`,
`docs/DOC-TRANSLATION.MD`, `docs/LANGUAGE-GUIDE-BACKLOG.MD`, `docs/THIRD-PARTY-FONTS.md` —
are agent- or maintainer-facing under the first rule above.

## The mirror location

The canonical source keeps its natural, unprefixed path. The translated mirror lives
under a per-language subtree of `docs/`:

```
docs/<mirror-lang>/<same-relative-path-under-docs>/<file>
```

Example: the English `docs/explanation/choosing-an-ai-agent.md` has its German mirror at
`docs/de/explanation/choosing-an-ai-agent.md`. A source outside `docs/` keeps its
relative name inside the tree: `README.md` mirrors to `docs/de/README.md`,
`CONTRIBUTING.md` to `docs/de/CONTRIBUTING.md`. A German-canonical `docs/foo.md` would
mirror to `docs/en/foo.md`.

**The packs are the one exception: their mirror sits beside the source.** A source under a
`siblingMirrorRoots` entry in the manifest (today only `packs`) mirrors to
`<name>.<mirror-lang>.<ext>` in the same folder: `packs/teacher/README.md` →
`packs/teacher/README.de.md`, the German-canonical `packs/teacher/pilot/LEITFADEN.md` →
`packs/teacher/pilot/LEITFADEN.en.md`. A pack is a self-contained bundle that can be lifted
into another kit (`docs/explanation/the-pack-layer.md`); a mirror under `docs/de/packs/`
would split it across the repo, and its relative links (`./pack.json`, `./skills/…`) would
all need rewriting. Beside the source, a translation travels with its pack and keeps every
link it shares with the original. Decided once, on 2026-09-25, for all packs.

The gate checks this arithmetic, it does not merely describe it: for every entry, `mirror`
must equal `docs/<mirror-lang>/` plus the source path with a leading `docs/` stripped — or,
under a sibling-mirror root, the sibling name.

Why a mirror tree rather than a `.<lang>.md` sibling everywhere else: it keeps the
canonical doc at the path humans and links already use, groups every derived translation in
one place a translator or reviewer can scan, and lets the gate enumerate mirrors with a
single walk. Under a sibling-mirror root the gate instead treats every `<name>.<xx>.<ext>`
file as a mirror, so an undeclared one fails as an orphan. Translations are **derived
views** of the canonical source — generated from it, clearly marked, never edited
independently — the same discipline the kit applies to roadmaps and component docs.

## Finding the other language

A mirror nobody finds is no help: a German-speaking reader who only sees the English
`README.md` never learns a German one exists. So every **entry doc** — every `README.md`
and every document at the repo root — opens with a one-line language switch, and its mirror
carries the reverse line directly after the marker:

```
**Deutsch:** [Diese Seite auf Deutsch](docs/de/README.md)      <- in README.md
**English:** [This page in English](../../README.md)            <- in docs/de/README.md
```

The link text is written in the language it leads to, so the reader recognizes it. In a
pack file the line sits after the `<!-- pack -->` layer line. The gate checks both
directions for entry docs; deeper documents are reached through the entry docs, and their
mirrors link to the other language's mirrors where one exists (the German `README.md`
points at `packs/teacher/README.de.md`, not at the English pack README).

## The marker

Every mirror file starts with a `TRANSLATION-MIRROR` block (after the layer line, such as
`<!-- base -->` or `<!-- pack -->`, when the source has one). It is an HTML comment, so it
is valid and invisible in both Markdown and HTML:

```
<!-- TRANSLATION-MIRROR
source: docs/explanation/choosing-an-ai-agent.md
canonical: en
mirror-lang: de
status: PLACEHOLDER
source-sha256:
-->
```

| Field | Meaning |
|---|---|
| `source` | Repo-relative path of the canonical document. Must match the manifest entry. |
| `canonical` | Language code of the canonical source (`de`, `en`, …) — `en`, or `de` for the pilot kit. Must match the `canonical` recorded in the manifest entry; the gate compares them. |
| `mirror-lang` | Language this file is written in (`de`, or `en` for the pilot kit). Must match the manifest entry, and it is what the mirror-path convention above is computed from. |
| `status` | `PLACEHOLDER` (skeleton only, no prose yet) or `TRANSLATED` (real translation present). |
| `source-sha256` | For `TRANSLATED`: the SHA-256 of the canonical source **at the time it was translated**. Empty/omitted for `PLACEHOLDER`. |

A content hash — not a timestamp — is the drift signal, because git does not preserve
mtimes across clones and checkouts.

## The lifecycle

1. **Scaffold.** Add an entry to `docs/translation-manifest.json` and
   create the mirror file with the marker (`status: PLACEHOLDER`, empty hash), a pointer
   back to the source, and the heading skeleton only — **no translated prose.**
2. **Translate.** Fill the body from the canonical source, set `status: TRANSLATED`,
   and set `source-sha256` to the current hash of the source:
   `node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('<source>')).digest('hex'))"`
   (or `sha256sum <source>` in Git Bash).
3. **Maintain.** When a `TRANSLATED` mirror's source changes, the gate fails on the hash
   mismatch. Re-translate the changed part and refresh `source-sha256` in the same commit.

## The gate

`scripts/check-doc-drift.mjs` (dependency-free, Node core only) is the enforcement:

- every manifest `source` exists and has its `mirror`;
- every mirror has a well-formed marker whose `source` matches the manifest;
- `PLACEHOLDER` mirrors are tolerated (an untranslated stub is not drift);
- `TRANSLATED` mirrors must record a `source-sha256` equal to the source's current hash —
  a mismatch is flagged as drift;
- `canonical` and `mirror-lang` agree between the manifest entry and the mirror's marker,
  and the mirror sits at the path the convention computes from `mirror-lang` (the
  `docs/<lang>/` tree, or the sibling name under a sibling-mirror root);
- no entry in the manifest carries the same key twice (`JSON.parse` would silently keep
  the last one);
- every entry doc links to its mirror and back (the language switch above);
- no orphan mirrors: every doc under a `docs/<lang>/` mirror tree, and every
  `<name>.<xx>.<ext>` file under a sibling-mirror root, must be in the manifest;
- **and the inverse:** every doc under `userFacingPaths` is either declared or exempt with
  a reason — the check that makes "I just didn't register it" fail instead of pass — and
  every exempting glob still matches at least one document.

Run it with `node scripts/check-doc-drift.mjs` (set `VERBOSE=1` to list the green checks).
`scripts/verify-harness.mjs` spawns it as check 10, so it runs with the rest of the
harness; `npm run build:verify` runs the harness in turn.
