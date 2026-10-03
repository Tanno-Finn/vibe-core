<!-- base -->
# watch: cost — playbook

Money and effort: anything that spends, or can quietly grow into a bill, named before it
happens. Tuned by `watch.cost` in the user manifest; the level semantics live in
[stewardship](../stewardship.md), not here. Spending money is Red territory in
[SAFETY](../../base/SAFETY.md) — no level touches that.

## Why this matters (the plain-words pitch)

**Software projects carry hidden price tags: a hosting plan here, a service with a free
allowance there that starts charging after the trial month — and, when working with an
agent, the work itself, because a large task means many expensive steps.**

None of that is bad if you know it beforehand. A tool that costs four euros a month and
saves an afternoon is a good deal, and nobody needs to agonize over it. What ruins a
project is the surprise on the invoice: the allowance that ran out three weeks ago, the
service that kept billing after the thing it served was abandoned, the "quick"
regeneration of everything that turns out to be the most expensive half hour of the month.

So the rule is not thrift. The rule is that the price is on the table *before* the
decision, with a number where a number can be had and an openly labeled estimate where it
cannot — and that the free-looking option is checked for the meter behind it.

## Radar — what trips it

Evidence, not vibes: name the number and where it came from.

**Before acting** (fires in the moment, every level — this is the topic's substance and it
is not tunable):

- A step is about to be taken that spends money, starts a subscription, or consumes a paid
  allowance. Named beforehand, with the amount and the billing rhythm, and never started on
  the assumption that it was implied.
- A service is about to be adopted whose free tier has a limit: what the limit is, what
  happens at it (a bill, a stop, or throttling), and what the paid step costs. "Free" with
  no answer to those three is a finding.
- A piece of work is about to become large: a batch across many files, a full regeneration,
  a broad audit, a rebuild of every language variant. Say what it will roughly take before
  starting it, and say plainly that the figure is a projection.
- Something recurring is being set up — a domain, a plan, a paid account — with no note of
  what it costs per year and when it renews.

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- The dependency count has grown noticeably (today: 35 runtime and 25 build-time entries in
  `package.json`). Each one is free in money and not free in maintenance — updates to
  follow, breakage to absorb, a build that takes longer every time.
- A paid service is still connected to something the project no longer uses.
- A projection was given earlier and the real figure came in far above it. That is worth a
  sentence on its own: the correction is the useful part, and the next projection starts
  from the measurement rather than from the old guess.
- Build time has grown to where it is a cost in patience — the whole `build:prod` chain
  (content, glossary, i18n bundles, prerender, thumbnails, manifest) runs for every
  publish.

**On `quiet`:** only the smallest hints stop — a dependency more, a slightly longer build.
Everything that actually spends is still announced beforehand, at every level, without
exception. `quiet` never means finding out afterwards.

**On `active`:** additionally give a rough effort projection before any larger package of
work, not only before those that cost money.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *the price tag, with its source* — the map service you want is free up to 20,000 views a
> month; above that it is billed per thousand and needs a card on file.
> *what it costs, in plain words* — for a private page that ceiling is probably out of
> reach, but if a post ever takes off you find out through an invoice, not a warning.
> *the options* — I can use a static picture of the map with a link instead (no account,
> no meter), set it up with the card and note the ceiling somewhere visible, or leave the
> map out for now.
> *then wait.* The user picks.

Two rules of phrasing carry this topic. **Say the number, or say that it is a guess** —
never let a projection wear the clothes of a measurement; write "roughly", write what it
is based on, and correct it out loud once the real figure exists. And **one measurement
beats five estimates**: where a first run can be done and counted, do that one thing, take
the real number, and project from there instead of guessing at the whole.

Cadence follows [stewardship](../stewardship.md) for the accumulating half; the
before-the-fact announcements are not subject to cadence at all — they happen when they
happen, because afterwards they are useless. A waved-off nudge goes to `OPEN-QUESTIONS.md`
with the reason; a decision to accept a recurring cost is recorded there too, with the
amount, so it can be revisited rather than rediscovered.

Before `/ship`, one short finding as part of the posture report: what this project costs to
run per month, what it depends on that could start costing, and which of those the user has
already accepted. Facts, counted. No prognosis.

## Paydown — how to actually fix it

1. **Put the price tag on the table first.** Amount, rhythm, and what triggers the next
   tier — before the step, not after. If no number can be had, say that, and say what the
   estimate rests on.
2. **Measure one unit before running a hundred.** Anything repeated across many items gets
   one item done and counted first; the total is then arithmetic instead of intuition. A
   revision "by feel" after a bad estimate is not a correction — stopping to measure is.
3. **Look for the meter behind "free".** Every free tier has a ceiling and a behavior at
   the ceiling. Write both down next to the decision, and prefer the option where hitting
   the ceiling stops something rather than bills something.
4. **Prefer the version with no account.** A static image instead of a live embed, a file
   shipped with the site instead of a service call, the operating system's typefaces
   instead of a hosted one. It usually costs nothing, adds no meter, and is a privacy win
   in the same move.
5. **Keep the dependency list short on purpose.** Before adding a package, ask what it
   replaces and whether the kit already does it; before keeping one, ask what still imports
   it. The cost is not the download, it is every future update.
6. **Cancel what is no longer used.** Services outlive the features they served. When a
   feature is removed, the account that fed it is part of the removal.
7. **Account after the run.** Put the real figure next to the projection once the work is
   done. That single line is what makes the next projection worth anything.

## Limits

- **Nothing bought silently, ever.** Money is Red in [SAFETY](../../base/SAFETY.md): no
  watch level, no urgency, and no earlier general approval covers a fresh charge. An
  approval covers the priced plan that was described, and nothing beyond it.
- **No financial or contractual advice.** Name the amount, the rhythm, and the ceiling.
  Terms, tax, and what a contract actually obliges are outside what can be answered here.
- **No invented numbers.** A figure is quoted with its source, or it is labeled a
  projection. There is no third option, and a projection is never reported as a finding.
- **No thrift as a value.** The topic is surprise, not spending. Recommending the cheapest
  option regardless of fit is as much a failure as ignoring the bill.
- **No safety-tier changes.** This playbook never softens or triggers a Yellow or Red
  warning ([SAFETY](../../base/SAFETY.md)).
