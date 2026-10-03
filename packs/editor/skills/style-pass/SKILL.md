---
name: style-pass
description: >
  Read a finished draft against the editorial rules — substance first, then hype, unsourced
  numbers, product names, your own voice, register, term parity, personal data — and return
  findings in the feedback-file format the author works through. It surfaces, it does not
  rewrite. Run it in editor mode on "Stil-Durchsicht" / "review the register" / "read this
  against the rules".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "check:reading-level", "file:markdown"]
---

# style-pass — findings, not a rewrite

Your job: read one text the way a sceptical colleague would and hand back a list of findings
the author can work through — each one quoted, diagnosed, and paired with a concrete
replacement. Instructions here are English (for you, the agent); **the review file is in the
manifest language** (German in the shipped examples), because the author reads it.

The rule that shapes everything here: **surface, don't auto-apply** (`human-gate`). You do not
edit the text. A review the author disagrees with is a good review; a silent rewrite is not.

## Step 1 — know what you are reading against

Read `profile/USER-MANIFEST.MD` → Zone 1 and, if an editor preset is active,
[`../../presets/editor.preset.md`](../../presets/editor.preset.md) for **audience, register
(du/Sie), subject, minimum source tier**. Take the text: `content:article` or
`content:glossary` present → you can read an existing piece from the kit; otherwise ask for it
pasted or pointed at (`file:markdown`). If a term sheet or an Easy variant exists, take those
too — check 8 needs them.

## Step 2 — work the checklist, in this order

The order is deliberate: substance before surface, so a wrong explanation never gets lost in a
list of comma findings.

1. **Substanz.** Is anything simply wrong? Does the analogy contradict the mechanism it
   explains? Does a step-by-step sequence skip a step a reader needs? This is the finding that
   matters most and the one a fluent draft hides best.
2. **Hype.** Count the "revolutionär / bahnbrechend / einzigartig / mühelos" family against the
   anti-hype budget in `translation-quality`. Report the count, not a vibe.
3. **Zahlen ohne Quelle.** Every number, share, ranking, or date in the teaching text either has
   a source or is a finding. "Etwa 70 %" with no source is the same finding as "70 %".
4. **Produktnamen im Lehrtext** ([ADR-0013](../../../../docs/adr/0013-articles-teach-patterns-not-products.md)).
   Replace with the pattern the product stands for, or move into a dated box. For dated events,
   the title rule of [ADR-0015](../../../../docs/adr/0015-timeline-events-are-dated-facts.md)
   applies: vendor in the body, never in the title.
5. **Eigene Stimme.** Take two or three distinctive phrases and search them as exact strings.
   Verbatim hits elsewhere are a finding (E1-C), not a coincidence. In the same pass, mark
   register jumps — an encyclopaedic paragraph inside a warm explainer, or a marketing sentence
   inside either.
6. **Analogie und Bruchstelle.** Every analogy needs its "where this picture breaks". An
   analogy without a limit is a finding even when it is a good analogy.
7. **Ein Wort je Ding, ein Register.** The same thing keeps the same name throughout; `du` and
   `Sie` do not alternate; headings keep one grammatical shape.
8. **Easy-Term-Parität** — only if an Easy variant exists. Does every technical term survive
   into it, explained rather than replaced (A11Y-005, `translation-quality`)? If the kit declares
   `check:reading-level`, run the `kit.json` → `tools` entry that provides it on the Easy variant
   (`--easy`, the variant's `--lang`) and turn each sentence it lists as too long, and for German
   each long compound without a Mediopunkt, into a finding with the rule A11Y-005. Its numbers are
   advice: say so, and never report "leicht genug" on the strength of a score. Absent → judge
   sentence length by eye.
9. **Personen und Daten.** Real people, pupils, colleagues, or customers in examples are a
   finding (PRIV-001); synthetic names are the fix.

## Step 3 — write the findings

Fill [`../../assets/templates/style-review.vorlage.md`](../../assets/templates/style-review.vorlage.md).
Order findings by severity, not by position in the text. Each finding has five parts:

- a checkbox `[ ]` and a number, so the author can tick it off;
- the **quote** — the actual words, short;
- **Problem** — one sentence on what is wrong;
- **Ersatz** — a concrete replacement, written out, not "consider rephrasing";
- **Grund** — the rule it comes from, named (`content-integrity`, ADR-0013, A11Y-005 …).

Checks that produced nothing are reported as such in one line each ("Vendor-Namen: kein
Befund"). A clean result is a valid result — say "genuinely fine" when it is, and do not pad
the list to look thorough. End with an empty **Protokoll** section the author fills while
working through the findings (finding → changed / rejected with reason).

## Step 4 — output

Save to `out/editor/<slug>.review.md`. Give the exact path and lead with the severity picture:
how many findings, how many are substance. Offer the next link in the chain
(`variants-brief` once the findings are worked through).

## Guardrails

Before handing it over, apply the editor guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md).
Do not restate that policy here. The review file carries the **E2-D AI footer** in its review
form (*"Befunde sind Vorschläge, der Autor entscheidet"*). It carries **no E1-B draft stamp** —
it is one of the pack's two report artifacts (with the `release-check` pre-flight), a finding
list about a draft rather than material that could be mistaken for finished content; the
guardrails file records that exemption.

## Boundaries

- You **do not rewrite the text.** Replacements are proposals inside findings.
- You do not check facts against sources — that is the researcher role's `claim-check`. If you
  suspect a fact is wrong, that is a substance finding pointing at the check, not a verdict.
- You do not judge the author's opinions, only the rules the pack and the kit carry.
- Writing the review file locally is Green.
