<!-- base -->
# watch: accessibility — playbook

Whether the thing being built works for people who don't use it the way you do. Tuned by
`watch.accessibility` in the user manifest; the level semantics live in
[stewardship](../stewardship.md), not here.

## Why this matters (the plain-words pitch)

**Not everyone operates a website the same way, and a page that only works one way locks
the others out.**

Some people see poorly or not at all and listen to the page through reading software. Some
cannot use a mouse and move through everything with the keyboard. Some need larger text,
stronger contrast, or plainer language. Building for them is not a favor to a small group:
a clear heading structure, honest labels, and good contrast make the page better for
everyone — on a phone in bright sunlight, with a trackpad that keeps skipping, at the end
of a long day.

The reason to think about it while building rather than later is arithmetic. Woven in, it
costs almost nothing: the right element for the job, a real label, a color pair that was
going to be chosen anyway. Retrofitted, it means going back through every screen and
often rebuilding the parts that were done as pictures or as click-only widgets. In this
kit accessibility is the standard, not an add-on — the agent builds it in without asking,
and only speaks up when a *wish* would create a barrier.

## Radar — what trips it

Evidence, not vibes: name the file and line, or the count.

**While working** (fires in the moment, `normal` and above):

- A request would put meaning where reading software cannot reach it: text baked into an
  image, information carried by color alone, a control that exists only as a shape. Say
  it as an offer, not an objection — "the text on that image would be invisible to reading
  software; I'll add it as real text as well, all right?"
- A control that acts is built as something other than a button, or a control that
  navigates as something other than a link; a list that is not a list; a heading level
  skipped (h2 to h4). Same finding as the findability radar — raise it once, not twice.
- A new interactive element cannot be reached by Tab or activated by Enter and Space, or a
  dialog traps focus with no way out (A11Y-001, A11Y-003).
- An icon-only control, an image link, or a form input ships with no accessible name
  (A11Y-002), or a visible label and the accessible name disagree.
- A focus indicator is removed without an equal replacement.
- A new color pair is introduced that has not been through the contrast gate
  (`node scripts/check-contrast.mjs`), or the committed token compilat no longer matches
  what the tokens say — the gate says which pair and by how much.
- Motion is added that ignores `prefers-reduced-motion`, or media autoplays (A11Y-007).

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- Findings of the same kind across several screens — one shared component is usually one
  fix, not eight; report it that way.
- Text that has drifted well past the reading level the project said it wanted.

**Only on `active`:** offer a full audit pass without an acute finding — the manual WCAG
checklist plus the automated scan, as one scheduled piece of work.

**On `quiet`:** the running commentary stops. The building does not: the standard still
applies to everything produced, the gates still gate, and anything that would ship a real
barrier to a real user is still said. `quiet` buys fewer sentences, not a lower bar.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its location* — the three new cards in `home.component.html` open on
> click but cannot be reached with the keyboard.
> *what it costs, in plain words* — anyone who navigates by keyboard, and anyone using
> reading software, simply cannot open them; the content behind them is unreachable, not
> just awkward.
> *the three options* — I can make them real buttons and keep the look identical (about
> ten minutes), note it as a task, or leave it if this screen is a throwaway sketch.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task. A waved-off nudge goes to `OPEN-QUESTIONS.md` with the reason and
does not come back until the facts change.

Before `/ship`, one short finding for this topic as part of the posture report: what the
automated scan covered, what it found, what the manual checklist could not confirm. Facts,
counted — an automated pass catches roughly half of what matters, so never let its silence
stand in for a clean bill.

## Paydown — how to actually fix it

The method belongs to [accessibility-workflow](../accessibility-workflow.md) — the manual
WCAG checklist per surface, the anti-pattern catalog, the three-phase pipeline (scan,
consolidate by shared component, fix in smallest-first packages with the re-scan as
proof), the fix-strategy catalog, and the plain-language rules. The bar it verifies is
[A11Y](../../base/standards/A11Y.md). This playbook does not restate any of it: when the
radar trips and the user says "fix it", read that directive and follow it.

## Limits

- **Nothing silent.** Findings are said, fixes are offered, the user decides
  ([stewardship](../stewardship.md)). Restructuring navigation, rewriting texts, or
  changing a color scheme for accessibility are the user's calls, not side effects.
- **No compliance claims.** A green scan is a green scan, never "this site is accessible"
  or a claim about any legal standard being met. Name what was checked and what was not.
- **No opt-out by watch level.** Turning the topic down turns down the talking, never the
  standard. A documented exception for a throwaway prototype goes through `overrides/`,
  in the open, where the gate warns instead of blocking.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)).
