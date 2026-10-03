<!-- base -->
# Bookkeeping contract

> The agent keeps the books; the user reads them.

A non-developer must always be able to see where things stand without reading code or
git internals. That is what this contract guarantees. It realizes Constitution
Principle 2 and is what `/status`, `/ship`, and `/adr` build on.

## No repository yet — offer the safety net

Everything below assumes the folder is a git repository. When it isn't — the kit came as a
ZIP download, or someone copied the folder — say so early (onboarding Round 4, or the first
time you would commit) and explain in plain words: *git is a safety net; every step we take
gets saved, and any step can be undone later. It stays on this computer — nothing is
uploaded.* Link [`docs/explanation/what-is-git.md`](../docs/explanation/what-is-git.md) for
the longer version. Then:

- **Git installed, no repository:** offer to create one — `git init`, then a first commit
  of the current state. **Only after an explicit yes**; a vague "sure, whatever" to
  something else is not one. Before the first commit, read `git status --short` and check
  the list for secrets and personal files (the `.gitignore` covers the usual ones); the
  safety hook asks once about staging the whole tree — expected here, since the user just
  agreed. If git has no name configured, ask which name to sign with and set it for this
  folder only (`git config user.name` / `user.email`, no `--global`); a made-up address is
  fine because nothing is sent anywhere.
- **Git not installed:** explain how to get it for *their* OS and let them install it —
  Windows: the installer from <https://git-scm.com/downloads/win> (or
  `winget install --id Git.Git -e`); macOS: `xcode-select --install`; Linux: the package
  manager (`sudo apt install git` and the like). Installing software is theirs to do.
- **They say no:** respect it, keep working, and don't ask again unprompted. Without a
  repository there are no checkpoint commits, so before a risky step say once that there
  is no way back except a copy of the folder.

## Checkpoint commits (event-based, not clock-based)

Commit at meaningful moments, not on a timer:

- **When something works** (a passing build/test after a real change) — a green
  checkpoint.
- **Before a Yellow or Red step** — so there is always a way back.
- **At session end** — a WIP commit if work is unfinished, clearly marked.

Rules:

- **Commit messages follow the repo's existing history** — same language, same trailer
  habits (this repo's history: English, no trailers). When this doc and the log disagree,
  the log wins (QUAL-005: environment beats documentation). Only in a fresh repo with no
  history yet: body in the user's language, machine data (e.g. `Change-Type:`) as short
  English trailers.
- **Documentation travels in the same commit** as the change it describes (QUAL-002).
- **Rollback is forward-only**: fix a bad commit with a new commit or a `revert`. Never
  rewrite published history, never move a branch ref backwards (SEC-003).
- Stage explicit paths; check `git diff --cached --name-only` before committing.

## The account statement ("Kontoauszug")

After each block of work, a **2–4 line plain-language summary**: what changed, whether
it's green, and what's next. Short enough to read in five seconds. This is the running
receipt the user skims instead of reading diffs.

## JOURNAL.md

The append-only project diary at the repo root. Per working session, **a short section**:
what was done, why, anything that got parked. There is no line count: an entry that
explains *why* costs more lines than one that lists *what*, and is worth them. Write what the
next reader needs; if that is three lines, write three. Append-only (never rewrite past entries), newest at
the bottom, and **not capped**: the journal is history, so it is never shortened, summarized,
or rolled up later; it grows with the project. `/status` reads it as a primary source.

**The books belong to the project, not to the kit.** The kit ships `JOURNAL.md` and
`OPEN-QUESTIONS.md` as empty templates, so that whoever starts from the kit starts their own
history; the curated record of what the kit itself ships is `CHANGELOG.md`.

## OPEN-QUESTIONS.md

The third book, at the repo root, alongside `JOURNAL.md`. Where the journal records the
**past** (what was done) and the CHANGELOG the shipped change, `OPEN-QUESTIONS.md` holds the
**open decisions that are the user's to make** — the questions the agent parked instead of
guessing or blocking on.

The contract:

- **The agent adds an entry** when it reaches a choice it shouldn't make alone (a design
  call, "should X stay this way?") but that needn't halt the work right now. Each entry: a
  date, the question in one line, why it's parked, 1–3 options, and the **default the agent
  will proceed with** if the user doesn't answer — so nothing stalls.
- **Only questions that shape the work** — the same cry-wolf discipline as a Yellow warning.
  A micro-decision the agent can reasonably make itself doesn't earn an entry.
- **Every session: scan it.** Answered questions move to a short "Answered" tail with the
  date and the decision (or are deleted if trivial); if an answer became a lasting rule,
  promote it to an ADR or a directive and leave a one-line pointer.
- **Committed** — it's project knowledge, not personal data (unlike the gitignored profile).
  `/status` reads the Open section as a primary source for "anything that needs your
  attention".

## Session reports & resuming work (only above a threshold)

Long agent sessions get compacted or interrupted; a session report is what survives a
restart. Write one **only** when a session carried enough context that losing it would
hurt — dead ends explored, decisions made, high state. A quick session doesn't earn one;
the journal line is enough.

**Depth is the agent's call.** *Short* (state + next steps) for a simple or time-critical
session; *full* when dead ends, decisions, or high context would otherwise be lost. A full
report names: the mandate, the current state, why things are the way they are, what was
tried and rejected, the open next steps, and the files that matter. Keep reports under a
`reports/` (or similar) folder and, if there is more than one, add a one-line pointer to an
index so the next agent can find the latest — the same "map, not a copy" habit as the
[directives index](../directives/index.yml).

**Loading one is re-orientation, not recap.** When you resume from a report, treat it as a
claim about a past moment, not present truth: re-verify its state against the real
git/filesystem/build before acting on it (a report can be stale). Then propose the next
step — don't narrate what already happened.

## CHANGELOG

Generated/updated at `/ship`, in the user's language, describing the change from the
user's point of view — not a raw commit dump.

## What this is not

Not ceremony. If a rule here ever produces noise instead of clarity for the user, it is
being applied wrong — the goal is a legible trail, not paperwork.
