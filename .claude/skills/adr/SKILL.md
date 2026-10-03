---
name: adr
description: >
  Record one architecture decision in MADR format — the context, the options, the choice,
  and the consequences — as a small numbered file. Run it when the user says "record a
  decision" / "write an ADR" / "why did we choose X", or when a non-trivial, hard-to-reverse
  technical choice gets made.
layer: base
capabilitiesUsed: []
---

# /adr — record an architecture decision

Your job: capture a real decision honestly and briefly so future-you (or a new model)
understands *why* the project is the way it is — without reconstructing it from code. One
decision per file, small and honest. An ADR explains a choice; it is not a design manual
(Principle 6: shape, don't over-document).

Speak the user's language: read `profile/USER-MANIFEST.MD` → Zone 1 `language`. No manifest
yet? Ask once in a short bilingual line, then continue.

## When an ADR is worth it

Write one when a choice is **consequential and not obvious** — a technology, an architecture
pattern, a trade-off someone will later ask "why did we do that?" about. A trivial or
easily-reversed choice doesn't need one; say so. If a decision changes a **Constitution
principle**, the ADR is necessary *and* triggers the amendment mechanic (see Handoffs).

## The format — MADR

Use the standard MADR sections, in this order. Keep each tight:

1. **Title** — the decision as a short noun phrase (e.g. "Use Angular prerender for SEO").
2. **Context and Problem Statement** — what forces the decision; what's at stake.
3. **Decision Drivers** — the criteria that matter (bullet list).
4. **Considered Options** — the real alternatives (at least two), each named.
5. **Decision Outcome** — the option chosen, in one line, then *why* it beat the others.
6. **Consequences** — good and bad, honestly. What we now accept, what we give up, what to
   watch. Don't hide the downside (QUAL-007).

Draft the shape and read it back before writing the file — get the user's *why* in their own
words for the drivers and the outcome.

## Where it goes — the ADR folder

ADRs live in **`docs/adr/`**. **If that folder doesn't exist yet, create it** and say so —
this ADR is likely the first. Name files with a zero-padded sequence and a slug:
`docs/adr/0001-short-slug.md`. Pick the next free number by looking at what's already in the
folder (start at `0001`). Status line at the top: `Status: accepted` (or `proposed` /
`superseded by 000X`). One decision per file — if you're tempted to record two, write two.

## Handoffs

- **Constitution link:** if the decision changes or expands a principle in
  `docs/CONSTITUTION.MD`, the change isn't done until the **Sync-Impact-Report** block in
  the Constitution lists this ADR among the propagated docs — updated in the *same commit*
  (the amendment mechanic). Hand the amendment itself to a Constitution edit; the ADR is its
  evidence, and cross-link the two.
- **Running record:** add a one-line pointer to the new ADR in `JOURNAL.md` (the running
  journal at the repo root) so the timeline of decisions stays legible.
  If it somehow isn't there, skip it silently — don't create it from here and don't leave a
  dangling reference.
- Decision that also produces a rule or convention → `/new-directive` to capture the rule;
  the ADR says *why*, the standard/directive says *what*.

## Boundaries

**Green (just do it):**
- Create `docs/adr/` if absent and write the numbered ADR file. Local and reversible — tell
  the user the path and number.

**Ask first:**
- Confirm the decision shape (options + chosen outcome + consequences) before writing.
- Marking an older ADR **superseded** — confirm which one and by which, then edit its status
  line forward (a new status, not a deletion).

**Never:**
- Rewrite or delete an existing ADR to change the record — decisions are forward-only; a
  reversal is a *new* ADR that supersedes the old one (same spirit as SEC-003, history is
  append-only).
- Overstate the outcome or bury the downside — the Consequences section is honest or it's
  worthless (QUAL-007).
- Commit or push for the user; you write the file, the human owns the commit.

**Stop and ask if…**
- the decision touches a Constitution principle — it's an amendment with a Semver bump and a
  Sync-Impact-Report entry; don't quietly write just the ADR.
- you'd be recording more than one decision — split it, and ask which to write first.
- you can't state at least two options that were genuinely considered — that's usually a sign
  the decision isn't shaped yet; clarify before recording it.
