<!-- base -->
# orchestration — directive

When one job is too big for a single agent, you become an **orchestrator**: you fan the work
out to sub-agents, then integrate what comes back. This directive is the set of patterns that
keep a fan-out from turning into a pile-up — a batch that overruns context, races on shared
files, corrupts a build, or ships unverified work.

It does **not** cover the git plumbing of a shared tree (that's
[multi-agent-git](multi-agent-git.md)), the safety tiers ([SAFETY](../base/SAFETY.md)), or
how to verify a claim end-to-end ([verification](verification.md)). It's the layer above
those: how to *dispatch and integrate* well.

## Pilot before the batch

Never fire a large batch cold. Dispatch **one** representative job first, wait, and read the
result: is the output shaped as expected, did it stay in its lane, did it trip on something
your instructions didn't anticipate? Fix the instructions from what you learn, *then* release
the rest. A five-minute pilot routinely saves hours of a whole batch making the same mistake.
Note the trap: sub-agents load their instructions **once, at dispatch.** A correction you
make after they start does not reach the ones already running — so harden the brief before
the wave, not after the third failure.

## Waves, not a flood

Concurrency has a ceiling — API limits and shared local resources both bite. Cap parallel
sub-agents around **8–10** and dispatch a large batch in **waves**, not all at once. Weight
the cap by how heavy each job is:

| Job kind | Load per agent | Sensible parallel cap |
|---|---|---|
| Read-only (research, audit, fact-check) | reads only | wide — 8+ fine |
| Read + write to distinct files | light | 8–10 |
| Each spins up a headless browser or hammers a shared dev server | heavy — they oscillate the server | low — ~3 |

If the shared dev server starts flapping (refused → 200 → reset in waves) or several agents
are stuck in the same retry loop, that's overload: **reduce the number of agents**, don't
raise their timeouts.

## Size each job to its context budget

Scope every sub-agent's job so its inputs **plus** its expected output stay comfortably below
its context window — an agent that overflows mid-task stalls or silently truncates. Estimate
the load before dispatch; when unsure, **cut smaller**. A canary run tells you the real token
cost far better than a guess — measure one, then scale. "It finished cleanly" validates the
size; "it stalled" is the signal the job was too big. Splitting also has a side benefit: many
small jobs give clear per-unit progress and isolate a failure to one unit.

## Match the tier to the job

*If your agent can delegate to different model tiers (per sub-agent, or by picking a model
per job), weigh the tier against the work below. If it can't, skip this section — the wave,
budget, and shared-file rules above still apply unchanged.* Which tiers and capabilities your
specific tool actually has is worth writing down once — see
[agent-adaptation](agent-adaptation.md).

Your strongest tier is the wrong default for everything — it's slower and costlier where a
lighter one clears the bar just as well; the cheapest is the wrong default for judgment work.
Sort the work into three roles and match a tier to each:

- **Mechanical breadth** — clearly specified edits, bulk writing/translation, data migration,
  wide mechanical changes → the **cheapest tier that holds the quality bar.**
- **Implementation with judgment** — building a feature, non-obvious fixes → the **middle
  tier.**
- **Concept, review, integration, anything user-visible** — design, planning, adjudicating a
  tricky call, copy, and UI → the **strongest tier available.**

Planning and plan-review in particular default to the strongest tier available — a weak
plan taxes every job downstream of it. And all of these are *defaults*: an explicit user
instruction about tiers or models overrides every rule in this section.

Two laws carry the real weight:

- **Escalate, don't retry the same config.** If a tier misses the bar, redo the job on a
  stronger one — don't re-run it on the same tier hoping for a better draw. Escalating up
  costs less than shipping mediocre work, and a tier is a default, not a ceiling: judge the
  result, not the price.
- **Never put the orchestrator or a verifier on the cheapest tier.** The last line that
  re-checks sub-agent work needs the judgment to catch a plausible-looking failure — this is
  the "distrust self-reports" rule below, applied to tier choice.

