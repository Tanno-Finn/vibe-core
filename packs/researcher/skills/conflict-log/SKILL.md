---
name: conflict-log
description: >
  When sources disagree, log it instead of choosing: a position table (value, tier, quote,
  publication date, closeness to the origin, access date), an explicit inference about which
  position sits nearest the origin, a likely explanation of the divergence, a recommendation for
  the wording, and what would close it. Run it in researcher mode on "die Quellen widersprechen
  sich" / "which number is right" / whenever another job finds two values for one claim.
layer: pack
capabilitiesUsed: ["content:source", "file:markdown"]
---

# conflict-log — document the disagreement, don't resolve it

Your job: make a contradiction visible and usable instead of quietly picking a side.
Instructions here are English (for you, the agent); **the log is in the manifest language**
(German in the shipped examples), quotes in the source's own language.

`content-integrity` puts it plainly: *if sources disagree, document the conflict rather than
silently picking a side.* This is the job that does that. It is the smallest job in the pack and
the one that most reliably prevents a wrong number from becoming a portal fact — because the
contradiction is exactly the place where an agent's instinct to be helpful turns into a
fabrication.

## Step 1 — state the disputed claim in one sentence

Not the topic — the **claim**: one value, one date, one attribution. "Wann erschien X?" is a
conflict. "Was ist mit X?" is not. If two things are in dispute, that is two logs.

The input is usually a row handed over by `source-dossier`, `claim-check`, or `dated-event`; it
can also come straight from the user. Say in one line whether you can fetch. With
**`content:source`** declared you may read the kit's existing entries for the sources in dispute
— what the kit already records about them is part of the picture; you do not write anything back.

## Step 2 — the position table

One row per source, with:

| column | what goes in it |
|---|---|
| Quelle | the source id |
| Position | the value, date, or attribution it gives |
| Tier | 1–5 |
| Zitatsatz | the **verbatim** sentence carrying that position, or `—` with the reason it is missing |
| erschienen | the source's own publication date |
| Nähe zum Ursprung | primary · quotes the primary · quotes a secondary · unclear |
| abgerufen | your access date, or the fetch status if you could not read it |

"Closeness to the origin" is the column that does the work. A tier-3 source that quotes the
original is worth more here than a tier-2 source that quotes a tier-3 one.

## Step 3 — the reading, the explanation, the recommendation

- **Einordnung** — which position sits nearest the origin, and why. **Prefix it `Inference:`**
  and keep it prefixed. This is your reasoning, not a finding; the moment it loses the prefix it
  becomes the silent decision the job exists to prevent.
- **Mögliche Erklärung** — the usual suspects, named concretely for this case: volume year versus
  publication date, a definitional difference (what exactly is being counted), rounding, a unit
  change, a typo in a secondary source that everyone then copied, a revised figure superseding an
  earlier one.
- **Empfehlung zur Formulierung** — how the teaching text can say it honestly without pretending
  the dispute is settled: *"nach A: X, nach B: Y — der Unterschied liegt an …"*, or
  *"Größenordnung X; die Quellen weichen ab"*, or a range with a footnote. This is a proposal
  (Constitution Principle 1), and the log says it is one.
- **Offen** — what would actually close it: the page to read, the issue's title page, the
  archive copy, the author's erratum.

## Step 4 — write the log

Fill [`../../assets/templates/conflict-log.vorlage.md`](../../assets/templates/conflict-log.vorlage.md).
Save to `out/researcher/<slug>.widerspruch.md`, give the exact path, and say in one sentence what
the recommended wording is and what would settle it. The log does not create source records; the
sources involved already have them in the dossier they came from, and that is where the
`content:source` handover happens. What the log does add is a reason to keep **all** of them —
including the ones on the losing side of the inference, because a conflict is not a reason to
lose a source.

## Guardrails

Apply the researcher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md). Do not
restate that policy here. The log **must** open with the status line, close with the confidence
and the AI footer. R1-A applies to the table itself: a position you have not read is a row with
`—` in the quote column, not a reconstructed quote.

## Boundaries

- You **do not choose** a position, and you do not present your `Inference:` as a finding.
- You do not delete a source because it looks wrong; a source that is probably mistaken is part
  of the record, and saying *why* it is probably mistaken is the useful part.
- You do not decide for the editorial side. The recommendation is a wording proposal.
- Fetching to read is Green; contacting an author about the discrepancy is Red and is asked
  about first.
