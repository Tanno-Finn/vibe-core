---
name: ship
description: >
  The Definition-of-Done gate before finishing a piece of work — green build, green tests,
  docs in the same commit (a CHANGELOG entry is the QUAL-002 doc for this change), and a
  second review for non-trivial changes. It prepares and asks; it never pushes, deploys, or
  publishes on its own. Run it when the user
  says "ship it" / "are we done?" / "ready to finish".
layer: base
capabilitiesUsed: []
---

# /ship — the Definition-of-Done gate

Your job: before a piece of work is called "done", walk it through the QUALITY standard's
Definition of Done and tell the user honestly whether it clears the bar. This skill
**prepares** the finish — it does not perform any irreversible or externally-visible step.
Shipping-adjacent actions (push, deploy, publish, make public) are the human's to command
(Constitution Principle 1, SEC-005).

Speak the user's language: read `profile/USER-MANIFEST.MD` → Zone 1 `language`. No manifest
yet? Ask once in a short bilingual line, then continue.

## The gate — walk the QUALITY standard

Definition of Done (`base/standards/QUALITY.md`): **green build + green tests + docs in the
same commit + (for non-trivial changes) a second review.** Check each, in order:

1. **Green build & green tests (`QUAL-001`, `[hard]`).** Run `/health`, or directly the kit
   commands from `kit.json` (`npm run build:prod` and `npm run test:ci`). A red build or
   red tests **stops the ship** — this is hard, not overridable. Show the evidence
   (`QUAL-007`); never claim green you didn't see.
2. **Docs in the same commit (`QUAL-002`, `[hard]`).** Any behavior change carries its doc
   update — README, ADR, standard, or content — staged alongside the code, not "later".
   Check that the docs the change implies are actually present in what's about to be committed.
3. **Second review for non-trivial changes (`QUAL-003`, `[overridable]`).** A non-trivial
   change gets a second set of eyes — a second model or a human — before it ships. A one-line
   typo fix may reasonably skip this; if you skip it, **say so and why** (that's the honest
   version of an override). A genuine, standing exception is an `overrides/QUAL-003.md`.
4. **Smallest honest change (`QUAL-004`–`QUAL-006`).** New behavior has a test that would
   fail without it; the change matches the surrounding style; no unrequested scope crept in.

If any `[hard]` gate is red, stop and report it as red — do not proceed to the CHANGELOG or
suggest finishing. If an `[overridable]` gate is deliberately skipped, note it visibly.

## The CHANGELOG entry

Generate or update a human-readable changelog entry for this change — what changed, in one or
two plain-language lines, in the user's language. The changelog lives at **`CHANGELOG.md`**
(root). **If it doesn't exist yet, create it** (a simple reverse-chronological list, newest
first) and say so — this may be the first entry. Keep entries small and honest; the changelog
is a record the user reads, not a marketing surface. This edit is part of the change and
belongs in the **same commit** (QUAL-002).

## The posture line — before anything goes public

When the finish being prepared is a **publish/deploy** (not just a local "done"), add one
honest posture paragraph before handing over the trigger (`directives/stewardship.md`):
when did a security audit (`directives/security-workflow.md`) and an accessibility audit
(`directives/accessibility-workflow.md`) last run, and what did they leave open? If the
answer is "never", **say exactly that** — an unknown posture is never presented as a clean
one (QUAL-007). Include the deploy-time hosting checklist from the security workflow
(HTTPS, headers) as questions for the user's host. This paragraph informs; it does not
block — the user decides with open eyes.

Every other watch topic that is at `normal` or `active` in the manifest adds **one short,
counted line** to the same paragraph; its playbook under `directives/watch/` says what to
count. Findability, for instance: how many public routes carry their own title and
description, whether the sitemap matches the routes, whether anything meant to be public is
accidentally blocked. Facts, counted, no prognosis and no ranking promise. A topic at
`quiet` contributes nothing here — its findings surface on `/status` instead. The posture
report itself is level-independent: it happens before every publish, whatever the manifest
says (`directives/stewardship.md`).

## Prepare the finish — then hand the trigger to the human

When the gate is green (or its skips are documented), summarize: what passed, what was
skipped and why, and the CHANGELOG line. Then stage the work with explicit paths
(`git add <path>`, never `git add -A`) and confirm the staged set with
`git diff --cached --name-only` so nothing unrelated sweeps in. **Preparing** the commit is
in scope; the actual commit is the checkpoint the user expects — do it if that's the agreed
workflow, but the moment work leaves the machine, it is Red and yours to *ask*, not do.

## Handoffs

- Red build/tests → `/health` for the full diagnosis, fix, then re-run `/ship`.
- A decision surfaced while shipping → `/adr`. A rule worth keeping → `/new-directive`.
- Add a one-line "shipped X" entry to **`JOURNAL.md`** (the running journal at the repo
  root) so the record stays current; if it somehow isn't there, skip it silently — never
  leave a dangling reference and never create it from here.
- Once green and staged, the **push / deploy / publish** step is handed to the human with a
  clear "ready when you are" — see Boundaries.

## Boundaries

**Green (just do it):**
- Run the build/test/health checks (read-only, local). Write or update `CHANGELOG.md`. Stage
  explicit paths and show the staged set.

**Ask first:**
- Making a commit if that's not already the standing checkpoint workflow.
- Overriding `QUAL-003` (skipping review) as a standing policy — that's an `overrides/` file,
  in the open, not a silent skip.

**Never — this skill does not perform Red actions:**
- **`git push`, deploy, publish, release, or make a repo public — ever, autonomously.** These
  are irreversible / externally visible (SEC-005). `/ship` prepares them and *asks*; the human
  gives explicit, informed go-ahead and pulls the trigger.
- Ship past a red `[hard]` gate, or disable/skip a check to force a green (SEC-006, QUAL-001).
- Report "done" when a `[hard]` gate failed or a step was skipped without saying so (QUAL-007).

**Stop and ask if…**
- the build or tests are red — stop; do not proceed to staging or suggest finishing.
- the user says "ship it" meaning *push / deploy / publish* — confirm that Red step
  explicitly and out loud; get an informed go-ahead before anything leaves the machine.
- docs the change requires are missing — flag it; QUAL-002 blocks "done" until they're in the
  same commit.
- the staged set contains files you didn't expect — pause and reconcile before committing.
