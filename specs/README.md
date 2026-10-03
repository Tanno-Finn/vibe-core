<!-- base -->

# `specs/` — shaping work before building it

A spec is where a non-trivial piece of work gets **shaped** before code is written: what
we're doing, why, and against which standards. It is _shaping, not exhaustive
documentation_ — a spec that tries to be the manual rots the moment the code moves.

Trivial changes don't need a spec. Reach for one when the work is big enough that you'd
otherwise lose the plot halfway through, or when a decision needs to be recorded.

## Folder convention

One folder per spec, named `YYYY-MM-DD-slug`:

```
specs/2026-08-24-progress-page/
  shape.md        # scope & boundaries: what's in, what's explicitly out, open questions
```

`shape.md` is the only file a spec must have, and for most of the specs here it is the
only file there is. Add more when they earn their place — the five existing specs show the
range:

```
  SPEC.md         # a larger spec that outgrew one shape file (see 2026-07-18-workshop-design-system)
  plan.md         # the approach: steps, sequence, what "done" looks like
  standards.md    # which base standards apply — BY REFERENCE, never copied in full
  references.md   # links to source-of-truth docs, prior art, related specs/ADRs
  tools/          # scripts written for this piece of work (see 2026-09-02-optimus-ui-migration)
  visuals/        # optional: sketches, screenshots, diagrams
```

## Status

Start the spec's main file with a status line so a reader knows at a glance whether they
are looking at live work or a record of finished work:

```
**Status:** in progress · **Date:** 2026-08-24
```

Move it to `implemented` when the work has shipped, and say where it shipped — a stale
`in progress` on finished work tells every new reader the wrong thing.

## The one anti-pattern to avoid

**Don't copy standard text into `standards.md`.** Link to the standard by ID
(`A11Y-003`, `SEC-005`) and let `base/standards/` stay the single source of truth.
A spec that inlines the full rules is a second copy that will silently drift from the
first. Reference, don't duplicate — this is Principle 6 of the
[Constitution](../docs/CONSTITUTION.MD) in practice.

## Open questions

Mark anything unresolved with a greppable `[NEEDS CLARIFICATION: ...]` marker (max 3 per
spec). A spec with open markers is a spec still being shaped; resolve them before the work
is called done.
