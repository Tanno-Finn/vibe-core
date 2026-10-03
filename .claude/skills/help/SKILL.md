---
name: help
description: >
  Explain what this agent can do — lists the available skills in the user's own language.
  Run it when the user says "help" / "/help" / "what can you do?" / "which commands exist?".
layer: base
capabilitiesUsed: []
---

# /help — what can I do here?

Your job: tell the user, in *their* language, which skills are available and what each one
is for — then invite them to pick one. This is often the second thing a new user does after
onboarding, so keep it warm, short, and unintimidating. A map of the doors, not a manual.

## Speak their language first

Read `profile/USER-MANIFEST.MD` → **Zone 1 `language`** and answer in that language. If the
manifest doesn't exist yet (onboarding hasn't run), ask once, in a short bilingual line —
"Welche Sprache möchtest du? / Which language would you prefer?" — then continue in their
answer. Match their register (plain for a beginner, terse for a developer).

## The self-containment law — generate the list, never hard-code it

**The list of skills MUST be generated from the skills actually present. Never hard-code a
fixed list of skills in this file** — a hard-coded list rots the moment a skill is added or
removed. Instead, every time this skill runs:

1. Enumerate the skill folders from **both** skill roots: the base skills at
   `.claude/skills/*/SKILL.md`, and any pack job-skills at `packs/*/skills/*/SKILL.md`
   (a pack like `teacher` adds its own jobs — they are real skills, just layered on).
2. Read each file's frontmatter — its `name` and `description` (and `layer`).
3. Present them from *that* live data. If a new skill (or a pack) appears tomorrow, `/help`
   shows it with zero edits to this file.

## How to run it

- Enumerate and read the frontmatter as above.
- **Translate each `description` live into the user's language** — don't dump the raw
  English frontmatter at them. Shorten it to its trigger ("what this is for"), one line each.
- Present them grouped and short — base skills together, and any active pack's jobs under
  their own heading (e.g. "Teacher jobs") — as a small labeled list (skill name + one-line
  purpose in their language). Skip this `help` skill itself, or list it last; don't pad.
- Close with one warm follow-up line: **"What would you like to do?"** (in their language).

## Boundaries

- Read-only. Reading `SKILL.md` files and the manifest is a local **Green** action — no
  confirmation needed, nothing is written.
- This skill only explains and points. It doesn't run the other skills — once the user
  chooses, hand off to that skill.
