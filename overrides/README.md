# `overrides/` — project governance, in the open

A base standard tagged `[overridable]` is a sensible default, not a law of physics. Your
project may have a real reason to relax one. The **only** legitimate way to do that is a
file in this directory.

## The mechanic (two-tier)

An override does **one** thing: it turns the named gate from **blocking → advisory**.

- **Blocking** (default): a `[hard]` failure, or an un-overridden `[overridable]`
  failure, stops the work.
- **Advisory** (after an override): the gate still runs and still reports — as a
  **visible warning** in `/health` and `/status` — but no longer blocks.

An override never turns a gate **off**, and it never silences it in every session — the
warning stays visible in the status surfaces so the decision is never forgotten. An
**undocumented override does not exist**: there is no config flag, no env var, no "just
this once". No file here → gate is blocking. Full stop.

## What cannot be overridden

Everything in [`SECURITY`](../base/standards/SECURITY.md), and any rule tagged `[hard]`
in the other standards. Attempting to override a `[hard]` rule is itself refused. Only
`[overridable]` rules can be relaxed.

## File format

One file per override: `overrides/<STANDARD-ID>.md` (e.g. `overrides/A11Y-005.md`), with
required YAML frontmatter:

```markdown
---
standard: A11Y-005          # the exact ID being overridden (must be [overridable])
rationale: >                # WHY, in your own words — quoted verbatim in /health
  This is an internal admin tool used by two staff members on desktop only;
  an Easy-Language variant would cost effort no user of this tool benefits from.
decided: 2026-07-17         # date the decision was made (YYYY-MM-DD)
decided_by: <name>          # who owns this decision
revisit_after: 2027-01-17   # when to reconsider — an override is a debt, not a deletion
---

Optional longer prose: context, links, what would make us revert this.
```

All five frontmatter fields are required. An override is **active** only when:

- all five fields are present;
- the file is named after its standard (`overrides/A11Y-005.md` names `A11Y-005`);
- the standard exists and is `[overridable]`;
- `decided` and `revisit_after` are real `YYYY-MM-DD` dates;
- `revisit_after` is today or later. On the day after, the override **expires**: it
  relaxes nothing until someone revisits the decision and deletes the file or moves the
  date. An override is a debt, and an expired one has fallen due.

Anything else is invalid (or expired), reported by `node scripts/check-overrides.mjs`
(which then exits 1), and treated as **no override** — the gate stays blocking, and it
says which override file it is not honoring and why.

## Which gates honor which override

Nine of the 26 base rules are `[overridable]`. The gates read overrides through one
module, [`scripts/lib/overrides.mjs`](../scripts/lib/overrides.mjs), which is also what
`check-overrides.mjs` validates with — so the report and the gates cannot disagree. When
an override is active, the gate prints its findings under an `ADVISORY` block that names
the override file, quotes its rationale and its revisit date, and exits 0.

| Standard | Honored by | What turns advisory |
|---|---|---|
| A11Y-005 Easy Language | `scripts/check-content-coverage.mjs` (in `npm run build:prod`) | Only the Easy-Language backlog **regression** (more entries without an Easy-Language file than the recorded baseline). A locale served in the wrong language, a vanished entry or bundle drift still block — those are bugs, not a missing variant. |
| A11Y-005, A11Y-007 | `scripts/check-a11y.mjs` (`npm run check:a11y`) | An axe violation mapped to the overridden rule. **No axe rule maps to either today**, so this override changes nothing in that gate yet; the wiring means a future mapping blocks by default and relaxes only under an override. |
| A11Y-007 reduced motion | — | No scripted check. Reduced-motion behavior is manual review (see `A11Y.md`). |
| QUAL-003 second review | the `/ship` skill (agent judgment) | `/ship` asks for a second review of a non-trivial change; a standing `overrides/QUAL-003.md` is the documented exception it names instead. No script checks reviews. |
| PRIV-002, PRIV-003, PRIV-005 | — | No scripted check. Review and the agent's judgment only. |
| QUAL-004, QUAL-005, QUAL-006 | — | No scripted check. |

An override for a standard with no scripted gate is still the committed, visible
decision — `check-overrides.mjs`, `/health` and `/status` list it — but there is no gate
for it to relax.

**Gates that never honor an override**, because what they enforce is `[hard]` or not a
base standard at all: `check-contrast` (A11Y-004), `lint` and `check-test-baseline`
(QUAL-001: a green build and green tests), `check-i18n-keys`, `check-genericity`, `check-storage-keys`,
`check-language-guide` (which has its own documented opt-out markers),
`check-design-system`, `check-design-guides` and `check-imprint`.

`node scripts/lib/overrides.mjs --selftest` (run by `verify-harness`) proves the
mechanic on a throwaway fixture: without an override the gate blocks, with a valid one it
turns advisory, and an expired, malformed, misnamed or `[hard]` override relaxes nothing.
A new gate that should honor an override calls `applyOverride('<ID>', findings)` and is
listed in `HONOURED_BY` in that module, which the self-test checks.

## Why a directory, not one policy file

A separate directory survives base updates cleanly (nothing here is ever overwritten by
a base upgrade) and reads as what it is: committed project governance, one decision per
file, each with its own history.
