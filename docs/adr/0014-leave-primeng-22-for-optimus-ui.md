# ADR-0014 — Leave PrimeNG 22 over its license change; move to Optimus UI 2

**Status:** accepted · **Date:** 2026-09-02 (decision; analysis 2026-08-27)

## Context

The upgrade of 2026-08-23 (branch `upgrade/ng22-primeng22`) moved the kit from Angular 21 /
PrimeNG 21.1.9 / `@primeuix/themes` 2 to Angular 22 / PrimeNG 22.1.0 / Themes 3. Since then
every run of the kit shows a red "Invalid PrimeUI License" banner bottom-right and logs
`[PrimeUI] PrimeUI license is not configured`. That is not a kit bug: PrimeNG 22 depends on
`@primeui/license-manager`, `providePrimeNG()` calls `verifyLicense()` at bootstrap, and the
banner (a closed shadow root) appears whenever no key is configured
(`node_modules/primeng/fesm2022/primeng-config.mjs`, lines 303–311 in 22.1.0).

The upgrade's own notes do not mention the license at all. The upgrade was
three things at once — Angular 22 (wanted), PrimeNG 22 (the license problem) and Themes 3
(tied to PrimeNG 22) — and only the first was ever discussed.

### The license facts

- PrimeTek moved all new major versions (PrimeNG 22, PrimeReact 11, PrimeVue 5) under the
  "PrimeUI License" and archived the PrimeNG repository. From the announcement
  (<https://primeui.dev/nextchapter>): *"All existing MIT-licensed versions remain MIT
  forever. This change is not retroactive."* and *"PrimeNG LTS will be sunset for new
  sales."* Verified in the npm tarballs on 2026-08-30: `primeng@21.1.9` ships
  "PRIMENG COMMUNITY VERSIONS LICENSE — MIT", `primeng@22.1.0` ships the "PrimeUI License".
- The free **Community License** (<https://primeui.dev/licenses/community>) is limited to
  individuals and organizations under 1 M$ revenue, fewer than 5 developers and 10
  employees, never more than 3 M$ capital raised; non-profits under 1 M$ budget. It
  **explicitly excludes government / public sector, universities, and publicly funded
  institutions.** Keys are per deployer, run 12 months, may not be published or shared.
- The **Commercial License** (<https://primeui.dev/licenses/commercial>) carries an OEM
  clause: *"You may not distribute the Software, in source or component form, so that your
  customers or end users can build their own applications with it."*
- On the question of open-source projects, a PrimeTek maintainer answered in GitHub
  Discussion #4807 (2026-08-15): *"The deployers of the project need to bring-in their own
  license keys whether community or commercial depending on their eligibility."* There is
  no open-source grant.
- The issue "Angular 22 Support" on the archived PrimeNG repo (#19608, 2026-06-04) stayed
  unanswered; PrimeNG 21 will not follow Angular majors.

### Why this collides with the kit

vibe-core is an MIT-licensed starter kit for educational portals — its core audience is
universities, schools, and publicly funded institutions, exactly the group the Community
License excludes. Every fresh clone would show the banner until its deployer obtains a key;
"start in 60 seconds" would be false; the kit's MIT promise would be hollow (free code that
cannot be run without a contract with a third party); and a kit whose design system is a
component registry plus 32 guides about the library sits close to the OEM clause's
"developer SDK" (a gray zone, not a legal opinion). Removing the banner by CSS or script
would violate the license ("may not remove its license mechanisms") and the spirit of
SEC-006.

### Optimus UI

OpenNG (<https://github.com/openng-org/optimus-ui>) forked the last MIT PrimeNG (21) as
`@openng/optimus-ui`, MIT, *"no paid tier and none is planned"*. Measured against npm on
2026-09-02: latest `2.0.2`, license MIT, peers `@angular/core ^22.1.4`; dist-tag `v1-lts`
= 1.0.2 for Angular 21. The API mirrors PrimeNG 21: selectors keep the `p-` prefix, icon
classes keep `pi-`, `@openng/icons` keeps all 318 `.pi-*` classes and changes only the font
family. The project's stated priority is bug fixes and matching Angular majors; features
come from the community. It is young (2.0 shipped two weeks after Angular 22), has a bus
factor of two, no funding model, and inherited 884 open issues from PrimeNG.

### What was measured, not guessed (2026-08-27, worktree on the then-current `master`)

Two throwaway probes on the then-current tree, branch `test/primeng21-ng22`:

| Probe | Commit | build:prod | test:ci | lint | design-guides gate |
|---|---|---|---|---|---|
| A — PrimeNG 21.1.9 under Angular 22 (`--legacy-peer-deps`) | throwaway, not kept | green, 43 routes | 180/180 | 0 | green apart from 2 size overruns that master has since fixed |
| B — Optimus UI 2.0.1 via the migration schematic, on top of A | throwaway, not kept | green, 43 routes | 180/180 | 0 | 24 new errors: every guide cites `primeng-*.mjs` provenance files that no longer exist |

Probe A also established the only four things PrimeNG 21 / Optimus reject from the v22
migration: the lowercase table sub-selectors (`p-sorticon`, `p-tablecheckbox`,
`p-tableheadercheckbox` back to camelCase), `Dialog.ariaLabelledBy` and
`Popover.overlayVisible` as plain reads instead of signal calls, and the TabList
pass-through section `content:` back to `tabList:`. Everything else from the v22 migration
(lowercase selectors, `pButtonIcon`/`pButtonLabel`, `#ref` template names, `inputVariant`)
is accepted as-is.

## Options considered

| | Option | Cost now | Risk | Verdict |
|---|---|---|---|---|
| A | Keep PrimeNG 22, document the Community key | 0 | every adopter needs a key; universities and schools excluded; banner on first clone; OEM gray zone | does not fit the kit |
| B | PrimeNG 21.1.9 pinned, Angular 22 | ~1 day | no security fixes; Angular 23 uncertain; permanent `--legacy-peer-deps` | a bridge, not a destination |
| B+ | Optimus UI 2 | ~2–3 days | bus factor 2, young project, no funding; 884 inherited issues | **chosen** |
| C | Buy a commercial license | money | solves the author's problem, not the adopters' | no |
| D | Remove or hide the banner | — | license violation; against SEC-006 | no |
| E | Angular Material (MIT, Google, CDK already a dependency) | weeks | re-platforming: ~40 modules, 77 files, 49 components, 32 guides rewritten | an open roadmap question, not a decision |

Between 2026-08-30 and 2026-09-01 the plan was B (PrimeNG 21 pinned exactly). Reading the
fork's state again on 2026-09-01 — 2.x already on Angular 22 with clean peers, MIT, the
migration schematic — B+ was chosen on 2026-09-02.

## Decision

**Option B+.** The kit moves from `primeng` / `primeicons` / `@primeuix/themes` to
`@openng/optimus-ui` / `@openng/icons` / `@openng/optimus-ui-themes` (2.x), staying on
Angular 22. The migration happens on the current `master`, not by merging the probes: the
probes are the verified blueprint (the four reverse patterns above and the schematic run),
not the base.

Decided alongside, so nobody re-litigates them:

- **Migration path.** The documented route is `@openng/optimus-ui@1:migrate-from-primeng`
  on a PrimeNG 21 tree, then `ng update @openng/optimus-ui@2`. Our tree is on PrimeNG 22 and
  Angular 22; the 1.x package peers Angular 21, and `ng update` cannot install its temporary
  CLI under this repo's npm allow-scripts policy (journal 2026-08-23). The 2.x schematic is the
  same rewrite and worked in probe B; it is run directly. If it refuses the v22 tree, it is
  run with `--force` (its only check is "PrimeNG ≥ 21 present").
- **Formatting churn is kept out of the semantic commit.** The Angular CLI runs Prettier over
  every file a schematic touches, and 78 of the 80 files that import the library are not
  Prettier-clean on `master`. A format-only commit over exactly those files precedes the
  schematic commit, so the migration diff is import lines and nothing else.
- **Version range.** Caret (`^2.0.2`), not an exact pin. The exact pin planned for option B
  guarded against a relicensed 21.x patch; Optimus is MIT by charter, and its companion
  packages are released as a group that `ng update` moves together.
- **Guide category.** The registry category literal `primeng` (20 guides, the registry type
  union, two scripts, the workshop UI label) is renamed to **`library`** — it names what the
  shelf is (guides about the UI library's primitives), not which library, so a later option E
  would not force this rename again.
- **Provenance citations are re-derived, not renamed.** Optimus 2 is the PrimeNG 21 tree, so
  every cited line number is wrong after a plain path rename. The guides' and articles'
  citations are re-located by matching the cited source line in the new bundle
  (`specs/2026-09-02-optimus-ui-migration/tools/provenance-cites.mjs`); anything without a
  unique match is reviewed by hand. `measured-against` pins move to the installed
  `@openng/optimus-ui@<version>` / `@openng/optimus-ui-themes@<version>`.
- **Prose.** "PrimeNG" stays wherever it is a historical or factual statement (the fork's
  origin, the upgrade journal, changelog entries, "re-verified against PrimeNG 22.1" as a
  past measurement). It is replaced wherever it is a present-tense claim about what the kit
  uses. The distinction is measured, not eyeballed: `tools/classify-references.mjs` sorts
  every mention into import / cite / pin / category / i18n / code-sample / comment /
  historical / prose before anyone edits.

## Consequences

- The banner is gone, `npm install` resolves without `--legacy-peer-deps` or overrides, and
  the kit's MIT promise holds again for its whole audience. The Angular 22 part of the
  August upgrade (builder, TypeScript 6, Node 24 type stripping) is kept in full.
- The kit now depends on a community fork for its UI library. **Fallback if the fork
  stalls:** the kit is then exactly where PrimeNG 21 frozen would leave it — a working, MIT,
  unmaintained library — and option E becomes the plan. The check-in is a rule (decided
  2026-09-02, `directives/dependency-upgrades.md` → Watch list): at Angular 23 stable, measure the
  fork; no release peering on `@angular/core ^23` within 8 weeks → stay on Angular 22 and start
  an option-E probe branch.
- The design system's provenance layer is re-based on the Optimus bundles; the gate
  (`scripts/check-design-guides.mjs`) recognizes the new flat-bundle names through its
  existing package-name rule, so no hand-written exemption list is added.
- Process lesson, recorded as a directive (`directives/dependency-upgrades.md`): before
  building a major upgrade, read the new version's license file and changelog for license
  terms; a license change is a stop-and-ask, not a footnote.
- Not changed by this decision: Angular stays on 22; the public `vibe-core` repository is
  untouched until the migration is merged and released; no component is re-platformed.
