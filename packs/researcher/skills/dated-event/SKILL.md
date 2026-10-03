---
name: dated-event
description: >
  Date an event properly — find the primary source, quote the sentence that carries the date,
  state the granularity and why it is not finer, cross-reference two or three independent
  sources, and write a vendor-free title. No dating sentence, no date. Run it in researcher mode
  on "wann genau war X" / "date this event" / "Timeline-Ereignis zu X".
layer: pack
capabilitiesUsed: ["content:timeline", "content:source", "file:markdown"]
---

# dated-event — the date is only as good as the sentence that carries it

Your job: produce an event record a timeline can take over — and refuse to produce one when the
date has no evidence. Instructions here are English (for you, the agent); **the record is in the
manifest language** (German in the shipped examples), quotes in the source's own language.

The rule that shapes this job: an agent *knows* thousands of dates and can produce any of them
fluently. None of that counts. Only a sentence in a source counts (R1-B).

## Step 1 — the event, and whether you can fetch

Take the event in a few words, plus — optionally — the category, the importance, and the people
or organizations involved. Say in one line whether you can fetch pages here; if you cannot, ask
for the source and say that the record will stay `[unverified]` until one is read.

## Step 2 — find the primary source

The paper, the announcement, the charter, the release note, the register entry — the document in
which the event *happened*, not the retelling. A secondary source is a cross-reference, not the
basis (R2-A).

## Step 3 — the dating evidence

This is the step the job exists for.

- Find **the sentence or the field that carries the date** and quote it verbatim into
  `datingEvidence`, with the source and your access date.
- Distinguish the dates that get confused: **publication date ≠ submission date ≠ volume year ≠
  the date of the event itself.** Say which one you have.
- State the **granularity** — year, month, day — and, when it is coarse, **why it is not finer**
  ("the issue's publication date was not readable"; "the source gives only the year").
- If you cannot read a carrying sentence, `date` stays empty or coarser, `datingEvidence` says
  what is missing, and the record is **not** offered to a content builder. That is the whole
  rule; there is no "probably" path.

## Step 4 — cross-references and the title

Two or three **independent** sources, preferring those closer in time to the event. Divergence
between them is not resolved here — it goes to `conflict-log`, and the record says so.

The **title** carries the event without a vendor or product name in it
([ADR-0015](../../../../docs/adr/0015-timeline-events-are-dated-facts.md): a title travels alone
through lists and search results, where the context that would justify a name is gone). A vendor
belongs in the body, with a source at each mention. No superlatives, no ranking, no "the first"
unless a source says it — and then it is that source's claim, attributed. Personal names are
free: an event has actors.

## Step 5 — write the record

Fill [`../../assets/templates/dated-event.vorlage.md`](../../assets/templates/dated-event.vorlage.md):
`date` (+ granularity and why), `title`, `description` (two or three sentences: what happened and
why the moment matters), optional `details[]`, `people[]`, `organizations[]`, `sources[]` in the
generic block with at least one primary source, `datingEvidence`, and the confidence.

Read `kit.json` → `capabilities`: with **`content:timeline`** declared and the dating evidence
present, offer to hand the record to the kit's timeline builder — you do not place it, and you
do not invent a category the kit has not shown you; you ask. Without the capability, the record
is the markdown file.

## Step 6 — output

Save to `out/researcher/<slug>.ereignis.md`. Give the exact path and state the date with its
granularity and its evidence in one sentence — or state plainly that there is no date yet.

## Guardrails

Apply the researcher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md). Do not
restate that policy here. The record **must** open with the status line, close with the
confidence, and carry the AI footer. R1-B is this job's boundary and its point.

## Boundaries

- No date without a dating sentence. No rounding, no "circa" that hides an unread source.
- No vendor in the title; no superlative anywhere without an attributed source.
- No category, importance, or tag invented to fill a field — ask, or leave it out.
- Fetching to read is Green; writing to an author or buying access is asked about first.
