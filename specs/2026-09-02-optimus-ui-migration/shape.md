# Optimus UI migration (ADR-0014) — shape

**Status:** implemented · **Date:** 2026-09-02

Shipped: `package.json` depends on `@openng/optimus-ui`, `@openng/optimus-ui-themes` and
`@openng/icons`; no `primeng` / `@primeuix` dependency remains.

## What

Replace PrimeNG 22 (+ PrimeIcons, `@primeuix/themes`) with Optimus UI 2 (+ `@openng/icons`,
`@openng/optimus-ui-themes`) on the current `master`, keeping Angular 22, and re-base
everything in the kit that names the library: imports, provider, theme, icon CSS, the
design-system provenance layer (guides, articles, gate scripts, pins), the Impressum's
third-party licence entries, and the prose.

## Why

The licence change in PrimeNG 22 — see [ADR-0014](../../docs/adr/0014-leave-primeng-22-for-optimus-ui.md)
for the facts, the options and the decision.

## How (order is binding)

1. ADR first (this folder's tools + the ADR are the first commit).
2. Snapshot the cited library source lines **before** `npm install` replaces `node_modules`
   (`tools/provenance-cites.mjs snapshot` → `tools/cites.snapshot.json`).
3. Format-only commit over the files the schematic will touch (Prettier churn kept out of the
   semantic diff), then the schematic commit, then the four reverse patterns PrimeNG 21 /
   Optimus reject (probe A in ADR-0014).
4. Design system: gate scripts, category rename `primeng → library`, `measured-against`
   pins, provenance citations re-located (`locate` → `apply`, leftovers by hand), Impressum.
5. Prose sweep by class (`tools/classify-references.mjs`), historical mentions stay.
6. Gates + `build:prod` + `test:ci` + lint; banner check on the prerendered routes.
7. Books: JOURNAL, CHANGELOG, OPEN-QUESTIONS, directive.

## Tools in this folder

| File | Purpose |
|---|---|
| `tools/provenance-cites.mjs` | `snapshot` / `locate` / `apply` — moves bundle+line citations to the Optimus bundles by matching the cited source line, not by arithmetic. |
| `tools/classify-references.mjs` | Sorts every PrimeNG/PrimeUIX/PrimeIcons mention into a class so the prose sweep is sighted by kind. `--kind <class>` prints one class, `--json <file>` dumps all. |
| `references.before.json` | Baseline classification on `master` before the migration (measurement, kept for the account). |
| `tools/cites.snapshot.json` | The cited PrimeNG 22 source lines (the input `locate` matches against). |
| `tools/cites.mapping.json` | `locate`'s result: confident relocations and the review list. |

## Verification (definition of done)

- All repo gates green, `build:prod` with prerender green, `test:ci` green, lint 0.
- `npm install` clean without `--legacy-peer-deps` and without overrides.
- No `p-license-host` / "Invalid PrimeUI License" in the prerendered output; routes with a
  table and with a dialog/tabs render.
- `grep -ri "primeuix\|primeng" package.json package-lock.json` → only justified hits.
- Books and directive updated; working tree clean; nothing pushed.
