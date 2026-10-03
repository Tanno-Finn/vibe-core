# Shape — skill system convention

**Status:** implemented (accepted 2026-07-17) · **Phase:** N2 (first skill), reused by N3/N5/N8

The convention is in force: 13 skills ship under `.claude/skills/`, and
`scripts/verify-harness.mjs` check 6 enforces the required frontmatter on every one.

## Problem

The platform needs slash-command "skills" (`/onboarding`, `/help`, `/new-directive`,
`/dev`, …). They must (a) work out of the box in Claude Code, (b) stay tool-agnostic so
Copilot/Cursor/Gemini users can follow the same procedure, and (c) respect the
`base`/`kit`/`pack` layering so the later extraction of `base/` is mechanical.

## Decision

**Skills are authored as `.claude/skills/<name>/SKILL.md`** — Claude Code's native
discovery location, so a freshly cloned template has working commands with zero setup.

Each `SKILL.md` carries frontmatter:

```yaml
---
name: onboarding
description: >
  One-line trigger description Claude uses to decide when to invoke this skill.
layer: base            # base | kit | pack  — drives the mechanical extraction later
capabilitiesUsed: []   # kit.json capabilities this skill relies on ([] = none / base-only)
---
```

- `layer` is the marker that lets a script filter base-skills from kit-skills at compose
  time (the moral equivalent of the `<!-- base -->` markers in prose files). A `base`
  skill must not hard-code kit specifics — it reads `kit.json` (Principle 5).
- `capabilitiesUsed` documents the contract dependency. A skill that produces an artefact
  must fall back to `file:markdown` when a richer capability isn't in `kit.json`.

**Tool-agnostic mirror:** `AGENTS.md` (read by every tool) lists the skills and their
triggers so a non-Claude agent can run the same procedure by hand. The `SKILL.md` body is
the single source; AGENTS.md points at it, never copies it (Principle 6).

## In scope (this spec)

- The `.claude/skills/<name>/SKILL.md` layout + frontmatter schema above.
- `verify-harness.mjs` extension: every `SKILL.md` has `name`, `description`, `layer`.

## Out of scope

- The individual skills' content (each has its own AP).
- Compose-time extraction script (arrives with Kit #2 — Rule of Two).

## Standards that apply

`QUAL-002` (docs travel with the change), `SEC-005`/Principle 1 (skills that touch Red
actions must gate them). See `base/standards/` — by reference, not copied.

## Open questions

None. `[NEEDS CLARIFICATION]` markers: 0.
