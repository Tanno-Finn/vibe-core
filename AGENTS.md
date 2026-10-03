# AGENTS.md

<!-- base -->
This is the canonical instruction file for any AI agent working in this repo. `CLAUDE.md`
is a thin wrapper that imports it (`@AGENTS.md`) — **edit this file, not that one.** Other
tools (Copilot, Cursor, Gemini) read this file directly.

> **This file is a map, not an encyclopedia. Hard cap: 150 lines** (checked by
> `scripts/verify-harness.mjs`). If you need more room, link out — don't inline.

## Map

| Read this | For |
|---|---|
| [`docs/CONSTITUTION.MD`](docs/CONSTITUTION.MD) | The stable principles behind how we work. |
| [`base/standards/`](base/standards/) | The four standards (A11Y, PRIVACY, SECURITY, QUALITY) with IDs and `[hard]`/`[overridable]` tags. Start at [`index.yml`](base/standards/index.yml). |
| [`overrides/`](overrides/) | How to relax an `[overridable]` standard in the open. |
| [`base/SAFETY.md`](base/SAFETY.md) | The Green/Yellow/Red model and the one warning format. |
| [`base/BOOKKEEPING.md`](base/BOOKKEEPING.md) | Checkpoint commits, the account statement, the books — `JOURNAL.md` (past work) and `OPEN-QUESTIONS.md` (decisions parked for you). |
| [`directives/`](directives/) | Playbooks and conventions that guide *how* work is done (they don't gate). Start at [`index.yml`](directives/index.yml). |
| [`specs/`](specs/) | Where non-trivial work is shaped before it's built. |
| [`kit.json`](kit.json) | The contract: commands, health checks, capabilities, tools. |
| [`tools/`](tools/README.md) | Tested helpers (PDF, Word, a11y check, screenshots); `npm run tools` lists them. Use them, don't improvise ([`directives/kit-tools.md`](directives/kit-tools.md)). |
| [`packs/`](packs/) | Optional role/workflow bundles that layer on the kit (e.g. `teacher`). Kit-blind, activated conversationally. See [`docs/explanation/the-pack-layer.md`](docs/explanation/the-pack-layer.md). |
| [`README.md`](README.md) | Human-facing project intro and setup. |
| [`docs/DOC-TRANSLATION.MD`](docs/DOC-TRANSLATION.MD) | How user-facing docs ship bilingually (canonical source + translated mirror, kept in sync by a gate). |

## Project overview

An agent-first **starter kit** for building an educational companion portal — interactive
AI demos, a glossary, an AI timeline, and didactic article pages — in German and English
(each with an Easy-Language variant). It ships as a working Angular app you extend, with
the base agent-system (standards, skills, safety) layered on top.

## Setup commands

<!-- kit -->
- Install: `npm install` (Node 24, see `.nvmrc`)
- Dev server: `npm start` → http://localhost:2000
- Build: `npm run build:prod` (never a raw `ng build` — it skips the prebuild and integrity steps; `scripts/ng-guard.js` refuses only `npm run ng -- build`, a direct `npx ng build` gets through and leaves a `dist/` without the manifest `scripts/verify-build.js` demands)
- Test: `npm run test:ci`
- Lint / format: `npm run lint` · `npm run format`

## Code style

<!-- kit -->
- Angular standalone components, `@if`/`@for` control flow (no `*ngIf`/`*ngFor`, no
  NgModules).
- Guard every `window`/`document`/`localStorage`/`navigator` access with
  `isPlatformBrowser(...)` — unguarded browser globals crash the prerender build. Lint
  enforces it; a click handler says so with a leading `// browser-only: <reason>`.
- Match the surrounding file's naming, idioms, and comment density (QUAL-005).
- Read, search and edit with the built-in file tools, not `cat`/`sed`/`grep`: every shell
  command can cost the user a confirmation click ([`directives/kit-tools.md`](directives/kit-tools.md)).

## Testing instructions

<!-- kit -->
Run `npm run test:ci` while you work. `npm run build:prod` runs the curated suite
(`scripts/check-test-baseline.mjs`), then writes the manifest and verifies it once more,
so the build cannot finish over a verdict that is red, missing, or stale. The verdict
records the built `index.html` hash, the git head, and the invoking script, which catches
a verdict produced *beside* the build — it is plain JSON under `dist/`, not a signature,
so it stops accidents, not someone who edits that file on purpose. The only bypass is
`SKIP_TEST_GATE=1` (PowerShell: `$env:SKIP_TEST_GATE='1'`), recorded as
`tests.gate: "skipped"`, which `scripts/write-build-manifest.js` and
`scripts/verify-build.js` then refuse unless the same variable is still set at those
steps. New `.spec.ts` files MUST be added to the
`test.include` allowlist in `angular.json` — an unlisted spec is never executed and the
suite stays green anyway. On Windows, run the suite from PowerShell (Git Bash can
segfault npm). Adding a whole page: follow [`docs/how-to/add-a-page.md`](docs/how-to/add-a-page.md).

**Definition of Done:** green build + green tests + docs in the same commit + (for
non-trivial changes) a second review. See [`base/standards/QUALITY.md`](base/standards/QUALITY.md).

## Working in this repo

<!-- base -->
```
base/            # the foundation — depends on the kit CONTRACT, never on kit code
  standards/     #   A11Y / PRIVACY / SECURITY / QUALITY (+ index.yml)
  kit.schema.json
overrides/       # committed exceptions to [overridable] standards (gate -> advisory)
specs/           # shaped work, one timestamped folder per spec
docs/            # CONSTITUTION.MD and other human/agent docs
kit.json         # the contract this kit fulfills
src/             # the Angular app (kit-specific)
scripts/         # build, content, and harness tooling
```
Closest `AGENTS.md` wins if a nested one exists (none does today).

**First contact:** if `profile/USER-MANIFEST.MD` doesn't exist, your first paragraph offers
the `/onboarding` interview — prominently, never as a footnote — with one or two sentences
on why it pays off for this person. Offer, don't force: on a "no", start working and remind
once after the first delivered result ([the skill](.claude/skills/onboarding/SKILL.md) says
how). If the manifest *does* exist, read its Zone 1 (and an `interview:` line in Zone 3 —
`reminder: pending` means that one reminder is still due) before starting and act on it —
that's how any tool picks up how this person wants to work. Facts the user reveals (role, level,
languages, audience, access needs, how material reaches learners, address, tone, no-gos) go
into the manifest as they come, said out loud ("I'm noting in your profile that …"), and
are honored from then on. If the folder is not a git repository, offer the safety net
([`base/BOOKKEEPING.md`](base/BOOKKEEPING.md)) — `git init` only after an explicit yes.

