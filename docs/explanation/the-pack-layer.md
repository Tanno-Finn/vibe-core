<!-- base -->
# The pack layer

This kit is built in three layers: **base**, **kit**, and **pack**. The first two are the
foundation and the concrete app. This page is about the third — the optional layer that lets
one kit serve very different users without growing a new copy for each.

## Why packs exist

A single portal often has to wear several hats. The same content — articles, a glossary, a
timeline — is raw material a *teacher* turns into worksheets, a *researcher* turns into a
literature scan, an *editor* turns into a style pass. If every one of those roles were baked
into the kit, the kit would swell with jobs most users never touch, and the ones they do touch
would be buried.

A **pack** is the answer: an optional, self-contained bundle of *task-skills* for one role or
workflow. Install nothing, ship nothing extra by default — activate a pack conversationally
when you need it, ignore it when you don't. The teacher who says *"switch to teacher mode"*
gets the classroom jobs; everyone else never sees them.

## Base, kit, pack — three roles

| Layer | What it is | Depends on |
|---|---|---|
| **base** | The agent operating system — standards, safety, bookkeeping, generic skills. True for *every* kit. | The kit **contract** (`kit.json`) only — never kit code. |
| **kit** | One concrete app: this Angular educational portal, its components, its content builders. | Its own framework and code; fulfills the contract. |
| **pack** | An optional bundle of task-skills for a role (teacher, researcher, …). | The kit's declared **capabilities** — never kit code. |

The through-line is Constitution Principle 5: **each layer depends on the contract of the one
below it, not its internals.** The base already lives by this rule against the kit. A pack
lives by the same rule against the kit's capabilities.

## Kit-blind: the rule a pack lives by

A pack must never assume how a kit is built. It doesn't know it's running on Angular; it
doesn't know a "worksheet" is an HTML component or a PDF. All it knows is what the kit
*declares* it can produce: the `capabilities` list in `kit.json` — coarse, named abilities
like `content:article`, `file:html-print`, `page:interactive`, and the one every kit is
guaranteed to have, `file:markdown`.

Because a pack is kit-blind, it has to answer an obvious question: *what happens when the kit
you're running on doesn't have a capability you wanted?* A pack that simply breaks there has
assumed kit internals through the back door. So the contract requires the opposite:

## Capability fallbacks: degrade, never assume

Every capability a pack declares in its manifest carries a **fallback** — the lesser
capability to use when the one it wanted is absent. A teacher job that would like a
print-ready handout (`file:html-print`) declares a fallback to `file:markdown`: on a kit with
print export it produces the polished handout; on a kit without one it still produces a plain
markdown handout instead of failing. `file:markdown` is the base-guaranteed floor, so it is
the fallback of last resort that always resolves.

This is checked mechanically. `scripts/check-packs.mjs` reads a pack's manifest and the kit's
capability list and refuses any pack that needs a capability the kit lacks *without* a working
fallback — a fallback must itself resolve to a capability the kit actually provides. The
result: a pack either degrades gracefully on a given kit, or it doesn't ship on that kit. It
never breaks halfway through a job because it assumed something that wasn't there.

## Conversational activation, no install

Packs are turned on **in place, by talking** — there is no install step, no config edit, no
separate build. The manifest lists `activation.phrases` (*"switch to teacher mode"*, *"help me
prepare a lesson"*); when the agent hears the intent, it announces the switch and offers the
pack's jobs. Leaving the mode is just as conversational. This keeps the default experience
lean for everyone and makes a role a thing you *step into*, not a thing you have to set up.

## What a pack is made of

A pack lives under `packs/<id>/`:

- `pack.json` — the manifest, validated by [`base/pack.schema.json`](../../base/pack.schema.json)
  and gated by `scripts/check-packs.mjs`. It declares the pack's id, its activation phrases,
  and the capabilities-with-fallbacks its jobs depend on.
- `skills/` — the job-skills, each a `SKILL.md` carrying `layer: pack` frontmatter, in the
  same shape as the base skills under `.claude/skills/`.
- `GUARDRAILS.md` (when a pack touches sensitive ground) — the pack's Tier-1/Tier-2 guardrails
  in the base Green/Yellow/Red model; each `SKILL.md` links to it and checks its Tier-1 rules as
  preconditions. See [`packs/teacher/GUARDRAILS.md`](../../packs/teacher/GUARDRAILS.md).
- a short `README.md` pointing at both.

The contract (schema + gate) is **base-owned**, because kit-blindness is a base principle; the
individual packs are their own thing, added additively — a new pack never edits the base or the
kit, exactly like a new kit never edits the base. That is what keeps the platform growing by
addition, not by multiplication.
