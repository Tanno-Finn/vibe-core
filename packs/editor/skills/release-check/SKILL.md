---
name: release-check
description: >
  The pre-flight before /ship — one checklist per piece of content (draft stamp, claim list,
  variants, vendor check, related content, date and license, news draft, the kit's own health
  checks) with a status and an evidence line each, ending in "ready" or "not ready: points 2, 7".
  Run it in editor mode on "release check" / "ist das fertig zum Veröffentlichen?" / "what is
  still missing before this goes live".
layer: pack
capabilitiesUsed: ["content:news", "content:article", "content:glossary", "content:timeline", "check:reading-level", "file:markdown"]
---

# release-check — report the state, never create it

Your job: tell the author, point by point and with evidence, what still stands between a piece
of content and publication — and hand over to `/ship`. Instructions here are English (for you,
the agent); **the pre-flight file is in the manifest language** (German in the shipped
examples).

The defining property of this job: **it changes nothing.** It does not remove the draft stamp,
does not set a date, does not flip a flag, does not commit. Every one of those is either a human
act (E1-D, SEC-005) or `/ship`'s business. A red pre-flight is a successful pre-flight.

## Step 1 — collect the scope

Which pieces of content, and which target date. One article, an article plus its glossary
entries, a dated event — whatever is meant to go live together. Read `kit.json` →
`capabilities` to know which of them the kit can actually place, and
[`../../presets/editor.preset.md`](../../presets/editor.preset.md) for `ai_disclosure` (point 6)
and the target languages.

## Step 2 — work the nine points

Fill [`../../assets/templates/release-preflight.vorlage.md`](../../assets/templates/release-preflight.vorlage.md).
Every point gets ✅ / ❌ / — (not applicable) **and an evidence line** — what you looked at, not
what you assume.

1. **Entwurfsstempel.** Is the stamp gone *because a human confirmed the review*? If the stamp
   is still there, this point is ❌ — and you leave the stamp alone (E1-B).
2. **Belege.** Claim list present, no MISSING rows, source map present. Name the open claim ids.
3. **Varianten.** Complete for the kit's configured set (Step 1 of `variants-brief`), or a
   documented override for the Easy-Language requirement (a file under `overrides/`, A11Y-005) —
   an undocumented gap is ❌, not a "—". With `check:reading-level` declared, run its tool on each
   Easy variant (`--easy`) and quote its "Whole text" line as evidence; it is advice, so a long
   sentence it lists is a note for the author, not a ❌ on its own.
4. **Vendor-Check.** No product names in the teaching text (ADR-0013); for dated events, no
   vendor in the title (ADR-0015). Evidence: the `style-pass` finding, or your own read.
5. **Verwandte Inhalte.** Related terms, articles, and events wired — and only to things that
   actually exist. A link to a piece that is still a draft is a finding.
6. **Datum und Lizenz.** Immediate or scheduled, and which; content is the author's own or
   properly quoted (E1-C — the `style-pass` search test is the evidence); the AI-disclosure
   policy from the preset (`drafts` = the footer travels on artifacts only; `published` = the
   published text carries a reader-facing note, and you say whether it does).
7. **News-Eintrag.** Draft it here: type, date, a title, two sentences. With `content:news`
   declared, offer to hand it to the kit's news builder; without it, the text stays in this file
   and a human places it.
8. **Kit-Gates.** Read `kit.json` → `healthChecks` and ask the author to run them (or run them
   if you may) — then **quote the output**. Never write "green" without the line that says so.
   Do not name scripts; the contract names them.
9. **Posture.** Note that `/ship` produces the posture paragraph and the changelog entry — this
   pre-flight does not duplicate them.

## Step 3 — the verdict and the handover

One sentence, unhedged: **"Bereit für `/ship`"** or **"Nicht bereit: Punkte 2, 3"**. Then the
order in which the open points should be closed, because they usually depend on each other
(sources before the human check, human check before the stamp comes off, term sheet before the
translations).

Save to `out/editor/<slug>.preflight.md` and give the exact path.

## Guardrails

Before handing it over, apply the editor guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md).
Do not restate that policy here. The pre-flight carries the **E2-D AI footer** and — like the
`style-pass` review — **no draft stamp**: it is one of the two report artifacts the guardrails
exempt, because a finding list about content is not content. Where the content it reports on
still carries the **E1-B draft stamp**, that is a finding in point 1, and this job never removes
it. E1-D is the boundary of the whole job.

## Boundaries

- No flags, no dates, no commits, no pushes, no publishing — ever, in any variant of the request
  ("just set it to published for me" is a stop with the safe path: "I'll report it as ready, you
  or `/ship` do it").
- No claim that a gate is green without its quoted output.
- The job reports on content it can see. Where it cannot see something (the piece is not in the
  kit yet), the point is "—" with the reason, not a guess.
- Writing the pre-flight file locally is Green.
