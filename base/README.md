<!-- base -->
# `base/` — the foundation

This directory is the **base system**: everything that is true for *every* kit built
on this platform, independent of the concrete tech stack. It knows nothing about any
specific kit — only about the **contract** (`kit.json`, validated by
[`kit.schema.json`](./kit.schema.json)).

## The one rule

> **Base depends on the contract, never on the kit.**
> A base skill may read `kit.json` (commands, capabilities, health checks). It may
> **not** import kit code, assume a framework, or hard-code a file path that only
> exists in this kit. If you catch yourself writing "Angular" or "Optimus UI" inside
> `base/`, it belongs in the kit, not here.

This is what lets the platform grow **additively** (N kits + M packs), never
multiplicatively. A second kit (e.g. a plain-HTML one) reuses `base/` unchanged and
only re-implements the contract.

**Capabilities and tools.** `capabilities` say *what* a kit can do: artifacts it can
produce (`file:`, `content:`, `page:`) and verifications it can run (`check:`, e.g.
`check:a11y`). The optional `tools` array says *how*: each entry names a command (`run`),
the capability ids it `provides`, and a plain-language `description`. A base skill or pack
that needs a capability reads `capabilities`, finds the `tools` entry that provides it, runs
it with `--help` first, and falls back as declared when the capability is absent. It never
hard-codes a tool's path.

## What lives here

| Path | Purpose |
|---|---|
| `kit.schema.json` | JSON-Schema for the kit contract. `kit.json` references it via `$schema` for editor-time validation; `scripts/verify-harness.mjs` checks the required contract fields are present. |
| `standards/` | The four base standards (A11Y, PRIVACY, SECURITY, QUALITY) with stable IDs and `[hard]` / `[overridable]` tags. See [`standards/index.yml`](./standards/index.yml). |

Base skills, hooks, and the bookkeeping/safety model are added in later phases and also
live under `base/`.

## Versioning

`base/` runs on **Semver 0.x** on purpose. The boundary is drawn from day one, but the
abstraction is only *proven* once a second kit exists (the "Rule of Two"). Until then,
breaking changes to the base API are expected and cheap — that is what 0.x signals.

## The `<!-- base -->` / `<!-- kit -->` markers

Files that are composed into a single `AGENTS.md` at build time carry
`<!-- base -->` and `<!-- kit -->` section markers. They make the later extraction of
`base/` into its own package **mechanical** rather than archaeological. Keep base prose
in base-marked sections and kit-specific prose in kit-marked sections, even while
everything still lives in one repo.