## Specs & directives

<!-- base -->
| Scope | Where |
|---|---|
| Stable principles | [`docs/CONSTITUTION.MD`](docs/CONSTITUTION.MD) |
| A standard by ID | [`base/standards/`](base/standards/) (e.g. `SEC-003`, `A11Y-004`) |
| A project exception | [`overrides/<STANDARD-ID>.md`](overrides/) |
| A convention or playbook | [`directives/<name>.md`](directives/) (see [`index.yml`](directives/index.yml)) |
| A piece of shaped work | [`specs/<date-slug>/`](specs/) |

## Boundaries

<!-- base -->
The tiers and the warning format live in [`base/SAFETY.md`](base/SAFETY.md); the funnel
below is the quick version.

**Always:**
- Talk to the user like a busy, impatient boss: result first in everyday words, every term
  explained, options with pros and cons and one reasoned recommendation ([`directives/communication.md`](directives/communication.md)).
- Look out for the user: raise security, license, accessibility, and debt concerns when
  you see them — by *saying*, never by unrequested doing ([`directives/stewardship.md`](directives/stewardship.md)).
- Commit your own work as you go (checkpoint commits), with docs in the same commit.
- Stage explicit paths (`git add <path>`); run `git diff --cached --name-only` before
  committing to be sure you didn't sweep in unrelated files.
- Keep secrets out of the repo — `.env.example` with placeholders only.

**Ask first** (irreversible or externally visible — the "Red" tier):
- Publishing, deploying, or making the repo public.
- Deleting data, sending anything outward, or changing access.
- Any `git push` (the human pushes).

**Never:**
- Commit a secret, credential, or real personal data (SEC-001, SEC-004, PRIV-001).
- Force-push, rewrite published history, or move a branch ref backwards (SEC-003).
- Disable or route around a security gate to get unblocked (SEC-006).
- Override a `[hard]` standard — those are not negotiable.

## Why this file is short

A map, not an encyclopedia. A bloated `AGENTS.md` crowds out the actual task, rots faster
than anyone maintains it, and can't be checked mechanically. When something here grows
past a line or two, it belongs in a linked doc — and this file just points at it.