## One agent per file; the orchestrator owns the shared things

Give each parallel agent **its own files** so two never write the same one. Anything shared —
a route table, an index/registry, a manifest, a common component — has exactly **one owner**:

- For a shared index or registry, have each agent emit its entry as a **fragment** (into its
  own output), and **you merge the fragments centrally.** Agents never edit the shared file
  directly.
- For a shared component, let **one** agent change it per round; everyone else consumes the
  final API, they don't fork it.

This is a race-avoidance rule, and it dovetails with [multi-agent-git](multi-agent-git.md):
distinct files mean clean, attributable commits.

## Build serially on a shared tree

Parallel builds on one working tree collide — they write the same output artifacts and
corrupt each other. So agents **don't build**; when the batch is done, run **exactly one**
build centrally. And don't trust the build's exit code alone — a build can stop early yet
still exit 0. Read the tail / the verifier output and confirm it actually completed.

## Or: one worktree per agent, merged centrally

When agents must build and test on their own (large refactors, anything whose gate is the
full suite), give each one an isolated git worktree and branch instead of the shared tree.
Then every agent can run the whole Definition of Done without corrupting anyone's output, and
you merge the branches into the main line one at a time. Learned on parallel
fix waves:

- **Start from the current main line.** A fresh worktree can be cut from an older commit;
  have the agent run `git merge --ff-only <main>` first, and check the merge base yourself
  before merging its branch back.
- **Dependencies:** an agent that does not change dependencies shares the main checkout's
  `node_modules` through a link (on Windows a directory junction) and never installs; an
  agent that changes dependencies does a real install in its own worktree. Before removing a
  worktree, remove the link on its own (`rmdir` on the junction, never a recursive delete —
  it can follow the link into the shared tree), then `git worktree remove` without force,
  then `git branch -d` (which refuses anything unmerged).
- **Merge one branch at a time** (`--no-ff --no-commit`), run the gates between merges, and
  resolve the append-only files (`CHANGELOG.md`, the books) with a union of both sides
  (`git merge-file --union` on the index stages) — never by re-deriving them, which
  duplicates entries. Floors that several branches raise (test baselines) are set from a real
  run after the merge, not from either branch's number.
- **Pair new specs with new APIs.** Characterization specs written on one branch stub
  services another branch is changing; after merging both, the suite can pass every test
  and still exit non-zero on unhandled errors. Read the run's error count, not only the
  test count.
- **Budget for interruption.** Usage limits stopped whole waves twice. Agents that commit
  after every green step lose nothing; resume them with their context rather than starting
  over.
- **Keep ownership explicit.** Tell each agent which files belong to a parallel agent and
  are off limits; whatever it had to skip, it lists, and a later wave picks it up.

## Gate anything that could reach production

If a batch produces artifacts that could become publicly visible, keep the main branch
deployable at **every** moment: each new artifact ships **invisible until an explicit
release** — behind a feature flag or a future publish-date, kept out of any sitemap/prerender
until then. Release is a separate, deliberate step. Deploying or publishing is a Red action
that needs an explicit human go-ahead ([SAFETY](../base/SAFETY.md)) — batch automation never
crosses that line on its own.

## Distrust sub-agent self-reports

A sub-agent's "done, verified" is **not evidence.** Agents have repeatedly reported broken
work as verified — a dead result behind a green claim, two "different" outputs that were
identical, a screenshot that proved nothing about a dynamic behavior. As orchestrator you
**re-verify independently** before relaying anything to the user, and you don't parrot the
sub-agent's summary. Verify against a *fresh* environment — a long-running dev server can
serve stale code — and **measure the actual claim** (does the metric really move? does the
thing really render?), not just glance at a still image. The how-to is in
[verification](verification.md); the rule here is simply: *the orchestrator is the last line,
and it checks for itself.*

When you do pass a genuine sub-agent concern up to the user, pass it up **with its reason** —
don't silently drop it, and don't rewrite it into your own words.
