<!-- base -->
# watch: tech-debt — playbook

Shortcuts that get expensive later — named as they are taken, tallied, and raised as a
choice at a pause. Tuned by `watch.tech_debt` in the user manifest; the level semantics
live in [stewardship](../stewardship.md), not here.

## Why this matters (the plain-words pitch)

**Building means taking shortcuts constantly — "I'll tidy that later", "I'll copy it for
now" — and that is normal, often right, and only dangerous when nobody is keeping count.**

Shortcuts behave like debt: they carry interest. The longer one sits, the more every later
change costs, until "just add a button" takes a day, because the button touches four
copies of the same thing and two of them have drifted apart. Nobody notices the moment it
tips; it is the twentieth small shortcut, not the first, that turns a morning's work into
a week's.

The point is not a spotless codebase — that is its own waste. The point is that debt is a
*decision*. Debt taken knowingly, with a reason, is fine and often the right call. The
only bad kind is the debt nobody knew about, because it cannot be weighed against anything.
So: name it in one sentence when it is taken, keep the tally, and bring the tally to the
user when there is a natural moment to spend on it.

## Radar — what trips it

Evidence, not vibes: name the file and line, or the count.

**While working** (fires in the moment, `normal` and above — one sentence, never a
lecture, and never a reason to stop the task):

- A shortcut is taken deliberately: a copied block instead of a shared one, a value
  hardcoded that will need to be configurable, a case knowingly left unhandled. Say it as
  it happens, in one line, and note it — a `TODO`/`FIXME` at the spot or a journal line,
  so the tally has an entry with a location.
- A change lands with no test that would fail if the behavior broke, in an area that is
  either load-bearing or freshly changed (QUAL-004).
- A file, component, or function has grown past the point where the next reader will have
  to hold too much in their head at once.
- Documentation is left describing the world the code just left.

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- Three or more entries have piled up around the same spot — that is the signal that the
  spot itself is the finding, not its symptoms.
- The declared-debt inventory has grown: the `TODO`/`FIXME` count and where it clusters.
- A drift check went red or a gate stopped covering what it used to
  (`node scripts/check-doc-drift.mjs`, `node scripts/verify-harness.mjs`).
- Dependencies have fallen far behind their majors — the count and how far, handing
  anything with a known hole to the security topic instead.
- A "for now" from an earlier session has outlived its reason. "For now" has a shelf life.

**On `quiet`:** the in-the-moment sentence stops and the tally keeps running silently, so
nothing is lost. It is brought out at a pause only when the pile-up is real — three
entries on one spot, a red gate, a majors gap — or when the user asks for a health check.

**On `active`:** offer a full maintenance pass at natural pauses even without an acute
finding, as one scheduled, announced piece of work.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its location* — the same card markup now exists in three places
> (`home`, `lessons`, `glossary`), and the three have already drifted apart in spacing.
> *what it costs, in plain words* — every change to a card now has to be made three times,
> and whoever forgets the third one ships an inconsistency nobody sees until a user does.
> *the three options* — I can pull it into one shared component (roughly half an hour,
> the look stays identical), note it as a task for later, or leave it deliberately if
> these three are meant to drift apart anyway.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task, and never as a stowaway inside an unrelated job (QUAL-006). A
waved-off nudge goes to `OPEN-QUESTIONS.md` with the reason and does not come back until
the facts change — debt knowingly kept is a decision and gets recorded as one, not raised
again next session.

Before `/ship`, one short finding as part of the posture report, if the topic is not
`quiet`: how many declared debts stand, where they cluster, whether anything shipping in
this change is knowingly unfinished. Facts, counted. No prognosis.

## Paydown — how to actually fix it

The method belongs to [maintenance](../maintenance.md) — the survey axes (duplication,
dead weight, tests where they matter, dependency staleness, doc drift, declared debt), the
report shape that turns findings into a list the user picks from, and the execution rules
(one finding at a time, smallest change, a checkpoint commit per item so the pass is
abortable with the tree green, tests green after each item, an ADR offered when a
consolidation changes the architecture). This playbook does not restate any of it: when
the radar trips and the user says "fix it", read that directive and follow it.

## Limits

- **Nothing silent.** A maintenance pass is always announced and always a list the user
  picks from ([stewardship](../stewardship.md)). Nobody asked for a weeded garden and got
  their roses refactored.
- **No refactor smuggled into an unrelated task.** Noticing debt while doing something
  else produces a sentence and a tally entry, never an edit.
- **No aesthetic findings.** Priority is the cost of leaving it, multiplied by how
  load-bearing the area is — not how the code makes anyone feel. A style preference with
  no cost attached is not a finding.
- **No coverage fetish.** "Which recently changed or load-bearing behavior has no test
  that would fail if it broke" is the question; a percentage is not.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)), and deletion stays Yellow: checkpoint first.
