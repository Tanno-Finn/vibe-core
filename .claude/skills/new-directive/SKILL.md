---
name: new-directive
description: >
  The switch (Weiche) for capturing repeated or opinionated knowledge so it stops living in
  one agent's head. Run it when a pattern is unusual, opinionated, repeated, or not obvious
  and worth writing down — or when the user says "new directive" / "capture this" / "make
  this a rule".
layer: base
capabilitiesUsed: []
---

# /new-directive — turn a pattern into durable knowledge

Your job: when the same decision, workaround, or opinion keeps coming up, help the user
capture it in the *right* place — and only ever with their explicit go-ahead. You are a
**switch**, not a filing clerk: first decide what kind of thing this is, then propose the
right home for it, then create it once the user confirms. Nothing is written silently.

Speak the user's language: read `profile/USER-MANIFEST.MD` → Zone 1 `language` and answer in
it. If the manifest doesn't exist yet, ask once in a short bilingual line, then continue.

## When this fires — the promotion trigger

Not every passing preference deserves a document. Propose capturing something only when the
pattern is **unusual, opinionated, repeated, or not obvious** — the same test a good
teammate uses before writing a wiki page. A one-off or a self-evident convention doesn't
earn a file; say so and move on. If you notice such a pattern mid-task, name it and offer to
run this skill — don't derail the current work to do it unasked.

## Step 1 — route by kind (the switch)

Ask what this really is, and recommend based on the pattern:

| If it's a… | …it becomes a | Home |
|---|---|---|
| repeated **task / job** the agent performs ("every time we add a demo, do X") | new **skill** | `.claude/skills/<name>/SKILL.md` (follow the shape spec) |
| durable **knowledge / policy** that constrains *how* work is done | a **standard** or a **directive doc** | see Step 2 |

For knowledge, split further:

- A genuinely **project-wide rule with a gate** (something health could check, something a
  reviewer enforces) → propose a **base standard** (`base/standards/`, gets an ID and a
  `[hard]`/`[overridable]` tag) or, if it relaxes an existing standard, an **override**
  (`overrides/<STANDARD-ID>.md`).
- **Guidance / conventions / playbooks** that inform but don't gate → a plain **directive
  doc**. If a `directives/` folder exists, put it there; if it doesn't yet, propose creating
  `directives/` and say so out loud (it's a new top-level folder — the user should know).

Recommend one, but let the user pick. When in doubt, prefer the lighter home
(directive doc over standard) — QUAL-006, smallest change that solves the problem.

## Step 2 — ask for the WHY (shape-first)

A rule without its rationale rots into cargo-cult. Before creating anything, get the user's
**why** in their own words — the same way `overrides/` quotes a `rationale` verbatim and a
standard's table carries a plain-language "Why" column. Draft the shape first (title, the
rule in one line, the why, the tag if it's a standard) and read it back. This mirrors
shape-spec: agree the shape before you write the body.

## Step 3 — confirm, then create

Only after the user approves the shape:

- **Skill:** scaffold `.claude/skills/<name>/SKILL.md` with the frontmatter from the shape
  spec (`name`, `description`, `layer`, `capabilitiesUsed`) — see
  `specs/2026-07-17-skill-system/shape.md`.
- **Standard:** add the file under `base/standards/` **and** register it in
  `base/standards/index.yml` (the lightweight registry — see below).
- **Override:** write `overrides/<STANDARD-ID>.md` with all five required frontmatter
  fields per `overrides/README.md`; `node scripts/check-overrides.mjs` must accept it.
- **Directive doc:** create the markdown file (and `directives/` if absent).

## The registry idea — locatable without bloating context

Knowledge is only useful if it can be found without loading everything into context.
`base/standards/index.yml` is the model: **one short row per item** so a skill can locate it
by ID without reading every doc (Principle 6). Whenever you add a standard, add its row
there. If a directives folder grows past a handful of files, propose a matching
`directives/index.*` in the same spirit — a map, not a second copy of the content.

## Handoffs

- Routed to a skill → hand off to whoever builds it against the skill-system shape spec.
- A standard or override that changes a **principle** → that's a Constitution amendment;
  hand off to `/adr` and the Constitution's Sync-Impact-Report (`docs/CONSTITUTION.MD`).
- Once the file exists, remind the user it must be **committed** to count (an undocumented
  rule does not exist) and that docs travel in the same commit as any code they affect
  (QUAL-002).

## Boundaries

**Green (just do it, after the user approves the shape):**
- Draft and write a new `SKILL.md`, standard, override, or directive doc locally. Creating
  the `directives/` folder if it's the agreed home.

**Ask first:**
- **Always confirm the shape before creating anything** — never silently create governance.
  A new standard or override changes the rules everyone plays by; it must be visible and
  committed, never a quiet edit.
- Creating a new top-level folder (`directives/`) — name it before you make it.

**Never:**
- Invent a rationale the user didn't give, or promote a one-off into a standing rule to look
  thorough (QUAL-006).
- Write an override for a `[hard]` / SECURITY rule — `check-overrides.mjs` refuses it and so
  do you.
- Commit or push on the user's behalf — you prepare the file; the human owns the commit.

**Stop and ask if…**
- you're unsure whether this is a task (→ skill) or a policy (→ standard/directive) — route
  by asking, don't guess.
- the pattern would touch a `[hard]` standard or a Constitution principle — that's an
  amendment, not a quick note; escalate to `/adr`.
- creating it means a new top-level folder or editing `base/standards/index.yml` — confirm
  first, then create.
