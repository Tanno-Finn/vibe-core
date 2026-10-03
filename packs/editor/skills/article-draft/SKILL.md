---
name: article-draft
description: >
  Turn notes, a rough text, or a topic into an article draft in a didactic anatomy — entry,
  definition with analogy and its breaking point, steps, comparison, takeaways, self-check —
  plus a numbered claim list that says which sentence still needs a source. Run it in editor
  mode on "draft an article on …" / "Artikel-Entwurf aus diesen Stichpunkten" / "write this up
  as an article".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "file:markdown"]
---

# article-draft — a draft with a shape and an honest claim list

Your job: give the author a draft that a content builder can actually place and a reader can
actually learn from — and that is honest about which of its sentences are not yet backed by a
source. Instructions here are English (for you, the agent); **everything you put in the
artifact is in the manifest language** (German in the shipped examples), because it is on its
way to readers.

Two things make this job different from "write me an article": the **anatomy** (a fixed
didactic shape, not free prose) and the **claim list** (every checkable fact numbered, with its
source or an honest gap marker).

## Step 1 — shape first, then write

Read `profile/USER-MANIFEST.MD` → Zone 1 (`language`, `easy_language`, `reading_level`) and, if
an editor preset is active, [`../../presets/editor.preset.md`](../../presets/editor.preset.md)
for **subject, audience, register, minimum source tier**. Then agree the shape the way
`/new-content` does — the one thing the article should achieve, the audience, the language, the
capability that will place it — read it back in one or two sentences and wait for a yes. Ask
only for what the preset and manifest do not already tell you.

If the author hands you a source dossier or a link list, take it; if they hand you nothing, say
plainly that every factual sentence will carry a gap marker until someone sources it. That is a
usable draft, not a failure.

## Step 2 — see what the kit already has (kit-blind)

Read `kit.json` → `capabilities` and take the richest path:

- **`content:glossary` present** → look up which of your key terms already exist and *link*
  them instead of redefining them. Terms that do not exist yet get listed as "not in the
  glossary yet" so the author can decide (they are candidates for `glossary-entry`).
- **`content:article` present** → the draft can later be handed to the kit's own article
  builder. Offer that at the end; **do not do it yourself** and do not name kit paths.
- **Neither present** → `file:markdown` is the floor: the markdown draft *is* the deliverable.

## Step 3 — write it in the anatomy

Fill [`../../assets/templates/article-draft.vorlage.md`](../../assets/templates/article-draft.vorlage.md).
The anatomy is didactic craft, not a kit internal — a builder can map it onto whatever
components a kit has:

- **Einstieg** — a situation from the reader's day, a few sentences, ending in one sentence of
  what they will be able to do at the end.
- **Definition** per key term, in three parts: an **analogy**, the **precise version**, and
  **where the analogy breaks**. The third part is not optional — an analogy without its limit
  teaches a wrong model that is hard to unlearn.
- **Schrittfolge** — three to six numbered steps, each one sentence of what happens and one of
  why it happens.
- **Vergleich / Abgrenzung** — two things readers reliably confuse, in a small table.
- **Kernaussagen** — three to five sentences a reader should carry away.
- **Selbstcheck** — three questions with the expected answer, rising from recall to transfer.

Match sentence length and vocabulary to the audience and the manifest's `reading_level`. Do not
write the Easy-Language variant here — that is `variants-brief`.

## Step 4 — the claim list

At the end of the draft, number **every checkable factual statement** as `A1 … An` in a table:
claim, source, evidence class. A statement is checkable if someone could look it up and find
you right or wrong; a definition you are stipulating, an analogy, and a didactic aside are not.

- A claim with a source names it and quotes the **verbatim sentence** that carries it.
- A claim without one gets `[Quelle fehlt]` **plus the candidate you would look for**. Never
  invent a source, a DOI, an author, or a date to fill the column (E1-A) — and never soften an
  unsourced claim into vagueness *silently*: mark it, and say in the text what a weaker wording
  would be until it is sourced.
- Mark the claim ids in the draft body (`… [A3]`) so the author can see which sentence is which.

End with the handover line: which claims go to a fact check (the researcher role's
`claim-check`, or the author themselves), and what the text says in the meantime.

## Step 5 — output

Save to `out/editor/<slug>.entwurf.md` (create the directory if needed — it is tracked, see [`README.md`](../../README.md)). Give
the author the exact path, say which capability path you took, and name the two or three claims
that most need a source. Offer the next link in the chain (`source-wiring` if there are sources
to wire, `style-pass` if the text is ready to be read against the rules).

## Guardrails

Before handing it over, apply the editor guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(no invented sources, draft stamp, no third-party text, publishing stays human, AI footer). Do
not restate that policy here. Every draft **must** carry the **E1-B draft stamp**
(`Entwurf, ungeprüft` for German material) at the top and the **E2-D AI footer** at the bottom.
A draft missing either is incomplete.

## Boundaries

- Writing the draft file locally is Green (reversible) — just say where it is.
- This job does **not** create kit files, does not translate, does not write the Easy variant,
  and does not publish.
- Pasted third-party text is a stop, not a source of Kurzinput (E1-C) — ask for the facts, write
  them new, cite the original for the facts.
- Only synthetic names and details in examples (PRIV-001).
