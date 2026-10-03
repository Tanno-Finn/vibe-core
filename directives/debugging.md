<!-- base -->
# debugging — directive

How to find the real cause of a bug quickly, and how to write down the ones worth
remembering. The habit this directive fights is jumping to a code fix before you have
looked at whether the *data* is even complete — most "it's broken" turns out to be
"the content is missing". This directive is about *finding* the cause; whether your fix
actually holds is [verification](verification.md)'s job, and the wider judgment about
when to stop and ask sits in [core-principles](core-principles.md).

## Diagnosis order: data before code

Check completeness of the data and content **before** you suspect the code.

A surprising share of "the code is broken" reports are really "an entry is missing" or
"a field is empty". Code that renders a fallback, logs a "not found", or shows a raw
placeholder is often working *correctly* — it is telling you the content is incomplete.
Confirm the inputs exist and are well-formed first; only reach for the code path once the
data is proven whole.

| Step | What you check | Why first |
|---|---|---|
| 1. Content completeness | Are the entries, fields, keys actually present and non-empty? Compare the source that has it against the one that doesn't. | Cheapest to check, most often the cause. |
| 2. Fallback behavior | A fallback firing means the primary source is missing, not that the fallback is broken. | Stops you "fixing" a healthy fallback. |
| 3. The code path | Timing, initialization, wiring — only once the data is proven whole. | Most "technical" bugs dissolve at step 1. |

## Isolate one problem, prove it, verify it

- **One problem at a time.** Name the single thing that is wrong. Don't bundle a second
  suspicion into the same change — you won't know which fix did what.
- **A minimal reproduction.** The smallest input or step that triggers it. If you can't
  reproduce it, you can't claim to have fixed it (that gate lives in
  [verification](verification.md)).
- **Immediate verification.** Change one thing, look at the result, before the next move.

Skip the theater. A broad "systematic analysis" write-up, a dashboard of everything that
*could* be wrong, or a survey of the whole subsystem is not progress when a single
functional fix is what's needed — it is a way of looking busy while avoiding the one test
that would settle it. Isolate, reproduce, fix, verify.

## Debug with your eyes when a UI is involved

If the bug touches something a person sees, *look at the rendered result* — a screenshot
or the live page — not only the logs. Many defects produce no error at all: a missing
placeholder rendered as a raw key, overlapping elements, a component that silently didn't
mount, broken spacing on a narrow screen. These are invisible to a console and obvious in
a picture. Capture the view, read it, compare it to what should be there. If the kit
declares `check:screenshot`, take the picture with that tool ([kit-tools](kit-tools.md)).

The inverse trap is a page that looks *right* and is dead. An Angular inline template is a
template literal, so a backtick typed into the template content — most easily inside an
HTML comment quoting a binding, the way one quotes code in Markdown — closes the literal
early and leaves the file unparseable. `ng serve` then keeps serving the last good bundle:
the browser shows a healthy page while every edit since goes nowhere. The decorator's other
inline literal, `styles:` (bare or as a `styles: [ … ]` array), breaks the same way, most
easily from a backtick inside a CSS comment. If a change refuses to appear, suspect the
bundle before the code, and run `node scripts/check-inline-templates.mjs` (also wired into
`build:verify`), which lexes every `src/**/*.ts` and names any template or styles literal
that terminates early.

## Theoretical validation is not real validation

The trap: building a tool to *detect* the problem instead of just looking at the problem.
A monitoring harness, a static analyzer, a "validation framework" you wrote to avoid
opening the actual thing — these give you sophisticated guessing, not evidence. Static
analysis that never touches the running system will confidently miss defects a person
sees on the first real load.

So: verify in the real runtime. Open the actual page, exercise the actual flow, read the
actual console. If your check didn't run the thing a user runs, it hasn't validated
anything. (This is the same standard [verification](verification.md) sets for signing off
a change — honest outcomes over comfortable ones, `[QUAL-007]`.)

## The postmortem: for lessons worth keeping

Not every bug earns a write-up. When one was costly, non-obvious, or likely to recur,
record it so the next person (or the next you) skips the dead ends. Keep it short and
structured:

1. **Symptoms** — what was observed, exactly. The error, the wrong output, the missing thing.
2. **Failed approaches** — what you tried that *didn't* work, and why. This is the most
   valuable part; it stops the reader repeating your dead ends.
3. **Root cause** — what actually caused it, stated plainly (not the symptom, the cause).
4. **Solution** — what fixed it, and why that addressed the root cause.
5. **Prevention** — the change in habit, check, or code shape that stops a recurrence.
6. **Meta-reflection** — what this says about how the work is done: the assumption that
   was wrong, the check that would have caught it sooner.

Write postmortems into the append-only diary (`JOURNAL.md`), the same place ongoing work
is logged — one growing, searchable record. Don't invent a separate taxonomy or category
system to file them under; a dated entry in the journal is enough, and it stays findable.
