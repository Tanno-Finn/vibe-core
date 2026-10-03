---
name: health
description: >
  Run the kit's health checks and report each result in plain language, plus any active
  advisory overrides. Read-only: it tells you what's green and what's red, it does not fix
  anything. Run it when the user says "health" / "healthcheck" / "is everything ok?" / "what's
  broken?".
layer: base
capabilitiesUsed: []
---

# /health — is the kit healthy?

Your job: run every health check the kit declares, then give the user a clear, honest
verdict in their own language — a green all-clear, or a short prioritized list of what's red
and what it means. You **report**; you do not repair. Fixing is a separate, deliberate act
(hand off — see below).

Speak the user's language: read `profile/USER-MANIFEST.MD` → Zone 1 `language` and
`reading_level`, and phrase results accordingly. No manifest yet? Ask once in a short
bilingual line, then continue.

## What to run — read it from the contract

Read `kit.json` → `healthChecks`. **Run each entry's `run` command** and pair its result
with that entry's own `description` — the descriptions are written in plain language for
exactly this. Never hard-code the list; if the kit adds a check tomorrow, this skill runs it
with zero edits (Principle 5). Today's kit declares:

| id | command | what it means (from `kit.json`) |
|---|---|---|
| `harness-intact` | `node scripts/verify-harness.mjs` | Are the files the agent relies on present, and is AGENTS.md still short enough to trust? |
| `overrides-valid` | `node scripts/check-overrides.mjs` | Are all overrides well-formed and only relaxing rules allowed to be relaxed? |
| `build-green` | `npm run build:prod` | Does the site still compile and pass the build-integrity check? |
| `lint-clean` | `npm run lint` | Is the code free of lint errors? (Not formatting — that is `format-clean`.) |
| `format-clean` | `npm run format:check` | Is every file formatted the way Prettier writes it? |
| `tests-pass` | `npm run test:ci` | Do the automated tests still pass? |
| `a11y-built-pages` | `npm run check:a11y` | Do the built pages pass the automated accessibility check? |
| `tools-work` | `npm run test:tools` | Do the kit's helper tools (PDF, Word, accessibility check, screenshots) still work? |

Run them in a sensible order (cheap/fast checks first — `harness-intact` and
`overrides-valid` before the long build and test runs) so a fast failure surfaces quickly.
`a11y-built-pages` reads the production output, so it runs after `build-green`.
Some checks are slow; tell the user you're running them and don't silently hang.

## Surface the advisory overrides

`overrides-valid` (`node scripts/check-overrides.mjs`) also reports which gates are currently
**advisory** — standards a project chose to relax in the open. Read its output and, in your
summary, list each active override with its `rationale` and `revisit_after` date. An advisory
gate is not a failure, but it must stay **visible** every time (that's the whole point of the
two-tier mechanic — see `overrides/README.md`); never hide it.

## Report — green summary or prioritized red list

- **All green:** one warm line — everything passes — then list the checks that ran, plus any
  active advisories as visible notes.
- **Something red:** lead with the count, then a **prioritized** list. Put `[hard]` /
  security-adjacent and build-breaking failures first (a red `build-green` or `tests-pass`
  blocks shipping), advisory warnings last. For each red item: the check's plain-language
  description, and the actual command output that proves it (QUAL-007 — show the evidence,
  don't just assert). Don't dress a failure up as "nearly fine".

## Handoffs

- Something is red → this skill stops at the diagnosis. Hand off to the user (or the relevant
  build/lint/test fix) to repair it, then re-run `/health` to confirm green.
- About to finish a piece of work → `/ship` runs this same green-gate as part of the
  Definition of Done.

## Boundaries

**Green (just do it):**
- Run the declared `healthChecks` commands and `check-overrides.mjs`. They are the kit's own
  safe, local, read-only checks (build/lint/test/verify) — running them changes no source and
  produces no external effect.

**Ask first:**
- Nothing here should be Red. If a declared check turns out to do something externally visible
  or destructive, **stop and ask** before running it — a health check should be read-only, and
  one that isn't is a bug to report, not to run past.

**Never:**
- **Fix, edit, or "quickly patch" anything to make a check pass.** This skill diagnoses only;
  changing code to turn a light green is a separate, reviewed action.
- Skip, comment out, or route around a failing check to produce a green report — that defeats
  the gate (SEC-006) and lies about the state (QUAL-007).
- Suppress or omit an advisory override from the summary — advisories stay visible.

**Stop and ask if…**
- a check does something beyond read-only build/lint/test — report it instead of running it.
- a check hangs or its command is missing — say so honestly and stop; don't fabricate a green.
