<!-- base -->
# watch: security — playbook

Secrets and risky doors: whether something is about to leave the project that can never be
taken back. Tuned by `watch.security` in the user manifest — but only in its chattiness;
the level semantics live in [stewardship](../stewardship.md), and real warnings ignore the
level entirely ([SAFETY](../../base/SAFETY.md)).

## Why this matters (the plain-words pitch)

**Software keeps secrets — passwords, access keys — and has doors you can leave open by
accident.**

The most common beginner accident is banal: a key gets published along with the code and
then stands in the open forever. Publishing is one-way. Deleting the line afterwards does
not help, because the old version is still there and anyone who copied the repository in
between still has it — the key has to be replaced at the place that issued it, which
usually means someone's account, someone's bill, someone's data. The good news is that
these mistakes are cheap to avoid and expensive to undo, which is exactly the shape of
problem worth a watchdog that beeps *before*, not after.

The second half is less dramatic and more constant: every package a project installs runs
with full rights while building and ships code to every visitor. That is not a reason to
be afraid of packages. It is a reason to know how many there are, where they came from,
and to notice when the list grows for no stated reason.

## Radar — what trips it

Evidence, not vibes: name the file and line, or the count.

**While working** (fires in the moment, every level — this topic's substance is not
tunable):

- A value with the shape of a credential — an API key, token, connection string, private
  key — appears in a file that is tracked, or in a commit that is about to be made
  (SEC-001). This is an incident, not a lint warning: say it at once, never repeat the
  value itself, and treat the credential as burned.
- A `.env` file with real values is created or staged. A `.env.example` with placeholders
  is the one allowed shape.
- Content-derived strings reach the page as markup: an `innerHTML` binding, a
  `bypassSecurityTrust*` call, anything in the `eval` family. Each needs a written reason
  why its input cannot carry hostile markup, or it gets a different implementation.
- A URL pointing at an external host is added under `src/`. The kit ships with **zero**
  external requests; every new one ends that property and is a finding on its own —
  privacy as much as security.
- A command is proposed that is hard to undo, reaches outside the project, or hands data
  to something the user has not chosen.

**At natural pauses** (accumulate, raise at a pause, `normal` and above):

- Dependencies moved and the lockfile gained packages nobody asked for — the count and the
  names, as a question rather than background noise.
- Known advisories in what ships to a browser, separated from advisories in build-only
  tooling; both reported, the first prioritized.
- An advisory that was suppressed rather than fixed, or a rule relaxed through
  `overrides/` — a visible decision is fine, an invisible one is the finding.

**On `quiet`:** the routine half goes quiet — dependency staleness, packages with no known
hole, housekeeping. Nothing else moves. A secret, an unsafe command, an external request,
or anything the safety tiers call Yellow or Red is raised at every level, always. This is
the most repeated sentence in the kit and it is not a formality.

## Check-in — how to raise it

The shape, adapted to the moment — never read out as a template:

> *finding, with its location* — `src/app/services/upload.service.ts:22` carries what
> looks like an access key.
> *what it costs, in plain words* — if that lands in a commit it is public for good; the
> key would have to be replaced wherever it was issued, and anything it unlocks is open
> until then.
> *the three options* — I can move it into an untracked environment file and leave a
> placeholder in the code (about five minutes), note it as a task before we publish, or —
> if this is a dummy value — mark it as one so it stops looking like the real thing.
> *then wait.* The user picks.

Cadence follows [stewardship](../stewardship.md): once per topic per session, at a natural
pause, never mid-task — with the standing exception above, where an acute finding
interrupts whatever is happening, because after the commit it is too late. A waved-off
routine nudge goes to `OPEN-QUESTIONS.md` with the reason and does not come back until the
facts change. A waved-off secret does not: it is stated once more, plainly, and recorded.

Before `/ship`, the honest posture for this topic as part of the publish report, at every
level: what was scanned, what was found, what the user chose to accept.

## Paydown — how to actually fix it

The method belongs to [security-workflow](../security-workflow.md) — the audit pipeline
(dependency audit, secret scan including git history, code-pattern sweep, hosting and
transport checklist at deploy time), the report shape, and the re-scan that proves a fix
held. The bar it verifies is [SECURITY](../../base/standards/SECURITY.md) (SEC-001..006,
all hard). This playbook does not restate either: when the radar trips and the user says
"fix it", read that directive and follow it.

## Limits

- **Nothing silent.** Findings are said, fixes are offered, the user decides
  ([stewardship](../stewardship.md)). Upgrading dependencies, removing an integration, or
  rewriting a risky call is never a side effect of an unrelated task.
- **Never quieter than the safety tiers.** No watch level softens a Yellow or Red warning
  ([SAFETY](../../base/SAFETY.md)); this playbook has no mechanism to do so.
- **No security guarantees.** A pass that finds nothing means the scans found nothing, not
  that the project is safe. Say the first, never the second.
- **No claim about what the host does.** Headers, transport, and directory listings are set
  where the site is served, not in this repo. Record what the host actually provides; an
  honest "this cannot be checked from here" beats an assumed protection.
- **Never paste a found secret** — not into the report, not into a commit message, not
  into a chat line quoting the file.
