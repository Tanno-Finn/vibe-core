---
name: status
description: >
  Orient the user — what we're working on, what got done, what's next, and anything that
  needs their attention. Run it when the user says "status" / "/status" / "where are we?".
layer: base
capabilitiesUsed: []
---

# /status — where are we?

Your job: give a non-developer an honest, current picture of the project in **four fixed
blocks, always in this order**. This realizes "the agent keeps the books; the user reads
them" (Constitution Principle 2) — so it must be *true*, not reassuring.

Answer in the user's language (`profile/USER-MANIFEST.MD` → Zone 1 `language`; ask once,
bilingually, if the manifest doesn't exist yet). Concise — a briefing, not a report.

## The four blocks (always, in order)

1. **What are we working on** — the current focus.
2. **What got done** — recent completed work.
3. **What's next** — the immediate next steps.
4. **Anything that needs your attention** — advisory overrides, anything pending that
   needs your go-ahead (e.g. an irreversible/Red step), any failing health check, and
   **what the quiet watch topics have collected** since you last looked (see below).

## The primary-sources-only law

**Build every block ONLY from primary sources. Never invent status from memory or
assumption.** If a source for a block is missing or empty, say that block is **unknown** —
do not guess or fill it with plausible-sounding progress. The sources:

- **The journal** — `JOURNAL.md` (the running record at the repo root). It's the best
  source for blocks 1–3. If a recent session hasn't been journaled yet, treat those
  blocks as thin and fall back to `git log` — don't invent activity to fill them.
- **`OPEN-QUESTIONS.md`** — the parked decisions that are the user's to make (repo root).
  Every entry still in its **Open** section is a block-4 attention item: name the question
  and the agent's default, so the user can settle it or let it ride.
- **`git log`** — recent commits (checkpoint history) for "what got done".
- **`specs/`** — the timestamped shaped-work folders for "what we're working on / next".
- **ADRs** — decision records in `docs/adr/` (canonical; 17 of them today). In a fresh
  clone the folder may not exist yet — tolerate its absence, don't assume it.
- **Overrides** — run `node scripts/check-overrides.mjs`; any active override is an
  advisory item for block 4.
- **Recorded watch findings** — this is the one place they become visible. A topic set to
  `quiet` in the manifest's `watch` block still runs its radar; it simply records instead
  of speaking up during work ([`directives/stewardship.md`](../../../directives/stewardship.md)
  — "How loud each level is"), and `/status` is where the user asked, so this is the moment
  to say it. Read the recorded findings from `OPEN-QUESTIONS.md` (where waved-off and
  quiet-level findings are parked with their topic) and report them **grouped by topic and
  counted, without alarm**: "findability: four pages still have no description · speed: one
  image at 3 MB". Facts, no prognosis, no nagging — and no offer to fix unless they ask.
  If nothing was recorded, say nothing rather than reporting an empty list. Topics at
  `normal` or `active` were already raised in the moment; repeat one here only if it is
  still open.

- **Kit health** — the `healthChecks` in `kit.json` (each has a plain-language
  `description`); a red/failing one is a block-4 attention item. Only run a check if it's
  cheap and safe here — otherwise report the last known state and say it wasn't re-run.

## How to run it

- Gather from the sources above (tolerating the ones that don't exist yet).
- Emit the four blocks in order, each a couple of lines. If a block is unknown, say so
  plainly rather than padding it.
- Keep it short. This orients; it doesn't fix anything.

## Boundaries

- Read-only. Reading sources and running the read-only checks above is a local **Green**
  action — no confirmation needed. This skill never writes, commits, or changes state.
