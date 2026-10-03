# 11. Scaffolding via agent-run skills + the Angular CLI, no custom schematics in V1

Status: accepted

## Context and Problem Statement

The kit has two recurring scaffolding jobs: adding a design-system component (the
`/new-component` skill's four artifacts — component, registry entry, canonical doc, live
demo) and adding a content entry (the `/new-content` skill — article, glossary entry,
timeline event, or markdown fallback). Both are multi-step and easy to half-finish, which is
exactly what the completeness gates (`check-design-system` forcing registry + doc + live
`@case`; `check-i18n-keys`) exist to catch. The question is *how* the file boilerplate at the
start of those jobs gets produced, and whether the kit should ship its own code generators to
produce it. A second, independent codegen path is the thing to decide on now, before one grows
by habit.

## Decision Drivers

- **One source of the workflow.** The steps of a scaffolding job — and their completeness
  contract — must live in exactly one place, or the two copies drift.
- **Solo-maintainer cost.** Every generator is code to keep in step with framework upgrades
  and with the skills; the kit is maintained by one person.
- **Audience.** The kit's users work *agent-guided* (they ask a skill to do the job), not
  CLI-guided (memorizing generator invocations).
- **Don't rebuild what the framework ships.** Angular already generates standalone components
  configured to this repo's conventions via `angular.json` schematics defaults.

## Considered Options

1. **Custom Angular schematics** — ship a `@vibecore/schematics` collection so
   `ng generate vibecore:component` emits the component *plus* its registry entry, doc stub,
   and demo `@case` in one command.
2. **Nx generators** — the same idea on Nx's generator API, which would also pull the repo
   onto Nx's workspace tooling.
3. **Copier / Cookiecutter templates** — a meta-templating tool renders the artifacts from
   parameterized templates.
4. **Agent-run skills + the built-in Angular CLI.** The skill owns the workflow and the
   completeness contract; for the plain file boilerplate it calls the stock
   `ng generate component` (standalone by `angular.json` default), then fills in the
   registry/doc/demo artifacts the CLI knows nothing about; the gates prove it whole.

## Decision Outcome

**Option 4.** Recurring scaffolding runs through the skills the agent executes, backed by the
hard completeness gates. For the file boilerplate the agent uses the built-in
`ng generate component` — the repo's `angular.json` already defaults components to
`standalone`, `inlineTemplate`, `inlineStyle`, `style: scss`, `type: component`, prefix
`app`, which is exactly the single-file shape the design-system primitives already use — and
then the skill adds the three artifacts (`registry entry`, `canonical doc`, live demo `@case`)
that no schematic knows about. **Deliberately no custom schematics in V1.**

A custom generator (option 1 or 2) would be a *second* encoding of the same workflow, competing
with the skill for the role of "how you add a component" — the exact drift the design-system
gate exists to prevent, now split across a `.ts` generator and a Markdown skill. It is standing
maintenance for a solo maintainer (schematics track Angular's API; the Nx path drags in a whole
workspace tool), and it optimizes for a CLI-driven user this kit does not have — its users ask
the agent. Option 3 (Copier/Cookiecutter) is **meta-templating**, on the kit's own anti-pattern
list: a parallel template language layered over the source, opaque to the gates and to the
agent that has to reason about the result.

The skill-plus-CLI split keeps the mechanical file creation in the tool that already does it
well (the CLI) and the kit-specific, completeness-bearing steps in the one place they are
documented and enforced (the skill + the gates).

## Consequences

- **Good:** one source of the workflow — the `SKILL.md`. There is no generator to keep in step
  with it, so the two cannot drift.
- **Good:** the boilerplate step is stock Angular, configured once in `angular.json`; no kit
  code to maintain across framework upgrades.
- **Good:** the completeness guarantee stays with the gates (`check-design-system`,
  `check-i18n-keys`), which bind the artifacts a bare `ng generate` would leave missing — so
  using the plain CLI cannot ship a half-primitive.
- **Cost:** scaffolding is not a single deterministic command — it is an agent following a
  skill. Someone who wants to scaffold *without* an agent has no one-shot generator; they run
  `ng generate` and then wire the artifacts by hand from the skill and the gate output.
- **Watch / revisit triggers.** Add custom schematics when *either* holds: (a) downstream users
  need to scaffold **reproducibly without an agent**, or (b) the skill's steps become
  **mechanical enough to be deterministic** — at which point a generator stops being a second
  interpretation of the workflow and becomes a faithful compile of it. Until then the skill is
  the single source, and a generator would only fork it.
