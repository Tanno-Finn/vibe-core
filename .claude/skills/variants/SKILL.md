---
name: variants
description: >
  Generate N genuinely distinct variants of something — copy, a design, an approach — and
  lay them out in a structured comparison so the user can choose with the trade-offs in
  view. Run it when the user says "varianten" / "give me options" / "a few versions of …"
  or is stuck choosing a direction.
layer: base
capabilitiesUsed: ["file:markdown"]
---

# /variants — real options, side by side

Your job: turn one request into **several distinct options** and a **comparison** that
makes the choice easy. The point is a real decision — so the variants have to actually
differ in a way that matters, and the comparison has to show the trade-off, not just list
features. Three near-identical rewordings are a failure of this skill, not a delivery.

Be warm and plain. Explain *why* the options differ so the user learns the axis they're
choosing on, not just which box to tick.

## How to run it

1. **Ask two things first** (in one short turn):
   - **How many?** Default **3** if they don't care. More than ~5 stops being a choice and
     starts being a pile.
   - **Which axes matter?** What should the variants trade off against each other — e.g.
     tone (playful ↔ formal), length, risk, cost, audience, effort. If they're unsure,
     propose 2–3 axes from the request and let them confirm.
2. **Make them genuinely distinct.** Each variant should take a *different real stance* on
   the axes — a different bet, not a synonym swap. If two options would collapse into "the
   same idea, slightly reworded", drop one and find a fresher angle.
3. **Compare compactly.** A table with one row per variant and columns for the axes that
   matter, plus a one-line "best when…". Then a single **recommendation** with the honest
   trade-off you'd be accepting by picking it — and when you'd pick differently.

## Output

Default output is a **`file:markdown`** document — the guaranteed base capability. This
skill falls back to `file:markdown` whenever a richer capability is not declared in
`kit.json`. Suggested skeleton:

```
# Variants — <what> (<n> options)
Axes that matter: <axis A> · <axis B> · <axis C>

## Option A — <name / one-line stance>
<the variant itself, in full>

## Option B — …
## Option C — …

## Comparison
| Option | <axis A> | <axis B> | Best when |
|--------|----------|----------|-----------|
| A      | …        | …        | …         |

**Recommendation:** <which> — <the trade-off you accept by choosing it, and when you'd
choose otherwise instead>.
```

If — and only if — `kit.json` declares a richer capability (e.g. `page:interactive` for a
clickable side-by-side, or `content:article` to publish the chosen variant), you may offer
that as an upgrade *after* the user has seen the markdown comparison. Never assume the
capability is present: check `kit.json` first, and default to the markdown document.

## Boundaries

- Writing the comparison locally is a reversible (Green) action — tell the user where it
  saved.
- Producing the variants is safe; **acting on the chosen one is not this skill's job** —
  hand the winner off to whatever builds or ships it.
- Don't pad to hit the number. If the request only genuinely supports two distinct
  directions, deliver two and say why a third would be filler.
