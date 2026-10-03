<!-- base -->
# PRIVACY — base standard

Educational portals are often used by minors and in schools, so the privacy bar is
high by default. Collect the least data that makes the product work, and be honest about
what you collect.

The hard core here overlaps with SECURITY (SEC-004) on purpose — user data is both a
privacy and a security concern. Rules tagged `[overridable]` can be relaxed *in the open*
via an [override](../../overrides/README.md); the gate then warns instead of blocking,
never turns off.

| ID | Rule | Tag | Why (plain language) |
|---|---|---|---|
| PRIV-001 | Never commit real personal data (names, emails, IDs, free-text about identifiable people) to the repo. Use synthetic examples. | `[hard]` | Committed data is permanent and public to everyone with repo access. Synthetic data carries the same lesson with none of the risk. |
| PRIV-002 | Collect only data the feature genuinely needs (data minimization); prefer none. | `[overridable]` | Data you never collect can never leak. A feature with a real need may collect more — state the need explicitly. |
| PRIV-003 | Any analytics or tracking is off by default and, where required, consent-gated; document what is collected and why. | `[overridable]` | People deserve to know and to choose. A purely local, no-network build may not need consent — say so. |
| PRIV-004 | Don't send user content to third-party services without disclosing it to the user. | `[hard]` | "It just goes to an API" is still someone's data leaving the room. Silent exfiltration breaks trust and often the law. |
| PRIV-005 | Store personal data no longer than needed and provide a way to delete it. | `[overridable]` | Indefinite retention is a growing liability. A stateless portal that stores nothing satisfies this trivially. |
| PRIV-006 | **Pack guardrail:** in education contexts, treat pupil data as a hard stop — never auto-process, store, or transmit it without an explicit, informed human decision. | `[hard]` | Children's data is the highest-sensitivity category. The cost of getting it wrong is not recoverable. |

**Note for teacher/education packs:** PRIV-006 is the base hook the Teacher pack tightens
further with its own Tier-1 "pupil-data stop" guardrail.
