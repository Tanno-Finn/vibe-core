# 10. Bilingual user-facing docs via a hash-checked mirror tree

Status: accepted

## Context and Problem Statement

The kit serves a German-and-English audience: user-facing docs need both languages, while
agent-facing artifacts (standards, skills, `AGENTS.md`) stay single-language English. Two
questions: which docs get a second language, and how do we stop a translation from silently
rotting when its source changes? A stale translation that *looks* current is worse than an
honest placeholder.

## Decision Drivers

- A clear, mechanical rule for *which* docs are bilingual — no per-file judgment each time.
- Drift between a translation and its source must be *detectable*, not trusted.
- The signal must survive git (which does not preserve mtimes) and a fresh clone.
- Foundations now; the actual translation pass comes later — the mechanism must tolerate an
  untranslated placeholder without crying drift.

## Considered Options

1. **Sibling files** (`x.md` + `x.en.md`) with a "last updated" date. Dates are unreliable
   (git clobbers mtimes; humans forget to bump them), and siblings scatter translations.
2. **Detect language automatically** and mirror whatever looks German. Fragile — sniffing
   prose language misfires on code, names, and mixed content.
3. **A curated manifest + a mirror tree + a content-hash drift gate.** An explicit manifest
   lists source→mirror pairs; mirrors live under `docs/<lang>/<same-relative-path>`; each
   mirror header records the source's SHA-256; a gate compares recorded vs current hash.

## Decision Outcome

**Option 3.** `docs/translation-manifest.json` is the explicit, curated set of bilingual docs
(agent-facing artifacts are excluded by rule, stated in `docs/DOC-TRANSLATION.MD`). A mirror
lives at `docs/<mirror-lang>/<relative-path>` so the canonical file keeps the path humans and
links use, and all translations group in one scannable tree. Each mirror carries a
`TRANSLATION-MIRROR` marker (`source`, `canonical`, `mirror-lang`, `status`, `source-sha256`).
`scripts/check-doc-drift.mjs` (Node core only) confirms every source has a mirror, treats
`status: PLACEHOLDER` as fine (never drift), and for `status: TRANSLATED` flags when the
recorded `source-sha256` no longer matches the source's current hash. It also catches orphan
mirrors, and discovers language directories rather than hard-coding them. Wired into
`verify-harness.mjs` (check #10).

A reality-check surfaced during the work: every *current* user-facing doc is either inline-
bilingual (`onboarding.html`, exempt) or English-first (`README`, `choosing-an-ai-agent`), so
the mechanism is built symmetric (`canonical` is per-entry, either direction) and seeded with
one English→German placeholder — not the German→English the brief assumed. Direction is a
content call for the later translation pass; the mechanism doesn't care.

## Consequences

- **Good:** drift is a machine fact tied to content, not a trusted human note; it survives
  clones and mtime loss.
- **Good:** placeholders are first-class — the kit ships an honest "not yet translated" state
  instead of a fake-current translation.
- **Good:** the manifest makes the bilingual set explicit and reviewable; a doc not in it is
  simply "not bilingual yet," not an error.
- **Cost:** the hash is whole-file — any source edit (even a typo) flags a TRANSLATED mirror.
  Correct but strict; the fix (re-translate, refresh the hash) lands in the same commit. No
  section-level partial-drift tracking.
- **Watch:** the mirror set must grow as later phases add user-facing docs; the mechanism is
  the deliverable here, not complete coverage.
