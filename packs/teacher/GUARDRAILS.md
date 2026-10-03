<!-- pack -->
# Teacher pack — guardrails

The five teacher jobs (`worksheet`, `practice-quiz`, `differentiation`, `cover-lesson`,
`teaching-unit`) all run under these guardrails. They are **not a new safety model** — they
are the [base Green/Yellow/Red model](../../base/SAFETY.md) applied to the one place a
classroom role touches sensitive ground: **children's data and material that could be
mistaken for something a teacher vetted.** Where a guardrail must warn, it uses the *one*
[warning format](../../base/SAFETY.md#the-one-warning-format) — never a new shape.

These tighten, they never loosen. They sit on top of the base standards
[`PRIVACY`](../../base/standards/PRIVACY.md) (PRIV-001/004/006) and
[`SECURITY`](../../base/standards/SECURITY.md) (SEC-004/005) — this file references those
ids, it does not restate them.

Every teacher `SKILL.md` links here and treats the Tier-1 rules as preconditions. They are
checked **before** any work **and again at every turn** — a stop applies just as much when
real data arrives mid-job (a follow-up message, a later paragraph) as when it opens the
job. A guardrail that only looked at the first message would be trivially smuggled past.

---

## Tier-1 — hard stops (🔴 Red, and not approvable inside the pack)

A teacher job **stops** at any of these. It does not proceed, and it does not ask "are you
sure?" — the safe path is offered instead. These map onto the base's hard-forbidden line
(children's data is the highest-sensitivity personal data, PRIV-006 / SEC-004).

| # | Rule | Base id | The safe path offered instead |
|---|---|---|---|
| T1-A | **Student-data stop.** Do not ingest, store, or process real student personal data — a real child's name, grades tied to a named pupil, or health/behavior/SEN notes. | PRIV-006, PRIV-001, SEC-004 | Anonymize (drop names, use "Pupil A/B/C") or use fictional inputs. The job runs unchanged on those. |
| T1-B | **No grading of real work.** Do not assign a mark, grade, or assessment to a real pupil's actual submission — **and removing the name does not lift this.** Anonymization clears T1-A only; a real submission stays ungradeable even stripped of identifiers. | PRIV-006, SEC-005 | Build the mark **scheme / rubric** the teacher applies themselves, or grade a fictional sample answer to demonstrate the rubric. That is the only offer — there is no "anonymize then mark it" path. |
| T1-C | **Draft→checked status.** Every generated material is stamped as an unchecked draft until a teacher reviews it — nothing AI-made may look vetted. | QUAL-007 | Not a refusal — a required stamp. See [Status marker](#the-draft-status-marker) below. |

### Why these are Tier-1

A leaked pupil record cannot be un-leaked, and a mark on a real child's work carries
consequences an agent must never own (SEC-005 — irreversible decisions belong to a human).
T1-C is here because an AI-made worksheet that *looks* finished is a quiet way for unchecked
material to reach a classroom; the stamp makes "not yet checked" impossible to miss.

### When Tier-1 A/B trips — the one warning format

The job stops and responds in the [canonical shape](../../base/SAFETY.md#the-one-warning-format).
Worked example (a teacher pastes a real class list into `differentiation`):

> **What could happen:** I'd be processing what looks like real pupils' names and grades to
> build differentiated tasks. That is children's personal data (PRIV-006 / SEC-004).
> **How bad:** Not reversible — once that data is in my working context and any generated
> file, it can't be recalled. It's the highest-sensitivity category and a legal line.
> **My suggestion:** I'll stop here. Re-send the input with names removed (use "Pupil A, B,
> C…") or with made-up names, and I'll build the exact same differentiation on that. I don't
> need real identities to do this job.

Same shape for T1-B (grading real work): state the outcome, note it's an irreversible
call that belongs to the teacher, and offer the rubric/fictional-sample path. This holds
even if the submission arrives with the name already removed — anonymization clears T1-A,
never T1-B, so "here's the essay without the name, now mark it out of 15" is still a stop.

### The draft status marker

Every material a teacher job outputs carries a visible status line, in the **material's own
language**, at the top of the document:

- German materials (the shipped examples): **`Entwurf, ungeprüft`**
- English materials: **`Draft — unchecked`**

It stays until a teacher confirms they've reviewed the material; only then may it be removed.
This is a stamp on the *output*, not a warning to the user — so it does not use the warning
format, and (being Green — a local, additive edit) it never prompts. A job that would emit a
material without this marker is incomplete.

---

## Tier-2 — proceed with a note (🟡 Yellow)

The job **does** proceed, leaving a plain one-line note (not the full warning shape — Yellow
is a heads-up, not a go/no-go).

| # | Rule | Base id | The note |
|---|---|---|---|
| T2-A | **Copyright.** Don't reproduce copyrighted textbook or source passages verbatim. Produce original material — paraphrase, or build from the kit's own content capabilities. | QUAL-007 | "Built as original material; I didn't copy any source passage — swap in your own excerpts where you have the rights." |
| T2-B | **AI footer.** Generated outputs disclose they were AI-assisted, so a colleague or pupil knows the provenance. | QUAL-007 | A footer line on the material, e.g. `Generated with AI assistance — review before use.` |

The AI footer (T2-B) and the draft marker (T1-C) are complementary: the marker says *not yet
checked*, the footer says *machine-made*. Both travel on the output; neither interrupts.

---

## Where material is saved, and what that means for git

Outputs go to `out/teacher/`, which git **tracks** — the teacher's work is covered by the next
checkpoint commit instead of being lost to a wrong clean-up ([README](./README.md)). Two
consequences, both applications of rules above:

- **Before a commit that includes `out/teacher/`**, look over the new files once for real
  names — a pupil's (T1-A already keeps those out) or a class, school or the teacher's own
  name typed into a header. Real personal data is never committed (PRIV-001): leave that file
  out of the commit, say so, and offer a version with blank name lines.
- **Before any push**, say in the posture report that `out/teacher/` goes with it — once
  pushed to a public repository, the handouts are public, and T2-A copyright applies to them.

---

## Why no extra hook (and where enforcement actually lives)

The base ships a [`PreToolUse` hook](../../.claude/hooks/guard-red-actions.mjs) for Red
actions that are **recognizable from a command string** (force-push, `rm -rf /`, a secret
path). The Tier-1 student-data stop is deliberately **not** added to it.

A hook sees only a tool name and its arguments. Whether a name in a worksheet is a real child
or a fictional "Anna", whether "grade 7" is a pupil's mark or a year group, is a *semantic*
judgment no string match can make. A regex broad enough to catch real pupil data would fire
on ordinary worksheet generation — the word "student", a sample name, a number — and a
guardrail that cries wolf on every job trains teachers to ignore it (see
[cry-wolf prevention](../../base/SAFETY.md#cry-wolf-prevention-a-design-duty-not-a-nicety)).

So Tier-1 lives in **instruction** — this file, checked by each job as a precondition — which
is the honest, low-false-positive layer for a semantic rule. The base hook is untouched. If a
future kit surfaces pupil data through a *named, mechanical* channel (a specific import tool),
that channel is where a clean hook could be added — not a fuzzy scan of free text.
