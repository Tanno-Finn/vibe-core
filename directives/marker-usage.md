<!-- base -->
# marker-usage — directive

A provenance convention for AI-maintained documents: mark each rule as either
**user-mandated** or **agent-recommended**, so that when an agent later edits, tidies, or
"optimizes" the docs, it can never silently overwrite a rule the user set. This is a small
labeling habit with one job — protecting user authority (see [core-principles](core-principles.md)) —
and it has near-zero coupling to any stack. It does not cover *what* to write in a doc,
only how to tag who a rule belongs to.

## The two markers

| Marker | Means | Who may change it |
|---|---|---|
| **[M]** | **Mandated** — the rule came from an explicit user instruction. | Only the user. The agent never adds, removes, or re-words an [M] rule on its own. |
| **[C]** | **Contributed** — the rule is the agent's own recommendation or best practice. | The agent, freely, as experience improves it. |

The distinction is **source, not importance.** [M] does not mean "more important" — it
means "not yours to change". A wise [C] recommendation can matter enormously; it is still
the agent's to revise.

## When to apply each

- Tag a rule **[M]** only when it traces to a direct user command — the user said to do
  it, or not to. When in doubt whether something was user-instructed, it was not: default
  to [C].
- Tag your own analysis, conventions, and "best practice" additions **[C]**.
- Leaving a line unmarked is fine for ordinary prose; the markers earn their keep on
  **rules and requirements**, the lines a future edit might be tempted to "improve".

## What the markers protect against

An agent maintaining its own documentation will, over time, reword and prune it. Without
provenance, a cleanup pass cannot tell "the user insisted on this" from "a past agent
thought this was neat" — and the user's own rule gets quietly rewritten. The markers make
that impossible by making authorship legible:

- Never remove, re-word, or downgrade an **[M]** rule without an explicit user instruction.
- Never *promote* your own idea to **[M]**; that would fake a user mandate.
- Never flip **[M] ↔ [C]** without the user's say-so. If you find a mis-tagged line, ask —
  don't reclassify unilaterally.
- If [M] markers start piling up on agent-generated content, or generic "best practices"
  appear as [M], that is a smell: audit them back to their real source.

This is the same instinct as honest bookkeeping — the agent keeps the books and the user
reads them (Constitution Principle 2, and [base/BOOKKEEPING.md](../base/BOOKKEEPING.md)).
Provenance markers are that principle applied to the rules themselves: the ledger records
not just *what* a rule is, but *whose* it is.
