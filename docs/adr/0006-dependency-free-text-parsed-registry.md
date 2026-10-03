# 6. A dependency-free, text-parsed component registry

Status: accepted

## Context and Problem Statement

The design system has a self-maintenance gate (`scripts/check-design-system.mjs`) that keeps
the registry, the component tree, the canonical docs, and the live demos in step. The gate
needs to read the registry (`src/app/dev/design-registry.ts`) to know which components are
registered. How the gate reads that file decides how simply it can run in CI.

## Decision Drivers

- The gate must run in CI with no install step and no TypeScript toolchain.
- Reading the registry must not risk executing arbitrary code from it.
- The registry must stay a normal, type-checked TypeScript file for the app.

## Considered Options

1. **Import the registry** — have the gate `import` the `.ts` module and read the array.
   Requires a TS runtime (ts-node / a build) in CI.
2. **A separate data file** (JSON/YAML) as the registry, with the `.ts` generated from it.
   Two sources to keep in sync.
3. **Parse the `.ts` as text** — the gate reads the file as a string and extracts fields by
   regex, under a fixed **parser contract**: each entry keeps field order exactly
   `slug, name, selector, tags, docPath, sourcePath`, every value a single-quoted string
   literal. No execution, no dependency.

## Decision Outcome

**Option 3.** The registry stays one type-checked `.ts` file the app uses normally, and the
gate reads it as text — dependency-free, so it runs in bare CI, and it never executes the file.
The cost is a **parser contract**: the field order and single-quoted-literal shape are load-
bearing, documented at the top of the registry and in the `/new-component` skill.

Option 1 drags a TS runtime into every CI run and executes project code to lint it. Option 2
splits the source of truth in two, inviting the exact drift the gate exists to prevent.

## Consequences

- **Good:** the gate is a single Node file with zero dependencies; CI needs nothing installed.
- **Good:** parsing-as-text can't run code — reading the registry is side-effect-free.
- **Cost:** the parser contract is brittle by nature — reordering fields or using double quotes
  breaks the regex. It is called out loudly in the file header and the skill, and the contract
  changed once already (N5.2: `load` → `sourcePath`) without incident because it was documented.
- **Watch:** if the registry ever needs richer structure than flat single-quoted fields, this
  contract is the thing to revisit — likely by moving to option 2 with a generator.
