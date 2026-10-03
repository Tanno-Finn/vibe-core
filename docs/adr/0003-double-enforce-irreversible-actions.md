# 3. Double-enforce irreversible (Red) actions

Status: accepted

## Context and Problem Statement

The safety model classes every action Green / Yellow / Red, where Red is irreversible or
reaches outside the machine (push, deploy, publish, send, delete data, `git add -A`, killing
shared processes). An agent that takes a Red action on its own can cause harm no revert
undoes. Instructions alone are not enough: a model under load, or a fresh sub-agent that never
read the instruction, can step over a line stated only in prose.

## Decision Drivers

- A single enforcement layer fails silently when the model ignores or never sees it.
- The gate must hold even for a sub-agent spawned without the full context.
- False alarms erode the gate (cry-wolf), so the enforcement must be precise, not blanket.

## Considered Options

1. **Instruction only** — state the Red rules in `SAFETY.md` / `SECURITY.md` and trust the
   agent to follow them.
2. **Hook only** — a `PreToolUse` hook mechanically blocks the dangerous tool calls.
3. **Both, defense in depth** — state the rules in instruction *and* back the hard subset with
   a `PreToolUse` hook; if the two ever disagree, the stricter wins.

## Decision Outcome

**Option 3.** Red prohibitions live in instruction (`base/SAFETY.md` + `SECURITY.md`) and in a
`PreToolUse` hook under `.claude/hooks/`. The hook hard-blocks the irreversible subset (e.g.
`git add -A`, force-push, history rewrites) regardless of what any prompt says.

Option 1 fails the sub-agent case — a spawned worker that never loaded `SAFETY.md` would have
nothing stopping it. Option 2 alone is brittle too: a hook can only pattern-match tool calls,
and can't carry the *reasoning* an agent needs for the Yellow/judgment cases. Only both layers
cover both failure modes.

## Consequences

- **Good:** the hard line holds even when instruction is absent or ignored — the failure mode
  of each layer is covered by the other.
- **Good:** it made a real bug visible during development — the hook caught `git add -A`
  attempts that instruction alone had not prevented in earlier sessions.
- **Cost:** two places to maintain. They can drift; the rule "stricter wins" keeps a
  disagreement safe rather than silently permissive.
- **Watch:** keep the hook's block-list tight to the genuinely irreversible. A hook that blocks
  Green actions would train the user to bypass it — the opposite of safety.

## Amendment — 2026-08-05: the second layer is agent-specific

The decision above is unchanged; this records a limit of it that the original text stated
too broadly.

"Double-enforced" holds **only for agents that load `.claude/settings.json` and run
`PreToolUse` hooks** — today, Claude Code. `AGENTS.md` invites other tools (Copilot,
Cursor, Gemini, and anything else that reads an agent instruction file) to work in this
repo, and for every one of them there is exactly **one** layer: the instruction in
`base/SAFETY.md` and `base/standards/SECURITY.md`. They do not read the hook, and nothing
in this repo can make them.

Two consequences worth being explicit about:

- The sub-agent argument in "Decision Outcome" — that the gate holds for a worker spawned
  without the full context — is true within a hook-running harness and false outside it.
  A non-hook agent that never loaded `SAFETY.md` has nothing stopping it.
- Coverage is narrower than "Red actions" even inside the harness: the hook reads a
  command string and a file path, so SEC-002 and SEC-004 (sending a secret or personal
  data outward) have no second layer at all. The coverage table lives in
  [`base/SAFETY.md`](../../base/SAFETY.md) → "Why doubled".

The instruction layer is therefore the load-bearing one, and the portable one. When a rule
must hold everywhere, it has to be written well enough to work as instruction alone; a
hook is a narrowing of blast radius on one harness, not the guarantee itself.
