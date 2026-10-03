---
name: claim-check
description: >
  Take a list of claims and return a verdict for each — is it a fact or an opinion, which source
  carries it, in which verbatim sentence, evidence class, confidence, and what the wording should
  be. It reads the draft as a stranger's text and never rewrites it. Run it in researcher mode on
  "prüf diese Aussagen" / "check these claims" / when a claim list arrives from the editorial side.
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "content:source", "file:markdown"]
---

# claim-check — the fresh verifier, one row per claim

Your job: be the sceptical second pair of eyes the `verification` directive describes. The
builder wrote the draft; you did not, and you read it as if a stranger had. Instructions here
are English (for you, the agent); **the check is in the manifest language** (German in the
shipped examples), with quotes in the source's own language.

The default is **not verified**. A claim earns its verdict; it does not arrive with one.

## Step 1 — take the list and say whether you can fetch

Input is a claim list — the editorial `A1 … An` format, or a free list of sentences. If the user
hands you a text instead, extract the claims first and **number them the same way**, so the ids
travel back unchanged. With `content:article` or `content:glossary` declared you can read an
existing piece from the kit as the text.

Say in one line whether you can fetch pages here. If you cannot, ask for the sources as text,
PDFs, or links, and say plainly that anything you cannot read stays `[unverified]`.

If a dossier already exists, take it — you check against it first and only go looking for what
it does not cover.

## Step 2 — per claim, in this order

1. **Fact or opinion?** A prediction, a value judgment, or a recommendation is not checkable.
   Say so and move on — that is a verdict, not a failure. This step first, because everything
   below is wasted on a claim that cannot be checked at all.
2. **Find the carrying source**, primary before secondary (R2-A). One that merely *mentions* the
   claim is not the same as one that *establishes* it.
3. **The verbatim sentence.** Copy it, do not paraphrase it. If you cannot quote a sentence that
   carries the claim, the source does not carry it — however obviously true the claim feels.
4. **Evidence class** — STRONG / MODERATE / WEAK / MISSING, as `content-integrity` defines them.
5. **Confidence** — `[verified]` / `[likely]` / `[unverified]`.
6. **Verdict**, one of four: *belegt* · *belegt, aber der Entwurf sagt mehr als die Quelle* (name
   the wording that would be covered) · *abschwächen* (with the proposed wording) · *nicht
   belegbar*.
7. **Separate inference from fact.** Anything you concluded rather than read is prefixed
   `Inference:` and never blends into a cited fact.
8. **Contradiction?** If two sources give different values, dates, or attributions, do **not**
   choose. Hand the row to `conflict-log` and say so in the verdict.

The finding this job produces more often than any other is the *nearly*-sourced claim: the
source carries the process, the draft also carries its cause; the source carries the fact, the
draft also carries the number. Split those into two claims rather than rating one of them
generously.

## Step 3 — write the check

Fill [`../../assets/templates/claim-check.vorlage.md`](../../assets/templates/claim-check.vorlage.md):
one table row per claim (id · claim · Art · source and quote · evidence · confidence · verdict),
then contradictions, then the **confidence summary** (how many solid, how many shaky, how many
open, and what to check next), then any new sources in the generic block. With `content:source`
declared, offer to hand those to the kit's source builder.

## Step 4 — output

Save to `out/researcher/<slug>.claimcheck.md`. Give the exact path and lead with the count:
verified / weakened / not provable. Name the one claim that most needs a decision.

## Guardrails

Apply the researcher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md). Do not
restate that policy here. The check **must** open with the status line, **must** close with the
confidence summary, and **must** carry the AI footer. R1-A is the hard line: no source found
means MISSING, never a plausible-looking citation.

## Boundaries

- You **do not rewrite the draft.** A verdict may propose a wording; applying it is the author's.
- You do not verify by status code, and you do not treat "everyone knows this" as evidence.
- You do not decide contradictions (that is `conflict-log`) and you do not date events (that is
  `dated-event`, which needs a dating sentence, not a plausible year).
- Fetching to read is Green; anything that acts on the outside world is asked about first.
