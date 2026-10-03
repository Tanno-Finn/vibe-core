# 9. A kit-blind pack layer for optional role bundles

Status: accepted

## Context and Problem Statement

The base agent-system is universal; a given kit is one product. But some capability is neither —
it's a *role or workflow* bundle that only some users want (a teacher's worksheet/quiz jobs, say).
Baking that into the base bloats every install; baking it into the kit welds it to one product.
Where does optional, role-specific capability live, and how does it attach without assuming the
kit's internals?

## Decision Drivers

- Optional capability must be addable and removable without touching base or kit code.
- A pack must not assume kit internals — it has to degrade gracefully on any conforming kit
  (the same kit-blind discipline the skills already follow).
- Activation should be conversational ("switch to teacher mode"), not a separate install step.
- The contract must be machine-checkable with the repo's dependency-free tooling.

## Considered Options

1. **Put role features in the base.** Every kit carries teacher jobs it may never use.
2. **Put them in the kit.** The feature welds to one product; a second kit re-implements it.
3. **A `packs/` layer with a manifest contract.** A pack declares `layer: pack`, the
   capabilities it needs, and a **fallback** for each; it activates by conversation. A
   dependency-free gate proves each manifest is well-formed and kit-blind.

## Decision Outcome

**Option 3.** `base/pack.schema.json` (mirroring `base/kit.schema.json`) defines the manifest:
`id`, `name`, `layer: pack`, semver, an `activation` block (phrases, no install), and
`capabilities` — each an `{id, fallback?}` over the kit's `file:`/`content:`/`page:` capability
namespace. The **kit-blind rule**: every capability a pack needs must either be provided by the
kit or carry a `fallback` that ultimately resolves to a capability the kit does provide (in
practice `file:markdown`, the floor every kit guarantees). `scripts/check-packs.mjs` (Node core
only, styled on `check-overrides.mjs`) enforces shape *and* that rule, with a `--selftest` that
proves it (a pack needing an absent capability with no fallback → FAIL; with a fallback → PASS).
The gate is wired into `verify-harness.mjs` (check #9) and runs only when `packs/` exists. A
reference `packs/teacher/` skeleton conforms to the contract; its jobs are authored later.

Option 1 taxes every install with unused features. Option 2 makes the feature un-portable —
the exact thing a *kit-blind* layer avoids.

## Consequences

- **Good:** role capability is add/remove-able as a folder, with a machine-checked contract.
- **Good:** the fallback rule forces graceful degradation — a pack can't silently assume a
  capability the kit lacks; the gate catches it before it ships.
- **Good:** conversational activation keeps the user experience install-free.
- **Cost:** a `fallback` is a single hop to a real capability, not a chain (A→B→markdown);
  sufficient for real packs, revisit only if one genuinely needs a chain.
- **Cost/Watch:** no JSON-Schema *validator* runs in CI (the repo is dependency-free) — the
  `$schema` gives editor-time validation, `check-packs.mjs` gives gate-time enforcement, same
  split as kit.schema.json ↔ verify-harness. When packs gain real skills, the harness skill scan
  must extend to `packs/*/skills/**` (it already accepts `layer: pack`).
