# 7. A generic, indexed directives layer distilled from the source project

Status: accepted

## Context and Problem Statement

The source project accumulated ~200 directives — hard-won playbooks on debugging, verification,
multi-agent git, translation quality, accessibility, and content integrity. Most are welded to
that project (its stack, its domain, its owner, its infrastructure). The kit should inherit the
*transferable* know-how without importing the portal. The question: where does durable
"how we work" knowledge live, given the kit already has a Constitution, standards, and skills?

## Decision Drivers

- Capture the reusable know-how; leave the portal-specific machinery behind.
- Don't duplicate what the Constitution (why), standards (gated *what*), or skills (tasks)
  already say — duplication is future drift.
- The knowledge must be locatable without loading every doc into context.

## Considered Options

1. **Fold it into existing docs** — push the guidance into standards and skills.
2. **Copy the source directives across and scrub them** — keep the ~200, edited.
3. **A curated `directives/` layer** — a small set of generic, layer-`base` directive docs
   (guidance that informs but does not gate), distilled from the source under a dedup gate
   (reference the Constitution/standards, never restate) and a scrub gate (no owner names,
   domains, hosts, vendor model names, or stack specifics), with a machine-checked
   `directives/index.yml` map.

## Decision Outcome

**Option 3.** Twelve directives were distilled (an independent adjudication over a full survey
picked them and merged two pairs), each referencing base docs rather than repeating them, each
scrubbed to generic tier-language. `directives/index.yml` is the map; `verify-harness.mjs` gains
a check that every listed file exists and no directive is left unindexed (an orphan directive is
invisible to an agent reading only the index).

Option 1 overloads standards (which gate) and skills (which are tasks) with a third kind of
thing — guidance — blurring all three. Option 2 imports 200 portal-specific files and their rot;
the value was always in a small transferable core, not the volume.

## Consequences

- **Good:** the kit ships the source project's operating wisdom in generic form — a real
  differentiator — without its baggage.
- **Good:** directives sit cleanly beside the other three doc kinds: Constitution = *why*,
  standard = gated *what*, skill = *task*, directive = *durable how*. The index keeps them
  findable (Constitution Principle 6).
- **Cost:** a fourth doc kind to understand, and a dedup discipline — a directive that drifts
  into restating a standard is a maintenance liability. The dedup gate at authoring time is the
  guard.
- **Watch:** the set should stay small and curated. Growth past a handful of *new* directives
  should go through `/new-directive`, not accretion.
