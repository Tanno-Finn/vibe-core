---
name: reading-map
description: >
  Build a reading list in three stages — entry, depth, primary source — of five to twelve items,
  each with a bibliographic block, one sentence of why this one, an access note (free, library,
  paywall) and a confidence label. Run it in researcher mode on "was soll ich zu X lesen" /
  "reading list for …" / "Literaturkarte zu X".
layer: pack
capabilitiesUsed: ["content:glossary", "file:markdown"]
---

# reading-map — what to read, in what order, and why

Your job: tell someone who wants to understand a topic properly what to read first, what next,
and where the thing itself is — the paper, the standard, the original. Instructions here are
English (for you, the agent); **the map is in the manifest language** (German in the shipped
examples).

The order is the deliverable. A flat list of ten titles is a search result; a map says where to
start and what each step buys you.

## Step 1 — the term, the audience, the reach

Take the topic or the term and the audience ("a teacher who wants to understand it themselves",
"a first-semester student", "a colleague from another field"). With **`content:glossary`**
declared, read the existing definition of the term rather than writing a new one — the map is
about what to read, not about what the term means. Read
[`../../presets/researcher.preset.md`](../../presets/researcher.preset.md) for **domain, source
languages, minimum tier**.

Say in one line whether you can fetch. Default reach: five to twelve items.

## Step 2 — the three stages

- **Einstieg** (one to three items, tier 2–3): readable, gives the shape of the field, gets
  somebody from nothing to a working picture.
- **Vertiefung** (two to five, tier 1–2): where the picture gets precise — a good overview
  paper, the official documentation, the standard textbook chapter.
- **Primärquellen / Ursprung** (one to three, tier 1): the paper, the norm, the original that
  everyone else is retelling. This stage is what separates a reading map from a link list.

Per item: the bibliographic block, **one sentence of why it sits here** (not a summary — a
reason), an access note (frei · Bibliothek · Paywall · Archiv), a reading-time estimate
**marked as an estimate**, and a confidence label. Anything you could not open is `[unverified]`
and says so — with what would be needed to reach it.

A crowd-edited wiki appears only under "Sprungbrett, kein Beleg", with a pointer to the primary
sources in its reference list.

## Step 3 — write the map

Fill [`../../assets/templates/reading-map.vorlage.md`](../../assets/templates/reading-map.vorlage.md).
Head: topic, audience, research date, reach. Then the three stages, then the springboard note,
then a short **confidence summary** (which items you actually opened, which are listed on a
catalog entry alone, what the map does not cover). A reading map does **not** emit generic
source records of its own — a recommendation is not evidence. Where an item has been read and
should become a record, say so and point at `source-dossier`, which is where records are
created and where the `content:source` handover happens.

## Step 4 — output

Save to `out/researcher/<slug>.lesekarte.md`. Give the exact path and say in one sentence what
reading the first two items will buy the reader.

## Guardrails

Apply the researcher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md). Do not
restate that policy here. The map **must** open with the status line, close with the confidence
summary, and carry the AI footer. R1-A applies with full force to a reading list, because a list
is where a fabricated title looks most harmless: **list nothing you have not opened or confirmed
in a catalog**, and mark which of the two it was.

## Boundaries

- You do not summarize the works — that is `source-dossier`, with quotes.
- You do not rank publishers, vendors, or authors, and you do not recommend a purchase.
- You do not estimate a reading time as if it were measured; it is a marked estimate.
- Fetching to read is Green; buying past a paywall is not, and is asked about first.
