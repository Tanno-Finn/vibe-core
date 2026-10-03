<!-- base -->
# QUALITY — base standard

"Done" has a definition, and it is the same one every time. This standard is what the
`/ship` gate and the Definition-of-Done line in AGENTS.md point at.

Rules tagged `[overridable]` can be relaxed *in the open* via an
[override](../../overrides/README.md); the gate then warns instead of blocking, never
turns off.

| ID | Rule | Tag | Why (plain language) |
|---|---|---|---|
| QUAL-001 | Nothing is "done" without a green build **and** green tests. A red build is never shipped. | `[hard]` | A red build means something is broken right now. Shipping it moves the break onto the user. |
| QUAL-002 | Documentation travels in the **same commit** as the change it describes. | `[hard]` | Docs updated "later" are docs updated never. Same-commit means the two can't drift. |
| QUAL-003 | A non-trivial change gets a second-set-of-eyes review (a second model or a human) before it ships. | `[overridable]` | A fresh perspective catches what the author is blind to. A one-line typo fix may reasonably skip it — say so. |
| QUAL-004 | New behavior ships with a test that would fail without it. Don't write defensive guards for inputs that can't occur. | `[overridable]` | A test is the proof the behavior works and the alarm when it later breaks. But test the real contract, not imaginary inputs. |
| QUAL-005 | Match the surrounding code: its naming, its idioms, its comment density. Don't introduce a second style. | `[overridable]` | Consistent code is readable code. A file with two styles is harder to change than either style alone. |
| QUAL-006 | Prefer the smallest change that solves the problem. No speculative abstraction, no unrequested scope. | `[overridable]` | Every line is a liability someone maintains. The best code for a small problem is a small amount of code. |
| QUAL-007 | State outcomes honestly: if tests fail, say so with the output; if a step was skipped, say that. | `[hard]` | A false "it works" costs far more than an honest "it doesn't yet". Trust is the whole point of an agent that reports its own work. |

**Definition of Done (the one-liner):** green build + green tests + docs in the same
commit + (for non-trivial changes) a second review. Everything else is detail.
